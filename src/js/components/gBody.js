import Nav from './nav';


export default React.createClass({
	render:function(){
		return (
			<div className="g-body">					
				{this.props.children}
				<Nav />
			</div>

		);				
	}
});