var Img = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.src !== nextProps.src;
	},
	render: function() {
		const src = this.props.src.replace(/^http\:\/\//,'https://');
		return <img src="/src/img/back/book_default_back.png" data-lazyload-src={src} className="u-lazyload-img" />
	}
});

module.exports  = Img;