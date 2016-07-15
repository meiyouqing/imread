import { Link } from 'react-router';
var Img = require('./img');

var Book6 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render: function() {
		var hrefStr = GLOBAL.typeHref(this.props.data);
		if(!this.props.noImage){
			var img = <Img src={this.props.data.big_coverlogo || this.props.data.small_coverlogo || this.props.data.image_url}/>
		} 
		return (
			<li className="u-book-6">
				<Link to={hrefStr}>
					{img}
					<span className="f-ellipsis">{this.props.data.name + (this.props.data.count ? ' ' + this.props.data.count : '')}</span>
				</Link>
			</li>
		);
	}
});

module.exports = Book6;