namespace $ {

	/**
	 * Own IndexedDB for this app. localhost:9080 hosts a dozen Giper Baza builds
	 * sharing one origin, and therefore one `$giper_baza_mine` database — old and
	 * new unit formats collide there ("object stores was not found", "Unknown
	 * Kind" out of the pack parser) and the app dies with a blank screen.
	 */
	export class $bog_journal_mine extends $giper_baza_mine_idb {

		@ $mol_memo.method
		static override async db() {

			return await this.$.$mol_db<{

				Unit: {
					Key: [ land: string, path: string ]
					Doc: [ ArrayBuffer ]
					Indexes: {}
				}

				Ball: {
					Key: [ land: string, path: string ]
					Doc: [ ArrayBuffer ]
					Indexes: {}
				}

			}>( 'bog_journal_mine',
				mig => mig.store_make( 'Unit' ),
				mig => mig.store_make( 'Ball' ),
			)

		}

	}

	$.$giper_baza_mine = $bog_journal_mine
	$.$giper_baza_mine_idb = $bog_journal_mine

	/**
	 * The bundled peer seed (`web.baza`) may fail to parse in a given build, and
	 * `masters()` throws as a whole when it does — killing every sync, not just
	 * peer discovery. Fall back to the explicitly configured masters instead.
	 */
	const masters_base = $giper_baza_yard.masters.bind( $giper_baza_yard )
	$giper_baza_yard.masters = ()=> {
		try {
			return masters_base()
		} catch( error ) {
			if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
			$mol_fail_log( error )
			return [ ... $giper_baza_yard.masters_default ]
		}
	}

}
