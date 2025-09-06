const { Router } = require('express')
const { getAllOrders } = require('../Controllers/getOrders')

const router = Router()

router.get('/getOrders/:id', getAllOrders)


module.exports = router