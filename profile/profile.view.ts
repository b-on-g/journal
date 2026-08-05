namespace $.$$ {

	/**
	 * Plain, unlocalized site name for metadata. Nothing inside meta() may reach
	 * for $mol_locale: the result is read from attr(), and a locale that fails to
	 * load would take the whole page down instead of one line of a social card.
	 */
	const site_name = 'Journal'

	export class $bog_journal_profile extends $.$bog_journal_profile {

		// === Land access =========================================================
		//
		// Giper Baza objects (land, pawn, list) are never returned from @$mol_mem:
		// the atom would own them and run destructor() on graph rebuild, which ends
		// in `yard.forget_land()` → circular subscription. Caching already happens
		// inside `glob.Land()` / `land.Pawn()`.

		/** Root pawn of the journal Land the page shows. */
		author() {
			const str = this.author_link()
			if( !str ) return null
			return this.$.$giper_baza_glob.Pawn( new $giper_baza_link( str ), $bog_journal_model_author )
		}

		/** Land the journal lives in. Rights are per-Land, not per-pawn. */
		author_land() {
			const str = this.author_link()
			if( !str ) return null
			return this.$.$giper_baza_glob.Land( new $giper_baza_link( str ).land() )
		}

		/** Seed for the generated fallback avatar. */
		override author_id() {
			return this.author_link()
		}

		// === Rights ==============================================================
		//
		// Same check as bog/wysiwyg/app: read the current pass's rank in the Land
		// and compare tiers. rule = owner, post = editor, read = viewer.

		@ $mol_mem
		tier(): $giper_baza_rank_tier {
			const land = this.author_land()
			if( !land ) return $giper_baza_rank_tier.deny
			const pass = this.$.$giper_baza_auth.current().pass()
			return $giper_baza_rank_tier_of( land.pass_rank( pass ) )
		}

		@ $mol_mem
		override can_edit() {
			return this.tier() >= $giper_baza_rank_tier.post
		}

		// === Name ================================================================

		@ $mol_mem
		author_name( next?: string ) {
			const author = this.author()
			if( !author ) return ''
			if( next !== undefined ) {
				author.Name( 'auto' )?.val( next )
				return next
			}
			return author.Name()?.val() ?? ''
		}

		override name_shown() {
			return this.author_name() || this.name_fallback()
		}

		name_view() {
			return this.can_edit() ? this.Name_input() : this.Name_label()
		}

		// === Bio =================================================================

		@ $mol_mem
		author_bio( next?: string ) {
			const author = this.author()
			if( !author ) return ''
			if( next !== undefined ) {
				author.Bio( 'auto' )?.val( next )
				return next
			}
			return author.Bio()?.val() ?? ''
		}

		override bio_shown() {
			return this.author_bio() || this.bio_fallback()
		}

		bio_view() {
			return this.can_edit() ? this.Bio_input() : this.Bio_label()
		}

		// === Avatar ==============================================================

		/**
		 * Object URL instead of `$giper_baza_file.uri()`: the latter is a
		 * `?BAZA:file=…` query that only resolves through the offline service
		 * worker, which we do not install here. Reading the blob keeps the image
		 * working on a cold load and on the mam dev server alike.
		 */
		@ $mol_mem
		override avatar_uri() {
			const files = this.avatar_files()
			if( files.length ) return URL.createObjectURL( files[0] )

			const file = this.author()?.Avatar()?.remote()
			if( !file || !file.filled() ) return ''
			return URL.createObjectURL( file.blob() )
		}

		@ $mol_mem
		avatar_files( next?: readonly File[] ) {
			if( next?.length && this.can_edit() ) {
				const author = this.author()
				const link = author?.Avatar( 'auto' )
				const store = link?.ensure( null )
				if( link && store ) {
					store.blob( next[0] )
					// Re-point the atom at the freshly filled pawn, otherwise the
					// file units never make it into the Land diff.
					link.remote( store )
				}
			}
			return next ?? []
		}

		@ $mol_mem
		avatar_preview() {
			try {
				if( this.avatar_uri() ) return this.Avatar_image()
			} catch( error ) {
				if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
			}
			return this.Avatar_icon()
		}

		avatar_upload() {
			return this.can_edit() ? this.Avatar_open() : null
		}

		// === Social links ========================================================

		@ $mol_mem
		links(): readonly string[] {
			return this.author()?.Links()?.items() ?? []
		}

		@ $mol_mem
		link_rows() {
			return this.links().map( ( _, index )=> this.Link_row( index ) )
		}

		link_uri( index: number ) {
			return this.links()[ index ] ?? ''
		}

		link_title( index: number ) {
			return this.link_uri( index ).replace( /^https?:\/\//, '' ).replace( /\/+$/, '' )
		}

		@ $mol_action
		link_drop( index: number, event?: Event ) {
			if( !event ) return null
			const list = this.author()?.Links( 'auto' )
			if( !list ) return event
			list.items( this.links().filter( ( _, i )=> i !== index ) )
			return event
		}

		@ $mol_action
		link_add( event?: Event ) {
			if( !event ) return null
			const uri = this.link_draft().trim()
			if( !uri ) return event
			// Dedupe: an event handler fiber restarts from the top when it suspends,
			// so a plain append could land twice.
			if( this.links().includes( uri ) ) return event
			const list = this.author()?.Links( 'auto' )
			if( !list ) return event
			list.items([ ... this.links(), uri ])
			this.link_draft( '' )
			return event
		}

		link_form() {
			return this.can_edit() ? this.Link_form() : null
		}

		// === Posts ===============================================================

		/**
		 * Post metadata pawns of this journal. Drafts are hidden from visitors —
		 * a cosmetic filter only, the units themselves are in a publicly readable
		 * Land, so nothing secret should live in an unpublished post yet.
		 */
		@ $mol_mem
		posts() {
			const list = this.author()?.Posts()
			if( !list ) return []
			const all = list.remote_list()
			const mine = this.can_edit()
			return all.filter( post => mine || post.published() )
		}

		/** Drafts first, then published newest-first. */
		@ $mol_mem
		posts_sorted() {
			return this.posts().slice().sort( ( a, b )=> {
				const left = a.Published()?.val() ?? 0
				const right = b.Published()?.val() ?? 0
				if( !left && !right ) return 0
				if( !left ) return -1
				if( !right ) return 1
				return right - left
			} )
		}

		@ $mol_mem
		posts_filtered() {
			const query = this.posts_query().toLowerCase().trim()
			const all = this.posts_sorted()
			if( !query ) return all
			return all.filter( post => {
				const title = ( post.Title()?.val() ?? '' ).toLowerCase()
				const summary = ( post.Summary()?.val() ?? '' ).toLowerCase()
				return title.includes( query ) || summary.includes( query )
			} )
		}

		@ $mol_mem
		post_rows() {
			return this.posts_filtered().map( ( _, index )=> this.Post_row( index ) )
		}

		post_record( index: number ) {
			return this.posts_filtered()[ index ] ?? null
		}

		post_title( index: number ) {
			return this.post_record( index )?.Title()?.val() || this.post_new_title()
		}

		post_summary( index: number ) {
			return this.post_record( index )?.Summary()?.val() ?? ''
		}

		post_draft( index: number ) {
			return !this.post_record( index )?.published()
		}

		post_state( index: number ) {
			return this.post_draft( index ) ? this.post_state_draft() : this.post_state_live()
		}

		post_details( index: number ) {
			const post = this.post_record( index )
			if( !post ) return ''
			const time = post.Published()?.val() ?? 0
			const date = time ? new $mol_time_moment( new Date( time ) ).toString( 'YYYY-MM-DD' ) : ''
			const tags = post.Tags()?.items() ?? []
			return [ date, ... tags.map( tag => '#' + tag ) ].filter( Boolean ).join( ' · ' )
		}

		post_arg( index: number ) {
			const post = this.post_record( index )
			const link = post ? post.link().str : ''
			return { section: link ? 'post' : null, id: link || null }
		}

		override posts_empty_text() {
			if( this.posts_filtered().length ) return ''
			return this.posts().length ? this.posts_empty_query() : this.posts_empty_none()
		}

		// === SEO =================================================================

		/**
		 * Absolute url of this page. Under path routing the location already is
		 * the canonical url; a host that mounts the page elsewhere overrides this.
		 * Same helper as the post page, so both agree on what canonical means.
		 */
		canonical() {
			const loc = this.$.$mol_dom_context.location
			return loc.origin + loc.pathname + loc.search
		}

		/**
		 * Origin of a node that serves Giper Baza files over plain http — the
		 * master this app already syncs through. Needed for `og:image`: a social
		 * crawler fetches that url itself, so neither an object url nor a bare
		 * `?BAZA:file=…` (which wants a service worker the crawler never runs) can
		 * work there. Empty means no `og:image` at all, which beats a dead one.
		 */
		file_base() {
			return this.$.$giper_baza_yard.masters_default[ 0 ] ?? ''
		}

		/** Avatar as an absolute url a crawler can fetch, or empty. */
		avatar_share_uri() {
			const base = this.file_base()
			if( !base ) return ''
			const file = this.author()?.Avatar()?.remote()
			if( !file || !file.filled() ) return ''
			return new URL( file.uri(), base ).toString()
		}

		/**
		 * Read by `$bog_meta_attr` into `data-bog-meta` on this element, which the
		 * prerenderer turns into <title>/<meta>/<link> in <head>. While the Land is
		 * still syncing these reads throw a promise, the view retries, and the
		 * attribute lands only once the real values are known — so a snapshot never
		 * captures a half-filled card.
		 */
		meta(): $bog_meta_data {

			// Raw name and bio, never the localized fallbacks: see site_name above.
			const name = this.author_name()
			const title = name || site_name
			const description = this.author_bio()

			return {
				title,
				description,
				canonical: this.canonical(),
				og_title: title,
				og_description: description,
				og_type: 'profile',
				og_image: this.avatar_share_uri(),
			}

		}

		override attr() {
			return { ... super.attr(), ... $bog_meta_attr( this ) }
		}

	}

	export class $bog_journal_profile_link extends $.$bog_journal_profile_link {

		link_content() {
			return this.editable() ? [ this.Open(), this.Drop() ] : [ this.Open() ]
		}

	}

}
