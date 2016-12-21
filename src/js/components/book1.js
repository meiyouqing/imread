import GLOBAL from '../modules/global';
import React from 'react';
import Link from 'react-router/lib/Link';
const Img = require('./img');

const Book1 = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data;
  },
  render() {
    let hrefStr;
    const path = typeof window === 'undefined' ? global.pathname : location.pathname;

    const cludeIntro = path.match(/\/book\/introduce./);
    if (cludeIntro) {
      hrefStr = path.split(cludeIntro)[0] + cludeIntro + this.props.data.content_id;
    } else			{
      hrefStr = GLOBAL.typeHref(this.props.data);
    }

    return (

      <li className="u-book-1 f-clearfix">
        <Link to={hrefStr} >
          <Img src={this.props.data.image_url} />
          <div className="info">
            <span className="f-ellipsis-2 title">{this.props.data.name || this.props.data.book_name}</span>
            <span className="author">{this.props.data.author || this.props.data.author_name}</span>
            <span className="summary f-ellipsis-3" dangerouslySetInnerHTML={{ __html: this.props.data.brief }} />
          </div>
        </Link>
      </li>
    );
  }
});

module.exports = Book1;
