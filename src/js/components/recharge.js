import browserHistory from 'react-router/lib/browserHistory'
import AJAX from '../modules/AJAX'
import GLOBAL from '../modules/global'
import Mixins from '../modules/mixins'
import myEvent from '../modules/myEvent'
import React from 'react'
var Header = require('./header');
var PayTips = require('./payTips');
var Recharge_result = require('./recharge_result');
if(typeof window !== 'undefined'){
	require('../../css/pay.css');
}
if(typeof window !== 'undefined'){
	var POP = require('../modules/confirm')
}

var Recharge = React.createClass({
	aidou:0,
	sum:0,
	initData:null,
	loading:false,
	params: {},
	mixins: [Mixins()],
	handleSubmit: function() {
		var that = this;
		// var data = {code:200};
		// success(data);
		// browserHistory.push({pathname:GLOBAL.setHref('recharge_result'),state:that.params});
		// return;
		var phoneNumber = that.refs.mobile_num.value;
		var verifyCode = that.refs.key.value;
		if (that.loading) {return ;}
		if (!GLOBAL.assertNotEmpty(phoneNumber, '请输入手机号')) {return ;}
		if (!GLOBAL.assertMatchRegExp(phoneNumber, /^1\d{10}$/, '请输入正确的手机号')) {return ;}
		if(!that.params.trade_no){
			POP._alert('请先获取验证码！');
			return;
		}
		if (!GLOBAL.assertNotEmpty(verifyCode, '请输入验证码')) {return ;}
		if (!GLOBAL.assertMatchRegExp(verifyCode, /^\d{6}$/, '请输入6位数字验证码')) {return ;}

		this.params.verify_code = verifyCode;
		that.loading = true;

		// that.params = {trade_no:"d1258ca57d9f42ec-123",trade_day:20160811,order_no:1788352850130944,verify_code:691554}
		// browserHistory.push({pathname:GLOBAL.setHref('recharge_result'),state:that.params});


		AJAX.go('payConfirm', this.params, success, null);
		function success(data){
			myEvent.setCallback('recharge',function(){
				browserHistory.push(window.location.pathname.replace(/\/recharge\/([^\"]*)/,''));	
			}.bind(this));

			that.loading=false;
			if(data.code != 200){
				if(data.reason == '省份被屏蔽'){
					POP._alert('您的号码所在省份暂不支持充值，请使用其他充值方式');
				}else{
					POP._alert(data.reason);
				}
			}
			browserHistory.push({pathname:GLOBAL.setHref('recharge_result'),state:that.params});

			
			// setTimeout(function(){
			// 	var rechargeRes = <Recharge_result data={data} />
			// 	if(data.code!==200){
			// 		that.props.popup(rechargeRes);
			// 		return;
			// 	}
			// 	data.sum = that.sum;
			// 	data.aidou = that.aidou;
			// 	data.phone = that.params_init.mobileNum;
			// 	that.props.popup(rechargeRes);
			// },0)
		}
 	},
	getCode: function(e) {
		e.preventDefault();
		if (this.state.s) {return ;}
		var mobile_num = this.refs.mobile_num.value;
		if (!GLOBAL.assertNotEmpty(mobile_num, '请输入手机号')) {return ;}
		if (!GLOBAL.assertMatchRegExp(mobile_num, /^1\d{10}$/, '请输入正确的手机号')) {return ;}
		if(/^133|^153|^180|^181|^189|^177/.test(mobile_num)) {
			POP._alert('暂不支持电信号码');
			return;
		}
		//this.params_init.mobileNum = mobile_num;
		var countDown = function(){
			this.setState({
				s: 60
			});
			var inter = setInterval(function() {
				if (this.state.s > 0 && this.isMounted()) {
					this.setState({
						s: this.state.s - 1
					});
				} else {
					clearInterval(inter);
				}
			}.bind(this), 1000);
		}.bind(this);
		var initError = function (res){
			// console.log(res)
			this.setState({
				s: 0
			});
			POP.alert((res.reason+', 错误码：'+res.code));
		}.bind(this);


		// var gotInit = function(data,again){
		// 	this.initData = data;
		// 	this.refs.key.focus();
		// 	storage.set('payUser',this.params_init.mobileNum);
		// 	if(again){
		// 		var postData = {
		// 			mobileNum: this.params_init.mobileNum,
		// 			orderNo: this.params_init.orderNo,
		// 			r: data.vcurl
		// 		}
		// 		AJAX.go('payVcurl', postData, gotInit, initError, 'recharge');
		// 	}
		// }.bind(this);
		if(!this.params.trade_no || (this.prv_num != mobile_num))	this.getPay();
		else this.rePay();

		this.prv_num = mobile_num;
		countDown();
		// if(!this.initData||storage.get('payUser')!==mobile_num){
		// 	AJAX.go('paySign', this.params_init, function(data) {
		// 		// console.log(data)
		// 		this.params_init.sign = data.content;
		// 		AJAX.go('payInit', this.params_init, gotInit, initError, 'recharge');
		// 	}.bind(this), initError, 'recharge');
		// }else{
		// 	gotInit(this.initData,true);
		// }
	},
	getPay: function(){
		var that = this;
		var postData = {
			productId:this.props.params.rechargeId,
			mobileNum:that.refs.mobile_num.value,
		}

		AJAX.go('pay',postData,function(data){
			
			if(data.code == 200){
				that.params = {
					trade_no: data.success.tradeno,
					trade_day:data.success.trade_day,
					order_no:data.success.orderno
				};
				POP._alert('验证码发送成功');
			} else {
				POP._alert('验证码发送失败');
			}
		});
	},
	rePay: function(){
		var params = {
			trade_no: this.params.trade_no,
			trade_day:this.params.trade_day
		};
		AJAX.go('repay',params,function(data){
			if(data.code == 200){
				POP._alert('重新发送成功');
			} else {
				POP._alert('重新发送失败');
			}
		});
	},
	getFee: function(){
		var _this = this;
		AJAX.go('balance',null,function(data){
			data.success.list.map(function(v,i){
				if(v.productId == _this.props.params.rechargeId){
					_this.setState({
						aidou: v.fee/100,
						sum: v.fee/100
					});
				}
			});	
		});
	},
	getInitialState: function() {
		return {
			s:0,
			aidou: 0,
			sum: 0
		}
	},
	shouldComponentUpdate: function(nextPros, nextState) {
		return nextState.s != this.state.s 
			    || nextState.aidou != this.state.aidou
			    || nextState.sum != this.state.sum
			    || this.props.children != nextPros.children;
	},
	componentWillMount: function(){
		//this.getPay();
		 this.getFee();
	},
	// componentDidMount: function() {
	// 	var phoneNumber = storage.get('payUser');
	// 	if(phoneNumber){
	// 		this.refs.mobile_num.value = phoneNumber;
	// 	}
	// },
	//安卓下键盘位移
	timeoutId:0,
	handleFocus:function (){
		if(!GLOBAL.isAndroid()) return;
		clearTimeout(this.timeoutId);
		this.refs.registerblock.style.height = '360px';
		this.refs.gScroll.scrollTop = 120;
	},
	handleBlur:function (){
		if(!GLOBAL.isAndroid() || !this.refs.registerblock) return;
		this.timeoutId = setTimeout(()=>{
			this.refs.registerblock.style.height = 'auto';
			this.refs.gScroll.scrollTop = 0;				
		},100)
	},
	render: function() {
		return (
			<div className="gg-body">
				<Header right={null} path={this.props.route} title="话费充值"/>
				<div className="g-main g-main-1">
					<div className="g-scroll m-balance" ref="gScroll">
						<div className="u-divider"></div>
						<div className="u-balance-r f-tl">
							<h5 className="tipTitle f-mb5">充值订单</h5>
							<p className="f-fc-777">充值艾豆：{this.state.aidou}艾豆</p>
							<p className="f-fc-777">支付金额：{this.state.sum}元</p>
						</div>
						<div className="u-divider u-p-10"></div>
						<div className="m-registerblock" ref="registerblock">
							<form className="u-registerform u-userform">
								<div className="u-inputline-2">
									<input className="u-input-2 u-inputc" placeholder="手机号" type="tel" ref="mobile_num" onFocus={this.handleFocus} onBlur={this.handleBlur} />
									<div className="f-fr">
										<a className={"u-ymz u-n-bg "+(this.state.s?' u-btn-disabled':'')} type="button" onClick={this.getCode}>{this.state.s && ('重新获取(' + this.state.s + ')') || '获取验证码'}</a>
									</div>
								</div>
								<div className="u-inputline-2 f-clearfix">
										<input className="u-input-2" placeholder="验证码" type="tel" ref="key" onFocus={this.handleFocus} onBlur={this.handleBlur} />
								</div>
								<div className="u-inputline u-p-25">
									<a className="u-btn u-btn-full" onClick={this.handleSubmit}>完成</a>
								</div>
							</form>
						</div>
						<PayTips />
					</div>
				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports  = Recharge;