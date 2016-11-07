import React from 'react'
var Loading = React.createClass({
	getDefaultProps: function(){
		return {
			cls: 'u-loading',
			text: '努力加载中..'
		}
	},
	getInitialState:function(){
		return {
			cls:''
		}
	},
	componentDidMount:function(){
		if((typeof document.body.style.transform !== 'undefined' && typeof document.body.style.animation !== 'undefined')||(typeof document.body.style['-webkit-transform'] !== 'undefined' && typeof document.body.style['-webkit-animation'] !== 'undefined')){
			this.setState({
				cls : 'u-moving-ball'
			});
		}
	},
	// shouldComponentUpdate: function(nextProps, nextState) {
	// 	return this.props.cls !== nextProps.cls
	// 			|| this.props.content !== nextProps.content;
	// },
	render: function(){
		return (
			<div className={this.props.cls}>
				<div className={this.state.cls}><i className="ball-2"></i></div>
				<i>{this.props.text}</i>
			</div>
			);
	}
});

module.exports  = Loading;