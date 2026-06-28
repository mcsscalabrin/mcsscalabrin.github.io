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
            summary: 'Jogo autoral desenvolvido no curso técnico de jogos, com foco em loop de ação legível, identidade visual própria e uma base técnica flexível em Unity/C#.',
            context: 'O projeto nasceu como uma experiência prática de criação de produto: transformar uma ideia de jogo em protótipo jogável, com direção de gameplay, apresentação técnica e validação pública.',
            cardItems: [
                { label: 'Problema', text: 'Construir um jogo autoral com loop de ação legível e arquitetura flexível para evoluir mecânicas.' },
                { label: 'Papel', text: 'Cofundador, desenvolvedor principal e apresentador técnico do produto.' },
                { label: 'Decisão', text: 'Estruturar sistemas desacoplados em Unity/C# para gameplay, áudio e estados de interface.' },
                { label: 'Resultado', text: 'Produto validado em banca de negócios e apresentado ao público na Brasil Game Show.' }
            ],
            responsibilities: [
                'Estruturei sistemas de gameplay, estados de interface e integração de áudio em Unity/C#.',
                'Atuei na priorização de mecânicas, organização de escopo e apresentação do produto.',
                'Participei da validação do jogo em banca e da exposição pública na Brasil Game Show.'
            ],
            technicalDecisions: [
                'Separar responsabilidades de gameplay, UI e áudio para facilitar iteração.',
                'Manter a leitura do loop principal simples antes de expandir mecânicas.',
                'Tratar apresentação e narrativa visual como parte do produto, não só como acabamento.'
            ],
            learnings: [
                'Produto jogável precisa de escopo claro, feedback rápido e comunicação visual consistente.',
                'Apresentar para público real muda a percepção de prioridade técnica e experiência.',
                'Trabalho em equipe exige acordos de arquitetura, ritmo e linguagem comum.'
            ],
            stack: ['Unity', 'C#', 'Game Design', 'Product Architecture', 'Pitching'],
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
            summary: 'Protótipo IoT para monitoramento de umidade do solo com leituras mais estáveis em ambiente sujeito a ruído elétrico.',
            context: 'O projeto partiu de um problema físico simples, mas cheio de variáveis: solo, umidade, sensor, ruído e interpretação correta do dado.',
            cardItems: [
                { label: 'Problema', text: 'Monitorar umidade de solo com leitura confiável em ambiente sujeito a ruído elétrico.' },
                { label: 'Papel', text: 'Responsável pela lógica embarcada, montagem do circuito e validação prática do protótipo.' },
                { label: 'Decisão', text: 'Aplicar suavização de leitura em C++ e calibrar a curva por ensaios com diferentes solos.' },
                { label: 'Resultado', text: 'Protótipo funcional com alertas mais estáveis e menor sensibilidade a leituras falsas.' }
            ],
            responsibilities: [
                'Implementei a lógica embarcada em C++ para leitura e tratamento dos dados.',
                'Montei o circuito, testei sensores e conduzi validações práticas com diferentes condições.',
                'Organizei uma base de calibração para reduzir leituras falsas.'
            ],
            technicalDecisions: [
                'Usar suavização de leitura para evitar alertas instáveis.',
                'Separar leitura bruta, interpretação e feedback do protótipo.',
                'Validar a curva de umidade com ensaios em condições diferentes.'
            ],
            learnings: [
                'Hardware exige tolerância a ruído e validação empírica.',
                'Uma leitura numérica só vira produto quando o usuário entende o estado real.',
                'Pequenas decisões de calibração mudam muito a confiabilidade percebida.'
            ],
            stack: ['Arduino', 'C++', 'IoT', 'Sensoriamento', 'Prototipagem'],
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
            summary: 'Aplicação para reduzir o atrito técnico na escolha de peças compatíveis para montagem de computadores.',
            context: 'A proposta é transformar um processo cheio de termos técnicos em uma experiência guiada, clara e segura para decisão de compra.',
            cardItems: [
                { label: 'Problema', text: 'Reduzir o atrito técnico na escolha de peças compatíveis para montagem de computadores.' },
                { label: 'Papel', text: 'Desenho de fluxo, arquitetura de informação e regras de compatibilidade do produto.' },
                { label: 'Decisão', text: 'Organizar validações por sockets, barramentos e potência em uma experiência guiada.' },
                { label: 'Resultado', text: 'Fluxo de decisão mais simples, com base escalável para novas peças e integrações futuras.' }
            ],
            responsibilities: [
                'Desenhei o fluxo de escolha, a arquitetura de informação e os pontos de validação.',
                'Modelei regras de compatibilidade entre peças, sockets, barramentos e potência.',
                'Organizei a experiência para orientar sem sobrecarregar o usuário.'
            ],
            technicalDecisions: [
                'Separar regras de compatibilidade da camada visual para facilitar evolução.',
                'Criar validações progressivas em vez de mostrar todos os erros de uma vez.',
                'Preparar a base para futura integração com catálogo/dados externos.'
            ],
            learnings: [
                'UX técnica boa reduz ansiedade e torna sistemas complexos mais acessíveis.',
                'Regras precisam ser explicáveis, não apenas corretas.',
                'O próximo salto natural é alimentar o produto por dados estruturados.'
            ],
            stack: ['TypeScript', 'UX Design', 'System Design', 'Algorithms', 'Product Thinking'],
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
                subtitle: 'Engenharia de software com visão de produto, automação e sistemas de alta escala.',
                description: 'Estudante de Sistemas de Informação na SPTech e estagiário de Engenharia de TI no Itaú Unibanco. Conecto rigor corporativo, pensamento de produto e execução técnica para transformar complexidade em sistemas claros.'
            },
            profile: {
                name: 'Matheus Scalabrin',
                title: 'Engenharia de Software / Automação / Produto',
                bio: [
                    'Minha jornada na tecnologia é focada em entender como sistemas robustos funcionam e como traduzi-los em fluxos eficientes. Transito entre backend corporativo, automação operacional e desenho de experiências digitais.',
                    'Atualmente focado em Arquitetura de Sistemas, DevOps/SRE, Inteligência Artificial e Power Platform, com atenção especial à resiliência e à clareza operacional.'
                ]
            },
            contact: {
                title: 'Falar com Matheus',
                subtitle: 'Entre em contato para propostas de projetos ou conexões de carreira.',
                email: 'mcsscalabrin@gmail.com'
            },
            seo: {
                title: 'Matheus Scalabrin | Portfolio',
                description: 'Portfólio de Engenharia de Software e Desenvolvimento de Produtos Digitais. Focado em resiliência, automação e simplicidade.',
                image: 'assets/images/projects/ruins/ruins-banner.jpeg'
            }
        },
        projects,
        experiences: [
            {
                company: 'Itaú Unibanco',
                role: 'Analista de Engenharia de TI - Estagiário',
                period: 'Jan 2026 - Presente',
                badge: 'Corporativo / Alta Escala',
                highlights: [
                    { title: 'Micro Frontends & Controle de Acesso', text: 'Suporte e desenvolvimento em iniciativas para controle de acesso estruturado (RBAC) em ecossistemas de micro-frontends de alta escala, aumentando a eficiência no gerenciamento de permissões.' },
                    { title: 'Práticas de Site Reliability Engineering (SRE)', text: 'Participação ativa em testes de resiliência de infraestrutura e fluxos internos de governança e homologação de mudanças (GMUD) críticos.' },
                    { title: 'Integrações de APIs & Automação de Processos', text: 'Modelagem de barramentos de integração e desenvolvimento de fluxos no/low-code corporativos para otimizar processos de segurança e provisionamento técnico.' }
                ],
                stack: ['Power Platform', 'SRE', 'RBAC', 'Micro Frontends', 'GMUD', 'API Integration']
            }
        ],
        skills: [
            { group: 'Programação', items: ['C#', 'Java', 'Python', 'JavaScript', 'TypeScript', 'HTML & CSS', 'Lógica de Programação'] },
            { group: 'Infraestrutura & Automação', items: ['Power Platform', 'APIs REST / Integrações', 'Git & GitHub', 'Docker', 'Linux', 'SRE / Resiliência', 'Cloud Computing'] },
            { group: 'Conceitos & Negócios', items: ['UX/UI Design', 'Product Thinking', 'Design Thinking', 'Metodologias Ágeis', 'Inteligência Artificial'] },
            { group: 'Habilidades Comportamentais', items: ['Comunicação', 'Liderança Situacional', 'Trabalho em Equipe', 'Resolução de Problemas', 'Organização', 'Adaptabilidade', 'Proatividade'] }
        ],
        socialLinks: [
            { name: 'LinkedIn', label: 'matheus-scalabrin', url: 'https://www.linkedin.com/in/matheus-scalabrin/' },
            { name: 'GitHub', label: 'mcsscalabrin', url: 'https://github.com/mcsscalabrin' },
            { name: 'Instagram', label: 'scalabrin.dev', url: 'https://www.instagram.com/scalabrin.dev/' }
        ],
        kudosSummary: { count: 0 }
    };
})();
