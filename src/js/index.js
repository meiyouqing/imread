//"use strict"

//var ReactDOM = require('react-dom');
var Frame = require('./components/frame');
var GLOBAL = require('./modules/global');
var Token = require('./modules/token');

if(/appid=\w+/.test(window.location.search) && !GLOBAL.appid){
	var appid = window.location.search.match(/appid=(\w+)&?/)[1];
	GLOBAL.header.appid = appid;
}
if(/channel=\w+/.test(window.location.search) && !GLOBAL.channel){
	var channel = window.location.search.match(/channel=(\w+)&?/)[1];
	GLOBAL.header.channel = channel;
}

require('./modules/readConfig');

GLOBAL.setUser({
	phone: GLOBAL.cookie('userPhone'),
	token: GLOBAL.cookie('userToken')
});

Token.refreshToken();
window.headerIndex = 0;

ReactDOM.render(<Frame />, document.getElementById('app-container'));

// setTimeout(Router.visitMiGu, 3000);

//var Balance = require('./balance');
//ReactDOM.render(<Balance />, document.getElementById('app-container'));
