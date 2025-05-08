require('dotenv').config()
const mongoose = require('mongoose')

const mongoDB_Url = process.env.MONGODB_URL
const connectToDB  = async () => {
    try {
        await mongoose.connect(mongoDB_Url)
        console.log('Database connection established')
    } catch (err) {
        console.log(`Database Conection failed:: ${err}`)
    }
}
module.exports = connectToDB