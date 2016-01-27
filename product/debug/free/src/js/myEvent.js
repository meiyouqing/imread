var myEvent = {
	callback: {

	},
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
				data.func.apply(null, data.params);
			} catch (e) {
				
			}
			if (!keep) {
				myEvent.callback[page] = null;
			}
		}
	}
};

module.exports = myEvent;