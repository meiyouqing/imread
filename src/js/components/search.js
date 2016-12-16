import NoData from './noData'
import Loading from './loading'
import Ajax from '../modules/AJAX'
import GLOBAL from '../modules/global'
import React from 'react'
import Mixins from '../modules/mixins'

var Header_s = require('./header_s');
var Blocklist = require('./blocklist');

var Search = React.createClass({
	mixins:[Mixins()],
	getInitialState:function(){
		return {
			blockList:null,
			UFO:false
		}
	},
	getDate: function(){
		if(!this.isMounted()) return;
		const AJAX = new Ajax(this.props.params.searchId);
		AJAX.get(this.ajaxHandle, function(error){
			this.setState({
				UFO:true
			});
				//console.log(error);
		}.bind(this))
	},
	ajaxHandle:function(data){
		this.setState({
			blockList:data.blocklist
		})
	},
	componentWillMount:function(){
		this.usePreload(this.props.params.searchId);
	},
	componentDidMount:function(){
		if(GLOBAL.isRouter(this.props) && !this.state.blockList) this.getDate();

	},
	componentDidUpdate: function(){
		GLOBAL.isAd();
		if(GLOBAL.isRouter(this.props) && !this.state.blockList) this.getDate();
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
			//if(GLOBAL.isRouter(this.props))	//兼容低端安卓
				content = <Loading />;
		}
		if(this.state.UFO){
			content = <NoData type="UFO" />;
		}
		return (
			<div className="gg-body">
				<Header_s  route={this.props.route} from='search' />
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