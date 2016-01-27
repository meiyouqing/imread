var Img = require('./img');

var Book2 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render: function() {
		var bid = this.props.data.content_id;
		var hrefStr = Router.setHref('introduce&introduce.'+bid);
		return (
			<li className="u-book-2">
				<a href={hrefStr}>
					<Img src={this.props.data.big_coverlogo} />
					<span className="f-ellipsis">{this.props.data.name}</span>
				</a>
			</li>
		);
	}
});

module.exports = Book2;