const mongoose = require('mongoose')

const googleUserSchema = new mongoose.Schema({
    googleId: String,
    email: String,
    username: String,
    profilePicture: String,
}, { timestamps: true })

module.exports = mongoose.model('GoogleUsers', googleUserSchema)