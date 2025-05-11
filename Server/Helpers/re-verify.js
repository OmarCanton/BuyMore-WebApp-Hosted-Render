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
        <div style="display: flex; align-items: center; justify-content: center; border: 1px solid grey; border-radius: 5px; flex-direction: column; width: fit-content; padding: 10px">
            <h1>Email Verification - BuyMore App</h1>
            <p>Please click on the button below to verify your account on BuyMore</p>
            <p>If the button fails to work, copy and paste the link in your browser to get verified </p>
            <div style="margin-top: 10%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <button style="background-color: blue; border: none; padding: 10px; padding-left: 15px; padding-right: 15px; border-radius: 3px;">
                    <a href=${url} style="color: white; text-decoration: none; font-weight: bold;">Verify</a>
                </button>
                <a href=${url}>${url}</a>
            </div>
            <p style="margin-top: 10%;">Thank you, Omar (Developer)</p>
        </div>
    `

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