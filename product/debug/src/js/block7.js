var Book4 = require('./book4');
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
						<Book4 key={i} data={v} />
					)
				})
			}
			</ul>
			);
	}
});
module.exports = Block7;