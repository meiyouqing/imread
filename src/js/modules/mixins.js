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
						//GLOBAL.loadImage(src, callback.bind(null, src), callback.bind('error', 'http://m.imread.com/src/img/defaultCover.png'));
						GLOBAL.loadImage(src, callback.bind(null, src));
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
				//console.log(!this.state.noMore , !this.state.scrollUpdate ,  (list.offsetHeight + list.scrollTop + 50 > list.scrollHeight)||list.offsetHeight>=list.scrollHeight)
				if (!this.state.noMore && !this.state.scrollUpdate &&  ((list.offsetHeight + list.scrollTop + 50 > list.scrollHeight)||list.offsetHeight>=list.scrollHeight)) {
					this.scrollHandleCallback();
				}
			}.bind(this), 100);
		},
		scrollHandleCallback: function(){
			var n;
			this.setState({
				scrollUpdate:true
			})

			if(this.props.route){
				n = this.props.params[(this.props.route.path.split(':')[1])];
				if(!n)
					n = this.props.route.path;
			}
			else 
				n = window.location.pathname.split('/').pop().split('.')[0];
			n = n.split('.')[0];

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
			var that = this;
			function addBookCallback() {

				AJAX.go('addBook', {param:JSON.stringify(param)},function(data){
					if(data.code === 200) {
						GLOBAL.onShelf[param[0].bookId]=1;
						(typeof callback==='function') && callback(data);
					} else {
						that.ajaxError(data);
					}
				},GLOBAL.noop);
			}
		},
		ajaxError: function(data){
			if(typeof data.error === 'string')
					POP._alert(data.error);
			else 
				for(var key in data.error[0]){
					POP._alert(data.error[0][key])
				}
		},
		isLogin: function() {
			return !!GLOBAL.cookie('token');
		},
		goLogin: function(callback){
			var hash = location.pathname+'/login';
			browserHistory.push(hash);
			POP._alert('请先登录');
			myEvent.setCallback('login', callback);
		},
		getBackUrl: function(path){
			var path = path.path.replace(/:([^\"]*)/,'');
			path = location.pathname.split('/'+path)[0];
			return path;
		},
		goBackUrl: function(path){

			var url = this.getBackUrl(path);
			browserHistory.push(url);
		},
		checkLogin: function(path){
			if(!this.isLogin()){
				this.goBackUrl(path);
				return false;
			} 
			return true;
		}
	};
};

module.exports = mixins;