var ReadConfig = require('../modules/readConfig');

var goto_mlogin = function(options,callback){
	var hash = location.pathname + '/m_login';
      browserHistory.push({pathname:hash,state: options});
      // POP._alert('请先登录');
      // myEvent.setCallback('m_login', callback);
  };

 var a_url = 'https://readapi.imread.com';
// a_url = 'http://192.168.0.34:9090';
// a_url = 'http://192.168.0.252:8080';

var BookContent = (function() {
	//移动咪咕阅读
	//@source_id 1
	function getContent1(options) {

	
		var getContent = function(sourceConfig){
			var sourceConfig = sourceConfig['config-' + options.source_id];
			var url = a_url+'/api/v1/chapter/1/'+options.book_id+'/'+ options.cid+'/index?cm='+sourceConfig.cm;
			AJAX.getJSON('GET', url, {}, function(res){
				if(res.success){
					res.success['cm'] = sourceConfig.cm;
					if(res.success.loginSubmitUrl){
						//gotoMigu(sourceConfig);
						if(location.pathname.slice(-5) == 'login')	return;
						// goto_mlogin(options.callback.bind(this,res));
						goto_mlogin(res.success);
					}else
						options.callback(res,true);
				}
				else{
					if(typeof res.error === 'string')
						POP._alert(res.error);
					else 
						for(var key in res.error[0]){
							POP._alert(res.error[0][key])
					}
					GLOBAL.goBack();
					//gotoMigu(sourceConfig);
				}
					
			}, function() {
				if(options.noCross){return} //不要跳转

				gotoMigu(sourceConfig);
			});
		};

		if(JSON.stringify(storage.get('readConfig')).length == 2) {
			ReadConfig(getContent)
		} else {
			getContent(ReadConfig());
		}

		var gotoMigu = function(sourceConfig){
			//去掉referrer
			var meta = document.createElement('meta');
				meta.name = "referrer";
				meta.content = "no-referrer";
				document.getElementsByTagName('head')[0].appendChild(meta);
			window.location.href = (sourceConfig.cmcc_chapter_url.replace('$bid', options.bid).replace('$cid', options.cid).replace('&vt=2','&vt=3').replace('$cmcc_h5_charging', sourceConfig.cmcc_h5_charging));
		};
	}

	// function getContent1(options) {

	// 	var sourceConfig = ReadConfig['config-' + options.source_id];
	// 	var totalUrl = sourceConfig.source_host + sourceConfig.chapter_content;
	// 	var url = totalUrl.replace(/\?.*/, '')
	// 				      .replace('$bid', options.bid)
	// 				      .replace('$cid', options.cid);
	// 	var param = totalUrl.replace(/(.*\?)/, '')
	// 						.replace('$cm', sourceConfig.cm);
	// 	//TODO 错误直接在这里跳转到移动咪咕阅读，不需要传onError
	// 	AJAX.getJSON('GET', '/api/crossDomain', {
	// 		url : url,
	// 		type: 'post',
	// 		param: param
	// 	}, options.callback, function() {
	// 		// if (true || confirm('该章节为移动付费章节，将跳转到移动咪咕阅读')) {
	// 			if(options.noCross){return} //不要跳转
	// 			//GLOBAL.goBack();
	// 			//去掉referrer
	// 			var meta = document.createElement('meta');
	// 			meta.name = "referrer";
	// 			meta.content = "no-referrer";
	// 			document.getElementsByTagName('head')[0].appendChild(meta);
	// 			window.location.href = (sourceConfig.cmcc_chapter_url.replace('$bid', options.bid).replace('$cid', options.cid).replace('&vt=2','&vt=3').replace('$cmcc_h5_charging', sourceConfig.cmcc_h5_charging));
	// 		// } else {
	// 		// 	GLOBAL.goBack();
	// 		// }
	// 	});
	// }



	//原文阅读
	//@source_id 2
	function getContent2(options) {

		var getContent =  function(sourceConfig){
			var sourceConfig = sourceConfig['config-' + options.source_id];
			var totalUrl = sourceConfig.source_host + sourceConfig.chapter_content;
			//var totalUrl = 'http://192.168.0.34:9090' + sourceConfig.chapter_content;
			var url = totalUrl.replace('/api/chapter','/api/v1/chapter')
							 .replace(/\?*/, '')
						      .replace('$bid', options.book_id)
						      .replace('$cid', options.cid)
						      .replace('$cm', sourceConfig.cm);
			AJAX.getJSON('GET', url, {}, options.callback, options.onError);
		};

		if(JSON.stringify(storage.get('readConfig')).length == 2) {
			ReadConfig(getContent)
		} else {
			getContent(ReadConfig());
		}

		//var sourceConfig = ReadConfig()['config-' + options.source_id];
	}

	// 	//原文阅读
	// //@source_id 2
	// function getContent2(options) {

	// 	var sourceConfig = ReadConfig['config-' + options.source_id];
	// 	var totalUrl = sourceConfig.source_host + sourceConfig.chapter_content;
	// 	//var totalUrl = 'http://192.168.0.34:9090' + sourceConfig.chapter_content;
	// 	var url = totalUrl.replace('/api/chapter','/api/v1/chapter')
	// 					 .replace(/\?*/, '')
	// 				      .replace('$bid', options.book_id)
	// 				      .replace('$cid', options.cid)
	// 				      .replace('$cm', sourceConfig.cm);
	// 	AJAX.getJSON('GET', url, {}, options.callback, options.onError);
	// }

	//千马阅读
	//@source_id 3
	function getContent3(options) {
		getContent2(options);
	}

	//咪咕阅读
	//@source_id 4
	function getContent4(options) {
		getContent2(options);
	}

	var api = {
		getContent1: getContent1,
		getContent2: getContent2,
		getContent3: getContent3,
		getContent4: getContent4
	}

	/*
	 *	@options.source_id string 数据来源
	 *	@options.bid string 书籍id
	 *	@options.cid string 章节id
	 *	@options.callback function  回调
	 *	@options.onError function 错误处理
	 */
	function get(options) {
		var getFunc = api['getContent' + options.source_id] || GLOBAL.noop;
		getFunc(options);
	}
	return {
		get: get
	};
})();

module.exports = BookContent;