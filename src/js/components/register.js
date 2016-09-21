if(typeof window !== 'undefined'){
	var POP = require('../modules/confirm')
}
import parseQuery from '../modules/parseQuery'
import GLOBAL from '../modules/global'
import React from 'react'
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
			promot: 'H5'
		};
		if (!GLOBAL.assertNotEmpty(postData.mobile_num, '请输入手机号')) {return ;}
		if (!GLOBAL.assertMatchRegExp(postData.mobile_num, /^1\d{10}$/, '请输入正确的手机号')) {return ;}
		if (!GLOBAL.assertNotEmpty(postData.key, '请输入验证码')) {return ;}
		if (!GLOBAL.assertNotEmpty(postData.password, '请输入密码')) {return ;}
		if(postData.password.trim().length<6) {
			POP._alert('密码不能少于6位');
			return;
		}

		that.loading = true;
		AJAX.getJSON('POST','/api/v1/auth/reset/password', postData, function(data) {
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

			//判断登陆后的跳转
			if(data.code == 200){
				POP._alert('修改成功');
				//判断登陆后的跳转
				GLOBAL.goBack();
			} else {
				if(typeof data.error === 'string')
					POP._alert(data.error);
				else {
					for(var key in data.error[0]){
						POP._alert(data.error[0][key])
					}
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

		var inter;
		clearInterval(inter);
		AJAX.getJSON('GET', '/api/auth/key?', {
			phone: mobile_num,
			type: 'reset'
		}, function(data) {
			if(data.code == 200){
				POP._alert('发送成功');

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
			} else {
				if(typeof data.error === 'string')
					POP._alert(data.error);
				else {
					for(var key in data.error[0]){
						POP._alert(data.error[0][key])
					}
				}
			}
		}.bind(this), function(res) {
			this.setState({
				s: 0
			});
			GLOBAL.defaultOnError(res);
		}.bind(this));
	},
	componentDidMount: function() {
		//this.refs.mobile_num.focus();
		//判断来源from
		//this.from = parseQuery(location.search);
	},
	render: function() {
			{/*<div className="gg-body">
				<Header right={null} path={this.props.route}/>
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
			</div>*/}
		return (

			<div className="g-ggWraper  gg-body">
				<Header right={null} title={'忘记密码'} path={this.props.route}/>
				<div className="g-main">
					<div className="u-userform m-modify m-forget">
						<div className="u-inputline-2">
							<input className="u-input-2 phone" type="tel" ref="mobile_num" placeholder="手机号" />
							<div className="f-fr">
								<a className={"u-ymz u-n-bg "+(this.state.s?' u-btn-disabled':'')} type="button" onClick={this.getCode}>{this.state.s && ('重新获取(' + this.state.s + ')') || '获取验证码'}</a>
							</div>
						</div>
						<div className="u-inputline-2">
							<input className="u-input-2" type="tel" ref="key" placeholder="验证码" />
						</div>
						<div className="u-inputline-2">
							<input className="u-input-2" type="password" ref="password" placeholder="新密码" />
						</div>

						<div className="u-inputline m-25">
									<a className="u-btn u-btn-full" onClick={this.handleSubmit}>完成</a>
								</div>
					</div>
				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports  = Register;