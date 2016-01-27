var Blocklist = require('./blocklist');
var MallNav = require('./mallNav');

var Mall = React.createClass({
	mixins: [Mixins()],
	componentDidUpdate: function() {
		if(!this.props.mallList || !this.props.mallList.length){return;}
		this.lazyloadImage(this.refs.container);
		//console.log(this.scrollUpdate)
		if (Router.parts[2]==='1' && Router.name==='mall') {
			this.refs.container.scrollTop = 0;
		}
	},
	shouldComponentUpdate: function(nextProp,nextState){
		//console.log(this.props,nextProp)
		return this.props.noMore !== nextProp.noMore
				|| this.props.mallList !== nextProp.mallList
				|| this.props.part !== nextProp.part
				|| this.props.navList !== nextProp.navList;
	},
	render:function(){
		var mallList;
		var mallNav = Router.name==='mall'?
						<MallNav part={this.props.part} navList={this.props.navList}/>
						:null;
		var scrollLoading = <Loading cls="u-sLoading" />;
		if(this.props.noMore){
			scrollLoading = null;
		}
		if(!this.props.mallList){
			mallList = <Loading />
		}else{
			if(this.props.mallList.length){
				mallList = (
					<div className="g-main">
						<div className="g-scroll" onScroll={this.props.scrollHandle} ref="container">
							<Blocklist blockList={this.props.mallList} />
							{scrollLoading}
						</div>
					</div>
					);
			}else{
				mallList = (<div className="g-main"><NoData /></div>);
			}
		}
		return (
			<div>
				{mallNav}
				{mallList}
			</div>
			)
	}
})
module.exports = Mall;