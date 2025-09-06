const Products = require('../Config/Models/productsSchema')

const addProduct = async (req, res) => {
    const { 
        name, 
        category, 
        actualPrice, 
        prevPrice, 
        description, 
        brand
    } = req.body
    try {
        const productImage = req?.file?.path
        
        const product = new Products({
            image: productImage,
            name: name,
            category: category,
            actualPrice: actualPrice,
            prevPrice: prevPrice,
            description: description,
            brand: brand,
        })

        product.save()

        res.status(201).json({ message: 'Item added to Shop'})
    } catch (err) {
        res.status(500).json({ message: err?.message })
    }
}

module.exports = {
    addProduct,
}