var Nav = React.createClass({
	mixins: [Mixins()],
	shouldComponentUpdate: function(nextProp,nextState){
		// console.log(this.state.navUpdate,nextState.navUpdate)
		var navs=['shelf','mall','top','user'];
		return this.props.name!==nextProp.name
				&&navs.indexOf(nextProp.name)!==-1;
	},
	handleClick: function(e){
		var targ = e.target.nodeName=='A'? e.target : e.target.parentNode;
		//console.log(targ,targ.href)
		if(/#shelf/.test(targ.href)){
			if(this.isLogin()){
				return true;
			}else{
				e.preventDefault();
				this.goLogin(function(){
					location.hash = '#shelf&block.157.1.10000';
				});
				return false;
			}
		}
		return true;
	},
	render: function(){
		//console.log('nav render')
		return (
			<nav className="m-bar m-bar-tab f-flexbox">
				{
					GLOBAL.group.map(function(v,i){
						var href = v.href;
						if(this.props.name){
							var cur = v.href.indexOf(this.props.name)===-1? '':'z-active';
						}
						// console.log(v.href+'/'+this.props.name);
						return (
							<a key={i} className={"item f-flex1 "+cur} href={href} onClick={this.handleClick}>
								<span className={"iconfont "+v.cla}></span>
								<span className="label">{v.name}</span>
							</a>
							);
					}.bind(this))
				}
			</nav>
			);
	}
});

module.exports  = Nav;