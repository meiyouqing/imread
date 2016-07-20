var Header = require('./header');
var PayTips = require('./payTips');
var Recharge_result = require('./recharge_result');
require('../../css/pay.css');

var Recharge = React.createClass({
	aidou:0,
	sum:0,
	initData:null,
	loading:false,
	handleSubmit: function() {
		var that = this;
		// var data = {code:200};
		// success(data);
		// return;
		var phoneNumber = that.refs.mobile_num.value;
		var verifyCode = that.refs.key.value;
		if (that.loading) {return ;}
		if (!GLOBAL.assertNotEmpty(phoneNumber, '请输入手机号')) {return ;}
		if (!GLOBAL.assertMatchRegExp(phoneNumber, /^1\d{10}$/, '请输入正确的手机号')) {return ;}
		if(!that.initData){
			POP._alert('请先获取验证码！');
			return;
		}
		if (!GLOBAL.assertNotEmpty(verifyCode, '请输入验证码')) {return ;}
		if (!GLOBAL.assertMatchRegExp(verifyCode, /^\d{6}$/, '请输入6位数字验证码')) {return ;}

		var postData = {
			mobileNum: that.params_init.mobileNum,
			orderNo: that.params_init.orderNo,
			verifyCode: verifyCode
		};
		that.loading = true;
		AJAX.go('payConfirm', postData, success, null, 'recharge');
		// function fail(res){
		// 	that.loading = false;
		// 	console.log(res.code)
		// 	if(res.code===159){
		// 		POP.alert(res.reason, that.refs.key.focus);
		// 	}else{
		// 		success(res);
		// 	}
		// }
		function success(data){
			that.loading=false;
			if(data.code===159){
				POP.alert(data.reason, function(){
					that.refs.key.select();
				});
				return;
			}
			browserHistory.push(GLOBAL.setHref('recharge_result'));
			setTimeout(function(){
				var rechargeRes = <Recharge_result data={data} />
				if(data.code!==200){
					that.props.popup(rechargeRes);
					return;
				}
				data.sum = that.sum;
				data.aidou = that.aidou;
				data.phone = that.params_init.mobileNum;
				that.props.popup(rechargeRes);
			},0)
		}
 	},
	getCode: function(e) {
		e.preventDefault();
		if (this.state.s) {return ;}
		var mobile_num = this.refs.mobile_num.value;
		if (!GLOBAL.assertNotEmpty(mobile_num, '请输入手机号')) {return ;}
		if (!GLOBAL.assertMatchRegExp(mobile_num, /^1\d{10}$/, '请输入正确的手机号')) {return ;}
		this.params_init.mobileNum = mobile_num;
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
		var gotInit = function(data,again){
			this.initData = data;
			this.refs.key.focus();
			GLOBAL.cookie('payUser',this.params_init.mobileNum);
			if(again){
				var postData = {
					mobileNum: this.params_init.mobileNum,
					orderNo: this.params_init.orderNo,
					r: data.vcurl
				}
				AJAX.go('payVcurl', postData, gotInit, initError, 'recharge');
			}
		}.bind(this);
		countDown();
		if(!this.initData||GLOBAL.cookie('payUser')!==mobile_num){
			AJAX.go('paySign', this.params_init, function(data) {
				// console.log(data)
				this.params_init.sign = data.content;
				AJAX.go('payInit', this.params_init, gotInit, initError, 'recharge');
			}.bind(this), initError, 'recharge');
		}else{
			gotInit(this.initData,true);
		}
	},
	getPay: function(){
		var that = this;
		console.log(this.props.params.param)
		var postData = {
			productId:this.props.params.param,
			fee:'1',
			payType:'1',
			spType:'1',
			mobileNum:'1',
			productName:'1',
			productDesc:'1',
			others:'1'
		}

		AJAX.go('pay',postData,function(data){
			that.setState({
				aidou: data.success.fee/100,
				sum: data.success.fee/100
			});
			var params = data.success;
			that.params_init = {
				fee: params.fee,
				orderNo: params.orderNo,
				others: params.others,
				payType: params.payType,
				productDesc: params.productDesc,
				productName: params.productName,
				reqTime: params.reqTime,
				spType: params.spType,
				thirdPartyId: params.thirdPartyId			
			}
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
			    || nextState.sum != this.state.sum;
	},
	componentWillMount: function(){
		this.getPay();
	},
	componentDidMount: function() {
		var phoneNumber = GLOBAL.cookie('payUser');
		if(phoneNumber){
			this.refs.mobile_num.value = phoneNumber;
		}else{
			this.refs.mobile_num.focus();
		}
	},
	render: function() {
		return (
			<div className="gg-body">
				<Header right={null} />
				<div className="g-main g-main-1">
					<div className="g-scroll m-balance">
						<div className="u-balance f-tl">
							<h5 className="tipTitle f-mb5">充值订单</h5>
							<p className="f-fc-777">充值艾豆：{this.state.aidou}艾豆</p>
							<p className="f-fc-777">支付金额：{this.state.sum}元</p>
						</div>
						<div className="u-divider"></div>
						<div className="m-registerblock">
							<form className="u-registerform u-userform">
								<p className="formTitle f-fc-777">仅支持中国移动手机用户</p>
								<div className="u-inputline">
									<input className="u-input" placeholder="手机号" type="tel" ref="mobile_num" />
								</div>
								<div className="u-inputline f-clearfix">
									<div className="u-inputc f-fl">
										<input className="u-input" placeholder="验证码" type="tel" ref="key" />
									</div>
									<div className="u-buttonc f-fl">
										<a className={"u-btn u-btn-full"+(this.state.s?' u-btn-disabled':'')} type="button" onClick={this.getCode}>{this.state.s && ('重新获取(' + this.state.s + ')') || '获取验证码'}</a>
									</div>
								</div>
								<div className="u-inputline">
									<a className="u-btn u-btn-full" onClick={this.handleSubmit}>确认充值</a>
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