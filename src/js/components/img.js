var Img = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.src !== nextProps.src;
	},
	render: function() {
		return <img src="/src/img/back/book_default_back.png" data-lazyload-src={this.props.src} className="u-lazyload-img" />
	}
});

module.exports  = Img;