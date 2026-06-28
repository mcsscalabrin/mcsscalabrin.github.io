(function () {
    window.Portfolio = window.Portfolio || {};

    function $(selector, scope) {
        return (scope || document).querySelector(selector);
    }

    function $$(selector, scope) {
        return Array.from((scope || document).querySelectorAll(selector));
    }

    function safeJsonParse(value, fallback) {
        try {
            return JSON.parse(value);
        } catch (error) {
            return fallback;
        }
    }

    function readStorage(key, fallback) {
        try {
            const storedValue = window.localStorage.getItem(key);
            return storedValue ? safeJsonParse(storedValue, fallback) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function writeStorage(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            return false;
        }
    }

    function smoothScrollTo(target) {
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.Portfolio.utils = {
        $,
        $$,
        readStorage,
        writeStorage,
        smoothScrollTo
    };
})();
