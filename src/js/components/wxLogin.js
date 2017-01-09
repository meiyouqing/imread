import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import parseQuery from '../modules/parseQuery';
import Ajax from '../modules/ajax';
import mixins from '../modules/mixins';
import storage from '../modules/storage';

var POP;
if (typeof window !== 'undefined') {
  POP = require('../modules/confirm');
}

const WxLogin = React.createClass({
  mixins: [mixins()],
  componentDidMount() {
    const that = this;
    this.from = parseQuery(location.search);

    if (!this.from.code) {
      POP._alert(`${this.from.code} 登录失败`);
      browserHistory.replace('/');
      return;
    }
    if (this.isWx() && this.from && this.from.code && this.from.state == '123') {
      const AJAX = new Ajax('login_wx');
      AJAX.go({
        code: this.from.code,
        grant_type: 'authorization_code'
      }, (res) => {
        that.do_result(res);
      }, () => { window.history.go(-1); });
    }
  },
  do_result(data) {
    if (+data.code === 200) {
      storage.set('userToken', 'loaded');
      if (this.from.callback) {
        window.location = decodeURIComponent(this.from.callback);
      } else {
        browserHistory.replace('/');
      }
    } else {
      POP._alert('登录失败');
    }
  },
  render() {
    return <p className="WxLogin">正在微信登录...</p>;
  }
});
module.exports = WxLogin;
