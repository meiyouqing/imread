

var Token = {
	refreshToken: function () {
		var oldToken = GLOBAL.cookie('userToken');
		if (oldToken) {
			AJAX.getJSON('GET', '/api/upToken', {
				//oldToken: encodeURIComponent(oldToken)
			}, function(data) {
				GLOBAL.cookie('userToken', data.token, {
					expires: 1000
				});
			}, function(res) {
				GLOBAL.removeCookie('userToken');
			});
		}
	}
};

module.exports = Token;