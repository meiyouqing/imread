import React from 'react';
import Link from 'react-router/lib/Link';
import GLOBAL from '../modules/global';

const Subject = React.createClass({
  getInitialState() {
    return { height: 0 };
  },
  componentDidMount() {
    const height = this.props.style == 12 ?
					((document.body.offsetWidth) / 2) * 0.38
					: (document.body.offsetWidth - 27) / 2;
    this.setState({ height });
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data ||
				this.state.height !== nextState.height;
  },
  render() {
    const cls = this.props.style == 12 ? 'u-book-8 u-book-8-small' : 'u-book-8';
    let hrefStr = GLOBAL.typeHref(this.props.data);
    if (typeof hrefStr === 'object') {
      hrefStr = hrefStr.url;
    }
    return (
      <li className={cls}>
        <Link to={hrefStr} className="u-lazyload-img" data-lazyload-src={this.props.data.image_url || this.props.data.intercut_url || this.props.data.big_coverlogo} style={{ backgroundColor: '#e3e3e3', height: this.state.height }}>
          <span>{this.props.data.name}</span>
        </Link>
      </li>
    );
  }
});

module.exports = Subject;
