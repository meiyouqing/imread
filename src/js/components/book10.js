import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';

const Book10 = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data
		|| this.props.icon !== nextProps.icon;
  },
  clickHandle() {
    if (this.props.icon)	return;
    const hrefStr = `${location.pathname.replace(/\/sheet([^"]*)/, '')}/sheet/bookSheet.${this.props.data.sheet_id || this.props.data.content_id}`;
    browserHistory.push(hrefStr);
  },
  render() {
    return (
      <li className="u-book-10">
        <a onClick={this.clickHandle}>
          <img src="/src/img/icon88/e3e3e3.gif" data-lazyload-src={this.props.data.image_url} className="u-lazyload-img" />
          <div className="f-b-block">
            <span className="book-name f-ellipsis">{this.props.data.name || this.props.data.sheet_name}</span>
            <div className="f-fr last">
              <span className="iconfont icon-2273" />
              <span >{`${this.props.data.count || this.props.data.content_cnt}本`}</span>
            </div>

            <div className="f-fr">
              <span className="iconfont icon-heart" />
              <span>{this.props.data.collect_uv || 0}</span>
            </div>
          </div>
        </a>
        {this.props.icon ? <span className="delete" onClick={this.props.deleteWay} data-bid={this.props.data.sheet_id}>删除</span> : null}
      </li>
    );
  }
});

module.exports = Book10;
