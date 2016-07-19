//"use strict"

import { Router, Route, browserHistory, hashHistory} from 'react-router';
import routes from './components/routes'
import GLOBAL from './modules/global';
import Token from './modules/token';
import { render } from 'react-dom';
require('./modules/readConfig');

if(typeof window === 'undefined'){
	window.isNode = true;
}else{
	global.isNode = false;
}

if(!isNode){
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
	<Router routes={routes} history={browserHistory}/>, 
	document.getElementById('app-container')
);

