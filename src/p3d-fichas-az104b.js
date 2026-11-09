/* ============================================================
   FICHAS DE ESTUDO — Azure (AZ-104) — domínios 3, 4 e 5
   ============================================================ */
const FICHAS_AZ104B = [
{
  id:"f-104-vm", exam:"az104", dom:"d3", mins:7, concept:"vm-disponibilidade",
  title:"Máquinas virtuais: tamanho, discos e disponibilidade",
  lead:"O terceiro domínio pesa tanto quanto o primeiro, e quase toda questão dele gira em torno de três decisões: que tamanho, que disco e como não cair.",
  blocks:[
    {t:"h", x:"Famílias de tamanho"},
    {t:"table", head:["Família","Perfil","Quando escolher"], rows:[
      ["Série B","CPU com crédito acumulado","Carga ociosa com pico curto, ambiente de teste"],
      ["Série D","Uso geral, equilíbrio CPU e memória","Servidor de aplicação, padrão de fato"],
      ["Série E","Muita memória por núcleo","Banco de dados, cache, análise em memória"],
      ["Série F","Muita CPU por memória","Processamento em lote, compilação"],
      ["Série L","Disco local rápido e grande","Banco NoSQL, data warehouse"],
      ["Série N","GPU","Treino de modelo, renderização, visualização remota"]
    ]},
    {t:"p", x:"Trocar o tamanho exige que a máquina seja desalocada quando o tamanho alvo vive em outra família de hardware, e o tamanho só aparece na lista se houver capacidade no cluster onde a máquina está. É por isso que uma mudança de tamanho pode falhar mesmo com a assinatura dentro da cota."},
    {t:"h", x:"Discos: três papéis distintos"},
    {t:"table", head:["Disco","Persistente","Observação"], rows:[
      ["Disco do sistema operacional","Sim","Um por máquina, letra C no Windows"],
      ["Disco temporário","Não","Letra D no Windows, perde tudo ao desalocar ou redimensionar"],
      ["Disco de dados","Sim","Vários por máquina, limite pelo tamanho escolhido"]
    ]},
    {t:"p", x:"Os tipos vão de HDD Standard a SSD Standard, SSD Premium e Ultra Disk, em ordem de desempenho e preço. Disco gerenciado só cresce: reduzir tamanho não é operação suportada, a saída é criar um disco menor e copiar. SSD Premium é requisito para o acordo de nível de serviço de máquina única."},
    {t:"h", x:"As três formas de não cair"},
    {t:"table", head:["Construção","Protege contra","SLA"], rows:[
      ["Máquina única com todos os discos em SSD Premium","Nada além de falha de disco","99,9%"],
      ["Conjunto de disponibilidade","Falha de rack e manutenção planejada","99,95%"],
      ["Zonas de disponibilidade","Perda de um datacenter da região","99,99%"]
    ]},
    {t:"p", x:"O conjunto de disponibilidade distribui as máquinas em domínios de falha, que são racks com energia e rede próprias, e em domínios de atualização, que são grupos reiniciados em momentos diferentes na manutenção. Zona é um datacenter independente dentro da região: escolher zonas diferentes é mais forte que escolher domínios de falha diferentes."},
    {t:"p", x:"O conjunto de dimensionamento adiciona e remove instâncias por regra de métrica ou agenda. A orquestração uniforme trata as instâncias como idênticas e descartáveis; a flexível aceita máquinas de configurações diferentes e é a recomendada em implantações novas."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Precisa sobreviver à perda de um datacenter","Zonas de disponibilidade"],
      ["Duas máquinas, não podem reiniciar juntas na manutenção","Conjunto de disponibilidade"],
      ["Carga dobra na sexta e cai no domingo","Conjunto de dimensionamento com regra"],
      ["Dado gravado no disco D desapareceu","É o disco temporário, comportamento esperado"],
      ["Precisa de 99,9% com uma máquina só","Todos os discos em SSD Premium"],
      ["Mudança de tamanho não aparece na lista","Sem capacidade no cluster; desalocar e tentar"],
      ["Disco de dados ficou grande demais","Não reduz; criar menor e migrar os dados"]
    ]},
    {t:"trap", x:"Não existe adicionar uma máquina já criada a um conjunto de disponibilidade: a associação é definida no momento da criação. O caminho é recriar a máquina a partir do disco ou de uma imagem. A mesma lógica vale para mudar a zona de uma máquina existente."},
    {t:"case", q:"Duas máquinas de aplicação atrás de um balanceador precisam de 99,99% e a aplicação não guarda estado em disco local. Qual desenho, e o que muda no balanceador?",
      a:"Uma máquina em cada zona de disponibilidade da região, o que entrega 99,99%, com Balanceador de Carga Standard redundante de zona na frente. O Balanceador Basic não é redundante de zona e está em aposentadoria, então ele sozinho reintroduz o ponto único de falha que o desenho tentou eliminar. Conjunto de disponibilidade pararia em 99,95%."}
  ],
  check:["Dizer qual construção dá cada um dos três acordos de nível de serviço","Explicar a diferença entre domínio de falha e zona","Lembrar o que acontece com o disco temporário ao desalocar"],
  src:[{t:"Microsoft Learn: disponibilidade de máquinas virtuais", u:"https://learn.microsoft.com/azure/virtual-machines/availability"},
       {t:"Microsoft Learn: tipos de disco gerenciado", u:"https://learn.microsoft.com/azure/virtual-machines/disks-types"}]
},
{
  id:"f-104-app", exam:"az104", dom:"d3", mins:6, concept:"app-containers",
  title:"App Service, Container Apps e os vizinhos de contêiner",
  lead:"Depois do refresh de 2026 o domínio de computação cobra contêiner com mais peso. A pergunta é sempre qual serviço entrega o requisito com menos administração.",
  blocks:[
    {t:"h", x:"App Service: o plano decide tudo"},
    {t:"table", head:["Camada","Entrega","Limite que importa"], rows:[
      ["Gratuito e Compartilhado","Hospedagem de teste","Sem domínio próprio com certificado, sem dimensionamento"],
      ["Básico","Domínio próprio, certificado, instâncias manuais","Sem slot de implantação, sem dimensionamento automático"],
      ["Padrão","Slots, dimensionamento automático, backup","Cinco slots"],
      ["Premium","Mais poder, mais slots, rede virtual","Custo"],
      ["Isolado","Ambiente dedicado na sua rede","Custo alto, usado por exigência de isolamento"]
    ]},
    {t:"p", x:"Escalar verticalmente é trocar a camada do plano. Escalar horizontalmente é somar instâncias dentro da camada. Dimensionamento automático começa no Padrão, e é esse detalhe que a prova usa para eliminar alternativas que citam Básico."},
    {t:"p", x:"Slot de implantação hospeda outra versão do aplicativo no mesmo plano. A troca aquece o destino antes de direcionar o tráfego, e a troca inversa é imediata, o que faz dele o mecanismo de reversão mais rápido disponível."},
    {t:"h", x:"Qual serviço de contêiner"},
    {t:"table", head:["Serviço","Para","Não serve para"], rows:[
      ["Instâncias de Contêiner","Um contêiner avulso, tarefa curta, pico isolado","Orquestração, malha de serviços"],
      ["Aplicativos de Contêiner","Microsserviços sem servidor, escala a zero, revisões","Controle fino do plano de controle do Kubernetes"],
      ["Serviço de Kubernetes","Kubernetes completo, com nós que você administra","Quem não quer administrar cluster"]
    ]},
    {t:"p", x:"Aplicativos de Contêiner escalam por evento, inclusive por tamanho de fila, e descem a zero quando ninguém chama, o que muda a conta de custo em carga intermitente. Quem precisa de operador personalizado, CRD ou controle de agendamento vai para Kubernetes."},
    {t:"p", x:"As imagens ficam no Registro de Contêiner do Azure. As camadas são Básica, Padrão e Premium, e a Premium é a que entrega replicação geográfica e ponto de extremidade privado."},
    {t:"h", x:"Azure Arc, em uma frase"},
    {t:"p", x:"Arc projeta servidores, clusters de Kubernetes e serviços de dados que vivem fora do Azure, no local ou em outra nuvem, para dentro do Resource Manager. Com isso valem Policy, RBAC, marcas e Monitor sobre máquinas que não são do Azure. O enunciado que fala de governar servidor local com as mesmas ferramentas está pedindo Arc."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Precisa publicar e reverter em segundos","Slot de implantação, camada Padrão ou acima"],
      ["Precisa dimensionamento automático no App Service","Camada Padrão, no mínimo"],
      ["Tarefa em lote, roda e morre","Instâncias de Contêiner"],
      ["Microsserviço que fica parado à noite","Aplicativos de Contêiner, escala a zero"],
      ["Precisa de operador personalizado do Kubernetes","Serviço de Kubernetes"],
      ["Servidor local sob as políticas do Azure","Azure Arc"],
      ["Registro de imagens replicado em duas regiões","Registro de Contêiner Premium"]
    ]},
    {t:"trap", x:"Camada Básica aparece em muitas alternativas porque já tem domínio próprio e certificado, o que parece suficiente. Ela não tem slot nem dimensionamento automático. Sempre que o enunciado citar reversão rápida ou escala por métrica, Básica está eliminada."},
    {t:"case", q:"Uma API processa uma fila que fica vazia das 20h às 7h e satura às 14h. A equipe tem dois desenvolvedores e nenhum operador de Kubernetes. O que usar?",
      a:"Aplicativos de Contêiner com regra de escala pelo tamanho da fila, descendo a zero fora do horário. Entrega a escala por evento que a carga pede sem nenhum plano de controle para administrar. Kubernetes resolveria tecnicamente e criaria trabalho que a equipe não tem como absorver; Instâncias de Contêiner não escalam por regra; App Service escalaria, mas por métrica de instância e sem chegar a zero."}
  ],
  check:["Dizer em que camada do App Service aparecem slot e dimensionamento automático","Escolher entre os três serviços de contêiner por uma frase de requisito","Explicar em uma frase o que o Arc resolve"],
  src:[{t:"Microsoft Learn: planos do App Service", u:"https://learn.microsoft.com/azure/app-service/overview-hosting-plans"},
       {t:"Microsoft Learn: Azure Container Apps", u:"https://learn.microsoft.com/azure/container-apps/overview"}]
},
{
  id:"f-104-vnet", exam:"az104", dom:"d4", mins:7, concept:"rede-virtual",
  title:"Rede virtual: sub-redes, NSG, emparelhamento e resolução de nomes",
  lead:"Domínio de rede é o que mais tem pegadinha de regra, porque duas construções parecidas se comportam de forma diferente: NSG avalia em dois lugares e emparelhamento não é transitivo.",
  blocks:[
    {t:"h", x:"Endereçamento"},
    {t:"p", x:"A rede virtual tem um espaço de endereços e sub-redes dentro dele. Cada sub-rede perde cinco endereços: o primeiro é o identificador da rede, os três seguintes ficam com a plataforma para gateway e DNS, e o último é o de difusão. Uma sub-rede /29 entrega três endereços úteis, não oito."},
    {t:"p", x:"Espaços de endereços de redes que vão se emparelhar não podem se sobrepor, e isso vale para a rede local quando há VPN ou ExpressRoute. É o primeiro item a verificar em qualquer questão de conectividade híbrida."},
    {t:"h", x:"Grupo de segurança de rede"},
    {t:"p", x:"As regras têm prioridade de 100 a 4096, e a primeira que casa decide: a avaliação para ali. Regras padrão permitem tráfego dentro da rede virtual e saída para a internet, e negam entrada da internet. A regra padrão de menor prioridade é sempre uma negação."},
    {t:"p", x:"O NSG pode ficar na sub-rede, na interface de rede, ou nos dois. Quando há os dois, o tráfego de entrada passa primeiro pelo da sub-rede e depois pelo da interface, e o de saída na ordem inversa: para o pacote chegar, ambos precisam permitir. Grupo de segurança de aplicativo nomeia um conjunto de interfaces para usar como origem ou destino na regra, em vez de listar endereços."},
    {t:"h", x:"Emparelhamento"},
    {t:"table", head:["Propriedade","Comportamento"], rows:[
      ["Transitividade","Não existe: A vê B, B vê C, A não vê C"],
      ["Entre regiões","Suportado, chamado emparelhamento global"],
      ["Trânsito","Só com trânsito de gateway, Virtual WAN ou um dispositivo de rede no centro"],
      ["Sobreposição de endereços","Impede a criação do emparelhamento"]
    ]},
    {t:"h", x:"Rotas e nomes"},
    {t:"p", x:"Rotas do sistema existem sozinhas. A tabela de rotas com rota definida pelo usuário sobrepõe o sistema, e é como se força o tráfego a passar por um firewall: destino 0.0.0.0/0 com próximo salto no dispositivo virtual de rede. Rota mais específica ganha da menos específica."},
    {t:"p", x:"Para nomes: a zona pública do Azure DNS responde na internet; a zona privada responde dentro das redes virtuais ligadas a ela, e o registro automático cria e remove o nome da máquina conforme ela nasce e morre. Ponto de extremidade privado depende de zona privada para que o nome público resolva no endereço interno."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["A fala com B, B fala com C, A não fala com C","Emparelhamento não é transitivo"],
      ["Todo tráfego de saída precisa passar por firewall","Rota definida pelo usuário para 0.0.0.0/0"],
      ["Máquinas devem se achar por nome, sem servidor DNS","Zona privada com registro automático"],
      ["Regra permite e o pacote não chega","Verificar NSG nas duas camadas"],
      ["Agrupar máquinas por papel na regra","Grupo de segurança de aplicativo"],
      ["Emparelhamento recusado na criação","Espaços de endereços sobrepostos"],
      ["Sub-rede /29 só deu três endereços","Cinco reservados por sub-rede"]
    ]},
    {t:"trap", x:"Escolher entre os quatro balanceadores é questão garantida. Balanceador de Carga é camada 4 e regional. Gateway de Aplicativo é camada 7, regional, e é o único com firewall de aplicativo web acoplado. Front Door é camada 7 e global. Gerenciador de Tráfego é global e trabalha por DNS, então ele não vê o pacote: não encerra conexão nem inspeciona conteúdo."},
    {t:"case", q:"Três redes virtuais em um desenho de centro e raio precisam que os dois raios conversem entre si, e todo tráfego de saída passe por um firewall no centro. O que configurar?",
      a:"Emparelhar cada raio com o centro, habilitar trânsito de gateway no centro e uso de gateway remoto nos raios, e em cada raio uma tabela de rotas com 0.0.0.0/0 apontando para o endereço do firewall como dispositivo virtual de rede. Emparelhar os raios diretamente resolveria a conversa entre eles, mas devolveria o tráfego para fora do firewall, que é justamente o que o requisito proíbe."}
  ],
  check:["Dizer quantos endereços uma sub-rede perde e por quê","Explicar a ordem de avaliação do NSG na entrada e na saída","Separar os quatro balanceadores por camada e alcance"],
  src:[{t:"Microsoft Learn: grupos de segurança de rede", u:"https://learn.microsoft.com/azure/virtual-network/network-security-groups-overview"},
       {t:"Microsoft Learn: emparelhamento de rede virtual", u:"https://learn.microsoft.com/azure/virtual-network/virtual-network-peering-overview"}]
},
{
  id:"f-104-monitor", exam:"az104", dom:"d5", mins:6, concept:"monitorar-recuperar",
  title:"Monitorar, alertar e recuperar",
  lead:"O domínio mais leve em peso e o mais fácil de ganhar: são poucas construções, e cada uma tem uma fronteira clara de para que serve.",
  blocks:[
    {t:"h", x:"Métrica e log não são a mesma coisa"},
    {t:"table", head:["","Métricas","Logs"], rows:[
      ["Formato","Série numérica, intervalo fixo","Registro com estrutura, consultado em KQL"],
      ["Onde ficam","Banco de métricas da plataforma","Espaço de trabalho do Log Analytics"],
      ["Retenção padrão","93 dias","Definida no espaço de trabalho"],
      ["Alerta","Alerta de métrica, avaliação rápida e barata","Alerta de pesquisa de log, mais flexível e mais lento"]
    ]},
    {t:"p", x:"Log da plataforma não chega sozinho ao espaço de trabalho: é a configuração de diagnóstico, por recurso, que o encaminha para espaço de trabalho, conta de armazenamento ou hub de eventos. Sem ela você tem métrica e não tem log."},
    {t:"p", x:"Dentro da máquina, quem coleta é o Agente do Azure Monitor, e o que ele coleta é descrito por uma regra de coleta de dados. Os agentes antigos foram aposentados, então qualquer alternativa que cite agente de diagnóstico de versão anterior está desatualizada."},
    {t:"h", x:"Alertas e log de atividades"},
    {t:"p", x:"O alerta tem três partes: alvo, condição e grupo de ações. O grupo de ações é o que dispara e-mail, webhook, função ou runbook, e ele é reutilizável entre alertas. O log de atividades registra operações do plano de controle, quem criou, alterou e excluiu, e guarda 90 dias: para manter mais tempo é preciso exportar por configuração de diagnóstico."},
    {t:"h", x:"Rede e cópia de segurança"},
    {t:"table", head:["Ferramenta","Responde"], rows:[
      ["Observador de Rede, verificação de fluxo de IP","Esta regra permitiu ou negou este pacote"],
      ["Observador de Rede, próximo salto","Para onde este pacote vai sair"],
      ["Backup do Azure","Como volto este arquivo, disco ou banco"],
      ["Azure Site Recovery","Como subo a carga inteira em outra região"]
    ]},
    {t:"p", x:"O Backup do Azure guarda os pontos de recuperação em um cofre, com política que define frequência e retenção, e a exclusão reversível segura o dado por 14 dias depois de uma exclusão. O cofre precisa estar na mesma região da máquina que protege. Site Recovery replica continuamente e serve a desastre, não a arquivo apagado por engano: as duas ferramentas resolvem problemas diferentes e aparecem juntas em alternativas de propósito."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Avisar quando a CPU passar de 80% por 10 minutos","Alerta de métrica"],
      ["Avisar quando aparecer um padrão em texto de log","Alerta de pesquisa de log"],
      ["Avisar quando alguém excluir um recurso","Alerta de log de atividades"],
      ["Log do recurso não aparece no espaço de trabalho","Falta configuração de diagnóstico"],
      ["Guardar o log de atividades por um ano","Exportar; o padrão é 90 dias"],
      ["Pacote está sendo barrado e ninguém sabe por qual regra","Verificação de fluxo de IP"],
      ["Restaurar um arquivo apagado ontem","Backup do Azure"],
      ["Subir o ambiente em outra região após desastre","Site Recovery"]
    ]},
    {t:"trap", x:"Alerta de métrica não consulta log. Se o enunciado descreve uma condição que só existe no texto de um log, a resposta é alerta de pesquisa de log, mesmo que a palavra métrica apareça no cenário. O inverso também cai: usar pesquisa de log para uma condição de CPU funciona, mas é mais lento e mais caro, e por isso não é a melhor resposta."},
    {t:"case", q:"A auditoria exige saber, por dois anos, quem alterou regra de NSG, e exige aviso em até cinco minutos quando isso acontecer. Como atender às duas coisas?",
      a:"São dois mecanismos. Para o aviso, alerta de log de atividades na operação de gravação do grupo de segurança de rede, com grupo de ações apontando para a equipe. Para os dois anos, configuração de diagnóstico exportando o log de atividades para um espaço de trabalho ou conta de armazenamento com a retenção configurada, porque o log nativo só guarda 90 dias. Nenhum dos dois cobre o requisito do outro."}
  ],
  check:["Dizer o que falta quando o log do recurso não chega ao espaço de trabalho","Escolher entre os três tipos de alerta por uma frase de cenário","Separar Backup de Site Recovery pelo problema que cada um resolve"],
  src:[{t:"Microsoft Learn: visão geral do Azure Monitor", u:"https://learn.microsoft.com/azure/azure-monitor/overview"},
       {t:"Microsoft Learn: Backup do Azure", u:"https://learn.microsoft.com/azure/backup/backup-overview"}]
}
];
