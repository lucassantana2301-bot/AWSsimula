/* ============================================================
   BANCO DE QUESTÕES — AWS (CLF-C02 e SAA-C03), lote 5
   Revisado contra a documentação oficial (nov/2026).
   ============================================================ */
/* Lote q-clf-e: questões CLF-C02 (aw-*), domínios d1 (aw-d1-23 a 28), d2 (aw-d2-29 a 36), d3 (aw-d3-35 a 42), d4 (aw-d4-21 a 24) */
const QUESTIONS_CLF_E = [
/* ===================== D1 ===================== */
{
  id:"aw-d1-23", exam:"clf", dom:"d1", lvl:3, type:"single", sec:75, tags:["well-architected"],
  case:"Uma equipe publica uma versão nova do sistema a cada três meses, com centenas de mudanças de uma só vez. Quando algo quebra, ninguém sabe qual mudança causou o erro, e desfazer a versão leva um dia inteiro.",
  stem:"Qual princípio de design do pilar Excelência Operacional ataca diretamente esse problema?",
  opts:[
    {k:"A",t:"Fazer mudanças frequentes, pequenas e reversíveis"},
    {k:"B",t:"Antecipar falhas com simulações de cenários de erro"},
    {k:"C",t:"Usar serviços gerenciados sempre que possível"},
    {k:"D",t:"Aprender com todos os eventos e métricas operacionais"}
  ],
  ans:["A"],
  why:{
    ok:"O problema nasce do tamanho do pacote: muitas mudanças juntas aumentam o raio de impacto e dificultam achar a causa. O princípio de mudanças pequenas, frequentes e reversíveis, com implantação automatizada, reduz o impacto de cada versão e permite desfazer rápido quando algo falha.",
    B:"Antecipar falhas testa procedimentos e a resposta da equipe contra falhas simuladas. Ajuda a se preparar, mas não diminui o tamanho das versões nem torna a reversão mais rápida.",
    C:"Serviços gerenciados reduzem a carga operacional da infraestrutura. Não mudam a forma como a equipe agrupa e publica as próprias mudanças de código.",
    D:"Aprender com eventos é a análise pós-incidente. Melhora as próximas decisões, mas não ataca a causa: versões enormes e difíceis de desfazer."
  },
  src:[{t:"Excelência Operacional: princípios de design",u:"https://docs.aws.amazon.com/wellarchitected/latest/framework/oe-design-principles.html"}]
},
{
  id:"aw-d1-24", exam:"clf", dom:"d1", lvl:4, type:"multi", sec:90, tags:["well-architected"],
  case:"O comitê de nuvem de uma empresa recebeu cinco propostas e quer adotar apenas as que são princípios de design do pilar Otimização de Custos do AWS Well-Architected Framework.",
  stem:"Quais propostas são princípios de design desse pilar? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Adotar um modelo de consumo, pagando só pelo que usa e desligando o que fica ocioso"},
    {k:"B",t:"Parar de adivinhar a capacidade necessária"},
    {k:"C",t:"Analisar e atribuir despesas a cada carga de trabalho e ao seu dono"},
    {k:"D",t:"Maximizar a utilização dos recursos alocados"},
    {k:"E",t:"Implementar observabilidade para gerar insights acionáveis"}
  ],
  ans:["A","C"],
  why:{
    ok:"Os cinco princípios de Otimização de Custos são: implementar gestão financeira na nuvem, adotar um modelo de consumo, medir a eficiência geral, parar de gastar com trabalho pesado indiferenciado e analisar e atribuir despesas. A e C estão nessa lista.",
    B:"Parar de adivinhar capacidade é princípio do pilar Confiabilidade (e também uma das seis vantagens da nuvem). Pode até reduzir custo, mas não é princípio do pilar Otimização de Custos.",
    D:"Maximizar a utilização é princípio do pilar Sustentabilidade, que busca reduzir o impacto ambiental usando menos recursos para o mesmo resultado.",
    E:"Implementar observabilidade para gerar insights acionáveis é princípio do pilar Excelência Operacional."
  },
  src:[
    {t:"Otimização de Custos: princípios de design",u:"https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/design-principles.html"},
    {t:"Confiabilidade: princípios de design",u:"https://docs.aws.amazon.com/wellarchitected/latest/framework/rel-dp.html"}
  ]
},
{
  id:"aw-d1-25", exam:"clf", dom:"d1", lvl:3, type:"single", sec:75, tags:["well-architected"],
  case:"Um arquiteto quer revisar uma carga de trabalho respondendo às perguntas dos pilares do Well-Architected, registrar os riscos altos e médios encontrados, montar um plano de melhoria e salvar o estado da revisão para comparar daqui a seis meses. Não há orçamento para ferramentas pagas.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"AWS Trusted Advisor"},
    {k:"B",t:"AWS Well-Architected Tool"},
    {k:"C",t:"AWS Config com pacotes de conformidade"},
    {k:"D",t:"AWS Compute Optimizer"}
  ],
  ans:["B"],
  why:{
    ok:"O AWS Well-Architected Tool conduz a revisão pelas perguntas do framework (e de lentes adicionais), aponta riscos altos (HRI) e médios (MRI), gera o plano de melhoria e salva marcos (milestones), que registram o estado da carga em um momento para comparação futura. Não há cobrança adicional pelo uso da ferramenta.",
    A:"O Trusted Advisor faz verificações automáticas na conta (custo, segurança, limites etc.). Ele pode alimentar a revisão, mas não conduz as perguntas do framework nem salva marcos de uma carga de trabalho.",
    C:"O AWS Config avalia a configuração dos recursos contra regras. Não faz a revisão de arquitetura com as perguntas dos pilares nem gera plano de melhoria.",
    D:"O Compute Optimizer recomenda tamanhos de recursos de computação. Cobre só uma parte de custo e desempenho, sem revisão por pilares."
  },
  src:[
    {t:"O que é o AWS Well-Architected Tool",u:"https://docs.aws.amazon.com/wellarchitected/latest/userguide/intro.html"},
    {t:"Marcos (milestones)",u:"https://docs.aws.amazon.com/wellarchitected/latest/userguide/milestones.html"}
  ]
},
{
  id:"aw-d1-26", exam:"clf", dom:"d1", lvl:3, type:"yn", sec:90, tags:["well-architected"],
  stem:"Responda Sim ou Não: cada situação ilustra corretamente a vantagem da nuvem indicada?",
  rows:[
    {t:"Uma startup começou a atender clientes no Japão em dois dias, criando a aplicação em uma região de lá sem contratar datacenter: isso é \"tornar-se global em minutos\".", a:true,
     e:"Implantar em outras regiões com poucos cliques, ganhando latência menor para clientes distantes, é exatamente a vantagem \"tornar-se global em minutos\"."},
    {t:"Uma loja deixou de comprar 40 servidores à vista e passou a pagar por hora de uso: isso é \"trocar despesa fixa por despesa variável\".", a:true,
     e:"Em vez de investir antes de saber o uso real, a empresa paga só quando consome e só o quanto consome. É a definição dessa vantagem."},
    {t:"Uma empresa pagou três anos adiantados por instâncias reservadas: esse é o melhor exemplo de \"parar de adivinhar capacidade\".", a:false,
     e:"Reservar por três anos é justamente apostar numa previsão de capacidade. \"Parar de adivinhar capacidade\" é aumentar e reduzir recursos conforme a demanda real, em minutos."},
    {t:"O preço por hora cair porque a AWS agrega o uso de centenas de milhares de clientes é exemplo de \"aumentar velocidade e agilidade\".", a:false,
     e:"Preço menor pela agregação de uso é a vantagem \"beneficiar-se de economias de escala\". Velocidade e agilidade tratam de ter recursos em minutos, e não em semanas, para experimentar."}
  ],
  src:[{t:"Seis vantagens da computação em nuvem",u:"https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html"}]
},
{
  id:"aw-d1-27", exam:"clf", dom:"d1", lvl:4, type:"single", sec:85, tags:["infra-global"],
  case:"Uma seguradora já roda o sistema de apólices em várias zonas de disponibilidade da região sa-east-1. O plano de continuidade agora exige que o sistema volte a funcionar mesmo se a região inteira ficar indisponível. O regulador permite guardar cópias dos dados fora do país.",
  stem:"Qual mudança atende ao novo requisito?",
  opts:[
    {k:"A",t:"Adicionar uma terceira zona de disponibilidade na mesma região"},
    {k:"B",t:"Ativar o Multi-AZ no banco de dados do Amazon RDS"},
    {k:"C",t:"Replicar os dados e manter um ambiente de recuperação em outra região"},
    {k:"D",t:"Distribuir o sistema pelos pontos de presença do CloudFront"}
  ],
  ans:["C"],
  why:{
    ok:"Zonas de disponibilidade ficam dentro de uma região e protegem contra a falha de um ou mais datacenters, não contra a perda da região toda. Para sobreviver a um evento regional, é preciso ter dados replicados e um ambiente capaz de assumir em uma segunda região. Como o regulador permite cópia fora do país, essa opção é viável.",
    A:"Mais uma zona aumenta a tolerância a falhas de zona, mas todas continuam na mesma região. Se a região cair, o sistema cai junto.",
    B:"O Multi-AZ do RDS mantém uma réplica em outra zona da MESMA região. É ótimo para falha de zona, mas não cobre a indisponibilidade da região.",
    D:"Os pontos de presença do CloudFront fazem cache de conteúdo perto dos usuários. Não executam o sistema de apólices nem substituem uma região de recuperação."
  },
  src:[{t:"Regiões e zonas de disponibilidade",u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"}]
},
{
  id:"aw-d1-28", exam:"clf", dom:"d1", lvl:3, type:"order", sec:80, tags:["infra-global","well-architected"],
  stem:"Ordene as arquiteturas da que tolera a MENOR para a que tolera a MAIOR abrangência de falha sem interromper o serviço.",
  items:[
    {t:"Uma única instância EC2 em uma zona de disponibilidade"},
    {t:"Duas instâncias atrás de um balanceador, ambas na mesma zona de disponibilidade"},
    {t:"Grupo de Auto Scaling atrás de um balanceador, com instâncias em três zonas de disponibilidade da mesma região"},
    {t:"A mesma aplicação ativa em duas regiões, com o Route 53 direcionando o tráfego entre elas"}
  ],
  e:"Uma instância única para o serviço se ela falhar. Duas instâncias com balanceador toleram a perda de uma instância, mas não a da zona onde as duas estão. Instâncias espalhadas por três zonas toleram a perda de uma zona inteira, pois as zonas são isoladas entre si. Só a implantação em duas regiões tolera a indisponibilidade de uma região inteira.",
  src:[{t:"Regiões e zonas de disponibilidade",u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"}]
},
/* ===================== D2 ===================== */
{
  id:"aw-d2-29", exam:"clf", dom:"d2", lvl:4, type:"single", sec:80, tags:["iam-role-ec2"],
  case:"Um desenvolvedor publicou por engano, em um repositório público do GitHub, a chave de acesso de longo prazo de um usuário do IAM com permissão de administrador. Esse usuário também entra no console com senha e MFA.",
  stem:"Qual deve ser a primeira ação para conter o risco?",
  opts:[
    {k:"A",t:"Trocar a senha do console e registrar uma nova MFA"},
    {k:"B",t:"Aplicar uma política de senha mais rígida na conta"},
    {k:"C",t:"Ativar o Amazon GuardDuty para detectar o uso da chave"},
    {k:"D",t:"Desativar a chave exposta e depois substituí-la por outra"}
  ],
  ans:["D"],
  why:{
    ok:"Chave de acesso é credencial de longo prazo para chamadas programáticas e funciona independentemente da senha e da MFA de console. A forma de cortar o uso indevido é desativar a chave imediatamente; depois cria-se uma nova para quem precisa e exclui-se a antiga.",
    A:"Senha e MFA protegem o login no console. Quem tem a chave vazada continua chamando a API e a CLI normalmente.",
    B:"A política de senha do IAM não se aplica às chaves de acesso. Mesmo com senha mais forte, a chave exposta continua válida.",
    C:"O GuardDuty ajuda a detectar uso suspeito, mas não revoga nada. A chave continua válida até ser desativada ou excluída."
  },
  src:[
    {t:"Gerenciar chaves de acesso de usuários do IAM",u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html"},
    {t:"Política de senha da conta",u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_passwords_account-policy.html"}
  ]
},
{
  id:"aw-d2-30", exam:"clf", dom:"d2", lvl:4, type:"yn", sec:95, tags:["iam-role-ec2"],
  stem:"Responda Sim ou Não para cada afirmação sobre senhas, MFA e chaves de acesso no IAM.",
  rows:[
    {t:"A política de senha definida para a conta também vale para a senha do usuário raiz.", a:false,
     e:"A política de senha do IAM não se aplica à senha do usuário raiz nem às chaves de acesso. Ela vale para as senhas dos usuários do IAM."},
    {t:"Se a senha de um usuário do IAM expirar, as chaves de acesso dele continuam funcionando na AWS CLI.", a:true,
     e:"A expiração impede só o login no console. As chaves de acesso são credenciais separadas e seguem válidas até serem desativadas ou excluídas."},
    {t:"Um usuário do IAM pode ter até duas chaves de acesso, o que permite fazer a rotação sem parar a aplicação.", a:true,
     e:"O limite é de duas chaves por usuário. Cria-se a segunda, troca-se a aplicação para ela e só então a primeira é desativada e excluída."},
    {t:"O usuário raiz pode ter apenas um dispositivo de MFA registrado.", a:false,
     e:"O usuário raiz e os usuários do IAM podem registrar até oito dispositivos de MFA de qualquer tipo. A AWS recomenda MFA resistente a phishing, como chaves de segurança e passkeys."}
  ],
  src:[
    {t:"Política de senha da conta",u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_passwords_account-policy.html"},
    {t:"MFA no IAM",u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html"}
  ]
},
{
  id:"aw-d2-31", exam:"clf", dom:"d2", lvl:4, type:"single", sec:85, tags:["seguranca-servicos","sg-vs-nacl"],
  case:"Instâncias em várias sub-redes de uma VPC só podem acessar, na internet, uma lista de domínios aprovados, como o repositório de pacotes do fornecedor. Todo o resto deve ser bloqueado, e o tráfego também precisa de inspeção de intrusão (IPS) com regras compatíveis com Suricata.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"AWS WAF associado a um Application Load Balancer"},
    {k:"B",t:"AWS Shield Advanced"},
    {k:"C",t:"Grupos de segurança com regras de saída"},
    {k:"D",t:"AWS Network Firewall"}
  ],
  ans:["D"],
  why:{
    ok:"O AWS Network Firewall é um firewall gerenciado e com estado para a VPC. Ele filtra o tráfego no perímetro (inclusive o que sai por gateway NAT ou de internet), aceita listas de domínios permitidos ou bloqueados e faz inspeção profunda de pacotes como IPS, com regras compatíveis com Suricata.",
    A:"O AWS WAF inspeciona requisições HTTP/HTTPS que CHEGAM a recursos como CloudFront, ALB e API Gateway. Não controla o tráfego de saída das instâncias para a internet.",
    B:"O Shield Advanced protege contra DDoS e dá acesso ao time de resposta da AWS. Não filtra destinos por nome de domínio nem faz IPS.",
    C:"Grupos de segurança filtram por IP, porta e protocolo. Não entendem nomes de domínio e não fazem inspeção de intrusão."
  },
  src:[{t:"O que é o AWS Network Firewall",u:"https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html"}]
},
{
  id:"aw-d2-32", exam:"clf", dom:"d2", lvl:5, type:"single", sec:90, tags:["seguranca-servicos"],
  case:"Uma empresa vai migrar uma aplicação de assinatura digital de documentos que usa a interface PKCS#11 para falar com o HSM. O contrato com um cliente exige HSM dedicado a uma única empresa (inquilino único), com os usuários do HSM administrados pela própria empresa.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"AWS CloudHSM"},
    {k:"B",t:"AWS KMS com chaves gerenciadas pelo cliente"},
    {k:"C",t:"AWS Secrets Manager"},
    {k:"D",t:"AWS Certificate Manager"}
  ],
  ans:["A"],
  why:{
    ok:"O AWS CloudHSM fornece HSMs de inquilino único, com validação FIPS no modo FIPS, em que o próprio cliente gerencia os usuários do HSM. Ele oferece interfaces padrão de HSM, como PKCS#11, JCE e OpenSSL, o que permite migrar a aplicação sem reescrever a parte criptográfica.",
    B:"O KMS usa HSMs validados FIPS 140-3 nível 3, mas em arquitetura multilocatário gerenciada pela AWS, e é acessado pela API do KMS. Não atende à exigência contratual de HSM dedicado nem à interface PKCS#11.",
    C:"O Secrets Manager guarda e alterna segredos como senhas e tokens. Não é um HSM e não faz operações criptográficas para a aplicação.",
    D:"O Certificate Manager emite e renova certificados TLS para serviços integrados. Não oferece HSM dedicado nem interface PKCS#11."
  },
  src:[
    {t:"O que é o AWS CloudHSM",u:"https://docs.aws.amazon.com/cloudhsm/latest/userguide/introduction.html"},
    {t:"AWS KMS ou AWS CloudHSM: como escolher",u:"https://aws.amazon.com/blogs/security/aws-kms-or-aws-cloudhsm-choose-the-right-key-management-solution/"}
  ]
},
{
  id:"aw-d2-33", exam:"clf", dom:"d2", lvl:4, type:"multi", sec:95, tags:["seguranca-servicos","shared-responsibility"],
  case:"Uma equipe criou um bucket novo no S3 e não mexeu em nenhuma configuração de criptografia. O auditor fez duas perguntas: os objetos enviados já estão criptografados em repouso? E como passar a registrar no CloudTrail cada uso da chave e controlar, por política de chave, quem pode descriptografar?",
  stem:"Quais afirmações estão corretas? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Os objetos novos já são criptografados com SSE-S3, sem custo adicional"},
    {k:"B",t:"Os objetos ficam sem criptografia até alguém ativar a criptografia padrão"},
    {k:"C",t:"Com SSE-S3, a aplicação precisa enviar a chave em cada requisição"},
    {k:"D",t:"Para auditar o uso da chave e controlar quem descriptografa, usa-se SSE-KMS com chave gerenciada pelo cliente"},
    {k:"E",t:"A equipe pode desativar a criptografia do bucket para gravar mais rápido"}
  ],
  ans:["A","D"],
  why:{
    ok:"Desde 5 de janeiro de 2023, todo objeto novo enviado ao S3 é criptografado automaticamente com SSE-S3, sem custo adicional e sem impacto de desempenho. Para registrar cada uso da chave no CloudTrail e definir quem pode usá-la por política de chave, a opção é SSE-KMS com uma chave gerenciada pelo cliente no AWS KMS.",
    B:"Errado desde 2023: o SSE-S3 é o nível básico aplicado a todo bucket, mesmo sem nenhuma configuração.",
    C:"Quem exige que a aplicação envie a chave em cada requisição é o SSE-C (chaves fornecidas pelo cliente). No SSE-S3, o próprio S3 gerencia as chaves.",
    E:"Não é possível desativar a criptografia de novos uploads: o SSE-S3 é o nível mínimo. E ele não tem impacto de desempenho."
  },
  src:[
    {t:"FAQ da criptografia padrão do S3",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-encryption-faq.html"},
    {t:"Criptografia SSE-KMS no S3",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html"}
  ]
},
{
  id:"aw-d2-34", exam:"clf", dom:"d2", lvl:4, type:"single", sec:85, tags:["seguranca-servicos","conformidade-governanca"],
  case:"Depois de uma fusão, uma empresa com 40 contas no AWS Organizations quer descobrir quais buckets do S3, funções do IAM e chaves do KMS têm políticas que dão acesso a contas FORA da organização, e receber um achado novo sempre que uma política passar a fazer isso.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"Amazon Macie"},
    {k:"B",t:"IAM Access Analyzer"},
    {k:"C",t:"AWS Trusted Advisor"},
    {k:"D",t:"Amazon GuardDuty"}
  ],
  ans:["B"],
  why:{
    ok:"O analisador de acesso externo do IAM Access Analyzer usa raciocínio lógico sobre as políticas baseadas em recursos e gera achados quando um recurso é compartilhado com principal fora da zona de confiança. Com a organização como zona de confiança, ele cobre buckets do S3, funções do IAM, chaves do KMS e outros tipos, e reavalia quando as políticas mudam.",
    A:"O Macie descobre dados sensíveis no S3 e avalia a segurança dos buckets, inclusive se eles são compartilhados com contas fora da organização. Mas cobre só buckets: não analisa funções do IAM nem políticas de chaves do KMS.",
    C:"O Trusted Advisor aponta buckets abertos ao público ou a qualquer usuário autenticado da AWS e avisa se o analisador de acesso externo não está ativado. Ele não lista funções e chaves compartilhadas com contas específicas fora da organização.",
    D:"O GuardDuty detecta ameaças a partir de logs e eventos (por exemplo, chamadas de API suspeitas). Não analisa quem as políticas permitem acessar."
  },
  src:[{t:"O que é o IAM Access Analyzer",u:"https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html"}]
},
{
  id:"aw-d2-35", exam:"clf", dom:"d2", lvl:4, type:"single", sec:85, tags:["seguranca-servicos"],
  case:"A equipe de segurança quer, sem agendar varreduras manuais: 1) encontrar CVEs em pacotes de instâncias EC2 e em imagens do Amazon ECR; 2) saber quais instâncias têm caminho de rede aberto a partir da internet; 3) ter tudo reavaliado sozinho quando uma CVE nova for publicada.",
  stem:"Qual serviço atende aos três requisitos?",
  opts:[
    {k:"A",t:"Amazon GuardDuty"},
    {k:"B",t:"AWS Security Hub CSPM"},
    {k:"C",t:"Amazon Inspector"},
    {k:"D",t:"AWS Systems Manager Patch Manager"}
  ],
  ans:["C"],
  why:{
    ok:"O Amazon Inspector descobre automaticamente instâncias EC2, imagens no ECR e funções Lambda, procura vulnerabilidades de software e exposição de rede não intencional e reavalia os recursos quando algo muda, inclusive quando uma CVE nova que os afeta é publicada. A pontuação de risco é ajustada ao ambiente.",
    A:"O GuardDuty detecta ameaças ativas analisando logs e eventos. Não faz inventário de CVEs em pacotes nem em imagens de contêiner.",
    B:"O Security Hub CSPM avalia a postura contra padrões (como o CIS) e agrega achados de outros serviços, inclusive do Inspector. Ele mesmo não varre pacotes em busca de CVEs.",
    D:"O Patch Manager aplica patches no sistema operacional das instâncias. Não varre imagens do ECR nem analisa caminhos de rede abertos."
  },
  src:[{t:"O que é o Amazon Inspector",u:"https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html"}]
},
{
  id:"aw-d2-36", exam:"clf", dom:"d2", lvl:3, type:"single", sec:75, tags:["shared-responsibility"],
  case:"Uma empresa migrou uma API para o Amazon ECS com AWS Fargate. O auditor pediu a lista do que continua sendo responsabilidade da empresa no modelo de responsabilidade compartilhada.",
  stem:"Qual destas tarefas é da empresa, e não da AWS?",
  opts:[
    {k:"A",t:"Aplicar patches no sistema operacional dos hosts das tarefas"},
    {k:"B",t:"Isolar cada tarefa das outras no nível de kernel e memória"},
    {k:"C",t:"Provisionar e dimensionar os servidores do cluster"},
    {k:"D",t:"Manter atualizadas as bibliotecas e a imagem base do contêiner"}
  ],
  ans:["D"],
  why:{
    ok:"No Fargate, a AWS provisiona e aplica patches na infraestrutura de computação. O cliente continua responsável pelas imagens de contêiner (incluindo a imagem base e as dependências), pela aplicação, pela função do IAM da tarefa, pela configuração de rede e pela criptografia dos dados.",
    A:"Com Fargate, quem provisiona e aplica patches na infraestrutura que roda os contêineres é a AWS. O cliente não acessa esses hosts.",
    B:"O Fargate roda cada tarefa em um ambiente virtualizado isolado, sem compartilhar kernel, CPU ou memória com outras tarefas. Esse isolamento é feito pela AWS.",
    C:"Fargate é computação sem servidor para contêineres: não há servidores de cluster para o cliente provisionar ou dimensionar."
  },
  src:[{t:"Responsabilidade compartilhada no Amazon ECS",u:"https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-shared-model.html"}]
},
/* ===================== D3 ===================== */
{
  id:"aw-d3-35", exam:"clf", dom:"d3", lvl:4, type:"order", sec:85, tags:["rede-aws"],
  stem:"Uma instância em sub-rede privada baixa uma atualização da internet por um gateway NAT (zonal ou regional) com conectividade pública. Ordene o caminho do pacote de SAÍDA, do PRIMEIRO ao ÚLTIMO elemento.",
  items:[
    {t:"Instância EC2 na sub-rede privada"},
    {t:"Tabela de rotas da sub-rede privada, com 0.0.0.0/0 apontando para o gateway NAT"},
    {t:"Gateway NAT, que troca o IP privado da instância pelo endereço do próprio NAT"},
    {t:"Gateway de internet da VPC, que associa o NAT ao IP público e entrega o tráfego à internet"}
  ],
  e:"A sub-rede é privada porque não tem rota direta para o gateway de internet. O pacote sai da instância, e a tabela de rotas da sub-rede o manda para o gateway NAT. O NAT substitui o endereço de origem da instância pelo seu próprio endereço e envia o tráfego ao gateway de internet da VPC, que o associa ao IP público do NAT (o IP elástico, no caso zonal) e o entrega à internet. Isso vale tanto para o gateway NAT zonal, criado em sub-rede pública, quanto para o regional, que não precisa de sub-rede pública mas também sai pelo gateway de internet. A resposta volta pelo caminho inverso, mas ninguém na internet consegue iniciar conexão até a instância.",
  src:[{t:"Gateways NAT",u:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html"},{t:"Gateways NAT regionais",u:"https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html"},{t:"Sub-redes da VPC",u:"https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html"}]
},
{
  id:"aw-d3-36", exam:"clf", dom:"d3", lvl:4, type:"single", sec:80, tags:["rede-aws"],
  case:"Uma filial precisa ligar sua rede local inteira a uma VPC ainda nesta semana. Requisitos: usar o link de internet que a filial já tem, sem contratar circuito dedicado, e o tráfego deve passar criptografado.",
  stem:"Qual opção atende?",
  opts:[
    {k:"A",t:"AWS Direct Connect"},
    {k:"B",t:"Emparelhamento de VPC (VPC peering)"},
    {k:"C",t:"AWS Site-to-Site VPN"},
    {k:"D",t:"AWS Client VPN em cada computador"}
  ],
  ans:["C"],
  why:{
    ok:"O AWS Site-to-Site VPN cria túneis IPsec criptografados pela internet entre o equipamento da filial (gateway do cliente) e a AWS (gateway privado virtual ou transit gateway). Cada conexão tem dois túneis para alta disponibilidade e aproveita o link de internet existente.",
    A:"O Direct Connect é uma conexão física dedicada, que exige circuito em um local Direct Connect ou com parceiro. Além disso, não criptografa o tráfego por padrão.",
    B:"O emparelhamento de VPC liga duas VPCs entre si. Não conecta uma rede local à AWS.",
    D:"O Client VPN conecta usuários individuais, cada um com seu cliente de VPN. Não liga a rede da filial inteira à VPC."
  },
  src:[
    {t:"O que é o AWS Site-to-Site VPN",u:"https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html"},
    {t:"Criptografia em trânsito no Direct Connect",u:"https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html"}
  ]
},
{
  id:"aw-d3-37", exam:"clf", dom:"d3", lvl:4, type:"single", sec:85, tags:["compute-aws"],
  case:"Três cargas novas vão para o EC2: 1) cache em memória de 400 GB para um sistema de leilões; 2) banco NoSQL autogerenciado que exige milhões de operações de E/S aleatórias por segundo em disco NVMe local; 3) treinamento de um modelo de aprendizado profundo com GPUs.",
  stem:"Quais categorias de instância atendem, respectivamente, aos itens 1, 2 e 3?",
  opts:[
    {k:"A",t:"Otimizada para memória; otimizada para armazenamento; computação acelerada"},
    {k:"B",t:"Otimizada para computação; otimizada para armazenamento; computação acelerada"},
    {k:"C",t:"Otimizada para memória; uso geral; otimizada para computação"},
    {k:"D",t:"Uso geral; otimizada para memória; computação acelerada"}
  ],
  ans:["A"],
  why:{
    ok:"Instâncias otimizadas para memória (famílias R, X) servem cargas que processam grandes volumes de dados em memória. As otimizadas para armazenamento (I, D) entregam milhões de operações de E/S aleatórias por segundo em armazenamento local. As de computação acelerada (P, G, Trn) usam GPUs e outros aceleradores, ideais para treinar modelos.",
    B:"Otimizada para computação (família C) prioriza processador, para lotes, transcodificação e servidores de jogos. Um cache de 400 GB precisa de muita memória.",
    C:"Uso geral equilibra CPU, memória e rede, sem foco em E/S local intensa. E treinar com GPU pede computação acelerada, não otimizada para computação.",
    D:"Uso geral não atende bem a um cache de 400 GB em memória, e otimizada para memória não é a escolha para milhões de E/S em disco local."
  },
  src:[
    {t:"Tipos de instância do Amazon EC2",u:"https://aws.amazon.com/ec2/instance-types/"},
    {t:"Convenção de nomes dos tipos de instância",u:"https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html"}
  ]
},
{
  id:"aw-d3-38", exam:"clf", dom:"d3", lvl:5, type:"single", sec:90, tags:["compute-aws"],
  case:"Um grupo de Auto Scaling fica atrás de um Application Load Balancer. Uma instância passou a responder HTTP 500 em todas as requisições. O balanceador já a marcou como não íntegra, mas o Auto Scaling não a substitui, porque as verificações de status do EC2 continuam OK.",
  stem:"O que fazer para que instâncias nesse estado sejam substituídas automaticamente?",
  opts:[
    {k:"A",t:"Aumentar a capacidade mínima e a desejada do grupo de Auto Scaling"},
    {k:"B",t:"Ativar as verificações de integridade do ELB no grupo de Auto Scaling"},
    {k:"C",t:"Criar uma política de rastreamento de destino baseada no uso de CPU"},
    {k:"D",t:"Trocar o Application Load Balancer por um Network Load Balancer"}
  ],
  ans:["B"],
  why:{
    ok:"Por padrão, o Auto Scaling usa só as verificações de status do EC2 e ignora o resultado das verificações do Elastic Load Balancing. Depois que essas verificações são ativadas no grupo, a instância que o balanceador marca como não íntegra também é marcada assim pelo Auto Scaling e substituída.",
    A:"Mais capacidade adiciona instâncias, mas a instância com erro continua no grupo, porque o Auto Scaling ainda a considera íntegra.",
    C:"Políticas de escalabilidade mudam a quantidade de instâncias conforme a carga. Não tratam da saúde de uma instância específica.",
    D:"Trocar o tipo de balanceador não muda o comportamento: o Auto Scaling continuaria ignorando as verificações do balanceador até elas serem ativadas no grupo."
  },
  src:[{t:"Verificações de integridade no Auto Scaling",u:"https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html"}]
},
{
  id:"aw-d3-39", exam:"clf", dom:"d3", lvl:4, type:"multi", sec:90, tags:["bancos-aws"],
  case:"Um time está escolhendo entre Amazon DynamoDB e Amazon RDS para um sistema novo e listou cinco requisitos possíveis.",
  stem:"Quais requisitos, sozinhos, apontam para o DynamoDB em vez do RDS? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Consultas ad hoc em SQL com JOIN entre várias tabelas"},
    {k:"B",t:"Leitura e gravação por chave em milissegundos de um dígito, em qualquer escala"},
    {k:"C",t:"Reaproveitar as stored procedures de um PostgreSQL existente"},
    {k:"D",t:"Transações ACID envolvendo vários itens"},
    {k:"E",t:"Nenhuma instância de banco para escolher, com cobrança por requisição"}
  ],
  ans:["B","E"],
  why:{
    ok:"O DynamoDB é um banco NoSQL de chave-valor e documentos, sem servidor, com desempenho de milissegundos de um dígito em qualquer escala. No modo sob demanda, não há instância para dimensionar e a cobrança é por requisição de leitura e gravação. O RDS sempre roda sobre instâncias de banco; mesmo o Aurora Serverless cobra por capacidade (ACUs) por hora, e não por requisição.",
    A:"JOIN entre tabelas e SQL ad hoc são pontos fortes de bancos relacionais, como o RDS. O DynamoDB não faz JOIN.",
    C:"Stored procedures do PostgreSQL só rodam em um PostgreSQL, como o RDS para PostgreSQL. Esse requisito aponta para o RDS.",
    D:"Os dois atendem: o DynamoDB também oferece transações ACID com vários itens, dentro de uma tabela ou entre tabelas. Por isso, esse requisito não diferencia os serviços."
  },
  src:[
    {t:"Transações no DynamoDB",u:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html"},
    {t:"O que é o Amazon DynamoDB",u:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html"}
  ]
},
{
  id:"aw-d3-40", exam:"clf", dom:"d3", lvl:4, type:"single", sec:85, tags:["rede-aws"],
  case:"Um jogo online multijogador usa tráfego UDP e tem servidores em duas regiões. Os clientes corporativos só liberam no firewall uma lista curta de endereços IP fixos. Se uma região falhar, os jogadores devem ir para a outra rapidamente, sem depender da expiração de cache de DNS.",
  stem:"Qual serviço atende?",
  opts:[
    {k:"A",t:"Amazon CloudFront"},
    {k:"B",t:"Amazon Route 53 com roteamento por latência"},
    {k:"C",t:"AWS Global Accelerator"},
    {k:"D",t:"Network Load Balancer com IP elástico por zona"}
  ],
  ans:["C"],
  why:{
    ok:"O AWS Global Accelerator fornece endereços IP estáticos anycast anunciados pela rede de borda da AWS, aceita ouvintes TCP e UDP e leva o tráfego pela rede global da AWS até o endpoint regional saudável mais adequado. Quando um endpoint fica não íntegro, ele redireciona o tráfego sem depender de cache de DNS.",
    A:"O CloudFront é uma CDN para conteúdo HTTP/HTTPS. Não serve para tráfego UDP de jogo.",
    B:"O Route 53 decide por DNS, então a troca de região depende de os clientes renovarem o cache (TTL). Também não oferece IPs fixos para liberar no firewall.",
    D:"O Network Load Balancer é regional. Os IPs elásticos dele valem só para uma região e não levam o jogador para a outra se ela falhar."
  },
  src:[
    {t:"O que é o AWS Global Accelerator",u:"https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html"},
    {t:"Ouvintes do Global Accelerator",u:"https://docs.aws.amazon.com/global-accelerator/latest/dg/about-listeners.html"}
  ]
},
{
  id:"aw-d3-41", exam:"clf", dom:"d3", lvl:4, type:"single", sec:85, tags:["sqs-sns-eb"],
  case:"Cada pedido confirmado precisa chegar a três sistemas: faturamento, estoque e análise. Cada um processa no próprio ritmo. O sistema de análise às vezes fica fora do ar por várias horas, e nesse tempo nenhum pedido pode se perder para ele.",
  stem:"Qual arquitetura atende?",
  opts:[
    {k:"A",t:"Uma única fila do Amazon SQS lida pelos três sistemas"},
    {k:"B",t:"Um tópico do Amazon SNS entregando direto em um endpoint HTTP de cada sistema"},
    {k:"C",t:"Uma máquina de estado do AWS Step Functions chamando os três sistemas em sequência"},
    {k:"D",t:"Um tópico do Amazon SNS com uma fila do Amazon SQS assinada para cada sistema"}
  ],
  ans:["D"],
  why:{
    ok:"No padrão fanout, cada publicação no tópico do SNS gera uma cópia da mensagem em cada fila do SQS assinada. As mensagens ficam guardadas na fila de cada sistema até serem processadas, então cada um consome no próprio ritmo, e a análise retoma o que acumulou quando voltar.",
    A:"Em uma fila só, os consumidores competem: cada mensagem é processada por um dos sistemas, e não pelos três.",
    B:"Para endpoints HTTP, o SNS tenta reenviar por no máximo uma hora e depois descarta a mensagem, a menos que haja uma fila de mensagens não entregues. Uma queda de várias horas faria pedidos se perderem.",
    C:"O Step Functions orquestra etapas com novas tentativas e tratamento de erro, mas aqui acoplaria os três sistemas a um único fluxo. Uma queda longa da análise faria as execuções falharem, e cada sistema não consumiria no próprio ritmo."
  },
  src:[
    {t:"Fanout do SNS para filas do SQS",u:"https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html"},
    {t:"Novas tentativas de entrega do SNS",u:"https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html"}
  ]
},
{
  id:"aw-d3-42", exam:"clf", dom:"d3", lvl:3, type:"single", sec:85, tags:["implantacao-operacao","compute-aws"],
  case:"Quatro pedidos chegaram à equipe: 1) desktops Windows virtuais para 200 terceirizados acessarem pelo navegador; 2) central de atendimento por voz e chat na nuvem, com URA; 3) envio de e-mails de confirmação de pedido pelo domínio da empresa; 4) hospedar um front-end React com implantação automática a cada push no Git.",
  stem:"Quais serviços atendem, respectivamente, aos itens 1, 2, 3 e 4?",
  opts:[
    {k:"A",t:"Amazon WorkSpaces; Amazon Connect Customer; Amazon SES; AWS Amplify Hosting"},
    {k:"B",t:"Amazon WorkSpaces; Amazon Connect Customer; Amazon SNS; Amazon Lightsail"},
    {k:"C",t:"Amazon EC2; Amazon Connect Customer; Amazon SES; Amazon S3"},
    {k:"D",t:"Amazon WorkSpaces; Amazon SNS; Amazon SES; AWS Amplify Hosting"}
  ],
  ans:["A"],
  why:{
    ok:"O Amazon WorkSpaces provisiona desktops virtuais Windows ou Linux acessíveis de vários dispositivos e do navegador. O Amazon Connect Customer (nome atual do produto antes chamado Amazon Connect) é a central de atendimento como serviço, com voz, chat e fluxos de URA. O Amazon SES envia e-mails transacionais e de marketing com os próprios endereços e domínios. O AWS Amplify Hosting hospeda apps web e faz implantação contínua a partir do repositório Git.",
    B:"O SNS envia notificações para assinantes, não e-mails transacionais com o domínio da empresa. O Lightsail hospeda servidores simples, mas não faz implantação automática a cada push no Git.",
    C:"Uma instância EC2 não é um serviço de desktops virtuais para usuários finais. E o S3 hospeda site estático, mas não faz implantação a cada push no Git.",
    D:"O SNS não é central de atendimento: ele só envia notificações. A central de voz e chat é o Amazon Connect Customer."
  },
  src:[
    {t:"O que é o Amazon WorkSpaces",u:"https://docs.aws.amazon.com/workspaces/latest/adminguide/amazon-workspaces.html"},
    {t:"O que é o Amazon Connect Customer",u:"https://docs.aws.amazon.com/connect/latest/adminguide/what-is-amazon-connect.html"}
  ]
},
/* ===================== D4 ===================== */
{
  id:"aw-d4-21", exam:"clf", dom:"d4", lvl:3, type:"single", sec:75, tags:["pricing-models","custo-ferramentas"],
  case:"Uma empresa comprou uma startup que já tem conta AWS própria, com dezenas de recursos em produção. O financeiro quer que essa conta entre na fatura única da organização da empresa, sem recriar nem mover nenhum recurso.",
  stem:"Qual é o caminho correto?",
  opts:[
    {k:"A",t:"Criar uma conta nova na organização e migrar tudo para ela"},
    {k:"B",t:"Compartilhar os recursos com a organização pelo AWS RAM"},
    {k:"C",t:"Convidar a conta da startup para entrar na organização"},
    {k:"D",t:"Liberar ao financeiro o Cost Explorer da conta da startup"}
  ],
  ans:["C"],
  why:{
    ok:"Uma conta existente pode ser convidada para o AWS Organizations. Quando ela aceita, a conta de gerenciamento passa a pagar todas as cobranças dela no faturamento consolidado, e os recursos continuam onde estão. Antes de entrar, vale exportar os relatórios de cobrança antigos da conta.",
    A:"Funcionaria para a fatura, mas obriga a recriar e migrar os recursos, o que o financeiro quer evitar.",
    B:"O AWS Resource Access Manager compartilha recursos (como sub-redes) entre contas. Não muda quem paga a conta da startup.",
    D:"Dar acesso ao Cost Explorer só permite ver os gastos. A conta continuaria com fatura e forma de pagamento próprias."
  },
  src:[{t:"Convidar uma conta para a organização",u:"https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_invites.html"}]
},
{
  id:"aw-d4-22", exam:"clf", dom:"d4", lvl:4, type:"multi", sec:90, tags:["pricing-models"],
  case:"Uma empresa de São Paulo vai criar um ambiente de testes sem dados pessoais e sem exigência de latência baixa. Antes, ela compara regiões e revisa como o tráfego de dados aparece na fatura.",
  stem:"Quais afirmações sobre preços na AWS estão corretas? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"O preço por hora do mesmo tipo de instância pode mudar de uma região para outra"},
    {k:"B",t:"Os preços são iguais em todas as regiões; só os impostos locais mudam"},
    {k:"C",t:"Transferir dados entre regiões é gratuito se as contas estão na mesma organização"},
    {k:"D",t:"Transferir dados da internet para dentro da AWS não tem cobrança"},
    {k:"E",t:"O tráfego entre zonas de disponibilidade da mesma região nunca é cobrado"}
  ],
  ans:["A","D"],
  why:{
    ok:"Cada região opera em condições de mercado locais (terreno, energia, fibra, impostos), por isso o preço dos recursos varia entre regiões. Sem exigência de residência de dados nem de latência, faz sentido escolher a região mais barata para o ambiente de testes. E a entrada de dados da internet na AWS não é cobrada.",
    B:"Os próprios preços dos recursos variam por região, não só os impostos. A AWS recomenda comparar regiões, por exemplo na AWS Pricing Calculator.",
    C:"A transferência entre regiões é cobrada pela saída da região de origem, com ou sem AWS Organizations. O faturamento consolidado não zera esse custo.",
    E:"Em geral, o tráfego entre zonas da mesma região é cobrado nos dois sentidos (por exemplo, entre instâncias EC2). Alguns serviços isentam esse tráfego, mas \"nunca é cobrado\" está errado."
  },
  src:[
    {t:"COST07-BP02 Escolher regiões com base no custo",u:"https://docs.aws.amazon.com/wellarchitected/latest/framework/cost_pricing_model_region_cost.html"},
    {t:"Cobranças de transferência de dados",u:"https://docs.aws.amazon.com/cur/latest/userguide/cur-data-transfers-charges.html"}
  ]
},
{
  id:"aw-d4-23", exam:"clf", dom:"d4", lvl:4, type:"yn", sec:95, tags:["pricing-models"],
  stem:"Responda Sim ou Não para cada afirmação sobre o modelo atual do nível gratuito da AWS para clientes novos.",
  rows:[
    {t:"Contas novas podem receber até US$ 200 em créditos: US$ 100 no cadastro e até US$ 100 ao concluir atividades.", a:true,
     e:"O modelo atual dá US$ 100 em créditos ao criar a conta e até mais US$ 100 por atividades com serviços básicos, além das ofertas sempre gratuitas com cota mensal."},
    {t:"No plano gratuito, o período termina após seis meses ou quando os créditos acabam, o que ocorrer primeiro.", a:true,
     e:"O plano gratuito serve para experimentos e provas de conceito por até seis meses e acaba antes se os créditos forem consumidos."},
    {t:"Quando o plano gratuito acaba, a AWS passa a cobrar o cartão pelos preços sob demanda, sem nenhuma ação do cliente.", a:false,
     e:"Não há cobrança enquanto a conta está no plano gratuito. Ao fim dele, a conta é suspensa e o cliente precisa migrar para o plano pago. A AWS guarda os dados por 90 dias; sem a migração, a conta e o conteúdo são apagados."},
    {t:"Contas no plano gratuito podem usar todos os serviços da AWS, inclusive os que consumiriam os créditos muito rápido.", a:false,
     e:"No plano gratuito, alguns serviços que esgotariam os créditos rapidamente e compras de hardware ficam bloqueados. Para usá-los, é preciso migrar para o plano pago."}
  ],
  src:[
    {t:"Nível gratuito da AWS",u:"https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier.html"},
    {t:"Perguntas frequentes do nível gratuito",u:"https://aws.amazon.com/free/free-tier-faqs/"}
  ]
},
{
  id:"aw-d4-24", exam:"clf", dom:"d4", lvl:4, type:"single", sec:85, tags:["custo-ferramentas","pricing-models"],
  case:"Em 25 contas do AWS Organizations, a tag de centro de custo aparece como \"CentroCusto\", \"centrocusto\" e \"CENTRO_CUSTO\", com valores livres, e os relatórios de custo saem quebrados. A empresa quer definir uma grafia única da chave e os valores permitidos para todas as contas, e ver quais recursos estão fora do padrão.",
  stem:"Qual recurso atende?",
  opts:[
    {k:"A",t:"Políticas de controle de serviço (SCPs)"},
    {k:"B",t:"Políticas de tag do AWS Organizations"},
    {k:"C",t:"AWS Cost Categories"},
    {k:"D",t:"Tag Editor do AWS Resource Groups"}
  ],
  ans:["B"],
  why:{
    ok:"As políticas de tag do Organizations definem a grafia (maiúsculas e minúsculas) da chave e os valores permitidos, valendo para as contas onde são aplicadas. A conformidade aparece no Resource Groups, inclusive de todas as contas a partir da conta de gerenciamento, e é possível impor a política para bloquear operações de tag fora do padrão.",
    A:"SCPs limitam o máximo de permissões das contas. Não definem padrão de grafia de tags nem geram relatório de recursos fora do padrão.",
    C:"O Cost Categories agrupa custos por regras nos relatórios, mas não padroniza as tags nos recursos nem aponta quais estão fora do padrão.",
    D:"O Tag Editor busca e edita tags em lote, mas não define um padrão para a organização nem mede conformidade com ele."
  },
  src:[{t:"Políticas de tag",u:"https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_tag-policies.html"}]
}
];
/* Lote q-saa-e: SAA-C03, domínios d2 (saa-d2-37 a 42), d3 (saa-d3-35 a 40), d4 (saa-d4-30 a 37). 20 questões. */
const QUESTIONS_SAA_E = [
{
  id:"saa-d2-37", exam:"saa", dom:"d2", lvl:4, type:"single", sec:100, tags:["alta-disponibilidade"],
  case:"Uma loja virtual roda num grupo do Auto Scaling atrás de um ALB. Todo dia útil o tráfego triplica num intervalo de 20 minutos, e cada instância nova leva 12 minutos para ficar pronta. O horário do pico muda ao longo do ano, conforme a estação, e a equipe não quer manter horários à mão. Picos fora do padrão, causados por campanhas, também precisam ser absorvidos.",
  stem:"Qual configuração de escalabilidade atende?",
  opts:[
    {k:"A",t:"Ações programadas que sobem a capacidade antes do pico, com escalonamento por etapas para as campanhas."},
    {k:"B",t:"Uma política de rastreamento de destino sobre a CPU média, com aquecimento padrão de 12 minutos."},
    {k:"C",t:"Escalabilidade preditiva com pré-lançamento de instâncias, combinada com rastreamento de destino."},
    {k:"D",t:"Escalabilidade preditiva no modo só de previsão, combinada com escalonamento por etapas na CPU."}
  ],
  ans:["C"],
  why:{
    ok:"A escalabilidade preditiva aprende o padrão diário e semanal a partir do histórico da métrica e lança capacidade antes da carga prevista. Com o pré-lançamento (SchedulingBufferTime), as instâncias sobem com antecedência suficiente para os 12 minutos de preparo. Como a previsão é refeita com dados recentes, ela acompanha a mudança de horário sem ninguém editar agenda. A preditiva não reduz capacidade e não reage ao inesperado; o rastreamento de destino cobre os picos de campanha e a redução. Com várias políticas ativas, vale a maior capacidade desejada entre elas.",
    A:"Ações programadas funcionam para horários fixos, mas exigem que alguém atualize os horários sempre que o pico muda de lugar, o que a equipe recusou.",
    B:"O rastreamento de destino é reativo: só adiciona instâncias depois que a CPU sobe. Com 12 minutos de preparo, os usuários sofrem durante a subida de 20 minutos.",
    D:"No modo só de previsão, a escalabilidade preditiva gera a previsão para avaliação, mas não altera a capacidade do grupo. O pico diário continuaria sendo tratado só de forma reativa."
  },
  src:[{t:"How predictive scaling works",u:"https://docs.aws.amazon.com/autoscaling/ec2/userguide/predictive-scaling-policy-overview.html"},{t:"Predictive scaling for Amazon EC2 Auto Scaling",u:"https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html"}]
},
{
  id:"saa-d2-38", exam:"saa", dom:"d2", lvl:4, type:"single", sec:95, tags:["dados-resilientes"],
  case:"Uma aplicação Java em EC2 usa uma instância RDS for PostgreSQL Multi-AZ. Em cada failover, a aplicação passa minutos com erros, porque guarda em cache o IP resolvido do endpoint e mantém conexões abertas com a instância antiga. A equipe quer reduzir esse tempo sem trocar o tipo de implantação do banco e mudando, no máximo, o endpoint na configuração da aplicação.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Colocar o Amazon RDS Proxy entre a aplicação e o banco e apontar a aplicação para o endpoint do proxy."},
    {k:"B",t:"Converter o banco num cluster de banco de dados Multi-AZ, com duas instâncias em espera legíveis."},
    {k:"C",t:"Criar no Route 53 um registro CNAME com TTL de 5 segundos apontando para o endpoint do banco."},
    {k:"D",t:"Criar uma réplica de leitura em outra zona e promovê-la por script quando o alarme de falha disparar."}
  ],
  ans:["A"],
  why:{
    ok:"O RDS Proxy continua aceitando conexões no mesmo IP durante o failover e as direciona sozinho para o novo primário. Quem se conecta pelo proxy não sofre com propagação de DNS nem com cache local de DNS, e as conexões ociosas não caem: só as que estavam no meio de uma transação são canceladas. A única mudança na aplicação é o endpoint, e o banco continua sendo uma instância Multi-AZ.",
    B:"Um cluster Multi-AZ faz failover mais rápido, mas é outro tipo de implantação, o que o requisito proíbe. Além disso, a aplicação continuaria presa ao IP antigo por causa do cache de DNS.",
    C:"A aplicação guarda o IP resolvido e ignora o TTL, então um TTL menor não muda nada. O CNAME também não fecha as conexões presas na instância antiga.",
    D:"O Multi-AZ já faz o failover automático. Promover réplica por script é mais lento, muda o endpoint de escrita e pode perder dados, porque a réplica de leitura é assíncrona."
  },
  src:[{t:"How RDS Proxy works",u:"https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.howitworks.html"}]
},
{
  id:"saa-d2-39", exam:"saa", dom:"d2", lvl:4, type:"yn", sec:90, tags:["dados-resilientes"],
  stem:"Responda Sim ou Não para cada afirmação sobre versionamento e MFA Delete num bucket do S3.",
  rows:[
    {t:"Somente o usuário raiz da conta dona do bucket pode ativar o MFA Delete, e isso é feito pela AWS CLI ou pela API, não pelo console.",a:true,e:"A documentação diz que só o dono do bucket (usuário raiz) ativa o MFA Delete e que não dá para ativá-lo pelo Console de Gerenciamento: é preciso usar a AWS CLI ou a API."},
    {t:"Com o MFA Delete ativo, um usuário do IAM precisa de código MFA até para um DELETE simples, sem ID de versão.",a:false,e:"O MFA é exigido para excluir permanentemente uma versão e para mudar o estado do versionamento. Um DELETE sem ID de versão só cria um marcador de exclusão e não apaga nenhuma versão."},
    {t:"Dá para manter o MFA Delete ativo e, no mesmo bucket, usar uma regra de ciclo de vida que expira versões antigas.",a:false,e:"A documentação afirma que o MFA Delete não pode ser usado junto com configurações de ciclo de vida. É preciso escolher entre os dois."},
    {t:"Depois de ativado, o versionamento não pode ser desfeito: o bucket só pode ser suspenso, mantendo as versões que já existem.",a:true,e:"Um bucket com versionamento ativado nunca volta ao estado sem versionamento. A suspensão para de criar novas versões, mas preserva as existentes."}
  ],
  src:[{t:"Configuring MFA delete",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/MultiFactorAuthenticationDelete.html"},{t:"Retaining multiple versions of objects with S3 Versioning",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html"}]
},
{
  id:"saa-d2-40", exam:"saa", dom:"d2", lvl:5, type:"single", sec:110, tags:["desacoplamento"],
  case:"Um sistema de pagamentos em us-east-1 publica numa fila do SQS os eventos de 200 mil contas. Nos picos chegam 6.000 mensagens por segundo, já enviadas em lotes de 10. Eventos de uma mesma conta precisam ser processados na ordem e sem duplicação; contas diferentes podem ser processadas em paralelo, por vários consumidores.",
  stem:"Qual configuração de fila atende?",
  opts:[
    {k:"A",t:"Fila padrão, com os consumidores ordenando os eventos de cada conta pela data e hora."},
    {k:"B",t:"Fila FIFO no modo normal, com o ID da conta como ID do grupo de mensagens."},
    {k:"C",t:"Fila FIFO com alta vazão, usando um único ID de grupo de mensagens para a fila toda."},
    {k:"D",t:"Fila FIFO com alta vazão, com o ID da conta como ID do grupo de mensagens."}
  ],
  ans:["D"],
  why:{
    ok:"A fila FIFO garante ordem dentro de cada grupo de mensagens e elimina duplicatas. O modo de alta vazão (escopo de desduplicação por grupo e limite de vazão por ID de grupo) distribui os grupos entre partições; em us-east-1, chega a 70.000 transações por segundo por ação de API, ou 700.000 mensagens por segundo com lotes. Usar o ID da conta como grupo cria muitos grupos distintos, que é o que a AWS recomenda para espalhar a carga: a ordem vale por conta, e contas diferentes andam em paralelo.",
    A:"A fila padrão pode entregar fora de ordem e mais de uma vez. Ordenar no consumidor é frágil e não impede o processamento duplicado.",
    B:"No modo normal, a fila FIFO suporta 300 transações por segundo por ação de API, ou 3.000 mensagens por segundo com lotes de 10. Os 6.000 por segundo do pico passam desse limite.",
    C:"Com um único grupo, tudo vira uma fila em série: enquanto há mensagens do grupo em processamento, as seguintes ficam bloqueadas, e não há paralelismo entre contas. A carga também fica concentrada numa só partição."
  },
  src:[{t:"High throughput for FIFO queues",u:"https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/high-throughput-fifo.html"},{t:"Amazon SQS message quotas",u:"https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html"}]
},
{
  id:"saa-d2-41", exam:"saa", dom:"d2", lvl:4, type:"multi", sec:110, tags:["alta-disponibilidade"],
  case:"Uma API roda num serviço do Amazon ECS com Fargate, com 4 tarefas numa única sub-rede da zona A, atrás de um ALB que já usa três zonas. As sessões ficam num cluster do ElastiCache for Valkey com um único nó, também na zona A. Requisito: se a zona A cair, a API continua respondendo e os usuários não perdem a sessão, sem intervenção manual.",
  stem:"Quais mudanças, juntas, atendem? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Configurar o serviço com sub-redes nas três zonas e manter pelo menos 3 tarefas desejadas."},
    {k:"B",t:"Trocar o cluster por ElastiCache for Memcached com três nós, um em cada zona."},
    {k:"C",t:"Adicionar réplicas do Valkey em outras zonas e ativar Multi-AZ com failover automático."},
    {k:"D",t:"Ativar backups diários do ElastiCache e restaurar o último em outra zona se a zona A cair."},
    {k:"E",t:"Aumentar o serviço para 8 tarefas na mesma sub-rede, para sobrar capacidade numa falha."}
  ],
  ans:["A","C"],
  why:{
    ok:"A: com sub-redes em várias zonas, o Fargate espalha as tarefas entre elas e rebalanceia quando a distribuição fica desigual; com pelo menos uma tarefa por zona e o ALB já nas três, a perda da zona A não derruba a API. C: o Multi-AZ do ElastiCache exige réplica em outra zona; se o primário falha, o serviço promove a réplica com menor atraso e mantém o mesmo endpoint primário, então a aplicação não precisa mudar nada. A replicação é assíncrona, e uma perda pequena dos dados mais recentes é possível.",
    B:"Num cluster baseado em nós, o Memcached não tem replicação nem failover automático: cada nó guarda só uma parte das chaves. Se a zona A cair, as sessões daquele nó se perdem.",
    D:"Restaurar um backup é manual, demora e devolve dados de até um dia atrás. O requisito pede continuidade sem intervenção e sem perder a sessão.",
    E:"Mais tarefas na mesma sub-rede continuam numa só zona. Se a zona A cair, todas caem juntas, e o cache de sessão também."
  },
  src:[{t:"Minimizing downtime in ElastiCache with Multi-AZ",u:"https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/AutoFailover.html"},{t:"Balancing an Amazon ECS service across Availability Zones",u:"https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-rebalancing.html"}]
},
{
  id:"saa-d2-42", exam:"saa", dom:"d2", lvl:4, type:"order", sec:90, tags:["alta-disponibilidade"],
  stem:"Um registro do Route 53 usa roteamento por failover: o primário tem verificação de saúde, e o secundário aponta para outra região. O endpoint primário para de responder. Ordene o que acontece, do PRIMEIRO ao ÚLTIMO passo.",
  items:[
    {t:"Verificadores de saúde em vários locais enviam requisições ao primário e cada um registra falhas consecutivas até atingir o limite configurado."},
    {t:"Quando 18% ou menos dos verificadores relatam o endpoint como saudável, o Route 53 marca a verificação como não saudável."},
    {t:"O Route 53 passa a responder às consultas desse nome com o registro secundário."},
    {t:"Quando a resposta antiga expira no cache (TTL), resolvedores e clientes consultam de novo e recebem o endereço do secundário."}
  ],
  e:"Primeiro, cada verificador do Route 53 testa o endpoint no intervalo escolhido (10 ou 30 segundos) e só o considera em falha depois do número de falhas consecutivas definido. Em seguida, o Route 53 junta os resultados: com 18% ou menos de verificadores relatando saúde, o endpoint vira não saudável. Só então as respostas DNS mudam para o secundário. Por fim, quem guardou a resposta antiga só a troca quando o TTL expira, por isso TTL baixo encurta o tempo total do failover.",
  src:[{t:"How Route 53 determines whether a health check is healthy",u:"https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-determining-health-of-endpoints.html"},{t:"Active-active and active-passive failover",u:"https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-types.html"}]
},
{
  id:"saa-d3-35", exam:"saa", dom:"d3", lvl:4, type:"single", sec:100, tags:["computacao-armazenamento"],
  case:"Um banco de dados numa instância EC2 baseada em Nitro precisa de 120.000 IOPS sustentadas num único volume e da maior durabilidade disponível no EBS. Na mesma instância, um volume de 12 TiB recebe exportações que são lidas em sequência a 400 MiB/s; esse volume deve ter o menor custo por GB que entregue essa vazão.",
  stem:"Qual combinação de volumes atende?",
  opts:[
    {k:"A",t:"gp3 no máximo de IOPS para o banco e st1 para as exportações."},
    {k:"B",t:"io2 Block Express para o banco e st1 para as exportações."},
    {k:"C",t:"io2 Block Express para o banco e sc1 para as exportações."},
    {k:"D",t:"io2 Block Express para o banco e gp3 com 400 MiB/s para as exportações."}
  ],
  ans:["B"],
  why:{
    ok:"O io2 Block Express chega a 256.000 IOPS por volume em instâncias Nitro e tem durabilidade de 99,999%, a maior do EBS. O st1 é HDD otimizado para vazão sequencial, chega a 500 MiB/s por volume e custa menos por GB que os volumes SSD, então entrega os 400 MiB/s com o menor preço.",
    A:"O gp3 tem limite de 80.000 IOPS por volume e durabilidade de 99,8% a 99,9%. Falha nos dois requisitos do banco.",
    C:"O sc1 é o HDD mais barato, mas a vazão máxima por volume é de 250 MiB/s. Não chega aos 400 MiB/s pedidos.",
    D:"O gp3 entrega 400 MiB/s, mas é SSD e custa mais por GB que o st1. Para 12 TiB lidos em sequência, o st1 atende com custo menor."
  },
  src:[{t:"Amazon EBS volume types",u:"https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"},{t:"Throughput Optimized HDD and Cold HDD volumes",u:"https://docs.aws.amazon.com/ebs/latest/userguide/hdd-vols.html"}]
},
{
  id:"saa-d3-36", exam:"saa", dom:"d3", lvl:4, type:"single", sec:100, tags:["computacao-armazenamento"],
  case:"Um treinamento de aprendizado de máquina roda em instâncias com GPU numa única zona de disponibilidade e lê, a cada época, milhões de arquivos pequenos de um bucket do S3 Standard. A latência de cada leitura virou o gargalo. O código usa o SDK do S3 e não deve mudar além do nome do bucket. O conjunto pode ser recriado a partir do bucket original, então a cópia de trabalho não precisa sobreviver à perda da zona.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Espalhar os objetos por mais prefixos no mesmo bucket do S3 Standard para aumentar as requisições por segundo."},
    {k:"B",t:"Montar um sistema de arquivos do Amazon EFS nas instâncias e copiar o conjunto para ele."},
    {k:"C",t:"Copiar o conjunto para um bucket de diretório do S3 Express One Zone na zona das instâncias."},
    {k:"D",t:"Colocar uma distribuição do CloudFront na frente do bucket e ler os objetos por ela."}
  ],
  ans:["C"],
  why:{
    ok:"O S3 Express One Zone guarda os objetos em buckets de diretório numa zona escolhida, ao lado da computação, com acesso consistente na casa de um dígito de milissegundos e até 10 vezes mais rápido que o S3 Standard. O acesso continua pela API do S3, e o custo por requisição é menor, o que ajuda com milhões de arquivos pequenos. Ficar numa só zona é aceitável, porque o conjunto pode ser recriado a partir do bucket original.",
    A:"Mais prefixos aumentam o limite de requisições por segundo, mas não reduzem a latência de cada leitura, que é o gargalo.",
    B:"O EFS é acessado como sistema de arquivos, não pela API do S3. O código de leitura teria de ser reescrito.",
    D:"O CloudFront acelera a entrega a usuários na internet. Para instâncias na própria região, não traz latência de um dígito de milissegundos e muda a forma de acesso, que deixa de ser o SDK do S3."
  },
  src:[{t:"S3 Express One Zone",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-bucket-high-performance.html"}]
},
{
  id:"saa-d3-37", exam:"saa", dom:"d3", lvl:4, type:"single", sec:90, tags:["rede-desempenho"],
  case:"Um portal de notícias usa o CloudFront e recebe picos de centenas de milhares de requisições por segundo. Em cada requisição do visualizador, é preciso redirecionar usuários de alguns países para a edição local e remover da URL parâmetros de rastreamento antes da consulta ao cache. A lógica tem poucas linhas, não chama nenhum serviço externo e deve ter o menor custo e a menor latência possíveis.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"CloudFront Functions associada ao evento de solicitação do visualizador."},
    {k:"B",t:"Lambda@Edge associada ao evento de solicitação do visualizador."},
    {k:"C",t:"Lambda@Edge associada ao evento de solicitação à origem."},
    {k:"D",t:"Regras do AWS WAF na distribuição para reescrever a URL da requisição."}
  ],
  ans:["A"],
  why:{
    ok:"O CloudFront Functions roda nos eventos do visualizador, em menos de um milissegundo, e escala para milhões de requisições por segundo. Ele tem acesso aos dados de geolocalização do visualizador e foi feito justamente para redirecionamentos, reescrita de URL e normalização da chave de cache. Como não precisa de rede nem de corpo da requisição, é a opção mais barata e mais rápida.",
    B:"No evento do visualizador, o Lambda@Edge não tem acesso aos dados de geolocalização. Ele também escala até cerca de 10.000 requisições por segundo por região e custa mais por invocação. É indicado quando há chamada de rede ou acesso ao corpo.",
    C:"O evento de solicitação à origem só roda quando há falta no cache, depois da consulta. Limpar os parâmetros nesse ponto não melhora a chave de cache, e o redirecionamento não seria aplicado a acertos no cache.",
    D:"O AWS WAF pode bloquear com uma resposta personalizada, inclusive um redirecionamento, e inserir cabeçalhos. Mas não altera a URL nem a query string, então não remove os parâmetros antes da consulta ao cache."
  },
  src:[{t:"Differences between CloudFront Functions and Lambda@Edge",u:"https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html"}]
},
{
  id:"saa-d3-38", exam:"saa", dom:"d3", lvl:4, type:"single", sec:95, tags:["banco-cache"],
  case:"Um jogo guarda no DynamoDB as pontuações de 5 milhões de jogadores. A tela inicial precisa mostrar o top 100 global e a posição exata do jogador logado, atualizados a cada partida, com resposta em poucos milissegundos. Leituras fortemente consistentes não são exigidas.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Colocar o DAX na frente da tabela e consultar um índice secundário global ordenado pela pontuação."},
    {k:"B",t:"Ativar o DAX e calcular a posição do jogador com um Scan na tabela a cada abertura da tela."},
    {k:"C",t:"Usar o ElastiCache for Memcached para guardar o top 100, recalculado a cada hora."},
    {k:"D",t:"Manter um conjunto ordenado no ElastiCache for Valkey, atualizado a cada partida."}
  ],
  ans:["D"],
  why:{
    ok:"Os conjuntos ordenados do Valkey guardam cada jogador com a pontuação e se reordenam a cada inserção. ZADD atualiza a pontuação ao fim da partida, ZREVRANGEBYSCORE lista o topo e ZREVRANK devolve a posição exata do jogador, tudo no próprio cluster, em milissegundos. A documentação do ElastiCache cita placares como caso de uso típico desse recurso.",
    A:"O DAX guarda em cache itens e resultados de Query e Scan, mas o cache de consultas não é atualizado por gravações: o resultado fica antigo até o TTL expirar. Ele também não calcula a posição de um jogador entre 5 milhões.",
    B:"Um Scan em 5 milhões de itens a cada abertura de tela é lento e caro, com ou sem DAX. O cache de consultas também não ajudaria, porque as pontuações mudam o tempo todo.",
    C:"O Memcached não tem estrutura ordenada nem cálculo de posição. Recalcular a cada hora não atende à atualização a cada partida, nem à posição de cada jogador."
  },
  src:[{t:"Common ElastiCache use cases",u:"https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/elasticache-use-cases.html"},{t:"DAX and DynamoDB consistency models",u:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.consistency.html"}]
},
{
  id:"saa-d3-39", exam:"saa", dom:"d3", lvl:4, type:"single", sec:90, tags:["containers-serverless"],
  case:"Um aplicativo móvel autentica usuários num grupo de usuários do Amazon Cognito e envia o token JWT em cada chamada a um back-end em Lambda. A API não precisa de cache, AWS WAF, chaves de API nem endpoint privado. Os requisitos são validar o token sem escrever código de autorização e ter o menor custo por requisição.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"API REST no API Gateway com um autorizador Lambda que valida o token."},
    {k:"B",t:"API HTTP no API Gateway com um autorizador JWT ligado ao Cognito."},
    {k:"C",t:"API REST no API Gateway com um autorizador do grupo de usuários do Cognito."},
    {k:"D",t:"API HTTP no API Gateway com um autorizador Lambda que valida o token."}
  ],
  ans:["B"],
  why:{
    ok:"A API HTTP tem autorizador JWT nativo: basta informar o emissor (a URL do grupo de usuários do Cognito) e o público, e o API Gateway valida o token sem código. A API HTTP foi feita com menos recursos justamente para ter preço menor que a API REST. Os recursos que só a REST oferece (cache, AWS WAF, chaves de API, endpoint privado) não são necessários aqui.",
    A:"O autorizador Lambda exige escrever e manter o código de validação e a API REST custa mais por requisição. Falha nos dois requisitos.",
    C:"O autorizador do Cognito valida o token sem código, mas a API REST tem preço por requisição maior que a API HTTP. Falha no requisito de custo.",
    D:"A API HTTP tem o menor custo, mas o autorizador Lambda obriga a escrever o código de validação, e cada chamada ainda gera uma invocação extra da função."
  },
  src:[{t:"Choose between REST APIs and HTTP APIs",u:"https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html"},{t:"Control access to HTTP APIs with JWT authorizers",u:"https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html"}]
},
{
  id:"saa-d3-40", exam:"saa", dom:"d3", lvl:4, type:"multi", sec:110, tags:["computacao-armazenamento"],
  case:"Uma empresa vai subir duas cargas numa região com três zonas. 1) Um cluster Apache Cassandra com 48 nós, que conhece a topologia e precisa colocar as réplicas em racks diferentes para reduzir falhas de hardware correlacionadas. 2) Três instâncias críticas de um serviço de licenças, cada uma em hardware distinto, para que uma falha de rack derrube no máximo uma.",
  stem:"Quais escolhas atendem? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"Cassandra num grupo de posicionamento distribuído, com os 48 nós repartidos entre as três zonas."},
    {k:"B",t:"Cassandra num grupo de posicionamento por partição, mapeando cada partição como um rack."},
    {k:"C",t:"Serviço de licenças num grupo de posicionamento em cluster, para latência mínima entre as três."},
    {k:"D",t:"Serviço de licenças num grupo de posicionamento distribuído, com uma instância por rack."},
    {k:"E",t:"Cassandra num grupo de posicionamento em cluster que abrange as três zonas da região."}
  ],
  ans:["B","D"],
  why:{
    ok:"B: o grupo por partição divide as instâncias em partições, cada uma com seus próprios racks, rede e energia, e informa a qual partição cada instância pertence. Isso é feito para cargas grandes, distribuídas e replicadas, como HDFS, HBase e Cassandra, que usam essa informação para posicionar as réplicas. D: o grupo distribuído coloca cada instância em hardware distinto e é recomendado para poucas instâncias críticas que devem ficar separadas, como as três do serviço de licenças.",
    A:"O grupo distribuído no nível de rack aceita no máximo sete instâncias em execução por zona. Com três zonas, o teto é 21, menos que os 48 nós.",
    C:"O grupo em cluster aproxima as instâncias no mesmo segmento de rede, o que aumenta o risco de uma falha atingir as três ao mesmo tempo. É o oposto do pedido.",
    E:"Um grupo em cluster fica numa única zona e não pode abranger várias. Também concentraria o hardware, em vez de separar as réplicas."
  },
  src:[{t:"Placement strategies for your placement groups",u:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-strategies.html"}]
},
{
  id:"saa-d4-30", exam:"saa", dom:"d4", lvl:4, type:"single", sec:90, tags:["custo-computacao"],
  case:"Uma conta de desenvolvimento tem orçamento mensal de US$ 3.000. A gerência quer que, quando o custo previsto do mês chegar a 90% desse valor, as instâncias EC2 de desenvolvimento sejam paradas e a função do IAM dos desenvolvedores perca a permissão de criar novas instâncias. Tudo deve acontecer automaticamente e sem código próprio.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Um alarme de faturamento do CloudWatch que aciona uma função Lambda para parar as instâncias e mudar a função do IAM."},
    {k:"B",t:"O AWS Cost Anomaly Detection com uma assinatura de alerta que avisa a equipe por e-mail."},
    {k:"C",t:"Um orçamento do AWS Budgets com ações automáticas: aplicar uma política do IAM e parar as instâncias."},
    {k:"D",t:"Um relatório salvo do Cost Explorer, filtrado pela conta de desenvolvimento e revisado todo dia pela gerência."}
  ],
  ans:["C"],
  why:{
    ok:"As ações do AWS Budgets podem aplicar uma política do IAM ou uma SCP e agir sobre instâncias EC2 ou RDS da própria conta, parando-as. Elas podem rodar automaticamente, sem aprovação manual, e disparar sobre o custo previsto, como 90% da previsão do mês. Tudo é configurado no próprio serviço, sem código.",
    A:"Exige escrever e manter a função Lambda. Além disso, o alarme de faturamento só dispara quando a cobrança estimada do mês até agora passa do limite; ele não usa previsão.",
    B:"O Cost Anomaly Detection encontra gastos fora do padrão e avisa, mas não para instâncias nem muda permissões.",
    D:"O Cost Explorer serve para analisar custos. Não executa nenhuma ação, e a revisão diária depende de pessoas."
  },
  src:[{t:"Configuring budget actions",u:"https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-controls.html"}]
},
{
  id:"saa-d4-31", exam:"saa", dom:"d4", lvl:4, type:"single", sec:100, tags:["custo-armazenamento"],
  case:"Um bucket de 800 TB guarda arquivos de projetos de engenharia, quase todos maiores que 1 MB. Não dá para prever quais serão abertos: alguns ficam anos parados e depois voltam a ser muito usados. A empresa quer o menor custo de armazenamento para o que fica parado mais de seis meses, sem pagar taxa de recuperação, e aceita esperar até 12 horas quando um arquivo antigo for pedido.",
  stem:"Qual configuração atende?",
  opts:[
    {k:"A",t:"S3 Intelligent-Tiering com os níveis opcionais Archive Access e Deep Archive Access ativados."},
    {k:"B",t:"S3 Intelligent-Tiering só com os níveis automáticos, que já incluem o Archive Instant Access."},
    {k:"C",t:"Regra de ciclo de vida que move para o S3 Glacier Deep Archive os objetos com mais de 180 dias."},
    {k:"D",t:"Ciclo de vida que move para o Standard-IA em 30 dias e para o Glacier Flexible Retrieval em 180."}
  ],
  ans:["A"],
  why:{
    ok:"O Intelligent-Tiering acompanha o último acesso de cada objeto acima de 128 KB. Com os níveis opcionais ativados, o que fica 180 dias sem acesso vai para o Deep Archive Access, o mais barato da classe. Não há taxa de recuperação no Intelligent-Tiering. Para ler um objeto arquivado, é preciso restaurá-lo (até 12 horas no Deep Archive Access, na opção padrão), e ele volta sozinho para o nível de acesso frequente.",
    B:"O Archive Instant Access é automático e mais barato que o acesso infrequente, mas custa bem mais que o Deep Archive Access. Não entrega o menor custo pedido.",
    C:"O ciclo de vida move pela idade do objeto, não pelo último acesso, então arquivos antigos ainda em uso iriam para o arquivo. O Glacier Deep Archive cobra recuperação, e a cópia restaurada é temporária.",
    D:"Também decide pela idade, não pelo uso. O Standard-IA e o Glacier Flexible Retrieval cobram taxa de recuperação, o que viola o requisito."
  },
  src:[{t:"How S3 Intelligent-Tiering works",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering-overview.html"},{t:"Managing S3 Intelligent-Tiering",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering-managing.html"}]
},
{
  id:"saa-d4-32", exam:"saa", dom:"d4", lvl:4, type:"single", sec:100, tags:["custo-banco-rede"],
  case:"Um trabalho noturno em EC2 em us-east-1 lê por inteiro, toda noite, um conjunto de 5 TB guardado num bucket em sa-east-1. Só cerca de 2% dos objetos mudam por dia. O bucket de São Paulo continua sendo a origem oficial, o trabalho precisa ficar em us-east-1 e deve ler sempre a versão mais recente de cada objeto. A meta é a menor cobrança de transferência de dados.",
  stem:"Qual mudança atende?",
  opts:[
    {k:"A",t:"Criar um endpoint de gateway do S3 na VPC de us-east-1 para o trabalho ler o bucket de sa-east-1 pela rede privada."},
    {k:"B",t:"Replicar o bucket para us-east-1 com o S3 Replication, copiar uma vez os objetos existentes e ler a cópia local."},
    {k:"C",t:"Ativar o S3 Transfer Acceleration no bucket de sa-east-1 e fazer as leituras pelo endpoint acelerado."},
    {k:"D",t:"Colocar uma distribuição do CloudFront na frente do bucket e fazer o trabalho ler os objetos por ela."}
  ],
  ans:["B"],
  why:{
    ok:"Com a replicação entre regiões, cada objeto novo ou alterado atravessa as regiões uma vez só: cerca de 100 GB por dia, em vez de 5 TB toda noite. Os objetos que já existiam são copiados uma vez com o S3 Batch Replication. Depois, o trabalho lê o bucket na própria região, sem cobrança de transferência entre o S3 e o EC2; com um endpoint de gateway, também não passa por NAT. O custo extra é guardar a cópia de 5 TB, bem menor que transferir 5 TB por noite.",
    A:"O endpoint de gateway só funciona para buckets da mesma região em que foi criado. Ele não elimina a transferência entre regiões.",
    C:"O Transfer Acceleration acelera transferências de longa distância e cobra por GB a mais, além da transferência normal. Aumenta o custo.",
    D:"A ida do S3 ao CloudFront não é cobrada, mas cada GB entregue ao trabalho é: seriam cerca de 5 TB por noite, contra cerca de 100 GB por dia na replicação. E o cache pode entregar versões antigas dos objetos alterados."
  },
  src:[{t:"Replicating objects within and across Regions",u:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html"},{t:"Gateway endpoints for Amazon S3",u:"https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"}]
},
{
  id:"saa-d4-33", exam:"saa", dom:"d4", lvl:4, type:"single", sec:90, tags:["custo-computacao"],
  case:"Uma API interna de consulta de CEP recebe cerca de 40 mil requisições por mês, quase todas em horário comercial, e cada uma leva 150 ms. Hoje ela roda em duas instâncias t3.small sob demanda, ligadas 24 horas, atrás de um ALB, em duas zonas. A empresa quer o menor custo mensal, sem perder a tolerância a falha de zona e sem administrar servidores.",
  stem:"Qual opção atende?",
  opts:[
    {k:"A",t:"Uma única instância t4g.nano com Savings Plan de 3 anos, sem o ALB."},
    {k:"B",t:"Um serviço do ECS com Fargate, com duas tarefas pequenas atrás do mesmo ALB."},
    {k:"C",t:"Um grupo do Auto Scaling com instâncias Spot nas duas zonas, atrás do ALB."},
    {k:"D",t:"Uma função Lambda exposta por uma API HTTP do API Gateway."}
  ],
  ans:["D"],
  why:{
    ok:"O Lambda cobra por requisição e pelo tempo de execução, sem custo quando está parado. Com 40 mil chamadas de 150 ms por mês, isso custa muito menos que manter servidores e um ALB ligados 24 horas. O Lambda já roda a função em várias zonas da região, e não há servidor para administrar. A API HTTP também cobra só por requisição.",
    A:"Uma instância só fica numa zona e perde a tolerância a falha. Além disso, continua sendo um servidor para administrar.",
    B:"Não há servidor, mas as duas tarefas e o ALB são cobrados o tempo todo, mesmo nas horas sem nenhuma requisição.",
    C:"O Spot reduz o preço da instância, mas as instâncias e o ALB continuam ligados 24 horas, e a equipe segue administrando servidores e interrupções."
  },
  src:[{t:"Resilience in AWS Lambda",u:"https://docs.aws.amazon.com/lambda/latest/dg/security-resilience.html"},{t:"What is AWS Lambda?",u:"https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"}]
},
{
  id:"saa-d4-34", exam:"saa", dom:"d4", lvl:4, type:"single", sec:95, tags:["custo-computacao"],
  case:"Uma empresa roda no ECS com Fargate uma API pública e um grupo de trabalhadores que consomem uma fila do SQS. Os trabalhadores são idempotentes, tratam o sinal SIGTERM e podem ser interrompidos sem problema. A API escala entre 4 e 12 tarefas e nenhuma delas pode sofrer interrupção. O projeto pode ser encerrado em quatro meses, então ninguém quer assumir compromisso de uso nem passar a administrar instâncias.",
  stem:"Qual opção reduz o custo atendendo aos requisitos?",
  opts:[
    {k:"A",t:"Manter a API no provedor de capacidade FARGATE e mover os trabalhadores para FARGATE_SPOT."},
    {k:"B",t:"Usar FARGATE_SPOT nos dois serviços, com base de 2 tarefas em FARGATE na API."},
    {k:"C",t:"Comprar um Compute Savings Plan de 1 ano que cubra a API e os trabalhadores."},
    {k:"D",t:"Mover os trabalhadores para um provedor de capacidade do ECS com instâncias EC2 Spot."}
  ],
  ans:["A"],
  why:{
    ok:"O Fargate Spot tem preço com desconto em relação ao Fargate, sem compromisso. Antes de uma interrupção, o ECS avisa com dois minutos de antecedência, por um evento no EventBridge e pelo sinal SIGTERM na tarefa, que os trabalhadores já tratam. A API fica no Fargate normal e não é interrompida.",
    B:"Só as 2 tarefas da base ficam no Fargate normal; as outras tarefas da API, de 2 a 10, rodariam no Spot e poderiam ser interrompidas.",
    C:"O Savings Plan exige compromisso de pelo menos 1 ano, e o projeto pode acabar em quatro meses.",
    D:"O EC2 Spot também é barato, mas obriga a administrar instâncias e o grupo do Auto Scaling, o que a empresa recusou."
  },
  src:[{t:"Amazon ECS clusters for Fargate",u:"https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-capacity-providers.html"}]
},
{
  id:"saa-d4-35", exam:"saa", dom:"d4", lvl:4, type:"multi", sec:100, tags:["custo-computacao"],
  case:"Uma empresa tem 40 instâncias m7g em us-east-1 com uso estável e vai manter essa família e essa região pelos próximos três anos. Também tem um uso estável e previsível de AWS Lambda e de ECS com Fargate. Ela aceita compromisso de três anos e quer o maior desconto possível em cada parte.",
  stem:"Quais compras, juntas, atendem? Escolha as DUAS corretas.",
  opts:[
    {k:"A",t:"EC2 Instance Savings Plan para a família m7g em us-east-1."},
    {k:"B",t:"Compute Savings Plan também para as m7g, pelo desconto maior."},
    {k:"C",t:"EC2 Instance Savings Plan para cobrir o Lambda e o Fargate."},
    {k:"D",t:"Compute Savings Plan para a base de uso do Lambda e do Fargate."},
    {k:"E",t:"Database Savings Plan para a base de uso do Lambda e do Fargate."}
  ],
  ans:["A","D"],
  why:{
    ok:"A: o EC2 Instance Savings Plan dá até 72% de desconto em troca de fixar família e região, exatamente o caso das m7g em us-east-1. D: o Lambda e o Fargate só são cobertos pelo Compute Savings Plan, que dá até 66% e vale para EC2, Fargate e Lambda em qualquer família e região.",
    B:"O Compute Savings Plan é mais flexível, mas o desconto máximo (até 66%) é menor que o do EC2 Instance Savings Plan (até 72%). Para uso fixo em família e região, ele deixa dinheiro na mesa.",
    C:"O EC2 Instance Savings Plan cobre apenas uso de instâncias EC2. Não se aplica ao Lambda nem ao Fargate.",
    E:"O Database Savings Plan cobre serviços de banco de dados, como Aurora, RDS e DynamoDB. Não se aplica ao Lambda nem ao Fargate."
  },
  src:[{t:"Savings Plans types",u:"https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html"}]
},
{
  id:"saa-d4-36", exam:"saa", dom:"d4", lvl:4, type:"single", sec:95, tags:["custo-computacao"],
  case:"Uma organização com 120 contas no AWS Organizations quer ver, num só lugar, recomendações de tamanho para instâncias EC2 que levem em conta o uso de memória, para volumes EBS e para a memória das funções Lambda. Também quer uma lista de instâncias RDS e gateways NAT ociosos para desligar.",
  stem:"Qual solução atende?",
  opts:[
    {k:"A",t:"Ativar as recomendações de redimensionamento do Cost Explorer na conta de gerenciamento."},
    {k:"B",t:"Ativar o AWS Cost Anomaly Detection com monitores por conta e por serviço."},
    {k:"C",t:"Ativar o Compute Optimizer para a organização e instalar o agente do CloudWatch nas instâncias."},
    {k:"D",t:"Ativar o Compute Optimizer em cada conta, sem agente, e juntar as exportações com um script."}
  ],
  ans:["C"],
  why:{
    ok:"O Compute Optimizer recomenda tamanhos para EC2, EBS e Lambda e aponta recursos ociosos, entre eles instâncias RDS e gateways NAT. Ativado na conta de gerenciamento para a organização, mostra as recomendações de todas as contas num só lugar. Para considerar a memória das instâncias EC2, é preciso instalar o agente do CloudWatch, porque essa métrica não é publicada por padrão.",
    A:"As recomendações de redimensionamento do Cost Explorer tratam só de instâncias EC2. Não cobrem EBS, Lambda nem recursos ociosos de RDS e NAT, e a própria AWS hoje indica o Cost Optimization Hub no lugar delas.",
    B:"O Cost Anomaly Detection aponta gastos fora do padrão, mas não recomenda tamanhos nem lista recursos ociosos.",
    D:"Sem o agente, as recomendações de EC2 não consideram a memória. E juntar exportações conta por conta cria trabalho manual que a ativação para a organização já resolve."
  },
  src:[{t:"What is AWS Compute Optimizer?",u:"https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html"},{t:"EC2 instance metrics analyzed",u:"https://docs.aws.amazon.com/compute-optimizer/latest/ug/ec2-metrics-analyzed.html"}]
},
{
  id:"saa-d4-37", exam:"saa", dom:"d4", lvl:4, type:"yn", sec:90, tags:["custo-armazenamento"],
  stem:"Responda Sim ou Não para cada afirmação sobre o ciclo de vida e o armazenamento a frio no AWS Backup.",
  rows:[
    {t:"Um plano de backup pode mover backups do Amazon EFS para o armazenamento a frio depois de um número de dias definido.",a:true,e:"O Amazon EFS está entre os recursos que aceitam transição para o armazenamento a frio no ciclo de vida do AWS Backup, com backups incrementais."},
    {t:"Se um backup vai para o armazenamento a frio após 30 dias, a retenção total precisa ser de pelo menos 120 dias.",a:true,e:"O AWS Backup exige que o backup fique no mínimo 90 dias no armazenamento a frio, então a retenção precisa ser 90 dias maior que o prazo de transição: 30 + 90 = 120."},
    {t:"Instantâneos do Amazon RDS feitos pelo AWS Backup também podem ser movidos para o armazenamento a frio pelo ciclo de vida.",a:false,e:"O RDS não está na lista de recursos com armazenamento a frio. A lista inclui, entre outros, EFS, EBS (pelo EBS Snapshot Archive), DynamoDB com recursos avançados, Timestream e SAP HANA em EC2."},
    {t:"Depois que um backup foi para o armazenamento a frio, dá para mudar o prazo de transição e trazê-lo de volta ao armazenamento quente.",a:false,e:"A documentação diz que o prazo de transição não pode ser alterado depois que o backup já foi para o armazenamento a frio."}
  ],
  src:[{t:"Backup plan options and configuration",u:"https://docs.aws.amazon.com/aws-backup/latest/devguide/plan-options-and-configuration.html"}]
}
];
QUESTIONS_EXTRA.push(...QUESTIONS_CLF_E);
QUESTIONS_SAA.push(...QUESTIONS_SAA_E);
