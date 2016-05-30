;
var Img = require('./img');
var Stars = require('./stars');

var Book4 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render: function() {
		var hrefStr = Router.typeHref(this.props.data,this.props.spm);
		return (
			<li className="u-book-1 f-clearfix">
				<a href={hrefStr}>
					<Img src={this.props.data.big_coverlogo || this.props.data.small_coverlogo} />
					<div className="info">
						<span className="f-ellipsis title">{this.props.data.name}</span>
						<span className="author">{this.props.data.author}</span>
						<span className="bookStar"><Stars score={this.props.data.score} /></span>
						<span className="summary f-ellipsis-3">{this.props.data.book_brief}</span>
					</div>
				</a>
			</li>
		);
	}
});

module.exports = Book4;