const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    defaults: { type: mongoose.Schema.ObjectId, ref: 'Default' }
});

var User = mongoose.model('User', userSchema);

module.exports = User;