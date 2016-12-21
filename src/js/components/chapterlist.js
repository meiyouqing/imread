import Loading from './loading';
import browserHistory from 'react-router/lib/browserHistory';
import React from 'react';
import storage from '../modules/storage';
const myEvent = require('../modules/myEvent');

const Chapterlist = React.createClass({
  getCurrentChapterId(bid) {
    let currentChapterId = 0;
    const readLog = storage.get('readLogNew')[bid];
    if (readLog) {
      currentChapterId = readLog.current_chapterid;
    }
    return currentChapterId;
  },
  getInitialState() {
    return {
      needUpdate: 0,
      currentChapterId: this.props.currentChapterId || this.getCurrentChapterId(this.props.bid)
    };
  },
  handleClick(e) {
    const cid = e.target.getAttribute('data-cid') || e.target.parentNode.getAttribute('data-cid');
		// var feeType = e.target.getAttribute('data-fee') || e.target.parentNode.getAttribute('data-fee');
    const targetUrl = `${this.props.hrefBase}/crossDomain.${[this.props.source_bid, cid, this.props.bid, this.props.source_id].join('.')}`;
		// if (this.props.fromReading) {
    const book = this.props.book ? this.props.book : {};
    const route = { pathname: targetUrl, state: { author: book.author, book_name: book.book_name } };
    if (this.props.fromReading)			{
      browserHistory.replace(route);
    } else			{
      browserHistory.push(route);
    }
		// } else {
		// 	window.location.href = targetUrl;
		// }
  },
  componentDidMount() {
    const surfix = this.props.fromReading ? '-fromReading' : '';
    myEvent.setCallback(`reading${this.props.bid}${surfix}`, () => {
      if (this.isMounted()) {
        this.setState({
          needUpdate: this.state.needUpdate + 1,
          currentChapterId: this.getCurrentChapterId(this.props.bid)
        });
      }
    });
  },
  shouldComponentUpdate(nextProps, nextState) {
		// console.log(this.props.chapterlist,nextProps.chapterlist )
    return this.props.chapterlist !== nextProps.chapterlist
				|| this.props.store !== nextProps.store
				|| this.props.loading !== nextProps.loading
				|| this.props.currentChapterId !== nextProps.currentChapterId
				|| this.state.needUpdate !== nextState.needUpdate
				|| this.props.isBuyAll !== nextProps.isBuyAll
				|| this.props.order !== nextProps.order;
  },
  render() {
    let loading,
      content;

    const store = this.props.store ? this.props.store : [];

    if (!this.props.chapterlist) {
      loading = <i className="u-sLoading">目录努力加载中...</i>;
    } else {
      const sloading = this.props.loading ? ' f-hide' : '';
      content = (
        <ul className="chapterlist">
          {
					this.props.chapterlist.map((chapter, i) => {
  let lock;
						// console.log(this.props.store,chapter.cid)
  const currentChapterId = this.props.currentChapterId || this.state.currentChapterId;
  if (chapter.feeType != '0' && (store.indexOf(chapter.cid) < 0) && !this.props.isBuyAll) {
    lock = <span className="iconfont icon-suo lock f-fr" />;
  }
  return (
    <li key={i} className={`chapter f-clearfix${chapter.cid == currentChapterId ? ' current' : ''}`} onClick={this.handleClick} data-cid={chapter.cid} data-fee={chapter.feeType}>
      {lock}
      <span className={`name f-ellipsis${lock ? ' lock' : ''}`}>{chapter.chapterName}</span>
    </li>
  );
})
				}
          {/* <li className={"u-sLoading" + sloading }>努力加载中...</li>*/}
          <Loading cls={`u-sLoading${sloading}`} />
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

module.exports = Chapterlist;
