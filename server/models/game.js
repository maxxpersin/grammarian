const mongoose = require('mongoose');

var gameSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    colors: {
        guessBackground: { type: String, default: '#000000' },
        textBackground: { type: String, default: '#000000' },
        wordBackground: { type: String, default: '#000000' }
    },
    font: { type: mongoose.Schema.ObjectId, ref: 'Font' },
    guesses: String,
    level: { type: mongoose.Schema.ObjectId, ref: 'Level' },
    remaining: Number,
    status: {
        type: String,
        enum: ['unfinished', 'victory', 'loss'],
        default: 'unfinished'
    },
    target: String,
    timeStamp: { type: Date, default: Date.now },
    timeToComplete: Number,
    view: String
});

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;