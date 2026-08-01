namespace $.$$ {

	/**
	 * Post metadata. Lives as a local pawn inside the author's journal Land, so
	 * listing a journal costs exactly one Land sync.
	 *
	 * The body is NOT duplicated here: `Page` points at the root pawn of a
	 * separate Land holding a $bog_wysiwyg_model_page, which is what the editor
	 * reads and writes.
	 */
	export class $bog_journal_model_post extends $giper_baza_dict.with({

		Title: $giper_baza_atom_text,

		/** URL-friendly id, unique within one journal. */
		Slug: $giper_baza_atom_text,

		/** Short teaser for lists, feeds and social cards. */
		Summary: $giper_baza_atom_text,

		/** Cover image. File pawn lives inside the journal Land. */
		Cover: $giper_baza_atom_link_to( ()=> $giper_baza_file ),

		/** Publication time, ms since epoch. `0` (or absent) means draft. */
		Published: $giper_baza_atom_real,

		Tags: $giper_baza_list_str,

		/** Root pawn of the separate Land that holds the post body. */
		Page: $giper_baza_atom_link_to( ()=> $bog_wysiwyg_model_page ),

	}) {

		/** A post counts as published once it has a non-zero timestamp. */
		published() {
			return ( this.Published()?.val() ?? 0 ) > 0
		}

	}

}
