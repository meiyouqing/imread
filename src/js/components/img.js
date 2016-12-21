import React from 'react';
const Img = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.src !== nextProps.src;
  },
  render() {
    const src = this.props.src.replace(/^http\:\/\//, 'https://');
		// sdk no need for lazyload
    if (typeof window === 'undefined' && /sdk\/sdk\.\d+/.test(global.pathname)) {
      return <img src={src} />;
    }
    return <img src="/src/img/back/book_default_back.png" data-lazyload-src={src} className="u-lazyload-img" />;
  }
});

module.exports = Img;
