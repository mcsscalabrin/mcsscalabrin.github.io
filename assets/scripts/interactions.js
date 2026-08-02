(function () {
    window.Portfolio = window.Portfolio || {};

    function initSectionObserver() {
        const links = Array.from(document.querySelectorAll('.station-nav a'));
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
                link.classList.toggle('is-active', isCurrent);
                if (isCurrent) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        }, {
            rootMargin: '-25% 0px -58% 0px',
            threshold: [0.05, 0.3, 0.6]
        });

        sections.forEach(section => observer.observe(section));
    }

    function initBoardArrival() {
        const lines = document.querySelectorAll('.board-headline [data-flap]');
        if (!lines.length || !window.Flap) return;

        window.Flap.arrive(lines, 140);

        const board = document.querySelector('.board-headline');
        if (!board || !('IntersectionObserver' in window)) return;

        let away = false;
        let lastPost = performance.now();

        const observer = new IntersectionObserver(entries => {
            const entry = entries[entries.length - 1];
            if (!entry) return;

            if (!entry.isIntersecting) {
                away = true;
                return;
            }

            if (away && performance.now() - lastPost > 4000) {
                lastPost = performance.now();
                window.Flap.arrive(lines, 0);
            }
            away = false;
        }, { threshold: 0.35 });

        observer.observe(board);
    }

    function initIdlePlates() {
        const lines = document.querySelectorAll('.board-headline [data-flap]');
        if (!lines.length || !window.Flap || !window.Flap.idle) return;

        const board = document.querySelector('.board-headline');
        let inView = true;

        if (board && 'IntersectionObserver' in window) {
            inView = false;
            const observer = new IntersectionObserver(entries => {
                const entry = entries[entries.length - 1];
                if (entry) inView = entry.isIntersecting;
            }, { threshold: 0.2 });
            observer.observe(board);
        }

        window.Flap.idle(lines, { canRun: () => inView });
    }

    function initPlatformRails() {
        const platforms = document.querySelectorAll('.platform');
        if (!platforms.length || !('IntersectionObserver' in window)) return;

        document.documentElement.classList.add('rail-armed');

        const observer = new IntersectionObserver((entries, self) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-lit');
                self.unobserve(entry.target);
            });
        }, { threshold: 0.18 });

        platforms.forEach(platform => observer.observe(platform));
    }

    function init() {
        initBoardArrival();
        initIdlePlates();
        initPlatformRails();
        initSectionObserver();
    }

    window.Portfolio.interactions = { init };
})();
