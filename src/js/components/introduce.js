import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import myEvent from '../modules/myEvent';
import NoData from './noData';
import Loading from './loading';
import storage from '../modules/storage';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import Header from './header';
import Book1 from './book1';
import Chapterlist from './chapterlist';
import parseQuery from '../modules/parseQuery';

if (typeof window !== 'undefined') {
  require('../../css/introduce.css');
}

const Detail = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    return {
      isOnshelf: !!this.props.book.is_self
    };
  },
  addBook() {
    if (this.props.isOnshelf) return;
    const cId = this.props.book.current_chapter_id;
    const cOffset = this.props.book.current_chapter_offest;
    const param = [{
      bookId: this.props.book.bid,
      type: 3,
      time: new Date().getTime(),
      chapter_id: cId || 0,
      chapter_offset: cOffset || 0
    }];
    this.shelfAdding(param, this.props.onShelf);
  },
  gotoAuthor() {
    GLOBAL.title = this.props.book.author;
    browserHistory.push(GLOBAL.setHref(`author/alist.${encodeURIComponent(this.props.book.author)}`));
  },
  gotoDownload() {
    window.location.replace('https://readapi.imread.com/api/upgrade/download?channel=imread');
  },
  startReading() {
    const readLog = storage.get('readLogNew');
    const sourcebid = this.props.book.source_bid;
    const localid = this.props.book.bid;
    const source_id = this.props.book.source_id;
    let chapterid = this.props.book.current_chapter_id;
    if (readLog[this.props.book.bid]) {
      chapterid = readLog[this.props.book.bid].current_chapterid;
    }
    browserHistory.push({ pathname: location.pathname + ['/reading/crossDomain', sourcebid, chapterid, localid, source_id].join('.'), state: { author: this.props.book.author, book_name: this.props.book.book_name } });
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.book !== nextProps.book || this.props.isOnshelf !== nextProps.isOnshelf;
  },
  render() {
		// var cls = this.props.isOnshelf? ' disabled':'';
    const val = this.props.isOnshelf ? '下载' : '加入书架';
    return (
      <div className="u-bookIntroduce">
        <div className="f-clearfix">
          <div className="f-fl imgWrap-133">
            <img src={this.props.book.big_coverlogo} className="introduce-cover" />
          </div>
          <div className="bookinfo">
            <div className="title">{this.props.book.book_name}</div>
            <div className="author" onClick={this.gotoAuthor}>{this.props.book.author}</div>
            <div className="wordCount">{`${this.props.book.word_count}字/${this.props.book.status == '0' ? '连载中' : '已完本'}`}</div>
            <div className="bookSource"><span>来源：{this.props.book.source_name}</span></div>
            <div className="buttons f-clearfix">
              <a className="readButton button f-fl" onClick={this.startReading}>开始阅读</a>
              <button className={'button f-fr'} onClick={this.props.isOnshelf ? this.gotoDownload : this.addBook}>{val}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
const Introduce = React.createClass({
  mixins: [mixins()],
  isUpdate: true,
  getInitialState() {
    return {
      isOnshelf: false,
      bid: this.APIParts('introduceId')[1],
      chapterlist: null,
      page: 0,
      page_size: 20,
      vt: 9,
      getChapterlistLoading: false,
      book: null,
      noMoreChapterlist: false,
      noData: false,
      UFO: false,
      seq: true
    };
  },
  cacheBook(data) {
    const bookIntroduce = storage.get('bookIntroduce', 'array');
    if (bookIntroduce.length > 10) {
      bookIntroduce.unshift();
    }
    let flag = true;
    for (let i = 0; i < bookIntroduce.length; i++) {
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
  getBook(param) {
    if (!this.isMounted()) { return; }
    const hash = param || this.props.params.introduceId;
    const AJAX = new Ajax(hash);
    AJAX.get(this.ajaxHandle, (error) => {
      this.setState({
        UFO: true
      });
			// console.log(error)
    });
  },
  ajaxHandle(data) {
    if (data.code === 403) {
      this.setState({
        noData: true
      });
      return;
    }
    data.content_id = data.bid = this.APIParts('introduceId')[1];
    data.name = data.book_name;
    this.isUpdate = true;
    this.setState({
      book: data,
      isOnshelf: !!data.is_self
    });
		// this.cacheBook(data);
  },
  getChapterlist(next) {
    if (!this.isMounted() || this.state.getChapterlistLoading || this.state.noMoreChapterlist) {
      return;
    }

    let page;
    if (this.state.seq)			{ page = this.state.page + 1; } else			{
      page = this.state.page - 1;
    };
    if (page == 0)	return;

    this.setState({
      getChapterlistLoading: true
    });

    const AJAX = new Ajax(`chapterlist.${this.state.book.bid}.${this.state.page_size}.9.asc.${page}`);

    AJAX.get((data) => {
      let chapterlist = [];
      if(this.state.seq){
        chapterlist= this.lastBookid !== this.state.book.bid?
                      data.chapterList:
                      (this.state.chapterlist || []).concat(data.chapterList);
      }else{
        chapterlist = this.lastBookid !== this.state.book.bid?
                      data.chapterList:
                      data.chapterList.concat(this.state.chapterlist || []);
      }
      this.lastBookid = this.state.book.bid;
      this.setState({
        noMoreChapterlist: this.state.seq ? (Math.ceil(data.totalSize / this.state.page_size) <= (this.state.page + 1)) : (page <= 1),
        chapterlist,
        page,
        getChapterlistLoading: false
      });
      if (!this.state.seq && data.chapterList.length < this.state.page_size) this.getChapterlist();
    });
  },
  onShelf() {
    if (!this.isMounted()) { return; }
    this.setState({
      isOnshelf: true
    });
  },
  gotoShelf() {
    const href = `${location.pathname.replace(/\/shelf([^"]*)/, '')}/shelf`;
    if (this.isLogin())			{ browserHistory.push(href); } else {
      this.goLogin(() => {
        browserHistory.push(href);
      });
    }
  },
  troggleChapterlist() {
    this.setState({ seq: !this.state.seq, chapterlist: [], noMoreChapterlist: false });
    let page = 0;
    if (this.state.seq)			{
      page = Math.ceil((this.state.book.chapter_count / this.state.page_size) + 1);
    }
    this.setState({ page });

    setTimeout(() => {
      this.getChapterlist();
    }, 200);
  },
  componentWillReceiveProps(nextProps) {
    if (!this.isMounted()) { return; }
    this.setState({
			// chapterlist: null,
      page: 0
    });
  },
  componentWillMount() {
    this.usePreload(this.props.params.introduceId);
  },
  componentDidMount() {
    const obj = parseQuery(location.search);
	      if (obj.action && obj.action == 'openapp') {
	      	const p = `detail/${encodeURI(`[{"detail":[{"bid":"${obj.book_id}","type":"9"}],"pushcmd":"9"}]`)}`;
        window.location.href = `imread://${p}`;
	      }
	    if (GLOBAL.isRouter(this.props) && !this.state.book) this.getBook();
    myEvent.setCallback('updateShelfBtn', this.onShelf);
  },
  componentDidUpdate(nextProps, nextState) {
    GLOBAL.isAd();
    if (GLOBAL.isRouter(this.props)) {
      if (!this.state.book) {
        this.getBook();
      }
      if (this.props.params.introduceId !== nextProps.params.introduceId)	{
        this.getBook();
      }
    }
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.book !== nextState.book
				|| this.state.chapterlist !== nextState.chapterlist
				|| this.state.isOnshelf !== nextState.isOnshelf
				|| this.state.getChapterlistLoading !== nextState.getChapterlistLoading
				|| this.state.noData !== nextState.noData
				|| this.state.UFO !== nextState.UFO
				|| this.props.children !== nextProps.children
				|| this.props.params.introduceId !== nextProps.params.introduceId;
  },
  render() {
    let header;
    let loading;
    let introduceTabs;
    let detail;
    const right = <span onClick={this.gotoShelf} className="iconfont icon-shujia f-fr" />;
    if (!this.state.book || !this.isUpdate) {
      header = <Header title={null} right={right} path={this.props.route} />;
      if (GLOBAL.isRouter(this.props)) {	// 兼容低端安卓
        loading = <Loading />;
      }
      if (this.state.noData) {
        loading = <NoData />;
      }
      if (this.state.UFO) {
        loading = <NoData type="UFO" />;
      }
    } else {
      header = <Header title="书籍详情" right={right} path={this.props.route} />;

      detail = <Detail book={this.state.book} bid={this.state.bid} isOnshelf={this.state.isOnshelf} onShelf={this.onShelf} />;
      introduceTabs = <IntroduceTabs key="3" book={this.state.book} troggleChapterlist={this.troggleChapterlist} source_id={this.state.book.source_id} source_bid={this.state.book.source_bid} bid={this.state.book.bid} readlist={this.state.book.readList} getChapterlist={this.getChapterlist} getChapterlistLoading={this.state.noMoreChapterlist} book_brief={this.state.book.book_brief} chapterlist={this.state.chapterlist} />;
    }
    return (
      <div className="gg-body">
        <div>
          {/* <p>{this.state.book?this.state.book.book_name:''} </p>*/}
          {header}
          <div className="introduce-container" >
            {detail}
            {introduceTabs}
            {loading}
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
});

const IntroduceTabs = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    return {
      current: 0,
      fixTabbar: false,
      orderSeq: true,
      list: []
    };
  },
  toggleTab(index) {
    this.setState({
      current: index
    });
    if (index == 1) {
      this.props.getChapterlist();
      this.setState({ showOrderIcon: true });
    } else {
      this.setState({ showOrderIcon: false });
    }
  },
  troggleOrderList(e) {
    e.stopPropagation();
    this.setState({
      current: 1,
    });
    this.props.troggleChapterlist();
    if (this.props.chapterlist)			{
      this.setState({
        orderSeq: !this.state.orderSeq,
      });
    } else			{
      this.props.getChapterlist();
    }
  },
  timeout: {},
  componentDidMount() {
    const containers = document.getElementsByClassName('introduce-container');
    if (!containers.length) { return; }
    const container = containers[containers.length - 1];
    const self = this;
    container.onscroll = function (e) {
      clearTimeout(self.timeout.fixTabbar);
      self.timeout.fixTabbar = setTimeout(() => {
        if (self.isMounted()) 					{
          self.setState({
            fixTabbar: container.scrollTop > 202
          });
        }
      }, 100);
      if (self.state.current == 2) {
        self.lazyloadImage(container);
      } else if (self.state.current == 1) {
        if (container.scrollTop + document.body.scrollHeight + 100 > container.scrollHeight) {
          clearTimeout(self.timeout.scroll);
          self.timeout.scroll = setTimeout(() => {
            self.props.getChapterlist(true);
          }, 100);
        }
      }
    };
  },
  componentDidUpdate(nextProps, netxtState) {
    if (this.state.current == 2) {
      const containers = document.getElementsByClassName('introduce-container');
      if (!containers.length) { return; }
      const container = containers[containers.length - 1].parentNode;
      this.lazyloadImage(container);
    }
  },
  render() {
		// console.log(this.props)
    const fixTabbar = this.state.fixTabbar ? 'u-fixTabbar' : '';
    let list = JSON.parse(JSON.stringify(this.props.chapterlist || []));
    list = this.state.orderSeq ? list : list.reverse();
    const orderIcon = this.state.showOrderIcon ?
      <span className={`iconfont icon-paixu${this.state.orderSeq ? ' rev' : ' seq'}`} onClick={this.troggleOrderList} /> :
				null;
    const path = typeof window === 'undefined' ?
				global.pathname :
				location.pathname;
    return (
      <div className="u-tabs u-bookIntroduce">
        <div className={fixTabbar}>
          <div className={'u-tabbar'} ref="tabbar">
            <span onClick={this.toggleTab.bind(this, 0)} className={`tab tab-0${this.state.current == 0 ? ' active' : ''}`}>简介</span>
            <span onClick={this.toggleTab.bind(this, 1)} className={`tab tab-1${this.state.current == 1 ? ' active' : ''}`}>目录{orderIcon}</span>
            <span onClick={this.toggleTab.bind(this, 2)} className={`tab tab-2${this.state.current == 2 ? ' active' : ''}`}>推荐</span>
          </div>
        </div>
        <div className="contents" ref="contents">
          <div className={`content content-0${this.state.current == 0 ? ' active' : ''}`} dangerouslySetInnerHTML={{ __html: this.props.book_brief }}></div>
          <div className={`content content-1${this.state.current == 1 ? ' active' : ''}`}>
            <Chapterlist hrefBase={`${path}/reading`} source_id={this.props.source_id} book={this.props.book} order={this.state.orderSeq} source_bid={this.props.source_bid} bid={this.props.bid} chapterlist={list} loading={this.props.getChapterlistLoading} />
          </div>
          <div className={`content content-2${this.state.current == 2 ? ' active' : ''}`}>
            <Readlist readlist={this.props.readlist} />
          </div>
        </div>
      </div>
    );
  }
});

const Readlist = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.readlist !== nextProps.readlist;
  },
  render() {
    let loading;
    let content;
    if (!this.props.readlist) {
      loading = <Loading />;
    } else {
      content = (
        <ul>
          {
					this.props.readlist.map((book, i) => <Book1 key={i} data={book} />)
				}
        </ul>
			);
    }
    return (
      <div>
        {loading}
        {content}
      </div>
    );
  }
});

module.exports = Introduce;
