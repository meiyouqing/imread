
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
		AJAX.go('login',postData, function(data) {
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
			var isneed = false;
			if(that.from && that.from.skipurl){
				isneed = /\?/.test(that.from.skipurl);
				window.location.href = that.from.skipurl+(isneed?'':'?')+'token='+data.token+'&devicetoken='+GLOBAL.getUuid();
			}else{
				GLOBAL.goBack();
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
		this.from = parseQuery(location.search);
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return false;
	},
	render: function() {


		var skipurl = '';
		if(this.from && this.from.skipurl)
			skipurl = '?skipurl='+this.from.skipurl;


		return (
			<div className="gg-body">
				<Header title={GLOBAL.setTitle('login')} right={null}  skipurl={true} />
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

								<Link className="tip" to={GLOBAL.setHref('register')}>注册新账号</Link>
							</div>
							<div className="u-buttonc f-fl">
								<Link className="tip" to={GLOBAL.setHref('forget')}>忘记密码</Link>
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