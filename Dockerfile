# syntax=docker/dockerfile:1.7
# CloudQuest em contêiner (ADR-0003). Um Dockerfile, duas imagens:
#   docker build --target web -t cloudquest-web .
#   docker build --target api -t cloudquest-api .
# Tudo roda como usuário sem privilégio e com sistema de arquivos só leitura.

# Fixadas por digest: a tag pode ser repontada (foi o que aconteceu com o trivy-action em
# 03/2026); o digest não. O Dependabot (ecossistema docker) abre PR quando sai um novo.
ARG NODE_IMAGE=node:22-alpine@sha256:1314fb30ec37592d5845e5a160d522c0e680972aa534549940b8d73bde88481a
ARG NGINX_IMAGE=nginxinc/nginx-unprivileged:1.27-alpine@sha256:65e3e85dbaed8ba248841d9d58a899b6197106c23cb0ff1a132b7bfe0547e4c0

# ---------- dependências (cache separado do código) ----------
FROM ${NODE_IMAGE} AS deps
WORKDIR /src
COPY package.json package-lock.json ./
# sem scripts de instalação: nenhum pacote do projeto precisa deles para o build
RUN npm ci --ignore-scripts --no-audit --no-fund

# ---------- build do site e da API ----------
FROM deps AS build
COPY . .
RUN npm run build && npm run build:api

# ---------- dependências de produção da API ----------
# Instaladas na mesma base (Alpine/musl) da imagem final: o @resvg/resvg-js
# traz binário nativo e o pacote certo depende da libc.
FROM ${NODE_IMAGE} AS api-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund \
 && rm -rf node_modules/@supabase

# ---------- imagem da API ----------
FROM ${NODE_IMAGE} AS api
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY --from=api-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /src/build-api/server.mjs ./server.mjs
COPY --from=build --chown=node:node /src/api/_fontes ./api/_fontes
COPY --chown=node:node package.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1
CMD ["node", "server.mjs"]

# ---------- imagem do site ----------
FROM ${NGINX_IMAGE} AS web
ENV API_UPSTREAM=http://api:3000
# só ${API_UPSTREAM} é substituído; as variáveis do nginx ($uri) ficam intactas
ENV NGINX_ENVSUBST_FILTER=API_UPSTREAM
COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/nginx/seguranca.conf /etc/nginx/snippets/seguranca.conf
COPY --from=build /src/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
