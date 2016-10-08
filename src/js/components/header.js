import myEvent from '../modules/myEvent'
import { browserHistory } from 'react-router'
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
			right:<a className="icon-s icon-searcher f-fr" onClick={sHandle}></a>,
			title: GLOBAL.title || '艾美阅读'
		};
	},
	goBack: function(){
		GLOBAL.goBack(this.path);
		if(this.props.page==='tag'){
			myEvent.execCallback('updateGuess');
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.title !== nextProps.title 
				|| this.props.left !== nextProps.left 
				|| this.props.right !== nextProps.right;
	},
	getInitialState:function(){
		return {
			skipurl:''
		}
	},
	componentDidMount:function(){
		this.path = this.props.path.path.replace(/:([^\"]*)/,'');
		this.path = window.location.pathname.split('/'+this.path)[0];

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
					this.state.isskip?
					<a className="f-fl icon-back iconfont" href={this.state.skipurl}></a>:
					(this.props.left?this.props.left:<a className="f-fl icon-back icon-s" onClick={this.goBack}></a>)
				}
				{this.props.right}
				{this.props.middle}
				<h1 className="title">{this.props.title}</h1>
			</header>
		);
	}
});

module.exports  = Header;