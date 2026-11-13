# ADR-0002: Evolução do produto: revisão FSRS, conta, telemetria e offline

**Status:** Aceito
**Data:** 2026-11-12
**Decisores:** Lucas Santana

## Contexto

Com a fase 1 e a 2 do ADR-0001 entregues, o app está tipado, testado e com o conteúdo validado. As lacunas que mais pesam para quem estuda:

| Lacuna                                                               | Efeito                                                            |
| -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Revisão em SM-2 com intervalos fixos (1, 3, x·ease, teto de 21 dias) | revisa cedo demais o que já sabe e não distingue chute de certeza |
| Progresso só no `localStorage`                                       | trocar de celular ou limpar o navegador apaga tudo                |
| Nenhuma visibilidade de erro em produção                             | bug no celular de um seguidor passa sem ninguém ver               |
| App exige rede                                                       | não dá para estudar no metrô                                      |
| Erro na questão não leva a nada                                      | a explicação existe, mas o caminho até o estudo é manual          |

## Decisões

### 1. Revisão: SM-2 → FSRS-5

- Usa os pesos padrão do FSRS-5. Não há otimização por usuário: o volume de revisões é pequeno demais para isso valer.
- Notas: errei (1), **acertei com dúvida** (2), acertei (3).
- Alvo de retenção de 90%; intervalo máximo de 365 dias.
- O estado antigo do SM-2 é convertido na primeira revisão sem perder a data marcada (`deSm2`).
- O módulo é puro (`src/features/srs/fsrs.ts`): o tempo entra como parâmetro, o que torna os testes determinísticos.

Alternativas: manter o SM-2 (rejeitado pelos motivos acima); Leitner (mais simples, porém pior que o SM-2).

### 2. Do erro para o estudo

`src/features/guia/citados.ts` acha os serviços do guia citados na explicação, na resposta certa e no enunciado.

- Usa um índice `id`+`nome` de 7 KB. O CI garante que ele bate com o guia.
- A comparação é sensível a maiúsculas, com limite de palavra. Nome genérico ("Glue", "Batch") só vale com o prefixo AWS/Amazon. O trecho mais longo vence.
- Na amostra, 218 das 290 questões AWS ganham link.
- A navegação guarda a origem (`from: "study"`), e "Voltar à questão" devolve a mesma questão com a explicação.

### 3. Conta e sincronização: Supabase próprio (projeto `cloudquest`, sa-east-1)

- **Login por link mágico no e-mail.** Sem senha para vazar e sem OAuth para configurar.
- **Uma linha por usuário** (`progresso`, com o estado em `jsonb` e versão). RLS: cada um só lê e escreve a própria linha.
- **Junção local × remoto** campo a campo, pelo mais avançado: conceito pela revisão mais recente; XP e contadores pelo máximo; conquistas pela união. Nunca sobrescreve progresso às cegas.
- **Chave publicável no front.** A segurança está na RLS, não em esconder a chave.

### 4. Telemetria anônima no mesmo Supabase

- Tabelas `erros` e `eventos`, só com insert anônimo. Ninguém lê pela API pública; leitura apenas pelo painel do Supabase.
- **Sem dado pessoal:** sem e-mail, IP ou user agent completo. O id de sessão é aleatório por aba.
- Limite no cliente (amostragem e teto por sessão) e `check` de tamanho no banco.

### 5. PWA offline

- Service worker próprio, com cache versionado pelo hash do build.
- O HTML é buscado na rede primeiro, com o cache como reserva; os assets com hash vêm do cache primeiro.
- Atualização sem quebrar uma sessão de estudo em andamento.

### 6. Testes de navegador: Playwright + axe-core + Lighthouse CI

Substituem os scripts puppeteer feitos à mão aos poucos, sem perder cobertura.

## Consequências

- **Fica mais fácil:** estudar em vários aparelhos, ver erros reais e medir onde o aluno desiste.
- **Fica mais difícil:** existe um backend para manter. Mitigação: migrações versionadas no repositório e advisors do Supabase no CI.
- **Rever depois:** otimizar os pesos do FSRS quando houver volume de revisões sincronizadas.
