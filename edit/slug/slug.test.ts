namespace $ {

	$mol_test({

		'latin title collapses to dashes'() {
			$mol_assert_equal( $bog_journal_edit_slug( 'Hello, World!' ), 'hello-world' )
		},

		'cyrillic is transliterated'() {
			$mol_assert_equal( $bog_journal_edit_slug( 'Привет, мир' ), 'privet-mir' )
		},

		'soft sign disappears instead of becoming a dash'() {
			$mol_assert_equal( $bog_journal_edit_slug( 'Пять статей' ), 'pyat-statey' )
		},

		'leading and trailing junk is trimmed'() {
			$mol_assert_equal( $bog_journal_edit_slug( '  --- $mol ---  ' ), 'mol' )
		},

		'the 80 char cut leaves no trailing dash'() {
			const long = 'a'.repeat( 79 ) + ' tail'
			$mol_assert_equal( $bog_journal_edit_slug( long ), 'a'.repeat( 79 ) )
		},

		'empty input stays empty'() {
			$mol_assert_equal( $bog_journal_edit_slug( '' ), '' )
		},

	})

}
