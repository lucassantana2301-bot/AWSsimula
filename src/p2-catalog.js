/* ============================================================
   CloudQuest — CATÁLOGO (dados)
   ATENÇÃO: catálogo versionado à mão. Antes de confiar em código,
   nível ou peso de domínio, confira as páginas oficiais:
   - Microsoft Learn: learn.microsoft.com/credentials
   - AWS: aws.amazon.com/certification
   Exames mudam de versão e são aposentados com frequência.
   ============================================================ */
const CATALOG_SYNCED = "2026-11-09";

const PROVIDERS = {
  azure: { id:"azure", name:"Microsoft Azure", short:"Azure", cls:"azure", icon:"▲" },
  aws:   { id:"aws",   name:"Amazon Web Services", short:"AWS", cls:"aw", icon:"◆" }
};

/* status: active | beta | retiring | retired | soon  */
const EXAMS = [
  {
    id:"az900", provider:"azure", code:"AZ-900", version:"atual",
    name:"Azure Fundamentals", level:"Fundamentos", status:"active",
    pass:700, scale:1000, simQ:24, simMin:35, realQ:"40-60", realMin:45, price:"USD 99",
    note:"Não foi afetado pela reforma de 2026.",
    domains:[
      { id:"d1", name:"Conceitos de nuvem", w:"25-30%" },
      { id:"d2", name:"Arquitetura e serviços do Azure", w:"35-40%" },
      { id:"d3", name:"Gerenciamento e governança", w:"30-35%" }
    ]
  },
  {
    id:"az104", provider:"azure", code:"AZ-104", version:"atual",
    name:"Azure Administrator", level:"Associate", status:"active",
    pass:700, scale:1000, simQ:28, simMin:50, realQ:"40-60", realMin:100, price:"USD 165",
    note:"Refresh de abril de 2026 ampliou Entra ID, Container Apps e Azure Arc.",
    domains:[
      { id:"d1", name:"Identidades e governança", w:"20-25%" },
      { id:"d2", name:"Armazenamento", w:"15-20%" },
      { id:"d3", name:"Computação", w:"20-25%" },
      { id:"d4", name:"Rede virtual", w:"15-20%" },
      { id:"d5", name:"Monitorar e manter", w:"10-15%" }
    ]
  },
  {
    id:"saa", provider:"aws", code:"SAA-C03", version:"C03",
    name:"Solutions Architect Associate", level:"Associate", status:"active",
    pass:720, scale:1000, simQ:30, simMin:55, realQ:"65", realMin:130, price:"USD 150",
    note:"A certificação de nuvem mais citada em vagas no nível associate.",
    domains:[
      { id:"d1", name:"Arquiteturas seguras", w:"30%" },
      { id:"d2", name:"Arquiteturas resilientes", w:"26%" },
      { id:"d3", name:"Arquiteturas de alto desempenho", w:"24%" },
      { id:"d4", name:"Arquiteturas com custo otimizado", w:"20%" }
    ]
  },
  {
    id:"clf", provider:"aws", code:"CLF-C02", version:"C02",
    name:"Cloud Practitioner", level:"Fundamentos", status:"active",
    pass:700, scale:1000, simQ:30, simMin:45, realQ:"65", realMin:90, price:"USD 100",
    note:"Guia revisado para incluir conceitos de IA generativa.",
    domains:[
      { id:"d1", name:"Conceitos de nuvem", w:"24%" },
      { id:"d2", name:"Segurança e conformidade", w:"30%" },
      { id:"d3", name:"Tecnologia e serviços de nuvem", w:"34%" },
      { id:"d4", name:"Cobrança, preços e suporte", w:"12%" }
    ]
  },
];

/* ============================================================
   VÍDEOS-RELÂMPAGO (60-90s)
   Roteiro fixo: gancho -> analogia -> diagrama -> pegadinha -> mini-quiz
   ============================================================ */
const DIAGRAMS = {
camadas: `<svg class="diag" viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg">
    <text class="dp" style="animation-delay:.05s" x="260" y="18" fill="#9aa8c4" font-size="11" text-anchor="middle">quem administra cada camada</text>
    <g class="dp" style="animation-delay:.15s">
      <text x="88" y="40" fill="#e8edf7" font-size="12" text-anchor="middle">IaaS</text>
      <rect x="20" y="50" width="136" height="26" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="88" y="67" fill="#8dc8ff" font-size="10" text-anchor="middle">aplicação</text>
      <rect x="20" y="80" width="136" height="26" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="88" y="97" fill="#8dc8ff" font-size="10" text-anchor="middle">runtime</text>
      <rect x="20" y="110" width="136" height="26" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="88" y="127" fill="#8dc8ff" font-size="10" text-anchor="middle">sistema operacional</text>
      <rect x="20" y="140" width="136" height="26" rx="3" fill="#2a1a08" stroke="#ff9a2e"/><text x="88" y="157" fill="#ffc182" font-size="10" text-anchor="middle">virtualização</text>
      <rect x="20" y="170" width="136" height="26" rx="3" fill="#2a1a08" stroke="#ff9a2e"/><text x="88" y="187" fill="#ffc182" font-size="10" text-anchor="middle">hardware</text>
    </g>
    <g class="dp" style="animation-delay:.45s">
      <text x="260" y="40" fill="#e8edf7" font-size="12" text-anchor="middle">PaaS</text>
      <rect x="192" y="50" width="136" height="26" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="260" y="67" fill="#8dc8ff" font-size="10" text-anchor="middle">aplicação</text>
      <rect x="192" y="80" width="136" height="56" rx="3" fill="#2a1a08" stroke="#ff9a2e"/><text x="260" y="112" fill="#ffc182" font-size="10" text-anchor="middle">plataforma gerenciada</text>
      <rect x="192" y="140" width="136" height="56" rx="3" fill="#2a1a08" stroke="#ff9a2e"/><text x="260" y="172" fill="#ffc182" font-size="10" text-anchor="middle">infraestrutura</text>
    </g>
    <g class="dp" style="animation-delay:.75s">
      <text x="432" y="40" fill="#e8edf7" font-size="12" text-anchor="middle">SaaS</text>
      <rect x="364" y="50" width="136" height="146" rx="3" fill="#2a1a08" stroke="#ff9a2e"/><text x="432" y="118" fill="#ffc182" font-size="10" text-anchor="middle">tudo gerenciado</text>
    </g>
    <text class="dp" style="animation-delay:1s" x="260" y="216" fill="#3b9dff" font-size="10.5" text-anchor="middle">azul: você administra</text>
    <text class="dp" style="animation-delay:1.05s" x="260" y="232" fill="#ff9a2e" font-size="10.5" text-anchor="middle">laranja: o provedor administra. Seus dados e acessos são sempre seus.</text>
  </svg>`,

  awsVerbos: `<svg class="diag" viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg">
    <text class="dp" style="animation-delay:.05s" x="260" y="18" fill="#9aa8c4" font-size="11" text-anchor="middle">um verbo para cada serviço</text>
    <g class="dp" style="animation-delay:.2s"><rect x="14" y="30" width="156" height="54" rx="4" fill="#2a1a08" stroke="#ff9a2e"/>
      <text x="92" y="50" fill="#ffc182" font-size="12" text-anchor="middle">CloudTrail</text><text x="92" y="70" fill="#e8edf7" font-size="10.5" text-anchor="middle">registra chamadas</text></g>
    <g class="dp" style="animation-delay:.35s"><rect x="182" y="30" width="156" height="54" rx="4" fill="#15243c" stroke="#3b9dff"/>
      <text x="260" y="50" fill="#8dc8ff" font-size="12" text-anchor="middle">GuardDuty</text><text x="260" y="70" fill="#e8edf7" font-size="10.5" text-anchor="middle">detecta ameaça</text></g>
    <g class="dp" style="animation-delay:.5s"><rect x="350" y="30" width="156" height="54" rx="4" fill="#1c1630" stroke="#a78bfa"/>
      <text x="428" y="50" fill="#c4b5fd" font-size="12" text-anchor="middle">Macie</text><text x="428" y="70" fill="#e8edf7" font-size="10.5" text-anchor="middle">classifica dado</text></g>
    <g class="dp" style="animation-delay:.65s"><rect x="14" y="96" width="156" height="54" rx="4" fill="#0f3d2c" stroke="#34d399"/>
      <text x="92" y="116" fill="#34d399" font-size="12" text-anchor="middle">Config</text><text x="92" y="136" fill="#e8edf7" font-size="10.5" text-anchor="middle">compara configuração</text></g>
    <g class="dp" style="animation-delay:.8s"><rect x="182" y="96" width="156" height="54" rx="4" fill="#2b1414" stroke="#fb7185"/>
      <text x="260" y="116" fill="#fb7185" font-size="12" text-anchor="middle">Inspector</text><text x="260" y="136" fill="#e8edf7" font-size="10.5" text-anchor="middle">varre vulnerabilidade</text></g>
    <g class="dp" style="animation-delay:.95s"><rect x="350" y="96" width="156" height="54" rx="4" fill="#2e2410" stroke="#fbbf24"/>
      <text x="428" y="116" fill="#fbbf24" font-size="12" text-anchor="middle">Artifact</text><text x="428" y="136" fill="#e8edf7" font-size="10.5" text-anchor="middle">entrega relatório</text></g>
    <text class="dp" style="animation-delay:1.15s" x="260" y="180" fill="#fb7185" font-size="11" text-anchor="middle">CloudTrail registra API. CloudWatch mede métrica. Não troque os dois.</text>
    <text class="dp" style="animation-delay:1.3s" x="260" y="206" fill="#6b7a99" font-size="11" text-anchor="middle">Security Hub só junta os achados: quem detecta é o GuardDuty.</text>
  </svg>`,

  computeEscolha: `<svg class="diag" viewBox="0 0 520 225" xmlns="http://www.w3.org/2000/svg">
    <path class="dw" style="animation-delay:.1s" d="M40 160 H480" stroke="#6b7a99" stroke-width="1.5" fill="none"/>
    <text class="dp" style="animation-delay:.3s" x="40" y="182" fill="#9aa8c4" font-size="10.5">execução curta, por evento</text>
    <text class="dp" style="animation-delay:.3s" x="480" y="182" fill="#9aa8c4" font-size="10.5" text-anchor="end">execução longa, constante</text>
    <g class="dp" style="animation-delay:.45s"><rect x="30" y="40" width="130" height="90" rx="4" fill="#1c1630" stroke="#a78bfa"/>
      <text x="95" y="62" fill="#c4b5fd" font-size="12.5" text-anchor="middle">Lambda</text>
      <text x="95" y="84" fill="#e8edf7" font-size="10" text-anchor="middle">sem servidor</text>
      <text x="95" y="102" fill="#9aa8c4" font-size="9.5" text-anchor="middle">volume irregular</text>
      <text x="95" y="118" fill="#9aa8c4" font-size="9.5" text-anchor="middle">paga por execução</text></g>
    <g class="dp" style="animation-delay:.65s"><rect x="195" y="40" width="130" height="90" rx="4" fill="#15243c" stroke="#3b9dff"/>
      <text x="260" y="62" fill="#8dc8ff" font-size="12.5" text-anchor="middle">Fargate</text>
      <text x="260" y="84" fill="#e8edf7" font-size="10" text-anchor="middle">contêiner</text>
      <text x="260" y="102" fill="#9aa8c4" font-size="9.5" text-anchor="middle">sem administrar nó</text>
      <text x="260" y="118" fill="#9aa8c4" font-size="9.5" text-anchor="middle">já usa contêiner</text></g>
    <g class="dp" style="animation-delay:.85s"><rect x="360" y="40" width="130" height="90" rx="4" fill="#2a1a08" stroke="#ff9a2e"/>
      <text x="425" y="62" fill="#ffc182" font-size="12.5" text-anchor="middle">EC2</text>
      <text x="425" y="84" fill="#e8edf7" font-size="10" text-anchor="middle">máquina virtual</text>
      <text x="425" y="102" fill="#9aa8c4" font-size="9.5" text-anchor="middle">controla o SÓ</text>
      <text x="425" y="118" fill="#9aa8c4" font-size="9.5" text-anchor="middle">carga constante</text></g>
    <text class="dp" style="animation-delay:1.05s" x="260" y="212" fill="#fbbf24" font-size="11" text-anchor="middle">Duração, previsibilidade e quanto você quer administrar decidem.</text>
  </svg>`,

  custoFerr: `<svg class="diag" viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg">
    <g class="dp" style="animation-delay:.1s"><rect x="14" y="26" width="236" height="78" rx="4" fill="#15243c" stroke="#3b9dff"/>
      <text x="132" y="50" fill="#8dc8ff" font-size="12.5" text-anchor="middle">Calculadora de Preços</text>
      <text x="132" y="72" fill="#e8edf7" font-size="10.5" text-anchor="middle">quanto vai custar</text>
      <text x="132" y="90" fill="#9aa8c4" font-size="10" text-anchor="middle">algo que ainda não existe</text></g>
    <g class="dp" style="animation-delay:.3s"><rect x="270" y="26" width="236" height="78" rx="4" fill="#2e2410" stroke="#fbbf24"/>
      <text x="388" y="50" fill="#fbbf24" font-size="12.5" text-anchor="middle">Calculadora de TCO</text>
      <text x="388" y="72" fill="#e8edf7" font-size="10.5" text-anchor="middle">meu datacenter x Azure</text>
      <text x="388" y="90" fill="#9aa8c4" font-size="10" text-anchor="middle">energia, espaço, equipe</text></g>
    <g class="dp" style="animation-delay:.5s"><rect x="14" y="116" width="236" height="78" rx="4" fill="#0f3d2c" stroke="#34d399"/>
      <text x="132" y="140" fill="#34d399" font-size="12.5" text-anchor="middle">Cost Management</text>
      <text x="132" y="162" fill="#e8edf7" font-size="10.5" text-anchor="middle">quanto eu já gastei</text>
      <text x="132" y="180" fill="#9aa8c4" font-size="10" text-anchor="middle">e alerta de orçamento</text></g>
    <g class="dp" style="animation-delay:.7s"><rect x="270" y="116" width="236" height="78" rx="4" fill="#1c1630" stroke="#a78bfa"/>
      <text x="388" y="140" fill="#c4b5fd" font-size="12.5" text-anchor="middle">Advisor</text>
      <text x="388" y="162" fill="#e8edf7" font-size="10.5" text-anchor="middle">o que dá para melhorar</text>
      <text x="388" y="180" fill="#9aa8c4" font-size="10" text-anchor="middle">custo, segurança, desempenho</text></g>
    <text class="dp" style="animation-delay:.9s" x="260" y="218" fill="#6b7a99" font-size="11" text-anchor="middle">Antes de existir, depois de gastar, e o que melhorar. Três perguntas diferentes.</text>
  </svg>`,

  vpcSub: `<svg class="diag" viewBox="0 0 520 235" xmlns="http://www.w3.org/2000/svg">
    <rect class="dp" style="animation-delay:.05s" x="14" y="24" width="492" height="150" rx="6" fill="none" stroke="#6b7a99" stroke-width="1.5" stroke-dasharray="7 5"/>
    <text class="dp" style="animation-delay:.1s" x="24" y="42" fill="#9aa8c4" font-size="11">VPC</text>
    <g class="dp" style="animation-delay:.3s"><rect x="34" y="56" width="210" height="100" rx="4" fill="#2a1a08" stroke="#ff9a2e"/>
      <text x="139" y="78" fill="#ffc182" font-size="11.5" text-anchor="middle">sub-rede pública</text>
      <rect x="54" y="92" width="80" height="44" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="94" y="118" fill="#8dc8ff" font-size="10" text-anchor="middle">balanceador</text>
      <rect x="146" y="92" width="80" height="44" rx="3" fill="#0f3d2c" stroke="#34d399"/><text x="186" y="113" fill="#34d399" font-size="10" text-anchor="middle">NAT</text><text x="186" y="128" fill="#34d399" font-size="10" text-anchor="middle">Gateway</text></g>
    <g class="dp" style="animation-delay:.55s"><rect x="276" y="56" width="210" height="100" rx="4" fill="#15243c" stroke="#3b9dff"/>
      <text x="381" y="78" fill="#8dc8ff" font-size="11.5" text-anchor="middle">sub-rede privada</text>
      <rect x="300" y="92" width="76" height="44" rx="3" fill="#1d283f" stroke="#3a4a6b"/><text x="338" y="118" fill="#e8edf7" font-size="10" text-anchor="middle">aplicação</text>
      <rect x="388" y="92" width="76" height="44" rx="3" fill="#1d283f" stroke="#3a4a6b"/><text x="426" y="118" fill="#e8edf7" font-size="10" text-anchor="middle">banco</text></g>
    <path class="dw" style="animation-delay:.8s" d="M276 114 H246" stroke="#34d399" stroke-width="2.5" fill="none"/>
    <path class="dp" style="animation-delay:1.1s" d="M246 114 l9 -5 v10 z" fill="#34d399"/>
    <text class="dp" style="animation-delay:1.15s" x="260" y="104" fill="#34d399" font-size="9.5" text-anchor="middle">só saída</text>
    <path class="dw" style="animation-delay:.9s" d="M94 56 V36" stroke="#ff9a2e" stroke-width="2.5" fill="none"/>
    <text class="dp" style="animation-delay:1.2s" x="110" y="34" fill="#ffc182" font-size="10">Internet Gateway</text>
    <text class="dp" style="animation-delay:1.35s" x="260" y="200" fill="#fb7185" font-size="11" text-anchor="middle">O NAT fica na sub-rede PÚBLICA e serve a privada.</text>
    <text class="dp" style="animation-delay:1.45s" x="260" y="222" fill="#6b7a99" font-size="11" text-anchor="middle">Ele deixa sair e não deixa entrar. O IGW é o que torna a sub-rede pública.</text>
  </svg>`,

  rbacPolicy: `<svg class="diag" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">
    <rect class="dp" style="animation-delay:.05s" x="8" y="28" width="156" height="150" rx="14" fill="#15243c" stroke="#3b9dff" stroke-width="2"/>
    <text class="dp" style="animation-delay:.15s" x="86" y="56" fill="#8dc8ff" font-size="13" text-anchor="middle">RBAC</text>
    <text class="dp" style="animation-delay:.2s" x="86" y="80" fill="#e8edf7" font-size="11" text-anchor="middle">QUEM pode</text>
    <text class="dp" style="animation-delay:.25s" x="86" y="98" fill="#e8edf7" font-size="11" text-anchor="middle">fazer o que</text>
    <text class="dp" style="animation-delay:.3s" x="86" y="128" fill="#9aa8c4" font-size="10" text-anchor="middle">Leitor / Colaborador</text>
    <text class="dp" style="animation-delay:.3s" x="86" y="144" fill="#9aa8c4" font-size="10" text-anchor="middle">Proprietario</text>
    <rect class="dp" style="animation-delay:.45s" x="182" y="28" width="156" height="150" rx="14" fill="#2e2410" stroke="#fbbf24" stroke-width="2"/>
    <text class="dp" style="animation-delay:.55s" x="260" y="56" fill="#fbbf24" font-size="13" text-anchor="middle">Azure Policy</text>
    <text class="dp" style="animation-delay:.6s" x="260" y="80" fill="#e8edf7" font-size="11" text-anchor="middle">O QUE pode</text>
    <text class="dp" style="animation-delay:.65s" x="260" y="98" fill="#e8edf7" font-size="11" text-anchor="middle">existir</text>
    <text class="dp" style="animation-delay:.7s" x="260" y="128" fill="#9aa8c4" font-size="10" text-anchor="middle">So região X</text>
    <text class="dp" style="animation-delay:.7s" x="260" y="144" fill="#9aa8c4" font-size="10" text-anchor="middle">Exige tag custo</text>
    <rect class="dp" style="animation-delay:.85s" x="356" y="28" width="156" height="150" rx="14" fill="#2b0710" stroke="#fb7185" stroke-width="2"/>
    <text class="dp" style="animation-delay:.95s" x="434" y="56" fill="#fb7185" font-size="13" text-anchor="middle">Resource Lock</text>
    <text class="dp" style="animation-delay:1s" x="434" y="80" fill="#e8edf7" font-size="11" text-anchor="middle">NÃO deixa</text>
    <text class="dp" style="animation-delay:1.05s" x="434" y="98" fill="#e8edf7" font-size="11" text-anchor="middle">mexer</text>
    <text class="dp" style="animation-delay:1.1s" x="434" y="128" fill="#9aa8c4" font-size="10" text-anchor="middle">CanNotDelete</text>
    <text class="dp" style="animation-delay:1.1s" x="434" y="144" fill="#9aa8c4" font-size="10" text-anchor="middle">ReadOnly</text>
    <text class="dp" style="animation-delay:1.25s" x="260" y="205" fill="#6b7a99" font-size="11" text-anchor="middle">Lock vence RBAC: nem Proprietario apaga</text>
  </svg>`,

  regionAz: `<svg class="diag" viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg">
    <rect class="dp" style="animation-delay:.05s" x="10" y="20" width="230" height="150" rx="16" fill="#15243c" stroke="#3b9dff" stroke-width="2"/>
    <text class="dp" style="animation-delay:.1s" x="125" y="42" fill="#8dc8ff" font-size="12" text-anchor="middle">Região: Brazil South</text>
    <circle class="dp" style="animation-delay:.3s" cx="62" cy="100" r="26" fill="#1668c4"/><text class="dp" style="animation-delay:.35s" x="62" y="105" fill="#fff" font-size="12" text-anchor="middle">AZ1</text>
    <circle class="dp" style="animation-delay:.4s" cx="125" cy="100" r="26" fill="#1668c4"/><text class="dp" style="animation-delay:.45s" x="125" y="105" fill="#fff" font-size="12" text-anchor="middle">AZ2</text>
    <circle class="dp" style="animation-delay:.5s" cx="188" cy="100" r="26" fill="#1668c4"/><text class="dp" style="animation-delay:.55s" x="188" y="105" fill="#fff" font-size="12" text-anchor="middle">AZ3</text>
    <text class="dp" style="animation-delay:.6s" x="125" y="150" fill="#9aa8c4" font-size="10" text-anchor="middle">datacenters isolados, mesma região</text>
    <path class="dw" style="animation-delay:.75s" d="M248 95 H288" stroke="#fbbf24" stroke-width="3" fill="none"/>
    <path class="dp" style="animation-delay:1s" d="M288 95 l-9 -5 v10 z" fill="#fbbf24"/>
    <rect class="dp" style="animation-delay:.9s" x="296" y="48" width="214" height="94" rx="16" fill="#2e2410" stroke="#fbbf24" stroke-width="2"/>
    <text class="dp" style="animation-delay:1s" x="403" y="78" fill="#fbbf24" font-size="12" text-anchor="middle">Par de região</text>
    <text class="dp" style="animation-delay:1.05s" x="403" y="100" fill="#e8edf7" font-size="12" text-anchor="middle">South Central US</text>
    <text class="dp" style="animation-delay:1.1s" x="403" y="122" fill="#9aa8c4" font-size="10" text-anchor="middle">a +2000 km, para desastre regional</text>
    <text class="dp" style="animation-delay:1.3s" x="260" y="205" fill="#6b7a99" font-size="11" text-anchor="middle">AZ protege de queda de datacenter. Par de região protege da região inteira.</text>
  </svg>`,

  blobTiers: `<svg class="diag" viewBox="0 0 520 215" xmlns="http://www.w3.org/2000/svg">
    <g class="dp" style="animation-delay:.05s"><rect x="10" y="30" width="118" height="110" rx="12" fill="#2b1414" stroke="#fb7185" stroke-width="2"/>
    <text x="69" y="54" fill="#fb7185" font-size="12" text-anchor="middle">Hot</text>
    <text x="69" y="78" fill="#e8edf7" font-size="10" text-anchor="middle">armazenar $$$</text>
    <text x="69" y="96" fill="#9aa8c4" font-size="10" text-anchor="middle">ler barato</text>
    <text x="69" y="122" fill="#6b7a99" font-size="9" text-anchor="middle">sem mínimo</text></g>
    <g class="dp" style="animation-delay:.3s"><rect x="138" y="30" width="118" height="110" rx="12" fill="#15243c" stroke="#3b9dff" stroke-width="2"/>
    <text x="197" y="54" fill="#8dc8ff" font-size="12" text-anchor="middle">Cool</text>
    <text x="197" y="78" fill="#e8edf7" font-size="10" text-anchor="middle">armazenar $$</text>
    <text x="197" y="96" fill="#9aa8c4" font-size="10" text-anchor="middle">ler medio</text>
    <text x="197" y="122" fill="#6b7a99" font-size="9" text-anchor="middle">min 30 dias</text></g>
    <g class="dp" style="animation-delay:.55s"><rect x="266" y="30" width="118" height="110" rx="12" fill="#0f2430" stroke="#38bdf8" stroke-width="2"/>
    <text x="325" y="54" fill="#7dd3fc" font-size="12" text-anchor="middle">Cold</text>
    <text x="325" y="78" fill="#e8edf7" font-size="10" text-anchor="middle">armazenar $</text>
    <text x="325" y="96" fill="#9aa8c4" font-size="10" text-anchor="middle">ler caro</text>
    <text x="325" y="122" fill="#6b7a99" font-size="9" text-anchor="middle">min 90 dias</text></g>
    <g class="dp" style="animation-delay:.8s"><rect x="394" y="30" width="118" height="110" rx="12" fill="#1c1630" stroke="#a78bfa" stroke-width="2"/>
    <text x="453" y="54" fill="#c4b5fd" font-size="12" text-anchor="middle">Archive</text>
    <text x="453" y="78" fill="#e8edf7" font-size="10" text-anchor="middle">quase de graca</text>
    <text x="453" y="96" fill="#fbbf24" font-size="10" text-anchor="middle">OFFLINE</text>
    <text x="453" y="122" fill="#6b7a99" font-size="9" text-anchor="middle">min 180 dias</text></g>
    <text class="dp" style="animation-delay:1.05s" x="260" y="172" fill="#fbbf24" font-size="11" text-anchor="middle">Archive precisa de reidratação: horas, não segundos</text>
    <text class="dp" style="animation-delay:1.2s" x="260" y="196" fill="#6b7a99" font-size="11" text-anchor="middle">Quanto mais frio, mais barato guardar e mais caro ler</text>
  </svg>`,

  sgNacl: `<svg class="diag" viewBox="0 0 520 225" xmlns="http://www.w3.org/2000/svg">
    <rect class="dp" style="animation-delay:.05s" x="10" y="22" width="240" height="160" rx="14" fill="#2a1a08" stroke="#ff9a2e" stroke-width="2"/>
    <text class="dp" style="animation-delay:.1s" x="130" y="46" fill="#ffc182" font-size="13" text-anchor="middle">Security Group</text>
    <text class="dp" style="animation-delay:.2s" x="130" y="72" fill="#34d399" font-size="11" text-anchor="middle">STATEFUL</text>
    <text class="dp" style="animation-delay:.3s" x="130" y="96" fill="#e8edf7" font-size="10.5" text-anchor="middle">liberou entrada,</text>
    <text class="dp" style="animation-delay:.35s" x="130" y="112" fill="#e8edf7" font-size="10.5" text-anchor="middle">a volta sai sozinha</text>
    <text class="dp" style="animation-delay:.45s" x="130" y="138" fill="#9aa8c4" font-size="10" text-anchor="middle">só regra de ALLOW</text>
    <text class="dp" style="animation-delay:.5s" x="130" y="156" fill="#9aa8c4" font-size="10" text-anchor="middle">nivel da instância (ENI)</text>
    <rect class="dp" style="animation-delay:.6s" x="270" y="22" width="240" height="160" rx="14" fill="#15243c" stroke="#3b9dff" stroke-width="2"/>
    <text class="dp" style="animation-delay:.65s" x="390" y="46" fill="#8dc8ff" font-size="13" text-anchor="middle">Network ACL</text>
    <text class="dp" style="animation-delay:.75s" x="390" y="72" fill="#fb7185" font-size="11" text-anchor="middle">STATELESS</text>
    <text class="dp" style="animation-delay:.85s" x="390" y="96" fill="#e8edf7" font-size="10.5" text-anchor="middle">precisa liberar</text>
    <text class="dp" style="animation-delay:.9s" x="390" y="112" fill="#e8edf7" font-size="10.5" text-anchor="middle">entrada E saída</text>
    <text class="dp" style="animation-delay:1s" x="390" y="138" fill="#9aa8c4" font-size="10" text-anchor="middle">ALLOW e DENY, numeradas</text>
    <text class="dp" style="animation-delay:1.05s" x="390" y="156" fill="#9aa8c4" font-size="10" text-anchor="middle">nivel da sub-rede</text>
    <text class="dp" style="animation-delay:1.25s" x="260" y="208" fill="#fbbf24" font-size="11" text-anchor="middle">Bloquear um IP malicioso: só a NACL faz, porque SG não tem DENY</text>
  </svg>`,

  msgSvcs: `<svg class="diag" viewBox="0 0 520 235" xmlns="http://www.w3.org/2000/svg">
    <g class="dp" style="animation-delay:.05s"><rect x="10" y="20" width="156" height="120" rx="13" fill="#2a1a08" stroke="#ff9a2e" stroke-width="2"/>
    <text x="88" y="44" fill="#ffc182" font-size="12.5" text-anchor="middle">SQS</text>
    <text x="88" y="68" fill="#e8edf7" font-size="10.5" text-anchor="middle">fila, 1 consumidor</text>
    <text x="88" y="86" fill="#e8edf7" font-size="10.5" text-anchor="middle">puxa a mensagem</text>
    <text x="88" y="112" fill="#9aa8c4" font-size="10" text-anchor="middle">desacoplar e absorver</text>
    <text x="88" y="128" fill="#9aa8c4" font-size="10" text-anchor="middle">picos de carga</text></g>
    <g class="dp" style="animation-delay:.35s"><rect x="178" y="20" width="156" height="120" rx="13" fill="#15243c" stroke="#3b9dff" stroke-width="2"/>
    <text x="256" y="44" fill="#8dc8ff" font-size="12.5" text-anchor="middle">SNS</text>
    <text x="256" y="68" fill="#e8edf7" font-size="10.5" text-anchor="middle">pub/sub, N inscritos</text>
    <text x="256" y="86" fill="#e8edf7" font-size="10.5" text-anchor="middle">empurra a mensagem</text>
    <text x="256" y="112" fill="#9aa8c4" font-size="10" text-anchor="middle">1 evento para muitos</text>
    <text x="256" y="128" fill="#9aa8c4" font-size="10" text-anchor="middle">destinos (fan-out)</text></g>
    <g class="dp" style="animation-delay:.65s"><rect x="346" y="20" width="164" height="120" rx="13" fill="#1c1630" stroke="#a78bfa" stroke-width="2"/>
    <text x="428" y="44" fill="#c4b5fd" font-size="12.5" text-anchor="middle">EventBridge</text>
    <text x="428" y="68" fill="#e8edf7" font-size="10.5" text-anchor="middle">barramento com regras</text>
    <text x="428" y="86" fill="#e8edf7" font-size="10.5" text-anchor="middle">roteia por conteúdo</text>
    <text x="428" y="112" fill="#9aa8c4" font-size="10" text-anchor="middle">eventos de SaaS e AWS,</text>
    <text x="428" y="128" fill="#9aa8c4" font-size="10" text-anchor="middle">agendamento</text></g>
    <text class="dp" style="animation-delay:.95s" x="260" y="172" fill="#34d399" font-size="11" text-anchor="middle">Padrao classico: SNS -> várias filas SQS (fan-out durave)</text>
    <text class="dp" style="animation-delay:1.1s" x="260" y="200" fill="#fbbf24" font-size="11" text-anchor="middle">Precisa de ORDEM e reprocessar o histórico? Ai e Kinesis, não SQS.</text>
  </svg>`,

  iamRole: `<svg class="diag" viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg">
    <rect class="dp" style="animation-delay:.05s" x="14" y="38" width="130" height="86" rx="12" fill="#2a1a08" stroke="#ff9a2e" stroke-width="2"/>
    <text class="dp" style="animation-delay:.1s" x="79" y="70" fill="#ffc182" font-size="12" text-anchor="middle">EC2</text>
    <text class="dp" style="animation-delay:.15s" x="79" y="92" fill="#9aa8c4" font-size="10" text-anchor="middle">sua aplicação</text>
    <path class="dw" style="animation-delay:.3s" d="M152 80 H208" stroke="#34d399" stroke-width="3" fill="none"/>
    <path class="dp" style="animation-delay:.6s" d="M208 80 l-9 -5 v10 z" fill="#34d399"/>
    <rect class="dp" style="animation-delay:.5s" x="216" y="30" width="146" height="102" rx="12" fill="#0f3d2c" stroke="#34d399" stroke-width="2"/>
    <text class="dp" style="animation-delay:.6s" x="289" y="56" fill="#34d399" font-size="12" text-anchor="middle">IAM Role</text>
    <text class="dp" style="animation-delay:.65s" x="289" y="78" fill="#e8edf7" font-size="10.5" text-anchor="middle">credencial temporária</text>
    <text class="dp" style="animation-delay:.7s" x="289" y="96" fill="#e8edf7" font-size="10.5" text-anchor="middle">rotaciona sozinha</text>
    <text class="dp" style="animation-delay:.75s" x="289" y="118" fill="#9aa8c4" font-size="10" text-anchor="middle">instance profile</text>
    <path class="dw" style="animation-delay:.85s" d="M370 80 H426" stroke="#34d399" stroke-width="3" fill="none"/>
    <path class="dp" style="animation-delay:1.15s" d="M426 80 l-9 -5 v10 z" fill="#34d399"/>
    <rect class="dp" style="animation-delay:1.05s" x="434" y="38" width="76" height="86" rx="12" fill="#15243c" stroke="#3b9dff" stroke-width="2"/>
    <text class="dp" style="animation-delay:1.15s" x="472" y="86" fill="#8dc8ff" font-size="12" text-anchor="middle">S3</text>
    <text class="dp" style="animation-delay:1.35s" x="260" y="166" fill="#fb7185" font-size="11.5" text-anchor="middle">NUNCA: access key gravada no código ou na imagem</text>
    <text class="dp" style="animation-delay:1.5s" x="260" y="190" fill="#6b7a99" font-size="11" text-anchor="middle">Chave estatica não expira, vaza no Git e ninguem percebe</text>
  </svg>`,

  savings: `<svg class="diag" viewBox="0 0 520 215" xmlns="http://www.w3.org/2000/svg">
    <g class="dp" style="animation-delay:.05s"><rect x="10" y="26" width="118" height="112" rx="12" fill="#1d283f" stroke="#3a4a6b" stroke-width="2"/>
    <text x="69" y="50" fill="#e8edf7" font-size="12" text-anchor="middle">On-Demand</text>
    <text x="69" y="76" fill="#9aa8c4" font-size="10" text-anchor="middle">sem compromisso</text>
    <text x="69" y="100" fill="#fb7185" font-size="13" text-anchor="middle">0%</text>
    <text x="69" y="122" fill="#6b7a99" font-size="9" text-anchor="middle">carga imprevisivel</text></g>
    <g class="dp" style="animation-delay:.3s"><rect x="138" y="26" width="118" height="112" rx="12" fill="#15243c" stroke="#3b9dff" stroke-width="2"/>
    <text x="197" y="50" fill="#8dc8ff" font-size="12" text-anchor="middle">Savings Plan</text>
    <text x="197" y="76" fill="#9aa8c4" font-size="10" text-anchor="middle">compromisso $/h</text>
    <text x="197" y="100" fill="#34d399" font-size="13" text-anchor="middle">até ~72%</text>
    <text x="197" y="122" fill="#6b7a99" font-size="9" text-anchor="middle">flexivel: EC2+Fargate+Lambda</text></g>
    <g class="dp" style="animation-delay:.55s"><rect x="266" y="26" width="118" height="112" rx="12" fill="#1c2e1a" stroke="#84cc16" stroke-width="2"/>
    <text x="325" y="50" fill="#bef264" font-size="12" text-anchor="middle">Reserved</text>
    <text x="325" y="76" fill="#9aa8c4" font-size="10" text-anchor="middle">compromisso 1-3 anos</text>
    <text x="325" y="100" fill="#34d399" font-size="13" text-anchor="middle">até ~72%</text>
    <text x="325" y="122" fill="#6b7a99" font-size="9" text-anchor="middle">amarra família/região</text></g>
    <g class="dp" style="animation-delay:.8s"><rect x="394" y="26" width="118" height="112" rx="12" fill="#2e2410" stroke="#fbbf24" stroke-width="2"/>
    <text x="453" y="50" fill="#fbbf24" font-size="12" text-anchor="middle">Spot</text>
    <text x="453" y="76" fill="#9aa8c4" font-size="10" text-anchor="middle">capacidade sobrando</text>
    <text x="453" y="100" fill="#34d399" font-size="13" text-anchor="middle">até ~90%</text>
    <text x="453" y="122" fill="#fb7185" font-size="9" text-anchor="middle">pode morrer em 2 min</text></g>
    <text class="dp" style="animation-delay:1.05s" x="260" y="170" fill="#fb7185" font-size="11.5" text-anchor="middle">Pegadinha: Spot em banco de dados ou carga que não pode cair = resposta errada</text>
    <text class="dp" style="animation-delay:1.2s" x="260" y="194" fill="#6b7a99" font-size="11" text-anchor="middle">Carga estavel 24/7 -> Savings Plan. Pico curto -> On-Demand. Lote tolerante -> Spot.</text>
  </svg>`,

  entra: `<svg class="diag" viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
    <rect class="dp" style="animation-delay:.05s" x="14" y="26" width="226" height="126" rx="14" fill="#15243c" stroke="#3b9dff" stroke-width="2"/>
    <text class="dp" style="animation-delay:.1s" x="127" y="50" fill="#8dc8ff" font-size="12.5" text-anchor="middle">Microsoft Entra ID</text>
    <text class="dp" style="animation-delay:.2s" x="127" y="74" fill="#e8edf7" font-size="10.5" text-anchor="middle">identidade em nuvem</text>
    <text class="dp" style="animation-delay:.25s" x="127" y="92" fill="#9aa8c4" font-size="10" text-anchor="middle">OAuth, SAML, OIDC, MFA</text>
    <text class="dp" style="animation-delay:.35s" x="127" y="118" fill="#fb7185" font-size="10" text-anchor="middle">NÃO tem Kerberos</text>
    <text class="dp" style="animation-delay:.4s" x="127" y="136" fill="#fb7185" font-size="10" text-anchor="middle">NÃO tem LDAP nem GPO</text>
    <rect class="dp" style="animation-delay:.6s" x="280" y="26" width="226" height="126" rx="14" fill="#2e2410" stroke="#fbbf24" stroke-width="2"/>
    <text class="dp" style="animation-delay:.65s" x="393" y="50" fill="#fbbf24" font-size="12.5" text-anchor="middle">AD DS / Entra DS</text>
    <text class="dp" style="animation-delay:.75s" x="393" y="74" fill="#e8edf7" font-size="10.5" text-anchor="middle">domínio de verdade</text>
    <text class="dp" style="animation-delay:.8s" x="393" y="92" fill="#9aa8c4" font-size="10" text-anchor="middle">Kerberos, LDAP, GPO</text>
    <text class="dp" style="animation-delay:.9s" x="393" y="118" fill="#34d399" font-size="10" text-anchor="middle">app legado que precisa</text>
    <text class="dp" style="animation-delay:.95s" x="393" y="136" fill="#34d399" font-size="10" text-anchor="middle">entrar no domínio</text>
    <text class="dp" style="animation-delay:1.15s" x="260" y="182" fill="#6b7a99" font-size="11" text-anchor="middle">Pegadinha: app antigo pedindo LDAP não se resolve com Entra ID puro</text>
  </svg>`,

  s3classes: `<svg class="diag" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">
    <text class="dp" style="animation-delay:.05s" x="260" y="24" fill="#ffc182" font-size="12" text-anchor="middle">S3: durabilidade e sempre 11 noves. O que muda e ACESSO e AZ.</text>
    <g class="dp" style="animation-delay:.25s"><rect x="10" y="40" width="156" height="96" rx="12" fill="#2a1a08" stroke="#ff9a2e" stroke-width="2"/>
    <text x="88" y="64" fill="#ffc182" font-size="11.5" text-anchor="middle">Standard / Int-Tiering</text>
    <text x="88" y="88" fill="#e8edf7" font-size="10" text-anchor="middle">acesso imediato</text>
    <text x="88" y="106" fill="#34d399" font-size="10" text-anchor="middle">3+ AZ</text>
    <text x="88" y="126" fill="#6b7a99" font-size="9" text-anchor="middle">Int-Tiering move sozinho</text></g>
    <g class="dp" style="animation-delay:.5s"><rect x="178" y="40" width="156" height="96" rx="12" fill="#15243c" stroke="#3b9dff" stroke-width="2"/>
    <text x="256" y="64" fill="#8dc8ff" font-size="11.5" text-anchor="middle">Standard-IA</text>
    <text x="256" y="88" fill="#e8edf7" font-size="10" text-anchor="middle">acesso raro, imediato</text>
    <text x="256" y="106" fill="#34d399" font-size="10" text-anchor="middle">3+ AZ</text>
    <text x="256" y="126" fill="#6b7a99" font-size="9" text-anchor="middle">min 30 dias + taxa de leitura</text></g>
    <g class="dp" style="animation-delay:.75s"><rect x="346" y="40" width="164" height="96" rx="12" fill="#2b1414" stroke="#fb7185" stroke-width="2"/>
    <text x="428" y="64" fill="#fb7185" font-size="11.5" text-anchor="middle">One Zone-IA</text>
    <text x="428" y="88" fill="#e8edf7" font-size="10" text-anchor="middle">acesso raro, imediato</text>
    <text x="428" y="106" fill="#fb7185" font-size="10" text-anchor="middle">1 ÚNICA AZ</text>
    <text x="428" y="126" fill="#6b7a99" font-size="9" text-anchor="middle">AZ cai = dado indisponivel</text></g>
    <g class="dp" style="animation-delay:1s"><rect x="90" y="150" width="340" height="44" rx="12" fill="#1c1630" stroke="#a78bfa" stroke-width="2"/>
    <text x="260" y="170" fill="#c4b5fd" font-size="11.5" text-anchor="middle">Glacier Instant / Flexible / Deep Archive</text>
    <text x="260" y="187" fill="#9aa8c4" font-size="10" text-anchor="middle">Instant = ms. Flexible = minutos a horas. Deep = horas.</text></g>
  </svg>`,

  elastic: `<svg class="diag" viewBox="0 0 520 225" xmlns="http://www.w3.org/2000/svg">
    <text class="dp" style="animation-delay:.05s" x="260" y="22" fill="#9aa8c4" font-size="11" text-anchor="middle">demanda ao longo do dia</text>
    <path class="dw" style="animation-delay:.2s" d="M30 150 C110 150 120 60 190 60 C260 60 250 150 330 150 C400 150 410 95 490 95"
      stroke="#fbbf24" stroke-width="3" fill="none" stroke-dasharray="600" style="animation:draw 1.6s ease forwards"/>
    <path class="dw" style="animation-delay:.6s" d="M30 158 C110 158 120 70 190 70 C260 70 250 158 330 158 C400 158 410 104 490 104"
      stroke="#34d399" stroke-width="3" fill="none" stroke-dasharray="600" style="animation:draw 1.9s ease forwards"/>
    <text class="dp" style="animation-delay:1.3s" x="200" y="46" fill="#fbbf24" font-size="10.5">demanda real</text>
    <text class="dp" style="animation-delay:1.45s" x="330" y="182" fill="#34d399" font-size="10.5">capacidade acompanhando</text>
    <text class="dp" style="animation-delay:1.6s" x="260" y="206" fill="#e8edf7" font-size="11.5" text-anchor="middle">Elasticidade = sobe E desce sozinho</text>
  </svg>`,

  awsGlobal: `<svg class="diag" viewBox="0 0 520 215" xmlns="http://www.w3.org/2000/svg">
    <g class="dp" style="animation-delay:.05s"><rect x="10" y="26" width="118" height="100" rx="12" fill="#2a1a08" stroke="#ff9a2e" stroke-width="2"/>
    <text x="69" y="50" fill="#ffc182" font-size="11.5" text-anchor="middle">Região</text>
    <text x="69" y="74" fill="#e8edf7" font-size="10" text-anchor="middle">area geografica</text>
    <text x="69" y="92" fill="#9aa8c4" font-size="9.5" text-anchor="middle">tem várias AZ</text>
    <text x="69" y="112" fill="#6b7a99" font-size="9" text-anchor="middle">ex: sa-east-1</text></g>
    <g class="dp" style="animation-delay:.3s"><rect x="138" y="26" width="118" height="100" rx="12" fill="#15243c" stroke="#3b9dff" stroke-width="2"/>
    <text x="197" y="50" fill="#8dc8ff" font-size="11.5" text-anchor="middle">Zona (AZ)</text>
    <text x="197" y="74" fill="#e8edf7" font-size="10" text-anchor="middle">datacenter isolado</text>
    <text x="197" y="92" fill="#9aa8c4" font-size="9.5" text-anchor="middle">energia e rede propria</text>
    <text x="197" y="112" fill="#6b7a99" font-size="9" text-anchor="middle">alta disponibilidade</text></g>
    <g class="dp" style="animation-delay:.55s"><rect x="266" y="26" width="118" height="100" rx="12" fill="#1c1630" stroke="#a78bfa" stroke-width="2"/>
    <text x="325" y="50" fill="#c4b5fd" font-size="11.5" text-anchor="middle">Edge location</text>
    <text x="325" y="74" fill="#e8edf7" font-size="10" text-anchor="middle">cache do CloudFront</text>
    <text x="325" y="92" fill="#9aa8c4" font-size="9.5" text-anchor="middle">perto do usuário</text>
    <text x="325" y="112" fill="#6b7a99" font-size="9" text-anchor="middle">conteúdo, não servidor</text></g>
    <g class="dp" style="animation-delay:.8s"><rect x="394" y="26" width="118" height="100" rx="12" fill="#1c2e1a" stroke="#84cc16" stroke-width="2"/>
    <text x="453" y="50" fill="#bef264" font-size="11.5" text-anchor="middle">Local Zone</text>
    <text x="453" y="74" fill="#e8edf7" font-size="10" text-anchor="middle">computacao proxima</text>
    <text x="453" y="92" fill="#9aa8c4" font-size="9.5" text-anchor="middle">de uma cidade</text>
    <text x="453" y="112" fill="#6b7a99" font-size="9" text-anchor="middle">latencia de milissegundo</text></g>
    <text class="dp" style="animation-delay:1.05s" x="260" y="158" fill="#fbbf24" font-size="11" text-anchor="middle">Edge location NÃO roda sua aplicação: ela guarda copia de conteúdo</text>
    <text class="dp" style="animation-delay:1.2s" x="260" y="186" fill="#6b7a99" font-size="11" text-anchor="middle">Usuario longe reclamando de download lento -> CDN, não mais uma região</text>
  </svg>`,

  shared: `<svg class="diag" viewBox="0 0 520 215" xmlns="http://www.w3.org/2000/svg">
    <rect class="dp" style="animation-delay:.05s" x="40" y="22" width="440" height="56" rx="12" fill="#15243c" stroke="#3b9dff" stroke-width="2"/>
    <text class="dp" style="animation-delay:.1s" x="260" y="44" fill="#8dc8ff" font-size="12" text-anchor="middle">VOCÊ: seus dados, seus acessos, sua configuração</text>
    <text class="dp" style="animation-delay:.2s" x="260" y="64" fill="#9aa8c4" font-size="10" text-anchor="middle">quem entra, o que e publico, o que e criptografado</text>
    <path class="dw" style="animation-delay:.35s" d="M60 92 H460" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6 5" fill="none"/>
    <text class="dp" style="animation-delay:.5s" x="260" y="108" fill="#fbbf24" font-size="10" text-anchor="middle">a linha sobe conforme o serviço e mais gerenciado</text>
    <rect class="dp" style="animation-delay:.6s" x="40" y="120" width="440" height="56" rx="12" fill="#2a1a08" stroke="#ff9a2e" stroke-width="2"/>
    <text class="dp" style="animation-delay:.7s" x="260" y="142" fill="#ffc182" font-size="12" text-anchor="middle">PROVEDOR: prédio, rede física, hipervisor, hardware</text>
    <text class="dp" style="animation-delay:.8s" x="260" y="162" fill="#9aa8c4" font-size="10" text-anchor="middle">no PaaS/SaaS tambem o SÓ e o patch da plataforma</text>
    <text class="dp" style="animation-delay:1s" x="260" y="200" fill="#fb7185" font-size="11" text-anchor="middle">Seus DADOS e seus ACESSOS nunca saem do seu lado. Em nenhum modelo.</text>
  </svg>`
};

/* exam:"both" usa o mapa doms para cair no dominio certo de cada exame,
   porque o mesmo conceito tem peso e numeracao diferentes nas duas provas. */
const LESSONS = [
  {
    id:"l-az-models", exam:"az900", dom:"d1", concept:"modelos-nuvem", secs:78,
    title:"IaaS, PaaS e SaaS pela fronteira de administração",
    slides:[
      { k:"gancho", emoji:"\u{1F9F1}", h:"A pergunta é sempre a mesma", p:"Até onde vai o provedor e onde começa você. Responda isso e a questão se resolve." },
      { k:"analogia", emoji:"\u{1F355}", h:"Pense em comer pizza", p:"IaaS é comprar a massa e o recheio e assar em casa: a cozinha é sua. PaaS é pedir a pizza e usar a mesa do restaurante: você só come. SaaS é ir à casa de alguém, que faz tudo. O que nunca muda é que a fome é sua." },
      { k:"diagrama", diagram:"camadas", h:"A fronteira se move", p:"Quanto mais gerenciado, mais camadas ficam com o provedor." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"Onde a prova te pega", gotcha:"Em PaaS quem aplica patch do sistema operacional é o provedor, não você. E em SaaS a responsabilidade pelos dados e pelos acessos continua sendo sua: nenhum modelo transfere isso. Se a alternativa diz que no SaaS a classificação de dados passa ao provedor, está errada." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"Não quero administrar sistema operacional nem patch, só publicar minha API.", a:["PaaS","IaaS","SaaS"], c:0, e:"PaaS entrega plataforma pronta: você cuida do código e dos dados." },
      { q:"Em SaaS, quem responde pela classificação dos dados?", a:["Você","O provedor"], c:0, e:"Dados, identidades e acessos ficam com o cliente em todos os modelos." }
    ]
  },
  {
    id:"l-az-cost", exam:"az900", dom:"d3", concept:"custo-az", secs:80,
    title:"Quatro ferramentas de custo, quatro perguntas",
    slides:[
      { k:"gancho", emoji:"\u{1F4B8}", h:"Elas parecem a mesma coisa", p:"E não são. Cada uma responde uma pergunta diferente sobre dinheiro." },
      { k:"analogia", emoji:"\u{1F9FE}", h:"Pense na sua vida financeira", p:"A Calculadora de Preços é o orçamento da reforma antes de contratar. O TCO compara o custo de continuar no aluguel com o de comprar. O Cost Management é o extrato do mês. O Advisor é o amigo que olha o extrato e diz onde você está jogando dinheiro fora." },
      { k:"diagrama", diagram:"custoFerr", h:"Antes, depois e o que melhorar", p:"Repare no eixo do tempo: duas olham para frente, duas para trás." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"O gatilho no enunciado", gotcha:"Comparar com o datacenter próprio, incluindo energia, espaço e equipe, é sempre TCO, nunca a Calculadora de Preços, que só estima recursos do Azure. E alerta quando o gasto passar de um valor é orçamento no Cost Management, não Azure Monitor: o Monitor acompanha métrica técnica, não a fatura." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"Comparar o custo de 60 servidores locais com o custo no Azure, incluindo energia e equipe.", a:["Calculadora de TCO","Calculadora de Preços","Cost Management"], c:0, e:"Só o TCO modela o custo do seu datacenter atual." },
      { q:"Receber e-mail quando o gasto do mês passar de 80% do planejado.", a:["Orçamento no Cost Management","Azure Advisor","Azure Monitor"], c:0, e:"Orçamento com alerta é o instrumento feito exatamente para isso." }
    ]
  },
  {
    id:"l-aws-sec", exam:"clf", dom:"d2", concept:"seguranca-servicos", secs:86,
    title:"Serviços de segurança da AWS: um verbo para cada",
    slides:[
      { k:"gancho", emoji:"\u{1F50E}", h:"Sete nomes parecidos numa questão só", p:"A prova adora embaralhar. A saída é decorar o verbo de cada um." },
      { k:"analogia", emoji:"\u{1F3E2}", h:"Pense na segurança de um prédio", p:"O CloudTrail é o livro da portaria: quem entrou, quando. O Config é o checklist de manutenção: o extintor está no lugar? O GuardDuty é o segurança que percebe movimento estranho. O Macie é quem descobre que tem documento confidencial largado na copa. O Artifact é o arquivo com os laudos para o fiscal." },
      { k:"diagrama", diagram:"awsVerbos", h:"Cada um com seu verbo", p:"Registra, detecta, classifica, compara, varre, entrega." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"As trocas mais comuns", gotcha:"CloudTrail registra chamada de API; CloudWatch mede métrica e log. Inspector procura vulnerabilidade de software, não dado pessoal: dado pessoal é Macie. Config avalia configuração, não distribui relatório de conformidade: isso é Artifact. E o Security Hub só agrega os achados, quem detecta ameaça é o GuardDuty." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"Descobrir se algum bucket tem dado pessoal sem proteção.", a:["Macie","Inspector","Config"], c:0, e:"Macie descobre e classifica dado sensível no S3." },
      { q:"Saber quem apagou um recurso e quando.", a:["CloudTrail","CloudWatch","GuardDuty"], c:0, e:"CloudTrail é o registro de auditoria das chamadas de API." }
    ]
  },
  {
    id:"l-aws-compute", exam:"clf", dom:"d3", concept:"compute-aws", secs:78,
    title:"EC2, Lambda ou Fargate",
    slides:[
      { k:"gancho", emoji:"\u2699", h:"Três dados decidem", p:"Quanto dura a execução, quão previsível é a carga e quanto você quer administrar." },
      { k:"analogia", emoji:"\u{1F695}", h:"Como ir ao trabalho", p:"Lambda é o aplicativo de corrida: você chama, usa e paga pela viagem. Fargate é o carro alugado por assinatura: você dirige, mas não cuida de manutenção. EC2 é o carro próprio: controle total e toda a responsabilidade junto." },
      { k:"diagrama", diagram:"computeEscolha", h:"Do evento curto à carga constante", p:"O eixo é duração e previsibilidade." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"Quando o Lambda deixa de ser a resposta", gotcha:"Lambda brilha em execução curta disparada por evento, com volume irregular. Se o enunciado fala em carga constante o dia inteiro, ou em processo que leva muitos minutos, ele perde a vantagem e a resposta vira contêiner ou instância. E se exigir controle do sistema operacional ou software legado, a resposta é EC2, por mais moderna que a alternativa sem servidor pareça." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"Converter imagens assim que chegam no S3: 8 segundos cada, às vezes zero por hora, às vezes cinco mil em minutos.", a:["Lambda","EC2 reservada","AWS Batch"], c:0, e:"Curto, por evento e muito irregular: caso natural do Lambda." },
      { q:"Software legado que exige uma versão específica do sistema operacional.", a:["EC2","Lambda","Fargate"], c:0, e:"Controle do sistema operacional só em EC2." }
    ]
  },
  {
    id:"l-aws-vpc", exam:"clf", dom:"d3", concept:"rede-aws", secs:84,
    title:"Sub-rede pública, privada e o NAT",
    slides:[
      { k:"gancho", emoji:"\u{1F310}", h:"O que torna uma sub-rede pública", p:"Não é o nome. É a rota." },
      { k:"analogia", emoji:"\u{1F3E0}", h:"Pense num condomínio", p:"O Internet Gateway é o portão da rua: quem tem caminho até ele está na parte pública. O NAT Gateway é o porteiro que leva sua encomenda até a rua e traz a resposta, sem deixar ninguém de fora entrar no seu apartamento." },
      { k:"diagrama", diagram:"vpcSub", h:"Onde cada peça fica", p:"O NAT mora na sub-rede pública e atende a privada." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"Os três erros clássicos", gotcha:"O NAT Gateway fica na sub-rede PÚBLICA, nunca na privada que ele atende. Dar IP elástico a uma instância privada a torna alcançável de fora e quebra o requisito. E não existe VPC Endpoint para a internet em geral: endpoint dá caminho privado para serviços da AWS, como S3 e DynamoDB. Para alta disponibilidade, um NAT por zona." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"Instâncias privadas precisam baixar atualização, sem aceitar conexão de fora.", a:["NAT Gateway na sub-rede pública","Internet Gateway na sub-rede privada","IP elástico em cada instância"], c:0, e:"O NAT permite saída e não aceita entrada." },
      { q:"Tráfego para o S3 não pode passar pela internet pública.", a:["VPC Endpoint","NAT Gateway","Internet Gateway"], c:0, e:"O endpoint cria caminho privado até o serviço da AWS." }
    ]
  },
  {
    id:"l-az-elastic", exam:"az900", dom:"d1", concept:"elasticidade", secs:72,
    title:"Elasticidade, escalabilidade e agilidade",
    slides:[
      { k:"gancho", emoji:"\u{1F4C8}", h:"Tres palavras que a prova troca de proposito", p:"Elas parecem sinonimo e nao sao. A diferenca vale ponto." },
      { k:"analogia", emoji:"\u{1F371}", h:"Pense num restaurante", p:"Escalabilidade e poder colocar mais mesas quando precisar. Elasticidade e colocar e tirar mesas sozinho conforme o movimento. Agilidade e conseguir abrir uma filial nova em uma tarde, para testar uma ideia." },
      { k:"diagrama", diagram:"elastic", h:"Capacidade seguindo a demanda", p:"A marca da elasticidade e o automatismo nos DOIS sentidos." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"Como decidir no enunciado", gotcha:"Se o texto diz que a capacidade aumenta E diminui automaticamente conforme a metrica, a resposta e elasticidade. Se diz apenas que o sistema suporta crescer, e escalabilidade. Se o tema e provisionar um ambiente novo em minutos para testar, e agilidade. E lembre: escalar vertical e aumentar a maquina; horizontal e somar maquinas." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"A capacidade sobe no pico e cai sozinha na madrugada.", a:["Elasticidade","Agilidade","Tolerancia a falhas"], c:0, e:"Automatico e nos dois sentidos: elasticidade." },
      { q:"Criar um ambiente de teste completo em 10 minutos para validar uma ideia.", a:["Agilidade","Elasticidade","Alta disponibilidade"], c:0, e:"Velocidade de provisionar e experimentar e agilidade." }
    ]
  },
  {
    id:"l-az-rbac", exam:"az900", dom:"d3", concept:"rbac-policy-lock", secs:82,
    title:"RBAC x Azure Policy x Lock",
    slides:[
      { k:"gancho", emoji:"⚡", h:"Tres coisas que a prova adora trocar", p:"Se voce confundir essas tres, perde questao de graca no AZ-900 e no AZ-104." },
      { k:"analogia", emoji:"\u{1F3E2}", h:"Pense num predio", p:"RBAC e o cracha: diz quem entra em qual andar. A Policy e o regulamento do condominio: diz o que pode ser construido. O Lock e a fita de obra: ninguem mexe, nem o sindico." },
      { k:"diagrama", diagram:"rbacPolicy", h:"Cada um responde uma pergunta diferente", p:"RBAC = QUEM. Policy = O QUE. Lock = NAO MEXE." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"A pegadinha classica", gotcha:"O enunciado diz: impedir que QUALQUER pessoa crie recurso fora do Brazil South. Muita gente marca RBAC. Errado: RBAC nao sabe o que e regiao, ele so distribui permissao. A resposta e Azure Policy. E para impedir que alguem apague um recurso critico mesmo sendo Proprietario, a resposta e Resource Lock, nao RBAC." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"Impedir a criacao de VMs de tamanho caro em toda a assinatura.", a:["Azure Policy","RBAC","Resource Lock"], c:0, e:"Policy restringe O QUE pode existir, inclusive SKUs permitidos." },
      { q:"Impedir que um Proprietario apague por acidente o banco de producao.", a:["RBAC Leitor","Resource Lock CanNotDelete","Azure Policy"], c:1, e:"O lock vale acima do RBAC: nem Proprietario apaga sem remover o lock antes." }
    ]
  },
  {
    id:"l-az-region", exam:"az900", dom:"d2", concept:"region-az-pair", secs:78,
    title:"Regiao, Zona e Par de Regiao",
    slides:[
      { k:"gancho", emoji:"\u{1F30E}", h:"Alta disponibilidade ou recuperacao de desastre?", p:"Sao duas perguntas diferentes e a resposta certa muda." },
      { k:"analogia", emoji:"\u{1F3EC}", h:"Pense em lojas", p:"Zonas sao lojas diferentes no mesmo bairro: se uma pega fogo, as outras atendem. O par de regiao e a loja em outro estado: serve quando o bairro inteiro alaga." },
      { k:"diagrama", diagram:"regionAz", h:"Escala de protecao", p:"Zona protege de datacenter. Par de regiao protege de desastre regional." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"Onde todo mundo erra", gotcha:"Grupo de recursos NAO e limite de regiao: ele guarda metadados em uma regiao, mas pode conter recursos de varias regioes. E atualizacao planejada do Azure nao sai nas duas regioes do par ao mesmo tempo, exatamente para voce nunca perder as duas de uma vez. Brazil South tem como par o South Central US." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"Proteger uma aplicacao da queda de um datacenter dentro da mesma regiao.", a:["Zonas de disponibilidade","Par de regiao","Grupo de recursos separado"], c:0, e:"Zonas sao datacenters isolados na mesma regiao, com energia e rede independentes." },
      { q:"Um grupo de recursos pode conter recursos de regioes diferentes?", a:["Sim","Nao"], c:0, e:"Pode. A regiao do grupo so define onde ficam os metadados." }
    ]
  },
  {
    id:"l-az-blob", exam:"az900", dom:"d2", concept:"blob-tiers", secs:74,
    title:"Camadas do Blob Storage",
    slides:[
      { k:"gancho", emoji:"\u{1F9CA}", h:"Quanto mais frio, mais barato guardar", p:"E mais caro e mais lento ler. Toda questao de custo de storage gira nisso." },
      { k:"analogia", emoji:"\u{1F4E6}", h:"Pense no seu armario", p:"Hot e a gaveta ao lado da cama. Cool e o alto do guarda-roupa. Cold e a caixa em cima do armario. Archive e o deposito no outro bairro: baratissimo, mas voce espera horas para buscar." },
      { k:"diagrama", diagram:"blobTiers", h:"As quatro camadas", p:"Hot, Cool, Cold e Archive, com minimos de 0, 30, 90 e 180 dias." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"A pegadinha de prova", gotcha:"Se o enunciado disser que o arquivo precisa ser lido em segundos, Archive esta eliminado, por mais barato que seja: Archive e offline e exige reidratacao que leva horas. E se disser que o dado sai antes do minimo da camada, existe taxa de exclusao antecipada: mover tudo para Cold pode sair mais caro." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"Backup legal de 7 anos, acesso quase nunca, resgate pode levar horas.", a:["Archive","Hot","Cool"], c:0, e:"Caso exato do Archive: minimo 180 dias e resgate em horas." },
      { q:"Arquivo auditado 2 vezes por ano, mas que precisa abrir na hora quando pedem.", a:["Archive","Cool ou Cold","Hot"], c:1, e:"Acesso raro mas imediato: Cool ou Cold. Archive cairia por causa da reidratacao." }
    ]
  },
  {
    id:"l-az-entra", exam:"az900", dom:"d2", concept:"entra-vs-adds", secs:70,
    title:"Entra ID nao e controlador de dominio",
    slides:[
      { k:"gancho", emoji:"\u{1F511}", h:"O erro mais caro de identidade no Azure", p:"Trocar Entra ID por AD DS custa questao na prova e retrabalho no projeto." },
      { k:"analogia", emoji:"\u{1F6AA}", h:"Catraca x cadeado", p:"Entra ID e a catraca moderna da portaria: cracha digital, token, aprovacao no celular. AD DS e o cadeado antigo: o app legado so abre com aquela chave especifica." },
      { k:"diagrama", diagram:"entra", h:"Protocolos diferentes", p:"Entra ID fala OAuth, SAML e OIDC. Kerberos, LDAP e GPO ficam no AD DS." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"Gatilho no enunciado", gotcha:"Se aparecer LDAP, Kerberos, Group Policy ou ingresso em dominio, a resposta NAO e Entra ID puro: e Microsoft Entra Domain Services ou um controlador de dominio em VM. Entra ID tambem nao e uma extensao do seu AD local, mesmo com sincronizacao: sao diretorios diferentes." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"App legado que precisa autenticar via LDAP, sem alterar o codigo.", a:["Entra ID puro","Entra Domain Services ou AD DS em VM","Chave SSH"], c:1, e:"LDAP e Kerberos exigem servicos de dominio, nao o Entra ID puro." },
      { q:"Login unico em um SaaS moderno com MFA.", a:["Entra ID","AD DS em VM"], c:0, e:"Caso classico do Entra ID: SAML/OIDC e MFA." }
    ]
  },
  {
    id:"l-aws-global", exam:"clf", dom:"d1", concept:"infra-global", secs:76,
    title:"Regiao, AZ, Edge e Local Zone",
    slides:[
      { k:"gancho", emoji:"\u{1F310}", h:"Quatro camadas da infraestrutura global", p:"Confundir edge location com regiao e erro classico de prova." },
      { k:"analogia", emoji:"\u{1F4E6}", h:"Pense numa rede de lojas", p:"A regiao e a cidade. As zonas sao lojas diferentes nessa cidade. O ponto de presenca e o armario de entregas do seu predio: so guarda copia do que ja existe. A Local Zone e uma mini-loja no seu bairro, que consegue atender de verdade." },
      { k:"diagrama", diagram:"awsGlobal", h:"O que cada camada faz", p:"Regiao e geografia, AZ e isolamento, edge e cache, Local Zone e computacao proxima." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"O detalhe que elimina alternativa", gotcha:"Ponto de presenca nao executa a sua aplicacao: ele guarda conteudo em cache para o CloudFront. Se o enunciado fala em usuario distante reclamando de download lento, a resposta e CDN, nao abrir outra regiao. E alta disponibilidade dentro da mesma regiao vem de usar varias AZ, nao varias regioes." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"Usuarios na America do Sul reclamam de download lento de arquivos no S3 em us-east-1.", a:["CloudFront com pontos de presenca","Mais uma zona de disponibilidade","Auto Scaling"], c:0, e:"Conteudo estatico distante do usuario: a resposta e CDN." },
      { q:"Proteger a aplicacao contra a queda de um datacenter dentro da regiao.", a:["Distribuir entre varias AZ","Usar pontos de presenca","Usar instancias maiores"], c:0, e:"AZ sao datacenters isolados: e a base da alta disponibilidade regional." }
    ]
  },
  {
    id:"l-aws-sgnacl", exam:"clf", dom:"d2", concept:"sg-vs-nacl", secs:80,
    title:"Security Group x Network ACL",
    slides:[
      { k:"gancho", emoji:"\u{1F6E1}", h:"Stateful x stateless em 80 segundos", p:"Essa dupla aparece em praticamente toda prova de AWS." },
      { k:"analogia", emoji:"\u{1F3AF}", h:"Porteiro com memoria", p:"O Security Group e um porteiro que lembra de voce: deixou entrar, deixa sair sem perguntar. A NACL e um porteiro amnesico: na saida ele pergunta tudo de novo, entao voce precisa liberar os dois sentidos." },
      { k:"diagrama", diagram:"sgNacl", h:"Onde cada um atua", p:"SG na instancia, so com ALLOW. NACL na sub-rede, com ALLOW e DENY numerados." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"A pegadinha que derruba gente boa", gotcha:"Precisa BLOQUEAR um IP especifico que esta atacando? Security Group nao consegue, porque ele so tem regra de permissao: nao existe deny em SG. A resposta e NACL. E ao usar NACL para abrir uma porta, lembre de liberar tambem as portas efemeras na saida, senao a resposta nunca volta." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"Bloquear um unico IP de origem que esta atacando a sub-rede.", a:["Network ACL","Security Group","IAM Policy"], c:0, e:"Somente a NACL tem regra de DENY. O SG so permite." },
      { q:"Liberei a porta 443 de entrada no Security Group. Preciso criar regra de saida para a resposta?", a:["Sim","Nao"], c:1, e:"SG e stateful: a resposta da conexao permitida volta automaticamente." }
    ]
  },
  {
    id:"l-aws-msg", exam:"clf", dom:"d3", concept:"sqs-sns-eb", secs:86,
    title:"SQS x SNS x EventBridge",
    slides:[
      { k:"gancho", emoji:"\u{1F4EC}", h:"Tres servicos de mensagem, tres problemas", p:"Marcar o errado aqui e o jeito mais rapido de perder ponto em integracao." },
      { k:"analogia", emoji:"\u{1F3E4}", h:"Correio, radio e triagem", p:"SQS e a caixa postal: a carta fica esperando e um carteiro leva. SNS e o radio: anuncia e todo mundo inscrito ouve na hora. EventBridge e a central de triagem: le o conteudo e decide para qual setor mandar." },
      { k:"diagrama", diagram:"msgSvcs", h:"Fila, publicacao e roteamento", p:"SQS desacopla. SNS distribui. EventBridge roteia por regra." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"Palavras que decidem a resposta", gotcha:"Absorver pico de carga sem perder pedido: SQS. Um evento que precisa chegar a varios destinos ao mesmo tempo: SNS. Reagir a eventos de servicos AWS ou de SaaS, filtrando por conteudo, ou agendar execucao: EventBridge. Se o enunciado exigir ORDEM e poder reprocessar o historico, nao e nenhum dos tres: e Kinesis." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"A cada upload, tres sistemas diferentes precisam ser avisados ao mesmo tempo.", a:["SNS","SQS","Nenhum"], c:0, e:"Fan-out: um publisher, varios inscritos. Padrao comum: SNS para varias filas SQS." },
      { q:"O processamento e lento e nao pode perder pedido quando chega pico de 10x.", a:["SQS","SNS"], c:0, e:"A fila absorve o pico e o consumidor processa no ritmo que aguenta." }
    ]
  },
  {
    id:"l-aws-iam", exam:"clf", dom:"d2", concept:"iam-role-ec2", secs:72,
    title:"IAM Role em vez de access key",
    slides:[
      { k:"gancho", emoji:"\u{1F510}", h:"A resposta certa e quase sempre role", p:"Qualquer questao em que uma aplicacao da AWS acessa outro servico da AWS." },
      { k:"analogia", emoji:"\u{1F3AB}", h:"Cracha de visitante", p:"Access key e uma chave de casa copiada: vale para sempre e voce nao sabe quem tem. Role e um cracha de visitante que expira sozinho no fim do dia." },
      { k:"diagrama", diagram:"iamRole", h:"Como a aplicacao autentica", p:"EC2 assume a role via instance profile e recebe credencial temporaria." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"Sinais de alternativa errada", gotcha:"Se a alternativa fala em gravar chave de acesso no codigo, em variavel de ambiente, na imagem da instancia ou passar por user data, pode descartar. Tambem descarte usar o usuario root para a aplicacao. Para credencial de terceiro que nao e da AWS, a resposta tende a Secrets Manager, nao role." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"Aplicacao em EC2 precisa ler um bucket S3. Qual a forma recomendada?",
        a:["IAM Role anexada a instancia","Access key no arquivo de configuracao","Usuario root"], c:0, e:"Credencial temporaria, rotacionada pela AWS, sem segredo no codigo." },
      { q:"Guardar a senha de um banco MySQL de terceiro, com rotacao automatica.", a:["Secrets Manager","IAM Role","Security Group"], c:0, e:"Role nao guarda senha de sistema externo. Secrets Manager faz rotacao." }
    ]
  },
  {
    id:"l-aws-cost", exam:"clf", dom:"d4", concept:"pricing-models", secs:84,
    title:"On-Demand, Savings Plan, Reserved e Spot",
    slides:[
      { k:"gancho", emoji:"\u{1F4B0}", h:"Quatro formas de pagar computacao", p:"A questao sempre da uma pista do perfil da carga. Ache a pista e a resposta aparece." },
      { k:"analogia", emoji:"\u{1F697}", h:"Como alugar carro", p:"On-Demand e diaria no balcao. Savings Plan e um contrato de gasto mensal com desconto. Reserved e alugar aquele modelo por um ano. Spot e pegar o carro que sobrou no patio: baratissimo, mas podem pedir de volta em 2 minutos." },
      { k:"diagrama", diagram:"savings", h:"Compromisso x desconto", p:"Quanto mais compromisso, maior o desconto e menor a flexibilidade." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"O que elimina alternativa", gotcha:"Se a carga nao pode ser interrompida, Spot esta eliminado, por mais barato que seja. Se o enunciado fala em trocar de familia, regiao ou ate migrar para Fargate e Lambda, prefira Savings Plan em vez de Reserved padrao. Pico curto e imprevisivel que nao vale compromisso: On-Demand mesmo." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"Processamento de lote a noite, pode ser interrompido e reiniciado.", a:["Spot","Reserved de 3 anos","On-Demand"], c:0, e:"Tolerante a interrupcao: caso ideal de Spot, com o maior desconto." },
      { q:"Base estavel 24/7 por 3 anos, mas a equipe quer liberdade de trocar de familia e usar Fargate.", a:["Savings Plan de computacao","Reserved padrao","Spot"], c:0, e:"Savings Plan de computacao e flexivel entre familia, regiao, EC2, Fargate e Lambda." }
    ]
  },
  {
    id:"l-x-shared", exam:"both", doms:{ az900:"d1", clf:"d2" }, dom:"d1", concept:"shared-responsibility", secs:76,
    title:"Responsabilidade compartilhada (vale nas duas nuvens)",
    slides:[
      { k:"gancho", emoji:"⚖", h:"O conceito que aparece nas duas provas", p:"Azure e AWS cobram a mesma ideia com nomes diferentes." },
      { k:"analogia", emoji:"\u{1F3E0}", h:"Predio alugado", p:"O provedor cuida da estrutura, da fiacao e da portaria do predio. Voce cuida do que ha dentro do seu apartamento e de quem recebe a chave." },
      { k:"diagrama", diagram:"shared", h:"A linha se move", p:"Quanto mais gerenciado o servico, mais sobe a parte do provedor." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"O que NUNCA e do provedor", gotcha:"Seus dados, a classificacao deles, suas identidades e a configuracao de acesso sao sempre seus, em IaaS, PaaS ou SaaS. Bucket publico por engano e culpa sua, nao da AWS. Patch do sistema operacional: em VM ou EC2 e seu; em servico gerenciado como App Service ou RDS, o provedor aplica, mas voce ainda responde pelos usuarios e pelas regras de rede." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"Em um banco gerenciado (RDS ou Azure SQL), quem aplica patch no sistema operacional?", a:["O provedor","Voce"], c:0, e:"Em servico gerenciado o provedor cuida de SO e engine. Voce cuida de usuarios, rede e dados." },
      { q:"Um bucket S3 ficou publico por configuracao errada. De quem e a responsabilidade?", a:["Sua","Da AWS"], c:0, e:"Configuracao de acesso e dados sao sempre do cliente, em qualquer modelo." }
    ]
  },
  {
    id:"l-aws-s3", exam:"clf", dom:"d3", concept:"s3-classes", secs:80,
    title:"Classes de armazenamento do S3",
    slides:[
      { k:"gancho", emoji:"\u{1FAA3}", h:"Durabilidade nao e o que muda", p:"Quase toda classe tem os mesmos 11 noves de durabilidade. O que muda e acesso, AZ e preco." },
      { k:"analogia", emoji:"\u{1F5C4}", h:"Arquivo do escritorio", p:"Standard e a mesa. Standard-IA e o armario da sala. One Zone-IA e o armario de uma unica sala: se aquela sala fechar, voce nao alcanca. Glacier e o arquivo morto no subsolo." },
      { k:"diagrama", diagram:"s3classes", h:"Comparando as classes", p:"Repare em quem tem 3+ AZ e quem tem apenas uma." },
      { k:"pegadinha", emoji:"\u{1F6A8}", h:"Pistas do enunciado", gotcha:"Padrao de acesso desconhecido ou que muda: Intelligent-Tiering, porque ele move sozinho sem taxa de recuperacao. Dado que pode ser gerado de novo e voce quer o menor custo: One Zone-IA e aceitavel. Mas se o enunciado disser que nao pode perder o dado, One Zone-IA cai, porque ele vive em uma unica AZ." },
      { k:"quiz" }
    ],
    quiz:[
      { q:"Padrao de acesso imprevisivel e ninguem quer administrar ciclo de vida.", a:["S3 Intelligent-Tiering","Standard-IA","Glacier Deep Archive"], c:0, e:"Ele move o objeto entre camadas automaticamente, sem taxa de recuperacao." },
      { q:"Thumbnails que podem ser regerados a partir do original, com menor custo possivel.", a:["One Zone-IA","Standard","Glacier Flexible"], c:0, e:"Dado reproduzivel tolera uma unica AZ, e One Zone-IA e mais barato." }
    ]
  }
];

/* ============================================================
   EQUIVALÊNCIAS Azure <-> AWS (modo comparativo)
   ============================================================ */
const EQUIV = [
  { c:"Maquina virtual", az:"Azure Virtual Machines", aw:"Amazon EC2", n:"IaaS puro; patch do SO e seu nas duas." },
  { c:"Rede privada", az:"Virtual Network (VNet)", aw:"Amazon VPC", n:"Sub-redes, rotas e peering em ambas." },
  { c:"Permissao de quem faz o que", az:"Azure RBAC", aw:"AWS IAM", n:"IAM tambem cobre o que o Azure separa em Policy." },
  { c:"Regras do que pode existir", az:"Azure Policy", aw:"Service Control Policies (Organizations)", n:"SCP limita a conta inteira; Policy audita e nega recurso." },
  { c:"Objetos", az:"Blob Storage", aw:"Amazon S3", n:"Camadas: Hot/Cool/Cold/Archive x Standard/IA/Glacier." },
  { c:"Disco de bloco", az:"Managed Disks", aw:"Amazon EBS", n:"Presos a uma zona nas duas nuvens." },
  { c:"Compartilhamento de arquivo", az:"Azure Files", aw:"Amazon EFS / FSx", n:"EFS e NFS para Linux; Files tambem fala SMB." },
  { c:"Funcao serverless", az:"Azure Functions", aw:"AWS Lambda", n:"Limites de tempo de execucao diferentes; confira na doc." },
  { c:"Container gerenciado", az:"Container Apps / ACI", aw:"AWS Fargate", n:"Sem gerenciar no (worker) nas duas." },
  { c:"Kubernetes", az:"AKS", aw:"Amazon EKS", n:"Control plane gerenciado." },
  { c:"Banco relacional gerenciado", az:"Azure SQL Database", aw:"Amazon RDS / Aurora", n:"Provedor aplica patch; usuarios e dados sao seus." },
  { c:"NoSQL chave-valor", az:"Azure Cosmos DB", aw:"Amazon DynamoDB", n:"Cosmos tem varios modelos de API." },
  { c:"Data warehouse", az:"Microsoft Fabric / Synapse", aw:"Amazon Redshift", n:"OLAP, nao OLTP." },
  { c:"Cache em memoria", az:"Azure Cache for Redis", aw:"Amazon ElastiCache", n:"Reduz latencia de leitura repetida." },
  { c:"CDN", az:"Azure Front Door", aw:"Amazon CloudFront", n:"Front Door tambem faz balanceamento global." },
  { c:"DNS gerenciado", az:"Azure DNS / Traffic Manager", aw:"Amazon Route 53", n:"Politicas de roteamento equivalentes." },
  { c:"Balanceador camada 7", az:"Application Gateway", aw:"Application Load Balancer", n:"Roteia por caminho e host; WAF acoplavel." },
  { c:"Link privado dedicado", az:"ExpressRoute", aw:"AWS Direct Connect", n:"Nao passa pela internet publica." },
  { c:"Fila", az:"Azure Queue / Service Bus", aw:"Amazon SQS", n:"Service Bus tem topicos e transacoes." },
  { c:"Pub/sub", az:"Event Grid", aw:"Amazon SNS / EventBridge", n:"Event Grid roteia por assunto, como o EventBridge." },
  { c:"Streaming ordenado", az:"Event Hubs", aw:"Amazon Kinesis Data Streams", n:"Quando o enunciado pede ordem e reprocessamento." },
  { c:"Monitoramento", az:"Azure Monitor", aw:"Amazon CloudWatch", n:"Metricas, logs e alarmes." },
  { c:"Auditoria de API", az:"Activity Log", aw:"AWS CloudTrail", n:"Quem chamou qual API e quando." },
  { c:"Postura de seguranca", az:"Defender for Cloud", aw:"AWS Security Hub + GuardDuty", n:"Recomendacao e deteccao de ameaca." },
  { c:"SIEM", az:"Microsoft Sentinel", aw:"Amazon Security Lake + parceiros", n:"Correlacao e resposta a incidente." },
  { c:"Segredos", az:"Azure Key Vault", aw:"KMS + Secrets Manager", n:"Key Vault junta chave e segredo num servico." },
  { c:"Recomendacao de custo", az:"Azure Advisor", aw:"AWS Trusted Advisor", n:"Custo, seguranca, confiabilidade, desempenho." },
  { c:"Analise de gasto", az:"Cost Management", aw:"Cost Explorer + Budgets", n:"Orcamento com alerta nas duas." },
  { c:"Hierarquia de contas", az:"Management Groups + Assinaturas", aw:"AWS Organizations + Contas", n:"Politica herda de cima para baixo." },
  { c:"Estimativa antes de gastar", az:"Pricing Calculator / TCO", aw:"AWS Pricing Calculator", n:"TCO compara com on-premises." }
];
