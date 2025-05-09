require('dotenv').config()
const { Router } = require('express')
const verifyEmail = require('../Helpers/verifyEmail')
const re_verifyEmail = require('../Helpers/re-verify')
const { loginUser, signupUser, refresh, logoutUser } = require('../Controllers/authController')

const router = Router();

// Register user and send email for verification
router.post('/signup-verify', signupUser)

// Verify token sent
router.get('/verifyEmail/:token', verifyEmail)

// Re-verify request when initial verification fails
router.post('/reVerify', re_verifyEmail)

//login with JWT
router.post('/login', loginUser)

//refresh background to get new access token and keep user logged in
router.post('/refresh/:id', refresh)

//logout user
router.get('/logout/:id', logoutUser)

module.exports = router