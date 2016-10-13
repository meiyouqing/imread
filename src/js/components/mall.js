var Header = require('./header');
var MallNav = require('./mallNav');
var UserList = require('./userList');

var Mall = React.createClass({
	is_WX: function(){
  		var ua = window.navigator.userAgent.toLowerCase();
	    	if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	        	return true;
	   	}else{
	   	      return false;
	   	}
  	},
  	WX_skip: function(){
  		window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc4b3ed2404d2139f&redirect_uri='+encodeURIComponent(location.origin+'?callback='+location.href)+'&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect';
  	},
	getNav: function(){
		AJAX.init('group.1');
		AJAX.get((data)=>{
			var subnav = 'page.'+data.pagelist[0].pgid+'.'+data.pagelist[0].blocks;
			this.upApp(subnav);
			if((location.pathname === this.props.route.path) || !this.props.params.subnav){
				browserHistory.replace('/mall/'+subnav);
			}
			this.setState({
				navList:data.pagelist
			});
		});
	},
	gotoSearch: function(){
		browserHistory.push(GLOBAL.setHref('search/page.11.0.1'));
	},
	getInitialState: function(){
		return {
			navList: null,
			showUser:false,
			// onNotice: true
		}
	},
	hideUser: function(){
		this.setState({
			showUser:false
		})
	},
	showUser: function(){
		this.userFlag = true;
		this.setState({
			showUser:true
		})
	},
	getLastparam: function(){
		var param = location.pathname.split('/').pop();
		return param.indexOf('page')>=0;
	},
	componentDidMount: function(){

		var that = this;
		this.from = parseQuery(location.search);

		if(this.is_WX() && !this.from.code  && !GLOBAL.cookie('userToken')){
  			this.WX_skip();
  		}


		if(this.is_WX() && GLOBAL.cookie('userToken'))
			this.getNav();


		//微信登录
		if(this.is_WX() && this.from  && this.from.code && this.from.state == '123') {
			   AJAX.go('login_wx',{
        			code: this.from.code,
        			grant_type: 'authorization_code'
			   },function(res){
			   	that.do_result(res);
			   	that.getNav();
			   })
		}

		if(!this.is_WX())
			this.getNav();
	},
	do_result: function(data){
		var that = this;
		if(data.code == 200){
			GLOBAL.cookie('userToken', 'loaded');
			if(this.from.callback && this.from.callback != (location.origin+'/mall'))
				location.href = this.from.callback;
		} else {
			POP._alert('登录失败');
		}
	},
	upApp: function(page){
		var obj = parseQuery(location.search);
		if(obj.action && obj.action==='openapp'){
			var url = 'https://m.imread.com/mall/';
			if(obj.book_id)
				browserHistory.replace(url+(page+'/book/introduce.'+obj.book_id+location.search));
			else if(obj.sheet_id){
				browserHistory.replace(url+(page+'/top/block.0/sheet/bookSheet.'+obj.sheet_id+location.search));
			}
		}
	},
	componentDidUpdate: function(nextProp,nextState){	
		document.ontouchmove = function(e){
			e.stopPropagation();
		};
		if(!this.props.params.subnav) this.getNav();
		if(this.state.showUser) {
			if(!this.userFlag) this.hideUser();
			this.userFlag = false;
		}
	},
	shouldComponentUpdate: function(nextProp,nextState){
		return this.state.navList !== nextState.navList
				|| this.state.showUser !== nextState.showUser
				|| this.state.onNotice !== nextState.onNotice
				|| this.props.children !== nextProp.children
				|| this.props.params.subnav !== nextProp.params.subnav;
	},
	reload: function(){
		window.location.reload();
	},
	// closeNotice: function(){
	// 	this.setState({onNotice: false});
	// },
	render:function(){
		var mallNav,userList;
		if(this.state.navList){
			mallNav = <MallNav navList={this.state.navList} />;
			userList = <UserList route={this.props.route} />;
		}

		var right = <div className="icon-s icon-menu right icon-m-r6" onClick={this.showUser} ></div>,
			middle = <a className="icon-s icon-searcher right" onClick={this.gotoSearch}></a>,
			left = <div className="i-logo" onClick={this.reload}></div>;
		// var notice = (<section className="safari">
						
		// 				<div className="notice-safari" onClick={this.closeNotice}></div><span>为确保最佳体验，请在"设置-Safari-阻止Cookie"中选择"始终允许"</span>
		// 			</section>)

		return (<div>

			<div className={"g-mall hide"}>
				<Header title="" left={left} right={right} middle={middle} path={this.props.route}/>
				{mallNav}
				<section className={"m-wrapper"+(this.state.showUser? ' show':'')} onClick={this.hideUser}></section>
				<section className={"m-user-list"+(this.state.showUser? ' show':'')}>
					{userList}
				</section>
				{this.props.children}
			</div></div>
			)
	}
})
module.exports = Mall;