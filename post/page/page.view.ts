namespace $.$$ {

	/**
	 * Read-only article page. Deliberately not the editor: no contenteditable, no
	 * hotkeys, no slash menu, no comments — a reader gets static markup only.
	 *
	 * Everything hangs off `post_link`, the link of the post pawn, which the host
	 * binds from the route. The author is derived from it: a post pawn lives inside
	 * the author's journal Land, so `link.land()` already names the journal.
	 *
	 * Nothing here asks for a pass. A journal Land is created with a
	 * `[[ null, read ]]` preset, so a logged-out reader pulls it straight from the
	 * master node.
	 */
	export class $bog_journal_post_page extends $.$bog_journal_post_page {

		/**
		 * Post being read. Not `@$mol_mem`: baza pawns must not be cached in mol
		 * cells, and `glob.Pawn` is already keyed and cheap.
		 */
		post() {
			const link = this.post_link()
			if( !link ) return null
			return this.$.$giper_baza_glob.Pawn( new this.$.$giper_baza_link( link ), $bog_journal_model_post )
		}

		/** Journal that owns the post. Same reason for not memoizing. */
		author() {
			const post = this.post()
			if( !post ) return null
			return this.$.$giper_baza_glob.Land( post.link().land() ).Data( $bog_journal_model_author )
		}

		/**
		 * Link of the journal root pawn. This is the same string the app keeps in
		 * `author=`, so the profile link below resolves to an existing route.
		 */
		author_id() {
			return this.author()?.link().str ?? ''
		}

		post_title() {
			return this.post()?.Title()?.val() ?? ''
		}

		post_summary() {
			return this.post()?.Summary()?.val() ?? ''
		}

		author_name() {
			return this.author()?.Name()?.val() ?? ''
		}

		/** Never blank, so the profile link always has something to click on. */
		author_label() {
			return this.author_name() || this.author_fallback()
		}

		tags(): readonly string[] {
			return this.post()?.Tags()?.items() ?? []
		}

		tag( index: number ) {
			return this.tags()[ index ] ?? ''
		}

		/**
		 * Object url rather than `$giper_baza_file.uri()`: the latter is a
		 * `?BAZA:file=…` query that only resolves through the offline service
		 * worker, and this app does not install one. Same choice as the avatar in
		 * the profile page.
		 */
		@ $mol_mem
		cover_uri() {
			return this.file_object_uri( this.post()?.Cover()?.remote() ?? null )
		}

		cover_alt() {
			return this.post_title()
		}

		@ $mol_mem
		author_avatar_uri() {
			return this.file_object_uri( this.author()?.Avatar()?.remote() ?? null )
		}

		file_object_uri( file: $giper_baza_file | null ) {
			if( !file || !file.filled() ) return ''
			return URL.createObjectURL( file.blob() )
		}

		/**
		 * Origin of a node that serves Giper Baza files over plain http — the master
		 * the app already syncs through. Needed for `og:image`: a social crawler
		 * fetches that url itself, so neither an object url nor a bare
		 * `?BAZA:file=…` (which wants a service worker the crawler never runs) can
		 * work there. Empty falls back to the generated card.
		 */
		file_base() {
			return this.$.$giper_baza_yard.masters_default[ 0 ] ?? ''
		}

		/** Cover as an absolute url a crawler can fetch, or empty. */
		cover_share_uri() {
			const base = this.file_base()
			if( !base ) return ''
			const file = this.post()?.Cover()?.remote()
			if( !file || !file.filled() ) return ''
			return new URL( file.uri(), base ).toString()
		}

		/**
		 * Generated preview card, drawn by `assets/og_cards.mjs` right next to the
		 * static snapshot of this very page — hence the url is the page url plus
		 * `/og.png`, with no id scheme to keep in sync on either side.
		 *
		 * Only a route-shaped path has a snapshot directory to hold a card, so on
		 * the dev server (hash routing, a `.html` path) this stays empty and
		 * `$bog_meta_compact` drops `og:image` instead of pointing at nothing.
		 *
		 * The origin is whatever the page is rendered from, which during prerender
		 * is localhost — `deploy/routes/verify.mjs` rewrites the whole head to the
		 * production origin afterwards, the same way it already fixes canonical.
		 */
		card_uri() {
			const loc = this.$.$mol_dom_context.location
			const path = loc.pathname.replace( /\/+$/, '' )
			if( !/\/post=[^/]+$/.test( path ) ) return ''
			return loc.origin + path + '/og.png'
		}

		/** Milliseconds since epoch. Zero means the post is still a draft. */
		published_ms() {
			return this.post()?.Published()?.val() ?? 0
		}

		published_moment() {
			const ms = this.published_ms()
			return ms > 0 ? new $mol_time_moment( new Date( ms ) ) : null
		}

		/** Same format the profile list uses, so a date reads the same everywhere. */
		published_iso() {
			return this.published_moment()?.toString( 'YYYY-MM-DD' ) ?? ''
		}

		published_label() {
			return this.published_iso()
		}

		/**
		 * Route of the author page. The app owns its arg names, so a host with a
		 * different router overrides just this.
		 */
		author_arg(): Record< string, string | null > {
			return { author: this.author_id(), post: null }
		}

		// --- body ---

		/**
		 * Body blocks as plain records: the input of the pure renderer.
		 *
		 * A block named twice is read once, at its first position. The order of
		 * blocks is a CRDT list, and nothing in it forbids the same link appearing
		 * more than once — two devices editing the same article can merge into
		 * exactly that. The editor never shows it, because a repeated id resolves
		 * to one and the same keyed view and the duplicates collapse in the DOM;
		 * a reader building a row per entry has no such luck and prints the
		 * paragraph again. Whatever put them there, the article has one of each.
		 */
		@ $mol_mem
		blocks(): $bog_journal_post_block[] {

			const page = this.post()?.Page()?.remote()
			if( !page ) return []

			const seen = new Set< string >()
			const blocks: $bog_journal_post_block[] = []

			for( const block of page.Blocks()?.remote_list() ?? [] ) {

				const link = block.link().str
				if( seen.has( link ) ) continue
				seen.add( link )

				blocks.push( {
					type: block.Type()?.text() || 'paragraph',
					level: block.Level()?.val() ?? undefined,
					content: block.Content()?.val() ?? '',
				} )

			}

			return blocks
		}

		@ $mol_mem
		rows(): readonly $bog_journal_post_row[] {
			return $bog_journal_post_rows( this.blocks() )
		}

		/**
		 * Plain views, never `$mol_list`: a list virtualizes its rows, so everything
		 * below the fold would be missing from the DOM the crawler reads.
		 */
		@ $mol_mem
		body_rows(): readonly $mol_view[] {
			return this.rows().map( ( row, index )=> this.Row( index ) )
		}

		Row( index: number ): $mol_view {
			switch( this.rows()[ index ]?.type ) {
				case 'heading': return this.Heading( index )
				case 'quote': return this.Quote( index )
				case 'list': return this.List( index )
				case 'code': return this.Code( index )
				case 'divider': return this.Divider( index )
				case 'image': return this.Picture( index )
				default: return this.Paragraph( index )
			}
		}

		row_html( index: number ) {
			const row = this.rows()[ index ]
			if( !row ) return ''
			if( row.type === 'heading' || row.type === 'paragraph' || row.type === 'quote' ) return row.html
			return ''
		}

		/** The post title owns the h1, so body headings start at h2. */
		heading_name( index: number ) {
			const row = this.rows()[ index ]
			return 'h' + ( ( row?.type === 'heading' ? row.level : 1 ) + 1 )
		}

		list_items( index: number ): readonly $mol_view[] {
			const row = this.rows()[ index ]
			if( row?.type !== 'list' ) return []
			return row.items.map( ( item, sub )=> this.Item( index + '/' + sub ) )
		}

		item_html( id: string ) {
			const [ row_index, item_index ] = id.split( '/' )
			const row = this.rows()[ Number( row_index ) ]
			return row?.type === 'list' ? ( row.items[ Number( item_index ) ] ?? '' ) : ''
		}

		code_text( index: number ) {
			const row = this.rows()[ index ]
			return row?.type === 'code' ? row.text : ''
		}

		code_lang( index: number ) {
			const row = this.rows()[ index ]
			return row?.type === 'code' && row.lang ? row.lang : null
		}

		picture_src( index: number ) {
			const row = this.rows()[ index ]
			return row?.type === 'image' ? row.src : ''
		}

		picture_alt( index: number ) {
			const row = this.rows()[ index ]
			return row?.type === 'image' ? row.alt : ''
		}

		// --- layout ---

		head_content(): readonly $mol_view[] {
			return [
				... this.cover_uri() ? [ this.Cover() ] : [],
				this.Title(),
				... this.post_summary() ? [ this.Summary() ] : [],
				this.Byline(),
				... this.tags().length ? [ this.Tags() ] : [],
			]
		}

		byline_content(): readonly $mol_view[] {
			return [
				this.published_label() ? this.Published() : this.Draft(),
				this.Author_link(),
			]
		}

		author_content(): readonly $mol_view[] {
			return [
				... this.author_avatar_uri() ? [ this.Author_avatar() ] : [],
				this.Author_name(),
			]
		}

		tag_chips(): readonly $mol_view[] {
			return this.tags().map( ( tag, index )=> this.Tag( index ) )
		}

		// --- seo ---

		/**
		 * Absolute url of this page. Under path routing the location already is the
		 * canonical url; a host that mounts the page elsewhere overrides this.
		 */
		canonical() {
			const loc = this.$.$mol_dom_context.location
			return loc.origin + loc.pathname + loc.search
		}

		/**
		 * Read by `$bog_meta_attr` into `data-bog-meta` on the root element, which
		 * the prerenderer turns into <title>/<meta>/<link> in <head>. While the Land
		 * is still syncing these reads throw a promise, the view retries, and the
		 * attribute lands only once the real values are known — so a snapshot never
		 * captures half-filled metadata.
		 */
		meta(): $bog_meta_data {

			const title = this.post_title()
			// Raw name, not author_label(): the localized fallback would put
			// $mol_locale inside attr(), and a locale that fails to load would then
			// take the whole article down instead of one line of the byline.
			const author = this.author_name()
			const full = author ? title + ' — ' + author : title
			const description = this.post_summary()

			return {
				title: full,
				description,
				canonical: this.canonical(),
				og_title: full,
				og_description: description,
				og_type: 'article',
				// A cover the author picked always beats a drawn card.
				og_image: this.cover_share_uri() || this.card_uri(),
			}
		}

		override attr() {
			return { ... super.attr(), ... $bog_meta_attr( this ) }
		}

	}

}
