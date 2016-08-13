var Header = require('./header');

var readHistory = React.createClass({
	mixins: [Mixins()],
	getInitialState: function() {
		return {
			height: '100%'
		}
	},
	componentDidMount: function() {
		this.checkLogin(this.props.route);
		this.setState({
			height:document.body.offsetHeight - 44
		})
	},
	render: function() {
		return (
			<div className="gg-body">
				<Header right={null} path={this.props.route}/>
				<iframe src={"http://m.imread.com/iframe/readHistory.html?referer=3&user_id=" + GLOBAL.cookie('userId')} className="g-main" style={{height: this.state.height}}></iframe>
			</div>
		);
	}
});

module.exports = readHistory;