import parseQuery from '../modules/parseQuery';
import Loading from './loading';
import NoData from './noData';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import React from 'react';
const Header = require('./header');
// var Block7 = require('./block7');
const Book1 = require('./book1');
if (typeof window !== 'undefined') {
  require('../../css/bookSheet.css');
}

const BookSheet = React.createClass({
	 mixins: [mixins()],
	 scrollPagesNo: 1,
  getList() {
    const AJAX = new Ajax(`${this.props.params.sheetId}.-.${this.scrollPagesNo}`);
    AJAX.get(this.ajaxHandle, (error) => {
      if (this.state.scrollUpdate) {
        this.setState({
          scrollUpdate: false,
          noMore: true
        });
        return;
      }
      this.setState({
        UFO: true
      });
			// console.log(error);
    });
  },
  ajaxHandle(data) {
    GLOBAL.title = data.sheet_name;
    if (!data.content) { return; }
    if (!data.content.length) {
      this.setState({
        noMore: true
      });
      return;
    }
    if (this.state.scrollUpdate) {
      data.content = this.state.data.content.concat(data.content);
    }
    this.setState({
      data,
      collected: +data.collection,
      scrollUpdate: false
    });
		// 设置GLOBAL book name
  },
  addFavaHandle() {
    const that = this;
    if (!this.isLogin()) {
      this.goLogin(goadd);
      return;
    }
    goadd();
    function goadd() {
      if (!that.state.collected) {
        goAjax('collectionAdd');
      } else {
        goAjax('collectionDelete');
      }
    }
    function goAjax(which) {
      const AJAX = new Ajax(which);
      AJAX.go({ sheet_id: that.state.data.sheet_id }, () => {
        that.setState({
          collected: which === 'collectionAdd'
        });
      });
    }
  },
  getInitialState() {
    return {
      noMore: false,
      data: null,
      collected: false,
      scrollUpdate: false,
      UFO: false
    };
  },
  componentWillMount() {
    this.usePreload(this.props.params.sheetId);
  },
  componentDidMount() {
    const obj = parseQuery(location.search);
	      if (obj.action && obj.action == 'openapp') {
	      	const p = `detail/${encodeURI(`[{"detail":[{"sheetid":"${obj.sheet_id}","type":"10"}],"pushcmd":"10"}]`)}`;
        window.location.href = `imread://${p}`;
	      }
    if (GLOBAL.isRouter(this.props)) {
      if (!this.state.data) {
        this.getList();
      } else {
        this.lazyloadImage(this.refs.container);
      }
    }
  },
  componentDidUpdate() {
    GLOBAL.isAd();
    if (GLOBAL.isRouter(this.props) && !this.state.data)	this.getList();
    this.lazyloadImage(this.refs.container);
    if (!this.isLogin()) {
      this.setState({ collected: false });
    }
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.data !== nextState.data
					|| this.state.collected !== nextState.collected
					|| this.state.scrollUpdate !== nextState.scrollUpdate
					|| this.state.UFO !== nextState.UFO
					|| this.state.noMore !== nextState.noMore
					|| this.props.children !== nextProps.children;
  },
  render() {
    let noData,
      content,
      sLoading;
	// 定义content
	// console.log(this.state.noMore,this.state.scrollUpdate)
    if (!this.state.data) {
      if (GLOBAL.isRouter(this.props))				{
        content = <Loading />;
      }
    } else {
			// var m_time = this.state.data.modify_time.substr(0,4)+'.'+this.state.data.modify_time.substr(4,2)+'.'+this.state.data.modify_time.substr(6,2);
      if (!this.state.data.content.length) {
        noData = (<div className="g-main g-main-1"><NoData /></div>);
        content = null;
      } else {
        sLoading = this.state.noMore ? null : (<Loading cls="u-sLoading" />);
        content = (
          <div>
            <section className="m-block m-sheet">
              <div className="content">
                <div className="m-sheet-header">
                  <div className="iconfont icon-tag u-sheet-c"><p>{this.state.data.content_cnt}</p><p>本</p></div>
                  <img src={this.state.data.image_url} />
                  <div className="m-b-footer">
                    <span className="iconfont icon-heart i-s-m" />
                    <span className="u-sc">{this.state.data.collect_uv || 0}</span>
                    <span className="u-sc">{GLOBAL.prettyDate(this.state.data.modify_time)}</span>
                  </div>
                  <div className="u-m-store" onClick={this.addFavaHandle} >
                    <span className={`iconfont ${this.state.collected ? 'active icon-heart' : 'icon-xin'}`} />
                  </div>
                </div>
                <div className="u-sheet-detail">
                  <h2>{this.state.data.sheet_name}</h2>
                  <div className="brief">{this.state.data.sheet_brief}</div>
                </div>
              </div>
            </section>
            <div className="m-device" />
            <section className="m-block m-sheet-s">
              <div className="content">
                <ul className="bsList">
                  {
										this.state.data.content.map((v, i) => <Book1 key={i} data={v} />)
									}
                </ul>
              </div>
              {sLoading}
            </section>
          </div>
				);
      }
    }
    if (this.state.UFO) {
      noData = (<div className="g-main g-main-1"><NoData type="UFO" /></div>);
      content = null;
    }
    return (
      <div className="gg-body">
        <Header path={this.props.route} title={'书单详情'} />
        <div className="g-main g-main-1">
          <div className="g-scroll" ref="container" onScroll={this.scrollHandle}>
            {content}
          </div>
        </div>
        {noData}
        {this.props.children}
      </div>
    );
  }
});

module.exports = BookSheet;
