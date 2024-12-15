require('dotenv').config()
const express = require('express')
const connectToDB = require('../Config/connection/mongooseConnect')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const userAuthRoutes = require('../Routes/userAuthRoutes')
const googleAuthRoutes = require('../Routes/googleAuthRoutes')
const productsRoutes = require('../Routes/productsRoutes')
const getUserProfilePhoto = require('../Routes/getProfilePhotoRoute')
const paymentRoute = require('../Routes/payment')
const mongoose = require('mongoose')
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

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true, //cookie not accessible by client-side javaScript
        secure: true,   // Ensures cookie is sent only over HTTPS
        sameSite: 'none', //If both front-end and back-end have different domains just like this one, this must set to none else lax or strict
        maxAge: 1000 * 60 * 60 * 24 * 2 //store user session for 2 days --default 
    }, 
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    })
}))

app.use(passport.initialize())
app.use(passport.session())

//Routes
// Auhentication routes
app.use(userAuthRoutes)
app.use(googleAuthRoutes)
app.use(productsRoutes)
//get user image
app.use(getUserProfilePhoto)
//payments
app.use(paymentRoute)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`)
})