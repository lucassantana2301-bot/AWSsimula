/* ============================================================
   FICHAS DE ESTUDO — AWS (SAA-C03) — domínios 3 e 4
   Desempenho e custo.
   ============================================================ */
const FICHAS_SAA_B = [
{
  id:"f-saa-compute-store", exam:"saa", dom:"d3", mins:7, concept:"computacao-armazenamento",
  title:"Qual computação e qual armazenamento",
  lead:"O domínio de desempenho é uma sequência de escolhas entre opções que funcionam. A certa é a que atende ao padrão de acesso descrito, com o menor esforço operacional.",
  blocks:[
    {t:"h", x:"Computação"},
    {t:"table", head:["Opção","Escolha quando","Cuidado"], rows:[
      ["EC2","Precisa do sistema operacional, software legado, licença própria","Você administra patch, escala e imagem"],
      ["Lambda","Evento, pico irregular, nada parado","Tempo máximo de execução e partida a frio"],
      ["Fargate","Contêiner sem administrar nó","Menos controle fino que o ECS ou EKS em EC2"],
      ["ECS ou EKS em EC2","Precisa de tipo de instância específico ou GPU","Você administra a frota de nós"]
    ]},
    {t:"p", x:"Enunciado com processamento curto disparado por upload no S3 ou por mensagem é Lambda. Enunciado com processo que roda por horas, ou que precisa de agente instalado, não cabe em Lambda e vai para contêiner ou EC2."},
    {t:"h", x:"Armazenamento de bloco e de arquivo"},
    {t:"table", head:["Serviço","Natureza","Use quando"], rows:[
      ["EBS","Bloco, uma zona, anexado a uma instância","Disco de sistema e de banco de dados"],
      ["Armazenamento de instância","Bloco local, efêmero","Cache e scratch de altíssimo desempenho"],
      ["EFS","Arquivo NFS, em várias zonas","Muitas instâncias Linux lendo e gravando o mesmo diretório"],
      ["FSx for Windows","Arquivo SMB","Compartilhamento Windows com Active Directory"],
      ["FSx for Lustre","Arquivo de alto desempenho","Computação intensiva lendo direto do S3"],
      ["S3","Objeto","Qualquer coisa acessada por chave e por HTTP"]
    ]},
    {t:"p", x:"Volume EBS vive em uma zona de disponibilidade e não atravessa zona. Quando o enunciado fala em compartilhar o mesmo conteúdo entre instâncias de zonas diferentes, EBS está eliminado e a resposta é EFS, ou S3 se o acesso for por chave."},
    {t:"h", x:"Tipos de volume EBS"},
    {t:"table", head:["Tipo","Perfil","Pista no enunciado"], rows:[
      ["gp3","Uso geral, desempenho configurado à parte do tamanho","Padrão de hoje, melhor custo"],
      ["gp2","Uso geral antigo, desempenho atrelado ao tamanho","Migração para gp3 reduz custo"],
      ["io2","Provisionado, altíssimo e durável","Banco crítico com exigência de operações por segundo"],
      ["st1","Vazão em disco rígido","Leitura sequencial grande, log e dado bruto"],
      ["sc1","Disco rígido frio","Acesso raro, menor custo por gigabyte"]
    ]},
    {t:"p", x:"Em gp2 o desempenho cresce com o tamanho do volume, o que levava a inflar o disco só para ganhar velocidade. Em gp3 vazão e operações por segundo se configuram separadamente, então a resposta de redução de custo com desempenho igual costuma ser migrar de gp2 para gp3."},
    {t:"h", x:"Grupos de posicionamento"},
    {t:"table", head:["Tipo","Faz","Para"], rows:[
      ["Cluster","Junta as instâncias no mesmo ponto da rede","Latência mínima entre nós, computação de alto desempenho"],
      ["Spread","Separa em hardware distinto","Poucas instâncias críticas que não podem cair juntas"],
      ["Partição","Separa em blocos de hardware","Sistema distribuído grande, como HDFS e Cassandra"]
    ]},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Processa arquivo assim que ele chega no bucket","Lambda disparada por evento do S3"],
      ["Várias instâncias precisam do mesmo diretório","EFS"],
      ["Compartilhamento Windows com domínio","FSx for Windows"],
      ["Banco exige operações por segundo garantidas","io2"],
      ["Mesmo desempenho, menos custo no disco","Migrar de gp2 para gp3"],
      ["Nós precisam de latência mínima entre si","Grupo de posicionamento do tipo cluster"],
      ["Contêiner sem administrar servidor","Fargate"],
      ["Processo roda por três horas","Não cabe em Lambda; contêiner ou EC2"]
    ]},
    {t:"trap", x:"O armazenamento de instância some quando a instância para, e isso não é defeito: é a razão de ele ser rápido e barato. Alternativa que propõe guardar dado persistente ali está errada, mesmo quando o requisito de desempenho combina."},
    {t:"case", q:"Uma frota de instâncias Linux em três zonas precisa ler e gravar no mesmo conjunto de arquivos, com milhares de arquivos pequenos e acesso simultâneo. Qual armazenamento?",
      a:"EFS, que é o único da lista que entrega semântica de sistema de arquivos com acesso simultâneo de várias zonas. EBS não atravessa zona nem aceita montagem múltipla fora de casos específicos; S3 serviria se o acesso fosse por chave, mas o enunciado descreve leitura e gravação em arquivos, que é justamente onde objeto não se encaixa."}
  ],
  check:["Dizer quando Lambda está eliminada pelo enunciado","Explicar por que EBS não resolve compartilhamento entre zonas","Lembrar o que muda de gp2 para gp3"],
  src:[{t:"AWS: tipos de volume EBS", u:"https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"},
       {t:"AWS: Amazon EFS", u:"https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html"}]
},
{
  id:"f-saa-banco-cache", exam:"saa", dom:"d3", mins:7, concept:"banco-cache",
  title:"Banco de dados, cache e entrega na borda",
  lead:"Quando o enunciado diz que algo está lento, a resposta quase nunca é uma instância maior. É tirar a leitura do caminho crítico: réplica, cache ou borda.",
  blocks:[
    {t:"h", x:"Qual banco"},
    {t:"table", head:["Serviço","Modelo","Pista no enunciado"], rows:[
      ["RDS","Relacional gerenciado","Precisa de SQL, junção, transação, motor conhecido"],
      ["Aurora","Relacional compatível com MySQL e PostgreSQL","Mesmo caso, com mais desempenho e resiliência"],
      ["DynamoDB","Chave e valor, documento","Latência de milissegundo em qualquer escala, sem administrar servidor"],
      ["ElastiCache","Cache em memória","Repetir leitura cara, sessão, placar"],
      ["Redshift","Armazém analítico","Consulta sobre volume histórico grande"],
      ["Neptune","Grafo","Relacionamento entre entidades, recomendação"]
    ]},
    {t:"p", x:"DynamoDB aparece quando o enunciado diz escala imprevisível, acesso por chave e nenhuma administração. Modo sob demanda cobra por requisição e absorve pico sem planejamento; modo provisionado sai mais barato quando a carga é estável e previsível. O DAX acrescenta cache em memória e derruba a leitura para microssegundos sem mudar o código."},
    {t:"h", x:"Os dois mecanismos do ElastiCache"},
    {t:"table", head:["","Redis","Memcached"], rows:[
      ["Persistência e réplica","Sim","Não"],
      ["Estruturas de dados","Listas, conjuntos, conjuntos ordenados","Só chave e valor"],
      ["Multithread","Não, no modelo clássico","Sim"],
      ["Escolha quando","Precisa sobreviver a reinício, placar, pub e sub","Cache simples que pode ser perdido"]
    ]},
    {t:"h", x:"Na borda"},
    {t:"table", head:["Serviço","Trabalha em","Serve para"], rows:[
      ["CloudFront","HTTP e HTTPS, cache na borda","Conteúdo estático e dinâmico perto do usuário"],
      ["Global Accelerator","Qualquer TCP e UDP, sem cache","Endereço estático global e caminho otimizado"],
      ["Route 53","DNS","Escolher para qual região mandar o usuário"]
    ]},
    {t:"p", x:"Para servir um site estático do S3 sem expor o bucket, a combinação é CloudFront com controle de acesso de origem: o bucket fica fechado e só a distribuição consegue ler. Qualquer alternativa que torne o bucket público para isso está errada."},
    {t:"h", x:"Conexão e Lambda"},
    {t:"p", x:"Lambda abrindo conexão direta com RDS esgota o limite de conexões em pico. A resposta é o RDS Proxy, que mantém um reservatório de conexões e ainda melhora a falha automática. Esse par é cobrado com frequência."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Relatório pesado derruba o banco","Réplica de leitura"],
      ["A mesma consulta cara se repete o tempo todo","ElastiCache na frente"],
      ["Sessão de usuário precisa sobreviver à troca de instância","ElastiCache Redis ou DynamoDB"],
      ["Latência de milissegundo em escala imprevisível","DynamoDB sob demanda"],
      ["Quer microssegundo sem mudar o código","DAX na frente do DynamoDB"],
      ["Usuários distantes reclamam de lentidão no site","CloudFront"],
      ["Protocolo UDP precisa de entrada global","Global Accelerator"],
      ["Lambda esgota as conexões do RDS","RDS Proxy"],
      ["Site estático no S3 sem bucket público","CloudFront com controle de acesso de origem"]
    ]},
    {t:"trap", x:"Cache não conserta consulta errada e introduz o problema da invalidação: o enunciado que fala de dado que precisa estar sempre atualizado está afastando a resposta de cache. Da mesma forma, réplica de leitura é assíncrona, então leitura logo após a escrita pode vir velha; se o requisito é leitura consistente, ela não serve."},
    {t:"case", q:"Uma API de catálogo responde em 900 ms. O perfil mostra que 80% do tempo é a mesma consulta de listagem, que muda uma vez por hora, e os usuários estão espalhados pelo mundo. O que fazer, em ordem?",
      a:"Primeiro ElastiCache na frente da consulta de listagem, porque ela é repetida e tolera uma hora de defasagem, o que elimina a maior parte dos 900 ms. Depois CloudFront, para que o usuário distante não pague a viagem até a região a cada chamada. Aumentar a instância do banco atacaria os 20% restantes com o maior custo e o menor ganho."}
  ],
  check:["Dizer quando cache é a resposta errada","Separar Redis de Memcached por um requisito","Lembrar o par Lambda e RDS Proxy"],
  src:[{t:"AWS: Amazon ElastiCache", u:"https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html"},
       {t:"AWS: restringir acesso à origem no CloudFront", u:"https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html"}]
},
{
  id:"f-saa-s3-custo", exam:"saa", dom:"d4", mins:7, concept:"custo-armazenamento",
  title:"Custo de armazenamento e de tráfego",
  lead:"O domínio de custo tem duas fontes de questão: a classe errada no S3 e o tráfego que ninguém viu. As duas se resolvem com tabela decorada.",
  blocks:[
    {t:"h", x:"Classes do S3"},
    {t:"table", head:["Classe","Recuperação","Permanência mínima","Use quando"], rows:[
      ["Standard","Imediata","Nenhuma","Acesso frequente"],
      ["Intelligent-Tiering","Imediata","Nenhuma","Padrão de acesso desconhecido ou que muda"],
      ["Standard-IA","Imediata, com taxa","30 dias","Acesso raro, precisa na hora"],
      ["One Zone-IA","Imediata, com taxa","30 dias","Acesso raro e recriável; uma zona só"],
      ["Glacier Instant Retrieval","Milissegundos","90 dias","Arquivo acessado trimestralmente"],
      ["Glacier Flexible Retrieval","Minutos a horas","90 dias","Arquivo raro, pode esperar"],
      ["Glacier Deep Archive","Até 12 horas","180 dias","Retenção longa, quase nunca lido"]
    ]},
    {t:"p", x:"Intelligent-Tiering é a resposta sempre que o enunciado diz que o padrão de acesso é desconhecido ou imprevisível: ele move o objeto entre camadas sozinho, cobrando uma pequena taxa de monitoramento, e não cobra recuperação. Quando o padrão É conhecido, uma regra de ciclo de vida sai mais barata."},
    {t:"p", x:"One Zone-IA guarda em uma única zona de disponibilidade. Ela é a resposta quando o dado pode ser recriado, como miniatura gerada a partir do original, e é a resposta errada para qualquer coisa que não possa ser perdida."},
    {t:"h", x:"Onde o tráfego cobra"},
    {t:"table", head:["Trajeto","Cobrança"], rows:[
      ["Entrada na AWS","Sem custo"],
      ["Entre instâncias na mesma zona, por endereço privado","Sem custo"],
      ["Entre zonas da mesma região","Cobrado nos dois sentidos"],
      ["Para a internet","Cobrado, com faixas decrescentes"],
      ["Saída pelo CloudFront","Mais barata que a saída direta"],
      ["Por ponto de extremidade de gateway para S3","Sem custo"],
      ["Por gateway NAT","Por hora mais por gigabyte processado"]
    ]},
    {t:"p", x:"A conta surpresa mais comum da prova é instância privada baixando muitos dados do S3 através do gateway NAT: paga-se o processamento do NAT sem necessidade. Trocar por ponto de extremidade de gateway zera essa linha da fatura e ainda tira o tráfego da internet."},
    {t:"h", x:"Ferramentas"},
    {t:"table", head:["Ferramenta","Responde"], rows:[
      ["Cost Explorer","Para onde foi o dinheiro, por serviço e por marca"],
      ["Budgets","Avisar quando passar de um valor ou de uma previsão"],
      ["Compute Optimizer","Qual instância está grande demais para a carga"],
      ["Trusted Advisor","O que está ocioso, inseguro ou fora da boa prática"],
      ["S3 Storage Lens","Como os objetos estão distribuídos entre classes"]
    ]},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Padrão de acesso imprevisível","Intelligent-Tiering"],
      ["Dado recriável, acesso raro, menor custo","One Zone-IA"],
      ["Retenção de sete anos, quase nunca lido","Glacier Deep Archive"],
      ["Arquivo raro mas que precisa vir em milissegundos","Glacier Instant Retrieval"],
      ["Instância privada baixa muito do S3","Ponto de extremidade de gateway"],
      ["Avisar antes de estourar o orçamento","Budgets"],
      ["Descobrir instância superdimensionada","Compute Optimizer"],
      ["Reduzir custo de saída para usuários finais","CloudFront na frente"]
    ]},
    {t:"trap", x:"Mover para Glacier algo que será lido no mês seguinte sai mais caro que deixar em Standard, por causa da permanência mínima e da taxa de recuperação. A classe mais barata por gigabyte não é a mais barata no total: o cálculo tem três parcelas, guardar, recuperar e as requisições."},
    {t:"case", q:"Um bucket guarda 40 TB de imagens originais, lidas muito no primeiro mês e quase nunca depois, e 12 TB de miniaturas geradas a partir delas, lidas o tempo todo. Qual configuração de menor custo?",
      a:"Originais com regra de ciclo de vida: Standard por 30 dias, depois Standard-IA e, a partir de 90 dias, Glacier Instant Retrieval se ainda houver leitura ocasional, ou Flexible Retrieval se puder esperar. Miniaturas em One Zone-IA não serve, porque são lidas o tempo todo: elas ficam em Standard, e o argumento de recriável só valeria se o acesso fosse raro. Se o padrão das originais fosse desconhecido, Intelligent-Tiering substituiria toda a regra."}
  ],
  check:["Recitar as permanências mínimas das classes de acesso infrequente e de arquivo","Dizer quando Intelligent-Tiering ganha de uma regra de ciclo de vida","Apontar o trajeto de tráfego que mais gera conta surpresa"],
  src:[{t:"AWS: classes de armazenamento do S3", u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"},
       {t:"AWS: pontos de extremidade de gateway", u:"https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"}]
},
{
  id:"f-saa-compute-custo", exam:"saa", dom:"d4", mins:6, concept:"custo-computacao",
  title:"Os modelos de compra do EC2",
  lead:"Quatro formas de pagar a mesma instância, com diferença de até noventa por cento. A prova descreve o perfil da carga e espera o modelo certo.",
  blocks:[
    {t:"h", x:"A tabela"},
    {t:"table", head:["Modelo","Desconto","Compromisso","Perfil da carga"], rows:[
      ["Sob demanda","Nenhum","Nenhum","Imprevisível, curta, primeiro teste"],
      ["Savings Plans","Até cerca de 72%","Valor por hora, por 1 ou 3 anos","Base estável, com liberdade de mudar de família"],
      ["Instância reservada","Até cerca de 72%","Configuração específica, por 1 ou 3 anos","Base estável e previsível, sem mudar de tipo"],
      ["Spot","Até cerca de 90%","Nenhum, mas pode ser retomada","Tolerante a interrupção: lote, renderização, teste"]
    ]},
    {t:"p", x:"Spot avisa a retomada com dois minutos de antecedência. Isso define quem pode usar: processamento em lote com ponto de verificação, consumidor de fila, nó de trabalho de cluster. Banco de dados, nó com estado e qualquer coisa que não possa sumir no meio ficam de fora."},
    {t:"p", x:"Entre Savings Plans e instância reservada, o compromisso é diferente: o plano amarra um valor por hora e deixa você trocar de família, tamanho e até de região; a reserva amarra a configuração. Enunciado que fala em flexibilidade para mudar de tipo pede Savings Plans; enunciado que fala em reservar capacidade em uma zona pede instância reservada zonal."},
    {t:"h", x:"Hospedagem dedicada"},
    {t:"table", head:["Opção","Para"], rows:[
      ["Instância dedicada","Hardware não compartilhado com outra conta"],
      ["Host dedicado","Mesmo isolamento, com visibilidade do servidor físico, exigida por licença por soquete ou por núcleo"]
    ]},
    {t:"h", x:"Reduzir sem trocar o modelo"},
    {t:"p", x:"Antes de comprometer, três movimentos costumam estar na resposta: ajustar o tamanho da instância à carga real, desligar ambiente de não produção fora do horário e apagar o que está parado, como volumes órfãos, endereços IP elásticos não associados e imagens antigas. Endereço IP elástico não associado cobra por hora justamente para desencorajar o desperdício."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Processamento em lote que pode recomeçar","Spot"],
      ["Carga base constante por três anos","Savings Plans ou reserva"],
      ["Quer desconto mas pode trocar de família","Savings Plans de computação"],
      ["Licença exige contar soquete físico","Host dedicado"],
      ["Ambiente de teste ligado 24 horas","Agendar desligamento fora do horário"],
      ["Fatura com endereço IP sem uso","Liberar o endereço elástico"],
      ["Não sabe se a carga vai continuar","Sob demanda, sem compromisso"]
    ]},
    {t:"trap", x:"Spot é descartado pelo enunciado quando aparece a palavra crítico, com estado ou sem interrupção. Mas cuidado com o inverso: enunciado com fila de trabalho e ponto de verificação está pedindo Spot, e a alternativa com sob demanda, apesar de funcionar, perde por custo. A pergunta é sempre o mais barato que atende."},
    {t:"case", q:"Uma empresa roda, o ano todo, 20 instâncias de aplicação com carga constante e, à noite, um processamento de vídeo que pode recomeçar do zero e leva de duas a cinco horas. Qual combinação?",
      a:"Savings Plans de computação cobrindo a base das 20 instâncias, pela previsibilidade e pela liberdade de trocar de família se a aplicação mudar, e Spot para o processamento noturno, que tolera interrupção por definição. Reserva também cobriria a base, com menos flexibilidade; usar sob demanda nos dois casos é a resposta que funciona e perde na conta."}
  ],
  check:["Dizer o que elimina Spot de um cenário","Separar Savings Plans de instância reservada pelo tipo de compromisso","Listar três reduções de custo que não exigem compromisso"],
  src:[{t:"AWS: opções de compra do EC2", u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html"},
       {t:"AWS: Savings Plans", u:"https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html"}]
}
];
const FICHAS = FICHAS_AZ.concat(FICHAS_AZ104, FICHAS_AZ104B, FICHAS_AWS, FICHAS_SAA, FICHAS_SAA_B);
