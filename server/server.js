/* eslint-disable no-console, no-use-before-define */

import path from 'path'
import express from 'express'
// import qs from 'qs'
import compression from 'compression'
import React from 'react'
import { match } from 'react-router'
import { renderToString } from 'react-dom/server'
import { RouterContext } from 'react-router'

import getPost from './getPost'
import sdkPost from './sdkPost'

import { loadingHTML, renderFullPage } from './htmlContent'

import routes from '../src/js/components/routes'
// import { Provider } from 'react-redux'

// import configureStore from '../src/js/store/configureStore'
// import App from '../src/js/containers/App'

const app = express()
app.use(compression())
app.disable('x-powered-by');



app.use(express.static(path.join(__dirname, '../../public'), {setHeaders:setHeader}))

// route the pay rout resolve reading page
app.get('/pay',(req, res)=>{
    res.send(renderFullPage('',{}));
});
app.get(/\/reading\//,(req, res)=>{
    res.send(renderFullPage('',{}));
});
app.get(/\/sdk\/sdk\.\d+/,(req, res)=>{
  match({ routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirect) {
      res.redirect(redirect.pathname + redirect.search)
    } else if (props) {
      res.setHeader('cache-control','private,max-age=600')
      sdkPost(req.url,res,props)
    } else {
      res.status(404).send('Not Found')
    }
  })
});
app.get('*', (req, res) => {
  if(/(error|undefined|favicon\.ico)$/.test(req.url)) return;  //TODO resolve this
  match({ routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirect) {
      res.redirect(redirect.pathname + redirect.search)
    } else if (props) {
      res.setHeader('cache-control','private,max-age=600')
      getPost(req.url, goSend.bind(null,res,props), onError.bind(null,res))
    } else {
      res.status(404).send('Not Found')
    }
  })
})

const port = process.argv[2] || 9097
app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port} server started`)
  }
})

//fetch handle
function goSend(res,props){
    try{
      const appHtml = renderToString(<RouterContext {...props}/>)
      res.send(renderFullPage(appHtml,global.imdata))
    }catch(err){
      onError(res,err)
    }
}
function onError(res,err){
  res.send(renderFullPage('',null));
  console.log('request faile: '+err);
}    

//set static acesse header
function setHeader(res,url,stat){	
	if(/\.js$/.test(path.resolve(url))){
		res.setHeader('cache-control','private,max-age=31536000')
	}
	if(/\/p[^\/]+$/.test(path.resolve(url))){
    //console.log(path.resolve(url))
		res.setHeader('cache-control','max-age=31536000')
	}
}
