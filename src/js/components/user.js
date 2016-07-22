var myEvent = require('../modules/myEvent');
var Mixins = require('../modules/mixins');

if(typeof window !== 'undefined'){
	require('../../css/user.css');
	var POP = require('../modules/confirm')
}

var ULine = React.createClass({
	render: function() {
		
		return (
			<li className="u-line">
				<Link to={GLOBAL.setHref(this.props.line.href)} className="f-cb" data-href={GLOBAL.setHref(this.props.line.href)} onClick={this.props.line.requireLogin}>
					<span className="iconfont icon-arrow-right f-fr"></span>
					<span className={"iconfont" + ' ' + this.props.line.icon}></span>
					<span className="title">{this.props.line.title}</span>
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
					<ul className="u-lines">
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
				portraitUrl: 'src/img/defaultAvatar.png'
			},
		};
	},
	logout: function(e) {
		e.preventDefault && (e.preventDefault());
		POP.confirm('确定退出登录?',function() {
			GLOBAL.setUser({
				phone: null,
				token: ''
			});
			GLOBAL.removeCookie('userPhone');
			GLOBAL.removeCookie('userToken');
			GLOBAL.removeCookie('userId');

			//同步state User
			this.setState({
				needUpdate: this.state.needUpdate + 1
			});
		}.bind(this));
	},
	login: function(e) {
		if (!this.isLogin()) {
			this.requireLogin(e);
		}
	},
	shouldComponentUpdate: function(nextProp, nextState) {
		return this.state.user.phone !== nextState.user.phone 
		    || this.state.needUpdate !== nextState.needUpdate
		    || this.props.children !== nextProp.children;
	},
	componentDidMount: function() {
		this.getUserInfo();
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
					browserHistory.push(href || '/user');
				});
			}, 10);
		}
		return true;
	},
	render:function() {
		var blockData = [
			[{
				title: '最近阅读',
				icon: 'icon-read',
				href: 'recentRead'
			}, {
				title: '艾豆充值',
				icon: 'icon-balance',
				href: 'balance',
				requireLogin: this.requireLogin
			},{
				title: '已购书籍',
				icon: 'icon-tag',
				href: 'purchased',
				requireLogin: this.requireLogin
			}, {
				title: '我的标签',
				icon: 'icon-tag',
				href: 'myTags',
				requireLogin: this.requireLogin
			}, {
				title: '我的成就',
				icon: 'icon-yueli',
				href: 'readHistory',
				requireLogin: this.requireLogin
			}], [{
				title: '意见反馈',
				icon: 'icon-feedback',
				href: 'feedback'
			}, {
				title: '关于艾美阅读',
				icon: 'icon-about',
				href: 'about'
			}]
		];
		var logoutBtn;
		var userName = '立即登录';

		if (this.isLogin()) {
			userName = this.state.user.phone;
			logoutBtn = (
				<section className="m-ublock">
					<ul className="u-lines">
						<li onClick={this.logout} className="logout-btn u-line">退出登录</li>
					</ul>
				</section>
			);
		}
		return (
			<div className="g-ggWraper">
				<div className="g-main g-main-2">
					<div className="m-userblock g-scroll">
						<section className="avatar-block f-pr">
							<img src="src/img/bg_me.png" className="bg"/>
							<div onClick={this.login}>
								<div className="avatar-wrap">
									<img src={this.state.userInfo.portraitUrl} />
								</div>
								<div className="username">{userName}</div>
							</div>
						</section>
						{
							blockData.map(function(lines, i) {
								return (<MUblock key={i} lines={lines} />);
							})
						}
						{logoutBtn}
					</div>
				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports  = User;