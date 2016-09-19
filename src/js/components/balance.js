var Header = require('./header');
var Recharge = require('./recharge');

require('../../css/pay.css')

var Balance = React.createClass({
	mixins: [Mixins()],
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
		if(this.checkLogin(this.props.route)) this.getBalance();
		document.addEventListener('rechargeSuccess',function(){//触发登录时更新个人信息
			this.getBalance();
		}.bind(this));
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
	shouldComponentUpdate: function(nextPros, nextState) {
		return nextState.balance != this.state.balance
			    || nextState.list != this.state.list
			    || nextState.active != this.state.active
			    || this.props.children != nextPros.children;
	},
	render: function () {
		
		var content;
		if (this.state.loading) {
			content = <Loading />
		} else {
			content = (
				<div>
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
							//var activeImg = active ? 'https://m.imread.com/src/img/balance_select.png' : 'https://m.imread.com/src/img/balance.png';
							return (
								<li key={i} className={"f-fl" + activeClass} onClick={this.handleClick} data-index={i}>
									<span className={"icon-n icon-black-aidou " + activeClass}></span>
									<span className="count">{item.productPrice / 100+'艾豆'}</span>
								</li>
							);
						}.bind(this))
					}
					</ul>
					<div className="u-userform">
						<a className="u-btn u-btn-full" onClick={this.orderHandle} >话费充值</a>
					</div>
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