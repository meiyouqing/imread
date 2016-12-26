import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import Link from 'react-router/lib/Link';
import Loading from './loading';
import parseQuery from '../modules/parseQuery';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import storage from '../modules/storage';
import myEvent from '../modules/myEvent';

if (typeof window !== 'undefined') {
  var POP = require('../modules/confirm');
}
if (typeof window !== 'undefined') {
  require('../../css/login.css');
}

const Login = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    return {
      status: true,
      s: 0,
      QQ_loading: false,
      WX_loading: false
    };
  },
  handleSubmit(e) {
    e.preventDefault();
    const that = this;
    if (that.loading) { return; }
    const postData = {
      phone: this.refs.mobile_num.value,
      password: this.refs.password.value// ,
    };
    const vcode = this.refs.key.value;
    if (!GLOBAL.assertNotEmpty(postData.phone, '请输入手机号')) { return; }
    if (!GLOBAL.assertMatchRegExp(postData.phone, /^1\d{10}$/, '请输入正确的手机号')) { return; }
    if (!GLOBAL.assertNotEmpty(postData.password, '请输入密码')) { return; }
    if (!GLOBAL.assertNotEmpty(vcode, '请输入验证码')) { return; }
    that.loading = true;
 		this.checkVcode(() => {
   const AJAX = new Ajax('login');
   AJAX.go(postData, (data) => {
     that.loading = false;
				// var options = {
				// 	expires: 1000
				// };
     that.loading = false;

     GLOBAL.setUser({
       phone: postData.phone,
       token: postData.token
     });
     if (data.code == 200) {
       if (!storage.set('userToken', data.token)) {
         POP.alert('无法正常登录！您可能已开启无痕浏览。如需继续登录，请关闭无痕浏览模式！');
         return;
       }
       that.disPatch('updateUser');
       that.disPatch('updateMall');
       GLOBAL.header.userId = data.userInfo.user_id;
					// 判断登陆后的跳转
       if (that.from && that.from.skipurl) {
         window.location.href = `${that.from.skipurl.replace(/\?devicetoken([^"]*)/, '')}?devicetoken=${data.userInfo.uuid || GLOBAL.getUuid()}`;
       } else {
         GLOBAL.goBack(location.pathname.replace(/\/login$/, ''));
         setTimeout(() => { myEvent.execCallback('login'); }, 10);
       }
     } else if (typeof data.error === 'string')						{
       POP._alert(data.error);
     } else						{
       for (const key in data.error[0]) {
         POP._alert(data.error[0][key]);
       }
     }
   }, (res) => {
     that.loading = false;
     GLOBAL.defaultOnError(res);
   });
   return false;
 		});
  },
  checkVcode(callback) {
    if (!this.refs.key.value) return;
    new Ajax().getJSON('GET', 'https://i.imread.com/vcode/verify', { vcode: this.refs.key.value }, (data) => {
      if (data.code !== 200) {
        POP._alert('验证码错误');
        this.switchCode();
        this.loading = false;
      } else {
        callback();
      }
    }, (res) => {
      this.loading = false;
    }, { noHeaders: true });
  },
  setLogin() {
    this.setState({ status: true });
  },
  setRegister() {
    this.setState({ status: false });
  },
  handleSubmits() {
    const that = this;
    if (that.loading) { return; }
    const postData = {
      mobile_num: this.refs.mobile_num.value,
      key: this.refs.key.value,
      password: this.refs.password.value,
      device_identifier: GLOBAL.getUuid(),
      channel: 5,
      promot: that.from.channel ? that.from.channel : 'H5'
    };
    if (!GLOBAL.assertNotEmpty(postData.mobile_num, '请输入手机号')) { return; }
    if (!GLOBAL.assertMatchRegExp(postData.mobile_num, /^1\d{10}$/, '请输入正确的手机号')) { return; }
    if (!GLOBAL.assertNotEmpty(postData.key, '请输入验证码')) { return; }
    if (!GLOBAL.assertNotEmpty(postData.password, '请输入密码')) { return; }

    that.loading = true;
    new Ajax().getJSON('POST', '/api/v1/auth/register', postData, (data) => {
      that.loading = false;

      GLOBAL.setUser({
        phone: postData.mobile_num,
        token: postData.token
      });

      if (data.code == 200) {
				// GLOBAL.cookie('userPhone', postData.mobile_num,options);
        storage.set('userToken', data.token);
				// GLOBAL.cookie('uuid', GLOBAL.getUuid(), options);
        that.disPatch('updateUser');
        that.disPatch('updateMall');
        GLOBAL.header.userId = data.userInfo.user_id;
        POP._alert('注册成功');
				// 判断登陆后的跳转
				// var isneed = false;
        if (that.from && that.from.skipurl) {
					// isneed = /\?/.test(that.from.skipurl);
          window.location.href = `${that.from.skipurl.replace(/\?devicetoken([^"]*)/, '')}?devicetoken=${GLOBAL.getUuid()}`;
        } else {
					// that.setState({status: true});
          GLOBAL.goBack(location.pathname.replace(/\/login$/, ''));
          setTimeout(() => { myEvent.execCallback('login'); }, 10);
        }
      } else if (typeof data.error === 'string')					{
        POP._alert(data.error);
      } else 					{
        for (const key in data.error[0]) {
          POP._alert(data.error[0][key]);
        }
      }
    }, (res) => {
      that.loading = false;
      GLOBAL.defaultOnError(res);
    });
  },
  goBack() {
    if (this.from && this.from.skipurl) {
      window.location.href = this.from.skipurl;
      return;
    }
    this.goBackUrl(this.props.route);
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
      type: 'register'
    }, (data) => {
      if (data.code !== 200) {
        if (typeof data.error === 'string')					{
          POP._alert(data.error);
        } else 					{
          for (const key in data.error[0]) {
            POP._alert(data.error[0][key]);
          }
        }
      } else {
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
      }
    }, (res) => {
      this.setState({
        s: 0
      });
      GLOBAL.defaultOnError(res);
    });
  },
	// 安卓下键盘位移
  timeoutId: 0,
  handleFocus(e) {
    if (!GLOBAL.isAndroid()) return;
    const target = e.target;
    clearTimeout(this.timeoutId);
    this.refs.loginBlock.style.height = '1000px';
    this.refs.gScroll.scrollTop = 205;
    target.focus();
  },
  handleBlur() {
    if (!GLOBAL.isAndroid()) return;
    this.timeoutId = setTimeout(() => {
      this.refs.loginBlock.style.height = '100%';
      this.refs.gScroll.scrollTop = 0;
    }, 100);
  },
  componentDidMount() {
		// 判断来源from
    this.from = parseQuery(location.search);

    const that = this;

		// 判断并赋值全局QC，执行qq登录.
    if (/^#access_token=.+/.test(location.hash)) {
      this.setState({ WX_loading: true });
      const token = parseQuery(location.hash.replace('#',''));

            const AJAX = new Ajax('login_qq_oauth');
            AJAX.go({
              access_token: token.access_token
            }, (data) => {
              that.do_result(data, 'qq');
            });
    }

		// 微博登录
    if (this.from && this.from.code) {
      this.setState({ WX_loading: true });
      const AJAX = new Ajax('login_wb');
			   AJAX.go({
        			code: this.from.code,
        			grant_type: 'authorization_code',
        			redirect_uri: encodeURIComponent(`https://m.imread.com/mall/page.9/login${location.search}`)
			   }, (res) => {
			   		that.do_result(res, 'wb');
			   }, that.onloginErr);
    }
  },
  switchCode() {
    this.refs.key.value = '';
    this.refs.vcode.src = `https://i.imread.com/vcode?date=${new Date().getTime()}`;
  },
  do_result(data, type) {
    const that = this;
    if (data.code == 200) {
      storage.set('userToken', 'loaded');
      that.disPatch('updateUser');
      that.disPatch('updateMall');

      GLOBAL.cookie('loadingType', type);
			// browserHistory.push('/')
			// return;
			// 判断登陆后的跳转
      if (that.from) {
        if (that.from.skipurl) {
          window.location.href = `${that.from.skipurl.replace(/\?devicetoken([^"]*)/, '')}?devicetoken=${data.userInfo.uuid || GLOBAL.getUuid()}`;
        } else if (that.from.redirectPath) {
          browserHistory.replace(decodeURIComponent(that.from.redirectPath));
        }
      } else {
        browserHistory.replace('/');
      }
    } else {
      that.onloginErr();
    }
  },
  onloginErr() {
    this.setState({ WX_loading: false, QQ_loading: false });
    POP.alert('登录失败！请尝试其他登录方式', () => {
      browserHistory.push('/mall/page.9/login');
    });
  },
  getRedirectPath() {
    return encodeURIComponent(location.pathname.replace(/\/login$/, ''));
  },
  QQ_login() {
    const redirectPath = encodeURIComponent(`redirectPath=${this.getRedirectPath()}`); // 双重编码

     window.location.href = `https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=716027609&pt_3rd_aid=101354986&daid=383&pt_skey_valid=1&style=35&s_url=http%3A%2F%2Fconnect.qq.com&refer_cgi=authorize&which=&client_id=101354986&response_type=token&scope=all&redirect_uri=https%3A%2F%2Fm.imread.com%2Fmall%2Fpage.9%2Flogin%3F${redirectPath}${encodeURIComponent(location.search)}`;

  	},
  	WB_login() {
    const redirectPath = encodeURIComponent(`redirectPath=${this.getRedirectPath()}`); // 双重编码
    window.location.href = `https://api.weibo.com/oauth2/authorize?client_id=2053392206&response_type=code&scope=follow_app_official_microblog&forcelogin=false&redirect_uri=https%3A%2F%2Fm.imread.com%2Fmall%2Fpage.9.3%2Flogin%3F${redirectPath}${encodeURIComponent(location.search)}`;
  	},
  gowinLogin() {
    this.disPatch('winLogin');
  },
  render() {
    let list;
    const loading = <Loading />;
    if (this.state.QQ_loading || this.state.WX_loading)			{
      return (<div className="gg-body">
        {loading}
      </div>);
    }
    if (this.state.status) {
      list = (<div className="m-login">
        <form className="u-registerform u-userform" onSubmit={this.handleSubmit}>
          <div className="u-inputline-2">
            <input className="u-input-2 u-inputc" placeholder="手机号" type="tel" ref="mobile_num" onClick={this.handleFocus} onBlur={this.handleBlur} />
          </div>
          <div className="u-inputline-2 f-clearfix">
            <input className="u-input-2" placeholder="密码" type="password" ref="password" onClick={this.handleFocus} onBlur={this.handleBlur} />
          </div>
          <div className="u-vcode">
            <div className="u-inputline-2 f-clearfix f-fl" style={{ width: '50%' }}>
              <input className="u-input-2" placeholder="验证码" type="tele" maxLength="6" ref="key" onClick={this.handleFocus} onBlur={this.handleBlur} />
            </div>
            <img className="f-fl" ref="vcode" src="https://i.imread.com/vcode" />
            <div className="f-fr switch" onClick={this.switchCode}>
              <p>看不清</p>
              <p>换一张</p>
            </div>
          </div>

          <div className="u-inputline">
            <button type="submit" className="u-btn u-btn-full">登录</button>
          </div>
          <div className="u-inputline active f-clearfix">
            <div className="u-buttonc f-fl">
              <Link className="tip" to={GLOBAL.setHref('compact')}>用户协议</Link>
            </div>
            <div className="u-buttonc f-fl">
              <Link className="tip" to={GLOBAL.setHref('forget')}>忘记密码</Link>
            </div>
          </div>
        </form>

      </div>);
    } else			{
      list = (<div className="m-register">
        <form className="u-registerform u-userform">
          <div className="u-inputline-2">
            <input className="u-input-2 u-inputc" placeholder="手机号" type="tel" ref="mobile_num" onClick={this.handleFocus} onBlur={this.handleBlur} />
            <div className="f-fr">
              <a className={`u-ymz u-n-bg ${this.state.s ? ' u-btn-disabled' : ''}`} type="button" onClick={this.getCode}>{(this.state.s && `重新获取(${this.state.s})`) || '获取验证码'}</a>
            </div>
          </div>
          <div className="u-b-pass">
            <div className="u-inputline-2 f-clearfix u-pass">
              <input className="u-input-2" placeholder="密码" type="password" ref="password" onClick={this.handleFocus} onBlur={this.handleBlur} />
            </div>
            <div className="u-inputline-2 f-clearfix u-key">
              <input className="u-input-2" placeholder="验证码" type="tel" ref="key" onClick={this.handleFocus} onBlur={this.handleBlur} />
            </div>
          </div>
          <div className="u-inputline">
            <a className="u-btn u-btn-full" onClick={this.handleSubmits}>完成</a>
          </div>

          <div className="u-inputline active f-clearfix">
            <div className="u-buttonc f-fl">
              <Link className="tip" to={GLOBAL.setHref('compact')}>用户协议</Link>
            </div>
          </div>
        </form>
      </div>);
    }
    return (
      <div className="gg-body">
        <div className="g-scroll" ref="gScroll">
          <div className="m-loginblock" ref="loginBlock">
            <div className="m-login-header">
              <a className="f-fl iconfont icon-left" onClick={this.goBack} />
              <div className="m-login-register">
                <a className={this.state.status ? '' : 'active'} onClick={this.setRegister}>注册<span className="iconfont icon-up first" /></a>
                <a className={this.state.status ? 'active' : ''} onClick={this.setLogin}>登录<span className="iconfont icon-up second" /></a>
              </div>
            </div>
            {list}
            <div className="third-login">
              <div className="t-title"><span>第三方账号登录</span></div>
              <div className="t-login">
                <a onClick={this.QQ_login} className="QQ_Login iconfont icon-qq" />
                <a onClick={this.WB_login} className="WB_Login iconfont icon-weibo" />
              </div>
            </div>
          </div>
          {
								// <p className="f-clearfix" style={{marginTop:'150px',lineHeight:'50px',textAlign:'center'}}>						<a onClick={this.gowinLogin}>微信登录</a></p>
					}
        </div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Login;
