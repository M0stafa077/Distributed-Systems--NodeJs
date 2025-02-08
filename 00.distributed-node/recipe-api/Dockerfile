FROM node:18.20.2 AS deps

WORKDIR /recipe-api

COPY package*.json .

RUN npm ci --only=production

FROM alpine:3.18 AS release

ENV V 18.20.2 
ENV FILE node-v$V-linux-x64-musl.tar.xz

RUN apk add --no-cache libstdc++ \
    && apk add --no-cache --virtual .deps curl \
    && curl -fsSLO --compressed \
    "https://unofficial-builds.nodejs.org/download/release/v$V/$FILE" \
    && tar -xJf $FILE -C /usr/local --strip-components=1 \
    && rm -f $FILE /usr/local/bin/npm /usr/local/bin/npx \
    && rm -rf /usr/local/lib/node_modules \
    && apk del .deps

WORKDIR /recipe-api
COPY --from=deps /recipe-api/node_modules ./node_modules
COPY . .

EXPOSE 5000

ENV PORT 5000

CMD ["node", "dist/index.js"]