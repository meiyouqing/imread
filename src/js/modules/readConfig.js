var getJSON = require('../modules/getJSON').getJSON;
var parseQuery = require('../modules/parseQuery');


var ReadConfig = (function() {
	var _config = storage.get('readConfig');

	//首次加载时更新
	var updated = false;
	if (!updated) {
		getJSON('GET', '/api/read/config', {}, function(data) {
			var queryParams = parseQuery(window.location.search);
			for (var i = 0 ; i < data.length; i++) {
				_config['config-' + data[i]['source_id']] = data[i];
			}

			//如果url中有cm参数则重写此参数
			if (queryParams.cm && _config['config-1']) {
				_config['config-1'].cmcc_h5_charging = queryParams.cm;
			}
			storage.set('readConfig', _config);
		}, GLOBAL.noop);
		updated = true;
	}
	return _config;
})();

module.exports = ReadConfig;