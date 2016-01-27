var Header = require('./header');
var Blocklist = require('./Blocklist');
var MallNav = require('./mallNav');
var TopNav = require('./topNav');
var Nav = require('./nav');
var Block8 = require('./block8');
var Block7 = require('./block7');
var Block0 = require('./block0');

var Page = React.createClass({
	timeoutId: null,
	list:[],
	mixins: [GLOBAL.lazyloadImageMixin()],
	noMore: false,
	noMored:function(){
		this.noMore = true;
		this.setState({
			scrollLoading: <Loading cls="u-sLoading" text="没有更多了~" />
		});				
	},
	setList:function(data){
		if (!this.flag) {
			this.list = this.list.concat(data);
		}else{
			this.list = data;
		}
	},
	handleScroll: function(e) {
		this.lazyloadImage(e.target);
		if (!this.isMounted()) {return ;}			
		var list = e.target;
		clearTimeout(this.timeoutId);
		this.timeoutId = setTimeout(function() {
			//console.log(!this.noMore,!this.state.scrollLoading,document.body.scrollHeight + list.scrollTop + (-80) > list.scrollHeight)
			if (!this.noMore && !this.state.scrollLoading && (document.body.scrollHeight + list.scrollTop + (-80) > list.scrollHeight)) {
				var parts = Router.parts.map(function(v,i){
					v = i===2? ++v:v;
					return v;
				});
				Router.init(Router.name+'&'+parts.join('.'));
				this.componentWillReceiveProps();
			}
		}.bind(this), 100);
	},
	navClick: function(e){
		var tag = e.target;
		var currentActive = tag.parentNode.querySelector('.active');
		currentActive && (currentActive.className = '');
		tag.className = 'active';
	},
	getMallNav: function () {
		Router.get(function(data){
			if(Router.route.length===1){
				var href = Router.setHref('mall&page.'+data.pagelist[0].pgid+'.1.'+data.pagelist[0].blocks);
				window.location.replace(href);
			}
			this.setState({
				pageNav:<MallNav navlist={data.pagelist} navClick={this.navClick} parts={this.state.parts}/>
			});
		}.bind(this));
	},
	getTopNav: function () {
		Router.get(function(data){
			if(Router.route.length===1){
				var href = Router.setHref('top&block.'+data.blocklist[0].id+'.1.0');
				window.location.replace(href);
			}
			this.setState({
				pageNav:<TopNav navlist={data.blocklist} navClick={this.navClick} parts={this.state.parts} />
			});
		}.bind(this));
	},
	getMallList: function() {
		Router.get(function(data) {
			if (!data.blocklist.length) {
				this.noMored()
				return;
			}
			this.setList(data.blocklist);
			this.setState({
				content: <Blocklist blocklist={this.list} />,
				parts:Router.parts,
				scrollLoading:null
			});
			//设置GLOBAL.booklist/book
			GLOBAL.setBlocklist(data.blocklist);
		}.bind(this));
	},
	getTopList: function(){
		Router.get(function(data){
			GLOBAL.setBookName(data);				
			if (!data || !data.length) {
				this.noMored()
				return;
			}
			this.setList(data);
			this.setState({
				content: <Block8 booklist={this.list} />,
				parts:Router.parts,
				scrollLoading:null
			});				
		}.bind(this));
	},
	getShelfList: function(){
		Router.get(function(data){
			GLOBAL.setBookName(data);				
			if (!data || !data.length && !this.flag) {
				this.noMored()
				return;
			}
			this.setList(data);
			this.setState({
				pageNav:null,
				content: <Block0 data={this.list} getData={this.getShelfList} />,
				scrollLoading:null
			});				
		}.bind(this));
	},
	showUser: function(){
		this.setState({
			pageNav:null,
			content: <Block0 data={this.list} getData={this.getShelfList} />,
			scrollLoading:null
		});				
	},
	getInitialState: function(){
		return {
			content: <Loading />,
			pageNav: null,
			scrollLoading: null,
			parts:[]
		}
	},
	componentDidMount: function(){
		this.componentWillReceiveProps();
	},
	componentDidUpdate: function() {
		this.lazyloadImage(this.refs.container);
		if (this.flag) {
			this.refs.container.scrollTop = 0;
		}
	},
	componentWillReceiveProps: function(nextProp){
		this.flag = Router.parts[2]==='1';
		if(this.flag){
			this.setState({
				content: <Loading />,
				scrollLoading: null
			})
		}else{
			this.setState({
				scrollLoading : <Loading cls="u-sLoading" />				
			})
		}

		switch(Router.name){
			case 'mallNav':
				this.getMallNav();
			break;
			case 'topNav':
				this.getTopNav();
			break;
			case 'mall':
				this.getMallList();
			break;
			case 'top':
				this.getTopList();
			break;
			case 'shelf':
				this.getShelfList();
			break;
			case 'user':
				this.showUser();
			break;
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state.content !== nextState.content 
				|| this.state.pageNav !== nextState.pageNav
				|| this.state.scrollLoading !== nextState.scrollLoading;
	},
	render: function(){
		return (
			<div className="g-page">
				<Header title={Router.title} left={null} />
				{this.state.pageNav}
				<div className={"g-main"}>
					<div className="g-scroll" onScroll={this.handleScroll} ref="container">
						{this.state.content}
						{this.state.scrollLoading}
					</div>
				</div>
				<Nav />
			</div>
			);
	}
});

module.exports = Page;