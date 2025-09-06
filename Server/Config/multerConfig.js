require('dotenv').config()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')


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
            return `${req.params._id}_profile`
        },
    }
    
})

const productImages_storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'product_images',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: (req, file) => {
            return `${file}_product_image`
        },
    }  
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 //Shouldnt be more than 2MB
    },
})

const upload_productImage = multer({
    storage: productImages_storage,
    limits: {
        fileSize: 10 * 1024 * 1024 //Shouldnt be more than 10MB
    },
})

module.exports = { upload, upload_productImage }
