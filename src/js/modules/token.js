import Ajax from '../modules/AJAX'
import GLOBAL from '../modules/global'
import storage from '../modules/storage'


var Token = {
	refreshToken: function () {
		// var oldToken = GLOBAL.cookie('userToken');
		// if (oldToken) {
			new Ajax().getJSON('GET', '/api/v1/upToken', {
				//oldToken: encodeURIComponent(oldToken)
			}, function(data) {
				if(data.code==200){
					// GLOBAL.cookie('token', data.token, {
					// 	expires: 1000
					// });
					//GLOBAL.cookie('uuid', data.uuid,{expires: 1000});
				}else{
					//GLOBAL.removeCookie('userPhone');
					storage.rm('userToken');
					//GLOBAL.removeCookie('userId');
					//GLOBAL.removeCookie('uuid');
				}
			}, function(res) {
				//GLOBAL.removeCookie('userPhone');
				storage.rm('userToken');
				//GLOBAL.removeCookie('userId');
				//GLOBAL.removeCookie('uuid');
			});
		//}
	}
};

module.exports = Token;