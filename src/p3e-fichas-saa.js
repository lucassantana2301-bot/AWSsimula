/* ============================================================
   FICHAS DE ESTUDO — AWS (SAA-C03, Solutions Architect Associate)
   Domínios 1 e 2: segurança e resiliência.
   Escrito a partir dos objetivos públicos do exam guide.
   ============================================================ */
const FICHAS_SAA = [
{
  id:"f-saa-iam", exam:"saa", dom:"d1", mins:7, concept:"iam-permissoes",
  title:"IAM: função em vez de chave, e a ordem da avaliação",
  lead:"O domínio de segurança é o mais pesado da prova, e metade dele cabe em duas ideias: aplicação na AWS nunca carrega chave de acesso, e negação explícita vence tudo.",
  blocks:[
    {t:"h", x:"As quatro peças"},
    {t:"table", head:["Peça","O que é","Quando usar"], rows:[
      ["Usuário","Identidade permanente com senha ou chave","Pessoa que entra no console; evite para aplicação"],
      ["Grupo","Coleção de usuários","Aplicar a mesma política a muita gente"],
      ["Função","Identidade sem credencial fixa, que se assume","Aplicação, serviço, acesso entre contas, federação"],
      ["Política","Documento JSON que permite ou nega ações","Anexada a identidade ou ao próprio recurso"]
    ]},
    {t:"p", x:"Uma instância EC2 que precisa ler um bucket recebe uma função por meio do perfil de instância. A credencial é temporária, rotacionada pela plataforma, e não existe nada para vazar em arquivo de configuração. Qualquer alternativa que fale em gravar chave de acesso na instância, na imagem ou na variável de ambiente está errada por construção."},
    {t:"h", x:"A ordem da avaliação"},
    {t:"table", head:["Passo","Resultado"], rows:[
      ["Existe negação explícita em alguma política aplicável","Nega, e a avaliação termina"],
      ["Existe permissão explícita","Permite"],
      ["Não há nada dizendo nada","Nega por padrão"]
    ]},
    {t:"p", x:"Política de controle de serviço, aplicada pelo Organizations a uma conta ou unidade organizacional, define o teto do que pode ser permitido naquela conta. Ela não concede nada: mesmo com Administrador na conta, o que a política de controle não deixa passar não acontece. Limite de permissões faz o mesmo papel para um usuário ou função específica."},
    {t:"h", x:"Entre contas e para pessoas"},
    {t:"p", x:"Acesso entre contas se resolve com função assumida: a conta dona do recurso cria a função com uma relação de confiança apontando para a outra conta, e quem precisa chama o serviço de token de segurança para receber credencial temporária. Para funcionários, o caminho é o IAM Identity Center ligado ao diretório corporativo, em vez de criar usuário IAM por pessoa."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Aplicação em EC2 precisa acessar S3","Função com perfil de instância, nunca chave"],
      ["Conta A precisa ler um bucket da conta B","Função assumida, com relação de confiança"],
      ["Nenhuma conta pode usar uma região proibida","Política de controle de serviço no Organizations"],
      ["Funcionários entram com o login corporativo","IAM Identity Center com federação"],
      ["Credencial não pode ser permanente","Serviço de token de segurança, credencial temporária"],
      ["Quem tem Administrador ainda assim não consegue","Política de controle de serviço ou negação explícita"],
      ["Desenvolvedor não pode escalar a própria permissão","Limite de permissões na função dele"]
    ]},
    {t:"trap", x:"Política baseada em recurso e política baseada em identidade somam, não se anulam: para acessar um bucket de outra conta, as duas precisam permitir. Mas basta uma negação explícita em qualquer uma delas para derrubar o acesso inteiro. É por isso que negar na política do bucket é mais forte que conceder na política do usuário."},
    {t:"case", q:"Uma função Lambda precisa ler segredos de banco e gravar em um bucket da mesma conta, e a auditoria exige que a credencial expire. Qual desenho?",
      a:"Função de execução anexada à Lambda, com política que permite somente a ação de leitura daquele segredo e a de escrita naquele prefixo do bucket. A credencial já é temporária por construção, porque a Lambda recebe um token do serviço de token de segurança a cada invocação. Não há chave para rotacionar nem segredo para guardar em variável de ambiente."}
  ],
  check:["Dizer por que uma aplicação na AWS nunca deve carregar chave de acesso","Recitar a ordem da avaliação de política em três linhas","Explicar o que uma política de controle de serviço faz e o que ela não faz"],
  src:[{t:"AWS: lógica de avaliação de políticas", u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html"},
       {t:"AWS: funções para EC2", u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html"}]
},
{
  id:"f-saa-rede-seg", exam:"saa", dom:"d1", mins:7, concept:"vpc-seguranca",
  title:"VPC: grupo de segurança, lista de rede e por onde a sub-rede sai",
  lead:"A dupla grupo de segurança e lista de controle de acesso de rede é a pergunta mais previsível da prova. Uma é com estado, a outra não, e essa única diferença decide a resposta.",
  blocks:[
    {t:"h", x:"A diferença que importa"},
    {t:"table", head:["","Grupo de segurança","Lista de controle de rede"], rows:[
      ["Onde atua","Na interface de rede do recurso","Na sub-rede inteira"],
      ["Guarda estado","Sim: a resposta volta sozinha","Não: precisa de regra de volta"],
      ["Tipos de regra","Só permitir","Permitir e negar"],
      ["Como avalia","Todas as regras somadas","Em ordem de número, a primeira que casa decide"],
      ["Padrão","Nega entrada, permite saída","Permite tudo nos dois sentidos"]
    ]},
    {t:"p", x:"Por não guardar estado, a lista de rede precisa liberar as portas efêmeras, de 1024 a 65535, no sentido do retorno. Enunciado em que a conexão sai mas a resposta não volta, e o grupo de segurança está correto, é quase sempre lista de rede sem a regra de volta."},
    {t:"p", x:"Negar um endereço específico só é possível na lista de rede: grupo de segurança não tem regra de negação. Sempre que o cenário fala em bloquear um atacante por IP, a resposta é lista de rede, ou um firewall de aplicação web na frente."},
    {t:"h", x:"Pública, privada e a saída para a internet"},
    {t:"table", head:["Construção","Serve para"], rows:[
      ["Gateway de internet","Dar à VPC caminho de ida e volta com a internet"],
      ["Sub-rede pública","Sub-rede com rota 0.0.0.0/0 apontando para o gateway de internet"],
      ["Gateway NAT","Deixar a sub-rede privada iniciar conexão de saída, sem aceitar entrada"],
      ["Gateway de saída somente para IPv6","Mesmo papel do NAT, para endereços IPv6"]
    ]},
    {t:"p", x:"O gateway NAT vive em uma zona de disponibilidade. Um só vira ponto único de falha e ainda cobra tráfego atravessando zonas: o desenho resiliente é um por zona, com a tabela de rotas de cada sub-rede apontando para o da própria zona."},
    {t:"h", x:"Chegar a serviços da AWS sem passar pela internet"},
    {t:"table", head:["Tipo de ponto de extremidade","Serve a","Custo"], rows:[
      ["De gateway","S3 e DynamoDB, via tabela de rotas","Sem custo"],
      ["De interface (PrivateLink)","Quase todos os demais, via interface na sub-rede","Por hora e por tráfego"]
    ]},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Bloquear um endereço IP específico","Lista de controle de rede, com regra de negação"],
      ["Conexão sai mas a resposta não volta","Portas efêmeras faltando na lista de rede"],
      ["Instância privada precisa baixar atualização","Gateway NAT na sub-rede pública"],
      ["Tráfego para o S3 não pode sair para a internet","Ponto de extremidade de gateway"],
      ["Acesso privado a um serviço que não é S3 nem DynamoDB","Ponto de extremidade de interface"],
      ["Quer eliminar o custo de NAT no tráfego para o S3","Ponto de extremidade de gateway, sem custo"],
      ["Administrar instância privada sem abrir porta 22","Session Manager, sem bastião"]
    ]},
    {t:"trap", x:"Grupo de segurança pode referenciar outro grupo de segurança como origem. É assim que se diz camada de aplicação fala com camada de banco, sem citar endereço nenhum, e o desenho continua certo quando as instâncias mudam de IP. Alternativa que resolve isso com faixa de endereços funciona e é pior."},
    {t:"case", q:"Um banco de dados em sub-rede privada só pode receber tráfego das instâncias de aplicação, e os administradores precisam de acesso sem expor a porta 22 na internet. Qual configuração?",
      a:"Grupo de segurança do banco permitindo a porta do banco com origem no grupo de segurança da aplicação, e nada mais. Para o acesso administrativo, Session Manager, que usa o agente e as permissões do IAM em vez de porta aberta, dispensando bastião, par de chaves e regra de entrada. A lista de rede pode ficar no padrão, porque toda a restrição necessária está no grupo de segurança."}
  ],
  check:["Dizer qual dos dois guarda estado e o que isso muda na prática","Explicar quando as portas efêmeras entram na conta","Separar ponto de extremidade de gateway do de interface pelo serviço e pelo custo"],
  src:[{t:"AWS: comparar grupos de segurança e listas de rede", u:"https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html"},
       {t:"AWS: pontos de extremidade da VPC", u:"https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html"}]
},
{
  id:"f-saa-cripto", exam:"saa", dom:"d1", mins:6, concept:"criptografia-segredos",
  title:"Chaves, certificados e segredos",
  lead:"Três serviços parecidos que resolvem problemas diferentes. A prova testa se você sabe qual guarda chave, qual guarda senha e qual emite certificado.",
  blocks:[
    {t:"h", x:"Quem faz o quê"},
    {t:"table", head:["Serviço","Guarda","Rotação"], rows:[
      ["KMS","Chaves de criptografia","Automática anual na chave gerenciada pelo cliente"],
      ["CloudHSM","Chaves em hardware dedicado seu","Por sua conta"],
      ["Secrets Manager","Senha, chave de API, credencial de banco","Automática, com função de rotação"],
      ["Parameter Store","Configuração e segredo simples","Não tem rotação nativa"],
      ["Certificate Manager","Certificado TLS público ou privado","Renovação automática do público"]
    ]},
    {t:"p", x:"A escolha entre Secrets Manager e Parameter Store quase sempre cai em duas palavras do enunciado: se pede rotação automática da credencial do banco, é Secrets Manager; se pede guardar configuração com o menor custo possível, é Parameter Store no nível padrão, que não cobra por parâmetro."},
    {t:"p", x:"CloudHSM aparece quando o enunciado exige controle exclusivo do material da chave ou conformidade com módulo de hardware validado em nível alto. Em qualquer outro caso, KMS é a resposta, porque ele integra com os serviços e tem política de chave auditável."},
    {t:"h", x:"Criptografia no S3"},
    {t:"table", head:["Modo","Quem gerencia a chave","Observação"], rows:[
      ["SSE-S3","A AWS, de forma transparente","Padrão aplicado a objeto novo"],
      ["SSE-KMS","Você, no KMS","Dá rastro de uso por chamada e permite negar quem usa a chave"],
      ["SSE-C","Você, enviando a chave na requisição","A AWS não guarda a chave; perdeu, perdeu o dado"]
    ]},
    {t:"p", x:"Quando o requisito é auditar quem descriptografou e poder revogar o acesso ao conteúdo sem mexer no bucket, a resposta é SSE-KMS, porque a política da chave é um segundo portão independente da política do bucket."},
    {t:"h", x:"Em trânsito"},
    {t:"p", x:"Certificado público do Certificate Manager é gratuito e se integra a balanceador de aplicação, CloudFront e API Gateway, com renovação automática. Para o CloudFront, o certificado precisa estar emitido na região da Virgínia do Norte, porque o serviço é global e a distribuição busca ali."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Rotacionar a senha do banco sozinho","Secrets Manager"],
      ["Guardar configuração sem custo por item","Parameter Store, nível padrão"],
      ["Auditar cada uso da chave e poder revogar","SSE-KMS com chave gerenciada pelo cliente"],
      ["Exigência de módulo de hardware dedicado","CloudHSM"],
      ["Certificado TLS gratuito no balanceador","Certificate Manager"],
      ["Certificado para o CloudFront","Certificate Manager na Virgínia do Norte"],
      ["A AWS não pode ter acesso à chave","SSE-C ou CloudHSM, conforme o caso"]
    ]},
    {t:"trap", x:"Habilitar criptografia em repouso não protege contra bucket aberto: são portões diferentes. Objeto criptografado com SSE-S3 em bucket público continua sendo baixado por qualquer pessoa, porque a plataforma descriptografa de forma transparente para quem tem permissão de leitura. Quem fecha o bucket é o bloqueio de acesso público e a política, não a criptografia."},
    {t:"case", q:"Uma empresa precisa provar, em auditoria, quem leu cada arquivo sensível de um bucket, e poder cortar esse acesso em minutos sem alterar a política do bucket. Como fazer?",
      a:"Criptografar com SSE-KMS usando chave gerenciada pelo cliente, e conceder o uso da chave somente às funções que precisam ler. Cada leitura gera uma chamada registrada no CloudTrail, o que entrega o rastro, e remover o principal da política da chave corta o acesso ao conteúdo imediatamente, mesmo que a política do bucket continue permitindo a leitura do objeto."}
  ],
  check:["Separar Secrets Manager de Parameter Store por uma palavra do enunciado","Dizer quando SSE-KMS ganha de SSE-S3","Lembrar a região exigida para certificado do CloudFront"],
  src:[{t:"AWS: conceitos do KMS", u:"https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html"},
       {t:"AWS: criptografia de objetos no S3", u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryption.html"}]
},
{
  id:"f-saa-multiaz", exam:"saa", dom:"d2", mins:7, concept:"alta-disponibilidade",
  title:"Alta disponibilidade: balanceador, dimensionamento e zonas",
  lead:"Resiliência na AWS começa em uma frase: nada importante roda em uma única zona de disponibilidade. O resto é escolher o balanceador certo e deixar o grupo de dimensionamento cuidar do número de instâncias.",
  blocks:[
    {t:"h", x:"Qual balanceador"},
    {t:"table", head:["Balanceador","Camada","Escolha quando"], rows:[
      ["De aplicação","7, HTTP e HTTPS","Roteamento por caminho, por host ou por cabeçalho; contêiner; firewall de aplicação web"],
      ["De rede","4, TCP e UDP","Endereço IP fixo, latência mínima, protocolo que não é HTTP, milhões de requisições"],
      ["De gateway","3","Colocar dispositivo de inspeção de terceiro no caminho"]
    ]},
    {t:"p", x:"O balanceador só distribui para destinos saudáveis, e quem decide isso é a verificação de integridade. O grupo de dimensionamento automático pode usar essa mesma verificação em vez da checagem básica da instância: com isso, uma instância que responde no sistema operacional mas devolve erro na aplicação é substituída."},
    {t:"h", x:"Grupo de dimensionamento automático"},
    {t:"table", head:["Política","Como decide"], rows:[
      ["Rastreamento de alvo","Mantém uma métrica em um valor, por exemplo 60% de CPU"],
      ["Em degraus","Degraus de ajuste conforme o tamanho do desvio do alarme"],
      ["Agendada","Hora marcada, para pico previsível"],
      ["Preditiva","Aprende o padrão histórico e provisiona antes do pico"]
    ]},
    {t:"p", x:"Mínimo, desejado e máximo são três números diferentes, e a prova cobra isso: o mínimo é o piso que nunca desce, mesmo sem carga, e é ele que garante instância em cada zona. Distribuir o grupo por várias zonas e deixar o mínimo igual ao número de zonas é a receita padrão de alta disponibilidade."},
    {t:"h", x:"Zona, região e borda"},
    {t:"p", x:"Zona de disponibilidade é um ou mais datacenters independentes dentro de uma região, com energia e rede próprias. Região é um conjunto de zonas, geograficamente separado das demais. Falha de zona se resolve com várias zonas; falha de região exige desenho em duas regiões, que custa e complica muito mais."},
    {t:"p", x:"O Route 53 faz o papel de direcionar entre regiões, com verificação de integridade e roteamento por falha, por latência, por peso ou por geografia. Já o Global Accelerator entrega endereços estáticos de difusão por proximidade e serve a protocolo que não é HTTP."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Rotear /api para um conjunto e /web para outro","Balanceador de aplicação"],
      ["Precisa de endereço IP fixo para liberar em firewall","Balanceador de rede"],
      ["Instância responde no sistema mas a aplicação dá erro","Verificação de integridade do balanceador no grupo"],
      ["Pico todo dia às 9h, previsível","Política agendada ou preditiva"],
      ["Sobreviver à perda de uma zona","Grupo em várias zonas, mínimo igual ao número de zonas"],
      ["Sobreviver à perda da região","Segunda região com Route 53 por falha"],
      ["Jogo em UDP precisa de entrada global rápida","Global Accelerator"]
    ]},
    {t:"trap", x:"Balanceador não deixa a aplicação com estado virar sem estado. Se a sessão vive na memória da instância, trocar de instância derruba o usuário. As saídas são sessão fixa no balanceador, que é remendo e desequilibra a carga, ou tirar a sessão de dentro da instância e guardá-la no ElastiCache ou no DynamoDB, que é a resposta esperada."},
    {t:"case", q:"Uma aplicação web precisa continuar no ar com a perda de uma zona, substituir instância que devolve erro 500 e absorver um pico diário às 20h. Qual configuração?",
      a:"Grupo de dimensionamento automático em três zonas, com mínimo três e balanceador de aplicação na frente, usando a verificação de integridade do balanceador como fonte de saúde do grupo, para que o erro 500 cause substituição. Para o pico das 20h, política agendada somada ao rastreamento de alvo: a agendada provisiona antes, e o rastreamento cobre o que fugir do padrão."}
  ],
  check:["Escolher entre balanceador de aplicação e de rede com uma frase de requisito","Explicar por que o mínimo do grupo garante disponibilidade","Dizer o que fazer com sessão guardada na memória da instância"],
  src:[{t:"AWS: tipos de Elastic Load Balancing", u:"https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html"},
       {t:"AWS: dimensionamento dinâmico", u:"https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html"}]
},
{
  id:"f-saa-desacopla", exam:"saa", dom:"d2", mins:7, concept:"desacoplamento",
  title:"Desacoplar: fila, tópico, barramento e orquestrador",
  lead:"Toda questão que começa com um componente derrubando o outro termina em desacoplamento. São quatro serviços com papéis distintos, e trocar um pelo outro é o erro clássico.",
  blocks:[
    {t:"h", x:"Quem faz o quê"},
    {t:"table", head:["Serviço","Modelo","Use quando"], rows:[
      ["SQS","Fila, um consumidor por mensagem","Absorver pico e processar no ritmo do consumidor"],
      ["SNS","Tópico, muitos assinantes pela mesma mensagem","Avisar vários destinos de uma vez"],
      ["EventBridge","Barramento com regras e filtro por conteúdo","Rotear evento por regra, integrar SaaS, agendar"],
      ["Step Functions","Máquina de estados","Coordenar passos com repetição, espera e tratamento de erro"]
    ]},
    {t:"p", x:"O padrão de distribuição que a prova adora é SNS na frente de várias filas SQS: o produtor publica uma vez, cada assinante tem a própria fila e processa no próprio ritmo, sem um consumidor lento segurar os outros."},
    {t:"h", x:"SQS por dentro"},
    {t:"table", head:["Conceito","O que significa"], rows:[
      ["Fila padrão","Entrega pelo menos uma vez, ordem apenas aproximada, taxa praticamente ilimitada"],
      ["Fila FIFO","Ordem garantida e exatamente uma vez, com limite de taxa bem menor"],
      ["Tempo de visibilidade","Quanto a mensagem fica escondida enquanto é processada"],
      ["Fila de mensagens mortas","Para onde vai a mensagem que falhou o número máximo de vezes"],
      ["Sondagem longa","Espera por mensagem em vez de perguntar sem parar, reduzindo custo"]
    ]},
    {t:"p", x:"Mensagem processada duas vezes costuma ser tempo de visibilidade menor que o tempo de processamento: o consumidor ainda está trabalhando quando a mensagem reaparece para outro. Mensagem que some depois de muitas tentativas costuma ser falta de fila de mensagens mortas para inspecionar o veneno."},
    {t:"p", x:"O limite de uma mensagem é 256 KB e a retenção máxima é de 14 dias. Carga maior vai para o S3, com a mensagem carregando apenas a referência."},
    {t:"h", x:"Quando é fluxo contínuo e não mensagem"},
    {t:"p", x:"Kinesis Data Streams entra quando o enunciado fala de telemetria contínua, de muitos consumidores lendo o mesmo registro, de ordem por chave de partição ou de reprocessar as últimas horas. Fila apaga a mensagem depois de consumida; fluxo mantém o registro durante a janela de retenção."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Pico derruba o processador de pedidos","SQS entre o site e o processamento"],
      ["Um evento precisa chegar a quatro sistemas","SNS com várias filas assinando"],
      ["Rotear por conteúdo do evento, com regra","EventBridge"],
      ["Fluxo com repetição, espera e tratamento de erro","Step Functions"],
      ["Ordem estrita por cliente, sem duplicata","Fila FIFO com agrupamento por cliente"],
      ["A mesma mensagem está sendo processada duas vezes","Aumentar o tempo de visibilidade"],
      ["Telemetria contínua, muitos consumidores","Kinesis Data Streams"],
      ["Mensagem de 5 MB","Guardar no S3 e enfileirar a referência"]
    ]},
    {t:"trap", x:"Fila padrão não garante ordem. Se o enunciado pede ordem, a resposta é FIFO, e com ela vem um teto de taxa bem menor, que o próprio enunciado às vezes usa para eliminar a alternativa. Reconhecer esse par ordem contra taxa resolve a questão sem decorar número."},
    {t:"case", q:"Um site de ingressos trava quando abre uma venda. O processamento de cada pedido leva até 40 segundos e não pode perder pedido nem cobrar duas vezes o mesmo cliente. Qual desenho?",
      a:"Fila FIFO entre o site e o processamento, com identificador de deduplicação igual ao número do pedido e agrupamento por cliente, o que garante ordem por cliente e descarta a reentrega do mesmo pedido. Tempo de visibilidade acima dos 40 segundos de processamento, para a mensagem não reaparecer no meio do trabalho, e fila de mensagens mortas para separar o que falhar várias vezes. O site passa a responder imediatamente, porque só enfileira."}
  ],
  check:["Separar SQS, SNS e EventBridge por uma frase de cenário","Explicar a causa mais comum de processamento duplicado","Dizer quando fluxo ganha de fila"],
  src:[{t:"AWS: o que é o Amazon SQS", u:"https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html"},
       {t:"AWS: distribuição com SNS e SQS", u:"https://docs.aws.amazon.com/sns/latest/dg/sns-common-scenarios.html"}]
},
{
  id:"f-saa-dados-res", exam:"saa", dom:"d2", mins:7, concept:"dados-resilientes",
  title:"Dados resilientes: cópia, réplica e a diferença que custa caro",
  lead:"Multi-AZ e réplica de leitura são escritos parecido e servem a coisas opostas. Confundir os dois é o erro mais caro do domínio de resiliência.",
  blocks:[
    {t:"h", x:"RDS: as duas construções"},
    {t:"table", head:["","Implantação Multi-AZ","Réplica de leitura"], rows:[
      ["Para que serve","Disponibilidade","Desempenho de leitura"],
      ["Como copia","Síncrona","Assíncrona"],
      ["Dá para ler","Não, no modo de espera clássico","Sim, é esse o ponto"],
      ["Assume sozinha","Sim, automática","Não, promoção manual"],
      ["Outra região","Não","Sim"]
    ]},
    {t:"p", x:"Enunciado que fala de relatório pesado derrubando o banco pede réplica de leitura. Enunciado que fala de continuar no ar se a zona cair pede Multi-AZ. Quando pede as duas coisas, a resposta é as duas construções juntas, e não escolher uma."},
    {t:"p", x:"O Aurora muda a escala do problema: guarda seis cópias do dado em três zonas, aceita até quinze réplicas que também servem de alvo de falha, e o banco de dados global replica para outra região com atraso de cerca de um segundo, o que é a resposta quando o requisito é recuperação regional com perda mínima."},
    {t:"h", x:"S3"},
    {t:"p", x:"A durabilidade de onze noves vem de graça e não resolve exclusão: o que protege contra apagar por engano é o versionamento, somado à exclusão com autenticação de dois fatores quando o requisito é mais duro. Replicação entre regiões exige versionamento nos dois buckets e copia apenas o que for gravado depois de ligada, salvo replicação em lote para o que já existe."},
    {t:"p", x:"Bloqueio de objeto do S3, no modo de conformidade, impede que qualquer pessoa, inclusive a conta raiz, apague o objeto antes do prazo. É a resposta para exigência regulatória de retenção, e não versionamento."},
    {t:"h", x:"As quatro estratégias de recuperação"},
    {t:"table", head:["Estratégia","Tempo de retomada","Custo parado"], rows:[
      ["Cópia e restauração","Horas","O menor"],
      ["Luz piloto","Dezenas de minutos","Baixo: só o núcleo do dado replicado"],
      ["Espera morna","Minutos","Médio: ambiente reduzido rodando"],
      ["Ativo em duas regiões","Quase zero","O maior"]
    ]},
    {t:"p", x:"O enunciado dá o objetivo de tempo de retomada e o objetivo de ponto de retomada, e espera a estratégia mais barata que atende aos dois. Quanto menor o tempo exigido, mais alto na tabela você precisa ir, e mais caro fica."},
    {t:"signal", head:["Sinal no enunciado","Resposta"], rows:[
      ["Relatório pesado está derrubando o banco","Réplica de leitura"],
      ["Banco precisa sobreviver à perda da zona","Implantação Multi-AZ"],
      ["Retomada regional com perda de segundos","Aurora com banco de dados global"],
      ["Protegido contra exclusão acidental de objeto","Versionamento no bucket"],
      ["Regulador exige que ninguém apague por 7 anos","Bloqueio de objeto no modo de conformidade"],
      ["Tempo de retomada de poucos minutos","Espera morna"],
      ["Tempo de retomada de horas, menor custo","Cópia e restauração"]
    ]},
    {t:"trap", x:"Ligar a replicação entre regiões não copia o que já estava no bucket. Quem precisa do acervo antigo do outro lado precisa de replicação em lote. A mesma lógica de a partir de agora aparece no versionamento: objeto apagado antes de ligar não volta."},
    {t:"case", q:"Um banco relacional precisa aguentar a perda de uma zona sem intervenção, servir um painel analítico que hoje o sobrecarrega, e ter cópia em outra região com retomada em minutos. Qual combinação?",
      a:"Aurora com implantação em várias zonas para a falha automática, uma réplica de leitura apontada ao painel, para tirar a carga analítica do nó de escrita, e banco de dados global para a segunda região, que dá retomada em cerca de um minuto com atraso de aproximadamente um segundo. Réplica de leitura entre regiões no RDS clássico atenderia à cópia, mas a promoção é manual e não entrega retomada em minutos de forma confiável."}
  ],
  check:["Dizer em uma frase para que serve cada uma das duas construções do RDS","Explicar o que a replicação entre regiões não faz","Ordenar as quatro estratégias de recuperação por tempo e por custo"],
  src:[{t:"AWS: implantações Multi-AZ no RDS", u:"https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html"},
       {t:"AWS: estratégias de recuperação de desastre", u:"https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html"}]
}
];
