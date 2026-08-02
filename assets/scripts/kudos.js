(function () {
    window.Portfolio = window.Portfolio || {};

    const config = window.Portfolio.config;
    const announceMs = 3400;
    let countEl = null;
    let statusEl = null;
    let buttonEl = null;
    let cardEl = null;
    let stripEl = null;
    let askEl = null;
    let announceEl = null;
    let counterEl = null;
    let heroCountEl = null;
    let buttonLabelEl = null;
    let announceTimer = null;
    let isSubmitting = false;
    let state = {
        count: 0,
        lastReactedAt: null
    };

    function hasLocalReaction() {
        return window.Portfolio.utils.readStorage(config.storageKeys.kudosReacted, false) === true;
    }

    function markLocalReaction() {
        window.Portfolio.utils.writeStorage(config.storageKeys.kudosReacted, true);
    }

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

    function paintCount(el, value) {
        if (!el) return;

        const next = String(value);
        const shown = el.getAttribute('data-kudos-shown');
        el.setAttribute('data-kudos-shown', next);

        const canFlap = shown !== null
            && shown !== next
            && !el.hidden
            && window.Flap
            && typeof window.Flap.flip === 'function';

        if (!canFlap) {
            el.innerText = next;
            return;
        }

        window.Flap.flip(el, next);
    }

    function syncButton() {
        if (!buttonEl) return;

        const reacted = hasLocalReaction();
        buttonEl.disabled = reacted || isSubmitting;
        if (buttonLabelEl) buttonLabelEl.innerText = reacted ? 'Kudos registrado' : 'Deixar kudos';
    }

    function render() {
        paintCount(countEl, state.count);
        paintCount(heroCountEl, state.count);

        if (statusEl) {
            statusEl.innerText = hasLocalReaction() ? 'Seu kudos ficou salvo neste navegador.' : '';
        }

        if (counterEl) counterEl.hidden = state.count === 0;

        syncButton();
    }

    function announce() {
        if (!stripEl || !announceEl || !askEl) return;

        if (announceTimer) {
            window.clearTimeout(announceTimer);
            announceTimer = null;
        }

        askEl.hidden = true;
        announceEl.hidden = false;

        stripEl.classList.remove('is-posting');
        void stripEl.offsetWidth;
        stripEl.classList.add('is-posting');

        const message = announceEl.getAttribute('data-flap-text') || 'OBRIGADO';
        if (window.Flap && typeof window.Flap.flip === 'function') {
            window.Flap.flip(announceEl, message);
        } else {
            announceEl.innerText = message;
        }

        announceTimer = window.setTimeout(() => {
            announceTimer = null;
            stripEl.classList.remove('is-posting');
            announceEl.hidden = true;
            askEl.hidden = false;
        }, announceMs);
    }

    async function addKudo(options) {
        if (isSubmitting) return;

        if (hasLocalReaction()) {
            window.Portfolio.toast.show('Você já deixou seu kudos por aqui. Valeu!');
            return;
        }

        const hasCms = window.Portfolio.cms && window.Portfolio.cms.isConfigured();

        isSubmitting = true;
        syncButton();

        if (!hasCms) {
            state.count += 1;
            state.lastReactedAt = new Date().toISOString();
            writeState();
            markLocalReaction();
        }

        render();
        announce();

        if (options && options.source === 'palette') {
            window.Portfolio.utils.smoothScrollTo(cardEl);
        }

        if (!hasCms) {
            window.Portfolio.toast.show('Kudos registrado. Valeu por passar aqui.');
            isSubmitting = false;
            syncButton();
            return;
        }

        try {
            const result = await window.Portfolio.cms.recordKudo();
            if (result && Number.isFinite(Number(result.count))) {
                setRemoteCount(result.count);
            }
            markLocalReaction();
            window.Portfolio.toast.show(result && result.limited
                ? 'Você já deixou seu kudos por aqui. Valeu!'
                : 'Kudos registrado. Valeu por passar aqui.');
        } catch (error) {
            window.Portfolio.toast.show('Kudos salvo localmente. Sincronização indisponível agora.', {
                actionLabel: 'Tentar novamente',
                onAction: () => retrySync()
            });
        } finally {
            isSubmitting = false;
            render();
        }
    }

    async function retrySync() {
        if (isSubmitting || !window.Portfolio.cms || !window.Portfolio.cms.isConfigured()) return;

        isSubmitting = true;
        syncButton();

        try {
            const result = await window.Portfolio.cms.recordKudo();
            if (result && Number.isFinite(Number(result.count))) {
                setRemoteCount(result.count);
            }
            markLocalReaction();
            window.Portfolio.toast.show('Sincronizado. Valeu!');
        } catch (error) {
            window.Portfolio.toast.show('Ainda sem conexão com o servidor. Seu kudos continua salvo neste navegador.', {
                actionLabel: 'Tentar novamente',
                onAction: () => retrySync()
            });
        } finally {
            isSubmitting = false;
            render();
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
        statusEl = document.getElementById('kudos-status');
        buttonEl = document.getElementById('leave-kudos-btn');
        cardEl = document.getElementById('kudos');
        stripEl = document.getElementById('kudos-strip');
        askEl = document.getElementById('kudos-ask');
        announceEl = document.getElementById('kudos-announce');
        counterEl = document.getElementById('kudos-counter');
        heroCountEl = document.getElementById('hero-kudos-count');
        buttonLabelEl = buttonEl?.querySelector('.kudos-button-label') || null;

        if (!countEl || !statusEl || !buttonEl || !cardEl) return;

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
