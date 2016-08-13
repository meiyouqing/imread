var Header = require('./header_f');
var MallNav = require('./mallNav');
var UserList = require('./userList');

var Mall = React.createClass({
	getNav: function(){
		AJAX.init('group.1');
		AJAX.get(this.handleGetNav);
	},
	handleGetNav:function(data){
		var subnav = 'page.'+data.pagelist[0].pgid+'.'+data.pagelist[0].blocks;
		// if(location.pathname === this.props.route.path){
			// browserHistory.replace('/mall/'+subnav);
		// }
		this.setState({
			navList:data.pagelist
		});
	},
	gotoSearch: function(){
		browserHistory.push(GLOBAL.setHref('search/page.11.0.1'));
	},
	getInitialState: function(){
		return {
			navList: null
		}
	},
	hideUser: function(){
		GLOBAL.removeClass(this.refs.blackBlock,'show');
		GLOBAL.removeClass(this.refs.userlist,'show');
	},
	showUser: function(){
		GLOBAL.addClass(this.refs.blackBlock,'show');
		GLOBAL.addClass(this.refs.userlist,'show');
	},
	getLastparam: function(){
		var param = location.pathname.split('/').pop();
		return param.indexOf('page')>=0;
	},
	componentWillMount:function(){
		if(typeof window === 'undefined'){
			var fs = require('fs');
			global.imreadData.group = fs.readFileSync('./serverside/data/group.json','utf8');
			this.handleGetNav(JSON.parse(global.imreadData.group));
		}else{
			if(window.imreadData){
				console.log(imreadData);
				return;
				this.handleGetNav(imreadData);
			}			
		}
	},
	componentDidMount: function(){
		if(!window.imreadData){
			this.getNav();
		}
	},
	componentDidUpdate: function(nextProp,nextState){	
		if(!this.props.params.subnav)
			this.getNav();
	},
	shouldComponentUpdate: function(nextProp,nextState){
		return this.state.navList !== nextState.navList
				|| this.props.children !== nextProp.children;
	},
	render:function(){
		var mallNav,userList;
		if(this.state.navList){
			mallNav = <MallNav navList={this.state.navList} />;
			// userList = <UserList hide={this.hide} route={this.props.route} />;
		}

		var right = <div className="icon-s icon-menu right icon-m-r10" onClick={this.showUser} ></div>,
			middle = <a className="icon-s icon-searcher right" onClick={this.gotoSearch}></a>,
			left = <div className="i-logo"></div>;

		return (
			<div className="g-mall">

				<Header title="" left={left} right={right} middle={middle} path={this.props.route}/>
				{mallNav}
				<section className="m-wrapper" ref="blackBlock" onClick={this.hideUser}></section>
				<section className="m-user-list" ref="userlist">
					{userList}
				</section>
				{this.props.children}
			</div>
			)
	}
})
module.exports = Mall;