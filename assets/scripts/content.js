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
        setText('[data-hero-name]', hero.title);
    }

    function applyContact(contact) {
        if (!contact) return;
        if (contact.email) {
            window.Portfolio.config.email = contact.email;
            setText('#contact-email', contact.email);
        }
    }

    function safeLogoUrl(value) {
        const candidate = String(value || '').trim();
        if (!candidate) return '';
        if (/^assets\/images\/[a-z0-9/_\-.]+$/i.test(candidate)) return candidate;

        try {
            const url = new URL(candidate, window.location.href);
            return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
        } catch {
            return '';
        }
    }

    function normalizePeriod(value) {
        return String(value || '').replace(/\bPresente\b/gi, 'Atual');
    }

    function isLive(period) {
        return /atual|presente/i.test(String(period || ''));
    }

    function renderTimelineItem(item) {
        const stack = Array.isArray(item.stack) ? item.stack : [];
        const highlights = Array.isArray(item.highlights) ? item.highlights : [];
        const logoUrl = safeLogoUrl(item.logoUrl || item.logo_url);
        const logoFallbackUrl = safeLogoUrl(item.logoFallbackUrl || '');
        const live = isLive(item.period);

        return `
            <article class="stop${live ? ' stop--live' : ''}">
                <span class="stop-when">${escapeHtml(normalizePeriod(item.period))}</span>
                <div>
                    <div class="stop-org">
                        ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="" loading="lazy" decoding="async"${logoFallbackUrl ? ` data-logo-fallback="${escapeHtml(logoFallbackUrl)}"` : ''}>` : ''}
                        <h3>${escapeHtml(item.company)}</h3>
                    </div>
                    <p class="stop-role">${escapeHtml(item.role)}</p>
                    <ul class="stop-points">
                        ${highlights.slice(0, 3).map(point => `
                            <li>
                                <h4>${escapeHtml(point.title || '')}</h4>
                                <p>${escapeHtml(point.text || '')}</p>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="stop-stack">
                    ${stack.slice(0, 6).map(tag => `<span class="chip">${escapeHtml(tag)}</span>`).join('')}
                </div>
            </article>
        `;
    }

    function applyExperiences(experiences) {
        const timeline = document.getElementById('experience-timeline');
        if (!timeline) return;

        const source = Array.isArray(experiences) && experiences.length ? experiences : [];
        const fallback = Array.isArray(window.Portfolio.fallbackData?.experiences)
            ? window.Portfolio.fallbackData.experiences
            : [];
        const merged = source.map(item => ({ ...item }));

        fallback.forEach(item => {
            const exists = merged.some(candidate => String(candidate.company).toLowerCase() === String(item.company).toLowerCase());
            if (!exists) merged.push({ ...item });
        });

        const timelineItems = merged.map(item => {
            const fallbackItem = fallback.find(candidate => String(candidate.company).toLowerCase() === String(item.company).toLowerCase()) || {};
            const highlights = Array.isArray(item.highlights) && item.highlights.length
                ? item.highlights
                : (fallbackItem.highlights || []);
            return {
                ...fallbackItem,
                ...item,
                logoUrl: item.logoUrl || item.logo_url || fallbackItem.logoUrl || '',
                logoFallbackUrl: item.logoFallbackUrl || fallbackItem.logoUrl || '',
                stack: Array.isArray(item.stack) && item.stack.length ? item.stack : (fallbackItem.stack || []),

                highlights
            };
        });

        timeline.innerHTML = timelineItems.map(renderTimelineItem).join('');
        timeline.querySelectorAll('img[data-logo-fallback]').forEach(image => {
            image.addEventListener('error', () => {
                const fallbackUrl = image.dataset.logoFallback;
                if (!fallbackUrl || image.src.endsWith(fallbackUrl)) return;
                image.src = fallbackUrl;
            }, { once: true });
        });
    }

    function applySkills(skills) {
        const matrix = document.getElementById('capability-matrix');
        if (!matrix) return;

        const groups = Array.isArray(skills) ? skills : [];
        const caseTitles = (window.Portfolio.fallbackData?.projects || []).map(item => item.title);
        const rows = [
            {
                title: 'Backend e integrações',
                items: groups[0]?.items || ['C#', 'Java', 'Python', 'TypeScript'],
                evidence: 'Aplicado em APIs e controle de acesso no Itaú Unibanco.',
                projectIndex: 2
            },
            {
                title: 'Automação de processos',
                items: groups[1]?.items || ['Power Platform', 'APIs REST', 'Docker'],
                evidence: 'Automações de provisionamento e segurança em ambiente bancário.',
                projectIndex: 1
            },
            {
                title: 'Confiabilidade e operação',
                items: ['SRE', 'Observabilidade', 'Resiliência', 'GMUD', 'Cloud'],
                evidence: 'Testes de resiliência e governança de mudança no Itaú Unibanco. Trabalho interno, sem case público.',

                projectIndex: null
            },
            {
                title: 'Produto e arquitetura',
                items: groups[2]?.items || ['System Design', 'Algoritmos', 'UX/UI Design'],
                evidence: `Modelagem de regras e fluxo nos ${window.Portfolio.projects.countWord(window.Portfolio.projects.caseCount())} casos deste portfólio.`,
                projectIndex: 0
            }
        ];

        const shortTitle = title => String(title || '').split(' ').slice(0, 3).join(' ').replace(/[,:]$/, '');

        matrix.innerHTML = rows.map(row => {
            const target = row.projectIndex === null ? '' : caseTitles[row.projectIndex];
            return `
            <article class="capability">
                <h3>${escapeHtml(row.title)}</h3>
                <ul class="capability-items">
                    ${row.items.slice(0, 6).map(item => `<li class="chip">${escapeHtml(item)}</li>`).join('')}
                </ul>
                <p class="capability-evidence">${escapeHtml(row.evidence)}</p>
                ${target ? `<button class="act act--ghost" type="button" data-capability-project="${row.projectIndex}" aria-label="Abrir o caso ${escapeHtml(target)}">Ver ${escapeHtml(shortTitle(target))}</button>` : ''}
            </article>
        `;
        }).join('');

        matrix.querySelectorAll('[data-capability-project]').forEach(button => {
            button.addEventListener('click', () => {
                const index = Number(button.dataset.capabilityProject);
                window.Portfolio.projects.selectProject(index);
                window.Portfolio.utils.smoothScrollTo(document.getElementById('projects'));
            });
        });
    }

    function safeExternalUrl(value) {
        if (!value) return '';
        try {
            const url = new URL(value, window.location.origin);
            return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
        } catch (error) {
            return '';
        }
    }

    function formatCertificateDate(value) {
        if (!value) return 'Data não informada';
        const date = new Date(`${value}T12:00:00`);
        if (Number.isNaN(date.getTime())) return value;
        return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(date);
    }

    function applyCertificates(certificates) {
        const section = document.getElementById('certificates');
        const list = document.getElementById('certificates-list');
        if (!section || !list) return;

        const items = Array.isArray(certificates) ? certificates.filter(item => item && item.name) : [];
        section.hidden = items.length === 0;
        document.querySelectorAll('[data-certificates-nav]').forEach(item => {
            item.hidden = items.length === 0;
        });
        if (!items.length) {
            list.innerHTML = '';
            return;
        }

        list.innerHTML = items.map(item => {
            const credentialUrl = safeExternalUrl(item.credentialUrl || item.credential_url);
            const imageUrl = safeExternalUrl(item.imageUrl || '');
            const skills = Array.isArray(item.skills) ? item.skills : [];

            return `
                <article class="credential">
                    ${imageUrl
                        ? `<img src="${escapeHtml(imageUrl)}" alt="" loading="lazy" decoding="async">`
                        : '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3 4 7v6c0 4.5 3.4 7.2 8 8 4.6-.8 8-3.5 8-8V7l-8-4Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>'}
                    <div>
                        <h3>${escapeHtml(item.name)}</h3>
                        <p class="credential-meta">
                            <span>${escapeHtml(item.issuer)}</span>
                            <time datetime="${escapeHtml(item.issuedAt || item.issued_at || '')}">${escapeHtml(formatCertificateDate(item.issuedAt || item.issued_at))}</time>
                        </p>
                        ${skills.length ? `<p class="credential-skills">${skills.slice(0, 4).map(escapeHtml).join(' · ')}</p>` : ''}
                    </div>
                    ${credentialUrl ? `<a class="act act--ghost" href="${escapeHtml(credentialUrl)}" target="_blank" rel="noopener noreferrer">Verificar</a>` : ''}
                </article>
            `;
        }).join('');
    }

    function socialIcon(name) {
        const icons = {
            LinkedIn: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M6.5 8.25H3.25V20H6.5V8.25ZM4.88 3A1.88 1.88 0 1 0 4.88 6.75 1.88 1.88 0 0 0 4.88 3ZM20.75 13.26c0-3.54-1.89-5.19-4.42-5.19-2.04 0-2.95 1.12-3.46 1.91V8.25H9.62V20h3.25v-5.82c0-1.53.29-3.02 2.19-3.02 1.87 0 1.89 1.75 1.89 3.12V20h3.25l.55-6.74Z"/></svg>',
            GitHub: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.54 1.03 1.54 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.84c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
            Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>'
        };
        return icons[name] || '';
    }

    function applySocialLinks(links) {
        const container = document.querySelector('.gate-social');
        if (!container || !Array.isArray(links) || !links.length) return;

        const order = ['GitHub', 'Instagram'];
        const defaults = {
            Instagram: {
                name: 'Instagram',
                label: 'scalabrin.dev',
                url: 'https://www.instagram.com/scalabrin.dev/'
            }
        };
        const preferred = order
            .map(name => {
                const match = links.find(link => String(link.name).toLowerCase() === name.toLowerCase());
                return match ? { ...match, name } : defaults[name];
            })
            .filter(Boolean)
            .map(link => ({ ...link, url: safeExternalUrl(link.url) }))
            .filter(link => link.url);
        if (!preferred.length) return;

        container.innerHTML = preferred.map(link => `
            <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${escapeHtml(link.name)} de Matheus Scalabrin">
                ${socialIcon(link.name)}
                ${escapeHtml(link.name)}
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
        applyCertificates(data.certificates);
        applySocialLinks(data.socialLinks);

        window.Portfolio.projects?.setProjects?.(data.projects);
        if (data.source === 'supabase') {
            window.Portfolio.kudos?.setRemoteCount?.(data.kudosSummary && data.kudosSummary.count);
        }
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
