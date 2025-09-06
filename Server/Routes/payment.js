require('dotenv').config()
const { Router } =  require('express')
const Stripe = require('stripe')
const Orders = require('../Config/Models/orders')
const crypto = require('crypto')

const router = Router()
const stripe = Stripe(process.env.STRIPE_KEY)

router.post('/checkout', async (req, res) => {
    const { items, userId } = req.body
    const uuid = crypto.randomUUID()

    try {
        items && items.map(item => {
            const order = new Orders({
                status: 'pending',
                actualPrice: item.actualPrice,
                brand: item.brand,
                category: item.category,
                description: item.description,
                image: item.image,
                name: item.name,
                prevPrice: item.prevPrice,
                quantity: item.quantity,
                totalItemPrice: item.totalItemPrice,
                userId,
                uniqueId: uuid
            })
            order.save()
        })
        const lineItems = items.map(product => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.name,
                    images: [product.image]
                },
                unit_amount: Math.round(product.actualPrice * 100)
            }, 
            quantity: product.quantity
        }))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.EXTERNAL_URL_FRONTEND_HOSTED}/checkout/success?tag=${uuid}`,
            cancel_url: `${process.env.EXTERNAL_URL_FRONTEND_HOSTED}/checkout/cancel?tag=${uuid}`,
            metadata: {
                userId: userId
            }
        })
        res.status(200).json({id: session.id})
    } catch(err) {
        res.status(500).json({error: true, msg: `Error completing payment\n${err}`})
    }
})

router.post('/paymentSucceeded', async (req, res) => {
    const { tag } = req.query
    try {
        await Orders.updateMany({uniqueId: tag} , {$set: {status: 'paid'}})
    } catch(err) {
        res.status(500).json({
            message: err?.message
        })
    }
})

router.post('/paymentfailed', async (req, res) => {
    const { tag } = req.query
    try {
        await Orders.updateMany({uniqueId: tag} , {$set: {status: 'failed'}})
    } catch(err) {
        res.status(500).json({
            message: err?.message
        })
    }
})



module.exports = router

