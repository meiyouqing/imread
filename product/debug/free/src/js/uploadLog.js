var isHidden = require('./isHidden');

var config = {
	intercut: '/api/intercut/logPost',
	read: '/api/upload/log'
};

var getJSON = require('./getJSON').getJSON;

var uploadLog = {
	send: function(page, params) {
		if (config[page] && !isHidden()) {
			getJSON('POST', config[page], params, GLOBAL.noop, GLOBAL.noop);
		}
	}
};

module.exports = uploadLog;