/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// object to store loaded chunks
/******/ 	// "1" means "already loaded"
/******/ 	var installedChunks = {
/******/ 		0:1
/******/ 	};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "1" is the signal for "already loaded"
/******/ 		if(!installedChunks[chunkId]) {
/******/ 			var chunk = require("./" + chunkId + ".server.bundle.js");
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids;
/******/ 			for(var moduleId in moreModules) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 		}
/******/ 		callback.call(null, __webpack_require__);
/******/ 	};

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _server = __webpack_require__(2);

	var _reactRouter = __webpack_require__(3);

	var _routes = __webpack_require__(4);

	var _routes2 = _interopRequireDefault(_routes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// server.js
	var express = __webpack_require__(83);
	var path = __webpack_require__(84);
	var compression = __webpack_require__(85);
	// we'll use this to render our app to an html string

	// and these to match the url to routes and then render

	var app = express();

	// serve our static stuff like index.css
	app.use(express.static(__dirname));

	// send all requests to index.html so browserHistory in React Router works
	app.get('*', function (req, res) {
	  // match the routes to the url
	  (0, _reactRouter.match)({ routes: _routes2.default, location: req.url }, function (err, redirect, props) {
	    if (err) {
	      // there was an error somewhere during route matching
	      res.status(500).send(err.message);
	    } else if (redirect) {
	      // we haven't talked about `onEnter` hooks on routes, but before a
	      // route is entered, it can redirect. Here we handle on the server.
	      res.redirect(redirect.pathname + redirect.search);
	    } else if (props) {
	      // if we got props then we matched a route and can render
	      var appHtml = (0, _server.renderToString)(_react2.default.createElement(_reactRouter.RouterContext, props));
	      res.send(renderPage(appHtml));
	    } else {
	      // no errors, no redirect, we just didn't match anything
	      res.status(404).send('Not Found');
	    }
	  });
	});

	function renderPage(appHtml) {
	  return '\n    <!doctype html public="storage">\n    <html>\n    <meta charset=utf-8/>\n    <title>My First React Router App</title>\n    <link rel=stylesheet href=/index.css>\n    <div id=app>' + appHtml + '</div>\n    <script src="/bundle.js"></script>\n   ';
	}

	var PORT = process.env.PORT || 8080;
	app.listen(PORT, function () {
	  console.log('Production Express server running at localhost:' + PORT);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, ""))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("react-dom/server");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("react-router");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(AJAX, React) {'use strict';

	var _reactRouter = __webpack_require__(3);

	var _app = __webpack_require__(12);

	var _app2 = _interopRequireDefault(_app);

	var _user = __webpack_require__(19);

	var _user2 = _interopRequireDefault(_user);

	var _shelf = __webpack_require__(21);

	var _shelf2 = _interopRequireDefault(_shelf);

	var _mall = __webpack_require__(28);

	var _mall2 = _interopRequireDefault(_mall);

	var _subMall = __webpack_require__(31);

	var _subMall2 = _interopRequireDefault(_subMall);

	var _top = __webpack_require__(44);

	var _top2 = _interopRequireDefault(_top);

	var _search = __webpack_require__(45);

	var _search2 = _interopRequireDefault(_search);

	var _list = __webpack_require__(47);

	var _list2 = _interopRequireDefault(_list);

	var _login = __webpack_require__(51);

	var _login2 = _interopRequireDefault(_login);

	var _register = __webpack_require__(52);

	var _register2 = _interopRequireDefault(_register);

	var _introduce = __webpack_require__(53);

	var _introduce2 = _interopRequireDefault(_introduce);

	var _balance = __webpack_require__(56);

	var _balance2 = _interopRequireDefault(_balance);

	var _recharge = __webpack_require__(58);

	var _recharge2 = _interopRequireDefault(_recharge);

	var _bookSheet = __webpack_require__(61);

	var _bookSheet2 = _interopRequireDefault(_bookSheet);

	var _tag = __webpack_require__(63);

	var _tag2 = _interopRequireDefault(_tag);

	var _recentRead = __webpack_require__(65);

	var _recentRead2 = _interopRequireDefault(_recentRead);

	var _readHistory = __webpack_require__(71);

	var _readHistory2 = _interopRequireDefault(_readHistory);

	var _feedback = __webpack_require__(72);

	var _feedback2 = _interopRequireDefault(_feedback);

	var _about = __webpack_require__(73);

	var _about2 = _interopRequireDefault(_about);

	var _reading = __webpack_require__(75);

	var _reading2 = _interopRequireDefault(_reading);

	var _order = __webpack_require__(81);

	var _order2 = _interopRequireDefault(_order);

	var _compact = __webpack_require__(82);

	var _compact2 = _interopRequireDefault(_compact);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var APImemory;
	var scrollResetHandle = function scrollResetHandle() {
		var n = AJAX.API._param['pages'] ? 'pages' : 'page';
		AJAX.API._param[n] = 1;
	};
	var wrapEnterHandle = function wrapEnterHandle() {
		APImemory = AJAX.API.now;
	};
	var wrapLeaveHandle = function wrapLeaveHandle() {
		AJAX.init(APImemory);
	};
	var dubleHandle = function dubleHandle() {
		scrollResetHandle();
		wrapLeaveHandle();
	};

	var loginWrap = React.createElement(
		_reactRouter.Route,
		{ path: 'login', onEnter: wrapEnterHandle, onLeave: wrapLeaveHandle, component: _login2.default },
		React.createElement(_reactRouter.Route, { path: 'register', component: _register2.default }),
		React.createElement(_reactRouter.Route, { path: 'forget', component: _register2.default })
	);
	var readWrap = React.createElement(
		_reactRouter.Route,
		{ path: 'reading/:param', onEnter: wrapEnterHandle, onLeave: wrapLeaveHandle, component: _reading2.default },
		React.createElement(
			_reactRouter.Route,
			{ path: 'order', component: _order2.default },
			React.createElement(
				_reactRouter.Route,
				{ path: 'balance', component: _balance2.default },
				React.createElement(_reactRouter.Route, { path: 'recharge/:param', component: _recharge2.default })
			)
		)
	);
	var bookWrap = React.createElement(
		_reactRouter.Route,
		{ path: 'book/:param', onEnter: wrapEnterHandle, onLeave: wrapLeaveHandle, component: _introduce2.default },
		readWrap,
		loginWrap
	);
	var searchWrap = React.createElement(
		_reactRouter.Route,
		{ path: 'search/:param', onEnter: wrapEnterHandle, onLeave: wrapLeaveHandle, component: _search2.default },
		React.createElement(
			_reactRouter.Route,
			{ path: 'searchList/:param', component: _list2.default },
			bookWrap
		),
		bookWrap
	);
	module.exports = React.createElement(
		_reactRouter.Route,
		{ path: '/', component: _app2.default },
		React.createElement(_reactRouter.IndexRedirect, { to: '/mall' }),
		React.createElement(
			_reactRouter.Route,
			{ path: '/mall', component: _mall2.default },
			React.createElement(
				_reactRouter.Route,
				{ path: '/mall/:subnav', onLeave: scrollResetHandle, component: _subMall2.default },
				React.createElement(
					_reactRouter.Route,
					{ path: 'more/:param', onLeave: dubleHandle, onEnter: wrapEnterHandle, component: _list2.default },
					bookWrap,
					searchWrap
				),
				bookWrap,
				searchWrap,
				React.createElement(
					_reactRouter.Route,
					{ path: 'cat/:param', component: _list2.default },
					bookWrap,
					searchWrap
				)
			)
		),
		React.createElement(
			_reactRouter.Route,
			{ path: '/top', component: _top2.default },
			React.createElement(
				_reactRouter.Route,
				{ path: 'more/:param', onLeave: scrollResetHandle, component: _list2.default },
				bookWrap,
				searchWrap
			),
			React.createElement(
				_reactRouter.Route,
				{ path: 'cat/:param', onLeave: scrollResetHandle, component: _list2.default },
				bookWrap,
				searchWrap
			),
			React.createElement(
				_reactRouter.Route,
				{ path: 'sheet/:param', onLeave: scrollResetHandle, component: _bookSheet2.default },
				bookWrap
			),
			React.createElement(_reactRouter.Route, { path: 'myTags', component: _tag2.default }),
			loginWrap,
			bookWrap,
			searchWrap
		),
		React.createElement(
			_reactRouter.Route,
			{ path: '/user', component: _user2.default },
			loginWrap,
			React.createElement(
				_reactRouter.Route,
				{ path: 'balance', component: _balance2.default },
				React.createElement(_reactRouter.Route, { path: 'recharge/:param', component: _recharge2.default })
			),
			React.createElement(
				_reactRouter.Route,
				{ path: 'recentRead', onLeave: scrollResetHandle, component: _recentRead2.default },
				readWrap
			),
			React.createElement(_reactRouter.Route, { path: 'myTags', component: _tag2.default }),
			React.createElement(_reactRouter.Route, { path: 'readHistory', component: _readHistory2.default }),
			React.createElement(_reactRouter.Route, { path: 'feedback', component: _feedback2.default }),
			React.createElement(
				_reactRouter.Route,
				{ path: 'about', component: _about2.default },
				React.createElement(_reactRouter.Route, { path: 'compact', component: _compact2.default })
			)
		),
		React.createElement(
			_reactRouter.Route,
			{ path: '/shelf', component: _shelf2.default },
			loginWrap,
			readWrap
		)
	);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(1)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(GLOBAL, storage, AJAX) {'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _transformRequest = __webpack_require__(11);

	var _transformRequest2 = _interopRequireDefault(_transformRequest);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Config = {
		payURLBase: 'http://pay.imread.com:8081',
		ai: GLOBAL.isAndroid() ? '1' : '2'
	};
	var API = {
		group: { method: 'GET', base: '/api/group/page', param: { group_id: 1 } },
		page: { method: 'GET', base: '/api/page/content/' + Config.ai, param: { page_id: 1, blocks: 3, pages: 1 } },
		nav: { method: 'GET', base: '/api/page/block', param: { page_id: 1, blocks: 6, pages: 1 } },
		block: { method: 'GET', base: '/api/block/content', param: { block_id: 1, contents: 15, pages: 1 } },
		category: { method: 'GET', base: '/api/category/content', param: { category_id: 1, contents: 15, pages: 1 } },
		bookSheet: { method: 'GET', base: '/api/bookSheet/list', param: { sheet_id: 1, contents: 15, pages: 1 } },
		collectionAdd: { method: 'POST', base: '/api/bookSheet/collection/add', param: { sheet_id: 1 } },
		collectionDelete: { method: 'POST', base: '/api/bookSheet/collection/delete', param: { sheet_id: 1 } },
		introduce: { method: 'GET', base: '/api/book/introduce', param: { bid: 1 } },
		chapterlist: { method: 'GET', base: '/api/book/chapterlist', param: { bid: 1, page_size: 1, vt: 9, order_type: 'asc', page: 1 } },
		search: { method: 'GET', base: '/api/book/search', param: { kw: '', ot: 1, it: 1, st: 6, ssr: 8, pages: 1 } },
		login: { method: 'POST', base: '/api/auth/login/custom', param: { phone: '', password: '' } },
		register: { method: 'POST', base: '/api/auth/register', param: { mobile_num: '', password: '', key: '', device_identifier: '', promot: '', channel: 5 } },
		key: { method: 'GET', base: '/api/auth/key', param: { phone: '', type: '' } },
		password: { method: 'POST', base: '/api/auth/reset/password', param: { mobile_num: '', password: '', key: '' } },
		me: { method: 'GET', base: '/api/me', param: {} },
		upToken: { method: 'GET', base: '/api/upToken', param: { oldToken: '' } },
		advice: { method: 'POST', base: '/api/person/advice', param: { message: '', contact: '', type: 'unEncode' } },
		addBook: { method: 'POST', base: '/api/shelf/add', param: { param: '' } },
		deleteBook: { method: 'POST', base: '/api/shelf/delete', param: { param: '' } },
		log: { method: 'POST', base: '/api/upload/log', param: { readLog: {} } },
		balance: { method: 'GET', base: '/api/auth/balance', param: {} },
		pay: { method: 'POST', base: '/api/pay', param: { productId: 0, payType: 0, spType: 0, mobileNum: 0, productName: 0, productDesc: 0, others: 0 } },
		payInit: { method: 'POST', base: Config.payURLBase + '/order/web_init', param: {} },
		paySign: { method: 'POST', base: Config.payURLBase + '/config/getsign', param: {} },
		payVcurl: { method: 'POST', base: Config.payURLBase + '/order/web_vcurl', param: {} },
		payConfirm: { method: 'POST', base: Config.payURLBase + '/order/web_confirm', param: {} },
		crossDomain: { method: 'GET', base: '/api/crossDomain', param: { url: '', type: 'post', param: 'page=1&vt=9&cm=' + Config.cm } },
		recentRead: { method: 'GET', base: '/api/me/recentReading', param: { pages: 1, contents: 10 } },
		deleteRecentRead: { method: 'POST', base: '/api/me/recentReading/delete', param: { book_id: '' } },
		listTag: { method: 'GET', base: '/api/me/label/list', param: {} },
		addTag: { method: 'POST', base: '/api/me/label/add', param: { id: '' } },
		deleteTag: { method: 'POST', base: '/api/me/label/delete', param: { id: '' } }
	};

	//接口缓存机制
	var imCache = function () {
		var config = {
			cacheUrl: ['/api/group/page', '/api/page/content', '/api/book/introduce', '/api/book/chapterlist'],
			needCache: false
		};

		var needCache = function needCache(url) {
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

		var getCacheKey = function getCacheKey(url) {
			return 'ImCache-' + url;
		};

		var getFromCache = function getFromCache(url) {
			var key = getCacheKey(url);
			var cacheStr = localStorage.getItem(key);
			var result = false;
			try {
				if (cacheStr) {
					result = JSON.parse(cacheStr);
				}
			} catch (e) {}
			return result;
		};

		var setCache = function setCache(url, data) {
			storage.set(getCacheKey(url), data);
			return true;
		};

		return {
			needCache: needCache,
			getFromCache: getFromCache,
			setCache: setCache
		};
	}();

	function getGETUrl(url, postdata) {
		return url + (/\?/.test(url) ? "" : "?") + (0, _transformRequest2.default)(postdata);
	}
	//getJSON接口
	function GETJSON(method, url, postdata, callback, onError) {
		//var urlBase = 'http://readapi.imread.com';
		var urlBase = 'http://192.168.0.34:9090';
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
				setTimeout(function () {
					callback(cacheResponse);
				}, 0);
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
		var timer = setTimeout(function () {
			timeout = true;
			request.abort();
		}, time);
		onError = onError || GLOBAL.defaultOnError;
		request.onreadystatechange = function () {
			if (request.readyState !== 4) return;
			if (timeout) {
				onError('连接超时！');
				return;
			}
			clearTimeout(timer);
			if (request.status === 200) {
				var res = false;
				try {
					res = JSON.parse(request.responseText);
				} catch (e) {
					res = '连接超时！';
				}
				// if (res.code !== 200) {
				// 	onError(res);
				// } else {

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
				// }
			}
		};

		if (method === 'POST') {
			request.open(method, url);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			setRequestHeaders(request);
			postdata = (0, _transformRequest2.default)(postdata);
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
	}
	function setRequestHeaders(request) {
		//console.log(GLOBAL.header)
		var headers = {
			//'Referer': 'readapi.imread.com',
			'Info-Imsi': '',
			'Info-Imei': '',
			'Info-Channel': GLOBAL.header.channel ? GLOBAL.header.channel : 'ImreadH5',
			'Info-appid': GLOBAL.header.appid ? GLOBAL.header.appid : 'ImreadH5',
			'Info-Version': '1.0.1',
			'Info-Model': '',
			'Info-Os': '',
			'Info-Platform': 'ImreadH5', //渠道，不能修改，记录阅读日志需要用到
			'Info-Vcode': '101',
			'Info-Userid': GLOBAL.cookie('userId') || '',
			'Info-Uuid': GLOBAL.getUuid(),
			'Token': GLOBAL.cookie('userToken') || '',
			'Info-Resolution': window.screen.width + '*' + window.screen.height,
			'Curtime': new Date().Format('yyyyMMddhhmmss'),
			'WidthHeight': (window.screen.height / window.screen.width).toFixed(2)
		};

		for (var k in headers) {
			request.setRequestHeader(k, headers[k]);
		}
	}

	exports.default = AJAX = {
		API: API,
		init: function init(now) {
			if (GLOBAL.isArray(now)) {
				now = now[now.length - 1];
			}

			var parts = now.split('.');
			var ao = API[parts[0]];
			if (!ao) {
				return;
			}
			var i = 1;
			for (var n in ao.param) {
				if (parts[i] && parts[i] !== '0') {
					ao.param[n] = parts[i];
				}
				i++;
			}
			this.API.now = now;
			this.API._m = ao.method;
			this.API._base = ao.base;
			this.API._param = ao.param;
			GLOBAL.setTitle(now);
		},
		get: function get(callback, onerror) {
			GETJSON(this.API._m, this.API._base, this.API._param, callback, onerror);
		},
		go: function go(n, param, callback, onerror) {
			GETJSON(this.API[n].method, this.API[n].base, param, callback, onerror);
		},
		getJSON: GETJSON
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(8), __webpack_require__(5)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(browserHistory, storage) {'use strict';

	if (typeof window !== 'undefined') {
		var POP = __webpack_require__(9);
	}
	Date.prototype.Format = function (fmt) {
		var o = {
			"M+": this.getMonth() + 1,
			"d+": this.getDate(),
			"h+": this.getHours(),
			"m+": this.getMinutes(),
			"s+": this.getSeconds()
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}return fmt;
	};

	var GLOBAL = {
		header: {},
		onShelf: {},
		bookList: {},
		book: {},
		title: '',
		name: '',
		route: [],
		unRendered: [],
		goBack: function goBack() {
			browserHistory.goBack();
		},
		setHref: function setHref(str, type) {
			//TODO
			return location.pathname + '/' + str;
		},
		typeHref: function typeHref(data, spm, route_type) {
			var bid = data.content_id || data.book_id;
			var type = +data.type || +data.content_type;
			var target = '_self';
			if (/2|3|4/.test(data.intercut_type)) {
				target = '_blank';
			}
			if (/^http:\/\/m\.imread\.com.*referer=\d/.test(data.redirect_url)) {
				data.redirect_url = data.redirect_url.replace(/referer=\d/, "");
			}
			switch (type) {
				case 1:
					//图书详情
					return this.setHref('book/introduce.' + bid, route_type);
				case 2:
					//广告
					switch (data.intercut_type) {
						case 1:
							//图书详情
							return { url: this.setHref('book/introduce.' + data.source_contentid), target: target };
						case 2: //内部网页
						case 3: //外部网页
						case 4: //apk下载
						case 8:
							//app to H5
							return { url: data.redirect_url || "javascript:void(0)", target: target };
						case 5:
							//素材目录
							return { url: this.setHref('cat/category.' + data.source_contentid), target: target };
					}
				case 3:
					//搜索
					return this.setHref('search/search.' + data.name);
				case 5:
					//分类
					return this.setHref('cat/category.' + bid);
				case 6:
					//书城的子页面
					return this.setHref('mall/page' + data.pgid);
				case 7:
					//书单
					return this.setHref('sheet/bookSheet.' + bid);
			}
		},
		setTitle: function setTitle(parts) {
			var title = { login: '用户登录', forget: '重置密码', regiter: '新用户注册', confirmOrder: '确认订单', balance: '艾豆充值', recharge: '话费充值', recharge_result: '充值结果', recentRead: '最近阅读', tag: '我的标签', readHistory: '我的成就', feedback: '意见反馈', about: '关于艾美阅读' };
			parts = parts.split('.');
			var n = parts[0],
			    id = parts[1];
			switch (n) {
				case 'block':
				case 'more':
				case 'category':
					this.title = GLOBAL.bookList[id];
					break;
				case 'introduce':
					this.title = GLOBAL.book[id];
					break;
				case 'reading':
					break;
				default:
					this.title = title[n];
					break;
			}
			var rTitle = this.title ? '-' + this.title : '';
			document.title = '艾美阅读' + rTitle;
			return this.title;
		},
		setBookName: function setBookName(data) {
			if (!data.length || !this.isArray(data)) {
				return;
			}
			data.forEach(function (v) {
				this.book[v.source_bid] = v.name;
				this.book[v.content_id] = v.name;
			}.bind(this));
		},
		setBlocklist: function setBlocklist(data) {
			if (!data.length || !this.isArray(data)) {
				return;
			}
			data.forEach(function (v, i) {
				switch (v.style) {
					case 6:
					case 12:
					case 13:
						v.contentlist.forEach(function (v2) {
							GLOBAL.bookList[v2.content_id] = v2.name;
						});
						break;
					default:
						GLOBAL.bookList[v.id || v.content_id] = v.name;
						if (v.contentlist && v.contentlist.length) {
							v.contentlist.forEach(function (v3) {
								GLOBAL.book[v3.source_bid] = v3.name;
								GLOBAL.book[v3.content_id] = v3.name;
								//广告 type=5 是素材目录
								v3.source_contentid && (GLOBAL.bookList[v3.source_contentid] = v3.name);
							});
						}
						break;
				}
			});
		},
		isAndroid: function isAndroid() {
			if (typeof window !== 'undefined') {
				return (/linux|android/i.test(navigator.userAgent)
				);
			} else {
				return true;
			}
		},
		isArray: function isArray(obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		},
		assertNotEmpty: function assertNotEmpty(s, msg) {
			if (!s) {
				if (msg) {
					POP.alert(msg);
				}
			}
			return !!s;
		},
		assertMatchRegExp: function assertMatchRegExp(s, reg, msg) {
			if (!reg.test(s)) {
				if (msg) {
					POP.alert(msg);
				}
				return false;
			}
			return true;
		},
		cookie: function cookie(key, value, options) {
			// write
			if (value !== undefined) {
				options = options || {};
				options.path = options.path ? options.path : '/';
				if (typeof options.expires === 'number') {
					var days = options.expires,
					    t = options.expires = new Date();
					t.setDate(t.getDate() + days);
				}
				return document.cookie = [encodeURIComponent(key), '=', encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				'; path=' + options.path, options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join('');
			}
			// read
			var cookies = document.cookie.split('; ');
			var result = key ? undefined : {};
			for (var i = 0, l = cookies.length; i < l; i++) {
				var parts = cookies[i].split('=');
				var name = GLOBAL.decoded(parts.shift());
				var cookie = GLOBAL.decoded(parts.join('='));

				if (key && key === name) {
					result = cookie;
					break;
				}

				if (!key) {
					result[name] = cookie;
				}
			}

			return result;
		},
		removeCookie: function removeCookie(key, path) {
			if (GLOBAL.cookie(key) !== undefined) {
				GLOBAL.cookie(key, '', { expires: -1, path: path });
				return true;
			}
			return false;
		},
		removeClass: function removeClass(ele, name) {
			var cls = ele.className.trim();
			if (cls.indexOf(name) !== -1) {
				cls = cls.replace(name, '');
				cls = cls.replace(/\s{2,}/g, ' ');
				cls = cls.trim();
				ele.className = cls;
			}
		},
		addClass: function addClass(ele, name) {
			ele.className += ' ' + name.trim();
		},
		decoded: function decoded(s) {
			return decodeURIComponent(s.replace(/\+/g, ' '));
		},
		user: {},
		setUser: function setUser(user) {
			for (var i in user) {
				if (user.hasOwnProperty(i)) {
					GLOBAL.user[i] = user[i];
				}
			}
		},
		isElementVisible: function isElementVisible(el) {
			var rect = el.getBoundingClientRect();
			return ((rect.top > 0 && rect.top < window.innerHeight && 0x02) | (rect.right > 0 && rect.right < window.innerWidth && 0x01) | (rect.bottom > 0 && rect.bottom < window.innerHeight && 0x02) | (rect.left > 0 && rect.left < window.innerWidth && 0x01)) == 0x03;
		},
		defaultFunction: function defaultFunction() {},
		loadImage: function loadImage(src, callback, onerror) {
			callback = callback || GLOBAL.defaultFunction;
			onerror = onerror || GLOBAL.defaultFunction;
			var img = new Image();
			img.src = src;
			// if (img.complete) {
			// 	callback();
			// } else {
			img.onload = callback;
			img.onerror = onerror;
			// }
		},
		defaultOnError: function defaultOnError(res) {
			if (!res.error) {
				return;
			}
			if (GLOBAL.isArray(res.error)) {
				var errorMsg = '';
				for (var key in res.error[0]) {
					errorMsg = res.error[0][key];
					POP.alert(errorMsg);
					return true;
				}
			} else {
				if (typeof res.error === 'string') {
					POP.alert(res.error);
				} else {
					POP.alert(res.error.detail);
				}
				return true;
			}
		},
		noop: function noop() {},
		getUuid: function getUuid() {
			var uuid = GLOBAL.cookie('InfoUuid') || storage.get('InfoUuid', 'string');
			if (!uuid) {
				uuid = '' + +new Date() + Math.random();
				GLOBAL.cookie('InfoUuid', uuid, {
					expires: 1000
				});
				storage.set('InfoUuid', uuid);
			}
			return uuid;
		}
	};

	module.exports = GLOBAL;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7), __webpack_require__(8)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _reactRouter = __webpack_require__(3);

	exports.default = _reactRouter.browserHistory;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var storage = {
		getDefaultRet: function getDefaultRet(type) {
			switch (type) {
				case 'object':
					return {};
				case 'array':
					return [];
				default:
					return '';
			}
		},
		get: function get(item, type) {
			type = type || 'object';
			var ret;
			try {
				ret = localStorage.getItem(item) || '';
				if (type != 'string') {
					ret = JSON.parse(ret);
				}
			} catch (e) {
				ret = storage.getDefaultRet(type);
			}
			return ret;
		},
		set: function set(item, value) {
			if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
				value = JSON.stringify(value);
			}
			try {
				localStorage.setItem(item, value);
			} catch (e) {
				return false;
			}
			return true;
		}
	};

	module.exports = storage;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// if(typeof window === 'undefined'){
	// 	return false;
	// }
	__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../css/confirm.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var confirm = function confirm() {
		var that = this;

		var template_confirm = '\
			<div class="confirm-block confirm-block-2">\
				<div class="content">\
					<div class="title"><h3>提示</h3></div>\
					<div class="text">$content</div>\
					<div class="btns">\
						<button class="no cancelBtn" />取消</button>\
						<button class="yes confirmBtn" />确定</button>\
					</div>\
				</div>\
			</div>';
		var template_alert = template_confirm.replace('<button class="no cancelBtn" />取消</button>', '');
		var template__alert = '<div class="content">$content</div>';
		var template__confirm = '\
			<div class="confirm-block">\
				<div class="content confirmBtn">$content</div>\
			</div>';

		var UI_confirm = document.createElement("div");
		UI_confirm.className = 'UI_confirm';

		this._alert = function (msg) {
			var UI_confirm = document.createElement("div");
			UI_confirm.innerHTML = template__alert.replace('$content', msg);
			UI_confirm.className = 'UI_confirm_auto';
			document.body.appendChild(UI_confirm);
			setTimeout(function () {
				UI_confirm.classList.add('dispear');
				setTimeout(function () {
					document.body.removeChild(UI_confirm);
				}, 300);
			}, 2000);
		};
		this.alert = function (msg, callback) {
			that.remove();
			UI_confirm.innerHTML = template_alert.replace('$content', msg);
			that.onConfirmBtn(UI_confirm, callback);
			document.body.appendChild(UI_confirm);
		};
		this.confirm = function (msg, callback, cancel) {
			that.remove();
			UI_confirm.innerHTML = template_confirm.replace('$content', msg);
			var cancelBtn = UI_confirm.querySelector('.cancelBtn');
			that.onConfirmBtn(UI_confirm, callback);
			that.onCancelBtn(cancelBtn, cancel);
			document.body.appendChild(UI_confirm);
		};
		this._confirm = function (msg, callback, cancel, top) {
			that.remove();
			UI_confirm.innerHTML = template__confirm.replace('$content', msg);
			that.onConfirmBtn(UI_confirm, callback);
			that.onCancelBtn(UI_confirm, cancel);
			if (top) {
				UI_confirm.children[0].style.top = top + 'px';
			}
			document.body.appendChild(UI_confirm);
		};
		this.onConfirmBtn = function (UI_confirm, callback) {
			var confirmBtn = UI_confirm.querySelector('.confirmBtn');
			confirmBtn.onclick = function (e) {
				if (typeof callback === 'function') {
					callback();
				}
				e.stopPropagation && e.stopPropagation();
				//setTimeout(that.remove,300);
				that.remove();
			};
		};
		this.onCancelBtn = function (cancelBtn, callback) {
			cancelBtn.onclick = function (e) {
				if (typeof callback === 'function') {
					callback();
				}
				//callback();
				e.stopPropagation && e.stopPropagation();
				//setTimeout(that.remove,300);
				that.remove();
				//alert('b')
			};
		};
		this.remove = function () {
			var blocks = document.body.querySelectorAll('.UI_confirm');
			for (var i = 0; i < blocks.length; i++) {
				document.body.removeChild(blocks[i]);
			}
		};
	};

	module.exports = new confirm();

/***/ },
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(GLOBAL) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	function getFormatRequest(obj, base, str) {
		if (GLOBAL.isArray(obj)) {
			for (var i = 0; i < obj.length; i++) {
				if (obj[i] && _typeof(obj[i]) === 'object') {
					getFormatRequest(obj[i], base + '[' + (i + 1) + ']', str);
				} else {
					getFormatRequest(obj[i], base + '[]', str);
				}
			}
		} else if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
			for (var p in obj) {
				var _base = base ? base + '[' + p + ']' : p;
				getFormatRequest(obj[p], _base, str);
			}
		} else {
			str.push(encodeURIComponent(base) + "=" + encodeURIComponent(obj || ''));
		}
	}
	var transformRequest = function transformRequest(obj) {
		var str = [];
		getFormatRequest(obj, '', str);
		return str.join("&");
	};

	module.exports = transformRequest;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React) {'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _reactRouter = __webpack_require__(3);

	var _nav = __webpack_require__(13);

	var _nav2 = _interopRequireDefault(_nav);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	if (typeof window !== 'undefined') {
		__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../css/iconfont1.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
		__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../css/imread.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	}

	exports.default = React.createClass({
		displayName: 'app',

		render: function render() {
			return React.createElement(
				'div',
				{ className: 'g-wraper' },
				this.props.children,
				React.createElement(_nav2.default, null)
			);
		}
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, Mixins) {'use strict';

	var _reactRouter = __webpack_require__(3);

	var _navLink = __webpack_require__(16);

	var _navLink2 = _interopRequireDefault(_navLink);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Nav = React.createClass({
		displayName: 'Nav',

		mixins: [Mixins()],
		// shouldComponentUpdate: function(nextProp,nextState){
		// 	// console.log(this.state.navUpdate,nextState.navUpdate)
		// 	var navs=['shelf','mall','top','user'];
		// 	return this.props.name!==nextProp.name
		// 			&&navs.indexOf(nextProp.name)!==-1;
		// },

		render: function render() {
			//console.log('nav render')
			return React.createElement(
				'nav',
				{ className: 'm-bar m-bar-tab f-flexbox' },
				React.createElement(
					_navLink2.default,
					{ to: '/shelf' },
					React.createElement('span', { className: 'iconfont icon-shujia' }),
					React.createElement(
						'span',
						{ className: 'label' },
						'书架'
					)
				),
				React.createElement(
					_navLink2.default,
					{ to: '/mall' },
					React.createElement('span', { className: 'iconfont icon-shucheng' }),
					React.createElement(
						'span',
						{ className: 'label' },
						'书城'
					)
				),
				React.createElement(
					_navLink2.default,
					{ to: '/top' },
					React.createElement('span', { className: 'iconfont icon-paihang' }),
					React.createElement(
						'span',
						{ className: 'label' },
						'发现'
					)
				),
				React.createElement(
					_navLink2.default,
					{ to: '/user' },
					React.createElement('span', { className: 'iconfont icon-geren' }),
					React.createElement(
						'span',
						{ className: 'label' },
						'我'
					)
				)
			);
		}
	});

	module.exports = Nav;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(14)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(GLOBAL, AJAX, browserHistory, myEvent) {'use strict';

	if (typeof window !== 'undefined') {
		var POP = __webpack_require__(9);
	}
	var mixins = function mixins() {
		return {
			APIParts: function APIParts() {
				var params = this.props.params.param;
				var parts = typeof params === 'string' ? params : params[params.length - 1];
				return parts.split('.');
			},
			lazyloadImage: function lazyloadImage(container) {
				var imgs = container.querySelectorAll('.u-lazyload-img');
				for (var i = 0; i < imgs.length; i++) {
					(function (i) {
						var img = imgs[i];
						var src = img.getAttribute('data-lazyload-src');
						if (src != 'loading' && src != "loaded" && GLOBAL.isElementVisible(img)) {
							var callback = function callback(_src) {
								if (img.nodeName == 'A') {
									img.style.backgroundImage = 'url(' + src + ')';
								} else {
									img.src = _src;
								}
								img.setAttribute('data-lazyload-src', "loaded");

								container.dispatchEvent(new Event('scroll'));
								//img.style.height = img.offsetWidth * 4.0 / 3.0 + 'px';
							};

							img.setAttribute('data-lazyload-src', "loading");
							GLOBAL.loadImage(src, callback.bind(null, src), callback.bind('error', 'src/img/defaultCover.png'));
						}
					})(i);
				}
			},
			scrollHandle: function scrollHandle(e) {
				var list = e.target;
				if (!this.isMounted()) {
					return;
				}
				clearTimeout(this.timeoutId);
				this.timeoutId = setTimeout(function () {
					this.lazyloadImage(list);
					//console.log(!this.state.noMore , !this.state.scrollUpdate ,  (list.offsetHeight + list.scrollTop + 50 > list.scrollHeight)||list.offsetHeight>=list.scrollHeight)
					if (!this.state.noMore && !this.state.scrollUpdate && list.offsetHeight + list.scrollTop + 50 > list.scrollHeight || list.offsetHeight >= list.scrollHeight) {
						this.scrollHandleCallback();
					}
				}.bind(this), 100);
			},
			scrollHandleCallback: function scrollHandleCallback() {
				this.setState({
					scrollUpdate: true
				});
				var n = AJAX.API._param['pages'] ? 'pages' : 'page';
				AJAX.API._param[n]++;
				this.getList();
			},
			onerror: function onerror(error) {
				if (this.state.scrollUpdate) {
					this.setState({
						scrollUpdate: false,
						noMore: true
					});
					return;
				}
				this.setState({
					onerror: true
				});
			},
			shelfAdding: function shelfAdding(param, callback) {
				if (!this.isLogin()) {
					this.goLogin(addBookCallback);
					return;
				}
				addBookCallback();
				function addBookCallback() {
					AJAX.go('addBook', { param: JSON.stringify(param) }, function (data) {
						GLOBAL.onShelf[param[0].bookId] = 1;
						typeof callback === 'function' && callback(data);
					}, GLOBAL.noop);
				}
			},
			isLogin: function isLogin() {
				return !!GLOBAL.cookie('userToken');
			},
			goLogin: function goLogin(callback) {
				var hash = window.location.pathname + '/login';
				browserHistory.push(hash);
				POP._alert('请先登录');
				myEvent.setCallback('login', callback);
			}
		};
	};

	module.exports = mixins;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(5), __webpack_require__(7), __webpack_require__(15)))

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";

	var myEvent = {
		callback: {},
		setCallback: function setCallback(page, func, params) {
			myEvent.callback[page] = {
				func: func,
				params: params
			};
		},
		execCallback: function execCallback(page, keep) {
			var data = myEvent.callback[page];
			if (data) {
				try {
					setTimeout(data.func.bind(null, data.params), 0);
				} catch (e) {}
				if (!keep) {
					myEvent.callback[page] = null;
				}
			}
		}
	};

	module.exports = myEvent;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React) {'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _reactRouter = __webpack_require__(3);

	exports.default = React.createClass({
		displayName: 'navLink',
		render: function render() {
			return React.createElement(_reactRouter.Link, _extends({}, this.props, { activeClassName: 'z-active', className: 'item f-flex1' }));
		}
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 17 */,
/* 18 */,
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL, AJAX) {'use strict';

	var _reactRouter = __webpack_require__(3);

	var myEvent = __webpack_require__(15);
	var Mixins = __webpack_require__(14);

	if (typeof window !== 'undefined') {
		__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../css/user.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
		var POP = __webpack_require__(9);
	}

	var ULine = React.createClass({
		displayName: 'ULine',

		render: function render() {

			return React.createElement(
				'li',
				{ className: 'u-line' },
				React.createElement(
					_reactRouter.Link,
					{ to: GLOBAL.setHref(this.props.line.href), className: 'f-cb', onClick: this.props.line.requireLogin },
					React.createElement('span', { className: 'iconfont icon-arrow-right f-fr' }),
					React.createElement('span', { className: "iconfont" + ' ' + this.props.line.icon }),
					React.createElement(
						'span',
						{ className: 'title' },
						this.props.line.title
					)
				)
			);
		}
	});

	var MUblock = React.createClass({
		displayName: 'MUblock',

		render: function render() {
			return React.createElement(
				'section',
				{ className: 'm-ublock' },
				React.createElement(
					'div',
					{ className: 'content' },
					React.createElement(
						'ul',
						{ className: 'u-lines' },
						this.props.lines.map(function (line, i) {
							return React.createElement(ULine, { key: i, line: line });
						})
					)
				)
			);
		}
	});

	var User = React.createClass({
		displayName: 'User',

		mixins: [Mixins()],
		getInitialState: function getInitialState() {
			return {
				user: GLOBAL.user,
				needUpdate: 0,
				userInfo: {
					portraitUrl: 'src/img/defaultAvatar.png'
				}
			};
		},
		logout: function logout(e) {
			e.preventDefault && e.preventDefault();
			POP.confirm('确定退出登录?', function () {
				GLOBAL.setUser({
					phone: null,
					token: ''
				});
				GLOBAL.removeCookie('userPhone');
				GLOBAL.removeCookie('userToken');
				GLOBAL.removeCookie('userId');

				//同步state User
				this.setState({
					needUpdate: this.state.needUpdate + 1
				});
			}.bind(this));
		},
		login: function login(e) {
			if (!this.isLogin()) {
				this.requireLogin(e);
			}
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProp, nextState) {
			return this.state.user.phone !== nextState.user.phone || this.state.needUpdate !== nextState.needUpdate || this.props.children !== nextProp.children;
		},
		componentDidMount: function componentDidMount() {
			this.getUserInfo();
		},
		getUserInfo: function getUserInfo(callback) {
			//获取个人信息
			var that = this;
			if (this.isLogin()) {
				AJAX.init('me');
				AJAX.get(function (data) {
					var newPortraitUrl = data.portraitUrl;
					data.portraitUrl = that.state.userInfo.portraitUrl;
					that.setState({
						userInfo: data,
						needUpdate: that.needUpdate + 1
					});
					GLOBAL.cookie('userId', data.user_id, {
						expires: 1000
					});

					callback && callback();

					if (!/\/face\/null$/.test(newPortraitUrl)) {
						GLOBAL.loadImage(newPortraitUrl, function () {
							data.portraitUrl = newPortraitUrl;
							that.setState({
								userInfo: data,
								needUpdate: that.needUpdate + 1
							});
						});
					}
				}, GLOBAL.noop);
			}
		},
		requireLogin: function requireLogin(e) {
			var target = e.target.nodeName == 'A' ? e.target : e.target.parentNode;
			var that = this;
			if (!this.isLogin()) {
				var href = target.href;
				if (!href) {
					var hash = window.location.pathname + '/login';
					_reactRouter.browserHistory.push(hash);
					myEvent.setCallback('login', login_c);
					return false;
				}
				this.goLogin(login_c);
				e.preventDefault();
				return false;
			}
			function login_c() {
				setTimeout(function () {
					that.setState({
						needUpdate: that.state.needUpdate + 1
					});
				}, 0);
				setTimeout(function () {
					that.getUserInfo(function () {
						_reactRouter.browserHistory.push(href || '/user');
					});
				}, 10);
			}
			return true;
		},
		render: function render() {
			var blockData = [[{
				title: '最近阅读',
				icon: 'icon-read',
				href: 'recentRead'
			}, {
				title: '艾豆充值',
				icon: 'icon-balance',
				href: 'balance',
				requireLogin: this.requireLogin
			}, {
				title: '我的标签',
				icon: 'icon-tag',
				href: 'myTags',
				requireLogin: this.requireLogin
			}, {
				title: '我的成就',
				icon: 'icon-yueli',
				href: 'readHistory',
				requireLogin: this.requireLogin
			}], [{
				title: '意见反馈',
				icon: 'icon-feedback',
				href: 'feedback'
			}, {
				title: '关于艾美阅读',
				icon: 'icon-about',
				href: 'about'
			}]];
			var logoutBtn;
			var userName = '立即登录';

			if (this.isLogin()) {
				userName = this.state.user.phone;
				logoutBtn = React.createElement(
					'section',
					{ className: 'm-ublock' },
					React.createElement(
						'ul',
						{ className: 'u-lines' },
						React.createElement(
							'li',
							{ onClick: this.logout, className: 'logout-btn u-line' },
							'退出登录'
						)
					)
				);
			}
			return React.createElement(
				'div',
				{ className: 'g-ggWraper' },
				React.createElement(
					'div',
					{ className: 'g-main g-main-2' },
					React.createElement(
						'div',
						{ className: 'm-userblock g-scroll' },
						React.createElement(
							'section',
							{ className: 'avatar-block f-pr' },
							React.createElement('img', { src: 'src/img/bg_me.png', className: 'bg' }),
							React.createElement(
								'div',
								{ onClick: this.login },
								React.createElement(
									'div',
									{ className: 'avatar-wrap' },
									React.createElement('img', { src: this.state.userInfo.portraitUrl })
								),
								React.createElement(
									'div',
									{ className: 'username' },
									userName
								)
							)
						),
						blockData.map(function (lines, i) {
							return React.createElement(MUblock, { key: i, lines: lines });
						}),
						logoutBtn
					)
				),
				this.props.children
			);
		}
	});

	module.exports = User;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6), __webpack_require__(5)))

/***/ },
/* 20 */,
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, Mixins, storage, myEvent, browserHistory, GLOBAL, AJAX, Link, Loading, NoData) {'use strict';

	if (typeof window !== 'undefined') {
		var POP = __webpack_require__(9);
	}
	var Header = __webpack_require__(25);
	var Img = __webpack_require__(27);

	var Shelf = React.createClass({
		displayName: 'Shelf',

		mixins: [Mixins()],
		startReading: function startReading(e) {
			var a = e.target.parentNode;
			var bid = parseInt(a.getAttribute('data-bid'));
			var sbid = a.getAttribute('data-sbid');
			var cid = a.getAttribute('data-cid');
			var sid = a.getAttribute('data-sid');
			if (!this.state.setting) {
				//开始阅读
				var readLog = storage.get('readLogNew')[bid];
				if (readLog) {
					//console.log(readLog)
					cid = readLog.current_chapterid;
				}
				myEvent.setCallback('refreshShelf', this.getList);
				browserHistory.push(GLOBAL.setHref('reading/crossDomain.' + sbid + '.' + cid + '.' + bid + '.' + sid));
			} else {
				//选择操作
				var index = this.state.selected.indexOf(bid);
				if (index == -1) {
					this.state.selected.push(bid);
					this.setState({
						selected: this.state.selected
					});
				} else {
					this.state.selected.splice(index, 1);
					this.setState({
						selected: this.state.selected
					});
				}
			}
		},
		settingClick: function settingClick() {
			var completion = React.createElement(
				'button',
				{ className: 'f-fr textBtn', onClick: this.compClick },
				'完成'
			);
			var seAll = React.createElement(
				'button',
				{ className: 'f-fl textBtn', onClick: this.seAllClick },
				'全选'
			);
			var seNone = React.createElement(
				'button',
				{ className: 'f-fl textBtn', onClick: this.seNoneClick },
				'取消全选'
			);
			this.setState({
				setting: true,
				selected: [],
				icon: React.createElement('i', { className: 'iconfont icon-selected' }),
				left: this.state.toggle ? seNone : seAll,
				right: completion
			});
		},
		compClick: function compClick() {
			var icon = React.createElement('i', { className: 'u-recentRead' });
			var setting = React.createElement('button', { className: 'f-fr iconfont icon-setting', onClick: this.settingClick });
			this.setState({
				setting: false,
				left: null,
				right: setting,
				icon: icon
			});
		},
		seAllClick: function seAllClick() {
			var seNone = React.createElement(
				'button',
				{ className: 'f-fl textBtn', onClick: this.seNoneClick },
				'取消全选'
			);
			this.state.shelfList.forEach(function (v) {
				this.state.selected.push(v.content_id);
			}.bind(this));
			this.setState({
				left: seNone,
				selected: this.state.selected
			});
		},
		seNoneClick: function seNoneClick() {
			var seAll = React.createElement(
				'button',
				{ className: 'f-fl textBtn', onClick: this.seAllClick },
				'全选'
			);
			this.setState({
				left: seAll,
				selected: []
			});
		},
		delBtnClick: function delBtnClick() {
			if (!this.state.selected.length) {
				//POP._alert('别闹~至少选择一本书先！')
				return;
			};
			var param = [];
			this.state.selected.forEach(function (v) {
				var o = { type: 3, bookId: v };
				param.push(o);
			});
			param = JSON.stringify(param);
			AJAX.go('deleteBook', { param: param }, function (data) {
				this.getList();
				this.compClick();
			}.bind(this));
		},
		getInitialState: function getInitialState() {
			var icon = React.createElement('i', { className: 'u-recentRead' });
			var setting = React.createElement('div', { className: 'f-fr iconfont icon-setting', onClick: this.settingClick });
			return {
				setting: false,
				toggle: false,
				left: null,
				right: setting,
				icon: icon,
				selected: [],
				noMore: true,
				shelfList: null
			};
		},
		getList: function getList() {
			var _this = this;

			AJAX.get(function (data) {
				_this.setState({
					shelfList: data
				});
				//设置GLOBAL.booklist/book
				GLOBAL.setBlocklist(data);
			}, this.onerror);
		},
		componentDidMount: function componentDidMount() {
			var _this2 = this;

			if (!this.isLogin()) {
				this.goLogin(function () {
					AJAX.init('block.157.100');
					_this2.getList();
				});
				return;
			}
			AJAX.init('block.157.100');
			this.getList();
		},
		componentDidUpdate: function componentDidUpdate() {
			this.refs.container && this.lazyloadImage(this.refs.container);
		},
		render: function render() {
			var header = React.createElement(Header, { title: '书架', left: this.state.left, right: this.state.right });
			//console.log(this.state.shelfList);
			var icon, content;
			var curClass = '';
			var add = React.createElement(
				'li',
				{ className: 'u-book-0' },
				React.createElement(
					Link,
					{ className: 'add f-pr', to: '/mall' },
					React.createElement('img', { src: 'src/img/defaultCover.png' }),
					React.createElement('i', { className: 'iconfont icon-add f-pa' })
				)
			);
			var addBook = this.state.setting ? null : add;

			//获取最近阅读的时间和
			var recent = 0;
			var maxCurrentTime = 0;
			var readLogs = storage.get('readLogNew');
			if (!this.state.shelfList) {
				content = React.createElement(Loading, null);
			} else if (!this.state.shelfList.length) {
				content = React.createElement(NoData, { type: 'emptyShelf' });
			} else {
				for (var n in readLogs) {
					if (readLogs[n].current_time > maxCurrentTime) {
						maxCurrentTime = readLogs[n].current_time;
						recent = readLogs[n].content_id;
					}
				}
				var recentIndex = -1;
				this.state.shelfList.forEach(function (v, i) {
					if (v.content_id == recent) {
						recentIndex = i;
						return false;
					}
				});

				if (recentIndex > 0) {
					this.state.shelfList.unshift(this.state.shelfList.splice(recentIndex, 1)[0]);
				}
				content = React.createElement(
					'div',
					{ className: 'g-main' },
					React.createElement(
						'div',
						{ className: 'g-scroll g-scroll-noBG', ref: 'container' },
						React.createElement(
							'ul',
							{ className: 'shelfWrap f-clearfix' },
							this.state.shelfList.map(function (v, i) {
								if (this.state.setting) {
									curClass = this.state.selected.indexOf(v.content_id) == -1 ? '' : 'z-active';
								}
								icon = this.state.setting ? this.state.icon : recent == v.content_id ? this.state.icon : null;
								return React.createElement(
									'li',
									{ key: i, className: "u-book-2 " + curClass },
									React.createElement(
										'a',
										{ onClick: this.startReading, 'data-bid': v.content_id, 'data-cid': v.chapter_id, 'data-sbid': v.source_bid, 'data-sid': v.source_id },
										icon,
										React.createElement(Img, { src: v.big_coverlogo }),
										React.createElement(
											'span',
											{ className: 'f-ellipsis' },
											v.name
										)
									)
								);
							}.bind(this)),
							addBook
						)
					),
					React.createElement(
						'button',
						{ className: "u-btn-1" + (!this.state.setting ? ' f-hide' : '') + (this.state.selected.length ? '' : ' u-btn-1-disabled'), onClick: this.delBtnClick },
						React.createElement('i', { className: 'iconfont icon-delete' }),
						'删除'
					)
				);
			}
			return React.createElement(
				'div',
				{ className: 'gg-wraper' },
				header,
				content,
				this.props.children
			);
		}
	});

	module.exports = Shelf;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(14), __webpack_require__(8), __webpack_require__(15), __webpack_require__(7), __webpack_require__(6), __webpack_require__(5), __webpack_require__(22), __webpack_require__(23), __webpack_require__(24)))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _reactRouter = __webpack_require__(3);

	exports.default = _reactRouter.Link;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React) {'use strict';

	var Loading = React.createClass({
		displayName: 'Loading',

		getDefaultProps: function getDefaultProps() {
			return {
				cls: 'u-loading',
				text: '努力加载中..'
			};
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.cls !== nextProps.cls || this.props.content !== nextProps.content;
		},
		render: function render() {
			//console.log(this.props.cls)
			var cls1 = '';
			if (typeof document.body.style.transform !== 'undefined' && typeof document.body.style.animation !== 'undefined' || typeof document.body.style['-webkit-transform'] !== 'undefined' && typeof document.body.style['-webkit-animation'] !== 'undefined') {
				cls1 = 'u-moving-ball';
			}
			return React.createElement(
				'div',
				{ className: this.props.cls },
				React.createElement(
					'div',
					{ className: cls1 },
					React.createElement('i', { className: 'ball-1' }),
					React.createElement('i', { className: 'ball-2' })
				),
				React.createElement(
					'i',
					null,
					this.props.text
				)
			);
		}
	});

	module.exports = Loading;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, Link) {'use strict';

	var NoData = React.createClass({
		displayName: 'NoData',

		reload: function reload() {
			document.location.reload();
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return false;
		},
		render: function render() {
			var src = 'src/img/noData.png',
			    text = '抱歉!没有找到相关数据..',
			    btn = React.createElement(
				Link,
				{ className: 'u-btn', to: '/mall' },
				'去书城逛逛'
			);
			switch (this.props.type) {
				case 'emptyShelf':
					src = 'src/img/bookrack.png';
					text = '亲，书架还空空荡荡哦~';
					break;
				case 'UFO':
					src = 'src/img/UFO.png';
					text = '糟糕，服务器被外星人劫持了..';
					btn = React.createElement(
						'a',
						{ className: 'u-btn', onClick: this.reload },
						'重新加载'
					);
					break;
				case 'recentRead':
					src = 'src/img/bookrack.png';
					text = '暂无阅读记录';
					btn = false;
					break;
			}
			return React.createElement(
				'div',
				{ className: 'f-vl-md' },
				React.createElement(
					'div',
					{ className: 'm-noData f-tc' },
					React.createElement('img', { className: 'icon', src: src }),
					React.createElement(
						'i',
						{ className: 'tip' },
						text
					),
					btn
				)
			);
		}
	});

	module.exports = NoData;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(22)))

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, browserHistory, GLOBAL) {'use strict';

	var _parseQuery = __webpack_require__(26);

	var _parseQuery2 = _interopRequireDefault(_parseQuery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Header = React.createClass({
		displayName: 'Header',

		getDefaultProps: function getDefaultProps() {
			var sHandle = function sHandle(e) {
				browserHistory.push(GLOBAL.setHref('search/page.11'));
			};

			return {
				left: React.createElement('a', { className: 'f-fl icon-back iconfont', onClick: GLOBAL.goBack }),
				right: React.createElement('a', { className: 'f-fr icon-search iconfont', onClick: sHandle }),
				title: GLOBAL.title || '艾美阅读'
			};
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.title !== nextProps.title || this.props.left !== nextProps.left || this.props.right !== nextProps.right;
		},
		render: function render() {
			var from = (0, _parseQuery2.default)(location.search);
			var isskip = false;

			if (this.props.skipurl && from.skipurl) isskip = true;

			return React.createElement(
				'header',
				{ className: 'm-bar m-bar-head' },
				isskip ? React.createElement('a', { className: 'f-fl icon-back iconfont', href: from.skipurl }) : this.props.left,
				this.props.closeRight ? '' : this.props.right,
				React.createElement(
					'h1',
					{ className: 'title' },
					this.props.title
				)
			);
		}
	});

	module.exports = Header;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(7), __webpack_require__(6)))

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';

	var parseQuery = function parseQuery(search) {
		var separator = '&';
		var params = {};
		if (search.length < 2) return params;
		search.replace(/^\?/, '').split(separator).map(function (param) {
			var pair = param.split('=');
			var key = pair.shift() || '';
			var value = decodeURIComponent(param.substr(key.length + 1) || '');
			if (key) {
				params[key] = value;
			}
		});

		return params;
	};

	module.exports = parseQuery;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React) {"use strict";

	var Img = React.createClass({
		displayName: "Img",

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.src !== nextProps.src;
		},
		render: function render() {
			return React.createElement("img", { src: "src/img/defaultCover.png", "data-lazyload-src": this.props.src, className: "u-lazyload-img" });
		}
	});

	module.exports = Img;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, AJAX) {'use strict';

	var _reactRouter = __webpack_require__(3);

	var Header = __webpack_require__(25);
	var MallNav = __webpack_require__(29);

	var Mall = React.createClass({
		displayName: 'Mall',

		getNav: function getNav() {
			var _this = this;

			AJAX.init('group.1');
			AJAX.get(function (data) {
				var subnav = 'page.' + data.pagelist[0].pgid + '.' + data.pagelist[0].blocks;

				_reactRouter.browserHistory.replace('/mall/' + subnav);
				_this.setState({
					navList: data.pagelist
				});
			});
		},
		getInitialState: function getInitialState() {
			return {
				navList: null
			};
		},
		componentDidMount: function componentDidMount() {
			this.getNav();
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProp, nextState) {
			return this.state.navList !== nextState.navList || this.props.children !== nextProp.children;
		},
		render: function render() {
			var mallNav;
			if (this.state.navList) {
				mallNav = React.createElement(MallNav, { navList: this.state.navList });
			}
			return React.createElement(
				'div',
				{ className: 'g-mall' },
				React.createElement(Header, { title: '书城', left: null }),
				mallNav,
				this.props.children
			);
		}
	});
	module.exports = Mall;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(5)))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React) {"use strict";

	var _mallNavLink = __webpack_require__(30);

	var _mallNavLink2 = _interopRequireDefault(_mallNavLink);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var MallNav = React.createClass({
		displayName: "MallNav",

		render: function render() {
			//console.log('pageNav render');
			// var isYulan = /yulan=1/.test(window.location.search);
			// if(this.props.navList.length<2 && !isYulan) return <div></div>
			if (!this.props.navList || !this.props.navList.length) {
				return React.createElement("i", null);
			}
			return React.createElement(
				"nav",
				{ className: "g-nav" },
				React.createElement(
					"div",
					{ className: "m-nav f-flexbox" },
					this.props.navList.map(function (v, i) {
						var href = 'page.' + v.pgid + '.' + v.blocks;
						return React.createElement(
							_mallNavLink2.default,
							{ to: '/mall/' + href, key: i, className: "f-flex1" },
							v.name
						);
					}.bind(this))
				)
			);
		}
	});

	module.exports = MallNav;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React) {'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _reactRouter = __webpack_require__(3);

	exports.default = React.createClass({
		displayName: 'mallNavLink',
		render: function render() {
			return React.createElement(_reactRouter.Link, _extends({}, this.props, { activeClassName: 'z-active' }));
		}
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, Mixins, AJAX, GLOBAL, Loading, NoData) {'use strict';

	var Header = __webpack_require__(25);
	var Blocklist = __webpack_require__(32);
	var MallNav = __webpack_require__(29);

	var Mall = React.createClass({
		displayName: 'Mall',

		mixins: [Mixins()],
		reset: function reset() {
			this.setState({
				list: null,
				noMore: false
			});
		},
		getInitialState: function getInitialState() {
			return {
				noMore: false,
				scrollUpdate: false,
				onerror: false,
				list: null
			};
		},
		componentWillReceiveProps: function componentWillReceiveProps(nextProp) {
			//console.log(nextProp.params.subnav !== this.props.params.subnav)
			if (nextProp.params.subnav !== this.props.params.subnav) {
				this.reset();
				this.APIparam = nextProp.params.subnav;
				this.getList();
			}
		},

		getList: function getList(scrollUpdate) {
			var _this = this;

			AJAX.init(this.APIparam);
			AJAX.get(function (data) {
				if (!data.blocklist) {
					return;
				}
				if (!data.blocklist.length) {
					_this.setState({
						noMore: true
					});
				}
				_this.setState({
					list: _this.state.scrollUpdate ? _this.state.list.concat(data.blocklist) : data.blocklist,
					scrollUpdate: false
				});
				//设置GLOBAL.booklist/book
				GLOBAL.setBlocklist(data.blocklist);
			}, this.onerror);
		},
		componentDidMount: function componentDidMount() {
			this.APIparam = this.props.params.subnav;
			this.getList();
		},
		componentDidUpdate: function componentDidUpdate() {
			if (!this.state.list || !this.state.list.length) {
				return;
			}
			this.lazyloadImage(this.refs.container);
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProp, nextState) {
			//console.log(this.props,nextProp)
			return this.state.noMore !== nextState.noMore || this.state.list !== nextState.list || this.props.children !== nextProp.children;
		},
		render: function render() {
			var list;
			var scrollLoading = React.createElement(Loading, { cls: 'u-sLoading' });

			if (this.state.noMore) {
				scrollLoading = null;
			}
			if (!this.state.list) {
				list = React.createElement(Loading, null);
			} else {
				if (this.state.list.length) {
					list = React.createElement(
						'div',
						{ className: 'g-main' },
						React.createElement(
							'div',
							{ className: 'g-scroll', onScroll: this.scrollHandle, ref: 'container' },
							React.createElement(Blocklist, { blockList: this.state.list }),
							scrollLoading
						)
					);
				} else {
					list = React.createElement(
						'div',
						{ className: 'g-main' },
						React.createElement(NoData, null)
					);
				}
			}
			if (this.state.onerror) {
				list = React.createElement(
					'div',
					{ className: 'g-main' },
					React.createElement(NoData, { type: 'UFO' })
				);
			}
			return React.createElement(
				'div',
				{ className: 'g-subMall' },
				list,
				this.props.children
			);
		}
	});
	module.exports = Mall;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(14), __webpack_require__(5), __webpack_require__(6), __webpack_require__(23), __webpack_require__(24)))

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL, Mixins, AJAX, myEvent) {'use strict';

	var _reactRouter = __webpack_require__(3);

	var Book1 = __webpack_require__(33);
	var Book2 = __webpack_require__(34);
	var Book3 = __webpack_require__(35);
	var Book5 = __webpack_require__(36);
	var Book6 = __webpack_require__(37);
	var Book7 = __webpack_require__(38);
	var Book8 = __webpack_require__(39);

	var Block1 = React.createClass({
		displayName: 'Block1',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
		},
		render: function render() {
			//this.props.data.contentlist.pop();
			return React.createElement(
				'section',
				{ className: 'm-block' },
				React.createElement(
					_reactRouter.Link,
					{ className: 'title', to: this.props.href },
					React.createElement('span', { className: 'iconfont icon-arrow-right f-fr' }),
					React.createElement(
						'h2',
						null,
						React.createElement('i', { className: 'iconfont icon-group' }),
						this.props.data.name
					)
				),
				React.createElement(
					'div',
					{ className: 'content' },
					this.props.recommend,
					React.createElement(
						'ul',
						{ className: 'subCat-1 f-clearfix' },
						this.props.data.contentlist.slice(0, this.props.data.contentlist.length - this.props.data.contentlist.length % 3).map(function (v, i) {
							return React.createElement(Book2, { key: i, data: v });
						}.bind(this))
					)
				)
			);
		}
	});
	var Block2 = React.createClass({
		displayName: 'Block2',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
		},
		render: function render() {
			return React.createElement(
				'section',
				{ className: 'm-block' },
				React.createElement(
					_reactRouter.Link,
					{ className: 'title', to: this.props.href },
					React.createElement('span', { className: 'iconfont icon-arrow-right f-fr' }),
					React.createElement(
						'h2',
						null,
						React.createElement('i', { className: 'iconfont icon-group' }),
						this.props.data.name
					)
				),
				React.createElement(
					'div',
					{ className: 'content' },
					this.props.recommend,
					React.createElement(
						'ul',
						{ className: 'subCat-2 f-clearfix' },
						this.props.data.contentlist.map(function (v, i) {
							//if(i > 4) return;
							return React.createElement(Book1, { key: i, data: v });
						}.bind(this))
					)
				)
			);
		}
	});
	var Block3 = React.createClass({
		displayName: 'Block3',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
		},
		render: function render() {
			return React.createElement(
				'section',
				{ className: 'm-block' },
				React.createElement(
					_reactRouter.Link,
					{ className: 'title', to: this.props.href },
					React.createElement('span', { className: 'iconfont icon-arrow-right f-fr' }),
					React.createElement(
						'h2',
						null,
						React.createElement('i', { className: 'iconfont icon-group' }),
						this.props.data.name
					)
				),
				React.createElement(
					'div',
					{ className: 'content' },
					this.props.recommend,
					React.createElement(
						'ul',
						{ className: 'subCat-3 f-clearfix' },
						React.createElement(
							'div',
							{ className: 'u-book2-line' },
							this.props.data.contentlist.map(function (v, i) {
								//if(i > 4) return;
								if (i < 3) {
									return React.createElement(Book2, { key: i, data: v });
								}
							}.bind(this))
						),
						this.props.data.contentlist.map(function (v, i) {
							//if(i > 4) return;
							if (i >= 3) {
								return React.createElement(Book3, { key: i, data: v });
							}
						}.bind(this))
					)
				)
			);
		}
	});
	var Block4 = React.createClass({
		displayName: 'Block4',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
		},
		render: function render() {
			return React.createElement(
				'section',
				{ className: 'm-block' },
				React.createElement(
					_reactRouter.Link,
					{ className: 'title', to: this.props.href },
					React.createElement('span', { className: 'iconfont icon-arrow-right f-fr' }),
					React.createElement(
						'h2',
						null,
						React.createElement('i', { className: 'iconfont icon-group' }),
						this.props.data.name
					)
				),
				React.createElement(
					'div',
					{ className: 'content' },
					this.props.recommend,
					React.createElement(
						'ul',
						{ className: 'subCat-4 f-clearfix' },
						this.props.data.contentlist.map(function (v, i) {
							if (i > 3) return;
							if (i < 1) {
								return React.createElement(Book1, { key: i, data: v });
							} else {
								return React.createElement(Book3, { key: i, data: v });
							}
						}.bind(this))
					)
				)
			);
		}
	});
	var Block6 = React.createClass({
		displayName: 'Block6',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data;
		},
		render: function render() {
			var emptyBook6;
			if (this.props.data.contentlist.length & 1) {
				emptyBook6 = React.createElement(
					'li',
					{ className: 'u-book-6 empty-book-6' },
					React.createElement(
						'a',
						null,
						React.createElement('span', null)
					)
				);
			}
			return React.createElement(
				'section',
				{ className: 'm-block' },
				React.createElement(
					'div',
					{ className: 'title' },
					React.createElement(
						'h2',
						null,
						React.createElement('i', { className: 'iconfont icon-group' }),
						this.props.data.name
					)
				),
				React.createElement(
					'div',
					{ className: 'content' },
					this.props.recommend,
					React.createElement(
						'ul',
						{ className: 'subCat-6 f-clearfix' },
						this.props.data.contentlist.map(function (v, i) {
							//if(i > 5) return;
							return React.createElement(Book6, { key: i, data: v, noImage: i >= 2 });
						}.bind(this)),
						emptyBook6
					)
				)
			);
		}
	});
	var Block7 = React.createClass({
		displayName: 'Block7',

		getInitialState: function getInitialState() {
			return {
				contentlist: this.props.data.contentlist,
				needUpdate: 0
			};
		},
		batchChange: function batchChange() {
			this.setState({
				contentlist: this.state.contentlist.sort(randomSort),
				needUpdate: this.state.needUpdate++
			});
			function randomSort(a, b) {
				return Math.random() > 0.5 ? 1 : -1;
			}
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data || this.state.contentlist !== nextState.contentlist || this.state.needUpdate !== nextState.needUpdate;
		},
		render: function render() {
			return React.createElement(
				'section',
				{ className: 'm-block m-block-1' },
				React.createElement(
					'div',
					{ className: 'title title-1' },
					React.createElement(
						'span',
						{ className: 'batchChange f-fr', onClick: this.batchChange },
						React.createElement('i', { className: 'iconfont icon-refresh' }),
						' 换一批'
					),
					React.createElement(
						'h2',
						null,
						this.props.data.name
					)
				),
				React.createElement(
					'div',
					{ className: 'content' },
					this.props.recommend,
					React.createElement(
						'ul',
						{ className: "subCat-" + this.props.data.style + " f-clearfix" },
						this.state.contentlist.map(function (v, i) {
							if (i > 5) return;
							var hrefStr = GLOBAL.setHref('searchList/search.' + v.name);
							return React.createElement(
								'li',
								{ key: i },
								React.createElement(
									_reactRouter.Link,
									{ to: hrefStr, className: this.props.data.style == 7 ? "style-" + (i + 1) : "u-btn2" },
									v.name
								)
							);
						}.bind(this))
					)
				)
			);
		}
	});
	var Block9 = React.createClass({
		displayName: 'Block9',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
		},
		render: function render() {
			return React.createElement(
				'section',
				{ className: 'm-block m-block-1' },
				React.createElement(
					_reactRouter.Link,
					{ className: 'title title-1', to: this.props.href },
					React.createElement(
						'h2',
						null,
						this.props.data.name
					)
				),
				React.createElement(
					'div',
					{ className: 'content' },
					this.props.recommend,
					React.createElement(
						'ul',
						{ className: 'f-clearfix' },
						this.props.data.contentlist.map(function (v, i) {
							return React.createElement(Book5, { key: i, data: v });
						}.bind(this))
					)
				)
			);
		}
	});
	var Block12 = React.createClass({
		displayName: 'Block12',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data;
		},
		render: function render() {
			var title = this.props.data.style == 12 ? React.createElement(
				'div',
				{ className: 'title' },
				' ',
				React.createElement(
					'h2',
					null,
					React.createElement('i', { className: 'iconfont icon-group' }),
					this.props.data.name
				),
				' '
			) : null;
			return React.createElement(
				'section',
				{ className: 'm-block' },
				title,
				React.createElement(
					'div',
					{ className: 'content' },
					this.props.recommend,
					React.createElement(
						'ul',
						{ className: "f-clearfix subCat-" + this.props.data.style },
						this.props.data.contentlist.slice(0, this.props.data.contentlist.length - this.props.data.contentlist.length % 2).map(function (v, i) {
							return React.createElement(Book7, { key: i, data: v, style: this.props.data.style });
						}.bind(this))
					)
				)
			);
		}
	});
	var Block14 = React.createClass({
		displayName: 'Block14',

		pages: 1,
		mixins: [Mixins()],
		readMoreHandle: function readMoreHandle(e) {
			var that = this;
			this.pages++;
			AJAX.init('block.' + this.props.data.id);
			AJAX.get(function (data) {
				if (!data && !data.length) {
					that.setState({
						noMore: true
					});
					return;
				}
				if (data.length < 10) {
					that.setState({
						noMore: true
					});
				}
				that.setState({
					contentList: that.state.contentList.concat(data)
				});
			});
		},
		getInitialState: function getInitialState() {
			return {
				contentList: this.props.data.contentlist,
				noMore: this.props.data.contentlist.length < 6 ? true : false
			};
		},
		componentDidUpdate: function componentDidUpdate() {
			this.lazyloadImage(this.refs.container);
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.state.contentList !== nextState.contentList;
			this.state.noMore !== nextState.noMore;
		},
		render: function render() {
			var more;
			if (!this.state.noMore) {
				more = React.createElement(
					'button',
					{ className: 'u-readMore f-bt-eee f-mb--10', onClick: this.readMoreHandle },
					'点击查看更多...'
				);
			}
			return React.createElement(
				'section',
				{ className: 'm-block' },
				React.createElement(
					'div',
					{ className: 'title bsTitle f-pr', href: this.props.href },
					React.createElement('i', { className: 'iconfont icon-lh3 f-block f-tc' }),
					React.createElement(
						'h2',
						{ className: 'f-tc' },
						this.props.data.name
					)
				),
				React.createElement(
					'div',
					{ className: 'content', ref: 'container' },
					this.props.recommend,
					React.createElement(
						'ul',
						{ className: 'subCat-14' },
						this.state.contentList.map(function (v, i) {
							return React.createElement(Book8, { key: i, data: v });
						}.bind(this))
					),
					more
				)
			);
		}
	});
	var Block15 = React.createClass({
		displayName: 'Block15',

		mixins: [Mixins()],
		configTag: function configTag(e) {
			//var that = this;
			e.preventDefault();
			if (!this.isLogin()) {
				this.goLogin(callback);
				return;
			}
			callback();
			function callback() {
				//alert(that.isLogin());
				AJAX.init('listTag');
				AJAX.get(function (data) {
					if (data.selected.length) {
						myEvent.execCallback('updateTopList');
					} else {
						myEvent.setCallback('configTag', function () {
							myEvent.execCallback('updateTopList');
							//TODO 重新加载本页				
						});
						_reactRouter.browserHistory.push(GLOBAL.setHref('myTags'));
					}
				});
			}
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data;
		},
		render: function render() {
			if (!this.props.data.contentlist.length) {
				return React.createElement(
					'section',
					{ className: 'm-block' },
					React.createElement(
						'div',
						{ className: 'title bsTitle f-pr' },
						React.createElement('i', { className: 'iconfont icon-heart f-block f-tc' }),
						React.createElement(
							'h2',
							{ className: 'f-tc' },
							this.props.data.name
						)
					),
					React.createElement(
						'div',
						{ className: 'content content-none' },
						React.createElement(
							'a',
							{ onClick: this.configTag, className: 'u-btn3' },
							'+设置我的标签'
						)
					)
				);
			} else {
				return React.createElement(
					'section',
					{ className: 'm-block' },
					React.createElement(
						_reactRouter.Link,
						{ className: 'title bsTitle f-pr', to: this.props.href },
						React.createElement('span', { className: 'iconfont icon-arrow-right f-pa' }),
						React.createElement('i', { className: 'iconfont icon-heart f-block f-tc' }),
						React.createElement(
							'h2',
							{ className: 'f-tc' },
							this.props.data.name
						)
					),
					React.createElement(
						'div',
						{ className: 'content' },
						this.props.recommend,
						React.createElement(
							'ul',
							{ className: 'subCat-4 f-clearfix' },
							this.props.data.contentlist.map(function (v, i) {
								return React.createElement(Book1, { key: i, data: v });
							}.bind(this))
						)
					)
				);
			}
		}
	});

	var Blocklist = React.createClass({
		displayName: 'Blocklist',

		getInitialState: function getInitialState() {
			return {
				comps: null,
				block5: {}
			};
		},
		getUpdate: function getUpdate(blockList) {
			var that = this;
			var comps = blockList.map(function (block, i) {
				//console.log('风格' + block.style)
				if (block.style != 15 && (!block.contentlist || !block.contentlist.length)) {
					return;
				}
				var recommend = block.icon_word ? React.createElement(
					'p',
					{ className: 'recommend' },
					React.createElement(
						'span',
						{ className: 'iconWord f-br-3' },
						block.icon_word
					),
					block.short_recommend_words
				) : null;
				var hrefStr = GLOBAL.setHref('more/block.' + block.id);
				switch (block.style) {
					case 1:
						return React.createElement(Block1, { key: i, data: block, href: hrefStr, recommend: recommend });
					case 2:
						return React.createElement(Block2, { key: i, data: block, href: hrefStr, recommend: recommend });
					case 3:
						return React.createElement(Block3, { key: i, data: block, href: hrefStr, recommend: recommend });
					case 4:
						return React.createElement(Block4, { key: i, data: block, href: hrefStr, recommend: recommend });
					case 11: //banner不铺满
					case 5:
						//banner铺满
						__webpack_require__.e/* nsure */(1, function (require) {/* WEBPACK VAR INJECTION */(function(React) {
							setTimeout(function () {
								var Block5 = __webpack_require__(40);
								var block5 = React.createElement(Block5, { key: i, data: block, href: hrefStr, style: block.style });
								that.state.comps.splice(i, 1, block5);
								that.state.block5[i] = block5;
								that.setState({
									comps: that.state.comps,
									block5: that.state.block5
								});
							}, 0);
						
	/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)))});
						return that.state.block5[i];
					case 6:
						return React.createElement(Block6, { key: i, data: block, href: hrefStr, recommend: recommend });
					case 7: //7 圆形热词风格
					case 8:
						//8 方形热词风格
						return React.createElement(Block7, { key: i, data: block, recommend: recommend });
					case 9:
						//9文字瀑布流风格
						return React.createElement(Block9, { key: i, data: block, href: hrefStr, recommend: recommend });
					case 12: //12 半图偶数专题风格
					case 13:
						//13 半图偶数排行风格
						return React.createElement(Block12, { key: i, 'data-id': i, data: block, recommend: recommend });
					case 14:
						//14 书单风格
						return React.createElement(Block14, { key: i, data: block, href: hrefStr, recommend: recommend });
					case 15:
						//15 猜你喜欢风格
						return React.createElement(Block15, { key: i, data: block, href: hrefStr, recommend: recommend });
				}
			});
			return comps;
		},
		componentWillMount: function componentWillMount() {
			var comps = this.getUpdate(this.props.blockList);
			this.setState({
				comps: comps
			});
		},
		componentWillReceiveProps: function componentWillReceiveProps(netProp) {
			var comps = this.getUpdate(netProp.blockList);
			this.setState({
				comps: comps
			});
		},
		// shouldComponentUpdate: function(nextProps, nextState) {
		// 	var check = function(item){
		// 		return item == null;
		// 	}
		// 	return true;
		// 	return this.state.comps !== nextState.comps;
		// },
		render: function render() {
			//console.log(this.state.comps)
			return React.createElement(
				'div',
				{ className: 'f-pr m-block-c' },
				this.state.comps
			);
		}
	});

	module.exports = Blocklist;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6), __webpack_require__(14), __webpack_require__(5), __webpack_require__(15)))

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL) {'use strict';

	var _reactRouter = __webpack_require__(3);

	var Img = __webpack_require__(27);

	var Book1 = React.createClass({
		displayName: 'Book1',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data;
		},
		render: function render() {
			//console.log(this.props.fromIntroduce)	

			if (this.props.fromIntroduce) var hrefStr = location.pathname.replace(/introduce.\d+/, '') + 'introduce.' + this.props.data.book_id;else var hrefStr = GLOBAL.typeHref(this.props.data, this.props.fromIntroduce ? "now" : '');

			return React.createElement(
				'li',
				{ className: 'u-book-1 f-clearfix' },
				React.createElement(
					_reactRouter.Link,
					{ to: hrefStr },
					React.createElement(Img, { src: this.props.data.big_coverlogo || this.props.data.small_coverlogo }),
					React.createElement(
						'div',
						{ className: 'info' },
						React.createElement(
							'span',
							{ className: 'f-ellipsis-2 title' },
							this.props.data.name || this.props.data.book_name
						),
						React.createElement(
							'span',
							{ className: 'author' },
							this.props.data.author || this.props.data.author_name
						),
						React.createElement(
							'span',
							{ className: 'summary f-ellipsis-3' },
							this.props.data.book_brief
						)
					)
				)
			);
		}
	});

	module.exports = Book1;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6)))

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL) {'use strict';

	var _reactRouter = __webpack_require__(3);

	var Img = __webpack_require__(27);
	var Book2 = React.createClass({
		displayName: 'Book2',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data;
		},
		render: function render() {
			var hrefStr = GLOBAL.typeHref(this.props.data);
			return React.createElement(
				'li',
				{ className: 'u-book-2' },
				React.createElement(
					_reactRouter.Link,
					{ to: hrefStr },
					React.createElement(Img, { src: this.props.data.big_coverlogo }),
					React.createElement(
						'span',
						{ className: 'f-ellipsis' },
						this.props.data.name
					)
				)
			);
		}
	});

	module.exports = Book2;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6)))

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL) {"use strict";

	var _reactRouter = __webpack_require__(3);

	var Book3 = React.createClass({
		displayName: "Book3",

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data;
		},
		render: function render() {
			//console.log(this.props.data)
			var hrefStr = GLOBAL.typeHref(this.props.data);
			return React.createElement(
				"li",
				{ className: "u-book-3" },
				React.createElement(
					_reactRouter.Link,
					{ to: hrefStr },
					React.createElement(
						"div",
						null,
						React.createElement(
							"span",
							{ className: "title" },
							this.props.data.name
						),
						React.createElement(
							"span",
							{ className: "author" },
							this.props.data.author
						),
						React.createElement(
							"span",
							{ className: "bookState" },
							'/' + (this.props.data.status == '0' ? '连载' : '完本')
						)
					),
					React.createElement(
						"div",
						{ className: "summary f-ellipsis-2" },
						this.props.data.book_brief
					)
				)
			);
		}
	});

	module.exports = Book3;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6)))

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL) {'use strict';

	var _reactRouter = __webpack_require__(3);

	var Book5 = React.createClass({
		displayName: 'Book5',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data;
		},
		render: function render() {
			var hrefStr = GLOBAL.typeHref(this.props.data);
			var topCls = '';
			var topNum = this.props.data.locate;
			switch (topNum) {
				case 1:
					topCls = " NO1";
					break;
				case 2:
					topCls = " NO2";
					break;
				case 3:
					topCls = " NO3";
					break;
				default:
					topNum = '';
					break;
			}
			return React.createElement(
				'li',
				{ className: 'u-book-5' },
				React.createElement(
					_reactRouter.Link,
					{ to: hrefStr },
					React.createElement(
						'span',
						{ className: "topNb" + topCls },
						topNum
					),
					React.createElement(
						'span',
						{ className: 'f-ellipsis f-ellipsis-ib' },
						this.props.data.name
					)
				)
			);
		}
	});

	module.exports = Book5;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6)))

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL) {'use strict';

	var _reactRouter = __webpack_require__(3);

	var Img = __webpack_require__(27);

	var Book6 = React.createClass({
		displayName: 'Book6',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data;
		},
		render: function render() {
			var hrefStr = GLOBAL.typeHref(this.props.data);
			if (!this.props.noImage) {
				var img = React.createElement(Img, { src: this.props.data.big_coverlogo || this.props.data.small_coverlogo || this.props.data.image_url });
			}
			return React.createElement(
				'li',
				{ className: 'u-book-6' },
				React.createElement(
					_reactRouter.Link,
					{ to: hrefStr },
					img,
					React.createElement(
						'span',
						{ className: 'f-ellipsis' },
						this.props.data.name + (this.props.data.count ? ' ' + this.props.data.count : '')
					)
				)
			);
		}
	});

	module.exports = Book6;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6)))

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL, Link) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	//var Img = require('./img');

	var Subject = React.createClass({
		displayName: 'Subject',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data;
		},
		render: function render() {
			var cls = this.props.style == 12 ? 'u-book-7' : 'u-book-8';
			var height = this.props.style == 12 ? (document.body.offsetWidth - 40) / 2 * 0.38 : (document.body.offsetWidth - 27) / 2 * 0.53;
			var hrefStr = GLOBAL.typeHref(this.props.data);
			var target = '_self';
			if ((typeof hrefStr === 'undefined' ? 'undefined' : _typeof(hrefStr)) === 'object') {
				hrefStr = hrefStr.url;
				target = hrefStr.target;
			}
			return React.createElement(
				'li',
				{ className: cls },
				React.createElement(
					Link,
					{ to: hrefStr, className: 'u-lazyload-img', 'data-lazyload-src': this.props.data.image_url || this.props.data.intercut_url || this.props.data.big_coverlogo, style: { backgroundImage: 'url(src/img/defaultTopBackground.png)', height: height } },
					React.createElement(
						'span',
						null,
						this.props.data.name
					)
				)
			);
		}
	});

	module.exports = Subject;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6), __webpack_require__(22)))

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL) {'use strict';

	var _reactRouter = __webpack_require__(3);

	var Img = __webpack_require__(27);

	var BookSheet = React.createClass({
		displayName: 'BookSheet',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data;
		},
		render: function render() {
			var hrefStr = GLOBAL.typeHref(this.props.data);
			//var m_time = this.props.data.modify_time.substr(0,4)+'.'+this.props.data.modify_time.substr(4,2)+'.'+this.props.data.modify_time.substr(6,2);
			return React.createElement(
				'li',
				{ className: 'f-bb-eee' },
				React.createElement(
					_reactRouter.Link,
					{ className: 'f-pr', to: hrefStr },
					React.createElement(
						'div',
						{ className: 'bsCover f-pa f-br-6' },
						React.createElement(Img, { src: this.props.data.image_url })
					),
					React.createElement(
						'div',
						{ className: 'bsInfo' },
						React.createElement(
							'div',
							{ className: 'f-clearfix' },
							React.createElement(
								'span',
								{ className: 'f-fl bsName f-ellipsis-2', style: { color: this.props.data.title_color } },
								this.props.data.name
							),
							React.createElement(
								'span',
								{ className: 'f-fr bsCount' },
								'共计',
								this.props.data.count,
								'本'
							)
						),
						React.createElement(
							'p',
							{ className: 'f-tr f-fc-777' },
							'收藏数',
							React.createElement(
								'span',
								{ className: 'bsfCount' },
								this.props.data.collect_uv
							),
							'更新于',
							this.props.data.update_time
						)
					)
				)
			);
		}
	});

	module.exports = BookSheet;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6)))

/***/ },
/* 40 */,
/* 41 */,
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(AJAX, GLOBAL) {'use strict';

	if (typeof window !== 'undefined') {
		var isHidden = __webpack_require__(43);
	}

	var config = {
		intercut: { method: 'GET', url: '/api/intercut/log' },
		read: { method: 'POST', url: '/api/upload/log' }
	};

	var uploadLog = {
		result: {},
		send: function send(page, params) {
			// console.log(page,params)
			var id = params.intercut_id || params.content_id;
			if (config[page] && !isHidden()) {
				if (this.result[id]) {
					this.result[id]['count']++;
				} else {
					this.result[id] = params;
					this.result[id]['count'] = 1;
				}
			}
		},
		sending: function sending(page) {
			if (Object.getOwnPropertyNames && Object.getOwnPropertyNames(this.result).length == 0) return;
			AJAX.getJSON(config[page].method, config[page].url, this.result, GLOBAL.noop, GLOBAL.noop);
			this.result = {};
		},
		readlog: function readlog(page, params) {
			AJAX.getJSON(config[page].method, config[page].url, params, GLOBAL.noop, GLOBAL.noop);
		}
	};

	module.exports = uploadLog;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(6)))

/***/ },
/* 43 */
/***/ function(module, exports) {

	"use strict";

	var hidden;
	if (typeof document.hidden !== "undefined") {
		// Opera 12.10 and Firefox 18 and later support 
		hidden = "hidden";
	} else if (typeof document.mozHidden !== "undefined") {
		hidden = "mozHidden";
	} else if (typeof document.msHidden !== "undefined") {
		hidden = "msHidden";
	} else if (typeof document.webkitHidden !== "undefined") {
		hidden = "webkitHidden";
	}

	module.exports = function () {
		return document[hidden];
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, Mixins, AJAX, GLOBAL, myEvent, Loading, NoData) {'use strict';

	var Blocklist = __webpack_require__(32);
	var Header = __webpack_require__(25);

	var Top = React.createClass({
		displayName: 'Top',

		mixins: [Mixins()],
		getInitialState: function getInitialState() {
			return {
				noMore: true,
				scrollUpdate: false,
				onerror: false,
				list: null
			};
		},
		getData: function getData() {
			var _this = this;

			AJAX.init('group.6');
			AJAX.get(function (data) {
				AJAX.init('page.' + data.pagelist[0].pgid + '.' + data.pagelist[0].blocks);
				_this.getList();
			}, this.onerror);
		},
		getList: function getList() {
			var _this2 = this;

			AJAX.get(function (data) {
				if (!data.blocklist) {
					return;
				}
				if (!data.blocklist.length) {
					_this2.setState({
						noMore: true
					});
				}
				_this2.setState({
					list: _this2.state.scrollUpdate ? _this2.state.list.concat(data.blocklist) : data.blocklist,
					scrollUpdate: false
				});
				//设置GLOBAL.booklist/book
				GLOBAL.setBlocklist(data.blocklist);
			}, this.onerror);
		},
		componentDidMount: function componentDidMount() {
			this.getData();
			myEvent.setCallback('updateTopList', this.getData);
		},
		componentDidUpdate: function componentDidUpdate() {
			if (!this.state.list || !this.state.list.length) {
				return;
			}
			this.lazyloadImage(this.refs.container);
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProp, nextState) {
			//console.log(this.props,nextProp)
			return this.state.noMore !== nextState.noMore || this.state.list !== nextState.list || this.props.children !== nextProp.children;
		},
		render: function render() {
			var list;
			if (!this.state.list) {
				list = React.createElement(Loading, null);
			} else {
				if (this.state.list.length) {
					list = React.createElement(
						'div',
						{ className: 'g-main' },
						React.createElement(
							'div',
							{ className: 'g-scroll', onScroll: this.scrollHandle, ref: 'container' },
							React.createElement(Blocklist, { blockList: this.state.list })
						)
					);
				} else {
					list = React.createElement(
						'div',
						{ className: 'g-main' },
						React.createElement(NoData, null)
					);
				}
			}
			if (this.state.onerror) {
				list = React.createElement(
					'div',
					{ className: 'g-main' },
					React.createElement(NoData, { type: 'UFO' })
				);
			}

			return React.createElement(
				'div',
				null,
				React.createElement(Header, { title: '发现', left: null }),
				list,
				this.props.children
			);
		}
	});
	module.exports = Top;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(14), __webpack_require__(5), __webpack_require__(6), __webpack_require__(15), __webpack_require__(23), __webpack_require__(24)))

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, AJAX, NoData, Loading) {'use strict';

	var Header_s = __webpack_require__(46);
	var Blocklist = __webpack_require__(32);

	var Search = React.createClass({
		displayName: 'Search',

		getInitialState: function getInitialState() {
			return {
				blockList: null,
				UFO: false
			};
		},
		componentDidMount: function componentDidMount() {
			AJAX.init(this.props.params.param);
			AJAX.get(function (data) {
				this.setState({
					blockList: data.blocklist
				});
			}.bind(this), function (error) {
				this.setState({
					UFO: true
				});
				//console.log(error);
			}.bind(this));
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextPros, nextState) {
			return this.state.blockList !== nextState.blockList || this.state.UFO !== nextState.UFO || this.props.children !== nextPros.children;
		},
		render: function render() {
			var content;
			if (this.state.blockList) {
				if (this.state.blockList.length) {
					content = React.createElement(Blocklist, { blockList: this.state.blockList });
				} else {
					content = React.createElement(NoData, null);
				}
			} else {
				content = React.createElement(Loading, null);
			}
			if (this.state.UFO) {
				content = React.createElement(NoData, { type: 'UFO' });
			}
			return React.createElement(
				'div',
				{ className: 'gg-body' },
				React.createElement(Header_s, null),
				React.createElement(
					'div',
					{ className: 'g-main g-main-1' },
					React.createElement(
						'div',
						{ className: 'g-scroll' },
						content
					)
				),
				this.props.children
			);
		}
	});

	module.exports = Search;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(5), __webpack_require__(24), __webpack_require__(23)))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL, AJAX, browserHistory) {'use strict';

	var Header_s = React.createClass({
		displayName: 'Header_s',

		getInitialState: function getInitialState() {
			var key = '';
			if (GLOBAL.name === 'searchList') {
				key = decodeURIComponent(this.APIParts()[1]);
			}
			return {
				initialKey: key,
				key: key,
				btn: '取消',
				search: false
			};
		},
		handleChange: function handleChange(e) {
			this.setState({
				key: e.target.value.trim(),
				btn: '搜索',
				search: true
			});
		},
		handleClick: function handleClick(e) {
			e.preventDefault();
			if (this.state.search) {
				var key = this.state.key;
				if (GLOBAL.name === 'searchList') {
					AJAX.init('search.' + key);
					this.props.goSearch();
				} else {
					browserHistory.push(GLOBAL.setHref('searchList/search.' + key));
				}
				this.setState({
					initialKey: key
				});
			} else {
				GLOBAL.goBack();
			}
		},
		backClick: function backClick() {
			this.setState({
				key: ''
			});
			GLOBAL.goBack();
		},
		componentDidMount: function componentDidMount() {
			if (!this.state.key.length) {
				this.refs.searchInput.focus();
			}
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.state.key !== nextState.key || this.state.btn !== nextState.btn;
		},
		render: function render() {
			return React.createElement(
				'header',
				{ className: 'm-bar m-bar-head' },
				React.createElement('a', { className: 'f-fl icon-back iconfont', onClick: this.backClick }),
				React.createElement(
					'form',
					{ className: 'u-search f-cb' },
					React.createElement('input', { className: 'searchInput', ref: 'searchInput', type: 'search', value: this.state.key, placeholder: '书名/作者/关键字', onChange: this.handleChange }),
					React.createElement(
						'button',
						{ className: 'searchBtn f-fr', type: 'submit', onClick: this.handleClick },
						this.state.btn
					)
				)
			);
		}
	});

	module.exports = Header_s;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6), __webpack_require__(5), __webpack_require__(7)))

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, AJAX, GLOBAL, Loading, NoData) {'use strict';

	var Header = __webpack_require__(25);
	var Header_s = __webpack_require__(46);
	var Block7 = __webpack_require__(48);
	var Mixins = __webpack_require__(14);

	var List = React.createClass({
		displayName: 'List',

		mixins: [Mixins()],
		getList: function getList(scrollUpdate) {
			var _this = this;

			AJAX.init(this.props.params.param);
			if (scrollUpdate) {
				var n = AJAX.API._param['pages'] ? 'pages' : 'page';
				AJAX.API._param[n]++;
			}
			AJAX.get(function (data) {
				if (/^searchList/.test(_this.props.route.path)) {
					if (!data.contentlist.length) {
						_this.setState({
							noMore: true
						});
					}
					_this.setState({
						resultCount: data.result_count,
						bookList: _this.state.scrollUpdate ? _this.state.bookList.concat(data.contentlist) : data.contentlist,
						scrollUpdate: false
					});
					//设置GLOBAL book name
					GLOBAL.setBookName(data.contentlist);
				} else {
					if (!data || !data.length) {
						_this.setState({
							noMore: true
						});
					}
					_this.setState({
						bookList: _this.state.scrollUpdate ? _this.state.bookList.concat(data) : data,
						scrollUpdate: false
					});
					//设置GLOBAL book name
					GLOBAL.setBookName(data);
				}
			}, function (error) {
				if (_this.state.scrollUpdate) {
					_this.setState({
						scrollUpdate: false,
						noMore: true
					});
					return;
				}
				_this.setState({
					UFO: true
				});
				//console.log(error);
			});
		},
		goSearch: function goSearch() {
			if (!this.state.scrollUpdate) {
				this.refs.container.scrollTop = 0;
				this.setState({
					noMore: false,
					bookList: null,
					resultCount: null
				});
			}
			this.getList();
		},
		getInitialState: function getInitialState() {
			return {
				noMore: false,
				resultCount: null,
				bookList: null,
				scrollUpdate: false,
				UFO: false
			};
		},
		componentDidMount: function componentDidMount() {
			this.getList();
		},
		// componentWillReceiveProps: function(nextProps){
		// 	this.getData();
		// },
		componentDidUpdate: function componentDidUpdate() {
			this.lazyloadImage(this.refs.container);
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.state.bookList !== nextState.bookList || this.state.scrollUpdate !== nextState.scrollUpdate || this.state.UFO !== nextState.UFO || this.state.noMore !== nextState.noMore || this.props.children !== nextProps.children;
		},
		render: function render() {
			var header, noData, content, sLoading, result_count;
			//定义头部
			if (this.state.resultCount) {
				result_count = React.createElement(
					'p',
					{ className: 'u-noteText' },
					'为您找到相关图书',
					this.state.resultCount,
					'本'
				);
			}
			header = React.createElement(Header, { title: GLOBAL.title });
			if (/^searchList/.test(this.props.route.path)) {
				header = React.createElement(Header_s, { goSearch: this.goSearch });
			}
			//定义content
			if (!this.state.bookList) {
				content = React.createElement(Loading, null);
			} else {
				if (!this.state.bookList.length) {
					noData = React.createElement(
						'div',
						{ className: 'g-main g-main-1' },
						React.createElement(NoData, null)
					);
					content = null;
					result_count = null;
				} else {
					content = React.createElement(Block7, { bookList: this.state.bookList });
					sLoading = React.createElement(Loading, { cls: 'u-sLoading' });
				}
			}
			if (this.state.noMore) {
				sLoading = null;
			}
			if (this.state.UFO) {
				noData = React.createElement(
					'div',
					{ className: 'g-main g-main-1' },
					React.createElement(NoData, { type: 'UFO' })
				);
				content = null;
				result_count = null;
				sLoading = null;
			}
			return React.createElement(
				'div',
				{ className: 'gg-body' },
				header,
				React.createElement(
					'div',
					{ className: 'g-main g-main-1' },
					React.createElement(
						'div',
						{ className: 'g-scroll', onScroll: this.scrollHandle, ref: 'container' },
						result_count,
						content,
						sLoading
					)
				),
				noData,
				this.props.children
			);
		}
	});

	module.exports = List;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(5), __webpack_require__(6), __webpack_require__(23), __webpack_require__(24)))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React) {"use strict";

	var Book4 = __webpack_require__(49);
	var Block7 = React.createClass({
		displayName: "Block7",

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.bookList !== nextProps.bookList;
		},
		render: function render() {
			return React.createElement(
				"ul",
				{ className: "u-pWrap" },
				this.props.bookList.map(function (v, i) {
					return React.createElement(Book4, { key: i, data: v });
				}.bind(this))
			);
		}
	});
	module.exports = Block7;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL) {'use strict';

	var _reactRouter = __webpack_require__(3);

	var Img = __webpack_require__(27);
	var Stars = __webpack_require__(50);

	var Book4 = React.createClass({
		displayName: 'Book4',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data !== nextProps.data;
		},
		render: function render() {
			var hrefStr = GLOBAL.typeHref(this.props.data);
			return React.createElement(
				'li',
				{ className: 'u-book-1 f-clearfix' },
				React.createElement(
					_reactRouter.Link,
					{ to: hrefStr },
					React.createElement(Img, { src: this.props.data.big_coverlogo || this.props.data.small_coverlogo }),
					React.createElement(
						'div',
						{ className: 'info' },
						React.createElement(
							'span',
							{ className: 'f-ellipsis title' },
							this.props.data.name
						),
						React.createElement(
							'span',
							{ className: 'author' },
							this.props.data.author
						),
						React.createElement(
							'span',
							{ className: 'bookStar' },
							React.createElement(Stars, { score: this.props.data.score })
						),
						React.createElement(
							'span',
							{ className: 'summary f-ellipsis-3' },
							this.props.data.book_brief
						)
					)
				)
			);
		}
	});

	module.exports = Book4;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6)))

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React) {"use strict";

	var Stars = React.createClass({
		displayName: "Stars",

		shouldComponentUpdate: function shouldComponentUpdate(nextPros, nextState) {
			return this.props.score !== nextPros.score;
		},
		render: function render() {
			// scrole = a.b
			// star width 15px
			// margin-left 5px
			var a = Math.floor(this.props.score);
			var b = this.props.score - a;
			var width = a * (15 + 5) + b * 15;
			return React.createElement(
				"div",
				{ className: "u-stars" },
				React.createElement(
					"ul",
					{ className: "stars f-clearfix" },
					React.createElement("li", { className: "iconfont icon-star" }),
					React.createElement("li", { className: "iconfont icon-star" }),
					React.createElement("li", { className: "iconfont icon-star" }),
					React.createElement("li", { className: "iconfont icon-star" }),
					React.createElement("li", { className: "iconfont icon-star" })
				),
				React.createElement(
					"div",
					{ className: "mask", style: { width: width } },
					React.createElement(
						"ul",
						{ className: "stars active f-clearfix" },
						React.createElement("li", { className: "iconfont icon-star" }),
						React.createElement("li", { className: "iconfont icon-star" }),
						React.createElement("li", { className: "iconfont icon-star" }),
						React.createElement("li", { className: "iconfont icon-star" }),
						React.createElement("li", { className: "iconfont icon-star" })
					)
				)
			);
		}
	});

	module.exports = Stars;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL, AJAX, parseQuery, Link) {'use strict';

	var Header = __webpack_require__(25);
	var myEvent = __webpack_require__(15);

	var Login = React.createClass({
		displayName: 'Login',


		handleSubmit: function handleSubmit(e) {
			e.preventDefault();
			var that = this;
			if (that.loading) {
				return;
			}
			var postData = {
				phone: this.refs.mobile_num.value,
				password: this.refs.password.value //,
				//'param': [{'bookId': 1, 'type': 2}, {'bookId': 2, 'type': 3}]
			};
			if (!GLOBAL.assertNotEmpty(postData.phone, '请输入手机号')) {
				return;
			}
			if (!GLOBAL.assertMatchRegExp(postData.phone, /^1\d{10}$/, '请输入正确的手机号')) {
				return;
			}
			if (!GLOBAL.assertNotEmpty(postData.password, '请输入密码')) {
				return;
			}

			that.loading = true;
			AJAX.go('login', postData, function (data) {
				that.loading = false;
				var options = {
					expires: 1000
				};
				GLOBAL.cookie('userPhone', postData.phone, options);
				GLOBAL.cookie('userToken', data.token, options);
				GLOBAL.cookie('userId', data.user_id, options);
				GLOBAL.setUser({
					phone: postData.phone,
					token: postData.token
				});

				//判断登陆后的跳转
				var isneed = false;
				if (that.from && that.from.skipurl) {
					isneed = /\?/.test(that.from.skipurl);
					window.location.href = that.from.skipurl + (isneed ? '' : '?') + 'token=' + data.token + '&devicetoken=' + GLOBAL.getUuid();
				} else {
					GLOBAL.goBack();
					myEvent.execCallback('login');
				}
			}, function (res) {
				that.loading = false;
				GLOBAL.defaultOnError(res);
			});
			return false;
		},
		componentDidMount: function componentDidMount() {
			this.refs.mobile_num.focus();

			//判断来源from
			this.from = parseQuery(location.search);
		},
		render: function render() {
			var skipurl = '';
			if (this.from && this.from.skipurl) skipurl = '?skipurl=' + this.from.skipurl;
			return React.createElement(
				'div',
				{ className: 'gg-body' },
				React.createElement(Header, { title: GLOBAL.setTitle('login'), right: null, skipurl: true }),
				React.createElement(
					'div',
					{ className: 'm-loginblock m-userblocks' },
					React.createElement(
						'form',
						{ className: 'u-loginform u-userform', onSubmit: this.handleSubmit },
						React.createElement(
							'div',
							{ className: 'u-inputline' },
							React.createElement('input', { className: 'u-input', placeholder: '手机号', type: 'tel', ref: 'mobile_num' })
						),
						React.createElement(
							'div',
							{ className: 'u-inputline' },
							React.createElement('input', { className: 'u-input', placeholder: '密码', type: 'password', ref: 'password' })
						),
						React.createElement(
							'div',
							{ className: 'u-inputline' },
							React.createElement(
								'button',
								{ type: 'submit', className: 'u-btn u-btn-full' },
								'登录'
							)
						),
						React.createElement(
							'div',
							{ className: 'u-inputline f-clearfix' },
							React.createElement(
								'div',
								{ className: 'u-buttonc f-fl' },
								React.createElement(
									Link,
									{ className: 'tip', to: GLOBAL.setHref('register') },
									'注册新账号'
								)
							),
							React.createElement(
								'div',
								{ className: 'u-buttonc f-fl' },
								React.createElement(
									Link,
									{ className: 'tip', to: GLOBAL.setHref('forget') },
									'忘记密码'
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'u-otherlogins-tip f-hide' },
							'其他方式登录'
						),
						React.createElement(
							'div',
							{ className: 'u-inputline f-clearfix f-hide' },
							React.createElement(
								'div',
								{ className: 'u-buttonc f-fl' },
								React.createElement(
									'a',
									{ className: 'u-otherlogin' },
									React.createElement('img', { src: 'src/img/qq.png' }),
									React.createElement(
										'span',
										{ className: 'title' },
										'QQ'
									)
								)
							),
							React.createElement(
								'div',
								{ className: 'u-buttonc f-fl' },
								React.createElement(
									'a',
									{ className: 'u-otherlogin' },
									React.createElement('img', { src: 'src/img/wechat.png' }),
									React.createElement(
										'span',
										{ className: 'title' },
										'微信'
									)
								)
							)
						)
					)
				),
				this.props.children
			);
		}
	});

	module.exports = Login;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6), __webpack_require__(5), __webpack_require__(26), __webpack_require__(22)))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL, AJAX, parseQuery) {'use strict';

	var Header = __webpack_require__(25);

	var Register = React.createClass({
		displayName: 'Register',

		getInitialState: function getInitialState() {

			return {
				s: 0
			};
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextPros, nextState) {
			return nextState.s != this.state.s;
		},
		handleSubmit: function handleSubmit() {
			var that = this;
			if (that.loading) {
				return;
			}
			var postData = {
				mobile_num: this.refs.mobile_num.value,
				key: this.refs.key.value,
				password: this.refs.password.value,
				device_identifier: GLOBAL.getUuid(),
				channel: 5,
				promot: that.from.channel ? that.from.channel : 'H5'
			};
			if (!GLOBAL.assertNotEmpty(postData.mobile_num, '请输入手机号')) {
				return;
			}
			if (!GLOBAL.assertMatchRegExp(postData.mobile_num, /^1\d{10}$/, '请输入正确的手机号')) {
				return;
			}
			if (!GLOBAL.assertNotEmpty(postData.key, '请输入验证码')) {
				return;
			}
			if (!GLOBAL.assertNotEmpty(postData.password, '请输入密码')) {
				return;
			}

			that.loading = true;
			AJAX.getJSON('POST', this.props.forget && '/api/auth/reset/password' || '/api/auth/register', postData, function (data) {
				that.loading = false;
				var options = {
					expires: 1000
				};
				GLOBAL.cookie('userPhone', postData.mobile_num, options);
				GLOBAL.cookie('userToken', data.token, options);
				GLOBAL.setUser({
					phone: postData.mobile_num,
					token: postData.token
				});

				//判断登陆后的跳转
				var isneed = false;
				if (that.from && that.from.skipurl) {
					isneed = /\?/.test(that.from.skipurl);
					window.location.href = that.from.skipurl + (isneed ? '' : '?') + 'token=' + data.token + '&devicetoken=' + GLOBAL.getUuid();
				} else {
					Router.goBack();
				}
			}, function (res) {
				that.loading = false;
				GLOBAL.defaultOnError(res);
			});
		},
		getCode: function getCode() {
			if (this.state.s) {
				return;
			}
			var mobile_num = this.refs.mobile_num.value;
			if (!GLOBAL.assertNotEmpty(mobile_num, '请输入手机号')) {
				return;
			}
			if (!GLOBAL.assertMatchRegExp(mobile_num, /^1\d{10}$/, '请输入正确的手机号')) {
				return;
			}

			AJAX.getJSON('GET', '/api/auth/key?', {
				phone: mobile_num,
				type: this.props.forget && 'reset' || 'register'
			}, function (data) {
				//console.log(data);
			}, function (res) {
				this.setState({
					s: 0
				});
				GLOBAL.defaultOnError(res);
			}.bind(this));

			this.setState({
				s: 60
			});
			var inter = setInterval(function () {
				if (this.state.s > 0 && this.isMounted()) {
					this.setState({
						s: this.state.s - 1
					});
				} else {
					clearInterval(inter);
				}
			}.bind(this), 1000);
		},
		componentDidMount: function componentDidMount() {
			this.refs.mobile_num.focus();
			//判断来源from
			this.from = parseQuery(location.search);
		},
		render: function render() {

			return React.createElement(
				'div',
				{ className: 'gg-body' },
				React.createElement(Header, { right: null }),
				React.createElement(
					'div',
					{ className: 'm-registerblock m-userblocks' },
					React.createElement(
						'form',
						{ className: 'u-registerform u-userform' },
						React.createElement(
							'div',
							{ className: 'u-inputline' },
							React.createElement('input', { className: 'u-input', placeholder: '手机号', type: 'tel', ref: 'mobile_num' })
						),
						React.createElement(
							'div',
							{ className: 'u-inputline f-clearfix' },
							React.createElement(
								'div',
								{ className: 'u-inputc f-fl' },
								React.createElement('input', { className: 'u-input', placeholder: '验证码', type: 'tel', ref: 'key' })
							),
							React.createElement(
								'div',
								{ className: 'u-buttonc f-fl' },
								React.createElement(
									'a',
									{ className: "u-btn u-btn-full" + (this.state.s ? ' u-btn-disabled' : ''), type: 'button', onClick: this.getCode },
									this.state.s && '重新获取(' + this.state.s + ')' || '获取验证码'
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'u-inputline' },
							React.createElement('input', { className: 'u-input', placeholder: this.props.forget && '新密码' || '密码', type: 'password', ref: 'password' })
						),
						React.createElement(
							'div',
							{ className: 'u-inputline' },
							React.createElement(
								'a',
								{ className: 'u-btn u-btn-full', onClick: this.handleSubmit },
								'完成'
							)
						)
					)
				)
			);
		}
	});

	module.exports = Register;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6), __webpack_require__(5), __webpack_require__(26)))

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, Mixins, storage, browserHistory, AJAX, GLOBAL, myEvent, Loading, NoData) {'use strict';

	var Header = __webpack_require__(25);
	var Book1 = __webpack_require__(33);
	var Chapterlist = __webpack_require__(54);
	var parseQuery = __webpack_require__(26);
	if (typeof window !== 'undefined') {
		__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../css/introduce.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	}

	var Detail = React.createClass({
		displayName: 'Detail',

		mixins: [Mixins()],
		getInitialState: function getInitialState() {
			return {
				isOnshelf: !!this.props.book.is_self
			};
		},
		addBook: function addBook() {
			if (this.props.isOnshelf) return;
			var cId = this.props.book.current_chapter_id,
			    cOffset = this.props.book.current_chapter_offest;
			var param = [{
				bookId: this.props.book.bid,
				type: 3,
				time: new Date().getTime(),
				chapter_id: cId ? cId : 0,
				chapter_offset: cOffset ? cOffset : 0
			}];
			this.shelfAdding(param, this.props.onShelf);
		},
		startReading: function startReading() {
			var readLog = storage.get('readLogNew');
			var chapterid = this.props.book.current_chapter_id,
			    sourcebid = this.props.book.source_bid,
			    localid = this.props.book.bid,
			    source_id = this.props.book.source_id;
			if (readLog[this.props.book.bid]) {
				chapterid = readLog[this.props.book.bid].current_chapterid;
			}
			browserHistory.push(location.pathname + ['/reading/crossDomain', sourcebid, chapterid, localid, source_id].join('.'));
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.book !== nextProps.book || this.props.isOnshelf !== nextProps.isOnshelf;
		},
		render: function render() {
			var cls = this.props.isOnshelf ? ' disabled' : '';
			var val = this.props.isOnshelf ? '已加入书架' : '加入书架';
			return React.createElement(
				'div',
				{ className: 'u-bookIntroduce' },
				React.createElement(
					'div',
					{ className: 'f-clearfix' },
					React.createElement('img', { src: this.props.book.big_coverlogo, className: 'f-fl introduce-cover' }),
					React.createElement(
						'div',
						{ className: 'bookinfo' },
						React.createElement(
							'div',
							{ className: 'title' },
							this.props.book.book_name
						),
						React.createElement(
							'div',
							{ className: 'author' },
							'作者: ' + this.props.book.author
						),
						React.createElement(
							'div',
							{ className: 'wordCount' },
							'字数: ' + this.props.book.word_count + "字/" + (this.props.book.status == "0" ? "连载中" : "已完本")
						),
						React.createElement(
							'div',
							{ className: 'bookSource' },
							React.createElement(
								'b',
								{ className: 'sourceIcon' },
								React.createElement('img', { src: this.props.book.icon_url })
							),
							React.createElement(
								'span',
								null,
								this.props.book.source_name
							)
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'buttons f-clearfix' },
					React.createElement(
						'a',
						{ className: 'readButton button f-fl', onClick: this.startReading },
						'开始阅读'
					),
					React.createElement(
						'button',
						{ className: "button f-fr" + cls, onClick: this.addBook },
						val
					)
				)
			);
		}
	});
	var Introduce = React.createClass({
		displayName: 'Introduce',

		mixins: [Mixins()],
		isUpdate: true,
		getInitialState: function getInitialState() {
			return {
				isOnshelf: false,
				bid: this.APIParts()[1],
				chapterlist: null,
				page: 1,
				page_size: 20,
				vt: 9,
				getChapterlistLoading: false,
				book: null,
				noMoreChapterlist: false,
				noData: false,
				UFO: false
			};
		},
		cacheBook: function cacheBook(data) {
			var bookIntroduce = storage.get('bookIntroduce', 'array');
			if (bookIntroduce.length > 10) {
				bookIntroduce.unshift();
			}
			var flag = true;
			for (var i = 0; i < bookIntroduce.length; i++) {
				if (bookIntroduce[i].bid === data.bid) {
					flag = false;
					bookIntroduce[i] = data;
					break;
				}
			}
			if (flag) {
				bookIntroduce.push(data);
			}
			storage.set('bookIntroduce', bookIntroduce);
		},
		getBook: function getBook(param) {

			var hash = param ? param : this.props.params.param;
			AJAX.init(hash);
			AJAX.get(function (data) {
				if (data.status_code === '500') {
					this.setState({
						noData: true
					});
					return;
				}
				data.content_id = data.bid = this.APIParts()[1];
				data.name = data.book_name;
				data.orderList = data.orderList.concat(data.readList);
				GLOBAL.setBookName([data]);
				this.isUpdate = true;
				this.setState({
					book: data,
					isOnshelf: !!data.is_self
				});
				this.cacheBook(data);
			}.bind(this), function (error) {
				this.setState({
					UFO: true
				});
				//console.log(error)
			}.bind(this));
		},
		getChapterlist: function getChapterlist(next) {
			if (!this.isMounted() || this.state.getChapterlistLoading || this.state.noMoreChapterlist) {
				return;
			}
			this.setState({
				getChapterlistLoading: true
			});

			AJAX.init('chapterlist.' + this.state.book.bid + '.' + this.state.page_size);

			AJAX.get(function (data) {
				this.setState({
					noMoreChapterlist: Math.ceil(data.totalSize / this.state.page_size) <= this.state.page + (next ? 1 : 0),
					chapterlist: (this.state.chapterlist || []).concat(data.chapterList),
					page: this.state.page + (next ? 1 : 0),
					getChapterlistLoading: false
				});
			}.bind(this));
		},
		onShelf: function onShelf() {
			if (!this.isMounted()) {
				return;
			}
			this.setState({
				isOnshelf: true
			});
		},
		componentWillReceiveProps: function componentWillReceiveProps() {
			this.setState({
				chapterlist: null
			});
		},
		componentDidMount: function componentDidMount() {
			var obj = parseQuery(location.search);
			if (obj.action && obj.action == 'openapp') {
				//console.log('imread://detail/[{"detail":[{"bid":"'+ obj.book_id+'","type":"9"}],"pushcmd":"9"}]')
				//var p = "imread://detail/" + encodeURI('[{"detail":[{"bid":"'+ obj.book_id+'","type":"9"}],"pushcmd":"9"}]');
				var p = "detail/" + encodeURI('[{"detail":[{"bid":"' + obj.book_id + '","type":"9"}],"pushcmd":"9"}]');
				window.location.href = 'imread://' + p;
				//window.location.href = p;
			}
			this.getBook();
			myEvent.setCallback('updateShelfBtn', this.onShelf);
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {

			if (this.props.params.param !== nextProps.params.param) {
				this.getBook(nextProps.params.param);
				this.isUpdate = false;
			}

			return this.state.book !== nextState.book || this.state.chapterlist !== nextState.chapterlist || this.state.isOnshelf !== nextState.isOnshelf || this.state.getChapterlistLoading !== nextState.getChapterlistLoading || this.state.noData !== nextState.noData || this.state.UFO !== nextState.UFO || this.props.children !== nextProps.children || this.props.params.param !== nextProps.params.param;
		},
		render: function render() {

			var header, loading, introduceTabs, detail;
			if (!this.state.book || !this.isUpdate) {
				header = React.createElement(Header, { title: GLOBAL.book[this.state.bid], right: false });
				loading = React.createElement(Loading, null);
				if (this.state.noData) {
					loading = React.createElement(NoData, null);
				}
				if (this.state.UFO) {
					loading = React.createElement(NoData, { type: 'UFO' });
				}
			} else {
				header = React.createElement(Header, { title: this.state.book.book_name, right: false });
				detail = React.createElement(Detail, { book: this.state.book, bid: this.state.bid, isOnshelf: this.state.isOnshelf, onShelf: this.onShelf });
				introduceTabs = React.createElement(IntroduceTabs, { key: '3', source_id: this.state.book.source_id, source_bid: this.state.book.source_bid, bid: this.state.book.bid, readlist: this.state.book.orderList, getChapterlist: this.getChapterlist, getChapterlistLoading: this.state.getChapterlistLoading, book_brief: this.state.book.book_brief, chapterlist: this.state.chapterlist });
			}
			return React.createElement(
				'div',
				{ className: 'gg-body' },
				React.createElement(
					'div',
					{ className: 'g-scroll' },
					React.createElement(
						'p',
						null,
						this.state.book ? this.state.book.book_name : '',
						' '
					),
					header,
					React.createElement(
						'div',
						{ className: 'introduce-container' },
						detail,
						introduceTabs,
						loading
					)
				),
				this.props.children
			);
		}
	});

	var IntroduceTabs = React.createClass({
		displayName: 'IntroduceTabs',

		mixins: [Mixins()],
		getInitialState: function getInitialState() {
			return {
				current: 0,
				fixTabbar: false
			};
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, netxtState) {
			return true;
		},
		toggleTab: function toggleTab(e) {
			var index = 0;
			for (var i = 0; i < e.target.parentNode.children.length; i++) {
				if (e.target === e.target.parentNode.children[i]) {
					index = i;
					break;
				}
			}
			this.setState({
				current: index
			});

			if (index == 1 && !this.props.chapterlist) {
				this.props.getChapterlist();
			}
		},
		timeout: {},
		componentDidMount: function componentDidMount() {
			var containers = document.getElementsByClassName("introduce-container");
			if (!containers.length) {
				return;
			}
			var container = containers[containers.length - 1];
			var self = this;
			container.onscroll = function (e) {
				clearTimeout(self.timeout['fixTabbar']);
				self.timeout['fixTabbar'] = setTimeout(function () {
					if (self.isMounted()) self.setState({
						fixTabbar: container.scrollTop > 202
					});
				}, 100);
				if (self.state.current == 2) {
					self.lazyloadImage(container);
				} else if (self.state.current == 1) {
					if (container.scrollTop + document.body.scrollHeight + 100 > container.scrollHeight) {
						clearTimeout(self.timeout['scroll']);
						self.timeout['scroll'] = setTimeout(function () {
							self.props.getChapterlist(true);
						}, 100);
					}
				}
			};
		},
		componentDidUpdate: function componentDidUpdate(nextProps, netxtState) {

			if (this.state.current == 2) {
				var containers = document.getElementsByClassName("introduce-container");
				if (!containers.length) {
					return;
				}
				var container = containers[containers.length - 1].parentNode;
				this.lazyloadImage(container);
			}
		},
		render: function render() {
			var fixTabbar = this.state.fixTabbar ? "u-fixTabbar" : "";
			return React.createElement(
				'div',
				{ className: 'u-tabs u-bookIntroduce' },
				React.createElement(
					'div',
					{ className: fixTabbar },
					React.createElement(
						'div',
						{ className: "u-tabbar", ref: 'tabbar' },
						React.createElement(
							'span',
							{ onClick: this.toggleTab, className: "tab tab-0" + (this.state.current == 0 ? ' active' : '') },
							'简介'
						),
						React.createElement(
							'span',
							{ onClick: this.toggleTab, className: "tab tab-1" + (this.state.current == 1 ? ' active' : '') },
							'目录'
						),
						React.createElement(
							'span',
							{ onClick: this.toggleTab, className: "tab tab-2" + (this.state.current == 2 ? ' active' : '') },
							'推荐'
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'contents', ref: 'contents' },
					React.createElement(
						'div',
						{ className: "content content-0" + (this.state.current == 0 ? ' active' : '') },
						this.props.book_brief
					),
					React.createElement(
						'div',
						{ className: "content content-1" + (this.state.current == 1 ? ' active' : '') },
						React.createElement(Chapterlist, { hrefBase: window.location.pathname, source_id: this.props.source_id, source_bid: this.props.source_bid, bid: this.props.bid, chapterlist: this.props.chapterlist, loading: this.props.getChapterlistLoading })
					),
					React.createElement(
						'div',
						{ className: "content content-2" + (this.state.current == 2 ? ' active' : '') },
						React.createElement(Readlist, { readlist: this.props.readlist })
					)
				)
			);
		}
	});

	var Readlist = React.createClass({
		displayName: 'Readlist',

		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.readlist !== nextProps.readlist;
		},
		render: function render() {
			var loading, content;
			if (!this.props.readlist) {
				loading = React.createElement(Loading, null);
			} else {
				content = React.createElement(
					'ul',
					null,
					this.props.readlist.map(function (book, i) {
						return React.createElement(Book1, { key: i, data: book, fromIntroduce: '1' });
					})
				);
			}
			return React.createElement(
				'div',
				null,
				loading,
				content
			);
		}
	});

	module.exports = Introduce;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(14), __webpack_require__(8), __webpack_require__(7), __webpack_require__(5), __webpack_require__(6), __webpack_require__(15), __webpack_require__(23), __webpack_require__(24)))

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, storage, browserHistory) {'use strict';

	var myEvent = __webpack_require__(15);

	var Chapterlist = React.createClass({
		displayName: 'Chapterlist',

		getCurrentChapterId: function getCurrentChapterId(bid) {
			var currentChapterId = 0;
			var readLog = storage.get('readLogNew')[bid];
			if (readLog) {
				currentChapterId = readLog.current_chapterid;
			}
			return currentChapterId;
		},
		getInitialState: function getInitialState() {
			return {
				needUpdate: 0,
				currentChapterId: this.props.currentChapterId || this.getCurrentChapterId(this.props.bid)
			};
		},
		handleClick: function handleClick(e) {
			var cid = e.target.getAttribute('data-cid') || e.target.parentNode.getAttribute('data-cid');
			// var feeType = e.target.getAttribute('data-fee') || e.target.parentNode.getAttribute('data-fee');		

			var targetUrl = this.props.hrefBase + '/reading/crossDomain.' + [this.props.source_bid, cid, this.props.bid, this.props.source_id].join('.');
			if (this.props.fromReading) {
				browserHistory.push(targetUrl);
			} else {
				window.location.href = targetUrl;
			}
		},
		componentDidMount: function componentDidMount() {
			var surfix = this.props.fromReading ? '-fromReading' : '';
			myEvent.setCallback('reading' + this.props.bid + surfix, function () {
				if (this.isMounted()) {
					this.setState({
						needUpdate: this.state.needUpdate + 1,
						currentChapterId: this.getCurrentChapterId(this.props.bid)
					});
				}
			}.bind(this));
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.chapterlist !== nextProps.chapterlist || this.props.loading !== nextProps.loading || this.props.currentChapterId !== nextProps.currentChapterId || this.state.needUpdate !== nextState.needUpdate;
		},
		render: function render() {
			var loading, content;

			if (!this.props.chapterlist) {
				loading = React.createElement(
					'i',
					{ className: 'u-sLoading' },
					'目录努力加载中...'
				);
			} else {
				var sloading = this.props.loading ? "" : " f-hide";
				content = React.createElement(
					'ul',
					{ className: 'chapterlist' },
					this.props.chapterlist.map(function (chapter, i) {
						var lock;
						if (chapter.feeType != '0') {
							lock = React.createElement('i', { className: 'f-fr iconfont u-icon icon-lock' });
						}
						return React.createElement(
							'li',
							{ key: i, className: "chapter f-clearfix" + (chapter.cid == this.state.currentChapterId ? ' current' : ''), onClick: this.handleClick, 'data-cid': chapter.cid, 'data-fee': chapter.feeType },
							lock,
							React.createElement(
								'span',
								{ className: 'name f-ellipsis' },
								chapter.chapterName
							)
						);
					}.bind(this)),
					React.createElement(
						'li',
						{ className: "u-sLoading" + sloading },
						'努力加载中...'
					)
				);
			}
			return React.createElement(
				'div',
				null,
				loading,
				content
			);
		}
	});

	module.exports = Chapterlist;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(8), __webpack_require__(7)))

/***/ },
/* 55 */,
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, AJAX, browserHistory, GLOBAL, Loading) {'use strict';

	var Header = __webpack_require__(25);
	var PayTips = __webpack_require__(57);
	var Recharge = __webpack_require__(58);

	if (typeof window !== 'undefined') {
		__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../css/pay.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	}

	var Balance = React.createClass({
		displayName: 'Balance',

		getBalance: function getBalance() {
			if (!this.isMounted()) {
				return;
			}
			AJAX.init(this.props.route.path);
			AJAX.get(function (data) {
				this.setState({
					loading: false,
					balance: data.success.balance,
					list: data.success.list
				});
			}.bind(this));
		},
		getInitialState: function getInitialState() {
			return {
				loading: true,
				list: [],
				balance: 0,
				active: 0
			};
		},
		componentDidMount: function componentDidMount() {
			this.getBalance();
		},
		handleClick: function handleClick(e) {
			this.setState({
				active: e.target.getAttribute('data-index') || e.target.parentNode.getAttribute('data-index')
			});
		},
		orderHandle: function orderHandle() {
			var ordered = this.state.list[this.state.active];
			browserHistory.push(GLOBAL.setHref('recharge/' + ordered.productId));
		},
		render: function render() {
			var content;
			if (this.state.loading) {
				content = React.createElement(Loading, null);
			} else {
				content = React.createElement(
					'div',
					null,
					React.createElement(
						'div',
						{ className: 'u-balance' },
						React.createElement(
							'div',
							{ className: 'title' },
							'余额'
						),
						React.createElement(
							'div',
							{ className: 'count' },
							(this.state.balance / 100).toFixed(2),
							React.createElement(
								'span',
								{ className: 'unit' },
								'艾豆'
							)
						)
					),
					React.createElement('div', { className: 'u-divider' }),
					React.createElement(
						'ul',
						{ className: 'pay-list f-clearfix' },
						(this.state.list.length % 2 === 0 ? this.state.list : this.state.list.slice(0, -1)).map(function (item, i) {
							var active = i == this.state.active;
							var activeClass = active ? ' active' : '';
							var activeImg = active ? 'src/img/balance_select.png' : 'src/img/balance.png';
							return React.createElement(
								'li',
								{ key: i, className: "f-fl" + activeClass, onClick: this.handleClick, 'data-index': i },
								React.createElement('img', { src: activeImg }),
								React.createElement(
									'span',
									{ className: 'count' },
									item.productPrice / 100
								)
							);
						}.bind(this))
					),
					React.createElement(
						'div',
						{ className: 'u-userform' },
						React.createElement(
							'a',
							{ className: 'u-btn u-btn-full', onClick: this.orderHandle },
							'话费充值'
						)
					),
					React.createElement(PayTips, null)
				);
			}
			return React.createElement(
				'div',
				{ className: 'gg-body' },
				React.createElement(Header, { right: false }),
				React.createElement(
					'div',
					{ className: 'g-main g-main-1' },
					React.createElement(
						'div',
						{ className: 'g-scroll m-balance' },
						content
					)
				),
				this.props.children
			);
		}
	});

	module.exports = Balance;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(5), __webpack_require__(7), __webpack_require__(6), __webpack_require__(23)))

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React) {"use strict";

	var PayTips = React.createClass({
		displayName: "PayTips",

		render: function render() {
			return React.createElement(
				"div",
				{ className: "m-paytip" },
				React.createElement(
					"h3",
					{ className: "tipTitle" },
					"温馨提示"
				),
				React.createElement(
					"ul",
					null,
					React.createElement(
						"li",
						null,
						"仅支持中国移动用户，充值比例为1元=1艾豆"
					),
					React.createElement(
						"li",
						null,
						"艾豆支持艾美阅读书城的图书购买，除咪咕阅读"
					),
					React.createElement(
						"li",
						null,
						"支付过程中如遇到问题，请联系",
						React.createElement(
							"a",
							{ href: "tel:4009679897" },
							"4009679897"
						)
					)
				)
			);
		}
	});

	module.exports = PayTips;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL, AJAX, browserHistory) {'use strict';

	var Header = __webpack_require__(25);
	var PayTips = __webpack_require__(57);
	var Recharge_result = __webpack_require__(59);
	if (typeof window !== 'undefined') {
		__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../css/pay.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
		var POP = __webpack_require__(9);
	}

	var Recharge = React.createClass({
		displayName: 'Recharge',

		aidou: 0,
		sum: 0,
		initData: null,
		loading: false,
		handleSubmit: function handleSubmit() {
			var that = this;
			// var data = {code:200};
			// success(data);
			// return;
			var phoneNumber = that.refs.mobile_num.value;
			var verifyCode = that.refs.key.value;
			if (that.loading) {
				return;
			}
			if (!GLOBAL.assertNotEmpty(phoneNumber, '请输入手机号')) {
				return;
			}
			if (!GLOBAL.assertMatchRegExp(phoneNumber, /^1\d{10}$/, '请输入正确的手机号')) {
				return;
			}
			if (!that.initData) {
				POP._alert('请先获取验证码！');
				return;
			}
			if (!GLOBAL.assertNotEmpty(verifyCode, '请输入验证码')) {
				return;
			}
			if (!GLOBAL.assertMatchRegExp(verifyCode, /^\d{6}$/, '请输入6位数字验证码')) {
				return;
			}

			var postData = {
				mobileNum: that.params_init.mobileNum,
				orderNo: that.params_init.orderNo,
				verifyCode: verifyCode
			};
			that.loading = true;
			AJAX.go('payConfirm', postData, success, null, 'recharge');
			// function fail(res){
			// 	that.loading = false;
			// 	console.log(res.code)
			// 	if(res.code===159){
			// 		POP.alert(res.reason, that.refs.key.focus);
			// 	}else{
			// 		success(res);
			// 	}
			// }
			function success(data) {
				that.loading = false;
				if (data.code === 159) {
					POP.alert(data.reason, function () {
						that.refs.key.select();
					});
					return;
				}
				browserHistory.push(GLOBAL.setHref('recharge_result'));
				setTimeout(function () {
					var rechargeRes = React.createElement(Recharge_result, { data: data });
					if (data.code !== 200) {
						that.props.popup(rechargeRes);
						return;
					}
					data.sum = that.sum;
					data.aidou = that.aidou;
					data.phone = that.params_init.mobileNum;
					that.props.popup(rechargeRes);
				}, 0);
			}
		},
		getCode: function getCode(e) {
			e.preventDefault();
			if (this.state.s) {
				return;
			}
			var mobile_num = this.refs.mobile_num.value;
			if (!GLOBAL.assertNotEmpty(mobile_num, '请输入手机号')) {
				return;
			}
			if (!GLOBAL.assertMatchRegExp(mobile_num, /^1\d{10}$/, '请输入正确的手机号')) {
				return;
			}
			this.params_init.mobileNum = mobile_num;
			var countDown = function () {
				this.setState({
					s: 60
				});
				var inter = setInterval(function () {
					if (this.state.s > 0 && this.isMounted()) {
						this.setState({
							s: this.state.s - 1
						});
					} else {
						clearInterval(inter);
					}
				}.bind(this), 1000);
			}.bind(this);
			var initError = function (res) {
				// console.log(res)
				this.setState({
					s: 0
				});
				POP.alert(res.reason + ', 错误码：' + res.code);
			}.bind(this);
			var gotInit = function (data, again) {
				this.initData = data;
				this.refs.key.focus();
				GLOBAL.cookie('payUser', this.params_init.mobileNum);
				if (again) {
					var postData = {
						mobileNum: this.params_init.mobileNum,
						orderNo: this.params_init.orderNo,
						r: data.vcurl
					};
					AJAX.go('payVcurl', postData, gotInit, initError, 'recharge');
				}
			}.bind(this);
			countDown();
			if (!this.initData || GLOBAL.cookie('payUser') !== mobile_num) {
				AJAX.go('paySign', this.params_init, function (data) {
					// console.log(data)
					this.params_init.sign = data.content;
					AJAX.go('payInit', this.params_init, gotInit, initError, 'recharge');
				}.bind(this), initError, 'recharge');
			} else {
				gotInit(this.initData, true);
			}
		},
		getPay: function getPay() {
			var that = this;
			var postData = {
				productId: this.props.params.param,
				fee: '1',
				payType: '1',
				spType: '1',
				mobileNum: '1',
				productName: '1',
				productDesc: '1',
				others: '1'
			};

			AJAX.go('pay', postData, function (data) {
				that.setState({
					aidou: data.success.fee / 100,
					sum: data.success.fee / 100
				});
				var params = data.success;
				that.params_init = {
					fee: params.fee,
					orderNo: params.orderNo,
					others: params.others,
					payType: params.payType,
					productDesc: params.productDesc,
					productName: params.productName,
					reqTime: params.reqTime,
					spType: params.spType,
					thirdPartyId: params.thirdPartyId
				};
			});
		},
		getInitialState: function getInitialState() {
			return {
				s: 0,
				aidou: 0,
				sum: 0
			};
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextPros, nextState) {
			return nextState.s != this.state.s || nextState.aidou != this.state.aidou || nextState.sum != this.state.sum;
		},
		componentWillMount: function componentWillMount() {
			this.getPay();
		},
		componentDidMount: function componentDidMount() {
			var phoneNumber = GLOBAL.cookie('payUser');
			if (phoneNumber) {
				this.refs.mobile_num.value = phoneNumber;
			} else {
				this.refs.mobile_num.focus();
			}
		},
		render: function render() {
			return React.createElement(
				'div',
				{ className: 'gg-body' },
				React.createElement(Header, { right: null }),
				React.createElement(
					'div',
					{ className: 'g-main g-main-1' },
					React.createElement(
						'div',
						{ className: 'g-scroll m-balance' },
						React.createElement(
							'div',
							{ className: 'u-balance f-tl' },
							React.createElement(
								'h5',
								{ className: 'tipTitle f-mb5' },
								'充值订单'
							),
							React.createElement(
								'p',
								{ className: 'f-fc-777' },
								'充值艾豆：',
								this.state.aidou,
								'艾豆'
							),
							React.createElement(
								'p',
								{ className: 'f-fc-777' },
								'支付金额：',
								this.state.sum,
								'元'
							)
						),
						React.createElement('div', { className: 'u-divider' }),
						React.createElement(
							'div',
							{ className: 'm-registerblock' },
							React.createElement(
								'form',
								{ className: 'u-registerform u-userform' },
								React.createElement(
									'p',
									{ className: 'formTitle f-fc-777' },
									'仅支持中国移动手机用户'
								),
								React.createElement(
									'div',
									{ className: 'u-inputline' },
									React.createElement('input', { className: 'u-input', placeholder: '手机号', type: 'tel', ref: 'mobile_num' })
								),
								React.createElement(
									'div',
									{ className: 'u-inputline f-clearfix' },
									React.createElement(
										'div',
										{ className: 'u-inputc f-fl' },
										React.createElement('input', { className: 'u-input', placeholder: '验证码', type: 'tel', ref: 'key' })
									),
									React.createElement(
										'div',
										{ className: 'u-buttonc f-fl' },
										React.createElement(
											'a',
											{ className: "u-btn u-btn-full" + (this.state.s ? ' u-btn-disabled' : ''), type: 'button', onClick: this.getCode },
											this.state.s && '重新获取(' + this.state.s + ')' || '获取验证码'
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'u-inputline' },
									React.createElement(
										'a',
										{ className: 'u-btn u-btn-full', onClick: this.handleSubmit },
										'确认充值'
									)
								)
							)
						),
						React.createElement(PayTips, null)
					)
				),
				this.props.children
			);
		}
	});

	module.exports = Recharge;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6), __webpack_require__(5), __webpack_require__(7)))

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, myEvent, GLOBAL) {'use strict';

	var Header = __webpack_require__(25);
	if (typeof window !== 'undefined') {
		__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../css/pay.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	}

	var RechageRes = React.createClass({
		displayName: 'RechageRes',

		completed: function completed() {
			console.log(myEvent.callback);
			if (myEvent.callback.recharge) {
				myEvent.execCallback('recharge');
			} else {
				myEvent.execCallback('rechargeDef');
			}
		},
		render: function render() {
			var data = this.props.data;
			data.time = new Date().Format('yyyy-MM-dd hh:mm:ss');
			var title, note, content;
			if (data.code === 200) {
				title = '充值成功';
				note = '若您收到来自运营商的扣费短信，即为本商品支付成功通知。如有疑问，请致电客服：4009679897';
				content = React.createElement(
					'table',
					{ className: 'result-suc f-fc-777', border: '0', cellSpacing: '0', cellPadding: '0', width: '100%' },
					React.createElement(
						'tbody',
						null,
						React.createElement(
							'tr',
							null,
							React.createElement(
								'td',
								{ width: '100' },
								'充值艾豆'
							),
							React.createElement(
								'td',
								{ className: 'f-tr' },
								data.aidou,
								'艾豆'
							)
						),
						React.createElement(
							'tr',
							null,
							React.createElement(
								'td',
								{ width: '100' },
								'充值金额'
							),
							React.createElement(
								'td',
								{ className: 'f-tr' },
								data.sum,
								'元'
							)
						),
						React.createElement(
							'tr',
							null,
							React.createElement(
								'td',
								{ width: '100' },
								'充值时间'
							),
							React.createElement(
								'td',
								{ className: 'f-tr' },
								data.time
							)
						),
						React.createElement(
							'tr',
							null,
							React.createElement(
								'td',
								{ width: '100' },
								'支付号码'
							),
							React.createElement(
								'td',
								{ className: 'f-tr' },
								data.phone
							)
						)
					)
				);
			} else {
				title = '充值失败';
				note = '未能成功支付，建议您重新购买。如有疑问，请记录返回码后，请致电客服：4009679897';
				content = React.createElement(
					'div',
					{ className: 'f-clearfix result-fail' },
					React.createElement(
						'span',
						{ className: 'f-fl f-mr-10' },
						'返回码'
					),
					React.createElement(
						'span',
						{ className: 'f-fl' },
						data.code
					),
					React.createElement(
						'button',
						{ className: 'f-fr u-btn', onClick: GLOBAL.goBack() },
						'更换号码充值'
					)
				);
			}
			return React.createElement(
				'div',
				null,
				React.createElement(Header, { right: null }),
				React.createElement(
					'div',
					{ className: 'g-main g-main-1' },
					React.createElement(
						'div',
						{ className: 'g-scroll m-recharge' },
						React.createElement(
							'div',
							{ className: 'f-p-15 f-bg-fff' },
							React.createElement(
								'h2',
								{ className: 'title' },
								title
							),
							content
						),
						React.createElement(
							'div',
							{ className: 'f-p-15' },
							React.createElement(
								'p',
								{ className: 'result-note f-fc-777' },
								note
							),
							React.createElement(
								'button',
								{ className: 'u-btn u-btn-full', onClick: this.completed },
								'完成'
							)
						)
					)
				)
			);
		}
	});

	module.exports = RechageRes;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(15), __webpack_require__(6)))

/***/ },
/* 60 */,
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, AJAX, GLOBAL, Loading, NoData) {'use strict';

	var Header = __webpack_require__(25);
	//var Block7 = require('./block7');
	var Book1 = __webpack_require__(33);
	var Mixins = __webpack_require__(14);
	if (typeof window !== 'undefined') {
		__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../css/bookSheet.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	}

	var Module = React.createClass({
		displayName: 'Module',

		mixins: [Mixins()],
		getList: function getList() {
			AJAX.init(this.props.params.param);
			AJAX.get(function (data) {
				GLOBAL.title = data.sheet_name;
				if (!data.content) {
					return;
				}
				if (!data.content.length) {
					this.setState({
						noMore: true
					});
					return;
				}
				if (this.state.scrollUpdate) {
					data.content = this.state.data.content.concat(data.content);
				}
				this.setState({
					data: data,
					collected: +data.collection,
					scrollUpdate: false
				});
				//设置GLOBAL book name
				GLOBAL.setBookName(data.content);
			}.bind(this), function (error) {
				if (this.state.scrollUpdate) {
					this.setState({
						scrollUpdate: false,
						noMore: true
					});
					return;
				}
				this.setState({
					UFO: true
				});
				//console.log(error);
			}.bind(this));
		},
		addFavaHandle: function addFavaHandle() {
			var that = this;
			if (!this.isLogin()) {
				this.goLogin(goadd);
				return;
			}
			goadd();
			function goadd() {
				if (!that.state.collected) {
					goAjax('collectionAdd');
				} else {
					goAjax('collectionDelete');
				}
			}
			function goAjax(which) {
				AJAX.go(which, { sheet_id: that.state.data.sheet_id }, function () {
					that.setState({
						collected: which === 'collectionAdd'
					});
				}, null, 'collection');
			}
		},
		getInitialState: function getInitialState() {
			return {
				noMore: false,
				data: null,
				collected: false,
				scrollUpdate: false,
				UFO: false
			};
		},
		componentDidMount: function componentDidMount() {
			this.getList();
		},
		componentDidUpdate: function componentDidUpdate() {
			this.lazyloadImage(this.refs.container);
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.state.data !== nextState.data || this.state.collected !== nextState.collected || this.state.scrollUpdate !== nextState.scrollUpdate || this.state.UFO !== nextState.UFO || this.state.noMore !== nextState.noMore || this.props.children !== nextProps.children;
		},
		render: function render() {
			var noData, content, sLoading;
			var _spm = [GLOBAL.pgid, this.APIParts()[1], 1, 0];
			//定义content
			//console.log(this.state.noMore,this.state.scrollUpdate)
			if (!this.state.data) {
				content = React.createElement(Loading, null);
			} else {
				//var m_time = this.state.data.modify_time.substr(0,4)+'.'+this.state.data.modify_time.substr(4,2)+'.'+this.state.data.modify_time.substr(6,2);
				if (!this.state.data.content.length) {
					noData = React.createElement(
						'div',
						{ className: 'g-main g-main-1' },
						React.createElement(NoData, null)
					);
					content = null;
				} else {
					sLoading = this.state.noMore ? null : React.createElement(Loading, { cls: 'u-sLoading' });
					content = React.createElement(
						'div',
						null,
						React.createElement(
							'section',
							{ className: 'm-block' },
							React.createElement(
								'div',
								{ className: 'content' },
								React.createElement(
									'div',
									{ className: 'bsHead f-bb-eee' },
									React.createElement(
										'h2',
										null,
										this.state.data.sheet_name
									),
									React.createElement(
										'p',
										{ className: 'f-fs-14 f-mb-15' },
										'共计',
										this.state.data.content_cnt,
										'本'
									),
									React.createElement(
										'p',
										null,
										React.createElement('input', { className: "u-btn2 f-fs-14 f-mb-30 " + (this.state.collected ? "u-btn2-on" : ""), type: 'button', value: this.state.collected ? "已收藏" : "收藏", onClick: this.addFavaHandle })
									),
									React.createElement(
										'p',
										{ className: 'f-clearfix' },
										React.createElement(
											'span',
											{ className: 'f-fl f-fc-777' },
											'已有',
											this.state.data.collect_uv,
											'人收藏'
										),
										React.createElement(
											'span',
											{ className: 'f-fr f-fc-777' },
											'更新于',
											this.state.data.update_time
										)
									)
								),
								React.createElement(
									'p',
									{ className: 'bsBrief' },
									this.state.data.sheet_brief
								)
							)
						),
						React.createElement(
							'section',
							{ className: 'm-block' },
							React.createElement(
								'div',
								{ className: 'content' },
								React.createElement(
									'ul',
									{ className: 'bsList' },
									this.state.data.content.map(function (v, i) {
										;
										return React.createElement(Book1, { key: i, data: v });
									}.bind(this))
								)
							),
							sLoading
						)
					);
				}
			}
			if (this.state.UFO) {
				noData = React.createElement(
					'div',
					{ className: 'g-main g-main-1' },
					React.createElement(NoData, { type: 'UFO' })
				);
				content = null;
			}
			return React.createElement(
				'div',
				{ className: 'gg-body' },
				React.createElement(Header, null),
				React.createElement(
					'div',
					{ className: 'g-main g-main-1' },
					React.createElement(
						'div',
						{ className: 'g-scroll', ref: 'container', onScroll: this.scrollHandle },
						content
					)
				),
				noData,
				this.props.children
			);
		}
	});

	module.exports = Module;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(5), __webpack_require__(6), __webpack_require__(23), __webpack_require__(24)))

/***/ },
/* 62 */,
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, AJAX, myEvent) {'use strict';

	var Header = __webpack_require__(25);
	if (typeof window !== 'undefined') {
		var POP = __webpack_require__(9);
		__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../css/tag.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	}

	var tag = React.createClass({
		displayName: 'tag',

		getInitialState: function getInitialState() {
			return {
				tagList: [],
				myTagList: [],
				needUpdate: 0
			};
		},
		getData: function getData() {
			var that = this;
			AJAX.init('listTag');
			AJAX.get(function (data) {
				that.setState({
					tagList: data.noChoice,
					myTagList: data.selected,
					needUpdate: that.state.needUpdate + 1
				});
			});
		},
		componentDidMount: function componentDidMount() {
			this.getData();
		},
		toggleTag: function toggleTag(index, from, to) {
			to.push(from.splice(index, 1)[0]);
			this.setState({
				needUpdate: this.state.needUpdate + 1
			});
		},
		addTag: function addTag(e) {
			var index = e.target.getAttribute('data-index');
			if (this.state.myTagList.length >= 10) {
				return POP.alert('最多选择10个标签');
			}
			AJAX.go('addTag', {
				id: this.state.tagList[index].category_id
			}, function () {
				this.toggleTag(index, this.state.tagList, this.state.myTagList);
			}.bind(this));
		},
		removeTag: function removeTag(e) {
			var index = e.target.getAttribute('data-index');
			AJAX.go('deleteTag', {
				id: this.state.myTagList[index].category_id
			}, function () {
				this.toggleTag(index, this.state.myTagList, this.state.tagList);
			}.bind(this));
		},
		componentWillUnmount: function componentWillUnmount() {
			myEvent.execCallback('configTag');
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextPros, nextState) {
			return this.state.needUpdate !== nextState.needUpdate;
		},
		render: function render() {
			var tips;
			if (!this.state.myTagList.length) {
				tips = React.createElement(
					'span',
					{ className: 'tips' },
					'点击下方选择您喜欢的标签~'
				);
			}
			return React.createElement(
				'div',
				{ className: 'gg-body' },
				React.createElement(
					'div',
					{ className: 'tags-block' },
					React.createElement(Header, { right: false }),
					React.createElement(
						'div',
						{ className: 'g-main g-main-1' },
						React.createElement(
							'div',
							{ className: 'g-scroll' },
							React.createElement(
								'div',
								{ className: 'tag-block' },
								React.createElement(
									'div',
									{ className: 'title' },
									'我的标签'
								),
								React.createElement(
									'div',
									{ className: 'content f-clearfix' },
									tips,
									this.state.myTagList.map(function (tag, i) {
										return React.createElement(
											'span',
											{ className: 'tag selected f-fl', key: i, onClick: this.removeTag, 'data-index': i },
											tag.category_name
										);
									}.bind(this))
								)
							),
							React.createElement(
								'div',
								{ className: 'tag-block' },
								React.createElement(
									'div',
									{ className: 'title' },
									'可选择的标签'
								),
								React.createElement(
									'div',
									{ className: 'content f-clearfix' },
									this.state.tagList.map(function (tag, i) {
										return React.createElement(
											'span',
											{ className: 'tag f-fl', key: i, onClick: this.addTag, 'data-index': i },
											tag.category_name
										);
									}.bind(this))
								)
							)
						)
					)
				)
			);
		}
	});

	module.exports = tag;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(5), __webpack_require__(15)))

/***/ },
/* 64 */,
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, AJAX, storage, browserHistory, Loading) {'use strict';

	var Header = __webpack_require__(25);
	var Mixins = __webpack_require__(14);
	var Book9 = __webpack_require__(66);
	var NoData = __webpack_require__(24);

	if (typeof window !== 'undefined') {
		__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../css/recentRead.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
		var POP = __webpack_require__(9);
		var Hammer = __webpack_require__(68);
	}

	var recentRead = React.createClass({
		displayName: 'recentRead',

		mixins: [Mixins()],
		getInitialState: function getInitialState() {
			return {
				list: null,
				scrollUpdate: false,
				noMore: false
			};
		},

		componentDidMount: function componentDidMount() {
			this.getList();
			this.lazyloadImage(this.refs.container);
			var that = this;
			var hammertime = new Hammer(this.refs.container);
			hammertime.on('press', function (e) {
				var bid = e.target.getAttribute('data-bid');
				if (!bid) {
					return;
				}
				POP._confirm('删除记录', confirm_c, null, e.target.getBoundingClientRect().top + e.target.offsetHeight / 2);
				function confirm_c() {
					var ui_callback = function ui_callback() {
						for (var i = 0; i < that.state.list.length; i++) {
							if (that.state.list[i].content_id == bid) {
								that.state.list.splice(i, 1);
								that.setState({
									list: that.state.list
								});
								break;
							}
						}
					};
					if (that.isLogin()) {
						AJAX.go('deleteRecentRead', {
							book_id: bid
						}, ui_callback);
					} else {
						var readLog = storage.get('readLogNew');
						for (var content_id in readLog) {
							if (content_id == bid) {
								delete readLog[content_id];
							}
						}
						storage.set('readLogNew', readLog);
						ui_callback();
					}
				}
			}).on('tap', function (e) {
				var href = e.target.getAttribute('data-href');
				if (!href) {
					return;
				}
				browserHistory.push(href);
			});
		},
		getList: function getList(scrollUpdate) {
			if (this.isLogin()) {
				var that = this;
				that.setState({
					scrollUpdate: true
				});
				AJAX.init(this.props.route.path);
				if (scrollUpdate) {
					var n = AJAX.API._param['pages'] ? 'pages' : 'page';
					AJAX.API._param[n]++;
				}

				AJAX.get(function (data) {
					if (data.content.length < 10) {
						that.setState({
							noMore: true,
							scrollUpdate: false
						});
					}
					if (that.state.list) {
						data.content = that.state.list.concat(data.content);
					}
					that.setState({
						list: data.content
					});
				});
			} else {
				var readLog = storage.get('readLogNew');
				var list = [];
				for (var n in readLog) {
					list.push(readLog[n]);
				}
				list.sort(function (a, b) {
					return a.recent_time < b.recent_time ? 1 : -1;
				});
				this.setState({
					list: list,
					noMore: true
				});
			}
		},
		componentDidUpdate: function componentDidUpdate() {
			this.lazyloadImage(this.refs.container);
		},
		render: function render() {
			var content;
			if (!this.state.list) {
				content = React.createElement(Loading, null);
			} else if (this.state.list.length) {
				content = React.createElement(
					'ul',
					null,
					this.state.list.map(function (book, i) {
						return React.createElement(Book9, { book: book, key: i });
					})
				);
			} else {
				content = React.createElement(NoData, { type: 'recentRead' });
			}
			return React.createElement(
				'div',
				{ className: 'gg-body' },
				React.createElement(
					'div',
					{ className: 'recentRead-block' },
					React.createElement(Header, { right: false }),
					React.createElement(
						'div',
						{ className: 'g-main g-main-1' },
						React.createElement(
							'div',
							{ className: 'g-scroll', ref: 'container', onScroll: this.scrollHandle },
							content
						)
					)
				),
				this.props.children
			);
		}
	});

	module.exports = recentRead;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(5), __webpack_require__(8), __webpack_require__(7), __webpack_require__(23)))

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL) {'use strict';

	var Img = __webpack_require__(27);

	var Book9 = React.createClass({
		displayName: 'Book9',

		prettyDate: function prettyDate(date) {
			var d = new Date(date);
			var current = new Date();
			var deltaSecond = (current.getTime() - d.getTime()) / 1000;

			if (new Date(current.getTime() - 24 * 60 * 60 * 1000).Format('yyyyMd') == d.Format('yyyyMd')) {
				return '昨天';
			}

			if (deltaSecond < 15 * 60) {
				return '刚刚';
			}
			if (deltaSecond < 60 * 60) {
				return Math.floor(deltaSecond / 60) + '分钟前';
			}
			if (deltaSecond < 24 * 60 * 60) {
				return Math.floor(deltaSecond / 60 / 60) + '小时前';
			}
			return date;
		},
		render: function render() {
			var href = 'reading/crossDomain.' + this.props.book.source_bid + '.' + this.props.book.chapter_id + '.' + this.props.book.content_id + '.' + this.props.book.source_id;
			return React.createElement(
				'li',
				{ className: 'u-book-9', 'data-bid': this.props.book.content_id, 'data-href': GLOBAL.setHref(href) },
				React.createElement(
					'a',
					{ className: 'f-clearfix' },
					React.createElement(
						'div',
						{ className: 'f-fl' },
						React.createElement(Img, { src: this.props.book.big_coverlogo })
					),
					React.createElement(
						'div',
						{ className: 'info' },
						React.createElement(
							'div',
							{ className: 'f-ellipsis-2 name' },
							this.props.book.name
						),
						React.createElement(
							'div',
							{ className: 'author' },
							this.props.book.author
						),
						React.createElement(
							'div',
							{ className: 'f-ellipsis-2 chapter-name' },
							this.props.book.chapter_name
						),
						React.createElement(
							'div',
							{ className: 'date' },
							this.prettyDate(this.props.book.recent_time)
						)
					)
				)
			);
		}
	});

	module.exports = Book9;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6)))

/***/ },
/* 67 */,
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/*! Hammer.JS - v2.0.4 - 2014-09-28
	 * http://hammerjs.github.io/
	 *
	 * Copyright (c) 2014 Jorik Tangelder;
	 * Licensed under the MIT license */
	!function (a, b, c, d) {
	  "use strict";
	  function e(a, b, c) {
	    return setTimeout(k(a, c), b);
	  }function f(a, b, c) {
	    return Array.isArray(a) ? (g(a, c[b], c), !0) : !1;
	  }function g(a, b, c) {
	    var e;if (a) if (a.forEach) a.forEach(b, c);else if (a.length !== d) for (e = 0; e < a.length;) {
	      b.call(c, a[e], e, a), e++;
	    } else for (e in a) {
	      a.hasOwnProperty(e) && b.call(c, a[e], e, a);
	    }
	  }function h(a, b, c) {
	    for (var e = Object.keys(b), f = 0; f < e.length;) {
	      (!c || c && a[e[f]] === d) && (a[e[f]] = b[e[f]]), f++;
	    }return a;
	  }function i(a, b) {
	    return h(a, b, !0);
	  }function j(a, b, c) {
	    var d,
	        e = b.prototype;d = a.prototype = Object.create(e), d.constructor = a, d._super = e, c && h(d, c);
	  }function k(a, b) {
	    return function () {
	      return a.apply(b, arguments);
	    };
	  }function l(a, b) {
	    return (typeof a === "undefined" ? "undefined" : _typeof(a)) == kb ? a.apply(b ? b[0] || d : d, b) : a;
	  }function m(a, b) {
	    return a === d ? b : a;
	  }function n(a, b, c) {
	    g(r(b), function (b) {
	      a.addEventListener(b, c, !1);
	    });
	  }function o(a, b, c) {
	    g(r(b), function (b) {
	      a.removeEventListener(b, c, !1);
	    });
	  }function p(a, b) {
	    for (; a;) {
	      if (a == b) return !0;a = a.parentNode;
	    }return !1;
	  }function q(a, b) {
	    return a.indexOf(b) > -1;
	  }function r(a) {
	    return a.trim().split(/\s+/g);
	  }function s(a, b, c) {
	    if (a.indexOf && !c) return a.indexOf(b);for (var d = 0; d < a.length;) {
	      if (c && a[d][c] == b || !c && a[d] === b) return d;d++;
	    }return -1;
	  }function t(a) {
	    return Array.prototype.slice.call(a, 0);
	  }function u(a, b, c) {
	    for (var d = [], e = [], f = 0; f < a.length;) {
	      var g = b ? a[f][b] : a[f];s(e, g) < 0 && d.push(a[f]), e[f] = g, f++;
	    }return c && (d = b ? d.sort(function (a, c) {
	      return a[b] > c[b];
	    }) : d.sort()), d;
	  }function v(a, b) {
	    for (var c, e, f = b[0].toUpperCase() + b.slice(1), g = 0; g < ib.length;) {
	      if (c = ib[g], e = c ? c + f : b, e in a) return e;g++;
	    }return d;
	  }function w() {
	    return ob++;
	  }function x(a) {
	    var b = a.ownerDocument;return b.defaultView || b.parentWindow;
	  }function y(a, b) {
	    var c = this;this.manager = a, this.callback = b, this.element = a.element, this.target = a.options.inputTarget, this.domHandler = function (b) {
	      l(a.options.enable, [a]) && c.handler(b);
	    }, this.init();
	  }function z(a) {
	    var b,
	        c = a.options.inputClass;return new (b = c ? c : rb ? N : sb ? Q : qb ? S : M)(a, A);
	  }function A(a, b, c) {
	    var d = c.pointers.length,
	        e = c.changedPointers.length,
	        f = b & yb && d - e === 0,
	        g = b & (Ab | Bb) && d - e === 0;c.isFirst = !!f, c.isFinal = !!g, f && (a.session = {}), c.eventType = b, B(a, c), a.emit("hammer.input", c), a.recognize(c), a.session.prevInput = c;
	  }function B(a, b) {
	    var c = a.session,
	        d = b.pointers,
	        e = d.length;c.firstInput || (c.firstInput = E(b)), e > 1 && !c.firstMultiple ? c.firstMultiple = E(b) : 1 === e && (c.firstMultiple = !1);var f = c.firstInput,
	        g = c.firstMultiple,
	        h = g ? g.center : f.center,
	        i = b.center = F(d);b.timeStamp = nb(), b.deltaTime = b.timeStamp - f.timeStamp, b.angle = J(h, i), b.distance = I(h, i), C(c, b), b.offsetDirection = H(b.deltaX, b.deltaY), b.scale = g ? L(g.pointers, d) : 1, b.rotation = g ? K(g.pointers, d) : 0, D(c, b);var j = a.element;p(b.srcEvent.target, j) && (j = b.srcEvent.target), b.target = j;
	  }function C(a, b) {
	    var c = b.center,
	        d = a.offsetDelta || {},
	        e = a.prevDelta || {},
	        f = a.prevInput || {};(b.eventType === yb || f.eventType === Ab) && (e = a.prevDelta = { x: f.deltaX || 0, y: f.deltaY || 0 }, d = a.offsetDelta = { x: c.x, y: c.y }), b.deltaX = e.x + (c.x - d.x), b.deltaY = e.y + (c.y - d.y);
	  }function D(a, b) {
	    var c,
	        e,
	        f,
	        g,
	        h = a.lastInterval || b,
	        i = b.timeStamp - h.timeStamp;if (b.eventType != Bb && (i > xb || h.velocity === d)) {
	      var j = h.deltaX - b.deltaX,
	          k = h.deltaY - b.deltaY,
	          l = G(i, j, k);e = l.x, f = l.y, c = mb(l.x) > mb(l.y) ? l.x : l.y, g = H(j, k), a.lastInterval = b;
	    } else c = h.velocity, e = h.velocityX, f = h.velocityY, g = h.direction;b.velocity = c, b.velocityX = e, b.velocityY = f, b.direction = g;
	  }function E(a) {
	    for (var b = [], c = 0; c < a.pointers.length;) {
	      b[c] = { clientX: lb(a.pointers[c].clientX), clientY: lb(a.pointers[c].clientY) }, c++;
	    }return { timeStamp: nb(), pointers: b, center: F(b), deltaX: a.deltaX, deltaY: a.deltaY };
	  }function F(a) {
	    var b = a.length;if (1 === b) return { x: lb(a[0].clientX), y: lb(a[0].clientY) };for (var c = 0, d = 0, e = 0; b > e;) {
	      c += a[e].clientX, d += a[e].clientY, e++;
	    }return { x: lb(c / b), y: lb(d / b) };
	  }function G(a, b, c) {
	    return { x: b / a || 0, y: c / a || 0 };
	  }function H(a, b) {
	    return a === b ? Cb : mb(a) >= mb(b) ? a > 0 ? Db : Eb : b > 0 ? Fb : Gb;
	  }function I(a, b, c) {
	    c || (c = Kb);var d = b[c[0]] - a[c[0]],
	        e = b[c[1]] - a[c[1]];return Math.sqrt(d * d + e * e);
	  }function J(a, b, c) {
	    c || (c = Kb);var d = b[c[0]] - a[c[0]],
	        e = b[c[1]] - a[c[1]];return 180 * Math.atan2(e, d) / Math.PI;
	  }function K(a, b) {
	    return J(b[1], b[0], Lb) - J(a[1], a[0], Lb);
	  }function L(a, b) {
	    return I(b[0], b[1], Lb) / I(a[0], a[1], Lb);
	  }function M() {
	    this.evEl = Nb, this.evWin = Ob, this.allow = !0, this.pressed = !1, y.apply(this, arguments);
	  }function N() {
	    this.evEl = Rb, this.evWin = Sb, y.apply(this, arguments), this.store = this.manager.session.pointerEvents = [];
	  }function O() {
	    this.evTarget = Ub, this.evWin = Vb, this.started = !1, y.apply(this, arguments);
	  }function P(a, b) {
	    var c = t(a.touches),
	        d = t(a.changedTouches);return b & (Ab | Bb) && (c = u(c.concat(d), "identifier", !0)), [c, d];
	  }function Q() {
	    this.evTarget = Xb, this.targetIds = {}, y.apply(this, arguments);
	  }function R(a, b) {
	    var c = t(a.touches),
	        d = this.targetIds;if (b & (yb | zb) && 1 === c.length) return d[c[0].identifier] = !0, [c, c];var e,
	        f,
	        g = t(a.changedTouches),
	        h = [],
	        i = this.target;if (f = c.filter(function (a) {
	      return p(a.target, i);
	    }), b === yb) for (e = 0; e < f.length;) {
	      d[f[e].identifier] = !0, e++;
	    }for (e = 0; e < g.length;) {
	      d[g[e].identifier] && h.push(g[e]), b & (Ab | Bb) && delete d[g[e].identifier], e++;
	    }return h.length ? [u(f.concat(h), "identifier", !0), h] : void 0;
	  }function S() {
	    y.apply(this, arguments);var a = k(this.handler, this);this.touch = new Q(this.manager, a), this.mouse = new M(this.manager, a);
	  }function T(a, b) {
	    this.manager = a, this.set(b);
	  }function U(a) {
	    if (q(a, bc)) return bc;var b = q(a, cc),
	        c = q(a, dc);return b && c ? cc + " " + dc : b || c ? b ? cc : dc : q(a, ac) ? ac : _b;
	  }function V(a) {
	    this.id = w(), this.manager = null, this.options = i(a || {}, this.defaults), this.options.enable = m(this.options.enable, !0), this.state = ec, this.simultaneous = {}, this.requireFail = [];
	  }function W(a) {
	    return a & jc ? "cancel" : a & hc ? "end" : a & gc ? "move" : a & fc ? "start" : "";
	  }function X(a) {
	    return a == Gb ? "down" : a == Fb ? "up" : a == Db ? "left" : a == Eb ? "right" : "";
	  }function Y(a, b) {
	    var c = b.manager;return c ? c.get(a) : a;
	  }function Z() {
	    V.apply(this, arguments);
	  }function $() {
	    Z.apply(this, arguments), this.pX = null, this.pY = null;
	  }function _() {
	    Z.apply(this, arguments);
	  }function ab() {
	    V.apply(this, arguments), this._timer = null, this._input = null;
	  }function bb() {
	    Z.apply(this, arguments);
	  }function cb() {
	    Z.apply(this, arguments);
	  }function db() {
	    V.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0;
	  }function eb(a, b) {
	    return b = b || {}, b.recognizers = m(b.recognizers, eb.defaults.preset), new fb(a, b);
	  }function fb(a, b) {
	    b = b || {}, this.options = i(b, eb.defaults), this.options.inputTarget = this.options.inputTarget || a, this.handlers = {}, this.session = {}, this.recognizers = [], this.element = a, this.input = z(this), this.touchAction = new T(this, this.options.touchAction), gb(this, !0), g(b.recognizers, function (a) {
	      var b = this.add(new a[0](a[1]));a[2] && b.recognizeWith(a[2]), a[3] && b.requireFailure(a[3]);
	    }, this);
	  }function gb(a, b) {
	    var c = a.element;g(a.options.cssProps, function (a, d) {
	      c.style[v(c.style, d)] = b ? a : "";
	    });
	  }function hb(a, c) {
	    var d = b.createEvent("Event");d.initEvent(a, !0, !0), d.gesture = c, c.target.dispatchEvent(d);
	  }var ib = ["", "webkit", "moz", "MS", "ms", "o"],
	      jb = b.createElement("div"),
	      kb = "function",
	      lb = Math.round,
	      mb = Math.abs,
	      nb = Date.now,
	      ob = 1,
	      pb = /mobile|tablet|ip(ad|hone|od)|android/i,
	      qb = "ontouchstart" in a,
	      rb = v(a, "PointerEvent") !== d,
	      sb = qb && pb.test(navigator.userAgent),
	      tb = "touch",
	      ub = "pen",
	      vb = "mouse",
	      wb = "kinect",
	      xb = 25,
	      yb = 1,
	      zb = 2,
	      Ab = 4,
	      Bb = 8,
	      Cb = 1,
	      Db = 2,
	      Eb = 4,
	      Fb = 8,
	      Gb = 16,
	      Hb = Db | Eb,
	      Ib = Fb | Gb,
	      Jb = Hb | Ib,
	      Kb = ["x", "y"],
	      Lb = ["clientX", "clientY"];y.prototype = { handler: function handler() {}, init: function init() {
	      this.evEl && n(this.element, this.evEl, this.domHandler), this.evTarget && n(this.target, this.evTarget, this.domHandler), this.evWin && n(x(this.element), this.evWin, this.domHandler);
	    }, destroy: function destroy() {
	      this.evEl && o(this.element, this.evEl, this.domHandler), this.evTarget && o(this.target, this.evTarget, this.domHandler), this.evWin && o(x(this.element), this.evWin, this.domHandler);
	    } };var Mb = { mousedown: yb, mousemove: zb, mouseup: Ab },
	      Nb = "mousedown",
	      Ob = "mousemove mouseup";j(M, y, { handler: function handler(a) {
	      var b = Mb[a.type];b & yb && 0 === a.button && (this.pressed = !0), b & zb && 1 !== a.which && (b = Ab), this.pressed && this.allow && (b & Ab && (this.pressed = !1), this.callback(this.manager, b, { pointers: [a], changedPointers: [a], pointerType: vb, srcEvent: a }));
	    } });var Pb = { pointerdown: yb, pointermove: zb, pointerup: Ab, pointercancel: Bb, pointerout: Bb },
	      Qb = { 2: tb, 3: ub, 4: vb, 5: wb },
	      Rb = "pointerdown",
	      Sb = "pointermove pointerup pointercancel";a.MSPointerEvent && (Rb = "MSPointerDown", Sb = "MSPointerMove MSPointerUp MSPointerCancel"), j(N, y, { handler: function handler(a) {
	      var b = this.store,
	          c = !1,
	          d = a.type.toLowerCase().replace("ms", ""),
	          e = Pb[d],
	          f = Qb[a.pointerType] || a.pointerType,
	          g = f == tb,
	          h = s(b, a.pointerId, "pointerId");e & yb && (0 === a.button || g) ? 0 > h && (b.push(a), h = b.length - 1) : e & (Ab | Bb) && (c = !0), 0 > h || (b[h] = a, this.callback(this.manager, e, { pointers: b, changedPointers: [a], pointerType: f, srcEvent: a }), c && b.splice(h, 1));
	    } });var Tb = { touchstart: yb, touchmove: zb, touchend: Ab, touchcancel: Bb },
	      Ub = "touchstart",
	      Vb = "touchstart touchmove touchend touchcancel";j(O, y, { handler: function handler(a) {
	      var b = Tb[a.type];if (b === yb && (this.started = !0), this.started) {
	        var c = P.call(this, a, b);b & (Ab | Bb) && c[0].length - c[1].length === 0 && (this.started = !1), this.callback(this.manager, b, { pointers: c[0], changedPointers: c[1], pointerType: tb, srcEvent: a });
	      }
	    } });var Wb = { touchstart: yb, touchmove: zb, touchend: Ab, touchcancel: Bb },
	      Xb = "touchstart touchmove touchend touchcancel";j(Q, y, { handler: function handler(a) {
	      var b = Wb[a.type],
	          c = R.call(this, a, b);c && this.callback(this.manager, b, { pointers: c[0], changedPointers: c[1], pointerType: tb, srcEvent: a });
	    } }), j(S, y, { handler: function handler(a, b, c) {
	      var d = c.pointerType == tb,
	          e = c.pointerType == vb;if (d) this.mouse.allow = !1;else if (e && !this.mouse.allow) return;b & (Ab | Bb) && (this.mouse.allow = !0), this.callback(a, b, c);
	    }, destroy: function destroy() {
	      this.touch.destroy(), this.mouse.destroy();
	    } });var Yb = v(jb.style, "touchAction"),
	      Zb = Yb !== d,
	      $b = "compute",
	      _b = "auto",
	      ac = "manipulation",
	      bc = "none",
	      cc = "pan-x",
	      dc = "pan-y";T.prototype = { set: function set(a) {
	      a == $b && (a = this.compute()), Zb && (this.manager.element.style[Yb] = a), this.actions = a.toLowerCase().trim();
	    }, update: function update() {
	      this.set(this.manager.options.touchAction);
	    }, compute: function compute() {
	      var a = [];return g(this.manager.recognizers, function (b) {
	        l(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()));
	      }), U(a.join(" "));
	    }, preventDefaults: function preventDefaults(a) {
	      if (!Zb) {
	        var b = a.srcEvent,
	            c = a.offsetDirection;if (this.manager.session.prevented) return void b.preventDefault();var d = this.actions,
	            e = q(d, bc),
	            f = q(d, dc),
	            g = q(d, cc);return e || f && c & Hb || g && c & Ib ? this.preventSrc(b) : void 0;
	      }
	    }, preventSrc: function preventSrc(a) {
	      this.manager.session.prevented = !0, a.preventDefault();
	    } };var ec = 1,
	      fc = 2,
	      gc = 4,
	      hc = 8,
	      ic = hc,
	      jc = 16,
	      kc = 32;V.prototype = { defaults: {}, set: function set(a) {
	      return h(this.options, a), this.manager && this.manager.touchAction.update(), this;
	    }, recognizeWith: function recognizeWith(a) {
	      if (f(a, "recognizeWith", this)) return this;var b = this.simultaneous;return a = Y(a, this), b[a.id] || (b[a.id] = a, a.recognizeWith(this)), this;
	    }, dropRecognizeWith: function dropRecognizeWith(a) {
	      return f(a, "dropRecognizeWith", this) ? this : (a = Y(a, this), delete this.simultaneous[a.id], this);
	    }, requireFailure: function requireFailure(a) {
	      if (f(a, "requireFailure", this)) return this;var b = this.requireFail;return a = Y(a, this), -1 === s(b, a) && (b.push(a), a.requireFailure(this)), this;
	    }, dropRequireFailure: function dropRequireFailure(a) {
	      if (f(a, "dropRequireFailure", this)) return this;a = Y(a, this);var b = s(this.requireFail, a);return b > -1 && this.requireFail.splice(b, 1), this;
	    }, hasRequireFailures: function hasRequireFailures() {
	      return this.requireFail.length > 0;
	    }, canRecognizeWith: function canRecognizeWith(a) {
	      return !!this.simultaneous[a.id];
	    }, emit: function emit(a) {
	      function b(b) {
	        c.manager.emit(c.options.event + (b ? W(d) : ""), a);
	      }var c = this,
	          d = this.state;hc > d && b(!0), b(), d >= hc && b(!0);
	    }, tryEmit: function tryEmit(a) {
	      return this.canEmit() ? this.emit(a) : void (this.state = kc);
	    }, canEmit: function canEmit() {
	      for (var a = 0; a < this.requireFail.length;) {
	        if (!(this.requireFail[a].state & (kc | ec))) return !1;a++;
	      }return !0;
	    }, recognize: function recognize(a) {
	      var b = h({}, a);return l(this.options.enable, [this, b]) ? (this.state & (ic | jc | kc) && (this.state = ec), this.state = this.process(b), void (this.state & (fc | gc | hc | jc) && this.tryEmit(b))) : (this.reset(), void (this.state = kc));
	    }, process: function process() {}, getTouchAction: function getTouchAction() {}, reset: function reset() {} }, j(Z, V, { defaults: { pointers: 1 }, attrTest: function attrTest(a) {
	      var b = this.options.pointers;return 0 === b || a.pointers.length === b;
	    }, process: function process(a) {
	      var b = this.state,
	          c = a.eventType,
	          d = b & (fc | gc),
	          e = this.attrTest(a);return d && (c & Bb || !e) ? b | jc : d || e ? c & Ab ? b | hc : b & fc ? b | gc : fc : kc;
	    } }), j($, Z, { defaults: { event: "pan", threshold: 10, pointers: 1, direction: Jb }, getTouchAction: function getTouchAction() {
	      var a = this.options.direction,
	          b = [];return a & Hb && b.push(dc), a & Ib && b.push(cc), b;
	    }, directionTest: function directionTest(a) {
	      var b = this.options,
	          c = !0,
	          d = a.distance,
	          e = a.direction,
	          f = a.deltaX,
	          g = a.deltaY;return e & b.direction || (b.direction & Hb ? (e = 0 === f ? Cb : 0 > f ? Db : Eb, c = f != this.pX, d = Math.abs(a.deltaX)) : (e = 0 === g ? Cb : 0 > g ? Fb : Gb, c = g != this.pY, d = Math.abs(a.deltaY))), a.direction = e, c && d > b.threshold && e & b.direction;
	    }, attrTest: function attrTest(a) {
	      return Z.prototype.attrTest.call(this, a) && (this.state & fc || !(this.state & fc) && this.directionTest(a));
	    }, emit: function emit(a) {
	      this.pX = a.deltaX, this.pY = a.deltaY;var b = X(a.direction);b && this.manager.emit(this.options.event + b, a), this._super.emit.call(this, a);
	    } }), j(_, Z, { defaults: { event: "pinch", threshold: 0, pointers: 2 }, getTouchAction: function getTouchAction() {
	      return [bc];
	    }, attrTest: function attrTest(a) {
	      return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & fc);
	    }, emit: function emit(a) {
	      if (this._super.emit.call(this, a), 1 !== a.scale) {
	        var b = a.scale < 1 ? "in" : "out";this.manager.emit(this.options.event + b, a);
	      }
	    } }), j(ab, V, { defaults: { event: "press", pointers: 1, time: 500, threshold: 5 }, getTouchAction: function getTouchAction() {
	      return [_b];
	    }, process: function process(a) {
	      var b = this.options,
	          c = a.pointers.length === b.pointers,
	          d = a.distance < b.threshold,
	          f = a.deltaTime > b.time;if (this._input = a, !d || !c || a.eventType & (Ab | Bb) && !f) this.reset();else if (a.eventType & yb) this.reset(), this._timer = e(function () {
	        this.state = ic, this.tryEmit();
	      }, b.time, this);else if (a.eventType & Ab) return ic;return kc;
	    }, reset: function reset() {
	      clearTimeout(this._timer);
	    }, emit: function emit(a) {
	      this.state === ic && (a && a.eventType & Ab ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = nb(), this.manager.emit(this.options.event, this._input)));
	    } }), j(bb, Z, { defaults: { event: "rotate", threshold: 0, pointers: 2 }, getTouchAction: function getTouchAction() {
	      return [bc];
	    }, attrTest: function attrTest(a) {
	      return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & fc);
	    } }), j(cb, Z, { defaults: { event: "swipe", threshold: 10, velocity: .65, direction: Hb | Ib, pointers: 1 }, getTouchAction: function getTouchAction() {
	      return $.prototype.getTouchAction.call(this);
	    }, attrTest: function attrTest(a) {
	      var b,
	          c = this.options.direction;return c & (Hb | Ib) ? b = a.velocity : c & Hb ? b = a.velocityX : c & Ib && (b = a.velocityY), this._super.attrTest.call(this, a) && c & a.direction && a.distance > this.options.threshold && mb(b) > this.options.velocity && a.eventType & Ab;
	    }, emit: function emit(a) {
	      var b = X(a.direction);b && this.manager.emit(this.options.event + b, a), this.manager.emit(this.options.event, a);
	    } }), j(db, V, { defaults: { event: "tap", pointers: 1, taps: 1, interval: 300, time: 250, threshold: 2, posThreshold: 10 }, getTouchAction: function getTouchAction() {
	      return [ac];
	    }, process: function process(a) {
	      var b = this.options,
	          c = a.pointers.length === b.pointers,
	          d = a.distance < b.threshold,
	          f = a.deltaTime < b.time;if (this.reset(), a.eventType & yb && 0 === this.count) return this.failTimeout();if (d && f && c) {
	        if (a.eventType != Ab) return this.failTimeout();var g = this.pTime ? a.timeStamp - this.pTime < b.interval : !0,
	            h = !this.pCenter || I(this.pCenter, a.center) < b.posThreshold;this.pTime = a.timeStamp, this.pCenter = a.center, h && g ? this.count += 1 : this.count = 1, this._input = a;var i = this.count % b.taps;if (0 === i) return this.hasRequireFailures() ? (this._timer = e(function () {
	          this.state = ic, this.tryEmit();
	        }, b.interval, this), fc) : ic;
	      }return kc;
	    }, failTimeout: function failTimeout() {
	      return this._timer = e(function () {
	        this.state = kc;
	      }, this.options.interval, this), kc;
	    }, reset: function reset() {
	      clearTimeout(this._timer);
	    }, emit: function emit() {
	      this.state == ic && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input));
	    } }), eb.VERSION = "2.0.4", eb.defaults = { domEvents: !1, touchAction: $b, enable: !0, inputTarget: null, inputClass: null, preset: [[bb, { enable: !1 }], [_, { enable: !1 }, ["rotate"]], [cb, { direction: Hb }], [$, { direction: Hb }, ["swipe"]], [db], [db, { event: "doubletap", taps: 2 }, ["tap"]], [ab]], cssProps: { userSelect: "none", touchSelect: "none", touchCallout: "none", contentZooming: "none", userDrag: "none", tapHighlightColor: "rgba(0,0,0,0)" } };var lc = 1,
	      mc = 2;fb.prototype = { set: function set(a) {
	      return h(this.options, a), a.touchAction && this.touchAction.update(), a.inputTarget && (this.input.destroy(), this.input.target = a.inputTarget, this.input.init()), this;
	    }, stop: function stop(a) {
	      this.session.stopped = a ? mc : lc;
	    }, recognize: function recognize(a) {
	      var b = this.session;if (!b.stopped) {
	        this.touchAction.preventDefaults(a);var c,
	            d = this.recognizers,
	            e = b.curRecognizer;(!e || e && e.state & ic) && (e = b.curRecognizer = null);for (var f = 0; f < d.length;) {
	          c = d[f], b.stopped === mc || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a), !e && c.state & (fc | gc | hc) && (e = b.curRecognizer = c), f++;
	        }
	      }
	    }, get: function get(a) {
	      if (a instanceof V) return a;for (var b = this.recognizers, c = 0; c < b.length; c++) {
	        if (b[c].options.event == a) return b[c];
	      }return null;
	    }, add: function add(a) {
	      if (f(a, "add", this)) return this;var b = this.get(a.options.event);return b && this.remove(b), this.recognizers.push(a), a.manager = this, this.touchAction.update(), a;
	    }, remove: function remove(a) {
	      if (f(a, "remove", this)) return this;var b = this.recognizers;return a = this.get(a), b.splice(s(b, a), 1), this.touchAction.update(), this;
	    }, on: function on(a, b) {
	      var c = this.handlers;return g(r(a), function (a) {
	        c[a] = c[a] || [], c[a].push(b);
	      }), this;
	    }, off: function off(a, b) {
	      var c = this.handlers;return g(r(a), function (a) {
	        b ? c[a].splice(s(c[a], b), 1) : delete c[a];
	      }), this;
	    }, emit: function emit(a, b) {
	      this.options.domEvents && hb(a, b);var c = this.handlers[a] && this.handlers[a].slice();if (c && c.length) {
	        b.type = a, b.preventDefault = function () {
	          b.srcEvent.preventDefault();
	        };for (var d = 0; d < c.length;) {
	          c[d](b), d++;
	        }
	      }
	    }, destroy: function destroy() {
	      this.element && gb(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null;
	    } }, h(eb, { INPUT_START: yb, INPUT_MOVE: zb, INPUT_END: Ab, INPUT_CANCEL: Bb, STATE_POSSIBLE: ec, STATE_BEGAN: fc, STATE_CHANGED: gc, STATE_ENDED: hc, STATE_RECOGNIZED: ic, STATE_CANCELLED: jc, STATE_FAILED: kc, DIRECTION_NONE: Cb, DIRECTION_LEFT: Db, DIRECTION_RIGHT: Eb, DIRECTION_UP: Fb, DIRECTION_DOWN: Gb, DIRECTION_HORIZONTAL: Hb, DIRECTION_VERTICAL: Ib, DIRECTION_ALL: Jb, Manager: fb, Input: y, TouchAction: T, TouchInput: Q, MouseInput: M, PointerEventInput: N, TouchMouseInput: S, SingleTouchInput: O, Recognizer: V, AttrRecognizer: Z, Tap: db, Pan: $, Swipe: cb, Pinch: _, Rotate: bb, Press: ab, on: n, off: o, each: g, merge: i, extend: h, inherit: j, bindFn: k, prefixed: v }), ( false ? "undefined" : _typeof(__webpack_require__(69))) == kb && __webpack_require__(70) ? !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return eb;
	  }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "undefined" != typeof module && module.exports ? module.exports = eb : a[c] = eb;
	}(window, document, "Hammer");
	//# sourceMappingURL=hammer.min.map

/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 70 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL) {"use strict";

	var Header = __webpack_require__(25);

	var readHistory = React.createClass({
		displayName: "readHistory",

		render: function render() {
			var height = document.body.offsetHeight - 44;
			return React.createElement(
				"div",
				{ className: "gg-body" },
				React.createElement(Header, { right: null }),
				React.createElement("iframe", { src: "iframe/readHistory.html?referer=3&user_id=" + GLOBAL.cookie('userId'), className: "g-main", style: { height: height } })
			);
		}
	});

	module.exports = readHistory;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6)))

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL, AJAX) {'use strict';

	if (typeof window !== 'undefined') {
		var POP = __webpack_require__(9);
	}
	var Header = __webpack_require__(25);

	var Feedback = React.createClass({
		displayName: 'Feedback',

		componentDidMount: function componentDidMount() {
			this.refs.message.focus();
		},
		handleSubmit: function handleSubmit() {
			var message = this.refs.message.value.trim();
			var contact = this.refs.contact.value.trim();

			if (!GLOBAL.assertNotEmpty(message, '内容不能为空')) {
				return;
			}
			if (!GLOBAL.assertNotEmpty(contact, '内容不能为空')) {
				return;
			}

			AJAX.go("advice", {
				'message': message,
				'contact': contact,
				'type': 'unEncode'
			}, function (data) {
				POP._alert(data.success);
				GLOBAL.goBack();
			});
			return false;
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return false;
		},
		render: function render() {
			return React.createElement(
				'div',
				{ className: 'gg-body' },
				React.createElement(Header, { right: null }),
				React.createElement(
					'div',
					{ className: 'm-feedbackblock m-userblocks' },
					React.createElement(
						'form',
						{ className: 'u-feedbackform u-userform' },
						React.createElement(
							'div',
							{ className: 'u-inputline' },
							React.createElement('textarea', { className: 'u-input u-textarea', placeholder: '期待您的反馈', ref: 'message' })
						),
						React.createElement(
							'div',
							{ className: 'feedback-tips' },
							'为了提供更好的服务，请留下您的联系方式'
						),
						React.createElement(
							'div',
							{ className: 'u-inputline' },
							React.createElement('input', { className: 'u-input', placeholder: 'QQ\\邮箱\\手机号', ref: 'contact' })
						),
						React.createElement(
							'div',
							{ className: 'u-inputline' },
							React.createElement(
								'a',
								{ className: 'u-btn u-btn-full', onClick: this.handleSubmit },
								'发送'
							)
						)
					)
				)
			);
		}
	});

	module.exports = Feedback;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6), __webpack_require__(5)))

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, browserHistory) {'use strict';

	var Header = __webpack_require__(25);
	if (typeof window !== 'undefined') {
		__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../css/about.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	}
	var About = React.createClass({
		displayName: 'About',

		// shouldComponentUpdate: function(nextProps, nextState) {
		// 	return false;
		// },
		handle: function handle() {
			browserHistory.push('/user/about/compact');
		},
		render: function render() {
			return React.createElement(
				'div',
				{ className: 'gg-body' },
				React.createElement(
					'div',
					{ className: 'about-block' },
					React.createElement(Header, { right: false }),
					React.createElement(
						'i',
						{ className: 'imreadLogo' },
						React.createElement('img', { src: 'src/img/logo_180.png' })
					),
					React.createElement(
						'h1',
						{ className: 'title' },
						'艾美阅读'
					),
					React.createElement(
						'p',
						{ className: 'version' },
						'版本2.1.0'
					),
					React.createElement(
						'p',
						{ className: 'conpact' },
						React.createElement(
							'a',
							{ onClick: this.handle },
							'用户协议'
						)
					),
					React.createElement(
						'h2',
						{ className: 'desc' },
						'发现阅读之美'
					),
					React.createElement(
						'footer',
						{ className: 'footer' },
						React.createElement(
							'a',
							{ className: 'home', href: 'http://imread.com', target: '_blank' },
							React.createElement('span', { className: 'iconfont icon-arrow-right f-fr' }),
							React.createElement(
								'span',
								null,
								'官方网站'
							)
						)
					)
				),
				this.props.children
			);
		}
	});

	module.exports = About;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(7)))

/***/ },
/* 74 */,
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(AJAX, GLOBAL, browserHistory, React, Mixins, storage, myEvent, NoData) {'use strict';

	if (typeof window !== 'undefined') {
		var POP = __webpack_require__(9);
		var Hammer = __webpack_require__(68);
		var isHidden = __webpack_require__(43);
		__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../css/reading.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	}
	var Header = __webpack_require__(25);

	var Chapterlist = __webpack_require__(54);
	var readingStyle = __webpack_require__(77);
	var bookContent = __webpack_require__(78);
	var uploadLog = __webpack_require__(42);
	var Intercut = __webpack_require__(80);

	var styleMixins = {
		cloneStyle: function cloneStyle(style) {
			var cloneStyle = {};
			for (var key in style) {
				cloneStyle[key] = style[key];
			}
			return cloneStyle;
		},
		toggleNightStyle: function toggleNightStyle(e) {
			e.stopPropagation();
			var style = this.cloneStyle(this.state.style);
			style.night = +style.night ^ 1;
			this.setState({
				style: style,
				showSettingFont: false
			});
			readingStyle.set(style);
		},
		toggleSettingFont: function toggleSettingFont(e) {
			e.stopPropagation();
			this.setState({
				showSettingFont: !this.state.showSettingFont
			});
		},
		setFontBg: function setFontBg(e) {
			e.stopPropagation();
			var bg = e.target.getAttribute('data-id');
			var style = this.cloneStyle(this.state.style);
			style.bg = bg;
			style.night = 0;
			this.setState({
				style: style
			});
			readingStyle.set(style);
		},
		setFontHeight: function setFontHeight(e) {
			e.stopPropagation();
			var height = e.target.getAttribute('data-id');
			var style = this.cloneStyle(this.state.style);
			style.lineheight = height;
			this.setState({
				style: style
			});
			readingStyle.set(style);
		},
		setFontSize: function setFontSize(offset) {
			var style = this.cloneStyle(this.state.style);
			style.fontSize = Math.min(Math.max(style.fontSize + offset, 1), 5);
			this.setState({
				style: style
			});
			readingStyle.set(style);
		},
		setFontSm: function setFontSm(e) {
			e.stopPropagation();
			this.setFontSize(-1);
		},
		setFontLg: function setFontLg(e) {
			e.stopPropagation();
			this.setFontSize(1);
		},
		setFontFamily: function setFontFamily(e) {
			e.stopPropagation();
			var family = e.target.getAttribute('data-id');
			var style = this.cloneStyle(this.state.style);
			style.fontFamily = family;
			this.setState({
				style: style
			});
			readingStyle.set(style);
		}
	};

	var chapterMixins = {
		getChapterlist: function getChapterlist(next) {
			if (this.state.getChapterlistLoading) {
				return;
			}
			next = next || 0;
			if (this.state.page + next < 1 || this.state.page + next > this.state.pages) {
				return;
			}
			this.setState({
				getChapterlistLoading: true
			});
			AJAX.init('chapterlist' + this.APIParts()[3] + this.state.page_size);

			AJAX.get(function (data) {
				this.setState({
					pages: Math.ceil(+data.totalSize / this.state.page_size),
					chapterlist: data.chapterList,
					page: this.state.page + next,
					getChapterlistLoading: false
				});

				for (var i = 0; i < data.chapterList.length; i++) {
					if (data.chapterList[i].cid == this.state.chapterid && data.chapterList[i].intercut) {
						//处理插页广告
						var intercut = data.chapterList[i].intercut;
						GLOBAL.loadImage(intercut.intercut_url, function () {
							this.setState({
								intercut: intercut
							});
						}.bind(this));
					}
				}
			}.bind(this));
		},
		prevPage: function prevPage() {
			this.getChapterlist(-1);
		},
		nextPage: function nextPage() {
			this.getChapterlist(1);
		},
		prevChapter: function prevChapter() {
			if (!this.state.data.preChapterId) {
				return this.alert('已经是第一章了', -1);
			}
			this.goToChapter(this.state.data.preChapterId);
		},
		nextChapter: function nextChapter() {
			if (!this.state.data.nextChapterId) {
				return this.alert('已经是最后一章了', 1);
			}
			this.goToChapter(this.state.data.nextChapterId);
		},
		goToChapter: function goToChapter(chapterid, Offset) {
			if (!chapterid) {
				return;
			}
			browserHistory.push(window.location.pathname.replace(/reading\&crossDomain\.(\d+)\.(\d+)/, function ($1, $2, $3) {
				return 'reading/crossDomain.' + $2 + '.' + chapterid;
			}.bind(this)));
		},
		handleClickChapter: function handleClickChapter(e) {
			this.goToChapter(e.target.getAttribute('data-cid'));
		}
	};

	var Reading = React.createClass({
		displayName: 'Reading',

		bookmarkFlag: true,
		isOnShelf: true,
		chargeMode: 1,
		chapterCount: '1',
		mixins: [styleMixins, chapterMixins, Mixins()],
		getInitialState: function getInitialState() {
			return {
				time: Date.now(),
				bookName: '艾美阅读',
				chapterName: '',
				style: readingStyle.get(),
				data: null,
				loading: true,
				getChapterlistLoading: false,
				page: 1,
				pages: 1,
				page_size: 20,
				vt: 9,
				bid: this.APIParts()[1],
				chapterid: this.APIParts()[2],
				source_id: this.APIParts()[4],
				showSetting: false,
				showChapterlist: false,
				showSettingFont: false,
				chapterlist: [],
				showGuide: false,
				UFO: false,
				order: false,
				intercutList: false, //呼出页广告
				showIntercut: false, //是否显示呼出页广告
				intercut: false //插页广告
			};
		},
		cacheReadLog: function cacheReadLog(readLog) {
			var scrollarea = this.refs.scrollarea;
			if (!scrollarea) {
				return;
			}
			var bookIntroduce = {};
			var readLogs = storage.get('readLogNew');
			var books = storage.get('bookIntroduce', 'array');
			for (var i = 0; i < books.length; i++) {
				if (books[i].bid == readLog.content_id) {
					bookIntroduce = books[i];
					break;
				}
			}
			readLog.name = bookIntroduce.book_name;
			readLog.author = bookIntroduce.author;
			readLog.big_coverlogo = bookIntroduce.big_coverlogo;
			readLog.recent_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
			readLog.source_bid = this.state.bid;
			readLog.source_id = this.state.source_id;
			readLog.chapter_id = this.state.chapterid;
			readLog.offset = {};
			readLog.offset[this.state.chapterid] = scrollarea.scrollTop;
			readLogs[readLog.content_id] = readLog;
			storage.set('readLogNew', readLogs);
		},
		addRecentRead: function addRecentRead(bid, chapterid) {
			if (!this.state.data) {
				return;
			}
			var readLog = [{
				content_id: bid,
				current_chapterid: chapterid,
				current_time: new Date().Format('yyyyMMddhhmmss'),
				chapter_offset: 0,
				read_time: new Date().Format('yyyyMMddhhmmss'),
				chapter_name: this.state.data.name,
				chapter_read_time: Date.now() - this.time,
				playorder: this.state.data.chapterSort
			}];
			if (this.isLogin()) {
				uploadLog.readlog('read', { readLog: JSON.stringify(readLog) });
				//AJAX.getJSON('POST', '/api/upload/log', {readLog:JSON.stringify(readLog)}, function(data) {}, GLOBAL.noop);
			}

			this.cacheReadLog(readLog[0]);
			this.time = Date.now();
			myEvent.execCallback('reading' + bid, true);
			myEvent.execCallback('reading' + bid + '-fromReading', true);
		},
		componentWillUnmount: function componentWillUnmount() {
			uploadLog.sending('intercut');
			this.addRecentRead(this.props.localid, this.state.chapterid);
			document.removeEventListener && document.removeEventListener('visibilitychange', this.onVisibilitychange);
		},
		goOut: function goOut(e) {
			var addShelf = function () {
				var param = [{
					bookId: this.APIParts()[3],
					type: 3,
					time: new Date().getTime(),
					chapter_id: this.state.chapterid,
					chapter_offset: 0
				}];
				this.shelfAdding(param, function () {
					myEvent.execCallback('updateShelfBtn');
					GLOBAL.goBack();
				});
			}.bind(this);
			this.isOnShelf = GLOBAL.onShelf[this.APIParts()[3]] ? 1 : this.isOnShelf;
			if (!this.isOnShelf) {
				POP.confirm('是否将该书加入书架？', addShelf, GLOBAL.goBack());
			} else {
				myEvent.execCallback('refreshShelf');
				GLOBAL.goBack();
			}
		},
		getFormatContent: function getFormatContent(content) {
			//console.log(content)
			var passages = content.replace(/&amp;/g, '&').replace(/(&\#160;){2,4}|\s{2,4}/g, '<br/>').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&nbsp;/g, '').replace(/&middot;/g, '·').replace(/\<img[^\>]+src='([^\>]+)'[^\>]*\/\>/g, function ($1, $2) {
				//return "<img src='" + 'http://wap.cmread.com' + $2 + "' />";
				return '';
			}).split(/\<br\s*\/\>/);

			//按段落处理引号，防止错误一个所有的配对出错，这样最多影响一段
			for (var i = 0; i < passages.length; i++) {
				passages[i] = passages[i].replace(/&quot;([^(&quot;)]*)&quot;/g, function ($1, $2) {
					return '“' + $2 + '”';
				});
			}
			return passages;
			//return '<p>' + passages.join('</p><p>')  + '</p>'
		},
		closeIntercut: function closeIntercut() {
			this.setState({
				intercutList: false,
				showIntercut: false
			});
		},
		getIntroduce: function getIntroduce(callback) {
			var that = this;
			if (!this.isMounted()) {
				return;
			}
			AJAX.getJSON('GET', '/api/book/introduce', { bid: this.APIParts()[3] }, function (data) {
				todo(data);
			}, GLOBAL.noop);
			function todo(data) {
				that.setState({
					bookName: data.book_name
				});
				that.chapterCount = data.chapter_count;
				that.chargeMode = +data.charge_mode;
				that.isOnShelf = +data.is_self;
				that.getAD_block5(data);
				if (typeof callback === 'function') {
					callback();
				}
			}
		},
		getAD_block5: function getAD_block5(data) {
			var that = this;
			if (data.intercutList && data.intercutList.length) {
				__webpack_require__.e/* nsure */(1/* duplicate */, function (require) {/* WEBPACK VAR INJECTION */(function(GLOBAL, React) {
					var Block5 = __webpack_require__(40);
					var randIndex = Math.floor(Math.random() * data.intercutList.length) % data.intercutList.length;
					that.intercut_id = data.intercutList[randIndex].content_id;

					//广告图片加载好之后再显示广告
					GLOBAL.loadImage(data.intercutList[randIndex].intercut_url, callback);

					function callback() {
						var intercutList = React.createElement(
							'div',
							null,
							React.createElement(Block5, { data: {
									contentlist: [data.intercutList[randIndex]]
								}, type: '11', fromReading: true }),
							React.createElement('span', { className: 'iconfont icon-close', onClick: that.closeIntercut })
						);
						that.intercutList = data.intercutList[randIndex];
						if (!that.isMounted()) {
							return;
						}
						that.setState({
							intercutList: intercutList,
							showIntercut: true
						});
					}
				
	/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6), __webpack_require__(1)))});
			}
		},
		gotContent: function gotContent(data, autoPay) {
			//如果是付费章节，跳到确认订单
			if (!this.isMounted()) {
				return;
			}
			var that = this;
			//设置auto pay cookie
			if (autoPay) {
				GLOBAL.cookie(that.state.bid, 'autoPay', 7);
			}
			if (data.pageType === 'order') {
				if (GLOBAL.cookie(that.state.bid) === 'autoPay') {
					that.autoPay(data);
					return;
				}
				that.setState({
					order: true
				});
				that.getIntroduce(that.confirmOrder.bind(that, data));
				return;
			}
			that.getIntroduce();
			//that.getChapterlist();
			data.content = that.getFormatContent(data.content);
			var currentPage = Math.ceil(+data.chapterSort / that.state.page_size);
			that.setState({
				data: data,
				loading: false,
				page: currentPage,
				pages: currentPage,
				order: false
			}, that.getChapterlist);
			that.getNextContent(data);
		},
		getContent: function getContent() {
			if (!this.isMounted()) {
				return;
			}
			var nextChapter = storage.get('nextChapter');
			//console.log(nextChapter.nextChapterId,this.state.chapterid)
			if (nextChapter.nextChapterId - 1 == this.state.chapterid) {
				this.gotContent(nextChapter);
				return;
			}
			this.setState({
				loading: true
			});
			var that = this;
			bookContent.get({
				bid: that.state.bid,
				cid: that.state.chapterid,
				source_id: this.APIParts()[4],
				callback: that.gotContent,
				onError: function onError(res) {
					if (!that.isLogin()) {
						that.setState({
							order: true
						});
						that.goLogin(that.getContent);
						return;
					}
					GLOBAL.defaultOnError(res);
				}
			});
		},
		getNextContent: function getNextContent(data) {
			if (!this.isMounted()) {
				return;
			}
			var that = this;
			bookContent.get({
				noCross: true,
				bid: that.state.bid,
				cid: data.nextChapterId,
				source_id: this.APIParts()[4],
				callback: function (data) {
					storage.set('nextChapter', data);
				}.bind(this),
				onError: GLOBAL.noop
			});
		},
		confirmOrder: function confirmOrder(data) {
			var that = this;
			that.setState({
				chapterName: data.name
			});
			if (that.isLogin()) {
				goOrder();
			} else {
				that.goLogin(goOrder);
			}
			function goOrder() {
				browserHistory(GLOBAL.setHref('order'));
				// require.ensure([], function(require) {
				// 	var Order = require('./order');
				// 	that.props.popup(<Order 
				// 		paySuccess={that.gotContent} 
				// 		data={data} 
				// 		bookName={that.state.bookName} 
				// 		chargeMode={that.chargeMode} 
				// 		chapterCount={that.chapterCount} />);
				// });						
			}
		},
		autoPay: function autoPay(orderData) {
			//console.log(orderData);	
			var that = this;
			if (that.isLogin()) {
				pay();
			} else {
				that.goLogin(pay);
			}
			function pay() {
				AJAX.getJSON('GET', '/api/auth/balance', {}, function (data) {
					var aidou = data.success.balance / 100;
					if (aidou - orderData.marketPrice >= 0) {
						AJAX.getJSON('GET', orderData.orderUrl, {}, function (data) {
							that.gotContent(data);
						});
					} else {
						that.setState({
							order: true
						});
						that.getIntroduce(that.confirmOrder.bind(that, orderData));
						// if(confirm('艾豆不足，请充值')){
						// 	that.getIntroduce(that.confirmOrder.bind(that,orderData));
						// }
					}
				});
			}
		},
		//type -1 为第一章， 1位最后一章
		alert: function alert(msg, type) {
			if (!this['hasAlert' + type]) {
				POP._alert(msg);
				this['hasAlert' + type] = 1;
				return true;
			}
			return false;
		},
		//当前章节翻页
		offsetPage: function offsetPage(offset) {
			if (!this.isMounted()) {
				return;
			}
			this.setState({
				showSetting: false
			});
			var scrollarea = this.refs.scrollarea;
			var height = document.body.offsetHeight * offset;
			var scrollHeight = scrollarea.scrollHeight;
			if (scrollarea.scrollTop < 10 && offset < 0) {
				return this.prevChapter();
			} else if (scrollarea.scrollTop > scrollHeight - document.body.offsetHeight - 10 && offset > 0) {
				return this.nextChapter();
			}
			scrollarea.scrollTop = Math.max(0, Math.min(scrollarea.scrollTop + height, scrollHeight - height));
		},
		toggleSettings: function toggleSettings(closeChapterlist) {
			if (!this.isMounted()) {
				return;
			}
			if (!this.state.showSetting && this.state.showIntercut) {
				uploadLog.send('intercut', {
					content_id: this.intercutList.content_id,
					event: 1,
					show_class: this.intercutList.show_class
				});
			}
			this.setState({
				showSetting: !this.state.showSetting,
				showChapterlist: closeChapterlist && false || this.state.showChapterlist
			});
		},
		onVisibilitychange: function onVisibilitychange() {
			if (isHidden()) {
				this.addRecentRead(this.props.localid, this.state.chapterid);
			} else {
				this.time = Date.now();
			}
		},
		componentDidMount: function componentDidMount() {
			this.getContent();
			document.addEventListener && document.addEventListener('visibilitychange', this.onVisibilitychange);
			window.onbeforeunload = this.addRecentRead.bind(this, this.props.localid, this.state.chapterid);
			if (GLOBAL.cookie('showGuide') != '1') {
				this.setState({
					showGuide: true
				});
				GLOBAL.cookie('showGuide', '1', {
					expires: 1000
				});
			}
		},
		handlePullToRrefresh: function handlePullToRrefresh(e) {
			var scrollY = this.refs.scrollarea.scrollTop;
			switch (e.type) {
				case "pandown":
					if (scrollY > 5) {
						return;
					} else {
						this.refs.tip_top.classList.remove("f-hide");
					}
					break;
				case "panend":
					break;
			}
		},
		componentDidUpdate: function componentDidUpdate() {
			// var that = this;
			var scrollarea = this.refs.scrollarea;
			if (!scrollarea) {
				return;
			};
			//第一次进入阅读跳到上次阅读的地方
			if (this.bookmarkFlag) {
				//console.log(storage.get('readLogNew'))
				var obj = storage.get('readLogNew')[this.APIParts()[3]];
				var offset = obj ? obj.offset[this.state.chapterid] : false;
				scrollarea.scrollTop = offset ? offset - 200 : 0;
			}
			this.bookmarkFlag = false;
			if (scrollarea.getAttribute('data-events') != '1') {
				scrollarea.setAttribute('data-events', '1');
				var hammerTime = new Hammer(scrollarea);
				hammerTime.on('tap', this.handleClick);
				hammerTime.on("pandown panend", this.handlePullToRrefresh);
			}
		},
		toggleChapterlist: function toggleChapterlist() {
			if (!this.state.showChapterlist && !this.state.chapterlist.length) {
				this.getChapterlist();
			}
			this.setState({
				showChapterlist: !this.state.showChapterlist,
				showSetting: this.state.showChapterlist
			});
		},
		handleClick: function handleClick(e) {
			var y = e.center.y;
			var h = document.body.offsetHeight;
			if (y < 0.3 * h) {
				//top
				this.offsetPage(-1);
			} else if (y < 0.7 * h) {
				//middle
				this.toggleSettings();
			} else {
				//bottom
				this.offsetPage(1);
			}
		},
		handleScroll: function handleScroll(e) {
			if (this.state.showSetting) {
				this.toggleSettings(1);
			}
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.state.loading !== nextState.loading || this.state.data !== nextState.data || this.state.showChapterlist !== nextState.showChapterlist || this.state.showSettingFont !== nextState.showSettingFont || this.state.chapterlist !== nextState.chapterlist || this.state.getChapterlistLoading !== nextState.getChapterlistLoading || this.state.showGuide !== nextState.showGuide || JSON.stringify(this.state.style) !== JSON.stringify(nextState.style) || true || this.props.children !== nextProps.children;
		},

		hideGuide: function hideGuide(e) {
			if (!this.isMounted()) {
				return;
			}
			this.setState({
				showGuide: false
			});
		},
		render: function render() {
			var currentRoute = window.location.pathname.split('/');
			currentRoute.pop();
			var ChapterlistHrefBase = currentRoute.join('/');
			var head = React.createElement(Header, { title: this.state.bookName, right: null });
			var className = readingStyle.getClass(this.state.style);
			var intercut;
			if (this.state.UFO) {
				return React.createElement(
					'div',
					{ className: 'gg-body' },
					head,
					React.createElement(
						'div',
						{ className: 'g-main g-main-1' },
						React.createElement(NoData, { type: 'UFO' })
					)
				);
			}
			if (this.state.order) {
				return React.createElement(
					'div',
					{ className: 'gg-body' },
					head,
					React.createElement(
						'div',
						{ className: 'g-main' },
						React.createElement(
							'h3',
							{ className: 'f-mt-30 f-tc' },
							this.state.chapterName
						),
						React.createElement(
							'p',
							{ className: 'u-loading' },
							'本节为付费章节'
						),
						React.createElement(
							'div',
							{ className: 'u-loading f-tc', style: { marginTop: '30px' } },
							React.createElement('input', { type: 'button', className: 'u-btn', onClick: this.getContent, value: '去支付' })
						)
					)
				);
			}
			if (this.state.loading) {
				return React.createElement(
					'div',
					{ className: 'gg-body' },
					head,
					React.createElement(
						'i',
						{ className: 'u-loading u-book-loading' },
						'努力加载中...'
					)
				);
			}
			if (this.state.intercut) {
				intercut = React.createElement(Intercut, { data: this.state.intercut });
				if (!this.uploadLogIntercut) {
					uploadLog.send('intercut', {
						intercut_id: this.state.intercut.content_id,
						event: 1,
						show_class: this.state.intercut.show_class
					});
					this.uploadLogIntercut = true;
				}
			}
			return React.createElement(
				'div',
				{ className: 'gg-body', ref: 'container' },
				React.createElement(
					'div',
					{ className: "u-readingsetting" + (!this.state.showSetting && ' f-hide' || '') },
					React.createElement(
						'div',
						{ className: 'u-settings u-settings-top' },
						React.createElement('div', { className: 'iconfont icon-back', onClick: this.goOut }),
						React.createElement(
							'span',
							{ className: 'title f-ellipsis' },
							this.state.data.name
						),
						React.createElement(
							'div',
							{ className: this.state.showIntercut ? "" : "f-hide" },
							this.state.intercutList
						)
					),
					React.createElement(
						'div',
						{ className: "u-settings u-settings-font" + (!this.state.showSettingFont && ' f-hide' || '') },
						React.createElement(
							'div',
							{ className: 'setting-fontfamily setting-font-line f-flexbox' },
							React.createElement(
								'div',
								{ className: 'title' },
								'字体'
							),
							['默认', '宋体', '黑体', '楷体'].map(function (font, i) {
								return React.createElement(
									'div',
									{ className: "item f-flex1" + (this.state.style.fontFamily == i + 1 ? ' active' : ''), onClick: this.setFontFamily, 'data-id': i + 1, key: i },
									font
								);
							}.bind(this))
						),
						React.createElement(
							'div',
							{ className: 'setting-fontsize setting-font-line f-flexbox' },
							React.createElement(
								'div',
								{ className: 'title' },
								'字号'
							),
							React.createElement(
								'div',
								{ className: "item f-flex1" + (this.state.style.fontSize == 1 ? ' active' : ''), onClick: this.setFontSm },
								'A-'
							),
							React.createElement(
								'div',
								{ className: "item f-flex1" + (this.state.style.fontSize == 5 ? ' active' : ''), onClick: this.setFontLg },
								'A+'
							)
						),
						React.createElement(
							'div',
							{ className: 'setting-line-height setting-font-line f-flexbox' },
							React.createElement(
								'div',
								{ className: 'title' },
								'排版'
							),
							['icon-lh3', 'icon-lh2', 'icon-lh1'].map(function (icon, i) {
								return React.createElement(
									'div',
									{ className: "item f-flex1" + (this.state.style.lineheight == i + 1 ? ' active' : ''), onClick: this.setFontHeight, 'data-id': i + 1, key: i },
									React.createElement('span', { className: "iconfont " + icon })
								);
							}.bind(this))
						),
						React.createElement(
							'div',
							{ className: 'setting-bg setting-font-line f-flexbox' },
							React.createElement(
								'div',
								{ className: 'title' },
								'背景'
							),
							[1, 2, 3, 4].map(function (dataid, i) {
								return React.createElement(
									'div',
									{ className: "item f-flex1 bg-" + dataid + (this.state.style.bg == dataid ? ' active' : ''), onClick: this.setFontBg, 'data-id': dataid, key: i },
									React.createElement('div', { className: 'active-border' })
								);
							}.bind(this))
						)
					),
					React.createElement(
						'div',
						{ className: 'u-settings u-settings-bottom f-flexbox' },
						React.createElement(
							'a',
							{ className: 'u-settingitem f-flex1', onClick: this.toggleChapterlist },
							React.createElement('span', { className: 'iconfont u-icon icon-menu' })
						),
						React.createElement(
							'a',
							{ className: 'u-settingitem f-flex1', onClick: this.toggleSettingFont },
							React.createElement('span', { className: 'iconfont u-icon icon-fsize' })
						),
						React.createElement(
							'a',
							{ className: 'u-settingitem f-flex1', onClick: this.toggleNightStyle },
							React.createElement('span', { className: "iconfont u-icon icon-moon" + (this.state.style.night ? ' icon-sun' : '') })
						)
					)
				),
				React.createElement(
					'section',
					{ className: "u-chapterlistc" + (this.state.showChapterlist && ' active' || '') },
					React.createElement(
						'div',
						{ className: 'u-chapterlist' },
						React.createElement(
							'div',
							{ className: 'u-bookname f-ellipsis' },
							this.state.data.name
						),
						React.createElement(
							'div',
							{ className: 'u-scroll-y' },
							React.createElement(Chapterlist, { hrefBase: ChapterlistHrefBase, chapterlist: this.state.chapterlist, source_bid: this.state.bid, bid: this.props.localid, currentChapterId: this.state.chapterid, fromReading: true, source_id: this.state.source_id })
						),
						React.createElement(
							'div',
							{ className: 'u-chapter-action f-flexbox' },
							React.createElement(
								'div',
								{ className: 'u-chapter-page f-flex1', onClick: this.prevPage },
								'上一页'
							),
							React.createElement(
								'div',
								{ className: 'u-chapter-page f-flex1', onClick: this.nextPage },
								'下一页'
							)
						)
					),
					React.createElement('div', { className: 'u-hideChapterlist', onClick: this.toggleChapterlist })
				),
				React.createElement(
					'div',
					{ className: "m-reading" + className, ref: 'scrollarea', onScroll: this.handleScroll },
					React.createElement('i', { className: 'u-miguLogo' }),
					React.createElement(
						'button',
						{ className: 'u-btn-1 f-hide', ref: 'tip_top' },
						'点击阅读上一章'
					),
					React.createElement(
						'section',
						{ className: 'u-chapterName' },
						this.state.data.name
					),
					React.createElement(
						'section',
						{ className: 'u-readingContent' },
						this.state.data.content.map(function (p, i) {
							return React.createElement(
								'p',
								{ key: i },
								p
							);
						})
					),
					intercut,
					React.createElement(
						'button',
						{ className: 'u-btn-1' },
						'点击阅读下一章'
					)
				),
				React.createElement(
					'div',
					{ className: "reading-guide" + (this.state.showGuide ? '' : ' f-hide'), onClick: this.hideGuide },
					React.createElement(
						'div',
						{ className: 'reading-guide-item guide-top' },
						React.createElement(
							'div',
							{ className: 'guide-tip' },
							React.createElement(
								'span',
								null,
								'点击 向上滚动'
							),
							React.createElement('br', null),
							React.createElement(
								'span',
								null,
								'页首到上一页'
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'reading-guide-item guide-middle f-clearfix' },
						React.createElement(
							'div',
							{ className: 'guide-icon f-fl' },
							React.createElement('img', { src: 'src/img/reading-guide.png' })
						),
						React.createElement(
							'div',
							{ className: 'guide-content f-fl' },
							React.createElement(
								'div',
								{ className: 'guide-tip' },
								React.createElement(
									'span',
									null,
									'点击中间'
								),
								React.createElement('br', null),
								React.createElement(
									'span',
									null,
									'呼出工具框'
								)
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'reading-guide-item guide-bottom' },
						React.createElement(
							'div',
							{ className: 'guide-tip' },
							React.createElement(
								'span',
								null,
								'点击 向下滚动'
							),
							React.createElement('br', null),
							React.createElement(
								'span',
								null,
								'页尾到下一页'
							)
						)
					)
				),
				this.props.children
			);
		}
	});

	module.exports = Reading;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(6), __webpack_require__(7), __webpack_require__(1), __webpack_require__(14), __webpack_require__(8), __webpack_require__(15), __webpack_require__(24)))

/***/ },
/* 76 */,
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(storage) {'use strict';

	var ReadingStyle = {
		defaultStyle: {
			bg: 1,
			night: 0,
			fontSize: 3,
			lineheight: 3,
			fontFamily: 1
		},
		extrendStyle: function extrendStyle(style) {
			style = style || {};
			for (var key in ReadingStyle.defaultStyle) {
				style[key] = style[key] || ReadingStyle.defaultStyle[key];
			}
			return style;
		},
		get: function get() {
			return ReadingStyle.extrendStyle(storage.get('ReadingStyle'));
		},
		set: function set(style) {
			//console.log(style, ReadingStyle.extrendStyle(style))
			storage.set('ReadingStyle', ReadingStyle.extrendStyle(style));
		},
		getClass: function getClass(style) {
			var className = '';
			style = ReadingStyle.extrendStyle(style);
			for (var key in style) {
				className += ' ' + key + '-' + style[key];
			}
			return className;
		}
	};

	module.exports = ReadingStyle;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(AJAX, GLOBAL, browserHistory) {'use strict';

	if (typeof window !== 'undefined') {
		var ReadConfig = __webpack_require__(79);
	}

	var BookContent = function () {
		//移动咪咕阅读
		//@source_id 1
		function getContent1(options) {
			var sourceConfig = ReadConfig['config-' + options.source_id];
			var totalUrl = sourceConfig.source_host + sourceConfig.chapter_content;
			var url = totalUrl.replace(/\?.*/, '').replace('$bid', options.bid).replace('$cid', options.cid);

			var param = totalUrl.replace(/(.*\?)/, '').replace('$cm', sourceConfig.cm);

			//TODO 错误直接在这里跳转到移动咪咕阅读，不需要传onError
			AJAX.getJSON('GET', '/api/crossDomain', {
				url: url,
				type: 'post',
				param: param
			}, options.callback, function () {
				// if (true || confirm('该章节为移动付费章节，将跳转到移动咪咕阅读')) {
				if (options.noCross) {
					return;
				} //不要跳转
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
			var url = totalUrl.replace(/\?*/, '').replace('$bid', options.bid).replace('$cid', options.cid).replace('$cm', sourceConfig.cm);

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
		};

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
	}();

	module.exports = BookContent;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(6), __webpack_require__(7)))

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(storage, AJAX, GLOBAL) {'use strict';

	var parseQuery = __webpack_require__(26);

	var ReadConfig = function () {
		var _config = storage.get('readConfig');
		var update = false;
		// console.log(_config,_config.time,(Date.now() - _config.time) > 2*24*60*60*60*1000)
		//两天的过期时间
		if (!_config || !_config.time || Date.now() - _config.time > 2 * 24 * 60 * 60 * 1000) {
			update = true;
		}
		//首次加载时更新
		if (update) {
			AJAX.getJSON('GET', '/api/read/config', {}, function (data) {
				var queryParams = parseQuery(window.location.search);
				for (var i = 0; i < data.length; i++) {
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
	}();

	module.exports = ReadConfig;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8), __webpack_require__(5), __webpack_require__(6)))

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL) {'use strict';

	var _reactRouter = __webpack_require__(3);

	var uploadLog = __webpack_require__(42);

	var Intercut = React.createClass({
		displayName: 'Intercut',

		getInitialState: function getInitialState() {
			return {
				height: document.body.offsetHeight / (this.props.data.intercut_style === 6 ? 2 : 1)
			};
		},
		handleClick: function handleClick(e) {
			e.stopPropagation();
			uploadLog.send('intercut', {
				intercut_id: this.props.data.content_id,
				event: 2,
				show_class: this.props.data.show_class
			});
			return true;
		},
		render: function render() {
			// var className = this.props.data.intercut_style === 6 ? " half-screen" : " fullscreen";
			var hrefObj = GLOBAL.typeHref(this.props.data, []);
			return React.createElement(
				'div',
				{ className: 'm-intercut', style: { height: this.state.height } },
				React.createElement('img', { src: this.props.data.intercut_url }),
				React.createElement(
					'div',
					{ className: 'btn' },
					React.createElement(
						_reactRouter.Link,
						{ to: hrefObj.url, onClick: this.handleClick },
						this.props.data.button_name || '点击立即下载'
					)
				)
			);
		}
	});

	module.exports = Intercut;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6)))

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, browserHistory, GLOBAL, myEvent, AJAX) {'use strict';

	if (typeof window !== 'undefined') {
		var POP = __webpack_require__(9);
	}
	var Header = __webpack_require__(25);

	if (typeof window !== 'undefined') {
		__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../css/pay.css\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	}

	var mod = React.createClass({
		displayName: 'mod',

		rechargeHandle: function rechargeHandle(e) {
			var hash = window.location.pathname;
			browserHistory.push(GLOBAL.setHref('balance'));
			myEvent.setCallback('recharge', function () {
				browserHistory.push(hash);
				this.getBalance();
			}.bind(this));
		},
		payHandle: function payHandle(e) {
			var that = this;
			if (this.state.aidou - this.props.price >= 0) {
				AJAX.getJSON('GET', this.props.data.orderUrl, {}, function (data) {
					GLOBAL.goBack();
					var autoPay = that.props.chargeMode == 2 ? true : false;
					that.props.paySuccess(data, autoPay);
				});
			} else {
				POP.confirm('艾豆不足，请充值', this.rechargeHandle);
			}
		},
		getBalance: function getBalance() {
			AJAX.getJSON('GET', '/api/auth/balance', {}, function (data) {
				this.setState({
					aidou: data.success.balance / 100
				});
			}.bind(this));
		},
		getInitialState: function getInitialState() {
			return {
				aidou: 0
			};
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextPros, nextState) {
			return this.state.aidou !== nextState.aidou;
		},
		componentDidMount: function componentDidMount() {
			this.getBalance();
		},
		render: function render() {
			var chapter;
			if (this.props.chargeMode == 1) {
				chapter = '总共： ' + this.props.chapterCount + '章';
			} else if (this.props.chargeMode == 2) {
				chapter = this.props.data.name;
			}
			return React.createElement(
				'div',
				null,
				React.createElement(Header, { right: null }),
				React.createElement(
					'div',
					{ className: 'g-main g-main-1' },
					React.createElement(
						'div',
						{ className: 'g-scroll m-order' },
						React.createElement(
							'div',
							{ className: 'block f-mt-20' },
							React.createElement(
								'h5',
								{ className: 'f-mb10 f-fw-b' },
								'《',
								this.props.bookName,
								'》'
							),
							React.createElement(
								'p',
								{ className: 'chapter f-bb-eee f-pb-10 f-fw-b' },
								chapter
							),
							React.createElement(
								'p',
								{ className: 'f-tr f-mt-10' },
								React.createElement(
									'span',
									{ className: 'f-fc-666' },
									'需支付：'
								),
								React.createElement(
									'span',
									{ className: 'f-fc-EF5' },
									this.props.data.marketPrice,
									'艾豆'
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'payNote f-fc-777 f-tr f-pr-15' },
							'支付成功后将自动订购后续章节'
						),
						React.createElement(
							'div',
							{ className: 'block f-clearfix' },
							React.createElement(
								'div',
								{ className: 'f-fl lh-40' },
								React.createElement(
									'span',
									{ className: 'f-mr-5 f-fw-b' },
									'艾豆余额：'
								),
								React.createElement(
									'span',
									{ className: 'f-fc-666' },
									this.state.aidou
								)
							),
							React.createElement(
								'div',
								{ className: 'f-fr' },
								React.createElement('input', { type: 'button', className: 'u-btn', onClick: this.rechargeHandle, value: '充值' })
							)
						),
						React.createElement(
							'div',
							{ className: 'f-p-15 mt-100' },
							React.createElement('input', { type: 'button', className: 'u-btn u-btn-full', onClick: this.payHandle, value: '确认支付' })
						)
					)
				)
			);
		}
	});

	module.exports = mod;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(7), __webpack_require__(6), __webpack_require__(15), __webpack_require__(5)))

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React) {"use strict";

	var Header = __webpack_require__(25);
	var Conpact = React.createClass({
		displayName: "Conpact",

		render: function render() {
			var height = document.body.offsetHeight - 44;
			return React.createElement(
				"div",
				null,
				React.createElement(Header, { title: "用户协议", right: null }),
				React.createElement("iframe", { src: "iframe/compact.html", className: "g-main", style: { height: height } })
			);
		}
	});

	module.exports = Conpact;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 85 */
/***/ function(module, exports) {

	module.exports = require("compression");

/***/ }
/******/ ]);