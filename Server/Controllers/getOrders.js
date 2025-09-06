const Orders = require('../Config/Models/orders')

const getAllOrders = async (req, res) => {
    const { id } = req.params
    try {
        const orders = await Orders.find({ userId: id })
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json({ message: err?.message })
    } 
}


module.exports = {
    getAllOrders
}