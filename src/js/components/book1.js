var Img = require('./img');

var Book1 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render: function() {
		//console.log(this.props.fromIntroduce)
		var hrefStr = Router.typeHref(this.props.data,this.props.spm,this.props.fromIntroduce ? "now" : '');
		return (
			<li className="u-book-1 f-clearfix">
				<a href={hrefStr}>
					<Img src={this.props.data.big_coverlogo || this.props.data.small_coverlogo} />
					<div className="info">
						<span className="f-ellipsis-2 title">{this.props.data.name || this.props.data.book_name}</span>
						<span className="author">{this.props.data.author || this.props.data.author_name}</span>
						<span className="summary f-ellipsis-3">{this.props.data.book_brief}</span>
					</div>
				</a>
			</li>
		);
	}
});

module.exports = Book1;