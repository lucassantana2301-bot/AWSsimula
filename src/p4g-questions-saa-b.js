/* ============================================================
   BANCO DE QUESTÕES — SAA-C03, domínios 3 e 4
   ============================================================ */
const QUESTIONS_SAA_B = [
/* ---------------- D3 desempenho ---------------- */
{
  id:"saa-d3-01", exam:"saa", dom:"d3", lvl:5, type:"single", sec:105, tags:["computacao-armazenamento"],
  case:"Uma frota de instâncias Linux distribuída em três zonas de disponibilidade precisa ler e gravar no mesmo conjunto de arquivos, com acesso simultâneo.",
  stem:"Qual serviço de armazenamento atende?",
  opts:[
    {k:"A",t:"Amazon EFS"},
    {k:"B",t:"Um volume EBS io2 com Multi-Attach"},
    {k:"C",t:"Amazon S3 montado como sistema de arquivos"},
    {k:"D",t:"Armazenamento de instância em cada máquina"}
  ],
  ans:["A"],
  why:{
    ok:"O EFS é sistema de arquivos NFS gerenciado, acessível simultaneamente por instâncias de várias zonas, que é exatamente o requisito.",
    B:"Multi-Attach existe, mas é restrito a instâncias na mesma zona de disponibilidade e exige sistema de arquivos com reconhecimento de cluster.",
    C:"O S3 é armazenamento de objetos; montá-lo como sistema de arquivos não entrega semântica POSIX nem consistência para gravação simultânea.",
    D:"O armazenamento de instância é local e efêmero: cada máquina veria o próprio conteúdo."
  },
  src:[{t:"AWS: Amazon EFS",u:"https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html"}]
},
{
  id:"saa-d3-02", exam:"saa", dom:"d3", lvl:4, type:"single", sec:95, tags:["computacao-armazenamento"],
  case:"Um time usa volumes gp2 de 3 TB apenas para alcançar as operações por segundo necessárias; o espaço em si está em 20% de uso.",
  stem:"Qual mudança reduz o custo mantendo o desempenho?",
  opts:[
    {k:"A",t:"Migrar para gp3 e configurar as operações por segundo e a vazão independentemente do tamanho"},
    {k:"B",t:"Migrar para io2 com operações provisionadas"},
    {k:"C",t:"Migrar para st1, que tem maior vazão"},
    {k:"D",t:"Reduzir o volume gp2 para 600 GB"}
  ],
  ans:["A"],
  why:{
    ok:"Em gp3 o desempenho é configurado à parte do tamanho, então o volume pode encolher para o espaço realmente usado sem perder operações por segundo. É o caso de redução de custo mais cobrado.",
    B:"io2 entrega mais desempenho e custa mais: piora o objetivo declarado.",
    C:"st1 é disco rígido, bom para leitura sequencial e ruim para operações por segundo aleatórias.",
    D:"Em gp2 o desempenho é proporcional ao tamanho, então encolher derruba justamente as operações por segundo que motivaram o volume grande."
  },
  src:[{t:"AWS: tipos de volume EBS",u:"https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"}]
},
{
  id:"saa-d3-03", exam:"saa", dom:"d3", lvl:5, type:"single", sec:110, tags:["banco-cache"],
  case:"Uma API responde em 900 ms. A análise mostra que 80% do tempo é uma consulta de listagem repetida, cujo resultado muda uma vez por hora. Os usuários estão espalhados pelo mundo.",
  stem:"Qual mudança traz o maior ganho com o menor esforço?",
  opts:[
    {k:"A",t:"ElastiCache na frente da consulta de listagem"},
    {k:"B",t:"Aumentar a classe da instância do banco de dados"},
    {k:"C",t:"Adicionar uma réplica de leitura"},
    {k:"D",t:"Migrar o banco para DynamoDB"}
  ],
  ans:["A"],
  why:{
    ok:"A consulta é repetida e tolera uma hora de defasagem: é o caso canônico de cache, que elimina a maior parte dos 900 ms sem mudar o modelo de dados.",
    B:"Instância maior ataca o sintoma com o maior custo e não elimina a repetição da mesma consulta.",
    C:"A réplica ajuda quando o gargalo é volume de leituras distintas, não repetição da mesma leitura.",
    D:"Trocar o banco é reescrita de aplicação para um problema que o cache resolve."
  },
  src:[{t:"AWS: estratégias de cache",u:"https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"}]
},
{
  id:"saa-d3-04", exam:"saa", dom:"d3", lvl:4, type:"single", sec:95, tags:["banco-cache"],
  case:"Funções Lambda com alta concorrência esgotam o limite de conexões de um banco RDS durante os picos.",
  stem:"Qual solução resolve?",
  opts:[
    {k:"A",t:"RDS Proxy entre a Lambda e o banco"},
    {k:"B",t:"Aumentar a memória das funções Lambda"},
    {k:"C",t:"Adicionar uma réplica de leitura"},
    {k:"D",t:"Reduzir a concorrência reservada da Lambda para 1"}
  ],
  ans:["A"],
  why:{
    ok:"O RDS Proxy mantém um reservatório de conexões reaproveitadas entre invocações, que é exatamente o problema de muitas funções abrindo conexão própria.",
    B:"Memória muda CPU e desempenho da função, não o número de conexões abertas.",
    C:"A réplica ajuda na carga de leitura e também tem limite de conexões.",
    D:"Serializa o processamento e destrói a escalabilidade para contornar o sintoma."
  },
  src:[{t:"AWS: RDS Proxy",u:"https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html"}]
},
{
  id:"saa-d3-05", exam:"saa", dom:"d3", lvl:5, type:"single", sec:105, tags:["banco-cache","vpc-seguranca"],
  case:"Um site estático em um bucket do S3 precisa ser entregue rapidamente a usuários de vários continentes, e o bucket não pode ficar acessível publicamente.",
  stem:"Qual configuração atende?",
  opts:[
    {k:"A",t:"Distribuição do CloudFront com controle de acesso de origem apontando para o bucket"},
    {k:"B",t:"Hospedagem de site estático do S3 com política de bucket pública"},
    {k:"C",t:"Replicar o bucket para três regiões e usar roteamento por latência no Route 53"},
    {k:"D",t:"Global Accelerator apontando para o bucket"}
  ],
  ans:["A"],
  why:{
    ok:"O controle de acesso de origem deixa o bucket fechado e permite que só a distribuição leia, enquanto o cache na borda entrega o conteúdo perto do usuário.",
    B:"Torna o bucket público, que o enunciado proíbe.",
    C:"Resolve latência com muito mais custo e complexidade, e ainda exigiria expor cada bucket.",
    D:"O Global Accelerator trabalha com endereços de entrada para aplicações em TCP e UDP e não serve bucket do S3 nem faz cache."
  },
  src:[{t:"AWS: restringir acesso à origem",u:"https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html"}]
},
{
  id:"saa-d3-06", exam:"saa", dom:"d3", lvl:4, type:"single", sec:90, tags:["computacao-armazenamento"],
  case:"Um cluster de computação científica precisa de latência de rede mínima entre os nós, que trocam mensagens intensamente entre si.",
  stem:"Qual recurso usar?",
  opts:[
    {k:"A",t:"Grupo de posicionamento do tipo cluster"},
    {k:"B",t:"Grupo de posicionamento do tipo spread"},
    {k:"C",t:"Grupo de posicionamento do tipo partição"},
    {k:"D",t:"Distribuir as instâncias em três zonas de disponibilidade"}
  ],
  ans:["A"],
  why:{
    ok:"O tipo cluster agrupa as instâncias próximas na mesma zona, entregando a menor latência e a maior vazão entre nós, que é o requisito de computação de alto desempenho.",
    B:"O tipo spread separa em hardware distinto para reduzir falha correlacionada, aumentando a distância.",
    C:"O tipo partição isola blocos de hardware para sistemas distribuídos grandes, sem otimizar latência entre todos.",
    D:"Zonas diferentes acrescentam latência entre os nós, o oposto do pedido."
  },
  src:[{t:"AWS: grupos de posicionamento",u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html"}]
},
{
  id:"saa-d3-07", exam:"saa", dom:"d3", lvl:5, type:"single", sec:105, tags:["banco-cache"],
  case:"Uma aplicação de jogo precisa de leituras em microssegundos sobre uma tabela do DynamoDB, sem reescrever a lógica de acesso a dados.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Amazon DynamoDB Accelerator (DAX)"},
    {k:"B",t:"ElastiCache Memcached na frente, com a aplicação gerenciando o cache"},
    {k:"C",t:"Índice secundário global na tabela"},
    {k:"D",t:"Migrar a tabela para o modo sob demanda"}
  ],
  ans:["A"],
  why:{
    ok:"O DAX é cache em memória compatível com a própria API do DynamoDB: entrega microssegundos sem mudar a lógica de acesso, que é o requisito explícito.",
    B:"Funciona e exige que a aplicação passe a gerenciar leitura, gravação e invalidação do cache, ou seja, reescrita.",
    C:"Índice secundário muda padrões de consulta, não a latência de uma leitura por chave.",
    D:"O modo sob demanda muda a cobrança e a elasticidade, não a latência."
  },
  src:[{t:"AWS: DynamoDB Accelerator",u:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html"}]
},
{
  id:"saa-d3-08", exam:"saa", dom:"d3", lvl:4, type:"yn", sec:115, tags:["computacao-armazenamento","banco-cache"],
  stem:"Responda Sim ou Não para cada afirmação sobre desempenho.",
  rows:[
    {t:"Um volume EBS pode ser anexado a instâncias em zonas de disponibilidade diferentes.", a:false,
     e:"O volume vive em uma zona; para compartilhar entre zonas o caminho é EFS ou S3."},
    {t:"Leituras em uma réplica de leitura podem devolver dados desatualizados logo após uma escrita.", a:true,
     e:"A replicação é assíncrona: se o requisito é leitura consistente, a réplica não serve."},
    {t:"O conteúdo do armazenamento de instância sobrevive à parada da instância.", a:false,
     e:"Ele é efêmero, e é essa a contrapartida do seu desempenho."},
    {t:"O FSx for Lustre é indicado para cargas de computação intensiva que leem dados do S3.", a:true,
     e:"Ele integra com o S3 e entrega o desempenho de sistema de arquivos paralelo esperado em HPC."}
  ],
  src:[{t:"AWS: volumes EBS",u:"https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html"}]
},
{
  id:"saa-d3-09", exam:"saa", dom:"d3", lvl:5, type:"single", sec:100, tags:["computacao-armazenamento"],
  case:"Um processamento é disparado sempre que um arquivo chega em um bucket, dura cerca de 20 segundos e acontece algumas centenas de vezes por dia, em horários irregulares.",
  stem:"Qual opção de computação tem o menor custo e o menor esforço operacional?",
  opts:[
    {k:"A",t:"Função Lambda acionada por evento do S3"},
    {k:"B",t:"Instância EC2 pequena ligada o tempo todo, consultando o bucket"},
    {k:"C",t:"Tarefa do ECS em Fargate, executada por agendamento a cada minuto"},
    {k:"D",t:"Grupo de dimensionamento com mínimo 1, acionado por métrica do bucket"}
  ],
  ans:["A"],
  why:{
    ok:"Evento discreto, execução curta e volume irregular é a definição do caso de uso da Lambda: paga-se por invocação e não há servidor para manter.",
    B:"Instância ligada o tempo todo paga as 24 horas para trabalhar poucos minutos, e ainda precisa de consulta periódica.",
    C:"Agendamento a cada minuto gera execução ociosa e acrescenta latência de até um minuto ao processamento.",
    D:"Mantém no mínimo uma instância sempre ligada, pelo mesmo desperdício da alternativa B."
  },
  src:[{t:"AWS: notificações de evento do S3",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/NotificationHowTo.html"}]
},
{
  id:"saa-d3-10", exam:"saa", dom:"d3", lvl:5, type:"order", sec:90, tags:["banco-cache"],
  stem:"Uma API de leitura está lenta. Ordene as intervenções da que costuma dar MAIOR ganho por esforço para a de MENOR.",
  items:[
    {t:"Cache do resultado repetido, em memória ou na borda"},
    {t:"Réplica de leitura para separar carga analítica da transacional"},
    {t:"Índice adequado para o padrão de consulta"},
    {t:"Instância de banco de dados de classe maior"}
  ],
  e:"Cache elimina a chamada inteira quando a mesma leitura se repete, então costuma entregar o maior ganho pelo menor esforço. Réplica tira uma classe de carga do nó de escrita. Índice acelera a consulta específica, mas exige entender o padrão de acesso e tem custo de escrita. Aumentar a instância é a última, porque é a mais cara, não elimina trabalho e apenas adia o limite. Esta ordem é a lógica por trás da maioria das questões de desempenho.",
  src:[{t:"AWS: estratégias de cache",u:"https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"}]
},
/* ---------------- D4 custo ---------------- */
{
  id:"saa-d4-01", exam:"saa", dom:"d4", lvl:5, type:"single", sec:105, tags:["custo-computacao"],
  case:"Uma empresa roda 20 instâncias com carga constante o ano todo e, à noite, um processamento de vídeo que pode recomeçar do zero e leva de duas a cinco horas.",
  stem:"Qual combinação de modelos de compra tem o menor custo?",
  opts:[
    {k:"A",t:"Savings Plans para a base e Spot para o processamento noturno"},
    {k:"B",t:"Sob demanda para a base e Spot para o processamento noturno"},
    {k:"C",t:"Savings Plans para a base e sob demanda para o processamento noturno"},
    {k:"D",t:"Spot para tudo"}
  ],
  ans:["A"],
  why:{
    ok:"A base constante justifica o compromisso do Savings Plans, e o processamento noturno é tolerante a interrupção por definição, que é o pré-requisito do Spot. Cada carga recebe o modelo desenhado para ela.",
    B:"Deixa na mesa o desconto da base constante, que é a maior parte do gasto.",
    C:"Paga preço cheio em uma carga que tolera interrupção.",
    D:"Spot na base de produção significa aceitar retomada com dois minutos de aviso em carga que o enunciado descreve como constante."
  },
  src:[{t:"AWS: opções de compra do EC2",u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html"}]
},
{
  id:"saa-d4-02", exam:"saa", dom:"d4", lvl:4, type:"single", sec:95, tags:["custo-armazenamento"],
  case:"Um bucket recebe arquivos cujo padrão de acesso é desconhecido e varia muito de um arquivo para outro.",
  stem:"Qual classe de armazenamento é a mais indicada?",
  opts:[
    {k:"A",t:"S3 Intelligent-Tiering"},
    {k:"B",t:"S3 Standard-IA"},
    {k:"C",t:"S3 One Zone-IA"},
    {k:"D",t:"S3 Glacier Flexible Retrieval"}
  ],
  ans:["A"],
  why:{
    ok:"O Intelligent-Tiering move o objeto entre camadas conforme o acesso real, cobrando apenas uma pequena taxa de monitoramento e sem taxa de recuperação. É a resposta sempre que o padrão é desconhecido.",
    B:"Standard-IA pressupõe acesso raro e cobra recuperação: para um arquivo que acaba sendo muito lido, sai mais caro.",
    C:"One Zone-IA acrescenta risco de perda em falha de zona, sem relação com o problema descrito.",
    D:"Glacier impõe espera na recuperação a arquivos que podem precisar de acesso imediato."
  },
  src:[{t:"AWS: S3 Intelligent-Tiering",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"}]
},
{
  id:"saa-d4-03", exam:"saa", dom:"d4", lvl:5, type:"single", sec:110, tags:["custo-armazenamento"],
  case:"Registros de auditoria precisam ser guardados por sete anos, praticamente nunca são lidos e, quando são, pode-se esperar até 12 horas.",
  stem:"Qual classe atende com o menor custo?",
  opts:[
    {k:"A",t:"S3 Glacier Deep Archive"},
    {k:"B",t:"S3 Glacier Instant Retrieval"},
    {k:"C",t:"S3 Standard-IA"},
    {k:"D",t:"S3 One Zone-IA"}
  ],
  ans:["A"],
  why:{
    ok:"Deep Archive é a classe de menor custo por gigabyte e sua recuperação em até 12 horas é exatamente o que o enunciado aceita. A permanência mínima de 180 dias é irrelevante diante de sete anos.",
    B:"Instant Retrieval custa mais por entregar em milissegundos, que o enunciado não exige.",
    C:"Standard-IA é bem mais cara para retenção longa sem leitura.",
    D:"One Zone-IA é mais cara que Deep Archive e ainda acrescenta risco de zona única a um dado de auditoria."
  },
  src:[{t:"AWS: classes de armazenamento do S3",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"}]
},
{
  id:"saa-d4-04", exam:"saa", dom:"d4", lvl:4, type:"multi", sec:110, tags:["custo-computacao"],
  stem:"Quais ações reduzem custo sem exigir compromisso de prazo com a AWS? Escolha as DUAS.",
  opts:[
    {k:"A",t:"Desligar ambientes de desenvolvimento fora do horário comercial"},
    {k:"B",t:"Liberar endereços IP elásticos que não estão associados a nenhum recurso"},
    {k:"C",t:"Comprar instâncias reservadas de três anos"},
    {k:"D",t:"Assinar um Savings Plans de computação de um ano"},
    {k:"E",t:"Migrar as cargas para instâncias Spot de produção crítica"}
  ],
  ans:["A","B"],
  why:{
    ok:"Desligar o que não é usado e liberar recursos ociosos cortam a fatura imediatamente, sem assinar nada. Endereço elástico não associado é cobrado por hora justamente para desencorajar o desperdício.",
    C:"Reserva é compromisso de prazo, que o enunciado exclui.",
    D:"Savings Plans também é compromisso de prazo.",
    E:"Spot em produção crítica troca custo por risco de interrupção, o que o enunciado não autoriza."
  },
  src:[{t:"AWS: otimização de custos",u:"https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html"}]
},
{
  id:"saa-d4-05", exam:"saa", dom:"d4", lvl:5, type:"single", sec:100, tags:["custo-computacao"],
  case:"A equipe quer desconto sobre uma base estável de computação, mas prevê trocar de família de instância ao longo do próximo ano, conforme a aplicação evolui.",
  stem:"Qual opção de compra atende?",
  opts:[
    {k:"A",t:"Savings Plans de computação"},
    {k:"B",t:"Instância reservada padrão de três anos"},
    {k:"C",t:"Instância reservada zonal, para garantir capacidade"},
    {k:"D",t:"Frota de Spot com estratégia de capacidade otimizada"}
  ],
  ans:["A"],
  why:{
    ok:"O Savings Plans de computação compromete um valor por hora e permite trocar de família, de tamanho, de sistema operacional e até de região, que é exatamente a flexibilidade pedida.",
    B:"A reserva padrão amarra a configuração; trocar de família exigiria vender ou trocar a reserva.",
    C:"A reserva zonal é ainda mais específica, pois prende também a zona.",
    D:"Spot não é adequado para base estável de produção e não oferece desconto garantido."
  },
  src:[{t:"AWS: Savings Plans",u:"https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html"}]
},
{
  id:"saa-d4-06", exam:"saa", dom:"d4", lvl:4, type:"single", sec:95, tags:["custo-armazenamento"],
  case:"A empresa quer ser avisada antes que o gasto do mês ultrapasse um valor definido, e também quer saber qual serviço mais consumiu no trimestre.",
  stem:"Qual combinação de ferramentas atende?",
  opts:[
    {k:"A",t:"AWS Budgets para o alerta e Cost Explorer para a análise"},
    {k:"B",t:"Cost Explorer para o alerta e Trusted Advisor para a análise"},
    {k:"C",t:"CloudWatch para o alerta e Compute Optimizer para a análise"},
    {k:"D",t:"Trusted Advisor para o alerta e Budgets para a análise"}
  ],
  ans:["A"],
  why:{
    ok:"O Budgets dispara alerta por valor real ou previsto, e o Cost Explorer é a ferramenta de análise histórica por serviço, conta e marca.",
    B:"O Cost Explorer analisa e não alerta; o Trusted Advisor aponta boas práticas, não a distribuição do gasto.",
    C:"O CloudWatch alerta sobre métricas e exige configuração adicional para custo; o Compute Optimizer trata de dimensionamento de recurso.",
    D:"Inverte os papéis das duas ferramentas."
  },
  src:[{t:"AWS Budgets",u:"https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html"}]
},
{
  id:"saa-d4-07", exam:"saa", dom:"d4", lvl:5, type:"single", sec:110, tags:["custo-armazenamento"],
  case:"Miniaturas geradas a partir de imagens originais são lidas constantemente e podem ser recriadas a qualquer momento. As originais ficam em outro prefixo e quase não são lidas após 30 dias.",
  stem:"Qual configuração tem o menor custo sem prejudicar o acesso?",
  opts:[
    {k:"A",t:"Miniaturas em S3 Standard e originais com ciclo de vida para Standard-IA após 30 dias"},
    {k:"B",t:"Miniaturas em One Zone-IA e originais em S3 Standard"},
    {k:"C",t:"Tudo em S3 Intelligent-Tiering, sem regra de ciclo de vida"},
    {k:"D",t:"Tudo em Glacier Instant Retrieval"}
  ],
  ans:["A"],
  why:{
    ok:"O acesso constante das miniaturas pede Standard, e o padrão conhecido das originais é exatamente o caso em que uma regra de ciclo de vida sai mais barata que o monitoramento automático.",
    B:"One Zone-IA cobra taxa de recuperação e é desenhada para acesso raro: aplicada a objeto lido o tempo todo, sai mais cara, e o argumento de recriável não compensa isso.",
    C:"Funciona e paga taxa de monitoramento por objeto para descobrir um padrão que o enunciado já informa.",
    D:"Penaliza a leitura constante das miniaturas com custo de recuperação alto."
  },
  src:[{t:"AWS: gerenciamento de ciclo de vida",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html"}]
},
{
  id:"saa-d4-08", exam:"saa", dom:"d4", lvl:4, type:"yn", sec:115, tags:["custo-armazenamento"],
  stem:"Responda Sim ou Não para cada afirmação sobre custo de tráfego.",
  rows:[
    {t:"A entrada de dados para a AWS vinda da internet é cobrada por gigabyte.", a:false,
     e:"A entrada não é cobrada; o custo está na saída."},
    {t:"Tráfego entre instâncias em zonas de disponibilidade diferentes, na mesma região, é cobrado.", a:true,
     e:"É cobrado nos dois sentidos, e é por isso que o desenho de alta disponibilidade tem custo de tráfego próprio."},
    {t:"Um ponto de extremidade de gateway para o S3 cobra por hora e por gigabyte processado.", a:false,
     e:"O de gateway não tem custo; quem cobra por hora e por tráfego é o de interface."},
    {t:"Servir conteúdo pelo CloudFront costuma ter custo de saída menor que servir direto da região.", a:true,
     e:"A saída pela rede de borda tem preço menor por gigabyte, além de reduzir a carga na origem."}
  ],
  src:[{t:"AWS: preços de transferência de dados",u:"https://aws.amazon.com/ec2/pricing/on-demand/"}]
}
];
const QUESTIONS_SAA = QUESTIONS_SAA_A.concat(QUESTIONS_SAA_B);
