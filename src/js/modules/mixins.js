import myEvent from '../modules/myEvent'
import storage from '../modules/storage'
import browserHistory from 'react-router/lib/browserHistory'
import AJAX from '../modules/AJAX'
import GLOBAL from '../modules/global'
if(typeof window !== 'undefined'){
	var POP = require('../modules/confirm')
}
var mixins = function() {
    return {
        APIParts: function(param) {
            var params = this.props.params[param];
            var parts = typeof params === 'string' ? params : params[params.length - 1];
            return parts.split('.');
        },
        usePreload: function(n){
            if(typeof window !== 'undefined' &&　!window.__PRELOADED_STATE__) return;
            n = n.replace(/\./g,'_');
            n = encodeURIComponent(n);
            if(typeof window === 'undefined'){
                if(global.imdata[n]){
                    //console.log(global.imdata[n])
                    this.ajaxHandle(global.imdata[n]);
                }
            }else{
                if(window.__PRELOADED_STATE__[n]){
                    //console.log(window.__PRELOADED_STATE__[n])
                    this.ajaxHandle(window.__PRELOADED_STATE__[n]);
                }
            }            
        },
        lazyloadImage: function(container) {
            if(!container) return;
            var imgs = container.querySelectorAll('.u-lazyload-img');
            var that = this;
            for (var i = 0; i < imgs.length; i++) {
                (function(i) {
                    var img = imgs[i];
                    var src = img.getAttribute('data-lazyload-src');
                    if (src != 'loading' && src != "loaded" && GLOBAL.isElementVisible(img)) {
                        function callback(_src) {
                            if (img.nodeName == 'A') {
                                img.style.backgroundImage = 'url(' + src + ')';
                            } else {
                                img.src = _src;
                            }
                            img.setAttribute('data-lazyload-src', "loaded");
                            //that.disPatch('scroll',container);
                            //container.dispatchEvent(new Event('scroll'));//该句存在兼容问题，低版本报错
                            //img.style.height = img.offsetWidth * 4.0 / 3.0 + 'px';
                        }
                        function onerror(){
                            img.setAttribute('data-lazyload-src', "error");
                        }
                        img.setAttribute('data-lazyload-src', "loading");
                        //GLOBAL.loadImage(src, callback.bind(null, src), callback.bind('error', 'https://m.imread.com/src/img/defaultCover.png'));
                        GLOBAL.loadImage(src, callback.bind(null, src),onerror);
                    }
                })(i);
            }
        },
        scrollHandle: function(e) {
            var list = e.target;
            //console.log(list)
            if (!this.isMounted()) return; 
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(function() {
                this.lazyloadImage(list);
                // console.log(list.offsetHeight , list.scrollTop, list.scrollHeight)
                // console.log(!this.state.noMore , !this.state.scrollUpdate ,  (list.offsetHeight + list.scrollTop + 50 > list.scrollHeight)||list.offsetHeight>=list.scrollHeight)
                if (!this.state.noMore && !this.state.scrollUpdate && ((list.offsetHeight + list.scrollTop + 50 > list.scrollHeight) || list.offsetHeight >= list.scrollHeight)) {
                    this.scrollHandleCallback();
                }
            }.bind(this), 300);
        },
        scrollHandleCallback: function() {
            var n;
            this.setState({
                scrollUpdate: true
            })

            if (this.props.route) {
                n = this.props.params[(this.props.route.path.split(':')[1])];
                if (!n)
                    n = this.props.route.path;
            } else
                n = window.location.pathname.split('/').pop().split('.')[0];
            n = n.split('.')[0];

            var p = AJAX.API[n].param['pages'] ? 'pages' : 'page';
            AJAX.API[n].param[p]++;
            this.getList();
        },
        onerror: function(error) {
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
        shelfAdding: function(param, callback) {
            if (!this.isLogin()) {
                this.goLogin(addBookCallback);

                return;
            }
            addBookCallback();
            var that = this;

            function addBookCallback() {

                AJAX.go('addBook', { param: JSON.stringify(param) }, function(data) {
                    if (data.code === 200) {
                        GLOBAL.onShelf[param[0].bookId] = 1;
                        POP._alert('成功加入书架');
                        (typeof callback === 'function') && callback(data);
                    } else {
                        that.ajaxError(data);
                    }
                }, GLOBAL.noop);
            }
        },
        ajaxError: function(data) {
            if (typeof data.error === 'string')
                POP._alert(data.error);
            else
                for (var key in data.error[0]) {
                    POP._alert(data.error[0][key])
                }
        },
        isLogin: function() {
            // return !!GLOBAL.cookie('userToken')
            return !!storage.get('userToken','string') || GLOBAL.cookie('token');
        },
        goLogin: function(callback) {
            // var ua = window.navigator.userAgent.toLowerCase();
            // if(ua.match(/MicroMessenger/i) == 'micromessenger' && href){
            //     window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd64e6afb53e222ca&redirect_uri='+encodeURIComponent('https://m.imread.com/mall/page.9/login?skipurl=https://m.imread.com'+(href?href:''))+'&response_type=code&scope=snsapi_login&state=123&connect_redirect=1#wechat_redirect';
            //     return;
            // }
            //skipurl=https://m.imread.com'+(href?href:'')
            var hash = location.pathname + '/login';
            //console.log(hash)
            browserHistory.push(hash);
            POP._alert('请先登录');
            myEvent.setCallback('login', callback);
        },
        isWx: function(){
             var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger')  return true;
            else return false;
        },
        getBackUrl: function(path) {
            var path = path.path.replace(/:([^\"]*)/, '');
            path = location.pathname.split('/' + path)[0];
            path = path.replace(/\/reading([^\"]*)/,'');
            return path; 
        },
        goBackUrl: function(path) {
            var url = this.getBackUrl(path);
            browserHistory.push(url);
        },
        checkLogin: function(path) {
            if (!this.isLogin()) {
                if(!this.isWx()){
                    this.goBackUrl(path);
                }
                    // browserHistory.push('/mall/page.9.3/login?skipurl='+encodeURIComponent(location.href));
                return false;
            }
            return true;
        },
        disPatch: function(event,dom) {
            // console.log('<<<<<<<<<<<<<<<<<<<<<'+event+'>>>>>>>>>>>>>>>>>>>')
            dom = dom?dom:document;
            try {
                // document.dispatchEvent(new Event('updateUser'));
                var events = document.createEvent('HTMLEvents');
                events.initEvent(event, true, true);
                events.eventType = 'message';
                dom.dispatchEvent(events);
            } catch (e) {}
        }
    };
};

module.exports = mixins;