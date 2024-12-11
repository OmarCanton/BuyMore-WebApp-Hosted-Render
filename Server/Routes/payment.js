require('dotenv').config()
const { Router } =  require('express')
const Stripe = require('stripe')
// const User = require('../Config/Models/UserSchema')

const router = Router()
const stripe = Stripe(process.env.STRIPE_KEY)

router.post('/checkout', async (req, res) => {
    const { items, userId } = req.body

    try {
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
            success_url: `${process.env.EXTERNAL_URL_FRONTEND_HOSTED}/checkout/success`,
            cancel_url: `${process.env.EXTERNAL_URL_FRONTEND_HOSTED}/checkout/cancel`,
            metadata: {
                userId: userId
            }
        })
        res.json({id: session.id})
    } catch(err) {
        res.json({error: true, msg: `Error completing payment\n${err}`})
    }
})

//**webhooks are used to get the purchase info and stored to the database
//**this will be implemented later */

// router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
//     console.log('indside webhook')
//     const sig = req.headers['stripe-signature']
//     const endpointSecret = process.env.ENDPOINT_SECRET_KEY

//     let event

//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret) 
//     } catch(err) {
//         console.error(err)
//         console.log(req.headers)
        
//        return res.json({error: true, message: err.message})
//     }

//     if(event.type === 'checkout.session.completed') {
//         const session = event.data.object
//         const  userId = session.metadata.userId
//         try {
//             const user  = await User.findByIdAndUpdate(
//                 userId,
//                 {$push: {
//                     orders: {
//                         items: session.display_items,
//                         amount: session.amount_total / 100,
//                         currency: session.currency,
//                         status: 'succeeded',
//                         sessionId: session.id,
//                         date: new Date(),
//                     }
//                 }}, { new: true}
//             )
//             if(!user) {
//                 console.log('User Not found!')
//                 return res.json({error: 'user Not found!'})
//             } else {
//                 console.log('success:', user)
//             }
//             res.json({received: true})
//         } catch(err) {
//             console.log(err.message)
//         }
//     } else {
//         console.log('Unhandled Event!, err')
//     }
// })


module.exports = router

