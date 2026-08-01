namespace $.$$ {

	/** Giper Baza node every journal syncs through. */
	const prod_master = 'https://baza.87.120.36.150.ip.giper.dev/'

	/** Public read preset: anybody, signed in or not, can pull the Land. */
	const public_read: $giper_baza_rank_preset = [[ null, $giper_baza_rank_read ]]

	export class $bog_journal_app extends $.$bog_journal_app {

		/**
		 * Path-based routing: `/journal/author=<land>/post=<pawn>` instead of
		 * `#!author=…`. The $bog_seo prerenderer crawls BFS over `<a href>` and
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

		/** Link to this user's own journal, empty until they create one. */
		@ $mol_mem
		own_journal_link() {
			return this.home().Journal()?.val()?.str ?? ''
		}

		/**
		 * Journal being shown. An explicit `author=` wins, so a visitor following
		 * somebody's link never touches their own home Land — which matters,
		 * because touching it means generating a key with Proof-of-Work.
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
		override app_content() {
			this.baza_master()
			return this.author_link() ? [ this.Profile() ] : [ this.Start() ]
		}

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

	}

}
