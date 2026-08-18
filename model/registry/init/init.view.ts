namespace $.$$ {
	// Синхронизация через Гипер Базу отключена: список мастеров пустой.
	// Чистки одного masters_default мало — masters() склеивает его с пирами
	// из бандленного сида, где зашит публичный мастер. Глушим сам masters().
	$giper_baza_yard.masters_default.length = 0
	$giper_baza_yard.masters = (): string[] => []


	/**
	 * One-off bootstrap of the journal catalogue: grabs the Land, prints its
	 * link and hands over the `.baza` foundation to commit.
	 *
	 * Run it once, ever. Running it again produces a *different* Land — a
	 * second catalogue nobody reads until its link is committed, which is
	 * harmless but pointless. The reasons behind every step are in
	 * `model/registry/readme.md`.
	 *
	 * Whoever presses the button becomes the only account with `rule` on the
	 * catalogue, so press it from the browser profile you consider yours.
	 */
	export class $bog_journal_model_registry_init extends $.$bog_journal_model_registry_init {

		/**
		 * Node the catalogue is grabbed against. Defaults to the one the app
		 * syncs through — a catalogue on any other master is invisible to every
		 * reader, so the real run must use the default.
		 *
		 * `baza=<url>` points it elsewhere, which is here for one reason: a dry
		 * run against a local node, where the whole chain (create, commit the
		 * link and the pack, register from a *second* browser profile) can be
		 * rehearsed without leaving anything behind on the real master. The page
		 * prints which node it used, so a rehearsal cannot be mistaken for the
		 * real thing.
		 */
		@ $mol_mem
		master() {
			const custom = this.$.$mol_state_arg.value( 'baza' ) ?? ''
			const url = custom || $bog_journal_model_master
			const masters = this.$.$giper_baza_yard.masters_default
			if( !masters.includes( url ) ) masters.unshift( url )
			return url
		}

		owner_line() {
			const lord = this.$.$giper_baza_auth.current().pass().lord().str
			return `Owner of the new catalogue: ${ lord } — this browser profile, on this origin.`
				+ ` Master: ${ this.master() }`
		}

		guide() {
			return [
				'1. Press the button below. Proof-of-Work takes a couple of seconds.',
				'2. Keep this tab open until the sync indicator goes quiet. This is the step'
					+ ' that matters: the signed rights reach other people from the master, and'
					+ ' closing the tab early strands the Land in this browser.',
				'3. Copy the printed link into `registry_link` in `model/registry/registry.ts`.',
				'4. Download `registry.baza` and put it next to that file. Insurance rather than'
					+ ' the main path — see the readme.',
				'5. Check from a second browser profile that a journal created there lands in'
					+ ' the catalogue. Everybody-read-only is a known failure mode, and the'
					+ ' readme says what to do about it.',
			].join( '\n' )
		}

		/** Link of the Land created by this run. Empty before the button is pressed. */
		@ $mol_mem
		created_link( next?: string ) {
			return next ?? ''
		}

		/**
		 * Grabs the Land inside a fiber — Proof-of-Work in a @$mol_mem would
		 * suspend and retry forever.
		 *
		 * `units_saving` right after is the whole point of this page: signing is
		 * lazy, and an unsigned Gift is rejected by every other client, which is
		 * exactly the "everybody gets read-only rank 16" trap. Forcing the
		 * pipeline here means the downloaded pack carries a signed Seal.
		 */
		@ $mol_action
		make( event?: Event ) {
			if( !event ) return null
			this.master()
			const land = this.$.$giper_baza_glob.land_grab( $bog_journal_model_registry_preset )
			land.units_saving()
			// Единственное место во всём журнале, где sync() зовут руками.
			// Обычно ленд синкается сам, потому что его кто-то читает; этот
			// не читает никто — он только что появился, и без явного sync
			// он остаётся в этой вкладке и до мастера не доезжает.
			land.sync()
			this.created_link( land.link().str )
			return event
		}

		/**
		 * Unit count of the fresh Land. Reading it keeps the Land observed while
		 * the tab lives: an unobserved Land is collected, and the push to the
		 * master dies with it.
		 */
		created_units() {
			const str = this.created_link()
			if( !str ) return 0
			const land = this.$.$giper_baza_glob.Land( new $giper_baza_link( str ).land() )
			land.sync()
			return land.diff_units().length
		}

		result() {
			const str = this.created_link()
			if( !str ) return ''
			return [
				`**Catalogue Land:** \`${ str }\` — units so far: ${ this.created_units() }.`,
				'',
				'Paste it into `registry_link`, then download the pack below.',
			].join( '\n' )
		}

		result_block() {
			return this.created_link() ? this.Result() : null
		}

		download_button() {
			return this.created_link() ? this.Download() : null
		}

		/**
		 * Exports the foundation: Pass, the Gift that grants `post` to everybody,
		 * and the Seal signing it. No data — the Land is brand new, and journal
		 * links arrive over sync anyway.
		 */
		@ $mol_action
		download( event?: Event ) {
			if( !event ) return null

			const str = this.created_link()
			if( !str ) return null

			const land = this.$.$giper_baza_glob.Land( new $giper_baza_link( str ).land() )
			const pack = $giper_baza_pack.make([ [ land.link().str, land.diff_part() ] ])

			const doc = this.$.$mol_dom_context.document
			const uri = URL.createObjectURL( pack.toBlob() )
			const anchor = doc.createElement( 'a' )
			anchor.href = uri
			anchor.download = 'registry.baza'
			doc.body.appendChild( anchor )
			anchor.click()
			anchor.remove()
			setTimeout( ()=> URL.revokeObjectURL( uri ), 1000 )

			return event
		}

	}

}
