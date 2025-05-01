require('dotenv').config()
const express = require('express')
const connectToDB = require('../Config/connection/mongooseConnect')
const cookieParser = require('cookie-parser')
const userAuthRoutes = require('../Routes/userAuthRoutes')
const productsRoutes = require('../Routes/productsRoutes')
const paymentRoute = require('../Routes/payment')
const userRoutes = require('../Routes/userRoutes')
const cors = require('cors')

const app = express();

app.use(cors({
    origin: process.env.EXTERNAL_URL_FRONTEND_HOSTED,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}))

//connect to database locally
connectToDB()

app.use(express.json())
app.use(cookieParser())

app.set('trust proxy', 1) //set for render because render uses proxy and if not sent it will block cookies from being set and sent to the client

//Routes
// Auhentication routes
app.use(userAuthRoutes)

//user Routes
app.use(userRoutes)

//productsRoutes
app.use(productsRoutes)

//payments
app.use(paymentRoute)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`)
})