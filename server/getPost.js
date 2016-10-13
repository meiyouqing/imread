import AJAX from '../src/js/modules/AJAX'
import { renderToString } from 'react-dom/server'
import { RouterContext } from 'react-router'
import React from 'react'

const getPost =  function(props,req,res){
  global.pathname = req.url;
  global.imdata = {};
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>'+req.url)

  const path = req.url.replace(/^\//,'').replace(/\/$/,'').split('/');
  let param = path[path.length-1];
  if(path.length<3 && !/pay$/.test(req.url)){
    AJAX.init('group.1');
    //console.log('pathpathpathpathpath>>> '+path)
    AJAX.get(data=>{
      param = path.length ===2?param:'page.'+data.pagelist[0].pgid;
      global.imdata['mallNav'] = data;
      goRend();
    },onRequestError);
    return;
  }else if(/top\/block\.\d[\/]?$/.test(req.url)){
    AJAX.init('group.6');
    AJAX.get(data=>{
      param = 'page.'+data.pagelist[0].pgid+'.'+data.pagelist[0].blocks+'.1';
      global.imdata['topNav'] = data;
      goRend();
    },onRequestError);
    return;
  }
  goRend();
  function goRend(){
    if(!/[\.]/.test(param)) {
      goSend();
      return;
    }
    console.log('param>>>>>>>>>>: '+param);
    const n = param.replace(/\./g,'_');
    AJAX.init(param);
    AJAX.get(function(data){
      global.imdata[n] = data;
      goSend();
    },onRequestError)
  }
  function goSend(){
      try{
        const appHtml = renderToString(<RouterContext {...props}/>)
        //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>++++++++++++++++++++++'+appHtml)
        res.send(renderFullPage(appHtml,global.imdata))
      }catch(err){
        onRequestError()
        console.error(err)
      }
  }
  function onRequestError(err){
    console.log('request faile: '+err)
    res.send(renderFullPage('',null))
  }    
}

function renderFullPage(html, preloadedState) {
  //console.log('ooooooooooooooooooooooooooo'+JSON.stringify(preloadedState))
  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <!--<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />-->
        <meta name="keywords" content="小说,小说网,言情小说,玄幻小说,武侠小说,都市小说,历史小说,网络小说,原创网络文学,出版书,正版小说,正版电子小说,艾美阅读,免费小说,好看的小说,小说下载,免费小说下载,下载,艾美阅读手机站" />
        <meta name="description" content="小说在线阅读、下载，精彩小说尽在艾美阅读。艾美阅读提供小说，小说网，言情小说，玄幻小说，武侠小说，都市小说，历史小说，出版书，正版小说，正版电子小说，网络小说，原创网络文学。" />
        <title>艾美阅读-发现阅读之美</title>
        <link href="/p/style.css" rel="stylesheet" type="text/css"></link>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/src/img/logo.png">
        <link rel="apple-touch-icon" href="/src/img/weblogo.png" />
      </head>
      <body>
        <div id="appContainer">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
        </script>
        <script src="/public/bundle.js"></script>
        <script type="text/javascript" src="https://qzonestyle.gtimg.cn/qzone/openapi/qc-1.0.1.js" data-appid="101354986" data-redirecturi="https://m.imread.com/iframe/QQ_Url/index.html" charset="utf-8" defer asgnc></script>
      </body>
    </html>
    `
}
export default getPost;