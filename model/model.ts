namespace $ {

	/**
	 * Giper Baza node every journal syncs through.
	 *
	 * Lives in the model layer rather than in the app because the catalogue
	 * bootstrap page needs the very same node: a catalogue created against some
	 * other master would be invisible to every reader. One string, one place to
	 * change it when the node moves.
	 */
	export const $bog_journal_model_master = 'https://baza.87.120.36.150.ip.giper.dev/'

}
