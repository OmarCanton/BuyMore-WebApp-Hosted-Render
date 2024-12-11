const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    actualPrice: {
        type: Number,
        required: true
    },
    image: String,
    description: String,
    brand: String,
    prevPrice: Number,
    comments: [
        {
            userId: String,
            username: String,
            comment: [String],
            rating: Number,
            createdAt: {
                type: Date,
                default: Date.now()
            }
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('Products', productsSchema)