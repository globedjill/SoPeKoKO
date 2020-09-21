const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    name: { type: String },
    manufacturer: { type: String },
    description: { type: String },
    mainPepper: { type: String },
    imageUrl: { type: String },
    heat: { type: Number },
    likes: { type: Number },
    dislikes: { type: Number },
    userLiked: { type: [String] },
    userDisliked: { type: [String] }
});

module.epxorts = mongoose.model('sauce', sauceSchema);