const multer = require('multer')
const path = require('path')

//multer config
const storage = multer.diskStorage({
    destination: '../Client/public/UserProfile', //save image to uploads/profiles folder on the frontend
    filename: (req, file, done) => {
        done(null, file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 },
    fileFilter: (req, file, done) => {

        const filetypes = /jpeg|jpg|png/
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = filetypes.test(file.mimetype)
    
        if(extname && mimetype) {
            return done(null, true)
        } else {
            done('Error: Only Images are accepted', false)
        }
    }
})
module.exports = { upload }
