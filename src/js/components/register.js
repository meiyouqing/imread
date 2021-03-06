import React from 'react';
import GLOBAL from '../modules/global';
import Ajax from '../modules/ajax';
import storage from '../modules/storage';
import Header from './header';

if (typeof window !== 'undefined') {
  var POP = require('../modules/confirm');
}

const Register = React.createClass({
  getInitialState() {
    return {
      s: 0
    };
  },
  shouldComponentUpdate(nextPros, nextState) {
    return nextState.s != this.state.s;
  },
  handleSubmit() {
    const that = this;
    if (that.loading) { return; }
    const postData = {
      mobile_num: this.refs.mobile_num.value,
      key: this.refs.key.value,
      password: this.refs.password.value,
      device_identifier: GLOBAL.getUuid(),
      channel: 5,
      promot: 'H5'
    };
    if (!GLOBAL.assertNotEmpty(postData.mobile_num, '请输入手机号')) { return; }
    if (!GLOBAL.assertMatchRegExp(postData.mobile_num, /^1\d{10}$/, '请输入正确的手机号')) { return; }
    if (!GLOBAL.assertNotEmpty(postData.key, '请输入验证码')) { return; }
    if (!GLOBAL.assertNotEmpty(postData.password, '请输入密码')) { return; }
    if (postData.password.trim().length < 6) {
      POP._alert('密码不能少于6位');
      return;
    }

    that.loading = true;
    new Ajax().getJSON('POST', '/api/v1/auth/reset/password', postData, (data) => {
      that.loading = false;
			// var options = {
			// 	expires: 1000
			// };
			// GLOBAL.cookie('userPhone', postData.mobile_num,options);
      storage.set('userToken', data.token);
      GLOBAL.setUser({
        phone: postData.mobile_num,
        token: postData.token
      });

			// 判断登陆后的跳转
      if (data.code == 200) {
        POP._alert('修改成功');
				// 判断登陆后的跳转
        GLOBAL.goBack();
      } else if (typeof data.error === 'string')					{ POP._alert(data.error); } else {
        for (const key in data.error[0]) {
          POP._alert(data.error[0][key]);
        }
      }
    }, (res) => {
      that.loading = false;
      GLOBAL.defaultOnError(res);
    });
  },
  getCode() {
    if (this.state.s) { return; }
    const mobile_num = this.refs.mobile_num.value;
    if (!GLOBAL.assertNotEmpty(mobile_num, '请输入手机号')) { return; }
    if (!GLOBAL.assertMatchRegExp(mobile_num, /^1\d{10}$/, '请输入正确的手机号')) { return; }

    let inter;
    clearInterval(inter);
    new Ajax().getJSON('GET', '/api/auth/key?', {
      phone: mobile_num,
      type: 'reset'
    }, (data) => {
      if (data.code == 200) {
        POP._alert('发送成功');

        this.setState({
          s: 60
        });

        inter = setInterval(() => {
          if (this.state.s > 0 && this.isMounted()) {
            this.setState({
              s: this.state.s - 1
            });
          } else {
            clearInterval(inter);
          }
        }, 1000);
      } else if (typeof data.error === 'string')					{
        POP._alert(data.error);
      } else {
        for (const key in data.error[0]) {
          POP._alert(data.error[0][key]);
        }
      }
    }, (res) => {
      this.setState({
        s: 0
      });
      GLOBAL.defaultOnError(res);
    });
  },
  render() {
    return (
      <div className="g-ggWraper  gg-body">
        <Header right={null} title={'忘记密码'} path={this.props.route} />
        <div className="g-main">
          <div className="u-userform m-modify m-forget">
            <div className="u-inputline-2">
              <input className="u-input-2 phone" type="tel" ref="mobile_num" placeholder="手机号" />
              <div className="f-fr">
                <a className={`u-ymz u-n-bg ${this.state.s ? ' u-btn-disabled' : ''}`} type="button" onClick={this.getCode}>{(this.state.s && (`重新获取(${this.state.s})`)) || '获取验证码'}</a>
              </div>
            </div>
            <div className="u-inputline-2">
              <input className="u-input-2" type="tel" ref="key" placeholder="验证码" />
            </div>
            <div className="u-inputline-2">
              <input className="u-input-2" type="password" ref="password" placeholder="新密码" />
            </div>

            <div className="u-inputline m-25">
              <a className="u-btn u-btn-full" onClick={this.handleSubmit}>完成</a>
            </div>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Register;
