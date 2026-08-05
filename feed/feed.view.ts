namespace $.$$ {

	export class $bog_journal_feed_page extends $.$bog_journal_feed_page {

		// === Feed Land ===========================================================
		//
		// Giper Baza objects (land, pawn, list) are never returned from @$mol_mem:
		// the atom would own them and run destructor() on graph rebuild, which ends
		// in `yard.forget_land()` → circular subscription. Caching already happens
		// inside `glob.Pawn()`.

		/** Root pawn of the feed this page shows. */
		feed() {
			const str = $bog_journal_feed_link_parse( this.feed_link() )
			if( !str ) return null
			return this.$.$giper_baza_glob.Pawn( new $giper_baza_link( str ), $bog_journal_model_feed )
		}

		/** Root pawn of one subscribed journal. */
		journal( author: string ) {
			if( !author ) return null
			return this.$.$giper_baza_glob.Pawn( new $giper_baza_link( author ), $bog_journal_model_author )
		}

		@ $mol_mem
		override title_shown() {
			return this.feed()?.Title()?.val() || this.title_fallback()
		}

		/**
		 * Without a feed there is nothing to subscribe to, so the form is left
		 * out rather than shown dead. `feed()` only builds a handle here, it
		 * does not read the Land, so this never suspends the page.
		 */
		@ $mol_mem
		head_content() {
			if( !this.feed() ) return [ this.Title() ]
			return [ this.Title(), this.Subscribe(), this.Subscribe_error() ]
		}

		/** Journals this feed aggregates, in subscription order. */
		@ $mol_mem
		author_links(): readonly string[] {
			const list = this.feed()?.Authors()
			if( !list ) return []
			return list.items().map( link => link?.str ?? '' ).filter( Boolean )
		}

		// === One journal, read in isolation ======================================

		/**
		 * Snapshot of one journal, as a plain record.
		 *
		 * Never throws. A Land still syncing yields `wait`, an unreachable one
		 * yields `fail`, and the feed goes on rendering the journals that did
		 * arrive — one slow author must not blank the whole page.
		 *
		 * Swallowing the suspense promise is safe for reactivity: the fiber it
		 * came from was registered as a dependency of this atom before it threw,
		 * so the slice recomputes itself the moment the Land lands.
		 */
		@ $mol_mem_key
		slice( author: string ): $bog_journal_feed_slice {

			try {

				const journal = this.journal( author )
				if( !journal ) return { status: 'fail', name: '', items: [] }

				const name = journal.Name()?.val() || this.author_unnamed()
				const avatar = journal.Avatar()?.val()?.str ?? ''

				// Post metadata are local pawns of this same Land, so the whole
				// slice costs exactly one Land sync — one suspension point.
				const posts = journal.Posts()?.remote_list() ?? []

				const items = posts.map( post => ({
					post: post.link().str,
					author,
					author_name: name,
					avatar,
					title: post.Title()?.val() || this.post_untitled(),
					summary: post.Summary()?.val() ?? '',
					cover: post.Cover()?.val()?.str ?? '',
					published: post.Published()?.val() ?? 0,
					tags: post.Tags()?.items() ?? [],
				}) )

				return { status: 'live', name, items }

			} catch( error ) {

				if( $mol_promise_like( error ) ) return { status: 'wait', name: '', items: [] }

				$mol_fail_log( error )
				return { status: 'fail', name: '', items: [] }

			}

		}

		@ $mol_mem
		slices(): readonly $bog_journal_feed_slice[] {
			return this.author_links().map( author => this.slice( author ) )
		}

		// === Timeline ============================================================

		@ $mol_mem
		items(): readonly $bog_journal_feed_item[] {
			return $bog_journal_feed_merge( this.slices().map( slice => slice.items ) )
		}

		@ $mol_mem
		items_by_link() {
			const dict = {} as Record< string, $bog_journal_feed_item >
			for( const item of this.items() ) dict[ item.post ] = item
			return dict
		}

		item( post: string ) {
			return this.items_by_link()[ post ] ?? null
		}

		/**
		 * Cards are keyed by post link, not by row: the timeline reorders itself
		 * as journals arrive, and an index key would hand a card's view — and its
		 * half-loaded cover — over to a different post on every reshuffle.
		 */
		@ $mol_mem
		override card_rows() {
			return this.items().map( item => this.Card( item.post ) )
		}

		post_title( post: string ) {
			return this.item( post )?.title ?? ''
		}

		post_summary( post: string ) {
			return this.item( post )?.summary ?? ''
		}

		post_author( post: string ) {
			return this.item( post )?.author ?? ''
		}

		post_author_name( post: string ) {
			return this.item( post )?.author_name ?? ''
		}

		post_avatar_file( post: string ) {
			return this.item( post )?.avatar ?? ''
		}

		post_tags( post: string ) {
			return this.item( post )?.tags ?? []
		}

		post_moment( post: string ) {
			const time = this.item( post )?.published ?? 0
			if( !time ) return ''
			return new $mol_time_moment( new Date( time ) ).toString( 'YYYY-MM-DD' )
		}

		post_has_cover( post: string ) {
			return Boolean( this.item( post )?.cover )
		}

		/**
		 * Keyed by the cover link rather than by the row index: the timeline
		 * reorders itself as journals arrive, and an index-keyed atom would mint
		 * a fresh object URL for the same picture on every reshuffle.
		 */
		@ $mol_mem_key
		cover_uri( cover: string ) {
			if( !cover ) return ''
			const file = this.$.$giper_baza_glob.Pawn( new $giper_baza_link( cover ), $giper_baza_file )
			if( !file.filled() ) return ''
			return URL.createObjectURL( file.blob() )
		}

		post_cover_uri( post: string ) {
			return this.cover_uri( this.item( post )?.cover ?? '' )
		}

		post_arg( post: string ) {
			const link = this.item( post )?.post ?? ''
			return { section: link ? 'post' : null, id: link || null }
		}

		author_arg( post: string ) {
			const link = this.item( post )?.author ?? ''
			return { section: link ? 'journal' : null, id: link || null }
		}

		// === Subscriptions =======================================================

		/** Keyed by journal link, so unfollowing cannot hit a shifted neighbour. */
		@ $mol_mem
		override source_rows() {
			return this.author_links().map( author => this.Source( author ) )
		}

		source_name( author: string ) {
			const slice = this.slice( author )
			if( slice.name ) return slice.name
			// Nothing known about the journal yet — show a stub of the link so the
			// row still says which subscription it is.
			return author.slice( 0, 8 ) || this.author_unnamed()
		}

		source_status( author: string ) {
			const status = this.slice( author ).status
			if( status === 'wait' ) return this.source_wait()
			if( status === 'fail' ) return this.source_fail()
			return ''
		}

		source_arg( author: string ) {
			return { section: author ? 'journal' : null, id: author || null }
		}

		/**
		 * Writing into a Land only ever happens inside @$mol_action. An event
		 * handler fiber restarts from the top when it suspends, and a plain
		 * append would then land twice — `list.add` is idempotent, and clearing
		 * the draft makes a resumed run a no-op.
		 */
		@ $mol_action
		subscribe( event?: Event ) {

			if( !event ) return null

			const raw = this.subscribe_draft().trim()
			if( !raw ) return event

			const link = $bog_journal_feed_link_parse( raw )
			if( !link ) {
				this.subscribe_error( this.subscribe_bad() )
				return event
			}

			if( this.author_links().includes( link ) ) {
				this.subscribe_error( this.subscribe_dup() )
				return event
			}

			const authors = this.feed()?.Authors( 'auto' )
			if( !authors ) return event

			authors.add( new $giper_baza_link( link ) )

			this.subscribe_draft( '' )
			this.subscribe_error( '' )

			return event

		}

		@ $mol_action
		source_drop( author: string, event?: Event ) {

			if( !event ) return null
			if( !author ) return event

			const authors = this.feed()?.Authors( 'auto' )
			if( !authors ) return event

			authors.cut( new $giper_baza_link( author ) )

			return event

		}

		// === Empty states ========================================================

		@ $mol_mem
		override empty_text() {

			if( this.items().length ) return ''
			if( !this.feed() ) return this.empty_nofeed()
			if( !this.author_links().length ) return this.empty_none()

			// Subscribed but still syncing: the source rows already say `loading`,
			// no need for a second message that will be wrong in a second.
			if( this.slices().some( slice => slice.status === 'wait' ) ) return ''

			return this.empty_quiet()

		}

	}

	export class $bog_journal_feed_card extends $.$bog_journal_feed_card {

		/**
		 * Presence of a cover is decided by the link, which is plain metadata of
		 * an already-loaded Land. Asking for the picture itself here would drag
		 * the blob read into the card's own sub() and suspend the whole card.
		 */
		@ $mol_mem
		card_content() {
			const parts = [] as $mol_view[]
			if( this.has_cover() ) parts.push( this.Cover_link() )
			parts.push( this.Body() )
			return parts
		}

		@ $mol_mem
		tag_rows() {
			return this.tags().map( ( _, index )=> this.Tag( index ) )
		}

		tag_text( index: number ) {
			const tag = this.tags()[ index ] ?? ''
			return tag && '#' + tag
		}

	}

	export class $bog_journal_feed_avatar extends $.$bog_journal_feed_avatar {

		file() {
			const str = this.file_link()
			if( !str ) return null
			return this.$.$giper_baza_glob.Pawn( new $giper_baza_link( str ), $giper_baza_file )
		}

		/**
		 * Object URL rather than `$giper_baza_file.uri()`: the latter is a
		 * `?BAZA:file=…` query that only resolves through the offline service
		 * worker, which this app does not install.
		 */
		@ $mol_mem
		override uri() {
			const file = this.file()
			if( !file?.filled() ) return ''
			return URL.createObjectURL( file.blob() )
		}

		@ $mol_mem
		face() {
			if( !this.file_link() ) return [ this.Fallback() ]
			return this.uri() ? [ this.Picture() ] : [ this.Fallback() ]
		}

	}

}
