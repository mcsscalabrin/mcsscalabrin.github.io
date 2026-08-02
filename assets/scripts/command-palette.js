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

    function getInertTargets() {
        return [document.querySelector('.station-header'), document.getElementById('main-content'), document.querySelector('.station-footer')]
            .filter(Boolean);
    }

    function normalizeSearchText(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .toLowerCase()
            .trim();
    }

    function setActiveItem(item) {
        cmdItems.forEach(candidate => {
            candidate.classList.remove('is-active');
            candidate.setAttribute('aria-selected', 'false');
        });

        if (item) {
            item.classList.add('is-active');
            item.setAttribute('aria-selected', 'true');
        }

        cmdSearchInput?.setAttribute('aria-activedescendant', item ? item.id : '');
    }

    function searchIndexOf(item) {
        if (item.dataset.searchIndex) return item.dataset.searchIndex;
        const label = item.querySelector('span');
        const index = normalizeSearchText(
            [label ? label.innerText : '', item.getAttribute('data-keywords') || ''].join(' ')
        );
        item.dataset.searchIndex = index;
        return index;
    }

    function filterCommands(query) {
        const cleanQuery = normalizeSearchText(query);
        let firstVisible = null;
        let visibleCount = 0;

        cmdItems.forEach(item => {
            if (item.hidden) {
                item.style.display = 'none';
                return;
            }

            const isVisible = searchIndexOf(item).includes(cleanQuery);

            item.style.display = isVisible ? 'flex' : 'none';
            item.setAttribute('aria-hidden', String(!isVisible));

            if (isVisible) {
                visibleCount += 1;
                if (!firstVisible) firstVisible = item;
            }
        });

        document.querySelectorAll('.finder-group').forEach(group => {
            const visibleItems = Array.from(group.querySelectorAll('.finder-item'))
                .filter(item => item.style.display !== 'none');
            group.style.display = visibleItems.length > 0 ? 'block' : 'none';
        });

        setActiveItem(firstVisible);

        const emptyState = document.getElementById('finder-empty');
        if (emptyState) {
            emptyState.hidden = visibleCount > 0;
            if (visibleCount === 0) {
                const term = query.trim();
                emptyState.innerHTML = '';
                const line = document.createElement('span');
                line.textContent = term
                    ? `Nada com "${term}". Talvez você queira:`
                    : 'Talvez você queira:';
                emptyState.appendChild(line);

                ['gate', 'projects', 'route'].forEach(target => {
                    const shortcut = cmdItems.find(item => item.getAttribute('data-target') === target);
                    if (!shortcut) return;
                    shortcut.style.display = 'flex';
                    shortcut.setAttribute('aria-hidden', 'false');
                    shortcut.closest('.finder-group').style.display = 'block';
                    if (!firstVisible) {
                        firstVisible = shortcut;
                        setActiveItem(shortcut);
                    }
                });
            }
        }
    }

    function openPalette() {
        if (!cmdPalette || !cmdSearchInput) return;

        lastFocusedElement = document.activeElement;
        cmdPalette.classList.add('open');
        cmdPalette.setAttribute('aria-hidden', 'false');
        openCmdBtn?.setAttribute('aria-expanded', 'true');
        cmdSearchInput.setAttribute('aria-expanded', 'true');
        filterCommands('');

        getInertTargets().forEach(element => element.setAttribute('inert', ''));
        window.setTimeout(() => cmdSearchInput.focus(), 50);
        document.body.classList.add('menu-open');
    }

    function closePalette() {
        if (!cmdPalette || !cmdSearchInput) return;

        cmdPalette.classList.remove('open');
        cmdPalette.setAttribute('aria-hidden', 'true');
        openCmdBtn?.setAttribute('aria-expanded', 'false');
        cmdSearchInput.setAttribute('aria-expanded', 'false');
        cmdSearchInput.value = '';
        filterCommands('');
        getInertTargets().forEach(element => element.removeAttribute('inert'));
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

        if (action === 'email') {
            closePalette();
            window.location.href = document.getElementById('email-link')?.getAttribute('href')
                || `mailto:${window.Portfolio.config.email}`;
            return;
        }

        if (action === 'copy-email') {
            closePalette();
            window.Portfolio.contact.copyEmail();
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

        const activeIndex = Math.max(0, visibleItems.findIndex(item => item.classList.contains('is-active')));

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            const nextIndex = (activeIndex + 1) % visibleItems.length;
            setActiveItem(visibleItems[nextIndex]);
            visibleItems[nextIndex].scrollIntoView({ block: 'nearest' });
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            const prevIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
            setActiveItem(visibleItems[prevIndex]);
            visibleItems[prevIndex].scrollIntoView({ block: 'nearest' });
        } else if (event.key === 'Enter') {
            event.preventDefault();
            const activeItem = visibleItems[activeIndex];
            if (activeItem) executeCommand(activeItem);
        }
    }

    function init() {
        cmdPalette = document.getElementById('finder');
        openCmdBtn = document.getElementById('open-cmd-btn');
        cmdOverlay = document.getElementById('finder-scrim');
        cmdSearchInput = document.getElementById('cmd-k-search-input');
        cmdItems = Array.from(document.querySelectorAll('.finder-item'));

        if (!cmdPalette || !cmdSearchInput) return;

        cmdItems.forEach((item, index) => {
            item.id = item.id || `finder-item-${index}`;
            item.setAttribute('role', 'option');
            item.setAttribute('aria-selected', 'false');
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
