var Blocklist2 = require('./blocklist');

var Selfbuild = React.createClass({
	mixins: [Mixins()],
	getInitialState: function(){
		return {
			data: []
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state.data !== nextState.data;
	},
	componentDidMount: function(){
		var that = this;
		Router.get(function(res){
			that.setState({data: res.blocklist})
		});
		this.lazyloadImage(this.refs.container);
	},
	componentDidUpdate: function(){
		this.lazyloadImage(this.refs.container);
	},
	render: function() {
		//console.log(this.props.data)
		//var hrefStr = Router.setAPI(this.props.data,this.props.spm);
		return (
			<div className="g-scroll" ref="container">
				<Blocklist2 blockList={this.state.data}></Blocklist2>
			</div>
		)
	}
});

module.exports = Selfbuild;