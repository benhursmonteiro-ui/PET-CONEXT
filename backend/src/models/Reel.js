const mongoose = require('mongoose');

const ReelCommentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const ReelSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true }, // Path to video or cover image
    music: { type: String },
    challenge: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [ReelCommentSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reel', ReelSchema);
