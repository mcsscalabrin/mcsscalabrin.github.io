(function () {
    window.Portfolio = window.Portfolio || {};

    const config = window.Portfolio.config;
    const maxDots = 24;
    let countEl = null;
    let dotsEl = null;
    let statusEl = null;
    let buttonEl = null;
    let cardEl = null;
    let heroCountEl = null;
    let state = {
        count: 0,
        lastReactedAt: null
    };

    function normalizeState(value) {
        const count = Number(value && value.count);
        return {
            count: Number.isFinite(count) && count > 0 ? Math.floor(count) : 0,
            lastReactedAt: value && typeof value.lastReactedAt === 'string' ? value.lastReactedAt : null
        };
    }

    function readState() {
        state = normalizeState(window.Portfolio.utils.readStorage(config.storageKeys.kudos, state));
    }

    function writeState() {
        window.Portfolio.utils.writeStorage(config.storageKeys.kudos, state);
    }

    function renderDots() {
        if (!dotsEl) return;

        const visibleCount = Math.min(state.count, maxDots);
        dotsEl.innerHTML = '';

        for (let index = 0; index < visibleCount; index += 1) {
            const dot = document.createElement('span');
            dot.className = 'kudos-dot';
            if (index === visibleCount - 1) {
                dot.classList.add('is-new');
            }
            dotsEl.appendChild(dot);
        }
    }

    function render() {
        if (countEl) {
            countEl.innerText = String(state.count);
        }

        if (heroCountEl) {
            heroCountEl.innerText = String(state.count);
        }

        if (statusEl) {
            statusEl.innerText = state.count > 0
                ? 'Seu sinal ficou salvo neste navegador.'
                : 'Nenhum kudos salvo neste navegador ainda.';
        }

        renderDots();
    }

    function pulse() {
        if (!cardEl) return;

        cardEl.classList.remove('kudos-burst');
        void cardEl.offsetWidth;
        cardEl.classList.add('kudos-burst');
    }

    async function addKudo(options) {
        state.count += 1;
        state.lastReactedAt = new Date().toISOString();
        writeState();
        render();
        pulse();

        if (options && options.source === 'palette') {
            window.Portfolio.utils.smoothScrollTo(cardEl);
        }

        window.Portfolio.toast.show('Kudos registrado. Valeu por passar aqui.');

        if (window.Portfolio.cms && window.Portfolio.cms.isConfigured()) {
            try {
                const result = await window.Portfolio.cms.recordKudo();
                if (result && Number.isFinite(Number(result.count))) {
                    setRemoteCount(result.count);
                }
            } catch (error) {
                window.Portfolio.toast.show('Kudos salvo localmente. Sincronizacao indisponivel agora.');
            }
        }
    }

    function setRemoteCount(count) {
        const remoteCount = Number(count);
        if (!Number.isFinite(remoteCount) || remoteCount < 0) return;

        state.count = Math.floor(remoteCount);
        writeState();
        render();
    }

    function init() {
        countEl = document.getElementById('kudos-count');
        dotsEl = document.getElementById('kudos-dots');
        statusEl = document.getElementById('kudos-status');
        buttonEl = document.getElementById('leave-kudos-btn');
        cardEl = document.getElementById('kudos');
        heroCountEl = document.getElementById('hero-kudos-count');

        if (!countEl || !dotsEl || !statusEl || !buttonEl || !cardEl) return;

        readState();
        render();
        buttonEl.addEventListener('click', () => addKudo({ source: 'button' }));

        document.querySelectorAll('[data-live-action="kudos"], #hero-kudos-btn').forEach(trigger => {
            trigger.addEventListener('click', () => addKudo({ source: 'hero' }));
        });
    }

    window.Portfolio.kudos = {
        init,
        addKudo,
        setRemoteCount
    };
})();
