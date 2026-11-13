# ADR-0001: Reengenharia para Vite + TypeScript, conteúdo como dado e migração gradual

**Status:** Aceita
**Data:** 2026-11-12
**Decisores:** Lucas Santana (dono do produto e do código)

## Contexto

O CloudQuest começou como um HTML único montado por `scripts/build.mjs`, que concatena 29 arquivos de script num só `<script>`. Funcionou bem para iterar rápido e hoje o app tem 399 questões, 51 fichas, 25 baralhos, prova completa, painel de prontidão e guia de serviços. O crescimento expôs limites estruturais:

| Medida                     | Hoje                                                                    |
| -------------------------- | ----------------------------------------------------------------------- |
| Página entregue ao celular | 1,3 MB em um arquivo, tudo carregado de uma vez                         |
| Questões dentro da página  | 698 KB, inclusive das provas que o estudante não estuda                 |
| Escopo de nomes            | 216 declarações globais compartilhadas por todos os arquivos            |
| Motor                      | `p5-engine.js` com 2.100 linhas: estado, rotas, telas e ações juntos    |
| Tipos                      | nenhum; erros de forma de dado só aparecem em teste ou em produção      |
| Conteúdo                   | arrays JS escritos à mão; a estrutura é validada só por testes próprios |
| Qualidade automática       | 14 suítes próprias (Node + Puppeteer), sem lint, sem CI no GitHub       |
| Segurança de HTML          | 149 chamadas manuais a `esc()`; esquecer uma é uma XSS                  |

Forças: o app está no ar e é usado; o dono quer padrão de engenharia sênior; o conteúdo cresce por lotes escritos por agentes e precisa de validação forte; o público usa celular.

## Decisão

1. **Vite + TypeScript estrito** (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) como base de build, com ESLint (typescript-eslint strict) e Prettier.
2. **Conteúdo é dado, não código.** Questões, fichas, aulas, baralhos, guia e duelos passam para `content/**/*.json`, com **schemas Zod** como fonte única da forma. O build e o CI rejeitam conteúdo inválido. Os tipos TS são inferidos dos schemas.
3. **Conteúdo carregado sob demanda por prova** (`import()` dinâmico): o estudante de SAA não baixa AZ-104.
4. **Migração gradual (strangler fig), não reescrita de uma vez.** O motor atual vira um módulo legado empacotado pelo Vite; cada funcionalidade é extraída para um módulo TS tipado (`src/features/<nome>/`), com seus testes, uma por vez. O app fica no ar e verde durante toda a migração.
5. **Renderização com template marcado que escapa por padrão** (`html\`...\``): interpolação é texto; HTML só entra de forma explícita (`raw()`). Elimina a classe de bug "esqueceu o esc()".
6. **Estado tipado com versão e migrações** (`v2 → v3`), preservando o progresso salvo no navegador de quem já usa.
7. **Testes:** Vitest para unidade e conteúdo; Playwright + axe-core para fluxos, layout e acessibilidade (substituindo os scripts Puppeteer).
8. **CI no GitHub Actions** em cada push e PR: typecheck, lint, testes, validação de conteúdo, build, e2e e orçamento de tamanho. A Vercel publica só o que passou.
9. **PWA**: service worker com o app e o conteúdo já visto em cache, para estudar sem internet.

## Opções consideradas

### A: Manter a concatenação e só acrescentar ferramentas (lint, CI, JSDoc)

| Dimensão           | Avaliação                              |
| ------------------ | -------------------------------------- |
| Complexidade       | Baixa                                  |
| Risco de regressão | Baixo                                  |
| Escalabilidade     | Ruim: globais e página única continuam |
| Benefício          | Pequeno                                |

**Prós:** rápido. **Contras:** não resolve tamanho, acoplamento nem tipos.

### B: Reescrever tudo em React/Next de uma vez

| Dimensão           | Avaliação                                                   |
| ------------------ | ----------------------------------------------------------- |
| Complexidade       | Alta                                                        |
| Risco de regressão | Alto: 2.100 linhas de telas reescritas sem rede de proteção |
| Escalabilidade     | Boa                                                         |
| Benefício          | Alto no fim, nenhum até o fim                               |

**Prós:** arquitetura moderna. **Contras:** semanas com o app parado ou divergente; joga fora testes que dependem do DOM; View Transitions e o módulo de movimento teriam de ser refeitos.

### C (escolhida): Vite + TypeScript, conteúdo como dado, migração gradual

| Dimensão           | Avaliação                                  |
| ------------------ | ------------------------------------------ |
| Complexidade       | Média                                      |
| Risco de regressão | Baixo: cada passo mantém a suíte verde     |
| Escalabilidade     | Boa: módulos, tipos e conteúdo sob demanda |
| Benefício          | Contínuo, a cada fase                      |

## Análise de trade-offs

A escolha troca velocidade de "ficar moderno no papel" (B) por **entrega contínua sem regressão**. Framework de componentes não é necessário agora: as telas já são funções que devolvem HTML; com template que escapa por padrão e módulos tipados, ganham-se os benefícios de segurança e organização sem reescrita. Se a interatividade crescer a ponto de pedir estado reativo fino, Preact entra como ADR futuro, já com tipos e testes no lugar.

## Consequências

- **Fica mais fácil:** adicionar conteúdo (schema diz o que falta), achar código (módulo por funcionalidade), mudar com confiança (tipos + CI), carregar rápido no celular.
- **Fica mais difícil:** o build tem mais peças; contribuir exige Node + `npm ci`.
- **A revisitar:** framework de componentes (ADR futuro); sincronização entre aparelhos (exige backend, ADR futuro).

## Plano em fases

1. **Fundação:** Vite + TS + ESLint + Prettier + Vitest; conteúdo extraído para JSON com schemas Zod; motor legado empacotado sem mudança de comportamento; CI no GitHub; publicação na Vercel pelo novo build. _Critério de saída:_ app idêntico, todos os testes verdes, CI obrigatório.
2. **Conteúdo sob demanda:** divisão por prova e carregamento dinâmico; orçamento de tamanho no CI.
3. **Extração de módulos:** estado, rotas, template seguro, depois cada funcionalidade (simulado, prontidão, guia, trilha, revisão, baralhos, desafios) para `src/features/*` com testes Vitest.
4. **Testes de ponta a ponta:** Playwright + axe-core no lugar dos scripts Puppeteer.
5. **PWA offline** e medição contínua (Lighthouse CI).
