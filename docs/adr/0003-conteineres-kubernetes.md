# ADR-0003: Contêineres e Kubernetes local como laboratório, custo zero

**Status:** Aceito
**Data:** 2026-11-13
**Decisores:** Lucas Santana

## Contexto

O CloudQuest é um app de estudo para certificações de nuvem, e o autor quer praticar Docker e Kubernetes com um projeto real. Restrição dura: **custo zero**, sem cartão e sem conta paga. A produção já roda no Vercel e deve continuar lá.

O app tem duas partes: um site estático (build do Vite) e duas funções (`/api/r` e `/api/og`) escritas como handlers `Request → Response`.

## Decisão

1. **Um Dockerfile multi-stage com dois alvos.** `web` usa nginx sem privilégio, com os mesmos cabeçalhos do `vercel.json`, e repassa `/api/*`. `api` é um servidor Node pequeno (`server/api.ts`) que reaproveita os handlers do Vercel sem copiar código.
2. **Compose** para o primeiro contato e **kind** para Kubernetes de verdade, tudo local.
3. **Kustomize** com `base` + overlay `kind`, em vez de Helm: menos abstração para quem está aprendendo, e nativo do `kubectl`.
4. **Exposição por NodePort** mapeado pelo kind para `localhost:8080`. O controlador Ingress NGINX foi aposentado em março de 2026; o sucessor é o Gateway API, que fica como exercício (`docs/KUBERNETES.md`).
5. **Segurança por padrão:** Pod Security `restricted` no namespace, não-root, raiz só leitura, `drop: ALL`, sem token de service account, NetworkPolicy que nega tudo e libera só web → api e o DNS.
6. **Testes:** `tests/unit/infra.test.ts` guarda as regras sem Docker, em todo CI. O workflow `k8s.yml` faz o teste real (build, Compose, kind, rede e rollout sem queda), mas só quando arquivos de contêiner mudam.

## Opções consideradas

### Nuvem gerenciada (AKS, GKE, OKE)

| Dimensão     | Avaliação                                                                               |
| ------------ | --------------------------------------------------------------------------------------- |
| Custo        | Plano de controle grátis ou com crédito, mas nós, IP público e balanceador são cobrados |
| Complexidade | Média                                                                                   |
| Risco        | Esquecer um recurso ligado gera conta                                                   |

Descartada pela restrição de custo zero. Fica para depois, com crédito de estudante e alerta de orçamento.

### Helm

Mais poderoso para distribuir pacotes, mas os templates escondem o YAML que se quer aprender. Kustomize mostra o recurso final.

### Ingress NGINX

Era o padrão, mas está aposentado e sem correções de segurança. Usar algo descontinuado num projeto de estudo ensina o hábito errado.

## Consequências

- **Fica mais fácil:** rodar o app inteiro com um comando; praticar escala, autocura, rollback e políticas de rede sem gastar nada.
- **Fica mais difícil:** os cabeçalhos de segurança existem em dois lugares (`vercel.json` e `docker/nginx/seguranca.conf`). Um teste compara os dois.
- **A revisitar:** Gateway API no lugar do NodePort; metrics-server para o HPA; um registro de imagens gratuito (GHCR) se um dia houver deploy fora da máquina local.
