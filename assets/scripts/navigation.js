(function () {
    window.Portfolio = window.Portfolio || {};

    let mobileMenuBtn = null;
    let mobileNav = null;
    let lastFocusedElement = null;

    function getInertTargets() {
        return [document.getElementById('main-content'), document.querySelector('.station-footer')]
            .filter(Boolean);
    }

    function closeMobileNav() {
        if (!mobileMenuBtn || !mobileNav) return;
        if (mobileNav.hidden) return;

        mobileNav.hidden = true;
        mobileNav.removeAttribute('aria-modal');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Abrir navegação');
        document.body.classList.remove('mobile-nav-open');
        getInertTargets().forEach(element => element.removeAttribute('inert'));

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
        lastFocusedElement = null;
    }

    function openMobileNav() {
        if (!mobileMenuBtn || !mobileNav) return;

        lastFocusedElement = document.activeElement;
        mobileNav.hidden = false;
        mobileNav.setAttribute('aria-modal', 'true');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileMenuBtn.setAttribute('aria-label', 'Fechar navegação');
        document.body.classList.add('mobile-nav-open');
        getInertTargets().forEach(element => element.setAttribute('inert', ''));

        window.setTimeout(() => mobileNav.querySelector('a')?.focus(), 50);
    }

    function toggleMobileNav() {
        if (!mobileMenuBtn || !mobileNav) return;
        const isOpen = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        if (isOpen) closeMobileNav();
        else openMobileNav();
    }

    function trapMobileNavFocus(event) {
        if (mobileNav.hidden || event.key !== 'Tab') return;

        const focusable = Array.from(mobileNav.querySelectorAll(window.Portfolio.config.focusableSelector))
            .filter(element => !element.hasAttribute('disabled') && element.offsetParent !== null);
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function bindSmoothLinks() {
        const links = document.querySelectorAll('.station-nav a, .mobile-nav a, .board-actions a, .nameplate, .footer-row a');

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
            mobileNav.querySelector('[data-open-gate]')?.addEventListener('click', () => {
                closeMobileNav();
                window.Portfolio.utils.smoothScrollTo(document.getElementById('gate'));
            });
        }

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeMobileNav();
                return;
            }
            trapMobileNavFocus(event);
        });

        bindSmoothLinks();
    }

    window.Portfolio.navigation = {
        init,
        closeMobileNav
    };
})();
