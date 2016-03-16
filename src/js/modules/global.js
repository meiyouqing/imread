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
	header:{},
	group:[
			{cla:"icon-shujia",href:'#shelf&block.157.1.10000',name:"书架"},
			{cla:"icon-shucheng",href:'#mall',name:"书城"},
			{cla:"icon-paihang",href:'#top',name:"发现"},
			{cla:"icon-geren",href:'#user',name:"我"}
		],
	bookList:{},
	book:{},
	onShelf:{},
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
					GLOBAL.bookList[v.id] = v.name;
					v.contentlist.forEach(function(v3){
						GLOBAL.book[v3.source_bid]=v3.name;
						GLOBAL.book[v3.content_id]=v3.name;
						//广告 type=5 是素材目录
						v3.source_contentid && (GLOBAL.bookList[v3.source_contentid] = v3.name);
					});
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
	popUpIndex: 3010,
	assertNotEmpty: function(s, msg) {
		if (!s) {
			if (msg) {
				POP.alert(msg);
			}
		}
		return !!s;
	},
	assertMatchRegExp: function(s, reg, msg) {
		if (!reg.test(s)) {
			if (msg) {
				POP.alert(msg);
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
                GLOBAL.cookie(key, '', {expires: -1});
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
	}
}

module.exports = GLOBAL;
