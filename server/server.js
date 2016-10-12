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
app.use(compression())
app.disable('x-powered-by');


// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig)

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.use(express.static(path.join(__dirname, '../public'), {setHeaders:setHeader}))

// send all requests to index.html so browserHistory works
app.get('/nonono',()=>{});
app.get('*', (req, res) => {
  //if(/undefined$/.test(req.url)) return;  //TODO resolve this
  match({ routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirect) {
      res.redirect(redirect.pathname + redirect.search)
    } else if (props) {
      res.setHeader('cache-control','private,max-age=600')
      getPost(props,req,res)
    } else {
      res.status(404).send('Not Found')
    }
  })
})

const port = process.argv[2] || 80
app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port} server started`)
  }
})

function setHeader(res,url,stat){	
	if(/\.js$/.test(path.resolve(url))){
		res.setHeader('cache-control','private,max-age=31536000')
	}
	if(/\/p[^\/]+$/.test(path.resolve(url))){
    console.log(path.resolve(url))
		res.setHeader('cache-control','max-age=31536000')
	}
}