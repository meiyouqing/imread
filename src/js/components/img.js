var Img = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.src !== nextProps.src;
	},
	render: function() {
		return <img src={this.props.newType?'https://m.imread.com/src/img/back/ad_default_back.jpg':"https://m.imread.com/src/img/back/book_default_back.png"} data-lazyload-src={this.props.src} className="u-lazyload-img" />
	}
});

module.exports  = Img;