import myEvent from '../modules/myEvent';
import browserHistory from 'react-router/lib/browserHistory';
import Link from 'react-router/lib/Link';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import React from 'react';

const NoData = React.createClass({
  mixins: [mixins()],
  reload() {
    document.location.reload();
  },
  setTag() {
    if (this.isLogin()) {
      this.gotoTag();
    } else {
      this.goLogin(() => {
        this.gotoTag();
      });
    }
  },
  gotoTag() {
    myEvent.setCallback('updateGuess', this.props.updateGuess);
    browserHistory.push(GLOBAL.setHref('myTags'));
  },
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  },

  render() {
    let src = '/src/img/pic1@2x.png',
      text = '抱歉!没有找到相关数据..',
      btn = <Link className="u-btn" to="/mall">去书城逛逛</Link>;
    switch (this.props.type) {
      case 'emptyShelf':
        text = '亲，书架还空空荡荡哦';
        break;
      case 'UFO':
        src = '/src/img/no@2x.png';
        text = '网络遇到问题,请重试';
        btn = <a className="u-btn" onClick={this.reload}>重新加载</a>;
        break;
      case 'recentRead':
        text = '暂无阅读记录';
        break;
      case 'emptyTag':
        text = '你还没有设置标签哦';
        btn = <a className="u-btn" onClick={this.setTag}>去设置标签</a>;
        break;
      case 'emptyPur':
        text = '您还没有购买任何书本哦';
        break;
      case 'emptyBookstore':
        text = '您还没有收藏任何书单哦';
        btn = <Link className="u-btn" to={GLOBAL.setHref('top/block.1')}>去发现书单</Link>;
        break;
      case 'emptySearch':
        text = '抱歉，查无此书';
        break;
    }
    return (
      <div className="f-vl-md">
        <div className="m-noData f-tc">
          <img className="icon" src={src} />
          <i className="tip">{text}</i>
          {btn}
        </div>
      </div>
    );
  }
});

module.exports = NoData;
