import Ajax from '../modules/AJAX'
import GLOBAL from '../modules/global'
if(typeof window !== 'undefined'){
	var isHidden = require('./isHidden');
}

var config = {
	intercut: {method:'GET',url:'/api/v1/intercut/log'},
	read: {method:'POST',url:'/api/v1/upload/log'}
};


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
		new Ajax().getJSON(config[page].method, config[page].url, this.result, GLOBAL.noop, GLOBAL.noop);
		this.result = {};
	},
	readlog: function (page, params) {
		new Ajax().getJSON(config[page].method, config[page].url, params, GLOBAL.noop, GLOBAL.noop);
	}
};

module.exports = uploadLog;