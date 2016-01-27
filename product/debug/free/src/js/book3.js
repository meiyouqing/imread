
var Book3 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render: function() {
		var bid = this.props.data.content_id;
		var hrefStr = Router.setHref('introduce&introduce.'+bid);
		return (
			<li className="u-book-3">
				<a href={hrefStr}>
					<div>
						<span className="title">{this.props.data.name}</span>
						<span className="author">{this.props.data.author}</span>
						<span className="bookState">{'/'+(this.props.data.status == '0' ? '连载' : '完本')}</span>
					</div>
					<div className="summary f-ellipsis-2">{this.props.data.book_brief}</div>
				</a>
			</li>
		);
	}
});

module.exports = Book3;