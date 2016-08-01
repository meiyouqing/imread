var Header = require('./header');
var PayTips = require('./payTips');
var Recharge = require('./recharge');

require('../../css/pay.css')

var Balance = React.createClass({
	getBalance:function(){
		if(!this.isMounted()){return;}
		AJAX.init(this.props.route.path)
		AJAX.get(function(data) {
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
		var ordered = this.state.list[this.state.active];
		browserHistory.push(GLOBAL.setHref('recharge/'+ordered.productId));
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
						(this.state.list.length%2===0? this.state.list:this.state.list.slice(0,-1)).map(function(item, i) {
							var active = i == this.state.active;
							var activeClass = active ? ' active' : '';
							var activeImg = active ? 'http://m.imread.com/src/img/balance_select.png' : 'http://m.imread.com/src/img/balance.png';
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
			<div className="gg-body">
				<Header right={false} title={'艾豆充值'} path={this.props.route}/>
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