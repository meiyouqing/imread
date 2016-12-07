import NoData from './noData'
import Loading from './loading'
import AJAX from '../modules/AJAX'
import GLOBAL from '../modules/global'
import Mixins from '../modules/mixins'
import React from 'react'
var Header = require('./header');
var Blocklist = require('./blocklist');
var MallNav = require('./mallNav');

var Mall = React.createClass({
	mixins: [Mixins()],
	reset: function(){
		this.setState({
			list:null,
			noMore:false
		})
	},
	getInitialState: function(){
		return{
			noMore:false,
			scrollUpdate:false,
			onerror:false,
			list:null,
			firstTime: false,
			selected: 0,
		}
	},
	getList: function (Update){
		AJAX.init(this.APIparam);
		AJAX.get(this.ajaxHandle ,this.onerror);
	},
	listId: [1,2,3,0],
	chooseFavor: function(i){
		this.id = this.listId[i];
		this.setState({selected: i})
	},
	gotoMall: function(){
		this.refs.selector.style.opacity = 0;
		this.id = this.id===undefined?1:this.id;
		GLOBAL.cookie('group_id',this.id,{expires: 1000});
		this.disPatch('resetMall');

		setTimeout(function(){
			this.setState({firstTime: false});
		}.bind(this),800);
	},
	ajaxHandle: function(data){
		if(!data.blocklist){return}
		if (!data.blocklist.length) {
			this.setState({
				noMore:true,
				list: (this.state.scrollUpdate && !this.navChanged)? this.state.list.concat(data.blocklist):data.blocklist
			})
			return;
		}
		this.setState({
			list: (this.state.scrollUpdate && !this.navChanged)? this.state.list.concat(data.blocklist):data.blocklist,
			scrollUpdate: false
		});
		this.navChanged = false;
		//设置GLOBAL.booklist/book
		GLOBAL.setBlocklist(data.blocklist);
	},
	//for the server rending
	componentWillMount:function(){
		this.usePreload(this.props.params.subnav);
	},
	componentWillReceiveProps: function(nextProp){
		//console.log(nextProp.params.subnav !== this.props.params.subnav)
		if(nextProp.params.subnav !== this.props.params.subnav){
			this.reset();
			this.APIparam = nextProp.params.subnav;
			this.getList();
		}
	},
	componentDidMount: function(){
		const isRouter = GLOBAL.isRouter(this.props);
		this.APIparam = this.props.params.subnav;
		//AJAX.init(this.APIparam+'.1');
		this.page_id = this.props.params.subnav.split('.')[1];
		if(isRouter && !(this.state.list && this.state.list.length))	this.getList(true);
		if(isRouter){
			this.lazyloadImage(this.refs.container);
			this.disPatch('scroll',this.refs.container);
		}

		if(!GLOBAL.cookie('group_id'))
			this.setState({firstTime: GLOBAL.cookie('group_id')?false:true})
	},
	componentDidUpdate: function(nextProp) {
		const isRouter = GLOBAL.isRouter(this.props);
		this.page_id = this.props.params.subnav.split('.')[1];
		if(nextProp.params.subnav === this.props.params.subnav){
			if(isRouter && !this.state.list)	 this.getList(true);
		}else{
			this.navChanged = true;//重置数据,修正nav切换bug
		}

		if(!this.state.list || !this.state.list.length){return;}
		if(isRouter){
			this.lazyloadImage(this.refs.container);
			this.disPatch('scroll',this.refs.container);
		}
	},
	shouldComponentUpdate: function(nextProp,nextState){
		//console.log(this.props,nextProp)
		return this.state.noMore !== nextState.noMore
				|| this.state.list !== nextState.list
				|| this.state.onerror !== nextState.onerror
				|| this.props.children !== nextProp.children
				|| this.state.firstTime !== nextState.firstTime
				|| this.state.selected !== nextState.selected;
	},
	render:function(){
		var list;
		var scrollLoading = <Loading cls="u-sLoading" />;
		if(this.state.noMore){
			scrollLoading = null;
		}
		// console.log(this.state.list)
		if(!this.state.list){
			if(GLOBAL.isRouter(this.props))
				list = <Loading />
		}else{
			if(this.state.list.length){
				list = (
					<div className="g-main g-main-1">
						<div className="g-scroll" onScroll={this.scrollHandle} ref="container">
							{
								<Blocklist blockList={this.state.list} routeLocation={this.props.location} pageId={this.page_id}/>
							}
							{scrollLoading}
						</div>
					</div>
					);
			}else{
				list = (<div className="g-main"><NoData /></div>);
			}
		}
		if(this.state.onerror){
			list = (<div className="g-main"><NoData type="UFO" /></div>);
		}

		if(this.state.firstTime){
			list = (
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
		} 
		return (
			<div className="g-subMall">
				{list}
				{this.props.children}
			</div>
			)
	}
})
module.exports = Mall;