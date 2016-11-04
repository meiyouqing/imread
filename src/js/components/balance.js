import { browserHistory, Link } from 'react-router'
import React from 'react'
import Loading from './loading'
import AJAX from '../modules/AJAX'
import GLOBAL from '../modules/global'
import Mixins from '../modules/mixins'
import parseQuery from '../modules/parseQuery'
var Header = require('./header');
var Recharge = require('./recharge');

if(typeof window !== 'undefined'){
	require('../../css/pay.css')
}
if(typeof window !== 'undefined'){
	var POP = require('../modules/confirm')
}

var Balance = React.createClass({
	mixins: [Mixins()],
	getBalance:function(){
		if(!this.isMounted()){return;}
		AJAX.go('balance',{
			payType: this.state.isWx?2:1
		},function(data){
			this.setState({
				loading: false,
				balance: data.success.balance,
				list: data.success.list
			});
		}.bind(this),GLOBAL.defaultOnError)
	},
	getInitialState: function() {
		var back;
		var from = parseQuery(location.search);
		if(from && from.backUrl)
			back = from.backUrl;
		else 
			back = '/';

		return {
			back:  <Link className="f-fl icon-s icon-back" to={back} ></Link>,
			loading: true,
			list: [],
			balance: 0,
			active: 0,
			isWx: false,
			payLoading: false
		};
	},
	componentDidMount: function() {
		this.search = parseQuery(location.search);
		this.setState({isWx: this.isWx()},()=>{
			this.getBalance();
			document.addEventListener('rechargeSuccess',this.getBalance);	
		})		
	},
	componentWillUnmount: function(){
		 document.removeEventListener('rechargeSuccess',this.getBalance,false);
	},
	handleClick: function(e) {
		this.setState({
			active: (e.target.getAttribute('data-index') || e.target.parentNode.getAttribute('data-index'))
		});
	},
	orderHandle:function(){
		var ordered = this.state.list[this.state.active];
		browserHistory.push(GLOBAL.setHref('recharge/'+ordered.productId));
	},
	WxOrder: function(){
		AJAX.go('pay',{
			productId:this.state.list[this.state.active].productId,
			payType: '2',
			callback: location.href
		},function(data){
			if(data.code == 200){
				window.location.href = data.success.pay_info;
			} else {
				POP._alert('充值失败');
			}
		});
	},
	zfbPay: function(){
		//this.refs.zfb_form.submit();
		browserHistory.push('/pay/alyPay?callback='+encodeURIComponent('https://m.imread.com/pay'+(this.search.backUrl?('?backUrl='+this.search.backUrl):''))+'&productId='+this.state.list[this.state.active].productId)
	},
	WxInsideOrder: function(){
		var that = this;
		this.setState({payLoading: true});
		AJAX.go('pay',{
			productId:this.state.list[this.state.active].productId,
			payType: '3'
		},function(data){
			if(data.code == 200){

				if (typeof WeixinJSBridge == "undefined"){
				   if( document.addEventListener ){
				   	 document.removeEventListener('WeixinJSBridgeReady', onBridgeReady, false);
				       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
				   }else if (document.attachEvent){
				   	 document.detachEvent('WeixinJSBridgeReady', onBridgeReady); 
				       document.detachEvent('onWeixinJSBridgeReady', onBridgeReady);
				       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
				       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
				   }
				}else{
				   onBridgeReady();
				}

				function onBridgeReady(){
					WeixinJSBridge.invoke(
					       'getBrandWCPayRequest', {
					           "appId" : data.success.appid,     //公众号名称，由商户传入     
					           "timeStamp": data.success.timestamp,         //时间戳，自1970年以来的秒数     
					           "nonceStr" : data.success.noncestr, //随机串     
					           "package" : data.success.package_,     
					           "signType" : data.success.signType,         //微信签名方式：     
					           "paySign" : data.success.paySign //微信签名 
					       },
					       function(res){
					           that.setState({payLoading: false});   alert('done')  
					           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
					           		that.getBalance();
					           		// that.disPatch('updateUser');
					           		// that.disPatch('rechargeSuccess');
					           		POP._alert('支付完成');
					           } else if(res.err_msg == "get_brand_wcpay_request:fail" ){
					           		POP._alert('支付失败');
					           }
					       }
					   ); 
				}
			} else {
				that.setState({payLoading: false});
				POP._alert(data.code + ' 获取信息失败');
			}
		});
	},
	shouldComponentUpdate: function(nextPros, nextState) {
		return nextState.balance != this.state.balance
			    || nextState.list != this.state.list
			    || nextState.active != this.state.active
				|| nextState.isWx != this.state.isWx
			    || nextState.loading != this.state.loading
			    || this.props.children != nextPros.children
			    || nextState.payLoading != this.state.payLoading;
	},
	render: function () {
		
		var content,wxPayLoading=null;
		if(this.state.payLoading)	wxPayLoading = <Loading />;
// console.log(this.state.loading)
		if (this.state.loading) {
			content = <Loading />
		} else {
			content = (
				<div>
					{wxPayLoading}
					<div className="u-balance">
						<div className="i-icon-large"></div>
						<div className="count"><span>{(this.state.balance/100).toFixed(2)}</span></div>
					</div>
					<div className="u-divider"></div>
					<ul className="pay-list f-clearfix">
					{	
							(this.state.list.length%2===0? this.state.list:this.state.list.slice(0,-1)).map(function(item, i) {
								var active = i == this.state.active;
								var activeClass = active ? ' active' : '';
								if(!this.state.isWx)
									return (
										<li key={i} className={"f-fl" + activeClass} onClick={this.handleClick} data-index={i}>
											<span className={"icon-n icon-black-aidou " + activeClass}></span>
											<span className="count">{item.productPrice / 100+'艾豆'}</span>
										</li>
									);
								else 
									return (
										<li key={i} className={"f-fl f-wx" + activeClass} onClick={this.handleClick} data-index={i}>
											<span className="count">{item.fee / 100+'艾豆'}</span>
											<p>获得{item.fee / 100}艾豆，再送{(item.productPrice - item.fee) / 100}艾豆</p>
										</li>
									);
							}.bind(this))
					}
					</ul>
					<div className="u-userform">
						{/*<a className="u-btn u-btn-full f-mb-20"  onClick={this.orderHandle} >话费充值</a>
						<a className={"u-btn u-btn-full u-btn-2" + ((!this.isWx() && this.isMoblie())?'':' f-hide')} onClick={this.WxOrder} >微信充值</a>
						<a className={"u-btn u-btn-full u-btn-3"}  onClick={this.WxInsideOrder} >确认充值</a>*/}
						<a className={"u-btn u-btn-full f-mb-15" + (!this.state.isWx?'':' f-hide')}  onClick={this.orderHandle} >话费充值</a>
						<a className={"u-btn u-btn-full u-btn-2" + ((!this.state.isWx)?'':' f-hide')} onClick={this.zfbPay} >支付宝充值</a>
						{/*<a className={"u-btn u-btn-full u-btn-2" + ((!this.state.isWx && this.isMoblie())?'':' f-hide')} onClick={this.WxOrder} >微信充值</a>*/}
						<a className={"u-btn u-btn-full u-btn-3"+ (this.state.isWx?'':' f-hide')}  onClick={this.WxInsideOrder} >确认充值</a>
					</div>
				</div>
			);
			
		}
		return (
			<div className="gg-body">
				<Header right={false} left={this.state.back} title={'艾豆充值'} path={this.props.route}/>
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