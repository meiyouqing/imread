var Header = require('./header');
var Conpact = React.createClass({
	getDefaultProps: function() {
		return {
			height: document.body.offsetHeight - 44
		}
	},
	render: function() {
		return (
			<div className="gg-body">
				<Header title="用户协议" right={null} path={this.props.route}/>
				<iframe src="https://m.imread.com/iframe/compact.html" className="g-main" style={{height: this.props.height}}></iframe>
			</div>
		);
	}
});

module.exports = Conpact;