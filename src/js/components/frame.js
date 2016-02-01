var Header = require('./header');
var Nav = require('./nav');
var Mall = require('./mall');
var Shelf = require('./shelf');
var User = require('./user');
var Search = require('./search');

require('../../css/iconfont1.css');
require('../../css/imread.css');


//var Shelf = require('./shelf');

var Frame = React.createClass({
	timeoutId: null,
	mixins: [Mixins()],
	title:Router.title,
	lastScrollParts:null,
	go: function(refresh){
		var that = this,ggbody;
		switch(Router.name){
			case 'top':
				this.reset();
				this.name = 'mall';
				this.getTopList();
			break;
			case 'mall':
				this.reset();
				this.name = 'mall';
				this.getMallList();
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
					require('../../css/about.css')
					var About = require('./about');
					ggbody = <About />;
					setPop(ggbody);
				});
				break;
			case 'readHistory':
				require.ensure([], function(require) {
					var ReadHistory = require('./readHistory');
					ggbody = <ReadHistory />;
					setPop(ggbody);
				});
				break;
			case 'compact':
				require.ensure([], function(require) {
					require('../../css/compact.css')
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
			case 'balance':
				require.ensure([],function(require){
					var Balance = require('./balance');
					ggbody = <Balance popup={setPop} />
					setPop(ggbody);
				})
				break;
			case 'introduce':
				require.ensure([],function(require){
					require('../../css/introduce.css')
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
					require('../../css/reading.css');
					var Reading = require('./reading');
					ggbody = <Reading localid={Router.parts[3]} popup={setPop} />
					setPop(ggbody);
				})
				break;
			case 'recentRead':
				require.ensure([],function(require){
					var RecentRead = require('./recentRead');
					ggbody = <RecentRead />
					setPop(ggbody);
				})
				break;
			case 'tag':
				require.ensure([],function(require){
					var Tag = require('./tag');
					ggbody = <Tag />
					setPop(ggbody);
				})
				break;
			case 'bookSheet':
				require.ensure([],function(require){
					var BookSheet = require('./bookSheet');
					ggbody = <BookSheet />
					setPop(ggbody);
				})
				break;
			default:
				if(refresh){Router.goBack();}
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
	popup:function(component){
		var nextPopUp = {
			zIndex: (++GLOBAL.popUpIndex),
			ggbody: component,
		};
		// console.log(that.state.popups)
		that.setState({
			popups: that.state.popups.concat(nextPopUp)
		});				
	},
	scrollHandleCallback: function() {
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
			// case 'shelf':
			// 	this.getShelfList(callback);
			// break;
			case 'mall':
				this.getMallList(callback);
			break;
			case 'top':
				this.getTopList(callback);
			break;
		}
	},
	reset:function(){
		// console.log(this.state.scrollUpdate)
		this.title = Router.title;
		this.lastScrollParts = null;
		this.setState({
			noMore:false,
			part: Router.parts[1],
			scrollUpdate: false,
			list: null,
			onerror: false
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
			part: Router.parts[1]
		})	
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
		//console.log(error);
	},
	getMallList: function(callback) {
		var that = this;
		if(!that.state.mallNav){
			Router.setAPI(['group.1']);
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
			},that.onerror);
		}else{
			if(Router.parts.length<2){
				that.resetNav();
				window.location.replace('#'+that.mallNavHref);
			}else{
				getList();
			}
		}
		function getList(){
			that.setPart();
			Router.get(function(data) {
				if(!data.blocklist){return}
				if (!data.blocklist.length) {
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
			},that.onerror);
		}
	},
	getTopList: function(callback){
		var that = this;
		var forceGetJSON = GLOBAL.forceGetJSON;
		// if(!that.state.topNav){
			Router.setAPI(['group.6']);
			Router.get(function(data){
				var hash = window.location.hash.substr(1).split('/')[0];
				if(hash!=='top'){
					that.topNavHref = hash;
				}else{
					that.topNavHref = 'top&page.'+data.pagelist[0].pgid+'.1.'+data.pagelist[0].blocks;				
				}
				// if(window.location.hash!=='#'+that.topNavHref){
				// 	window.location.replace('#'+that.topNavHref);
				// }else{
					Router.init(that.topNavHref);
					GLOBAL.forceGetJSON = forceGetJSON;
					getList();
				// }
			},that.onerror);
		// }else{
		// 	if(Router.parts.length<2){
		// 		that.resetNav();
		// 		window.location.replace('#'+that.topNavHref);
		// 	}else{
		// 		getList();
		// 	}
		// }
		function getList(){
			//that.setPart();
			if(!that.isMounted()){return;}
			console.log(GLOBAL.forceGetJSON)
			Router.get(function(data){
				myEvent.setCallback('updateTopList',that.getTopList);
				if (!data || !data.length) {
					that.setState({
						noMore:true
					})
				}
				that.setState({
					list: data.blocklist
				});
				(typeof callback==='function')&&callback();
				//设置GLOBAL.book				
				GLOBAL.setBlocklist(data.blocklist);				
			},that.onerror);			
		}
	},
	getShelfList: function(callback){
		this.resetNav();
		Router.get(function(data){
			// if (!data || !data.length) {
			// 	this.setState({
			// 		noMore:true
			// 	})
			// }
			this.setState({
				list: data
			});
			// (typeof callback==='function')&&callback();
			//设置GLOBAL.book				
			GLOBAL.setBookName(data);				
		}.bind(this),this.onerror);
	},
	popPopUp: function() {
		if(!this.state.popups.length){return}
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
			part: null,
			onerror: false
		}
	},
	componentDidMount:function(){
		if(/book_id=\d+/.test(window.location.search) && !window.location.hash){
			var bookId = window.location.search.match(/book_id=(\d+)/)[1];
			//console.log(bookId)
			window.location.hash = '#mall/introduce.'+bookId;
		}
		if(window.location.hash.length){
			Router.route = window.location.hash.substr(1).split('/');
			Router.unRendered = window.location.hash.substr(1).split('/');
			var now = Router.route.slice(-1)[0];
			Router.init(now);
			this.go(true);
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
				Router.init(currentRoute[ci]);
				for (var i = li; i > ci; i--) {
				     that.popPopUp();
				     if (Router.unRendered.indexOf(lastRoute[i])!==-1) {
				     	Router.unRendered.pop();
				     }				
				}
				if (Router.unRendered.indexOf(currentRoute[ci])!==-1) {
					Router.unRendered.pop();
					that.go();
				}else if(currentRoute[ci]!==lastRoute[ci]){
					Router.unRendered.pop();
					that.go();
				}
			}else{
				if (li == ci && currentRoute[ci] !== lastRoute[li]) {
					that.popPopUp();
				}
				// for (var i = li; i < ci; i++) {
					Router.init(currentRoute[ci]);
					that.go();
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
		switch(this.name){
			case 'mall':
				header = <Header title={this.title} left={null} />
				content = <Mall part={this.state.part}  navList={this.state.mallNav} mallList={this.state.list} noMore={this.state.noMore} scrollHandle={this.scrollHandle} />
			break;
			// case 'top':
			// 	header = <Header title={this.title} left={null} />
			// 	content = <Top part={this.state.part} navList={this.state.topNav} topList={this.state.list} scrollUpdate={this.state.scrollUpdate} scrollHandle={this.scrollHandle} /> 
			// break;
			case 'shelf':
				//console.log(this.state.list)
				if(this.state.list&&this.state.list.length){
					content = <Shelf shelfList={this.state.list} getShelfList={this.getShelfList} /> 					
				}else if(this.state.list&&!this.state.list.length){
					content = (<div className="g-main"><NoData type='emptyShelf' /></div>);
				}
			break;
			case 'user':
				header = false
				content = <User />
			break;
		}
		if(this.state.onerror){
			content = (<div className="g-main"><NoData type="UFO" /></div>);
		}
		return (
			<div className="g-wraper">
				<div className="g-body">					
					{header}
					{content}
					<Nav name={Router.name} />
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