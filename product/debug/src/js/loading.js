;

var Loading = React.createClass({
	getDefaultProps: function(){
		return {
			cls: 'u-loading',
			text: '努力加载中..'
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.cls !== nextProps.cls
				|| this.props.content !== nextProps.content;
	},
	render: function(){
		//console.log(this.props.cls)
		var cls1 = '';
		if((typeof document.body.style.transform !== 'undefined' && typeof document.body.style.animation !== 'undefined')||(typeof document.body.style['-webkit-transform'] !== 'undefined' && typeof document.body.style['-webkit-animation'] !== 'undefined')){
			cls1 = 'u-moving-ball';
		}
		return (
			<div className={this.props.cls}>
				<div className={cls1}><i className="ball-1"></i><i className="ball-2"></i></div>
				<i>{this.props.text}</i>
			</div>
			);
	}
});

module.exports  = Loading;