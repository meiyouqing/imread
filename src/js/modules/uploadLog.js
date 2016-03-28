var isHidden = require('./isHidden');

var config = {
	intercut: {method:'GET',url:'/api/intercut/log'},
	read: {method:'POST',url:'/api/upload/log'}
};

var getJSON = require('./getJSON').getJSON;

var uploadLog = {
	result : {},
	send: function(page, params) {
		// console.log(page,params)
		var id = params.intercut_id || params.content_id;
		if (config[page] && !isHidden()) {
			if(this.result[id]){
				this.result[id]['count']++;
			}else{
				this.result[id]=params;
				this.result[id]['count']=1;
			}
		}
	},
	sending: function(page) {
		if(Object.getOwnPropertyNames && Object.getOwnPropertyNames(this.result).length==0) return;
		getJSON(config[page].method, config[page].url, this.result, GLOBAL.noop, GLOBAL.noop);
		this.result = {};
	},
	readlog: function (page, params) {
		getJSON(config[page].method, config[page].url, params, GLOBAL.noop, GLOBAL.noop);
	}
};

module.exports = uploadLog;