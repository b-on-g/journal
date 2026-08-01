namespace $ {

	$mol_style_define( $bog_journal_post_html, {
		display: 'block',
		minWidth: 0,
		overflowWrap: 'break-word',
	} )

	/**
	 * Inline children are plain DOM nodes rather than $mol views, so they are
	 * reachable only by tag. Scoped to this component, nothing else is touched.
	 */
	$mol_style_attach( 'bog_journal_post_html_inline', `
		[bog_journal_post_html] a {
			color: var(--mol_theme_focus);
			text-decoration: none;
			border-bottom: 1px solid var(--mol_theme_line);
		}

		[bog_journal_post_html] a:hover {
			border-bottom-color: var(--mol_theme_focus);
		}

		[bog_journal_post_html] code {
			font-family: monospace;
			font-size: 0.9em;
			padding: 0.1em 0.3em;
			border-radius: 0.25rem;
			background: var(--mol_theme_card);
		}
	` )

}
