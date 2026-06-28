(function () {
    window.Portfolio = window.Portfolio || {};

    let noteEl = null;

    function setNote(message) {
        if (!noteEl) return;
        noteEl.innerText = message;
    }

    function scrollToId(id) {
        const target = document.getElementById(id);
        window.Portfolio.utils.smoothScrollTo(target);
    }

    function handleAction(action) {
        if (action === 'projects') {
            setNote('Abrindo a vitrine de projetos.');
            scrollToId('projects');
            return;
        }

        if (action === 'random-project') {
            setNote('Escolhendo um projeto para você.');
            window.Portfolio.projects.showRandom();
            return;
        }

        if (action === 'kudos') {
            setNote('Kudos registrado. Valeu por deixar um sinal.');
            return;
        }

        if (action === 'contact') {
            setNote('E-mail copiado para a área de transferência.');
            window.Portfolio.contact.copyEmail();
        }
    }

    function init() {
        noteEl = document.getElementById('live-panel-note');
        document.querySelectorAll('.live-row[data-live-action]').forEach(row => {
            row.addEventListener('click', () => handleAction(row.dataset.liveAction));
        });
    }

    window.Portfolio.engagement = {
        init,
        setNote
    };
})();
