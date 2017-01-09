import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import myEvent from '../modules/myEvent';
import NoData from './noData';
import storage from '../modules/storage';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import Loading from './loading';
import Header from './header';
import Chapterlist from './chapterlist';
import readingStyle from '../modules/readingStyle';
import bookContent from '../modules/bookContent';
import uploadLog from '../modules/uploadLog';
import Intercut from './intercut';
import PayOrder from './order';

if (typeof window !== 'undefined') {
  var POP = require('../modules/confirm');
  var Hammer = require('../modules/hammer');
	// var Finger = require('alloyfinger')
  var isHidden = require('../modules/isHidden');
}
if (typeof window !== 'undefined') {
  require('../../css/reading.css');
}

const styleMixins = {
  cloneStyle(style) {
    const cloneStyle = {};
    for (const key in style) {
      cloneStyle[key] = style[key];
    }
    return cloneStyle;
  },
  toggleNightStyle(e) {
    e.stopPropagation();
    const style = this.cloneStyle(this.state.style);
    style.night = (+style.night) ^ 1;
    this.setState({
      style,
      showSettingFont: false
    });
    readingStyle.set(style);
  },
  toggleSettingFont(e) {
    e.stopPropagation();
    this.setState({
      showSettingFont: !this.state.showSettingFont
    });
  },
  setFontBg(e) {
    e.stopPropagation();
    const a = e.target.getAttribute('data-id');
    const style = this.cloneStyle(this.state.style);
    style.style = Number(a);
		// style.night = 0;
    this.setState({
      style
    });
    readingStyle.set(style);
  },
  setFontHeight(e) {
    e.stopPropagation();
    const height = e.target.getAttribute('data-id');
    const style = this.cloneStyle(this.state.style);
    style.lineheight = height;
    this.setState({
      style
    });
    readingStyle.set(style);
  },
  setFontSize(e) {
    const style = this.cloneStyle(this.state.style);
    style.fontSize = Number(e.target.getAttribute('data-font'));
    this.setState({
      style
    });
    readingStyle.set(style);
  },
  setFontFamily(e) {
    e.stopPropagation();
    const family = e.target.getAttribute('data-id');
    const style = this.cloneStyle(this.state.style);
    style.fontFamily = family;
    this.setState({
      style
    });
    readingStyle.set(style);
  }
};

const chapterMixins = {
  getChapterlist(next) {
		// this.audioRead();
    if (this.state.getChapterlistLoading || this.state.chapterlistNoMore) {
      return;
    }
		// next = next || 0;
		// if (this.state.page + next < 1 || this.state.page + next > this.state.pages) {return;}

    let page;
    if (this.state.orderSeq)			{ page = this.state.page + 1; } else			{
      page = this.state.page - 1;
    }

    if (page == 0)	return;

    this.setState({
      getChapterlistLoading: true
    });

    const AJAX = new Ajax(`chapterlist.${this.APIParts('readingId')[3]}.${this.state.page_size}.9.asc.${page}`);
    AJAX.get((data) => {
      this.setState({
        pages: Math.ceil(data.totalSize / this.state.page_size),
        chapterlist: (this.state.orderSeq ? (this.state.chapterlist || []).concat(data.chapterList) : data.chapterList.concat(this.state.chapterlist || [])),
        page,
        getChapterlistLoading: false,
        chapterlistNoMore: this.state.orderSeq ? (data.chapterList.length < this.state.page_size) : (page <= 1),
      });
      if (!this.state.orderSeq && data.chapterList.length < this.state.page_size) this.getChapterlist();
      for (let i = 0; i < data.chapterList.length; i++) {
        if (data.chapterList[i].cid == this.chapterid && data.chapterList[i].intercut) {
					// 处理插页广告
          const intercut = data.chapterList[i].intercut;
          GLOBAL.loadImage(intercut.intercut_url, () => {
            this.setState({
              intercut
            });
          });
        }
      }
    });
  },
  troggleChapterlist() {
    this.setState({ orderSeq: !this.state.orderSeq, chapterlist: [], chapterlistNoMore: false });
    let page = 0;
    if (this.state.orderSeq)			{ page = Math.ceil(this.state.introduce.chapter_count / this.state.page_size) + 1; }
    this.setState({ page });

    setTimeout(() => {
      this.getChapterlist();
    }, 200);
  },
  prevPage() {
    this.getChapterlist(-1);
  },
  nextPage() {
    this.getChapterlist(1);
  },
  prevChapter() {
    if (!this.state.data.preChapterId) {
      return this.alert('已经是第一章了', -1);
    }
    this.setState({ showSetting: false });
    this.goToChapter(this.state.data.preChapterId);
  },
  nextChapter() {
    if (!this.state.data.nextChapterId) {
      return this.alert('已经是最后一章了', 1);
    }
    this.setState({ showSetting: false });
    this.goToChapter(this.state.data.nextChapterId);
  },
  goToChapter(chapterid, Offset) {
    if (!chapterid) { return; }
    browserHistory.replace({ pathname: location.pathname.replace(/reading\/crossDomain\.(\d+)\.(\d+)/, ($1, $2, $3) => `reading/crossDomain.${$2}.${chapterid}`), state: this.props.location.state });

		// if(this.refs.scrollarea) this.refs.scrollarea.scrollTop = 0;
  },
  handleClickChapter(e) {
    this.goToChapter(e.target.getAttribute('data-cid'));
  }
};

const Reading = React.createClass({
  bookmarkFlag: true,
  isOnShelf: true,
  chargeMode: 1,
  chapterCount: '1',
  mixins: [styleMixins, chapterMixins, mixins()],
  getInitialState() {
    return {
      ttsModer: false,
      ttsIndex: -1,
      showSetting_tts: false,
      playing: false,
      femaleVoice: true,
      volum: 3,
      speed: 3,
      time: Date.now(),
      bookName: '艾美阅读',
      chapterName: '',
      style: readingStyle.get(),
      data: null,
      loading: true,
      getChapterlistLoading: false,
      page: 0,
      pages: 1,
      page_size: 20,
      vt: 9,
      showFy: true,
			// bid: this.APIParts()[1],
			// chapterid: this.APIParts()[2],
			// source_id: this.APIParts()[4],
      showSetting: false,
      showChapterlist: false,
      showSettingFont: false,
      chapterlist: [],
      showGuide: false,
      UFO: false,
      order: false,
      intercutList: false, // 呼出页广告
      showIntercut: false, // 是否显示呼出页广告
      intercut: false, // 插页广告
      download: false, // 界面底部下载浮层,
      orderData: null,
      introduce: null,
      orderSeq: true,
      chapterlistMore: true,
      fromId: false, // true:咪咕 ,
      adHc: null,	// 呼出广告
      showIntercutXp: false,
      intercutXp: null,
      orderedBook: [], // 解锁章节本地
      isBuyAll: false// 是否购买全本 用于解锁
    };
  },
  cacheReadLog(readLog) {
    const scrollarea = this.refs.scrollarea;
    if (!scrollarea) { return; }
		// var bookIntroduce = {};
    const readLogs = storage.get('readLogNew');
		// var books = storage.get('bookIntroduce', 'array');
		// for (var i = 0; i < books.length; i++) {
		// 	if (books[i].bid == readLog.content_id) {
		// 		bookIntroduce = books[i];
		// 		break;
		// 	}
		// }
    readLog.chapter_offset = scrollarea.scrollTop;
    readLog.name = this.state.introduce.book_name;
    readLog.author = this.state.introduce.author;
    readLog.big_coverlogo = this.state.introduce.big_coverlogo;
    readLog.recent_time = new Date().getTime();
    readLog.source_bid = this.bid;
    readLog.source_id = this.source_id;
    readLog.chapter_id = this.chapterid;
    readLogs[readLog.content_id] = readLog;
    storage.set('readLogNew', readLogs);
  },
  addRecentRead(bid, chapterid) {
    if (!this.state.data) { return; }
    const readLog = [{
      content_id: bid,
      chapter_id: chapterid,
      current_chapterid: chapterid,
      current_time: (new Date()).Format('yyyyMMddhhmmss'),
      chapter_read_time: Date.now() - this.startTime,
      chapter_offset: 0,
      read_time: Date.now() - this.startTime,
      chapter_name: this.state.data.name,
			// chapter_read_time: Date.now()-this.time,
      playorder: this.state.data.chapterSort
    }];
    if (this.isLogin()) {
      uploadLog.readlog('read', { readLog: JSON.stringify(readLog) });
			// new Ajax().getJSON('POST', '/api/upload/log', {readLog:JSON.stringify(readLog)}, function(data) {}, GLOBAL.noop);
    }
    this.cacheReadLog(readLog[0]);
    this.time = Date.now();
    myEvent.execCallback(`reading${bid}`, true);
    myEvent.execCallback(`reading${bid}-fromReading`, true);
  },
  componentWillUnmount() {
		// 停止语音朗读
    if (this.state.ttsModer && this.player) {
      this.removePlayer();
    }

    uploadLog.sending('intercut');
    this.addRecentRead(this.book_id, this.chapterid);
    document.removeEventListener && document.removeEventListener('visibilitychange', this.onVisibilitychange);
  },
  goOut(e) {
    const addShelf = function () {
      const param = [{
        bookId: this.book_id,
        type: 3,
        time: new Date().getTime(),
        chapter_id: this.chapterid,
        chapter_offset: 0
      }];
      this.shelfAdding(param, () => {
        myEvent.execCallback('updateShelfBtn');
        GLOBAL.goBack(this.path);
      });
    }.bind(this);

    this.isOnShelf = GLOBAL.onShelf[this.book_id] ? 1 : this.isOnShelf;
    if (!this.isOnShelf) {
      POP.confirm('是否将该书加入书架？', addShelf, GLOBAL.goBack.bind(null, this.path));
    } else {
      myEvent.execCallback('refreshShelf');
      GLOBAL.goBack(this.path);
    }
  },
  getFormatContent(content) {
    const passages = content
							.replace(/&amp;/g, '&')
							.replace(/(&#160;){2,4}|\s{2,4}/g, '<br/>')
							.replace(/&ldquo;/g, '“')
							.replace(/&rdquo;/g, '”')
							.replace(/&nbsp;/g, '')
							.replace(/&middot;/g, '·')
							.replace(/<img[^>]+>/g, '')
							.split(/<br\s*\/?>/);

		// 按段落处理引号，防止错误一个所有的配对出错，这样最多影响一段
    for (let i = 0; i < passages.length; i++) {
      let v = passages[i].trim();
      if (!v.length || /^[…]+$/.test(v)) { // 去掉空内容和省略号
        passages.splice(i, 1);
        i -= 1;
        continue;
      }
      v = v.replace(/&quot;([^(&quot;)]*)&quot;/g, ($1, $2) => `“${$2}”`);
    }
    return passages;
		// return '<p>' + passages.join('</p><p>')  + '</p>'
  },
  closeIntercut() {
    this.setState({
      intercutList: false,
      showIntercut: false
    });
  },
  getIntroduce(callback) {
    const that = this;
    if (!this.isMounted()) { return; }
    new Ajax().getJSON('GET', '/api/v1/book/introduce', { bid: this.APIParts('readingId')[3] }, (data) => {
      todo(data);
    }, GLOBAL.noop);
    function todo(data) {
      that.setState({
        bookName: data.book_name,
        introduce: data
      });
      that.chapterCount = data.chapter_count;
      that.chargeMode = +data.charge_mode;
      that.isOnShelf = +data.is_self;
			// that.getAD_block5(data);
      if (typeof callback === 'function') { callback(); }
    }
  },
  getAD_block5(data) {
    const that = this;
    if (data.intercutList && data.intercutList.length) {
      require.ensure(['./block5'], (require) => {
        const Block5 = require('./block5');
        const randIndex = Math.floor(Math.random() * data.intercutList.length) % data.intercutList.length;
        that.intercut_id = data.intercutList[randIndex].content_id;
				// 广告图片加载好之后再显示广告
        GLOBAL.loadImage(data.intercutList[randIndex].image_url, callback);
        function callback() {
          const intercutList = (
            <div>
              <Block5
                data={[data.intercutList[randIndex]]} type="11" fromReading
              />
              <span className="iconfont icon-cha" onClick={that.closeIntercut} />
            </div>
					);

          that.intercutList = data.intercutList[randIndex];
          if (!that.isMounted()) { return; }
          that.setState({
            intercutList,
            showIntercut: true
          });
        }
      });
    }
  },
  getAD_xp(data) {
    const that = this;
    if (data.content && data.content.length) {
      require.ensure(['./block9'], (require) => {
        const Block9 = require('./block9');
        const randIndex = Math.floor(Math.random() * data.content.length) % data.content.length;
				// 广告图片加载好之后再显示广告
        GLOBAL.loadImage(data.content[randIndex].image_url, callback);
        function callback() {
          const intercutXp = (
            <div>
              <Block9
                data={{
                  contentlist: [data.content[randIndex]]
                }} type="11" fromReading
              />

            </div>
					);

          if (!that.isMounted()) { return; }
          that.setState({
            intercutXp,
            showIntercutXp: true
          });
        }
      });
    }
  },
  gotContent(data, from) {
    if (!this.isMounted()) { return; }
    if (data.code === 403) return;
    this.setState({
      showSetting: false,
      fromId: from || false
    });
    data = data.success || data;

		// 如果是付费章节，跳到确认订单
    if (data.errorMsg) {
      if (location.pathname.slice(-5) == 'login')	return;
			// console.log(data.errorMsg)
      this.goLogin(this.getContent, location.pathname);
      return;
    }
    const that = this;
    if (data.buyMsg) {
      that.setState({
        order: true,
        orderData: data
      });
      that.getIntroduce(that.confirmOrder.bind(that, data));
      return;
    }
    if (data.pageType === 'order') {
      if (storage.get(that.bid, 'string') === 'autoPay') {
        that.autoPay(data);
        return;
      }
      that.setState({
        order: true,
        orderData: data
      });
      that.getIntroduce(that.confirmOrder.bind(that, data));
      return;
    }
    that.getIntroduce();
		// that.getChapterlist();
    if (!data.content) return;

    data.content = that.getFormatContent(data.content);
    const currentPage = Math.ceil(+data.chapterSort / that.state.page_size);

    that.setState({
      data,
      loading: false,
      pages: currentPage,
      order: false
    }, that.getChapterlist);
    if (this.refs.scrollarea) this.refs.scrollarea.scrollTop = 0;
    this.execNextPlay && this.execNextPlay();

    this.getAd_xp(this.book_id, data.chapterSort);

		// if(that.isLogin() && !from) //from：来自咪咕
    that.getNextContent(data);
  },
  getAd_xp(bid, page) {
    const AJAX = new Ajax('adXp');
    AJAX.go({ bid, page: (Number(page)), page_size: 1, order_type: 'asrc', vt: 9 }, (res) => {
      if (res.content)	{
        this.getAD_xp(res);
      }
    }, GLOBAL.noop);
  },
  getAd_hc(bid) {
    const AJAX = new Ajax('adHc');
    AJAX.go({ bid }, (res) => {
      if (res.intercutList)	{
        this.setState({ Adhc: res });
        if (!this.state.adHc)					{ this.getAD_block5(res); }
      }
    });
  },
  getContent() {
    const book_info = this.APIParts('readingId');
    this.bid = book_info[1];
    this.chapterid = book_info[2];
    this.source_id = book_info[4];
    this.book_id = book_info[3];

    if (this.state.Adhc) {
      this.getAD_block5(this.state.Adhc);
    }

    if (!this.isMounted()) { return; }
    const nextChapter = this._nextChapter_;
    if (nextChapter && (nextChapter.preChapterId) == this.chapterid) {
      this.gotContent(nextChapter);
      return;
    }

    this.setState({
      loading: true
    });
    const that = this;
    bookContent.get({
      bid: this.bid,
      cid: this.chapterid,
      source_id: this.source_id,
      book_id: this.book_id,
      callback: that.gotContent,
      onError(res) {
        if (!that.isLogin()) {
          that.setState({
            order: true
          });
          that.goLogin(that.getContent);
          return;
        }
        GLOBAL.defaultOnError(res);
      }
    });
  },
  getNextContent(data) {
    if (!this.isMounted()) { return; }

    bookContent.get({
      noCross: true,
      bid: this.bid,
      cid: data.nextChapterId,
      source_id: this.source_id,
      book_id: this.book_id,
      callback: (bookData) => {
        if (bookData.success.pageType === 'order') {
          if (storage.get(this.bid, 'string') === 'autoPay') {
            this.autoPay(bookData.success, true);
            return;
          }
        }
        this._nextChapter_ = bookData.success;
      },
      onError: GLOBAL.noop
    });
  },
  confirmOrder(data) {
    const that = this;
    that.setState({
      chapterName: data.name
    });
    if (!this.state.fromId) {
      if (that.isLogin()) {
        goOrder();
      } else {
        that.goLogin(goOrder);
      }
    } else {
      goOrder();
    }
    function goOrder() {
      that.setState({ order: true, orderData: data });
    }
  },
  autoPay(orderData, isNext) {
    const that = this;
    if (!this.state.fromId) {
      if (that.isLogin()) {
        pay();
      } else if (!isNext) {
        that.goLogin(pay);
      }
    } else {
      pay_m();
    }
    function pay() {
      new Ajax().getJSON('GET', '/api/v1/auth/balance', {}, (data) => {
        const aidou = data.success.balance / 100;
				// console.log(aidou,orderData.marketPrice)
        if ((aidou - orderData.marketPrice) >= 0) {
          new Ajax().getJSON('GET', orderData.orderUrl, {}, (dataO) => {
            if (dataO.code !== 200)							{
              POP._alert('支付失败');
            } else {
              if (isNext) {
                that._nextChapter_ = dataO.success;
                return;
              }
              that.storeBookOrdered(that.chapterid);
              that.disPatch('updateUser');
              that.gotContent(dataO);
							// that.goBack();
            }
          });
        } else {
          that.setState({
            order: true
          });
          that.getIntroduce(that.confirmOrder.bind(that, orderData));
					// if(confirm('艾豆不足，请充值')){
					// 	that.getIntroduce(that.confirmOrder.bind(that,orderData));
					// }
        }
      });
    }

    function pay_m() {
      const AJAX = new Ajax('mOrder');
      AJAX.go({
        book_id: that.book_id,
        chapter_id: that.chapterid,
        cm: orderData.cm,
        firmnum: '',
        count: 1
      }, (data) => {
        if (data.code == 403)					{
          POP._alert('支付失败');
        } else {
          that.gotContent(data);
        }
      });
    }
  },
	// type -1 为第一章， 1位最后一章
  alert(msg, type) {
    if (!this[`hasAlert${type}`]) {
      POP._alert(msg);
      this[`hasAlert${type}`] = 1;
      return true;
    }
    return false;
  },
	// 当前章节翻页
  offsetPage(offset) {
    if (!this.isMounted()) { return; }
    this.setState({
      showSetting: false
    });
    const scrollarea = this.refs.scrollarea;
    const height = document.body.offsetHeight * offset;
    const scrollHeight = scrollarea.scrollHeight;
    if (scrollarea.scrollTop < 10 && offset < 0) {
      return this.prevChapter();
    } else if (scrollarea.scrollTop > scrollHeight - document.body.offsetHeight - 10 && offset > 0) {
      if (this.state.ttsModer && this.state.playing) {
        const sync = !!this._nextChapter_ && this._nextChapter_.pageType === null && this._nextChapter_.preChapterId === this.chapterid;
        this.pause();
        this.setNextPlay(!sync);
      }
      return this.nextChapter();
    }
    scrollarea.scrollTop = Math.max(0, Math.min(scrollarea.scrollTop + height, scrollHeight - height));
  },
  timeoutId: 0,
  toggleSettings_tts() {
    if (!this.isMounted()) return;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.setState({ showSetting_tts: !this.state.showSetting_tts });
    }, 10);
  },
  toggleSettings() {
    if (!this.isMounted()) { return; }
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      if (this.state.showChapterlist) {
        this.toggleChapterlist();
        return;
      }
      if (this.state.showSetting && this.state.showIntercut) {
        uploadLog.send('intercut', {
          content_id: this.intercutList.content_id,
          event: 1,
          show_class: this.intercutList.show_class
        });
      }
      this.setState({
        showSetting: !this.state.showSetting
      });
    }, 10);
  },
  toggleChapterlist() {
    if (!this.isMounted()) { return; }
    if (!this.state.showChapterlist && !this.state.chapterlist.length) {
      this.getChapterlist();
    }
    this.setState({
      showChapterlist: !this.state.showChapterlist,
      showSetting: false
    });
  },
  togglePlay(condition) {
    if (this.state.ttsModer) {
      try {
        if (condition) {
          this.pause();
        } else {
          this.play();
        }
      } catch (e) {}
    }
  },
  onVisibilitychange() {
    if (isHidden()) {
      this.addRecentRead(this.book_id, this.chapterid);
    } else {
      this.time = Date.now();
    }
  },
  getAds() {
    const bookid = this.APIParts('readingId')[3];
    this.getAd_hc(bookid);
  },
  disableVoiceHandle() {
    this.player.volume = 0;
  },
  volumHandle(e) {
    const targ = e.target;
    const i = targ.dataset.v || targ.parentNode.dataset.v;
    this.setState({ volum: +i }, this.playHandle);
  },
  speedHandle(e) {
    const targ = e.target;
    const i = targ.dataset.v || targ.parentNode.dataset.v;
    this.setState({ speed: +i }, this.playHandle);
  },
  playHandle() {
    if (!this.state.ttsModer) {
      this.setState({ ttsModer: true, showSetting: false, playing: true });
      POP._alert('进入语音朗读模式');
    }
    if (this.refs.scrollarea.scrollTop > 165) {
      const ps = this.refs.scrollarea.querySelectorAll('p');
      const len = ps.length;
      for (let i = 1; i < len; i++) {
				// console.log(this.refs.scrollarea.scrollTop,' / ',ps[i].offsetTop)
        if (ps[i].offsetTop > this.refs.scrollarea.scrollTop) {
          this.setState({
            ttsIndex: i - 1,
            playing: true
          }, this.audioRead);
          break;
        }
      }
    } else {
      this.setState({
        ttsIndex: -1,
        playing: true
      }, this.audioRead);
    }
  },
  quitTtsHandle() {
    this.pause();
    this.removePlayer();
    this.setState({
      ttsModer: false,
      showSetting_tts: false,
      playing: false
    });
    POP._alert('退出语音朗读模式');
  },
  pauseHandle() {
    this.setState({
      playing: !this.state.playing
    }, this.togglePlay.bind(this, this.state.playing));
  },
  voiceHandle() {
    this.setState({ femaleVoice: !this.state.femaleVoice }, this.playHandle);
  },
  audioRead() {
		// audio reading
    if (!this.access_token) return;
    const len = this.state.data.content.length;
    const cuid = 'ewfwiiw883';
    const voice = this.state.femaleVoice ? 0 : 1;
    const volum = (this.state.volum * 2) - 1;
    const speed = (this.state.speed * 2) - 1;

    doinsert.bind(this)();
    this.player.onended = this.player.onerror = () => {
      const isChapterEnd = this.state.ttsIndex >= len - 1;
      if (isChapterEnd) {
        const book_info = this.APIParts('readingId');
        this.bid = book_info[1];
        this.chapterid = book_info[2];
				// console.log(!!this._nextChapter_ && this._nextChapter_.pageType !== 'order' && this._nextChapter_.preChapterId === this.chapterid)
        if (!!this._nextChapter_ && this._nextChapter_.pageType !== 'order' && this._nextChapter_.preChapterId === this.chapterid) {
          this.goToChapter(this.state.data.nextChapterId);
        } else {
          this.setNextPlay(true);
          this.goToChapter(this.state.data.nextChapterId);
          return;
        }
      }
      if (this.state.order) {
        this.pause();
        return;
      }
      this.setState({ ttsIndex: isChapterEnd ? -1 : this.state.ttsIndex + 1 });
      this.refs.ttsReading && this.state.ttsIndex > 0 && this.refs.ttsReading.scrollIntoView({ behavior: 'smooth' });
      const content = this.state.ttsIndex === -1 ? this._nextChapter_.name : this.state.data.content[this.state.ttsIndex];

      const params = `lan=zh&tok=${this.access_token}&ctp=1&cuid=${cuid}&spd=${speed}&pit=5&vol=${volum}&per=${voice}&tex=${content}`;
      this.player.src = `http://tsn.baidu.com/text2audio?${encodeURI(encodeURI(params))}`;
			// this.player.oncanplay = ()=>{
      if (!this.state.playing) {
        this.pause();
        return;
      }
      this.player.load();
      this.play();
			// }
    };

    function doinsert() {
      if (this.player) this.removePlayer();
      if (this.state.order) return;
      const content = this.state.ttsIndex === -1 ? this.state.data.name : this.state.data.content[this.state.ttsIndex];
      const params = `lan=zh&tok=${this.access_token}&ctp=1&cuid=${cuid}&spd=${speed}&pit=5&vol=${volum}&per=${voice}&tex=${content}`;
      this.player = document.createElement('audio');
      this.player.src = `http://tsn.baidu.com/text2audio?${encodeURI(encodeURI(params))}`;
      this.player.setAttribute('type', 'audio/mp3');
      this.player.setAttribute('preload', '');
      // this.player.setAttribute('autoPlay', '');
      this.player.id = 'audioRead';
      document.body.appendChild(this.player);
      this.refs.ttsReading && this.state.ttsIndex > 0 && this.refs.ttsReading.scrollIntoView({ behavior: 'smooth' });
      this.player.load();
      this.player.play();
    }
  },
  play() {
    try {
      this.player.play();
    } catch (e) {}
  },
  pause() {
    try {
      this.player.pause();
    } catch (e) {}
  },
  setNextPlay(isAsync) {
    if (!this.isMounted()) return;

    if (isAsync) {
      this.execNextPlay = () => {
        POP.confirm('继续语音朗读吗？', () => {
          this.setState({ ttsIndex: -1 }, this.audioRead);
        }, () => {
          this.setState({ ttsModer: false, playing: false }, this.removePlayer);
        });
        this.execNextPlay = null;
      };
    } else {
      this.setState({ ttsIndex: -1 }, this.audioRead);
    }
  },
  removePlayer() {
    try {
      document.body.removeChild(this.player);
    } catch (e) {}
  },
  componentDidMount() {
    this.startTime = Date.now();
    setTimeout(() => {
      this.setState({ showFy: false });
    }, 1000);

    this.getAds();
    if (GLOBAL.isRouter(this.props)) this.getContent();
    document.addEventListener && document.addEventListener('visibilitychange', this.onVisibilitychange);
    window.onbeforeunload = this.addRecentRead.bind(this, this.book_id, this.chapterid);

    if (storage.get('showGuide') != '1') {
      this.setState({
        showGuide: true
      });
      storage.set('showGuide', '1');
    }
		// 扉页信息
    this.states = this.props.location.state;
    this.path = this.props.route.path.replace(/:([^"]*)/, '');
    this.path = window.location.pathname.split(`/${this.path}`)[0];

		// 为语音朗读准备access token
    new Ajax().getJSON('GET', '/baiduClientCredentials', {}, (data) => {
      this.access_token = data.access_token;
    });
  },
  handlePullToRrefresh(e) {
    const scrollY = this.refs.scrollarea.scrollTop;
    switch (e.type) {
      case 'pandown':
        if (scrollY > 5) {
          return;
        } else {
          this.refs.tip_top.classList.remove('f-hide');
        }
        break;
      case 'panend':
        break;
      default:
        break;
    }
  },
  componentDidUpdate(nextProps, nextState) {
		// var that = this; || (this.props.children !== nextProps.children)
    if ((this.props.params.readingId !== nextProps.params.readingId) || (nextProps.routes.length > this.props.routes.length)) {
      this.getContent();
    }

		// 如果购买页面正在语音阅读
    if (this.state.ttsModer && this.state.order) {
      if (this.player) this.pause();
			// this.setNextPlay(true);
    }

    let hammerTime;
    if (this.state.showSetting || this.state.showChapterlist) {
      hammerTime = new Hammer(this.refs.mask);
      hammerTime.on('tap', this.toggleSettings);
			// new Finger(this.refs.mask,{
			// 	tap:this.toggleSettings
			// });
    }
    if (this.state.showSetting_tts) {
      hammerTime = new Hammer(this.refs.mask);
      hammerTime.on('tap', this.toggleSettings_tts);
			// new Finger(this.refs.mask,{
			// 	tap:this.toggleSettings_tts
			// });
    }

    if (this.refs.swiper) {
			// new Finger(this.refs.swiper,{
			// 	swipe:(e)=>{
			// 		if(e.direction=='left'||e.direction=='right'){
			// 			this.setState({showIntercutXp: false});
			// 		}
			// 	}
			// });
      this.hammer = new Hammer(this.refs.swiper);
      this.hammer.off('swipeup swipeleft swiperight');
		    	// this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
		    	this.hammer.on('swipeleft swiperight', (ev) => {
		    		this.setState({ showIntercutXp: false });
		    	});
    }

    const scrollarea = this.refs.scrollarea;
    if (!scrollarea) { return; }
		// 第一次进入阅读跳到上次阅读的地方
    if (this.bookmarkFlag) {
			// console.log(storage.get('readLogNew'));console.log(this.APIParts('readingId'));
      const obj = storage.get('readLogNew')[this.APIParts('readingId')[3]];
      const offset = obj ? obj.chapter_offset : 0;
			// console.log(offset);console.log(scrollarea)
      scrollarea.scrollTop = offset;
      this.bookmarkFlag = false;
    }
		// scrollarea.addEventListener('touchstart',this.handleClick);
    if (scrollarea.getAttribute('data-events') != '1') {
      scrollarea.setAttribute('data-events', '1');
      hammerTime = new Hammer(scrollarea);
      hammerTime.on('tap', this.handleClick);
      hammerTime.on('pandown panend', this.handlePullToRrefresh);
    }

    const container = this.refs.containers;
    container.onscroll = function (e) {
      e.stopPropagation();
      let time;
      if (container.scrollTop + document.body.scrollHeight + 160 > container.scrollHeight) {
        clearTimeout(time);
        time = setTimeout(() => {
          this.getChapterlist(true);
        }, 100);
      }
    }.bind(this);
  },
  handleClick(e) {
    const y = e.center.y;
    const h = document.body.offsetHeight;
    if (y < 0.3 * h) {
			// top
      this.offsetPage(-1);
    } else if (y < 0.7 * h) {
			// middle
      if (this.state.ttsModer) {
        this.toggleSettings_tts();
      } else {
        this.toggleSettings();
      }
    } else {
			// bottom
      this.offsetPage(1);
    }
  },
  changeOrder() {
		// this.setState({orderSeq: !this.state.orderSeq});
    this.troggleChapterlist();
  },
  orderedBook: [],
  storeBookOrdered(cid, isBuyAll) {
    if (isBuyAll)			{
      this.setState({ isBuyAll });
    }
    this.orderedBook.push(cid);
    this.setState({ orderedBook: this.orderedBook });
  },

  hideGuide(e) {
    if (!this.isMounted()) { return; }
    this.setState({
      showGuide: false
    });
  },
  downLoad() {
    window.location.replace('https://readapi.imread.com/api/upgrade/download?channel=imread');
  },
  logout(e) {
    e.preventDefault && (e.preventDefault());
    POP.confirm('确定退出登录?', () => {
      const AJAX = new Ajax('loginout');
      AJAX.get((res) => {
      });
			// GLOBAL.removeCookie('userPhone');
      storage.rm('userToken');
			// GLOBAL.removeCookie('uuid');

      this.getContent();
    });
  },
  goBack() {
    storage.set(this.bid, 'autoPay');
    this.getContent();
    this.setState({ order: false });
  },
	// shouldComponentUpdate: function(nextProps, nextState) {
	// 	return this.state.loading !== nextState.loading
	// 			|| this.state.data !== nextState.data
	// 			|| this.state.showChapterlist !== nextState.showChapterlist
	// 			|| this.state.showSettingFont !== nextState.showSettingFont
	// 			|| this.state.showSetting !== nextState.showSetting
	// 			|| this.state.chapterlist !== nextState.chapterlist
	// 			|| this.state.getChapterlistLoading !== nextState.getChapterlistLoading
	// 			|| this.state.showGuide !== nextState.showGuide
	// 			|| JSON.stringify(this.state.style) !== JSON.stringify(nextState.style)
	// 			|| this.props.children !== nextProps.children
	// 			|| this.props.params !== nextProps.params
	// 			|| this.state.introduce !== nextState.introduce
	// 			|| this.state.orderData !==nextState.orderData
	// 			|| this.state.orderedBook !==nextState.orderedBook
	// 			|| this.state.intercutList !== nextState.intercutList;
	// },
  render() {
    const currentRoute = location.pathname.split('/');
    currentRoute.pop();
    const ChapterlistHrefBase = currentRoute.join('/');
    const head = <Header title={this.state.bookName} right={null} path={this.props.route} />;
    const classNames = readingStyle.getClass(this.state.style);
    let intercut;

		// 防止排序时候的绑定
    const chapterlist = {};
    chapterlist.list = this.state.chapterlist;
    const list = JSON.parse(JSON.stringify(chapterlist)).list;

    if (!this.states) { this.states = { book_name: '', author: '' }; }

    if (this.state.UFO) {
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
    if (this.state.order && this.state.introduce) {
      const right = this.state.fromId ? (<a className="icon-s icon-tc right" onClick={this.logout} />) : null;
      return (<div className="gg-body">
        <Header path={this.props.route} right={right} title={'确认订单'} />
        <div className="g-main g-main-1">
          <PayOrder data={this.state.orderData} chapterid={this.APIParts('readingId')[2]} storeBookOrdered={this.storeBookOrdered} goBack={this.goBack} route={this.props.route} isMigu={this.state.fromId} introduce={this.state.introduce} />
        </div>
        {this.props.children}
      </div>
      );
    }

    if (this.state.showFy) {
      return (
        <div className="gg-body">
          <div className={`m-reading-fy style-${this.state.style.style}`}>
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

    if (!this.state.data) {
      return (<div className="gg-body">
        <div className={`m-reading-fy style-${this.state.style.style}`}>
          <Loading />
        </div>
        {this.props.children}
      </div>);
    }

    if (this.state.intercut) {
      intercut = <Intercut data={this.state.intercut} />;
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
        <div className={`ad-xp${this.state.showIntercutXp ? '' : ' f-hide'}`} ref="swiper">
          {this.state.intercutXp}
          <div className="banner">点击图片查看更多，左右滑动继续阅读</div>
        </div>
        <div className={`style ${classNames}`}>
          <div ref="mask" className={`u-hideChapterlist${(this.state.showChapterlist || this.state.showSetting || this.state.showSetting_tts) ? ' active' : ''}`} />
          <div className={`u-readingsetting${(!this.state.showSetting && ' f-hide') || ''}`}>
            <button type="button" className="u-playBtn iconfont icon-erji" onClick={this.playHandle} />
            <div className="u-settings u-settings-top">
              <span className="iconfont icon-left f-fl" onClick={this.goOut} />
              <span className="title f-ellipsis f-fl">{this.state.bookName}</span>
              <span onClick={this.downLoad} className="iconfont icon-download f-fr" />
            </div>

            <div className="u-settings u-settings-top ad">
              <div className={this.state.showIntercut ? '' : 'f-hide'}>
                {this.state.intercutList}
              </div>
            </div>


            <div className={`u-settings u-settings-font${(!this.state.showSettingFont && ' f-hide') || ''}`}>
              {/* <div className="setting-fontfamily setting-font-line f-flexbox">
							<div className="title">字体</div>
							{
								['默认', '宋体', '黑体', '楷体'].map(function(font, i) {
									return <div className={"item f-flex1" + (this.state.style.fontFamily == (i + 1) ? ' active' : '')} onClick={this.setFontFamily} data-id={i + 1} key={i}>{font}</div>;
								}.bind(this))
							}
						</div>*/}
              <div className="setting-fontsize setting-font-line m-slidBar f-clearfix">
                <span className="iconfont icon-font label f-fl" />
                <div className="u-slidBar f-clearfix f-fr">
                  {

										[1, 2, 3, 4, 5].map((dataid, i) => (<div key={i} onClick={this.setFontSize} data-font={dataid} className={`f-fl${this.state.style.fontSize >= dataid ? ' active' : ''}`}>
  {dataid === 1 ? (<span className="circle" data-font={dataid} />) : null}
  <span className="line" data-font={dataid} />
  <span className="circle" data-font={dataid} />
												</div>))

									}

                </div>
              </div>
              {/* <div className="setting-line-height setting-font-line f-flexbox">
							<div className="title">排版</div>
							{
								['icon-lh3', 'icon-lh2', 'icon-lh1'].map(function(icon, i) {
									return <div className={"item f-flex1" + (this.state.style.lineheight == (i + 1) ? ' active' : '')} onClick={this.setFontHeight} data-id={i + 1} key={i}><span className={"iconfont " + icon}></span></div>
								}.bind(this))
							}
						</div>*/}
              <div className="setting-bg setting-font-line f-flexbox">
                {
								[0, 1, 2, 3, 4].map((dataid, i) => (
  <div className="item f-flex1" key={i}>
    <div className={`active-border${this.state.style.style == dataid ? ' active' : ''}`} data-id={dataid} onClick={this.setFontBg} />
  </div>
									))
							}
              </div>
            </div>
            <div className="u-settings u-settings-bottom f-flexbox">
              <a className="u-settingitem f-flex1" onClick={this.prevChapter}><span className="iconfont icon-up  prv" /><span>上一章</span></a>
              <a className="u-settingitem f-flex1" onClick={this.toggleChapterlist}><span className="iconfont icon-mulu" /><span>目录</span></a>
              <a className="u-settingitem f-flex1" onClick={this.toggleSettingFont}><span className="iconfont icon-lanmu-copy" /><span>设置</span></a>
              <a className="u-settingitem f-flex1" onClick={this.nextChapter}><span className="iconfont icon-down next" /><span>下一章</span></a>
              {/* <a className="u-settingitem f-flex1" onClick={this.toggleSettingFont}><span className="iconfont u-icon icon-fsize"></span></a>
						<a className="u-settingitem f-flex1" onClick={this.toggleSettingFont}><span className="iconfont u-icon icon-fsize"></span></a>
						<a className="u-settingitem f-flex1" onClick={this.toggleNightStyle}><span className={"iconfont u-icon icon-moon" + (this.state.style.night ? ' icon-sun' : '')}></span></a>*/}
            </div>
          </div>
          <div className={`u-ttsSetting${this.state.showSetting_tts ? '' : ' f-hide'}`}>
            <div className="m-slidBar f-clearfix" ref="volum">
              <button className="label f-fl" type="button" onClick={this.disableVoiceHandle}>{this.state.volum == 0 ? '静音' : '音量'}</button>
              <div className="f-fr u-slidBar f-clearfix">
                {
								[1, 2, 3, 4, 5].map(v => (<div onClick={this.volumHandle} data-v={v} key={v} className={`f-fl${v <= this.state.volum ? ' active' : ''}`}>
  {v == 1 ? (<span className="circle" />) : null}
  <span className="line" />
  <span className="circle" />
											</div>))
							}
              </div>
            </div>
            <div className="m-slidBar f-clearfix" ref="speed">
              <button className="label f-fl">语速</button>
              <div className="f-fr u-slidBar f-clearfix">
                {
								[1, 2, 3, 4, 5].map(v => (<div onClick={this.speedHandle} data-v={v} key={v} className={`f-fl${v <= this.state.speed ? ' active' : ''}`}>
  {v == 1 ? (<span className="circle" />) : null}
  <span className="line" />
  <span className="circle" />
											</div>))
							}
              </div>

            </div>
            <div className="btnWrap">
              <button type="button" className={`u-voiceBtn iconfont${this.state.femaleVoice ? ' icon-female' : ' icon-male'}`} onClick={this.voiceHandle} />
              <button type="button" className={`u-pauseBtn iconfont${!this.state.playing ? ' icon-play' : ' icon-pause'}`} onClick={this.pauseHandle} />
              <button type="button" className="u-quitTtsBtn iconfont icon-quit" onClick={this.quitTtsHandle} />
            </div>
          </div>
          <section className={`u-chapterlistc${(this.state.showChapterlist && ' active') || ''}`}>
            <div className="u-chapterlist">
              <div className="u-bookname f-ellipsis">
                <span>目录</span>
                <div onClick={this.changeOrder} >
                  <span>{this.state.orderSeq ? '顺序' : '倒序'}</span>
                  <span className={`iconfont icon-paixu f-fr${this.state.orderSeq ? ' rev' : ' seq'}`} />
                </div>
              </div>
              <div className="u-scroll-y" onClick={this.toggleChapterlist} ref="containers">
                <Chapterlist hrefBase={ChapterlistHrefBase} chapterlist={this.state.orderSeq ? list : list.reverse()} isBuyAll={this.state.isBuyAll} store={this.state.orderedBook} source_bid={this.bid} bid={this.book_id} loading={this.state.chapterlistNoMore} book={this.states} currentChapterId={this.chapterid} fromReading source_id={this.source_id} />
              </div>

            </div>
          </section>
          <div className={`m-reading${classNames}`} ref="scrollarea" onScroll={this.handleScroll} style={{ overflowY: (this.state.showSetting || this.state.showChapterlist) ? 'hidden' : 'auto' }}>
            {this.state.source_id === '1' ? <i className="u-miguLogo" /> : null}
            <button className="u-btn-1 f-hide" ref="tip_top">点击阅读上一章</button>

            <section className={`u-chapterName${this.state.ttsModer && this.state.ttsIndex === -1 ? ' ttsReading' : ''}`}>{this.state.data.name}</section>
            <section className="u-readingContent" ref="reading">
              {
							this.state.data.content.map((p, i) => (
  <p
    className={this.state.ttsModer && (i === this.state.ttsIndex) ? 'ttsReading' : ''}
    ref={this.state.ttsModer && (i === this.state.ttsIndex) ? 'ttsReading' : ''}
    key={i}
    dangerouslySetInnerHTML={{ __html: p }}
  />
								))
						}
            </section>
            {intercut}
            <button className="u-btn-1">点击阅读下一章</button>
          </div>


          {/* <div id="reading-download" className={this.state.download?'active':''}>
			        	<a href="https://readapi.imread.com/api/upgrade/download?channel=aidouhd">
			            <img src="https://www.imread.com/img/mobile-logo.png?2" />
			            <div className="detail">
			                <p>你想看的好书</p>
			                <p>艾美阅读都有</p>
			            </div>
			            <div className="down-button">
			                立即下载
			            </div>
			           </a>
			        </div> */}


          <div className={`reading-guide${this.state.showGuide ? '' : ' f-hide'}`} onClick={this.hideGuide}>
            <div className="reading-guide-item guide-top">
              <div className="guide-tip">
                <span>点击可以滚动</span>
                <br />
                <span>页首到上一页</span>
              </div>
            </div>
            <div className="reading-guide-item guide-middle f-clearfix">
              <div className="guide-icon f-fl">
                <img src="/src/img/reading-guide.png" />
              </div>
              <div className="guide-content f-fl">
                <div className="guide-tip">
                  <span>点击中间</span>
                  <br />
                  <span>呼出菜单</span>
                </div>
              </div>
            </div>
            <div className="reading-guide-item guide-bottom">
              <div className="guide-tip">
                <span>点击可以滚动</span>
                <br />
                <span>页尾到下一页</span>
              </div>
            </div>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Reading;
