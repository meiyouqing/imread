import React from 'react'
import AJAX from '../modules/AJAX'
import Mixins from '../modules/mixins'
var Header = require('./header');
if(typeof window !== 'undefined'){
	require('../../css/pay.css')
}

var mRecharge = React.createClass({
	mixins: [Mixins()],
	getInitialState: function() {
		return {
			price: 5
		};
	},
	gotoRecharge: function(value){

		AJAX.getJSON('GET','/api/v1/migu/rechange', {price: this.state.price}, function(data) {
			if(data.code === 200)
				window.location.href = data.success.url;
			else
				POP._alert("获取信息失败");
		}.bind(this));
	},
	componentDidMount: function() {
		this.refs.balance_list.onclick = function(e){
			this.setState({price:e.target.getAttribute('data-price')});
		}.bind(this);
	},
	render: function () {
		var price = [5,10,20,50,100,200];
		return (
			<div className="gg-body">
				<Header right={null} title={'书券充值'} path={this.props.route}/>
				<div className="g-main g-main-1">
					<div className="g-scroll m-mg-recharge">
						<ul className="pay-list f-clearfix f-mt-25" ref="balance_list">
							{
								price.map(function(v,i){
									return (<li className={"f-fl" + (this.state.price == v?' active':'')} key={i}><span className="count" data-price={v}>¥&nbsp;&nbsp;{v}书券</span></li>)
								}.bind(this))
							}
						</ul>
						<div className="u-userform">
							<a className="u-btn u-btn-full" onClick={this.gotoRecharge}>去充值</a>
						</div>
					</div>

				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports  = mRecharge;