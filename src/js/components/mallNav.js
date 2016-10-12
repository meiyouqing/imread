import React from 'react'
import MallNavLink from './mallNavLink'

var MallNav = React.createClass({
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
							var href = 'page.'+v.pgid;
							return (
								<MallNavLink to={'/mall/'+href} key={i} className="f-flex1">{v.name}</MallNavLink>
							)
						}.bind(this))
					}
				</div>
			</nav>
		);
	}
});

module.exports  = MallNav;