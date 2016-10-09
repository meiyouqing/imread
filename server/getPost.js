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
  if(path.length<3){
    AJAX.init('group.1');
    //console.log('pathpathpathpathpath>>> '+path)
    AJAX.get(data=>{
      param = path.length ===2?param:'page.'+data.pagelist[0].pgid+'.'+data.pagelist[0].blocks;
      global.imdata['mallNav'] = data;
      goRend();
    });
    return;
  }else if(/top\/block\.\d[\/]?$/.test(req.url)){
    AJAX.init('group.6');
    AJAX.get(data=>{
      param = 'page.'+data.pagelist[0].pgid+'.'+data.pagelist[0].blocks+'.1';
      global.imdata['topNav'] = data;
      goRend();
    });
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
    })
  }
  function goSend(){
      try{
        const appHtml = renderToString(<RouterContext {...props}/>)
        //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>++++++++++++++++++++++'+appHtml)
        res.send(renderFullPage(appHtml,global.imdata))
      }catch(err){
        //console.log(err)
        console.error(err)
      }
  }    
}

function renderFullPage(html, preloadedState) {
  //console.log('ooooooooooooooooooooooooooo'+JSON.stringify(preloadedState))
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
export default getPost;