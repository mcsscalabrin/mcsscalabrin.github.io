(function () {
    window.Portfolio = window.Portfolio || {};

    let mobileMenuBtn = null;
    let mobileNav = null;

    function closeMobileNav() {
        if (!mobileMenuBtn || !mobileNav) return;
        mobileNav.hidden = true;
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Abrir navegação');
        document.body.classList.remove('mobile-nav-open');
    }

    function toggleMobileNav() {
        if (!mobileMenuBtn || !mobileNav) return;
        const isOpen = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileNav.hidden = isOpen;
        mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
        mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Abrir navegação' : 'Fechar navegação');
        document.body.classList.toggle('mobile-nav-open', !isOpen);
    }

    function bindSmoothLinks() {
        const links = document.querySelectorAll('.nav-link, .mobile-nav-link, .hero-ctas a, .logo');

        links.forEach(link => {
            link.addEventListener('click', event => {
                const href = link.getAttribute('href');
                if (!href || !href.startsWith('#')) return;

                const targetElement = document.getElementById(href.slice(1));
                if (!targetElement) return;

                event.preventDefault();
                closeMobileNav();
                window.Portfolio.utils.smoothScrollTo(targetElement);
            });
        });
    }

    function init() {
        mobileMenuBtn = document.getElementById('mobile-menu-btn');
        mobileNav = document.getElementById('mobile-nav');

        if (mobileMenuBtn && mobileNav) {
            mobileMenuBtn.addEventListener('click', toggleMobileNav);
            mobileNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeMobileNav);
            });
        }

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeMobileNav();
            }
        });

        bindSmoothLinks();
    }

    window.Portfolio.navigation = {
        init,
        closeMobileNav
    };
})();
