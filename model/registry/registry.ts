namespace $ {

	/**
	 * Land holding the public catalogue of journals. One address for everybody:
	 * readers, authors and the CI crawl all read the same Land, so the address
	 * cannot be discovered at runtime — it is pinned here, in the bundle.
	 *
	 * Empty means "no catalogue yet". Registration becomes a no-op, the
	 * directory on the start screen stays hidden, and the crawl falls back to
	 * `deploy/routes/journals.txt`. Nothing breaks — the site simply goes back
	 * to learning about new authors from a text file.
	 *
	 * Filling it in is a one-off: open `model/registry/init`, press the button,
	 * paste the printed link here and drop the downloaded `registry.baza` next
	 * to this file. Details and the reasoning are in `model/registry/readme.md`.
	 */
	export const $bog_journal_model_registry_link: string = ''

	/**
	 * Rights the catalogue Land is created with, used by the bootstrap page.
	 *
	 * `post` for everybody, because registration has to work for an author the
	 * catalogue owner has never heard of — that is the whole point. The PoW rate
	 * is the only thing between the catalogue and a script; `long` (seconds)
	 * makes bulk writes tedious at the cost of a visible pause on journal
	 * creation. The readme lists what to do when a rate stops being enough.
	 */
	export const $bog_journal_model_registry_preset: $giper_baza_rank_preset = [
		[ null, $giper_baza_rank_post( 'slow' ) ],
	]

}

namespace $.$$ {

	/**
	 * Public catalogue of journals: the answer to "which journals exist at all".
	 *
	 * Without it the question has no answer. A journal link lives in its
	 * author's home Land, and a home Land is readable by its owner alone, so
	 * nobody — not another reader, not the crawler — can enumerate journals.
	 * A journal writes itself in here when it is created, and from then on it is
	 * discoverable without anybody editing a file in the repository.
	 *
	 * Entries are links to journal root pawns, exactly the strings the router
	 * puts into `author=`. Duplicates are impossible: `add` on a Baza list is
	 * idempotent by value.
	 */
	export class $bog_journal_model_registry extends $giper_baza_dict.with({

		/** Every journal that has registered itself, in registration order. */
		Journals: $giper_baza_list_link_to( ()=> $bog_journal_model_author ),

	}) {}

}
