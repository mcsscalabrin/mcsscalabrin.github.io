(function () {
    window.Portfolio = window.Portfolio || {};

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function setText(selector, value) {
        const element = document.querySelector(selector);
        if (element && value) element.innerText = value;
    }

    function setMeta(selector, attr, value) {
        const element = document.querySelector(selector);
        if (element && value) element.setAttribute(attr, value);
    }

    function applySeo(seo) {
        if (!seo) return;
        if (seo.title) document.title = seo.title;
        setMeta('meta[name="description"]', 'content', seo.description);
        setMeta('meta[property="og:title"]', 'content', seo.title);
        setMeta('meta[property="og:description"]', 'content', seo.description);
        setMeta('meta[property="og:image"]', 'content', seo.image);
        setMeta('meta[name="twitter:title"]', 'content', seo.title);
        setMeta('meta[name="twitter:description"]', 'content', seo.description);
        setMeta('meta[name="twitter:image"]', 'content', seo.image);
    }

    function applyHero(hero) {
        if (!hero) return;
        setText('.hero-name', hero.title);
    }

    function applyContact(contact) {
        if (!contact) return;
        if (contact.email) {
            window.Portfolio.config.email = contact.email;
            setText('#contact-email', contact.email);
        }
    }

    function renderTimelineItem(item, index) {
        const stack = Array.isArray(item.stack) ? item.stack : [];
        return `
            <article class="timeline-item">
                <span class="timeline-dot" aria-hidden="true"></span>
                <div class="timeline-summary">
                    <span class="timeline-period">${escapeHtml(item.period)}</span>
                    <h3>${escapeHtml(item.company)}</h3>
                    <p>${escapeHtml(item.role)}</p>
                    <div class="timeline-tags">
                        ${stack.slice(0, 5).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}
                    </div>
                </div>
                <div class="timeline-evidence">
                    <span>${index === 0 ? 'Evidência atual' : 'Marco conectado'}</span>
                    <p>${escapeHtml(item.evidence)}</p>
                </div>
            </article>
        `;
    }

    function applyExperiences(experiences) {
        const timeline = document.getElementById('experience-timeline');
        if (!timeline) return;

        const source = Array.isArray(experiences) && experiences.length ? experiences : [];
        const primary = source[0] || {};
        const primaryHighlight = Array.isArray(primary.highlights) && primary.highlights.length
            ? primary.highlights.map(item => item.text).join(' ')
            : 'Engenharia de software em contexto corporativo de alta escala.';

        const timelineItems = [
            {
                company: primary.company || 'Itaú Unibanco',
                role: primary.role || 'Analista de Engenharia de TI · Estagiário',
                period: primary.period || '2026 — Agora',
                stack: primary.stack || ['RBAC', 'SRE', 'APIs'],
                evidence: primaryHighlight
            },
            {
                company: 'SPTech',
                role: 'Sistemas de Informação',
                period: '2025 — Presente',
                stack: ['Arquitetura', 'Algoritmos', 'Produto'],
                evidence: 'Fundamentos acadêmicos aplicados aos cases de software, hardware e produto digital.'
            },
            {
                company: 'Pomegranade Studios',
                role: 'Cofundador · Ruins of The Sacred Tree',
                period: '2024',
                stack: ['Unity', 'C#', 'Game Design', 'BGS'],
                evidence: 'Protótipo jogável validado em banca de negócios e apresentado ao público na Brasil Game Show.'
            }
        ];

        timeline.innerHTML = timelineItems.map(renderTimelineItem).join('');
    }

    function applySkills(skills) {
        const matrix = document.getElementById('capability-matrix');
        if (!matrix) return;

        const groups = Array.isArray(skills) ? skills : [];
        const rows = [
            {
                label: 'Sistemas',
                title: 'Arquitetura e backend',
                tools: groups[0]?.items || ['C#', 'Java', 'Python', 'TypeScript'],
                proof: 'Itaú · PC Setup',
                projectIndex: 2
            },
            {
                label: 'Automação',
                title: 'Operação eficiente',
                tools: groups[1]?.items || ['Power Platform', 'APIs REST', 'SRE'],
                proof: 'Itaú · Sensor de solo',
                projectIndex: 1
            },
            {
                label: 'Produto',
                title: 'Complexidade legível',
                tools: groups[2]?.items || ['UX/UI', 'Product Thinking', 'Algoritmos'],
                proof: 'Ruins · PC Setup',
                projectIndex: 0
            }
        ];

        matrix.innerHTML = rows.map(row => `
            <article class="capability-row">
                <div class="capability-domain">
                    <span class="capability-label">${escapeHtml(row.label)}</span>
                    <h3>${escapeHtml(row.title)}</h3>
                </div>
                <div class="capability-tools">
                    <span class="capability-label">Ferramentas</span>
                    <p>${row.tools.slice(0, 5).map(escapeHtml).join(' · ')}</p>
                </div>
                <div class="capability-proof">
                    <span class="capability-label">Prova</span>
                    <p>${escapeHtml(row.proof)}</p>
                </div>
                <button class="capability-action" type="button" data-capability-project="${row.projectIndex}">Ver evidência</button>
            </article>
        `).join('');

        matrix.querySelectorAll('[data-capability-project]').forEach(button => {
            button.addEventListener('click', () => {
                const index = Number(button.dataset.capabilityProject);
                window.Portfolio.projects.selectProject(index);
                window.Portfolio.utils.smoothScrollTo(document.getElementById('projects'));
            });
        });
    }

    function applySocialLinks(links) {
        const container = document.querySelector('.contact-links');
        if (!container || !Array.isArray(links) || !links.length) return;

        const preferred = links.filter(link => ['LinkedIn', 'GitHub'].includes(link.name)).slice(0, 2);
        if (!preferred.length) return;

        container.innerHTML = preferred.map(link => `
            <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
                ${escapeHtml(link.name)} ↗
            </a>
        `).join('');
    }

    function applyContent(data) {
        const blocks = data.contentBlocks || {};
        applySeo(blocks.seo);
        applyHero(blocks.hero);
        applyContact(blocks.contact);
        applyExperiences(data.experiences);
        applySkills(data.skills);
        applySocialLinks(data.socialLinks);

        window.Portfolio.projects?.setProjects?.(data.projects);
        window.Portfolio.kudos?.setRemoteCount?.(data.kudosSummary && data.kudosSummary.count);
    }

    function init() {
        if (!window.Portfolio.cms) return;
        window.Portfolio.cms.loadPublicContent()
            .then(applyContent)
            .catch(() => applyContent(window.Portfolio.cms.getFallbackContent('fallback-error')));
    }

    window.Portfolio.content = {
        init,
        applyContent
    };
})();
