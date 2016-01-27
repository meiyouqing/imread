var myEvent = {
	callback: {},
	setCallback: function(page, func, params) {
		myEvent.callback[page] = {
			func: func,
			params: params
		};
	},
	execCallback: function(page, keep) {
		var data = myEvent.callback[page];
		if (data) {
			try {
				setTimeout(data.func.bind(null, data.params),0);
			} catch (e) {
				
			}
			if (!keep) {
				myEvent.callback[page] = null;
			}
		}
	}
};

module.exports = myEvent;