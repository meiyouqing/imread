
var parseQuery = require('../modules/parseQuery');


var ReadConfig = (function() {
	var _config = storage.get('readConfig');
	var update = false;
	// console.log(_config,_config.time,(Date.now() - _config.time) > 2*24*60*60*60*1000)
	//两天的过期时间
	if(!_config || !_config.time || (Date.now() - _config.time) > 2*24*60*60*1000){
		update = true;
	}
	//首次加载时更新
	if (update) {
		AJAX.getJSON('GET', '/api/read/config', {}, function(data) {
			var queryParams = parseQuery(window.location.search);
			for (var i = 0 ; i < data.length; i++) {
				_config['config-' + data[i]['source_id']] = data[i];
			}

			//如果url中有cm参数则重写此参数
			if (queryParams.cm && _config['config-1']) {
				_config['config-1'].cmcc_h5_charging = queryParams.cm;
			}
			_config.time = Date.now();
			storage.set('readConfig', _config);
		}, GLOBAL.noop);
		//update = true;
	}
	return _config;
})();

module.exports = ReadConfig;