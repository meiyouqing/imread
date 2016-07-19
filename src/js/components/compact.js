var Header = require('./header');
var Conpact = React.createClass({
	render: function() {
		var height = document.body.offsetHeight - 44;
		return (
			<div>
				<Header title="用户协议" right={null} />
				<iframe src="iframe/compact.html" className="g-main" style={{height: height}}></iframe>
			</div>
		);
	}
});

module.exports = Conpact;