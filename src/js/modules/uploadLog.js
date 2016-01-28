var isHidden = require('./isHidden');

var config = {
	intercut: {method:'GET',url:'/api/intercut/log'},
	read: {method:'POST',url:'/api/upload/log'}
};

var getJSON = require('./getJSON').getJSON;

var uploadLog = {
	send: function(page, params) {
		if (config[page] && !isHidden()) {
			getJSON(config[page].method, config[page].url, params, GLOBAL.noop, GLOBAL.noop);
		}
	}
};

module.exports = uploadLog;