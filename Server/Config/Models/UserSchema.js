const mongoose = require('mongoose')

const Users_local = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profileImage: String,
    phone: String,
    about: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: String,
    refreshToken_expires: Date,
    verifyEmailToken: String,
    verifyEmailTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date
}, { timestamps: true })

module.exports = mongoose.model('Users', Users_local)