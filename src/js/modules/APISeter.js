
var setAJAX = require('../modules/AJAX.getJSON').set;
//var payAJAX = require('../modules/payAJAX');

var title = {login:'登录',forget:'重置密码',regiter:'新用户注册',confirmOrder:'确认订单',balance:'艾豆充值',recharge:'话费充值',recharge_result:'充值结果',recentRead:'最近阅读',tag:'我的标签',readHistory:'我的成就',feedback:'意见反馈',about:'关于艾美阅读'};
var Config = {
	payURLBase: 'http://pay.imread.com:8081',
	ai: GLOBAL.isAndroid()? '1':'2'
};
var API={
	group:{method:'GET', base:'/api/group/page', param:{group_id:1}},
	page:{method:'GET', base:'/api/page/content/'+Config.ai, param:{page_id:1, pages:1, blocks:3}},
	nav:{method:'GET', base:'/api/page/block', param:{page_id:1, pages:1, blocks:6}},
	block:{method:'GET', base:'/api/block/content', param:{block_id:1,pages:1,contents:15}},
	category:{method:'GET', base:'/api/category/content', param:{category_id:1, pages:1, contents:15}},
	bookSheet:{method:'GET', base:'/api/bookSheet/list', param:{sheet_id:1, pages:1, contents:15}},
	collectionAdd:{method:'POST', base:'/api/bookSheet/collection/add', param:{sheet_id:1}},
	collectionDelete:{method:'POST', base:'/api/bookSheet/collection/delete', param:{sheet_id:1}},
	introduce:{method:'GET', base:'/api/book/introduce', param:{bid:1 }},
	chapterlist:{method:'GET', base:'/api/book/chapterlist', param:{bid:1, page:1, order_type:'asc', page_size:1, vt:9}},
	search:{method:'GET', base:'/api/book/search', param:{kw:'',pages:1,ot:1,it:1,st:6,ssr:8}},
	login:{method:'POST', base:'/api/auth/login/custom', param:{phone:'',password:''}},
	register:{method:'POST', base:'/api/auth/register', param:{mobile_num:'',password:'',key:'',device_identifier:'',promot:'',channel:5 }},
	key:{method:'GET', base:'/api/auth/key', param:{phone:'',type:''}},
	password:{method:'POST', base:'/api/auth/reset/password', param:{mobile_num:'',password:'',key:''}},
	me:{method:'GET', base:'/api/me', param:{}},
	upToken:{method:'GET', base:'/api/upToken', param:{oldToken:''}},
	advice:{method:'POST', base:'/api/person/advice', param:{message:'',contact:'', type: 'unEncode'}},
	addBook:{method:'POST', base:'/api/shelf/add', param:{param:''}},
	deleteBook:{method:'POST', base:'/api/shelf/delete', param:{param:''}},
	log:{method:'POST', base:'/api/upload/log', param:{readLog: {}}},
	balance:{method:'GET', base:'/api/auth/balance', param:{}},
	pay:{method:'POST', base:'/api/pay', param:{productId:0,payType:0,spType:0,mobileNum:0,productName:0,productDesc:0,others:0}},
	payInit:{method:'POST', base:Config.payURLBase+'/order/web_init', param:{}},
	paySign:{method:'POST', base:Config.payURLBase+'/config/getsign', param:{}},
	payVcurl:{method:'POST', base:Config.payURLBase+'/order/web_vcurl', param:{}},
	payConfirm:{method:'POST', base:Config.payURLBase+'/order/web_confirm', param:{}},
	crossDomain:{method:'GET',base:'/api/crossDomain',param:{url:'',type: 'post',param: 'page=1&vt=9&cm=' + Config.cm}},
	recentRead:{method: 'GET', base: '/api/me/recentReading', param:{pages: 1, contents: 10}},
	deleteRecentRead:{method: 'POST', base: '/api/me/recentReading/delete', param:{book_id: ''}},
	listTag:{method: 'GET', base: '/api/me/label/list', param:{}},
	addTag:{method: 'POST', base: '/api/me/label/add', param:{id: ''}},
	deleteTag:{method: 'POST', base: '/api/me/label/delete', param:{id: ''}}
};

function Router(){
	this.title = '艾美阅读';
	this.titles = [];
	this.name = '';
	this.pgid = 0;
	this.api = {};
	this.Config = Config;
	this.unRendered = [];
};
Router.prototype.setAPI = function(now){
	var parts = now[0].split('.');
	var ao = API[parts[0]];
	if(!ao){return}
	var i = 1;
	for (var n in ao.param){
		if(parts[i] && parts[i] !== '0'){
			ao.param[n] = parts[i];
		}		
		i++;
	}
	ao.param.spm = now[2]? now[2]:'';
	ao.param.scm = now[3]? now[3]:'';
	this.api.m = ao.method;
	this.api.base = ao.base;
	this.api.param = ao.param;
};
Router.prototype.setTitle = function(){
	// console.log(this.name)
	var n=this.name,
		id=this.parts[1];
	switch(n){
		case 'shelf':
			this.title = GLOBAL.group[0].name;
			this.pgid = this.parts[1];
			break;
		case 'mall':
			this.title = GLOBAL.group[1].name;
			this.pgid = this.parts[1];
			break;
		case 'top':
			this.title = GLOBAL.group[2].name;
			this.pgid = this.parts[1];
			break;
		case 'user':
			this.title = GLOBAL.group[3].name;
			break;
		case 'searchPage':
			this.pgid = this.parts[1];
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
	var rTitle = this.title? ('-'+this.title):'';
	document.title = '艾美阅读' + rTitle;
};
Router.prototype.goBack = function(callback) {
	var	route = this.route.slice(0,-1);
	window.location.replace('#'+route.join('/'));
};
Router.prototype.setHref = function(str,type) {
	if(!str || typeof str!=='string'){return '404';}
	switch (type){
		case 'now':
			var	route = this.route.slice(0,-1);
			return '#'+ route.join('/')+'/'+str;
		default:
			return '#'+this.route.join('/')+'/'+str;
	}
};
Router.prototype.typeHref = function(data,spm, route_type){
	var bid = data.content_id || data.book_id;
	var type = +data.type || +data.content_type;
	spm = spm.join('.');
	var cpm = type+'.'+bid;
	var target = '_self';
	if(/2|3|4/.test(data.intercut_type)){
		target = '_blank';
		if(GLOBAL.isAndroid() && (+data.intercut_type)===4){
			target = 'download';
		}
	}

	if (/^http:\/\/m\.imread\.com.*referer=\d/.test(data.redirect_url)) {
		data.redirect_url = data.redirect_url.replace(/referer=\d/, "");
	}
	switch(type){
		case 1://图书详情
			return this.setHref('introduce.'+bid+'&'+spm+'&'+cpm,route_type);
		case 2://广告
    		switch (data.intercut_type) {
    			case 1://图书详情
    				return {url:this.setHref('introduce.' + data.source_contentid+'&'+spm+'&'+cpm),target:target};
    			case 2://内部网页
    			case 3://外部网页
    			case 4://apk下载

    				return {url:data.redirect_url || "javascript:void(0)",target:target};
    			case 5://素材目录
    				return {url:this.setHref('category.' + data.source_contentid + '.1.0'+'&'+spm+'&'+cpm),target:target};
    		}
		case 3://搜索
			return this.setHref('searchList&search.'+data.name+'.0.0.0.0.0'+'&'+spm+'&'+cpm);
		case 5://分类
			return this.setHref('category.'+bid+'.1.0'+'&'+spm+'&'+cpm);
		case 6://书城的子页面
			return this.setHref('mall&page'+data.pgid+'.1.0'+'&'+spm+'&'+cpm);
		case 7://书单
			return this.setHref('bookSheet.'+bid+'.1.0'+'&'+spm+'&'+cpm);
	}
},
Router.prototype.get = function(callback,onerror,setName){
	setAJAX(setName);
	AJAX.getJSON(this.api.m, this.api.base, this.api.param, callback, onerror);
};
Router.prototype.ajax = function(n,param,callback, onerror,setName){
	setAJAX(setName);
	AJAX.getJSON(API[n].method, API[n].base, param, callback, onerror);
};
Router.prototype.init = function(str){
	this.lastName = this.name;
	if(!str || typeof str !== 'string'){return;}
	//str = str.replace(/\&plg_[^\&]+=[^\&]+/g, '');
	this.now = str.split('&');		
	var nowFirst = this.now[0].split('.');
	if(this.now.length===1||nowFirst.length>1){
		this.parts = nowFirst;
		this.name = nowFirst[0];
	}else{
		this.parts = this.now[1].split('.');
		this.name = this.now[0];
		this.now.shift();
	}
	this.setAPI(this.now);
	this.setTitle();
	//console.log(this.name,this.title,this.api)
};

module.exports = new Router();