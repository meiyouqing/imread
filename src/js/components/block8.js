var Book1 = require('./book1');
var Block8 = React.createClass({
	shouldComponentUpdate: function(nextProps,nextState){
		return this.props.bookList !== nextProps.data;
	},
	render: function(){
		return (
			<ul className="u-pWrap">
			{	
				this.props.bookList.map(function(v,i){
					var spm = [Router.pgid, Router.parts[1], 1, i+1];
					return (
						<Book1 spm={spm} key={i} data={v} />
					)
				}.bind(this))
			}
			</ul>
			);
	}
});
module.exports = Block8;