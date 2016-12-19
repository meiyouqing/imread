import storage from './storage'
import GLOBAL from './global'
import transformRequest from './transformRequest';
import 'babel-polyfill'
import fatch from 'isomorphic-fetch'
import getCookie from './getCookie'

var Config = {
	payURLBase: 'https://pay.imread.com:8081',
	ai: GLOBAL.isAndroid()? '1':'2'
};
//ajax constructor
Ajax.prototype.API = {
	shelf:{method:'GET', base:'/api/v1/block/content', param:{block_id:156,contents:100,pages:1}},
	group:{method:'GET', base:'/api/v1/group/page', param:{group_id:1,config_id: 1}},
	page:{method:'GET', base:'/api/v1/page/content/'+Config.ai, param:{page_id:1, blocks:3, pages:1}},
	nav:{method:'GET', base:'/api/v1/page/block', param:{page_id:1, blocks:6, pages:1}},
	block:{method:'GET', base:'/api/v1/block/content', param:{block_id:1,contents:15,pages:1}},
	blocks:{method:'GET', base:'/api/v1/block/content', param:{block_id:1,page_id:0,pages:1,contents:15}},
	category:{method:'GET', base:'/api/v1/category/content', param:{category_id:1, pages:1, contents:15}},
	bookSheet:{method:'GET', base:'/api/v1/bookSheet/list', param:{sheet_id:1, contents:15, pages:1}},
	collectionAdd:{method:'POST', base:'/api/v1/bookSheet/collection/add', param:{sheet_id:1}},
	collectionDelete:{method:'POST', base:'/api/v1/bookSheet/collection/delete', param:{sheet_id:1}},
	introduce:{method:'GET', base:'/api/v1/book/introduce', param:{bid:1 }},
	chapterlist:{method:'GET', base:'/api/v1/book/chapterlist', param:{bid:1, page_size:1, vt:9, order_type:'asc', page:1}},
	search:{method:'GET', base:'/api/v1/book/search', param:{kw:'',pages:1,ot:1,it:1,st:6,ssr:'0'}},
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
	alyPay: {method: 'POST',base:'/api/v1/pay',param:{productId:0,payType:4,callback:'/'}},
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
	purchased: {method: 'GET', base: '/api/v1/purchased/list', param:{pages: 1,contents: 15}},
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
Ajax.prototype.setCache = function(url, data){
	sessionStorage.setItem('__IMCache__'+url, data);
};
Ajax.prototype.getCache = function(url){
	return sessionStorage.getItem('__IMCache__'+url);
};
Ajax.prototype.getJSON = function (method, url, postdata={}, callback, onError=GLOBAL.defaultOnError, options={}) {
	var urlBase = 'https://readapi.imread.com';
	// var urlBase = 'http://192.168.0.34:9090';
	// var urlBase = 'http://192.168.0.252:8080';
	if (/^\/api/.test(url)) {
		url = urlBase + url;
	}

	let cacheData;
	//read data from session storage
	if(this.cache){
		cacheData = this.getCache(getGETUrl());
		if(cacheData){
			// console.log('use cache')
			callback(JSON.parse(cacheData)); //使用缓存数据
			// return; //如果return，缓存数据就不会更新。
		}
	}

	let GETUrl;
	function getGETUrl () {
		if(!GETUrl) GETUrl = url + (/\?/.test(url) ? "" : "?") + transformRequest(postdata);
		return GETUrl;
	};

	const isNode = typeof window === 'undefined';
	const headers = new Headers({
		'Info-Imsi': '',
		'Info-Imei': '',
		'Info-Channel': (isNode?global.query.channel : GLOBAL.header.channel) || 'ImreadH5',
		'Info-appid' : (isNode?global.query.appid : GLOBAL.header.appid) ||'ImreadH5',
		'Info-Version': '2.4.1',
		'Info-Model': '',
		'Info-Os': '',
		'Info-Platform': 'ImreadH5',
		'Info-Vcode': '101',
		'Info-Userid': GLOBAL.header.userId || '',
		'Info-Uuid': isNode?(getCookie('InfoUuid',global.cookie) || '') : GLOBAL.getUuid(),
		'Info-Resolution': isNode?1 : window.screen.width + '*' +  window.screen.height,
		'Curtime': new Date().Format('yyyyMMddhhmmss'),
		'WidthHeight': isNode?1 : (window.screen.height / window.screen.width).toFixed(2)
	})
	const request = method === 'GET'?
					new Request(getGETUrl(url,postdata),{
						method,
						headers:!options.noHeaders?headers : new Headers({}),
						mode:'cors',
						credentials: 'include'
					}):
					new Request(url,{
						method,
						headers:!options.noHeaders?headers : new Headers({}),
						mode:'cors',
						credentials: 'include',
						body:postdata.formdata?postdata.formdata:transformRequest(postdata)
					})
	const promise = fetch(request);

	let timeoutId = 0;
	const timeout = (ms,promise) => {
		return new Promise((resolve,reject)=>{
			timeoutId = setTimeout(()=>{
				onError('链接超时');
				reject(new Error('链接超时'));
			},ms)
			promise.then(resolve,reject);
		})
	};	
	timeout(50000,promise)
	.then(function(response) {
		clearTimeout(timeoutId);
		if (response.status >= 200 && response.status < 300) {
			// console.log(response)
			if(options.isText){
				return response.text();
			}
			return response.json();
		} else {
			const error = new Error(response.statusText)
			error.response = response;
			onError(error);
			throw error;
		}
	})
	.then((stories) => {
		if(stories.error){
			onError(stories.error)
		}else{
			if(this.cache){
				//更新缓存数据
				// console.log(JSON.parse(cacheData),stories)
				// if(this.compareObj(JSON.parse(cacheData),stories)) return;
				// console.log('更新缓存数据')
				this.setCache(getGETUrl(), JSON.stringify(stories));
				if(cacheData) return;
			}
			// console.log('use api')
			callback(stories)
		}
	})
	.catch(function(error) {
		// console.log('request failed', error)
		onError(error)
	})
};
// Ajax.prototype.compareObj = function(a,b){
// 	if(!isObj(a)||!isObj(b)) return false;
// 	console.log(Date.now())
// 	function isObj(o){
// 		return (Object.prototype.toString.call(o) === '[object Object]') || (!!o&&typeof o==='object'&&o.constructor===Array);
// 	}
// 	function getLen(o){
// 		let count=0;
// 		for (let key in o){
// 			if(o.hasOwnProperty(key)) count++;
// 		}
// 		return count;
// 	}
// 	let flag = true;
// 	function compare(a,b){
// 		if(!getLen(a)===getLen(b)) {flag=false;return;}		
// 		for (let key in a){
// 			if(a.hasOwnProperty(key)){
// 				if(!b.hasOwnProperty(key)) {flag=false;break;}
// 				if(isObj(a[key]) && isObj(b[key])){
// 					compare(a[key],b[key]);
// 				}else if(!isObj(a[key]) && !isObj(b[key])){
// 					if(a[key]!==b[key]) {flag=false;break;}
// 				}else{
// 					flag=false;break;
// 				}
// 			}
// 		}
// 	}
// 	compare(a,b);
// 	console.log(Date.now())
// 	return flag;
// };
Ajax.prototype.get = function(callback, onerror){
	if(this.errMsg){
		onerror(this.errMsg);
		return;
	}
	this.getJSON(this.method,this.base,this.param,callback,onerror);
};
Ajax.prototype.go = function(postData, callback, onerror, options){
	if(this.errMsg){
		onerror(this.errMsg);
		return;
	}
	this.getJSON(this.method, this.base, postData, callback, onerror, options)
};

function Ajax(param, cache=false){
	if(typeof param !== 'string' || !param.length) {
		this.errMsg = `the param is "${param}"`;
		return;
	}
	this.cache = cache;

	const paramParts = param.split('.');
	if(!this.API[paramParts[0]]) {
		this.errMsg = `Ajax.API.${paramParts[0]} is undefined`;
		return;
	}

	//深复制
	const api = {...this.API[paramParts[0]]};
	api.param = {...api.param}
	//使用param参数的数据
	if(paramParts.length>1){
		let i = 0;
		for(let n in api.param){
			i++
			if(paramParts[i] && paramParts[i] !== '-' && api.param.hasOwnProperty(n)){
				api.param[n] = paramParts[i];
			}
		}
	}
	
	this.method = api.method;
	this.base = api.base;
	this.param = api.param;
}
module.exports = Ajax;