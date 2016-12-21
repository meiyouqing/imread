import React from 'react';

if (typeof window !== 'undefined') {
  require('../../css/iconfont.css');
  require('../../css/imread.css');
}

export default React.createClass({
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});
