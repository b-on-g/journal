#!/usr/bin/env node
//
// Проверяет снапшоты, которые оставил после себя mol-prerender-action, и
// чинит то, что можно починить снаружи.
//
// Делает четыре вещи.
//
// 0. Проверяет, что снапшот остался приложением, то есть в нём есть ссылка на
//    бандл. Это единственная проверка здесь, которая роняет сборку, и вот
//    почему. Всё остальное деградирует по частям: выбросили снапшот — эта
//    страница отрисуется у читателя в браузере, как раньше. А страница без
//    <script> не деградирует никуда: она выглядит рабочей, отдаётся вместо
//    приложения и молча ломает сайт целиком. Один раз это уже случилось —
//    `mol_view_root` висел на <body>, $mol перерисовывал его вместе с тегом
//    скрипта, и на проде месяц лежала мёртвая статика. Пустая выкладка лучше:
//    предыдущая, живая, остаётся на месте.
//
// 1. Переписывает localhost в абсолютных адресах внутри <head>. Экшен
//    отрисовывает страницу со своего локального сервера, а страница поста
//    строит canonical из location.origin (post/page/page.view.ts). В снапшот
//    поэтому попадает `http://localhost:9222/journal/…`, и это хуже, чем
//    отсутствие canonical: так мы прямо сообщаем поисковику, что настоящий
//    адрес статьи — localhost. Здесь префикс меняется на продовый.
//    Когда приложение начнёт отдавать правильный canonical само, шаг станет
//    пустой операцией.
//
// 2. Выбрасывает снапшоты, в которые не доехал контент. Ленд приезжает
//    синком, а экшен ждёт фиксированные 1.5 секунды после networkidle0 и
//    больше ничем не управляется. Если не успело, получится статическая
//    страница-пустышка — для поиска это хуже, чем её отсутствие: без файла
//    GitHub Pages отдаст 404.html, оттуда rafgraph вернёт читателя в
//    приложение, и страница отрисуется у него в браузере как раньше.
//    Признак «не доехало» точный: страница поста объявляет data-bog-meta
//    только когда данные уже известны, а экшен пишет <link rel=canonical>
//    только из data-bog-meta. Нет canonical у маршрута с post= — значит
//    снимали пустоту.
//
// 3. Считает и печатает итог, чтобы в логе сборки было видно, сколько
//    страниц реально уехало в выдачу.
//
// Никогда не роняет сборку: приложение и SPA-фоллбек работают в любом случае,
// и лучше выложиться без части снапшотов, чем не выложиться вовсе.

import { readdir, readFile, writeFile, unlink, rmdir, appendFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname, sep } from 'path'

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

if( !BUILD_DIR || !existsSync( BUILD_DIR ) ) {
	console.log( `::warning::build-dir не найден: ${ BUILD_DIR }, проверять нечего` )
	process.exit( 0 )
}
if( !BASE_URL ) {
	console.log( '::warning::нет --base-url, проверять нечего' )
	process.exit( 0 )
}

const MOUNT = new URL( BASE_URL ).pathname.replace( /\/?$/, '/' )
const BASE_ORIGIN = new URL( BASE_URL ).origin

const notes = []
const note = ( level, text )=> {
	notes.push( text )
	console.log( level ? `::${ level }::${ text }` : text )
}

async function snapshots() {
	const entries = await readdir( BUILD_DIR, { recursive: true, withFileTypes: true } )
	const out = []
	for( const entry of entries ) {
		if( !entry.isFile() || entry.name !== 'index.html' ) continue
		// parentPath у корневого index.html равен самому build-dir
		const parent = entry.parentPath ?? entry.path
		const rel = parent.slice( BUILD_DIR.length ).replace( /^[\\/]+/, '' )
		out.push( { file: join( parent, entry.name ), route: rel.split( sep ).join( '/' ) } )
	}
	return out
}

/** Абсолютные localhost-адреса внутри <head> заменяем на продовые. */
function fix_head( html ) {
	const close = html.indexOf( '</head>' )
	if( close < 0 ) return { html, fixed: 0 }

	let head = html.slice( 0, close )
	const rest = html.slice( close )

	let fixed = 0
	head = head.replace(
		new RegExp( `http://localhost:\\d+${ MOUNT.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' ) }`, 'g' ),
		()=> { fixed += 1; return BASE_URL },
	)
	// Хвост на случай, если приложение отдало голый origin без mount.
	head = head.replace( /http:\/\/localhost:\d+/g, ()=> { fixed += 1; return BASE_ORIGIN } )

	return { html: head + rest, fixed }
}

function head_of( html ) {
	const close = html.indexOf( '</head>' )
	return close < 0 ? html : html.slice( 0, close )
}

function canonical_of( html ) {
	const m = /<link\b[^>]*\brel\s*=\s*["']canonical["'][^>]*\bhref\s*=\s*["']([^"']*)["']/i.exec( head_of( html ) )
		?? /<link\b[^>]*\bhref\s*=\s*["']([^"']*)["'][^>]*\brel\s*=\s*["']canonical["']/i.exec( head_of( html ) )
	return m?.[ 1 ] ?? ''
}

function title_of( html ) {
	const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec( head_of( html ) )
	return ( m?.[ 1 ] ?? '' ).trim()
}

/**
 * Адрес бандла в разметке. Ищем именно `<script src>`, не любой `<script>`:
 * инлайновый скрипт в снапшоте может быть чем угодно, а приложение поднимает
 * ровно внешний файл.
 */
function bundle_src( html ) {
	const found = /<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i.exec( html )
	return found?.[ 1 ] ?? ''
}

async function prune( file ) {
	await unlink( file )
	// Пустые каталоги за собой убираем, иначе в выкладку уедет мусор.
	let dir = dirname( file )
	while( dir.startsWith( BUILD_DIR ) && dir !== BUILD_DIR ) {
		try {
			await rmdir( dir )
		} catch {
			break
		}
		dir = dirname( dir )
	}
}

async function main() {

	const found = await snapshots()

	let kept = 0
	let dropped = 0
	let rewritten = 0
	let untitled = 0
	const dead = []

	for( const { file, route } of found ) {

		const html = await readFile( file, 'utf-8' )
		const { html: fixed_html, fixed } = fix_head( html )
		if( fixed ) {
			await writeFile( file, fixed_html, 'utf-8' )
			rewritten += 1
		}

		// Снапшот без ссылки на бандл — это не страница приложения, а его
		// надгробие. Копим и роняем сборку в конце, чтобы в логе было видно
		// сразу все, а не первый попавшийся.
		if( !bundle_src( fixed_html ) ) dead.push( route || 'главная' )

		const canonical = canonical_of( fixed_html )
		const title = title_of( fixed_html )

		// Корневой index.html не трогаем никогда: без него нет приложения.
		if( !route ) {
			if( !canonical ) note( '', 'главная: без canonical (у корневого экрана нет meta(), см. отчёт)' )
			kept += 1
			continue
		}

		const is_post = route.split( '/' ).some( seg => seg.startsWith( 'post=' ) )

		if( is_post && !canonical ) {
			await prune( file )
			note( 'warning', `${ route }: снапшот пустой (нет canonical, ленд не успел синкнуться) — выброшен, останется SPA-фоллбек` )
			dropped += 1
			continue
		}

		if( canonical && !canonical.startsWith( BASE_ORIGIN ) ) {
			note( 'warning', `${ route }: canonical ведёт наружу — ${ canonical }` )
		}

		if( canonical && canonical !== BASE_URL + route ) {
			note( 'warning', `${ route }: canonical не совпадает с адресом страницы — ${ canonical }` )
		}

		if( !title ) untitled += 1

		kept += 1
	}

	if( untitled ) {
		note( 'warning', `страниц без <title>: ${ untitled } (у экрана нет meta(), заголовок будет общий для сайта)` )
	}

	if( dead.length ) {
		note( 'error', `снапшотов без ссылки на бандл: ${ dead.length } — ${ dead.slice( 0, 10 ).join( ', ' ) }` )
		note( '', 'Это не страницы приложения, а статические копии без единого <script>.'
			+ ' Выкладывать их нельзя: они выглядят рабочими и подменяют собой сайт.'
			+ ' Проверь index.html — тег скрипта должен лежать РЯДОМ с корнем приложения,'
			+ ' а не внутри элемента с mol_view_root: $mol перерисовывает свой корень целиком'
			+ ' и уносит скрипт вместе с содержимым.' )
	}

	const summary = [
		`Снапшотов оставлено: ${ kept }`,
		`Выброшено пустых: ${ dropped }`,
		`Файлов с переписанным localhost: ${ rewritten }`,
		`Снапшотов без бандла: ${ dead.length }`,
	]
	for( const line of summary ) console.log( line )

	if( process.env.GITHUB_STEP_SUMMARY ) {
		await appendFile(
			process.env.GITHUB_STEP_SUMMARY,
			[ '### Пререндер', '', ...summary.map( s => `- ${ s }` ), '', ...notes.map( n => `- ${ n }` ), '' ].join( '\n' ),
		)
	}

	// Единственный выход с ненулевым кодом. Дальше по workflow идут карточки и
	// выкладка, оба шага при этом не запустятся, и на проде останется прошлая,
	// живая версия.
	if( dead.length ) process.exit( 1 )
}

main().catch( error => {
	// Отказ самой проверки — не повод не выкладываться: пререндер тут поверх
	// работающего приложения. Мёртвые снапшоты выше — другое дело, там выход 1.
	console.log( `::warning::проверка снапшотов упала — ${ error.message }` )
	process.exit( 0 )
} )
