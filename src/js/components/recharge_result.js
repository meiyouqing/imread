var Header = require('./header');
// if(false&&typeof window !== 'undefined'){
// 	require('../../css/pay.css');
// }

var RechageRes = React.createClass({
	getInitialState: function() {
		return {
			success: null
		};
	},
	completed: function(){
		console.log(myEvent.callback)
		if(myEvent.callback.recharge){
			myEvent.execCallback('recharge');		
		}else{
			myEvent.execCallback('rechargeDef');		
		}
	},
	success: function(){
		console.log('成功');
		this.setState({success: true,status: '充值成功'});
	},
	failed: function(){
		console.log('失败');
		this.setState({success: false,status: '充值失败'});
	},
	checkCharge: function(){
		console.log(localStorage.recharge)
		var params = localStorage.recharge?JSON.parse(localStorage.recharge):GLOBAL.orderLIst;
		AJAX.go('payCheck',params,function(data){
			if(data.code === 200)
				switch(data.status){
					case 1: 
						this.checkCharge();
						break;
					case 2: 
						this.success();
						break;
					default:
						this.failed();
				}
		}.bind(this));
	},
	componentDidMount: function(){
		this.checkCharge();
	},
	render: function() {
		 var right = < button className = "f-fr textBtn" onClick = { GLOBAL.goBack } > 完成 < /button>;
		 var list;
		 console.log(this.state.success)

		 if(this.state.success == null)
		 	list = <Loading />;
		 else if(this.state.success === true) {
		 	list = (
		 			<div className="m-recharge-result">
		 				<div className="m-result-status">
		 					<span className="m-result-icon-s"></span>
		 					<span className="m-result-icon">{this.state.status}</span>
		 				</div>
		 				<div className="m-result-detail">
			 				<p><span>充值数目</span><span className="m-s">2艾豆</span></p>
			 				<p><span>充值数目</span><span className="m-s">2艾豆</span></p>
			 				<p><span>充值数目</span><span className="m-s">2艾豆</span></p>
			 			</div>
		 			</div>
		 		)
		 } else {
		 	list = (
		 			<div className="m-recharge-result">
		 				<div className="m-result-status">
		 					<span className="m-result-icon-f"></span>
		 					<span className="m-result-icon">{this.state.status}</span>
		 				</div>
		 				<div className="m-result-detail-f">
			 				如遇支付问题请联系<a href="tel:4009679897">400-967-9897</a>
			 			</div>
		 			</div>
		 		)
		 }
		return (
			<div>
				<Header right={right} left={null} title={'充值结果'} path={this.props.route}/>
				<div className="g-main g-main-1 g-f">
					{list}
				</div>
			</div>
				)
	}
});

module.exports  = RechageRes;