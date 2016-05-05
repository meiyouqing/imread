var Header = require('./header');
var Book1 = require('./book1');
var Chapterlist = require('./chapterlist');
var parseQuery = require('../modules/parseQuery');

var Detail = React.createClass({
	mixins:[Mixins()],
	getInitialState : function(){
		return {
			isOnshelf:!!this.props.book.is_self
		}
	},
	addBook: function(){
		if(this.props.isOnshelf) return;
		var cId = this.props.book.current_chapter_id,
			cOffset = this.props.book.current_chapter_offest;
		var param = [{
				bookId: this.props.bid,
				type: 3,
				time: new Date().getTime(),
				chapter_id: cId?cId:0,
				chapter_offset: cOffset?cOffset:0
		}];
		this.shelfAdding(param,this.props.onShelf);
	},
	startReading: function(){
		var readLog = storage.get('readLogNew');
		var chapterid = this.props.book.current_chapter_id,
			sourcebid = this.props.book.source_bid,
			localid   = this.props.book.bid,
			source_id = this.props.book.source_id;
		if (readLog[this.props.book.bid]){
			chapterid = readLog[this.props.book.bid].current_chapterid;
		}
		window.location.hash += ['/reading&crossDomain', sourcebid, chapterid, localid, source_id].join('.');
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.book !== nextProps.book || this.props.isOnshelf !== nextProps.isOnshelf;
	},
	render: function(){
		var cls = this.props.isOnshelf? ' disabled':'';
		var val = this.props.isOnshelf? '已加入书架':'加入书架';
		return (
			<div className="u-bookIntroduce">
				<div className="f-clearfix">
					<img src={this.props.book.big_coverlogo} className="f-fl introduce-cover"/>
					<div className="bookinfo">
						<div className="title">{this.props.book.book_name}</div>
						<div className="author">{'作者: ' + this.props.book.author}</div>
						<div className="wordCount">{'字数: ' + this.props.book.word_count + "字/"+ (this.props.book.status == "0" ? "连载中" : "已完本")}</div>
						<div className="bookSource"><b className="sourceIcon"><img src={this.props.book.icon_url} /></b><span>{this.props.book.source_name}</span></div>
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
			isOnshelf: false,
			bid: Router.parts[1],
			chapterlist: null,
			page: 1,
			page_size: 20,
			vt: 9,
			getChapterlistLoading: false,
			book: null,
			noMoreChapterlist: false,
			noData:false,
			UFO:false
		};
	},
	cacheBook: function(data) {
		var bookIntroduce = storage.get('bookIntroduce', 'array');
		if (bookIntroduce.length > 10) {
			bookIntroduce.unshift();
		}
		var flag = true;
		for (var i = 0; i < bookIntroduce.length; i++) {
			if (bookIntroduce[i].bid === data.bid) {
				flag = false;
				bookIntroduce[i] = data;
				break;
			}
		}
		if (flag) {
			bookIntroduce.push(data);
		}
		storage.set('bookIntroduce', bookIntroduce);
	},
	getBook: function(){
		Router.get(function(data){
			if(data.status_code==='500'){
				this.setState({
					noData:true
				});
				return;
			}
			data.content_id = data.bid = Router.parts[1];
			data.name = data.book_name;
			data.orderList = data.orderList.concat(data.readList);
			GLOBAL.setBookName([data]);
			this.setState({
				book: data,
				isOnshelf: !!data.is_self
			});
			this.cacheBook(data);
			Router.setTitle();
		}.bind(this), function(error){
			this.setState({
				UFO:true
			});
			//console.log(error)
		}.bind(this));
	},
	getChapterlist: function(next) {
		if (!this.isMounted() || this.state.getChapterlistLoading || this.state.noMoreChapterlist) {
			return ;
		}
		this.setState({
			getChapterlistLoading: true
		});
		Router.setAPI([['chapterlist', this.state.book.bid, this.state.page + (next ? 1 : 0), '', this.state.page_size, 0].join('.')]);

		Router.get(function(data) {
			this.setState({
				noMoreChapterlist: Math.ceil(data.totalSize / this.state.page_size) <= (this.state.page + (next ? 1 : 0)),
				chapterlist: (this.state.chapterlist || []).concat(data.chapterList),
				page: this.state.page + (next ? 1 : 0),
				getChapterlistLoading: false
			});
		}.bind(this));	
	},
	onShelf:function(){
		if(!this.isMounted()){return;}
		this.setState({
			isOnshelf:true
		})
	},
	componentWillReceiveProps: function(){
		this.setState({
			chapterlist: null
		})
	},
	componentDidMount: function() {
		var obj = parseQuery(location.search);
	      if(obj.action && obj.action=='openapp'){
	      	//console.log('imread://detail/[{"detail":[{"bid":"'+ obj.book_id+'","type":"9"}],"pushcmd":"9"}]')
	      	//var p = "imread://detail/" + encodeURI('[{"detail":[{"bid":"'+ obj.book_id+'","type":"9"}],"pushcmd":"9"}]');
	      	var p = "detail/" + encodeURI('[{"detail":[{"bid":"'+ obj.book_id +'","type":"9"}],"pushcmd":"9"}]');
			window.location.href = 'imread://'+p;
	      	//window.location.href = p;
	      }
		this.getBook();
		myEvent.setCallback('updateShelfBtn',this.onShelf)
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state.book !== nextState.book 
				|| this.state.chapterlist !== nextState.chapterlist
				|| this.state.isOnshelf !== nextState.isOnshelf
				|| this.state.getChapterlistLoading !== nextState.getChapterlistLoading
				|| this.state.noData !== nextState.noData
				|| this.state.UFO !== nextState.UFO;
	},
	render: function() {
		var header, loading, introduceTabs, detail;
		if (!this.state.book) {
			header = <Header title={GLOBAL.book[this.state.bid]} right={false} />
			loading = <Loading />
			if(this.state.noData){
				loading = <NoData />
			}
			if(this.state.UFO){
				loading = <NoData type="UFO" />
			}
		}else{
			header = <Header title={this.state.book.book_name} right={false} />
			detail = <Detail book={this.state.book} bid={this.state.bid} isOnshelf={this.state.isOnshelf} onShelf={this.onShelf} />
			introduceTabs = <IntroduceTabs key="3" source_id={this.state.book.source_id} source_bid={this.state.book.source_bid} bid={this.state.book.bid} readlist={this.state.book.orderList} getChapterlist={this.getChapterlist} getChapterlistLoading={this.state.getChapterlistLoading} book_brief={this.state.book.book_brief} chapterlist={this.state.chapterlist}/>
		}
		return (
			<div>
				{header}
				<div className="introduce-container">
					{detail}
					{introduceTabs}
					{loading}
				</div>
			</div>
		);
	}
});

var IntroduceTabs = React.createClass({
	mixins: [Mixins()],
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
						<Chapterlist hrefBase={window.location.hash} source_id={this.props.source_id} source_bid={this.props.source_bid} bid={this.props.bid} chapterlist={this.props.chapterlist} loading={this.props.getChapterlistLoading}/>
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
						var spm = [Router.pgid, Router.parts[1], 2, i+1];
						return <Book1 spm={spm} key={i} data={book} fromIntroduce="1" />
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