import GLOBAL from '../modules/global'
import Mixins from '../modules/mixins'
import React from 'react'
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
				<Header right={null} path={this.props.route} title="我的成就"/>
				<iframe src={"/iframe/readHistory.html?referer=3&user_id=" + GLOBAL.cookie('userId')} className="g-main" style={{height: this.state.height}}></iframe>
			</div>
		);
	}
});

module.exports = readHistory;