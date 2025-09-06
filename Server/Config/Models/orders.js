const mongoose = require('mongoose')

const orders_schema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed'],
        default: 'pending'
    },
    actualPrice: String,
    brand:String, 
    category: String,
    description: String,
    image: String,
    name: String,
    prevPrice: String,
    quantity: String,
    totalItemPrice: String,
    userId: String,
    uniqueId: String,
}, { timestamps: true })

const Orders = mongoose.model('Orders', orders_schema)

module.exports = Orders