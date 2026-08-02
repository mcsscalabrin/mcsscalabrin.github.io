(function () {
    window.Portfolio = window.Portfolio || {};

    const config = window.Portfolio.config;
    let activeCopyTimer = null;

    function showToast(message) {
        window.Portfolio.toast.show(message);
    }

    function afterCopySuccess(button) {
        showToast('E-mail copiado!');

        if (!button) return;
        button.classList.add('is-copied');

        const labelEl = button.querySelector('[data-copy-label]');
        const originalText = labelEl ? (labelEl.dataset.originalLabel || labelEl.innerText) : null;
        if (labelEl) {
            labelEl.dataset.originalLabel = originalText;
            labelEl.innerText = 'Copiado!';
        }

        if (activeCopyTimer) window.clearTimeout(activeCopyTimer);
        activeCopyTimer = window.setTimeout(() => {
            button.classList.remove('is-copied');
            if (labelEl) labelEl.innerText = originalText;
            activeCopyTimer = null;
        }, 2000);
    }

    function fallbackCopyToClipboard(text, button) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const copied = document.execCommand('copy');
            if (!copied) throw new Error('O navegador recusou o comando de cópia.');
            afterCopySuccess(button);
        } catch (error) {
            console.error('Falha ao copiar: ', error);
            showToast('Erro ao copiar e-mail.');
        } finally {
            document.body.removeChild(textarea);
        }
    }

    function copyToClipboard(text, button) {
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
            fallbackCopyToClipboard(text, button);
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => afterCopySuccess(button))
            .catch(() => fallbackCopyToClipboard(text, button));
    }

    function copyEmail(button) {
        copyToClipboard(config.email, button || null);
    }

    function init() {
        document.querySelectorAll('#copy-email-btn, [data-copy-email]').forEach(button => {
            button.addEventListener('click', () => copyEmail(button));
        });
    }

    window.Portfolio.contact = {
        init,
        copyEmail
    };
})();
