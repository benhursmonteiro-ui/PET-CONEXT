const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

// Logger middleware to show requests in the terminal
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Disable cache in development so changes appear immediately
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// Serve static frontend files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public'), { etag: false, maxAge: 0 }));

// Integrar Rotas da Nova Arquitetura (Mongoose e Multer adicionados)
const instituicaoRoutes = require('./backend/src/routes/instituicaoRoutes');
const reportRoutes = require('./backend/src/routes/reportRoutes');
app.use('/api/instituicoes', instituicaoRoutes);
app.use('/api/reports', reportRoutes);

// Default Mock State Seeding
const INITIAL_STATE = {
    theme: 'light',
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
    reports: []
};

// Seed Welcome messages
INITIAL_STATE.friends.forEach(f => {
    if (!f.messages || f.messages.length === 0) {
        f.messages = [
            { sender: 'received', text: `Oi! Sou o ${f.name}. Vamos bater um papo de pet? 🐾`, time: 'Ontem' }
        ];
    }
});

// JSON Helper Functions
function readState() {
    try {
        let stateObj;
        if (!fs.existsSync(DB_FILE)) {
            stateObj = JSON.parse(JSON.stringify(INITIAL_STATE));
        } else {
            const data = fs.readFileSync(DB_FILE, 'utf-8');
            stateObj = JSON.parse(data);
        }
        
        // Garantir que users exista e contenha as contas padrão de teste
        if (!stateObj.users) {
            stateObj.users = [];
        }
        
        const defaultAccounts = [];
        
        let modified = false;
        defaultAccounts.forEach(defAcc => {
            if (!stateObj.users.some(u => u.email === defAcc.email)) {
                stateObj.users.push(defAcc);
                modified = true;
            }
        });
        
        if (modified || !fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify(stateObj, null, 2), 'utf-8');
        }
        
        return stateObj;
    } catch (err) {
        console.error('Error reading database file, fallback to initial state', err);
        return INITIAL_STATE;
    }
}

function syncCurrentUser(state) {
    if (!state || !state.loggedIn) return;
    
    let user;
    if (state.currentUserEmail) {
        user = state.users.find(u => u.email === state.currentUserEmail);
    }
    
    if (!user && state.tutor && state.tutor.name) {
        user = state.users.find(u => u.tutor.name === state.tutor.name);
        if (user) {
            state.currentUserEmail = user.email;
        }
    }
    
    if (user) {
        user.tutor = state.tutor;
        user.pets = state.pets;
    }
}

function writeState(state) {
    try {
        syncCurrentUser(state);
        fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
        return true;
    } catch (err) {
        console.error('Error writing to database file', err);
        return false;
    }
}

// REST API Routes
app.get('/api/state', (req, res) => {
    const state = readState();
    res.json(state);
});

app.post('/api/state/reset', (req, res) => {
    writeState(INITIAL_STATE);
    res.json({ success: true, state: INITIAL_STATE });
});

app.post('/api/state', (req, res) => {
    const newState = req.body;
    if (newState && typeof newState === 'object') {
        writeState(newState);
        res.json({ success: true, state: newState });
    } else {
        res.status(400).json({ success: false, error: 'Invalid state' });
    }
});

app.post('/api/state/theme', (req, res) => {
    const { theme } = req.body;
    const state = readState();
    state.theme = theme;
    writeState(state);
    res.json({ success: true, state });
});

app.post('/api/tutor', (req, res) => {
    const { name, bio, location } = req.body;
    const state = readState();
    state.tutor.name = name || state.tutor.name;
    state.tutor.bio = bio !== undefined ? bio : state.tutor.bio;
    state.tutor.location = location || state.tutor.location;
    writeState(state);
    res.json({ success: true, state });
});

app.post('/api/pets', (req, res) => {
    const { name, species, breed, age, gender, weight, avatar } = req.body;
    const state = readState();
    const newPet = {
        id: `pet-${Date.now()}`,
        name,
        species,
        breed,
        age: parseInt(age) || 0,
        gender,
        weight: parseFloat(weight) || 0,
        avatar: avatar || 'assets/dog_avatar.png',
        premium: false,
        health: {
            vaccines: [],
            vermifuges: [],
            appointments: [],
            weightHistory: [{ date: 'Jun', weight: parseFloat(weight) || 0 }]
        }
    };
    state.pets.push(newPet);
    writeState(state);
    res.json({ success: true, state });
});

app.delete('/api/pets/:id', (req, res) => {
    const petId = req.params.id;
    const state = readState();
    state.pets = state.pets.filter(p => p.id !== petId);
    writeState(state);
    res.json({ success: true, state });
});

app.post('/api/pets/:id/health', (req, res) => {
    const petId = req.params.id;
    const { type, title, date, nextDate, value, time } = req.body;
    const state = readState();
    const pet = state.pets.find(p => p.id === petId);
    if (pet) {
        if (type === 'vaccine') {
            pet.health.vaccines.push({
                id: `v-${Date.now()}`,
                name: title,
                date,
                nextDate: nextDate || date,
                status: 'done'
            });
        } else if (type === 'vermifuge') {
            pet.health.vermifuges.push({
                id: `vm-${Date.now()}`,
                name: title,
                date,
                nextDate: nextDate || date,
                status: 'done'
            });
        } else if (type === 'appointment') {
            pet.health.appointments.push({
                id: `a-${Date.now()}`,
                title,
                date,
                time: time || '10:00',
                type: 'appointment'
            });
        } else if (type === 'weight') {
            const dateObj = new Date(date + 'T00:00:00');
            const monthsList = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const monthTag = monthsList[dateObj.getMonth()];
            
            pet.health.weightHistory.push({
                date: monthTag,
                weight: parseFloat(value) || 0
            });
            pet.weight = parseFloat(value) || 0;
        }
        writeState(state);
        res.json({ success: true, state });
    } else {
        res.status(404).json({ success: false, error: 'Pet not found' });
    }
});

app.post('/api/feed/posts', (req, res) => {
    const { authorName, authorAvatar, text, image } = req.body;
    const state = readState();
    const newPost = {
        id: `post-${Date.now()}`,
        authorName,
        authorAvatar,
        time: 'Agora mesmo',
        text,
        image,
        likes: 0,
        liked: false,
        comments: []
    };
    state.feed.unshift(newPost);
    writeState(state);
    res.json({ success: true, state });
});

app.post('/api/feed/posts/:id/like', (req, res) => {
    const postId = req.params.id;
    const state = readState();
    const post = state.feed.find(p => p.id === postId);
    if (post) {
        if (post.liked) {
            post.liked = false;
            post.likes = Math.max(0, post.likes - 1);
        } else {
            post.liked = true;
            post.likes++;
        }
        writeState(state);
        res.json({ success: true, state });
    } else {
        res.status(404).json({ success: false, error: 'Post not found' });
    }
});

app.post('/api/feed/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    const { author, text } = req.body;
    const state = readState();
    const post = state.feed.find(p => p.id === postId);
    if (post) {
        post.comments.push({ author, text });
        writeState(state);
        res.json({ success: true, state });
    } else {
        res.status(404).json({ success: false, error: 'Post not found' });
    }
});

app.post('/api/reels/:id/like', (req, res) => {
    const reelId = req.params.id;
    const { dblClick } = req.body;
    const state = readState();
    const reel = state.reels.find(r => r.id === reelId);
    if (reel) {
        if (dblClick) {
            if (!reel.liked) {
                reel.liked = true;
                reel.likes++;
            }
        } else {
            if (reel.liked) {
                reel.liked = false;
                reel.likes = Math.max(0, reel.likes - 1);
            } else {
                reel.liked = true;
                reel.likes++;
            }
        }
        writeState(state);
        res.json({ success: true, state });
    } else {
        res.status(404).json({ success: false, error: 'Reel not found' });
    }
});

app.post('/api/reels/active-index', (req, res) => {
    const { index } = req.body;
    const state = readState();
    state.activeReelIndex = index;
    writeState(state);
    res.json({ success: true, state });
});

app.post('/api/chats/active-friend', (req, res) => {
    const { friendId } = req.body;
    const state = readState();
    state.activeChatFriendId = friendId;
    writeState(state);
    res.json({ success: true, state });
});

app.post('/api/chats/:friendId/messages', (req, res) => {
    const friendId = req.params.friendId;
    const { text } = req.body;
    const state = readState();
    const friend = state.friends.find(f => f.id === friendId);
    if (friend) {
        friend.messages.push({
            sender: 'sent',
            text: text,
            time: 'Agora'
        });
        writeState(state);
        res.json({ success: true, state });
    } else {
        res.status(404).json({ success: false, error: 'Friend not found' });
    }
});

const BOT_REPLIES = {
    'f-1': [
        "Au au! Tudo bem por aí? Vamos marcar um passeio no parque no próximo final de semana? 🌲🐶",
        "Que legal sua mensagem! Meu tutor disse que hoje vou ganhar petisco de frango! 🍗",
        "Estou aqui roendo meu osso de brinquedo... E você, o que está fazendo de bom?"
    ],
    'f-2': [
        "Oi, amigo! Acabei de voltar da tosa, estou super cheirosa! ✨🐶",
        "Au! Vamos correr atrás dos patos no lago qualquer dia desses? 🦆",
        "Minha tutora está comendo pizza e eu estou aqui aplicando a técnica do olhar de coitado... Acho que vai dar certo! 🍕🥺"
    ],
    'f-4': [
        "Olá! Estou brincando com uma bolinha que faz barulho aqui, muito divertido! 🎾",
        "Pipoca na área! Pronto para aprontar muito hoje? 😉🐾",
        "Acho que vi um passarinho na janela... vou ficar de vigília aqui! 🐦👀"
    ],
    'ong-apapi': [
        "Olá! Recebemos seu alerta de SOS. Nossa equipe de resgate já foi notificada e está avaliando a disponibilidade de voluntários e lar temporário. 💚🐾",
        "Obrigado por nos informar! Se possível, permaneça no local ou forneça mais detalhes sobre o estado de saúde do animal. A APAPI agradece! 🛡️",
        "Alerta SOS recebido com sucesso. Estamos divulgando a ocorrência em nossas redes para encontrar ajuda o mais rápido possível!"
    ],
    'petshop-patinhas': [
        "Olá! Vimos o alerta SOS Pet. Caso o animal precise de atendimento veterinário emergencial, nossa clínica está de prontidão com tarifas sociais. 🩺🧼",
        "Alerta SOS recebido! Se precisar de ração de emergência, medicamentos ou produtos de higiene para o pet resgatado, conte conosco. 💊🐾",
        "Entendido! Estaremos de olho e prontos para ajudar no que for possível. Pet Shop Patinhas sempre apoiando a causa animal! 💚"
    ]
};

app.post('/api/chats/:friendId/bot-reply', (req, res) => {
    const friendId = req.params.friendId;
    const state = readState();
    const friend = state.friends.find(f => f.id === friendId);
    if (friend) {
        const replies = BOT_REPLIES[friendId] || [
            "Au au! 🐾", 
            "Miau! Que legal falar com você!", 
            "Estou pronto para fazer novas travessuras!"
        ];
        const index = Math.floor(Math.random() * replies.length);
        const replyText = replies[index];
        
        friend.messages.push({
            sender: 'received',
            text: replyText,
            time: 'Agora'
        });
        writeState(state);
        res.json({ success: true, state });
    } else {
        res.status(404).json({ success: false, error: 'Friend not found' });
    }
});

app.post('/api/communities/topics', (req, res) => {
    const { category, title, body } = req.body;
    const state = readState();
    const newThread = {
        id: `th-${Date.now()}`,
        category,
        title,
        author: state.tutor.name,
        body,
        replies: []
    };
    state.forum.unshift(newThread);
    writeState(state);
    res.json({ success: true, state });
});

app.post('/api/communities/topics/:id/replies', (req, res) => {
    const threadId = req.params.id;
    const { author, text } = req.body;
    const state = readState();
    const thread = state.forum.find(t => t.id === threadId);
    if (thread) {
        thread.replies.push({ author, text });
        writeState(state);
        res.json({ success: true, state });
    } else {
        res.status(404).json({ success: false, error: 'Topic not found' });
    }
});

app.post('/api/adoption/applications', (req, res) => {
    const { petId, petName, ngo } = req.body;
    const state = readState();
    const pet = state.adoptionPets.find(p => p.id === petId);
    if (pet) {
        const newApp = {
            id: `app-${Date.now()}`,
            petId,
            petName,
            ngo,
            status: 'Em análise pelas ONGs'
        };
        state.adoptionApplications.push(newApp);
        pet.status = 'Em Adoção (Reservado)';
        writeState(state);
        res.json({ success: true, state });
    } else {
        res.status(404).json({ success: false, error: 'Adoption pet not found' });
    }
});

app.post('/api/events', (req, res) => {
    const { title, date, time, location, desc } = req.body;
    const state = readState();
    const newEvent = {
        id: `ev-${Date.now()}`,
        title,
        date,
        time,
        location,
        desc,
        rsvps: 1,
        userJoined: true
    };
    state.events.unshift(newEvent);
    writeState(state);
    res.json({ success: true, state });
});

app.post('/api/events/:id/rsvp', (req, res) => {
    const eventId = req.params.id;
    const state = readState();
    const event = state.events.find(e => e.id === eventId);
    if (event) {
        if (event.userJoined) {
            event.userJoined = false;
            event.rsvps = Math.max(0, event.rsvps - 1);
        } else {
            event.userJoined = true;
            event.rsvps++;
        }
        writeState(state);
        res.json({ success: true, state });
    } else {
        res.status(404).json({ success: false, error: 'Event not found' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
