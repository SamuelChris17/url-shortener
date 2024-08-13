const path = require('path')

app.get('/', (req, res, next) => {
    res.render('index', { title: 'Url Shortener' });
});