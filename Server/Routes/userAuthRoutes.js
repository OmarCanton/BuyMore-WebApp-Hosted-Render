require('dotenv').config()
const { Router } = require('express')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const passport = require('passport')
require('../Auth/LocalStrategy/localStrategy-signup')
require('../Auth/LocalStrategy/locaStrategy-signin')
const User = require('../Config/Models/UserSchema')
const multer = require('multer')
const upload = require('../Config/multerConfig')
const nodemailer = require('nodemailer')

const router = Router();


router.post('/signup-verify', (req, res, next) => {
    passport.authenticate('local-signup', async (err, user, info) => {
        //check if there's an error in authentication process
        if(err) {
            return res.status(500).json({ error: 'Server error' })
        }

        //check if user wasn't authenticated 
        //Meaaning the done() returned false as its second argument
        if(!user) {
            return res.json({ error: info.message})
        }
        //end of passport handing errors

        // Verifying user using nodemailer
        const randomToken = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto.createHash('sha256').update(randomToken).digest('hex')

        //using passport's user object, the keys and values of the user authenticated by passport can be retrieved from the schema
        user.verifyEmailToken = hashedToken
        user.verifyEmailTokenExpires = Date.now() + 3600000
        //save it to the database 
        user.save()

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'buymoreapp24@gmail.com',
                pass: process.env.PASS
            }
        })

        const url = `${process.env.EXTERNAL_URL_FRONTEND_HOSTED}/verifyEmail/${randomToken}`
        const message = `
            <h2>Click on the link below to complete and activate your account, link expires in 1 hour</h2>
            <a href=${url}>Click here Verify</a>`

        try {
            await transporter.sendMail({
                to: user.email,
                subject: 'Verify buymore Account',
                html: message
            })
            res.json({linkSent: true, msg: 'Verification link has been sent to your email, kindly check your inbox to complete the signup process'})
        } catch(err) {
            await User.findByIdAndDelete(user._id)
            res.json({error: 'Verification link could not be sent, try again later'})
        }

    })(req, res, next)

})

router.get('/verifyEmail/:token', async (req, res) => {
    const { token } = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    try {
        const findUserToken = await User.findOne({
            verifyEmailToken: hashedToken,
            verifyEmailTokenExpires: { $gt: Date.now() }
        })

        if(!findUserToken) return res.json({success: false, message: 'Token expired'})
        
        findUserToken.verifyEmailToken = undefined
        findUserToken.verifyEmailTokenExpires = undefined
        findUserToken.isVerified = true
        await findUserToken.save()

        res.json({success: true, message: 'Verification and account creation complete, please login'})

    } catch (err) {
        console.log(err)
        res.json({success: false, message: 'An error occured'})
    }
})

router.post('/reVerify',  async (req, res) => {
    const { email } = req.body
    const findUserWithEmail = await User.findOne({email}) 
    if(!findUserWithEmail) return res.json({error: 'Email not found, please signup!'})


    // Verifying user using nodemailer
    const randomToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(randomToken).digest('hex')

    //using passport's user object, the keys and values of the user authenticated by passport can be retrieved from the schema
    findUserWithEmail.verifyEmailToken = hashedToken
    findUserWithEmail.verifyEmailTokenExpires = Date.now() + 3600000
    //save it to the database 
    findUserWithEmail.save()

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'buymoreapp24@gmail.com',
            pass: process.env.PASS
        }
    })

    const url = `${process.env.EXTERNAL_URL_FRONTEND_HOSTED}/verifyEmail/${randomToken}`
    const message = `
        <h2>Click on the link below to complete and activate your account, link expires in 1 hour</h2>
        <a href=${url}>Verify</a>`

    try {
        await transporter.sendMail({
            to: email,
            subject: 'Verify buymore Account',
            html: message
        })
        res.json({linkSent: true, msg: 'Verification link has been sent to your email, kindly check your inbox to complete the signup process'})
    } catch(err) {
        await User.findByIdAndDelete(findUserWithEmail._id)
        res.json({error: 'Verification link could not be sent, try again'})
    }
})

router.post('/login',  (req, res, next) => {
    const { rememberMe } = req.body
    passport.authenticate('local-signin', (err, user, info) => {
        
        //check for authentication error
        if(err) {
            return res.status(500).json({ error: 'Server error' })
        }

        //check if user wasn't authenticated 
        //Meaaning the done() returned false as its second argument in the strategy 
        if(!user) {
            return res.json({ error: info.message })
        }
        if(user.isVerified === false) {
            return res.json({hasToVerify: true, error: 'Please verify your email to login'})
        }
        // Proceed to log user in when signup is a success and authentication was through
        // Meaning the done() returned a user credentials as a second arguemtn instead of false 
        req.logIn(user, (err) => {
            if(err) {
                return res.status(500).json({ error: 'Log in failed!' })
            }
            //while logging user in, check if user has enabled remeber me, if so, keep the user logged in for a month until logged out him/herself 
            if(rememberMe) {
                req.session.cookie.originalMaxAge = 1000 * 60 * 60 * 24 * 30 //change the age in the store to a month
            }

            res.status(200).json({ success: info.message, user })
        })
        
    })(req, res, next)  
})
router.get('/logout', (req, res) => {
    if(req.user) {
        req.logout(err => {
            if(err) {
                res.json({error: `Error logging out, try again!\n${err}`})
            }
            res.clearCookie('connect.sid');
            res.json({success: true, message: 'Kindly come back next time to buy More!'})
        })
    } else {
        res.json({error: 'User not authenticated'})
    }
})

router.get('/checkAuth', (req, res) => {
    if(req.isAuthenticated()) {
        res.json({authenticated: true, user: req.user})
    } else {
        res.json({authenticated: false, message: 'Not authenticated, please log into your account'})
    }
})
//change username
router.post('/changeUsername/:id', async (req, res) => {
    const { id } = req.params
    const { updatedUsername } = req.body
    try {
        const findExistingUsername = await User.findOne({username: updatedUsername})
        if(findExistingUsername) return res.json({error: 'Username already exist'})

        const findUserAndUpdate = await User.findByIdAndUpdate(id, { username: updatedUsername })
        if(!findUserAndUpdate) { 
            res.json({ error: 'An error occured updating User info, try again another time' })
        } else {
            res.json({success: true, user: findUserAndUpdate})
        }
        console.log('name to change ',updatedUsername)
        console.log('changeUser', findUserAndUpdate)

    } catch (err) {
        console.log(err)
    }
})
//add/ChangePhone
router.post('/updatePhone/:id', async (req, res) => {
    const { id } = req.params
    const { updatedPhone } = req.body
    try {
        if(updatedPhone.length !== 10) return res.json({error: 'Phone number must 10 digits'})
        const findUserAndUpdate = await User.findByIdAndUpdate(id, { phone: updatedPhone })
        if(!findUserAndUpdate) return res.json({ error: 'An error occured updating User credentials, try again another time' })
        res.json({success: true, user: findUserAndUpdate})
    } catch (err) {
        console.log(err)
    }
})
//add/ChangeAbout
router.post('/updateAbout/:id', async (req, res) => {
    const { id } = req.params
    const { updatedAbout } = req.body
    try {
        const findUserAndUpdate = await User.findByIdAndUpdate(id, { about: updatedAbout })
        if(!findUserAndUpdate) return res.json({ error: 'An error occured updating User credentials, try again another time' })
        res.json({success: true, user: findUserAndUpdate})
    } catch (err) {
        console.log(err)
    }
})

//update userProfilePicture
router.post('/updateProfilePicture/:id', upload.single('profileImage'), async (req, res) => {
    const { id } = req.params
    try {
        const userProfileImage = req.file.path

        const findUserAndUpdateProfileImage = await User.findByIdAndUpdate(
            id, 
            { profileImage: userProfileImage }, 
            { new: true }
        )

        if(findUserAndUpdateProfileImage) return res.json({findUserAndUpdateProfileImage})
    } catch (err) {
        res.json({message: err})
    }
    
})
router.post('/deleteProfilePicture/:id', async (req, res) => {
    const { id } = req.params
    try {
        const delProfile = await User.findByIdAndUpdate(id, {profileImage: null})
        if(delProfile) {
            res.json({success: true})
        }
    } catch(err) {
        res.json({error: err})
    }
})

//handling the nulter errors for the upload
router.use((err, req, res, next) => {
    if(err instanceof multer.MulterError) {
        if(err.code === 'LIMIT_FILE_SIZE') return res.json({error: true, message: 'Image size too large. Size must be less than 2MB'})
        if(err.code === 'LIMIT_UNEXPECTED_FILE') return res.json({error: true, message: 'Only Image files accepted'})
        return res.json({error: true, message: err.message})
    } else if(err) {
        return res.json({error: true, message: 'An unknown error occured'})
    }
})

//delete user account
router.post('/delUser/:id', async (req, res) => {
    const { id } = req.params
    const { password } = req.body
    try {
        const findUserForDeletion = await User.findById(id)
        if(findUserForDeletion) {
            const passwordCompare = await bcrypt.compare(password, findUserForDeletion.password)
            if(passwordCompare) {
                req.logout(err => {
                    if(err) {
                        res.json({error: 'Error logging out, try again!'})
                    }
                })
                await User.deleteOne(findUserForDeletion)
                res.json({status: true, message: 'Account delete successful'})
            } else {
                res.json({status: false, message: 'Incorrect password'})
            }
        } else {
            res.json({status: false, message: 'There was an error deleting your acoount, try again another time'})
        }
    } catch(err) {
        res.json({status: false, message: `An unexpected error \n${err}`})
    }
})


//Password Reset and Forgot Password

router.post('/forgot-password', async (req, res) => {
    const { resetEmail } = req.body
    const findUser = await User.findOne({email: resetEmail})
    if(!findUser) return res.json({success: false, message: 'User not found'})
    
    //generating a random tokenusing the crypto library
    const resetToken = crypto.randomBytes(32).toString('hex')
    //random 32byte number needs to be hashed to make the token secure
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    //the resetPasswod fields of the user are set for these hashedToken
    findUser.resetPasswordToken = hashedToken
    //Expiration of the token is then set from then to an hour time
    findUser.resetPasswordTokenExpires = Date.now() + 3600000
    //save the changes tio the database
    await findUser.save()

    //SETUP NODEMAILER FOR APP TO SEND RESET LINKS

    //A transporter is set for the app to transport messages to users Gmail account
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'buymoreapp24@gmail.com', //Gmail Account to transport/send messages
            pass: process.env.PASS //This is an APP password set for the above Gmail for the App (Not the usual Gmail Password for the above account)
        }
    })

    //verification link and message setup
    //a frontend link to redirect user to enter a new password (sent to the user seeking reset)
    const resetUrl = `${process.env.EXTERNAL_URL_FRONTEND_HOSTED}/reset-password/${resetToken}`
    //the message to be sent to the user seeking password reset (***Sent in html format to make the link clickable***)
    const  message = `<h2>You requested for a password reset, click on the link below to reset password, expires in 1 hour</h2><a href=${resetUrl}>Click Here to reset password</a>`

    try {
        //the mail receiver (user account seeking password reset)
        await transporter.sendMail({
            to: findUser.email, //account to transport the message to
            subject: 'Password Reset', //subject of the mail
            html: message //body of the mail to be sent (ths will contain the message declared above)
        })
        //After message has been sent succeessfully, a frontend response is sent to indicate the link sent
        res.json({success: true, message: 'Reset link sent to your email'}) 
    } catch (err) {
        //if anything goes south, reset the resetPassword fields of the user to undefined 
        findUser.resetPasswordToken = undefined
        findUser.resetPasswordTokenExpires = undefined
        //save it to the user document
        await findUser.save()

        console.log(err)
        res.json({success: false, message: 'Reset link could not be sent, try again'})
    }
})

//the route/link to allow user to enter a new password and get saved in the database
router.post('/reset-password/:token', async (req, res) => {
    //the token atached to the url from the frontend endpoint and the new password from the user is acquired from the request body
    const { token } = req.params
    const { newPassword, confNewPassword } = req.body

    //check if password was entered
    if(!newPassword) return res.json({success: false, message: 'Password required'})
    if(!confNewPassword) return res.json({success: false, message: 'Confirm new password'})

    //the token is hashed is then hashed again to ensure validity if being compared to an existing hashed toen
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    //Users documents are then searched to check if any has such token available
    //the expiration token date is queried to be gretater than the present date because an hour was added and to ensure it hasn't expired
    const findUser = await User.findOne({
        resetPasswordToken: hashedToken, 
        resetPasswordTokenExpires: { $gt: Date.now() }
    })
    //if a document with such credentials is not found, it means the token attached to the url is either invalid or has expired 
    if(!findUser) return res.json({success: false, message: 'Invalid or expired token'})

    if(newPassword !== confNewPassword) {
        return res.json({success: false, message: 'Passwords do not match'})
    }
    //if found, the newly entered password is is compared with the existing/forgotten pasword and if same, user is asked to enter a different password
    const compareWithExistingForgottenPassword = await bcrypt.compare(newPassword, findUser.password) 
    if(compareWithExistingForgottenPassword) return res.json({success: false, message: 'You recently used this password, choose a different one'})

    //if not same, the new password is hashed and saved to the database as users password password and reset is complete
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const newUserPassword = await bcrypt.hash(newPassword, salt)
    findUser.password = newUserPassword
    findUser.resetPasswordToken = undefined
    findUser.resetPasswordTokenExpires = undefined

    await findUser.save()
    
    res.json({success: true, message: 'Password reset successful, please login'})
})

module.exports = router