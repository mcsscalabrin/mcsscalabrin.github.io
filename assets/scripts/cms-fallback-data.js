(function () {
    window.Portfolio = window.Portfolio || {};

    const projects = [
        {
            id: 'ruins',
            slug: 'ruins',
            type: 'game',
            title: 'Ruins of The Sacred Tree',
            role: 'Cofundador e desenvolvedor principal',
            meta: 'Cofundador & Desenvolvedor Principal · Pomegranade Studios',
            summary: 'Jogo 2D autoral criado em Unity e C#. Atuei como cofundador e desenvolvedor principal, da arquitetura de gameplay à apresentação do projeto na Brasil Game Show.',
            context: 'Ruins começou como projeto do curso técnico de jogos e virou um produto jogável. O desafio foi manter o loop de ação simples, separar responsabilidades no código e fechar um escopo que a equipe conseguisse testar e apresentar.',
            cardItems: [
                { label: 'Problema', text: 'Criar um jogo autoral com gameplay legível e uma base de código que permitisse iterar sem quebrar sistemas existentes.' },
                { label: 'Papel', text: 'Cofundador, desenvolvedor principal e apresentador técnico do produto.' },
                { label: 'Decisão', text: 'Separar gameplay, interface e áudio em sistemas independentes no Unity com C#.' },
                { label: 'Resultado', text: 'Protótipo jogável validado em banca e apresentado ao público na Brasil Game Show.' }
            ],
            responsibilities: [
                'Desenvolvi sistemas de gameplay, estados de interface e integração de áudio em Unity e C#.',
                'Ajudei a priorizar mecânicas, organizar o escopo e preparar a apresentação do produto.',
                'Apresentei o jogo em banca e ao público da Brasil Game Show.'
            ],
            technicalDecisions: [
                'Separar gameplay, interface e áudio para reduzir dependências entre os sistemas.',
                'Validar o loop principal antes de ampliar o conjunto de mecânicas.',
                'Tratar feedback visual e áudio como parte da leitura do gameplay.'
            ],
            learnings: [
                'Um protótipo jogável depende de escopo curto, feedback rápido e testes frequentes.',
                'Apresentar para pessoas fora da equipe expõe problemas que passam despercebidos durante o desenvolvimento.',
                'Acordos simples de arquitetura ajudam a equipe a trabalhar no mesmo código.'
            ],
            stack: ['Unity', 'C#', 'Game Design', 'Product Architecture', 'Pitching'],
            repositoryUrl: '',
            projectUrl: 'https://pomegranade-studios.itch.io/',
            projectUrlLabel: 'Jogar na itch.io',
            media: [
                {
                    src: 'assets/images/projects/ruins/ruins-banner.jpeg',
                    alt: 'Banner do jogo Ruins of The Sacred Tree com personagem sob a árvore sagrada',
                    caption: 'Banner e identidade visual do jogo.',
                    tone: 'color',
                    isCover: true
                },
                {
                    src: 'assets/images/projects/ruins/ruins-logo.png',
                    alt: 'Logo do personagem de Ruins of The Sacred Tree',
                    caption: 'Logo/personagem usado como marca do projeto.',
                    tone: 'logo',
                    isCover: false
                },
                {
                    src: 'assets/images/projects/ruins/bgs-team.jpeg',
                    alt: 'Turma do curso técnico de jogos no stand da FECAP na BGS',
                    caption: 'Apresentação pública do projeto na Brasil Game Show.',
                    tone: 'photo',
                    isCover: false
                }
            ]
        },
        {
            id: 'soil',
            slug: 'soil',
            type: 'iot',
            title: 'Sensor de Solo Inteligente',
            role: 'Lógica embarcada, montagem e validação prática',
            meta: 'IoT / Eletrônica · Protótipo de Hardware',
            summary: 'Protótipo IoT com Arduino e C++ para medir a umidade do solo e emitir alertas sem oscilar a cada leitura do sensor.',
            context: 'O sensor entregava valores diferentes conforme o solo, a umidade e o ruído elétrico. Por isso, o trabalho não terminou na montagem do circuito: foi preciso tratar os dados e calibrar o protótipo em condições reais.',
            cardItems: [
                { label: 'Problema', text: 'Medir a umidade do solo sem transformar ruído elétrico em alertas falsos.' },
                { label: 'Papel', text: 'Implementei a lógica embarcada, montei o circuito e conduzi os testes do protótipo.' },
                { label: 'Decisão', text: 'Suavizar as leituras em C++ e calibrar os limites com diferentes amostras de solo.' },
                { label: 'Resultado', text: 'Protótipo funcional com alertas mais estáveis e menos oscilações na leitura.' }
            ],
            responsibilities: [
                'Implementei a lógica embarcada em C++ para leitura e tratamento dos dados.',
                'Montei o circuito e testei o sensor em diferentes níveis de umidade.',
                'Registrei valores de calibração para reduzir alertas falsos.'
            ],
            technicalDecisions: [
                'Usar suavização de leitura para evitar alertas instáveis.',
                'Separar a leitura bruta, o tratamento dos dados e o alerta ao usuário.',
                'Calibrar os limites a partir de testes, em vez de depender apenas do valor nominal do sensor.'
            ],
            learnings: [
                'Hardware precisa ser testado fora do cenário ideal.',
                'Um número só é útil quando o usuário entende o que fazer com ele.',
                'Calibração e tratamento de ruído mudam a confiabilidade do protótipo.'
            ],
            stack: ['Arduino', 'C++', 'IoT', 'Sensoriamento', 'Prototipagem'],
            repositoryUrl: '',
            projectUrl: '',
            projectUrlLabel: '',
            media: [
                {
                    src: 'assets/images/plant_moisture_monitor.jpg',
                    alt: 'Protótipo visual de sensor inteligente para planta',
                    caption: 'Protótipo de monitoramento de umidade.',
                    tone: 'photo',
                    isCover: true
                }
            ]
        },
        {
            id: 'pc-setup',
            slug: 'pc-setup',
            type: 'software',
            title: 'PC Setup Assistant',
            role: 'Fluxo de produto, regras de compatibilidade e UX',
            meta: 'Algoritmos & UX · Aplicação de Auxílio ao Consumidor',
            summary: 'Aplicação web em TypeScript que orienta a escolha de peças compatíveis para montar um computador.',
            context: 'Montar um PC exige cruzar socket, barramento, memória e potência. O projeto organiza essas regras em uma sequência de escolhas e explica os conflitos sem despejar todos os termos técnicos de uma vez.',
            cardItems: [
                { label: 'Problema', text: 'Ajudar quem monta um PC a evitar combinações incompatíveis de componentes.' },
                { label: 'Papel', text: 'Modelei o fluxo, a arquitetura da informação e as regras de compatibilidade.' },
                { label: 'Decisão', text: 'Separar as regras da interface e validar socket, barramento e potência a cada etapa.' },
                { label: 'Resultado', text: 'Fluxo guiado com uma base preparada para receber novas peças e regras.' }
            ],
            responsibilities: [
                'Desenhei a ordem das escolhas e os pontos em que cada regra precisa ser validada.',
                'Modelei compatibilidade entre peças, sockets, barramentos e potência.',
                'Escrevi mensagens que explicam o conflito e indicam como corrigir a seleção.'
            ],
            technicalDecisions: [
                'Manter as regras de compatibilidade fora da camada visual.',
                'Validar cada escolha no momento certo, sem acumular erros no final.',
                'Estruturar os dados para uma futura integração com catálogos externos.'
            ],
            learnings: [
                'Uma regra técnica precisa ser correta e fácil de explicar.',
                'Validações progressivas reduzem retrabalho durante a escolha.',
                'Dados estruturados são essenciais para ampliar o catálogo sem espalhar regras pelo código.'
            ],
            stack: ['TypeScript', 'UX Design', 'System Design', 'Algorithms', 'Product Thinking'],
            repositoryUrl: '',
            projectUrl: '',
            projectUrlLabel: '',
            media: [
                {
                    src: 'assets/images/pc_builder_app.jpg',
                    alt: 'Interface do PC Setup Assistant',
                    caption: 'Interface do assistente de montagem de PC.',
                    tone: 'photo',
                    isCover: true
                }
            ]
        },
        {
            id: 'pulso',
            slug: 'pulso',
            type: 'software',
            title: 'PULSO — Streetwear Tátil',
            role: 'Front-end e camada de acessibilidade por voz',
            meta: 'Front-end & Acessibilidade · Landing page de marca',
            summary: 'Landing page em React e TypeScript para uma marca de streetwear com identidade tátil, com camada de leitura por voz construída sobre a Web Speech API.',
            context: 'A marca propõe roupa que uma pessoa cega reconhece pelo toque, com etiqueta em braille e costura identificável. O site precisava sustentar essa premissa: não bastava ser bonito, tinha que ser percorrível sem enxergar.',
            cardItems: [
                { label: 'Problema', text: 'Fazer uma landing page de moda que uma pessoa cega consiga percorrer sozinha, com autonomia real.' },
                { label: 'Papel', text: 'Desenvolvi a interface em React e TypeScript e a camada de acessibilidade por voz.' },
                { label: 'Decisão', text: 'Usar a Web Speech API nativa, isolar o text-to-speech em um hook e guardar as preferências no navegador.' },
                { label: 'Resultado', text: 'Site com leitura automática ao navegar por Tab, atalhos de teclado e controles de velocidade, volume e tom da voz.' }
            ],
            responsibilities: [
                'Estruturei a landing page em React, Vite e TypeScript, com Tailwind sustentando o sistema visual.',
                'Implementei o hook de text-to-speech: fala, interrupção, persistência e detecção de suporte do navegador.',
                'Escrevi os textos de leitura e liguei a narração ao foco do teclado.'
            ],
            technicalDecisions: [
                'Concentrar estado, efeitos e persistência da voz em um único hook, fora dos componentes visuais.',
                'Manter uma região ARIA viva atualizada mesmo com a voz desligada, para não excluir quem já usa leitor de tela próprio.',
                'Salvar velocidade, volume e tom no localStorage para a configuração sobreviver ao recarregamento.'
            ],
            learnings: [
                'Acessibilidade decidida no início do design custa menos do que adaptação no fim.',
                'O navegador bloqueia áudio antes da primeira interação — a interface precisa de um caminho alternativo.',
                'Voz é preferência pessoal: velocidade, volume e tom pertencem a quem ouve, não a quem programa.'
            ],
            stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Web Speech API'],
            repositoryUrl: '',
            projectUrl: '',
            projectUrlLabel: '',
            media: [
                {
                    src: 'assets/images/projects/pulso/pulso-cover.jpg',
                    alt: 'Home da PULSO em fundo preto, com a marca escrita em braille acima do título Moda que você sente',
                    caption: 'A marca aparece primeiro em braille, antes do nome em letras.',
                    tone: 'color',
                    isCover: true
                }
            ]
        },
        {
            id: 'tripflow',
            slug: 'tripflow',
            type: 'software',
            title: 'TripFlow',
            role: 'Arquitetura do app e algoritmo de acerto de contas',
            meta: 'Mobile · App de viagem em grupo',
            summary: 'App em React Native e TypeScript para organizar viagem em grupo — roteiro, checklist e despesas — que reduz o acerto de contas à menor lista possível de transferências.',
            context: 'Dividir gasto em grupo termina em uma tabela confusa de quem deve a quem. O app calcula o saldo de cada pessoa e cruza devedores com credores até zerar, entregando apenas os pagamentos que realmente precisam acontecer.',
            cardItems: [
                { label: 'Problema', text: 'Fechar as contas de uma viagem em grupo sem uma lista longa de pagamentos cruzados.' },
                { label: 'Papel', text: 'Defini a arquitetura do app e implementei o algoritmo de acerto de contas.' },
                { label: 'Decisão', text: 'Calcular saldos em centavos e cruzar devedores e credores até quitar ambos a cada etapa.' },
                { label: 'Resultado', text: 'MVP local com roteiro, checklist, despesas e acerto de contas, sem back-end nem cadastro.' }
            ],
            responsibilities: [
                'Separei o app em contexto de estado, telas, serviço de persistência e utilitários de domínio.',
                'Implementei o cálculo de saldos e a redução para a menor lista de transferências diretas.',
                'Persisti viagens, participantes, atividades, tarefas e despesas no AsyncStorage do dispositivo.'
            ],
            technicalDecisions: [
                'Trabalhar em centavos com inteiros, para dinheiro não acumular erro de ponto flutuante.',
                'Distribuir o resto da divisão entre os primeiros participantes, para a soma das parcelas fechar com o total.',
                'Manter tudo no dispositivo no MVP, sem API nem autenticação, para validar o produto antes da infraestrutura.'
            ],
            learnings: [
                'Dinheiro em ponto flutuante quebra em silêncio; inteiro em centavos é a correção mais barata.',
                'Um MVP local entrega valor antes de qualquer decisão de back-end.',
                'Isolar a regra em função pura deixa o domínio verificável sem subir a interface.'
            ],
            stack: ['React Native', 'Expo', 'TypeScript', 'AsyncStorage', 'Mobile'],
            repositoryUrl: '',
            projectUrl: '',
            projectUrlLabel: '',
            media: [
                {
                    src: 'assets/images/projects/tripflow/tripflow-cover.jpg',
                    alt: 'Tela de gastos do TripFlow com o total da viagem e a lista de liquidações diretas entre os participantes',
                    caption: 'Quatro despesas viram três transferências diretas.',
                    tone: 'color',
                    isCover: true
                }
            ]
        },
        {
            id: 'sensivacc',
            slug: 'sensivacc',
            type: 'iot',
            title: 'SensiVacc',
            role: 'Back-end, banco de dados e integração do sensor',
            meta: 'IoT & Dados · Projeto de Pesquisa e Inovação, Grupo 09',
            summary: 'Plataforma de monitoramento térmico no transporte de vacinas: sensor Arduino, API em Node e MySQL, com dashboard que acusa quando a carga sai da faixa de 2 °C a 8 °C.',
            context: 'Vacina fora da faixa de 2 °C a 8 °C perde eficácia sem qualquer sinal visível na embalagem. O grupo precisava transformar a leitura de um sensor em histórico consultável e em alerta que chegasse a quem opera o transporte.',
            cardItems: [
                { label: 'Problema', text: 'Detectar a quebra da cadeia de frio no transporte de vacinas antes que a carga se perca.' },
                { label: 'Papel', text: 'Trabalhei no back-end em Node e MySQL, na modelagem das tabelas e na integração das leituras do sensor.' },
                { label: 'Decisão', text: 'Dividir o servidor em controllers, models e rotas e gravar cada medida com data e hora, em vez de exibir só o valor atual.' },
                { label: 'Resultado', text: 'Caminho completo do sensor ao dashboard, com histórico por veículo e alertas de temperatura fora da faixa.' }
            ],
            responsibilities: [
                'Implementei controllers, models e rotas em Express para medidas, avisos, empresas e usuários.',
                'Modelei as tabelas em MySQL e escrevi o script de criação usado por todo o grupo.',
                'Liguei a leitura serial do Arduino ao back-end e os dados persistidos ao dashboard.'
            ],
            technicalDecisions: [
                'Manter o padrão controller / model / rota para cinco pessoas mexerem no mesmo código sem colisão.',
                'Persistir cada medida com data e hora, permitindo consultar histórico e não apenas o instante atual.',
                'Fixar a faixa segura de 2 °C a 8 °C no firmware e no dashboard, para o alerta ter o mesmo critério nas duas pontas.'
            ],
            learnings: [
                'Um dado de sensor só vira decisão quando tem histórico e um limite explícito.',
                'Combinar a divisão de camadas antes de escrever código evita conflito em equipe.',
                'O rodízio de Scrum Master e Product Owner obriga cada pessoa a entender o projeto inteiro.'
            ],
            stack: ['Node.js', 'Express', 'MySQL', 'Arduino', 'Chart.js'],
            repositoryUrl: 'https://github.com/mcsscalabrin/Grupo09-PI',
            projectUrl: '',
            projectUrlLabel: '',
            media: [
                {
                    src: 'assets/images/projects/sensivacc/sensivacc-cover.jpg',
                    alt: 'Home da SensiVacc com o título Bem vindo à SensiVacc e o bloco Nossos valores',
                    caption: 'Site institucional que dá entrada no painel de monitoramento.',
                    tone: 'color',
                    isCover: true
                }
            ]
        },
        {
            id: 'beach-tennis',
            slug: 'beach-tennis',
            type: 'software',
            title: 'Conheça o Mundo do Beach Tennis',
            role: 'Projeto individual full stack, do banco à interface',
            meta: 'Full Stack · Projeto Individual, SPTech',
            summary: 'Site full stack sobre Beach Tennis em Node.js, Express e MySQL, com ranking de atletas, quiz pontuado, cadastro de usuários e fórum.',
            context: 'A informação sobre o esporte em português está espalhada e incompleta. O projeto reúne história, regras e ranking em um lugar só e usa o quiz para dar ao visitante um motivo para voltar.',
            cardItems: [
                { label: 'Problema', text: 'Reunir em português a informação dispersa sobre Beach Tennis e dar ao visitante um motivo para voltar.' },
                { label: 'Papel', text: 'Fiz o projeto sozinho — banco, API, telas e conteúdo.' },
                { label: 'Decisão', text: 'Organizar o servidor em controller, model e rota por domínio, com o quiz gravando cada tentativa no banco.' },
                { label: 'Resultado', text: 'Site com autenticação, quiz pontuado, ranking de atletas e fórum, rodando sobre MySQL.' }
            ],
            responsibilities: [
                'Modelei o banco em MySQL e escrevi o script de criação das tabelas.',
                'Implementei rotas e controllers para usuários, quiz, estatísticas, atletas e vídeos.',
                'Construí as telas, o quiz e a lógica de sessão no navegador.'
            ],
            technicalDecisions: [
                'Um controller e um model por domínio, em vez de concentrar tudo no arquivo do servidor.',
                'Registrar acertos e erros de cada tentativa do quiz, para gerar estatística depois.',
                'Validar os campos obrigatórios na rota antes de a requisição chegar ao banco.'
            ],
            learnings: [
                'Percorrer sozinho o caminho todo, do banco à tela, mostra onde cada camada realmente começa.',
                'Guardar a tentativa, e não só o resultado, abre espaço para estatísticas que não estavam no plano inicial.',
                'Conteúdo é parte do produto: sem texto e imagem, a funcionalidade não se sustenta.'
            ],
            stack: ['Node.js', 'Express', 'MySQL', 'JavaScript', 'HTML/CSS'],
            repositoryUrl: 'https://github.com/mcsscalabrin/projeto-individual-1sisa',
            projectUrl: '',
            projectUrlLabel: '',
            media: [
                {
                    src: 'assets/images/projects/beach-tennis/beach-tennis-cover.jpg',
                    alt: 'Home do site com o título Conheça o Mundo do Beach Tennis e o bloco de login e cadastro',
                    caption: 'Entrada do site, com acesso ao quiz e ao ranking.',
                    tone: 'color',
                    isCover: true
                }
            ]
        }
    ];

    window.Portfolio.fallbackData = {
        contentBlocks: {
            hero: {
                title: 'Matheus Scalabrin',
                subtitle: 'Engenharia de software para backend, automação e produtos digitais.',
                description: 'Estudante de Sistemas de Informação na SPTech e estagiário de Engenharia de TI no Itaú Unibanco. Atuação com APIs, RBAC, SRE, Power Platform e automação de processos.'
            },
            profile: {
                name: 'Matheus Scalabrin',
                title: 'Sistemas de Informação / Engenharia de TI / Desenvolvimento de Software',
                bio: [
                    'Sou estudante de Sistemas de Informação na SPTech e estagiário de Engenharia de TI no Itaú Unibanco. Atuo com backend, automação, APIs, controle de acesso e confiabilidade de sistemas.',
                    'Também desenvolvo projetos de produto digital, IoT e games. Gosto de entender o problema antes de escolher a tecnologia, registrar as decisões e deixar o código simples de operar e evoluir.'
                ]
            },
            contact: {
                title: 'Falar com Matheus',
                subtitle: 'Contato por e-mail, LinkedIn ou Instagram para conversar sobre engenharia de software, automação, produto e oportunidades.',
                email: 'mcsscalabrin@gmail.com'
            },
            seo: {
                title: 'Matheus Scalabrin | Backend, Automação e Confiabilidade',
                description: 'Matheus Scalabrin é engenheiro de software e resolvedor de problemas. Estagiário de Engenharia de TI no Itaú Unibanco, com RBAC, SRE, APIs e automação em produção — e casos autorais que vão de jogo publicado a IoT, mobile e acessibilidade.',
                image: 'assets/images/profile/matheus-scalabrin.jpg'
            }
        },
        projects,
        experiences: [
            {
                company: 'Itaú Unibanco',
                role: 'Estagiário em Engenharia de TI',
                period: 'Jan. de 2026 - Atual',
                badge: 'Engenharia de TI',
                logoUrl: 'assets/images/experience/itau-unibanco.png',
                highlights: [
                    { title: 'RBAC e micro-frontends', text: 'Apoio ao desenvolvimento de controles de acesso baseados em papéis (RBAC) para micro-frontends, com permissões organizadas por contexto e responsabilidade.' },
                    { title: 'SRE e resiliência', text: 'Participação em testes de resiliência e em fluxos de governança para homologação de mudanças (GMUD).' },
                    { title: 'APIs e automação', text: 'Desenvolvimento de integrações via APIs e automações com Power Platform para processos internos de segurança e provisionamento.' }
                ],
                stack: ['Power Platform', 'SRE', 'RBAC', 'Micro-frontends', 'GMUD', 'APIs REST']
            },
            {
                company: 'SPTech',
                role: 'Sistemas de Informação',
                period: '2025 - Presente',
                badge: 'Graduação',
                logoUrl: 'assets/images/experience/sptech-school.png',
                highlights: [
                    { title: 'Formação em Sistemas de Informação', text: 'Curso de Sistemas de Informação com projetos em algoritmos, software, IoT e produto digital.' }
                ],
                stack: ['Arquitetura', 'Algoritmos', 'Produto']
            },
            {
                company: 'Pomegranade Studios',
                role: 'Cofundador · Ruins of The Sacred Tree',
                period: '2024',
                badge: 'Game studio',
                logoUrl: 'assets/images/experience/pomegranade-studios.png',
                highlights: [
                    { title: 'Produto jogável', text: 'Protótipo validado em banca de negócios e apresentado ao público na Brasil Game Show.' }
                ],
                stack: ['Unity', 'C#', 'Game Design', 'BGS']
            }
        ],
        skills: [
            { group: 'Linguagens e desenvolvimento', items: ['Java', 'C#', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML', 'CSS'] },
            { group: 'Backend, infraestrutura e automação', items: ['APIs REST', 'Power Platform', 'Docker', 'Linux', 'Git & GitHub', 'SRE', 'Cloud Computing'] },
            { group: 'Produto e arquitetura', items: ['System Design', 'Algoritmos', 'UX/UI Design', 'Product Thinking', 'Metodologias Ágeis', 'Inteligência Artificial'] },
            { group: 'Trabalho em equipe', items: ['Comunicação', 'Organização', 'Resolução de Problemas', 'Adaptabilidade', 'Proatividade'] }
        ],
        certificates: [
            {
                name: 'Associate - Generative AI',
                issuer: 'Itaú Unibanco',
                issuedAt: '2026-03-24',
                credentialId: 'fd3a3418-fdaa-4f42-bfcd-9695f5cd976c',
                credentialUrl: 'https://www.credly.com/badges/fd3a3418-fdaa-4f42-bfcd-9695f5cd976c/public_url',
                description: 'Conhecimentos sobre fundamentos e arquiteturas de IA generativa, bancos de dados vetoriais, armazenamento e processamento de dados, engenharia de prompt e diretrizes para criação de modelos. Esta credencial não expira.',
                skills: ['Artificial Intelligence (AI)', 'Data Driven Instruction', 'Data Science'],
                imageUrl: 'assets/images/certificates/associate-generative-ai.png',
                published: true,
                sortOrder: 10
            },
            {
                name: 'Automação No/Low Code - Foundation',
                issuer: 'Itaú Unibanco',
                issuedAt: '2026-05-13',
                credentialId: '2bb39556-378f-43d4-9dbd-0ef8e7d03e36',
                credentialUrl: 'https://www.credly.com/badges/2bb39556-378f-43d4-9dbd-0ef8e7d03e36/public_url',
                description: 'Compreensão fundamental das tecnologias e abordagens No/Low Code, suas principais aplicações, vantagens e ferramentas para otimizar processos e promover inovação. Esta credencial não expira.',
                skills: ['Automação No e Low Code', 'Low Code', 'No Code'],
                imageUrl: 'assets/images/certificates/automacao-no-low-code-foundation.png',
                published: true,
                sortOrder: 20
            },
            {
                name: 'SRE - Trained (pt-BR)',
                issuer: 'Itaú Unibanco',
                issuedAt: '2026-03-13',
                credentialId: '3e71c177-6215-4d0b-816b-5145fd814a4f',
                credentialUrl: 'https://www.credly.com/badges/3e71c177-6215-4d0b-816b-5145fd814a4f/public_url',
                description: 'Práticas e ferramentas de observabilidade para desenvolver aplicações mais confiáveis e disponíveis, combinando fundamentos teóricos e aplicação prática. Esta credencial não expira.',
                skills: ['APM com AppDynamics', 'Observability', 'SRE Foundation'],
                imageUrl: 'assets/images/certificates/sre-trained-pt-br.png',
                published: true,
                sortOrder: 30
            }
        ],
        socialLinks: [
            { name: 'LinkedIn', label: 'matheus-scalabrin', url: 'https://www.linkedin.com/in/matheus-scalabrin/' },
            { name: 'GitHub', label: 'mcsscalabrin', url: 'https://github.com/mcsscalabrin' },
            { name: 'Instagram', label: 'scalabrin.dev', url: 'https://www.instagram.com/scalabrin.dev/' }
        ],
        kudosSummary: { count: 0 }
    };
})();
