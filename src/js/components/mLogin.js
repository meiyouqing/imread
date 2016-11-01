var Header = require('./header');
var myEvent = require('../modules/myEvent');
require('../../css/login.css');

var mLogin = React.createClass({
	mixins:[Mixins()],
	getInitialState: function() {
		return {
			login_data: {},
			show: false,
			registering: false,
			onlogin: false
		};
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var that = this;
		if (that.loading) {return ;}
		var postData = {
			user_identifier: this.refs.user_id.value,
			nick_name: this.refs.user_id.value,
			password: this.refs.password.value,
			channel: 6,
			//redirect_uri: "https://192.168.0.249:8080/mall/page.9.3/book/introduce.26601/reading/crossDomain.371742137.371742177.26601.1"
		};
		if (!GLOBAL.assertNotEmpty(postData.user_identifier, '请输入手机号')) {return ;}
		//if (!GLOBAL.assertMatchRegExp(postData.phone, /^1\d{10}$/, '请输入正确的手机号')) {return ;}
		if (!GLOBAL.assertNotEmpty(postData.password, '请输入密码')) {return ;}

		that.loading = true;
		AJAX.go('mLogin',postData, function(data) {
			that.loading = false;
			var options = {
				expires: 1000
			};
			//GLOBAL.cookie('userPhone', postData.phone, options);
			GLOBAL.cookie('userToken', data.token, options);
			GLOBAL.cookie('userId', data.userInfo.user_id, options);
			GLOBAL.setUser({
				phone: postData.phone,
				token: postData.token
			});

			// if(data.code == 200){
				this.disPatch('updateUser');
				this.disPatch('telBind');
				GLOBAL.goBack();
				myEvent.execCallback('m_login');

			// } else {
			// 	if(typeof data.error === 'string')
			// 		POP._alert(data.error);
			// 	else 
			// 		for(var key in data.error[0]){
			// 			POP._alert(data.error[0][key])
			// 		}
			// }
			
		}.bind(this), function(res) {
			that.loading = false;
			GLOBAL.defaultOnError(res);
		});
		return false;
	},
	goBack: function(){
		this.goBackUrl(this.props.route);
	},
	showPhone: function(){
		this.setState({show: !this.state.show});
	},
	showRegister: function(){
		this.setState({registering: !this.state.registering});
	},
	checkSms: function(content){
		var n = 0;
		this.showPhone();
		this.setState({onlogin: true});
		var times = setInterval(function(){
			if(n>=5) {
				clearInterval(time);	
				POP._alert('登录失败');
				this.setState({onlogin: false});
				return;
			};
			n++;
			AJAX.go('mSms',{
				cm: this.state.login_data.cm,
				smsContent:content,
				bookId: this.state.login_data.book_id,
				chapterId: this.state.login_data.chapter_id
			}, function(data) {
				if(data.code === 200){
					POP._alert('登录成功');
					this.setState({onlogin: false});
					clearInterval(times);
					GLOBAL.cookie('userToken', "loaded", {expires: 1000});
					this.disPatch('updateUser');
					this.disPatch('telBind');
					GLOBAL.goBack();
				}
			}.bind(this));
		}.bind(this),3000);
	},
	componentDidMount: function() {
		if(!this.props.location.state)	this.goBack();
		this.setState({login_data: this.props.location.state});

		// this.refs.selector.onclick = function(e){
		// 	if(e.target.tagName === 'A'){
		// 		this.showPhone();
		// 		var times = setInterval(function(){
		// 			AJAX.go('mSms',{}, function(data) {
		// 				//alert(JSON.stringify(data))
		// 			}.bind(this));
		// 		}.bind(this),2000);
		// 	};
		// }.bind(this);
		//this.refs.mobile_num.focus();
	},
	render: function() {
		var right =<button className="f-fr textBtn" onClick={this.showRegister}>注册</button>;
		var left = <a className="f-fl icon-s icon-back" onClick={this.goBack} ></a>;
		var isAndroid = GLOBAL.isAndroid();
		var loading = null;

		// if(this.state.onlogin)
		// 	loading = <div className="UI_confirm"></div>

		return (
			<div className="gg-body">
				<Header title="支付登录" right={right}  left={left} path={this.props.route}/>
				<div className="g-main g-main-1">
					{loading}
					<div className="bind-way">请使用咪咕账号登录，新用户请点击注册或快速登录</div>
					<div className="u-userform m-modify">
						<div className="u-inputline-2">
						<input className="u-input-2" type="text" ref="user_id" placeholder="手机号/用户名" />
						</div>
						<div className="u-inputline-2">
						<input className="u-input-2" type="password" ref="password" placeholder="密码" />
						</div>
						<div className="u-inputline f-pt-20"><button type="submit" onClick={this.handleSubmit} className="u-btn u-btn-full">登录</button></div>
						<div className="u-inputline n-b"><a className="u-btn u-btn-full red"  onClick={this.showPhone}>快速登录</a></div>
						<p className="u-notice">快速登录需发送短信，如遇拦截请选择允许。</p>
					</div>
				</div>

				<section className="m-select-phone">
						<div className={"m-wrapper"+(this.state.show?" show":"")} onClick={this.showPhone}></div>
						<div className={"UI_selecter"+(this.state.show?" show":"")} >
							<ul ref="selector">
								<li>请选择手机运营商</li>
								<li><a onClick={this.checkSms.bind(this,this.state.login_data.cmccRm)} href={"sms:"+this.state.login_data.smsTo+(isAndroid?"?":"&")+"body="+this.state.login_data.cmccContent}>中国移动</a></li>
								<li><a onClick={this.checkSms.bind(this,this.state.login_data.noCmccRm)} href={"sms:"+this.state.login_data.ltSmsto+(isAndroid?"?":"&")+"body="+this.state.login_data.noCmccContent}>中国联通</a></li>
							</ul>
							<button onClick={this.closeSex} className="UI-cancel" onClick={this.showPhone}>取消</button>
						</div>
				</section>

				<section className="m-r">
					<div className={"m-wrapper"+(this.state.registering?" show":"")} onClick={this.showRegister}></div>
					<div className={"m-r-notice" +(this.state.registering?" show":"")}>
						<div className="">
							<h1>注册咪咕账号</h1>
							<p><a href="sms:106580808">移动用户可发送6-14位手机密码 到 <span>106580808</span></a></p>
							<p><a href="sms:106554814018">联通用户可发送6-14位手机密码 到 <span>106554814018</span></a></p>
							<span>完成密码设置，手机号码即为用户名</span>
						</div>
						<button onClick={this.showRegister}>好</button>
					</div>
				</section>
				{this.props.children}
			</div>
		);
	}
});

module.exports  = mLogin;