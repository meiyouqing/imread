var ReadConfig = require('../modules/readConfig');


var BookContent = (function() {
	//移动咪咕阅读
	//@source_id 1
	function getContent1(options) {
		var sourceConfig = ReadConfig['config-' + options.source_id];
		var totalUrl = sourceConfig.source_host + sourceConfig.chapter_content;
		var url = totalUrl.replace(/\?.*/, '')
					      .replace('$bid', options.bid)
					      .replace('$cid', options.cid);

		var param = totalUrl.replace(/(.*\?)/, '')
							.replace('$cm', sourceConfig.cm);

		//TODO 错误直接在这里跳转到移动咪咕阅读，不需要传onError
		AJAX.getJSON('GET', '/api/crossDomain', {
			url : url,
			type: 'post',
			param: param
		}, options.callback, function() {
			// if (true || confirm('该章节为移动付费章节，将跳转到移动咪咕阅读')) {
				if(options.noCross){return} //不要跳转
				GLOBAL.goBack();
				//去掉referrer
				var meta = document.createElement('meta');
				meta.name = "referrer";
				meta.content = "no-referrer";
				document.getElementsByTagName('head')[0].appendChild(meta);

				browserHistory.push(sourceConfig.cmcc_chapter_url.replace('$bid', options.bid).replace('$cid', options.cid).replace('$cmcc_h5_charging', sourceConfig.cmcc_h5_charging));
			// } else {
			// 	GLOBAL.goBack();
			// }
		});
	}

	//原文阅读
	//@source_id 2
	function getContent2(options) {
		var sourceConfig = ReadConfig['config-' + options.source_id];
		var totalUrl = sourceConfig.source_host + sourceConfig.chapter_content;
		var url = totalUrl.replace(/\?*/, '')
					      .replace('$bid', options.bid)
					      .replace('$cid', options.cid)
					      .replace('$cm', sourceConfig.cm);

		AJAX.getJSON('GET', url, {}, options.callback, options.onError);
	}

	//千马阅读
	//@source_id 3
	function getContent3(options) {
		getContent2(options);
	}

	var api = {
		getContent1: getContent1,
		getContent2: getContent2,
		getContent3: getContent3
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