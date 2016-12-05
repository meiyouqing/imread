import myEvent from '../modules/myEvent'
import browserHistory from 'react-router/lib/browserHistory'
import GLOBAL from '../modules/global'
import React from 'react'
import parseQuery from '../modules/parseQuery';

var Header = React.createClass({
	getDefaultProps: function(){
		var sHandle = function(e){
			browserHistory.push(GLOBAL.setHref('search/page.11.0.1'));
		};


		// browserHistory.listen(function(nextHistory){
		// 	var arr = nextHistory.pathname.split('/');
		// 	var path = arr.pop();
		// 	if(path.indexOf('.')>=0)	path = arr.pop();

		// 	GLOBAL.historyPath = nextHistory.pathname.split('/'+path)[0];

		// 	if(nextHistory.action == 'POP'){
		// 		if(!GLOBAL.state)  return;
		// 		GLOBAL.state--;
		// 	} else if(nextHistory.action == 'PUSH'){
		// 		GLOBAL.state++;
		// 	} else {
		// 		console.log('replace')
		// 	}
		// });

		return {
			right:<a className="iconfont icon-sousuo f-fr" onClick={sHandle}></a>,
			title: GLOBAL.title || '艾美阅读'
		};
	},
	goBack: function(){
		this.getBacks();
		var search = parseQuery(location.search);
		if(search.skipurl)	{
			location.href = search.skipurl;
			return;
		}
		var current = GLOBAL.pushLinks[location.pathname];
		if(current) {
			GLOBAL.pushLinks[location.pathname] = null;
			browserHistory.push(current);
			return;
		}
		GLOBAL.goBack(this.path);
		if(this.props.page==='tag'){
			myEvent.execCallback('updateGuess');
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {

		return this.props.title !== nextProps.title 
				|| this.props.left !== nextProps.left 
				|| this.state.skipurl !== nextState.skipurl 
				|| this.props.right !== nextProps.right;
	},
	getInitialState:function(){
		return {
			skipurl:''
		}
	},
	getBacks: function(){
		var route = this.props.path.path.replace(/:([^\"]*)/,'');
		var arrs = window.location.pathname.split('/'+route);
		if(arrs.length>2){
			this.path = arrs[0];
			for(var i=1;i<arrs.length-1;i++){
				this.path+='/'+route+arrs[i]
			}
		} else{
			this.path = arrs[0];
		}
		return this.path;
	},
	componentDidMount:function(){
		this.getBacks();

		if(this.props.path.path.split('/')[1] == 'self')
			this.path = '/mall';

		var from = parseQuery(location.search);

		if(this.props.skipurl && from.skipurl){
			this.setState({
				skipurl:from.skipurl
			})
		}			
	},
	render: function(){

		return (
			<header className="m-bar m-bar-head">
				{
					this.state.skipurl?
					<a className="f-fl icon-left iconfont" href={this.state.skipurl}></a>:
					(this.props.left?this.props.left:<a className="f-fl iconfont icon-left" onClick={this.goBack}></a>)
				}
				{this.props.right}
				{this.props.middle}
				<h1 className="title">{this.props.title}</h1>
			</header>
		);
	}
});

module.exports  = Header;