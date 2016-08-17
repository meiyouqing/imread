

var Token = {
	refreshToken: function () {
		var oldToken = GLOBAL.cookie('token');
		if (oldToken) {
			AJAX.getJSON('GET', '/api/v1/upToken', {
				//oldToken: encodeURIComponent(oldToken)
			}, function(data) {
				if(data.code==200){
					GLOBAL.cookie('token', data.token, {
						expires: 1000
					});
					
				}else{
					GLOBAL.removeCookie('userPhone');
					GLOBAL.removeCookie('token');
					GLOBAL.removeCookie('userId');
				}
			}, function(res) {
				GLOBAL.removeCookie('userPhone');
				GLOBAL.removeCookie('token');
				GLOBAL.removeCookie('userId');
			});
		}
	}
};

module.exports = Token;