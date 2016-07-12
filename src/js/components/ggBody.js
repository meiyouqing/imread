import {Route} from 'react-router';

var zIndex = 0;
export default React.createClass({
	bodys:function(){
		return (
				<div className="ggbody" style={{zIndex:3000+zIndex}}>
					{this.props.children}
				</div>
			)
	},
	getInitialState: function(){
		return {
			bodys:[this.bodys()]
		}
	},
	componentWillUpdate:function(){
		this.setState({
			bodys:this.state.bodys.concat(this.bodys())
		})
		zIndex++;
	},
	componentDidUpdate:function(){
		
	},
	componentDidMount:function(){
										
	},
	render:function(){
		return (
			<div className="ggContainer">{this.state.bodys}</div>
		)			
	}
});