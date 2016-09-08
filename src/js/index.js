//"use strict"
import browserHistory from './modules/history'
import { Router, Route, createElement} from 'react-router'
import ReactDOM from 'react-dom'
import React from 'react'
import routes from './components/routes'
import GLOBAL from './modules/global';
import Token from './modules/token';
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
	GLOBAL.setUser({
		phone: GLOBAL.cookie('userPhone'),
		token: GLOBAL.cookie('userToken')
	});
	Token.refreshToken();	
}

render(
	<Router createElement={createElement} routes={routes} history={browserHistory}/>, 
	document.getElementById('appContainer')
);

