const passport = require('passport')
const { Strategy } = require('passport-local')
const User = require('../../Config/Models/UserSchema')
const bcrypt = require('bcrypt')


passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
    try {
        const findUserId = await User.findById(id)
        if(!findUserId) return done(null, false, { message: 'User not found' })

        done(null, findUserId)
    } catch(err) {
        done(err, null)
    }
})
passport.use('local-signin',
    new Strategy( { usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email })
            if(!user) return done(null, false, { message: 'User not found, please signup!' })

            const hashedPassCompare = await bcrypt.compare(password, user.password)
            if(!hashedPassCompare) return done(null, false, { message: 'Password incorrect, try again'})

            done(null, user, { message: `Welcome ${user.username}`})
        } catch (err) {
            done(err, null)
        }
    })
)

module.exports = passport