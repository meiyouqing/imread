var express = require('express')
var path = require('path')
var compression = require('compression')

var app = express()
app.disable('x-powered-by');
app.use(compression())

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'tmp')));

// send all requests to index.html so browserHistory works
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

var PORT = process.argv[2] || process.env.PORT || 8000
app.listen(PORT, function() {
  console.log('Production Express server running at localhost' + PORT)
})
