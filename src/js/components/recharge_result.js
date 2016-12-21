import myEvent from '../modules/myEvent';
import Loading from './loading';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import React from 'react';
const Header = require('./header');
if (typeof window !== 'undefined') {
  require('../../css/pay.css');
}
// if(typeof window !== 'undefined'){
// 	var POP = require('../modules/confirm')
// }

const RechageRes = React.createClass({
  times: 0,
  mixins: [mixins()],
  getInitialState() {
    return {
      success: null,
      data: {
        discount_price: '',
        product_price: '',
        date: ''
      }
    };
  },
  completed() {
		// if(myEvent.callback.recharge){
    myEvent.execCallback('recharge');
		// }else{
		// 	myEvent.execCallback('rechargeDef');
		// }
  },
  success() {
		// console.log('成功');
    this.setState({ success: true, status: '充值成功' });
    this.disPatch('rechargeSuccess');
  },
  failed() {
		// console.log('失败');
    this.setState({ success: false, status: '充值失败' });
  },
  checkCharge() {
    const params = this.props.location.state || {};
    const AJAX = new Ajax('mOrder');
    AJAX.go(params, (data) => {
      if (data.code === 200) {
        switch (data.status) {
          case 1:
            this.times++;
            if (this.times >= 10) {
              this.failed();
              break;
            }
            setTimeout(() => {
              this.checkCharge();
            }, 3000);
            break;
          case 2:
            this.success();
            this.setState({ data });
            break;
          default:
            this.failed();
        }
      }
    }, (err) => {
			// POP._alert('服务器错误')
      this.failed();
    });
  },
  componentDidMount() {
    this.checkCharge();
  },
  render() {
		 const right = <button className="f-fr textBtn" onClick={this.completed} > 完成 </button>;
		 let list;

		 if (this.state.success == null) {
		 	list = <Loading />;
		 } else if (this.state.success === true) {
		 	list = (
  <div className="m-recharge-result">
    <div className="m-result-status">
      <span className="iconfont icon-duihao-2" />
      <span className="m-result-icon">{this.state.status}</span>
    </div>
    <div className="m-result-detail">
      <p><span>充值数目</span><span className="m-s">{this.state.data.discount_price / 100}艾豆</span></p>
      <p><span>支付金额</span><span className="m-s">{this.state.data.discount_price / 100}元</span></p>
      <p><span>交易时间</span><span className="m-s">{this.state.data.date}</span></p>
    </div>
  </div>
		 		);
		 } else {
		 	list = (
  <div className="m-recharge-result">
    <div className="m-result-status">
      <span className="iconfont icon-cha" />
      <span className="m-result-icon">{this.state.status}</span>
    </div>
    <div className="m-result-detail-f">
			 				如遇支付问题请联系<a href="tel:4009679897">400-967-9897</a>
    </div>
  </div>
		 		);
		 }
    return (
      <div>
        <Header right={right} left={null} title={'充值结果'} path={this.props.route} />
        <div className="g-main g-main-1 g-f">
          {list}
        </div>
      </div>
    );
  }
});

module.exports = RechageRes;
