(function () {
    'use strict';

    var ALPHABET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZÁÂÃÀÇÉÊÍÓÔÕÚÜ0123456789.,:;!?-–—/·()&@%+#\'"';
    var INDEX = Object.create(null);
    for (var i = 0; i < ALPHABET.length; i += 1) INDEX[ALPHABET[i]] = i;

    var STEP_MS = 42;
    var STAGGER_MS = 26;
    var MAX_STEPS = 14;

    var reduceMotion = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : { matches: false };

    var running = [];
    var frameHandle = null;

    function normalize(text) {
        return String(text == null ? '' : text).toUpperCase();
    }

    function split(host, text) {
        var value = normalize(text != null ? text : host.getAttribute('data-flap-text') || host.textContent);
        var label = host.getAttribute('data-flap-label') || value;

        host.setAttribute('data-flap-text', value);
        host.textContent = '';
        host.classList.add('flapline');

        if (host.getAttribute('aria-hidden') !== 'true') {
            var reader = document.createElement('span');
            reader.className = 'sr-only';
            reader.textContent = label;
            host.appendChild(reader);
        }

        var cells = document.createElement('span');
        cells.setAttribute('aria-hidden', 'true');
        cells.style.display = 'contents';

        for (var c = 0; c < value.length; c += 1) {
            var ch = value[c];
            var cell = document.createElement('span');
            cell.className = ch === ' ' ? 'flap flap--space' : 'flap';
            cell.textContent = ch === ' ' ? ' ' : ch;
            cells.appendChild(cell);
        }

        host.appendChild(cells);
        return Array.prototype.slice.call(cells.children);
    }

    function tick(now) {
        frameHandle = null;
        var still = [];

        for (var t = 0; t < running.length; t += 1) {
            var job = running[t];
            var done = true;

            for (var c = 0; c < job.cells.length; c += 1) {
                var cell = job.cells[c];
                var plan = job.plans[c];
                if (plan.finished) continue;

                var elapsed = now - job.start - plan.delay;
                if (elapsed < 0) {
                    done = false;
                    continue;
                }

                var step = Math.floor(elapsed / STEP_MS);
                if (step >= plan.steps) {
                    cell.textContent = plan.target === ' ' ? ' ' : plan.target;
                    cell.classList.toggle('flap--space', plan.target === ' ');
                    plan.finished = true;
                    continue;
                }

                done = false;
                if (step !== plan.shown) {
                    plan.shown = step;
                    var at = (plan.from + step) % ALPHABET.length;
                    var glyph = ALPHABET[at];
                    cell.textContent = glyph === ' ' ? ' ' : glyph;
                    cell.classList.remove('flap--space');
                }
            }

            if (!done) still.push(job);
            else if (typeof job.onDone === 'function') job.onDone();
        }

        running = still;
        if (running.length) frameHandle = requestAnimationFrame(tick);
    }

    function schedule() {
        if (frameHandle === null && running.length) frameHandle = requestAnimationFrame(tick);
    }

    function flip(host, text, options) {
        var opts = options || {};
        var value = normalize(text != null ? text : host.getAttribute('data-flap-text'));
        var cells = split(host, value);

        if (reduceMotion.matches || opts.instant) {
            if (typeof opts.onDone === 'function') opts.onDone();
            return;
        }

        running = running.filter(function (job) { return job.host !== host; });

        var plans = [];
        for (var c = 0; c < cells.length; c += 1) {
            var target = value[c];
            if (target === ' ') {
                plans.push({ target: target, delay: 0, steps: 0, from: 0, shown: -1, finished: true });
                continue;
            }
            var landing = INDEX[target] === undefined ? INDEX[' '] : INDEX[target];
            var steps = 4 + ((c * 3) % (MAX_STEPS - 4));
            plans.push({
                target: target,
                delay: (opts.delay || 0) + c * STAGGER_MS,
                steps: steps,
                from: ((landing - steps) % ALPHABET.length + ALPHABET.length) % ALPHABET.length,
                shown: -1,
                finished: false
            });
        }

        running.push({
            host: host,
            cells: cells,
            plans: plans,
            start: performance.now(),
            onDone: opts.onDone
        });
        schedule();
    }

    function arrive(hosts, baseDelay) {
        var delay = baseDelay || 0;
        Array.prototype.forEach.call(hosts, function (host, index) {
            flip(host, host.getAttribute('data-flap-text') || host.textContent, {
                delay: delay + index * 150
            });
        });
    }

    function nudge(host, cell) {
        if (reduceMotion.matches) return;

        var target = cell.textContent;
        if (!target || target === ' ') return;

        var landing = INDEX[target];
        if (landing === undefined) return;

        for (var j = 0; j < running.length; j += 1) {
            if (running[j].host === host) return;
        }

        var steps = 6 + Math.floor(Math.random() * 5);
        running.push({
            host: host,
            cells: [cell],
            plans: [{
                target: target,
                delay: 0,
                steps: steps,
                from: ((landing - steps) % ALPHABET.length + ALPHABET.length) % ALPHABET.length,
                shown: -1,
                finished: false
            }],
            start: performance.now()
        });
        schedule();
    }

    function idle(hosts, options) {
        var opts = options || {};
        var minMs = opts.minMs || 8000;
        var maxMs = opts.maxMs || 15000;
        var list = Array.prototype.slice.call(hosts);
        var timer = null;
        var stopped = false;

        if (!list.length) return function () {};

        function once() {
            var host = list[Math.floor(Math.random() * list.length)];
            var cells = host.querySelectorAll('.flap:not(.flap--space)');
            if (cells.length) nudge(host, cells[Math.floor(Math.random() * cells.length)]);
        }

        function loop() {
            timer = setTimeout(function () {
                if (stopped) return;
                var allowed = !document.hidden
                    && !reduceMotion.matches
                    && (typeof opts.canRun !== 'function' || opts.canRun());
                if (allowed) once();
                loop();
            }, minMs + Math.random() * (maxMs - minMs));
        }

        loop();
        return function stop() {
            stopped = true;
            clearTimeout(timer);
        };
    }

    window.Flap = { split: split, flip: flip, arrive: arrive, nudge: nudge, idle: idle };
}());
