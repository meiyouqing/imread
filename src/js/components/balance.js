import browserHistory from 'react-router/lib/browserHistory';
import Link from 'react-router/lib/Link';
import React from 'react';
import Loading from './loading';
import Ajax from '../modules/ajax';
import mixins from '../modules/mixins';
import parseQuery from '../modules/parseQuery';
import Header from './header';

if (typeof window !== 'undefined') {
  require('../../css/pay.css');
}
if (typeof window !== 'undefined') {
  var POP = require('../modules/confirm');
}

const Balance = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    let back;
    const from = parseQuery(location.search);
    if (from && from.backUrl)			{
      back = from.backUrl;
    } else			{
      back = '/';
    }

    return {
      back: <Link className="f-fl iconfont icon-left" to={back} />,
      loading: true,
      list: [],
      balance: 0,
      active: 0,
      active_zfb: 0,
      isWx: false,
      payLoading: false,
      list_zfb: []
    };
  },
  componentDidMount() {
    this.search = parseQuery(location.search);
    this.setState({ isWx: this.isWx() }, () => {
      this.getBalance();
      document.addEventListener('rechargeSuccess', this.getBalance);
    });
  },
  componentWillUnmount() {
		 document.removeEventListener('rechargeSuccess', this.getBalance, false);
  },
  getBalance() {
    if (!this.isMounted()) { return; }
    const AJAX = new Ajax('balance');
    AJAX.go({
      payType: this.state.isWx ? 2 : 1
    }, (data) => {
      this.setState({
        loading: false,
        balance: data.success.balance,
        list: data.success.list
      });
    });
    this.getZfb();
  },
  getZfb(){
    if (!this.isMounted()) { return; }
    const AJAX = new Ajax('balance');
    AJAX.go({
      payType: 2
    }, (data) => {
      this.setState({
        list_zfb: data.success.list
      });
    });
  },
  handleClick(e) {
    this.setState({
      active: (e.target.getAttribute('data-index') || e.target.parentNode.getAttribute('data-index'))
    });
  },
  handleClick_zfb(e){
    this.setState({
      active_zfb: (e.target.getAttribute('data-index') || e.target.parentNode.getAttribute('data-index'))
    });
  },
  orderHandle() {
    const ordered = this.state.list[this.state.active];
    browserHistory.push(`/pay/recharge/${ordered.productId}${location.search}`);
  },
	// WxOrder: function(){
	// 	const AJAX = new Ajax('pay')
	// 	AJAX.go({
	// 		productId:this.state.list[this.state.active].productId,
	// 		payType: '2',
	// 		callback: location.href
	// 	},function(data){
	// 		if(data.code == 200){
	// 			window.location.href = data.success.pay_info;
	// 		} else {
	// 			POP._alert('充值失败');
	// 		}
	// 	});
	// },
  zfbPay() {
    browserHistory.push(`/pay/alyPay?callback=${encodeURIComponent(`https://m.imread.com/pay${this.search.backUrl ? (`?backUrl=${this.search.backUrl}`) : ''}`)}&productId=${this.state.list_zfb[this.state.active_zfb].productId}`);
  },
  WxInsideOrder() {
    const that = this;
    this.setState({ payLoading: true });
    const AJAX = new Ajax('pay');
    AJAX.go({
      productId: this.state.list[this.state.active].productId,
      payType: '3'
    }, (data) => {
      if (data.code == 200) {
        if (typeof WeixinJSBridge === 'undefined') {
				   if (document.addEventListener) {
              document.removeEventListener('WeixinJSBridgeReady', onBridgeReady.bind(null, data), false);
               document.addEventListener('WeixinJSBridgeReady', onBridgeReady.bind(null, data), false);
				   } else if (document.attachEvent) {
				   	 document.detachEvent('WeixinJSBridgeReady', onBridgeReady.bind(null, data));
				       document.detachEvent('onWeixinJSBridgeReady', onBridgeReady.bind(null, data));
				       document.attachEvent('WeixinJSBridgeReady', onBridgeReady.bind(null, data));
				       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady.bind(null, data));
				   }
        } else {
				   onBridgeReady(data);
        }
      } else {
        that.setState({ payLoading: false });
        POP._alert(`${data.code} 获取信息失败`);
      }
    }, (err) => {
      that.setState({ payLoading: false });
      if (typeof err === 'string') {
        POP._alert(err);
      } else {
        POP._alert(JSON.stringify(err));
      }
    });
      function onBridgeReady(data) {
        window.WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                  appId: data.success.appid,     // 公众号名称，由商户传入
                  timeStamp: data.success.timestamp,         // 时间戳，自1970年以来的秒数
                  nonceStr: data.success.noncestr, // 随机串
                  package: data.success.package_,
                  signType: data.success.signType,         // 微信签名方式：
                  paySign: data.success.paySign // 微信签名
              },
              (res) => {
                  that.setState({ payLoading: false });
                  if (res.err_msg == 'get_brand_wcpay_request:ok') {
                    that.getBalance();
                    // that.disPatch('updateUser');
                    // that.disPatch('rechargeSuccess');
                    POP._alert('支付完成');
                  } else if (res.err_msg == 'get_brand_wcpay_request:fail') {
                    POP._alert('支付失败');
                  }
              }
          );
    }
  },
  shouldComponentUpdate(nextPros, nextState) {
    return nextState.balance != this.state.balance
			    || nextState.list != this.state.list
                      || nextState.list_zfb != this.state.list_zfb
			    || nextState.active != this.state.active
                      || nextState.active_zfb != this.state.active_zfb
			     || nextState.isWx != this.state.isWx
			    || nextState.loading != this.state.loading
			    || this.props.children != nextPros.children
			    || nextState.payLoading != this.state.payLoading;
  },
  render() {
    let content;
    let wxPayLoading = null;
    const right = <Link className="u-btn-font f-fr" to={'/pay/recharge_details/datails.1.20'}>明细</Link>;
    if (this.state.payLoading)	wxPayLoading = <Loading />;
// console.log(this.state.loading)
    if (this.state.loading) {
      content = <Loading />;
    } else {
      content = (
        <div>
          {wxPayLoading}
          <div className="u-balance">
            <div className="title">账户余额</div>
            <div className="count"><span>{(this.state.balance / 100).toFixed(2)}</span><span className="iconfont icon-aidou" /></div>
          </div>
          <div className={`u-boxer${(!this.state.isWx) ? '' : ' f-hide'}`}>
          <div className="u-divider"></div>
          <div className="u-userform">
          <p>支付宝充值</p>
            {/* <a className="u-btn u-btn-full f-mb-20"  onClick={this.orderHandle} >话费充值</a>
						<a className={"u-btn u-btn-full u-btn-2" + ((!this.isWx() && this.isMoblie())?'':' f-hide')} onClick={this.WxOrder} >微信充值</a>
						<a className={"u-btn u-btn-full u-btn-3"}  onClick={this.WxInsideOrder} >确认充值</a>*/}           
            <ul className={`pay-list f-clearfix ${!this.state.isWx ? '' : ' f-hide'}`}>
            {
              (this.state.list_zfb.length % 2 === 0 ? this.state.list_zfb : this.state.list_zfb.slice(0, -1)).map((item, i) => {
              const active = i == this.state.active_zfb;
              const activeClass = active ? ' active' : '';

                return (
                  <li key={i} className={`f-fl f-wx${activeClass}`} onClick={this.handleClick_zfb} data-index={i}>
                    <span className="count" data-index={i}>{`${item.fee / 100}元`}</span>
                    <p data-index={i}>获得{item.fee / 100}艾豆，送{(item.productPrice - item.fee) / 100}艾豆</p>
                  </li>
                );
            })
          }
          </ul>
            <a className={`u-btn u-btn-full f-mb-15${!this.state.isWx ? '' : ' f-hide'}`} onClick={this.zfbPay} >确认充值</a>
            </div>
            <div className="u-divider"></div>
            <div className="u-userform">
             <p>话费充值 <span className="f-fr col-r">仅限中国移动</span></p>

                      <ul className="pay-list f-clearfix">
            {
              (this.state.list.length % 2 === 0 ? this.state.list : this.state.list.slice(0, -1)).map((item, i) => {
                  const active = i == this.state.active;
                  const activeClass = active ? ' active' : '';
                    return (
                      <li key={i} className={`f-fl${activeClass}`} onClick={this.handleClick} data-index={i}>
                        <span className="count">{`${item.productPrice / 100}元`}</span>
                      </li>
                    );

                })
            }
          </ul>
             <a className={`u-btn u-btn-full f-mb-15${!this.state.isWx ? '' : ' f-hide'}`} onClick={this.orderHandle} >确认充值</a>
      </div>
    </div>
      <div className={`u-boxer u-wx${(this.state.isWx) ? '' : ' f-hide'}`}>
              

                      <ul className="pay-list f-clearfix">
            {
              (this.state.list.length % 2 === 0 ? this.state.list : this.state.list.slice(0, -1)).map((item, i) => {
              const active = i == this.state.active;
              const activeClass = active ? ' active' : '';
                return (
                  <li key={i} className={`f-fl f-wx${activeClass}`} onClick={this.handleClick} data-index={i}>
                    <span className="count">{`${item.fee / 100}元`}</span>
                    <p data-index={i}>获得{item.fee / 100}艾豆，送{(item.productPrice - item.fee) / 100}艾豆</p>
                  </li>
                );
            })
          }
          </ul>
          <div className="u-userform">
          <a className={`u-btn u-btn-full u-btn-3${this.state.isWx ? '' : ' f-hide'}`} onClick={this.WxInsideOrder} >确认充值</a>
          </div>
      </div>

          <div className={`u-divider${(!this.state.isWx) ? '' : ' f-hide'}`}></div>
          <div className="hint">
            <dl>
              <dt>温馨提示</dt>
              <dd><span className="point" /><span>艾豆不支持购买咪咕书籍</span></dd>
              <dd><span className="point" /><span>如遇支付问题请联系400-967-9897</span></dd>
            </dl>
          </div>
        </div>
			);
    }
    return (
      <div className="gg-body">
        <Header right={right} left={this.state.back} title={'艾豆充值'} path={this.props.route} />
        <div className="g-main g-main-1">
          <div className="g-scroll m-balance">
            {content}
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Balance;
