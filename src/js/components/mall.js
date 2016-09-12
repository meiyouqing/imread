var Header = require('./header');
var MallNav = require('./mallNav');
var UserList = require('./userList');

var Mall = React.createClass({
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
			showUser:false
		}
	},
	hideUser: function(){
		this.setState({
			showUser:false
		})
	},
	showUser: function(){
		this.setState({
			showUser:true
		})
	},
	getLastparam: function(){
		var param = location.pathname.split('/').pop();
		return param.indexOf('page')>=0;
	},
	componentDidMount: function(){
		this.getNav();
		//if(!this.props.params.subnav) browserHistory.replace('/mall');
	},
	upApp: function(page){
		var obj = parseQuery(location.search);
		if(obj.action && obj.action==='openapp'){

			if(obj.book_id)
				browserHistory.push(GLOBAL.setHref(page+'/book/introduce.'+obj.book_id+location.search));
			else if(obj.sheet_id){
				browserHistory.push(GLOBAL.setHref(page+'/top/block.0/sheet/bookSheet.'+obj.sheet_id+location.search));
			}
		}
	},
	componentDidUpdate: function(nextProp,nextState){	
		document.ontouchmove = function(e){
			e.stopPropagation();
		};
		if(!this.props.params.subnav) this.getNav();
		if(GLOBAL.user.hideUser){
			this.hideUser();
			GLOBAL.user.hideUser = false;
		}
	},
	shouldComponentUpdate: function(nextProp,nextState){
		return this.state.navList !== nextState.navList
				|| this.state.showUser !== nextState.showUser
				|| this.props.children !== nextProp.children
				|| this.props.params.subnav !== nextProp.params.subnav;
	},
	reload: function(){
		window.location.reload();
	},
	render:function(){
		var mallNav,userList;
		if(this.state.navList){
			mallNav = <MallNav navList={this.state.navList} />;
			userList = <UserList route={this.props.route} />;
		}

		var right = <div className="icon-s icon-menu right icon-m-r6" onClick={this.showUser} ></div>,
			middle = <a className="icon-s icon-searcher right" onClick={this.gotoSearch}></a>,
			left = <div className="i-logo" onClick={this.reload}></div>;

		return (
			<div className="g-mall">

				<Header title="" left={left} right={right} middle={middle} path={this.props.route}/>
				{mallNav}
				<section className={"m-wrapper"+(this.state.showUser? ' show':'')} onClick={this.hideUser}></section>
				<section className={"m-user-list"+(this.state.showUser? ' show':'')}>
					{userList}
				</section>
				{this.props.children}
			</div>
			)
	}
})
module.exports = Mall;