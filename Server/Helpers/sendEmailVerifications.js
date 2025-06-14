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
            <html>
            <head>
            <style>
                body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                }
                .email-container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                }
                .header {
                background-color:rgb(42, 141, 239);
                color: white;
                padding: 15px;
                text-align: center;
                border-radius: 5px 5px 0 0;
                }
                .content {
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 0 0 5px 5px;
                }
                .otp-code {
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
                color: rgb(42, 141, 239);
                }
                .footer {
                margin-top: 20px;
                font-size: 12px;
                text-align: center;
                color: #777;
                }
            </style>
            </head>
            <body>
            <table class="email-container" cellpadding="0" cellspacing="0" border="0">
                <tr>
                <td class="header">
                    <h2>Your Verification Link</h2>
                </td>
                </tr>
                <tr>
                <td class="content">
                    <p>Hello,</p>
                    <p>Thank you for signing up. Here is your link for verification:</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center">
                        <div class="otp-code">${url}</div>
                        </td>
                    </tr>
                    </table>
                    
                    <p>This code will expire in 1 hour. Please do not share this code with anyone.</p>
                    <p>If you didn't request this link, please ignore this email.</p>
                </td>
                </tr>
                <tr>
                <td class="footer">
                    <p>&copy; ${new Date().getFullYear()} BuyMore | All rights reserved.</p>
                </td>
                </tr>
            </table>
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
