import NoData from './noData'
import Loading from './loading'
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
		AJAX.init('group.1');
		AJAX.get(this.ajaxHandle, this.getNavFaile);
	},
	ajaxHandle:function(data){
		this.subnav = 'page.'+data.pagelist[0].pgid;
		this.setState({
			navList:data.pagelist
		});
		if(typeof window === 'undefined') return;
		if(!/mall\/?$/.test(location.pathname)) return;
		browserHistory.replace('/mall/'+this.subnav);	
	},
	getNavFaile: function(){
		console.log('getInitialState')
		this.setState({onerror:true})
	},
	gotoSearch: function(){
		browserHistory.push(GLOBAL.setHref('search/page.11.0.1'));
	},
	getInitialState: function(){
		return {
			navList: null,
			showUser:false,
			onerror:false
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
	//for the server rending
	componentWillMount:function(){
		this.usePreload('mallNav');
	},
	componentDidMount: function(){
		document.ontouchmove = function(e){
			e.stopPropagation();
		};
		if(!this.state.navList) this.getNav();
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
		if(!this.state.navList) this.getNav();
		if(this.state.showUser) {
			if(!this.userFlag) this.hideUser();
			this.userFlag = false;
		}
		if(!/page\.\d/.test(location.pathname) && !!this.state.navList && this.subnav){
			browserHistory.replace('/mall/'+this.subnav);	
		}
	},
	shouldComponentUpdate: function(nextProp,nextState){
		return this.state.navList !== nextState.navList
				|| this.state.showUser !== nextState.showUser
				|| this.state.onerror !== nextState.onerror
				|| this.props.children !== nextProp.children
				|| this.props.params.subnav !== nextProp.params.subnav;
	},
	reload: function(){
		location.pathname = '/';
		window.location.reload();
	},

	render:function(){
		//console.log(this.props)
		var right = <div className="icon-s icon-menu right icon-m-r6" onClick={this.showUser} ></div>,
			middle = <a className="icon-s icon-searcher right" onClick={this.gotoSearch}></a>,
			left = <div className="i-logo" onClick={this.reload}></div>;
		var main;
		if(this.state.navList){
			main = (
				<div className="g-mall" style={{top:0}}>
					<MallNav navList={this.state.navList} />
					<section className={"m-wrapper"+(this.state.showUser? ' show':'')} onClick={this.hideUser}></section>
					<section className={"m-user-list"+(this.state.showUser? ' show':'')}>
						<UserList route={this.props.route} />
					</section>
					{this.props.children}
				</div>
			)
		}else if(this.state.onerror){									
			main = <div className="g-main"><NoData type="UFO" /></div>;
		}else{
			main = <div className="g-main"><Loading /></div>;
		}

		return (
			<div>
				<Header title="" left={left} right={right} middle={middle} path={this.props.route}/>
				{main}
			</div>
			)
	}
})
module.exports = Mall;