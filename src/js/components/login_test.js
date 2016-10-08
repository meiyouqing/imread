var Header = require('./header');
var myEvent = require('../modules/myEvent');
require('../../css/login.css');

var Login = React.createClass({
	mixins:[Mixins()],
	getInitialState: function() {
		return {
			status: true,
			s: 0,
			QQ_loading: false,
			WX_loading: false
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
			that.loading = false;
			//GLOBAL.cookie('userPhone', postData.phone, options);
			
			GLOBAL.setUser({
				phone: postData.phone,
				token: postData.token
			});

			if(data.code == 200){
				GLOBAL.cookie('userToken', data.token, options);
				// GLOBAL.cookie('uuid', data.userInfo.uuid || GLOBAL.getUuid(), options);
				that.disPatch('updateUser');
				that.disPatch('updateMall');
				//判断登陆后的跳转
				if(that.from && that.from.skipurl){
					window.location.href = that.from.skipurl.replace(/\?devicetoken([^\"]*)/,'')+'?devicetoken='+(data.userInfo.uuid || GLOBAL.getUuid());
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
		AJAX.getJSON('POST', '/api/v1/auth/register', postData, function(data) {
			that.loading = false;
			var options = {
				expires: 1000
			};
			
			GLOBAL.setUser({
				phone: postData.mobile_num,
				token: postData.token
			});

			if(data.code == 200){
				GLOBAL.cookie('userPhone', postData.mobile_num,options);
				GLOBAL.cookie('userToken', data.token, options);
				// GLOBAL.cookie('uuid', GLOBAL.getUuid(), options);
				that.disPatch('updateUser');
				that.disPatch('updateMall');
				POP._alert('注册成功');
				//判断登陆后的跳转
				//var isneed = false;
				if(that.from && that.from.skipurl){
					//isneed = /\?/.test(that.from.skipurl);
					window.location.href = that.from.skipurl.replace(/\?devicetoken([^\"]*)/,'')+'?devicetoken='+GLOBAL.getUuid();
				}else{
					// that.setState({status: true});
					GLOBAL.goBack();
					myEvent.execCallback('login');
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
	goBack: function(){
		if(this.from && this.from.skipurl){
			window.location.href = this.from.skipurl;
			return;
		}
		this.goBackUrl(this.props.route);
	},
	getCode: function() {
		if (this.state.s) {return ;}
		var mobile_num = this.refs.mobile_num.value;
		if (!GLOBAL.assertNotEmpty(mobile_num, '请输入手机号')) {return ;}
		if (!GLOBAL.assertMatchRegExp(mobile_num, /^1\d{10}$/, '请输入正确的手机号')) {return ;}
		
		var inter;
		clearInterval(inter);
		AJAX.getJSON('GET', '/api/auth/key?', {
			phone: mobile_num,
			type: 'register'
		}, function(data) {
			if(data.code !== 200){
				if(typeof data.error === 'string')
					POP._alert(data.error);
				else 
					for(var key in data.error[0]){
						POP._alert(data.error[0][key])
					}
			} else {
				this.setState({
					s: 60
				});
				inter = setInterval(function() {
					if (this.state.s > 0 && this.isMounted()) {
						this.setState({
							s: this.state.s - 1
						});
					} else {
						clearInterval(inter);
					}
				}.bind(this), 1000);
			}	
		}.bind(this), function(res) {
			this.setState({
				s: 0
			});
			GLOBAL.defaultOnError(res);
		}.bind(this));
	},
	//安卓下键盘位移
	timeoutId:0,
	handleFocus:function (e){
		if(!GLOBAL.isAndroid()) return;
		const target = e.target;
		clearTimeout(this.timeoutId);
		this.refs.loginBlock.style.height = '1000px';
		this.refs.gScroll.scrollTop = 205;
		target.focus();
	},
	handleBlur:function (){
		if(!GLOBAL.isAndroid()) return;
		this.timeoutId = setTimeout(()=>{
			this.refs.loginBlock.style.height = '100%';
			this.refs.gScroll.scrollTop = 0;				
		},100)
	},
	componentDidMount: function() {
		//判断来源from
		this.from = parseQuery(location.search);
		var  that = this;
		//if(GLOBAL.cookie('__qc__k')){
			QC.Login({
	    			// btnId: "qqLoginBtn"
			}, function(reqData, opts) { //登录成功
			    var paras = {};
			    that.setState({QQ_loading: true});
			     QC.Login.getMe(function(openId, accessToken){  
				        AJAX.go('login_qq',{
				        	user_identifier:openId,
				        	promot:'H5',
				        	channel:'3',
				        	img_url: reqData.figureurl_qq_2,
				        	nick_name:reqData.nickname},function(data){

						that.do_result(data);
					});
			    });  
			}, function(opts) {
				//this.setState({WX_loading: false,QQ_loading: false});
			});
		//}

		if(this.from  && this.from.code) {
			this.setState({WX_loading: true});
			   AJAX.go('login_wx',{
			   	appid:'wxd64e6afb53e222ca',
        			secret: 'aa53581e0f0ba8a31c32be82c153d8d9',
        			code: this.from.code,
        			grant_type: 'authorization_code'
			   },function(res){
			   	that.do_result(res);
			   })
		}
	},
	do_result: function(data){
		var that = this;
		if(data.code == 200){
			GLOBAL.cookie('userToken', 'loaded');
			that.disPatch('updateUser');
			that.disPatch('updateMall');
			//判断登陆后的跳转
			if(that.from && that.from.skipurl){
				window.location.href = that.from.skipurl.replace(/\?devicetoken([^\"]*)/,'')+'?devicetoken='+(data.userInfo.uuid || GLOBAL.getUuid());
			}else{
				// GLOBAL.goBack();
				// myEvent.execCallback('login');
				window.location.href =location.href.replace('/login_test','');
			}
		} else {
			this.setState({WX_loading: false,QQ_loading: false});
			POP._alert('登录失败');
		}
	},
	QQ_login: function(){
		// this.setState({QQ_loading: true});
    		return window.open('https://graph.qq.com/oauth2.0/authorize?client_id=101354986&response_type=token&scope=all&redirect_uri=https%3A%2F%2Fm.imread.com%2Fiframe%2FQQ_Url%2Findex.html', 'oauth2Login_10076' ,'height=525,width=585, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes');
  	},
  	WX_login: function(){
  		if(this.is_WX()){
  			window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd64e6afb53e222ca&redirect_uri='+encodeURIComponent(location.href)+'&response_type=code&scope=snsapi_login&state=123&connect_redirect=1#wechat_redirect';
  		}else
  			browserHistory.push(GLOBAL.setHref('wx_guide'));
  	},
  	is_WX: function(){
  		var ua = window.navigator.userAgent.toLowerCase();
	    	if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	        	return true;
	   	}else{
	   	      return false;
	   	}
  	},
	render: function() {
		var list;
		var loading = <Loading />
		if(this.state.QQ_loading || this.state.WX_loading)
			return (<div className="gg-body">
					{loading}
					</div>);
		if(this.state.status)
			list = (<div className="m-login">
						<form className="u-registerform u-userform" onSubmit={this.handleSubmit}>
								<div className="u-inputline-2">
									<input className="u-input-2 u-inputc" placeholder="手机号" type="tel" ref="mobile_num" onClick={this.handleFocus} onBlur={this.handleBlur} />
								</div>
								<div className="u-inputline-2 f-clearfix">
										<input className="u-input-2" placeholder="密码" type="password" ref="password" onClick={this.handleFocus} onBlur={this.handleBlur} />
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
									<input className="u-input-2 u-inputc" placeholder="手机号" type="tel" ref="mobile_num" onClick={this.handleFocus} onBlur={this.handleBlur} />
									<div className="f-fr">
										<a className={"u-ymz u-n-bg "+(this.state.s?' u-btn-disabled':'')} type="button" onClick={this.getCode}>{this.state.s && ('重新获取(' + this.state.s + ')') || '获取验证码'}</a>
									</div>
								</div>
								<div className="u-b-pass">
									<div className="u-inputline-2 f-clearfix u-pass">
											<input className="u-input-2" placeholder="密码"  type="password" ref="password" onClick={this.handleFocus} onBlur={this.handleBlur}/>
									</div>
									<div className="u-inputline-2 f-clearfix u-key">
											<input className="u-input-2" placeholder="验证码" type="tel" ref="key" onClick={this.handleFocus} onBlur={this.handleBlur}/>
									</div>
								</div>
								<div className="u-inputline">
									<a className="u-btn u-btn-full" onClick={this.handleSubmits}>完成</a>
								</div>

								<div className="u-inputline active f-clearfix">
									<div className="u-buttonc f-fl">
									<Link className="tip" to={GLOBAL.setHref('compact')}>用户协议</Link>
									</div>
								</div>
							</form>
					</div>)
		return (
			<div className="gg-body">
				<div className="g-scroll" ref="gScroll">
					<div className="m-loginblock" ref="loginBlock">
						<div className="m-login-header">
							<a className="f-fl icon-s icon-back" onClick={this.goBack} ></a>
							<div className="m-login-register">
								<a className={this.state.status?'':"active"} onClick={this.setRegister}>注册</a>
								<a className={"second "+(this.state.status?"active":'')} onClick={this.setLogin}>登录</a>
							</div>
						</div>
						{list}
						<div className="third-login">
							<div className="t-title"><span>第三方账号登录</span></div>
							<div className="t-login">
								<a onClick={this.QQ_login} className="QQ_Login"></a>
								<a onClick={this.WX_login} className="WX_Login"></a>
							</div>
						</div>
					</div>
				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports  = Login;