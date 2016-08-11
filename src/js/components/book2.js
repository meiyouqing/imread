import { Link } from 'react-router';
var Img = require('./img');
var Book2 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render: function() {
		var hrefStr = GLOBAL.typeHref(this.props.data);
		return (
			<li className="u-book-2">
				<Link to={hrefStr}>
					<Img src={this.props.data.image_url} />
					<span className="f-ellipsis-2">{this.props.data.name}</span>
					<span className="f-ellipsis author">{this.props.data.author}</span>
				</Link>
			</li>
		);
	}
});

module.exports = Book2;