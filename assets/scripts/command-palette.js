(function () {
    window.Portfolio = window.Portfolio || {};

    const config = window.Portfolio.config;
    let cmdPalette = null;
    let openCmdBtn = null;
    let cmdOverlay = null;
    let cmdSearchInput = null;
    let cmdItems = [];
    let lastFocusedElement = null;

    function isOpen() {
        return Boolean(cmdPalette && cmdPalette.classList.contains('open'));
    }

    function filterCommands(query) {
        const cleanQuery = query.toLowerCase().trim();
        let firstVisible = null;

        cmdItems.forEach(item => {
            const label = item.querySelector('span');
            const text = label ? label.innerText.toLowerCase() : '';
            const isVisible = text.includes(cleanQuery);

            item.style.display = isVisible ? 'flex' : 'none';
            item.setAttribute('aria-hidden', String(!isVisible));

            if (isVisible && !firstVisible) {
                firstVisible = item;
            } else {
                item.classList.remove('active');
            }
        });

        document.querySelectorAll('.cmd-k-group').forEach(group => {
            const visibleItems = Array.from(group.querySelectorAll('.cmd-k-item'))
                .filter(item => item.style.display !== 'none');
            group.style.display = visibleItems.length > 0 ? 'block' : 'none';
        });

        cmdItems.forEach(item => item.classList.remove('active'));
        if (firstVisible) firstVisible.classList.add('active');
    }

    function openPalette() {
        if (!cmdPalette || !cmdSearchInput) return;

        lastFocusedElement = document.activeElement;
        cmdPalette.classList.add('open');
        cmdPalette.setAttribute('aria-hidden', 'false');
        openCmdBtn?.setAttribute('aria-expanded', 'true');
        filterCommands('');

        window.setTimeout(() => cmdSearchInput.focus(), 50);
        document.body.classList.add('menu-open');
    }

    function closePalette() {
        if (!cmdPalette || !cmdSearchInput) return;

        cmdPalette.classList.remove('open');
        cmdPalette.setAttribute('aria-hidden', 'true');
        openCmdBtn?.setAttribute('aria-expanded', 'false');
        cmdSearchInput.value = '';
        filterCommands('');
        document.body.classList.remove('menu-open');

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    function executeCommand(item) {
        const action = item.getAttribute('data-action');

        if (action === 'scroll') {
            const targetElement = document.getElementById(item.getAttribute('data-target'));
            closePalette();
            window.setTimeout(() => window.Portfolio.utils.smoothScrollTo(targetElement), 200);
            return;
        }

        if (action === 'copy-email') {
            closePalette();
            window.Portfolio.contact.copyEmail();
            return;
        }

        if (action === 'download-resume') {
            closePalette();
            window.Portfolio.contact.downloadResume();
            return;
        }

        if (action === 'leave-kudos') {
            closePalette();
            window.setTimeout(() => window.Portfolio.kudos.addKudo({ source: 'palette' }), 120);
            return;
        }

        if (action === 'random-project') {
            closePalette();
            window.setTimeout(() => window.Portfolio.projects.showRandom(), 120);
            return;
        }

        if (action === 'open-project-detail') {
            closePalette();
            window.setTimeout(() => window.Portfolio.projects.openCurrentProjectDetail(), 120);
            return;
        }

        if (action === 'link') {
            const url = item.getAttribute('data-url');
            closePalette();
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    function handleGlobalKeys(event) {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            isOpen() ? closePalette() : openPalette();
        }

        if (event.key === 'Escape' && isOpen()) {
            closePalette();
        }

        if (event.key !== 'Tab' || !isOpen()) return;

        const focusable = Array.from(cmdPalette.querySelectorAll(config.focusableSelector))
            .filter(element => !element.hasAttribute('disabled') && element.offsetParent !== null);

        if (focusable.length === 0) return;

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

    function handleSearchKeys(event) {
        const visibleItems = cmdItems.filter(item => item.style.display !== 'none');
        if (visibleItems.length === 0) return;

        const activeIndex = Math.max(0, visibleItems.findIndex(item => item.classList.contains('active')));

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            const nextIndex = (activeIndex + 1) % visibleItems.length;
            visibleItems[activeIndex]?.classList.remove('active');
            visibleItems[nextIndex].classList.add('active');
            visibleItems[nextIndex].scrollIntoView({ block: 'nearest' });
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            const prevIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
            visibleItems[activeIndex]?.classList.remove('active');
            visibleItems[prevIndex].classList.add('active');
            visibleItems[prevIndex].scrollIntoView({ block: 'nearest' });
        } else if (event.key === 'Enter') {
            event.preventDefault();
            const activeItem = visibleItems[activeIndex];
            if (activeItem) executeCommand(activeItem);
        }
    }

    function init() {
        cmdPalette = document.getElementById('cmd-k-palette');
        openCmdBtn = document.getElementById('open-cmd-btn');
        cmdOverlay = document.getElementById('cmd-k-overlay');
        cmdSearchInput = document.getElementById('cmd-k-search-input');
        cmdItems = Array.from(document.querySelectorAll('.cmd-k-item'));

        if (!cmdPalette || !cmdSearchInput) return;

        cmdItems.forEach(item => {
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '-1');
            item.addEventListener('click', () => executeCommand(item));
        });

        document.addEventListener('keydown', handleGlobalKeys);
        openCmdBtn?.addEventListener('click', openPalette);
        cmdOverlay?.addEventListener('click', closePalette);
        cmdSearchInput.addEventListener('input', event => filterCommands(event.target.value));
        cmdSearchInput.addEventListener('keydown', handleSearchKeys);
        filterCommands('');
    }

    window.Portfolio.commandPalette = {
        init,
        open: openPalette,
        close: closePalette
    };
})();
