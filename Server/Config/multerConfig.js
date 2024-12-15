require('dotenv').config()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const path = require('path')


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'buymoreapp_user_profiles',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: (req, file) => {
            return `${req.user._id}_profile`
        },
    }
    
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 //Shouldnt be more than 2MB
    }
})
module.exports = upload
