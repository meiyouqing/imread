if(typeof window !== 'undefined'){
	var POP = require('../modules/confirm')
}
var Header = require('./header');

// if(false&&typeof window !== 'undefined'){
// 	require('../../css/pay.css');
// }

var mod = React.createClass({
	rechargeHandle: function(e) {
		var hash = location.pathname;
		browserHistory.push(GLOBAL.setHref('balance'));
		myEvent.setCallback('recharge',function(){
			browserHistory.push(hash);
			this.getBalance();
		}.bind(this))
 	},
	payHandle: function(e) {
		var that = this;
		if((this.state.aidou-this.props.data.marketPrice)>=0){
			AJAX.getJSON('GET',this.props.data.orderUrl.replace('/api/','/api/v1/'),{},function(data){
				if(data.code == 403)
					POP._alert('支付失败');
				else 
					that.props.goBack();
				// var autoPay = that.props.chargeMode==2? true:false;
				// that.props.paySuccess(data, autoPay);
			});
		}else{
			POP._alert('艾豆不足，请充值',this.rechargeHandle);
		}
	},
	getBalance: function(){
		AJAX.getJSON('GET','/api/v1/auth/balance',{},function(data){
			this.setState({
				aidou: data.success.balance/100
			});
		}.bind(this))

	},
	getInitialState: function(){
		return {
			aidou: 0
		}
	},
	shouldComponentUpdate: function(nextPros, nextState) {
		return this.state.aidou !== nextState.aidou
			|| this.props.children !== nextPros.children;
	},
	componentDidMount: function() {
		this.getBalance();
		
	},
	render: function() {

		return (<div>
				{
					<div className="m-order">
						<div className="block">
							<div className="m-order-detail">
								<h5 className="f-mb10 f-fw-b f-ellipsis">《{this.props.introduce.book_name}》</h5>
								<p className="chapter f-bb-eee f-pb-10 f-fw-b f-ellipsis">{(this.props.introduce.charge_mode == 2) ?this.props.data.name:"购买全本"}</p>
							</div>
							<p className="f-tr f-l-50"><span className="f-fl f-r-notice">{(this.props.introduce.charge_mode == 2) ?'支付成功后将自动续订':""}</span><span className="f-fc-000">需支付</span><span className="f-s-10">¥</span><span className="f-fc-EF5">{this.props.data.marketPrice}</span></p>
						</div>
						<div className="block f-clearfix m-order-left">
							<div className="f-fl lh-30"><span className="f-mr-5 f-fw-b">艾豆余额</span></div>
							<div className="f-fr f-s-14"><span className="f-fc-777">¥&nbsp;{this.state.aidou}</span><input type="button" className="btn-cz" onClick={this.rechargeHandle} value="充值" /></div>
						</div>
						<div className="f-p-15 mt-45"><input type="button" className="u-btn u-btn-full" onClick={this.payHandle} value="确认支付" /></div>
					</div>}
			</div>
		);
	}
});

module.exports  = mod;