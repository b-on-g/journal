namespace $.$$ {

	$mol_style_define( $bog_journal_edit_page, {

		flex: {
			direction: 'column',
		},
		gap: '1.5rem',
		padding: {
			top: '1.5rem',
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

		Denied: {
			textAlign: 'center',
			opacity: 0.6,
			padding: {
				top: '3rem',
				bottom: '3rem',
			},
		},

		Meta: {
			flex: {
				direction: 'column',
			},
			gap: '0.75rem',
			minWidth: 0,
		},

		Title_field: {
			font: {
				size: '1.35rem',
				weight: 600,
			},
		},

		Slug_row: {
			gap: '0.5rem',
			align: {
				items: 'center',
			},
			minWidth: 0,
		},

		Slug_field: {
			flex: {
				grow: 1,
			},
			minWidth: 0,
			font: {
				family: 'monospace',
				size: '0.875rem',
			},
		},

		Summary_field: {
			minWidth: 0,
		},

		Cover: {
			flex: {
				direction: 'row',
				wrap: 'wrap',
			},
			gap: '0.5rem',
			align: {
				items: 'center',
			},
			minWidth: 0,
		},

		Cover_image: {
			maxWidth: '12rem',
			maxHeight: '8rem',
			objectFit: 'cover',
			borderRadius: '8px',
		},

		Tags: {
			flex: {
				direction: 'column',
			},
			gap: '0.5rem',
			minWidth: 0,
		},

		Tag_list: {
			flex: {
				direction: 'row',
				wrap: 'wrap',
			},
			gap: '0.375rem',
		},

		Tag_form: {
			gap: '0.5rem',
			minWidth: 0,
		},

		Tag_draft: {
			flex: {
				grow: 1,
			},
			minWidth: 0,
		},

		Publish: {
			flex: {
				direction: 'column',
			},
			gap: '0.25rem',
			padding: {
				top: '0.75rem',
				bottom: '0.75rem',
				left: '0.75rem',
				right: '0.75rem',
			},
			borderRadius: '8px',
			background: {
				color: $mol_theme.card,
			},
			minWidth: 0,
		},

		Publish_row: {
			align: {
				items: 'center',
			},
			gap: '0.75rem',
			flex: {
				wrap: 'wrap',
			},
		},

		Published_at: {
			font: {
				size: '0.8rem',
			},
			opacity: 0.6,
		},

		Publish_note: {
			font: {
				size: '0.75rem',
			},
			opacity: 0.6,
		},

		Body: {
			minWidth: 0,
			border: {
				top: {
					width: '1px',
					style: 'solid',
					color: $mol_theme.line,
				},
			},
			padding: {
				top: '1rem',
			},
		},

	} )

	$mol_style_define( $bog_journal_edit_text, {
		font: {
			family: 'inherit',
		},
		minHeight: '4.5rem',
	} )

	$mol_style_define( $bog_journal_edit_chip, {

		align: {
			items: 'center',
		},
		gap: '0.25rem',
		padding: {
			top: '0.125rem',
			bottom: '0.125rem',
			left: '0.5rem',
			right: '0.25rem',
		},
		borderRadius: '999px',
		background: {
			color: $mol_theme.card,
		},
		minWidth: 0,

		Label: {
			font: {
				size: '0.8rem',
			},
			whiteSpace: 'nowrap',
		},

	} )

}
