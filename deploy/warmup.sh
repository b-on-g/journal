#!/bin/sh
# Прогрев кэша рендеров. Запускать на сервере руками, когда на хосте тихо.
#
#   sh warmup.sh
#
# Зачем отдельный скрипт, а не BOG_SEO_WARMUP=true: с этим флагом обход
# запускается при каждом старте контейнера, то есть и при каждом рестарте
# после падения, и при перезагрузке хоста — ровно в тот момент, когда
# мастер-нода поднимается и памяти меньше всего. Здесь то же самое, но
# в момент, который выбираем мы.
#
# Первый /sitemap.xml на пустом кэше сам запускает полный обход (bog/seo
# зовёт crawl_all прямо в обработчике), поэтому одного запроса достаточно —
# всё остальное здесь ради наблюдаемости.

set -eu

BASE="${BASE:-http://127.0.0.1:3334}"
UA="${UA:-Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)}"

echo "== до прогрева =="
docker stats --no-stream bog-journal-seo || true

echo
echo "== обход сайта (может занять минуты) =="
# Таймаут щедрый: обход рендерит каждую найденную страницу в chromium.
curl -fsS --max-time 900 "$BASE/sitemap.xml" -o /tmp/journal-sitemap.xml

echo "страниц в sitemap: $( grep -c '<loc>' /tmp/journal-sitemap.xml || echo 0 )"

echo
echo "== контрольный запрос ботом =="
curl -fsS --max-time 120 -A "$UA" -D /tmp/journal-head.txt "$BASE/journal/" -o /dev/null
grep -i '^x-prerender' /tmp/journal-head.txt || echo "нет заголовка X-Prerender — запрос не попал в prerender"

echo
echo "== после прогрева =="
docker stats --no-stream bog-journal-seo || true
