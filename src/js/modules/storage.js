var storage = {
	getDefaultRet: function(type) {
		switch (type) {
			case 'object':
				return {};
			case 'array':
				return [];
			default:
				return '';
		}
	},
	get: function(item, type) {
		type = type || 'object';
		var ret;
		try {
			ret = localStorage.getItem(item) || '';
			if (type != 'string') {
				ret = JSON.parse(ret);
			}
		} catch(e) {
			ret = storage.getDefaultRet(type);
		}
		return ret;
	},
	set: function(item, value) {
		if (typeof value == 'object') {
			value = JSON.stringify(value);
		}
		try {
			localStorage.setItem(item, value);
		} catch(e) {
			return false;
		}
		return true;
	}
};

module.exports = storage;