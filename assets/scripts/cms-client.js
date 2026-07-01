(function () {
    window.Portfolio = window.Portfolio || {};

    const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    let supabaseClient = null;
    let clientPromise = null;
    let loadingLibrary = null;

    function getConfig() {
        return window.Portfolio.cmsConfig || {};
    }

    function isConfigured() {
        const config = getConfig();
        return Boolean(config.enabled && config.supabaseUrl && config.supabaseAnonKey);
    }

    function isLocalAdminHost() {
        return ['localhost', '127.0.0.1'].includes(window.location.hostname);
    }

    function getFallbackContent(source) {
        return Object.assign({ source: source || 'fallback' }, window.Portfolio.fallbackData || {});
    }

    function getOAuthRedirectUrl() {
        const config = getConfig();
        const path = config.githubOAuthRedirectPath || window.location.pathname || '/admin/';
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;

        if (/^https?:\/\//i.test(path)) return path;

        return `${window.location.origin}${normalizedPath}`;
    }

    function getGithubAuthorizeUrl() {
        const config = getConfig();
        if (!config.supabaseUrl) return '#';

        const url = new URL('/auth/v1/authorize', config.supabaseUrl);
        url.searchParams.set('provider', 'github');
        url.searchParams.set('redirect_to', getOAuthRedirectUrl());
        return url.toString();
    }

    function cleanAuthCallbackUrl() {
        const hasAuthParams = /(?:access_token|refresh_token|code|error|error_description)=/.test(window.location.href);
        if (!hasAuthParams || !window.history?.replaceState) return;
        window.history.replaceState({}, document.title, `${window.location.origin}${window.location.pathname}`);
    }

    function getAuthCallbackError() {
        const search = new URLSearchParams(window.location.search);
        const hash = new URLSearchParams(String(window.location.hash || '').replace(/^#/, ''));
        const error = search.get('error_description') || hash.get('error_description') || search.get('error') || hash.get('error');
        return error ? decodeURIComponent(error.replace(/\+/g, ' ')) : '';
    }

    function getAuthCallbackParams() {
        const search = new URLSearchParams(window.location.search);
        const hash = new URLSearchParams(String(window.location.hash || '').replace(/^#/, ''));

        return {
            code: search.get('code') || '',
            accessToken: hash.get('access_token') || '',
            refreshToken: hash.get('refresh_token') || ''
        };
    }

    function loadSupabaseLibrary() {
        if (window.supabase && window.supabase.createClient) {
            return Promise.resolve(window.supabase);
        }

        if (loadingLibrary) return loadingLibrary;

        loadingLibrary = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = SUPABASE_CDN;
            script.async = true;
            script.onload = () => {
                if (window.supabase && window.supabase.createClient) {
                    resolve(window.supabase);
                } else {
                    reject(new Error('Biblioteca Supabase indisponível.'));
                }
            };
            script.onerror = () => reject(new Error('Não foi possível carregar Supabase.'));
            document.head.appendChild(script);
        });

        return loadingLibrary;
    }

    async function getClient() {
        if (!isConfigured()) return null;
        if (supabaseClient) return supabaseClient;
        if (clientPromise) return clientPromise;

        clientPromise = (async () => {
            const config = getConfig();
            const library = await loadSupabaseLibrary();
            supabaseClient = library.createClient(config.supabaseUrl, config.supabaseAnonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: false,
                    flowType: 'implicit'
                }
            });
            return supabaseClient;
        })().catch(error => {
            clientPromise = null;
            throw error;
        });

        return clientPromise;
    }

    function safeArray(value) {
        return Array.isArray(value) ? value : [];
    }

    function buildMediaUrl(item) {
        if (!item) return '';
        if (item.src) return item.src;
        if (!item.storage_path) return '';

        const client = supabaseClient;
        const bucket = getConfig().storageBucket || 'portfolio-media';
        if (!client) return item.storage_path;

        const result = client.storage.from(bucket).getPublicUrl(item.storage_path);
        return result.data.publicUrl;
    }

    function normalizeMedia(item, fallbackItem) {
        return {
            id: item.id,
            src: buildMediaUrl(item),
            fallbackSrc: item.fallbackSrc || fallbackItem?.src || '',
            storagePath: item.storage_path || item.storagePath || '',
            alt: item.alt || '',
            caption: item.caption || '',
            tone: item.tone || 'photo',
            isCover: Boolean(item.is_cover || item.isCover),
            sortOrder: Number(item.sort_order || item.sortOrder || 0)
        };
    }

    function normalizeProject(row, mediaRows) {
        const fallbackProject = safeArray(window.Portfolio.fallbackData?.projects)
            .find(project => project.slug === row.slug || project.id === row.slug);
        const fallbackMedia = safeArray(fallbackProject?.media);
        const media = safeArray(mediaRows)
            .filter(item => item.project_slug === row.slug || item.projectSlug === row.slug || !item.project_slug)
            .map((item, index) => {
                const storagePath = item.storage_path || item.storagePath || '';
                const fileName = storagePath.split('/').pop();
                const localMatch = fallbackMedia.find(candidate => {
                    const localFileName = String(candidate.src || '').split('/').pop();
                    return fileName && localFileName === fileName;
                });
                return normalizeMedia(item, localMatch || fallbackMedia[index]);
            })
            .sort((a, b) => Number(b.isCover) - Number(a.isCover) || a.sortOrder - b.sortOrder);

        return {
            id: row.slug,
            slug: row.slug,
            type: row.type || 'software',
            title: row.title || '',
            role: row.role || '',
            meta: row.meta || row.role || '',
            summary: row.summary || '',
            context: row.context || '',
            cardItems: safeArray(row.card_items || row.cardItems),
            responsibilities: safeArray(row.responsibilities),
            technicalDecisions: safeArray(row.technical_decisions || row.technicalDecisions),
            learnings: safeArray(row.learnings),
            stack: safeArray(row.stack),
            repositoryUrl: row.repository_url || row.repositoryUrl || '',
            projectUrl: row.project_url || row.projectUrl || '',
            projectUrlLabel: row.project_url_label || row.projectUrlLabel || '',
            published: row.published !== false,
            sortOrder: Number(row.sort_order || row.sortOrder || 0),
            media
        };
    }

    function normalizeCertificate(row) {
        const storagePath = row.image_storage_path || row.imageStoragePath || '';
        return {
            id: row.id,
            name: row.name || '',
            issuer: row.issuer || '',
            issuedAt: row.issued_at || row.issuedAt || '',
            credentialId: row.credential_id || row.credentialId || '',
            credentialUrl: row.credential_url || row.credentialUrl || '',
            description: row.description || '',
            skills: safeArray(row.skills),
            imageStoragePath: storagePath,
            imageUrl: storagePath ? buildMediaUrl({ storage_path: storagePath }) : '',
            published: row.published !== false,
            sortOrder: Number(row.sort_order || row.sortOrder || 0)
        };
    }

    function normalizeExperience(row) {
        const storagePath = row.logo_storage_path || row.logoStoragePath || '';
        const fallback = safeArray(window.Portfolio.fallbackData?.experiences)
            .find(item => String(item.company).toLowerCase() === String(row.company).toLowerCase());
        const fallbackUrl = fallback?.logoUrl || '';
        return {
            ...row,
            highlights: safeArray(row.highlights),
            stack: safeArray(row.stack),
            logoStoragePath: storagePath,
            logoUrl: storagePath ? buildMediaUrl({ storage_path: storagePath }) : fallbackUrl,
            logoFallbackUrl: fallbackUrl,
            sortOrder: Number(row.sort_order || row.sortOrder || 0)
        };
    }

    async function loadPublicContent() {
        if (!isConfigured()) return getFallbackContent('fallback');

        try {
            const client = await getClient();
            const [
                blocksResult,
                projectsResult,
                mediaResult,
                experiencesResult,
                skillsResult,
                certificatesResult,
                socialsResult,
                kudosResult
            ] = await Promise.all([
                client.from('content_blocks').select('key,payload').eq('published', true),
                client.from('projects').select('*').eq('published', true).order('sort_order', { ascending: true }),
                client.from('project_media').select('*').eq('published', true).order('sort_order', { ascending: true }),
                client.from('experiences').select('*').eq('published', true).order('sort_order', { ascending: true }),
                client.from('skills').select('*').eq('published', true).order('sort_order', { ascending: true }),
                client.from('certificates').select('*').eq('published', true).order('sort_order', { ascending: true }),
                client.from('social_links').select('*').eq('published', true).order('sort_order', { ascending: true }),
                client.from('kudos_summary').select('count').eq('id', 'global').maybeSingle()
            ]);

            const hasError = [
                blocksResult,
                projectsResult,
                mediaResult,
                experiencesResult,
                skillsResult,
                certificatesResult,
                socialsResult,
                kudosResult
            ].some(result => result.error);

            if (hasError) return getFallbackContent('fallback-error');

            const contentBlocks = {};
            safeArray(blocksResult.data).forEach(block => {
                contentBlocks[block.key] = block.payload || {};
            });

            const mediaRows = safeArray(mediaResult.data);
            const projects = safeArray(projectsResult.data)
                .map(row => normalizeProject(row, mediaRows))
                .filter(project => project.title);
            const certificates = safeArray(certificatesResult.data).map(normalizeCertificate);

            return {
                source: 'supabase',
                contentBlocks: Object.assign({}, window.Portfolio.fallbackData.contentBlocks, contentBlocks),
                projects: projects.length ? projects : window.Portfolio.fallbackData.projects,
                experiences: safeArray(experiencesResult.data).map(normalizeExperience),
                skills: safeArray(skillsResult.data),
                certificates: certificates.length ? certificates : window.Portfolio.fallbackData.certificates,
                socialLinks: safeArray(socialsResult.data),
                kudosSummary: kudosResult.data || { count: 0 }
            };
        } catch (error) {
            return getFallbackContent('fallback-error');
        }
    }

    async function getSession() {
        const client = await getClient();
        if (!client) return null;
        const callbackError = getAuthCallbackError();
        const callback = getAuthCallbackParams();

        try {
            if (callbackError) throw new Error(callbackError);

            if (callback.accessToken && callback.refreshToken) {
                const { data, error } = await client.auth.setSession({
                    access_token: callback.accessToken,
                    refresh_token: callback.refreshToken
                });
                if (error) throw error;
                return data.session || null;
            }

            if (callback.code) {
                const { data, error } = await client.auth.exchangeCodeForSession(callback.code);
                if (error) throw error;
                return data.session || null;
            }

            const { data, error } = await client.auth.getSession();
            if (error) throw error;
            return data.session || null;
        } finally {
            cleanAuthCallbackUrl();
        }
    }

    async function getUser() {
        const client = await getClient();
        if (!client) return null;
        const { data, error } = await client.auth.getUser();
        return error ? null : data.user;
    }

    async function signInWithGithub() {
        const client = await getClient();
        if (!client) throw new Error('Supabase não configurado.');

        const result = await client.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: getOAuthRedirectUrl(),
                skipBrowserRedirect: true
            }
        });

        if (result.error) return result;

        if (result.data?.url) {
            window.location.assign(result.data.url);
            return result;
        }

        return {
            error: new Error('Supabase não retornou a URL de login GitHub.')
        };
    }

    async function signOut() {
        const client = await getClient();
        if (!client) return;
        await client.auth.signOut();
    }

    async function getMfaState() {
        const client = await getClient();
        if (!client) throw new Error('Supabase não configurado.');

        const [assurance, factors] = await Promise.all([
            client.auth.mfa.getAuthenticatorAssuranceLevel(),
            client.auth.mfa.listFactors()
        ]);
        if (assurance.error) throw assurance.error;
        if (factors.error) throw factors.error;

        const verifiedTotp = safeArray(factors.data?.totp)
            .find(factor => !factor.status || factor.status === 'verified') || null;

        return {
            currentLevel: assurance.data?.currentLevel || 'aal1',
            nextLevel: assurance.data?.nextLevel || 'aal1',
            verifiedFactor: verifiedTotp
        };
    }

    async function enrollMfaTotp() {
        const client = await getClient();
        if (!client) throw new Error('Supabase não configurado.');

        const { data, error } = await client.auth.mfa.enroll({
            factorType: 'totp',
            friendlyName: 'Scalabrin CMS'
        });
        if (error) throw error;
        if (!data?.id || !data?.totp?.qr_code || !data?.totp?.secret) {
            throw new Error('Supabase não retornou os dados de configuração do MFA.');
        }

        return {
            factorId: data.id,
            qrCode: data.totp.qr_code,
            secret: data.totp.secret
        };
    }

    async function verifyMfaTotp(factorId, code) {
        const client = await getClient();
        if (!client) throw new Error('Supabase não configurado.');
        if (!factorId) throw new Error('Fator MFA não encontrado.');

        const normalizedCode = String(code || '').replace(/\s+/g, '');
        if (!/^\d{6}$/.test(normalizedCode)) {
            throw new Error('Digite o código de seis dígitos do autenticador.');
        }

        const { data, error } = await client.auth.mfa.challengeAndVerify({
            factorId,
            code: normalizedCode
        });
        if (error) throw error;
        return data;
    }

    async function onAuthStateChange(callback) {
        const client = await getClient();
        if (!client || !client.auth?.onAuthStateChange) return null;
        const { data } = client.auth.onAuthStateChange(callback);
        return data?.subscription || null;
    }

    async function isAdmin(userId) {
        const client = await getClient();
        if (!client || !userId) return false;
        const { data, error } = await client
            .from('admin_users')
            .select('user_id')
            .eq('user_id', userId)
            .maybeSingle();
        return !error && Boolean(data);
    }

    async function loadAdminData() {
        const client = await getClient();
        if (!client) throw new Error('Supabase não configurado.');

        const [projects, media, blocks, experiences, skills, certificates, socials, kudos] = await Promise.all([
            client.from('projects').select('*').order('sort_order', { ascending: true }),
            client.from('project_media').select('*').order('sort_order', { ascending: true }),
            client.from('content_blocks').select('*').order('key', { ascending: true }),
            client.from('experiences').select('*').order('sort_order', { ascending: true }),
            client.from('skills').select('*').order('sort_order', { ascending: true }),
            client.from('certificates').select('*').order('sort_order', { ascending: true }),
            client.from('social_links').select('*').order('sort_order', { ascending: true }),
            client.from('kudos_summary').select('*').eq('id', 'global').maybeSingle()
        ]);

        const results = { projects, media, blocks, experiences, skills, certificates, socials, kudos };
        Object.keys(results).forEach(key => {
            if (results[key].error) throw results[key].error;
        });

        return {
            projects: safeArray(projects.data).map(project => normalizeProject(project, media.data)),
            media: safeArray(media.data).map(normalizeMedia),
            contentBlocks: safeArray(blocks.data),
            experiences: safeArray(experiences.data).map(normalizeExperience),
            skills: safeArray(skills.data),
            certificates: safeArray(certificates.data).map(normalizeCertificate),
            socialLinks: safeArray(socials.data),
            kudosSummary: kudos.data || { id: 'global', count: 0 }
        };
    }

    async function saveProject(project) {
        const client = await getClient();
        const payload = {
            slug: project.slug,
            type: project.type,
            title: project.title,
            role: project.role,
            meta: project.meta || project.role,
            summary: project.summary,
            context: project.context,
            card_items: safeArray(project.cardItems),
            responsibilities: safeArray(project.responsibilities),
            technical_decisions: safeArray(project.technicalDecisions),
            learnings: safeArray(project.learnings),
            stack: safeArray(project.stack),
            repository_url: project.repositoryUrl || '',
            project_url: project.projectUrl || '',
            project_url_label: project.projectUrlLabel || '',
            published: Boolean(project.published),
            sort_order: Number(project.sortOrder || 0)
        };
        return client.from('projects').upsert(payload, { onConflict: 'slug' }).select().single();
    }

    async function deleteProject(slug) {
        const client = await getClient();
        return client.from('projects').delete().eq('slug', slug);
    }

    async function saveProjectMedia(item) {
        const client = await getClient();
        const payload = {
            id: item.id || undefined,
            project_slug: item.projectSlug,
            storage_path: item.storagePath,
            alt: item.alt,
            caption: item.caption,
            tone: item.tone || 'photo',
            is_cover: Boolean(item.isCover),
            published: item.published !== false,
            sort_order: Number(item.sortOrder || 0)
        };
        return client.from('project_media').upsert(payload).select().single();
    }

    async function uploadMedia(file, projectSlug) {
        const client = await getClient();
        const bucket = getConfig().storageBucket || 'portfolio-media';
        const cleanName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
        const path = `projects/${projectSlug}/${Date.now()}-${cleanName}`;
        const result = await client.storage.from(bucket).upload(path, file, {
            cacheControl: '3600',
            upsert: false
        });
        if (result.error) throw result.error;
        return { storagePath: path, publicUrl: client.storage.from(bucket).getPublicUrl(path).data.publicUrl };
    }

    async function saveContentBlock(key, payload, published) {
        const client = await getClient();
        return client.from('content_blocks').upsert({
            key,
            payload,
            published: published !== false
        }, { onConflict: 'key' }).select().single();
    }

    async function saveExperience(item) {
        const client = await getClient();
        const payload = {
            id: item.id || undefined,
            company: item.company,
            role: item.role || '',
            period: item.period || '',
            badge: item.badge || '',
            highlights: safeArray(item.highlights),
            stack: safeArray(item.stack),
            logo_storage_path: item.logoStoragePath || item.logo_storage_path || '',
            published: item.published !== false,
            sort_order: Number(item.sortOrder || item.sort_order || 0)
        };
        return client.from('experiences').upsert(payload).select().single();
    }

    async function uploadExperienceLogo(file, company) {
        const client = await getClient();
        const bucket = getConfig().storageBucket || 'portfolio-media';
        const cleanCompany = String(company || 'organization').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const cleanName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
        const path = `experiences/${cleanCompany}/${Date.now()}-${cleanName}`;
        const result = await client.storage.from(bucket).upload(path, file, {
            cacheControl: '3600',
            upsert: false
        });
        if (result.error) throw result.error;
        return { storagePath: path, publicUrl: client.storage.from(bucket).getPublicUrl(path).data.publicUrl };
    }

    async function saveSkill(item) {
        const client = await getClient();
        return client.from('skills').upsert(item).select().single();
    }

    async function saveCertificate(item) {
        const client = await getClient();
        const payload = {
            id: item.id || undefined,
            name: item.name,
            issuer: item.issuer,
            issued_at: item.issuedAt || null,
            credential_id: item.credentialId || '',
            credential_url: item.credentialUrl || '',
            description: item.description || '',
            skills: safeArray(item.skills),
            image_storage_path: item.imageStoragePath || '',
            published: item.published !== false,
            sort_order: Number(item.sortOrder || 0)
        };
        return client.from('certificates').upsert(payload).select().single();
    }

    async function uploadCertificateImage(file) {
        const client = await getClient();
        const bucket = getConfig().storageBucket || 'portfolio-media';
        const cleanName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
        const path = `certificates/${Date.now()}-${cleanName}`;
        const result = await client.storage.from(bucket).upload(path, file, {
            cacheControl: '3600',
            upsert: false
        });
        if (result.error) throw result.error;
        return { storagePath: path, publicUrl: client.storage.from(bucket).getPublicUrl(path).data.publicUrl };
    }

    async function saveSocialLink(item) {
        const client = await getClient();
        return client.from('social_links').upsert(item).select().single();
    }

    async function deleteRow(table, id) {
        const client = await getClient();
        return client.from(table).delete().eq('id', id);
    }

    async function recordKudo() {
        const config = getConfig();
        if (!isConfigured() || !config.kudosFunctionUrl) return { ok: false };

        const response = await fetch(config.kudosFunctionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source: 'portfolio' })
        });

        if (!response.ok) return { ok: false };
        return response.json();
    }

    window.Portfolio.cms = {
        isConfigured,
        getClient,
        getFallbackContent,
        loadPublicContent,
        getGithubAuthorizeUrl,
        isLocalAdminHost,
        getAuthCallbackError,
        getSession,
        getUser,
        signInWithGithub,
        signOut,
        getMfaState,
        enrollMfaTotp,
        verifyMfaTotp,
        onAuthStateChange,
        isAdmin,
        loadAdminData,
        saveProject,
        deleteProject,
        saveProjectMedia,
        uploadMedia,
        saveContentBlock,
        saveExperience,
        uploadExperienceLogo,
        saveSkill,
        saveCertificate,
        uploadCertificateImage,
        saveSocialLink,
        deleteRow,
        recordKudo,
        normalizeProject,
        normalizeCertificate
    };
})();
