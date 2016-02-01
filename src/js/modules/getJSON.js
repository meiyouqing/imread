var transformRequest = require('./transformRequest');

var imCache = (function() {
	var config = {
		cacheUrl: ['/api/group/page','/api/page/content','/api/book/introduce','/api/book/chapterlist'],
		needCache: true
	};
	if(GLOBAL.forceGetJSON){
		config.needCache=false;
		GLOBAL.forceGetJSON=false;
	}

	var needCache = function(url) {
		if (!config.needCache) {
			return false;
		}
		for (var i = 0; i < config.cacheUrl.length; i++) {
			if (new RegExp(config.cacheUrl[i]).test(url)) {
				return true;
			}
		}
		return false;
	};

	var getCacheKey = function(url) {
		return 'ImCache-' + url;
	};

	var getFromCache = function(url) {
		var key = getCacheKey(url);
		var cacheStr = localStorage.getItem(key);
		var result = false;
		try {
			if (cacheStr) {
				result = JSON.parse(cacheStr);
			}
		} catch(e) {

		}
		return result;
	};

	var setCache = function(url, data) {
		storage.set(getCacheKey(url), data);
		return true;
	};

	return {
		needCache: needCache,
		getFromCache: getFromCache,
		setCache: setCache
	};
})();
//初始化配置变量
var vars = null;
reset();

function getGETUrl(url, postdata) {
	return url + (/\?/.test(url) ? "" : "?") + transformRequest(postdata);
}
//getJSON接口
function GETJSON(method, url, postdata, callback, onError, urlBase) {
	var urlBase = 'http://readapi.imread.com';
	// var urlBase = 'http://192.168.0.34:9090';
	//var urlBase = 'http://192.168.0.252:8080';
	if (/^\/api/.test(url)) {
		url = urlBase + url;
	}

	var cacheUrl = getGETUrl(method + '-' + url, postdata);
	var cacheResponse = false;
	if (imCache.needCache(cacheUrl)) {
		cacheResponse = imCache.getFromCache(cacheUrl);
		if (cacheResponse) {
			// console.log('getFromCache-' + cacheUrl)
			setTimeout(function(){
				callback(cacheResponse)
			},0);
		}
	}
	GETJSONWITHAJAX(method, url, postdata, callback, onError, cacheResponse);
}
function GETJSONWITHAJAX(method, url, postdata, callback, onError, cacheResponse) {
	method = method || 'POST';
	var time = 15000;
	var request = null;
	try {
		if (window.XMLHttpRequest) {
			request = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			request = new ActiveXObject("Msxml2.Xmlhttp");
		}
	} catch (err) {
		request = new ActiveXObject("Microsoft.Xmlhttp");
	}
	if (!request) {
		return;
	}
	var timeout = false;
	var timer = setTimeout(function() {
		timeout = true;
		request.abort();
	}, time);
	onError = onError || GLOBAL.defaultOnError;
	request.onreadystatechange = function() {
		if (request.readyState !== 4)
			return;
		if (timeout) {
			onError(vars.timeoutErr);
			return;
		}
		clearTimeout(timer);
		if (request.status === 200) {
			var res = false;
			try {
				res = JSON.parse(request.responseText);
			} catch (e) {
				res = vars.timeoutErr;
			}
			if (vars.judge(res)) {
				onError(res);
			} else {

				//如果缓存中没有结果则触发callback
				//TODO 比较新的结果和缓存结果，如果不同则重新触发callback
				if (!cacheResponse) {
					callback(res);
				}

				//需要缓存，缓存ajax结果
				var cacheUrl = getGETUrl(method + '-' + url, postdata);
				if (imCache.needCache(cacheUrl)) {
					imCache.setCache(cacheUrl, res);
				}
			}
		}
	};
	
	if (method === 'POST') {
		request.open(method, url);
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		setRequestHeaders(request);
		postdata = transformRequest(postdata);
		request.send(postdata);
	} else {
		var isYulan = false;
		var yulanUrls = ['/api/group/page', '/api/page/content'];
		for (var i = 0; i < yulanUrls.length; i++) {
			isYulan |= new RegExp(yulanUrls[i]).test(url);
		}
		isYulan = isYulan && /yulan=1/.test(window.location.search);
		request.open(method, getGETUrl(url, postdata) + (isYulan ? "&yulan=1" : ""));
		setRequestHeaders(request);
		request.send(null);
	}
	//每次都还原默认配置
	reset();
}
function setRequestHeaders(request) {
	var headers = {};
	switch(vars.flag){
		case 'default':
		case 'collection':
			headers={
				//'Referer': 'readapi.imread.com',
				'Info-Imsi': '',
				'Info-Imei': '',
				'Info-Channel': 'ImreadH5', 
				'Info-Version': '1.0.1',
				'Info-Model': '',
				'Info-Os': '',
				'Info-Platform': 'ImreadH5',//渠道，不能修改，记录阅读日志需要用到
				'Info-Vcode': '101',
				'Info-Userid': GLOBAL.cookie('userId') || '',
				'Info-Uuid': GLOBAL.getUuid(),
				'Token': GLOBAL.cookie('userToken') || '',
				'Info-Resolution': window.screen.width + '*' +  window.screen.height,
				'Curtime': new Date().Format('yyyyMMddhhmmss'),
				'WidthHeight': (window.screen.height / window.screen.width).toFixed(2)
			};
		break;
		default:
		break;
	}
	 
	//headers = {};
	for (var k in headers) {
		request.setRequestHeader(k, headers[k]);
	} 
}

//还原默认配置
function reset(){
	vars={
		timeoutErr: {
			error: [{
				408: "链接超时"
			}]
		},
		judge:function(res){
			if(res.error){
				return true;
			}
			if (res.errorMsg) {
				res.code = 408;
				res.error = res.errorMsg;
				return true;
			}
			return false;
		},
		flag:'default'
	}
}
//set接口，用来设置特殊的配置
function SET(type){
	//console.log(type)
	if(!type){return}
	vars={
		timeoutErr: {
			code: 408,
			reason: "网络繁忙,请重试"
		},
		judge:function(res){
			if(res.code != 200){
				return true;
			}
			return false;
		},
		flag:type
	}
}
var getJSON = {
	getJSON: GETJSON,
	set:SET
};

module.exports  = getJSON;