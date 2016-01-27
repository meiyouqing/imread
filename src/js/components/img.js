var Img = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.src !== nextProps.src;
	},
	render: function() {
		return <img src="src/img/defaultCover.png" ref="img" data-lazyload-src={this.props.src} />
	}
});

module.exports  = Img;