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

var ISFREE = true;

var GLOBAL = {
	group:[
			{cla:"icon-shujia",href:'#shelf&block.157.1.0',name:"书架"},
			{cla:"icon-shucheng",href:'#mall',name:"书城"},
			ISFREE ? null : {cla:"icon-paihang",href:'#top',name:"排行"},
			{cla:"icon-geren",href:'#user',name:"我"}
		],
	bookList:{},
	book:{},
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
			if(v.style == 6){
				v.contentlist.forEach(function(v2){
					GLOBAL.bookList[v2.content_id] = v2.name;
				})
			}else{
				GLOBAL.bookList[v.id] = v.name;
				v.contentlist.forEach(function(v3){
					GLOBAL.book[v3.source_bid]=v3.name;
					GLOBAL.book[v3.content_id]=v3.name;
					//广告 type=5 是素材目录
					v3.source_contentid && (GLOBAL.bookList[v3.source_contentid] = v3.name);
				})
			}
		})
	},
	readLog: (function(){
		var readLog = localStorage.getItem('readLog');
		return (readLog? JSON.parse(readLog):{});
	}()),
	isArray:function(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	},
	popUpIndex: 3010,
	assertNotEmpty: function(s, msg) {
		if (!s) {
			if (msg) {
				alert(msg);
			}
		}
		return !!s;
	},
	assertMatchRegExp: function(s, reg, msg) {
		if (!reg.test(s)) {
			if (msg) {
				alert(msg);
			}
			return false;
		}
		return true;
	},
	cookie: function(key, value, options) {
		// write
        if (value !== undefined) {
                options = options || {};
                options.path = '/';

                if (typeof options.expires === 'number') {
                        var days = options.expires, t = options.expires = new Date();
                        t.setDate(t.getDate() + days);
                }

                return (document.cookie = [
                        encodeURIComponent(key),
                        '=',
                        encodeURIComponent(value),
                        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                        options.path ? '; path=' + options.path : '',
                        options.domain ? '; domain=' + options.domain : '',
                        options.secure ? '; secure' : ''
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
	removeCookie: function(key) {
		if (GLOBAL.cookie(key) !== undefined) {
                GLOBAL.cookie(key, '', {expires: -1, path: '/'});
                return true;
        }
        return false;
	},
	decoded: function(s) {
		return decodeURIComponent(s.replace(/\+/g, ' '));
	},
	user: {
	},
	setUser: function(user) {
		for (var i in user) {
			if (user.hasOwnProperty(i)) {
				GLOBAL.user[i] = user[i];
			}
		}
	},
	jsonp: function(url) {
		var script = document.createElement("script");
		script.src = url + (/\?/.test(url) ? '' : '?') + '&jsonp=GLOBAL.defaultFunction';
		document.body.appendChild(script);
	},
	getFormatRequest: function(obj, base, str) {
		if (GLOBAL.isArray(obj)) {
			for (var i = 0; i < obj.length; i++) {
				if (obj[i] && typeof obj[i] === 'object') {
					GLOBAL.getFormatRequest(obj[i], base + '[' + (i + 1) + ']', str);
				} else {
					GLOBAL.getFormatRequest(obj[i], base + '[]', str);
				}
			}
		} else if (obj && typeof obj === 'object') {
			for (var p in obj) {
				var _base = base ? base + '[' + p + ']' : p;
				GLOBAL.getFormatRequest(obj[p], _base, str);
			}
		} else {
			str.push(encodeURIComponent(base) + "=" + encodeURIComponent(obj || ''));
		}
	},
	transformRequest: function(obj) {
		var str = [];
		GLOBAL.getFormatRequest(obj, '', str);
		return str.join("&");
	},
	setRequestHeaders: function(request) {
		var channel = 'ImreadH5';
		var refererChannel = window.location.search.match(/channel=([^&]+)/);
		channel = refererChannel && refererChannel[1] || channel;
		var headers = {
			//'Referer': 'readapi.imread.com',
			'isFree': ISFREE ? '2' : '1',
			'Info-Imsi': '',
			'Info-Imei': '',
			'Info-Channel': channel, 
			'Info-Version': '1.0.0',
			'Info-Model': '',
			'Info-Os': '',
			'Info-Platform': 'ImreadH5',//渠道，不能修改，记录阅读日志需要用到
			'Info-Vcode': '100',
			'Info-Userid': '',
			'Info-Uuid': GLOBAL.getUuid(),
			'Token': GLOBAL.cookie('userToken') || '',
			'Info-Resolution': window.screen.width + '*' +  window.screen.height,
			'Curtime': new Date().Format('yyyyMMddhhmmss'),
			'WidthHeight': (window.screen.height / window.screen.width).toFixed(2)
		};
		//headers = {};
		for (var k in headers) {
			request.setRequestHeader(k, headers[k]);
		} 
	},
	removeClass: function(ele, className) {
		var regs = [new RegExp('^' + className + '$', 'g'), 
					new RegExp('^' + className + '\\s+', 'g'),
					new RegExp('\\s+' + className + '$', 'g'),
					new RegExp('\\s+' + className + '\\s+', 'g')];
		regs.forEach(function(reg) {
			ele.className = ele.className.replace(reg, '');
		});
	},
	addClass: function(ele, className) {
		ele.className += ' ' + className;
	},
	isElementVisible: function(el) {
		var rect = el.getBoundingClientRect();
		return (  (rect.top > 0 && rect.top < window.innerHeight && 0x02)
				| (rect.right > 0 && rect.right < window.innerWidth && 0x01)
				| (rect.bottom > 0 && rect.bottom < window.innerHeight && 0x02)
				| (rect.left > 0 && rect.left < window.innerWidth && 0x01)
			   ) == 0x03;
	},
	defaultFunction: function() {

	},
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
	lazyloadImageMixin: function() {
		return {
			lazyloadImage: function(container) {
				var imgs = container.querySelectorAll('img[data-lazyload-src]');
				for (var i = 0; i < imgs.length; i++) {
					(function(i) {
						var img = imgs[i];
						var src = img.getAttribute('data-lazyload-src');
						if (src != '1' && GLOBAL.isElementVisible(img)) {
							GLOBAL.loadImage(src, function() {
								img.src = src;
								img.setAttribute('data-lazyload-src', 1);
							}, function() {
								img.src = 'src/img/defaultCover.png';
								img.setAttribute('data-lazyload-src', 1);
							});
						}
					})(i);
				}
			}
		};
	},
	defaultOnError: function(res) {
		if (!res.error) {return;}
		if (GLOBAL.isArray(res.error)) {
			var errorMsg = '';
			for (var key in res.error[0]) {
				errorMsg = res.error[0][key];
				alert(errorMsg);
				return true;
			}
		} else {
			if (typeof res.error === 'string') {
				alert(res.error);
			} else {
				alert(res.error.detail);
			}
			return true;
		}
	},
	noop: function() {},
	getUuid: function () {
		var uuid = GLOBAL.cookie('InfoUuid') || localStorage.getItem('InfoUuid');
		if (!uuid) {
			uuid = '' + (+new Date) + Math.random();
			GLOBAL.cookie('InfoUuid', uuid);
			try{
	 			localStorage.setItem('InfoUuid', uuid, {
	  				expires: 1000
	  			});
			}catch(e){}
		}
		return uuid;
	},
	goTo: function (bid, cid) {
		if (confirm('该章节为移动付费章节，将跳转到移动咪咕阅读')) {
			window.location.href = Config.examplUrl.replace('$bid', bid).replace('$cid', cid);
		}
	}
}

module.exports = GLOBAL;
