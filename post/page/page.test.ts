namespace $.$$ {

	/**
	 * Page fed with rows directly, so nothing here touches Giper Baza. An empty
	 * `post_link` keeps `post()` at null, which makes every model read a no-op.
	 */
	function page_of( $: $, rows: readonly $bog_journal_post_row[], config: Record< string, unknown > = {} ) {
		return $bog_journal_post_page.make( { $, rows: ()=> rows, ... config } )
	}

	function markup_of( $: $, rows: readonly $bog_journal_post_row[] ) {
		return ( page_of( $, rows ).Body().dom_tree() as HTMLElement ).innerHTML
	}

	$mol_test( {

		'body headings render as real h2 h3 h4 under the h1 title'( $ ) {
			const html = markup_of( $, [
				{ type: 'heading', level: 1, html: 'Раз' },
				{ type: 'heading', level: 2, html: 'Два' },
				{ type: 'heading', level: 3, html: 'Три' },
			] )
			$mol_assert_equal( /<h2[^>]*>Раз<\/h2>/.test( html ), true )
			$mol_assert_equal( /<h3[^>]*>Два<\/h3>/.test( html ), true )
			$mol_assert_equal( /<h4[^>]*>Три<\/h4>/.test( html ), true )
		},

		'every block type gets the element a crawler expects'( $ ) {
			const html = markup_of( $, [
				{ type: 'paragraph', html: 'абзац' },
				{ type: 'quote', html: 'цитата' },
				{ type: 'list', items: [ 'раз', 'два' ] },
				{ type: 'code', lang: 'ts', text: 'const a = 1' },
				{ type: 'divider' },
				{ type: 'image', src: '/a.png', alt: 'схема' },
			] )
			$mol_assert_equal( /<p[^>]*>абзац<\/p>/.test( html ), true )
			$mol_assert_equal( /<blockquote[^>]*>цитата<\/blockquote>/.test( html ), true )
			$mol_assert_equal( /<ul[^>]*>.*<li[^>]*>раз<\/li>.*<li[^>]*>два<\/li>.*<\/ul>/s.test( html ), true )
			$mol_assert_equal( /<pre[^>]*>const a = 1<\/pre>/.test( html ), true )
			$mol_assert_equal( /<hr[^>]*>/.test( html ), true )
			$mol_assert_equal( /<img[^>]*src="\/a\.png"/.test( html ), true )
			$mol_assert_equal( /<img[^>]*alt="схема"/.test( html ), true )
		},

		'the whole body is in the dom, nothing is virtualized away'( $ ) {
			const rows: $bog_journal_post_row[] = []
			for( let i = 0; i < 200; i++ ) rows.push( { type: 'paragraph', html: 'абзац ' + i } )

			const html = markup_of( $, rows )

			$mol_assert_equal( html.includes( 'абзац 0' ), true )
			$mol_assert_equal( html.includes( 'абзац 199' ), true )
			$mol_assert_equal( ( html.match( /<p[^>]*>/g ) ?? [] ).length, 200 )
		},

		'inline markup of a block survives into the element'( $ ) {
			const html = markup_of( $, [ { type: 'paragraph', html: 'а <b>б</b> и <a href="/x">в</a>' } ] )
			$mol_assert_equal( html.includes( '<b>б</b>' ), true )
			$mol_assert_equal( html.includes( '<a href="/x">в</a>' ), true )
		},

		'code language becomes an attribute, absent when unknown'( $ ) {
			$mol_assert_equal(
				markup_of( $, [ { type: 'code', lang: 'ts', text: 'x' } ] ).includes( 'bog_journal_post_lang="ts"' ),
				true,
			)
			$mol_assert_equal(
				markup_of( $, [ { type: 'code', lang: '', text: 'x' } ] ).includes( 'bog_journal_post_lang' ),
				false,
			)
		},

		'the root is an article and the title is the only h1'( $ ) {
			// The byline is left out on purpose: rendering $mol_link needs a location,
			// and the node bundle has none. Its own tests below cover it.
			const page = page_of( $, [ { type: 'heading', level: 1, html: 'Внутри' } ], {
				post_title: ()=> 'Заголовок статьи',
				byline_content: ()=> [],
			} )

			const node = page.dom_tree() as HTMLElement

			$mol_assert_equal( node.tagName.toLowerCase(), 'article' )
			$mol_assert_equal( node.querySelectorAll( 'h1' ).length, 1 )
			$mol_assert_equal( node.querySelector( 'h1' )?.textContent, 'Заголовок статьи' )
			$mol_assert_equal( node.querySelector( 'header' ) !== null, true )
		},

		/**
		 * Asserted without rendering: $mol_state_arg has no href in the node bundle,
		 * so $mol_link cannot build a uri there. What this module owns is the choice
		 * of $mol_link over a click handler, and the route it points at.
		 */
		'the author profile is an anchor carrying the author route'( $ ) {
			const page = page_of( $, [], {
				author_id: ()=> 'aaaa_bbbb',
				author_name: ()=> 'Аня',
			} )

			const link = page.Author_link()

			$mol_assert_equal( link instanceof $mol_link, true )
			$mol_assert_equal( link.dom_name(), 'a' )
			$mol_assert_equal( link.arg(), { author: 'aaaa_bbbb', post: null } )
			$mol_assert_equal( page.author_label(), 'Аня' )
		},

		'publication date is a machine readable time element'( $ ) {
			const page = page_of( $, [], { published_ms: ()=> Date.UTC( 2026, 6, 15, 12 ) } )

			const time = page.Published().dom_tree() as HTMLElement
			const stamp = time.getAttribute( 'datetime' ) ?? ''

			$mol_assert_equal( time.tagName.toLowerCase(), 'time' )
			$mol_assert_equal( /^\d{4}-\d{2}-\d{2}$/.test( stamp ), true )
			$mol_assert_equal( time.textContent, stamp )
		},

		'an unpublished post shows a draft marker instead of a date'( $ ) {
			const draft = page_of( $, [] )
			$mol_assert_equal( draft.byline_content()[ 0 ] === draft.Draft(), true )

			const live = page_of( $, [], { published_ms: ()=> Date.UTC( 2026, 6, 15, 12 ) } )
			$mol_assert_equal( live.byline_content()[ 0 ] === live.Published(), true )
		},

		'meta stays readable when the author has no name yet'( $ ) {
			const page = page_of( $, [], { post_title: ()=> 'Тема', author_name: ()=> '' } )
			$mol_assert_equal( page.meta().title, 'Тема' )
		},

		'meta carries title, description, canonical and the article type'( $ ) {
			const page = page_of( $, [], {
				post_title: ()=> 'Как это работает',
				post_summary: ()=> 'Короткое описание',
				author_name: ()=> 'Аня',
				canonical: ()=> 'https://b-on-g.github.io/journal/author=a/post=b',
			} )

			const meta = page.meta()

			$mol_assert_equal( meta.title, 'Как это работает — Аня' )
			$mol_assert_equal( meta.og_title, 'Как это работает — Аня' )
			$mol_assert_equal( meta.description, 'Короткое описание' )
			$mol_assert_equal( meta.og_description, 'Короткое описание' )
			$mol_assert_equal( meta.canonical, 'https://b-on-g.github.io/journal/author=a/post=b' )
			$mol_assert_equal( meta.og_type, 'article' )
		},

		'meta reaches the dom as data-bog-meta on the root'( $ ) {
			const page = page_of( $, [], {
				post_title: ()=> 'Тема',
				author_name: ()=> 'Аня',
				byline_content: ()=> [],
			} )

			const raw = ( page.dom_tree() as HTMLElement ).getAttribute( 'data-bog-meta' )

			$mol_assert_equal( typeof raw, 'string' )
			$mol_assert_equal( JSON.parse( raw ?? '{}' ).title, 'Тема — Аня' )
		},

		'og:image is dropped when no node can serve the file'( $ ) {
			const page = page_of( $, [], { file_base: ()=> '' } )
			$mol_assert_equal( page.meta().og_image, '' )
			$mol_assert_equal( 'og_image' in ( $bog_meta_compact( page.meta() ) ?? {} ), false )
		},

	} )

}
