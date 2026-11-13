#!/usr/bin/env bash
# Prova que a NetworkPolicy funciona: um pod qualquer não alcança a API,
# mas o web alcança. Uso: bash k8s/teste-rede.sh
set -euo pipefail
NS=cloudquest
API=http://api.cloudquest.svc.cluster.local:3000/healthz

# 1. de fora do namespace: precisa ser bloqueado
if kubectl run teste-rede --rm -i --restart=Never --quiet --image=busybox:1.36 -n default -- \
  wget -q -T 4 -O- "$API" >/dev/null 2>&1; then
  echo "ERRO: um pod fora do web chegou na API; a NetworkPolicy não está sendo aplicada"
  exit 1
fi
echo "  ok   pod qualquer não alcança a API"

# 2. do próprio web: precisa funcionar
pod=$(kubectl -n "$NS" get pod -l app.kubernetes.io/name=web -o jsonpath='{.items[0].metadata.name}')
if kubectl -n "$NS" exec "$pod" -- wget -q -T 4 -O- "$API" | grep -q ok; then
  echo "  ok   web alcança a API"
else
  echo "ERRO: o web não alcança a API"
  exit 1
fi

# 3. a API não sai para a internet
pod=$(kubectl -n "$NS" get pod -l app.kubernetes.io/name=api -o jsonpath='{.items[0].metadata.name}')
if kubectl -n "$NS" exec "$pod" -- wget -q -T 4 -O- http://example.com >/dev/null 2>&1; then
  echo "ERRO: a API conseguiu sair para a internet"
  exit 1
fi
echo "  ok   API sem saída para a internet"
