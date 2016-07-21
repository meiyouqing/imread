import { Link } from 'react-router';
var Img = require('./img');

var Book1 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render: function() {
		//console.log(this.props.fromIntroduce)	

		if(this.props.fromIntroduce)
			var hrefStr = location.pathname.replace(/introduce.\d+/,'') + 'introduce.'+this.props.data.content_id;
		else
			var hrefStr = GLOBAL.typeHref(this.props.data,this.props.fromIntroduce ? "now" : '');
		return (
			<li className="u-book-1 f-clearfix">
				<Link to={hrefStr}>
					<Img src={this.props.data.image_url} />
					<div className="info">
						<span className="f-ellipsis-2 title">{this.props.data.name || this.props.data.book_name}</span>
						<span className="author">{this.props.data.author || this.props.data.author_name}</span>
						<span className="summary f-ellipsis-3">{this.props.data.brief}</span>
					</div>
				</Link>
			</li>
		);
	}
});

module.exports = Book1;