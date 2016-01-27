var Header = require('./header');
var Conpact = React.createClass({
	getDefaultProps: function() {
		return {
			height: document.body.offsetHeight - 44
		}
	},
	render: function() {
		return (
			<div>
				<Header title="用户协议" right={null} />
				<iframe src="iframe/compact.html" className="g-main" style={{height: this.props.height}}></iframe>
			</div>
		);
	}
});

module.exports = Conpact;