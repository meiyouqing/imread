import React from 'react';
import Link from 'react-router/lib/Link';

export default React.createClass({
  render() {
    return <Link {...this.props} activeClassName="z-active" />;
  }
});
