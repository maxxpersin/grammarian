const mongoose = require('mongoose');

var defaultSchema = mongoose.Schema({
    font: { type: mongoose.Schema.ObjectId, ref: 'Font' },
    level: { type: mongoose.Schema.ObjectId, ref: 'Level' },
    colors: {
        guessBackground: { type: String, default: '#000000' },
        textBackground: { type: String, default: '#000000' },
        wordBackground: { type: String, default: '#000000' }
    }
});

var Default = mongoose.model('Default', defaultSchema);

module.exports = Default;