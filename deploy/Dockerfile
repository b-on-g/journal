# $bog_seo — prerender-прокси для журнала.
#
# Образ собирается на сервере из этой же папки: рядом должны лежать
# package.json, chromium-lean.sh и node.js (бандл, кладёт build.sh).

FROM node:22-slim

# Chromium из apt, а не bundled-сборка puppeteer.
#
# `npx puppeteer browsers install chrome` тянет ~180 МБ и требует вручную
# перечислить полтора десятка libnss3/libatk/libgbm/…, имена которых Debian
# периодически переименовывает (libasound2 → libasound2t64). Пакет chromium
# подтягивает те же зависимости сам и обновляется вместе с базовым образом.
# Расплата — возможный разрыв версий puppeteer↔chrome; для того, что реально
# использует $bog_browser (goto / content / $$ / evaluate), это давно
# стабильные части CDP. Если разрыв всё же вылезет — см. README, раздел
# «Если chromium не стартует».
RUN apt-get update \
	&& apt-get install -y --no-install-recommends chromium ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Шрифты намеренно не ставим: $bog_browser забирает только page.content(),
# скриншотов нет, и отсутствие шрифтов на разметку не влияет.

# npm не должен качать свой Chrome — мы им не пользуемся.
ENV PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /app

COPY package.json .
RUN npm install --omit=dev

# $bog_browser зовёт puppeteer.launch() без args, а без --no-sandbox
# и --disable-dev-shm-usage chromium в контейнере не живёт. Править
# bog/seo под один проект нельзя, поэтому флаги подмешивает обёртка,
# на которую смотрит PUPPETEER_EXECUTABLE_PATH.
COPY chromium-lean.sh /usr/local/bin/chromium-lean
RUN chmod +x /usr/local/bin/chromium-lean
ENV PUPPETEER_EXECUTABLE_PATH=/usr/local/bin/chromium-lean

COPY node.js .

# node:22-slim уже содержит непривилегированного пользователя node.
# Chromium всё равно идёт с --no-sandbox (user namespaces в докере закрыты),
# так что рут внутри контейнера — лишний риск без единого плюса.
USER node

ENV BOG_SEO_PORT=3334
EXPOSE 3334

CMD [ "node", "node.js" ]
