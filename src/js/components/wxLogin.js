import parseQuery from '../modules/parseQuery'
import browserHistory from 'react-router/lib/browserHistory'
import Ajax from '../modules/AJAX'
import React from 'react'
import Mixins from '../modules/mixins'
import storage from '../modules/storage'
if(typeof window !== 'undefined'){
	var POP = require('../modules/confirm')
}

var WxLogin = React.createClass({
	mixins: [Mixins()],
    componentDidMount: function(){
		var that = this;
		this.from = parseQuery(location.search);
        
        if(!this.from.code){
            POP._alert(this.from.code+' 登录失败');
            browserHistory.replace('/');
            return;

        }
		if(this.isWx() && this.from  && this.from.code && this.from.state == '123') {
			const AJAX = new Ajax('login_wx');
            AJAX.go({
                code: this.from.code,
                grant_type: 'authorization_code'
            },function(res){
                that.do_result(res);
            },function(){window.history.go(-1)})
		}
    },
	do_result: function(data){
		var that = this;
		if(data.code == 200){
			storage.set('userToken', 'loaded');
			if(this.from.callback){
				window.location = decodeURIComponent(this.from.callback);
            }else{
                browserHistory.replace('/');
            }
		} else {
			POP._alert('登录失败');
		}
	},
    render:function(){
        return <p className="WxLogin">正在微信登录...</p>
    }
})
module.exports = WxLogin;