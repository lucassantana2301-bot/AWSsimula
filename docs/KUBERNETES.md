# CloudQuest em Docker e Kubernetes (custo zero)

Laboratório para aprender contêineres e orquestração com o próprio CloudQuest.
Tudo roda **no seu computador**: sem nuvem, sem cartão, sem conta paga.
A produção continua no Vercel; este é o ambiente de estudo.

```
seu navegador ──► localhost:8080
                     │
        ┌────────────┴─────────────┐  cluster kind (2 nós, dentro do Docker)
        │  Service web (NodePort)  │
        │     ├─ pod web (nginx)   │──► arquivos do app
        │     └─ pod web (nginx)   │──► /api/* ──┐
        │                          │             ▼
        │  Service api (ClusterIP) │   pod api (Node) ×2..5 (HPA)
        └──────────────────────────┘
```

## 1. Instalar (uma vez)

| Ferramenta                                 | Para quê                    | Windows                               | macOS                        | Linux                                                                                       |
| ------------------------------------------ | --------------------------- | ------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| Docker Desktop (ou Docker Engine no Linux) | rodar contêineres           | `winget install Docker.DockerDesktop` | `brew install --cask docker` | [docs.docker.com/engine/install](https://docs.docker.com/engine/install/)                   |
| kind                                       | Kubernetes dentro do Docker | `winget install Kubernetes.kind`      | `brew install kind`          | binário em [kind.sigs.k8s.io](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) |
| kubectl                                    | conversar com o cluster     | `winget install Kubernetes.kubectl`   | `brew install kubectl`       | [kubernetes.io/docs/tasks/tools](https://kubernetes.io/docs/tasks/tools/)                   |

No Windows, rode os comandos no PowerShell ou no terminal do WSL, com o Docker Desktop aberto.
Os scripts `k8s/*.sh` precisam de bash (WSL ou Git Bash).

Uso individual e educacional do Docker Desktop é gratuito. Confira os termos se for usar numa empresa grande.

## 2. Nível 1: Docker Compose

```bash
docker compose up --build        # primeira vez leva alguns minutos
# abra http://localhost:8080
docker compose down              # para tudo
```

O que observar:

- `Dockerfile` tem **várias etapas** (multi-stage): uma instala dependências, outra compila, e as imagens finais só levam o necessário. A imagem do site não tem Node; a da API não tem o código-fonte.
- As duas imagens rodam como **usuário sem privilégio**, com **sistema de arquivos só leitura** e sem capacidades do kernel (`cap_drop: ALL`).
- O nginx repassa `/api/*` para o contêiner `api` pelo nome do serviço, resolvido pela rede interna do Compose.

Teste rápido (com o Compose no ar):

```bash
bash k8s/fumaca.sh http://localhost:8080
```

## 3. Nível 2: Kubernetes no kind

```bash
docker compose down                                   # libera a porta 8080

# cluster com 1 control-plane e 1 worker
kind create cluster --config k8s/kind/cluster.yaml

# constrói as imagens e copia para dentro do cluster (sem registro, sem custo)
docker build --target api -t cloudquest-api:local .
docker build --target web -t cloudquest-web:local .
kind load docker-image cloudquest-api:local cloudquest-web:local --name cloudquest

# aplica tudo e espera ficar pronto
kubectl apply -k k8s/kind
kubectl -n cloudquest rollout status deploy/api
kubectl -n cloudquest rollout status deploy/web
# abra http://localhost:8080
```

Testes que o CI também roda:

```bash
bash k8s/fumaca.sh http://localhost:8080   # o app responde certo
bash k8s/teste-rede.sh                     # NetworkPolicy isola a API
bash k8s/teste-rollout.sh                  # atualização sem nenhuma requisição perdida
```

Para apagar tudo: `kind delete cluster --name cloudquest`.

## 4. O que cada arquivo ensina

| Arquivo                         | Conceito                                                                                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `k8s/base/namespace.yaml`       | Namespace com **Pod Security Admission** no perfil `restricted`: o cluster recusa pod inseguro                                                                         |
| `k8s/base/api.yaml`, `web.yaml` | **Deployment** (réplicas, atualização gradual com `maxUnavailable: 0`), **Service**, **probes** de prontidão e vida, **requests/limits**, `securityContext`, `preStop` |
| `k8s/base/disponibilidade.yaml` | **PodDisruptionBudget** (manutenção nunca derruba tudo) e **HorizontalPodAutoscaler** (escala a API por CPU)                                                           |
| `k8s/base/rede.yaml`            | **NetworkPolicy**: nega tudo, depois libera só web → api e o DNS                                                                                                       |
| `k8s/base/kustomization.yaml`   | **Kustomize** e **ConfigMap** gerado                                                                                                                                   |
| `k8s/kind/`                     | **Overlay**: o mesmo base, ajustado para o ambiente local (imagens locais e NodePort)                                                                                  |
| `server/api.ts`                 | Encerramento gracioso no **SIGTERM** e origem pública fixa por variável                                                                                                |

## 5. Exercícios

1. **Escala na mão:** `kubectl -n cloudquest scale deploy/web --replicas=4` e veja com `kubectl -n cloudquest get pods -o wide` em que nó cada um caiu.
2. **Autocura:** apague um pod (`kubectl -n cloudquest delete pod <nome>`) e veja o Deployment recriar.
3. **HPA de verdade:** o kind não vem com o metrics-server, então o HPA mostra `<unknown>`. Instale o metrics-server, gere carga em `/api/og` e veja as réplicas subirem.
4. **Rollback:** troque a imagem para uma tag que não existe, veja o rollout travar sem derrubar o site e volte com `kubectl -n cloudquest rollout undo deploy/web`.
5. **Rede:** apague `k8s/base/rede.yaml` do kustomization, reaplique e rode `bash k8s/teste-rede.sh`. Ele vai falhar, e esse é o ponto.
6. **Próximo passo, Gateway API:** o controlador Ingress NGINX foi aposentado em março de 2026, e o sucessor é o Gateway API. Troque o NodePort por um Gateway + HTTPRoute com uma implementação gratuita (Traefik, Envoy Gateway ou NGINX Gateway Fabric).

## 6. Limites do ambiente local

- **Login por e-mail não funciona em `localhost:8080`.** O Supabase só aceita os endereços de retorno cadastrados. O resto do app funciona, e o progresso fica salvo no navegador.
- **Telemetria desligada.** O build local tem versão `dev`, então o app não manda nada ao Supabase.
- **Custo zero de verdade:** nada aqui cria recurso em nuvem. O workflow `k8s.yml` do GitHub Actions só roda quando arquivos de contêiner mudam, para não gastar os minutos gratuitos.
