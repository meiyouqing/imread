var MallNav = React.createClass({
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
							var href = '#mall&page.'+v.pgid+'.1.'+v.blocks;
							var cls = v.pgid==this.props.part? ' active':'';
							//console.log(v.pgid,this.props.part)
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

module.exports  = MallNav;