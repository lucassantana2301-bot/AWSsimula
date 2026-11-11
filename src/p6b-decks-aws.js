/* ============================================================
   BARALHOS DE CLASSIFICAÇÃO — AWS (SAA-C03 e CLF-C02), lote 2
   Revisados contra a documentação oficial (nov/2026).
   ============================================================ */
/* Lote dk-saa: baralhos de triagem do SAA-C03 (d1, d2, d3, d4) */
const DECKS_SAA_B = [
{
  id:"dk-saa-deteccao", exam:"saa", dom:"d1", concept:"deteccao-auditoria",
  title:"Quem responde: trilha, config, ameaça ou dado",
  prompt:"Classifique cada pergunta pelo serviço que a responde diretamente.",
  buckets:[{k:"ct",label:"CloudTrail"},{k:"cfg",label:"AWS Config"},{k:"gd",label:"GuardDuty"},{k:"mac",label:"Macie"}],
  items:[
    {t:"Quem apagou o bucket de relatórios ontem à noite?", k:"ct", e:"Exclusão é uma chamada de API, e o CloudTrail registra quem a fez, quando e de onde."},
    {t:"De qual IP veio a chamada que alterou a política da função do IAM?", k:"ct", e:"Cada evento do CloudTrail traz o IP de origem e a identidade que chamou a API."},
    {t:"O login no console de um usuário do IAM administrador usou MFA?", k:"ct", e:"O evento ConsoleLogin do CloudTrail traz o campo MFAUsed (Yes/No) para usuários do IAM e raiz."},
    {t:"Regra que reavalia a cada mudança e marca como não conforme todo bucket com leitura pública", k:"cfg", e:"Avaliar recursos contra uma regra e marcá-los como conformes ou não conformes é o AWS Config. O Macie também lista buckets públicos, mas não faz avaliação de conformidade por regras."},
    {t:"Como estavam as regras deste grupo de segurança na semana passada?", k:"cfg", e:"O histórico de itens de configuração mostra o estado do recurso em cada momento."},
    {t:"Quais volumes EBS estão sem criptografia em todas as contas?", k:"cfg", e:"Pergunta sobre estado de configuração e conformidade, que é o trabalho de um agregador do Config."},
    {t:"Instância consultando IP associado a mineração de criptomoeda", k:"gd", e:"O GuardDuty cruza logs de fluxo e DNS com inteligência de ameaças e gera o achado CryptoCurrency."},
    {t:"Instância falando com servidor de comando e controle conhecido", k:"gd", e:"Comunicação com C&C é um achado do tipo Backdoor gerado pelo GuardDuty."},
    {t:"Credencial temporária de uma EC2 sendo usada fora da AWS", k:"gd", e:"O GuardDuty detecta credenciais de instância exfiltradas e usadas de outro lugar."},
    {t:"Há números de CPF em planilhas guardadas no bucket?", k:"mac", e:"O Macie inspeciona o conteúdo dos objetos e tem identificador gerenciado para CPF."},
    {t:"Arquivos no S3 contêm números de cartão de crédito?", k:"mac", e:"Descoberta de dado sensível dentro de objetos do S3 é a função do Macie."},
    {t:"Quais buckets guardam dados pessoais e precisam de mais controle?", k:"mac", e:"A descoberta automatizada do Macie estima a sensibilidade de cada bucket pelo conteúdo."}
  ],
  src:[{t:"AWS: Tipos de achado do GuardDuty para EC2",u:"https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-ec2.html"},{t:"AWS: Identificadores gerenciados do Macie",u:"https://docs.aws.amazon.com/macie/latest/user/mdis-reference-quick.html"}]
},
{
  id:"dk-saa-cripto", exam:"saa", dom:"d1", concept:"criptografia-segredos",
  title:"Chave, segredo, certificado ou HSM",
  prompt:"Classifique cada requisito pelo serviço que o atende com menos esforço.",
  buckets:[{k:"kms",label:"KMS"},{k:"sm",label:"Secrets Manager"},{k:"acm",label:"ACM"},{k:"hsm",label:"CloudHSM"}],
  items:[
    {t:"Criptografar EBS e S3 com chave gerenciada e rotação anual automática", k:"kms", e:"Chave do KMS integra nativamente com EBS e S3 e tem rotação automática configurável."},
    {t:"Permitir que outra conta use uma chave por meio da política da chave", k:"kms", e:"A política de chave do KMS é o mecanismo para conceder uso entre contas."},
    {t:"Gerar chave de dados para cifrar localmente um arquivo de 5 GB", k:"kms", e:"Criptografia envelopada: o KMS gera a chave de dados, pois cifra diretamente só até 4 KB."},
    {t:"Agendar a exclusão de uma chave de criptografia com espera de 7 a 30 dias", k:"kms", e:"Chaves do KMS são excluídas só após uma espera de 7 a 30 dias. O Secrets Manager tem janela parecida, mas para segredos, não para chaves de criptografia."},
    {t:"Senha do banco RDS trocada a cada 30 dias sem mudar o código", k:"sm", e:"O Secrets Manager faz rotação automática e a aplicação sempre lê o valor atual."},
    {t:"Lambda busca a chave de API de um parceiro em tempo de execução", k:"sm", e:"Guardar credencial e entregá-la por API, fora do código, é o papel do Secrets Manager."},
    {t:"Credenciais do banco disponíveis também na região de recuperação", k:"sm", e:"O Secrets Manager replica segredos para outras regiões."},
    {t:"Certificado TLS público no ALB, renovado sozinho e sem custo", k:"acm", e:"Certificados públicos do ACM em serviços integrados são gratuitos e renovam automaticamente."},
    {t:"HTTPS no CloudFront com domínio próprio, certificado em us-east-1", k:"acm", e:"O CloudFront usa certificados do ACM, que precisam estar em us-east-1."},
    {t:"Provar posse do domínio por registro DNS para emitir certificado", k:"acm", e:"Validação por DNS é a forma do ACM confirmar o domínio antes de emitir."},
    {t:"Norma exige HSM de locatário único, com chaves sob controle exclusivo", k:"hsm", e:"O CloudHSM dá um HSM dedicado em que só o cliente gerencia usuários e chaves."},
    {t:"Aplicação legada faz criptografia via PKCS#11 diretamente no HSM", k:"hsm", e:"O CloudHSM expõe PKCS#11, JCE e CNG; o KMS só tem a própria API."},
    {t:"Oracle TDE com a chave mestra guardada em um HSM", k:"hsm", e:"O CloudHSM guarda a chave mestra do TDE como módulo externo via PKCS#11."}
  ],
  src:[{t:"AWS: O que é o CloudHSM",u:"https://docs.aws.amazon.com/cloudhsm/latest/userguide/introduction.html"},{t:"AWS: Rotação no Secrets Manager",u:"https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html"}]
},
{
  id:"dk-saa-dr", exam:"saa", dom:"d2", concept:"recuperacao-desastre",
  title:"Qual estratégia de recuperação de desastre",
  prompt:"Classifique cada requisito pela estratégia de DR mais barata que o atende.",
  buckets:[{k:"br",label:"Backup e restauração"},{k:"pl",label:"Luz piloto"},{k:"ws",label:"Warm standby"},{k:"aa",label:"Ativo-ativo"}],
  items:[
    {t:"RTO de 24 horas, RPO de 12 horas, orçamento mínimo para DR", k:"br", e:"Horas de tolerância permitem recriar tudo a partir de backups e modelos de IaC."},
    {t:"Sistema interno que pode ficar um dia fora; nada ligado na outra região", k:"br", e:"Nada rodando na região de recuperação é a definição de backup e restauração."},
    {t:"Recriar a pilha por CloudFormation e restaurar snapshots copiados", k:"br", e:"Reimplantar a infraestrutura e restaurar dados é o processo, e o mais lento."},
    {t:"Banco replicado sempre ativo; servidores de app desligados até o desastre", k:"pl", e:"Dados vivos e aplicação desligada é exatamente a luz piloto."},
    {t:"RPO de segundos, RTO de dezenas de minutos, custo baixo de computação", k:"pl", e:"Replicação contínua dá o RPO; ligar e escalar os servidores cabe no RTO."},
    {t:"Réplica do banco sempre ativa na outra região, AMIs prontas, nenhuma instância de app", k:"pl", e:"Núcleo de dados ligado e aplicação só pronta para subir é a luz piloto. No backup e restauração nem o banco fica rodando."},
    {t:"Cópia completa em escala reduzida já atende tráfego na outra região", k:"ws", e:"Ambiente funcional e menor, que só precisa escalar, é o warm standby."},
    {t:"RTO de poucos minutos; aceita pagar uma cópia pequena sempre ligada", k:"ws", e:"Tudo já roda; recuperar é só aumentar a capacidade."},
    {t:"Testar a região de DR com tráfego real a qualquer momento, capacidade menor", k:"ws", e:"Só o warm standby, entre as opções baratas, já processa requisições."},
    {t:"RTO e RPO perto de zero; usuários atendidos pelas duas regiões juntas", k:"aa", e:"As duas regiões servem tráfego, então não há failover, só desvio do tráfego."},
    {t:"Perder uma região não pode causar nem um minuto de parada", k:"aa", e:"Só a carga ativa em várias regiões chega a RTO quase zero."},
    {t:"Gravações aceitas em qualquer região, capacidade total em cada uma", k:"aa", e:"Capacidade total e escrita em todas as regiões caracterizam o ativo-ativo."}
  ],
  src:[{t:"AWS: Opções de recuperação de desastre na nuvem",u:"https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html"}]
},
{
  id:"dk-saa-elb", exam:"saa", dom:"d2", concept:"alta-disponibilidade",
  title:"ALB, NLB, Gateway LB ou Global Accelerator",
  prompt:"Classifique cada requisito pelo serviço de distribuição de tráfego que o resolve.",
  buckets:[{k:"alb",label:"ALB"},{k:"nlb",label:"NLB"},{k:"gwlb",label:"Gateway Load Balancer"},{k:"ga",label:"Global Accelerator"}],
  items:[
    {t:"Enviar /api e /imagens para grupos de destino diferentes", k:"alb", e:"Roteamento por caminho é regra de camada 7, própria do ALB."},
    {t:"Três sites com domínios distintos atrás do mesmo balanceador", k:"alb", e:"O ALB roteia pelo cabeçalho Host da requisição HTTP."},
    {t:"Autenticar o usuário via OIDC no balanceador, antes da aplicação", k:"alb", e:"Só o ALB tem ação de autenticação com OIDC ou Cognito."},
    {t:"Função Lambda como destino de requisições HTTP", k:"alb", e:"Lambda é tipo de destino suportado pelo ALB."},
    {t:"Um IP elástico fixo por zona de disponibilidade, em uma só região", k:"nlb", e:"O NLB voltado para a internet aceita um IP elástico por zona habilitada. ALB e Gateway LB não aceitam IP elástico, e o Global Accelerator usa IPs anycast próprios, não elásticos."},
    {t:"Milhões de conexões TCP por segundo com latência ultrabaixa, uma região", k:"nlb", e:"Camada 4 regional com latência mínima é o perfil do NLB."},
    {t:"Expor uma API TCP a outras VPCs por endpoints de interface do PrivateLink", k:"nlb", e:"Serviço de endpoint para endpoints de interface fica atrás de um NLB. O Gateway Load Balancer também cria serviço de endpoint, mas só para appliances de inspeção."},
    {t:"Inserir firewalls de um fornecedor no caminho do tráfego, transparente", k:"gwlb", e:"Appliances virtuais em linha são o caso do Gateway Load Balancer."},
    {t:"Escalar IDS/IPS virtuais com tráfego encapsulado em GENEVE", k:"gwlb", e:"O Gateway Load Balancer usa GENEVE na porta 6081 com os appliances."},
    {t:"Inspeção profunda de pacotes por appliances, operando na camada 3", k:"gwlb", e:"O Gateway Load Balancer escuta todos os pacotes IP em todas as portas."},
    {t:"Dois IPs anycast fixos para clientes do mundo todo, com várias regiões", k:"ga", e:"O Global Accelerator entrega dois IPs estáticos anycast na borda da AWS."},
    {t:"Jogo UDP com jogadores em vários continentes entrando pela borda", k:"ga", e:"Leva tráfego TCP ou UDP pela rede global da AWS até a região mais próxima."},
    {t:"Desviar o tráfego de uma região para outra em segundos, sem DNS", k:"ga", e:"Os IPs não mudam; o acelerador redireciona para endpoints saudáveis sem depender de cache de DNS."}
  ],
  src:[{t:"AWS: O que é o Gateway Load Balancer",u:"https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html"},{t:"AWS: O que é o Global Accelerator",u:"https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html"}]
},
{
  id:"dk-saa-banco", exam:"saa", dom:"d3", concept:"banco-cache",
  title:"Relacional, chave-valor, warehouse ou cache",
  prompt:"Classifique cada carga de dados pelo serviço que mais se encaixa.",
  buckets:[{k:"rds",label:"RDS / Aurora"},{k:"ddb",label:"DynamoDB"},{k:"rs",label:"Redshift"},{k:"ec",label:"ElastiCache"}],
  items:[
    {t:"ERP com junções entre dezenas de tabelas e transações ACID", k:"rds", e:"Modelo relacional com junções complexas pede um banco SQL gerenciado."},
    {t:"Migrar um PostgreSQL existente mudando o mínimo de código", k:"rds", e:"RDS for PostgreSQL ou Aurora PostgreSQL mantêm o mesmo motor."},
    {t:"Chaves estrangeiras e consultas SQL ad hoc sobre pedidos do dia", k:"rds", e:"Integridade referencial e SQL livre em dados transacionais são relacionais."},
    {t:"Carrinho durável lido por ID, picos de milhões de requisições, sem servidor", k:"ddb", e:"Acesso por chave em qualquer escala, com dado durável e sem gerenciar servidor. O ElastiCache Serverless é rápido, mas é cache, não o registro principal."},
    {t:"Leituras de sensores por ID do dispositivo, esquema que muda sempre", k:"ddb", e:"Chave de partição e de classificação com atributos livres é o modelo do DynamoDB."},
    {t:"Acesso por chave, itens que expiram sozinhos, escrita em várias regiões", k:"ddb", e:"TTL e tabelas globais multiativas são recursos do DynamoDB."},
    {t:"Petabytes de vendas agregados por ferramentas de BI", k:"rs", e:"Armazenamento colunar e processamento paralelo para análise é o Redshift."},
    {t:"Relatório anual com somas pesadas sobre dez anos de histórico", k:"rs", e:"Agregação analítica sobre grande volume é OLAP, não transacional."},
    {t:"Consultar tabelas do warehouse junto com arquivos no S3", k:"rs", e:"O Redshift Spectrum consulta dados no S3 sem carregá-los."},
    {t:"Tirar do RDS a carga de leituras repetidas guardando resultados em memória", k:"ec", e:"Cache em memória na frente do banco é o uso clássico do ElastiCache."},
    {t:"Placar de jogo ordenado em tempo real com conjuntos ordenados", k:"ec", e:"Sorted sets do Valkey ou Redis OSS mantêm o ranking em memória."},
    {t:"Sessões de usuário com latência de submilissegundo, dado recriável", k:"ec", e:"Memória dá submilissegundo, e o dado recriável dispensa durabilidade de disco."}
  ],
  src:[{t:"AWS: Escolher um banco de dados",u:"https://docs.aws.amazon.com/decision-guides/latest/decision-guides/databases-on-aws-how-to-choose.html"}]
},
{
  id:"dk-saa-arquivos", exam:"saa", dom:"d3", concept:"computacao-armazenamento",
  title:"Bloco, NFS elástico, FSx ou objeto",
  prompt:"Classifique cada necessidade pelo armazenamento que a atende.",
  buckets:[{k:"ebs",label:"EBS"},{k:"efs",label:"EFS"},{k:"fsx",label:"FSx"},{k:"s3",label:"S3"}],
  items:[
    {t:"Volume de inicialização de uma instância EC2", k:"ebs", e:"O disco raiz de uma EC2 é um volume de bloco do EBS."},
    {t:"Banco autogerenciado em uma EC2 com IOPS provisionadas", k:"ebs", e:"Volumes io2 entregam IOPS provisionadas a uma instância."},
    {t:"Snapshot incremental do disco de uma única instância", k:"ebs", e:"Snapshots incrementais são do volume de bloco anexado à instância."},
    {t:"Pasta NFS para centenas de instâncias Linux em várias AZs, sem definir capacidade nem throughput", k:"efs", e:"O EFS é NFS regional que cresce e encolhe sozinho e, no modo Elastic, ajusta o throughput. No FSx é preciso escolher pelo menos o throughput."},
    {t:"Tarefas Linux do ECS no Fargate, em várias AZs, gravando na mesma pasta", k:"efs", e:"O Fargate monta EFS para armazenamento compartilhado e persistente."},
    {t:"Várias funções Lambda lendo e gravando na mesma pasta compartilhada", k:"efs", e:"O Lambda monta sistema de arquivos só do EFS. O FSx não é montável em funções Lambda."},
    {t:"Compartilhamento SMB para servidores Windows, integrado ao Active Directory", k:"fsx", e:"FSx for Windows File Server: SMB nativo com integração ao AD."},
    {t:"HPC lendo dados do S3 em sistema de arquivos paralelo de alto throughput", k:"fsx", e:"FSx for Lustre é o sistema paralelo para HPC, com ligação a buckets S3."},
    {t:"Migrar NAS NetApp que serve NFS e SMB ao mesmo tempo, com SnapMirror", k:"fsx", e:"FSx for NetApp ONTAP mantém multiprotocolo e o SnapMirror."},
    {t:"Site estático com HTML e imagens servidos por HTTP", k:"s3", e:"O S3 hospeda site estático e entrega objetos por HTTP."},
    {t:"Data lake de arquivos Parquet consultado pelo Athena", k:"s3", e:"O Athena consulta dados diretamente em buckets do S3."},
    {t:"Bilhões de fotos enviadas por app móvel via API, sem limite de volume", k:"s3", e:"Armazenamento de objetos por API com capacidade praticamente ilimitada."}
  ],
  src:[{t:"AWS: Escolher um serviço de armazenamento",u:"https://docs.aws.amazon.com/decision-guides/latest/storage-on-aws-how-to-choose/choosing-aws-storage-service.html"},{t:"AWS: O que é o Amazon FSx",u:"https://docs.aws.amazon.com/fsx/"}]
},
{
  id:"dk-saa-compra", exam:"saa", dom:"d4", concept:"custo-computacao",
  title:"Sob demanda, compromisso ou Spot",
  prompt:"Classifique cada carga pelo modelo de compra de EC2 mais barato que a atende.",
  buckets:[{k:"od",label:"Sob demanda"},{k:"sp",label:"Savings Plans ou Reservada"},{k:"spot",label:"Spot"}],
  items:[
    {t:"Carga nova, duração desconhecida, não pode ser interrompida", k:"od", e:"Sem previsão para compromisso e sem tolerância a interrupção."},
    {t:"Ambiente de homologação por duas semanas que não pode cair", k:"od", e:"Prazo curto demais para compromisso de 1 ano e intolerante a interrupção."},
    {t:"Sistema que será desligado em dois meses, sem chance de compromisso", k:"od", e:"Vida curta e sem interrupção deixam só o sob demanda."},
    {t:"Pico de três dias na Black Friday atendendo clientes pagantes", k:"od", e:"Pico curto e crítico: compromisso não compensa e Spot pode sumir."},
    {t:"Banco em EC2 ligado 24x7 pelos próximos três anos", k:"sp", e:"Uso constante e previsível rende o maior desconto com compromisso."},
    {t:"Gasto estável entre EC2, Fargate e Lambda, compromisso de um ano", k:"sp", e:"O Compute Savings Plans cobre EC2, Fargate e Lambda."},
    {t:"Base de 20 instâncias sempre ligadas, família fixa na mesma região", k:"sp", e:"Consumo fixo e previsível é o caso de reserva ou Savings Plans."},
    {t:"Lote que salva checkpoint e retoma de onde parou", k:"spot", e:"Retomar após interrupção é o pré-requisito do Spot."},
    {t:"Nós de CI que podem sumir com aviso de dois minutos", k:"spot", e:"O Spot avisa dois minutos antes de recuperar a capacidade."},
    {t:"Workers sem estado que reprocessam a mensagem da fila se a instância cair", k:"spot", e:"A mensagem volta para a fila, então a interrupção não perde trabalho."},
    {t:"Treino de ML com checkpoints, quer o maior desconto possível", k:"spot", e:"Desconto máximo com tolerância a interrupção aponta para Spot."}
  ],
  src:[{t:"AWS: Instâncias spot",u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html"},{t:"AWS: O que são Savings Plans",u:"https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html"}]
}
];
/* Lote: baralhos de classificação CLF-C02 (B) · exame clf · domínios d1, d3, d4 */
const DECKS_CLF_B = [
{
  id:"dk-aw-caf", exam:"clf", dom:"d1", concept:"migracao-caf", title:"Qual perspectiva do AWS CAF?",
  prompt:"No AWS Cloud Adoption Framework, a qual perspectiva pertence cada preocupação?",
  buckets:[{k:"n",label:"Negócio"},{k:"p",label:"Pessoas"},{k:"g",label:"Governança"},{k:"s",label:"Segurança"}],
  items:[
    {t:"Definir metas de negócio de longo prazo que a nuvem deve acelerar", k:"n", e:"Gestão de estratégia, que liga a nuvem a metas e resultados de negócio, é da perspectiva de Negócio."},
    {t:"Usar dados na nuvem para criar uma nova fonte de receita", k:"n", e:"Monetização de dados é uma capacidade da perspectiva de Negócio."},
    {t:"Usar a nuvem para testar ideias de novos produtos e experiências do cliente", k:"n", e:"Gestão de inovação, que cria produtos e experiências novos com a nuvem, é da perspectiva de Negócio."},
    {t:"Criar um plano de treinamento para a equipe aprender a usar a nuvem", k:"p", e:"Fluência em nuvem e capacitação da equipe são da perspectiva de Pessoas."},
    {t:"Redesenhar a estrutura dos times para trabalhar no modelo de nuvem", k:"p", e:"Desenho organizacional é uma capacidade da perspectiva de Pessoas."},
    {t:"Reduzir a resistência dos funcionários à mudança de cultura", k:"p", e:"Evolução da cultura e aceleração da mudança pertencem à perspectiva de Pessoas."},
    {t:"Controlar e prever os gastos com nuvem de cada área da empresa", k:"g", e:"Gestão financeira da nuvem é uma capacidade da perspectiva de Governança."},
    {t:"Medir se os benefícios prometidos pela migração estão aparecendo", k:"g", e:"Gestão de benefícios fica na perspectiva de Governança."},
    {t:"Coordenar prazo, custo e esforço das várias iniciativas de migração", k:"g", e:"Gestão de programas e projetos, que alinha cronograma, custo e benefícios das iniciativas, é da perspectiva de Governança."},
    {t:"Definir quem pode acessar quais recursos e com quais permissões", k:"s", e:"Gerenciamento de identidade e acesso é uma capacidade da perspectiva de Segurança."},
    {t:"Garantir que dados sensíveis fiquem criptografados em repouso e em trânsito", k:"s", e:"Proteção de dados é capacidade da perspectiva de Segurança, que tem o CISO entre os responsáveis."},
    {t:"Detectar atividade maliciosa nas contas da nuvem", k:"s", e:"Detecção de ameaças é uma capacidade da perspectiva de Segurança."}
  ],
  src:[{t:"AWS: Overview of the AWS CAF - Foundational capabilities",u:"https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/foundational-capabilities.html"}]
},
{
  id:"dk-aw-migrar", exam:"clf", dom:"d1", concept:"migracao-caf", title:"Qual estratégia de migração (7 Rs)?",
  prompt:"Classifique cada decisão pela estratégia de migração que ela representa.",
  buckets:[{k:"h",label:"Rehost (lift and shift)"},{k:"p",label:"Replatform"},{k:"f",label:"Refactor"},{k:"r",label:"Retire"}],
  items:[
    {t:"Copiar um servidor para uma instância EC2 sem mudar nada na aplicação", k:"h", e:"Mover sem nenhuma alteração na aplicação é Rehost, o lift and shift."},
    {t:"Migrar centenas de VMs como estão, com prazo curto para sair do datacenter", k:"h", e:"Mover em massa sem alterar as aplicações é Rehost, a forma mais rápida."},
    {t:"Levar a aplicação para a AWS sem mexer no código e otimizar depois", k:"h", e:"Mover primeiro, sem mudanças, e modernizar só depois é Rehost."},
    {t:"Manter a aplicação, mas trocar o banco instalado na VM pelo Amazon RDS", k:"p", e:"Pequena otimização sem mudar a arquitetura é Replatform (lift, tinker and shift)."},
    {t:"Mover a aplicação e trocar o servidor web próprio por um serviço gerenciado", k:"p", e:"Ajuste pontual para aproveitar a nuvem, sem reescrever o código, é Replatform."},
    {t:"Reescrever um sistema monolítico como microsserviços com AWS Lambda", k:"f", e:"Mudar a arquitetura para usar recursos nativos da nuvem é Refactor."},
    {t:"Redesenhar a aplicação para escalar sozinha com serviços sem servidor", k:"f", e:"Reescrever a arquitetura para ganhar agilidade e escala é Refactor."},
    {t:"Recriar o sistema com filas e eventos para separar seus componentes", k:"f", e:"Alterar a arquitetura para um modelo nativo da nuvem é Refactor."},
    {t:"Desligar um sistema antigo que ninguém usa há dois anos", k:"r", e:"Desativar o que não tem mais uso é Retire."},
    {t:"Arquivar os dados de um sistema substituído e desligar seus servidores", k:"r", e:"Descomissionar ou arquivar uma aplicação é Retire."},
    {t:"Descobrir no inventário uma aplicação duplicada e eliminá-la", k:"r", e:"Eliminar aplicações redundantes em vez de migrar é Retire."}
  ],
  src:[{t:"AWS: Migration strategies (7 Rs)",u:"https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html"}]
},
{
  id:"dk-aw-ia", exam:"clf", dom:"d3", concept:"ia-ml-aws", title:"Serviço pronto, Bedrock ou SageMaker AI?",
  prompt:"Para cada necessidade, qual é a opção de IA mais adequada na AWS?",
  buckets:[{k:"s",label:"Serviço de IA pronto"},{k:"b",label:"Amazon Bedrock"},{k:"m",label:"Amazon SageMaker AI"}],
  items:[
    {t:"Converter gravações de atendimento em texto, sem treinar modelo", k:"s", e:"Fala para texto por API pronta é o Amazon Transcribe, um serviço de IA pronto."},
    {t:"Extrair campos de notas fiscais digitalizadas", k:"s", e:"Extrair texto e campos de documentos é tarefa do Amazon Textract, serviço pronto."},
    {t:"Traduzir descrições de produtos do português para o inglês", k:"s", e:"Tradução por API é o Amazon Translate, sem nenhum modelo para gerenciar."},
    {t:"Identificar objetos e rostos em fotos enviadas pelos usuários", k:"s", e:"Análise de imagem pronta é o Amazon Rekognition, serviço de IA pronto."},
    {t:"Criar um chatbot que gera respostas com um modelo de fundação, sem gerenciar servidores", k:"b", e:"Acesso sem servidor a modelos de fundação para IA generativa é o Amazon Bedrock."},
    {t:"Responder perguntas com base nos documentos internos da empresa (RAG)", k:"b", e:"RAG sobre dados próprios é feito com as Knowledge Bases do Amazon Bedrock."},
    {t:"Testar modelos de fundação de vários fornecedores pela mesma API, sem servidor", k:"b", e:"O Bedrock oferece modelos de diversos fornecedores por uma API única e sem servidor. No SageMaker AI seria preciso implantar cada modelo em endpoint."},
    {t:"Bloquear temas proibidos nas respostas de um assistente generativo", k:"b", e:"Filtros de conteúdo para IA generativa são as Guardrails do Amazon Bedrock."},
    {t:"Cientistas de dados treinando do zero um modelo de previsão de churn", k:"m", e:"Construir e treinar o próprio modelo de ML é o papel do Amazon SageMaker AI."},
    {t:"Usar notebooks Jupyter gerenciados para preparar dados e experimentar", k:"m", e:"Ambiente de desenvolvimento de ML com notebooks faz parte do SageMaker AI."},
    {t:"Implantar o próprio modelo de previsão (XGBoost) em um endpoint de inferência", k:"m", e:"Hospedar modelos de ML próprios em endpoints é recurso do SageMaker AI. A importação de modelos do Bedrock aceita só certas arquiteturas de modelo de fundação."},
    {t:"Controlar a infraestrutura de treinamento para equilibrar custo e latência", k:"m", e:"Quando é preciso controle da camada de infraestrutura, a escolha é o SageMaker AI."}
  ],
  src:[{t:"AWS: Amazon Bedrock or Amazon SageMaker AI?",u:"https://docs.aws.amazon.com/decision-guides/latest/bedrock-or-sagemaker/bedrock-or-sagemaker.html"}]
},
{
  id:"dk-aw-monitora", exam:"clf", dom:"d3", concept:"implantacao-operacao", title:"CloudWatch, CloudTrail, Config ou X-Ray?",
  prompt:"Qual serviço responde a cada pergunta?",
  buckets:[{k:"w",label:"Amazon CloudWatch"},{k:"t",label:"AWS CloudTrail"},{k:"c",label:"AWS Config"},{k:"x",label:"AWS X-Ray"}],
  items:[
    {t:"A CPU desta instância EC2 passou de 80% na última hora?", k:"w", e:"Métricas de desempenho dos recursos são coletadas pelo CloudWatch."},
    {t:"Como receber um alarme quando a fila de erros da aplicação crescer?", k:"w", e:"Alarmes sobre métricas são um recurso do CloudWatch."},
    {t:"Onde centralizar e pesquisar os logs gerados pela aplicação?", k:"w", e:"Logs de aplicação ficam no CloudWatch Logs."},
    {t:"Qual usuário do IAM chamou a API que excluiu este bucket?", k:"t", e:"O registro de quem fez cada chamada de API é do CloudTrail."},
    {t:"De qual endereço IP partiu o login no console de ontem à noite?", k:"t", e:"Eventos de login e chamadas de API, com IP de origem, ficam no CloudTrail."},
    {t:"Quais ações foram feitas com as credenciais do usuário raiz este mês?", k:"t", e:"Auditar ações de uma identidade nas APIs da AWS é tarefa do CloudTrail."},
    {t:"Como estava configurado este grupo de segurança na semana passada?", k:"c", e:"O histórico de configuração dos recursos é registrado pelo AWS Config."},
    {t:"Todos os volumes EBS da conta estão criptografados, conforme a regra?", k:"c", e:"Avaliar a conformidade dos recursos com regras é a função do AWS Config."},
    {t:"Quais recursos estão ligados a esta VPC e o que mudou neles?", k:"c", e:"Inventário, relações e mudanças de configuração ficam no AWS Config."},
    {t:"Em qual microsserviço uma requisição lenta passa mais tempo?", k:"x", e:"Rastrear a requisição de ponta a ponta entre serviços é o papel do X-Ray, cujos rastreamentos também aparecem no console do CloudWatch."},
    {t:"Qual chamada interna gera os erros vistos por um cliente específico?", k:"x", e:"O X-Ray segue cada requisição e mostra onde ocorreu o erro."},
    {t:"Como ver o mapa de dependências entre os serviços da aplicação?", k:"x", e:"O mapa de serviços montado a partir de rastreamentos é do X-Ray."}
  ],
  src:[
    {t:"AWS: What is AWS Config?",u:"https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html"},
    {t:"AWS: What is AWS CloudTrail?",u:"https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html"}
  ]
},
{
  id:"dk-aw-custo", exam:"clf", dom:"d4", concept:"custo-ferramentas", title:"Qual ferramenta de custo usar?",
  prompt:"Escolha a ferramenta que atende cada necessidade.",
  buckets:[{k:"p",label:"AWS Pricing Calculator"},{k:"e",label:"AWS Cost Explorer"},{k:"b",label:"AWS Budgets"},{k:"t",label:"AWS Trusted Advisor"}],
  items:[
    {t:"Estimar o custo mensal de uma arquitetura antes de criar qualquer recurso", k:"p", e:"Estimativa antes de usar, sem conta com histórico, é a Pricing Calculator."},
    {t:"Montar uma proposta de preço para o cliente comparar com o datacenter atual", k:"p", e:"Simular o custo de uma solução planejada é o papel da Pricing Calculator."},
    {t:"Ver em gráfico quanto cada serviço custou nos últimos seis meses", k:"e", e:"Analisar o gasto histórico por serviço é a função do Cost Explorer (que também traz recomendações de rightsizing)."},
    {t:"Filtrar os gastos do mês passado pela tag de centro de custo", k:"e", e:"Explorar custos passados com filtros e agrupamentos é tarefa do Cost Explorer."},
    {t:"Descobrir em qual dia do mês os gastos com EC2 deram um salto", k:"e", e:"Investigar a tendência de custo já ocorrido se faz no Cost Explorer."},
    {t:"Receber um e-mail quando o gasto do mês passar de US$ 500", k:"b", e:"Alertas por limite de gasto definido por você são do AWS Budgets."},
    {t:"Avisar o time quando o uso de Savings Plans ficar abaixo da meta", k:"b", e:"O Budgets também acompanha uso e cobertura de Savings Plans e reservas."},
    {t:"Definir um teto de gastos por projeto e ser avisado ao se aproximar", k:"b", e:"Teto planejado com notificação é a função do AWS Budgets."},
    {t:"Verificar se algum grupo de segurança deixa portas abertas para a internet", k:"t", e:"É uma checagem de segurança do Trusted Advisor, disponível até no plano Basic (com atualização manual)."},
    {t:"Saber se a conta está perto de alguma cota de serviço", k:"t", e:"Limites de serviço são uma categoria do Trusted Advisor, liberada por inteiro em todos os planos de suporte."},
    {t:"Receber checagens de boas práticas de segurança, cotas e tolerância a falhas", k:"t", e:"Essas categorias são do Trusted Advisor. Todas as checagens exigem plano Business Support+ ou superior; no Basic há só uma seleção."}
  ],
  src:[
    {t:"AWS: Analyzing your costs with AWS Cost Explorer",u:"https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html"},
    {t:"AWS: AWS Trusted Advisor",u:"https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html"}
  ]
}
];
DECKS.push(...DECKS_SAA_B, ...DECKS_CLF_B);
