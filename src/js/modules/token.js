

var Token = {
	refreshToken: function () {
		var oldToken = GLOBAL.cookie('userToken');
		if (oldToken) {
			AJAX.getJSON('GET', '/api/v1/upToken', {
				//oldToken: encodeURIComponent(oldToken)
			}, function(data) {
				if(data.code==200){
					// GLOBAL.cookie('token', data.token, {
					// 	expires: 1000
					// });
					
				}else{
					//GLOBAL.removeCookie('userPhone');
					GLOBAL.removeCookie('userToken');
					GLOBAL.removeCookie('userId');
					GLOBAL.removeCookie('uuid');
				}
			}, function(res) {
				//GLOBAL.removeCookie('userPhone');
				GLOBAL.removeCookie('userToken');
				GLOBAL.removeCookie('userId');
				GLOBAL.removeCookie('uuid');
			});
		}
	}
};

module.exports = Token;