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
// Обход мелкий: открываются только страницы-списки (seed'ы), ссылки на посты
// с них собираются, но сами посты не открываются. Их отрисует экшен.
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
// Глубина навигации, а не глубина ссылок: 1 = открыть только seed-страницы,
// ссылки с них записать, но не открывать. Больше единицы имеет смысл, только
// если появятся страницы-списки, на которые ведут ссылки с других списков.
const DEPTH = Number( args[ 'depth' ] || 1 )
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

function route_indexable( route ) {
	if( !route ) return false
	const segments = route.split( '/' ).filter( Boolean )
	if( !segments.length ) return false
	return segments.every( seg => INDEXABLE_KEYS.has( seg.split( '=' )[ 0 ] ) )
}

const sleep = ms => new Promise( r => setTimeout( r, ms ) )

/**
 * Ждём, пока страница перестанет меняться.
 *
 * Просто networkidle0 тут не годится: контент приезжает CRDT-синком по
 * вебсокету уже ПОСЛЕ того, как затихли http-запросы, а вебсокет puppeteer
 * в счётчик запросов не берёт. Поэтому считаем ссылки, пока их число не
 * перестанет расти.
 */
async function settle( page ) {
	const until = Date.now() + TIMEOUT
	let prev = -1
	let stable = 0
	while( Date.now() < until ) {
		const count = await page.evaluate( ()=> document.querySelectorAll( 'a[href]' ).length )
		if( count === prev ) {
			stable += 1
			if( stable >= 2 && count > 0 ) return count
		} else {
			prev = count
			stable = 0
		}
		await sleep( 500 )
	}
	return prev
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
	if( !seeds.length ) {
		console.log( '::warning::список журналов пуст — в sitemap попадёт только главная. Заполни deploy/routes/journals.txt' )
	}

	const server = await serve()
	const browser = await puppeteer.launch( {
		headless: true,
		args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
	} )

	// Заголовки ссылок нужны не поисковику, а дайджесту: по ним ломается кэш
	// рендера, когда пост переименовали.
	const titles = new Map()
	const found = new Set()

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
						if( !visited.has( found_route ) ) next.push( found_route )
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
