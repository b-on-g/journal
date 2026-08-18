namespace $.$$ {
	// Синхронизация через Гипер Базу отключена: список мастеров пустой.
	// Чистки одного masters_default мало — masters() склеивает его с пирами
	// из бандленного сида, где зашит публичный мастер. Глушим сам masters().
	$giper_baza_yard.masters_default.length = 0
	$giper_baza_yard.masters = (): string[] => []


	/** Public read preset: anybody, signed in or not, can pull the Land. */
	const public_read: $giper_baza_rank_preset = [[ null, $giper_baza_rank_read ]]

	type Screen = 'edit' | 'post' | 'feed' | 'profile' | 'start'

	/** Значения ключа `section` в адресе. Профиль зовётся `journal`. */
	type Section = 'journal' | 'post' | 'edit' | 'feed' | 'start'

	/**
	 * Metadata strings, plain and unlocalized on purpose. They are read from
	 * attr(), and reaching for $mol_locale there would let a locale that fails to
	 * load take the whole page down instead of one social card. Same rule the
	 * post and profile pages follow.
	 */
	const meta_feed = {
		title: 'Reading feed — Journal',
		description: 'Posts from every journal this feed follows, newest first.',
	}

	const meta_start = {
		title: 'Journal',
		description: 'A journal of your own: posts live in a Land you control and reach readers by sync.',
	}

	export class $bog_journal_app extends $.$bog_journal_app {

		/**
		 * Путевой роутинг: `/journal/section=post/id=…` вместо `#!section=…`.
		 * Краулеры не ходят по `#`-ссылкам, поэтому хеш сделал бы каждую статью
		 * невидимой для поиска.
		 *
		 * Долго не работал на проде: клик менял адрес, но не экран, при этом
		 * стрелки браузера работали, а локальный стенд был чист. Причина
		 * оказалась не в роутере: редактор тянул за собой Blitz Quiz, а тот в
		 * статическом блоке включал ЕЩЁ ОДИН путевой роутер, который подменял
		 * `$mol_state_arg` собой. На localhost он объявлен как no-op — отсюда и
		 * разница между стендом и продом. Зависимость от викторины убрана в
		 * bog/wysiwyg, см. коммит «Отвязать редактор от викторины».
		 */
		static {
			$bog_builderui_router.activate( '/journal/' )
			$bog_journal_app.route_migrate()
		}

		/**
		 * Перевод старых адресов на схему `section` + `id`.
		 *
		 * До неё ключей было четыре — `author`, `post`, `feed`, `edit`, — и уже
		 * разошлись ссылки такого вида. Читаем их один раз при загрузке и
		 * подменяем адрес, не создавая записи в истории: для читателя переход
		 * незаметен, а закладка и внешняя ссылка продолжают работать.
		 */
		static route_migrate() {

			if( typeof window === 'undefined' ) return
			if( typeof document === 'undefined' ) return

			const arg = ( $ as any ).$mol_state_arg
			if( arg.value( 'section' ) ) return

			const author = arg.value( 'author' ) ?? ''
			const post = arg.value( 'post' ) ?? ''
			const feed = arg.value( 'feed' ) ?? ''
			const edit = arg.value( 'edit' ) ?? ''
			if( !author && !post && !feed && !edit ) return

			const next =
				edit ? this.route( 'edit', edit )
				: post ? this.route( 'post', post )
				: feed ? this.route( 'feed', feed )
				: this.route( 'journal', author )

			arg.dict({ ...next, author: null, post: null, feed: null, edit: null })

		}

		/**
		 * Master node this app syncs through. `baza=<url>` in the URL points it at
		 * a local node instead. Registering here rather than at module load keeps
		 * the override readable from $mol_state_arg.
		 */
		@ $mol_mem
		baza_master() {
			const custom = this.$.$mol_state_arg.value( 'baza' ) ?? ''
			const url = custom || $bog_journal_model_master
			const masters = this.$.$giper_baza_yard.masters_default
			if( !masters.includes( url ) ) masters.unshift( url )
			return url
		}

		/** Bootstrap record in the user's own home Land. NOT @$mol_mem. */
		home() {
			return this.$.$giper_baza_glob.home().land().Data( $bog_journal_model_home )
		}

		// === Route ===============================================================

		/** Link to this user's own journal, empty until they create one. */
		@ $mol_mem
		own_journal_link() {
			return this.home().Journal()?.val()?.str ?? ''
		}

		/** This reader's own feed, empty until they start one. */
		@ $mol_mem
		override own_feed_link() {
			const first = this.home().Feeds()?.items()[0]
			return first ? first.str : ''
		}

		/**
		 * Адрес состоит ровно из двух ключей: `section` — какой экран, `id` —
		 * что на нём показать. Так же устроен bog/smalljs (`section` + `page`),
		 * и это не косметика, а условие работоспособности.
		 *
		 * Роутер при клике склеивает ключи ссылки с ключами текущего адреса и
		 * сохраняет всё, чего в ссылке нет. Пока ключей было четыре
		 * (`author`, `post`, `feed`, `edit`), переходы обязаны были их
		 * УБИРАТЬ: уходя из поста в журнал — снять `post`, из редактора в
		 * чтение — снять `edit`. Убрать ключ ссылкой нельзя: `null` в адрес не
		 * попадает вовсе, а склейка читает его отсутствие как «оставить». Отсюда
		 * и брались переходы, меняющие адрес, но не экран.
		 *
		 * С двумя ключами убирать нечего: любой переход задаёт оба явными
		 * значениями, склейка перезаписывает оба, и склеивать ей нечего. Тот же
		 * приём, что делает навигацию smalljs беспроблемной.
		 */
		@ $mol_mem
		section(): Section {
			const raw = this.$.$mol_state_arg.value( 'section' ) ?? ''
			switch( raw ) {
				case 'journal': case 'post': case 'edit': case 'feed': return raw
				default: return 'start'
			}
		}

		/** Ссылка, которую показывает текущая секция. Смысл зависит от секции. */
		@ $mol_mem
		route_id() {
			return this.$.$mol_state_arg.value( 'id' ) ?? ''
		}

		/**
		 * Журнал, который сейчас смотрят.
		 *
		 * Для поста и редактора он не хранится отдельным ключом, а выводится из
		 * ссылки самого поста: пешка поста живёт в ленде своего журнала, то есть
		 * `<ленд>__<пешка>`, и владелец берётся из неё. Один ключ вместо двух,
		 * и рассинхронизоваться им негде.
		 */
		@ $mol_mem
		override author_link( next?: string ) {

			if( next !== undefined ) {
				this.$.$mol_state_arg.go({ section: next ? 'journal' : null, id: next || null })
				return next
			}

			const id = this.route_id()

			switch( this.section() ) {
				case 'journal': return id
				case 'post': case 'edit':
					return id ? new $giper_baza_link( id ).land().str : ''
				default: return this.own_journal_link()
			}
		}

		@ $mol_mem
		override post_link() {
			const section = this.section()
			return section === 'post' || section === 'edit' ? this.route_id() : ''
		}

		@ $mol_mem
		override feed_link() {
			return this.section() === 'feed' ? this.route_id() : ''
		}

		@ $mol_mem
		override edit_link() {
			return this.section() === 'edit' ? this.route_id() : ''
		}

		/**
		 * Экран задан секцией напрямую — гадать по набору ключей больше не надо.
		 * Пустая секция при живой ссылке на свой журнал — это профиль владельца.
		 */
		@ $mol_mem
		screen(): Screen {
			const section = this.section()
			if( section !== 'start' ) return section === 'journal' ? 'profile' : section
			return this.own_journal_link() ? 'profile' : 'start'
		}

		@ $mol_mem
		override app_content() {
			this.baza_master()
			switch( this.screen() ) {
				case 'edit': return [ this.Edit() ]
				case 'post': return [ this.Post() ]
				case 'feed': return [ this.Feed() ]
				case 'profile': return [ this.Profile() ]
				default: return [ this.Start() ]
			}
		}

		/**
		 * What the browser tab, the history entry and the page caption say. On an
		 * article that has to be the article, not the word "Post" — a reader with
		 * five tabs open cannot tell them apart otherwise, and neither can their
		 * bookmarks a week later.
		 *
		 * The title is read straight off the post page, which owns that Land, so
		 * the two never disagree. While the Land is still syncing the read gives
		 * an empty string and the generic caption stands in until it arrives.
		 */
		override screen_title() {
			switch( this.screen() ) {
				case 'edit': return this.title_edit()
				case 'post': return this.post_title() || this.title_post()
				case 'feed': return this.title_feed()
				default: return this.title_journal()
			}
		}

		/** The cast is the usual one: view.tree only knows the generated base. */
		post_title() {
			return ( this.Post() as $.$$.$bog_journal_post_page ).post_title()
		}

		// === Language ============================================================
		//
		// Without a switch the language is decided for the reader by whatever
		// navigator.language happens to say, and the journal's own strings and the
		// ones coming from $mol and the editor can land on different answers. One
		// button, two languages, the choice persisted by $mol_locale in local
		// storage and read reactively by every `@ \…` string on the page.

		@ $mol_action
		lang_toggle( event?: Event ) {
			if( !event ) return null
			const locale = this.$.$mol_locale
			locale.lang( locale.lang() === 'ru' ? 'en' : 'ru' )
			return event
		}

		// === SEO =================================================================

		/**
		 * Absolute url of this page. Under path routing the location already is
		 * the canonical url. Same helper as the post and profile pages.
		 */
		canonical() {
			const loc = this.$.$mol_dom_context.location
			return loc.origin + loc.pathname + loc.search
		}

		/**
		 * Metadata for the two screens that carry none of their own: the feed and
		 * the empty start page. The post and the profile emit theirs from inside,
		 * and since those elements come after the app root in the html,
		 * `$bog_meta_collect` lets them win — so the root stays silent there
		 * instead of leaking a stale title into their card.
		 *
		 * A feed is an encrypted Land nobody else can read, and a crawler would
		 * only ever see it empty, so it gets a generic card rather than its real
		 * title. Marking it `noindex` outright would be better; `$bog_meta_data`
		 * has no field for that yet.
		 */
		meta(): $bog_meta_data {

			const screen = this.screen()
			if( screen !== 'feed' && screen !== 'start' ) return {}

			const text = screen === 'feed' ? meta_feed : meta_start

			return {
				title: text.title,
				description: text.description,
				canonical: this.canonical(),
				og_title: text.title,
				og_description: text.description,
				og_type: 'website',
			}

		}

		override attr() {
			return { ... super.attr(), ... $bog_meta_attr( this ) }
		}

		// === Rights ==============================================================

		/**
		 * Whether the current user may write into the Land holding `link`, which
		 * may name either a journal or a post inside one. Same tier check as the
		 * profile and the editor. Returns a plain boolean, so caching it in an
		 * atom is safe — a Land object never would be.
		 *
		 * The `Name()` read is load-bearing: rights arrive as Gift units with the
		 * rest of the Land, and only a read of actual data makes the Land sync.
		 * Asking for the rank alone would answer "no" on a cold load and never
		 * correct itself.
		 */
		@ $mol_mem_key
		can_edit( link: string ) {
			if( !link ) return false
			const land = this.$.$giper_baza_glob.Land( new $giper_baza_link( link ).land() )
			land.Data( $bog_journal_model_author ).Name()?.val()
			const pass = this.$.$giper_baza_auth.current().pass()
			return $giper_baza_rank_tier_of( land.pass_rank( pass ) ) >= $giper_baza_rank_tier.post
		}

		// === Directory ===========================================================
		//
		// The public catalogue of journals, see model/registry. It answers the one
		// question the data model cannot: which journals exist. A journal link
		// lives in its author's home Land, and a home Land is readable by its owner
		// alone, so without the catalogue every other reader — the crawler
		// included — has to be told about a new author by hand.
		//
		// Baza objects are never cached in an atom here, same rule the profile
		// page follows: glob already caches them, and an atom would own them and
		// destruct them on rebuild.

		/** Catalogue Land, `null` while no catalogue is pinned in the bundle. */
		registry_land() {
			if( !$bog_journal_model_registry_link ) return null
			return this.$.$giper_baza_glob.Land( new $giper_baza_link( $bog_journal_model_registry_link ).land() )
		}

		/** Root record of the catalogue. */
		registry() {
			return this.registry_land()?.Data( $bog_journal_model_registry ) ?? null
		}

		/**
		 * Journals in the catalogue, newest first — a Baza list adds at the head.
		 * Plain strings, exactly what the router puts into `author=`.
		 */
		@ $mol_mem
		registry_journals(): readonly string[] {
			const links = this.registry()?.Journals()?.items() ?? []
			return links.map( link => link.str ).filter( str => !!str )
		}

		/**
		 * Whether a journal is already listed. Compares Lands rather than whole
		 * links: the same journal can be named by its root pawn or by its Land,
		 * and both mean one journal.
		 */
		registry_has( link: string ) {
			if( !link ) return false
			const land = new $giper_baza_link( link ).land().str
			return this.registry_journals().some( str => new $giper_baza_link( str ).land().str === land )
		}

		/**
		 * Whether this user may write into the catalogue. Reading the journal list
		 * above is what makes the Land sync at all — asking for the rank alone
		 * answers "no" on a cold load and never corrects itself.
		 */
		@ $mol_mem
		registry_writable() {
			const land = this.registry_land()
			if( !land ) return false
			this.registry_journals()
			const pass = this.$.$giper_baza_auth.current().pass()
			return $giper_baza_rank_tier_of( land.pass_rank( pass ) ) >= $giper_baza_rank_tier.post
		}

		/** Journals created before the catalogue existed can still be listed. */
		@ $mol_mem
		registry_addable() {
			const link = this.author_link()
			if( !link || !this.registry_land() ) return false
			if( this.registry_has( link ) ) return false
			return this.registry_writable()
		}

		/**
		 * Directory of journals under the start screen. Hidden when the catalogue
		 * is empty or absent, so an unbootstrapped build shows no stray heading.
		 *
		 * The start screen is where a reader with no journal of their own lands,
		 * and where the CI crawl starts, so this doubles as the hub page: every
		 * journal is one real link away from the root.
		 */
		directory() {
			return this.journal_rows().length ? this.Directory() : null
		}

		@ $mol_mem
		journal_rows() {
			return this.registry_journals().map( ( _, index )=> this.Journal_row( index ) )
		}

		journal_link( index: number ) {
			return this.registry_journals()[ index ] ?? ''
		}

		/** Root pawn of a listed journal, for its name. */
		journal_record( index: number ) {
			const link = this.journal_link( index )
			if( !link ) return null
			return this.$.$giper_baza_glob.Pawn( new $giper_baza_link( link ), $bog_journal_model_author )
		}

		journal_title( index: number ) {
			return this.journal_record( index )?.Name()?.val() || this.journal_untitled()
		}

		journal_arg( index: number ): Record< string, string | null > {
			return $bog_journal_app.route( 'journal', this.journal_link( index ) )
		}

		// === Navigation ==========================================================
		//
		// Каждый переход — настоящий <a href> с путём, а не обработчик клика:
		// именно по этим рёбрам ходит поисковый краулер.
		//
		// Все ссылки строятся одним помощником, и это важно: каждая обязана
		// задавать ОБА ключа. Ключ, который ссылка не упомянула, роутер при
		// клике сохранит от прежнего адреса — так пост и утаскивался следом за
		// переходом в журнал.

		/** Единственная форма адреса: секция плюс ссылка. */
		static route( section: Section, id: string ): Record< string, string | null > {
			return {
				section: section === 'start' ? null : section,
				id: id || null,
			}
		}

		feed_arg(): Record< string, string | null > {
			return $bog_journal_app.route( 'feed', this.own_feed_link() )
		}

		profile_arg(): Record< string, string | null > {
			return $bog_journal_app.route( 'journal', this.author_link() )
		}

		/** Из редактора — к читательскому виду той же статьи. */
		read_arg(): Record< string, string | null > {
			return $bog_journal_app.route( 'post', this.edit_link() )
		}

		/** Открыть читаемую статью в редакторе. */
		edit_arg(): Record< string, string | null > {
			return $bog_journal_app.route( 'edit', this.post_link() )
		}

		@ $mol_mem
		override tool_bar() {
			const parts: any[] = []
			const screen = this.screen()

			parts.push( this.own_feed_link() ? this.Nav_feed() : this.Feed_make() )
			if( screen !== 'profile' && screen !== 'start' ) parts.push( this.Nav_profile() )
			if( screen === 'edit' ) parts.push( this.Nav_read() )
			if( screen === 'post' && this.can_edit( this.post_link() ) ) parts.push( this.Nav_edit() )
			if( screen === 'profile' && this.can_edit( this.author_link() ) ) {
				parts.push( this.Post_new() )
				// Only the owner asks the catalogue anything: for a plain reader
				// this would be one more Land pulled for nothing.
				if( this.registry_addable() ) parts.push( this.Registry_add() )
			}

			parts.push( this.Lang(), this.Status(), this.Lights() )
			return parts
		}

		// === Actions =============================================================

		/**
		 * Creates the journal Land on demand. `ensure( preset )` grabs a fresh Land
		 * with public read and writes its root pawn link into the home record in
		 * one step. Proof-of-Work runs inside this fiber — never from a @$mol_mem,
		 * where a suspended retry loops forever.
		 *
		 * Listing comes before routing, and inside the same fiber: this is the one
		 * moment when the app is certain a new journal exists, and a catalogue
		 * entry written later would be a separate decision somebody has to make.
		 */
		@ $mol_action
		journal_create( event?: Event ) {
			if( !event ) return null
			const author = this.home().Journal( 'auto' )?.ensure( public_read )
			if( author ) {
				this.registry_register( author.link().str )
				this.author_link( author.link().str )
			}
			return event
		}

		/**
		 * Writes a journal into the public catalogue.
		 *
		 * Silent when there is no catalogue in this build, and silent when the
		 * catalogue refuses the write — `'auto'` hands back `null` instead of
		 * throwing if the Land grants this user read only. Neither case is worth
		 * interrupting journal creation for: the journal itself is fine, it is
		 * only harder to find.
		 */
		@ $mol_action
		registry_register( link: string ) {
			if( !link ) return
			if( this.registry_has( link ) ) return
			this.registry()?.Journals( 'auto' )?.add( new $giper_baza_link( link ) )
		}

		/** Same, for a journal that predates the catalogue. */
		@ $mol_action
		registry_add( event?: Event ) {
			if( !event ) return null
			this.registry_register( this.author_link() )
			return event
		}

		/**
		 * A feed is the reader's private list of journals, so its preset has no
		 * `null` entry: the Land comes out encrypted and nobody else can pull who
		 * this person follows.
		 */
		@ $mol_action
		feed_create( event?: Event ) {
			if( !event ) return null

			const feeds = this.home().Feeds( 'auto' )
			if( !feeds ) return null

			const owner = this.$.$giper_baza_auth.current().pass()
			const preset: $giper_baza_rank_preset = [[ owner, $giper_baza_rank_rule ]]
			const feed = feeds.make( preset )

			this.$.$mol_state_arg.go({ feed: feed.link().str, author: null, post: null, edit: null })
			return event
		}

		/**
		 * Hands the three-step creation to the editor, then routes into it. The
		 * cast is needed because the view.tree typing of `Edit()` only knows the
		 * generated base class, and `create()` lives in the $$ subclass.
		 */
		@ $mol_action
		post_create( event?: Event ) {
			if( !event ) return null
			const link = ( this.Edit() as $.$$.$bog_journal_edit_page ).create()
			if( !link ) return null
			this.$.$mol_state_arg.go({ edit: link, post: null, feed: null })
			return event
		}

	}

}
