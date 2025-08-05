const axios = require('axios')
const products = require('../Config/Models/productsSchema')

const getRecommendations = async (req, res) => {
    const { userId } = req.params
    try {
        const response = await axios.get(`http://127.0.0.1:8001/recommend/${userId}`)
        const ids = response?.data?.recommendations?.map(item => (item[0]))

        const recommended_products = await products.find({ _id: {$in: ids} })

        res.status(200).json({ recommendations: recommended_products })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

module.exports = getRecommendations