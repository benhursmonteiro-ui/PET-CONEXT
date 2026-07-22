localStorage.removeItem('conexaopet_state');
/**
 * Conexão Pet - Core SPA Application Engine
 */

// Global State Object
let state = {
    theme: 'light',
    mobileChatActive: false,
    tutor: {
        name: 'Usuário',
        location: '',
        bio: '',
        avatar: 'assets/tutor_avatar.png',
        friendsCount: 0,
        followersCount: 0
    },
    pets: [],
    feed: [],
    reels: [],
    stories: [],
    reports: [],
    activeReelIndex: 0,
    friends: [],
    activeChatFriendId: null,
    forum: [],
    activeForumCategory: 'Todos',
    adoptionPets: [],
    adoptionApplications: [],
    activeAdoptionFilter: 'Todos',
    events: [],
    activeTab: 'feed',
    reelsSearchQuery: ''
};

// Auto-replies mapping for Chat Bot simulation
const BOT_REPLIES = {};

// Database array representing Instagram style profiles of users
const PROFILES = [];

function visitUserProfile(profileId) {
    closeGlobalSearch();
    state.visitedProfile = profileId;
    saveStateToLocalStorage();
    navigateToTab('profile');
}

function visitUserProfileByName(authorName) {
    if (!authorName) return;
    const cleanName = authorName.toLowerCase().trim();
    if (cleanName.includes('rex') || cleanName.includes('mel') || cleanName.includes('carlos')) {
        state.visitedProfile = null; // Meu perfil
    } else if (cleanName.includes('thor')) {
        state.visitedProfile = 'f-1';
    } else if (cleanName.includes('luna')) {
        state.visitedProfile = 'f-2';
    } else if (cleanName.includes('bidu')) {
        state.visitedProfile = 'f-3';
    } else if (cleanName.includes('pipoca')) {
        state.visitedProfile = 'f-4';
    } else if (cleanName.includes('mariana') || cleanName.includes('mari_silva')) {
        state.visitedProfile = 'mariana';
    } else if (cleanName.includes('apapi')) {
        state.visitedProfile = 'ong-apapi';
    } else if (cleanName.includes('patinhas') || cleanName.includes('petshop') || cleanName.includes('pet shop')) {
        state.visitedProfile = 'petshop-patinhas';
    } else {
        // Fallback ou cria perfil temporário dinâmico
        const nameToUse = authorName.replace(/\s*\(.*\)/g, '').trim();
        const idToUse = 'p-' + nameToUse.toLowerCase().replace(/\s+/g, '');
        const profileExists = PROFILES.find(p => p.id === idToUse);
        if (!profileExists) {
            PROFILES.push({
                id: idToUse,
                name: nameToUse,
                username: nameToUse.toLowerCase().replace(/\s+/g, ''),
                avatar: 'assets/dog_avatar.png',
                bio: `Membro ativo da comunidade Conexão Pet. Apaixonado por animais! 🐾`,
                location: 'Brasil',
                followersCount: 120,
                friendsCount: 95,
                isFollowing: false,
                isMe: false,
                type: 'tutor',
                pets: []
            });
        }
        state.visitedProfile = idToUse;
    }
    navigateToTab('profile');
}

function donateToInstitution(ngoName) {
    showToast(`Obrigado pelo carinho com a ${ngoName}! Abrindo opções de ajuda... 💚`, 'success');
    
    const modal = document.createElement('div');
    modal.id = 'help-sim-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.6)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '100000';
    modal.style.backdropFilter = 'blur(4px)';
    modal.style.animation = 'fadeIn 0.2s ease-out';
    
    modal.innerHTML = `
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); width: 400px; padding: 28px; box-shadow: var(--card-shadow); font-family: inherit; color: var(--text-main); position: relative; text-align: center;">
            <div style="text-align: center; margin-bottom: 20px;">
                <span style="font-size: 40px; display:block; margin-bottom: 8px;">💚</span>
                <h3 style="font-size: 18px; font-weight: 800; margin: 0; color: var(--text-main);">Apoiar a ${ngoName}</h3>
                <p style="font-size: 13.5px; color: var(--text-muted); margin: 6px 0 0 0;">Sua contribuição ajuda a salvar vidas de animais abandonados.</p>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; text-align: left;">
                <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 12px;">
                    <div style="font-size: 13px; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">🔑 Chave Pix da ONG</div>
                    <div style="font-size: 14px; font-family: monospace; color: var(--primary); font-weight: 800; display:flex; justify-content:space-between; align-items:center;">
                        <span>pix@apapi.org.br</span>
                        <button onclick="navigator.clipboard.writeText('pix@apapi.org.br'); showToast('Chave Pix copiada!', 'success');" style="background:var(--primary); color:white; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">Copiar</button>
                    </div>
                </div>

                <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 12px;">
                    <div style="font-size: 13px; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">📦 Doar Ração ou Medicamentos</div>
                    <div style="font-size: 12.5px; color: var(--text-muted); line-height:1.4;">
                        Entregue em nossa sede em Piracicaba ou envie uma mensagem no chat da ONG para agendarmos a retirada de doações físicas!
                    </div>
                </div>
            </div>

            <div style="text-align: center;">
                <button onclick="document.getElementById('help-sim-modal').remove();" style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: var(--border-radius-sm); font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit;">Fechar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function toggleFollowProfile(profileId) {
    const profile = PROFILES.find(p => p.id === profileId);
    if (!profile) return;
    
    profile.isFollowing = !profile.isFollowing;
    if (profile.isFollowing) {
        profile.followersCount++;
        showToast(`Você começou a seguir @${profile.username}! 🐾`, 'success');
        const friendExists = state.friends.some(f => f.id === profile.id);
        if (!friendExists) {
            state.friends.push({
                id: profile.id,
                name: profile.name,
                avatar: profile.avatar,
                distance: '1.5km',
                online: true,
                messages: []
            });
        }
    } else {
        profile.followersCount--;
        showToast(`Você deixou de seguir @${profile.username}.`, 'info');
    }
    saveStateToLocalStorage();
    renderCurrentTab('profile');
}

function openChatWithProfile(profileId) {
    const profile = PROFILES.find(p => p.id === profileId);
    if (!profile) return;
    
    const friend = state.friends.find(f => f.id === profile.id);
    if (!friend) {
        state.friends.push({
            id: profile.id,
            name: profile.name,
            avatar: profile.avatar,
            distance: '1.5km',
            online: true,
            messages: []
        });
    }
    
    state.activeChatFriendId = profile.id;
    saveStateToLocalStorage();
    navigateToTab('friends');
}

function goBackToMyProfile() {
    state.visitedProfile = null;
    saveStateToLocalStorage();
    renderCurrentTab('profile');
}

// Initialize State from Server API or LocalStorage fallback
async function initAppState() {
    try {
        const response = await fetch('/api/state');
        state = await response.json();
    } catch (e) {
        console.error('Failed to load state from server, using local fallback.', e);
        const cachedState = localStorage.getItem('conexaopet_state');
        if (cachedState) {
            try {
                state = JSON.parse(cachedState);
            } catch (err) {}
        }
    }
    
    // Ensure Reels and Followed Creators fields exist
    state.activeReelsTab = state.activeReelsTab || 'para-voce';
    state.followedCreators = state.followedCreators || [];
    
    
    
    

    // Set Theme Class
    document.body.classList.toggle('dark-mode', state.theme === 'dark');
    updateThemeUIElements();
    
    // Seed initial message if empty
    state.friends.forEach(f => {
        if (!f.messages || f.messages.length === 0) {
            f.messages = [
                { sender: 'received', text: `Oi! Sou o ${f.name}. Vamos bater um papo de pet? 🐾`, time: 'Ontem' }
            ];
        }
    });

    

    // Garantir postagens suficientes no feed para ver os patrocinadores a cada 5 posts
    if (state.feed && state.feed.length < 6) {
        const extraPosts = [
            {
                id: 'post-mock-3',
                authorName: 'Luna Boxer',
                authorAvatar: 'assets/dog_avatar.png',
                time: 'Há 1 dia',
                text: 'Minha cara quando ouço barulho de sacola de petisco abrindo... Quem mais é assim? 🐶😂 #FomePet #Comilão #BoxerLove',
                image: 'assets/dog_avatar.png',
                likes: 120,
                liked: false,
                comments: []
            },
            {
                id: 'post-mock-4',
                authorName: 'Thor Husky',
                authorAvatar: 'assets/reels_kitten.png',
                time: 'Há 2 dias',
                text: 'Cantando a música do meu povo às 3 da manhã para garantir que todos estão seguros. De nada, humanos! 🐺🎤 #HuskySiberiano #DramaQueen',
                image: 'assets/reels_kitten.png',
                likes: 310,
                liked: true,
                comments: [
                    { author: 'Mel (Persa Fluffy)', text: 'Chato demais! Quero dormir! 😾' }
                ]
            },
            {
                id: 'post-mock-5',
                authorName: 'Pipoca Poodle',
                authorAvatar: 'assets/dog_avatar.png',
                time: 'Há 3 dias',
                text: 'Pronta para o passeio de domingo com meu lacinho novo! Sou a princesa ou não sou? 🎀🐩 #PoodleToy #LookDoDia #PetFofura',
                image: 'assets/feed_dog_park.png',
                likes: 95,
                liked: false,
                comments: []
            },
            {
                id: 'post-mock-6',
                authorName: 'Bidu Schnauzer',
                authorAvatar: 'assets/cat_avatar.png',
                time: 'Há 4 dias',
                text: 'Só de olho nessa conversa de vocês sobre dieta... Onde assino para ter mais sachê? 🐾🍗 #SchnauzerBrasil #PetShop #VidaSaudavel',
                image: 'assets/cat_avatar.png',
                likes: 154,
                liked: false,
                comments: []
            }
        ];
        state.feed = [...state.feed, ...extraPosts];
    }
    
    // Garantir existencia de loggedIn e list de usuarios no state
    if (state.loggedIn === undefined) {
        state.loggedIn = false;
    }
    if (!state.users) {
        state.users = [];
    }
    const defaultAccounts = [
        {
            email: 'carlos@petconect.com',
            password: '123',
            tutor: {
                name: 'Carlos Henrique',
                location: 'Picos, PI',
                bio: 'Apaixonado por bichinhos. Pai do Rex e da Mel. Apoiador ativo de ONGs de adoção local.',
                avatar: 'assets/tutor_avatar.png',
                friendsCount: 124,
                followersCount: 382,
                type: 'tutor'
            },
            pets: JSON.parse(JSON.stringify(state.pets || []))
        },
        {
            email: 'apapi@petconect.com',
            password: '123',
            tutor: {
                id: 'ong-apapi',
                name: 'ONG APAPI',
                username: 'ong_apapi',
                location: 'Piracicaba, SP',
                bio: 'Associação Protetora dos Animais de Piracicaba (APAPI). Resgatamos, tratamos e promovemos a adoção responsável de pets. Junte-se a nós! 💚',
                avatar: 'assets/dog_avatar.png',
                friendsCount: 124,
                followersCount: 15430,
                type: 'institution'
            },
            pets: [
                { name: 'Pipoca', breed: 'Vira-lata (SRD)', avatar: 'assets/reels_kitten.png', age: 1, weight: 8.0, gender: 'Fêmea', species: 'Cachorro', description: 'Super dócil e brincalhona. Pronta para encontrar uma família!' },
                { name: 'Fumaça', breed: 'Vira-lata (SRD)', avatar: 'assets/cat_avatar.png', age: 2, weight: 4.5, gender: 'Macho', species: 'Gato', description: 'Companheiro e preguiçoso. Ama sachê.' }
            ]
        },
        {
            email: 'patinhas@petconect.com',
            password: '123',
            tutor: {
                id: 'petshop-patinhas',
                name: 'Pet Shop Patinhas',
                username: 'patinhas_petshop',
                location: 'Picos, PI',
                bio: 'Tudo o que seu melhor amigo precisa! Banho & Tosa 🧼, rações premium, medicamentos e muito amor. Venha nos visitar!',
                avatar: 'assets/cat_avatar.png',
                friendsCount: 512,
                followersCount: 4210,
                type: 'petshop',
                services: [
                    { name: 'Banho & Tosa Higiênica', price: 'R$ 80,00', icon: '🧼' },
                    { name: 'Consulta Veterinária', price: 'R$ 120,00', icon: '🩺' },
                    { name: 'Aplicação de Vacinas', price: 'R$ 60,00', icon: '💉' }
                ]
            },
            pets: [
                { name: 'Barthô (Mascote)', breed: 'Pug', avatar: 'assets/dog_avatar.png', age: 3, weight: 8.5, gender: 'Macho', species: 'Cachorro' }
            ]
        }
    ];

    defaultAccounts.forEach(defAcc => {
        if (!state.users.some(u => u.email === defAcc.email)) {
            state.users.push(defAcc);
        }
    });
    
    // Atualizar classe do body no bootstrap
    if (!state.loggedIn) {
        document.body.classList.add('logged-out');
    } else {
        document.body.classList.remove('logged-out');
    }
}

function getCurrentLoggedUser() {
    if (!state || !state.loggedIn) return null;
    
    if (state.currentUserEmail) {
        const user = state.users.find(u => u.email === state.currentUserEmail);
        if (user) return user;
    }
    
    if (state.tutor && state.tutor.name) {
        const user = state.users.find(u => u.tutor.name === state.tutor.name);
        if (user) {
            state.currentUserEmail = user.email;
            return user;
        }
    }
    
    return null;
}

function syncCurrentUserWithUsersArray() {
    const user = getCurrentLoggedUser();
    if (user) {
        user.tutor = state.tutor;
        user.pets = state.pets;
    }
}

async function saveStateToLocalStorage() {
    syncCurrentUserWithUsersArray();
    
    // Save to local storage as offline cache
    localStorage.setItem('conexaopet_state', JSON.stringify(state));
    
    // Sync to backend server
    try {
        await fetch('/api/state', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state)
        });
    } catch (e) {
        console.error('Failed to sync state to server', e);
    }
}


// ============================================================
// GLOBAL SEARCH SYSTEM
// ============================================================

function openGlobalSearch() {
    const overlay = document.getElementById('global-search-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus the real input after animation
    setTimeout(() => {
        const field = document.getElementById('global-search-field');
        if (field) field.focus();
    }, 80);
    // Render default quick-access panel
    renderSearchResults('');
}

function closeGlobalSearch() {
    const overlay = document.getElementById('global-search-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Reset input
    const field = document.getElementById('global-search-field');
    if (field) field.value = '';
    const clearBtn = document.getElementById('global-search-clear');
    if (clearBtn) clearBtn.style.display = 'none';
}

function handleSearchOverlayClick(event) {
    // Close if clicked on the backdrop (not the box)
    if (event.target.id === 'global-search-overlay') {
        closeGlobalSearch();
    }
}

function clearGlobalSearch() {
    const field = document.getElementById('global-search-field');
    if (field) { field.value = ''; field.focus(); }
    const clearBtn = document.getElementById('global-search-clear');
    if (clearBtn) clearBtn.style.display = 'none';
    renderSearchResults('');
}

function handleGlobalSearch(value) {
    const clearBtn = document.getElementById('global-search-clear');
    if (clearBtn) clearBtn.style.display = value ? 'flex' : 'none';
    renderSearchResults(value);
}

function handleSearchKeydown(event) {
    if (event.key === 'Escape') closeGlobalSearch();
}

// Highlight query inside text (returns HTML string)
function gsHighlight(text, query) {
    if (!query) return text;
    const safeQ = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(safeQ, 'gi'), match => `<mark class="gs-highlight">${match}</mark>`);
}

function renderSearchResults(query) {
    const body = document.getElementById('global-search-body');
    if (!body) return;

    const q = (query || '').toLowerCase().trim();

    // ---- EMPTY QUERY: show quick access ----
    if (!q) {
        body.innerHTML = `
            <p class="gs-section-header">🚀 Acesso Rápido</p>
            <div class="gs-quick-grid">
                <button class="gs-quick-btn" onclick="gsNavigate('feed')">
                    <span class="gs-quick-icon">🏠</span> Feed Social
                </button>
                <button class="gs-quick-btn" onclick="gsNavigate('reels')">
                    <span class="gs-quick-icon">🎬</span> Reels
                </button>
                <button class="gs-quick-btn" onclick="gsNavigate('adoption')">
                    <span class="gs-quick-icon">🐾</span> Adoção
                </button>
                <button class="gs-quick-btn" onclick="gsNavigate('events')">
                    <span class="gs-quick-icon">📅</span> Eventos
                </button>
                <button class="gs-quick-btn" onclick="gsNavigate('communities')">
                    <span class="gs-quick-icon">💬</span> Comunidades
                </button>
                <button class="gs-quick-btn" onclick="gsNavigate('friends')">
                    <span class="gs-quick-icon">💌</span> Chat
                </button>
                <button class="gs-quick-btn" onclick="gsNavigate('health')">
                    <span class="gs-quick-icon">🩺</span> Saúde
                </button>
                <button class="gs-quick-btn" onclick="gsNavigate('institutions')">
                    <span class="gs-quick-icon">🗺️</span> Mapa
                </button>
                <button class="gs-quick-btn" onclick="gsNavigate('safety')">
                    <span class="gs-quick-icon">🛡️</span> Segurança
                </button>
            </div>
            <div class="gs-footer">
                <span class="gs-footer-hint"><kbd>↵</kbd> selecionar</span>
                <span class="gs-footer-hint"><kbd>Esc</kbd> fechar</span>
                <span class="gs-footer-hint"><kbd>⌘K</kbd> abrir</span>
            </div>`;
        return;
    }

    // ---- SEARCH: collect results ----
    let sections = [];

    // 1. Feed posts
    const feedResults = (state.feed || []).filter(p =>
        p.authorName.toLowerCase().includes(q) ||
        (p.text || '').toLowerCase().includes(q)
    ).slice(0, 4);
    if (feedResults.length) {
        sections.push({
            label: '📰 Feed Social',
            items: feedResults.map(p => ({
                icon: `<img src="${p.authorAvatar}" alt="">`,
                title: gsHighlight(p.authorName, query),
                sub: gsHighlight((p.text || '').substring(0, 60) + '…', query),
                tag: { cls: 'feed', text: 'Post' },
                action: `gsNavigate('feed')`
            }))
        });
    }

    // 2. Reels
    const reelResults = (state.reels || []).filter(r =>
        r.authorName.toLowerCase().includes(q) ||
        (r.desc || '').toLowerCase().includes(q) ||
        (r.music || '').toLowerCase().includes(q)
    ).slice(0, 3);
    if (reelResults.length) {
        sections.push({
            label: '🎬 Reels',
            items: reelResults.map(r => ({
                icon: `<img src="${r.authorAvatar}" alt="">`,
                title: gsHighlight(r.authorName, query),
                sub: gsHighlight((r.desc || '').substring(0, 60) + '…', query),
                tag: { cls: 'reels', text: 'Reel' },
                action: `gsNavigate('reels')`
            }))
        });
    }

    // 3. Adoption pets
    const adoptResults = (state.adoptionPets || []).filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.breed || '').toLowerCase().includes(q) ||
        (p.species || '').toLowerCase().includes(q) ||
        (p.personality || '').toLowerCase().includes(q)
    ).slice(0, 3);
    if (adoptResults.length) {
        sections.push({
            label: '🐾 Adoção',
            items: adoptResults.map(p => ({
                icon: `<img src="${p.image}" alt="">`,
                title: gsHighlight(p.name, query),
                sub: gsHighlight(`${p.breed} · ${p.age} · ${p.ngo}`, query),
                tag: { cls: 'adopt', text: 'Pet' },
                action: `gsNavigate('adoption')`
            }))
        });
    }

    // 4. Events
    const eventResults = (state.events || []).filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.location || '').toLowerCase().includes(q) ||
        (e.desc || '').toLowerCase().includes(q)
    ).slice(0, 3);
    if (eventResults.length) {
        sections.push({
            label: '📅 Eventos',
            items: eventResults.map(e => ({
                icon: '📅',
                title: gsHighlight(e.title, query),
                sub: gsHighlight(`${e.date} · ${e.location}`, query),
                tag: { cls: 'event', text: 'Evento' },
                action: `gsNavigate('events')`
            }))
        });
    }

    // 5. Forum / Communities
    const forumResults = (state.forum || []).filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.body || '').toLowerCase().includes(q)
    ).slice(0, 3);
    if (forumResults.length) {
        sections.push({
            label: '💬 Comunidades',
            items: forumResults.map(t => ({
                icon: '💬',
                title: gsHighlight(t.title, query),
                sub: gsHighlight(`${t.category} · por ${t.author}`, query),
                tag: { cls: 'forum', text: 'Fórum' },
                action: `gsNavigate('communities')`
            }))
        });
    }

    // 6. Friends / Chat
    const friendResults = (state.friends || []).filter(f =>
        f.name.toLowerCase().includes(q)
    ).slice(0, 3);
    if (friendResults.length) {
        sections.push({
            label: '💌 Amigos & Chat',
            items: friendResults.map(f => ({
                icon: `<img src="${f.avatar}" alt="">`,
                title: gsHighlight(f.name, query),
                sub: `${f.online ? '🟢 Online' : '⚪ Offline'} · ${f.distance}`,
                tag: { cls: 'friends', text: 'Chat' },
                action: `gsNavigate('friends')`
            }))
        });
    }

    // 7. Perfis e Usuários
    const profileResults = PROFILES.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q)
    ).slice(0, 4);
    if (profileResults.length) {
        sections.push({
            label: '👤 Perfis e Usuários',
            items: profileResults.map(p => ({
                icon: `<img src="${p.avatar}" alt="" style="border-radius:50%; object-fit:cover;">`,
                title: gsHighlight(p.name, query),
                sub: gsHighlight(`@${p.username} · ${p.location}`, query),
                tag: { 
                    cls: p.type === 'institution' ? 'sos' : (p.type === 'petshop' ? 'friends' : 'profile'), 
                    text: p.type === 'institution' ? 'ONG' : (p.type === 'petshop' ? 'Pet Shop' : 'Tutor') 
                },
                action: `visitUserProfile('${p.id}')`
            }))
        });
    }

    // ---- Render results ----
    if (sections.length === 0) {
        body.innerHTML = `
            <div class="gs-empty">
                <div class="gs-empty-icon">🔍</div>
                <p>Nenhum resultado para <strong>"${query}"</strong><br>
                <span style="font-size:12px;opacity:0.7;">Tente outro termo ou explore as seções acima.</span></p>
            </div>`;
        return;
    }

    const totalCount = sections.reduce((s, sec) => s + sec.items.length, 0);

    let html = `<p style="padding: 6px 20px 10px; font-size: 11.5px; color: var(--text-muted);">${totalCount} resultado${totalCount !== 1 ? 's' : ''} para <strong style="color:var(--text-main)">"${query}"</strong></p>`;

    sections.forEach((sec, idx) => {
        if (idx > 0) html += `<div class="gs-divider"></div>`;
        html += `<p class="gs-section-header">${sec.label}</p>`;
        sec.items.forEach(item => {
            const iconHtml = typeof item.icon === 'string' && item.icon.startsWith('<')
                ? item.icon
                : `<span>${item.icon}</span>`;
            html += `
            <div class="gs-result-item" onclick="${item.action}">
                <div class="gs-result-icon">${iconHtml}</div>
                <div class="gs-result-info">
                    <div class="gs-result-title">${item.title}</div>
                    <div class="gs-result-sub">${item.sub}</div>
                </div>
                <span class="gs-result-tag ${item.tag.cls}">${item.tag.text}</span>
            </div>`;
        });
    });

    html += `
        <div class="gs-footer">
            <span class="gs-footer-hint"><kbd>↵</kbd> abrir</span>
            <span class="gs-footer-hint"><kbd>Esc</kbd> fechar</span>
        </div>`;

    body.innerHTML = html;
}

function gsNavigate(tabId) {
    closeGlobalSearch();
    navigateToTab(tabId);
}

// Keyboard shortcut: Cmd/Ctrl + K
document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const overlay = document.getElementById('global-search-overlay');
        if (overlay && overlay.classList.contains('active')) {
            closeGlobalSearch();
        } else {
            openGlobalSearch();
        }
    }
    if (e.key === 'Escape') {
        const overlay = document.getElementById('global-search-overlay');
        if (overlay && overlay.classList.contains('active')) closeGlobalSearch();
    }
});

// Router Single Page Application (SPA)
function navigateToTab(tabId) {
    if (!state.loggedIn) {
        if (tabId !== 'register' && tabId !== 'login' && tabId !== 'landing') {
            tabId = 'landing';
        }
        document.body.classList.add('logged-out');
    } else {
        document.body.classList.remove('logged-out');
        if (tabId === 'login' || tabId === 'register' || tabId === 'landing') {
            tabId = 'feed';
        }
    }
    
    state.activeTab = tabId;
    if (tabId === 'friends') {
        state.mobileChatActive = false;
    }
    saveStateToLocalStorage();
    
    // Fechar menu lateral deslizante se estiver aberto
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    
    // Toggle active state on buttons
    document.querySelectorAll('.nav-item, .bottom-item').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const viewport = document.getElementById('viewport');
    
    // Out-in animation effect
    viewport.style.opacity = '0';
    viewport.style.transform = 'translateY(8px)';
    
    setTimeout(() => {
        renderCurrentTab(tabId);
        viewport.style.opacity = '1';
        viewport.style.transform = 'translateY(0)';
    }, 150);
}

// Render dynamic templates
function renderCurrentTab(tabId) {
    const viewport = document.getElementById('viewport');
    viewport.innerHTML = '';
    
    if (tabId === 'landing' || tabId === 'register') {
        document.body.classList.add('landing-active');
    } else {
        document.body.classList.remove('landing-active');
    }
    
    if (!state.loggedIn) {
        if (tabId === 'register') {
            renderRegisterView(viewport);
        } else if (tabId === 'login') {
            renderLoginView(viewport);
        } else {
            renderLandingView(viewport);
        }
        return;
    }
    
    switch(tabId) {
        case 'feed':
            renderFeedView(viewport);
            break;
        case 'reels':
            renderReelsView(viewport);
            break;
        case 'friends':
            renderFriendsView(viewport);
            break;
        case 'communities':
            renderCommunitiesView(viewport);
            break;
        case 'adoption':
            renderAdoptionView(viewport);
            break;
        case 'health':
            renderHealthView(viewport);
            break;
        case 'events':
            renderEventsView(viewport);
            break;
        case 'institutions':
            renderInstitutionsView(viewport);
            break;
        case 'safety':
            renderSafetyView(viewport);
            break;
        case 'profile':
            renderProfileView(viewport);
            break;
        default:
            viewport.innerHTML = `<div class="card"><h2>Ops! Página não encontrada.</h2></div>`;
    }
}

// ============================================================
// LANDING PAGE VIEW & HANDLERS
// ============================================================

function scrollToLoginPortal() {
    const portal = document.getElementById('login-portal-section');
    if (portal) {
        portal.scrollIntoView({ behavior: 'smooth' });
    }
}

function switchPortalTab(tab) {
    state.activePortalTab = tab;
    saveStateToLocalStorage();

    // Update tab styles directly instead of re-rendering
    const tabs = document.querySelectorAll('.login-portal-tab');
    tabs.forEach(t => {
        const tabName = t.getAttribute('data-tab');
        if (tabName === tab) {
            t.style.borderBottom = '2px solid #820ad1';
            t.style.color = '#820ad1';
            t.classList.add('active');
        } else {
            t.style.borderBottom = '2px solid transparent';
            t.style.color = '#666666';
            t.classList.remove('active');
        }
    });

    // Show/hide portal content sections
    const tutorContent = document.getElementById('portal-tutor-content');
    const institutionContent = document.getElementById('portal-institution-content');
    const petshopContent = document.getElementById('portal-petshop-content');

    if (tutorContent) tutorContent.style.display = tab === 'tutor' ? 'block' : 'none';
    if (institutionContent) institutionContent.style.display = tab === 'institution' ? 'block' : 'none';
    if (petshopContent) petshopContent.style.display = tab === 'petshop' ? 'block' : 'none';
}


function quickLoginAs(type) {
    let email = 'apapi@petconect.com';
    if (type === 'patinhas') email = 'patinhas@petconect.com';
    
    const user = state.users.find(u => u.email === email);
    if (user) {
        state.loggedIn = true;
        state.currentUserEmail = email;
        state.tutor = user.tutor;
        if (user.pets) {
            state.pets = user.pets;
        }
        saveStateToLocalStorage();
        updateGlobalUIHeaders();
        showToast(`Acesso Rápido realizado! Bem-vindo, ${user.tutor.name}! 🐾`, 'success');
        document.body.classList.remove('logged-out');
        navigateToTab('feed');
    }
}

function handlePortalLoginSubmit(event, role) {
    event.preventDefault();
    let emailId = 'tutor';
    if (role === 'institution') emailId = 'ong';
    else if (role === 'petshop') emailId = 'petshop';
    
    const email = document.getElementById(`portal-${emailId}-email`).value.trim().toLowerCase();
    const password = document.getElementById(`portal-${emailId}-password`).value;
    
    const user = state.users.find(u => u.email === email && u.password === password);
    
    if (user) {
        state.loggedIn = true;
        state.currentUserEmail = email;
        state.tutor = user.tutor;
        if (user.pets) {
            state.pets = user.pets;
        }
        saveStateToLocalStorage();
        updateGlobalUIHeaders();
        showToast(`Bem-vindo ao Conexão Pet, ${user.tutor.name}! 🐾`, 'success');
        document.body.classList.remove('logged-out');
        navigateToTab('feed');
    } else {
        showToast('Email ou senha inválidos para este portal!', 'warning');
    }
}

function renderLandingView(container) {
    if (!state.activePortalTab) {
        state.activePortalTab = 'tutor';
    }
    const activeTab = state.activePortalTab;
    
    container.innerHTML = `
        <div class="nubank-landing" style="font-family: 'Nunito', sans-serif; background: #ffffff; color: #111111; min-height: 100vh; display: flex; flex-direction: column; align-items: center; width: 100%; box-sizing: border-box; overflow-x: hidden;">
            
            <!-- Nubank-styled Top Navbar -->
            <header style="width: 100%; max-width: 1100px; display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; background: #ffffff; border-bottom: 1px solid #f0f0f0; position: sticky; top: 0; z-index: 1000; box-sizing: border-box;">
                <div style="display: flex; align-items: center; gap: 6px; cursor: pointer;" onclick="window.scrollTo({top:0, behavior:'smooth'})">
                    <span style="font-size: 26px; color: #820ad1;">🐾</span>
                    <span style="font-size: 22px; font-weight: 900; color: #820ad1; letter-spacing: -0.5px;">conexão pet</span>
                </div>
                <nav style="display: flex; gap: 24px; font-size: 14.5px; font-weight: 700; align-items: center;">
                    <a href="#about-section" style="color: #666666; text-decoration: none; transition: color 0.2s;">Sobre</a>
                    <a href="#senac-section" style="color: #666666; text-decoration: none; transition: color 0.2s;">Senac Juventudes</a>
                    <a href="#features-section" style="color: #666666; text-decoration: none; transition: color 0.2s;">Recursos</a>
                    <a href="#login-portal-section" style="color: #ffffff; background: #820ad1; text-decoration: none; padding: 10px 22px; border-radius: 30px; font-weight: 800; transition: background 0.2s;">Login</a>
                </nav>
            </header>

            <!-- Hero Section (Nubank style: Text on Left, Card/Visual on Right) -->
            <section id="about-section" style="width: 100%; max-width: 1100px; padding: 80px 24px; display: flex; gap: 40px; align-items: center; justify-content: space-between; box-sizing: border-box; flex-wrap: wrap;">
                
                <!-- Left text column -->
                <div style="flex: 1.2; min-width: 320px; text-align: left;">
                    <h1 style="font-size: 46px; font-weight: 900; margin: 0 0 20px 0; line-height: 1.1; color: #111111; letter-spacing: -1px;">
                        Um mundo pet <br>
                        <span style="color: #820ad1;">sem complicação</span>. <br>
                        Escolha o Conexão Pet.
                    </h1>
                    <p style="font-size: 17.5px; line-height: 1.55; color: #4a4a4a; margin: 0 0 36px 0; max-width: 520px;">
                        A rede social, carteira digital de vacinas e agendamento para o seu melhor amigo, tudo em um só lugar. Seguro, transparente e totalmente gratuito.
                    </p>
                    
                    <!-- Call-To-Action Buttons -->
                    <div style="display: flex; gap: 14px; flex-wrap: wrap;">
                        <button onclick="scrollToLoginPortal()" style="background: #820ad1; color: #ffffff; border: none; padding: 14px 28px; border-radius: 30px; font-size: 14.5px; font-weight: 800; cursor: pointer; transition: background 0.2s; font-family: inherit;">
                            Acessar Plataforma 🚀
                        </button>
                        <button onclick="navigateToTab('register')" style="background: transparent; border: 1.5px solid #820ad1; color: #820ad1; padding: 14px 28px; border-radius: 30px; font-size: 14.5px; font-weight: 800; cursor: pointer; transition: background 0.2s; font-family: inherit;">
                            Quero me Cadastrar
                        </button>
                    </div>
                </div>

                <!-- Right visual column: Official Conexão PET Logo Image -->
                <div style="flex: 0.8; display: flex; justify-content: center; min-width: 300px; padding: 20px; box-sizing: border-box;">
                    <img src="assets/logo.png" alt="Conexão PET Logo" style="width: 100%; max-width: 260px; height: auto; object-fit: contain; filter: drop-shadow(0 8px 16px rgba(130, 10, 209, 0.12));">
                </div>

            </section>

            <!-- Laboratório Juventudes do Senac (Deep Purple Nubank-Styled Banner Section) -->
            <section id="senac-section" style="width: 100%; background: #820ad1; color: #ffffff; padding: 75px 24px; display: flex; justify-content: center; box-sizing: border-box;">
                <div style="width: 100%; max-width: 900px; text-align: left; position: relative;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #ffffff; background: rgba(255, 255, 255, 0.2); padding: 4px 10px; border-radius: 4px; letter-spacing: 0.5px; display: inline-block; margin-bottom: 16px;">
                        Senac Aprendiz • Impacto Social
                    </div>
                    
                    <h2 style="font-size: 28px; font-weight: 900; margin: 0 0 8px 0; color: #ffffff; letter-spacing: -0.5px;">
                        🏫 Sobre o Laboratório Juventudes do Senac
                    </h2>
                    
                    <div style="font-size: 13.5px; font-weight: 700; opacity: 0.9; margin-bottom: 28px; display: flex; gap: 8px; flex-wrap: wrap;">
                        <span>📍 Unidade: Senac - Picos</span>
                        <span>•</span>
                        <span>🎓 Curso: Aprendizagem Profissional de Qualificação em Serviços de Supermercados</span>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 20px; font-size: 15px; line-height: 1.65; opacity: 0.95;">
                        <p style="margin:0;">
                            O <strong>Laboratório Juventudes do Senac</strong> é um programa voltado ao desenvolvimento de jovens por meio da inovação, da tecnologia, do empreendedorismo e da aprendizagem prática. Seu principal objetivo é estimular a criatividade, o pensamento crítico e a capacidade de transformar ideias em soluções que gerem impacto positivo na sociedade.
                        </p>
                        <p style="margin:0;">
                            No laboratório, os participantes trabalham em equipe para desenvolver projetos reais, aplicando metodologias modernas, como o <strong>Design Thinking</strong>, a cultura da inovação e a resolução colaborativa de problemas. Durante essa jornada, os jovens têm a oportunidade de aprimorar competências técnicas e comportamentais, como comunicação, liderança, trabalho em equipe, criatividade e desenvolvimento de soluções digitais.
                        </p>
                        <p style="margin:0;">
                            Mais do que um ambiente de aprendizagem, o Laboratório Juventudes do Senac incentiva os participantes a identificarem desafios do cotidiano e transformá-los em oportunidades de inovação, contribuindo para o desenvolvimento social e profissional.
                        </p>
                        
                        <div style="background: rgba(255, 255, 255, 0.1); border-left: 4px solid #ffffff; padding: 20px; border-radius: 4px; margin-top: 8px;">
                            <strong style="font-size: 16px; display: block; margin-bottom: 6px; color: #ffffff;">🐾 O Nascimento do Conexão Pet</strong>
                            <p style="margin: 0; font-size: 14px; opacity: 0.95;">
                                O <strong>Conexão Pet</strong> nasceu dentro desse contexto, como uma proposta inovadora para conectar pessoas apaixonadas por animais, promover a adoção responsável, aproximar instituições do setor pet da comunidade e oferecer ferramentas que contribuam para o cuidado, a proteção e o bem-estar dos animais. Dessa forma, o projeto representa a aplicação prática dos conhecimentos adquiridos no Laboratório Juventudes, demonstrando como a tecnologia pode ser utilizada para gerar impacto positivo e fortalecer a relação entre pessoas, pets e instituições.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Features Showcase Section (Nubank style: alternating large sections) -->
            <section id="features-section" style="width: 100%; max-width: 1100px; padding: 75px 24px; box-sizing: border-box; display: flex; flex-direction: column; gap: 60px;">
                
                <h2 style="font-size: 26px; font-weight: 900; color: #111111; text-align: center; margin: 0; letter-spacing: -0.5px;">🐾 Recursos que facilitam a sua rotina pet</h2>
                
                <!-- Card 1: Adoção -->
                <div style="display: flex; gap: 40px; align-items: center; justify-content: space-between; flex-wrap: wrap; text-align: left;">
                    <div style="flex: 1; min-width: 280px;">
                        <span style="font-size: 40px; color: #820ad1; display:block; margin-bottom:12px;">❤️</span>
                        <h3 style="font-size: 22px; font-weight: 800; margin: 0 0 10px 0; color: #111111;">Adoção Responsável</h3>
                        <p style="font-size: 14.5px; line-height: 1.6; color: #555555; margin: 0 0 16px 0;">
                            Encontre cães e gatos resgatados de ONGs da sua região, inicie o processo de adoção e emita uma Certidão de Adoção digital oficial com todos os dados do animal.
                        </p>
                        <a onclick="scrollToLoginPortal()" style="color:#820ad1; font-weight: 800; text-decoration: none; cursor:pointer;">Conhecer adoção ➔</a>
                    </div>
                    <div style="flex: 1; min-width: 280px; background: #f5f5f5; border-radius: 12px; padding: 24px; text-align:center; box-sizing:border-box;">
                        <span style="font-size: 64px; display:block;">🐶🐱</span>
                        <span style="font-size: 13.5px; font-weight:800; color:#820ad1; display:block; margin-top:8px;">Milhares de vidas transformadas</span>
                    </div>
                </div>

                <!-- Card 2: Vacinas -->
                <div style="display: flex; gap: 40px; align-items: center; justify-content: space-between; flex-wrap: wrap; text-align: left; flex-direction: row-reverse;">
                    <div style="flex: 1; min-width: 280px;">
                        <span style="font-size: 40px; color: #820ad1; display:block; margin-bottom:12px;">💉</span>
                        <h3 style="font-size: 22px; font-weight: 800; margin: 0 0 10px 0; color: #111111;">Carteira de Vacinação Digital</h3>
                        <p style="font-size: 14.5px; line-height: 1.6; color: #555555; margin: 0 0 16px 0;">
                            Esqueça papéis amassados. Registre vacinas, vermífugos e consultas do seu pet com alertas automáticos para nunca perder uma dose.
                        </p>
                        <a onclick="scrollToLoginPortal()" style="color:#820ad1; font-weight: 800; text-decoration: none; cursor:pointer;">Acessar carteira de vacinas ➔</a>
                    </div>
                    <div style="flex: 1; min-width: 280px; background: #f5f5f5; border-radius: 12px; padding: 24px; text-align:center; box-sizing:border-box;">
                        <span style="font-size: 64px; display:block;">📝📋</span>
                        <span style="font-size: 13.5px; font-weight:800; color:#820ad1; display:block; margin-top:8px;">Controle de saúde simplificado</span>
                    </div>
                </div>

                <!-- Card 3: Social/Reels -->
                <div style="display: flex; gap: 40px; align-items: center; justify-content: space-between; flex-wrap: wrap; text-align: left;">
                    <div style="flex: 1; min-width: 280px;">
                        <span style="font-size: 40px; color: #820ad1; display:block; margin-bottom:12px;">📸</span>
                        <h3 style="font-size: 22px; font-weight: 800; margin: 0 0 10px 0; color: #111111;">A rede social dos pets</h3>
                        <p style="font-size: 14.5px; line-height: 1.6; color: #555555; margin: 0 0 16px 0;">
                            Compartilhe fotos, crie stories diários e divirta-se assistindo reels de bichinhos de estimação em uma rede saudável dedicada aos animais.
                        </p>
                        <a onclick="scrollToLoginPortal()" style="color:#820ad1; font-weight: 800; text-decoration: none; cursor:pointer;">Explorar rede social ➔</a>
                    </div>
                    <div style="flex: 1; min-width: 280px; background: #f5f5f5; border-radius: 12px; padding: 24px; text-align:center; box-sizing:border-box;">
                        <span style="font-size: 64px; display:block;">✨📱</span>
                        <span style="font-size: 13.5px; font-weight:800; color:#820ad1; display:block; margin-top:8px;">Momentos incríveis gravados</span>
                    </div>
                </div>

            </section>


            <!-- Seção Torne-se um Patrocinador Oficial -->
            <section id="official-sponsor-section" style="width: 100%; background: linear-gradient(135deg, #f6f0fc, #ffffff); border-top: 1.5px solid #e1d5f2; border-bottom: 1.5px solid #e1d5f2; padding: 80px 24px; box-sizing: border-box;">
                <div style="max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; align-items: center; text-align: left; font-family: 'Nunito', sans-serif;">
                    <div>
                        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #820ad1; background: rgba(130, 10, 209, 0.08); padding: 6px 12px; border-radius: 4px; letter-spacing: 0.8px; display: inline-block; margin-bottom: 16px;">
                            Parceria Institucional
                        </div>
                        <h2 style="font-size: 30px; font-weight: 900; margin: 0 0 16px 0; color: #111111; letter-spacing: -0.8px; line-height: 1.2;">
                            🤝 Torne-se um Patrocinador Oficial do Conexão Pet
                        </h2>
                        <p style="font-size: 14.5px; color: #555555; line-height: 1.6; margin: 0 0 16px 0;">
                            O <strong>Conexão Pet</strong> oferece uma oportunidade exclusiva para pet shops, clínicas veterinárias, empresas e marcas do segmento pet divulgarem seus produtos e serviços enquanto contribuem para o crescimento da maior comunidade dedicada aos amantes de animais.
                        </p>
                        <p style="font-size: 14.5px; color: #555555; line-height: 1.6; margin: 0 0 20px 0;">
                            Ao se tornar um patrocinador, sua empresa recebe um perfil empresarial com selo de <strong>Patrocinador Oficial</strong>, maior visibilidade dentro da plataforma e acesso a recursos exclusivos para fortalecer sua marca e alcançar novos clientes.
                        </p>
                        <p style="font-size: 13px; color: #777777; line-height: 1.6; margin: 0;">
                            Esse investimento contribui diretamente para a manutenção da plataforma, o desenvolvimento de novas funcionalidades, o fortalecimento das campanhas de adoção responsável e a criação de uma comunidade cada vez mais segura e conectada.
                        </p>
                    </div>
                    
                    <div style="background: #ffffff; border: 1.5px solid #e1d5f2; border-radius: 20px; padding: 30px; box-shadow: 0 12px 36px rgba(130,10,209,0.05); box-sizing: border-box; display: flex; flex-direction: column;">
                        <h3 style="font-size: 17px; font-weight: 800; color: #111111; margin: 0 0 16px 0; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px;">Benefícios do Patrocínio</h3>
                        <ul style="list-style: none; padding: 0; margin: 0 0 20px 0; font-size: 12.5px; color: #444444; display: flex; flex-direction: column; gap: 8px;">
                            <li style="display: flex; gap: 6px; align-items: flex-start;">🏅 <span>Selo de <strong>Patrocinador Oficial</strong> no perfil da empresa.</span></li>
                            <li style="display: flex; gap: 6px; align-items: flex-start;">📢 <span>Destaque nas pesquisas e recomendações da plataforma.</span></li>
                            <li style="display: flex; gap: 6px; align-items: flex-start;">📸 <span>Publicações patrocinadas com maior alcance.</span></li>
                            <li style="display: flex; gap: 6px; align-items: flex-start;">🛍️ <span>Catálogo de produtos e serviços integrado.</span></li>
                            <li style="display: flex; gap: 6px; align-items: flex-start;">🎟️ <span>Divulgação de promoções e cupons exclusivos.</span></li>
                            <li style="display: flex; gap: 6px; align-items: flex-start;">📅 <span>Divulgação de eventos promovidos pela empresa.</span></li>
                            <li style="display: flex; gap: 6px; align-items: flex-start;">📊 <span>Dashboard com estatísticas de visualizações e engajamento.</span></li>
                            <li style="display: flex; gap: 6px; align-items: flex-start;">🤝 <span>Campanhas em parceria com ONGs e eventos oficiais.</span></li>
                        </ul>
                        
                        <div style="background: #fbfafd; border-radius: 12px; padding: 14px; margin-bottom: 16px; border: 1px solid #e1d5f2;">
                            <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #777777; margin-bottom: 4px;">Investimento</div>
                            <div style="font-size: 24px; font-weight: 900; color: #820ad1;">R$ 150,00 <span style="font-size: 13px; font-weight: 400; color: #777777;">/ mês</span></div>
                            <div style="font-size: 11px; color: #999999; margin-top: 4px;">* Sem taxa de adesão, cancelamento a qualquer momento.</div>
                        </div>
                        
                        <button onclick="openSponsorWhatsApp()" style="width: 100%; padding: 12px; border: none; background: #820ad1; color: #ffffff; font-size: 13.5px; font-weight: 800; border-radius: 30px; cursor: pointer; transition: background 0.2s; font-family: inherit; text-align: center; box-shadow: 0 4px 15px rgba(130,10,209,0.15); display: flex; align-items: center; justify-content: center; gap: 8px;">
                            💬 Seja um Patrocinador Oficial (WhatsApp) ➔
                        </button>
                    </div>
                </div>
            </section>

            <!-- Portal de Acesso (Sleek, Clean Purple Screen style) -->
            <section style="width: 100%; background: #f4f0f8; padding: 80px 24px; display: flex; justify-content: center; box-sizing: border-box;">
                
                <div id="login-portal-section" style="background: #ffffff; border-radius: 16px; padding: 36px; max-width: 440px; width: 100%; box-shadow: 0 15px 35px rgba(130, 10, 209, 0.08); text-align: left; box-sizing: border-box;">
                    <h3 style="font-size: 22px; font-weight: 900; text-align: center; margin-top: 0; margin-bottom: 6px; color: #111111; letter-spacing: -0.5px;">🔑 Fazer Login</h3>
                    <p style="font-size: 13.5px; color: #666666; text-align: center; margin-bottom: 24px;">Selecione sua categoria de perfil abaixo</p>
                    
                    <div class="login-portal-tabs" style="display: flex; border-bottom: 1px solid #f0f0f0; margin-bottom: 24px;">
                        <div class="login-portal-tab ${activeTab === 'tutor' ? 'active' : ''}" data-tab="tutor" onclick="switchPortalTab('tutor')" style="flex:1; text-align:center; padding:12px; font-size:13.5px; font-weight:800; cursor:pointer; border-bottom: 2px solid ${activeTab === 'tutor' ? '#820ad1' : 'transparent'}; color: ${activeTab === 'tutor' ? '#820ad1' : '#666666'}; transition: all 0.2s;">
                            👤 Tutor
                        </div>
                        <div class="login-portal-tab ${activeTab === 'institution' ? 'active' : ''}" data-tab="institution" onclick="switchPortalTab('institution')" style="flex:1; text-align:center; padding:12px; font-size:13.5px; font-weight:800; cursor:pointer; border-bottom: 2px solid ${activeTab === 'institution' ? '#820ad1' : 'transparent'}; color: ${activeTab === 'institution' ? '#820ad1' : '#666666'}; transition: all 0.2s;">
                            🏢 ONG
                        </div>
                        <div class="login-portal-tab ${activeTab === 'petshop' ? 'active' : ''}" data-tab="petshop" onclick="switchPortalTab('petshop')" style="flex:1; text-align:center; padding:12px; font-size:13.5px; font-weight:800; cursor:pointer; border-bottom: 2px solid ${activeTab === 'petshop' ? '#820ad1' : 'transparent'}; color: ${activeTab === 'petshop' ? '#820ad1' : '#666666'}; transition: all 0.2s;">
                            🛍️ Pet Shop
                        </div>
                    </div>


                    <!-- Tutor Portal Content -->
                    <div id="portal-tutor-content" style="display: ${activeTab === 'tutor' ? 'block' : 'none'};">
                        <form class="login-form" onsubmit="handlePortalLoginSubmit(event, 'tutor')">
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label style="display:block; font-size:11.5px; font-weight:800; color:#820ad1; text-transform:uppercase; margin-bottom:6px; letter-spacing: 0.5px;">Email do Tutor</label>
                                <input type="email" id="portal-tutor-email" value="" required style="width:100%; box-sizing:border-box; padding:12px 0; background:transparent; border:none; border-bottom:1px solid #d3d3d3; color:#111111; font-size:15px; font-family:inherit; outline:none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#820ad1'" onblur="this.style.borderColor='#d3d3d3'">
                            </div>
                            <div class="form-group" style="margin-bottom: 24px;">
                                <label style="display:block; font-size:11.5px; font-weight:800; color:#820ad1; text-transform:uppercase; margin-bottom:6px; letter-spacing: 0.5px;">Senha</label>
                                <input type="password" id="portal-tutor-password" value="123" required style="width:100%; box-sizing:border-box; padding:12px 0; background:transparent; border:none; border-bottom:1px solid #d3d3d3; color:#111111; font-size:15px; font-family:inherit; outline:none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#820ad1'" onblur="this.style.borderColor='#d3d3d3'">
                            </div>
                            <button type="submit" class="btn-login" style="width:100%; padding:14px; background:#820ad1; color:#ffffff; border:none; border-radius:30px; font-size:14.5px; font-weight:800; cursor:pointer; font-family:inherit; transition: background 0.2s;">Entrar como Tutor</button>
                            
                            <button type="button" class="btn-google" onclick="loginWithGoogle()" style="display: flex; align-items: center; justify-content: center; background: white; color: #3c4043; border: 1px solid #dadce0; border-radius: 30px; padding: 12px 14px; font-size: 14.5px; font-weight: 700; cursor: pointer; transition: background 0.2s; width:100%; margin-top: 10px; box-sizing: border-box; font-family: inherit;">
                                <svg viewBox="0 0 24 24" width="18" height="18" style="margin-right: 8px;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                                Entrar com o Google
                            </button>
                            
                            <button type="button" class="btn-guest" onclick="guestLogin()" style="width:100%; padding:14px; margin-top:10px; background:#f5f5f5; border:none; border-radius:30px; color:#111111; font-size:14.5px; font-weight:800; cursor:pointer; font-family:inherit;">
                                👤 Entrar como Visitante
                            </button>
                        </form>
                    </div>

                    <!-- Institution Portal Content -->
                    <div id="portal-institution-content" style="display: ${activeTab === 'institution' ? 'block' : 'none'};">
                        <form class="login-form" onsubmit="handlePortalLoginSubmit(event, 'institution')">
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label style="display:block; font-size:11.5px; font-weight:800; color:#820ad1; text-transform:uppercase; margin-bottom:6px; letter-spacing: 0.5px;">Email da ONG</label>
                                <input type="email" id="portal-ong-email" value="" required style="width:100%; box-sizing:border-box; padding:12px 0; background:transparent; border:none; border-bottom:1px solid #d3d3d3; color:#111111; font-size:15px; font-family:inherit; outline:none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#820ad1'" onblur="this.style.borderColor='#d3d3d3'">
                            </div>
                            <div class="form-group" style="margin-bottom: 24px;">
                                <label style="display:block; font-size:11.5px; font-weight:800; color:#820ad1; text-transform:uppercase; margin-bottom:6px; letter-spacing: 0.5px;">Senha</label>
                                <input type="password" id="portal-ong-password" value="123" required style="width:100%; box-sizing:border-box; padding:12px 0; background:transparent; border:none; border-bottom:1px solid #d3d3d3; color:#111111; font-size:15px; font-family:inherit; outline:none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#820ad1'" onblur="this.style.borderColor='#d3d3d3'">
                            </div>
                            <button type="submit" class="btn-login" style="width:100%; padding:14px; background:#820ad1; color:#ffffff; border:none; border-radius:30px; font-size:14.5px; font-weight:800; cursor:pointer; font-family:inherit; transition: background 0.2s;">Entrar como ONG</button>
                            
                            <button type="button" class="btn-guest" onclick="quickLoginAs('apapi')" style="width:100%; padding:14px; margin-top:10px; background:#f5f5f5; border: none; color: #111111; font-size: 14.5px; font-weight:800; cursor:pointer; border-radius:30px; font-family:inherit;">
                                🟢 Acesso Rápido APAPI (Simulação)
                            </button>
                        </form>
                    </div>

                    <!-- Pet Shop Portal Content -->
                    <div id="portal-petshop-content" style="display: ${activeTab === 'petshop' ? 'block' : 'none'};">
                        <form class="login-form" onsubmit="handlePortalLoginSubmit(event, 'petshop')">
                            <div class="form-group" style="margin-bottom: 16px;">
                                <label style="display:block; font-size:11.5px; font-weight:800; color:#820ad1; text-transform:uppercase; margin-bottom:6px; letter-spacing: 0.5px;">Email do Pet Shop</label>
                                <input type="email" id="portal-petshop-email" value="" required style="width:100%; box-sizing:border-box; padding:12px 0; background:transparent; border:none; border-bottom:1px solid #d3d3d3; color:#111111; font-size:15px; font-family:inherit; outline:none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#820ad1'" onblur="this.style.borderColor='#d3d3d3'">
                            </div>
                            <div class="form-group" style="margin-bottom: 24px;">
                                <label style="display:block; font-size:11.5px; font-weight:800; color:#820ad1; text-transform:uppercase; margin-bottom:6px; letter-spacing: 0.5px;">Senha</label>
                                <input type="password" id="portal-petshop-password" value="123" required style="width:100%; box-sizing:border-box; padding:12px 0; background:transparent; border:none; border-bottom:1px solid #d3d3d3; color:#111111; font-size:15px; font-family:inherit; outline:none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#820ad1'" onblur="this.style.borderColor='#d3d3d3'">
                            </div>
                            <button type="submit" class="btn-login" style="width:100%; padding:14px; background:#820ad1; color:#ffffff; border:none; border-radius:30px; font-size:14.5px; font-weight:800; cursor:pointer; font-family:inherit; transition: background 0.2s;">Entrar como Pet Shop</button>
                            
                            <button type="button" class="btn-guest" onclick="quickLoginAs('patinhas')" style="width:100%; padding:14px; margin-top:10px; background:#f5f5f5; border: none; color: #111111; font-size: 14.5px; font-weight:800; cursor:pointer; border-radius:30px; font-family:inherit;">
                                🟢 Acesso Rápido Patinhas (Simulação)
                            </button>
                        </form>

                        <!-- Banner Patrocinador Oficial -->
                        <div style="margin-top: 20px; background: linear-gradient(135deg, #2b1055, #1c0733); border-radius: 14px; padding: 20px; color: #ffffff; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(130, 10, 209, 0.3); border-radius: 50%; filter: blur(20px);"></div>
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                                <span style="font-size: 18px;">🏅</span>
                                <span style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; background: linear-gradient(90deg, #d39dfc, #ffffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Patrocinador Oficial</span>
                            </div>
                            <p style="font-size: 12.5px; color: #bca0dc; line-height: 1.5; margin: 0 0 12px 0;">
                                Destaque sua marca com selo exclusivo, banner no feed e exposição prioritária na plataforma.
                            </p>
                            <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 14px;">
                                <span style="font-size: 20px; font-weight: 900;">R$ 150,00</span>
                                <span style="font-size: 11px; color: #bca0dc;">/mês</span>
                            </div>
                            <button type="button" onclick="openSponsorWhatsApp()" style="width: 100%; padding: 10px; border: none; background: linear-gradient(90deg, #820ad1, #a872e6); color: #ffffff; font-size: 13px; font-weight: 800; border-radius: 30px; cursor: pointer; font-family: inherit; box-shadow: 0 4px 15px rgba(130,10,209,0.3); transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                                Quero ser Patrocinador (WhatsApp) 💬
                            </button>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 24px; font-size: 13.5px; color: #666666;">
                        Ainda não tem conta? <a onclick="navigateToTab('register')" style="color:#820ad1; font-weight:800; cursor:pointer; text-decoration:none;">Abra sua conta</a>
                    </div>
                </div>

            </section>

            <!-- Footer (Nubank layout: corporate and minimal) -->
            <footer style="width: 100%; text-align: center; padding: 40px 24px; background: #ffffff; border-top: 1px solid #f0f0f0; color: #666666; font-size: 12.5px; box-sizing: border-box;">
                <p style="margin: 0 0 8px 0; font-weight: 800; color: #820ad1;">conexão pet 🐾</p>
                <p style="margin: 0 0 6px 0; opacity: 0.85;">Senac Aprendiz · Laboratório Juventudes · Projeto de Impacto Social 2026</p>
                <p style="font-size:11px; opacity: 0.6; margin: 0;">Unidade: Senac - Picos • Formação em Serviços de Supermercados</p>
            </footer>
        </div>
    `;
}

// ============================================================
// AUTHENTICATION VIEWS & HANDLERS
// ============================================================

function renderLoginView(container) {
    container.innerHTML = `
        <div class="login-container">
            <div class="login-header">
                <div class="login-logo">🐾</div>
                <h2 class="login-title">Conexão Pet</h2>
                <p class="login-subtitle">A rede social e ecossistema do seu pet</p>
            </div>
            <form class="login-form" onsubmit="handleLoginSubmit(event)">
                <div class="form-group">
                    <label for="login-email">Email</label>
                    <input type="email" id="login-email" placeholder="exemplo@petconect.com" required autocomplete="username">
                </div>
                <div class="form-group">
                    <label for="login-password">Senha</label>
                    <input type="password" id="login-password" placeholder="Digite sua senha" required autocomplete="current-password">
                </div>
                <button type="submit" class="btn-login">Entrar</button>
                
                <button type="button" class="btn-google" onclick="loginWithGoogle()" style="display: flex; align-items: center; justify-content: center; background: white; color: #3c4043; border: 1px solid #dadce0; border-radius: var(--border-radius-sm); padding: 11px 14px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; margin-top: 4px; font-family: inherit;">
                    <svg viewBox="0 0 24 24" width="18" height="18" style="margin-right: 8px;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                    Entrar com o Google
                </button>
                
                <button type="button" class="btn-guest" onclick="guestLogin()">
                    <span>👤</span> Entrar como Visitante
                </button>
            </form>
            <div class="login-footer">
                <span>Não tem uma conta? <a onclick="navigateToTab('register')">Cadastre-se</a></span>
            </div>
        </div>
    `;
}

function loginWithGoogle() {
    if(!window.auth || !window.firebaseGoogleProvider) {
        showToast('Firebase SDK não inicializado ainda.', 'warning');
        return;
    }
    showToast('Iniciando login seguro com Google...', 'info');
    
    window.firebaseSignInWithPopup(window.auth, window.firebaseGoogleProvider)
        .then((result) => {
            const user = result.user;
            showToast(`Bem-vindo, ${user.displayName || 'Tutor'}! 🐾`, 'success');
            
            // Login Completo - Redirecionar
            state.loggedIn = true;
            state.currentUserEmail = user.email;
            state.tutor = {
                name: user.displayName || 'Tutor',
                email: user.email,
                avatar: user.photoURL || 'assets/tutor_avatar.png',
                bio: 'Novo membro do Conexão Pet!'
            };
            saveStateToLocalStorage();
            updateGlobalUIHeaders();
            document.body.classList.remove('logged-out');
            navigateToTab('feed');
        }).catch((error) => {
            showToast('Erro ao logar com Google: ' + error.message, 'warning');
            console.error(error);
        });
}

function selectGoogleAccount(name, email) {
    document.getElementById('google-sim-modal').remove();
    const styleEl = document.getElementById('google-sim-styles');
    if (styleEl) styleEl.remove();

    if (!name) {
        showToast('Direcionando para o cadastro rápido do Google...', 'info');
        navigateToTab('register');
        return;
    }

    state.loggedIn = true;
    state.tutor = {
        name: 'Carlos Henrique',
        location: 'Picos, PI',
        bio: 'Apaixonado por bichinhos. Pai do Rex e da Mel. Apoiador ativo de ONGs de adoção local.',
        avatar: 'assets/tutor_avatar.png',
        friendsCount: 124,
        followersCount: 382
    };
    saveStateToLocalStorage();
    updateGlobalUIHeaders();
    showToast(`Login com Google realizado com sucesso! Bem-vindo, ${name}! 🐾`, 'success');
    document.body.classList.remove('logged-out');
    navigateToTab('feed');
}

function renderRegisterView(container) {
    if (!state.registerType) {
        state.registerType = 'tutor';
    }
    
    let formContent = '';
    
    if (state.registerType === 'tutor') {
        formContent = `
            <form class="login-form" onsubmit="handleRegisterSubmit(event)">
                <div class="form-row-ig">
                    <div class="form-group">
                        <label for="register-name">Nome Completo</label>
                        <input type="text" id="register-name" placeholder="Seu nome" required autocomplete="name">
                    </div>
                    <div class="form-group">
                        <label for="register-phone">Telefone (WhatsApp)</label>
                        <input type="text" id="register-phone" placeholder="(11) 99999-9999" required oninput="maskPhone(this)">
                    </div>
                </div>
                
                <div class="form-row-ig three-cols">
                    <div class="form-group">
                        <label for="register-cpf">CPF (Identificação)</label>
                        <input type="text" id="register-cpf" placeholder="000.000.000-00" required maxlength="14" oninput="maskCPF(this)">
                    </div>
                    <div class="form-group">
                        <label for="register-location">Cidade / Estado</label>
                        <input type="text" id="register-location" placeholder="Cidade, UF" required>
                    </div>
                    <div class="form-group">
                        <label for="register-age">Idade</label>
                        <input type="number" id="register-age" placeholder="Ex: 25" required min="18" max="120">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="register-email">Endereço de Email</label>
                    <input type="email" id="register-email" placeholder="exemplo@petconect.com" required autocomplete="username">
                </div>
                
                <div class="form-row-ig">
                    <div class="form-group" style="position: relative;">
                        <label for="register-password">Senha Forte</label>
                        <input type="password" id="register-password" placeholder="8+ caracteres" required autocomplete="new-password" oninput="checkPasswordStrength(this.value)">
                        <div id="password-strength-container" style="margin-top: 5px; display: flex; gap: 4px; align-items: center;">
                            <div class="strength-bar" style="flex: 1; height: 4px; background: #eee; border-radius: 2px; transition: background-color 0.3s ease;"></div>
                            <div class="strength-bar" style="flex: 1; height: 4px; background: #eee; border-radius: 2px; transition: background-color 0.3s ease;"></div>
                            <div class="strength-bar" style="flex: 1; height: 4px; background: #eee; border-radius: 2px; transition: background-color 0.3s ease;"></div>
                            <span id="strength-text" style="font-size: 11px; color: var(--text-muted); font-weight: 700; margin-left: 6px;">Fraca</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="register-confirm">Confirmar Senha</label>
                        <input type="password" id="register-confirm" placeholder="Confirme sua senha" required autocomplete="new-password">
                    </div>
                </div>

                <div class="form-group-checkbox" style="display: flex; align-items: flex-start; gap: 8px; margin: 16px 0;">
                    <input type="checkbox" id="register-terms" required style="width: auto; margin-top: 4px; cursor: pointer;">
                    <label for="register-terms" style="font-size: 12px; line-height: 1.4; color: var(--text-muted); cursor: pointer;">
                        Eu concordo com os Termos de Uso e a Política de Privacidade do Conexão Pet. Entendo que meus dados de identificação serão protegidos e utilizados apenas para autenticidade na plataforma.
                    </label>
                </div>
                
                <button type="submit" class="btn-login" style="margin-top: 8px;">Criar Conta Segura 🛡️</button>
            </form>
        `;
    } else if (state.registerType === 'petshop') {
        formContent = `
            <form class="login-form" onsubmit="handleRegisterSubmit(event)">
                <div class="form-row-ig">
                    <div class="form-group">
                        <label for="register-name">Nome do Pet Shop</label>
                        <input type="text" id="register-name" placeholder="Ex: Pet Shop Patinhas" required>
                    </div>
                    <div class="form-group">
                        <label for="register-phone">Telefone / WhatsApp Comercial</label>
                        <input type="text" id="register-phone" placeholder="(11) 99999-9999" required oninput="maskPhone(this)">
                    </div>
                </div>
                
                <div class="form-row-ig">
                    <div class="form-group">
                        <label for="register-cpf">CNPJ ou CPF do Proprietário</label>
                        <input type="text" id="register-cpf" placeholder="00.000.000/0001-00" required>
                    </div>
                    <div class="form-group">
                        <label for="register-location">Cidade / Estado</label>
                        <input type="text" id="register-location" placeholder="Cidade, UF" required>
                    </div>
                </div>
                
                <input type="hidden" id="register-age" value="30">
                
                <div class="form-group">
                    <label for="register-email">Email Comercial</label>
                    <input type="email" id="register-email" placeholder="contato@petshop.com" required autocomplete="username">
                </div>
                
                <div class="form-row-ig">
                    <div class="form-group">
                        <label for="register-password">Senha de Acesso</label>
                        <input type="password" id="register-password" placeholder="8+ caracteres" required autocomplete="new-password">
                    </div>
                    <div class="form-group">
                        <label for="register-confirm">Confirmar Senha</label>
                        <input type="password" id="register-confirm" placeholder="Confirme sua senha" required autocomplete="new-password">
                    </div>
                </div>

                <div class="form-group-checkbox" style="display: flex; align-items: flex-start; gap: 8px; margin: 16px 0;">
                    <input type="checkbox" id="register-terms" required style="width: auto; margin-top: 4px; cursor: pointer;">
                    <label for="register-terms" style="font-size: 12px; line-height: 1.4; color: var(--text-muted); cursor: pointer;">
                        Confirmo que as informações prestadas são de cunho comercial legítimo.
                    </label>
                </div>
                
                <button type="submit" class="btn-login" style="margin-top: 8px;">Cadastrar Pet Shop 🛍️</button>
            </form>
        `;
    } else {
        // ONG specialized multi-step form
        formContent = `
            <form class="login-form" onsubmit="handleNgoRegisterSubmit(event)" style="display: flex; flex-direction: column; gap: 16px;">
                
                <!-- Informações da Instituição -->
                <div style="border-bottom: 1.5px solid var(--border-color); padding-bottom: 12px;">
                    <h4 style="margin: 0 0 10px 0; color: var(--primary); font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">1. Informações da Instituição</h4>
                    
                    <div class="form-group" style="margin-bottom:10px;">
                        <label>Nome da ONG / Instituição</label>
                        <input type="text" id="ong-reg-name" required placeholder="Associação de Proteção aos Animais">
                    </div>
                    
                    <div class="form-row-ig" style="margin-bottom:10px;">
                        <div class="form-group">
                            <label>Responsável Legal</label>
                            <input type="text" id="ong-reg-resp" required placeholder="Nome do representante">
                        </div>
                        <div class="form-group">
                            <label>CPF do Responsável</label>
                            <input type="text" id="ong-reg-resp-cpf" required placeholder="000.000.000-00" oninput="maskCPF(this)">
                        </div>
                    </div>
                    
                    <div class="form-row-ig" style="margin-bottom:10px;">
                        <div class="form-group">
                            <label>CNPJ (Recomendado)</label>
                            <input type="text" id="ong-reg-cnpj" placeholder="00.000.000/0001-00">
                        </div>
                        <div class="form-group">
                            <label>E-mail Institucional</label>
                            <input type="email" id="ong-reg-email" required placeholder="contato@ong.org">
                        </div>
                    </div>
                    
                    <div class="form-row-ig" style="margin-bottom:10px;">
                        <div class="form-group">
                            <label>Telefone Fixo</label>
                            <input type="text" id="ong-reg-phone" placeholder="(19) 3456-7890" oninput="maskPhone(this)">
                        </div>
                        <div class="form-group">
                            <label>WhatsApp Comercial</label>
                            <input type="text" id="ong-reg-whatsapp" required placeholder="(19) 99876-5432" oninput="maskPhone(this)">
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom:10px;">
                        <label>Endereço Completo da Sede</label>
                        <input type="text" id="ong-reg-address" required placeholder="Rua dos Animais, 123 - Bairro Centro">
                    </div>
                    
                    <div class="form-row-ig three-cols">
                        <div class="form-group">
                            <label>Cidade / UF</label>
                            <input type="text" id="ong-reg-city" required placeholder="Piracicaba, SP">
                        </div>
                        <div class="form-group">
                            <label>CEP</label>
                            <input type="text" id="ong-reg-cep" required placeholder="13400-000">
                        </div>
                        <div class="form-group">
                            <label>Ano Fundação</label>
                            <input type="number" id="ong-reg-fund" required placeholder="Ex: 2018" min="1900" max="2026">
                        </div>
                    </div>
                    
                    <div class="form-row-ig" style="margin-bottom:10px; margin-top:10px;">
                        <div class="form-group">
                            <label>Senha de Acesso</label>
                            <input type="password" id="ong-reg-password" required placeholder="8+ caracteres" autocomplete="new-password">
                        </div>
                        <div class="form-group">
                            <label>Confirmar Senha</label>
                            <input type="password" id="ong-reg-confirm" required placeholder="Confirme sua senha" autocomplete="new-password">
                        </div>
                    </div>
                </div>

                <!-- Dados da Instituição -->
                <div style="border-bottom: 1.5px solid var(--border-color); padding-bottom: 12px;">
                    <h4 style="margin: 0 0 10px 0; color: var(--primary); font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">2. Capacidade e Operação</h4>
                    
                    <div class="form-row-ig three-cols" style="margin-bottom:10px;">
                        <div class="form-group">
                            <label>Animais Acolhidos</label>
                            <input type="number" id="ong-reg-count" required placeholder="Ex: 85" min="0">
                        </div>
                        <div class="form-group">
                            <label>Capacidade Max</label>
                            <input type="number" id="ong-reg-max" required placeholder="Ex: 120" min="0">
                        </div>
                        <div class="form-group">
                            <label>Horário de Funcionamento</label>
                            <input type="text" id="ong-reg-hours" required placeholder="Ex: Seg a Sáb 8h-18h">
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom:10px;">
                        <label>Espécies Atendidas</label>
                        <input type="text" id="ong-reg-species" required placeholder="Cães, gatos, aves, etc.">
                    </div>
                    
                    <div class="form-group">
                        <label>História, Missão e Objetivos da ONG</label>
                        <textarea id="ong-reg-desc" required placeholder="Conte brevemente a história da instituição, sua missão e principais atividades..." style="width:100%; height:80px; box-sizing:border-box; padding:10px; border:1px solid var(--border-color); border-radius:8px; font-size:13px; background:var(--bg-input); color:var(--text-main); font-family:inherit; resize:none;"></textarea>
                    </div>
                </div>

                <!-- Documentação Comprobatória (Segurança) -->
                <div>
                    <h4 style="margin: 0 0 10px 0; color: var(--primary); font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">3. Protocolo de Segurança Conexão PET</h4>
                    <p style="font-size:12px; color:var(--text-muted); margin:0 0 12px 0; line-height:1.4;">Para receber doações e obter o selo de verificação, anexe cópias legíveis dos documentos abaixo:</p>
                    
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:12px; color:var(--text-main);">
                        <div class="form-group">
                            <label style="font-size:11px;">Identidade do Responsável (RG/CNH)</label>
                            <input type="file" required style="font-size:11px; padding:4px;">
                        </div>
                        <div class="form-group">
                            <label style="font-size:11px;">CPF do Responsável</label>
                            <input type="file" required style="font-size:11px; padding:4px;">
                        </div>
                        <div class="form-group">
                            <label style="font-size:11px;">Comprovante de Sede/Endereço</label>
                            <input type="file" required style="font-size:11px; padding:4px;">
                        </div>
                        <div class="form-group">
                            <label style="font-size:11px;">Estatuto Social da ONG</label>
                            <input type="file" style="font-size:11px; padding:4px;">
                        </div>
                        <div class="form-group">
                            <label style="font-size:11px;">Comprovante Bancário Pix/Doação</label>
                            <input type="file" style="font-size:11px; padding:4px;">
                        </div>
                        <div class="form-group">
                            <label style="font-size:11px;">Fotos do Abrigo / Sede</label>
                            <input type="file" required multiple style="font-size:11px; padding:4px;">
                        </div>
                    </div>
                </div>
                
                <div class="form-group-checkbox" style="display: flex; align-items: flex-start; gap: 8px; margin: 10px 0;">
                    <input type="checkbox" id="ong-reg-terms" required style="width: auto; margin-top: 4px; cursor: pointer;">
                    <label for="ong-reg-terms" style="font-size: 11.5px; line-height: 1.4; color: var(--text-muted); cursor: pointer;">
                        Declaro que todas as informações e documentos anexados são verídicos e representam legalmente a instituição declarada.
                    </label>
                </div>
                
                <button type="submit" class="btn-login" style="background:#2e7d32; border-color:#2e7d32;">Enviar Cadastro da ONG para Verificação 🛡️</button>
            </form>
        `;
    }

    container.innerHTML = `
        <div class="login-container register-secure-container" style="max-width: 580px; width: 95%; margin: 20px auto; padding: 28px 24px;">
            <div class="login-header">
                <div class="login-logo">🛡️</div>
                <h2 class="login-title">Cadastro Seguro Conexão PET</h2>
                <p class="login-subtitle">Junte-se à maior rede de amor e proteção animal do Brasil.</p>
            </div>
            
            <!-- Switcher de Tipo de Cadastro -->
            <div style="display: flex; background: var(--bg-input); padding: 4px; border-radius: var(--border-radius-sm); margin-bottom: 20px; border: 1px solid var(--border-color);">
                <button type="button" onclick="selectRegisterType('tutor')" class="reg-tab" style="flex:1; border:none; padding:8px; border-radius:4px; font-size:12.5px; font-weight:700; cursor:pointer; background:${state.registerType === 'tutor' ? 'var(--bg-card)' : 'transparent'}; color:${state.registerType === 'tutor' ? 'var(--primary)' : 'var(--text-muted)'}; font-family:inherit;">🐾 Tutor</button>
                <button type="button" onclick="selectRegisterType('petshop')" class="reg-tab" style="flex:1; border:none; padding:8px; border-radius:4px; font-size:12.5px; font-weight:700; cursor:pointer; background:${state.registerType === 'petshop' ? 'var(--bg-card)' : 'transparent'}; color:${state.registerType === 'petshop' ? 'var(--primary)' : 'var(--text-muted)'}; font-family:inherit;">🛍️ Pet Shop</button>
                <button type="button" onclick="selectRegisterType('ong')" class="reg-tab" style="flex:1; border:none; padding:8px; border-radius:4px; font-size:12.5px; font-weight:700; cursor:pointer; background:${state.registerType === 'ong' ? 'var(--bg-card)' : 'transparent'}; color:${state.registerType === 'ong' ? 'var(--primary)' : 'var(--text-muted)'}; font-family:inherit;">🏢 ONG / Abrigo</button>
            </div>
            
            ${formContent}
            
            <div class="login-footer" style="margin-top: 10px;">
                <span>Já possui uma conta? <a onclick="navigateToTab('login')">Fazer Login</a></span>
            </div>
        </div>
    `;
}

function maskPhone(input) {
    let v = input.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    input.value = v.substring(0, 15);
}

function maskCPF(input) {
    let v = input.value.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = v.substring(0, 14);
}

function scrollToRegisterFromCPF() {
    const val = document.getElementById('landing-cpf-input').value;
    navigateToTab('register');
    const regCpf = document.getElementById('register-cpf');
    if (regCpf) {
        regCpf.value = val;
    }
}

function scrollToLoginPortal() {
    const el = document.getElementById('login-portal-section');
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

function checkPasswordStrength(password) {
    const bars = document.querySelectorAll('#password-strength-container .strength-bar');
    const text = document.getElementById('strength-text');
    if (!bars.length || !text) return;
    
    bars.forEach(b => b.style.background = '#eee');
    
    if (!password) {
        text.innerText = 'Fraca';
        text.style.color = 'var(--text-muted)';
        return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength === 1) {
        bars[0].style.background = '#ff7675';
        text.innerText = 'Fraca';
        text.style.color = '#ff7675';
    } else if (strength === 2) {
        bars[0].style.background = '#ffeaa7';
        bars[1].style.background = '#ffeaa7';
        text.innerText = 'Média';
        text.style.color = '#e1b12c';
    } else if (strength === 3) {
        bars[0].style.background = '#2ecc71';
        bars[1].style.background = '#2ecc71';
        bars[2].style.background = '#2ecc71';
        text.innerText = 'Forte';
        text.style.color = '#2ecc71';
    }
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    
    if(!window.auth || !window.firebaseSignInWithEmailAndPassword) {
        showToast('Firebase SDK não inicializado.', 'warning');
        return;
    }
    
    window.firebaseSignInWithEmailAndPassword(window.auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            showToast(`Bem-vindo, ${user.email}! 🐾`, 'success');
            
            // Login Completo - Redirecionar
            state.loggedIn = true;
            state.currentUserEmail = user.email;
            state.tutor = {
                name: user.displayName || user.email.split('@')[0],
                email: user.email,
                avatar: user.photoURL || 'assets/tutor_avatar.png',
                bio: 'Novo membro do Conexão Pet!'
            };
            saveStateToLocalStorage();
            updateGlobalUIHeaders();
            document.body.classList.remove('logged-out');
            navigateToTab('feed');
        })
        .catch((error) => {
            showToast('Erro de login: ' + error.message, 'warning');
        });
}

function guestLogin() {
    state.loggedIn = true;
    state.currentUserEmail = 'carlos@petconect.com';
    state.tutor = {
        name: 'Carlos Henrique',
        location: 'Picos, PI',
        bio: 'Apaixonado por bichinhos. Pai do Rex e da Mel. Apoiador ativo de ONGs de adoção local.',
        avatar: 'assets/tutor_avatar.png',
        friendsCount: 124,
        followersCount: 382
    };
    saveStateToLocalStorage();
    updateGlobalUIHeaders();
    showToast('Acesso de visitante liberado! 🎉', 'success');
    document.body.classList.remove('logged-out');
    navigateToTab('feed');
}

function handleRegisterSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    const cpf = document.getElementById('register-cpf').value.trim();
    const location = document.getElementById('register-location').value.trim();
    const age = parseInt(document.getElementById('register-age').value.trim());
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    // Validar Requisitos de Senha Forte
    if (password.length < 8) {
        showToast('A senha precisa ter no mínimo 8 caracteres para ser segura!', 'warning');
        return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        showToast('A senha deve conter letras maiúsculas, minúsculas e números!', 'warning');
        return;
    }
    
    if (password !== confirm) {
        showToast('As senhas não coincidem!', 'warning');
        return;
    }
    
    // Validar CPF / CNPJ length
    if (cpf.length < 11) {
        showToast('Por favor, insira um documento (CPF ou CNPJ) válido completo!', 'warning');
        return;
    }
    
    // Validar Telefone
    if (phone.length < 14) {
        showToast('Por favor, insira um número de telefone válido!', 'warning');
        return;
    }
    
    if (state.users.some(u => u.email === email)) {
        showToast('Este email já está cadastrado!', 'warning');
        return;
    }
    
    const isPetshop = state.registerType === 'petshop';
    
    const newUser = {
        email: email,
        password: password,
        tutor: {
            name: name,
            phone: phone,
            cpf: cpf,
            location: location,
            age: age,
            type: isPetshop ? 'petshop' : 'tutor',
            bio: isPetshop ? 'Tudo o que seu melhor amigo precisa! Banho & Tosa 🧼, rações premium e muito amor.' : 'Tutor cadastrado no Conexão Pet. Pronto para compartilhar momentos fofos! 🐾',
            avatar: isPetshop ? 'assets/cat_avatar.png' : 'assets/tutor_avatar.png',
            friendsCount: 0,
            followersCount: 0,
            activePlan: isPetshop ? 'Bronze' : undefined,
            services: isPetshop ? [
                { name: 'Banho & Tosa Higiênica', price: 'R$ 80,00', icon: '🧼' },
                { name: 'Consulta Veterinária', price: 'R$ 120,00', icon: '🩺' }
            ] : undefined
        },
        pets: []
    };
    
    state.users.push(newUser);
    state.loggedIn = true;
    state.currentUserEmail = email;
    state.tutor = newUser.tutor;
    state.pets = newUser.pets;
    saveStateToLocalStorage();
    updateGlobalUIHeaders();
    showToast(`Conta de ${isPetshop ? 'Pet Shop' : 'Tutor'} criada com sucesso! Bem-vindo, ${name}! 🎉`, 'success');
    document.body.classList.remove('logged-out');
    navigateToTab('feed');
}

function selectRegisterType(type) {
    state.registerType = type;
    saveStateToLocalStorage();
    const container = document.getElementById('viewport');
    if (container) {
        renderRegisterView(container);
    }
}

function handleNgoRegisterSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('ong-reg-name').value.trim();
    const email = document.getElementById('ong-reg-email').value.trim().toLowerCase();
    const password = document.getElementById('ong-reg-password').value;
    const confirm = document.getElementById('ong-reg-confirm').value;
    const location = document.getElementById('ong-reg-city').value.trim();
    const whatsapp = document.getElementById('ong-reg-whatsapp').value.trim();
    const desc = document.getElementById('ong-reg-desc').value.trim();
    
    if (password.length < 8) {
        showToast('A senha precisa ter no mínimo 8 caracteres para ser segura!', 'warning');
        return;
    }
    if (password !== confirm) {
        showToast('As senhas não coincidem!', 'warning');
        return;
    }
    if (state.users.some(u => u.email === email)) {
        showToast('Este email já está cadastrado!', 'warning');
        return;
    }
    
    const newUser = {
        email: email,
        password: password,
        tutor: {
            id: `ong-${Date.now()}`,
            name: name,
            location: location,
            bio: desc || 'Associação de Proteção Animal dedicada a resgate e reabilitação.',
            avatar: 'assets/dog_avatar.png',
            friendsCount: 0,
            followersCount: 0,
            type: 'institution'
        },
        pets: [
            { name: 'Pipoca', breed: 'Vira-lata (SRD)', avatar: 'assets/reels_kitten.png', age: 1, weight: 8.0, gender: 'Fêmea', species: 'Cachorro', description: 'Super dócil e brincalhona. Pronta para encontrar uma família!' }
        ]
    };
    
    state.users.push(newUser);
    saveStateToLocalStorage();
    
    showToast('Fazendo upload de documentos e estatuto social...', 'info');
    
    setTimeout(() => {
        const container = document.querySelector('.register-secure-container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px; font-family: 'Nunito', sans-serif;">
                    <div style="width: 80px; height: 80px; background: #e8f5e9; color: #2e7d32; font-size: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px auto;">🛡️</div>
                    <h3 style="font-size: 22px; font-weight: 900; color: var(--text-main); margin-bottom: 8px;">Cadastro de ONG Enviado!</h3>
                    <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #2e7d32; background: rgba(46, 125, 50, 0.08); padding: 4px 10px; border-radius: 4px; display: inline-block; margin-bottom: 20px;">Protocolo de Segurança Ativo</span>
                    
                    <p style="font-size: 14.5px; color: var(--text-main); line-height: 1.5; text-align: justify; margin-bottom: 24px;">
                        Agradecemos pelo cadastro da instituição <strong>${name}</strong>. Para sua comodidade durante a fase de testes, o <strong>Acesso imediato foi liberado!</strong> O selo "ONG Verificada" já estará visível para você.
                    </p>
                    
                    <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; text-align: left; margin-bottom: 28px; display: flex; flex-direction: column; gap: 12px; font-size: 13.5px; color: var(--text-main);">
                        <div style="display: flex; align-items: center; gap: 10px; color: #2e7d32;">
                            <span>✓</span> <strong>Recebimento da documentação</strong> (Concluído)
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; color: #2e7d32;">
                            <span>✓</span> <strong>Modo de Testes - Liberação Imediata</strong> (Concluído)
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; color: #2e7d32;">
                            <span>✓</span> <strong>Concessão do selo ONG Verificada 🛡️</strong> (Concluído)
                        </div>
                    </div>
                    
                    <button onclick="loginAsNewNGO('${email}')" style="width: 100%; padding: 12px; background: #2e7d32; color: white; border: none; font-size: 14px; font-weight: 800; border-radius: 30px; cursor: pointer; font-family: inherit; box-shadow: 0 4px 10px rgba(46,125,50,0.15);">
                        Acessar Painel da ONG 🐾
                    </button>
                </div>
            `;
        }
        showToast('Cadastro realizado! Acesso liberado para testes da ONG. 🛡️', 'success');
    }, 1500);
}

function loginAsNewNGO(email) {
    const user = state.users.find(u => u.email === email);
    if (user) {
        state.loggedIn = true;
        state.currentUserEmail = email;
        state.tutor = user.tutor;
        state.pets = user.pets || [];
        saveStateToLocalStorage();
        updateGlobalUIHeaders();
        document.body.classList.remove('logged-out');
        navigateToTab('feed');
        showToast(`Logado como ${user.tutor.name}!`, 'success');
    }
}

function handleLogout() {
    state.loggedIn = false;
    state.currentUserEmail = null;
    saveStateToLocalStorage();
    document.body.classList.add('logged-out');
    showToast('Você saiu da sua conta.', 'info');
    navigateToTab('landing');
}

// Global UI Headers
function updateGlobalUIHeaders() {
    // Sidebar Mini Profile
    document.getElementById('sidebar-tutor-name').innerText = state.tutor.name;
    document.getElementById('sidebar-tutor-img').src = state.tutor.avatar;
    
    // Profile Mini Badge count
    const activePetsCount = state.pets ? state.pets.length : 0;
    const miniSub = document.querySelector('.mini-sub');
    if (miniSub) {
        if (state.tutor.type === 'institution') {
            miniSub.innerText = '🛡️ ONG Verificada';
        } else if (state.tutor.type === 'petshop') {
            const plan = state.tutor.activePlan || 'Bronze';
            miniSub.innerText = plan === 'Ultravioleta' ? '💎 Patrocinador Oficial' : '🛍️ Pet Shop Parceiro';
        } else {
            miniSub.innerText = `Tutor de ${activePetsCount} pet${activePetsCount > 1 ? 's' : ''}`;
        }
    }
    
    // Feed header select filling
    const petSelect = document.getElementById('post-pet-select');
    if (petSelect) {
        let optionsHtml = '';
        if (state.tutor.type === 'institution' || state.tutor.type === 'petshop') {
            optionsHtml += `<option value="${state.tutor.name}">${state.tutor.name} (Perfil Comercial)</option>`;
        }
        if (state.pets && state.pets.length > 0) {
            optionsHtml += state.pets.map(p => `<option value="${p.name}">${p.name} (${p.breed})</option>`).join('');
        }
        petSelect.innerHTML = optionsHtml;
        
        // Setup inicial do cabeçalho de perfil no modal do Instagram
        const initialAvatar = (state.tutor.type === 'institution' || state.tutor.type === 'petshop') ? state.tutor.avatar : (state.pets[0] ? state.pets[0].avatar : state.tutor.avatar);
        const initialName = (state.tutor.type === 'institution' || state.tutor.type === 'petshop') ? state.tutor.name : (state.pets[0] ? state.pets[0].name : state.tutor.name);
        
        const profileImg = document.getElementById('post-profile-avatar');
        const profileName = document.getElementById('post-profile-name');
        if (profileImg) profileImg.src = initialAvatar;
        if (profileName) profileName.innerText = initialName;
    }
    
    // Health Select filling
    const healthSelect = document.getElementById('health-pet-select');
    if (healthSelect) {
        if (state.pets && state.pets.length > 0) {
            healthSelect.innerHTML = state.pets.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
        } else {
            healthSelect.innerHTML = '<option value="">Sem pets cadastrados</option>';
        }
    }
}

// Toast Notices Generator
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'secondary') icon = '❤️';
    
    toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Add custom style rule dynamically for Toast slide-out and Story viewer
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes toastOut {
    to { transform: translateX(100px); opacity: 0; }
}

.story-viewer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(18, 18, 18, 0.98);
    z-index: 2000;
    display: none;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(15px);
}

.story-outer-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    width: 100%;
    max-width: 600px;
}

.story-viewer-container {
    width: 100%;
    max-width: 420px;
    height: 92vh;
    max-height: 820px;
    background-color: #000;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 50px rgba(0,0,0,0.8);
    border: 1px solid rgba(255,255,255,0.08);
}

@media (max-width: 768px) {
    .story-outer-wrapper {
        gap: 0;
        max-width: 100%;
    }
    .story-viewer-container {
        max-width: 100%;
        height: 100vh;
        max-height: 100%;
        border-radius: 0;
        border: none;
    }
    .desktop-story-arrow {
        display: none !important;
    }
}

.desktop-story-arrow {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255,255,255,0.1);
    color: white;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    user-select: none;
}

.desktop-story-arrow:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.desktop-story-arrow:active {
    transform: scale(0.95);
}

.story-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 24px 16px 12px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.story-progress-bar-wrap {
    position: absolute;
    top: 10px;
    left: 8px;
    right: 8px;
    display: flex;
    gap: 4px;
}

.story-progress-bar {
    flex: 1;
    height: 2px;
    background-color: rgba(255,255,255,0.35);
    border-radius: 1px;
    overflow: hidden;
}

.story-progress-fill {
    height: 100%;
    width: 0%;
    background-color: #fff;
    transition: width 0.05s linear;
}

.story-author-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
}

.story-author-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1.5px solid #fff;
    object-fit: cover;
}

.story-author-name {
    font-weight: 600;
    font-size: 13.5px;
    text-shadow: 0 1px 3px rgba(0,0,0,0.8);
}

.story-time-ago {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin-left: 6px;
    font-weight: 500;
    text-shadow: 0 1px 3px rgba(0,0,0,0.8);
}

.story-controls {
    display: flex;
    align-items: center;
    gap: 12px;
}

.story-control-btn {
    background: none;
    border: none;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    opacity: 0.85;
    transition: opacity 0.2s, transform 0.2s;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.story-control-btn:hover {
    opacity: 1;
    transform: scale(1.1);
}

.story-image-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #000;
}

.story-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.story-nav-btn {
    position: absolute;
    top: 15%;
    height: 70%;
    width: 30%;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 5;
    outline: none;
    -webkit-tap-highlight-color: transparent;
}

.story-nav-btn.prev {
    left: 0;
}

.story-nav-btn.next {
    right: 0;
}

.story-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 16px 16px 20px;
    background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, transparent 100%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Instagram Quick Reactions Panel */
.story-reactions-row {
    display: flex;
    justify-content: space-between;
    padding: 0 4px;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    height: 0;
    overflow: hidden;
    pointer-events: none;
}

.story-footer-input-row:focus-within ~ .story-reactions-row,
.story-reactions-row.active {
    opacity: 1;
    transform: translateY(0);
    height: auto;
    overflow: visible;
    pointer-events: auto;
    margin-bottom: 4px;
}

.story-reaction-emoji {
    font-size: 22px;
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    background: none;
    border: none;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.story-reaction-emoji:hover {
    transform: scale(1.3) rotate(5deg);
}

.story-footer-input-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.story-reply-input {
    flex: 1;
    background-color: transparent;
    border: 1px solid rgba(255,255,255,0.4);
    border-radius: 24px;
    padding: 10px 18px;
    color: #fff;
    font-size: 13.5px;
    outline: none;
    transition: border-color 0.2s;
}

.story-reply-input:focus {
    border-color: rgba(255,255,255,0.8);
}

.story-reply-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.story-reply-btn:hover {
    transform: scale(1.1) rotate(-10deg);
}

.story-reply-btn svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
}
`;
document.head.appendChild(styleSheet);


/* ==========================================================================
   VIEW RENDERERS: 9 MODULES
   ========================================================================== */

// 1. MODULE: FEED & SOCIAL (Feed Principal, Stories, Hashtags, Tendências)
function renderFeedView(container) {
    let feedHtml = `
    <div class="feed-layout">
        <div class="feed-column">
            
            <!-- Stories Row -->
            <div class="stories-container">
                ${renderStoriesList()}
            </div>

            <!-- Create Post Card Trigger -->
            <div class="card create-post-card">
                <img src="${state.tutor.avatar}" alt="Tutor avatar" class="mini-avatar" style="width: 48px; height: 48px;">
                <div class="create-post-input" id="trigger-create-post" style="cursor: pointer;">
                    O que o seu pet está aprontando hoje? Compartilhe... 📸
                </div>
            </div>

            <!-- Social Feed List -->
            <div class="social-posts-wrapper" id="social-posts-list">
                ${renderFeedPosts()}
            </div>

        </div>

        <!-- Right Widgets Sidebar -->\n        <div class="feed-widgets">\n        </div>\n    </div>\n    `;
    
    container.innerHTML = feedHtml;
    
    // Add Event Listeners
    document.getElementById('trigger-create-post').addEventListener('click', () => {
        openModal('create-post-modal');
    });
}

const SPONSORS = [
    {
        id: 'sponsor-1',
        brandName: 'Royal Canin',
        brandAvatar: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=80&fit=crop&q=80',
        location: 'Patrocinado',
        image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&fit=crop&q=80',
        text: 'Nutrição de alta qualidade formulada especificamente para o tamanho, raça e idade do seu pet. Garanta saúde e vitalidade! 🐕🐈 #RoyalCanin #NutracaoPet #SaudeAnimal',
        likesCount: 1540,
        link: 'https://www.royalcanin.com.br'
    },
    {
        id: 'sponsor-2',
        brandName: 'Petz',
        brandAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&fit=crop&q=80',
        location: 'Patrocinado',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&fit=crop&q=80',
        text: 'Tudo o que seu pet precisa em um só lugar. Aproveite 10% de desconto em todo o site usando o cupom PETCONEXAO! 🐾🛒 #Petz #Promo #MundoPet',
        likesCount: 2890,
        link: 'https://www.petz.com.br'
    }
];

function renderSingleInstagramPost(post) {
    const commentsHtml = post.comments.map(c => `
        <div class="comment-item-ig">
            <strong onclick="visitUserProfileByName('${c.author}')" style="cursor: pointer; color: var(--text-main);">${c.author.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_')}:</strong>
            <span>${c.text}</span>
        </div>
    `).join('');

    const username = post.authorName.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_');

    return `
    <div class="post-card-ig" id="${post.id}">
        <!-- Header -->
        <div class="post-header-ig">
            <div class="post-author-info-ig" onclick="visitUserProfileByName('${post.authorName}')" style="cursor: pointer;">
                <img src="${post.authorAvatar}" alt="${post.authorName}" class="post-avatar-ig">
                <div class="post-meta-ig">
                    <span class="post-username-ig">${username}</span>
                    <span class="post-time-ig">${post.time}</span>
                </div>
            </div>
            <div class="post-options-btn-ig" onclick="showToast('Opções da publicação...', 'info')">•••</div>
        </div>

        <!-- Image (Double click to like) -->
        ${post.image ? `
            <div class="post-image-container-ig" ondblclick="handlePostDoubleClick(event, '${post.id}')">
                <img src="${post.image}" alt="Post Image" class="post-image-ig">
            </div>
        ` : ''}

        <!-- Actions -->
        <div class="post-actions-ig">
            <div class="post-actions-left-ig">
                <!-- Like Button -->
                <button class="post-action-btn-ig like-btn ${post.liked ? 'liked' : ''}" onclick="toggleLikePost('${post.id}')" title="Curtir">
                    <svg viewBox="0 0 24 24" class="post-icon-svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
                <!-- Comment Button -->
                <button class="post-action-btn-ig" onclick="toggleCommentsSection('${post.id}')" title="Comentar">
                    <svg viewBox="0 0 24 24" class="post-icon-svg">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                </button>
                <!-- Share Button -->
                <button class="post-action-btn-ig" onclick="showToast('Link da publicação copiado!', 'success')" title="Compartilhar">
                    <svg viewBox="0 0 24 24" class="post-icon-svg">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                </button>
            </div>
            <!-- Save Button -->
            <button class="post-action-btn-ig save-btn" onclick="toggleSavePost('${post.id}')" title="Salvar nos itens arquivados">
                <svg viewBox="0 0 24 24" class="post-icon-svg">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
            </button>
        </div>

        <!-- Details / Caption area -->
        <div class="post-details-ig">
            <!-- Likes -->
            <div class="post-likes-count-ig">
                ${post.likes} curtidas
            </div>

            <!-- Caption -->
            <div class="post-caption-ig">
                <strong>${username}</strong>${parsePostHashtags(post.text)}
            </div>

            <!-- Comments Preview / Count -->
            ${post.comments.length > 0 ? `
                <div class="post-view-comments-link-ig" onclick="toggleCommentsSection('${post.id}')">
                    Ver todos os ${post.comments.length} comentários
                </div>
                <div class="post-comments-preview-ig" id="comments-list-${post.id}">
                    ${commentsHtml}
                </div>
            ` : `<div class="post-comments-preview-ig" id="comments-list-${post.id}"></div>`}
        </div>

        <!-- Comments Form -->
        <div class="post-comments-box-ig" id="comments-box-${post.id}" style="display: none;">
            <div class="comment-input-wrap-ig">
                <input type="text" placeholder="Escreva um comentário..." class="comment-input-field-ig" id="comment-input-${post.id}" onkeydown="if(event.key==='Enter') submitComment('${post.id}')">
                <button class="comment-submit-btn-ig" onclick="submitComment('${post.id}')">Publicar</button>
            </div>
        </div>
    </div>
    `;
}

function renderSponsorPost(sponsor) {
    return `
    <div class="post-card-ig sponsor-card-ig" id="${sponsor.id}">
        <div class="sponsor-tag-ig">Patrocinado</div>

        <!-- Header -->
        <div class="post-header-ig">
            <div class="post-author-info-ig">
                <img src="${sponsor.brandAvatar}" alt="${sponsor.brandName}" class="post-avatar-ig">
                <div class="post-meta-ig">
                    <span class="post-username-ig sponsor-username-ig">
                        ${sponsor.brandName.toLowerCase()} 
                        <svg viewBox="0 0 24 24" class="verified-icon-svg"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    </span>
                    <span class="post-time-ig sponsor-label-ig">Anúncio</span>
                </div>
            </div>
            <div class="sponsor-external-link-ig" onclick="window.open('${sponsor.link}', '_blank')" title="Ir para o site">🌐</div>
        </div>

        <!-- Image (Full width) -->
        <div class="post-image-container-ig" onclick="window.open('${sponsor.link}', '_blank')">
            <img src="${sponsor.image}" alt="Sponsor Banner" class="post-image-ig">
        </div>

        <!-- Actions -->
        <div class="post-actions-ig">
            <div class="post-actions-left-ig">
                <button class="post-action-btn-ig" onclick="showToast('Obrigado pelo apoio! ❤️', 'success')">
                    <svg viewBox="0 0 24 24" class="post-icon-svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
                <button class="post-action-btn-ig" onclick="window.open('${sponsor.link}', '_blank')">
                    <svg viewBox="0 0 24 24" class="post-icon-svg">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                </button>
                <button class="post-action-btn-ig" onclick="window.open('${sponsor.link}', '_blank')">
                    <svg viewBox="0 0 24 24" class="post-icon-svg">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                </button>
            </div>
            <button class="post-action-btn-ig" onclick="window.open('${sponsor.link}', '_blank')">
                <svg viewBox="0 0 24 24" class="post-icon-svg">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
            </button>
        </div>

        <!-- Details / Text Info -->
        <div class="post-details-ig">
            <div class="post-likes-count-ig">${sponsor.likesCount} curtidas</div>
            <div class="post-caption-ig">
                <strong>${sponsor.brandName.toLowerCase()}</strong> ${parsePostHashtags(sponsor.text)}
            </div>
            <div class="sponsor-cta-btn-wrapper-ig">
                <a href="${sponsor.link}" target="_blank" class="sponsor-cta-btn-ig">Saiba Mais</a>
            </div>
        </div>
    </div>
    `;
}

function renderFeedAlertCard(report) {
    let icon = '🚨';
    if (report.type === 'Animal de Rua') {
        icon = '🐕';
    } else if (report.type === 'Animal Perdido') {
        icon = '🔍';
    } else if (report.type === 'Animal Ferido') {
        icon = '🩹';
    } else if (report.type === 'Maus-tratos') {
        icon = '🚨';
    }

    const formattedDate = report.createdAt ? formatBrazilianDate(report.createdAt) : 'Hoje';

    return `
    <div class="feed-alert-card" id="${report.id}">
        <div class="alert-header-ig">
            <div class="alert-author-info-ig">
                <div class="alert-avatar-ig" style="display: flex; align-items: center; justify-content: center; font-size: 20px;">
                    ${icon}
                </div>
                <div class="alert-meta-ig">
                    <span class="alert-title-main">🚨 ALERTA SOS PET: ${report.type}</span>
                    <span class="alert-time-ig">Publicado em: ${formattedDate}</span>
                </div>
            </div>
            <span class="pulse-alert-badge">
                <span class="pulse-dot" style="width: 8px; height: 8px; background-color: white; border-radius: 50%; display: inline-block;"></span>
                Urgente
            </span>
        </div>
        
        <div class="alert-content-body">
            <div class="alert-info-row" style="margin-bottom: 8px;">
                <span class="alert-info-label">📍 Localização:</span>
                <span class="alert-info-value" style="font-weight: 600;">${report.target}</span>
            </div>
            <div class="alert-info-row" style="margin-bottom: 8px;">
                <span class="alert-info-label">📋 Situação:</span>
                <span class="alert-info-value">${report.details}</span>
            </div>
            <p style="margin-top: 10px; font-size: 12.5px; color: var(--text-muted); font-style: italic;">
                Se você estiver próximo a esta região, por favor, ajude divulgando ou dando abrigo temporário se for seguro. A comunidade Conexão Pet agradece. ❤️
            </p>
        </div>

        <div class="alert-actions-row">
            <button class="alert-action-btn primary" onclick="helpSOSReport('${report.id}', '${report.type}', '${report.target}')">
                🤝 Ajudar / Falar com Tutor
            </button>
            <button class="alert-action-btn secondary" onclick="navigateToTab('safety')">
                🛡️ Ver na Central
            </button>
            <button class="alert-action-btn secondary" onclick="shareSOSReport('${report.id}', '${report.type}', '${report.target}')">
                🔗 Compartilhar Alerta
            </button>
        </div>
    </div>
    `;
}

function helpSOSReport(reportId, type, location) {
    showToast(`Obrigado pelo apoio! Iniciando chat de apoio para o caso em ${location}... 🐾`, 'success');
    setTimeout(() => {
        navigateToTab('friends');
    }, 1200);
}

function shareSOSReport(reportId, type, location) {
    const shareText = `🚨 ALERTA SOS PET: Ocorrência de ${type} em ${location}. Ajude divulgando! Mais informações no app Conexão Pet.`;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('Alerta copiado! Compartilhe nas redes sociais. 🔗', 'success');
        }).catch(() => {
            showToast('Alerta compartilhado com sucesso! 📢', 'success');
        });
    } else {
        showToast('Alerta compartilhado com sucesso! 📢', 'success');
    }
}
function initFirebaseListeners() {
    if(window._fbList || !window.firebaseDb || !window.auth) return;
    window._fbList = true;
    
    // Clear feed so old local storage items don't show up while loading
    state.feed = [];
    
    // Conecta à coleção 'posts' do Firestore, ordenando do mais novo pro mais antigo
    const db = window.firebaseDb;
    const postsRef = window.firebaseCollection(db, 'posts');
    const q = window.firebaseQuery(postsRef, window.firebaseOrderBy('timestamp', 'desc'));
    
    window.firebaseOnSnapshot(q, (snapshot) => {
        let newFeed = [];
        snapshot.forEach(doc => {
            newFeed.push({ id: doc.id, ...doc.data() });
        });
        
        // Substitui o feed na memória pelos dados do Firebase
        state.feed = newFeed;
        
        // Atualiza a tela se estivermos na aba feed
        if (state.currentTab === 'feed') {
            const feedList = document.getElementById('feed-list');
            if (feedList) {
                // Previne recursão infinita usando uma flag simples
                window._renderingFeed = true;
                feedList.innerHTML = renderFeedPosts();
                window._renderingFeed = false;
            }
        }
    }, (error) => {
        console.error("Erro ao puxar feed do Firebase:", error);
        showToast("Erro ao carregar o feed. Verifique as regras do Firebase.", "warning");
    });
}

function renderFeedPosts(filterTag = null) {
    if (!window._renderingFeed) {
        initFirebaseListeners();
    }
    let html = '';
    
    // Inject active SOS reports at the very top of the feed if no hashtag filter is active
    if (!filterTag && state.reports) {
        const activeSos = state.reports.filter(r => 
            ['Animal de Rua', 'Animal Perdido', 'Animal Ferido', 'Maus-tratos'].includes(r.type) && 
            ['Busca Ativa', 'Em Análise'].includes(r.status)
        );
        activeSos.forEach(report => {
            html += renderFeedAlertCard(report);
        });
    }

    let postsToRender = state.feed;
    if (filterTag) {
        postsToRender = state.feed.filter(post => post.text.includes(`#${filterTag}`));
    }
    
    if (postsToRender.length === 0 && html === '') {
        return `<div class="card" style="text-align: center; padding: 40px;"><p style="color: var(--text-muted);">Nenhuma publicação com essa hashtag encontrada.</p><button class="btn btn-primary" onclick="renderCurrentTab('feed')" style="margin-top: 16px;">Limpar Filtro</button></div>`;
    }

    let userPostCount = 0;

    for (let i = 0; i < postsToRender.length; i++) {
        const post = postsToRender[i];
        html += renderSingleInstagramPost(post);
        userPostCount++;

        // Inject sponsor post every 5 user posts
        if (userPostCount % 5 === 0) {
            const sponsorIndex = Math.floor(userPostCount / 5 - 1) % SPONSORS.length;
            const sponsor = SPONSORS[sponsorIndex];
            html += renderSponsorPost(sponsor);
        }
    }

    return html;
}

function parsePostHashtags(text) {
    return text.replace(/#(\w+)/g, '<span class="tag-badge" onclick="filterFeedByTag(\'$1\')">#$1</span>');
}

function filterFeedByTag(tag) {
    const feedList = document.getElementById('social-posts-list');
    if (feedList) {
        feedList.innerHTML = renderFeedPosts(tag);
        showToast(`Filtrado pela hashtag #${tag}`, 'success');
    }
}

function toggleLikePost(postId) {
    const post = state.feed.find(p => p.id === postId);
    if (post) {
        if (post.liked) {
            post.liked = false;
            post.likes--;
        } else {
            post.liked = true;
            post.likes++;
            showToast('Você curtiu a publicação!', 'secondary');
        }
        saveStateToLocalStorage();
        
        const postCard = document.getElementById(postId);
        if (postCard) {
            const likesCount = postCard.querySelector('.post-likes-count-ig');
            if (likesCount) {
                likesCount.innerText = `${post.likes} curtidas`;
            }
            const likeBtn = postCard.querySelector('.like-btn');
            if (likeBtn) {
                likeBtn.classList.toggle('liked', post.liked);
            }
        }
    }
}

function handlePostDoubleClick(event, postId) {
    const post = state.feed.find(p => p.id === postId);
    if (!post) return;
    
    if (!post.liked) {
        post.liked = true;
        post.likes++;
        saveStateToLocalStorage();
        
        // Update UI
        const postCard = document.getElementById(postId);
        if (postCard) {
            const likesCount = postCard.querySelector('.post-likes-count-ig');
            if (likesCount) {
                likesCount.innerText = `${post.likes} curtidas`;
            }
            const likeBtn = postCard.querySelector('.like-btn');
            if (likeBtn) {
                likeBtn.classList.add('liked');
            }
        }
    }
    
    // Heart Pop-up Animation
    const imgContainer = event.currentTarget;
    const rect = imgContainer.getBoundingClientRect();
    const x = event.clientX - rect.left - 30; // offset center
    const y = event.clientY - rect.top - 30;
    
    const popHeart = document.createElement('div');
    popHeart.className = 'double-click-heart-pop';
    popHeart.innerHTML = '❤️';
    popHeart.style.left = `${x}px`;
    popHeart.style.top = `${y}px`;
    imgContainer.appendChild(popHeart);
    
    setTimeout(() => popHeart.remove(), 800);
    showToast('Você curtiu a publicação!', 'secondary');
}

function toggleSavePost(postId) {
    const postCard = document.getElementById(postId);
    if (postCard) {
        const saveBtn = postCard.querySelector('.save-btn');
        if (saveBtn) {
            const isSaved = saveBtn.classList.toggle('saved');
            showToast(isSaved ? 'Salvo nos itens arquivados!' : 'Removido dos itens arquivados!', 'success');
        }
    }
}

function toggleFollowSuggestion(button, username) {
    if (!state.followedCreators) {
        state.followedCreators = [];
    }
    
    if (button.innerText === 'Seguir') {
        button.innerText = 'Seguindo';
        button.classList.add('following');
        if (!state.followedCreators.includes(username)) {
            state.followedCreators.push(username);
        }
        showToast(`Você começou a seguir ${username}! 🐾`, 'success');
    } else {
        button.innerText = 'Seguir';
        button.classList.remove('following');
        state.followedCreators = state.followedCreators.filter(name => name !== username);
        showToast(`Você deixou de seguir ${username}.`, 'info');
    }
    saveStateToLocalStorage();
}

function toggleCommentsSection(postId) {
    const box = document.getElementById(`comments-box-${postId}`);
    if (box) {
        box.style.display = box.style.display === 'none' ? 'flex' : 'none';
    }
}

function submitComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    if (input && input.value.trim() !== '') {
        const post = state.feed.find(p => p.id === postId);
        if (post) {
            post.comments.push({
                author: 'Você',
                text: input.value.trim()
            });
            saveStateToLocalStorage();
            
            // Render comment immediately
            const commentsList = document.getElementById(`comments-list-${postId}`);
            if (commentsList) {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment-item-ig';
                commentDiv.innerHTML = `<strong>você:</strong> <span>${input.value.trim()}</span>`;
                commentsList.appendChild(commentDiv);
                commentsList.scrollTop = commentsList.scrollHeight;
            }
            
            // Update comments link trigger
            const postCard = document.getElementById(postId);
            if (postCard) {
                const commentsLink = postCard.querySelector('.post-view-comments-link-ig');
                if (commentsLink) {
                    commentsLink.innerText = `Ver todos os ${post.comments.length} comentários`;
                } else {
                    const detailsDiv = postCard.querySelector('.post-details-ig');
                    const previewBox = postCard.querySelector('.post-comments-preview-ig');
                    if (detailsDiv && previewBox) {
                        const newLink = document.createElement('div');
                        newLink.className = 'post-view-comments-link-ig';
                        newLink.onclick = () => toggleCommentsSection(postId);
                        newLink.innerText = `Ver todos os 1 comentário`;
                        detailsDiv.insertBefore(newLink, previewBox);
                    }
                }
            }
            
            input.value = '';
            showToast('Comentário publicado!', 'success');
        }
    }
}




// 2. MODULE: REELS & VERTICAL VIDEOS (TikTok Immersive Vertical Snap Feed)
function renderReelsView(container) {
    const query = (state.reelsSearchQuery || '').toLowerCase().trim();
    
    let reelsToFilter = state.reels;
    
    if (state.activeReelsTab === 'seguindo') {
        const followed = state.followedCreators || [];
        reelsToFilter = state.reels.filter(reel => followed.includes(reel.authorName));
    }
    
    // Filter reels by author, description, music or challenge hashtag
    const filteredReels = query
        ? reelsToFilter.filter(reel =>
            reel.authorName.toLowerCase().includes(query) ||
            (reel.desc || '').toLowerCase().includes(query) ||
            (reel.music || '').toLowerCase().includes(query) ||
            (reel.challenge || '').toLowerCase().includes(query)
          )
        : reelsToFilter;

    const noResultsHtml = state.activeReelsTab === 'seguindo' && (!state.followedCreators || state.followedCreators.length === 0)
        ? `<div class="reels-no-results">
               <div class="reels-no-results-icon">👥</div>
               <p>Você ainda não está seguindo ninguém.<br><span style="font-size:12px;opacity:0.7;">Siga criadores no feed "Para Você" para ver seus vídeos aqui!</span></p>
           </div>`
        : `<div class="reels-no-results">
               <div class="reels-no-results-icon">🔍</div>
               <p>Nenhum vídeo encontrado para<br><strong style="color:rgba(255,255,255,0.9)">"${query}"</strong><br><span style="font-size:12px;opacity:0.7;">Tente outro criador ou hashtag.</span></p>
           </div>`;

    // Build the video items HTML
    const videosHtml = filteredReels.length > 0
        ? filteredReels.map((reel, index) => {
            const username = reel.authorName.toLowerCase().replace(/\s+/g, '_');
            const isFollowed = state.followedCreators && state.followedCreators.includes(reel.authorName);
            const followBtnText = isFollowed ? '✓' : '+';
            const followBtnClass = isFollowed ? 'tiktok-follow-badge-btn followed' : 'tiktok-follow-badge-btn';
            
            return `
            <div class="tiktok-item" id="tiktok-item-${reel.id}" data-index="${index}">
                <div class="tiktok-video-wrapper" ondblclick="handleTikTokDoubleClick(event, '${reel.id}')">
                    <img src="${reel.image}" class="tiktok-video-img" alt="Reel video mock">
                    <div class="tiktok-video-overlay-gradient"></div>
                    <div class="tiktok-heart-pop" id="tiktok-pop-${reel.id}"></div>
                </div>
                <div class="tiktok-meta-content">
                    <div class="tiktok-author-name" onclick="visitUserProfileByName('${reel.authorName}')" style="cursor: pointer;">@${username}</div>
                    <p class="tiktok-desc">${reel.desc}</p>
                    <div class="tiktok-music-ticker" onclick="openTikTokAudioModal('${reel.music.replace(/'/g, "\\'")}', '${reel.id}')" style="pointer-events: auto; cursor: pointer;">
                        <span>🎵</span>
                        <div class="tiktok-music-track-wrapper">
                            <span class="tiktok-music-track">${reel.music} - som original</span>
                        </div>
                    </div>
                </div>
                <div class="tiktok-actions-sidebar">
                    <div class="tiktok-creator-avatar-wrap" onclick="visitUserProfileByName('${reel.authorName}')" style="cursor: pointer;">
                        <img src="${reel.authorAvatar}" class="tiktok-creator-avatar" alt="Creator Profile">
                        <button class="${followBtnClass}" onclick="followTikTokCreator(this, '${reel.authorName}')">${followBtnText}</button>
                    </div>
                    <button class="tiktok-action-btn ${reel.liked ? 'liked' : ''}" onclick="toggleLikeTikTok('${reel.id}')">
                        <div class="tiktok-action-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </div>
                        <span id="tiktok-likes-${reel.id}">${reel.likes}</span>
                    </button>
                    <button class="tiktok-action-btn" onclick="showTikTokComments('${reel.id}')">
                        <div class="tiktok-action-icon">
                            <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                        </div>
                        <span id="tiktok-comments-count-${reel.id}">${(reel.comments && reel.comments.length) || 0}</span>
                    </button>
                    <button class="tiktok-action-btn ${reel.saved ? 'saved' : ''}" onclick="toggleSaveTikTok(this, '${reel.id}')">
                        <div class="tiktok-action-icon">
                            <svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                        </div>
                        <span id="tiktok-save-label-${reel.id}">${reel.saved ? 'Salvo' : 'Salvar'}</span>
                    </button>
                    <button class="tiktok-action-btn" onclick="shareTikTokVideo('${reel.id}')">
                        <div class="tiktok-action-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                        </div>
                        <span>Comp.</span>
                    </button>
                </div>
                <div class="tiktok-music-disc" onclick="openTikTokAudioModal('${reel.music.replace(/'/g, "\\'")}', '${reel.id}')" style="cursor: pointer;"></div>
            </div>
            `;
          }).join('')
        : noResultsHtml;

    let reelsHtml = `
    <div class="tiktok-layout">
        
        <!-- TikTok Immersive Video Feed -->
        <div class="tiktok-feed-container">
            <div class="tiktok-feed" id="tiktok-feed-scroll">
                ${videosHtml}
            </div>
            <!-- Indicators on top of TikTok -->
            <div class="tiktok-header-nav">
                <span class="${state.activeReelsTab !== 'seguindo' ? 'active' : ''}" onclick="switchReelsTab('para-voce')">Para Você</span>
                <span class="${state.activeReelsTab === 'seguindo' ? 'active' : ''}" onclick="switchReelsTab('seguindo')">Seguindo</span>
            </div>
        </div>

        <!-- Right Side: Widgets Sidebar (Desktop/Tablet only) -->
        <div class="tiktok-sidebar-widgets">

            <!-- Search Widget -->
            <div class="reels-search-widget">
                <h3 style="font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">Pesquisar Reels</h3>
                <div class="reels-search-input-wrap">
                    <span class="reels-search-icon">🔍</span>
                    <input
                        type="text"
                        id="reels-search-field"
                        class="reels-search-input"
                        placeholder="Criador, #hashtag, música..."
                        value="${state.reelsSearchQuery || ''}"
                        oninput="handleReelsSearch(this.value)"
                        autocomplete="off"
                    >
                </div>
                ${query ? `<p style="font-size:11px; color:var(--text-muted); margin-top:8px; text-align:center;">
                    ${filteredReels.length} vídeo${filteredReels.length !== 1 ? 's' : ''} encontrado${filteredReels.length !== 1 ? 's' : ''}
                    &nbsp;·&nbsp;
                    <button onclick="handleReelsSearch('')" style="color:var(--primary);font-size:11px;font-weight:600;background:none;border:none;cursor:pointer;">Limpar</button>
                </p>` : ''}
            </div>

            <!-- Ranking -->
            <div class="card ranking-widget">
                <h3 style="margin-bottom: 16px; font-size: 15px; display: flex; align-items:center; gap: 8px;">
                    <span>🏆</span> Criadores Destaque
                </h3>
                <div class="ranking-list">
                    <div class="ranking-item" style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                        <span>🥇 <strong>mel_gatinha</strong> (Mel)</span>
                        <strong style="color: var(--primary);">2.4k views</strong>
                    </div>
                    <div class="ranking-item" style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                        <span>🥈 <strong>thor_husky</strong> (Thor)</span>
                        <strong style="color: var(--text-muted);">1.8k views</strong>
                    </div>
                    <div class="ranking-item">
                        <span>🥉 <strong>rex_golden</strong> (Rex)</span>
                        <strong style="color: var(--text-muted);">1.5k views</strong>
                    </div>
                </div>
            </div>

            <!-- Challenge Box -->
            <div class="card" style="padding: 20px;">
                <h3 style="font-size: 14px; margin-bottom: 12px; display:flex; align-items:center; gap: 6px;">
                    <span>⚡</span> Desafios em Alta
                </h3>
                <div class="tiktok-challenge-item" onclick="handleReelsSearch('garrinha')" style="display:flex; justify-content:space-between; align-items:center; background:var(--primary-light); padding:10px; border-radius:10px; cursor:pointer;">
                    <div>
                        <strong style="font-size:12.5px; color:var(--primary);">#DesafioDaGarrinha 🐾</strong>
                        <p style="font-size:10px; color:var(--text-muted); margin-top:2px;">Mostre a patinha do seu pet!</p>
                    </div>
                    <span style="font-size:18px;">🏆</span>
                </div>
                <div class="tiktok-challenge-item" onclick="handleReelsSearch('filhotes')" style="display:flex; justify-content:space-between; align-items:center; background:var(--primary-light); padding:10px; border-radius:10px; cursor:pointer; margin-top:8px;">
                    <div>
                        <strong style="font-size:12.5px; color:var(--primary);">#Filhotes 🐶</strong>
                        <p style="font-size:10px; color:var(--text-muted); margin-top:2px;">Momentos fofos dos filhotinhos!</p>
                    </div>
                    <span style="font-size:18px;">🌟</span>
                </div>
                <div class="tiktok-challenge-item" onclick="handleReelsSearch('golden')" style="display:flex; justify-content:space-between; align-items:center; background:rgba(253,203,110,0.12); padding:10px; border-radius:10px; cursor:pointer; margin-top:8px;">
                    <div>
                        <strong style="font-size:12.5px; color:var(--accent);">#GoldenSmile 😄</strong>
                        <p style="font-size:10px; color:var(--text-muted); margin-top:2px;">Sorrisos que alegram o dia!</p>
                    </div>
                    <span style="font-size:18px;">☀️</span>
                </div>
            </div>

        </div>

    </div>
    `;
    
    container.innerHTML = reelsHtml;
    
    // Re-focus search field and restore cursor at end when user was typing
    if (query) {
        const field = document.getElementById('reels-search-field');
        if (field) {
            field.focus();
            const len = field.value.length;
            field.setSelectionRange(len, len);
        }
    }

    // Auto-scroll to active reel if requested
    if (typeof state.activeReelIndex === 'number' && state.activeReelsTab !== 'seguindo') {
        const activeReel = state.reels[state.activeReelIndex];
        if (activeReel) {
            setTimeout(() => {
                const reelElement = document.getElementById(`tiktok-item-${activeReel.id}`);
                if (reelElement) {
                    reelElement.scrollIntoView({ behavior: 'auto', block: 'start' });
                }
                state.activeReelIndex = null;
                saveStateToLocalStorage();
            }, 100);
        }
    }
}

function followTikTokCreator(button, creatorName) {
    if (!state.followedCreators) {
        state.followedCreators = [];
    }
    
    const isNowFollowing = !state.followedCreators.includes(creatorName);
    
    if (isNowFollowing) {
        state.followedCreators.push(creatorName);
        showToast(`Você começou a seguir ${creatorName}! 🐾`, 'success');
    } else {
        state.followedCreators = state.followedCreators.filter(name => name !== creatorName);
        showToast(`Você deixou de seguir ${creatorName}.`, 'info');
    }
    
    saveStateToLocalStorage();
    
    // Sync all follow buttons for this creator
    const buttons = document.querySelectorAll('.tiktok-follow-badge-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${creatorName}'`)) {
            if (isNowFollowing) {
                btn.innerText = '✓';
                btn.classList.add('followed');
            } else {
                btn.innerText = '+';
                btn.classList.remove('followed');
            }
        }
    });
    
    // If on the 'seguindo' tab, re-render to reflect updates instantly
    if (state.activeReelsTab === 'seguindo') {
        const viewport = document.getElementById('viewport');
        if (viewport) {
            renderReelsView(viewport);
        }
    }
}

// Reels Search Handler: filters videos and re-renders the sidebar
function handleReelsSearch(value) {
    state.reelsSearchQuery = value || '';
    const viewport = document.getElementById('viewport');
    if (viewport) {
        renderReelsView(viewport);
    }
}

function toggleLikeTikTok(reelId) {
    const reel = state.reels.find(r => r.id === reelId);
    if (reel) {
        const heartBtn = document.querySelector(`#tiktok-item-${reelId} .tiktok-action-btn[onclick*="toggleLikeTikTok"]`);
        const countSpan = document.getElementById(`tiktok-likes-${reelId}`);
        if (reel.liked) {
            reel.liked = false;
            reel.likes--;
            if (heartBtn) heartBtn.classList.remove('liked');
        } else {
            reel.liked = true;
            reel.likes++;
            if (heartBtn) heartBtn.classList.add('liked');
            showToast('Você curtiu o Reel! ❤️', 'secondary');
        }
        if (countSpan) countSpan.innerText = reel.likes;
        saveStateToLocalStorage();
    }
}

function toggleSaveTikTok(button, reelId) {
    const reel = state.reels.find(r => r.id === reelId);
    if (reel) {
        reel.saved = !reel.saved;
        saveStateToLocalStorage();
        
        const saveLabel = document.getElementById(`tiktok-save-label-${reelId}`);
        if (reel.saved) {
            button.classList.add('saved');
            if (saveLabel) saveLabel.innerText = 'Salvo';
            showToast('Adicionado aos Favoritos! ⭐️', 'success');
        } else {
            button.classList.remove('saved');
            if (saveLabel) saveLabel.innerText = 'Salvar';
            showToast('Removido dos Favoritos!', 'info');
        }
    }
}

let currentCommentReelId = null;

function showTikTokComments(reelId) {
    const reel = state.reels.find(r => r.id === reelId);
    if (!reel) return;
    
    currentCommentReelId = reelId;
    
    // Fill comment title
    const count = (reel.comments && reel.comments.length) || 0;
    document.getElementById('tiktok-comments-title').innerText = `Comentários (${count})`;
    
    // Fill comments body
    const body = document.getElementById('tiktok-comments-list');
    body.innerHTML = '';
    
    if (reel.comments && reel.comments.length > 0) {
        reel.comments.forEach(c => {
            let avatar = 'assets/tutor_avatar.png';
            if (c.author.includes('Mel')) avatar = 'assets/cat_avatar.png';
            else if (c.author.includes('Rex')) avatar = 'assets/dog_avatar.png';
            else if (c.author.includes('Thor') || c.author.includes('Pipoca')) avatar = 'assets/reels_kitten.png';
            else if (c.author.includes('Luna') || c.author.includes('Bidu')) avatar = 'assets/dog_avatar.png';
            
            const commentDiv = document.createElement('div');
            commentDiv.className = 'tiktok-comment-item';
            commentDiv.innerHTML = `
                <img src="${avatar}" class="tiktok-comment-avatar" alt="Commenter Profile" onclick="visitUserProfileByName('${c.author}'); closeTikTokComments(null);" style="cursor: pointer;">
                <div class="tiktok-comment-info">
                    <div class="tiktok-comment-author" onclick="visitUserProfileByName('${c.author}'); closeTikTokComments(null);" style="cursor: pointer;">${c.author}</div>
                    <div class="tiktok-comment-text">${c.text}</div>
                    <div class="tiktok-comment-time">Agora mesmo</div>
                </div>
            `;
            body.appendChild(commentDiv);
        });
    } else {
        body.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top:20px; font-size:13px;">Seja o primeiro a comentar! 🐾</p>';
    }
    
    // Open drawer overlay
    const drawer = document.getElementById('tiktok-comments-drawer');
    drawer.classList.add('active');
}

function closeTikTokComments(event) {
    const drawer = document.getElementById('tiktok-comments-drawer');
    if (!event || event.target === drawer) {
        drawer.classList.remove('active');
        currentCommentReelId = null;
    }
}

function submitTikTokComment(event) {
    if (event) event.preventDefault();
    const field = document.getElementById('tiktok-comment-field');
    const text = field.value.trim();
    if (!text || !currentCommentReelId) return;
    
    const reel = state.reels.find(r => r.id === currentCommentReelId);
    if (reel) {
        if (!reel.comments) reel.comments = [];
        
        reel.comments.push({
            author: state.tutor.name,
            text: text
        });
        
        saveStateToLocalStorage();
        
        // Clear field
        field.value = '';
        
        // Refresh comments list
        showTikTokComments(currentCommentReelId);
        
        // Update comments count on feed item
        const countSpan = document.getElementById(`tiktok-comments-count-${currentCommentReelId}`);
        if (countSpan) countSpan.innerText = reel.comments.length;
        
        showToast('Comentário publicado! 💬🐾', 'success');
    }
}

let currentShareReelId = null;

function shareTikTokVideo(reelId) {
    const reel = state.reels.find(r => r.id === reelId);
    if (!reel) return;
    
    currentShareReelId = reelId;
    
    // Load friends horizontal row
    const container = document.getElementById('tiktok-share-friends-list');
    container.innerHTML = '';
    
    if (state.friends && state.friends.length > 0) {
        state.friends.forEach(f => {
            const item = document.createElement('div');
            item.className = 'tiktok-share-friend-item';
            item.setAttribute('onclick', `shareVideoToFriend('${f.id}')`);
            item.innerHTML = `
                <div class="tiktok-share-friend-avatar-wrap">
                    <img src="${f.avatar}" class="tiktok-share-friend-avatar" alt="Friend Profile">
                    ${f.online ? '<div class="tiktok-share-friend-online"></div>' : ''}
                </div>
                <div class="tiktok-share-friend-name">${f.name.split(' ')[0]}</div>
            `;
            container.appendChild(item);
        });
    } else {
        container.innerHTML = '<p style="font-size:12px; color:var(--text-muted); padding:10px;">Nenhum amigo online.</p>';
    }
    
    // Open modal
    openModal('tiktok-share-modal');
}

function shareVideoToFriend(friendId) {
    const friend = state.friends.find(f => f.id === friendId);
    const reel = state.reels.find(r => r.id === currentShareReelId);
    if (friend && reel) {
        if (!friend.messages) friend.messages = [];
        
        const username = reel.authorName.toLowerCase().replace(/\s+/g, '_');
        const videoLink = `http://localhost:3000/reels?id=${reel.id}`;
        
        friend.messages.push({
            sender: 'sent',
            text: `Assista a este Reel de @${username} no Conexão Pet: "${reel.desc}" 🎬🐾\nLink: ${videoLink}`,
            time: 'Agora'
        });
        
        saveStateToLocalStorage();
        
        closeModal(document.getElementById('tiktok-share-modal'));
        showToast(`Vídeo enviado para ${friend.name.split(' ')[0]}! ✉️🐾`, 'success');
        
        const activeRecip = document.querySelector('.chat-recipient-card.active');
        if (activeRecip && activeRecip.getAttribute('onclick') && activeRecip.getAttribute('onclick').includes(friendId)) {
            const container = document.getElementById('viewport');
            if (container && document.querySelector('.chat-layout')) {
                renderFriendsView(container);
            }
        }
    }
}

function copyTikTokVideoLink() {
    if (!currentShareReelId) return;
    const videoLink = `http://localhost:3000/reels?id=${currentShareReelId}`;
    navigator.clipboard.writeText(videoLink).then(() => {
        closeModal(document.getElementById('tiktok-share-modal'));
        showToast('Link do vídeo copiado! 🔗', 'success');
    }).catch(err => {
        showToast('Erro ao copiar link.', 'danger');
    });
}

function shareToWhatsAppMock() {
    closeModal(document.getElementById('tiktok-share-modal'));
    showToast('Compartilhando no WhatsApp (Redirecionando)... 💬🐾', 'success');
}

function repostTikTokVideoMock() {
    closeModal(document.getElementById('tiktok-share-modal'));
    showToast('Reel repostado no seu perfil com sucesso! 🔄🐾', 'success');
}

function saveTikTokVideoToFilesMock() {
    closeModal(document.getElementById('tiktok-share-modal'));
    showToast('Vídeo salvo na sua galeria! 📥💾', 'success');
}

let isAudioPlaying = false;

function openTikTokAudioModal(musicName, reelId) {
    const reel = state.reels.find(r => r.id === reelId);
    if (!reel) return;
    
    document.getElementById('tiktok-audio-title').innerText = `${reel.music} - som original`;
    document.getElementById('tiktok-audio-creator').innerText = reel.authorName;
    
    const videoCount = (reel.id === 'reel-1') ? '🎬 24.5k vídeos' : '🎬 8.1k vídeos';
    document.getElementById('tiktok-audio-video-count').innerText = videoCount;
    
    const grid = document.getElementById('tiktok-audio-videos-grid');
    grid.innerHTML = '';
    
    const thumbnails = [
        { img: 'assets/cat_avatar.png', views: '1.2M' },
        { img: 'assets/dog_avatar.png', views: '840K' },
        { img: 'assets/reels_kitten.png', views: '512K' },
        { img: 'assets/feed_dog_park.png', views: '200K' },
        { img: 'assets/tutor_avatar.png', views: '95K' },
        { img: 'assets/dog_avatar.png', views: '43K' }
    ];
    
    thumbnails.forEach(thumb => {
        const card = document.createElement('div');
        card.className = 'tiktok-audio-video-card';
        card.innerHTML = `
            <img src="${thumb.img}" alt="Sound video snap">
            <div class="tiktok-audio-video-views">
                <span>▶</span> ${thumb.views}
            </div>
        `;
        card.onclick = () => showToast(`Este vídeo obteve ${thumb.views} visualizações com este áudio! 🎵`, 'info');
        grid.appendChild(card);
    });
    
    isAudioPlaying = false;
    const vinyl = document.getElementById('tiktok-audio-modal-vinyl');
    const playIcon = document.getElementById('tiktok-audio-modal-play-icon');
    if (vinyl) vinyl.classList.remove('spinning');
    if (playIcon) playIcon.innerText = '▶️';
    
    openModal('tiktok-audio-modal');
}

function toggleAudioVinylPlay() {
    isAudioPlaying = !isAudioPlaying;
    const vinyl = document.getElementById('tiktok-audio-modal-vinyl');
    const playIcon = document.getElementById('tiktok-audio-modal-play-icon');
    
    if (isAudioPlaying) {
        if (vinyl) vinyl.classList.add('spinning');
        if (playIcon) playIcon.innerText = '⏸️';
        showToast('Tocando prévia da faixa de áudio... 🎵🔊', 'success');
    } else {
        if (vinyl) vinyl.classList.remove('spinning');
        if (playIcon) playIcon.innerText = '▶️';
        showToast('Áudio pausado.', 'info');
    }
}

function useSoundMock() {
    closeModal(document.getElementById('tiktok-audio-modal'));
    showToast('Câmera aberta! Crie seu vídeo usando este áudio. 📸🎵', 'success');
}

function handleTikTokDoubleClick(e, reelId) {
    const reel = state.reels.find(r => r.id === reelId);
    if (!reel) return;
    
    if (!reel.liked) {
        reel.liked = true;
        reel.likes++;
        saveStateToLocalStorage();
        
        const heartBtn = document.querySelector(`#tiktok-item-${reelId} .tiktok-action-btn[onclick*="toggleLikeTikTok"]`);
        const countSpan = document.getElementById(`tiktok-likes-${reelId}`);
        if (heartBtn) heartBtn.classList.add('liked');
        if (countSpan) countSpan.innerText = reel.likes;
        showToast('Você curtiu o vídeo! ❤️', 'secondary');
    }
    
    const wrapper = e.currentTarget;
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - 36;
    const y = e.clientY - rect.top - 36;
    
    const heart = document.createElement('div');
    heart.className = 'tiktok-pop-heart';
    heart.innerHTML = '❤️';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    wrapper.appendChild(heart);
    
    setTimeout(() => heart.remove(), 800);
}


// 3. MODULE: AMIGOS PETS & CHAT (Localização, Encontros, Conversas)
function renderFriendsView(container) {
    const activeFriend = state.friends.find(f => f.id === state.activeChatFriendId) || state.friends[0];
    
    let chatHtml = `
    <div class="chat-layout ${state.mobileChatActive ? 'mobile-chat-active' : ''}">
        
        <!-- Left Side Friends Panel (WhatsApp Contacts Style) -->
        <div class="friends-list-container">
            <div class="friends-list-header-ig" style="background-color: var(--wa-inbox-header-bg); padding: 16px 20px;">
                <h3 style="font-size: 18px; font-weight: 800; color: var(--text-main);">Conversas</h3>
                <span class="new-chat-btn-ig" onclick="openNewChatModal()" title="Nova conversa" style="cursor: pointer;">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </span>
            </div>
            
            <!-- WhatsApp Search Contact Bar -->
            <div class="wa-search-bar-wrap" style="padding: 8px 16px; background-color: var(--wa-inbox-header-bg); border-bottom: 1px solid var(--border-color);">
                <div style="background-color: var(--bg-app); border-radius: 8px; display: flex; align-items: center; padding: 6px 12px; gap: 8px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" id="chat-search-input" placeholder="Pesquisar ou começar uma nova conversa" style="border:none; background:transparent; font-size:12px; outline:none; width:100%; color:var(--text-main);">
                </div>
            </div>
            
            <div class="friends-list-scroll-ig">
                ${state.friends.filter(friend => friend.id !== ((state.tutor && state.tutor.id) || 'carlos') && friend.name !== (state.tutor && state.tutor.name)).map(friend => {
                    const lastMsg = friend.messages && friend.messages.length > 0 ? friend.messages[friend.messages.length - 1] : { text: 'Iniciar conversa', time: '08:30' };
                    // If message contains html (like image or audio play icon), extract readable text or show placeholder
                    let previewText = lastMsg.text;
                    if (previewText.includes('<img')) previewText = '📷 Foto';
                    else if (previewText.includes('audio-progress')) previewText = '🎵 Mensagem de voz';
                    
                    return `
                    <div class="chat-recipient-card ${friend.id === activeFriend.id ? 'active' : ''}" onclick="selectChatFriend('${friend.id}')" style="border-bottom: 1px solid var(--border-color); border-radius: 0; padding: 14px 16px;">
                        <div class="recipient-img-container">
                            <img src="${friend.avatar}" class="mini-avatar" style="width: 46px; height: 46px; border-radius: 50%; object-fit: cover;" alt="Friend avatar">
                            ${friend.online ? '<div class="recipient-status"></div>' : ''}
                        </div>
                        <div style="flex:1; overflow:hidden; margin-left: 10px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 4px;">
                                <strong style="font-size: 14px; color: var(--text-main); font-weight: 700;">${friend.name.split(' ')[0]}</strong>
                                <span style="font-size: 10px; color: var(--text-muted);">${lastMsg.time || 'Ontem'}</span>
                            </div>
                            <p style="font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow:hidden; text-overflow:ellipsis; margin: 0;">
                                ${lastMsg.sender === 'sent' ? '<span style="color:#53bdeb; margin-right: 2px;">✓✓</span> ' : ''}${previewText}
                            </p>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>

        <!-- Right Side WhatsApp Chat Window -->
        <div class="chat-window">
            <div class="chat-window-header" style="background-color: var(--wa-header-bg); color: white; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color);">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button class="chat-back-btn-ig" onclick="closeMobileChat()" title="Voltar para conversas" style="color: white; margin-right: 4px;">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <img src="${activeFriend.avatar}" class="mini-avatar" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1.5px solid white;">
                    <div>
                        <strong style="font-size: 15px; display:block; color: white;">${activeFriend.name}</strong>
                        <span style="font-size: 11px; color: rgba(255, 255, 255, 0.85); font-weight:600;">
                            ${activeFriend.online ? 'online' : 'visto por último hoje'}
                        </span>
                    </div>
                </div>
                
                <div class="chat-header-actions-ig" style="color: white; gap: 16px;">
                    <span class="chat-header-action-btn-ig" onclick="startChatCall(false)" title="Chamada de Áudio" style="color: white; cursor: pointer;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </span>
                    <span class="chat-header-action-btn-ig" onclick="startChatCall(true)" title="Chamada de Vídeo" style="color: white; cursor: pointer;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                    </span>
                    <span class="chat-header-action-btn-ig" onclick="toggleChatMoreMenu(event)" title="Mais opções" style="color: white; cursor: pointer;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </span>
                </div>
            </div>
            
            <div class="chat-messages-body" id="chat-messages-container">
                ${activeFriend.messages.map(msg => `
                    <div class="wa-bubble ${msg.sender}" style="${msg.text === '❤️' ? 'background: transparent; box-shadow: none;' : ''}">
                        <div class="wa-bubble-text" style="${msg.text === '❤️' ? 'font-size: 28px; padding: 0;' : ''}">${msg.text}</div>
                        <div class="wa-bubble-meta">
                            <span class="wa-time">${msg.time || '10:45'}</span>
                            ${msg.sender === 'sent' ? '<span class="wa-status-checks">✓✓</span>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- WhatsApp Input Footer -->
            <div class="wa-input-footer" style="padding: 10px 16px; background-color: var(--wa-inbox-header-bg); display: flex; align-items: center; gap: 8px;">
                
                <!-- White Pill Input Wrapper -->
                <div class="wa-input-pill" style="display: flex; align-items: center; flex: 1; background-color: var(--bg-card); border-radius: 24px; padding: 4px 12px; gap: 10px; border: 1px solid var(--border-color);">
                    <span class="wa-pill-btn" onclick="toggleEmojiPicker(event)" title="Emojis" style="cursor:pointer; color: var(--text-muted); display:flex; align-items:center;">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </span>
                    <span class="wa-pill-btn" onclick="triggerAttachment(event)" title="Anexar arquivo" style="cursor:pointer; color: var(--text-muted); display:flex; align-items:center;">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    </span>
                    
                    <input type="text" id="chat-message-input" class="wa-input-field" placeholder="Digite uma mensagem" style="flex:1; border:none; background:transparent; font-size:14px; outline:none; color:var(--text-main);">
                    
                    <span class="wa-pill-btn" onclick="sendQuickHeart()" title="Enviar Coração" style="cursor:pointer; color: var(--text-muted); display:flex; align-items:center;">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </span>
                </div>

                <!-- Circular Floating Send Button -->
                <button class="wa-send-btn" id="chat-send-btn-wa" style="width: 44px; height: 44px; border-radius: 50%; background-color: var(--primary); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2); transition: var(--transition-smooth);">
                    <div id="chat-send-btn-icon" style="display:flex; align-items:center; justify-content:center;">
                        <!-- Microfone padrão -->
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                        </svg>
                    </div>
                </button>
                
            </div>
        </div>

    </div>
    `;
    
    container.innerHTML = chatHtml;
    
    // Auto Scroll to Bottom of message box
    const msgBox = document.getElementById('chat-messages-container');
    if (msgBox) {
        msgBox.scrollTop = msgBox.scrollHeight;
    }
    
    // Bind keys
    const sendBtn = document.getElementById('chat-send-btn-wa');
    const input = document.getElementById('chat-message-input');
    const sendIcon = document.getElementById('chat-send-btn-icon');
    const searchInput = document.getElementById('chat-search-input');
    
    if (sendBtn) sendBtn.addEventListener('click', handleChatSendClick);
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (input.value.trim() !== '') {
                    submitChatMessage();
                }
            }
        });
    }
    
    // WhatsApp Search Contact Filter
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.chat-recipient-card');
            cards.forEach(card => {
                const nameElement = card.querySelector('strong');
                if (nameElement) {
                    const name = nameElement.innerText.toLowerCase();
                    if (name.includes(query)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    }
    
    // WhatsApp Dynamic Microphone -> Send Seta Morphing
    if (input) {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                sendIcon.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                `;
            } else {
                sendIcon.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                    </svg>
                `;
            }
        });
    }
}

function selectChatFriend(friendId) {
    state.activeChatFriendId = friendId;
    state.mobileChatActive = true;
    saveStateToLocalStorage();
    renderCurrentTab('friends');
}

function closeMobileChat() {
    state.mobileChatActive = false;
    saveStateToLocalStorage();
    renderCurrentTab('friends');
}

function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar && backdrop) {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('active');
    }
}

function submitChatMessage() {
    const input = document.getElementById('chat-message-input');
    if (!input || input.value.trim() === '') return;
    
    const text = input.value.trim();
    const activeFriend = state.friends.find(f => f.id === state.activeChatFriendId);
    
    if (activeFriend) {
        // Append user message
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        activeFriend.messages.push({
            sender: 'sent',
            text: text,
            time: timeStr
        });
        
        // Replicar no chat correspondente para comunicação bidirecional
        const currentUserId = (state.tutor && state.tutor.id) || 'carlos';
        const targetId = activeFriend.id;
        if (currentUserId !== 'carlos' && targetId === 'carlos') {
            const tutorViewChat = state.friends.find(f => f.id === currentUserId);
            if (tutorViewChat) {
                tutorViewChat.messages.push({
                    sender: 'received',
                    text: text,
                    time: timeStr
                });
            }
        } else if (currentUserId === 'carlos' && (targetId === 'ong-apapi' || targetId === 'petshop-patinhas' || targetId.startsWith('ong-') || targetId.startsWith('petshop-'))) {
            let tutorFriend = state.friends.find(f => f.id === 'carlos');
            if (!tutorFriend) {
                tutorFriend = {
                    id: 'carlos',
                    name: 'Carlos Henrique',
                    avatar: 'assets/tutor_avatar.png',
                    distance: '1.2km',
                    online: true,
                    messages: []
                };
                state.friends.push(tutorFriend);
            }
            tutorFriend.messages.push({
                sender: 'received',
                text: text,
                time: timeStr
            });
        }
        
        saveStateToLocalStorage();
        
        // Render Immediately in UI
        const msgContainer = document.getElementById('chat-messages-container');
        const bubble = document.createElement('div');
        bubble.className = 'wa-bubble sent';
        bubble.innerHTML = `
            <div class="wa-bubble-text">${text}</div>
            <div class="wa-bubble-meta">
                <span class="wa-time">${timeStr}</span>
                <span class="wa-status-checks">✓✓</span>
            </div>
        `;
        msgContainer.appendChild(bubble);
        msgContainer.scrollTop = msgContainer.scrollHeight;
        
        input.value = '';
        
        // Reset dynamic send button icon to microphone
        const sendIcon = document.getElementById('chat-send-btn-icon');
        if (sendIcon) {
            sendIcon.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                </svg>
            `;
        }
        
        // Bot auto-reply stimulation after 1.5s
        setTimeout(() => {
            simulateBotReply(activeFriend.id);
        }, 1500);
    }
}

function sendQuickHeart() {
    const activeFriend = state.friends.find(f => f.id === state.activeChatFriendId);
    if (activeFriend) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        activeFriend.messages.push({
            sender: 'sent',
            text: '❤️',
            time: timeStr
        });
        
        // Replicar no chat correspondente para comunicação bidirecional
        const currentUserId = (state.tutor && state.tutor.id) || 'carlos';
        const targetId = activeFriend.id;
        if (currentUserId !== 'carlos' && targetId === 'carlos') {
            const tutorViewChat = state.friends.find(f => f.id === currentUserId);
            if (tutorViewChat) {
                tutorViewChat.messages.push({
                    sender: 'received',
                    text: '❤️',
                    time: timeStr
                });
            }
        } else if (currentUserId === 'carlos' && (targetId === 'ong-apapi' || targetId === 'petshop-patinhas' || targetId.startsWith('ong-') || targetId.startsWith('petshop-'))) {
            let tutorFriend = state.friends.find(f => f.id === 'carlos');
            if (!tutorFriend) {
                tutorFriend = {
                    id: 'carlos',
                    name: 'Carlos Henrique',
                    avatar: 'assets/tutor_avatar.png',
                    distance: '1.2km',
                    online: true,
                    messages: []
                };
                state.friends.push(tutorFriend);
            }
            tutorFriend.messages.push({
                sender: 'received',
                text: '❤️',
                time: timeStr
            });
        }
        
        saveStateToLocalStorage();
        
        const msgContainer = document.getElementById('chat-messages-container');
        if (msgContainer) {
            const bubble = document.createElement('div');
            bubble.className = 'wa-bubble sent';
            bubble.style.background = 'transparent';
            bubble.style.boxShadow = 'none';
            bubble.innerHTML = `
                <div class="wa-bubble-text" style="font-size: 28px;">❤️</div>
                <div class="wa-bubble-meta">
                    <span class="wa-time">${timeStr}</span>
                    <span class="wa-status-checks">✓✓</span>
                </div>
            `;
            msgContainer.appendChild(bubble);
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }
        
        // Auto bot response
        setTimeout(() => {
            simulateBotReply(activeFriend.id);
        }, 1500);
    }
}

function simulateBotReply(friendId) {
    const activeFriend = state.friends.find(f => f.id === friendId);
    if (!activeFriend) return;
    
    // Pick bot reply
    const replies = BOT_REPLIES[friendId] || [
        "Au au! 🐾", 
        "Miau! Que legal falar com você!", 
        "Estou pronto para fazer novas travessuras!"
    ];
    const index = Math.floor(Math.random() * replies.length);
    const replyText = replies[index];
    
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    activeFriend.messages.push({
        sender: 'received',
        text: replyText,
        time: timeStr
    });
    saveStateToLocalStorage();
    
    // If user is currently looking at this active chat, render immediately
    if (state.activeChatFriendId === friendId && state.activeTab === 'friends') {
        const msgContainer = document.getElementById('chat-messages-container');
        if (msgContainer) {
            const bubble = document.createElement('div');
            bubble.className = 'wa-bubble received';
            bubble.innerHTML = `
                <div class="wa-bubble-text">${replyText}</div>
                <div class="wa-bubble-meta">
                    <span class="wa-time">${timeStr}</span>
                </div>
            `;
            msgContainer.appendChild(bubble);
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }
    }
    
    // Pop up toast alert
    showToast(`Nova mensagem de ${activeFriend.name.split(' ')[0]}: "${replyText}"`, 'info');
}


// 4. MODULE: COMUNIDADES & FORUMS (Grupos de Raça, Adestramento, Dicas)
function renderCommunitiesView(container) {
    let categories = ['Todos', 'Alimentação', 'Comportamento', 'Saúde Animal', 'Dicas Gerais'];
    
    let commHtml = `
    <div class="forum-grid">
        
        <!-- Categories Panel -->
        <div class="forum-sidebar">
            <button class="btn btn-accent" id="btn-trigger-forum" style="margin-bottom: 16px; width: 100%;">
                <span>+ Criar Novo Tópico</span>
            </button>
            
            <h3 style="font-size: 14px; margin-bottom: 8px; color: var(--text-muted);">Grupos & Categorias</h3>
            <div class="forum-categories-scroll">
                ${categories.map(cat => `
                    <button class="forum-category-btn ${state.activeForumCategory === cat ? 'active' : ''}" onclick="selectForumCategory('${cat}')">
                        <span>${cat}</span>
                        <span style="font-size: 11px; color: var(--text-muted);">
                            ${cat === 'Todos' ? state.forum.length : state.forum.filter(t => t.category === cat).length}
                        </span>
                    </button>
                `).join('')}
            </div>
            
            <div class="card" style="padding: 16px; margin-top: 16px; background: var(--primary-light); text-align:center;">
                <h4 style="font-size: 12px; margin-bottom: 4px;">Comunidade Recomendada:</h4>
                <strong style="font-size: 13px; color: var(--primary);">Golden Retriever Brasil 🐕</strong>
                <p style="font-size: 10px; color: var(--text-muted); margin-top: 6px;">824 tutores ativos marcando encontros.</p>
                <button class="btn btn-primary" style="padding: 4px 10px; font-size: 11px; margin-top: 8px; width:100%;" onclick="showToast('Você entrou no grupo Golden Retriever Brasil!', 'success')">Entrar no Grupo</button>
            </div>
        </div>

        <!-- Thread List or Expand Content -->
        <div class="forum-threads-list" id="forum-threads-wrapper">
            ${renderForumThreads()}
        </div>

    </div>
    `;
    
    container.innerHTML = commHtml;
    
    document.getElementById('btn-trigger-forum').addEventListener('click', () => {
        openModal('forum-modal');
    });
}

function selectForumCategory(cat) {
    state.activeForumCategory = cat;
    saveStateToLocalStorage();
    renderCurrentTab('communities');
}

function renderForumThreads() {
    let threads = state.forum;
    if (state.activeForumCategory !== 'Todos') {
        threads = state.forum.filter(t => t.category === state.activeForumCategory);
    }
    
    if (threads.length === 0) {
        return `<div class="card" style="text-align: center; padding: 40px;"><p style="color: var(--text-muted);">Nenhum tópico criado nesta categoria ainda. Seja o primeiro!</p></div>`;
    }

    return threads.map(thread => `
        <div class="card thread-card" onclick="expandThreadDetails('${thread.id}')">
            <span class="badge" style="background-color: var(--primary-light); color: var(--primary); position: static; font-size: 11px;">
                ${thread.category}
            </span>
            <h3 style="font-size: 16px; margin: 8px 0;">${thread.title}</h3>
            <p style="font-size: 13px; color: var(--text-muted); line-height: 1.4;">
                ${thread.body.substring(0, 100)}${thread.body.length > 100 ? '...' : ''}
            </p>
            <div class="thread-meta-row">
                <span>Postado por: <strong>${thread.author}</strong></span>
                <span class="thread-replies-badge">${thread.replies.length} Respostas</span>
            </div>
        </div>
    `).join('');
}

function expandThreadDetails(threadId) {
    const thread = state.forum.find(t => t.id === threadId);
    if (!thread) return;
    
    const wrapper = document.getElementById('forum-threads-wrapper');
    if (!wrapper) return;
    
    let detailsHtml = `
    <div class="thread-detail-container">
        <button class="btn btn-secondary" onclick="renderCurrentTab('communities')" style="align-self: flex-start; padding: 6px 12px; font-size: 12px;">
            ◀ Voltar aos tópicos
        </button>
        
        <!-- Main post card -->
        <div class="card thread-main-post">
            <span class="badge" style="background-color: var(--primary-light); color: var(--primary); position: static; font-size: 11px; margin-bottom: 12px;">
                ${thread.category}
            </span>
            <h2 style="font-size: 20px; margin-bottom: 8px;">${thread.title}</h2>
            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">
                Criado por <strong>${thread.author}</strong>
            </div>
            <p style="font-size: 14px; line-height: 1.6; color: var(--text-main); white-space: pre-line;">
                ${thread.body}
            </p>
        </div>
        
        <!-- Responses section -->
        <h3 style="font-size: 16px;">Respostas (${thread.replies.length})</h3>
        <div class="replies-list" style="display:flex; flex-direction:column; gap: 12px;">
            ${thread.replies.map(rep => `
                <div class="thread-reply-item">
                    <div style="font-size: 12px; font-weight: 700; color: var(--primary); margin-bottom: 4px;">
                        ${rep.author}
                    </div>
                    <p style="font-size: 13px; line-height: 1.4;">${rep.text}</p>
                </div>
            `).join('')}
        </div>

        <!-- Add Reply Card -->
        <div class="card" style="margin-top: 12px;">
            <h4 style="font-size: 14px; margin-bottom: 8px;">Deixe sua resposta:</h4>
            <div class="form-group" style="margin-bottom: 12px;">
                <textarea id="reply-textarea" class="form-control" rows="4" placeholder="Escreva dicas e conselhos com base na sua experiência de tutor..." required></textarea>
            </div>
            <button class="btn btn-primary" onclick="submitForumReply('${thread.id}')">Enviar Resposta</button>
        </div>
    </div>
    `;
    
    wrapper.innerHTML = detailsHtml;
}

function submitForumReply(threadId) {
    const textarea = document.getElementById('reply-textarea');
    if (textarea && textarea.value.trim() !== '') {
        const thread = state.forum.find(t => t.id === threadId);
        if (thread) {
            thread.replies.push({
                author: 'Você (Tutor)',
                text: textarea.value.trim()
            });
            saveStateToLocalStorage();
            showToast('Sua resposta foi enviada com sucesso!', 'success');
            // Re-expand to update list view
            expandThreadDetails(threadId);
        }
    }
}


function showAdoptionCertificate(petId) {
    let pet = state.adoptionPets.find(p => p.id === petId);
    if (!pet) {
        pet = state.pets.find(p => p.id === petId) || {
            name: 'Pipoca',
            species: 'Cachorro',
            breed: 'SRD',
            age: '1 ano',
            size: 'Porte Médio',
            personality: 'Dócil e brincalhona'
        };
    }
    
    const nameLower = pet.name.toLowerCase();
    const gender = (nameLower.endsWith('a') || nameLower.includes('mel') || nameLower.includes('luna')) ? 'Fêmea' : 'Macho';
    const color = nameLower.includes('pipoca') ? 'Branco / Mesclado' : (nameLower.includes('toby') ? 'Caramelo' : 'Preto / Cinza');
    
    const modal = document.createElement('div');
    modal.id = 'adoption-certificate-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.85)';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000000';
    modal.style.overflowY = 'auto';
    modal.style.padding = '20px 0';
    modal.style.backdropFilter = 'blur(6px)';
    
    const printStyles = `
        @media print {
            body * {
                visibility: hidden;
            }
            #adoption-certificate-modal, #adoption-certificate-modal * {
                visibility: visible;
            }
            #adoption-certificate-modal {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: white !important;
                padding: 0;
                margin: 0;
            }
            .no-print {
                display: none !important;
            }
        }
    `;
    
    const styleEl = document.createElement('style');
    styleEl.innerHTML = printStyles;
    modal.appendChild(styleEl);
    
    modal.innerHTML += `
        <!-- Borda Externa Ornamentada com Patinhas -->
        <div class="certificate-border-wrapper" style="background: #fff; width: 440px; border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 3px solid #e67e22; position: relative; font-family: 'Nunito', sans-serif; box-sizing: border-box; background-image: radial-gradient(rgba(230, 126, 34, 0.05) 1px, transparent 0), radial-gradient(rgba(230, 126, 34, 0.05) 1px, transparent 0); background-size: 24px 24px; background-position: 0 0, 12px 12px;">
            
            <!-- Patinhas decorativas de fundo/bordas -->
            <span style="position: absolute; top: 12px; left: 12px; font-size: 16px; opacity: 0.85; pointer-events: none;">🐾</span>
            <span style="position: absolute; top: 12px; right: 12px; font-size: 16px; opacity: 0.85; pointer-events: none;">🐾</span>
            <span style="position: absolute; bottom: 12px; left: 12px; font-size: 16px; opacity: 0.85; pointer-events: none;">🐾</span>
            <span style="position: absolute; bottom: 12px; right: 12px; font-size: 16px; opacity: 0.85; pointer-events: none;">🐾</span>
            
            <span style="position: absolute; top: 50%; left: 8px; font-size: 14px; opacity: 0.7; pointer-events: none; transform: translateY(-50%);">🐾</span>
            <span style="position: absolute; top: 50%; right: 8px; font-size: 14px; opacity: 0.7; pointer-events: none; transform: translateY(-50%);">🐾</span>
            
            <!-- Moldura Interna -->
            <div style="border: 2px solid #f39c12; border-radius: 12px; padding: 20px; text-align: center; position: relative; background: #ffffff;">
                
                <!-- Logo Topo -->
                <div style="text-align: center; margin-bottom: 6px;">
                    <span style="font-size: 10px; font-weight: 800; color: #d35400; text-transform: uppercase; letter-spacing: 1px; display: block; line-height: 1.1;">Laboratório Juventudes</span>
                    <div style="font-size: 24px; display: inline-block; margin: 3px 0; line-height:1;">🐾</div>
                    <span style="font-size: 10px; font-weight: 800; color: #2980b9; text-transform: uppercase; letter-spacing: 1px; display: block; line-height: 1.1;">Conexão PET</span>
                </div>
                
                <!-- Título -->
                <h2 style="font-size: 20px; font-weight: 900; color: #d35400; margin: 6px 0 10px 0; letter-spacing: 0.5px; text-transform: uppercase;">Certidão de Adoção</h2>
                
                <!-- Ilustração Red Doghouse + Cat/Dog Hugging -->
                <svg width="90" height="90" viewBox="0 0 100 100" style="display: block; margin: 10px auto; background: #fff; border: 1.5px solid #2d3436; border-radius: 10px; padding: 3px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <rect x="25" y="45" width="50" height="40" fill="#e74c3c" stroke="#2c3e50" stroke-width="2" />
                    <path d="M40 85 V 60 A 10 10 0 0 1 60 60 V 85" fill="#2c3e50" />
                    <polygon points="15,45 50,15 85,45" fill="#3498db" stroke="#2c3e50" stroke-width="2" />
                    <polygon points="20,45 50,20 80,45" fill="#2980b9" />
                    <circle cx="58" cy="72" r="8" fill="#e67e22" />
                    <ellipse cx="64" cy="70" r="3" rx="2" ry="4" fill="#d35400" transform="rotate(15, 64, 70)" />
                    <circle cx="56" cy="72" r="1.2" fill="#000" />
                    <polygon points="58,74 60,75 58,76" fill="#000" />
                    <circle cx="44" cy="74" r="7" fill="#bdc3c7" />
                    <polygon points="39,68 41,72 43,70" fill="#bdc3c7" />
                    <polygon points="45,68 47,72 45,70" fill="#bdc3c7" />
                    <circle cx="42" cy="74" r="1" fill="#000" />
                    <circle cx="46" cy="74" r="1" fill="#000" />
                    <polygon points="44,76 45,77 43,77" fill="#e74c3c" />
                </svg>

                <!-- Campos de dados preenchidos -->
                <div style="text-align: left; font-size: 11px; color: #2c3e50; line-height: 1.6; margin: 12px 0 18px 0;">
                    <div style="margin-bottom: 5px; display:flex; justify-content:space-between; border-bottom: 1px dotted #ccc; padding-bottom: 2px;">
                        <span style="font-weight: 800; color: #d35400;">NASCIMENTO:</span>
                        <span style="font-weight: 700; color: #2c3e50;">${pet.age.includes('mes') ? 'Recentemente (2026)' : 'Há 1 ano (Estimado)'}</span>
                    </div>
                    <div style="margin-bottom: 5px; display:flex; justify-content:space-between; border-bottom: 1px dotted #ccc; padding-bottom: 2px;">
                        <span style="font-weight: 800; color: #d35400;">CIDADE NATAL:</span>
                        <span style="font-weight: 700; color: #2c3e50;">Picos, PI</span>
                    </div>
                    <div style="margin-bottom: 5px; display:flex; justify-content:space-between; border-bottom: 1px dotted #ccc; padding-bottom: 2px;">
                        <span style="font-weight: 800; color: #d35400;">ESPÉCIE:</span>
                        <span style="font-weight: 700; color: #2c3e50;">${pet.species}</span>
                    </div>
                    <div style="margin-bottom: 5px; display:flex; justify-content:space-between; border-bottom: 1px dotted #ccc; padding-bottom: 2px;">
                        <span style="font-weight: 800; color: #d35400;">SEXO:</span>
                        <span style="font-weight: 700; color: #2c3e50;">${gender}</span>
                    </div>
                    <div style="margin-bottom: 5px; display:flex; justify-content:space-between; border-bottom: 1px dotted #ccc; padding-bottom: 2px;">
                        <span style="font-weight: 800; color: #d35400;">COR:</span>
                        <span style="font-weight: 700; color: #2c3e50;">${color}</span>
                    </div>
                    <div style="margin-bottom: 5px; display:flex; justify-content:space-between; border-bottom: 1px dotted #ccc; padding-bottom: 2px;">
                        <span style="font-weight: 800; color: #d35400;">PORTE:</span>
                        <span style="font-weight: 700; color: #2c3e50;">${pet.size || 'Porte Médio'}</span>
                    </div>
                    
                    <div style="margin-top: 10px; border-bottom: 1px dotted #ccc; padding-bottom: 2px;">
                        <strong style="color: #d35400;">GUARDIÃO(S):</strong>
                        <span style="font-weight: 700; display:block; margin-top: 1px;">${state.tutor.name}</span>
                    </div>
                    <div style="margin-top: 5px; border-bottom: 1px dotted #ccc; padding-bottom: 2px;">
                        <strong style="color: #d35400;">RAÇA:</strong>
                        <span style="font-weight: 700; display:block; margin-top: 1px;">${pet.breed}</span>
                    </div>
                    <div style="margin-top: 5px; border-bottom: 1px dotted #ccc; padding-bottom: 2px;">
                        <strong style="color: #d35400;">CARACTERÍSTICAS:</strong>
                        <span style="font-weight: 700; display:block; margin-top: 1px; line-height: 1.3;">${pet.personality}</span>
                    </div>
                    <div style="margin-top: 5px; border-bottom: 1px dotted #ccc; padding-bottom: 2px;">
                        <strong style="color: #d35400;">OBSERVAÇÕES IMPORTANTES:</strong>
                        <span style="font-weight: 700; display:block; margin-top: 1px; line-height: 1.3;">Adotado com amor pelo aplicativo Conexão PET via Laboratório Juventudes do Senac - Picos.</span>
                    </div>
                </div>

                <!-- Assinatura/Rodapé -->
                <div style="margin-top: 24px; text-align: center;">
                    <div style="width: 180px; border-top: 1.5px solid #d35400; margin: 0 auto; padding-top: 4px;">
                        <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #d35400; letter-spacing: 0.5px; display:block;">Assinatura do Guardião</span>
                    </div>
                </div>

            </div>
        </div>

        <!-- Botões de Ação -->
        <div class="no-print" style="margin-top: 20px; display: flex; gap: 12px;">
            <button onclick="window.print()" style="background: #27ae60; color: white; border: none; padding: 10px 20px; border-radius: var(--border-radius-sm); font-size: 13.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; font-family: inherit;">🖨️ Imprimir Certidão</button>
            <button onclick="document.getElementById('adoption-certificate-modal').remove();" style="background: #e74c3c; color: white; border: none; padding: 10px 20px; border-radius: var(--border-radius-sm); font-size: 13.5px; font-weight: 700; cursor: pointer; font-family: inherit;">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// 5. MODULE: ADOPTION PLATFORM (Adoção, ONGs, Formulário e Status)
function renderAdoptionView(container) {
    let filters = ['Todos', 'Cachorro', 'Gato', 'Outro'];
    
    let adoptHtml = `
    <div class="adoption-header">
        <div>
            <h2 style="font-size: 22px;">Adoção Responsável 🏠🐾</h2>
            <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Encontre o parceiro ideal e dê uma nova chance de vida.</p>
        </div>
        <div class="adoption-filters">
            ${filters.map(filt => `
                <button class="btn ${state.activeAdoptionFilter === filt ? 'btn-primary' : 'btn-secondary'}" onclick="filterAdoptionList('${filt}')" style="padding: 6px 14px; font-size:12px;">
                    ${filt === 'Todos' ? 'Todos' : filt + 's'}
                </button>
            `).join('')}
        </div>
    </div>

    <!-- Application Status banner if any -->
    ${renderAdoptionApplications()}

    <!-- Main Adoption Grid -->
    <div class="adopt-grid">
        ${renderAdoptionPetsGrid()}
    </div>
    `;
    
    container.innerHTML = adoptHtml;
}

function renderAdoptionApplications() {
    if (state.adoptionApplications.length === 0) return '';
    
    return `
    <div class="card" style="margin-bottom: 24px; border-left: 4px solid var(--primary);">
        <h3 style="font-size: 14px; margin-bottom: 8px;">🐾 Adoções Concluídas e Certidões</h3>
        <div style="display:flex; flex-direction:column; gap: 8px;">
            ${state.adoptionApplications.map(app => `
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; background-color: var(--bg-app); padding:8px 12px; border-radius: var(--border-radius-sm);">
                    <span>Parabéns por adotar o pet: <strong>${app.petName}</strong>! (De: <em>${app.ngo}</em>)</span>
                    <button class="btn" onclick="showAdoptionCertificate('${app.petId}')" style="background: var(--grad-success); color: white; padding: 4px 10px; font-size: 11px; font-weight:700; border:none; border-radius:4px; cursor:pointer;">
                        Ver Certidão 📜
                    </button>
                </div>
            `).join('')}
        </div>
    </div>
    `;
}

function renderAdoptionPetsGrid() {
    let filteredPets = state.adoptionPets;
    if (state.activeAdoptionFilter !== 'Todos') {
        filteredPets = state.adoptionPets.filter(p => p.species === state.activeAdoptionFilter);
    }
    
    return filteredPets.map(pet => `
        <div class="card adopt-card">
            <div class="adopt-card-img-wrap">
                <img src="${pet.image}" class="adopt-card-img" alt="${pet.name}">
                <span class="adopt-badge-tag">${pet.ngo.split(' ')[0]}</span>
            </div>
            <div class="adopt-card-info">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="adopt-card-name">${pet.name}</span>
                    <span style="font-size: 11px; background-color: rgba(0, 184, 148, 0.1); color: var(--success); padding: 2px 8px; border-radius: 10px; font-weight:700;">
                        ✓ ${pet.status}
                    </span>
                </div>
                
                <div class="adopt-card-attributes">
                    <span class="attr-pill">${pet.breed}</span>
                    <span class="attr-pill">${pet.age}</span>
                    <span class="attr-pill">${pet.size}</span>
                </div>
                
                <p style="font-size: 12px; color: var(--text-muted); line-height: 1.4; height: 50px; overflow: hidden; text-overflow: ellipsis;">
                    ${pet.personality}
                </p>
                
                <div style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 8px; display:flex; flex-direction:column; gap: 4px; font-size: 11px; color:var(--text-light);">
                    <span>⚕️ Saúde: ${pet.health}</span>
                    <span>📍 Instituição: ${pet.ngo}</span>
                </div>
                
                <button class="btn btn-primary" style="width: 100%; margin-top: 12px; padding: 8px;" onclick="openAdoptionForm('${pet.id}')">
                    Candidatar-se para Adoção ❤️
                </button>
            </div>
        </div>
    `).join('');
}

function filterAdoptionList(filt) {
    state.activeAdoptionFilter = filt;
    saveStateToLocalStorage();
    renderCurrentTab('adoption');
}

function openAdoptionForm(petId) {
    const pet = state.adoptionPets.find(p => p.id === petId);
    if (!pet) return;
    
    // Set dynamic values on Modal form
    document.getElementById('adopt-pet-id').value = pet.id;
    document.getElementById('adopt-modal-pet-name').innerText = pet.name;
    document.getElementById('adopt-modal-pet-meta').innerText = `${pet.ngo} • ${pet.breed} (${pet.age})`;
    document.getElementById('adopt-modal-pet-img').src = pet.image;
    
    openModal('adoption-modal');
}


// 6. MODULE: HEALTH & GRAPHICS (Carteira Digital, Agenda e Gráfico Dinâmico SVG)
function renderHealthView(container) {
    // We target the first pet in the array for default health display, or toggle
    const currentPet = state.pets && state.pets[0];
    
    if (!currentPet) {
        container.innerHTML = `
        <div class="card" style="text-align: center; padding: 60px 20px; font-family: 'Nunito', sans-serif;">
            <span style="font-size: 48px; display:block; margin-bottom: 16px;">🐾</span>
            <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px; color: var(--text-main);">Nenhum Pet Cadastrado</h3>
            <p style="color: var(--text-muted); font-size: 14px; max-width: 320px; margin: 0 auto 20px; line-height: 1.4;">
                Adicione um pet no seu perfil para gerenciar sua carteira de vacinas, peso e compromissos.
            </p>
            <button class="btn btn-primary" onclick="navigateToTab('profile')" style="padding: 10px 24px; font-weight: 700; border-radius: 20px;">
                Ir para o Perfil
            </button>
        </div>
        `;
        return;
    }

    if (!currentPet.health) {
        currentPet.health = {
            vaccines: [],
            vermifuges: [],
            appointments: [],
            weightHistory: [{ date: 'Jun', weight: currentPet.weight || 0 }]
        };
    }
    
    let healthHtml = `
    <div class="health-dashboard">
        
        <!-- Left Column: Growth Graphs & Digital Booklet -->
        <div class="health-left-col">
            
            <!-- Digital ID Card Banner -->
            <div style="background: var(--grad-primary); border-radius: var(--border-radius-md); padding: 20px; color: white; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; box-shadow: var(--card-shadow);">
                <div>
                    <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 4px;">Carteirinha Digital & Identidade 🪪</h3>
                    <p style="font-size: 12px; opacity: 0.9; margin: 0;">Acesse o QR Code de segurança e os dados oficias de ${currentPet.name}.</p>
                </div>
                <button class="btn" onclick="openModal('digital-card-modal')" style="background: white; color: var(--primary); font-weight: 800; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    Visualizar Carteira ➔
                </button>
            </div>
            
            <!-- SVG weight growth chart card -->
            
            <!-- SVG weight growth chart card -->
            <div class="chart-container">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
                    <div>
                        <h3 style="font-size: 16px;">Evolução de Peso - ${currentPet.name} 📈</h3>
                        <p style="font-size: 11px; color: var(--text-muted);">Controle de crescimento do filhote até a fase adulta.</p>
                    </div>
                    <button class="btn btn-secondary" onclick="openModal('health-modal')" style="padding: 6px 12px; font-size: 11px;">
                        + Logar Peso
                    </button>
                </div>
                
                <!-- SVG Draw -->
                <svg viewBox="0 0 500 240" class="chart-svg">
                    <!-- Grid Lines -->
                    <line x1="40" y1="40" x2="460" y2="40" class="chart-grid-line" />
                    <line x1="40" y1="90" x2="460" y2="90" class="chart-grid-line" />
                    <line x1="40" y1="140" x2="460" y2="140" class="chart-grid-line" />
                    <line x1="40" y1="190" x2="460" y2="190" class="chart-grid-line" />
                    
                    <!-- SVG Path Drawn dynamically -->
                    ${generateSvgChartPath(currentPet.health.weightHistory)}
                    
                    <!-- Axis Labels -->
                    <text x="15" y="45" class="chart-text">35Kg</text>
                    <text x="15" y="95" class="chart-text">25Kg</text>
                    <text x="15" y="145" class="chart-text">15Kg</text>
                    <text x="15" y="195" class="chart-text">5Kg</text>
                </svg>
            </div>

            <!-- Digital Vaccine Booklet Card -->
            <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                    <div>
                        <h3 style="font-size: 16px;">Carteira Digital de Vacinas 💉</h3>
                        <p style="font-size: 11px; color: var(--text-muted);">Histórico imunológico e próximas vacinas obrigatórias.</p>
                    </div>
                    <button class="btn btn-primary" onclick="openModal('health-modal')" style="padding: 6px 12px; font-size: 11px;">
                        + Adicionar Registro
                    </button>
                </div>
                
                <div class="vaccine-card-list">
                    ${currentPet.health.vaccines.map(vac => `
                        <div class="health-list-item">
                            <div class="health-item-details">
                                <span class="health-item-title">${vac.name}</span>
                                <span class="health-item-sub">Aplicada em: ${formatBrazilianDate(vac.date)} • Validade até: ${formatBrazilianDate(vac.nextDate)}</span>
                            </div>
                            <span class="health-badge-status done">Aplicada</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Vermifuges Card -->
            <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
                    <h3 style="font-size: 16px;">Controle de Vermífugos & Parasitas 💊</h3>
                </div>
                <div class="vaccine-card-list">
                    ${currentPet.health.vermifuges.map(ver => `
                        <div class="health-list-item">
                            <div class="health-item-details">
                                <span class="health-item-title">${ver.name}</span>
                                <span class="health-item-sub">Última dose: ${formatBrazilianDate(ver.date)} • Repetir em: ${formatBrazilianDate(ver.nextDate)}</span>
                            </div>
                            <span class="health-badge-status done">Em dia</span>
                        </div>
                    `).join('')}
                </div>
            </div>

        </div>

        <!-- Right Column: Calendar Planner & Alerts -->
        <div class="feed-widgets">
            
            <!-- Alert Center -->
            <div class="card">
                <h3 class="widget-title">Alertas de Saúde ⚠️</h3>
                <div class="alert-center-widget">
                    <div class="alert-message-card">
                        <span>📢</span>
                        <div>A vacina de Gripe Canina vence no dia <strong>12/11/2026</strong>. Agende com antecedência!</div>
                    </div>
                    <div class="alert-message-card" style="background-color: rgba(9, 132, 227, 0.08); border-left-color: var(--info);">
                        <span>🩺</span>
                        <div>Vermífugo vencendo próximo mês. Lembre-se de dar o comprimido!</div>
                    </div>
                </div>
            </div>

            <!-- Calendar Schedule Planner -->
            <div class="appointment-calendar-widget">
                <h3 style="font-size: 15px; margin-bottom: 16px;">Agenda de Compromissos 📅</h3>
                
                <div class="vaccine-card-list">
                    ${currentPet.health.appointments.map(app => `
                        <div class="health-list-item" style="padding: 12px 14px;">
                            <div class="health-item-details">
                                <strong style="font-size:13px;">${app.title}</strong>
                                <span style="font-size:11px; color: var(--text-muted);">${formatBrazilianDate(app.date)} às ${app.time}</span>
                            </div>
                            <span class="health-badge-status pending">Agendado</span>
                        </div>
                    `).join('')}
                </div>
            </div>

        </div>

    </div>
    `;
    
    container.innerHTML = healthHtml;
}

// Convert weight array to SVG Chart Path
function generateSvgChartPath(history) {
    if (!history || history.length === 0) return '';
    
    const chartHeight = 240;
    const chartWidth = 500;
    
    const paddingLeft = 60;
    const paddingRight = 40;
    const paddingTop = 40;
    const paddingBottom = 50;
    
    const usableWidth = chartWidth - paddingLeft - paddingRight;
    const usableHeight = chartHeight - paddingTop - paddingBottom;
    
    // Find min & max weights
    const weights = history.map(h => h.weight);
    const minWeight = Math.min(...weights) * 0.9;
    const maxWeight = Math.max(...weights) * 1.1;
    const range = maxWeight - minWeight;
    
    // Calculate node coordinates
    const numPoints = history.length;
    const points = history.map((item, idx) => {
        const x = paddingLeft + (idx / (numPoints - 1)) * usableWidth;
        const normalizedY = (item.weight - minWeight) / range;
        const y = chartHeight - paddingBottom - (normalizedY * usableHeight);
        return { x, y, weight: item.weight, date: item.date };
    });
    
    // Draw SVG elements
    const dPath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    
    const pointsMarkup = points.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="6" class="chart-point" data-weight="${p.weight}">
            <title>${p.date}: ${p.weight} Kg</title>
        </circle>
        <text x="${p.x - 10}" y="${p.y - 12}" class="chart-text" style="font-size:10px; font-weight:700; fill:var(--primary);">${p.weight}k</text>
        <text x="${p.x - 10}" y="215" class="chart-text">${p.date}</text>
    `).join('');
    
    return `
        <path d="${dPath}" class="chart-line" />
        <path d="${dPath}" class="chart-line-bg" />
        ${pointsMarkup}
    `;
}

function formatBrazilianDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


// 7. MODULE: LOCAL EVENTS & RSVP
function renderEventsView(container) {
    let eventsHtml = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px;">
        <div>
            <h2 style="font-size: 22px;">Eventos Locais 🎪🌳</h2>
            <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Participe de competições, feiras de adoção e cãominhadas na sua região.</p>
        </div>
        <button class="btn btn-primary" onclick="openModal('event-modal')">
            + Criar Evento
        </button>
    </div>

    <div class="events-grid">
        ${state.events.map(ev => {
            const dateObj = new Date(ev.date + 'T00:00:00');
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString('pt-BR', { month: 'short' });
            
            return `
            <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; height: 100%;">
                <div>
                    <div class="event-card-header">
                        <h3 style="font-size: 16px; line-height: 1.3; max-width: 70%;">${ev.title}</h3>
                        <div class="event-date-badge">
                            <div class="event-date-day">${day}</div>
                            <div class="event-date-month">${month}</div>
                        </div>
                    </div>
                    
                    <div class="event-details-list">
                        <div class="event-detail-item">
                            <span>⏰</span> <span>${ev.time}</span>
                        </div>
                        <div class="event-detail-item">
                            <span>📍</span> <span>${ev.location}</span>
                        </div>
                        </div>
                    </div>
                    <p style="font-size: 14px; margin-top: 12px; line-height: 1.4;">${ev.desc}</p>
                </div>
                <div style="margin-top: 24px;">
                    <button class="btn ${ev.userJoined ? 'btn-secondary' : 'btn-primary'}" style="width: 100%" onclick="toggleEventRsvp('${ev.id}')">
                        ${ev.userJoined ? 'Presença Confirmada' : 'Participar do Evento'}
                    </button>
                </div>
            </div>
            `;
        }).join('')}
    </div>
    `;
    container.innerHTML = eventsHtml;
}

function toggleEventRsvp(eventId) {
    const ev = state.events.find(e => e.id === eventId);
    if (ev) {
        if (ev.userJoined) {
            ev.userJoined = false;
            ev.rsvps--;
        } else {
            ev.userJoined = true;
            ev.rsvps++;
            showToast('Presença confirmada no evento!', 'success');
        }
        saveStateToLocalStorage();
        renderCurrentTab('events');
    }
}

// 8. MODULE: INSTITUTIONS & MAP
let leafletMap = null;

function renderInstitutionsView(container) {
    container.innerHTML = `
        <div class="card" style="padding: 24px;">
            <h2 style="font-size: 22px; margin-bottom: 8px;">🏥 Instituições & Serviços Pet</h2>
            <p style="color: var(--text-muted); margin-bottom: 24px;">Encontre as melhores clínicas, pet shops, ONGs e serviços próximos a você.</p>
            
            <!-- Mapa Interativo -->
            <div id="institutions-map" style="width:100%; height: 350px; border-radius:12px; border: 1px solid var(--border-color); z-index: 1;"></div>
            
            <h3 style="margin-top: 32px; margin-bottom: 16px; font-size: 18px;">Destaques Perto de Você</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                
                <!-- Card Instituição 1 -->
                <div style="border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; display: flex; gap: 16px; align-items: center;">
                    <div style="width: 60px; height: 60px; background: #e0f2fe; border-radius: 50px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                        🏥
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 16px; display: flex; align-items: center; gap: 4px;">
                            Clínica Vet Care <span style="background: rgba(9,132,227,0.1); color: var(--info); padding: 2px 6px; border-radius: 4px; font-size: 10px;">Verificada</span>
                        </h4>
                        <p style="margin: 4px 0 0; font-size: 13px; color: var(--text-muted);">Clínica Veterinária • 2.5km</p>
                        <p style="margin: 4px 0 0; font-size: 12px; color: #f59e0b;">⭐ 4.9 (128 avaliações)</p>
                    </div>
                </div>

                <!-- Card Instituição 2 -->
                <div style="border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; display: flex; gap: 16px; align-items: center;">
                    <div style="width: 60px; height: 60px; background: #fef08a; border-radius: 50px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                        ❤️
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 16px; display: flex; align-items: center; gap: 4px;">
                            ONG Patas Solidárias <span style="background: rgba(239,68,68,0.1); color: #ef4444; padding: 2px 6px; border-radius: 4px; font-size: 10px;">ONG Parceira</span>
                        </h4>
                        <p style="margin: 4px 0 0; font-size: 13px; color: var(--text-muted);">Adoção & Resgate • 5.1km</p>
                        <p style="margin: 4px 0 0; font-size: 12px; color: #f59e0b;">⭐ 5.0 (342 adoções)</p>
                    </div>
                </div>

                <!-- Card Instituição 3 -->
                <div style="border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; display: flex; gap: 16px; align-items: center;">
                    <div style="width: 60px; height: 60px; background: #dcfce7; border-radius: 50px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                        ✂️
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 16px;">PetShop VIP</h4>
                        <p style="margin: 4px 0 0; font-size: 13px; color: var(--text-muted);">Banho, Tosa e Produtos • 1.2km</p>
                        <p style="margin: 4px 0 0; font-size: 12px; color: #f59e0b;">⭐ 4.7 (89 avaliações)</p>
                    </div>
                </div>

            </div>
        </div>
    `;

    // Inicializar o Mapa Leaflet com delay curto para o DOM renderizar
    setTimeout(() => {
        if (leafletMap !== null) {
            leafletMap.remove();
        }
        leafletMap = L.map('institutions-map').setView([-7.0772, -41.4669], 13); // Foco Picos, PI

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(leafletMap);

        // Adicionar Markers de Exemplo
        L.marker([-7.0772, -41.4669]).addTo(leafletMap)
            .bindPopup('<b>Clínica Vet Care</b><br>Aberta 24h.').openPopup();
        
        L.marker([-7.0800, -41.4700]).addTo(leafletMap)
            .bindPopup('<b>ONG Patas Solidárias</b><br>Venha adotar!');
        
        L.marker([-7.0750, -41.4600]).addTo(leafletMap)
            .bindPopup('<b>PetShop VIP</b><br>Banho e Tosa.');
    }, 100);
}

// 9. MODULE: SAFETY & REPORTS
function renderSafetyView(container) {
    const reportsList = state.reports || [];
    
    const countAnalysis = reportsList.filter(r => r.status === 'Em Análise').length;
    const countResolved = reportsList.filter(r => r.status === 'Resolvido').length;
    const countActiveSearch = reportsList.filter(r => r.status === 'Busca Ativa').length;

    const reportsHtml = reportsList.map(rep => {
        let icon = '🚨';
        let bgStyle = 'background: #fee2e2;';
        if (rep.type === 'Perfil Falso') {
            icon = '👤';
            bgStyle = 'background: #e0f2fe;';
        } else if (rep.type === 'Maus Serviços') {
            icon = '🏥';
            bgStyle = 'background: #fef08a;';
        } else if (rep.type === 'Animal de Rua') {
            icon = '🐕';
            bgStyle = 'background: #dcfce7;';
        } else if (rep.type === 'Animal Perdido') {
            icon = '🔍';
            bgStyle = 'background: #e0e7ff;';
        } else if (rep.type === 'Animal Ferido') {
            icon = '🩹';
            bgStyle = 'background: #ffedd5;';
        } else if (rep.type === 'Maus-tratos') {
            icon = '🚨';
            bgStyle = 'background: #fee2e2;';
        }

        let statusBadge = '';
        if (rep.status === 'Em Análise') {
            statusBadge = `<span style="background: #fef08a; color: #854d0e; padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600;">Em Análise</span>`;
        } else if (rep.status === 'Resolvido') {
            statusBadge = `<span style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600;">Resolvido</span>`;
        } else if (rep.status === 'Busca Ativa') {
            statusBadge = `<span style="background: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600;">Busca Ativa</span>`;
        } else {
            statusBadge = `<span style="background: #dfe6e9; color: #2d3436; padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600;">${rep.status}</span>`;
        }

        return `
        <div style="border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center; gap: 12px; background-color: var(--bg-card);">
            <div style="display: flex; gap: 16px; align-items: center;">
                <div style="width: 48px; height: 48px; ${bgStyle} border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 22px;">
                    ${icon}
                </div>
                <div>
                    <h4 style="margin: 0; font-size: 15px;">${rep.type}</h4>
                    <p style="margin: 4px 0 0; font-size: 13px; color: var(--text-muted);">Local/Alvo: ${rep.target}</p>
                    <p style="margin: 2px 0 0; font-size: 12px; color: var(--text-light); font-style: italic;">"${rep.details}"</p>
                </div>
            </div>
            ${statusBadge}
        </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="card" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div>
                    <h2 style="color: #ef4444; margin: 0; font-size: 22px;">🚨 Central de Segurança</h2>
                    <p style="color: var(--text-muted); margin-top: 8px;">Acompanhe o status das denúncias e mantenha a comunidade segura.</p>
                </div>
                <button class="btn btn-primary" style="background-color: #ef4444; display: flex; align-items: center; gap: 8px;" onclick="openModal('sos-modal-dialog')">
                    <span>🚨</span> Alerta SOS
                </button>
            </div>
            
            <div class="safety-stats-grid" style="margin-bottom: 32px;">
                <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); padding: 16px; border-radius: 8px; text-align: center;">
                    <h3 style="color: #ef4444; font-size: 24px; margin: 0;" id="safety-count-analysis">${countAnalysis}</h3>
                    <span style="font-size: 13px; color: var(--text-muted);">Em Análise</span>
                </div>
                <div style="background: rgba(34, 197, 94, 0.05); border: 1px solid rgba(34, 197, 94, 0.2); padding: 16px; border-radius: 8px; text-align: center;">
                    <h3 style="color: #22c55e; font-size: 24px; margin: 0;" id="safety-count-resolved">${countResolved}</h3>
                    <span style="font-size: 13px; color: var(--text-muted);">Resolvidas</span>
                </div>
                <div style="background: rgba(9, 132, 227, 0.05); border: 1px solid rgba(9, 132, 227, 0.2); padding: 16px; border-radius: 8px; text-align: center;">
                    <h3 style="color: #0984e3; font-size: 24px; margin: 0;" id="safety-count-search">${countActiveSearch}</h3>
                    <span style="font-size: 13px; color: var(--text-muted);">Busca Ativa</span>
                </div>
            </div>

            <h3 style="font-size: 18px; margin-bottom: 16px;">Ocorrências Recentes</h3>
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${reportsHtml || '<p style="color: var(--text-muted); text-align: center; padding: 20px;">Nenhuma ocorrência registrada.</p>'}
            </div>
        </div>
    `;
}

// 10. RECOVERED VIEWS - Removed duplicate empty overrides to enable full modules functionality

function renderProfileView(container) {
    const isVisited = state.visitedProfile && state.visitedProfile !== 'carlos';
    const profile = isVisited ? PROFILES.find(p => p.id === state.visitedProfile) : null;

    const tutorName = profile ? profile.name : state.tutor.name;
    const tutorUsername = profile ? profile.username : state.tutor.name.toLowerCase().replace(/\s+/g, '');
    const tutorAvatar = profile ? profile.avatar : state.tutor.avatar;
    const tutorBio = profile ? profile.bio : state.tutor.bio;
    const tutorLocation = profile ? profile.location : state.tutor.location;
    const tutorFollowers = profile ? profile.followersCount : state.tutor.followersCount;
    const tutorFollowing = profile ? profile.friendsCount : state.tutor.friendsCount;
    
    const profileType = profile ? (profile.type || 'tutor') : (state.tutor.type || 'tutor');
    const activePlan = profile ? (profile.activePlan || 'Bronze') : (state.tutor.activePlan || 'Bronze');
    const tutorBadgeText = profileType === 'institution' ? '🛡️ ONG Verificada 🛡️' : (profileType === 'petshop' ? (activePlan === 'Ultravioleta' ? '💎 Patrocinador Oficial 💎' : (activePlan === 'Pet Gold' ? '🛍️ Pet Shop Gold 🌟' : '🛍️ Pet Shop Verificado 🐾')) : '🐾 Tutor Verificado');
    const bioCategory = profileType === 'institution' ? '💚 Associação de Proteção Animal' : (profileType === 'petshop' ? '🛍️ Serviços & Produtos Pet' : '🐾 Pet Lover & Tutor');
    const deckTitle = profileType === 'institution' ? '💚 Animais para Adoção' : (profileType === 'petshop' ? '🐾 Nossos Mascotes' : '❤️ Família Pet');

    let posts = state.feed || [];
    if (profile) {
        posts = posts.filter(p => p.authorName.toLowerCase().includes(profile.name.toLowerCase()));
    } else {
        posts = posts.filter(p => p.authorName.includes('Rex') || p.authorName.includes('Mel') || p.authorName.includes('Carlos'));
    }

    const tutorPets = profile ? (profile.pets || []) : (state.pets || []);
    
    let pHtml = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        .profile-container {
            max-width: 935px;
            margin: 0 auto;
            padding: 20px;
            font-family: 'Nunito', sans-serif;
        }
        
        /* Banner Card */
        .profile-banner-card {
            position: relative;
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
            height: 180px;
            border-radius: var(--border-radius-md);
            overflow: visible;
            margin-bottom: 70px;
            box-shadow: var(--card-shadow);
            cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='font-size: 24px;'%3E%3Ctext y='24' x='0'%3E🐾%3C/text%3E%3C/svg%3E") 12 12, auto;
        }
        .profile-banner-mesh {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: radial-gradient(at 20% 30%, rgba(255, 255, 255, 0.15) 0px, transparent 50%),
                              radial-gradient(at 80% 70%, rgba(108, 92, 231, 0.2) 0px, transparent 50%);
            border-radius: var(--border-radius-md);
        }
        
        /* Header Info Card */
        .profile-info-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-md);
            padding: 24px;
            box-shadow: var(--card-shadow);
            margin-bottom: 24px;
            position: relative;
        }
        
        .profile-header-main {
            display: flex;
            align-items: flex-end;
            margin-top: -80px; /* Pull it up to overlap the banner */
            margin-bottom: 20px;
            gap: 24px;
            flex-wrap: wrap;
        }
        
        .avatar-wrapper {
            position: relative;
            padding: 4px;
            border-radius: 28px;
            background: var(--bg-card);
            width: 140px;
            height: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            transition: var(--transition-smooth);
        }
        .avatar-wrapper:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px rgba(108, 92, 231, 0.2);
        }
        .avatar-img {
            width: 128px;
            height: 128px;
            border-radius: 24px;
            object-fit: cover;
        }
        
        .tutor-info-details {
            flex: 1;
            min-width: 250px;
            padding-bottom: 8px;
        }
        
        .tutor-name-row {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 6px;
        }
        
        .tutor-name {
            font-size: 24px;
            font-weight: 800;
            margin: 0;
            color: var(--text-main);
            letter-spacing: -0.5px;
        }
        
        .tutor-username {
            font-size: 14px;
            color: var(--text-muted);
            font-weight: 600;
        }
        
        .tutor-badge {
            background: var(--primary-light);
            color: var(--primary);
            padding: 6px 12px;
            border-radius: 30px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        
        .tutor-actions {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-top: 12px;
        }
        
        .action-btn {
            background-color: var(--bg-input);
            color: var(--text-main);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 8px 18px;
            font-size: 13.5px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            font-family: inherit;
            transition: var(--transition-smooth);
        }
        .action-btn:hover {
            background-color: var(--border-color);
            transform: translateY(-1px);
        }
        
        .gear-btn {
            background-color: var(--bg-input);
            border: 1px solid var(--border-color);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            color: var(--text-main);
            transition: var(--transition-smooth);
            border-radius: 8px;
            width: 36px;
            height: 36px;
        }
        .gear-btn:hover {
            background-color: var(--border-color);
            transform: rotate(45deg);
        }
        .gear-icon {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }
        
        .tutor-bio {
            font-size: 14.5px;
            line-height: 1.6;
            color: var(--text-main);
            margin-top: 12px;
            border-top: 1px solid var(--border-color);
            padding-top: 12px;
        }
        
        .location-link {
            color: var(--primary);
            text-decoration: none;
            font-size: 13.5px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-top: 8px;
            transition: var(--transition-smooth);
        }
        .location-link:hover {
            color: var(--primary-hover);
            text-decoration: underline;
        }
        
        /* Stats Dashboard Grid */
        .stats-dashboard {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
        }
        .stat-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-md);
            padding: 16px;
            flex: 1;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: var(--card-shadow);
            transition: var(--transition-smooth);
        }
        .stat-card:hover {
            transform: translateY(-2px);
            border-color: var(--primary);
            box-shadow: var(--hover-shadow);
        }
        .stat-val {
            font-size: 24px;
            font-weight: 900;
            color: var(--primary);
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .stat-label {
            font-size: 12px;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        /* Pets Deck Section */
        .pets-deck-container {
            margin-bottom: 32px;
        }
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        .section-title {
            font-size: 18px;
            font-weight: 800;
            color: var(--text-main);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .pets-deck-row {
            display: flex;
            gap: 16px;
            overflow-x: auto;
            padding: 4px 4px 16px 4px;
            scroll-behavior: smooth;
        }
        .pet-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-md);
            padding: 16px;
            min-width: 180px;
            width: 180px;
            text-align: center;
            box-shadow: var(--card-shadow);
            transition: var(--transition-smooth);
            cursor: pointer;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .pet-card:hover {
            transform: translateY(-4px);
            border-color: var(--primary);
            box-shadow: var(--hover-shadow);
        }
        .pet-card-avatar {
            width: 80px;
            height: 80px;
            border-radius: 20px;
            object-fit: cover;
            border: 3px solid var(--primary-light);
            margin-bottom: 12px;
            transition: var(--transition-smooth);
        }
        .pet-card:hover .pet-card-avatar {
            border-color: var(--primary);
            transform: scale(1.05);
        }
        .pet-card-name {
            font-size: 15px;
            font-weight: 800;
            color: var(--text-main);
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
        }
        .pet-card-sub {
            font-size: 12px;
            color: var(--text-muted);
            font-weight: 700;
            margin-bottom: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }
        .pet-details-btn {
            font-size: 11.5px;
            font-weight: 700;
            color: var(--primary);
            background-color: var(--primary-light);
            padding: 6px 12px;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-family: inherit;
            transition: var(--transition-smooth);
            margin-top: auto;
        }
        .pet-card:hover .pet-details-btn {
            background-color: var(--primary);
            color: white;
        }
        
        .pet-card.add-new {
            border: 2px dashed var(--text-light);
            background: transparent;
            box-shadow: none;
            justify-content: center;
        }
        .pet-card.add-new:hover {
            border-color: var(--primary);
            color: var(--primary);
            background: var(--bg-card);
            box-shadow: var(--card-shadow);
        }
        .add-pet-icon {
            font-size: 32px;
            color: var(--text-light);
            margin-bottom: 8px;
            transition: var(--transition-smooth);
        }
        .pet-card.add-new:hover .add-pet-icon {
            color: var(--primary);
            transform: scale(1.1);
        }
        
        .pet-detail-popover {
            position: absolute;
            top: 100px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-md);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            padding: 16px;
            z-index: 10;
            width: 220px;
            display: none;
            flex-direction: column;
            gap: 8px;
            text-align: left;
            animation: popoverFadeIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popoverFadeIn {
            from { opacity: 0; transform: translateY(-10px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .remove-pet-link {
            color: var(--secondary);
            font-size: 11.5px;
            text-decoration: none;
            margin-top: 6px;
            cursor: pointer;
            font-weight: 700;
            text-align: center;
            padding: 6px;
            border-radius: 6px;
            background-color: rgba(255, 118, 117, 0.1);
            transition: var(--transition-smooth);
        }
        .remove-pet-link:hover {
            background-color: var(--secondary);
            color: white;
        }
        
        /* Modern Segmented Tab Switcher (Pill style) */
        .pill-tab-switcher-wrapper {
            display: flex;
            justify-content: center;
            margin-bottom: 24px;
        }
        .pill-tab-switcher {
            background: var(--bg-input);
            border: 1px solid var(--border-color);
            padding: 6px;
            border-radius: 40px;
            display: inline-flex;
            gap: 4px;
        }
        .pill-tab {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 24px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1.5px;
            color: var(--text-muted);
            border-radius: 30px;
            cursor: pointer;
            text-transform: uppercase;
            transition: var(--transition-smooth);
        }
        .pill-tab:hover {
            color: var(--text-main);
        }
        .pill-tab.active {
            color: white;
            background-color: var(--primary);
            box-shadow: 0 4px 12px rgba(108, 92, 231, 0.25);
        }
        .tab-icon {
            width: 16px;
            height: 16px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
        }
        
        /* Premium Card Grid for Photos */
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }
        .gallery-card {
            position: relative;
            width: 100%;
            padding-top: 100%;
            background-color: var(--bg-input);
            cursor: pointer;
            overflow: hidden;
            border-radius: var(--border-radius-md);
            box-shadow: var(--card-shadow);
            border: 1px solid var(--border-color);
            transition: var(--transition-smooth);
        }
        .gallery-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--hover-shadow);
            border-color: var(--primary);
        }
        .gallery-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        .gallery-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(108, 92, 231, 0.3);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 24px;
            opacity: 0;
            transition: opacity 0.3s ease;
            color: #fff;
            font-weight: bold;
            font-size: 15px;
        }
        .gallery-card:hover .gallery-overlay {
            opacity: 1;
        }
        .gallery-card:hover .gallery-img {
            transform: scale(1.05);
        }
        .gallery-stat {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .gallery-stat-svg {
            width: 18px;
            height: 18px;
            fill: white;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .profile-banner-card {
                height: 140px;
                margin-bottom: 60px;
            }
            .profile-header-main {
                margin-top: -60px;
                flex-direction: column;
                align-items: center;
                text-align: center;
                gap: 16px;
            }
            .avatar-wrapper {
                width: 110px;
                height: 110px;
                border-radius: 22px;
            }
            .avatar-img {
                width: 100px;
                height: 100px;
                border-radius: 18px;
            }
            .tutor-name-row {
                justify-content: center;
            }
            .tutor-actions {
                justify-content: center;
            }
            .stats-dashboard {
                gap: 10px;
            }
            .stat-card {
                padding: 12px;
            }
            .stat-val {
                font-size: 18px;
            }
            .gallery-grid {
                gap: 10px;
            }
            .pill-tab {
                padding: 8px 16px;
                font-size: 12px;
            }
        }
        
        /* Floating paws mouse trails styles */
        .profile-floating-paw {
            position: absolute;
            font-size: 32px;
            color: rgba(255, 255, 255, 0.45);
            pointer-events: none;
            z-index: 5;
            animation: fadeOutPaw 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
        @keyframes fadeOutPaw {
            0% {
                opacity: 0.6;
                filter: blur(0px);
            }
            80% {
                opacity: 0.15;
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.6);
                filter: blur(1px);
            }
        }
        .gallery-card.reel-card {
            padding-top: 135%; /* Aspecto vertical para os Reels */
        }
        .reel-badge {
            transition: opacity 0.2s ease;
        }
        .gallery-card.reel-card:hover .reel-badge {
            opacity: 0;
        }
    </style>

    <div class="profile-container">
        <!-- Banner Capa -->
        <div class="profile-banner-card">
            <div class="profile-banner-mesh"></div>
            <span style="position: absolute; top: 15px; right: 25px; font-size: 32px; opacity: 0.15; transform: rotate(15deg); pointer-events: none;">🐾</span>
            <span style="position: absolute; bottom: 15px; left: 25px; font-size: 24px; opacity: 0.12; transform: rotate(-25deg); pointer-events: none;">🦴</span>
            <span style="position: absolute; top: 45px; left: 45%; font-size: 28px; opacity: 0.1; transform: rotate(5deg); pointer-events: none;">🐾</span>
        </div>

        <!-- Card de Informações Principais do Tutor -->
        <div class="profile-info-card">
            <div class="profile-header-main">
                <div class="avatar-wrapper">
                    <img src="${tutorAvatar}" class="avatar-img" alt="Avatar do Tutor">
                </div>
                <div class="tutor-info-details">
                    <div class="tutor-name-row">
                        <h2 class="tutor-name">${tutorName}</h2>
                        <span class="tutor-badge">${tutorBadgeText}</span>
                    </div>
                    <span class="tutor-username">@${tutorUsername}</span>
                    
                    <div class="tutor-actions">
                        ${profile ? `
                            <button class="action-btn follow-btn" onclick="toggleFollowProfile('${profile.id}')" style="background-color: ${profile.isFollowing ? 'var(--bg-input)' : 'var(--primary)'}; color: ${profile.isFollowing ? 'var(--text-main)' : '#fff'}; border: ${profile.isFollowing ? '1px solid var(--border-color)' : 'none'};">
                                ${profile.isFollowing ? 'Seguindo' : 'Seguir'}
                            </button>
                            <button class="action-btn message-btn" onclick="openChatWithProfile('${profile.id}')">
                                ${profileType === 'institution' ? 'Falar com ONG' : 'Enviar Mensagem'}
                            </button>
                            ${profileType === 'institution' ? `
                                <button class="action-btn donate-btn" onclick="donateToInstitution('${tutorName}')" style="background-color: #2ecc71; color: white; border: none; font-weight: 700;">
                                    Ajudar 💚
                                </button>
                            ` : ''}
                            <button class="action-btn back-btn" onclick="goBackToMyProfile()">
                                ⬅️ Voltar
                            </button>
                        ` : `
                            <button class="action-btn" onclick="openEditProfileModal()">Editar Perfil</button>
                            <button class="gear-btn" onclick="openSettingsModal()" title="Configurações">
                                <svg viewBox="0 0 24 24" class="gear-icon">
                                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                                </svg>
                            </button>
                        `}
                    </div>
                </div>
            </div>
            
            <div class="tutor-bio">
                <span style="font-size: 13.5px; color: var(--text-muted); font-weight: 700; display:block; margin-bottom: 4px;">${bioCategory}</span>
                <span style="display:block; color: var(--text-main); margin-bottom: 8px;">${tutorBio}</span>
                
                ${profileType === 'institution' ? `
                    <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; padding: 14px; margin: 12px 0; font-size: 12.5px; color: var(--text-main); text-align: left; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; line-height:1.4;">
                        <div><strong>🎯 Missão:</strong> Resgatar, reabilitar e doar com responsabilidade social e carinho.</div>
                        <div><strong>📅 Fundação:</strong> 2018</div>
                        <div><strong>📜 CNPJ:</strong> 12.345.678/0001-99</div>
                        <div><strong>📞 Contato:</strong> (19) 3456-7890 / (19) 99876-5432</div>
                        <div><strong>✉️ E-mail:</strong> contato@apapi.org.br</div>
                        <div><strong>🌐 Site:</strong> <a href="#" onclick="showToast('Redirecionando para o site oficial (Simulado)', 'info'); return false;" style="color:var(--primary); font-weight:700; text-decoration:none;">apapi.org.br</a></div>
                        <div><strong>🕰️ Horário:</strong> Seg a Sáb: 8h às 18h</div>
                        <div><strong>📱 Redes:</strong> <a href="#" style="color:var(--primary); text-decoration:none;">@ong_apapi</a> (Instagram, Facebook)</div>
                    </div>
                ` : `
                    <a href="#" class="location-link" onclick="showToast('Abrindo mapa da localização...', 'info'); return false;">📍 ${tutorLocation}</a>
                `}
            </div>
        </div>

        <!-- Painel de Métricas (Dashboard Stats) -->
        ${profileType === 'institution' ? `
        <div class="stats-dashboard" style="grid-template-columns: repeat(6, 1fr) !important; gap: 8px !important;">
            <div class="stat-card" style="padding: 10px 4px;">
                <span class="stat-val" style="font-size: 15px; font-weight:800;">🐶 ${tutorPets.length}</span>
                <span class="stat-label" style="font-size: 9px; font-weight:800;">Disponíveis</span>
            </div>
            <div class="stat-card" style="padding: 10px 4px;">
                <span class="stat-val" style="font-size: 15px; font-weight:800;">❤️ ${state.adoptedCount || 142}</span>
                <span class="stat-label" style="font-size: 9px; font-weight:800;">Adotados</span>
            </div>
            <div class="stat-card" style="padding: 10px 4px;">
                <span class="stat-val" style="font-size: 15px; font-weight:800;">👥 ${tutorFollowers}</span>
                <span class="stat-label" style="font-size: 9px; font-weight:800;">Seguidores</span>
            </div>
            <div class="stat-card" style="padding: 10px 4px;">
                <span class="stat-val" style="font-size: 15px; font-weight:800;">📅 3</span>
                <span class="stat-label" style="font-size: 9px; font-weight:800;">Eventos</span>
            </div>
            <div class="stat-card" style="padding: 10px 4px;">
                <span class="stat-val" style="font-size: 15px; font-weight:800;">💰 1</span>
                <span class="stat-label" style="font-size: 9px; font-weight:800;">Campanhas</span>
            </div>
            <div class="stat-card" style="padding: 10px 4px;">
                <span class="stat-val" style="font-size: 15px; font-weight:800;">🤝 ${state.volunteerCount || 34}</span>
                <span class="stat-label" style="font-size: 9px; font-weight:800;">Voluntários</span>
            </div>
        </div>
        ` : `
        <div class="stats-dashboard">
            <div class="stat-card">
                <span class="stat-val">🐾 ${posts.length}</span>
                <span class="stat-label">Publicações</span>
            </div>
            <div class="stat-card">
                <span class="stat-val">🐶 ${tutorFollowers}</span>
                <span class="stat-label">Seguidores</span>
            </div>
            <div class="stat-card">
                <span class="stat-val">🐱 ${tutorFollowing}</span>
                <span class="stat-label">Seguindo</span>
            </div>
        </div>
        `}

        <!-- Deck de Pets -->
        <div class="pets-deck-container">
            <div class="section-header">
                <div class="section-title">${deckTitle} <span style="font-size:13px; font-weight:600; color:var(--text-muted);">(${tutorPets.length})</span></div>
            </div>
            <div class="pets-deck-row">
                ${tutorPets.map(pet => {
                    const speciesLower = pet.species.toLowerCase();
                    const speciesEmoji = speciesLower.includes('gato') ? '🐱' : (speciesLower.includes('cão') || speciesLower.includes('cachorro') ? '🐶' : '🐹');
                    const genderEmoji = pet.gender === 'Macho' ? '♂️' : '♀️';
                    return `
                        <div class="pet-card" onclick="togglePetPopover(event, '${pet.id || pet.name}')">
                            <img src="${pet.avatar}" class="pet-card-avatar" alt="${pet.name}">
                            <div class="pet-card-name">${pet.name}</div>
                            <div class="pet-card-sub"><span>${speciesEmoji}</span> ${pet.breed}</div>
                            <button class="pet-details-btn">Ver Detalhes</button>
                            
                            <!-- Popover de detalhes do Pet -->
                            <div id="popover-${pet.id || pet.name}" class="pet-detail-popover">
                                <strong style="font-size: 14px; display:block; text-align:center; color: var(--text-main); margin-bottom: 8px;">${pet.name}</strong>
                                <span style="font-size: 12px; color: var(--text-muted); display:block; margin: 2px 0;">🐾 Espécie: ${speciesEmoji} ${pet.species}</span>
                                <span style="font-size: 12px; color: var(--text-muted); display:block; margin: 2px 0;">🏷️ Raça: ${pet.breed}</span>
                                <span style="font-size: 12px; color: var(--text-muted); display:block; margin: 2px 0;">🎂 Idade: 🎂 ${pet.age} anos</span>
                                ${pet.weight ? `<span style="font-size: 12px; color: var(--text-muted); display:block; margin: 2px 0;">⚖️ Peso: ⚖️ ${pet.weight} Kg</span>` : ''}
                                <span style="font-size: 12px; color: var(--text-muted); display:block; margin: 2px 0;">🧬 Gênero: ${genderEmoji} ${pet.gender}</span>
                                ${pet.description ? `
                                    <div style="font-size: 11px; color: var(--text-main); background: var(--bg-input); padding: 6px; border-radius: 4px; margin-top: 6px; border-left: 3px solid var(--primary); text-align: left; line-height: 1.3;">
                                        <strong>Descrição:</strong> ${pet.description}
                                    </div>
                                ` : ''}
                                ${!profile ? `<span class="remove-pet-link" onclick="removePetFromTutor(event, '${pet.id}')">Remover Pet</span>` : ''}
                                ${profile && profile.type === 'institution' ? `
                                    <button onclick="showToast('Pedido de adoção para ${pet.name} enviado com sucesso! A ONG APAPI entrará em contato via chat em breve. 💚', 'success'); event.stopPropagation();" style="width:100%; background:var(--primary); color:white; border:none; padding:8px; border-radius:var(--border-radius-sm); font-size:11px; font-weight:700; margin-top:10px; cursor:pointer; font-family:inherit;">
                                        Adotar ${pet.name} ❤️
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
                
                ${!profile ? `
                    <div class="pet-card add-new" onclick="openModal('pet-modal')">
                        <span class="add-pet-icon">🐾</span>
                        <div class="pet-card-name" style="font-size:13px; color:var(--text-muted);">Novo Pet</div>
                    </div>
                ` : ''}
            </div>
        </div>

        <!-- Dashboard Administrativo da ONG (Apenas para a ONG Logada) -->
        ${!isVisited && profileType === 'institution' ? `
        <div class="plans-management-container" style="margin-top: 24px; background: linear-gradient(135deg, #f6fdf8, #f0fbf4); border: 1.5px solid #c7ebdb; border-radius: var(--border-radius-md); padding: 22px; text-align: left; box-shadow: 0 8px 24px rgba(46,125,50,0.04); font-family: 'Nunito', sans-serif;">
            <h3 style="font-size:16px; font-weight:800; color:#2e7d32; margin:0 0 14px 0; display:flex; align-items:center; gap:8px;">📊 Painel Administrativo da ONG (Dashboard)</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; margin-bottom: 20px;">
                <div style="background:white; border:1px solid #c7ebdb; padding:10px; border-radius:8px; text-align:center;">
                    <div style="font-size:16px; font-weight:900; color:#2e7d32;">15.4K</div>
                    <div style="font-size:10px; color:var(--text-muted); font-weight:700;">Seguidores</div>
                </div>
                <div style="background:white; border:1px solid #c7ebdb; padding:10px; border-radius:8px; text-align:center;">
                    <div style="font-size:16px; font-weight:900; color:#2e7d32;">4.2K</div>
                    <div style="font-size:10px; color:var(--text-muted); font-weight:700;">Visualizações</div>
                </div>
                <div style="background:white; border:1px solid #c7ebdb; padding:10px; border-radius:8px; text-align:center;">
                    <div style="font-size:16px; font-weight:900; color:#2e7d32;">${tutorPets.length}</div>
                    <div style="font-size:10px; color:var(--text-muted); font-weight:700;">Pets Cadastrados</div>
                </div>
                <div style="background:white; border:1px solid #c7ebdb; padding:10px; border-radius:8px; text-align:center;">
                    <div id="dash-adopt-req-count" style="font-size:16px; font-weight:900; color:#2e7d32;">2</div>
                    <div style="font-size:10px; color:var(--text-muted); font-weight:700;">Pedidos Adoção</div>
                </div>
                <div style="background:white; border:1px solid #c7ebdb; padding:10px; border-radius:8px; text-align:center;">
                    <div style="font-size:16px; font-weight:900; color:#2e7d32;">R$ ${(state.campaignRaised || 14850).toLocaleString('pt-BR')}</div>
                    <div style="font-size:10px; color:var(--text-muted); font-weight:700;">Doações Recebidas</div>
                </div>
                <div style="background:white; border:1px solid #c7ebdb; padding:10px; border-radius:8px; text-align:center;">
                    <div style="font-size:16px; font-weight:900; color:#2e7d32;">0</div>
                    <div style="font-size:10px; color:var(--text-muted); font-weight:700;">Denúncias</div>
                </div>
            </div>
            
            <h4 style="margin: 0 0 10px 0; font-size:13.5px; font-weight:800; color:var(--text-main);">📩 Solicitações de Adoção Pendentes</h4>
            <div id="dash-adopt-requests" style="display:flex; flex-direction:column; gap:8px;">
                <div id="req-1" style="background:white; border:1px solid var(--border-color); padding:12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; font-size:12.5px; box-sizing:border-box;">
                    <div>👤 <strong>Carlos Henrique</strong> tem interesse em adotar <strong>Pipoca</strong> (Cachorro)</div>
                    <button onclick="approveNgoAdoption('req-1', 'Carlos Henrique', 'Pipoca')" style="background:#2e7d32; color:white; border:none; padding:6px 12px; border-radius:20px; font-weight:700; cursor:pointer; font-family:inherit;">Aprovar Pedido ✓</button>
                </div>
                <div id="req-2" style="background:white; border:1px solid var(--border-color); padding:12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; font-size:12.5px; box-sizing:border-box;">
                    <div>👤 <strong>Mariana Silva</strong> tem interesse em adotar <strong>Fumaça</strong> (Gato)</div>
                    <button onclick="approveNgoAdoption('req-2', 'Mariana Silva', 'Fumaça')" style="background:#2e7d32; color:white; border:none; padding:6px 12px; border-radius:20px; font-weight:700; cursor:pointer; font-family:inherit;">Aprovar Pedido ✓</button>
                </div>
            </div>
        </div>
        ` : ''}

        <!-- Gestão de Planos e Assinaturas (Apenas para o Dono do Pet Shop Logado) -->
        ${!isVisited && profileType === 'petshop' ? `
        <div class="plans-management-container" style="margin-top: 24px; background: linear-gradient(135deg, #fbfafd, #f6f0fc); border: 1.5px solid #e1d5f2; border-radius: var(--border-radius-md); padding: 22px; text-align: left; box-shadow: 0 8px 24px rgba(130,10,209,0.04);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                <div>
                    <h3 style="font-size:15px; font-weight:800; color:#820ad1; margin:0 0 6px 0; display:flex; align-items:center; gap:8px;">💎 Assinatura Comercial Conexão PET</h3>
                    <p style="font-size:13.5px; color:#555555; margin:0;">
                        Status do seu plano: <strong style="color: #111111; text-transform: uppercase;">${state.tutor.activePlan || 'Plano Bronze (Grátis)'}</strong>
                    </p>
                    <p style="font-size:12px; color:#777777; margin:4px 0 0 0;">
                        ${state.tutor.activePlan === 'Ultravioleta' ? 'Aproveitando exposição máxima, taxa zero e banner patrocinado!' : (state.tutor.activePlan === 'Pet Gold' ? 'Aproveitando busca regional prioritária e agendamentos ilimitados.' : 'Seu perfil básico está ativo. Faça um upgrade para obter selo de destaque e agendamentos ilimitados.')}
                    </p>
                </div>
                <button onclick="openPlanManagerModal()" style="background: #820ad1; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-size: 13px; font-weight: 800; cursor: pointer; transition: opacity 0.2s; font-family: inherit; box-shadow: 0 4px 10px rgba(130,10,209,0.15);">
                    Mudar ou Assinar Plano ➔
                </button>
            </div>
        </div>
        ` : ''}

        <!-- Serviços (Apenas para Pet Shop) -->
        ${profile && profile.type === 'petshop' ? `
        <div class="services-deck-container" style="margin-top: 24px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 20px;">
            <h3 style="font-size:15px; font-weight:800; color:var(--text-main); margin-top:0; margin-bottom:14px; display:flex; align-items:center; gap:8px;">🧼 Serviços e Tratamentos Disponíveis</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px;">
                ${(profile.services || []).map(s => `
                    <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 12px; display: flex; align-items: center; gap: 12px; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 18px;">${s.icon}</span>
                            <div style="text-align: left;">
                                <div style="font-size: 13px; font-weight: 700; color: var(--text-main);">${s.name}</div>
                                <div style="font-size: 12px; color: var(--primary); font-weight: 800;">${s.price}</div>
                            </div>
                        </div>
                        <button onclick="showToast('Agendamento de ${s.name.replace(/'/g, "\\'")} solicitado com sucesso! Fique atento ao chat do pet shop para confirmação da data. 🐾', 'success')" style="background: var(--primary); color: white; border: none; padding: 6px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; font-family: inherit;">Agendar</button>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Pill Switcher Tab Navigation -->
        <div class="pill-tab-switcher-wrapper">
            <div class="pill-tab-switcher">
                ${profileType === 'institution' ? `
                    <div class="pill-tab ${state.activeProfileTab === 'posts' ? 'active' : ''}" onclick="switchProfileTab('posts')">
                        <span>📸 Feed</span>
                    </div>
                    <div class="pill-tab ${state.activeProfileTab === 'adopt' ? 'active' : ''}" onclick="switchProfileTab('adopt')">
                        <span>🐕 Adoção</span>
                    </div>
                    ${(isVisited && state.tutor && state.tutor.type !== 'institution' && state.tutor.type !== 'petshop') ? `
                    <div class="pill-tab ${state.activeProfileTab === 'donate' ? 'active' : ''}" onclick="switchProfileTab('donate')">
                        <span>Doações 💰</span>
                    </div>
                    <div class="pill-tab ${state.activeProfileTab === 'volunteer' ? 'active' : ''}" onclick="switchProfileTab('volunteer')">
                        <span>Voluntários 👥</span>
                    </div>
                    ` : ''}
                    <div class="pill-tab ${state.activeProfileTab === 'reviews' ? 'active' : ''}" onclick="switchProfileTab('reviews')">
                        <span>Transparência ⭐</span>
                    </div>
                ` : `
                    <div class="pill-tab ${state.activeProfileTab === 'posts' ? 'active' : ''}" onclick="switchProfileTab('posts')">
                        <svg viewBox="0 0 24 24" class="tab-icon"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
                        <span>Publicações</span>
                    </div>
                    <div class="pill-tab ${state.activeProfileTab === 'reels' ? 'active' : ''}" onclick="switchProfileTab('reels')">
                        <svg viewBox="0 0 24 24" class="tab-icon"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" fill="none" stroke="currentColor" stroke-width="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
                        <span>Reels</span>
                    </div>
                    <div class="pill-tab ${state.activeProfileTab === 'marked' ? 'active' : ''}" onclick="switchProfileTab('marked')">
                        <svg viewBox="0 0 24 24" class="tab-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                        <span>Marcados</span>
                    </div>
                `}
            </div>
        </div>

        <!-- Gallery Grid Container -->
        <div class="gallery-grid" id="profile-gallery-container"></div>
    </div>
    `;
    
    container.innerHTML = pHtml;
    
    // Rastro de patinhas caminhando ao passar o mouse pelo banner
    const banner = container.querySelector('.profile-banner-card');
    if (banner) {
        let lastX = 0;
        let lastY = 0;
        let isLeftPaw = true;
        const minDistance = 32; // Distância mínima em pixels para criar uma nova patinha

        banner.addEventListener('mousemove', (e) => {
            const rect = banner.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const dist = Math.hypot(x - lastX, y - lastY);
            if (dist > minDistance) {
                const paw = document.createElement('span');
                paw.className = 'profile-floating-paw';
                paw.innerText = '🐾';
                paw.style.left = `${x}px`;
                paw.style.top = `${y}px`;
                
                // Deslocamento para as laterais e rotação alternada para parecer passos reais
                const offset = isLeftPaw ? -12 : 12;
                const rotation = isLeftPaw ? -20 : 20;
                paw.style.transform = `translate(calc(-50% + ${offset}px), -50%) rotate(${rotation}deg)`;
                
                banner.appendChild(paw);
                
                isLeftPaw = !isLeftPaw;
                lastX = x;
                lastY = y;
                
                setTimeout(() => {
                    paw.remove();
                }, 1200);
            }
        });
    }

    // Inicializar aba ativa do perfil
    if (!state.activeProfileTab) {
        state.activeProfileTab = 'posts';
    }
    updateProfileGallery();
}

function togglePetPopover(event, petId) {
    event.stopPropagation();
    document.querySelectorAll('.pet-detail-popover').forEach(pop => {
        if (pop.id !== `popover-${petId}`) {
            pop.style.display = 'none';
        }
    });
    
    const popover = document.getElementById(`popover-${petId}`);
    if (popover) {
        if (popover.style.display === 'flex') {
            popover.style.display = 'none';
        } else {
            popover.style.display = 'flex';
        }
    }
}

// Fechar popover se clicar em qualquer outro lugar do documento
document.addEventListener('click', () => {
    document.querySelectorAll('.pet-detail-popover').forEach(pop => {
        pop.style.display = 'none';
    });
});

function openEditProfileModal() {
    document.getElementById('profile-edit-name').value = state.tutor.name;
    document.getElementById('profile-edit-location').value = state.tutor.location;
    document.getElementById('profile-edit-bio').value = state.tutor.bio;
    
    // Pré-selecionar o avatar atual do tutor
    const avatarRadio = document.querySelector(`input[name="profile-avatar-choice"][value="${state.tutor.avatar}"]`);
    if (avatarRadio) {
        avatarRadio.checked = true;
    }
    
    openModal('edit-profile-modal');
}

function saveTutorProfileChanges() {
    const nameVal = document.getElementById('profile-edit-name').value.trim();
    const locVal = document.getElementById('profile-edit-location').value.trim();
    const bioVal = document.getElementById('profile-edit-bio').value.trim();
    const avatarVal = document.querySelector('input[name="profile-avatar-choice"]:checked')?.value || state.tutor.avatar;
    
    if (nameVal !== '' && locVal !== '') {
        state.tutor.name = nameVal;
        state.tutor.location = locVal;
        state.tutor.bio = bioVal;
        state.tutor.avatar = avatarVal;
        saveStateToLocalStorage();
        updateGlobalUIHeaders();
        closeModal(document.getElementById('edit-profile-modal'));
        showToast('Perfil de tutor atualizado com sucesso!', 'success');
        renderCurrentTab('profile');
    }
}

// ========================================================
// INSTAGRAM STYLE SETTINGS ACTIONS
// ========================================================

function openSettingsModal() {
    openModal('settings-modal');
}

function openSettingsDetailsModal() {
    closeModal(document.getElementById('settings-modal'));
    openModal('settings-details-modal');
    // Load default tab (sua-conta)
    switchSettingsDetailTab('sua-conta');
    
    // Clear search field
    const searchField = document.getElementById('ig-settings-search-field');
    if (searchField) {
        searchField.value = '';
        filterIgSettings('');
    }
}

function switchSettingsDetailTab(tabId) {
    const contents = document.querySelectorAll('.ig-settings-tab-content');
    contents.forEach(c => c.classList.remove('active'));
    
    const items = document.querySelectorAll('.ig-settings-nav-item');
    items.forEach(i => i.classList.remove('active'));
    
    const targetContent = document.getElementById(`ig-settings-tab-${tabId}`);
    if (targetContent) targetContent.classList.add('active');
    
    const targetBtn = document.querySelector(`.ig-settings-nav-item[onclick*="${tabId}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    
    // Prefill form controls according to active tab
    if (tabId === 'como-usa') {
        state.tutor.notifications = state.tutor.notifications || { likes: true, comments: true, messages: true, sos: true };
        document.getElementById('notify-likes').checked = (state.tutor.notifications.likes !== false);
        document.getElementById('notify-comments').checked = (state.tutor.notifications.comments !== false);
        document.getElementById('notify-messages').checked = (state.tutor.notifications.messages !== false);
        document.getElementById('notify-sos').checked = (state.tutor.notifications.sos !== false);
    } 
    else if (tabId === 'quem-ve') {
        document.getElementById('privacy-private-account').checked = !!state.tutor.privateAccount;
    } 
    else if (tabId === 'interagir') {
        document.getElementById('privacy-activity-status').checked = (state.tutor.showActivityStatus !== false);
    } 
    else if (tabId === 'app-midias') {
        const toggleBtn = document.getElementById('settings-detail-toggle-theme');
        if (toggleBtn) toggleBtn.checked = (state.theme === 'dark');
    }
}

function filterIgSettings(query) {
    const q = (query || '').toLowerCase().trim();
    const items = document.querySelectorAll('.ig-settings-nav-item');
    
    items.forEach(item => {
        const keywords = item.getAttribute('data-search') || '';
        const label = item.textContent.toLowerCase();
        
        if (!q || keywords.includes(q) || label.includes(q)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function submitSettingsProblemDetail() {
    const details = document.getElementById('report-problem-details-detail').value.trim();
    if (!details) return;
    
    const newReport = {
        id: `rep-${Date.now()}`,
        type: 'Feedback do Usuário',
        target: 'Aplicativo',
        details: details,
        status: 'Recebido',
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    state.reports = state.reports || [];
    state.reports.push(newReport);
    saveStateToLocalStorage();
    
    document.getElementById('report-problem-details-detail').value = '';
    closeModal(document.getElementById('settings-details-modal'));
    
    showToast('Problema relatado com sucesso! Obrigado pelo feedback.', 'success');
}

function resetAppDatabaseFromDetails() {
    closeModal(document.getElementById('settings-details-modal'));
    resetAppDatabase();
}

function toggleThemeFromSettingsMenu() {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    state.theme = nextTheme;
    
    document.body.classList.toggle('dark-mode', nextTheme === 'dark');
    updateThemeUIElements();
    
    const settingsToggle = document.getElementById('settings-toggle-theme');
    if (settingsToggle) settingsToggle.checked = (nextTheme === 'dark');
    
    saveStateToLocalStorage();
    showToast(nextTheme === 'dark' ? 'Modo Escuro ativado! 🌙' : 'Modo Claro ativado! ☀️', 'success');
}

function openSavedItemsModal() {
    closeModal(document.getElementById('settings-modal'));
    
    const container = document.getElementById('settings-saved-list');
    container.innerHTML = '';
    
    const savedReels = state.reels.filter(r => r.saved);
    
    if (savedReels.length > 0) {
        const grid = document.createElement('div');
        grid.className = 'saved-items-grid';
        
        savedReels.forEach(r => {
            const card = document.createElement('div');
            card.className = 'saved-item-card';
            card.setAttribute('onclick', `watchSavedReel('${r.id}')`);
            card.innerHTML = `
                <img src="${r.image}" alt="Saved video thumbnail">
                <div class="saved-item-overlay">
                    <span>❤️</span> ${r.likes}
                </div>
            `;
            grid.appendChild(card);
        });
        
        container.appendChild(grid);
    } else {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 0; color: var(--text-muted);">
                <div style="font-size: 48px; margin-bottom: 12px;">🔖</div>
                <p style="font-size: 14.5px; font-weight: 600; margin-bottom: 4px;">Nenhum item salvo</p>
                <p style="font-size: 12px; color: var(--text-muted);">Toque no ícone de salvar em um Reel para guardá-lo aqui.</p>
            </div>
        `;
    }
    
    openModal('settings-saved-modal');
}

function watchSavedReel(reelId) {
    closeModal(document.getElementById('settings-saved-modal'));
    
    renderCurrentTab('reels');
    
    setTimeout(() => {
        const targetElement = document.getElementById(`tiktok-item-${reelId}`);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            showToast('Focando no Reel salvo! 🔖🐾', 'success');
        }
    }, 150);
}

function openSavedActivityModal() {
    closeModal(document.getElementById('settings-modal'));
    openModal('settings-activity-modal');
    
    // Switch to default section and subtab
    switchActivitySection('interacoes');
    switchActivitySubtab('curtidas');
    
    // Seed default history if not exists
    if (!state.accountHistory) {
        state.accountHistory = [
            { title: 'Conta Criada', desc: 'Sua conta @carloshenrique foi criada no Conexão Pet.', time: '10 de Junho de 2026' },
            { title: 'Primeiro Pet Cadastrado', desc: 'Você cadastrou o pet Rex (Golden Retriever).', time: '11 de Junho de 2026' },
            { title: 'Segundo Pet Cadastrado', desc: 'Você cadastrou o pet Mel (Persa).', time: '12 de Junho de 2026' },
            { title: 'Entrou no Modo Escuro', desc: 'Você ativou a exibição em Modo Escuro.', time: 'Hoje' }
        ];
    }
}

function switchActivitySection(sectionId) {
    const navItems = document.querySelectorAll('.ig-activity-nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(sectionId)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    const sections = document.querySelectorAll('.ig-activity-section');
    sections.forEach(sec => {
        if (sec.id === `ig-activity-section-${sectionId}`) {
            sec.classList.add('active');
            sec.style.display = 'flex';
        } else {
            sec.classList.remove('active');
            sec.style.display = 'none';
        }
    });
    
    if (sectionId === 'interacoes') {
        const activeSubtab = document.querySelector('.ig-activity-subtab.active');
        if (activeSubtab) {
            const subtabId = activeSubtab.getAttribute('onclick').match(/'([^']+)'/)[1];
            switchActivitySubtab(subtabId);
        }
    } else if (sectionId === 'fotos-videos') {
        loadActivityMyPosts();
    } else if (sectionId === 'historico') {
        loadActivityHistory();
    }
}

function switchActivitySubtab(subtabId) {
    const subtabs = document.querySelectorAll('.ig-activity-subtab');
    subtabs.forEach(tab => {
        if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(subtabId)) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    const subpanels = document.querySelectorAll('.ig-activity-subpanel');
    subpanels.forEach(pan => {
        if (pan.id === `ig-activity-subpanel-${subtabId}`) {
            pan.classList.add('active');
            pan.style.display = 'block';
        } else {
            pan.classList.remove('active');
            pan.style.display = 'none';
        }
    });
    
    if (subtabId === 'curtidas') {
        loadActivityLikes();
    } else if (subtabId === 'comentarios') {
        loadActivityComments();
    }
}

function loadActivityLikes() {
    const grid = document.getElementById('ig-activity-likes-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const likedReels = state.reels.filter(r => r.liked);
    const likedPosts = state.feed.filter(p => p.liked);
    
    if (likedReels.length === 0 && likedPosts.length === 0) {
        grid.parentNode.innerHTML = '<p class="empty-text" id="ig-activity-likes-grid">Você ainda não curtiu nenhuma publicação ou Reel.</p>';
        return;
    }
    
    const items = [];
    likedReels.forEach(r => items.push({ type: 'reel', id: r.id, image: r.image, likes: r.likes }));
    likedPosts.forEach(p => items.push({ type: 'post', id: p.id, image: p.image || p.authorAvatar, likes: p.likes }));
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'ig-activity-grid-card';
        card.onclick = () => {
            closeModal(document.getElementById('settings-activity-modal'));
            if (item.type === 'reel') {
                renderCurrentTab('reels');
                setTimeout(() => {
                    const el = document.getElementById(`tiktok-item-${item.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
            } else {
                renderCurrentTab('feed');
                setTimeout(() => {
                    const el = document.getElementById(item.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
            }
        };
        card.innerHTML = `
            <img src="${item.image}" alt="Liked item preview">
            <span class="ig-activity-grid-badge">${item.type === 'reel' ? '🎬 Reel' : '📷 Post'}</span>
        `;
        grid.appendChild(card);
    });
}

function loadActivityComments() {
    const list = document.getElementById('ig-activity-comments-list');
    if (!list) return;
    list.innerHTML = '';
    
    const myComments = [];
    
    state.feed.forEach(post => {
        if (post.comments) {
            post.comments.forEach(c => {
                if (c.author === state.tutor.name) {
                    myComments.push({ type: 'post', parentId: post.id, text: c.text, parentAuthor: post.authorName });
                }
            });
        }
    });
    
    state.reels.forEach(reel => {
        if (reel.comments) {
            reel.comments.forEach(c => {
                if (c.author === state.tutor.name) {
                    myComments.push({ type: 'reel', parentId: reel.id, text: c.text, parentAuthor: reel.authorName });
                }
            });
        }
    });
    
    if (myComments.length === 0) {
        list.innerHTML = '<p class="empty-text">Você ainda não comentou em nenhuma publicação ou Reel.</p>';
        return;
    }
    
    myComments.forEach(comment => {
        const row = document.createElement('div');
        row.className = 'ig-activity-comment-row';
        row.onclick = () => {
            closeModal(document.getElementById('settings-activity-modal'));
            if (comment.type === 'reel') {
                renderCurrentTab('reels');
                setTimeout(() => {
                    const el = document.getElementById(`tiktok-item-${comment.parentId}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
            } else {
                renderCurrentTab('feed');
                setTimeout(() => {
                    const el = document.getElementById(comment.parentId);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
            }
        };
        row.innerHTML = `
            <div class="ig-activity-comment-details">
                <strong>Você comentou:</strong> "${comment.text}"
                <div class="ig-activity-comment-meta">No ${comment.type === 'reel' ? 'Reel' : 'Post'} de @${comment.parentAuthor}</div>
            </div>
        `;
        list.appendChild(row);
    });
}

function loadActivityMyPosts() {
    const grid = document.getElementById('ig-activity-my-posts-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const myShared = state.feed.filter(p => p.authorName.includes('Rex') || p.authorName.includes('Mel'));
    
    if (myShared.length === 0) {
        grid.parentNode.innerHTML = '<p class="empty-text" id="ig-activity-my-posts-grid">Você ainda não compartilhou nenhuma foto ou vídeo.</p>';
        return;
    }
    
    myShared.forEach(post => {
        const card = document.createElement('div');
        card.className = 'ig-activity-grid-card';
        card.onclick = () => {
            closeModal(document.getElementById('settings-activity-modal'));
            renderCurrentTab('feed');
            setTimeout(() => {
                const el = document.getElementById(post.id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        };
        card.innerHTML = `
            <img src="${post.image || post.authorAvatar}" alt="Shared item preview">
            <span class="ig-activity-grid-badge">📷 Post</span>
        `;
        grid.appendChild(card);
    });
}

function loadActivityHistory() {
    const list = document.getElementById('ig-activity-history-list');
    if (!list) return;
    list.innerHTML = '';
    
    if (state.accountHistory && state.accountHistory.length > 0) {
        state.accountHistory.forEach(log => {
            const item = document.createElement('div');
            item.className = 'ig-activity-history-item';
            item.innerHTML = `
                <strong>${log.title}</strong>
                <span>${log.desc} &nbsp;·&nbsp; ${log.time}</span>
            `;
            list.appendChild(item);
        });
    } else {
        list.innerHTML = '<p class="empty-text">Nenhum histórico disponível.</p>';
    }
}

function openSettingsSubModal(subType) {
    // Fechar o menu de configurações principal primeiro
    closeModal(document.getElementById('settings-modal'));
    
    // Abrir o sub-modal correto com sincronização de estados
    if (subType === 'alterar-senha') {
        document.getElementById('settings-password-form').reset();
        openModal('settings-password-modal');
    } 
    else if (subType === 'codigo-qr') {
        const username = state.tutor.name.toLowerCase().replace(/\s+/g, '');
        document.getElementById('qr-username-label').innerText = `@${username}`;
        openModal('settings-qr-modal');
    } 
    else if (subType === 'notificacoes') {
        // Garantir que as preferências existam no estado
        state.tutor.notifications = state.tutor.notifications || { likes: true, comments: true, messages: true, sos: true };
        
        document.getElementById('notify-likes').checked = (state.tutor.notifications.likes !== false);
        document.getElementById('notify-comments').checked = (state.tutor.notifications.comments !== false);
        document.getElementById('notify-messages').checked = (state.tutor.notifications.messages !== false);
        document.getElementById('notify-sos').checked = (state.tutor.notifications.sos !== false);
        
        openModal('settings-notifications-modal');
    } 
    else if (subType === 'privacidade-seguranca') {
        document.getElementById('privacy-private-account').checked = (state.tutor.privateAccount || false);
        document.getElementById('privacy-activity-status').checked = (state.tutor.activityStatusShow !== false);
        
        // Sincronizar o switch de modo escuro da aba privacidade
        const themeToggle = document.getElementById('settings-toggle-theme');
        if (themeToggle) {
            themeToggle.checked = (state.theme === 'dark');
        }
        
        openModal('settings-privacy-modal');
    } 
    else if (subType === 'supervisao') {
        openModal('settings-supervision-modal');
    } 
    else if (subType === 'atividade-login') {
        openModal('settings-login-activity-modal');
    } 
    else if (subType === 'relatar-problema') {
        document.getElementById('settings-report-form').reset();
        openModal('settings-report-modal');
    }
}

function changePasswordSettings() {
    const curPass = document.getElementById('password-current').value;
    const newPass = document.getElementById('password-new').value;
    const confPass = document.getElementById('password-confirm').value;
    
    if (newPass !== confPass) {
        showToast('A nova senha e a confirmação não conferem!', 'warning');
        return;
    }
    
    showToast('Senha alterada com sucesso! 🔒', 'success');
    closeModal(document.getElementById('settings-password-modal'));
}

function saveNotificationPreferences() {
    state.tutor.notifications = {
        likes: document.getElementById('notify-likes').checked,
        comments: document.getElementById('notify-comments').checked,
        messages: document.getElementById('notify-messages').checked,
        sos: document.getElementById('notify-sos').checked
    };
    
    saveStateToLocalStorage();
    showToast('Preferências de notificação salvas!', 'success');
    closeModal(document.getElementById('settings-notifications-modal'));
}

function savePrivacyPreferences() {
    state.tutor.privateAccount = document.getElementById('privacy-private-account').checked;
    state.tutor.activityStatusShow = document.getElementById('privacy-activity-status').checked;
    
    saveStateToLocalStorage();
    showToast('Alterações de privacidade salvas com sucesso!', 'success');
    closeModal(document.getElementById('settings-privacy-modal'));
}

function submitSettingsProblem() {
    const details = document.getElementById('report-problem-details').value;
    showToast('Obrigado! Seu relatório de problemas foi enviado para análise. 📩', 'success');
    closeModal(document.getElementById('settings-report-modal'));
}

function handleLogoutSettings() {
    if (confirm('Deseja realmente sair da sua conta?')) {
        closeModal(document.getElementById('settings-modal'));
        showToast('Saindo da conta... Até logo! 👋', 'secondary');
        
        setTimeout(() => {
            localStorage.removeItem('conexaopet_state');
            location.reload();
        }, 1200);
    }
}

async function toggleThemeFromSettings(isDark) {
    const theme = isDark ? 'dark' : 'light';
    state.theme = theme;
    document.body.classList.toggle('dark-mode', isDark);
    
    // Sync theme to server
    try {
        await fetch('/api/state/theme', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme })
        });
    } catch (e) {
        console.error('Failed to sync theme to server', e);
    }
    
    // Sync to local storage
    localStorage.setItem('conexaopet_state', JSON.stringify(state));
    
    // Update theme toggle UI elements (like the sidebar text/icon)
    updateThemeUIElements();
    
    showToast(`Modo ${isDark ? 'Escuro' : 'Claro'} ativado!`, 'success');
}

async function resetAppDatabase() {
    if (confirm('⚠️ Tem certeza de que deseja restaurar os dados de fábrica? Isso limpará todas as suas publicações, registros de saúde, novos pets adicionados e configurações.')) {
        try {
            const response = await fetch('/api/state/reset', {
                method: 'POST'
            });
            if (response.ok) {
                localStorage.removeItem('conexaopet_state');
                showToast('Banco de dados restaurado com sucesso! Recarregando...', 'success');
                setTimeout(() => {
                    location.reload();
                }, 1500);
            } else {
                showToast('Erro ao redefinir banco de dados no servidor.', 'warning');
            }
        } catch (err) {
            console.error('Failed to reset app state on server', err);
            // Fallback: local reset
            localStorage.removeItem('conexaopet_state');
            showToast('Reset local realizado. Recarregando...', 'success');
            setTimeout(() => {
                location.reload();
            }, 1500);
        }
    }
}


function removePetFromTutor(event, petId) {
    if (event) event.stopPropagation();
    if (state.pets.length <= 1) {
        showToast('Você deve manter pelo menos um pet cadastrado!', 'warning');
        return;
    }
    
    if (confirm('Tem certeza de que deseja remover este pet? Todos os históricos de saúde associados serão apagados.')) {
        state.pets = state.pets.filter(p => p.id !== petId);
        saveStateToLocalStorage();
        updateGlobalUIHeaders();
        showToast('Pet removido com sucesso!', 'success');
        renderCurrentTab('profile');
    }
}

function openPhotoDetail(postId) {
    navigateToTab('feed');
    setTimeout(() => {
        const postElement = document.getElementById(postId);
        if (postElement) {
            postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            postElement.style.boxShadow = '0 0 20px rgba(107, 33, 168, 0.5)';
            setTimeout(() => {
                postElement.style.boxShadow = '';
            }, 2000);
        }
    }, 100);
}

function updateProfileGallery() {
    const container = document.getElementById('profile-gallery-container');
    if (!container) return;
    
    let tab = state.activeProfileTab || 'posts';
    const isVisited = state.visitedProfile && state.visitedProfile !== 'carlos';
    const profile = isVisited ? PROFILES.find(p => p.id === state.visitedProfile) : null;
    const authorName = profile ? profile.name : null;
    const profileType = profile ? (profile.type || 'tutor') : (state.tutor.type || 'tutor');
    
    // Se for o próprio perfil da ONG visualizando ou outro perfil comercial visitando, não permitir as abas donate e volunteer
    if (profileType === 'institution' && (!isVisited || (state.tutor && (state.tutor.type === 'institution' || state.tutor.type === 'petshop')))) {
        if (tab === 'donate' || tab === 'volunteer') {
            tab = 'posts';
            state.activeProfileTab = 'posts';
        }
    }
    
    if (profileType === 'institution' || profileType === 'petshop') {
        if (tab === 'posts') {
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(3, 1fr)';
            container.style.gap = '8px';
        } else {
            container.style.display = 'block';
        }
    } else {
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
        container.style.gap = '20px';
    }
    
    if (profileType === 'institution' && tab === 'adopt') {
        const shelterPets = profile ? (profile.pets || []) : (state.pets || []);
        if (shelterPets.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <p style="font-size: 16px; font-weight: 600;">Nenhum animal cadastrado para adoção.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div style="padding: 20px 0; animation: fadeInView 0.3s ease-out;">
                <h3 style="font-size: 16px; font-weight: 800; color: var(--text-main); margin-bottom: 8px; text-align: left; display:flex; align-items:center; gap:8px;">🐕 Área de Adoção Responsável</h3>
                <p style="font-size: 13.5px; color: var(--text-muted); margin-top:0; margin-bottom: 24px; text-align: left;">
                    Encontre o seu novo melhor amigo. Todos os pets das ONGs parceiras do Conexão PET são pré-avaliados, vacinados e prontos para receber amor.
                </p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                    ${shelterPets.map(pet => {
                        const genderBadge = pet.gender === 'Macho' ? '♂️ Macho' : '♀️ Fêmea';
                        return `
                            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; flex-direction: column; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                                <img src="${pet.avatar}" style="width: 100%; height: 180px; object-fit: cover;" alt="${pet.name}">
                                <div style="padding: 16px; text-align: left; display: flex; flex-direction: column; flex: 1;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                        <h4 style="margin: 0; font-size: 18px; font-weight: 800; color: var(--text-main);">${pet.name}</h4>
                                        <span style="background: var(--bg-input); padding: 4px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; color: var(--primary);">${genderBadge}</span>
                                    </div>
                                    
                                    <div style="font-size: 12.5px; color: var(--text-muted); display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px;">
                                        <span>🐾 <strong>Espécie / Raça:</strong> ${pet.species} • ${pet.breed}</span>
                                        <span>🎂 <strong>Idade / Porte:</strong> ${pet.age} ${pet.age === 1 ? 'ano' : 'anos'} • ${pet.weight && pet.weight > 10 ? 'Médio/Grande' : 'Pequeno'}</span>
                                        <span>⏱️ <strong>Tempo no abrigo:</strong> 2 meses</span>
                                        <span>📍 <strong>Localização:</strong> ${profile ? profile.location : 'Piracicaba, SP'}</span>
                                    </div>
                                    
                                    <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px;">
                                        <span style="background: #e8f5e9; color: #2e7d32; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 800;">Castrado ✓</span>
                                        <span style="background: #e8f5e9; color: #2e7d32; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 800;">Vacinado ✓</span>
                                        <span style="background: #e8f5e9; color: #2e7d32; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 800;">Vermifugado ✓</span>
                                    </div>
                                    
                                    <div style="font-size: 12px; color: var(--text-main); background: var(--bg-input); padding: 8px; border-radius: 6px; line-height: 1.3; margin-bottom: 16px; flex: 1;">
                                        <strong>Temperamento:</strong> Brincalhão, carinhoso, ideal para crianças. <br>
                                        <strong>Necessidades especiais:</strong> Nenhuma.
                                    </div>
                                    
                                    <div style="display: flex; gap: 6px; margin-top: auto;">
                                        <button onclick="startAdoptionFlow('${pet.name}', '${pet.avatar}')" style="flex: 1.5; background: var(--primary); color: white; border: none; padding: 10px; border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer; font-family: inherit;">
                                            ❤️ Tenho Interesse
                                        </button>
                                        <button onclick="showToast('Abrindo contato com o responsável legal...', 'info')" style="flex: 1; background: var(--bg-input); border: 1px solid var(--border-color); color: var(--text-main); padding: 10px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit;">
                                            📨 Contato
                                        </button>
                                        <button onclick="showToast('Adicionado aos favoritos! ⭐', 'success')" style="background: var(--bg-input); border: 1px solid var(--border-color); color: #f1c40f; padding: 10px; border-radius: 8px; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                            ★
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    } else if (profileType === 'institution' && tab === 'donate') {
        if (!state.campaignRaised) {
            state.campaignRaised = 14850;
        }
        const raised = state.campaignRaised;
        const target = 20000;
        const pct = Math.min(100, Math.round((raised / target) * 100));
        
        container.innerHTML = `
            <div style="padding: 20px 0; text-align: left; animation: fadeInView 0.3s ease-out;">
                <h3 style="font-size: 16px; font-weight: 800; color: var(--text-main); margin-bottom: 16px; display:flex; align-items:center; gap:8px;">💰 Área de Doações & Campanhas</h3>
                
                <div style="background: linear-gradient(135deg, #fbfafd, #f6f0fc); border: 1.5px solid #e1d5f2; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(130,10,209,0.02);">
                    <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #820ad1; background: rgba(130, 10, 209, 0.08); padding: 3px 8px; border-radius: 4px; letter-spacing: 0.5px; display: inline-block; margin-bottom: 12px;">Campanha Ativa</div>
                    <h4 style="margin: 0 0 6px 0; font-size: 18px; font-weight: 800; color: var(--text-main);">Construção de novo canil</h4>
                    <p style="font-size: 13px; color: var(--text-muted); margin: 0 0 16px 0;">Campanha para abrigar mais 15 animais resgatados das ruas.</p>
                    
                    <div style="display: flex; justify-content: space-between; font-size: 13.5px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
                        <span>Arrecadado: R$ ${raised.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                        <span>Meta: R$ ${target.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                    </div>
                    
                    <div style="width: 100%; height: 16px; background: #e0e0e0; border-radius: 10px; overflow: hidden; margin-bottom: 8px; position: relative;">
                        <div id="campaign-progress-bar" style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #820ad1, #a872e6); transition: width 0.5s ease-out; border-radius: 10px;"></div>
                    </div>
                    <div style="font-size: 12.5px; font-weight: 800; color: #820ad1;">${pct}% concluído</div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; flex-wrap: wrap;">
                    
                    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
                        <h4 style="margin-top:0; margin-bottom:16px; font-size: 15px; font-weight: 800; color: var(--text-main);">Fazer uma Doação</h4>
                        
                        <div style="display: flex; gap: 10px; margin-bottom: 16px;">
                            <button id="don-pix" onclick="toggleDonMethod('pix')" style="flex:1; padding: 10px; background: #f6f0fc; border: 2px solid #820ad1; color: #820ad1; border-radius: 8px; font-weight: 700; cursor: pointer; font-family: inherit; font-size: 12.5px;">PIX</button>
                            <button id="don-card" onclick="toggleDonMethod('card')" style="flex:1; padding: 10px; background: white; border: 1px solid #d3d3d3; color: #666666; border-radius: 8px; font-weight: 700; cursor: pointer; font-family: inherit; font-size: 12.5px;">Cartão</button>
                            <button id="don-trans" onclick="toggleDonMethod('trans')" style="flex:1; padding: 10px; background: white; border: 1px solid #d3d3d3; color: #666666; border-radius: 8px; font-weight: 700; cursor: pointer; font-family: inherit; font-size: 12.5px;">Transferência</button>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <label style="font-size: 12px; font-weight:700; color:var(--text-muted); display:block; margin-bottom: 6px;">Selecione o valor:</label>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                                <button onclick="setDonValue(10)" style="padding: 6px 12px; border:1px solid var(--border-color); border-radius: 20px; font-size: 12.5px; background: var(--bg-input); color:var(--text-main); font-weight:700; cursor:pointer;">R$ 10</button>
                                <button onclick="setDonValue(20)" style="padding: 6px 12px; border:1px solid var(--border-color); border-radius: 20px; font-size: 12.5px; background: var(--bg-input); color:var(--text-main); font-weight:700; cursor:pointer;">R$ 20</button>
                                <button onclick="setDonValue(50)" style="padding: 6px 12px; border:1px solid var(--border-color); border-radius: 20px; font-size: 12.5px; background: var(--bg-input); color:var(--text-main); font-weight:700; cursor:pointer;">R$ 50</button>
                                <button onclick="setDonValue(100)" style="padding: 6px 12px; border:1px solid var(--border-color); border-radius: 20px; font-size: 12.5px; background: var(--bg-input); color:var(--text-main); font-weight:700; cursor:pointer;">R$ 100</button>
                            </div>
                            <input type="number" id="don-value-input" value="50" style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 14px; outline: none; background: var(--bg-input); color: var(--text-main); font-family: inherit;" placeholder="Outro valor (R$)">
                        </div>
                        
                        <div id="don-pix-content" style="display:block; text-align:center; padding: 12px; background: var(--bg-input); border-radius: 8px; margin-bottom: 16px;">
                            <div style="font-size:12px; color:var(--text-muted); margin-bottom: 6px;">Chave CNPJ da ONG: 12.345.678/0001-99</div>
                            <button onclick="showToast('Chave PIX copiada!', 'success')" style="background:#fff; border:1px solid #ccc; font-size:11px; padding:4px 8px; border-radius:4px; font-weight:700; cursor:pointer;">Copiar Código Pix</button>
                        </div>
                        
                        <div id="don-card-content" style="display:none; flex-direction:column; gap: 8px; margin-bottom: 16px;">
                            <input type="text" placeholder="Nome no Cartão" style="width:100%; box-sizing:border-box; padding:10px; border:1px solid var(--border-color); border-radius:8px; font-size:13px; background:var(--bg-input); color:var(--text-main);">
                            <input type="text" placeholder="0000 0000 0000 0000" style="width:100%; box-sizing:border-box; padding:10px; border:1px solid var(--border-color); border-radius:8px; font-size:13px; background:var(--bg-input); color:var(--text-main);">
                        </div>
                        
                        <div id="don-trans-content" style="display:none; padding:12px; background:var(--bg-input); border-radius:8px; font-size:12px; color:var(--text-main); margin-bottom: 16px;">
                            <strong>Banco do Brasil:</strong> Agência 1234-5 • Conta 67890-1 <br>
                            <strong>Razão Social:</strong> Associação Protetora dos Animais (APAPI)
                        </div>
                        
                        <button onclick="simulateDonationSubmit()" style="width:100%; padding: 12px; background: #820ad1; color: white; border: none; font-size: 13.5px; font-weight: 800; border-radius: 8px; cursor: pointer; font-family: inherit;">
                            Enviar Doação 💜
                        </button>
                    </div>
                    
                    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
                        <h4 style="margin-top:0; margin-bottom:12px; font-size: 15px; font-weight: 800; color: var(--text-main);">Doação de Materiais</h4>
                        <p style="font-size: 12.5px; color: var(--text-muted); margin: 0 0 16px 0;">Precisamos constantemente de suprimentos para o abrigo. Marque o que você pode doar:</p>
                        
                        <div style="display:flex; flex-direction:column; gap:10px; font-size: 13px; color:var(--text-main);">
                            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" onchange="pledgeMaterial('Ração')" style="width:16px; height:16px;"> 📦 Ração para Cães/Gatos</label>
                            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" onchange="pledgeMaterial('Medicamentos')" style="width:16px; height:16px;"> 💊 Medicamentos (Vermífugos, anti-pulgas)</label>
                            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" onchange="pledgeMaterial('Cobertores')" style="width:16px; height:16px;"> 🛌 Cobertores e Caminhas</label>
                            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" onchange="pledgeMaterial('Brinquedos')" style="width:16px; height:16px;"> 🧸 Brinquedos e Acessórios</label>
                            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" onchange="pledgeMaterial('Produtos de Limpeza')" style="width:16px; height:16px;"> 🧼 Desinfetantes e Detergentes</label>
                        </div>
                        
                        <div style="margin-top: 20px; font-size:12px; color: var(--text-muted); background:var(--bg-input); padding: 10px; border-radius: 6px; line-height: 1.4;">
                            📍 <strong>Onde entregar:</strong> Rua dos Animais, 123, Bairro Centro, Piracicaba - SP. <br>
                            🕰️ Horário: 8h às 18h.
                        </div>
                    </div>
                    
                </div>
            </div>
        `;
    } else if (profileType === 'institution' && tab === 'volunteer') {
        container.innerHTML = `
            <div style="padding: 20px 0; text-align: left; animation: fadeInView 0.3s ease-out;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; flex-wrap: wrap;">
                    
                    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
                        <h3 style="margin-top:0; margin-bottom:8px; font-size: 16px; font-weight: 800; color: var(--text-main);">👥 Área de Voluntários</h3>
                        <p style="font-size: 13px; color: var(--text-muted); margin: 0 0 16px 0;">Seja a mudança na vida de um pet resgatado. Escolha as atividades abaixo para se cadastrar:</p>
                        
                        <form onsubmit="handleVolunteerSubmit(event)" style="display:flex; flex-direction:column; gap:12px;">
                            <div style="display:flex; flex-direction:column; gap:8px; font-size:13px; color:var(--text-main);">
                                <label style="display:flex; align-items:center; gap:8px;"><input type="checkbox" name="job" value="Passear" checked style="width:16px; height:16px;"> 🐕 Passear com animais</label>
                                <label style="display:flex; align-items:center; gap:8px;"><input type="checkbox" name="job" value="Eventos" style="width:16px; height:16px;"> 📅 Ajudar em feiras e bazares</label>
                                <label style="display:flex; align-items:center; gap:8px;"><input type="checkbox" name="job" value="Fotografia" style="width:16px; height:16px;"> 📸 Fotografar pets para adoção</label>
                                <label style="display:flex; align-items:center; gap:8px;"><input type="checkbox" name="job" value="Transporte" style="width:16px; height:16px;"> 🚗 Transporte de ração/animais</label>
                                <label style="display:flex; align-items:center; gap:8px;"><input type="checkbox" name="job" value="LarTemporario" style="width:16px; height:16px;"> 🏠 Oferecer lar temporário</label>
                                <label style="display:flex; align-items:center; gap:8px;"><input type="checkbox" name="job" value="Limpeza" style="width:16px; height:16px;"> 🧼 Auxiliar na limpeza do abrigo</label>
                                <label style="display:flex; align-items:center; gap:8px;"><input type="checkbox" name="job" value="Campanhas" style="width:16px; height:16px;"> 💰 Trabalhar em campanhas de doação</label>
                            </div>
                            
                            <div style="display:flex; flex-direction:column; gap:4px; margin-top: 8px;">
                                <label style="font-size:11px; font-weight:700; color:var(--text-muted);">Nome Completo</label>
                                <input type="text" id="vol-name" required style="padding:10px; border:1px solid var(--border-color); border-radius:8px; font-size:13px; background:var(--bg-input); color:var(--text-main); font-family:inherit;">
                            </div>
                            <div style="display:flex; flex-direction:column; gap:4px;">
                                <label style="font-size:11px; font-weight:700; color:var(--text-muted);">E-mail</label>
                                <input type="email" id="vol-email" required style="padding:10px; border:1px solid var(--border-color); border-radius:8px; font-size:13px; background:var(--bg-input); color:var(--text-main); font-family:inherit;">
                            </div>
                            <div style="display:flex; flex-direction:column; gap:4px; margin-bottom: 8px;">
                                <label style="font-size:11px; font-weight:700; color:var(--text-muted);">WhatsApp</label>
                                <input type="text" id="vol-phone" required style="padding:10px; border:1px solid var(--border-color); border-radius:8px; font-size:13px; background:var(--bg-input); color:var(--text-main); font-family:inherit;" placeholder="(19) 99999-9999" oninput="maskPhone(this)">
                            </div>
                            
                            <button type="submit" style="width:100%; padding: 12px; background: var(--primary); color: white; border: none; font-size: 13.5px; font-weight: 800; border-radius: 8px; cursor: pointer; font-family: inherit;">
                                Enviar Cadastro de Voluntário 🤝
                            </button>
                        </form>
                    </div>
                    
                    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; display:flex; flex-direction:column; gap:16px;">
                        <h3 style="margin:0; font-size: 16px; font-weight: 800; color: var(--text-main);">📅 Calendário de Eventos</h3>
                        
                        <div style="display:flex; gap:14px; background:var(--bg-input); border-radius:8px; padding:12px; border-left:4px solid var(--primary);">
                            <div style="text-align:center; min-width: 50px;">
                                <div style="font-size:18px; font-weight:900; color:var(--primary);">04</div>
                                <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Jul</div>
                            </div>
                            <div>
                                <h4 style="margin:0 0 4px 0; font-size:14px; font-weight:800;">Feira de Adoção Responsável 🐕</h4>
                                <p style="margin:0; font-size:12px; color:var(--text-muted);">Sábado, das 10h às 17h, no Parque Central de Piracicaba. Traga sua família!</p>
                            </div>
                        </div>

                        <div style="display:flex; gap:14px; background:var(--bg-input); border-radius:8px; padding:12px; border-left:4px solid #e67e22;">
                            <div style="text-align:center; min-width: 50px;">
                                <div style="font-size:18px; font-weight:900; color:#e67e22;">11</div>
                                <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Jul</div>
                            </div>
                            <div>
                                <h4 style="margin:0 0 4px 0; font-size:14px; font-weight:800;">Mutirão de Vacinação & Vermifugação 💉</h4>
                                <p style="margin:0; font-size:12px; color:var(--text-muted);">Domingo, das 9h às 13h, na sede da ONG. Aplicação de doses gratuitas.</p>
                            </div>
                        </div>

                        <div style="display:flex; gap:14px; background:var(--bg-input); border-radius:8px; padding:12px; border-left:4px solid #2e7d32;">
                            <div style="text-align:center; min-width: 50px;">
                                <div style="font-size:18px; font-weight:900; color:#2e7d32;">18</div>
                                <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Jul</div>
                            </div>
                            <div>
                                <h4 style="margin:0 0 4px 0; font-size:14px; font-weight:800;">Bazar Beneficente Juventudes 🛍️</h4>
                                <p style="margin:0; font-size:12px; color:var(--text-muted);">Sábado, das 14h às 19h, no Senac. Arrecadação 100% revertida para rações.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (profileType === 'institution' && tab === 'reviews') {
        if (!state.ngoReviews) {
            state.ngoReviews = [
                { author: 'Mariana Silva', score: 5, date: '2026-06-25', text: 'Atendimento maravilhoso! Adotei a Mel através da APAPI e o processo foi muito organizado e transparente. Recomendo de olhos fechados!' },
                { author: 'Carlos Henrique', score: 5, date: '2026-06-24', text: 'Excelente prestação de contas. Sempre mostram onde cada centavo das doações é investido. Parabéns pelo trabalho lindo com os cães!' }
            ];
        }
        
        container.innerHTML = `
            <div style="padding: 20px 0; text-align: left; animation: fadeInView 0.3s ease-out;">
                <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; flex-wrap: wrap;">
                    
                    <div style="display:flex; flex-direction:column; gap:16px;">
                        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
                            <h3 style="margin-top:0; margin-bottom:14px; font-size: 16px; font-weight: 800; color: var(--text-main); display:flex; align-items:center; gap:8px;">💡 Índice de Transparência Conexão PET</h3>
                            
                            <div style="display:flex; flex-direction:column; gap:12px; font-size:13px; color:var(--text-main);">
                                <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom:6px;">
                                    <span>Total de Animais Resgatados</span>
                                    <strong>245 pets</strong>
                                </div>
                                <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom:6px;">
                                    <span>Adoções Concluídas com Sucesso</span>
                                    <strong>142 pets</strong>
                                </div>
                                <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom:6px;">
                                    <span>Tempo Médio para Adoção</span>
                                    <strong>28 dias</strong>
                                </div>
                                <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom:6px;">
                                    <span>Resposta Média a Solicitações</span>
                                    <strong>4 horas</strong>
                                </div>
                                <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom:6px;">
                                    <span>Auditoria Bancária e Prestação de Contas</span>
                                    <span style="color:#2e7d32; font-weight:800;">Regular & Aprovada ✓</span>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
                            <h4 style="margin-top:0; margin-bottom:10px; font-size:14.5px; font-weight:800;">📍 Localização da Sede</h4>
                            <div style="font-size:13px; color:var(--text-main); margin-bottom:12px; line-height:1.4;">
                                🗺️ Rua dos Animais, 123, Bairro Centro, Piracicaba - SP <br>
                                🕰️ Horário: Segunda a Sábado, das 8h às 18h.
                            </div>
                            <div style="width:100%; height:120px; background:#e2d9f3; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#820ad1; font-size:12px; font-weight:700; border:1px dashed #820ad1;">
                                <span style="font-size:24px;">🗺️</span>
                                <span>Clique para Traçar Rota de GPS (Simulado)</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
                        <h3 style="margin-top:0; margin-bottom:14px; font-size: 16px; font-weight: 800; color: var(--text-main);">⭐ Avaliações da Comunidade</h3>
                        
                        <div style="display:flex; gap:16px; align-items:center; background:var(--bg-input); border-radius:8px; padding:12px; margin-bottom:20px;">
                            <div style="text-align:center;">
                                <div style="font-size:32px; font-weight:900; color:#f1c40f;">4.8</div>
                                <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase; font-weight:800;">de 5 estrelas</div>
                            </div>
                            <div style="flex:1; font-size:12px; color:var(--text-main); display:flex; flex-direction:column; gap:4px;">
                                <div style="display:flex; justify-content:space-between;"><span>Atendimento:</span> <strong>⭐⭐⭐⭐⭐ 4.8</strong></div>
                                <div style="display:flex; justify-content:space-between;"><span>Transparência:</span> <strong>⭐⭐⭐⭐⭐ 5.0</strong></div>
                                <div style="display:flex; justify-content:space-between;"><span>Organização:</span> <strong>⭐⭐⭐⭐ 4.5</strong></div>
                                <div style="display:flex; justify-content:space-between;"><span>Processo de Adoção:</span> <strong>⭐⭐⭐⭐⭐ 4.9</strong></div>
                            </div>
                        </div>
                        
                        <div id="ngo-reviews-list-container" style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px; max-height: 250px; overflow-y:auto; padding-right:6px;">
                            ${state.ngoReviews.map(r => `
                                <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; text-align: left; font-size:12.5px;">
                                    <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:800;">
                                        <span>${r.author}</span>
                                        <span style="color:#f1c40f;">${'⭐'.repeat(r.score)}</span>
                                    </div>
                                    <p style="margin:0; line-height:1.4; color:var(--text-main);">${r.text}</p>
                                </div>
                            `).join('')}
                        </div>
                        
                        <form onsubmit="handleReviewSubmit(event)" style="border-top:1px solid var(--border-color); padding-top:16px; display:flex; flex-direction:column; gap:10px;">
                            <h4 style="margin:0 0 4px 0; font-size:13.5px; font-weight:800;">Deixe sua Avaliação:</h4>
                            <div style="display:flex; gap:10px; align-items:center;">
                                <label style="font-size:12px; color:var(--text-muted); font-weight:700;">Nota:</label>
                                <select id="new-review-score" style="padding:6px; border:1px solid var(--border-color); border-radius:6px; font-size:12px; background:var(--bg-input); color:var(--text-main); font-family:inherit;">
                                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                                    <option value="3">⭐⭐⭐ (3/5)</option>
                                    <option value="2">⭐⭐ (2/5)</option>
                                    <option value="1">⭐ (1/5)</option>
                                </select>
                            </div>
                            <textarea id="new-review-text" required placeholder="Escreva seu comentário sobre atendimento, transparência, etc." style="width:100%; box-sizing:border-box; height:60px; padding:10px; border:1px solid var(--border-color); border-radius:8px; font-size:12.5px; background:var(--bg-input); color:var(--text-main); font-family:inherit; resize:none; outline:none; transition:border-color 0.2s;" onfocus="this.style.borderColor='#820ad1'" onblur="this.style.borderColor='var(--border-color)'"></textarea>
                            <button type="submit" style="width:100%; padding:10px; background:#820ad1; color:white; border:none; font-size:12px; font-weight:800; border-radius:20px; cursor:pointer; font-family:inherit;">
                                Enviar Avaliação ⭐
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    } else if (profileType === 'petshop' && tab === 'products') {
        const petShopProducts = [
            { id: 'prod-1', name: 'Ração PremieR Cães Adultos Raças Médias', category: 'Rações', price: 149.90, img: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&auto=format&fit=crop', brand: 'PremieR Pet', stock: 15, rating: 5, promo: '10% OFF', desc: 'Alimento super premium completo e balanceado indicado para cães adultos de médio porte.' },
            { id: 'prod-2', name: 'Brinquedo Mordedor Kong Classic Vermelho', category: 'Brinquedos', price: 89.90, img: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&auto=format&fit=crop', brand: 'Kong', stock: 8, rating: 5, promo: '15% OFF', desc: 'O padrão ouro dos brinquedos de borracha natural para cães com alta durabilidade e rebote.' },
            { id: 'prod-3', name: 'Caminha Nuvem Soft Super Aconchegante', category: 'Caminhas', price: 119.90, img: 'https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?w=300&auto=format&fit=crop', brand: 'PetSoft', stock: 4, rating: 4, promo: '', desc: 'Cama anatômica ultra macia, lavável, projetada para reduzir ansiedade de cães e gatos.' },
            { id: 'prod-4', name: 'Coleira Antipulgas Seresto Cães até 8kg', category: 'Medicamentos', price: 219.90, img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&auto=format&fit=crop', brand: 'Bayer', stock: 12, rating: 5, promo: 'Frete Grátis', desc: 'Até 8 meses de proteção contínua contra pulgas, carrapatos e leishmaniose.' },
            { id: 'prod-5', name: 'Petisco Bifinho de Carne Premium', category: 'Petiscos', price: 9.90, img: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=300&auto=format&fit=crop', brand: 'Doguito', stock: 45, rating: 4, promo: '', desc: 'Delicioso snack sabor carne fresca para premiar ou agradar o seu pet de forma saudável.' }
        ];
        
        container.innerHTML = `
            <div style="padding: 20px 0; text-align: left; animation: fadeInView 0.3s ease-out;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; flex-wrap:wrap; gap:12px;">
                    <div>
                        <h3 style="font-size: 16px; font-weight: 800; color: var(--text-main); margin:0 0 4px 0; display:flex; align-items:center; gap:8px;">🛒 Catálogo de Produtos</h3>
                        <p style="font-size: 13px; color: var(--text-muted); margin:0;">Produtos e rações premium das melhores marcas com entrega rápida.</p>
                    </div>
                    <div style="display:flex; gap:8px; align-items:center;">
                        <span style="font-size:12px; color:var(--text-muted); font-weight:700;">Filtrar:</span>
                        <select onchange="filterPetShopProducts(this.value)" style="padding:6px 12px; border:1px solid var(--border-color); border-radius:20px; font-size:12.5px; background:var(--bg-card); color:var(--text-main); font-family:inherit;">
                            <option value="Todos">Todos os Itens</option>
                            <option value="Rações">Rações</option>
                            <option value="Brinquedos">Brinquedos</option>
                            <option value="Caminhas">Caminhas</option>
                            <option value="Medicamentos">Medicamentos</option>
                            <option value="Petiscos">Petiscos</option>
                        </select>
                    </div>
                </div>
                
                <div id="catalog-products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
                    ${petShopProducts.map(p => `
                        <div class="product-item-card" data-category="${p.category}" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; flex-direction: column; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div style="position:relative; width:100%; height:160px; background:#f9f9f9; display:flex; align-items:center; justify-content:center;">
                                <img src="${p.img}" style="width:100%; height:100%; object-fit:cover;" alt="${p.name}">
                                ${p.promo ? `
                                    <span style="position:absolute; top:8px; left:8px; background:#820ad1; color:white; font-size:10px; font-weight:900; padding:3px 8px; border-radius:4px;">${p.promo}</span>
                                ` : ''}
                            </div>
                            <div style="padding: 14px; display:flex; flex-direction:column; flex:1; text-align:left;">
                                <div style="font-size:10.5px; color:#820ad1; font-weight:800; text-transform:uppercase; margin-bottom:4px;">${p.category} • ${p.brand}</div>
                                <h4 style="margin:0 0 6px 0; font-size:13.5px; font-weight:800; color:var(--text-main); line-height:1.3; height:36px; overflow:hidden;">${p.name}</h4>
                                <p style="font-size:11.5px; color:var(--text-muted); line-height:1.3; margin:0 0 10px 0; height:30px; overflow:hidden;">${p.desc}</p>
                                
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:12px;">
                                    <span style="color:#f1c40f; font-weight:800;">${'★'.repeat(p.rating)}</span>
                                    <span style="color:var(--text-muted); font-size:11px;">Estoque: <strong>${p.stock} un.</strong></span>
                                </div>
                                
                                <div style="display:flex; align-items:baseline; gap:6px; margin-bottom:12px; margin-top:auto;">
                                    <span style="font-size:18px; font-weight:900; color:var(--text-main);">R$ ${p.price.toFixed(2).replace('.', ',')}</span>
                                </div>
                                
                                <button onclick="simulateBuyProduct('${p.name}')" style="width:100%; background:#820ad1; color:white; border:none; padding:8px; border-radius:8px; font-size:12px; font-weight:800; cursor:pointer; font-family:inherit; transition: opacity 0.2s;">
                                    Comprar Online 🛒
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (profileType === 'petshop' && tab === 'services') {
        const petShopServices = [
            { name: 'Banho & Secagem Profissional', desc: 'Higienização profunda com shampoos hipoalergênicos e secagem cuidadosa.', price: 50.00, icon: '🧼', duration: '1h' },
            { name: 'Tosa Estética & Higiênica', desc: 'Corte de pelos conforme padrão de raça ou preferência do tutor.', price: 40.00, icon: '✂️', duration: '45min' },
            { name: 'Táxi Pet Buscar/Entregar', desc: 'Transporte climatizado de ida e volta com cinto de segurança exclusivo.', price: 25.00, icon: '🚗', duration: 'Variável' },
            { name: 'Creche Pet e Socialização', desc: 'Dia inteiro de atividades, brincadeiras orientadas e socialização.', price: 60.00, icon: '🏡', duration: 'Diária' },
            { name: 'Consultoria Nutricional Especial', desc: 'Formulação de cardápios e recomendação da melhor dieta para seu pet.', price: 150.00, icon: '🩺', duration: '1h30' },
            { name: 'Hospedagem Familiar Premium', desc: 'Pernoites monitoradas com equipe dedicada e relatórios diários via WhatsApp.', price: 80.00, icon: '🏨', duration: 'Por noite' }
        ];
        
        container.innerHTML = `
            <div style="padding: 20px 0; text-align: left; animation: fadeInView 0.3s ease-out;">
                <h3 style="font-size: 16px; font-weight: 800; color: var(--text-main); margin:0 0 4px 0; display:flex; align-items:center; gap:8px;">✂️ Serviços Disponíveis</h3>
                <p style="font-size: 13px; color: var(--text-muted); margin:0 0 20px 0;">Agende serviços especializados e traga mais conforto ao seu amiguinho.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
                    ${petShopServices.map(s => `
                        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; display:flex; gap:14px; align-items:flex-start;">
                            <div style="font-size:32px; background:rgba(130,10,209,0.08); width:54px; height:54px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${s.icon}</div>
                            <div style="flex:1; display:flex; flex-direction:column; min-height:100px;">
                                <h4 style="margin:0 0 4px 0; font-size:14px; font-weight:800; color:var(--text-main);">${s.name}</h4>
                                <p style="font-size:11.5px; color:var(--text-muted); line-height:1.3; margin:0 0 10px 0; flex:1;">${s.desc}</p>
                                <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; margin-top:auto;">
                                    <span style="color:var(--text-muted);">⏱️ ${s.duration}</span>
                                    <span style="font-size:15px; font-weight:900; color:#820ad1;">R$ ${s.price.toFixed(2).replace('.', ',')}</span>
                                </div>
                                <button onclick="simulateBookService('${s.name}')" style="width:100%; border:1px solid #820ad1; background:transparent; color:#820ad1; padding:6px; border-radius:20px; font-size:11px; font-weight:800; margin-top:12px; cursor:pointer; font-family:inherit; transition: 0.2s;" onmouseover="this.style.background='#820ad1'; this.style.color='white';" onmouseout="this.style.background='transparent'; this.style.color='#820ad1';">
                                    Agendar Serviço ➔
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (profileType === 'petshop' && tab === 'coupons') {
        const petShopCoupons = [
            { code: 'Conexão Pet10', desc: '10% de desconto em todo o catálogo de produtos.', type: 'Desconto' },
            { code: 'FRETEGRATIS', desc: 'Frete grátis para compras a partir de R$ 150,00.', type: 'Frete Grátis' },
            { code: 'BRINQUE20', desc: '20% de desconto em qualquer brinquedo.', type: 'Brinquedos' }
        ];
        
        const petShopEvents = [
            { title: 'Feira de Adoção Responsável', desc: 'Em parceria com a ONG APAPI. Traga sua família para encontrar um pet e ganhe 10% de desconto na primeira compra.', date: 'Próximo Sábado, das 9h às 14h', location: 'Estacionamento da loja principal' },
            { title: 'Dia da Vacinação Premiada', desc: 'Vacinas importadas com desconto especial de 15% e aplicação por veterinários certificados.', date: '15 de Julho, o dia todo', location: 'Sala veterinária do Pet Shop' },
            { title: 'Demonstração de Petiscos Finos', desc: 'Venha testar a aceitação de petiscos gourmet 100% naturais. Distribuição de brindes para todos os pets.', date: '28 de Julho, às 16h', location: 'Área externa' }
        ];
        
        container.innerHTML = `
            <div style="padding: 20px 0; text-align: left; animation: fadeInView 0.3s ease-out; display:grid; grid-template-columns: 1fr 1.2fr; gap:24px; flex-wrap:wrap;">
                
                <div>
                    <h3 style="font-size: 16px; font-weight: 800; color: var(--text-main); margin:0 0 14px 0; display:flex; align-items:center; gap:8px;">🎟️ Cupons Promocionais</h3>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        ${petShopCoupons.map(c => `
                            <div style="background:var(--bg-card); border: 2px dashed #e1d5f2; border-radius: 12px; padding: 14px; position:relative; overflow:hidden;">
                                <div style="position:absolute; top:-10px; right:-10px; width:20px; height:20px; border-radius:50%; background:#fcfbff;"></div>
                                <div style="position:absolute; bottom:-10px; right:-10px; width:20px; height:20px; border-radius:50%; background:#fcfbff;"></div>
                                
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                    <span style="font-size:10px; font-weight:900; background:rgba(130,10,209,0.08); color:#820ad1; padding:2px 8px; border-radius:4px; text-transform:uppercase;">${c.type}</span>
                                    <strong style="font-size:14px; color:#820ad1; font-family:monospace; letter-spacing:0.5px;">${c.code}</strong>
                                </div>
                                <p style="font-size:12px; color:var(--text-muted); line-height:1.4; margin:0 0 10px 0;">${c.desc}</p>
                                <button onclick="copyCouponCode('${c.code}')" style="width:100%; border:none; background:#820ad1; color:white; padding:6px; border-radius:20px; font-size:11px; font-weight:800; cursor:pointer; font-family:inherit;">
                                    Copiar Código 📋
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div>
                    <h3 style="font-size: 16px; font-weight: 800; color: var(--text-main); margin:0 0 14px 0; display:flex; align-items:center; gap:8px;">📅 Eventos Organizacionais</h3>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        ${petShopEvents.map(e => `
                            <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px; padding:16px; text-align:left;">
                                <h4 style="margin:0 0 6px 0; font-size:14px; font-weight:800; color:var(--text-main);">${e.title}</h4>
                                <p style="font-size:12px; color:var(--text-muted); line-height:1.4; margin:0 0 12px 0;">${e.desc}</p>
                                <div style="display:flex; flex-direction:column; gap:4px; font-size:11.5px; color:#820ad1; font-weight:700;">
                                    <span>📅 <strong>Quando:</strong> ${e.date}</span>
                                    <span>📍 <strong>Onde:</strong> ${e.location}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    } else if (profileType === 'petshop' && tab === 'reviews') {
        if (!state.petshopReviews) {
            state.petshopReviews = [
                { author: 'Guilherme Lima', score: 5, date: '2026-06-25', text: 'Melhor banho e tosa da região. Meu cachorro Golden adora os profissionais daqui. Preço justo!' },
                { author: 'Ana Júlia', score: 4, date: '2026-06-23', text: 'Excelente catálogo de brinquedos. A entrega foi muito rápida, comprei pelo WhatsApp e chegou em 2 horas.' }
            ];
        }
        
        container.innerHTML = `
            <div style="padding: 20px 0; text-align: left; animation: fadeInView 0.3s ease-out;">
                <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; flex-wrap: wrap;">
                    
                    <div style="display:flex; flex-direction:column; gap:16px;">
                        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
                            <h3 style="margin-top:0; margin-bottom:14px; font-size: 16px; font-weight: 800; color: var(--text-main); display:flex; align-items:center; gap:8px;">💡 Estatísticas de Serviço</h3>
                            
                            <div style="display:flex; flex-direction:column; gap:12px; font-size:13px; color:var(--text-main);">
                                <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom:6px;">
                                    <span>Horário de Funcionamento</span>
                                    <strong>Seg a Sáb, 08:00 às 20:00</strong>
                                </div>
                                <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom:6px;">
                                    <span>Serviços de Delivery</span>
                                    <strong>Sim, com taxa fixa R$ 10</strong>
                                </div>
                                <div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--border-color); padding-bottom:6px;">
                                    <span>Marca Credenciada</span>
                                    <strong>Patrocinador Oficial Conexão PET</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
                            <h4 style="margin-top:0; margin-bottom:10px; font-size:14.5px; font-weight:800;">📍 Localização da Loja</h4>
                            <div style="font-size:13px; color:var(--text-main); margin-bottom:12px; line-height:1.4;">
                                🗺️ Avenida do Comércio, 456, Bairro Industrial, Picos - PI <br>
                                📞 (89) 3422-9988 &nbsp;·&nbsp; ✉️ contato@patas.com.br
                            </div>
                            <div style="width:100%; height:120px; background:#e2d9f3; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#820ad1; font-size:12px; font-weight:700; border:1px dashed #820ad1;">
                                <span style="font-size:24px;">🗺️</span>
                                <span>Ver no Google Maps (Simulado)</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
                        <h3 style="margin-top:0; margin-bottom:14px; font-size: 16px; font-weight: 800; color: var(--text-main);">⭐ Avaliações da Loja</h3>
                        
                        <div style="display:flex; gap:16px; align-items:center; background:var(--bg-input); border-radius:8px; padding:12px; margin-bottom:20px;">
                            <div style="text-align:center;">
                                <div style="font-size:32px; font-weight:900; color:#f1c40f;">4.7</div>
                                <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase; font-weight:800;">de 5 estrelas</div>
                            </div>
                            <div style="flex:1; font-size:12px; color:var(--text-main); display:flex; flex-direction:column; gap:4px;">
                                <div style="display:flex; justify-content:space-between;"><span>Atendimento:</span> <strong>⭐⭐⭐⭐⭐ 4.7</strong></div>
                                <div style="display:flex; justify-content:space-between;"><span>Qualidade dos Produtos:</span> <strong>⭐⭐⭐⭐⭐ 4.8</strong></div>
                                <div style="display:flex; justify-content:space-between;"><span>Preços:</span> <strong>⭐⭐⭐⭐ 4.2</strong></div>
                                <div style="display:flex; justify-content:space-between;"><span>Tempo de Entrega:</span> <strong>⭐⭐⭐⭐⭐ 4.6</strong></div>
                            </div>
                        </div>
                        
                        <div id="petshop-reviews-list-container" style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px; max-height: 200px; overflow-y:auto; padding-right:6px;">
                            ${state.petshopReviews.map(r => `
                                <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; text-align: left; font-size:12.5px;">
                                    <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:800;">
                                        <span>${r.author}</span>
                                        <span style="color:#f1c40f;">${'⭐'.repeat(r.score)}</span>
                                    </div>
                                    <p style="margin:0; line-height:1.4; color:var(--text-main);">${r.text}</p>
                                </div>
                            `).join('')}
                        </div>
                        
                        <form onsubmit="handlePetshopReviewSubmit(event)" style="border-top:1px solid var(--border-color); padding-top:16px; display:flex; flex-direction:column; gap:10px;">
                            <h4 style="margin:0 0 4px 0; font-size:13.5px; font-weight:800;">Deixe sua Avaliação:</h4>
                            <div style="display:flex; gap:10px; align-items:center;">
                                <label style="font-size:12px; color:var(--text-muted); font-weight:700;">Nota:</label>
                                <select id="new-ps-review-score" style="padding:6px; border:1px solid var(--border-color); border-radius:6px; font-size:12px; background:var(--bg-input); color:var(--text-main); font-family:inherit;">
                                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                                    <option value="3">⭐⭐⭐ (3/5)</option>
                                    <option value="2">⭐⭐ (2/5)</option>
                                    <option value="1">⭐ (1/5)</option>
                                </select>
                            </div>
                            <textarea id="new-ps-review-text" required placeholder="Escreva seu comentário sobre produtos, tosa, etc." style="width:100%; box-sizing:border-box; height:60px; padding:10px; border:1px solid var(--border-color); border-radius:8px; font-size:12.5px; background:var(--bg-input); color:var(--text-main); font-family:inherit; resize:none; outline:none; transition:border-color 0.2s;" onfocus="this.style.borderColor='#820ad1'" onblur="this.style.borderColor='var(--border-color)'"></textarea>
                            <button type="submit" style="width:100%; padding:10px; background:#820ad1; color:white; border:none; font-size:12px; font-weight:800; border-radius:20px; cursor:pointer; font-family:inherit;">
                                Enviar Avaliação ⭐
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    } else if (tab === 'marked') {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-main); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;">
                <div style="width: 62px; height: 62px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                    <svg viewBox="0 0 24 24" style="width: 32px; height: 32px; fill: none; stroke: currentColor; stroke-width: 1.5;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <h3 style="font-size: 20px; font-weight: 800; margin: 0;">Fotos e vídeos com você</h3>
                <p style="font-size: 13.5px; color: var(--text-muted); max-width: 350px; line-height: 1.4; margin: 0;">Quando as pessoas marcarem você em fotos e vídeos, eles aparecerão aqui.</p>
            </div>
        `;
    } else {
        // Fallback for posts
        let posts = state.feed || [];
        if (authorName) {
            posts = posts.filter(p => p.authorName.toLowerCase().includes(authorName.toLowerCase()));
        } else {
            posts = posts.filter(p => p.authorName.includes('Rex') || p.authorName.includes('Mel') || p.authorName.includes('Carlos'));
        }
        
        if (posts.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                    <p style="font-size: 16px; font-weight: 600;">Nenhuma publicação ainda</p>
                </div>
            `;
            return;
        }
        container.innerHTML = posts.map(post => `
            <div class="gallery-card" onclick="openPhotoDetail('${post.id}')">
                <img src="${post.image}" class="gallery-img" alt="Post do pet">
                <div class="gallery-overlay">
                    <div class="gallery-stat">
                        <svg viewBox="0 0 24 24" class="gallery-stat-svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        <span>${post.likes}</span>
                    </div>
                    <div class="gallery-stat">
                        <svg viewBox="0 0 24 24" class="gallery-stat-svg"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                        <span>${(post.comments && post.comments.length) || 0}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function switchProfileTab(tabName) {
    state.activeProfileTab = tabName;
    saveStateToLocalStorage();
    
    const tabs = document.querySelectorAll('.pill-tab-switcher .pill-tab');
    tabs.forEach(tab => {
        const onclickAttr = tab.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${tabName}'`)) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    updateProfileGallery();
}

function openReelDetail(reelId) {
    const idx = state.reels.findIndex(r => r.id === reelId);
    if (idx !== -1) {
        state.activeReelIndex = idx;
        state.activeReelsTab = 'para-voce';
        saveStateToLocalStorage();
        navigateToTab('reels');
    }
}

// ==========================================================================
// CHAT ADVANCED FUNCTIONS (CALLS, RECORDING, EMOJIS, ATTACHMENTS, CONTROLLERS)
// ==========================================================================

let isRecordingAudio = false;
let recordingTimer = null;
let recordingSeconds = 0;

function handleChatSendClick() {
    const input = document.getElementById('chat-message-input');
    if (!input) return;
    
    if (isRecordingAudio) {
        toggleAudioRecording();
    } else if (input.value.trim() !== '') {
        submitChatMessage();
    } else {
        toggleAudioRecording();
    }
}

function toggleAudioRecording() {
    const input = document.getElementById('chat-message-input');
    const sendBtn = document.getElementById('chat-send-btn-wa');
    const sendIcon = document.getElementById('chat-send-btn-icon');
    
    if (!input || !sendIcon) return;
    
    if (!isRecordingAudio) {
        isRecordingAudio = true;
        recordingSeconds = 0;
        
        input.setAttribute('data-prev-placeholder', input.placeholder || 'Digite uma mensagem');
        input.disabled = true;
        input.value = '';
        input.placeholder = '🔴 Gravando... 0:00';
        input.style.color = '#ef4444';
        input.style.fontWeight = 'bold';
        
        sendIcon.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
        `;
        
        recordingTimer = setInterval(() => {
            recordingSeconds++;
            const mins = Math.floor(recordingSeconds / 60);
            const secs = recordingSeconds % 60;
            input.placeholder = `🔴 Gravando... ${mins}:${String(secs).padStart(2, '0')}`;
        }, 1000);
        
        showToast('Gravando áudio do pet... 🎙️🐾', 'info');
    } else {
        isRecordingAudio = false;
        clearInterval(recordingTimer);
        
        const durationStr = `${Math.floor(recordingSeconds / 60)}:${String(recordingSeconds % 60).padStart(2, '0')}`;
        
        input.disabled = false;
        input.placeholder = input.getAttribute('data-prev-placeholder') || 'Digite uma mensagem';
        input.style.color = 'var(--text-main)';
        input.style.fontWeight = 'normal';
        
        sendIcon.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
        `;
        
        if (recordingSeconds > 0) {
            sendAudioMessage(durationStr);
        }
    }
}

function sendAudioMessage(duration) {
    const activeFriend = state.friends.find(f => f.id === state.activeChatFriendId);
    if (activeFriend) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        const audioHtml = `
            <div style="display: flex; align-items: center; gap: 8px; min-width: 160px; padding: 4px 0;">
                <button style="background: var(--primary); border: none; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer;" onclick="playMockAudioBubble(this)">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
                <div style="flex: 1; height: 16px; display: flex; align-items: center; gap: 4px;">
                    <div style="flex: 1; height: 3px; background: var(--border-color); border-radius: 2px; position: relative; overflow: hidden;">
                        <div class="audio-progress" style="position: absolute; top: 0; left: 0; height: 100%; width: 0%; background: var(--primary); transition: width 0.1s linear;"></div>
                    </div>
                    <span style="font-size: 10px; color: var(--text-muted); font-weight: 600;">${duration}</span>
                </div>
            </div>
        `;
        
        activeFriend.messages.push({
            sender: 'sent',
            text: audioHtml,
            time: timeStr
        });
        saveStateToLocalStorage();
        
        const msgContainer = document.getElementById('chat-messages-container');
        if (msgContainer) {
            const bubble = document.createElement('div');
            bubble.className = 'wa-bubble sent';
            bubble.innerHTML = `
                <div class="wa-bubble-text">${audioHtml}</div>
                <div class="wa-bubble-meta">
                    <span class="wa-time">${timeStr}</span>
                    <span class="wa-status-checks">✓✓</span>
                </div>
            `;
            msgContainer.appendChild(bubble);
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }
        
        setTimeout(() => {
            simulateBotReply(activeFriend.id);
        }, 1500);
    }
}

function playMockAudioBubble(btn) {
    const playIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    const pauseIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    
    const progress = btn.nextElementSibling.querySelector('.audio-progress');
    
    if (btn.classList.contains('playing')) {
        btn.classList.remove('playing');
        btn.innerHTML = playIcon;
    } else {
        btn.classList.add('playing');
        btn.innerHTML = pauseIcon;
        
        let pct = 0;
        const interval = setInterval(() => {
            if (!btn.classList.contains('playing')) {
                clearInterval(interval);
                return;
            }
            pct += 2;
            if (progress) progress.style.width = `${pct}%`;
            
            if (pct >= 100) {
                clearInterval(interval);
                btn.classList.remove('playing');
                btn.innerHTML = playIcon;
                if (progress) progress.style.width = '0%';
            }
        }, 60);
    }
}

function toggleEmojiPicker(event) {
    if (event) event.stopPropagation();
    let picker = document.getElementById('chat-emoji-picker');
    if (picker) {
        picker.remove();
        return;
    }
    
    picker = document.createElement('div');
    picker.id = 'chat-emoji-picker';
    picker.style.cssText = `
        position: absolute;
        bottom: 70px;
        left: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 10px;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 8px;
        box-shadow: var(--hover-shadow);
        z-index: 100;
        font-size: 20px;
    `;
    
    const emojis = ['😊', '🐾', '🐶', '🐱', '❤️', '🦴', '⚽', '🌟', '🐹', '🐰', '🦊', '🦁', '🐯', '🐨', '🐷', '🐸', '🦄', '🐝'];
    picker.innerHTML = emojis.map(em => `
        <span class="emoji-item" onclick="insertEmoji('${em}')" style="cursor:pointer; transition: transform 0.1s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">${em}</span>
    `).join('');
    
    const footer = document.querySelector('.wa-input-footer');
    if (footer) {
        footer.style.position = 'relative';
        footer.appendChild(picker);
    }
}

function insertEmoji(emoji) {
    const input = document.getElementById('chat-message-input');
    if (input) {
        input.value += emoji;
        input.focus();
        
        const sendIcon = document.getElementById('chat-send-btn-icon');
        if (sendIcon) {
            sendIcon.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
            `;
        }
    }
    const picker = document.getElementById('chat-emoji-picker');
    if (picker) picker.remove();
}

function triggerAttachment(event) {
    if (event) event.stopPropagation();
    let fileInput = document.getElementById('chat-file-input');
    if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.id = 'chat-file-input';
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    sendImageMessage(event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }
    fileInput.click();
}

function sendImageMessage(dataUrl) {
    const activeFriend = state.friends.find(f => f.id === state.activeChatFriendId);
    if (activeFriend) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        activeFriend.messages.push({
            sender: 'sent',
            text: `<img src="${dataUrl}" style="max-width: 200px; border-radius: 8px; cursor: pointer; display: block;" onclick="openPhotoViewerModal('${dataUrl}')">`,
            time: timeStr
        });
        saveStateToLocalStorage();
        
        const msgContainer = document.getElementById('chat-messages-container');
        if (msgContainer) {
            const bubble = document.createElement('div');
            bubble.className = 'wa-bubble sent';
            bubble.innerHTML = `
                <div class="wa-bubble-text"><img src="${dataUrl}" style="max-width: 200px; border-radius: 8px; display: block; cursor: pointer;" onclick="openPhotoViewerModal('${dataUrl}')"></div>
                <div class="wa-bubble-meta">
                    <span class="wa-time">${timeStr}</span>
                    <span class="wa-status-checks">✓✓</span>
                </div>
            `;
            msgContainer.appendChild(bubble);
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }
        
        setTimeout(() => {
            simulateBotReply(activeFriend.id);
        }, 1500);
    }
}

function openPhotoViewerModal(src) {
    let overlay = document.getElementById('photo-viewer-overlay');
    if (overlay) overlay.remove();
    
    overlay = document.createElement('div');
    overlay.id = 'photo-viewer-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        cursor: zoom-out;
    `;
    overlay.innerHTML = `<img src="${src}" style="max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">`;
    overlay.onclick = () => overlay.remove();
    document.body.appendChild(overlay);
}

let callAudioInterval = null;
let audioCtx = null;

function playCallingSound() {
    try {
        if (audioCtx === null) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        function playRing() {
            if (!audioCtx || audioCtx.state === 'suspended') return;
            
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc1.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc2.frequency.setValueAtTime(450, audioCtx.currentTime);
            
            gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);
            
            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc1.start();
            osc2.start();
            
            osc1.stop(audioCtx.currentTime + 1.8);
            osc2.stop(audioCtx.currentTime + 1.8);
        }
        
        playRing();
        callAudioInterval = setInterval(playRing, 3000);
    } catch (e) {
        console.error('Audio synthesis failed', e);
    }
}

function stopCallingSound() {
    if (callAudioInterval) {
        clearInterval(callAudioInterval);
        callAudioInterval = null;
    }
}

function startChatCall(isVideo) {
    const activeFriend = state.friends.find(f => f.id === state.activeChatFriendId) || state.friends[0];
    if (!activeFriend) return;
    
    let overlay = document.getElementById('chat-call-overlay');
    if (overlay) overlay.remove();
    
    overlay = document.createElement('div');
    overlay.id = 'chat-call-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(18, 30, 49, 0.96);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-family: 'Nunito', sans-serif;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 20px;">
            <div class="call-avatar-wrapper" style="position: relative;">
                <img src="${activeFriend.avatar}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid var(--primary); box-shadow: 0 0 20px rgba(107,33,168,0.5);" id="call-avatar">
                <div class="call-pulsing-ring" style="position: absolute; top: -4px; left: -4px; right: -4px; bottom: -4px; border-radius: 50%; border: 4px solid var(--primary); animation: callPulse 1.5s infinite; opacity: 0;"></div>
            </div>
            <div>
                <h2 style="font-size: 24px; font-weight: 800; margin: 0 0 8px 0;">${activeFriend.name}</h2>
                <p style="font-size: 16px; color: rgba(255, 255, 255, 0.7); margin: 0;" id="call-status">Chamando...</p>
            </div>
            
            <div id="video-container" style="display: none; width: 280px; height: 210px; background: #000; border-radius: 12px; overflow: hidden; margin-top: 10px; border: 2px solid var(--border-color); position: relative;">
                <video id="call-webcam" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1);"></video>
                <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.6); padding: 2px 8px; border-radius: 10px; font-size: 11px;">Sua câmera</div>
            </div>
            
            <div style="margin-top: 40px; display: flex; gap: 20px;">
                <button onclick="endChatCall()" style="background: #ef4444; border: none; border-radius: 50%; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-6h2v6zm0-8h-2V6h2v2z" transform="rotate(135 12 12)"/></svg>
                </button>
            </div>
        </div>
        
        <style>
            @keyframes callPulse {
                0% { transform: scale(1); opacity: 0.5; }
                100% { transform: scale(1.3); opacity: 0; }
            }
        </style>
    `;
    
    document.body.appendChild(overlay);
    playCallingSound();
    
    let stream = null;
    if (isVideo) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(s => {
                stream = s;
                const videoEl = document.getElementById('call-webcam');
                const videoContainer = document.getElementById('video-container');
                if (videoEl && videoContainer) {
                    videoEl.srcObject = s;
                    videoContainer.style.display = 'block';
                }
            })
            .catch(err => {
                console.warn('Webcam permission denied or unavailable for video call', err);
            });
    }
    
    overlay.webcamStream = stream;
    
    overlay.callTimeout = setTimeout(() => {
        stopCallingSound();
        const statusEl = document.getElementById('call-status');
        if (statusEl) {
            statusEl.innerText = 'Conectado';
            statusEl.style.color = '#22c55e';
            statusEl.style.fontWeight = 'bold';
        }
        
        let elapsed = 0;
        overlay.counterInterval = setInterval(() => {
            elapsed++;
            const mins = Math.floor(elapsed / 60);
            const secs = elapsed % 60;
            if (statusEl) {
                statusEl.innerText = `Conectado • ${mins}:${String(secs).padStart(2, '0')}`;
            }
        }, 1000);
        
    }, 4000);
}

function endChatCall() {
    stopCallingSound();
    const overlay = document.getElementById('chat-call-overlay');
    if (overlay) {
        if (overlay.callTimeout) clearTimeout(overlay.callTimeout);
        if (overlay.counterInterval) clearInterval(overlay.counterInterval);
        
        if (overlay.webcamStream) {
            overlay.webcamStream.getTracks().forEach(track => track.stop());
        }
        
        overlay.remove();
        showToast('Chamada encerrada.', 'info');
    }
}

function openNewChatModal() {
    let modal = document.getElementById('new-chat-modal');
    if (modal) modal.remove();
    
    modal = document.createElement('div');
    modal.id = 'new-chat-modal';
    modal.className = 'modal-overlay active';
    modal.style.cssText = `
        display: flex;
        z-index: 9999;
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.5);
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div class="modal-card" style="width: 400px; max-width: 90%; background: var(--bg-card); border-radius: 12px; box-shadow: var(--hover-shadow); border: 1px solid var(--border-color); overflow: hidden;">
            <div class="modal-header" style="padding: 16px 20px; border-bottom: 1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin: 0; font-size:16px; font-weight:700;">Iniciar Nova Conversa 💬</h3>
                <button onclick="closeNewChatModal()" style="background:none; border:none; font-size:24px; cursor:pointer; color:var(--text-muted);">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <form id="new-chat-form" onsubmit="submitNewChat(event)">
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label style="display:block; font-weight:700; margin-bottom: 6px; font-size:13px; color:var(--text-muted);">Nome do Pet Amigo</label>
                        <input type="text" id="new-chat-name" class="form-control" placeholder="Ex: Bob (Beagle)" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-app); color:var(--text-main); font-family:inherit;">
                    </div>
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label style="display:block; font-weight:700; margin-bottom: 6px; font-size:13px; color:var(--text-muted);">Mensagem Inicial</label>
                        <input type="text" id="new-chat-message" class="form-control" placeholder="Ex: Au au! Vamos bater um papo?" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-app); color:var(--text-main); font-family:inherit;">
                    </div>
                    <div class="modal-footer" style="display:flex; justify-content:flex-end; gap: 10px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                        <button type="button" class="btn btn-secondary" onclick="closeNewChatModal()" style="background:var(--border-color); border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:600;">Cancelar</button>
                        <button type="submit" class="btn btn-primary" style="background:var(--primary); color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:600;">Iniciar Conversa</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeNewChatModal() {
    const modal = document.getElementById('new-chat-modal');
    if (modal) modal.remove();
}

function submitNewChat(event) {
    event.preventDefault();
    const nameInput = document.getElementById('new-chat-name');
    const msgInput = document.getElementById('new-chat-message');
    if (!nameInput || !msgInput) return;
    
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();
    
    const newFriend = {
        id: 'f-' + Date.now(),
        name: name,
        avatar: 'assets/dog_avatar.png',
        distance: '1.2km',
        online: true,
        messages: [
            { sender: 'received', text: message, time: 'Agora mesmo' }
        ]
    };
    
    state.friends.push(newFriend);
    state.activeChatFriendId = newFriend.id;
    saveStateToLocalStorage();
    closeNewChatModal();
    renderCurrentTab('friends');
    showToast(`Conversa iniciada com ${name}!`, 'success');
}

function toggleChatMoreMenu(event) {
    if (event) event.stopPropagation();
    let menu = document.getElementById('chat-more-menu');
    if (menu) {
        menu.remove();
        return;
    }
    
    menu = document.createElement('div');
    menu.id = 'chat-more-menu';
    menu.style.cssText = `
        position: absolute;
        top: 60px;
        right: 18px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 6px 0;
        box-shadow: var(--hover-shadow);
        z-index: 100;
        display: flex;
        flex-direction: column;
        width: 150px;
    `;
    
    menu.innerHTML = `
        <span onclick="clearActiveChatHistory()" style="padding: 8px 16px; cursor: pointer; font-size: 13.5px; color: var(--text-main); transition: background 0.2s;" onmouseover="this.style.background='var(--primary-light)'" onmouseout="this.style.background='none'">🧹 Limpar conversa</span>
        <span onclick="showToast('Contato bloqueado.', 'info'); document.getElementById('chat-more-menu').remove();" style="padding: 8px 16px; cursor: pointer; font-size: 13.5px; color: #ef4444; transition: background 0.2s;" onmouseover="this.style.background='var(--primary-light)'" onmouseout="this.style.background='none'">🚫 Bloquear pet</span>
    `;
    
    const header = document.querySelector('.chat-window-header');
    if (header) {
        header.style.position = 'relative';
        header.appendChild(menu);
    }
}

function clearActiveChatHistory() {
    const activeFriend = state.friends.find(f => f.id === state.activeChatFriendId);
    if (activeFriend) {
        activeFriend.messages = [];
        saveStateToLocalStorage();
        renderCurrentTab('friends');
        showToast('Conversa limpa com sucesso!', 'success');
    }
    const menu = document.getElementById('chat-more-menu');
    if (menu) menu.remove();
}

document.addEventListener('click', () => {
    const picker = document.getElementById('chat-emoji-picker');
    if (picker) picker.remove();
    
    const menu = document.getElementById('chat-more-menu');
    if (menu) menu.remove();
});


/* ==========================================================================
   MODAL ACTIONS & FORMS SUBMISSIONS
   ========================================================================== */

// Open any modal by element Id
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
    }
}

// Variável global para armazenar o stream da câmera do modal de postagem
let postCameraStream = null;

function stopCamera() {
    if (postCameraStream) {
        postCameraStream.getTracks().forEach(track => track.stop());
        postCameraStream = null;
    }
    const videoElement = document.getElementById('post-camera-video');
    const previewImg = document.getElementById('post-preview-image');
    const cameraControls = document.getElementById('camera-controls');
    
    if (videoElement) {
        videoElement.srcObject = null;
        videoElement.style.display = 'none';
    }
    if (previewImg) previewImg.style.display = 'block';
    if (cameraControls) cameraControls.style.display = 'none';
}

// Close active modal
function closeModal(modalElement) {
    modalElement.classList.remove('active');
    modalElement.style.display = 'none';
    if (modalElement.id === 'create-post-modal') {
        stopCamera();
    }
}

// Global modal overlay registers
function initModalCloseTriggers() {
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
        const closeBtn = overlay.querySelector('.close-modal-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(overlay));
        }
        const cancelBtn = overlay.querySelector('.cancel-modal-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => closeModal(overlay));
        }
    });
}

// Form logic binders
function initFormSubmitBinds() {
    // 1. Create Social Post
    try {
        const postForm = document.getElementById('create-post-form');
        if (postForm) {
            const fileInput = document.getElementById('post-image-file');
            const chooseGalleryBtn = document.getElementById('btn-choose-gallery');
            const useCameraBtn = document.getElementById('btn-use-camera');
            const hiddenImgValue = document.getElementById('post-image-value');
            const imgSourceIndicator = document.getElementById('image-source-indicator');
            const previewImg = document.getElementById('post-preview-image');
            
            const videoElement = document.getElementById('post-camera-video');
            const canvasElement = document.getElementById('post-camera-canvas');
            const cameraControls = document.getElementById('camera-controls');
            const captureSnapshotBtn = document.getElementById('btn-capture-snapshot');
            const cancelCameraBtn = document.getElementById('btn-cancel-camera');

            // Lógica para Escolher da Galeria
            if (chooseGalleryBtn && fileInput) {
                chooseGalleryBtn.addEventListener('click', () => {
                    stopCamera();
                    fileInput.click();
                });

                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const dataUrl = event.target.result;
                            if (previewImg) previewImg.src = dataUrl;
                            if (hiddenImgValue) hiddenImgValue.value = dataUrl;
                            if (imgSourceIndicator) imgSourceIndicator.innerText = `Imagem: Galeria (📁)`;
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            // Lógica da Câmera (Tirar Foto)
            async function startCamera() {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    try {
                        postCameraStream = await navigator.mediaDevices.getUserMedia({
                            video: { facingMode: 'user', width: 640, height: 640 }
                        });
                        
                        if (videoElement) {
                            videoElement.srcObject = postCameraStream;
                            videoElement.style.display = 'block';
                        }
                        if (previewImg) previewImg.style.display = 'none';
                        if (cameraControls) cameraControls.style.display = 'flex';
                        if (imgSourceIndicator) imgSourceIndicator.innerText = "Câmera ativa... Tire uma foto! 📸";
                    } catch (err) {
                        console.error("Erro ao acessar a câmera:", err);
                        showToast("Não foi possível acessar a câmera. Tente escolher da galeria.", "warning");
                    }
                } else {
                    showToast("Acesso à câmera não suportado neste navegador.", "warning");
                }
            }

            if (useCameraBtn) {
                useCameraBtn.addEventListener('click', () => {
                    startCamera();
                });
            }

            if (cancelCameraBtn) {
                cancelCameraBtn.addEventListener('click', () => {
                    stopCamera();
                    if (imgSourceIndicator) {
                        imgSourceIndicator.innerText = hiddenImgValue.value.startsWith('data:') 
                            ? "Imagem: Selecionada / Capturada" 
                            : "Imagem atual: Padrão 🌳";
                    }
                });
            }

            if (captureSnapshotBtn && canvasElement && videoElement) {
                captureSnapshotBtn.addEventListener('click', () => {
                    const width = videoElement.videoWidth || 640;
                    const height = videoElement.videoHeight || 640;
                    canvasElement.width = width;
                    canvasElement.height = height;
                    
                    const ctx = canvasElement.getContext('2d');
                    // Espelhar captura para bater com a visualização
                    ctx.translate(width, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(videoElement, 0, 0, width, height);
                    
                    const dataUrl = canvasElement.toDataURL('image/jpeg');
                    
                    if (previewImg) previewImg.src = dataUrl;
                    if (hiddenImgValue) hiddenImgValue.value = dataUrl;
                    
                    stopCamera();
                    
                    if (imgSourceIndicator) imgSourceIndicator.innerText = "Imagem: Capturada da câmera (📷)";
                    showToast("Foto capturada com sucesso! 🐾", "success");
                });
            }

            // Atualização dinâmica do perfil do pet (Avatar e Nome) na direita
            const petSelect = document.getElementById('post-pet-select');
            if (petSelect) {
                petSelect.addEventListener('change', () => {
                    if (petSelect.value === state.tutor.name) {
                        const avatarEl = document.getElementById('post-profile-avatar');
                        const nameEl = document.getElementById('post-profile-name');
                        if (avatarEl) avatarEl.src = state.tutor.avatar;
                        if (nameEl) nameEl.innerText = state.tutor.name;
                    } else {
                        const pet = state.pets.find(p => p.name === petSelect.value);
                        if (pet) {
                            const avatarEl = document.getElementById('post-profile-avatar');
                            const nameEl = document.getElementById('post-profile-name');
                            if (avatarEl) avatarEl.src = pet.avatar;
                            if (nameEl) nameEl.innerText = pet.name;
                        }
                    }
                });
            }

            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const petName = document.getElementById('post-pet-select').value;
                const text = document.getElementById('post-text').value;
                const selectedImg = document.getElementById('post-image-value').value;
                
                let petAvatar = 'assets/dog_avatar.png';
                if (petName === state.tutor.name) {
                    petAvatar = state.tutor.avatar;
                } else {
                    petAvatar = state.pets.find(p => p.name === petName)?.avatar || 'assets/dog_avatar.png';
                }
                
                const newPost = {
                    authorName: `${petName}`,
                    authorAvatar: petAvatar,
                    time: 'Agora mesmo', // Pode ser substituído por timestamp
                    timestamp: window.firebaseServerTimestamp ? window.firebaseServerTimestamp() : Date.now(),
                    text: text,
                    image: selectedImg,
                    likes: 0,
                    liked: false,
                    comments: []
                };
                
                if (window.firebaseDb) {
                    showToast("Enviando post para a nuvem... 🐾", "info");
                    window.firebaseAddDoc(window.firebaseCollection(window.firebaseDb, 'posts'), newPost)
                        .then(() => {
                            showToast("Publicado com sucesso!", "success");
                        })
                        .catch((err) => {
                            console.error(err);
                            showToast("Erro ao publicar: " + err.message, "warning");
                        });
                } else {
                    // Fallback se não tiver conectado
                    newPost.id = `post-${Date.now()}`;
                    state.feed.unshift(newPost);
                    saveStateToLocalStorage();
                    if(state.currentTab === 'feed') renderCurrentTab('feed');
                }
                closeModal(document.getElementById('create-post-modal'));
                postForm.reset();
                
                stopCamera();
                
                // Reset do visualizador e perfil do modal
                const previewImg = document.getElementById('post-preview-image');
                if (previewImg) previewImg.src = 'assets/feed_dog_park.png';
                if (hiddenImgValue) hiddenImgValue.value = 'assets/feed_dog_park.png';
                if (imgSourceIndicator) imgSourceIndicator.innerText = "Imagem atual: Padrão 🌳";
                
                const initialPet = state.pets[0];
                if (initialPet) {
                    const profileImg = document.getElementById('post-profile-avatar');
                    const profileName = document.getElementById('post-profile-name');
                    if (profileImg) profileImg.src = initialPet.avatar;
                    if (profileName) profileName.innerText = initialPet.name;
                }

                showToast('Sua publicação do pet foi criada com sucesso! 🐾', 'success');
                
                // Redireciona para o Feed para visualizar a nova publicação
                navigateToTab('feed');
            });
        }
    } catch (err) {
        console.error("Error binding create-post-form:", err);
    }

    // 2. Add New Pet
    try {
        const petForm = document.getElementById('add-pet-form');
        if (petForm) {
            petForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('pet-name').value;
                const species = document.getElementById('pet-species').value;
                const breed = document.getElementById('pet-breed').value;
                const age = parseInt(document.getElementById('pet-age').value);
                const gender = document.getElementById('pet-gender').value;
                const weight = parseFloat(document.getElementById('pet-weight').value);
                const avatar = document.querySelector('input[name="pet-avatar-choice"]:checked').value;
                
                const newPet = {
                    id: `pet-${Date.now()}`,
                    name: name,
                    species: species,
                    breed: breed,
                    age: age,
                    gender: gender,
                    weight: weight,
                    avatar: avatar,
                    premium: false,
                    health: {
                        vaccines: [],
                        vermifuges: [],
                        appointments: [],
                        weightHistory: [{ date: 'Jun', weight: weight }]
                    }
                };
                
                state.pets.push(newPet);
                saveStateToLocalStorage();
                closeModal(document.getElementById('pet-modal'));
                petForm.reset();
                updateGlobalUIHeaders();
                showToast(`${name} foi cadastrado como seu pet! Welcome! 🎉`, 'success');
                
                if (state.activeTab === 'profile') {
                    renderCurrentTab('profile');
                }
            });
        }
    } catch (err) {
        console.error("Error binding add-pet-form:", err);
    }

    // 3. Register Health Event
    try {
        const healthForm = document.getElementById('health-event-form');
        const healthTypeSelect = document.getElementById('health-type');
        
        if (healthForm && healthTypeSelect) {
            // Toggle modal field layout on type select change
            healthTypeSelect.addEventListener('change', () => {
                const type = healthTypeSelect.value;
                const titleGrp = document.getElementById('health-title-group');
                const valGrp = document.getElementById('health-value-group');
                const nextDateGrp = document.getElementById('health-next-date-group');
                
                if (type === 'weight') {
                    if (titleGrp) titleGrp.style.display = 'none';
                    const healthTitle = document.getElementById('health-title');
                    if (healthTitle) healthTitle.removeAttribute('required');
                    if (valGrp) valGrp.style.display = 'flex';
                    const healthVal = document.getElementById('health-value');
                    if (healthVal) healthVal.setAttribute('required', 'true');
                    if (nextDateGrp) nextDateGrp.style.display = 'none';
                } else if (type === 'appointment') {
                    if (titleGrp) titleGrp.style.display = 'flex';
                    const healthTitle = document.getElementById('health-title');
                    if (healthTitle) healthTitle.setAttribute('required', 'true');
                    if (valGrp) valGrp.style.display = 'none';
                    const healthVal = document.getElementById('health-value');
                    if (healthVal) healthVal.removeAttribute('required');
                    if (nextDateGrp) nextDateGrp.style.display = 'none';
                } else {
                    // vaccine, vermifuge
                    if (titleGrp) titleGrp.style.display = 'flex';
                    const healthTitle = document.getElementById('health-title');
                    if (healthTitle) healthTitle.setAttribute('required', 'true');
                    if (valGrp) valGrp.style.display = 'none';
                    const healthVal = document.getElementById('health-value');
                    if (healthVal) healthVal.removeAttribute('required');
                    if (nextDateGrp) nextDateGrp.style.display = 'flex';
                }
            });

            healthForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const petId = document.getElementById('health-pet-select').value;
                const type = healthTypeSelect.value;
                const title = document.getElementById('health-title').value;
                const date = document.getElementById('health-date').value;
                const nextDateInput = document.getElementById('health-next-date');
                const nextDate = nextDateInput ? nextDateInput.value : '';
                const valInput = document.getElementById('health-value');
                const value = valInput ? parseFloat(valInput.value) : 0;
                
                const pet = state.pets.find(p => p.id === petId);
                if (pet) {
                    if (!pet.health) {
                        pet.health = {
                            vaccines: [],
                            vermifuges: [],
                            appointments: [],
                            weightHistory: [{ date: 'Jun', weight: pet.weight || 0 }]
                        };
                    }
                    if (type === 'vaccine') {
                        pet.health.vaccines.push({
                            id: `v-${Date.now()}`,
                            name: title,
                            date: date,
                            nextDate: nextDate || date,
                            status: 'done'
                        });
                    } else if (type === 'vermifuge') {
                        pet.health.vermifuges.push({
                            id: `vm-${Date.now()}`,
                            name: title,
                            date: date,
                            nextDate: nextDate || date,
                            status: 'done'
                        });
                    } else if (type === 'appointment') {
                        pet.health.appointments.push({
                            id: `a-${Date.now()}`,
                            title: title,
                            date: date,
                            time: '10:00', // default mock
                            type: 'appointment'
                        });
                    } else if (type === 'weight') {
                        // Add to weight history
                        // Format Month name (mock translation of date to month tag)
                        const dateObj = new Date(date + 'T00:00:00');
                        const monthsList = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                        const monthTag = monthsList[dateObj.getMonth()];
                        
                        pet.health.weightHistory.push({
                            date: monthTag,
                            weight: value
                        });
                        pet.weight = value; // update current weight
                    }
                    
                    saveStateToLocalStorage();
                    closeModal(document.getElementById('health-modal'));
                    healthForm.reset();
                    showToast('Ficha de saúde atualizada e salva!', 'success');
                    
                    if (state.activeTab === 'health') {
                        renderCurrentTab('health');
                    }
                }
            });
        }
    } catch (err) {
        console.error("Error binding health-event-form:", err);
    }

    // 4. Submit Adoption Application
    try {
        const adoptForm = document.getElementById('adopt-form');
        if (adoptForm) {
            adoptForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const petId = document.getElementById('adopt-pet-id').value;
                const pet = state.adoptionPets.find(p => p.id === petId);
                
                if (pet) {
                    const newApp = {
                        id: `app-${Date.now()}`,
                        petId: petId,
                        petName: pet.name,
                        ngo: pet.ngo,
                        status: 'Aprovada! 🎉'
                    };
                    
                    state.adoptionApplications.push(newApp);
                    pet.status = 'Adotado! ❤️';
                    saveStateToLocalStorage();
                    closeModal(document.getElementById('adoption-modal'));
                    adoptForm.reset();
                    showToast(`Parabéns! Você adotou o ${pet.name}! Certificado gerado com sucesso. 📜`, 'success');
                    
                    // Exibir certidão imediatamente para comemoração
                    showAdoptionCertificate(petId);
                    
                    if (state.activeTab === 'adoption') {
                        renderCurrentTab('adoption');
                    }
                }
            });
        }
    } catch (err) {
        console.error("Error binding adopt-form:", err);
    }

    // 5. Create Event
    try {
        const eventForm = document.getElementById('create-event-form');
        if (eventForm) {
            eventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('event-title').value;
                const date = document.getElementById('event-date').value;
                const time = document.getElementById('event-time').value;
                const location = document.getElementById('event-location').value;
                const desc = document.getElementById('event-desc').value;
                
                const newEvent = {
                    id: `ev-${Date.now()}`,
                    title: title,
                    date: date,
                    time: time,
                    location: location,
                    desc: desc,
                    rsvps: 1, // current user auto-joins
                    userJoined: true
                };
                
                state.events.unshift(newEvent);
                saveStateToLocalStorage();
                closeModal(document.getElementById('event-modal'));
                eventForm.reset();
                showToast('Seu evento comunitário de pet foi criado!', 'success');
                
                if (state.activeTab === 'events') {
                    renderCurrentTab('events');
                }
            });
        }
    } catch (err) {
        console.error("Error binding create-event-form:", err);
    }

    // 6. Create Forum Thread
    try {
        const forumForm = document.getElementById('create-forum-form');
        if (forumForm) {
            forumForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const cat = document.getElementById('forum-category').value;
                const title = document.getElementById('forum-title').value;
                const body = document.getElementById('forum-body').value;
                
                const newThread = {
                    id: `th-${Date.now()}`,
                    category: cat,
                    title: title,
                    author: state.tutor.name,
                    body: body,
                    replies: []
                };
                
                state.forum.unshift(newThread);
                saveStateToLocalStorage();
                closeModal(document.getElementById('forum-modal'));
                forumForm.reset();
                showToast('Novo tópico publicado no fórum!', 'success');
                
                if (state.activeTab === 'communities') {
                    renderCurrentTab('communities');
                }
            });
        }
    } catch (err) {
        console.error("Error binding create-forum-form:", err);
    }

    // 7. Edit Profile Tutor
    try {
        const editProfileForm = document.getElementById('edit-profile-form');
        if (editProfileForm) {
            editProfileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                saveTutorProfileChanges();
            });
        }
    } catch (err) {
        console.error("Error binding edit-profile-form:", err);
    }

    // 8. Submit SOS report
    try {
        const sosForm = document.getElementById('sos-pet-form');
        if (sosForm) {
            sosForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const type = document.getElementById('sos-type').value;
                const location = document.getElementById('sos-location').value;
                const details = document.getElementById('sos-details').value;
                
                const newReport = {
                    id: `rep-${Date.now()}`,
                    type: type,
                    target: location,
                    details: details,
                    status: (type === 'Animal Perdido' || type === 'Animal de Rua') ? 'Busca Ativa' : 'Em Análise',
                    createdAt: new Date().toISOString().split('T')[0]
                };
                
                // Push to local state reports
                if (!state.reports) state.reports = [];
                state.reports.unshift(newReport);
                
                // Enviar mensagens de chat automáticas para ONGs e Pet Shops
                const loggedInUserEmail = state.currentUserEmail || 'carlos@petconect.com';
                const reporterId = (state.tutor && state.tutor.id) || 'carlos';
                const reporterName = (state.tutor && state.tutor.name) || 'Carlos Henrique';
                const reporterAvatar = (state.tutor && state.tutor.avatar) || 'assets/tutor_avatar.png';
                
                const commercialUsers = state.users.filter(u => 
                    u.tutor && 
                    (u.tutor.type === 'institution' || u.tutor.type === 'petshop') && 
                    u.email !== loggedInUserEmail
                );
                
                const nowMsg = new Date();
                const timeStr = `${String(nowMsg.getHours()).padStart(2, '0')}:${String(nowMsg.getMinutes()).padStart(2, '0')}`;
                const messageText = `🚨 *ALERTA SOS PET* 🚨\n*Tipo:* ${type}\n*Local:* ${location}\n*Detalhes:* ${details}\n\n_Favor verificar a ocorrência!_ 🐾`;
                
                commercialUsers.forEach(u => {
                    const targetId = u.tutor.id || `f-${u.email}`;
                    
                    // 1. Visão do tutor (mensagem enviada para a ONG)
                    let targetContact = state.friends.find(f => f.id === targetId);
                    if (!targetContact) {
                        targetContact = {
                            id: targetId,
                            name: u.tutor.name,
                            avatar: u.tutor.avatar || 'assets/dog_avatar.png',
                            distance: '1.0km',
                            online: true,
                            messages: []
                        };
                        state.friends.push(targetContact);
                    }
                    targetContact.messages.push({
                        sender: 'sent',
                        text: messageText,
                        time: timeStr
                    });
                    
                    // 2. Visão da ONG (mensagem recebida do tutor)
                    let reporterContact = state.friends.find(f => f.id === reporterId);
                    if (!reporterContact) {
                        reporterContact = {
                            id: reporterId,
                            name: reporterName,
                            avatar: reporterAvatar,
                            distance: '1.2km',
                            online: true,
                            messages: []
                        };
                        state.friends.push(reporterContact);
                    }
                    reporterContact.messages.push({
                        sender: 'received',
                        text: messageText,
                        time: timeStr
                    });
                });
                
                saveStateToLocalStorage();
                
                // Try to sync with backend api reports endpoint
                try {
                    await fetch('/api/reports', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            targetId: location,
                            targetType: 'User', // default schema fallback
                            reason: type,
                            description: details
                        })
                    });
                } catch (err) {
                    console.error('Failed to report to backend API directly', err);
                }
                
                // Close dialog, reset form, show toast
                const dialog = document.getElementById('sos-modal-dialog');
                if (dialog) {
                    dialog.classList.remove('active');
                    dialog.style.display = 'none';
                }
                sosForm.reset();
                
                showToast('ALERTA SOS ENVIADO! Ocorrência registrada com sucesso.', 'warning');
                
                // Refresh view dynamically if currently on safety tab
                if (state.activeTab === 'safety') {
                    renderCurrentTab('safety');
                }
            });
        }
    } catch (err) {
        console.error("Error binding sos-pet-form:", err);
    }
}


/* ==========================================================================
   THEME TOGGLING & APP INITIALIZATION
   ========================================================================== */

function initThemeToggler() {
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (state.theme === 'light') {
                state.theme = 'dark';
            } else {
                state.theme = 'light';
            }
            saveStateToLocalStorage();
            
            document.body.classList.toggle('dark-mode', state.theme === 'dark');
            updateThemeUIElements();
            showToast(`Modo ${state.theme === 'dark' ? 'Escuro' : 'Claro'} ativado!`, 'success');
        });
    }
}

function updateThemeUIElements() {
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        const isDark = state.theme === 'dark';
        themeBtn.querySelector('.theme-icon').innerText = isDark ? '🌙' : '☀️';
        themeBtn.querySelector('.theme-text').innerText = isDark ? 'Modo Escuro' : 'Modo Claro';
    }
}

// Binder for general clicks and notifications
function initGeneralBinds() {
    const bellBtn = document.getElementById('bell-btn');
    if (bellBtn) {
        bellBtn.addEventListener('click', () => {
            showToast('Você não possui alertas urgentes de saúde pendentes hoje.', 'info');
            document.getElementById('notif-count').style.display = 'none';
        });
    }
    
    const miniProfileBtn = document.getElementById('mini-profile-btn');
    if (miniProfileBtn) {
        miniProfileBtn.addEventListener('click', () => navigateToTab('profile'));
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            handleLogout();
        });
    }
}

// Bind Navigation clicks
function initNavigationClicks() {
    document.querySelectorAll('.sidebar-nav button, .bottom-nav button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            if (tabId === 'profile') {
                state.visitedProfile = null;
            }
            navigateToTab(tabId);
        });
    });
}

// App Core Init
window.addEventListener('DOMContentLoaded', async () => {
    await initAppState();
    updateGlobalUIHeaders();
    initNavigationClicks();
    initThemeToggler();
    initModalCloseTriggers();
    initFormSubmitBinds();
    initGeneralBinds();
    
    // Navigate to default tab on load
    navigateToTab(state.activeTab);
});

// SOS Submit mock
function submitSOS() {
    document.getElementById('sos-modal-dialog').style.display = 'none';
    showToast('ALERTA SOS ENVIADO! ONGs próximas foram notificadas.', 'warning');
}

/* ==========================================================================
   REELS TAB SWITCHING & STORIES DYNAMIC FUNCTIONS
   ========================================================================== */

function switchReelsTab(tabName) {
    state.activeReelsTab = tabName;
    saveStateToLocalStorage();
    const viewport = document.getElementById('viewport');
    if (viewport) {
        renderReelsView(viewport);
    }
}

function renderStoriesList() {
    let html = '';
    
    // 1. Render User Story
    const userStory = state.stories ? state.stories.find(s => s.isUser) : null;
    if (userStory) {
        html += `
        <div class="story-circle ${userStory.viewed ? 'viewed' : ''}" onclick="openStoryViewer('${userStory.id}')">
            <div class="story-img-wrap">
                <img src="${userStory.authorAvatar}" alt="Seu story">
            </div>
            <span class="story-name">Seu story</span>
        </div>
        `;
    } else {
        html += `
        <div class="story-circle" onclick="openAddStoryModal()">
            <div class="story-img-wrap no-story">
                <img src="${state.tutor.avatar}" alt="Seu story">
                <div class="add-story-badge">+</div>
            </div>
            <span class="story-name">Seu story</span>
        </div>
        `;
    }
    
    // 2. Render other stories
    if (state.stories) {
        const otherStories = state.stories.filter(s => !s.isUser);
        otherStories.forEach(story => {
            html += `
            <div class="story-circle ${story.viewed ? 'viewed' : ''}" onclick="openStoryViewer('${story.id}')">
                <div class="story-img-wrap">
                    <img src="${story.authorAvatar}" alt="${story.authorName}">
                </div>
                <span class="story-name">${story.authorName}</span>
            </div>
            `;
        });
    }
    
    return html;
}

let storyTimeout = null;
let storyInterval = null;
let currentStoryId = null;
let storyPaused = false;
let storyElapsed = 0;
const storyDuration = 4000;

function openStoryViewer(storyId) {
    currentStoryId = storyId;
    const story = state.stories.find(s => s.id === storyId);
    if (!story) return;
    
    // Mark story as viewed
    story.viewed = true;
    saveStateToLocalStorage();
    
    // Re-render feed stories list to update border
    const feedStoriesContainer = document.querySelector('.stories-container');
    if (feedStoriesContainer) {
        feedStoriesContainer.innerHTML = renderStoriesList();
    }
    
    // Check if modal overlay already exists
    let modal = document.getElementById('story-viewer-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'story-viewer-modal';
        modal.className = 'story-viewer-overlay';
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'flex';
    
    // Reset play/pause state
    storyPaused = false;
    storyElapsed = 0;
    
    renderStoryContent(story);
}

function renderStoryContent(story) {
    const modal = document.getElementById('story-viewer-modal');
    if (!modal) return;
    
    // Clear existing intervals
    if (storyTimeout) clearTimeout(storyTimeout);
    if (storyInterval) clearInterval(storyInterval);
    
    const storiesList = state.stories;
    const currentIndex = storiesList.findIndex(s => s.id === story.id);
    
    // Format timestamp mock (e.g. 2h, 4h, 22h, 1d)
    let timeLabel = '2h';
    if (story.id === 'story-rex') timeLabel = '4h';
    if (story.id === 'story-mel') timeLabel = '8h';
    if (story.id === 'story-thor') timeLabel = '12h';
    if (story.id === 'story-bidu') timeLabel = '1d';
    if (story.isUser) timeLabel = 'Agora';

    const isLiked = story.liked || false;
    const likeBtnClass = isLiked ? 'story-footer-action-btn like-story-btn liked' : 'story-footer-action-btn like-story-btn';

    modal.innerHTML = `
        <div class="story-outer-wrapper">
            <!-- Desktop Left Navigation Arrow -->
            <button class="desktop-story-arrow prev-btn" onclick="navigateStories('prev')" style="margin-right: 10px;">&lsaquo;</button>
            
            <div class="story-viewer-container">
                <!-- Progress Bars -->
                <div class="story-progress-bar-wrap">
                    ${storiesList.map((s, idx) => `
                        <div class="story-progress-bar">
                            <div class="story-progress-fill" id="progress-fill-${s.id}" style="width: ${idx < currentIndex ? '100%' : '0%'}"></div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Header -->
                <div class="story-header">
                    <div class="story-author-info">
                        <img src="${story.authorAvatar}" class="story-author-avatar" alt="Avatar">
                        <span class="story-author-name">${story.authorName}</span>
                        <span class="story-time-ago">${timeLabel}</span>
                    </div>
                    <div class="story-controls">
                        <button class="story-control-btn" id="story-pause-btn" onclick="toggleStoryPause()" title="Pausar / Reproduzir">⏸️</button>
                        <button class="story-close-btn" onclick="closeStoryViewer()">&times;</button>
                    </div>
                </div>
                
                <!-- Mobile Navigation Areas (Left 30% / Right 30%) -->
                <button class="story-nav-btn prev" onclick="navigateStories('prev')"></button>
                <button class="story-nav-btn next" onclick="navigateStories('next')"></button>
                
                <!-- Image Content -->
                <div class="story-image-wrap" onclick="toggleStoryPause()">
                    <img src="${story.image}" class="story-image" alt="Story content">
                </div>
                
                <!-- Footer Quick Reply & Quick Reactions -->
                <div class="story-footer">
                    <!-- Instagram Quick Reactions Bar -->
                    <div class="story-reactions-row">
                        <button class="story-reaction-emoji" onclick="sendQuickReaction('😂', '${story.id}')">😂</button>
                        <button class="story-reaction-emoji" onclick="sendQuickReaction('😮', '${story.id}')">😮</button>
                        <button class="story-reaction-emoji" onclick="sendQuickReaction('😍', '${story.id}')">😍</button>
                        <button class="story-reaction-emoji" onclick="sendQuickReaction('😢', '${story.id}')">😢</button>
                        <button class="story-reaction-emoji" onclick="sendQuickReaction('👏', '${story.id}')">👏</button>
                        <button class="story-reaction-emoji" onclick="sendQuickReaction('🔥', '${story.id}')">🔥</button>
                    </div>
                    
                    <div class="story-footer-input-row">
                        <input type="text" id="story-reply-text" class="story-reply-input" placeholder="Enviar mensagem para ${story.authorName.split(' ')[0]}..." onfocus="pauseStoryOnFocus()" onblur="resumeStoryOnBlur()">
                        
                        <button class="${likeBtnClass}" id="like-story-btn" onclick="toggleLikeStory('${story.id}')" title="Curtir Story">
                            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </button>
                        
                        <button class="story-footer-action-btn" onclick="submitStoryReply('${story.id}')" title="Enviar resposta">
                            <svg viewBox="0 0 24 24" style="stroke:none; fill:currentColor;"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Desktop Right Navigation Arrow -->
            <button class="desktop-story-arrow next-btn" onclick="navigateStories('next')" style="margin-left: 10px;">&rsaquo;</button>
        </div>
    `;
    
    // Bind Enter key inside input
    const input = document.getElementById('story-reply-text');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitStoryReply(story.id);
        });
    }

    // Start progress animation
    resumeStoryTimer();
}

function pauseStoryOnFocus() {
    if (!storyPaused) {
        toggleStoryPause();
        // Show reactions bar immediately
        const rx = document.querySelector('.story-reactions-row');
        if (rx) rx.classList.add('active');
    }
}

function resumeStoryOnBlur() {
    // Slight delay so clicks on reactions aren't cancelled by blur
    setTimeout(() => {
        if (storyPaused) {
            const replyInput = document.getElementById('story-reply-text');
            // Only resume if user is not typing or focused on input
            if (document.activeElement !== replyInput) {
                toggleStoryPause();
                const rx = document.querySelector('.story-reactions-row');
                if (rx) rx.classList.remove('active');
            }
        }
    }, 200);
}

function toggleStoryPause() {
    storyPaused = !storyPaused;
    const btn = document.getElementById('story-pause-btn');
    if (btn) {
        btn.innerText = storyPaused ? '▶️' : '⏸️';
    }
    
    if (storyPaused) {
        if (storyTimeout) clearTimeout(storyTimeout);
        if (storyInterval) clearInterval(storyInterval);
    } else {
        resumeStoryTimer();
    }
}

function resumeStoryTimer() {
    if (storyTimeout) clearTimeout(storyTimeout);
    if (storyInterval) clearInterval(storyInterval);
    
    const progressFill = document.getElementById(`progress-fill-${currentStoryId}`);
    const intervalTime = 50;
    
    storyInterval = setInterval(() => {
        if (!storyPaused) {
            storyElapsed += intervalTime;
            const pct = Math.min(100, (storyElapsed / storyDuration) * 100);
            if (progressFill) progressFill.style.width = `${pct}%`;
        }
    }, intervalTime);
    
    storyTimeout = setTimeout(() => {
        navigateStories('next');
    }, storyDuration - storyElapsed);
}

function navigateStories(direction) {
    if (!currentStoryId) return;
    
    const storiesList = state.stories;
    const currentIndex = storiesList.findIndex(s => s.id === currentStoryId);
    
    if (direction === 'next') {
        if (currentIndex < storiesList.length - 1) {
            openStoryViewer(storiesList[currentIndex + 1].id);
        } else {
            closeStoryViewer();
        }
    } else if (direction === 'prev') {
        if (currentIndex > 0) {
            openStoryViewer(storiesList[currentIndex - 1].id);
        } else {
            openStoryViewer(storiesList[0].id);
        }
    }
}

function closeStoryViewer() {
    if (storyTimeout) clearTimeout(storyTimeout);
    if (storyInterval) clearInterval(storyInterval);
    
    const modal = document.getElementById('story-viewer-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentStoryId = null;
    storyPaused = false;
    storyElapsed = 0;
}

function toggleLikeStory(storyId) {
    const story = state.stories.find(s => s.id === storyId);
    if (!story) return;
    
    story.liked = !story.liked;
    saveStateToLocalStorage();
    
    const btn = document.getElementById('like-story-btn');
    if (btn) {
        btn.classList.toggle('liked', story.liked);
        if (story.liked) {
            showToast(`Você curtiu o story de ${story.authorName}! ❤️`, 'secondary');
            triggerFloatingEmoji('❤️');
        } else {
            showToast(`Removido das curtidas.`, 'info');
        }
    }
}

function triggerFloatingEmoji(emoji) {
    const container = document.querySelector('.story-viewer-container');
    if (!container) return;
    
    const element = document.createElement('div');
    element.className = 'floating-emoji-particle';
    element.innerText = emoji;
    
    const randomLeft = 40 + Math.random() * 200;
    element.style.left = `${randomLeft}px`;
    
    container.appendChild(element);
    
    setTimeout(() => {
        element.remove();
    }, 1500);
}

function sendQuickReaction(emoji, storyId) {
    triggerFloatingEmoji(emoji);
    
    const story = state.stories.find(s => s.id === storyId);
    if (!story) return;
    
    let targetFriendId = story.friendId;
    if (!targetFriendId) {
        const matchingFriend = state.friends.find(f => f.name.toLowerCase().includes(story.authorName.toLowerCase().split(' ')[0]));
        if (matchingFriend) {
            targetFriendId = matchingFriend.id;
        } else {
            targetFriendId = state.friends[0].id;
        }
    }
    
    const friend = state.friends.find(f => f.id === targetFriendId);
    if (friend) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        friend.messages.push({
            sender: 'sent',
            text: `*Reagiu ao seu Story:* ${emoji}`,
            time: timeStr
        });
        saveStateToLocalStorage();
        
        showToast(`Reação ${emoji} enviada para ${story.authorName}! 🐾`, 'success');
        
        setTimeout(() => {
            simulateBotReply(friend.id);
        }, 1500);
    }
}

function submitStoryReply(storyId) {
    const input = document.getElementById('story-reply-text');
    if (!input || input.value.trim() === '') return;
    
    const replyText = input.value.trim();
    const story = state.stories.find(s => s.id === storyId);
    if (!story) return;
    
    let targetFriendId = story.friendId;
    if (!targetFriendId) {
        const matchingFriend = state.friends.find(f => f.name.toLowerCase().includes(story.authorName.toLowerCase().split(' ')[0]));
        if (matchingFriend) {
            targetFriendId = matchingFriend.id;
        } else {
            targetFriendId = state.friends[0].id;
        }
    }
    
    const friend = state.friends.find(f => f.id === targetFriendId);
    if (friend) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        friend.messages.push({
            sender: 'sent',
            text: `*Respondeu ao seu Story:* "${replyText}"`,
            time: timeStr
        });
        saveStateToLocalStorage();
        
        showToast(`Resposta enviada para ${story.authorName}! 🐾`, 'success');
        
        // Auto bot response simulation
        setTimeout(() => {
            simulateBotReply(friend.id);
        }, 1500);
    }
    
    closeStoryViewer();
}

function openAddStoryModal() {
    let modal = document.getElementById('add-story-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'add-story-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card">
                <div class="modal-header">
                    <h2>Adicionar Novo Story 📸✨</h2>
                    <button class="close-modal-btn" onclick="closeAddStoryModal()">&times;</button>
                </div>
                <form id="create-story-form">
                    <div class="form-group">
                        <label>Escolha uma imagem para o seu Story:</label>
                        <div class="image-preset-picker">
                            <label class="preset-option">
                                <input type="radio" name="story-img" value="assets/feed_dog_park.png" checked>
                                <img src="assets/feed_dog_park.png" alt="Parque">
                                <span>No Parque 🌳</span>
                            </label>
                            <label class="preset-option">
                                <input type="radio" name="story-img" value="assets/dog_avatar.png">
                                <img src="assets/dog_avatar.png" alt="Rex">
                                <span>Rex Feliz 🐾</span>
                            </label>
                            <label class="preset-option">
                                <input type="radio" name="story-img" value="assets/cat_avatar.png">
                                <img src="assets/cat_avatar.png" alt="Mel">
                                <span>Mel Elegante ✨</span>
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary cancel-modal-btn" onclick="closeAddStoryModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Adicionar ao Story</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        const form = document.getElementById('create-story-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedImg = document.querySelector('input[name="story-img"]:checked').value;
            
            const userStory = {
                id: 'story-user',
                authorName: 'Carlos Henrique (Você)',
                authorAvatar: state.tutor.avatar,
                image: selectedImg,
                viewed: false,
                isUser: true
            };
            
            state.stories = state.stories.filter(s => !s.isUser);
            state.stories.unshift(userStory);
            saveStateToLocalStorage();
            
            closeAddStoryModal();
            showToast('Seu story foi adicionado com sucesso! 📸✨', 'success');
            
            const feedStoriesContainer = document.querySelector('.stories-container');
            if (feedStoriesContainer) {
                feedStoriesContainer.innerHTML = renderStoriesList();
            }
        });
    }
    
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function closeAddStoryModal() {
    const modal = document.getElementById('add-story-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// ============================================================
// PET SHOP PREMIUM PLANS MANAGEMENT & SIMULATED CHECKOUT
// ============================================================

function openPlanManagerModal() {
    let modal = document.getElementById('plan-manager-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'plan-manager-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.backdropFilter = 'blur(4px)';
        modal.style.zIndex = '9999';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.padding = '20px';
        modal.style.boxSizing = 'border-box';
        document.body.appendChild(modal);
    }
    
    const currentPlan = state.tutor.activePlan || 'Bronze';
    
    modal.innerHTML = `
        <div style="background: #ffffff; border-radius: 20px; width: 100%; max-width: 820px; max-height: 90vh; overflow-y: auto; padding: 36px; box-sizing: border-box; position: relative; animation: modalFadeIn 0.3s ease-out; font-family: 'Nunito', sans-serif;">
            
            <button onclick="closePlanManagerModal()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #888888;">&times;</button>
            
            <div style="text-align: center; margin-bottom: 28px;">
                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #820ad1; background: rgba(130, 10, 209, 0.08); padding: 4px 10px; border-radius: 4px; letter-spacing: 0.5px; display: inline-block;">Gerenciamento de Assinatura</span>
                <h2 style="font-size: 26px; font-weight: 900; margin: 8px 0 4px 0; color: #111111;">Escolha o Plano do seu Pet Shop</h2>
                <p style="font-size: 14px; color: #666666; margin: 0;">Seu plano atual: <strong style="color: #820ad1;">${currentPlan}</strong></p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 20px; align-items: stretch; margin-bottom: 8px;">
                
                <!-- Card Bronze -->
                <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; text-align: left; background: #ffffff;">
                    <span style="font-size: 20px; margin-bottom: 6px;">🥉</span>
                    <h3 style="font-size: 17px; font-weight: 800; margin: 0; color: #111111;">Plano Bronze</h3>
                    <p style="font-size: 12px; color: #666666; margin: 4px 0 16px 0;">Presença digital básica.</p>
                    <div style="font-size: 24px; font-weight: 900; color: #111111; margin-bottom: 16px;">
                        R$ 29,90 <span style="font-size: 12px; font-weight: 400; color: #666666;">/mês</span>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0 0 24px 0; font-size: 12.5px; color: #555555; display: flex; flex-direction: column; gap: 8px; flex: 1;">
                        <li>✔ Perfil comercial básico</li>
                        <li>✔ Cadastro de endereço e telefone</li>
                        <li>✔ Limite de 3 agendamentos/mês</li>
                    </ul>
                    ${currentPlan === 'Bronze' ? `
                        <button disabled style="width: 100%; padding: 10px; border: 1.5px solid #d3d3d3; background: #f5f5f5; color: #888888; font-size: 13px; font-weight: 800; border-radius: 20px; cursor: not-allowed; font-family: inherit; text-align: center;">Plano Ativo</button>
                    ` : `
                        <button onclick="selectPlan('Bronze', 29.90)" style="width: 100%; padding: 10px; border: 1.5px solid #820ad1; background: transparent; color: #820ad1; font-size: 13px; font-weight: 800; border-radius: 20px; cursor: pointer; font-family: inherit; text-align: center;">Alterar para Bronze</button>
                    `}
                </div>

                <!-- Card Gold -->
                <div style="border: 2px solid #820ad1; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; text-align: left; background: #ffffff; position: relative;">
                    <div style="position: absolute; top: -10px; right: 15px; background: #820ad1; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">MELHOR VALOR</div>
                    <span style="font-size: 20px; margin-bottom: 6px;">🌟</span>
                    <h3 style="font-size: 17px; font-weight: 800; margin: 0; color: #111111;">Pet Gold</h3>
                    <p style="font-size: 12px; color: #666666; margin: 4px 0 16px 0;">Busca prioritária e agendamentos ilimitados.</p>
                    <div style="font-size: 24px; font-weight: 900; color: #111111; margin-bottom: 16px;">
                        R$ 64,99 <span style="font-size: 12px; font-weight: 400; color: #666666;">/mês</span>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0 0 24px 0; font-size: 12.5px; color: #555555; display: flex; flex-direction: column; gap: 8px; flex: 1;">
                        <li>✔ Tudo do plano Bronze</li>
                        <li>✔ Selo de Verificação Destaque 🐾</li>
                        <li>✔ Agendamentos mensais ilimitados</li>
                        <li>✔ Exposição prioritária na busca local</li>
                    </ul>
                    ${currentPlan === 'Pet Gold' ? `
                        <button disabled style="width: 100%; padding: 10px; border: 1.5px solid #d3d3d3; background: #f5f5f5; color: #888888; font-size: 13px; font-weight: 800; border-radius: 20px; cursor: not-allowed; font-family: inherit; text-align: center;">Plano Ativo</button>
                    ` : `
                        <button onclick="selectPlan('Pet Gold', 64.99)" style="width: 100%; padding: 10px; border: none; background: #820ad1; color: #ffffff; font-size: 13px; font-weight: 800; border-radius: 20px; cursor: pointer; font-family: inherit; text-align: center;">Assinar Gold 🚀</button>
                    `}
                </div>

                <!-- Card Ultravioleta -->
                <div style="background: linear-gradient(135deg, #2b1055, #1c0733); border: 1px solid #49287c; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; text-align: left; color: #ffffff;">
                    <span style="font-size: 20px; margin-bottom: 6px;">💜</span>
                    <h3 style="font-size: 17px; font-weight: 800; margin: 0; color: #d39dfc;">Ultravioleta</h3>
                    <p style="font-size: 12px; color: #bca0dc; margin: 4px 0 16px 0;">Banner no feed e tudo dos outros planos.</p>
                    <div style="font-size: 24px; font-weight: 900; color: #ffffff; margin-bottom: 16px;">
                        R$ 150,00 <span style="font-size: 12px; font-weight: 400; color: #bca0dc;">/mês</span>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0 0 24px 0; font-size: 12.5px; color: #e1d3f0; display: flex; flex-direction: column; gap: 8px; flex: 1;">
                        <li>✔ <strong>Tudo do plano Pet Gold</strong></li>
                        <li>✔ <strong>Selo Especial Ultravioleta Patrocinador Oficial 💜</strong></li>
                        <li>✔ <strong>Banner Patrocinado</strong> no feed dos tutores</li>
                        <li>✔ Campanhas de cupons e descontos ilimitadas</li>
                        <li>✔ Taxa zero em agendamentos</li>
                    </ul>
                    ${currentPlan === 'Ultravioleta' ? `
                        <button disabled style="width: 100%; padding: 10px; border: 1.5px solid #49287c; background: rgba(255,255,255,0.1); color: #bca0dc; font-size: 13px; font-weight: 800; border-radius: 20px; cursor: not-allowed; font-family: inherit; text-align: center;">Plano Ativo</button>
                    ` : `
                        <button onclick="selectPlan('Ultravioleta', 150.00)" style="width: 100%; padding: 10px; border: none; background: linear-gradient(90deg, #820ad1, #a872e6); color: #ffffff; font-size: 13px; font-weight: 800; border-radius: 20px; cursor: pointer; font-family: inherit; text-align: center; box-shadow: 0 4px 10px rgba(130,10,209,0.2);">Assinar Ultravioleta 💎</button>
                    `}
                </div>

            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

function closePlanManagerModal() {
    const modal = document.getElementById('plan-manager-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function selectPlan(planName, price) {
    const modal = document.getElementById('plan-manager-modal');
    if (!modal) return;
    
    modal.innerHTML = `
        <div style="background: #ffffff; border-radius: 20px; width: 100%; max-width: 480px; padding: 36px; box-sizing: border-box; position: relative; animation: modalFadeIn 0.3s ease-out; font-family: 'Nunito', sans-serif; text-align: left;">
            <button onclick="openPlanManagerModal()" style="position: absolute; top: 20px; left: 20px; background: none; border: none; font-size: 16px; cursor: pointer; color: #820ad1; font-weight: 800; display: flex; align-items: center; gap: 4px;">🡨 Voltar</button>
            <button onclick="closePlanManagerModal()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #888888;">&times;</button>
            
            <div style="text-align: center; margin-top: 20px; margin-bottom: 24px;">
                <span style="font-size: 32px;">💳</span>
                <h3 style="font-size: 20px; font-weight: 900; margin: 8px 0 4px 0; color: #111111;">Pagamento Simulado</h3>
                <p style="font-size: 14px; color: #666666; margin: 0;">Plano selecionado: <strong style="color:#820ad1;">${planName}</strong></p>
                <div style="font-size: 28px; font-weight: 900; color: #111111; margin-top: 10px;">
                    R$ ${price.toFixed(2).replace('.', ',')} <span style="font-size: 14px; font-weight: 400; color: #666666;">/mês</span>
                </div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 28px;">
                <div style="display: flex; gap: 10px;">
                    <button id="pay-method-pix" onclick="togglePayMethod('pix')" style="flex: 1; padding: 12px; background: #f6f0fc; border: 2px solid #820ad1; border-radius: 10px; cursor: pointer; font-family: inherit; font-size: 13.5px; font-weight: 800; color: #820ad1;">⚡ PIX</button>
                    <button id="pay-method-card" onclick="togglePayMethod('card')" style="flex: 1; padding: 12px; background: #ffffff; border: 1.5px solid #d3d3d3; border-radius: 10px; cursor: pointer; font-family: inherit; font-size: 13.5px; font-weight: 800; color: #666666;">💳 Cartão</button>
                </div>
                
                <div id="payment-pix-content" style="display: block; text-align: center; background: #fdfdfd; border: 1px dashed #d3d3d3; border-radius: 12px; padding: 20px;">
                    <div style="width: 140px; height: 140px; background: #eeeeee; margin: 0 auto 12px auto; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                        <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap: 4px; width: 100px; height: 100px; padding: 10px; background: white; border: 1px solid #ddd;">
                            <div style="background:#111"></div><div style="background:#111"></div><div style="background:#111"></div><div style="background:#fff"></div><div style="background:#111"></div>
                            <div style="background:#111"></div><div style="background:#fff"></div><div style="background:#fff"></div><div style="background:#fff"></div><div style="background:#111"></div>
                            <div style="background:#fff"></div><div style="background:#fff"></div><div style="background:#111"></div><div style="background:#111"></div><div style="background:#fff"></div>
                            <div style="background:#111"></div><div style="background:#fff"></div><div style="background:#fff"></div><div style="background:#111"></div><div style="background:#111"></div>
                            <div style="background:#111"></div><div style="background:#111"></div><div style="background:#111"></div><div style="background:#fff"></div><div style="background:#111"></div>
                        </div>
                    </div>
                    <div style="font-size: 12.5px; color: #555555; margin-bottom: 12px;">Escaneie o QR Code acima para pagar ou copie a chave Pix.</div>
                    <button onclick="showToast('Chave PIX copiada para a área de transferência! (Simulado) 📋', 'success')" style="background: #f5f5f5; border: 1px solid #ccc; color: #333; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit;">
                        Copiar Chave Copia e Cola
                    </button>
                </div>
                
                <div id="payment-card-content" style="display: none; flex-direction: column; gap: 12px;">
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="font-size: 12px; font-weight: 700; color: #555555;">Número do Cartão</label>
                        <input type="text" placeholder="5555 5555 5555 5555" maxlength="19" style="padding: 10px 14px; border: 1px solid #d3d3d3; border-radius: 8px; font-size: 13.5px; font-family: inherit; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#820ad1'" onblur="this.style.borderColor='#d3d3d3'">
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <div style="flex: 1.5; display: flex; flex-direction: column; gap: 4px;">
                            <label style="font-size: 12px; font-weight: 700; color: #555555;">Validade</label>
                            <input type="text" placeholder="MM/AA" maxlength="5" style="padding: 10px 14px; border: 1px solid #d3d3d3; border-radius: 8px; font-size: 13.5px; font-family: inherit; outline: none;" onfocus="this.style.borderColor='#820ad1'" onblur="this.style.borderColor='#d3d3d3'">
                        </div>
                        <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
                            <label style="font-size: 12px; font-weight: 700; color: #555555;">CVV</label>
                            <input type="text" placeholder="123" maxlength="3" style="padding: 10px 14px; border: 1px solid #d3d3d3; border-radius: 8px; font-size: 13.5px; font-family: inherit; outline: none;" onfocus="this.style.borderColor='#820ad1'" onblur="this.style.borderColor='#d3d3d3'">
                        </div>
                    </div>
                </div>
            </div>
            
            <button onclick="confirmPlanPayment('${planName}')" id="confirm-payment-btn" style="width: 100%; padding: 14px; border: none; background: #820ad1; color: #ffffff; font-size: 14.5px; font-weight: 800; border-radius: 30px; cursor: pointer; transition: background 0.2s; font-family: inherit; text-align: center; box-shadow: 0 4px 12px rgba(130,10,209,0.15);">
                Confirmar Pagamento
            </button>
        </div>
    `;
}

function togglePayMethod(method) {
    const btnPix = document.getElementById('pay-method-pix');
    const btnCard = document.getElementById('pay-method-card');
    const pixContent = document.getElementById('payment-pix-content');
    const cardContent = document.getElementById('payment-card-content');
    
    if (method === 'pix') {
        btnPix.style.background = '#f6f0fc';
        btnPix.style.borderColor = '#820ad1';
        btnPix.style.color = '#820ad1';
        btnPix.style.borderWidth = '2px';
        
        btnCard.style.background = '#ffffff';
        btnCard.style.borderColor = '#d3d3d3';
        btnCard.style.color = '#666666';
        btnCard.style.borderWidth = '1.5px';
        
        pixContent.style.display = 'block';
        cardContent.style.display = 'none';
    } else {
        btnCard.style.background = '#f6f0fc';
        btnCard.style.borderColor = '#820ad1';
        btnCard.style.color = '#820ad1';
        btnCard.style.borderWidth = '2px';
        
        btnPix.style.background = '#ffffff';
        btnPix.style.borderColor = '#d3d3d3';
        btnPix.style.color = '#666666';
        btnPix.style.borderWidth = '1.5px';
        
        pixContent.style.display = 'none';
        cardContent.style.display = 'flex';
    }
}

function confirmPlanPayment(planName) {
    const btn = document.getElementById('confirm-payment-btn');
    if (btn) {
        btn.disabled = true;
        btn.style.background = '#d3d3d3';
        btn.innerHTML = `<span style="display:inline-block; animation: rotateSpinner 1s linear infinite; margin-right:8px;">⏳</span>Processando Pagamento...`;
    }
    
    setTimeout(() => {
        state.tutor.activePlan = planName;
        const user = state.users.find(u => u.tutor.name === state.tutor.name);
        if (user) {
            user.tutor.activePlan = planName;
        }
        saveStateToLocalStorage();
        
        const modal = document.getElementById('plan-manager-modal');
        if (modal) {
            modal.innerHTML = `
                <div style="background: #ffffff; border-radius: 20px; width: 100%; max-width: 440px; padding: 40px; box-sizing: border-box; text-align: center; animation: modalFadeIn 0.3s ease-out; font-family: 'Nunito', sans-serif;">
                    <div style="width: 70px; height: 70px; background: #e8f5e9; color: #2e7d32; font-size: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">✓</div>
                    <h3 style="font-size: 22px; font-weight: 900; margin: 0 0 8px 0; color: #111111;">Assinatura Ativa!</h3>
                    <p style="font-size: 14px; color: #555555; margin: 0 0 28px 0;">
                        Parabéns! Seu Pet Shop agora é assinante do plano <strong style="color:#820ad1;">${planName}</strong>. Suas vantagens comerciais já estão habilitadas!
                    </p>
                    <button onclick="closePlanManagerModal(); navigateToTab('profile');" style="width: 100%; padding: 12px; border: none; background: #2e7d32; color: #ffffff; font-size: 14px; font-weight: 800; border-radius: 30px; cursor: pointer; font-family: inherit;">
                        Voltar ao Perfil
                    </button>
                </div>
            `;
        }
        
        showToast(`Assinatura do plano ${planName} ativada com sucesso! 🎉`, 'success');
    }, 1500);
}

// ============================================================
// NGO PROFILE INTERACTIVE ACTIONS & ADOPTION CERTIFICATE
// ============================================================

function startAdoptionFlow(petName, petAvatar) {
    let modal = document.getElementById('adoption-flow-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'adoption-flow-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.backdropFilter = 'blur(4px)';
        modal.style.zIndex = '9999';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.padding = '20px';
        modal.style.boxSizing = 'border-box';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div style="background: #ffffff; border-radius: 20px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; padding: 30px; box-sizing: border-box; position: relative; animation: modalFadeIn 0.3s ease-out; font-family: 'Nunito', sans-serif; text-align: left;">
            <button onclick="closeAdoptionModal()" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: #888888;">&times;</button>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${petAvatar}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary); margin-bottom: 10px;" alt="${petName}">
                <h3 style="font-size: 20px; font-weight: 850; margin: 0; color: var(--text-main);">Processo de Adoção: ${petName}</h3>
                <p style="font-size: 13px; color: var(--text-muted); margin: 4px 0 0 0;">Preencha o formulário rápido para gerar a sua certidão de adoção</p>
            </div>
            
            <form onsubmit="confirmAdoptionForm(event, '${petName.replace(/'/g, "\\'")}', '${petAvatar}')" style="display: flex; flex-direction: column; gap: 12px;">
                <div style="display:flex; flex-direction:column; gap:4px;">
                    <label style="font-size:11.5px; font-weight:800; color:var(--text-muted);">Seu Nome Completo</label>
                    <input type="text" id="adopter-name" required placeholder="Insira o nome do adotante" style="padding:10px; border:1px solid var(--border-color); border-radius:8px; font-size:13px; background:var(--bg-input); color:var(--text-main); font-family:inherit;">
                </div>
                
                <div style="display:flex; flex-direction:column; gap:4px;">
                    <label style="font-size:11.5px; font-weight:800; color:var(--text-muted);">Tipo de Residência</label>
                    <select id="home-type" style="padding:10px; border:1px solid var(--border-color); border-radius:8px; font-size:13px; background:var(--bg-input); color:var(--text-main); font-family:inherit;">
                        <option value="Casa com quintal telado/murado">Casa com quintal telado/murado</option>
                        <option value="Apartamento com telas de proteção">Apartamento com telas de proteção</option>
                        <option value="Sítio / Área rural com segurança">Sítio / Área rural com segurança</option>
                    </select>
                </div>
                
                <div style="display:flex; flex-direction:column; gap:4px;">
                    <label style="font-size:11.5px; font-weight:800; color:var(--text-muted);">Já possui outros pets?</label>
                    <select id="other-pets" style="padding:10px; border:1px solid var(--border-color); border-radius:8px; font-size:13px; background:var(--bg-input); color:var(--text-main); font-family:inherit;">
                        <option value="Não">Não possuo outros pets</option>
                        <option value="Sim, cão(s)">Sim, cão(s)</option>
                        <option value="Sim, gato(s)">Sim, gato(s)</option>
                        <option value="Sim, cães e gatos">Sim, cães e gatos</option>
                    </select>
                </div>
                
                <div style="display:flex; flex-direction:column; gap:4px; margin-bottom: 8px;">
                    <label style="font-size:11.5px; font-weight:800; color:var(--text-muted);">Telefone/WhatsApp para Entrevista</label>
                    <input type="text" id="adopter-phone" required placeholder="(89) 99999-9999" oninput="maskPhone(this)" style="padding:10px; border:1px solid var(--border-color); border-radius:8px; font-size:13px; background:var(--bg-input); color:var(--text-main); font-family:inherit;">
                </div>
                
                <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 11.5px; color: var(--text-main); cursor: pointer; line-height: 1.3;">
                    <input type="checkbox" required style="margin-top: 2px;">
                    <span>Confirmo que tenho mais de 18 anos e me comprometo a fornecer alimentação saudável, abrigo seguro, vacinação anual e muito afeto para o pet.</span>
                </label>
                
                <button type="submit" id="adoption-submit-btn" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; font-size: 13.5px; font-weight: 800; border-radius: 8px; cursor: pointer; font-family: inherit; margin-top: 10px;">
                    Enviar Solicitação & Gerar Certificado 📜
                </button>
            </form>
        </div>
    `;
}

function closeAdoptionModal() {
    const modal = document.getElementById('adoption-flow-modal');
    if (modal) {
        modal.remove();
    }
}

function confirmAdoptionForm(event, petName, petAvatar) {
    event.preventDefault();
    
    const adopterName = document.getElementById('adopter-name').value;
    const phone = document.getElementById('adopter-phone').value;
    const home = document.getElementById('home-type').value;
    
    const submitBtn = document.getElementById('adoption-submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.background = '#d3d3d3';
        submitBtn.innerHTML = `<span style="display:inline-block; animation: rotateSpinner 1s linear infinite; margin-right:8px;">⏳</span>Processando Adoção Responsável...`;
    }
    
    setTimeout(() => {
        // Increment global adoption counter
        if (!state.adoptedCount) {
            state.adoptedCount = 142;
        }
        state.adoptedCount++;
        saveStateToLocalStorage();
        
        // Re-render tab stats if needed
        const stats = document.querySelectorAll('.stat-card .stat-val');
        stats.forEach(stat => {
            if (stat.innerText.includes('142') || stat.innerText.includes('143')) {
                stat.innerHTML = `❤️ ${state.adoptedCount}`;
            }
        });
        
        const currentDate = new Date().toLocaleDateString('pt-BR');
        
        // Show Adoption Certificate!
        const modal = document.getElementById('adoption-flow-modal');
        if (modal) {
            modal.innerHTML = `
                <div style="background: #fffcf5; border-radius: 20px; width: 100%; max-width: 600px; max-height: 95vh; overflow-y: auto; padding: 40px; box-sizing: border-box; position: relative; animation: modalFadeIn 0.3s ease-out; font-family: 'Georgia', serif; text-align: center; border: 6px double #820ad1; box-shadow: 0 12px 36px rgba(0,0,0,0.15);">
                    <button onclick="closeAdoptionModal()" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: #888888; font-family: sans-serif;">&times;</button>
                    
                    <div style="margin-bottom: 20px;">
                        <span style="font-size: 40px;">📜</span>
                        <h2 style="font-size: 24px; font-weight: 900; color: #820ad1; margin: 8px 0 2px 0; text-transform: uppercase; letter-spacing: 1px;">Certidão de Adoção Responsável</h2>
                        <span style="font-size: 11px; font-family: sans-serif; font-weight: 800; color: #666; text-transform: uppercase;">Programa Senac Aprendiz • Laboratório Juventudes</span>
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #e1d5f2; margin: 15px 0;">
                    
                    <p style="font-size: 15px; line-height: 1.6; color: #333333; text-align: justify; margin: 24px 0;">
                        Certificamos, para os devidos fins de amor e proteção animal, que o tutor(a) 
                        <strong>${adopterName}</strong> completou todas as etapas necessárias de entrevista e habilitou-se para a guarda responsável do pet 
                        <strong>${petName}</strong>, de espécie pré-avaliada, vacinado e acolhido, assumindo perante a comunidade o compromisso solene de zelar por sua saúde física, mental e bem-estar integral.
                    </p>
                    
                    <div style="display: flex; justify-content: center; gap: 30px; margin: 20px 0; align-items: center;">
                        <img src="${petAvatar}" style="width: 90px; height: 90px; border-radius: 12px; object-fit: cover; border: 2px solid #820ad1;" alt="${petName}">
                        <div style="text-align: left; font-family: sans-serif; font-size: 12.5px; color: #555555; display: flex; flex-direction: column; gap: 4px;">
                            <span>🐾 <strong>Pet Adotado:</strong> ${petName}</span>
                            <span>👤 <strong>Guarda Legal:</strong> ${adopterName}</span>
                            <span>📅 <strong>Data de Registro:</strong> ${currentDate}</span>
                            <span>📍 <strong>Unidade Emissora:</strong> Senac Picos - PI</span>
                        </div>
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #e1d5f2; margin: 15px 0;">
                    
                    <div style="display: flex; justify-content: space-around; margin-top: 24px; font-family: sans-serif; font-size: 11px; color: #777;">
                        <div style="text-align: center; border-top: 1px solid #ccc; width: 180px; padding-top: 6px;">
                            <strong>Senac - Picos</strong><br>Serviços de Supermercados
                        </div>
                        <div style="text-align: center; border-top: 1px solid #ccc; width: 180px; padding-top: 6px;">
                            <strong>ONG APAPI</strong><br>Piracicaba - SP
                        </div>
                    </div>
                    
                    <div style="margin-top: 30px; display: flex; gap: 10px;">
                        <button onclick="window.print()" style="flex: 1; padding: 12px; border: 1.5px solid #820ad1; background: transparent; color: #820ad1; font-size: 13px; font-weight: 800; border-radius: 20px; cursor: pointer; font-family: sans-serif;">Imprimir Certidão 🖨️</button>
                        <button onclick="closeAdoptionModal()" style="flex: 1; padding: 12px; border: none; background: #820ad1; color: white; font-size: 13px; font-weight: 800; border-radius: 20px; cursor: pointer; font-family: sans-serif;">Concluir Adoção 💚</button>
                    </div>
                </div>
            `;
        }
        
        showToast(`Adoção responsável de ${petName} registrada com sucesso! 📜`, 'success');
    }, 1500);
}

function toggleDonMethod(method) {
    const btnPix = document.getElementById('don-pix');
    const btnCard = document.getElementById('don-card');
    const btnTrans = document.getElementById('don-trans');
    const pixContent = document.getElementById('don-pix-content');
    const cardContent = document.getElementById('don-card-content');
    const transContent = document.getElementById('don-trans-content');
    
    if (!btnPix || !btnCard || !btnTrans || !pixContent || !cardContent || !transContent) return;
    
    // Reset all
    [btnPix, btnCard, btnTrans].forEach(btn => {
        btn.style.background = 'white';
        btn.style.borderColor = '#d3d3d3';
        btn.style.color = '#666666';
        btn.style.borderWidth = '1px';
    });
    
    pixContent.style.display = 'none';
    cardContent.style.display = 'none';
    transContent.style.display = 'none';
    
    // Apply active
    const activeBtn = method === 'pix' ? btnPix : (method === 'card' ? btnCard : btnTrans);
    const activeContent = method === 'pix' ? pixContent : (method === 'card' ? cardContent : transContent);
    
    activeBtn.style.background = '#f6f0fc';
    activeBtn.style.borderColor = '#820ad1';
    activeBtn.style.color = '#820ad1';
    activeBtn.style.borderWidth = '2px';
    activeContent.style.display = method === 'card' ? 'flex' : 'block';
}

function setDonValue(val) {
    const input = document.getElementById('don-value-input');
    if (input) {
        input.value = val;
    }
}

function simulateDonationSubmit() {
    const input = document.getElementById('don-value-input');
    if (!input) return;
    
    const value = parseFloat(input.value);
    if (isNaN(value) || value <= 0) {
        showToast('Por favor, insira um valor de doação válido.', 'error');
        return;
    }
    
    if (!state.campaignRaised) {
        state.campaignRaised = 14850;
    }
    state.campaignRaised += value;
    saveStateToLocalStorage();
    
    const target = 20000;
    const pct = Math.min(100, Math.round((state.campaignRaised / target) * 100));
    
    // Update DOM bar dynamically
    const bar = document.getElementById('campaign-progress-bar');
    if (bar) {
        bar.style.width = `${pct}%`;
        const percentageText = bar.parentElement.nextElementSibling;
        if (percentageText) {
            percentageText.innerText = `${pct}% concluído`;
        }
        const raisedText = bar.parentElement.previousElementSibling.firstElementChild;
        if (raisedText) {
            raisedText.innerText = `Arrecadado: R$ ${state.campaignRaised.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        }
    }
    
    // Update global stat count
    const stats = document.querySelectorAll('.stat-card .stat-val');
    stats.forEach(stat => {
        if (stat.innerText.includes('💰')) {
            stat.innerHTML = `💰 1`;
        }
    });
    
    showToast(`Obrigado! Sua doação de R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})} foi processada e repassada à ONG! 💜`, 'success');
}

function pledgeMaterial(materialName) {
    showToast(`Incrível! Sua promessa de doar ${materialName} foi enviada. A equipe da ONG entrará em contato via chat para agendar. 📦`, 'success');
}

function handleVolunteerSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('vol-name').value;
    
    if (!state.volunteerCount) {
        state.volunteerCount = 34;
    }
    state.volunteerCount++;
    saveStateToLocalStorage();
    
    // Update stat
    const stats = document.querySelectorAll('.stat-card .stat-val');
    stats.forEach(stat => {
        if (stat.innerText.includes('🤝') || stat.innerText.includes('34') || stat.innerText.includes('35')) {
            stat.innerHTML = `🤝 ${state.volunteerCount}`;
        }
    });
    
    showToast(`Obrigado, ${name}! Seu cadastro como voluntário foi concluído. Entraremos em contato via WhatsApp! 🤝`, 'success');
    event.target.reset();
}

function handleReviewSubmit(event) {
    event.preventDefault();
    const scoreVal = parseInt(document.getElementById('new-review-score').value);
    const commentVal = document.getElementById('new-review-text').value;
    
    if (!state.ngoReviews) {
        state.ngoReviews = [
            { author: 'Mariana Silva', score: 5, date: '2026-06-25', text: 'Atendimento maravilhoso! Adotei a Mel através da APAPI e o processo foi muito organizado e transparente. Recomendo de olhos fechados!' },
            { author: 'Carlos Henrique', score: 5, date: '2026-06-24', text: 'Excelente prestação de contas. Sempre mostram onde cada centavo das doações é investido. Parabéns pelo trabalho lindo com os cães!' }
        ];
    }
    
    const newRev = {
        author: state.tutor.name || 'Você',
        score: scoreVal,
        date: new Date().toLocaleDateString('pt-BR'),
        text: commentVal
    };
    
    state.ngoReviews.unshift(newRev);
    saveStateToLocalStorage();
    
    // Re-render list
    const list = document.getElementById('ngo-reviews-list-container');
    if (list) {
        list.innerHTML = state.ngoReviews.map(r => `
            <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; text-align: left; font-size:12.5px; animation: modalFadeIn 0.3s ease-out;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:800;">
                    <span>${r.author}</span>
                    <span style="color:#f1c40f;">${'⭐'.repeat(r.score)}</span>
                </div>
                <p style="margin:0; line-height:1.4; color:var(--text-main);">${r.text}</p>
            </div>
        `).join('');
    }
    
    showToast('Avaliação enviada com sucesso! Obrigado pela colaboração. ⭐', 'success');
    event.target.reset();
}

function approveNgoAdoption(reqId, adopter, pet) {
    const element = document.getElementById(reqId);
    if (element) {
        element.style.opacity = '0.5';
        element.querySelector('button').disabled = true;
        element.querySelector('button').innerText = 'Aprovado ✓';
        
        if (!state.adoptedCount) {
            state.adoptedCount = 142;
        }
        state.adoptedCount++;
        saveStateToLocalStorage();
        
        // Update stats
        const stats = document.querySelectorAll('.stat-card .stat-val');
        stats.forEach(stat => {
            if (stat.innerText.includes('142') || stat.innerText.includes('143')) {
                stat.innerHTML = `❤️ ${state.adoptedCount}`;
            }
        });
        
        showToast(`Pedido de adoção de ${adopter} para ${pet} aprovado com sucesso! Certidão emitida. 📜`, 'success');
        
        setTimeout(() => {
            element.remove();
            const countEl = document.getElementById('dash-adopt-req-count');
            if (countEl) {
                const count = parseInt(countEl.innerText) - 1;
                countEl.innerText = count;
                if (count === 0) {
                    document.getElementById('dash-adopt-requests').innerHTML = `
                        <div style="font-size:12px; color:var(--text-muted); text-align:center; padding:10px;">Nenhuma solicitação de adoção pendente.</div>
                    `;
                }
            }
        }, 1000);
    }
}

function filterPetShopProducts(category) {
    const cards = document.querySelectorAll('#catalog-products-grid .product-item-card');
    cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (category === 'Todos' || cat === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function simulateBuyProduct(name) {
    showToast(`Redirecionando para a loja virtual integrada de: ${name}... 🛒`, 'success');
}

function simulateBookService(name) {
    showToast(`Serviço de "${name}" agendado com sucesso! Entraremos em contato para confirmar o horário do Pet. 📅`, 'success');
}

function copyCouponCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showToast(`Cupom "${code}" copiado para a área de transferência! 📋`, 'success');
    }).catch(() => {
        showToast(`Código do cupom: ${code}`, 'success');
    });
}

function handlePetshopReviewSubmit(event) {
    event.preventDefault();
    const scoreVal = parseInt(document.getElementById('new-ps-review-score').value);
    const commentVal = document.getElementById('new-ps-review-text').value;
    
    if (!state.petshopReviews) {
        state.petshopReviews = [
            { author: 'Guilherme Lima', score: 5, date: '2026-06-25', text: 'Melhor banho e tosa da região. Meu cachorro Golden adora os profissionais daqui. Preço justo!' },
            { author: 'Ana Júlia', score: 4, date: '2026-06-23', text: 'Excelente catálogo de brinquedos. A entrega foi muito rápida, comprei pelo WhatsApp e chegou em 2 horas.' }
        ];
    }
    
    const newRev = {
        author: state.tutor.name || 'Você',
        score: scoreVal,
        date: new Date().toLocaleDateString('pt-BR'),
        text: commentVal
    };
    
    state.petshopReviews.unshift(newRev);
    saveStateToLocalStorage();
    
    const list = document.getElementById('petshop-reviews-list-container');
    if (list) {
        list.innerHTML = state.petshopReviews.map(r => `
            <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; text-align: left; font-size:12.5px; animation: modalFadeIn 0.3s ease-out;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:800;">
                    <span>${r.author}</span>
                    <span style="color:#f1c40f;">${'⭐'.repeat(r.score)}</span>
                </div>
                <p style="margin:0; line-height:1.4; color:var(--text-main);">${r.text}</p>
            </div>
        `).join('');
    }
    
    showToast('Avaliação enviada com sucesso! Obrigado pela colaboração. ⭐', 'success');
    event.target.reset();
}

// Inicialização da Aplicação
document.addEventListener('DOMContentLoaded', async () => {
    await initAppState();
    
    // Inicia na aba apropriada
    if (state.loggedIn) {
        navigateToTab(state.activeTab || 'feed');
    } else {
        navigateToTab('landing');
    }
});

// Mobile Menu Toggle Function
window.toggleMobileMenu = function() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('active');
    } else if (sidebar) {
        sidebar.classList.add('open');
        if (backdrop) backdrop.classList.add('active');
    }
};

// Funçao para abrir o WhatsApp do patrocinador
window.openSponsorWhatsApp = function() {
    const phone = '5589994472931';
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre como ser um Patrocinador Oficial do Conexão Pet.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
};

