var Img = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.src !== nextProps.src;
	},
	render: function() {
		return <img src={this.props.newType?'http://m.imread.com/src/img/back/ad_default_back.jpg':"http://m.imread.com/src/img/defaultCover.png"} data-lazyload-src={this.props.src} className="u-lazyload-img" />
	}
});

module.exports  = Img;