var mixins = function() {
	return {
		lazyloadImage: function(container) {
			var imgs = container.querySelectorAll('img[data-lazyload-src]');
			for (var i = 0; i < imgs.length; i++) {
				(function(i) {
					var img = imgs[i];
					var src = img.getAttribute('data-lazyload-src');
					if (src != '1' && GLOBAL.isElementVisible(img)) {
						function callback(_src) {
							img.src = _src;
							img.setAttribute('data-lazyload-src', 1);
							container.dispatchEvent(new Event('scroll'));
							//img.style.height = img.offsetWidth * 4.0 / 3.0 + 'px';
						}
						GLOBAL.loadImage(src, callback.bind(null, src), callback.bind('error', 'src/img/defaultCover.png'));
					}
				})(i);
			}
		},
		scrollHandle: function(e) {
			var list = e.target;
			if (!this.isMounted()) {return ;}			
			clearTimeout(this.timeoutId);
			this.timeoutId = setTimeout(function() {
				this.lazyloadImage(list);
				//console.log(!this.state.noMore,!this.state.scrollLoading,document.body.scrollHeight + list.scrollTop + (-30) > list.scrollHeight,document.body.scrollHeight , list.scrollHeight)
				if (!this.state.noMore && !this.state.scrollUpdate &&  (list.offsetHeight + list.scrollTop + 50 > list.scrollHeight)||list.offsetHeight>=list.scrollHeight) {
					this.scrollHandleCallback && this.scrollHandleCallback();
				}
			}.bind(this), 100);
		},
		shelfAdding: function(param,callback){
			if(!this.isLogin()){
				this.goLogin(addBookCallback);
				return;
			}
			addBookCallback();
			function addBookCallback() {
				Router.ajax('addBook', {param:JSON.stringify(param)},function(data){
					(typeof callback==='function') && callback(data);
				},GLOBAL.noop);
			}
		},
		isLogin: function() {
			return !!GLOBAL.cookie('userToken');
		},
		goLogin: function(callback){
			var hash = window.location.hash+'/login';
			window.location.replace(hash);
			POP._alert('请先登录！');
			myEvent.setCallback('login', callback);
		}
	};
};

module.exports = mixins;