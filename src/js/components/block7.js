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
					var spm = this.props.spm.slice(0);
					spm.splice(-1,1,i+1);
					return (
						<Book4 spm={spm} key={i} data={v} />
					)
				}.bind(this))
			}
			</ul>
			);
	}
});
module.exports = Block7;