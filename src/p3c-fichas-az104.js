/* ============================================================
   FICHAS DE ESTUDO — Azure (AZ-104, Administrator Associate)
   Escrito a partir dos objetivos públicos do exam guide
   (refresh de abril de 2026: Entra ID, Container Apps, Arc).
   Nada aqui reproduz questão real de prova.
   ============================================================ */
const FICHAS_AZ104 = [
{
  id:"f-104-entra", exam:"az104", dom:"d1", mins:6, concept:"entra-id",
  title:"Entra ID: locatário, usuários, grupos e unidades administrativas",
  lead:"O AZ-104 começa onde o AZ-900 parou. Aqui você não descreve identidade, você administra: quem cria, quem convida, quem entra em qual grupo e quem pode mexer em quem.",
  blocks:[
    {t:"h", x:"Locatário não é assinatura"},
    {t:"p", x:"O locatário do Entra ID é o diretório: guarda usuários, grupos e aplicativos. A assinatura é o contêiner de cobrança dos recursos. Um locatário pode ter muitas assinaturas, e cada assinatura confia em exatamente um locatário. Mover uma assinatura entre locatários derruba todas as atribuições de função, porque os identificadores de quem recebia permissão deixam de existir ali."},
    {t:"h", x:"Tipos de usuário"},
    {t:"table", head:["Tipo","Origem","Observação"], rows:[
      ["Membro só na nuvem","Criado no portal, CLI ou PowerShell","A senha vive no Entra ID"],
      ["Membro sincronizado","Vem do Active Directory local via Entra Connect ou Cloud Sync","Edição de atributo acontece na origem, não no Entra"],
      ["Convidado (B2B)","Convite por e-mail para identidade de outro locatário ou conta pessoal","Entra como Guest; permissão de diretório reduzida por padrão"]
    ]},
    {t:"p", x:"Exclusão de usuário vai para a lixeira do diretório e pode ser restaurada em 30 dias. Depois disso, não há volta."},
    {t:"h", x:"Grupos: o que a prova cobra"},
    {t:"table", head:["Decisão","Segurança","Microsoft 365"], rows:[
      ["Serve para","Dar permissão a recursos e funções","Colaboração: caixa compartilhada, site, Teams"],
      ["Membro pode ser","Usuário, dispositivo, principal de serviço, outro grupo","Somente usuário"],
      ["Usar em RBAC do Azure","Sim, é o caminho recomendado","Possível, mas não é o propósito"]
    ]},
    {t:"p", x:"A associação pode ser atribuída à mão ou dinâmica, por regra sobre atributo (por exemplo, department igual a Vendas). Grupo dinâmico depende de licença Entra ID P1, e a regra reavalia sozinha quando o atributo muda: ninguém entra ou sai do grupo manualmente."},
    {t:"h", x:"Unidade administrativa"},
    {t:"p", x:"Serve para limitar o alcance de um administrador a um subconjunto do diretório. Um Administrador de Usuários com escopo na unidade da filial de Recife redefine senha de quem está naquela unidade e de mais ninguém. Também exige P1."},
    {t:"h", x:"Funções do Entra não são funções do Azure"},
    {t:"table", head:["","Funções do Entra ID","RBAC do Azure"], rows:[
      ["Governam","O diretório: usuários, grupos, aplicativos","Recursos: máquinas, redes, contas de armazenamento"],
      ["Exemplos","Administrador Global, Administrador de Usuários","Proprietário, Colaborador, Leitor"],
      ["Escopo","Locatário, unidade administrativa, aplicativo","Grupo de gerenciamento, assinatura, grupo de recursos, recurso"]
    ]},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Entrada no grupo deve seguir atributo do usuário","Grupo dinâmico, com P1"],
      ["Administrador só pode mexer em usuários de uma filial","Unidade administrativa"],
      ["Precisa redefinir senha de todo mundo no diretório","Função do Entra ID, não RBAC"],
      ["Precisa dar acesso a uma conta de armazenamento","RBAC do Azure, não função do Entra"],
      ["Parceiro externo precisa abrir um recurso nosso","Convite B2B, depois RBAC"],
      ["Usuário excluído ontem por engano","Restaurar na lixeira, prazo de 30 dias"]
    ]},
    {t:"trap", x:"Proprietário de assinatura não tem poder nenhum no Entra ID. Ele manda nos recursos, não no diretório. O caminho inverso também vale: Administrador Global não enxerga recursos do Azure até elevar o acesso, e essa elevação é um ato deliberado e auditado, não um estado permanente."},
    {t:"case", q:"Precisamos que todo usuário com cargo de estagiário perca acesso a um conjunto de aplicativos assim que o cargo mudar no RH, que já sincroniza com o Entra ID. Qual a construção?",
      a:"Grupo dinâmico de segurança com regra sobre o atributo jobTitle, usado como alvo da atribuição dos aplicativos. Quando o RH altera o cargo e a sincronização propaga, a regra reavalia e o usuário sai do grupo sozinho, perdendo o acesso sem ninguém tocar em nada. Exige Entra ID P1."}
  ],
  check:["Dizer em uma frase a diferença entre locatário e assinatura","Explicar quando um grupo dinâmico resolve melhor que um grupo atribuído","Separar função do Entra ID de função do RBAC pelo que cada uma governa"],
  src:[{t:"Microsoft Learn: administrar identidades no Entra ID", u:"https://learn.microsoft.com/training/paths/az-104-manage-identities-governance/"}]
},
{
  id:"f-104-rbac", exam:"az104", dom:"d1", mins:7, concept:"rbac-governanca",
  title:"RBAC, Azure Policy e bloqueios: três controles que não se substituem",
  lead:"Esta é a ficha que mais rende ponto no primeiro domínio. A prova adora o cenário em que o Proprietário não consegue fazer algo, e a resposta nunca é RBAC.",
  blocks:[
    {t:"h", x:"Cada um responde uma pergunta diferente"},
    {t:"table", head:["Controle","Pergunta que responde","Quem ele atinge"], rows:[
      ["RBAC","Quem pode executar qual operação","Só quem não tem a função"],
      ["Azure Policy","Qual estado o recurso pode ter","Todos, inclusive Proprietário"],
      ["Bloqueio","Este recurso pode ser alterado ou excluído","Todos, inclusive Proprietário"]
    ]},
    {t:"h", x:"RBAC: as quatro funções que sempre aparecem"},
    {t:"table", head:["Função","Pode","Não pode"], rows:[
      ["Proprietário","Tudo no escopo, incluindo conceder acesso","Furar Policy nem bloqueio"],
      ["Colaborador","Criar, alterar e excluir recursos","Conceder acesso a ninguém"],
      ["Leitor","Ver tudo no escopo","Alterar qualquer coisa"],
      ["Administrador de Acesso de Usuário","Somente gerenciar atribuições de acesso","Mexer nos recursos em si"]
    ]},
    {t:"p", x:"A atribuição é a soma de três coisas: um principal de segurança, uma definição de função e um escopo. O escopo herda para baixo na hierarquia grupo de gerenciamento, assinatura, grupo de recursos, recurso. Permissões são cumulativas: quem é Leitor na assinatura e Colaborador em um grupo de recursos age como Colaborador ali dentro."},
    {t:"p", x:"A exceção é a atribuição de negação, criada por blueprints e por serviços gerenciados: negação vence concessão, sempre, mesmo a do Proprietário."},
    {t:"h", x:"Azure Policy: efeitos que você precisa reconhecer"},
    {t:"table", head:["Efeito","O que faz"], rows:[
      ["Deny","Impede a criação ou a alteração que viola a regra"],
      ["Audit","Deixa passar e marca como não conforme no relatório"],
      ["Append","Acrescenta campo à requisição, como uma marca"],
      ["Modify","Altera ou remove propriedade; aceita tarefa de correção em recurso existente"],
      ["DeployIfNotExists","Implanta o que falta, por exemplo configuração de diagnóstico"]
    ]},
    {t:"p", x:"Policy avalia recursos já existentes e informa conformidade, mas só corrige o passado quando você dispara uma tarefa de correção, e isso só vale para Modify e DeployIfNotExists. Deny nunca apaga o que já existe: apenas barra a próxima gravação."},
    {t:"h", x:"Bloqueios"},
    {t:"table", head:["Tipo","Impede","Permite"], rows:[
      ["CanNotDelete","Excluir","Ler e alterar"],
      ["ReadOnly","Excluir e alterar","Apenas ler"]
    ]},
    {t:"p", x:"O bloqueio herda do escopo pai e o mais restritivo prevalece. Para remover um bloqueio você precisa de Proprietário ou de Administrador de Acesso de Usuário, porque a permissão fica na ação de autorização, não na ação do recurso."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Ninguém pode criar recurso fora da região permitida","Azure Policy com efeito Deny"],
      ["Ninguém pode excluir a conta de armazenamento de produção","Bloqueio CanNotDelete"],
      ["Equipe de auditoria precisa ver tudo sem mexer","Função Leitor no escopo"],
      ["Líder precisa dar acesso aos outros sem gerenciar recursos","Administrador de Acesso de Usuário"],
      ["Toda máquina nova deve nascer com a marca de centro de custo","Policy com Append ou Modify"],
      ["Recursos existentes estão sem a marca obrigatória","Policy com Modify e tarefa de correção"],
      ["Mesma regra em várias assinaturas","Atribuir no grupo de gerenciamento"]
    ]},
    {t:"trap", x:"Dar Colaborador a alguém não permite que essa pessoa conceda acesso a terceiros, e isso é intencional: separar quem opera de quem distribui poder. Quem precisa das duas coisas recebe Proprietário, e aí o certo é restringir o escopo, não promover na assinatura inteira."},
    {t:"case", q:"Um Proprietário da assinatura reclama que não consegue excluir um grupo de recursos. O que verificar, na ordem?",
      a:"Primeiro, bloqueio: CanNotDelete ou ReadOnly no grupo ou herdado da assinatura. Segundo, atribuição de negação, típica de recurso implantado por um serviço gerenciado. Policy não entra aqui, porque Deny barra criação e alteração, não exclusão. Mexer em RBAC não resolve: a pessoa já tem a função máxima."}
  ],
  check:["Dizer qual controle atinge o Proprietário e qual não","Listar os cinco efeitos de Policy e o que cada um faz","Explicar por que Colaborador não concede acesso"],
  src:[{t:"Microsoft Learn: RBAC do Azure", u:"https://learn.microsoft.com/azure/role-based-access-control/overview"},
       {t:"Microsoft Learn: Azure Policy", u:"https://learn.microsoft.com/azure/governance/policy/overview"}]
},
{
  id:"f-104-storage", exam:"az104", dom:"d2", mins:6, concept:"armazenamento-redundancia",
  title:"Conta de armazenamento: redundância e camadas de acesso",
  lead:"Duas tabelas decidem metade do segundo domínio. Decore o que cada sigla replica e para onde, e o que cada camada cobra por guardar e por ler.",
  blocks:[
    {t:"h", x:"Redundância: onde ficam as cópias"},
    {t:"table", head:["Opção","Cópias","Onde","Leitura no secundário"], rows:[
      ["LRS","3","Um único datacenter da região","Não existe secundário"],
      ["ZRS","3","Três zonas de disponibilidade da região","Não existe secundário"],
      ["GRS","6","LRS na primária mais LRS na região emparelhada","Só depois de failover"],
      ["RA-GRS","6","Igual ao GRS","Sim, a qualquer momento"],
      ["GZRS","6","ZRS na primária mais LRS na emparelhada","Só depois de failover"],
      ["RA-GZRS","6","Igual ao GZRS","Sim, a qualquer momento"]
    ]},
    {t:"p", x:"A regra de leitura é o ponto que mais derruba candidato: sem o prefixo RA não há como ler o secundário em operação normal. A cópia geográfica é assíncrona, então uma falha regional pode custar os últimos minutos de escrita."},
    {t:"p", x:"LRS protege contra falha de disco, rack ou servidor. ZRS protege contra perda de um datacenter inteiro dentro da região. Só as opções geográficas protegem contra perda da região."},
    {t:"h", x:"Camadas de acesso"},
    {t:"table", head:["Camada","Custo de guardar","Custo de ler","Permanência mínima"], rows:[
      ["Quente","Mais alto","Mais baixo","Nenhuma"],
      ["Fria","Menor","Maior","30 dias"],
      ["Gelada","Menor ainda","Maior ainda","90 dias"],
      ["Arquivo","Mais baixo","Mais alto, e offline","180 dias"]
    ]},
    {t:"p", x:"Arquivo é a única camada que não serve leitura direta: o blob precisa ser reidratado para quente, fria ou gelada, o que leva horas na prioridade padrão. Arquivo também é definida por blob, nunca como padrão da conta: o padrão da conta aceita quente, fria ou gelada."},
    {t:"p", x:"Sair antes do prazo mínimo gera cobrança de exclusão antecipada, proporcional ao tempo que faltava. É por isso que mover um blob que será lido na semana seguinte para Arquivo sai mais caro que deixá-lo quente."},
    {t:"h", x:"Gerenciamento de ciclo de vida"},
    {t:"p", x:"Regras de ciclo de vida movem ou excluem blobs por idade, sem script: depois de 30 dias sem modificação vai para fria, depois de 180 vai para arquivo, depois de 365 exclui. É a resposta padrão para qualquer enunciado que fale de reduzir custo de dados que envelhecem."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Sobreviver à perda de um datacenter, sem sair da região","ZRS"],
      ["Sobreviver à perda da região","GRS, GZRS ou as versões RA"],
      ["Ler relatório de uma segunda região em operação normal","RA-GRS ou RA-GZRS"],
      ["Menor custo possível, dado nunca lido","Arquivo"],
      ["Dado lido raramente, mas na hora","Fria ou gelada"],
      ["Reduzir custo conforme o dado envelhece, sem script","Regra de ciclo de vida"],
      ["Exigência legal de não deletar por cinco anos","Política de imutabilidade, não camada"]
    ]},
    {t:"trap", x:"Mudar a redundância de LRS para GRS é alteração simples no portal, mas sair de LRS para ZRS é conversão da conta e nem toda combinação de região e tipo aceita. E nenhuma mudança de redundância protege contra exclusão acidental: para isso servem exclusão reversível, controle de versão e bloqueio."},
    {t:"case", q:"Um arquivo de log de 2 TB é consultado diariamente no primeiro mês, uma vez por trimestre no ano seguinte, e depois guardado por cinco anos por exigência de auditoria. Qual configuração?",
      a:"Regra de ciclo de vida em três degraus: nasce quente, vai para fria depois de 30 dias e para arquivo depois de 365. A consulta trimestral no ano dois justifica fria em vez de gelada, porque a permanência mínima de 90 dias da gelada ainda cabe, mas o custo de leitura é maior; se a consulta fosse anual, gelada ganharia. Os cinco anos finais em arquivo, com política de imutabilidade se a auditoria exigir que ninguém possa apagar."}
  ],
  check:["Recitar as seis opções de redundância dizendo onde ficam as cópias","Dizer qual camada exige reidratação e quanto tempo isso leva","Explicar quando a cobrança de exclusão antecipada aparece"],
  src:[{t:"Microsoft Learn: redundância de armazenamento", u:"https://learn.microsoft.com/azure/storage/common/storage-redundancy"},
       {t:"Microsoft Learn: camadas de acesso de blob", u:"https://learn.microsoft.com/azure/storage/blobs/access-tiers-overview"}]
},
{
  id:"f-104-storage-acesso", exam:"az104", dom:"d2", mins:6, concept:"armazenamento-acesso",
  title:"Acesso ao armazenamento: chave, SAS, RBAC de dados e rede",
  lead:"Quatro formas de entrar numa conta de armazenamento, com poderes bem diferentes. O exame descreve um requisito de menor privilégio e espera que você escolha a forma certa.",
  blocks:[
    {t:"h", x:"As quatro formas de autorizar"},
    {t:"table", head:["Forma","Poder","Revogação"], rows:[
      ["Chave de acesso","Tudo na conta, sem granularidade","Girar a chave, o que derruba todo mundo"],
      ["SAS de serviço ou de conta","Recorte por serviço, permissão, prazo e IP","Girar a chave que a assinou ou usar política armazenada"],
      ["SAS de delegação de usuário","Igual, mas assinada por credencial do Entra ID","Revogar a identidade; não depende da chave da conta"],
      ["Entra ID com função de dados","Por identidade, auditável","Remover a atribuição de função"]
    ]},
    {t:"p", x:"Entre as funções de dados estão Leitor de Dados do Blob de Armazenamento e Colaborador de Dados do Blob de Armazenamento. Elas atuam no plano de dados, que é diferente do plano de controle: Colaborador na conta permite ler as chaves e, por esse caminho, chegar aos dados, mas não concede por si leitura de blob via Entra ID. Menor privilégio de verdade é desativar o acesso por chave compartilhada e usar só função de dados."},
    {t:"p", x:"Política de acesso armazenada é o jeito de poder revogar uma SAS individual: o token aponta para a política, e apagar a política invalida o token sem girar a chave da conta."},
    {t:"h", x:"Rede"},
    {t:"table", head:["Recurso","O que faz","Endereço usado"], rows:[
      ["Firewall da conta","Permite só redes e intervalos escolhidos","Público"],
      ["Ponto de extremidade de serviço","Leva o tráfego da sub-rede pelo backbone","Público"],
      ["Ponto de extremidade privado","Cria uma interface de rede na sua sub-rede","Privado da VNet"]
    ]},
    {t:"p", x:"O enunciado que pede endereço privado, resolução por DNS privado e nenhuma exposição pública está pedindo ponto de extremidade privado. Ponto de extremidade de serviço continua usando o nome público da conta."},
    {t:"h", x:"Arquivos, sincronização e cópia"},
    {t:"p", x:"Azure Files entrega compartilhamento SMB ou NFS, com autenticação por Active Directory local ou Entra Domain Services quando o cenário exige identidade de domínio. O Azure File Sync transforma um servidor de arquivos local em cache do compartilhamento na nuvem, com camadas de nuvem liberando espaço em disco."},
    {t:"p", x:"Para mover dados: AzCopy na linha de comando, Storage Explorer na interface, e Azure Data Box quando o volume torna a transferência pela rede inviável."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Parceiro precisa subir arquivo por 48 horas","SAS com prazo e permissão de escrita"],
      ["Precisa revogar o acesso de um parceiro sem afetar os outros","SAS com política de acesso armazenada"],
      ["Aplicação no Azure, sem segredo em configuração","Identidade gerenciada com função de dados"],
      ["Conta não pode ter endereço público","Ponto de extremidade privado"],
      ["Só as máquinas de uma sub-rede podem acessar","Firewall mais ponto de extremidade de serviço"],
      ["Servidor de arquivos local sem espaço em disco","Azure File Sync com camadas de nuvem"],
      ["Migrar 200 TB de uma vez","Data Box"]
    ]},
    {t:"trap", x:"Girar a chave de acesso invalida toda SAS assinada por ela, inclusive as que você esqueceu que existiam. É a razão de existir a SAS de delegação de usuário: ela não depende da chave da conta, então a rotação não derruba integração alheia."},
    {t:"case", q:"Uma função do Azure precisa gravar em um contêiner de blob. A equipe de segurança proibiu segredo em configuração e exige rastro de quem gravou. Como fazer?",
      a:"Identidade gerenciada atribuída à função, com a função de dados Colaborador de Dados do Blob de Armazenamento no escopo daquele contêiner, e acesso por chave compartilhada desativado na conta. Não há segredo para guardar, o escopo é o contêiner e não a conta, e o log de acesso registra a identidade. SAS falharia no requisito de segredo; chave de acesso falharia nos dois."}
  ],
  check:["Dizer qual forma de acesso pode ser revogada individualmente e como","Separar ponto de extremidade de serviço de ponto de extremidade privado pelo endereço","Explicar por que Colaborador na conta não é função de dados"],
  src:[{t:"Microsoft Learn: autorizar acesso a blobs", u:"https://learn.microsoft.com/azure/storage/common/authorize-data-access"},
       {t:"Microsoft Learn: assinaturas de acesso compartilhado", u:"https://learn.microsoft.com/azure/storage/common/storage-sas-overview"}]
}
];
