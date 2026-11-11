/* ============================================================
   BANCO DE QUESTÕES — SAA-C03, nível máximo (lvl 5)
   Cenários com três requisitos simultâneos, para a prova completa.
   Revisado contra a documentação oficial (nov/2026).
   ============================================================ */
/* Lote SAA-MAX: 20 questões SAA-C03 de nível máximo (lvl 5) para a prova completa.
   Domínios: d1 (36 a 41), d2 (32 a 36), d3 (30 a 34), d4 (26 a 29).
   Tipos: 14 single, 4 multi, 1 yn, 1 order. */
const QUESTIONS_SAA_MAX = [

/* ===================== D1: Arquiteturas seguras ===================== */
{
  id:"saa-d1-36", exam:"saa", dom:"d1", lvl:5, type:"single", sec:140,
  tags:["vpc-seguranca","custo-banco-rede"],
  case:"Uma organização tem 60 VPCs em 12 contas, numa única região, ligadas por um AWS Transit Gateway da conta de rede, compartilhado pelo AWS RAM. A segurança exige três coisas para o tráfego entre VPCs: inspeção com estado feita por um firewall gerenciado da AWS, sem appliances de terceiros para corrigir; ida e volta de cada conexão passando pelo mesmo ponto de inspeção, para não haver descarte por assimetria; e o menor esforço operacional, sem VPC de inspeção, sub-redes de firewall e tabelas de rotas de VPC para manter.",
  stem:"Qual arquitetura atende aos três requisitos?",
  opts:[
    {k:"A",t:"Uma VPC de inspeção com endpoints do AWS Network Firewall em cada zona, anexada ao Transit Gateway com o modo appliance ativado no anexo."},
    {k:"B",t:"Um AWS Network Firewall em cada uma das 60 VPCs, com as tabelas de rotas das sub-redes enviando o tráfego ao endpoint do firewall local."},
    {k:"C",t:"Um AWS Network Firewall anexado direto ao Transit Gateway, com as rotas do Transit Gateway levando o tráfego ao anexo do firewall."},
    {k:"D",t:"Um Gateway Load Balancer numa VPC de inspeção, com firewalls de um fabricante parceiro do AWS Marketplace atrás dele, em várias zonas."}
  ],
  ans:["C"],
  why:{
    ok:"O firewall anexado ao Transit Gateway (integração nativa) elimina as sub-redes dedicadas e as tabelas de rotas de VPC: o roteamento é feito só nas tabelas de rotas do Transit Gateway. Nesse tipo de anexo o modo appliance fica sempre ativado, o que mantém os dois sentidos de cada fluxo na mesma zona e no mesmo endpoint do firewall, garantindo a inspeção com estado. E o Network Firewall é um serviço gerenciado, sem appliances para corrigir.",
    A:"É o desenho clássico e atende à inspeção gerenciada e à simetria, já que o modo appliance está ativado. Falha no terceiro requisito: exige manter a VPC de inspeção, as sub-redes do firewall e as tabelas de rotas dessa VPC.",
    B:"Cada firewall inspeciona com estado e de forma simétrica o tráfego da própria VPC, mas são 60 firewalls para operar e pagar por hora em cada zona. Falha no menor esforço operacional e ainda deixa a política espalhada.",
    D:"O Gateway Load Balancer mantém a simetria dos fluxos, mas os firewalls são appliances de terceiros que a equipe precisa corrigir e dimensionar, e o desenho exige uma VPC de inspeção. Falha no primeiro e no terceiro requisito."
  },
  src:[
    {t:"Network Firewall: firewall anexado ao Transit Gateway",u:"https://docs.aws.amazon.com/network-firewall/latest/developerguide/tgw-firewall-considerations.html"},
    {t:"Transit Gateway: cenário com appliance",u:"https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-appliance-scenario.html"}
  ]
},
{
  id:"saa-d1-37", exam:"saa", dom:"d1", lvl:5, type:"single", sec:130,
  tags:["criptografia-segredos"],
  case:"O formulário de checkout de uma loja envia, por POST, o número do cartão e o CPF. A requisição passa pelo CloudFront, por um ALB e por oito microsserviços, e vários deles gravam o corpo das requisições em log. Requisitos: só o microsserviço de pagamento pode ler esses dois campos; eles precisam ficar protegidos desde a borda até o pagamento, mesmo depois do fim do TLS; e nenhum dos outros sete serviços pode ser alterado, nem pode haver código próprio de criptografia rodando na borda.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Criptografia em nível de campo do CloudFront com uma chave pública RSA, e o serviço de pagamento decifrando com a chave privada."},
    {k:"B",t:"HTTPS do visitante ao CloudFront e do CloudFront ao ALB, com certificados do ACM e TLS 1.2 como versão mínima nos dois trechos."},
    {k:"C",t:"Uma função do Lambda@Edge na requisição do visitante que cifra os dois campos com uma chave do AWS KMS antes de seguir à origem."},
    {k:"D",t:"Proteção de dados sensíveis do CloudWatch Logs nos grupos de log dos serviços, mascarando números de cartão e CPF nos registros."}
  ],
  ans:["A"],
  why:{
    ok:"Na criptografia em nível de campo, o CloudFront cifra na borda os campos indicados de requisições POST (até 10 campos) com a chave pública que você registrou. A chave pública não decifra nada: só quem tem a chave privada, aqui o serviço de pagamento, recupera o valor. Os outros serviços e os logs recebem apenas o texto cifrado, sem nenhuma alteração neles, e não há código próprio na borda, só configuração da distribuição.",
    B:"Protege o tráfego em trânsito, mas o TLS termina no CloudFront e no ALB. Daí em diante os campos chegam em claro a todos os serviços e aos logs. Falha no requisito de só o pagamento ler os dados.",
    C:"Pode proteger os campos desde a borda, mas é código próprio de criptografia na borda, que precisa ser escrito e mantido, e chama o KMS a cada requisição. Falha no terceiro requisito.",
    D:"Mascara os dados nos logs do CloudWatch, mas os sete serviços continuam recebendo o cartão e o CPF em claro. Falha no requisito de só o pagamento ler os campos."
  },
  src:[
    {t:"CloudFront: criptografia em nível de campo",u:"https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html"}
  ]
},
{
  id:"saa-d1-38", exam:"saa", dom:"d1", lvl:5, type:"multi", sec:150,
  tags:["iam-permissoes"],
  case:"Um bucket de data lake atende 15 equipes. Cada equipe usa funções do IAM na própria conta da organização e só pode ler o próprio prefixo. A política do bucket está perto do limite de tamanho, e qualquer mudança para uma equipe arrisca quebrar o acesso de outra. A equipe de ciência de dados roda notebooks numa VPC da conta do data lake e só pode acessar os dados a partir dessa VPC. Os dados não podem ser copiados para outros buckets.",
  stem:"Quais medidas, juntas, atendem? Escolha as TRÊS corretas.",
  opts:[
    {k:"A",t:"Criar um ponto de acesso do S3 por equipe, cada um com a própria política, liberando só a função daquela equipe e o prefixo dela."},
    {k:"B",t:"Replicar cada prefixo para um bucket por equipe com o S3 Replication e entregar a cada equipe a política do próprio bucket."},
    {k:"C",t:"Trocar a política do bucket por uma que delega o controle aos pontos de acesso da conta, com a condição s3:DataAccessPointAccount."},
    {k:"D",t:"Criar um único ponto de acesso compartilhado e mover para a política dele todas as regras das 15 equipes que hoje estão no bucket."},
    {k:"E",t:"Criar o ponto de acesso da equipe de ciência de dados com origem de rede VPC, informando a VPC dos notebooks na criação."}
  ],
  ans:["A","C","E"],
  why:{
    ok:"Com um ponto de acesso por equipe, cada política fica pequena e isolada: mudar uma não afeta as outras, e todas apontam para o mesmo bucket, sem cópia. Para que essas políticas valham, o bucket precisa permitir o mesmo acesso; a forma recomendada é delegar, com uma política de bucket que permite tudo que chega por pontos de acesso da conta dona (s3:DataAccessPointAccount). Como as funções estão em outras contas, elas também precisam de permissão na política de identidade delas. Um ponto de acesso com origem de rede VPC só aceita requisições vindas daquela VPC, por um endpoint; essa configuração não pode ser mudada depois da criação.",
    B:"Resolveria o isolamento das políticas, mas copia os dados para 15 buckets, o que o cenário proíbe, e ainda soma custo de armazenamento e de replicação.",
    D:"Só troca o lugar da política gigante. Continua havendo um único documento com as regras de todas as equipes, com o mesmo risco a cada mudança e limite de tamanho próprio."
  },
  src:[
    {t:"S3: políticas de ponto de acesso e delegação",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-points-policies.html"},
    {t:"S3: restrições dos pontos de acesso",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-points-restrictions-limitations-naming-rules.html"}
  ]
},
{
  id:"saa-d1-39", exam:"saa", dom:"d1", lvl:5, type:"single", sec:120,
  tags:["vpc-seguranca","criptografia-segredos"],
  case:"Funções Lambda rodam em sub-redes privadas de uma VPC porque acessam um banco RDS que também fica em sub-rede privada. Elas leem a credencial do banco no Secrets Manager com o SDK, usando o endereço padrão do serviço. A VPC não tem gateway NAT nem gateway da internet. Requisitos: nenhum tráfego pode ter rota para a internet; o código e a configuração do SDK não podem mudar; e as funções precisam continuar alcançando o banco.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Criar um gateway NAT numa sub-rede pública e limitar a saída do grupo de segurança das funções à porta 443 do Secrets Manager."},
    {k:"B",t:"Criar um endpoint de interface do Secrets Manager sem DNS privado e apontar o SDK para o nome DNS específico do endpoint."},
    {k:"C",t:"Tirar as funções da VPC, para que alcancem o Secrets Manager pela rede da AWS sem precisar de gateway NAT nem de endpoint."},
    {k:"D",t:"Criar um endpoint de interface do Secrets Manager com DNS privado e liberar a porta 443 das funções no grupo do endpoint."}
  ],
  ans:["D"],
  why:{
    ok:"O endpoint de interface coloca interfaces de rede com IP privado nas sub-redes, então o tráfego fica dentro da rede da AWS, sem rota para a internet. Com o DNS privado ativado (a VPC precisa ter os atributos de DNS ligados), o nome padrão secretsmanager.<região>.amazonaws.com passa a resolver para esses IPs privados, e o SDK funciona sem nenhuma mudança. As funções continuam na VPC e alcançam o banco. O grupo de segurança do endpoint precisa aceitar HTTPS vindo das funções.",
    A:"Funciona sem mudar o código, mas o gateway NAT cria uma rota para a internet, que o primeiro requisito proíbe. Também soma cobrança por hora e por GB processado.",
    B:"Mantém o tráfego privado, mas sem DNS privado o nome padrão continua resolvendo para IPs públicos, e é preciso configurar o SDK com o nome do endpoint. Falha no requisito de não mudar código nem configuração.",
    C:"Fora da VPC a função alcança o Secrets Manager sem mudança de código, mas perde o acesso ao banco na sub-rede privada. Falha no terceiro requisito."
  },
  src:[
    {t:"Secrets Manager: endpoint da VPC",u:"https://docs.aws.amazon.com/secretsmanager/latest/userguide/vpc-endpoint-overview.html"}
  ]
},
{
  id:"saa-d1-40", exam:"saa", dom:"d1", lvl:5, type:"yn", sec:130,
  tags:["vpc-seguranca"],
  case:"Um varejista tem o site atrás do CloudFront, com origem num ALB. Ele sofre com robôs que raspam preços imitando navegadores reais e com rajadas de requisições ao login vindas de poucos endereços. A equipe vai usar o AWS WAF e quer entender o que cada recurso faz antes de montar a ACL da web.",
  stem:"Responda Sim ou Não para cada afirmação sobre o AWS WAF Bot Control e as regras baseadas em taxa.",
  rows:[
    {t:"O nível de proteção comum do Bot Control basta para robôs sofisticados que imitam navegadores e não se identificam; o nível direcionado só acrescenta relatórios.", a:false,
     e:"O nível comum rotula robôs que se identificam, verifica os desejáveis e detecta assinaturas de alta confiança. Robôs que não se identificam exigem o nível direcionado, que usa interrogação do navegador, impressão digital e heurística de comportamento."},
    {t:"Uma regra baseada em taxa pode usar janela de avaliação de 1, 2, 5 ou 10 minutos, e o menor limite aceito é de 10 requisições.", a:true,
     e:"Correto. As janelas válidas são 60, 120, 300 e 600 segundos (300 é o padrão), e o limite mínimo é 10. A janela define quanto tempo para trás o WAF olha a cada verificação, não a frequência da verificação."},
    {t:"Com a ACL da web associada só ao ALB, uma regra por IP de origem limita cada cliente individualmente, mesmo com o CloudFront na frente.", a:false,
     e:"Atrás do CloudFront, o IP de origem que o ALB vê é o do servidor de borda, que concentra muitos clientes. É preciso agregar pelo IP num cabeçalho, como X-Forwarded-For, ou associar a ACL à distribuição do CloudFront."},
    {t:"O Bot Control é um grupo de regras gerenciado com cobrança adicional, além do custo normal da ACL da web e das requisições.", a:true,
     e:"Correto. A documentação avisa que há taxas adicionais pelo uso desse grupo de regras gerenciado, por isso convém limitar seu escopo às partes do site que precisam dele."}
  ],
  src:[
    {t:"AWS WAF: Bot Control",u:"https://docs.aws.amazon.com/waf/latest/developerguide/waf-bot-control.html"},
    {t:"AWS WAF: configurações da regra baseada em taxa",u:"https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based-high-level-settings.html"}
  ]
},
{
  id:"saa-d1-41", exam:"saa", dom:"d1", lvl:5, type:"single", sec:130,
  tags:["iam-permissoes","containers-serverless"],
  case:"Uma empresa tem seis clusters do Amazon EKS e cria novos todo trimestre. Hoje a função do IAM dos nós dá a todos os pods acesso a todos os buckets e tabelas. Requisitos: cada aplicação deve ter só as permissões dela, mesmo dividindo o nó com outras; nenhuma chave de acesso de longo prazo; e a equipe de IAM não quer criar provedor de identidade OIDC nem editar a política de confiança das funções a cada cluster novo.",
  stem:"Qual solução atende aos três requisitos?",
  opts:[
    {k:"A",t:"Funções do IAM para contas de serviço (IRSA), com um provedor OIDC por cluster e a política de confiança de cada função listando os clusters."},
    {k:"B",t:"EKS Pod Identity, com o complemento do agente nos clusters e uma associação entre a conta de serviço de cada aplicação e a função dela."},
    {k:"C",t:"Um grupo de nós gerenciado por aplicação, cada um com a própria função do IAM, e seletores de nó para fixar cada aplicação no seu grupo."},
    {k:"D",t:"Um usuário do IAM por aplicação, com a chave de acesso guardada num Secret do Kubernetes e montada como variável de ambiente no pod."}
  ],
  ans:["B"],
  why:{
    ok:"O EKS Pod Identity entrega credenciais temporárias por conta de serviço, então cada pod recebe só a função da sua aplicação. Ele não usa provedor OIDC, e a política de confiança aponta para um único principal de serviço (pods.eks.amazonaws.com). A mesma função serve em vários clusters: basta criar a associação em cada cluster novo, sem editar a confiança.",
    A:"O IRSA dá permissão por pod e sem chave de longo prazo, então atende aos dois primeiros requisitos. Mas exige um provedor OIDC por cluster e um principal diferente por cluster na política de confiança, justamente o que a equipe de IAM não quer manter.",
    C:"A permissão fica no nó, não no pod. Qualquer pod agendado ali herda a função, e o desenho multiplica grupos de nós mal aproveitados. Falha no privilégio por aplicação e no esforço.",
    D:"Separa as permissões por aplicação, mas usa chaves de acesso de longo prazo, que precisam ser trocadas e podem vazar. Falha no segundo requisito."
  },
  src:[
    {t:"EKS: Pod Identity",u:"https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html"}
  ]
},

/* ===================== D2: Arquiteturas resilientes ===================== */
{
  id:"saa-d2-32", exam:"saa", dom:"d2", lvl:5, type:"single", sec:130,
  tags:["dados-resilientes"],
  case:"Uma instância RDS for MySQL 8.0 Multi-AZ, com 3 TB, será trocada por um cluster Aurora MySQL na mesma conta e região. Requisitos: a parada de escrita na virada deve durar poucos minutos; nenhuma transação confirmada pode se perder; e a equipe quer o menor esforço operacional, sem instância de replicação para dimensionar nem usuários, gatilhos e procedimentos para recriar à mão.",
  stem:"Qual caminho de migração atende?",
  opts:[
    {k:"A",t:"Tirar um snapshot da instância, migrá-lo para um cluster Aurora MySQL e apontar a aplicação para o cluster quando a restauração terminar."},
    {k:"B",t:"Criar uma réplica de leitura do Aurora a partir da instância, parar as escritas, esperar o atraso zerar e promover a réplica a cluster."},
    {k:"C",t:"Criar o esquema no Aurora e usar uma tarefa do AWS DMS com carga completa e CDC, apontando a aplicação ao Aurora quando o atraso zerar."},
    {k:"D",t:"Exportar o banco com mysqldump para o S3 durante a madrugada e importar no Aurora, com a aplicação parada até o fim da importação."}
  ],
  ans:["B"],
  why:{
    ok:"A réplica de leitura do Aurora é criada a partir de um snapshot interno da instância e depois recebe as mudanças por replicação de log binário, então o Aurora fica sincronizado enquanto a produção segue normal. Na virada, você para as escritas, espera o atraso chegar a zero (nada se perde) e promove a réplica: a parada é de minutos. Como a cópia é física, usuários, gatilhos e procedimentos vêm junto, e não há instância de replicação para operar.",
    A:"A migração do snapshot leva horas para 3 TB. Ou a aplicação fica parada esse tempo todo, ou tudo que for gravado depois do snapshot se perde. Falha nos dois primeiros requisitos.",
    C:"Atende à parada curta e à perda zero, mas exige tarefa, monitoramento e, no modo provisionado, uma instância de replicação para dimensionar. Mesmo com o DMS Serverless, que dispensa essa instância, o DMS cria só tabelas, chaves primárias e, às vezes, índices únicos, então usuários, gatilhos e procedimentos teriam de ser recriados à mão. Falha no menor esforço.",
    D:"Um despejo lógico de 3 TB, mais a importação, deixa a aplicação parada por horas. Falha no requisito de parada de poucos minutos."
  },
  src:[
    {t:"Aurora: migrar do RDS for MySQL com réplica de leitura",u:"https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Migrating.RDSMySQL.Replica.html"},
    {t:"DMS: visão geral do funcionamento",u:"https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.HighLevelView.html"}
  ]
},
{
  id:"saa-d2-33", exam:"saa", dom:"d2", lvl:5, type:"single", sec:120,
  tags:["desacoplamento"],
  case:"Um SaaS gera relatórios pesados em segundo plano para clientes do plano empresarial e do plano gratuito. Requisitos: sempre que houver trabalhos dos dois planos esperando, os do plano empresarial começam primeiro; uma única frota de instâncias EC2, com o mesmo código, atende os dois planos e cresce com a fila acumulada; e nenhum pedido pode se perder.",
  stem:"Qual desenho atende?",
  opts:[
    {k:"A",t:"Uma fila FIFO do SQS com um ID de grupo de mensagens por plano, e a frota lendo a fila com o grupo empresarial configurado como prioritário."},
    {k:"B",t:"Uma fila padrão do SQS com um atributo de mensagem de prioridade, e cada leitura pedindo ao SQS só as mensagens do plano empresarial."},
    {k:"C",t:"Um tópico do SNS com filtro por plano entregando em duas filas, cada uma com a própria frota de instâncias e o próprio dimensionamento."},
    {k:"D",t:"Duas filas padrão do SQS, uma por plano; cada trabalhador lê a empresarial e só busca na gratuita quando ela volta vazia."}
  ],
  ans:["D"],
  why:{
    ok:"O SQS não tem prioridade dentro de uma fila, então a prioridade sai do desenho: uma fila por plano e um laço que sempre consulta a fila empresarial primeiro (com espera curta) e só então a gratuita. A mesma frota e o mesmo código atendem as duas filas, e o Auto Scaling pode escalar pela soma das mensagens visíveis nas duas por instância. As mensagens ficam guardadas na fila até serem processadas e apagadas.",
    A:"A FIFO garante ordem dentro de cada grupo, não prioridade entre grupos, e não existe configuração de grupo prioritário. Os trabalhos gratuitos continuariam sendo entregues junto com os empresariais. Falha no primeiro requisito.",
    B:"O ReceiveMessage não filtra por atributo: o SQS entrega o que estiver disponível e o trabalhador só descobre o plano depois de receber. Falha no requisito de prioridade.",
    C:"Isola os planos e não perde pedidos, mas são duas frotas separadas, com capacidade ociosa numa enquanto a outra enche. Falha no requisito de uma única frota com o mesmo dimensionamento."
  },
  src:[
    {t:"EC2 Auto Scaling: escalar com base no SQS",u:"https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html"},
    {t:"SQS: tipos de fila",u:"https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-queue-types.html"}
  ]
},
{
  id:"saa-d2-34", exam:"saa", dom:"d2", lvl:5, type:"single", sec:130,
  tags:["desacoplamento","containers-serverless"],
  case:"A tabela de pedidos do DynamoDB é a fonte da verdade. Cinco equipes querem reagir quando o status de um pedido muda, cada uma com as próprias regras de roteamento e destinos. Requisitos: só modificações de status viram evento, no formato de domínio combinado entre as equipes; cada equipe se inscreve e filtra sozinha, sem depender das outras; e nenhum código próprio para escrever e manter na integração, nem mudança na aplicação que grava os pedidos.",
  stem:"Qual arquitetura atende?",
  opts:[
    {k:"A",t:"DynamoDB Streams como origem de um EventBridge Pipe com filtro de status e transformação de entrada, entregando num barramento personalizado."},
    {k:"B",t:"DynamoDB Streams acionando uma função Lambda que filtra as mudanças de status, monta o evento e publica no barramento com PutEvents."},
    {k:"C",t:"DynamoDB Streams como origem de um EventBridge Pipe com filtro de status e transformação de entrada, entregando numa fila do SQS."},
    {k:"D",t:"Alterar a aplicação para publicar o evento num tópico do SNS logo depois de gravar o pedido, com filtros de assinatura por equipe."}
  ],
  ans:["A"],
  why:{
    ok:"O EventBridge Pipes lê o fluxo do DynamoDB, aplica um filtro (só registros de modificação em que o status mudou), usa a transformação de entrada para gerar o formato de domínio e entrega num barramento de eventos da mesma conta e região, que é um destino suportado. No barramento, cada equipe cria a própria regra, com filtro e destinos, sem tocar nas outras. Tudo é configuração: não há código de integração nem mudança na aplicação.",
    B:"Funciona e entrega no barramento, então atende ao filtro e à independência das equipes. Mas é código próprio para escrever, versionar e manter, justamente o que o terceiro requisito proíbe.",
    C:"Atende ao filtro e não exige código, mas uma fila é ponto a ponto: o primeiro consumidor que apaga a mensagem a tira das outras equipes. Falha no requisito de cada equipe se inscrever e filtrar sozinha.",
    D:"O SNS com filtros dá independência às equipes, mas exige mudar a aplicação. É gravação dupla: se a publicação falhar depois de gravar, o evento se perde. Falha no terceiro requisito."
  },
  src:[
    {t:"EventBridge Pipes: origem DynamoDB Streams",u:"https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-dynamodb.html"},
    {t:"EventBridge Pipes: destinos",u:"https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-target.html"}
  ]
},
{
  id:"saa-d2-35", exam:"saa", dom:"d2", lvl:5, type:"multi", sec:140,
  tags:["desacoplamento"],
  case:"Uma função Lambda consome uma fila padrão do SQS em lotes de 10 mensagens e grava num banco RDS que aguenta cerca de 50 conexões vindas desse consumidor. Dois problemas: quando uma mensagem do lote falha, as outras nove, já processadas, voltam para a fila e são gravadas de novo; e nos picos a função escala para centenas de execuções e satura o banco. Requisito extra: a solução não pode provocar erros de limitação (throttling) da função.",
  stem:"Quais configurações resolvem os dois problemas? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Ativar ReportBatchItemFailures no mapeamento de origem de eventos e fazer a função devolver só os IDs das mensagens que falharam."},
    {k:"B",t:"Definir a concorrência reservada da função em 40, para que ela nunca passe de 40 execuções simultâneas ao consumir a fila."},
    {k:"C",t:"Definir a concorrência máxima do mapeamento de origem de eventos do SQS em 40, limitando quantas execuções essa fila dispara."},
    {k:"D",t:"Configurar um destino em caso de falha no mapeamento de origem de eventos do SQS, para onde vão as mensagens com erro."},
    {k:"E",t:"Aumentar o tamanho do lote para 100 e usar uma janela de agrupamento de 30 segundos, para reduzir o número de execuções."}
  ],
  ans:["A","C"],
  why:{
    ok:"Sem resposta parcial de lote, um erro faz o lote inteiro voltar a ficar visível, e as mensagens bem processadas são repetidas. Com ReportBatchItemFailures, a função devolve em batchItemFailures só os IDs que falharam, e apenas eles voltam para a fila. A concorrência máxima é uma configuração do próprio mapeamento do SQS: o Lambda simplesmente não dispara mais que esse número de execuções para a fila, sem erro de limitação, e o restante espera na fila. Ela é gratuita e independente da concorrência reservada.",
    B:"Limita a função, mas o poller continua tentando invocar acima do limite e recebe erros de limitação, o que o requisito proíbe. A própria documentação recomenda a concorrência máxima para controlar o consumo de uma fila.",
    D:"O destino em caso de falha do mapeamento de origem de eventos existe para Kinesis, DynamoDB Streams e Kafka, não para o SQS. No SQS, as mensagens com falhas repetidas vão para uma fila de mensagens mortas configurada na própria fila. E isso não evita as repetições do lote.",
    E:"Menos execuções não limitam a concorrência nos picos, e um lote maior piora o primeiro problema: uma falha passaria a repetir até 99 mensagens já processadas."
  },
  src:[
    {t:"Lambda: tratamento de erros com SQS",u:"https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html"},
    {t:"Lambda: escalabilidade e concorrência máxima com SQS",u:"https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html"}
  ]
},
{
  id:"saa-d2-36", exam:"saa", dom:"d2", lvl:5, type:"single", sec:120,
  tags:["alta-disponibilidade","containers-serverless"],
  case:"Doze microsserviços rodam no Amazon ECS com Fargate e se chamam por HTTP. Quando uma tarefa trava, quem chama continua mandando requisições para ela até o DNS expirar, e os erros se espalham. Requisitos: chamar os serviços por nomes curtos; quem chama deve tirar do rodízio as tarefas com falha e repetir a tentativa em outra, sem lógica nova no código; e nada de um balanceador de carga interno por serviço, por custo.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Descoberta de serviço do ECS com registros DNS no AWS Cloud Map, com TTL baixo e verificação de saúde personalizada em cada serviço."},
    {k:"B",t:"Um Application Load Balancer interno por serviço, com verificações de saúde e nomes amigáveis numa zona hospedada privada do Route 53."},
    {k:"C",t:"ECS Service Connect num namespace do Cloud Map, com o proxy gerenciado em cada tarefa fazendo detecção de valores atípicos e repetição."},
    {k:"D",t:"AWS App Mesh com proxies Envoy nas tarefas, rotas virtuais por serviço e políticas de nova tentativa e detecção de valores atípicos."}
  ],
  ans:["C"],
  why:{
    ok:"O Service Connect injeta um proxy gerenciado em cada tarefa e registra os serviços num namespace do Cloud Map. A aplicação chama nomes curtos, e o proxy distribui as requisições em rodízio, aplica detecção de valores atípicos (tira do conjunto as tarefas que estão falhando) e faz novas tentativas, tudo como configuração do ECS. Não há balanceador por serviço, e ainda vêm métricas padronizadas de cada conexão.",
    A:"Dá nomes por DNS sem balanceador, então atende ao primeiro e ao terceiro requisito. Mas o cliente continua usando IPs em cache até o TTL expirar e não há nova tentativa nem detecção de valores atípicos sem código. Falha no segundo requisito.",
    B:"Resolve a saúde e os nomes, mas são doze balanceadores cobrados por hora e por uso, exatamente o que o terceiro requisito proíbe.",
    D:"O App Mesh foi descontinuado em 30 de setembro de 2026, e a AWS indica o ECS Service Connect como caminho de migração. Não é opção para um desenho novo."
  },
  src:[
    {t:"ECS: Service Connect",u:"https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-connect.html"},
    {t:"Migrar do App Mesh para o ECS Service Connect",u:"https://aws.amazon.com/blogs/containers/migrating-from-aws-app-mesh-to-amazon-ecs-service-connect/"}
  ]
},

/* ===================== D3: Arquiteturas de alto desempenho ===================== */
{
  id:"saa-d3-30", exam:"saa", dom:"d3", lvl:5, type:"single", sec:130,
  tags:["dados-analise"],
  case:"Cinquenta mil sensores enviam leituras para um fluxo do Kinesis Data Streams, com o ID do sensor como chave de partição. A fábrica quer a média por linha de produção (cada linha tem sensores em vários shards) em janelas de 1 minuto. Requisitos: a janela deve seguir o horário da leitura gravado no sensor, aceitando leituras que chegam até 30 segundos atrasadas; o resultado deve sair em segundos; e o serviço precisa ser gerenciado.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Uma função Lambda ligada ao fluxo com janela em cascata de 60 segundos, somando as leituras de cada linha no estado da janela."},
    {k:"B",t:"Uma aplicação no Managed Service for Apache Flink, com janela em cascata por horário do evento e marcas d'água de 30 s."},
    {k:"C",t:"Uma aplicação SQL do Amazon Kinesis Data Analytics com janela em cascata sobre o horário do evento e saída em outro fluxo."},
    {k:"D",t:"Um fluxo do Amazon Data Firehose para o S3 com buffer de 60 segundos e uma consulta do Athena agendada a cada minuto."}
  ],
  ans:["B"],
  why:{
    ok:"O Flink trabalha com horário do evento: as marcas d'água dizem até quando esperar por leituras atrasadas antes de fechar cada janela, então os 30 segundos de atraso são tratados. Ele agrupa por linha de produção depois de ler todos os shards, entrega o resultado em segundos e roda num serviço gerenciado, sem servidores para administrar.",
    A:"É gerenciado e rápido, mas a janela em cascata do Lambda é calculada por shard e pelo horário em que o registro entrou no fluxo, não pelo horário da leitura. Não junta sensores da mesma linha espalhados por shards nem trata atraso. Falha no primeiro requisito.",
    C:"O Kinesis Data Analytics para SQL foi descontinuado: não aceita aplicações novas desde 15 de outubro de 2025, e as existentes passaram a ser apagadas a partir de 27 de janeiro de 2026. O caminho indicado é o Managed Service for Apache Flink.",
    D:"O buffer do Firehose agrupa pela chegada, e a consulta agendada soma ao menos mais um minuto de atraso. Falha na janela por horário do evento e no resultado em segundos."
  },
  src:[
    {t:"Managed Service for Apache Flink: tempo de evento",u:"https://docs.aws.amazon.com/managed-flink/latest/java/how-time.html"},
    {t:"Lambda: janelas em cascata no Kinesis",u:"https://docs.aws.amazon.com/lambda/latest/dg/services-kinesis-windows.html"}
  ]
},
{
  id:"saa-d3-31", exam:"saa", dom:"d3", lvl:5, type:"single", sec:120,
  tags:["dados-analise","custo-banco-rede"],
  case:"Um cluster provisionado do Amazon Redshift com nós RA3 e criptografia ativada, na conta de dados, roda as cargas de ETL. A equipe financeira, em outra conta, precisa consultar com SQL os dados assim que cada carga é confirmada. Requisitos: as consultas pesadas do fechamento do mês não podem disputar recursos com o ETL; o custo de computação dessas consultas deve cair na conta da equipe financeira; e os dados não podem ser copiados nem exportados.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Ativar o escalonamento de simultaneidade no cluster de ETL e criar usuários para a equipe financeira com acesso só às tabelas dela."},
    {k:"B",t:"Rodar UNLOAD toda noite para o S3 em Parquet e deixar a equipe financeira consultar os arquivos com o Athena na própria conta."},
    {k:"C",t:"Compartilhar um snapshot do cluster com a conta financeira, que restaura um cluster próprio no começo de cada fechamento."},
    {k:"D",t:"Criar um datashare para a conta financeira e consumi-lo num grupo de trabalho do Redshift Serverless dessa mesma conta."}
  ],
  ans:["D"],
  why:{
    ok:"O compartilhamento de dados do Redshift dá acesso aos dados vivos, sem cópia: eles ficam disponíveis ao consumidor assim que a transação de escrita é confirmada. A consulta roda na computação do consumidor, aqui um grupo de trabalho Serverless separado, então não disputa recursos com o ETL. Pela regra do serviço, o consumidor paga a computação, e o produtor paga o armazenamento. Entre contas, produtor e consumidor precisam estar criptografados.",
    A:"Os clusters extras do escalonamento de simultaneidade aliviam a fila e usam dados atuais, mas a cobrança é da conta do cluster de ETL, e tudo continua sendo um único cluster. Falha no requisito de custo na conta financeira.",
    B:"A computação do Athena seria cobrada na conta financeira, mas o UNLOAD exporta e copia os dados, e eles ficam até um dia desatualizados. Falha na proibição de cópia e no frescor.",
    C:"O cluster restaurado é uma cópia congelada no momento do snapshot e leva tempo para subir. Falha no frescor dos dados e na proibição de cópia."
  },
  src:[
    {t:"Redshift: compartilhamento de dados",u:"https://docs.aws.amazon.com/redshift/latest/dg/datashare-overview.html"},
    {t:"Redshift: considerações gerais do compartilhamento",u:"https://docs.aws.amazon.com/redshift/latest/dg/considerations-datashare-general.html"}
  ]
},
{
  id:"saa-d3-32", exam:"saa", dom:"d3", lvl:5, type:"multi", sec:130,
  tags:["computacao-armazenamento"],
  case:"Servidores Linux de uma fábrica gravam e leem arquivos por NFS. Os arquivos da semana corrente, cerca de 2 TB, precisam abrir com latência de rede local. Todos os arquivos devem virar objetos no S3, no formato original, para consultas do Athena. Um pipeline na nuvem grava arquivos de resultado direto no bucket, e eles devem aparecer no compartilhamento local em até 10 minutos.",
  stem:"Quais escolhas, juntas, atendem? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Um Volume Gateway com volumes em cache, montado pelos servidores, com o cache local dimensionado para os 2 TB da semana."},
    {k:"B",t:"Um S3 File Gateway na fábrica, com um compartilhamento NFS ligado ao bucket e o cache local dimensionado para os dados da semana."},
    {k:"C",t:"Um Amazon FSx File Gateway na fábrica, com um compartilhamento ligado a um sistema de arquivos FSx que exporta para o bucket."},
    {k:"D",t:"A atualização automática do cache no compartilhamento do gateway, com TTL de até 10 minutos, para enxergar o que foi gravado direto no S3."},
    {k:"E",t:"Uma tarefa do AWS DataSync agendada que copia do bucket para um NAS local os arquivos de resultado do pipeline."}
  ],
  ans:["B","D"],
  why:{
    ok:"O S3 File Gateway expõe o bucket como compartilhamento NFS e grava cada arquivo como um objeto no formato original, pronto para o Athena. O cache local guarda os dados mais usados e dá latência de rede local. O gateway mantém um inventário do bucket e não percebe sozinho o que outro processo gravou direto no S3. A atualização automática do cache por TTL refaz a listagem do diretório quando ele é acessado depois do prazo, então os resultados aparecem dentro dos 10 minutos.",
    A:"O Volume Gateway expõe volumes iSCSI de blocos, não arquivos por NFS. Os dados ficam como volumes e snapshots, não como objetos no formato original que o Athena consegue ler.",
    C:"O FSx File Gateway não está mais disponível para novos clientes. Além disso, ele atende compartilhamentos SMB do FSx for Windows File Server, não NFS sobre o S3.",
    E:"O DataSync copia dados, mas não oferece um compartilhamento com cache, e uma tarefa agendada roda no máximo uma vez por hora, o que não garante os 10 minutos. Também exige manter um NAS local a mais."
  },
  src:[
    {t:"S3 File Gateway: atualização do cache",u:"https://docs.aws.amazon.com/filegateway/latest/files3/refresh-cache.html"},
    {t:"FSx File Gateway: aviso de disponibilidade",u:"https://docs.aws.amazon.com/filegateway/latest/filefsxw/available-regions-intro.html"}
  ]
},
{
  id:"saa-d3-33", exam:"saa", dom:"d3", lvl:5, type:"order", sec:110,
  tags:["rede-desempenho"],
  case:"Instâncias numa VPC precisam resolver app.corp.local, um nome que só existe no DNS do datacenter. Há um Direct Connect entre a VPC e o datacenter. A equipe criou um endpoint de saída do Route 53 VPC Resolver (o antigo Route 53 Resolver) e uma regra de encaminhamento para corp.local associada à VPC.",
  stem:"Ordene o caminho da consulta DNS de uma instância, do PRIMEIRO ao ÚLTIMO passo.",
  items:[
    {t:"A instância envia a consulta ao VPC Resolver, no endereço reservado da VPC (o IP da base do bloco CIDR mais dois)."},
    {t:"O VPC Resolver compara o nome com as regras associadas à VPC e encontra a regra de encaminhamento de corp.local."},
    {t:"A consulta sai pelas interfaces de rede do endpoint de saída, com IP privado da VPC, e segue pelo Direct Connect."},
    {t:"O servidor DNS do datacenter resolve o nome, e a resposta volta pelo endpoint de saída e pelo VPC Resolver até a instância."}
  ],
  e:"A instância sempre pergunta primeiro ao resolvedor da própria VPC. Ele verifica as regras associadas à VPC: como existe uma regra de encaminhamento para corp.local, a consulta não é resolvida localmente, e sim enviada pelo endpoint de saída, cujos IPs privados são a origem das consultas para o datacenter, por Direct Connect ou VPN. O DNS local responde, e a resposta faz o caminho inverso. Para o sentido contrário, do datacenter para nomes da VPC, usa-se um endpoint de entrada.",
  src:[
    {t:"Route 53: encaminhar consultas de saída",u:"https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-forwarding-outbound-queries.html"},
    {t:"O que é o Route 53 VPC Resolver",u:"https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html"}
  ]
},
{
  id:"saa-d3-34", exam:"saa", dom:"d3", lvl:5, type:"single", sec:130,
  tags:["banco-cache"],
  case:"Uma loja roda em us-east-1 com Aurora MySQL 3.08, com transações e consultas com junções. Ela vai atender clientes na Europa e na Ásia com servidores de aplicação nessas regiões. Requisitos: leituras com baixa latência dentro de cada região; as poucas escritas feitas nas regiões secundárias (carrinho, preferências) devem funcionar sem a aplicação manter uma conexão extra nem lógica para mandar escritas a outra região; e o modelo relacional não pode ser reescrito.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Aurora Global Database com secundários na Europa e na Ásia, encaminhamento de escrita e consistência no grupo de parâmetros."},
    {k:"B",t:"Aurora Global Database com clusters secundários na Europa e na Ásia, e as aplicações dessas regiões gravando direto no endpoint do cluster primário."},
    {k:"C",t:"Tabelas globais do DynamoDB nas três regiões, com cada aplicação lendo e gravando na réplica local da tabela."},
    {k:"D",t:"Um armazenamento global de dados do ElastiCache com réplicas na Europa e na Ásia, à frente do Aurora em us-east-1."}
  ],
  ans:["A"],
  why:{
    ok:"No Aurora Global Database, cada região secundária tem um cluster com leitura local. Com o encaminhamento de escrita, a secundária repassa as instruções de escrita ao primário, que grava e replica de volta, e o próprio Aurora cuida da rede entre regiões e do contexto da transação. A aplicação usa só o endpoint local. No Aurora MySQL 3.04 ou superior, o parâmetro aurora_replica_read_consistency pode ficar no grupo de parâmetros do cluster, sem mexer em cada sessão.",
    B:"Dá leitura local e mantém o modelo relacional, mas cada aplicação secundária precisa de uma segunda conexão e de lógica para mandar escritas ao primário em outra região. Falha no segundo requisito.",
    C:"As tabelas globais aceitam escrita local em todas as regiões, mas exigem trocar o modelo relacional, com junções e transações SQL, por chave e valor. Falha no terceiro requisito.",
    D:"O cache acelera leituras, mas as escritas continuariam indo para us-east-1 por conta da aplicação, e os dados em cache podem ficar desatualizados. Falha no segundo requisito."
  },
  src:[
    {t:"Aurora: encaminhamento de escrita no Global Database",u:"https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database-write-forwarding.html"},
    {t:"Aurora MySQL: encaminhamento de escrita",u:"https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database-write-forwarding-ams.html"}
  ]
},

/* ===================== D4: Arquiteturas com custo otimizado ===================== */
{
  id:"saa-d4-26", exam:"saa", dom:"d4", lvl:5, type:"single", sec:130,
  tags:["custo-armazenamento"],
  case:"Quarenta microsserviços no ECS enviam 8 TB de logs por mês ao CloudWatch Logs, e a ingestão é 85% da conta do serviço. Os logs só são usados em investigações eventuais com consultas do Logs Insights; ninguém usa filtros de métrica, filtros de assinatura nem Live Tail. Requisitos: reduzir bastante o custo; manter as investigações no Logs Insights, sem ferramenta nova; e não mudar o código das aplicações.",
  stem:"Qual mudança atende?",
  opts:[
    {k:"A",t:"Alterar a classe dos grupos de log atuais de Standard para Essentials (antiga Infrequent Access), mantendo a mesma configuração do driver de log."},
    {k:"B",t:"Enviar os logs pelo FireLens a um fluxo do Amazon Data Firehose que grava no S3, e investigar com consultas do Athena sobre os arquivos."},
    {k:"C",t:"Criar novos grupos de log na classe Essentials (antiga Infrequent Access) e apontar para eles o driver de log nas definições de tarefa."},
    {k:"D",t:"Reduzir a retenção de um ano para 30 dias e criar um filtro de assinatura que leva uma cópia dos logs para o S3 com o Firehose."}
  ],
  ans:["C"],
  why:{
    ok:"A classe Essentials, que antes se chamava Infrequent Access, cobra um preço de ingestão por GB menor. As duas classes só diferem no custo de ingestão: armazenamento e Logs Insights custam igual. Ela aceita consultas do Logs Insights e abre mão de filtros de métrica, filtros de assinatura e Live Tail, que ninguém usa. Como a classe é escolhida na criação, criam-se grupos novos e muda-se só a definição de tarefa, sem tocar no código.",
    A:"Seria o ideal, mas não é possível: depois que o grupo de log é criado, a classe dele não pode ser alterada.",
    B:"Corta a ingestão no CloudWatch e não exige mudar o código, então atende ao custo e ao terceiro requisito. Mas troca o Logs Insights pelo Athena, que o segundo requisito proíbe.",
    D:"A ingestão, que é 85% da conta, continua cobrada inteira no Standard, e o filtro de assinatura ainda soma o custo do Firehose. Falha no requisito de reduzir bastante o custo."
  },
  src:[
    {t:"CloudWatch Logs: classes de log",u:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html"}
  ]
},
{
  id:"saa-d4-27", exam:"saa", dom:"d4", lvl:5, type:"single", sec:130,
  tags:["custo-computacao","containers-serverless"],
  case:"Um cluster do Amazon EKS usa três grupos de nós gerenciados sob demanda, todos m5.2xlarge, com uso médio de 35%. Rodam APIs sem estado, com réplicas em várias zonas e orçamento de interrupção de pods, e trabalhos em lote que aceitam ser interrompidos. Requisitos: reduzir bastante o custo usando Spot onde der; tirar os pods com antecedência quando um nó Spot for interrompido; e trocar automaticamente nós subutilizados por menos nós ou por tipos de instância menores e mais baratos.",
  stem:"Qual solução atende aos três requisitos?",
  opts:[
    {k:"A",t:"Trocar os grupos por um grupo de nós gerenciado Spot só com m5.2xlarge, mantendo o Cluster Autoscaler com as mesmas configurações."},
    {k:"B",t:"Mover todas as cargas para perfis do Fargate no EKS usando o Fargate Spot, e eliminar os grupos de nós gerenciados do cluster."},
    {k:"C",t:"Comprar um Compute Savings Plan de três anos que cubra o gasto atual dos três grupos de nós e manter o Cluster Autoscaler."},
    {k:"D",t:"Usar o Karpenter com um NodePool Spot e sob demanda, muitos tipos de instância, consolidação ativada e fila de interrupção no SQS."}
  ],
  ans:["D"],
  why:{
    ok:"O Karpenter escolhe o tipo de instância que melhor encaixa os pods pendentes. Com muitos tipos liberados, ele usa a estratégia de preço e capacidade otimizados nos pools Spot mais profundos, o que reduz interrupções, e pode recorrer ao sob demanda. A consolidação junta pods e remove nós subutilizados ou os troca por instâncias menores e mais baratas. Com a fila de interrupção do SQS, ele recebe o aviso de dois minutos do Spot e esvazia o nó antes da retomada.",
    A:"Usa Spot, e o grupo gerenciado Spot tem o rebalanceamento de capacidade ativado: ao receber a recomendação de rebalanceamento, o EKS sobe um nó substituto e esvazia o nó em risco. Atende ao primeiro e ao segundo requisito. Mas o grupo fica preso ao m5.2xlarge: o Cluster Autoscaler só remove nós inteiros desse tipo, nunca troca por um tipo menor. Falha no terceiro requisito, e um único tipo ainda aumenta o risco de falta de capacidade Spot.",
    B:"O Amazon EKS não suporta Fargate Spot (ele existe só no ECS). Sem ele, o Fargate sob demanda não traz o desconto do Spot pedido.",
    C:"O desconto vale sobre a capacidade atual, mas o cluster continua pagando pelos 65% ociosos e não usa Spot. Falha no primeiro e no terceiro requisito, e ainda cria um compromisso de três anos."
  },
  src:[
    {t:"EKS: boas práticas do Karpenter",u:"https://docs.aws.amazon.com/eks/latest/best-practices/karpenter.html"},
    {t:"EKS: grupos de nós gerenciados (Spot)",u:"https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html"}
  ]
},
{
  id:"saa-d4-28", exam:"saa", dom:"d4", lvl:5, type:"multi", sec:130,
  tags:["custo-banco-rede"],
  case:"A equipe de QA precisa, toda manhã, de oito ambientes de teste, cada um com uma cópia completa do cluster Aurora PostgreSQL 16 de produção (6 TB) daquela manhã. Os testes gravam dados, mas alteram poucos por cento das páginas, e cada ambiente é usado por cerca de quatro horas. Requisitos: ambiente pronto em minutos; o menor custo de armazenamento possível; e computação cobrada só enquanto o ambiente é usado.",
  stem:"Quais medidas, juntas, atendem? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Criar cada ambiente como um clone do Aurora do cluster de produção, com o protocolo de cópia na gravação."},
    {k:"B",t:"Restaurar o snapshot automático mais recente de produção num cluster novo para cada ambiente, toda manhã."},
    {k:"C",t:"Adicionar oito réplicas do Aurora ao cluster de produção e apontar cada ambiente de teste para uma delas."},
    {k:"D",t:"Exportar produção com pg_dump toda noite para o S3 e importar o arquivo num cluster novo por ambiente."},
    {k:"E",t:"Usar instâncias Aurora Serverless v2 com mínimo de 0 ACU (pausa automática) nos clones e apagá-los ao fim do dia."}
  ],
  ans:["A","E"],
  why:{
    ok:"O clone compartilha as páginas do volume de origem e só grava páginas novas quando algo muda (cópia na gravação). Por isso fica pronto em minutos, sem copiar 6 TB, e cada clone paga só pelo que diverge da produção. Até 15 clones podem usar cópia na gravação; acima disso vira cópia completa, e oito cabem com folga. Instâncias Serverless v2 acompanham o uso dos testes; com mínimo de 0 ACU, a instância pausa sozinha quando fica sem conexões e a cobrança dela vai a zero (o Aurora PostgreSQL 16.3 ou superior aceita isso). Apagar os clones ao fim do dia encerra também o armazenamento que divergiu.",
    B:"Cada restauração leva bem mais que minutos para 6 TB e cria um volume completo por ambiente, oito vezes o armazenamento. Falha na rapidez e no custo.",
    C:"As réplicas do Aurora são só de leitura, e os testes gravam. Elas também ficariam no cluster de produção, cobrando computação o dia inteiro e arriscando afetar a produção.",
    D:"Despejar e importar 6 TB leva horas e grava uma cópia completa por ambiente. Falha na rapidez e no custo de armazenamento."
  },
  src:[
    {t:"Aurora: clonar um volume",u:"https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html"},
    {t:"Aurora Serverless v2: pausa automática com 0 ACU",u:"https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html"}
  ]
},
{
  id:"saa-d4-29", exam:"saa", dom:"d4", lvl:5, type:"single", sec:120,
  tags:["custo-armazenamento","criptografia-segredos"],
  case:"Um bucket de data lake usa SSE-KMS com uma chave gerenciada pelo cliente, e a conformidade exige manter essa mesma chave, com a política controlada pela segurança. Trabalhos do Spark leem e gravam bilhões de objetos por mês, e a cobrança de requisições do KMS já passou o custo de armazenamento do bucket. Requisitos: manter a mesma chave do KMS; não mudar o código dos trabalhos; e reduzir bastante o custo com o KMS.",
  stem:"Qual mudança atende?",
  opts:[
    {k:"A",t:"Trocar a criptografia padrão do bucket para SSE-S3 e manter a chave do KMS apenas para os prefixos com dados mais sensíveis."},
    {k:"B",t:"Ativar a S3 Bucket Key na criptografia padrão e regravar com CopyObject os objetos existentes mais acessados."},
    {k:"C",t:"Trocar a chave gerenciada pelo cliente pela chave gerenciada pela AWS aws/s3, que dispensa a política de chave da segurança."},
    {k:"D",t:"Cifrar no cliente com o AWS Encryption SDK e o cache de chaves de dados, gravando os objetos já cifrados no bucket."}
  ],
  ans:["B"],
  why:{
    ok:"Com a chave de bucket, o S3 gera uma chave de nível de bucket a partir da chave do KMS e passa a criar as chaves de dados localmente, o que reduz as requisições ao KMS em até 99%. A chave do KMS continua a mesma e não há mudança no código. Os objetos que já existem só passam a usar a chave de bucket quando são copiados de novo. Um detalhe: o contexto de criptografia passa a ser o ARN do bucket, então políticas que usam o ARN do objeto precisam de ajuste.",
    A:"Elimina o custo do KMS sem mudar o código, mas a maior parte dos dados deixa de usar a chave gerenciada pelo cliente. Falha no primeiro requisito.",
    C:"A chave gerenciada pela AWS tem política que o cliente não pode editar, e é outra chave. Falha na exigência de manter a mesma chave sob controle da segurança.",
    D:"O cache de chaves de dados reduz as chamadas ao KMS, mas exige reescrever os trabalhos do Spark para cifrar e decifrar no cliente. Falha no requisito de não mudar o código."
  },
  src:[
    {t:"S3: reduzir custo do SSE-KMS com S3 Bucket Keys",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html"}
  ]
}
];
QUESTIONS_SAA.push(...QUESTIONS_SAA_MAX);
