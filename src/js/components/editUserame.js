var Header = require('./header');
var Mixins = require('../modules/mixins');
require('../../css/userinfo.css');

var tag = React.createClass({
	mixins: [Mixins()],
	getInitialState: function() {
		return {
		};
	},
	editname: function(){

		if(!this.refs.username.value) {POP._alert('昵称不能为空'); return;}

		var pramas = {
			user_name:this.refs.username.value
		}

		AJAX.go('edituser',pramas,function(res){
			if(res.code === 200)
				GLOBAL.goBack();
			else {
				if(typeof res.error === 'string')
					POP._alert(res.error);
				else 
					for(var key in res.error[0]){
						POP._alert(res.error[0][key])
					}
			}
		}.bind(this));
	},
	clearValue: function(){
		this.refs.username.value = '';
		return;
	},
	componentDidMount: function() {

		this.refs.username.oninput = function(e){
			if(this.refs.username.value.length>10)
				this.refs.username.value = this.refs.username.value.substring(0,10);
		}.bind(this);
	},
	render: function() {
		var right = <span onClick={this.editname} className="icon-s icon-right f-fr"></span>;
		return (
			<div className="gg-body">
				<Header title={"修改昵称"} right={right}  path={this.props.route}  />
				<div className="g-main g-main-1 m-username">
					<section className="m-name-input">
						<input type="text" ref="username" placeholder="10个字以内，支持中英文、数字" />
						<span className="icon-20 icon-deletes" onClick={this.clearValue}></span>
					</section>
				</div>
			</div>
		);
	}
});

module.exports = tag;