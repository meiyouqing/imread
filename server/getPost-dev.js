import AJAX from '../src/js/modules/AJAX'
import React from 'react'

const getPost =  function(req,callback,onError){
  const url = req.url.replace(/\?.*$/,'') //移出微信有时自带字符
  global.pathname = url;
  global.imdata = {};
 console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>'+url)
  const path = url.replace(/^\//,'').replace(/\/$/,'').split('/');
  let param = path[path.length-1];

  //sdk
  if(/sdk\/sdk\.\d+/.test(url)){
    console.log('sdk param >>>>>>> '+param)
    AJAX.init(param);
    AJAX.get(function(data){
      global.imdata.sdk = data;
      callback(true,param);
    },(err)=>{onError(err,true)})
    return;
  }

  if(path.length<3 && /^\/mall/.test(url)){
    const match = req.headers.cookie && req.headers.cookie.match(/group_id=(\d)/);
    const group_id = (match && match[1]) || 1;
    console.log(group_id)
    AJAX.init('group.1.'+group_id);
    console.log('pathpathpathpathpath>>> '+path)
    AJAX.get(data=>{
      param = 'page.'+data.pagelist[0].pgid;
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
    console.log('param>>>>>>>>>>: '+param);
    const n = param.replace(/\./g,'_');
    AJAX.init(param);
    AJAX.get(function(data){
      global.imdata[n] = data;
      callback();
    },onError)
  }
}

export default getPost;