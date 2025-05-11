require('dotenv').config()
const { Router } = require('express')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const User = require('../Config/Models/UserSchema')
const multer = require('multer')
const upload = require('../Config/multerConfig')
const nodemailer = require('nodemailer')
const MulterErrorHandler = require('../Helpers/multerErrorHandler')

const router = Router();

//change username
router.post('/changeUsername/:id', async (req, res) => {
    const { id } = req.params
    const { updatedUsername } = req.body
    try {
        const findExistingUsername = await User.findOne({username: updatedUsername})
        if(findExistingUsername) return res.status(409).json({ message: 'Username already exist' })

        const findUserAndUpdate = await User.findByIdAndUpdate(id, { username: updatedUsername })
        if(!findUserAndUpdate) { 
            res.status(500).json({ message: 'An error occured updating User info, try again another time' })
        } else {
            res.status(200).json({ user: findUserAndUpdate})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error' })
    }
})
//add/ChangePhone
router.post('/updatePhone/:id', async (req, res) => {
    const { id } = req.params
    const { updatedPhone } = req.body
    try {
        if(updatedPhone.length !== 10) return res.status(400).json({ message: 'Phone number must 10 digits'})
        const findUserAndUpdate = await User.findByIdAndUpdate(id, { phone: updatedPhone })
        if(!findUserAndUpdate) return res.status(500).json({ message: 'An error occured updating User credentials, try again another time' })
        res.status(200).json({ user: findUserAndUpdate })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error' })
    }
})
//add/ChangeAbout
router.post('/updateAbout/:id', async (req, res) => {
    const { id } = req.params
    const { updatedAbout } = req.body
    try {
        const findUserAndUpdate = await User.findByIdAndUpdate(id, { about: updatedAbout })
        if(!findUserAndUpdate) return res.status(500).json({ message: 'An error occured updating User credentials, try again another time' })
        res.status(200).json({ user: findUserAndUpdate })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal Server error' })
    }
})

//update userProfilePicture
router.post('/updateProfilePicture/:id', upload.single('profileImage'), MulterErrorHandler, async (req, res) => {
    const { id } = req.params
    try {
        const userProfileImage = req.file.path
        const findUserAndUpdateProfileImage = await User.findByIdAndUpdate(
            id, 
            { profileImage: userProfileImage }, 
            { new: true }
        )
        if(findUserAndUpdateProfileImage) return res.status(200).json({ message: 'Profile updated', userProfileImage: findUserAndUpdateProfileImage.profileImage })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Interval server error' })
    }
    
})
router.post('/deleteProfilePicture/:id', async (req, res) => {
    const { id } = req.params
    try {
        const delProfile = await User.findByIdAndUpdate(id, {profileImage: null})
        if(delProfile) {
            res.status(200).json({ message: 'Profile picture removed successfully' })
        }
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: 'Internal Server error' })
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
                //logout the user by deleting the refresh token
                findUserForDeletion.refreshToken = undefined
                findUserForDeletion.refreshToken_expires = undefined
                await findUserForDeletion.save()
                //delete the user
                await User.deleteOne(findUserForDeletion)
                res.status(200).json({ message: 'Account delete successful' })
            } else {
                res.status(400).json({ message: 'Incorrect password' })
            }
        } else {
            res.status(401).json({ message: 'There was an error deleting your acoount, try again another time' })
        }
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: `An unexpected error occured, try again another time` })
    }
})


//Password Reset and Forgot Password

router.post('/forgot-password', async (req, res) => {
    const { resetEmail, userEmail } = req.body
    const findUser = await User.findOne({email: resetEmail})
    if(!findUser) return res.status(400).json({ message: 'User not found' })
    if(findUser.email !== userEmail) return res.status(400).json({ message: 'Enter your Email instead' })
    
    //generating a random tokenusing the crypto library
    const resetToken = crypto.randomBytes(32).toString('hex')
    //random 32byte number needs to be hashed to make the token secure
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    //the resetPasswod fields of the user are set for these hashedToken
    findUser.resetPasswordToken = hashedToken
    //Expiration of the token is then set from then to an hour time
    findUser.resetPasswordTokenExpires = Date.now() + 3600000
    //save the changes to the database
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
    const  message = `
        <div style="display: flex; align-items: center; justify-content: center; border: 1px solid grey; border-radius: 5px; flex-direction: column; width: fit-content; padding: 10px">
            <h1>Password Reset - BuyMore App</h1>
            <p>Please click on the button below to reset your password on BuyMore</p>
            <p>If the button fails to work, copy and paste the link in your browser to get verified </p>
            <p>If you did not request this, we strongly advice you to ignore this mail
            <div style="margin-top: 10%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <button style="background-color: blue; border: none; padding: 10px; padding-left: 15px; padding-right: 15px; border-radius: 3px;">
                    <a href=${resetUrl} style="color: white; text-decoration: none; font-weight: bold;">Reset Password</a>
                </button>
                <a href=${resetUrl}>${resetUrl}</a>
            </div>
            <p style="margin-top: 10%;">Thank you, Omar (Developer)</p>
            <p style="margin-top: 10%;">&cpoy; BuyMore, ${Date.getFullYear()}</p>
        </div>
    `

    try {
        //the mail receiver (user account seeking password reset)
        await transporter.sendMail({
            to: findUser.email, //account to transport the message to
            subject: 'Password Reset', //subject of the mail
            html: message //body of the mail to be sent (ths will contain the message declared above)
        })
        //After message has been sent succeessfully, a frontend response is sent to indicate the link sent
        res.status(200).json({ message: 'Reset link sent to your email'}) 
    } catch (err) {
        //if anything goes south, reset the resetPassword fields of the user to undefined 
        findUser.resetPasswordToken = undefined
        findUser.resetPasswordTokenExpires = undefined
        //save it to the user document
        await findUser.save()

        console.log(err)
        res.status(500).json({ message: 'Reset link could not be sent, try again'})
    }
})

//the route to allow user to enter a new password and get saved in the database
router.post('/reset-password/:token', async (req, res) => {
    //the token atached to the url from the frontend endpoint and the new password from the user is acquired from the request body
    const { token } = req.params
    const { newPassword, confNewPassword } = req.body

    //check if password was entered
    if(!newPassword) return res.status(400).json({ message: 'Password required'})
    if(!confNewPassword) return res.status(400).json({ message: 'Confirm new password'})
    try {
        //the token is then hashed again to ensure validity if being compared to an existing hashed token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
        //Users documents are then searched to check if any has such token available
        //the expiration token date is queried to be gretater than the present date because an hour was added and to ensure it hasn't expired
        const findUser = await User.findOne({
            resetPasswordToken: hashedToken, 
            resetPasswordTokenExpires: { $gt: Date.now() }
        })
        //if a document with such credentials is not found, it means the token attached to the url is either invalid or has expired 
        if(!findUser) return res.status(400).json({ message: 'Invalid or expired token'})

        //check if password has the at least one uppercase, one number and a symbol and also minimum of eight characters long
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z0-9!@#$%^&*()_+-|{}]{8,}$/
        if(!passwordRegex.test(newPassword)) {
            return res.status(400).json({ 
                message: 'Password must contain at least one uppercase, one number, one special character and must be at least 8 characters long ' 
            })
        }
        
        //if found, the newly entered password is is compared with the existing/forgotten pasword and if same, user is asked to enter a different password
        const compareWithExistingForgottenPassword = await bcrypt.compare(newPassword, findUser.password) 
        if(compareWithExistingForgottenPassword) return res.status(400).json({ message: 'You recently used similar password, choose a different one'})

        //if not same, the new password is hashed and saved to the database as users password password and reset is complete
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const newUserPassword = await bcrypt.hash(newPassword, salt)
        const newUserConfPassword = await bcrypt.hash(confNewPassword, salt)
        if(newUserPassword !== newUserConfPassword) return res.status(409).json({ message: 'Passwords do not match' })
        
        findUser.password = newUserPassword
        findUser.resetPasswordToken = undefined
        findUser.resetPasswordTokenExpires = undefined

        await findUser.save()
        
        res.status(200).json({ message: 'Password reset successful, please login'})
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
})

module.exports = router