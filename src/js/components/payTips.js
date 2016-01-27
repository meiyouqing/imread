var PayTips = React.createClass({
	render: function() {
		return (
			<div className="m-paytip">
				<h3 className="tipTitle">温馨提示</h3>
				<ul>
					<li>仅支持中国移动用户，充值比例为1元=1艾豆</li>
					<li>艾豆支持艾美阅读书城的图书购买，除咪咕阅读</li>
					<li>支付过程中如遇到问题，请联系<a href="tel:4009679897">4009679897</a></li>
				</ul>
			</div>
		);
	}
});

module.exports = PayTips;