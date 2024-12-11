const { Router } = require('express')
const { 
    allProductsController,
    addProducts, 
    newArrivals,
    appleFeaturedProducts,
    samsungFeaturedProducts,
    nikeFeaturedProducts,
    luisVuittonFeaturedProducts,
    addComment,
    getAllProductComments,
    addRating,
    searchProduct,
    filterProduct,
} = require('../Controllers/allProducts')


const router = Router()

router.get('/products', allProductsController)

router.get('/newArrivals', newArrivals)

//add the products
router.post('/addProducts', addProducts)

//featuredProducts
router.get('/appleFeaturedProducts', appleFeaturedProducts)
router.get('/nikeFeaturedProducts', nikeFeaturedProducts)
router.get('/samsungFeaturedProducts', samsungFeaturedProducts)
router.get('/luisVuittonFeaturedProducts', luisVuittonFeaturedProducts)

//ad comment to a product
router.post('/addProductComment', addComment)
//add rating to a product
router.post('/addRating', addRating)
//get all products comments and ratings inclusive
router.get('/getComments/:id', getAllProductComments)
//search for products
router.get('/search', searchProduct)

//filter products
router.get('/filter', filterProduct)

module.exports = router