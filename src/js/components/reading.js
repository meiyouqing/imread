var Header = require('./header');

var Chapterlist = require('./chapterlist');
var readingStyle = require('../modules/readingStyle');
var storage = require('../modules/storage');
var bookContent = require('../modules/bookContent');
var uploadLog = require('../modules/uploadLog');
var Intercut = require('./intercut');
var Hammer = require('../modules/hammer');
var isHidden = require('../modules/isHidden');
var PayOrder = require('./order');
var ReadConfig = require('../modules/readConfig');
require('../../css/reading.css');

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
		var a = e.target.getAttribute('data-id');
		var style = this.cloneStyle(this.state.style);
		style.style = Number(a);
		// style.night = 0;
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
	setFontSize: function(e) {
		var style = this.cloneStyle(this.state.style);
		style.fontSize = Number(e.target.getAttribute('data-font'));
		this.setState({
			style: style
		});
		readingStyle.set(style);
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

		AJAX.init('chapterlist.'+ this.APIParts('readingId')[3]+ '.' +this.state.page_size+'.9.asc.'+(this.state.page+next));
		AJAX.get(function(data) {
			this.setState({
				pages: Math.ceil(+data.totalSize / this.state.page_size),
				chapterlist: this.state.chapterlist.concat(data.chapterList),
				page: this.state.page + next,
				getChapterlistLoading: false,
				chapterlistNoMore: (data.chapterList.length < this.state.page_size)
			});
			for (var i = 0; i < data.chapterList.length; i++) {
				if (data.chapterList[i].cid == this.chapterid && data.chapterList[i].intercut) {
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
		browserHistory.replace({pathname:location.pathname.replace(/reading\/crossDomain\.(\d+)\.(\d+)/, function($1, $2, $3) {
			return 'reading/crossDomain.' + $2 + '.' + chapterid;
		}.bind(this)),state:this.props.location.state});

		if(this.refs.scrollarea) this.refs.scrollarea.scrollTop = 0;
	},
	handleClickChapter: function(e) {
		this.goToChapter(e.target.getAttribute('data-cid'));
	}
};

var Reading = React.createClass({
	bookmarkFlag: true,
	isOnShelf: true,
	chargeMode: 1,
	chapterCount: '1',
	mixins: [styleMixins, chapterMixins, Mixins()],
	getInitialState: function() {
		return {
			time: Date.now(),
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
			// bid: this.APIParts()[1],
			// chapterid: this.APIParts()[2],
			// source_id: this.APIParts()[4],
			showSetting: false,
			showChapterlist: false,
			showSettingFont: false,
			chapterlist: [],
			showGuide: false,
			UFO:false,
			order: false,
			intercutList: false, //呼出页广告
			showIntercut: false, //是否显示呼出页广告
			intercut: false, //插页广告
			download: false, //界面底部下载浮层,
			orderData: null,
			introduce: null,
			orderSeq: true,
			chapterlistMore: true,
			fromId: false,//true:咪咕 ,
			adHc: null,	//呼出广告
			adXp: null,	//插屏
			showIntercutXp: false,
			intercutXp: null
		}
	},
	cacheReadLog: function(readLog) {
		var scrollarea = this.refs.scrollarea;
		if(!scrollarea){return}
		// var bookIntroduce = {};
		var readLogs = storage.get('readLogNew');
		// var books = storage.get('bookIntroduce', 'array');
		// for (var i = 0; i < books.length; i++) {
		// 	if (books[i].bid == readLog.content_id) {
		// 		bookIntroduce = books[i];
		// 		break;
		// 	}
		// }

		readLog.name = this.state.introduce.book_name;
		readLog.author = this.state.introduce.author;
		readLog.big_coverlogo = this.state.introduce.big_coverlogo;
		readLog.recent_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
		readLog.source_bid = this.bid;
		readLog.source_id = this.source_id;
		readLog.chapter_id = this.chapterid;
		readLog.offset = {};
		readLog.offset[this.chapterid] = scrollarea.scrollTop;
		readLogs[readLog.content_id] = readLog;
		storage.set('readLogNew', readLogs);
	},
	addRecentRead: function(bid, chapterid) {
		if (!this.state.data) {return ;}
		var readLog = [{
			content_id: bid,
			current_chapterid: chapterid,
			current_time:(new Date()).Format('yyyyMMddhhmmss'),
			chapter_read_time:(new Date()).Format('yyyyMMddhhmmss'),
			chapter_offset:0,
			read_time: (new Date()).Format('yyyyMMddhhmmss'),
			chapter_name: this.state.data.name,
			//chapter_read_time: Date.now()-this.time,
			playorder: this.state.data.chapterSort
		}];
		if (this.isLogin()) {
			uploadLog.readlog('read', {readLog:JSON.stringify(readLog)});
			//AJAX.getJSON('POST', '/api/upload/log', {readLog:JSON.stringify(readLog)}, function(data) {}, GLOBAL.noop);
		}
		this.cacheReadLog(readLog[0]);
		this.time = Date.now();
		myEvent.execCallback('reading' + bid, true);
		myEvent.execCallback('reading' + bid + '-fromReading', true);
	},
	componentWillUnmount: function() {
		uploadLog.sending('intercut');
		this.addRecentRead(this.book_id, this.chapterid);
		document.removeEventListener && document.removeEventListener('visibilitychange',this.onVisibilitychange);
	},
	goOut:function(e){
		var addShelf = function() {
			var param = [{
				bookId: this.book_id,
				type: 3,
				time: new Date().getTime(),
				chapter_id: this.chapterid,
				chapter_offset: 0
			}];
			this.shelfAdding(param,function(){
				myEvent.execCallback('updateShelfBtn');
				GLOBAL.goBack(this.path);
			}.bind(this));
		}.bind(this);

		this.isOnShelf = GLOBAL.onShelf[this.book_id]? 1:this.isOnShelf;
		if(!this.isOnShelf){
			POP.confirm('是否将该书加入书架？',addShelf,GLOBAL.goBack.bind(null,this.path));
		}else{
			myEvent.execCallback('refreshShelf');
			GLOBAL.goBack(this.path);			
		}
	},
	getFormatContent: function(content) {

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
		AJAX.getJSON('GET','/api/v1/book/introduce',{bid:this.APIParts('readingId')[3]},function(data){
			todo(data);
		},GLOBAL.noop);			
		function todo(data){
			that.setState({
				bookName : data.book_name,
				introduce: data
			});
			that.chapterCount = data.chapter_count;
			that.chargeMode = +data.charge_mode;
			that.isOnShelf = +data.is_self;
			//that.getAD_block5(data);
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
				GLOBAL.loadImage(data.intercutList[randIndex].image_url, callback);
				function callback() {
					var intercutList = (
						<div>
							<Block5 data={{
								contentlist: [data.intercutList[randIndex]]
							}} type="11" fromReading={true} />
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
	getAD_xp: function(data){
		var that = this;
		if (data.content && data.content.length) {
			require.ensure(['./block9'],function(require){
				var Block9 = require('./block9');
				var randIndex = Math.floor(Math.random() * data.content.length) % data.content.length;
				//广告图片加载好之后再显示广告
				GLOBAL.loadImage(data.content[randIndex].image_url, callback);
				function callback() {
					var intercutXp = (
						<div>
							<Block9 data={{
								contentlist: [data.content[randIndex]]
							}} type="11" fromReading={true} />

						</div>
					);

					if(!that.isMounted()){return;}
					that.setState({
						intercutXp: intercutXp,
						showIntercutXp: true
					});
				}
			});
		}
	},
	gotContent: function(data,from){
		if(!this.isMounted()){return;}
		if(data.code === 403) return;
		this.setState({
			showSetting:false,
			fromId: from || false
		})		
		data = data.success?data.success:data;
		//如果是付费章节，跳到确认订单
		if(data.errorMsg)  {
			if(location.pathname.slice(-5) == 'login')	return;
			this.goLogin(this.getContent);
			return;
		}

		var that = this;
		//设置auto pay cookie
		// if(autoPay){
		// 	GLOBAL.cookie(that.bid,'autoPay',7)
		// }
		if(data.buyMsg) {
			that.setState({
				order: true,
				orderData: data
			})
			that.getIntroduce(that.confirmOrder.bind(that,data));
			return;
		}
		if(data.pageType==='order'){
			if(GLOBAL.cookie(that.bid)==='autoPay'){
				that.autoPay(data);
				return;
			}
			that.setState({
				order: true,
				orderData: data
			})
			that.getIntroduce(that.confirmOrder.bind(that,data));
			return;
		}
		that.getIntroduce();
		//that.getChapterlist();
		if(!data.content) return;
		data.content = that.getFormatContent(data.content);
		var currentPage = Math.ceil(+data.chapterSort / that.state.page_size);

		that.setState({
			data: data,
			loading: false,
			//page: currentPage,
			pages: currentPage,
			order: false
		}, that.getChapterlist);

		if(that.isLogin())
			that.getNextContent(data);
	},
	getAd_xp: function(bid){
		AJAX.go('adXp',{bid: bid,page:1,page_size:0,order_type:'asrc',vt:9},function(res){
			if(res.content)	{
				this.setState({adXp: res});
				if(!this.state.adXp)
					this.getAD_xp(res);
			}
		}.bind(this));
	},
	getAd_hc: function(bid){
		AJAX.go('adHc',{bid: bid},function(res){
			if(res.intercutList)	{
				this.setState({Adhc: res});
				if(!this.state.adHc)
					this.getAD_block5(res);
			}
		}.bind(this));
	},
	getContent: function() {
		var book_info = this.APIParts('readingId');
		this.bid = book_info[1];
		this.chapterid = book_info[2];
		this.source_id = book_info[4];
		this.book_id = book_info[3];

		if(this.state.Adhc)
			this.getAD_block5(this.state.Adhc);
		if(this.state.adXp)
			this.getAD_xp(this.state.adXp);

		if(!this.isMounted()){return;}
		var nextChapter = storage.get('nextChapter');
		if((nextChapter.nextChapterId-1)==this.chapterid){
			this.gotContent(nextChapter);
			return;
		}
		this.setState({
			loading: true
		});
		var that = this;
		bookContent.get({
			bid: this.bid,
			cid: this.chapterid,
			source_id : this.source_id,
			book_id: this.book_id,
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
			noCross:true,
			bid: that.bid,
			cid: data.nextChapterId,
			source_id : this.source_id,
			book_id: this.book_id,
			callback: function(data){
				storage.set('nextChapter',data.success);
			}.bind(this),
			onError: GLOBAL.noop
		});
	},	
	confirmOrder: function(data){
		var that = this;
		that.setState({
			chapterName : data.name
		})
		if(!this.state.fromId){
			if(that.isLogin()){
				goOrder();
			}else{
				that.goLogin(goOrder);
			}
		} else {
			goOrder();
		}
		function goOrder(){
			that.setState({order: true,orderData: data})					
		}
	},
	autoPay: function(orderData) {
		//console.log(orderData);	
		var that = this;
		if(!this.state.fromId){
			if(that.isLogin()){
				pay();
			}else{
				that.goLogin(pay);
			}
		} else {
			pay_m();
		}
		function pay(){	
			AJAX.getJSON('GET','/api/v1/auth/balance',{},function(data){
				var aidou= data.success.balance/100;
				//console.log(aidou,orderData.marketPrice)
				if((aidou-orderData.marketPrice)>=0){
					AJAX.getJSON('GET',orderData.orderUrl,{},function(data){
						that.disPatch('updateUser');
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
		};

		function pay_m(){
			AJAX.go('mOrder',{
				book_id:that.book_id,
				chapter_id:that.chapterid,
				cm:orderData.cm,
				firmnum:'',
				count:1
			},function(data){
				if(data.code == 403)
					POP._alert('支付失败');
				else {
					that.gotContent(data);
				}
			});
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
	toggleSettings: function() {
		if(!this.isMounted()){return;}
		if(this.state.showChapterlist){
			this.toggleChapterlist();
			//return;
		}
		if (!this.state.showSetting && this.state.showIntercut) {
			uploadLog.send('intercut', {
				content_id: this.intercutList.content_id,
				event: 1,
				show_class: this.intercutList.show_class
			});
		}
		setTimeout(()=>{
			this.setState({
				showSetting: !this.state.showSetting
			});			
		},10)
	},
	onVisibilitychange: function(){
		if(isHidden()){
			this.addRecentRead(this.book_id, this.chapterid);
		}else{
			this.time = Date.now();
		}
	},
	getAds: function(){
		var bookid = this.APIParts('readingId')[3];
		this.getAd_hc(bookid);
		this.getAd_xp(bookid);
	},
	componentDidMount:function(){
		this.getAds();
		if(GLOBAL.isRouter(this.props)) this.getContent();
		document.addEventListener && document.addEventListener('visibilitychange',this.onVisibilitychange);
		window.onbeforeunload = this.addRecentRead.bind(this,this.book_id, this.chapterid);

		if (GLOBAL.cookie('showGuide') != '1') {
			this.setState({
				showGuide: true
			});
			GLOBAL.cookie('showGuide', '1', {
				expires: 1000
			});
		}
		//扉页信息
		this.states = this.props.location.state;
		this.timeOut();
		this.path = this.props.route.path.replace(/:([^\"]*)/,'');
		this.path = window.location.pathname.split('/'+this.path)[0];
		this.isdownLoad();
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
	componentDidUpdate: function(nextProps, nextState) {
		// var that = this; || (this.props.children !== nextProps.children)
		if((this.props.params.readingId !== nextProps.params.readingId) || (nextProps.routes.length>this.props.routes.length)){
			this.getContent();
		}

		if(this.refs.swiper) {
			this.hammer = new Hammer(this.refs.swiper);
			this.hammer.off('swipeup');
		    	this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
		    	this.hammer.on("swipeup", function (ev) {
		    		this.setState({showIntercutXp: false});
		    	}.bind(this));
		}

		var scrollarea = this.refs.scrollarea;
		if(!scrollarea){return};
		//第一次进入阅读跳到上次阅读的地方
		if(this.bookmarkFlag){
			//console.log(storage.get('readLogNew'))
			var obj = storage.get('readLogNew')[this.APIParts('readingId')[3]];
			var offset = obj? obj.offset[this.chapterid] : false;
			scrollarea.scrollTop = offset? offset-200 : 0;
		}
		this.bookmarkFlag = false;
		//scrollarea.addEventListener('touchstart',this.handleClick);
		if (scrollarea.getAttribute('data-events') != '1') {
			scrollarea.setAttribute('data-events', '1');
			var hammerTime = new Hammer(scrollarea);
			hammerTime.on('tap', this.handleClick);
			hammerTime.on("pandown panend", this.handlePullToRrefresh);
		}

		var container = this.refs.containers;
		container.onscroll = function(e) {
			e.stopPropagation();
			var time;
			if (container.scrollTop + document.body.scrollHeight + 160 > container.scrollHeight) {
				clearTimeout(time);
				time= setTimeout(function() {
					this.getChapterlist(true);

				}.bind(this), 100);
			};
		}.bind(this)
	},
	toggleChapterlist: function() {
		if(!this.isMounted()){return;}
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
	// handleScroll: function(e) {		
	// 	if(this.showDownload) {
	// 		var scroller = this.refs.scrollarea,
	// 			reader = this.refs.reading;

	// 		if(scroller.scrollTop+document.body.clientHeight >= reader.offsetHeight) {
	// 			if(this.state.download)	  this.setState({download: false});
	// 		} else {
	// 			if(!this.state.download)	  this.setState({download: true});
	// 		}
	// 	}	//下载客户端提示
	// 	console.log(111)
	// 	if (this.state.showSetting) {
	// 		this.toggleSettings();
	// 	}
	// },
	changeOrder: function(){
		this.setState({orderSeq: !this.state.orderSeq});
	},
	isdownLoad: function(){
		var book_isload = ['440081548','407221400','401859267','405795359','640377097','408622858'];
		var index = book_isload.indexOf(this.APIParts('readingId')[1])>=0;
		this.showDownload = index;
		if(index)	
			setTimeout(function(){
				this.setState({download: true});
			}.bind(this),500);
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state.loading !== nextState.loading 
				|| this.state.data !== nextState.data
				|| this.state.showChapterlist !== nextState.showChapterlist
				|| this.state.showSettingFont !== nextState.showSettingFont
				|| this.state.chapterlist !== nextState.chapterlist
				|| this.state.getChapterlistLoading !== nextState.getChapterlistLoading
				|| this.state.showGuide !== nextState.showGuide
				|| JSON.stringify(this.state.style) !== JSON.stringify(nextState.style)||true
				|| this.props.children !== nextProps.children
				|| this.props.params !== nextProps.params
				|| this.state.introduce !== nextState.introduce
				|| this.state.orderData !==nextState.orderData
				|| this.state.intercutList !== nextState.intercutList;
	},
	
	hideGuide:function(e) {
		if(!this.isMounted()){return;}
		this.setState({
			showGuide: false
		});
	},
	downLoad: function(){
		window.location.replace("http://readapi.imread.com/api/upgrade/download?channel=imread");
	},
	logout: function(e) {
		e.preventDefault && (e.preventDefault());
		POP.confirm('确定退出登录?',function() {
			AJAX.init('loginout');
			AJAX.get(function(res){
			}.bind(this));
			GLOBAL.removeCookie('userPhone');
			GLOBAL.removeCookie('userToken');
			GLOBAL.removeCookie('uuid');

			this.getContent();
		}.bind(this));
	},
	goBack: function(){
		GLOBAL.cookie(this.bid,'autoPay',7)
		this.getContent();
		this.setState({order: false});
	},
	timeOut: function(){

	},
	render:function(){
		var currentRoute = location.pathname.split('/');
		currentRoute.pop();
		var ChapterlistHrefBase = currentRoute.join('/');
		var head = <Header title={this.state.bookName} right={null} path={this.props.route}/>;
		var classNames = readingStyle.getClass(this.state.style);
		var intercut;

		//防止排序时候的绑定
		var chapterlist = {};
		chapterlist.list = this.state.chapterlist;
		var list = JSON.parse(JSON.stringify(chapterlist)).list;

		if(!this.states) 
			this.states = {book_name: '',author:''}

		if(this.state.UFO){
			return (
				<div className="gg-body">
					{head}
					<div className="g-main g-main-1">
						<NoData type="UFO" />
					</div>
					{this.props.children}
				</div>
			);
		}
		if(this.state.order && this.state.introduce){
			var right = this.state.fromId?(<a className="icon-s icon-tc right" onClick={this.logout}></a>):null;
			return (<div className="gg-body">
				<Header path={this.props.route} right={right} title={"确认订购"} />
				<div className="g-main g-main-1">
					<PayOrder data={this.state.orderData} chapterid={this.APIParts('readingId')[2]} goBack={this.goBack}  route={this.props.route} isMigu={this.state.fromId} introduce={this.state.introduce} />
				</div>
				{this.props.children}
				</div>
				);
		}
		if(this.state.loading) {
			return (
				<div className="gg-body">
					{/*{head}
					<i className="u-loading u-book-loading">努力加载中...</i>*/}
					<div className={"m-reading-fy style-" + (this.state.style.style)}>
						<div className="fy-detail">
							<p className="fy-title">{this.states.book_name || '艾美阅读'}</p>
							<p className="fy-author">{this.states.author || ''}</p>
						</div>
						<div className="fy-gw">发现阅读之美</div>
					</div>
					{this.props.children}
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
			<div className="gg-body m-reading-body" ref="container">
				<div className={"ad-xp"+ (this.state.showIntercutXp ? "" : " f-hide")} ref="swiper">
					{this.state.intercutXp}
					<div className="banner">点击图片查看更多，滑动翻页继续阅读</div>
				</div>
				<div className={"style " + classNames}>
				{

					this.source_id == '1'?
						(<i className="u-miguLogo"></i>):
						null
				}
				<div ref="mask" className={"u-hideChapterlist" + ((this.state.showChapterlist || this.state.showSetting) && ' active' || '')} onClick={this.toggleSettings}></div>
				<div className={"u-readingsetting" + (!this.state.showSetting && ' f-hide' || '')}>
					<div className="u-settings u-settings-top">
						<span className="back f-fl" onClick={this.goOut}></span>
						<span className="title f-ellipsis f-fl">{this.state.bookName}</span>
						<span onClick={this.downLoad} className="download f-fr"></span>

						<div className={this.state.showIntercut ? "" : "f-hide"}>
							{this.state.intercutList}
						</div>
					</div>
			
					<div className={"u-settings u-settings-font" + (!this.state.showSettingFont && ' f-hide' || '')}>
						{/*<div className="setting-fontfamily setting-font-line f-flexbox">
							<div className="title">字体</div>
							{
								['默认', '宋体', '黑体', '楷体'].map(function(font, i) {
									return <div className={"item f-flex1" + (this.state.style.fontFamily == (i + 1) ? ' active' : '')} onClick={this.setFontFamily} data-id={i + 1} key={i}>{font}</div>;
								}.bind(this))
							}
						</div>*/}
						<div className="setting-fontsize setting-font-line f-flexbox">
							<span className="icon-font"></span>
							<div className="font-list">
								<div className="f-fr">
									<span className="circle active" data-font={1}></span>
									{

										[1, 2, 3, 4,5].map(function(dataid, i) {
											return (<div key={i} onClick={this.setFontSize}  data-font={dataid} className={"display-inline" + (this.state.style.fontSize>=dataid?" active":'')}>
													<span className="line" data-font={dataid} ></span>
													<span className="circle" data-font={dataid}></span>
												</div>)
										}.bind(this))

									}

								</div>
							</div>
						</div>
						{/*<div className="setting-line-height setting-font-line f-flexbox">
							<div className="title">排版</div>
							{
								['icon-lh3', 'icon-lh2', 'icon-lh1'].map(function(icon, i) {
									return <div className={"item f-flex1" + (this.state.style.lineheight == (i + 1) ? ' active' : '')} onClick={this.setFontHeight} data-id={i + 1} key={i}><span className={"iconfont " + icon}></span></div>
								}.bind(this))
							}
						</div>*/}
						<div className="setting-bg setting-font-line f-flexbox">
							{
								[0,1, 2, 3, 4].map(function(dataid, i) {
									return (
										<div className="item f-flex1" key={i}>
											<div className={"active-border" + (this.state.style.style == dataid ? ' active' : '')} data-id={dataid} onClick={this.setFontBg} ></div>
										</div>
									)
								}.bind(this))
							}
						</div>
					</div>
					<div className="u-settings u-settings-bottom f-flexbox">
						<a className="u-settingitem f-flex1" onClick={this.prevChapter}><span className="icon-r prv"></span><span>上一章</span></a>
						<a className="u-settingitem f-flex1" onClick={this.toggleChapterlist}><span className="icon-r menu"></span><span>目录</span></a>
						<a className="u-settingitem f-flex1" onClick={this.toggleSettingFont}><span className="icon-r setting"></span><span>设置</span></a>
						<a className="u-settingitem f-flex1" onClick={this.nextChapter}><span className="icon-r next"></span><span>下一章</span></a>
						{/*<a className="u-settingitem f-flex1" onClick={this.toggleSettingFont}><span className="iconfont u-icon icon-fsize"></span></a>
						<a className="u-settingitem f-flex1" onClick={this.toggleSettingFont}><span className="iconfont u-icon icon-fsize"></span></a>
						<a className="u-settingitem f-flex1" onClick={this.toggleNightStyle}><span className={"iconfont u-icon icon-moon" + (this.state.style.night ? ' icon-sun' : '')}></span></a>*/}
					</div>
				</div>
				<section className={"u-chapterlistc" + (this.state.showChapterlist && ' active' || '')}>
					<div className="u-chapterlist">
						<div className="u-bookname f-ellipsis">
							<span>目录</span>
							<div onClick={this.changeOrder} >
								<span>顺序</span>
								<span className={"icon-20 icon-w-paixu f-fr" + (this.state.orderSeq?' rev':' seq')}></span>
							</div>
						</div>
						<div className="u-scroll-y"  onClick={this.toggleChapterlist}  ref="containers">
							<Chapterlist hrefBase={ChapterlistHrefBase} chapterlist={this.state.orderSeq?list:list.reverse()} source_bid={this.bid} bid={this.book_id} loading={this.state.chapterlistNoMore} book={this.states} currentChapterId={this.chapterid} fromReading={true} source_id={this.source_id}/>
						</div>

					</div>
				</section>
				<div className={"m-reading"} ref="scrollarea">
					<button className="u-btn-1 f-hide" ref="tip_top">点击阅读上一章</button>
					<section className="u-chapterName">{this.state.data.name}</section>
					<section className="u-readingContent" ref="reading">
						{
							this.state.data.content.map(function(p, i) {
								return <p key={i} dangerouslySetInnerHTML={{__html: p}}></p>;
							})
						}
					</section>
					{intercut}
					<button className="u-btn-1">点击阅读下一章</button>
				</div>

				
			        <div id="reading-download" className={this.state.download?'active':''}>
			        	<a href="http://readapi.imread.com/api/upgrade/download?channel=aidouhd">
			            <img src="http://www.imread.com/img/mobile-logo.png?2" />
			            <div className="detail">
			                <p>你想看的好书</p>
			                <p>艾美阅读都有</p>
			            </div>
			            <div className="down-button">
			                立即下载
			            </div>
			           </a>
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
							<img src="http://m.imread.com/src/img/reading-guide.png" />
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
				{this.props.children}
			</div>
		)
	}
});

module.exports = Reading;
