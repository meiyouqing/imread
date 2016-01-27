var isAndroid = function() {
	return /android|linux/i.test(navigator.userAgent);
};

var isWeiXin = function() {
	return /MicroMessenger/i.test(navigator.userAgent);
};

var downloadTip = React.createClass({
	render: function() {
		var target = isWeiXin() ? '_blank' : 'download';
		if (isAndroid()) {
			return (
				<div className={"m-download f-clearfix" + (this.props.hide ? ' f-hide' : '')}>
					<a className="d-btn f-fr" target={target} href="http://www.imread.com/download.html">立即下载</a>
					<div className="logo f-fl">
						<img src="src/img/logo.png" width="48" />
					</div>
					<div className="d-title">
						<h2 className="title">更多免费好书</h2>
						<h3 className="desc">尽在手机客户端</h3>
					</div>
				</div>
			);
		} else {
			return (<div></div>);
		}
	}
});

module.exports = downloadTip;