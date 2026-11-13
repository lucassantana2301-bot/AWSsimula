#!/usr/bin/env bash
# Reinicia os dois Deployments com tráfego contínuo e conta as falhas.
# Com maxUnavailable 0, readinessProbe e preStop, o esperado é nenhuma.
# 429 conta como servida: é o limite de taxa respondendo (o tráfego sai de um IP só), não queda.
# Uso: bash k8s/teste-rollout.sh http://localhost:8080
set -euo pipefail
BASE="${1:-http://localhost:8080}"
NS=cloudquest
LOG=$(mktemp)
PARAR=$(mktemp -u)

# gerador de tráfego em paralelo: alterna página e API até o sinal de parada
(
  while [ ! -e "$PARAR" ]; do
    for url in "$BASE/" "$BASE/api/r?e=saa&s=812&d=2026-11-12"; do
      echo "$(curl -s -o /dev/null -m 5 -w '%{http_code}' "$url" || echo 000) $url" >>"$LOG"
    done
  done
) &
gerador=$!
trap 'touch "$PARAR"; wait "$gerador" 2>/dev/null || true; rm -f "$LOG" "$PARAR"' EXIT

sleep 2 # tráfego já fluindo antes de começar
kubectl -n "$NS" rollout restart deploy/api deploy/web
kubectl -n "$NS" rollout status deploy/api --timeout=180s
kubectl -n "$NS" rollout status deploy/web --timeout=180s
sleep 5 # os pods antigos terminam o preStop e saem com o tráfego ainda rodando
touch "$PARAR"
wait "$gerador" || true

total=$(wc -l <"$LOG")
falhas=$(grep -Evc '^(200|429) ' "$LOG" || true)
limitadas=$(grep -c '^429 ' "$LOG" || true)
echo "  requisições durante o rollout: $total, falhas: $falhas, limitadas (429): $limitadas"
grep -Ev '^(200|429) ' "$LOG" | sort | uniq -c | head -5 || true
[ "$total" -ge 100 ] || { echo "ERRO: tráfego pequeno demais para provar algo ($total)"; exit 1; }
[ "$falhas" = 0 ] || { echo "ERRO: houve queda durante a atualização"; exit 1; }
echo "  ok   atualização sem queda"
