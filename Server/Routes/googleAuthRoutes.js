const { Router } = require('express')
const passport = require('passport')
require('../Auth/GoogleStrategy/googleStrategy')
const router = Router();


//Google OAuth endpoint
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}))

//rediret url for google to return authnetication code/token
router.get('/auth/google/redirect', passport.authenticate('google', {
    successRedirect: 'http://localhost:5173',
    failureRedirect: 'http://localhost:5173/login'
}))

//fetch data fom here after google auth
router.get('/login/google/success', (req, res) => {
    console.log(req.isAuthenticated())
    console.log(req.user)
})

module.exports = router