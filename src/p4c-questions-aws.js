/* ============================================================
   BANCO DE QUESTÕES — lote 2, AWS (Cloud Practitioner)
   ============================================================ */
const QUESTIONS_AW2 = [
{
  id:"aw-d1-04", exam:"clf", dom:"d1", lvl:4, type:"single", sec:75, tags:["well-architected"],
  case:"Uma equipe descobriu que três ambientes de teste ficam ligados 24 horas por dia, embora só sejam usados em horário comercial, e ninguém sabe a qual projeto cada um pertence.",
  stem:"Qual pilar do Well-Architected trata diretamente desse problema?",
  opts:[
    {k:"A",t:"Otimização de custos"},
    {k:"B",t:"Confiabilidade"},
    {k:"C",t:"Segurança"},
    {k:"D",t:"Eficiência de desempenho"}
  ],
  ans:["A"],
  why:{
    ok:"Pagar por capacidade ociosa e não conseguir atribuir o gasto a um dono são falhas clássicas de otimização de custos, que trata de gastar só o necessário e de medir e atribuir despesa.",
    B:"Confiabilidade trata de recuperação de falha e de atender à demanda. Nada no enunciado fala disso.",
    C:"Segurança trata de identidade, dados e detecção. O problema descrito é financeiro e de governança de custo.",
    D:"Eficiência de desempenho trata de escolher e dimensionar recursos para a carga, não de desligar o que não está em uso."
  },
  src:[{t:"Well-Architected",u:"https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html"}]
},
{
  id:"aw-d1-05", exam:"clf", dom:"d1", lvl:4, type:"single", sec:75, tags:["6rs","well-architected"],
  case:"Durante o inventário de uma migração, a equipe encontrou um sistema de relatórios que nenhum usuário acessa há dois anos e cujo dono confirma que não é mais necessário.",
  stem:"Qual estratégia de migração se aplica?",
  opts:[
    {k:"A",t:"Retire"},
    {k:"B",t:"Retain"},
    {k:"C",t:"Rehost"},
    {k:"D",t:"Repurchase"}
  ],
  ans:["A"],
  why:{
    ok:"Retire é desligar o que não é mais usado. É a migração mais barata que existe, porque elimina o trabalho e o custo em vez de transferi-los.",
    B:"Retain é manter onde está, por decisão consciente de adiar. O enunciado diz que o sistema não é mais necessário.",
    C:"Rehost moveria para a nuvem um sistema que ninguém usa, gerando custo sem benefício.",
    D:"Repurchase substituiria por um SaaS equivalente, o que também não faz sentido para algo descartável."
  },
  src:[{t:"Estratégias de migração",u:"https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html"}]
},
{
  id:"aw-d1-06", exam:"clf", dom:"d1", lvl:4, type:"multi", sec:90, tags:["infra-global"],
  stem:"Quais fatores a AWS recomenda considerar ao escolher uma região? Escolha TRÊS.",
  opts:[
    {k:"A",t:"Conformidade e requisitos legais sobre onde o dado pode residir"},
    {k:"B",t:"Proximidade dos usuários, pela latência"},
    {k:"C",t:"Disponibilidade do serviço naquela região"},
    {k:"D",t:"Quantidade de funcionários da AWS no país"},
    {k:"E",t:"Idioma do console na região"}
  ],
  ans:["A","B","C"],
  why:{
    ok:"Os critérios são conformidade e soberania do dado, latência para os usuários, disponibilidade do serviço naquela região e preço, que varia entre regiões.",
    D:"Não é critério técnico nem comercial de escolha de região.",
    E:"O idioma do console é configuração da conta, não propriedade da região."
  },
  src:[{t:"Infraestrutura global",u:"https://aws.amazon.com/about-aws/global-infrastructure/"}]
},
{
  id:"aw-d1-07", exam:"clf", dom:"d1", lvl:3, type:"single", sec:65, tags:["infra-global"],
  stem:"Uma aplicação precisa continuar disponível se um datacenter da região falhar. Qual é a prática recomendada?",
  opts:[
    {k:"A",t:"Distribuir as instâncias por várias zonas de disponibilidade"},
    {k:"B",t:"Usar uma instância maior"},
    {k:"C",t:"Habilitar o versionamento no S3"},
    {k:"D",t:"Criar uma segunda conta AWS"}
  ],
  ans:["A"],
  why:{
    ok:"Zonas de disponibilidade são datacenters isolados dentro da mesma região, com energia e rede independentes. Distribuir entre elas é a base da alta disponibilidade regional.",
    B:"Instância maior aumenta capacidade, não tolerância a falha: se o datacenter cai, a instância grande cai junto.",
    C:"Versionamento protege objetos contra sobrescrita e exclusão, não mantém a aplicação no ar.",
    D:"Conta separada é limite administrativo e de cobrança, não mecanismo de disponibilidade."
  },
  src:[{t:"Infraestrutura global",u:"https://aws.amazon.com/about-aws/global-infrastructure/"}]
},
{
  id:"aw-d1-08", exam:"clf", dom:"d1", lvl:5, type:"single", sec:80, tags:["well-architected","6rs"],
  case:"Uma empresa quer migrar 300 servidores em oito meses. O CFO exige previsibilidade de prazo e o CTO quer aproveitar serviços gerenciados sempre que não atrasar o cronograma.",
  stem:"Qual abordagem é mais coerente com os dois objetivos?",
  opts:[
    {k:"A",t:"Rehost da maioria e replatform seletivo nos componentes em que o ganho é claro"},
    {k:"B",t:"Refactor de todos os sistemas para arquitetura sem servidor"},
    {k:"C",t:"Repurchase de todos os sistemas por SaaS equivalente"},
    {k:"D",t:"Retain de todos os sistemas até que haja mais orçamento"}
  ],
  ans:["A"],
  why:{
    ok:"Rehost dá previsibilidade de prazo porque muda pouco, e replatform pontual captura ganho de serviço gerenciado onde o risco é baixo. É a combinação que atende prazo e modernização ao mesmo tempo.",
    B:"Refactor de 300 sistemas em oito meses é o oposto de previsível: é a estratégia mais cara e demorada.",
    C:"Nem todo sistema tem equivalente em SaaS, e trocar 300 de uma vez cria risco de processo enorme.",
    D:"Retain de tudo simplesmente não realiza a migração pedida."
  },
  src:[{t:"Estratégias de migração",u:"https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html"}]
},
{
  id:"aw-d1-09", exam:"clf", dom:"d1", lvl:4, type:"yn", sec:90, tags:["infra-global","well-architected"],
  stem:"Responda Sim ou Não sobre a infraestrutura global e os conceitos da AWS.",
  rows:[
    {t:"Uma região da AWS é composta por várias zonas de disponibilidade.", a:true,
     e:"Por definição. É isso que permite alta disponibilidade dentro da região."},
    {t:"Pontos de presença executam o código da sua aplicação como se fossem uma região.", a:false,
     e:"Eles guardam conteúdo em cache e terminam conexões. Não substituem uma região para hospedar a aplicação."},
    {t:"O número de zonas de disponibilidade é igual em todas as regiões.", a:false,
     e:"Varia de região para região."},
    {t:"O preço de um mesmo serviço pode mudar de uma região para outra.", a:true,
     e:"Muda, e é um dos critérios de escolha de região."}
  ],
  src:[{t:"Infraestrutura global",u:"https://aws.amazon.com/about-aws/global-infrastructure/"}]
},
{
  id:"aw-d1-10", exam:"clf", dom:"d1", lvl:4, type:"single", sec:70, tags:["well-architected"],
  stem:"Uma empresa deixou de comprar servidores para o pico de dezembro e passou a aumentar a capacidade só naquele mês. Qual benefício da nuvem isso representa?",
  opts:[
    {k:"A",t:"Parar de adivinhar a capacidade necessária"},
    {k:"B",t:"Aumentar a durabilidade dos dados"},
    {k:"C",t:"Reduzir a latência para o usuário final"},
    {k:"D",t:"Transferir a responsabilidade pelos dados ao provedor"}
  ],
  ans:["A"],
  why:{
    ok:"Deixar de dimensionar para o pico e ajustar conforme a demanda é um dos benefícios que a AWS lista explicitamente, e evita tanto desperdício quanto falta de capacidade.",
    B:"Durabilidade é propriedade do armazenamento, não do dimensionamento de computação.",
    C:"Latência depende de distância e de rede, não de quantas instâncias você provisiona.",
    D:"Responsabilidade pelos dados permanece com o cliente em qualquer modelo."
  },
  src:[{t:"Benefícios da nuvem",u:"https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html"}]
},
{
  id:"aw-d2-07", exam:"clf", dom:"d2", lvl:5, type:"single", sec:85, tags:["iam-role-ec2"],
  case:"Uma conta de desenvolvimento dentro do AWS Organizations não deve conseguir criar recursos em nenhuma região fora de sa-east-1, mesmo que um administrador local conceda permissão total de IAM a um usuário.",
  stem:"Qual mecanismo garante isso?",
  opts:[
    {k:"A",t:"Service Control Policy aplicada à conta ou à unidade organizacional"},
    {k:"B",t:"Política do IAM anexada a cada usuário"},
    {k:"C",t:"Grupo de segurança restringindo o tráfego"},
    {k:"D",t:"Network ACL negando outras regiões"}
  ],
  ans:["A"],
  why:{
    ok:"A SCP define o teto de permissão da conta: nada que ela proíba pode ser concedido pelo IAM local, nem pelo administrador da conta. É o único controle que sobrevive a um administrador com permissão total.",
    B:"Política de IAM pode ser alterada por quem tem permissão administrativa na própria conta, então não garante o limite.",
    C:"Grupo de segurança filtra tráfego de rede e não tem noção de região nem de criação de recurso.",
    D:"NACL também é controle de rede de sub-rede. Região não é um conceito de rede."
  },
  src:[{t:"Service Control Policies",u:"https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"}]
},
{
  id:"aw-d2-08", exam:"clf", dom:"d2", lvl:4, type:"single", sec:75, tags:["iam-role-ec2"],
  stem:"Qual prática a AWS recomenda em relação ao usuário raiz da conta?",
  opts:[
    {k:"A",t:"Habilitar MFA, guardar as credenciais e usá-lo apenas para as poucas tarefas que exigem o raiz"},
    {k:"B",t:"Usá-lo no dia a dia, por ter permissão total e evitar bloqueios"},
    {k:"C",t:"Compartilhar as credenciais com a equipe de infraestrutura"},
    {k:"D",t:"Criar chaves de acesso do raiz para uso das aplicações"}
  ],
  ans:["A"],
  why:{
    ok:"O raiz não pode ser limitado por política, então a recomendação é protegê-lo com MFA, não usá-lo no cotidiano e criar identidades com privilégio mínimo para o trabalho diário.",
    B:"Usar o raiz diariamente amplia o estrago de qualquer comprometimento e quebra a auditoria individual.",
    C:"Credencial compartilhada elimina a rastreabilidade de quem fez o quê.",
    D:"Chave de acesso do raiz é explicitamente desaconselhada: é a credencial mais poderosa possível, em formato estático."
  },
  src:[{t:"Boas práticas de IAM",u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"}]
},
{
  id:"aw-d2-09", exam:"clf", dom:"d2", lvl:4, type:"single", sec:80, tags:["seguranca-servicos"],
  case:"A equipe precisa provar ao auditor que todos os volumes EBS da conta estão criptografados e receber alerta sempre que alguém criar um volume sem criptografia.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"AWS Config, com regras de conformidade"},
    {k:"B",t:"AWS CloudTrail"},
    {k:"C",t:"Amazon Inspector"},
    {k:"D",t:"AWS Artifact"}
  ],
  ans:["A"],
  why:{
    ok:"O Config registra a configuração dos recursos ao longo do tempo e avalia regras de conformidade, apontando o que está fora do padrão e notificando mudanças.",
    B:"CloudTrail registra quem chamou qual API. Ele mostraria a criação do volume, mas não avalia conformidade de configuração continuamente.",
    C:"Inspector procura vulnerabilidade de software em instâncias, contêineres e funções, não configuração de criptografia de volume.",
    D:"Artifact entrega relatórios de conformidade da própria AWS, não o estado dos seus recursos."
  },
  src:[{t:"AWS Config",u:"https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html"}]
},
{
  id:"aw-d2-10", exam:"clf", dom:"d2", lvl:4, type:"single", sec:75, tags:["sg-vs-nacl"],
  case:"Um servidor web em sub-rede pública precisa aceitar HTTPS da internet e conversar com um banco em sub-rede privada na porta 3306. O banco não pode aceitar conexão de mais ninguém.",
  stem:"Qual configuração de grupos de segurança é a recomendada?",
  opts:[
    {k:"A",t:"No grupo do banco, permitir a porta 3306 tendo como origem o grupo de segurança do servidor web"},
    {k:"B",t:"No grupo do banco, permitir a porta 3306 a partir de 0.0.0.0/0"},
    {k:"C",t:"No grupo do banco, criar uma regra de negação para todos os outros endereços"},
    {k:"D",t:"Colocar banco e servidor web no mesmo grupo de segurança, liberando tudo entre eles"}
  ],
  ans:["A"],
  why:{
    ok:"Referenciar outro grupo de segurança como origem é a prática recomendada: o acesso acompanha as instâncias daquele grupo, sem depender de endereços IP que mudam.",
    B:"Abrir a porta do banco para a internet inteira é exatamente o que o enunciado proíbe.",
    C:"Grupo de segurança não tem regra de negação. O que não está permitido já está implicitamente negado.",
    D:"Juntar tudo num grupo só elimina a separação de camadas e abre o banco para qualquer coisa nesse grupo."
  },
  src:[{t:"Security groups",u:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html"}]
},
{
  id:"aw-d2-11", exam:"clf", dom:"d2", lvl:4, type:"single", sec:75, tags:["seguranca-servicos"],
  stem:"Qual serviço avalia instâncias EC2, imagens de contêiner e funções Lambda em busca de vulnerabilidades conhecidas de software?",
  opts:[
    {k:"A",t:"Amazon Inspector"},
    {k:"B",t:"Amazon GuardDuty"},
    {k:"C",t:"Amazon Macie"},
    {k:"D",t:"AWS Shield"}
  ],
  ans:["A"],
  why:{
    ok:"O Inspector faz varredura contínua de vulnerabilidade e exposição não intencional de rede em EC2, ECR e Lambda.",
    B:"GuardDuty detecta atividade maliciosa e comportamento anômalo a partir de logs e sinais, não vulnerabilidade de pacote.",
    C:"Macie descobre e classifica dado sensível no S3.",
    D:"Shield protege contra negação de serviço distribuída."
  },
  src:[{t:"Amazon Inspector",u:"https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html"}]
},
{
  id:"aw-d2-12", exam:"clf", dom:"d2", lvl:4, type:"yn", sec:90, tags:["shared-responsibility"],
  stem:"Responda Sim ou Não sobre responsabilidades no AWS Lambda e em serviços gerenciados.",
  rows:[
    {t:"No Lambda, a AWS cuida do sistema operacional e do runtime subjacente.", a:true,
     e:"É serviço totalmente gerenciado: você entrega o código e a configuração."},
    {t:"No Lambda, o cliente continua responsável pelo código e pelas permissões da função.", a:true,
     e:"Código, dependências e a função do IAM associada são do cliente."},
    {t:"Em qualquer serviço gerenciado, a criptografia dos dados é ativada automaticamente pela AWS sem configuração.", a:false,
     e:"Vários serviços oferecem criptografia padrão hoje, mas a decisão, a chave e a verificação continuam sendo responsabilidade do cliente. Não se deve presumir."},
    {t:"A AWS é responsável por garantir que a sua aplicação não tenha falha de lógica de autorização.", a:false,
     e:"Lógica de aplicação é sempre do cliente."}
  ],
  src:[{t:"Responsabilidade compartilhada",u:"https://aws.amazon.com/compliance/shared-responsibility-model/"}]
},
{
  id:"aw-d2-13", exam:"clf", dom:"d2", lvl:5, type:"single", sec:85, tags:["iam-role-ec2"],
  case:"Uma empresa parceira precisa de acesso temporário e limitado a um bucket específico na conta da sua empresa. Ela já tem conta própria na AWS.",
  stem:"Qual é a forma recomendada?",
  opts:[
    {k:"A",t:"Criar uma função do IAM com relação de confiança para a conta do parceiro, que a assume"},
    {k:"B",t:"Criar um usuário do IAM e enviar a chave de acesso por e-mail"},
    {k:"C",t:"Tornar o bucket público e informar a URL"},
    {k:"D",t:"Compartilhar as credenciais do usuário raiz"}
  ],
  ans:["A"],
  why:{
    ok:"Acesso entre contas se faz com função assumida: a credencial é temporária, o escopo é definido pela política e o acesso pode ser revogado alterando a relação de confiança.",
    B:"Chave de acesso de longo prazo enviada por e-mail é credencial permanente trafegando por canal inseguro.",
    C:"Bucket público expõe o conteúdo para a internet inteira, não só para o parceiro.",
    D:"Compartilhar o raiz é a pior opção possível em qualquer cenário."
  },
  src:[{t:"Funções do IAM",u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html"}]
},
{
  id:"aw-d2-14", exam:"clf", dom:"d2", lvl:4, type:"single", sec:75, tags:["seguranca-servicos"],
  stem:"Qual serviço agrega em um painel único os achados de segurança do GuardDuty, do Inspector, do Macie e de parceiros?",
  opts:[
    {k:"A",t:"AWS Security Hub"},
    {k:"B",t:"Amazon Detective"},
    {k:"C",t:"AWS CloudTrail"},
    {k:"D",t:"AWS Trusted Advisor"}
  ],
  ans:["A"],
  why:{
    ok:"O Security Hub centraliza e normaliza achados de vários serviços e de parceiros, além de medir a conformidade com padrões. Atenção ao nome: desde dezembro de 2025 o Security Hub original se chama AWS Security Hub CSPM, e o novo AWS Security Hub correlaciona os sinais do GuardDuty, do Inspector, do Macie e do CSPM para priorizar riscos. Os dois fazem parte da mesma família, e a resposta continua sendo Security Hub.",
    B:"Detective ajuda a investigar a causa de um achado, analisando o grafo de eventos. Não é o agregador.",
    C:"CloudTrail é o registro de chamadas de API.",
    D:"Trusted Advisor dá recomendações em seis categorias, com verificações de segurança, mas não é o painel de achados."
  },
  src:[{t:"AWS Security Hub CSPM",u:"https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html"},
       {t:"AWS Security Hub",u:"https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub-v2.html"}]
},
{
  id:"aw-d3-10", exam:"clf", dom:"d3", lvl:4, type:"single", sec:80, tags:["bancos-aws"],
  case:"Um banco de dados relacional de produção precisa continuar disponível se a zona onde ele roda falhar, com troca automática, sem que a aplicação mude a string de conexão.",
  stem:"Qual recurso do Amazon RDS atende?",
  opts:[
    {k:"A",t:"Implantação Multi-AZ"},
    {k:"B",t:"Réplica de leitura em outra zona"},
    {k:"C",t:"Snapshot automático diário"},
    {k:"D",t:"Aumentar a classe da instância"}
  ],
  ans:["A"],
  why:{
    ok:"Multi-AZ mantém uma instância em espera em outra zona e faz failover automático, com o mesmo endpoint. É o recurso de alta disponibilidade do RDS.",
    B:"Réplica de leitura serve para escalar leitura. A promoção é manual e o endpoint é outro, então não é failover automático.",
    C:"Snapshot é backup: ajuda a restaurar, mas com interrupção e perda do intervalo desde a última cópia.",
    D:"Instância maior aumenta capacidade e não protege contra a queda da zona."
  },
  src:[{t:"RDS Multi-AZ",u:"https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html"}]
},
{
  id:"aw-d3-11", exam:"clf", dom:"d3", lvl:4, type:"single", sec:75, tags:["s3-classes"],
  case:"Um bucket guarda documentos que são muito acessados nos primeiros 30 dias e quase nunca depois. A equipe não quer mover os objetos manualmente.",
  stem:"Qual recurso do S3 resolve?",
  opts:[
    {k:"A",t:"Regra de ciclo de vida que faz a transição de classe após 30 dias"},
    {k:"B",t:"Versionamento do bucket"},
    {k:"C",t:"Replicação entre regiões"},
    {k:"D",t:"Bloqueio de acesso público"}
  ],
  ans:["A"],
  why:{
    ok:"Regras de ciclo de vida movem objetos entre classes ou os expiram automaticamente conforme a idade. É exatamente o padrão de acesso descrito.",
    B:"Versionamento mantém versões antigas e tende a aumentar o custo, sem mudar a classe.",
    C:"Replicação copia para outra região, útil para continuidade, não para custo por padrão de acesso.",
    D:"Bloqueio de acesso público é controle de segurança."
  },
  src:[{t:"Ciclo de vida do S3",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html"}]
},
{
  id:"aw-d3-12", exam:"clf", dom:"d3", lvl:4, type:"single", sec:75, tags:["compute-aws"],
  case:"Uma aplicação web está atrás de um balanceador. Em horário de pico ela fica lenta e, de madrugada, as instâncias ficam praticamente ociosas.",
  stem:"Qual recurso resolve os dois lados do problema?",
  opts:[
    {k:"A",t:"Grupo de Auto Scaling com política baseada em métrica"},
    {k:"B",t:"Trocar por uma instância de classe maior"},
    {k:"C",t:"Habilitar o CloudFront na frente do balanceador"},
    {k:"D",t:"Migrar o banco para Multi-AZ"}
  ],
  ans:["A"],
  why:{
    ok:"Auto Scaling adiciona instâncias no pico e remove quando a demanda cai, atacando tanto a lentidão quanto o desperdício noturno.",
    B:"Instância maior resolveria o pico pagando o tamanho maior a noite inteira, que é metade do problema.",
    C:"CloudFront ajuda com conteúdo estático e latência geográfica. Se o gargalo é processamento dinâmico, não resolve.",
    D:"Multi-AZ é disponibilidade do banco, não capacidade da camada web."
  },
  src:[{t:"Auto Scaling",u:"https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html"}]
},
{
  id:"aw-d3-13", exam:"clf", dom:"d3", lvl:5, type:"single", sec:85, tags:["rede-aws"],
  case:"Instâncias em sub-rede privada precisam ler e gravar em um bucket do S3. A equipe de segurança exige que esse tráfego não passe pela internet pública em nenhum momento.",
  stem:"Qual recurso atende?",
  opts:[
    {k:"A",t:"VPC Endpoint do tipo gateway para o S3"},
    {k:"B",t:"NAT Gateway na sub-rede pública"},
    {k:"C",t:"Internet Gateway anexado à VPC"},
    {k:"D",t:"Security group permitindo saída para a internet"}
  ],
  ans:["A"],
  why:{
    ok:"O VPC Endpoint cria um caminho privado da VPC para o serviço da AWS, sem passar pela internet. Para o S3 e o DynamoDB existe o endpoint do tipo gateway.",
    B:"NAT Gateway dá saída para a internet, então o tráfego passaria pela internet pública, contrariando o requisito.",
    C:"Internet Gateway é justamente a porta para a internet.",
    D:"Regra de saída permite o tráfego, mas o caminho continua sendo pela internet."
  },
  src:[{t:"VPC Endpoints",u:"https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html"}]
},
{
  id:"aw-d3-14", exam:"clf", dom:"d3", lvl:4, type:"single", sec:75, tags:["rede-aws"],
  case:"Uma distribuição do CloudFront serve arquivos de um bucket. O requisito é que ninguém consiga baixar os arquivos indo direto na URL do S3, apenas pelo CloudFront.",
  stem:"Qual recurso atende?",
  opts:[
    {k:"A",t:"Origin Access Control, com política de bucket que só aceita a distribuição"},
    {k:"B",t:"Tornar o bucket público e confiar na URL difícil de adivinhar"},
    {k:"C",t:"Habilitar versionamento no bucket"},
    {k:"D",t:"Criar uma NACL bloqueando a internet no bucket"}
  ],
  ans:["A"],
  why:{
    ok:"O Origin Access Control permite que apenas a distribuição do CloudFront leia o bucket, e a política do bucket nega qualquer outro acesso.",
    B:"URL difícil de adivinhar não é controle de acesso: basta alguém descobrir o endereço.",
    C:"Versionamento trata de histórico de objetos.",
    D:"NACL atua em sub-rede de VPC. O S3 não fica dentro da sua sub-rede."
  },
  src:[{t:"Origin Access Control",u:"https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html"}]
},
{
  id:"aw-d3-15", exam:"clf", dom:"d3", lvl:4, type:"single", sec:75, tags:["compute-aws"],
  stem:"Qual característica do AWS Lambda é correta?",
  opts:[
    {k:"A",t:"A cobrança considera o número de requisições e a duração da execução"},
    {k:"B",t:"A função fica em execução permanente, como um servidor"},
    {k:"C",t:"É necessário escolher e administrar o tipo de instância"},
    {k:"D",t:"Não há limite de tempo para uma execução"}
  ],
  ans:["A"],
  why:{
    ok:"O modelo de cobrança do Lambda é por requisição e por tempo de execução, considerando a memória configurada. Sem invocação, não há custo de computação.",
    B:"O Lambda executa sob demanda e encerra. Execução permanente é o modelo de servidor, que ele substitui.",
    C:"Você configura memória e tempo limite, mas não escolhe nem administra instância.",
    D:"Existe tempo máximo de execução. Carga longa demais deve ir para contêiner ou lote."
  },
  src:[{t:"AWS Lambda",u:"https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"}]
},
{
  id:"aw-d3-16", exam:"clf", dom:"d3", lvl:4, type:"single", sec:80, tags:["s3-classes"],
  case:"Um volume EBS de produção precisa ter uma cópia de segurança diária, armazenada de forma durável e capaz de restaurar o volume em outra zona de disponibilidade.",
  stem:"Qual recurso atende?",
  opts:[
    {k:"A",t:"Snapshot do EBS"},
    {k:"B",t:"Instance store adicional"},
    {k:"C",t:"Aumentar o tamanho do volume"},
    {k:"D",t:"Habilitar o Multi-AZ no EBS"}
  ],
  ans:["A"],
  why:{
    ok:"Snapshots do EBS são incrementais, ficam no S3 de forma durável e permitem criar um volume novo em qualquer zona da região, ou copiar para outra região.",
    B:"Instance store é efêmero e some quando a instância para. É o oposto de cópia de segurança.",
    C:"Tamanho não tem relação com proteção do dado.",
    D:"Não existe Multi-AZ para EBS: o volume é zonal. Alta disponibilidade vem da arquitetura em volta."
  },
  src:[{t:"Snapshots do EBS",u:"https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html"}]
},
{
  id:"aw-d3-17", exam:"clf", dom:"d3", lvl:5, type:"multi", sec:95, tags:["sqs-sns-eb","compute-aws"],
  stem:"Uma loja quer desacoplar o processamento de pedidos para que um pico não derrube o sistema e nenhum pedido se perca. Quais escolhas são adequadas? Escolha DUAS.",
  opts:[
    {k:"A",t:"Colocar os pedidos em uma fila do Amazon SQS e processar no ritmo que a aplicação aguenta"},
    {k:"B",t:"Dimensionar os consumidores automaticamente conforme o tamanho da fila"},
    {k:"C",t:"Gravar os pedidos diretamente no banco de dados de forma síncrona, sem fila"},
    {k:"D",t:"Aumentar o tempo limite da requisição do usuário para esperar o processamento"},
    {k:"E",t:"Publicar os pedidos em um tópico do SNS sem nenhum assinante durável"}
  ],
  ans:["A","B"],
  why:{
    ok:"A fila absorve o pico e garante que a mensagem fique guardada até ser processada. Escalar os consumidores pela profundidade da fila faz o sistema recuperar o atraso sem perder pedido.",
    C:"Escrita síncrona direta é exatamente o acoplamento que derruba o sistema no pico.",
    D:"Esperar mais tempo piora a experiência e não aumenta a capacidade de processamento.",
    E:"O SNS entrega no momento da publicação. Sem assinante durável, como uma fila, a mensagem se perde."
  },
  src:[{t:"Amazon SQS",u:"https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html"}]
},
{
  id:"aw-d3-18", exam:"clf", dom:"d3", lvl:3, type:"single", sec:70, tags:["bancos-aws"],
  stem:"Qual serviço é um cache em memória gerenciado, usado para reduzir a latência de leituras repetidas e aliviar o banco de dados?",
  opts:[
    {k:"A",t:"Amazon ElastiCache"},
    {k:"B",t:"Amazon RDS"},
    {k:"C",t:"Amazon Redshift"},
    {k:"D",t:"Amazon S3"}
  ],
  ans:["A"],
  why:{
    ok:"ElastiCache oferece Valkey, Redis OSS e Memcached gerenciados, usados como camada de cache em memória na frente do banco.",
    B:"RDS é o banco relacional gerenciado, justamente o que o cache alivia.",
    C:"Redshift é data warehouse para consulta analítica.",
    D:"S3 é armazenamento de objetos, com latência muito maior que memória."
  },
  src:[{t:"Amazon ElastiCache",u:"https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html"}]
},
{
  id:"aw-d4-07", exam:"clf", dom:"d4", lvl:4, type:"multi", sec:90, tags:["pricing-models"],
  stem:"Quais são categorias de verificação do AWS Trusted Advisor? Escolha TRÊS.",
  opts:[
    {k:"A",t:"Otimização de custos"},
    {k:"B",t:"Segurança"},
    {k:"C",t:"Limites de serviço"},
    {k:"D",t:"Qualidade do código-fonte"},
    {k:"E",t:"Acessibilidade da interface"}
  ],
  ans:["A","B","C"],
  why:{
    ok:"O Trusted Advisor tem seis categorias: otimização de custos, desempenho, segurança, tolerância a falhas, limites de serviço e excelência operacional.",
    D:"Análise de código não é função do Trusted Advisor.",
    E:"Acessibilidade de interface de aplicação não é avaliada por ele."
  },
  src:[{t:"Trusted Advisor",u:"https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html"}]
},
{
  id:"aw-d4-08", exam:"clf", dom:"d4", lvl:4, type:"single", sec:75, tags:["pricing-models"],
  case:"Uma empresa com conta nova precisa de suporte técnico 24 horas por telefone para um sistema de produção, mas ainda não tem orçamento para gerente técnico de conta designado.",
  stem:"Qual plano de suporte é o mais adequado?",
  opts:[
    {k:"A",t:"Business Support+"},
    {k:"B",t:"Unified Operations"},
    {k:"C",t:"Basic"},
    {k:"D",t:"Enterprise"}
  ],
  ans:["A"],
  why:{
    ok:"O Business Support+, a partir de US$ 29 por mês por conta, dá acesso 24 horas a engenheiros por telefone, chat e web, com até 1 hora para sistema de produção fora do ar, sem TAM designado. Até 2026 essa resposta era o plano Business; Developer, Business e Enterprise On-Ramp serão descontinuados em 01/01/2027, e a prova pode ainda citar esses nomes.",
    B:"O Unified Operations é o nível mais alto, com TAM e engenheiro especialista designados. Inclui justamente o que o enunciado diz não caber no orçamento.",
    C:"O Basic cobre conta, cobrança e documentação. Não inclui suporte técnico de engenheiros.",
    D:"O Enterprise atende, mas inclui o gerente técnico designado que o enunciado diz não caber no orçamento."
  },
  src:[{t:"Planos de suporte",u:"https://aws.amazon.com/premiumsupport/plans/"},
       {t:"Fim do Developer, Business e Enterprise On-Ramp",u:"https://docs.aws.amazon.com/awssupport/latest/user/support-plans-eos.html"}]
},
{
  id:"aw-d4-09", exam:"clf", dom:"d4", lvl:5, type:"single", sec:85, tags:["pricing-models"],
  case:"Uma empresa quer o relatório mais detalhado possível de cobrança, linha a linha, por recurso e por hora, para carregar num sistema próprio de rateio interno.",
  stem:"Qual recurso entrega isso?",
  opts:[
    {k:"A",t:"AWS Cost and Usage Report, entregue em um bucket do S3"},
    {k:"B",t:"Cost Explorer"},
    {k:"C",t:"AWS Budgets"},
    {k:"D",t:"AWS Pricing Calculator"}
  ],
  ans:["A"],
  why:{
    ok:"O Cost and Usage Report é o conjunto de dados mais granular de cobrança da AWS, entregue em arquivo no S3, feito para ser processado por ferramentas externas. Hoje ele é criado pelo AWS Data Exports, na versão CUR 2.0.",
    B:"Cost Explorer é visualização e análise interativa, com exportação limitada frente ao detalhamento do CUR.",
    C:"Budgets dispara alerta ao atingir limite; não é fonte de dado detalhado.",
    D:"A calculadora estima custo de algo que ainda não existe."
  },
  src:[{t:"Cost and Usage Report",u:"https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html"}]
},
{
  id:"aw-d4-10", exam:"clf", dom:"d4", lvl:4, type:"yn", sec:90, tags:["pricing-models"],
  stem:"Responda Sim ou Não sobre cobrança e contas na AWS.",
  rows:[
    {t:"Com cobrança consolidada no Organizations, o consumo das contas é somado para efeito de faixas de desconto por volume.", a:true,
     e:"É um dos principais benefícios financeiros de consolidar."},
    {t:"Transferência de dados de entrada para a AWS costuma ser cobrada à parte.", a:false,
     e:"Entrada normalmente não é cobrada. A saída para a internet é que costuma pesar na fatura."},
    {t:"Savings Plans e instâncias reservadas podem ser compartilhados entre contas da mesma organização.", a:true,
     e:"O compartilhamento é o padrão e pode ser desativado por conta."},
    {t:"Encerrar uma instância EC2 interrompe a cobrança do volume EBS raiz em todos os casos.", a:false,
     e:"Depende da configuração de exclusão ao encerrar. Volume preservado continua custando."}
  ],
  src:[{t:"AWS Organizations",u:"https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html"}]
}
];
const QUESTIONS_EXTRA = QUESTIONS_AZ2.concat(QUESTIONS_AW2);
