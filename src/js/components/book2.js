import React from 'react';
import Link from 'react-router/lib/Link';
import GLOBAL from '../modules/global';
import Img from './img';

const Book2 = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data;
  },
  componentDidMount() {

  },
  render() {
    const hrefStr = GLOBAL.typeHref(this.props.data);
    return (
      <li className="u-book-2">
        <Link to={hrefStr}>
          <div className="u-imgWrap-133">
            <Img src={this.props.data.image_url} />
          </div>
          <span className="f-ellipsis-2">{this.props.data.name}</span>
          <span className="f-ellipsis author">{this.props.data.author}</span>
        </Link>
      </li>
    );
  }
});

module.exports = Book2;
