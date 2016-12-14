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
var Blocklist = require('./blocklist');
var Favorite = require('./favorite');

if(typeof window !== 'undefined'){
	var POP = require('../modules/confirm')
}

var Mall = React.createClass({
	mixins: [Mixins()],
	getNav: function(FROM){
		// console.log('getnav>> '+FROM)
		var group_id = GLOBAL.cookie('group_id') || 1;
		AJAX.init('group.1.'+group_id)
		AJAX.get(this.ajaxHandle, this.getNavFaile,'getNav');
	},
	getList: function (FROM){
		// console.log(FROM)
		if(!this.APIparam) return;
		AJAX.init(this.APIparam);
		AJAX.get(this.ajaxHandle ,this.onerror,'getList');
	},
	ajaxHandle:function(data,isPrelod){
		if(typeof data.pgid !== 'undefined'){
			this.ajaxHandle_list(data);
			return;
		}

		if(!data.pagelist) return;
		this.setState({
			navList:data.pagelist
		});
		this.APIparam = this.props.params.subnav || (this.props.params.subnav = 'page.'+data.pagelist[0].pgid);
		if(!isPrelod) {
			this.getList('ajaxHandle');
		}else{
			this.usePreload(this.APIparam);
		}
		if(typeof window==='undefined' || !this.APIparam) return;
		this.upApp(this.APIparam);
		browserHistory.replace(`/mall/${this.APIparam}${location.search}`);
	},
	ajaxHandle_list: function(data){
		if(!data.blocklist){return}
		if (!data.blocklist.length) {
			this.setState({
				noMore:true,
				scrollUpdate:false
			})
			return;
		}
		// console.log(this.state.scrollUpdate,' /',this.state.list)
		this.setState({
			list: this.state.scrollUpdate && this.state.list? this.state.list.concat(data.blocklist):data.blocklist,
			scrollUpdate: false
		});
		//设置GLOBAL.booklist/book
		GLOBAL.setBlocklist(data.blocklist);
	},
	getNavFaile: function(e){
		// console.log('error:  ',e)
		this.setState({onerror:true})
	},
	gotoSearch: function(){
		browserHistory.push(GLOBAL.setHref('search/page.11.0.1'));
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
			path: '/mall/'+this.APIparam
		})
	},
	favoriteDone:function(){
		browserHistory.replace(`/mall${location.search}`);
		setTimeout(()=>{
			this.setState({firstTime:false});	
		},1000)
			
	},
	reset: function(){
		this.setState({
			list:null,
			noMore:false
		})
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
	getInitialState: function(){
		return {
			navList: null,
			showUser:false,
			onerror:false,
			path:'/mall',
			noMore:false,
			scrollUpdate:false,
			list:null,
			firstTime: false
		}
	},
	componentWillReceiveProps: function(nextProp){
		const noParam = /^\/mall\/?$/.test(location.pathname);
		if(noParam){
			this.reset();
			this.getNav('componentWillReceiveProps');
			return;
		}
		const isRouter = GLOBAL.isRouter(nextProp);
		// console.log(nextProp.params.subnav, this.props.params.subnav,isRouter)
		if(nextProp.params.subnav && nextProp.params.subnav !== this.props.params.subnav && isRouter){
			this.reset();
			this.APIparam = nextProp.params.subnav;
			this.getList('componentWillReceiveProps');
		}
	},
	//for the server rending
	componentWillMount:function(){
		// this.APIparam = this.props.params.subnav || (this.props.params.subnav = 'page.9');
		if(GLOBAL.isRouter(this.props)) this.usePreload('mallNav');
		
	},
	componentDidMount: function(){
		document.ontouchmove = function(e){
			e.stopPropagation();
		};
		const isRouter = GLOBAL.isRouter(this.props);
		if(isRouter){
			if(!this.state.navList) this.getNav('componentDidMount');
			this.lazyloadImage(this.refs.container);
			this.disPatch('scroll',this.refs.container);
		}
		if(!GLOBAL.cookie('group_id'))
			this.setState({firstTime: true});
		
	},
	componentDidUpdate: function(nextProp,nextState){	
		const isRouter = GLOBAL.isRouter(this.props);
		
		if(this.state.showUser) {
			if(!this.userFlag) this.hideUser();
			this.userFlag = false;
		}
		
		// if(nextProp.params.subnav === this.props.params.subnav){
		// 	// console.log(this.state.list)
		// 	if(isRouter && !this.state.list) this.getList('componentDidUpdate');
		// }

		// if(!this.state.list || !this.state.list.length) return;
		if(isRouter){
			if(!this.state.navList) this.getNav('componentDidUpdate');
			this.lazyloadImage(this.refs.container);
			this.disPatch('scroll',this.refs.container);
		}
	},
	shouldComponentUpdate: function(nextProp,nextState){
		return this.state.navList !== nextState.navList
				|| this.state.list !== nextState.list
				|| this.state.firstTime !== nextState.firstTime
				|| this.state.showUser !== nextState.showUser
				|| this.state.onerror !== nextState.onerror
				|| this.props.children !== nextProp.children;
	},
	reload: function(){
		location.pathname = '/';
		window.location.reload();
	},

	render:function(){
		const isRouter = GLOBAL.isRouter(this.props);

		const right = <div className="iconfont icon-menu f-fr icon-s" onClick={this.showUser} ></div>,
			  middle = <a className="iconfont icon-sousuo f-fr icon-s" onClick={this.gotoSearch}></a>,
			  left = <div className="i-logo" onClick={this.reload}></div>;

		const scrollLoading = this.state.noMore?
							null:
							<Loading cls="u-sLoading" />;

		let list = <Loading />;

		if(this.state.list){
			if(this.state.list.length){
				list = (
					<div className="g-main g-main-3">
						<div className="g-scroll" onScroll={this.scrollHandle} ref="container">
							{
								<Blocklist blockList={this.state.list} routeLocation={this.props.location} pageId={this.APIparam.split('.')[1]}/>
							}
							{scrollLoading}
						</div>
					</div>
					);
			}else{
				list = (<div className="g-main"><NoData /></div>);
			}
		}
		
		let main = (
				<div className="g-mall" style={{top:0}}>
					<MallNav navList={this.state.navList || []} />
					<section className={"m-wrapper"+(this.state.showUser? ' show':'')} onClick={this.hideUser}></section>
					<section className={"m-user-list"+(this.state.showUser? ' show':'')}>
						<UserList route={this.props.route} path={this.state.path} />
					</section>
					{list}
					{this.props.children}
				</div>
			)

		if(this.state.onerror){									
			main = <div className="g-main"><NoData type="UFO" /></div>;
		}

		return (
			<div className="g-body">
				<Header title="" left={left} right={right} middle={middle} path={this.props.route}/>
				{main}
				{(this.state.firstTime && isRouter)? <Favorite favoriteDone={this.favoriteDone} />:null}
			</div>
			)
	}
})
module.exports = Mall;