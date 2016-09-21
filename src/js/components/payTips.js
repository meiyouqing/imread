import React from 'react'
var PayTips = React.createClass({
	render: function() {
		return (
			<div className="m-paytip">
				<h3 className="tipTitle">温馨提示</h3>
				<ul>
					<li>话费充值暂不支持电信用户</li>
					<li>艾豆暂不支持购买咪咕书籍</li>
					<li>如遇支付问题请联系<a href="tel:4009679897">400-967-9897</a></li>
				</ul>
			</div>
		);
	}
});

module.exports = PayTips;