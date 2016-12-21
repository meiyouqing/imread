import GLOBAL from '../modules/global';
import React from 'react';
import Link from 'react-router/lib/Link';
const Img = require('./img');

const Book6 = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data;
  },
  render() {
    const hrefStr = GLOBAL.typeHref(this.props.data);
    if (!this.props.noImage) {
      var img = <Img src={this.props.data.big_coverlogo || this.props.data.small_coverlogo || this.props.data.image_url} />;
    }
    return (
      <li className="u-book-6">
        <Link to={hrefStr}>
          {img}
          <div className="infos f-clearfix">
            <span className="f-ellipsis name f-fl">{this.props.data.name }</span>
            <span className="count f-fr">{this.props.data.count ? `${this.props.data.count}本` : ''}</span>
          </div>
        </Link>
      </li>
    );
  }
});

module.exports = Book6;
