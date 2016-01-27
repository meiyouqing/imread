var TopNav = React.createClass({
	shouldComponentUpdate: function(nextProp,nextState){
		return this.props.navList !== nextProp.navList
				||this.props.part !== nextProp.part;
	},
	render: function() {
		//console.log('pageNav render');
		// var isYulan = /yulan=1/.test(window.location.search);
		// if(this.props.navList.length<2 && !isYulan) return <div></div>
		if(!this.props.navList || !this.props.navList.length){return <i></i>}
		return (
			<nav className="g-nav">
				<div className="m-nav f-flexbox" >
					{
						this.props.navList.map(function(v,i){
							var href = '#top&block.'+v.id+'.1.0';
							var cls = v.id==this.props.part? ' active':'';
							//console.log(v.id,this.props.part)
							return (
								<a key={i} className={'f-flex1 '+cls} href={href}>{v.name}</a>
							)
						}.bind(this))
					}
				</div>
			</nav>
		);
	}
});

module.exports  = TopNav;