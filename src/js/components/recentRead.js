import React from 'react';
import storage from '../modules/storage';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import Loading from './loading';
import Header from './header';
import Book9 from './book9_recentRead';
import NoData from './noData';

if (typeof window !== 'undefined') {
  require('../../css/recentRead.css');
}
// if (typeof window !== 'undefined') {
//   const POP = require('../modules/confirm');
// }

const recentRead = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    return {
      list: null,
      scrollUpdate: false,
      noMore: false,
      icon: null,
      right: null,
      left: <a className="f-fl iconfont icon-left" onClick={this.goBack} />
    };
  },
  goBack() {
    this.goBackUrl(this.props.route);
  },
  troggle() {
    const right = <button className="f-fr textBtn" onClick={this.compClick} > 完成 </button>;
    this.setState({
      right,
      icon: true,
      left: null
    });
  },
  compClick() {
    	const right = <a className="f-fr iconfont icon-shezhi-1" onClick={this.troggle} />;
    	this.setState({
      right,
      icon: false,
      left: <a className="f-fl iconfont icon-left" onClick={this.goBack} />
    });
  },
  componentDidMount() {
    this.getList();
    this.lazyloadImage(this.refs.container);
  },
  getList(scrollUpdate) {
    const readLog = storage.get('readLogNew');
    const list = [];
    for (const n in readLog) {
      list.push(readLog[n]);
    }
    list.sort((a, b) => (a.recent_time < b.recent_time ? 1 : -1));
    this.setState({
      list,
      right: list.length ? <a className="f-fr iconfont icon-shezhi-1" onClick={this.troggle} /> : null,
      noMore: true
    });
  },
  componentDidUpdate() {
    this.lazyloadImage(this.refs.container);
  },
  deleteBook(e) {
    const bid = e.target.getAttribute('data-bid');
    if (!bid) { return; }
    const that = this;
    const ui_callback = function () {
      for (let i = 0; i < that.state.list.length; i++) {
        if (that.state.list[i].content_id == bid) {
          that.state.list.splice(i, 1);
          that.setState({
            list: that.state.list
          });
          break;
        }
      }
      if (!that.state.list.length) {
        that.setState({
          right: null,
          left: <a className="f-fl iconfont icon-left" onClick={that.goBack} />
        });
        return;
      }
    };

    const readLog = storage.get('readLogNew');
    for (const content_id in readLog) {
      if (content_id == bid) {
        delete readLog[content_id];
      }
    }
    storage.set('readLogNew', readLog);
    ui_callback();
  },
  render() {
    let content;

    if (!this.state.list) {
      if (GLOBAL.isRouter(this.props)) {
        content = <Loading />;
      }
    } else if (this.state.list.length) {
      content = (<ul> {
            this.state.list.map((book, i) => <Book9
              book={book}
              key={i}
              icon={this.state.icon}
              deleteWay={this.deleteBook}
            />)
        } </ul>);
    } else {
      content = <NoData type="recentRead" />;
    }


    return (<div className="gg-body" >
      <div className="recentRead-block" >
        <Header right={this.state.right} left={this.state.left} title={'最近阅读'} path={this.props.route} />
        <div className="g-main g-main-1" >
          <div className="g-scroll" ref="container" onScroll={this.scrollHandle} > { content } </div>
        </div>
      </div>
      { this.props.children }
    </div>
    );
  }
});

module.exports = recentRead;
