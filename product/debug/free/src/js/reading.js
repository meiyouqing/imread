var Header = require('./header');
var getJSON = require('./getJSON').getJSON;
var Chapterlist = require('./chapterlist');
var readingStyle = require('./readingStyle');
var myEvent = require('./myEvent');

var Reading = React.createClass({
	getInitialState: function() {
		return {
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
			showSetting: false,
			showChapterlist: false,
			showSettingFont: false,
			chapterlist: [],
			showGuide: false
		}
	},
	addRecentRead: function(bid, chapterid) {
		var readLog = [{
			content_id: bid,
			current_chapterid: chapterid,
			current_time:(new Date()).Format('yyyyMMddhhmmss'),
			chapter_offset:0,
			read_time: (new Date()).Format('yyyyMMddhhmmss')
		}]
		GLOBAL.readLog[bid] = readLog[0];
		try {
		localStorage.setItem('readLog',JSON.stringify(GLOBAL.readLog));
		} catch(e) {}
		getJSON('POST', '/api/upload/log', {readLog:JSON.stringify(readLog)}, function(data) {}, GLOBAL.noop);

		myEvent.execCallback('reading' + bid, true);
		myEvent.execCallback('reading' + bid + '-fromReading', true);
	},
	componentWillUnmount: function() {
		this.addRecentRead(this.props.localid, this.state.chapterid);
	},
	getFormatContent: function(content) {
		var passages = content
							.replace('&ldquo;', '“')
							.replace('&rdquo;', '”')
							.replace(/&nbsp;/g, '')
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
	updateStorageChapterid: function(bid, chapterid) {
		for (var n in localStorage) {
			if (n == 'bid' + bid) {
				var book = JSON.parse(localStorage.getItem('bid' +bid));
				book.chapterid = chapterid;
				try {
				localStorage.setItem('bid' + bid, JSON.stringify(book));
				} catch(e) {}
			}
		}
	},
	getContent: function(bid, chapterid) {
		this.setState({
			loading: true
		});
		this.updateStorageChapterid(bid, chapterid);
		getJSON('GET', '/api/crossDomain', {
			url : 'http://wap.cmread.com/r/' + bid + '/' + chapterid+ '/index.htm',
			type: 'post',
			param: 'page=1&vt=9&cm=' + Router.Config.cm
		}, function(data) {
			data.content = this.getFormatContent(data.content);
			this.setState({
				data: data,
				loading: false,
				chapterid: chapterid
			});
			Router.visitMiGu(bid, chapterid);
		}.bind(this), function(err) {
			// TODO 区分错误类型，只有返回结果为空时才可能是付费章节
			Router.goBack();
			Router.toOthers(bid, chapterid);
		});
	},
	//type -1 为第一章， 1位最后一章
	alert: function(msg, type) {
		if (!this['hasAlert' + type]) {
			alert(msg);
			this['hasAlert' + type] = 1;
			return true;
		}
		return false;
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
	},
	offsetPage: function(e) {
		this.setState({
			showSetting: false
		});
		var offset = e.target === this.refs.prevpage ? -1 : 1;
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
		this.setState({
			showSetting: !this.state.showSetting,
			showChapterlist: closeChapterlist && false || this.state.showChapterlist
		});
	},
	componentDidMount:function(){
		this.getContent(this.state.bid, this.state.chapterid);

		if (GLOBAL.cookie('showGuide') != '1') {
			this.setState({
				showGuide: true
			});
			GLOBAL.cookie('showGuide', '1', {
				expires: 1000
			});
		}

		/*
		//禁止滚动
		document.body.addEventListener('touchmove', function(e) {
            e.stopPropagation();
            e.preventDefault();
        });
        */ 
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
	getChapterlist: function(next) {
		if (this.state.getChapterlistLoading) {
			return ;
		}
		next = next || 0;
		if (this.state.page + next < 1 || this.state.page + next > this.state.pages) {return;}
		this.setState({
			getChapterlistLoading: true
		});
		getJSON("GET", "/api/crossDomain", {
			url: 'http://wap.cmread.com/r/p/catalogdata.jsp',
			type: 'post',
			param:  GLOBAL.transformRequest({
				orderType: 'asc',
				bid: this.state.bid,
				vt: this.state.vt,
				pageSize: this.state.page_size,
				page: this.state.page + next
			})
		}, function(data) {
			this.setState({
				pages: Math.ceil(+data.totalSize / this.state.page_size),
				chapterlist: data.chapterList,
				page: this.state.page + next,
				getChapterlistLoading: false
			});
		}.bind(this));	
	},
	prevPage: function() {
		this.getChapterlist(-1);
	},
	nextPage: function() {
		this.getChapterlist(1);
	},
	scrollTime: {
		top: 0,
		bottom: 0
	},
	handleScroll: function(e) {
		if (this.state.showSetting) {
			this.toggleSettings(1);
		}

		/*
		//console.log(e)
		var scrollTop = e.target.scrollTop;
		var delta = 0;
		if (scrollTop <= delta) {
			if (!this.scrollTime['top']) {
				// 首次触底
				this.scrollTime['top'] = +new Date;
			} else {
				//距离上次触底1s 加载下一页
				if (+new Date - this.scrollTime['top'] > 2000) {
					this.prevChapter();
				}
			}
		} else {
			//this.scrollTime['top'] = 0;
		}
		if (scrollTop + window.innerHeight >= e.target.scrollHeight - delta) {
			if (!this.scrollTime['bottom']) {
				this.scrollTime['bottom'] = +new Date;
			} else {
				if (+new Date - this.scrollTime['bottom'] > 2000) {
					this.nextChapter();
					this.scrollTime['bottom'] = 0;
				}
			}
		} else {
			//this.scrollTime['bottom'] = 0;
		}
		*/
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
	},
	hideGuide:function(e) {
		this.setState({
			showGuide: false
		});
	},
	render:function(){
		var currentRoute = window.location.hash.split('/')
		currentRoute.pop()
		var ChapterlistHrefBase = currentRoute.join('/')
		if(this.state.loading) return (
			<div>
				<Header title={GLOBAL.book[this.state.bid]} right={null} />
				<i className="u-loading u-book-loading">努力加载中...</i>
			</div>
		);

		var className = readingStyle.getClass(this.state.style);
		return (
			<div>
				<div className={"u-readingsetting" + (!this.state.showSetting && ' f-hide' || '')}>
					<div className="u-settings u-settings-top">
						<div className="iconfont icon-back" onClick={Router.goBack.bind(Router)}></div>
						<span>{this.state.data.name}</span>
					</div>
					<div className={"u-settings u-settings-font" + (!this.state.showSettingFont && ' f-hide' || '')}>
						
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
				<section className="u-readingAction">
					<div className="u-action-top" onClick={this.offsetPage} ref="prevpage"></div>
					<div className="u-action-middle" onClick={this.toggleSettings}></div>
					<div className="u-action-bottom" onClick={this.offsetPage} ref="nextpage"></div>
				</section>
				<section className={"u-chapterlistc" + (this.state.showChapterlist && ' active' || '')}>
					<div className="u-chapterlist">
						<div className="u-bookname f-ellipsis">
							{this.state.data.name}
						</div>
						<div className="u-scroll-y">
							<Chapterlist hrefBase={ChapterlistHrefBase} chapterlist={this.state.chapterlist} source_bid={this.state.bid} bid={this.props.localid} currentChapterId={this.state.chapterid} fromReading={true}/>
						</div>
						<div className="u-chapter-action f-flexbox">
							<div className="u-chapter-page f-flex1" onClick={this.prevPage}>上一页</div>
							<div className="u-chapter-page f-flex1" onClick={this.nextPage}>下一页</div>
						</div>
					</div>
					<div className="u-hideChapterlist" onClick={this.toggleChapterlist}></div>
				</section>
				<div className={"m-reading" + className} ref="scrollarea" onScroll={this.handleScroll} onTouchEnd={this.handleTouchEnd} onTouchMove={this.handleTouchMove}>
					<section className="u-chapterName">{this.state.data.name}</section>
					<section className="u-readingContent">
						{
							this.state.data.content.map(function(p, i) {
								return <p key={i}>{p}</p>;
							})
						}
					</section>
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
