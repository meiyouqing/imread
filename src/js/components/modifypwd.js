if(typeof window !== 'undefined'){
	var POP = require('../modules/confirm')
}
import Ajax from '../modules/AJAX'
import GLOBAL from '../modules/global'
import Mixins from '../modules/mixins'
import React from 'react'
var Header = require('./header');
var Modifypwd = React.createClass({
	mixins: [Mixins()],
	clickHandle: function(){
		var old_pwd = this.refs.old_pwd.value,
			new_pwd = this.refs.new_pwd.value,
			new_pwd_s = this.refs.new_pwd_s.value;

		if(!this.showNotice(old_pwd,'请输入旧密码')) return;
		if(!this.showNotice(new_pwd,'请输入新密码')) return;
		if(new_pwd.length<6) {POP._alert('密码不能少于6位'); return}
		if(!this.showNotice(new_pwd_s,'请确认新密码')) return;
		if(new_pwd !== new_pwd_s) {POP._alert('新密码不一致');  return;}

		var pramas = {oldPasswd: old_pwd,password:new_pwd};
		const AJAX = new Ajax('pwd');
		AJAX.go(pramas,function(data){
			if(data.code === 200) {
				POP._alert('密码修改成功');
				setTimeout(function(){
					GLOBAL.goBack();
				},500);
			} else
				POP._alert(data.error[0].password || "修改失败");
		});
	},
	showNotice: function(prama,notice){
		if(!prama){
			POP._alert(notice);
			return false;
		} else{
			return true;
		}

	},
	componentDidMount: function(){
		this.checkLogin(this.props.route);
	},
	render:function() {
		var right = <div className="f-fr iconfont icon-duihao" onClick={this.clickHandle} ></div>;
		return (
			<div className="g-ggWraper  gg-body">
				<Header right={right} title={'修改密码'} path={this.props.route}/>
				<div className="g-main">
					<div className="u-userform m-modify">
						<div className="u-inputline-2">
						<input className="u-input-2" type="password" ref="old_pwd" placeholder="旧密码" />
						</div>
						<div className="u-inputline-2">
						<input className="u-input-2" type="password" ref="new_pwd" placeholder="新密码" />
						</div>
						<div className="u-inputline-2">
						<input className="u-input-2" type="password" ref="new_pwd_s" placeholder="再次输入新密码" />
						</div>
					</div>
				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports  = Modifypwd;