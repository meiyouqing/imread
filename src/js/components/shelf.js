import myEvent from '../modules/myEvent';
import NoData from './noData';
import Loading from './loading';
import storage from '../modules/storage';
import browserHistory from 'react-router/lib/browserHistory';
import Link from 'react-router/lib/Link';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import React from 'react';
// import Order from '../modules/order' //by required
if (typeof window !== 'undefined') {
  var POP = require('../modules/confirm');
}
const Header = require('./header_f');
const Img = require('./img');

const Shelf = React.createClass({
  mixins: [mixins()],
  startReading(v) {
    if (!this.isMounted()) return;
    const bid = v.content_id;
    let cid = v.chapter_id;
    if (!this.state.setting) { // 开始阅读
      this.setState({ showModelList: false });
      if (!this.state.reading) return;
      const readLog = storage.get('readLogNew')[bid];
      if (readLog) {
				// console.log(readLog)
        cid = readLog.current_chapterid;
      }
      myEvent.setCallback('refreshShelf', this.getList);
      this.compClick();
      browserHistory.push({ pathname: GLOBAL.setHref(`reading/crossDomain.${v.source_bid}.${cid}.${bid}.${v.source_id}`), state: { author: v.author, book_name: v.name } });
    } else {  // 选择操作
      const index = this.state.selected.indexOf(bid);
      if (index == -1) {
        this.state.selected.push(bid);
        this.setState({
          selected: this.state.selected
        });
      } else {
        this.state.selected.splice(index, 1);
        this.setState({
          selected: this.state.selected
        });
      }
    }
  },
  showModels() {
    if (!this.isMounted()) return;
    this.setState({ showModelList: !this.state.showModelList });
  },
  settingClick(e) {
    if (!this.isMounted()) return;
		// 如果书架是空，返回
    if (!this.state.shelfList.length) {
      this.setState({
        showModelList: false
      });
      POP._alert('亲，书架还空荡荡的哦');
      return;
    }
    const index = Number(e.target.getAttribute('data-index'));
    const completion = <button className="f-fr textBtn" onClick={this.compClick} >确定</button>;
    let setting = false,
      selected = [],
      icon = null,
      left = null,
      middle = null,
      reading = false;

    switch (index) {
      case 1:
        var seAll = <button className="f-fl textBtn no-ml" onClick={this.seAllClick} >全选</button>;
        var seNone = <button className="f-fl textBtn no-ml" onClick={this.seNoneClick} >取消全选</button>;
        setting = true;
        icon = <i className="iconfont icon-duihao" />;
        left = this.state.toggle ? seNone : seAll;
        break;
      case 2:
        break;
      case 3:
        break;
    }

    this.setState({
      setting,
      selected,
      icon,
      left,
      middle,
      right: completion,
      model: index,
      title: '',
      reading,
      showModelList: false
    });
  },
  gotoHome() {
    this.goBackUrl(this.props.route);
  },
  compClick() {
		// var icon = <i className="u-recentRead"></i>;
    const setting = <div className="iconfont icon-lanmu f-fr" onClick={this.showModels} />;
    const back = <a className="f-fl iconfont icon-left" onClick={this.gotoHome} />;
    const middle = <a className="iconfont icon-shucheng f-fr" onClick={this.gotoZy} />;
    this.setState({
      setting: false,
      left: back,
      right: setting,
      icon: null,
      model: 0,
      middle,
      title: '书架',
      reading: true
    });
  },
  seAllClick() {
    if (!this.isMounted()) return;
    const seNone = <button className="f-fl textBtn no-ml" onClick={this.seNoneClick} >取消全选</button>;
    this.state.shelfList.forEach((v) => {
      this.state.selected.push(v.content_id);
    });
    this.setState({
      left: seNone,
      selected: this.state.selected
    });
  },
  seNoneClick() {
    const seAll = <button className="f-fl textBtn no-ml" onClick={this.seAllClick} >全选</button>;
    if (!this.isMounted()) return;
    this.setState({
      left: seAll,
      selected: []
    });
  },
  gotoZy() {
    browserHistory.push('/mall');
  },
  gotoReading() { // 详情页面
    if (this.state.selected.length !== 1) return;
    else {
      this.state.shelfList.forEach((v, i) => {
        if (v.content_id == this.state.selected[0]) {
					// this.startReading(null,v);

          this.compClick();

          browserHistory.push(location.pathname.replace(/\/book\/introduce\.([^"]*)/,'')+'/book/introduce.'+v.content_id);
        }
      });
    }
  },
  gotoDownload() { // 下载
    if (!this.state.selected.length) return;
    this.compClick();
    window.location.replace('https://readapi.imread.com/api/upgrade/download?channel=imread');
  },
  delBtnClick() { // 删除书架书籍
    if (!this.state.selected.length) {
			// POP._alert('别闹~至少选择一本书先！')
      return;
    }
    let param = [];
    this.state.selected.forEach((v) => {
      const o = { type: 3, bookId: v };
      param.push(o);
    });
    param = JSON.stringify(param);
    const AJAX = new Ajax('deleteBook');
    AJAX.go({ param }, (data) => {
      this.getList();
      this.compClick();
    });
  },
  changeOrder(e) { // 排序模式选择
    const a = e.target.tagName == 'A' ? e.target : e.target.parentNode;
    const i = a.getAttribute('data-info');
    this.sortBook(i, this.state.shelfList);
  },
  sortBook(i, arr, bool) {
    let isReverse = true;
    if (this.models.order_model !== i) isReverse = false;
    if (bool) isReverse = false;
    switch (i) {
      case '1':
        if (isReverse) {
          arr.reverse();
          this.isReverse_s('reading_order');
        } else {
          arr = arr.sort((a, b) => {
            let x = a.playorder / a.count,
              y = b.playorder / b.count;
            return y - x;
          });
          if (this.models.reading_order == 1)						{
            arr.reverse();
          }
        }
        break;
      case '2':
        require.ensure([], (require) => {
          const Order = require('../modules/order');
					// console.log(isReverse,arr)
          if (isReverse) {
            arr.reverse();
            this.isReverse_s('book_order');
          } else {
            arr = Order.queue(arr, 'name');
						// arr = arr.sort(function(a,b){
						// 	var x = a.name,y=b.name;
						// 	return x.localeCompare(y);
						// });

            if (this.models.book_order == 1)							{ arr.reverse(); }
          }
          doAasycFunction.call(this, arr);
        });
        break;
      default:
        if (isReverse) {
          arr.reverse();
          this.isReverse_s('recent_order');
        } else {
          arr.sort((a, b) => {
            let x = Number(a.mark_time),
              y = Number(b.mark_time);
            return y - x;
          });
          if (this.models.recent_order == 1)						{
            arr.reverse();
          }
        }
    }
    doAasycFunction.call(this, arr);
    function doAasycFunction(arr) {
      this.models.order_model = i;
      this.setState({ order_model: i, recent_order: this.models.recent_order, reading_order: this.models.reading_order, book_order: this.models.book_order, shelfList: arr });
      try {
        localStorage.setItem('models', JSON.stringify(this.models));
      } catch (e) {}
    }
  },
  isExist(n) {
    return n ? n : '0';
  },
  isReverse_s(key) {
    const bool = Number(this.models[key]);
    if (bool)			 { this.models[key] = '0'; } else			 {
      this.models[key] = '1';
    }
  },
  changeShow(e) {
    if (!this.isMounted()) return;
    const a = e.target.tagName == 'A' ? e.target : e.target.parentNode;
    const i = a.getAttribute('data-cls');

    this.models.show_model = i;
    this.setState({ show_model: i });
    localStorage.models = JSON.stringify(this.models);
  },
  models: {},
  getInitialState() {
		// var icon = <i className="u-recentRead"></i>;
    const setting = <div className="iconfont icon-lanmu f-fr" onClick={this.showModels} />;
    const back = <a className="f-fl iconfont icon-left" onClick={this.gotoHome} />;
    const middle = <a className="iconfont icon-shucheng f-fr" onClick={this.gotoZy} />;
    this.models = {
      order_model: '0',
      book_order: '0',
      recent_order: '0',
      reading_order: '0'
    };// 获取模式和排序
    if (typeof window !== 'undefined' && localStorage.models) {
      this.models = JSON.parse(localStorage.models);
    }
    return {
      title: '书架',
      setting: false,
      toggle: false,
      left: back,
      right: setting,
      middle,
      icon: null,
      selected: [],
      noMore: true,
      shelfList: null,
      showModelList: false,
      model: 0, // 默认为无
      reading: true,
      show_model: this.models.show_model ? this.models.show_model : '0',
      order_model: this.models.order_model ? this.models.order_model : '0',
      recent_order: this.models.recent_order ? this.models.recent_order : '0',
      reading_order: this.models.reading_order ? this.models.reading_order : '0',
      book_order: this.models.book_order ? this.models.book_order : '0',
      boxHeight: 'auto'
    };
  },
  getList() {
		// const AJAX = new Ajax('block.156.100.1');
    const AJAX = new Ajax('shelf');

    AJAX.get(this.ajaxHandle, this.onerror);
  },
  ajaxHandle(data) {
    if (!this.isMounted()) return;
    const order_model = this.models.order_model ? this.models.order_model : 0;
    this.sortBook(order_model, data.content, true);
		// 设置GLOBAL.booklist/book
		// GLOBAL.setBlocklist(data);
  },
  componentWillMount() {
    this.usePreload('shelf');
  },
  componentDidMount() {
    this.models = localStorage.models ? JSON.parse(localStorage.models) : {};// 获取模式和排序
    if (!this.isLogin()) {
      this.goLogin(() => {
        browserHistory.push(location.pathname);
      });
      return;
    }
    if (!this.state.shelfList) {
      this.getList();
    }
    this.refs.container && this.lazyloadImage(this.refs.container);
		// reset img box size
    const width = (document.body.offsetWidth - 60) / 3;
    const height = width * 1.346;
    this.setState({ boxHeight: height });
  },
  componentDidUpdate(nextPros, nextState) {
    const isRouter = GLOBAL.isRouter(this.props);
    if (isRouter && !this.isLogin()) {
      browserHistory.replace('/');
    }
    if (isRouter && this.props.children !== nextPros.children) 			{
      setTimeout(() => {
        this.getList();
      }, 100);
    }

    if (isRouter && !this.state.shelfList && !!nextState.shelfList)	this.getList();
    this.refs.container && this.lazyloadImage(this.refs.container);
  },
  render() {
    const header = <Header title={this.state.title} left={this.state.left} right={this.state.right} middle={this.state.middle} path={this.props.route} />;
    let icon,
      content;
    let curClass = '';
		// var add = <li className="u-book-0"><Link className="add f-pr" to="/mall"><img src="/src/img/defaultCover.png"/><i className="iconfont icon-add f-pa"></i></Link></li>;
		// var addBook = this.state.setting? null:add;

		// 获取最近阅读的时间和
		// var recent = 0;
    const maxCurrentTime = 0;
    const readLogs = storage.get('readLogNew');
    let nav = null;

    const modelList = <ul className={`u-model-list ${this.state.showModelList ? 'active' : ''}`}><li onClick={this.settingClick} data-index={1}>管理书本</li><li onClick={this.settingClick} data-index={2}>排列方式</li><li onClick={this.settingClick} data-index={3}>封面/列表</li></ul>;

    if (!this.state.shelfList) {
      content = <Loading />;
    } else if (!this.state.shelfList.length) {
      content = <NoData type="emptyShelf" />;
    } else {
			// for (var n in readLogs) {
			// 	if (readLogs[n].current_time > maxCurrentTime) {
			// 		maxCurrentTime = readLogs[n].current_time;
			// 		recent = readLogs[n].content_id;
			// 	}
			// }
			// var recentIndex = -1;
			// this.state.shelfList.forEach(function(v, i) {
			// 	if (v.content_id == recent) {
			// 		recentIndex = i;
			// 		return false;
			// 	}
			// });

			// if (recentIndex > 0) {
			// 	this.state.shelfList.unshift(this.state.shelfList.splice(recentIndex, 1)[0]);
			// }
      content = (
        <div className="g-main shelf">
          <div className={`g-scroll g-scroll-noBG${(this.state.show_model == 0) ? ' aaa' : ' active'}`} ref="container" onScroll={this.scrollHandle}>
            <ul className="shelfWrap f-clearfix active">
              {

									this.state.shelfList.map((v, i) => {
  if (this.state.setting) {
    curClass = this.state.selected.indexOf(v.content_id) == -1 ? '' : 'z-active';
  }

  icon = this.state.setting ? this.state.icon : null;// (recent == v.content_id? this.state.icon:null);
  if (this.state.show_model == 0) {
    return (
      <li key={i} className={`u-book-2 ${curClass}`}>
        <a onClick={this.startReading.bind(this, v)}>
          <div className="pro-box f-oh" style={{ height: this.state.boxHeight }}>
            {icon}
            <Img src={v.image_url} />
            <div className="progress p-div">
              <div style={{ width: `${v.playorder / v.count * 100}%` }} />
            </div>
          </div>
          <span className="f-ellipsis-2">{v.name}</span>
        </a>
      </li>
    );
  } else {
    let per = Number((v.playorder / v.count).toFixed(2)),
      notice = '';
    per = per > 1 ? 1 : per;
    switch (per) {
      case 1:
        notice = '已读完';
        break;
      case 0:
        notice = '未读';
        break;
      default:
        notice = `${Math.round(per * 100)}%`;
    }
    return (<li key={i} className={`u-book-2 ${curClass}`}>
      <a onClick={this.startReading.bind(this, v)}>
        <div className="pro-box">
          {icon}
          <Img src={v.image_url} />
          <div className="intro-box">
            <span className="f-ellipsis title">{v.name}</span>
            <span className="f-ellipsis chapter">{v.chapter_name || v.author}</span>
            <div className="progress-box">
              <span>{notice}</span>
              <div className="progress p-div">
                <div style={{ width: `${v.playorder / v.count * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </a>
    </li>);
  }
})
								}
            </ul>
          </div>
        </div>
				);
    }


    const len = this.state.selected.length;

    switch (this.state.model) {
      case 1:
        nav = (<div className="s-b s-b-sec">
          <a className={len === 1 ? 'active' : ''} onClick={this.gotoReading}><span className="iconfont icon-gantanhao" /><span>详情</span></a>
          <a className={len ? 'active' : ''} onClick={this.gotoDownload}><span className="iconfont icon-download" /><span>下载</span></a>
          <a className={len ? 'active' : ''} onClick={this.delBtnClick}><span className="iconfont icon-shanchu" /><span>删除</span></a>
        </div>);
        break;
      case 2:
        nav = (<div className="s-b s-b-thi">
          <a className={this.state.order_model == 0 ? 'active' : ''} onClick={this.changeOrder} data-info={0}><span className={`iconfont icon-paixu ${this.state.recent_order == 0 ? 'seq' : 'rev'}`} /><span>最近</span></a>
          <a className={this.state.order_model == 1 ? 'active' : ''} onClick={this.changeOrder} data-info={1}><span className={`iconfont icon-paixu ${this.state.reading_order == 0 ? 'seq' : 'rev'}`} /><span>进度</span></a>
          <a className={this.state.order_model == 2 ? 'active' : ''} onClick={this.changeOrder} data-info={2}><span className={`iconfont icon-paixu ${this.state.book_order == 0 ? 'seq' : 'rev'}`} /><span>书名</span></a>
        </div>);
        break;
      case 3:
        nav = (<div className="s-b s-b-fir">
          <a className={this.state.show_model != 0 ? 'active' : ''} onClick={this.changeShow} data-cls={0}><span className="iconfont icon-zaixue" /><span>封面模式</span></a>
          <a className={this.state.show_model != 1 ? 'active' : ''} onClick={this.changeShow} data-cls={1}><span className="iconfont icon-mulu" /><span>列表模式</span></a>
        </div>);
        break;
      default:
        nav = null;
    }


    return (
      <div className="gg-wraper gg-body" >
        {header}
        {modelList}
        {content}
        {nav}
        {this.props.children}
      </div>
    );
  }
});

module.exports = Shelf;
