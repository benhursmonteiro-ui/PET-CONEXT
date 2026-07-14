const mongoose = require('mongoose');

const SosPetSchema = new mongoose.Schema({
    reporterId: { type: String, required: true },
    type: {
        type: String,
        enum: ['Animal Perdido', 'Animal Ferido', 'Maus-Tratos em andamento', 'Resgate Urgente'],
        required: true
    },
    description: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number }
    },
    evidences: [{ type: String }],
    status: {
        type: String,
        enum: ['Ativo', 'Atendido', 'Falso Alarme'],
        default: 'Ativo'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SosPet', SosPetSchema);
