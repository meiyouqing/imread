import {Route} from 'react-router'
import Nav from './nav'

if(typeof window !== 'undefined'){
	require('../../css/iconfont1.css');
	require('../../css/imread.css');
}


export default React.createClass({
	render:function(){
		return (
			<div className="g-wraper">
				{this.props.children}
				<Nav />
			</div>
		);				
	}
});