namespace $ {

	$mol_style_define( $bog_journal_post_page, {

		display: 'flex',
		flex: { direction: 'column' },
		gap: $mol_gap.block,
		padding: $mol_gap.block,
		maxWidth: '44rem',
		minWidth: 0,
		margin: { left: 'auto', right: 'auto' },
		color: $mol_theme.text,

		Head: {
			display: 'flex',
			flex: { direction: 'column' },
			gap: $mol_gap.text,
			minWidth: 0,
		},

		Cover: {
			width: '100%',
			height: 'auto',
			borderRadius: '0.5rem',
			objectFit: 'cover',
		},

		Title: {
			display: 'block',
			font: { size: '2.25rem', weight: 700 },
			lineHeight: '1.15',
			margin: { top: '0.5rem', bottom: 0, left: 0, right: 0 },
		},

		Summary: {
			display: 'block',
			font: { size: '1.125rem' },
			lineHeight: '1.5',
			color: $mol_theme.shade,
		},

		Byline: {
			display: 'flex',
			flex: { wrap: 'wrap' },
			align: { items: 'center' },
			gap: $mol_gap.text,
			font: { size: '0.875rem' },
			color: $mol_theme.shade,
		},

		Published: {
			display: 'inline-block',
		},

		Draft: {
			display: 'inline-block',
			padding: { top: 0, bottom: 0, left: '0.5rem', right: '0.5rem' },
			borderRadius: '1rem',
			background: { color: $mol_theme.card },
			font: { weight: 500 },
		},

		Author_link: {
			display: 'flex',
			align: { items: 'center' },
			gap: $mol_gap.text,
			padding: { top: '0.125rem', bottom: '0.125rem', left: '0.25rem', right: '0.25rem' },
			color: $mol_theme.text,
			textDecoration: 'none',
		},

		Author_avatar: {
			width: '1.75rem',
			height: '1.75rem',
			borderRadius: '50%',
			objectFit: 'cover',
		},

		Author_name: {
			display: 'block',
			font: { weight: 500 },
		},

		Tags: {
			display: 'flex',
			flex: { wrap: 'wrap' },
			gap: $mol_gap.text,
		},

		Tag: {
			display: 'block',
			padding: { top: '0.125rem', bottom: '0.125rem', left: '0.5rem', right: '0.5rem' },
			borderRadius: '1rem',
			background: { color: $mol_theme.card },
			color: $mol_theme.shade,
			font: { size: '0.8125rem' },
		},

		Body: {
			display: 'flex',
			flex: { direction: 'column' },
			gap: $mol_gap.text,
			minWidth: 0,
			lineHeight: '1.65',
		},

		Heading: {
			display: 'block',
			font: { weight: 700 },
			lineHeight: '1.25',
			margin: { top: '1rem', bottom: 0, left: 0, right: 0 },
		},

		Paragraph: {
			display: 'block',
			margin: 0,
		},

		Quote: {
			display: 'block',
			margin: 0,
			padding: { top: '0.25rem', bottom: '0.25rem', left: '1rem', right: 0 },
			border: { left: { width: '3px', style: 'solid', color: $mol_theme.line } },
			color: $mol_theme.shade,
			font: { style: 'italic' },
		},

		List: {
			display: 'block',
			margin: 0,
			padding: { top: 0, bottom: 0, left: '1.5rem', right: 0 },
		},

		Item: {
			display: 'list-item',
			listStyle: 'disc',
		},

		Code: {
			display: 'block',
			margin: 0,
			padding: '1rem',
			borderRadius: '0.5rem',
			background: { color: $mol_theme.card },
			font: { family: 'monospace', size: '0.875rem' },
			lineHeight: '1.5',
			whiteSpace: 'pre-wrap',
			overflow: { x: 'auto' },
			minWidth: 0,
		},

		Divider: {
			display: 'block',
			height: '1px',
			border: { width: 0, style: 'none' },
			background: { color: $mol_theme.line },
			margin: { top: '0.5rem', bottom: '0.5rem', left: 0, right: 0 },
		},

		Picture: {
			maxWidth: '100%',
			height: 'auto',
			borderRadius: '0.5rem',
			align: { self: 'center' },
		},

		'@media': {
			'(max-width: 40rem)': {
				padding: { top: $mol_gap.text, bottom: $mol_gap.block, left: $mol_gap.text, right: $mol_gap.text },

				Title: {
					font: { size: '1.75rem' },
				},
			},
		},

	} )

}
