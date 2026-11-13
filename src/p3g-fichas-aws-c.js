/* ============================================================
   FICHAS DE APROFUNDAMENTO — AWS (CLF-C02 e SAA-C03), lote 4
   extra:true: contam no progresso, mas não trancam a prática.
   Conteúdo original, revisado contra a documentação oficial (nov/2026).
   ============================================================ */
/* Lote f-clf-a: fichas extras do CLF-C02 (AWS Certified Cloud Practitioner)
   Domínios: d1 (migracao-caf), d2 (conformidade-governanca), d4 (custo-ferramentas) */
const FICHAS_CLF_A = [
{
  id:"f-aw-migracao", exam:"clf", dom:"d1", mins:7, concept:"migracao-caf", extra:true,
  title:"Adoção da nuvem: CAF, economia e ferramentas de migração",
  lead:"O domínio 1 cobra três coisas sobre migração: as seis perspectivas do Cloud Adoption Framework, por que a conta da nuvem fecha (TCO, capex e opex) e qual ferramenta move cada tipo de coisa.",
  blocks:[
    {t:"h", x:"As seis perspectivas do AWS CAF"},
    {t:"table", head:["Perspectiva","Grupo","Cuida de","Quem costuma liderar"], rows:[
      ["Negócio","Negócio","Garantir que o investimento em nuvem gere resultado de negócio","CEO, CFO, COO"],
      ["Pessoas","Negócio","Cultura, estrutura organizacional, liderança e capacitação da equipe","RH, CIO, líderes de área"],
      ["Governança","Negócio","Orquestrar as iniciativas, medir o benefício e reduzir o risco da transformação","CIO, CFO, gerentes de programa e portfólio"],
      ["Plataforma","Técnica","Construir a plataforma de nuvem, definir arquitetura e modernizar cargas","CTO, arquitetos de solução"],
      ["Segurança","Técnica","Confidencialidade, integridade e disponibilidade de dados e cargas","CISO, auditoria interna, arquitetos de segurança"],
      ["Operações","Técnica","Entregar e manter os serviços no nível que o negócio precisa","Operações de TI, SRE, gestão de serviços"]
    ]},
    {t:"p", x:"A prova costuma descrever uma preocupação e perguntar qual perspectiva cuida dela. A jornada do CAF tem quatro fases: Envision (visualizar oportunidades), Align (alinhar lacunas e dependências), Launch (lançar pilotos em produção) e Scale (escalar). Os benefícios que a AWS associa ao CAF são reduzir risco de negócio, melhorar o desempenho ESG, aumentar a receita e aumentar a eficiência operacional."},
    {t:"h", x:"Economia da nuvem"},
    {t:"table", head:["Conceito","O que significa","Exemplo"], rows:[
      ["Capex","Investimento antecipado em ativo próprio","Comprar servidores dimensionados para o pico dos próximos cinco anos"],
      ["Opex","Despesa variável, paga conforme o uso","Fatura mensal de horas de EC2 e GB no S3"],
      ["TCO","Custo total de possuir e operar, somando o direto e o indireto","Hardware, energia, refrigeração, espaço, licenças, equipe e renovação"],
      ["Custo indireto","O que não aparece na nota fiscal do servidor","Horas da equipe trocando disco, aplicando patch e cuidando do datacenter"],
      ["Licenciamento","Trazer licença própria ou pagar licença incluída","BYOL em Hosts Dedicados ou instância com Windows incluso"],
      ["Economia de escala","A AWS compra em volume enorme e cobra menos por unidade","Preço por GB menor do que o de um datacenter pequeno"]
    ]},
    {t:"p", x:"Comparar só o preço do servidor com o preço da instância é a conta errada. Um TCO honesto inclui o custo indireto e o desperdício de capacidade ociosa. O Migration Evaluator monta esse caso de negócio sem custo: analisa o ambiente atual e estima quanto ele custaria na AWS, incluindo opções de licença."},
    {t:"h", x:"Qual ferramenta move o quê"},
    {t:"table", head:["Ferramenta","Move","Como","Quando escolher"], rows:[
      ["Application Migration Service","Servidores inteiros (Windows e Linux), físicos, virtuais ou de outra nuvem","Agente replica os discos em bloco de forma contínua; o corte tem parada mínima","Rehost (levar como está) de muitos servidores com pouca parada"],
      ["Database Migration Service (DMS)","Dados de banco","Carga inicial e replicação contínua das mudanças, com a origem em uso","Banco com parada mínima, mesmo motor ou motor diferente"],
      ["DMS Schema Conversion ou AWS SCT","Esquema e código do banco","Converte tabelas, views, procedures e gatilhos para o motor de destino","Troca de motor, como Oracle para Aurora PostgreSQL"],
      ["DataSync","Arquivos e objetos (NFS, SMB, HDFS, outra nuvem)","Online, pela internet ou Direct Connect, com verificação de integridade","Há rede suficiente; cópia única ou recorrente"],
      ["Família Snow (fechada a novos pedidos)","Dados em massa, offline","Dispositivo físico enviado ao cliente e devolvido à AWS","Na prova: rede lenta ou inexistente para o volume. Hoje: Data Transfer Terminal ou parceiros"],
      ["Migration Hub (fechado a novos clientes)","Nada; ele acompanha","Painel único do andamento de várias ferramentas","Na prova: visão central do progresso. Hoje: AWS Transform"]
    ]},
    {t:"p", x:"Prova e mundo real estão diferentes aqui. Desde 7 de novembro de 2025, o Migration Hub não aceita novos clientes (o sucessor é o AWS Transform) e a AWS não oferece mais dispositivos Snow para novos pedidos (as alternativas são o DataSync, online, e o AWS Data Transfer Terminal ou parceiros, offline). Quem já usa continua usando. O Application Discovery Service, que inventaria servidores locais, também fechou para novos clientes em outubro de 2025. Os três continuam na lista de serviços do CLF-C02: se a questão pedir, responda com o papel clássico de cada um."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Preocupação com treinar a equipe e mudar a cultura","CAF, perspectiva Pessoas"],
      ["Medir benefício e controlar o risco do programa de nuvem","CAF, perspectiva Governança"],
      ["Garantir que a nuvem gere resultado para o negócio, visão do CFO e do CEO","CAF, perspectiva Negócio"],
      ["Energia, refrigeração e equipe do datacenter na comparação","TCO com custos indiretos"],
      ["Parar de comprar hardware antecipado e pagar pelo uso","Trocar capex por opex"],
      ["Servidores inteiros para EC2 com parada mínima no corte","Application Migration Service"],
      ["Banco precisa continuar em uso durante a migração","DMS com replicação contínua"],
      ["Oracle para PostgreSQL, procedures precisam ser traduzidas","DMS Schema Conversion ou SCT, depois DMS"],
      ["Milhões de arquivos de um NAS, link de rede bom","DataSync"],
      ["Centenas de TB, rede lenta, envio físico dos dados","Na prova: família Snow (hoje fechada a novos pedidos)"]
    ]},
    {t:"trap", x:"Trocar de motor de banco exige duas peças: a conversão de esquema traduz a estrutura e o código, e o DMS move os dados. Responder só DMS numa migração heterogênea deixa procedures sem tradução. E o Migration Hub não move nada: ele só acompanha o que as outras ferramentas fazem."},
    {t:"case", q:"O contrato do datacenter vence em seis semanas. Há 60 servidores de aplicação Linux e Windows, um banco Oracle que deve virar Aurora PostgreSQL sem parar as vendas e 40 TB de arquivos num NAS com link de 10 Gbps. Quais ferramentas usar?",
      a:"Application Migration Service para os 60 servidores, porque replica os discos continuamente e o corte leva minutos. DMS Schema Conversion (ou SCT) para traduzir o esquema e as procedures do Oracle, e DMS com replicação contínua para mover os dados com o banco em uso. DataSync para os 40 TB, que cabem no link de 10 Gbps em menos de um dia de transferência; um dispositivo offline não faz sentido quando a rede dá conta."}
  ],
  check:["Citar as seis perspectivas do CAF e separar as de negócio das técnicas","Listar três custos indiretos que entram no TCO","Dizer quando usar DMS sozinho e quando somar a conversão de esquema"],
  src:[{t:"AWS Cloud Adoption Framework", u:"https://aws.amazon.com/cloud-adoption-framework/"},
       {t:"AWS DMS: o que é", u:"https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html"}]
},
{
  id:"f-aw-conformidade", exam:"clf", dom:"d2", mins:6, concept:"conformidade-governanca", extra:true,
  title:"Conformidade e governança: relatório, evidência e controle",
  lead:"A AWS tem certificações para a parte dela. A prova quer saber onde baixar esse relatório, como provar a sua parte e quais serviços impedem, detectam ou registram desvio em várias contas.",
  blocks:[
    {t:"h", x:"Quem responde qual pergunta"},
    {t:"table", head:["Serviço","Responde","Natureza"], rows:[
      ["AWS Artifact","Onde baixo o relatório SOC, ISO ou PCI da AWS e aceito acordos como o BAA","Documentação, sob demanda"],
      ["AWS Audit Manager (fechado a novos clientes)","Como reúno evidência contínua, mapeada a um framework, para a minha auditoria","Coleta de evidência; hoje a AWS indica pacotes de conformidade do Config"],
      ["AWS Config","Como cada recurso está configurado, como mudou e se segue a regra","Detectivo"],
      ["AWS CloudTrail","Quem fez qual chamada de API, quando e de onde","Registro de atividade"],
      ["Organizations com SCP","Qual é o teto de permissão de cada conta-membro","Preventivo"],
      ["AWS Control Tower","Como crio e governo várias contas com boas práticas prontas","Orquestração da landing zone"],
      ["IAM Identity Center","Como as pessoas entram em várias contas e aplicações com um único login","Acesso da força de trabalho"]
    ]},
    {t:"p", x:"O Audit Manager coleta evidência do Config, do CloudTrail e do Security Hub CSPM e monta relatórios por framework, como PCI DSS, HIPAA e SOC 2. Ele não declara a conformidade: só organiza a evidência. Desde 30 de abril de 2026 ele não aceita novos clientes (quem já usa continua); a AWS indica os pacotes de conformidade do Config como alternativa. Ele ainda está na lista do CLF-C02: na prova, \"evidência contínua para auditoria\" continua sendo Audit Manager."},
    {t:"h", x:"O que a certificação da AWS cobre"},
    {t:"table", head:["Fica com a AWS","Fica com o cliente"], rows:[
      ["Datacenter, hardware e rede global auditados","Classificar os dados e decidir quem acessa"],
      ["Controles descritos nos relatórios SOC, ISO e PCI","Controles da própria carga: IAM, criptografia, configuração"],
      ["Hipervisor e software dos serviços gerenciados","Sistema operacional, patches e aplicação no EC2"],
      ["Oferecer acordos como o BAA no Artifact","Aceitar o acordo e configurar a carga conforme a norma"]
    ]},
    {t:"p", x:"Um serviço estar no escopo de um programa de conformidade significa que a parte da AWS foi auditada. A carga do cliente só fica conforme se ele implementar a parte dele, e o próprio relatório indica quais controles adicionais cabem ao cliente."},
    {t:"h", x:"Governança em várias contas"},
    {t:"ul", x:[
      "SCP não concede permissão: só define o máximo que usuários e funções do IAM de uma conta-membro podem fazer, inclusive o usuário raiz dela. A permissão em si continua vindo das políticas do IAM.",
      "SCP não afeta usuários nem funções da conta de gerenciamento. Por isso, a boa prática é não rodar cargas de trabalho nela.",
      "Control Tower monta a landing zone sobre Organizations, IAM Identity Center e Service Catalog, em menos de uma hora.",
      "Os controles do Control Tower são preventivos (impedem a ação, em geral com SCP), detectivos (apontam o desvio, com regras do Config) ou proativos (checam o recurso antes de o CloudFormation criá-lo).",
      "O Account Factory do Control Tower cria contas novas já com a configuração e os controles aprovados.",
      "IAM Identity Center dá login único: a pessoa entra uma vez num portal de acesso e vê as contas e aplicações liberadas para ela. Os usuários podem ser criados no próprio Identity Center ou vir de um provedor externo ou do Active Directory. O acesso a cada conta é definido por conjuntos de permissões."
    ]},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Auditor pede o relatório SOC 2 da AWS","AWS Artifact"],
      ["Aceitar o BAA para dados de saúde","AWS Artifact, seção de acordos"],
      ["Juntar evidência contínua mapeada a um framework","Na prova: AWS Audit Manager (hoje fechado a novos clientes)"],
      ["Histórico de configuração e regra de conformidade de recursos","AWS Config"],
      ["Quem excluiu o recurso e de qual IP","AWS CloudTrail"],
      ["Proibir um serviço nas contas-membro, até para o administrador e o usuário raiz delas","SCP no Organizations"],
      ["Contas novas já nascerem com controles e padrões","Control Tower com Account Factory"],
      ["Funcionários com um só login para 20 contas","IAM Identity Center"]
    ]},
    {t:"trap", x:"Baixar o relatório PCI da AWS no Artifact não deixa a sua aplicação em conformidade com PCI: ele prova os controles da AWS, não os seus. Outra confusão clássica: o Config aponta o recurso fora da regra, mas não impede a criação; quem impede é a SCP ou um controle preventivo."},
    {t:"case", q:"Uma fintech vai abrir 15 contas no próximo trimestre. Toda conta nova precisa nascer com registro de atividade e controles padrão, os funcionários devem entrar com um único login corporativo e o auditor externo quer o relatório PCI da AWS. O que usar?",
      a:"Control Tower, que monta a landing zone e usa o Account Factory para criar cada conta já com os controles e o registro de atividade. Ele integra o IAM Identity Center, que dá o login único com permissões por conta. O relatório PCI da AWS sai do Artifact. Criar contas à mão no Organizations funcionaria, mas sem o padrão automático exigido."}
  ],
  check:["Dizer o que o Artifact entrega e por que isso não torna a carga conforme","Separar controle preventivo, detectivo e proativo","Explicar o que a SCP faz e o que ela não faz"],
  src:[{t:"AWS Artifact: perguntas frequentes", u:"https://aws.amazon.com/artifact/faq/"},
       {t:"O que é o AWS Control Tower", u:"https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html"}]
},
{
  id:"f-aw-custo-ferr", exam:"clf", dom:"d4", mins:6, concept:"custo-ferramentas", extra:true,
  title:"Ferramentas de custo: qual pergunta cada uma responde",
  lead:"Toda questão de ferramenta de custo é uma pergunta disfarçada: quanto vai custar, quanto já custou, me avise, me dê o detalhe, de quem é o gasto, o que está grande demais. Cada pergunta tem dona.",
  blocks:[
    {t:"h", x:"Pergunta → ferramenta"},
    {t:"table", head:["Pergunta","Ferramenta","Detalhe que a prova cobra"], rows:[
      ["Quanto vai custar o que ainda não existe?","AWS Pricing Calculator","Estimativa antes de criar qualquer recurso"],
      ["Quanto já gastei e para onde vai a tendência?","Cost Explorer","Gráficos por serviço, conta e tag; até 13 meses de histórico, o mês atual e previsão para os próximos 18 meses"],
      ["Me avise ou aja quando passar do limite","AWS Budgets","Alerta por valor real ou previsto; ações aplicam política do IAM, SCP ou param EC2 e RDS"],
      ["Quero todos os dados, linha a linha, no meu sistema","Data Exports (CUR 2.0)","Exportação recorrente e detalhada para um bucket do S3"],
      ["De qual projeto ou equipe é esse gasto?","Tags de alocação de custo","Precisam ser ativadas no console de faturamento"],
      ["Esta instância está grande demais?","Compute Optimizer","Recomenda tamanho para EC2, grupos de Auto Scaling, EBS, Lambda, ECS no Fargate e RDS"],
      ["O que posso melhorar na conta em geral?","Trusted Advisor","Verificações de custo, segurança, desempenho, tolerância a falhas, cotas de serviço e excelência operacional"],
      ["Uma fatura só para várias contas","Faturamento consolidado","Recurso do Organizations, sem custo adicional"]
    ]},
    {t:"h", x:"Faturamento consolidado"},
    {t:"p", x:"No AWS Organizations, a conta de gerenciamento paga a fatura de todas as contas-membro. O uso é somado para atingir faixas de desconto por volume, e os descontos de Reserved Instances e Savings Plans são compartilhados entre as contas. Não há cobrança extra por consolidar."},
    {t:"h", x:"Tags de alocação de custo"},
    {t:"ul", x:[
      "Há dois tipos: geradas pela AWS (prefixo aws:, como createdBy) e definidas pelo usuário (como CentroCusto).",
      "Cada tag precisa ser ativada no console de faturamento antes de aparecer no Cost Explorer e nos relatórios de custo.",
      "Numa organização, só a conta de gerenciamento ativa as tags.",
      "Uma tag recém-criada pode levar até 24 horas para aparecer no console de faturamento e mais até 24 horas para valer depois de ativada."
    ]},
    {t:"h", x:"Data Exports e o antigo CUR"},
    {t:"p", x:"O Cost and Usage Report agora vive dentro do AWS Data Exports. A AWS recomenda o CUR 2.0 como forma padrão de receber o dado mais detalhado de custo e uso. Você escolhe as colunas, filtra linhas e recebe o arquivo no S3, pronto para o Athena, o Amazon Quick (antigo QuickSight) ou um sistema interno de rateio."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Orçar uma arquitetura antes de criar","Pricing Calculator"],
      ["Qual serviço mais cresceu nos últimos três meses","Cost Explorer"],
      ["Bloquear novos recursos automaticamente ao atingir 90% do orçamento","Budgets com ação"],
      ["Dados de faturamento em arquivo para carregar no data warehouse","Data Exports (CUR 2.0)"],
      ["Ver custo por projeto, mas a tag não aparece no relatório","Ativar a tag de alocação de custo"],
      ["Instâncias com CPU baixa o mês inteiro, qual tamanho usar","Compute Optimizer"],
      ["Desconto de volume somando o uso de várias contas","Faturamento consolidado do Organizations"],
      ["Checagem ampla de custo, segurança e cotas de serviço","Trusted Advisor"]
    ]},
    {t:"trap", x:"Budgets não é teto rígido de gasto: por padrão ele avisa, e só bloqueia se você configurar uma ação, como aplicar uma política de negação ou parar instâncias. E aplicar uma tag no recurso não basta para ratear custo: sem ativá-la como tag de alocação de custo, ela não aparece no Cost Explorer."},
    {t:"case", q:"A diretoria quer o gasto mensal por centro de custo. Os recursos já têm a tag CentroCusto há semanas, mas o Cost Explorer não oferece essa tag para agrupar. A empresa usa várias contas no Organizations. O que fazer?",
      a:"Na conta de gerenciamento, ativar CentroCusto como tag de alocação de custo definida pelo usuário no console de faturamento. Só a conta de gerenciamento pode fazer isso numa organização, e a tag pode levar até 24 horas para valer. Compute Optimizer e Trusted Advisor recomendam otimização, mas não fazem rateio; o Budgets controla limite, não atribui gasto."}
  ],
  check:["Dizer qual ferramenta responde \"quanto vai custar\" e qual responde \"quanto já custou\"","Explicar por que uma tag aplicada pode não aparecer no Cost Explorer","Citar três vantagens do faturamento consolidado"],
  src:[{t:"Tags de alocação de custo", u:"https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html"},
       {t:"Faturamento consolidado", u:"https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html"}]
}
];
/* Lote f-clf-b: fichas extras do CLF-C02, domínio d3 (ia-ml-aws, implantacao-operacao) */
const FICHAS_CLF_B = [
{
  id:"f-aw-ia", exam:"clf", dom:"d3", mins:7, concept:"ia-ml-aws", extra:true,
  title:"IA e aprendizado de máquina: serviço pronto, Bedrock ou SageMaker AI",
  lead:"A prova não pede que você saiba treinar modelo. Pede que você leia o cenário e diga em qual camada ele está: usar uma IA pronta, gerar conteúdo com modelo de base ou construir o próprio modelo.",
  blocks:[
    {t:"h", x:"As três camadas"},
    {t:"table", head:["Camada","O que entrega","Quanto de ML você precisa saber","Exemplo"], rows:[
      ["Serviços de IA prontos","Uma tarefa específica por chamada de API, com modelo já treinado pela AWS","Nenhum: você manda o dado e recebe o resultado","Rekognition detecta rostos numa foto"],
      ["Amazon Bedrock","Acesso gerenciado, por API, a modelos de base da Amazon e de outras empresas, para IA generativa","Pouco: escolher modelo, escrever prompt, ligar aos seus dados","Assistente que responde com base nos manuais da empresa"],
      ["Amazon SageMaker AI","Plataforma para construir, treinar e implantar o seu próprio modelo","Muito: dados de treino, algoritmo, avaliação e endpoint","Modelo de risco de crédito treinado com o histórico do banco"]
    ]},
    {t:"p", x:"Quanto mais alto na pilha, menos trabalho e menos controle. Quando o enunciado diz \"sem experiência em aprendizado de máquina\", a resposta está nos serviços prontos ou no Bedrock. Quando diz \"modelo próprio com dados exclusivos\", é SageMaker AI. Desde dezembro de 2024 o nome oficial é Amazon SageMaker AI; materiais antigos ainda escrevem só SageMaker."},
    {t:"h", x:"Serviços prontos: o que entra e o que sai"},
    {t:"table", head:["Serviço","Entrada e saída","Cenário típico"], rows:[
      ["Amazon Rekognition","Imagem ou vídeo para rótulos, rostos, texto e conteúdo impróprio","Moderar fotos enviadas por usuários"],
      ["Amazon Textract","Documento digitalizado para texto, campos de formulário e tabelas","Ler notas fiscais e formulários sem digitação"],
      ["Amazon Comprehend","Texto para sentimento, entidades, frases-chave e dado pessoal","Classificar avaliações de clientes como positivas ou negativas"],
      ["Amazon Transcribe","Áudio de fala para texto","Gerar legenda ou transcrever ligações do atendimento"],
      ["Amazon Polly","Texto para fala com voz natural","Ler notícias em voz alta num aplicativo"],
      ["Amazon Translate","Texto em um idioma para outro idioma","Traduzir chamados de suporte em tempo real"],
      ["Amazon Lex","Conversa por voz ou texto para intenção e resposta","Chatbot que agenda consultas"],
      ["Amazon Personalize","Histórico de interações para recomendações por usuário","\"Quem comprou isto também levou\" numa loja virtual (fora da lista oficial do CLF-C02)"]
    ]},
    {t:"h", x:"Amazon Q e o que mudou em 2026"},
    {t:"ul", x:[
      "Amazon Q Developer: assistente de IA para quem constrói e opera na AWS. Continua disponível no Console de Gerenciamento da AWS e em apps de chat como Slack e Microsoft Teams.",
      "Os plugins do Amazon Q Developer para IDE (editores de código) não aceitam novas assinaturas desde 15 de maio de 2026 e perdem o suporte em 30 de abril de 2027; a AWS indica o Kiro como substituto.",
      "Amazon Q Business: assistente para funcionários consultarem dados da empresa respeitando permissões. Não aceita mais clientes novos (quem já usa continua); a AWS recomenda o Amazon Quick.",
      "Amazon Kendra (busca inteligente em documentos corporativos) não aceita clientes novos desde 30 de julho de 2026; a alternativa indicada são as bases de conhecimento do Bedrock. Ele ainda está na lista do CLF-C02, então saiba o que ele faz.",
      "Amazon Forecast (previsão de séries temporais) também fechou para clientes novos; a AWS indica o SageMaker Canvas."
    ]},
    {t:"h", x:"Responsabilidade compartilhada aplicada a IA"},
    {t:"table", head:["Item","AWS","Cliente"], rows:[
      ["Infraestrutura e hospedagem do modelo","Protege hardware, rede e o serviço gerenciado","Escolhe região e serviço"],
      ["Dados enviados e de treino","Não usa entradas e saídas do Bedrock para treinar modelos de base","Decide quais dados envia, classifica e criptografa"],
      ["Acesso","Oferece IAM e criptografia com KMS","Concede o mínimo de permissão a quem chama o modelo"],
      ["Conteúdo gerado","Oferece Amazon Bedrock Guardrails para filtrar conteúdo e ocultar dado pessoal","Configura os filtros e revisa se a resposta é correta e adequada"]
    ]},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Detectar rostos ou conteúdo impróprio em imagens","Amazon Rekognition"],
      ["Extrair campos e tabelas de formulários digitalizados","Amazon Textract"],
      ["Saber se o comentário do cliente é positivo ou negativo","Amazon Comprehend"],
      ["Transformar gravação de reunião em texto","Amazon Transcribe"],
      ["Aplicativo que lê o texto em voz alta","Amazon Polly"],
      ["Chatbot de voz ou texto que entende a intenção","Amazon Lex"],
      ["Gerar texto ou resumo com modelo de base, sem gerenciar infraestrutura","Amazon Bedrock"],
      ["Treinar modelo próprio com dados exclusivos da empresa","Amazon SageMaker AI"],
      ["Ajuda de IA para entender e operar recursos da AWS no console","Amazon Q Developer"]
    ]},
    {t:"trap", x:"Textract não é só OCR: ele entende formulário e tabela, enquanto o Rekognition apenas encontra texto solto numa imagem. E Comprehend não ouve áudio: se o dado é uma gravação, primeiro vem o Transcribe, depois o Comprehend analisa o texto resultante."},
    {t:"case", q:"Uma operadora quer analisar as ligações gravadas do atendimento para descobrir quais clientes saíram insatisfeitos. A equipe não tem cientista de dados e não quer treinar modelo.",
      a:"Amazon Transcribe converte o áudio em texto e o Amazon Comprehend aplica análise de sentimento sobre esse texto. Os dois são serviços prontos, sem treino. SageMaker AI exigiria construir o modelo, o que a equipe descartou; Polly faz o caminho inverso, de texto para fala."}
  ],
  check:["Dizer em qual das três camadas está um cenário de chatbot com documentos da empresa","Associar Rekognition, Textract, Comprehend, Transcribe, Polly, Translate, Lex e Personalize a uma entrada e uma saída","Citar duas responsabilidades do cliente ao usar o Amazon Bedrock"],
  src:[{t:"AWS: O que é o Amazon SageMaker AI", u:"https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html"},
       {t:"AWS: Proteção de dados no Amazon Bedrock", u:"https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html"}]
},
{
  id:"f-aw-ops", exam:"clf", dom:"d3", mins:6, concept:"implantacao-operacao", extra:true,
  title:"Implantar e operar: infraestrutura como código, Systems Manager e monitoramento",
  lead:"Três perguntas caem juntas: como criar recursos de forma repetível, como administrar servidores sem abrir portas e qual serviço olhar quando algo dá errado. Cada uma tem um serviço certo e dois parecidos.",
  blocks:[
    {t:"h", x:"Criar e implantar"},
    {t:"table", head:["Ferramenta","Você entrega","Ela faz","Escolha quando"], rows:[
      ["AWS CloudFormation","Modelo em JSON ou YAML","Cria, atualiza e apaga os recursos como uma pilha","Mesmo ambiente repetido em várias contas ou regiões"],
      ["AWS CDK","Código em TypeScript, JavaScript, Python, Java, C# ou Go","Gera um modelo do CloudFormation e o implanta","Equipe prefere linguagem de programação a YAML"],
      ["AWS Elastic Beanstalk","O código da aplicação web","Provisiona capacidade, balanceador, dimensionamento e monitoramento de saúde","Publicar rápido sem montar a infraestrutura à mão"],
      ["CodePipeline, CodeBuild e CodeDeploy","Repositório de código e as etapas","Orquestra o fluxo, compila e testa, e implanta","Integração e entrega contínuas automatizadas"]
    ]},
    {t:"p", x:"No pipeline, cada serviço tem um papel: o CodePipeline encadeia as etapas de origem, compilação, teste e implantação; o CodeBuild compila e roda os testes; o CodeDeploy leva a nova versão para EC2, servidores locais, Lambda ou ECS. O Elastic Beanstalk não cobra taxa própria, só os recursos que ele cria."},
    {t:"h", x:"Systems Manager: administrar a frota"},
    {t:"ul", x:[
      "Session Manager: abre terminal na instância pelo navegador ou pela CLI, sem porta de entrada aberta, sem bastião e sem chave SSH. Quem pode abrir sessão é definido pelo IAM, e a sessão pode ser registrada no S3 ou no CloudWatch Logs.",
      "Patch Manager: automatiza patches do sistema operacional e de aplicativos (no Windows, só os da Microsoft) em instâncias EC2 e servidores locais. Uma linha de base de patches define o que é aprovado; a execução pode ser agendada numa janela de manutenção ou feita na hora.",
      "Parameter Store: guarda configurações, como IDs de AMI e strings de conexão, organizadas em hierarquia (/prod/app/...). O tipo SecureString criptografa o valor com o KMS, e o nível padrão não tem custo adicional.",
      "Run Command: executa o mesmo comando ou script em dezenas ou centenas de instâncias de uma vez, sem SSH.",
      "Para tudo isso, a máquina precisa ser um nó gerenciado: ter o SSM Agent instalado e permissão do IAM para falar com o Systems Manager."
    ]},
    {t:"h", x:"Observar, auditar e saber da AWS"},
    {t:"table", head:["Serviço","Pergunta que responde","Exemplo"], rows:[
      ["Amazon CloudWatch","Como o recurso está se comportando agora?","Métrica de CPU, log da aplicação e alarme que dispara acima de um limite"],
      ["AWS CloudTrail","Quem fez qual chamada de API, quando e de onde?","Descobrir quem apagou um grupo de segurança"],
      ["AWS X-Ray","Onde a requisição está perdendo tempo entre os componentes?","Mapa de rastreamento mostra que a lentidão está no banco"],
      ["AWS Health Dashboard","A AWS tem algum evento que afeta minha conta?","Manutenção programada em uma instância ou incidente regional"]
    ]},
    {t:"h", x:"Formas de acessar a AWS"},
    {t:"table", head:["Forma","Para quem","Detalhe que cai"], rows:[
      ["Console de Gerenciamento","Quem prefere interface visual","Bom para explorar e para tarefas pontuais"],
      ["AWS CLI","Quem automatiza com scripts no terminal","Exige configurar credenciais na máquina local"],
      ["SDKs","Desenvolvedores, dentro do código da aplicação","Bibliotecas para várias linguagens chamarem as APIs"],
      ["AWS CloudShell","Quem quer a CLI sem instalar nada","Abre no navegador já autenticado, com até 1 GB persistente por região, sem custo adicional"]
    ]},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Mesmo ambiente criado igual em várias regiões a partir de um modelo","AWS CloudFormation"],
      ["Definir infraestrutura usando Python ou TypeScript","AWS CDK"],
      ["Subir aplicação web sem configurar balanceador e dimensionamento","AWS Elastic Beanstalk"],
      ["Acessar instância privada sem porta 22 aberta e sem bastião","Systems Manager Session Manager"],
      ["Aplicar correções do sistema operacional em toda a frota","Systems Manager Patch Manager"],
      ["Alarme quando a CPU passar de 80%","Amazon CloudWatch"],
      ["Quem excluiu o recurso e quando","AWS CloudTrail"],
      ["Achar o componente lento numa aplicação de microsserviços","AWS X-Ray"],
      ["Saber se uma manutenção da AWS vai afetar suas instâncias","AWS Health Dashboard"],
      ["Rodar comandos da CLI no navegador sem instalar ou configurar credenciais","AWS CloudShell"]
    ]},
    {t:"trap", x:"CloudWatch e CloudTrail têm nomes parecidos e funções diferentes: CloudWatch mede desempenho e dispara alarme, CloudTrail registra ações de API para auditoria. O Health Dashboard mostra eventos do lado da AWS, não a métrica da sua aplicação. E senha de banco que precisa de rotação automática vai para o Secrets Manager, não para o Parameter Store, que não faz rotação."},
    {t:"case", q:"Uma equipe precisa recriar o mesmo ambiente de homologação em três regiões, sem passos manuais, e quer que cada mudança no ambiente fique versionada junto com o código. Ninguém na equipe programa, mas todos leem YAML.",
      a:"AWS CloudFormation. O modelo em YAML descreve os recursos, pode ser versionado e implantado igual em cada região. O CDK também geraria CloudFormation, mas pede linguagem de programação, que a equipe não usa. Elastic Beanstalk publica uma aplicação web, não descreve um ambiente inteiro."}
  ],
  check:["Explicar a relação entre CDK e CloudFormation","Diferenciar CloudWatch, CloudTrail, X-Ray e Health Dashboard com um exemplo cada","Dizer o que o Session Manager dispensa em relação ao SSH tradicional"],
  src:[{t:"AWS: Systems Manager Session Manager", u:"https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html"},
       {t:"AWS: O que é o AWS CloudShell", u:"https://docs.aws.amazon.com/cloudshell/latest/userguide/welcome.html"}]
}
];
/* ============================================================
   LOTE f-saa-a — FICHAS EXTRAS (SAA-C03)
   d1: detecção, auditoria e conformidade
   d2: recuperação de desastres
   Escrito a partir dos objetivos públicos do exam guide.
   ============================================================ */
const FICHAS_SAA_C = [
{
  id:"f-saa-deteccao", exam:"saa", dom:"d1", mins:7, concept:"deteccao-auditoria", extra:true,
  title:"Detecção e auditoria: quem responde qual pergunta",
  lead:"Sete serviços de segurança com nomes parecidos, e cada um responde a uma pergunta diferente. A prova descreve a pergunta no enunciado; quem sabe a tabela de perguntas acerta sem hesitar.",
  blocks:[
    {t:"h", x:"A tabela que resolve a questão"},
    {t:"table", head:["Pergunta do enunciado","Serviço","O que ele olha"], rows:[
      ["Quem fez, quando e de onde?","CloudTrail","Chamadas de API na conta: identidade, horário, origem, parâmetros"],
      ["Como está configurado e o que mudou?","AWS Config","Estado e histórico de configuração de cada recurso, avaliado por regras"],
      ["Estou sendo atacado agora?","GuardDuty","CloudTrail, VPC Flow Logs e DNS, com inteligência de ameaças e aprendizado de máquina"],
      ["Tenho vulnerabilidade de software?","Inspector","Pacotes de EC2, imagens no ECR e funções Lambda contra CVEs, mais exposição de rede"],
      ["Tenho dado sensível exposto?","Macie","Conteúdo dos objetos no S3, buscando dados pessoais e credenciais"],
      ["Onde vejo tudo junto?","Security Hub e Security Hub CSPM","Security Hub correlaciona e prioriza achados de GuardDuty, Inspector e CSPM; o CSPM verifica padrões como CIS e FSBP"],
      ["Como investigo o que aconteceu?","Detective","Grafo de comportamento montado com CloudTrail, Flow Logs e achados do GuardDuty"]
    ]},
    {t:"h", x:"CloudTrail: os três tipos de evento"},
    {t:"table", head:["Tipo","Exemplo","Gravado por padrão na trilha"], rows:[
      ["Gerenciamento","Criar instância, anexar política, apagar bucket","Sim"],
      ["Dados","GetObject e PutObject no S3, Invoke na Lambda","Não: precisa ligar por tipo de recurso, com cobrança extra"],
      ["Insights","Taxa anormal de chamadas ou de erros","Não: precisa ligar, com cobrança extra"]
    ]},
    {t:"p", x:"O histórico de eventos do console é gratuito, mas guarda só eventos de gerenciamento dos últimos 90 dias, por região. Retenção longa, eventos de dados e entrega em bucket exigem criar uma trilha. (O CloudTrail Lake, outra opção de consulta, não aceita clientes novos desde maio de 2026.)"},
    {t:"p", x:"Trilha organizacional é criada na conta de gerenciamento do Organizations, ou numa conta de administrador delegado, e grava os eventos de todas as contas num único bucket. Conta nova que entra na organização passa a ser registrada automaticamente, e as contas-membro enxergam a trilha mas não conseguem desligar nem alterar."},
    {t:"p", x:"A validação de integridade do log faz o CloudTrail gerar, a cada hora, um arquivo de resumo com o hash SHA-256 de cada arquivo entregue, assinado com chave privada e encadeado ao resumo anterior. Com ele se prova que um log foi alterado, apagado ou está intacto. Para impedir a exclusão, e não só detectá-la, some a isso o bloqueio de objeto no bucket de logs."},
    {t:"h", x:"AWS Config: avaliar e corrigir"},
    {t:"ul", x:[
      "Regra gerenciada ou personalizada diz se o recurso está em conformidade, por exemplo volume EBS sem criptografia.",
      "Pacote de conformidade reúne regras e ações de correção num modelo YAML, implantado como uma unidade numa conta ou na organização inteira.",
      "Correção usa documentos de automação do Systems Manager, de forma manual ou automática, quando a regra aponta não conformidade.",
      "Agregador junta a visão de conformidade de várias contas e regiões numa conta só."
    ]},
    {t:"p", x:"VPC Flow Logs registram metadados do tráfego IP das interfaces de rede, como origem, destino, porta e se foi aceito ou rejeitado, e publicam no CloudWatch Logs, no S3 ou no Amazon Data Firehose, sem afetar a latência. Não mostram o conteúdo do pacote."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Descobrir quem apagou a tabela ontem","CloudTrail"],
      ["Registrar cada leitura de objeto num bucket","Evento de dados do CloudTrail para o S3"],
      ["Provar que o log de auditoria não foi adulterado","Validação de integridade do log do CloudTrail"],
      ["Registrar todas as contas, inclusive as que ainda vão ser criadas","Trilha organizacional"],
      ["Alertar e corrigir sozinho grupo de segurança com porta 22 aberta","Regra do AWS Config com correção automática"],
      ["Instância conversando com IP de mineração de criptomoeda","GuardDuty"],
      ["Imagem de contêiner com biblioteca vulnerável","Inspector"],
      ["Encontrar CPF e cartão de crédito em buckets","Macie"],
      ["Painel único de achados e checagem contra CIS e FSBP","Security Hub, com os padrões do Security Hub CSPM"],
      ["Analisar a causa raiz de um achado do GuardDuty","Detective"]
    ]},
    {t:"trap", x:"GuardDuty não exige que você ligue CloudTrail nem Flow Logs: ele consome um fluxo próprio e independente desses dados assim que é ativado. Alternativa que manda criar trilha e Flow Logs só para o GuardDuty funcionar está errada. Outra pegadinha: GuardDuty detecta, mas não investiga a fundo nem corrige; investigação é Detective, correção é automação disparada pelo EventBridge ou pelo Config."},
    {t:"case", q:"Uma empresa com 40 contas no Organizations precisa registrar todas as chamadas de API, inclusive de contas futuras, guardar os registros por sete anos sem que ninguém consiga apagá-los antes do prazo, e provar ao auditor que nenhum arquivo foi alterado. Qual desenho atende com o menor esforço?",
      a:"Trilha organizacional criada na conta de gerenciamento, entregando num bucket de uma conta de arquivamento de logs, com validação de integridade ligada. A trilha cobre contas novas sozinha e as contas-membro não conseguem desligá-la. O bloqueio de objeto no modo de conformidade, com retenção de sete anos, impede a exclusão até pela conta raiz, e os arquivos de resumo com SHA-256 assinados provam que nada foi modificado. Trilha por conta funcionaria, mas exige manutenção em cada conta e deixa a conta nova descoberta."}
  ],
  check:["Ligar cada uma das sete perguntas ao serviço certo sem olhar a tabela","Dizer quais eventos do CloudTrail não são gravados por padrão e o que custa ligá-los","Explicar a diferença entre detectar alteração no log e impedir sua exclusão"],
  src:[{t:"AWS: conceitos do CloudTrail", u:"https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html"},
       {t:"AWS: fontes de dados do GuardDuty", u:"https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_data-sources.html"}]
},
{
  id:"f-saa-dr", exam:"saa", dom:"d2", mins:8, concept:"recuperacao-desastre", extra:true,
  title:"Recuperação de desastres: RTO, RPO e a estratégia mais barata que atende",
  lead:"Toda questão de recuperação de desastres dá dois números, o tempo que pode ficar fora e o dado que pode perder, e pede a opção mais barata que cumpre os dois. Saber ler esses números é metade da resposta.",
  blocks:[
    {t:"h", x:"Os dois objetivos"},
    {t:"table", head:["Objetivo","Pergunta que responde","O que reduz"], rows:[
      ["RTO, tempo de recuperação","Quanto tempo o sistema pode ficar fora do ar?","Ter infraestrutura já pronta ou rodando na região de recuperação"],
      ["RPO, ponto de recuperação","Quantos minutos de dado posso perder?","Copiar o dado com mais frequência, ou replicar de forma contínua"]
    ]},
    {t:"p", x:"Os dois são independentes. Um sistema pode aceitar ficar fora quatro horas mas não perder mais que alguns segundos de transação: aí o dado precisa de replicação contínua, enquanto os servidores podem ficar desligados. Leia cada número separado antes de escolher."},
    {t:"h", x:"As quatro estratégias lado a lado"},
    {t:"table", head:["Estratégia","O que existe na região de recuperação","RTO e RPO típicos (aproximados)","Custo parado"], rows:[
      ["Backup e restauração","Só cópias de dados e modelos de infraestrutura como código","Horas (aprox.)","O menor"],
      ["Luz piloto","Dados replicados e infraestrutura central; servidores de aplicação desligados","Dezenas de minutos (aprox.)","Baixo"],
      ["Espera morna","Cópia completa e funcional, em tamanho reduzido, sempre rodando","Minutos (aprox.)","Médio"],
      ["Multissite ativo-ativo","Carga completa atendendo usuários em mais de uma região","Quase zero (aprox.)","O maior"]
    ]},
    {t:"p", x:"As faixas de RTO e RPO acima são ordens de grandeza usadas pela AWS para comparar as estratégias, não limites garantidos: o valor real depende da carga, da automação e do teste de failover."},
    {t:"p", x:"A diferença entre luz piloto e espera morna é a que mais cai: na luz piloto nada atende requisição até alguém ligar os servidores e escalar; na espera morna o ambiente já responde com capacidade reduzida e só precisa crescer. Se o enunciado diz que a região de recuperação deve atender tráfego imediatamente, mesmo que pouco, é espera morna."},
    {t:"h", x:"Serviços que aparecem em cada estratégia"},
    {t:"table", head:["Serviço","O que entrega","Estratégia típica"], rows:[
      ["AWS Backup","Plano central de cópias, com cópia para outra região e para outra conta da mesma organização","Backup e restauração"],
      ["AWS Elastic Disaster Recovery","Replicação contínua em bloco de servidores locais, de outra nuvem ou EC2; RPO normalmente de segundos e RTO normalmente de minutos","Luz piloto"],
      ["Aurora Global Database","Réplica em outra região com atraso típico abaixo de 1 segundo e promoção em menos de 1 minuto","Luz piloto, espera morna ou ativo-ativo"],
      ["DynamoDB tabelas globais","Réplicas graváveis em várias regiões; o modo de consistência forte entre regiões dá RPO zero","Ativo-ativo"],
      ["Replicação do S3 entre regiões","Cópia assíncrona de objetos novos; com Replication Time Control, 99,9% em até 15 minutos","Todas"],
      ["Route 53 e ARC","Failover de DNS por verificação de integridade; controles de roteamento e plano de troca de região no ARC","Todas que trocam de região"]
    ]},
    {t:"p", x:"O Elastic Disaster Recovery mantém uma área de preparo, com servidores de replicação leves e volumes EBS, recebendo os blocos alterados e só sobe as instâncias de recuperação na hora do desastre. Por isso entrega RPO de segundos pagando pouco enquanto nada acontece: é a resposta quando o enunciado fala em servidores físicos ou virtuais, muitos sistemas diferentes e menor custo."},
    {t:"p", x:"Como ler o enunciado: primeiro elimine o que não cumpre o RTO, depois o que não cumpre o RPO, e entre o que sobrou escolha o mais barato. Pedir minutos de RTO elimina backup e restauração; pedir que a segunda região já atenda usuários elimina luz piloto; pedir tempo de recuperação praticamente nulo leva ao ativo-ativo."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["RTO de 24 horas, menor custo possível","Backup e restauração com AWS Backup copiando para outra região"],
      ["Cópias precisam ficar em outra conta, protegidas de quem administra a produção","AWS Backup com cópia entre contas da organização"],
      ["Servidores locais, RPO de segundos, pagar pouco até o desastre","AWS Elastic Disaster Recovery"],
      ["Banco MySQL ou PostgreSQL, perda de cerca de 1 segundo, retomada em 1 minuto","Aurora Global Database"],
      ["Gravar em qualquer região, sem failover","DynamoDB tabelas globais, ativo-ativo"],
      ["Prazo garantido de replicação de objetos para auditoria","Replicação do S3 com Replication Time Control"],
      ["Região de recuperação já atende parte do tráfego","Espera morna"],
      ["Trocar de região de forma controlada, sem depender do console","Controles de roteamento do ARC"]
    ]},
    {t:"trap", x:"Replicação não é backup. Se alguém apaga ou corrompe o dado na região principal, a réplica recebe o mesmo estrago em segundos. Por isso até o ativo-ativo precisa de cópias pontuais, com versionamento no S3 e AWS Backup, e alternativa que oferece só replicação para proteger contra exclusão ou ransomware está incompleta."},
    {t:"case", q:"Uma empresa tem 60 servidores Windows e Linux num datacenter próprio, com aplicações e bancos variados. Requisitos: perder no máximo alguns segundos de dado, voltar a operar em menos de uma hora na AWS e pagar o mínimo enquanto não houver desastre. Qual solução?",
      a:"AWS Elastic Disaster Recovery. O agente replica de forma contínua, em nível de bloco, cada servidor para uma área de preparo com volumes EBS, o que dá RPO de segundos sem precisar de solução diferente para cada banco. As instâncias de recuperação só são lançadas no desastre, então o custo parado é baixo, e o RTO fica em minutos, limitado ao tempo de inicialização. AWS Backup custaria menos, mas a cópia periódica não entrega perda de segundos; uma espera morna atenderia, mas pagaria um ambiente rodando o tempo todo."}
  ],
  check:["Separar RTO de RPO e dizer o que reduz cada um","Explicar por que a luz piloto não atende requisição sem ação humana e a espera morna atende","Dizer por que replicação sozinha não protege contra exclusão ou corrupção"],
  src:[{t:"AWS: opções de recuperação de desastres na nuvem", u:"https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html"},
       {t:"AWS: conceitos do Elastic Disaster Recovery", u:"https://docs.aws.amazon.com/drs/latest/userguide/CloudEndure-Concepts.html"}]
}
];
/* ============================================================
   FICHAS DE ESTUDO — AWS (SAA-C03) — lote extra
   d3: dados e análise, rede de alto desempenho, contêineres e serverless
   d4: custo de banco de dados e de rede
   ============================================================ */
const FICHAS_SAA_D = [
{
  id:"f-saa-dados", exam:"saa", dom:"d3", mins:8, concept:"dados-analise", extra:true,
  title:"Ingestão e análise: fluxo, lago de dados e armazém",
  lead:"A prova descreve dados chegando e alguém querendo consultar. A resposta sai de três perguntas: quem lê o fluxo, onde o dado fica guardado e quem consulta com SQL.",
  blocks:[
    {t:"h", x:"Ingestão em fluxo"},
    {t:"table", head:["Serviço","O que é","Escolha quando"], rows:[
      ["Kinesis Data Streams","Fluxo com fragmentos, retenção de 24 horas a 365 dias","Vários consumidores próprios, ordem por chave, reprocessar o passado"],
      ["Amazon Data Firehose","Entrega gerenciada, sem consumidor próprio","Levar o fluxo para S3, Redshift, OpenSearch ou Splunk sem escrever código"],
      ["Amazon MSK","Apache Kafka gerenciado","Já usa Kafka ou precisa do ecossistema e das APIs do Kafka"]
    ]},
    {t:"p", x:"Firehose acumula registros em um buffer, por tamanho e por tempo, e grava em lote no destino. Por isso é quase em tempo real, não em milissegundos. Ele pode transformar registros com Lambda e converter JSON para Parquet ou ORC antes de gravar no S3, usando o esquema de uma tabela do Glue Data Catalog."},
    {t:"p", x:"Data Streams guarda os registros e deixa cada aplicação ler no próprio ritmo, inclusive voltar no tempo dentro da retenção. Firehose não tem isso: o dado passa e vai para o destino. Enunciado que fala em reprocessar ou em várias equipes lendo o mesmo fluxo pede Data Streams."},
    {t:"h", x:"Guardar, catalogar e consultar"},
    {t:"table", head:["Serviço","Papel","Pista no enunciado"], rows:[
      ["Glue","ETL serverless em Spark, rastreador e Data Catalog","Descobrir esquema, transformar e catalogar sem administrar cluster"],
      ["Athena","SQL serverless direto no S3, cobrança por dado lido","Consulta ocasional sobre o lago, sem carregar nada"],
      ["Redshift","Armazém de dados colunar","Painéis e relatórios frequentes sobre volume grande, junções pesadas"],
      ["Redshift Spectrum","Redshift lendo tabelas externas no S3","Juntar dado do armazém com histórico que ficou no S3"],
      ["EMR","Spark, Hive e Hadoop gerenciados","Controle do framework, trabalho grande e customizado"],
      ["OpenSearch Service","Busca e análise de logs","Busca textual, análise de logs quase em tempo real, painéis"],
      ["Amazon Quick Sight","BI e painéis gerenciados, hoje parte do Amazon Quick (antigo QuickSight)","Visualizar para a área de negócio"],
      ["Lake Formation","Governança e permissão do lago","Restringir por banco, tabela, coluna ou linha em um só lugar"]
    ]},
    {t:"p", x:"Lake Formation trabalha sobre o Glue Data Catalog e centraliza as permissões que Athena, Redshift Spectrum e EMR respeitam. É a resposta quando o enunciado pede que um grupo não veja certas colunas, sem duplicar o dado nem escrever política de bucket por prefixo."},
    {t:"h", x:"Formato e particionamento"},
    {t:"ul", x:[
      "Parquet e ORC são colunares: a consulta lê só as colunas usadas e pula blocos pelos metadados de mínimo e máximo",
      "Compressão reduz a conta do Athena, que cobra pelos bytes lidos",
      "Partição por data, ou pela coluna mais filtrada, faz a consulta ler só as pastas que interessam",
      "Partição demais gera milhares de arquivos pequenos, e arquivo pequeno deixa tudo mais lento",
      "Glue ETL compacta arquivos pequenos e converte CSV ou JSON para Parquet"
    ]},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Gravar o fluxo no S3 sem código e sem servidor","Amazon Data Firehose"],
      ["Várias equipes leem o mesmo fluxo e uma reprocessa sete dias","Kinesis Data Streams"],
      ["A empresa já usa Kafka e quer manter as APIs","Amazon MSK"],
      ["SQL ocasional sobre arquivos no S3, sem infraestrutura","Athena"],
      ["Relatórios diários pesados com muitas junções","Redshift"],
      ["Juntar tabela do armazém com histórico antigo no S3","Redshift Spectrum"],
      ["Analista não pode ver a coluna de CPF","Lake Formation, permissão por coluna"],
      ["Descobrir o esquema de arquivos novos automaticamente","Rastreador do Glue"],
      ["Busca textual e análise de logs com painéis","OpenSearch Service"],
      ["Consulta cara que filtra por data e lê poucas colunas","Parquet particionado por data"]
    ]},
    {t:"trap", x:"Firehose e Data Streams aparecem lado a lado como se fossem intercambiáveis. Firehose entrega com buffer e não tem consumidor próprio nem reprocessamento; Data Streams exige que você escreva ou configure os consumidores. Se o enunciado pede menor esforço para chegar ao S3, Data Streams perde; se pede releitura, Firehose perde."},
    {t:"case", q:"Arquivos de vendas em CSV chegam todo dia num bucket. Analistas querem consultar com SQL e montar painéis, a equipe financeira não pode ver a coluna de CPF, e ninguém quer administrar servidor. Qual arquitetura?",
      a:"Um trabalho do Glue converte o CSV para Parquet particionado por data e registra a tabela no Data Catalog. Lake Formation concede ao grupo financeiro acesso à tabela sem a coluna de CPF. Athena consulta o lago e o Amazon Quick Sight monta os painéis. Tudo é serverless, e a permissão por coluna fica num só lugar, em vez de copiar o dado sem a coluna ou separar buckets."}
  ],
  check:["Separar Firehose de Data Streams por dois requisitos","Explicar por que Parquet particionado barateia o Athena","Dizer quando Redshift Spectrum ganha de carregar tudo no Redshift"],
  src:[{t:"AWS: otimizar dados no Athena", u:"https://docs.aws.amazon.com/athena/latest/ug/performance-tuning-data-optimization-techniques.html"},
       {t:"AWS: conversão de formato no Data Firehose", u:"https://docs.aws.amazon.com/firehose/latest/dev/enable-record-format-conversion.html"}]
},
{
  id:"f-saa-rede-desemp", exam:"saa", dom:"d3", mins:8, concept:"rede-desempenho", extra:true,
  title:"Rede de alto desempenho: borda, híbrido e entre instâncias",
  lead:"Desempenho de rede cai em três lugares: perto do usuário, entre o datacenter e a AWS, e entre instâncias. Cada lugar tem serviços próprios, e misturar é a pegadinha.",
  blocks:[
    {t:"h", x:"Perto do usuário"},
    {t:"table", head:["Recurso","Faz","Escolha quando"], rows:[
      ["CloudFront","Cache HTTP e HTTPS na borda","Conteúdo que se repete, estático ou dinâmico com cache curto"],
      ["Origin Shield","Camada extra de cache antes da origem","Origem frágil ou cara, usuários em muitas regiões"],
      ["CloudFront Functions","JavaScript leve na borda, submilissegundo","Reescrever URL, ajustar cabeçalho, normalizar chave de cache"],
      ["Lambda@Edge","Node.js ou Python, até 30 segundos, com rede","Chamar serviço externo, ler o corpo, eventos de origem"],
      ["Global Accelerator","Dois IPs anycast fixos, rede global da AWS","TCP ou UDP sem cache, IP fixo, troca rápida de região"]
    ]},
    {t:"p", x:"Origin Shield junta os pedidos de todos os caches regionais em um ponto só, de modo que a origem vê muitas vezes um único pedido por objeto. Ele é cobrado à parte e ajuda pouco em conteúdo que não se repete."},
    {t:"h", x:"Entre o datacenter e a AWS"},
    {t:"table", head:["Opção","Característica","Cuidado"], rows:[
      ["Site-to-Site VPN","IPsec pela internet, pronta em minutos","Banda e latência variam com a internet"],
      ["Direct Connect","Link privado dedicado, latência estável","Semanas para instalar; não criptografa por padrão"],
      ["Direct Connect com VPN de reserva","VPN assume se o link cair","Banda menor durante a falha"],
      ["Dois Direct Connect em locais diferentes","Resiliência máxima","Custo maior"],
      ["LAG","Agrega conexões no mesmo equipamento","Soma banda, não protege contra falha do equipamento"]
    ]},
    {t:"p", x:"Criptografia sobre Direct Connect: MACsec protege o enlace em alguns locais e conexões dedicadas; para cifrar o caminho todo, roda-se uma VPN IPsec por cima do Direct Connect."},
    {t:"h", x:"Entre VPCs"},
    {t:"table", head:["Opção","Modelo","Use quando"], rows:[
      ["VPC peering","Um para um, sem transitividade, sem CIDR sobreposto","Poucas VPCs, menor custo, sem gargalo central"],
      ["Transit Gateway","Hub com rotas transitivas, inclui VPN e Direct Connect","Dezenas de VPCs e redes locais"],
      ["PrivateLink","Expõe um serviço por ponto de extremidade de interface","Consumir um serviço específico, mesmo com CIDR sobreposto"]
    ]},
    {t:"h", x:"Entre instâncias"},
    {t:"ul", x:[
      "Grupo cluster: uma zona só, latência mínima e muita vazão entre nós",
      "Grupo spread: no máximo sete instâncias em execução por zona, cada uma em rack separado",
      "Grupo partition: até sete partições por zona, para HDFS, Cassandra e Kafka",
      "Rede aprimorada com ENA: mais pacotes por segundo e menos latência, sem custo extra",
      "EFA: desvia do kernel para MPI e NCCL; o tráfego EFA não atravessa zona nem VPC"
    ]},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Origem local com pouca banda e usuários no mundo todo","CloudFront com Origin Shield"],
      ["Reescrever URL na borda com o menor custo","CloudFront Functions"],
      ["Na borda, chamar API externa antes de responder","Lambda@Edge"],
      ["IP fixo global para TCP ou UDP, sem cache","Global Accelerator"],
      ["Link dedicado com reserva barata","Direct Connect com VPN de reserva"],
      ["Sobreviver à perda de um local do Direct Connect","Conexões em dois locais"],
      ["Trinta VPCs e dois datacenters com rota central","Transit Gateway"],
      ["Expor um serviço a outra conta com CIDR sobreposto","PrivateLink"],
      ["Simulação MPI com milhares de mensagens entre nós","Grupo cluster com EFA"]
    ]},
    {t:"trap", x:"LAG parece alta disponibilidade, mas todas as conexões terminam no mesmo equipamento da AWS: ele aumenta a banda e não protege contra falha de equipamento ou de local. Do mesmo jeito, VPC peering não é transitivo: A ligada a B e B ligada a C não faz A falar com C."},
    {t:"case", q:"Uma empresa tem um Direct Connect de 10 Gbps. Se ele cair, a operação precisa continuar, ainda que mais lenta, e a diretoria quer o menor custo para essa proteção. O que fazer?",
      a:"Configurar uma Site-to-Site VPN como caminho de reserva, com BGP preferindo o Direct Connect. A VPN custa pouco, sobe pela internet e só carrega tráfego na falha, o que atende ao aceite de banda menor. Uma segunda conexão Direct Connect em outro local daria resiliência máxima, mas não é o menor custo. Um LAG não resolve, porque fica no mesmo equipamento."}
  ],
  check:["Separar CloudFront Functions de Lambda@Edge por dois critérios","Dizer por que LAG não é alta disponibilidade","Escolher entre peering, Transit Gateway e PrivateLink por um requisito"],
  src:[{t:"AWS: estratégias de grupos de posicionamento", u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html"},
       {t:"AWS: CloudFront Functions e Lambda@Edge", u:"https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html"}]
},
{
  id:"f-saa-containers", exam:"saa", dom:"d3", mins:7, concept:"containers-serverless", extra:true,
  title:"Contêineres e serverless: onde rodar cada código",
  lead:"Quase toda carga cabe em mais de um serviço. A prova escolhe pelo detalhe: duração, GPU, Kubernetes, esforço operacional. Saber os limites decide a resposta.",
  blocks:[
    {t:"h", x:"Orquestrador e tipo de execução"},
    {t:"table", head:["Escolha","Opção A","Opção B"], rows:[
      ["Orquestrador","ECS: nativo da AWS, mais simples","EKS: Kubernetes, portabilidade e ecossistema"],
      ["Tipo de execução","EC2: você escolhe e administra os nós","Fargate: sem nó, paga por tarefa"],
      ["GPU","EC2 atende","Fargate não oferece GPU"],
      ["Esforço operacional","Maior: patch, escala e imagem dos nós","Menor: só a definição da tarefa"]
    ]},
    {t:"p", x:"EKS aparece quando o enunciado diz que a empresa já usa Kubernetes, quer manter manifestos ou precisa rodar igual em outro ambiente. Sem essa pista, ECS com Fargate costuma ser a resposta de menor esforço para contêiner."},
    {t:"p", x:"A AWS fechou o App Runner para novos clientes: quem já usa continua, mas não há recursos novos planejados. Para uma aplicação web em contêiner com o mínimo de configuração, a recomendação atual é o ECS Express Mode, que cria serviço Fargate, balanceador e dimensionamento a partir de uma imagem."},
    {t:"h", x:"Lambda: os números que caem"},
    {t:"table", head:["Limite","Valor","Consequência"], rows:[
      ["Tempo máximo","15 minutos","Processo de 40 minutos não cabe"],
      ["Memória","128 MB a 10.240 MB","CPU cresce junto com a memória"],
      ["Armazenamento em /tmp","Até 10.240 MB","Arquivo temporário grande cabe"],
      ["Carga síncrona","6 MB na requisição e na resposta","Arquivo grande vai pelo S3"],
      ["Concorrência padrão","1.000 por região, ajustável","Pico sem controle limita outras funções"]
    ]},
    {t:"ul", x:[
      "Concorrência reservada: garante e limita a função, sem custo extra",
      "Concorrência provisionada: ambientes pré-inicializados contra partida a frio, com custo",
      "Se a função tem concorrência reservada, a provisionada não pode passar dela"
    ]},
    {t:"h", x:"API Gateway e Step Functions"},
    {t:"table", head:["Recurso","REST API","HTTP API"], rows:[
      ["Cache de resposta","Sim","Não"],
      ["Chave de API e plano de uso por cliente","Sim","Não"],
      ["AWS WAF e endpoint privado","Sim","Não"],
      ["Autorizador JWT genérico (OIDC/OAuth 2.0)","Não; usa autorizador do Cognito ou Lambda","Sim"],
      ["Preço","Maior","Menor, com menos recursos"]
    ]},
    {t:"p", x:"Step Functions Standard dura até um ano e executa cada etapa uma vez, bom para pagamento e processo longo. Express dura até cinco minutos, é cobrado por execução e duração e serve para alto volume de eventos curtos e idempotentes."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Contêiner sem administrar servidor","ECS com Fargate"],
      ["Já usa Kubernetes e quer os mesmos manifestos","EKS"],
      ["Contêiner precisa de GPU","ECS ou EKS com nós EC2"],
      ["Processo leva 40 minutos","Fora da Lambda: tarefa no Fargate"],
      ["Partida a frio inaceitável em horário previsto","Concorrência provisionada"],
      ["Uma função não pode esgotar a concorrência das outras","Concorrência reservada"],
      ["Cache de resposta e cota por cliente na API","API Gateway REST com plano de uso"],
      ["API simples com JWT e menor custo","API Gateway HTTP API"],
      ["Fluxo de milhares de eventos curtos por segundo","Step Functions Express"],
      ["Web app em contêiner com o mínimo de configuração, conta nova","ECS Express Mode (App Runner está fechado a novos clientes)"]
    ]},
    {t:"trap", x:"Concorrência reservada não reduz partida a frio: ela só separa e limita capacidade. Quem pré-aquece ambientes é a provisionada, que é cobrada. E cache no API Gateway só existe na REST API: alternativa que propõe ligar cache numa HTTP API está errada."},
    {t:"case", q:"Usuários enviam vídeos por uma API. A conversão de cada vídeo leva de 20 a 50 minutos, o volume é irregular e a equipe não quer administrar servidor. A API precisa responder em segundos. Qual arquitetura?",
      a:"API Gateway com uma Lambda curta que grava o pedido e inicia uma execução Standard do Step Functions, que roda a conversão como tarefa do ECS no Fargate e trata erro e nova tentativa. A Lambda sozinha não serve porque o limite é 15 minutos; EC2 sempre ligada pagaria pelo tempo ocioso; Express não serve porque dura no máximo cinco minutos."}
  ],
  check:["Dizer dois limites da Lambda que eliminam uma alternativa","Separar concorrência reservada de provisionada","Listar dois recursos que só a REST API tem"],
  src:[{t:"AWS: cotas da Lambda", u:"https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html"},
       {t:"AWS: REST API ou HTTP API", u:"https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html"}]
},
{
  id:"f-saa-custo-bd-rede", exam:"saa", dom:"d4", mins:8, concept:"custo-banco-rede", extra:true,
  title:"Custo de banco de dados e de rede",
  lead:"Banco e rede geram as linhas da fatura que ninguém previu: E/S do Aurora, tabela grande do DynamoDB, NAT e tráfego entre zonas. A prova pede a troca que corta o custo sem perder o requisito.",
  blocks:[
    {t:"h", x:"Banco relacional"},
    {t:"table", head:["Opção","Como cobra","Escolha quando"], rows:[
      ["RDS ou Aurora reservado","Compromisso de 1 ou 3 anos","Banco de produção ligado o tempo todo"],
      ["Aurora Serverless v2","Por capacidade usada, em ACU","Carga variável; mínimo de 0 ACU pausa sem uso"],
      ["Aurora Standard","Instância, armazenamento e cada E/S","E/S até 25% do gasto do Aurora"],
      ["Aurora I/O-Optimized","Sem cobrança por E/S; instância e armazenamento mais caros","E/S acima de 25% do gasto do Aurora"]
    ]},
    {t:"p", x:"Com capacidade mínima de 0 ACU, o Aurora Serverless v2 pausa depois do tempo ocioso configurado e deixa de cobrar computação, mas continua cobrando armazenamento. A retomada costuma levar cerca de 15 segundos, e pode demorar mais depois de uma pausa longa; então serve para desenvolvimento e teste, não para produção que precisa responder na hora."},
    {t:"h", x:"DynamoDB e cache"},
    {t:"table", head:["Opção","Ganha quando","Cuidado"], rows:[
      ["Sob demanda","Tráfego imprevisível, com dias parados","Por requisição sai mais caro em carga constante"],
      ["Provisionado com dimensionamento","Tráfego previsível","Pico repentino pode sofrer limitação"],
      ["Capacidade reservada","Base provisionada estável","Só modo provisionado e classe Standard"],
      ["Classe Standard-IA","Armazenamento domina o custo","Leitura e gravação ficam mais caras"],
      ["ElastiCache reservado","Nós de cache ligados o tempo todo","Compromisso de 1 ou 3 anos"]
    ]},
    {t:"p", x:"Standard-IA guarda mais barato e cobra mais caro cada leitura e gravação, com o mesmo desempenho e a mesma durabilidade. A AWS indica a classe quando o armazenamento passa de metade do custo de throughput da tabela, como histórico de pedidos e logs antigos."},
    {t:"h", x:"Rede"},
    {t:"table", head:["Trajeto ou recurso","Cobrança","Troca que economiza"], rows:[
      ["Gateway NAT","Por hora e por GB processado","Ponto de extremidade de gateway para S3 e DynamoDB"],
      ["Ponto de extremidade de gateway","Sem custo","Só S3 e DynamoDB, só na mesma região"],
      ["Ponto de extremidade de interface","Por hora em cada zona e por GB","Vale para outros serviços ou acesso vindo do datacenter"],
      ["Entre zonas da mesma região","Por GB, nos dois sentidos","Manter chamadas frequentes na mesma zona quando possível"],
      ["Entre regiões","Por GB","Replicar só o necessário"],
      ["VPN e Direct Connect","VPN por hora de conexão mais saída a preço de internet; Direct Connect por hora de porta e por GB de saída, mais barato","Direct Connect quando o volume de saída é alto e constante"]
    ]},
    {t:"p", x:"CloudFront tem classes de preço. Price Class All usa todos os pontos de presença; as classes 200 e 100 deixam de fora as regiões mais caras. Usuário fora da classe continua atendido, normalmente por um ponto de presença mais distante e com latência maior. A Price Class 100 cobre Estados Unidos, México, Canadá, Europa, Israel e Turquia; a 200 exclui só América do Sul e Austrália e Nova Zelândia. Público concentrado na América do Norte e na Europa é o caso da Price Class 100."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["E/S passou de um quarto da conta do Aurora","Aurora I/O-Optimized"],
      ["Banco de teste parado à noite e no fim de semana","Aurora Serverless v2 com mínimo de 0 ACU"],
      ["Banco de produção estável por três anos","Instância reservada"],
      ["Tabela enorme de histórico raramente lida","DynamoDB classe Standard-IA"],
      ["DynamoDB provisionado estável, quer desconto","Capacidade reservada"],
      ["Instâncias privadas baixam muito do S3 pelo NAT","Ponto de extremidade de gateway"],
      ["Datacenter acessa o S3 por Direct Connect, de forma privada","Ponto de extremidade de interface do S3"],
      ["Usuários só na América do Norte e na Europa","CloudFront Price Class 100"],
      ["Terabytes de saída por mês para o datacenter","Direct Connect em vez de VPN"]
    ]},
    {t:"trap", x:"Capacidade reservada do DynamoDB não combina com modo sob demanda nem com a classe Standard-IA. Alternativa que propõe mudar a tabela para sob demanda e comprar capacidade reservada para ela está errada. Outra pegadinha: ponto de extremidade de interface cobra por hora em cada zona, então ele não é a troca gratuita do NAT; a gratuita é a de gateway."},
    {t:"case", q:"Um cluster Aurora de produção tem E/S correspondendo a 40% da conta do banco. A empresa também mantém quatro bancos Aurora de desenvolvimento usados só em horário comercial. Como reduzir o custo dos dois?",
      a:"Produção vai para Aurora I/O-Optimized, que elimina a cobrança por E/S; com E/S acima de 25% do gasto, a instância e o armazenamento mais caros se pagam. Os de desenvolvimento viram Aurora Serverless v2 com mínimo de 0 ACU, que pausa sem conexões e cobra só o armazenamento nesse período. Reservar os de desenvolvimento pagaria pelas horas paradas."}
  ],
  check:["Dizer o limite de 25% que decide entre Aurora Standard e I/O-Optimized","Lembrar as duas restrições da capacidade reservada do DynamoDB","Explicar por que ponto de extremidade de interface não é gratuito"],
  src:[{t:"AWS: configurações de armazenamento do Aurora", u:"https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.StorageReliability.html"},
       {t:"AWS: capacidade reservada do DynamoDB", u:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/reserved-capacity.html"}]
}
];
FICHAS.push(...FICHAS_CLF_A, ...FICHAS_CLF_B, ...FICHAS_SAA_C, ...FICHAS_SAA_D);
FICHAS_AWS.push(...FICHAS_CLF_A, ...FICHAS_CLF_B);
