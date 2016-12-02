/* eslint-disable no-console, no-use-before-define */

import path from 'path'
import fs from 'fs'
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

import AJAX from '../src/js/modules/AJAX'
// import { Provider } from 'react-redux'

// import configureStore from '../src/js/store/configureStore'
// import App from '../src/js/containers/App'

const app = express()
app.use(compression())
app.disable('x-powered-by');



app.use(express.static(path.join(__dirname, '../../public'), {setHeaders:setHeader}))
//语音朗读api
app.get('/baiduClientCredentials',(req,res)=>{
  const token = global.access_token || fs.readFileSync(path.join(__dirname, './access_token.json'),'utf8');
  const token_ = token && JSON.parse(token);
  if(token_ && token_.lastTime + token_.expires_in >= Date.now()){ //access_token does not expired
    res.send(token);
    return;
  }
  AJAX.getJSON('POST','https://openapi.baidu.com/oauth/2.0/token',{
    grant_type:'client_credentials',
    client_id:'RKGTGGGr2DHak0uBVHo7a6nO',
    client_secret:'fT9ebKBzjjZFn24aCihwM1DuoKRtEsIY'
  },sec,err,true);
  function sec(data){  
    data.lastTime = Date.now();
    global.access_token = JSON.stringify(data);
    fs.writeFileSync(path.join(__dirname, './access_token.json'),JSON.stringify(data));
    res.send(JSON.stringify(data))
  }
  function err(err){
    console.log(err.error+' description: '+err.error_description);
    res.status('402').send(JSON.stringify(err))
  }
})
app.get(/(error|undefined|null|favicon\.ico)$/,(req, res)=>{
  console.log('zzzzzzzz > '+req.url);
  res.end();
})
// route the pay rout resolve reading page
app.get(/\/reading\/|\/shelf|\/pay/,(req, res)=>{
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
      sdkPost(req.url,res,props,req.query)
    } else {
      res.status(404).send('Not Found')
    }
  })
});
app.get('*', (req, res) => {
  match({ routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirect) {
      res.redirect(redirect.pathname + redirect.search)
    } else if (props) {
      if(/\/pay|\/login/.test(req.url)){
        res.setHeader('Cache-Control','private,no-cache')
      }else{
        res.setHeader('Cache-Control','private,max-age=60')
      }
      getPost(req, goSend.bind(null,res,props), onError.bind(null,res))
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
  //console.log(url)
	if(/\/p\/modules\/.+\.js$/.test(path.resolve(url))){
		res.setHeader('Cache-Control','max-age=31536000')
	}
	if(/\/p\/[^\/]+(\.png|\.gif|\.jpg)$/.test(path.resolve(url))){
    //console.log(path.resolve(url))
		res.setHeader('Cache-Control','max-age=31536000')
	}
}
