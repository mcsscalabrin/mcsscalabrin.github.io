(function () {
    window.Portfolio = window.Portfolio || {};

    const domainContent = {
        systems: {
            title: 'Backend e integrações',
            text: 'APIs, controle de acesso baseado em papéis (RBAC) e micro-frontends.',
            evidence: 'Itaú Unibanco · SRE · Power Platform',
            color: '#22c55e',
            rgb: '34, 197, 94'
        },
        automation: {
            title: 'Automação',
            text: 'Automação de processos com Power Platform, Python e integrações REST.',
            evidence: 'Power Platform · Python · APIs',
            color: '#5eead4',
            rgb: '94, 234, 212'
        },
        product: {
            title: 'Produto',
            text: 'Projetos de software, IoT e games com foco em regras, interface e validação.',
            evidence: 'Ruins · Sensor IoT · PC Setup',
            color: '#8b5cf6',
            rgb: '139, 92, 246'
        }
    };

    function setDomain(domain) {
        const content = domainContent[domain];
        if (!content) return;

        const proof = document.querySelector('.domain-proof');
        const title = document.getElementById('domain-proof-title');
        const text = document.getElementById('domain-proof-text');
        const evidence = document.getElementById('domain-proof-evidence');

        document.documentElement.style.setProperty('--accent', content.color);
        document.documentElement.style.setProperty('--accent-rgb', content.rgb);

        document.querySelectorAll('[data-domain]').forEach(button => {
            const isActive = button.dataset.domain === domain;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });

        proof?.classList.add('is-changing');
        window.setTimeout(() => {
            if (title) title.innerText = content.title;
            if (text) text.innerText = content.text;
            if (evidence) evidence.innerText = content.evidence;
            proof?.classList.remove('is-changing');
        }, 130);
    }

    function updateReadingProgress() {
        const bar = document.getElementById('reading-progress-bar');
        if (!bar) return;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
        bar.style.width = `${progress * 100}%`;
    }

    function initSectionObserver() {
        const links = Array.from(document.querySelectorAll('.main-nav .nav-link'));
        const sections = links
            .map(link => link.getAttribute('href'))
            .filter(href => href && href.startsWith('#'))
            .map(href => document.querySelector(href))
            .filter(Boolean);
        if (!sections.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver(entries => {
            const visible = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible) return;

            links.forEach(link => {
                const isCurrent = link.getAttribute('href') === `#${visible.target.id}`;
                link.classList.toggle('is-current', isCurrent);
                if (isCurrent) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        }, {
            rootMargin: '-25% 0px -58% 0px',
            threshold: [0.05, 0.3, 0.6]
        });

        sections.forEach(section => observer.observe(section));
    }

    function initSceneDepth() {
        const scene = document.querySelector('.core-scene');
        if (!scene || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        scene.addEventListener('pointermove', event => {
            const rect = scene.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            scene.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 4}deg)`;
        });

        scene.addEventListener('pointerleave', () => {
            scene.style.transform = '';
        });
    }

    function init() {
        document.querySelectorAll('[data-domain]').forEach(button => {
            button.addEventListener('click', () => setDomain(button.dataset.domain));
        });

        document.querySelectorAll('[data-open-command]').forEach(button => {
            button.addEventListener('click', () => {
                window.Portfolio.navigation?.closeMobileNav?.();
                window.Portfolio.commandPalette?.open?.();
            });
        });

        window.addEventListener('scroll', updateReadingProgress, { passive: true });
        window.addEventListener('resize', updateReadingProgress);
        updateReadingProgress();
        initSectionObserver();
        initSceneDepth();
    }

    window.Portfolio.interactions = {
        init,
        setDomain
    };
})();
