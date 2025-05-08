const User = require('../Config/Models/UserSchema')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const re_verifyEmail = async (req, res) => {
    const { email } = req.body
    const findUserWithEmail = await User.findOne({email})
    if(!findUserWithEmail) return res.status(400).json({message: 'Email not found, please signup!'})
    
    //check if the user is already verified
    if(findUserWithEmail.isVerified) return res.status(400).json({ message: 'User is already verified, please login'})

    // Verifying user using nodemailer
    const randomToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(randomToken).digest('hex')

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
        res.status(200).json({linkSent: true, message: 'Verification link has been sent to your email, kindly check your inbox to complete the signup process'})
    } catch(err) {
        await User.findByIdAndDelete(findUserWithEmail._id)
        res.status(500).json({ message: 'Verification link could not be sent, try again'})
    }
}

module.exports = re_verifyEmail