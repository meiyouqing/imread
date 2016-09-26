/* eslint-disable no-console, no-use-before-define */

import path from 'path'
import express from 'express'
// import qs from 'qs'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'
import compression from 'compression'

import React from 'react'
import { match } from 'react-router'

import getPost from './getPost'


import routes from '../src/js/components/routes'
// import { Provider } from 'react-redux'

// import configureStore from '../src/js/store/configureStore'
// import App from '../src/js/containers/App'

const app = express()
const port = 8080

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, '../public'), {index: false}))
// This is fired every time the server side receives a request
app.use(compression())

// send all requests to index.html so browserHistory works
app.get('*', (req, res) => {
  match({ routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirect) {
      res.redirect(redirect.pathname + redirect.search)
    } else if (props) {
      getPost(props,req,res)
    } else {
      res.status(404).send('Not Found')
    }
  })
})


app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
})
