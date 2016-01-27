var Header = require('./header');
var Header_nav = require('./header_nav');
var Nav = require('./nav');
var Mall = require('./mall');
var Top = require('./top');
var Shelf = require('./shelf');
var EmptyShelf = require('./emptyShelf');
var User = require('./user');
var Search = require('./search');
var DownloadTip = require('./downloadTip');
require('../css/iconfont1.css');


//var Shelf = require('./shelf');

var Frame = React.createClass({
	timeoutId: null,
	mixins: [GLOBAL.lazyloadImageMixin()],
	title:Router.title,
	go: function(){
		//console.log(Router.now)
		var that = this,ggbody;
		switch(Router.name){
			case 'mall':
				this.reset();
				this.name = 'mall';
				this.getMallList();
			break;
			case 'top':
				this.reset();
				this.name = 'top';
				this.getTopList();
			break;
			case 'shelf':
				this.reset();
				this.name = 'shelf';
				this.getShelfList();
			break;
			case 'user':
				this.reset();
				this.resetNav();
				this.name = 'user';
				this.forceUpdate();
			break;
			case 'about':
				require.ensure([], function(require) {
					require('../css/about.css')
					var About = require('./about');
					ggbody = <About />;
					setPop(ggbody);
				});
				break;
			case 'compact':
				require.ensure([], function(require) {
					require('../css/compact.css')
					var Compact = require('./compact');
					ggbody = <Compact />;
					setPop(ggbody);
				});
				break;
			case 'register':
				require.ensure([],function(require){
					var Register = require('./register');
					ggbody = <Register />; 
					setPop(ggbody);						
				});
				break;
			case 'forget':
				require.ensure([],function(require){
					var Register = require('./register');
					ggbody = <Register forget={true} />; 
					setPop(ggbody);						
				});
				break;
			case 'login':
				require.ensure([],function(require){
					var Login = require('./login');
					ggbody = <Login />
					setPop(ggbody);
				});
				break;
			case 'feedback':
				require.ensure([],function(require){
					var Feedback = require('./feedback');
					ggbody = <Feedback />
					setPop(ggbody);
				})
				break;
			case 'introduce':
				require.ensure([],function(require){
					require('../css/introduce.css')
					var Introduce = require('./introduce');
					ggbody = <Introduce />
					setPop(ggbody);
				})
				break;
			case 'searchPage':
				ggbody = <Search />
				setPop(ggbody);
				break;
			case 'more':
			case 'searchList':
			case 'category':
				require.ensure([],function(require){
					var List = require('./list');
					ggbody = <List />
					setPop(ggbody);
				})
				break;
			case 'reading':
				require.ensure([],function(require){
					require('../css/reading.css');
					var Reading = require('./reading');
					ggbody = <Reading localid={Router.parts[3]} />
					setPop(ggbody);
				})
				break;
			default:
				break;
		}
		//console.log(Router.lastName,Router.name)
		function setPop(ggbody){
			var nextPopUp = {
				zIndex: (++GLOBAL.popUpIndex),
				ggbody: ggbody,
			};
			// console.log(that.state.popups)
			that.setState({
				popups: that.state.popups.concat(nextPopUp)
			});				
			// console.log(that.state.popups)
		}
	},
	scrollHandle: function(e,a) {
		var list = e.target;
		this.lazyloadImage(list);
		if (!this.isMounted()) {return ;}			
		clearTimeout(this.timeoutId);
		this.timeoutId = setTimeout(function() {
			// console.log(!this.state.noMore,!this.state.scrollLoading,document.body.scrollHeight + list.scrollTop + (-30) > list.scrollHeight)
			if (!this.state.noMore && !this.state.scrollUpdate && (document.body.scrollHeight + list.scrollTop + (-20) > list.scrollHeight)) {
				var parts = this.lastScrollParts&&(this.lastScrollParts[1]===Router.parts[1])? this.lastScrollParts:Router.parts;
				parts = parts.map(function(v,i){
					return i===2? ++v:v;
				});
				Router.init(Router.name+'&'+parts.join('.'));
				this.lastScrollParts = parts;
				this.setState({
					scrollUpdate:true
				});
				var callback = function(){
					this.setState({
						scrollUpdate:false
					})
				}.bind(this);
				switch(Router.name){
					case 'shelf':
						this.getShelfList(callback);
					break;
					case 'mall':
						this.getMallList(callback);
					break;
					case 'top':
						this.getTopList(callback);
					break;
				}
			}

			this.setState({
				scrollToBottom: document.body.scrollHeight + list.scrollTop + (-20) > list.scrollHeight
			});
		}.bind(this), 100);
	},
	reset:function(){
		// console.log(this.state.scrollUpdate)
		this.title = Router.title;
		this.setState({
			noMore:false,
			part: Router.parts[1],
			scrollUpdate: false,
			list: null
		});				
	},
	resetNav:function(){
		this.setState({
			mallNav:null,
			topNav: null
		});				
	},	
	setPart:function(){
		this.setState({
			part: Router.parts[1],
		})	
	},
	getMallList: function(callback) {
		var that = this;
		if(!that.state.mallNav){
			Router.init('mallNav&group.1');
			Router.get(function(data){
				that.setState({
					mallNav:data.pagelist
				});
				var hash = window.location.hash.substr(1).split('/')[0];
				if(hash!=='mall'){
					that.mallNavHref = hash;
				}else{
					that.mallNavHref = 'mall&page.'+data.pagelist[0].pgid+'.1.'+data.pagelist[0].blocks;					
				}
				// console.log(window.location.hash,that.mallNavHref)
				if(window.location.hash!=='#'+that.mallNavHref){
					window.location.replace('#'+that.mallNavHref);
				}else{
					Router.init(that.mallNavHref);
					getList();
				}
			});
		}else{
			if(!Router.parts.length){
				that.resetNav();
				window.location.replace('#'+that.mallNavHref);
			}else{
				getList();
			}
		}
		function getList(){
			that.setPart();
			Router.get(function(data) {
				if (!data.blocklist.length || data.blocklist.length < Router.parts[3]) {
					that.setState({
						noMore:true
					})
				}
				that.setState({
					list: that.state.scrollUpdate? that.state.list.concat(data.blocklist):data.blocklist
				});
				(typeof callback==='function')&&callback();
				//设置GLOBAL.booklist/book
				GLOBAL.setBlocklist(data.blocklist);
			});
		}
	},
	getTopList: function(callback){
		var that = this;
		if(!that.state.topNav){
			Router.init('topNav&nav.3.1.0');
			Router.get(function(data){
				that.setState({
					topNav:data.blocklist
				});
				var hash = window.location.hash.substr(1).split('/')[0];
				if(hash!=='top'){
					that.topNavHref = hash;
				}else{
					that.topNavHref = 'top&block.'+data.blocklist[0].id+'.1.0';				
				}
				if(window.location.hash!=='#'+that.topNavHref){
					window.location.replace('#'+that.topNavHref);
				}else{
					Router.init(that.topNavHref);
					getList();
				}
			});
		}else{
			if(!Router.parts.length){
				that.resetNav();
				window.location.replace('#'+that.topNavHref);
			}else{
				getList();
			}
		}
		function getList(){
			that.setPart();
			Router.get(function(data){
				if (!data || !data.length) {
					that.setState({
						noMore:true
					})
				}
				that.setState({
					list: that.state.scrollUpdate? that.state.list.concat(data):data
				});
				(typeof callback==='function')&&callback();
				//设置GLOBAL.book				
				GLOBAL.setBookName(data);				
			});			
		}
	},
	getShelfList: function(callback){
		this.resetNav();
		Router.get(function(data){
			if (!data || !data.length) {
				this.setState({
					noMore:true
				})
			}
			this.setState({
				list: this.state.scrollUpdate? this.state.list.concat(data):data
			});
			(typeof callback==='function')&&callback();
			//设置GLOBAL.book				
			GLOBAL.setBookName(data);				
		}.bind(this));
	},
	popPopUp: function() {
		// this.state.popups.forEach(function(v,i){
			// if(Router.lastName !== Router.name){
			// console.log(this.state.popups)
				this.state.popups.pop()
			// console.log(this.state.popups)
			// }
		// }.bind(this))
		this.setState({
			popups: this.state.popups
		});
	},
	getInitialState: function(){
		return {
			noMore: false,
			list: null,
			mallNav: null,
			topNav: null,
			popups: [],
			scrollUpdate: false,
			part: null
		}
	},
	componentDidMount:function(){
		if(/book_id=\d+/.test(window.location.search) && !window.location.hash){
			var bookId = window.location.search.match(/book_id=(\d+)/)[1];
			//console.log(bookId)
			window.location.hash = '#mall/introduce&introduce.'+bookId;
		}
		if(window.location.hash.length){
			Router.route = window.location.hash.substr(1).split('/');
			Router.unRendered = window.location.hash.substr(1).split('/');
			var now = Router.route.slice(-1)[0];
			Router.init(now);
			this.go();
			Router.unRendered.pop();										
		}else{
			window.location.hash = '#'+Router.now.join('&');
		}
		var that = this;
		var inter;
		var onhashchange = function(e) {
			if (e) {
				clearInterval(inter);
			}
 			var lastRoute = Router.route;
			var currentRoute = window.location.hash.substr(1).split('/');
			Router.route = currentRoute;
			//console.log(lastRoute,currentRoute)
			var li = lastRoute.length-1,
				ci = currentRoute.length-1;
			
			if(li>ci){
				// for (var i = lastL - 1; i >= currentL; i--) {
				     that.popPopUp();
					
					//console.log(Router.unRendered,currentRoute[ci])
					if (Router.unRendered.indexOf(currentRoute[ci])!==-1) {
						Router.init(currentRoute[ci]);
						that.go();
						Router.unRendered.pop();
					}else{
						Router.init(currentRoute[ci]);
					}
				// }
			}else{
				if (li == ci && currentRoute[ci] !== lastRoute[li]) {
						that.popPopUp();
					}
				// for (var i = 0; i < currentL; i++) {
					// if (!Router._rendered[ci]) {
						Router.init(currentRoute[ci]);
						that.go();
					// }
				// }
			}
		};
			var lastHash = window.location.hash;
			inter = setInterval(function() {
				var hash = window.location.hash;
				if (hash !== lastHash) {
					lastHash = hash;
					onhashchange();
				}
			}, 100);
		
			window.onhashchange = onhashchange;
		
	},
	// shouldComponentUpdate: function(nextProp,nextState){
	// 	return this.state.needUpdate !== nextState.needUpdate;
	// },
	render:function(){
		//console.log('frame render');
		var content,
			header = <Header title={this.title} left={null} right={null} />;
		var downloadTip = <DownloadTip hide={this.state.scrollToBottom} />
		switch(this.name){
			case 'mall':
				header = <Header_nav active="1" />
				content = <Mall part={this.state.part}  navList={this.state.mallNav} mallList={this.state.list} noMore={this.state.noMore} scrollHandle={this.scrollHandle} />
			break;
			case 'top':
				header = <Header title={this.title} left={null} />
				content = <Top part={this.state.part} navList={this.state.topNav} topList={this.state.list} scrollUpdate={this.state.scrollUpdate} scrollHandle={this.scrollHandle} /> 
			break;
			case 'shelf':
				header = <Header_nav active="0" />
				downloadTip = false;
				//console.log(this.state.list)
				if(this.state.list&&this.state.list.length){
					content = <Shelf shelfList={this.state.list} scrollUpdate={this.state.scrollUpdate} scrollHandle={this.scrollHandle} getShelfList={this.getShelfList} /> 					
				}else if(this.state.list&&!this.state.list.length){
					content = <EmptyShelf />
				}
			break;
			case 'user':
				header = <Header_nav active="3" />
				content = <User />
			break;
		}
		header = false;
		return (
			<div className="g-wraper">
				<div className="g-body">					
					{header}
					{content}
					{downloadTip}
				</div>
				{
					this.state.popups.map(function(data, i) {
						return (
							<div key={'popups'+i} className="gg-body" style={{'zIndex': data.zIndex}}>
								{data.ggbody}
							</div>
						);
					})
				}
			</div>
		);				
	}
});

module.exports  = Frame;