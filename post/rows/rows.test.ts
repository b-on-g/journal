namespace $ {

	function rows_of( ... blocks: $bog_journal_post_block[] ) {
		return $bog_journal_post_rows( blocks )
	}

	$mol_test( {

		'paragraph keeps its inline markup'() {
			$mol_assert_equal(
				rows_of( { type: 'paragraph', content: 'текст с <b>жирным</b>' } ),
				[ { type: 'paragraph', html: 'текст с <b>жирным</b>' } ],
			)
		},

		'heading level is clamped to three'() {
			const rows = rows_of(
				{ type: 'heading', level: 1, content: 'Раз' },
				{ type: 'heading', level: 3, content: 'Три' },
				{ type: 'heading', level: 9, content: 'Девять' },
				{ type: 'heading', level: 0, content: 'Ноль' },
				{ type: 'heading', content: 'Без уровня' },
			)
			$mol_assert_equal( rows.map( row => row.type === 'heading' ? row.level : 0 ), [ 1, 3, 3, 1, 1 ] )
		},

		'blank blocks disappear'() {
			$mol_assert_equal(
				rows_of(
					{ type: 'paragraph', content: '' },
					{ type: 'paragraph', content: '   ' },
					{ type: 'paragraph', content: '<br>' },
					{ type: 'paragraph', content: '<b></b>' },
					{ type: 'paragraph', content: '&nbsp;' },
					{ type: 'heading', level: 1, content: '<i> </i>' },
					{ type: 'quote', content: '' },
				),
				[],
			)
		},

		'a run of list blocks becomes one list'() {
			$mol_assert_equal(
				rows_of(
					{ type: 'paragraph', content: 'до' },
					{ type: 'list', content: 'раз' },
					{ type: 'list', content: 'два' },
					{ type: 'list', content: '  ' },
					{ type: 'list', content: 'три' },
					{ type: 'paragraph', content: 'после' },
					{ type: 'list', content: 'отдельный' },
				),
				[
					{ type: 'paragraph', html: 'до' },
					{ type: 'list', items: [ 'раз', 'два', 'три' ] },
					{ type: 'paragraph', html: 'после' },
					{ type: 'list', items: [ 'отдельный' ] },
				],
			)
		},

		'a list of only blank items is dropped'() {
			$mol_assert_equal( rows_of( { type: 'list', content: '' }, { type: 'list', content: '<br>' } ), [] )
		},

		'divider needs no content'() {
			$mol_assert_equal( rows_of( { type: 'divider', content: '' } ), [ { type: 'divider' } ] )
		},

		'image block is reduced to source and caption'() {
			$mol_assert_equal(
				rows_of( { type: 'image', content: '<img src="https://x.dev/a.png" alt="схема">' } ),
				[ { type: 'image', src: 'https://x.dev/a.png', alt: 'схема' } ],
			)
		},

		'image keeps a data uri and an escaped source as is'() {
			const data = 'data:image/png;base64,iVBORw0KGgo='
			$mol_assert_equal(
				rows_of( { type: 'image', content: '<img src="' + data + '">' } ),
				[ { type: 'image', src: data, alt: '' } ],
			)
			$mol_assert_equal(
				rows_of( { type: 'image', content: '<img src="?BAZA:file=a_b;name=c.png">' } )[ 0 ],
				{ type: 'image', src: '?BAZA:file=a_b;name=c.png', alt: '' },
			)
			$mol_assert_equal(
				rows_of( { type: 'image', content: "<img alt='a &amp; b' src='/i/p.jpg'>" } )[ 0 ],
				{ type: 'image', src: '/i/p.jpg', alt: 'a & b' },
			)
		},

		'image without a usable source is dropped'() {
			$mol_assert_equal(
				rows_of(
					{ type: 'image', content: '<img alt="нет">' },
					{ type: 'image', content: '<img src="javascript:alert(1)">' },
					{ type: 'image', content: '' },
				),
				[],
			)
		},

		'code is unescaped and its language is taken from the class'() {
			$mol_assert_equal(
				rows_of( { type: 'code', content: '<code class="language-ts">const a = 1 &lt; 2 &amp;&amp; 3 &gt; 2</code>' } ),
				[ { type: 'code', lang: 'ts', text: 'const a = 1 < 2 && 3 > 2' } ],
			)
		},

		'code without a wrapper still works'() {
			$mol_assert_equal(
				rows_of( { type: 'code', content: 'plain &lt;div&gt;' } ),
				[ { type: 'code', lang: '', text: 'plain <div>' } ],
			)
		},

		'double escaping decodes exactly once'() {
			$mol_assert_equal(
				rows_of( { type: 'code', content: '&amp;lt;b&amp;gt;' } )[ 0 ],
				{ type: 'code', lang: '', text: '&lt;b&gt;' },
			)
		},

		'numeric entities in code are decoded'() {
			$mol_assert_equal(
				rows_of( { type: 'code', content: '&#39;a&#x27;b&#39;' } )[ 0 ],
				{ type: 'code', lang: '', text: "'a'b'" },
			)
		},

		'line breaks inside code survive as newlines'() {
			$mol_assert_equal(
				rows_of( { type: 'code', content: 'first<br>second' } )[ 0 ],
				{ type: 'code', lang: '', text: 'first\nsecond' },
			)
		},

		'empty code block is dropped'() {
			$mol_assert_equal( rows_of( { type: 'code', content: '' }, { type: 'code', content: '   ' } ), [] )
		},

		'unknown block type falls back to a paragraph'() {
			$mol_assert_equal(
				rows_of( { type: 'callout', content: 'подсказка' }, { type: '', content: 'без типа' } ),
				[ { type: 'paragraph', html: 'подсказка' }, { type: 'paragraph', html: 'без типа' } ],
			)
		},

		'a whole article keeps its order'() {
			const rows = rows_of(
				{ type: 'heading', level: 1, content: 'Заголовок' },
				{ type: 'paragraph', content: 'Вступление' },
				{ type: 'quote', content: 'Цитата' },
				{ type: 'list', content: 'раз' },
				{ type: 'list', content: 'два' },
				{ type: 'code', content: '<code class="language-js">x()</code>' },
				{ type: 'divider', content: '' },
				{ type: 'image', content: '<img src="/a.png" alt="">' },
				{ type: 'paragraph', content: 'Финал' },
			)
			$mol_assert_equal(
				rows.map( row => row.type ),
				[ 'heading', 'paragraph', 'quote', 'list', 'code', 'divider', 'image', 'paragraph' ],
			)
		},

		'no blocks means no rows'() {
			$mol_assert_equal( $bog_journal_post_rows( [] ), [] )
		},

	} )

}
