var parseQuery = function(search) {
	var separator = '&';
	var params = {};

	search.replace(/^\?/, '').split(separator).map(function(param) {
		var pair = param.split('=');
		var key = pair.shift() || '';
		var value = decodeURIComponent(param.substr(key.length + 1) || '');
		if (key) {
			params[key] = value;
		}
	});

	return params;
};

module.exports = parseQuery;