/* ============================================================
   AULAS, DIAGRAMAS E BARALHOS — SAA-C03
   ============================================================ */
Object.assign(DIAGRAMS, {
sgnacl: `<svg class="diag" viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg">
    <text class="dp" style="animation-delay:.05s" x="260" y="16" fill="#9aa8c4" font-size="11" text-anchor="middle">um guarda estado, o outro não</text>
    <g class="dp" style="animation-delay:.2s">
      <rect x="16" y="34" width="488" height="88" rx="4" fill="none" stroke="#3b9dff" stroke-dasharray="4 3"/>
      <text x="30" y="52" fill="#8dc8ff" font-size="11">sub-rede · lista de controle de rede</text>
      <rect x="30" y="60" width="150" height="24" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="105" y="76" fill="#e8edf7" font-size="9" text-anchor="middle">regra 100 · permitir 443</text>
      <rect x="30" y="88" width="150" height="24" rx="3" fill="#2a0e0e" stroke="#ff5d5d"/><text x="105" y="104" fill="#ff9d9d" font-size="9" text-anchor="middle">regra 110 · negar 203.0.113.9</text>
      <rect x="196" y="60" width="160" height="24" rx="3" fill="#2a1a08" stroke="#ff9a2e"/><text x="276" y="76" fill="#ffc182" font-size="9" text-anchor="middle">entrada 1024-65535 · retorno</text>
      <text x="196" y="104" fill="#9aa8c4" font-size="9">sem estado: precisa da regra de volta</text>
      <text x="372" y="76" fill="#9aa8c4" font-size="9">numerada</text>
      <text x="372" y="92" fill="#9aa8c4" font-size="9">permite e nega</text>
      <text x="372" y="108" fill="#9aa8c4" font-size="9">a 1ª que casa decide</text>
    </g>
    <g class="dp" style="animation-delay:.6s">
      <rect x="16" y="136" width="488" height="88" rx="4" fill="none" stroke="#2bd4a0" stroke-dasharray="4 3"/>
      <text x="30" y="154" fill="#7fe8c8" font-size="11">interface de rede · grupo de segurança</text>
      <rect x="30" y="162" width="150" height="24" rx="3" fill="#0d2420" stroke="#2bd4a0"/><text x="105" y="178" fill="#e8edf7" font-size="9" text-anchor="middle">permitir 443 de 0.0.0.0/0</text>
      <rect x="30" y="190" width="150" height="24" rx="3" fill="#0d2420" stroke="#2bd4a0"/><text x="105" y="206" fill="#e8edf7" font-size="9" text-anchor="middle">permitir 5432 do sg-app</text>
      <text x="196" y="178" fill="#7fe8c8" font-size="9">com estado: o retorno volta sozinho</text>
      <text x="196" y="196" fill="#9aa8c4" font-size="9">só permite · referencia outro grupo</text>
      <text x="372" y="212" fill="#9aa8c4" font-size="9">todas somadas</text>
    </g>
  </svg>`,
rdsha: `<svg class="diag" viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg">
    <text class="dp" style="animation-delay:.05s" x="260" y="16" fill="#9aa8c4" font-size="11" text-anchor="middle">disponibilidade à esquerda, desempenho à direita</text>
    <g class="dp" style="animation-delay:.2s">
      <rect x="16" y="32" width="236" height="172" rx="4" fill="none" stroke="#3b9dff" stroke-dasharray="4 3"/>
      <text x="134" y="50" fill="#8dc8ff" font-size="11" text-anchor="middle">Multi-AZ</text>
      <rect x="34" y="62" width="88" height="42" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="78" y="80" fill="#e8edf7" font-size="9" text-anchor="middle">principal</text><text x="78" y="94" fill="#9aa8c4" font-size="8" text-anchor="middle">zona A</text>
      <rect x="146" y="62" width="88" height="42" rx="3" fill="#101826" stroke="#2e3a52"/><text x="190" y="80" fill="#9aa8c4" font-size="9" text-anchor="middle">em espera</text><text x="190" y="94" fill="#9aa8c4" font-size="8" text-anchor="middle">zona B</text>
      <path d="M122 83 L146 83" stroke="#3b9dff" marker-end="url(#s1)"/>
      <text x="134" y="124" fill="#8dc8ff" font-size="9" text-anchor="middle">cópia síncrona</text>
      <text x="134" y="142" fill="#ff9d9d" font-size="9" text-anchor="middle">não aceita leitura</text>
      <text x="134" y="160" fill="#7fe8c8" font-size="9" text-anchor="middle">assume sozinho</text>
      <text x="134" y="186" fill="#9aa8c4" font-size="9" text-anchor="middle">resolve: a zona caiu</text>
    </g>
    <g class="dp" style="animation-delay:.6s">
      <rect x="268" y="32" width="236" height="172" rx="4" fill="none" stroke="#ff9a2e" stroke-dasharray="4 3"/>
      <text x="386" y="50" fill="#ffc182" font-size="11" text-anchor="middle">réplica de leitura</text>
      <rect x="286" y="62" width="88" height="42" rx="3" fill="#15243c" stroke="#3b9dff"/><text x="330" y="80" fill="#e8edf7" font-size="9" text-anchor="middle">principal</text><text x="330" y="94" fill="#9aa8c4" font-size="8" text-anchor="middle">escrita</text>
      <rect x="398" y="62" width="88" height="42" rx="3" fill="#2a1a08" stroke="#ff9a2e"/><text x="442" y="80" fill="#ffc182" font-size="9" text-anchor="middle">réplica</text><text x="442" y="94" fill="#9aa8c4" font-size="8" text-anchor="middle">leitura</text>
      <path d="M374 83 L398 83" stroke="#ff9a2e" stroke-dasharray="3 2" marker-end="url(#s2)"/>
      <text x="386" y="124" fill="#ffc182" font-size="9" text-anchor="middle">cópia assíncrona</text>
      <text x="386" y="142" fill="#7fe8c8" font-size="9" text-anchor="middle">aceita leitura</text>
      <text x="386" y="160" fill="#ff9d9d" font-size="9" text-anchor="middle">promoção manual</text>
      <text x="386" y="186" fill="#9aa8c4" font-size="9" text-anchor="middle">resolve: relatório pesado</text>
    </g>
    <text class="dp" style="animation-delay:.9s" x="260" y="220" fill="#9aa8c4" font-size="9" text-anchor="middle">quando o enunciado pede as duas coisas, a resposta são as duas construções</text>
    <defs>
      <marker id="s1" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#3b9dff"/></marker>
      <marker id="s2" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#ff9a2e"/></marker>
    </defs>
  </svg>`,
armz: `<svg class="diag" viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg">
    <text class="dp" style="animation-delay:.05s" x="260" y="16" fill="#9aa8c4" font-size="11" text-anchor="middle">três naturezas, três perguntas</text>
    <g class="dp" style="animation-delay:.2s">
      <rect x="16" y="32" width="156" height="150" rx="4" fill="#101826" stroke="#3b9dff"/>
      <text x="94" y="54" fill="#8dc8ff" font-size="11" text-anchor="middle">bloco</text>
      <text x="94" y="74" fill="#e8edf7" font-size="10" text-anchor="middle">EBS</text>
      <text x="94" y="92" fill="#9aa8c4" font-size="9" text-anchor="middle">uma instância</text>
      <text x="94" y="108" fill="#9aa8c4" font-size="9" text-anchor="middle">uma zona</text>
      <line x1="34" y1="120" x2="154" y2="120" stroke="#2e3a52"/>
      <text x="94" y="140" fill="#e8edf7" font-size="10" text-anchor="middle">armaz. de instância</text>
      <text x="94" y="158" fill="#ff9d9d" font-size="9" text-anchor="middle">efêmero, o mais rápido</text>
    </g>
    <g class="dp" style="animation-delay:.5s">
      <rect x="182" y="32" width="156" height="150" rx="4" fill="#101826" stroke="#2bd4a0"/>
      <text x="260" y="54" fill="#7fe8c8" font-size="11" text-anchor="middle">arquivo</text>
      <text x="260" y="74" fill="#e8edf7" font-size="10" text-anchor="middle">EFS · NFS</text>
      <text x="260" y="92" fill="#9aa8c4" font-size="9" text-anchor="middle">muitas instâncias</text>
      <text x="260" y="108" fill="#9aa8c4" font-size="9" text-anchor="middle">várias zonas</text>
      <line x1="200" y1="120" x2="320" y2="120" stroke="#2e3a52"/>
      <text x="260" y="140" fill="#e8edf7" font-size="10" text-anchor="middle">FSx Windows · Lustre</text>
      <text x="260" y="158" fill="#9aa8c4" font-size="9" text-anchor="middle">SMB e alto desempenho</text>
    </g>
    <g class="dp" style="animation-delay:.8s">
      <rect x="348" y="32" width="156" height="150" rx="4" fill="#101826" stroke="#ff9a2e"/>
      <text x="426" y="54" fill="#ffc182" font-size="11" text-anchor="middle">objeto</text>
      <text x="426" y="74" fill="#e8edf7" font-size="10" text-anchor="middle">S3</text>
      <text x="426" y="92" fill="#9aa8c4" font-size="9" text-anchor="middle">acesso por chave</text>
      <text x="426" y="108" fill="#9aa8c4" font-size="9" text-anchor="middle">pela região inteira</text>
      <line x1="366" y1="120" x2="486" y2="120" stroke="#2e3a52"/>
      <text x="426" y="140" fill="#e8edf7" font-size="10" text-anchor="middle">classes e ciclo de vida</text>
      <text x="426" y="158" fill="#9aa8c4" font-size="9" text-anchor="middle">o custo mora aqui</text>
    </g>
    <text class="dp" style="animation-delay:1s" x="260" y="206" fill="#ffc182" font-size="10" text-anchor="middle">compartilhar entre zonas elimina EBS · persistir elimina armazenamento de instância</text>
  </svg>`,
compra: `<svg class="diag" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">
    <text class="dp" style="animation-delay:.05s" x="260" y="16" fill="#9aa8c4" font-size="11" text-anchor="middle">desconto cresce com o compromisso, menos no Spot</text>
    <g class="dp" style="animation-delay:.2s">
      <rect x="20" y="110" width="104" height="70" rx="3" fill="#101826" stroke="#2e3a52"/>
      <text x="72" y="100" fill="#e8edf7" font-size="12" text-anchor="middle" font-weight="600">0%</text>
      <text x="72" y="134" fill="#e8edf7" font-size="10" text-anchor="middle">sob demanda</text>
      <text x="72" y="152" fill="#9aa8c4" font-size="8.5" text-anchor="middle">sem compromisso</text>
      <text x="72" y="168" fill="#9aa8c4" font-size="8.5" text-anchor="middle">carga imprevisível</text>
    </g>
    <g class="dp" style="animation-delay:.45s">
      <rect x="136" y="84" width="104" height="96" rx="3" fill="#101826" stroke="#3b9dff"/>
      <text x="188" y="74" fill="#8dc8ff" font-size="12" text-anchor="middle" font-weight="600">até 72%</text>
      <text x="188" y="108" fill="#e8edf7" font-size="10" text-anchor="middle">Savings Plans</text>
      <text x="188" y="126" fill="#9aa8c4" font-size="8.5" text-anchor="middle">valor por hora</text>
      <text x="188" y="142" fill="#7fe8c8" font-size="8.5" text-anchor="middle">pode trocar de família</text>
      <text x="188" y="162" fill="#9aa8c4" font-size="8.5" text-anchor="middle">base estável</text>
    </g>
    <g class="dp" style="animation-delay:.7s">
      <rect x="252" y="84" width="104" height="96" rx="3" fill="#101826" stroke="#3b9dff"/>
      <text x="304" y="74" fill="#8dc8ff" font-size="12" text-anchor="middle" font-weight="600">até 72%</text>
      <text x="304" y="108" fill="#e8edf7" font-size="10" text-anchor="middle">reserva</text>
      <text x="304" y="126" fill="#9aa8c4" font-size="8.5" text-anchor="middle">configuração fixa</text>
      <text x="304" y="142" fill="#ff9d9d" font-size="8.5" text-anchor="middle">não troca de família</text>
      <text x="304" y="162" fill="#9aa8c4" font-size="8.5" text-anchor="middle">pode reservar capacidade</text>
    </g>
    <g class="dp" style="animation-delay:.95s">
      <rect x="368" y="56" width="132" height="124" rx="3" fill="#101826" stroke="#2bd4a0"/>
      <text x="434" y="46" fill="#7fe8c8" font-size="12" text-anchor="middle" font-weight="600">até 90%</text>
      <text x="434" y="80" fill="#e8edf7" font-size="10" text-anchor="middle">Spot</text>
      <text x="434" y="98" fill="#9aa8c4" font-size="8.5" text-anchor="middle">sem compromisso</text>
      <text x="434" y="114" fill="#ff9d9d" font-size="8.5" text-anchor="middle">retomada com 2 min de aviso</text>
      <text x="434" y="134" fill="#9aa8c4" font-size="8.5" text-anchor="middle">lote, renderização, fila</text>
      <text x="434" y="154" fill="#ff9d9d" font-size="8.5" text-anchor="middle">nunca: banco, estado</text>
    </g>
    <path class="dp" style="animation-delay:1.1s" d="M20 196 L500 196" stroke="#2e3a52"/>
    <text class="dp" style="animation-delay:1.1s" x="260" y="212" fill="#9aa8c4" font-size="9" text-anchor="middle">a pergunta é sempre: o mais barato que atende ao requisito</text>
  </svg>`
});

const LESSONS_SAA = [
{
  id:"l-saa-sgnacl", exam:"saa", dom:"d1", concept:"vpc-seguranca", secs:88,
  title:"Grupo de segurança e lista de rede: a diferença que decide a questão",
  slides:[
    { k:"gancho", emoji:"\u{1F6A7}", h:"Sai e não volta", p:"Esse sintoma tem uma causa quase certa, e saber qual dos dois controles guarda estado resolve a questão em segundos." },
    { k:"analogia", emoji:"\u{1F3E2}", h:"Portaria e recepção", p:"A portaria do prédio é a lista de rede: lista numerada, lê o nome, pode barrar alguém específico, e não lembra que você entrou, então a saída precisa estar liberada também. A recepção da empresa é o grupo de segurança: deixou entrar, deixa sair." },
    { k:"diagrama", diagram:"sgnacl", h:"As duas camadas no mesmo caminho", p:"O pacote passa pelas duas, e ambas precisam permitir." },
    { k:"pegadinha", emoji:"\u{1F6A8}", h:"Onde a prova te pega", gotcha:"Negar um endereço específico só existe na lista de rede, porque grupo de segurança não tem regra de negação. E o grupo de segurança pode referenciar outro grupo como origem, que é como se diz aplicação fala com banco sem citar endereço nenhum: a alternativa que resolve isso com faixa de IP funciona e é a resposta pior." },
    { k:"quiz" }
  ],
  quiz:[
    { q:"A conexão sai da instância e a resposta nunca chega. Grupo de segurança está correto. O que falta?", a:["Portas efêmeras na lista de rede","Uma regra de saída no grupo de segurança","Um gateway de internet"], c:0, e:"A lista de rede não guarda estado: o retorno chega em porta efêmera e precisa de regra de entrada." },
    { q:"Preciso bloquear um endereço IP específico que está atacando. Onde?", a:["Lista de controle de rede","Grupo de segurança","Tabela de rotas"], c:0, e:"Só a lista de rede tem regra de negação." },
    { q:"Como dizer que a camada de aplicação fala com o banco, sem citar endereço?", a:["Grupo de segurança referenciando outro grupo","Lista de rede com a faixa da sub-rede","Ponto de extremidade de interface"], c:0, e:"Referenciar o grupo mantém a regra certa mesmo quando as instâncias mudam de IP." }
  ]
},
{
  id:"l-saa-ha", exam:"saa", dom:"d2", concept:"dados-resilientes", secs:86,
  title:"Multi-AZ e réplica de leitura não são a mesma coisa",
  slides:[
    { k:"gancho", emoji:"\u{1F5C3}", h:"Dois nomes parecidos, problemas opostos", p:"Confundir os dois é o erro mais caro do domínio de resiliência, e a prova monta a alternativa contando com essa confusão." },
    { k:"analogia", emoji:"\u{1F698}", h:"Estepe e segundo carro", p:"Multi-AZ é o estepe: está no porta-malas, não leva ninguém a lugar nenhum, e serve para o dia em que o pneu furar. Réplica de leitura é um segundo carro: roda todo dia, leva gente, mas ninguém trocou o estepe por ele." },
    { k:"diagrama", diagram:"rdsha", h:"Síncrono e assíncrono", p:"Um existe para assumir, o outro para servir consulta." },
    { k:"pegadinha", emoji:"\u{1F6A8}", h:"Onde a prova te pega", gotcha:"No Multi-AZ clássico o nó de espera não aceita leitura, então a alternativa que manda o relatório para ele está errada. E a réplica é assíncrona: leitura logo após a escrita pode vir velha, o que elimina a réplica em qualquer enunciado que exija leitura consistente. Quando o cenário pede disponibilidade E alívio de leitura, a resposta são as duas construções, não uma." },
    { k:"quiz" }
  ],
  quiz:[
    { q:"Relatório pesado está derrubando o banco de produção. O que usar?", a:["Réplica de leitura","Implantação Multi-AZ","Instância de classe maior"], c:0, e:"A réplica tira a carga analítica do nó de escrita." },
    { q:"O banco precisa continuar no ar se a zona cair, sem intervenção. O que usar?", a:["Implantação Multi-AZ","Réplica de leitura","Snapshot automático"], c:0, e:"Multi-AZ tem cópia síncrona e falha automática." },
    { q:"Retomada em outra região em cerca de um minuto, perdendo segundos. O que usar?", a:["Aurora com banco de dados global","Réplica de leitura entre regiões","Cópia de snapshot entre regiões"], c:0, e:"O banco de dados global replica com atraso de cerca de um segundo e promove em cerca de um minuto." }
  ]
},
{
  id:"l-saa-armz", exam:"saa", dom:"d3", concept:"computacao-armazenamento", secs:84,
  title:"Bloco, arquivo e objeto: eliminar antes de escolher",
  slides:[
    { k:"gancho", emoji:"\u{1F4BE}", h:"Quase toda alternativa funciona", p:"No domínio de desempenho, várias opções resolvem. A certa é a que sobra depois que o enunciado elimina as outras, e ele elimina sempre pelas mesmas duas frases." },
    { k:"analogia", emoji:"\u{1F5C4}", h:"Gaveta, armário e guarda-volumes", p:"Bloco é a gaveta da sua mesa: só você alcança. Arquivo é o armário da sala: todo mundo abre ao mesmo tempo e cada um pega a sua pasta. Objeto é o guarda-volumes com etiqueta: você entrega a chave e recebe o pacote inteiro, sem abrir no lugar." },
    { k:"diagrama", diagram:"armz", h:"As três naturezas", p:"A pergunta é quem acessa, de onde, e se o dado precisa sobreviver." },
    { k:"pegadinha", emoji:"\u{1F6A8}", h:"Onde a prova te pega", gotcha:"Duas frases eliminam opções sozinhas. Compartilhar entre zonas elimina o EBS, porque o volume vive em uma zona. Precisar persistir elimina o armazenamento de instância, que some quando a instância para. Quando as duas aparecem juntas, a resposta é EFS, ou S3 se o acesso for por chave." },
    { k:"quiz" }
  ],
  quiz:[
    { q:"Instâncias em três zonas precisam ler e gravar nos mesmos arquivos. O que usar?", a:["EFS","EBS com Multi-Attach","Armazenamento de instância"], c:0, e:"EFS é o único com acesso simultâneo de várias zonas e semântica de sistema de arquivos." },
    { q:"Volume gp2 grande só para alcançar operações por segundo. Como baratear?", a:["Migrar para gp3","Migrar para io2","Migrar para st1"], c:0, e:"Em gp3 o desempenho é configurado à parte do tamanho, então o volume pode encolher." },
    { q:"Nós que trocam mensagens entre si precisam da menor latência possível.", a:["Grupo de posicionamento do tipo cluster","Tipo spread","Três zonas de disponibilidade"], c:0, e:"O tipo cluster junta as instâncias no mesmo ponto da rede." }
  ]
},
{
  id:"l-saa-custo", exam:"saa", dom:"d4", concept:"custo-computacao", secs:82,
  title:"Os quatro modelos de compra, e o que elimina o Spot",
  slides:[
    { k:"gancho", emoji:"\u{1F4B8}", h:"A mesma instância, até 90% mais barata", p:"A prova descreve o perfil da carga e espera o modelo certo. Perfil de carga é tudo: o nome do serviço não muda." },
    { k:"analogia", emoji:"\u{1F3E8}", h:"Pense em hospedagem", p:"Sob demanda é diária na recepção. Savings Plans é contrato de valor mensal, podendo trocar de quarto. Reserva é alugar um quarto específico por um ano. Spot é o quarto que sobrou: sai quase de graça, e podem te pedir para desocupar em dois minutos." },
    { k:"diagrama", diagram:"compra", h:"A escada do desconto", p:"Spot foge da escada: desconto máximo sem compromisso, pagando com o risco." },
    { k:"pegadinha", emoji:"\u{1F6A8}", h:"Onde a prova te pega", gotcha:"As palavras crítico, com estado e sem interrupção eliminam o Spot. Mas o inverso também cai, e é mais perdido: enunciado com fila de trabalho, lote ou ponto de verificação está pedindo Spot, e a alternativa com sob demanda, embora funcione, perde por custo. A pergunta nunca é o que funciona, é o mais barato que atende." },
    { k:"quiz" }
  ],
  quiz:[
    { q:"Renderização noturna que pode recomeçar do zero. Qual modelo?", a:["Spot","Sob demanda","Instância reservada"], c:0, e:"Tolerância a interrupção é o pré-requisito do Spot, e aqui ele é explícito." },
    { q:"Base estável por um ano, mas a família de instância pode mudar.", a:["Savings Plans de computação","Instância reservada padrão","Spot"], c:0, e:"O Savings Plans compromete valor por hora e deixa trocar de família, tamanho e região." },
    { q:"Licença de software exige contar soquetes do servidor físico.", a:["Host dedicado","Instância dedicada","Instância reservada"], c:0, e:"Só o host dedicado dá visibilidade do servidor físico para licenciamento por soquete." }
  ]
}
];
LESSONS.push(...LESSONS_SAA);

const DECKS_SAA = [
{
  id:"dk-saa-sgnacl", exam:"saa", dom:"d1", concept:"vpc-seguranca",
  title:"Grupo de segurança ou lista de rede",
  prompt:"Classifique cada característica pelo controle a que ela pertence.",
  buckets:[{k:"sg",label:"Grupo de segurança"},{k:"nacl",label:"Lista de rede"}],
  items:[
    {t:"Guarda estado: o retorno volta sem regra", k:"sg", e:"É a diferença que mais aparece na prova."},
    {t:"Aceita regra de negação por endereço", k:"nacl", e:"Grupo de segurança só tem regras de permissão."},
    {t:"Aplica-se à sub-rede inteira", k:"nacl", e:"O grupo de segurança atua na interface de rede."},
    {t:"Pode referenciar outro grupo como origem", k:"sg", e:"Permite escrever a regra sem citar endereço."},
    {t:"Regras avaliadas em ordem numérica, a primeira que casa decide", k:"nacl", e:"No grupo de segurança todas as regras são somadas."},
    {t:"Precisa liberar as portas efêmeras no retorno", k:"nacl", e:"Consequência direta de não guardar estado."},
    {t:"Por padrão nega entrada e permite toda a saída", k:"sg", e:"A lista de rede padrão permite tudo nos dois sentidos."},
    {t:"Atua na interface de rede da instância", k:"sg", e:"É por isso que duas instâncias na mesma sub-rede podem ter regras diferentes."}
  ]
},
{
  id:"dk-saa-s3", exam:"saa", dom:"d4", concept:"custo-armazenamento",
  title:"Qual classe do S3",
  prompt:"Classifique cada cenário pela classe de armazenamento mais barata que o atende.",
  buckets:[{k:"std",label:"Standard"},{k:"it",label:"Intelligent-Tiering"},{k:"ia",label:"Acesso infrequente"},{k:"gla",label:"Glacier"}],
  items:[
    {t:"Padrão de acesso desconhecido e variável", k:"it", e:"Move sozinho entre camadas, sem taxa de recuperação."},
    {t:"Miniaturas lidas o tempo todo por um site", k:"std", e:"Acesso frequente: qualquer camada infrequente cobraria recuperação."},
    {t:"Backup lido uma vez por trimestre, precisa vir na hora", k:"gla", e:"Glacier Instant Retrieval entrega em milissegundos com custo de arquivo."},
    {t:"Registro de auditoria de sete anos, recuperação pode levar 12 horas", k:"gla", e:"Deep Archive, a classe de menor custo por gigabyte."},
    {t:"Relatório mensal consultado uma vez por mês, imediato", k:"ia", e:"Standard-IA: acesso raro com recuperação imediata."},
    {t:"Log recriável, acesso raro, pode viver em uma zona só", k:"ia", e:"One Zone-IA, que só vale porque o dado é recriável."},
    {t:"Arquivo que será lido muito nos primeiros 30 dias", k:"std", e:"Mover cedo para camada infrequente gera cobrança de exclusão antecipada."},
    {t:"Conjunto de dados cujo acesso cai e sobe sem padrão", k:"it", e:"É exatamente o caso que o monitoramento automático resolve."}
  ]
},
{
  id:"dk-saa-integra", exam:"saa", dom:"d2", concept:"desacoplamento",
  title:"Fila, tópico, barramento ou orquestrador",
  prompt:"Classifique cada requisito pelo serviço de integração que o resolve.",
  buckets:[{k:"sqs",label:"SQS"},{k:"sns",label:"SNS"},{k:"eb",label:"EventBridge"},{k:"sfn",label:"Step Functions"}],
  items:[
    {t:"Absorver pico e processar no ritmo do consumidor", k:"sqs", e:"A fila é o amortecedor entre produtor e consumidor."},
    {t:"Um evento precisa chegar a quatro sistemas distintos", k:"sns", e:"Distribuição: um tópico, vários assinantes."},
    {t:"Rotear eventos por regra que lê o conteúdo", k:"eb", e:"O barramento filtra por padrão de evento."},
    {t:"Fluxo com repetição, espera e tratamento de erro por passo", k:"sfn", e:"Máquina de estados, com o controle de fluxo fora do código."},
    {t:"Ordem estrita por cliente, sem processar duas vezes", k:"sqs", e:"Fila FIFO com agrupamento por cliente e deduplicação."},
    {t:"Reagir a um evento emitido por um SaaS de terceiro", k:"eb", e:"O EventBridge tem integração nativa com parceiros."},
    {t:"Disparar uma tarefa todo dia às 3h", k:"eb", e:"Regra agendada no barramento."},
    {t:"Coordenar cinco Lambdas em sequência, com repetição em falha", k:"sfn", e:"Orquestração explícita, com estado e retentativa declarados."},
    {t:"Enviar aviso por e-mail e SMS a partir do mesmo evento", k:"sns", e:"Assinaturas de tipos diferentes no mesmo tópico."}
  ]
}
];
DECKS.push(...DECKS_SAA);
