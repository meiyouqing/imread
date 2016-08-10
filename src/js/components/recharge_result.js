var Header = require('./header');
// if(false&&typeof window !== 'undefined'){
// 	require('../../css/pay.css');
// }

var RechageRes = React.createClass({
	completed: function(){
		console.log(myEvent.callback)
		if(myEvent.callback.recharge){
			myEvent.execCallback('recharge');		
		}else{
			myEvent.execCallback('rechargeDef');		
		}
	},
	render: function() {
		var data = this.props.data;
		data.time = new Date().Format('yyyy-MM-dd hh:mm:ss');
		var title,note,content;
		if(data.code===200){
			title = '充值成功';
			note = '若您收到来自运营商的扣费短信，即为本商品支付成功通知。如有疑问，请致电客服：4009679897';
			content = (		
					<table className="result-suc f-fc-777" border="0" cellSpacing="0" cellPadding="0" width="100%"><tbody>
						<tr><td width="100">充值艾豆</td><td className="f-tr" >{data.aidou}艾豆</td></tr>
						<tr><td width="100">充值金额</td><td className="f-tr" >{data.sum}元</td></tr>
						<tr><td width="100">充值时间</td><td className="f-tr" >{data.time}</td></tr>
						<tr><td width="100">支付号码</td><td className="f-tr" >{data.phone}</td></tr>
					</tbody></table>
					);
		}else{
			title = '充值失败';
			note = '未能成功支付，建议您重新购买。如有疑问，请记录返回码后，请致电客服：4009679897';
			content = (		
					<div className="f-clearfix result-fail">
						<span className="f-fl f-mr-10">返回码</span><span className="f-fl">{data.code}</span><button className="f-fr u-btn" onClick={GLOBAL.goBack()}>更换号码充值</button>
					</div>
					);
		}
		return (
			<div>
				<Header right={null} />
				<div className="g-main g-main-1">
					<div className="g-scroll m-recharge">
						<div className="f-p-15 f-bg-fff">
							<h2 className="title">{title}</h2>
							{content}
						</div>
						<div className="f-p-15">
							<p className="result-note f-fc-777">{note}</p>
							<button className="u-btn u-btn-full" onClick={this.completed}>完成</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports  = RechageRes;