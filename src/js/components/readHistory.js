var Header = require('./header');

var readHistory = React.createClass({
	getDefaultProps: function() {
		return {
			height: document.body.offsetHeight - 44
		}
	},
	render: function() {
		return (
			<div>
				<Header right={null} />
				<iframe src={"iframe/readHistory.html?referer=3&user_id=" + GLOBAL.cookie('userId')} className="g-main" style={{height: this.props.height}}></iframe>
			</div>
		);
	}
});

module.exports = readHistory;