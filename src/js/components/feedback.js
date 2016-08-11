var Header = require('./header');

var Feedback = React.createClass({
	componentDidMount: function() {
		this.refs.contact.focus();
	},
	handleSubmit: function() {
		var message = this.refs.message.value.trim();
		var contact = this.refs.contact.value.trim();

		if (!GLOBAL.assertNotEmpty(message, '内容不能为空')) {return ;}
		if (!GLOBAL.assertNotEmpty(contact, '内容不能为空')) {return ;}  

		AJAX.go("advice", {
			'message': message,
			'contact': contact,
			'type': 'unEncode'
		}, function(data) {
			POP._alert(data.success);
			GLOBAL.goBack();
		});
		return false;
	},
	copy: function(){
		this.refs.gzh.select();
		try{
			var suc = document.execCommand('copy');
			var msg = suc? 'QQ群号已复制到剪切板' : '复制失败，请手动复制';
			POP._alert(msg);
		}catch(e){
			POP._alert('复制失败，请手动复制');
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return false;
	},
	render: function() {
		var right = <span className="f-fr icon-s icon-right" onClick={this.handleSubmit} ></span>;
		return (
			<div className="gg-body">
				<Header right={right} path={this.props.route}/>
				<div className="m-feedbackblock m-userblocks">
					<form className="u-feedbackform u-userform">	
						<div className="u-inputline">
							<input className="u-input" placeholder="请填写你的联系方式，如手机号、QQ号" ref="contact" />
						</div>
						<div className="u-inputline">
							<textarea className="u-input u-textarea" placeholder="期待您的反馈，您的意见是我们进步的最大动力哦" ref="message"></textarea>
						</div>				
					</form>

					<div className="u-feed-footer">
						<a target="_blank" href="http://shang.qq.com/wpa/qunwpa?idkey=9c3536c0e460081dec83bd8b6646c29945063d0f2a3bd17a50326c0b734742a0"><span className="icon-n icon-QQ"></span> <span>读者交流群</span><span className="u-r">469935346</span></a>
						<a onClick={this.copy}><span className="icon-n icon-WX"></span> <span>微信公众号</span><input defaultValue={"艾美阅读"}  className="u-r" ref="gzh" /></a>
						<a href="http://weibo.com/u/5824384026" target="_blank"><span className="icon-n icon-WB"></span> <span>官方微博</span><span className="u-r">艾美阅读</span></a>
					</div>
				</div>
			</div>
		);
	}
});

module.exports  = Feedback;