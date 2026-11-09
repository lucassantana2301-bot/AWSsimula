/* ============================================================
   BANCO DE QUESTÕES — AZ-104, domínios 3, 4 e 5
   ============================================================ */
const QUESTIONS_104B = [
/* ---------------- D3 computação ---------------- */
{
  id:"104-d3-01", exam:"az104", dom:"d3", lvl:5, type:"single", sec:110, tags:["vm-disponibilidade"],
  case:"Duas máquinas virtuais já existem em uma região, criadas sem conjunto de disponibilidade. A exigência passou a ser um acordo de nível de serviço de 99,99%.",
  stem:"O que é necessário fazer?",
  opts:[
    {k:"A",t:"Adicionar as duas máquinas existentes a um conjunto de disponibilidade"},
    {k:"B",t:"Recriar as máquinas, cada uma em uma zona de disponibilidade distinta"},
    {k:"C",t:"Trocar todos os discos para SSD Premium"},
    {k:"D",t:"Adicionar as duas máquinas a um conjunto de dimensionamento com orquestração uniforme"}
  ],
  ans:["B"],
  why:{
    ok:"99,99% só vem de zonas de disponibilidade, e nem a zona nem o conjunto de disponibilidade podem ser atribuídos a uma máquina já criada: a associação é definida na criação. A saída é recriar a partir dos discos ou de uma imagem.",
    A:"Além de o conjunto entregar 99,95% e não 99,99%, não é possível adicionar máquina existente a um conjunto de disponibilidade.",
    C:"SSD Premium em todos os discos entrega 99,9% para máquina única, que é menos do que o exigido.",
    D:"O conjunto de dimensionamento também não aceita máquinas pré-existentes, e por si não garante distribuição entre zonas sem ser criado com zonas."
  },
  src:[{t:"SLA de máquinas virtuais",u:"https://learn.microsoft.com/azure/virtual-machines/availability"}]
},
{
  id:"104-d3-02", exam:"az104", dom:"d3", lvl:4, type:"single", sec:90, tags:["vm-disponibilidade"],
  case:"Uma aplicação grava arquivos temporários grandes e precisa do disco mais rápido possível para eles. Os dados não precisam sobreviver a um desligamento.",
  stem:"Onde esses arquivos devem ser gravados?",
  opts:[
    {k:"A",t:"No disco temporário da máquina"},
    {k:"B",t:"Em um disco de dados SSD Premium"},
    {k:"C",t:"No disco do sistema operacional"},
    {k:"D",t:"Em um compartilhamento do Azure Files"}
  ],
  ans:["A"],
  why:{
    ok:"O disco temporário é armazenamento local do host, rápido e já pago com o tamanho da máquina, e seu conteúdo não sobrevive a desalocação, o que combina com o requisito explícito de não precisar persistir.",
    B:"Funciona, mas custa a mais por durabilidade que o enunciado dispensa.",
    C:"Encher o disco do sistema operacional com arquivo temporário é a receita para a máquina parar de iniciar.",
    D:"Compartilhamento de rede é mais lento que disco local e serve ao caso oposto, de acesso compartilhado."
  },
  src:[{t:"Disco temporário",u:"https://learn.microsoft.com/azure/virtual-machines/managed-disks-overview"}]
},
{
  id:"104-d3-03", exam:"az104", dom:"d3", lvl:5, type:"single", sec:105, tags:["app-containers"],
  case:"Uma equipe publica um aplicativo web no App Service na camada Básica. Ela precisa publicar uma nova versão, validá-la com tráfego real e reverter em segundos se der problema.",
  stem:"Qual é a mudança mínima necessária?",
  opts:[
    {k:"A",t:"Nenhuma: a camada Básica já tem slots de implantação"},
    {k:"B",t:"Elevar o plano para a camada Padrão, para ter slots de implantação"},
    {k:"C",t:"Elevar o plano para a camada Isolada, para ter ambiente dedicado"},
    {k:"D",t:"Criar um segundo App Service e alternar manualmente o registro DNS"}
  ],
  ans:["B"],
  why:{
    ok:"Slot de implantação começa na camada Padrão. A troca aquece o destino antes de direcionar tráfego e a troca inversa é imediata, que é a reversão em segundos pedida.",
    A:"A camada Básica tem domínio próprio e certificado, mas não tem slot nem dimensionamento automático.",
    C:"Isolada resolveria, com custo muito acima do necessário. A pergunta pede a mudança mínima.",
    D:"Propagação de DNS leva minutos ou mais, então não entrega reversão em segundos."
  },
  src:[{t:"Slots de implantação",u:"https://learn.microsoft.com/azure/app-service/deploy-staging-slots"}]
},
{
  id:"104-d3-04", exam:"az104", dom:"d3", lvl:5, type:"single", sec:110, tags:["app-containers"],
  case:"Um serviço consome uma fila. Entre 20h e 7h a fila fica vazia e o custo deve cair a zero. Às 14h a fila satura e o serviço precisa escalar para dezenas de instâncias. A equipe não tem ninguém para administrar cluster.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"Azure Container Apps com regra de escala pelo tamanho da fila"},
    {k:"B",t:"Azure Kubernetes Service com dimensionamento automático de pods"},
    {k:"C",t:"Azure Container Instances criado por tarefa agendada"},
    {k:"D",t:"App Service na camada Padrão com dimensionamento automático"}
  ],
  ans:["A"],
  why:{
    ok:"Container Apps escala por evento, inclusive por tamanho de fila, desce a zero quando ninguém chama e não expõe plano de controle para administrar. Atende aos três requisitos ao mesmo tempo.",
    B:"Resolveria tecnicamente e criaria a administração de cluster que o enunciado diz não haver quem faça.",
    C:"Container Instances não escala por regra: cada instância é criada avulsa.",
    D:"App Service escala por métrica de instância, mas o plano continua sendo cobrado: ele não chega a zero."
  },
  src:[{t:"Azure Container Apps",u:"https://learn.microsoft.com/azure/container-apps/overview"}]
},
{
  id:"104-d3-05", exam:"az104", dom:"d3", lvl:4, type:"yn", sec:115, tags:["vm-disponibilidade","app-containers"],
  stem:"Responda Sim ou Não para cada afirmação sobre computação no Azure.",
  rows:[
    {t:"Um disco gerenciado pode ser reduzido de tamanho depois de criado.", a:false,
     e:"Disco gerenciado só cresce. Para diminuir é preciso criar um disco menor e migrar os dados."},
    {t:"Mudar o tamanho de uma máquina pode exigir desalocá-la quando o tamanho alvo pertence a outra família de hardware.", a:true,
     e:"Se o tamanho alvo não está no cluster atual, a máquina precisa ser desalocada para ser realocada em outro hardware."},
    {t:"Um conjunto de disponibilidade protege contra a perda de uma zona de disponibilidade inteira.", a:false,
     e:"O conjunto distribui entre racks dentro de um datacenter. Para falha de zona é preciso zonas de disponibilidade."},
    {t:"A orquestração flexível de um conjunto de dimensionamento aceita instâncias com configurações diferentes entre si.", a:true,
     e:"É justamente o que distingue a flexível da uniforme, que trata as instâncias como idênticas."}
  ],
  src:[{t:"Modos de orquestração",u:"https://learn.microsoft.com/azure/virtual-machines/flexible-virtual-machine-scale-sets"}]
},
{
  id:"104-d3-06", exam:"az104", dom:"d3", lvl:4, type:"single", sec:90, tags:["app-containers"],
  case:"A diretoria quer aplicar as mesmas políticas, marcas e controles de acesso do Azure em trinta servidores que rodam no datacenter próprio e em outra nuvem.",
  stem:"Qual serviço entrega isso?",
  opts:[
    {k:"A",t:"Azure Arc"},
    {k:"B",t:"Azure Migrate"},
    {k:"C",t:"Azure Site Recovery"},
    {k:"D",t:"Azure Lighthouse"}
  ],
  ans:["A"],
  why:{
    ok:"O Arc projeta recursos de fora do Azure para dentro do Resource Manager, e a partir daí valem Policy, RBAC, marcas e Monitor sobre eles, sem migrar nada.",
    B:"Migrate avalia e move cargas para o Azure. O enunciado quer governar onde estão.",
    C:"Site Recovery replica para recuperação de desastre, não governa configuração.",
    D:"Lighthouse serve a parceiro que administra locatários de clientes, que é outro problema."
  },
  src:[{t:"Azure Arc",u:"https://learn.microsoft.com/azure/azure-arc/overview"}]
},
{
  id:"104-d3-07", exam:"az104", dom:"d3", lvl:5, type:"multi", sec:110, tags:["vm-disponibilidade"],
  stem:"Uma máquina virtual precisa ser replicada como modelo para outras dez idênticas. Quais passos pertencem ao processo correto? Escolha as DUAS.",
  opts:[
    {k:"A",t:"Generalizar a máquina antes de capturar a imagem"},
    {k:"B",t:"Capturar a imagem em uma galeria de computação e implantar as novas a partir dela"},
    {k:"C",t:"Copiar o disco do sistema operacional e anexá-lo às dez máquinas simultaneamente"},
    {k:"D",t:"Criar um ponto de restauração do Backup do Azure e restaurá-lo dez vezes"},
    {k:"E",t:"Habilitar o conjunto de disponibilidade antes de capturar a imagem"}
  ],
  ans:["A","B"],
  why:{
    ok:"Generalizar remove identificadores específicos da instância, sem o que as novas máquinas nascem com conflito de identidade. A galeria de computação é o repositório de imagens com versionamento e replicação por região.",
    C:"Um disco gerenciado só pode estar anexado a uma máquina por vez: dez máquinas não compartilham um disco de sistema operacional.",
    D:"Restauração de backup recria a máquina original, não um modelo generalizado para frota.",
    E:"Conjunto de disponibilidade é decisão de implantação das novas máquinas e não faz parte da captura da imagem."
  },
  src:[{t:"Galeria de computação do Azure",u:"https://learn.microsoft.com/azure/virtual-machines/azure-compute-gallery"}]
},
{
  id:"104-d3-08", exam:"az104", dom:"d3", lvl:4, type:"order", sec:85, tags:["vm-disponibilidade"],
  stem:"Ordene as construções do MENOR para o MAIOR acordo de nível de serviço de disponibilidade.",
  items:[
    {t:"Máquina única com discos SSD Standard"},
    {t:"Máquina única com todos os discos em SSD Premium"},
    {t:"Duas ou mais máquinas em um conjunto de disponibilidade"},
    {t:"Duas ou mais máquinas em zonas de disponibilidade distintas"}
  ],
  e:"Máquina única com disco Standard fica abaixo de 99,9%; com todos os discos em SSD Premium chega a 99,9%; o conjunto de disponibilidade entrega 99,95%; e zonas distintas entregam 99,99%. Decorar esta escada resolve qualquer questão que cite um número de disponibilidade exigido pelo negócio.",
  src:[{t:"SLA de máquinas virtuais",u:"https://learn.microsoft.com/azure/virtual-machines/availability"}]
},
/* ---------------- D4 rede ---------------- */
{
  id:"104-d4-01", exam:"az104", dom:"d4", lvl:4, type:"single", sec:85, tags:["rede-virtual"],
  case:"Uma sub-rede foi criada com o prefixo /29.",
  stem:"Quantos endereços ficam disponíveis para seus recursos?",
  opts:[
    {k:"A",t:"8"},
    {k:"B",t:"6"},
    {k:"C",t:"3"},
    {k:"D",t:"5"}
  ],
  ans:["C"],
  why:{
    ok:"Um /29 tem oito endereços e o Azure reserva cinco por sub-rede: o da rede, três para a plataforma e o de difusão. Sobram três.",
    A:"Oito é o total do bloco, antes das reservas.",
    B:"Seis seria a conta de uma rede tradicional, que reserva apenas dois endereços.",
    D:"Cinco é o número de endereços reservados, não o de disponíveis."
  },
  src:[{t:"Sub-redes de rede virtual",u:"https://learn.microsoft.com/azure/virtual-network/virtual-networks-faq"}]
},
{
  id:"104-d4-02", exam:"az104", dom:"d4", lvl:5, type:"single", sec:115, tags:["rede-virtual"],
  case:"A rede A está emparelhada com a rede B, e a rede B está emparelhada com a rede C. Uma máquina na rede A não consegue alcançar uma máquina na rede C, e os grupos de segurança permitem o tráfego.",
  stem:"Qual é a causa e a correção mais direta?",
  opts:[
    {k:"A",t:"O emparelhamento não é transitivo; emparelhar A com C ou habilitar trânsito de gateway em B"},
    {k:"B",t:"Falta uma regra de entrada no grupo de segurança da rede C"},
    {k:"C",t:"Os emparelhamentos precisam estar na mesma região"},
    {k:"D",t:"Falta habilitar o ponto de extremidade de serviço na sub-rede de A"}
  ],
  ans:["A"],
  why:{
    ok:"Emparelhamento liga apenas os dois pares envolvidos e não propaga rota para um terceiro. Para A chegar a C é preciso um emparelhamento direto, ou trânsito de gateway, ou um dispositivo de rede no centro com rotas definidas pelo usuário.",
    B:"O enunciado já afirma que os grupos de segurança permitem o tráfego.",
    C:"Emparelhamento global entre regiões é suportado, então região não é a causa.",
    D:"Ponto de extremidade de serviço serve ao acesso a serviços de PaaS, não à rota entre redes virtuais."
  },
  src:[{t:"Emparelhamento de rede virtual",u:"https://learn.microsoft.com/azure/virtual-network/virtual-network-peering-overview"}]
},
{
  id:"104-d4-03", exam:"az104", dom:"d4", lvl:5, type:"single", sec:110, tags:["rede-virtual"],
  case:"Todo o tráfego de saída de uma sub-rede para a internet deve passar por um dispositivo virtual de rede que faz inspeção.",
  stem:"O que precisa ser configurado?",
  opts:[
    {k:"A",t:"Regra de saída no grupo de segurança da sub-rede apontando para o dispositivo"},
    {k:"B",t:"Tabela de rotas associada à sub-rede, com rota 0.0.0.0/0 e próximo salto no endereço do dispositivo"},
    {k:"C",t:"Grupo de segurança de aplicativo contendo o dispositivo e as máquinas"},
    {k:"D",t:"Ponto de extremidade privado para o dispositivo virtual de rede"}
  ],
  ans:["B"],
  why:{
    ok:"Encaminhar tráfego é trabalho de rota, não de grupo de segurança. A rota definida pelo usuário para 0.0.0.0/0 sobrepõe a rota de sistema para a internet e manda tudo ao dispositivo.",
    A:"Grupo de segurança permite ou nega pacote; ele não decide por onde o pacote sai.",
    C:"Grupo de segurança de aplicativo é apenas um apelido para um conjunto de interfaces nas regras.",
    D:"Ponto de extremidade privado expõe um serviço de PaaS na rede virtual e não redireciona saída."
  },
  src:[{t:"Rotas definidas pelo usuário",u:"https://learn.microsoft.com/azure/virtual-network/virtual-networks-udr-overview"}]
},
{
  id:"104-d4-04", exam:"az104", dom:"d4", lvl:5, type:"single", sec:115, tags:["rede-virtual"],
  case:"Uma aplicação web precisa de balanceamento com inspeção de cabeçalho HTTP, roteamento por caminho de URL e firewall de aplicação web, dentro de uma única região.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"Azure Load Balancer Standard"},
    {k:"B",t:"Azure Application Gateway com WAF"},
    {k:"C",t:"Azure Front Door"},
    {k:"D",t:"Azure Traffic Manager"}
  ],
  ans:["B"],
  why:{
    ok:"Roteamento por caminho de URL e inspeção de cabeçalho são camada 7, e o Application Gateway é o serviço regional de camada 7, com firewall de aplicação web acoplado.",
    A:"Load Balancer opera em camada 4: ele não lê cabeçalho nem caminho de URL.",
    C:"Front Door também é camada 7, mas é global. O enunciado delimita uma única região, e Front Door adicionaria alcance e custo não pedidos.",
    D:"Traffic Manager trabalha por DNS: ele não encerra a conexão, então não inspeciona nada."
  },
  src:[{t:"Application Gateway",u:"https://learn.microsoft.com/azure/application-gateway/overview"}]
},
{
  id:"104-d4-05", exam:"az104", dom:"d4", lvl:5, type:"yn", sec:120, tags:["rede-virtual"],
  stem:"Responda Sim ou Não para cada afirmação sobre grupos de segurança de rede.",
  rows:[
    {t:"Quando há grupo de segurança na sub-rede e na interface de rede, ambos precisam permitir o tráfego de entrada para que ele chegue à máquina.", a:true,
     e:"A entrada é avaliada primeiro na sub-rede e depois na interface. Qualquer negação nas duas camadas encerra o caminho."},
    {t:"Dentro de um grupo de segurança, a avaliação continua depois que uma regra casa com o tráfego.", a:false,
     e:"A primeira regra que casa, por ordem de prioridade, decide e a avaliação para."},
    {t:"Por padrão, uma máquina em uma rede virtual pode iniciar conexões de saída para a internet.", a:true,
     e:"A regra padrão de saída permite internet. A entrada da internet é negada por padrão."},
    {t:"Um grupo de segurança de aplicativo substitui o grupo de segurança de rede.", a:false,
     e:"Ele não contém regras: serve de origem ou destino nomeado dentro das regras do grupo de segurança de rede."}
  ],
  src:[{t:"Grupos de segurança de rede",u:"https://learn.microsoft.com/azure/virtual-network/network-security-groups-overview"}]
},
{
  id:"104-d4-06", exam:"az104", dom:"d4", lvl:4, type:"single", sec:95, tags:["rede-virtual"],
  case:"As máquinas de três redes virtuais emparelhadas precisam se encontrar por nome, sem que ninguém mantenha um servidor DNS e sem registro manual de cada máquina nova.",
  stem:"Qual configuração atende?",
  opts:[
    {k:"A",t:"Zona privada do Azure DNS ligada às três redes, com registro automático habilitado"},
    {k:"B",t:"Zona pública do Azure DNS com registros A para cada máquina"},
    {k:"C",t:"Servidor DNS personalizado em uma máquina virtual do centro"},
    {k:"D",t:"Arquivo hosts distribuído por script em todas as máquinas"}
  ],
  ans:["A"],
  why:{
    ok:"A zona privada responde dentro das redes ligadas a ela, e o registro automático cria e remove o nome da máquina conforme ela nasce e morre, o que elimina os dois trabalhos manuais citados.",
    B:"Zona pública publica nomes na internet e exigiria manter cada registro à mão.",
    C:"Funciona e reintroduz exatamente o servidor DNS que o enunciado quer evitar.",
    D:"Arquivo hosts não escala e quebra a cada máquina nova."
  },
  src:[{t:"Zonas privadas do Azure DNS",u:"https://learn.microsoft.com/azure/dns/private-dns-overview"}]
},
/* ---------------- D5 monitorar e manter ---------------- */
{
  id:"104-d5-01", exam:"az104", dom:"d5", lvl:4, type:"single", sec:95, tags:["monitorar-recuperar"],
  case:"Os logs de um Key Vault não aparecem no espaço de trabalho do Log Analytics, embora as métricas do recurso estejam visíveis no Azure Monitor.",
  stem:"Qual é a causa mais provável?",
  opts:[
    {k:"A",t:"Falta uma configuração de diagnóstico no Key Vault encaminhando os logs ao espaço de trabalho"},
    {k:"B",t:"O espaço de trabalho está em outra região e isso impede a ingestão"},
    {k:"C",t:"Falta instalar o Agente do Azure Monitor no Key Vault"},
    {k:"D",t:"A retenção de 93 dias das métricas expirou"}
  ],
  ans:["A"],
  why:{
    ok:"Métrica de plataforma é coletada sozinha; log de recurso não. É a configuração de diagnóstico, definida por recurso, que encaminha o log para espaço de trabalho, conta de armazenamento ou hub de eventos.",
    B:"Espaço de trabalho em outra região é suportado, com implicação de custo de saída e de residência, não de ingestão.",
    C:"O agente é instalado dentro de máquina virtual. Key Vault é serviço de plataforma e não hospeda agente.",
    D:"A retenção de métricas não tem relação com a ausência de logs, e o enunciado diz que as métricas aparecem."
  },
  src:[{t:"Configurações de diagnóstico",u:"https://learn.microsoft.com/azure/azure-monitor/essentials/diagnostic-settings"}]
},
{
  id:"104-d5-02", exam:"az104", dom:"d5", lvl:5, type:"single", sec:110, tags:["monitorar-recuperar"],
  case:"A auditoria exige dois resultados: aviso em até cinco minutos quando alguém alterar uma regra de grupo de segurança de rede, e consulta a esse histórico por dois anos.",
  stem:"Qual combinação atende aos dois requisitos?",
  opts:[
    {k:"A",t:"Alerta de métrica no grupo de segurança, com retenção padrão do log de atividades"},
    {k:"B",t:"Alerta de log de atividades, mais configuração de diagnóstico exportando o log de atividades com retenção de dois anos"},
    {k:"C",t:"Alerta de pesquisa de log a cada cinco minutos, com retenção padrão do log de atividades"},
    {k:"D",t:"Bloqueio ReadOnly no grupo de segurança e exportação mensal manual"}
  ],
  ans:["B"],
  why:{
    ok:"São dois mecanismos distintos. O alerta de log de atividades dispara na operação de gravação, e a exportação por configuração de diagnóstico é o que permite guardar além dos 90 dias nativos.",
    A:"Alteração de configuração é evento do plano de controle e não produz métrica. E a retenção padrão de 90 dias não cobre dois anos.",
    C:"O alerta funcionaria se o log estivesse sendo ingerido, mas a retenção padrão continua em 90 dias e falha no segundo requisito.",
    D:"Bloqueio impede a alteração em vez de registrá-la, e o enunciado pede registro e aviso, não proibição."
  },
  src:[{t:"Alertas de log de atividades",u:"https://learn.microsoft.com/azure/azure-monitor/alerts/activity-log-alerts"}]
},
{
  id:"104-d5-03", exam:"az104", dom:"d5", lvl:5, type:"multi", sec:110, tags:["monitorar-recuperar"],
  stem:"Um arquivo foi excluído por engano de uma máquina virtual protegida pelo Backup do Azure, e separadamente a diretoria quer poder subir o ambiente inteiro em outra região após um desastre. Quais afirmações são corretas? Escolha as DUAS.",
  opts:[
    {k:"A",t:"A restauração de arquivo individual é feita pelo Backup do Azure, a partir de um ponto de recuperação do cofre"},
    {k:"B",t:"Subir o ambiente em outra região após desastre é o papel do Azure Site Recovery"},
    {k:"C",t:"O Site Recovery também restaura arquivos individuais excluídos por engano"},
    {k:"D",t:"O cofre dos Serviços de Recuperação pode estar em qualquer região, independente da máquina protegida"},
    {k:"E",t:"A exclusão reversível do cofre retém os dados de backup por 90 dias após a exclusão"}
  ],
  ans:["A","B"],
  why:{
    ok:"As duas ferramentas resolvem problemas diferentes: Backup responde por ponto no tempo e restauração granular; Site Recovery responde por replicação contínua e retomada em outra região.",
    C:"Site Recovery replica o estado para failover: ele não oferece catálogo de pontos para restaurar um arquivo.",
    D:"Para backup de máquina virtual, o cofre precisa estar na mesma região da máquina protegida.",
    E:"A exclusão reversível do cofre retém por 14 dias, não 90."
  },
  src:[{t:"Backup do Azure",u:"https://learn.microsoft.com/azure/backup/backup-overview"},
       {t:"Azure Site Recovery",u:"https://learn.microsoft.com/azure/site-recovery/site-recovery-overview"}]
}
,
{
  id:"104-d5-04", exam:"az104", dom:"d5", lvl:4, type:"single", sec:95, tags:["monitorar-recuperar"],
  case:"Uma equipe precisa coletar contadores de desempenho e logs de evento de 40 máquinas virtuais em um espaço de trabalho do Log Analytics.",
  stem:"O que precisa estar no lugar?",
  opts:[
    {k:"A",t:"Agente do Azure Monitor nas máquinas e uma regra de coleta de dados associada a elas"},
    {k:"B",t:"Configuração de diagnóstico em cada máquina virtual"},
    {k:"C",t:"Apenas o espaço de trabalho, porque a coleta de dentro da máquina é automática"},
    {k:"D",t:"Azure Arc em cada máquina virtual"}
  ],
  ans:["A"],
  why:{
    ok:"O que está dentro do sistema operacional convidado precisa de agente, e o que o agente coleta é descrito por uma regra de coleta de dados associada às máquinas.",
    B:"Configuração de diagnóstico encaminha logs da plataforma, não contador de desempenho de dentro do convidado.",
    C:"Nada de dentro da máquina chega sozinho: a plataforma só enxerga métricas do hipervisor para fora.",
    D:"Arc serve a máquinas fora do Azure. Estas já são máquinas virtuais do Azure."
  },
  src:[{t:"Agente do Azure Monitor",u:"https://learn.microsoft.com/azure/azure-monitor/agents/azure-monitor-agent-overview"}]
},
{
  id:"104-d5-05", exam:"az104", dom:"d5", lvl:5, type:"single", sec:105, tags:["monitorar-recuperar","rede-virtual"],
  case:"Uma máquina em uma sub-rede não alcança um serviço na internet. Você quer descobrir se alguma regra está barrando o pacote e, se estiver, qual delas.",
  stem:"Qual ferramenta responde isso diretamente?",
  opts:[
    {k:"A",t:"Verificação de fluxo de IP, no Observador de Rede"},
    {k:"B",t:"Próximo salto, no Observador de Rede"},
    {k:"C",t:"Alerta de métrica sobre bytes de saída da interface"},
    {k:"D",t:"Logs de fluxo do grupo de segurança exportados para uma conta de armazenamento"}
  ],
  ans:["A"],
  why:{
    ok:"A verificação de fluxo de IP recebe origem, destino, porta e protocolo e responde se o tráfego é permitido ou negado, nomeando a regra que decidiu.",
    B:"O próximo salto responde por onde o pacote sai, o que ajuda em problema de rota, não de regra.",
    C:"Métrica mostra que o tráfego caiu, sem dizer qual regra o barrou.",
    D:"Os logs de fluxo registram o que aconteceu e servem a análise posterior; a verificação responde na hora e aponta a regra."
  },
  src:[{t:"Observador de Rede",u:"https://learn.microsoft.com/azure/network-watcher/network-watcher-ip-flow-verify-overview"}]
},
{
  id:"104-d5-06", exam:"az104", dom:"d5", lvl:5, type:"yn", sec:115, tags:["monitorar-recuperar"],
  stem:"Responda Sim ou Não para cada afirmação sobre cópia de segurança e recuperação.",
  rows:[
    {t:"Para proteger uma máquina virtual com o Backup do Azure, o cofre precisa estar na mesma região da máquina.", a:true,
     e:"O cofre dos Serviços de Recuperação protege cargas da própria região."},
    {t:"A exclusão reversível do cofre mantém os dados de backup por 14 dias depois da exclusão.", a:true,
     e:"São 14 dias de retenção adicional, pensados para desfazer exclusão maliciosa ou acidental."},
    {t:"Uma política de backup define com que frequência o ponto de recuperação é criado e por quanto tempo é mantido.", a:true,
     e:"Frequência e retenção são exatamente as duas dimensões da política."},
    {t:"O Azure Site Recovery substitui o Backup do Azure, porque replica continuamente.", a:false,
     e:"Replicação contínua serve a failover regional; ela não guarda catálogo de pontos no tempo para restauração granular."}
  ],
  src:[{t:"Cofres dos Serviços de Recuperação",u:"https://learn.microsoft.com/azure/backup/backup-azure-recovery-services-vault-overview"}]
}
];
const QUESTIONS_104 = QUESTIONS_104A.concat(QUESTIONS_104B);
