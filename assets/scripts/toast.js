(function () {
    window.Portfolio = window.Portfolio || {};

    let toastContainer = null;

    function init() {
        toastContainer = document.getElementById('toast-container');
    }

    function show(message) {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        toast.innerText = message;

        toastContainer.appendChild(toast);

        window.setTimeout(() => {
            toast.style.animation = 'toast-fade-in 0.25s cubic-bezier(0.25, 0.8, 0.25, 1) reverse forwards';
            window.setTimeout(() => toast.remove(), 250);
        }, 3500);
    }

    window.Portfolio.toast = {
        init,
        show
    };
})();
