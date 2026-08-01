namespace $ {

	/**
	 * View-ready snapshot of one post.
	 *
	 * Deliberately free of Giper Baza objects: the timeline is merged and sorted
	 * by a pure function, so that logic can be tested without a Land — and a
	 * plain record compares deep-equal, which keeps the atom holding it from
	 * invalidating the whole feed on every re-read.
	 */
	export type $bog_journal_feed_item = {

		/** Link of the post metadata pawn. Identity of the item. */
		readonly post: string

		/** Link of the journal the post came from. */
		readonly author: string

		readonly author_name: string

		/** Link of the author's avatar file pawn, '' when there is none. */
		readonly avatar: string

		readonly title: string
		readonly summary: string

		/** Link of the cover file pawn, '' when there is none. */
		readonly cover: string

		/** Publication time, ms since epoch. Never 0 in a merged timeline. */
		readonly published: number

		readonly tags: readonly string[]

	}

	/** What one journal contributes to the timeline at this moment. */
	export type $bog_journal_feed_slice = {

		/** `wait` — Land still syncing, `fail` — unreachable, `live` — merged in. */
		readonly status: 'wait' | 'fail' | 'live'

		readonly name: string

		readonly items: readonly $bog_journal_feed_item[]

	}

	/**
	 * Merge per-journal slices into one timeline, freshest first.
	 *
	 * Drafts never reach a feed, not even the reader's own: a feed is a public
	 * surface and an unpublished post has no date to sort by. Posts are deduped
	 * by link, so a journal listed twice in the same feed still shows once.
	 */
	export function $bog_journal_feed_merge(
		slices: readonly ( readonly $bog_journal_feed_item[] )[],
	): readonly $bog_journal_feed_item[] {

		const seen = new Set< string >()
		const flat = [] as $bog_journal_feed_item[]

		for( const slice of slices ) {
			for( const item of slice ) {
				if( !item.post ) continue
				if( !( item.published > 0 ) ) continue
				if( seen.has( item.post ) ) continue
				seen.add( item.post )
				flat.push( item )
			}
		}

		return flat.sort( ( left, right )=> {
			if( right.published !== left.published ) return right.published - left.published
			// Same millisecond: fall back to the link, so every peer and every
			// re-render agree on the order instead of shuffling the two cards.
			return left.post < right.post ? -1 : left.post > right.post ? 1 : 0
		} )

	}

	/**
	 * Pull a Land link out of whatever the reader pasted: a bare link, or a full
	 * app URL carrying `author=…` — hash routing and path routing alike.
	 * Returns '' when the input holds no well-formed link.
	 */
	export function $bog_journal_feed_link_parse( raw: string ): string {

		const text = ( raw ?? '' ).trim()
		if( !text ) return ''

		// A tagged segment wins over the tail: an app URL ends with the post id,
		// but what identifies the journal is the `author=` part.
		const tagged = /(?:^|[?#!/&])(?:author|journal|feed)=([^/&?#\s]+)/.exec( text )
		const guess = tagged?.[1] ?? text.split( /[?#!/&\s]+/ ).filter( Boolean ).pop() ?? ''

		const link = guess.replace( /_+$/, '' )

		// Same shape $giper_baza_link accepts: up to four base64ae groups of 8.
		if( !/^[a-zæA-ZÆ0-9]{8}(_[a-zæA-ZÆ0-9]{8}){0,3}$/.test( link ) ) return ''

		return link

	}

}
