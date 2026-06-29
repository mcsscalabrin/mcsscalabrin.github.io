(function () {
    const state = {
        source: 'fallback',
        canWrite: false,
        data: null,
        selectedProject: null,
        selectedContentKey: null,
        selectedExperienceId: null,
        selectedSkillId: null,
        selectedSocialId: null,
        authUserId: null,
        authSubscription: null
    };
    let bootQueue = Promise.resolve();

    const $ = selector => document.querySelector(selector);
    const $$ = selector => Array.from(document.querySelectorAll(selector));
    const viewTitles = {
        dashboard: 'Dashboard',
        projects: 'Projetos',
        content: 'Conteúdo',
        experiences: 'Experiências',
        skills: 'Skills',
        media: 'Mídia',
        kudos: 'Kudos'
    };

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function setStatus(message) {
        const status = $('#admin-status');
        const authStatus = $('#auth-status');
        if (status) status.innerText = message;
        if (authStatus) authStatus.innerText = message;
    }

    async function copyText(value, successMessage) {
        try {
            await navigator.clipboard.writeText(value);
            setStatus(successMessage || 'Copiado.');
        } catch (error) {
            setStatus('Não foi possível copiar automaticamente. Selecione o texto manualmente.');
        }
    }

    function parseJson(value, fallback) {
        try {
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            throw new Error('JSON inválido. Revise a estrutura antes de salvar.');
        }
    }

    function lines(value) {
        return String(value || '')
            .split('\n')
            .map(item => item.trim())
            .filter(Boolean);
    }

    function csv(value) {
        return String(value || '')
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
    }

    function fallbackAdminData() {
        const fallback = window.Portfolio.fallbackData;
        return {
            projects: fallback.projects,
            media: fallback.projects.flatMap(project => project.media.map((item, index) => ({
                id: `${project.slug}-${index}`,
                projectSlug: project.slug,
                storagePath: item.src,
                src: item.src,
                alt: item.alt,
                caption: item.caption,
                tone: item.tone,
                isCover: item.isCover,
                sortOrder: index
            }))),
            contentBlocks: Object.keys(fallback.contentBlocks).map(key => ({
                key,
                payload: fallback.contentBlocks[key],
                published: true
            })),
            experiences: fallback.experiences.map((item, index) => Object.assign({ id: `fallback-exp-${index}` }, item)),
            skills: fallback.skills.map((item, index) => Object.assign({ id: `fallback-skill-${index}` }, item)),
            socialLinks: fallback.socialLinks.map((item, index) => Object.assign({ id: `fallback-social-${index}` }, item)),
            kudosSummary: fallback.kudosSummary
        };
    }

    function requireWrite() {
        if (state.canWrite) return true;
        setStatus('Modo leitura. Configure Supabase e libere seu usuário em admin_users para salvar.');
        return false;
    }

    function setAuthGate(userId) {
        state.authUserId = userId || null;
        const gate = $('#admin-gate-alert');
        const userIdTarget = $('#auth-user-id');
        const loginLink = $('#github-login-btn');
        const copyButton = $('#auth-copy-user-btn');
        const logoutButton = $('#auth-logout-btn');

        if (userId) {
            if (gate) gate.hidden = false;
            if (userIdTarget) userIdTarget.innerText = userId;
            if (loginLink) loginLink.hidden = true;
            if (copyButton) copyButton.hidden = false;
            if (logoutButton) logoutButton.hidden = false;
            return;
        }

        if (gate) gate.hidden = true;
        if (userIdTarget) userIdTarget.innerText = '';
        if (loginLink) loginLink.hidden = false;
        if (copyButton) copyButton.hidden = true;
        if (logoutButton) logoutButton.hidden = true;
    }

    function setLoginEnabled(enabled) {
        const loginLink = $('#github-login-btn');
        if (!loginLink) return;
        loginLink.setAttribute('aria-disabled', enabled ? 'false' : 'true');
        loginLink.tabIndex = enabled ? 0 : -1;
    }

    function refreshLoginHref() {
        const loginLink = $('#github-login-btn');
        const href = window.Portfolio.cms.getGithubAuthorizeUrl?.();
        if (loginLink && href && href !== '#') loginLink.href = href;
    }

    function showView(view) {
        $$('.admin-nav-btn').forEach(button => button.classList.toggle('active', button.dataset.adminView === view));
        $$('.admin-view').forEach(panel => panel.classList.toggle('active', panel.id === `view-${view}`));
        const title = $('#admin-view-title');
        if (title) title.innerText = viewTitles[view] || view;
    }

    function renderDashboard() {
        const metrics = $('#dashboard-metrics');
        if (!metrics || !state.data) return;

        const items = [
            ['Projetos', state.data.projects.length],
            ['Blocos', state.data.contentBlocks.length],
            ['Skills', state.data.skills.length],
            ['Kudos', state.data.kudosSummary.count || 0]
        ];

        metrics.innerHTML = items.map(([label, value]) => `
            <div class="admin-metric">
                <strong>${escapeHtml(value)}</strong>
                <span>${escapeHtml(label)}</span>
            </div>
        `).join('');
    }

    function renderProjects() {
        const list = $('#project-list');
        const select = $('#media-project-select');
        if (!list || !select || !state.data) return;

        list.innerHTML = state.data.projects.map(project => `
            <button type="button" data-project-slug="${escapeHtml(project.slug)}" class="${state.selectedProject === project.slug ? 'active' : ''}">
                <span class="admin-list-title">${escapeHtml(project.title)}</span>
                <span class="admin-list-meta">${escapeHtml(project.type)} · ${project.published === false ? 'draft' : 'published'}</span>
            </button>
        `).join('');

        select.innerHTML = state.data.projects.map(project => `
            <option value="${escapeHtml(project.slug)}">${escapeHtml(project.title)}</option>
        `).join('');

        list.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => selectProject(button.dataset.projectSlug));
        });

        if (!state.selectedProject && state.data.projects[0]) {
            selectProject(state.data.projects[0].slug);
        }
    }

    function selectProject(slug) {
        const project = state.data.projects.find(item => item.slug === slug);
        if (!project) return;
        state.selectedProject = slug;

        const form = $('#project-form');
        form.elements.slug.value = project.slug || '';
        form.elements.type.value = project.type || 'software';
        form.elements.title.value = project.title || '';
        form.elements.meta.value = project.meta || '';
        form.elements.role.value = project.role || '';
        form.elements.summary.value = project.summary || '';
        form.elements.context.value = project.context || '';
        form.elements.cardItems.value = JSON.stringify(project.cardItems || [], null, 2);
        form.elements.responsibilities.value = (project.responsibilities || []).join('\n');
        form.elements.technicalDecisions.value = (project.technicalDecisions || []).join('\n');
        form.elements.learnings.value = (project.learnings || []).join('\n');
        form.elements.stack.value = (project.stack || []).join(', ');
        form.elements.sortOrder.value = project.sortOrder || 0;
        form.elements.published.checked = project.published !== false;

        renderProjects();
    }

    function newProject() {
        state.selectedProject = null;
        const form = $('#project-form');
        form.reset();
        form.elements.slug.value = '';
        form.elements.type.value = 'software';
        form.elements.cardItems.value = JSON.stringify([
            { label: 'Problema', text: '' },
            { label: 'Papel', text: '' },
            { label: 'Decisão', text: '' },
            { label: 'Resultado', text: '' }
        ], null, 2);
        form.elements.published.checked = false;
    }

    function projectFromForm() {
        const form = $('#project-form');
        return {
            slug: form.elements.slug.value.trim(),
            type: form.elements.type.value,
            title: form.elements.title.value.trim(),
            meta: form.elements.meta.value.trim(),
            role: form.elements.role.value.trim(),
            summary: form.elements.summary.value.trim(),
            context: form.elements.context.value.trim(),
            cardItems: parseJson(form.elements.cardItems.value, []),
            responsibilities: lines(form.elements.responsibilities.value),
            technicalDecisions: lines(form.elements.technicalDecisions.value),
            learnings: lines(form.elements.learnings.value),
            stack: csv(form.elements.stack.value),
            sortOrder: Number(form.elements.sortOrder.value || 0),
            published: form.elements.published.checked
        };
    }

    async function saveProject(event) {
        event.preventDefault();
        if (!requireWrite()) return;

        try {
            const project = projectFromForm();
            if (!project.slug || !project.title) throw new Error('Slug e título são obrigatórios.');
            const result = await window.Portfolio.cms.saveProject(project);
            if (result.error) throw result.error;
            setStatus('Projeto salvo.');
            await reloadAdminData();
            selectProject(project.slug);
        } catch (error) {
            setStatus(error.message);
        }
    }

    async function deleteProject() {
        if (!requireWrite() || !state.selectedProject) return;
        if (!window.confirm('Excluir este projeto?')) return;

        const result = await window.Portfolio.cms.deleteProject(state.selectedProject);
        if (result.error) {
            setStatus(result.error.message);
            return;
        }

        state.selectedProject = null;
        setStatus('Projeto excluído.');
        await reloadAdminData();
    }

    function renderContentBlocks() {
        const select = $('#content-key-select');
        if (!select || !state.data) return;
        select.innerHTML = state.data.contentBlocks.map(block => `
            <option value="${escapeHtml(block.key)}">${escapeHtml(block.key)}</option>
        `).join('');
        state.selectedContentKey = state.selectedContentKey || state.data.contentBlocks[0]?.key;
        select.value = state.selectedContentKey || '';
        renderContentPayload();
    }

    function renderContentPayload() {
        const key = $('#content-key-select')?.value;
        const block = state.data.contentBlocks.find(item => item.key === key);
        state.selectedContentKey = key;
        $('#content-payload').value = JSON.stringify(block?.payload || {}, null, 2);
    }

    async function saveContentBlock() {
        if (!requireWrite()) return;
        try {
            const key = $('#content-key-select').value;
            const payload = parseJson($('#content-payload').value, {});
            const result = await window.Portfolio.cms.saveContentBlock(key, payload, true);
            if (result.error) throw result.error;
            setStatus('Bloco salvo.');
            await reloadAdminData();
        } catch (error) {
            setStatus(error.message);
        }
    }

    function renderExperiences() {
        const list = $('#experience-list');
        if (!list || !state.data) return;
        list.innerHTML = state.data.experiences.map(item => `
            <button type="button" data-id="${escapeHtml(item.id)}" class="${state.selectedExperienceId === item.id ? 'active' : ''}">
                <span class="admin-list-title">${escapeHtml(item.company)}</span>
                <span class="admin-list-meta">${escapeHtml(item.role)}</span>
            </button>
        `).join('');
        list.querySelectorAll('button').forEach(button => button.addEventListener('click', () => selectExperience(button.dataset.id)));
        if (!state.selectedExperienceId && state.data.experiences[0]) selectExperience(state.data.experiences[0].id);
    }

    function selectExperience(id) {
        const item = state.data.experiences.find(row => String(row.id) === String(id));
        if (!item) return;
        state.selectedExperienceId = item.id;
        const form = $('#experience-form');
        form.elements.id.value = item.id || '';
        form.elements.company.value = item.company || '';
        form.elements.role.value = item.role || '';
        form.elements.period.value = item.period || '';
        form.elements.badge.value = item.badge || '';
        form.elements.highlights.value = JSON.stringify(item.highlights || [], null, 2);
        form.elements.stack.value = (item.stack || []).join(', ');
        form.elements.sort_order.value = item.sort_order || item.sortOrder || 0;
        form.elements.published.checked = item.published !== false;
        renderExperiences();
    }

    async function saveExperience(event) {
        event.preventDefault();
        if (!requireWrite()) return;
        try {
            const form = $('#experience-form');
            const item = {
                id: form.elements.id.value || undefined,
                company: form.elements.company.value,
                role: form.elements.role.value,
                period: form.elements.period.value,
                badge: form.elements.badge.value,
                highlights: parseJson(form.elements.highlights.value, []),
                stack: csv(form.elements.stack.value),
                sort_order: Number(form.elements.sort_order.value || 0),
                published: form.elements.published.checked
            };
            const result = await window.Portfolio.cms.saveExperience(item);
            if (result.error) throw result.error;
            setStatus('Experiência salva.');
            await reloadAdminData();
        } catch (error) {
            setStatus(error.message);
        }
    }

    async function deleteExperience() {
        if (!requireWrite() || !state.selectedExperienceId) return;
        if (!window.confirm('Excluir esta experiência?')) return;
        const result = await window.Portfolio.cms.deleteRow('experiences', state.selectedExperienceId);
        if (result.error) {
            setStatus(result.error.message);
            return;
        }
        state.selectedExperienceId = null;
        setStatus('Experiência excluída.');
        await reloadAdminData();
    }

    function renderSkills() {
        const list = $('#skill-list');
        if (!list || !state.data) return;
        list.innerHTML = state.data.skills.map(item => `
            <button type="button" data-id="${escapeHtml(item.id)}" class="${state.selectedSkillId === item.id ? 'active' : ''}">
                <span class="admin-list-title">${escapeHtml(item.group)}</span>
                <span class="admin-list-meta">${escapeHtml((item.items || []).join(', '))}</span>
            </button>
        `).join('');
        list.querySelectorAll('button').forEach(button => button.addEventListener('click', () => selectSkill(button.dataset.id)));
        if (!state.selectedSkillId && state.data.skills[0]) selectSkill(state.data.skills[0].id);
    }

    function selectSkill(id) {
        const item = state.data.skills.find(row => String(row.id) === String(id));
        if (!item) return;
        state.selectedSkillId = item.id;
        const form = $('#skill-form');
        form.elements.id.value = item.id || '';
        form.elements.group.value = item.group || '';
        form.elements.items.value = (item.items || []).join('\n');
        form.elements.sort_order.value = item.sort_order || item.sortOrder || 0;
        form.elements.published.checked = item.published !== false;
        renderSkills();
    }

    async function saveSkill(event) {
        event.preventDefault();
        if (!requireWrite()) return;
        const form = $('#skill-form');
        const result = await window.Portfolio.cms.saveSkill({
            id: form.elements.id.value || undefined,
            group: form.elements.group.value,
            items: lines(form.elements.items.value),
            sort_order: Number(form.elements.sort_order.value || 0),
            published: form.elements.published.checked
        });
        if (result.error) {
            setStatus(result.error.message);
            return;
        }
        setStatus('Skill salva.');
        await reloadAdminData();
    }

    async function deleteSkill() {
        if (!requireWrite() || !state.selectedSkillId) return;
        if (!window.confirm('Excluir esta skill?')) return;
        const result = await window.Portfolio.cms.deleteRow('skills', state.selectedSkillId);
        if (result.error) {
            setStatus(result.error.message);
            return;
        }
        state.selectedSkillId = null;
        setStatus('Skill excluída.');
        await reloadAdminData();
    }

    function renderSocials() {
        const list = $('#social-list');
        if (!list || !state.data) return;
        list.innerHTML = state.data.socialLinks.map(item => `
            <button type="button" data-id="${escapeHtml(item.id)}" class="${state.selectedSocialId === item.id ? 'active' : ''}">
                <span class="admin-list-title">${escapeHtml(item.name)}</span>
                <span class="admin-list-meta">${escapeHtml(item.url)}</span>
            </button>
        `).join('');
        list.querySelectorAll('button').forEach(button => button.addEventListener('click', () => selectSocial(button.dataset.id)));
        if (!state.selectedSocialId && state.data.socialLinks[0]) selectSocial(state.data.socialLinks[0].id);
    }

    function selectSocial(id) {
        const item = state.data.socialLinks.find(row => String(row.id) === String(id));
        if (!item) return;
        state.selectedSocialId = item.id;
        const form = $('#social-form');
        form.elements.id.value = item.id || '';
        form.elements.name.value = item.name || '';
        form.elements.label.value = item.label || '';
        form.elements.url.value = item.url || '';
        form.elements.sort_order.value = item.sort_order || item.sortOrder || 0;
        form.elements.published.checked = item.published !== false;
        renderSocials();
    }

    async function saveSocial(event) {
        event.preventDefault();
        if (!requireWrite()) return;
        const form = $('#social-form');
        const result = await window.Portfolio.cms.saveSocialLink({
            id: form.elements.id.value || undefined,
            name: form.elements.name.value,
            label: form.elements.label.value,
            url: form.elements.url.value,
            sort_order: Number(form.elements.sort_order.value || 0),
            published: form.elements.published.checked
        });
        if (result.error) {
            setStatus(result.error.message);
            return;
        }
        setStatus('Link social salvo.');
        await reloadAdminData();
    }

    async function deleteSocial() {
        if (!requireWrite() || !state.selectedSocialId) return;
        if (!window.confirm('Excluir este link social?')) return;
        const result = await window.Portfolio.cms.deleteRow('social_links', state.selectedSocialId);
        if (result.error) {
            setStatus(result.error.message);
            return;
        }
        state.selectedSocialId = null;
        setStatus('Link social excluído.');
        await reloadAdminData();
    }

    function renderMedia() {
        const list = $('#media-list');
        if (!list || !state.data) return;
        list.innerHTML = state.data.media.map(item => `
            <div class="admin-list-item">
                <span class="admin-list-title">${escapeHtml(item.alt || item.storagePath)}</span>
                <span class="admin-list-meta">${escapeHtml(item.projectSlug || item.project_slug || '')} · ${escapeHtml(item.tone || '')}</span>
            </div>
        `).join('');
    }

    async function uploadMedia() {
        if (!requireWrite()) return;
        const file = $('#media-file').files[0];
        const projectSlug = $('#media-project-select').value;
        const alt = $('#media-alt').value.trim();
        if (!file || !projectSlug || !alt) {
            setStatus('Arquivo, projeto e alt text são obrigatórios.');
            return;
        }

        try {
            const upload = await window.Portfolio.cms.uploadMedia(file, projectSlug);
            const result = await window.Portfolio.cms.saveProjectMedia({
                projectSlug,
                storagePath: upload.storagePath,
                alt,
                caption: $('#media-caption').value.trim(),
                tone: $('#media-tone').value,
                isCover: $('#media-cover').checked,
                published: true
            });
            if (result.error) throw result.error;
            setStatus('Mídia enviada.');
            await reloadAdminData();
        } catch (error) {
            setStatus(error.message);
        }
    }

    function renderKudos() {
        const count = $('#admin-kudos-count');
        if (count) count.innerText = String(state.data?.kudosSummary?.count || 0);
    }

    function renderAll() {
        $('#admin-source').innerText = `Fonte: ${state.source}${state.canWrite ? ' · escrita habilitada' : ' · leitura'}`;
        renderDashboard();
        renderProjects();
        renderContentBlocks();
        renderExperiences();
        renderSkills();
        renderSocials();
        renderMedia();
        renderKudos();
    }

    async function reloadAdminData() {
        if (window.Portfolio.cms.isConfigured() && state.canWrite) {
            state.data = await window.Portfolio.cms.loadAdminData();
            state.source = 'supabase';
        } else {
            state.data = fallbackAdminData();
            state.source = 'fallback';
        }
        renderAll();
    }

    async function boot() {
        const configured = window.Portfolio.cms.isConfigured();
        $('#setup-alert').hidden = configured;

        if (!configured) {
            document.body.classList.add('admin-fallback-mode');
            setLoginEnabled(false);
            setAuthGate(null);
            $('#admin-auth').hidden = false;
            $('#admin-app').hidden = false;
            state.canWrite = false;
            await reloadAdminData();
            setStatus('Modo fallback. Configure Supabase para habilitar escrita.');
            return;
        }

        document.body.classList.remove('admin-fallback-mode');
        refreshLoginHref();
        setLoginEnabled(true);
        setStatus('Verificando autenticação...');

        const session = await window.Portfolio.cms.getSession();
        if (!session) {
            setAuthGate(null);
            $('#admin-auth').hidden = false;
            $('#admin-app').hidden = true;
            setStatus('Aguardando login.');
            return;
        }

        state.canWrite = await window.Portfolio.cms.isAdmin(session.user.id);
        if (!state.canWrite) {
            setAuthGate(session.user.id);
            $('#admin-auth').hidden = false;
            $('#admin-app').hidden = true;
            setStatus('Usuário autenticado, ainda sem permissão de escrita.');
            return;
        }

        setAuthGate(null);
        $('#admin-auth').hidden = true;
        $('#admin-app').hidden = false;
        await reloadAdminData();
        setStatus('Admin autenticado.');
    }

    function queueBoot() {
        bootQueue = bootQueue
            .catch(() => {})
            .then(() => boot());
        return bootQueue;
    }

    function bindEvents() {
        $('#github-login-btn')?.addEventListener('click', event => {
            const loginLink = event.currentTarget;

            if (loginLink.getAttribute('aria-disabled') === 'true') {
                event.preventDefault();
                return;
            }

            const href = loginLink.getAttribute('href');
            if (!href || href === '#') {
                event.preventDefault();
                setStatus('Não foi possível iniciar login GitHub.');
                return;
            }

            // Preserve the browser's user-initiated navigation. Delaying the
            // redirect until after an async OAuth call can be blocked by
            // in-app browsers and strict privacy settings.
            setStatus('Abrindo login GitHub...');
        });
        $('#auth-copy-user-btn')?.addEventListener('click', () => {
            if (state.authUserId) copyText(state.authUserId, 'User ID copiado.');
        });
        $('#auth-logout-btn')?.addEventListener('click', async () => {
            await window.Portfolio.cms.signOut();
            window.location.reload();
        });
        $('#logout-btn')?.addEventListener('click', async () => {
            await window.Portfolio.cms.signOut();
            window.location.reload();
        });
        $$('.admin-nav-btn').forEach(button => button.addEventListener('click', () => showView(button.dataset.adminView)));
        $('#new-project-btn')?.addEventListener('click', newProject);
        $('#project-form')?.addEventListener('submit', saveProject);
        $('#delete-project-btn')?.addEventListener('click', deleteProject);
        $('#content-key-select')?.addEventListener('change', renderContentPayload);
        $('#save-content-btn')?.addEventListener('click', saveContentBlock);
        $('#experience-form')?.addEventListener('submit', saveExperience);
        $('#skill-form')?.addEventListener('submit', saveSkill);
        $('#social-form')?.addEventListener('submit', saveSocial);
        $('#delete-experience-btn')?.addEventListener('click', deleteExperience);
        $('#delete-skill-btn')?.addEventListener('click', deleteSkill);
        $('#delete-social-btn')?.addEventListener('click', deleteSocial);
        $('#new-experience-btn')?.addEventListener('click', () => $('#experience-form').reset());
        $('#new-skill-btn')?.addEventListener('click', () => $('#skill-form').reset());
        $('#new-social-btn')?.addEventListener('click', () => $('#social-form').reset());
        $('#upload-media-btn')?.addEventListener('click', uploadMedia);
    }

    function normalizeLocalOrigin() {
        if (window.location.hostname !== '127.0.0.1') return false;
        const target = new URL(window.location.href);
        target.hostname = 'localhost';
        window.location.replace(target.toString());
        return true;
    }

    async function startAdmin() {
        if (normalizeLocalOrigin()) return;
        bindEvents();

        try {
            await queueBoot();
            state.authSubscription = await window.Portfolio.cms.onAuthStateChange?.(() => {
                window.setTimeout(() => {
                    queueBoot().catch(error => setStatus(error.message));
                }, 0);
            });
        } catch (error) {
            setStatus(error.message || 'Não foi possível verificar a autenticação.');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startAdmin);
    } else {
        startAdmin();
    }
})();
