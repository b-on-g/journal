namespace $.$$ {

	/**
	 * An author's journal. One journal = one Land, created with a
	 * `[[ null, read ]]` preset so anybody (including logged-out readers) can
	 * pull it from the master node. The author holds `rule` through the Gift
	 * that `land_grab` writes for the current pass.
	 *
	 * Only post *metadata* lives here — a post body is a separate Land, see
	 * `Page` on $bog_journal_model_post.
	 */
	export class $bog_journal_model_author extends $giper_baza_dict.with({

		/** Display name shown in the header and in feeds. */
		Name: $giper_baza_atom_text,

		/** Free-form multiline description of the author. */
		Bio: $giper_baza_atom_text,

		/** Profile picture. File pawn lives inside this same Land. */
		Avatar: $giper_baza_atom_link_to( ()=> $giper_baza_file ),

		/** Social links, one absolute URL per item. */
		Links: $giper_baza_list_str,

		/** Donation URL. Stored now, rendered later. */
		Donate: $giper_baza_atom_text,

		/** Post metadata pawns, in creation order. */
		Posts: $giper_baza_list_link_to( ()=> $bog_journal_model_post ),

	}) {}

}
