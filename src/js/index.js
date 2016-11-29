
import browserHistory from 'react-router/lib/browserHistory'
import Router from 'react-router/lib/Router'
import Route from 'react-router/lib/Route'
import ReactDOM from 'react-dom'
import React from 'react'
import routes from './components/routes'
import GLOBAL from './modules/global';
// import Token from './modules/token';
import { render } from 'react-dom';
require('./modules/readConfig');



if(typeof window !== 'undefined'){
	if(/appid=\w+/.test(window.location.search) && !GLOBAL.appid){
		var appid = window.location.search.match(/appid=(\w+)&?/)[1];
		GLOBAL.header.appid = appid;
	}
	if(/channel=\w+/.test(window.location.search) && !GLOBAL.channel){
		var channel = window.location.search.match(/channel=(\w+)&?/)[1];
		GLOBAL.header.channel = channel;
	}
	// 处理服务端渲染失败
	if(window.__PRELOADED_STATE__ === null){
		browserHistory.replace('/');
	}
}else{
	if(/appid=\w+/.test(global.location) && !GLOBAL.appid){
		var appid = global.location.match(/appid=(\w+)&?/)[1];
		GLOBAL.header.appid = appid;
	}
	if(/channel=\w+/.test(global.location) && !GLOBAL.channel){
		var channel = global.location.match(/channel=(\w+)&?/)[1];
		GLOBAL.header.channel = channel;
	}
}

render(
	<Router routes={routes} history={browserHistory}/>, 
	document.getElementById('appContainer')
);

