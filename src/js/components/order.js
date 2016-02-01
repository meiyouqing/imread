var Header = require('./header');
var PayTips = require('./payTips');
var getJSON = require('../modules/getJSON').getJSON;
var parseQuery = require('../modules/parseQuery');
var Recharge_result = require('./Recharge_result');
require('../../css/pay.css');

var mod = React.createClass({
	rechargeHandle: function(e) {
		var hash = window.location.hash;
		window.location.replace(Router.setHref('balance'));
		myEvent.setCallback('recharge',function(){
			window.location.replace(hash);
			this.getBalance();
		}.bind(this))
 	},
	payHandle: function(e) {
		var that = this;
		if((this.state.aidou-this.props.price)>=0){
			getJSON('GET',this.props.orderUrl,{},function(data){
				Router.goBack();
				var autoPay = that.props.chargeMode==2? true:false;
				that.props.paySuccess(data, autoPay);
			});
		}else{
			POP.confirm('艾豆不足，请充值',this.rechargeHandle);
		}
	},
	getBalance: function(){
		getJSON('GET','/api/auth/balance',{},function(data){
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
		return this.state.aidou !== nextState.aidou;
	},
	componentDidMount: function() {
		this.getBalance();
	},
	render: function() {
		var chapter,id;
		if(this.props.chargeMode==1){
			chapter = '总共： '+this.props.chapterCount+'章';
		}else if(this.props.chargeMode==2){
			id = this.props.orderUrl.match(/\?cid=(\d+)&/)[1];
			chapter = '充值章节ID： '+id;
		}
		return (
			<div>
				<Header title={Router.title} right={null} />
				<div className="g-main g-main-1">
					<div className="g-scroll m-order">
						<div className="block f-mt-20">
							<h5 className="f-mb10 f-fw-b">《{this.props.bookName}》</h5>
							<p className="f-bb-eee f-pb-10 f-fw-b">{chapter}</p>
							<p className="f-tr f-mt-10"><span className="f-fc-666">需支付：</span><span className="f-fc-EF5">{this.props.price}艾豆</span></p>
						</div>
						<div className="f-fc-777 f-tr f-pr-15">支付成功后将自动订购后续章节</div>
						<div className="block f-clearfix">
							<div className="f-fl lh-40"><span className="f-mr-5 f-fw-b">艾豆余额：</span><span className="f-fc-666">{this.state.aidou}</span></div>
							<div className="f-fr"><input type="button" className="u-btn" onClick={this.rechargeHandle} value="充值" /></div>
						</div>
						<div className="f-p-15 mt-100"><input type="button" className="u-btn u-btn-full" onClick={this.payHandle} value="确认支付" /></div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports  = mod;