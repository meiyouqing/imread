var getJSON = require('./getJSON').getJSON;
var PageNav = React.createClass({
	getData: function (route) {
		var hash = window.location.hash;
		var url = GLOBAL.api.group + '?' +route;
		var top = route === 'group_id=2';
		var bookrack = route === 'group_id=3';
		if(top){
			url = GLOBAL.api.nav + '?page_id=3&blocks=10&pages=1';			
		}
		getJSON('GET', url,{}, function(data){	
			if(hash === '#'+route){
				if(bookrack){
					hash +='/block_id=157&contents=20&pages=1';
					window.location.replace(hash);
				}else if(top){
					hash +='/block_id='+data.blocklist[0].id+'&contents=20&pages=1';
					window.location.replace(hash);
				}else{
					hash +='/page_id='+data.pagelist[0].pgid+'&blocks='+data.pagelist[0].blocks+'&pages=1';
					window.location.replace(hash);
				}
			}
			var groupid = top? 2:data.groupid;
			GLOBAL.group[groupid] = data.name;
			this.setState({
				pagelist: top? data.blocklist:data.pagelist
			});
		}.bind(this));
	},
	navClick: function(e){
		var tag = e.target;
		var currentActive = tag.parentNode.querySelector('.active');
		currentActive && (currentActive.className = '');
		tag.className = 'active';
	},
	getInitialState: function(){
		return {
			pagelist: [],
			active:''
		}
	},
	componentDidMount: function(){
		this.getData(this.props.route);
	},
	componentWillReceiveProps: function(nextProp){
		this.getData(nextProp.route);
	},
	shouldComponentUpdate: function(nextProp,nextState){
		return (this.state.pagelist !== nextState.pagelist);
	},
	render: function() {
		var isYulan = /yulan=1/.test(window.location.search);
		if(this.state.pagelist.length<2 && !isYulan) return <div></div>
		var hash = window.location.hash;
		return (
			<nav className="g-nav" id="pageNav">
				<div className="m-nav">
					{
						this.state.pagelist.map(function(v,i){
							var reg = new RegExp('\/page_id='+v.pgid+'&')
							var hrefStr = '#'+this.props.route+'/page_id='+v.pgid+'&blocks='+v.blocks+'&pages=1';
							if(this.props.route === 'group_id=2'){
								hrefStr = '#'+this.props.route+'/block_id='+v.id+'&contents=20&pages=1';
								reg = new RegExp('/block_id='+v.id+'&')
							}
							var active = reg.test(hash)? 'active' : '';
							return (
								<a key={i} className={active} onClick={this.navClick} href={hrefStr}>{v.name}</a>
							)
						}.bind(this))
					}
				</div>
			</nav>
		);
	}
});

module.exports  = PageNav;