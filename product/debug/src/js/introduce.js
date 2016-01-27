var Header = require('./header');
var getJSON = require('./getJSON').getJSON;
var Book1 = require('./book1');
var myEvent = require('./myEvent');
var Chapterlist = require('./chapterlist');

var Detail = React.createClass({
	getInitialState : function(){
		return {
			isOnshelf:!!this.props.book.is_self
		}
	},
	addBook: function(){
		var that = this;
		if(this.state.isOnshelf) return;
		function addBookCallback() {
			var cId = that.props.book.current_chapter_id,
				cOffset = that.props.book.current_chapter_offest;
			var param = [{
					bookId: that.props.bid,
					type: 3,
					time: new Date().getTime(),
					chapter_id: cId?cId:0,
					chapter_offset: cOffset?cOffset:0
			}];
			Router.ajax('addBook', {param:JSON.stringify(param)},function(data){
				// console.log(data);
				that.setState({
					isOnshelf:true
				});			
			});
		}
		if(!GLOBAL.cookie('userPhone')){
			var hash = window.location.hash+'/login';
			window.location.replace(hash);
			myEvent.setCallback('login', addBookCallback);
			return;
		}
		addBookCallback();
		// localStorage.setItem('bid'+book.local_bid,JSON.stringify(book));
	},
	startReading: function(){
		var readLog = GLOBAL.readLog[this.props.book.bid];
		var chapterid = this.props.book.current_chapter_id,
			sourcebid = this.props.book.source_bid,
			localid   = this.props.book.bid;
		if (!this.state.isOnshelf && readLog){
			chapterid = readLog.current_chapterid;
		}
		window.location.hash += ['/reading&crossDomain', sourcebid, chapterid, localid].join('.');
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.book !== nextProps.book || this.state.isOnshelf !== nextState.isOnshelf;
	},
	render: function(){
		var cls = this.state.isOnshelf? ' disabled':'';
		var val = this.state.isOnshelf? '已加入书架':'加入书架';
		return (
			<div className="u-bookIntroduce">
				<div className="f-clearfix">
					<img src={this.props.book.big_coverlogo} className="f-fl introduce-cover"/>
					<div className="bookinfo">
						<div className="title">{this.props.book.book_name}</div>
						<div className="author">{'作者: ' + this.props.book.author}</div>
						<div className="wordCount">{'字数: ' + this.props.book.word_count + "字"}</div>
						<div className="bookState">{'状态: ' + (this.props.book.status == "0" ? "连载中" : "已完本")}</div>
					</div>
				</div>
				<div className="buttons f-clearfix">
					<a className="readButton button f-fl" onClick={this.startReading}>开始阅读</a>
					<button className={"button f-fr"+cls} onClick={this.addBook}>{val}</button>
				</div>
			</div>
		);
	}
});
var Introduce = React.createClass({
	getInitialState: function() {
		return {
			bid: Router.parts[1],
			chapterlist: null,
			page: 1,
			page_size: 20,
			vt: 9,
			getChapterlistLoading: false,
			book: null,
			noMoreChapterlist: false
		};
	},
	getBook: function(){
		Router.get(function(data){
			data.bid = Router.parts[1];
			data.orderList = data.orderList.concat(data.readList);
			GLOBAL.setBookName(data);
			this.setState({
				book: data
			})
		}.bind(this));
	},
	getChapterlist: function(next) {
		if (this.state.getChapterlistLoading || this.state.noMoreChapterlist) {
			return ;
		}
		this.setState({
			getChapterlistLoading: true
		});
		Router.init(['chapterlist&chapterlist', this.state.book.bid, this.state.page + (next ? 1 : 0), '', this.state.page_size, 0].join('.'));

		Router.get(function(data) {
			this.setState({
				noMoreChapterlist: Math.ceil(data.totalSize / this.state.page_size) <= (this.state.page + (next ? 1 : 0)),
				chapterlist: (this.state.chapterlist || []).concat(data.chapterList),
				page: this.state.page + (next ? 1 : 0),
				getChapterlistLoading: false
			});
		}.bind(this));	
	},
	componentWillReceiveProps: function(){
		this.setState({
			chapterlist: null
		})
	},
	componentDidMount: function() {
		this.getBook();
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state.book !== nextState.book 
				|| this.state.chapterlist !== nextState.chapterlist
				|| this.state.getChapterlistLoading !== nextState.getChapterlistLoading;
	},
	render: function() {
		var header, loading, introduceTabs, detail;
		if (!this.state.book) {
			header = <Header key="1" title={GLOBAL.book[this.state.bid]} right={false} />
			loading = <Loading key="2" />
		}else{
			header = <Header key="1" title={this.state.book.book_name} right={false} />
			detail = <Detail key="2" book={this.state.book} bid={this.state.bid} />
			introduceTabs = <IntroduceTabs key="3" source_bid={this.state.book.source_bid} bid={this.state.book.bid} readlist={this.state.book.orderList} getChapterlist={this.getChapterlist} getChapterlistLoading={this.state.getChapterlistLoading} book_brief={this.state.book.book_brief} chapterlist={this.state.chapterlist}/>
		}
		return (
			<div>
				{header}
				<div className="introduce-container">
					{detail}
					{introduceTabs}
				</div>
				{loading}
			</div>
		);
	}
});

var IntroduceTabs = React.createClass({
	mixins: [GLOBAL.lazyloadImageMixin()],
	getInitialState: function() {
		return {
			current: 0,
			fixTabbar: false
		};
	},
	shouldComponentUpdate: function(nextProps, netxtState) {
		if (this.props.bid !== nextProps.bid) {
			this.toggleTab(null, '', 0);
			return false;
		}
		return true;
	},
	toggleTab: function(e) {
		var index = 0;
		for (var i = 0; i < e.target.parentNode.children.length; i++) {
			if (e.target === e.target.parentNode.children[i]) {
				index = i;
				break;
			}
		}
		this.setState({
			current: index
		});

		if (index == 1 && !this.props.chapterlist) {
			this.props.getChapterlist();
		}
	},
	timeout: {},
	componentDidMount: function() {
		var containers = document.getElementsByClassName("introduce-container");
		if (!containers.length) {return ;}
		var container = containers[containers.length - 1];
		var self = this;
		var OFFSETTOP = 246;
		container.onscroll = function(e) {
			clearTimeout(self.timeout['fixTabbar']);
			self.timeout['fixTabbar'] = setTimeout(function() {
				self.setState({
					fixTabbar: container.scrollTop > 202
				});
			}, 100);
			if (self.state.current == 2) {
				self.lazyloadImage(container);
			} else if (self.state.current == 1) {
				if (container.scrollTop + document.body.scrollHeight + 100 > container.scrollHeight) {
					clearTimeout(self.timeout['scroll']);
					self.timeout['scroll'] = setTimeout(function() {
						self.props.getChapterlist(true);
					}, 100);
				}
			}
		};
	},
	componentDidUpdate: function() {
		if (this.state.current == 2) {
			var containers = document.getElementsByClassName("introduce-container");
			if (!containers.length) {return ;}
			var container = containers[containers.length - 1].parentNode;
			this.lazyloadImage(container);
		}
	},
	render: function() {
		var fixTabbar = this.state.fixTabbar ? "u-fixTabbar" : "";
		return (
			<div className="u-tabs u-bookIntroduce">
				<div className={fixTabbar}>
					<div className={"u-tabbar"} ref="tabbar">
						<span onClick={this.toggleTab} className={"tab tab-0" + (this.state.current == 0 ? ' active' : '')}>简介</span>
						<span onClick={this.toggleTab} className={"tab tab-1" + (this.state.current == 1 ? ' active' : '')}>目录</span>
						<span onClick={this.toggleTab} className={"tab tab-2" + (this.state.current == 2 ? ' active' : '')}>推荐</span>
					</div>
				</div>
				<div className="contents" ref="contents">
					<div className={"content content-0" + (this.state.current == 0 ? ' active' : '')}>{this.props.book_brief}</div>
					<div className={"content content-1" + (this.state.current == 1 ? ' active' : '')}>
						<Chapterlist hrefBase={window.location.hash} source_bid={this.props.source_bid} bid={this.props.bid} chapterlist={this.props.chapterlist} loading={this.props.getChapterlistLoading}/>
					</div>
					<div className={"content content-2" + (this.state.current == 2 ? ' active' : '')}>
						<Readlist readlist={this.props.readlist} />
					</div>
				</div>
			</div>
		);
	}
});

var Readlist = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.readlist !== nextProps.readlist;
	},
	render: function() {
		var loading, content;
		if (!this.props.readlist) {
			loading = <Loading />
		} else {
			content = (
				<ul>
				{
					this.props.readlist.map(function(book, i) {
						return <Book1 key={i} data={book} />
					})
				}
				</ul>
			)
		}
		return (
			<div>
				{loading}
				{content}
			</div>
		);
	}
});

module.exports  = Introduce;