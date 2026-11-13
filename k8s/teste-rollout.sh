#!/usr/bin/env bash
# Reinicia os dois Deployments com tráfego contínuo e conta as falhas.
# Com maxUnavailable 0, readinessProbe e preStop, o esperado é nenhuma.
# Uso: bash k8s/teste-rollout.sh http://localhost:8080
set -euo pipefail
BASE="${1:-http://localhost:8080}"
NS=cloudquest
total=0; falhas=0

kubectl -n "$NS" rollout restart deploy/api deploy/web
fim=$((SECONDS + 150))
while [ $SECONDS -lt $fim ]; do
  for url in "$BASE/" "$BASE/api/r?e=saa&s=812&d=2026-11-12"; do
    code=$(curl -s -o /dev/null -m 5 -w '%{http_code}' "$url" || true)
    total=$((total + 1))
    [ "$code" = 200 ] || { falhas=$((falhas + 1)); echo "  falha: $url -> $code"; }
  done
  # terminou quando os dois rollouts concluíram
  if kubectl -n "$NS" rollout status deploy/api --timeout=1s >/dev/null 2>&1 &&
     kubectl -n "$NS" rollout status deploy/web --timeout=1s >/dev/null 2>&1; then
    break
  fi
  sleep 0.2
done

echo "  requisições durante o rollout: $total, falhas: $falhas"
[ "$falhas" = 0 ] || { echo "ERRO: houve queda durante a atualização"; exit 1; }
echo "  ok   atualização sem queda"
