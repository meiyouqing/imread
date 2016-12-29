import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import Link from 'react-router/lib/Link';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import Header from './header';

if (typeof window !== 'undefined') {
  require('../../css/setting.css');
}
const ULine = React.createClass({
  render() {
    const src_href = !this.props.line.target ? GLOBAL.setHref(this.props.line.href) : this.props.line.href;
    const target = this.props.line.target ? this.props.line.target : null;

    return (
      <li className="u-line">
        <Link to={this.props.line.href ? src_href : location.pathname} className="f-cb" target={target} data-href={src_href} onClick={this.props.line.requireLogin}>
          <span className="iconfont icon-right f-fr w-auto" />
          <span className="f-fr f-g f-fs-14">{this.props.line.detail}</span>
          <span className="title">{this.props.line.title}</span>
        </Link>
      </li>
    );
  }
});

// var MUblock = React.createClass({
// 	render: function() {
// 		return (
// 			<section className="m-list">
// 				<div className="content">
// 					<ul className="u-lines">
// 						{
// 							this.props.lines.map(function(line, i) {
// 								return <ULine key={i} line={line} />
// 							})
// 						}
// 					</ul>
// 				</div>
// 			</section>
// 		);
// 	}
// });

const Setting = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    return {
      isWx: false,
      showSelector: false,
      index: 0
    };
  },
  requireLogin(e) {
    if (!this.isLogin()) {
      this.goLogin(login_c);
      var href = e.target.getAttribute('data-href');
      e.preventDefault(location.pathname + href);
      return false;
    }

    function login_c() {
      setTimeout(() => {
        browserHistory.push(href || location.pathname);
      }, 10);
    }
    return true;
  },
  showSelector() {
    this.setState({ showSelector: true });
  },
  closeSelector() {
    this.setState({ showSelector: false });
  },
  selectedFavor(e) {
    if (e.target.tagName !== 'LI') return;
    const a = e.target.getAttribute('data-index');
    GLOBAL.cookie('group_id', a, { expires: 1000 });
    this.setState({ detail: this.py[a] });
    this.disPatch('resetMall');
    this.closeSelector();
  },
  componentDidMount() {
    try {
      this.py = ['随便看看', '男生网文', '女生网文', '出版图书'];
      this.setState({ isWx: this.isWx(), detail: this.py[GLOBAL.cookie('group_id')] });
    } catch (e) {
      this.setState({ isWx: this.isWx() });
    }
  },
  render() {
    const blockData = [
      {
        title: '阅读偏好',
        requireLogin: this.showSelector,
        detail: this.state.detail
      }, {
        title: '修改密码',
        href: 'modifypwd',
        requireLogin: this.requireLogin
      }, {
        title: '意见反馈',
        href: 'feedback'
      }, {
        title: '用户协议',
        href: 'compact'
      }, {
        title: '官方网站',
        href: 'https://www.imread.com',
        target: '_self'
      }
    ];
		// 微信不需要 ‘修改密码’
    if (this.state.isWx) blockData.splice(1, 1);
    const back = <Link className="f-fl iconfont icon-left" to="/" />;
    return (
      <div className="g-ggWraper gg-body">
        <Header right={false} title={'设置'} left={back} path={this.props.route} />
        <div className="g-main g-main-1">
          <div className="m-settingblock g-scroll">
            <section className="m-list">
              <div className="content">
                <ul className="u-lines">
                  {
									blockData.map((line, i) => <ULine key={i} line={line} />)
								}
                </ul>
              </div>
            </section>
            <div className="m-set-footer">
              <img src="/src/img/back/bg-@2x.jpg" />
            </div>
          </div>

        </div>
        <section>
          <div className={`m-wrapper${this.state.showSelector ? ' show' : ''}`} />
          <div className={`UI_selecter ph_selector${this.state.showSelector ? ' show' : ''}`} onClick={this.selectedFavor}>
            <ul>
              <li data-index="1" >男生网文</li>
              <li data-index="2" >女生网文</li>
              <li data-index="3" >出版图书</li>
              <li data-index="0" >随便看看</li>
            </ul>
            <button onClick={this.closeSelector} className="UI-cancel">取消</button>
          </div>
        </section>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Setting;
