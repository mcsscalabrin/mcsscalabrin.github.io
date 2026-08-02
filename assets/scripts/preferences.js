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
        const lit = theme === 'light';
        document.querySelectorAll('[data-theme-toggle]').forEach(button => {
            button.setAttribute('aria-label', lit ? 'Apagar o saguão' : 'Acender o saguão');
            button.setAttribute('aria-pressed', String(lit));
            button.querySelector('[data-preference-label]')?.replaceChildren(lit ? 'Apagar o saguão' : 'Acender o saguão');
            const night = button.querySelector('[data-icon-night]');
            const day = button.querySelector('[data-icon-day]');
            if (night) night.hidden = lit;
            if (day) day.hidden = !lit;
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
            button.setAttribute('aria-label', soundEnabled ? 'Desligar o som do painel' : 'Ligar o som do painel');
            button.setAttribute('aria-pressed', String(soundEnabled));
            button.querySelector('[data-preference-label]')?.replaceChildren(soundEnabled ? 'Som do painel ligado' : 'Som do painel desligado');
            const muted = button.querySelector('[data-icon-muted]');
            const audible = button.querySelector('[data-icon-audible]');
            if (muted) muted.hidden = soundEnabled;
            if (audible) audible.hidden = !soundEnabled;
        });
    }

    function clack(kind) {
        if (!soundEnabled) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        audioContext = audioContext || new AudioContext();

        const now = audioContext.currentTime;
        const duration = 0.05;
        const frames = Math.floor(audioContext.sampleRate * duration);
        const buffer = audioContext.createBuffer(1, frames, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < frames; i += 1) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / frames, 3);
        }

        const source = audioContext.createBufferSource();
        source.buffer = buffer;

        const band = audioContext.createBiquadFilter();
        band.type = 'bandpass';
        band.frequency.setValueAtTime(kind === 'success' ? 2600 : 1800, now);
        band.Q.setValueAtTime(1.4, now);

        const gain = audioContext.createGain();
        gain.gain.setValueAtTime(kind === 'success' ? 0.09 : 0.055, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        source.connect(band).connect(gain).connect(audioContext.destination);
        source.start(now);
        source.stop(now + duration);
    }

    function toggleSound() {
        soundEnabled = !soundEnabled;
        localStorage.setItem(soundKey, soundEnabled ? 'on' : 'off');
        updateSoundButtons();
        if (soundEnabled) clack('success');
    }

    function init() {
        setTheme(localStorage.getItem(themeKey) || systemTheme(), false);
        soundEnabled = localStorage.getItem(soundKey) === 'on';
        updateSoundButtons();
        document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', toggleTheme));
        document.querySelectorAll('[data-sound-toggle]').forEach(button => button.addEventListener('click', toggleSound));
    }

    document.addEventListener('DOMContentLoaded', init);
    window.Portfolio.preferences = { setTheme, toggleTheme, toggleSound, playClick: clack };
})();
