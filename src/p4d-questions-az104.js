/* ============================================================
   BANCO DE QUESTÕES — AZ-104, domínios 1 e 2
   Conteúdo original escrito a partir dos objetivos públicos.
   Nível associate: cenário, pegadinha de escopo e menor privilégio.
   ============================================================ */
const QUESTIONS_104A = [
/* ---------------- D1 identidade e governança ---------------- */
{
  id:"104-d1-01", exam:"az104", dom:"d1", lvl:4, type:"single", sec:90, tags:["entra-id","rbac-governanca"],
  case:"Uma analista recebeu a função Proprietário na assinatura de produção. Ela precisa redefinir a senha de um usuário do Entra ID que perdeu o acesso.",
  stem:"O que acontece quando ela tenta redefinir a senha?",
  opts:[
    {k:"A",t:"Funciona, porque Proprietário é a função mais alta da assinatura"},
    {k:"B",t:"Falha, porque redefinir senha é função do Entra ID e não do RBAC do Azure"},
    {k:"C",t:"Funciona apenas se o usuário estiver na mesma assinatura"},
    {k:"D",t:"Falha, porque falta o bloqueio ReadOnly ser removido do locatário"}
  ],
  ans:["B"],
  why:{
    ok:"RBAC do Azure governa recursos; o diretório é governado pelas funções do Entra ID. Redefinir senha exige Administrador de Senha, Administrador de Usuários ou Administrador Global, e nenhuma delas vem junto com Proprietário.",
    A:"Proprietário é a função máxima no plano de recursos, que não inclui o diretório. São dois sistemas de permissão separados.",
    C:"Usuário não pertence a assinatura: ele pertence ao locatário. A assinatura contém recursos.",
    D:"Bloqueio atua sobre recursos do Azure e não existe sobre o locatário do Entra ID."
  },
  src:[{t:"Funções do Entra ID e RBAC",u:"https://learn.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles"}]
},
{
  id:"104-d1-02", exam:"az104", dom:"d1", lvl:5, type:"single", sec:110, tags:["rbac-governanca"],
  case:"Você precisa que a equipe de suporte possa criar e excluir máquinas virtuais no grupo de recursos rg-dev, mas nunca conceder acesso a outras pessoas. A equipe também precisa ver, sem alterar, todos os recursos da assinatura.",
  stem:"Qual conjunto de atribuições atende com o menor privilégio?",
  opts:[
    {k:"A",t:"Proprietário em rg-dev e Leitor na assinatura"},
    {k:"B",t:"Colaborador em rg-dev e Leitor na assinatura"},
    {k:"C",t:"Colaborador na assinatura e Leitor em rg-dev"},
    {k:"D",t:"Administrador de Acesso de Usuário em rg-dev e Leitor na assinatura"}
  ],
  ans:["B"],
  why:{
    ok:"Colaborador cria e exclui recursos e explicitamente não concede acesso, que é o requisito. Leitor na assinatura cobre a visão de leitura, e permissões são cumulativas, então dentro de rg-dev vale a mais permissiva.",
    A:"Proprietário concede acesso a terceiros, exatamente o que o enunciado proíbe.",
    C:"Colaborador na assinatura daria poder de alteração em toda a assinatura, não só em rg-dev. Leitor em rg-dev não reduz nada, porque permissões somam.",
    D:"Administrador de Acesso de Usuário só gerencia atribuições de acesso e não cria máquina nenhuma. É o oposto do requisito."
  },
  src:[{t:"Funções internas do Azure",u:"https://learn.microsoft.com/azure/role-based-access-control/built-in-roles"}]
},
{
  id:"104-d1-03", exam:"az104", dom:"d1", lvl:5, type:"yn", sec:120, tags:["rbac-governanca"],
  stem:"Responda Sim ou Não para cada afirmação sobre Azure Policy, RBAC e bloqueios.",
  rows:[
    {t:"Uma política com efeito Deny impede que um Proprietário da assinatura crie um recurso que viole a regra.", a:true,
     e:"Policy atua sobre a requisição, não sobre a identidade. Nenhuma função fura uma política de negação."},
    {t:"Atribuir uma política com efeito Deny exclui automaticamente os recursos existentes que já violam a regra.", a:false,
     e:"Deny só barra gravações futuras. Os recursos existentes aparecem como não conformes e continuam existindo."},
    {t:"Um bloqueio CanNotDelete permite alterar as configurações do recurso.", a:true,
     e:"CanNotDelete impede exclusão e permite leitura e alteração. Quem impede alteração é o ReadOnly."},
    {t:"Para remover um bloqueio basta ter a função Colaborador no escopo.", a:false,
     e:"A permissão de bloqueio fica nas ações de autorização, que Colaborador não tem. É preciso Proprietário ou Administrador de Acesso de Usuário."}
  ],
  src:[{t:"Bloqueios de recurso",u:"https://learn.microsoft.com/azure/azure-resource-manager/management/lock-resources"}]
},
{
  id:"104-d1-04", exam:"az104", dom:"d1", lvl:4, type:"single", sec:95, tags:["entra-id"],
  case:"A diretoria exige que todo usuário cujo atributo department seja Vendas tenha acesso a um aplicativo, e que o acesso seja retirado automaticamente quando a pessoa mudar de área. O atributo chega pelo RH via sincronização.",
  stem:"Qual construção atende sem intervenção manual?",
  opts:[
    {k:"A",t:"Grupo de segurança com associação atribuída, revisado mensalmente"},
    {k:"B",t:"Grupo de segurança com associação dinâmica, com regra sobre o atributo department"},
    {k:"C",t:"Unidade administrativa contendo os usuários de Vendas"},
    {k:"D",t:"Grupo do Microsoft 365 com proprietário na gerência de Vendas"}
  ],
  ans:["B"],
  why:{
    ok:"A regra dinâmica reavalia quando o atributo muda e remove o usuário sem ninguém agir. É o único mecanismo da lista que reage a mudança de atributo. Exige licença Entra ID P1.",
    A:"Associação atribuída depende de alguém lembrar de remover, e o enunciado pede automatismo.",
    C:"Unidade administrativa limita o alcance de um administrador sobre usuários. Ela não concede acesso a aplicativo.",
    D:"Grupo do Microsoft 365 serve a colaboração e também dependeria de alguém remover o membro."
  },
  src:[{t:"Grupos dinâmicos",u:"https://learn.microsoft.com/entra/identity/users/groups-dynamic-membership"}]
},
{
  id:"104-d1-05", exam:"az104", dom:"d1", lvl:5, type:"single", sec:110, tags:["rbac-governanca"],
  case:"Trezentas máquinas virtuais existentes estão sem a marca centro-de-custo, obrigatória por auditoria. Toda máquina nova precisa nascer com a marca, e as existentes precisam ser corrigidas sem que ninguém abra uma por uma.",
  stem:"Qual configuração de Azure Policy resolve as duas exigências?",
  opts:[
    {k:"A",t:"Efeito Deny, atribuído no grupo de gerenciamento"},
    {k:"B",t:"Efeito Audit, com relatório semanal para os donos dos recursos"},
    {k:"C",t:"Efeito Modify, com identidade gerenciada e tarefa de correção"},
    {k:"D",t:"Efeito DeployIfNotExists, apontando para um modelo que recria as máquinas com a marca"}
  ],
  ans:["C"],
  why:{
    ok:"Modify acrescenta ou altera a marca nas gravações futuras e, por aceitar tarefa de correção, aplica a marca retroativamente nos trezentos recursos existentes. A identidade gerenciada é o que dá à política permissão de escrever.",
    A:"Deny impediria a criação sem marca, mas não corrige nada do que já existe.",
    B:"Audit apenas relata. O enunciado pede correção, não visibilidade.",
    D:"DeployIfNotExists implanta recurso que falta, e não serve para alterar marca; recriar trezentas máquinas é desproporcional e não foi pedido."
  },
  src:[{t:"Correção de recursos não conformes",u:"https://learn.microsoft.com/azure/governance/policy/how-to/remediate-resources"}]
},
{
  id:"104-d1-06", exam:"az104", dom:"d1", lvl:4, type:"multi", sec:110, tags:["entra-id","rbac-governanca"],
  stem:"Uma assinatura foi transferida de um locatário do Entra ID para outro. Quais consequências são esperadas? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"As atribuições de função do RBAC existentes são removidas"},
    {k:"B",t:"Os recursos da assinatura são excluídos e precisam ser recriados"},
    {k:"C",t:"As identidades gerenciadas atribuídas pelo sistema precisam ser recriadas"},
    {k:"D",t:"As políticas do Azure atribuídas no grupo de recursos continuam valendo sem ajuste"},
    {k:"E",t:"O identificador da assinatura muda"}
  ],
  ans:["A","C"],
  why:{
    ok:"As atribuições apontam para principais do locatário antigo, que deixam de existir no novo, então caem. Identidades gerenciadas vivem no diretório e precisam ser recriadas e reautorizadas.",
    B:"Os recursos permanecem. A transferência muda o diretório de confiança, não o conteúdo da assinatura.",
    D:"As atribuições de política também são afetadas quando dependem de identidade gerenciada, e precisam ser revistas.",
    E:"O identificador da assinatura é preservado na transferência."
  },
  src:[{t:"Transferir assinatura entre locatários",u:"https://learn.microsoft.com/azure/role-based-access-control/transfer-subscription"}]
},
{
  id:"104-d1-07", exam:"az104", dom:"d1", lvl:5, type:"order", sec:90, tags:["rbac-governanca"],
  stem:"Uma gravação de recurso é avaliada por vários controles. Ordene do controle que é avaliado PRIMEIRO ao que é avaliado por ÚLTIMO.",
  items:[
    {t:"Autenticação: a identidade é válida no locatário"},
    {t:"Atribuição de negação: existe negação explícita no escopo"},
    {t:"RBAC: a função concede a ação pedida"},
    {t:"Azure Policy: o estado do recurso respeita as regras"}
  ],
  e:"Sem identidade válida nada prossegue. Em seguida o Resource Manager resolve autorização, e dentro dela a negação explícita vence qualquer concessão, por isso é avaliada antes do RBAC. Só depois de autorizado o pedido é confrontado com as políticas, que podem barrar a gravação mesmo de quem tinha permissão. Entender esta ordem explica por que um Proprietário recebe erro de política e não erro de permissão.",
  src:[{t:"Atribuições de negação",u:"https://learn.microsoft.com/azure/role-based-access-control/deny-assignments"}]
},
{
  id:"104-d1-08", exam:"az104", dom:"d1", lvl:5, type:"single", sec:105, tags:["entra-id"],
  case:"Um administrador de uma filial deve poder redefinir senha e gerenciar apenas os usuários daquela filial. A empresa tem licença Entra ID P1.",
  stem:"Qual abordagem entrega esse recorte?",
  opts:[
    {k:"A",t:"Função Administrador de Usuários atribuída no locatário inteiro"},
    {k:"B",t:"Função Administrador de Usuários com escopo em uma unidade administrativa que contém os usuários da filial"},
    {k:"C",t:"Função Colaborador no grupo de recursos da filial"},
    {k:"D",t:"Grupo dinâmico dos usuários da filial, com o administrador como proprietário do grupo"}
  ],
  ans:["B"],
  why:{
    ok:"A unidade administrativa é a construção do Entra ID feita para reduzir o escopo de uma função de diretório a um subconjunto de objetos. É exatamente o cenário descrito, e a licença P1 citada é o pré-requisito.",
    A:"Atribuir no locatário entrega poder sobre todos os usuários da empresa, não só os da filial.",
    C:"Colaborador é RBAC do Azure e não gerencia usuário nenhum.",
    D:"Proprietário de grupo administra a associação do grupo, não redefine senha dos membros."
  },
  src:[{t:"Unidades administrativas",u:"https://learn.microsoft.com/entra/identity/role-based-access-control/administrative-units"}]
},
/* ---------------- D2 armazenamento ---------------- */
{
  id:"104-d2-01", exam:"az104", dom:"d2", lvl:4, type:"single", sec:95, tags:["armazenamento-redundancia"],
  case:"Uma equipe de relatórios precisa ler os dados de uma conta de armazenamento a partir de uma segunda região, em operação normal, para não competir com a carga de produção.",
  stem:"Qual opção de redundância atende?",
  opts:[
    {k:"A",t:"GRS"},
    {k:"B",t:"RA-GRS"},
    {k:"C",t:"ZRS"},
    {k:"D",t:"LRS com uma cópia manual agendada"}
  ],
  ans:["B"],
  why:{
    ok:"Só as opções com o prefixo de acesso de leitura expõem o ponto de extremidade secundário em operação normal. RA-GRS entrega isso com a cópia na região emparelhada.",
    A:"GRS mantém a cópia geográfica, mas o secundário só fica legível depois de um failover.",
    C:"ZRS replica entre zonas da mesma região, então não há segunda região para ler.",
    D:"Resolveria com script, duplicando custo e criando defasagem própria, quando a plataforma já oferece a função."
  },
  src:[{t:"Redundância de armazenamento",u:"https://learn.microsoft.com/azure/storage/common/storage-redundancy"}]
},
{
  id:"104-d2-02", exam:"az104", dom:"d2", lvl:5, type:"single", sec:115, tags:["armazenamento-redundancia"],
  case:"Um conjunto de blobs será lido com frequência nos primeiros 30 dias, depois quase nunca, e deve ser mantido por sete anos por exigência fiscal. O objetivo declarado é o menor custo total.",
  stem:"Qual configuração atende?",
  opts:[
    {k:"A",t:"Deixar tudo na camada quente e aplicar bloqueio CanNotDelete"},
    {k:"B",t:"Mover para Arquivo no dia 1 por regra de ciclo de vida"},
    {k:"C",t:"Regra de ciclo de vida: fria após 30 dias, Arquivo após 180 dias"},
    {k:"D",t:"Mover para a camada gelada no dia 1 e manter lá por sete anos"}
  ],
  ans:["C"],
  why:{
    ok:"Os 30 dias de leitura frequente pedem a camada quente no início. Depois, fria cobre a transição e Arquivo entrega o menor custo de guarda para o longo prazo, que é onde estão quase todos os sete anos.",
    A:"Quente é a camada mais cara para guardar, e a maior parte do período não tem leitura. Bloqueio não tem relação com custo.",
    B:"Mover no dia 1 para Arquivo implica reidratar a cada leitura durante o primeiro mês, com custo e espera de horas, além do risco de exclusão antecipada.",
    D:"Gelada tem custo de guarda maior que Arquivo e o cenário não pede leitura imediata depois do primeiro mês."
  },
  src:[{t:"Gerenciamento de ciclo de vida",u:"https://learn.microsoft.com/azure/storage/blobs/lifecycle-management-overview"}]
},
{
  id:"104-d2-03", exam:"az104", dom:"d2", lvl:5, type:"single", sec:115, tags:["armazenamento-acesso"],
  case:"Um parceiro precisa enviar arquivos para um contêiner por 15 dias. A segurança exige poder revogar esse acesso isoladamente, sem afetar outras integrações que usam a mesma conta.",
  stem:"Qual mecanismo atende?",
  opts:[
    {k:"A",t:"Entregar a chave de acesso primária e girá-la ao final"},
    {k:"B",t:"SAS de serviço vinculada a uma política de acesso armazenada no contêiner"},
    {k:"C",t:"SAS de serviço com prazo de 15 dias, sem política armazenada"},
    {k:"D",t:"Função Colaborador na conta de armazenamento para a conta do parceiro"}
  ],
  ans:["B"],
  why:{
    ok:"A política de acesso armazenada é o único caminho para revogar uma SAS individual: apagar ou alterar a política invalida o token sem tocar na chave da conta, preservando as outras integrações.",
    A:"Girar a chave derruba toda SAS assinada por ela, inclusive as integrações que o enunciado manda preservar.",
    C:"Sem política armazenada, a única forma de revogar antes do prazo é girar a chave, que é o efeito proibido.",
    D:"Colaborador é permissão de plano de controle e dá poder muito maior do que enviar arquivo a um contêiner."
  },
  src:[{t:"Políticas de acesso armazenadas",u:"https://learn.microsoft.com/rest/api/storageservices/define-stored-access-policy"}]
},
{
  id:"104-d2-04", exam:"az104", dom:"d2", lvl:5, type:"yn", sec:120, tags:["armazenamento-acesso"],
  stem:"Responda Sim ou Não para cada afirmação sobre acesso a uma conta de armazenamento.",
  rows:[
    {t:"A função Colaborador na conta de armazenamento concede, por si, permissão de leitura de blob pelo Entra ID.", a:false,
     e:"Leitura de dados exige função de plano de dados, como Leitor de Dados do Blob de Armazenamento. Colaborador permite ler as chaves, o que é outro caminho."},
    {t:"Um ponto de extremidade privado dá à conta de armazenamento um endereço privado dentro da rede virtual.", a:true,
     e:"O ponto de extremidade privado cria uma interface de rede na sua sub-rede, com endereço do espaço da rede virtual."},
    {t:"Um ponto de extremidade de serviço faz a conta de armazenamento deixar de ter endereço público.", a:false,
     e:"Ele apenas direciona o tráfego da sub-rede pelo backbone; o nome e o endereço da conta continuam públicos."},
    {t:"Desativar o acesso por chave compartilhada obriga todo acesso a usar identidade do Entra ID.", a:true,
     e:"Desativada a chave, caem as SAS assinadas por ela e resta a autorização por identidade, com função de dados."}
  ],
  src:[{t:"Autorizar acesso a dados",u:"https://learn.microsoft.com/azure/storage/common/authorize-data-access"}]
},
{
  id:"104-d2-05", exam:"az104", dom:"d2", lvl:4, type:"single", sec:95, tags:["armazenamento-acesso"],
  case:"Um servidor de arquivos no escritório está sem espaço em disco. Os usuários precisam continuar acessando os arquivos pelos mesmos caminhos de rede, e os arquivos pouco usados devem passar a viver na nuvem.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"Azure File Sync com camadas de nuvem"},
    {k:"B",t:"AzCopy em tarefa agendada para um contêiner de blob"},
    {k:"C",t:"Azure Data Box"},
    {k:"D",t:"Azure Backup do servidor de arquivos"}
  ],
  ans:["A"],
  why:{
    ok:"O File Sync transforma o servidor em cache do compartilhamento na nuvem. As camadas de nuvem liberam espaço local mantendo o arquivo acessível pelo mesmo caminho, que é exatamente o requisito duplo do enunciado.",
    B:"AzCopy copia; ele não mantém o caminho de rede nem libera espaço de forma transparente.",
    C:"Data Box é transferência física em massa, não sincronização contínua.",
    D:"Backup protege contra perda; ele não libera espaço no disco de produção."
  },
  src:[{t:"Azure File Sync",u:"https://learn.microsoft.com/azure/storage/file-sync/file-sync-introduction"}]
},
{
  id:"104-d2-06", exam:"az104", dom:"d2", lvl:5, type:"multi", sec:115, tags:["armazenamento-redundancia"],
  stem:"Uma conta de armazenamento está em LRS e a exigência passou a ser sobreviver à perda de um datacenter dentro da região, sem mudar de região. Quais afirmações são corretas? Escolha as DUAS.",
  opts:[
    {k:"A",t:"ZRS atende, porque distribui as três cópias em zonas distintas da região"},
    {k:"B",t:"A mudança de LRS para ZRS pode exigir conversão da conta e não está disponível em toda combinação de região e tipo de conta"},
    {k:"C",t:"GRS atende melhor, porque protege contra perda de datacenter dentro da região"},
    {k:"D",t:"A mudança de redundância protege contra exclusão acidental de blob"},
    {k:"E",t:"LRS já protege contra perda de datacenter, porque mantém três cópias"}
  ],
  ans:["A","B"],
  why:{
    ok:"ZRS é a opção desenhada para falha de zona, que é a falha de um datacenter da região. E a migração a partir de LRS é uma conversão, com restrições de região e tipo de conta que precisam ser verificadas antes.",
    C:"GRS protege contra perda da região inteira, mas sua primária continua sendo LRS: dentro da região ele não protege contra falha de zona.",
    D:"Redundância protege contra falha de infraestrutura. Contra exclusão servem exclusão reversível, controle de versão e bloqueio.",
    E:"As três cópias do LRS ficam no mesmo datacenter, então a falha dele derruba todas."
  },
  src:[{t:"Alterar a redundância",u:"https://learn.microsoft.com/azure/storage/common/redundancy-migration"}]
},
{
  id:"104-d2-07", exam:"az104", dom:"d2", lvl:4, type:"order", sec:85, tags:["armazenamento-redundancia"],
  stem:"Ordene as camadas de acesso de blob do MENOR para o MAIOR custo de armazenamento por gigabyte.",
  items:[
    {t:"Arquivo"},
    {t:"Gelada"},
    {t:"Fria"},
    {t:"Quente"}
  ],
  e:"O custo de guardar cai de quente para arquivo, e o custo de ler sobe na mesma direção. A ordem é quente, fria, gelada e arquivo em custo de guarda decrescente, com permanências mínimas de nenhuma, 30, 90 e 180 dias. Trocar a ordem de fria e gelada é o erro mais comum, porque a camada gelada é mais nova que as outras três.",
  src:[{t:"Camadas de acesso",u:"https://learn.microsoft.com/azure/storage/blobs/access-tiers-overview"}]
}
];
