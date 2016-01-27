;
var Img = require('./img');

var Book6 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render: function() {
		var hrefStr = Router.setHref('category&category.'+this.props.data.content_id+'.1.10');
		if(!this.props.noImage){
			var img = <Img src={this.props.data.image_url}/>
		} 
		return (
			<li className="u-book-6">
				<a href={hrefStr}>
					{img}
					<span className="f-ellipsis">{this.props.data.name + (this.props.data.count ? ' ' + this.props.data.count : '')}</span>
				</a>
			</li>
		);
	}
});

module.exports = Book6;