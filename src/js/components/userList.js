var myEvent = require('../modules/myEvent');
var Mixins = require('../modules/mixins');

require('../../css/user.css');

var ULine = React.createClass({

	render: function() {
		var Src = window.location.pathname.split('/');
		Src = '/'+Src[1]+'/'+Src[2]+'/'+this.props.line.href;
		return (
			<li className="u-line">
				<Link to={Src} className="f-cb" data-href={Src} onClick={this.props.line.requireLogin}>
					{/*<span className="iconfont icon-arrow-right f-fr"></span>*/}
					<span className={"icon-u" + ' ' + this.props.line.icon}></span>
					<span className="title">{this.props.line.title}</span>
					<span className='s-title'>{this.props.line.s_title}</span>
				</Link>
			</li>
		);
	}
});

var MUblock = React.createClass({
	render: function() {
		return (
			<section className="m-ublock">
				<div className="content">
					<ul className={"u-lines active"+this.props.index}>
						{
							this.props.lines.map(function(line, i) {
								return <ULine key={i} line={line} />
							})
						}
					</ul>
				</div>
			</section>
		);
	}
});

var User = React.createClass({
	mixins: [Mixins()],
	getInitialState: function() {
		return {
			user: GLOBAL.user,
			needUpdate: 0,
			userInfo: {
				portraitUrl: 'https://m.imread.com/src/img/user/avatar@2x.png',
				balance: 0
			},
		};
	},
	login: function(e) {
		if (!this.isLogin()) {
			this.requireLogin(e);
		} else{
			browserHistory.push(GLOBAL.setHref('userInfo'));
		}
	},
	shouldComponentUpdate: function(nextProp, nextState) {
		return this.state.user.phone !== nextState.user.phone 
		    || this.state.needUpdate !== nextState.needUpdate
		    || this.props.children !== nextProp.children
		    || this.state.userInfo !== nextState.userInfo;
	},
	componentDidMount: function() {
		this.getUserInfo();

		document.addEventListener('updateUser',this.getUserInfo.bind(this,false));
		document.addEventListener('rechargeSuccess',this.getUserInfo.bind(this,false));

	},
	componentWillUnmount: function(){
		 document.removeEventListener("updateUser", this.getUserInfo.bind(this,false), false);
		 document.removeEventListener('rechargeSuccess',this.getUserInfo.bind(this,false),false);
	},
	componentDidUpdate: function(nextProp){
	},
	getUserInfo: function(callback) { //获取个人信息
		var that = this;
		if (this.isLogin()) {
			AJAX.init('me');
			AJAX.get(function(data) {
				var newPortraitUrl = data.portraitUrl;
				data.portraitUrl = that.state.userInfo.portraitUrl;
				that.setState({
					userInfo: data,
					needUpdate: that.needUpdate + 1
				});
				GLOBAL.cookie('userId', data.user_id, {
					expires: 1000
				});

				callback && (callback());

				if (!/\/face\/null$/.test(newPortraitUrl)) {
					GLOBAL.loadImage(newPortraitUrl, function() {
						data.portraitUrl = newPortraitUrl;
						that.setState({
							userInfo: data,
							needUpdate: that.needUpdate + 1
						});
					});
				}
			}, GLOBAL.noop);
		} 
	},
	requireLogin:function(e) {
		var target = e.target.nodeName == 'A' ? e.target : e.target.parentNode;
		var that = this;
		if (!this.isLogin()) {
			var href = target.getAttribute('data-href');
			if (!href) {
				var hash = location.pathname+'/login';
				browserHistory.push(hash);
				myEvent.setCallback('login', login_c);
				return false;
			}
			this.goLogin(login_c);
			e.preventDefault();
			return false;
		}
		function login_c() {
			setTimeout(function() {
				that.setState({
					needUpdate: that.state.needUpdate + 1
				});
			}, 0);
			setTimeout(function() {
				that.getUserInfo(function() {
					browserHistory.push(href || location.pathname);
				});
			}, 10);
		}
		return true;
	},
	gotoBalance:function(){
		browserHistory.push(GLOBAL.setHref('balance'))
	},
	// shouldComponentUpdate: function(nextProp,nextState){
	// 	//console.log(this.props,nextProp)
	// 	return this.props.noMore !== nextState.noMore;
	// },
	render:function() {

		var blockData = [
			[{
				title: '书架',
				icon: 'icon-shelf',
				href: 'shelf',
				requireLogin: this.requireLogin
			}, {
				title: '发现',
				icon: 'icon-discover',
				s_title: '书单·排行',
				href: 'top/block.0'
			}], [{
				title: '最近阅读',
				icon: 'icon-recent',
				href: 'recentRead'
			},{
				title: '书单收藏',
				icon: 'icon-bookstored',
				href: 'bookstore',
				requireLogin: this.requireLogin
			}, {
				title: '艾豆充值',
				icon: 'icon-aidou',
				href: 'balance',
				requireLogin: this.requireLogin
			},{
				title: '已购书籍',
				icon: 'icon-chongzhi',
				href: 'purchased',
				requireLogin: this.requireLogin
			}, {
				title: '我的标签',
				icon: 'icon-tags',
				href: 'myTags',
				requireLogin: this.requireLogin
			}, {
				title: '我的成就',
				icon: 'icon-achieve',
				href: 'readHistory',
				requireLogin: this.requireLogin
			},{
				title: '设置',
				icon: 'icon-setter',
				href: 'setting'
			}]
		];
		var logoutBtn;
		var userName = '',aidou=0;

		 if (this.isLogin()) {
			userName = this.state.userInfo.user_name || this.state.userInfo.mobile_num;
			logoutBtn = (<div>
				<div className="avatar-wrap" onClick={this.login}>
					<img src={this.state.userInfo.portraitUrl || 'https://m.imread.com/src/img/user/avatar@2x.png'} />
				</div>
				<div className="username"><p className="f-ellipsis" onClick={this.login}>{userName}</p><p onClick={this.gotoBalance}>艾豆余额：{this.state.userInfo.balance/100}艾豆</p></div>
				</div>
			);
		} else {
			logoutBtn = (<div onClick={this.login}>
				<div className="avatar-wrap">
						<img src='https://m.imread.com/src/img/user/avatar@2x.png' />
				</div>
				<div className="username"><p>登录/注册</p><p>新用户注册送10艾豆</p></div>
				</div>
			);
		}
		return (
			<div className="g-ggWraper" >
				<div className="g-main g-main-4">
					<div className="m-userblock g-scroll" onClick={this.props.hideUser}>
						<section className="avatar-block f-pr">
							<img src="https://m.imread.com/src/img/user/bg@2x.png" className="bg"/>
						
								{logoutBtn}
	
						</section>
						{
							blockData.map(function(lines, i) {
								return (<MUblock key={i} lines={lines} index={i} />);
							})
						}
					</div>

				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports  = User;