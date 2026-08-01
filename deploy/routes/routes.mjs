#!/usr/bin/env node
//
// Составляет список маршрутов журнала для mol-prerender-action.
//
// Зачем он вообще нужен. Экшен НЕ умеет обходить сайт сам: маршруты он берёт
// только из входа `screens` и из `<loc>` в готовом sitemap (см. его
// prerender.mjs, функция routes_from_sitemap). У smalljs sitemap лежит в репе,
// потому что там контент это markdown-файлы. У журнала в репозитории контента
// нет вообще — посты живут лендами на мастер-ноде, и список маршрутов
// существует только там.
//
// Почему обход браузером, а не node-клиентом Гипер Базы:
//   * не нужно поднимать в CI второй клиент базы со своим bootstrap, своей
//     IDB-заглушкой и своим PoW — приложение уже умеет всё это само;
//   * не нужно повторять схему лендов, а значит она не разъедется с моделью;
//   * ссылки берутся ровно те, что пишет роутер, из настоящих `<a href>`.
//     Ни одного предположения о форме адреса;
//   * node-клиент базы известен утечками, а тут процесс живёт минуту и умирает.
//
// ОТКУДА БЕРУТСЯ ЖУРНАЛЫ. Главный источник — публичный каталог в самой Гипер
// Базе (bog/journal/model/registry): журнал пишет себя туда в момент создания,
// и приложение показывает каталог ссылками на стартовом экране. То есть обходу
// не надо ничего знать про каталог отдельно — он открывает корень и читает
// оттуда те же `<a href>`, что видит человек. Новый автор попадает в выдачу без
// единого коммита, ради чего всё и затевалось.
//
// journals.txt остался запасным путём и подмешивается к каталогу: в нём живут
// журналы, заведённые до каталога, и он же спасает, если каталог недоступен или
// кто-то держит журнал вне его. Оба источника объединяются, дубли схлопываются
// сами — маршрут это строка в Set.
//
// Обход мелкий: открываются только страницы-списки — корень и журналы. Ссылки
// на посты с них собираются, но сами посты не открываются. Их отрисует экшен.
//
// Использование:
//   node routes.mjs --build-dir=… --base-url=… --seeds=… --out=…

import puppeteer from 'puppeteer'
import { createServer } from 'http'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, extname, dirname } from 'path'
import { createHash } from 'crypto'

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
const SEEDS_FILE = args[ 'seeds' ] || ''
const OUT = args[ 'out' ] || 'sitemap.xml'
// Глубина навигации, а не глубина ссылок. 1 = открыть только корень и журналы
// из файла. 2 нужно ради каталога: журналы приезжают ссылками с корня, и чтобы
// добраться до постов, эти страницы надо открыть. Открываются при этом только
// страницы-списки, см. route_expandable.
const DEPTH = Number( args[ 'depth' ] || 2 )
const MAX = Number( args[ 'max' ] || 300 )
const TIMEOUT = Number( args[ 'timeout' ] || 30_000 )
// Не 9222: там сидит mol-prerender-action, и это же порт отладки chrome
// по умолчанию.
const PORT = Number( args[ 'port' ] || 9223 )
// Любая строка, попадающая в дайджест. Ломает кэш экшена, когда надо
// перерисовать всё, хотя список маршрутов не менялся.
const NONCE = args[ 'nonce' ] || ''

if( !BUILD_DIR || !existsSync( BUILD_DIR ) ) {
	console.error( `::error::build-dir не найден: ${ BUILD_DIR }` )
	process.exit( 1 )
}
if( !BASE_URL ) {
	console.error( '::error::нужен --base-url' )
	process.exit( 1 )
}

const MOUNT = new URL( BASE_URL ).pathname.replace( /\/?$/, '/' )

// Индексируем только эти ключи маршрута. Список, а не чёрный список: новый
// ключ не должен попадать в выдачу молча.
//   author — журнал автора, страница-список
//   post   — сама статья
// Намеренно снаружи:
//   edit   — редактор, ему в индексе делать нечего
//   feed   — лента читателя лежит в зашифрованном ленде, её не прочитает
//            ни краулер, ни этот скрипт
//   baza   — отладочный оверрайд мастер-ноды
const INDEXABLE_KEYS = new Set( [ 'author', 'post' ] )

// Маршруты, которые имеет смысл ОТКРЫВАТЬ. Страница-список ведёт дальше, пост
// не ведёт никуда: ссылки внутри статьи это внешний мир либо соседний пост,
// который и так найдётся со страницы журнала. Отрисует посты экшен, обходу
// открывать их незачем — это минуты работы браузера на пустом месте.
const LIST_KEYS = new Set( [ 'author' ] )

const MIME = {
	'.html': 'text/html',
	'.js': 'application/javascript',
	'.mjs': 'application/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.woff2': 'font/woff2',
	'.baza': 'application/octet-stream',
}

// Тот же файловый сервер, что внутри mol-prerender-action: настоящие файлы
// побеждают, всё неизвестное под mount отдаётся как index.html. Это имитация
// GitHub Pages с её 404-фоллбеком.
function serve() {
	return new Promise( resolve => {
		const server = createServer( async ( req, res ) => {
			const url = new URL( req.url, `http://localhost:${ PORT }` )
			let path = decodeURIComponent( url.pathname )
			if( MOUNT !== '/' && path.startsWith( MOUNT ) ) path = '/' + path.slice( MOUNT.length )
			if( path === '/' || path === '' ) path = '/index.html'
			try {
				const data = await readFile( join( BUILD_DIR, path ) )
				res.writeHead( 200, { 'Content-Type': MIME[ extname( path ) ] || 'application/octet-stream' } )
				res.end( data )
			} catch {
				try {
					const data = await readFile( join( BUILD_DIR, 'index.html' ) )
					res.writeHead( 200, { 'Content-Type': 'text/html' } )
					res.end( data )
				} catch {
					res.writeHead( 404 )
					res.end( 'Not found' )
				}
			}
		} )
		server.listen( PORT, () => resolve( server ) )
	} )
}

// Тот же вид адреса, что использует экшен: `?/route` это форма, в которую
// 404.html GitHub Pages заворачивает deep-link, а роутер разворачивает её
// обратно в чистый путь. То есть открывается ровно тот сценарий, что у
// читателя по холодной ссылке.
function nav_url( route ) {
	const base = `http://localhost:${ PORT }${ MOUNT }`
	if( !route ) return base
	return `${ base }?/${ route.replace( /&/g, '~and~' ) }`
}

async function read_seeds() {
	if( !SEEDS_FILE || !existsSync( SEEDS_FILE ) ) return []
	const text = await readFile( SEEDS_FILE, 'utf-8' )
	return text.split( '\n' )
		.map( line => line.replace( /#.*$/, '' ).trim() )
		.filter( Boolean )
		// Строка без «=» — это просто ссылка на ленд журнала, дописываем ключ.
		.map( line => line.includes( '=' ) ? line : `author=${ line }` )
}

function route_keys( route ) {
	return route.split( '/' ).filter( Boolean ).map( seg => seg.split( '=' )[ 0 ] )
}

function route_indexable( route ) {
	if( !route ) return false
	const keys = route_keys( route )
	if( !keys.length ) return false
	return keys.every( key => INDEXABLE_KEYS.has( key ) )
}

function route_expandable( route ) {
	if( !route ) return false
	const keys = route_keys( route )
	if( !keys.length ) return false
	return keys.every( key => LIST_KEYS.has( key ) )
}

const sleep = ms => new Promise( r => setTimeout( r, ms ) )

/**
 * Ждём, пока страница перестанет меняться.
 *
 * Просто networkidle0 тут не годится: контент приезжает CRDT-синком по
 * вебсокету уже ПОСЛЕ того, как затихли http-запросы, а вебсокет puppeteer
 * в счётчик запросов не берёт.
 *
 * Сравнивается слепок ссылок вместе с их подписями, а не число ссылок. На
 * корне сначала приезжает каталог — сами ссылки, — и только потом имена
 * журналов, каждое из своего ленда. По одному лишь числу страница «успокоилась»
 * бы до того, как появились имена, и подпись, попавшая в дайджест, зависела бы
 * от того, кто успел синкнуться первым. Кэш пререндера промахивался бы через
 * раз, то есть ровно тогда, когда рендерить нечего.
 */
const shot_sep = '\u0001'

async function settle( page ) {
	const until = Date.now() + TIMEOUT
	let prev = ''
	let stable = 0
	while( Date.now() < until ) {
		const shot = await page.evaluate( ( sep )=> {
			const out = []
			for( const a of document.querySelectorAll( 'a[href]' ) ) {
				out.push( a.pathname + ' ' + ( a.textContent || '' ).replace( /\s+/g, ' ' ).trim() )
			}
			return out.join( sep )
		}, shot_sep )
		if( shot === prev ) {
			stable += 1
			if( stable >= 2 && shot ) return shot.split( shot_sep ).length
		} else {
			prev = shot
			stable = 0
		}
		await sleep( 500 )
	}
	return prev ? prev.split( shot_sep ).length : 0
}

async function collect( page ) {
	return page.evaluate( ( mount )=> {
		const out = []
		for( const a of document.querySelectorAll( 'a[href]' ) ) {
			if( a.origin !== location.origin ) continue
			const path = decodeURIComponent( a.pathname )
			if( !path.startsWith( mount ) ) continue
			out.push( {
				route: path.slice( mount.length ).replace( /^\/+|\/+$/g, '' ),
				text: ( a.textContent || '' ).replace( /\s+/g, ' ' ).trim().slice( 0, 200 ),
			} )
		}
		return out
	}, MOUNT )
}

async function main() {

	const seeds = await read_seeds()

	const server = await serve()
	const browser = await puppeteer.launch( {
		headless: true,
		args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
	} )

	// Заголовки ссылок нужны не поисковику, а дайджесту: по ним ломается кэш
	// рендера, когда пост переименовали.
	const titles = new Map()
	const found = new Set()
	// Журналы, про которые рассказал каталог, а не файл. Считаем ради лога:
	// когда каталог сломается, это будет видно по нулю, а не по молчанию.
	const listed = new Set()

	try {
		const page = await browser.newPage()
		await page.setViewport( { width: 1280, height: 900 } )

		// Одна вкладка на весь обход намеренно. Гипер База генерит ключ
		// личности с PoW при первом обращении и кладёт его в IndexedDB;
		// в рамках одного профиля это происходит ровно один раз.
		let level = [ '', ...seeds ]
		const visited = new Set()

		for( let depth = 0; depth < DEPTH && level.length; ++depth ) {

			const next = []

			for( const route of level ) {

				if( visited.has( route ) ) continue
				visited.add( route )
				if( visited.size > MAX ) break

				const label = route || 'главная'
				try {
					await page.goto( nav_url( route ), { waitUntil: 'networkidle0', timeout: 60_000 } )
					const count = await settle( page )
					const links = await collect( page )

					let added = 0
					for( const { route: found_route, text } of links ) {
						if( !route_indexable( found_route ) ) continue
						if( !found.has( found_route ) ) added += 1
						found.add( found_route )
						if( text && !titles.has( found_route ) ) titles.set( found_route, text )
						// Ссылки на журналы с корня — это и есть каталог: больше
						// журналами на стартовом экране ссылаться нечему.
						if( !route && route_expandable( found_route ) ) listed.add( found_route )
						// Дальше открываем только страницы-списки. Пост в next не
						// попадает никогда, поэтому MAX ограничивает журналы, а не
						// статьи, и обход не растёт вместе с журналом.
						if( !visited.has( found_route ) && route_expandable( found_route ) ) next.push( found_route )
					}

					console.log( `  ${ label }: ссылок ${ count }, новых маршрутов ${ added }` )

				} catch( error ) {
					console.log( `::warning::${ label }: обойти не вышло — ${ error.message }` )
				}

			}

			level = next
		}

		// Seed сам по себе индексируемый маршрут, даже если на него никто
		// не ссылается.
		for( const seed of seeds ) if( route_indexable( seed ) ) found.add( seed )

		const from_file = seeds.filter( seed => !listed.has( seed ) ).length
		console.log( `\nЖурналов: из каталога ${ listed.size }, только из journals.txt ${ from_file }` )

		if( !listed.size && !seeds.length ) {
			console.log( '::warning::журналов не нашлось ни в каталоге, ни в journals.txt —'
				+ ' в sitemap попадёт одна главная. Если каталог заведён, смотри лог главной выше:'
				+ ' пустой список там значит, что ленд каталога не доехал за отведённое время' )
		}

	} finally {
		await browser.close()
		server.close()
	}

	// Сортировка обязательна. Кэш mol-prerender-action считается от содержимого
	// этого файла, и болтающийся порядок ломал бы его на каждом запуске.
	const routes = [ ...found ].sort()

	// День в дайджесте — компромисс. Кэш экшена ломается сам, когда меняется
	// набор маршрутов или заголовок поста, но правку внутри тела статьи
	// краулер отсюда не видит: он читает страницу-список, а не сам пост.
	// Суточная корзина гарантирует, что такая правка доедет до статики
	// максимум за сутки. Нужно раньше — workflow_dispatch с force, он
	// подставляет сюда nonce.
	const day = new Date().toISOString().slice( 0, 10 )
	const digest = createHash( 'sha256' )
		.update( JSON.stringify( {
			routes,
			titles: routes.map( r => titles.get( r ) ?? '' ),
			day,
			nonce: NONCE,
		} ) )
		.digest( 'hex' )
		.slice( 0, 16 )

	const escape = s => s.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' )

	const body = [ '', ...routes ]
		.map( route => `\t<url>\n\t\t<loc>${ escape( BASE_URL + route ) }</loc>\n\t</url>` )
		.join( '\n' )

	const xml =
		`<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<!-- Сгенерировано deploy/routes/routes.mjs, руками не править. -->\n` +
		`<!-- Вход для mol-prerender-action: он берёт отсюда <loc> как список маршрутов. -->\n` +
		`<!-- digest ${ digest } day ${ day }${ NONCE ? ' nonce ' + NONCE : '' } -->\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		body + '\n' +
		`</urlset>\n`

	await mkdir( dirname( OUT ), { recursive: true } )
	await writeFile( OUT, xml, 'utf-8' )

	console.log( `\nМаршрутов в sitemap: ${ routes.length + 1 } (включая главную)` )
	console.log( `Записано: ${ OUT }` )
}

main().catch( error => {
	console.error( `::error::обход упал — ${ error.message }` )
	console.error( error )
	process.exit( 1 )
} )
