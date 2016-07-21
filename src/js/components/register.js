var Header = require('./header');


var Register = React.createClass({
	getInitialState: function() {

		return {
			s: 0
		}
	},
	shouldComponentUpdate: function(nextPros, nextState) {
		return nextState.s != this.state.s;
	},
	handleSubmit: function() {
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
				expires: 1000,
				secure: 'HttpOnly'
			};
			GLOBAL.cookie('userPhone', postData.mobile_num, {expires:1000});
			GLOBAL.cookie('userToken', data.token, options);
			// GLOBAL.setUser({
			// 	phone: postData.mobile_num,
			// 	token: postData.token
			// });

			//判断登陆后的跳转
			var isneed = false;
			if(that.from && that.from.skipurl){
				isneed = /\?/.test(that.from.skipurl);
				window.location.href = that.from.skipurl+(isneed?'':'?')+'token='+data.token+'&devicetoken='+GLOBAL.getUuid();
			}else{
				Router.goBack();
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
			//console.log(data);
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

		return (
			<div className="gg-body">
				<Header right={null} />
				<div className="m-registerblock m-userblocks">
					<form className="u-registerform u-userform">
						<div className="u-inputline">
							<input className="u-input" placeholder="手机号" type="tel" ref="mobile_num" />
						</div>
						<div className="u-inputline f-clearfix">
							<div className="u-inputc f-fl">
								<input className="u-input" placeholder="验证码" type="tel" ref="key" />
							</div>
							<div className="u-buttonc f-fl">
								<a className={"u-btn u-btn-full"+(this.state.s?' u-btn-disabled':'')} type="button" onClick={this.getCode}>{this.state.s && ('重新获取(' + this.state.s + ')') || '获取验证码'}</a>
							</div>
						</div>
						<div className="u-inputline">
							<input className="u-input" placeholder={this.props.forget && '新密码' || '密码'} type="password" ref="password" />
						</div>
						<div className="u-inputline">
							<a className="u-btn u-btn-full" onClick={this.handleSubmit}>完成</a>
						</div>
					</form>
				</div>
			</div>
		);
	}
});

module.exports  = Register;