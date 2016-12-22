import React from 'react';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import Header from './header';

if (typeof window !== 'undefined') {
  var POP = require('../modules/confirm');
}

const Feedback = React.createClass({
  getInitialState() {
    return { showFeedFooter: true };
  },
  componentDidMount() {
		// this.refs.contact.focus();
    this.refs.contact.addEventListener('focus', () => {
      this.setState({ showFeedFooter: false });
    }, false);
    this.refs.contact.addEventListener('blur', () => {
      this.setState({ showFeedFooter: true });
    }, false);
    this.refs.message.addEventListener('focus', () => {
      this.setState({ showFeedFooter: false });
    }, false);
    this.refs.message.addEventListener('blur', () => {
      this.setState({ showFeedFooter: true });
    }, false);
  },
  handleSubmit() {
    const message = this.refs.message.value.trim();
    const contact = this.refs.contact.value.trim();

    if (!GLOBAL.assertNotEmpty(message, '请输入反馈意见')) { return; }
		// if (!GLOBAL.assertNotEmpty(contact, '请输入联系方式')) {return ;}
    const AJAX = new Ajax('advice');
    AJAX.go({
      message,
      contact,
      type: 'unEncode'
    }, (data) => {
      POP._alert(data.success);
      GLOBAL.goBack();
    });
    return false;
  },
  copy() {
    POP._alert('请长按复制公众号');
		// this.refs.gzh.select();
		// try{
		// 	var suc = document.execCommand('copy');
		// 	var msg = suc? '微信公众号已复制，请添加关注' : '复制失败，请手动复制';
		// 	POP._alert(msg);
		// }catch(e){
		// 	POP._alert('复制失败，请手动复制');
		// }
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.showFeedFooter !== nextProps.showFeedFooter;
  },
  render() {
    const right = <span className="f-fr iconfont icon-duihao" onClick={this.handleSubmit} />;
    return (
      <div className="gg-body">
        <Header right={right} path={this.props.route} title="意见反馈" />
        <div className="m-feedbackblock m-userblocks">
          <form className="u-feedbackform u-userform">
            <div className="u-inputline">
              <input className="u-input" placeholder="请填写你的联系方式，如手机号、QQ号" ref="contact" />
            </div>
            <div className="u-inputline">
              <textarea className="u-input u-textarea" placeholder="期待您的反馈，您的意见是我们进步的最大动力哦" ref="message" />
            </div>
          </form>

          <div className={`u-feed-footer${this.state.showFeedFooter ? '' : ' f-hide'}`} ref="feedFooter">
            <a target="_blank" rel="noopener noreferrer" href="http://qm.qq.com/cgi-bin/qm/qr?k=yvE1mfItNhQSQEEaDXwEltjy-UUsaSy-"><span className="iconfont icon-qq" /> <span>读者交流群</span><span className="u-r">469935346</span></a>
            <a onClick={this.copy}><span className="iconfont icon-weixin" /> <span>微信公众号</span><span className="u-r">艾美阅读</span></a>
            <a href="https://weibo.com/u/5824384026" target="_blank" rel="noopener noreferrer"><span className="iconfont icon-weibo" /> <span>官方微博</span><span className="u-r">艾美阅读</span></a>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Feedback;
