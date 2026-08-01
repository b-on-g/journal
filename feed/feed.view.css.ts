namespace $.$$ {

	$mol_style_define( $bog_journal_feed_page, {

		flex: {
			direction: 'column',
		},
		gap: '1.5rem',
		padding: {
			top: '2rem',
			bottom: '3rem',
			left: '1rem',
			right: '1rem',
		},
		maxWidth: '64rem',
		minWidth: 0,
		width: '100%',
		margin: {
			left: 'auto',
			right: 'auto',
		},
		boxSizing: 'border-box',

		Head: {
			flex: {
				direction: 'column',
			},
			gap: '0.75rem',
			minWidth: 0,
		},

		Title: {
			font: {
				size: '1.5rem',
				weight: 600,
			},
			minWidth: 0,
			overflowWrap: 'anywhere',
		},

		Subscribe: {
			flex: {
				direction: 'row',
			},
			gap: '0.5rem',
			alignItems: 'center',
			minWidth: 0,
		},

		Subscribe_input: {
			flex: {
				grow: 1,
				shrink: 1,
			},
			minWidth: 0,
		},

		Subscribe_button: {
			flex: {
				shrink: 0,
			},
		},

		Subscribe_error: {
			font: {
				size: '0.875rem',
			},
			color: '#e5484d',

			':empty': {
				display: 'none',
			},
		},

		Sources: {
			flex: {
				direction: 'row',
				wrap: 'wrap',
			},
			gap: '0.5rem',
			alignItems: 'center',
			minWidth: 0,

			':empty': {
				display: 'none',
			},
		},

		/**
		 * Auto-fill grid on a plain view rather than a virtualised list: the
		 * virtualiser measures rows as one column and mispredicts heights in two.
		 */
		Posts: {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
			gap: '1rem',
			alignItems: 'stretch',
			minWidth: 0,
		},

		Empty: {
			textAlign: 'center',
			opacity: 0.5,
			font: {
				size: '0.875rem',
			},
			padding: {
				top: '2rem',
				bottom: '2rem',
				left: 0,
				right: 0,
			},

			':empty': {
				display: 'none',
			},
		},

		'@media': {
			'(max-width: 640px)': {

				gap: '1rem',
				padding: {
					top: '1rem',
					bottom: '2rem',
					left: '0.75rem',
					right: '0.75rem',
				},

				Title: {
					font: {
						size: '1.25rem',
					},
				},

				/** Field and button each take a full row instead of squeezing. */
				Subscribe: {
					flex: {
						direction: 'column',
					},
					alignItems: 'stretch',
				},

				Subscribe_button: {
					justifyContent: 'center',
				},

				Posts: {
					gridTemplateColumns: '1fr',
				},

			},
		},

	} )

	$mol_style_define( $bog_journal_feed_card, {

		flex: {
			direction: 'column',
		},
		minWidth: 0,
		maxWidth: '100%',
		overflow: 'hidden',
		borderRadius: '12px',
		background: {
			color: $mol_theme.card,
		},

		Cover_link: {
			display: 'block',
			flex: {
				shrink: 0,
			},
			minWidth: 0,
			aspectRatio: '16 / 9',
			overflow: 'hidden',
			background: {
				color: $mol_theme.hover,
			},
		},

		Cover: {
			display: 'block',
			width: '100%',
			height: '100%',
			objectFit: 'cover',
		},

		Body: {
			flex: {
				direction: 'column',
				grow: 1,
			},
			gap: '0.5rem',
			padding: {
				top: '0.875rem',
				bottom: '0.875rem',
				left: '0.875rem',
				right: '0.875rem',
			},
			minWidth: 0,
		},

		Title_link: {
			display: 'block',
			font: {
				size: '1.0625rem',
				weight: 600,
			},
			lineHeight: '1.35',
			color: $mol_theme.text,
			textDecoration: 'none',
			minWidth: 0,
			overflowWrap: 'anywhere',

			':hover': {
				color: $mol_theme.focus,
			},

			':focus-visible': {
				outline: 'none',
				box: {
					shadow: [
						{
							inset: false,
							x: 0,
							y: 0,
							blur: 0,
							spread: '2px',
							color: $mol_theme.focus,
						},
					],
				},
			},
		},

		Summary: {
			font: {
				size: '0.875rem',
			},
			lineHeight: '1.4',
			opacity: 0.7,
			minWidth: 0,
			/** Three lines of teaser, cut rather than pushed onto the neighbours. */
			maxHeight: '4.2em',
			overflow: 'hidden',
			overflowWrap: 'anywhere',

			':empty': {
				display: 'none',
			},
		},

		Tags: {
			flex: {
				direction: 'row',
				wrap: 'wrap',
			},
			gap: '0.25rem',
			minWidth: 0,

			':empty': {
				display: 'none',
			},
		},

		Tag: {
			font: {
				size: '0.6875rem',
			},
			color: $mol_theme.shade,
			padding: {
				top: '0.0625rem',
				bottom: '0.0625rem',
				left: '0.375rem',
				right: '0.375rem',
			},
			borderRadius: '999px',
			border: {
				width: '1px',
				style: 'solid',
				color: $mol_theme.line,
			},
			whiteSpace: 'nowrap',
			maxWidth: '100%',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
		},

		/** Pinned to the bottom so cards of different length still line up. */
		Foot: {
			flex: {
				direction: 'row',
			},
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: '0.5rem',
			minWidth: 0,
			margin: {
				top: 'auto',
			},
			padding: {
				top: '0.25rem',
			},
		},

		Author_link: {
			flex: {
				direction: 'row',
				shrink: 1,
			},
			alignItems: 'center',
			gap: '0.375rem',
			minWidth: 0,
			color: $mol_theme.shade,
			textDecoration: 'none',

			':hover': {
				color: $mol_theme.focus,
			},
		},

		Author_name: {
			font: {
				size: '0.8125rem',
			},
			minWidth: 0,
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
		},

		Moment: {
			font: {
				size: '0.75rem',
			},
			opacity: 0.5,
			whiteSpace: 'nowrap',
			flex: {
				shrink: 0,
			},
		},

		'@media': {
			'(max-width: 640px)': {

				borderRadius: '10px',

				Body: {
					padding: {
						top: '0.75rem',
						bottom: '0.75rem',
						left: '0.75rem',
						right: '0.75rem',
					},
				},

				Title_link: {
					font: {
						size: '1rem',
					},
				},

			},
		},

	} )

	$mol_style_define( $bog_journal_feed_avatar, {

		width: '1.5rem',
		height: '1.5rem',
		minWidth: '1.5rem',
		minHeight: '1.5rem',
		flex: {
			shrink: 0,
			grow: 0,
		},
		borderRadius: '50%',
		overflow: 'hidden',
		background: {
			color: $mol_theme.hover,
		},

		Picture: {
			width: '100%',
			height: '100%',
			objectFit: 'cover',
		},

		Fallback: {
			width: '100%',
			height: '100%',
		},

	} )

	$mol_style_define( $bog_journal_feed_source, {

		flex: {
			direction: 'row',
		},
		alignItems: 'center',
		gap: '0.25rem',
		minWidth: 0,
		maxWidth: '100%',
		padding: {
			top: '0.125rem',
			bottom: '0.125rem',
			left: '0.625rem',
			right: '0.25rem',
		},
		borderRadius: '999px',
		background: {
			color: $mol_theme.card,
		},

		Open: {
			display: 'block',
			font: {
				size: '0.875rem',
			},
			minWidth: 0,
			maxWidth: '12rem',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
		},

		Status: {
			font: {
				size: '0.75rem',
			},
			color: $mol_theme.shade,
			whiteSpace: 'nowrap',
			flex: {
				shrink: 0,
			},

			':empty': {
				display: 'none',
			},
		},

		Drop: {
			flex: {
				shrink: 0,
			},
			opacity: 0.4,
			transition: 'opacity 0.15s',

			':hover': {
				opacity: 1,
			},

			':focus-visible': {
				opacity: 1,
			},
		},

		'@media': {
			'(max-width: 640px)': {

				Open: {
					maxWidth: '9rem',
				},

				/** No hover on touch — the way out has to stay visible. */
				Drop: {
					opacity: 1,
				},

			},
		},

	} )

}
