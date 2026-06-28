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

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
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

    function renderTabs() {
        if (!tabsEl) return;

        tabsEl.innerHTML = projects.map((project, index) => `
            <button
                class="project-tab"
                id="project-tab-${escapeHtml(project.slug)}"
                type="button"
                role="tab"
                aria-selected="${index === activeIndex}"
                aria-controls="project-spotlight"
                tabindex="${index === activeIndex ? '0' : '-1'}"
                data-project-index="${index}">
                ${escapeHtml(project.title.replace(' of The Sacred Tree', ''))}
            </button>
        `).join('');

        tabsEl.querySelectorAll('.project-tab').forEach(tab => {
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
        const facts = [
            getFact(project, 'Problema', 0),
            getFact(project, 'Decisão', 2),
            getFact(project, 'Resultado', 3)
        ];

        spotlightEl.classList.remove('is-changing');
        void spotlightEl.offsetWidth;
        spotlightEl.classList.add('is-changing');
        spotlightEl.setAttribute('aria-labelledby', `project-tab-${project.slug}`);
        spotlightEl.innerHTML = `
            <div class="spotlight-media">
                <img src="${escapeHtml(coverSrc)}"${renderFallbackAttribute(cover)} alt="${escapeHtml(cover.alt || `Imagem do projeto ${project.title}`)}" width="1200" height="900" decoding="async">
                <span class="spotlight-media-meta">${escapeHtml((project.stack.slice(0, 3).join(' · ') || project.meta))}</span>
            </div>
            <article class="spotlight-content">
                <span class="spotlight-count">${String(activeIndex + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}</span>
                <h3>${escapeHtml(project.title)}</h3>
                <p class="spotlight-role">${escapeHtml(project.role)}</p>
                <ul class="spotlight-facts">
                    ${facts.map(item => `
                        <li>
                            <strong>${escapeHtml(item.label)}</strong>
                            <span>${escapeHtml(item.text)}</span>
                        </li>
                    `).join('')}
                </ul>
                <div class="spotlight-stack">
                    ${project.stack.slice(0, 5).map(item => `<span>${escapeHtml(item)}</span>`).join('')}
                </div>
                <button class="core-btn core-btn--primary spotlight-open" type="button" data-project-detail="${escapeHtml(project.slug)}">
                    Abrir case
                    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </button>
            </article>
        `;

        bindImageFallbacks(spotlightEl);
        spotlightEl.querySelector('[data-project-detail]')?.addEventListener('click', event => {
            openProjectDetail(project.slug, event.currentTarget);
        });

        if (statusEl) statusEl.innerText = `Projeto ${activeIndex + 1} de ${projects.length}: ${project.title}.`;
    }

    function handlePointerDown(event) {
        pointerStartX = event.clientX;
    }

    function handlePointerUp(event) {
        if (pointerStartX === null) return;
        const delta = event.clientX - pointerStartX;
        pointerStartX = null;

        if (Math.abs(delta) < 70) return;
        const nextIndex = delta < 0
            ? (activeIndex + 1) % projects.length
            : (activeIndex - 1 + projects.length) % projects.length;
        selectProject(nextIndex);
    }

    function selectProject(index, fromTab) {
        if (!projects.length) return;
        activeIndex = Math.max(0, Math.min(index, projects.length - 1));
        renderTabs();
        renderSpotlight();

        if (!fromTab) {
            const activeTab = tabsEl?.querySelector(`[data-project-index="${activeIndex}"]`);
            activeTab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
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
            <figure class="project-detail-media-item">
                <img src="${escapeHtml(item.src)}"${renderFallbackAttribute(item)} alt="${escapeHtml(item.alt || '')}" loading="lazy" decoding="async">
                <figcaption>${escapeHtml(item.caption || '')}</figcaption>
            </figure>
        `).join('');
    }

    function renderProjectDetail(project) {
        modalBody.innerHTML = `
            <div class="project-detail-layout">
                <section class="project-detail-copy">
                    <span class="project-detail-eyebrow">Case · ${escapeHtml(project.meta)}</span>
                    <h2 class="project-detail-title" id="project-detail-title">${escapeHtml(project.title)}</h2>
                    <p class="project-detail-summary">${escapeHtml(project.summary)}</p>

                    <div class="project-detail-chapter">
                        <h3>01 · Contexto</h3>
                        <p>${escapeHtml(project.context)}</p>
                    </div>
                    <div class="project-detail-chapter">
                        <h3>02 · Responsabilidades</h3>
                        <ul>${renderList(project.responsibilities)}</ul>
                    </div>
                    <div class="project-detail-chapter">
                        <h3>03 · Decisões técnicas</h3>
                        <ul>${renderList(project.technicalDecisions)}</ul>
                    </div>
                    <div class="project-detail-chapter">
                        <h3>04 · Aprendizados</h3>
                        <ul>${renderList(project.learnings)}</ul>
                    </div>
                    <div class="tech-row project-detail-stack">
                        ${project.stack.map(item => `<span class="tech-tag">${escapeHtml(item)}</span>`).join('')}
                    </div>
                </section>
                <section class="project-detail-media" aria-label="Galeria do projeto">
                    ${renderMedia(project.media)}
                </section>
            </div>
        `;
        bindImageFallbacks(modalBody);
    }

    function openProjectDetail(projectId, trigger) {
        const project = projects.find(item => item.slug === projectId || item.id === projectId);
        if (!project || !modal || !modalBody) return;

        lastFocusedElement = trigger || document.activeElement;
        renderProjectDetail(project);
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        window.setTimeout(() => closeButton?.focus(), 60);
    }

    function closeProjectDetail() {
        if (!modal?.classList.contains('open')) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
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

    function setProjects(nextProjects) {
        const source = Array.isArray(nextProjects) && nextProjects.length
            ? nextProjects
            : window.Portfolio.fallbackData.projects;
        projects = source.map(normalizeProject);
        activeIndex = Math.min(activeIndex, Math.max(0, projects.length - 1));
        renderTabs();
        renderSpotlight();
    }

    function init() {
        tabsEl = document.querySelector('.project-tabs');
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
        selectProject
    };
})();
