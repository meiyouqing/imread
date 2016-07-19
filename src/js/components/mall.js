import {browserHistory} from 'react-router';
var Header = require('./header');
var MallNav = require('./mallNav');

var Mall = React.createClass({
	getNav: function(){
		AJAX.init('group.1');
		AJAX.get((data)=>{
			var subnav = 'page.'+data.pagelist[0].pgid+'.'+data.pagelist[0].blocks;

			browserHistory.replace('/mall/'+subnav);
			this.setState({
				navList:data.pagelist
			});
		});
	},
	getInitialState: function(){
		return {
			navList: null
		}
	},
	componentDidMount: function(){
		this.getNav();
	},
	componentDidUpdate: function(nextProp,nextState){

		if(!this.props.params.subnav)
			this.getNav();
	},
	shouldComponentUpdate: function(nextProp,nextState){
		return this.state.navList !== nextState.navList
				|| this.props.children !== nextProp.children;
	},
	render:function(){
		var mallNav;
		if(this.state.navList){
			mallNav = <MallNav navList={this.state.navList} />;
		}
		return (
			<div className="g-mall">
				<Header title="书城" left={null} />
				{mallNav}
				{this.props.children}
			</div>
			)
	}
})
module.exports = Mall;