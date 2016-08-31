var Header = require('./header');
var Mixins = require('../modules/mixins');
require('../../css/userinfo.css');

var tag = React.createClass({
	mixins: [Mixins()],
	getInitialState: function() {
		return {
			user_gender: null,
			user: null,
			right:<span onClick={this.changeEdit} className="icon-s icon-edit f-fr"></span>,
			isEdit: false,
			finishButton: true,
			access: <span className="icon-h icon-return-black"></span>,
			sex: false,
			sexId: 0,
			portraitUrl: null,
			formdata: null
		};
	},
	logout: function(e) {
		e.preventDefault && (e.preventDefault());
		POP.confirm('确定退出登录?',function() {
			AJAX.init('loginout');
			AJAX.get(function(res){
			}.bind(this));
			GLOBAL.removeCookie('userPhone');
			GLOBAL.removeCookie('userToken');
			GLOBAL.removeCookie('uuid');

			GLOBAL.goBack();
		}.bind(this));
	},
	changeEdit: function(){
		var right = <span onClick={this.finishEdit} className="icon-s icon-right f-fr"></span>;
		var access = <span className="icon-h icon-return-black show"></span>;
		GLOBAL.addClass(this.refs.header,'show');//兼容部分安卓机不能触发click()
		GLOBAL.addClass(this.refs.date,'show');
		this.setState({right: right,isEdit: true,finishButton: false,access: access});
	},
	finishEdit: function(){
		var right = <span onClick={this.changeEdit} className="icon-s icon-edit f-fr"></span>;
		var access = <span className="icon-h icon-return-black"></span>
		GLOBAL.removeClass(this.refs.header,'show');
		GLOBAL.removeClass(this.refs.date,'show');
		var pramas = {
			user_gender: this.state.sexId,
			user_birthday:this.refs.date.value.replace(/-/g,""),
			user_name:this.state.user_name
		}

		AJAX.go('edituser',pramas,function(res){
			if(res.code === 200){
				//this.getData();
				this.disPatch('updateUser');
				POP._alert("修改成功");
			} else {
				if(typeof res.error === 'string')
					POP._alert(res.error);
				else 
					for(var key in res.error[0]){
						POP._alert(res.error[0][key])
					}
			}
		}.bind(this));
		this.setState({right: right,isEdit: false,finishButton: true,access: access});

		// if(!this.state.formdata) 	{return;}
		// AJAX.go('upload',{formdata: this.state.formdata},function(res){
		// 			//this.getData();
		// 			if(res.code !== 200)
		// 				POP._alert('头像上传失败');
		// 			else{
		// 				this.setState({formdata: null})
		// 				POP._alert('头像上传成功');
		// 			}
		// }.bind(this));
		
	},
	selectHeader: function(){
		
		if(!this.state.isEdit)  return;
		// this.refs.header.click();
		this.refs.header.onchange = function(e){
			var file = this.refs.header.files[0];

			try{
				this.setState({portraitUrl: window.URL.createObjectURL(file)});
			}catch(e){
				this.setState({portraitUrl: window.webkitURL.createObjectURL(file)});
			}

			var formdata = new FormData();
			formdata.append('file',file);
			this.setState({formdata: formdata});

			AJAX.go('upload',{formdata: formdata},function(res){
				if(res.code !== 200)
					POP._alert(JSON.stringify(res));
				else
					POP._alert('头像上传成功');
			}.bind(this));

			 // var reader = new FileReader();  
			 // //将文件以Data URL形式读入页面  
			 // reader.readAsDataURL(file);  
			 // reader.onload=function(e){  
			 // 	console.log(this.result)
			 // 	AJAX.go('upload',{formdata: this.result},function(res){
				// //this.getData();
				// 	if(res.code !== 200)
				// 		POP._alert('头像上传失败');
				// 	else
				// 		POP._alert('头像上传成功');
				// }.bind(this));
			 // } 
			
		}.bind(this);
	},
	selectDate: function(){
		if(!this.state.isEdit)  return;
		this.refs.date.click();
		this.refs.date.focus();
	},
	forAndroid: function(){

		if(!GLOBAL.isAndroid()) return;
		var time;
		clearInterval(time);
		time =  setInterval(function(){
			if(!this.refs.date) {
				clearInterval(time);
				return;
			}
			if(this.state.user_birthday != this.refs.date.value && this.refs.date.value){
				this.setState({user_birthday: this.refs.date.value});
				clearInterval(time);
			} else if(this.state.user_birthday == this.refs.date.value){
				return;
			}
		}.bind(this),500); 
	},
	selectSex: function(){
		if(!this.state.isEdit)  return;
		this.setState({sex: true});
	},
	selectedSex: function(e){
		var a  = e.target.getAttribute('data-index');
		this.switchSex(a);
		this.setState({sexId: a});
		this.closeSex();
	},
	closeSex: function(){
		this.setState({sex: false});
	},
	gotoEditname: function(){
		if(!this.state.isEdit)  return;
		browserHistory.push(GLOBAL.setHref('editUserame'));
	},
	getData: function() {
		AJAX.init('me');
		AJAX.get(function(data) {
			this.switchSex(data.user_gender);

			this.setState({
				user:data,
				user_birthday: data.user_birthday,
				user_name: data.user_name,
				portraitUrl: data.portraitUrl
			});
		}.bind(this));
	},
	switchSex: function(index){
		var user_gender;
		switch(index){
				case '1':
					user_gender = '男';
					break;
				case '2' :
					user_gender = '女';
					break;
				default:
					user_gender = "保密"
		}
		this.setState({
			user_gender: user_gender
		});
	},
	componentWillReceiveProps: function(nextProps){
		if(nextProps.location.state)
			this.setState({user_name: nextProps.location.state.user_name});
	},
	componentDidMount: function() {

		if(this.checkLogin(this.props.route)) this.getData();
	},
	componentDidUpdate:function(){
		if(this.refs.date)
			this.refs.date.oninput = function(){
				this.setState({user_birthday: this.refs.date.value})
			}.bind(this);
	},
	render: function() {
		var list;
		if(!this.state.user)
			list = <Loading />
		else
			list = (<div className="g-main g-main-1 m-userinfo">
					<section className="m-user-header" onClick={this.selectHeader} >

						<input type="file" className="user-header" ref="header" accept="image/*;capture=camera" />
						<span>头像</span>
						{this.state.access}
						<img src={this.state.portraitUrl || "http://m.imread.com/src/img/icons/ic_avatar@2x.png"}  />
					</section>
					<section className="m-user-detail">
						<ul>
							<li onClick={this.gotoEditname}><span>昵称</span>{this.state.access}<span>{this.state.user_name}</span></li>
							<li onClick={this.selectSex}><span>性别</span>{this.state.access}<span>{this.state.user_gender}</span></li>
							<li onClick={this.selectDate}><span>生日</span>{this.state.access}<span>{this.state.user_birthday}</span></li>
						</ul>
						<input onClick={this.forAndroid}  type="date" ref="date" id="dater" className={'dateInput' + (GLOBAL.isAndroid()?' position':'')}/>
					</section>

					<section className="m-user-b" style={{display:this.state.finishButton?"block":"none"}}>
						<a className="u-btn u-btn-full" onClick={this.logout}>退出登录</a>
					</section>

				</div>)

		return (
			<div className="gg-body">
				<Header title={"个人资料"} right={this.state.right}  path={this.props.route}  />
				{list}
				<section>
					<div className={"m-wrapper"+(this.state.sex?" show":"")}></div>
						<div className={"UI_selecter"+(this.state.sex?" show":"")} onClick={this.selectedSex}>
							<ul>
								<li data-index ="1" >男生</li>
								<li data-index ="2" >女生</li>
								<li data-index ="0" >保密</li>
							</ul>
							<button onClick={this.closeSex} className="UI-cancel">取消</button>
						</div>
				</section>
				{this.props.children}
			</div>
		);
	}
});

module.exports = tag;