(function () {
    window.Portfolio = window.Portfolio || {};

    const config = window.Portfolio.config;
    let copyEmailBtn = null;
    let copyEmailText = null;

    function showToast(message) {
        window.Portfolio.toast.show(message);
    }

    function restoreCopyLabel(originalText) {
        window.setTimeout(() => {
            if (copyEmailText) copyEmailText.innerText = originalText;
            if (copyEmailBtn) copyEmailBtn.style.color = '';
        }, 2000);
    }

    function afterCopySuccess() {
        showToast('E-mail copiado!');

        if (!copyEmailText || !copyEmailBtn) return;

        const originalText = copyEmailText.innerText;
        copyEmailText.innerText = 'Copiado!';
        copyEmailBtn.style.color = 'var(--text-primary)';
        restoreCopyLabel(originalText);
    }

    function fallbackCopyToClipboard(text) {
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
            afterCopySuccess();
        } catch (error) {
            console.error('Falha ao copiar: ', error);
            showToast('Erro ao copiar e-mail.');
        } finally {
            document.body.removeChild(textarea);
        }
    }

    function copyToClipboard(text) {
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
            fallbackCopyToClipboard(text);
            return;
        }

        navigator.clipboard.writeText(text)
            .then(afterCopySuccess)
            .catch(() => fallbackCopyToClipboard(text));
    }

    function copyEmail() {
        copyToClipboard(config.email);
    }

    function downloadResume() {
        showToast('Iniciando download do currículo...');

        window.setTimeout(() => {
            const blob = new Blob(['Curriculo profissional de Matheus Scalabrin.'], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = config.resumeFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            showToast('Download concluído.');
        }, 1200);
    }

    function bindContactForm() {
        const contactForm = document.getElementById('portfolio-contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', event => {
            event.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitBtnText = submitBtn.querySelector('span');
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const originalText = submitBtnText.innerText;

            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtnText.innerText = 'Enviando...';

            window.setTimeout(() => {
                showToast(`Mensagem enviada com sucesso! Obrigado, ${nameInput.value}.`);

                nameInput.value = '';
                emailInput.value = '';
                messageInput.value = '';

                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
                submitBtnText.innerText = originalText;
            }, 1200);
        });
    }

    function init() {
        copyEmailBtn = document.getElementById('copy-email-btn');
        copyEmailText = document.getElementById('copy-email-text');

        document.querySelectorAll('#copy-email-btn, [data-copy-email]').forEach(button => {
            button.addEventListener('click', copyEmail);
        });

        bindContactForm();
    }

    window.Portfolio.contact = {
        init,
        copyEmail,
        downloadResume
    };
})();
