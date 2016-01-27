//"use strict"

var ReactDOM = require('react-dom');
var Frame = require('./frame');

//GLOBAL.setUser({
//	phone: GLOBAL.cookie('userPhone'),
//	token: GLOBAL.cookie('userToken')
//});

//Token.refreshToken();
window.headerIndex = 0;

ReactDOM.render(<Frame />, document.getElementById('app-container'));

setTimeout(Router.visitMiGu, 3000);

//var Balance = require('./balance');
//ReactDOM.render(<Balance />, document.getElementById('app-container'));
