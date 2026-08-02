(function () {
    window.Portfolio = window.Portfolio || {};

    let projects = [];
    let activeIndex = 0;
    let tabsEl = null;
    let spotlightEl = null;
    let statusEl = null;
    let modal = null;
    let modalBody = null;
    let closeButton = null;
    let overlay = null;
    let lastFocusedElement = null;
    let pointerStartX = null;
    let pointerStartY = null;

    const COVER_DIMENSIONS = {
        'assets/images/projects/ruins/ruins-banner.jpeg': { width: 1920, height: 1080 },
        'assets/images/plant_moisture_monitor.jpg': { width: 1024, height: 1024 },
        'assets/images/pc_builder_app.jpg': { width: 1024, height: 1024 },
        'assets/images/projects/pulso/pulso-cover.jpg': { width: 1600, height: 900 },
        'assets/images/projects/tripflow/tripflow-cover.jpg': { width: 1600, height: 900 },
        'assets/images/projects/sensivacc/sensivacc-cover.jpg': { width: 1600, height: 900 },
        'assets/images/projects/beach-tennis/beach-tennis-cover.jpg': { width: 1600, height: 900 }
    };

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function safeExternalUrl(value) {
        const candidate = String(value || '').trim();
        if (!candidate) return '';

        try {
            const url = new URL(candidate, window.location.href);
            return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
        } catch {
            return '';
        }
    }

    function resolveExternalAction(project) {
        const projectUrl = safeExternalUrl(project && (project.projectUrl || project.project_url));
        if (projectUrl) {
            const hostname = new URL(projectUrl).hostname.toLowerCase();
            const isItch = hostname === 'itch.io' || hostname.endsWith('.itch.io');
            return {
                url: projectUrl,
                label: String(project.projectUrlLabel || project.project_url_label || '').trim()
                    || (isItch ? 'Jogar na itch.io' : 'Abrir projeto'),
                kind: isItch ? 'itch' : 'external'
            };
        }

        const repositoryUrl = safeExternalUrl(project && (project.repositoryUrl || project.repository_url));
        return repositoryUrl
            ? { url: repositoryUrl, label: 'Abrir no GitHub', kind: 'github' }
            : null;
    }

    function externalActionIcon(kind) {
        if (kind === 'github') {
            return '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.54 1.03 1.54 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.84c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>';
        }

        if (kind === 'itch') {
            return '<svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8.2 7h7.6a4.8 4.8 0 0 1 4.5 3.15l1.25 3.45a2.7 2.7 0 0 1-4.65 2.62L15.7 14.8H8.3l-1.2 1.42a2.7 2.7 0 0 1-4.65-2.62l1.25-3.45A4.8 4.8 0 0 1 8.2 7Z"/><path d="M7 10.4v3M5.5 11.9h3M16.4 10.8h.01M18.2 12.7h.01"/></svg>';
        }

        return '<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17 17 7M7 7h10v10"/></svg>';
    }

    function renderProjectExternalAction(project) {
        const action = resolveExternalAction(project);
        if (!action) return '';

        return `
            <a class="act act--ghost" href="${escapeHtml(action.url)}" target="_blank" rel="noopener noreferrer" data-project-external="${escapeHtml(action.kind)}">
                ${externalActionIcon(action.kind)}
                <span>${escapeHtml(action.label)}</span>
            </a>
        `;
    }

    function normalizeProject(project, index) {
        const media = Array.isArray(project.media) ? project.media : [];
        const cover = media.find(item => item.isCover) || media[0] || {};

        return Object.assign({}, project, {
            id: project.slug || project.id || `project-${index}`,
            slug: project.slug || project.id || `project-${index}`,
            title: project.title || 'Projeto sem título',
            role: project.role || project.meta || '',
            meta: project.meta || project.role || '',
            summary: project.summary || '',
            context: project.context || '',
            cardItems: Array.isArray(project.cardItems) ? project.cardItems : [],
            responsibilities: Array.isArray(project.responsibilities) ? project.responsibilities : [],
            technicalDecisions: Array.isArray(project.technicalDecisions) ? project.technicalDecisions : [],
            learnings: Array.isArray(project.learnings) ? project.learnings : [],
            stack: Array.isArray(project.stack) ? project.stack : [],
            repositoryUrl: project.repositoryUrl || project.repository_url || '',
            projectUrl: project.projectUrl || project.project_url || '',
            projectUrlLabel: project.projectUrlLabel || project.project_url_label || '',
            media,
            cover
        });
    }

    function getFact(project, label, fallbackIndex) {
        const match = project.cardItems.find(item => String(item.label).toLowerCase() === label.toLowerCase());
        return match || project.cardItems[fallbackIndex] || { label, text: project.summary };
    }

    function renderFallbackAttribute(item) {
        return item && item.fallbackSrc
            ? ` data-fallback-src="${escapeHtml(item.fallbackSrc)}"`
            : '';
    }

    function bindImageFallbacks(root) {
        root?.querySelectorAll('img[data-fallback-src]').forEach(image => {
            const useFallback = () => {
                const fallbackSrc = image.dataset.fallbackSrc;
                image.removeAttribute('data-fallback-src');
                if (fallbackSrc && image.getAttribute('src') !== fallbackSrc) image.src = fallbackSrc;
            };

            image.addEventListener('error', useFallback, { once: true });
            if (image.complete && image.naturalWidth === 0) useFallback();
        });
    }

    const KIND_LABEL = { game: 'Jogo', iot: 'IoT', software: 'Software' };

    function kindOf(project) {
        return KIND_LABEL[project.type] || 'Projeto';
    }

    function renderTabs() {
        if (!tabsEl) return;

        tabsEl.innerHTML = projects.map((project, index) => `
            <button
                class="departure"
                id="project-tab-${escapeHtml(project.slug)}"
                type="button"
                role="tab"
                aria-selected="${index === activeIndex}"
                aria-controls="project-spotlight"
                tabindex="${index === activeIndex ? '0' : '-1'}"
                data-project-index="${index}">
                <span class="departure-where">${escapeHtml(project.title)}</span>
                <span class="departure-kind">${escapeHtml(kindOf(project))}</span>
            </button>
        `).join('');

        tabsEl.querySelectorAll('.departure').forEach(tab => {
            tab.addEventListener('click', () => selectProject(Number(tab.dataset.projectIndex), true));
            tab.addEventListener('keydown', handleTabKeys);
        });
    }

    function handleTabKeys(event) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();

        let nextIndex = activeIndex;
        if (event.key === 'ArrowLeft') nextIndex = (activeIndex - 1 + projects.length) % projects.length;
        if (event.key === 'ArrowRight') nextIndex = (activeIndex + 1) % projects.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = projects.length - 1;

        selectProject(nextIndex, true);
        tabsEl.querySelector(`[data-project-index="${nextIndex}"]`)?.focus();
    }

    function renderSpotlight() {
        if (!spotlightEl || projects.length === 0) return;

        const project = projects[activeIndex];
        const cover = project.cover || {};
        const coverSrc = cover.src || 'assets/images/projects/ruins/ruins-banner.jpeg';
        const coverDimensions = COVER_DIMENSIONS[coverSrc];
        const coverDimensionAttrs = coverDimensions
            ? ` width="${coverDimensions.width}" height="${coverDimensions.height}"`
            : '';
        const facts = [
            getFact(project, 'Problema', 0),
            getFact(project, 'Papel', 1),
            getFact(project, 'Decisão', 2),
            getFact(project, 'Resultado', 3)
        ];

        spotlightEl.className = 'ticket';
        spotlightEl.setAttribute('aria-labelledby', `project-tab-${project.slug}`);
        spotlightEl.dataset.projectType = project.type || '';
        spotlightEl.innerHTML = `
            <div class="ticket-body">
                <div class="ticket-head">
                    <span class="ticket-code" data-ticket-code>${escapeHtml(kindOf(project))}</span>
                    <span class="ticket-code">${escapeHtml(project.stack.slice(0, 2).join(' · '))}</span>
                </div>
                <div>
                    <h3>${escapeHtml(project.title)}</h3>
                    <p class="ticket-role">${escapeHtml(project.role)}</p>
                </div>
                <p class="ticket-summary">${escapeHtml(project.summary)}</p>
                <dl class="facts">
                    ${facts.map(item => `
                        <div class="fact">
                            <dt>${escapeHtml(item.label)}</dt>
                            <dd>${escapeHtml(item.text)}</dd>
                        </div>
                    `).join('')}
                </dl>
                <div class="ticket-stack">
                    ${project.stack.slice(0, 5).map(item => `<span class="chip">${escapeHtml(item)}</span>`).join('')}
                </div>
                <div class="ticket-actions">
                    <button class="act act--steel" type="button" data-project-detail="${escapeHtml(project.slug)}">
                        Abrir o case completo
                        <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h13M12 6l6 6-6 6"/></svg>
                    </button>
                    ${renderProjectExternalAction(project)}
                </div>
            </div>
            <figure class="ticket-media">
                <img src="${escapeHtml(coverSrc)}"${renderFallbackAttribute(cover)} alt="${escapeHtml(cover.alt || `Imagem do projeto ${project.title}`)}"${coverDimensionAttrs} loading="lazy" decoding="async">
                <figcaption>${escapeHtml(cover.caption || project.meta)}</figcaption>
            </figure>
        `;

        bindImageFallbacks(spotlightEl);
        spotlightEl.querySelector('[data-project-detail]')?.addEventListener('click', event => {
            openProjectDetail(project.slug, event.currentTarget);
        });

        const code = spotlightEl.querySelector('[data-ticket-code]');
        if (code && window.Flap) window.Flap.flip(code, code.textContent);

        if (statusEl) statusEl.innerText = `Caso ${activeIndex + 1} de ${projects.length}: ${project.title}.`;
    }

    function handlePointerDown(event) {
        if (event.pointerType !== 'touch') return;
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
    }

    function handlePointerUp(event) {
        if (event.pointerType !== 'touch') return;
        if (pointerStartX === null) return;
        const deltaX = event.clientX - pointerStartX;
        const deltaY = event.clientY - pointerStartY;
        pointerStartX = null;
        pointerStartY = null;

        if (Math.abs(deltaX) < 70) return;
        if (Math.abs(deltaX) <= Math.abs(deltaY) * 2) return;

        const nextIndex = deltaX < 0
            ? (activeIndex + 1) % projects.length
            : (activeIndex - 1 + projects.length) % projects.length;
        selectProject(nextIndex);
    }

    function handlePointerCancel() {
        pointerStartX = null;
        pointerStartY = null;
    }

    function selectProject(index, fromTab) {
        if (!projects.length) return;
        activeIndex = Math.max(0, Math.min(index, projects.length - 1));
        renderTabs();
        renderSpotlight();

        const activeTab = tabsEl?.querySelector(`[data-project-index="${activeIndex}"]`);

        if (fromTab) activeTab?.focus();
        else activeTab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    function showRandom() {
        if (projects.length === 0) return;
        let nextIndex = Math.floor(Math.random() * projects.length);
        if (projects.length > 1 && nextIndex === activeIndex) nextIndex = (nextIndex + 1) % projects.length;
        selectProject(nextIndex);
        window.Portfolio.utils.smoothScrollTo(document.getElementById('projects'));
        window.Portfolio.toast.show(`Projeto em destaque: ${projects[nextIndex].title}.`);
    }

    function renderList(items) {
        return items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
    }

    function renderMedia(media) {
        return media.map(item => `
            <figure>
                <img src="${escapeHtml(item.src)}"${renderFallbackAttribute(item)} alt="${escapeHtml(item.alt || '')}" loading="lazy" decoding="async">
                <figcaption class="live-note">${escapeHtml(item.caption || '')}</figcaption>
            </figure>
        `).join('');
    }

    function renderProjectDetail(project) {
        modalBody.innerHTML = `
            <h2 id="project-detail-title">${escapeHtml(project.title)}</h2>
            <p class="ticket-role">${escapeHtml(project.role)}</p>
            <h3>Contexto</h3>
            <p>${escapeHtml(project.context)}</p>
            <h3>Responsabilidades</h3>
            <ul>${renderList(project.responsibilities)}</ul>
            <h3>Decisões técnicas</h3>
            <ul>${renderList(project.technicalDecisions)}</ul>
            <h3>Aprendizados</h3>
            <ul>${renderList(project.learnings)}</ul>
            <h3>Stack</h3>
            <div class="ticket-stack">
                ${project.stack.map(item => `<span class="chip">${escapeHtml(item)}</span>`).join('')}
            </div>
            <div class="ticket-actions">
                ${renderProjectExternalAction(project)}
            </div>
            <div class="case-media">
                ${renderMedia(project.media)}
            </div>
        `;
        bindImageFallbacks(modalBody);
    }

    function getInertTargets() {
        return [document.querySelector('.station-header'), document.getElementById('main-content'), document.querySelector('.station-footer')]
            .filter(Boolean);
    }

    function openProjectDetail(projectId, trigger) {
        const project = projects.find(item => item.slug === projectId || item.id === projectId);
        if (!project || !modal || !modalBody) return;

        lastFocusedElement = trigger || document.activeElement;
        renderProjectDetail(project);
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        getInertTargets().forEach(element => element.setAttribute('inert', ''));
        window.setTimeout(() => closeButton?.focus(), 60);
    }

    function closeProjectDetail() {
        if (!modal?.classList.contains('open')) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
        getInertTargets().forEach(element => element.removeAttribute('inert'));
        lastFocusedElement?.focus?.();
    }

    function openCurrentProjectDetail() {
        const project = projects[activeIndex];
        if (project) openProjectDetail(project.slug, spotlightEl?.querySelector('[data-project-detail]'));
    }

    function trapFocus(event) {
        if (!modal?.classList.contains('open') || event.key !== 'Tab') return;
        const focusable = Array.from(modal.querySelectorAll(window.Portfolio.config.focusableSelector))
            .filter(element => !element.hasAttribute('disabled') && element.offsetParent !== null);
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function handleKeys(event) {
        if (!modal?.classList.contains('open')) return;
        if (event.key === 'Escape') closeProjectDetail();
        else trapFocus(event);
    }

    const COUNT_WORDS = ['nenhum', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis',
        'sete', 'oito', 'nove', 'dez', 'onze', 'doze'];

    function countWord(value) {
        return COUNT_WORDS[value] || String(value);
    }

    function caseCount() {
        return projects.length;
    }

    function paintCaseCount() {
        const word = countWord(projects.length);
        const capitalized = word.charAt(0).toUpperCase() + word.slice(1);

        document.querySelectorAll('[data-case-count]').forEach(el => {
            const template = el.getAttribute('data-case-count');
            if (!template) return;
            el.textContent = template.replace(/\{n\}/g, word).replace(/\{N\}/g, capitalized);
        });
    }

    function setProjects(nextProjects) {
        const source = Array.isArray(nextProjects) && nextProjects.length
            ? nextProjects
            : window.Portfolio.fallbackData.projects;
        projects = source.map(normalizeProject);
        activeIndex = Math.min(activeIndex, Math.max(0, projects.length - 1));
        renderTabs();
        renderSpotlight();
        paintCaseCount();
    }

    function init() {
        tabsEl = document.querySelector('.departures');
        spotlightEl = document.getElementById('project-spotlight');
        statusEl = document.getElementById('project-filter-status');
        modal = document.getElementById('project-detail-modal');
        modalBody = document.getElementById('project-detail-body');
        closeButton = document.getElementById('project-detail-close');
        overlay = document.getElementById('project-detail-overlay');

        if (!tabsEl || !spotlightEl) return;
        setProjects(window.Portfolio.fallbackData.projects);

        spotlightEl.addEventListener('pointerdown', handlePointerDown, { passive: true });
        spotlightEl.addEventListener('pointerup', handlePointerUp, { passive: true });
        spotlightEl.addEventListener('pointercancel', handlePointerCancel, { passive: true });
        document.getElementById('random-project-btn')?.addEventListener('click', showRandom);
        closeButton?.addEventListener('click', closeProjectDetail);
        overlay?.addEventListener('click', closeProjectDetail);
        document.addEventListener('keydown', handleKeys);
    }

    window.Portfolio.projects = {
        init,
        showRandom,
        openProjectDetail,
        openCurrentProjectDetail,
        setProjects,
        selectProject,
        resolveExternalAction,
        caseCount,
        countWord
    };
})();
