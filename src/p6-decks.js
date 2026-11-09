/* ============================================================
   BARALHOS DE CLASSIFICAÇÃO
   Atividade de triagem: cada item vai para uma categoria.
   É o exercício que mais se parece com a decisão real da prova,
   que quase sempre é "em qual caixa isto se encaixa".
   ============================================================ */
const DECKS = [
{
  id:"dk-modelos", exam:"az900", dom:"d1", concept:"modelos-nuvem", title:"IaaS, PaaS ou SaaS?",
  prompt:"Classifique cada situação pelo modelo de serviço.",
  buckets:[{k:"i",label:"IaaS"},{k:"p",label:"PaaS"},{k:"s",label:"SaaS"}],
  items:[
    {t:"Máquina virtual onde você instala e atualiza o sistema operacional", k:"i", e:"Você administra o SO: isso é IaaS."},
    {t:"Azure App Service hospedando sua API, com a plataforma atualizada pela Microsoft", k:"p", e:"Plataforma gerenciada: PaaS."},
    {t:"Microsoft 365, usado como vem, sem instalar nada", k:"s", e:"Software pronto de terceiro: SaaS."},
    {t:"Azure SQL Database, com patch e backup pelo provedor", k:"p", e:"Banco gerenciado é PaaS: você cuida de dados e usuários."},
    {t:"Rede virtual e discos que você configura por conta própria", k:"i", e:"Infraestrutura crua: IaaS."},
    {t:"Azure Functions executando um trecho de código por evento", k:"p", e:"Sem servidor é uma forma de PaaS."},
    {t:"Um CRM contratado por assinatura, acessado pelo navegador", k:"s", e:"Aplicação pronta, sem nada para administrar: SaaS."},
    {t:"Servidor Windows Server legado migrado como está para a nuvem", k:"i", e:"Continua sendo você quem administra o SO: IaaS."},
    {t:"Serviço de e-mail corporativo gerenciado de ponta a ponta", k:"s", e:"Aplicação pronta e operada pelo fornecedor: SaaS."},
    {t:"Plataforma de contêineres gerenciada em que você só publica a imagem", k:"p", e:"PaaS: o provedor cuida de nó, patch e orquestração."},
    {t:"Conjunto de dimensionamento de máquinas virtuais", k:"i", e:"São máquinas virtuais: IaaS, mesmo com escala automática."},
    {t:"Ferramenta de videoconferência usada pelo navegador", k:"s", e:"Você só usa, não administra nada: SaaS."}
  ]
},
{
  id:"dk-resp", exam:"clf", dom:"d2", concept:"shared-responsibility", title:"De quem é a responsabilidade?",
  prompt:"No modelo de responsabilidade compartilhada, quem responde por cada item?",
  buckets:[{k:"c",label:"Cliente"},{k:"p",label:"Provedor"}],
  items:[
    {t:"Aplicar correções de segurança no sistema operacional de uma instância EC2", k:"c", e:"Em IaaS o SO convidado é do cliente."},
    {t:"Aplicar patch no motor do banco no Amazon RDS", k:"p", e:"Serviço gerenciado: o provedor cuida de SO e engine."},
    {t:"Definir quem pode ler um bucket do S3", k:"c", e:"Configuração de acesso é sempre do cliente."},
    {t:"Segurança física do datacenter", k:"p", e:"Predio, energia e hardware são sempre do provedor."},
    {t:"Descarte seguro de discos ao fim da vida útil", k:"p", e:"Mídia física é do provedor."},
    {t:"Decidir se um dado sensível será criptografado em repouso", k:"c", e:"A ferramenta é do provedor; a decisão é do cliente."},
    {t:"Criar usuários do banco de dados e definir senhas fortes", k:"c", e:"Identidades dentro do serviço são do cliente."},
    {t:"Manter o hipervisor que isola as máquinas virtuais", k:"p", e:"Virtualização é do provedor."},
    {t:"Classificar quais documentos são confidenciais", k:"c", e:"Classificação de dados nunca sai do cliente, nem em SaaS."},
    {t:"Corrigir uma falha de lógica de autorização na sua aplicação", k:"c", e:"Código da aplicação é do cliente."},
    {t:"Garantir a disponibilidade da rede física entre zonas", k:"p", e:"Infraestrutura de rede é do provedor."},
    {t:"Configurar o grupo de segurança que libera a porta do banco", k:"c", e:"Regras de rede do seu ambiente são do cliente."}
  ]
},
{
  id:"dk-awssec", exam:"clf", dom:"d2", concept:"seguranca-servicos", title:"Qual serviço de segurança?",
  prompt:"Cada necessidade abaixo é resolvida por qual serviço da AWS?",
  buckets:[{k:"t",label:"CloudTrail"},{k:"g",label:"GuardDuty"},{k:"m",label:"Macie"},{k:"c",label:"Config"}],
  items:[
    {t:"Saber quem chamou qual API e quando", k:"t", e:"CloudTrail registra chamadas de API."},
    {t:"Descobrir dados pessoais guardados num bucket", k:"m", e:"Macie classifica dado sensível no S3."},
    {t:"Alertar quando uma instância fala com endereço associado a mineração", k:"g", e:"GuardDuty detecta comportamento malicioso."},
    {t:"Verificar se todos os volumes estão criptografados e avisar quando um sair do padrão", k:"c", e:"Config avalia configuração contra regras."},
    {t:"Reconstruir a sequência de ações de um usuário que apagou um recurso", k:"t", e:"Trilha de auditoria: CloudTrail."},
    {t:"Detectar tentativa de varredura de portas vinda de fora", k:"g", e:"Detecção de ameaça: GuardDuty."},
    {t:"Manter histórico de como um recurso estava configurado no mês passado", k:"c", e:"Config guarda a linha do tempo de configuração."},
    {t:"Encontrar números de documento guardados por engano em arquivos", k:"m", e:"Descoberta de dado sensível no S3 é com o Macie."},
    {t:"Saber de qual endereço IP partiu uma chamada administrativa", k:"t", e:"O evento do CloudTrail guarda origem, identidade e horário."},
    {t:"Receber alerta de credencial possivelmente comprometida em uso", k:"g", e:"GuardDuty analisa sinais e aponta uso anômalo."},
    {t:"Provar ao auditor que a regra de retenção está aplicada em todos os buckets", k:"c", e:"Conformidade de configuração: Config."},
    {t:"Identificar qual bucket tem o maior volume de dado sensível", k:"m", e:"O Macie classifica e resume o achado por bucket."}
  ]
},
{
  id:"dk-msg", exam:"clf", dom:"d3", concept:"sqs-sns-eb", title:"Fila, pub/sub ou streaming?",
  prompt:"Qual serviço de integração resolve cada caso?",
  buckets:[{k:"q",label:"SQS"},{k:"n",label:"SNS"},{k:"k",label:"Kinesis"}],
  items:[
    {t:"Absorver um pico de dez vezes sem perder pedido", k:"q", e:"A fila guarda e o consumidor processa no seu ritmo."},
    {t:"Avisar três sistemas diferentes ao mesmo tempo sobre o mesmo evento", k:"n", e:"Fan-out: um publica, vários recebem."},
    {t:"Preservar a ordem dos eventos de cada sensor", k:"k", e:"Ordem dentro do shard: streaming."},
    {t:"Permitir que dois times releiam os dados dos últimos dias", k:"k", e:"Retenção e releitura só existem no streaming."},
    {t:"Desacoplar o site do processamento lento de pedidos", k:"q", e:"Fila é o desacoplador clássico."},
    {t:"Enviar a mesma notificação para e-mail, SMS e uma função", k:"n", e:"Vários tipos de inscrito: SNS."},
    {t:"Garantir que cada mensagem seja processada por um único consumidor", k:"q", e:"Modelo de fila."},
    {t:"Analisar cliques em tempo real, com várias aplicações lendo o mesmo fluxo", k:"k", e:"Consumidores independentes sobre o mesmo fluxo: Kinesis."},
    {t:"Publicar um alerta para quem quiser se inscrever depois", k:"n", e:"Tópico de publicação e assinatura."}
  ]
},
{
  id:"dk-gov", exam:"az900", dom:"d3", concept:"rbac-policy-lock", title:"RBAC, Policy ou Bloqueio?",
  prompt:"Qual mecanismo de governança do Azure resolve cada pedido?",
  buckets:[{k:"r",label:"RBAC"},{k:"p",label:"Azure Policy"},{k:"l",label:"Bloqueio"}],
  items:[
    {t:"Dar somente leitura à equipe de suporte", k:"r", e:"Permissão de identidade: RBAC, função Leitor."},
    {t:"Impedir a criação de recursos fora de Brazil South", k:"p", e:"Policy restringe o que pode existir."},
    {t:"Impedir que o banco de produção seja excluído, mesmo pelo Proprietário", k:"l", e:"Bloqueio CanNotDelete vale acima do RBAC."},
    {t:"Exigir a tag de centro de custo em todo recurso novo", k:"p", e:"Policy pode negar ou preencher a tag."},
    {t:"Permitir que um desenvolvedor crie recursos, mas não conceda permissões a outros", k:"r", e:"Função Colaborador."},
    {t:"Proibir tamanhos de máquina virtual acima de um limite", k:"p", e:"Policy sobre SKUs permitidos."},
    {t:"Congelar um ambiente para que nada seja alterado durante uma auditoria", k:"l", e:"Bloqueio ReadOnly impede qualquer escrita."},
    {t:"Conceder acesso apenas a um grupo de recursos específico", k:"r", e:"RBAC atribuído no escopo do grupo."},
    {t:"Auditar quais recursos estão fora do padrão sem bloquear ninguém", k:"p", e:"Policy com efeito de auditoria."}
  ]
},
{
  id:"dk-store", exam:"clf", dom:"d3", concept:"s3-classes", title:"Onde guardar este dado?",
  prompt:"Escolha o serviço de armazenamento adequado a cada caso.",
  buckets:[{k:"s",label:"S3"},{k:"e",label:"EBS"},{k:"f",label:"EFS"},{k:"i",label:"Instance store"}],
  items:[
    {t:"Disco do sistema operacional de uma instância", k:"e", e:"Bloco anexado a uma instância: EBS."},
    {t:"Sistema de arquivos lido e gravado por várias instâncias Linux ao mesmo tempo", k:"f", e:"NFS compartilhado: EFS."},
    {t:"Imagens e vídeos servidos por uma aplicação web", k:"s", e:"Objetos acessados por API: S3."},
    {t:"Cache temporário que pode sumir quando a instância for encerrada", k:"i", e:"Instance store é efêmero e muito rápido."},
    {t:"Backup de longo prazo com resgate em horas", k:"s", e:"Classes Glacier dentro do S3."},
    {t:"Volume que precisa sobreviver ao encerramento da instância", k:"e", e:"EBS persiste; instance store não."},
    {t:"Diretório compartilhado para um grupo de Auto Scaling", k:"f", e:"EFS, porque muitas instâncias montam ao mesmo tempo."},
    {t:"Arquivos estáticos de um site, servidos por CDN", k:"s", e:"S3 com CloudFront na frente."},
    {t:"Área de trabalho temporária de um processamento, perdida sem problema", k:"i", e:"Caso de uso do instance store."}
  ]
},
{
  id:"dk-nuvem", exam:"az900", dom:"d2", concept:"equivalencias", title:"Azure ou AWS?",
  prompt:"De qual nuvem é cada serviço? Treina o vocabulário das duas provas.",
  buckets:[{k:"a",label:"Azure"},{k:"w",label:"AWS"}],
  items:[
    {t:"Amazon EC2", k:"w", e:"Máquinas virtuais da AWS."},
    {t:"Azure Blob Storage", k:"a", e:"Armazenamento de objetos do Azure."},
    {t:"Amazon VPC", k:"w", e:"Rede virtual da AWS. No Azure é VNet."},
    {t:"Microsoft Entra ID", k:"a", e:"Identidade do Azure."},
    {t:"AWS Lambda", k:"w", e:"Funções sem servidor da AWS."},
    {t:"Azure Cosmos DB", k:"a", e:"NoSQL distribuído do Azure."},
    {t:"Amazon Redshift", k:"w", e:"Data warehouse da AWS."},
    {t:"Azure ExpressRoute", k:"a", e:"Link privado do Azure. Na AWS é Direct Connect."},
    {t:"Amazon CloudFront", k:"w", e:"CDN da AWS. No Azure o equivalente é o Front Door."},
    {t:"Azure Monitor", k:"a", e:"Métricas e logs do Azure. Na AWS é CloudWatch."},
    {t:"AWS Trusted Advisor", k:"w", e:"Recomendações da AWS. No Azure é o Advisor."},
    {t:"Azure Key Vault", k:"a", e:"Cofre de chaves e segredos do Azure."},
    {t:"Amazon Route 53", k:"w", e:"DNS da AWS. No Azure é o Azure DNS com Traffic Manager."},
    {t:"Azure Policy", k:"a", e:"Governança de recursos do Azure."}
  ]
}
];
