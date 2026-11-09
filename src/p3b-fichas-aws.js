/* ============================================================
   FICHAS DE ESTUDO — AWS (Cloud Practitioner)
   ============================================================ */
const FICHAS_AWS = [
{
  id:"f-aw-wa", exam:"clf", dom:"d1", mins:5, concept:"well-architected",
  title:"Well-Architected, benefícios e as estratégias de migração",
  lead:"O primeiro domínio é conceitual, mas tem duas listas que caem direto: os pilares do Well-Architected e as estratégias de migração.",
  blocks:[
    {t:"h", x:"Os seis pilares"},
    {t:"table", head:["Pilar","Pergunta que ele faz"], rows:[
      ["Excelência operacional","Consigo operar, observar e melhorar continuamente? Tenho runbook e métrica?"],
      ["Segurança","Protejo identidade, dados e detecto incidente?"],
      ["Confiabilidade","A carga se recupera de falha e escala para atender a demanda?"],
      ["Eficiência de desempenho","Escolhi e dimensionei os recursos certos?"],
      ["Otimização de custos","Pago só pelo que preciso e consigo atribuir o gasto?"],
      ["Sustentabilidade","Reduzo o impacto ambiental da carga?"]
    ]},
    {t:"h", x:"As estratégias de migração"},
    {t:"table", head:["Estratégia","O que é","Exemplo"], rows:[
      ["Rehost","Mover sem alterar, lift and shift","Servidor físico vira instância EC2"],
      ["Replatform","Mover trocando um componente por serviço gerenciado","Banco autogerenciado vira Amazon RDS"],
      ["Repurchase","Trocar o produto por um SaaS","CRM próprio vira assinatura de SaaS"],
      ["Refactor","Reescrever como aplicação nativa de nuvem","Monólito vira funções e filas"],
      ["Retire","Desligar o que não é mais usado","Sistema sem usuário há dois anos"],
      ["Retain","Manter onde está, por ora","Sistema que será substituído no ano que vem"]
    ]},
    {t:"h", x:"Benefícios citados pela AWS"},
    {t:"p", x:"Trocar investimento por despesa variável, parar de dimensionar para o pico, ganhar velocidade e agilidade, deixar de gastar com operação de datacenter, aproveitar economias de escala e ir global em minutos."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Sem reescrever, mas tirando a administração do banco da equipe","Replatform"],
      ["Prazo curto, nada pode mudar na aplicação","Rehost"],
      ["Sem métrica de negócio e sem runbook","Falha de excelência operacional"],
      ["Gasto não atribuído por equipe","Falha de otimização de custos"]
    ]},
    {t:"trap", x:"Refactor é a estratégia mais cara e demorada. Se o enunciado dá prazo curto e proíbe reescrever, refactor está eliminado mesmo quando parece a solução mais elegante."},
    {t:"case", q:"ERP em servidores físicos com MySQL autogerenciado. Sair do datacenter em quatro meses, sem reescrever, mas tirando da equipe o trabalho de administrar o banco.",
      a:"Replatform. A aplicação vai para EC2 sem alteração e o MySQL vira RDS. Rehost puro deixaria o banco autogerenciado e falharia no segundo requisito, que está na segunda metade do enunciado."}
  ],
  check:["Citar os seis pilares","Diferenciar rehost de replatform com um exemplo","Dizer qual pilar cobre runbook e observabilidade"],
  src:[{t:"AWS Well-Architected", u:"https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html"},
       {t:"Estratégias de migração", u:"https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html"}]
},
{
  id:"f-aw-global", exam:"clf", dom:"d1", mins:4, concept:"infra-global",
  title:"Infraestrutura global: região, zona, edge e Local Zone",
  lead:"Quatro camadas com funções diferentes. Confundir ponto de presença com região é o erro mais comum do domínio.",
  blocks:[
    {t:"h", x:"As camadas"},
    {t:"table", head:["Camada","O que é","Resolve"], rows:[
      ["Região","Área geográfica com várias zonas","Onde o dado reside, latência regional, conformidade"],
      ["Zona de disponibilidade","Um ou mais datacenters isolados dentro da região","Alta disponibilidade dentro da região"],
      ["Ponto de presença (edge)","Cache do CloudFront e borda do Route 53","Latência de entrega de conteúdo ao usuário final"],
      ["Local Zone","Computação e armazenamento perto de uma grande cidade","Latência de milissegundo para aplicação, não só conteúdo"],
      ["Outposts","Hardware da AWS dentro do seu datacenter","Exigência de permanecer no local"],
      ["Wavelength","Infraestrutura dentro da rede de operadora móvel","Aplicação de latência ultrabaixa em 5G"]
    ]},
    {t:"h", x:"Como escolher uma região"},
    {t:"p", x:"Quatro fatores: conformidade e soberania de dados, proximidade dos usuários, disponibilidade do serviço naquela região e preço, que varia entre regiões."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Usuário distante reclamando de download lento de arquivo estático","CloudFront com pontos de presença"],
      ["Sobreviver à queda de um datacenter","Distribuir entre várias zonas"],
      ["Sobreviver à perda da região inteira","Arquitetura em mais de uma região"],
      ["Latência de milissegundo para jogo ou streaming numa cidade específica","Local Zone"],
      ["Regulação exige o dado dentro do país","Escolher a região local"]
    ]},
    {t:"trap", x:"Ponto de presença não executa a sua aplicação: ele guarda cópia de conteúdo. Se a alternativa sugere rodar a aplicação no edge para resolver latência de processamento, desconfie."},
    {t:"case", q:"Usuários na América do Sul reclamam de lentidão ao baixar imagens e vídeos de um bucket em us-east-1. O conteúdo é estático e igual para todos.",
      a:"CloudFront usando pontos de presença. O problema é distância de rede para conteúdo repetido, e cache na borda resolve. Adicionar zona não aproxima nada do usuário, e Auto Scaling resolve falta de capacidade, que não é o caso."}
  ],
  check:["Dizer a diferença entre edge location e Local Zone","Listar os quatro fatores de escolha de região","Explicar por que mais zonas não resolve latência global"],
  src:[{t:"Infraestrutura global da AWS", u:"https://aws.amazon.com/about-aws/global-infrastructure/"}]
},
{
  id:"f-aw-shared", exam:"clf", dom:"d2", mins:4, concept:"shared-responsibility",
  title:"Responsabilidade compartilhada",
  lead:"A AWS resume em duas frases: segurança DA nuvem é dela, segurança NA nuvem é sua. O exame cobra onde exatamente fica a linha em cada serviço.",
  blocks:[
    {t:"h", x:"A divisão"},
    {t:"table", head:["Lado","Cobre"], rows:[
      ["AWS: segurança da nuvem","Datacenter, energia, rede física, hardware, virtualização, descarte de mídia, e o software dos serviços gerenciados"],
      ["Cliente: segurança na nuvem","Dados, classificação, identidades e permissões, configuração de rede e de serviço, criptografia, patch do que você administra"]
    ]},
    {t:"h", x:"Onde a linha fica em cada serviço"},
    {t:"table", head:["Serviço","AWS cuida de","Você cuida de"], rows:[
      ["EC2","Hipervisor, host, rede física","Sistema operacional convidado, patch, firewall, aplicação, dados"],
      ["RDS","Sistema operacional, patch do motor, backup automático","Usuários do banco, grupos de segurança, criptografia, dados"],
      ["S3","Durabilidade, infraestrutura","Política do bucket, bloqueio de acesso público, criptografia, dados"],
      ["Lambda","Sistema operacional e runtime","Código, permissões da função, dados"]
    ]},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Patch do sistema operacional em EC2","Cliente"],
      ["Patch do motor de banco no RDS","AWS"],
      ["Bucket exposto por configuração errada","Cliente"],
      ["Descarte seguro de disco físico","AWS"],
      ["Decidir criptografar dado sensível em repouso","Cliente"]
    ]},
    {t:"trap", x:"Gerenciado não significa seguro por padrão. No RDS a AWS aplica patch, mas quem cria usuário fraco, deixa o grupo de segurança aberto ou não ativa criptografia é você."},
    {t:"case", q:"Quem é responsável por configurar corretamente as permissões de um bucket S3?",
      a:"O cliente. Configuração de acesso é sempre do cliente, em qualquer modelo. A AWS fornece Block Public Access, políticas e o IAM Access Analyzer, mas a decisão é de quem configura."}
  ],
  check:["Dizer a diferença entre segurança da nuvem e na nuvem","Apontar quem aplica patch em EC2 e em RDS","Responder de quem é a culpa por um bucket público"],
  src:[{t:"Modelo de responsabilidade compartilhada", u:"https://aws.amazon.com/compliance/shared-responsibility-model/"}]
},
{
  id:"f-aw-iam", exam:"clf", dom:"d2", mins:6, concept:"iam-role-ec2",
  title:"IAM: usuários, funções, políticas e segredos",
  lead:"Quando uma aplicação da AWS precisa falar com outro serviço da AWS, a resposta é quase sempre função. Quando é segredo de sistema externo, a resposta muda.",
  blocks:[
    {t:"h", x:"Os componentes"},
    {t:"table", head:["Componente","O que é"], rows:[
      ["Usuário raiz","Identidade criada com a conta. Acesso total e irrestrito"],
      ["Usuário do IAM","Identidade de pessoa ou sistema, com credencial de longo prazo"],
      ["Grupo","Conjunto de usuários que recebe políticas em bloco"],
      ["Função (role)","Identidade assumida temporariamente, sem credencial fixa"],
      ["Política","Documento JSON que permite ou nega ações sobre recursos"]
    ]},
    {t:"h", x:"Boas práticas que o exame cobra"},
    {t:"table", head:["Prática","Por quê"], rows:[
      ["MFA no usuário raiz e guardá-lo fora do uso diário","É a identidade com poder total e não pode ser restringida por política"],
      ["Privilégio mínimo","Conceder só a ação necessária sobre o recurso necessário"],
      ["Função em vez de chave de acesso","Credencial temporária, rotacionada pela AWS, sem segredo no código"],
      ["Uma identidade por pessoa","Usuário compartilhado destrói a auditoria do CloudTrail"],
      ["Política de senha e rotação","Reduz risco de credencial antiga e fraca"]
    ]},
    {t:"h", x:"Onde guardar segredo"},
    {t:"table", head:["Serviço","Para quê"], rows:[
      ["KMS","Gerenciar chaves de criptografia, integrado aos serviços da AWS"],
      ["CloudHSM","Módulo de hardware dedicado, quando você precisa de controle exclusivo da chave"],
      ["Secrets Manager","Segredo de aplicação, como senha de banco, com rotação automática integrada"],
      ["Parameter Store","Parâmetros de configuração, inclusive seguros; no nível padrão não rotaciona sozinho"]
    ]},
    {t:"h", x:"Organizations e SCP"},
    {t:"p", x:"A Service Control Policy define o teto de permissão de uma conta dentro do AWS Organizations. Ela não concede nada: apenas limita o que o IAM daquela conta pode permitir. É assim que se bloqueia uma região inteira para todas as equipes."},
    {t:"trap", x:"Se a alternativa fala em gravar chave de acesso no código, na imagem da instância, em variável de ambiente ou em user data, descarte. E função não guarda senha de sistema de terceiro: isso é Secrets Manager."},
    {t:"case", q:"Guardar a senha de um banco de terceiro, trocada a cada 30 dias, sem alterar código, buscada por chamada de API no momento do uso.",
      a:"Secrets Manager. A rotação automática integrada é o diferencial. KMS gerencia chave, não senha. Parameter Store no nível padrão exigiria construir a rotação. CloudHSM é hardware dedicado para chave criptográfica, mais caro e com outra finalidade."}
  ],
  check:["Explicar por que função é melhor que chave de acesso","Dizer o que a SCP faz e o que ela não faz","Escolher entre KMS, Secrets Manager e Parameter Store"],
  src:[{t:"Boas práticas de IAM", u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"},
       {t:"Secrets Manager", u:"https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html"}]
},
{
  id:"f-aw-netsec", exam:"clf", dom:"d2", mins:5, concept:"sg-vs-nacl",
  title:"Segurança de rede: Security Group, NACL, WAF e Shield",
  lead:"Stateful contra stateless é a dupla mais cobrada da AWS. E há um detalhe que decide a questão sozinho: Security Group não tem regra de negação.",
  blocks:[
    {t:"h", x:"Security Group e Network ACL"},
    {t:"table", head:["","Security Group","Network ACL"], rows:[
      ["Atua em","Instância, na interface de rede","Sub-rede inteira"],
      ["Estado","Stateful: a resposta volta sozinha","Stateless: precisa liberar entrada e saída"],
      ["Regras","Só permissão","Permissão e negação"],
      ["Avaliação","Todas as regras, união das permissões","Por número, da menor para a maior, para na primeira que casar"],
      ["Padrão","Nega tudo na entrada, permite tudo na saída","A padrão permite tudo; uma criada por você nega tudo"]
    ]},
    {t:"p", x:"Ao usar NACL, lembre das portas efêmeras: se você libera a entrada na 443 mas não libera a faixa efêmera na saída, a resposta não volta."},
    {t:"h", x:"Proteção de aplicação"},
    {t:"table", head:["Serviço","Cobre"], rows:[
      ["Shield Standard","Proteção DDoS de camada de rede e transporte, automática e sem custo adicional"],
      ["Shield Advanced","Proteção ampliada, proteção financeira contra escalada de custo e acesso ao time de resposta da AWS"],
      ["WAF","Regras sobre requisição HTTP: injeção de SQL, cross-site scripting, limite de taxa, filtro por país"],
      ["Firewall Manager","Aplica regras de WAF e de grupo de segurança em várias contas de uma vez"]
    ]},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Bloquear um IP específico que está atacando","Network ACL"],
      ["Liberar a porta da aplicação para a internet","Security Group"],
      ["Injeção de SQL nas requisições","WAF"],
      ["Ataque volumétrico e precisa de time de resposta da AWS","Shield Advanced"]
    ]},
    {t:"trap", x:"Não existe deny em Security Group. Qualquer alternativa que diga para criar regra de negação em grupo de segurança está errada por definição."},
    {t:"case", q:"Durante um ataque, a equipe identificou um único IP gerando milhares de requisições e precisa bloqueá-lo no nível da sub-rede, mantendo o resto liberado.",
      a:"Network ACL com regra de negação para aquele IP. É o único controle de rede da VPC capaz de negar uma origem específica. IAM controla chamada de API, não tráfego de entrada, e mexer em rota quebraria conectividade legítima."}
  ],
  check:["Explicar stateful e stateless com o exemplo da porta 443","Dizer por que SG não bloqueia um IP","Separar WAF de Shield"],
  src:[{t:"Security groups", u:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html"},
       {t:"Network ACLs", u:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html"}]
},
{
  id:"f-aw-secsvcs", exam:"clf", dom:"d2", mins:5, concept:"seguranca-servicos",
  title:"Serviços de segurança: quem faz o quê",
  lead:"Seis ou sete nomes parecidos que o exame embaralha numa única questão. A saída é decorar o verbo de cada um.",
  blocks:[
    {t:"h", x:"Um verbo para cada serviço"},
    {t:"table", head:["Serviço","Verbo","Responde"], rows:[
      ["CloudTrail","Registra","Quem chamou qual API, quando e de onde"],
      ["CloudWatch","Mede","Métrica, log e alarme dos recursos"],
      ["AWS Config","Compara","Como o recurso está configurado e se está conforme a regra"],
      ["GuardDuty","Detecta","Há atividade maliciosa ou comportamento anômalo"],
      ["Inspector","Varre","Há vulnerabilidade conhecida em EC2, contêiner ou função"],
      ["Macie","Classifica","Há dado pessoal ou sensível nos buckets"],
      ["Detective","Investiga","Qual foi a cadeia de eventos por trás do alerta"],
      ["Security Hub","Agrega","Visão única dos achados de vários serviços"],
      ["Artifact","Entrega","Relatórios de conformidade como SOC e PCI, para o auditor"],
      ["IAM Access Analyzer","Revela","Qual recurso está acessível de fora da conta"]
    ]},
    {t:"p", x:"A diferença entre CloudTrail e CloudWatch é a mais cobrada: CloudTrail é auditoria de chamada de API, CloudWatch é métrica e log operacional."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Quem apagou aquele recurso e quando","CloudTrail"],
      ["Instância conversando com destino associado a mineração","GuardDuty"],
      ["Descobrir dado pessoal em bucket","Macie"],
      ["Baixar relatório SOC 2 para o auditor","Artifact"],
      ["Verificar se todos os volumes estão criptografados","AWS Config"],
      ["CPU acima de 80% por dez minutos","CloudWatch"]
    ]},
    {t:"trap", x:"Inspector procura vulnerabilidade de software, não dado sensível. Config avalia configuração, não distribui relatório de auditoria. Security Hub agrega achados, mas quem detecta a ameaça é o GuardDuty."},
    {t:"case", q:"A equipe precisa de quatro coisas: saber quem chamou qual API; descobrir se algum bucket tem dado pessoal; ser alertada quando uma instância falar com endereço associado a mineração; e baixar o relatório SOC 2.",
      a:"CloudTrail, Macie, GuardDuty e Artifact, nessa ordem. Questões assim são de eliminação: basta ter certeza de dois verbos para derrubar três alternativas."}
  ],
  check:["Dizer o verbo de cada serviço sem olhar","Separar CloudTrail de CloudWatch","Saber onde o auditor busca o relatório de conformidade"],
  src:[{t:"CloudTrail", u:"https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html"},
       {t:"GuardDuty", u:"https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html"},
       {t:"Macie", u:"https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html"}]
},
{
  id:"f-aw-compute", exam:"clf", dom:"d3", mins:5, concept:"compute-aws",
  title:"Computação: EC2, Lambda, Fargate e balanceadores",
  lead:"O enunciado sempre descreve duração da execução, previsibilidade da carga e quanto a equipe quer administrar. Esses três dados escolhem o serviço.",
  blocks:[
    {t:"h", x:"As opções"},
    {t:"table", head:["Serviço","Perfil","Quando é a resposta"], rows:[
      ["EC2","Máquina virtual que você administra","Controle do sistema operacional, software legado, carga constante"],
      ["Lambda","Função por evento, execução curta","Carga irregular, disparo por evento, sem servidor para administrar"],
      ["Fargate","Contêiner sem administrar servidor","Já usa contêiner e não quer cuidar de nó"],
      ["ECS e EKS","Orquestração de contêiner","Muitos contêineres, com ou sem Kubernetes"],
      ["Batch","Lote com fila e dependências","Processamento em lote longo"],
      ["Elastic Beanstalk","Publicação de aplicação com infraestrutura montada para você","Subir aplicação rápido sem desenhar a infraestrutura"]
    ]},
    {t:"h", x:"Escala e balanceamento"},
    {t:"table", head:["Recurso","Função"], rows:[
      ["Auto Scaling","Adiciona e remove instâncias por métrica, agenda ou previsão"],
      ["Application Load Balancer","Camada 7: roteia por caminho, host e cabeçalho HTTP"],
      ["Network Load Balancer","Camada 4: TCP e UDP, IP estático, latência muito baixa"],
      ["Gateway Load Balancer","Insere appliances de inspeção no caminho do tráfego"]
    ]},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Rotear /api e /imagens para grupos diferentes","Application Load Balancer"],
      ["Milhões de conexões TCP com latência mínima e IP fixo","Network Load Balancer"],
      ["Oito segundos por execução, volume de zero a cinco mil em minutos","Lambda"],
      ["Carga constante 24 horas com controle do sistema operacional","EC2"]
    ]},
    {t:"trap", x:"Escalar verticalmente, isto é, trocar por uma instância maior, não é a resposta quando o enunciado fala em tolerar falha ou absorver pico. Nesses casos a resposta é horizontal com Auto Scaling atrás de um balanceador."},
    {t:"case", q:"Uma rotina converte imagens assim que chegam no S3. Cada execução leva cerca de oito segundos e o volume é irregular: às vezes zero por hora, às vezes cinco mil em poucos minutos.",
      a:"Lambda acionado por evento do S3. Execução curta, orientada a evento e volume irregular é o caso natural. Reserva pressupõe uso constante e pagaria capacidade parada. Batch é para lote longo com dependências, não para milhares de tarefas de oito segundos."}
  ],
  check:["Escolher entre ALB e NLB por camada e por requisito","Dizer quando Lambda deixa de ser vantajoso","Explicar a diferença entre escalar vertical e horizontal"],
  src:[{t:"AWS Lambda", u:"https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"},
       {t:"Elastic Load Balancing", u:"https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html"}]
},
{
  id:"f-aw-storage", exam:"clf", dom:"d3", mins:6, concept:"s3-classes",
  title:"Armazenamento: S3, EBS, EFS e instance store",
  lead:"Duas perguntas resolvem quase tudo: o dado precisa sobreviver ao fim da instância, e quantas máquinas precisam acessá-lo ao mesmo tempo?",
  blocks:[
    {t:"h", x:"Escolhendo o tipo"},
    {t:"table", head:["Serviço","Tipo","Acesso simultâneo","Sobrevive ao fim da instância"], rows:[
      ["S3","Objeto, via API","Ilimitado","Sim"],
      ["EBS","Bloco, anexado à instância","Em geral uma instância por vez, preso a uma zona","Sim"],
      ["EFS","Arquivo NFS para Linux","Muitas instâncias, várias zonas","Sim"],
      ["FSx","Arquivo para Windows ou Lustre","Muitas instâncias","Sim"],
      ["Instance store","Bloco local, efêmero","Só a própria instância","Não. Some ao parar ou encerrar"]
    ]},
    {t:"h", x:"Classes do S3"},
    {t:"table", head:["Classe","Acesso","Zonas","Observação"], rows:[
      ["Standard","Imediato","Três ou mais","Padrão, acesso frequente"],
      ["Intelligent-Tiering","Imediato","Três ou mais","Move sozinho entre camadas, sem taxa de recuperação"],
      ["Standard-IA","Imediato","Três ou mais","Mínimo de 30 dias e taxa por recuperação"],
      ["One Zone-IA","Imediato","Uma só","Mais barato; se a zona cai, o dado fica indisponível"],
      ["Glacier Instant Retrieval","Milissegundos","Três ou mais","Arquivo que ainda precisa abrir na hora"],
      ["Glacier Flexible Retrieval","Minutos a horas","Três ou mais","Arquivamento com resgate planejado"],
      ["Glacier Deep Archive","Horas","Três ou mais","O mais barato para guardar, retenção longa"]
    ]},
    {t:"p", x:"A durabilidade é praticamente a mesma em todas as classes. O que muda é disponibilidade, tempo de acesso, número de zonas e preço. Regras de ciclo de vida movem objetos entre classes automaticamente."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Padrão de acesso desconhecido ou variável","Intelligent-Tiering"],
      ["Dado que pode ser gerado de novo, menor custo","One Zone-IA"],
      ["Várias instâncias Linux lendo e gravando o mesmo sistema de arquivos","EFS"],
      ["Dado precisa sobreviver ao encerramento da instância","Não pode ser instance store"],
      ["Retenção de sete anos, resgate pode levar horas","Glacier Deep Archive"]
    ]},
    {t:"trap", x:"One Zone-IA cai sempre que o enunciado diz que o dado não pode ser perdido: ele vive em uma única zona. E EBS não é sistema de arquivos compartilhado de uso geral para um grupo de Auto Scaling."},
    {t:"case", q:"Três instâncias de um grupo de Auto Scaling precisam ler e gravar no mesmo sistema de arquivos ao mesmo tempo, e os dados devem sobreviver ao encerramento de qualquer uma. Sistema Linux.",
      a:"EFS. É NFS gerenciado, elástico, acessível por muitas instâncias em várias zonas, independente do ciclo de vida delas. Instance store é efêmero e some. EBS é por instância e preso a uma zona."}
  ],
  check:["Dizer qual classe tem uma única zona","Explicar quando instance store é inaceitável","Escolher entre EFS e EBS pelo acesso simultâneo"],
  src:[{t:"Classes do S3", u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"},
       {t:"Amazon EFS", u:"https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html"}]
},
{
  id:"f-aw-db", exam:"clf", dom:"d3", mins:5, concept:"bancos-aws",
  title:"Bancos de dados: RDS, Aurora, DynamoDB, Redshift",
  lead:"A primeira pergunta é se a carga é transacional ou analítica. A segunda é se o modelo é relacional. Com essas duas o campo fecha.",
  blocks:[
    {t:"h", x:"O catálogo"},
    {t:"table", head:["Serviço","Modelo","Caso típico"], rows:[
      ["RDS","Relacional gerenciado: MySQL, PostgreSQL, MariaDB, Oracle, SQL Server","Migrar banco relacional existente sem reescrever"],
      ["Aurora","Relacional compatível com MySQL e PostgreSQL","Alta disponibilidade e desempenho com compatibilidade relacional"],
      ["DynamoDB","NoSQL de chave e valor, sem servidor","Leitura por chave em milissegundos com tráfego muito variável"],
      ["Redshift","Data warehouse colunar","Consulta analítica varrendo bilhões de linhas históricas"],
      ["ElastiCache","Cache em memória, Redis ou Memcached","Reduzir latência de leitura repetida e aliviar o banco"],
      ["DocumentDB","Documentos","Carga compatível com MongoDB"],
      ["Neptune","Grafo","Relacionamento entre entidades, recomendação, fraude"],
      ["Athena","Consulta SQL sobre dados no S3","Análise sob demanda sem carregar em warehouse"]
    ]},
    {t:"h", x:"Transacional e analítico"},
    {t:"p", x:"OLTP é transação: muitas operações pequenas, leitura e escrita por chave ou por linha. OLAP é análise: poucas consultas, cada uma varrendo muito dado. Aurora e RDS são OLTP. Redshift é OLAP. Trocar um pelo outro é erro de arquitetura, e o exame cobra isso."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Leitura por chave em milissegundos, tráfego imprevisível","DynamoDB"],
      ["Relatório varrendo bilhões de linhas","Redshift"],
      ["Compatível com PostgreSQL, com réplicas de leitura","Aurora ou RDS"],
      ["Aliviar leitura repetida do banco","ElastiCache"],
      ["SQL direto sobre arquivos no S3","Athena"]
    ]},
    {t:"trap", x:"ElastiCache não é banco primário: é cache. E DynamoDB não é relacional, então nunca atende a requisito de compatibilidade com PostgreSQL ou MySQL."},
    {t:"case", q:"Três necessidades: catálogo de produtos com leitura por chave em milissegundos e tráfego variável; relatórios que varrem bilhões de linhas históricas; e um relacional compatível com PostgreSQL com alta disponibilidade.",
      a:"DynamoDB, Redshift e Aurora. A troca clássica é inverter Aurora e Redshift: Aurora é transacional, Redshift é analítico."}
  ],
  check:["Separar OLTP de OLAP em uma frase","Dizer qual serviço não é banco primário","Escolher entre DynamoDB e RDS pelo modelo de dado"],
  src:[{t:"Amazon DynamoDB", u:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html"},
       {t:"Amazon Redshift", u:"https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html"}]
},
{
  id:"f-aw-net", exam:"clf", dom:"d3", mins:6, concept:"rede-aws",
  title:"Rede: VPC, sub-redes, conectividade e entrega de conteúdo",
  lead:"Sub-rede pública e privada, quem fala com a internet e como o datacenter se conecta. É o bloco com mais componentes do domínio três.",
  blocks:[
    {t:"h", x:"Dentro da VPC"},
    {t:"table", head:["Componente","Função"], rows:[
      ["VPC","Rede virtual isolada, com faixa de IP própria"],
      ["Sub-rede","Fatia da VPC dentro de uma zona de disponibilidade"],
      ["Internet Gateway","Anexado à VPC; é o que torna uma sub-rede pública"],
      ["NAT Gateway","Fica na sub-rede pública e permite saída da sub-rede privada, sem aceitar entrada"],
      ["Tabela de rotas","Define para onde o tráfego de cada sub-rede vai"],
      ["VPC Endpoint","Acesso privado a serviços da AWS sem passar pela internet"]
    ]},
    {t:"p", x:"Sub-rede privada com NAT Gateway é o padrão para instâncias que precisam baixar atualização mas não podem receber conexão de fora. Para alta disponibilidade, um NAT Gateway por zona."},
    {t:"h", x:"Conectando com o mundo e com o datacenter"},
    {t:"table", head:["Serviço","Função"], rows:[
      ["Site-to-Site VPN","Túnel criptografado pela internet. Rápido de montar, latência variável"],
      ["Direct Connect","Link privado dedicado, não passa pela internet pública. Latência previsível"],
      ["Transit Gateway","Hub que interliga muitas VPCs e conexões locais, com roteamento transitivo"],
      ["VPC Peering","Liga duas VPCs. Não é transitivo: a malha cresce rápido"],
      ["PrivateLink","Expõe um serviço de forma privada para outra VPC"]
    ]},
    {t:"h", x:"Entrega de conteúdo e DNS"},
    {t:"table", head:["Serviço","Função"], rows:[
      ["CloudFront","Rede de distribuição de conteúdo com cache na borda"],
      ["Route 53","DNS com políticas: simples, ponderada, latência, failover, geolocalização, resposta múltipla"],
      ["Global Accelerator","IP anycast que entra na rede da AWS perto do usuário, para tráfego não HTTP"]
    ]},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Instância privada precisa baixar atualização, sem receber conexão","NAT Gateway"],
      ["Banda dedicada e nada pela internet pública","Direct Connect"],
      ["Vinte e cinco VPCs e ninguém administra mais as rotas","Transit Gateway"],
      ["Mandar o usuário para a região mais rápida e cair para a outra se falhar","Route 53 por latência com verificação de integridade"],
      ["Reduzir custo de transferência de arquivo baixado muitas vezes","CloudFront"]
    ]},
    {t:"trap", x:"VPC Peering não é transitivo: se A fala com B e B fala com C, A não fala com C. Enunciado com muitas VPCs e malha ingovernável pede Transit Gateway. E não existe VPC Endpoint para a internet em geral, só para serviços da AWS."},
    {t:"case", q:"A fatura cresceu sem aumento de computação. O maior item é transferência de saída para a internet, de arquivos grandes baixados repetidamente pelos mesmos usuários a partir de um bucket.",
      a:"Colocar o CloudFront na frente do bucket. O conteúdo repetido passa a sair do cache na borda, reduzindo requisições e transferência do S3. Mover para Standard-IA reduziria o custo de armazenar e aumentaria o de recuperar, podendo piorar. Versionamento aumenta o armazenamento e não toca na transferência."}
  ],
  check:["Explicar a diferença entre Internet Gateway e NAT Gateway","Dizer por que peering não resolve malha grande","Citar três políticas de roteamento do Route 53"],
  src:[{t:"NAT Gateway", u:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html"},
       {t:"Transit Gateway", u:"https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html"},
       {t:"Políticas do Route 53", u:"https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"}]
},
{
  id:"f-aw-msg", exam:"clf", dom:"d3", mins:5, concept:"sqs-sns-eb",
  title:"Integração: SQS, SNS, EventBridge e Kinesis",
  lead:"Quatro serviços de mensagem com propósitos distintos. Duas palavras no enunciado decidem: ordem e releitura.",
  blocks:[
    {t:"h", x:"O que cada um faz"},
    {t:"table", head:["Serviço","Modelo","Resolve"], rows:[
      ["SQS","Fila; o consumidor puxa a mensagem","Desacoplar e absorver pico sem perder pedido"],
      ["SNS","Publicação e assinatura; empurra para os inscritos","Um evento que precisa chegar a vários destinos"],
      ["EventBridge","Barramento com regras que leem o conteúdo","Rotear evento de serviços da AWS e de SaaS; agendar execução"],
      ["Kinesis Data Streams","Fluxo ordenado com retenção","Ordem por chave e releitura do histórico por vários consumidores"],
      ["Step Functions","Orquestração de passos","Fluxo com estados, condições e repetição"]
    ]},
    {t:"p", x:"O padrão clássico é SNS publicando para várias filas SQS: o fan-out ganha durabilidade, porque cada consumidor tem a própria fila."},
    {t:"h", x:"Fila padrão e FIFO"},
    {t:"table", head:["","Padrão","FIFO"], rows:[
      ["Ordem","Melhor esforço","Preservada dentro do grupo"],
      ["Entrega","Ao menos uma vez, pode duplicar","Exatamente uma vez no processamento"],
      ["Vazão","Muito alta","Menor"]
    ]},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Pico de dez vezes e nada pode se perder","SQS"],
      ["Três sistemas avisados ao mesmo tempo","SNS"],
      ["Reagir a evento de SaaS filtrando por conteúdo","EventBridge"],
      ["Preservar ordem e reler os últimos dias","Kinesis Data Streams"],
      ["Executar algo todo dia às 3h","EventBridge com regra agendada"]
    ]},
    {t:"trap", x:"Fila consome e remove a mensagem. Se o enunciado pede que dois times processem o mesmo fluxo de forma independente e possam reprocessar o histórico, nenhuma fila atende, nem a FIFO: a resposta é Kinesis."},
    {t:"case", q:"Telemetria de sensores. A ordem dos eventos de cada sensor precisa ser preservada, dois times processam o mesmo fluxo de forma independente e ambos podem reler os últimos dias para recalcular métricas.",
      a:"Kinesis Data Streams. Retenção, ordem dentro do shard e vários consumidores independentes. FIFO resolveria a ordem, mas continua sendo fila: a mensagem é consumida e some."}
  ],
  check:["Dizer quando fila não serve","Explicar o padrão SNS para várias filas","Diferenciar fila padrão de FIFO"],
  src:[{t:"Amazon SQS", u:"https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html"},
       {t:"Kinesis Data Streams", u:"https://docs.aws.amazon.com/streams/latest/dev/introduction.html"}]
},
{
  id:"f-aw-cost", exam:"clf", dom:"d4", mins:6, concept:"pricing-models",
  title:"Preços, cobrança e suporte",
  lead:"Domínio pequeno, doze por cento da prova, mas com as questões mais decoráveis. Vale a pena fechar este bloco.",
  blocks:[
    {t:"h", x:"Formas de pagar computação"},
    {t:"table", head:["Modelo","Compromisso","Desconto","Quando"], rows:[
      ["Sob demanda","Nenhum","Nenhum","Carga imprevisível ou de curta duração"],
      ["Savings Plans","Gasto por hora, 1 ou 3 anos","Alto","Carga estável; flexível entre família, região, EC2, Fargate e Lambda"],
      ["Reserved Instances","Instância específica, 1 ou 3 anos","Alto","Carga estável com tipo e região definidos"],
      ["Spot","Nenhum; pode ser interrompida com aviso curto","Muito alto","Lote tolerante a interrupção"],
      ["Hosts dedicados","Servidor físico para você","Variável","Exigência de licença ou conformidade"]
    ]},
    {t:"p", x:"Reserva é compromisso de faturamento, não garantia de capacidade: garantir capacidade exige reserva zonal ou Capacity Reservation."},
    {t:"h", x:"Ferramentas de custo"},
    {t:"table", head:["Ferramenta","Responde"], rows:[
      ["AWS Pricing Calculator","Quanto vai custar algo que ainda não existe"],
      ["Cost Explorer","Quanto já gastei, por serviço e por período, com projeção"],
      ["AWS Budgets","Avisar ou agir quando o gasto passar de um valor"],
      ["Cost and Usage Report","Dados detalhados de cobrança, linha a linha, para análise"],
      ["Trusted Advisor","Recomendação em custo, desempenho, segurança, tolerância a falhas e limites de serviço"],
      ["Compute Optimizer","Qual instância está superdimensionada"]
    ]},
    {t:"h", x:"Organizations e nível gratuito"},
    {t:"p", x:"O AWS Organizations consolida a fatura de várias contas, soma o consumo para efeito de faixa de desconto por volume, permite compartilhar reservas e Savings Plans e aplica SCPs. O nível gratuito tem três formatos: ofertas sempre gratuitas com cota mensal permanente, ofertas gratuitas por doze meses a partir da criação da conta e testes de curta duração."},
    {t:"h", x:"Planos de suporte"},
    {t:"table", head:["Plano","Inclui"], rows:[
      ["Basic","Documentação, fóruns e verificações limitadas do Trusted Advisor. Sem suporte técnico"],
      ["Developer","Suporte técnico por e-mail em horário comercial, orientação geral"],
      ["Business","Suporte 24 horas por telefone, chat e e-mail; Trusted Advisor completo; suporte a software de terceiros"],
      ["Enterprise On-Ramp","Casos críticos de negócio atendidos por um grupo de arquitetos; revisões e orientação"],
      ["Enterprise","Menor tempo de resposta para caso crítico de negócio, gerente técnico de conta designado, revisões de Well-Architected e serviço de concierge de cobrança"]
    ]},
    {t:"trap", x:"Spot nunca é a resposta para carga de produção que não pode cair. E se o enunciado valoriza liberdade de trocar de família ou migrar para Fargate e Lambda, prefira Savings Plans a reserva padrão."},
    {t:"case", q:"Doze contas, uma por equipe. A diretoria quer fatura única, aproveitar faixa de desconto somando o consumo de todas e impedir que qualquer equipe use regiões fora da América do Sul.",
      a:"AWS Organizations com cobrança consolidada e Service Control Policies. Grupo de segurança filtra tráfego e não restringe região. Budgets alerta, mas não consolida fatura. Control Tower é construído sobre o Organizations e não o substitui."}
  ],
  check:["Dizer a diferença entre Savings Plans e Reserved Instances","Citar os três formatos do nível gratuito","Saber qual plano tem gerente técnico designado"],
  src:[{t:"Savings Plans", u:"https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html"},
       {t:"Planos de suporte", u:"https://aws.amazon.com/premiumsupport/plans/"},
       {t:"AWS Organizations", u:"https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html"}]
}
];
