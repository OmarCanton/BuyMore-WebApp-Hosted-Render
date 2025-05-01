require('dotenv').config()
const jwt = require('jsonwebtoken')

const ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN
const REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN

const generateAccessToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username
    }
    return jwt.sign(payload, ACCESS_TOKEN, {expiresIn: '1h'})
}
const generateRefreshToken = (user, rememberMe) => {
    const payload = {
        id: user._id,
        username: user.username
    }

    if(rememberMe) {
        return jwt.sign(payload, REFRESH_TOKEN, { expiresIn: '365d'})
    } else {
        return jwt.sign(payload, REFRESH_TOKEN, { expiresIn: '3d'})
    }

}

module.exports = { generateAccessToken, generateRefreshToken }