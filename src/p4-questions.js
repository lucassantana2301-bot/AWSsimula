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
  case:"A Contoso roda 40 servidores num datacenter próprio. O contrato de energia e o de suporte do hardware vencem em 90 dias. A diretoria financeira avisou que não haverá verba de investimento neste ano fiscal, mas existe orçamento de custeio mensal. A carga é sazonal: dobra em novembro e cai pela metade em fevereiro.",
  stem:"Qual característica da nuvem pública resolve ao mesmo tempo a restrição de verba e a sazonalidade?",
  opts:[
    {k:"A",t:"Modelo de despesa operacional com precificação por consumo, pagando apenas pelos recursos usados em cada mês"},
    {k:"B",t:"Alta disponibilidade com SLA financeiro, que garante crédito quando o serviço fica indisponível"},
    {k:"C",t:"Tolerância a falhas por redundância de hardware, eliminando a necessidade de manutenção"},
    {k:"D",t:"Governança centralizada, que reduz o custo administrativo da equipe de infraestrutura"}
  ],
  ans:["A"],
  why:{
    ok:"São dois requisitos no mesmo enunciado. Despesa operacional resolve a falta de verba de investimento, porque você deixa de comprar hardware e passa a pagar mensalmente. Precificação por consumo resolve a sazonalidade, porque em fevereiro você paga menos. Só a alternativa A cobre os dois.",
    B:"SLA e crédito por indisponibilidade não têm relação com verba de investimento nem com variação de carga. É um distrator que soa técnico.",
    C:"Tolerância a falhas trata de continuidade quando algo quebra, não de como o gasto é classificado nem de carga sazonal.",
    D:"Governança pode reduzir custo indireto, mas não é o que converte investimento em custeio nem o que acompanha o pico de novembro."
  },
  src:[{t:"Microsoft Learn: benefícios da nuvem",u:"https://learn.microsoft.com/training/modules/describe-cloud-compute/"}]
},
{
  id:"az-d1-02", exam:"az900", dom:"d1", lvl:4, type:"single", sec:70, tags:["elasticidade","escalabilidade","agilidade"],
  stem:"Uma loja virtual configura regras que adicionam instâncias quando a CPU passa de 70% e removem instâncias quando cai abaixo de 30%, sem ninguém intervir. Qual termo descreve exatamente esse comportamento?",
  opts:[
    {k:"A",t:"Elasticidade"},
    {k:"B",t:"Escalabilidade vertical"},
    {k:"C",t:"Agilidade"},
    {k:"D",t:"Alta disponibilidade"}
  ],
  ans:["A"],
  why:{
    ok:"Elasticidade é a capacidade de aumentar E diminuir recursos automaticamente, acompanhando a demanda. As duas direções e o automatismo são as marcas do termo.",
    B:"Escalabilidade vertical é aumentar o tamanho da máquina (mais CPU e memória na mesma instância). Aqui estão sendo adicionadas instâncias, o que seria horizontal, e ainda assim o termo que descreve o ciclo automático nos dois sentidos é elasticidade.",
    C:"Agilidade é conseguir provisionar e mudar recursos rapidamente, por exemplo criar um ambiente novo em minutos. Não descreve o ajuste automático por métrica.",
    D:"Alta disponibilidade é manter o serviço funcionando diante de falhas. O cenário fala de capacidade acompanhando demanda, não de resistir à falha."
  },
  src:[{t:"Microsoft Learn: elasticidade e escalabilidade",u:"https://learn.microsoft.com/training/modules/describe-cloud-compute/"}]
},
{
  id:"az-d1-03", exam:"az900", dom:"d1", lvl:4, type:"yn", sec:95, tags:["responsabilidade-compartilhada"],
  stem:"Responda Sim ou Não para cada afirmação sobre o modelo de responsabilidade compartilhada no Azure.",
  rows:[
    {t:"Numa VM do Azure (IaaS), aplicar as atualizações de segurança do sistema operacional convidado é responsabilidade do cliente.", a:true,
     e:"Em IaaS, o cliente administra o SO convidado, incluindo patch. A Microsoft cuida do hipervisor para baixo."},
    {t:"Em um serviço PaaS como o Azure App Service, a Microsoft aplica os patches do sistema operacional subjacente.", a:true,
     e:"Em PaaS a plataforma é gerenciada: SO e runtime ficam com a Microsoft. O cliente continua responsável pelo código, pelos dados e pelos acessos."},
    {t:"Em SaaS, como o Microsoft 365, a responsabilidade pela classificação dos dados passa a ser da Microsoft.", a:false,
     e:"Classificação de dados é responsabilidade de accountability do cliente em TODOS os modelos, inclusive SaaS. Esse item é a pegadinha da questão."},
    {t:"A segurança física do datacenter é sempre responsabilidade da Microsoft.", a:true,
     e:"Prédio, energia, rede física e hardware ficam com o provedor em qualquer modelo de nuvem pública."}
  ],
  src:[{t:"Microsoft Learn: responsabilidade compartilhada",u:"https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility"}]
},
{
  id:"az-d1-04", exam:"az900", dom:"d1", lvl:3, type:"single", sec:65, tags:["nuvem-hibrida","soberania"],
  case:"Um hospital precisa levar o portal do paciente para a nuvem para ganhar escala, mas a legislação local exige que os registros clínicos originais permaneçam em servidores dentro do prédio do hospital, sob controle direto da instituição.",
  stem:"Qual modelo de implantação atende ao cenário?",
  opts:[
    {k:"A",t:"Nuvem híbrida"},
    {k:"B",t:"Nuvem pública com criptografia de disco"},
    {k:"C",t:"Nuvem privada"},
    {k:"D",t:"Multinuvem"}
  ],
  ans:["A"],
  why:{
    ok:"Parte da carga fica na nuvem pública (o portal) e parte permanece no ambiente local sob controle do hospital (os registros). Essa combinação é, por definição, nuvem híbrida.",
    B:"Criptografia protege o dado, mas não muda o fato de ele estar fora do prédio. O requisito é de localização e controle físico, não de confidencialidade.",
    C:"Nuvem privada sozinha deixaria o portal sem o ganho de escala da nuvem pública, que é o primeiro requisito do enunciado.",
    D:"Multinuvem é usar dois provedores públicos diferentes. Não resolve a exigência de manter dados dentro do hospital."
  },
  src:[{t:"Microsoft Learn: modelos de nuvem",u:"https://learn.microsoft.com/training/modules/describe-cloud-service-types/"}]
},
{
  id:"az-d1-05", exam:"az900", dom:"d1", lvl:5, type:"single", sec:80, tags:["ha","dr","rto-rpo"],
  case:"Uma fintech precisa que o sistema continue atendendo se um datacenter inteiro ficar indisponível, e também precisa conseguir retomar a operação em outra cidade caso toda a região sofra um desastre natural. A equipe tem orçamento para implementar as duas coisas.",
  stem:"Como classificar corretamente os dois requisitos?",
  opts:[
    {k:"A",t:"O primeiro é alta disponibilidade; o segundo é recuperação de desastre"},
    {k:"B",t:"Os dois são alta disponibilidade, em níveis diferentes"},
    {k:"C",t:"O primeiro é tolerância a falhas; o segundo é alta disponibilidade"},
    {k:"D",t:"Os dois são recuperação de desastre, porque envolvem falha de infraestrutura"}
  ],
  ans:["A"],
  why:{
    ok:"Alta disponibilidade é manter o serviço no ar diante de falhas localizadas, como a queda de um datacenter, normalmente com zonas de disponibilidade. Recuperação de desastre é retomar a operação depois de um evento que atinge a região inteira, tipicamente em outra região, com RTO e RPO definidos.",
    B:"Juntar os dois no mesmo conceito apaga a diferença que a prova cobra: escopo da falha e se existe interrupção aceitável.",
    C:"Tolerância a falhas é um nível ainda mais estrito, de componente redundante sem nenhuma interrupção percebida. E além disso a segunda parte seria disaster recovery, não alta disponibilidade.",
    D:"Perder um datacenter dentro de uma região com zonas não é um desastre regional: é justamente o caso que a alta disponibilidade zonal cobre."
  },
  src:[{t:"Microsoft Learn: confiabilidade",u:"https://learn.microsoft.com/azure/reliability/overview"}]
},

/* ---------------- AZ-900 · D2 arquitetura e serviços ---------------- */
{
  id:"az-d2-01", exam:"az900", dom:"d2", lvl:4, type:"single", sec:85, tags:["zonas","par-regiao"],
  case:"Uma aplicação web roda hoje em três VMs distribuídas em três zonas de disponibilidade da região Brazil South. A diretoria pergunta se a arquitetura sobrevive a um incêndio que destrua a região inteira.",
  stem:"Qual é a resposta tecnicamente correta e o que deveria ser feito?",
  opts:[
    {k:"A",t:"Não sobrevive; é preciso replicar a carga para a região emparelhada e ter um plano de failover entre regiões"},
    {k:"B",t:"Sobrevive, porque zonas de disponibilidade são datacenters fisicamente separados"},
    {k:"C",t:"Sobrevive, porque o Azure replica automaticamente qualquer VM para a região emparelhada"},
    {k:"D",t:"Não sobrevive; a solução é criar um conjunto de disponibilidade adicional na mesma região"}
  ],
  ans:["A"],
  why:{
    ok:"Zonas protegem contra a falha de um datacenter, não contra a perda da região. Para desastre regional é preciso presença em outra região, normalmente a emparelhada, com replicação de dados e processo de failover.",
    B:"As zonas são separadas, mas continuam dentro da mesma região geográfica. Um evento que atinge a região atinge as três zonas.",
    C:"O Azure não replica VMs entre regiões automaticamente. Replicação entre regiões existe para certos tipos de armazenamento (como GRS) e via serviços como Azure Site Recovery, que precisam ser configurados.",
    D:"Conjunto de disponibilidade protege contra falha de rack e manutenção dentro de um único datacenter. É uma proteção menor do que a que já existe e não ajuda em desastre regional."
  },
  src:[{t:"Zonas de disponibilidade",u:"https://learn.microsoft.com/azure/reliability/availability-zones-overview"},
       {t:"Replicação entre regiões",u:"https://learn.microsoft.com/azure/reliability/cross-region-replication-azure"}]
},
{
  id:"az-d2-02", exam:"az900", dom:"d2", lvl:4, type:"yn", sec:90, tags:["grupo-de-recursos","arm"],
  stem:"Responda Sim ou Não sobre grupos de recursos no Azure.",
  rows:[
    {t:"Um grupo de recursos pode conter recursos localizados em regiões diferentes.", a:true,
     e:"Pode. A região do grupo define apenas onde ficam os metadados dele, não onde os recursos rodam."},
    {t:"Um mesmo recurso pode pertencer a dois grupos de recursos ao mesmo tempo.", a:false,
     e:"Cada recurso pertence a exatamente um grupo de recursos. Ele pode ser movido, mas nunca pertencer a dois."},
    {t:"Excluir um grupo de recursos exclui todos os recursos contidos nele.", a:true,
     e:"A exclusão é em cascata. É por isso que recurso crítico recebe bloqueio (lock)."},
    {t:"Grupos de recursos podem ser aninhados dentro de outros grupos de recursos.", a:false,
     e:"Não existe aninhamento de grupos de recursos. Hierarquia acima da assinatura é feita com grupos de gerenciamento."}
  ],
  src:[{t:"Azure Resource Manager",u:"https://learn.microsoft.com/azure/azure-resource-manager/management/overview"}]
},
{
  id:"az-d2-03", exam:"az900", dom:"d2", lvl:5, type:"single", sec:95, tags:["compute","app-service","aks","functions"],
  case:"Uma equipe de 3 pessoas precisa publicar uma API REST em .NET. Requisitos: não querem administrar sistema operacional, precisam de slots de implantação para testar antes de ir ao ar, precisam de domínio próprio com certificado e a API fica ativa o dia inteiro com tráfego constante. Não há outro microsserviço no roadmap.",
  stem:"Qual serviço de computação atende com menor esforço operacional?",
  opts:[
    {k:"A",t:"Azure App Service"},
    {k:"B",t:"Azure Kubernetes Service (AKS)"},
    {k:"C",t:"Azure Functions no plano de consumo"},
    {k:"D",t:"Máquina virtual com conjunto de dimensionamento"}
  ],
  ans:["A"],
  why:{
    ok:"App Service é PaaS para aplicações web e APIs: sem administrar SO, com slots de implantação, domínio próprio e certificado gerenciado nativos. Para uma API única com tráfego constante é a escolha de menor esforço.",
    B:"AKS resolveria, mas traz orquestração, nós, upgrades de cluster e rede de container para uma equipe de 3 pessoas com um único serviço. É esforço operacional maior sem necessidade.",
    C:"Functions brilha em carga intermitente e orientada a evento. Com tráfego constante o dia inteiro, o plano de consumo perde a vantagem econômica, e slots de implantação e certificado seguem o modelo do App Service de todo jeito.",
    D:"VM obriga a equipe a cuidar de SO, patch e imagem, exatamente o que o enunciado quer evitar."
  },
  src:[{t:"Azure App Service",u:"https://learn.microsoft.com/azure/app-service/overview"}]
},
{
  id:"az-d2-04", exam:"az900", dom:"d2", lvl:4, type:"single", sec:80, tags:["blob","camadas","archive"],
  case:"Laudos médicos precisam ser guardados por 10 anos por exigência legal. A consulta é raríssima, mas quando o paciente solicita, o laudo deve estar disponível em segundos, no mesmo atendimento.",
  stem:"Qual camada de acesso do Blob Storage atende ao requisito com o menor custo de armazenamento?",
  opts:[
    {k:"A",t:"Cold"},
    {k:"B",t:"Archive"},
    {k:"C",t:"Hot"},
    {k:"D",t:"Archive com reidratação de prioridade alta"}
  ],
  ans:["A"],
  why:{
    ok:"Cold é a camada online mais barata para dados de acesso muito raro: o custo de armazenamento é baixo e o objeto continua acessível imediatamente. O mínimo de permanência de 90 dias não é problema em uma retenção de 10 anos.",
    B:"Archive é mais barato, mas é offline: exige reidratação, que leva horas. O enunciado exige disponibilidade em segundos, o que elimina Archive.",
    C:"Hot atenderia ao desempenho, mas é a camada mais caro para guardar, e o enunciado pede o menor custo de armazenamento.",
    D:"Reidratação de prioridade alta reduz o tempo, mas continua na casa de minutos a uma hora para objetos pequenos, não segundos, e ainda cobra taxa extra. Não é acesso imediato."
  },
  src:[{t:"Camadas de acesso do Blob",u:"https://learn.microsoft.com/azure/storage/blobs/access-tiers-overview"}]
},
{
  id:"az-d2-05", exam:"az900", dom:"d2", lvl:5, type:"single", sec:90, tags:["rede","expressroute","vpn","peering"],
  case:"Um banco vai integrar o datacenter próprio ao Azure. Requisitos: a latência precisa ser previsível, o tráfego não pode transitar pela internet pública em nenhum momento e a banda contratada deve ser dedicada. O custo mensal maior já foi aprovado.",
  stem:"Qual opção de conectividade atende?",
  opts:[
    {k:"A",t:"Azure ExpressRoute"},
    {k:"B",t:"VPN site a site com IPsec"},
    {k:"C",t:"Emparelhamento de rede virtual (VNet peering)"},
    {k:"D",t:"Azure Bastion"}
  ],
  ans:["A"],
  why:{
    ok:"ExpressRoute é um circuito privado através de um parceiro de conectividade: não passa pela internet pública, oferece banda dedicada e latência mais previsível. É exatamente o conjunto de requisitos descrito.",
    B:"VPN site a site cria um túnel criptografado, mas por cima da internet pública. O tráfego é protegido, não privado no caminho, e a latência depende da internet. O enunciado veta isso explicitamente.",
    C:"VNet peering conecta redes virtuais dentro do Azure. Não conecta um datacenter local à nuvem.",
    D:"Bastion é acesso administrativo seguro a VMs pelo portal, via RDP e SSH. Não é tecnologia de interconexão de datacenter."
  },
  src:[{t:"ExpressRoute",u:"https://learn.microsoft.com/azure/expressroute/expressroute-introduction"}]
},
{
  id:"az-d2-06", exam:"az900", dom:"d2", lvl:4, type:"multi", sec:95, tags:["entra-id","identidade"],
  stem:"Uma empresa quer substituir senhas por autenticação moderna em aplicações SaaS e aplicar políticas de acesso baseadas em risco. Quais recursos do Microsoft Entra ID atendem a esse objetivo? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Autenticação multifator (MFA)"},
    {k:"B",t:"Acesso condicional"},
    {k:"C",t:"Group Policy (GPO)"},
    {k:"D",t:"Bloqueio de recurso (resource lock)"},
    {k:"E",t:"Conjunto de dimensionamento de máquinas virtuais"}
  ],
  ans:["A","B"],
  why:{
    ok:"MFA adiciona um segundo fator e é a base para reduzir dependência de senha. Acesso condicional avalia sinais como usuário, dispositivo, local e risco, e decide se concede, bloqueia ou exige MFA. Juntos entregam o que o enunciado pede.",
    C:"GPO pertence ao Active Directory Domain Services, não ao Entra ID. Entra ID não aplica GPO; para dispositivos há políticas do Intune.",
    D:"Bloqueio de recurso impede exclusão e alteração de recursos do Azure. Não tem relação com autenticação de usuário.",
    E:"Conjunto de dimensionamento é computação elástica. Nenhuma relação com identidade."
  },
  src:[{t:"Acesso condicional",u:"https://learn.microsoft.com/entra/identity/conditional-access/overview"}]
},
{
  id:"az-d2-07", exam:"az900", dom:"d2", lvl:3, type:"single", sec:70, tags:["storage","files","blob","disk"],
  case:"Uma aplicação legada precisa de um compartilhamento de arquivos acessível por caminho UNC via protocolo SMB, montado simultaneamente por três servidores Windows.",
  stem:"Qual serviço de armazenamento do Azure atende sem alterar a aplicação?",
  opts:[
    {k:"A",t:"Azure Files"},
    {k:"B",t:"Azure Blob Storage"},
    {k:"C",t:"Azure Managed Disks"},
    {k:"D",t:"Azure Table Storage"}
  ],
  ans:["A"],
  why:{
    ok:"Azure Files oferece compartilhamento de arquivos gerenciado com SMB, montável por caminho UNC em vários servidores ao mesmo tempo. É o substituto direto de um file server.",
    B:"Blob é armazenamento de objetos acessado por API REST. Não fala SMB nativamente, e usar um driver de montagem mudaria o comportamento da aplicação legada.",
    C:"Disco gerenciado se anexa a uma única VM por vez na maioria dos cenários e não é um compartilhamento de rede.",
    D:"Table Storage é um armazenamento NoSQL de chave e atributo. Não é sistema de arquivos."
  },
  src:[{t:"Azure Files",u:"https://learn.microsoft.com/azure/storage/files/storage-files-introduction"}]
},
{
  id:"az-d2-08", exam:"az900", dom:"d2", lvl:4, type:"single", sec:75, tags:["migracao-dados","data-box"],
  case:"Uma produtora precisa enviar 400 TB de vídeo bruto para o Azure. O link de internet do estúdio é de 200 Mbps e já está saturado durante o dia pela operação.",
  stem:"Qual abordagem é mais adequada?",
  opts:[
    {k:"A",t:"Azure Data Box, transferindo os dados em dispositivo físico enviado ao datacenter"},
    {k:"B",t:"AzCopy com várias sessões paralelas durante a madrugada"},
    {k:"C",t:"Azure Storage Explorer com upload em lotes"},
    {k:"D",t:"Azure File Sync entre o servidor local e o Azure Files"}
  ],
  ans:["A"],
  why:{
    ok:"Com 200 Mbps compartilhados, 400 TB levariam meses de transferência contínua. O Data Box existe exatamente para esse caso: a Microsoft envia um dispositivo, você copia localmente e devolve pelo correio.",
    B:"AzCopy é ótimo para transferência por rede, mas não cria banda. O gargalo é físico, não de ferramenta.",
    C:"Storage Explorer é uma interface gráfica sobre a mesma rede. O problema de banda continua.",
    D:"File Sync serve para sincronizar e usar cache de um compartilhamento, não para a carga inicial de centenas de terabytes num link saturado."
  },
  src:[{t:"Azure Data Box",u:"https://learn.microsoft.com/azure/databox/data-box-overview"}]
},
{
  id:"az-d2-09", exam:"az900", dom:"d2", lvl:5, type:"order", sec:90, tags:["hierarquia","escopo"],
  stem:"Ordene os escopos do Azure do MAIS AMPLO para o MAIS ESPECÍFICO.",
  items:[
    {t:"Grupo de gerenciamento"},
    {t:"Assinatura"},
    {t:"Grupo de recursos"},
    {t:"Recurso"}
  ],
  e:"A hierarquia do Azure vai de grupo de gerenciamento, que agrupa assinaturas, passando pela assinatura, depois o grupo de recursos e por fim o recurso individual. Quem define política ou permissão no topo faz com que ela seja herdada para baixo. Essa ordem é cobrada tanto em governança quanto em RBAC.",
  src:[{t:"Grupos de gerenciamento",u:"https://learn.microsoft.com/azure/governance/management-groups/overview"}]
},

/* ---------------- AZ-900 · D3 governança ---------------- */
{
  id:"az-d3-01", exam:"az900", dom:"d3", lvl:5, type:"single", sec:90, tags:["policy","rbac","lock"],
  case:"Um gestor pede três coisas: 1) ninguém deve conseguir criar recursos fora da região Brazil South; 2) a equipe de suporte deve apenas visualizar recursos, sem alterar; 3) o banco de dados de produção não pode ser excluído nem pelo administrador da assinatura.",
  stem:"Quais mecanismos atendem, respectivamente, aos itens 1, 2 e 3?",
  opts:[
    {k:"A",t:"Azure Policy, RBAC e bloqueio de recurso"},
    {k:"B",t:"RBAC, Azure Policy e bloqueio de recurso"},
    {k:"C",t:"Azure Policy, bloqueio de recurso e RBAC"},
    {k:"D",t:"Bloqueio de recurso, RBAC e Azure Policy"}
  ],
  ans:["A"],
  why:{
    ok:"Azure Policy define O QUE pode existir, inclusive restringir regiões permitidas. RBAC define QUEM pode fazer o que, e a função Leitor dá apenas visualização. Bloqueio de recurso do tipo CanNotDelete impede exclusão mesmo de quem tem permissão total, inclusive Proprietário.",
    B:"Inverte os dois primeiros. RBAC não tem como restringir região: ele concede ações a identidades, não avalia propriedades do recurso.",
    C:"Bloqueio não concede nem limita visualização. Para dar somente leitura a uma equipe, o instrumento é RBAC.",
    D:"Bloqueio não restringe região e Policy não impede exclusão por quem tem permissão: Policy pode negar criação, mas o controle contra exclusão acidental é o lock."
  },
  src:[{t:"Azure Policy",u:"https://learn.microsoft.com/azure/governance/policy/overview"},
       {t:"Bloquear recursos",u:"https://learn.microsoft.com/azure/azure-resource-manager/management/lock-resources"}]
},
{
  id:"az-d3-02", exam:"az900", dom:"d3", lvl:4, type:"yn", sec:90, tags:["tags","governanca-custo"],
  stem:"A empresa quer ratear custos por centro de custo usando tags. Responda Sim ou Não.",
  rows:[
    {t:"Recursos herdam automaticamente as tags do grupo de recursos onde foram criados.", a:false,
     e:"Não herdam. Essa é a pegadinha clássica: a herança precisa ser forçada por Azure Policy com efeito modify ou append."},
    {t:"O Azure Policy pode ser usado para exigir uma tag obrigatória na criação do recurso.", a:true,
     e:"Sim. Policy pode negar a criação sem a tag ou adicionar a tag automaticamente."},
    {t:"O Microsoft Cost Management consegue agrupar e filtrar os custos por tag.", a:true,
     e:"Sim, e esse é o motivo prático de manter a marcação disciplinada."},
    {t:"Tags são herdadas da assinatura para todos os recursos dentro dela.", a:false,
     e:"Também não. Nenhum nível de escopo propaga tag sozinho."}
  ],
  src:[{t:"Marcar recursos",u:"https://learn.microsoft.com/azure/azure-resource-manager/management/tag-resources"}]
},
{
  id:"az-d3-03", exam:"az900", dom:"d3", lvl:4, type:"single", sec:75, tags:["calculadoras","tco"],
  case:"A diretoria quer um documento que compare o custo total de manter 60 servidores no datacenter próprio com o custo de rodar a mesma carga no Azure, incluindo energia, licenciamento e equipe.",
  stem:"Qual ferramenta foi feita para esse objetivo?",
  opts:[
    {k:"A",t:"Calculadora de Custo Total de Propriedade (TCO)"},
    {k:"B",t:"Calculadora de Preços do Azure"},
    {k:"C",t:"Microsoft Cost Management"},
    {k:"D",t:"Azure Advisor"}
  ],
  ans:["A"],
  why:{
    ok:"A calculadora de TCO existe para comparar o ambiente local com o Azure, considerando custos que a fatura da nuvem não mostra, como energia, espaço físico e pessoal.",
    B:"A Calculadora de Preços estima quanto custarão recursos do Azure. Ela não modela o custo do seu datacenter atual, então não faz comparação.",
    C:"Cost Management analisa gasto que JÁ aconteceu na sua conta e cria orçamentos. Não serve para projetar uma migração que ainda não existe.",
    D:"Advisor recomenda melhorias em recursos existentes no Azure, inclusive economia. Não compara com on-premises."
  },
  src:[{t:"Calculadora de TCO",u:"https://azure.microsoft.com/pricing/tco/calculator/"}]
},
{
  id:"az-d3-04", exam:"az900", dom:"d3", lvl:5, type:"single", sec:85, tags:["monitor","service-health","advisor","defender"],
  case:"Um analista precisa descobrir se a lentidão relatada pelos usuários foi causada por um incidente da plataforma Azure que afeta especificamente as assinaturas da empresa na região usada.",
  stem:"Qual serviço deve ser consultado primeiro?",
  opts:[
    {k:"A",t:"Azure Service Health"},
    {k:"B",t:"Azure Monitor"},
    {k:"C",t:"Azure Advisor"},
    {k:"D",t:"Microsoft Defender for Cloud"}
  ],
  ans:["A"],
  why:{
    ok:"Service Health mostra incidentes, manutenções planejadas e avisos de saúde filtrados pelos recursos e regiões das SUAS assinaturas. É a ferramenta para saber se o problema é da plataforma.",
    B:"Azure Monitor coleta métricas e logs dos seus recursos. Ele mostra que a latência subiu, mas não informa se existe incidente declarado pela Microsoft.",
    C:"Advisor dá recomendações de custo, segurança, confiabilidade, excelência operacional e desempenho. Não reporta incidente em andamento.",
    D:"Defender for Cloud trata de postura e proteção contra ameaças. Não é canal de comunicação de incidente da plataforma."
  },
  src:[{t:"Azure Service Health",u:"https://learn.microsoft.com/azure/service-health/overview"}]
},
{
  id:"az-d3-05", exam:"az900", dom:"d3", lvl:4, type:"single", sec:80, tags:["reservas","hibrido","spot"],
  case:"Uma empresa tem 30 VMs Windows que rodam 24 horas por dia e devem continuar pelos próximos três anos, com tamanho e região estáveis. A empresa já possui licenças de Windows Server com Software Assurance.",
  stem:"Qual combinação reduz mais o custo?",
  opts:[
    {k:"A",t:"Reservas de instância de VM por 3 anos somadas ao Benefício Híbrido do Azure"},
    {k:"B",t:"Máquinas virtuais spot somadas ao Benefício Híbrido do Azure"},
    {k:"C",t:"Reservas de instância por 1 ano, sem usar as licenças existentes"},
    {k:"D",t:"Dimensionamento automático com precificação sob demanda"}
  ],
  ans:["A"],
  why:{
    ok:"Carga estável e previsível por três anos é o caso ideal de reserva, que dá o maior desconto no compute. O Benefício Híbrido aproveita as licenças que a empresa já pagou, removendo o custo da licença Windows da fatura. Os dois descontos se somam.",
    B:"Spot não tem garantia de continuidade: a instância pode ser removida com pouco aviso. Para carga que precisa rodar 24 horas, é resposta errada, mesmo sendo a mais barata por hora.",
    C:"Reserva de 1 ano desconta menos que a de 3 anos, e descartar as licenças existentes joga dinheiro fora.",
    D:"Sob demanda é a opção mais caro por hora para carga constante, e dimensionar automaticamente não ajuda quando a utilização é estável."
  },
  src:[{t:"Reservas do Azure",u:"https://learn.microsoft.com/azure/cost-management-billing/reservations/save-compute-costs-reservations"},
       {t:"Benefício Híbrido",u:"https://learn.microsoft.com/azure/virtual-machines/windows/hybrid-use-benefit-licensing"}]
},
{
  id:"az-d3-06", exam:"az900", dom:"d3", lvl:4, type:"single", sec:75, tags:["lock","readonly"],
  case:"Um engenheiro aplicou um bloqueio do tipo ReadOnly em um grupo de recursos que contém uma conta de armazenamento e uma VM. Agora a equipe reclama que não consegue mais iniciar a VM que estava desligada.",
  stem:"Por que isso acontece?",
  opts:[
    {k:"A",t:"Porque ReadOnly bloqueia qualquer operação de alteração, e iniciar uma VM altera o estado do recurso"},
    {k:"B",t:"Porque ReadOnly remove as permissões de RBAC dos usuários no grupo de recursos"},
    {k:"C",t:"Porque ReadOnly se aplica somente a contas de armazenamento e corrompeu a configuração da VM"},
    {k:"D",t:"Porque bloqueios não afetam VMs, o problema deve ser de cota da assinatura"}
  ],
  ans:["A"],
  why:{
    ok:"ReadOnly é mais restritivo do que parece: ele impede toda operação de escrita, não apenas exclusão. Iniciar, parar ou redimensionar uma VM são operações de escrita, logo ficam bloqueadas. Esse efeito colateral é justamente o que a prova gosta de cobrar.",
    B:"Bloqueio não mexe em RBAC. As permissões continuam atribuídas; o que muda é que o plano de gerenciamento recusa a operação.",
    C:"Bloqueio se aplica ao escopo onde foi criado e é herdado por tudo que está dentro, incluindo a VM. E não corrompe configuração.",
    D:"Bloqueios afetam sim as VMs. Atribuir o sintoma à cota ignora a causa real."
  },
  src:[{t:"Bloquear recursos",u:"https://learn.microsoft.com/azure/azure-resource-manager/management/lock-resources"}]
},

/* ---------------- CLF-C02 · D1 conceitos ---------------- */
{
  id:"aw-d1-01", exam:"clf", dom:"d1", lvl:4, type:"single", sec:80, tags:["migracao-caf","well-architected"],
  case:"Uma empresa roda um ERP em servidores físicos com um banco MySQL autogerenciado. A meta é sair do datacenter em 4 meses, sem reescrever a aplicação, mas tirando da equipe o trabalho de administrar o banco de dados.",
  stem:"Qual estratégia de migração descreve melhor esse movimento?",
  opts:[
    {k:"A",t:"Replatform (lift and tinker): mover a aplicação para EC2 e o banco para o Amazon RDS"},
    {k:"B",t:"Rehost (lift and shift): mover aplicação e banco para EC2 sem alterações"},
    {k:"C",t:"Refactor: reescrever o ERP como microsserviços serverless"},
    {k:"D",t:"Repurchase: substituir o ERP por uma solução SaaS"}
  ],
  ans:["A"],
  why:{
    ok:"Replatform é mover sem reescrever, mas trocando um componente por um serviço gerenciado. Mover o MySQL para o RDS tira a administração do banco da equipe e mantém a aplicação intacta: exatamente o enunciado.",
    B:"Rehost puro deixaria o MySQL rodando em EC2, e a equipe continuaria administrando backup, patch e failover. Não atende ao segundo requisito.",
    C:"Refactor significa reescrever, o que o enunciado proíbe, e não cabe em 4 meses para um ERP.",
    D:"Repurchase troca o produto por um SaaS. O enunciado não fala em abandonar o ERP atual."
  },
  src:[{t:"AWS: as 6 estratégias de migração",u:"https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html"}]
},
{
  id:"aw-d1-02", exam:"clf", dom:"d1", lvl:3, type:"single", sec:70, tags:["infra-global"],
  case:"Usuários na América do Sul reclamam de lentidão ao baixar imagens e vídeos hospedados em um bucket S3 na região us-east-1. O conteúdo é estático e idêntico para todos.",
  stem:"Qual componente da infraestrutura global da AWS resolve o problema?",
  opts:[
    {k:"A",t:"Pontos de presença (edge locations) usados pelo Amazon CloudFront"},
    {k:"B",t:"Uma zona de disponibilidade adicional em us-east-1"},
    {k:"C",t:"AWS Local Zones"},
    {k:"D",t:"Um grupo de Auto Scaling com mais instâncias"}
  ],
  ans:["A"],
  why:{
    ok:"CloudFront usa pontos de presença espalhados pelo mundo para guardar cópia do conteúdo estático perto do usuário. Isso corta a distância e resolve latência de download.",
    B:"Zona adicional melhora disponibilidade dentro da mesma região. Não aproxima o conteúdo do usuário na América do Sul.",
    C:"Local Zones aproximam recursos de computação e armazenamento de grandes centros urbanos específicos, para cargas de latência muito baixa. Para distribuir conteúdo estático global, a ferramenta é a CDN.",
    D:"Auto Scaling resolve falta de capacidade de processamento. O problema aqui é distância de rede, não capacidade."
  },
  src:[{t:"Infraestrutura global da AWS",u:"https://aws.amazon.com/about-aws/global-infrastructure/"}]
},
{
  id:"aw-d1-03", exam:"clf", dom:"d1", lvl:4, type:"multi", sec:90, tags:["well-architected"],
  stem:"Uma arquitetura foi reprovada na revisão porque não havia nenhuma métrica de negócio sendo monitorada, nenhum runbook de resposta a incidente e o custo não era acompanhado por equipe. Quais pilares do AWS Well-Architected Framework foram diretamente violados? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Excelência operacional"},
    {k:"B",t:"Otimização de custos"},
    {k:"C",t:"Segurança"},
    {k:"D",t:"Eficiência de desempenho"},
    {k:"E",t:"Sustentabilidade"}
  ],
  ans:["A","B"],
  why:{
    ok:"Falta de monitoramento e de runbook é falha de excelência operacional, o pilar que trata de operar, observar e melhorar continuamente. Custo não acompanhado por equipe é falha de otimização de custos, que inclui atribuir e medir despesa.",
    C:"Segurança cobre identidade, proteção de dados e detecção. O enunciado não descreve falha de controle de acesso ou criptografia.",
    D:"Eficiência de desempenho trata de escolher e dimensionar recursos corretamente. Não é o que o enunciado aponta.",
    E:"Sustentabilidade trata de reduzir impacto ambiental da carga. Nada no enunciado aborda isso."
  },
  src:[{t:"AWS Well-Architected",u:"https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html"}]
},

/* ---------------- CLF-C02 · D2 segurança ---------------- */
{
  id:"aw-d2-01", exam:"clf", dom:"d2", lvl:4, type:"yn", sec:95, tags:["shared-responsibility"],
  stem:"Responda Sim ou Não sobre o modelo de responsabilidade compartilhada da AWS.",
  rows:[
    {t:"Em uma instância EC2, instalar as correções de segurança do sistema operacional convidado é responsabilidade do cliente.", a:true,
     e:"EC2 é IaaS: o SO convidado é do cliente. A AWS responde pelo hipervisor e pela infraestrutura física."},
    {t:"No Amazon RDS, aplicar patch do sistema operacional e do motor do banco é responsabilidade da AWS.", a:true,
     e:"RDS é gerenciado: SO e engine ficam com a AWS. O cliente cuida de usuários, permissões, grupos de segurança e dos dados."},
    {t:"Configurar corretamente as permissões de um bucket S3 é responsabilidade da AWS.", a:false,
     e:"Configuração de acesso é sempre do cliente. Bucket exposto por configuração errada é responsabilidade de quem configurou."},
    {t:"O descarte seguro de discos físicos no datacenter é responsabilidade da AWS.", a:true,
     e:"Tudo que é físico no datacenter pertence à AWS, inclusive descarte de mídia."},
    {t:"Criptografar dados sensíveis em repouso é decisão e responsabilidade do cliente.", a:true,
     e:"A AWS fornece as ferramentas (KMS, criptografia nos serviços), mas decidir e habilitar é do cliente."}
  ],
  src:[{t:"Modelo de responsabilidade compartilhada",u:"https://aws.amazon.com/compliance/shared-responsibility-model/"}]
},
{
  id:"aw-d2-02", exam:"clf", dom:"d2", lvl:5, type:"single", sec:95, tags:["seguranca-servicos","conformidade-governanca"],
  case:"A equipe de segurança precisa de quatro coisas: 1) saber quem chamou qual API e quando; 2) descobrir se algum bucket contém dados pessoais sem proteção; 3) receber alerta quando uma instância começar a se comunicar com um endereço associado à mineração de criptomoeda; 4) baixar o relatório SOC 2 para enviar ao auditor.",
  stem:"Quais serviços atendem, respectivamente, aos itens 1, 2, 3 e 4?",
  opts:[
    {k:"A",t:"CloudTrail, Macie, GuardDuty e Artifact"},
    {k:"B",t:"CloudWatch, Inspector, GuardDuty e Config"},
    {k:"C",t:"CloudTrail, Inspector, Detective e Artifact"},
    {k:"D",t:"Config, Macie, Security Hub e Trusted Advisor"}
  ],
  ans:["A"],
  why:{
    ok:"CloudTrail registra chamadas de API, respondendo quem fez o que e quando. Macie descobre e classifica dado sensível no S3. GuardDuty detecta ameaça analisando logs e sinais, inclusive comunicação com destino malicioso conhecido. Artifact é o portal de relatórios de conformidade, como SOC e PCI.",
    B:"CloudWatch coleta métrica e log, mas o registro de auditoria de API é o CloudTrail. Inspector procura vulnerabilidade de software, não dado pessoal. Config avalia configuração, não distribui relatório de auditoria.",
    C:"Inspector não classifica dado sensível. Detective ajuda a investigar depois do alerta, não a gerar a detecção.",
    D:"Config não é log de API. Security Hub agrega achados de vários serviços, mas quem detecta a comunicação suspeita é o GuardDuty. Trusted Advisor dá recomendações, não relatório de conformidade."
  },
  src:[{t:"CloudTrail",u:"https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html"},
       {t:"Amazon Macie",u:"https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html"},
       {t:"Amazon GuardDuty",u:"https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html"},
       {t:"AWS Artifact",u:"https://aws.amazon.com/artifact/"}]
},
{
  id:"aw-d2-03", exam:"clf", dom:"d2", lvl:4, type:"single", sec:80, tags:["sg-vs-nacl"],
  case:"Durante um ataque, a equipe identificou um único endereço IP que gera milhares de requisições. É preciso bloquear somente aquele IP no nível da sub-rede, mantendo o acesso liberado para todos os outros.",
  stem:"Qual recurso permite fazer isso?",
  opts:[
    {k:"A",t:"Network ACL, criando uma regra de negação para o IP"},
    {k:"B",t:"Security Group, criando uma regra de negação para o IP"},
    {k:"C",t:"IAM policy com condição de endereço de origem"},
    {k:"D",t:"Tabela de rotas, removendo a rota para aquele IP"}
  ],
  ans:["A"],
  why:{
    ok:"A NACL atua na sub-rede e aceita regras de allow e de deny, avaliadas por número. É o único dos controles de rede da VPC capaz de negar um IP específico.",
    B:"Security Group não possui regra de negação: tudo que não está permitido já está implicitamente negado, e não existe forma de excluir um IP de uma permissão mais ampla.",
    C:"IAM controla chamadas à API da AWS por identidades, não tráfego de rede chegando na aplicação.",
    D:"Mexer em rota afeta o caminho de saída e tende a quebrar conectividade legítima. Não é mecanismo de filtragem por origem."
  },
  src:[{t:"Network ACLs",u:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html"},
       {t:"Security groups",u:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html"}]
},
{
  id:"aw-d2-04", exam:"clf", dom:"d2", lvl:3, type:"multi", sec:85, tags:["iam-role-ec2"],
  stem:"Quais são práticas recomendadas pela AWS para proteger a conta e as identidades? Escolha as TRÊS corretas.",
  opts:[
    {k:"A",t:"Habilitar MFA no usuário raiz e guardar as credenciais dele fora do uso diário"},
    {k:"B",t:"Conceder apenas as permissões necessárias, seguindo o privilégio mínimo"},
    {k:"C",t:"Usar funções do IAM para que aplicações obtenham credenciais temporárias"},
    {k:"D",t:"Compartilhar um único usuário do IAM entre a equipe para simplificar a auditoria"},
    {k:"E",t:"Gravar chaves de acesso de longo prazo no código da aplicação"}
  ],
  ans:["A","B","C"],
  why:{
    ok:"As três práticas são as recomendações centrais: proteger o raiz com MFA e não usá-lo no dia a dia, aplicar privilégio mínimo e preferir funções com credencial temporária em vez de chave estática.",
    D:"Usuário compartilhado destrói a auditoria, porque nenhuma ação pode ser atribuída a uma pessoa. É o oposto do recomendado.",
    E:"Chave de longo prazo no código é o erro clássico: não expira, vaza em repositório e é difícil de rotacionar."
  },
  src:[{t:"Boas práticas de IAM",u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"}]
},
{
  id:"aw-d2-05", exam:"clf", dom:"d2", lvl:5, type:"single", sec:85, tags:["iam-role-ec2","seguranca-servicos"],
  case:"Um sistema precisa guardar a senha de um banco de dados de terceiro. Requisitos: a senha deve ser trocada automaticamente a cada 30 dias, sem alterar código, e a aplicação deve buscá-la por chamada de API no momento do uso.",
  stem:"Qual serviço atende diretamente?",
  opts:[
    {k:"A",t:"AWS Secrets Manager"},
    {k:"B",t:"AWS KMS"},
    {k:"C",t:"AWS CloudHSM"},
    {k:"D",t:"Parameter Store no nível padrão, sem integração adicional"}
  ],
  ans:["A"],
  why:{
    ok:"Secrets Manager foi feito para segredo de aplicação com rotação automática integrada e recuperação via API. O requisito de troca a cada 30 dias sem mexer no código é exatamente o diferencial dele.",
    B:"KMS gerencia chaves de criptografia, não segredos como senha. Ele é usado por baixo para proteger o segredo, mas não faz rotação de credencial de banco.",
    C:"CloudHSM entrega módulo de hardware dedicado para quem precisa de controle exclusivo de chave criptográfica. É mais caro, mais complexo e não é um cofre de segredo com rotação.",
    D:"O Parameter Store padrão armazena parâmetros, inclusive seguros, mas não oferece rotação automática pronta: seria preciso construir a rotação. O enunciado pede algo direto."
  },
  src:[{t:"AWS Secrets Manager",u:"https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html"}]
},
{
  id:"aw-d2-06", exam:"clf", dom:"d2", lvl:4, type:"single", sec:80, tags:["sg-vs-nacl","seguranca-servicos"],
  case:"Uma API pública sofre duas ameaças: ataques volumétricos de camada de rede e tentativas de injeção de SQL nas requisições HTTP. A empresa quer proteção gerenciada para os dois casos, com acesso a um time de resposta da AWS durante incidentes.",
  stem:"Qual combinação atende?",
  opts:[
    {k:"A",t:"AWS Shield Advanced junto com AWS WAF"},
    {k:"B",t:"AWS Shield Standard junto com Amazon GuardDuty"},
    {k:"C",t:"AWS WAF junto com Amazon Inspector"},
    {k:"D",t:"Security Groups junto com Network ACLs"}
  ],
  ans:["A"],
  why:{
    ok:"Shield Advanced amplia a proteção DDoS, inclui proteção financeira contra escalada de custo e dá acesso ao time de resposta da AWS. O WAF inspeciona requisições HTTP e bloqueia padrões como injeção de SQL. Juntos cobrem rede e aplicação.",
    B:"Shield Standard é automático e gratuito, mas não dá acesso a time de resposta nem protege camada 7. GuardDuty detecta ameaça, não bloqueia requisição maliciosa.",
    C:"WAF cobre a injeção de SQL, mas Inspector avalia vulnerabilidade em software e não defende contra DDoS volumétrico.",
    D:"SG e NACL filtram por IP, porta e protocolo. Nenhum dos dois entende conteúdo HTTP nem absorve ataque volumétrico."
  },
  src:[{t:"AWS Shield",u:"https://docs.aws.amazon.com/waf/latest/developerguide/ddos-advanced-summary.html"},
       {t:"AWS WAF",u:"https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html"}]
},

/* ---------------- CLF-C02 · D3 tecnologia e serviços ---------------- */
{
  id:"aw-d3-01", exam:"clf", dom:"d3", lvl:5, type:"single", sec:90, tags:["s3-classes"],
  case:"Uma aplicação em um grupo de Auto Scaling precisa que as três instâncias leiam e gravem no MESMO sistema de arquivos ao mesmo tempo, com os dados sobrevivendo ao encerramento de qualquer instância. O sistema operacional é Linux.",
  stem:"Qual opção de armazenamento atende?",
  opts:[
    {k:"A",t:"Amazon EFS"},
    {k:"B",t:"Um volume Amazon EBS compartilhado entre as instâncias"},
    {k:"C",t:"Instance store das próprias instâncias"},
    {k:"D",t:"Amazon S3 montado como disco local"}
  ],
  ans:["A"],
  why:{
    ok:"EFS é um sistema de arquivos NFS gerenciado, elástico, acessível simultaneamente por muitas instâncias Linux em várias zonas, e independe do ciclo de vida das instâncias. É o caso de uso descrito.",
    B:"EBS é, no modelo comum, anexado a uma instância por vez e preso a uma única zona. Não serve como sistema de arquivos compartilhado de uso geral por um grupo de Auto Scaling.",
    C:"Instance store é efêmero: os dados se perdem quando a instância para ou é encerrada. O enunciado exige sobrevivência ao encerramento.",
    D:"S3 é armazenamento de objetos acessado por API. Tratar o S3 como disco local traz semântica diferente de sistema de arquivos e não é a resposta esperada para leitura e gravação compartilhada POSIX."
  },
  src:[{t:"Amazon EFS",u:"https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html"},
       {t:"Instance store",u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html"}]
},
{
  id:"aw-d3-02", exam:"clf", dom:"d3", lvl:5, type:"single", sec:95, tags:["bancos-aws"],
  case:"Três necessidades no mesmo projeto: 1) catálogo de produtos com leitura por chave em milissegundos e tráfego altamente variável; 2) relatórios analíticos que varrem bilhões de linhas históricas; 3) banco relacional compatível com PostgreSQL, com alta disponibilidade e réplicas de leitura.",
  stem:"Quais serviços atendem, respectivamente, aos itens 1, 2 e 3?",
  opts:[
    {k:"A",t:"DynamoDB, Redshift e Aurora"},
    {k:"B",t:"RDS, Athena e DynamoDB"},
    {k:"C",t:"ElastiCache, Redshift e RDS for MySQL"},
    {k:"D",t:"DynamoDB, Aurora e Redshift"}
  ],
  ans:["A"],
  why:{
    ok:"DynamoDB é NoSQL de chave e valor com latência de milissegundos e escala elástica, ideal para catálogo. Redshift é data warehouse colunar para consulta analítica sobre volume histórico. Aurora é o relacional gerenciado compatível com PostgreSQL, com réplicas e alta disponibilidade.",
    B:"RDS atenderia o item 3, não o 1. Athena consulta dados no S3 sob demanda, uma proposta diferente de data warehouse dedicado. E DynamoDB não é relacional compatível com PostgreSQL.",
    C:"ElastiCache é cache em memória, não banco primário do catálogo. E RDS for MySQL não atende ao requisito explícito de compatibilidade com PostgreSQL.",
    D:"Inverte os papéis: Aurora é transacional (OLTP) e Redshift é analítico (OLAP). Varrer bilhões de linhas históricas pede Redshift, não Aurora."
  },
  src:[{t:"Amazon DynamoDB",u:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html"},
       {t:"Amazon Redshift",u:"https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html"}]
},
{
  id:"aw-d3-03", exam:"clf", dom:"d3", lvl:4, type:"single", sec:80, tags:["compute-aws"],
  case:"Um sistema expõe dois caminhos no mesmo domínio: /api deve ir para um grupo de containers e /imagens para outro. Além disso, é necessário inspecionar cabeçalhos HTTP para rotear.",
  stem:"Qual balanceador deve ser usado?",
  opts:[
    {k:"A",t:"Application Load Balancer"},
    {k:"B",t:"Network Load Balancer"},
    {k:"C",t:"Gateway Load Balancer"},
    {k:"D",t:"Classic Load Balancer"}
  ],
  ans:["A"],
  why:{
    ok:"O ALB opera na camada 7 e faz roteamento baseado em caminho, host e cabeçalhos HTTP. Rotear /api e /imagens para grupos diferentes é exatamente o que ele faz.",
    B:"O NLB opera na camada 4, com TCP e UDP. Ele não enxerga caminho nem cabeçalho HTTP, então não consegue rotear por URL.",
    C:"O GWLB serve para inserir appliances de inspeção de tráfego no caminho da rede. Não é um balanceador de aplicação web.",
    D:"O Classic é a geração legada, com recursos limitados de roteamento, e a AWS recomenda os balanceadores novos para casos como este."
  },
  src:[{t:"Elastic Load Balancing",u:"https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html"}]
},
{
  id:"aw-d3-04", exam:"clf", dom:"d3", lvl:4, type:"single", sec:85, tags:["rede-aws"],
  case:"Instâncias em uma sub-rede privada precisam baixar atualizações de segurança da internet. Nenhuma conexão iniciada de fora pode alcançar essas instâncias.",
  stem:"Qual configuração atende?",
  opts:[
    {k:"A",t:"Um NAT Gateway em uma sub-rede pública, com rota de saída da sub-rede privada apontando para ele"},
    {k:"B",t:"Um Internet Gateway anexado diretamente à sub-rede privada"},
    {k:"C",t:"Um IP elástico em cada instância privada"},
    {k:"D",t:"Um VPC Endpoint do tipo gateway para a internet"}
  ],
  ans:["A"],
  why:{
    ok:"O NAT Gateway fica na sub-rede pública e permite tráfego de saída originado na sub-rede privada, sem permitir conexões iniciadas de fora. E o padrão para atualizar instâncias privadas.",
    B:"Internet Gateway é anexado à VPC, não a uma sub-rede, e é justamente o que torna uma sub-rede pública. Usar rota direta para ele exporia as instâncias a conexões de entrada.",
    C:"Atribuir IP elástico transforma a instância em alcançável da internet, violando o requisito.",
    D:"VPC Endpoint dá acesso privado a serviços da AWS, como S3 e DynamoDB. Não existe endpoint para a internet em geral."
  },
  src:[{t:"NAT Gateway",u:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html"}]
},
{
  id:"aw-d3-05", exam:"clf", dom:"d3", lvl:4, type:"single", sec:85, tags:["sqs-sns-eb"],
  case:"Um sistema de telemetria recebe eventos de sensores. Requisitos: a ordem dos eventos de cada sensor precisa ser preservada e dois times diferentes precisam processar o mesmo fluxo de forma independente, podendo reler os dados dos últimos dias para recalcular métricas.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"Amazon Kinesis Data Streams"},
    {k:"B",t:"Amazon SQS fila padrão"},
    {k:"C",t:"Amazon SNS"},
    {k:"D",t:"Amazon SQS fila FIFO"}
  ],
  ans:["A"],
  why:{
    ok:"Kinesis Data Streams mantém os registros por um período de retenção, preserva ordem dentro do shard e permite que vários consumidores independentes leiam e releiam o mesmo fluxo. Os três requisitos juntos descrevem streaming, não fila.",
    B:"Fila padrão não garante ordem e, sobretudo, a mensagem é removida depois de processada: não dá para reler o histórico nem ter dois times consumindo o mesmo item de forma independente.",
    C:"SNS entrega a mensagem aos inscritos no momento da publicação. Não guarda histórico para releitura e não garante ordenação do fluxo.",
    D:"FIFO resolve a ordem, mas continua sendo fila: a mensagem é consumida e some. Não atende à releitura dos últimos dias."
  },
  src:[{t:"Kinesis Data Streams",u:"https://docs.aws.amazon.com/streams/latest/dev/introduction.html"}]
},
{
  id:"aw-d3-06", exam:"clf", dom:"d3", lvl:3, type:"single", sec:75, tags:["compute-aws"],
  case:"Uma rotina converte imagens assim que elas chegam no S3. Cada execução leva cerca de 8 segundos e o volume é irregular: às vezes zero por hora, às vezes 5 mil em poucos minutos.",
  stem:"Qual opção de computação é mais adequada?",
  opts:[
    {k:"A",t:"AWS Lambda acionado por evento do S3"},
    {k:"B",t:"Instâncias EC2 reservadas rodando um serviço que consulta o bucket"},
    {k:"C",t:"AWS Batch com fila de jobs"},
    {k:"D",t:"Uma instância EC2 com cron a cada minuto"}
  ],
  ans:["A"],
  why:{
    ok:"Execução curta, orientada a evento e com volume muito irregular é o cenário natural do Lambda: escala automaticamente, não cobra quando está ocioso e integra nativamente com evento do S3.",
    B:"Reserva pressupõe uso constante. Com períodos de volume zero, você paga por capacidade parada, e ainda precisa escrever a lógica de varredura do bucket.",
    C:"Batch é desenhado para lote longo e com dependências, não para milhares de tarefas de 8 segundos disparadas por evento.",
    D:"Cron de um minuto introduz atraso, não escala no pico de 5 mil e mantém a instância paga em todo o período ocioso."
  },
  src:[{t:"AWS Lambda",u:"https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"}]
},
{
  id:"aw-d3-07", exam:"clf", dom:"d3", lvl:4, type:"order", sec:85, tags:["s3-classes"],
  stem:"Ordene as classes do S3 do MAIOR para o MENOR custo de armazenamento por GB (considerando o uso típico de cada classe).",
  items:[
    {t:"S3 Standard"},
    {t:"S3 Standard-IA"},
    {t:"S3 Glacier Flexible Retrieval"},
    {t:"S3 Glacier Deep Archive"}
  ],
  e:"O custo de guardar cai conforme o acesso fica mais raro e o tempo de resgate aumenta: Standard é o mais caro para armazenar e o mais barato para ler; Standard-IA reduz o armazenamento e cobra pela recuperação; Glacier Flexible baixa mais e resgata em minutos a horas; Deep Archive é o mais barato de todos, com resgate na casa de horas. A pegadinha é inverter, achando que o Glacier é caro porque o resgate custa.",
  src:[{t:"Classes de armazenamento do S3",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"}]
},
{
  id:"aw-d3-08", exam:"clf", dom:"d3", lvl:4, type:"single", sec:80, tags:["rede-aws"],
  case:"Uma empresa mantém a aplicação em duas regiões. O objetivo é enviar cada usuário para a região que responde mais rápido para ele e, se uma região ficar fora, direcionar todos para a outra automaticamente.",
  stem:"Qual combinação do Route 53 atende?",
  opts:[
    {k:"A",t:"Política de latência com verificações de integridade (health checks)"},
    {k:"B",t:"Política de geolocalização sem verificações de integridade"},
    {k:"C",t:"Política ponderada com pesos iguais"},
    {k:"D",t:"Política simples com dois registros de endereço"}
  ],
  ans:["A"],
  why:{
    ok:"A política de latência escolhe o endpoint com menor latência medida para o usuário. As verificações de integridade retiram automaticamente da resposta o endpoint que está fora, produzindo o failover desejado.",
    B:"Geolocalização roteia pela localização geográfica declarada, que não é a mesma coisa que menor latência. E sem health check não existe failover.",
    C:"Política ponderada distribui por proporção definida, ignorando o desempenho percebido por cada usuário.",
    D:"A política simples pode retornar vários endereços, mas não avalia latência nem integridade do endpoint."
  },
  src:[{t:"Políticas de roteamento do Route 53",u:"https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"}]
},
{
  id:"aw-d3-09", exam:"clf", dom:"d3", lvl:4, type:"single", sec:80, tags:["rede-aws"],
  case:"Uma empresa tem 25 VPCs em 3 regiões e dois datacenters. Hoje existem dezenas de conexões ponto a ponto e a equipe não consegue mais administrar as rotas.",
  stem:"Qual serviço simplifica essa topologia?",
  opts:[
    {k:"A",t:"AWS Transit Gateway"},
    {k:"B",t:"Mais emparelhamentos de VPC (VPC peering)"},
    {k:"C",t:"AWS Direct Connect"},
    {k:"D",t:"Internet Gateway em cada VPC"}
  ],
  ans:["A"],
  why:{
    ok:"O Transit Gateway funciona como um hub de rede: cada VPC e cada conexão local se liga a ele uma única vez, e o roteamento passa a ser transitivo e centralizado. Isso elimina a malha de conexões ponto a ponto.",
    B:"VPC peering não é transitivo: para N VPCs se falarem, o número de conexões cresce de forma quadrática. É justamente a causa do problema descrito.",
    C:"Direct Connect é um link privado entre o datacenter e a AWS. Resolve conectividade e banda, não a complexidade de malha entre as 25 VPCs.",
    D:"Internet Gateway dá acesso à internet. Não interliga VPCs de forma privada."
  },
  src:[{t:"AWS Transit Gateway",u:"https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html"}]
},

/* ---------------- CLF-C02 · D4 cobrança, preços e suporte ---------------- */
{
  id:"aw-d4-01", exam:"clf", dom:"d4", lvl:5, type:"single", sec:90, tags:["pricing-models"],
  case:"Uma empresa precisa de: atendimento técnico 24 horas por telefone, tempo de resposta de 15 minutos para caso de sistema crítico de negócio fora do ar, um gerente técnico de conta designado e revisões de Well-Architected conduzidas pela AWS.",
  stem:"Qual é o plano de suporte de menor custo que atende a TODOS os requisitos?",
  opts:[
    {k:"A",t:"Enterprise"},
    {k:"B",t:"Business Support+"},
    {k:"C",t:"Enterprise On-Ramp (plano antigo)"},
    {k:"D",t:"Basic"}
  ],
  ans:["A"],
  why:{
    ok:"Resposta em até 15 minutos para sistema crítico fora do ar, gerente técnico de conta (TAM) designado e revisões de Well-Architected conduzidas pela AWS são recursos do Enterprise, que hoje tem mínimo de US$ 5.000 por mês. O Unified Operations também tem TAM, mas é um nível acima e mais caro. Até 2026 existiam Developer, Business e Enterprise On-Ramp; eles serão descontinuados em 01/01/2027, e a prova pode ainda citá-los.",
    B:"O Business Support+ tem atendimento 24 horas por telefone, chat e web, mas o tempo para sistema crítico fora do ar é de até 30 minutos e não há TAM designado.",
    C:"O Enterprise On-Ramp está sendo encerrado: seus clientes passam automaticamente para o Enterprise ao longo de 2026. Mesmo antes, ele dava acesso a um grupo de especialistas, não a um TAM designado.",
    D:"O Basic cobre conta, cobrança e documentação. Não inclui suporte técnico de engenheiros."
  },
  src:[{t:"Planos de suporte AWS",u:"https://aws.amazon.com/premiumsupport/plans/"},
       {t:"Fim do Developer, Business e Enterprise On-Ramp",u:"https://docs.aws.amazon.com/awssupport/latest/user/support-plans-eos.html"}]
},
{
  id:"aw-d4-02", exam:"clf", dom:"d4", lvl:4, type:"single", sec:80, tags:["pricing-models"],
  case:"Um grupo tem 12 contas AWS, uma por equipe. A diretoria quer uma fatura única, aproveitar faixas de desconto por volume agregando o consumo de todas as contas e impedir que qualquer equipe use regiões fora da América do Sul.",
  stem:"Qual conjunto de recursos atende?",
  opts:[
    {k:"A",t:"AWS Organizations com cobrança consolidada e políticas de controle de serviço (SCP)"},
    {k:"B",t:"AWS Organizations com cobrança consolidada e grupos de segurança"},
    {k:"C",t:"AWS Budgets com alertas e IAM policies em cada conta"},
    {k:"D",t:"AWS Control Tower apenas, sem Organizations"}
  ],
  ans:["A"],
  why:{
    ok:"Organizations entrega a fatura única e faz o consumo das contas somar para efeito de faixa de desconto por volume. As SCPs definem o limite máximo de permissão de cada conta, permitindo bloquear regiões inteiras.",
    B:"Grupo de segurança filtra tráfego de rede. Não tem como impedir o uso de uma região.",
    C:"Budgets alerta sobre gasto, mas não consolida fatura nem agrega volume. E manter políticas IAM separadas em 12 contas não cria um limite organizacional confiável.",
    D:"Control Tower e construído sobre o Organizations: ele não substitui nem funciona sem essa base."
  },
  src:[{t:"AWS Organizations",u:"https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html"}]
},
{
  id:"aw-d4-03", exam:"clf", dom:"d4", lvl:4, type:"single", sec:85, tags:["custo-ferramentas"],
  case:"Quatro pedidos chegaram no mesmo dia: 1) estimar o custo de uma arquitetura que ainda não existe; 2) ver o gasto dos últimos 6 meses por serviço e projetar o próximo mês; 3) receber e-mail quando o gasto passar de um valor definido; 4) descobrir recursos subutilizados para reduzir conta.",
  stem:"Quais ferramentas atendem, respectivamente, aos itens 1, 2, 3 e 4?",
  opts:[
    {k:"A",t:"Pricing Calculator, Cost Explorer, AWS Budgets e Trusted Advisor"},
    {k:"B",t:"Cost Explorer, Pricing Calculator, CloudWatch e Inspector"},
    {k:"C",t:"Pricing Calculator, Cost and Usage Report, Cost Explorer e Config"},
    {k:"D",t:"Budgets, Cost Explorer, Pricing Calculator e Compute Optimizer"}
  ],
  ans:["A"],
  why:{
    ok:"Pricing Calculator estima antes de existir. Cost Explorer visualiza o histórico e projeta tendência. Budgets dispara alerta ao atingir um limite. Trusted Advisor aponta recurso ocioso ou subutilizado na categoria de otimização de custo.",
    B:"Inverte as duas primeiras ferramentas e usa Inspector, que trata de vulnerabilidade de segurança, não de custo.",
    C:"O Cost and Usage Report entrega dados detalhados em arquivo, sem a visualização e a projeção pedidas, e o Config avalia configuração, não desperdício de custo.",
    D:"Também inverte a ordem das três primeiras. O Compute Optimizer realmente recomenda dimensionamento, mas a resposta falha nos outros itens."
  },
  src:[{t:"Cost Explorer",u:"https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html"},
       {t:"AWS Budgets",u:"https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html"}]
},
{
  id:"aw-d4-04", exam:"clf", dom:"d4", lvl:4, type:"yn", sec:90, tags:["pricing-models"],
  stem:"Responda Sim ou Não sobre modelos de precificação de computação na AWS.",
  rows:[
    {t:"Instâncias spot podem ser interrompidas pela AWS quando a capacidade é necessária, com aviso prévio curto.", a:true,
     e:"Sim. Por isso spot só serve para carga tolerante a interrupção."},
    {t:"Savings Plans de computação permitem mudar de família de instância e de região mantendo o desconto.", a:true,
     e:"Sim, e esse é o diferencial frente à reserva padrão: o compromisso é de gasto por hora, não de uma instância específica."},
    {t:"Instâncias reservadas garantem que a instância nunca será interrompida por falta de capacidade mesmo sem reserva de capacidade.", a:false,
     e:"Reserva é um compromisso de faturamento. Garantia de capacidade exige configuração específica de reserva zonal ou Capacity Reservation."},
    {t:"Carga de produção 24/7 por 3 anos tende a ficar mais barata em spot do que em Savings Plan.", a:false,
     e:"Spot tem o maior desconto por hora, mas não serve para carga que não pode cair. Para 24/7 estável, o modelo correto é compromisso de longo prazo."}
  ],
  src:[{t:"Savings Plans",u:"https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html"},
       {t:"Instâncias spot",u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html"}]
},
{
  id:"aw-d4-05", exam:"clf", dom:"d4", lvl:3, type:"single", sec:70, tags:["pricing-models"],
  stem:"Uma equipe quer validar uma ideia sem gerar custo. Qual afirmação sobre o nível gratuito da AWS é correta?",
  opts:[
    {k:"A",t:"Há ofertas sempre gratuitas com cota mensal, e contas novas recebem créditos promocionais"},
    {k:"B",t:"Todos os serviços são gratuitos nos primeiros 12 meses, sem nenhum limite de uso"},
    {k:"C",t:"O nível gratuito cobre apenas os serviços Amazon EC2 e Amazon S3"},
    {k:"D",t:"Quando o período gratuito termina, nenhum serviço mantém cota gratuita"}
  ],
  ans:["A"],
  why:{
    ok:"Contas criadas desde 15/07/2025 recebem até US$ 200 em créditos (US$ 100 na criação e até US$ 100 explorando serviços) e podem ficar no plano gratuito por até 6 meses. As ofertas sempre gratuitas, com cota mensal, continuam valendo. Contas mais antigas seguem no modelo anterior, com ofertas de 12 meses, testes de curta duração e sempre gratuitas, que a prova ainda pode citar.",
    B:"Não é tudo nem sem limite. Passar da cota consome créditos ou gera cobrança, e muitos serviços não entram nas ofertas gratuitas.",
    C:"As ofertas sempre gratuitas cobrem mais de 30 serviços, muito além de EC2 e S3.",
    D:"As ofertas sempre gratuitas continuam valendo depois do período inicial, dentro das cotas definidas."
  },
  src:[{t:"Nível gratuito da AWS",u:"https://aws.amazon.com/free/"},
       {t:"Mudança do nível gratuito (jul/2025)",u:"https://aws.amazon.com/pt/blogs/aws/aws-free-tier-update-new-customers-can-get-started-and-explore-aws-with-up-to-200-in-credits/"}]
},
{
  id:"aw-d4-06", exam:"clf", dom:"d4", lvl:5, type:"single", sec:85, tags:["pricing-models","custo-ferramentas"],
  case:"A fatura de uma empresa cresceu sem aumento de uso de computação. A análise mostrou que o maior item é transferência de dados de saída para a internet, gerada por downloads de arquivos grandes hospedados em um bucket S3 e baixados repetidamente pelos mesmos usuários.",
  stem:"Qual medida tende a reduzir mais esse custo?",
  opts:[
    {k:"A",t:"Colocar o Amazon CloudFront na frente do bucket para servir o conteúdo em cache"},
    {k:"B",t:"Mover os arquivos para a classe S3 Standard-IA"},
    {k:"C",t:"Comprar Savings Plans de computação"},
    {k:"D",t:"Habilitar versionamento no bucket"}
  ],
  ans:["A"],
  why:{
    ok:"CloudFront serve o conteúdo repetido a partir do cache nos pontos de presença. Isso reduz as requisições e a transferência saindo diretamente do S3, e a transferência do CloudFront para a internet tem precificação mais favorável em volume. O problema é conteúdo repetido, e cache é a resposta.",
    B:"Standard-IA reduz o custo de ARMAZENAR, mas aumenta o custo por recuperação. Com download repetido frequente, pode sair mais caro.",
    C:"Savings Plans de computação não se aplicam à transferência de dados nem a S3.",
    D:"Versionamento guarda cópias antigas e tende a AUMENTAR o custo de armazenamento, sem afetar a transferência de saída."
  },
  src:[{t:"Amazon CloudFront",u:"https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html"}]
}
];
