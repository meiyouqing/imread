//"use strict"
import browserHistory from './modules/history'
import { Router, Route} from 'react-router'
import ReactDOM from 'react-dom'
import routes from './components/routes'
import GLOBAL from './modules/global'
import Token from './modules/token'

if(/appid=\w+/.test(window.location.search) && !GLOBAL.appid){
	var appid = window.location.search.match(/appid=(\w+)&?/)[1];
	GLOBAL.header.appid = appid;
}
if(/channel=\w+/.test(window.location.search) && !GLOBAL.channel){
	var channel = window.location.search.match(/channel=(\w+)&?/)[1];
	GLOBAL.header.channel = channel;
}

require('./modules/readConfig');

// GLOBAL.setUser({
// 	phone: GLOBAL.cookie('userPhone'),
// 	token: GLOBAL.cookie('userToken')
// });

Token.refreshToken();

ReactDOM.render(
	<Router routes={routes} history={browserHistory}/>, 
	document.getElementById('app-container')
);

