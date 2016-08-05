var Header = require('./header');
var myEvent = require('../modules/myEvent');
require('../../css/login.css');

var Login = React.createClass({
	getInitialState: function() {
		return {
			status: true,
			s: 0
		};
	},
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

			if(data.code == 200){
			//判断登陆后的跳转
				var isneed = false;
				if(that.from && that.from.skipurl){
					isneed = /\?/.test(that.from.skipurl);
					window.location.href = that.from.skipurl+(isneed?'':'?')+'token='+data.token+'&devicetoken='+GLOBAL.getUuid();
				}else{
					GLOBAL.goBack();
					myEvent.execCallback('login');
				}
			} else {
				if(typeof data.error === 'string')
					POP._alert(data.error);
				else 
					for(var key in data.error[0]){
						POP._alert(data.error[0][key])
					}
			}
			
		}, function(res) {
			that.loading = false;
			GLOBAL.defaultOnError(res);
		});
		return false;
	},
	setLogin: function(){
		this.setState({status: true});
	},
	setRegister: function(){
		this.setState({status: false});
	},
	handleSubmits: function() {
		var that = this;
		if (that.loading) {return ;}
		var postData = {
			mobile_num: this.refs.mobile_num.value,
			key: this.refs.key.value,
			password: this.refs.password.value,
			device_identifier: GLOBAL.getUuid(),
			channel: 5,
			promot: that.from.channel?that.from.channel:'H5'
		};
		if (!GLOBAL.assertNotEmpty(postData.mobile_num, '请输入手机号')) {return ;}
		if (!GLOBAL.assertMatchRegExp(postData.mobile_num, /^1\d{10}$/, '请输入正确的手机号')) {return ;}
		if (!GLOBAL.assertNotEmpty(postData.key, '请输入验证码')) {return ;}
		if (!GLOBAL.assertNotEmpty(postData.password, '请输入密码')) {return ;}

		that.loading = true;
		AJAX.getJSON('POST', this.props.forget && '/api/auth/reset/password' || '/api/auth/register', postData, function(data) {
			that.loading = false;
			var options = {
				expires: 1000
			};
			GLOBAL.cookie('userPhone', postData.mobile_num,options);
			GLOBAL.cookie('userToken', data.token, options);
			GLOBAL.setUser({
				phone: postData.mobile_num,
				token: postData.token
			});

			if(data.code == 200){
				POP._alert('注册成功');
				//判断登陆后的跳转
				var isneed = false;
				if(that.from && that.from.skipurl){
					isneed = /\?/.test(that.from.skipurl);
					window.location.href = that.from.skipurl+(isneed?'':'?')+'token='+data.token+'&devicetoken='+GLOBAL.getUuid();
				}else{
					that.setState({status: true});
				}
			}
			else {
				if(typeof data.error === 'string')
					POP._alert(data.error);
				else 
					for(var key in data.error[0]){
						POP._alert(data.error[0][key])
					}
			}

		}, function(res) {
			that.loading = false;
			GLOBAL.defaultOnError(res);
		});
	},
	getCode: function() {
		if (this.state.s) {return ;}
		var mobile_num = this.refs.mobile_num.value;
		if (!GLOBAL.assertNotEmpty(mobile_num, '请输入手机号')) {return ;}
		if (!GLOBAL.assertMatchRegExp(mobile_num, /^1\d{10}$/, '请输入正确的手机号')) {return ;}

		AJAX.getJSON('GET', '/api/auth/key?', {
			phone: mobile_num,
			type: this.props.forget && 'reset' || 'register'
		}, function(data) {
			if(data.code !== 200)
				POP._alert(data.error[0].mobile);
		}, function(res) {
			this.setState({
				s: 0
			});
			GLOBAL.defaultOnError(res);
		}.bind(this));

		this.setState({
			s: 60
		});
		var inter = setInterval(function() {
			if (this.state.s > 0 && this.isMounted()) {
				this.setState({
					s: this.state.s - 1
				});
			} else {
				clearInterval(inter);
			}
		}.bind(this), 1000);
	},
	componentDidMount: function() {
		this.refs.mobile_num.focus();

		//判断来源from
		this.from = parseQuery(location.search);
	},
	render: function() {
		var skipurl = '',list;
		if(this.from && this.from.skipurl)
			skipurl = '?skipurl='+this.from.skipurl;

		if(this.state.status)
			list = (<div className="m-login">
						<form className="u-registerform u-userform" onSubmit={this.handleSubmit}>
								<div className="u-inputline-2">
									<input className="u-input-2 u-inputc" placeholder="手机号" type="tel" ref="mobile_num" />
								</div>
								<div className="u-inputline-2 f-clearfix">
										<input className="u-input-2" placeholder="密码" type="password" ref="password" />
								</div>

								<div className="u-inputline">
									<button type="submit" className="u-btn u-btn-full">登录</button>
								</div>
								<div className="u-inputline active f-clearfix">
									<div className="u-buttonc f-fl">
									<Link className="tip" to={GLOBAL.setHref('compact')}>用户协议</Link>
									</div>
									<div className="u-buttonc f-fl">
											<Link className="tip" to={GLOBAL.setHref('forget')}>忘记密码</Link>
									</div>
								</div>
						</form>
						
					</div>)
		else 
			list=(<div className="m-register">
						<form className="u-registerform u-userform">
								<div className="u-inputline-2">
									<input className="u-input-2 u-inputc" placeholder="手机号" type="tel" ref="mobile_num" />
									<div className="f-fr">
										<a className={"u-ymz u-n-bg "+(this.state.s?' u-btn-disabled':'')} type="button" onClick={this.getCode}>{this.state.s && ('重新获取(' + this.state.s + ')') || '获取验证码'}</a>
									</div>
								</div>
								<div className="u-b-pass">
									<div className="u-inputline-2 f-clearfix u-pass">
											<input className="u-input-2" placeholder="密码"  type="password" ref="password"/>
									</div>
									<div className="u-inputline-2 f-clearfix u-key">
											<input className="u-input-2" placeholder="验证码" type="tel" ref="key" />
									</div>
								</div>
								<div className="u-inputline">
									<a className="u-btn u-btn-full" onClick={this.handleSubmits}>完成</a>
								</div>

								<div className="u-inputline active f-clearfix">
									<div className="u-buttonc f-fl">
									<Link className="tip" to={GLOBAL.setHref('compact')}>用户协议</Link>
									</div>
									<div className="u-buttonc f-fl">
											<Link className="tip" to={GLOBAL.setHref('forget')}>忘记密码</Link>
									</div>
								</div>
							</form>
					</div>)
		return (
			<div className="gg-body">
				<div className="m-loginblock">
					<div className="m-login-header">
						<a className="f-fl icon-s icon-back" onClick={GLOBAL.goBack} ></a>
						<div className="m-login-register">
							<a className={this.state.status?'':"active"} onClick={this.setRegister}>注册</a>
							<a className={"second "+(this.state.status?"active":'')} onClick={this.setLogin}>登录</a>
						</div>
					</div>
					{list}
				</div>
				{/*<div className="m-loginblock m-userblocks">
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
				</div>*/}
				{this.props.children}
			</div>
		);
	}
});

module.exports  = Login;