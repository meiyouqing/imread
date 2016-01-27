var getJSON = require('./getJSON').getJSON;
var parseQuery = require('./parseQuery');

var Config = {
	cm: 'M3540009', //移动渠道号，自己获取渠道号,
	cm2: 'M3540019', //付费章节跳转到移动渠道号,
	examplUrl: 'http://wap.cmread.com/r/$bid/$cid/index.htm?page=1&vt=2&cm=M3540019' //跳转url样例
};

(function() {
	
	function callback(cm) {
		Config.examplUrl = Config.examplUrl.replace(Config.cm2, cm);
		Config.cm2 = cm;
	}

	var params = parseQuery(window.location.search);
	if (params['cm']) {
		callback(params['cm']);
	} else {
		//根据url channel获取cm值
		var refererChannel = params['channel'];
		if (!refererChannel) {
			return ;
		}
		getJSON('GET', '/api/read/cm', {channel: refererChannel}, function(data) {
			callback(data.success);
		}, GLOBAL.noop);
	}
})();

var API={
	group:{method:'GET', base:'/api/group/page', param:{group_id:1}},
	page:{method:'GET', base:'/api/page/content', param:{page_id:1, pages:1, blocks:1}},
	nav:{method:'GET', base:'/api/page/block', param:{page_id:1, pages:1, blocks:6}},
	block:{method:'GET', base:'/api/block/content', param:{block_id:1,pages:1,contents:15}},
	category:{method:'GET', base:'/api/category/content', param:{category_id:1, pages:1, contents:1}},
	introduce:{method:'GET', base:'/api/book/introduce', param:{bid:1 }},
	chapterlist:{method:'GET', base:'/api/book/chapterlist', param:{bid:1, page:1, order_type:'asc', page_size:1, vt:9}},
	search:{method:'GET', base:'/api/book/search', param:{kw:'',pages:1,ot:1,it:1,st:6,ssr:8}},
	login:{method:'POST', base:'/api/auth/login/custom', param:{phone:'1',password:'1'}},
	register:{method:'POST', base:'/api/auth/register', param:{mobile_num:'',password:'',key:'',device_identifier:'',promot:'',channel:5 }},
	key:{method:'GET', base:'/api/auth/key', param:{phone:'',type:''}},
	password:{method:'POST', base:'/api/auth/reset/password', param:{mobile_num:'',password:'',key:''}},
	me:{method:'POST', base:'/api/me', param:{token:''}},
	upToken:{method:'GET', base:'/api/upToken', param:{oldToken:''}},
	advice:{method:'POST', base:'/api/person/advice', param:{message:'',contact:'', type: 'unEncode'}},
	addBook:{method:'POST', base:'/api/shelf/add', param:{param:''}},
	deleteBook:{method:'POST', base:'/api/shelf/delete', param:{param:''}},
	log:{method:'POST', base:'/api/upload/log', param:{bookId:1,readTime:1,chapter_id:1,chapter_offset:1}},
	crossDomain:{method:'GET',base:'/api/crossDomain',param:{url:'',type: 'post',param: 'page=1&vt=9&cm=' + Config.cm}}
};
function Router(str){
	this.route = [];
	this.now = ['mall'];
	this.parts = [];
	this.title = '艾美阅读';
	this.titles = [];
	this.name = '';
	this.api = {};
	this.Config = Config;
	this.unRendered = [];
};
// Router.prototype._setRendered = function(index, flag) {
// 	for (var i = 0; i < this._rendered.length; i++) {
// 		if (i == index) {
// 			this._rendered[i] = flag;
// 		}
// 	}
// 	for (var i = this._rendered.length; i <= index; i++) {
// 		this._rendered.push(i == index ? flag : !1);
// 	}
// };
Router.prototype.visitMiGu = function(bid, cid) {
	function visitUrl(url) {
		var iframe = document.createElement("iframe");
		iframe.style.display = 'none';
		iframe.src = url;
		document.body.appendChild(iframe);
		setTimeout(function() {
			document.body.removeChild(iframe);
		}, 3000);
	}
	if (!bid) {
		//访问主页
		visitUrl('http://wap.cmread.com/r/?cm=' + Config.cm2);
	} else {
		visitUrl(Config.examplUrl.replace('$bid', bid).replace('$cid', cid));
	}
};
Router.prototype.toOthers = function(bid, cid) {
	if (confirm('该章节为移动付费章节，将跳转到移动咪咕阅读')) {
		window.location.href = Config.examplUrl.replace('$bid', bid).replace('$cid', cid);
	}
};
Router.prototype.setAPI = function(){
	var ao = API[this.parts[0]];
	var i = 1;
	for (var n in ao.param){
		if(this.parts[i] && this.parts[i] !== '0'){
			ao.param[n] = this.parts[i];
		}		
		i++;
	}
	ao.param.spm = this.now[2]? this.now[2]:'';
	ao.param.scm = this.now[3]? this.now[3]:'';
	this.api.m = ao.method;
	this.api.base = ao.base;
	this.api.param = ao.param;
};
Router.prototype.setTitle = function(){
	var n=this.name,
		id=this.parts[1],
		lastTitle=this.title;
	switch(n){
		case 'shelf':
			this.title = GLOBAL.group[0].name;
			break;
		case 'mall':
			this.title = GLOBAL.group[1].name;
			break;
		case 'top':
			this.title = GLOBAL.group[2].name;
			break;
		case 'user':
			this.title = GLOBAL.group[3].name;
			break;
		case 'more':
		case 'category':
			this.title = GLOBAL.bookList[id];
			break;
		case 'introduce':
			this.title = GLOBAL.book[id];
			break;
		case 'login':
			this.title = '登录';
			break;
		case 'register':
			this.title = '注册';
			break;
		case 'reset':
			this.title = '重置密码';
			break;
		case 'feedback':
			this.title = '意见反馈';
			break;
		
		default:
			break;
	}
	if(lastTitle!==this.title){
		if(this.lastName!==this.name){
			this.titles.pop();
			this.titles.push(this.title);
		}else{
			this.titles.push(this.title);
		}
	}
	var rTitle = '';
	if (this.titles[this.titles.length - 1]) {
		rTitle = ' - ' + this.titles[this.titles.length - 1];
	}
	document.title = '艾美阅读' + rTitle;
};
Router.prototype.goBack = function() {
	var	route = this.route.slice(0,-1);
	window.location.replace('#'+route.join('/'));
};
Router.prototype.setHref = function(str,type) {
	if(!str || !typeof str==='string'){
		return '404';
	}
	switch (type){
		case 'now':
			var	route = this.route.slice(0,-1);
			return '#'+ route.join('/')+'/'+str;
		default:
			return '#'+this.route.join('/')+'/'+str;
	}
};
Router.prototype.get = function(callback,onerror){
	//if(typeof callback !== 'function'){return}
	getJSON(this.api.m, this.api.base, this.api.param, callback, onerror);
};
Router.prototype.ajax = function(n,param,callback, onerror){
	//if(typeof callback !== 'function'){return}
	getJSON(API[n].method, API[n].base, param, callback, onerror);
};
Router.prototype.init = function(str){
	this.lastName = this.name;
	if(!str || typeof str !== 'string'){
		this.now = this.route[this.route.length-1].split('&');
	}else{
		this.now = str.split('&');		
	}
	this.name = this.now[0];
	if(this.now.length>1){
		this.parts = this.now[1].split('.');
		//console.log(this.parts)		
		this.setAPI();
	}else{
		this.parts=[];
	}
	this.setTitle();
	// console.log(this.name,this.title)
};


module.exports = new Router();