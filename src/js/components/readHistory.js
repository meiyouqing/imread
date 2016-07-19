var Header = require('./header');

var readHistory = React.createClass({
	render: function() {
		var height =  document.body.offsetHeight - 44;
		return (
			<div className="gg-body">
				<Header right={null} />
				<iframe src={"iframe/readHistory.html?referer=3&user_id=" + GLOBAL.cookie('userId')} className="g-main" style={{height: height}}></iframe>
			</div>
		);
	}
});

module.exports = readHistory;