var Header = require('./header');
var PayTips = require('./payTips');
var Recharge = require('./recharge');

require('../../css/pay.css')

var Balance = React.createClass({
	getBalance:function(){
		if(!this.isMounted()){return;}
		Router.get(function(data) {
			this.setState({
				loading: false,
				balance: data.success.balance,
				list: data.success.list
			});
		}.bind(this));
	},
	getInitialState: function() {
		return {
			loading: true,
			list: [],
			balance: 0,
			active: 0
		};
	},
	componentDidMount: function() {
		this.getBalance();
	},
	handleClick: function(e) {
		this.setState({
			active: (e.target.getAttribute('data-index') || e.target.parentNode.getAttribute('data-index'))
		});
	},
	orderHandle:function(){
		var that = this;
		var hash = window.location.hash;
		var ordered = this.state.list[this.state.active];
		var href=Router.setHref('recharge.'+ordered.productId+'.'+ordered.productPrice);
		var postData = {
			productId:ordered.productId,
			fee:'1',
			payType:'1',
			spType:'1',
			mobileNum:'1',
			productName:'1',
			productDesc:'1',
			others:'1'
		}
		Router.ajax('pay',postData,function(data){
			window.location.replace(Router.setHref('recharge'));
			setTimeout(function(){
				window.location.replace(hash+'/recharge');
				that.props.popup(<Recharge data={data.success} popup={that.props.popup} />);				
			},0)
			myEvent.setCallback('rechargeDef',rechCallback);
		});
		function rechCallback(){
			window.location.replace(hash);
			that.getBalance();
		}
	},
	render: function () {
		var content;
		if (this.state.loading) {
			content = <Loading />
		} else {
			content = (
				<div>
					<div className="u-balance">
						<div className="title">余额</div>
						<div className="count">{(this.state.balance/100).toFixed(2)}<span className="unit">艾豆</span></div>
					</div>
					<div className="u-divider"></div>
					<ul className="pay-list f-clearfix">
					{	
						this.state.list.map(function(item, i) {
							var active = i == this.state.active;
							var activeClass = active ? ' active' : '';
							var activeImg = active ? 'src/img/balance_select.png' : 'src/img/balance.png';
							return (
								<li key={i} className={"f-fl" + activeClass} onClick={this.handleClick} data-index={i}>
									<img src={activeImg} />
									<span className="count">{item.productPrice / 100}</span>
								</li>
							);
						}.bind(this))
					}
					</ul>
					<div className="u-userform">
						<a className="u-btn u-btn-full" onClick={this.orderHandle} >话费充值</a>
					</div>
					<PayTips />
				</div>
			);
			
		}
		return (
			<div>
				<Header right={false} title={Router.title} />
				<div className="g-main g-main-1">
					<div className="g-scroll m-balance">
						{content}
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Balance;