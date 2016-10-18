import AJAX from '../src/js/modules/AJAX'
import React from 'react'

const getPost =  function(url,callback,onError){
  
  global.pathname = url;
  global.imdata = {};
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>'+url)
  const path = url.replace(/^\//,'').replace(/\/$/,'').split('/');
  let param = path[path.length-1];
  if(path.length<3 && !/pay$/.test(url)){
    AJAX.init('group.1');
    // console.log('pathpathpathpathpath>>> '+path)
    AJAX.get(data=>{
      param = path.length ===2?param:'page.'+data.pagelist[0].pgid;
      global.imdata['mallNav'] = data;
     if( path.length !== 2) global.pathname += '/'+param;
      goRend();
    },onError);
    return;
  }else if(/top\/block\.\d$/.test(url)){
    AJAX.init('group.6');
    AJAX.get(data=>{
      param = 'page.'+data.pagelist[0].pgid+'.'+data.pagelist[0].blocks+'.1';
      global.imdata['topNav'] = data;
      goRend();
    },onError);
    return;
  }
  goRend();
  function goRend(){
    if(!/[\.]/.test(param)) {
      callback();
      return;
    }
    // console.log('param>>>>>>>>>>: '+param);
    const n = param.replace(/\./g,'_');
    AJAX.init(param);
    AJAX.get(function(data){
      global.imdata[n] = data;
      callback();
    },onError)
  }
}

export default getPost;