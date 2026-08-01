#!/bin/sh
# Обёртка вокруг chromium, на которую смотрит PUPPETEER_EXECUTABLE_PATH.
#
# Зачем: $bog_browser.window() вызывает puppeteer.launch({ headless, … }) без
# поля args, а способа передать флаги через переменные окружения у puppeteer
# нет. Менять общий модуль bog/seo ради одного проекта не хочется, поэтому
# флаги дописываются здесь — puppeteer запускает этот скрипт, скрипт запускает
# настоящий chromium.
#
# CHROME_BIN переопределяется из compose, если понадобится перейти на
# bundled-сборку puppeteer (см. README, «Если chromium не стартует»).
#
# Что означают флаги:
#
#   --no-sandbox                 в контейнере user namespaces закрыты, setuid-
#                                песочница не поднимается, без флага chromium
#                                просто не стартует
#   --disable-dev-shm-usage      /dev/shm в докере по умолчанию 64 МБ, и
#                                chromium об это спотыкается. Флаг уводит
#                                разделяемую память в /tmp, то есть на диск:
#                                медленнее tmpfs, зато не ест память, которой
#                                на этом хосте и так нет
#   --disable-gpu,               ускорителя на VPS нет, а попытка его поднять
#   --disable-software-rasterizer стоит времени и памяти
#   --disable-background-*,      всё, что фоново ходит в сеть и на диск:
#   --disable-component-update,  обновления компонентов, safebrowsing,
#   --disable-sync, …            синхронизация, переводчик. Рендеру не нужно
#   --js-flags=…max-old-space-size=128
#                                потолок кучи V8 в рендерере. Страница журнала
#                                это $mol-приложение плюс синк одного ленда,
#                                128 МБ хватает с запасом. Если начнут падать
#                                рендеры больших статей — поднимать здесь и
#                                одновременно поднимать mem_limit в compose
#
# Намеренно НЕ добавлено:
#   --single-process   ломает puppeteer (CDP-таргеты перестают появляться);
#                      экономия памяти оборачивается неработающим рендером
#   --no-zygote        без zygote процессы иногда не убираются, а pids_limit
#                      здесь жёсткий

set -eu

CHROME="${CHROME_BIN:-/usr/bin/chromium}"

exec "$CHROME" \
	--no-sandbox \
	--disable-dev-shm-usage \
	--disable-gpu \
	--disable-software-rasterizer \
	--disable-background-networking \
	--disable-component-update \
	--disable-default-apps \
	--disable-extensions \
	--disable-sync \
	--disable-translate \
	--no-first-run \
	--no-default-browser-check \
	--mute-audio \
	--js-flags=--max-old-space-size=128 \
	"$@"
