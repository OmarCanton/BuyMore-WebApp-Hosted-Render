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
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body>
                <div style="display: flex; align-items: center; justify-content: center; border: 1px solid grey; border-radius: 5px; flex-direction: column; width: fit-content; padding: 10px;">
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
            </body>
            </html>
            `
            

        try {
            await transporter.sendMail({
                to: user.email,
                subject: 'Verify BuyMore Account',
                html: message
            })
            res.status(201).json({linkSent: true, message: 'Verification link has been sent to your email, kindly check your inbox, or spam to complete the signup process'})
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
