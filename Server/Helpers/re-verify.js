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
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification</title>
                <style>
                    .container {
                        border: 1px solid grey; 
                        border-radius: 5px; 
                        width: fit-content; 
                        padding: 10px;
                        text-align: center;
                    }
                    .link {
                        gap: 10px;
                    }
                    .btn {
                        background-color: rgb(0, 85, 255); 
                        border: none; 
                        padding: 10px;
                        border-radius: 3px;
                    }
                    .verifyLink {
                        color: white; 
                        text-decoration: none; 
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Email Verification - BuyMore App</h1>
                    <p>Please click on the button below to verify your account on BuyMore</p>
                    <p>If the button fails to work, copy and paste the link in your browser to get verified </p>
                    <p>Link expires in 1 hour</p>
                    <div class="link">
                        <button class="btn">
                            <a class="verifyLink" style="color: white;" href=${url}>Verify</a>
                        </button>
                        <a style="display: block; margin-top: 10px;" href=${url}>${url}</a>
                    </div>
                    <p class="thanks">Thank you, Omar (Developer)</p>
                    <p class="thanks">&copy; BuyMore ${new Date().getFullYear()}. All Rights Reserved.</p>
                </div>
            </body>
        </html>
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