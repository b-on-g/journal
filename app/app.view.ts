namespace $.$$ {

	/** Giper Baza node every journal syncs through. */
	const prod_master = 'https://baza.87.120.36.150.ip.giper.dev/'

	/** Public read preset: anybody, signed in or not, can pull the Land. */
	const public_read: $giper_baza_rank_preset = [[ null, $giper_baza_rank_read ]]

	type Screen = 'edit' | 'post' | 'feed' | 'profile' | 'start'

	export class $bog_journal_app extends $.$bog_journal_app {

		/**
		 * Path-based routing: `/journal/author=<land>/post=<pawn>` instead of
		 * `#!author=…`. The bog/seo prerenderer crawls BFS over `<a href>` and
		 * drops anything starting with `#`, so a hash router would make every
		 * page invisible to it. $bog_builderui_router is a drop-in $mol_state_arg.
		 *
		 * The mount is passed explicitly. activate() installs only when the
		 * current pathname already starts with it, and additionally bails out on
		 * $mol dev artifacts (`/-/`, `.html`) — so on the mam dev server
		 * (`/bog/journal/app/-/test.html`) this is a clean no-op and the standard
		 * hash router keeps working against the non-SPA file server.
		 */
		static {
			$bog_builderui_router.activate( '/journal/' )
		}

		/**
		 * Master node this app syncs through. `baza=<url>` in the URL points it at
		 * a local node instead. Registering here rather than at module load keeps
		 * the override readable from $mol_state_arg.
		 */
		@ $mol_mem
		baza_master() {
			const custom = this.$.$mol_state_arg.value( 'baza' ) ?? ''
			const url = custom || prod_master
			const masters = this.$.$giper_baza_yard.masters_default
			if( !masters.includes( url ) ) masters.unshift( url )
			return url
		}

		/** Bootstrap record in the user's own home Land. NOT @$mol_mem. */
		home() {
			return this.$.$giper_baza_glob.home().land().Data( $bog_journal_model_home )
		}

		// === Route ===============================================================

		/** Link to this user's own journal, empty until they create one. */
		@ $mol_mem
		own_journal_link() {
			return this.home().Journal()?.val()?.str ?? ''
		}

		/** This reader's own feed, empty until they start one. */
		@ $mol_mem
		override own_feed_link() {
			const first = this.home().Feeds()?.items()[0]
			return first ? first.str : ''
		}

		/**
		 * Journal being shown. An explicit `author=` wins, so a visitor following
		 * somebody's link is served straight from the route.
		 */
		@ $mol_mem
		override author_link( next?: string ) {
			if( next !== undefined ) {
				this.$.$mol_state_arg.value( 'author', next || null )
				return next
			}
			const arg = this.$.$mol_state_arg.value( 'author' )
			if( arg ) return arg
			return this.own_journal_link()
		}

		@ $mol_mem
		override post_link() {
			return this.$.$mol_state_arg.value( 'post' ) ?? ''
		}

		@ $mol_mem
		override feed_link() {
			return this.$.$mol_state_arg.value( 'feed' ) ?? ''
		}

		@ $mol_mem
		override edit_link() {
			return this.$.$mol_state_arg.value( 'edit' ) ?? ''
		}

		/**
		 * Which screen the current route means. `edit` outranks `post` so the
		 * editor can keep `post=` around and "View" stays one link away.
		 *
		 * `author_link()` is consulted last on purpose: it falls back to the home
		 * Land, and a visitor reading a post or a feed has no reason to wait for a
		 * Land of their own to sync.
		 */
		@ $mol_mem
		screen(): Screen {
			if( this.edit_link() ) return 'edit'
			if( this.post_link() ) return 'post'
			if( this.feed_link() ) return 'feed'
			if( this.author_link() ) return 'profile'
			return 'start'
		}

		@ $mol_mem
		override app_content() {
			this.baza_master()
			switch( this.screen() ) {
				case 'edit': return [ this.Edit() ]
				case 'post': return [ this.Post() ]
				case 'feed': return [ this.Feed() ]
				case 'profile': return [ this.Profile() ]
				default: return [ this.Start() ]
			}
		}

		override screen_title() {
			switch( this.screen() ) {
				case 'edit': return this.title_edit()
				case 'post': return this.title_post()
				case 'feed': return this.title_feed()
				default: return this.title_journal()
			}
		}

		// === Rights ==============================================================

		/**
		 * Whether the current user may write into the Land holding `link`, which
		 * may name either a journal or a post inside one. Same tier check as the
		 * profile and the editor. Returns a plain boolean, so caching it in an
		 * atom is safe — a Land object never would be.
		 *
		 * The `Name()` read is load-bearing: rights arrive as Gift units with the
		 * rest of the Land, and only a read of actual data makes the Land sync.
		 * Asking for the rank alone would answer "no" on a cold load and never
		 * correct itself.
		 */
		@ $mol_mem_key
		can_edit( link: string ) {
			if( !link ) return false
			const land = this.$.$giper_baza_glob.Land( new $giper_baza_link( link ).land() )
			land.Data( $bog_journal_model_author ).Name()?.val()
			const pass = this.$.$giper_baza_auth.current().pass()
			return $giper_baza_rank_tier_of( land.pass_rank( pass ) ) >= $giper_baza_rank_tier.post
		}

		// === Navigation ==========================================================
		//
		// Every move between screens is a real <a href> with a path, never a click
		// handler: these are the edges the SEO crawler walks. Each link spells out
		// all four keys, because the router keeps any key it is not told about — a
		// stale `edit=` left behind would drop a reader back into the editor.

		feed_arg(): Record< string, string | null > {
			return { feed: this.own_feed_link(), author: null, post: null, edit: null }
		}

		profile_arg(): Record< string, string | null > {
			return { author: this.author_link() || null, post: null, edit: null, feed: null }
		}

		/** Leave the editor for the reader's view of the same post. */
		read_arg(): Record< string, string | null > {
			return { author: this.author_link() || null, post: this.edit_link(), edit: null, feed: null }
		}

		/** Open the post being read in the editor. */
		edit_arg(): Record< string, string | null > {
			return {
				author: this.author_link() || null,
				post: this.post_link(),
				edit: this.post_link(),
				feed: null,
			}
		}

		@ $mol_mem
		override tool_bar() {
			const parts: any[] = []
			const screen = this.screen()

			parts.push( this.own_feed_link() ? this.Nav_feed() : this.Feed_make() )
			if( screen !== 'profile' && screen !== 'start' ) parts.push( this.Nav_profile() )
			if( screen === 'edit' ) parts.push( this.Nav_read() )
			if( screen === 'post' && this.can_edit( this.post_link() ) ) parts.push( this.Nav_edit() )
			if( screen === 'profile' && this.can_edit( this.author_link() ) ) parts.push( this.Post_new() )

			parts.push( this.Status(), this.Lights() )
			return parts
		}

		// === Actions =============================================================

		/**
		 * Creates the journal Land on demand. `ensure( preset )` grabs a fresh Land
		 * with public read and writes its root pawn link into the home record in
		 * one step. Proof-of-Work runs inside this fiber — never from a @$mol_mem,
		 * where a suspended retry loops forever.
		 */
		@ $mol_action
		journal_create( event?: Event ) {
			if( !event ) return null
			const author = this.home().Journal( 'auto' )?.ensure( public_read )
			if( author ) this.author_link( author.link().str )
			return event
		}

		/**
		 * A feed is the reader's private list of journals, so its preset has no
		 * `null` entry: the Land comes out encrypted and nobody else can pull who
		 * this person follows.
		 */
		@ $mol_action
		feed_create( event?: Event ) {
			if( !event ) return null

			const feeds = this.home().Feeds( 'auto' )
			if( !feeds ) return null

			const owner = this.$.$giper_baza_auth.current().pass()
			const preset: $giper_baza_rank_preset = [[ owner, $giper_baza_rank_rule ]]
			const feed = feeds.make( preset )

			this.$.$mol_state_arg.go({ feed: feed.link().str, author: null, post: null, edit: null })
			return event
		}

		/**
		 * Hands the three-step creation to the editor, then routes into it. The
		 * cast is needed because the view.tree typing of `Edit()` only knows the
		 * generated base class, and `create()` lives in the $$ subclass.
		 */
		@ $mol_action
		post_create( event?: Event ) {
			if( !event ) return null
			const link = ( this.Edit() as $.$$.$bog_journal_edit_page ).create()
			if( !link ) return null
			this.$.$mol_state_arg.go({ edit: link, post: null, feed: null })
			return event
		}

	}

}
