const User = require('../Config/Models/UserSchema')
const crypto = require('crypto')

const verifyEmail = async (req, res) => {
    const { token } = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    try {
        const findUserToken = await User.findOne({
            verifyEmailToken: hashedToken,
            verifyEmailTokenExpires: { $gt: Date.now() }
        })

        if(!findUserToken) return res.status(401).json({ message: 'Token expired' })
        
        findUserToken.verifyEmailToken = undefined
        findUserToken.verifyEmailTokenExpires = undefined
        findUserToken.isVerified = true

        await findUserToken.save()

        res.status(200).json({ message: 'Verification and account creation complete, please login'})

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err?.message})
    }
}

module.exports = verifyEmail