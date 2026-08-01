#!/bin/sh
# Собирает бандл $bog_seo и складывает в dist/ всё, что нужно увезти на сервер.
# Запускать локально, из корня MAM или откуда угодно — путь вычисляется сам.
#
#   sh bog/journal/deploy/build.sh
#   scp bog/journal/deploy/journal-seo.tgz root@87.120.36.150:/root/
#
# На сервер этот скрипт не ходит и ничего там не делает.

set -eu

here=$( cd "$( dirname "$0" )" && pwd )
root=$( cd "$here/../../.." && pwd )

if [ ! -d "$root/mol" ]; then
	echo "не похоже на корень MAM: $root" >&2
	exit 1
fi

# mam кэширует бандл, и без чистки в node.js уезжает прошлая сборка.
# На этом уже обжигались с bog/music/tube.
rm -rf "$root/bog/seo/-"

( cd "$root" && npx mam bog/seo )

if [ ! -f "$root/bog/seo/-/node.js" ]; then
	echo "сборка не дала bog/seo/-/node.js" >&2
	exit 1
fi

dist="$here/dist"
rm -rf "$dist"
mkdir -p "$dist"

cp "$root/bog/seo/-/node.js" "$dist/node.js"
cp "$here/Dockerfile"          "$dist/"
cp "$here/package.json"        "$dist/"
cp "$here/chromium-lean.sh"    "$dist/"
cp "$here/docker-compose.yml"  "$dist/"
cp "$here/warmup.sh"           "$dist/"

tar -czf "$here/journal-seo.tgz" -C "$dist" .

echo
echo "готово: $here/journal-seo.tgz"
echo "дальше — README.md, раздел «Развёртывание»"
