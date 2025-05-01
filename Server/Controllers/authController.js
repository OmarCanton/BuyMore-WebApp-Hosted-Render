require('dotenv').config()
const User = require('../Config/Models/UserSchema')
const bcrypt = require('bcrypt')
const { generateAccessToken, generateRefreshToken } = require('../Utils/token')
const sendEmails = require('../Helpers/sendEmailVerifications')
const jwt = require('jsonwebtoken')

const signupUser = async (req, res) => {
    try {
        const { username, email, password, confPassword, birthday, sex } = req.body
        if(!username) return res.status(400).json({ message: 'Username is required' })
        if(!password) return res.status(400).json({ message: 'Password is required' })
        if(!confPassword) return res.status(400).json({ message: 'Confirm password' })
        if(!email) return res.status(400).json({ message: 'Email is required' })
        if(!birthday) return res.status(400).json({ message: 'Birthdate is required' })
        if(!sex) return res.status(400).json({ message: 'Sex is required' })

        //check if password has the at least one uppercase, one number and a symbol and also minimum of eight characters long
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z0-9!@#$%^&*()_+-|{}]{8,}$/
        if(!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: 'Password must contain at least one uppercase, one number, one special character and must be at least 8 characters long ' 
            })
        }
        //Check the database if user credentials provided already exist
        const existingUsernameDetails = await User.findOne({ username })
        if(existingUsernameDetails) return res.status(409).json({ message: 'Username already exist' })
        const chceckExistingEmail = await User.findOne({ email })
        if(chceckExistingEmail) return res.status(409).json({ message: 'Email already exist' })
        
        //Hashing user password before saving to database for security reasons
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)
        const hashedconfPassword = await bcrypt.hash(confPassword, salt)
        if(hashedPassword !== hashedconfPassword) return res.status(409).json({ message: 'Passwords do not match' })
        
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

        // send email after successful registration
        await sendEmails(local_User, res)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const loginUser = async (req, res) => {
    const { email, password, rememberMe } = req.body

    try {
        if(!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const user = await User.findOne({ email })
        if(!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        if(user.isVerified === false) return res.status(403).json({ hasToVerify: true, message: 'Please Verify your Email to login', ver: user.isVerified})

        const passMatch = await bcrypt.compare(password, user.password)
        if(!passMatch) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user, rememberMe)

        rememberMe ? res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, //set to false at development
            sameSite: 'strict', //set to strict for cross-site access
            maxAge: 365 * 24 * 60 * 60 * 1000,
            domain: process.env.EXTERNAL_URL_FRONTEND_HOSTED
        }) : res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, 
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000,
            domain: process.env.EXTERNAL_URL_FRONTEND_HOSTED
        })

        const authenticatedUser = await User.findOne({ email: user.email }).lean().select("-password")

        res.status(200).json({ message: `Welcome ${user.username}`, token: accessToken, authenticatedUser })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) return res.status(401).json({ message: 'Session expired, please login again' })
        
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
            if(err) return res.status(403).json({ message: 'Invalid refresh token, please login' })
            const newAccessToken = generateAccessToken(user)
            return res.status(200).json({ token: newAccessToken })
        })

    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
}
const logoutUser = async (req, res) => {
    const token = req.cookies.refreshToken
    try {
        if(token) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax'
            })
            return res.status(200).json({ success: true, message: 'Logout successful, come back another time to BuyMore!'})
        }
        return res.status(404).json({ success: false, message: 'No refresh token found!' })
    } catch(err) {
        console.error(err)
        return res.status(500).json({ success: false, message: 'Logout failed!'})
    }
}


module.exports = { loginUser, signupUser, refresh, logoutUser }