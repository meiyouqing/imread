import {Link} from 'react-router'
import React from 'react' 
export default React.createClass({
	render(){
		return <Link {...this.props} activeClassName='z-active' className="item f-flex1"/>
	}
})