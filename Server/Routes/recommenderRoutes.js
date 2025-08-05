const { Router } = require('express')
const getRecommendations = require('../Controllers/getRecommendations')

const router = Router()

router.get('/get_recommendations/:userId', getRecommendations)

module.exports = router