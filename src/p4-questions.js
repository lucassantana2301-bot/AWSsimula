/* ============================================================
   BANCO DE QUESTÕES — 100% original, escrito a partir dos
   objetivos públicos dos exam guides. NÃO contém, reproduz nem
   imita questões reais de prova.
   Calibragem: acima da prova real (cenários longos, requisitos
   em conflito, distratores plausíveis).
   type: single | multi | yn | order
   ============================================================ */
const QUESTIONS = [
/* ---------------- AZ-900 · D1 conceitos ---------------- */
{
  id:"az-d1-01", exam:"az900", dom:"d1", lvl:3, type:"single", sec:75, tags:["capex-opex","consumo"],
  case:"A Contoso roda 40 servidores num datacenter proprio. O contrato de energia e o de suporte do hardware vencem em 90 dias. A diretoria financeira avisou que nao havera verba de investimento neste ano fiscal, mas existe orcamento de custeio mensal. A carga e sazonal: dobra em novembro e cai pela metade em fevereiro.",
  stem:"Qual caracteristica da nuvem publica resolve ao mesmo tempo a restricao de verba e a sazonalidade?",
  opts:[
    {k:"A",t:"Modelo de despesa operacional com precificacao por consumo, pagando apenas pelos recursos usados em cada mes"},
    {k:"B",t:"Alta disponibilidade com SLA financeiro, que garante credito quando o servico fica indisponivel"},
    {k:"C",t:"Tolerancia a falhas por redundancia de hardware, eliminando a necessidade de manutencao"},
    {k:"D",t:"Governanca centralizada, que reduz o custo administrativo da equipe de infraestrutura"}
  ],
  ans:["A"],
  why:{
    ok:"Sao dois requisitos no mesmo enunciado. Despesa operacional resolve a falta de verba de investimento, porque voce deixa de comprar hardware e passa a pagar mensalmente. Precificacao por consumo resolve a sazonalidade, porque em fevereiro voce paga menos. So a alternativa A cobre os dois.",
    B:"SLA e credito por indisponibilidade nao tem relacao com verba de investimento nem com variacao de carga. E um distrator que soa tecnico.",
    C:"Tolerancia a falhas trata de continuidade quando algo quebra, nao de como o gasto e classificado nem de carga sazonal.",
    D:"Governanca pode reduzir custo indireto, mas nao e o que converte investimento em custeio nem o que acompanha o pico de novembro."
  },
  src:[{t:"Microsoft Learn: beneficios da nuvem",u:"https://learn.microsoft.com/training/modules/describe-cloud-compute/"}]
},
{
  id:"az-d1-02", exam:"az900", dom:"d1", lvl:4, type:"single", sec:70, tags:["elasticidade","escalabilidade","agilidade"],
  stem:"Uma loja virtual configura regras que adicionam instancias quando a CPU passa de 70% e removem instancias quando cai abaixo de 30%, sem ninguem intervir. Qual termo descreve exatamente esse comportamento?",
  opts:[
    {k:"A",t:"Elasticidade"},
    {k:"B",t:"Escalabilidade vertical"},
    {k:"C",t:"Agilidade"},
    {k:"D",t:"Alta disponibilidade"}
  ],
  ans:["A"],
  why:{
    ok:"Elasticidade e a capacidade de aumentar E diminuir recursos automaticamente, acompanhando a demanda. As duas direcoes e o automatismo sao as marcas do termo.",
    B:"Escalabilidade vertical e aumentar o tamanho da maquina (mais CPU e memoria na mesma instancia). Aqui estao sendo adicionadas instancias, o que seria horizontal, e ainda assim o termo que descreve o ciclo automatico nos dois sentidos e elasticidade.",
    C:"Agilidade e conseguir provisionar e mudar recursos rapidamente, por exemplo criar um ambiente novo em minutos. Nao descreve o ajuste automatico por metrica.",
    D:"Alta disponibilidade e manter o servico funcionando diante de falhas. O cenario fala de capacidade acompanhando demanda, nao de resistir a falha."
  },
  src:[{t:"Microsoft Learn: elasticidade e escalabilidade",u:"https://learn.microsoft.com/training/modules/describe-cloud-compute/"}]
},
{
  id:"az-d1-03", exam:"az900", dom:"d1", lvl:4, type:"yn", sec:95, tags:["responsabilidade-compartilhada"],
  stem:"Responda Sim ou Nao para cada afirmacao sobre o modelo de responsabilidade compartilhada no Azure.",
  rows:[
    {t:"Numa VM do Azure (IaaS), aplicar as atualizacoes de seguranca do sistema operacional convidado e responsabilidade do cliente.", a:true,
     e:"Em IaaS, o cliente administra o SO convidado, incluindo patch. A Microsoft cuida do hipervisor para baixo."},
    {t:"Em um servico PaaS como o Azure App Service, a Microsoft aplica os patches do sistema operacional subjacente.", a:true,
     e:"Em PaaS a plataforma e gerenciada: SO e runtime ficam com a Microsoft. O cliente continua responsavel pelo codigo, pelos dados e pelos acessos."},
    {t:"Em SaaS, como o Microsoft 365, a responsabilidade pela classificacao dos dados passa a ser da Microsoft.", a:false,
     e:"Classificacao de dados e responsabilidade de accountability do cliente em TODOS os modelos, inclusive SaaS. Esse item e a pegadinha da questao."},
    {t:"A seguranca fisica do datacenter e sempre responsabilidade da Microsoft.", a:true,
     e:"Predio, energia, rede fisica e hardware ficam com o provedor em qualquer modelo de nuvem publica."}
  ],
  src:[{t:"Microsoft Learn: responsabilidade compartilhada",u:"https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility"}]
},
{
  id:"az-d1-04", exam:"az900", dom:"d1", lvl:3, type:"single", sec:65, tags:["nuvem-hibrida","soberania"],
  case:"Um hospital precisa levar o portal do paciente para a nuvem para ganhar escala, mas a legislacao local exige que os registros clinicos originais permanecam em servidores dentro do predio do hospital, sob controle direto da instituicao.",
  stem:"Qual modelo de implantacao atende ao cenario?",
  opts:[
    {k:"A",t:"Nuvem hibrida"},
    {k:"B",t:"Nuvem publica com criptografia de disco"},
    {k:"C",t:"Nuvem privada"},
    {k:"D",t:"Multinuvem"}
  ],
  ans:["A"],
  why:{
    ok:"Parte da carga fica na nuvem publica (o portal) e parte permanece no ambiente local sob controle do hospital (os registros). Essa combinacao e, por definicao, nuvem hibrida.",
    B:"Criptografia protege o dado, mas nao muda o fato de ele estar fora do predio. O requisito e de localizacao e controle fisico, nao de confidencialidade.",
    C:"Nuvem privada sozinha deixaria o portal sem o ganho de escala da nuvem publica, que e o primeiro requisito do enunciado.",
    D:"Multinuvem e usar dois provedores publicos diferentes. Nao resolve a exigencia de manter dados dentro do hospital."
  },
  src:[{t:"Microsoft Learn: modelos de nuvem",u:"https://learn.microsoft.com/training/modules/describe-cloud-service-types/"}]
},
{
  id:"az-d1-05", exam:"az900", dom:"d1", lvl:5, type:"single", sec:80, tags:["ha","dr","rto-rpo"],
  case:"Uma fintech precisa que o sistema continue atendendo se um datacenter inteiro ficar indisponivel, e tambem precisa conseguir retomar a operacao em outra cidade caso toda a regiao sofra um desastre natural. A equipe tem orcamento para implementar as duas coisas.",
  stem:"Como classificar corretamente os dois requisitos?",
  opts:[
    {k:"A",t:"O primeiro e alta disponibilidade; o segundo e recuperacao de desastre"},
    {k:"B",t:"Os dois sao alta disponibilidade, em niveis diferentes"},
    {k:"C",t:"O primeiro e tolerancia a falhas; o segundo e alta disponibilidade"},
    {k:"D",t:"Os dois sao recuperacao de desastre, porque envolvem falha de infraestrutura"}
  ],
  ans:["A"],
  why:{
    ok:"Alta disponibilidade e manter o servico no ar diante de falhas localizadas, como a queda de um datacenter, normalmente com zonas de disponibilidade. Recuperacao de desastre e retomar a operacao depois de um evento que atinge a regiao inteira, tipicamente em outra regiao, com RTO e RPO definidos.",
    B:"Juntar os dois no mesmo conceito apaga a diferenca que a prova cobra: escopo da falha e se existe interrupcao aceitavel.",
    C:"Tolerancia a falhas e um nivel ainda mais estrito, de componente redundante sem nenhuma interrupcao percebida. E alem disso a segunda parte seria disaster recovery, nao alta disponibilidade.",
    D:"Perder um datacenter dentro de uma regiao com zonas nao e um desastre regional: e justamente o caso que a alta disponibilidade zonal cobre."
  },
  src:[{t:"Microsoft Learn: confiabilidade",u:"https://learn.microsoft.com/azure/reliability/overview"}]
},

/* ---------------- AZ-900 · D2 arquitetura e servicos ---------------- */
{
  id:"az-d2-01", exam:"az900", dom:"d2", lvl:4, type:"single", sec:85, tags:["zonas","par-regiao"],
  case:"Uma aplicacao web roda hoje em tres VMs distribuidas em tres zonas de disponibilidade da regiao Brazil South. A diretoria pergunta se a arquitetura sobrevive a um incendio que destrua a regiao inteira.",
  stem:"Qual e a resposta tecnicamente correta e o que deveria ser feito?",
  opts:[
    {k:"A",t:"Nao sobrevive; e preciso replicar a carga para a regiao emparelhada e ter um plano de failover entre regioes"},
    {k:"B",t:"Sobrevive, porque zonas de disponibilidade sao datacenters fisicamente separados"},
    {k:"C",t:"Sobrevive, porque o Azure replica automaticamente qualquer VM para a regiao emparelhada"},
    {k:"D",t:"Nao sobrevive; a solucao e criar um conjunto de disponibilidade adicional na mesma regiao"}
  ],
  ans:["A"],
  why:{
    ok:"Zonas protegem contra a falha de um datacenter, nao contra a perda da regiao. Para desastre regional e preciso presenca em outra regiao, normalmente a emparelhada, com replicacao de dados e processo de failover.",
    B:"As zonas sao separadas, mas continuam dentro da mesma regiao geografica. Um evento que atinge a regiao atinge as tres zonas.",
    C:"O Azure nao replica VMs entre regioes automaticamente. Replicacao entre regioes existe para certos tipos de armazenamento (como GRS) e via servicos como Azure Site Recovery, que precisam ser configurados.",
    D:"Conjunto de disponibilidade protege contra falha de rack e manutencao dentro de um unico datacenter. E uma protecao menor do que a que ja existe e nao ajuda em desastre regional."
  },
  src:[{t:"Zonas de disponibilidade",u:"https://learn.microsoft.com/azure/reliability/availability-zones-overview"},
       {t:"Replicacao entre regioes",u:"https://learn.microsoft.com/azure/reliability/cross-region-replication-azure"}]
},
{
  id:"az-d2-02", exam:"az900", dom:"d2", lvl:4, type:"yn", sec:90, tags:["grupo-de-recursos","arm"],
  stem:"Responda Sim ou Nao sobre grupos de recursos no Azure.",
  rows:[
    {t:"Um grupo de recursos pode conter recursos localizados em regioes diferentes.", a:true,
     e:"Pode. A regiao do grupo define apenas onde ficam os metadados dele, nao onde os recursos rodam."},
    {t:"Um mesmo recurso pode pertencer a dois grupos de recursos ao mesmo tempo.", a:false,
     e:"Cada recurso pertence a exatamente um grupo de recursos. Ele pode ser movido, mas nunca pertencer a dois."},
    {t:"Excluir um grupo de recursos exclui todos os recursos contidos nele.", a:true,
     e:"A exclusao e em cascata. E por isso que recurso critico recebe bloqueio (lock)."},
    {t:"Grupos de recursos podem ser aninhados dentro de outros grupos de recursos.", a:false,
     e:"Nao existe aninhamento de grupos de recursos. Hierarquia acima da assinatura e feita com grupos de gerenciamento."}
  ],
  src:[{t:"Azure Resource Manager",u:"https://learn.microsoft.com/azure/azure-resource-manager/management/overview"}]
},
{
  id:"az-d2-03", exam:"az900", dom:"d2", lvl:5, type:"single", sec:95, tags:["compute","app-service","aks","functions"],
  case:"Uma equipe de 3 pessoas precisa publicar uma API REST em .NET. Requisitos: nao querem administrar sistema operacional, precisam de slots de implantacao para testar antes de ir ao ar, precisam de dominio proprio com certificado e a API fica ativa o dia inteiro com trafego constante. Nao ha outro microsservico no roadmap.",
  stem:"Qual servico de computacao atende com menor esforco operacional?",
  opts:[
    {k:"A",t:"Azure App Service"},
    {k:"B",t:"Azure Kubernetes Service (AKS)"},
    {k:"C",t:"Azure Functions no plano de consumo"},
    {k:"D",t:"Maquina virtual com conjunto de dimensionamento"}
  ],
  ans:["A"],
  why:{
    ok:"App Service e PaaS para aplicacoes web e APIs: sem administrar SO, com slots de implantacao, dominio proprio e certificado gerenciado nativos. Para uma API unica com trafego constante e a escolha de menor esforco.",
    B:"AKS resolveria, mas traz orquestracao, nos, upgrades de cluster e rede de container para uma equipe de 3 pessoas com um unico servico. E esforco operacional maior sem necessidade.",
    C:"Functions brilha em carga intermitente e orientada a evento. Com trafego constante o dia inteiro, o plano de consumo perde a vantagem economica, e slots de implantacao e certificado seguem o modelo do App Service de todo jeito.",
    D:"VM obriga a equipe a cuidar de SO, patch e imagem, exatamente o que o enunciado quer evitar."
  },
  src:[{t:"Azure App Service",u:"https://learn.microsoft.com/azure/app-service/overview"}]
},
{
  id:"az-d2-04", exam:"az900", dom:"d2", lvl:4, type:"single", sec:80, tags:["blob","camadas","archive"],
  case:"Laudos medicos precisam ser guardados por 10 anos por exigencia legal. A consulta e raríssima, mas quando o paciente solicita, o laudo deve estar disponivel em segundos, no mesmo atendimento.",
  stem:"Qual camada de acesso do Blob Storage atende ao requisito com o menor custo de armazenamento?",
  opts:[
    {k:"A",t:"Cold"},
    {k:"B",t:"Archive"},
    {k:"C",t:"Hot"},
    {k:"D",t:"Archive com reidratacao de prioridade alta"}
  ],
  ans:["A"],
  why:{
    ok:"Cold e a camada online mais barata para dados de acesso muito raro: o custo de armazenamento e baixo e o objeto continua acessivel imediatamente. O minimo de permanencia de 90 dias nao e problema em uma retencao de 10 anos.",
    B:"Archive e mais barato, mas e offline: exige reidratacao, que leva horas. O enunciado exige disponibilidade em segundos, o que elimina Archive.",
    C:"Hot atenderia ao desempenho, mas e a camada mais caro para guardar, e o enunciado pede o menor custo de armazenamento.",
    D:"Reidratacao de prioridade alta reduz o tempo, mas continua na casa de minutos a uma hora para objetos pequenos, nao segundos, e ainda cobra taxa extra. Nao e acesso imediato."
  },
  src:[{t:"Camadas de acesso do Blob",u:"https://learn.microsoft.com/azure/storage/blobs/access-tiers-overview"}]
},
{
  id:"az-d2-05", exam:"az900", dom:"d2", lvl:5, type:"single", sec:90, tags:["rede","expressroute","vpn","peering"],
  case:"Um banco vai integrar o datacenter proprio ao Azure. Requisitos: a latencia precisa ser previsivel, o trafego nao pode transitar pela internet publica em nenhum momento e a banda contratada deve ser dedicada. O custo mensal maior ja foi aprovado.",
  stem:"Qual opcao de conectividade atende?",
  opts:[
    {k:"A",t:"Azure ExpressRoute"},
    {k:"B",t:"VPN site a site com IPsec"},
    {k:"C",t:"Emparelhamento de rede virtual (VNet peering)"},
    {k:"D",t:"Azure Bastion"}
  ],
  ans:["A"],
  why:{
    ok:"ExpressRoute e um circuito privado atraves de um parceiro de conectividade: nao passa pela internet publica, oferece banda dedicada e latencia mais previsivel. E exatamente o conjunto de requisitos descrito.",
    B:"VPN site a site cria um tunel criptografado, mas por cima da internet publica. O trafego e protegido, nao privado no caminho, e a latencia depende da internet. O enunciado veta isso explicitamente.",
    C:"VNet peering conecta redes virtuais dentro do Azure. Nao conecta um datacenter local a nuvem.",
    D:"Bastion e acesso administrativo seguro a VMs pelo portal, via RDP e SSH. Nao e tecnologia de interconexao de datacenter."
  },
  src:[{t:"ExpressRoute",u:"https://learn.microsoft.com/azure/expressroute/expressroute-introduction"}]
},
{
  id:"az-d2-06", exam:"az900", dom:"d2", lvl:4, type:"multi", sec:95, tags:["entra-id","identidade"],
  stem:"Uma empresa quer substituir senhas por autenticacao moderna em aplicacoes SaaS e aplicar politicas de acesso baseadas em risco. Quais recursos do Microsoft Entra ID atendem a esse objetivo? Escolha as DUAS melhores opcoes.",
  opts:[
    {k:"A",t:"Autenticacao multifator (MFA)"},
    {k:"B",t:"Acesso condicional"},
    {k:"C",t:"Group Policy (GPO)"},
    {k:"D",t:"Bloqueio de recurso (resource lock)"},
    {k:"E",t:"Conjunto de dimensionamento de maquinas virtuais"}
  ],
  ans:["A","B"],
  why:{
    ok:"MFA adiciona um segundo fator e e a base para reduzir dependencia de senha. Acesso condicional avalia sinais como usuario, dispositivo, local e risco, e decide se concede, bloqueia ou exige MFA. Juntos entregam o que o enunciado pede.",
    C:"GPO pertence ao Active Directory Domain Services, nao ao Entra ID. Entra ID nao aplica GPO; para dispositivos ha politicas do Intune.",
    D:"Bloqueio de recurso impede exclusao e alteracao de recursos do Azure. Nao tem relacao com autenticacao de usuario.",
    E:"Conjunto de dimensionamento e computacao elastica. Nenhuma relacao com identidade."
  },
  src:[{t:"Acesso condicional",u:"https://learn.microsoft.com/entra/identity/conditional-access/overview"}]
},
{
  id:"az-d2-07", exam:"az900", dom:"d2", lvl:3, type:"single", sec:70, tags:["storage","files","blob","disk"],
  case:"Uma aplicacao legada precisa de um compartilhamento de arquivos acessivel por caminho UNC via protocolo SMB, montado simultaneamente por tres servidores Windows.",
  stem:"Qual servico de armazenamento do Azure atende sem alterar a aplicacao?",
  opts:[
    {k:"A",t:"Azure Files"},
    {k:"B",t:"Azure Blob Storage"},
    {k:"C",t:"Azure Managed Disks"},
    {k:"D",t:"Azure Table Storage"}
  ],
  ans:["A"],
  why:{
    ok:"Azure Files oferece compartilhamento de arquivos gerenciado com SMB, montavel por caminho UNC em varios servidores ao mesmo tempo. E o substituto direto de um file server.",
    B:"Blob e armazenamento de objetos acessado por API REST. Nao fala SMB nativamente, e usar um driver de montagem mudaria o comportamento da aplicacao legada.",
    C:"Disco gerenciado se anexa a uma unica VM por vez na maioria dos cenarios e nao e um compartilhamento de rede.",
    D:"Table Storage e um armazenamento NoSQL de chave e atributo. Nao e sistema de arquivos."
  },
  src:[{t:"Azure Files",u:"https://learn.microsoft.com/azure/storage/files/storage-files-introduction"}]
},
{
  id:"az-d2-08", exam:"az900", dom:"d2", lvl:4, type:"single", sec:75, tags:["migracao-dados","data-box"],
  case:"Uma produtora precisa enviar 400 TB de video bruto para o Azure. O link de internet do estudio e de 200 Mbps e ja esta saturado durante o dia pela operacao.",
  stem:"Qual abordagem e mais adequada?",
  opts:[
    {k:"A",t:"Azure Data Box, transferindo os dados em dispositivo fisico enviado ao datacenter"},
    {k:"B",t:"AzCopy com varias sessoes paralelas durante a madrugada"},
    {k:"C",t:"Azure Storage Explorer com upload em lotes"},
    {k:"D",t:"Azure File Sync entre o servidor local e o Azure Files"}
  ],
  ans:["A"],
  why:{
    ok:"Com 200 Mbps compartilhados, 400 TB levariam meses de transferencia continua. O Data Box existe exatamente para esse caso: a Microsoft envia um dispositivo, voce copia localmente e devolve pelo correio.",
    B:"AzCopy e otimo para transferencia por rede, mas nao cria banda. O gargalo e fisico, nao de ferramenta.",
    C:"Storage Explorer e uma interface grafica sobre a mesma rede. O problema de banda continua.",
    D:"File Sync serve para sincronizar e usar cache de um compartilhamento, nao para a carga inicial de centenas de terabytes num link saturado."
  },
  src:[{t:"Azure Data Box",u:"https://learn.microsoft.com/azure/databox/data-box-overview"}]
},
{
  id:"az-d2-09", exam:"az900", dom:"d2", lvl:5, type:"order", sec:90, tags:["hierarquia","escopo"],
  stem:"Ordene os escopos do Azure do MAIS AMPLO para o MAIS ESPECIFICO.",
  items:[
    {t:"Grupo de gerenciamento"},
    {t:"Assinatura"},
    {t:"Grupo de recursos"},
    {t:"Recurso"}
  ],
  e:"A hierarquia do Azure vai de grupo de gerenciamento, que agrupa assinaturas, passando pela assinatura, depois o grupo de recursos e por fim o recurso individual. Quem define politica ou permissao no topo faz com que ela seja herdada para baixo. Essa ordem e cobrada tanto em governanca quanto em RBAC.",
  src:[{t:"Grupos de gerenciamento",u:"https://learn.microsoft.com/azure/governance/management-groups/overview"}]
},

/* ---------------- AZ-900 · D3 governanca ---------------- */
{
  id:"az-d3-01", exam:"az900", dom:"d3", lvl:5, type:"single", sec:90, tags:["policy","rbac","lock"],
  case:"Um gestor pede tres coisas: 1) ninguem deve conseguir criar recursos fora da regiao Brazil South; 2) a equipe de suporte deve apenas visualizar recursos, sem alterar; 3) o banco de dados de producao nao pode ser excluido nem pelo administrador da assinatura.",
  stem:"Quais mecanismos atendem, respectivamente, aos itens 1, 2 e 3?",
  opts:[
    {k:"A",t:"Azure Policy, RBAC e bloqueio de recurso"},
    {k:"B",t:"RBAC, Azure Policy e bloqueio de recurso"},
    {k:"C",t:"Azure Policy, bloqueio de recurso e RBAC"},
    {k:"D",t:"Bloqueio de recurso, RBAC e Azure Policy"}
  ],
  ans:["A"],
  why:{
    ok:"Azure Policy define O QUE pode existir, inclusive restringir regioes permitidas. RBAC define QUEM pode fazer o que, e a funcao Leitor da apenas visualizacao. Bloqueio de recurso do tipo CanNotDelete impede exclusao mesmo de quem tem permissao total, inclusive Proprietario.",
    B:"Inverte os dois primeiros. RBAC nao tem como restringir regiao: ele concede acoes a identidades, nao avalia propriedades do recurso.",
    C:"Bloqueio nao concede nem limita visualizacao. Para dar somente leitura a uma equipe, o instrumento e RBAC.",
    D:"Bloqueio nao restringe regiao e Policy nao impede exclusao por quem tem permissao: Policy pode negar criacao, mas o controle contra exclusao acidental e o lock."
  },
  src:[{t:"Azure Policy",u:"https://learn.microsoft.com/azure/governance/policy/overview"},
       {t:"Bloquear recursos",u:"https://learn.microsoft.com/azure/azure-resource-manager/management/lock-resources"}]
},
{
  id:"az-d3-02", exam:"az900", dom:"d3", lvl:4, type:"yn", sec:90, tags:["tags","governanca-custo"],
  stem:"A empresa quer ratear custos por centro de custo usando tags. Responda Sim ou Nao.",
  rows:[
    {t:"Recursos herdam automaticamente as tags do grupo de recursos onde foram criados.", a:false,
     e:"Nao herdam. Essa e a pegadinha classica: a heranca precisa ser forcada por Azure Policy com efeito modify ou append."},
    {t:"O Azure Policy pode ser usado para exigir uma tag obrigatoria na criacao do recurso.", a:true,
     e:"Sim. Policy pode negar a criacao sem a tag ou adicionar a tag automaticamente."},
    {t:"O Microsoft Cost Management consegue agrupar e filtrar os custos por tag.", a:true,
     e:"Sim, e esse e o motivo pratico de manter a marcacao disciplinada."},
    {t:"Tags sao herdadas da assinatura para todos os recursos dentro dela.", a:false,
     e:"Tambem nao. Nenhum nivel de escopo propaga tag sozinho."}
  ],
  src:[{t:"Marcar recursos",u:"https://learn.microsoft.com/azure/azure-resource-manager/management/tag-resources"}]
},
{
  id:"az-d3-03", exam:"az900", dom:"d3", lvl:4, type:"single", sec:75, tags:["calculadoras","tco"],
  case:"A diretoria quer um documento que compare o custo total de manter 60 servidores no datacenter proprio com o custo de rodar a mesma carga no Azure, incluindo energia, licenciamento e equipe.",
  stem:"Qual ferramenta foi feita para esse objetivo?",
  opts:[
    {k:"A",t:"Calculadora de Custo Total de Propriedade (TCO)"},
    {k:"B",t:"Calculadora de Precos do Azure"},
    {k:"C",t:"Microsoft Cost Management"},
    {k:"D",t:"Azure Advisor"}
  ],
  ans:["A"],
  why:{
    ok:"A calculadora de TCO existe para comparar o ambiente local com o Azure, considerando custos que a fatura da nuvem nao mostra, como energia, espaco fisico e pessoal.",
    B:"A Calculadora de Precos estima quanto custarao recursos do Azure. Ela nao modela o custo do seu datacenter atual, entao nao faz comparacao.",
    C:"Cost Management analisa gasto que JA aconteceu na sua conta e cria orcamentos. Nao serve para projetar uma migracao que ainda nao existe.",
    D:"Advisor recomenda melhorias em recursos existentes no Azure, inclusive economia. Nao compara com on-premises."
  },
  src:[{t:"Calculadora de TCO",u:"https://azure.microsoft.com/pricing/tco/calculator/"}]
},
{
  id:"az-d3-04", exam:"az900", dom:"d3", lvl:5, type:"single", sec:85, tags:["monitor","service-health","advisor","defender"],
  case:"Um analista precisa descobrir se a lentidao relatada pelos usuarios foi causada por um incidente da plataforma Azure que afeta especificamente as assinaturas da empresa na regiao usada.",
  stem:"Qual servico deve ser consultado primeiro?",
  opts:[
    {k:"A",t:"Azure Service Health"},
    {k:"B",t:"Azure Monitor"},
    {k:"C",t:"Azure Advisor"},
    {k:"D",t:"Microsoft Defender for Cloud"}
  ],
  ans:["A"],
  why:{
    ok:"Service Health mostra incidentes, manutencoes planejadas e avisos de saude filtrados pelos recursos e regioes das SUAS assinaturas. E a ferramenta para saber se o problema e da plataforma.",
    B:"Azure Monitor coleta metricas e logs dos seus recursos. Ele mostra que a latencia subiu, mas nao informa se existe incidente declarado pela Microsoft.",
    C:"Advisor da recomendacoes de custo, seguranca, confiabilidade, excelencia operacional e desempenho. Nao reporta incidente em andamento.",
    D:"Defender for Cloud trata de postura e protecao contra ameacas. Nao e canal de comunicacao de incidente da plataforma."
  },
  src:[{t:"Azure Service Health",u:"https://learn.microsoft.com/azure/service-health/overview"}]
},
{
  id:"az-d3-05", exam:"az900", dom:"d3", lvl:4, type:"single", sec:80, tags:["reservas","hibrido","spot"],
  case:"Uma empresa tem 30 VMs Windows que rodam 24 horas por dia e devem continuar pelos proximos tres anos, com tamanho e regiao estaveis. A empresa ja possui licencas de Windows Server com Software Assurance.",
  stem:"Qual combinacao reduz mais o custo?",
  opts:[
    {k:"A",t:"Reservas de instancia de VM por 3 anos somadas ao Beneficio Hibrido do Azure"},
    {k:"B",t:"Maquinas virtuais spot somadas ao Beneficio Hibrido do Azure"},
    {k:"C",t:"Reservas de instancia por 1 ano, sem usar as licencas existentes"},
    {k:"D",t:"Dimensionamento automatico com precificacao sob demanda"}
  ],
  ans:["A"],
  why:{
    ok:"Carga estavel e previsivel por tres anos e o caso ideal de reserva, que da o maior desconto no compute. O Beneficio Hibrido aproveita as licencas que a empresa ja pagou, removendo o custo da licenca Windows da fatura. Os dois descontos se somam.",
    B:"Spot nao tem garantia de continuidade: a instancia pode ser removida com pouco aviso. Para carga que precisa rodar 24 horas, e resposta errada, mesmo sendo a mais barata por hora.",
    C:"Reserva de 1 ano desconta menos que a de 3 anos, e descartar as licencas existentes joga dinheiro fora.",
    D:"Sob demanda e a opcao mais caro por hora para carga constante, e dimensionar automaticamente nao ajuda quando a utilizacao e estavel."
  },
  src:[{t:"Reservas do Azure",u:"https://learn.microsoft.com/azure/cost-management-billing/reservations/save-compute-costs-reservations"},
       {t:"Beneficio Hibrido",u:"https://learn.microsoft.com/azure/virtual-machines/windows/hybrid-use-benefit-licensing"}]
},
{
  id:"az-d3-06", exam:"az900", dom:"d3", lvl:4, type:"single", sec:75, tags:["lock","readonly"],
  case:"Um engenheiro aplicou um bloqueio do tipo ReadOnly em um grupo de recursos que contem uma conta de armazenamento e uma VM. Agora a equipe reclama que nao consegue mais iniciar a VM que estava desligada.",
  stem:"Por que isso acontece?",
  opts:[
    {k:"A",t:"Porque ReadOnly bloqueia qualquer operacao de alteracao, e iniciar uma VM altera o estado do recurso"},
    {k:"B",t:"Porque ReadOnly remove as permissoes de RBAC dos usuarios no grupo de recursos"},
    {k:"C",t:"Porque ReadOnly se aplica somente a contas de armazenamento e corrompeu a configuracao da VM"},
    {k:"D",t:"Porque bloqueios nao afetam VMs, o problema deve ser de cota da assinatura"}
  ],
  ans:["A"],
  why:{
    ok:"ReadOnly e mais restritivo do que parece: ele impede toda operacao de escrita, nao apenas exclusao. Iniciar, parar ou redimensionar uma VM sao operacoes de escrita, logo ficam bloqueadas. Esse efeito colateral e justamente o que a prova gosta de cobrar.",
    B:"Bloqueio nao mexe em RBAC. As permissoes continuam atribuidas; o que muda e que o plano de gerenciamento recusa a operacao.",
    C:"Bloqueio se aplica ao escopo onde foi criado e e herdado por tudo que esta dentro, incluindo a VM. E nao corrompe configuracao.",
    D:"Bloqueios afetam sim as VMs. Atribuir o sintoma a cota ignora a causa real."
  },
  src:[{t:"Bloquear recursos",u:"https://learn.microsoft.com/azure/azure-resource-manager/management/lock-resources"}]
},

/* ---------------- CLF-C02 · D1 conceitos ---------------- */
{
  id:"aw-d1-01", exam:"clf", dom:"d1", lvl:4, type:"single", sec:80, tags:["6rs","migracao"],
  case:"Uma empresa roda um ERP em servidores fisicos com um banco MySQL autogerenciado. A meta e sair do datacenter em 4 meses, sem reescrever a aplicacao, mas tirando da equipe o trabalho de administrar o banco de dados.",
  stem:"Qual estrategia de migracao descreve melhor esse movimento?",
  opts:[
    {k:"A",t:"Replatform (lift and tinker): mover a aplicacao para EC2 e o banco para o Amazon RDS"},
    {k:"B",t:"Rehost (lift and shift): mover aplicacao e banco para EC2 sem alteracoes"},
    {k:"C",t:"Refactor: reescrever o ERP como microsservicos serverless"},
    {k:"D",t:"Repurchase: substituir o ERP por uma solucao SaaS"}
  ],
  ans:["A"],
  why:{
    ok:"Replatform e mover sem reescrever, mas trocando um componente por um servico gerenciado. Mover o MySQL para o RDS tira a administracao do banco da equipe e mantem a aplicacao intacta: exatamente o enunciado.",
    B:"Rehost puro deixaria o MySQL rodando em EC2, e a equipe continuaria administrando backup, patch e failover. Nao atende ao segundo requisito.",
    C:"Refactor significa reescrever, o que o enunciado proibe, e nao cabe em 4 meses para um ERP.",
    D:"Repurchase troca o produto por um SaaS. O enunciado nao fala em abandonar o ERP atual."
  },
  src:[{t:"AWS: as 6 estrategias de migracao",u:"https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html"}]
},
{
  id:"aw-d1-02", exam:"clf", dom:"d1", lvl:3, type:"single", sec:70, tags:["infraestrutura-global","edge"],
  case:"Usuarios na America do Sul reclamam de lentidao ao baixar imagens e videos hospedados em um bucket S3 na regiao us-east-1. O conteudo e estatico e identico para todos.",
  stem:"Qual componente da infraestrutura global da AWS resolve o problema?",
  opts:[
    {k:"A",t:"Pontos de presenca (edge locations) usados pelo Amazon CloudFront"},
    {k:"B",t:"Uma zona de disponibilidade adicional em us-east-1"},
    {k:"C",t:"AWS Local Zones"},
    {k:"D",t:"Um grupo de Auto Scaling com mais instancias"}
  ],
  ans:["A"],
  why:{
    ok:"CloudFront usa pontos de presenca espalhados pelo mundo para guardar copia do conteudo estatico perto do usuario. Isso corta a distancia e resolve latencia de download.",
    B:"Zona adicional melhora disponibilidade dentro da mesma regiao. Nao aproxima o conteudo do usuario na America do Sul.",
    C:"Local Zones aproximam recursos de computacao e armazenamento de grandes centros urbanos especificos, para cargas de latencia muito baixa. Para distribuir conteudo estatico global, a ferramenta e a CDN.",
    D:"Auto Scaling resolve falta de capacidade de processamento. O problema aqui e distancia de rede, nao capacidade."
  },
  src:[{t:"Infraestrutura global da AWS",u:"https://aws.amazon.com/about-aws/global-infrastructure/"}]
},
{
  id:"aw-d1-03", exam:"clf", dom:"d1", lvl:4, type:"multi", sec:90, tags:["well-architected"],
  stem:"Uma arquitetura foi reprovada na revisao porque nao havia nenhuma metrica de negocio sendo monitorada, nenhum runbook de resposta a incidente e o custo nao era acompanhado por equipe. Quais pilares do AWS Well-Architected Framework foram diretamente violados? Escolha DOIS.",
  opts:[
    {k:"A",t:"Excelencia operacional"},
    {k:"B",t:"Otimizacao de custos"},
    {k:"C",t:"Seguranca"},
    {k:"D",t:"Eficiencia de desempenho"},
    {k:"E",t:"Sustentabilidade"}
  ],
  ans:["A","B"],
  why:{
    ok:"Falta de monitoramento e de runbook e falha de excelencia operacional, o pilar que trata de operar, observar e melhorar continuamente. Custo nao acompanhado por equipe e falha de otimizacao de custos, que inclui atribuir e medir despesa.",
    C:"Seguranca cobre identidade, protecao de dados e deteccao. O enunciado nao descreve falha de controle de acesso ou criptografia.",
    D:"Eficiencia de desempenho trata de escolher e dimensionar recursos corretamente. Nao e o que o enunciado aponta.",
    E:"Sustentabilidade trata de reduzir impacto ambiental da carga. Nada no enunciado aborda isso."
  },
  src:[{t:"AWS Well-Architected",u:"https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html"}]
},

/* ---------------- CLF-C02 · D2 seguranca ---------------- */
{
  id:"aw-d2-01", exam:"clf", dom:"d2", lvl:4, type:"yn", sec:95, tags:["responsabilidade-compartilhada"],
  stem:"Responda Sim ou Nao sobre o modelo de responsabilidade compartilhada da AWS.",
  rows:[
    {t:"Em uma instancia EC2, instalar as correcoes de seguranca do sistema operacional convidado e responsabilidade do cliente.", a:true,
     e:"EC2 e IaaS: o SO convidado e do cliente. A AWS responde pelo hipervisor e pela infraestrutura fisica."},
    {t:"No Amazon RDS, aplicar patch do sistema operacional e do motor do banco e responsabilidade da AWS.", a:true,
     e:"RDS e gerenciado: SO e engine ficam com a AWS. O cliente cuida de usuarios, permissoes, grupos de seguranca e dos dados."},
    {t:"Configurar corretamente as permissoes de um bucket S3 e responsabilidade da AWS.", a:false,
     e:"Configuracao de acesso e sempre do cliente. Bucket exposto por configuracao errada e responsabilidade de quem configurou."},
    {t:"A descarte seguro de discos fisicos no datacenter e responsabilidade da AWS.", a:true,
     e:"Tudo que e fisico no datacenter pertence a AWS, inclusive descarte de midia."},
    {t:"Criptografar dados sensiveis em repouso e decisao e responsabilidade do cliente.", a:true,
     e:"A AWS fornece as ferramentas (KMS, criptografia nos servicos), mas decidir e habilitar e do cliente."}
  ],
  src:[{t:"Modelo de responsabilidade compartilhada",u:"https://aws.amazon.com/compliance/shared-responsibility-model/"}]
},
{
  id:"aw-d2-02", exam:"clf", dom:"d2", lvl:5, type:"single", sec:95, tags:["seguranca-servicos"],
  case:"A equipe de seguranca precisa de quatro coisas: 1) saber quem chamou qual API e quando; 2) descobrir se algum bucket contem dados pessoais sem protecao; 3) receber alerta quando uma instancia comecar a se comunicar com um endereco associado a mineracao de criptomoeda; 4) baixar o relatorio SOC 2 para enviar ao auditor.",
  stem:"Quais servicos atendem, respectivamente, aos itens 1, 2, 3 e 4?",
  opts:[
    {k:"A",t:"CloudTrail, Macie, GuardDuty e Artifact"},
    {k:"B",t:"CloudWatch, Inspector, GuardDuty e Config"},
    {k:"C",t:"CloudTrail, Inspector, Detective e Artifact"},
    {k:"D",t:"Config, Macie, Security Hub e Trusted Advisor"}
  ],
  ans:["A"],
  why:{
    ok:"CloudTrail registra chamadas de API, respondendo quem fez o que e quando. Macie descobre e classifica dado sensivel no S3. GuardDuty detecta ameaca analisando logs e sinais, inclusive comunicacao com destino malicioso conhecido. Artifact e o portal de relatorios de conformidade, como SOC e PCI.",
    B:"CloudWatch coleta metrica e log, mas o registro de auditoria de API e o CloudTrail. Inspector procura vulnerabilidade de software, nao dado pessoal. Config avalia configuracao, nao distribui relatorio de auditoria.",
    C:"Inspector nao classifica dado sensivel. Detective ajuda a investigar depois do alerta, nao a gerar a deteccao.",
    D:"Config nao e log de API. Security Hub agrega achados de varios servicos, mas quem detecta a comunicacao suspeita e o GuardDuty. Trusted Advisor da recomendacoes, nao relatorio de conformidade."
  },
  src:[{t:"CloudTrail",u:"https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html"},
       {t:"Amazon Macie",u:"https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html"},
       {t:"Amazon GuardDuty",u:"https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html"},
       {t:"AWS Artifact",u:"https://aws.amazon.com/artifact/"}]
},
{
  id:"aw-d2-03", exam:"clf", dom:"d2", lvl:4, type:"single", sec:80, tags:["sg","nacl"],
  case:"Durante um ataque, a equipe identificou um unico endereco IP que gera milhares de requisicoes. E preciso bloquear somente aquele IP no nivel da sub-rede, mantendo o acesso liberado para todos os outros.",
  stem:"Qual recurso permite fazer isso?",
  opts:[
    {k:"A",t:"Network ACL, criando uma regra de negacao para o IP"},
    {k:"B",t:"Security Group, criando uma regra de negacao para o IP"},
    {k:"C",t:"IAM policy com condicao de endereco de origem"},
    {k:"D",t:"Tabela de rotas, removendo a rota para aquele IP"}
  ],
  ans:["A"],
  why:{
    ok:"A NACL atua na sub-rede e aceita regras de allow e de deny, avaliadas por numero. E o unico dos controles de rede da VPC capaz de negar um IP especifico.",
    B:"Security Group nao possui regra de negacao: tudo que nao esta permitido ja esta implicitamente negado, e nao existe forma de excluir um IP de uma permissao mais ampla.",
    C:"IAM controla chamadas a API da AWS por identidades, nao trafego de rede chegando na aplicacao.",
    D:"Mexer em rota afeta o caminho de saida e tende a quebrar conectividade legitima. Nao e mecanismo de filtragem por origem."
  },
  src:[{t:"Network ACLs",u:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html"},
       {t:"Security groups",u:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html"}]
},
{
  id:"aw-d2-04", exam:"clf", dom:"d2", lvl:3, type:"multi", sec:85, tags:["root","mfa","boas-praticas"],
  stem:"Quais sao praticas recomendadas pela AWS para proteger a conta e as identidades? Escolha as TRES melhores opcoes.",
  opts:[
    {k:"A",t:"Habilitar MFA no usuario raiz e guardar as credenciais dele fora do uso diario"},
    {k:"B",t:"Conceder apenas as permissoes necessarias, seguindo o privilegio minimo"},
    {k:"C",t:"Usar funcoes do IAM para que aplicacoes obtenham credenciais temporarias"},
    {k:"D",t:"Compartilhar um unico usuario do IAM entre a equipe para simplificar a auditoria"},
    {k:"E",t:"Gravar chaves de acesso de longo prazo no codigo da aplicacao"}
  ],
  ans:["A","B","C"],
  why:{
    ok:"As tres praticas sao as recomendacoes centrais: proteger o raiz com MFA e nao usa-lo no dia a dia, aplicar privilegio minimo e preferir funcoes com credencial temporaria em vez de chave estatica.",
    D:"Usuario compartilhado destroi a auditoria, porque nenhuma acao pode ser atribuida a uma pessoa. E o oposto do recomendado.",
    E:"Chave de longo prazo no codigo e o erro classico: nao expira, vaza em repositorio e e dificil de rotacionar."
  },
  src:[{t:"Boas praticas de IAM",u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"}]
},
{
  id:"aw-d2-05", exam:"clf", dom:"d2", lvl:5, type:"single", sec:85, tags:["kms","secrets","hsm"],
  case:"Um sistema precisa guardar a senha de um banco de dados de terceiro. Requisitos: a senha deve ser trocada automaticamente a cada 30 dias, sem alterar codigo, e a aplicacao deve busca-la por chamada de API no momento do uso.",
  stem:"Qual servico atende diretamente?",
  opts:[
    {k:"A",t:"AWS Secrets Manager"},
    {k:"B",t:"AWS KMS"},
    {k:"C",t:"AWS CloudHSM"},
    {k:"D",t:"Parameter Store no nivel padrao, sem integracao adicional"}
  ],
  ans:["A"],
  why:{
    ok:"Secrets Manager foi feito para segredo de aplicacao com rotacao automatica integrada e recuperacao via API. O requisito de troca a cada 30 dias sem mexer no codigo e exatamente o diferencial dele.",
    B:"KMS gerencia chaves de criptografia, nao segredos como senha. Ele e usado por baixo para proteger o segredo, mas nao faz rotacao de credencial de banco.",
    C:"CloudHSM entrega modulo de hardware dedicado para quem precisa de controle exclusivo de chave criptografica. E mais caro, mais complexo e nao e um cofre de segredo com rotacao.",
    D:"O Parameter Store padrao armazena parametros, inclusive seguros, mas nao oferece rotacao automatica pronta: seria preciso construir a rotacao. O enunciado pede algo direto."
  },
  src:[{t:"AWS Secrets Manager",u:"https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html"}]
},
{
  id:"aw-d2-06", exam:"clf", dom:"d2", lvl:4, type:"single", sec:80, tags:["waf","shield","ddos"],
  case:"Uma API publica sofre duas ameacas: ataques volumetricos de camada de rede e tentativas de injecao de SQL nas requisicoes HTTP. A empresa quer protecao gerenciada para os dois casos, com acesso a um time de resposta da AWS durante incidentes.",
  stem:"Qual combinacao atende?",
  opts:[
    {k:"A",t:"AWS Shield Advanced junto com AWS WAF"},
    {k:"B",t:"AWS Shield Standard junto com Amazon GuardDuty"},
    {k:"C",t:"AWS WAF junto com Amazon Inspector"},
    {k:"D",t:"Security Groups junto com Network ACLs"}
  ],
  ans:["A"],
  why:{
    ok:"Shield Advanced amplia a protecao DDoS, inclui protecao financeira contra escalada de custo e da acesso ao time de resposta da AWS. O WAF inspeciona requisicoes HTTP e bloqueia padroes como injecao de SQL. Juntos cobrem rede e aplicacao.",
    B:"Shield Standard e automatico e gratuito, mas nao da acesso a time de resposta nem protege camada 7. GuardDuty detecta ameaca, nao bloqueia requisicao maliciosa.",
    C:"WAF cobre a injecao de SQL, mas Inspector avalia vulnerabilidade em software e nao defende contra DDoS volumetrico.",
    D:"SG e NACL filtram por IP, porta e protocolo. Nenhum dos dois entende conteudo HTTP nem absorve ataque volumetrico."
  },
  src:[{t:"AWS Shield",u:"https://docs.aws.amazon.com/waf/latest/developerguide/ddos-advanced-summary.html"},
       {t:"AWS WAF",u:"https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html"}]
},

/* ---------------- CLF-C02 · D3 tecnologia e servicos ---------------- */
{
  id:"aw-d3-01", exam:"clf", dom:"d3", lvl:5, type:"single", sec:90, tags:["storage","ebs","efs","instance-store"],
  case:"Uma aplicacao em um grupo de Auto Scaling precisa que as tres instancias leiam e gravem no MESMO sistema de arquivos ao mesmo tempo, com os dados sobrevivendo ao encerramento de qualquer instancia. O sistema operacional e Linux.",
  stem:"Qual opcao de armazenamento atende?",
  opts:[
    {k:"A",t:"Amazon EFS"},
    {k:"B",t:"Um volume Amazon EBS compartilhado entre as instancias"},
    {k:"C",t:"Instance store das proprias instancias"},
    {k:"D",t:"Amazon S3 montado como disco local"}
  ],
  ans:["A"],
  why:{
    ok:"EFS e um sistema de arquivos NFS gerenciado, elastico, acessivel simultaneamente por muitas instancias Linux em varias zonas, e independe do ciclo de vida das instancias. E o caso de uso descrito.",
    B:"EBS e, no modelo comum, anexado a uma instancia por vez e preso a uma unica zona. Nao serve como sistema de arquivos compartilhado de uso geral por um grupo de Auto Scaling.",
    C:"Instance store e efemero: os dados se perdem quando a instancia para ou e encerrada. O enunciado exige sobrevivencia ao encerramento.",
    D:"S3 e armazenamento de objetos acessado por API. Tratar o S3 como disco local traz semantica diferente de sistema de arquivos e nao e a resposta esperada para leitura e gravacao compartilhada POSIX."
  },
  src:[{t:"Amazon EFS",u:"https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html"},
       {t:"Instance store",u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html"}]
},
{
  id:"aw-d3-02", exam:"clf", dom:"d3", lvl:5, type:"single", sec:95, tags:["bancos","dynamodb","redshift","aurora"],
  case:"Tres necessidades no mesmo projeto: 1) catalogo de produtos com leitura por chave em milissegundos e trafego altamente variavel; 2) relatorios analiticos que varrem bilhoes de linhas historicas; 3) banco relacional compativel com PostgreSQL, com alta disponibilidade e replicas de leitura.",
  stem:"Quais servicos atendem, respectivamente, aos itens 1, 2 e 3?",
  opts:[
    {k:"A",t:"DynamoDB, Redshift e Aurora"},
    {k:"B",t:"RDS, Athena e DynamoDB"},
    {k:"C",t:"ElastiCache, Redshift e RDS for MySQL"},
    {k:"D",t:"DynamoDB, Aurora e Redshift"}
  ],
  ans:["A"],
  why:{
    ok:"DynamoDB e NoSQL de chave e valor com latencia de milissegundos e escala elastica, ideal para catalogo. Redshift e data warehouse colunar para consulta analitica sobre volume historico. Aurora e o relacional gerenciado compativel com PostgreSQL, com replicas e alta disponibilidade.",
    B:"RDS atenderia o item 3, nao o 1. Athena consulta dados no S3 sob demanda, uma proposta diferente de data warehouse dedicado. E DynamoDB nao e relacional compativel com PostgreSQL.",
    C:"ElastiCache e cache em memoria, nao banco primario do catalogo. E RDS for MySQL nao atende ao requisito explicito de compatibilidade com PostgreSQL.",
    D:"Inverte os papeis: Aurora e transacional (OLTP) e Redshift e analitico (OLAP). Varrer bilhoes de linhas historicas pede Redshift, nao Aurora."
  },
  src:[{t:"Amazon DynamoDB",u:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html"},
       {t:"Amazon Redshift",u:"https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html"}]
},
{
  id:"aw-d3-03", exam:"clf", dom:"d3", lvl:4, type:"single", sec:80, tags:["elb","alb","nlb"],
  case:"Um sistema expoe dois caminhos no mesmo dominio: /api deve ir para um grupo de containers e /imagens para outro. Alem disso, e necessario inspecionar cabecalhos HTTP para rotear.",
  stem:"Qual balanceador deve ser usado?",
  opts:[
    {k:"A",t:"Application Load Balancer"},
    {k:"B",t:"Network Load Balancer"},
    {k:"C",t:"Gateway Load Balancer"},
    {k:"D",t:"Classic Load Balancer"}
  ],
  ans:["A"],
  why:{
    ok:"O ALB opera na camada 7 e faz roteamento baseado em caminho, host e cabecalhos HTTP. Rotear /api e /imagens para grupos diferentes e exatamente o que ele faz.",
    B:"O NLB opera na camada 4, com TCP e UDP. Ele nao enxerga caminho nem cabecalho HTTP, entao nao consegue rotear por URL.",
    C:"O GWLB serve para inserir appliances de inspecao de trafego no caminho da rede. Nao e um balanceador de aplicacao web.",
    D:"O Classic e a geracao legada, com recursos limitados de roteamento, e a AWS recomenda os balanceadores novos para casos como este."
  },
  src:[{t:"Elastic Load Balancing",u:"https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html"}]
},
{
  id:"aw-d3-04", exam:"clf", dom:"d3", lvl:4, type:"single", sec:85, tags:["vpc","nat","igw"],
  case:"Instancias em uma sub-rede privada precisam baixar atualizacoes de seguranca da internet. Nenhuma conexao iniciada de fora pode alcancar essas instancias.",
  stem:"Qual configuracao atende?",
  opts:[
    {k:"A",t:"Um NAT Gateway em uma sub-rede publica, com rota de saida da sub-rede privada apontando para ele"},
    {k:"B",t:"Um Internet Gateway anexado diretamente a sub-rede privada"},
    {k:"C",t:"Um IP elastico em cada instancia privada"},
    {k:"D",t:"Um VPC Endpoint do tipo gateway para a internet"}
  ],
  ans:["A"],
  why:{
    ok:"O NAT Gateway fica na sub-rede publica e permite trafego de saida originado na sub-rede privada, sem permitir conexoes iniciadas de fora. E o padrao para atualizar instancias privadas.",
    B:"Internet Gateway e anexado a VPC, nao a uma sub-rede, e e justamente o que torna uma sub-rede publica. Usar rota direta para ele exporia as instancias a conexoes de entrada.",
    C:"Atribuir IP elastico transforma a instancia em alcancavel da internet, violando o requisito.",
    D:"VPC Endpoint da acesso privado a servicos da AWS, como S3 e DynamoDB. Nao existe endpoint para a internet em geral."
  },
  src:[{t:"NAT Gateway",u:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html"}]
},
{
  id:"aw-d3-05", exam:"clf", dom:"d3", lvl:4, type:"single", sec:85, tags:["sqs","sns","kinesis"],
  case:"Um sistema de telemetria recebe eventos de sensores. Requisitos: a ordem dos eventos de cada sensor precisa ser preservada e dois times diferentes precisam processar o mesmo fluxo de forma independente, podendo reler os dados dos ultimos dias para recalcular metricas.",
  stem:"Qual servico atende?",
  opts:[
    {k:"A",t:"Amazon Kinesis Data Streams"},
    {k:"B",t:"Amazon SQS fila padrao"},
    {k:"C",t:"Amazon SNS"},
    {k:"D",t:"Amazon SQS fila FIFO"}
  ],
  ans:["A"],
  why:{
    ok:"Kinesis Data Streams mantem os registros por um periodo de retencao, preserva ordem dentro do shard e permite que varios consumidores independentes leiam e releiam o mesmo fluxo. Os tres requisitos juntos descrevem streaming, nao fila.",
    B:"Fila padrao nao garante ordem e, sobretudo, a mensagem e removida depois de processada: nao da para reler o historico nem ter dois times consumindo o mesmo item de forma independente.",
    C:"SNS entrega a mensagem aos inscritos no momento da publicacao. Nao guarda historico para releitura e nao garante ordenacao do fluxo.",
    D:"FIFO resolve a ordem, mas continua sendo fila: a mensagem e consumida e some. Nao atende a releitura dos ultimos dias."
  },
  src:[{t:"Kinesis Data Streams",u:"https://docs.aws.amazon.com/streams/latest/dev/introduction.html"}]
},
{
  id:"aw-d3-06", exam:"clf", dom:"d3", lvl:3, type:"single", sec:75, tags:["compute","lambda","fargate"],
  case:"Uma rotina converte imagens assim que elas chegam no S3. Cada execucao leva cerca de 8 segundos e o volume e irregular: as vezes zero por hora, as vezes 5 mil em poucos minutos.",
  stem:"Qual opcao de computacao e mais adequada?",
  opts:[
    {k:"A",t:"AWS Lambda acionado por evento do S3"},
    {k:"B",t:"Instancias EC2 reservadas rodando um servico que consulta o bucket"},
    {k:"C",t:"AWS Batch com fila de jobs"},
    {k:"D",t:"Uma instancia EC2 com cron a cada minuto"}
  ],
  ans:["A"],
  why:{
    ok:"Execucao curta, orientada a evento e com volume muito irregular e o cenario natural do Lambda: escala automaticamente, nao cobra quando esta ocioso e integra nativamente com evento do S3.",
    B:"Reserva pressupoe uso constante. Com periodos de volume zero, voce paga por capacidade parada, e ainda precisa escrever a logica de varredura do bucket.",
    C:"Batch e desenhado para lote longo e com dependencias, nao para milhares de tarefas de 8 segundos disparadas por evento.",
    D:"Cron de um minuto introduz atraso, nao escala no pico de 5 mil e mantem a instancia paga em todo o periodo ocioso."
  },
  src:[{t:"AWS Lambda",u:"https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"}]
},
{
  id:"aw-d3-07", exam:"clf", dom:"d3", lvl:4, type:"order", sec:85, tags:["s3-classes","custo"],
  stem:"Ordene as classes do S3 do MAIOR para o MENOR custo de armazenamento por GB (considerando o uso tipico de cada classe).",
  items:[
    {t:"S3 Standard"},
    {t:"S3 Standard-IA"},
    {t:"S3 Glacier Flexible Retrieval"},
    {t:"S3 Glacier Deep Archive"}
  ],
  e:"O custo de guardar cai conforme o acesso fica mais raro e o tempo de resgate aumenta: Standard e o mais caro para armazenar e o mais barato para ler; Standard-IA reduz o armazenamento e cobra pela recuperacao; Glacier Flexible baixa mais e resgata em minutos a horas; Deep Archive e o mais barato de todos, com resgate na casa de horas. A pegadinha e inverter, achando que o Glacier e caro porque o resgate custa.",
  src:[{t:"Classes de armazenamento do S3",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"}]
},
{
  id:"aw-d3-08", exam:"clf", dom:"d3", lvl:4, type:"single", sec:80, tags:["route53","dns"],
  case:"Uma empresa mantem a aplicacao em duas regioes. O objetivo e enviar cada usuario para a regiao que responde mais rapido para ele e, se uma regiao ficar fora, direcionar todos para a outra automaticamente.",
  stem:"Qual combinacao do Route 53 atende?",
  opts:[
    {k:"A",t:"Politica de latencia com verificacoes de integridade (health checks)"},
    {k:"B",t:"Politica de geolocalizacao sem verificacoes de integridade"},
    {k:"C",t:"Politica ponderada com pesos iguais"},
    {k:"D",t:"Politica simples com dois registros de endereco"}
  ],
  ans:["A"],
  why:{
    ok:"A politica de latencia escolhe o endpoint com menor latencia medida para o usuario. As verificacoes de integridade retiram automaticamente da resposta o endpoint que esta fora, produzindo o failover desejado.",
    B:"Geolocalizacao roteia pela localizacao geografica declarada, que nao e a mesma coisa que menor latencia. E sem health check nao existe failover.",
    C:"Politica ponderada distribui por proporcao definida, ignorando o desempenho percebido por cada usuario.",
    D:"A politica simples pode retornar varios enderecos, mas nao avalia latencia nem integridade do endpoint."
  },
  src:[{t:"Politicas de roteamento do Route 53",u:"https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"}]
},
{
  id:"aw-d3-09", exam:"clf", dom:"d3", lvl:4, type:"single", sec:80, tags:["conectividade","direct-connect","tgw"],
  case:"Uma empresa tem 25 VPCs em 3 regioes e dois datacenters. Hoje existem dezenas de conexoes ponto a ponto e a equipe nao consegue mais administrar as rotas.",
  stem:"Qual servico simplifica essa topologia?",
  opts:[
    {k:"A",t:"AWS Transit Gateway"},
    {k:"B",t:"Mais emparelhamentos de VPC (VPC peering)"},
    {k:"C",t:"AWS Direct Connect"},
    {k:"D",t:"Internet Gateway em cada VPC"}
  ],
  ans:["A"],
  why:{
    ok:"O Transit Gateway funciona como um hub de rede: cada VPC e cada conexao local se liga a ele uma unica vez, e o roteamento passa a ser transitivo e centralizado. Isso elimina a malha de conexoes ponto a ponto.",
    B:"VPC peering nao e transitivo: para N VPCs se falarem, o numero de conexoes cresce de forma quadratica. E justamente a causa do problema descrito.",
    C:"Direct Connect e um link privado entre o datacenter e a AWS. Resolve conectividade e banda, nao a complexidade de malha entre as 25 VPCs.",
    D:"Internet Gateway da acesso a internet. Nao interliga VPCs de forma privada."
  },
  src:[{t:"AWS Transit Gateway",u:"https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html"}]
},

/* ---------------- CLF-C02 · D4 cobranca, precos e suporte ---------------- */
{
  id:"aw-d4-01", exam:"clf", dom:"d4", lvl:5, type:"single", sec:90, tags:["suporte","sla"],
  case:"Uma empresa precisa de: atendimento tecnico 24 horas por telefone, tempo de resposta de 15 minutos para caso de sistema critico de negocio fora do ar, um gerente tecnico de conta designado e revisoes de Well-Architected conduzidas pela AWS.",
  stem:"Qual plano de suporte atende a TODOS os requisitos?",
  opts:[
    {k:"A",t:"Enterprise"},
    {k:"B",t:"Enterprise On-Ramp"},
    {k:"C",t:"Business"},
    {k:"D",t:"Developer"}
  ],
  ans:["A"],
  why:{
    ok:"O conjunto citado, com resposta de 15 minutos para caso critico de negocio, gerente tecnico de conta designado e revisoes conduzidas pela AWS, corresponde ao plano Enterprise.",
    B:"O Enterprise On-Ramp tambem atende caso critico de negocio, mas com tempo de resposta maior e com acesso a um grupo de especialistas em vez de um gerente tecnico designado.",
    C:"O Business oferece suporte 24 horas e tempo agressivo para sistema de producao fora do ar, mas nao possui a severidade de caso critico de negocio com 15 minutos nem gerente tecnico designado.",
    D:"O Developer e voltado a ambiente de teste, com atendimento em horario comercial e sem suporte por telefone 24 horas."
  },
  src:[{t:"Planos de suporte AWS",u:"https://aws.amazon.com/premiumsupport/plans/"}]
},
{
  id:"aw-d4-02", exam:"clf", dom:"d4", lvl:4, type:"single", sec:80, tags:["organizations","billing"],
  case:"Um grupo tem 12 contas AWS, uma por equipe. A diretoria quer uma fatura unica, aproveitar faixas de desconto por volume agregando o consumo de todas as contas e impedir que qualquer equipe use regioes fora da America do Sul.",
  stem:"Qual conjunto de recursos atende?",
  opts:[
    {k:"A",t:"AWS Organizations com cobranca consolidada e politicas de controle de servico (SCP)"},
    {k:"B",t:"AWS Organizations com cobranca consolidada e grupos de seguranca"},
    {k:"C",t:"AWS Budgets com alertas e IAM policies em cada conta"},
    {k:"D",t:"AWS Control Tower apenas, sem Organizations"}
  ],
  ans:["A"],
  why:{
    ok:"Organizations entrega a fatura unica e faz o consumo das contas somar para efeito de faixa de desconto por volume. As SCPs definem o limite maximo de permissao de cada conta, permitindo bloquear regioes inteiras.",
    B:"Grupo de seguranca filtra trafego de rede. Nao tem como impedir o uso de uma regiao.",
    C:"Budgets alerta sobre gasto, mas nao consolida fatura nem agrega volume. E manter politicas IAM separadas em 12 contas nao cria um limite organizacional confiavel.",
    D:"Control Tower e construido sobre o Organizations: ele nao substitui nem funciona sem essa base."
  },
  src:[{t:"AWS Organizations",u:"https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html"}]
},
{
  id:"aw-d4-03", exam:"clf", dom:"d4", lvl:4, type:"single", sec:85, tags:["custo-ferramentas"],
  case:"Quatro pedidos chegaram no mesmo dia: 1) estimar o custo de uma arquitetura que ainda nao existe; 2) ver o gasto dos ultimos 6 meses por servico e projetar o proximo mes; 3) receber e-mail quando o gasto passar de um valor definido; 4) descobrir recursos subutilizados para reduzir conta.",
  stem:"Quais ferramentas atendem, respectivamente, aos itens 1, 2, 3 e 4?",
  opts:[
    {k:"A",t:"Pricing Calculator, Cost Explorer, AWS Budgets e Trusted Advisor"},
    {k:"B",t:"Cost Explorer, Pricing Calculator, CloudWatch e Inspector"},
    {k:"C",t:"Pricing Calculator, Cost and Usage Report, Cost Explorer e Config"},
    {k:"D",t:"Budgets, Cost Explorer, Pricing Calculator e Compute Optimizer"}
  ],
  ans:["A"],
  why:{
    ok:"Pricing Calculator estima antes de existir. Cost Explorer visualiza o historico e projeta tendencia. Budgets dispara alerta ao atingir um limite. Trusted Advisor aponta recurso ocioso ou subutilizado na categoria de otimizacao de custo.",
    B:"Inverte as duas primeiras ferramentas e usa Inspector, que trata de vulnerabilidade de seguranca, nao de custo.",
    C:"O Cost and Usage Report entrega dados detalhados em arquivo, sem a visualizacao e a projecao pedidas, e o Config avalia configuracao, nao desperdicio de custo.",
    D:"Tambem inverte a ordem das tres primeiras. O Compute Optimizer realmente recomenda dimensionamento, mas a resposta falha nos outros itens."
  },
  src:[{t:"Cost Explorer",u:"https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html"},
       {t:"AWS Budgets",u:"https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html"}]
},
{
  id:"aw-d4-04", exam:"clf", dom:"d4", lvl:4, type:"yn", sec:90, tags:["precos","spot","savings"],
  stem:"Responda Sim ou Nao sobre modelos de precificacao de computacao na AWS.",
  rows:[
    {t:"Instancias spot podem ser interrompidas pela AWS quando a capacidade e necessaria, com aviso previo curto.", a:true,
     e:"Sim. Por isso spot so serve para carga tolerante a interrupcao."},
    {t:"Savings Plans de computacao permitem mudar de familia de instancia e de regiao mantendo o desconto.", a:true,
     e:"Sim, e esse e o diferencial frente a reserva padrao: o compromisso e de gasto por hora, nao de uma instancia especifica."},
    {t:"Instancias reservadas garantem que a instancia nunca sera interrompida por falta de capacidade mesmo sem reserva de capacidade.", a:false,
     e:"Reserva e um compromisso de faturamento. Garantia de capacidade exige configuracao especifica de reserva zonal ou Capacity Reservation."},
    {t:"Carga de producao 24/7 por 3 anos tende a ficar mais barata em spot do que em Savings Plan.", a:false,
     e:"Spot tem o maior desconto por hora, mas nao serve para carga que nao pode cair. Para 24/7 estavel, o modelo correto e compromisso de longo prazo."}
  ],
  src:[{t:"Savings Plans",u:"https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html"},
       {t:"Instancias spot",u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html"}]
},
{
  id:"aw-d4-05", exam:"clf", dom:"d4", lvl:3, type:"single", sec:70, tags:["free-tier"],
  stem:"Uma equipe quer validar uma ideia sem gerar custo. Qual afirmacao sobre o nivel gratuito da AWS e correta?",
  opts:[
    {k:"A",t:"Existem ofertas sempre gratuitas, ofertas gratuitas por 12 meses e testes de curta duracao, com limites diferentes"},
    {k:"B",t:"Todos os servicos sao gratuitos nos primeiros 12 meses, sem limite de uso"},
    {k:"C",t:"O nivel gratuito cobre apenas EC2 e S3"},
    {k:"D",t:"Depois de 12 meses nenhum servico possui cota gratuita"}
  ],
  ans:["A"],
  why:{
    ok:"O nivel gratuito tem tres formatos: sempre gratuito, com cota mensal permanente; gratuito por 12 meses a partir da criacao da conta; e testes de curta duracao a partir da ativacao do servico. Cada oferta tem limite proprio.",
    B:"Nao e tudo nem sem limite. Passar da cota gera cobranca normal, e muitos servicos nao estao no nivel gratuito.",
    C:"A lista de ofertas e muito maior que EC2 e S3 e muda com o tempo.",
    D:"As ofertas sempre gratuitas continuam valendo apos os 12 meses, dentro das cotas definidas."
  },
  src:[{t:"Nivel gratuito da AWS",u:"https://aws.amazon.com/free/"}]
},
{
  id:"aw-d4-06", exam:"clf", dom:"d4", lvl:5, type:"single", sec:85, tags:["custo","dados","transferencia"],
  case:"A fatura de uma empresa cresceu sem aumento de uso de computacao. A analise mostrou que o maior item e transferencia de dados de saida para a internet, gerada por downloads de arquivos grandes hospedados em um bucket S3 e baixados repetidamente pelos mesmos usuarios.",
  stem:"Qual medida tende a reduzir mais esse custo?",
  opts:[
    {k:"A",t:"Colocar o Amazon CloudFront na frente do bucket para servir o conteudo em cache"},
    {k:"B",t:"Mover os arquivos para a classe S3 Standard-IA"},
    {k:"C",t:"Comprar Savings Plans de computacao"},
    {k:"D",t:"Habilitar versionamento no bucket"}
  ],
  ans:["A"],
  why:{
    ok:"CloudFront serve o conteudo repetido a partir do cache nos pontos de presenca. Isso reduz as requisicoes e a transferencia saindo diretamente do S3, e a transferencia do CloudFront para a internet tem precificacao mais favoravel em volume. O problema e conteudo repetido, e cache e a resposta.",
    B:"Standard-IA reduz o custo de ARMAZENAR, mas aumenta o custo por recuperacao. Com download repetido frequente, pode sair mais caro.",
    C:"Savings Plans de computacao nao se aplicam a transferencia de dados nem a S3.",
    D:"Versionamento guarda copias antigas e tende a AUMENTAR o custo de armazenamento, sem afetar a transferencia de saida."
  },
  src:[{t:"Amazon CloudFront",u:"https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html"}]
}
];
