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
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'

import AJAX from '../src/js/modules/AJAX'

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
app.use(express.static(path.join(__dirname, 'public'), {index: false}))
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
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>'+req.url)
      const path = req.url.split('/');
      const param = path[path.length-1];
      const n = param.replace(/\./g,'_');
      global.imdata = {};
      AJAX.init(param);
      AJAX.get(function(data){
        global.imdata[n] = data;
        try{
          const appHtml = renderToString(<RouterContext {...props}/>)
          console.log(appHtml)
          res.send(renderFullPage(appHtml,{[n]:data}))
        }catch(err){
          console.log(err)
          console.error(err)
        }
        
        // const store = configureStore(preloadedState)
        // const finalState = store.getState()
      })
    } else {
      res.status(404).send('Not Found')
    }
  })
})

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
        <title>艾美阅读</title>
      </head>
      <body>
        <div id="appContainer">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
        </script>
        <script src="/public/bundle.js"></script>
      </body>
    </html>
    `
}

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
})
