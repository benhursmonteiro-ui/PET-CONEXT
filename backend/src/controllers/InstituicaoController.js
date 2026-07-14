const MOCK_INSTITUICOES = [
    {
        _id: 'inst-1',
        nome: 'Amigos de Patas (ONG)',
        tipo: 'ONG',
        selo: 'ONGParceira',
        descricao: 'Resgatamos e cuidamos de cães e gatos em situação de rua. Nosso objetivo é encontrar um lar amoroso para todos.',
        localizacao: { cidade: 'São Paulo', estado: 'SP', endereco: 'Rua dos Animais, 123' },
        coordenadas: { lat: -23.55052, lng: -46.633308 },
        imagemPerfil: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=200&h=200',
        avaliacoes: { notaMedia: 4.8, comentarios: [{ usuario: 'Carlos', nota: 5, texto: 'Excelente trabalho!' }] },
        servicos: [
            { nome: 'Adoção Responsável', descricao: 'Processo completo de adoção de cães e gatos' },
            { nome: 'Castração Solidária', descricao: 'Programa de castração a preços populares' }
        ]
    },
    {
        _id: 'inst-2',
        nome: 'Clínica Vet Saúde',
        tipo: 'Clinica',
        selo: 'ClinicaCertificada',
        descricao: 'Especialistas em felinos e caninos. Pronto socorro 24h e equipamentos de última geração.',
        localizacao: { cidade: 'Campinas', estado: 'SP', endereco: 'Av. Brasil, 450' },
        coordenadas: { lat: -22.9099, lng: -47.0626 },
        imagemPerfil: 'https://images.unsplash.com/photo-1628009368231-7bb7cbcb8127?auto=format&fit=crop&q=80&w=200&h=200',
        avaliacoes: { notaMedia: 4.5, comentarios: [{ usuario: 'Maria', nota: 4, texto: 'Ótimo atendimento, mas um pouco caro.' }] },
        servicos: [
            { nome: 'Consulta Clínica', preco: 150 },
            { nome: 'Vacinação Completa', preco: 200 }
        ]
    },
    {
        _id: 'inst-3',
        nome: 'Pet Shop Cão Feliz',
        tipo: 'PetShop',
        selo: 'ParceiroPremium',
        descricao: 'Tudo o que seu pet precisa: rações premium, brinquedos, roupinhas e muito mais.',
        localizacao: { cidade: 'Rio de Janeiro', estado: 'RJ', endereco: 'Rua Copacabana, 98' },
        coordenadas: { lat: -22.9068, lng: -43.1729 },
        imagemPerfil: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=200&h=200',
        avaliacoes: { notaMedia: 5.0, comentarios: [{ usuario: 'Ana', nota: 5, texto: 'O banho e tosa é maravilhoso!' }] },
        servicos: [
            { nome: 'Banho e Tosa', preco: 80 }
        ]
    }
];

// O Controller oficial se conectará ao Model (Instituicao.js) posteriormente.
// Por enquanto, retornaremos os mocks para acelerar o desenvolvimento visual.
exports.listarInstituicoes = async (req, res) => {
    try {
        const { tipo } = req.query;
        let resultado = MOCK_INSTITUICOES;
        
        if (tipo && tipo !== 'Todas') {
            resultado = MOCK_INSTITUICOES.filter(inst => inst.tipo === tipo);
        }
        
        res.status(200).json({
            success: true,
            data: resultado
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar instituições', error: error.message });
    }
};

exports.buscarInstituicaoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const instituicao = MOCK_INSTITUICOES.find(inst => inst._id === id);
        
        if (!instituicao) {
            return res.status(404).json({ success: false, message: 'Instituição não encontrada' });
        }
        
        res.status(200).json({
            success: true,
            data: instituicao
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar instituição', error: error.message });
    }
};
