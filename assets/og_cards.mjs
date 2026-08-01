#!/usr/bin/env node
//
// Рисует картинки превью (og:image) для статических снапшотов журнала.
//
// Зачем. Обложку к посту грузит не каждый автор, а без og:image ссылка в
// телеграме и твиттере разворачивается голым текстом. Поэтому постам без
// обложки рисуется карточка: заголовок, врезка, дата и имя автора.
//
// Где в пайплайне. Шаг ставится ПОСЛЕ пререндера и ПОСЛЕ verify.mjs, перед
// выкладкой:
//
//   mam_build → 404.html → routes.mjs → prerender → verify.mjs → ЭТОТ ШАГ → deploy
//
// Почему не на обходе в routes.mjs, хотя браузер там уже поднят:
//   * routes.mjs открывает только страницы-списки и берёт из ссылки её
//     textContent — а это склейка заголовка, врезки, даты и статуса из
//     $bog_journal_profile_post. Чистого заголовка там нет, и чтобы он
//     появился, пришлось бы лезть в разметку чужого модуля;
//   * снапшот содержит ровно те данные, которые страница поста сама посчитала,
//     включая уже разрешённую обложку. Угадывать нечего;
//   * verify.mjs выбрасывает снапшоты, в которые не доехал ленд, и подчищает
//     каталоги. Рисуй мы раньше — карточки остались бы сиротами;
//   * второй браузер тут нужен в любом случае: карточку кто-то должен
//     растеризовать. Экономия вышла бы только на обходе, а обход этому шагу
//     не нужен вовсе.
//
// Как связано с метой. `$bog_journal_post_page.card_uri()` отдаёт og:image
// вида `<адрес страницы>/og.png`, то есть файл лежит рядом со снапшотом.
// Схемы имён нет, синхронизировать между генератором и приложением нечего.
// Обложка побеждает: если она есть, страница ставит в og:image адрес файла в
// Гипер Базе, и такой снапшот скрипт пропускает.
//
// Использование:
//   node bog/journal/assets/og_cards.mjs \
//     --build-dir=bog/journal/app/- \
//     --base-url=https://b-on-g.github.io/journal/
//
// ────────────────────────────────────────────────────────────────────────────
// ТЕЛЕГРАМ КЭШИРУЕТ ПРЕВЬЮ НАМЕРТВО, и ключ кэша — адрес страницы, а не адрес
// картинки. Пока кэш не сброшен, новая карточка не появится, сколько ссылку ни
// пересылай, и выглядит это ровно как «ничего не работает».
// Сброс: бот @WebpageBot, отправить ему адрес страницы, в ответ придёт
// «Link preview was updated».
// Твиттер/X — https://cards-dev.twitter.com/validator
// Фейсбук и всё прочее на OpenGraph — https://developers.facebook.com/tools/debug/
// ────────────────────────────────────────────────────────────────────────────

import puppeteer from 'puppeteer'
import { readdir, readFile, appendFile, copyFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, sep } from 'path'

const args = Object.fromEntries(
	process.argv.slice( 2 )
		.filter( a => a.startsWith( '--' ) )
		.map( a => {
			const [ k, ...v ] = a.slice( 2 ).split( '=' )
			return [ k, v.join( '=' ) ]
		} )
)

const BUILD_DIR = args[ 'build-dir' ]
const BASE_URL = args[ 'base-url' ]?.replace( /\/?$/, '/' )

// Стандарт социальных превью: 1200×630, оно же 1.91:1. Этот кадр берут и
// telegram, и twitter summary_large_image, и facebook.
const WIDTH = Number( args[ 'width' ] || 1200 )
const HEIGHT = Number( args[ 'height' ] || 630 )

if( !BUILD_DIR || !existsSync( BUILD_DIR ) ) {
	console.log( `::warning::build-dir не найден: ${ BUILD_DIR }, рисовать нечего` )
	process.exit( 0 )
}
if( !BASE_URL ) {
	console.log( '::warning::нет --base-url, рисовать нечего' )
	process.exit( 0 )
}

const SITE = new URL( BASE_URL ).host + new URL( BASE_URL ).pathname.replace( /\/$/, '' )

// ─── чтение снапшотов ───────────────────────────────────────────────────────

const head_of = html => {
	const close = html.indexOf( '</head>' )
	return close < 0 ? html : html.slice( 0, close )
}

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

function decode( text ) {
	return text.replace( /&(#\d+|#[xX][0-9a-fA-F]+|[a-zA-Z]+);/g, ( all, body ) => {
		if( body[ 0 ] === '#' ) {
			const code = body[ 1 ] === 'x' || body[ 1 ] === 'X'
				? parseInt( body.slice( 2 ), 16 )
				: parseInt( body.slice( 1 ), 10 )
			return Number.isFinite( code ) && code > 0 && code <= 0x10FFFF ? String.fromCodePoint( code ) : all
		}
		return entities[ body.toLowerCase() ] ?? all
	} )
}

const clean = text => decode( text ).replace( /\s+/g, ' ' ).trim()

export function meta_content( html, property ) {
	const head = head_of( html )
	const first = new RegExp(
		`<meta\\b[^>]*\\b(?:property|name)\\s*=\\s*["']${ property }["'][^>]*\\bcontent\\s*=\\s*["']([^"']*)["']`,
		'i',
	)
	const second = new RegExp(
		`<meta\\b[^>]*\\bcontent\\s*=\\s*["']([^"']*)["'][^>]*\\b(?:property|name)\\s*=\\s*["']${ property }["']`,
		'i',
	)
	return ( first.exec( head ) ?? second.exec( head ) )?.[ 1 ] ?? ''
}

/**
 * Ищет элемент по атрибуту, который $mol ставит по имени поля владельца:
 * поле `Title` внутри `$bog_journal_post_page` даёт атрибут
 * `bog_journal_post_page_title`. Тот же механизм, по которому написаны
 * селекторы в page.view.css.ts, — это публичный контракт вьюхи, а не
 * археология по случайной разметке.
 */
function marked_tag( html, marker ) {
	return new RegExp( `<[a-z][a-z0-9]*\\b[^>]*\\s${ marker }(?=[\\s=>])[^>]*>`, 'i' ).exec( html )?.[ 0 ] ?? ''
}

export function marked_text( html, marker ) {
	const found = new RegExp( `<[a-z][a-z0-9]*\\b[^>]*\\s${ marker }(?=[\\s=>])[^>]*>([^<]*)`, 'i' ).exec( html )
	return found ? clean( found[ 1 ] ) : ''
}

export function marked_attr( html, marker, name ) {
	const tag = marked_tag( html, marker )
	return new RegExp( `\\s${ name }\\s*=\\s*["']([^"']*)["']`, 'i' ).exec( tag )?.[ 1 ] ?? ''
}

async function snapshots() {
	const entries = await readdir( BUILD_DIR, { recursive: true, withFileTypes: true } )
	const out = []
	for( const entry of entries ) {
		if( !entry.isFile() || entry.name !== 'index.html' ) continue
		const parent = entry.parentPath ?? entry.path
		const rel = parent.slice( BUILD_DIR.length ).replace( /^[\\/]+/, '' )
		out.push( { dir: parent, route: rel.split( sep ).join( '/' ) } )
	}
	return out
}

// ─── карточка ───────────────────────────────────────────────────────────────

// Палитра — светлая тема $mol, скопированная из mol/theme/theme.css как есть,
// вместе с oklch и hue. Не подобранные на глаз хексы: карточка должна быть
// продолжением страницы, а страница красится ровно этими переменными.
// Светлая, а не тёмная, потому что $mol_theme_auto идёт за prefers-color-scheme,
// а безголовый chrome (и пререндер, и этот скрипт) по умолчанию светлый — то
// есть карточка совпадает с тем, что снимает пререндерер.
const palette = `
	--mol_theme_hue: 240deg;
	--mol_theme_back: oklch( 92% .01 var(--mol_theme_hue) );
	--mol_theme_text: oklch( 20% 0 var(--mol_theme_hue) );
	--mol_theme_shade: oklch( 60% 0 var(--mol_theme_hue) );
	--mol_theme_line: oklch( 50% 0 var(--mol_theme_hue) / .25 );
	--mol_theme_focus: oklch( 60% .2 calc( var(--mol_theme_hue) + 180deg ) );
`

// Ровно тот стек, которым набран сайт (mol/view/view/view.css:51), плюс хвост
// с кириллическими шрифтами на случай тощего образа CI. Своего woff2 намеренно
// нет: сайт шрифт не задаёт, он берёт системный, и карточка, набранная чем-то
// своим, была бы как раз тем «отдельным баннером», которого быть не должно.
const font_stack =
	`system-ui, 'Segoe UI', Tahoma, Geneva, Verdana, 'DejaVu Sans', 'Liberation Sans', Arial, sans-serif`

const esc = s => String( s ).replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' )

/** Длинному заголовку — кегль поменьше, чтобы три строки клампа хватало почти всем. */
const title_size = title => title.length > 90 ? 60 : title.length > 46 ? 72 : 84

export function card_html( { title, summary, byline } ) {
	return `<!doctype html><html><head><meta charset="utf-8"><style>
	:root { ${ palette } }
	* { margin: 0; padding: 0; box-sizing: border-box; }
	html, body { width: ${ WIDTH }px; height: ${ HEIGHT }px; }
	body {
		font-family: ${ font_stack };
		background: var(--mol_theme_back);
		color: var(--mol_theme_text);
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 76px 80px 120px;
		overflow: hidden;
		-webkit-font-smoothing: antialiased;
	}
	/* Единственное украшение — полоска акцентным цветом темы, тем же, которым
	   страница красит ссылки. Ничего, чего нет в палитре сайта. */
	.mark { width: 56px; height: 6px; border-radius: 3px; background: var(--mol_theme_focus); margin-bottom: 34px; }
	.title {
		font-size: ${ title_size( title ) }px;
		font-weight: 700;
		line-height: 1.14;
		letter-spacing: -0.015em;
		overflow-wrap: break-word;
		display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3;
		overflow: hidden;
	}
	.summary {
		margin-top: 28px;
		font-size: 30px;
		line-height: 1.45;
		color: var(--mol_theme_shade);
		display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
		overflow: hidden;
	}
	.byline {
		margin-top: 36px;
		font-size: 27px;
		color: var(--mol_theme_shade);
		white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
	}
	.byline b { font-weight: 600; color: var(--mol_theme_text); }
	.foot {
		position: absolute; left: 80px; right: 80px; bottom: 56px;
		display: flex; align-items: center; gap: 28px;
	}
	.rule { flex: 1; height: 1px; background: var(--mol_theme_line); }
	.site { font-size: 24px; color: var(--mol_theme_shade); }
	</style></head><body>
		<div class="mark"></div>
		<div class="title">${ esc( title ) }</div>
		${ summary ? `<div class="summary">${ esc( summary ) }</div>` : '' }
		${ byline ? `<div class="byline">${ byline }</div>` : '' }
		<div class="foot"><div class="rule"></div><div class="site">${ esc( SITE ) }</div></div>
	</body></html>`
}

/**
 * Кириллица не должна превратиться в квадраты, и проверка тут честная, а не
 * «вроде шрифт стоит»: рисуем две РАЗНЫЕ кириллические буквы. Если в системе
 * нет ни одного шрифта с кириллицей, обе нарисуются одним и тем же .notdef и
 * растры совпадут. Заодно ловим случай, когда не нарисовалось ничего.
 */
export async function cyrillic_ok( page, stack = font_stack ) {
	return page.evaluate( family => {
		const shot = ch => {
			const canvas = document.createElement( 'canvas' )
			canvas.width = 64
			canvas.height = 64
			const ctx = canvas.getContext( '2d' )
			ctx.font = `48px ${ family }`
			ctx.fillText( ch, 4, 48 )
			return canvas.toDataURL()
		}
		const blank = shot( ' ' )
		const one = shot( 'Ж' )
		const two = shot( 'Д' )
		return one !== two && one !== blank
	}, stack )
}

// ─── сам прогон ─────────────────────────────────────────────────────────────

async function main() {

	const found = await snapshots()

	const root = found.find( snap => !snap.route )
	const posts = []
	let covered = 0
	let empty = 0

	for( const snap of found ) {
		if( !snap.route.split( '/' ).some( seg => seg.startsWith( 'post=' ) ) ) continue

		const html = await readFile( join( snap.dir, 'index.html' ), 'utf-8' )
		const image = meta_content( html, 'og:image' )

		// Нет og:image — снапшот пустой; verify.mjs такие обычно уже выбросил.
		if( !image ) { empty += 1; continue }
		// Есть, но это не карточка — значит автор загрузил обложку, она главнее.
		if( !/\/og\.png$/.test( image ) ) { covered += 1; continue }

		const title = marked_text( html, 'bog_journal_post_page_title' )
			|| clean( meta_content( html, 'og:title' ) )

		if( !title ) {
			console.log( `::warning::${ snap.route }: в снапшоте нет заголовка, карточку пропускаю` )
			continue
		}

		posts.push( {
			dir: snap.dir,
			route: snap.route,
			title,
			summary: marked_text( html, 'bog_journal_post_page_summary' )
				|| clean( meta_content( html, 'og:description' ) ),
			author: marked_text( html, 'bog_journal_post_page_author_name' ),
			date: marked_attr( html, 'bog_journal_post_page_published', 'datetime' ),
		} )
	}

	// Текст корневой карточки берём из меты самого корня, чтобы он не разъехался
	// с тем, что приложение пишет в `meta()` для стартового экрана.
	const root_html = root ? await readFile( join( root.dir, 'index.html' ), 'utf-8' ) : ''
	const root_card = {
		title: clean( meta_content( root_html, 'og:title' ) ) || SITE,
		summary: clean( meta_content( root_html, 'og:description' ) ),
		byline: '',
	}

	const browser = await puppeteer.launch( {
		headless: true,
		args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
	} )

	let drawn = 0
	let failed = 0
	const root_png = join( BUILD_DIR, 'og.png' )

	try {

		const page = await browser.newPage()
		await page.setViewport( { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 } )
		await page.setContent( card_html( root_card ), { waitUntil: 'load' } )

		if( !await cyrillic_ok( page ) ) {
			console.log( '::error::в этой среде нет ни одного шрифта с кириллицей — карточки вышли бы квадратами.'
				+ ' Поставь fonts-dejavu-core или fonts-liberation, либо положи woff2 рядом и добавь @font-face.' )
			return
		}

		const shoot = async ( card, out ) => {
			await page.setContent( card_html( card ), { waitUntil: 'load' } )
			await page.evaluate( ()=> document.fonts.ready )
			await page.screenshot( { path: out, type: 'png', clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } } )
		}

		// Корневая карточка. Она же подменяет собой карточки постов, которые не
		// нарисовались, чтобы og:image никогда не вёл в 404.
		await shoot( root_card, root_png )

		for( const post of posts ) {
			const out = join( post.dir, 'og.png' )
			const byline = [
				post.date ? esc( post.date ) : '',
				post.author ? `<b>${ esc( post.author ) }</b>` : '',
			].filter( Boolean ).join( ' · ' )

			try {
				await shoot( { title: post.title, summary: post.summary, byline }, out )
				drawn += 1
			} catch( error ) {
				failed += 1
				console.log( `::warning::${ post.route }: карточка не нарисовалась — ${ error.message }` )
				await copyFile( root_png, out ).catch( ()=> {} )
			}
		}

	} finally {
		await browser.close()
	}

	// Последняя проверка: у каждого снапшота, который просит карточку, файл есть.
	let dangling = 0
	for( const post of posts ) {
		if( existsSync( join( post.dir, 'og.png' ) ) ) continue
		dangling += 1
		console.log( `::warning::${ post.route }: og:image ведёт в никуда, файла нет` )
	}

	const summary = [
		`Карточек нарисовано: ${ drawn }`,
		`С обложкой автора, карточка не нужна: ${ covered }`,
		`Снапшотов без меты, пропущено: ${ empty }`,
		`Не нарисовалось: ${ failed }`,
		`Битых ссылок на карточку: ${ dangling }`,
	]
	for( const line of summary ) console.log( line )

	if( process.env.GITHUB_STEP_SUMMARY ) {
		await appendFile(
			process.env.GITHUB_STEP_SUMMARY,
			[ '### Карточки превью', '', ...summary.map( s => `- ${ s }` ), '' ].join( '\n' ),
		)
	}
}

// Запускаем только как скрипт: тесты импортируют отсюда чистые функции.
if( process.argv[ 1 ] && process.argv[ 1 ].endsWith( 'og_cards.mjs' ) ) {
	main().catch( error => {
		// Карточки — улучшение поверх работающей выкладки. Ронять сборку из-за
		// них незачем: без картинки превью просто останется текстовым.
		console.log( `::warning::генератор карточек упал — ${ error.message }` )
		console.log( error.stack ?? '' )
		process.exit( 0 )
	} )
}
