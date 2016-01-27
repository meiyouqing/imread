
var Book5 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render: function() {
		var hrefStr = Router.setHref('introduce&introduce.'+this.props.data.content_id);
		var topCls = '';
		switch(this.props.data.locate){
			case 1:
				topCls=" NO1";
				break;
			case 2:
				topCls=" NO2";
				break;
			case 3:
				topCls=" NO3";
				break;				
		}
		return (
			<li className="u-book-5">
				<a href={hrefStr}>
					<span className={"topNb"+topCls}>{this.props.data.locate}</span>
					<span className="f-ellipsis f-ellipsis-ib">{this.props.data.name}</span>
				</a>
			</li>
		);
	}
});

module.exports = Book5;