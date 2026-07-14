const mongoose = require('mongoose');

const VaccineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    nextDate: { type: Date },
    status: { type: String, enum: ['done', 'pending'], default: 'done' }
});

const VermifugeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    nextDate: { type: Date },
    status: { type: String, enum: ['done', 'pending'], default: 'done' }
});

const WeightHistorySchema = new mongoose.Schema({
    date: { type: String, required: true }, // e.g. "Jan"
    weight: { type: Number, required: true }
});

const PetSchema = new mongoose.Schema({
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Owner (or NGO)
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String, default: 'SRD' },
    age: { type: String, required: true }, // Stored as string for flexibility (e.g. "3 meses", "2 anos")
    gender: { type: String, enum: ['Macho', 'Fêmea', 'Outro'], required: true },
    weight: { type: Number },
    avatar: { type: String, default: 'assets/dog_avatar.png' },
    premium: { type: Boolean, default: false },
    
    // Adoption specific fields
    isForAdoption: { type: Boolean, default: false },
    size: { type: String }, // Porte Pequeno, Médio, Grande
    healthInfo: { type: String }, // Vacinado, Castrado, etc
    personality: { type: String },
    status: { type: String, enum: ['Disponível', 'Adotado', 'Em Processo'], default: 'Disponível' },

    // Health History
    health: {
        vaccines: [VaccineSchema],
        vermifuges: [VermifugeSchema],
        weightHistory: [WeightHistorySchema]
    },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pet', PetSchema);
