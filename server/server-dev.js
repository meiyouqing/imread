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
import { renderToString } from 'react-dom/server'
import { RouterContext } from 'react-router'

import getPost from './getPost-dev'
import sdkPost from './sdkPost'

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

// app.get(/nono/,()=>{console.log('nonononoo')})   //test conect overtime
// route the pay rout resolve reading page
app.get('/pay',(req, res)=>{
    res.send(renderFullPage('',{}));
});
app.get(/\/reading\/|\/shelf/,(req, res)=>{
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

const port = process.argv[2] || 80
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
  console.log(url);
	if(/\\p\\modules\\.+\.js$/.test(path.resolve(url))){
		res.setHeader('Cache-Control','max-age=31536000')
	}
	if(/\\p\\[^\\]+(\.png|\.gif|\.jpg)$/.test(path.resolve(url))){
		res.setHeader('Cache-Control','max-age=31536000')
	}
}

function renderFullPage (html, preloadedState){
  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="keywords" content="小说,小说网,言情小说,玄幻小说,武侠小说,都市小说,历史小说,网络小说,原创网络文学,出版书,正版小说,正版电子小说,艾美阅读,免费小说,好看的小说,小说下载,免费小说下载,下载,艾美阅读手机站" />
        <meta name="description" content="小说在线阅读、下载，精彩小说尽在艾美阅读。艾美阅读提供小说，小说网，言情小说，玄幻小说，武侠小说，都市小说，历史小说，出版书，正版小说，正版电子小说，网络小说，原创网络文学。" />
        <title>艾美阅读-发现阅读之美</title>
        <link href="/p/style.css" rel="stylesheet" type="text/css"></link>
        <link href="//at.alicdn.com/t/font_smbelzs6o6dh1tt9.css" rel="stylesheet" type="text/css"></link>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/src/img/weblogo.png" />
      </head>
      <body>
        <script>
            (function () {   
                var ua = window.navigator.userAgent.toLowerCase(), code;
                if(/micromessenger/.test(ua) && !localStorage.getItem('userToken')) {
                    code = /code=[^\&]+/.test(location.search);
                    if(code){
                        localStorage.setItem('userToken','wxLogined');
                    }else{      
                      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc4b3ed2404d2139f&redirect_uri='+encodeURIComponent(location.origin+'/wxlogin?callback='+encodeURIComponent(location.href))+'&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect';
                    }
                }
               //var str = '<div style="position:absolute;z-index:9999;width:100%;height:200px;top:0;">'+/micromessenger/.test(ua)+'>>'+!localStorage.getItem('userToken')+'>>'+code+'</div>';
               //document.body.innerHTML += str;
            })()
        </script>
        <div id="appContainer">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
        </script>
        
        <script src="/p/bundle1.js"></script>
      </body>
    </html>
    `
}
