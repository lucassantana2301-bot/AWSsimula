/* ============================================================
   BANCO DE QUESTÕES — AWS (CLF-C02 e SAA-C03), lote 4
   Conteúdo original, revisado contra a documentação oficial (nov/2026).
   ============================================================ */
/* Lote: CLF-C02, domínio d1 (Conceitos de nuvem), questões aw-d1-11 a aw-d1-22.
   Temas: perspectivas e fases do AWS CAF, ferramentas de migração, economia da nuvem e TCO,
   elasticidade/escalabilidade/agilidade, modelos de implantação, pilares do Well-Architected,
   Wavelength, Outposts e residência de dados. */
const QUESTIONS_CLF_D1 = [
{
  id:"aw-d1-11", exam:"clf", dom:"d1", lvl:4, type:"single", sec:90,
  tags:["migracao-caf"],
  case:"Seis meses depois de iniciar a migração, a revisão do programa apontou três problemas: os analistas resistem às novas formas de trabalho e não receberam treinamento em nuvem, os cargos ainda refletem a estrutura do datacenter e a liderança não comunica com clareza por que a empresa está mudando.",
  stem:"Qual perspectiva do AWS Cloud Adoption Framework (AWS CAF) trata desses problemas e quem costuma ser o dono dela?",
  opts:[
    {k:"A",t:"Pessoas, com CIO, COO, CTO, diretor de nuvem e líderes de várias áreas"},
    {k:"B",t:"Governança, com CFO, diretor de riscos e diretor de dados"},
    {k:"C",t:"Operações, com líderes de infraestrutura e engenheiros de confiabilidade"},
    {k:"D",t:"Negócios, com CEO, CFO e COO definindo os resultados esperados"}
  ],
  ans:["A"],
  why:{
    ok:"A perspectiva Pessoas é a ponte entre tecnologia e negócio e cuida de cultura, estrutura organizacional, liderança e força de trabalho. Resistência à mudança e falta de treinamento caem em evolução da cultura, fluência em nuvem e aceleração da mudança; cargos desatualizados caem em desenho organizacional; comunicação da visão cai em liderança transformacional. Os stakeholders típicos citados pela AWS são CIO, COO, CTO, diretor de nuvem e líderes multifuncionais.",
    B:"Governança orquestra as iniciativas e reduz riscos da transformação: gestão de programas, benefícios, riscos, finanças da nuvem e governança de dados. Não trata de cultura, treinamento nem desenho de cargos.",
    C:"Operações garante que os serviços de nuvem sejam entregues no nível que o negócio precisa (monitoramento, incidentes, disponibilidade). Não cuida de capacitação nem da estrutura organizacional.",
    D:"Negócios garante que o investimento em nuvem acelere os resultados de negócio (estratégia, produtos, dados como ativo). Os problemas descritos são de gente e organização, não de estratégia de negócio."
  },
  src:[{t:"AWS CAF: capacidades fundamentais e perspectivas",u:"https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/foundational-capabilities.html"}]
},
{
  id:"aw-d1-12", exam:"clf", dom:"d1", lvl:4, type:"order", sec:80,
  tags:["migracao-caf"],
  stem:"Ordene as fases da jornada de transformação para a nuvem descritas no AWS CAF, da PRIMEIRA à ÚLTIMA.",
  items:[
    {t:"Envision: ligar a nuvem a resultados de negócio mensuráveis e priorizar oportunidades"},
    {t:"Align: identificar lacunas de capacidade nas seis perspectivas e alinhar os stakeholders"},
    {t:"Launch: entregar pilotos em produção e demonstrar valor incremental"},
    {t:"Scale: expandir os pilotos até a escala desejada e sustentar os benefícios"}
  ],
  e:"Primeiro a empresa define por que vai para a nuvem e quais resultados quer medir (Envision). Com o objetivo claro, avalia as lacunas de capacidade nas seis perspectivas e alinha as áreas (Align). Só então entrega pilotos em produção, aprendendo com eles (Launch), e por último amplia o que deu certo para a escala total, garantindo que o benefício se mantenha (Scale). Escalar antes de pilotar repete erros em grande volume.",
  src:[{t:"AWS CAF: sua jornada de transformação para a nuvem",u:"https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/your-cloud-transformation-journey.html"}]
},
{
  id:"aw-d1-13", exam:"clf", dom:"d1", lvl:4, type:"single", sec:100,
  tags:["migracao-caf"],
  case:"Uma empresa vai trocar um banco Oracle local pelo Amazon Aurora PostgreSQL-Compatible. Requisitos: converter tabelas, visões e stored procedures para o novo motor, e manter o Oracle atendendo os usuários enquanto os dados são copiados, com as alterações replicadas continuamente até o dia da virada.",
  stem:"Qual combinação atende aos dois requisitos?",
  opts:[
    {k:"A",t:"Só uma tarefa do AWS DMS com carga completa e CDC, que já converte as stored procedures"},
    {k:"B",t:"AWS Transform MGN replicando o servidor Oracle inteiro para uma instância EC2"},
    {k:"C",t:"AWS DataSync copiando os arquivos de dados do Oracle para o S3 e importando no Aurora"},
    {k:"D",t:"DMS Schema Conversion para esquema e código, e AWS DMS com carga completa e CDC"}
  ],
  ans:["D"],
  why:{
    ok:"A migração é heterogênea (Oracle para PostgreSQL), então são duas peças. O DMS Schema Conversion converte o esquema e os objetos de código (tabelas, visões, stored procedures, funções) para o formato do Aurora PostgreSQL. A tarefa do AWS DMS com carga completa mais captura de alterações (CDC) move os dados com o Oracle ainda em uso e mantém o destino sincronizado até a virada.",
    A:"A tarefa de migração de dados do DMS move linhas, mas não converte o esquema nem o código. A própria documentação separa: o Schema Conversion converte o esquema, a migração de dados do DMS move os dados.",
    B:"O AWS Transform MGN (antigo AWS Application Migration Service) faz rehost: copia o servidor como ele é. O resultado continua sendo Oracle em EC2, não Aurora PostgreSQL.",
    C:"DataSync transfere arquivos e objetos. Arquivos de dados do Oracle não são importáveis no PostgreSQL, e não há conversão de código nem replicação contínua das transações."
  },
  src:[{t:"Converter esquemas com o DMS Schema Conversion",u:"https://docs.aws.amazon.com/en_us/dms/latest/userguide/CHAP_SchemaConversion.html"}]
},
{
  id:"aw-d1-14", exam:"clf", dom:"d1", lvl:3, type:"single", sec:85,
  tags:["migracao-caf"],
  case:"Uma empresa tem 60 servidores Windows e Linux (x86), em VMware e em máquinas físicas. A diretoria quer sair do datacenter sem alterar as aplicações, testar as instâncias na AWS antes da virada e fazer a virada em minutos, com replicação contínua até lá.",
  stem:"Qual serviço atende diretamente a esse rehost?",
  opts:[
    {k:"A",t:"AWS Transform MGN (antigo AWS Application Migration Service)"},
    {k:"B",t:"AWS Database Migration Service com captura de alterações"},
    {k:"C",t:"AWS Migration Hub para acompanhar as ondas de migração"},
    {k:"D",t:"EC2 Image Builder para gerar AMIs com as aplicações"}
  ],
  ans:["A"],
  why:{
    ok:"O AWS Transform MGN, novo nome do AWS Application Migration Service desde junho de 2026, é a ferramenta de lift-and-shift. Um agente instalado no sistema operacional replica os blocos de disco continuamente para a AWS, sem mudar a aplicação, o que permite lançar instâncias de teste e fazer a virada em minutos. Aceita servidores físicos, virtuais e de outras nuvens.",
    B:"O DMS migra bancos de dados, não servidores inteiros com sistema operacional e aplicação. Serviria só para o banco, não para os 60 servidores.",
    C:"O Migration Hub só acompanha o progresso; não replica nada. Além disso, deixou de aceitar novos clientes em 7 de novembro de 2025, e a AWS indica o AWS Transform no lugar.",
    D:"O EC2 Image Builder automatiza a criação de AMIs a partir de receitas. Não copia servidores existentes nem mantém replicação contínua até a virada."
  },
  src:[
    {t:"AWS Application Migration Service agora é AWS Transform MGN",u:"https://aws.amazon.com/about-aws/whats-new/2026/06/aws-transform-mgn-rebrand/"},
    {t:"Prescriptive Guidance: rehost com o MGN",u:"https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-database-rehost-tools/mgn.html"}
  ]
},
{
  id:"aw-d1-15", exam:"clf", dom:"d1", lvl:4, type:"single", sec:95,
  tags:["migracao-caf"],
  case:"Um laboratório precisa levar 150 TB de arquivos de um NAS local (compartilhamento NFS) para o Amazon S3. Já existe um link de 10 Gbps com a AWS. Requisitos: transferência pela rede, criptografada, com validação de integridade e cópia só do que mudou nas execuções seguintes, até a virada.",
  stem:"Qual serviço atende a todos os requisitos com o menor esforço?",
  opts:[
    {k:"A",t:"AWS Transform MGN instalado no servidor que hospeda o NAS"},
    {k:"B",t:"AWS DataSync com uma tarefa do NFS para o bucket do S3"},
    {k:"C",t:"Amazon S3 Transfer Acceleration ativado no bucket de destino"},
    {k:"D",t:"AWS DMS com carga completa e captura de alterações"}
  ],
  ans:["B"],
  why:{
    ok:"O DataSync é o serviço gerenciado de transferência online de arquivos e objetos. Lê NFS, SMB, HDFS e armazenamento de objetos, grava no S3, EFS ou FSx, criptografa em trânsito e valida a integridade. Execuções repetidas da tarefa copiam só o que mudou. Para transferência offline, a AWS não oferece mais a família Snow a novos clientes e indica o DataSync (online) ou os AWS Data Transfer Terminals.",
    A:"O MGN replica discos de servidores para EBS e não replica NAS nem sistemas de arquivos compartilhados (NFS, SMB). O destino também seria EC2, não S3.",
    C:"O Transfer Acceleration só acelera envios ao S3 por longas distâncias, usando a rede de borda. Não lê o NFS, não agenda tarefas nem valida integridade; alguém ainda teria de escrever o processo de cópia.",
    D:"O DMS migra bancos de dados. Arquivos em um compartilhamento NFS não são fonte do DMS."
  },
  src:[
    {t:"O que é o AWS DataSync",u:"https://docs.aws.amazon.com/en_us/datasync/latest/userguide/what-is-datasync.html"},
    {t:"Mudança de disponibilidade do Snowball Edge",u:"https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html"}
  ]
},
{
  id:"aw-d1-16", exam:"clf", dom:"d1", lvl:3, type:"single", sec:70,
  tags:["well-architected"],
  case:"O CFO de uma rede de lojas comparou só o preço por unidade de uso, deixando de lado investimento inicial e prazo de compra. Concluiu que a AWS cobra menos por unidade de computação do que a empresa pagaria operando hardware próprio, porque a AWS agrega o consumo de centenas de milhares de clientes e repassa isso nos preços.",
  stem:"Qual benefício da nuvem explica a conclusão do CFO?",
  opts:[
    {k:"A",t:"Trocar despesa fixa por despesa variável"},
    {k:"B",t:"Parar de tentar adivinhar a necessidade de capacidade"},
    {k:"C",t:"Beneficiar-se de enormes economias de escala"},
    {k:"D",t:"Aumentar a velocidade e a agilidade"}
  ],
  ans:["C"],
  why:{
    ok:"O ponto do CFO é o preço unitário menor. A AWS agrega o uso de muitos clientes, ganha escala na compra e na operação e transforma isso em preços pagos por uso menores do que uma empresa conseguiria sozinha. É a definição de economia de escala no whitepaper da AWS.",
    A:"Despesa fixa por variável fala de deixar de investir antes em datacenter e pagar só quando consumir. O CFO não comparou investimento inicial com pagamento por uso; comparou preço por unidade.",
    B:"Parar de adivinhar capacidade é evitar sobra ou falta de recursos, ajustando para cima e para baixo em minutos. Não explica por que a unidade é mais barata.",
    D:"Velocidade e agilidade é ter recursos em minutos em vez de semanas, barateando a experimentação. Não trata de preço unitário."
  },
  src:[{t:"Seis vantagens da computação em nuvem",u:"https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html"}]
},
{
  id:"aw-d1-17", exam:"clf", dom:"d1", lvl:4, type:"multi", sec:100,
  tags:["well-architected","migracao-caf"],
  case:"Uma empresa montou uma planilha de custo total de propriedade (TCO). No lado on-premises, colocou apenas o preço de compra dos servidores; no lado AWS, o preço das instâncias EC2. A conclusão foi que a nuvem sai mais cara.",
  stem:"Quais custos do lado on-premises ficaram de fora e distorcem a comparação? Escolha TRÊS.",
  opts:[
    {k:"A",t:"Licenças de software e contratos de suporte dos fabricantes"},
    {k:"B",t:"Cobrança por requisição de API feita ao Amazon S3"},
    {k:"C",t:"Energia, refrigeração e espaço físico do datacenter"},
    {k:"D",t:"Transferência de dados de saída da AWS para a internet"},
    {k:"E",t:"Horas da equipe para instalar, atualizar e trocar hardware"}
  ],
  ans:["A","C","E"],
  why:{
    ok:"Um TCO honesto do datacenter inclui muito mais que o servidor: licenças e suporte de software, instalações (energia, refrigeração, espaço) e o trabalho das pessoas para montar, aplicar correções e substituir equipamentos. A AWS lista \"parar de gastar dinheiro operando e mantendo datacenters\" como vantagem justamente porque esses custos indiretos costumam ser esquecidos. Ferramentas de caso de negócio da AWS também modelam servidores, armazenamento, software, licenças, suporte e instalações.",
    B:"Requisições ao S3 são custo do lado AWS, não do lado on-premises. Adicioná-las não corrige a omissão no datacenter.",
    D:"Transferência de saída é cobrada pela AWS, portanto pertence ao lado nuvem da planilha. Não é custo indireto do datacenter."
  },
  src:[
    {t:"Seis vantagens da computação em nuvem",u:"https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html"},
    {t:"Prescriptive Guidance: caso de negócio e TCO",u:"https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-tools/business-case-migration-evaluator.html"}
  ]
},
{
  id:"aw-d1-18", exam:"clf", dom:"d1", lvl:3, type:"yn", sec:90,
  tags:["well-architected"],
  stem:"Responda Sim ou Não para cada afirmação sobre elasticidade, escalabilidade e agilidade na nuvem.",
  rows:[
    {t:"Elasticidade é adicionar e liberar recursos automaticamente para acompanhar a demanda, pagando só pelo que for usado.",a:true,e:"Sim. O que diferencia a elasticidade é acompanhar a demanda nos dois sentidos: cresce no pico e devolve os recursos quando a carga cai, e o custo segue o uso."},
    {t:"Escalabilidade e elasticidade são sinônimos: todo sistema escalável reduz a capacidade sozinho quando a demanda cai.",a:false,e:"Não. Escalabilidade é a capacidade de crescer para atender mais carga. Um sistema pode ser escalável e mesmo assim exigir ajuste manual e nunca encolher; elasticidade é crescer e encolher automaticamente."},
    {t:"Agilidade, como benefício da nuvem, é reduzir de semanas para minutos o tempo para disponibilizar recursos, o que barateia experimentar.",a:true,e:"Sim. A AWS descreve velocidade e agilidade assim: recursos a um clique de distância, menos tempo e custo para experimentar e desenvolver."},
    {t:"Escalar horizontalmente é trocar a instância atual por outra maior, com mais CPU e memória.",a:false,e:"Não. Trocar por uma instância maior é escalar verticalmente. Escalar horizontalmente é adicionar mais recursos menores; o pilar Confiabilidade recomenda isso para que uma falha afete só parte da carga."}
  ],
  src:[
    {t:"Seis vantagens da computação em nuvem",u:"https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html"},
    {t:"Pilar Confiabilidade: princípios de design",u:"https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"}
  ]
},
{
  id:"aw-d1-19", exam:"clf", dom:"d1", lvl:4, type:"single", sec:100,
  tags:["infra-global","migracao-caf"],
  case:"Uma fábrica precisa rodar análise de imagens da linha de produção com latência de poucos milissegundos até os sistemas de controle que ficam no próprio prédio. Uma norma interna exige que esses dados não saiam da planta. A equipe quer usar as mesmas APIs e o mesmo console da AWS, sem cuidar da manutenção do hardware.",
  stem:"Qual modelo de implantação atende aos três requisitos?",
  opts:[
    {k:"A",t:"Instâncias em uma Local Zone da AWS na cidade mais próxima"},
    {k:"B",t:"Híbrido, com um rack do AWS Outposts instalado na fábrica"},
    {k:"C",t:"Nuvem privada local com virtualização e gestão própria"},
    {k:"D",t:"Tudo na região mais próxima, ligada por AWS Direct Connect"}
  ],
  ans:["B"],
  why:{
    ok:"O AWS Outposts leva infraestrutura, serviços e APIs da AWS para dentro do local do cliente, num modelo híbrido. A AWS é dona do equipamento, instala e mantém. Ele atende os três casos citados pela AWS: baixa latência até sistemas locais, processamento local e residência dos dados no próprio local.",
    A:"A Local Zone fica numa instalação da AWS na região metropolitana, não na fábrica. Os dados sairiam da planta, e a latência depende do trajeto até lá.",
    C:"Uma nuvem privada local mantém os dados na planta, mas não oferece as APIs nem o console da AWS, e a equipe teria de manter o hardware.",
    D:"Com tudo na região, os dados saem da fábrica e a latência inclui o trajeto até o datacenter da AWS. O Direct Connect deixa a conexão estável, mas não resolve nenhum desses dois pontos."
  },
  src:[
    {t:"O que é o AWS Outposts",u:"https://docs.aws.amazon.com/outposts/latest/network-userguide/what-is-outposts.html"},
    {t:"Tipos de computação em nuvem: modelos de implantação",u:"https://docs.aws.amazon.com/aws-technical-content/latest/aws-overview/types-of-cloud-computing.html"}
  ]
},
{
  id:"aw-d1-20", exam:"clf", dom:"d1", lvl:4, type:"single", sec:95,
  tags:["infra-global"],
  case:"Um aplicativo de realidade aumentada para torcedores em estádios roda a renderização em instâncias EC2. Os usuários usam celulares na rede 5G de uma operadora parceira. Requisitos: latência ultrabaixa, tráfego do celular até o servidor sem sair da rede da operadora e nenhum hardware instalado em local da empresa.",
  stem:"Onde a empresa deve rodar as instâncias de renderização?",
  opts:[
    {k:"A",t:"Em uma Local Zone da AWS na cidade de cada estádio"},
    {k:"B",t:"Na região, servida por uma distribuição do CloudFront"},
    {k:"C",t:"Em uma Wavelength Zone na rede 5G da operadora"},
    {k:"D",t:"Na região, com endereços do AWS Global Accelerator"}
  ],
  ans:["C"],
  why:{
    ok:"As Wavelength Zones ficam nos datacenters das operadoras, na borda da rede 5G, e rodam EC2 e EBS. O tráfego do dispositivo chega ao servidor sem sair da rede da operadora, o que dá a menor latência para usuários móveis. É uma extensão lógica da região, gerenciada por ela, sem hardware do cliente.",
    A:"A Local Zone aproxima a computação de uma região metropolitana, mas o tráfego do celular precisa sair da rede da operadora e atravessar a internet até ela. Não atende ao requisito de ficar na rede 5G.",
    B:"O CloudFront guarda conteúdo em cache nos pontos de presença. A renderização em EC2 continuaria na região, longe do usuário.",
    D:"O Global Accelerator leva o tráfego pela rede da AWS a partir do ponto mais próximo, mas a computação continua na região e o tráfego sai da rede da operadora."
  },
  src:[
    {t:"O que é o AWS Wavelength",u:"https://docs.aws.amazon.com/wavelength/latest/developerguide/what-is-wavelength.html"},
    {t:"Visão geral da AWS: serviços de computação (Wavelength)",u:"https://docs.aws.amazon.com/whitepapers/latest/aws-overview/compute-services.html"}
  ]
},
{
  id:"aw-d1-21", exam:"clf", dom:"d1", lvl:3, type:"single", sec:85,
  tags:["infra-global"],
  case:"Uma fintech brasileira precisa guardar os dados dos clientes em território nacional, por exigência do regulador. A aplicação também precisa continuar no ar se um datacenter falhar.",
  stem:"Qual arquitetura atende aos dois requisitos?",
  opts:[
    {k:"A",t:"sa-east-1 em várias zonas, com cópia de DR em us-east-1"},
    {k:"B",t:"Região us-east-1 com o CloudFront servindo a partir de São Paulo"},
    {k:"C",t:"Uma única zona da sa-east-1, com backups diários na mesma zona"},
    {k:"D",t:"Região sa-east-1, em várias zonas, sem réplica fora dela"}
  ],
  ans:["D"],
  why:{
    ok:"O cliente escolhe a região onde o conteúdo fica, e a AWS não move nem copia esse conteúdo para fora dela sem o consentimento do cliente (com as exceções de cumprir a lei ou prestar o serviço solicitado). Usar a região de São Paulo atende à residência; distribuir em várias zonas de disponibilidade, cada uma com um ou mais datacenters isolados dentro da região, mantém a aplicação no ar se um deles falhar.",
    A:"Manter uma cópia em us-east-1 coloca dados dos clientes nos Estados Unidos e viola a exigência de residência, mesmo sendo só para recuperação.",
    B:"Os dados ficariam armazenados em us-east-1. O CloudFront só mantém cópias em cache na borda; a origem continua fora do Brasil.",
    C:"Os dados ficam no Brasil, mas tudo depende de uma zona só. Se aquele datacenter falhar, a aplicação e os backups caem juntos."
  },
  src:[
    {t:"Perguntas frequentes sobre privacidade de dados",u:"https://aws.amazon.com/compliance/data-privacy-faq/"},
    {t:"Regiões e zonas do Amazon EC2",u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"}
  ]
},
{
  id:"aw-d1-22", exam:"clf", dom:"d1", lvl:4, type:"multi", sec:100,
  tags:["well-architected"],
  case:"Uma empresa quer reduzir o impacto ambiental das cargas de trabalho na AWS e pediu à equipe que aplique os princípios de design do pilar Sustentabilidade do AWS Well-Architected Framework, sem misturar princípios de outros pilares.",
  stem:"Quais princípios pertencem ao pilar Sustentabilidade? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Maximizar a utilização, dimensionando direito e eliminando recursos ociosos"},
    {k:"B",t:"Escalar horizontalmente para aumentar a disponibilidade agregada"},
    {k:"C",t:"Democratizar tecnologias avançadas, como ML e NoSQL, para a equipe focar no produto"},
    {k:"D",t:"Usar serviços gerenciados que compartilham infraestrutura entre muitos clientes"},
    {k:"E",t:"Testar os procedimentos de recuperação simulando falhas"}
  ],
  ans:["A","D"],
  why:{
    ok:"Os dois estão entre os seis princípios do pilar Sustentabilidade. Maximizar a utilização reduz a energia gasta: menos hosts mais ocupados consomem menos que muitos hosts ociosos. Usar serviços gerenciados, como AWS Fargate e o ciclo de vida do S3, aproveita infraestrutura compartilhada pela base de clientes da AWS e melhora o uso dos recursos.",
    B:"Escalar horizontalmente para aumentar a disponibilidade agregada é princípio do pilar Confiabilidade: vários recursos pequenos para que uma falha afete só parte da carga.",
    C:"Democratizar tecnologias avançadas é princípio do pilar Eficiência de desempenho, ao lado de usar arquiteturas sem servidor e experimentar com mais frequência. Também envolve serviços gerenciados, mas o objetivo é liberar a equipe para o produto, não aumentar a utilização da infraestrutura compartilhada.",
    E:"Testar procedimentos de recuperação é princípio do pilar Confiabilidade: validar a recuperação antes que uma falha real aconteça."
  },
  src:[
    {t:"Sustentabilidade: princípios de design",u:"https://docs.aws.amazon.com/wellarchitected/latest/framework/sus-design-principles.html"},
    {t:"Eficiência de desempenho: princípios de design",u:"https://docs.aws.amazon.com/wellarchitected/latest/framework/perf-dp.html"}
  ]
}
];
/* Lote q-clf-d2 · CLF-C02 · domínio d2 (Segurança e conformidade) · ids aw-d2-15 a aw-d2-28 */
const QUESTIONS_CLF_D2 = [
{
  id:"aw-d2-15", exam:"clf", dom:"d2", lvl:3, type:"single", sec:75,
  tags:["sg-vs-nacl","seguranca-servicos"],
  case:"Uma startup publicou o site atrás de um Application Load Balancer. Ela quer proteção contra os ataques de negação de serviço mais comuns nas camadas de rede e de transporte (como inundação SYN e reflexão UDP), sem pagar nada a mais e sem configurar nenhum recurso novo.",
  stem:"O que a startup precisa fazer?",
  opts:[
    {k:"A",t:"Assinar o AWS Shield Advanced para a conta e registrar o balanceador como recurso protegido."},
    {k:"B",t:"Criar uma ACL da web no AWS WAF com regra baseada em taxa e associá-la ao balanceador."},
    {k:"C",t:"Nada além do que já tem: o AWS Shield Standard já protege esses recursos automaticamente."},
    {k:"D",t:"Ativar o Amazon GuardDuty para que ele bloqueie o tráfego de ataque assim que for detectado."}
  ],
  ans:["C"],
  why:{
    ok:"O Shield Standard vem ativado automaticamente para todo cliente da AWS, sem custo extra e sem configuração. Ele cobre justamente os ataques comuns de camada 3 e 4, como inundação SYN e reflexão UDP. Os três requisitos (camadas de rede/transporte, custo zero, nada a configurar) já estão atendidos.",
    A:"O Shield Advanced acrescenta proteções extras, equipe de resposta e proteção de custo, mas é uma assinatura paga. Falha no requisito de não pagar nada a mais.",
    B:"O AWS WAF atua na camada 7 (HTTP) e é cobrado por ACL e por regra. Exige configuração e custo, e não é a defesa para inundação SYN ou reflexão UDP.",
    D:"O GuardDuty detecta ameaças a partir de logs e gera achados; ele não bloqueia tráfego sozinho. Além disso, é um serviço cobrado."
  },
  src:[{t:"AWS: Como o Shield e o WAF protegem contra DDoS",u:"https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html"}]
},
{
  id:"aw-d2-16", exam:"clf", dom:"d2", lvl:4, type:"order", sec:90,
  tags:["shared-responsibility"],
  stem:"Ordene as formas de rodar um banco de dados da que deixa MAIS responsabilidade de segurança com o cliente para a que deixa MENOS.",
  items:[
    {t:"Servidor físico próprio, em datacenter da empresa, com MySQL instalado"},
    {t:"MySQL instalado pela equipe em uma instância do Amazon EC2"},
    {t:"Amazon RDS for MySQL"},
    {t:"Amazon DynamoDB"}
  ],
  e:"No datacenter próprio o cliente cuida de tudo, inclusive prédio e hardware. No EC2 a AWS assume a parte física e o virtualizador, mas o cliente ainda aplica patches no sistema operacional convidado e no MySQL. No RDS a AWS desenvolve e aplica os patches do SO e do motor; o cliente escolhe a janela de manutenção, cuida da rede, dos usuários do banco e da criptografia. No DynamoDB, serviço abstraído, a AWS aplica patches sem ação do cliente, que fica só com dados, permissões do IAM e opções de criptografia.",
  src:[{t:"AWS: Responsabilidade compartilhada (pilar de segurança)",u:"https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/shared-responsibility.html"}]
},
{
  id:"aw-d2-17", exam:"clf", dom:"d2", lvl:3, type:"single", sec:75,
  tags:["conformidade-governanca"],
  case:"Uma clínica vai guardar prontuários na AWS. O auditor externo pediu uma cópia do relatório SOC 2 da própria AWS, e o jurídico precisa aceitar o Business Associate Addendum (BAA) exigido pela HIPAA antes de qualquer dado de paciente entrar na conta. Tudo deve ser feito pelo console, sem abrir chamado.",
  stem:"Qual serviço atende os dois pedidos?",
  opts:[
    {k:"A",t:"AWS Artifact"},
    {k:"B",t:"AWS Config"},
    {k:"C",t:"AWS Trusted Advisor"},
    {k:"D",t:"AWS CloudTrail"}
  ],
  ans:["A"],
  why:{
    ok:"O AWS Artifact tem duas partes: Artifact Reports, onde se baixam os relatórios de conformidade da AWS (SOC, ISO, PCI) para entregar ao auditor, e Artifact Agreements, onde a conta (ou a organização inteira) revisa e aceita acordos como o BAA. Tudo em autoatendimento no console.",
    B:"O AWS Config registra e avalia a configuração dos recursos do cliente. Não guarda relatórios de auditoria da AWS nem acordos.",
    C:"O Trusted Advisor faz verificações de boas práticas (custo, segurança, limites). Não oferece relatórios SOC nem aceite de BAA.",
    D:"O CloudTrail registra chamadas de API na conta do cliente. Serve como evidência do que aconteceu na conta, não como relatório da AWS ou acordo."
  },
  src:[{t:"AWS Artifact: perguntas frequentes",u:"https://aws.amazon.com/artifact/faq/"}]
},
{
  id:"aw-d2-18", exam:"clf", dom:"d2", lvl:4, type:"single", sec:100,
  tags:["conformidade-governanca","seguranca-servicos"],
  case:"Uma conta criada este mês vai hospedar dados de saúde. A equipe quer: 1) avaliar continuamente os recursos com um modelo pronto de regras para HIPAA; 2) ver uma pontuação de conformidade num painel; 3) disparar correção dos recursos que estiverem fora do padrão.",
  stem:"Qual solução atende os três requisitos?",
  opts:[
    {k:"A",t:"AWS Audit Manager, com uma avaliação baseada no framework HIPAA"},
    {k:"B",t:"AWS Artifact, baixando o relatório HIPAA da AWS"},
    {k:"C",t:"AWS Trusted Advisor, com as verificações da categoria segurança"},
    {k:"D",t:"Pacote de conformidade do AWS Config com o modelo HIPAA"}
  ],
  ans:["D"],
  why:{
    ok:"Os pacotes de conformidade (conformance packs) do AWS Config trazem modelos prontos, inclusive para HIPAA, que avaliam os recursos continuamente com regras do Config (requisito 1). O painel do pacote mostra pontuação e linha do tempo de conformidade (2), e é possível definir ações de correção para recursos fora do padrão (3).",
    A:"O Audit Manager entrou em modo de manutenção e, desde 30/04/2026, não pode mais ser configurado em contas novas. Mesmo para quem já usa, ele junta evidências para auditoria, mas não corrige recursos.",
    B:"O Artifact entrega relatórios sobre os controles da própria AWS. Ele não avalia os recursos do cliente nem corrige nada.",
    C:"O Trusted Advisor roda um conjunto fixo de verificações. Não tem modelo de regras para HIPAA nem fluxo de correção por framework."
  },
  src:[
    {t:"AWS Config: pacotes de conformidade",u:"https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html"},
    {t:"AWS Audit Manager: mudança de disponibilidade",u:"https://docs.aws.amazon.com/audit-manager/latest/userguide/audit-manager-availability-change.html"}
  ]
},
{
  id:"aw-d2-19", exam:"clf", dom:"d2", lvl:4, type:"yn", sec:110,
  tags:["seguranca-servicos","conformidade-governanca"],
  stem:"Responda Sim ou Não para cada afirmação sobre o AWS Config e o AWS CloudTrail.",
  rows:[
    {t:"Para descobrir qual identidade apagou uma regra de um grupo de segurança ontem, e de qual endereço IP, a fonte certa é o CloudTrail.",a:true,e:"O CloudTrail registra cada chamada de API com quem fez, quando e de onde. Apagar uma regra é uma chamada de API."},
    {t:"O AWS Config consegue mostrar como um recurso estava configurado numa data passada e a quais outros recursos ele estava ligado.",a:true,e:"O Config guarda o histórico de configuração de cada recurso e mapeia relações, como o grupo de segurança associado a uma instância."},
    {t:"Uma regra do AWS Config funciona como uma SCP: ela nega a chamada de API e impede que o recurso fora do padrão seja criado.",a:false,e:"Regras do Config avaliam a configuração e marcam o recurso como em conformidade ou não. Quem nega a chamada antes de ela acontecer são políticas como a SCP."},
    {t:"Sem criar uma trilha, a conta não tem nenhum registro de atividade no CloudTrail.",a:false,e:"O CloudTrail vem ativado por padrão: o histórico de eventos mostra os eventos de gerenciamento dos últimos 90 dias, sem custo. A trilha serve para guardar por mais tempo."}
  ],
  src:[
    {t:"AWS Config: recursos",u:"https://aws.amazon.com/config/features/"},
    {t:"CloudTrail: histórico de eventos",u:"https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html"}
  ]
},
{
  id:"aw-d2-20", exam:"clf", dom:"d2", lvl:4, type:"single", sec:95,
  tags:["conformidade-governanca"],
  case:"Uma empresa vai começar na AWS com cerca de 15 contas. A diretoria quer, com o menor esforço possível, um ambiente multicontas que siga as boas práticas da AWS, com controles preventivos e detectivos obrigatórios já aplicados, e que contas novas entrem nesse padrão sem configuração manual conta por conta.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"AWS Organizations, escrevendo e anexando as SCPs manualmente a cada unidade organizacional"},
    {k:"B",t:"AWS Control Tower, configurando uma landing zone"},
    {k:"C",t:"Pacotes de conformidade do AWS Config implantados em cada conta"},
    {k:"D",t:"IAM Identity Center, com conjuntos de permissões por equipe"}
  ],
  ans:["B"],
  why:{
    ok:"O Control Tower monta a landing zone: um ambiente multicontas bem arquitetado sobre o AWS Organizations, já com controles obrigatórios preventivos (que bloqueiam) e detectivos (que apontam desvios). Contas criadas ou registradas nas unidades organizacionais gerenciadas herdam esses controles, o que atende o pedido de padrão automático com pouco esforço.",
    A:"O Organizations é a base, mas sozinho exige desenhar e escrever cada SCP, e SCPs só previnem: não há controles detectivos prontos. Falha no menor esforço.",
    C:"Pacotes de conformidade só detectam desvios e não criam nem organizam contas. Também exigiriam implantação e manutenção próprias.",
    D:"O IAM Identity Center resolve o login e as permissões das pessoas nas contas. Não aplica controles de governança nem estrutura o ambiente multicontas."
  },
  src:[{t:"AWS Control Tower: como funciona",u:"https://docs.aws.amazon.com/controltower/latest/userguide/how-control-tower-works.html"}]
},
{
  id:"aw-d2-21", exam:"clf", dom:"d2", lvl:4, type:"single", sec:95,
  tags:["iam-role-ec2"],
  case:"Uma empresa tem 150 funcionários que já fazem login no Microsoft Entra ID e 12 contas AWS no AWS Organizations. A segurança quer um login único com as credenciais corporativas, acesso definido por grupo em cada conta e nenhum usuário do IAM criado para pessoas.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Criar um usuário do IAM por funcionário em cada conta e organizá-los em grupos"},
    {k:"B",t:"Criar um grupo de usuários do Amazon Cognito e federá-lo ao Entra ID"},
    {k:"C",t:"IAM Identity Center com o Entra ID como origem de identidade e conjuntos de permissões"},
    {k:"D",t:"Usuários do IAM numa conta central que assumem funções do IAM nas outras contas"}
  ],
  ans:["C"],
  why:{
    ok:"O IAM Identity Center integra com o Organizations e aceita um provedor externo, como o Entra ID, como origem de identidade. Os funcionários entram uma vez no portal de acesso da AWS com a credencial corporativa. Os conjuntos de permissões definem o nível de acesso e são atribuídos a grupos em várias contas, sem criar usuários do IAM.",
    A:"Funciona tecnicamente, mas cria 150 usuários por conta, com senhas separadas da credencial corporativa. Viola o requisito de não criar usuários do IAM e não dá login único.",
    B:"O Cognito serve para autenticar usuários de aplicações (clientes de um app). Ele não dá acesso de funcionários ao console e às contas AWS.",
    D:"Reduz os usuários a uma conta, mas ainda cria um usuário do IAM por pessoa, com credencial separada do Entra ID. Falha nos requisitos de login corporativo e de nenhum usuário do IAM."
  },
  src:[{t:"IAM Identity Center: acesso a contas AWS",u:"https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-accounts.html"}]
},
{
  id:"aw-d2-22", exam:"clf", dom:"d2", lvl:4, type:"multi", sec:110,
  tags:["iam-role-ec2"],
  case:"Doze analistas precisam ler relatórios em um único bucket do S3. Três deles também rodam scripts pela AWS CLI; os outros nove usam apenas o console.",
  stem:"Quais práticas seguem o privilégio mínimo e as recomendações do IAM? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Criar um grupo para os analistas e anexar a ele uma política gerenciada pelo cliente que só permite leitura naquele bucket."},
    {k:"B",t:"Gerar credenciais de acesso programático apenas para os três que usam a CLI; os outros nove ficam só com acesso ao console."},
    {k:"C",t:"Escrever a mesma política em linha em cada um dos doze usuários, para que ninguém receba permissão por engano."},
    {k:"D",t:"Anexar a política AdministratorAccess ao grupo durante a primeira semana e reduzir as permissões depois."},
    {k:"E",t:"Criar um único usuário do IAM para os três que usam a CLI, compartilhando entre eles a mesma chave de acesso."}
  ],
  ans:["A","B"],
  why:{
    ok:"A: permissões dadas ao grupo, e não pessoa a pessoa, e uma política gerenciada que a AWS recomenda por ser reutilizável e alterada num lugar só; restrita a leitura no bucket, é o mínimo necessário. B: credencial que não é usada é só superfície de ataque, então chave de acesso só existe para quem usa CLI ou SDK (e, quando possível, a preferência é por credenciais temporárias).",
    C:"A AWS recomenda política gerenciada na maioria dos casos. Política em linha serve para relação de um para um; repetida em doze usuários, cada mudança precisa ser feita doze vezes.",
    D:"Dar acesso total para ajustar depois é o oposto do privilégio mínimo: durante a semana qualquer erro ou credencial vazada tem efeito sobre a conta toda.",
    E:"Usuário compartilhado elimina a rastreabilidade (o CloudTrail não distingue quem fez o quê) e obriga a trocar a chave de todos quando alguém sai."
  },
  src:[{t:"IAM: políticas gerenciadas ou em linha",u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies-choosing-managed-or-inline.html"}]
},
{
  id:"aw-d2-23", exam:"clf", dom:"d2", lvl:4, type:"single", sec:95,
  tags:["seguranca-servicos"],
  case:"O GuardDuty gerou um achado: as credenciais de uma função do IAM foram usadas a partir de um endereço IP incomum. O analista agora precisa descobrir a causa raiz e quais outros recursos essa função acessou nas últimas semanas, vendo as interações em gráficos ao longo do tempo, sem montar consultas nem um pipeline próprio de logs.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"Amazon Detective"},
    {k:"B",t:"Amazon GuardDuty"},
    {k:"C",t:"Amazon Inspector"},
    {k:"D",t:"Histórico de eventos do AWS CloudTrail"}
  ],
  ans:["A"],
  why:{
    ok:"O Detective coleta automaticamente dados do CloudTrail, dos VPC Flow Logs e os achados do GuardDuty e monta um grafo de comportamento. Com ele o analista vê, em visualizações prontas, as interações da função ao longo do tempo e investiga a causa raiz do achado, sem escrever consultas.",
    B:"O GuardDuty é quem detectou a ameaça e gerou o achado. A etapa pedida agora é a investigação do alcance e da causa, que é o papel do Detective.",
    C:"O Inspector procura vulnerabilidades de software em instâncias, imagens de contêiner e funções Lambda. Não investiga uso suspeito de credenciais.",
    D:"O histórico de eventos lista chamadas de API brutas dos últimos 90 dias. O analista teria de filtrar e correlacionar tudo à mão, sem gráficos de interação."
  },
  src:[{t:"O que é o Amazon Detective",u:"https://docs.aws.amazon.com/detective/latest/userguide/what-is-detective.html"}]
},
{
  id:"aw-d2-24", exam:"clf", dom:"d2", lvl:3, type:"single", sec:85,
  tags:["seguranca-servicos"],
  case:"Por causa da LGPD, uma varejista precisa descobrir, entre seus 400 buckets do S3, quais guardam números de CPF em arquivos e quais desses buckets estão acessíveis publicamente ou sem criptografia. A análise precisa ser automática e recorrente, sem abrir arquivo por arquivo.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"Amazon GuardDuty com a proteção do S3"},
    {k:"B",t:"Amazon Inspector"},
    {k:"C",t:"Uma regra do AWS Config para buckets públicos"},
    {k:"D",t:"Amazon Macie"}
  ],
  ans:["D"],
  why:{
    ok:"O Macie descobre dados sensíveis dentro dos objetos do S3 usando identificadores gerenciados, que incluem o CPF brasileiro (detectado quando há uma palavra-chave próxima, como \"CPF\"). Ele também avalia a segurança dos buckets, apontando os públicos e os sem criptografia, e pode rodar a descoberta de forma automática e recorrente.",
    A:"A proteção do S3 no GuardDuty analisa eventos de acesso aos buckets em busca de comportamento malicioso. Não lê o conteúdo para achar CPF.",
    B:"O Inspector procura vulnerabilidades de software em computação (EC2, contêineres, Lambda). Não analisa dados guardados no S3.",
    C:"Uma regra do Config aponta buckets públicos, o que cobre parte do pedido, mas não examina o conteúdo dos arquivos para encontrar CPF."
  },
  src:[{t:"Macie: identificadores de dados gerenciados",u:"https://docs.aws.amazon.com/macie/latest/user/mdis-reference-quick.html"}]
},
{
  id:"aw-d2-25", exam:"clf", dom:"d2", lvl:4, type:"multi", sec:105,
  tags:["seguranca-servicos","shared-responsibility"],
  case:"Uma aplicação atrás de um Application Load Balancer grava arquivos num bucket do S3. A auditoria apontou um único problema: os dados podem trafegar sem criptografia, tanto do usuário até o balanceador quanto da aplicação até o bucket.",
  stem:"Quais medidas resolvem esse apontamento? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Ativar a criptografia padrão SSE-KMS no bucket."},
    {k:"B",t:"Emitir um certificado público no ACM e criar um listener HTTPS no balanceador."},
    {k:"C",t:"Negar, na política do bucket, requisições com aws:SecureTransport igual a false."},
    {k:"D",t:"Criar uma chave gerenciada pelo cliente no KMS com rotação automática."},
    {k:"E",t:"Ativar o Bloqueio de Acesso Público do S3 em toda a conta."}
  ],
  ans:["B","C"],
  why:{
    ok:"B: o certificado do ACM permite que o balanceador atenda em HTTPS (TLS), cifrando o trecho entre usuário e balanceador; certificados públicos usados com serviços integrados, como o ELB, não têm custo e são renovados pelo ACM. C: a chave de condição global aws:SecureTransport vale false quando a requisição chega sem HTTPS (TLS); uma instrução Deny com essa condição recusa essas chamadas e obriga a aplicação a falar com o S3 só por HTTPS.",
    A:"SSE-KMS cifra os objetos em repouso, depois de gravados. Não muda nada no tráfego até o bucket.",
    D:"Uma chave do KMS com rotação melhora a gestão da criptografia em repouso. Não cifra dados em trânsito.",
    E:"O Bloqueio de Acesso Público impede acesso público ao bucket. É controle de acesso, não criptografia do tráfego."
  },
  src:[
    {t:"O que é o AWS Certificate Manager",u:"https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html"},
    {t:"S3: criptografia de dados em trânsito",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryptionInTransit.html"}
  ]
},
{
  id:"aw-d2-26", exam:"clf", dom:"d2", lvl:4, type:"single", sec:95,
  tags:["iam-role-ec2","seguranca-servicos"],
  case:"Uma aplicação usa cerca de 40 valores de configuração (URLs de serviços, chaves de recurso ligado/desligado) e dois tokens de API que não precisam de troca automática. Tudo deve ficar organizado por ambiente, em caminhos como /prod/ e /dev/, os tokens cifrados com o KMS, e sem cobrança adicional pelo armazenamento dos valores.",
  stem:"Qual opção atende?",
  opts:[
    {k:"A",t:"AWS Secrets Manager, com um segredo para cada valor"},
    {k:"B",t:"Parâmetros padrão do Parameter Store, com SecureString para os tokens"},
    {k:"C",t:"AWS KMS, guardando cada valor como uma chave gerenciada pelo cliente"},
    {k:"D",t:"Um arquivo de configuração cifrado com SSE-S3 num bucket do S3"}
  ],
  ans:["B"],
  why:{
    ok:"O Parameter Store, do AWS Systems Manager, guarda configurações em hierarquia de caminhos (/prod/, /dev/). O tipo SecureString cifra o valor com o KMS; usando a chave gerenciada pela AWS (aws/ssm), não há taxa mensal de chave. Parâmetros do nível padrão não têm cobrança adicional pelo armazenamento. Como os tokens não precisam de rotação, o recurso que justificaria o Secrets Manager não é necessário.",
    A:"O Secrets Manager também guarda os valores, mas cobra por segredo armazenado. Seu diferencial, a rotação automática, não foi pedido. Falha no custo.",
    C:"O KMS gerencia chaves de criptografia; ele não é um repositório de valores de configuração. E cada chave gerenciada pelo cliente tem taxa mensal (US$ 1, proporcional por hora), além do custo por requisição.",
    D:"O S3 cobra pelo armazenamento e pelas requisições, e o arquivo único não oferece permissão nem versão por parâmetro e por caminho."
  },
  src:[
    {t:"Parameter Store: níveis de parâmetro",u:"https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-advanced-parameters.html"},
    {t:"AWS KMS: tipos de chave e cobrança",u:"https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html"}
  ]
},
{
  id:"aw-d2-27", exam:"clf", dom:"d2", lvl:4, type:"single", sec:100,
  tags:["sg-vs-nacl","conformidade-governanca"],
  case:"Uma empresa tem 30 contas no AWS Organizations. A segurança quer, a partir de um único lugar, aplicar as mesmas regras do AWS WAF em todos os balanceadores de aplicação e uma política padrão de grupos de segurança. Contas e recursos criados no futuro também devem receber essas proteções automaticamente.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"AWS Firewall Manager"},
    {k:"B",t:"AWS Network Firewall em cada VPC"},
    {k:"C",t:"AWS Shield Advanced"},
    {k:"D",t:"AWS WAF configurado em cada conta"}
  ],
  ans:["A"],
  why:{
    ok:"O Firewall Manager funciona sobre o AWS Organizations e aplica políticas centrais de AWS WAF, grupos de segurança, Shield Advanced, Network Firewall e DNS Firewall em todas as contas. Ele monitora contas e recursos novos para que já nasçam em conformidade com as políticas obrigatórias.",
    B:"O Network Firewall é um firewall gerenciado que filtra o tráfego dentro da VPC. Não administra regras do WAF nem grupos de segurança entre contas; quem distribui suas regras em escala é o próprio Firewall Manager.",
    C:"O Shield Advanced amplia a proteção contra DDoS. Não aplica regras do WAF nem políticas de grupos de segurança de forma central.",
    D:"Configurar o WAF conta a conta até protege os balanceadores de hoje, mas não é central e não cobre automaticamente as contas e os recursos futuros."
  },
  src:[{t:"AWS Firewall Manager: perguntas frequentes",u:"https://aws.amazon.com/firewall-manager/faqs/"}]
},
{
  id:"aw-d2-28", exam:"clf", dom:"d2", lvl:4, type:"yn", sec:110,
  tags:["conformidade-governanca","shared-responsibility"],
  stem:"Responda Sim ou Não para cada afirmação sobre os programas de conformidade da AWS.",
  rows:[
    {t:"Como a AWS tem atestado PCI DSS, uma loja que processa cartões na AWS já fica automaticamente em conformidade com o PCI DSS.",a:false,e:"O atestado cobre a infraestrutura e os serviços avaliados da AWS. A loja continua responsável pelos controles da própria carga: rede, acesso, criptografia, processos."},
    {t:"Os controles físicos e ambientais dos datacenters são herdados integralmente da AWS pelo cliente.",a:true,e:"A AWS classifica os controles físicos e ambientais como herdados: o cliente não os opera e pode usar a documentação da AWS como evidência."},
    {t:"A AWS publica, para cada programa de conformidade, a lista dos serviços que estão no escopo da avaliação.",a:true,e:"A página de serviços no escopo por programa (SOC, PCI, HIPAA, FedRAMP e outros) mostra quais serviços foram avaliados em cada um."},
    {t:"Treinar os funcionários do cliente em segurança é tarefa da AWS, porque conscientização é um controle compartilhado.",a:false,e:"É um controle compartilhado, mas cada lado cuida do seu: a AWS treina os funcionários dela e o cliente precisa treinar os próprios."}
  ],
  src:[
    {t:"AWS: Responsabilidade compartilhada (pilar de segurança)",u:"https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/shared-responsibility.html"},
    {t:"Serviços da AWS no escopo por programa de conformidade",u:"https://aws.amazon.com/compliance/services-in-scope/"}
  ]
}
];
/* Lote CLF-C02, domínio d3 (Tecnologia e serviços de nuvem): aw-d3-19 a aw-d3-34.
   Foco em IA/ML (Bedrock, SageMaker AI, serviços de IA prontos), implantação e operação,
   contêineres, análise de dados, armazenamento híbrido, IoT e serviços para usuário final. */
const QUESTIONS_CLF_D3 = [
{
  id:"aw-d3-19", exam:"clf", dom:"d3", lvl:3, type:"single", sec:80,
  tags:["ia-ml-aws"],
  case:"Uma startup quer adicionar ao seu aplicativo um recurso que gera resumos de contratos em linguagem natural. A equipe não tem cientistas de dados, não quer treinar um modelo do zero e não quer administrar servidores nem GPUs. Quer pagar conforme o uso e poder trocar de modelo de base sem reescrever a integração.",
  stem:"Qual serviço atende a esses requisitos?",
  opts:[
    {k:"A",t:"Amazon SageMaker AI, treinando e hospedando um modelo próprio em um endpoint"},
    {k:"B",t:"Amazon Comprehend, usando a análise de sentimento dos contratos"},
    {k:"C",t:"Amazon Bedrock, consumindo modelos de base por API"},
    {k:"D",t:"Amazon Lex, criando um bot que conversa com o usuário"}
  ],
  ans:["C"],
  why:{
    ok:"O Amazon Bedrock é totalmente gerenciado e dá acesso a modelos de base de vários provedores (Amazon, Anthropic, OpenAI e outros) por API. Não há infraestrutura para administrar nem modelo para treinar, a cobrança acompanha o uso e trocar de modelo exige pouca mudança na integração. Gerar resumos é um caso típico de IA generativa.",
    A:"O SageMaker AI serve para construir, treinar e implantar modelos próprios. Ele exige trabalho de ciência de dados e a gestão de endpoints, que é justamente o que a equipe quer evitar.",
    B:"O Comprehend analisa textos que já existem (sentimento, entidades, frases-chave). Ele não gera texto novo, como um resumo escrito.",
    D:"O Lex cria interfaces de conversa por voz ou texto. Ele não gera resumos de documentos longos."
  },
  src:[{t:"What is Amazon Bedrock?",u:"https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html"}]
},
{
  id:"aw-d3-20", exam:"clf", dom:"d3", lvl:4, type:"single", sec:90,
  tags:["ia-ml-aws"],
  case:"Um banco tem dez anos de histórico de transações em tabelas e uma equipe de cientistas de dados. Eles querem escolher o próprio algoritmo de classificação, controlar os hiperparâmetros do treinamento com esses dados e publicar o modelo resultante como um endpoint que responde em tempo real ao sistema de pagamentos.",
  stem:"Qual serviço da AWS é o mais indicado?",
  opts:[
    {k:"A",t:"Amazon SageMaker AI"},
    {k:"B",t:"Amazon Bedrock"},
    {k:"C",t:"Amazon Rekognition"},
    {k:"D",t:"AWS Glue"}
  ],
  ans:["A"],
  why:{
    ok:"O SageMaker AI é o serviço gerenciado para construir, treinar e implantar modelos de ML próprios. A equipe escolhe o algoritmo, ajusta o treinamento com os dados tabulares do banco e hospeda o modelo em um endpoint de inferência em tempo real.",
    B:"O Bedrock oferece modelos de base prontos para IA generativa e permite personalizá-los. Ele não é a ferramenta para treinar um classificador tabular com algoritmo e hiperparâmetros escolhidos pela equipe.",
    C:"O Rekognition analisa imagens e vídeos com modelos prontos. Ele não treina classificadores sobre transações financeiras.",
    D:"O Glue prepara e transforma dados (ETL). Pode ajudar antes do treinamento, mas não treina nem hospeda modelos."
  },
  src:[{t:"What is Amazon SageMaker AI?",u:"https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html"}]
},
{
  id:"aw-d3-21", exam:"clf", dom:"d3", lvl:3, type:"single", sec:75,
  tags:["ia-ml-aws"],
  case:"Uma seguradora recebe por dia milhares de formulários de sinistro escaneados em PDF. Ela precisa extrair automaticamente os pares campo-valor (\"Número da apólice: 12345\") e o conteúdo das tabelas de itens, mantendo a estrutura, sem digitação manual e sem treinar modelos.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"Amazon Comprehend"},
    {k:"B",t:"Amazon Rekognition"},
    {k:"C",t:"Amazon Transcribe"},
    {k:"D",t:"Amazon Textract"}
  ],
  ans:["D"],
  why:{
    ok:"O Textract extrai texto, dados de formulários (pares chave-valor) e tabelas de documentos escaneados, preservando a estrutura. É um serviço de IA pronto, que não exige treinar modelos.",
    A:"O Comprehend analisa texto que já está digitalizado (entidades, sentimento). Ele não lê a imagem do formulário nem reconhece a estrutura de campos e tabelas.",
    B:"O Rekognition detecta objetos, rostos e textos curtos em imagens e vídeos. Ele não foi feito para extrair formulários e tabelas com a estrutura preservada.",
    C:"O Transcribe converte áudio em texto. Não processa documentos escaneados."
  },
  src:[{t:"What is Amazon Textract?",u:"https://docs.aws.amazon.com/textract/latest/dg/what-is.html"}]
},
{
  id:"aw-d3-22", exam:"clf", dom:"d3", lvl:4, type:"single", sec:100,
  tags:["ia-ml-aws"],
  case:"Uma empresa quer um assistente interno que responda perguntas dos funcionários com base nos manuais e políticas guardados em um bucket do S3, citando o documento de origem. Os documentos mudam toda semana. A empresa quer usar um modelo de base pronto e não quer treinar nem retreinar modelos a cada atualização.",
  stem:"Qual abordagem atende melhor?",
  opts:[
    {k:"A",t:"Ajustar finamente (fine-tuning) um modelo no Bedrock toda semana"},
    {k:"B",t:"Amazon Bedrock Knowledge Bases, usando RAG"},
    {k:"C",t:"Treinar um modelo de linguagem do zero no SageMaker AI"},
    {k:"D",t:"Amazon Comprehend, extraindo frases-chave dos manuais"}
  ],
  ans:["B"],
  why:{
    ok:"Com RAG (geração aumentada por recuperação), o Bedrock Knowledge Bases indexa os documentos do S3, busca os trechos relevantes a cada pergunta e os entrega ao modelo de base, que responde citando a fonte. Para atualizar o conhecimento basta sincronizar a base. Nenhum modelo é retreinado.",
    A:"Fazer fine-tuning toda semana custa caro e dá trabalho. Além disso, não garante a citação do documento de origem. Para conhecimento que muda com frequência, a recuperação é mais indicada.",
    C:"Treinar um modelo de linguagem do zero exige muitos dados, tempo e especialistas. Isso contraria o requisito de usar um modelo pronto.",
    D:"O Comprehend extrai entidades e frases-chave, mas não responde perguntas em linguagem natural com base nos documentos."
  },
  src:[{t:"Amazon Bedrock Knowledge Bases",u:"https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html"}]
},
{
  id:"aw-d3-23", exam:"clf", dom:"d3", lvl:4, type:"multi", sec:100,
  tags:["ia-ml-aws"],
  case:"Uma central de atendimento grava todas as ligações em arquivos de áudio no S3. A diretoria quer transformar as gravações em texto e, a partir desse texto, descobrir automaticamente se cada cliente terminou a ligação satisfeito ou irritado.",
  stem:"Quais serviços, combinados, atendem? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Amazon Polly"},
    {k:"B",t:"Amazon Transcribe"},
    {k:"C",t:"Amazon Lex"},
    {k:"D",t:"Amazon Translate"},
    {k:"E",t:"Amazon Comprehend"}
  ],
  ans:["B","E"],
  why:{
    ok:"O Transcribe converte a fala das gravações em texto (reconhecimento automático de fala). O Comprehend analisa esse texto e identifica o sentimento (positivo, negativo, neutro ou misto). Os dois juntos cobrem o fluxo de áudio até sentimento. (O Transcribe Call Analytics também mede sentimento, mas não está entre as opções; aqui o fluxo pedido é transcrever e depois analisar o texto.)",
    A:"O Polly faz o caminho inverso: transforma texto em fala. Ele não transcreve gravações.",
    C:"O Lex cria bots de conversa por voz ou texto. Ele não analisa gravações antigas.",
    D:"O Translate traduz texto entre idiomas. Ele não transcreve áudio nem mede sentimento."
  },
  src:[
    {t:"What is Amazon Transcribe?",u:"https://docs.aws.amazon.com/transcribe/latest/dg/what-is.html"},
    {t:"Amazon Comprehend: Sentiment",u:"https://docs.aws.amazon.com/comprehend/latest/dg/how-sentiment.html"}
  ]
},
{
  id:"aw-d3-24", exam:"clf", dom:"d3", lvl:3, type:"yn", sec:100,
  tags:["ia-ml-aws"],
  stem:"Responda Sim ou Não para cada afirmação sobre os serviços de IA prontos da AWS.",
  rows:[
    {t:"O Amazon Polly converte texto em fala com som natural, o que serve, por exemplo, para narrar artigos de um portal.",a:true,e:"Correto. O Polly é o serviço de texto para fala (text-to-speech) e gera áudio a partir de texto em vários idiomas e vozes."},
    {t:"O Amazon Translate recebe um arquivo de áudio em inglês e devolve o áudio falado em português.",a:false,e:"Falso. O Translate traduz texto. Para partir de áudio é preciso transcrever antes (Transcribe) e, se quiser voz no final, sintetizar depois (Polly)."},
    {t:"Para detectar objetos comuns, como carros e pessoas, em imagens, o Amazon Rekognition exige que o cliente treine um modelo próprio antes.",a:false,e:"Falso. O Rekognition já vem com modelos pré-treinados para objetos, cenas, rostos e texto. O treinamento só é necessário para rótulos personalizados (Custom Labels)."},
    {t:"O Amazon Lex é usado para criar interfaces de conversa, como chatbots e assistentes de voz, com reconhecimento de intenção.",a:true,e:"Correto. O Lex reconhece a intenção do usuário em voz ou texto e conduz o diálogo. É a mesma tecnologia de conversa da Alexa."}
  ],
  src:[
    {t:"What is Amazon Rekognition?",u:"https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html"},
    {t:"What is Amazon Lex V2?",u:"https://docs.aws.amazon.com/lexv2/latest/dg/what-is.html"}
  ]
},
{
  id:"aw-d3-25", exam:"clf", dom:"d3", lvl:4, type:"single", sec:90,
  tags:["implantacao-operacao"],
  case:"Uma equipe de desenvolvedores TypeScript quer descrever a infraestrutura (VPC, filas, funções) como código, usando laços, classes e componentes reutilizáveis na própria linguagem que já conhece. A empresa exige que o provisionamento continue passando por pilhas do CloudFormation, por padronização e auditoria.",
  stem:"Qual ferramenta atende?",
  opts:[
    {k:"A",t:"Modelos do CloudFormation escritos em YAML"},
    {k:"B",t:"AWS Cloud Development Kit (AWS CDK)"},
    {k:"C",t:"AWS Elastic Beanstalk"},
    {k:"D",t:"AWS Systems Manager"}
  ],
  ans:["B"],
  why:{
    ok:"O AWS CDK permite definir a infraestrutura em TypeScript, Python, Java, C#, Go ou JavaScript, com todos os recursos da linguagem. Ao sintetizar o código, ele gera um modelo do CloudFormation, que provisiona os recursos. Assim a padronização pelas pilhas continua valendo.",
    A:"O YAML atende à exigência das pilhas, mas é um formato declarativo de modelo, não TypeScript. A equipe perderia as classes, os componentes reutilizáveis e o restante da linguagem que pediu.",
    C:"O Elastic Beanstalk implanta e escala aplicações web a partir do código. Não serve para descrever recursos arbitrários como código na linguagem da equipe.",
    D:"O Systems Manager opera recursos que já existem (patches, sessões, parâmetros). Não é ferramenta de infraestrutura como código."
  },
  src:[{t:"AWS CDK (Prescriptive Guidance)",u:"https://docs.aws.amazon.com/prescriptive-guidance/latest/choose-iac-tool/aws-cdk.html"}]
},
{
  id:"aw-d3-26", exam:"clf", dom:"d3", lvl:3, type:"single", sec:85,
  tags:["compute-aws","implantacao-operacao"],
  case:"Uma equipe tem uma aplicação web em Java e quer apenas enviar o código. A AWS deve criar as instâncias, o balanceador de carga e o Auto Scaling, e monitorar a saúde da aplicação. A equipe quer continuar com acesso aos recursos criados para ajustar o tipo de instância quando quiser, e não aceita pagar taxa adicional pelo serviço de implantação.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"AWS Elastic Beanstalk"},
    {k:"B",t:"Amazon Lightsail"},
    {k:"C",t:"Amazon EC2 configurado manualmente pela equipe"},
    {k:"D",t:"AWS CloudFormation com um modelo escrito pela equipe"}
  ],
  ans:["A"],
  why:{
    ok:"No Elastic Beanstalk você envia o código e o serviço cuida do provisionamento de capacidade, do balanceamento de carga, do Auto Scaling e do monitoramento de saúde. A equipe mantém controle sobre os recursos, como o tipo de instância. O Beanstalk não cobra nada a mais: paga-se só pelos recursos usados.",
    B:"O Lightsail oferece pacotes simples a preço mensal fixo, com opções limitadas de configuração e balanceamento básico. Não é o serviço que implanta código com Auto Scaling gerenciado.",
    C:"Com o EC2 configurado à mão, a equipe teria de criar e operar o balanceador, o Auto Scaling e o monitoramento por conta própria, o que contraria o requisito.",
    D:"O CloudFormation provisiona recursos, mas exige que a equipe escreva e mantenha todo o modelo. Ele não cuida da implantação da aplicação a partir do código."
  },
  src:[{t:"Lightsail, Elastic Beanstalk ou EC2?",u:"https://docs.aws.amazon.com/decision-guides/latest/decision-guides/lightsail-elastic-beanstalk-ec2.html"}]
},
{
  id:"aw-d3-27", exam:"clf", dom:"d3", lvl:4, type:"single", sec:90,
  tags:["implantacao-operacao"],
  case:"Uma empresa tem 300 instâncias EC2 e 40 servidores no datacenter próprio. Ela precisa aplicar automaticamente as atualizações de segurança do sistema operacional em uma janela semanal, com regras de quais patches são aprovados, e mostrar ao auditor quais máquinas estão fora de conformidade.",
  stem:"Qual recurso atende?",
  opts:[
    {k:"A",t:"Amazon Inspector"},
    {k:"B",t:"AWS Config"},
    {k:"C",t:"AWS Systems Manager Parameter Store"},
    {k:"D",t:"AWS Systems Manager Patch Manager"}
  ],
  ans:["D"],
  why:{
    ok:"O Patch Manager automatiza a aplicação de patches em nós gerenciados, incluindo instâncias EC2 e servidores locais. As regras de aprovação ficam em uma linha de base de patches, e a execução pode ser agendada numa janela de manutenção. O serviço também gera relatórios de conformidade por máquina.",
    A:"O Inspector encontra vulnerabilidades de software, mas não instala patches nem agenda janelas de atualização.",
    B:"O Config registra e avalia configurações de recursos. Ele não instala atualizações de sistema operacional.",
    C:"O Parameter Store guarda parâmetros de configuração e valores sensíveis. Não aplica patches."
  },
  src:[{t:"AWS Systems Manager Patch Manager",u:"https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager.html"}]
},
{
  id:"aw-d3-28", exam:"clf", dom:"d3", lvl:4, type:"single", sec:90,
  tags:["implantacao-operacao"],
  case:"Uma aplicação de pedidos é formada por oito microsserviços que chamam uns aos outros. Algumas requisições demoram 6 segundos, mas as métricas médias de CPU de cada serviço parecem normais. A equipe precisa seguir cada requisição de ponta a ponta e ver em qual serviço da cadeia o tempo está sendo gasto.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"Amazon CloudWatch, com um alarme sobre a CPU de cada serviço"},
    {k:"B",t:"AWS X-Ray"},
    {k:"C",t:"AWS CloudTrail"},
    {k:"D",t:"AWS Config"}
  ],
  ans:["B"],
  why:{
    ok:"O X-Ray faz rastreamento distribuído. Ele registra o caminho de cada requisição pelos serviços, mede o tempo gasto em cada trecho e mostra tudo num mapa de rastreamento. Assim fica fácil achar o serviço que causa a lentidão.",
    A:"O CloudWatch coleta métricas, logs e alarmes, mas um alarme de CPU mostra valores agregados por serviço. O enunciado já diz que essas métricas parecem normais, e elas não acompanham uma requisição individual pela cadeia.",
    C:"O CloudTrail registra chamadas de API feitas na conta AWS (quem fez o quê e quando). Não mede a latência das requisições da aplicação.",
    D:"O Config registra o histórico de configuração dos recursos. Não rastreia requisições."
  },
  src:[{t:"What is AWS X-Ray?",u:"https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html"}]
},
{
  id:"aw-d3-29", exam:"clf", dom:"d3", lvl:3, type:"yn", sec:100,
  tags:["implantacao-operacao"],
  stem:"Responda Sim ou Não para cada afirmação sobre o AWS Systems Manager.",
  rows:[
    {t:"No Parameter Store, um parâmetro do tipo SecureString é armazenado criptografado com uma chave do AWS KMS.",a:true,e:"Correto. O SecureString guarda valores sensíveis criptografados com o KMS, e o acesso pode ser controlado por políticas do IAM."},
    {t:"Para abrir uma sessão pelo Session Manager, é obrigatório liberar a porta 22 de entrada no grupo de segurança da instância.",a:false,e:"Falso. O Session Manager funciona pelo agente do SSM, sem precisar abrir portas de entrada, manter bastião ou distribuir chaves SSH."},
    {t:"O Parameter Store faz rotação automática de senhas de banco de dados de forma nativa, como o AWS Secrets Manager.",a:false,e:"Falso. A rotação automática nativa de segredos é um recurso do Secrets Manager. O Parameter Store guarda valores, mas não os rotaciona sozinho."},
    {t:"O Patch Manager também pode atualizar servidores locais e máquinas virtuais fora da AWS, desde que estejam registrados como nós gerenciados.",a:true,e:"Correto. O Patch Manager atende frotas de EC2, servidores locais, máquinas virtuais e dispositivos de borda configurados como nós gerenciados."}
  ],
  src:[
    {t:"AWS Systems Manager Patch Manager",u:"https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager.html"},
    {t:"AWS Systems Manager Parameter Store",u:"https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html"}
  ]
},
{
  id:"aw-d3-30", exam:"clf", dom:"d3", lvl:3, type:"order", sec:90,
  tags:["implantacao-operacao"],
  stem:"A equipe quer receber um e-mail quando a CPU de uma instância passar de 80% por 10 minutos. Ordene o que acontece, do PRIMEIRO ao ÚLTIMO passo.",
  items:[
    {t:"O EC2 publica no Amazon CloudWatch a métrica de utilização de CPU da instância"},
    {t:"O alarme do CloudWatch compara a métrica com o limite de 80% nos períodos configurados"},
    {t:"O alarme muda do estado OK para o estado ALARM"},
    {t:"A ação do alarme publica em um tópico do Amazon SNS, que envia o e-mail à equipe"}
  ],
  e:"Sem métrica, não há o que avaliar, então tudo começa com o EC2 publicando a métrica no CloudWatch (a cada 5 minutos no monitoramento básico, ou a cada minuto no detalhado). O alarme avalia os dados contra o limite durante os períodos definidos. Quando a condição se mantém, ele troca de estado para ALARM, e é essa mudança que dispara a ação configurada. A ação publica no tópico do SNS, que entrega o e-mail aos inscritos.",
  src:[{t:"Using Amazon CloudWatch alarms",u:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html"}]
},
{
  id:"aw-d3-31", exam:"clf", dom:"d3", lvl:4, type:"multi", sec:110,
  tags:["compute-aws"],
  case:"Uma empresa roda seus contêineres em Kubernetes no datacenter e vai migrar para a AWS. Requisitos: manter os manifestos e as ferramentas do Kubernetes que a equipe já usa, não administrar servidores para os nós (nada de escolher tipo de instância ou aplicar patch no sistema operacional) e guardar as imagens em um registro privado gerenciado.",
  stem:"Quais serviços, combinados, atendem? Escolha as TRÊS corretas.",
  opts:[
    {k:"A",t:"Amazon EKS"},
    {k:"B",t:"Amazon ECS"},
    {k:"C",t:"Amazon ECR"},
    {k:"D",t:"AWS Fargate"},
    {k:"E",t:"Instâncias EC2 em um grupo de Auto Scaling como nós"}
  ],
  ans:["A","C","D"],
  why:{
    ok:"O EKS oferece o Kubernetes gerenciado, então os manifestos e as ferramentas continuam funcionando. Com o Fargate, os pods rodam sem que a equipe provisione, escale ou aplique patches em instâncias. O ECR é o registro privado e gerenciado de imagens de contêiner.",
    B:"O ECS também orquestra contêineres, mas usa as próprias definições de tarefa, não o Kubernetes. A equipe teria de reescrever os manifestos.",
    E:"Usar nós EC2 obriga a escolher o tipo de instância e manter o sistema operacional, o que fere o requisito de não administrar servidores."
  },
  src:[
    {t:"Simplify compute management with AWS Fargate (EKS)",u:"https://docs.aws.amazon.com/eks/latest/userguide/fargate.html"},
    {t:"What is Amazon ECR?",u:"https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html"}
  ]
},
{
  id:"aw-d3-32", exam:"clf", dom:"d3", lvl:4, type:"single", sec:95,
  tags:["bancos-aws"],
  case:"Uma empresa tem dezenas de conjuntos de dados em CSV e JSON no S3, vindos de sistemas diferentes, e ninguém documentou o formato de cada um. Ela quer descobrir os esquemas automaticamente, manter um catálogo central de metadados e rodar tarefas de transformação para Parquet sem administrar clusters.",
  stem:"Qual serviço atende a todos os requisitos?",
  opts:[
    {k:"A",t:"Amazon EMR"},
    {k:"B",t:"Amazon Athena"},
    {k:"C",t:"AWS Glue"},
    {k:"D",t:"Amazon OpenSearch Service"}
  ],
  ans:["C"],
  why:{
    ok:"O AWS Glue é um serviço de integração de dados sem servidor. Os crawlers leem os arquivos e descobrem o esquema sozinhos, o Glue Data Catalog guarda os metadados de forma central e os trabalhos de ETL convertem os dados para Parquet sem cluster para administrar.",
    A:"O EMR roda frameworks como Spark e Hadoop e consegue transformar os dados, mas não descobre esquemas nem mantém um catálogo por conta própria. No modo clássico, a equipe ainda administra o cluster.",
    B:"O Athena consulta com SQL dados que já estão no S3, normalmente usando o catálogo do Glue. Ele não descobre os esquemas sozinho.",
    D:"O OpenSearch Service indexa dados para busca textual e análise de logs. Não é ferramenta de catálogo nem de ETL para data lake."
  },
  src:[{t:"What is AWS Glue?",u:"https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html"}]
},
{
  id:"aw-d3-33", exam:"clf", dom:"d3", lvl:4, type:"single", sec:90,
  tags:["s3-classes"],
  case:"Um hospital usa um software de backup que grava em uma biblioteca de fitas físicas. A diretoria quer acabar com as fitas e mandar os backups para a nuvem a um custo baixo de arquivamento, mas sem trocar o software de backup nem mudar os procedimentos da equipe.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"AWS Backup, com um plano de backup para o datacenter"},
    {k:"B",t:"Tape Gateway do AWS Storage Gateway"},
    {k:"C",t:"AWS DataSync, copiando os arquivos para o S3"},
    {k:"D",t:"Uma regra de ciclo de vida do S3 para a classe Glacier"}
  ],
  ans:["B"],
  why:{
    ok:"O Tape Gateway se apresenta ao software de backup como uma biblioteca de fitas virtual, então o software e os procedimentos continuam os mesmos. As fitas virtuais podem ser arquivadas no S3 Glacier Flexible Retrieval ou no S3 Glacier Deep Archive, e o hospital deixa de manter infraestrutura de fita física.",
    A:"O AWS Backup centraliza políticas de backup de serviços da AWS, mas não emula uma biblioteca de fitas para o software atual. A equipe teria de trocar o processo.",
    C:"O DataSync transfere e sincroniza arquivos com o S3. Ele não substitui o destino em fita do software de backup.",
    D:"Uma regra de ciclo de vida só move objetos que já estão no S3. Ela não resolve como levar os backups do software de fita até a nuvem."
  },
  src:[{t:"What is Tape Gateway?",u:"https://docs.aws.amazon.com/storagegateway/latest/tgw/WhatIsStorageGateway.html"}]
},
{
  id:"aw-d3-34", exam:"clf", dom:"d3", lvl:4, type:"single", sec:90,
  tags:["sqs-sns-eb"],
  case:"Uma distribuidora de energia vai instalar 50 mil medidores inteligentes que enviam leituras pelo protocolo MQTT. Cada medidor precisa se autenticar com um certificado próprio, e as leituras devem ser encaminhadas por regras para uma tabela do DynamoDB.",
  stem:"Qual serviço atende esses requisitos?",
  opts:[
    {k:"A",t:"Amazon SQS"},
    {k:"B",t:"Amazon Kinesis Data Streams"},
    {k:"C",t:"Amazon SNS"},
    {k:"D",t:"AWS IoT Core"}
  ],
  ans:["D"],
  why:{
    ok:"O AWS IoT Core tem um agente de mensagens compatível com MQTT feito para conectar grandes frotas de dispositivos. Cada dispositivo se autentica com certificado X.509 próprio, e o mecanismo de regras encaminha as mensagens para outros serviços, como o DynamoDB.",
    A:"O SQS é uma fila de mensagens entre aplicações. Ele não fala MQTT nem gerencia a identidade de cada dispositivo.",
    B:"O Kinesis Data Streams ingere fluxos de dados em alta escala, mas não é um agente MQTT e não autentica cada medidor por certificado.",
    C:"O SNS distribui notificações para assinantes. Não é a porta de entrada MQTT com identidade por dispositivo."
  },
  src:[{t:"How AWS IoT works",u:"https://docs.aws.amazon.com/iot/latest/developerguide/aws-iot-how-it-works.html"}]
}
];
/* Lote: questões CLF-C02, domínio d4 (Cobrança, preços e suporte), ids aw-d4-11 a aw-d4-20 */
const QUESTIONS_CLF_D4 = [
{
  id:"aw-d4-11", exam:"clf", dom:"d4", lvl:4, type:"single", sec:95, tags:["custo-ferramentas"],
  case:"A conta de desenvolvimento de uma empresa costuma estourar o valor previsto no fim do mês. A diretoria quer três coisas: ser avisada quando a PREVISÃO de gasto do mês chegar a 90% do limite, ainda antes de o dinheiro ser gasto; impedir automaticamente que novas instâncias EC2 sejam criadas a partir desse ponto, sem desligar as que já estão rodando; e não escrever nenhum código.",
  stem:"Qual solução atende aos três requisitos?",
  opts:[
    {k:"A",t:"Alarme de cobrança do CloudWatch na métrica de cobrança estimada, enviando e-mail para a diretoria por um tópico do SNS"},
    {k:"B",t:"AWS Cost Anomaly Detection com monitor da conta e alertas por e-mail para a equipe"},
    {k:"C",t:"AWS Budgets com alerta de custo previsto em 90% e uma ação de orçamento que aplica política do IAM de negação"},
    {k:"D",t:"Verificações de otimização de custos do Trusted Advisor com relatório semanal por e-mail"}
  ],
  ans:["C"],
  why:{
    ok:"O AWS Budgets permite alertar sobre o custo previsto, antes de ele acontecer, e não só sobre o custo real. A ação de orçamento pode disparar no mesmo limite de 90% do custo previsto, sozinha ou após aprovação, e aplicar uma política do IAM ou uma SCP que nega a criação de recursos. As instâncias existentes continuam rodando, e tudo é configurado no console, sem código.",
    A:"O alarme de cobrança avisa quando o gasto estimado já acumulado passa de um valor. Ele não bloqueia nada por conta própria: para impedir novas instâncias seria preciso escrever uma automação.",
    B:"O Cost Anomaly Detection encontra gastos fora do padrão e avisa. Ele não trabalha com um limite definido nem aplica política para bloquear a criação de recursos.",
    D:"O Trusted Advisor aponta desperdício, como recurso ocioso. Ele não acompanha um limite de orçamento nem toma ação automática."
  },
  src:[{t:"AWS Budgets: ações de orçamento",u:"https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-controls.html"},
       {t:"Gerenciar custos com o AWS Budgets",u:"https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html"}]
},
{
  id:"aw-d4-12", exam:"clf", dom:"d4", lvl:4, type:"single", sec:85, tags:["pricing-models"],
  case:"Uma aplicação roda na região us-east-1. Clientes enviam arquivos pela internet, as instâncias de aplicação e de processamento ficam na mesma zona de disponibilidade e, toda noite, os dados são replicados para um bucket na região sa-east-1, para recuperação de desastre. Depois que a replicação começou, a linha de transferência de dados da fatura cresceu.",
  stem:"Qual afirmação explica corretamente essa cobrança?",
  opts:[
    {k:"A",t:"Toda transferência de dados é cobrada, inclusive o envio dos clientes para a AWS"},
    {k:"B",t:"Tráfego que atravessa a fronteira entre regiões normalmente é cobrado"},
    {k:"C",t:"O aumento vem do tráfego entre as instâncias que estão na mesma zona de disponibilidade"},
    {k:"D",t:"A cópia entre regiões só seria cobrada se os dados passassem pela internet pública"}
  ],
  ans:["B"],
  why:{
    ok:"A replicação diária leva dados de us-east-1 para sa-east-1, e tráfego que sai de uma região para outra normalmente é cobrado. Isso bate com o momento em que a fatura cresceu. Os outros fluxos do cenário (entrada vinda da internet e tráfego dentro da mesma zona) não geram essa cobrança.",
    A:"Não é tudo que é cobrado. A AWS não cobra pela transferência de dados de entrada vinda da internet, em nenhum serviço e em nenhuma região.",
    C:"Transferência de dados dentro da mesma zona de disponibilidade é gratuita. Cobrança aparece quando o tráfego cruza zonas ou regiões.",
    D:"A cobrança entre regiões acontece mesmo com o tráfego dentro da rede da AWS. O que define a cobrança é sair da região, não usar a internet."
  },
  src:[{t:"AWS: custos de transferência de dados em arquiteturas comuns",u:"https://aws.amazon.com/blogs/architecture/overview-of-data-transfer-costs-for-common-architectures/"}]
},
{
  id:"aw-d4-13", exam:"clf", dom:"d4", lvl:4, type:"single", sec:90, tags:["custo-ferramentas"],
  case:"O financeiro quer ver quanto cada equipe gastou com EC2 nos últimos seis meses. A tag \"equipe\" já está aplicada aos recursos e ativada como tag de alocação de custo. A analista não programa, quer explorar os números pelo console e não quer gerar nenhum custo adicional com a consulta.",
  stem:"Qual é a forma mais adequada?",
  opts:[
    {k:"A",t:"Um script que chama a API do Cost Explorer todo dia e grava os resultados numa planilha"},
    {k:"B",t:"O Cost and Usage Report entregue num bucket do S3 e consultado com o Amazon Athena"},
    {k:"C",t:"A AWS Pricing Calculator com um grupo de estimativa para cada equipe"},
    {k:"D",t:"O Cost Explorer no console, filtrando pelo serviço EC2 e agrupando pela tag equipe"}
  ],
  ans:["D"],
  why:{
    ok:"O Cost Explorer mostra, por padrão, até 13 meses de histórico, aceita filtro por serviço e agrupamento por tag de alocação de custo ativada. Usar a interface do console não tem custo, e a análise é feita com cliques, sem código.",
    A:"Exige programar, e cada requisição paginada à API do Cost Explorer é cobrada. Falha nos requisitos de sem código e sem custo adicional.",
    B:"O Cost and Usage Report é o dado mais detalhado, mas precisa ser processado com consultas, e o Athena cobra pelos dados lidos. É mais trabalho e mais custo do que o pedido exige.",
    C:"A calculadora estima o custo de algo planejado. Ela não lê o gasto real da conta nem as tags dos recursos."
  },
  src:[{t:"O que é o AWS Cost Explorer",u:"https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html"},
       {t:"Cost Explorer: filtrar os dados",u:"https://docs.aws.amazon.com/cost-management/latest/userguide/ce-filtering.html"}]
},
{
  id:"aw-d4-14", exam:"clf", dom:"d4", lvl:3, type:"multi", sec:90, tags:["custo-ferramentas"],
  case:"Uma equipe está montando a proposta de um projeto novo, que ainda não tem nenhum recurso criado na AWS, e precisa apresentar os números para a diretoria aprovar.",
  stem:"Quais tarefas a AWS Pricing Calculator atende? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Estimar o custo mensal de uma arquitetura que ainda não foi criada"},
    {k:"B",t:"Gerar um link público da estimativa para a diretoria abrir e revisar"},
    {k:"C",t:"Mostrar quanto foi cobrado de fato em cada um dos últimos meses, por serviço"},
    {k:"D",t:"Enviar um e-mail quando o gasto real passar do valor estimado"},
    {k:"E",t:"Garantir que o valor estimado será o mesmo cobrado na fatura"}
  ],
  ans:["A","B"],
  why:{
    ok:"A Pricing Calculator monta estimativas a partir dos serviços e da configuração que você escolhe, sem precisar que nada exista na conta. Cada estimativa pode ganhar um link público, salvo nos servidores da AWS, e também pode ser exportada em PDF ou JSON.",
    C:"O gasto real dos meses anteriores aparece no Cost Explorer e nas faturas do console de cobrança, não na calculadora.",
    D:"Avisar quando o gasto real passa de um limite é papel do AWS Budgets.",
    E:"É uma estimativa. O valor cobrado depende do uso real, que pode ser diferente do que foi planejado."
  },
  src:[{t:"Pricing Calculator: compartilhar estimativa",u:"https://docs.aws.amazon.com/pricing-calculator/latest/userguide/save-share-estimate.html"}]
},
{
  id:"aw-d4-15", exam:"clf", dom:"d4", lvl:5, type:"single", sec:100, tags:["pricing-models"],
  case:"Uma organização no AWS Organizations usa cobrança consolidada. A conta de produção comprou um Savings Plan de computação, e o desconto hoje se espalha pelas outras contas. Por regra contábil, a conta de uma unidade de negócio que será vendida deve passar a pagar o preço cheio, sem receber descontos de compromissos de outras contas. As demais contas devem continuar compartilhando normalmente.",
  stem:"O que deve ser feito?",
  opts:[
    {k:"A",t:"Na conta de gerenciamento, desativar o compartilhamento de descontos de RI e Savings Plans só para aquela conta"},
    {k:"B",t:"Aplicar à conta uma SCP que negue todas as ações do serviço Savings Plans"},
    {k:"C",t:"Mover a conta para uma unidade organizacional separada dentro da mesma organização"},
    {k:"D",t:"Cancelar o Savings Plan atual e comprar um novo, separado, em cada uma das contas que devem continuar com desconto"}
  ],
  ans:["A"],
  why:{
    ok:"A conta de gerenciamento controla, nas preferências de cobrança, o compartilhamento de descontos de instâncias reservadas e Savings Plans conta a conta. Desativando só para a conta da unidade vendida, ela deixa de receber os descontos e as outras continuam compartilhando. A fatura final do mês usa as preferências vigentes no último dia do mês.",
    B:"SCP limita quais chamadas de API a conta pode fazer. Ela não muda a forma como a cobrança consolidada distribui descontos já comprados.",
    C:"Unidade organizacional serve para agrupar contas e aplicar políticas. Mover a conta de OU não muda o compartilhamento de descontos, que é configurado por conta nas preferências de cobrança.",
    D:"Fora de uma curta janela de devolução (planos de até US$ 100 por hora, comprados há no máximo 7 dias e no mesmo mês), um Savings Plan não pode ser cancelado. E a troca é desnecessária: basta ajustar a preferência de compartilhamento."
  },
  src:[{t:"Compartilhamento de descontos de RI e Savings Plans",u:"https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ri-turn-off.html"}]
},
{
  id:"aw-d4-16", exam:"clf", dom:"d4", lvl:4, type:"yn", sec:90, tags:["pricing-models"],
  stem:"Responda Sim ou Não para cada afirmação sobre suporte e fontes de ajuda da AWS.",
  rows:[
    {t:"No plano Basic, sem custo adicional, o cliente pode abrir um caso individual sobre dúvidas de conta e cobrança.", a:true,
     e:"Sim. Todo cliente tem, no Basic, atendimento individual para conta e cobrança e pedidos de aumento de cota de serviço."},
    {t:"No plano Basic, é possível abrir caso técnico e falar com um engenheiro de suporte por telefone 24 horas.", a:false,
     e:"Não. Casos técnicos com engenheiros de suporte, com acesso 24 horas por telefone, chat e web, só existem nos planos pagos, a partir do Business Support+."},
    {t:"Para perguntar no AWS re:Post, é obrigatório ter um plano de suporte pago.", a:false,
     e:"Não. O re:Post é aberto a todos. O plano de suporte é opcional: com ele, se a comunidade não responder, a pergunta recebe resposta mais rápida do AWS Support."},
    {t:"A AWS Professional Services e as empresas da AWS Partner Network podem ser contratadas para ajudar a projetar e migrar cargas de trabalho.", a:true,
     e:"Sim. A Professional Services é a equipe da própria AWS para projetar, construir e migrar cargas, e os parceiros da AWS Partner Network complementam com conhecimento de setor."}
  ],
  src:[{t:"Planos do AWS Support",u:"https://docs.aws.amazon.com/awssupport/latest/user/aws-support-plans.html"},
       {t:"Sobre o AWS re:Post",u:"https://repost.aws/about"}]
},
{
  id:"aw-d4-17", exam:"clf", dom:"d4", lvl:3, type:"single", sec:80, tags:["pricing-models"],
  case:"Uma empresa quer usar um software de monitoramento de outro fabricante em suas instâncias EC2. O compras exige que a cobrança apareça na fatura da AWS que já é paga todo mês, sem cadastrar um fornecedor novo, e a equipe quer pagar por hora de uso.",
  stem:"Qual opção atende?",
  opts:[
    {k:"A",t:"Contratar a AWS Professional Services para instalar o software nas instâncias"},
    {k:"B",t:"Comprar a licença no site do fabricante e instalar o software no EC2"},
    {k:"C",t:"Contratar um parceiro da AWS Partner Network, com contrato e fatura próprios"},
    {k:"D",t:"Assinar o produto no AWS Marketplace"}
  ],
  ans:["D"],
  why:{
    ok:"No AWS Marketplace, a empresa assina software de terceiros e as cobranças, inclusive as por hora de uso, chegam na fatura mensal da AWS. Não há cadastro de fornecedor novo nem processo de pagamento separado.",
    A:"A Professional Services presta consultoria e implementação. Ela não revende licença de software de terceiros por hora na fatura.",
    B:"A licença comprada direto do fabricante gera fatura separada e exige cadastrar o fabricante como fornecedor.",
    C:"O parceiro pode ajudar na implantação, mas, com contrato e fatura próprios, a cobrança não fica na fatura da AWS."
  },
  src:[{t:"AWS Marketplace: pagamento de produtos",u:"https://docs.aws.amazon.com/marketplace/latest/buyerguide/buyer-paying-for-products.html"}]
},
{
  id:"aw-d4-18", exam:"clf", dom:"d4", lvl:4, type:"single", sec:85, tags:["custo-ferramentas"],
  case:"Uma empresa suspeita que paga por capacidade que não usa. Ela quer recomendações de tamanho para instâncias EC2, volumes EBS e memória de funções Lambda, com base nas métricas reais de utilização. Por enquanto, não quer assumir nenhum compromisso de prazo com a AWS.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"AWS Compute Optimizer"},
    {k:"B",t:"Recomendações de compra de Savings Plans no Cost Explorer"},
    {k:"C",t:"AWS Budgets com um orçamento de uso para cada serviço"},
    {k:"D",t:"AWS Pricing Calculator com as configurações atuais da conta"}
  ],
  ans:["A"],
  why:{
    ok:"O Compute Optimizer analisa as métricas de uso e recomenda o tamanho certo para instâncias EC2, grupos do Auto Scaling, volumes EBS, memória de funções Lambda e outros recursos. É ajuste de tamanho, sem compromisso de prazo.",
    B:"Essas recomendações dizem quanto compromisso por hora comprar. Isso exige prazo de 1 ou 3 anos e não diz se o recurso está grande demais.",
    C:"Orçamento de uso avisa quando o consumo passa de um limite, mas não diz qual tamanho de recurso seria o adequado.",
    D:"A calculadora estima o preço de uma configuração escolhida por você. Ela não analisa a utilização real dos recursos."
  },
  src:[{t:"Recursos suportados pelo Compute Optimizer",u:"https://docs.aws.amazon.com/compute-optimizer/latest/ug/supported-resources.html"}]
},
{
  id:"aw-d4-19", exam:"clf", dom:"d4", lvl:4, type:"order", sec:90, tags:["custo-ferramentas"],
  stem:"Uma organização quer ver no Cost Explorer o custo de cada projeto usando a tag \"projeto\". Ordene as etapas do PRIMEIRO ao ÚLTIMO.",
  items:[
    {t:"Aplicar a tag \"projeto\" aos recursos de cada projeto"},
    {t:"Na conta de gerenciamento, ativar a chave \"projeto\" como tag de alocação de custo no console de Billing and Cost Management"},
    {t:"Aguardar a ativação da tag, que pode levar até 24 horas"},
    {t:"No Cost Explorer, agrupar os custos pela tag \"projeto\""}
  ],
  e:"A chave da tag só aparece na lista de tags de alocação de custo depois de aplicada a recursos (pode levar até 24 horas). Numa organização, só a conta de gerenciamento acessa esse gerenciador para ativá-la, e a ativação também pode levar até 24 horas. Só depois disso a tag fica disponível para agrupar custos no Cost Explorer. Aplicar a tag não basta: sem ativar, ela não aparece nas ferramentas de custo.",
  src:[{t:"Ativar tags de alocação de custo",u:"https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/activating-tags.html"},
       {t:"Tags de alocação de custo definidas pelo usuário",u:"https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/custom-tags.html"}]
},
{
  id:"aw-d4-20", exam:"clf", dom:"d4", lvl:4, type:"multi", sec:100, tags:["pricing-models"],
  case:"O financeiro está comparando Savings Plans, instâncias reservadas e instâncias spot para entender como cada modelo aparece na fatura.",
  stem:"Quais afirmações sobre a cobrança desses modelos estão corretas? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"No Savings Plan, o compromisso é um gasto por hora por 1 ou 3 anos, e não dá para cancelar no meio do prazo"},
    {k:"B",t:"O uso que passa do compromisso do Savings Plan é cobrado pela tarifa sob demanda"},
    {k:"C",t:"Instâncias spot exigem compromisso mínimo de 1 ano para receber o desconto"},
    {k:"D",t:"O Savings Plan reserva capacidade numa zona de disponibilidade e garante que a instância sempre inicie"},
    {k:"E",t:"O desconto do Savings Plan também se aplica ao uso spot, somando os dois descontos"}
  ],
  ans:["A","B"],
  why:{
    ok:"O Savings Plan é um compromisso de gasto por hora, por 1 ou 3 anos. Só existe uma curta janela de devolução logo após a compra (planos de até US$ 100 por hora, em até 7 dias e no mesmo mês); depois disso, não há cancelamento. A cada hora, o uso elegível até o valor comprometido recebe o desconto, e o que passar disso é cobrado como sob demanda. Instâncias reservadas seguem lógica parecida de prazo, mas ligadas a atributos de instância.",
    C:"Spot não tem compromisso de prazo. O desconto vem de usar capacidade ociosa, que a AWS pode interromper.",
    D:"Savings Plans não reservam capacidade. Para garantir capacidade, combine com uma reserva de capacidade sob demanda.",
    E:"Savings Plans não se aplicam ao uso spot nem ao uso já coberto por instâncias reservadas."
  },
  src:[{t:"Savings Plans e instâncias reservadas",u:"https://docs.aws.amazon.com/savingsplans/latest/userguide/sp-ris.html"},
       {t:"Perguntas frequentes sobre Savings Plans",u:"https://aws.amazon.com/savingsplans/faq/"}]
}
];
/* Lote: questões SAA-C03, domínio d1 (Arquiteturas seguras), ids saa-d1-22 a saa-d1-35 */
const QUESTIONS_SAA_D1 = [
{
  id:"saa-d1-22", exam:"saa", dom:"d1", lvl:4, type:"single", sec:110,
  tags:["deteccao-auditoria"],
  case:"Uma organização no AWS Organizations tem 40 contas e vai criar mais. A auditoria exige três coisas: registrar as chamadas de API de todas as contas sem configurar trilha conta por conta; impedir que administradores das contas-membro desliguem ou alterem esse registro; e garantir que os arquivos de log não possam ser apagados nem sobrescritos por ninguém durante sete anos, nem pela própria equipe de segurança.",
  stem:"Qual arquitetura atende aos três requisitos?",
  opts:[
    {k:"A",t:"Criar uma trilha em cada conta-membro com o CloudFormation StackSets, gravando num bucket da própria conta com versionamento, MFA Delete e criptografia SSE-KMS."},
    {k:"B",t:"Criar uma trilha organizacional na conta de gerenciamento, entregando num bucket da conta de log com Object Lock em modo conformidade e retenção de sete anos."},
    {k:"C",t:"Criar uma trilha organizacional na conta de gerenciamento, entregando num bucket da conta de log com Object Lock em modo governança e retenção de sete anos."},
    {k:"D",t:"Ativar o AWS Config em todas as contas, com um agregador na conta de log e uma regra que avisa quando o CloudTrail de alguma conta for desligado."}
  ],
  ans:["B"],
  why:{
    ok:"A trilha organizacional, criada na conta de gerenciamento (ou numa administradora delegada), cobre todas as contas da organização, inclusive as novas, e as contas-membro conseguem vê-la mas não podem desligá-la nem alterá-la. Entregar os logs num bucket de uma conta de log separada tira os arquivos do alcance das contas de origem. O Object Lock em modo conformidade impede que qualquer usuário, inclusive o raiz, apague ou sobrescreva uma versão protegida antes do fim da retenção, e o prazo não pode ser encurtado.",
    A:"Trilhas locais ficam sob controle de quem administra cada conta, que pode pará-las ou apagá-las. O MFA Delete só dificulta a exclusão: o dono do bucket com MFA ainda consegue apagar versões, então não há imutabilidade.",
    C:"Resolve a cobertura e a proteção contra as contas-membro, mas o modo governança pode ser contornado por quem tem a permissão s3:BypassGovernanceRetention. O requisito diz que ninguém pode apagar, então só o modo conformidade atende.",
    D:"O AWS Config registra configurações e avalia conformidade. Ele detecta que a trilha foi desligada, mas não impede a ação, não registra as chamadas de API e não torna os logs imutáveis."
  },
  src:[
    {t:"CloudTrail: trilha para uma organização",u:"https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html"},
    {t:"S3: Object Lock",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html"}
  ]
},
{
  id:"saa-d1-23", exam:"saa", dom:"d1", lvl:4, type:"single", sec:110,
  tags:["deteccao-auditoria"],
  case:"Uma empresa tem 60 contas na organização. A segurança quer avaliar continuamente, em todas as contas, um conjunto padronizado de regras (buckets sem criptografia, volumes EBS sem criptografia e grupos de segurança com SSH aberto para 0.0.0.0/0). O SSH aberto deve ser corrigido automaticamente, sem que a equipe escreva e mantenha código próprio, e tudo deve ser administrado a partir da conta de ferramentas de segurança, não da conta de gerenciamento.",
  stem:"Qual solução atende com o menor esforço operacional?",
  opts:[
    {k:"A",t:"Ativar o Amazon GuardDuty na organização, com a conta de segurança como administradora delegada, e revogar as regras abertas a partir dos achados."},
    {k:"B",t:"Aplicar uma SCP que negue a criação de regras de entrada na porta 22 e usar as verificações do AWS Trusted Advisor para os demais itens."},
    {k:"C",t:"Usar o Amazon Inspector nas contas e regras do EventBridge que acionam uma função Lambda própria para remover as regras de SSH aberto."},
    {k:"D",t:"Fazer da conta de segurança a administradora delegada do AWS Config e implantar um pacote de conformidade organizacional com correção automática."}
  ],
  ans:["D"],
  why:{
    ok:"Um pacote de conformidade reúne regras do AWS Config e ações de correção num único modelo. Na versão organizacional, ele é implantado nas contas-membro a partir da conta de gerenciamento ou de uma administradora delegada, o que atende à exigência de operar pela conta de segurança. A correção automática usa documentos de Automation do Systems Manager, inclusive os gerenciados pela AWS, então não há código próprio para manter. As regras avaliam continuamente os recursos que já existem e os novos.",
    A:"O GuardDuty detecta ameaças a partir de logs, como comunicação com IPs maliciosos ou uso anômalo de credenciais. Ele não avalia a conformidade da configuração dos recursos nem corrige nada sozinho.",
    B:"Uma SCP só age sobre chamadas futuras: não avalia o que já existe nem gera relatório de conformidade. O Trusted Advisor tem verificações fixas e não aplica correção automática.",
    C:"O Inspector procura vulnerabilidades e exposição de rede, mas não cobre criptografia de buckets e volumes. Além disso, a função Lambda é exatamente o código próprio que a empresa quer evitar."
  },
  src:[
    {t:"AWS Config: correção de recursos",u:"https://docs.aws.amazon.com/config/latest/developerguide/remediation.html"},
    {t:"AWS Config: PutOrganizationConformancePack",u:"https://docs.aws.amazon.com/config/latest/APIReference/API_PutOrganizationConformancePack.html"}
  ]
},
{
  id:"saa-d1-24", exam:"saa", dom:"d1", lvl:4, type:"single", sec:100,
  tags:["deteccao-auditoria"],
  case:"Uma organização com 30 contas opera em quatro regiões. Hoje, para ver os achados do GuardDuty, do Inspector e do Macie, a equipe abre o console do AWS Security Hub conta por conta e região por região. A segurança quer uma visão única dos achados de todas as contas e regiões, administrada a partir da conta de ferramentas de segurança, e as contas-membro não podem ver os achados umas das outras.",
  stem:"Qual configuração atende?",
  opts:[
    {k:"A",t:"Designar a conta de segurança como administradora delegada do AWS Security Hub, habilitar as contas como membros e configurar a agregação entre regiões."},
    {k:"B",t:"Criar uma trilha organizacional do CloudTrail para a conta de log e consultar os achados de segurança de todas as contas e regiões com o Amazon Athena."},
    {k:"C",t:"Criar na conta de segurança um agregador do AWS Config com todas as contas e regiões e acompanhar os achados pelo painel do agregador."},
    {k:"D",t:"Criar em cada conta e região uma regra do EventBridge que envia os achados para um tópico do SNS assinado pela equipe de segurança."}
  ],
  ans:["A"],
  why:{
    ok:"A conta de gerenciamento designa a conta de segurança como administradora do Security Hub, que vira também a administradora delegada do serviço no Organizations. Ela habilita as contas da organização como membros e passa a ver os achados delas. Com a agregação entre regiões, os achados das regiões vinculadas são replicados para a região principal, onde ficam todos num só lugar. Cada conta-membro continua vendo só os próprios dados. O Security Hub CSPM, nome atual do Security Hub original, tem o mesmo modelo de administrador e de agregação entre regiões.",
    B:"O CloudTrail registra chamadas de API, não os achados do GuardDuty, do Inspector e do Macie. Montar consultas no Athena também não dá a visão consolidada pronta que o cenário pede.",
    C:"O agregador do AWS Config consolida dados de configuração e de conformidade das regras do Config. Ele não é o ponto de consolidação dos achados do GuardDuty, do Inspector e do Macie.",
    D:"Isso gera um fluxo de e-mails, não uma visão única e pesquisável, e exige criar e manter regras em 30 contas e quatro regiões."
  },
  src:[
    {t:"Security Hub: agregação entre regiões",u:"https://docs.aws.amazon.com/securityhub/latest/userguide/security-hub-region-aggregation.html"},
    {t:"Security Hub: conceitos",u:"https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-v2-concepts.html"}
  ]
},
{
  id:"saa-d1-25", exam:"saa", dom:"d1", lvl:4, type:"single", sec:90,
  tags:["deteccao-auditoria"],
  case:"Os serviços de segurança da conta estão habilitados há meses. O GuardDuty gerou um achado: credenciais de uma função do IAM foram usadas a partir de um IP incomum. O analista precisa entender em minutos o que mais essa função fez nas últimas semanas, com quais IPs as instâncias envolvidas conversaram e se o comportamento foge do padrão habitual, sem montar consultas nem pipelines de log.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"O histórico de eventos do CloudTrail no console, filtrando os eventos pelo nome da função."},
    {k:"B",t:"O Amazon Macie, revisando os achados de dados sensíveis nos buckets que a função acessou."},
    {k:"C",t:"O Amazon Detective, analisando o grafo de comportamento da função e das instâncias do achado."},
    {k:"D",t:"O Amazon Athena, com consultas SQL que cruzam os VPC Flow Logs e o CloudTrail exportados ao S3."}
  ],
  ans:["C"],
  why:{
    ok:"O Detective coleta automaticamente o CloudTrail, os VPC Flow Logs e os achados do GuardDuty e organiza tudo num grafo de comportamento, com até um ano de histórico. A partir do achado, o analista vê as chamadas feitas pela função, o tráfego das instâncias envolvidas e a comparação com o comportamento normal, sem escrever consultas.",
    A:"O histórico de eventos mostra chamadas de API recentes, mas não tem dados de tráfego de rede nem compara a atividade com uma linha de base de comportamento.",
    B:"O Macie descobre e classifica dados sensíveis no S3. Ele não reconstrói a atividade de uma função nem o tráfego de instâncias.",
    D:"Funciona como investigação, mas exige exportar os logs, criar tabelas e escrever consultas, justamente o que o analista não pode fazer no tempo disponível."
  },
  src:[
    {t:"Detective: dados de origem do grafo",u:"https://docs.aws.amazon.com/detective/latest/userguide/detective-source-data-about.html"}
  ]
},
{
  id:"saa-d1-26", exam:"saa", dom:"d1", lvl:5, type:"single", sec:120,
  tags:["criptografia-segredos"],
  case:"Uma aplicação nova, ainda em desenvolvimento, vai rodar em us-east-1 e criptografar campos sensíveis no lado do cliente, com o AWS Encryption SDK e uma chave do KMS, antes de gravá-los numa tabela global do DynamoDB replicada para sa-east-1. No plano de recuperação de desastres, a aplicação em sa-east-1 deve descriptografar os dados replicados chamando o KMS da própria região, mesmo com us-east-1 fora do ar, e os dados não podem ser recriptografados durante a replicação.",
  stem:"Qual configuração de chaves atende?",
  opts:[
    {k:"A",t:"Criar uma chave de região única em us-east-1 e, depois, ativar nela a opção multirregião para replicá-la para sa-east-1."},
    {k:"B",t:"Criar uma chave primária multirregião em us-east-1 e uma réplica dela em sa-east-1, criptografando com a chave primária."},
    {k:"C",t:"Criar uma chave de região única em cada região com o mesmo alias e configurar o Encryption SDK para usar esse alias."},
    {k:"D",t:"Manter uma única chave em us-east-1 e dar à função da aplicação em sa-east-1 a permissão kms:Decrypt sobre ela."}
  ],
  ans:["B"],
  why:{
    ok:"Chaves multirregião relacionadas têm o mesmo ID e o mesmo material de chave em regiões diferentes. Um texto cifrado com a primária em us-east-1 pode ser descriptografado pela réplica em sa-east-1 sem recriptografar e sem chamar o KMS de outra região, então a recuperação funciona mesmo com us-east-1 indisponível. Política de chave, aliases e concessões de cada uma são independentes e precisam ser configurados em cada região.",
    A:"A propriedade multirregião é definida na criação e não pode ser mudada depois. Uma chave de região única nunca vira multirregião.",
    C:"Mesmo com o mesmo alias, são chaves diferentes, com materiais diferentes. A chave de sa-east-1 não descriptografa o que foi cifrado com a de us-east-1.",
    D:"Funciona enquanto us-east-1 estiver no ar, mas cada leitura em sa-east-1 depende do KMS da outra região. Com us-east-1 fora, a descriptografia para."
  },
  src:[
    {t:"KMS: chaves multirregião",u:"https://docs.aws.amazon.com/kms/latest/developerguide/multi-region-keys-overview.html"}
  ]
},
{
  id:"saa-d1-27", exam:"saa", dom:"d1", lvl:4, type:"single", sec:100,
  tags:["criptografia-segredos","vpc-seguranca"],
  case:"Uma aplicação web atrás de um Application Load Balancer usa roteamento por caminho e o AWS WAF. Uma nova norma exige tráfego criptografado em todo o trajeto, inclusive entre o balanceador e as instâncias, e que o certificado público do domínio seja renovado sem trabalho manual.",
  stem:"Qual configuração atende a todos os requisitos?",
  opts:[
    {k:"A",t:"Trocar por um Network Load Balancer com ouvinte TCP na porta 443, repassando a conexão criptografada direto para as instâncias."},
    {k:"B",t:"Criar um ouvinte HTTPS no ALB com certificado do ACM e manter o grupo de destino das instâncias em HTTP na porta 80."},
    {k:"C",t:"Criar um ouvinte HTTPS no ALB com certificado do ACM e ativar a autenticação TLS mútua (mTLS) nesse mesmo ouvinte."},
    {k:"D",t:"Criar um ouvinte HTTPS no ALB com certificado do ACM e um grupo de destino HTTPS, com certificado nas instâncias."}
  ],
  ans:["D"],
  why:{
    ok:"O ouvinte HTTPS termina o TLS do cliente com um certificado do ACM, que o ACM renova automaticamente, e o ALB continua inspecionando a requisição para rotear por caminho e aplicar o WAF. O grupo de destino HTTPS faz o ALB abrir uma nova conexão TLS até cada instância. O ALB não valida o certificado instalado nos destinos, então as instâncias podem usar até um certificado autoassinado; como o trecho fica dentro da VPC, o tráfego é autenticado no nível de pacote.",
    A:"O tráfego fica criptografado até as instâncias, mas o NLB em TCP não enxerga o HTTP: perde-se o roteamento por caminho, e o AWS WAF não se associa a um NLB.",
    B:"Criptografa só até o balanceador. O trecho entre o ALB e as instâncias segue em texto claro, o que viola a norma.",
    C:"O mTLS faz o ALB autenticar o certificado do cliente que se conecta a ele. Não muda nada no trecho entre o ALB e as instâncias, que continua do jeito que o grupo de destino estiver configurado."
  },
  src:[
    {t:"ALB: grupos de destino",u:"https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html"},
    {t:"ALB: certificados SSL",u:"https://docs.aws.amazon.com/elasticloadbalancing/latest/application/https-listener-certificates.html"}
  ]
},
{
  id:"saa-d1-28", exam:"saa", dom:"d1", lvl:4, type:"single", sec:100,
  tags:["iam-permissoes"],
  case:"Uma API REST no API Gateway será usada por aplicativos de parceiros. Eles recebem tokens opacos (não são JWT) de um sistema de identidade legado, que só valida um token por meio de um endpoint de introspecção. A decisão de acesso também depende de um cabeçalho com o código do parceiro, e o resultado da validação deve ser reaproveitado por alguns minutos para não sobrecarregar o sistema legado.",
  stem:"Qual mecanismo de autorização usar?",
  opts:[
    {k:"A",t:"Um autorizador Lambda do tipo REQUEST que chama a introspecção, lê o cabeçalho e devolve uma política em cache."},
    {k:"B",t:"Um autorizador do Amazon Cognito ligado a um novo grupo de usuários criado para os parceiros e para os aplicativos deles."},
    {k:"C",t:"A autorização do IAM em cada método, com os parceiros assinando todas as requisições com o Signature Version 4."},
    {k:"D",t:"Uma política de recursos da API que permite apenas os endereços IP informados por cada parceiro."}
  ],
  ans:["A"],
  why:{
    ok:"O autorizador Lambda roda código próprio antes da integração. No tipo REQUEST, ele recebe vários cabeçalhos (o token e o código do parceiro), chama o endpoint de introspecção do sistema legado e devolve uma política do IAM que permite ou nega a chamada. Com o cache ligado, o API Gateway guarda a política pelo tempo configurado, usando as fontes de identidade como chave, o que poupa o sistema legado de uma chamada por requisição. O tipo TOKEN não serviria tão bem, porque recebe só uma fonte de identidade.",
    B:"O autorizador do Cognito só valida tokens emitidos por um grupo de usuários do Cognito. Os tokens dos parceiros vêm de outro sistema, então seria preciso migrar as identidades.",
    C:"A autorização do IAM exige credenciais da AWS para assinar a requisição. Os parceiros têm tokens do sistema legado, não identidades do IAM.",
    D:"Filtrar por IP não valida o token nem considera o cabeçalho do parceiro. Qualquer cliente que saia daqueles IPs passaria."
  },
  src:[
    {t:"API Gateway: autorizadores Lambda",u:"https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html"}
  ]
},
{
  id:"saa-d1-29", exam:"saa", dom:"d1", lvl:4, type:"single", sec:110,
  tags:["vpc-seguranca"],
  case:"Uma equipe de plataforma oferece um serviço interno HTTPS, atrás de um Network Load Balancer, a 50 VPCs de outras contas da empresa. Várias dessas VPCs usam o mesmo bloco 10.0.0.0/16 da VPC do serviço. O tráfego não pode passar pela internet, os consumidores só podem alcançar esse serviço (nenhum outro recurso da VPC do provedor) e o provedor não deve conseguir abrir conexões para as VPCs dos consumidores.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Emparelhamento de VPC entre a VPC do serviço e cada VPC consumidora, com rotas apenas para as sub-redes do NLB."},
    {k:"B",t:"Um AWS Transit Gateway com todas as VPCs anexadas e uma tabela de rotas separada para cada VPC consumidora."},
    {k:"C",t:"Um serviço de endpoint do AWS PrivateLink sobre o NLB, com cada consumidor criando um endpoint de interface."},
    {k:"D",t:"Publicar o NLB na internet e limitar o grupo de segurança aos IPs elásticos dos gateways NAT dos consumidores."}
  ],
  ans:["C"],
  why:{
    ok:"Com o PrivateLink, o consumidor cria um endpoint de interface, que é uma interface de rede com IP privado da própria VPC dele. Por isso os blocos CIDR podem se sobrepor. O acesso é unidirecional: só o consumidor inicia conexões, e ele enxerga apenas o serviço publicado atrás do NLB, não a VPC do provedor. O provedor ainda controla quais contas podem se conectar.",
    A:"O emparelhamento não funciona entre VPCs com CIDRs sobrepostos. Além disso, cria roteamento nos dois sentidos, e seriam 50 conexões para administrar.",
    B:"O Transit Gateway roteia entre VPCs e também sofre com CIDRs sobrepostos. A conectividade é de rede, não restrita a um serviço, e pode ser iniciada pelos dois lados.",
    D:"Coloca o tráfego na internet, o que o requisito proíbe, e depende de manter listas de IPs atualizadas para 50 consumidores."
  },
  src:[
    {t:"Whitepaper: AWS PrivateLink em redes com várias VPCs",u:"https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/aws-privatelink.html"},
    {t:"PrivateLink: compartilhar seus serviços",u:"https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html"}
  ]
},
{
  id:"saa-d1-30", exam:"saa", dom:"d1", lvl:5, type:"single", sec:120,
  tags:["iam-permissoes"],
  case:"Os desenvolvedores precisam criar funções do IAM para as próprias funções Lambda sem abrir chamado para a segurança. A segurança exige que nenhuma função criada por eles passe de um conjunto aprovado de permissões (logs, S3 e DynamoDB do projeto) e que eles não consigam usar uma função criada por eles mesmos para ganhar privilégios administrativos.",
  stem:"Qual abordagem atende?",
  opts:[
    {k:"A",t:"Dar aos desenvolvedores a política gerenciada IAMFullAccess e revisar toda semana, com o IAM Access Analyzer, as funções que eles criaram."},
    {k:"B",t:"Permitir criar funções só com a condição iam:PermissionsBoundary exigindo a política aprovada e negar remover ou alterar o limite."},
    {k:"C",t:"Aplicar na conta uma SCP que negue iam:CreateRole a todas as identidades, exceto à função usada pela equipe de administração."},
    {k:"D",t:"Criar no IAM Identity Center um conjunto de permissões com as permissões aprovadas e pedir que os desenvolvedores o usem nas Lambdas."}
  ],
  ans:["B"],
  why:{
    ok:"O limite de permissões define o máximo que uma função pode fazer: a permissão efetiva é a interseção entre a política da função e o limite. Com a condição iam:PermissionsBoundary, a criação ou a edição da função só é permitida se o limite aprovado estiver anexado. Negar a remoção do limite e a edição da política de limite fecha o caminho de escalada, mesmo que o desenvolvedor anexe uma política ampla à função.",
    A:"Revisar depois é controle de detecção: durante a semana, um desenvolvedor poderia criar uma função administrativa e usá-la. O requisito pede prevenção.",
    C:"Impede a escalada, mas também impede os desenvolvedores de criar funções, que é exatamente o que eles precisam fazer sem depender da segurança.",
    D:"Conjuntos de permissões dão acesso de pessoas às contas pelo IAM Identity Center. Não servem como função de execução de uma Lambda nem limitam o que os desenvolvedores criam no IAM."
  },
  src:[
    {t:"IAM: limites de permissões",u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html"}
  ]
},
{
  id:"saa-d1-31", exam:"saa", dom:"d1", lvl:4, type:"multi", sec:130,
  tags:["iam-permissoes"],
  case:"Uma empresa tem 25 contas na organização e todos os funcionários já existem no Microsoft Entra ID. Ela quer login único nas contas com a identidade corporativa, sem usuários do IAM; acesso padronizado por perfil (desenvolvedor, leitura, administrador) aplicado a várias contas de uma vez, com o menor esforço de administração; e que cada desenvolvedor só altere recursos com a tag projeto igual ao projeto dele, sem escrever uma política por projeto.",
  stem:"Quais medidas, juntas, atendem? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Configurar o Entra ID como fonte de identidade do IAM Identity Center, com provisionamento SCIM, e atribuir conjuntos de permissões a grupos nas contas."},
    {k:"B",t:"Criar usuários do IAM na conta de gerenciamento para cada funcionário e permitir que eles assumam funções do IAM nas demais contas."},
    {k:"C",t:"Criar um provedor de identidade SAML e uma função do IAM por perfil em cada uma das 25 contas, mantendo a relação de confiança conta a conta."},
    {k:"D",t:"Ativar atributos para controle de acesso com o atributo projeto e, no conjunto de permissões, comparar aws:ResourceTag/projeto com aws:PrincipalTag/projeto."},
    {k:"E",t:"Criar uma política gerenciada para cada projeto e associá-la ao grupo correspondente do Entra ID que representa a equipe daquele projeto."}
  ],
  ans:["A","D"],
  why:{
    ok:"Com o Entra ID como fonte de identidade, o login é feito com a conta corporativa, e o SCIM sincroniza usuários e grupos. Um conjunto de permissões é definido uma vez e atribuído a grupos em várias contas; o IAM Identity Center cria as funções em cada conta. Os atributos para controle de acesso chegam à sessão como tags, e uma única condição que compara a tag do recurso com aws:PrincipalTag/projeto serve para todos os projetos (ABAC).",
    B:"Exige usuários do IAM com credenciais de longo prazo, o que o requisito proíbe, e não aproveita as identidades do Entra ID.",
    C:"Funciona, mas obriga a criar e manter provedor e funções em 25 contas, uma a uma. Não é o menor esforço quando o IAM Identity Center faz isso de forma centralizada.",
    E:"Grupos do Entra ID não recebem políticas do IAM diretamente, e uma política por projeto é justamente o que a empresa quer evitar."
  },
  src:[
    {t:"IAM Identity Center: atributos para controle de acesso",u:"https://docs.aws.amazon.com/singlesignon/latest/userguide/attributesforaccesscontrol.html"},
    {t:"IAM Identity Center: políticas para ABAC",u:"https://docs.aws.amazon.com/singlesignon/latest/userguide/configure-abac-policies.html"}
  ]
},
{
  id:"saa-d1-32", exam:"saa", dom:"d1", lvl:5, type:"multi", sec:120,
  tags:["criptografia-segredos","iam-permissoes"],
  case:"Na conta de dados, um segredo do Secrets Manager guarda a credencial de um banco, com rotação automática a cada 30 dias, e está criptografado com a chave gerenciada pela AWS aws/secretsmanager. Uma função do IAM numa conta de aplicação precisa ler sempre o valor atual. A política de identidade dessa função já permite secretsmanager:GetSecretValue e kms:Decrypt nos ARNs certos, mas a leitura falha com acesso negado.",
  stem:"Quais mudanças na conta de dados resolvem o problema? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Replicar o segredo para a conta de aplicação usando o recurso de replicação de segredos do próprio Secrets Manager."},
    {k:"B",t:"Recriptografar o segredo com uma chave gerenciada pelo cliente cuja política permita kms:Decrypt à função da outra conta."},
    {k:"C",t:"Criar uma função Lambda que copia o valor para um parâmetro SecureString na conta de aplicação a cada rotação do segredo."},
    {k:"D",t:"Editar a política de chave da aws/secretsmanager para incluir a função da conta de aplicação como principal autorizado."},
    {k:"E",t:"Anexar ao segredo uma política baseada em recurso que permita secretsmanager:GetSecretValue à função da outra conta."}
  ],
  ans:["B","E"],
  why:{
    ok:"O acesso entre contas precisa ser permitido nos dois lados. Do lado do dono, a política baseada em recurso do segredo autoriza a função da outra conta a chamar GetSecretValue. A chave gerenciada pela AWS aws/secretsmanager não serve para acesso entre contas, então o segredo precisa ser criptografado com uma chave gerenciada pelo cliente cuja política de chave libere kms:Decrypt para essa função. A rotação continua funcionando, e a aplicação sempre lê a versão atual direto da fonte.",
    A:"A replicação do Secrets Manager cria réplicas do segredo em outras regiões da mesma conta. Ela não entrega o segredo a outra conta.",
    C:"Duplica a credencial em outro lugar, cria código para manter e abre uma janela em que a cópia fica desatualizada logo depois de cada rotação.",
    D:"A política de uma chave gerenciada pela AWS não pode ser editada pelo cliente. Por isso a documentação manda usar uma chave gerenciada pelo cliente para acesso entre contas."
  },
  src:[
    {t:"Secrets Manager: acesso a partir de outra conta",u:"https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_examples_cross.html"}
  ]
},
{
  id:"saa-d1-33", exam:"saa", dom:"d1", lvl:4, type:"yn", sec:100,
  tags:["deteccao-auditoria"],
  case:"Uma empresa guarda registros de auditoria num bucket com S3 Object Lock e precisa escolher entre os modos de retenção e decidir quando usar retenção legal.",
  stem:"Responda Sim ou Não para cada afirmação sobre o S3 Object Lock.",
  rows:[
    {t:"No modo conformidade, nem o usuário raiz da conta consegue apagar uma versão protegida antes do fim da retenção.",a:true,e:"Correto. No modo conformidade ninguém apaga nem sobrescreve a versão protegida, inclusive o raiz. A única saída antes do prazo é encerrar a conta."},
    {t:"No modo governança, quem tem a permissão s3:BypassGovernanceRetention pode apagar uma versão protegida se enviar o cabeçalho de desvio.",a:true,e:"Correto. O modo governança protege contra a maioria dos usuários, mas permite o desvio com essa permissão e o cabeçalho x-amz-bypass-governance-retention:true."},
    {t:"No modo conformidade, o prazo de retenção de um objeto pode ser encurtado se a requisição vier da conta de gerenciamento da organização.",a:false,e:"Errado. No modo conformidade o prazo não pode ser encurtado nem o modo trocado, por nenhuma conta. Só é possível estender a retenção."},
    {t:"Uma retenção legal expira automaticamente junto com o prazo de retenção definido para o objeto.",a:false,e:"Errado. A retenção legal não tem data de validade e é independente do prazo de retenção: continua valendo até alguém com s3:PutObjectLegalHold removê-la."}
  ],
  src:[
    {t:"S3: Object Lock",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html"}
  ]
},
{
  id:"saa-d1-34", exam:"saa", dom:"d1", lvl:4, type:"yn", sec:100,
  tags:["vpc-seguranca","deteccao-auditoria"],
  case:"Uma equipe precisa bloquear a saída da VPC para domínios maliciosos, inspecionar o tráfego em busca de intrusões e investigar conexões que estão sendo recusadas.",
  stem:"Responda Sim ou Não para cada afirmação sobre controles e registros de rede na VPC.",
  rows:[
    {t:"Um grupo de segurança consegue bloquear a saída para um domínio específico, como malicioso.exemplo.com, mantendo liberado o resto da internet.",a:false,e:"Errado. Grupos de segurança só têm regras de permissão, baseadas em IP, bloco CIDR, lista de prefixos ou outro grupo. Não há regra de negação nem filtro por nome de domínio."},
    {t:"O AWS Network Firewall pode filtrar a saída da VPC por nome de domínio e aplicar regras compatíveis com o Suricata para prevenção de intrusão.",a:true,e:"Correto. O Network Firewall é um firewall gerenciado com inspeção com estado, listas de domínios e regras de IPS compatíveis com o Suricata."},
    {t:"Num Network Firewall implantado na VPC, é preciso alterar as tabelas de rotas para enviar o tráfego aos endpoints do firewall, em sub-redes dedicadas.",a:true,e:"Correto. O firewall cria um endpoint em cada zona escolhida, numa sub-rede reservada para ele, e só inspeciona o que as tabelas de rotas mandarem passar por esse endpoint."},
    {t:"Os VPC Flow Logs registram o conteúdo dos pacotes rejeitados, o que permite ver qual comando o atacante tentou executar.",a:false,e:"Errado. Os Flow Logs registram metadados da conexão, como origem, destino, portas, bytes e a ação ACCEPT ou REJECT. Não guardam o conteúdo dos pacotes."}
  ],
  src:[
    {t:"O que é o AWS Network Firewall",u:"https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html"},
    {t:"VPC: limitações dos Flow Logs",u:"https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-limitations.html"}
  ]
},
{
  id:"saa-d1-35", exam:"saa", dom:"d1", lvl:4, type:"order", sec:90,
  tags:["vpc-seguranca"],
  stem:"Uma empresa quer que todos os Application Load Balancers da organização, inclusive os criados no futuro, recebam automaticamente as mesmas regras do AWS WAF. Ordene as etapas de implantação com o AWS Firewall Manager, da PRIMEIRA à ÚLTIMA.",
  items:[
    {t:"Habilitar todos os recursos (all features) no AWS Organizations."},
    {t:"Na conta de gerenciamento, designar a conta de segurança como administradora padrão do Firewall Manager."},
    {t:"Habilitar o AWS Config nas contas e regiões onde estão os recursos a proteger."},
    {t:"Na conta administradora, criar a política do AWS WAF com escopo na organização e correção automática ativada."}
  ],
  e:"O Firewall Manager exige uma organização com todos os recursos habilitados, não apenas faturamento consolidado. Só a conta de gerenciamento pode criar a conta administradora padrão, que vira administradora delegada do serviço. Em seguida, o AWS Config precisa estar ativo nas contas, porque o Firewall Manager depende dele para enxergar os recursos. Só então a administradora cria a política. Com a correção automática, o Firewall Manager associa a ACL da web aos balanceadores existentes e aplica a política às contas e aos recursos novos que entram no escopo.",
  src:[
    {t:"Firewall Manager: pré-requisitos",u:"https://docs.aws.amazon.com/waf/latest/developerguide/fms-prereq.html"},
    {t:"Firewall Manager: escopo da política",u:"https://docs.aws.amazon.com/waf/latest/developerguide/policy-scope.html"}
  ]
}
];
/* Lote de questões: SAA-C03, domínio d2 (Arquiteturas resilientes), ids saa-d2-19 a saa-d2-31 */
const QUESTIONS_SAA_D2 = [
{
  id:"saa-d2-19", exam:"saa", dom:"d2", lvl:4, type:"order", sec:80,
  tags:["recuperacao-desastre"],
  stem:"Ordene as estratégias de recuperação de desastres do MENOR para o MAIOR custo mensal fora do desastre (o que também vai do MAIOR para o MENOR tempo de retomada).",
  items:[
    {t:"Backup e restauração: só cópias dos dados e da infraestrutura como código na região de recuperação"},
    {t:"Luz piloto: dados replicados continuamente e núcleo mínimo pronto, com servidores de aplicação desligados"},
    {t:"Warm standby: cópia completa da pilha rodando em escala reduzida, pronta para receber tráfego"},
    {t:"Multissite ativo-ativo: duas regiões em escala de produção atendendo usuários ao mesmo tempo"}
  ],
  e:"Quanto mais recursos ficam ligados na região de recuperação, maior o custo e menor o RTO. Backup e restauração só paga armazenamento e precisa recriar tudo (horas). A luz piloto mantém os dados vivos, mas precisa ligar e dimensionar a aplicação. O warm standby já roda tudo em escala menor e só precisa crescer. O ativo-ativo paga duas produções inteiras e tem retomada praticamente imediata.",
  src:[{t:"AWS: opções de recuperação de desastres na nuvem",u:"https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html"}]
},
{
  id:"saa-d2-20", exam:"saa", dom:"d2", lvl:5, type:"single", sec:120,
  tags:["recuperacao-desastre","dados-resilientes"],
  case:"Depois de um ataque de ransomware num concorrente, a diretoria exige três coisas para os backups de RDS e EBS da conta de produção: cópia em outra região, cópia guardada em outra conta da organização e garantia de que ninguém, nem o usuário raiz da conta de backup, consiga apagar uma cópia antes de 35 dias.",
  stem:"Qual solução atende aos três requisitos?",
  opts:[
    {k:"A",t:"Plano do AWS Backup copiando para um cofre de outra conta e região, com Vault Lock no modo governança."},
    {k:"B",t:"Plano do AWS Backup copiando para um cofre de outra conta e região, com Vault Lock no modo conformidade."},
    {k:"C",t:"Data Lifecycle Manager copiando instantâneos para outra região e política do IAM negando a exclusão."},
    {k:"D",t:"Cópia entre contas para o cofre padrão da conta de destino, com política de acesso que nega exclusão."}
  ],
  ans:["B"],
  why:{
    ok:"A regra de cópia do plano do AWS Backup leva o ponto de recuperação a um cofre de outra conta da mesma organização e de outra região numa única configuração. O Vault Lock em modo conformidade, passado o período de carência (mínimo de 3 dias), torna o cofre imutável: nenhum usuário, nem o raiz, nem a AWS, consegue apagar backups antes do fim da retenção mínima.",
    A:"O modo governança protege contra exclusão acidental, mas usuários com permissão suficiente do IAM podem alterar ou remover a trava. Falha no requisito de que ninguém possa apagar.",
    C:"Resolve a cópia entre regiões, mas fica na mesma conta, e uma política do IAM pode ser editada por um administrador ou ignorada pelo raiz. Não há imutabilidade.",
    D:"O cofre padrão não pode ser destino de cópia entre contas, porque a chave dele não pode ser compartilhada. Além disso, uma política de acesso pode ser trocada por quem administra o cofre, e a opção não cobre outra região."
  },
  src:[{t:"AWS Backup Vault Lock",u:"https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html"},{t:"Cópias de backup entre contas",u:"https://docs.aws.amazon.com/aws-backup/latest/devguide/create-cross-account-backup.html"}]
},
{
  id:"saa-d2-21", exam:"saa", dom:"d2", lvl:4, type:"single", sec:100,
  tags:["recuperacao-desastre"],
  case:"Uma empresa tem 40 servidores Linux e Windows num datacenter próprio. Ela quer usar a AWS como local de recuperação com perda de dados de segundos e retomada em minutos, sem reescrever aplicações e sem pagar servidores de produção ligados na AWS enquanto não houver desastre.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"AWS Backup com gateway local, restaurando as máquinas em EC2 quando houver desastre."},
    {k:"B",t:"AWS DataSync enviando os discos para o S3 a cada hora e gerando AMIs na recuperação."},
    {k:"C",t:"Réplicas em EC2 de cada servidor, já ligadas em tamanho reduzido, sincronizadas por script."},
    {k:"D",t:"AWS Elastic Disaster Recovery, com replicação contínua para uma área de preparo na AWS."}
  ],
  ans:["D"],
  why:{
    ok:"O AWS Elastic Disaster Recovery instala um agente que replica continuamente os blocos gravados nos discos para uma sub-rede de preparo (staging) com servidores de replicação leves e volumes EBS. Isso dá RPO de segundos. Na recuperação, ele converte os volumes e sobe instâncias EC2 completas em minutos, e só então você paga a capacidade de produção.",
    A:"Backups são pontuais, então a perda de dados é a do intervalo entre um backup e outro (horas), e restaurar dezenas de máquinas leva bem mais que minutos.",
    B:"Cópia por hora já viola a perda de segundos, e montar AMIs a partir de arquivos é um processo manual e lento.",
    C:"É um warm standby caseiro: mantém instâncias ligadas o tempo todo, o que fere o requisito de custo, e scripts de sincronização não garantem RPO de segundos."
  },
  src:[{t:"Conceitos do Elastic Disaster Recovery",u:"https://docs.aws.amazon.com/drs/latest/userguide/CloudEndure-Concepts.html"}]
},
{
  id:"saa-d2-22", exam:"saa", dom:"d2", lvl:5, type:"yn", sec:110,
  tags:["alta-disponibilidade","recuperacao-desastre"],
  stem:"Responda Sim ou Não para cada afirmação sobre verificações de saúde do Route 53 e o Application Recovery Controller (ARC).",
  rows:[
    {t:"Uma verificação de saúde calculada pode ser considerada saudável quando um número mínimo de verificações filhas, por exemplo 2 de 3, estiver saudável.",a:true,e:"A verificação pai soma as filhas saudáveis e compara com o mínimo definido. Assim, uma região só é tirada do DNS quando vários componentes falham, não por um só."},
    {t:"Uma verificação de saúde baseada em alarme do CloudWatch pode monitorar um alarme criado em outra conta da organização.",a:false,e:"O Route 53 não aceita alarmes do CloudWatch de outra conta. A verificação precisa usar um alarme da mesma conta."},
    {t:"No ARC, controles de roteamento são chaves liga e desliga cujo estado fica num cluster com endpoints em cinco regiões.",a:true,e:"Cada cluster é um plano de dados com endpoints em cinco regiões. Mudar o estado do controle altera a verificação de saúde ligada aos registros de failover do DNS."},
    {t:"Para testar o failover, basta forçar o alarme para ALARM com SetAlarmState; a verificação de saúde ligada a ele fica não saudável.",a:false,e:"O Route 53 observa o fluxo de dados da métrica, não o estado do alarme. Por isso SetAlarmState não muda o status da verificação; para virar o tráfego de forma manual e controlada, o caminho é o controle de roteamento do ARC."}
  ],
  src:[{t:"Como o Route 53 avalia verificações de saúde",u:"https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-determining-health-of-endpoints.html"},{t:"Controle de roteamento no ARC",u:"https://docs.aws.amazon.com/r53recovery/latest/dg/routing-control.html"}]
},
{
  id:"saa-d2-23", exam:"saa", dom:"d2", lvl:4, type:"single", sec:100,
  tags:["alta-disponibilidade"],
  case:"Um Network Load Balancer atende um protocolo TCP próprio em duas zonas. Por falta de capacidade, o grupo de destino ficou com 2 instâncias na zona A e 6 na zona B. As instâncias da zona A estão em 90% de CPU e as da zona B em 30%. A equipe não pode mover instâncias agora.",
  stem:"Qual ajuste distribui a carga de forma parecida entre todas as instâncias?",
  opts:[
    {k:"A",t:"Ativar o balanceamento de carga entre zonas, que vem desativado por padrão no NLB."},
    {k:"B",t:"Trocar o algoritmo do grupo de destino para menor número de solicitações pendentes."},
    {k:"C",t:"Iniciar uma mudança zonal (zonal shift) para tirar a zona A do balanceador."},
    {k:"D",t:"Trocar o NLB por um ALB, que já faz balanceamento entre zonas o tempo todo."}
  ],
  ans:["A"],
  why:{
    ok:"Sem balanceamento entre zonas, cada nó do NLB envia tráfego só para os destinos da própria zona, e o DNS divide os clientes meio a meio entre os nós. As 2 instâncias da zona A recebem a mesma metade que as 6 da zona B. Com o recurso ligado (no balanceador ou no grupo de destino), cada nó distribui entre todos os destinos saudáveis das duas zonas.",
    B:"Esse algoritmo existe no Application Load Balancer, não no grupo de destino do NLB. Não é uma opção disponível neste balanceador.",
    C:"A mudança zonal tira a zona A inteira do tráfego: todo o volume cai nas 6 instâncias da zona B e as 2 da zona A ficam ociosas. Resolve a CPU da zona A criando outro desequilíbrio e perdendo capacidade.",
    D:"O ALB trabalha na camada 7 com HTTP e HTTPS e não atende um protocolo TCP próprio. Quebra o requisito de protocolo."
  },
  src:[{t:"Atributos do Network Load Balancer",u:"https://docs.aws.amazon.com/elasticloadbalancing/latest/network/edit-load-balancer-attributes.html"},{t:"Balanceamento entre zonas no ALB",u:"https://docs.aws.amazon.com/elasticloadbalancing/latest/application/disable-cross-zone.html"}]
},
{
  id:"saa-d2-24", exam:"saa", dom:"d2", lvl:5, type:"multi", sec:130,
  tags:["alta-disponibilidade"],
  case:"Um grupo do Auto Scaling atrás de um ALB usa verificação de saúde do ELB. Cada instância nova leva 6 minutos para baixar um modelo e aquecer o cache, mas a rota de saúde responde OK assim que o servidor web sobe, e os primeiros usuários recebem erro. Na redução, as instâncias são encerradas antes de enviar ao S3 os logs locais, o que leva até 4 minutos.",
  stem:"Quais configurações resolvem os dois problemas? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Gancho de ciclo de vida de execução que mantém a instância em Pending:Wait até o script de aquecimento concluir a ação."},
    {k:"B",t:"Aumentar para 10 minutos o período de carência da verificação de saúde do grupo do Auto Scaling."},
    {k:"C",t:"Gancho de ciclo de vida de encerramento que mantém a instância em Terminating:Wait enquanto os logs são enviados."},
    {k:"D",t:"Aumentar para 15 minutos o atraso de cancelamento de registro no grupo de destino do ALB."},
    {k:"E",t:"Ativar a proteção contra redução de escala em todas as instâncias do grupo."}
  ],
  ans:["A","C"],
  why:{
    ok:"No lançamento, a instância só é registrada no balanceador depois de sair do estado de espera do gancho, então ela não recebe tráfego antes de o script chamar complete-lifecycle-action. No encerramento, a instância primeiro sai do balanceador e depois fica em Terminating:Wait, com tempo para enviar os logs (o padrão de espera é uma hora). Os dois ganchos resolvem os dois sintomas sem gambiarra.",
    B:"O período de carência só adia a substituição de uma instância reprovada. A instância já está registrada e recebe tráfego durante esse tempo, então os erros continuam.",
    D:"O atraso de cancelamento de registro espera as conexões em andamento terminarem. Ele não dispara nenhuma ação na instância e não garante que o envio dos logs rode.",
    E:"A proteção impede que as instâncias sejam encerradas na redução. O grupo deixa de diminuir, o que aumenta o custo e não resolve o envio de logs nem o aquecimento."
  },
  src:[{t:"Como funcionam os ganchos de ciclo de vida",u:"https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks-overview.html"}]
},
{
  id:"saa-d2-25", exam:"saa", dom:"d2", lvl:4, type:"single", sec:110,
  tags:["desacoplamento"],
  case:"Trabalhadores em EC2 chamam ReceiveMessage em laço numa fila padrão do SQS e a conta mostra milhões de respostas vazias. O processamento de cada mensagem varia de 30 segundos a 25 minutos, sem como prever. Se um trabalhador morrer, a mensagem precisa voltar à fila em no máximo 5 minutos.",
  stem:"Qual combinação reduz as respostas vazias e evita entrega duplicada durante o processamento longo?",
  opts:[
    {k:"A",t:"Sondagem longa de 20 segundos e tempo limite de visibilidade de 12 horas na fila."},
    {k:"B",t:"Fila de atraso de 20 segundos e tempo limite de visibilidade de 30 minutos na fila."},
    {k:"C",t:"Sondagem longa de 20 segundos e visibilidade renovada com ChangeMessageVisibility."},
    {k:"D",t:"Sondagem curta com 10 mensagens por chamada e migração para fila FIFO para evitar duplicatas."}
  ],
  ans:["C"],
  why:{
    ok:"A sondagem longa faz a chamada esperar até 20 segundos por mensagens, cortando as respostas vazias. Para tempo de processamento imprevisível, a prática recomendada é um batimento: visibilidade inicial curta (por exemplo 2 minutos) renovada com ChangeMessageVisibility enquanto o trabalhador estiver vivo. Se ele morrer, a renovação para e a mensagem volta em poucos minutos.",
    A:"Doze horas cobrem qualquer processamento, mas se o trabalhador morrer a mensagem fica invisível por horas. Viola o retorno em 5 minutos.",
    B:"A fila de atraso só adia a primeira entrega e não reduz chamadas vazias. A visibilidade fixa de 30 minutos também viola o retorno em 5 minutos.",
    D:"A sondagem curta continua devolvendo respostas vazias. A deduplicação da FIFO atua no envio; se a visibilidade expirar, a mensagem é entregue de novo do mesmo jeito."
  },
  src:[{t:"Processar mensagens no tempo certo no SQS",u:"https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/best-practices-processing-messages-timely-manner.html"},{t:"Sondagem curta e longa no SQS",u:"https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html"}]
},
{
  id:"saa-d2-26", exam:"saa", dom:"d2", lvl:4, type:"single", sec:110,
  tags:["desacoplamento","recuperacao-desastre"],
  case:"Um barramento personalizado do EventBridge recebe eventos de pedido e tem várias regras. Uma versão com defeito da Lambda fiscal rodou por 6 horas: as invocações terminaram sem erro, mas gravaram valores errados. A equipe quer, numa próxima vez, reprocessar só a janela afetada e só para a regra fiscal, sem pedir aos produtores que reenviem nada.",
  stem:"O que deve estar configurado para isso ser possível?",
  opts:[
    {k:"A",t:"Fila de mensagens mortas no destino da regra fiscal, com retenção de 14 dias na fila."},
    {k:"B",t:"Trilha do CloudTrail registrando as chamadas PutEvents do barramento num bucket."},
    {k:"C",t:"Fila do SQS entre a regra fiscal e a Lambda, com retenção de 14 dias."},
    {k:"D",t:"Arquivo de eventos no barramento, com reprodução da janela só para a regra fiscal."}
  ],
  ans:["D"],
  why:{
    ok:"Um arquivo guarda os eventos que passam pelo barramento (com filtro e retenção opcionais). A reprodução reenvia ao mesmo barramento os eventos de um intervalo de tempo e pode ser limitada a regras específicas, então só a Lambda fiscal reprocessa. Os eventos não voltam necessariamente na ordem original, e a AWS sugere esperar uns 10 minutos antes de reproduzir eventos recentes.",
    A:"A fila de mensagens mortas só recebe eventos cuja entrega falhou. Aqui as invocações tiveram sucesso, então nada foi para ela.",
    B:"O CloudTrail é registro de auditoria de chamadas de API. Ele não tem mecanismo para reinjetar eventos no barramento.",
    C:"A fila protege contra picos e falhas, mas a Lambda apaga cada mensagem ao processá-la com sucesso. Depois de consumidas, não há o que reprocessar."
  },
  src:[{t:"Arquivar e reproduzir eventos no EventBridge",u:"https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-archive.html"}]
},
{
  id:"saa-d2-27", exam:"saa", dom:"d2", lvl:5, type:"single", sec:120,
  tags:["dados-resilientes","recuperacao-desastre"],
  case:"Um aplicativo usa DynamoDB e atende usuários nos EUA e na Europa, gravando nas duas regiões. Requisitos: se uma região cair, a outra continua aceitando gravações sem restaurar nada; e, se um defeito corromper itens, deve ser possível recuperar o estado de qualquer segundo dos últimos dias.",
  stem:"Qual combinação atende?",
  opts:[
    {k:"A",t:"Tabela global nas duas regiões e recuperação para um ponto no tempo ativada."},
    {k:"B",t:"Tabela global nas duas regiões, sem outra proteção, pois a réplica já é a cópia."},
    {k:"C",t:"Recuperação para um ponto no tempo numa região e restauração na outra se houver falha."},
    {k:"D",t:"Backup diário do AWS Backup com cópia para a outra região e restauração sob demanda."}
  ],
  ans:["A"],
  why:{
    ok:"A tabela global é multiativa: cada réplica aceita leitura e gravação e replica para as demais, então a perda de uma região não exige restauração. A recuperação para um ponto no tempo cobre o outro risco: restaura a tabela, numa tabela nova, a qualquer segundo do período configurado (de 1 a 35 dias), e dali os itens bons são copiados de volta.",
    B:"A tabela global replica tudo, inclusive a gravação errada ou a exclusão. Ela protege contra falha de região, não contra corrupção lógica.",
    C:"Só uma região aceita gravações, e a restauração na outra leva tempo e cria outra tabela. Falha no requisito de continuar gravando sem restaurar nada.",
    D:"Backup diário dá granularidade de um dia, não de segundos, e a retomada depende de restaurar uma tabela inteira na outra região."
  },
  src:[{t:"RestoreTableToPointInTime (DynamoDB)",u:"https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_RestoreTableToPointInTime.html"},{t:"Tabelas globais do DynamoDB",u:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html"}]
},
{
  id:"saa-d2-28", exam:"saa", dom:"d2", lvl:4, type:"yn", sec:100,
  tags:["dados-resilientes","recuperacao-desastre"],
  stem:"Responda Sim ou Não para cada afirmação sobre a replicação do Amazon EFS.",
  rows:[
    {t:"Depois da sincronização inicial, a replicação do EFS mantém um RPO de 15 minutos para a maioria dos sistemas de arquivos.",a:true,e:"É o objetivo documentado. Sistemas com mais de 100 milhões de arquivos ou arquivos acima de 100 GB que mudam muito podem passar disso."},
    {t:"Com a replicação ativa, a aplicação na região de destino pode gravar na réplica para dividir a carga entre as regiões.",a:false,e:"Enquanto a replicação está ativa, a réplica é somente leitura. Ela não serve como segundo ponto de gravação."},
    {t:"Para fazer failover, exclui-se a configuração de replicação, e a réplica passa a aceitar gravações.",a:true,e:"Esse é o passo de failover. Para voltar, cria-se uma replicação no sentido contrário (mantendo o que mudou na réplica) ou recria-se a original (descartando essas mudanças)."},
    {t:"A replicação do EFS só funciona dentro da mesma conta; para outra conta é preciso usar o AWS Backup.",a:false,e:"O EFS replica também entre contas. Nesse caso é preciso informar uma função do IAM própria, porque a função vinculada ao serviço não é aceita."}
  ],
  src:[{t:"Replicação do EFS",u:"https://docs.aws.amazon.com/efs/latest/ug/efs-replication.html"},{t:"Usar a réplica do EFS",u:"https://docs.aws.amazon.com/efs/latest/ug/replication-fail-over.html"}]
},
{
  id:"saa-d2-29", exam:"saa", dom:"d2", lvl:4, type:"single", sec:100,
  tags:["dados-resilientes"],
  case:"Um cluster Aurora MySQL foi criado com janela de backtrack de 24 horas. Há 15 minutos, um script de migração apagou dados em várias tabelas. A equipe quer voltar o banco inteiro ao instante anterior ao erro em minutos, mantendo o mesmo cluster e o mesmo endpoint. Uma interrupção breve é aceitável.",
  stem:"Qual ação atende?",
  opts:[
    {k:"A",t:"Restaurar o cluster para um ponto no tempo anterior ao erro."},
    {k:"B",t:"Promover uma réplica do Aurora com failover manual do cluster."},
    {k:"C",t:"Fazer backtrack do cluster para o instante anterior ao script."},
    {k:"D",t:"Restaurar o último instantâneo automático num cluster novo."}
  ],
  ans:["C"],
  why:{
    ok:"O backtrack rebobina o próprio cluster no lugar, sem criar outro, e costuma levar minutos. O endpoint continua o mesmo. Ele exige ter sido ativado na criação (ou na restauração de instantâneo), vale para o cluster inteiro e causa uma breve interrupção, que o cenário aceita.",
    A:"A restauração para um ponto no tempo cria um cluster novo, com outro endpoint, e pode levar horas. Falha em manter o cluster e em voltar em minutos.",
    B:"As réplicas do Aurora compartilham o mesmo volume de armazenamento. A exclusão já está lá, então o failover só troca a instância de escrita.",
    D:"Cria um cluster novo e ainda perde tudo o que foi gravado entre o instantâneo e o erro."
  },
  src:[{t:"Backtrack de um cluster Aurora",u:"https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.Backtrack.html"}]
},
{
  id:"saa-d2-30", exam:"saa", dom:"d2", lvl:5, type:"multi", sec:130,
  tags:["desacoplamento"],
  case:"Um tópico padrão do SNS distribui cada pedido para três filas padrão do SQS: estoque, faturamento e e-mail. Incidente 1: alguém alterou a política de acesso da fila de faturamento, o SNS não conseguiu entregar e as mensagens sumiram sem rastro. Incidente 2: uma mensagem malformada na fila de estoque volta para os consumidores sem parar e ocupa os trabalhadores.",
  stem:"Quais medidas tratam os dois incidentes? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Política de redirecionamento na assinatura do SNS da fila de faturamento, apontando para uma fila de mensagens mortas na mesma conta e região."},
    {k:"B",t:"Política de redirecionamento na fila de estoque, com número máximo de recebimentos igual a 5, apontando para uma fila de mensagens mortas."},
    {k:"C",t:"Entrega de mensagem bruta ativada nas três assinaturas, para que as filas recebam só o corpo da mensagem publicada."},
    {k:"D",t:"Conversão do tópico e das filas para FIFO, para garantir ordem e entrega exatamente uma vez a cada fila."},
    {k:"E",t:"Retenção da fila de faturamento aumentada para 14 dias, para guardar as mensagens até a política ser corrigida."}
  ],
  ans:["A","B"],
  why:{
    ok:"No incidente 1, a falha é do lado do cliente (o destino mudou a política). O SNS não tenta de novo nesse caso e descarta a mensagem, a não ser que a assinatura tenha uma fila de mensagens mortas, que precisa estar na mesma conta e região da assinatura. No incidente 2, a política de redirecionamento da própria fila de estoque tira a mensagem envenenada depois de 5 recebimentos e a guarda para análise.",
    C:"A entrega bruta muda só o formato da mensagem entregue. Não captura falhas de entrega nem limita tentativas.",
    D:"FIFO resolve ordem e duplicação, mas uma entrega bloqueada por política continua falhando e a mensagem envenenada continua voltando.",
    E:"As mensagens do incidente 1 nunca chegaram à fila, então a retenção dela não as guarda. Reter mais também não resolve a mensagem envenenada."
  },
  src:[{t:"Filas de mensagens mortas do SNS",u:"https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html"},{t:"Filas de mensagens mortas do SQS",u:"https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html"}]
},
{
  id:"saa-d2-31", exam:"saa", dom:"d2", lvl:4, type:"single", sec:110,
  tags:["alta-disponibilidade","desacoplamento"],
  case:"Uma API REST no API Gateway atende 30 parceiros e chama um sistema legado que aguenta no máximo 400 requisições por segundo no total. As requisições são gravações únicas (POST). Um parceiro manda rajadas de 1.000 por segundo e derruba o serviço dos outros. O contrato dá a cada parceiro até 50 por segundo e 1 milhão de requisições por mês. Pequenas variações em torno desses limites são aceitáveis.",
  stem:"Qual configuração protege o back-end e aplica o contrato por parceiro?",
  opts:[
    {k:"A",t:"Regra baseada em taxa do AWS WAF limitando cada endereço IP de origem."},
    {k:"B",t:"Limite no estágio em 400 por segundo e planos de uso com chave por parceiro."},
    {k:"C",t:"Cache do API Gateway no estágio, para responder às rajadas sem tocar o back-end."},
    {k:"D",t:"Aumento da cota de limitação da conta na região para absorver as rajadas."}
  ],
  ans:["B"],
  why:{
    ok:"A limitação no estágio (ou por método) mantém o total perto do que o legado aguenta e devolve 429 ao excesso. Os planos de uso identificam cada parceiro pela chave de API e aplicam taxa de 50 por segundo e cota de 1 milhão por mês. Entre as opções, só eles têm cota por período longo. A AWS avisa que limites e cotas são metas no melhor esforço, não tetos garantidos (por isso o cenário aceita pequenas variações), e sugere o AWS WAF como camada extra. A chave de API identifica o parceiro, mas não substitui a autenticação (IAM, Cognito ou autorizador Lambda).",
    A:"O WAF serve como camada extra, mas não aplica o contrato. Limitar por IP não corresponde a parceiro (um parceiro pode usar muitos IPs). Mesmo agregando por cabeçalho, a janela de avaliação da regra vai no máximo a 10 minutos, então não há cota mensal. E a regra também é aproximada, não um teto exato.",
    C:"Gravações POST únicas não se repetem, então o cache não tem o que servir. As rajadas continuam chegando ao legado.",
    D:"Aumentar a cota deixa passar ainda mais tráfego para um back-end que já não aguenta. É o contrário do que se precisa."
  },
  src:[{t:"Limitação de requisições no API Gateway",u:"https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html"},{t:"Planos de uso e chaves de API",u:"https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html"}]
}
];
/* Lote SAA-C03, domínio d3 (Arquiteturas de alto desempenho): saa-d3-18 a saa-d3-29 */
const QUESTIONS_SAA_D3 = [
{
  id:"saa-d3-18", exam:"saa", dom:"d3", lvl:4, type:"single", sec:100,
  tags:["dados-analise"],
  case:"Uma empresa mantém um cluster provisionado do Amazon Redshift com os últimos 12 meses de vendas. Os oito anos anteriores, cerca de 400 TB em Parquet, ficam no S3 e são consultados poucas vezes por mês. Os analistas precisam juntar, numa mesma consulta SQL, as tabelas do cluster com esse histórico, usando as ferramentas de BI já conectadas ao Redshift. O histórico não pode ser carregado no cluster, e o número de nós não deve aumentar.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Carregar o histórico com COPY em tabelas do cluster e ativar a compressão das colunas."},
    {k:"B",t:"Registrar o histórico como tabelas externas no Glue Data Catalog e consultar pelo Redshift Spectrum."},
    {k:"C",t:"Consultar o histórico no Amazon Athena e exportar o resultado para o cluster antes de cada relatório."},
    {k:"D",t:"Criar um cluster do Amazon EMR com Trino que leia o S3 e o Redshift na mesma consulta."}
  ],
  ans:["B"],
  why:{
    ok:"O Redshift Spectrum lê os arquivos direto no S3 por meio de tabelas externas registradas num catálogo (como o Glue Data Catalog). Depois de definidas, essas tabelas são consultadas e combinadas com as tabelas locais como qualquer outra tabela do Redshift, então a mesma conexão de BI continua servindo. O histórico não entra no cluster, e filtros e agregações são empurrados para a camada do Spectrum. Segundo a AWS, essas consultas usam bem menos capacidade de processamento do cluster, o que dispensa novos nós.",
    A:"O COPY carrega os 400 TB para dentro do cluster, exatamente o que o requisito proíbe, e esse volume tende a exigir mais capacidade.",
    C:"O Athena consulta o S3 sem servidor, mas aqui seria um segundo motor: o resultado teria de ser exportado e recarregado a cada relatório, e a junção não aconteceria numa única consulta no Redshift.",
    D:"Um cluster do EMR acrescenta infraestrutura para administrar e um novo ponto de conexão para o BI, sem necessidade, já que o próprio Redshift consulta o S3 com o Spectrum."
  },
  src:[
    {t:"Amazon Redshift Spectrum overview",u:"https://docs.aws.amazon.com/redshift/latest/dg/c-spectrum-overview.html"},
    {t:"External tables for Redshift Spectrum",u:"https://docs.aws.amazon.com/redshift/latest/dg/c-spectrum-external-tables.html"}
  ]
},
{
  id:"saa-d3-19", exam:"saa", dom:"d3", lvl:4, type:"single", sec:110,
  tags:["dados-analise"],
  case:"Todo dia chegam ao S3 arquivos CSV e JSON de 40 parceiros, e o formato deles muda de vez em quando, sem aviso. Uma equipe de três pessoas precisa converter tudo para Parquet de madrugada, usando Spark, e deixar as tabelas prontas para consulta no Athena, com o esquema sempre atualizado. Ninguém quer dimensionar, corrigir ou desligar clusters.",
  stem:"Qual solução atende com o menor esforço operacional?",
  opts:[
    {k:"A",t:"Um cluster do Amazon EMR em EC2 que roda o Spark e registra as tabelas no metastore do Hive no nó primário."},
    {k:"B",t:"Funções Lambda acionadas por arquivo, que convertem para Parquet e criam a tabela no Athena com DDL fixa."},
    {k:"C",t:"Amazon Data Firehose lendo o bucket e convertendo os arquivos para Parquet com o esquema de uma tabela do Glue."},
    {k:"D",t:"Um rastreador do AWS Glue que mantém o Data Catalog e um job de ETL do Glue em Spark agendado para a conversão."}
  ],
  ans:["D"],
  why:{
    ok:"O AWS Glue é sem servidor: o job de ETL roda Spark sem cluster para criar, corrigir ou desligar, e é cobrado pelo tempo de execução. O rastreador (crawler) lê os arquivos, infere o esquema e cria ou atualiza as tabelas no Glue Data Catalog, que é o catálogo usado pelo Athena. Assim a mudança de formato dos parceiros é refletida sem DDL manual.",
    A:"O EMR em EC2 roda Spark muito bem e faz sentido quando se quer controle fino do cluster e de outros frameworks, mas exige dimensionar, corrigir e desligar o cluster. Um metastore no nó primário ainda se perde junto com o cluster.",
    B:"Lambda não roda Spark, tem limite de 15 minutos por execução e uma DDL fixa não acompanha as mudanças de esquema, que é justamente o problema do cenário.",
    C:"As origens do Firehose são PUT direto, Kinesis Data Streams e Amazon MSK; o S3 aparece só como destino, então ele não lê arquivos que já estão num bucket. A conversão dele também usa um esquema fixo de uma tabela do Glue, sem descobrir mudanças."
  },
  src:[
    {t:"What is AWS Glue?",u:"https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html"},
    {t:"What is Amazon EMR?",u:"https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-what-is-emr.html"}
  ]
},
{
  id:"saa-d3-20", exam:"saa", dom:"d3", lvl:4, type:"single", sec:100,
  tags:["dados-analise","banco-cache"],
  case:"Um marketplace guarda 30 milhões de produtos numa tabela do DynamoDB, que continua sendo a fonte oficial dos dados. A nova busca do site precisa aceitar texto livre com erros de digitação (\"notbook\" deve achar \"notebook\"), ordenar os resultados por relevância e mostrar filtros por marca e faixa de preço com a contagem de itens de cada um.",
  stem:"Qual arquitetura atende?",
  opts:[
    {k:"A",t:"Criar um índice secundário global com o nome do produto como chave e buscar com Query e begins_with."},
    {k:"B",t:"Exportar a tabela para o S3 a cada hora e atender cada busca com consultas LIKE no Amazon Athena."},
    {k:"C",t:"Replicar os itens para o Amazon OpenSearch Service a partir do DynamoDB Streams e buscar nele."},
    {k:"D",t:"Colocar o DynamoDB Accelerator (DAX) na frente da tabela e filtrar os itens com Scan e contains."}
  ],
  ans:["C"],
  why:{
    ok:"O OpenSearch Service é um motor de busca: indexa texto com análise linguística, aceita consultas aproximadas (fuzzy) que toleram erros de digitação, ordena por relevância e calcula agregações, que viram os filtros com contagem. O DynamoDB Streams entrega cada alteração da tabela para manter o índice sincronizado, e a tabela segue como fonte oficial. O mesmo serviço é muito usado para busca e análise de logs.",
    A:"Um índice global só faz correspondência exata ou por prefixo na chave. Não tolera erro de digitação, não calcula relevância nem gera contagens por faceta.",
    B:"O Athena é para análise sob demanda, com respostas em segundos, e não para a busca interativa de um site. LIKE não tolera erros nem ordena por relevância, e os dados ficariam até uma hora desatualizados.",
    D:"O DAX acelera leituras por chave e consultas que o DynamoDB já faz; ele não acrescenta busca textual. Um Scan com contains lê a tabela inteira a cada busca e continua sem relevância."
  },
  src:[
    {t:"What is Amazon OpenSearch Service?",u:"https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html"}
  ]
},
{
  id:"saa-d3-21", exam:"saa", dom:"d3", lvl:4, type:"single", sec:100,
  tags:["dados-analise"],
  case:"Um aplicativo envia eventos de navegação em JSON, alguns milhares por segundo. Eles precisam chegar a uma tabela do Amazon Redshift em poucos minutos, e o campo de CPF deve ser removido antes de os dados chegarem ao S3 ou ao Redshift. A equipe não quer administrar servidores nem escrever e manter um consumidor de fluxo.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Amazon Data Firehose com transformação por Lambda que remove o campo, tendo o Redshift como destino."},
    {k:"B",t:"Kinesis Data Streams com uma aplicação em EC2 que remove o campo e faz INSERT de cada evento no Redshift."},
    {k:"C",t:"Gravar os eventos direto no S3 e agendar, de hora em hora, um COPY que descarta a coluna do CPF."},
    {k:"D",t:"Uma fila do SQS com uma Lambda consumidora que remove o campo e faz INSERT de cada evento no Redshift."}
  ],
  ans:["A"],
  why:{
    ok:"O Firehose é gerenciado: recebe o fluxo, agrupa os registros em lotes e entrega sem servidor nem consumidor próprio. A transformação por Lambda é uma opção nativa e só exige uma função curta que devolve cada registro sem o CPF, antes da entrega (sem ativar o backup dos registros de origem no S3, que guardaria o dado bruto). Para o Redshift, o Firehose grava os lotes já transformados num bucket do S3 e executa o COPY, que é a forma eficiente de carregar o Redshift, dentro do prazo de minutos.",
    B:"Exige servidores e um consumidor de fluxo, os dois proibidos. Além disso, INSERT linha a linha é a forma mais lenta de carregar o Redshift nesse volume.",
    C:"O CPF chegaria ao S3 antes de ser removido, violando o requisito, e uma carga por hora não cumpre o prazo de poucos minutos.",
    D:"A Lambda consumidora é justamente o código de consumo que a equipe não quer manter, e milhares de INSERT individuais por segundo sobrecarregam o Redshift."
  },
  src:[
    {t:"Understand data delivery in Amazon Data Firehose",u:"https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html"},
    {t:"Configure record transformation and format conversion",u:"https://docs.aws.amazon.com/firehose/latest/dev/create-transform.html"}
  ]
},
{
  id:"saa-d3-22", exam:"saa", dom:"d3", lvl:5, type:"multi", sec:130,
  tags:["banco-cache"],
  case:"Uma loja usa Aurora MySQL e vai colocar o ElastiCache na frente do catálogo. Requisitos: 1) quando um preço muda, a próxima leitura já deve trazer o valor novo; 2) produtos que ninguém consulta não podem ocupar memória indefinidamente; 3) a falha de um nó do cache não pode esvaziar o cache nem exigir intervenção manual.",
  stem:"Quais escolhas, juntas, atendem aos três requisitos? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Gravação direta (write-through): ao mudar o preço no banco, a aplicação grava o valor também no cache, com TTL em cada chave."},
    {k:"B",t:"ElastiCache para Memcached com vários nós, para que a falha de um deles não cause perda de dados."},
    {k:"C",t:"Carregamento sob demanda (lazy loading) com TTL de 24 horas, sem nenhuma ação no cache quando há gravação."},
    {k:"D",t:"ElastiCache para Valkey com réplicas em outra zona de disponibilidade e failover automático ativado."},
    {k:"E",t:"DynamoDB Accelerator (DAX) na frente do Aurora, como cache de leitura e de gravação."}
  ],
  ans:["A","D"],
  why:{
    ok:"A gravação direta atualiza o cache a cada gravação no banco, então o dado em cache não fica obsoleto (requisito 1). O TTL em cada chave faz expirar o que não é lido, evitando ocupar memória com itens inúteis (requisito 2); quando uma chave expira, a leitura busca no banco e repõe o valor. O Valkey (assim como o Redis OSS) suporta réplicas e failover automático: se o primário falha, uma réplica é promovida com os dados, sem ação manual (requisito 3).",
    B:"O Memcached não tem replicação nem failover automático. Os dados são divididos entre os nós, e as chaves do nó que falhou simplesmente somem do cache.",
    C:"Com lazy loading puro, o cache só é preenchido na falta (miss), então um preço alterado pode continuar velho por até 24 horas, violando o requisito 1.",
    E:"O DAX é um cache exclusivo do DynamoDB; não funciona na frente do Aurora."
  },
  src:[
    {t:"Caching strategies (ElastiCache)",u:"https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"},
    {t:"Comparing Valkey, Memcached, and Redis OSS",u:"https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/SelectEngine.html"}
  ]
},
{
  id:"saa-d3-23", exam:"saa", dom:"d3", lvl:4, type:"single", sec:100,
  tags:["banco-cache"],
  case:"Uma tabela do DynamoDB em produção, com 2 TB, tem idCliente como chave de partição e dataPedido como chave de classificação. O suporte agora precisa buscar pedidos pelo código de rastreio, que é único por pedido e não tem relação com o cliente. A tabela não pode ser recriada, e não há problema se um pedido gravado há um segundo ainda não aparecer na busca. A equipe quer o menor esforço de desenvolvimento.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Criar um índice secundário local com codigoRastreio como chave de classificação."},
    {k:"B",t:"Fazer um Scan paralelo com expressão de filtro sobre o atributo codigoRastreio."},
    {k:"C",t:"Criar outra tabela indexada pelo código e gravar nela a cada pedido, pela aplicação."},
    {k:"D",t:"Adicionar um índice secundário global com codigoRastreio como chave de partição."}
  ],
  ans:["D"],
  why:{
    ok:"Um índice secundário global pode ter chave de partição diferente da tabela e pode ser adicionado a uma tabela existente; o DynamoDB preenche o índice e o mantém atualizado sozinho. Consultas nele são eventualmente consistentes, o que o cenário aceita. Ele também tem capacidade própria, então as buscas do suporte não consomem a capacidade da tabela.",
    A:"Índice local só pode ser criado junto com a tabela e mantém a mesma chave de partição. Mesmo que existisse, exigiria saber o idCliente para buscar.",
    B:"Funciona, mas lê os 2 TB a cada busca: lento, caro e consome a capacidade da tabela. Filtro não reduz o que é lido.",
    C:"Resolve, mas obriga a escrever e manter gravação dupla, migrar os pedidos antigos e tratar falhas entre as duas tabelas, o que o índice global faz sem código."
  },
  src:[
    {t:"Managing global secondary indexes in DynamoDB",u:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.OnlineOps.html"}
  ]
},
{
  id:"saa-d3-24", exam:"saa", dom:"d3", lvl:4, type:"order", sec:80,
  tags:["rede-desempenho"],
  stem:"Uma distribuição do CloudFront tem como origem um ALB em us-east-1, com o Origin Shield ativado nessa mesma região. Um usuário em São Paulo pede um objeto estático que ainda não está em nenhum cache. Ordene as camadas que a requisição percorre, da PRIMEIRA à ÚLTIMA.",
  items:[
    {t:"Local de borda (edge location) próximo ao usuário"},
    {t:"Cache regional de borda (regional edge cache)"},
    {t:"Origin Shield em us-east-1"},
    {t:"ALB de origem"}
  ],
  e:"O usuário é atendido pelo local de borda mais próximo. Na falta (miss), o pedido sobe para o cache regional de borda. Com o Origin Shield ativo, todos os caches regionais buscam nessa camada extra, antes da origem, que fica na região de menor latência até a origem (aqui, a própria us-east-1). Só se o Origin Shield também não tiver o objeto a requisição chega ao ALB, e pedidos simultâneos pelo mesmo objeto são consolidados, o que reduz a carga na origem.",
  src:[
    {t:"Use Amazon CloudFront Origin Shield",u:"https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html"}
  ]
},
{
  id:"saa-d3-25", exam:"saa", dom:"d3", lvl:5, type:"multi", sec:130,
  tags:["rede-desempenho"],
  case:"Uma empresa tem 30 VPCs numa região e um datacenter. O tráfego entre o datacenter e as VPCs deve usar um link privado com largura de banda consistente. Se esse link cair, o tráfego precisa seguir automaticamente por um caminho criptografado pela internet, sem ninguém alterar rotas, e voltar ao link privado quando ele se recuperar. A equipe quer um ponto central de roteamento, sem conexões ponto a ponto entre VPCs.",
  stem:"Quais componentes, juntos, atendem? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Um Transit Gateway com as 30 VPCs anexadas e associado a um gateway do Direct Connect por uma interface virtual de trânsito."},
    {k:"B",t:"Emparelhamento de VPC entre as 30 VPCs e uma interface virtual privada do Direct Connect em cada uma delas."},
    {k:"C",t:"Uma VPN site a site anexada ao Transit Gateway, com rotas estáticas para os prefixos do datacenter."},
    {k:"D",t:"Uma VPN site a site anexada ao mesmo Transit Gateway, com roteamento dinâmico (BGP) anunciando os mesmos prefixos."},
    {k:"E",t:"Um AWS Global Accelerator na frente das VPCs para dar ao datacenter um caminho privado e de baixa latência."}
  ],
  ans:["A","D"],
  why:{
    ok:"O Transit Gateway centraliza o roteamento das 30 VPCs, e a interface virtual de trânsito liga o Direct Connect a ele por um gateway do Direct Connect, dando o link privado e consistente. A VPN com BGP no mesmo Transit Gateway anuncia os mesmos prefixos: para o mesmo destino, rotas propagadas pelo gateway do Direct Connect têm preferência sobre rotas propagadas pela VPN. A VPN só assume quando o Direct Connect para de anunciar e devolve o tráfego quando ele volta, sem mudança manual. Com 30 VPCs, convém anunciar prefixos resumidos, porque a interface de trânsito tem cota de prefixos anunciados.",
    B:"Emparelhamento não é transitivo e criaria centenas de conexões ponto a ponto, o oposto do pedido. Uma interface privada por VPC também não traz caminho de reserva.",
    C:"Rotas estáticas têm precedência sobre as propagadas no Transit Gateway, inclusive as do Direct Connect. O tráfego iria pela VPN o tempo todo, e o link privado ficaria ocioso.",
    E:"O Global Accelerator melhora o acesso de usuários pela rede de borda da AWS a aplicações públicas; não é conectividade privada entre datacenter e VPCs."
  },
  src:[
    {t:"How AWS Transit Gateway works (route evaluation order)",u:"https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"},
    {t:"Configure Direct Connect and VPN failover with Transit Gateway",u:"https://repost.aws/knowledge-center/dx-configure-dx-and-vpn-failover-tgw"}
  ]
},
{
  id:"saa-d3-26", exam:"saa", dom:"d3", lvl:4, type:"single", sec:90,
  tags:["rede-desempenho","computacao-armazenamento"],
  case:"Uma simulação de dinâmica de fluidos usa MPI e roda em 64 instâncias Linux de um tipo compatível com EFA, todas numa mesma zona, num grupo de posicionamento em cluster e com rede aprimorada (ENA) ativa. A análise mostra que o gargalo é a latência das mensagens entre os processos, causada pela passagem pela pilha TCP/IP do kernel.",
  stem:"Qual mudança ataca diretamente esse gargalo?",
  opts:[
    {k:"A",t:"Anexar mais interfaces de rede ENA a cada instância para somar largura de banda entre os nós."},
    {k:"B",t:"Espalhar as instâncias por três zonas de disponibilidade para usar mais caminhos de rede."},
    {k:"C",t:"Usar um Elastic Fabric Adapter (EFA) com uma biblioteca MPI sobre o Libfabric."},
    {k:"D",t:"Trocar os volumes por io2 Block Express em instâncias otimizadas para EBS, com mais IOPS."}
  ],
  ans:["C"],
  why:{
    ok:"O EFA é um dispositivo de rede para HPC e aprendizado de máquina. Com ele, o MPI usa a API Libfabric, que contorna o kernel do sistema operacional e fala direto com o dispositivo (OS-bypass), cortando justamente a latência da pilha TCP/IP. A interface EFA mantém também o ENA para o tráfego IP comum.",
    A:"Mais interfaces ENA aumentam a largura de banda total, mas o tráfego continua passando pelo kernel; a latência de cada mensagem não melhora.",
    B:"Separar em zonas aumenta a distância e a latência entre os nós. Além disso, o tráfego EFA não atravessa zonas de disponibilidade nem é roteável.",
    D:"Melhora o disco, não a rede. O gargalo descrito está na troca de mensagens entre instâncias."
  },
  src:[
    {t:"Elastic Fabric Adapter for AI/ML and HPC workloads",u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html"}
  ]
},
{
  id:"saa-d3-27", exam:"saa", dom:"d3", lvl:5, type:"single", sec:120,
  tags:["computacao-armazenamento"],
  case:"Três projetos na mesma empresa: 1) um cluster de HPC Linux precisa processar um conjunto de dados de 200 TB que fica no S3, com centenas de GB/s de vazão, e devolver os resultados ao bucket; 2) servidores Windows precisam de compartilhamentos SMB integrados ao Active Directory da empresa; 3) um sistema legado acessa os mesmos volumes por NFS e por SMB, hoje replica para um storage NetApp com SnapMirror, e a migração deve manter essa replicação.",
  stem:"Qual combinação atende aos três projetos?",
  opts:[
    {k:"A",t:"1) FSx for Lustre ligado ao bucket; 2) FSx for Windows File Server; 3) FSx for NetApp ONTAP."},
    {k:"B",t:"1) Amazon EFS no modo de vazão elástica; 2) FSx for Windows File Server; 3) FSx for OpenZFS."},
    {k:"C",t:"1) FSx for Lustre ligado ao bucket; 2) FSx for NetApp ONTAP; 3) FSx for OpenZFS."},
    {k:"D",t:"1) FSx for OpenZFS; 2) FSx for Windows File Server; 3) FSx for NetApp ONTAP."}
  ],
  ans:["A"],
  why:{
    ok:"O FSx for Lustre é o sistema de arquivos paralelo para HPC e pode ser ligado a um bucket: apresenta os objetos como arquivos, carrega sob demanda e exporta os resultados de volta ao S3. O FSx for Windows File Server entrega compartilhamentos SMB nativos do Windows, integrados ao Active Directory. O FSx for NetApp ONTAP é multiprotocolo (NFS, SMB, iSCSI e NVMe) e suporta o SnapMirror, mantendo a replicação com o NetApp existente.",
    B:"O EFS não se liga a um bucket do S3 nem é feito para centenas de GB/s de HPC. O FSx for OpenZFS é acessado por NFS (v3 a v4.2), sem SMB, e não usa SnapMirror (sua replicação é própria, entre sistemas FSx), então falha no projeto 3.",
    C:"Os projetos 1 e 2 estariam atendidos (o ONTAP também serve SMB com Active Directory), mas o OpenZFS só serve NFS e não usa SnapMirror, e o projeto 3 falha.",
    D:"O FSx for OpenZFS não se liga a um bucket existente para importar os objetos e exportar os resultados, como o Lustre faz (os pontos de acesso do S3 dele só expõem os próprios arquivos pela API do S3). E o Lustre é o sistema paralelo feito para vazão de HPC, então o projeto 1 falha."
  },
  src:[
    {t:"What is Amazon FSx for Lustre?",u:"https://docs.aws.amazon.com/fsx/latest/LustreGuide/what-is.html"},
    {t:"What is Amazon FSx for NetApp ONTAP?",u:"https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/what-is-fsx-ontap.html"},
    {t:"FSx for OpenZFS FAQs",u:"https://aws.amazon.com/fsx/openzfs/faqs/"}
  ]
},
{
  id:"saa-d3-28", exam:"saa", dom:"d3", lvl:4, type:"single", sec:100,
  tags:["containers-serverless"],
  case:"Uma startup que está abrindo sua primeira conta na AWS vai rodar uma API web e um processador em segundo plano que consome uma fila do SQS e não expõe nenhuma porta. Os dois já estão em imagens de contêiner. A equipe não conhece Kubernetes, não quer administrar instâncias nem nós, e cada serviço precisa de uma função do IAM própria.",
  stem:"Qual plataforma atende com o menor esforço operacional?",
  opts:[
    {k:"A",t:"Amazon EKS com grupos de nós gerenciados e uma função do IAM por conta de serviço do Kubernetes."},
    {k:"B",t:"Amazon ECS no AWS Fargate, com um serviço para cada contêiner e uma função do IAM por tarefa."},
    {k:"C",t:"AWS App Runner para os dois serviços, com dimensionamento automático pelo número de requisições."},
    {k:"D",t:"Amazon ECS em instâncias EC2 de um grupo do Auto Scaling, com um perfil de instância por serviço."}
  ],
  ans:["B"],
  why:{
    ok:"No Fargate, o ECS roda as tarefas sem instâncias para provisionar ou corrigir, e o ECS não exige conhecer Kubernetes. Um serviço do ECS pode rodar tanto a API (atrás de um balanceador) quanto o processador da fila, que não precisa expor porta. A função do IAM da tarefa dá a cada serviço as próprias permissões.",
    A:"O EKS exige operar Kubernetes, que a equipe não conhece, e os grupos de nós gerenciados ainda são instâncias EC2 da conta para dimensionar e atualizar.",
    C:"O App Runner foi pensado para aplicações web que recebem requisições, o que não serve ao processador de fila. Além disso, o App Runner não está mais aberto a novos clientes, como esta startup; a AWS recomenda o Amazon ECS Express Mode como alternativa.",
    D:"Com o tipo EC2, a equipe administra as instâncias. E o perfil de instância vale para todos os contêineres do host, não isola as permissões por serviço."
  },
  src:[
    {t:"AWS Fargate for Amazon ECS",u:"https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html"},
    {t:"AWS App Runner availability change",u:"https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html"}
  ]
},
{
  id:"saa-d3-29", exam:"saa", dom:"d3", lvl:4, type:"yn", sec:100,
  tags:["computacao-armazenamento","containers-serverless"],
  stem:"Responda Sim ou Não para cada afirmação sobre desempenho no S3 e cache no API Gateway.",
  rows:[
    {t:"Distribuir os objetos por vários prefixos aumenta a taxa total de requisições, porque o S3 suporta pelo menos 3.500 gravações e 5.500 leituras por segundo por prefixo particionado.",a:true,e:"O limite vale por prefixo particionado e não há limite de prefixos por bucket. A escala é gradual: durante o ajuste podem aparecer erros 503 (Slow Down)."},
    {t:"Para baixar mais rápido um objeto de 5 GB, a aplicação pode pedir intervalos de bytes diferentes em várias requisições GET paralelas.",a:true,e:"A leitura por intervalo de bytes (Range) em paralelo usa melhor a placa de rede. Se o objeto veio por envio em várias partes, alinhar os intervalos às partes dá o melhor resultado."},
    {t:"Numa API REST do API Gateway, o cache configurado no estágio pode manter uma resposta por até 24 horas.",a:false,e:"O TTL padrão é 300 segundos e o máximo é 3.600 segundos (uma hora). TTL 0 desativa o cache."},
    {t:"Com o cache ativado no estágio, por padrão só os métodos GET são armazenados, e uma query string pode fazer parte da chave de cache.",a:true,e:"Só GET vem ativado por padrão, cada método pode sobrescrever o padrão do estágio, e parâmetros como cabeçalhos, caminho ou query string podem ser chaves de cache."}
  ],
  src:[
    {t:"Optimizing Amazon S3 performance",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html"},
    {t:"Performance guidelines for Amazon S3",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-guidelines.html"},
    {t:"Cache settings for REST APIs in API Gateway",u:"https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html"}
  ]
}
];
/* Lote: questões SAA-C03, domínio d4 (Arquiteturas com custo otimizado), ids saa-d4-15 a saa-d4-25 */
const QUESTIONS_SAA_D4 = [
{
  id:"saa-d4-15", exam:"saa", dom:"d4", lvl:5, type:"single", sec:110, tags:["custo-banco-rede"],
  case:"Um sistema interno de cadastro usa Aurora PostgreSQL 16 (versão compatível com pausa automática). Ele é usado algumas horas por semana, em dias imprevisíveis, e passa dias inteiros sem nenhuma conexão. Os usuários aceitam esperar até cerca de 30 segundos na primeira conexão depois de um período parado. A equipe quer o menor custo possível sem precisar ligar e desligar nada manualmente.",
  stem:"Qual configuração atende com o menor custo?",
  opts:[
    {k:"A",t:"Aurora Serverless v2 com capacidade mínima de 0,5 ACU e máxima de 16 ACUs"},
    {k:"B",t:"Aurora Serverless v2 com capacidade mínima de 0 ACU e pausa automática por inatividade"},
    {k:"C",t:"Aurora Serverless v2 com mínimo de 0 ACU, acessado pela aplicação através do RDS Proxy"},
    {k:"D",t:"Instância provisionada db.t4g.medium ligada o tempo todo, coberta por instância reservada"}
  ],
  ans:["B"],
  why:{
    ok:"Com mínimo de 0 ACU, o Aurora Serverless v2 pausa a instância depois de um período sem conexões (configurável de 5 minutos a 1 dia) e retoma sozinho quando chega uma conexão, em geral em cerca de 15 segundos (30 segundos ou mais se ficou pausado por mais de 24 horas). Pausado, a cobrança da instância é zero; continua a do armazenamento. Atende o uso imprevisível sem agenda e sem operação manual.",
    A:"Com mínimo de 0,5 ACU a instância nunca pausa: paga computação 24 horas por dia, inclusive nos dias sem nenhum uso.",
    C:"O RDS Proxy mantém uma conexão aberta com cada instância, e isso impede a pausa automática. O cluster ficaria sempre ativo e ainda pagaria o proxy.",
    D:"Uma instância provisionada ligada o tempo todo paga computação mesmo ociosa. A reserva reduz a tarifa por hora, mas não chega a zero nos dias parados."
  },
  src:[{t:"Aurora: escalar até zero ACU com pausa automática",u:"https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html"}]
},
{
  id:"saa-d4-16", exam:"saa", dom:"d4", lvl:4, type:"single", sec:100, tags:["custo-banco-rede"],
  case:"Um cluster Aurora MySQL atende um sistema de pagamentos com muita gravação, de forma constante. A análise da fatura mostra que as cobranças por solicitação de E/S representam cerca de 45% do gasto total com o Aurora, e esse percentual é estável há meses. A empresa quer reduzir a conta sem alterar a aplicação.",
  stem:"Qual mudança atende?",
  opts:[
    {k:"A",t:"Adicionar um cluster do ElastiCache para guardar os resultados das consultas mais frequentes"},
    {k:"B",t:"Migrar as instâncias do cluster para Aurora Serverless v2, mantendo a configuração de armazenamento atual"},
    {k:"C",t:"Trocar o armazenamento do cluster para volumes io2 com IOPS provisionadas"},
    {k:"D",t:"Alterar a configuração de armazenamento do cluster para Aurora I/O-Optimized"}
  ],
  ans:["D"],
  why:{
    ok:"No Aurora I/O-Optimized não há cobrança por operação de E/S de leitura ou gravação; paga-se instância e armazenamento, com tarifas mais altas. A AWS indica essa opção quando a E/S passa de 25% do gasto com o Aurora, que é o caso (45%, estável). A troca é uma configuração do cluster e não muda a aplicação.",
    A:"Um cache exige mudar o código para consultar o ElastiCache e só alivia leituras. A carga aqui é de gravação, que continuaria gerando E/S cobrada.",
    B:"Serverless v2 muda o modelo de computação, não o de armazenamento. Na configuração Standard, a E/S continua sendo cobrada por solicitação.",
    C:"O Aurora não usa volumes EBS escolhidos pelo cliente; o armazenamento é o volume distribuído do próprio cluster, com as opções Standard ou I/O-Optimized."
  },
  src:[{t:"Aurora: configurações de armazenamento",u:"https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.StorageReliability.html"}]
},
{
  id:"saa-d4-17", exam:"saa", dom:"d4", lvl:4, type:"single", sec:100, tags:["custo-banco-rede"],
  case:"Uma tabela do DynamoDB guarda o histórico de pedidos de uma loja: 40 TB, crescendo todo mês. Pedidos com mais de seis meses quase nunca são lidos, mas precisam continuar consultáveis pela mesma API, com latência de milissegundos, por exigência do atendimento. O armazenamento já é o maior item da conta da tabela.",
  stem:"Qual ação reduz o custo atendendo os requisitos?",
  opts:[
    {k:"A",t:"Mudar a classe da tabela para DynamoDB Standard-Infrequent Access"},
    {k:"B",t:"Exportar os pedidos antigos para o S3 Glacier Flexible Retrieval e apagá-los da tabela"},
    {k:"C",t:"Mudar o modo de capacidade da tabela de provisionado para sob demanda"},
    {k:"D",t:"Configurar TTL para excluir automaticamente pedidos com mais de seis meses"}
  ],
  ans:["A"],
  why:{
    ok:"A classe Standard-IA tem armazenamento até 60% mais barato, com leituras e gravações um pouco mais caras. Como o armazenamento domina e o acesso é raro, a conta cai. Desempenho, durabilidade e API são os mesmos, então a consulta em milissegundos continua igual, sem mudar código.",
    B:"O Glacier Flexible Retrieval exige restauração de minutos a horas e sai da API do DynamoDB. Falha a consulta em milissegundos pela mesma API.",
    C:"O modo de capacidade muda como se paga leitura e gravação, não o preço do GB armazenado, que é o maior item da conta.",
    D:"O TTL apaga os itens. Isso viola a exigência de manter os pedidos consultáveis."
  },
  src:[{t:"DynamoDB: classes de tabela",u:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.TableClasses.html"},{t:"AWS: nova classe de tabela do DynamoDB",u:"https://aws.amazon.com/blogs/aws/new-dynamodb-table-class-save-up-to-60-in-your-dynamodb-costs/"}]
},
{
  id:"saa-d4-18", exam:"saa", dom:"d4", lvl:5, type:"yn", sec:120, tags:["custo-banco-rede"],
  stem:"Responda Sim ou Não para cada afirmação sobre o custo de pontos de extremidade da VPC e do gateway NAT, numa VPC cujas instâncias privadas enviam dezenas de terabytes por mês ao Kinesis Data Streams e ao SQS.",
  rows:[
    {t:"Um ponto de extremidade de interface é cobrado por hora em cada zona de disponibilidade em que foi provisionado, mesmo que não passe tráfego por ele.", a:true,
     e:"O PrivateLink cobra cada hora em que o ponto de extremidade fica provisionado em cada zona, além do volume processado. Três zonas significam três cobranças por hora."},
    {t:"Para esse volume, trocar o caminho pelo gateway NAT por pontos de extremidade de interface tende a reduzir o custo por gigabyte.", a:true,
     e:"Em us-east-2 (Ohio), o gateway NAT cobra US$ 0,045 por GB processado. O ponto de extremidade de interface cobra US$ 0,01 por GB no primeiro PB do mês, com faixas mais baratas acima disso. Com dezenas de TB, a diferença supera com folga as horas dos pontos de extremidade."},
    {t:"É possível criar um ponto de extremidade de gateway, sem custo, para o SQS e o Kinesis Data Streams.", a:false,
     e:"Pontos de extremidade de gateway existem só para o S3 e o DynamoDB. SQS e Kinesis usam ponto de extremidade de interface, que é pago."},
    {t:"Um único ponto de extremidade de interface atende todos os serviços da AWS que a VPC acessa.", a:false,
     e:"Cada ponto de extremidade de interface é de um serviço. São necessários um para o SQS e outro para o Kinesis, cada um cobrado por hora e por zona."}
  ],
  src:[{t:"AWS PrivateLink: preços",u:"https://aws.amazon.com/privatelink/pricing/"},{t:"Amazon VPC: preços (NAT e gateway)",u:"https://aws.amazon.com/vpc/pricing/"}]
},
{
  id:"saa-d4-19", exam:"saa", dom:"d4", lvl:4, type:"single", sec:105, tags:["custo-banco-rede"],
  case:"Uma empresa replica cerca de 300 TB por mês, de forma contínua, da região da AWS para o datacenter próprio, e vai manter essa operação pelos próximos anos. Hoje usa uma VPN Site-to-Site pela internet, e a conta de transferência de saída é o maior item da fatura. O time de rede também reclama da latência variável da internet.",
  stem:"Qual opção reduz o custo e torna a latência mais estável?",
  opts:[
    {k:"A",t:"Adicionar mais túneis de VPN Site-to-Site com ECMP em um Transit Gateway"},
    {k:"B",t:"Enviar os dados todo mês em dispositivos AWS Snowball Edge"},
    {k:"C",t:"Contratar uma conexão dedicada do AWS Direct Connect até o datacenter"},
    {k:"D",t:"Ativar a aceleração da VPN Site-to-Site, que usa o AWS Global Accelerator"}
  ],
  ans:["C"],
  why:{
    ok:"No Direct Connect a transferência de saída tem tarifa por GB menor que a da internet, e o tráfego não passa pela internet pública, o que dá latência consistente. Com volume alto e permanente, essa economia por GB supera o custo da porta. Desde setembro de 2026, conexões dedicadas de 10 e 100 Gbps também podem usar o preço fixo mensal, sem cobrança de saída por GB dentro da abrangência geográfica escolhida. Nos dois modelos, a resposta é o Direct Connect.",
    A:"Mais túneis aumentam a vazão, mas o tráfego segue pela internet, com tarifa de saída da internet e latência variável. Ainda soma o custo de processamento do Transit Gateway.",
    B:"A família Snow não aceita novos clientes desde novembro de 2025. Mesmo para quem já usa, ela serve para cargas pontuais, não para replicação contínua, e somaria dias de atraso aos dados.",
    D:"A VPN acelerada usa o Global Accelerator e melhora o caminho até a AWS, mas a saída continua na tarifa da internet, com um adicional por GB. Sobe o custo em vez de reduzir."
  },
  src:[{t:"Whitepaper Hybrid Connectivity: custo",u:"https://docs.aws.amazon.com/whitepapers/latest/hybrid-connectivity/cost.html"},{t:"Direct Connect: preço fixo (anúncio)",u:"https://aws.amazon.com/about-aws/whats-new/2026/09/aws-direct-connect-announces-flat-rate-pricing/"}]
},
{
  id:"saa-d4-20", exam:"saa", dom:"d4", lvl:4, type:"single", sec:95, tags:["custo-banco-rede"],
  case:"Um portal de cursos entrega vídeos por uma distribuição do CloudFront. 96% dos acessos vêm dos Estados Unidos, do Canadá e da Europa. Os poucos usuários de outros continentes precisam continuar conseguindo assistir, e a empresa aceita que eles tenham latência um pouco maior. O objetivo é reduzir a conta do CloudFront.",
  stem:"Qual mudança atende?",
  opts:[
    {k:"A",t:"Ativar a restrição geográfica para permitir só Estados Unidos, Canadá e países da Europa"},
    {k:"B",t:"Ativar o Origin Shield em uma região próxima à origem, mantendo a classe de preço atual"},
    {k:"C",t:"Servir os vídeos direto do bucket do S3 com o S3 Transfer Acceleration ativado"},
    {k:"D",t:"Mudar a classe de preço da distribuição para Price Class 100"}
  ],
  ans:["D"],
  why:{
    ok:"A classe de preço limita de quais pontos de presença o CloudFront entrega. A Price Class 100 usa só as regiões de preço mais baixo: Estados Unidos, México e Canadá; Europa, Israel e Turquia. Quem está fora continua sendo atendido, pelo ponto de presença de menor latência dentro da classe, e por isso pode ter desempenho um pouco pior, o que o cenário aceita.",
    A:"A restrição geográfica bloqueia os outros países, e eles precisam continuar assistindo.",
    B:"O Origin Shield reduz as idas à origem, mas é cobrado à parte e não muda o preço da entrega aos usuários, que é o grosso da conta.",
    C:"O Transfer Acceleration é para acelerar envio e download de dados no bucket, com cobrança adicional por GB. Sair direto do S3 também tende a custar mais por GB que pelo CloudFront."
  },
  src:[{t:"CloudFront API: PriceClass",u:"https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_DistributionConfig.html"},{t:"CloudFront: preços e classes de preço",u:"https://aws.amazon.com/cloudfront/pricing/pay-as-you-go/"}]
},
{
  id:"saa-d4-21", exam:"saa", dom:"d4", lvl:4, type:"multi", sec:110, tags:["custo-computacao"],
  case:"Um processamento de imagens de satélite roda em lotes, todas as noites, em um grupo do Auto Scaling 100% Spot. Cada tarefa grava ponto de controle e pode recomeçar. Hoje o grupo usa só c5.2xlarge, em uma zona de disponibilidade, e as interrupções frequentes atrasam o lote. A empresa quer manter o menor custo e reduzir as interrupções.",
  stem:"Quais ajustes atendem? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Permitir vários tipos e tamanhos de instância que sirvam à carga, em todas as zonas da VPC"},
    {k:"B",t:"Trocar a estratégia de alocação Spot para lowest-price, buscando sempre o menor preço"},
    {k:"C",t:"Comprar instâncias reservadas c5.2xlarge para cobrir o pico do lote noturno"},
    {k:"D",t:"Usar a estratégia de alocação price-capacity-optimized ou capacity-optimized no grupo"},
    {k:"E",t:"Trocar o Spot por instâncias sob demanda c5.2xlarge somente no horário do lote"}
  ],
  ans:["A","D"],
  why:{
    ok:"Um pool Spot é a combinação de tipo de instância e zona. Aceitar muitos tipos (a AWS sugere pelo menos 10) em todas as zonas dá ao grupo mais pools para escolher. As estratégias price-capacity-optimized (a recomendada) e capacity-optimized lançam nos pools com mais capacidade livre, que são os menos sujeitos a interrupção, sem abrir mão do desconto do Spot.",
    B:"A lowest-price escolhe o pool mais barato sem olhar a capacidade disponível, o que tende a aumentar as interrupções.",
    C:"A reserva cobra 24 horas por dia durante o prazo, mas o lote só roda à noite. Paga-se por horas sem uso.",
    E:"O sob demanda elimina interrupções, mas custa bem mais que o Spot. A carga tolera interrupção, então o custo extra não se justifica."
  },
  src:[{t:"EC2: boas práticas do Spot",u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-best-practices.html"},{t:"Auto Scaling: estratégias de alocação",u:"https://docs.aws.amazon.com/autoscaling/ec2/userguide/allocation-strategies.html"}]
},
{
  id:"saa-d4-22", exam:"saa", dom:"d4", lvl:4, type:"single", sec:105, tags:["custo-computacao"],
  case:"Uma API de produção roda em Java sobre instâncias m5 sob demanda, e um conjunto de funções Lambda em Python, sem bibliotecas com binários nativos, processa os eventos dessa API. A empresa quer reduzir o custo de computação dos dois sem assumir compromisso de prazo e sem aceitar interrupções na API.",
  stem:"Qual opção atende?",
  opts:[
    {k:"A",t:"Migrar a API para instâncias Graviton e mudar a arquitetura das funções Lambda para arm64"},
    {k:"B",t:"Comprar um Compute Savings Plan de três anos cobrindo a média de uso da API e das funções"},
    {k:"C",t:"Mover a API para instâncias Spot e manter as funções Lambda na arquitetura x86_64"},
    {k:"D",t:"Ativar a simultaneidade provisionada nas funções e trocar as m5 por instâncias t3 com crédito ilimitado"}
  ],
  ans:["A"],
  why:{
    ok:"Instâncias Graviton (Arm) têm melhor preço por desempenho que as x86 equivalentes, e Java roda nelas sem recompilar. No Lambda, a arquitetura arm64 tem duração cobrada 20% mais barata e até 34% melhor preço por desempenho; funções em Python sem binários nativos trocam só a configuração. Nada disso exige compromisso nem traz interrupção.",
    B:"O Savings Plan dá desconto, mas exige compromisso de um ou três anos, o que o requisito proíbe.",
    C:"O Spot pode ser interrompido com aviso de dois minutos, o que não é aceitável para a API de produção. E as funções continuariam no preço x86.",
    D:"A simultaneidade provisionada é cobrada mesmo sem invocações e aumenta o custo. Instâncias t3 com crédito ilimitado cobram extra quando a CPU fica acima da linha de base, comum numa API constante."
  },
  src:[{t:"AWS: Lambda com Graviton2",u:"https://aws.amazon.com/blogs/aws/aws-lambda-functions-powered-by-aws-graviton2-processor-run-your-functions-on-arm-and-get-up-to-34-better-price-performance/"}]
},
{
  id:"saa-d4-23", exam:"saa", dom:"d4", lvl:4, type:"single", sec:110, tags:["custo-banco-rede","custo-computacao"],
  case:"Uma empresa tem dois bancos RDS for MySQL. O de produção é Multi-AZ, roda 24 horas por dia com tamanho estável, e vai continuar assim pelos próximos três anos; a empresa aceita assumir compromisso pelo prazo todo. O de desenvolvimento só é usado das 9h às 17h, de segunda a sexta. A diretoria quer o menor custo total, com o mínimo de trabalho manual.",
  stem:"Qual combinação atende?",
  opts:[
    {k:"A",t:"Instância reservada de três anos para os dois bancos, já que ambos são permanentes"},
    {k:"B",t:"Database Savings Plans de um ano para produção e Instance Scheduler on AWS no desenvolvimento"},
    {k:"C",t:"Instância reservada de três anos para produção e Instance Scheduler on AWS no desenvolvimento"},
    {k:"D",t:"Instância reservada de três anos para produção e instâncias Spot do RDS para o desenvolvimento"}
  ],
  ans:["C"],
  why:{
    ok:"A produção é estável e permanente, o perfil ideal para a instância reservada de três anos, que dá o maior desconto sobre o sob demanda para essa carga. O desenvolvimento fica ligado só 40 das 168 horas da semana; parado, não paga hora de instância. O Instance Scheduler on AWS para e liga o RDS por agenda via etiquetas, e as paradas diárias evitam o religamento automático que o RDS faz após sete dias parado.",
    A:"A reserva é cobrada todas as horas do prazo, mesmo com o banco parado. Para quem usa só 40 horas por semana, pagar sob demanda e parar fora do expediente sai mais barato.",
    B:"O Database Savings Plans cobre o RDS e é flexível entre mecanismos, tamanhos e regiões, mas só tem prazo de um ano e desconto de até 20% em instâncias provisionadas. Para uso estável por três anos, a reserva de três anos desconta bem mais.",
    D:"O RDS não oferece instâncias Spot. Esse modelo existe para o EC2, não para bancos gerenciados do RDS."
  },
  src:[{t:"Instance Scheduler on AWS: visão geral",u:"https://docs.aws.amazon.com/solutions/latest/instance-scheduler-on-aws/solution-overview.html"},{t:"AWS: Database Savings Plans",u:"https://aws.amazon.com/blogs/aws/introducing-database-savings-plans-for-aws-databases/"}]
},
{
  id:"saa-d4-24", exam:"saa", dom:"d4", lvl:4, type:"order", sec:90, tags:["custo-armazenamento"],
  stem:"Uma equipe compara onde guardar dados no EFS. Ordene as opções do MAIOR para o MENOR preço de armazenamento por GB-mês.",
  items:[
    {t:"Classe Standard em sistema de arquivos regional (várias zonas)"},
    {t:"Classe Standard em sistema de arquivos One Zone (uma zona)"},
    {t:"Classe Infrequent Access (IA) em sistema de arquivos regional"},
    {t:"Classe Archive em sistema de arquivos regional"}
  ],
  e:"O Standard regional guarda os dados em várias zonas e é o mais caro. O Standard em One Zone fica em uma zona só e custa cerca de 47% menos. A classe IA tem armazenamento até 95% mais barato que o Standard, mas cobra por GB acessado. O Archive é até 50% mais barato que o IA, feito para dados lidos poucas vezes por ano, com cobrança mínima de 90 dias, e só existe em sistemas regionais. Sistemas One Zone também têm classe IA, mas não têm Archive. Por padrão, o ciclo de vida move arquivos sem acesso para IA após 30 dias e para Archive após 90 dias.",
  src:[{t:"EFS: classes de armazenamento",u:"https://aws.amazon.com/efs/storage-classes/"},{t:"EFS: gerenciamento do ciclo de vida",u:"https://docs.aws.amazon.com/efs/latest/ug/lifecycle-management-efs.html"}]
},
{
  id:"saa-d4-25", exam:"saa", dom:"d4", lvl:4, type:"multi", sec:115, tags:["custo-armazenamento"],
  case:"Uma organização com 40 contas no AWS Organizations tem cerca de 300 buckets, nenhum com versionamento ativado. A conta do S3 cresce mais rápido que o tamanho total dos objetos que aparece nas listagens. Muitas aplicações enviam arquivos grandes por upload em partes, e várias falham no meio do envio. A equipe quer achar onde está o desperdício em todas as contas e eliminá-lo com o menor custo.",
  stem:"Quais medidas atendem? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Ativar eventos de dados do CloudTrail em todos os buckets e analisar os logs no Athena"},
    {k:"B",t:"Criar um painel do S3 Storage Lens no nível da organização e olhar as métricas de upload em partes incompleto"},
    {k:"C",t:"Mover todos os buckets para a classe S3 Intelligent-Tiering"},
    {k:"D",t:"Ativar o Requester Pays nos buckets que recebem uploads das aplicações"},
    {k:"E",t:"Criar regras de ciclo de vida com AbortIncompleteMultipartUpload, por exemplo após 7 dias do início"}
  ],
  ans:["B","E"],
  why:{
    ok:"As partes de um upload em partes que nunca foi concluído são cobradas como armazenamento e não aparecem nas listagens de objetos no console, o que explica a diferença. O Storage Lens tem painel para a organização inteira e mostra, na categoria de otimização de custo, os bytes de uploads em partes incompletos, inclusive os com mais de 7 dias. A regra AbortIncompleteMultipartUpload interrompe os envios não concluídos no prazo e apaga as partes, inclusive dos uploads já existentes.",
    A:"Eventos de dados do CloudTrail são cobrados por evento e mostram chamadas de API, não quanto espaço as partes órfãs ocupam. É caro e não remove nada.",
    C:"O Intelligent-Tiering muda a classe dos objetos conforme o acesso, mas não apaga partes de uploads incompletos.",
    D:"O Requester Pays transfere para quem faz a requisição o custo das requisições e da transferência, não o do armazenamento. As partes órfãs continuariam cobradas do dono do bucket."
  },
  src:[{t:"S3: Storage Lens para otimizar custo",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-lens-optimize-storage.html"},{t:"S3: ciclo de vida para uploads em partes incompletos",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-abort-incomplete-mpu-lifecycle-config.html"}]
}
];
QUESTIONS_EXTRA.push(...QUESTIONS_CLF_D1, ...QUESTIONS_CLF_D2, ...QUESTIONS_CLF_D3, ...QUESTIONS_CLF_D4);
QUESTIONS_SAA.push(...QUESTIONS_SAA_D1, ...QUESTIONS_SAA_D2, ...QUESTIONS_SAA_D3, ...QUESTIONS_SAA_D4);
