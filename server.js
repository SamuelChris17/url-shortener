const express = require('express')
const shortId = require('shortid')
const createHttpError = require('http-errors')
const mongoose = require('mongoose')
const path = require('path')
const ShortUrl = require('./models/url.model')
const shortid = require('shortid')

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

mongoose
    .connect('mongodb://localhost:27017', {
        dbName: 'url-shortener',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('mongoose connected'))
    .catch((error) => console.log('error connecting..3'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', async(req, res, next) => {
    res.render('index')
});

app.post('/', async(req, res, next) => {
    try {
       const { url } = req.body
       if(!url) {
        throw createHttpError.BadRequest('Provide a valid url')
       }
       const urlExists = await ShortUrl.findOne({ url })
       if (urlExists) {
        res.render('index', {short_url: `https://localhost:5500/${urlExists.shortId}`})
        return
       }
       const shortUrl = new ShortUrl({url: url, shortId: shortId.generate() })
       const result = await shortUrl.save()
       res.render('index', {short_url: `https://localhost:5500/${result.shortId}`})
    } catch (error) {
        next(error)
    }
})


app.get('/:shortId', async (req, res, next) => {
    try {
        const { shortId } = req.params
        const result = await ShortUrl.findOne({ shortId })
        if (! result) {
            throw createHttpError.NotFound('Short url does not exist')
        }
        res.redirect(result.url) 
    } catch (error) {
       next(error) 
    }
    
})

app.use((req, res, next) => {
    next(createHttpError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('index', {error: err.message})
})

app.listen(5500, () => console.log('Server is running at on port 5500'));
