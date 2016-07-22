var Img = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.src !== nextProps.src;
	},
	render: function() {
		return <img src="http://m.imread.com/src/img/defaultCover.png" data-lazyload-src={this.props.src} className="u-lazyload-img" />
	}
});

module.exports  = Img;