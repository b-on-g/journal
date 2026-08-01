namespace $.$$ {

	/**
	 * Root record kept in the user's own home Land (`glob.home().land()`).
	 * It is the only thing the app needs to bootstrap: it says where this
	 * user's journal lives and which feeds they follow. Everything else is
	 * reachable by link from there.
	 */
	export class $bog_journal_model_home extends $giper_baza_dict.with({

		/** This user's own journal, created lazily via `ensure( preset )`. */
		Journal: $giper_baza_atom_link_to( ()=> $bog_journal_model_author ),

		/** Feeds the user reads. */
		Feeds: $giper_baza_list_link_to( ()=> $bog_journal_model_feed ),

	}) {}

}
