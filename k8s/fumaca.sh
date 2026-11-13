#!/usr/bin/env bash
# Teste de fumaça do CloudQuest em contêiner: bash k8s/fumaca.sh http://localhost:8080
# Vale para o Docker Compose e para o kind. Sai com erro na primeira falha.
set -euo pipefail
BASE="${1:-http://localhost:8080}"
falhas=0
ok() { printf '  ok   %s\n' "$1"; }
erro() { printf '  ERRO %s\n' "$1"; falhas=$((falhas + 1)); }

# espera o serviço responder (até 60 s)
for _ in $(seq 1 30); do curl -fsS -o /dev/null "$BASE/healthz" && break; sleep 2; done

cab=$(curl -fsS -D - -o /tmp/cq-index.html "$BASE/" | tr -d '\r')
grep -qi '^content-security-policy:.*frame-ancestors' <<<"$cab" && ok "home com CSP" || erro "home sem CSP"
grep -qi '^x-content-type-options: nosniff' <<<"$cab" && ok "nosniff" || erro "sem nosniff"
grep -q 'id="app"' /tmp/cq-index.html && grep -q '<title>CloudQuest' /tmp/cq-index.html && ok "home é o app" || erro "home não é o app"
grep -qi '^server: nginx$' <<<"$cab" && ok "versão do nginx escondida" || erro "cabeçalho Server expõe versão"

asset=$(grep -o '/assets/[^"]*\.js' /tmp/cq-index.html | head -1)
cab=$(curl -fsS -D - -o /dev/null "$BASE$asset" | tr -d '\r')
grep -qi '^cache-control: public, max-age=31536000, immutable' <<<"$cab" && ok "asset imutável em cache" || erro "asset sem cache longo ($asset)"

cab=$(curl -fsS -D - -o /dev/null "$BASE/sw.js" | tr -d '\r')
grep -qi '^cache-control: no-cache' <<<"$cab" && ok "service worker sem cache" || erro "sw.js com cache"
grep -qi '^content-type: text/javascript' <<<"$cab" && ok "sw.js como JavaScript" || erro "sw.js com tipo errado: $(grep -i '^content-type' <<<"$cab")"
cab=$(curl -fsS -D - -o /dev/null "$BASE/manifest.webmanifest" | tr -d '\r')
grep -qi '^content-type: application/manifest+json' <<<"$cab" && ok "manifesto com tipo certo" || erro "manifesto com tipo errado: $(grep -i '^content-type' <<<"$cab")"

code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/api/r?e=saa&s=812&d=2026-11-12")
[ "$code" = 200 ] && ok "página de resultado via /api" || erro "/api/r respondeu $code"

curl -fsS -o /tmp/cq-og.png "$BASE/api/og?e=saa&s=812&d=2026-11-12"
head -c 4 /tmp/cq-og.png | od -An -tx1 | grep -q '89 50 4e 47' && ok "cartão PNG gerado" || erro "/api/og não devolveu PNG"

code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/r")
[ "$code" = 403 ] || [ "$code" = 405 ] && ok "POST recusado ($code)" || erro "POST em /api respondeu $code"

loc=$(curl -s -o /dev/null -w '%{redirect_url}' -H 'Host: malicioso.exemplo' "$BASE/api/r?e=x")
[[ "$loc" != *malicioso* ]] && ok "Host falso não vira redirect" || erro "redirect seguiu o Host do cliente: $loc"

code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/nao-existe")
[ "$code" = 404 ] && ok "404 de verdade para caminho inexistente" || erro "caminho inexistente respondeu $code"

[ "$falhas" = 0 ] && echo "fumaça: tudo certo" || { echo "fumaça: $falhas falha(s)"; exit 1; }
