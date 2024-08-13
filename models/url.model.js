const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShortUrlSchema = newSchema({
    url: {
        type: String,
        required: true,
    },
    shortId: {
        type: String,
        required: true,
    }
})

const ShortUrl = mongoose.model('shortUrl', ShortUrlSchema)

module.exports = ShortUrl