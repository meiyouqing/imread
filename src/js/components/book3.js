import React from 'react';
import Link from 'react-router/lib/Link';
import GLOBAL from '../modules/global';

const Book3 = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data;
  },
  render() {
		// console.log(this.props.data)
    const hrefStr = GLOBAL.typeHref(this.props.data);
    return (
      <li className="u-book-3">
        <Link to={hrefStr}>
          <div>
            <span className="title">{this.props.data.name}</span>
            <span className="author">{this.props.data.author}</span>
            <span className="bookState">{`/${this.props.data.status == '0' ? '连载' : '完本'}`}</span>
          </div>
          <div className="summary f-ellipsis-2">{GLOBAL.htmlContent(this.props.data.brief)}</div>
        </Link>
      </li>
    );
  }
});

module.exports = Book3;
