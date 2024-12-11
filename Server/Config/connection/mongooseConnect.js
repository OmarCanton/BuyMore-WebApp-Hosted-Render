require('dotenv').config()
const mongoose = require('mongoose')

const mongoDB_Url = process.env.MONGODB_URL
const connectToDB  = async () => {
    try {
        await mongoose.connect(mongoDB_Url)
        .then(() => console.log('Database connection established'))
        .catch(err => console.log(`Error connecting to database\n${err}`))
    } catch (err) {
        console.log(err)
    }
}
module.exports = connectToDB