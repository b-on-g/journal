namespace $ {

	/** Inline tags the reader keeps, mapped to the tag it renders. */
	const html_marks: Record< string, string > = {
		b: 'b',
		strong: 'b',
		i: 'i',
		em: 'i',
		u: 'u',
		s: 's',
		strike: 's',
		del: 's',
		code: 'code',
	}

	/** Everything inside these is dropped, content included. */
	const html_drops = new Set( [
		'audio', 'button', 'canvas', 'embed', 'form', 'iframe', 'img', 'input',
		'link', 'math', 'meta', 'noscript', 'object', 'script', 'select', 'style',
		'svg', 'template', 'textarea', 'video',
	] )

	/**
	 * Inline html of a block to live DOM nodes of `doc`, keeping only b/i/u/s/code,
	 * links and line breaks. Nodes are built rather than assigned as innerHTML, so
	 * nothing outside the whitelist can reach the page.
	 */
	export function $bog_journal_post_html_nodes( html: string, doc: Document ): Node[] {
		if( !html.trim() ) return []
		return html_children( $mol_dom_parse( html, 'text/html' ).body, doc )
	}

	function html_children( parent: Node, doc: Document ): Node[] {

		const out: Node[] = []

		for( const node of Array.from( parent.childNodes ) ) {

			if( node.nodeType === 3 ) {
				const text = node.textContent ?? ''
				if( text ) out.push( doc.createTextNode( text.replace( /\u00A0/g, ' ' ) ) )
				continue
			}
			if( node.nodeType !== 1 ) continue

			const el = node as Element
			const tag = el.tagName.toLowerCase()

			if( html_drops.has( tag ) ) continue
			if( tag === 'br' ) { out.push( doc.createElement( 'br' ) ); continue }

			const kids = html_children( el, doc )

			if( tag === 'a' ) {
				const href = html_href( el.getAttribute( 'href' ) ?? '' )
				if( href && kids.length ) { out.push( html_link( href, kids, doc ) ); continue }
				out.push( ... kids )
				continue
			}

			const mark = html_marks[ tag ]
			if( !mark || !kids.length ) { out.push( ... kids ); continue }

			const wrap = doc.createElement( mark )
			for( const kid of kids ) wrap.appendChild( kid )
			out.push( wrap )
		}

		return out
	}

	/**
	 * Article bodies are user content, so an absolute link opens in a new tab and
	 * gets `nofollow noopener`. Same-site links stay plain and remain crawlable.
	 */
	function html_link( href: string, kids: Node[], doc: Document ) {

		const el = doc.createElement( 'a' )
		el.setAttribute( 'href', href )

		if( /^https?:\/\//i.test( href ) ) {
			el.setAttribute( 'target', '_blank' )
			el.setAttribute( 'rel', 'nofollow noopener' )
		}

		for( const kid of kids ) el.appendChild( kid )

		return el
	}

	function html_href( href: string ) {
		const clean = href.trim().replace( /\s+/g, ' ' )
		if( !clean ) return ''
		if( /^(?:javascript|vbscript|data|file):/i.test( clean ) ) return ''
		return clean
	}

}

namespace $.$$ {

	/** Renders the inline html of one block as real child nodes of its own element. */
	export class $bog_journal_post_html extends $.$bog_journal_post_html {

		@ $mol_mem
		override sub() {
			return $bog_journal_post_html_nodes( this.html(), this.$.$mol_dom_context.document )
		}

	}

}
