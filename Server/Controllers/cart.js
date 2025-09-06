// const Cart = require("../Config/Models/Cart")

// const addToCart = async (req, res) => {
//     const { item } = req.body
//     try {
//         const item_new = new Cart({
//             ...item
//         })

//         await item_new.save()
//         res.status(201).json({ message: `${item.name} saved to cart`})
//     } catch(err) {
//         res.status(500).json({ message: err?.message })
//     } 
// }

// const fetchCart = async (req, res) => {
//     try {
//         const items = await Cart.find().lean()
        
//         res.status(200).json({ items })
//     } catch(err) {
//         res.status(500).json({ message: err?.message })
//     } 
// }

// module.exports = {
//     addToCart,
//     fetchCart
// }