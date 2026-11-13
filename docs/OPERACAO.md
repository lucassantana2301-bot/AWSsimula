# Operação

## O que vigia a produção

| O quê                                                                                                         | Onde ver                                                | Custo                            |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------- |
| Monitor sintético a cada 6 h (home, CSP, bundle, `/api/r`, `/api/og`, `/api/csp`, service worker)             | Actions → "Monitor da produção"; falha chega por e-mail | ~120 min/mês dos 2.000 gratuitos |
| Violações de CSP (`report-uri` e `report-to` → `/api/csp`)                                                    | Vercel → Logs, filtrando `"msg":"csp"`                  | zero (só log)                    |
| Erros de JavaScript e Web Vitals de campo (LCP, INP, CLS, 20% das sessões)                                    | Perfil → Painel do app (admin)                          | cota gratuita do Supabase        |
| Vulnerabilidades: `npm audit` de produção (todo PR), Trivy nas imagens (PRs de contêiner), Dependabot semanal | PRs e Actions                                           | zero                             |
| Teste de mutação semanal                                                                                      | Actions → "Teste de mutação" (relatório como artefato)  | ~5 min/semana                    |

## Limite de taxa

- `/api/og` gera imagem (~150 ms de CPU). A primeira barreira é a CDN: a URL tem uma forma canônica
  (`e`, `s`, `d`, nessa ordem); qualquer variação recebe 301 para ela, então cada combinação é
  gerada uma vez e servida do cache por 7 dias. A segunda é um balde por IP em cada instância da
  função (20 de rajada, 1 a cada 3 s). Não substitui um WAF: para um ataque distribuído, ative
  uma regra de rate limit no Firewall do Vercel.
- No contêiner, a API limita todas as rotas `/api` (30 de rajada, 1/s por IP). O IP vem do
  `X-Real-IP` que o nginx sobrescreve, e só é lido com `TRUST_PROXY=1`. Com N réplicas, o limite
  efetivo é N vezes maior.

## Migrações do banco

Pendentes no projeto `htibjmqcxfbciqczfdrt` (aplicar nesta ordem):

1. `20261113030000_telemetria_cota_diaria.sql`
2. `20261113040000_questoes_reportadas.sql`
3. `20261113050000_web_vitais.sql`

Duas formas:

- **SQL Editor do Supabase**: cole cada arquivo e execute.
- **Workflow "Migrações do Supabase"** (manual): cadastre os segredos `SUPABASE_ACCESS_TOKEN` e
  `SUPABASE_DB_PASSWORD`, rode uma vez sem marcar "aplicar" (mostra o plano), depois marcando.
  Se 0001 e 0002 foram aplicadas pelo SQL Editor, marque-as antes no histórico do CLI:
  `npx supabase@3.1.0 migration repair --status applied 20261113010000 20261113020000 --linked`.

Enquanto a 0005 não for aplicada, o evento `web_vitais` é recusado pelo banco (sem efeito no app)
e o painel simplesmente não mostra a seção de desempenho.
