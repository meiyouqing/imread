import myEvent from '../modules/myEvent'
import { browserHistory } from 'react-router'
import AJAX from '../modules/AJAX'
import GLOBAL from '../modules/global'
import Mixins from '../modules/mixins'
import React from 'react'
if(typeof window !== 'undefined'){
	var POP = require('../modules/confirm')
}
var Header = require('./header');

if(typeof window !== 'undefined'){
	require('../../css/pay.css');
}

var Order = React.createClass({
	mixins: [Mixins()],
	rechargeHandle: function(e) {
		if(this.props.isMigu){
			browserHistory.push(GLOBAL.setHref('m_recharge'));
		} else {
		 	var hash = location.pathname;
			browserHistory.push('/pay?backUrl='+encodeURIComponent(location.href));
			myEvent.setCallback('recharge',function(){
				browserHistory.push(hash);
				//this.getBalance();
			}.bind(this));
		}
 	},
	payHandle: function(count) {
		var that = this;
		if(this.props.isMigu){
			if(!this.state.bind_phone || this.state.bind_phone=="未绑定手机"){this.gotoBind();return}
			AJAX.go('mOrder',{
				book_id:this.props.introduce.book_id,
				chapter_id:this.props.chapterid,
				cm:this.props.data.cm,
				firmnum:'',
				count:count
			},function(data){
				if(data.code == 403)
					POP._alert('支付失败');
				else {
					that.props.goBack();
				}
			});
		} else {
			if((this.state.aidou-this.props.data.marketPrice)>=0){
				AJAX.getJSON('GET',this.props.data.orderUrl,{},function(data){
					if(data.code == 403)
						POP._alert('支付失败');
					else {
						that.disPatch('updateUser');
						that.props.goBack();
						if(that.props.introduce.charge_mode == 2)
							that.props.storeBookOrdered(that.props.chapterid);
						else
							that.props.storeBookOrdered(that.props.chapterid,true);
					}
					// var autoPay = that.props.chargeMode==2? true:false;
					// that.props.paySuccess(data, autoPay);
				});
			}else{
				POP._alert('艾豆不足，请充值');
				this.rechargeHandle();
			}
		}
	},
	getBalance: function(){
		AJAX.getJSON('GET','/api/v1/auth/balance',{},function(data){
			this.setState({
				aidou: data.success.balance/100
			});
		}.bind(this))

	},
	getBind: function(){
		AJAX.go('mBind',{
				cm:this.props.data.cm
			},function(data){
			
			this.setState({bind_phone: data.success.bind_phone||'未绑定手机',url:data.success.unbind_url || null});
			this.setState({another:!data.success.unbind_url?(<div className="block f-clearfix m-order-left" onClick={this.gotoBind}>
					<div className="f-fl lh-30"><span className="f-mr-5">让他来买单</span></div>
					<div className="f-fr f-s-14 bind-box">
						<span className="l-30">绑定TA的手机号</span>
						<span className="icon-h icon-return-black show"></span>
					</div>
				</div>):null});
		}.bind(this));
	},
	gotoBind: function(){
		browserHistory.push({pathname:GLOBAL.setHref('m_binder'),state:{cm: this.props.data.cm,bind_phone: this.state.bind_phone,url: this.state.url}});
	},
	selectAnswer: function(index){
		console.log(index)
	},
	getInitialState: function(){
		return {
			aidou: 0,
			bind_phone: '',
			url: null,
			another: null
		}
	},
	shouldComponentUpdate: function(nextPros, nextState) {

		return this.state.aidou !== nextState.aidou
			|| this.props.children !== nextPros.children
			|| this.state.bind_phone !== nextState.bind_phone
			|| this.state.another !== nextState.another
			|| this.props.data !== nextPros.data;
	},
	componentDidMount: function() {
		this.dataInit();
		document.addEventListener('telBind',this.dataInit);

		if(!this.props.isMigu) {
			 document.addEventListener('rechargeSuccess',this.getBalance,false);
		};
	},
	dataInit: function(){
		if(!this.props.isMigu) {
			this.getBalance();
		} else {
			this.getBind();
		}
	},
	componentWillUnmount: function(){
		 document.removeEventListener("telBind", this.dataInit, false);
		 document.removeEventListener('rechargeSuccess',this.getBalance);
	},
	render: function() {
		var isMigu = this.props.isMigu;
		var twenty = (isMigu && this.props.data.twentyPrice)?<div className="yhui" onClick={this.payHandle.bind(this,20)}>20章优惠价<span className="f-fc-EF5">{this.props.data.twentyPrice}</span>元</div>:null;
		var baseQuestion = null,code=null,telephoneBlock=null;
		var list =  null;

		if(isMigu){
			if(!this.state.bind_phone)
				list = (<div className="m-mg-loading"><Loading /></div>)
			telephoneBlock = <section>
				<div className="block f-clearfix m-order-left" onClick={this.gotoBind}>
					<div className="f-fl lh-30"><span className="f-mr-5">支付号码</span></div>
					<div className="f-fr f-s-14 bind-box">
						<span className="l-30">{this.state.bind_phone}</span>
						<span className="icon-h icon-return-black show"></span>
					</div>
				</div>
				{this.state.another}
			</section>
		}

		// if(this.props.data.verifyCodePicUrl){
		// 	baseQuestion = 'data:image/jpeg;base64,'+this.props.data.verifyCodePicUrl;
		// 	var list = this.props.data.answerList[this.props.data.answerList.length-1],arr=[];
		// 	for(var key in list){
		// 		arr.push(list[key])
		// 	};
		// 	code = (<div className="m-o-code">
		// 			<img src={baseQuestion} />
		// 			<div className="f-fr">
		// 			{	
		// 				arr.map(function(i,v){
		// 					return <img key={v} onClick={this.selectAnswer.bind(this,v)} src={"data:image/jpeg;base64,"+i} />
		// 				}.bind(this))
		// 			}
		// 			</div>
		// 		</div>)
		// };

		return (<div>
				{	
					<div className="m-order">
						{list}
						<div className="block">
							<div className="m-order-detail">
								<h5 className="f-mb10 f-ellipsis">《{this.props.introduce.book_name}》</h5>
								<p className="chapter f-pb-10 f-ellipsis">{(this.props.introduce.charge_mode == 2) ?this.props.data.name:"全本购买"}</p>
							</div>
							<p className="f-tr f-l-50"><span className="f-fl f-r-notice">{(this.props.introduce.charge_mode == 2) ?'支付成功后将自动续订':""}</span><span className="f-fc-EF5">{this.props.data.marketPrice || this.props.introduce.price}</span><span className="f-s-y">¥</span><span className="f-fc-000">需支付</span></p>
						</div>
						<div className="block f-clearfix m-order-left">
							<div className="f-fl lh-30"><span className="f-mr-5">{isMigu?"书券余额":"艾豆余额"}</span></div>
							<div className="f-fr f-s-14"><span className="f-fc-777">¥&nbsp;{(isMigu?this.props.data.ticketBalance:this.state.aidou) || 0}</span><input type="button"  className="btn-cz" onClick={this.rechargeHandle} value="充值" /></div>
						</div>
						{telephoneBlock}
						{code}
						<div className="f-mt-40"><input type="button" className="u-btn u-btn-full" onClick={this.payHandle.bind(this,1)} value="确认订购" /></div>
						{twenty}
					</div>}
			</div>
		);
	}
});

module.exports  = Order;