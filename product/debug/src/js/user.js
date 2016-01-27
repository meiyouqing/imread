var myEvent = require('./myEvent');
var User = React.createClass({
	getInitialState: function() {
		return {
			user: GLOBAL.user,
			needUpdate: 0
		};
	},
	logout: function(e) {
		e.preventDefault && (e.preventDefault());
		if (confirm('确定退出登录?')) {
			GLOBAL.setUser({
				phone: null,
				token: ''
			});
			GLOBAL.removeCookie('userPhone');
			GLOBAL.removeCookie('userToken');

			//同步state User
			this.setState({
				needUpdate: this.state.needUpdate + 1
			});
		}
	},
	shouldComponentUpdate: function(nextPros, nextState) {
		return this.state.user.phone !== nextState.user.phone || this.state.needUpdate !== nextState.needUpdate;
	},
	componentDidMount: function() {
		//登陆成功后更新登录状态
		var that = this;
		myEvent.setCallback('login', function() {
			that.setState({
				needUpdate: that.state.needUpdate + 1
			});
		});
	},
	render:function() {
		var loginLine;
		if (this.state.user.phone) {
			loginLine = (
				<a onClick={this.logout}>
					<span className="iconfont icon-user"></span>
					<span className="title">{this.state.user.phone}</span>
				</a>
			);
		} else {
			loginLine = (
				<a href={Router.setHref('login')}>
					<span className="iconfont icon-user"></span>
					<span className="title">登录</span>
				</a>
			);
		}
		return (
			<div>
				<div className="m-userblock">
					<section className="m-ublock">
						<div className="title">
							<h2>基本设置</h2>
						</div>
						<div className="content">
							<ul className="u-lines">
								<li className="u-line">
									{loginLine}
								</li>
							</ul>
						</div>
					</section>
					<section className="m-ublock">
						<div className="title">
							<h2>其他</h2>
						</div>
						<div className="content">
							<ul className="u-lines">
								<li className="u-line">
									<a href={Router.setHref('feedback')}>
										<span className="iconfont icon-feedback"></span>
										<span className="title">意见反馈</span>
									</a>
								</li>
								<li className="u-line">
									<a href={Router.setHref('about')}>
										<span className="iconfont icon-about"></span>
										<span className="title">关于艾美阅读</span>
									</a>
								</li>
							</ul>
						</div>
					</section>
				</div>
			</div>
		);
	}
});

module.exports  = User;