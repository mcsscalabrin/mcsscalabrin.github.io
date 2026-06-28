(function () {
    window.Portfolio = window.Portfolio || {};

    function init() {
        const cards = document.querySelectorAll('.bento-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', event => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
            });
        });
    }

    window.Portfolio.cards = {
        init
    };
})();
