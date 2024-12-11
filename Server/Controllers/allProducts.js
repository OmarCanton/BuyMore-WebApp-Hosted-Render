const products = require('../Config/Models/productsSchema')

const allProductsController = async (req, res) => {
    const {page} = req.query || 0
    const productsPerPage = 20
    try {
        const all_products = await products.find({})
        .sort({createdAt: -1})
        .skip(page * productsPerPage)
        .limit(productsPerPage)
        
        if(!all_products) {
            return res.json({error: true, message: 'No products found at this moment, try again another time!'})
        }
        const totalNoProducts = await products.countDocuments()
        const totalNoPages = Math.ceil(totalNoProducts/productsPerPage)

        res.json({ products: all_products, totalPages: totalNoPages })

    } catch (err) {
        console.log(err)
        res.json({error: true, message: 'Oops, can\'t retrieve products at this moment, try again another time!'})
    }
}
const addProducts = async (req, res) => {
    const {
        name,
        image,
        description,
        actualPrice,
        prevPrice,
        brand,
        category } = req.body

    try {
        const newProducts = new products({
            name,
            image,
            description,
            actualPrice,
            prevPrice,
            brand,
            category,
        })
        await newProducts.save()
        res.json({newProducts})
    } catch(err) {
        console.log(err)
    }
}
const newArrivals = async (req, res) => {
    try {
        const newArrivals = await products
        .find()
        .sort({createdAt: -1})
        .limit(5)

        if(newArrivals) {
            return res.json({newArrivals})
        } else { 
            return res.json({error: 'Unable to find products requested'})
        }
    } catch(err) {
        console.log(err)
    }
} 
const appleFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await products.find({brand: 'Apple'}).limit(5)
        res.json({featuredProducts})
    } catch (err) {
        console.log(err)
        res.json({error: 'Cannot retrieve products at this time'})
    }

} 
const samsungFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await products.find({brand: 'Samsung'}).limit(5)
        res.json({featuredProducts})
    } catch (err) {
        console.log(err)
        res.json({error: 'Cannot retrieve products at this time'})
    }

} 
const nikeFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await products.find({brand: 'Nike'}).limit(5)
        res.json({featuredProducts})
    } catch (err) {
        console.log(err)
        res.json({error: 'Cannot retrieve products at this time'})
    }

} 
const luisVuittonFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await products.find({brand: 'Louis Vuitton'}).limit(5)
        res.json({featuredProducts})
    } catch (err) {
        console.log(err)
        res.json({error: 'Cannot retrieve products at this time'})
    }

} 
const addComment = async (req, res) => {
    const { productId, userId, user_username, comment } = req.body
    try {
        const findProduct = await products.findById(productId)

        if(!findProduct) {
            return res.json({err: 'Product not found'})
        }

        const userComment = findProduct.comments.find(comment => comment.userId === userId)
        if(userComment) {
            userComment.comment.push(comment)
        } else {
            findProduct.comments.push({
                userId,
                username: user_username,
                comment: [comment],
                rating: null,
                createdAt: new Date()
            })
        }
        await findProduct.save()
        res.json({msg: `Thanks for your feedback, ${user_username}`})

    } catch(err) {
        console.log(err)
    }
}
const addRating = async (req, res) => {
    const { productId, userId, user_username, rating } = req.body
    try {
        //find product
        const findProduct = await products.findById(productId)

        
        if(!findProduct) {
            return res.json({err: 'Product not found'})
        }

        //find matching user ID
        const commentsArray = findProduct.comments.find(user => user.userId === userId)

        if(commentsArray) {
            //if user already exist,just update the rating field 
            commentsArray.rating = rating
        } else {
            //else create a new comment array for the user
            findProduct.comments.push({
                userId, 
                username: user_username,
                comment: [],
                rating,
                createdAt: new Date()
            })
        }
        await findProduct.save()
        res.json({msg: `Thanks for your feedback ${user_username}`})
    } catch(err) {
        console.log(err)
    }
}
const getAllProductComments = async (req, res) => {
    const { id } = req.params    
    try {
        const findProduct = await products.findById(id)
        if (findProduct) {
            res.json({msg: 'success', comments: findProduct.comments})
        }
    } catch(err) {
        console.log(err)
    }                                                                                                                                   
}
const searchProduct = async (req, res) => {
    const { name } = req.query
    const searchResults = await products.find({ name: {$regex: name, $options: 'i'} })
    if(!searchResults) {
        res.json({msg: `No results for '${name}'`})
    } else{
        res.json({searchResults, name})
    }
}

const filterProduct = async (req, res) => {
    const { filterKey } = req.query
    const filteredResults = await products.find({category: filterKey})
    if(!filteredResults) {
        res.json({msg: 'No results for this for this category'})
    } else {
        res.json({filteredResults})
    }
}

module.exports = {
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
    filterProduct
}