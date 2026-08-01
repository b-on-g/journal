namespace $.$$ {

	$mol_style_define( $bog_journal_app, {

		// $mol_scroll ships `contain: content`, and paint containment makes the
		// scroller a containing block for `position: fixed`. Every popup opened
		// from inside the page then lays itself out against the scroller instead
		// of the viewport and gets clipped by it: the editor's slash menu came out
		// two items tall, the markdown export bubble stuck to the top edge with
		// its "copy" button past the right one. Style containment alone keeps the
		// isolation that matters here and leaves fixed positioning alone.
		Body: {
			contain: 'style',
		},

		// The caption is an article title now, not the word "Post", so it can run
		// long. Left alone it pushes the whole toolbar onto a second and third row
		// on a phone; one line with an ellipsis costs nothing, the full text is on
		// the page right below anyway.
		Title: {
			display: 'block',
			minWidth: 0,
			flex: {
				shrink: 1,
			},
			whiteSpace: 'nowrap',
			overflow: {
				x: 'hidden',
			},
			textOverflow: 'ellipsis',
		},

		// The toolbar carries the whole navigation, so on a narrow screen it has
		// to wrap instead of pushing the page into a horizontal scroll.
		Tools: {
			flex: {
				wrap: 'wrap',
			},
			align: {
				items: 'center',
			},
			gap: '0.25rem',
			minWidth: 0,
		},

		Nav_feed: {
			padding: {
				top: '0.375rem',
				bottom: '0.375rem',
				left: '0.625rem',
				right: '0.625rem',
			},
			borderRadius: '6px',
		},

		Nav_profile: {
			padding: {
				top: '0.375rem',
				bottom: '0.375rem',
				left: '0.625rem',
				right: '0.625rem',
			},
			borderRadius: '6px',
		},

		Nav_read: {
			padding: {
				top: '0.375rem',
				bottom: '0.375rem',
				left: '0.625rem',
				right: '0.625rem',
			},
			borderRadius: '6px',
		},

		Nav_edit: {
			padding: {
				top: '0.375rem',
				bottom: '0.375rem',
				left: '0.625rem',
				right: '0.625rem',
			},
			borderRadius: '6px',
			font: {
				weight: 600,
			},
		},

		Start: {
			flex: {
				direction: 'column',
			},
			gap: '0.75rem',
			align: {
				items: 'center',
			},
			padding: {
				top: '4rem',
				bottom: '4rem',
				left: '1rem',
				right: '1rem',
			},
			minWidth: 0,
		},

		Start_title: {
			font: {
				size: '1.25rem',
				weight: 600,
			},
		},

		Start_hint: {
			opacity: 0.6,
			textAlign: 'center',
		},

		Start_button: {
			margin: {
				top: '0.5rem',
			},
		},

		// Three navigation links and three icon controls come to a few pixels over
		// a 390px row, and the odd one out drops to a line of its own. Tighter
		// padding buys back more than enough.
		'@media': {
			'(max-width: 640px)': {

				Nav_feed: {
					padding: {
						left: '0.375rem',
						right: '0.375rem',
					},
				},

				Nav_profile: {
					padding: {
						left: '0.375rem',
						right: '0.375rem',
					},
				},

				Nav_read: {
					padding: {
						left: '0.375rem',
						right: '0.375rem',
					},
				},

				Nav_edit: {
					padding: {
						left: '0.375rem',
						right: '0.375rem',
					},
				},

			},
		},

	} )

}
