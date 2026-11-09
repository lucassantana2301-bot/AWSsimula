/* ============================================================
   BANCO DE QUESTÕES — SAA-C03, domínios 1 e 2
   Conteúdo original escrito a partir dos objetivos públicos.
   ============================================================ */
const QUESTIONS_SAA_A = [
/* ---------------- D1 segurança ---------------- */
{
  id:"saa-d1-01", exam:"saa", dom:"d1", lvl:4, type:"single", sec:95, tags:["iam-permissoes"],
  case:"Uma aplicação em instâncias EC2 precisa gravar objetos em um bucket do S3 da mesma conta. A equipe hoje guarda uma chave de acesso em um arquivo de configuração dentro da imagem da instância.",
  stem:"Qual a correção, com o menor risco de vazamento?",
  opts:[
    {k:"A",t:"Anexar uma função do IAM à instância por meio do perfil de instância"},
    {k:"B",t:"Mover a chave de acesso para uma variável de ambiente da instância"},
    {k:"C",t:"Guardar a chave no Secrets Manager e lê-la na inicialização"},
    {k:"D",t:"Tornar o bucket público para escrita a partir da faixa de endereços da VPC"}
  ],
  ans:["A"],
  why:{
    ok:"A função entrega credencial temporária, rotacionada pela plataforma, e não existe segredo para vazar. É o padrão esperado para qualquer carga rodando dentro da AWS.",
    B:"Variável de ambiente continua sendo uma chave permanente, visível em despejo de processo e em log de inicialização.",
    C:"Melhora a guarda, mas mantém uma chave de longa duração que precisa ser rotacionada; e para ler o segredo a instância já precisaria de uma função, o que torna a chave redundante.",
    D:"Bucket aberto para escrita é falha grave, e faixa de endereços privada não identifica quem escreve."
  },
  src:[{t:"AWS: funções para EC2",u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html"}]
},
{
  id:"saa-d1-02", exam:"saa", dom:"d1", lvl:5, type:"single", sec:110, tags:["iam-permissoes"],
  case:"A diretoria determinou que nenhuma conta da organização pode criar recursos fora de duas regiões, nem mesmo os administradores dessas contas.",
  stem:"Qual controle atende?",
  opts:[
    {k:"A",t:"Política de controle de serviço no AWS Organizations, negando as demais regiões"},
    {k:"B",t:"Política do IAM negando as regiões, anexada a todos os usuários"},
    {k:"C",t:"Limite de permissões em cada função administrativa"},
    {k:"D",t:"Regra do AWS Config que marca recursos fora das regiões como não conformes"}
  ],
  ans:["A"],
  why:{
    ok:"A política de controle de serviço define o teto do que qualquer principal da conta pode fazer, administrador incluído, e se aplica de uma vez a toda a organização ou unidade organizacional.",
    B:"Depende de anexar a cada usuário e não alcança funções nem a conta raiz; qualquer identidade nova fora do processo fura o controle.",
    C:"Limite de permissões funciona por identidade e teria de ser aplicado e mantido em cada função, com a mesma fragilidade.",
    D:"O Config detecta depois do fato; o enunciado pede impedir."
  },
  src:[{t:"AWS: políticas de controle de serviço",u:"https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"}]
},
{
  id:"saa-d1-03", exam:"saa", dom:"d1", lvl:5, type:"single", sec:110, tags:["vpc-seguranca"],
  case:"Instâncias em uma sub-rede privada conseguem abrir conexão com um serviço externo, mas a resposta nunca chega. O grupo de segurança permite a saída e a entrada do tráfego de retorno.",
  stem:"Qual é a causa mais provável?",
  opts:[
    {k:"A",t:"A lista de controle de acesso de rede não permite as portas efêmeras no sentido de entrada"},
    {k:"B",t:"O grupo de segurança precisa de uma regra de saída para as portas efêmeras"},
    {k:"C",t:"Falta um gateway de internet associado à sub-rede privada"},
    {k:"D",t:"A tabela de rotas aponta para o gateway NAT da zona errada"}
  ],
  ans:["A"],
  why:{
    ok:"A lista de rede não guarda estado: o retorno chega em porta efêmera, de 1024 a 65535, e precisa de regra de entrada explícita. É a assinatura clássica de conexão que sai e não volta.",
    B:"O grupo de segurança guarda estado, então o retorno de uma conexão que ele permitiu sair já volta sem regra adicional.",
    C:"Sub-rede privada não tem gateway de internet por definição; a saída é pelo NAT, e o enunciado diz que a conexão sai.",
    D:"NAT em outra zona encarece e pode falhar junto com a zona, mas o tráfego ainda assim completaria o caminho de ida e volta."
  },
  src:[{t:"AWS: listas de controle de acesso de rede",u:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html"}]
},
{
  id:"saa-d1-04", exam:"saa", dom:"d1", lvl:4, type:"multi", sec:115, tags:["vpc-seguranca"],
  stem:"Quais afirmações sobre grupos de segurança e listas de controle de acesso de rede estão corretas? Escolha as DUAS.",
  opts:[
    {k:"A",t:"O grupo de segurança pode usar outro grupo de segurança como origem de uma regra"},
    {k:"B",t:"A lista de controle de rede é o único dos dois que permite regra de negação"},
    {k:"C",t:"O grupo de segurança é avaliado na ordem de numeração das regras"},
    {k:"D",t:"A lista de controle de rede se aplica à interface de rede da instância"},
    {k:"E",t:"O grupo de segurança padrão de uma VPC nega toda a saída"}
  ],
  ans:["A","B"],
  why:{
    ok:"Referenciar grupo como origem é o que permite dizer aplicação fala com banco sem citar endereço. E negar um endereço específico só existe na lista de rede, porque grupo de segurança só tem regras de permissão.",
    C:"Grupo de segurança não tem numeração: todas as regras são avaliadas em conjunto e basta uma permitir.",
    D:"A lista de rede se aplica à sub-rede; quem atua na interface é o grupo de segurança.",
    E:"O grupo de segurança padrão permite toda a saída e nega a entrada vinda de fora dele."
  },
  src:[{t:"AWS: grupos de segurança",u:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html"}]
},
{
  id:"saa-d1-05", exam:"saa", dom:"d1", lvl:5, type:"single", sec:105, tags:["vpc-seguranca","custo-armazenamento"],
  case:"Instâncias em sub-redes privadas baixam vários terabytes por mês de um bucket do S3 na mesma região, passando pelo gateway NAT. A conta do NAT cresceu muito.",
  stem:"Qual mudança reduz o custo e melhora a segurança?",
  opts:[
    {k:"A",t:"Criar um ponto de extremidade de gateway para o S3 e ajustar a tabela de rotas"},
    {k:"B",t:"Criar um ponto de extremidade de interface para o S3"},
    {k:"C",t:"Mover as instâncias para a sub-rede pública e dispensar o NAT"},
    {k:"D",t:"Habilitar o Transfer Acceleration no bucket"}
  ],
  ans:["A"],
  why:{
    ok:"O ponto de extremidade de gateway para S3 não tem custo por hora nem por tráfego, tira o caminho do NAT e mantém o tráfego fora da internet. É a resposta canônica para esse cenário.",
    B:"O de interface funcionaria, mas cobra por hora e por gigabyte, então reduz menos o custo que a opção sem custo.",
    C:"Colocar instância em sub-rede pública as expõe e piora a segurança, que o enunciado pede melhorar.",
    D:"Transfer Acceleration serve a upload de longa distância pela internet e aumentaria o custo."
  },
  src:[{t:"AWS: pontos de extremidade de gateway para S3",u:"https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"}]
},
{
  id:"saa-d1-06", exam:"saa", dom:"d1", lvl:5, type:"single", sec:110, tags:["criptografia-segredos"],
  case:"Uma auditoria exige registro de cada leitura de objetos sensíveis em um bucket e a capacidade de revogar esse acesso em minutos, sem alterar a política do bucket.",
  stem:"Qual configuração atende?",
  opts:[
    {k:"A",t:"SSE-KMS com chave gerenciada pelo cliente, concedendo o uso da chave apenas às funções necessárias"},
    {k:"B",t:"SSE-S3, com log de acesso do servidor habilitado no bucket"},
    {k:"C",t:"SSE-C, enviando a chave em cada requisição"},
    {k:"D",t:"Bloqueio de acesso público combinado com versionamento"}
  ],
  ans:["A"],
  why:{
    ok:"Cada descriptografia é uma chamada ao KMS registrada no CloudTrail, o que dá o rastro, e remover o principal da política da chave corta o acesso ao conteúdo sem tocar na política do bucket.",
    B:"SSE-S3 é transparente e não produz um evento por objeto atribuível a uma identidade; o log de acesso tampouco permite revogar.",
    C:"SSE-C transfere a responsabilidade pela chave ao cliente e não entrega política central para revogar.",
    D:"São controles de exposição e de exclusão, não de rastro de leitura."
  },
  src:[{t:"AWS: SSE-KMS no S3",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html"}]
},
{
  id:"saa-d1-07", exam:"saa", dom:"d1", lvl:4, type:"single", sec:95, tags:["criptografia-segredos"],
  case:"A credencial do banco de dados precisa ser trocada a cada 30 dias sem intervenção humana, e a aplicação deve obter sempre a versão vigente.",
  stem:"Qual serviço atende diretamente?",
  opts:[
    {k:"A",t:"AWS Secrets Manager"},
    {k:"B",t:"Parameter Store no nível padrão"},
    {k:"C",t:"AWS KMS"},
    {k:"D",t:"AWS Certificate Manager"}
  ],
  ans:["A"],
  why:{
    ok:"O Secrets Manager tem rotação programada com função de rotação integrada aos bancos gerenciados, e a aplicação busca sempre a versão vigente pelo mesmo identificador.",
    B:"O Parameter Store guarda o valor e é mais barato, mas não tem rotação nativa: alguém teria de construí-la.",
    C:"O KMS guarda chaves de criptografia, não credenciais de banco.",
    D:"O Certificate Manager cuida de certificados TLS."
  },
  src:[{t:"AWS: rotação no Secrets Manager",u:"https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html"}]
},
{
  id:"saa-d1-08", exam:"saa", dom:"d1", lvl:5, type:"yn", sec:120, tags:["iam-permissoes"],
  stem:"Responda Sim ou Não para cada afirmação sobre avaliação de permissões.",
  rows:[
    {t:"Uma negação explícita em qualquer política aplicável derruba o acesso, mesmo havendo permissão explícita em outra.", a:true,
     e:"A negação explícita é avaliada primeiro e encerra a decisão."},
    {t:"Uma política de controle de serviço concede permissões aos principais da conta.", a:false,
     e:"Ela só define o teto do que pode ser permitido; a concessão continua vindo das políticas do IAM."},
    {t:"Para acessar um bucket de outra conta, basta a política de identidade do usuário permitir.", a:false,
     e:"Acesso entre contas exige permissão dos dois lados: política de identidade e política do recurso, ou uma função assumida."},
    {t:"Sem nenhuma política dizendo nada sobre uma ação, a ação é negada.", a:true,
     e:"O padrão é negar: permissão só existe quando concedida explicitamente."}
  ],
  src:[{t:"AWS: lógica de avaliação de políticas",u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html"}]
},
{
  id:"saa-d1-09", exam:"saa", dom:"d1", lvl:4, type:"single", sec:95, tags:["vpc-seguranca"],
  case:"A equipe precisa administrar instâncias em sub-rede privada. A política de segurança proíbe abrir a porta 22 para a internet e proíbe manter um host bastião.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"AWS Systems Manager Session Manager"},
    {k:"B",t:"Bastião em sub-rede pública com grupo de segurança restrito ao IP do escritório"},
    {k:"C",t:"VPN cliente para a VPC, com regra de entrada na porta 22"},
    {k:"D",t:"Gateway NAT com regra de encaminhamento para a porta 22"}
  ],
  ans:["A"],
  why:{
    ok:"O Session Manager abre a sessão pelo agente, com autorização do IAM e registro no CloudTrail, sem porta de entrada, sem par de chaves e sem bastião.",
    B:"É exatamente o bastião que a política proíbe.",
    C:"Reduz a exposição, mas continua dependendo da porta 22 aberta no grupo de segurança, que a política proíbe.",
    D:"O gateway NAT só permite conexões iniciadas de dentro e não encaminha entrada."
  },
  src:[{t:"AWS: Session Manager",u:"https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html"}]
},
{
  id:"saa-d1-10", exam:"saa", dom:"d1", lvl:5, type:"single", sec:110, tags:["iam-permissoes"],
  case:"A conta de produção precisa permitir que uma equipe, cujos usuários vivem em outra conta, leia um bucket específico. A segurança proíbe criar usuários do IAM na conta de produção.",
  stem:"Qual desenho atende?",
  opts:[
    {k:"A",t:"Função na conta de produção com relação de confiança para a outra conta, assumida via serviço de token de segurança"},
    {k:"B",t:"Chave de acesso de um usuário de produção, compartilhada com a equipe"},
    {k:"C",t:"Política de bucket permitindo o acesso anônimo somente de leitura"},
    {k:"D",t:"Replicar o bucket para a outra conta e dar acesso lá"}
  ],
  ans:["A"],
  why:{
    ok:"Função assumida entre contas é o mecanismo projetado para isso: credencial temporária, sem usuário novo e com rastro de quem assumiu.",
    B:"Chave compartilhada é credencial permanente sem atribuição individual, e ainda cria o usuário que a política proíbe.",
    C:"Acesso anônimo expõe o bucket ao mundo.",
    D:"Duplica dado e custo para resolver um problema de permissão."
  },
  src:[{t:"AWS: acesso entre contas com funções",u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html"}]
},
{
  id:"saa-d1-11", exam:"saa", dom:"d1", lvl:4, type:"single", sec:90, tags:["vpc-seguranca"],
  case:"Uma aplicação web pública vem sofrendo injeção de SQL e tentativas automatizadas de login.",
  stem:"Qual serviço mitiga diretamente esses dois ataques na camada de aplicação?",
  opts:[
    {k:"A",t:"AWS WAF associado ao balanceador de aplicação ou ao CloudFront"},
    {k:"B",t:"AWS Shield Standard"},
    {k:"C",t:"Lista de controle de acesso de rede na sub-rede pública"},
    {k:"D",t:"Grupo de segurança com regras por porta"}
  ],
  ans:["A"],
  why:{
    ok:"O WAF inspeciona a requisição HTTP e tem regras gerenciadas para injeção de SQL e limitação de taxa por origem, que é o que o enunciado descreve.",
    B:"O Shield Standard protege contra negação de serviço nas camadas 3 e 4, não contra conteúdo malicioso na requisição.",
    C:"A lista de rede decide por endereço e porta e não lê o conteúdo da requisição.",
    D:"Grupo de segurança tampouco inspeciona conteúdo."
  },
  src:[{t:"AWS WAF",u:"https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html"}]
},
{
  id:"saa-d1-12", exam:"saa", dom:"d1", lvl:5, type:"order", sec:90, tags:["iam-permissoes"],
  stem:"Ordene a avaliação de uma requisição do PRIMEIRO ao ÚLTIMO critério aplicado.",
  items:[
    {t:"Negação explícita em qualquer política aplicável"},
    {t:"Política de controle de serviço da organização"},
    {t:"Permissão explícita em política de identidade ou de recurso"},
    {t:"Negação implícita, quando nada concedeu a ação"}
  ],
  e:"A negação explícita encerra a avaliação imediatamente. Em seguida entra o teto da organização: o que a política de controle de serviço não permite não pode ser concedido por ninguém. Só então vale a permissão explícita, e o que sobrar sem concessão cai na negação implícita, que é o padrão. Saber esta ordem explica por que um administrador recebe negativa sem que exista qualquer política de negação anexada a ele.",
  src:[{t:"AWS: lógica de avaliação de políticas",u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html"}]
},
/* ---------------- D2 resiliência ---------------- */
{
  id:"saa-d2-01", exam:"saa", dom:"d2", lvl:5, type:"single", sec:110, tags:["dados-resilientes"],
  case:"Um banco RDS de produção fica sobrecarregado quando o time de dados roda relatórios pesados. A diretoria também quer que o banco continue no ar se uma zona de disponibilidade cair.",
  stem:"Qual configuração atende aos dois requisitos?",
  opts:[
    {k:"A",t:"Implantação Multi-AZ e uma réplica de leitura apontada aos relatórios"},
    {k:"B",t:"Apenas implantação Multi-AZ, com os relatórios lendo o nó de espera"},
    {k:"C",t:"Apenas uma réplica de leitura em outra zona"},
    {k:"D",t:"Aumentar a classe da instância do banco"}
  ],
  ans:["A"],
  why:{
    ok:"São dois problemas distintos com duas construções distintas: Multi-AZ dá falha automática com cópia síncrona, e a réplica de leitura tira a carga analítica do nó de escrita.",
    B:"No modelo clássico de Multi-AZ o nó de espera não aceita leitura: ele existe para assumir, não para servir consulta.",
    C:"A réplica resolve o relatório e não dá falha automática; a promoção é manual.",
    D:"Instância maior adia o problema, não resolve nem a disponibilidade nem a separação de carga."
  },
  src:[{t:"AWS: Multi-AZ no RDS",u:"https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html"}]
},
{
  id:"saa-d2-02", exam:"saa", dom:"d2", lvl:5, type:"single", sec:115, tags:["desacoplamento"],
  case:"Um site de pedidos trava quando há promoção. Cada pedido leva até 40 segundos para ser processado, nenhum pode ser perdido e o mesmo pedido não pode ser cobrado duas vezes.",
  stem:"Qual desenho atende?",
  opts:[
    {k:"A",t:"Fila FIFO do SQS entre o site e o processamento, com deduplicação e tempo de visibilidade acima de 40 segundos"},
    {k:"B",t:"Tópico do SNS entre o site e o processamento"},
    {k:"C",t:"Fila padrão do SQS, com tempo de visibilidade de 10 segundos"},
    {k:"D",t:"Aumentar o grupo de dimensionamento do site"}
  ],
  ans:["A"],
  why:{
    ok:"A fila absorve o pico e desacopla o site do processamento; FIFO com identificador de deduplicação garante que o mesmo pedido não seja processado duas vezes; e o tempo de visibilidade acima do tempo de processamento impede que a mensagem reapareça no meio do trabalho.",
    B:"O SNS entrega a todos os assinantes e não enfileira para consumo no ritmo do consumidor: ele empurra.",
    C:"A fila padrão entrega pelo menos uma vez, o que permite cobrança dupla, e 10 segundos de visibilidade garantem reprocessamento antes do fim.",
    D:"Escalar o site não resolve o gargalo, que está no processamento de 40 segundos por pedido."
  },
  src:[{t:"AWS: filas FIFO do SQS",u:"https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html"}]
},
{
  id:"saa-d2-03", exam:"saa", dom:"d2", lvl:4, type:"single", sec:95, tags:["desacoplamento"],
  case:"Quando um pedido é aprovado, quatro sistemas diferentes precisam ser avisados, e cada um processa no próprio ritmo, sem que um lento atrase os outros.",
  stem:"Qual arquitetura atende?",
  opts:[
    {k:"A",t:"Um tópico do SNS com quatro filas do SQS assinando"},
    {k:"B",t:"Quatro chamadas HTTP síncronas a partir do serviço de pedidos"},
    {k:"C",t:"Uma fila do SQS lida pelos quatro sistemas"},
    {k:"D",t:"Um fluxo do Kinesis com quatro produtores"}
  ],
  ans:["A"],
  why:{
    ok:"É o padrão de distribuição: o produtor publica uma vez, cada assinante tem a própria fila, e um consumidor lento acumula na fila dele sem afetar os demais.",
    B:"Chamada síncrona acopla o pedido à disponibilidade dos quatro: se um cai, o pedido falha.",
    C:"Em uma fila única cada mensagem é consumida por um só, então os outros três não recebem.",
    D:"O Kinesis serve a fluxo contínuo; aqui são quatro consumidores de evento discreto, e o enunciado fala de produtores, não de consumidores."
  },
  src:[{t:"AWS: cenários comuns com SNS",u:"https://docs.aws.amazon.com/sns/latest/dg/sns-common-scenarios.html"}]
},
{
  id:"saa-d2-04", exam:"saa", dom:"d2", lvl:5, type:"single", sec:105, tags:["alta-disponibilidade"],
  case:"Instâncias atrás de um balanceador às vezes respondem no sistema operacional, mas a aplicação devolve erro 500. O grupo de dimensionamento não as substitui.",
  stem:"Qual ajuste corrige?",
  opts:[
    {k:"A",t:"Configurar o grupo de dimensionamento para usar a verificação de integridade do balanceador"},
    {k:"B",t:"Reduzir o período de carência do grupo de dimensionamento para zero"},
    {k:"C",t:"Trocar o balanceador de aplicação por um balanceador de rede"},
    {k:"D",t:"Aumentar o número mínimo de instâncias do grupo"}
  ],
  ans:["A"],
  why:{
    ok:"Por padrão o grupo usa a checagem de estado da instância, que só enxerga o sistema operacional. Apontando para a verificação do balanceador, o erro 500 passa a marcar a instância como não saudável e ela é substituída.",
    B:"O período de carência evita derrubar instância que ainda está inicializando; zerá-lo causa substituição precoce e não resolve a origem.",
    C:"O balanceador de rede opera em camada 4 e enxergaria menos, não mais.",
    D:"Mais instâncias mantêm o mesmo problema em escala maior."
  },
  src:[{t:"AWS: verificações de integridade no Auto Scaling",u:"https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html"}]
},
{
  id:"saa-d2-05", exam:"saa", dom:"d2", lvl:5, type:"single", sec:110, tags:["dados-resilientes"],
  case:"Uma empresa precisa de retomada em outra região em cerca de um minuto, com perda de no máximo alguns segundos de transação, em um banco compatível com MySQL.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Aurora com banco de dados global"},
    {k:"B",t:"RDS MySQL com réplica de leitura em outra região"},
    {k:"C",t:"Cópia automática de snapshots do RDS para a outra região"},
    {k:"D",t:"Implantação Multi-AZ do RDS MySQL"}
  ],
  ans:["A"],
  why:{
    ok:"O banco de dados global do Aurora replica para a segunda região com atraso típico abaixo de um segundo e permite promover a região secundária em cerca de um minuto, que é exatamente a combinação pedida.",
    B:"A réplica entre regiões existe, mas a promoção é manual e o tempo até estar servindo escrita não é confiavelmente de um minuto.",
    C:"Snapshot replicado dá perda de horas, não de segundos.",
    D:"Multi-AZ protege contra falha de zona dentro da mesma região e não atende a desastre regional."
  },
  src:[{t:"AWS: Aurora Global Database",u:"https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html"}]
},
{
  id:"saa-d2-06", exam:"saa", dom:"d2", lvl:4, type:"yn", sec:120, tags:["dados-resilientes"],
  stem:"Responda Sim ou Não para cada afirmação sobre durabilidade e proteção no S3.",
  rows:[
    {t:"O versionamento protege contra exclusão acidental de um objeto.", a:true,
     e:"A exclusão cria um marcador e a versão anterior continua recuperável."},
    {t:"Habilitar a replicação entre regiões copia automaticamente os objetos que já estavam no bucket.", a:false,
     e:"A replicação vale do momento em que é ligada em diante; o acervo antigo exige replicação em lote."},
    {t:"O bloqueio de objeto no modo de conformidade impede que até a conta raiz apague o objeto antes do prazo.", a:true,
     e:"É o que o diferencia do modo de governança, em que um principal com permissão especial pode remover."},
    {t:"A durabilidade de onze noves do S3 protege contra alguém apagar o objeto por engano.", a:false,
     e:"Durabilidade trata de perda por falha de mídia; exclusão é uma operação legítima e precisa de versionamento ou bloqueio."}
  ],
  src:[{t:"AWS: bloqueio de objetos do S3",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html"}]
},
{
  id:"saa-d2-07", exam:"saa", dom:"d2", lvl:5, type:"single", sec:105, tags:["alta-disponibilidade"],
  case:"Uma aplicação web guarda a sessão do usuário na memória da instância. Durante o dimensionamento, usuários são deslogados ao serem direcionados a outra instância.",
  stem:"Qual é a melhor correção?",
  opts:[
    {k:"A",t:"Guardar a sessão em um repositório externo, como ElastiCache Redis ou DynamoDB"},
    {k:"B",t:"Habilitar sessão fixa no balanceador"},
    {k:"C",t:"Desabilitar o dimensionamento automático durante o horário comercial"},
    {k:"D",t:"Aumentar o tempo de espera de conexão do balanceador"}
  ],
  ans:["A"],
  why:{
    ok:"Tirar o estado de dentro da instância torna as instâncias intercambiáveis, que é a premissa de qualquer frota elástica. É a correção estrutural.",
    B:"Sessão fixa amarra o usuário a uma instância: desequilibra a carga e ainda derruba a sessão quando aquela instância é substituída.",
    C:"Desligar a elasticidade para contornar um defeito de arquitetura troca um problema por outro.",
    D:"Tempo de espera não tem relação com onde a sessão está guardada."
  },
  src:[{t:"AWS: sessões fixas no ELB",u:"https://docs.aws.amazon.com/elasticloadbalancing/latest/application/sticky-sessions.html"}]
},
{
  id:"saa-d2-08", exam:"saa", dom:"d2", lvl:5, type:"single", sec:110, tags:["dados-resilientes"],
  case:"A empresa definiu objetivo de tempo de retomada de 10 minutos e objetivo de ponto de retomada de 5 minutos para uma aplicação em outra região, e quer o menor custo que atenda.",
  stem:"Qual estratégia escolher?",
  opts:[
    {k:"A",t:"Espera morna: ambiente reduzido já rodando na segunda região, escalado no desastre"},
    {k:"B",t:"Cópia e restauração a partir de snapshots"},
    {k:"C",t:"Luz piloto com apenas o banco replicado e nada de computação provisionada"},
    {k:"D",t:"Ativo em duas regiões, com tráfego dividido o tempo todo"}
  ],
  ans:["A"],
  why:{
    ok:"Dez minutos de retomada não dão tempo de provisionar tudo do zero, e a espera morna já tem o ambiente de pé em escala reduzida, bastando escalar. É a opção mais barata que cabe nos dois objetivos.",
    B:"Restaurar a partir de snapshot leva horas e estoura os dois objetivos.",
    C:"Luz piloto costuma levar dezenas de minutos para subir a camada de aplicação, acima dos 10 minutos exigidos.",
    D:"Atende com folga e é a opção mais cara, enquanto o enunciado pede o menor custo que atenda."
  },
  src:[{t:"AWS: opções de recuperação de desastre",u:"https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html"}]
},
{
  id:"saa-d2-09", exam:"saa", dom:"d2", lvl:4, type:"multi", sec:110, tags:["desacoplamento"],
  stem:"Mensagens de uma fila padrão do SQS estão sendo processadas mais de uma vez e algumas desaparecem após falhas repetidas. Quais ajustes tratam esses dois sintomas? Escolha os DOIS.",
  opts:[
    {k:"A",t:"Aumentar o tempo de visibilidade para além do tempo máximo de processamento"},
    {k:"B",t:"Configurar uma fila de mensagens mortas com número máximo de recebimentos"},
    {k:"C",t:"Reduzir o tempo de retenção da fila"},
    {k:"D",t:"Habilitar sondagem curta em vez de sondagem longa"},
    {k:"E",t:"Aumentar o número de consumidores"}
  ],
  ans:["A","B"],
  why:{
    ok:"Visibilidade menor que o processamento é a causa clássica do processamento duplicado. A fila de mensagens mortas captura o que falhou várias vezes, em vez de a mensagem circular até expirar e sumir.",
    C:"Reduzir a retenção faz a mensagem sumir mais cedo, piorando o segundo sintoma.",
    D:"A sondagem afeta custo e latência de recebimento, não duplicação nem perda.",
    E:"Mais consumidores com a visibilidade errada aumentam a chance de dois pegarem a mesma mensagem."
  },
  src:[{t:"AWS: tempo de visibilidade",u:"https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html"}]
},
{
  id:"saa-d2-10", exam:"saa", dom:"d2", lvl:4, type:"single", sec:95, tags:["alta-disponibilidade"],
  case:"Uma aplicação precisa de endereço IP fixo para ser liberada em firewalls de clientes, e trabalha sobre TCP com protocolo próprio, não HTTP.",
  stem:"Qual balanceador usar?",
  opts:[
    {k:"A",t:"Balanceador de rede"},
    {k:"B",t:"Balanceador de aplicação"},
    {k:"C",t:"Balanceador de gateway"},
    {k:"D",t:"CloudFront na frente de um balanceador de aplicação"}
  ],
  ans:["A"],
  why:{
    ok:"O balanceador de rede opera em camada 4, aceita qualquer protocolo sobre TCP e UDP e é o único que oferece endereço IP estático por zona, que é o requisito do firewall do cliente.",
    B:"O de aplicação é camada 7, só HTTP e HTTPS, e não expõe IP fixo.",
    C:"O de gateway serve a inserir dispositivos de inspeção no caminho, não a publicar aplicação.",
    D:"O CloudFront é para HTTP e HTTPS e não entrega IP fixo de origem para liberação em firewall."
  },
  src:[{t:"AWS: balanceador de rede",u:"https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html"}]
}
];
