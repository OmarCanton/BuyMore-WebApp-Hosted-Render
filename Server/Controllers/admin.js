const Products = require('../Config/Models/productsSchema')

const addProduct = async (req, res) => {
    console.log(req.body)
    try {
        const product = new Products({
            ...req.body,
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