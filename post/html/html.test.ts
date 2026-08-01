namespace $ {

	/** Serializes the produced nodes so a test can assert on plain markup. */
	function html_of( source: string ) {
		const doc = $mol_dom_context.document
		const box = doc.createElement( 'div' )
		for( const node of $bog_journal_post_html_nodes( source, doc ) ) box.appendChild( node )
		return box.innerHTML
	}

	$mol_test( {

		'plain text passes through'() {
			$mol_assert_equal( html_of( 'просто текст' ), 'просто текст' )
		},

		'the inline set the editor writes survives'() {
			$mol_assert_equal(
				html_of( '<b>ж</b><i>к</i><u>п</u><s>з</s><code>c</code><br>хвост' ),
				'<b>ж</b><i>к</i><u>п</u><s>з</s><code>c</code><br>хвост',
			)
		},

		'strong em del map onto the same four tags'() {
			$mol_assert_equal(
				html_of( '<strong>a</strong><em>b</em><del>c</del><strike>d</strike>' ),
				'<b>a</b><i>b</i><s>c</s><s>d</s>',
			)
		},

		'unknown wrappers are unwrapped, their text stays'() {
			$mol_assert_equal( html_of( '<span style="color:red">видно</span>' ), 'видно' )
			$mol_assert_equal( html_of( '<div><font size="3">видно</font></div>' ), 'видно' )
		},

		'nesting is preserved'() {
			$mol_assert_equal( html_of( '<b>ж и <i>к</i></b>' ), '<b>ж и <i>к</i></b>' )
		},

		'a same-site link stays a plain crawlable anchor'() {
			$mol_assert_equal(
				html_of( '<a href="/journal/post=abc">другая статья</a>' ),
				'<a href="/journal/post=abc">другая статья</a>',
			)
		},

		'an absolute link gets nofollow noopener and a new tab'() {
			$mol_assert_equal(
				html_of( '<a href="https://example.com/a">туда</a>' ),
				'<a href="https://example.com/a" target="_blank" rel="nofollow noopener">туда</a>',
			)
		},

		'an unsafe href is unwrapped to its text'() {
			$mol_assert_equal( html_of( '<a href="javascript:alert(1)">клик</a>' ), 'клик' )
			$mol_assert_equal( html_of( '<a href="data:text/html,<b>x</b>">клик</a>' ), 'клик' )
			$mol_assert_equal( html_of( '<a>без адреса</a>' ), 'без адреса' )
		},

		'scripts, styles and images never reach the page'() {
			$mol_assert_equal( html_of( 'до<script>alert(1)</script>после' ), 'допосле' )
			$mol_assert_equal( html_of( 'до<style>b{color:red}</style>после' ), 'допосле' )
			$mol_assert_equal( html_of( 'до<img src="x.png" onerror="alert(1)">после' ), 'допосле' )
			$mol_assert_equal( html_of( '<iframe src="https://evil.dev"></iframe>' ), '' )
		},

		'attributes other than href are dropped'() {
			$mol_assert_equal(
				html_of( '<b class="c1 c2" data-id="7" style="color:red" onclick="alert(1)">ж</b>' ),
				'<b>ж</b>',
			)
			$mol_assert_equal(
				html_of( '<a href="/x" onclick="alert(1)" class="c1">т</a>' ),
				'<a href="/x">т</a>',
			)
		},

		'text is escaped, never re-parsed as markup'() {
			$mol_assert_equal( html_of( '&lt;script&gt;alert(1)&lt;/script&gt;' ), '&lt;script&gt;alert(1)&lt;/script&gt;' )
			$mol_assert_equal( html_of( 'a &amp; b' ), 'a &amp; b' )
		},

		'an empty inline tag is dropped'() {
			$mol_assert_equal( html_of( '<b></b>текст<i></i>' ), 'текст' )
		},

		'nothing in means nothing out'() {
			$mol_assert_equal( $bog_journal_post_html_nodes( '', $mol_dom_context.document ), [] )
			$mol_assert_equal( $bog_journal_post_html_nodes( '   ', $mol_dom_context.document ), [] )
		},

	} )

}
