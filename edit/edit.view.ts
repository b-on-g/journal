namespace $.$$ {

	/** Public read preset: anybody, signed in or not, can pull the Land. */
	const public_read: $giper_baza_rank_preset = [[ null, $giper_baza_rank_read ]]

	export class $bog_journal_edit_page extends $.$bog_journal_edit_page {

		// === Land access =========================================================
		//
		// Giper Baza objects (land, pawn, list) are never returned from @$mol_mem:
		// the atom would own them and run destructor() on graph rebuild, which ends
		// in `yard.forget_land()` → circular subscription. Caching already happens
		// inside `glob.Land()` / `glob.Pawn()`.

		/** Post metadata pawn being edited. */
		post() {
			const str = this.post_link()
			if( !str ) return null
			return this.$.$giper_baza_glob.Pawn( new $giper_baza_link( str ), $bog_journal_model_post )
		}

		/**
		 * Journal this post belongs to. A post pawn lives inside the journal Land,
		 * so the link already names it; `author_link` is only the fallback for a
		 * post that does not exist yet.
		 */
		journal_link() {
			const post = this.post_link()
			if( post ) return new $giper_baza_link( post ).land().str
			return this.author_link()
		}

		author() {
			const str = this.journal_link()
			if( !str ) return null
			return this.$.$giper_baza_glob.Pawn( new $giper_baza_link( str ), $bog_journal_model_author )
		}

		journal_land() {
			const str = this.journal_link()
			if( !str ) return null
			return this.$.$giper_baza_glob.Land( new $giper_baza_link( str ).land() )
		}

		// === Rights ==============================================================

		/**
		 * Same tier check as the profile page: rights are per-Land, not per-pawn.
		 *
		 * The `Name()` read is load-bearing. Rights arrive as Gift units together
		 * with the rest of the Land, and only a read of actual data makes the Land
		 * sync — `pass_rank()` on its own never asks for anything. Without it a
		 * cold load answers "no access", renders nothing that would read the Land,
		 * and stays wrong forever. Reading a field starts the sync and this atom
		 * recomputes when the units land.
		 */
		@ $mol_mem
		override can_edit() {
			const land = this.journal_land()
			if( !land ) return false
			this.author()?.Name()?.val()
			const pass = this.$.$giper_baza_auth.current().pass()
			return $giper_baza_rank_tier_of( land.pass_rank( pass ) ) >= $giper_baza_rank_tier.post
		}

		/** A visitor gets the refusal, not a dead form. */
		@ $mol_mem
		page_content() {
			if( !this.can_edit() ) return [ this.Denied() ]
			return [ this.Meta(), this.Body() ]
		}

		// === Title, slug, summary ================================================

		@ $mol_mem
		post_title( next?: string ) {
			const post = this.post()
			if( !post ) return ''
			if( next !== undefined ) {
				post.Title( 'auto' )?.val( next )
				return next
			}
			return post.Title()?.val() ?? ''
		}

		/**
		 * Stored slug wins; with none stored the title is transliterated on the
		 * fly. Nothing is written until the author edits the field or presses
		 * "From title" — the derived value is deterministic, so every peer
		 * computes the same string from the same title anyway.
		 */
		@ $mol_mem
		post_slug( next?: string ) {
			const post = this.post()
			if( !post ) return ''
			if( next !== undefined ) {
				post.Slug( 'auto' )?.val( next )
				return next
			}
			return post.Slug()?.val() || $bog_journal_edit_slug( this.post_title() )
		}

		@ $mol_action
		slug_reset( event?: Event ) {
			if( !event ) return null
			if( !this.can_edit() ) return null
			this.post_slug( $bog_journal_edit_slug( this.post_title() ) )
			return event
		}

		@ $mol_mem
		post_summary( next?: string ) {
			const post = this.post()
			if( !post ) return ''
			if( next !== undefined ) {
				post.Summary( 'auto' )?.val( next )
				return next
			}
			return post.Summary()?.val() ?? ''
		}

		// === Cover ===============================================================
		//
		// Object URL instead of `$giper_baza_file.uri()`: the latter is a
		// `?BAZA:file=…` query that only resolves through the offline service
		// worker, which this app does not install.

		@ $mol_mem
		cover_files( next?: readonly File[] ) {
			if( next?.length && this.can_edit() ) {
				const link = this.post()?.Cover( 'auto' )
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
		override cover_uri() {
			const files = this.cover_files()
			if( files.length ) return URL.createObjectURL( files[0] )

			const file = this.post()?.Cover()?.remote()
			if( !file || !file.filled() ) return ''
			return URL.createObjectURL( file.blob() )
		}

		@ $mol_mem
		cover_preview() {
			try {
				if( this.cover_uri() ) return this.Cover_image()
			} catch( error ) {
				if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
			}
			return null
		}

		@ $mol_mem
		cover_clear() {
			return this.post()?.Cover()?.val() ? this.Cover_clear() : null
		}

		@ $mol_action
		cover_remove( event?: Event ) {
			if( !event ) return null
			if( !this.can_edit() ) return null
			this.cover_files([])
			this.post()?.Cover( 'auto' )?.val( null )
			return event
		}

		// === Tags ================================================================

		@ $mol_mem
		tags(): readonly string[] {
			return this.post()?.Tags()?.items() ?? []
		}

		@ $mol_mem
		tag_rows() {
			return this.tags().map( ( _, index )=> this.Tag_row( index ) )
		}

		tag_title( index: number ) {
			return this.tags()[ index ] ?? ''
		}

		@ $mol_action
		tag_drop( index: number, event?: Event ) {
			if( !event ) return null
			const list = this.post()?.Tags( 'auto' )
			if( !list ) return event
			list.items( this.tags().filter( ( _, i )=> i !== index ) )
			return event
		}

		@ $mol_action
		tag_add( event?: Event ) {
			if( !event ) return null
			// Tags share the slug shape, so `Local First` and `local-first` do not
			// end up as two different tags.
			const tag = $bog_journal_edit_slug( this.tag_draft() )
			if( !tag ) return event
			// Dedupe: an event handler fiber restarts from the top when it suspends,
			// so a plain append could land twice.
			if( this.tags().includes( tag ) ) return event
			const list = this.post()?.Tags( 'auto' )
			if( !list ) return event
			list.items([ ... this.tags(), tag ])
			this.tag_draft( '' )
			return event
		}

		// === Publication =========================================================

		/** `Published` doubles as the flag and the timestamp: 0 means draft. */
		@ $mol_mem
		override published( next?: boolean ) {
			const post = this.post()
			if( !post ) return false
			if( next !== undefined ) {
				post.Published( 'auto' )?.val( next ? Date.now() : 0 )
				return next
			}
			return ( post.Published()?.val() ?? 0 ) > 0
		}

		@ $mol_mem
		override published_label() {
			const time = this.post()?.Published()?.val() ?? 0
			if( !time ) return this.published_never()
			return new $mol_time_moment( new Date( time ) ).toString( 'YYYY-MM-DD hh:mm' )
		}

		// === Body ================================================================

		/** Land of the article text. $bog_wysiwyg takes it from here and owns it. */
		override body_land_link() {
			return this.post()?.Page()?.val()?.str ?? ''
		}

		override body_readonly() {
			return !this.can_edit()
		}

		// === Export ==============================================================

		/**
		 * Article body flattened into plain records for the markdown serializer.
		 * It is a pure function and stays that way: no Giper Baza object crosses
		 * into it, the Land is unwrapped here.
		 */
		@ $mol_mem
		body_blocks(): readonly $bog_wysiwyg_export_block[] {

			const page = this.post()?.Page()?.remote()
			if( !page ) return []

			return ( page.Blocks()?.remote_list() ?? [] ).map( block => ({
				type: block.Type()?.text() || 'paragraph',
				level: block.Level()?.val() ?? undefined,
				content: block.Content()?.val() ?? '',
			}) )

		}

		/**
		 * Origin of a node that serves Giper Baza files over plain http — the
		 * master this app already syncs through. Exported markdown is pasted onto
		 * Habr or dev.to, where an object url or a bare `?BAZA:file=…` (which needs
		 * a service worker nobody there runs) would be a dead image.
		 */
		override file_base() {
			return this.$.$giper_baza_yard.masters_default[ 0 ] ?? ''
		}

		/**
		 * Cover in the form the serializer resolves against `base_uri`. The raw
		 * `?BAZA:file=…` is handed over rather than an absolute url, so the export
		 * module keeps doing the joining for covers and inline images alike.
		 */
		override cover_share_uri() {
			const file = this.post()?.Cover()?.remote()
			if( !file || !file.filled() ) return ''
			return file.uri()
		}

		// === Creation ============================================================

		/**
		 * Brings a post into being and returns its link, or '' when the current
		 * user may not write here. Three steps, one fiber:
		 *
		 * 1. grab a Land for the body and put a $bog_wysiwyg_model_page in it
		 * 2. make the metadata pawn inside the journal Land
		 * 3. point its `Page` at the body Land — `make()` already spliced the pawn
		 *    into `Posts`, which is step three of the route the caller asked for
		 *
		 * `land_grab` goes first because it is the only Proof-of-Work step and the
		 * only one that suspends. Both it and `list.make()` are @$mol_action, so a
		 * resumed fiber reuses them instead of minting a second Land or a duplicate
		 * post. Running any of this from a @$mol_mem would retry PoW forever and
		 * hang the UI.
		 */
		@ $mol_action
		create(): string {

			if( !this.can_edit() ) return ''

			const posts = this.author()?.Posts( 'auto' )
			if( !posts ) return ''

			const body = this.$.$giper_baza_glob.land_grab( public_read )
			const page = body.Data( $bog_wysiwyg_model_page )

			const post = posts.make( null )
			post.Title( 'auto' )?.val( this.post_new_title() )
			post.Published( 'auto' )?.val( 0 )
			post.Page( 'auto' )?.val( page.link() )

			return post.link().str

		}

	}

	/**
	 * Markdown export that also puts the post summary into the dev.to front
	 * matter.
	 *
	 * `$bog_wysiwyg_export_config` has no `description` field, so the shipped
	 * serializer cannot emit one, and that module is not ours to change. The line
	 * is inserted into the YAML block it already produced, guarded on both ends:
	 * nothing happens unless the output really opens with a front matter block,
	 * and nothing happens if a `description:` key is already there. So on the day
	 * the export module grows the field, this quietly steps aside instead of
	 * writing the key twice.
	 */
	export class $bog_journal_edit_export extends $.$bog_journal_edit_export {

		/**
		 * Deliberately not @$mol_mem. The method it overrides is one, and $mol
		 * keys an atom by host plus property name — a memoised override calling
		 * `super` of the same name would find its own atom mid-computation and
		 * die with a circular subscription. The parent stays cached, this only
		 * adds a regex on top of it.
		 */
		override markdown() {

			const markdown = super.markdown()
			// Compared against the raw value rather than dialect_current(): that
			// one lives in the $$ class of a foreign component and is invisible to
			// the generated typing of this subclass.
			if( this.dialect() !== 'devto' ) return markdown

			const summary = this.summary().trim()
			if( !summary ) return markdown

			const found = /^---\n[\s\S]*?\n---\n/.exec( markdown )
			if( !found ) return markdown

			const head = found[ 0 ]
			if( /^description:/m.test( head.slice( 4, -4 ) ) ) return markdown

			// JSON quoting is a valid YAML double-quoted scalar and escapes the
			// same characters, so a summary with quotes or backslashes survives.
			const line = 'description: ' + JSON.stringify( summary )
			return head.replace( /\n---\n$/, '\n' + line + '\n---\n' ) + markdown.slice( head.length )

		}

	}

}
