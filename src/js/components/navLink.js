import {Link} from 'react-router'
 
export default React.createClass({
	render(){
		return <Link {...this.props} activeClassName='z-active' className="item f-flex1"/>
	}
})