import React from 'react';
const Header = require('./header');
if (typeof window !== 'undefined') {
  require('../../css/login.css');
}

const Login = React.createClass({

  render() {
    return (
      <div className="gg-body">
        <Header right={null} path={this.props.route} title="微信登录" />
        <div className="g-main g-main-1">
          <div className="g-scroll">
            <img style={{ width: '100%', display: 'block' }} src="/src/img/weixin_guide.png" />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Login;
