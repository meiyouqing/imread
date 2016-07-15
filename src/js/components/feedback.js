var Header = require('./header');

var Feedback = React.createClass({
	componentDidMount: function() {
		this.refs.message.focus();
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
	shouldComponentUpdate: function(nextProps, nextState) {
		return false;
	},
	render: function() {
		return (
			<div className="gg-body">
				<Header right={null} />
				<div className="m-feedbackblock m-userblocks">
					<form className="u-feedbackform u-userform">
						<div className="u-inputline">
							<textarea className="u-input u-textarea" placeholder="期待您的反馈" ref="message"></textarea>
						</div>				
						<div className="feedback-tips">为了提供更好的服务，请留下您的联系方式</div>		
						<div className="u-inputline">
							<input className="u-input" placeholder="QQ\邮箱\手机号" ref="contact" />
						</div>
						<div className="u-inputline">
							<a className="u-btn u-btn-full" onClick={this.handleSubmit}>发送</a>
						</div>
					</form>
				</div>
			</div>
		);
	}
});

module.exports  = Feedback;