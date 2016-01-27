var imCache = (function() {
	var config = {
		cacheUrl: ['/api/group/page'],
		needCache: false
	};

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
		var key = getCacheKey(url);
		try{
 			localStorage.setItem(key, JSON.stringify(data));
		}catch(e){}
		return true;
	};

	return {
		needCache: needCache,
		getFromCache: getFromCache,
		setCache: setCache
	};
})();

function getGETUrl(url, postdata) {
	//如果没有postdata说明访问的是静态化接口，也就是cdn缓存的接口，
	//此时不能有？后面的参数，cdn不识别
	if (JSON.stringify(postdata) == "{}") {
		//缓存最多30分钟
		return url + '?' + new Date().getTime() + Math.random();
	}
	return url + (/\?/.test(url) ? "" : "?") + GLOBAL.transformRequest(postdata);
}

function GETJSON(method, url, postdata, callback, onError) {
	var urlBase = 'http://readapi.imread.com';
	//var urlBase = 'http://192.168.0.252:8080';
	if (/^\/api/.test(url)) {
		url = urlBase + url;
	}

	var cacheUrl = getGETUrl(method + '-' + url, postdata);
	var cacheResponse = false;
	if (imCache.needCache(cacheUrl)) {
		cacheResponse = imCache.getFromCache(cacheUrl);
		if (cacheResponse) {
			console.log('getFromCache-' + cacheUrl)
			callback(cacheResponse);
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
			onError({
				error: [{
					408: "链接超时"
				}]
			});
			return;
		}
		clearTimeout(timer);
		if (request.status === 200) {
			var res = false;
			try {
				res = JSON.parse(request.responseText);
			} catch (e) {
				res = {
					error: [{
						408: "网络繁忙"
					}]
				};
			}
			if (res.error) {
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
		GLOBAL.setRequestHeaders(request);
		postdata = GLOBAL.transformRequest(postdata);
		request.send(postdata);
	} else {
		var isYulan = false;
		var yulanUrls = ['/api/group/page', '/api/page/content'];
		for (var i = 0; i < yulanUrls.length; i++) {
			isYulan |= new RegExp(yulanUrls[i]).test(url);
		}
		isYulan = isYulan && /yulan=1/.test(window.location.search);
		request.open(method, getGETUrl(url, postdata) + (isYulan ? "&yulan=1" : ""));
		GLOBAL.setRequestHeaders(request);
		request.send(null);
	}
}

var getJSON = {
	getJSON: GETJSON
};

module.exports  = getJSON;