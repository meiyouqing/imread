import browserHistory from 'react-router/lib/browserHistory';
import myEvent from '../modules/myEvent';
import storage from '../modules/storage';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';

var POP;
if (typeof window !== 'undefined') {
  POP = require('../modules/confirm');
}
const mixins = function () {
  return {
    APIParts(param) {
      const params = this.props.params[param];
      const parts = typeof params === 'string' ? params : params[params.length - 1];
      return parts.split('.');
    },
    usePreload(n) {
      if (typeof window !== 'undefined' && !window.__PRELOADED_STATE__) return;
      if (typeof n !== 'string') n = n[n.length - 1];
      n = n.replace(/\./g, '_');
      n = encodeURIComponent(n);
      if (typeof window === 'undefined') {
        if (global.imdata[n]) {
                    // console.log(global.imdata[n])
          this.ajaxHandle(global.imdata[n], true);
        }
      } else if (window.__PRELOADED_STATE__[n]) {
                    // console.log(window.__PRELOADED_STATE__[n])
        this.ajaxHandle(window.__PRELOADED_STATE__[n], true);
      }
    },
    lazyloadImage(container) {
      if (!container) return;
      const imgs = container.querySelectorAll('.u-lazyload-img');
      for (let i = 0; i < imgs.length; i++) {
        (function () {
          const img = imgs[i];
          const src = img.getAttribute('data-lazyload-src');
          function callback(_src) {
              if (img.nodeName === 'A') {
                img.style.backgroundImage = `url(${src})`;
              } else {
                img.src = _src;
              }
              img.setAttribute('data-lazyload-src', 'loaded');
                            // that.disPatch('scroll',container);
                            // container.dispatchEvent(new Event('scroll'));//该句存在兼容问题，低版本报错
                            // img.style.height = img.offsetWidth * 4.0 / 3.0 + 'px';
            }
            function onerror() {
              img.setAttribute('data-lazyload-src', 'error');
            }
          if (src !== 'loading' && src !== 'loaded' && GLOBAL.isElementVisible(img)) {
            img.setAttribute('data-lazyload-src', 'loading');
                        // GLOBAL.loadImage(src, callback.bind(null, src), callback.bind('error', 'https://m.imread.com/src/img/defaultCover.png'));
            GLOBAL.loadImage(src, callback.bind(null, src), onerror);
          }
        }(i));
      }
    },
    scrollHandle(e) {
      const list = e.target;
            // console.log(list)
      if (!this.isMounted()) return;
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.lazyloadImage(list);
                // console.log(list.offsetHeight , list.scrollTop, list.scrollHeight)
                // console.log(!this.state.noMore , !this.state.scrollUpdate ,  (list.offsetHeight + list.scrollTop + 50 > list.scrollHeight)||list.offsetHeight>=list.scrollHeight)
        if (!this.state.noMore && !this.state.scrollUpdate && ((list.offsetHeight + list.scrollTop + 60 > list.scrollHeight) || list.offsetHeight >= list.scrollHeight)) {
          this.scrollHandleCallback();
        }
      }, 300);
    },
    scrollHandleCallback() {
      this.setState({
        scrollUpdate: true
      });

            // if (this.props.route) {
            //     const match = this.props.route.path.match(/\:([^\)]+)/);
            //     n = this.props.params[(match && match[1])];
            //     if (!n)
            //         n = this.props.route.path;
            // } else{
            //     n = window.location.pathname.split('/').pop().split('.')[0];
            // }

		    // if(!this.scrollAJAX) this.scrollAJAX = new Ajax(this.APIparam);
            // if(typeof n !== 'string') n = n[n.length-1];
            // n = n.split('.')[0];
            // var p = this.scrollAJAX.param['pages'] ? 'pages' : 'page';
      this.scrollPagesNo += 1;
      this.getList();
    },
    onerror(error) {
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
    shelfAdding(param, callback) {
      if (!this.isLogin()) {
        this.goLogin(addBookCallback);

        return;
      }
      addBookCallback();

      function addBookCallback() {
			    const AJAX = new Ajax('addBook');
        AJAX.go({ param: JSON.stringify(param) }, (data) => {
          if (data.code === 200) {
            GLOBAL.onShelf[param[0].bookId] = 1;
            POP._alert('成功加入书架');
            (typeof callback === 'function') && callback(data);
          } else {
            GLOBAL.defaultOnError(data);
          }
        });
      }
    },
    ajaxError(data) {
      if (typeof data.error === 'string') {
        POP._alert(data.error);
      } else {
        for (const key in data.error[0]) {
          POP._alert(data.error[0][key]);
        }
      }
    },
    isLogin() {
            // return !!GLOBAL.cookie('userToken')
      return !!storage.get('userToken', 'string') || GLOBAL.cookie('token');
    },
    goLogin(callback) {
            // var ua = window.navigator.userAgent.toLowerCase();
            // if(ua.match(/MicroMessenger/i) == 'micromessenger' && href){
            //     window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd64e6afb53e222ca&redirect_uri='+encodeURIComponent('https://m.imread.com/mall/page.9/login?skipurl=https://m.imread.com'+(href?href:''))+'&response_type=code&scope=snsapi_login&state=123&connect_redirect=1#wechat_redirect';
            //     return;
            // }
            // skipurl=https://m.imread.com'+(href?href:'')
      const hash = `${location.pathname}/login`;
            // console.log(hash)
      browserHistory.push(hash);
      POP._alert('请先登录');
      myEvent.setCallback('login', callback);
    },
    isWx() {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') return true;
      return false;
    },
    getBackUrl(path) {
      path = path.path.replace(/:([^"]*)/, '');
      path = location.pathname.split(`/${path}`)[0];
      path = path.replace(/\/reading([^"]*)/, '');
      return path;
    },
    goBackUrl(path) {
      const url = this.getBackUrl(path);
      browserHistory.push(url);
    },
    checkLogin(path) {
      if (!this.isLogin()) {
        if (!this.isWx()) {
          this.goBackUrl(path);
        }
                    // browserHistory.push('/mall/page.9.3/login?skipurl='+encodeURIComponent(location.href));
        return false;
      }
      return true;
    },
    disPatch(event, dom) {
            // console.log('<<<<<<<<<<<<<<<<<<<<<'+event+'>>>>>>>>>>>>>>>>>>>')
      dom = dom || document;
      try {
                // document.dispatchEvent(new Event('updateUser'));
        const events = document.createEvent('HTMLEvents');
        events.initEvent(event, true, true);
        events.eventType = 'message';
        dom.dispatchEvent(events);
      } catch (e) {
        alert('No support disPatch!');
      }
    }
  };
};

module.exports = mixins;
