var Header = require('./header');
var Recharge = require('./recharge');
import Ajax from '../modules/AJAX'
import Mixins from '../modules/mixins'
import React from 'react'
import Loading from './loading'
import parseQuery from '../modules/parseQuery'

if(typeof window !== 'undefined'){
	require('../../css/pay.css')
}
var Balance = React.createClass({
	mixins: [Mixins()],
	getBalance:function(){
		const AJAX = new Ajax('alyPay')
		AJAX.go({
			productId:this.search.productId,
			payType:4,
			callback:encodeURIComponent(this.search.callback)
		},data=>{
			// console.log(data)
			this.setState({html: data});
			setTimeout(function(){
				document.forms[0].submit();
			},1000)
		},null,{isText:true})
	},
	getInitialState: function() {
		return {
			html: null,
			loading: true
		};
	},
	componentDidMount: function() {
		this.search = parseQuery(location.search);
		this.getBalance()
	},
	shouldComponentUpdate: function(nextPros, nextState) {
		return nextState.html != this.state.html
		|| nextState.loading != this.state.loading;			   
	},
	render: function () {
		
		var content = (<div dangerouslySetInnerHTML={{__html: this.state.html}}></div>);

		return (
			<div className="gg-body">
				<Header right={false} left={this.state.back} title={'艾豆充值'} path={this.props.route}/>
				<div className="g-main g-main-1">
					<div className="g-scroll m-balance">
						<Loading />
						{content}
					</div>
				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports = Balance;