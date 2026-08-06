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

	/** Stand-in for a block pawn carrying only what `blocks()` reads off it. */
	function block_pawn( link: string, content: string ) {
		return {
			link: ()=> ( { str: link } ),
			Type: ()=> ( { text: ()=> 'paragraph' } ),
			Level: ()=> null,
			Content: ()=> ( { val: ()=> content } ),
		}
	}

	/** Page whose article Land hands back exactly this order of blocks. */
	function page_over( $: $, pawns: readonly ReturnType< typeof block_pawn >[] ) {
		const post = {
			Page: ()=> ( { remote: ()=> ( { Blocks: ()=> ( { remote_list: ()=> pawns } ) } ) } ),
		}
		return $bog_journal_post_page.make( {
			$,
			post: ()=> post as unknown as $bog_journal_model_post,
		} )
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

		'a block the order names twice is read once, at its first place'( $ ) {
			const first = block_pawn( 'a', 'раз' )
			const page = page_over( $, [ first, block_pawn( 'b', 'два' ), first, block_pawn( 'c', 'три' ) ] )
			$mol_assert_equal( page.blocks().map( block => block.content ).join( ' ' ), 'раз два три' )
		},

		'the same block reached through two pawn objects still counts once'( $ ) {
			const page = page_over( $, [ block_pawn( 'a', 'раз' ), block_pawn( 'a', 'раз' ) ] )
			$mol_assert_equal( page.blocks().length, 1 )
		},

	} )

}
