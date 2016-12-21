import NoData from './noData';
import Loading from './loading';
import storage from '../modules/storage';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import React from 'react';
const Header = require('./header');
const Book1 = require('./book1');

const Purchased = React.createClass({
  mixins: [mixins()],
  scrollPagesNo: 1,
  getInitialState() {
    return {
      list: null,
      scrollUpdate: false,
      noMore: false
    };
  },
  componentDidMount() {
    if (this.checkLogin(this.props.route)) {
      if (GLOBAL.isRouter(this.props)) this.getList();
      this.lazyloadImage(this.refs.container);
    }
  },
  getList(scrollUpdate) {
    if (this.isLogin()) {
      const that = this;
      const AJAX = new Ajax(`${this.props.route.path}.${this.scrollPagesNo}`);
      AJAX.get((data) => {
        if (!data.content) return;
        if (data.content.length < AJAX.param.contents) {
          that.setState({
            noMore: true,
            scrollUpdate: false
          });
        }
        if (that.state.list) {
          data.content = that.state.list.concat(data.content);
        }
        that.setState({
          list: data.content
        });
      });
    } else {
      const readLog = storage.get('readLogNew');
      const list = [];
      for (const n in readLog) {
        list.push(readLog[n]);
      }
      list.sort((a, b) => a.recent_time < b.recent_time ? 1 : -1);
      this.setState({
        list,
        noMore: true
      });
    }
  },
  componentDidUpdate() {
    if (GLOBAL.isRouter(this.props)) {
      if (!this.state.list) this.getList();
      this.lazyloadImage(this.refs.container);
      this.disPatch('scroll', this.refs.container);
    }
  },
  shouldComponentUpdate(nextProp, nextState) {
    return this.state.list !== nextState.list
				|| this.props.children !== nextProp.children;
  },
  render() {
    let content;
    if (!this.state.list) {
      content = <Loading />;
    } else if (this.state.list.length) {
      content = (
        <ul className="content">
          {
					this.state.list.map((book, i) => <Book1 data={book} key={i} />)
				}
        </ul>
			);
    } else {
      content = <NoData type="emptyPur" />;
    }
    return (
      <div className="gg-body">
        <div className="recentRead-block">
          <Header right={false} title={'已购书籍'} path={this.props.route} />
          <div className="g-main g-main-1">
            <div className="g-scroll m-block purchase" ref="container" onScroll={this.scrollHandle}>
              {content}
            </div>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Purchased;
