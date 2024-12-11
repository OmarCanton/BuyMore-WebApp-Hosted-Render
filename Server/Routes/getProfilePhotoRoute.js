const { Router } = require('express')
const { getUserImage } = require('../Controllers/getUserImage')
const router = Router()

router.get('/getProfilePicture/:id', getUserImage)

module.exports = router