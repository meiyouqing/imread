var TopList = require('./topList');
var TopNav = require('./topNav');
// shouldComponentUpdate:function(){
// 	return this.props.topList !== nextProps.topList
// 			||this.props.part !== nextProps.part
// 			||this.props.navList !== nextProps.navList
// 			||this.props.scrollUpdate !== nextProps.scrollUpdate;
// },
var Top = React.createClass({
	render:function(){
		//console.log('top render');
		var topList;
		if(this.props.topList&&this.props.topList.length){
			topList = <TopList topList={this.props.topList} noMore={this.props.noMore} scrollHandle={this.props.scrollHandle} />;
		}else{
			topList = <Loading />
		}
		return (
			<div>
				<TopNav part={this.props.part} navList={this.props.navList}/>
				{topList}
			</div>
			)
	}
})
module.exports = Top;