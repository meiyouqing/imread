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
		var config_id = (localStorage.viewed == undefined) ?1: localStorage.viewed;
		AJAX.go('group',{
			group_id: '1',
			config_id: config_id
		},this.ajaxHandle, this.getNavFaile);
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
			path:'/',
			firstTime: true,
			selected: 0,
			show: false
		}
	},
	listId: [1,2,3,0],
	chooseFavor: function(i){
		this.id = this.listId[i];
		this.setState({selected: i})
	},
	gotoMall: function(){
		this.refs.selector.style.opacity = 0;
		this.id = this.id===undefined?1:this.id;
		localStorage.viewed = this.id;

		AJAX.go('setConfig',{config_id:3,config_value:this.id},function(res){
			if(res.code === 200)
				setTimeout(function(){
					this.setState({firstTime: false});
					this.getNav();
				}.bind(this),800);
		}.bind(this));

		// setTimeout(function(){
		// 	this.setState({firstTime: false});
		// 	this.getNav();
		// }.bind(this),500);
		
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
		try{
			localStorage.agent_model = "private";
			this.setState({firstTime: localStorage.viewed?false:true,show: true})
		}catch(e){
			this.setState({firstTime: false,show: true})
		}

		document.ontouchmove = function(e){
			e.stopPropagation();
		};
		if(/(\/|mall\/?|page\.\d+)$/.test(location.pathname)){
			if(!this.state.navList) this.getNav();
		}

		document.addEventListener('resetMall',this.getNav);	
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
	componentWillUnmount: function(){
		 document.removeEventListener('resetMall',this.getNav,false);
	},
	shouldComponentUpdate: function(nextProp,nextState){
		return this.state.navList !== nextState.navList
				|| this.state.showUser !== nextState.showUser
				|| this.state.onerror !== nextState.onerror
				|| this.props.children !== nextProp.children
				|| this.props.params.subnav !== nextProp.params.subnav
				|| this.state.firstTime !== nextState.firstTime
				|| this.state.selected !== nextState.selected
				|| this.state.show !== nextState.show;
	},
	reload: function(){
		location.pathname = '/';
		window.location.reload();
	},

	render:function(){

		const right = <div className="iconfont icon-menu f-fr icon-s" onClick={this.showUser} ></div>,
			middle = <a className="iconfont icon-sousuo f-fr icon-s" onClick={this.gotoSearch}></a>,
			left = <div className="i-logo" onClick={this.reload}></div>;
		let main ;

		if(this.state.firstTime){
			main = (
				<div>
					<div className="g-main g-main-4">
						<div className="m-welcome g-scroll" ref="selector">
						<header>选择你的阅读偏好</header>
						<ul>
						{
							['男生网文','女生网文','出版图书','随便看看'].map(function(v,i){
								return (
									<li key={i}><div className={"selected"+(this.state.selected===i?' active':'')}></div><a onClick={this.chooseFavor.bind(this,i)} className={'select-'+i}></a><span>{v}</span></li>
									)
							}.bind(this))
						}
						</ul>
						<a className="u-btn-4" onClick={this.gotoMall}>立即体验</a>
						</div>
					</div>
				</div>
			)
		} else {
			main = (
				<div className="g-mall" style={{top:0}}>
					<MallNav navList={this.state.navList || []} />
					<section className={"m-wrapper"+(this.state.showUser? ' show':'')} onClick={this.hideUser}></section>
					<section className={"m-user-list"+(this.state.showUser? ' show':'')}>
						<UserList route={this.props.route} path={this.state.path} />
					</section>
					{this.props.children}
				</div>
			)
		}

		if(this.state.onerror){									
			main = <div className="g-main"><NoData type="UFO" /></div>;
		}

		var content;
		if(this.state.show)
			content = (
				<div>
					<Header title="" left={left} right={right} middle={middle} path={this.props.route}/>
					{main}
				</div>)


		return (
			<div>
				{content}
			</div>
			)
	}
})
module.exports = Mall;