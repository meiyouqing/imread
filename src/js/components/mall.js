import parseQuery from '../modules/parseQuery'
import { browserHistory } from 'react-router'
import AJAX from '../modules/AJAX'
import GLOBAL from '../modules/global'
import React from 'react'
import Mixins from '../modules/mixins'
var Header = require('./header');
var MallNav = require('./mallNav');
var UserList = require('./userList');

var Mall = React.createClass({
	mixins: [Mixins()],
	getNav: function(){
		if(window.__PRELOADED_STATE__)
		AJAX.init('group.1');
		AJAX.get(this.ajaxHandle);
	},
	ajaxHandle:function(data){
		var subnav = 'page.'+data.pagelist[0].pgid+'.'+data.pagelist[0].blocks;
		this.setState({
			navList:data.pagelist
		});
		if(typeof window !== 'undefined') browserHistory.replace('/mall/'+subnav);	
	},
	gotoSearch: function(){
		browserHistory.push(GLOBAL.setHref('search/page.11.0.1'));
	},
	getInitialState: function(){
		return {
			navList: null,
			showUser:false,
			// onNotice: true
		}
	},
	hideUser: function(){
		this.setState({
			showUser:false
		})
	},
	showUser: function(){
		this.userFlag = true;
		this.setState({
			showUser:true
		})
	},
	getLastparam: function(){
		var param = location.pathname.split('/').pop();
		return param.indexOf('page')>=0;
	},
	//for the server rending
	componentWillMount:function(){
		this.usePreload('mallNav');
	},
	componentDidMount: function(){
		//if(GLOBAL.isRouter(this.props) && !this.hasPreload('mallNav')) this.getNav();
	},
	upApp: function(page){
		var obj = parseQuery(location.search);
		if(obj.action && obj.action==='openapp'){

			if(obj.book_id)
				browserHistory.replace(GLOBAL.setHref(page+'/book/introduce.'+obj.book_id+location.search));
			else if(obj.sheet_id){
				browserHistory.replace(GLOBAL.setHref(page+'/top/block.0/sheet/bookSheet.'+obj.sheet_id+location.search));
			}
		}
	},
	componentDidUpdate: function(nextProp,nextState){	
		// document.ontouchmove = function(e){
		// 	e.stopPropagation();
		// };
		//console.log(this.props)
		if(!this.state.navList) this.getNav();
		if(this.state.showUser) {
			if(!this.userFlag) this.hideUser();
			this.userFlag = false;
		}
	},
	shouldComponentUpdate: function(nextProp,nextState){
		return this.state.navList !== nextState.navList
				|| this.state.showUser !== nextState.showUser
				|| this.state.onNotice !== nextState.onNotice
				|| this.props.children !== nextProp.children
				|| this.props.params.subnav !== nextProp.params.subnav;
	},
	reload: function(){
		location.pathname = '/';
		window.location.reload();
	},

	render:function(){
		//console.log(this.props)
		var mallNav,userList;
		if(this.state.navList){
			mallNav = <MallNav navList={this.state.navList} />;
			userList = <UserList route={this.props.route} />;
		}

		var right = <div className="icon-s icon-menu right icon-m-r6" onClick={this.showUser} ></div>,
			middle = <a className="icon-s icon-searcher right" onClick={this.gotoSearch}></a>,
			left = <div className="i-logo" onClick={this.reload}></div>;
		// var notice = (<section className="safari">
						
		// 				<div className="notice-safari" onClick={this.closeNotice}></div><span>为确保最佳体验，请在"设置-Safari-阻止Cookie"中选择"始终允许"</span>
		// 			</section>)

		return (<div>

			<div className={"g-mall hide"}>
				<Header title="" left={left} right={right} middle={middle} path={this.props.route}/>
				{mallNav}
				<section className={"m-wrapper"+(this.state.showUser? ' show':'')} onClick={this.hideUser}></section>
				<section className={"m-user-list"+(this.state.showUser? ' show':'')}>
					{userList}
				</section>
				{this.props.children}
			</div></div>
			)
	}
})
module.exports = Mall;