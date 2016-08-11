
// var express = require('express')
// var path = require('path')
// //var compression = require('compression')

// var app = express()

// //app.use(compression())

// // serve our static stuff like index.css
// app.use(express.static(path.join(__dirname, 'tmp')));

// // send all requests to index.html so browserHistory works
// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'index.html'))
// })

// var PORT = process.env.PORT || 8080
// app.listen(PORT, function() {
//   console.log('Production Express server running at localhost:' + PORT)
// })

//server.js
var express = require('express')
var path = require('path')
//var compression = require('compression')
import React from 'react'
// we'll use this to render our app to an html string
import { renderToString } from 'react-dom/server'
// and these to match the url to routes and then render
import { match, RouterContext } from 'react-router'
import routes from './src/js/components/routes'

var app = express()

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname,'public')))

// send all requests to index.html so browserHistory in React Router works
app.get('*', (req, res) => {
  // match the routes to the url
  match({ routes: routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      console.log('xxxxxxxxxxxxxxxxx'+err.message)
      // there was an error somewhere during route matching
      res.status(500).send(err.message)
    } else if (redirect) {
      // we haven't talked about `onEnter` hooks on routes, but before a
      // route is entered, it can redirect. Here we handle on the server.
      res.redirect(redirect.pathname + redirect.search)
    } else if (props) {
      console.log('>>>>>>>>>>>>>>>>>>>>'+props[0])
      console.log('>>>>>>>>>>>>>>>>>>>>'+props[1])
      // if we got props then we matched a route and can render
      const appHtml = renderToString(<RouterContext {...props}/>)
      res.send(renderPage(appHtml))
    } else {
      // no errors, no redirect, we just didn't match anything
      res.status(404).send('Not Found')
    }
  })
})

function renderPage(appHtml) {
  return `
    <!doctype html public="storage">
    <html>
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <link rel=stylesheet href="/src/css/iconfont1.css">
    <link rel=stylesheet href="/src/css/imread.css">
    <link rel=stylesheet href="/src/css/user.css">
    <link rel=stylesheet href="/src/css/bookSheet.css">
    <link rel=stylesheet href="/src/css/introduce.css">
    <link rel=stylesheet href="/src/css/pay.css">
    <link rel=stylesheet href="/src/css/reading.css">
    <link rel=stylesheet href="/src/css/recentRead.css">
    <link rel=stylesheet href="/src/css/tag.css">
    <link rel=stylesheet href="/src/css/about.css">
    <link rel=stylesheet href="/src/css/compact.css">
    <link rel=stylesheet href="/src/css/confirm.css">
    <div id=appContainer>${appHtml}</div>
    <script src="/app/app.bundle.js"></script>
   `
}

var PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})

