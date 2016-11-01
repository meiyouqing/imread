import Mixins from '../modules/mixins'
import NavLink from './navLink'
import React from 'react'
const Nav = React.createClass({
	mixins: [Mixins()],
	// shouldComponentUpdate: function(nextProp,nextState){
	// 	// console.log(this.state.navUpdate,nextState.navUpdate)
	// 	var navs=['shelf','mall','top','user'];
	// 	return this.props.name!==nextProp.name
	// 			&&navs.indexOf(nextProp.name)!==-1;
	// },

	render: function(){
		//console.log('nav render')
		return (
			<nav className="m-bar m-bar-tab f-flexbox">
				
				<NavLink to="/shelf">
					<span className="iconfont icon-shujia"></span>
					<span className="label">书架</span>
				</NavLink>
				<NavLink to="/mall">
					<span className="iconfont icon-shucheng"></span>
					<span className="label">书城</span>
				</NavLink>
				<NavLink to="/top" >
					<span className="iconfont icon-paihang"></span>
					<span className="label">发现</span>
				</NavLink>
				<NavLink to="/user" >
					<span className="iconfont icon-geren"></span>
					<span className="label">我</span>
				</NavLink>
							
			</nav>
			);
	}
});

export default Nav;