import myEvent from '../modules/myEvent'
import NoData from './noData'
import Loading from './loading'
import AJAX from '../modules/AJAX'
import GLOBAL from '../modules/global'
import Mixins from '../modules/mixins'
import React from 'react'
var Blocklist = require('./blocklist');
var Header = require('./header');
var BookStore = require('./bookStore');
import MallNavLink from './mallNavLink'

var MallNav = React.createClass({
	render: function() {
		if(!this.props.navList || !this.props.navList.length){return <i></i>}
		return (
			<nav className="g-nav">
				<div className="m-nav f-flexbox" >
					{
						this.props.navList.map(function(v,i){
							var path = typeof window === 'undefined'?
										global.pathname:
										location.pathname;
							var hrefStr = path.replace(/top\/block\.\d/,'top/block.'+i);
							return (
								<MallNavLink to={hrefStr} key={i} className="f-flex1">{v.name}</MallNavLink>
							)
						}.bind(this))
					}
				</div>
			</nav>
		);
	}
});

var Top = React.createClass({
	mixins: [Mixins()],
	pid: 0,
	getInitialState: function(){
		return{
			noMore:false,
			scrollUpdate:false,
			onerror:false,
			list:null
		}
	},
	getData: function(){
		AJAX.init('group.6');
		AJAX.get((data)=>{
			this.params = 'page.'+data.pagelist[0].pgid+'.'+data.pagelist[0].blocks+'.1'
			this.getLists();			
		},this.onerror)
	},
	getLists: function (){
		AJAX.init(this.params);
		AJAX.get(this.ajaxHandle,this.onerror);
	},
	ajaxHandle: function(data){
		if(!data.blocklist){return}
		if (!data.blocklist.length) {
			this.setState({
				noMore:true
			})
		}
		this.setState({
			list: this.state.scrollUpdate? this.state.list.concat(data.blocklist):data.blocklist,
			scrollUpdate: false
		});
		//设置GLOBAL.booklist/book
		GLOBAL.setBlocklist(data.blocklist);
	},			
	componentWillMount:function(){
		if(typeof window === 'undefined') return;
		if(window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.topNav){
			const data = window.__PRELOADED_STATE__.topNav;
			const n = 'page.'+data.pagelist[0].pgid+'.'+data.pagelist[0].blocks+'.1';
			this.usePreload(n);
		}
	},
	componentDidMount: function(){
		if(GLOBAL.isRouter(this.props) && !this.state.list)	{
			this.getData();
		}else{
			this.lazyloadImage(this.refs.container);		
		}
		// myEvent.setCallback('updateTopList',this.getData);
	},
	componentDidUpdate: function(nextProp) {
		if(GLOBAL.isRouter(this.props) && !this.state.list) this.getData();
		if(!this.state.list || !this.state.list.length){return;}
		this.lazyloadImage(this.refs.container);		
	},
	shouldComponentUpdate: function(nextProp,nextState){
		return this.state.noMore !== nextState.noMore
				|| this.state.list !== nextState.list 
				|| this.props.children !== nextProp.children
				|| this.props.params.topId !== nextProp.params.topId;
	},
	render:function(){
		this.pid = this.props.params.topId.split('.').pop();

		var list, arr=[];
		if(!this.state.list){
			if(GLOBAL.isRouter(this.props))
				list = <Loading />
		}else{
			if(this.state.list.length){
				list = (
					<div className="g-main g-main-3 m-top">
						<div ref="container">
							<BookStore dom={this.refs.container} data={this.state.list}  order={this.pid} updateGuess={this.getLists}/>
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

		return (
			<div  className="gg-body">
				<Header title="发现"  path={this.props.route} />
				<MallNav navList={this.state.list} />
				{list}
				{this.props.children}
			</div>
			);
	}
})
module.exports = Top;