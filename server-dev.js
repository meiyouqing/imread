var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var express = require('express')
var path = require('path')
//var compression = require('compression')

var app = express()

//app.use(compression())

//hot modle for development
var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'tmp')));

// send all requests to index.html so browserHistory works
app.get('/pay', function (req, res) {	
  res.setHeader('Cache-Control', 'no-cache')
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

var PORT = process.argv[2] || 80
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})
