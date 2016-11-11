if(typeof window !== 'undefined'){
	var POP = require('../modules/confirm')
}
import browserHistory from 'react-router/lib/browserHistory'
import AJAX from '../modules/AJAX'
import GLOBAL from '../modules/global'
import Mixins from '../modules/mixins'
import React from 'react'
var Header = require('./header');
if(typeof window !== 'undefined'){
	require('../../css/userinfo.css');
}
var EditUsername = React.createClass({
	mixins: [Mixins()],
	getInitialState: function() {
		return {
		};
	},
	editname: function(){

		if(!this.refs.username.value) {POP._alert('昵称不能为空'); return;}

		var pramas = {
			user_name:this.refs.username.value.trim()
		}

		// AJAX.go('edituser',pramas,function(res){
		// 	if(res.code === 200){
		// 		GLOBAL.goBack();
		// 		this.disPatch('updateUser');
		// 	} else {
		// 		if(typeof res.error === 'string')
		// 			POP._alert(res.error);
		// 		else 
		// 			for(var key in res.error[0]){
		// 				POP._alert(res.error[0][key])
		// 			}
		// 	}
		// }.bind(this));
		var backUrl = location.pathname.replace('/'+this.props.route.path,'');
		browserHistory.push({pathname: backUrl,state: pramas});
	},
	clearValue: function(){
		this.refs.username.value = '';
		return;
	},
	componentDidMount: function() {
		this.refs.username.focus();
		const username = this.props.location.state.username;
		this.refs.username.value = username || ''; 
		this.refs.username.oninput = function(e){
			if(this.refs.username.value.length>10)
				this.refs.username.value = this.refs.username.value.substring(0,10);
		}.bind(this);
	},
	render: function() {
		var right = <span onClick={this.editname} className="iconfont icon-duihao f-fr"></span>;
		return (
			<div className="gg-body">
				<Header title={"修改昵称"} right={right}  path={this.props.route}  />
				<div className="g-main g-main-1 m-username">
					<section className="m-name-input">
						<input type="text" ref="username" placeholder="10个字以内，支持中英文、数字" />
						<span className="iconfont icon-cha" onClick={this.clearValue}></span>
					</section>
				</div>
			</div>
		);
	}
});

module.exports = EditUsername;