/* ============================================================
   BANCO DE QUESTÕES — AZ-104, lote 3 (todos os domínios)
   Conteúdo original escrito a partir dos objetivos públicos.
   Temas que os lotes anteriores não cobriam.
   ============================================================ */
const QUESTIONS_104C = [
/* ---------------- D1 identidades e governança ---------------- */
{
  id:"104-d1-09", exam:"az104", dom:"d1", lvl:4, type:"single", sec:95, tags:["rbac-governanca"],
  case:"Você criou uma função personalizada que só permite reiniciar máquinas virtuais. A segurança exige que ela só possa ser atribuída nas assinaturas de Produção e de Homologação, e em nenhuma outra.",
  stem:"Qual propriedade da definição da função controla isso?",
  opts:[
    {k:"A",t:"AssignableScopes, listando apenas as duas assinaturas"},
    {k:"B",t:"NotActions, removendo as ações das demais assinaturas"},
    {k:"C",t:"DataActions, limitando as operações ao plano de dados"},
    {k:"D",t:"Atribuir a função em um grupo de gerenciamento acima das duas assinaturas"}
  ],
  ans:["A"],
  why:{
    ok:"AssignableScopes define onde a função personalizada fica disponível para atribuição. Fora desses escopos ela simplesmente não aparece.",
    B:"NotActions subtrai operações da lista de ações. Não tem nenhuma relação com onde a função pode ser atribuída.",
    C:"DataActions trata de operações sobre dados, como ler um blob. Não restringe escopo.",
    D:"Atribuir no grupo de gerenciamento faz a permissão valer para todas as assinaturas abaixo dele, o contrário do pedido."
  },
  src:[{t:"Funções personalizadas do Azure",u:"https://learn.microsoft.com/azure/role-based-access-control/custom-roles"}]
},
{
  id:"104-d1-10", exam:"az104", dom:"d1", lvl:4, type:"single", sec:90, tags:["entra-id"],
  case:"Um consultor de uma empresa parceira precisa administrar recursos de um grupo de recursos por três meses. A empresa dele tem o próprio locatário do Entra ID. A segurança não quer gerenciar senha de quem não é funcionário.",
  stem:"Qual abordagem atende?",
  opts:[
    {k:"A",t:"Criar uma conta de nuvem para ele no seu locatário e atribuir a função no grupo de recursos"},
    {k:"B",t:"Convidá-lo como usuário convidado (B2B) e atribuir a função no grupo de recursos"},
    {k:"C",t:"Gerar uma assinatura de acesso compartilhado com validade de três meses"},
    {k:"D",t:"Sincronizar a conta dele com o Entra Connect"}
  ],
  ans:["B"],
  why:{
    ok:"No B2B ele entra com a credencial da própria empresa, e você só controla o acesso. Quando ele sair da parceira, a conta de origem é desativada lá e o acesso cai junto.",
    A:"Funciona, mas cria exatamente o que a segurança não quer: uma senha de terceiro sob sua gestão.",
    C:"Assinatura de acesso compartilhado vale para armazenamento, não para administrar recursos do Azure.",
    D:"O Entra Connect sincroniza o AD local da sua empresa. Não traz contas de outra organização."
  },
  src:[{t:"Colaboração B2B",u:"https://learn.microsoft.com/entra/external-id/what-is-b2b"}]
},
{
  id:"104-d1-11", exam:"az104", dom:"d1", lvl:5, type:"single", sec:100, tags:["rbac-governanca"],
  case:"A empresa tem 12 assinaturas e cria novas todo trimestre. Uma política que exige marca de centro de custo precisa valer em todas, inclusive nas que ainda vão ser criadas, sem trabalho manual a cada nova assinatura.",
  stem:"Onde a política deve ser atribuída?",
  opts:[
    {k:"A",t:"Em cada assinatura, com um script que roda quando uma assinatura é criada"},
    {k:"B",t:"Em um grupo de gerenciamento que contém as assinaturas, com novas assinaturas criadas sob ele"},
    {k:"C",t:"No grupo de recursos padrão de cada assinatura"},
    {k:"D",t:"No locatário do Entra ID, por meio de acesso condicional"}
  ],
  ans:["B"],
  why:{
    ok:"Atribuições em grupo de gerenciamento são herdadas por tudo que estiver abaixo. Uma assinatura nova colocada sob ele já nasce coberta.",
    A:"Resolve, mas é justamente o trabalho manual que o cenário quer evitar, e falha se o script não rodar.",
    C:"Grupo de recursos é escopo menor que a assinatura. Recursos fora dele ficariam descobertos.",
    D:"Acesso condicional controla login, não as propriedades dos recursos do Azure."
  },
  src:[{t:"Grupos de gerenciamento",u:"https://learn.microsoft.com/azure/governance/management-groups/overview"}]
},
{
  id:"104-d1-12", exam:"az104", dom:"d1", lvl:4, type:"yn", sec:110, tags:["rbac-governanca"],
  stem:"Responda Sim ou Não para cada afirmação sobre marcas (tags) no Azure.",
  rows:[
    {t:"Um recurso herda automaticamente as marcas do grupo de recursos onde está.", a:false,
     e:"Marcas não são herdadas por padrão. Para isso é preciso uma política com efeito Modify, como a de herdar marca do grupo de recursos."},
    {t:"Uma política com efeito Modify pode adicionar a marca do grupo de recursos aos recursos existentes por meio de uma tarefa de correção.", a:true,
     e:"Modify altera recursos novos na criação e, com uma tarefa de correção, também os existentes."},
    {t:"A função Colaborador de Marcas permite alterar marcas de um recurso sem dar acesso ao próprio recurso.", a:true,
     e:"É a função feita para isso: gerenciar marcas sem permissão de alterar a configuração do recurso."},
    {t:"Marcas aplicadas a um grupo de recursos aparecem automaticamente na fatura de cada recurso dele.", a:false,
     e:"A cobrança usa as marcas do recurso. Marca só no grupo de recursos não chega aos itens da fatura, a não ser que seja herdada."}
  ],
  src:[{t:"Marcas de recursos",u:"https://learn.microsoft.com/azure/azure-resource-manager/management/tag-resources"}]
},
{
  id:"104-d1-13", exam:"az104", dom:"d1", lvl:5, type:"multi", sec:110, tags:["entra-id"],
  stem:"A empresa vai habilitar a redefinição de senha por autoatendimento (SSPR). As contas vêm de um AD DS local sincronizado. Quais afirmações estão corretas? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"A SSPR pode ser habilitada apenas para um grupo selecionado, num piloto"},
    {k:"B",t:"Para a nova senha valer no AD DS local, é preciso habilitar o write-back de senha na sincronização"},
    {k:"C",t:"A política de SSPR configurada para os usuários vale também para as contas de administrador"},
    {k:"D",t:"Usuários podem redefinir a senha sem ter registrado nenhum método de autenticação"},
    {k:"E",t:"A SSPR troca a senha no AD DS local mesmo sem nenhuma ferramenta de sincronização"}
  ],
  ans:["A","B"],
  why:{
    ok:"O escopo pode ser Nenhum, Selecionado (um grupo) ou Todos, o que permite começar por um piloto. Em contas sincronizadas, sem write-back a senha nova fica só na nuvem e o login local continua com a antiga.",
    C:"Administradores seguem uma política própria, mais rígida, com dois métodos exigidos. A política dos usuários não se aplica a eles.",
    D:"Sem método registrado não há como provar identidade. A pessoa é levada a registrar os métodos antes.",
    E:"O caminho de volta para o AD local passa pelo Entra Connect ou pelo Cloud Sync com write-back habilitado."
  },
  src:[{t:"Como a SSPR funciona",u:"https://learn.microsoft.com/entra/identity/authentication/concept-sspr-howitworks"}]
},
{
  id:"104-d1-14", exam:"az104", dom:"d1", lvl:4, type:"single", sec:90, tags:["rbac-governanca"],
  case:"A diretoria financeira quer ser avisada por e-mail quando o gasto previsto do mês na assinatura de desenvolvimento passar de 80% de um valor definido, e quer que um runbook desligue as máquinas de teste quando o real passar de 100%.",
  stem:"O que configurar?",
  opts:[
    {k:"A",t:"Um orçamento no Gerenciamento de Custos, com alertas que acionam um grupo de ações"},
    {k:"B",t:"As recomendações de custo do Azure Advisor"},
    {k:"C",t:"O limite de gastos da assinatura"},
    {k:"D",t:"Uma Azure Policy que nega a criação de recursos acima de um custo"}
  ],
  ans:["A"],
  why:{
    ok:"Orçamento aceita limites sobre o gasto real e o previsto e pode acionar grupo de ações, que dispara e-mail e também runbook ou função.",
    B:"O Advisor sugere economias, mas não acompanha um valor definido nem dispara automação.",
    C:"O limite de gastos só existe em ofertas como avaliação gratuita e créditos de assinatura, e desativa a assinatura inteira em vez de agir de forma seletiva.",
    D:"Policy avalia propriedades de recursos, não o valor gasto."
  },
  src:[{t:"Criar e gerenciar orçamentos",u:"https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets"}]
},
{
  id:"104-d1-15", exam:"az104", dom:"d1", lvl:5, type:"single", sec:95, tags:["rbac-governanca"],
  case:"Uma conta de armazenamento será movida do grupo de recursos RG-Antigo para o RG-Novo, na mesma assinatura. Scripts de automação apontam para o recurso pelo identificador completo.",
  stem:"O que acontece com o recurso após a movimentação?",
  opts:[
    {k:"A",t:"O identificador do recurso muda e os scripts precisam ser atualizados"},
    {k:"B",t:"O recurso passa para a região do grupo de recursos de destino"},
    {k:"C",t:"O recurso é recriado e fica indisponível durante a cópia dos dados"},
    {k:"D",t:"As marcas do grupo de destino substituem as marcas do recurso"}
  ],
  ans:["A"],
  why:{
    ok:"O identificador contém o nome do grupo de recursos, então muda. Qualquer automação que use o caminho antigo quebra.",
    B:"A região do recurso não muda. A região do grupo de recursos guarda só os metadados do grupo.",
    C:"A movimentação é uma operação de metadados. O recurso não é recriado e continua no ar.",
    D:"Marcas não são herdadas nem substituídas pela movimentação."
  },
  src:[{t:"Mover recursos",u:"https://learn.microsoft.com/azure/azure-resource-manager/management/move-resource-group-and-subscription"}]
},
/* ---------------- D2 armazenamento ---------------- */
{
  id:"104-d2-08", exam:"az104", dom:"d2", lvl:5, type:"single", sec:100, tags:["armazenamento-redundancia"],
  case:"Um regulador exige que extratos fiquem guardados por sete anos sem possibilidade de alteração ou exclusão, nem pelo administrador da assinatura.",
  stem:"Qual recurso atende?",
  opts:[
    {k:"A",t:"Exclusão reversível de blobs com retenção máxima"},
    {k:"B",t:"Bloqueio ReadOnly na conta de armazenamento"},
    {k:"C",t:"Política de retenção baseada em tempo, em armazenamento imutável, no estado bloqueado"},
    {k:"D",t:"Controle de versão de blobs habilitado"}
  ],
  ans:["C"],
  why:{
    ok:"Armazenamento imutável grava no modelo WORM. Com a política bloqueada, ninguém encurta a retenção nem apaga os blobs antes do prazo, nem o administrador.",
    A:"A exclusão reversível guarda por no máximo 365 dias e pode ser desligada por quem tem permissão.",
    B:"O bloqueio pode ser removido por um Proprietário. Além disso, ele age no plano de gerenciamento e não protege os dados em si.",
    D:"Versões podem ser excluídas por quem tem permissão. Não é garantia contra alteração."
  },
  src:[{t:"Armazenamento imutável",u:"https://learn.microsoft.com/azure/storage/blobs/immutable-storage-overview"}]
},
{
  id:"104-d2-09", exam:"az104", dom:"d2", lvl:4, type:"single", sec:90, tags:["armazenamento-acesso"],
  case:"Toda noite, uma tarefa agendada em um servidor local precisa enviar para um contêiner de blobs só os arquivos novos ou alterados de uma pasta de 2 TB, por linha de comando. O link tem banda suficiente.",
  stem:"Qual ferramenta atende?",
  opts:[
    {k:"A",t:"AzCopy com o comando sync"},
    {k:"B",t:"Azure Storage Explorer"},
    {k:"C",t:"Azure Data Box"},
    {k:"D",t:"Azure File Sync"}
  ],
  ans:["A"],
  why:{
    ok:"O AzCopy roda em script e o sync compara origem e destino, enviando só a diferença. Encaixa em tarefa agendada.",
    B:"É uma interface gráfica para uso manual, não para tarefa noturna.",
    C:"Data Box é envio físico de disco, para quando a rede não dá conta. Não serve para sincronia diária.",
    D:"File Sync sincroniza servidor de arquivos com compartilhamento do Azure Files, não com contêiner de blobs."
  },
  src:[{t:"Introdução ao AzCopy",u:"https://learn.microsoft.com/azure/storage/common/storage-use-azcopy-v10"}]
},
{
  id:"104-d2-10", exam:"az104", dom:"d2", lvl:5, type:"yn", sec:120, tags:["armazenamento-acesso"],
  stem:"Responda Sim ou Não para cada afirmação sobre chaves e assinaturas de acesso compartilhado (SAS).",
  rows:[
    {t:"Regenerar a chave 1 da conta invalida as SAS de conta que foram assinadas com a chave 1.", a:true,
     e:"A SAS de conta e a de serviço são assinadas com a chave. Trocar a chave invalida tudo que foi assinado com ela."},
    {t:"Uma SAS de delegação de usuário é assinada com credenciais do Entra ID, e não com a chave da conta.", a:true,
     e:"Ela usa uma chave de delegação obtida com identidade do Entra ID. É a forma recomendada."},
    {t:"Desabilitar o acesso por chave compartilhada também bloqueia as SAS de delegação de usuário.", a:false,
     e:"Só bloqueia o que depende da chave. A SAS de delegação continua funcionando, por isso combina com essa configuração."},
    {t:"Uma política de acesso armazenada pode ser associada a uma SAS de conta.", a:false,
     e:"Política armazenada vale só para SAS de serviço, criada no nível do contêiner, fila, tabela ou compartilhamento."}
  ],
  src:[{t:"Visão geral de SAS",u:"https://learn.microsoft.com/azure/storage/common/storage-sas-overview"}]
},
{
  id:"104-d2-11", exam:"az104", dom:"d2", lvl:5, type:"single", sec:100, tags:["armazenamento-acesso","rede-virtual"],
  case:"Servidores no escritório, conectados ao Azure por VPN site a site, precisam acessar uma conta de armazenamento por endereço privado. O acesso público da conta deve ficar desligado.",
  stem:"O que configurar?",
  opts:[
    {k:"A",t:"Um ponto de extremidade de serviço na sub-rede do gateway"},
    {k:"B",t:"Um ponto de extremidade privado na rede virtual, com resolução de DNS para o endereço privado"},
    {k:"C",t:"O IP público do escritório no firewall da conta"},
    {k:"D",t:"Uma SAS de delegação de usuário para os servidores"}
  ],
  ans:["B"],
  why:{
    ok:"O ponto de extremidade privado dá à conta um IP da rede virtual, alcançável pela VPN. A resolução de nome precisa apontar para esse IP, ou o tráfego tenta o endpoint público.",
    A:"Ponto de extremidade de serviço vale para tráfego que sai da própria sub-rede no Azure. Não se estende a quem chega pela VPN.",
    C:"Liberar o IP do escritório mantém o acesso público ligado e o tráfego pela internet.",
    D:"SAS é autorização, não caminho de rede. Com acesso público desligado, ela sozinha não chega."
  },
  src:[{t:"Pontos de extremidade privados no armazenamento",u:"https://learn.microsoft.com/azure/storage/common/storage-private-endpoints"}]
},
{
  id:"104-d2-12", exam:"az104", dom:"d2", lvl:5, type:"single", sec:100, tags:["armazenamento-acesso","entra-id"],
  case:"Um compartilhamento do Azure Files já usa autenticação do AD DS local. Usuários do domínio, em máquinas do domínio, precisam ler e gravar arquivos pelo SMB.",
  stem:"Qual função atribuir no nível do compartilhamento?",
  opts:[
    {k:"A",t:"Colaborador da Conta de Armazenamento"},
    {k:"B",t:"Colaborador de Compartilhamento SMB de Dados de Arquivo de Armazenamento"},
    {k:"C",t:"Leitor na conta de armazenamento"},
    {k:"D",t:"Colaborador de Dados de Blob de Armazenamento"}
  ],
  ans:["B"],
  why:{
    ok:"É a função de plano de dados que dá leitura, gravação e exclusão no compartilhamento pelo SMB. As permissões NTFS refinam depois, por pasta e arquivo.",
    A:"Gerencia a conta, no plano de gerenciamento. Não dá acesso aos arquivos pelo SMB.",
    C:"Leitor vê a configuração do recurso, não os arquivos.",
    D:"É uma função de blobs, sem efeito no Azure Files."
  },
  src:[{t:"Permissões no nível do compartilhamento",u:"https://learn.microsoft.com/azure/storage/files/storage-files-identity-assign-share-level-permissions"}]
},
{
  id:"104-d2-13", exam:"az104", dom:"d2", lvl:5, type:"multi", sec:110, tags:["armazenamento-redundancia"],
  stem:"Você vai configurar a replicação de objeto de blobs de uma conta de origem para uma conta de destino. Quais pré-requisitos existem? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Controle de versão de blobs habilitado na origem e no destino"},
    {k:"B",t:"Feed de alterações habilitado na conta de origem"},
    {k:"C",t:"As duas contas na mesma região"},
    {k:"D",t:"Namespace hierárquico habilitado nas duas contas"},
    {k:"E",t:"Uma SAS do contêiner de destino gravada na regra"}
  ],
  ans:["A","B"],
  why:{
    ok:"A replicação lê o feed de alterações da origem e trabalha com versões nas duas pontas. Sem esses dois recursos a regra não é criada.",
    C:"A replicação funciona entre regiões, e esse é um dos principais usos dela.",
    D:"Contas com namespace hierárquico não são suportadas pela replicação de objeto.",
    E:"A replicação usa a própria plataforma, não uma SAS informada pelo usuário."
  },
  src:[{t:"Replicação de objeto",u:"https://learn.microsoft.com/azure/storage/blobs/object-replication-overview"}]
},
/* ---------------- D3 computação ---------------- */
{
  id:"104-d3-09", exam:"az104", dom:"d3", lvl:5, type:"single", sec:100, tags:["vm-disponibilidade"],
  case:"Um conjunto de dimensionamento adiciona uma instância quando a CPU média passa de 70% e remove uma quando cai abaixo de 65%. O número de instâncias fica subindo e descendo a cada poucos minutos.",
  stem:"Qual é a causa e a correção?",
  opts:[
    {k:"A",t:"Os limites estão próximos demais. Aumentar a distância entre eles, por exemplo remover abaixo de 40%"},
    {k:"B",t:"O máximo de instâncias está baixo. Aumentar o máximo"},
    {k:"C",t:"O conjunto não usa zonas. Distribuir as instâncias em zonas"},
    {k:"D",t:"A métrica está errada. Trocar a CPU pela memória"}
  ],
  ans:["A"],
  why:{
    ok:"Ao remover uma instância, a carga das restantes sobe e passa dos 70%, o que dispara outra adição. A margem entre os limites precisa absorver o efeito da própria mudança.",
    B:"O problema não é teto, é oscilação. Um máximo maior não muda o vaivém.",
    C:"Zonas tratam de disponibilidade, não de regra de escala.",
    D:"Qualquer métrica oscila do mesmo jeito se os limites forem próximos."
  },
  src:[{t:"Boas práticas de dimensionamento automático",u:"https://learn.microsoft.com/azure/azure-monitor/autoscale/autoscale-best-practices"}]
},
{
  id:"104-d3-10", exam:"az104", dom:"d3", lvl:4, type:"single", sec:85, tags:["vm-disponibilidade"],
  case:"Você quer mudar uma máquina virtual em execução para um tamanho maior, mas o tamanho desejado não aparece na lista de opções do portal.",
  stem:"O que fazer primeiro?",
  opts:[
    {k:"A",t:"Parar e desalocar a máquina e procurar o tamanho de novo"},
    {k:"B",t:"Reimplantar a máquina pelo comando Redeploy"},
    {k:"C",t:"Mover a máquina para outro grupo de recursos"},
    {k:"D",t:"Excluir a máquina e recriá-la a partir de um instantâneo"}
  ],
  ans:["A"],
  why:{
    ok:"Ligada, a máquina só lista os tamanhos do cluster de hardware onde está. Desalocada, ela pode ir para outro cluster e todos os tamanhos da região aparecem.",
    B:"Reimplantar move para outro host para corrigir problemas, mas não é o caminho para liberar tamanhos.",
    C:"Grupo de recursos é organização lógica. Não muda o hardware disponível.",
    D:"Funciona como último recurso, mas é destrutivo e desnecessário antes de tentar a desalocação."
  },
  src:[{t:"Redimensionar uma VM",u:"https://learn.microsoft.com/azure/virtual-machines/sizes/resize-vm"}]
},
{
  id:"104-d3-11", exam:"az104", dom:"d3", lvl:5, type:"single", sec:95, tags:["app-containers"],
  case:"Um aplicativo no App Service usa um slot de homologação. Na troca de slots, a cadeia de conexão do banco de homologação não pode ir para produção, e a de produção não pode ir para homologação.",
  stem:"Como configurar a cadeia de conexão?",
  opts:[
    {k:"A",t:"Marcá-la como configuração de slot de implantação em cada slot"},
    {k:"B",t:"Defini-la como configuração comum do aplicativo nos dois slots"},
    {k:"C",t:"Gravá-la no arquivo de configuração publicado com o código"},
    {k:"D",t:"Criar dois aplicativos separados em vez de slots"}
  ],
  ans:["A"],
  why:{
    ok:"Configuração marcada como de slot fica presa ao slot e não acompanha o código na troca. É a forma de cada ambiente manter o próprio banco.",
    B:"Configurações comuns viajam com a troca. Homologação iria para produção.",
    C:"Ir no código faz a cadeia acompanhar o pacote, exatamente o que não pode acontecer, e ainda expõe o segredo.",
    D:"Resolve, mas perde a troca sem indisponibilidade, que é o motivo de usar slots."
  },
  src:[{t:"Slots de implantação",u:"https://learn.microsoft.com/azure/app-service/deploy-staging-slots"}]
},
{
  id:"104-d3-12", exam:"az104", dom:"d3", lvl:4, type:"single", sec:90, tags:["app-containers"],
  case:"Antes de aplicar um arquivo Bicep alterado em produção, a equipe quer ver quais recursos serão criados, alterados ou excluídos, sem mudar nada.",
  stem:"Qual operação usar?",
  opts:[
    {k:"A",t:"A operação what-if da implantação"},
    {k:"B",t:"A validação da implantação"},
    {k:"C",t:"A implantação em modo Completo"},
    {k:"D",t:"A exportação do modelo do grupo de recursos"}
  ],
  ans:["A"],
  why:{
    ok:"O what-if compara o modelo com o estado atual e lista cada mudança prevista, sem aplicar nada.",
    B:"A validação verifica se o modelo é aceito, mas não mostra a diferença em relação ao que existe.",
    C:"O modo Completo aplica as mudanças e ainda exclui o que não está no modelo. É o oposto de uma prévia.",
    D:"Exportar mostra o estado atual, não o que vai mudar."
  },
  src:[{t:"Operação what-if",u:"https://learn.microsoft.com/azure/azure-resource-manager/templates/deploy-what-if"}]
},
{
  id:"104-d3-13", exam:"az104", dom:"d3", lvl:4, type:"yn", sec:110, tags:["app-containers"],
  stem:"Responda Sim ou Não para cada afirmação sobre contêineres no Azure.",
  rows:[
    {t:"Contêineres de um mesmo grupo de contêineres do ACI compartilham ciclo de vida, rede e volumes.", a:true,
     e:"O grupo é a unidade do ACI, como um pod. Os contêineres sobem juntos, compartilham o IP e podem montar os mesmos volumes."},
    {t:"O Azure Container Apps pode escalar até zero réplicas quando não há tráfego.", a:true,
     e:"A escala é por regras, inclusive por requisição HTTP ou fila, e o mínimo pode ser zero."},
    {t:"O ACI oferece dimensionamento horizontal automático nativo, por regra de métrica.", a:false,
     e:"O ACI roda grupos isolados. Para escala automática, o caminho é o Container Apps ou o AKS."},
    {t:"O ACI cobra pelos recursos alocados enquanto o grupo de contêineres está em execução.", a:true,
     e:"A cobrança é por segundo de vCPU e memória alocadas, o que serve bem para tarefas curtas."}
  ],
  src:[{t:"Azure Container Instances",u:"https://learn.microsoft.com/azure/container-instances/container-instances-overview"}]
},
{
  id:"104-d3-14", exam:"az104", dom:"d3", lvl:5, type:"order", sec:100, tags:["vm-disponibilidade"],
  stem:"Os discos de uma máquina virtual existente devem passar a usar chave gerenciada pelo cliente. Ordene os passos do PRIMEIRO ao ÚLTIMO.",
  items:[
    {t:"Criar um Key Vault com proteção contra limpeza e gerar a chave"},
    {t:"Criar o conjunto de criptografia de disco apontando para a chave"},
    {t:"Conceder à identidade do conjunto acesso à chave no cofre"},
    {t:"Desalocar a máquina e associar os discos ao conjunto"}
  ],
  e:"O conjunto de criptografia de disco referencia uma chave, então ela tem de existir antes, num cofre com proteção contra limpeza, que é obrigatória. O conjunto ganha uma identidade, e só depois dela receber acesso à chave os discos conseguem usar a criptografia. A troca da chave de um disco em uso exige a máquina desalocada.",
  src:[{t:"Criptografia de disco do lado do servidor",u:"https://learn.microsoft.com/azure/virtual-machines/disk-encryption"}]
},
{
  id:"104-d3-15", exam:"az104", dom:"d3", lvl:4, type:"single", sec:85, tags:["app-containers"],
  case:"Um aplicativo no App Service, num plano da camada Básica, precisa ganhar instâncias automaticamente quando a CPU sobe e perdê-las quando cai.",
  stem:"Qual é a mudança mínima?",
  opts:[
    {k:"A",t:"Mudar o plano para a camada Standard ou superior e criar a regra de escala"},
    {k:"B",t:"Aumentar o tamanho da instância dentro da camada Básica"},
    {k:"C",t:"Habilitar a opção Sempre Ativo"},
    {k:"D",t:"Criar um slot de implantação"}
  ],
  ans:["A"],
  why:{
    ok:"A camada Básica só permite escala manual. Escala automática por regra começa na Standard.",
    B:"Instância maior é escala vertical e não muda com a carga.",
    C:"Sempre Ativo evita que o aplicativo descarregue por inatividade. Não adiciona instâncias.",
    D:"Slot serve para implantação, não para escala."
  },
  src:[{t:"Escalar um aplicativo no App Service",u:"https://learn.microsoft.com/azure/app-service/manage-scale-up"}]
},
/* ---------------- D4 rede virtual ---------------- */
{
  id:"104-d4-07", exam:"az104", dom:"d4", lvl:4, type:"single", sec:85, tags:["rede-virtual"],
  case:"A criação de um gateway de VPN falha. A rede virtual tem uma sub-rede /27 vazia chamada sn-gateway, criada para ele.",
  stem:"Qual é a causa?",
  opts:[
    {k:"A",t:"A sub-rede precisa se chamar GatewaySubnet"},
    {k:"B",t:"A sub-rede precisa ser /29"},
    {k:"C",t:"A sub-rede precisa de um grupo de segurança de rede"},
    {k:"D",t:"O gateway precisa de uma rede virtual exclusiva"}
  ],
  ans:["A"],
  why:{
    ok:"O gateway só é implantado numa sub-rede com o nome exato GatewaySubnet. O tamanho /27 é o recomendado.",
    B:"/29 é pequeno demais para a maioria das configurações. O recomendado é /27 ou maior.",
    C:"Aplicar grupo de segurança na GatewaySubnet não é suportado e pode quebrar o gateway.",
    D:"O gateway fica na mesma rede virtual das cargas, numa sub-rede dedicada."
  },
  src:[{t:"Configurações do gateway de VPN",u:"https://learn.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpn-gateway-settings"}]
},
{
  id:"104-d4-08", exam:"az104", dom:"d4", lvl:5, type:"single", sec:100, tags:["rede-virtual"],
  case:"Uma rede hub tem um gateway de VPN para o escritório. Três redes spoke estão emparelhadas com o hub e precisam alcançar o escritório sem gateway próprio.",
  stem:"Qual configuração do emparelhamento atende?",
  opts:[
    {k:"A",t:"No hub, permitir trânsito de gateway. Em cada spoke, usar gateways remotos"},
    {k:"B",t:"Em cada spoke, permitir trânsito de gateway. No hub, usar gateways remotos"},
    {k:"C",t:"Criar uma rota definida pelo usuário em cada spoke apontando para o hub"},
    {k:"D",t:"Emparelhar as spokes entre si"}
  ],
  ans:["A"],
  why:{
    ok:"Quem tem o gateway permite o trânsito, e quem não tem usa o gateway remoto. Assim as spokes compartilham a VPN do hub.",
    B:"A direção está invertida. As spokes não têm gateway para oferecer.",
    C:"Rota sozinha não basta: sem o trânsito de gateway no emparelhamento, o tráfego não usa o gateway do hub.",
    D:"Emparelhar spokes entre si não as conecta ao escritório."
  },
  src:[{t:"Emparelhamento de redes virtuais",u:"https://learn.microsoft.com/azure/virtual-network/virtual-network-peering-overview"}]
},
{
  id:"104-d4-09", exam:"az104", dom:"d4", lvl:5, type:"yn", sec:120, tags:["rede-virtual"],
  stem:"Responda Sim ou Não para cada afirmação sobre grupos de segurança de rede (NSG) e grupos de segurança de aplicativo (ASG).",
  rows:[
    {t:"Um ASG pode ser usado como origem ou destino em uma regra de NSG.", a:true,
     e:"É para isso que ele existe: escrever regras por função da máquina, como web ou banco, em vez de por endereço IP."},
    {t:"Interfaces de redes virtuais diferentes podem fazer parte do mesmo ASG.", a:false,
     e:"Todas as interfaces de um ASG precisam estar na mesma rede virtual."},
    {t:"Uma regra com prioridade 100 é avaliada antes de uma regra com prioridade 200.", a:true,
     e:"Número menor tem prioridade maior. A primeira regra que combinar decide."},
    {t:"A regra padrão AllowVnetInBound pode ser excluída do NSG.", a:false,
     e:"Regras padrão não podem ser excluídas. Para anulá-las, crie uma regra de prioridade maior."}
  ],
  src:[{t:"Grupos de segurança de aplicativo",u:"https://learn.microsoft.com/azure/virtual-network/application-security-groups"}]
},
{
  id:"104-d4-10", exam:"az104", dom:"d4", lvl:4, type:"single", sec:90, tags:["rede-virtual"],
  case:"Administradores precisam acessar por RDP e SSH máquinas sem IP público, pelo navegador, sem instalar VPN e sem abrir a porta 3389 para a internet.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"Azure Bastion, numa sub-rede chamada AzureBastionSubnet"},
    {k:"B",t:"Acesso just-in-time do Defender for Cloud"},
    {k:"C",t:"Gateway da NAT na sub-rede das máquinas"},
    {k:"D",t:"Regra NAT de entrada num balanceador de carga público"}
  ],
  ans:["A"],
  why:{
    ok:"O Bastion recebe a sessão pelo portal em HTTPS e fala com as máquinas pelo IP privado. Exige uma sub-rede dedicada com esse nome.",
    B:"O just-in-time abre a porta por um tempo, mas ainda exige um caminho público até a máquina.",
    C:"NAT é só para saída. Não recebe conexão de entrada.",
    D:"Expõe a porta de administração na internet, o que o cenário proíbe."
  },
  src:[{t:"Azure Bastion",u:"https://learn.microsoft.com/azure/bastion/bastion-overview"}]
},
{
  id:"104-d4-11", exam:"az104", dom:"d4", lvl:5, type:"single", sec:95, tags:["rede-virtual"],
  case:"Vinte máquinas numa sub-rede chamam uma API externa que só libera IPs cadastrados. Em pico, aparecem falhas por esgotamento de portas de SNAT.",
  stem:"Qual solução resolve as duas questões?",
  opts:[
    {k:"A",t:"Gateway da NAT associado à sub-rede, com IP público estático"},
    {k:"B",t:"Um IP público em cada máquina"},
    {k:"C",t:"Azure Bastion na rede virtual"},
    {k:"D",t:"Um ponto de extremidade privado para a API"}
  ],
  ans:["A"],
  why:{
    ok:"Toda a saída da sub-rede passa a usar o IP fixo do gateway, um só endereço para cadastrar, e o gateway oferece muito mais portas de SNAT.",
    B:"Seriam vinte endereços para cadastrar, e qualquer máquina nova exigiria outro cadastro.",
    C:"O Bastion é para acesso administrativo de entrada, não para saída.",
    D:"Ponto de extremidade privado vale para serviços que oferecem Private Link, não para uma API qualquer na internet."
  },
  src:[{t:"Gateway da NAT",u:"https://learn.microsoft.com/azure/nat-gateway/nat-overview"}]
},
{
  id:"104-d4-12", exam:"az104", dom:"d4", lvl:5, type:"multi", sec:110, tags:["rede-virtual"],
  stem:"Sobre zonas privadas do Azure DNS, quais afirmações estão corretas? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Para resolver nomes da zona, a rede virtual precisa de um vínculo com ela"},
    {k:"B",t:"Com o registro automático ligado no vínculo, as máquinas da rede ganham registros na zona"},
    {k:"C",t:"Uma zona privada pode ser resolvida a partir da internet"},
    {k:"D",t:"Uma rede virtual pode ter registro automático em várias zonas privadas ao mesmo tempo"},
    {k:"E",t:"Zonas privadas exigem um servidor DNS próprio na rede virtual"}
  ],
  ans:["A","B"],
  why:{
    ok:"A rede só enxerga a zona por meio do vínculo, e o registro automático cria e remove os registros das máquinas sozinho.",
    C:"Zona privada só responde às redes vinculadas.",
    D:"Cada rede virtual pode ter registro automático em apenas uma zona privada, embora possa resolver várias.",
    E:"O DNS fornecido pelo Azure já resolve zonas privadas vinculadas."
  },
  src:[{t:"Zonas privadas do Azure DNS",u:"https://learn.microsoft.com/azure/dns/private-dns-overview"}]
},
/* ---------------- D5 monitorar e manter ---------------- */
{
  id:"104-d5-07", exam:"az104", dom:"d5", lvl:5, type:"single", sec:100, tags:["monitorar-recuperar"],
  case:"Máquinas virtuais críticas precisam voltar a funcionar em outra região em poucos minutos se a região principal cair, com perda de dados de poucos minutos.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"Azure Site Recovery com replicação para a região secundária"},
    {k:"B",t:"Azure Backup com restauração entre regiões"},
    {k:"C",t:"Redundância geográfica nos discos gerenciados"},
    {k:"D",t:"Instantâneos diários dos discos copiados para outra região"}
  ],
  ans:["A"],
  why:{
    ok:"O Site Recovery replica continuamente e faz failover orquestrado, com recuperação em minutos e pontos de recuperação frequentes.",
    B:"Backup tem pontos diários ou em poucas horas, e restaurar leva muito mais que minutos.",
    C:"Discos gerenciados não oferecem redundância geográfica. Os tipos são LRS ou ZRS.",
    D:"Perda de até um dia e restauração manual. Não atende nenhum dos dois requisitos."
  },
  src:[{t:"Replicação de VMs com Site Recovery",u:"https://learn.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-enable-replication"}]
},
{
  id:"104-d5-08", exam:"az104", dom:"d5", lvl:4, type:"single", sec:90, tags:["monitorar-recuperar"],
  case:"Toda noite, das 22h às 23h, uma janela de manutenção gera dezenas de alertas. A equipe quer parar de ser notificada nesse horário sem desligar as regras de alerta.",
  stem:"O que configurar?",
  opts:[
    {k:"A",t:"Uma regra de processamento de alertas que suprime as notificações nesse horário"},
    {k:"B",t:"Desabilitar as regras às 22h e reabilitar às 23h com um runbook"},
    {k:"C",t:"Aumentar os limites das regras"},
    {k:"D",t:"Excluir o grupo de ações e recriá-lo depois"}
  ],
  ans:["A"],
  why:{
    ok:"A regra de processamento atua sobre alertas já disparados e pode suprimir ações num agendamento recorrente. As regras continuam avaliando e registrando.",
    B:"Funciona, mas é frágil e perde os registros do período.",
    C:"Mudaria o comportamento o dia inteiro, não só na janela.",
    D:"Trabalhoso, arriscado e afeta todas as regras que usam o grupo."
  },
  src:[{t:"Regras de processamento de alertas",u:"https://learn.microsoft.com/azure/azure-monitor/alerts/alerts-processing-rules"}]
},
{
  id:"104-d5-09", exam:"az104", dom:"d5", lvl:5, type:"single", sec:95, tags:["monitorar-recuperar"],
  case:"Um operador interrompeu a proteção de uma máquina virtual e escolheu excluir os dados de backup. Dez dias depois, descobriu-se que era a máquina errada. O cofre usa as configurações padrão de segurança.",
  stem:"O que é possível fazer?",
  opts:[
    {k:"A",t:"Desfazer a exclusão, porque a exclusão reversível guarda os dados por 14 dias"},
    {k:"B",t:"Nada, porque a exclusão dos dados de backup é imediata"},
    {k:"C",t:"Abrir chamado no suporte para recuperar os dados"},
    {k:"D",t:"Restaurar a partir do backup do próprio cofre"}
  ],
  ans:["A"],
  why:{
    ok:"Por padrão, dados excluídos ficam em estado de exclusão reversível por mais 14 dias, sem custo, e podem ser recuperados. Aos dez dias ainda dá tempo.",
    B:"Com a exclusão reversível ligada, que é o padrão, a exclusão não é imediata.",
    C:"A recuperação está ao alcance do administrador. O suporte não tem outro caminho.",
    D:"O cofre não tem backup de si mesmo. A proteção é a exclusão reversível."
  },
  src:[{t:"Exclusão reversível no Azure Backup",u:"https://learn.microsoft.com/azure/backup/backup-azure-security-feature-cloud"}]
},
{
  id:"104-d5-10", exam:"az104", dom:"d5", lvl:4, type:"order", sec:90, tags:["monitorar-recuperar"],
  stem:"Você quer as 10 máquinas com mais eventos de erro na última hora, no Log Analytics. Ordene os trechos da consulta KQL do PRIMEIRO ao ÚLTIMO.",
  items:[
    {t:"Event"},
    {t:"| where TimeGenerated > ago(1h) and EventLevelName == \"Error\""},
    {t:"| summarize Erros = count() by Computer"},
    {t:"| top 10 by Erros"}
  ],
  e:"KQL começa pela tabela e cada linha recebe o resultado da anterior. Filtrar cedo reduz o volume, agregar transforma eventos em contagem por máquina, e só então dá para ordenar e cortar pela contagem. Colocar o top antes do summarize pegaria 10 eventos, não 10 máquinas.",
  src:[{t:"Visão geral do KQL",u:"https://learn.microsoft.com/kusto/query/"}]
}
];
QUESTIONS_104.push(...QUESTIONS_104C);
