
var Header = require('./header');
var myEvent = require('../modules/myEvent');

var Login = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var that = this;
		if (that.loading) {return ;}
		var postData = {
			phone: this.refs.mobile_num.value,
			password: this.refs.password.value//,
			//'param': [{'bookId': 1, 'type': 2}, {'bookId': 2, 'type': 3}]
		};
		if (!GLOBAL.assertNotEmpty(postData.phone, '请输入手机号')) {return ;}
		if (!GLOBAL.assertMatchRegExp(postData.phone, /^1\d{10}$/, '请输入正确的手机号')) {return ;}
		if (!GLOBAL.assertNotEmpty(postData.password, '请输入密码')) {return ;}

		that.loading = true;
		//Router.init('login');
		Router.ajax('login',postData, function(data) {
			that.loading = false;
			var options = {
				expires: 1000
			};
			GLOBAL.cookie('userPhone', postData.phone, options);
			GLOBAL.cookie('userToken', data.token, options);
			GLOBAL.cookie('userId', data.user_id, options);
			GLOBAL.setUser({
				phone: postData.phone,
				token: postData.token
			});

			//判断登陆后的跳转
			switch(window.from){
				case 'activity':
					window.location.href = 'http://m.imread.com/iframe/lottery/?token='+data.token+'&devicetoken='+GLOBAL.getUuid();
					break;
				default:
					Router.goBack();
					myEvent.execCallback('login');
			}
			
		}, function(res) {
			that.loading = false;
			GLOBAL.defaultOnError(res);
		});
		return false;
	},
	componentDidMount: function() {
		this.refs.mobile_num.focus();

		//判断来源from
		window.from = null;
		var search = window.location.hash.match(/from=[a-zA-z]+/);
		if(search)
			window.from = search[0].split('=')[1];

	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return false;
	},
	render: function() {
		return (
			<div>
				<Header title={Router.title} right={null} />
				<div className="m-loginblock m-userblocks">
					<form className="u-loginform u-userform" onSubmit={this.handleSubmit}>
						<div className="u-inputline">
							<input className="u-input" placeholder="手机号" type="tel" ref="mobile_num" />
						</div>
						<div className="u-inputline">
							<input className="u-input" placeholder="密码" type="password" ref="password" />
						</div>
						<div className="u-inputline">
							<button type="submit" className="u-btn u-btn-full">登录</button>
						</div>

						<div className="u-inputline f-clearfix">
							<div className="u-buttonc f-fl">
								<a className="tip" href={Router.setHref('register')}>注册新账号</a>
							</div>
							<div className="u-buttonc f-fl">
								<a className="tip" href={Router.setHref('forget')}>忘记密码</a>
							</div>
						</div>
						<div className="u-otherlogins-tip f-hide">其他方式登录</div>
						<div className="u-inputline f-clearfix f-hide">
							<div className="u-buttonc f-fl">
								<a className="u-otherlogin">
									<img src="src/img/qq.png" />
									<span className="title">QQ</span>
								</a>
							</div>
							<div className="u-buttonc f-fl">
								<a className="u-otherlogin">
									<img src="src/img/wechat.png" />
									<span className="title">微信</span>
								</a>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
});

module.exports  = Login;