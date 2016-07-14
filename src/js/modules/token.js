

var Token = {
	refreshToken: function () {
		var oldToken = GLOBAL.cookie('userToken');
		if (oldToken) {
			AJAX.getJSON('GET', '/api/upToken', {
				//oldToken: encodeURIComponent(oldToken)
			}, function(data) {
				if(data.code==200){
					GLOBAL.cookie('userToken', data.token, {
						expires: 1000
					});
					
				}else{
					GLOBAL.removeCookie('userToken');
				}
			}, function(res) {
				GLOBAL.removeCookie('userToken');
			});
		}
	}
};

module.exports = Token;