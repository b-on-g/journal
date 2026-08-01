namespace $.$$ {

	$mol_style_define( $bog_journal_profile, {

		flex: {
			direction: 'column',
		},
		gap: '2rem',
		padding: {
			top: '2rem',
			bottom: '2rem',
			left: '1rem',
			right: '1rem',
		},
		maxWidth: '48rem',
		minWidth: 0,
		width: '100%',
		margin: {
			left: 'auto',
			right: 'auto',
		},
		boxSizing: 'border-box',

		Card: {
			flex: {
				direction: 'column',
			},
			gap: '1rem',
			align: {
				items: 'center',
			},
			minWidth: 0,
		},

		Avatar_circle: {
			borderRadius: '50%',
			overflow: {
				x: 'hidden',
				y: 'hidden',
			},
			width: '96px',
			height: '96px',
			minWidth: '96px',
			minHeight: '96px',
			maxWidth: '96px',
			maxHeight: '96px',
			flex: {
				shrink: 0,
				grow: 0,
			},
			background: {
				color: $mol_theme.card,
			},
		},

		Avatar_image: {
			width: '100%',
			height: '100%',
			objectFit: 'cover',
		},

		Avatar_icon: {
			width: '100%',
			height: '100%',
			font: {
				size: '2.5rem',
			},
		},

		Avatar_open: {
			font: {
				size: '0.75rem',
			},
			opacity: 0.6,
		},

		Name_input: {
			font: {
				size: '1.5rem',
				weight: 600,
			},
			textAlign: 'center',
		},

		Name_label: {
			font: {
				size: '1.5rem',
				weight: 600,
			},
			textAlign: 'center',
		},

		Bio_input: {
			width: '100%',
			minWidth: 0,
		},

		Bio_label: {
			textAlign: 'center',
			opacity: 0.75,
			whiteSpace: 'pre-wrap',
		},

		Links_section: {
			flex: {
				direction: 'column',
			},
			gap: '0.5rem',
			width: '100%',
			minWidth: 0,
		},

		Links_list: {
			flex: {
				direction: 'row',
				wrap: 'wrap',
			},
			gap: '0.5rem',
			justify: {
				content: 'center',
			},
		},

		Link_form: {
			gap: '0.5rem',
			minWidth: 0,
		},

		Link_draft: {
			flex: {
				grow: 1,
			},
			minWidth: 0,
		},

		Posts_section: {
			flex: {
				direction: 'column',
			},
			gap: '0.75rem',
			width: '100%',
			minWidth: 0,
		},

		Posts_head: {
			align: {
				items: 'center',
			},
			justify: {
				content: 'space-between',
			},
			gap: '0.5rem',
		},

		Posts_title: {
			font: {
				size: '1.15rem',
				weight: 600,
			},
		},

		Posts_list: {
			gap: '0.5rem',
		},

		Posts_empty: {
			textAlign: 'center',
			opacity: 0.5,
			font: {
				size: '0.875rem',
			},
			padding: {
				top: '1rem',
				bottom: '1rem',
			},
		},

	} )

	$mol_style_define( $bog_journal_profile_text, {
		font: {
			family: 'inherit',
		},
		minHeight: '6rem',
	} )

	$mol_style_define( $bog_journal_profile_link, {

		align: {
			items: 'center',
		},
		gap: '0.25rem',
		padding: {
			top: '0.125rem',
			bottom: '0.125rem',
			left: '0.5rem',
			right: '0.5rem',
		},
		borderRadius: '999px',
		background: {
			color: $mol_theme.card,
		},
		minWidth: 0,

		Open: {
			font: {
				size: '0.875rem',
			},
			whiteSpace: 'nowrap',
			overflow: {
				x: 'hidden',
			},
			textOverflow: 'ellipsis',
			maxWidth: '16rem',
		},

	} )

	$mol_style_define( $bog_journal_profile_post, {

		align: {
			items: 'center',
		},
		justify: {
			content: 'space-between',
		},
		gap: '0.75rem',
		padding: {
			top: '0.625rem',
			bottom: '0.625rem',
			left: '0.75rem',
			right: '0.75rem',
		},
		borderRadius: '8px',
		background: {
			color: $mol_theme.card,
		},
		minWidth: 0,

		Info: {
			flex: {
				direction: 'column',
				grow: 1,
			},
			gap: '0.125rem',
			minWidth: 0,
		},

		Title: {
			font: {
				size: '1rem',
				weight: 600,
			},
		},

		Summary: {
			font: {
				size: '0.875rem',
			},
			opacity: 0.7,
		},

		Details: {
			font: {
				size: '0.75rem',
			},
			opacity: 0.5,
		},

		State: {
			font: {
				size: '0.75rem',
				weight: 600,
			},
			padding: {
				top: '0.125rem',
				bottom: '0.125rem',
				left: '0.5rem',
				right: '0.5rem',
			},
			borderRadius: '999px',
			flex: {
				shrink: 0,
			},
			background: {
				color: $mol_theme.focus,
			},
			color: $mol_theme.back,
		},

		'@': {
			bog_journal_profile_post_draft: {
				true: {
					State: {
						background: {
							color: '#00000000',
						},
						color: $mol_theme.shade,
						border: {
							width: '1px',
							style: 'solid',
							color: $mol_theme.line,
						},
					},
				},
			},
		},

	} )

}
