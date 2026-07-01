(function () {
    window.Portfolio = window.Portfolio || {};

    const config = window.Portfolio.config;
    const maxDots = 24;
    let countEl = null;
    let dotsEl = null;
    let statusEl = null;
    let buttonEl = null;
    let cardEl = null;
    let panelEl = null;
    let counterEl = null;
    let heroCountEl = null;
    let celebrationEl = null;
    let buttonLabelEl = null;
    let celebrationTimer = null;
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
                : 'Feedbacks e recomendações em breve.';
        }

        if (counterEl) counterEl.hidden = state.count === 0;

        renderDots();
    }

    function pulse() {
        if (!cardEl) return;

        cardEl.classList.remove('kudos-burst');
        void cardEl.offsetWidth;
        cardEl.classList.add('kudos-burst');
    }

    function clearCelebration() {
        if (celebrationTimer) {
            window.clearTimeout(celebrationTimer);
            celebrationTimer = null;
        }

        panelEl?.classList.remove('kudos-celebrating', 'kudos-celebrating--reduced');
        buttonEl?.classList.remove('is-celebrating');
        celebrationEl?.replaceChildren();
        if (buttonLabelEl) buttonLabelEl.innerText = 'Deixar kudos';
    }

    function createBurstParticle(index, total) {
        const particle = document.createElement('span');
        const angle = ((Math.PI * 2) / total) * index - (Math.PI / 2);
        const distance = 68 + ((index * 17) % 48);
        const verticalBias = index % 2 === 0 ? 0.82 : 1;

        particle.className = `kudos-particle ${index % 3 === 0 ? 'is-white' : 'is-green'}`;
        particle.innerText = '✦';
        particle.style.setProperty('--particle-x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--particle-y', `${Math.sin(angle) * distance * verticalBias}px`);
        particle.style.setProperty('--particle-delay', `${(index % 4) * 24}ms`);
        particle.style.setProperty('--particle-spin', `${index % 2 === 0 ? 160 : -190}deg`);
        particle.style.setProperty('--particle-size', `${8 + (index % 4) * 2}px`);
        return particle;
    }

    function celebrate() {
        if (!panelEl || !buttonEl || !celebrationEl) return;

        clearCelebration();
        const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const panelRect = panelEl.getBoundingClientRect();
        const buttonRect = buttonEl.getBoundingClientRect();
        const burstX = buttonRect.left + (buttonRect.width / 2) - panelRect.left;
        const burstY = buttonRect.top + (buttonRect.height / 2) - panelRect.top;

        celebrationEl.style.setProperty('--burst-x', `${burstX}px`);
        celebrationEl.style.setProperty('--burst-y', `${burstY}px`);
        panelEl.classList.add('kudos-celebrating');
        buttonEl.classList.add('is-celebrating');
        if (buttonLabelEl) buttonLabelEl.innerText = 'Kudos enviado!';
        if (statusEl) statusEl.innerText = 'Kudos enviado. Obrigado!';

        if (reducedMotion) {
            panelEl.classList.add('kudos-celebrating--reduced');
        } else {
            const ring = document.createElement('span');
            ring.className = 'kudos-burst-ring';
            const increment = document.createElement('span');
            increment.className = 'kudos-increment';
            increment.innerText = '+1';
            celebrationEl.append(ring, increment);

            const particleCount = 14;
            for (let index = 0; index < particleCount; index += 1) {
                celebrationEl.appendChild(createBurstParticle(index, particleCount));
            }
        }

        celebrationTimer = window.setTimeout(clearCelebration, 920);
    }

    async function addKudo(options) {
        state.count += 1;
        state.lastReactedAt = new Date().toISOString();
        writeState();
        render();
        pulse();
        if (options && options.source === 'button') celebrate();

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
        panelEl = cardEl?.querySelector('.kudos-panel') || null;
        counterEl = document.getElementById('kudos-counter');
        heroCountEl = document.getElementById('hero-kudos-count');
        celebrationEl = document.getElementById('kudos-celebration');
        buttonLabelEl = buttonEl?.querySelector('.kudos-button-label') || null;

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
