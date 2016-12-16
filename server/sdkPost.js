import Ajax from '../src/js/modules/AJAX'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { RouterContext } from 'react-router'

const sdkPost =  function(url,res,props){
  url = url.replace(/\?.*$/,'') //移出微信有时自带字符
  global.pathname = url;
  global.imdata = {};
//  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>'+url)
  const path = url.replace(/^\//,'').replace(/\/$/,'').split('/');
  let param = path[path.length-1];

  //sdk
    console.log('sdk param >>>>>>> '+param)
    const AJAX = new Ajax(param);
    AJAX.get(function(data){
        global.imdata.sdk = data;
        goSend(res,props,param,data.style);
    },(err)=>{onError(res,err)})
}

export default sdkPost;

function goSend(res,props,param,style){
      try{
        const appHtml = renderToString(<RouterContext {...props}/>)
        res.send(sdkFullPage(appHtml,param,style))
      }catch(err){
        onError(res,err,true)
      }
}
function onError(res,err){
    res.send(sdkFullPage('<div style="margin-top:100px;text-align:center;"><i>抱歉!没有找到相关数据...</i></div>'));
    console.log('request faile: '+err);
}    


function sdkFullPage (html, param, style){
  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <title>艾美阅读-发现阅读之美</title>
        <link href="/src/css/imreadsdk.css" rel="stylesheet" type="text/css"></link>
        <style></style>
      </head>
      <body>
        <div id="appContainer">${html}</div>
         ${(style=='5' || style=='11')? '<script src="/src/js/swipe.js"></script>' : ''}
        <script>
            var a = document.querySelectorAll('a');
            for (var i=0,l=a.length;i<l;i++){
                a[i].setAttribute('target','_top');
            }           
          ${(style=='5' || style=='11')? 'document.querySelector(".m-block-top.m-block.n-padding").style.marginTop="0";var swipeNavs = document.querySelectorAll(\'.swipe-nav-wrap a\');if(swipeNavs.length > 1){swipeNavs[0].className="f-fl swipe-nav-item swipe-nav-item-active";var swipe = document.querySelector(\'.subCat-5 .swipe\');new Swipe(swipe,{auto:3000,callback:function(index){for(var i=0;i<swipeNavs.length;i++){swipeNavs[i].className = "f-fl swipe-nav-item";if(i===index){swipeNavs[i].className = "f-fl swipe-nav-item swipe-nav-item-active"}}}})}' : ''}
          window.onload=function(){
            setTimeout(function(){window.parent.postMessage({param:'${param}',h:document.getElementById('appContainer').scrollHeight},'*')},0);
          }
        </script>
      </body>
    </html>
    `
}