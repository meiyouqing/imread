
var Header_s = require('./header_s');
var Blocklist = require('./blocklist');

var Search = React.createClass({
	getInitialState:function(){
		return {
			blockList:null,
			UFO:false
		}
	},
	componentDidMount:function(){
		AJAX.get(function(data){
			this.setState({
				blockList:data.blocklist
			})
		}.bind(this), function(error){
			this.setState({
				UFO:true
			});
			//console.log(error);
		}.bind(this))
	},
	shouldComponentUpdate: function(nextPros, nextState) {
		return this.state.blockList !== nextState.blockList
				|| this.state.UFO !== nextState.UFO;
	},
	render: function(){
		var content;
		if(this.state.blockList){
			if(this.state.blockList.length){
				content = <Blocklist blockList={this.state.blockList} />;
			}else{
				content = <NoData />;
			}
		}else{
			content = <Loading />;
		}
		if(this.state.UFO){
			content = <NoData type="UFO" />;
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