import myEvent from '../modules/myEvent';
import NoData from './noData';
import Loading from './loading';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import React from 'react';
import Img from './img';
import Book10 from './book10';
import Header from './header';

const StoreList = React.createClass({
  mixins: [mixins()],
  pageSize: 100,
  getInitialState() {
    return {
      noMore: false,
      scrollUpdate: false,
      onerror: false,
      list: null,
      icon: false,
      right: null,
      left: <a className="f-fl iconfont icon-left" onClick={this.goBack} />
    };
  },
  getList(bool) {
    if (!this.isMounted()) return;
    if (this.state.noMore === true && !bool) return;
    const AJAX = new Ajax(`bookstore.1.${this.pageSize}`);
    AJAX.get((data) => {
      let list;
      if (!data || (data.success.length < this.pageSize)) {
        this.setState({
          noMore: true
        });
      }

      if (bool)				{
        list = data.success;
      } else				{ list = this.state.scrollUpdate ? this.state.list.concat(data.success) : data.success; }
      this.setState({
        list,
        right: list.length ? <a className="f-fr iconfont icon-shezhi-1" onClick={this.troggle} /> : null,
        scrollUpdate: false
      });
    }, this.onerror);
  },
  goBack() {
    this.goBackUrl(this.props.route);
    	},
  troggle() {
    if (!this.isMounted()) return;
    const right = <button className="f-fr textBtn" onClick={this.compClick} > 完成 </button>;
    this.setState({
      right,
      icon: true,
      left: null
    });
    	},
  compClick() {
    if (!this.isMounted()) return;
    const right = <a className="f-fr iconfont icon-shezhi-1" onClick={this.troggle} />;
    this.setState({
      right,
      icon: false,
      left: <a className="f-fl iconfont icon-left" onClick={this.goBack} />
    });
  },
  deleteSheet(e) {
 		if (!this.isMounted()) return;
   		const bid = e.target.getAttribute('data-bid');
        	if (!bid) { return; }
        	const that = this;
	      const ui_callback = function () {
	            for (let i = 0; i < that.state.list.length; i++) {
	                if (that.state.list[i].sheet_id == bid) {
	                    that.state.list.splice(i, 1);
	                    that.setState({
	                        list: that.state.list
	                    });
	                    break;
	                }
	            }
	            if (that.state.list.length == 0) {
	            	that.initData(true);
		    	    that.setState({
		            	left: <a className="f-fl iconfont icon-left" onClick={that.goBack} />
		        	});
	            }
	      };
    const AJAX = new Ajax('collectionDelete');
	      AJAX.go({
	           sheet_id: bid
	      }, ui_callback);
    	},
  scrollData(e) {
    const AJAX = new Ajax('bookstore');
    this.scrollHandle(e);
  },
  initData(bool) {
    this.getList(bool);
  },
  componentDidMount() {
    if (this.checkLogin(this.props.route)) {
      const AJAX = new Ajax(`bookstore.1.${this.pageSize}`);
      if (GLOBAL.isRouter(this.props))	this.getList();
      myEvent.setCallback('updateTopList', this.getList);
    }
  },
  componentDidUpdate(nextProp) {
    if (GLOBAL.isRouter(this.props) && !this.state.list)	{
      this.initData(false);
    }

    if (GLOBAL.isRouter(this.props) && this.props.children !== nextProp.children) {
      this.initData(true);
      this.setState({ noMore: false });
      this.compClick();
    }
    if (this.refs.container)			{ this.lazyloadImage(this.refs.container, true); }
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.list !== nextProps.list
		|| this.props.children !== nextProps.children;
  },
  render() {
    let sLoading = <Loading cls="u-sLoading transparent" />,
      list = null;

    if (this.state.noMore) {
      sLoading = null;
    }

    if (!this.state.list) {
      if (GLOBAL.isRouter(this.props)) {
        list = <Loading />;
      }
    } else if (this.state.list.length) {
      list = (<div className="g-main g-main-1">
        <section className="m-block  g-scroll" onScroll={this.scrollData} ref="container">
          <div className="content">
            <ul className="f-clearfix">
              {
									this.state.list.map((v, i) => <Book10 key={i} data={v} icon={this.state.icon} deleteWay={this.deleteSheet} />)
								}
            </ul>
            {sLoading}
          </div>
        </section>
      </div>);
    } else				{
      list = (<div className="g-main"><NoData type="emptyBookstore" /></div>);
    }

    if (this.state.onerror) {
      list = (<div className="g-main"><NoData type="UFO" /></div>);
    }


    return (
      <div className="gg-body">
        <Header title="书单收藏" left={this.state.left} right={this.state.right} path={this.props.route} />
        {list}
        {this.props.children}
      </div>
    );
  }
});

module.exports = StoreList;
