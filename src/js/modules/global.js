Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

var GLOBAL = {
	// state:1,
	// historyPath: null,
	header:{},
	onShelf:{},
	bookList:{},
	book:{},
	title:'',
	route:[],
	unRendered:[],
	orderLIst:{},
	goBack:function(path){
		// if(!GLOBAL.state)
		// 	browserHistory.replace(GLOBAL.historyPath);
		// else
		// 	browserHistory.goBack();
		if(typeof path == 'string')
			browserHistory.push(path);
		else
			browserHistory.goBack();
	},
	setHref:function(str,type){
		//TODO
		return location.pathname+'/'+str
	},
	isRouter: function(route){
		var route_id = null,
			route_arr = route.route.path.replace(/\//,'').split(':'),
			route_key = route_arr[route_arr.length-1];

		if(route.routeParams[route_key]){
			route_id = route.routeParams[route_key];
			if(typeof route_id !== 'string')
				route_id = route_id[route_id.length-1];
			route_id = encodeURIComponent(route_id);
		}
		else 
			route_id = route_key;

		var route_path = window.location.pathname.split('/');

		if(route_path[route_path.length-1] == route_id)	return true;
		else return false;

		// var path = route.route.path.replace(/:([^\"]*)/,'');
		// return window.location.pathname.split('/'+path)[0];
	},
	typeHref: function(data,spm, route_type){
		var bid = data.content_id || data.book_id || data.sheet_id || 0;
		var type = +data.type || +data.content_type;
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
		if(isNaN(type)) return '';
		switch(type){
			case 1://图书详情
				return this.setHref('book/introduce.'+bid,route_type);
			// case 2://广告
	  //   		switch (data.intercut_type) {
	  //   			case 1://图书详情
	  //   				return {url:this.setHref('book/introduce.' + data.source_contentid),target:target};
	  //   			case 2://内部网页
	  //   			case 3://外部网页
	  //   			case 4://apk下载
	  //   			case 8://app to H5
	  //   				return {url:data.redirect_url || "javascript:void(0)",target:target};
	  //   			case 5://素材目录
	  //   				return {url:this.setHref('cat/category.' + data.source_contentid ),target:target};
   //  				case 6: //自搭页面
   //  					return {url:this.setHref('selfbuild/page.62'),target:target}
   //  				default:
   //  					return {url:"javascript:void(0)",target:target}
	  //   		}
			case 3://搜索
				return this.setHref('search/search.'+data.name);
			case 4://目录
			case 5://分类
				return this.setHref('cat/category.'+bid);
			case 6://书城的子页面
				return this.setHref('mall/page'+data.pgid);
			case 7://书单
				return this.setHref('sheet/bookSheet.'+bid);
			case 11://跳h5下载游戏
	    		case 12://跳下载apk
	    		case 13://跳内部网页
	    		case 14: //跳外部网页
	    		case 15://app to H5
	    			return {url:data.redirect_url || "javascript:void(0)",target:target};
		}
	},
	setTitle: function(parts){
		var title = {login:'用户登录',forget:'重置密码',regiter:'新用户注册',confirmOrder:'确认订单',balance:'艾豆充值',recharge:'话费充值',recharge_result:'充值结果',recentRead:'最近阅读',tag:'我的标签',readHistory:'我的成就',feedback:'意见反馈',about:'关于艾美阅读'};
		parts = parts.split('.');
		var n=parts[0],
			id=parts[1];
		switch(n){
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
		var rTitle = this.title? ('-'+this.title):'';
		document.title = '艾美阅读' + rTitle;
		return this.title;
	},
	setBookName:function(data){
		if(!data.length||!this.isArray(data)){return}
		data.forEach(function(v){
			this.book[v.source_bid]=v.name;
			this.book[v.content_id]=v.name;
		}.bind(this))
	},
	setBlocklist:function(data){
		if(!data.length||!this.isArray(data)){return}
		data.forEach(function(v,i){
			switch(v.style){
				case 6:
				case 12:
				case 13:
					v.contentlist.forEach(function(v2){
						GLOBAL.bookList[v2.content_id] = v2.name;
					})
				break;
				default:
					GLOBAL.bookList[v.id || v.content_id] = v.name;
					if(v.contentlist && v.contentlist.length){
						v.contentlist.forEach(function(v3){
							GLOBAL.book[v3.source_bid]=v3.name;
							GLOBAL.book[v3.content_id]=v3.name;
							//广告 type=5 是素材目录
							v3.source_contentid && (GLOBAL.bookList[v3.source_contentid] = v3.name);
						});
					}
				break;
			}
		})
	},
	isAndroid: function(){
		return /linux|android/i.test(navigator.userAgent);
	},
	isArray:function(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	},
	assertNotEmpty: function(s, msg) {
		if (!s) {
			if (msg) {
				POP._alert(msg);
			}
		}
		return !!s;
	},
	assertMatchRegExp: function(s, reg, msg) {
		if (!reg.test(s)) {
			if (msg) {
				POP._alert(msg);
			}
			return false;
		}
		return true;
	},
	cookie: function(key, value, options) {
		// write
        if (value !== undefined) {
                options = options || {};
                if (typeof options.expires === 'number') {
                        var days = options.expires, t = options.expires = new Date();
                        t.setDate(t.getDate() + days);
                }
                return (document.cookie = [
                        encodeURIComponent(key),
                        '=',
                        encodeURIComponent(value),
                        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                        options.path?'; path='+options.path:'; path=/',
                        options.domain ? '; domain=' + options.domain :'',
                        options.secure ? '; secure=' + options.secure :''
                ].join(''));
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
	removeCookie: function(key,path) {
		if (GLOBAL.cookie(key) !== undefined) {
                GLOBAL.cookie(key, '', {expires: -1,path:path});
                return true;
        }
        return false;
	},
	removeClass: function(ele,name){
		var cls = ele.className.trim();
		if(cls.indexOf(name)!==-1){
			cls = cls.replace(name,'');
			cls = cls.replace(/\s{2,}/g,' ');
			cls = cls.trim();
			ele.className = cls;
		}
	},
	addClass: function(ele,name){
		ele.className += ' '+name.trim();
	},
	decoded: function(s) {
		return decodeURIComponent(s.replace(/\+/g, ' '));
	},
	user: {},
	setUser: function(user) {
		for (var i in user) {
			if (user.hasOwnProperty(i)) {
				GLOBAL.user[i] = user[i];
			}
		}
	},
	isElementVisible: function(el) {
		var rect = el.getBoundingClientRect();
		return (  (rect.top > 0 && rect.top < window.innerHeight && 0x02)
				| (rect.right > 0 && rect.right < window.innerWidth && 0x01)
				| (rect.bottom > 0 && rect.bottom < window.innerHeight && 0x02)
				| (rect.left > 0 && rect.left < window.innerWidth && 0x01)
			   ) == 0x03;
	},
	defaultFunction: function() {},
	loadImage: function(src, callback, onerror) {
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
	defaultOnError: function(res) {
		if (!res.error) {return;}
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
	noop: function() {},
	getUuid: function () {
		var uuid = GLOBAL.cookie('InfoUuid') || storage.get('InfoUuid', 'string');
		if (!uuid) {
			uuid = '' + (+new Date) + Math.random();
			GLOBAL.cookie('InfoUuid', uuid, {
	  				expires: 1000
	  		});
			storage.set('InfoUuid', uuid);
		}
		return uuid;
	},
	prettyDate: function(date) {
		var day = date.substr(4,2)+ '-' +date.substr(6,2);
		date = date.substr(0,4) + '/' +date.substr(4,2)+ '/' +date.substr(6,2)+ ' ' +date.substr(8,2)+ ':' +date.substr(10,2)+ ':' +date.substr(12,2);
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
		else
			return day;
	},
}

module.exports = GLOBAL;
