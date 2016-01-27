;

var NoData = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return false;
	},
	render: function(){
		return (<i className="u-noData">额偶，没有找到相关数据</i>);
	}
});

module.exports  = NoData;