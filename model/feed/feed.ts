namespace $.$$ {

	/**
	 * A subscription list: several authors' journals merged into one timeline.
	 * Kept as its own pawn so a feed can be shared by link, or kept private in
	 * the reader's home Land.
	 */
	export class $bog_journal_model_feed extends $giper_baza_dict.with({

		Title: $giper_baza_atom_text,

		/** Journals this feed aggregates. */
		Authors: $giper_baza_list_link_to( ()=> $bog_journal_model_author ),

	}) {}

}
