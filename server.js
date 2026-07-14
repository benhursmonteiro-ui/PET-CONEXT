const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

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
        name: 'Carlos Henrique',
        location: 'São Paulo, SP',
        bio: 'Apaixonado por bichinhos. Pai do Rex e da Mel. Apoiador ativo de ONGs de adoção local.',
        avatar: 'assets/dog_avatar.png',
        friendsCount: 124,
        followersCount: 382
    },
    pets: [
        {
            id: 'pet-1',
            name: 'Rex',
            species: 'Cachorro',
            breed: 'Golden Retriever',
            age: 3,
            gender: 'Macho',
            weight: 32.5,
            avatar: 'assets/dog_avatar.png',
            premium: false,
            health: {
                vaccines: [
                    { id: 'v-1', name: 'Anti-rábica', date: '2026-01-10', nextDate: '2027-01-10', status: 'done' },
                    { id: 'v-2', name: 'V10 Múltipla', date: '2026-03-05', nextDate: '2027-03-05', status: 'done' },
                    { id: 'v-3', name: 'Gripe Canina', date: '2025-11-12', nextDate: '2026-11-12', status: 'done' }
                ],
                vermifuges: [
                    { id: 'vm-1', name: 'Drontal Plus', date: '2026-04-10', nextDate: '2026-07-10', status: 'done' }
                ],
                appointments: [
                    { id: 'a-1', title: 'Consulta Geral Dr. Ana', date: '2026-06-12', time: '14:00', type: 'appointment' },
                    { id: 'a-2', title: 'Banho & Tosa PetShop VIP', date: '2026-06-25', time: '09:30', type: 'appointment' }
                ],
                weightHistory: [
                    { date: 'Jan', weight: 29.5 },
                    { date: 'Fev', weight: 30.2 },
                    { date: 'Mar', weight: 31.0 },
                    { date: 'Abr', weight: 31.8 },
                    { date: 'Mai', weight: 32.5 }
                ]
            }
        },
        {
            id: 'pet-2',
            name: 'Mel',
            species: 'Gato',
            breed: 'Persa',
            age: 2,
            gender: 'Fêmea',
            weight: 4.2,
            avatar: 'assets/cat_avatar.png',
            premium: false,
            health: {
                vaccines: [
                    { id: 'v-4', name: 'Quádrupla Felina V4', date: '2026-02-15', nextDate: '2027-02-15', status: 'done' },
                    { id: 'v-5', name: 'Anti-rábica Felina', date: '2026-02-15', nextDate: '2027-02-15', status: 'done' }
                ],
                vermifuges: [
                    { id: 'vm-2', name: 'Milbemax Gato', date: '2026-05-01', nextDate: '2026-11-01', status: 'done' }
                ],
                appointments: [
                    { id: 'a-3', title: 'Checkup Cardiológico', date: '2026-06-18', time: '16:15', type: 'appointment' }
                ],
                weightHistory: [
                    { date: 'Jan', weight: 3.8 },
                    { date: 'Fev', weight: 3.9 },
                    { date: 'Mar', weight: 4.0 },
                    { date: 'Abr', weight: 4.1 },
                    { date: 'Mai', weight: 4.2 }
                ]
            }
        }
    ],
    feed: [
        {
            id: 'post-1',
            authorName: 'Rex (Golden Retriever)',
            authorAvatar: 'assets/dog_avatar.png',
            time: 'Há 2 horas',
            text: 'Hoje o dia no parque foi incrível! Corri atrás de 15 bolinhas e fiz 3 novos amigos. Quem quer passear comigo no próximo fim de semana? 🌳🐾 #Cachorros #GoldenRetriever #PetsDoBrasil',
            image: 'assets/feed_dog_park.png',
            likes: 42,
            liked: false,
            comments: [
                { author: 'Luna Boxer', text: 'Eu quero! Adoro correr no parque!' },
                { author: 'Thor Husky', text: 'Se tiver lama eu vou com certeza! 😂' }
            ]
        },
        {
            id: 'post-2',
            authorName: 'Mel (Persa Fluffy)',
            authorAvatar: 'assets/cat_avatar.png',
            time: 'Há 5 horas',
            text: 'Julgando os humanos silenciosamente do topo da geladeira... É meu esporte favorito do dia. ✨👑 #Gatos #GatosPersas #VidaDeGato',
            image: 'assets/cat_avatar.png',
            likes: 89,
            liked: true,
            comments: [
                { author: 'Carlos Henrique', text: 'Mel, desce daí por favor! kkk' }
            ]
        }
    ],
    reels: [
        {
            id: 'reel-1',
            authorName: 'Mel (Gatinha)',
            authorAvatar: 'assets/cat_avatar.png',
            desc: 'Tentando pegar o reflexo da bolinha de sabão no ar! Quase consegui! 😂🫧 #Filhotes #ReelsDoGato #Fofura',
            image: 'assets/reels_kitten.png',
            likes: 243,
            liked: false,
            saved: false,
            music: 'Cat Lounge Chill Beats',
            challenge: 'Desafio da Garrinha 🐾',
            comments: [
                { author: 'Thor Husky', text: 'Que fofa! 😻 Quase conseguiu!' },
                { author: 'Luna Boxer', text: 'Amei o pulo! Muito ágil e engraçada!' },
                { author: 'Bidu Schnauzer', text: 'A minha gata faz exatamente igual kkk' }
            ]
        },
        {
            id: 'reel-2',
            authorName: 'Rex (Golden)',
            authorAvatar: 'assets/dog_avatar.png',
            desc: 'Quando escuto a palavra PASSEAR em 5 línguas diferentes! 🐶✈️ #Cachorros #GoldenSmile #Engraçado',
            image: 'assets/dog_avatar.png',
            likes: 512,
            liked: true,
            saved: false,
            music: 'Happy Dogs Walk Theme',
            challenge: 'Olhar de Coitado 🥺',
            comments: [
                { author: 'Mariana Silva', text: 'O Billy faz a mesma cara kkkk' },
                { author: 'Thor Husky', text: 'Golden sendo Golden, muito fofo!' },
                { author: 'Mel Gatinha', text: 'Esse olhar destrói qualquer coração 🥺' }
            ]
        }
    ],
    activeReelIndex: 0,
    friends: [
        { id: 'f-1', name: 'Thor (Husky)', avatar: 'assets/reels_kitten.png', distance: '500m', online: true, messages: [] },
        { id: 'f-2', name: 'Luna (Boxer)', avatar: 'assets/dog_avatar.png', distance: '1.2km', online: true, messages: [] },
        { id: 'f-3', name: 'Bidu (Schnauzer)', avatar: 'assets/cat_avatar.png', distance: '2.0km', online: false, messages: [] },
        { id: 'f-4', name: 'Pipoca (Poodle)', avatar: 'assets/reels_kitten.png', distance: '3.4km', online: true, messages: [] }
    ],
    activeChatFriendId: 'f-1',
    forum: [
        {
            id: 'th-1',
            category: 'Alimentação',
            title: 'Qual a melhor ração para filhotes de Golden?',
            author: 'Mariana Silva',
            body: 'Estou com o Billy faz 1 semana e ele está recusando a ração seca. Alguma dica de marca ou sachê saudável?',
            replies: [
                { author: 'Carlos Henrique', text: 'Eu uso a Royal Canin Golden Puppy para o Rex. No começo misturava com um pouquinho de água morna para amolecer, ajudou muito!' },
                { author: 'Dr. Roberto Vet', text: 'Importante avaliar se não é dentição nascendo. Oferecer rações super premium e, se necessário, pastinhas específicas estimula bastante.' }
            ]
        },
        {
            id: 'th-2',
            category: 'Comportamento',
            title: 'Como ensinar o cão a fazer xixi no tapete higiênico?',
            author: 'Marcos Oliveira',
            body: 'Minha cachorrinha de 3 meses insiste em fazer xixi no tapete da sala. Já tentei sprays atrativos e não funciona.',
            replies: [
                { author: 'Ana Souza', text: 'Limpe o tapete da sala com eliminador de odor enzimático. Se ficar o cheiro, ela vai voltar lá. E recompense com petisco na mesma hora que ela fizer no tapete higiênico!' }
            ]
        },
        {
            id: 'th-3',
            category: 'Saúde Animal',
            title: 'Dúvida sobre vacina de gripe anual',
            author: 'Juliana Pires',
            body: 'É realmente obrigatório dar a vacina da gripe todo ano? Meu pet quase não sai de casa, só passeia no condomínio.',
            replies: []
        }
    ],
    activeForumCategory: 'Todos',
    adoptionPets: [
        {
            id: 'adopt-1',
            name: 'Toby',
            species: 'Cachorro',
            breed: 'SRD (Sem Raça Definida)',
            age: '1 ano',
            size: 'Porte Médio',
            health: 'Vacinado, Vermifugado e Castrado',
            personality: 'Extremamente brincalhão, companheiro e se dá muito bem com outros cães.',
            image: 'assets/dog_avatar.png',
            ngo: 'ONG Patas Solidárias (Verificada)',
            status: 'Disponível'
        },
        {
            id: 'adopt-2',
            name: 'Pipoca',
            species: 'Gato',
            breed: 'Siamês Mix',
            age: '5 meses',
            size: 'Porte Pequeno',
            health: 'Primeira dose vacinal aplicada, vermifugado',
            personality: 'Adora carinho na barriguinha e dormir no colo enquanto você assiste TV.',
            image: 'assets/reels_kitten.png',
            ngo: 'Gatos do Bem (Verificada)',
            status: 'Disponível'
        },
        {
            id: 'adopt-3',
            name: 'Melinda',
            species: 'Outro',
            breed: 'Mini Coelho',
            age: '8 meses',
            size: 'Porte Pequeno',
            health: 'Consultada e saudável',
            personality: 'Silenciosa, ativa no entardecer, acostumada a comer feno e vegetais frescos.',
            image: 'assets/cat_avatar.png',
            ngo: 'Amigos do Reino Animal',
            status: 'Disponível'
        }
    ],
    adoptionApplications: [],
    activeAdoptionFilter: 'Todos',
    events: [
        {
            id: 'ev-1',
            title: 'Grande Cãominhada & Encontro de Raças',
            date: '2026-06-14',
            time: '09:00',
            location: 'Parque Villa-Lobos (Área Pet)',
            desc: 'Encontro comunitário para caminhar, socializar os pets e trocar dicas sobre adestramento. Leve água e saquinhos higiênicos!',
            rsvps: 34,
            userJoined: false
        },
        {
            id: 'ev-2',
            title: 'Feira de Adoção Adote um Amor 🐱🐶',
            date: '2026-06-20',
            time: '10:00',
            location: 'Praça Benedito Calixto, Pinheiros',
            desc: 'Mais de 40 animais resgatados pelas ONGs parceiras do Conexão Pet estarão em busca de um lar responsável. Venha conhecer seu novo amigo!',
            rsvps: 18,
            userJoined: true
        }
    ],
    activeTab: 'feed',
    reports: [
        {
            id: 'rep-1',
            type: 'Perfil Falso',
            target: 'Usuário "RexTheDog99"',
            details: 'Uso de fotos de pet alheias sem autorização.',
            status: 'Em Análise',
            createdAt: '2026-06-16'
        },
        {
            id: 'rep-2',
            type: 'Maus Serviços',
            target: 'Instituição "PetShop X"',
            details: 'Negligência flagrante durante banho e tosa.',
            status: 'Resolvido',
            createdAt: '2026-06-15'
        },
        {
            id: 'rep-3',
            type: 'Animal Perdido',
            target: 'Av. Paulista, próximo ao MASP',
            details: 'Cachorro sem coleira parecendo desorientado e assustado.',
            status: 'Busca Ativa',
            createdAt: '2026-06-17'
        }
    ]
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
        
        const defaultAccounts = [
            {
                email: 'carlos@petconect.com',
                password: '123',
                tutor: {
                    name: 'Carlos Henrique',
                    location: 'São Paulo, SP',
                    bio: 'Apaixonado por bichinhos. Pai do Rex e da Mel. Apoiador ativo de ONGs de adoção local.',
                    avatar: 'assets/tutor_avatar.png',
                    friendsCount: 124,
                    followersCount: 382,
                    type: 'tutor'
                },
                pets: JSON.parse(JSON.stringify(stateObj.pets || []))
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
                    location: 'São Paulo, SP',
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
