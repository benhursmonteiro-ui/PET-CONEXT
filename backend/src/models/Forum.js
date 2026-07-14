const mongoose = require('mongoose');

const ForumReplySchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const ForumSchema = new mongoose.Schema({
    category: { type: String, required: true }, // e.g. "Alimentação", "Comportamento"
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    replies: [ForumReplySchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Forum', ForumSchema);
