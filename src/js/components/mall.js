import NoData from './noData'
import Loading from './loading'
import parseQuery from '../modules/parseQuery'
import browserHistory from 'react-router/lib/browserHistory'
import AJAX from '../modules/AJAX'
import GLOBAL from '../modules/global'
import React from 'react'
import Mixins from '../modules/mixins'
var Header = require('./header');
var MallNav = require('./mallNav');
var UserList = require('./userList');
if(typeof window !== 'undefined'){
	var POP = require('../modules/confirm')
}

var Mall = React.createClass({
	mixins: [Mixins()],
	getNav: function(){
		AJAX.init('group.1');
		AJAX.get(this.ajaxHandle, this.getNavFaile);
	},
	ajaxHandle:function(data){
		this.subnav = 'page.'+data.pagelist[0].pgid;
		typeof window!=='undefined' && this.upApp(this.subnav);
		this.setState({
			navList:data.pagelist
		});
		if(typeof window === 'undefined') return;
		if(!/mall\/?$/.test(location.pathname)) return;
		browserHistory.replace('/mall/'+this.subnav);	
	},
	getNavFaile: function(){
		this.setState({onerror:true})
	},
	gotoSearch: function(){
		browserHistory.push(GLOBAL.setHref('search/page.11.0.1'));
	},
	getInitialState: function(){
		return {
			navList: null,
			showUser:false,
			onerror:false,
			path:'/'
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
			showUser:true,
			path:location.pathname
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
		if(/(\/|mall\/?|page\.\d+)$/.test(location.pathname)){
			if(!this.state.navList) this.getNav();
		}
	},
	upApp: function(page){
		var obj = parseQuery(location.search);
		if(obj.action && obj.action==='openapp'){
			var url = '/mall/';
			var search = this.isWx()? '':location.search;
			if(obj.book_id)
				browserHistory.replace(url+(page+'/book/introduce.'+obj.book_id + search));
			else if(obj.sheet_id){
				browserHistory.replace(url+(page+'/top/block.0/sheet/bookSheet.'+obj.sheet_id+search));
			}
		}
	},
	componentDidUpdate: function(nextProp,nextState){	
		if(!this.state.navList && /(\/|mall\/?|page\.\d+)$/.test(location.pathname)) this.getNav();
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
		const right = <div className="icon-s icon-menu right icon-m-r6" onClick={this.showUser} ></div>,
			middle = <a className="icon-s icon-searcher right" onClick={this.gotoSearch}></a>,
			left = <div className="i-logo" onClick={this.reload}></div>;
		let main = (
				<div className="g-mall" style={{top:0}}>
					<MallNav navList={this.state.navList || []} />
					<section className={"m-wrapper"+(this.state.showUser? ' show':'')} onClick={this.hideUser}></section>
					<section className={"m-user-list"+(this.state.showUser? ' show':'')}>
						<UserList route={this.props.route} path={this.state.path} />
					</section>
					{this.props.children}
				</div>
			)
		if(this.state.onerror){									
			main = <div className="g-main"><NoData type="UFO" /></div>;
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