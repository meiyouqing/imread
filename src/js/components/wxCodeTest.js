import parseQuery from '../modules/parseQuery'
import browserHistory from 'react-router/lib/browserHistory'
import Ajax from '../modules/AJAX'
import React from 'react'
import Mixins from '../modules/mixins'
import storage from '../modules/storage'

var WxCode = React.createClass({
	mixins: [Mixins()],
    componentDidMount: function(){
		var that = this;
		this.from = parseQuery(location.search);

        if(!this.from.code){
            POP._alert(this.from.code+' 登录失败');
            browserHistory.replace('/');
            return;

        }
        if(this.isWx() && this.from  && this.from.code && this.from.state == 'wxPay') {
                if(this.from.callback){
                    location.href = this.from.callback+location.search;
                }
                else
                    location.href="http://223.95.81.227:8082/pay/web/order"+location.search
        }
    },
    render:function(){
        return  (<div className="gg-body"> 
                <p className="WxLogin">正在微信验证...</p>
            </div>)
    }
})
module.exports = WxCode;