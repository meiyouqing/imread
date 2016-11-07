import { browserHistory } from 'react-router'
import GLOBAL from '../modules/global'
import React from 'react'
import parseQuery from '../modules/parseQuery';

var Header = React.createClass({
	getDefaultProps: function(){
		var sHandle = function(e){
			browserHistory.push(GLOBAL.setHref('search/page.11.0.1'));
		};
		var gotoZy = function(){
			browserHistory.push('/mall');
		};

		return {
			middle:<a className="icon-s icon-bookstore right" onClick={gotoZy}></a>,
			right:<a className="icon-s icon-searcher f-fr" onClick={sHandle}></a>,
			title: GLOBAL.title || '艾美阅读'
		};
	},
	// goBack: function(){
	// 	GLOBAL.goBack(this.path);
	// },
	// componentDidMount: function(){
	// 	this.path = this.props.path.path.replace(/:([^\"]*)/,'');
	// 	this.path = window.location.pathname.split('/'+this.path)[0];
	// },
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.title !== nextProps.title 
				|| this.props.left !== nextProps.left 
				|| this.props.right !== nextProps.right
				|| this.props.middle !== nextProps.middle;
	},
	render: function(){
		// var from = parseQuery(location.search);
		// var isskip = false;
		var defaultLeft = this.props.left === undefined?<a className="f-fl icon-back iconfont" onClick={this.goBack} ></a>:this.props.left;

		// if(this.props.skipurl && from.skipurl)
		// 	isskip = true;


		return (
			<header className="m-bar m-bar-head m-p">
				{defaultLeft}
				{this.props.right}
				{this.props.middle}
				<h1 className="title">{this.props.title}</h1>
			</header>
		);
	}
});

module.exports  = Header;