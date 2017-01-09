import browserHistory from 'react-router/lib/browserHistory';
import parseQuery from '../modules/parseQuery';
import getCookie from './get_cookie';

var POP;
if (typeof window !== 'undefined') {
  POP = require('../modules/confirm');
}
Date.prototype.Format = function (fmt) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
  for (const k in o) { if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length))); }
  return fmt;
};
const GLOBAL = {
	// state:1,
	// historyPath: null,
  header: {},
  onShelf: {},
  bookList: {},
  book: {},
  title: '',
  route: [],
  unRendered: [],
  orderLIst: {},
  pushLinks: {},
  getUuid() {
    let uuid = GLOBAL.cookie('InfoUuid');
    if (!uuid) {
      uuid = `${+new Date()}${Math.random()}`;
      GLOBAL.cookie('InfoUuid', uuid, { expires: 1000 });
    }
    return uuid;
  },
  getLocation() {
    return (typeof window === 'undefined' ? global.pathname : location.pathname);
  },
  goBack(path) {
		// if(!GLOBAL.state)
		// 	browserHistory.replace(GLOBAL.historyPath);
		// else
		// 	browserHistory.goBack();
    if (typeof path === 'string')			{
      browserHistory.push(path+location.search);
    } else			{
      browserHistory.goBack();
    }
  },
  setHref(str) {
    if (typeof window === 'undefined') {
			// sdk need to full url
      if (/sdk\/sdk\.\d+/.test(global.pathname)) {
        return `//m.imread.com/mall/page.9.3/${str}`;
      }
      return `${global.pathname}/${str}`;
    } else {
      let appid = '';
      let channel = '';
      if(GLOBAL.header.appid) appid = '?appid='+GLOBAL.header.appid;
      if(GLOBAL.header.channel) channel = '&channel='+GLOBAL.header.channel;
      return `${location.pathname}/${str}${appid}${channel}`;
    }
  },
  isRouter(route) {
    return route.children === null;
  },
  typeHref(data) {
    const bid = data.content_id || data.book_id || data.sheet_id || 0;
    const type = +data.type || +data.content_type;
    let target = '_self';
    if (/2|3|4/.test(data.intercut_type)) {
      target = '_blank';
    }
    if (/^http:\/\/m\.imread\.com.*referer=\d/.test(data.redirect_url)) {
      data.redirect_url = data.redirect_url.replace(/referer=\d/, '');
    }
    if (isNaN(type)) return '';

    switch (type) {
      case 1:// 图书详情
        return this.setHref(`book/introduce.${bid}`);
      case 3:// 搜索
        return this.setHref(`search/search.${data.name}`);
      case 4:// 目录
      case 5:// 分类
        return this.setHref(`cat/category.${bid}`);
      case 6:// 书城的子页面
        return this.setHref(`self/page.${data.content_id}.6.1`);
      case 7:// 书单
        return this.setHref(`sheet/bookSheet.${bid}`);
      case 11:// 跳h5下载游戏
      case 12:// 跳下载apk
      case 13:// 跳内部网页
      case 14: // 跳外部网页
      case 15:// app to H5
	    			return { url: data.redirect_url || '#', target };
      default:
        break;
    }
  },
  typeAdHref(data) {
    if (!data) return null;
    const bid = data.content_id || data.book_id || data.sheet_id || 0;
    const type = +data.type || +data.content_type;
    let target = '_self';
		// var nothing = {url:'',target:'_self'};
    if (/2|3|4/.test(data.intercut_type)) {
      target = '_blank';
      if (GLOBAL.isAndroid() && (+data.intercut_type) === 4) {
        target = 'download';
      }
    }
    if (/^http:\/\/m\.imread\.com.*referer=\d/.test(data.redirect_url)) {
      data.redirect_url = data.redirect_url.replace(/referer=\d/, '');
    }
    if (isNaN(type)) return null;
    function setHref(url) {
      const pathname = GLOBAL.getLocation();
      const link = pathname.match(/self\/page.\d+\.\d+\.\d/);
      if (link) return `${pathname}/${url}`;
			// return url;
      const match = pathname.match(/\/mall(\/page\.\d+)?/);
      const base = match ? match[0] : '//m.imread.com/mall';
      return `${base}/${url}`;
    }
		// console.log(type)
    switch (type) {
      case 1:// 图书详情
        return { url: setHref(`book/introduce.${bid}`), target };
      case 3:// 搜索
        return { url: setHref(`search/search.${data.name}`), target };
      case 4:// 目录
      case 5:// 分类
        return { url: setHref(`cat/category.${bid}`), target };
      case 6:// 书城的子页面
        return { url: setHref(`self/page.${data.content_id}.6.1`), target };
      case 7:// 书单
        return { url: setHref(`sheet/bookSheet.${bid}`), target };
      case 11:// 跳h5下载游戏
      case 12:// 跳下载apk
      case 13:// 跳内部网页
      case 14: // 跳外部网页
      case 15:// app to H5
        return { url: data.redirect_url || '#', target };
      case 16: // to home
        return { url: '//m.imread.com', target };
      case 17: // to shelf
        return { url: '//m.imread.com/mall/shelf', target };
      default: return null;
    }
  },
  setBlocklist(data) {
    if (!data.length || !this.isArray(data)) { return; }
    data.forEach((v, i) => {
      switch (v.style) {
        case 6:
        case 12:
        case 13:
          v.contentlist.forEach((v2) => {
            GLOBAL.bookList[v2.content_id] = v2.name;
          });
          break;
        default:
          GLOBAL.bookList[v.id || v.content_id] = v.name;
          if (v.contentlist && v.contentlist.length) {
            v.contentlist.forEach((v3) => {
              GLOBAL.book[v3.source_bid] = v3.name;
              GLOBAL.book[v3.content_id] = v3.name;
							// 广告 type=5 是素材目录
              v3.source_contentid && (GLOBAL.bookList[v3.source_contentid] = v3.name);
            });
          }
          break;
      }
    });
  },
  isAd() {
    if (window.location.search.match('devicetoken'))			{
      GLOBAL.pushLinks[location.pathname] = parseQuery(location.search).comeFrom;
    }
  },
  isAndroid() {
    if (typeof window !== 'undefined') {
      return /linux|android/i.test(navigator.userAgent);
    } else {
      return true;
    }
  },
  isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  },
  assertNotEmpty(s, msg) {
    if (!s) {
      if (msg) {
        POP._alert(msg);
      }
    }
    return !!s;
  },
  assertMatchRegExp(s, reg, msg) {
    if (!reg.test(s)) {
      if (msg) {
        POP._alert(msg);
      }
      return false;
    }
    return true;
  },
  cookie(key, value, options) {
		// console.log('>>>>>>>>>>>>>>>>>'+key);
		// write
    if (value !== undefined) {
      options = options || {};
      let dt = options.expires;
      if (typeof dt === 'number') {
        const days = dt;
        dt = new Date();
        dt.setDate(dt.getDate() + days);
        dt = dt.toUTCString();
      }
      return (document.cookie = [
        encodeURIComponent(key),
        '=',
        encodeURIComponent(value),
        options.expires ? `; expires=${dt}` : '', // use expires attribute, max-age is not supported by IE
        options.path ? `; path=${options.path}` : '; path=/',
        options.domain ? `; domain=${options.domain}` : '',
        options.secure ? `; secure=${options.secure}` : ''
      ].join(''));
    }
        // read
    return getCookie(document.cookie, key);
  },
  removeCookie(key, path, domain) {
    path = path || '/';
    domain = domain || location.hostname;
    if (GLOBAL.cookie(key) !== undefined) {
      GLOBAL.cookie(key, '', { expires: 'Thu, 01-Jan-1970 00:00:01 GMT', path, domain });
      return true;
    }
    return false;
  },
  removeClass(ele, name) {
    let cls = ele.className.trim();
    if (cls.indexOf(name) !== -1) {
      cls = cls.replace(name, '');
      cls = cls.replace(/\s{2,}/g, ' ');
      cls = cls.trim();
      ele.className = cls;
    }
  },
  addClass(ele, name) {
    ele.className += ` ${name.trim()}`;
  },
  decoded(s) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  },
  user: {},
  setUser(user) {
    for (const i in user) {
      if (Object.prototype.hasOwnProperty.call(user, i)) {
        GLOBAL.user[i] = user[i];
      }
    }
  },
  isElementVisible(el) {
    const rect = el.getBoundingClientRect();
    return ((rect.top > 0 && rect.top < window.innerHeight && 0x02)
				| (rect.right > 0 && rect.right < window.innerWidth && 0x01)
				| (rect.bottom > 0 && rect.bottom < window.innerHeight && 0x02)
				| (rect.left > 0 && rect.left < window.innerWidth && 0x01)
			   ) == 0x03;
  },
  loadImage(src, callback, onerror) {
    callback = callback || GLOBAL.noop;
    onerror = onerror || GLOBAL.noop;
    const img = new Image();
    img.src = src;
		// if (img.complete) {
		// 	callback();
		// } else {
    img.onload = callback;
    img.onerror = onerror;
		// }
  },
  defaultOnError(res) {
    if (!res.error) { return; }
    if (GLOBAL.isArray(res.error)) {
      let errorMsg = '';
      for (const key in res.error[0]) {
        errorMsg = res.error[0][key];
        POP.alert(errorMsg);
        return true;
      }
    } else {
      if (typeof res.error === 'string') {
        POP.alert(res.error);
        return true;
      } else if (typeof res.error.error === 'string') {
        POP.alert(res.error.error);
        return true;
      } else if (typeof res.error.detail === 'string') {
        POP.alert(res.error.detail);
        return true;
      }
      return false;
    }
  },
  noop() {},
  prettyDate(date) {
    const day = `${date.substr(4, 2)}-${date.substr(6, 2)}`;
    date = `${date.substr(0, 4)}/${date.substr(4, 2)}/${date.substr(6, 2)} ${date.substr(8, 2)}:${date.substr(10, 2)}:${date.substr(12, 2)}`;
    const d = new Date(date);

    const current = new Date();
    const deltaSecond = (current.getTime() - d.getTime()) / 1000;
    const overday = 24 * 60 * 60 * 1000;
    if (new Date(current.getTime() - overday).Format('yyyyMd') == d.Format('yyyyMd')) {
      return '昨天';
    }

    if (deltaSecond < 15 * 60) {
      return '刚刚';
    }
    if (deltaSecond < 60 * 60) {
      return `${Math.floor(deltaSecond / 60)}分钟前`;
    }
    if (deltaSecond < 24 * 60 * 60) {
      return `${Math.floor(deltaSecond / 60 / 60)}小时前`;
    } else			{
      return day;
    }
  },
  htmlContent(str) {
    return str.replace(/<\s*br\s*>|<\s*br\s*\/>/g, '\n');
  }
};

module.exports = GLOBAL;
