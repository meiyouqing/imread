var Blocklist2 = require('./blocklist');
var Header = require('./header');

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
		//this.lazyloadImage(this.refs.container);

		//判断来源from
		window.from = parseQuery(location.search);
	},
	componentDidUpdate: function(){
		this.lazyloadImage(this.refs.container);
	},
	render: function() {
		//console.log(this.props.data)
		//var hrefStr = Router.setAPI(this.props.data,this.props.spm);
		var skipurl = '';
		if(window.from && window.from.skipurl)
			skipurl = window.from.skipurl;

		return (
			<div>
				<Header title={Router.title} closeRight={true} leftBak={skipurl?skipurl:false} />
				<div className="g-main g-main-1">
					<div className="g-scroll" ref="container" onScroll={this.scrollHandle}>
						<Blocklist2 blockList={this.state.data}></Blocklist2>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = Selfbuild;