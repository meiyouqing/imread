var Header = require('./header');
var Recharge = require('./recharge');

require('../../css/pay.css')

var Balance = React.createClass({
	mixins: [Mixins()],
	getBalance:function(){
		if(!this.isMounted()){return;}
		// AJAX.init(this.props.route.path)
		// AJAX.get(function(data) {
		// 	this.setState({
		// 		loading: false,
		// 		balance: data.success.balance,
		// 		list: !this.state.isWX?data.success.list:this.state.list
		// 	});
		// }.bind(this));
		
		AJAX.go('balance',{
			payType: this.state.isWX?2:1
		},function(data){
			this.setState({
				loading: false,
				balance: data.success.balance,
				list: data.success.list
			});
		}.bind(this))
	},
	getInitialState: function() {
		return {
			loading: true,
			list: [],
			balance: 0,
			active: 0,
			isWX: false//this.isWx()
		};
	},
	componentDidMount: function() {
		if(this.checkLogin(this.props.route)) this.getBalance();
		document.addEventListener('rechargeSuccess',this.getBalance);
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
			payType: '2'
		},function(data){
			if(data.code == 200){
				window.location.href = data.success.pay_info;
			} else {
				POP._alert('充值失败');
			}
		});
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
								if(!this.state.isWX)
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
						<a className="u-btn u-btn-full f-mb-20"  onClick={this.orderHandle} >话费充值</a>
						<a className={"u-btn u-btn-full u-btn-2" + ((!this.isWx() && this.isMoblie())?'':' f-hide')} onClick={this.WxOrder} >微信充值</a>
						{/*<a className={"u-btn u-btn-full f-mb-20" + (!this.state.isWX?'':' f-hide')}  onClick={this.orderHandle} >话费充值</a>
						<a className={"u-btn u-btn-full u-btn-2" + ((!this.state.isWX && this.isMoblie())?'':' f-hide')} onClick={this.WxOrder} >微信充值</a>
						<a className={"u-btn u-btn-full u-btn-3"+ (this.state.isWX?'':' f-hide')}  onClick={this.WxOrder} >确认充值</a>*/}
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