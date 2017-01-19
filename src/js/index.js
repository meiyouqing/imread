import browserHistory from 'react-router/lib/browserHistory';
import Router from 'react-router/lib/Router';
import React from 'react';
import { render } from 'react-dom';
import routes from './components/routes';
import GLOBAL from './modules/global';
// import Token from './modules/token';

require('./modules/readConfig');


if (typeof window !== 'undefined') {
  //地址中带上cookie中的appid参数
  const cookiedAppid = GLOBAL.cookie('jndl_appid');
  if(cookiedAppid){
    if(location.search){
      if(!/appid/.test(location.search)){
        location.search = location.search+'&appid='+cookiedAppid;
      }
    }else{
      location.search = '?appid='+cookiedAppid;
    }
  }
  
  if (/appid=\w+/.test(window.location.search) && !GLOBAL.appid) {
    const appid = window.location.search.match(/appid=(\w+)&?/)[1];
    GLOBAL.header.appid = appid;
    // console.log(GLOBAL.cookie('jndl_appid') , appid)
    if(cookiedAppid !== appid){
       sessionStorage.clear();
       GLOBAL.cookie('jndl_appid', appid);
    }
  }
  if (/channel=\w+/.test(window.location.search) && !GLOBAL.channel) {
    const channel = window.location.search.match(/channel=(\w+)&?/)[1];
    GLOBAL.header.channel = channel;
    if(GLOBAL.cookie('jndl_channel') !== channel){
       sessionStorage.clear();
        GLOBAL.cookie('jndl_channel', channel);
    }
  }
	// 处理服务端渲染失败
  if (window.__PRELOADED_STATE__ === null) {
    browserHistory.replace('/');
  }
} else {
  if (/appid=\w+/.test(global.location) && !GLOBAL.appid) {
    const appid = global.location.match(/appid=(\w+)&?/)[1];
    GLOBAL.header.appid = appid;
  }
  if (/channel=\w+/.test(global.location) && !GLOBAL.channel) {
    const channel = global.location.match(/channel=(\w+)&?/)[1];
    GLOBAL.header.channel = channel;
  }
}

render(
  <Router routes={routes} history={browserHistory} />,
	document.getElementById('appContainer')
);

