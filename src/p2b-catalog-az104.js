/* ============================================================
   AULAS E DIAGRAMAS — AZ-104
   Mesmo roteiro das demais: gancho, analogia, diagrama, pegadinha, quiz.
   ============================================================ */
Object.assign(DIAGRAMS, {
gov104: `<svg class="diag" viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg">
    <text class="dp" style="animation-delay:.05s" x="260" y="16" fill="#9aa8c4" font-size="11" text-anchor="middle">três controles, três perguntas diferentes</text>
    <g class="dp" style="animation-delay:.2s">
      <rect x="18" y="32" width="150" height="196" rx="4" fill="none" stroke="#3b9dff" stroke-dasharray="4 3"/>
      <text x="93" y="50" fill="#8dc8ff" font-size="11" text-anchor="middle">RBAC</text>
      <text x="93" y="66" fill="#9aa8c4" font-size="9" text-anchor="middle">quem pode agir</text>
      <rect x="32" y="78" width="122" height="24" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="93" y="94" fill="#e8edf7" font-size="9" text-anchor="middle">grupo de gerenciamento</text>
      <rect x="40" y="110" width="106" height="24" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="93" y="126" fill="#e8edf7" font-size="9" text-anchor="middle">assinatura</text>
      <rect x="48" y="142" width="90" height="24" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="93" y="158" fill="#e8edf7" font-size="9" text-anchor="middle">grupo de recursos</text>
      <rect x="56" y="174" width="74" height="24" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="93" y="190" fill="#e8edf7" font-size="9" text-anchor="middle">recurso</text>
      <text x="93" y="216" fill="#8dc8ff" font-size="9" text-anchor="middle">herda para baixo</text>
    </g>
    <g class="dp" style="animation-delay:.5s">
      <rect x="186" y="32" width="150" height="92" rx="4" fill="none" stroke="#ff9a2e" stroke-dasharray="4 3"/>
      <text x="261" y="50" fill="#ffc182" font-size="11" text-anchor="middle">Azure Policy</text>
      <text x="261" y="66" fill="#9aa8c4" font-size="9" text-anchor="middle">que estado é permitido</text>
      <rect x="200" y="76" width="122" height="22" rx="3" fill="#2a1a08" stroke="#ff9a2e"/><text x="261" y="91" fill="#ffc182" font-size="9" text-anchor="middle">Deny · Audit · Append</text>
      <rect x="200" y="100" width="122" height="18" rx="3" fill="#2a1a08" stroke="#ff9a2e"/><text x="261" y="113" fill="#ffc182" font-size="9" text-anchor="middle">Modify · DeployIfNotExists</text>
    </g>
    <g class="dp" style="animation-delay:.75s">
      <rect x="186" y="136" width="150" height="92" rx="4" fill="none" stroke="#ff5d5d" stroke-dasharray="4 3"/>
      <text x="261" y="154" fill="#ff9d9d" font-size="11" text-anchor="middle">Bloqueio</text>
      <text x="261" y="170" fill="#9aa8c4" font-size="9" text-anchor="middle">pode alterar ou excluir</text>
      <rect x="200" y="180" width="122" height="20" rx="3" fill="#2a0e0e" stroke="#ff5d5d"/><text x="261" y="194" fill="#ff9d9d" font-size="9" text-anchor="middle">CanNotDelete</text>
      <rect x="200" y="202" width="122" height="20" rx="3" fill="#2a0e0e" stroke="#ff5d5d"/><text x="261" y="216" fill="#ff9d9d" font-size="9" text-anchor="middle">ReadOnly</text>
    </g>
    <g class="dp" style="animation-delay:1s">
      <rect x="354" y="60" width="148" height="140" rx="4" fill="#101826" stroke="#2e3a52"/>
      <text x="428" y="82" fill="#e8edf7" font-size="11" text-anchor="middle">Proprietário</text>
      <text x="428" y="106" fill="#8dc8ff" font-size="9" text-anchor="middle">passa pelo RBAC</text>
      <line x1="372" y1="118" x2="484" y2="118" stroke="#2e3a52"/>
      <text x="428" y="140" fill="#ffc182" font-size="9" text-anchor="middle">não passa por Policy</text>
      <text x="428" y="162" fill="#ff9d9d" font-size="9" text-anchor="middle">não passa por bloqueio</text>
      <text x="428" y="186" fill="#9aa8c4" font-size="9" text-anchor="middle">negação vence concessão</text>
    </g>
  </svg>`,
redund104: `<svg class="diag" viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg">
    <text class="dp" style="animation-delay:.05s" x="260" y="16" fill="#9aa8c4" font-size="11" text-anchor="middle">onde ficam as cópias</text>
    <g class="dp" style="animation-delay:.2s">
      <rect x="16" y="32" width="150" height="120" rx="4" fill="none" stroke="#2e3a52"/>
      <text x="91" y="50" fill="#e8edf7" font-size="11" text-anchor="middle">LRS</text>
      <rect x="40" y="62" width="102" height="74" rx="3" fill="#101826" stroke="#3b9dff"/>
      <text x="91" y="78" fill="#8dc8ff" font-size="9" text-anchor="middle">um datacenter</text>
      <circle cx="68" cy="104" r="8" fill="#15243c" stroke="#3b9dff"/><circle cx="91" cy="104" r="8" fill="#15243c" stroke="#3b9dff"/><circle cx="114" cy="104" r="8" fill="#15243c" stroke="#3b9dff"/>
      <text x="91" y="128" fill="#9aa8c4" font-size="8" text-anchor="middle">3 cópias</text>
    </g>
    <g class="dp" style="animation-delay:.5s">
      <rect x="182" y="32" width="150" height="120" rx="4" fill="none" stroke="#2e3a52"/>
      <text x="257" y="50" fill="#e8edf7" font-size="11" text-anchor="middle">ZRS</text>
      <rect x="194" y="62" width="40" height="74" rx="3" fill="#101826" stroke="#3b9dff"/><circle cx="214" cy="100" r="8" fill="#15243c" stroke="#3b9dff"/><text x="214" y="130" fill="#9aa8c4" font-size="8" text-anchor="middle">z1</text>
      <rect x="238" y="62" width="40" height="74" rx="3" fill="#101826" stroke="#3b9dff"/><circle cx="258" cy="100" r="8" fill="#15243c" stroke="#3b9dff"/><text x="258" y="130" fill="#9aa8c4" font-size="8" text-anchor="middle">z2</text>
      <rect x="282" y="62" width="40" height="74" rx="3" fill="#101826" stroke="#3b9dff"/><circle cx="302" cy="100" r="8" fill="#15243c" stroke="#3b9dff"/><text x="302" y="130" fill="#9aa8c4" font-size="8" text-anchor="middle">z3</text>
      <text x="257" y="78" fill="#8dc8ff" font-size="9" text-anchor="middle">três zonas, uma região</text>
    </g>
    <g class="dp" style="animation-delay:.8s">
      <rect x="348" y="32" width="156" height="120" rx="4" fill="none" stroke="#2e3a52"/>
      <text x="426" y="50" fill="#e8edf7" font-size="11" text-anchor="middle">GRS e GZRS</text>
      <rect x="358" y="62" width="62" height="74" rx="3" fill="#101826" stroke="#3b9dff"/><text x="389" y="80" fill="#8dc8ff" font-size="8" text-anchor="middle">primária</text><circle cx="389" cy="104" r="8" fill="#15243c" stroke="#3b9dff"/>
      <rect x="434" y="62" width="62" height="74" rx="3" fill="#101826" stroke="#ff9a2e"/><text x="465" y="80" fill="#ffc182" font-size="8" text-anchor="middle">emparelhada</text><circle cx="465" cy="104" r="8" fill="#2a1a08" stroke="#ff9a2e"/>
      <path d="M420 104 L434 104" stroke="#ff9a2e" stroke-dasharray="3 2" marker-end="url(#a104)"/>
      <text x="426" y="130" fill="#9aa8c4" font-size="8" text-anchor="middle">cópia assíncrona</text>
    </g>
    <g class="dp" style="animation-delay:1.05s">
      <rect x="16" y="164" width="488" height="48" rx="4" fill="#101826" stroke="#2e3a52"/>
      <text x="30" y="184" fill="#ffc182" font-size="10">Sem o prefixo RA, o secundário só fica legível depois de failover.</text>
      <text x="30" y="202" fill="#9aa8c4" font-size="9">RA-GRS e RA-GZRS entregam leitura no secundário em operação normal.</text>
    </g>
    <defs><marker id="a104" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#ff9a2e"/></marker></defs>
  </svg>`,
sla104: `<svg class="diag" viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg">
    <text class="dp" style="animation-delay:.05s" x="260" y="16" fill="#9aa8c4" font-size="11" text-anchor="middle">a escada da disponibilidade</text>
    <g class="dp" style="animation-delay:.2s">
      <rect x="20" y="150" width="140" height="56" rx="3" fill="#101826" stroke="#3b9dff"/>
      <text x="90" y="172" fill="#e8edf7" font-size="10" text-anchor="middle">máquina única</text>
      <text x="90" y="188" fill="#8dc8ff" font-size="9" text-anchor="middle">discos SSD Premium</text>
      <text x="90" y="142" fill="#8dc8ff" font-size="13" text-anchor="middle" font-weight="600">99,9%</text>
    </g>
    <g class="dp" style="animation-delay:.5s">
      <rect x="186" y="110" width="140" height="96" rx="3" fill="#101826" stroke="#3b9dff"/>
      <text x="256" y="132" fill="#e8edf7" font-size="10" text-anchor="middle">conjunto de disponibilidade</text>
      <rect x="198" y="142" width="54" height="24" rx="2" fill="#15243c" stroke="#3b9dff"/><text x="225" y="158" fill="#8dc8ff" font-size="8" text-anchor="middle">rack 1</text>
      <rect x="260" y="142" width="54" height="24" rx="2" fill="#15243c" stroke="#3b9dff"/><text x="287" y="158" fill="#8dc8ff" font-size="8" text-anchor="middle">rack 2</text>
      <text x="256" y="186" fill="#9aa8c4" font-size="8" text-anchor="middle">domínios de falha e de atualização</text>
      <text x="256" y="102" fill="#8dc8ff" font-size="13" text-anchor="middle" font-weight="600">99,95%</text>
    </g>
    <g class="dp" style="animation-delay:.8s">
      <rect x="352" y="70" width="148" height="136" rx="3" fill="#101826" stroke="#2bd4a0"/>
      <text x="426" y="92" fill="#e8edf7" font-size="10" text-anchor="middle">zonas de disponibilidade</text>
      <rect x="362" y="102" width="40" height="52" rx="2" fill="#0d2420" stroke="#2bd4a0"/><text x="382" y="132" fill="#7fe8c8" font-size="8" text-anchor="middle">z1</text>
      <rect x="406" y="102" width="40" height="52" rx="2" fill="#0d2420" stroke="#2bd4a0"/><text x="426" y="132" fill="#7fe8c8" font-size="8" text-anchor="middle">z2</text>
      <rect x="450" y="102" width="40" height="52" rx="2" fill="#0d2420" stroke="#2bd4a0"/><text x="470" y="132" fill="#7fe8c8" font-size="8" text-anchor="middle">z3</text>
      <text x="426" y="176" fill="#9aa8c4" font-size="8" text-anchor="middle">datacenters independentes</text>
      <text x="426" y="192" fill="#9aa8c4" font-size="8" text-anchor="middle">na mesma região</text>
      <text x="426" y="62" fill="#7fe8c8" font-size="13" text-anchor="middle" font-weight="600">99,99%</text>
    </g>
    <path class="dp" style="animation-delay:1.05s" d="M20 214 L500 214" stroke="#2e3a52"/>
    <text class="dp" style="animation-delay:1.05s" x="260" y="226" fill="#9aa8c4" font-size="9" text-anchor="middle">nenhuma das duas últimas pode ser atribuída a uma máquina já criada</text>
  </svg>`,
nsg104: `<svg class="diag" viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg">
    <text class="dp" style="animation-delay:.05s" x="260" y="16" fill="#9aa8c4" font-size="11" text-anchor="middle">duas cantoneiras no mesmo caminho</text>
    <g class="dp" style="animation-delay:.2s">
      <rect x="16" y="76" width="74" height="50" rx="3" fill="#101826" stroke="#2e3a52"/>
      <text x="53" y="98" fill="#e8edf7" font-size="10" text-anchor="middle">pacote</text>
      <text x="53" y="113" fill="#9aa8c4" font-size="8" text-anchor="middle">de entrada</text>
    </g>
    <g class="dp" style="animation-delay:.45s">
      <rect x="126" y="48" width="150" height="106" rx="4" fill="none" stroke="#3b9dff" stroke-dasharray="4 3"/>
      <text x="201" y="40" fill="#8dc8ff" font-size="10" text-anchor="middle">1. NSG da sub-rede</text>
      <rect x="140" y="62" width="122" height="22" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="201" y="77" fill="#e8edf7" font-size="9" text-anchor="middle">prioridade 100</text>
      <rect x="140" y="88" width="122" height="22" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="201" y="103" fill="#e8edf7" font-size="9" text-anchor="middle">prioridade 200</text>
      <rect x="140" y="114" width="122" height="22" rx="3" fill="#2a0e0e" stroke="#ff5d5d"/><text x="201" y="129" fill="#ff9d9d" font-size="9" text-anchor="middle">negar tudo (padrão)</text>
    </g>
    <g class="dp" style="animation-delay:.75s">
      <rect x="312" y="48" width="140" height="106" rx="4" fill="none" stroke="#ff9a2e" stroke-dasharray="4 3"/>
      <text x="382" y="40" fill="#ffc182" font-size="10" text-anchor="middle">2. NSG da interface</text>
      <rect x="324" y="62" width="116" height="22" rx="3" fill="#2a1a08" stroke="#ff9a2e"/><text x="382" y="77" fill="#ffc182" font-size="9" text-anchor="middle">prioridade 100</text>
      <rect x="324" y="88" width="116" height="22" rx="3" fill="#2a0e0e" stroke="#ff5d5d"/><text x="382" y="103" fill="#ff9d9d" font-size="9" text-anchor="middle">negar tudo (padrão)</text>
      <text x="382" y="130" fill="#9aa8c4" font-size="8" text-anchor="middle">a primeira regra que casa decide</text>
    </g>
    <path class="dp" style="animation-delay:.6s" d="M90 101 L126 101" stroke="#3b9dff" marker-end="url(#b104)"/>
    <path class="dp" style="animation-delay:.9s" d="M276 101 L312 101" stroke="#ff9a2e" marker-end="url(#c104)"/>
    <path class="dp" style="animation-delay:1.1s" d="M452 101 L488 101" stroke="#2bd4a0" marker-end="url(#d104)"/>
    <text class="dp" style="animation-delay:1.1s" x="470" y="124" fill="#7fe8c8" font-size="9" text-anchor="middle">máquina</text>
    <g class="dp" style="animation-delay:1.3s">
      <rect x="16" y="172" width="488" height="42" rx="4" fill="#101826" stroke="#2e3a52"/>
      <text x="30" y="192" fill="#ffc182" font-size="10">Na saída a ordem inverte: interface primeiro, sub-rede depois.</text>
      <text x="30" y="208" fill="#9aa8c4" font-size="9">As duas precisam permitir. Uma regra certa na sub-rede não salva um bloqueio na interface.</text>
    </g>
    <defs>
      <marker id="b104" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#3b9dff"/></marker>
      <marker id="c104" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#ff9a2e"/></marker>
      <marker id="d104" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#2bd4a0"/></marker>
    </defs>
  </svg>`,
mon104: `<svg class="diag" viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg">
    <text class="dp" style="animation-delay:.05s" x="260" y="16" fill="#9aa8c4" font-size="11" text-anchor="middle">métrica chega sozinha, log precisa de encaminhamento</text>
    <g class="dp" style="animation-delay:.2s">
      <rect x="16" y="60" width="118" height="110" rx="4" fill="#101826" stroke="#2e3a52"/>
      <text x="75" y="84" fill="#e8edf7" font-size="10" text-anchor="middle">recurso</text>
      <rect x="28" y="96" width="94" height="24" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="75" y="112" fill="#8dc8ff" font-size="9" text-anchor="middle">métricas</text>
      <rect x="28" y="126" width="94" height="24" rx="3" fill="#2a1a08" stroke="#ff9a2e"/><text x="75" y="142" fill="#ffc182" font-size="9" text-anchor="middle">logs</text>
    </g>
    <path class="dp" style="animation-delay:.45s" d="M134 108 L212 108" stroke="#3b9dff" marker-end="url(#e104)"/>
    <text class="dp" style="animation-delay:.45s" x="173" y="100" fill="#8dc8ff" font-size="8" text-anchor="middle">automático</text>
    <path class="dp" style="animation-delay:.7s" d="M134 138 L172 138 L172 186 L212 186" fill="none" stroke="#ff9a2e" stroke-dasharray="3 2" marker-end="url(#f104)"/>
    <text class="dp" style="animation-delay:.7s" x="186" y="176" fill="#ffc182" font-size="8">config. de diagnóstico</text>
    <g class="dp" style="animation-delay:.95s">
      <rect x="212" y="84" width="140" height="48" rx="3" fill="#101826" stroke="#3b9dff"/>
      <text x="282" y="104" fill="#e8edf7" font-size="10" text-anchor="middle">banco de métricas</text>
      <text x="282" y="120" fill="#9aa8c4" font-size="8" text-anchor="middle">retenção de 93 dias</text>
    </g>
    <g class="dp" style="animation-delay:1.15s">
      <rect x="212" y="162" width="140" height="48" rx="3" fill="#101826" stroke="#ff9a2e"/>
      <text x="282" y="182" fill="#e8edf7" font-size="10" text-anchor="middle">Log Analytics</text>
      <text x="282" y="198" fill="#9aa8c4" font-size="8" text-anchor="middle">consulta em KQL</text>
    </g>
    <g class="dp" style="animation-delay:1.35s">
      <rect x="386" y="84" width="118" height="126" rx="4" fill="none" stroke="#2bd4a0" stroke-dasharray="4 3"/>
      <text x="445" y="104" fill="#7fe8c8" font-size="10" text-anchor="middle">alertas</text>
      <rect x="396" y="114" width="98" height="22" rx="3" fill="#0d2420" stroke="#2bd4a0"/><text x="445" y="129" fill="#7fe8c8" font-size="8" text-anchor="middle">de métrica</text>
      <rect x="396" y="140" width="98" height="22" rx="3" fill="#0d2420" stroke="#2bd4a0"/><text x="445" y="155" fill="#7fe8c8" font-size="8" text-anchor="middle">de pesquisa de log</text>
      <rect x="396" y="166" width="98" height="22" rx="3" fill="#0d2420" stroke="#2bd4a0"/><text x="445" y="181" fill="#7fe8c8" font-size="8" text-anchor="middle">de log de atividades</text>
      <text x="445" y="202" fill="#9aa8c4" font-size="8" text-anchor="middle">grupo de ações dispara</text>
    </g>
    <path class="dp" style="animation-delay:1.5s" d="M352 108 L386 108" stroke="#2bd4a0" marker-end="url(#g104)"/>
    <path class="dp" style="animation-delay:1.5s" d="M352 186 L370 186 L370 150 L386 150" fill="none" stroke="#2bd4a0" marker-end="url(#h104)"/>
    <defs>
      <marker id="e104" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#3b9dff"/></marker>
      <marker id="f104" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#ff9a2e"/></marker>
      <marker id="g104" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#2bd4a0"/></marker>
      <marker id="h104" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#2bd4a0"/></marker>
    </defs>
  </svg>`
});

const LESSONS_104 = [
{
  id:"l-104-gov", exam:"az104", dom:"d1", concept:"rbac-governanca", secs:92,
  title:"RBAC, Policy e bloqueio: por que o Proprietário recebe erro",
  slides:[
    { k:"gancho", emoji:"\u{1F512}", h:"Um Proprietário sem poder", p:"A cena mais comum da prova: alguém com a função máxima tenta algo e recebe erro. Se você souber de onde vem o erro, a questão se resolve em dez segundos." },
    { k:"analogia", emoji:"\u{1F3E2}", h:"Pense num prédio", p:"RBAC é o crachá: diz em quais portas você entra. Policy é o código de obras: ninguém, nem o dono, constrói fora da norma. Bloqueio é a fita de isolamento colada na porta: enquanto estiver ali, ninguém mexe, nem quem tem a chave mestra." },
    { k:"diagrama", diagram:"gov104", h:"Três controles, três perguntas", p:"RBAC pergunta quem. Policy pergunta como o recurso pode ficar. Bloqueio pergunta se pode ser tocado." },
    { k:"pegadinha", emoji:"\u{1F6A8}", h:"Onde a prova te pega", gotcha:"Quando o enunciado diz que o Proprietário não consegue excluir algo, a resposta nunca é RBAC. É bloqueio, ou atribuição de negação. E quando ele não consegue criar algo fora do padrão, é Azure Policy. Policy nunca apaga o que já existe: ela barra a próxima gravação e marca o resto como não conforme." },
    { k:"quiz" }
  ],
  quiz:[
    { q:"Um Proprietário não consegue excluir um grupo de recursos. O que verificar primeiro?", a:["Bloqueio no escopo","Dar a função Colaborador","Uma política com efeito Audit"], c:0, e:"CanNotDelete ou ReadOnly, no próprio grupo ou herdado da assinatura, impede exclusão até para o Proprietário." },
    { q:"Trezentos recursos existentes estão sem a marca obrigatória. O que corrige?", a:["Policy com Modify e tarefa de correção","Policy com Deny","Bloqueio ReadOnly"], c:0, e:"Só Modify e DeployIfNotExists aceitam tarefa de correção, que é o que alcança recurso já existente." },
    { q:"Quem precisa operar recursos sem poder conceder acesso a terceiros recebe qual função?", a:["Colaborador","Proprietário","Administrador de Acesso de Usuário"], c:0, e:"Colaborador faz tudo menos distribuir permissão, que é exatamente a separação pedida." }
  ]
},
{
  id:"l-104-redund", exam:"az104", dom:"d2", concept:"armazenamento-redundancia", secs:88,
  title:"Redundância de armazenamento em uma tabela",
  slides:[
    { k:"gancho", emoji:"\u{1F5C4}", h:"Seis siglas, duas perguntas", p:"Onde ficam as cópias, e o secundário pode ser lido. Responda as duas e o bloco de redundância fica resolvido." },
    { k:"analogia", emoji:"\u{1F4E6}", h:"Cópia do contrato", p:"LRS é guardar três vias no mesmo armário. ZRS é guardar uma via em cada um de três prédios do mesmo bairro. GRS é guardar também numa cidade distante, mas num cofre que você só abre depois de declarar que o escritório pegou fogo. RA-GRS é o mesmo cofre, com a chave no seu bolso." },
    { k:"diagrama", diagram:"redund104", h:"A geografia das cópias", p:"A região emparelhada é definida pela Microsoft, e a cópia até ela é assíncrona." },
    { k:"pegadinha", emoji:"\u{1F6A8}", h:"Onde a prova te pega", gotcha:"Sem o prefixo RA, não há leitura do secundário em operação normal. E nenhuma opção de redundância protege contra exclusão acidental: para isso existem exclusão reversível, controle de versão e bloqueio. Trocar redundância por proteção contra erro humano é a troca errada." },
    { k:"quiz" }
  ],
  quiz:[
    { q:"Precisa ler os dados de uma segunda região, sem failover. Qual opção?", a:["RA-GRS","GRS","ZRS"], c:0, e:"Só as opções com acesso de leitura expõem o ponto de extremidade secundário em operação normal." },
    { q:"Sobreviver à perda de um datacenter sem sair da região pede qual opção?", a:["ZRS","LRS","GRS"], c:0, e:"ZRS distribui as três cópias em zonas distintas da mesma região." },
    { q:"Alguém apagou um blob por engano. O que teria evitado a perda?", a:["Exclusão reversível e controle de versão","Migrar de LRS para GRS","Camada de acesso fria"], c:0, e:"Redundância cobre falha de infraestrutura, não erro humano." }
  ]
},
{
  id:"l-104-sla", exam:"az104", dom:"d3", concept:"vm-disponibilidade", secs:90,
  title:"A escada da disponibilidade de máquinas virtuais",
  slides:[
    { k:"gancho", emoji:"\u{1F3D7}", h:"Três degraus e um número", p:"Toda questão que cita um número de disponibilidade exigido pelo negócio está testando a mesma escada de três degraus." },
    { k:"analogia", emoji:"\u{1F6A6}", h:"Pense em rotas para o trabalho", p:"Uma máquina com disco premium é uma rota só, bem asfaltada. Conjunto de disponibilidade é duas rotas que saem do mesmo bairro: um acidente na rua não para as duas. Zonas são duas rotas que atravessam bairros diferentes: um alagamento no bairro não derruba as duas." },
    { k:"diagrama", diagram:"sla104", h:"99,9, 99,95 e 99,99", p:"Domínio de falha é rack dentro do datacenter. Zona é datacenter inteiro." },
    { k:"pegadinha", emoji:"\u{1F6A8}", h:"Onde a prova te pega", gotcha:"Não existe adicionar uma máquina já criada a um conjunto de disponibilidade, nem mudar a zona de uma máquina existente: a associação é definida na criação. Quando o enunciado diz que as máquinas já existem e o alvo é 99,95% ou 99,99%, a resposta envolve recriar. E atenção ao balanceador: o Basic não é redundante de zona, então ele reintroduz o ponto único que o desenho tentou remover." },
    { k:"quiz" }
  ],
  quiz:[
    { q:"Duas máquinas já criadas precisam de 99,99%. O que fazer?", a:["Recriar, uma em cada zona","Adicionar ao conjunto de disponibilidade","Trocar os discos para SSD Premium"], c:0, e:"99,99% só vem de zonas, e zona não se atribui a máquina existente." },
    { q:"O dado gravado no disco D desapareceu depois de desalocar a máquina. Por quê?", a:["É o disco temporário","O disco gerenciado foi reduzido","Faltou backup do disco do sistema"], c:0, e:"O disco temporário é armazenamento local do host e seu conteúdo não sobrevive à desalocação." },
    { q:"Máquina única precisa chegar a 99,9%. O que é exigido?", a:["Todos os discos em SSD Premium","Conjunto de disponibilidade","Duas zonas"], c:0, e:"O acordo de máquina única exige que todos os discos sejam SSD Premium." }
  ]
},
{
  id:"l-104-nsg", exam:"az104", dom:"d4", concept:"rede-virtual", secs:86,
  title:"NSG avalia duas vezes, e emparelhamento não é transitivo",
  slides:[
    { k:"gancho", emoji:"\u{1F6E1}", h:"A regra está certa e o pacote não chega", p:"Esse cenário tem duas causas possíveis, e as duas aparecem na prova de rede com frequência." },
    { k:"analogia", emoji:"\u{1F6AA}", h:"Duas portarias", p:"Para entrar no andar você passa na portaria do prédio e depois na recepção da empresa. Liberação na portaria não serve de nada se a recepção barrar. Na saída você passa pela recepção primeiro e pela portaria depois." },
    { k:"diagrama", diagram:"nsg104", h:"Sub-rede e interface, em ordem", p:"A primeira regra que casa decide, por prioridade, e a avaliação para ali." },
    { k:"pegadinha", emoji:"\u{1F6A8}", h:"Onde a prova te pega", gotcha:"A outra causa de tráfego que não chega é rota, não regra: emparelhamento liga só os dois pares envolvidos e não propaga para um terceiro. A vem a B e B vem a C não faz A chegar a C. A correção é emparelhamento direto, trânsito de gateway, ou dispositivo de rede no centro com rota definida pelo usuário. Grupo de segurança nunca encaminha pacote: isso é trabalho de tabela de rotas." },
    { k:"quiz" }
  ],
  quiz:[
    { q:"A fala com B, B fala com C, A não fala com C. Por quê?", a:["Emparelhamento não é transitivo","Falta regra no grupo de segurança de C","As redes estão em regiões diferentes"], c:0, e:"Emparelhamento não propaga rota para um terceiro par." },
    { q:"Todo tráfego de saída deve passar por um firewall. O que configurar?", a:["Rota 0.0.0.0/0 com próximo salto no firewall","Regra de saída no grupo de segurança","Ponto de extremidade de serviço"], c:0, e:"Encaminhar é trabalho de rota; grupo de segurança apenas permite ou nega." },
    { q:"Quantos endereços sobram em uma sub-rede /29?", a:["3","6","8"], c:0, e:"O Azure reserva cinco endereços por sub-rede, então oito menos cinco dá três." }
  ]
},
{
  id:"l-104-mon", exam:"az104", dom:"d5", concept:"monitorar-recuperar", secs:84,
  title:"Métrica, log e os três tipos de alerta",
  slides:[
    { k:"gancho", emoji:"\u{1F4C8}", h:"O log não aparece no espaço de trabalho", p:"Quase sempre é a mesma causa, e ela não tem nada a ver com permissão nem com agente." },
    { k:"analogia", emoji:"\u{1F4EC}", h:"Medidor e diário de bordo", p:"A métrica é o medidor na parede: alguém já anota o número sozinho, de hora em hora. O log é o diário de bordo: ele existe, mas fica na gaveta do recurso até você pedir que uma cópia seja enviada para o arquivo central." },
    { k:"diagrama", diagram:"mon104", h:"Quem chega sozinho e quem precisa de ordem", p:"A configuração de diagnóstico é por recurso e é o que encaminha o log." },
    { k:"pegadinha", emoji:"\u{1F6A8}", h:"Onde a prova te pega", gotcha:"Alerta de métrica não consulta log. Se a condição só existe no texto de um log, a resposta é alerta de pesquisa de log; se é uma operação de criação, alteração ou exclusão, é alerta de log de atividades. E lembre dos 90 dias: o log de atividades só vai além disso quando exportado por configuração de diagnóstico." },
    { k:"quiz" }
  ],
  quiz:[
    { q:"Métricas aparecem, logs do recurso não chegam ao Log Analytics. O que falta?", a:["Configuração de diagnóstico no recurso","Instalar o agente no recurso de plataforma","Aumentar a retenção das métricas"], c:0, e:"Métrica é coletada sozinha; log precisa ser encaminhado por configuração de diagnóstico." },
    { q:"Avisar quando alguém excluir um recurso pede qual alerta?", a:["De log de atividades","De métrica","De pesquisa de log no banco de métricas"], c:0, e:"Exclusão é operação do plano de controle, registrada no log de atividades." },
    { q:"Restaurar um arquivo apagado ontem é trabalho de qual serviço?", a:["Backup do Azure","Azure Site Recovery","Azure Monitor"], c:0, e:"Backup mantém pontos de recuperação e permite restauração granular; Site Recovery serve a desastre regional." }
  ]
}
];
LESSONS.push(...LESSONS_104);

/* ---------------- baralhos de classificação do AZ-104 ---------------- */
const DECKS_104 = [
{
  id:"dk-104-gov", exam:"az104", dom:"d1", concept:"rbac-governanca",
  title:"Qual controle resolve",
  prompt:"Classifique cada exigência pelo controle que a atende.",
  buckets:[{k:"rbac",label:"RBAC"},{k:"policy",label:"Azure Policy"},{k:"lock",label:"Bloqueio"}],
  items:[
    {t:"Equipe de auditoria precisa ver tudo sem alterar nada", k:"rbac", e:"É permissão de identidade: função Leitor no escopo."},
    {t:"Ninguém pode criar recurso fora das regiões aprovadas", k:"policy", e:"Restrição de estado do recurso, efeito Deny."},
    {t:"Ninguém pode excluir a conta de armazenamento de produção", k:"lock", e:"CanNotDelete, que atinge até o Proprietário."},
    {t:"Toda máquina nova deve nascer com a marca de centro de custo", k:"policy", e:"Append ou Modify acrescenta o campo na gravação."},
    {t:"Um líder precisa poder dar acesso aos colegas sem operar recursos", k:"rbac", e:"Administrador de Acesso de Usuário."},
    {t:"A configuração do gateway de produção não pode ser alterada por ninguém", k:"lock", e:"ReadOnly impede alteração e exclusão."},
    {t:"Toda conta de armazenamento deve ter transferência segura exigida", k:"policy", e:"Regra de conformidade sobre a propriedade do recurso."},
    {t:"O time de suporte cria e exclui máquinas, mas não concede acesso", k:"rbac", e:"Função Colaborador no escopo do grupo de recursos."},
    {t:"Recursos existentes sem a marca obrigatória precisam ser corrigidos em lote", k:"policy", e:"Modify com tarefa de correção."}
  ]
},
{
  id:"dk-104-rede", exam:"az104", dom:"d4", concept:"rede-virtual",
  title:"Qual serviço de entrega de tráfego",
  prompt:"Classifique cada requisito pelo serviço que o atende.",
  buckets:[{k:"lb",label:"Load Balancer"},{k:"agw",label:"Application Gateway"},{k:"afd",label:"Front Door"},{k:"tm",label:"Traffic Manager"}],
  items:[
    {t:"Roteamento por caminho de URL em uma única região", k:"agw", e:"Camada 7 regional, que lê o caminho da requisição."},
    {t:"Firewall de aplicação web acoplado ao balanceamento regional", k:"agw", e:"O WAF é oferecido junto do Application Gateway."},
    {t:"Distribuir conexões TCP entre máquinas da mesma região", k:"lb", e:"Camada 4, sem leitura de conteúdo."},
    {t:"Direcionar usuários para a região mais próxima, com cache na borda", k:"afd", e:"Camada 7 global, com rede de entrega de conteúdo."},
    {t:"Direcionar por DNS entre dois ambientes, sem encerrar a conexão", k:"tm", e:"Trabalha por resposta de DNS: ele não vê o pacote."},
    {t:"Balancear tráfego de um protocolo próprio, não HTTP", k:"lb", e:"Camada 4 atende qualquer protocolo sobre TCP ou UDP."},
    {t:"Encerrar TLS e inspecionar cabeçalho HTTP, dentro da região", k:"agw", e:"Encerramento e inspeção são camada 7 regional."},
    {t:"Failover global entre regiões com verificação de integridade por DNS", k:"tm", e:"Perfil de roteamento por prioridade no Traffic Manager."}
  ]
},
{
  id:"dk-104-store", exam:"az104", dom:"d2", concept:"armazenamento-acesso",
  title:"Como autorizar o acesso",
  prompt:"Classifique cada cenário pela forma de autorização mais adequada.",
  buckets:[{k:"sas",label:"SAS"},{k:"entra",label:"Entra ID com função de dados"},{k:"rede",label:"Controle de rede"}],
  items:[
    {t:"Parceiro externo envia arquivos por 15 dias", k:"sas", e:"Prazo e permissão recortados em um token."},
    {t:"Função do Azure grava em blob sem segredo em configuração", k:"entra", e:"Identidade gerenciada com função de dados."},
    {t:"A conta não pode ter endereço público", k:"rede", e:"Ponto de extremidade privado."},
    {t:"Só as máquinas de uma sub-rede podem acessar a conta", k:"rede", e:"Firewall da conta com ponto de extremidade de serviço."},
    {t:"Revogar o acesso de um parceiro sem girar a chave da conta", k:"sas", e:"SAS vinculada a política de acesso armazenada."},
    {t:"Rastrear qual identidade leu cada blob", k:"entra", e:"Autorização por identidade é o que produz rastro auditável."},
    {t:"Aplicação em outra nuvem precisa ler um contêiner por um ano", k:"sas", e:"SAS de longa duração com política armazenada, para poder revogar."},
    {t:"Equipe de dados precisa ler todos os contêineres de um projeto", k:"entra", e:"Leitor de Dados do Blob no escopo da conta ou do contêiner."}
  ]
}
];
DECKS.push(...DECKS_104);
