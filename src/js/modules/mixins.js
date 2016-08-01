var mixins = function() {
	return {
		APIParts: function (param) {
			var params = this.props.params[param];
			var parts = typeof params === 'string'? params : params[params.length-1];
			return parts.split('.');
		},
		lazyloadImage: function(container) {
			var imgs = container.querySelectorAll('.u-lazyload-img');
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

							container.dispatchEvent(new Event('scroll'));
							//img.style.height = img.offsetWidth * 4.0 / 3.0 + 'px';
						}
						img.setAttribute('data-lazyload-src', "loading");
						GLOBAL.loadImage(src, callback.bind(null, src), callback.bind('error', 'http://m.imread.com/src/img/defaultCover.png'));
					}
				})(i);
			}
		},
		scrollHandle: function(e) {
			console.log(111)
			var list = e.target;
			if (!this.isMounted()) {return ;}			
			clearTimeout(this.timeoutId);
			this.timeoutId = setTimeout(function() {
				this.lazyloadImage(list);
				//console.log(!this.state.noMore , !this.state.scrollUpdate ,  (list.offsetHeight + list.scrollTop + 50 > list.scrollHeight)||list.offsetHeight>=list.scrollHeight)
				console.log(this.state.noMore,this.state.scrollUpdate)
				if (!this.state.noMore && !this.state.scrollUpdate &&  ((list.offsetHeight + list.scrollTop + 50 > list.scrollHeight)||list.offsetHeight>=list.scrollHeight)) {
					this.scrollHandleCallback();
				}
			}.bind(this), 100);
		},
		scrollHandleCallback: function(){

			this.setState({
				scrollUpdate:true
			})
			var n = this.props.params[(this.props.route.path.split(':')[1])];
			n = n.split('.')[0];
			console.log(AJAX.API,n)
			var p = AJAX.API[n].param['pages']? 'pages':'page';
			AJAX.API[n].param[p]++;		
			this.getList();
		},
		onerror:function(error){
			if(this.state.scrollUpdate){
				this.setState({
					scrollUpdate:false,
					noMore:true
				});
				return;
			}
			this.setState({
				onerror:true
			});
		},
		shelfAdding: function(param,callback){
			if(!this.isLogin()){
				this.goLogin(addBookCallback);
				return;
			}
			addBookCallback();
			function addBookCallback() {
				AJAX.go('addBook', {param:JSON.stringify(param)},function(data){
					GLOBAL.onShelf[param[0].bookId]=1;
					(typeof callback==='function') && callback(data);
				},GLOBAL.noop);
			}
		},
		isLogin: function() {
			return !!GLOBAL.cookie('userToken');
		},
		goLogin: function(callback){
			var hash = location.pathname+'/login';
			browserHistory.push(hash);
			POP._alert('请先登录');
			myEvent.setCallback('login', callback);
		}
	};
};

module.exports = mixins;