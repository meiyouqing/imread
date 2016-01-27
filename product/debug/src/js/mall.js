var MallList = require('./mallList');
var MallNav = require('./mallNav');

var Mall = React.createClass({
	// shouldComponentUpdate:function(){
	// 	return false
	// },
	render:function(){
		var mallList;
		if(this.props.mallList&&this.props.mallList.length){
			mallList = <MallList mallList={this.props.mallList} noMore={this.props.noMore} scrollHandle={this.props.scrollHandle} />;
		}else{
			mallList = <Loading />
		}
		return (
			<div>
				<MallNav part={this.props.part} navList={this.props.navList}/>
				{mallList}
			</div>
			)
	}
})
module.exports = Mall;