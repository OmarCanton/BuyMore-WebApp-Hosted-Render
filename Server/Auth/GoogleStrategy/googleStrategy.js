require('dotenv').config()
const passport = require('passport')
const { Strategy } = require('passport-google-oauth20')
const googleUser = require('../../Config/Models/googleUserSchema')


const clientID = process.env.GOOGLE_AUTH_CLIENT_ID
const clientSecret = process.env.GOOGLE_AUTH_CLIENT_SECRETE

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const userId = googleUser.findById(id)
        if(!userId) return done(null, false)
        
        done(null, userId) 
    } catch (err) {
        done(err, nulll)
    }
})

passport.use('google', 
    new Strategy({
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: '/auth/google/redirect',
        scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            //Acquiring credentials from the profile object from google
            const { id, emails, displayName, photos } = profile

            //checking if user already exist in the database
            const existingUser = await googleUser.findOne({ googleId: id })
            if(existingUser) {
                return done(null, existingUser)
            } else {
                const newGoogleUser =  new googleUser({
                    googleId: id,
                    username: displayName,
                    email: emails[0].value,
                    profilePicture: photos[0].value
                })
                const user = await newGoogleUser.save()

                return done(null, user)
            }
        } catch (err) {
            done(err, null)
        }
    })
)

module.exports = passport