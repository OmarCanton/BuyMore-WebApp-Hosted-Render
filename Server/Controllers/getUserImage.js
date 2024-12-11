const mongoose = require('mongoose')
const User = require('../Config/Models/UserSchema')

const getUserImage = async (req, res) => {
    const { id } = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({error: 'invalid user'})
        }
        
        const findUserImage = await User.findById(id)
        if(findUserImage) {
            res.json(findUserImage.profileImage)
        }
    } catch(err) {
        console.log(err)
    }
}
module.exports = { getUserImage }