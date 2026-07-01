(function () {
    window.Portfolio = window.Portfolio || {};

    const themeKey = 'scalabrin-theme';
    const soundKey = 'scalabrin-sound';
    let audioContext = null;
    let soundEnabled = false;

    function systemTheme() {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function currentTheme() {
        return document.documentElement.dataset.theme || systemTheme();
    }

    function updateThemeButtons(theme) {
        document.querySelectorAll('[data-theme-toggle]').forEach(button => {
            const next = theme === 'dark' ? 'claro' : 'escuro';
            button.setAttribute('aria-label', `Ativar tema ${next}`);
            button.setAttribute('aria-pressed', String(theme === 'light'));
            button.querySelector('[data-preference-label]')?.replaceChildren(theme === 'dark' ? 'Tema claro' : 'Tema escuro');
        });
    }

    function setTheme(theme, persist) {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
        if (persist) localStorage.setItem(themeKey, theme);
        updateThemeButtons(theme);
    }

    function toggleTheme() {
        setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
    }

    function updateSoundButtons() {
        document.querySelectorAll('[data-sound-toggle]').forEach(button => {
            button.setAttribute('aria-label', soundEnabled ? 'Desativar sons da interface' : 'Ativar sons da interface');
            button.setAttribute('aria-pressed', String(soundEnabled));
            button.querySelector('[data-preference-label]')?.replaceChildren(soundEnabled ? 'Som ligado' : 'Som desligado');
        });
    }

    function playClick(kind) {
        if (!soundEnabled) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        audioContext = audioContext || new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const now = audioContext.currentTime;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(kind === 'success' ? 720 : 520, now);
        oscillator.frequency.exponentialRampToValueAtTime(kind === 'success' ? 980 : 420, now + 0.045);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.035, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.065);
    }

    function toggleSound() {
        soundEnabled = !soundEnabled;
        localStorage.setItem(soundKey, soundEnabled ? 'on' : 'off');
        updateSoundButtons();
        if (soundEnabled) playClick('success');
    }

    function init() {
        setTheme(localStorage.getItem(themeKey) || systemTheme(), false);
        soundEnabled = localStorage.getItem(soundKey) === 'on';
        updateSoundButtons();
        document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', toggleTheme));
        document.querySelectorAll('[data-sound-toggle]').forEach(button => button.addEventListener('click', toggleSound));
        document.addEventListener('click', event => {
            const control = event.target.closest('button, a');
            if (control && !control.matches('[data-sound-toggle]')) playClick(control.matches('[data-copy-email], #copy-email-btn') ? 'success' : 'click');
        });
    }

    document.addEventListener('DOMContentLoaded', init);
    window.Portfolio.preferences = { setTheme, toggleTheme, toggleSound, playClick };
})();
