const multer = require('multer');

const MulterErrorHandler = (err, req, res, next) => {
    if(err instanceof multer.MulterError) {
        if(err.code === 'LIMIT_FILE_SIZE') return res.status(500).json({ message: 'Image size too large. Size must be less than 2MB '})
        if(err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(500).json({ message: 'Only Image files accepted' })
        return res.status(500).json({ message: err.message })
    }
    next()
}
module.exports = MulterErrorHandler