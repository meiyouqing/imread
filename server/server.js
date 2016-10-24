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
import { loadingHTML, renderFullPage } from './htmlContent'

import routes from '../src/js/components/routes'
// import { Provider } from 'react-redux'

// import configureStore from '../src/js/store/configureStore'
// import App from '../src/js/containers/App'

const app = express()
app.use(compression())
app.disable('x-powered-by');



app.use(express.static(path.join(__dirname, '../../public'), {setHeaders:setHeader}))

// route the pay rout
app.get('/pay',(req, res)=>{
    res.send(renderFullPage(loadingHTML,{}));
});
app.get('*', (req, res) => {
    //resolve reading page
  if(/\/reading\//.test(req.url)) {
    res.send(renderFullPage(loadingHTML,{}));
    return;
  }

  // console.log('oooooooooooooooooooooooooo'+req.url)
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

const port = process.argv[2] || 9099
app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port} server started`)
  }
})

function goSend(res,props){
    try{
      const appHtml = renderToString(<RouterContext {...props}/>)
      res.send(renderFullPage(appHtml,global.imdata))
    }catch(err){
      onError(res,err)
    }
}
function onError(res,err){
  res.send(renderFullPage(loadingHTML,null));
  console.log('request faile: '+err);
}    

function setHeader(res,url,stat){	
	if(/\.js$/.test(path.resolve(url))){
		res.setHeader('cache-control','private,max-age=31536000')
	}
	if(/\/p[^\/]+$/.test(path.resolve(url))){
    //console.log(path.resolve(url))
		res.setHeader('cache-control','max-age=31536000')
	}
}