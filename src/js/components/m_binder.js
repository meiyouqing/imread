var Header = require('./header');


var Register = React.createClass({
	mixins: [Mixins()],
	getInitialState: function() {
		return {
			s: 0,
			bindDetail: null,
			img_code: null,
			img_show: false,
			bind_phone: null,
			url: null,
			getBind: false,
			isBind: false
		}
	},
	handleSubmit: function(isImgCode) {
		var that = this;
		var postData = {
			cm: this.props.location.state.cm,
			purl: this.state.bindDetail.purlValue,
			//getCode: this.state.bindDetail.getcode,
			tokenid: this.state.bindDetail.tokenidValue,
			submitUrl:this.state.bindDetail.submitUrl,
			msisdn:  this.refs.mobile_num.value,
			code: this.refs.key.value,
			verifyNum: isImgCode?this.refs.img_key.value:null
		};
		if (!GLOBAL.assertNotEmpty(postData.msisdn, '请输入手机号')) {return ;}
		if (!GLOBAL.assertMatchRegExp(postData.msisdn, /^1\d{10}$/, '请输入正确的手机号')) {return ;}
		if (!GLOBAL.assertNotEmpty(postData.code, '请输入验证码')) {return ;}

		AJAX.getJSON('POST','/api/v1/migu/get/bind/yzm', postData, function(data) {
			if(data.code === 200 && data.success.content){
				 if(data.success.img_url){
				 	this.setState({img_code: ("data:image/jpeg;base64,"+data.success.img_url),img_show: true})
				 } else {
				 	if(data.success.content.indexOf('成功')>=0){
					 	 POP._alert(data.success.content);
					 	 this.disPatch('telBind');
					 	 this.setState({isBind: true,img_code: null,img_show: false});
				 	}
				 }
				 
			} else if(data.code === 403) {
	                    POP._alert(data.error.error);
	                    this.setState({isBind: false,img_code: null,img_show: false});
			}
		}.bind(this), function(res) {
			GLOBAL.defaultOnError(res);
		});
	},
	removeImg: function(){
		this.setState({img_code: null,img_show: false})	 	
	},
	getCode: function() {
		if (this.state.s) {return ;}
		var mobile_num = this.refs.mobile_num.value;
		if (!GLOBAL.assertNotEmpty(mobile_num, '请输入手机号')) {return ;}
		if (!GLOBAL.assertMatchRegExp(mobile_num, /^1\d{10}$/, '请输入正确的手机号')) {return ;}

		AJAX.getJSON('POST', '/api/v1/migu/get/bind/yzm', {
			cm: this.props.location.state.cm,
			purl: this.state.bindDetail.purlValue,
			getCode: this.state.bindDetail.getcode,
			msisdn: mobile_num,
			tokenid: this.state.bindDetail.tokenidValue,
			submitUrl:this.state.bindDetail.submitUrl
		}, function(data) {
			if(data.success.img_url)
				this.setState({img_code: ("data:image/jpeg;base64,"+data.success.img_url),img_show: true})
			if(data.code === 200 && data.success.content){
				 POP._alert(data.success.content);
				// this.getBind();
			}
			
		}.bind(this), function(res) {
			this.setState({
				s: 0
			});
			GLOBAL.defaultOnError(res);
		}.bind(this));

		this.setState({
			s: 60
		});
		var inter= setInterval(function() {
			if (this.state.s > 0 && this.isMounted()) {
				this.setState({
					s: this.state.s - 1
				});
			} else {
				clearInterval(inter);
			}
		}.bind(this), 1000);
	},
	getBindDetail: function(){
		AJAX.getJSON('GET','/api/v1/migu/get/bind', {cm: this.props.location.state.cm}, function(data) {
			if(data.code === 200){
				this.setState({bindDetail: data.success});
			}
			else
				 POP._alert('获取失败');
		}.bind(this));
	},
	unBind: function(){
		AJAX.getJSON('POST','/api/v1/migu/mobile/unbind', {cm: this.props.location.state.cm,url:this.props.location.state.url}, function(data) {
			if(data.code === 200){
				this.setState({bind_phone: null,url: null,isBind: false,s: 0});
				this.disPatch('telBind');
			} else
				POP._alert('解绑失败');
		}.bind(this));
	},
	getBind: function(){
		AJAX.go('mBind',{
				cm:this.props.location.state.cm
			},function(data){
			this.setState({getBind:true,bind_phone: data.success.bind_phone,url:data.success.unbind_url || null});
			if(data.success.unbind_url)
				this.setState({isBind: true})
		}.bind(this));
	},
	componentDidMount: function() {
		if(!this.props.location.state){GLOBAL.goBack(); return;}
		this.getBindDetail();
		this.getBind();
		//this.refs.mobile_num.focus();
	},
	shouldComponentUpdate: function(nextPros, nextState) {
		return this.state.s !== nextState.s
			|| this.props.children !== nextPros.children
			|| this.state.bindDetail !== nextState.bindDetail
			|| this.state.url !== nextState.url
			|| this.state.isBind !== nextState.isBind
			|| this.state.getBind !== nextState.getBind;
	},
	render: function() {

		var list =  <Loading />;

		if(this.state.getBind){
			if(this.state.isBind){
					list = (<div className="g-main m-binder">
						<div className="bind-way">{'当前支付方式：'+(this.state.bind_phone || '空')}</div>
						<div className="u-inputline j-b">
								<a className="u-btn u-btn-full" onClick={this.unBind}>解除绑定</a>
								<p className="u-notice">如需更换支付号码，请先解绑</p>
						</div>

						</div>)
			}
			else
				list = (<div className="g-main m-binder">
						<div className="bind-way">{'当前支付方式：'+(this.state.bind_phone||'空')}</div>
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

							<div className="u-inputline m-25">
										<a className="u-btn u-btn-full" onClick={this.handleSubmit}>完成</a>
									</div>
						</div>
					</div>)
		}

		var img_code = (<div className={"img-block" + (this.state.img_show?' show':'')}>
			<div className={"m-wrapper show"} onClick={this.showPhone}></div>
			<div className={"img-code"}>
				<img src={this.state.img_code} />
				<input type="text" ref="img_key" placeholder="验证码" />
				<div className="btns f-flexbox">
					<button className="f-flex1" onClick={this.removeImg}>取消</button>
					<button className="f-flex1" onClick={this.handleSubmit.bind(this,true)}>确定</button>
				</div>
			</div>
			</div>)

		return (

			<div className="g-ggWraper  gg-body">
				<Header right={null} title={'支付号码'} path={this.props.route}/>
				{list}
				{img_code}
				{this.props.children}
			</div>
		);
	}
});

module.exports  = Register;