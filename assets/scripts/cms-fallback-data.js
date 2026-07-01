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
                title: 'Matheus Scalabrin | Backend, Automação e Engenharia de Software',
                description: 'Portfólio de Matheus Scalabrin, estudante de Sistemas de Informação na SPTech e estagiário de Engenharia de TI no Itaú Unibanco. Projetos em backend, automação, SRE, IoT e games.',
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
