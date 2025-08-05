const products = require('../Config/Models/productsSchema')

const allProductsController = async (req, res) => {
    const {page} = req.query || 0
    const productsPerPage = 20
    try {
        const all_products = await products.find()
        .lean()
        .sort({ createdAt: -1 })
        .skip(page * productsPerPage)
        .limit(productsPerPage)
        
        if(!all_products) {
            return res.status(403).json({error: true, message: 'No products found at this moment, try again another time!'})
        }
        const totalNoProducts = await products.countDocuments()
        const totalNoPages = Math.ceil(totalNoProducts/productsPerPage)

        res.status(200).json({ products: all_products, totalPages: totalNoPages })

    } catch (err) {
        console.log(err)
        res.status(500).json({error: true, message: 'Oops, can\'t retrieve products at this moment, try again another time!'})
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
        res.json({error: true, message: 'Unable to add product at this time'})
    }
}
const newArrivals = async (req, res) => {
    try {
        const newArrivals = await products.find()
        .lean()
        .sort({createdAt: -1})
        .limit(5)

        if(!newArrivals) return res.status(400).json({error: 'No new arrivals at this time'})

        res.status(200).json({newArrivals})
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Unable to retrieve new arrivals at this time'})
    }
} 
const appleFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await products.find({brand: 'Apple'}).lean().limit(5)
        res.status(200).json({featuredProducts})
    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Cannot retrieve products at this time'})
    }

} 
const samsungFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await products.find({brand: 'Samsung'}).lean().limit(5)
        res.status(200).json({featuredProducts})
    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Cannot retrieve products at this time'})
    }

} 
const nikeFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await products.find({brand: 'Nike'}).lean().limit(5)
        res.status(200).json({featuredProducts})
    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Cannot retrieve products at this time'})
    }

} 
const luisVuittonFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await products.find({brand: 'Louis Vuitton'}).lean().limit(5)
        res.status(200).json({featuredProducts})
    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Cannot retrieve products at this time'})
    }

} 
const addComment = async (req, res) => {
    const { productId, userId, username, comment } = req.body
    try {
        const findProduct = await products.findById(productId)

        if(!findProduct) {
            return res.status(403).json({ message: 'Product not found' })
        }

        const userComment = findProduct.comments.find(comment => comment.userId === userId)
        if(userComment) {
            userComment.comment.push(comment)
        } else {
            findProduct.comments.push({
                userId,
                username,
                comment: [comment],
                rating: null,
                createdAt: new Date()
            })
        }
        await findProduct.save()
        res.status(200).json({message: `Thanks for your feedback, ${username}`})

    } catch(err) {
        console.log(err)
        res.status(500).json({message: 'Unable to add comment at this time'}) 
    }
}
const addRating = async (req, res) => {
    const { productId, userId, username, rating } = req.body
    try {
        //find product
        const findProduct = await products.findById(productId)

        
        if(!findProduct) {
            return res.status(403).json({message: 'Product not found'})
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
                username,
                comment: [],
                rating,
                createdAt: new Date()
            })
        }
        await findProduct.save()
        res.status(200).json({message: `Thanks for your feedback ${username}`})
    } catch(err) {
        console.log(err)
        res.status(500).json({message: 'Unable to add rating at this time'})
    }
}
const getAllProductComments = async (req, res) => {
    const { id } = req.params    
    try {
        const findProduct = await products.findById(id)
        if (findProduct) {
            res.status(200).json({message: 'success', comments: findProduct.comments})
        }
    } catch(err) {
        console.log(err)
        res.status(500).json({message: 'Unable to retrieve comments at this time'})
    }                                                                                                                                   
}
const searchProduct = async (req, res) => {
    const { name } = req.query
    const searchResults = await products.find({ name: {$regex: name, $options: 'i'} }).lean()
    if(!searchResults) {
        res.status(200).json({message: `No results for '${name}'`})
    } else{
        res.status(200).json({searchResults, name})
    }
}

const filterProduct = async (req, res) => {
    const { filterKey } = req.query
    const filteredResults = await products.find({category: filterKey}).lean()
    if(!filteredResults) {
        res.status(200).json({message: 'No results for this for this category'})
    } else {
        res.status(200).json({filteredResults})
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