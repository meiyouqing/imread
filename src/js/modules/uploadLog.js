var isHidden = require('./isHidden');

var config = {
	intercut: {method:'GET',url:'/api/intercut/log'},
	read: {method:'POST',url:'/api/upload/log'}
};

var getJSON = require('./getJSON').getJSON;

var uploadLog = {
	result : [],
	send: function(page, params) {
		if (config[page] && !isHidden()) {
			if(this[params.intercut_id]){
				this[params.intercut_id]['count']++;
			}else{
				this[params.intercut_id]=params;
				this[params.intercut_id]['count']=1;
				this.result.push(this[params.intercut_id]);
			}
		}
	},
	sending: function(page) {
		getJSON(config[page].method, config[page].url, {intercutLog:this.result}, GLOBAL.noop, GLOBAL.noop);
	}
};

module.exports = uploadLog;