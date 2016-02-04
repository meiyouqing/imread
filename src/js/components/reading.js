var Header = require('./header');
var getJSON = require('../modules/getJSON').getJSON;
var Chapterlist = require('./chapterlist');
var readingStyle = require('../modules/readingStyle');
var bookContent = require('../modules/bookContent');
var uploadLog = require('../modules/uploadLog');
var Intercut = require('./intercut');
var Hammer = require('../modules/hammer');


var styleMixins = {
	cloneStyle: function(style) {
		var cloneStyle = {};
		for (var key in style) {
			cloneStyle[key] = style[key];
		}
		return cloneStyle;
	},
	toggleNightStyle: function(e) {
		e.stopPropagation();
		var style = this.cloneStyle(this.state.style);
		style.night = (+style.night) ^ 1;
		this.setState({
			style: style,
			showSettingFont: false
		});
		readingStyle.set(style);
	},
	toggleSettingFont: function(e) {
		e.stopPropagation();
		this.setState({
			showSettingFont: !this.state.showSettingFont
		});
	},
	setFontBg: function(e) {
		e.stopPropagation();
		var bg = e.target.getAttribute('data-id');
		var style = this.cloneStyle(this.state.style);
		style.bg = bg;
		style.night = 0;
		this.setState({
			style: style
		});
		readingStyle.set(style);
	},
	setFontHeight: function(e) {
		e.stopPropagation();
		var height = e.target.getAttribute('data-id');
		var style = this.cloneStyle(this.state.style);
		style.lineheight = height;
		this.setState({
			style: style
		});
		readingStyle.set(style);
	},
	setFontSize: function(offset) {
		var style = this.cloneStyle(this.state.style);
		style.fontSize = Math.min(Math.max(style.fontSize + offset, 1), 5);
		this.setState({
			style: style
		});
		readingStyle.set(style);
	},
	setFontSm: function(e) {
		e.stopPropagation();
		this.setFontSize(-1);
	},
	setFontLg: function(e) {
		e.stopPropagation();
		this.setFontSize(1);
	},
	setFontFamily: function(e) {
		e.stopPropagation();
		var family = e.target.getAttribute('data-id');
		var style = this.cloneStyle(this.state.style);
		style.fontFamily = family;
		this.setState({
			style: style
		});
		readingStyle.set(style);
	}
};

var chapterMixins = {
	getChapterlist: function(next) {
		if (this.state.getChapterlistLoading) {
			return ;
		}
		next = next || 0;
		if (this.state.page + next < 1 || this.state.page + next > this.state.pages) {return;}
		this.setState({
			getChapterlistLoading: true
		});
		Router.setAPI([['chapterlist', Router.parts[3], this.state.page + next , '', this.state.page_size, 0].join('.')]);

		Router.get(function(data) {
			this.setState({
				pages: Math.ceil(+data.totalSize / this.state.page_size),
				chapterlist: data.chapterList,
				page: this.state.page + next,
				getChapterlistLoading: false
			});
			for (var i = 0; i < data.chapterList.length; i++) {
				if (data.chapterList[i].cid == this.state.chapterid && data.chapterList[i].intercut) {
					//处理插页广告
					var intercut = data.chapterList[i].intercut;				
					GLOBAL.loadImage(intercut.intercut_url, function() {
						this.setState({
							intercut: intercut
						});
					}.bind(this));
				}
			}
		}.bind(this));	
	},
	prevPage: function() {
		this.getChapterlist(-1);
	},
	nextPage: function() {
		this.getChapterlist(1);
	},
	prevChapter: function() {
		if (!this.state.data.preChapterId) {
			return this.alert('已经是第一章了', -1);
		}
		this.goToChapter(this.state.data.preChapterId);
	},
	nextChapter: function() {
		if (!this.state.data.nextChapterId) {
			return this.alert('已经是最后一章了', 1);
		}
		this.goToChapter(this.state.data.nextChapterId);
	},
	goToChapter: function(chapterid, Offset) {
		if (!chapterid) {return ;}
		window.location.replace(window.location.hash.replace(/reading\&crossDomain\.(\d+)\.(\d+)/, function($1, $2, $3) {
			return 'reading&crossDomain.' + $2 + '.' + chapterid;
		}.bind(this)));
	},
	handleClickChapter: function(e) {
		this.goToChapter(e.target.getAttribute('data-cid'));
	}
};

var Reading = React.createClass({
	isOnShelf: true,
	chargeMode: 1,
	chapterCount: '1',
	readTime: 1000,
	mixins: [styleMixins, chapterMixins, Mixins()],
	getInitialState: function() {
		return {
			bookName: '艾美阅读',
			chapterName: '',
			style: readingStyle.get(),
			data: null,
			loading: true,
			getChapterlistLoading: false,
			page: 1,
			pages: 1,
			page_size: 20,
			vt: 9,
			bid: Router.parts[1],
			chapterid: Router.parts[2],
			source_id: Router.parts[4],
			showSetting: false,
			showChapterlist: false,
			showSettingFont: false,
			chapterlist: [],
			showGuide: false,
			UFO:false,
			order: false,
			intercutList: false, //呼出页广告
			showIntercut: false, //是否显示呼出页广告
			intercut: false //插页广告
		}
	},
	cacheReadLog: function(readLog) {
		var bookIntroduce = {};
		var readLogs = storage.get('readLogNew');
		var books = storage.get('bookIntroduce', 'array');
		for (var i = 0; i < books.length; i++) {
			if (books[i].bid == readLog.content_id) {
				bookIntroduce = books[i];
				break;
			}
		}
		readLog.name = bookIntroduce.book_name;
		readLog.author = bookIntroduce.author;
		readLog.big_coverlogo = bookIntroduce.big_coverlogo;
		readLog.recent_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
		readLog.source_bid = this.state.bid;
		readLog.source_id = this.state.source_id;
		readLog.chapter_id = this.state.chapterid;
		readLogs[readLog.content_id] = readLog;
		storage.set('readLogNew', readLogs);
	},
	addRecentRead: function(bid, chapterid) {
		if (!this.state.data) {return ;}
		//console.log(this.state)
		var readLog = [{
			content_id: bid,
			current_chapterid: chapterid,
			current_time:(new Date()).Format('yyyyMMddhhmmss'),
			chapter_offset:0,
			read_time: (new Date()).Format('yyyyMMddhhmmss'),
			chapter_name: this.state.data.name,
			chapter_read_time: this.readTime,
			playorder: this.state.data.chapterSort
		}];
		if (this.isLogin()) {
			uploadLog.send('read', {readLog:JSON.stringify(readLog)});
			//getJSON('POST', '/api/upload/log', {readLog:JSON.stringify(readLog)}, function(data) {}, GLOBAL.noop);
		}

		this.cacheReadLog(readLog[0]);

		myEvent.execCallback('reading' + bid, true);
		myEvent.execCallback('reading' + bid + '-fromReading', true);
	},
	componentWillUnmount: function() {
		this.readTime = Date.now()-this.time;
		this.addRecentRead(this.props.localid, this.state.chapterid);
	},
	goOut:function(e){
		var addShelf = function() {
			var param = [{
				bookId: Router.parts[3],
				type: 3,
				time: new Date().getTime(),
				chapter_id: this.state.chapterid,
				chapter_offset: 0
			}];
			this.shelfAdding(param,function(){
				myEvent.execCallback('updateShelfBtn');
				Router.goBack();
			});
		}.bind(this);
		this.isOnShelf = GLOBAL.onShelf[Router.parts[3]]? 1:this.isOnShelf;
		if(!this.isOnShelf){
			POP.confirm('是否将该书加入书架？',addShelf,Router.goBack.bind(Router));
		}else{
			myEvent.execCallback('refreshShelf');
			Router.goBack();			
		}
	},
	getFormatContent: function(content) {
		//console.log(content)
		var passages = content
							.replace(/&amp;/g, '&')
							.replace(/(&\#160;){2,4}|\s{2,4}/g, '<br/>')
							.replace(/&ldquo;/g, '“')
							.replace(/&rdquo;/g, '”')
							.replace(/&nbsp;/g, '')
							.replace(/&middot;/g, '·')
							.replace(/\<img[^\>]+src='([^\>]+)'[^\>]*\/\>/g, function($1, $2) {
								//return "<img src='" + 'http://wap.cmread.com' + $2 + "' />";
								return '';
							}).split(/\<br\s*\/\>/);

		//按段落处理引号，防止错误一个所有的配对出错，这样最多影响一段
		for (var i = 0; i < passages.length; i++) {
			passages[i] = passages[i].replace(/&quot;([^(&quot;)]*)&quot;/g, function($1, $2) {
				return '“' + $2 + '”';
			})
		}
		return passages;
		//return '<p>' + passages.join('</p><p>')  + '</p>'
	},
	closeIntercut: function() {
		this.setState({
			intercutList: false,
			showIntercut: false
		});
	},
	getIntroduce: function(callback){
		var that = this;
		if(!this.isMounted()){return;}
		getJSON('GET','/api/book/introduce',{bid:Router.parts[3]},function(data){
			todo(data);
		},GLOBAL.noop);			
		function todo(data){
			that.setState({
				bookName : data.book_name
			});
			that.chapterCount = data.chapter_count;
			that.chargeMode = +data.charge_mode;
			that.isOnShelf = +data.is_self;
			that.getAD_block5(data);
			if(typeof callback==='function'){callback()}
		}
	},
	getAD_block5: function(data){
		var that = this;
		if (data.intercutList && data.intercutList.length) {
			require.ensure(['./block5'],function(require){
				var Block5 = require('./block5');
				var randIndex = Math.floor(Math.random() * data.intercutList.length) % data.intercutList.length;
				that.intercut_id = data.intercutList[randIndex].content_id;
				
				//广告图片加载好之后再显示广告
				GLOBAL.loadImage(data.intercutList[randIndex].intercut_url, callback);
				
				function callback() {
					var intercutList = (
						<div>
							<Block5 data={{
								contentlist: [data.intercutList[randIndex]]
							}} spm={[]} type="11" fromReading={true} />
							<span className="iconfont icon-close" onClick={that.closeIntercut}></span>
						</div>
					);
					that.intercutList = data.intercutList[randIndex];
					if(!that.isMounted()){return;}
					that.setState({
						intercutList: intercutList,
						showIntercut: true
					});
				}
			});
		}
	},
	gotContent: function(data,autoPay){
		//如果是付费章节，跳到确认订单
		if(!this.isMounted()){return;}
		var that = this;
		//设置auto pay cookie
		if(autoPay){
			GLOBAL.cookie(that.state.bid,'autoPay',7)
		}
		if(data.pageType==='order'){
			if(GLOBAL.cookie(that.state.bid)==='autoPay'){
				that.autoPay(data);
				return;
			}
			that.setState({
				order: true
			})
			that.getIntroduce(that.confirmOrder.bind(that,data));
			return;
		}
		that.getIntroduce();
		//that.getChapterlist();
		data.content = that.getFormatContent(data.content);
		var currentPage = Math.ceil(+data.chapterSort / that.state.page_size);
		that.setState({
			data: data,
			loading: false,
			page: currentPage,
			pages: currentPage,
			order: false
		}, that.getChapterlist);
		that.getNextContent(data);
	},
	getContent: function() {
		if(!this.isMounted()){return;}
		var nextChapter = storage.get('nextChapter');
		//console.log(nextChapter.nextChapterId,this.state.chapterid)
		if((nextChapter.nextChapterId-1)==this.state.chapterid){
			this.gotContent(nextChapter);
			return;
		}
		this.setState({
			loading: true
		});
		var that = this;
		bookContent.get({
			bid: that.state.bid,
			cid: that.state.chapterid,
			source_id : Router.parts[4],
			callback: that.gotContent,
			onError: function(res){
				if(!that.isLogin()){
					that.setState({
						order: true
					})
					that.goLogin(that.getContent);
					return;
				}
				GLOBAL.defaultOnError(res);
			}
		});
	},
	getNextContent: function(data) {
		if(!this.isMounted()){return;}
		var that = this;
		bookContent.get({
			bid: that.state.bid,
			cid: data.nextChapterId,
			source_id : Router.parts[4],
			callback: function(data){
				storage.set('nextChapter',data);
			}.bind(this),
			onError: GLOBAL.noop
		});
	},	
	confirmOrder: function(data){
		var that = this;
		that.setState({
			chapterName : data.name
		})
		if(that.isLogin()){
			goOrder();
		}else{
			that.goLogin(goOrder);
		}
		function goOrder(){
			window.location.replace(Router.setHref('confirmOrder'));
			require.ensure([], function(require) {
				var Order = require('./order');
				that.props.popup(<Order 
					paySuccess={that.gotContent} 
					data={data} 
					bookName={that.state.bookName} 
					chargeMode={that.chargeMode} 
					chapterCount={that.chapterCount} />);
			});						
		}
	},
	autoPay: function(orderData) {
		//console.log(orderData);	
		var that = this;
		if(that.isLogin()){
			pay();
		}else{
			that.goLogin(pay);
		}
		function pay(){	
			getJSON('GET','/api/auth/balance',{},function(data){
				var aidou= data.success.balance/100;
				if((aidou-orderData.marketPrice)>=0){
					getJSON('GET',orderData.orderUrl,{},function(data){
						that.gotContent(data);
					});
				}else{
					that.setState({
						order: true
					})
					that.getIntroduce(that.confirmOrder.bind(that,orderData));
					// if(confirm('艾豆不足，请充值')){
					// 	that.getIntroduce(that.confirmOrder.bind(that,orderData));
					// }
				}
			})
		}
	},
	//type -1 为第一章， 1位最后一章
	alert: function(msg, type) {
		if (!this['hasAlert' + type]) {
			POP._alert(msg);
			this['hasAlert' + type] = 1;
			return true;
		}
		return false;
	},
	//当前章节翻页
	offsetPage: function(offset) {
		if(!this.isMounted()){return;}
		this.setState({
			showSetting: false
		});
		var scrollarea = this.refs.scrollarea;
		var height = document.body.offsetHeight * offset;
		var scrollHeight = scrollarea.scrollHeight;
		if (scrollarea.scrollTop < 10 && offset < 0) {
			return this.prevChapter();
		} else if (scrollarea.scrollTop > scrollHeight - document.body.offsetHeight - 10 && offset > 0) {
			return this.nextChapter();
		}
		scrollarea.scrollTop = Math.max(0, Math.min(scrollarea.scrollTop + height, scrollHeight - height));
	},
	toggleSettings: function(closeChapterlist) {
		if(!this.isMounted()){return;}
		if (!this.state.showSetting && this.state.showIntercut) {
			uploadLog.send('intercut', {
				content_id: this.intercutList.content_id,
				event: 1,
				show_class: this.intercutList.show_class
			});
		}
		this.setState({
			showSetting: !this.state.showSetting,
			showChapterlist: closeChapterlist && false || this.state.showChapterlist
		});
	},
	componentDidMount:function(){
		this.getContent();
		this.time = Date.now();
		if (GLOBAL.cookie('showGuide') != '1') {
			this.setState({
				showGuide: true
			});
			GLOBAL.cookie('showGuide', '1', {
				expires: 1000
			});
		}
	},
	handlePullToRrefresh: function(e) {
		var scrollY = this.refs.scrollarea.scrollTop;
		switch(e.type) {
			case "pandown":
				if (scrollY > 5) {
					return ;
				} else {
					this.refs.tip_top.classList.remove("f-hide");
				}
				break;
			case "panend":
				break;
		}
	},
	componentDidUpdate: function() {
		// var that = this;
		var scrollarea = this.refs.scrollarea;
		if (scrollarea && scrollarea.getAttribute('data-events') != '1') {
			scrollarea.setAttribute('data-events', '1');
			var hammerTime = new Hammer(scrollarea);
			hammerTime.on('tap', this.handleClick);
			hammerTime.on("pandown panend", this.handlePullToRrefresh);
		}
	},
	toggleChapterlist: function() {
		if (!this.state.showChapterlist && !this.state.chapterlist.length) {
			this.getChapterlist();
		}
		this.setState({
			showChapterlist: !this.state.showChapterlist,
			showSetting: this.state.showChapterlist
		});
	},
	handleClick: function(e) {
		var y = e.center.y;
		var h = document.body.offsetHeight;
		if (y < 0.3 * h) {
			//top
			this.offsetPage(-1);
		} else if (y < 0.7 * h) {
			//middle
			this.toggleSettings();
		} else {
			//bottom
			this.offsetPage(1);
		}
	},
	handleScroll: function(e) {
		if (this.state.showSetting) {
			this.toggleSettings(1);
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state.loading !== nextState.loading 
				|| this.state.data !== nextState.data
				|| this.state.showChapterlist !== nextState.showChapterlist
				|| this.state.showSettingFont !== nextState.showSettingFont
				|| this.state.chapterlist !== nextState.chapterlist
				|| this.state.getChapterlistLoading !== nextState.getChapterlistLoading
				|| this.state.showGuide !== nextState.showGuide
				|| JSON.stringify(this.state.style) !== JSON.stringify(nextState.style)||true;
	},
	
	hideGuide:function(e) {
		if(!this.isMounted()){return;}
		this.setState({
			showGuide: false
		});
	},
	render:function(){
		var currentRoute = window.location.hash.split('/');
		currentRoute.pop();
		var ChapterlistHrefBase = currentRoute.join('/');
		var head = <Header title={this.state.bookName} right={null} />;
		var className = readingStyle.getClass(this.state.style);
		var intercut;
		if(this.state.UFO){
			return (
				<div>
					{head}
					<div className="g-main g-main-1">
						<NoData type="UFO" />
					</div>
				</div>
			);
		}
		if(this.state.order){
			return (
				<div>
					{head}
					<div className="g-main">
						<h3 className="f-mt-30 f-tc">{this.state.chapterName}</h3>
						<p className="u-loading">本节为付费章节</p>
						<div className="u-loading f-tc" style={{marginTop:'30px'}}><input type="button" className="u-btn" onClick={this.getContent} value="去支付" /></div>
					</div>
				</div>
				);
		}
		if(this.state.loading) {
			return (
				<div>
					{head}
					<i className="u-loading u-book-loading">努力加载中...</i>
				</div>
			);
		}
		if (this.state.intercut) {
			intercut = <Intercut data={this.state.intercut} />

			if (!this.uploadLogIntercut) {
				uploadLog.send('intercut', {
					intercut_id: this.state.intercut.content_id,
					event: 1,
					show_class: this.state.intercut.show_class
				});
				this.uploadLogIntercut = true;
			}
		}
		return (
			<div>
				<div className={"u-readingsetting" + (!this.state.showSetting && ' f-hide' || '')}>
					<div className="u-settings u-settings-top">
						<div className="iconfont icon-back" onClick={this.goOut}></div>
						<span className="title f-ellipsis">{this.state.data.name}</span>

						<div className={this.state.showIntercut ? "" : "f-hide"}>
							{this.state.intercutList}
						</div>
					</div>
					<div className={"u-settings u-settings-font" + (!this.state.showSettingFont && ' f-hide' || '')}>
						<div className="setting-fontfamily setting-font-line f-flexbox">
							<div className="title">字体</div>
							{
								['默认', '宋体', '黑体', '楷体'].map(function(font, i) {
									return <div className={"item f-flex1" + (this.state.style.fontFamily == (i + 1) ? ' active' : '')} onClick={this.setFontFamily} data-id={i + 1} key={i}>{font}</div>;
								}.bind(this))
							}
						</div>
						<div className="setting-fontsize setting-font-line f-flexbox">
							<div className="title">字号</div>
							<div className={"item f-flex1" + (this.state.style.fontSize == 1 ? ' active': '')} onClick={this.setFontSm}>A-</div>
							<div className={"item f-flex1" + (this.state.style.fontSize == 5 ? ' active': '')} onClick={this.setFontLg}>A+</div>
						</div>
						<div className="setting-line-height setting-font-line f-flexbox">
							<div className="title">排版</div>
							{
								['icon-lh3', 'icon-lh2', 'icon-lh1'].map(function(icon, i) {
									return <div className={"item f-flex1" + (this.state.style.lineheight == (i + 1) ? ' active' : '')} onClick={this.setFontHeight} data-id={i + 1} key={i}><span className={"iconfont " + icon}></span></div>
								}.bind(this))
							}
						</div>
						<div className="setting-bg setting-font-line f-flexbox">
							<div className="title">背景</div>
							{
								[1, 2, 3, 4].map(function(dataid, i) {
									return (
										<div className={"item f-flex1 bg-" + dataid + (this.state.style.bg == dataid ? ' active' : '')} onClick={this.setFontBg} data-id={dataid} key={i}>
											<div className="active-border"></div>
										</div>
									)
								}.bind(this))
							}
						</div>
					</div>
					<div className="u-settings u-settings-bottom f-flexbox">
						<a className="u-settingitem f-flex1" onClick={this.toggleChapterlist}><span className="iconfont u-icon icon-menu"></span></a>
						<a className="u-settingitem f-flex1" onClick={this.toggleSettingFont}><span className="iconfont u-icon icon-fsize"></span></a>
						<a className="u-settingitem f-flex1" onClick={this.toggleNightStyle}><span className={"iconfont u-icon icon-moon" + (this.state.style.night ? ' icon-sun' : '')}></span></a>
					</div>
				</div>
				<section className={"u-chapterlistc" + (this.state.showChapterlist && ' active' || '')}>
					<div className="u-chapterlist">
						<div className="u-bookname f-ellipsis">
							{this.state.data.name}
						</div>
						<div className="u-scroll-y">
							<Chapterlist hrefBase={ChapterlistHrefBase} chapterlist={this.state.chapterlist} source_bid={this.state.bid} bid={this.props.localid} currentChapterId={this.state.chapterid} fromReading={true} source_id={this.state.source_id}/>
						</div>
						<div className="u-chapter-action f-flexbox">
							<div className="u-chapter-page f-flex1" onClick={this.prevPage}>上一页</div>
							<div className="u-chapter-page f-flex1" onClick={this.nextPage}>下一页</div>
						</div>
					</div>
					<div className="u-hideChapterlist" onClick={this.toggleChapterlist}></div>
				</section>
				<div className={"m-reading" + className} ref="scrollarea" onScroll={this.handleScroll}>
					<button className="u-btn-1 f-hide" ref="tip_top">点击阅读上一章</button>
					<section className="u-chapterName">{this.state.data.name}</section>
					<section className="u-readingContent">
						{
							this.state.data.content.map(function(p, i) {
								return <p key={i}>{p}</p>;
							})
						}
					</section>
					{intercut}
					<button className="u-btn-1">点击阅读下一章</button>
				</div>

				<div className={"reading-guide" + (this.state.showGuide ? '' : ' f-hide')} onClick={this.hideGuide}>
					<div className="reading-guide-item guide-top">
						<div className="guide-tip">
							<span>点击 向上滚动</span>
							<br />
							<span>页首到上一页</span>
						</div>
					</div>
					<div className="reading-guide-item guide-middle f-clearfix">
						<div className="guide-icon f-fl">
							<img src="src/img/reading-guide.png" />
						</div>
						<div className="guide-content f-fl">
							<div className="guide-tip">
								<span>点击中间</span>
								<br />
								<span>呼出工具框</span>
							</div>
						</div>
					</div>
					<div className="reading-guide-item guide-bottom">
						<div className="guide-tip">
							<span>点击 向下滚动</span>
							<br />
							<span>页尾到下一页</span>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = Reading;
