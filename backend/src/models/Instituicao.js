const mongoose = require('mongoose');

const InstituicaoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    tipo: {
        type: String,
        enum: ['ONG', 'Clinica', 'PetShop', 'BanhoTosa', 'HotelCreche', 'Adestrador'],
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    localizacao: {
        cidade: String,
        estado: String,
        endereco: String
    },
    contato: {
        telefone: String,
        email: String,
        site: String,
        redesSociais: {
            instagram: String,
            facebook: String
        }
    },
    selo: {
        type: String,
        enum: ['Verificada', 'ClinicaCertificada', 'ONGParceira', 'ParceiroPremium', 'Nenhum'],
        default: 'Nenhum'
    },
    coordenadas: {
        lat: Number,
        lng: Number
    },
    avaliacoes: {
        notaMedia: { type: Number, default: 0 },
        comentarios: [{
            usuario: String,
            nota: Number,
            texto: String,
            data: { type: Date, default: Date.now }
        }]
    },
    imagemPerfil: {
        type: String,
        default: 'assets/default_institution.png'
    },
    servicos: [{
        nome: String,
        descricao: String,
        preco: Number // Pode ser opcional, ex: ONGs não tem preço para doação
    }],
    animaisParaAdocao: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Instituicao', InstituicaoSchema);
