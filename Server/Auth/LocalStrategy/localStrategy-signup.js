const passport = require('passport')
const { Strategy } = require('passport-local')
const User = require('../../Config/Models/UserSchema')
const bcrypt = require('bcrypt')



passport.serializeUser((user, done) => {
    //User's id saved to the session to subsequent routes authnetication 
    //And again user's id sent to the deserializeUser() to retrieve user on subsequent routing  
    done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
    //Retrieving user on subsequent routings to avoid subsequent logins
    try {
        const findUserId = await User.findById(id)
        if(!findUserId) return done(null, false, { message: 'User not found' }) 
        done(null, findUserId) 
    } catch (err) {
        done(err, null, { message: 'Unexpected error occured!'})
    }
})
passport.use('local-signup', 
    new Strategy({ passReqToCallback: true }, async (req, username, password, done) =>{
        const { confPassword, email, birthday, sex } = req.body
        
        try {
            //NOTE: username and password are automatically checked for errors like empty strings 
            //because they are passed as default arguments to the authentication process 
            
            if(!confPassword) return done(null, false, { message: 'Confirm password' })
            if(!email) return done(null, false, { message: 'Email is required' })
            if(!birthday) return done(null, false, { message: 'Birthdate is required' })
            if(!sex) return done(null, false, { message: 'Gender is required' })

            //check if password has the at least one uppercase, one number and a symbol and also minimum of eight characters long
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z0-9!@#$%^&*()_+-|{}]{8,}$/
            if(!passwordRegex.test(password)) {
                return done(null, false, { message: 'Password must contain at least one uppercase, one number, one special character and must be at least 8 characters long ' })
            }
            
            //Check the database if user credentials provided already exist
            const existingUsernameDetails = await User.findOne({ username })
            if(existingUsernameDetails) return done(null, false, { message: 'Username already exist' })
            const chceckExistingEmail = await User.findOne({ email })
            if(chceckExistingEmail) return done(null, false, { message: 'Email already exist' })
            
            //Hashing user password before saving to database for security reasons
            const saltRounds = 10
            const salt = await bcrypt.genSalt(saltRounds)
            const hashedPassword = await bcrypt.hash(password, salt)
            const hashedconfPassword = await bcrypt.hash(confPassword, salt)
            if(hashedPassword !== hashedconfPassword) return done(null, false, { message: 'Passwords do not match' })
            
            //Save new user to the database
            const local_User = new User({ 
                username, 
                password: hashedPassword,
                email,
                birthday,
                sex,
                profileImage: null
            }) 
            await local_User.save()

            //returning done() with the user credentials to tell passport authentication is done
            done(null, local_User, { message: "SignUp successful"})
        } catch (err) {
            //returning done with no user cred and an error to sieze and control the error to avoid crashing 
            done(err, null, { message: err })
        }
    })
)

module.exports = passport