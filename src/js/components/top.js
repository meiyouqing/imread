import myEvent from '../modules/myEvent';
import NoData from './noData';
import Loading from './loading';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import React from 'react';
const Blocklist = require('./blocklist');
const Header = require('./header');
const BookStore = require('./bookStore');
import MallNavLink from './mallNavLink';
if (typeof window !== 'undefined') {
  const POP = require('../modules/confirm');
}

const MallNav = React.createClass({
  render() {
    if (!this.props.navList || !this.props.navList.length) { return <i />; }
    return (
      <nav className="g-nav">
        <div className="m-nav f-flexbox" >
          {
						this.props.navList.map((v, i) => {
  const path = typeof window === 'undefined' ?
										global.pathname :
										location.pathname;
  const hrefStr = path.replace(/top\/block\.\d/, `top/block.${i}`);
  return (
    <MallNavLink to={hrefStr} key={i} className="f-flex1">{v.name}</MallNavLink>
  );
})
					}
        </div>
      </nav>
    );
  }
});

const Top = React.createClass({
  mixins: [mixins()],
  pid: 0,
  getInitialState() {
    return {
      noMore: false,
      scrollUpdate: false,
      onerror: false,
      list: null
    };
  },
  getData() {
    const AJAX = new Ajax('group.6');
    AJAX.get((data) => {
      this.params = `page.${data.pagelist[0].pgid}.${data.pagelist[0].blocks}.1`;
			// POP._alert(this.params)
      this.getLists();
    }, this.onerror);
  },
  getLists() {
    const AJAX = new Ajax(this.params);
    AJAX.get(this.ajaxHandle, this.onerror);
  },
  ajaxHandle(data) {
    if (!data.blocklist) { return; }
    if (!data.blocklist.length) {
      this.setState({
        noMore: true
      });
    }
    this.setState({
      list: this.state.scrollUpdate ? this.state.list.concat(data.blocklist) : data.blocklist,
      scrollUpdate: false
    });
		// 设置GLOBAL.booklist/book
    GLOBAL.setBlocklist(data.blocklist);
  },
  componentWillMount() {
    if (!GLOBAL.isRouter(this.props)) return;
    const topnav = typeof window === 'undefined' ?
						global.imdata.topNav :
						window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.topNav;
    if (!topnav) return;
    const n = `page.${topnav.pagelist[0].pgid}.${topnav.pagelist[0].blocks}.1`;
    this.usePreload(n);
  },
  componentDidMount() {
    if (GLOBAL.isRouter(this.props) && !this.state.list)	{
      this.getData();
    } else {
      this.lazyloadImage(this.refs.container);
    }
		// myEvent.setCallback('updateTopList',this.getData);
  },
  componentDidUpdate(nextProp) {
    if (GLOBAL.isRouter(this.props) && !this.state.list) this.getData();
    if (!this.state.list || !this.state.list.length) { return; }
    this.lazyloadImage(this.refs.container);
  },
  shouldComponentUpdate(nextProp, nextState) {
    return this.state.noMore !== nextState.noMore
				|| this.state.list !== nextState.list
				|| this.props.children !== nextProp.children
				|| this.props.params.topId !== nextProp.params.topId;
  },
  render() {
    this.pid = this.props.params.topId.split('.').pop();

    let list,
      arr = [];
    if (!this.state.list) {
      if (GLOBAL.isRouter(this.props)) { list = <Loading />; }
    } else if (this.state.list.length) {
      list = (
        <div className="g-main g-main-3 m-top">
          <div ref="container">
            <BookStore dom={this.refs.container} data={this.state.list} order={this.pid} />
          </div>
        </div>
					);
    } else {
      list = (<div className="g-main"><NoData /></div>);
    }
    if (this.state.onerror) {
      list = (<div className="g-main"><NoData type="UFO" /></div>);
    }

    return (
      <div className="gg-body">
        <Header title="发现" path={this.props.route} />
        <MallNav navList={this.state.list} />
        {list}
        {this.props.children}
      </div>
    );
  }
});
module.exports = Top;
