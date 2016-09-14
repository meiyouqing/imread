
var Header_s = require('./header_s');
var Blocklist = require('./blocklist');

var Search = React.createClass({
	getInitialState:function(){
		return {
			blockList:null,
			UFO:false
		}
	},
	getDate: function(){
		AJAX.init(this.props.params.searchId);
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
	componentDidMount:function(){

		if(GLOBAL.isRouter(this.props))	this.getDate();
	},
	componentDidUpdate: function(){
		if(GLOBAL.isRouter(this.props) && !this.state.blockList) 	this.getDate();		
	},
	shouldComponentUpdate: function(nextPros, nextState) {
		return this.state.blockList !== nextState.blockList
				|| this.state.UFO !== nextState.UFO
				|| this.props.children !== nextPros.children;
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
			if(GLOBAL.isRouter(this.props))	//兼容低端安卓
				content = <Loading />;
		}
		if(this.state.UFO){
			content = <NoData type="UFO" />;
		}
		return (
			<div className="gg-body">
				<Header_s  route={this.props.route}  />
				<div  className="g-main g-main-1">
					<div className="g-scroll">
						{content}
					</div>
				</div>
				{this.props.children}
			</div>
			);
	}
});

module.exports  = Search;