
var Header_s = require('./header_s');
var Blocklist = require('./blocklist');

var Search = React.createClass({
	getInitialState:function(){
		return {
			blockList:null
		}
	},
	componentDidMount:function(){
		Router.get(function(data){
			this.setState({
				blockList:data.blocklist
			})
		}.bind(this))
	},
	shouldComponentUpdate: function(nextPros, nextState) {
		return this.state.blockList !== nextState.blockList;
	},
	render: function(){
		var content;
		if(this.state.blockList){
			content = <NoData />
			if(this.state.blockList.length){
				content = <Blocklist blockList={this.state.blockList} />
			}
		}else{
			content = <Loading />
		}
		return (
			<div>
				<Header_s />
				<div  className="g-main g-main-1">
					<div className="g-scroll">
						{content}
					</div>
				</div>
			</div>
			);
	}
});

module.exports  = Search;