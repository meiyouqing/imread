var getJSON = require('./getJSON').getJSON;

var Token = {
	refreshToken: function () {
		var oldToken = GLOBAL.cookie('userToken');
		if (oldToken) {
			getJSON('GET', '/api/upToken', {
				//oldToken: encodeURIComponent(oldToken)
			}, function(data) {
				GLOBAL.cookie('userToken', data.token, {
					expires: 1000
				});
			}, function(res) {
				console.log(res)
			});
		}
	}
};

module.exports = Token;