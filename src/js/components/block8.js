var Book1 = require('./book1');
var Block8 = React.createClass({
	shouldComponentUpdate: function(nextProps,nextState){
		return this.props.bookList !== nextProps.data;
	},
	render: function(){
		console.log(this.props)
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
module.exports = Block8;