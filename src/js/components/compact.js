import React from 'react'
var Header = require('./header');
var Conpact = React.createClass({
	getInitialState: function(){
		return {height:600}
	},
	componentDidMount: function(){
		const height = document.body.offsetHeight - 44;
		this.setState({height})
	},
	render: function() {
		return (
			<div className="gg-body">
				<Header title="用户协议" right={null} path={this.props.route}/>
				<iframe src="/iframe/compact.html" className="g-main" style={{height: this.state.height}}></iframe>
			</div>
		);
	}
});

module.exports = Conpact;