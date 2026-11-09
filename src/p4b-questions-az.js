/* ============================================================
   BANCO DE QUESTÕES — lote 2, Azure (AZ-900)
   Conteúdo original escrito a partir dos objetivos públicos.
   ============================================================ */
const QUESTIONS_AZ2 = [
{
  id:"az-d1-06", exam:"az900", dom:"d1", lvl:4, type:"single", sec:75, tags:["modelos-nuvem"],
  case:"Uma startup vai lançar um aplicativo. A equipe tem dois desenvolvedores e nenhum administrador de infraestrutura. Eles precisam publicar uma API e um banco relacional, e não querem responder por sistema operacional, patch nem backup do banco.",
  stem:"Qual combinação de modelos de serviço atende com o menor esforço operacional?",
  opts:[
    {k:"A",t:"PaaS para a API e PaaS para o banco de dados"},
    {k:"B",t:"IaaS para a API e PaaS para o banco de dados"},
    {k:"C",t:"IaaS para a API e IaaS para o banco de dados"},
    {k:"D",t:"SaaS para a API e PaaS para o banco de dados"}
  ],
  ans:["A"],
  why:{
    ok:"Com dois desenvolvedores e nenhum administrador, os dois componentes devem ser gerenciados. PaaS entrega plataforma pronta para a API e banco gerenciado com patch e backup pelo provedor, que é exatamente o que o enunciado exige.",
    B:"IaaS para a API devolve o sistema operacional à equipe, contrariando o requisito de não responder por patch.",
    C:"Dois componentes em IaaS é o cenário de maior esforço operacional possível entre as alternativas.",
    D:"SaaS é software pronto de terceiro. Você não publica a sua própria API como SaaS: esse termo descreve consumir uma aplicação, não hospedar a sua."
  },
  src:[{t:"Tipos de serviço de nuvem",u:"https://learn.microsoft.com/training/modules/describe-cloud-service-types/"}]
},
{
  id:"az-d1-07", exam:"az900", dom:"d1", lvl:3, type:"single", sec:65, tags:["elasticidade"],
  stem:"Uma aplicação roda numa única máquina virtual que começou a ficar sem memória. A equipe trocou a VM por um tamanho com o dobro de memória. Como se chama essa ação?",
  opts:[
    {k:"A",t:"Escalabilidade vertical"},
    {k:"B",t:"Escalabilidade horizontal"},
    {k:"C",t:"Elasticidade"},
    {k:"D",t:"Balanceamento de carga"}
  ],
  ans:["A"],
  why:{
    ok:"Aumentar recursos da mesma instância é escalar verticalmente, também chamado de scale up. O número de instâncias não mudou.",
    B:"Horizontal seria somar instâncias. Aqui continua existindo uma só.",
    C:"Elasticidade implica ajuste automático nos dois sentidos conforme a demanda. Houve uma troca manual e definitiva.",
    D:"Balanceamento distribui tráfego entre instâncias, o que pressupõe mais de uma."
  },
  src:[{t:"Escala no Azure",u:"https://learn.microsoft.com/azure/architecture/best-practices/auto-scaling"}]
},
{
  id:"az-d1-08", exam:"az900", dom:"d1", lvl:4, type:"yn", sec:90, tags:["modelos-nuvem","elasticidade"],
  stem:"Responda Sim ou Não sobre características da nuvem pública.",
  rows:[
    {t:"Precificação por consumo significa que não há cobrança quando o recurso está desligado e desalocado.", a:true,
     e:"Para computação sim: VM desalocada não gera custo de computação. Disco e IP reservado continuam cobrando, e por isso parar sem desalocar não zera a fatura."},
    {t:"Migrar para nuvem pública converte despesa de investimento em despesa operacional.", a:true,
     e:"É o argumento financeiro central: deixa de comprar ativo e passa a pagar pelo uso."},
    {t:"Nuvem pública elimina a necessidade de planejar capacidade.", a:false,
     e:"Reduz o risco de errar, mas continua sendo preciso dimensionar, definir limites de escala e controlar custo."},
    {t:"Em nuvem pública o cliente é responsável pela segurança física do datacenter.", a:false,
     e:"Segurança física é sempre do provedor, em qualquer modelo."}
  ],
  src:[{t:"Benefícios da nuvem",u:"https://learn.microsoft.com/training/modules/describe-cloud-compute/"}]
},
{
  id:"az-d1-09", exam:"az900", dom:"d1", lvl:5, type:"single", sec:80, tags:["modelos-nuvem"],
  case:"Uma rede de farmácias quer abrir operação em outro país em seis semanas. O obstáculo hoje é que comprar e instalar servidores leva três meses, e a área de negócio não aceita esse prazo.",
  stem:"Qual benefício da nuvem é o argumento mais direto para essa decisão?",
  opts:[
    {k:"A",t:"Agilidade, com alcance global em minutos"},
    {k:"B",t:"Alta disponibilidade"},
    {k:"C",t:"Precificação por consumo"},
    {k:"D",t:"Tolerância a falhas"}
  ],
  ans:["A"],
  why:{
    ok:"O obstáculo descrito é tempo de provisionamento. Agilidade é exatamente conseguir recursos em minutos, e a presença global do provedor permite subir a operação em outra região sem construir datacenter.",
    B:"Alta disponibilidade trata de continuar funcionando diante de falha. Não encurta prazo de abertura.",
    C:"Precificação por consumo reduz desperdício, mas o enunciado fala de prazo, não de custo.",
    D:"Tolerância a falhas é redundância de componentes. Nada a ver com velocidade de entrada em novo mercado."
  },
  src:[{t:"Benefícios da nuvem",u:"https://learn.microsoft.com/training/modules/describe-cloud-compute/"}]
},
{
  id:"az-d1-10", exam:"az900", dom:"d1", lvl:4, type:"single", sec:70, tags:["shared-responsibility","modelos-nuvem"],
  stem:"Em qual modelo o cliente é responsável por instalar e atualizar o runtime da aplicação, como a versão do .NET ou do Java?",
  opts:[
    {k:"A",t:"IaaS"},
    {k:"B",t:"PaaS"},
    {k:"C",t:"SaaS"},
    {k:"D",t:"Em todos os três"}
  ],
  ans:["A"],
  why:{
    ok:"Em IaaS o provedor entrega a máquina virtual e para por aí. Sistema operacional, runtime e middleware ficam com o cliente.",
    B:"Em PaaS a plataforma já traz o runtime gerenciado. O cliente escolhe a versão oferecida, mas não instala nem atualiza o componente.",
    C:"Em SaaS o cliente não tem acesso a runtime nenhum: consome a aplicação pronta.",
    D:"A fronteira muda conforme o modelo. Dizer que vale para os três ignora justamente o que a questão cobra."
  },
  src:[{t:"Responsabilidade compartilhada",u:"https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility"}]
},
{
  id:"az-d1-11", exam:"az900", dom:"d1", lvl:4, type:"single", sec:70, tags:["modelos-nuvem"],
  case:"Um banco mantém o core bancário em datacenter próprio por exigência regulatória e quer usar a nuvem apenas para processar relatórios analíticos pesados no fim do mês, lendo uma cópia dos dados.",
  stem:"Qual é a principal vantagem financeira dessa escolha?",
  opts:[
    {k:"A",t:"Pagar pela capacidade de análise só nos dias em que ela é usada"},
    {k:"B",t:"Eliminar completamente o custo do datacenter próprio"},
    {k:"C",t:"Obter um SLA de 100% para o core bancário"},
    {k:"D",t:"Transferir a responsabilidade pelos dados para o provedor"}
  ],
  ans:["A"],
  why:{
    ok:"Carga concentrada em poucos dias é o caso clássico de precificação por consumo: você provisiona no fim do mês e desliga depois, em vez de comprar servidores que ficariam ociosos.",
    B:"O core continua no datacenter próprio, então o custo dele permanece. O modelo descrito é híbrido.",
    C:"Nenhum serviço oferece SLA de 100%, e o core sequer está na nuvem.",
    D:"Responsabilidade pelos dados é sempre do cliente, em qualquer modelo."
  },
  src:[{t:"Modelos de nuvem",u:"https://learn.microsoft.com/training/modules/describe-cloud-service-types/"}]
},
{
  id:"az-d1-12", exam:"az900", dom:"d1", lvl:5, type:"order", sec:80, tags:["elasticidade"],
  stem:"Ordene do nível de proteção MENOR para o MAIOR, considerando o escopo da falha que cada arranjo tolera.",
  items:[
    {t:"Uma única máquina virtual, sem redundância"},
    {t:"Duas máquinas virtuais em um conjunto de disponibilidade"},
    {t:"Duas máquinas virtuais em zonas de disponibilidade diferentes"},
    {t:"Implantação ativa em duas regiões emparelhadas"}
  ],
  e:"A escada de disponibilidade vai do menor para o maior escopo de falha tolerada: uma VM sozinha cai com qualquer problema de host; o conjunto de disponibilidade protege contra falha de rack e manutenção dentro do datacenter; zonas protegem contra a perda de um datacenter inteiro na região; e presença em duas regiões protege contra um desastre regional. Essa ordem resolve quase toda questão de arquitetura resiliente no exame.",
  src:[{t:"Confiabilidade no Azure",u:"https://learn.microsoft.com/azure/reliability/overview"}]
},
{
  id:"az-d2-10", exam:"az900", dom:"d2", lvl:4, type:"single", sec:80, tags:["compute-az"],
  case:"Um time precisa automatizar um fluxo que, quando chega um e-mail com anexo, salva o anexo no armazenamento, registra uma linha numa planilha e avisa um canal de chat. Ninguém do time quer escrever e manter código.",
  stem:"Qual serviço do Azure atende melhor?",
  opts:[
    {k:"A",t:"Azure Logic Apps"},
    {k:"B",t:"Azure Functions"},
    {k:"C",t:"Azure Batch"},
    {k:"D",t:"Azure Virtual Machines"}
  ],
  ans:["A"],
  why:{
    ok:"Logic Apps é orquestração de fluxo com conectores prontos e desenho visual, feito justamente para integrar serviços sem escrever código.",
    B:"Functions resolveria, mas exige código e manutenção dele, que é o que o enunciado veta.",
    C:"Batch é para processamento paralelo em lote de grande escala, não para integração orientada a evento.",
    D:"Máquina virtual é o extremo oposto do requisito: máximo de manutenção."
  },
  src:[{t:"Azure Logic Apps",u:"https://learn.microsoft.com/azure/logic-apps/logic-apps-overview"}]
},
{
  id:"az-d2-11", exam:"az900", dom:"d2", lvl:4, type:"single", sec:75, tags:["compute-az"],
  stem:"Qual descrição corresponde ao Azure Container Instances?",
  opts:[
    {k:"A",t:"Executa contêineres isolados sob demanda, sem orquestração nem cluster para administrar"},
    {k:"B",t:"Orquestra contêineres com escala automática, atualização progressiva e autorrecuperação"},
    {k:"C",t:"Hospeda aplicações web com slots de implantação e certificados gerenciados"},
    {k:"D",t:"Executa funções sem servidor disparadas por evento"}
  ],
  ans:["A"],
  why:{
    ok:"Container Instances é a forma mais simples de rodar um contêiner no Azure: sem cluster, sem nó, sem orquestrador. Serve para tarefa isolada, job rápido ou pico pontual.",
    B:"Essa é a descrição do Azure Kubernetes Service.",
    C:"Slots e certificado gerenciado descrevem o Azure App Service.",
    D:"Função disparada por evento é o Azure Functions."
  },
  src:[{t:"Container Instances",u:"https://learn.microsoft.com/azure/container-instances/container-instances-overview"}]
},
{
  id:"az-d2-12", exam:"az900", dom:"d2", lvl:5, type:"single", sec:85, tags:["region-az-pair","compute-az"],
  case:"Uma aplicação precisa ficar disponível mesmo durante as manutenções planejadas do Azure e também se um rack do datacenter falhar. O orçamento não permite distribuir entre zonas de disponibilidade neste momento.",
  stem:"Qual recurso atende dentro dessa restrição?",
  opts:[
    {k:"A",t:"Conjunto de disponibilidade, com domínios de falha e de atualização"},
    {k:"B",t:"Par de regiões, com replicação geográfica"},
    {k:"C",t:"Azure Front Door com várias origens"},
    {k:"D",t:"Disco premium na máquina virtual"}
  ],
  ans:["A"],
  why:{
    ok:"O conjunto de disponibilidade distribui as máquinas em domínios de falha, que cobrem rack e fonte de energia, e em domínios de atualização, que garantem que a manutenção planejada não derrube todas ao mesmo tempo. É a opção de menor custo que cobre os dois requisitos.",
    B:"Par de regiões resolve desastre regional e custa muito mais do que o enunciado permite.",
    C:"Front Door distribui tráfego globalmente, mas pressupõe origens redundantes já existentes: ele não cria a redundância dentro do datacenter.",
    D:"Disco premium melhora desempenho e o compromisso de disponibilidade de uma VM única, mas não protege contra falha de rack nem contra manutenção."
  },
  src:[{t:"Disponibilidade de VMs",u:"https://learn.microsoft.com/azure/virtual-machines/availability"}]
},
{
  id:"az-d2-13", exam:"az900", dom:"d2", lvl:4, type:"single", sec:75, tags:["rede-az","region-az-pair"],
  stem:"Qual recurso filtra o tráfego de rede na entrada e na saída de uma sub-rede ou de uma interface de rede no Azure?",
  opts:[
    {k:"A",t:"Grupo de segurança de rede (NSG)"},
    {k:"B",t:"Azure Firewall Manager"},
    {k:"C",t:"Emparelhamento de rede virtual"},
    {k:"D",t:"Azure Bastion"}
  ],
  ans:["A"],
  why:{
    ok:"O NSG contém regras de permissão e negação por origem, destino, porta e protocolo, aplicadas a sub-rede ou a interface de rede. É o controle básico de tráfego dentro da VNet.",
    B:"Firewall Manager administra políticas de firewall em escala; não é o filtro aplicado diretamente na sub-rede.",
    C:"Emparelhamento conecta redes virtuais entre si; não filtra tráfego.",
    D:"Bastion dá acesso administrativo seguro a VMs pelo portal, sem IP público. Não é um filtro de rede."
  },
  src:[{t:"Grupos de segurança de rede",u:"https://learn.microsoft.com/azure/virtual-network/network-security-groups-overview"}]
},
{
  id:"az-d2-14", exam:"az900", dom:"d2", lvl:5, type:"single", sec:85, tags:["blob-tiers"],
  case:"Uma conta de armazenamento guarda relatórios financeiros. O requisito é que os dados sobrevivam à perda completa da região primária, com cópia em outra região geográfica.",
  stem:"Qual opção de redundância atende?",
  opts:[
    {k:"A",t:"Armazenamento com redundância geográfica (GRS)"},
    {k:"B",t:"Armazenamento com redundância local (LRS)"},
    {k:"C",t:"Armazenamento com redundância de zona (ZRS)"},
    {k:"D",t:"Camada de acesso Archive"}
  ],
  ans:["A"],
  why:{
    ok:"GRS mantém cópias na região primária e replica para a região emparelhada, que é o único arranjo entre as alternativas que sobrevive à perda da região inteira.",
    B:"LRS mantém três cópias dentro de um único datacenter. Perder a região significa perder tudo.",
    C:"ZRS distribui entre zonas, o que protege contra queda de datacenter, mas todas as zonas estão na mesma região.",
    D:"Camada de acesso define custo e latência de leitura, não onde as cópias ficam."
  },
  src:[{t:"Redundância do armazenamento",u:"https://learn.microsoft.com/azure/storage/common/storage-redundancy"}]
},
{
  id:"az-d2-15", exam:"az900", dom:"d2", lvl:4, type:"single", sec:80, tags:["compute-az","bancos-az"],
  case:"Uma aplicação global precisa de um banco que entregue baixa latência de leitura e escrita em vários continentes, com distribuição automática dos dados e vários modelos de API, incluindo documento e chave e valor.",
  stem:"Qual serviço do Azure atende?",
  opts:[
    {k:"A",t:"Azure Cosmos DB"},
    {k:"B",t:"Azure SQL Database"},
    {k:"C",t:"Azure Cache for Redis"},
    {k:"D",t:"Azure Table Storage"}
  ],
  ans:["A"],
  why:{
    ok:"Cosmos DB é o banco NoSQL distribuído globalmente do Azure, com replicação multirregião, baixa latência garantida e suporte a vários modelos de API.",
    B:"Azure SQL Database é relacional e, embora tenha recursos de replicação, não é a resposta para distribuição global multimodelo.",
    C:"Redis é cache em memória, não banco primário com distribuição global.",
    D:"Table Storage é simples e barato, mas não oferece distribuição global gerenciada nem vários modelos de API."
  },
  src:[{t:"Azure Cosmos DB",u:"https://learn.microsoft.com/azure/cosmos-db/introduction"}]
},
{
  id:"az-d2-16", exam:"az900", dom:"d2", lvl:4, type:"multi", sec:90, tags:["region-az-pair","compute-az"],
  stem:"Quais afirmações sobre regiões e zonas de disponibilidade do Azure são verdadeiras? Escolha DUAS.",
  opts:[
    {k:"A",t:"Nem todos os serviços do Azure estão disponíveis em todas as regiões"},
    {k:"B",t:"Zonas de disponibilidade são datacenters fisicamente separados dentro da mesma região"},
    {k:"C",t:"Toda região do Azure possui zonas de disponibilidade"},
    {k:"D",t:"Uma zona de disponibilidade abrange várias regiões"},
    {k:"E",t:"O preço de um mesmo serviço é idêntico em todas as regiões"}
  ],
  ans:["A","B"],
  why:{
    ok:"A disponibilidade de serviço varia por região, e é por isso que a verificação de disponibilidade entra no planejamento. E zonas são, por definição, locais fisicamente separados com energia, refrigeração e rede independentes dentro de uma mesma região.",
    C:"Nem toda região oferece zonas. É um dos critérios de escolha de região.",
    D:"É o contrário: a região contém zonas, não o inverso.",
    E:"Preço varia entre regiões, e isso também entra na escolha."
  },
  src:[{t:"Regiões e zonas",u:"https://learn.microsoft.com/azure/reliability/availability-zones-overview"}]
},
{
  id:"az-d2-17", exam:"az900", dom:"d2", lvl:3, type:"single", sec:70, tags:["compute-az"],
  case:"Uma empresa precisa dar acesso a aplicações Windows legadas para 200 funcionários que trabalham de casa, em notebooks pessoais, sem instalar o software em cada máquina.",
  stem:"Qual serviço resolve?",
  opts:[
    {k:"A",t:"Azure Virtual Desktop"},
    {k:"B",t:"Azure App Service"},
    {k:"C",t:"Azure Arc"},
    {k:"D",t:"Azure Container Apps"}
  ],
  ans:["A"],
  why:{
    ok:"Azure Virtual Desktop entrega áreas de trabalho e aplicações Windows pela rede, com sessões que podem ser compartilhadas, acessíveis de qualquer dispositivo.",
    B:"App Service hospeda aplicações web, não aplicações desktop Windows legadas.",
    C:"Azure Arc estende a administração do Azure para servidores fora dele. Não entrega desktop a usuário final.",
    D:"Container Apps executa contêineres; não é entrega de desktop remoto."
  },
  src:[{t:"Azure Virtual Desktop",u:"https://learn.microsoft.com/azure/virtual-desktop/overview"}]
},
{
  id:"az-d2-18", exam:"az900", dom:"d2", lvl:5, type:"single", sec:85, tags:["entra-vs-adds"],
  case:"Uma aplicação hospedada no Azure App Service precisa ler segredos do Azure Key Vault. A equipe de segurança proibiu qualquer credencial armazenada em configuração, variável de ambiente ou código.",
  stem:"Qual recurso atende?",
  opts:[
    {k:"A",t:"Identidade gerenciada atribuída ao App Service"},
    {k:"B",t:"Entidade de serviço com segredo de cliente guardado na configuração do aplicativo"},
    {k:"C",t:"Usuário do Microsoft Entra ID com senha rotacionada mensalmente"},
    {k:"D",t:"Chave de acesso da conta de armazenamento"}
  ],
  ans:["A"],
  why:{
    ok:"A identidade gerenciada dá ao próprio recurso do Azure uma identidade no Entra ID, e o token é obtido pela plataforma. Não existe segredo para guardar, que é exatamente o requisito.",
    B:"Entidade de serviço com segredo de cliente continua sendo uma credencial armazenada, justamente o que foi proibido.",
    C:"Usar identidade de pessoa para uma aplicação é má prática e ainda implica guardar senha.",
    D:"Chave de conta de armazenamento é outra credencial estática e nem serve para autenticar no Key Vault."
  },
  src:[{t:"Identidades gerenciadas",u:"https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/overview"}]
},
{
  id:"az-d3-07", exam:"az900", dom:"d3", lvl:4, type:"single", sec:80, tags:["rbac-policy-lock"],
  case:"Uma empresa tem 40 assinaturas separadas por área. A diretoria quer aplicar uma única política de regiões permitidas que valha para todas, sem repetir a configuração 40 vezes.",
  stem:"Onde a política deve ser atribuída?",
  opts:[
    {k:"A",t:"No grupo de gerenciamento que contém as assinaturas"},
    {k:"B",t:"Em cada assinatura, uma por uma"},
    {k:"C",t:"No grupo de recursos de cada assinatura"},
    {k:"D",t:"Em cada recurso individualmente"}
  ],
  ans:["A"],
  why:{
    ok:"Grupos de gerenciamento existem exatamente para aplicar governança acima da assinatura. A política atribuída ali é herdada por todas as assinaturas abaixo.",
    B:"Funciona, mas é o trabalho manual que o enunciado quer evitar, e abre espaço para divergência entre assinaturas.",
    C:"Grupo de recursos é um escopo ainda mais estreito, multiplicando o esforço.",
    D:"Política não é atribuída recurso a recurso como forma de governança em escala."
  },
  src:[{t:"Grupos de gerenciamento",u:"https://learn.microsoft.com/azure/governance/management-groups/overview"}]
},
{
  id:"az-d3-08", exam:"az900", dom:"d3", lvl:4, type:"single", sec:75, tags:["custo-az"],
  case:"O financeiro quer ser avisado por e-mail quando o gasto da assinatura chegar a 80% do valor planejado para o mês, antes de estourar.",
  stem:"Qual recurso atende?",
  opts:[
    {k:"A",t:"Orçamento com alerta no Microsoft Cost Management"},
    {k:"B",t:"Azure Advisor"},
    {k:"C",t:"Calculadora de Preços"},
    {k:"D",t:"Azure Monitor com métrica de CPU"}
  ],
  ans:["A"],
  why:{
    ok:"O orçamento do Cost Management define um valor e dispara alerta em percentuais configuráveis do consumo. É o instrumento feito para isso.",
    B:"Advisor recomenda economia em recursos existentes, mas não monitora um teto de gasto mensal.",
    C:"A calculadora estima custo antes de contratar; não acompanha o gasto real.",
    D:"Azure Monitor acompanha métricas técnicas dos recursos, não a fatura."
  },
  src:[{t:"Orçamentos no Cost Management",u:"https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets"}]
},
{
  id:"az-d3-09", exam:"az900", dom:"d3", lvl:4, type:"multi", sec:90, tags:["monitor-az"],
  stem:"Quais categorias de recomendação o Azure Advisor oferece? Escolha TRÊS.",
  opts:[
    {k:"A",t:"Custo"},
    {k:"B",t:"Segurança"},
    {k:"C",t:"Confiabilidade"},
    {k:"D",t:"Licenciamento de software de terceiros"},
    {k:"E",t:"Design gráfico de aplicações"}
  ],
  ans:["A","B","C"],
  why:{
    ok:"O Advisor cobre custo, segurança, confiabilidade, excelência operacional e desempenho. Custo, segurança e confiabilidade estão entre elas.",
    D:"Licenciamento de terceiros não é categoria do Advisor.",
    E:"O Advisor analisa configuração e uso de recursos do Azure, não interface de aplicação."
  },
  src:[{t:"Azure Advisor",u:"https://learn.microsoft.com/azure/advisor/advisor-overview"}]
},
{
  id:"az-d3-10", exam:"az900", dom:"d3", lvl:5, type:"single", sec:85, tags:["monitor-az"],
  case:"Uma empresa precisa correlacionar eventos de segurança vindos do Azure, do Microsoft 365, de firewalls locais e de um provedor externo, e disparar respostas automatizadas quando um padrão de ataque for identificado.",
  stem:"Qual serviço é o indicado?",
  opts:[
    {k:"A",t:"Microsoft Sentinel"},
    {k:"B",t:"Microsoft Defender for Cloud"},
    {k:"C",t:"Azure Monitor"},
    {k:"D",t:"Azure Policy"}
  ],
  ans:["A"],
  why:{
    ok:"Sentinel é o SIEM e SOAR da Microsoft: ingere sinais de muitas fontes, inclusive de fora do Azure, correlaciona e automatiza resposta a incidente.",
    B:"Defender for Cloud cuida de postura e proteção de cargas no Azure e em outras nuvens, mas não é a plataforma de correlação multifonte com automação de resposta.",
    C:"Azure Monitor coleta métrica e log de recursos. Não faz correlação de ameaça nem resposta orquestrada.",
    D:"Policy garante conformidade de configuração. Nada a ver com detecção de ataque."
  },
  src:[{t:"Microsoft Sentinel",u:"https://learn.microsoft.com/azure/sentinel/overview"}]
},
{
  id:"az-d3-11", exam:"az900", dom:"d3", lvl:4, type:"single", sec:75, tags:["rbac-policy-lock"],
  case:"Uma equipe quer criar o mesmo conjunto de recursos em três ambientes, de forma repetível, versionada em repositório e sem cliques no portal.",
  stem:"Qual abordagem o Azure oferece?",
  opts:[
    {k:"A",t:"Modelos declarativos do Azure Resource Manager, como ARM ou Bicep"},
    {k:"B",t:"Exportar capturas de tela do portal como documentação"},
    {k:"C",t:"Azure Advisor"},
    {k:"D",t:"Marcação de recursos com tags"}
  ],
  ans:["A"],
  why:{
    ok:"Modelos do Resource Manager, em JSON ou em Bicep, descrevem a infraestrutura como código: são versionáveis, idempotentes e implantáveis em qualquer ambiente.",
    B:"Documentação não provisiona nada nem garante repetibilidade.",
    C:"Advisor faz recomendações; não cria recursos.",
    D:"Tags organizam e permitem rateio, mas não descrevem nem criam infraestrutura."
  },
  src:[{t:"Modelos do Resource Manager",u:"https://learn.microsoft.com/azure/azure-resource-manager/templates/overview"}]
},
{
  id:"az-d3-12", exam:"az900", dom:"d3", lvl:3, type:"single", sec:65, tags:["rbac-policy-lock"],
  stem:"Qual ferramenta permite administrar recursos do Azure pela linha de comando, a partir do navegador, sem instalar nada na máquina?",
  opts:[
    {k:"A",t:"Azure Cloud Shell"},
    {k:"B",t:"Azure PowerShell instalado localmente"},
    {k:"C",t:"Azure Resource Manager"},
    {k:"D",t:"Azure Mobile App"}
  ],
  ans:["A"],
  why:{
    ok:"O Cloud Shell é um terminal hospedado, acessível pelo portal ou pelo navegador, já autenticado e com Azure CLI e PowerShell disponíveis.",
    B:"É a mesma linguagem, mas exige instalação local, que o enunciado descarta.",
    C:"O Resource Manager é a camada de gerenciamento que recebe as requisições, não uma interface de linha de comando.",
    D:"O aplicativo móvel permite acompanhar e executar ações básicas, mas não é um terminal de linha de comando completo."
  },
  src:[{t:"Azure Cloud Shell",u:"https://learn.microsoft.com/azure/cloud-shell/overview"}]
},
{
  id:"az-d3-13", exam:"az900", dom:"d3", lvl:5, type:"yn", sec:95, tags:["rbac-policy-lock","custo-az"],
  stem:"Responda Sim ou Não sobre governança e custo no Azure.",
  rows:[
    {t:"Uma atribuição de função do RBAC feita no grupo de gerenciamento é herdada pelas assinaturas abaixo.", a:true,
     e:"RBAC é herdado para baixo na hierarquia. É por isso que atribuir no topo exige cuidado."},
    {t:"O Azure Policy pode corrigir automaticamente recursos fora de conformidade, dependendo do efeito configurado.", a:true,
     e:"Efeitos como modify e deployIfNotExists permitem remediar, além de auditar e negar."},
    {t:"Remover um bloqueio de recurso exige permissão específica, mesmo para quem é Proprietário.", a:true,
     e:"Gerenciar bloqueios exige a ação de autorização correspondente, normalmente presente nas funções de Proprietário e de Administrador de Acesso de Usuário."},
    {t:"Reservas de instância cobrem automaticamente qualquer tamanho de máquina virtual em qualquer região.", a:false,
     e:"A reserva é feita para um escopo, uma família e uma região. Existe flexibilidade dentro da mesma série, mas não cobertura irrestrita."}
  ],
  src:[{t:"Azure Policy",u:"https://learn.microsoft.com/azure/governance/policy/concepts/effects"},
       {t:"Reservas",u:"https://learn.microsoft.com/azure/cost-management-billing/reservations/save-compute-costs-reservations"}]
},
{
  id:"az-d3-14", exam:"az900", dom:"d3", lvl:4, type:"single", sec:75, tags:["monitor-az"],
  stem:"Onde um auditor externo encontra os relatórios de conformidade e as certificações do Azure, como ISO e SOC?",
  opts:[
    {k:"A",t:"Portal de Confiança do Serviço da Microsoft"},
    {k:"B",t:"Azure Monitor"},
    {k:"C",t:"Microsoft Cost Management"},
    {k:"D",t:"Azure Service Health"}
  ],
  ans:["A"],
  why:{
    ok:"O Portal de Confiança do Serviço concentra relatórios de auditoria, certificações e documentos de conformidade dos serviços da Microsoft.",
    B:"Monitor traz métrica e log operacional dos seus recursos, não documentação de conformidade.",
    C:"Cost Management trata de gasto.",
    D:"Service Health informa incidentes e manutenções da plataforma."
  },
  src:[{t:"Portal de Confiança do Serviço",u:"https://learn.microsoft.com/compliance/regulatory/offering-home"}]
}
];
