import {Route} from 'react-router'
import Nav from './nav'

require('../../css/iconfont1.css');
require('../../css/imread.css');


export default React.createClass({
	componentDidUpdate:function(){
		// const dl = /\&dlimread/.test(location.hash);
		// const isNav = GLOBAL.route.length === 1;
		// if(dl && !isNav && this.refs.ggBody){
		// 	DlImRead({container:this.refs.ggBody});
		// }
	},
	componentDidMount:function(){
											
	},
	render:function(){
		return (
			<div className="g-wraper">
				{this.props.children}
				<Nav />
			</div>
		);				
	}
});