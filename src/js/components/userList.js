import browserHistory from 'react-router/lib/browserHistory'
import Link from 'react-router/lib/Link'
import AJAX from '../modules/AJAX'
import GLOBAL from '../modules/global'
import storage from '../modules/storage'
import Mixins from '../modules/mixins'
import React from 'react'
import parseQuery from '../modules/parseQuery'
var myEvent = require('../modules/myEvent');

if(typeof window !== 'undefined'){
	require('../../css/user.css');
}
if(typeof window !== 'undefined'){
	var POP = require('../modules/confirm')
}
var ULine = React.createClass({
	mixins: [Mixins()],
	getInitialState:function(){
		return {isWx:false}
	},
	componentDidMount: function(){
		if(!this.isMounted()) return;
		if(this.isWx()){
			this.setState({isWx:true})
		}
	},
	render: function() {
		let Src = this.props.path+'/'+this.props.line.href;

		if(this.props.line.href === 'pay'){
			Src = '/pay?backUrl=' + encodeURIComponent(this.props.path);
		}

		if(this.state.isWx && this.props.line.href === 'pay'){
			return (
				<li className="u-line">
					<a href={Src} data-href={Src} className="f-cb">
						<span className={"iconfont icon-user" + ' ' + this.props.line.icon}></span>
						<span className="title">{this.props.line.title}</span>
						<span className='s-title'>{this.props.line.s_title}</span>
					</a>
				</li>
			)
		}else{
			return (
				<li className="u-line">
					<Link to={Src} className="f-cb" data-href={Src} onClick={this.props.line.requireLogin}>
						<span className={"iconfont icon-user" + ' ' + this.props.line.icon}></span>
						<span className="title">{this.props.line.title}</span>
						<span className='s-title'>{this.props.line.s_title}</span>
					</Link>
				</li>
			);
		}
	}
});

var MUblock = React.createClass({
	render: function() {
		return (
			<section className="m-ublock">
				<div className="content">
					<ul className={"u-lines active"+this.props.index}>
						{
							this.props.lines.map(function(line, i){
								return <ULine key={i} line={line} path={this.props.path}/>
							}.bind(this))
						}
					</ul>
				</div>
			</section>
		);
	}
});

var UserList = React.createClass({
	mixins: [Mixins()],
	getInitialState: function() {
		return {
			user: GLOBAL.user,
			needUpdate: 0,
			userInfo: null,
			aidou: null
		};
	},
	login: function(e) {
		if (!this.isLogin()) {
			this.requireLogin(e);
		} else{
			this.state.userInfo && browserHistory.push({pathname:GLOBAL.setHref('userInfo'),state:{data:this.state.userInfo}});
		}
	},
	getInfo: function(){
		if(!this.isMounted()) return;
		AJAX.getJSON('GET', '/api/v1/read/config', {}, function(data) {
			this.setState({aidou:data[1].default_balance});
		}.bind(this));
	},
	componentDidMount: function() {

		const search = parseQuery(location.search);
		if(search.token){
			GLOBAL.cookie('token',search.token,{expires:7,path:'/',domain:'.imread.com'});
			GLOBAL.cookie('client-type','3',{expires:7,path:'/',domain:'.imread.com'});
		}
		this.getUserInfo();
		document.addEventListener('updateUser',this.getUserInfo.bind(this,false));
		document.addEventListener('rechargeSuccess',this.getUserInfo.bind(this,false));
	},
	componentWillUnmount: function(){
		 document.removeEventListener("updateUser", this.getUserInfo.bind(this,null), false);
		 document.removeEventListener('rechargeSuccess',this.getUserInfo.bind(this,null),false);
	},
	getUserInfo: function() { //获取个人信息	
		if(!this.isMounted()) return;	
		var that = this;
			//POP.alert(this.isLogin)
		if (this.isLogin()) {
			AJAX.init('me');
			AJAX.get(function(data) {
				if(data.code != 200) {
					storage.rm('userToken');
					GLOBAL.removeCookie('token', '/', '.imread.com');
					return;
				}
				that.setState({
					userInfo: data,
				});
			}, (err)=>{
					storage.rm('userToken');
					GLOBAL.removeCookie('token', '/', '.imread.com');
			});
		}else{
			that.getInfo();
			that.setState({
				userInfo: null
			});
		}
	},
	requireLogin:function(e) {
		if (!this.isLogin()) {
			e.preventDefault();
			var target = e.target.nodeName == 'A' ? e.target : e.target.parentNode;
			var href = target.getAttribute('data-href');
			// console.log(target);
			// console.log(href);
			
			if (!href) {
				var hash = location.pathname+'/login';
				browserHistory.push(hash);
				//myEvent.setCallback('login', login_c);
				return false;
			}
			this.goLogin(function(){browserHistory.push(href)});
			return false;
		}
		return true;
	},
	gotoBalance:function(){
		browserHistory.push(GLOBAL.setHref('balance'))
	},
	shouldComponentUpdate: function(nextProp, nextState) {
		return this.state.user.phone !== nextState.user.phone 
		    || this.state.needUpdate !== nextState.needUpdate
		    || this.state.aidou !== nextState.aidou
		    || this.props.children !== nextProp.children
		    || this.props.path !== nextProp.path
		    || this.state.userInfo !== nextState.userInfo;
	},
	render:function() {
		var blockData = [
			[{
				title: '书架',
				icon: 'icon-shujiaxuanzhong',
				href: 'shelf',
				requireLogin: this.requireLogin
			}, {
				title: '发现',
				icon: 'icon-zhinanzhen',
				s_title: '书单·排行',
				href: 'top/block.0'
			}], [{
				title: '最近阅读',
				icon: 'icon-shizhong',
				href: 'recentRead'
			},{
				title: '书单收藏',
				icon: 'icon-book',
				href: 'bookstore',
				requireLogin: this.requireLogin
			}, {
				title: '艾豆充值',
				icon: 'icon-aidou',
				href: 'pay',
				requireLogin: this.requireLogin
			},{
				title: '已购书籍',
				icon: 'icon-leftbarrecharge',
				href: 'purchased',
				requireLogin: this.requireLogin
			}, {
				title: '我的标签',
				icon: 'icon-biaoqian',
				href: 'myTags',
				requireLogin: this.requireLogin
			}, {
				title: '我的成就',
				icon: 'icon-trophy',
				href: 'readHistory',
				requireLogin: this.requireLogin
			},{
				title: '设置',
				icon: 'icon-shezhi',
				href: 'setting'
			}]
		];

		let userCard;
		if(!this.state.userInfo){
			userCard = (<div onClick={this.login}>
							<div className="avatar-wrap"><span className="iconfont icon-shu_1"></span></div>
							<div className="username"><p>登录/注册</p><p>新用户注册送{this.state.aidou || ''}艾豆</p></div>
						</div>)
		}else{
			userCard = (<div>
						<div className="avatar-wrap" onClick={this.login}>
							{
								this.state.userInfo.portraitUrl ?
								 <img src={this.state.userInfo.portraitUrl} />:
								 <span className="iconfont icon-shu_1"></span>
							}
						</div>
						<div className="username"><p className="f-ellipsis" onClick={this.login}>{this.state.userInfo.user_name || this.state.userInfo.mobile_num}</p><p onClick={this.gotoBalance}>艾豆余额：{this.state.userInfo.balance/100}艾豆</p></div>
					</div>)
		}

		return (
			<div className="g-ggWraper" >
				<div className="g-main g-main-4">
					<div className="m-userblock g-scroll">
						<section className="avatar-block f-pr">
								{userCard}
						</section>
						{
							blockData.map(function(lines, i) {
								return (<MUblock key={i} lines={lines} index={i} path={this.props.path}/>);
							}.bind(this))
						}
					</div>

				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports  = UserList;