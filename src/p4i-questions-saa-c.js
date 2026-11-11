/* ============================================================
   BANCO DE QUESTÕES — SAA-C03, lote 3 (todos os domínios)
   Conteúdo original escrito a partir dos objetivos públicos.
   Temas que os lotes anteriores não cobriam.
   ============================================================ */
const QUESTIONS_SAA_C = [
/* ---------------- D1 segurança ---------------- */
{
  id:"saa-d1-13", exam:"saa", dom:"d1", lvl:5, type:"single", sec:110, tags:["criptografia-segredos"],
  case:"Um instantâneo do EBS criptografado com a chave padrão aws/ebs precisa ser compartilhado com a conta de recuperação de desastres da empresa. A opção de compartilhar falha.",
  stem:"Qual caminho resolve?",
  opts:[
    {k:"A",t:"Copiar o instantâneo com uma chave gerenciada pelo cliente e compartilhar a cópia e a chave"},
    {k:"B",t:"Editar a política da chave aws/ebs para incluir a conta de recuperação"},
    {k:"C",t:"Tornar o instantâneo público por alguns minutos e copiá-lo na outra conta"},
    {k:"D",t:"Criar um volume sem criptografia a partir do instantâneo e compartilhá-lo com a outra conta"}
  ],
  ans:["A"],
  why:{
    ok:"Instantâneos cifrados com a chave padrão aws/ebs não podem ser compartilhados. A cópia cifrada com uma chave gerenciada pelo cliente pode, desde que a política dessa chave libere o uso para a outra conta.",
    B:"A política de uma chave gerenciada pela AWS não pode ser editada. É exatamente por isso que o compartilhamento falha.",
    C:"Só instantâneos sem criptografia podem ser públicos, e torná-lo público seria um vazamento.",
    D:"Não é possível criar um volume sem criptografia a partir de um instantâneo criptografado. Além disso, volumes não são compartilhados entre contas."
  },
  src:[{t:"Compartilhar instantâneos do EBS",u:"https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modifying-snapshot-permissions.html"}]
},
{
  id:"saa-d1-14", exam:"saa", dom:"d1", lvl:4, type:"single", sec:90, tags:["iam-permissoes"],
  case:"Depois de um incidente, a segurança exige que nenhum bucket da conta possa ficar público, nem por política de bucket nem por ACL, inclusive os buckets que ainda vão ser criados.",
  stem:"Qual controle atende com menos esforço?",
  opts:[
    {k:"A",t:"Bloqueio de Acesso Público do S3 habilitado no nível da conta"},
    {k:"B",t:"Política de bucket negando acesso anônimo, aplicada em cada bucket"},
    {k:"C",t:"Amazon Macie analisando os buckets diariamente"},
    {k:"D",t:"Regra do AWS Config que marca buckets públicos como não conformes"}
  ],
  ans:["A"],
  why:{
    ok:"No nível da conta, o bloqueio vale para todos os buckets, atuais e futuros, e prevalece sobre qualquer política ou ACL que tente abrir acesso.",
    B:"Depende de lembrar de aplicar em cada bucket novo, e alguém com permissão pode trocar a política.",
    C:"O Macie encontra dados sensíveis e exposição, mas não impede que o bucket fique público.",
    D:"O Config detecta depois que aconteceu. A exigência é impedir."
  },
  src:[{t:"Bloqueio de acesso público",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"}]
},
{
  id:"saa-d1-15", exam:"saa", dom:"d1", lvl:5, type:"single", sec:110, tags:["iam-permissoes"],
  case:"Usuários de um aplicativo móvel fazem login com e-mail e senha e precisam enviar fotos direto para o S3, cada um só no próprio prefixo. Não pode haver chave de acesso dentro do aplicativo.",
  stem:"Qual desenho atende?",
  opts:[
    {k:"A",t:"Cognito: grupo de usuários para o login e grupo de identidades com função limitada ao prefixo de cada usuário"},
    {k:"B",t:"Um usuário do IAM para cada usuário do aplicativo, com política restrita ao próprio prefixo"},
    {k:"C",t:"Uma chave de acesso de um usuário do IAM, ofuscada no código e trocada a cada nova versão do aplicativo"},
    {k:"D",t:"Bucket com escrita pública e nomes de arquivo aleatórios"}
  ],
  ans:["A"],
  why:{
    ok:"O grupo de identidades troca o login por credenciais temporárias. A variável de política com o identificador do usuário restringe cada pessoa ao próprio prefixo.",
    B:"Usuários do IAM são para pessoas e sistemas da empresa. Têm limite por conta e não servem para milhões de clientes.",
    C:"Viola a exigência de não ter chave no aplicativo. Chave ofuscada continua extraível e dá a mesma permissão a todos.",
    D:"Escrita pública permite que qualquer um grave qualquer coisa no bucket."
  },
  src:[{t:"Grupos de identidades do Cognito",u:"https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html"}]
},
{
  id:"saa-d1-16", exam:"saa", dom:"d1", lvl:5, type:"yn", sec:120, tags:["criptografia-segredos"],
  stem:"Responda Sim ou Não para cada afirmação sobre o AWS KMS.",
  rows:[
    {t:"Uma chave gerenciada pelo cliente pode ter rotação automática habilitada.", a:true,
     e:"Vale para chaves simétricas com material gerado pelo KMS. A rotação gera novo material de chave periodicamente e mantém o antigo para decifrar o que já foi cifrado."},
    {t:"A política de uma chave gerenciada pela AWS, como aws/s3, pode ser editada.", a:false,
     e:"Chaves gerenciadas pela AWS têm política fixa. Para controlar quem usa a chave, é preciso uma chave gerenciada pelo cliente."},
    {t:"Agendar a exclusão de uma chave a apaga imediatamente.", a:false,
     e:"Existe um período de espera de 7 a 30 dias, durante o qual a exclusão pode ser cancelada. Depois disso, os dados cifrados com ela ficam irrecuperáveis."},
    {t:"Na criptografia de envelope, a chave do KMS cifra a chave de dados, e a chave de dados cifra o conteúdo.", a:true,
     e:"Assim dados grandes são cifrados localmente, e só a pequena chave de dados vai ao KMS."}
  ],
  src:[{t:"Conceitos do AWS KMS",u:"https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html"}]
},
{
  id:"saa-d1-17", exam:"saa", dom:"d1", lvl:4, type:"single", sec:85, tags:["deteccao-auditoria"],
  case:"A segurança quer ser avisada automaticamente quando uma instância passar a se comunicar com endereços conhecidos de mineração de criptomoeda ou quando houver chamadas de API vindas de locais incomuns.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"Amazon GuardDuty"},
    {k:"B",t:"Amazon Inspector"},
    {k:"C",t:"Amazon Macie"},
    {k:"D",t:"AWS Config"}
  ],
  ans:["A"],
  why:{
    ok:"O GuardDuty analisa logs de fluxo, DNS e CloudTrail continuamente, procurando sinais de ameaça como esses.",
    B:"O Inspector procura vulnerabilidades em software e exposição de rede. Não detecta comportamento em andamento.",
    C:"O Macie identifica dados sensíveis no S3.",
    D:"O Config acompanha configuração e conformidade, não tráfego nem ameaças."
  },
  src:[{t:"O que é o GuardDuty",u:"https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html"}]
},
{
  id:"saa-d1-18", exam:"saa", dom:"d1", lvl:5, type:"single", sec:100, tags:["vpc-seguranca"],
  case:"Um site de comércio eletrônico sofre ataques volumétricos de negação de serviço em datas de promoção. A empresa quer resposta de especialistas durante o ataque e reembolso do custo de escala causado por ele.",
  stem:"Qual opção atende?",
  opts:[
    {k:"A",t:"AWS Shield Advanced"},
    {k:"B",t:"AWS Shield Standard"},
    {k:"C",t:"AWS WAF com regra de limite de taxa"},
    {k:"D",t:"AWS Network Firewall"}
  ],
  ans:["A"],
  why:{
    ok:"O Shield Advanced dá acesso à equipe de resposta a DDoS (Shield Response Team) e oferece proteção de custo, em forma de créditos pelo gasto extra causado pelo ataque. Para acionar a equipe, a conta também precisa do plano de suporte Business ou Enterprise.",
    B:"O Standard é automático e gratuito contra ataques comuns, mas não tem equipe de resposta nem proteção de custo.",
    C:"O WAF ajuda contra ataques na camada de aplicação, mas não traz nenhum dos dois benefícios pedidos.",
    D:"O Network Firewall filtra tráfego da VPC. Não é proteção contra negação de serviço em larga escala."
  },
  src:[{t:"Shield Advanced",u:"https://docs.aws.amazon.com/waf/latest/developerguide/ddos-advanced-summary.html"}]
},
{
  id:"saa-d1-19", exam:"saa", dom:"d1", lvl:5, type:"multi", sec:110, tags:["vpc-seguranca","iam-permissoes"],
  stem:"Um bucket só pode ser acessado a partir de instâncias de uma VPC específica, sem passar pela internet. Quais medidas, juntas, garantem isso? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Ponto de extremidade de gateway do S3 na VPC, associado às tabelas de rotas das sub-redes"},
    {k:"B",t:"Política do bucket negando qualquer acesso cujo aws:SourceVpce seja diferente do identificador do ponto de extremidade"},
    {k:"C",t:"Grupo de segurança associado ao bucket"},
    {k:"D",t:"ACL de rede liberando apenas os endereços do S3"},
    {k:"E",t:"Gateway da NAT nas sub-redes privadas"}
  ],
  ans:["A","B"],
  why:{
    ok:"O ponto de extremidade dá o caminho privado até o S3, e a negação na política do bucket fecha todas as outras origens, inclusive acesso com credenciais válidas vindo de fora.",
    C:"Bucket não tem grupo de segurança. Grupos de segurança se aplicam a interfaces de rede.",
    D:"ACL de rede controla a sub-rede, não quem acessa o bucket a partir de outros lugares.",
    E:"A NAT leva o tráfego ao endereço público do S3, em vez de um caminho privado, e não impede acesso ao bucket vindo de outras origens."
  },
  src:[{t:"Políticas de bucket com pontos de extremidade da VPC",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies-vpc-endpoint.html"}]
},
{
  id:"saa-d1-20", exam:"saa", dom:"d1", lvl:4, type:"single", sec:85, tags:["criptografia-segredos"],
  case:"Um certificado foi solicitado no AWS Certificate Manager na região de São Paulo para o domínio do site. Ao configurar uma distribuição do CloudFront, ele não aparece na lista.",
  stem:"Qual é a causa?",
  opts:[
    {k:"A",t:"O CloudFront só usa certificados do ACM da região Norte da Virgínia (us-east-1)"},
    {k:"B",t:"Certificados do ACM não podem ser usados no CloudFront"},
    {k:"C",t:"O certificado precisa ser exportado do ACM e importado no repositório de certificados do IAM"},
    {k:"D",t:"A distribuição precisa estar na mesma região do certificado"}
  ],
  ans:["A"],
  why:{
    ok:"O CloudFront é um serviço global que lê certificados do ACM em us-east-1. Basta solicitar ou importar o certificado lá.",
    B:"Podem, desde que estejam em us-east-1.",
    C:"Desnecessário. O CloudFront usa o ACM diretamente, desde que o certificado esteja em us-east-1.",
    D:"Distribuições do CloudFront não pertencem a uma região."
  },
  src:[{t:"Regiões do ACM",u:"https://docs.aws.amazon.com/acm/latest/userguide/acm-regions.html"}]
},
{
  id:"saa-d1-21", exam:"saa", dom:"d1", lvl:4, type:"order", sec:90, tags:["vpc-seguranca"],
  stem:"Uma requisição vinda da internet chega a uma instância numa sub-rede pública. Ordene os controles que ela atravessa, do PRIMEIRO ao ÚLTIMO.",
  items:[
    {t:"Gateway de internet da VPC"},
    {t:"ACL de rede da sub-rede"},
    {t:"Grupo de segurança da interface de rede"},
    {t:"Firewall do sistema operacional da instância"}
  ],
  e:"O gateway de internet é a porta da VPC. A ACL de rede filtra na borda da sub-rede, sem estado. O grupo de segurança filtra na interface da instância, com estado. Por último vem o sistema operacional. Saber essa ordem ajuda a descobrir onde o tráfego está sendo barrado.",
  src:[{t:"Segurança de infraestrutura na VPC",u:"https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html"}]
},
/* ---------------- D2 resiliência ---------------- */
{
  id:"saa-d2-11", exam:"saa", dom:"d2", lvl:4, type:"single", sec:90, tags:["alta-disponibilidade"],
  case:"Quando a aplicação principal ficar fora do ar, os usuários devem ser enviados automaticamente para uma página estática de manutenção num bucket do S3.",
  stem:"Qual política de roteamento do Route 53 usar?",
  opts:[
    {k:"A",t:"Failover, com verificação de saúde no registro primário"},
    {k:"B",t:"Ponderada, com 50 para a aplicação e 50 para a página"},
    {k:"C",t:"Por latência"},
    {k:"D",t:"Por geolocalização"}
  ],
  ans:["A"],
  why:{
    ok:"A política de failover responde com o primário enquanto a verificação de saúde passa, e com o secundário quando falha.",
    B:"Mandaria metade dos usuários para a página de manutenção mesmo com a aplicação no ar.",
    C:"Latência escolhe a região mais rápida. Não trata um destino como reserva.",
    D:"Geolocalização decide pela origem do usuário, não pela saúde do destino."
  },
  src:[{t:"Failover no Route 53",u:"https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-configuring.html"}]
},
{
  id:"saa-d2-12", exam:"saa", dom:"d2", lvl:5, type:"single", sec:105, tags:["desacoplamento"],
  case:"Pedidos de um mesmo cliente precisam ser processados na ordem em que chegaram e uma única vez. Pedidos de clientes diferentes podem ser processados em paralelo, por vários consumidores.",
  stem:"Qual desenho atende?",
  opts:[
    {k:"A",t:"Fila FIFO do SQS com o identificador do cliente como ID do grupo de mensagens"},
    {k:"B",t:"Fila FIFO do SQS com o mesmo ID de grupo de mensagens para todos os pedidos"},
    {k:"C",t:"Fila padrão do SQS com tempo limite de visibilidade maior e vários consumidores"},
    {k:"D",t:"Tópico padrão do SNS com um assinante por consumidor"}
  ],
  ans:["A"],
  why:{
    ok:"A FIFO garante ordem dentro de cada grupo e remove duplicatas. Um grupo por cliente mantém a ordem dele e permite que grupos diferentes sejam consumidos em paralelo.",
    B:"Um grupo só serializa todos os pedidos e elimina o paralelismo.",
    C:"A fila padrão não garante ordem e pode entregar mais de uma vez.",
    D:"O SNS padrão entrega a todos os assinantes, sem ordem garantida. Cada pedido seria processado várias vezes."
  },
  src:[{t:"Filas FIFO",u:"https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html"}]
},
{
  id:"saa-d2-13", exam:"saa", dom:"d2", lvl:5, type:"single", sec:100, tags:["alta-disponibilidade"],
  case:"Uma aplicação precisa de pelo menos 4 instâncias saudáveis o tempo todo, mesmo se uma zona de disponibilidade inteira cair. O grupo do Auto Scaling usa três zonas e distribui as instâncias igualmente.",
  stem:"Qual é a capacidade mínima do grupo?",
  opts:[
    {k:"A",t:"4 instâncias"},
    {k:"B",t:"6 instâncias"},
    {k:"C",t:"8 instâncias"},
    {k:"D",t:"12 instâncias"}
  ],
  ans:["B"],
  why:{
    ok:"Com 6 em três zonas, ficam 2 por zona. Se uma cai, sobram 4. É o menor número que garante o mínimo sem esperar o Auto Scaling repor.",
    A:"Com 4, uma zona tem 2. Se ela cair, sobram 2.",
    C:"Atende, mas com 2 instâncias além do necessário.",
    D:"Atende com o dobro do necessário. É gasto sem motivo."
  },
  src:[{t:"Benefícios do Auto Scaling",u:"https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-benefits.html"}]
},
{
  id:"saa-d2-14", exam:"saa", dom:"d2", lvl:4, type:"yn", sec:110, tags:["dados-resilientes"],
  stem:"Responda Sim ou Não para cada afirmação sobre o Amazon RDS (instância Multi-AZ com uma réplica em espera).",
  rows:[
    {t:"A réplica em espera de uma instância Multi-AZ atende consultas de leitura.", a:false,
     e:"Na implantação com uma espera, ela só existe para failover. Para leitura, use réplicas de leitura ou um cluster Multi-AZ com duas esperas legíveis."},
    {t:"No failover, o endpoint continua o mesmo e o registro DNS passa a apontar para a nova primária.", a:true,
     e:"Por isso a aplicação não precisa trocar de endereço. Só precisa reconectar."},
    {t:"Réplicas de leitura recebem os dados por replicação assíncrona.", a:true,
     e:"Por isso podem ficar um pouco atrás da primária, e isso precisa ser considerado nas leituras."},
    {t:"Com Multi-AZ habilitado, os backups automatizados se tornam desnecessários.", a:false,
     e:"Multi-AZ protege contra falha de infraestrutura. Uma exclusão por engano é replicada na hora. Só o backup permite voltar no tempo."}
  ],
  src:[{t:"Implantações Multi-AZ",u:"https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html"}]
},
{
  id:"saa-d2-15", exam:"saa", dom:"d2", lvl:4, type:"single", sec:95, tags:["desacoplamento"],
  case:"Um processo de crédito tem seis etapas em Lambda. Algumas precisam de nova tentativa com espera crescente, uma depende de aprovação humana que pode levar dois dias, e a equipe quer ver em que etapa cada pedido está.",
  stem:"Qual serviço coordena isso?",
  opts:[
    {k:"A",t:"AWS Step Functions"},
    {k:"B",t:"Funções Lambda chamando a próxima diretamente"},
    {k:"C",t:"Uma fila do SQS entre cada etapa"},
    {k:"D",t:"Regras do EventBridge em sequência"}
  ],
  ans:["A"],
  why:{
    ok:"O Step Functions modela o fluxo, tem novas tentativas configuráveis, espera por retorno externo com token e mostra o estado de cada execução.",
    B:"Cada invocação da Lambda dura no máximo 15 minutos, então uma cadeia de chamadas diretas não espera dois dias. Além disso, o fluxo fica espalhado pelo código, sem visão do estado.",
    C:"Desacopla, mas não dá visão do fluxo nem trata a espera pela aprovação de forma natural.",
    D:"O EventBridge roteia eventos, mas não guarda o estado de um fluxo de várias etapas."
  },
  src:[{t:"O que é o Step Functions",u:"https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html"}]
},
{
  id:"saa-d2-16", exam:"saa", dom:"d2", lvl:5, type:"single", sec:95, tags:["dados-resilientes"],
  case:"A replicação entre regiões foi configurada num bucket com dois anos de dados. Os objetos novos aparecem no destino, mas os antigos não.",
  stem:"Como levar os objetos existentes?",
  opts:[
    {k:"A",t:"Usar o S3 Batch Replication"},
    {k:"B",t:"Desabilitar e reabilitar o versionamento"},
    {k:"C",t:"Aguardar, porque a replicação processa os antigos em segundo plano"},
    {k:"D",t:"Criar uma regra de ciclo de vida que mova os objetos para o destino"}
  ],
  ans:["A"],
  why:{
    ok:"A regra de replicação só vale para objetos gravados depois dela. O Batch Replication replica os objetos que já existiam.",
    B:"O versionamento não pode ser desabilitado, só suspenso, e isso não replica nada.",
    C:"Os antigos não entram na fila por conta própria.",
    D:"O ciclo de vida muda classe ou expira objetos. Não copia para outro bucket."
  },
  src:[{t:"Replicar objetos existentes",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-batch-replication-batch.html"}]
},
{
  id:"saa-d2-17", exam:"saa", dom:"d2", lvl:5, type:"multi", sec:105, tags:["desacoplamento"],
  stem:"Uma Lambda recebe eventos de forma assíncrona e às vezes falha. Nenhum evento pode se perder, e o mesmo evento não pode gerar duas cobranças. Quais medidas atendem? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Configurar um destino em caso de falha, ou uma fila de mensagens mortas, para os eventos que esgotarem as tentativas"},
    {k:"B",t:"Tornar o processamento idempotente, por exemplo registrando o ID do evento já processado"},
    {k:"C",t:"Desligar as novas tentativas da função"},
    {k:"D",t:"Aumentar a memória da função"},
    {k:"E",t:"Colocar a função dentro de uma VPC"}
  ],
  ans:["A","B"],
  why:{
    ok:"Depois das novas tentativas, o evento vai para o destino de falha e não some. Como a invocação assíncrona pode repetir um evento, o código precisa reconhecer o que já fez.",
    C:"Sem novas tentativas, falhas passageiras viram perda ou dependem só do destino de falha.",
    D:"Memória pode ajudar no desempenho, mas não evita perda nem duplicidade.",
    E:"VPC muda o acesso de rede. Não tem relação com perda de evento."
  },
  src:[{t:"Invocação assíncrona",u:"https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html"}]
},
{
  id:"saa-d2-18", exam:"saa", dom:"d2", lvl:5, type:"single", sec:100, tags:["alta-disponibilidade"],
  case:"Um jogo usa UDP e roda em duas regiões. Os clientes precisam de dois IPs fixos para todo o mundo, e o tráfego deve mudar para a outra região em segundos se uma falhar, sem depender do cache de DNS dos clientes.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"AWS Global Accelerator"},
    {k:"B",t:"Amazon CloudFront"},
    {k:"C",t:"Route 53 com roteamento de failover"},
    {k:"D",t:"Um Network Load Balancer em cada região"}
  ],
  ans:["A"],
  why:{
    ok:"O Global Accelerator oferece IPs anycast fixos, aceita TCP e UDP e redireciona entre regiões pela saúde dos destinos, sem mudar o DNS.",
    B:"O CloudFront é para HTTP e HTTPS, não para UDP de jogo.",
    C:"O failover por DNS depende de os clientes respeitarem o TTL, o que pode levar minutos.",
    D:"Cada NLB é regional. Seriam IPs diferentes por região, sem failover entre elas."
  },
  src:[{t:"O que é o Global Accelerator",u:"https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html"}]
},
/* ---------------- D3 desempenho ---------------- */
{
  id:"saa-d3-11", exam:"saa", dom:"d3", lvl:5, type:"single", sec:100, tags:["dados-analise"],
  case:"Eventos de clique de um site chegam a milhares por segundo. Três equipes precisam ler o mesmo fluxo de forma independente, e uma delas quer reprocessar os últimos sete dias quando corrigir um erro.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"Amazon Kinesis Data Streams com retenção estendida"},
    {k:"B",t:"Uma fila padrão do SQS"},
    {k:"C",t:"Amazon Data Firehose entregando ao S3"},
    {k:"D",t:"Um tópico do SNS"}
  ],
  ans:["A"],
  why:{
    ok:"No Data Streams cada consumidor lê no próprio ritmo, os registros ficam disponíveis durante a retenção e podem ser lidos de novo a partir de um ponto no tempo.",
    B:"Mensagem consumida e excluída sai da fila. Três equipes não leem a mesma mensagem, e não há como reprocessar.",
    C:"O Firehose entrega a um destino. Não oferece consumidores independentes sobre o fluxo.",
    D:"O SNS empurra a mensagem e não guarda nada para reprocessar."
  },
  src:[{t:"Kinesis Data Streams",u:"https://docs.aws.amazon.com/streams/latest/dev/introduction.html"}]
},
{
  id:"saa-d3-12", exam:"saa", dom:"d3", lvl:4, type:"single", sec:90, tags:["computacao-armazenamento"],
  case:"Usuários na Ásia e na Europa enviam arquivos de 2 GB para um bucket na Virgínia do Norte, e o envio é lento e falha com frequência.",
  stem:"Qual combinação melhora o envio?",
  opts:[
    {k:"A",t:"S3 Transfer Acceleration com upload em várias partes"},
    {k:"B",t:"Distribuição do CloudFront com cache longo"},
    {k:"C",t:"Classe S3 One Zone-IA no bucket"},
    {k:"D",t:"Criar mais prefixos no bucket"}
  ],
  ans:["A"],
  why:{
    ok:"O Transfer Acceleration entra pelo ponto de presença mais próximo e segue pela rede da AWS. O envio em partes manda pedaços em paralelo e repete só a parte que falhar.",
    B:"Cache só acelera a leitura de conteúdo repetido. Não resolve o envio lento e as falhas de arquivos grandes e novos.",
    C:"Classe de armazenamento muda custo e durabilidade, não velocidade de envio.",
    D:"Prefixos ajudam com muitas requisições por segundo, não com distância e arquivo grande."
  },
  src:[{t:"Transfer Acceleration",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html"}]
},
{
  id:"saa-d3-13", exam:"saa", dom:"d3", lvl:5, type:"single", sec:100, tags:["dados-analise"],
  case:"Consultas do Athena sobre logs em CSV no S3 estão lentas e caras. Quase toda consulta filtra por data e usa poucas das 60 colunas.",
  stem:"Qual mudança traz o maior ganho?",
  opts:[
    {k:"A",t:"Converter os dados para Parquet e particionar por data"},
    {k:"B",t:"Compactar os CSV em gzip, mantendo o resto"},
    {k:"C",t:"Carregar os logs num banco RDS"},
    {k:"D",t:"Criar mais grupos de trabalho no Athena"}
  ],
  ans:["A"],
  why:{
    ok:"O Athena cobra por dado lido. A partição por data faz pular o que está fora do filtro, e o formato em colunas lê só as colunas usadas. Juntas, as duas cortam o volume lido.",
    B:"Ajuda um pouco, mas o Athena ainda precisa ler todas as colunas e todas as datas.",
    C:"Troca uma consulta sob demanda por um banco permanente, mais caro e com trabalho de carga.",
    D:"Grupos de trabalho organizam e limitam o uso. Não deixam a consulta mais rápida."
  },
  src:[{t:"Desempenho no Athena",u:"https://docs.aws.amazon.com/athena/latest/ug/performance-tuning.html"}]
},
{
  id:"saa-d3-14", exam:"saa", dom:"d3", lvl:5, type:"single", sec:105, tags:["banco-cache"],
  case:"Uma tabela do DynamoDB usa a data do dia como chave de partição. As gravações sofrem limitação, embora o consumo total esteja bem abaixo da capacidade provisionada.",
  stem:"Qual é a causa e a correção?",
  opts:[
    {k:"A",t:"Partição quente. Espalhar as gravações acrescentando um sufixo à data na chave"},
    {k:"B",t:"Capacidade insuficiente. Dobrar as unidades de capacidade de gravação provisionadas"},
    {k:"C",t:"Falta de cache. Colocar o DAX na frente da tabela"},
    {k:"D",t:"Modo errado. Mudar para sob demanda, mantendo a chave"}
  ],
  ans:["A"],
  why:{
    ok:"Todas as gravações do dia caem na mesma chave, e cada partição tem limite próprio. Espalhar as gravações por muitas chaves usa a capacidade da tabela inteira.",
    B:"A capacidade total já sobra. O limite atingido é o de uma partição.",
    C:"O DAX acelera leituras. Não alivia gravação.",
    D:"O modo sob demanda continua sujeito ao limite por partição, então a chave concentrada segue sendo gargalo."
  },
  src:[{t:"Projeto de chave de partição",u:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html"}]
},
{
  id:"saa-d3-15", exam:"saa", dom:"d3", lvl:4, type:"yn", sec:110, tags:["computacao-armazenamento"],
  stem:"Responda Sim ou Não para cada afirmação sobre armazenamento em bloco no EC2.",
  rows:[
    {t:"Volumes gp3 permitem provisionar IOPS e taxa de transferência independentemente do tamanho.", a:true,
     e:"É a principal diferença para o gp2, em que o desempenho cresce com o tamanho do volume. No gp3 existem apenas proporções máximas, como IOPS por GiB."},
    {t:"Um volume st1 pode ser usado como volume de inicialização.", a:false,
     e:"Os volumes HDD, st1 e sc1, não podem ser de inicialização."},
    {t:"Dados no armazenamento de instância sobrevivem à parada e ao início da instância.", a:false,
     e:"O armazenamento de instância é efêmero e se perde quando a instância para, hiberna ou é encerrada."},
    {t:"Volumes io2 são indicados para bancos que precisam de IOPS alto e constante.", a:true,
     e:"O io2 oferece IOPS provisionado alto, com durabilidade maior que os demais tipos."}
  ],
  src:[{t:"Tipos de volume do EBS",u:"https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"}]
},
{
  id:"saa-d3-16", exam:"saa", dom:"d3", lvl:4, type:"single", sec:95, tags:["banco-cache"],
  case:"Um cluster do Aurora tem picos de leitura imprevisíveis durante o dia. A equipe quer adicionar e remover réplicas automaticamente e espalhar as leituras entre elas sem mudar a aplicação a cada mudança.",
  stem:"O que configurar?",
  opts:[
    {k:"A",t:"Aurora Auto Scaling de réplicas, com leituras pelo endpoint de leitura"},
    {k:"B",t:"Uma classe de instância maior na primária, dimensionada para o pico de leitura"},
    {k:"C",t:"Leituras pelo endpoint do cluster"},
    {k:"D",t:"Uma réplica em espera em outra zona"}
  ],
  ans:["A"],
  why:{
    ok:"O Auto Scaling ajusta o número de réplicas por métrica, e o endpoint de leitura distribui as conexões entre as réplicas que existirem no momento.",
    B:"Escala vertical tem teto, custa o dia inteiro e não acompanha o pico.",
    C:"O endpoint do cluster aponta para a primária. Mandar leitura para ele concentra a carga onde ela já pesa.",
    D:"No Aurora, réplicas já servem de failover. Uma réplica a mais não resolve a escala de leitura."
  },
  src:[{t:"Aurora Auto Scaling",u:"https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Integrating.AutoScaling.html"}]
},
{
  id:"saa-d3-17", exam:"saa", dom:"d3", lvl:5, type:"multi", sec:105, tags:["containers-serverless"],
  stem:"Uma API em Lambda tem latência alta nas primeiras requisições após períodos sem tráfego. Quais medidas reduzem esse efeito? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Configurar concorrência provisionada para o horário de uso"},
    {k:"B",t:"Aumentar a memória, que aumenta também a CPU disponível na inicialização"},
    {k:"C",t:"Configurar concorrência reservada"},
    {k:"D",t:"Aumentar o tempo limite da função"},
    {k:"E",t:"Adicionar uma fila de mensagens mortas"}
  ],
  ans:["A","B"],
  why:{
    ok:"A concorrência provisionada mantém ambientes já inicializados. Mais memória traz mais CPU, o que encurta a inicialização e a execução.",
    C:"A concorrência reservada garante e limita capacidade, mas não deixa nenhum ambiente aquecido.",
    D:"O tempo limite só define quanto a função pode durar. Não acelera nada.",
    E:"A fila trata falhas de invocação assíncrona. Não tem efeito na latência."
  },
  src:[{t:"Concorrência provisionada",u:"https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html"}]
},
/* ---------------- D4 custo ---------------- */
{
  id:"saa-d4-09", exam:"saa", dom:"d4", lvl:5, type:"single", sec:100, tags:["custo-computacao"],
  case:"A empresa roda cargas estáveis em EC2, Fargate e Lambda, e espera migrar parte do EC2 para Fargate no próximo ano. Quer desconto por compromisso de uso que acompanhe essa migração.",
  stem:"Qual opção de compra atende?",
  opts:[
    {k:"A",t:"Compute Savings Plans"},
    {k:"B",t:"EC2 Instance Savings Plans"},
    {k:"C",t:"Instâncias Reservadas Standard"},
    {k:"D",t:"Instâncias Spot"}
  ],
  ans:["A"],
  why:{
    ok:"O Compute Savings Plans aplica o desconto a EC2, Fargate e Lambda, em qualquer família e região, então acompanha a migração.",
    B:"Vale só para EC2, numa família e região. A parte migrada perderia o desconto.",
    C:"Cobre só EC2 numa configuração fixa.",
    D:"Spot não é compromisso e pode ser interrompido. Não serve para carga estável que não tolera parada."
  },
  src:[{t:"O que são Savings Plans",u:"https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html"}]
},
{
  id:"saa-d4-10", exam:"saa", dom:"d4", lvl:5, type:"single", sec:100, tags:["custo-banco-rede","alta-disponibilidade"],
  case:"Uma VPC tem sub-redes privadas em três zonas, e todas usam um único gateway da NAT na zona A. A conta mostra cobrança alta de tráfego entre zonas, e uma falha na zona A derruba a saída de todas.",
  stem:"Qual mudança resolve as duas questões?",
  opts:[
    {k:"A",t:"Um gateway da NAT por zona, cada sub-rede roteando para o da própria zona"},
    {k:"B",t:"Trocar o gateway por uma instância NAT maior"},
    {k:"C",t:"Associar o gateway de internet às sub-redes privadas e remover a rota para a NAT"},
    {k:"D",t:"Aumentar a largura de banda do gateway da NAT"}
  ],
  ans:["A"],
  why:{
    ok:"Cada zona sai pelo próprio gateway, o que elimina o tráfego entre zonas e remove o ponto único de falha. Hoje existe também o gateway da NAT regional, que se expande sozinho pelas zonas com carga e chega ao mesmo resultado.",
    B:"Continua sendo um ponto único numa só zona, e ainda passa a exigir manutenção.",
    C:"Rota para o gateway de internet transforma a sub-rede em pública, com instâncias expostas.",
    D:"A banda do gateway da NAT escala sozinha e não é o problema. O custo vem do caminho entre zonas, e a falha vem da zona única."
  },
  src:[{t:"Gateways da NAT",u:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html"}]
},
{
  id:"saa-d4-11", exam:"saa", dom:"d4", lvl:4, type:"single", sec:90, tags:["custo-armazenamento"],
  case:"Instantâneos mensais do EBS precisam ser guardados por sete anos por exigência legal. Quase nunca são restaurados, e uma restauração pode levar até três dias.",
  stem:"Qual opção tem o menor custo?",
  opts:[
    {k:"A",t:"Mover os instantâneos para o nível de arquivamento de instantâneos do EBS"},
    {k:"B",t:"Manter os instantâneos no nível padrão"},
    {k:"C",t:"Copiar os instantâneos para o S3 Glacier Deep Archive com uma regra de ciclo de vida"},
    {k:"D",t:"Manter volumes parados com os dados"}
  ],
  ans:["A"],
  why:{
    ok:"O arquivamento guarda o instantâneo completo a um custo bem menor, e a restauração leva até 72 horas, dentro do prazo aceito.",
    B:"Funciona, mas é o nível mais caro para algo que quase nunca é lido.",
    C:"Instantâneos não aparecem como objetos num bucket seu, então uma regra de ciclo de vida não os alcança.",
    D:"Volume parado cobra pelo tamanho provisionado. É a opção mais cara."
  },
  src:[{t:"Arquivamento de instantâneos",u:"https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-archive.html"}]
},
{
  id:"saa-d4-12", exam:"saa", dom:"d4", lvl:5, type:"yn", sec:120, tags:["custo-armazenamento"],
  stem:"Responda Sim ou Não para cada afirmação sobre classes e ciclo de vida do S3.",
  rows:[
    {t:"Uma regra de ciclo de vida só move um objeto do S3 Standard para o Standard-IA depois de pelo menos 30 dias.", a:true,
     e:"A transição para Standard-IA e One Zone-IA exige pelo menos 30 dias no Standard."},
    {t:"No Standard-IA, um objeto de 40 KB é cobrado como se tivesse 128 KB.", a:true,
     e:"Existe tamanho mínimo de cobrança de 128 KB. Por isso, por padrão, o ciclo de vida não move objetos menores que 128 KB."},
    {t:"O Glacier Deep Archive tem permanência mínima de 90 dias.", a:false,
     e:"São 180 dias. Os 90 dias valem para o Glacier Flexible Retrieval e o Glacier Instant Retrieval."},
    {t:"Uma regra de ciclo de vida pode expirar versões não atuais de objetos.", a:true,
     e:"Num bucket versionado, esquecer as versões antigas é uma causa comum de custo crescendo sem explicação."}
  ],
  src:[{t:"Transições do ciclo de vida",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html"}]
},
{
  id:"saa-d4-13", exam:"saa", dom:"d4", lvl:4, type:"single", sec:90, tags:["custo-banco-rede"],
  case:"Uma tabela do DynamoDB recebe tráfego imprevisível: dias inteiros sem uso e picos curtos e intensos depois de campanhas. Hoje ela usa capacidade provisionada dimensionada para o pico.",
  stem:"Qual mudança reduz o custo?",
  opts:[
    {k:"A",t:"Mudar a tabela para o modo de capacidade sob demanda"},
    {k:"B",t:"Comprar capacidade reservada para o valor de pico"},
    {k:"C",t:"Adicionar o DAX na frente da tabela"},
    {k:"D",t:"Criar índices secundários globais"}
  ],
  ans:["A"],
  why:{
    ok:"No sob demanda, a cobrança é por requisição. Dias sem uso custam quase nada e o pico é absorvido sem planejamento.",
    B:"Reservar o pico paga caro pelos dias parados.",
    C:"O DAX é um custo a mais, cobrado por hora, e só ajuda em leitura repetida.",
    D:"Índices adicionam custo de armazenamento e de gravação."
  },
  src:[{t:"Modo sob demanda",u:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/on-demand-capacity-mode.html"}]
},
{
  id:"saa-d4-14", exam:"saa", dom:"d4", lvl:5, type:"multi", sec:105, tags:["custo-banco-rede"],
  stem:"Um site serve arquivos estáticos de um bucket diretamente aos usuários, e a maior parte da conta é transferência de dados para a internet. Quais medidas reduzem esse custo? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Servir os arquivos pelo CloudFront, com o bucket como origem"},
    {k:"B",t:"Habilitar a compressão automática no CloudFront"},
    {k:"C",t:"Habilitar o S3 Transfer Acceleration"},
    {k:"D",t:"Replicar o bucket para todas as regiões"},
    {k:"E",t:"Ativar a opção em que o solicitante paga"}
  ],
  ans:["A","B"],
  why:{
    ok:"A transferência do S3 para o CloudFront não é cobrada, e a saída pelo CloudFront costuma custar menos, ainda com cache. Comprimir reduz os bytes enviados.",
    C:"O Transfer Acceleration é cobrado à parte e acelera envio para o bucket. Aumenta o custo.",
    D:"Multiplica armazenamento e acrescenta custo de replicação.",
    E:"Só funciona quando quem baixa tem conta na AWS e se identifica. Visitantes anônimos de um site não pagam."
  },
  src:[{t:"Compressão no CloudFront",u:"https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html"}]
}
];
QUESTIONS_SAA.push(...QUESTIONS_SAA_C);
