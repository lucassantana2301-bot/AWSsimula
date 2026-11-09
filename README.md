# CloudQuest

Estudo para certificações Microsoft Azure e AWS, pelo guia oficial de cada exame. Cada domínio tem quatro etapas em sequência — ficha, aula, prática e chefe — e a prática só abre depois que o conteúdo do domínio foi lido.

Feito para estudar e para compartilhar: roda inteiro no navegador, sem conta e sem servidor.

## O que tem dentro

| Exame | Fichas | Questões |
|---|---|---|
| AZ-900 Azure Fundamentals | 10 | 44 |
| AZ-104 Azure Administrator | 8 | 35 |
| CLF-C02 AWS Cloud Practitioner | 12 | 52 |
| SAA-C03 AWS Solutions Architect Associate | 10 | 40 |

No total: 40 fichas (cerca de 230 minutos de leitura), 26 aulas de 90 segundos, 171 questões com explicação para cada alternativa errada, 207 cartões de memorização com revisão espaçada e 13 baralhos de classificação.

A **trilha de carreira** mapeia 29 certificações das duas nuvens em sete objetivos — administrar, arquitetar, DevOps, segurança, dados, IA e desenvolvimento — com pré-requisito, horas de estudo, custo e validade de cada etapa. Só 4 delas têm conteúdo aqui; as outras servem para planejar.

## Rodar localmente

```bash
npm install
npm run build        # gera dist/index.html
npx serve dist       # ou abra dist/index.html direto no navegador
```

## Estrutura

```
src/
  p1.html              cabeçalho, estilos e fontes embutidas
  p2*-catalog*.js      exames, aulas, diagramas e baralhos
  p3*-fichas*.js       fichas de estudo
  p4*-questions*.js    banco de questões
  p6-decks.js          baralhos de classificação
  p7-catalogo.js       catálogo de certificações e trilhas
  p8-motion.js         camada de movimento
  p5-engine.js         motor e interface (carrega por último)
scripts/build.mjs      junta tudo em dist/index.html
tests/                 lógica, conteúdo e fluxos (Node + jsdom)
tests/browser/         layout, acessibilidade, movimento e CSP (Chrome real)
```

A ordem das partes importa e está fixada em `scripts/build.mjs`.

## Testes

```bash
npm test               # conteúdo, lógica e fluxos de tela (só Node)
npm run test:browser   # precisa de Chrome; use CHROME_PATH se não estiver em /usr/bin/google-chrome
npm run verify         # build + tudo
```

`npm test` valida, entre outras coisas: que toda questão tem explicação para cada alternativa errada, que todo domínio tem acervo suficiente para o chefe e o simulado, que nenhuma trilha tem ciclo de pré-requisito ou desce de nível, e que nenhuma certificação fica fora de alguma trilha.

`npm run test:browser` verifica layout em quatro larguras, contraste AA nos dois temas, que o movimento anima só o que mudou e respeita o modo reduzido, e que a página funciona sob a política de segurança de produção.

## Deploy

Na Vercel, o build roda `npm run vercel-build`, que faz o build **e** roda `npm test`. Se algum teste falhar, o deploy não acontece. A saída publicada é `dist/`, com os cabeçalhos de segurança definidos em `vercel.json`.

## Sobre o conteúdo

Todo o material é original, escrito a partir dos objetivos públicos dos guias de exame. Nada aqui reproduz ou imita questão real de prova.

O catálogo é mantido à mão e foi revisado em novembro de 2026. Microsoft e AWS trocam versões e aposentam exames com frequência. Antes de marcar prova, confirme código, versão, peso dos domínios e nota de corte em [learn.microsoft.com/credentials](https://learn.microsoft.com/credentials/) e [aws.amazon.com/certification](https://aws.amazon.com/certification/).

Projeto independente, sem vínculo com a Microsoft ou com a Amazon Web Services.

## Limitações

O progresso fica guardado no navegador de cada pessoa. Para levar de um aparelho para outro, use Perfil → exportar e importar. Não existe ranking entre usuários: isso exigiria um servidor.
