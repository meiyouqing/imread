
var Book5 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render: function() {
		var hrefStr = Router.typeHref(this.props.data,this.props.spm);
		var topCls = '';
		var topNum = this.props.data.locate;
		switch(topNum){
			case 1:
				topCls=" NO1";
				break;
			case 2:
				topCls=" NO2";
				break;
			case 3:
				topCls=" NO3";
				break;	
			default:
				topNum='';
				break;			
		}
		return (
			<li className="u-book-5">
				<a href={hrefStr}>
					<span className={"topNb"+topCls}>{topNum}</span>
					<span className="f-ellipsis f-ellipsis-ib">{this.props.data.name}</span>
				</a>
			</li>
		);
	}
});

module.exports = Book5;