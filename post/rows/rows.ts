namespace $ {

	/** A block as the editor stores it: type name, optional heading level, html content. */
	export type $bog_journal_post_block = {
		type: string
		level?: number
		content: string
	}

	/**
	 * One renderable piece of an article body. A discriminated union so the reader
	 * view can switch over it without casts.
	 */
	export type $bog_journal_post_row =
		| { type: 'heading', level: number, html: string }
		| { type: 'paragraph', html: string }
		| { type: 'quote', html: string }
		| { type: 'list', items: readonly string[] }
		| { type: 'code', lang: string, text: string }
		| { type: 'divider' }
		| { type: 'image', src: string, alt: string }

	/**
	 * Stored blocks to rows for the reader view. Pure: no DOM, no storage, no
	 * editor. Blank blocks disappear, a run of list blocks collapses into one
	 * list, and an image block is reduced to its source and caption.
	 */
	export function $bog_journal_post_rows( blocks: readonly $bog_journal_post_block[] ): $bog_journal_post_row[] {

		const rows: $bog_journal_post_row[] = []

		for( let i = 0; i < blocks.length; i++ ) {

			const block = blocks[ i ]
			const type = block.type || 'paragraph'
			const content = block.content ?? ''

			if( type === 'divider' ) {
				rows.push( { type: 'divider' } )
				continue
			}

			if( type === 'image' ) {
				const src = rows_attr( content, 'src' )
				if( src && rows_src_ok( src ) ) rows.push( { type: 'image', src, alt: rows_attr( content, 'alt' ) } )
				continue
			}

			if( type === 'code' ) {
				const text = rows_code( content )
				if( text ) rows.push( { type: 'code', lang: rows_lang( content ), text } )
				continue
			}

			if( type === 'list' ) {
				const items: string[] = []
				while( i < blocks.length && ( blocks[ i ].type || 'paragraph' ) === 'list' ) {
					const item = ( blocks[ i ].content ?? '' ).trim()
					if( rows_filled( item ) ) items.push( item )
					i++
				}
				i--
				if( items.length ) rows.push( { type: 'list', items } )
				continue
			}

			if( !rows_filled( content ) ) continue
			const html = content.trim()

			if( type === 'heading' ) {
				rows.push( { type: 'heading', level: Math.min( 3, Math.max( 1, Math.round( block.level ?? 1 ) ) ), html } )
				continue
			}

			if( type === 'quote' ) {
				rows.push( { type: 'quote', html } )
				continue
			}

			// paragraph and anything the reader does not know about
			rows.push( { type: 'paragraph', html } )
		}

		return rows
	}

	/** True when there is something besides tags and spaces. */
	function rows_filled( html: string ) {
		return !!html.replace( /<[^>]*>/g, '' ).replace( /&nbsp;/g, ' ' ).replace( /\u00A0/g, ' ' ).trim()
	}

	function rows_attr( html: string, name: string ) {
		const quoted = new RegExp( '\\s' + name + '\\s*=\\s*"([^"]*)"', 'i' ).exec( html )
			?? new RegExp( '\\s' + name + "\\s*=\\s*'([^']*)'", 'i' ).exec( html )
		return quoted ? rows_decode( quoted[ 1 ].trim() ) : ''
	}

	function rows_src_ok( src: string ) {
		return !/^\s*(?:javascript|vbscript|file):/i.test( src )
	}

	/** Language of a code block, taken from the `language-*` class the editor writes. */
	function rows_lang( content: string ) {
		const found = /<code[^>]*\sclass\s*=\s*["'][^"']*(?:language|lang)-([\w+#.-]+)/i.exec( content )
		return found ? found[ 1 ].toLowerCase() : ''
	}

	/**
	 * Plain text of a code block. The editor keeps code html-escaped and may wrap
	 * it in a `<code class="language-…">`, so unwrap first and decode after.
	 */
	function rows_code( content: string ) {
		const inner = /<code[^>]*>([\s\S]*)<\/code>/i.exec( content )
		return rows_decode( ( inner ? inner[ 1 ] : content ).replace( /<br\s*\/?>/gi, '\n' ).replace( /<[^>]*>/g, '' ) )
			.replace( /\s+$/, '' )
	}

	const rows_entities: Record< string, string > = {
		amp: '&',
		lt: '<',
		gt: '>',
		quot: '"',
		apos: "'",
		nbsp: ' ',
	}

	/** Single pass so that `&amp;lt;` decodes to `&lt;` rather than to `<`. */
	function rows_decode( text: string ) {
		return text.replace( /&(#\d+|#[xX][0-9a-fA-F]+|[a-zA-Z]+);/g, ( all, body: string ) => {
			if( body[ 0 ] === '#' ) {
				const code = body[ 1 ] === 'x' || body[ 1 ] === 'X'
					? parseInt( body.slice( 2 ), 16 )
					: parseInt( body.slice( 1 ), 10 )
				return Number.isFinite( code ) && code > 0 && code <= 0x10FFFF ? String.fromCodePoint( code ) : all
			}
			return rows_entities[ body.toLowerCase() ] ?? all
		} )
	}

}
