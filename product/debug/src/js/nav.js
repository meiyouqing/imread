var Nav = React.createClass({
	shouldComponentUpdate: function(nextProp,nextState){
		// console.log(this.state.navUpdate,nextState.navUpdate)
		var navs=['shelf','mall','top','user'];
		return this.props.name!==nextProp.name
				&&navs.indexOf(nextProp.name)!==-1;
	},
	render: function(){
		//console.log('nav render')
		return (
			<nav className="m-bar m-bar-tab f-flexbox">
				{
					GLOBAL.group.map(function(v,i){
						if (!v) {return ;}
						var href = v.href;
						if(this.props.name){
							var cur = v.href.indexOf(this.props.name)===-1? '':'z-active';
						}
						// console.log(v.href+'/'+this.props.name);
						return (
							<a key={i} className={"item f-flex1 "+cur} href={href}>
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