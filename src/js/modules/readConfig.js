import storage from '../modules/storage';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';

import parseQuery from '../modules/parseQuery';

// var ReadConfig = (function(callback) {
// 	var _config = storage.get('readConfig');
// 	var update = false;
// 	// console.log(_config,_config.time,(Date.now() - _config.time) > 2*24*60*60*60*1000)
// 	//两天的过期时间
// 	if(!_config || !_config.time || (Date.now() - _config.time) > 2*24*60*60*1000){
// 		update = true;
// 	}
// 	//首次加载时更新
// 	if (update) {
// 		new Ajax().getJSON('GET', '/api/v1/read/config', {}, function(data) {
// 			var queryParams = parseQuery(window.location.search);
// 			for (var i = 0 ; i < data.length; i++) {
// 				_config['config-' + data[i]['source_id']] = data[i];
// 			}

// 			//如果url中有cm参数则重写此参数
// 			if (queryParams.cm && _config['config-1']) {
// 				_config['config-1'].cmcc_h5_charging = queryParams.cm;
// 			}
// 			if(callback)	alert(1)
// 			_config.time = Date.now();
// 			storage.set('readConfig', _config);
// 		}, GLOBAL.noop);
// 		//update = true;
// 	}
// 	return _config;
// })();

const ReadConfig = function (callback) {
  const _config = storage.get('readConfig');
  let update = false;
	// console.log(_config,_config.time,(Date.now() - _config.time) > 2*24*60*60*60*1000)
	// 两天的过期时间
  if (!_config || !_config.time || (Date.now() - _config.time) > 2 * 24 * 60 * 60 * 1000) {
    update = true;
  }
	// 首次加载时更新
  if (update) {
    new Ajax().getJSON('GET', '/api/v1/read/config', {}, (data) => {
      const queryParams = parseQuery(window.location.search);
      for (let i = 0; i < data.length; i++) {
        _config[`config-${data[i].source_id}`] = data[i];
      }

			// 如果url中有cm参数则重写此参数
      if (queryParams.cm && _config['config-1']) {
        _config['config-1'].cmcc_h5_charging = queryParams.cm;
      }

      _config.time = Date.now();
      if (callback) callback(_config);
      storage.set('readConfig', _config);
    }, GLOBAL.noop);
		// update = true;
  } else if (callback) callback(_config);
  return _config;
};

module.exports = ReadConfig;
