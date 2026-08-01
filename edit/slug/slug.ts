namespace $ {

	/** Cyrillic → latin. Covers Russian plus the Ukrainian letters that differ. */
	const latin: Record< string, string > = {
		а: 'a', б: 'b', в: 'v', г: 'g', ґ: 'g', д: 'd', е: 'e', ё: 'e', є: 'ye',
		ж: 'zh', з: 'z', и: 'i', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l', м: 'm',
		н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h',
		ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e',
		ю: 'yu', я: 'ya',
	}

	/**
	 * URL-friendly name derived from a post title.
	 *
	 * Pure and deterministic on purpose: a post whose Slug was never typed by
	 * hand has no stored value, and every peer re-derives the same string from
	 * the same title instead of one of them having to write it.
	 *
	 * Scripts with no latin mapping (CJK, Arabic, …) reduce to an empty string —
	 * the author is expected to type a slug by hand there.
	 */
	export function $bog_journal_edit_slug( text: string ): string {

		let out = ''
		for( const char of ( text ?? '' ).toLowerCase() ) out += latin[ char ] ?? char

		return out
			.replace( /[^a-z0-9]+/g, '-' )
			.replace( /^-+/, '' )
			.slice( 0, 80 )
			.replace( /-+$/, '' )

	}

}
