const { Router } = require('express')
const { addProduct } = require('../Controllers/admin')
const { upload_productImage } = require('../Config/multerConfig')
const { MulterErrorHandler2 } = require('../Helpers/multerErrorHandler')


const router = Router()

//Add products to store
router.post('/add_product', upload_productImage.single('productImage'), MulterErrorHandler2, addProduct)

//delete products
// router.delete('/deleteProduct/:id', deleteProduct)

//update products
// router.update('/updateProduct/:id', updateProduct)

module.exports = router