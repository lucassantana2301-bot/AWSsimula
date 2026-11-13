#!/usr/bin/env bash
# Monitor sintético da produção (auditoria de QA, item 43): bash scripts/monitor-producao.sh [URL]
# Só leitura e só GET: não grava nada nem suja a telemetria. Sai com erro se algo quebrou.
set -uo pipefail
BASE="${1:-https://awssimula.vercel.app}"
falhas=0
ok() { printf '  ok   %s\n' "$1"; }
erro() { printf '  ERRO %s\n' "$1"; falhas=$((falhas + 1)); }
# pedido com timeout e uma nova tentativa só para erro de rede (000), nunca para 4xx/5xx
pedir() { curl -sS --max-time 15 --retry 1 --retry-connrefused "$@"; }

DATA=$(date -u +%F)
cab=$(pedir -D - -o /tmp/mon-index.html "$BASE/" | tr -d '\r')
grep -q '^HTTP/[0-9.]* 200' <<<"$cab" && ok "home 200" || erro "home: $(head -1 <<<"$cab")"
grep -qi '^content-security-policy:.*frame-ancestors' <<<"$cab" && ok "CSP presente" || erro "home sem CSP"
grep -qi "^content-security-policy:.*report-uri /api/csp" <<<"$cab" && ok "CSP reporta violações" || erro "CSP sem report-uri"
grep -q 'id="app"' /tmp/mon-index.html && ok "home é o app" || erro "home não é o app"

asset=$(grep -o '/assets/[^"]*\.js' /tmp/mon-index.html | head -1)
[ -n "$asset" ] && [ "$(pedir -o /dev/null -w '%{http_code}' "$BASE$asset")" = 200 ] && ok "bundle principal ($asset)" || erro "bundle principal não carrega ($asset)"

code=$(pedir -o /tmp/mon-r.html -w '%{http_code}' "$BASE/api/r?e=saa&s=812&d=$DATA")
[ "$code" = 200 ] && grep -q 'og:image' /tmp/mon-r.html && ok "/api/r com Open Graph" || erro "/api/r respondeu $code"

code=$(pedir -o /tmp/mon-og.png -w '%{http_code}' "$BASE/api/og?e=saa&s=812&d=$DATA")
[ "$code" = 200 ] && head -c 4 /tmp/mon-og.png | od -An -tx1 | grep -q '89 50 4e 47' && ok "/api/og gera PNG" || erro "/api/og respondeu $code"

code=$(pedir -o /dev/null -w '%{http_code}' "$BASE/api/csp")
[ "$code" = 405 ] && ok "/api/csp no ar (GET recusado)" || erro "/api/csp respondeu $code a GET"

code=$(pedir -o /dev/null -w '%{http_code}' "$BASE/sw.js")
[ "$code" = 200 ] && ok "service worker" || erro "sw.js respondeu $code"

[ "$falhas" = 0 ] && echo "produção: tudo certo" || { echo "produção: $falhas falha(s)"; exit 1; }
