const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    reporterId: { type: String, required: true }, // ID do usuário que denunciou
    targetId: { type: String, required: true }, // ID do alvo
    targetType: {
        type: String,
        enum: ['User', 'Pet', 'Publication', 'Institution'],
        required: true
    },
    reason: {
        type: String,
        required: true // ex: 'Perfil falso', 'Maus-tratos', 'Golpe'
    },
    description: { type: String },
    evidences: [{
        type: String // Caminho ou URL da foto/vídeo
    }],
    status: {
        type: String,
        enum: ['Recebida', 'Em análise', 'Resolvida', 'Rejeitada', 'Encaminhada às autoridades'],
        default: 'Recebida'
    },
    moderationNotes: { type: String }, // Notas internas da equipe
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
