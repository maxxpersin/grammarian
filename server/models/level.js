const mongoose = require('mongoose');

var levelSchema = mongoose.Schema({
    rounds: Number,
    maxLength: Number,
    minLength: Number,
    name: { type: String, unique: true }
});

var Level = mongoose.model('Level', levelSchema);

module.exports = Level;