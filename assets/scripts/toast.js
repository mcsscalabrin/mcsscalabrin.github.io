(function () {
    window.Portfolio = window.Portfolio || {};

    let toastContainer = null;

    function init() {
        toastContainer = document.getElementById('toast-container');
    }

    function show(message, options) {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'status');

        const text = document.createElement('span');
        text.innerText = message;
        toast.appendChild(text);

        let dismissTimer = null;
        const scheduleDismiss = () => {
            dismissTimer = window.setTimeout(() => {
                toast.style.animation = 'toast-fade-in 0.25s cubic-bezier(0.25, 0.8, 0.25, 1) reverse forwards';
                window.setTimeout(() => toast.remove(), 250);
            }, 3500);
        };

        if (options && options.actionLabel && typeof options.onAction === 'function') {
            const actionBtn = document.createElement('button');
            actionBtn.type = 'button';
            actionBtn.className = 'toast-action';
            actionBtn.innerText = options.actionLabel;
            actionBtn.addEventListener('click', () => {
                if (dismissTimer) window.clearTimeout(dismissTimer);
                toast.remove();
                options.onAction();
            });
            toast.appendChild(actionBtn);
        }

        toastContainer.appendChild(toast);
        scheduleDismiss();
    }

    window.Portfolio.toast = {
        init,
        show
    };
})();
