namespace $ {

	/**
	 * Merging and link parsing are pure on purpose, so they can be covered here
	 * without touching Giper Baza: a test that opens a Land hangs forever and
	 * takes every MAM build down with it.
	 */

	function item( over: Partial< $bog_journal_feed_item > = {} ): $bog_journal_feed_item {
		return {
			post: 'AAAAAAAA_BBBBBBBB',
			author: 'AAAAAAAA',
			author_name: 'Author',
			avatar: '',
			title: 'Title',
			summary: '',
			cover: '',
			published: 1,
			tags: [],
			... over,
		}
	}

	$mol_test({

		'merge orders posts newest first'() {

			const merged = $bog_journal_feed_merge([
				[ item({ post: 'a', published: 100 }), item({ post: 'b', published: 300 }) ],
				[ item({ post: 'c', published: 200 }) ],
			])

			$mol_assert_equal( merged.map( post => post.post ).join( ' ' ), 'b c a' )

		},

		'merge drops drafts from every journal'() {

			const merged = $bog_journal_feed_merge([
				[ item({ post: 'a', published: 0 }) ],
				[ item({ post: 'b', published: 5 }), item({ post: 'c', published: 0 }) ],
			])

			$mol_assert_equal( merged.map( post => post.post ).join( ' ' ), 'b' )

		},

		'merge drops items without a link'() {

			const merged = $bog_journal_feed_merge([
				[ item({ post: '', published: 9 }), item({ post: 'a', published: 8 }) ],
			])

			$mol_assert_equal( merged.map( post => post.post ).join( ' ' ), 'a' )

		},

		'merge dedupes the same post listed twice'() {

			const merged = $bog_journal_feed_merge([
				[ item({ post: 'a', published: 100, author_name: 'First' }) ],
				[ item({ post: 'a', published: 100, author_name: 'Second' }) ],
			])

			$mol_assert_equal( merged.length, 1 )
			$mol_assert_equal( merged[0].author_name, 'First' )

		},

		'merge breaks a timestamp tie by link'() {

			const merged = $bog_journal_feed_merge([
				[ item({ post: 'zz', published: 7 }) ],
				[ item({ post: 'aa', published: 7 }) ],
			])

			$mol_assert_equal( merged.map( post => post.post ).join( ' ' ), 'aa zz' )

		},

		'merge of nothing is empty'() {

			$mol_assert_equal( $bog_journal_feed_merge([]).length, 0 )
			$mol_assert_equal( $bog_journal_feed_merge([ [], [] ]).length, 0 )

		},

		'merge keeps a slow journal from hiding the ready ones'() {

			// An unfinished Land contributes an empty slice, never an exception.
			const merged = $bog_journal_feed_merge([
				[],
				[ item({ post: 'a', published: 1 }) ],
				[],
			])

			$mol_assert_equal( merged.map( post => post.post ).join( ' ' ), 'a' )

		},

		'link parse takes a bare link as is'() {

			$mol_assert_equal( $bog_journal_feed_link_parse( 'AAAAAAAA_BBBBBBBB' ), 'AAAAAAAA_BBBBBBBB' )
			$mol_assert_equal( $bog_journal_feed_link_parse( '  AAAAAAAA  ' ), 'AAAAAAAA' )

		},

		'link parse pulls the journal out of an app url'() {

			$mol_assert_equal(
				$bog_journal_feed_link_parse( 'https://b-on-g.dev/journal/author=AAAAAAAA_BBBBBBBB' ),
				'AAAAAAAA_BBBBBBBB',
			)

			$mol_assert_equal(
				$bog_journal_feed_link_parse( 'https://b-on-g.dev/#!author=AAAAAAAA_BBBBBBBB/post=CCCCCCCC' ),
				'AAAAAAAA_BBBBBBBB',
			)

		},

		'link parse trims the empty tail groups'() {

			$mol_assert_equal( $bog_journal_feed_link_parse( 'AAAAAAAA_BBBBBBBB__' ), 'AAAAAAAA_BBBBBBBB' )

		},

		'link parse rejects anything malformed'() {

			$mol_assert_equal( $bog_journal_feed_link_parse( '' ), '' )
			$mol_assert_equal( $bog_journal_feed_link_parse( '   ' ), '' )
			$mol_assert_equal( $bog_journal_feed_link_parse( 'not a link' ), '' )
			$mol_assert_equal( $bog_journal_feed_link_parse( 'AAAA' ), '' )
			$mol_assert_equal( $bog_journal_feed_link_parse( 'AAAAAAAA_BBBB' ), '' )
			$mol_assert_equal( $bog_journal_feed_link_parse( 'https://b-on-g.dev/journal/' ), '' )

		},

	})

}
