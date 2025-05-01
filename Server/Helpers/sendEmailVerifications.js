require('dotenv').config()
const User = require('../Config/Models/UserSchema')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const sendEmails = async (user, res) => {
    try {
        //send a verification link to the user email after signup
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
            res.status(201).json({linkSent: true, message: 'Verification link has been sent to your email, kindly check your inbox to complete the signup process'})
        } catch(err) {
            await User.findByIdAndDelete(user._id)
            res.status(401).json({ message: 'Verification link could not be sent, try again later'})
        }
    } catch(err) {  
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = sendEmails
