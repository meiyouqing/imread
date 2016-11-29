import storage from './storage'
import GLOBAL from './global'
import transformRequest from './transformRequest';
import 'babel-polyfill'
import fatch from 'isomorphic-fetch'
var Config = {
	payURLBase: 'https://pay.imread.com:8081',
	ai: GLOBAL.isAndroid()? '1':'2'
};
var API={
	shelf:{method:'GET', base:'/api/v1/block/content', param:{block_id:156,contents:100,pages:1}},
	group:{method:'GET', base:'/api/v1/group/page', param:{group_id:1,config_id: 1}},
	page:{method:'GET', base:'/api/v1/page/content/'+Config.ai, param:{page_id:1, blocks:3, pages:1}},
	nav:{method:'GET', base:'/api/v1/page/block', param:{page_id:1, blocks:6, pages:1}},
	block:{method:'GET', base:'/api/v1/block/content', param:{block_id:1,contents:15,pages:1}},
	blocks:{method:'GET', base:'/api/v1/block/content', param:{block_id:1,page_id:0,contents:15,pages:1}},
	category:{method:'GET', base:'/api/v1/category/content', param:{category_id:1, contents:15, pages:1}},
	bookSheet:{method:'GET', base:'/api/v1/bookSheet/list', param:{sheet_id:1, contents:15, pages:1}},
	collectionAdd:{method:'POST', base:'/api/v1/bookSheet/collection/add', param:{sheet_id:1}},
	collectionDelete:{method:'POST', base:'/api/v1/bookSheet/collection/delete', param:{sheet_id:1}},
	introduce:{method:'GET', base:'/api/v1/book/introduce', param:{bid:1 }},
	chapterlist:{method:'GET', base:'/api/v1/book/chapterlist', param:{bid:1, page_size:1, vt:9, order_type:'asc', page:1}},
	search:{method:'GET', base:'/api/v1/book/search', param:{kw:'',ot:1,it:1,st:6,ssr:'0',pages:1}},
	mLogin:{method:'POST', base:'/api/v1/auth/login/sso', param:{user_identifier:'',nick_name:'',password:'',channel:6}},
	mOrder:{method:'GET', base:'/api/v1/migu/order', param:{book_id:0,chapter_id:0,cm:0,firmnum:'',count:1}},
	mBind:{method:'GET', base:'/api/v1/migu/check/bind', param:{cm:0}},
	mSms:{method:'GET', base:'/api/v1/migu/login/sms', param:{cm:null,smsContent:null,bookId:0,chapterId:0,redirectUrl:null}},
	login:{method:'POST', base:'/api/v1/auth/login/custom', param:{phone:'',password:''}},
	loginout:{method:'POST', base:'/api/v1/migu/logout',param:{}},
	register:{method:'POST', base:'/api/v1/auth/register', param:{mobile_num:'',password:'',key:'',device_identifier:'',promot:'',channel:5 }},
	key:{method:'GET', base:'/api/v1/auth/key', param:{phone:'',type:''}},
	password:{method:'POST', base:'/api/v1/auth/reset/password', param:{mobile_num:'',password:'',key:''}},
	me:{method:'GET', base:'/api/v1/me', param:{}},
	upToken:{method:'GET', base:'/api/v1/upToken', param:{oldToken:''}},
	advice:{method:'POST', base:'/api/v1/person/advice', param:{message:'',contact:'', type: 'unEncode'}},
	addBook:{method:'POST', base:'/api/v1/shelf/add', param:{param:''}},
	deleteBook:{method:'POST', base:'/api/v1/shelf/delete', param:{param:''}},
	log:{method:'POST', base:'/api/v1/upload/log', param:{readLog: {}}},
	balance:{method:'GET', base:'/api/v1/auth/balance', param:{}},
	adXp: {method:'GET', base:'/api/v1/book/intercut/list', param:{bid: 0,page:1,page_size:0,order_type:'asrc',vt:9}},
	adHc: {method:'GET', base:'/api/v1/book/breathe', param:{bid: 0}},
	// pay:{method:'POST', base:'/api/v1/pay', param:{productId:0,payType:0,spType:0,mobileNum:0,productName:0,productDesc:0,others:0}},
	pay:{method:'POST', base:'/api/v3/pay', param:{productId:0,mobileNum:0}},
	repay:{method:'POST', base:'/api/v1/pay/impay/yzm', param:{trade_no:0,trade_day:0}},
	payConfirm:{method:'POST', base:'/api/v1/pay/impay/verify', param:{trade_no:0,trade_day:0}},
	payCheck:{method:'POST', base:'/api/v1/pay/impay/check', param:{trade_no:0,trade_day:0,order_no:0}},
	wxPay:{method:'POST', base:'/api/v1/cert/pay', param:{productId:0}},
	alyPay: {method: 'POST',base:'/api/v1/pay',param:{}},
	// payInit:{method:'POST', base:Config.payURLBase+'/order/web_init', param:{}},
	// paySign:{method:'POST', base:Config.payURLBase+'/config/getsign', param:{}},
	// payVcurl:{method:'POST', base:Config.payURLBase+'/order/web_vcurl', param:{}},
	// payConfirm:{method:'POST', base:Config.payURLBase+'/order/web_confirm', param:{}},
	crossDomain:{method:'GET',base:'/api/crossDomain',param:{url:'',type: 'post',param: 'page=1&vt=9&cm=' + Config.cm}},
	recentRead:{method: 'GET', base: '/api/v1/me/recentReading', param:{pages: 1, contents: 10}},
	deleteRecentRead:{method: 'POST', base: '/api/v1/me/recentReading/delete', param:{book_id: ''}},
	listTag:{method: 'GET', base: '/api/v1/me/label/list', param:{}},
	addTag:{method: 'POST', base: '/api/v1/me/label/add', param:{id: ''}},
	deleteTag:{method: 'POST', base: '/api/v1/me/label/delete', param:{id: ''}},
	purchased: {method: 'GET', base: '/api/v1/purchased/list', param:{pages: 1,contents: 10}},
	pwd: {method: 'POST', base: '/api/v1/auth/update/password', param:{oldPasswd: 0,password: 0}},
	bookstore: {method: 'GET', base: '/api/v1/bookSheet/list/user', param:{pages: 1,contents: 6}},
	upload: {method: 'POST', base: '/api/v1/file/portrait', param:{file:null}},
	edituser: {method: 'POST', base: '/api/v1/auth/edit/info', param:{user_gender:0,user_birthday:null,user_name:null}},
	login_qq: {method: 'POST', base: '/api/v1/auth/login/sso', param:{user_identifier:null,promot:'H5',channel:'3',nick_name:null}},
	login_wx: {method: 'POST', base: '/api/v1/auth/login/wechat/sso', param:{appid:null,secret:null,code:null,grant_type:null}},
	login_wb: {method: 'POST', base: '/api/v1/auth/login/weibo/sso', param:{code:null,grant_type:null}},
	sdk:{method: 'GET', base: '/api/v2/postion/content', param:{post_id:1,channel:1}},
	datails: {method: 'GET',base:'/api/v2/me/particulars',param:{pages:1,contents:20}},
	alist:{method: 'GET',base:'/api/v2/book/list',param:{author_name:'',pages:1,contents:10}},
	setConfig: {method: 'POST',base: '/api/v2/readperference/update',param:{config_id:3,config_value:''}}
};

//接口缓存机制
// var imCache = (function() {
// 	var config = {
// 		cacheUrl: ['/api/v1/group/page','/api/v1/page/content','/api/v1/book/introduce','/api/v1/book/chapterlist'],
// 		needCache: false
// 	};

// 	var needCache = function(url) {
// 		if (!config.needCache) {
// 			return false;
// 		}
// 		for (var i = 0; i < config.cacheUrl.length; i++) {
// 			if (new RegExp(config.cacheUrl[i]).test(url)) {
// 				return true;
// 			}
// 		}
// 		return false;
// 	};

// 	var getCacheKey = function(url) {
// 		return 'ImCache-' + url;
// 	};

// 	var getFromCache = function(url) {
// 		var key = getCacheKey(url);
// 		var cacheStr = localStorage.getItem(key);
// 		var result = false;
// 		try {
// 			if (cacheStr) {
// 				result = JSON.parse(cacheStr);
// 			}
// 		} catch(e) {

// 		}
// 		return result;
// 	};

// 	var setCache = function(url, data) {
// 		storage.set(getCacheKey(url), data);
// 		return true;
// 	};

// 	return {
// 		needCache: needCache,
// 		getFromCache: getFromCache,
// 		setCache: setCache
// 	};
// })();


function getGETUrl(url, postdata) {
	// return 'http://192.168.0.251:8080/nonono';
	return url + (/\?/.test(url) ? "" : "?") + transformRequest(postdata);
}
//getJSON接口
function GETJSON(method, url, postdata={}, callback, onError,isJson) {
	var urlBase = 'https://readapi.imread.com';
	// var urlBase = 'http://192.168.0.34:9090';
	// var urlBase = 'http://192.168.0.252:8080';



	if (/^\/api/.test(url)) {
		url = urlBase + url;
	}
	if(typeof window !== 'undefined'){
		GETJSONWITHAJAX(method, url, postdata, callback, onError,isJson);
		return;
	}

	// var cacheUrl = getGETUrl(method + '-' + url, postdata);
	// var cacheResponse = false;
	// if (imCache.needCache(cacheUrl)) {
	// 	cacheResponse = imCache.getFromCache(cacheUrl);
	// 	if (cacheResponse) {
	// 		// console.log('getFromCache-' + cacheUrl)
	// 		setTimeout(function(){
	// 			callback(cacheResponse)
	// 		},0);
	// 	}
	// }
	// GETJSONWITHAJAX(method, url, postdata, callback, onError, cacheResponse);
	// console.log(headers)
	// console.log(method)

	//request object
	const headers = new Headers({
		'Info-Imsi': '',
		'Info-Imei': '',
		'Info-Channel': GLOBAL.header.channel || 'ImreadH5',
		'Info-appid' : GLOBAL.header.appid ||'7',
		'Info-Version': '1.0.1',
		'Info-Model': '',
		'Info-Os': '',
		'Info-Platform': 'ImreadH5',//渠道，不能修改，记录阅读日志需要用到
		'Info-Vcode': '101',
		'Info-Userid': GLOBAL.header.userId || '',
		'Info-Uuid': '',
		'Info-Resolution': 1,
		'Curtime': new Date().Format('yyyyMMddhhmmss'),
		'WidthHeight': 1
	})

	const request = method === 'GET'?
					 new Request(getGETUrl(url,postdata),{
						method,
						headers,
						mode:'cors'
					}):
					 new Request(url,{
						method,
						headers,
						mode:'cors',
						body:postdata.formdata?postdata.formdata:transformRequest(postdata)
					})
	const promise = fetch(request);

	// const promise = method === 'GET'?
	// 			fetch(getGETUrl(url,postdata)):
	// 			fetch(url,{
	// 				method,
	// 				body:postdata.formdata?postdata.formdata:transformRequest(postdata)
	// 			});
	let timeoutId = 0;
	const timeout = (ms,promise) => {
		return new Promise((resolve,reject)=>{
			timeoutId = setTimeout(()=>{
				reject(new Error('链接超时'));
			},ms)
			promise.then(resolve,reject);
		})
	};	
	timeout(50000,promise).then(function(response) {
		clearTimeout(timeoutId);
		if (response.status >= 200 && response.status < 300) {
		    return response.json();
		  } else {
		    const error = new Error(response.statusText)
		    error.response = response;
		    throw error
			//onError(error)
		  }
	})
	.then(function(stories) {
		if(stories.error){
			onError("服务器错误")
		}else{
	    	callback(stories)
		}
	})
	.catch(function(error) {
    	//console.log('request failed', error)
    	onError(error)
  	})
}
function GETJSONWITHAJAX(method, url, postdata, callback, onError,isJson,noHeader) {
	method = method || 'POST';
	var time = 10000;
	var timeout = false;
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

	var timer = setTimeout(function() {
		timeout = true;
		request.abort();
	}, time);
	onError = onError || GLOBAL.defaultOnError;
	request.onreadystatechange = function() {
		if (request.readyState !== 4)
			return;
		if (timeout) {
			onError('连接超时！');
			return;
		}
		clearTimeout(timer);
		if (request.status === 200) {
			var res = false;
			try {
				res = !isJson?
					JSON.parse(request.responseText):
					request.responseText;
				if(!res) {
					onError(new Error('服务器返回为空'));
				}else if(res.error){
					onError(res);
				}else{
					callback(res);
				}			
			} catch (e) {
				//res = '连接超时！';
				onError(e);
			}
		}else {
			onError(request.status+' '+request.responseText)
		}
	};

	if (method === 'POST') {
		request.open(method, url);
		request.withCredentials = true;
		if(!noHeader) setRequestHeaders(request);
		if(postdata.formdata){
			//request.setRequestHeader("Content-Type", "multipart/form-data");
			postdata = postdata.formdata;
		}else{
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			postdata = transformRequest(postdata);
		}
		request.send(postdata);
	} else {
		// var isYulan = false;
		// var yulanUrls = ['/api/v1/group/page', '/api/v1/page/content'];
		// for (var i = 0; i < yulanUrls.length; i++) {
		// 	isYulan |= new RegExp(yulanUrls[i]).test(url);
		// }
		// isYulan = isYulan && /yulan=1/.test(window.location.search);
		request.open(method, getGETUrl(url, postdata));
		request.withCredentials = true;
		if(!noHeader) setRequestHeaders(request);
		request.send(null);
	}
}
function setRequestHeaders(request) {
	//console.log(GLOBAL.header)
	var headers={
		//'Referer': 'readapi.imread.com',
		'Info-Imsi': '',
		'Info-Imei': '',
		'Info-Channel': GLOBAL.header.channel || 'ImreadH5',
		'Info-appid' : GLOBAL.header.appid ||'ImreadH5',
		'Info-Version': '1.0.1',
		'Info-Model': '',
		'Info-Os': '',
		'Info-Platform': 'ImreadH5',//渠道，不能修改，记录阅读日志需要用到
		'Info-Vcode': '101',
		'Info-Userid': GLOBAL.header.userId || '',
		'Info-Uuid': GLOBAL.header.uuid || GLOBAL.getUuid(),
		'Info-Resolution': window.screen.width + '*' +  window.screen.height,
		'Curtime': new Date().Format('yyyyMMddhhmmss'),
		'WidthHeight': (window.screen.height / window.screen.width).toFixed(2),
	};

	for (var k in headers) {
		request.setRequestHeader(k, headers[k]);
	} 
}

var AJAX = {
	API: API,
	init: function(now){
		if(!now) return;
		if(GLOBAL.isArray(now)){
			now = now[now.length-1];
		}

		var parts = now.split('.');
		this.API.now = parts[0];
		var ao = API[parts[0]];
		if(!ao){return}
		var i = 1;
		for (var n in ao.param){
			if(parts[i] && parts[i] !== '0'){
				ao.param[n] = parts[i];
			}		
			i++;
			this.API.now += '.'+ao.param[n];
		}
		this.API._m = ao.method;
		this.API._base = ao.base;
		this.API._param = ao.param;
	},
	get: function(callback, onerror){
		GETJSON(this.API._m,this.API._base,this.API._param,callback,onerror);
	},
	go: function(n,param,callback,onerror,isJson){
		GETJSON(this.API[n].method, this.API[n].base, param, callback, onerror,isJson)
	},
	private_go: function(method, url, postdata, callback, onError,isJson,noHeader){
		GETJSONWITHAJAX(method, url, postdata, callback, onError,isJson,noHeader)
	},
	getJSON: GETJSON
}
module.exports = AJAX;