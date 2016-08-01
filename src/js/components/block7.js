var Book1 = require('./book1');
var Block7 = React.createClass({
	shouldComponentUpdate: function(nextProps,nextState){
		return this.props.bookList !== nextProps.bookList;
	},
	render: function(){
		return (
			<ul className="u-pWrap">
			{	
				this.props.bookList.map(function(v,i){
					return (
						<Book1 key={i} data={v} />
					)
				}.bind(this))
			}
			</ul>
			);
	}
});
module.exports = Block7;