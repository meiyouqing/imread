import AJAX from '../src/js/modules/AJAX'
import { renderToString } from 'react-dom/server'
import { RouterContext } from 'react-router'
import React from 'react'

const getPost =  function(props,req,res){
  global.pathname = req.url;
  global.imdata = {};
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>'+req.url)
  const path = req.url.split('/');
  let param = path[path.length-1];
  if(path.length<4){
    AJAX.init('group.1');
    //console.log(path)
    AJAX.get(data=>{
      param = path.length ===3?param:'page.'+data.pagelist[0].pgid+'.'+data.pagelist[0].blocks;
      global.imdata['mallNav'] = data;
      //console.log(global.imdata)
      goRend();
    });
    return;
  }
  goRend();
  function goRend(){
    //console.log('param: '+param)   
    const n = param.replace(/\./g,'_');
    AJAX.init(param);
    AJAX.get(function(data){
      global.imdata[n] = data;
      //console.log(props)
      try{
        const appHtml = renderToString(<RouterContext {...props}/>)
        res.send(renderFullPage(appHtml,global.imdata))
      }catch(err){
        //console.log(err)
        console.error(err)
      }
    })
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