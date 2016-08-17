var Blocklist2 = require('./blocklist');
var Header = require('./header');

var Selfbuild = React.createClass({
	mixins: [Mixins()],
	getInitialState: function(){
		return {
			data: null
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state.data !== nextState.data;
	},
	getList: function(){
		AJAX.init(this.props.params.selfId);
		AJAX.get(function(res) {
			this.setState({data: res.blocklist})
		}.bind(this));
	},
	componentDidMount: function(){
		this.getList();
		// Router.get(function(res){
		// 	that.setState({data: res.blocklist})
		// });
		//this.lazyloadImage(this.refs.container);

		//判断来源from
		this.from = parseQuery(location.search);
	},
	componentDidUpdate: function(){
		this.lazyloadImage(this.refs.container);
	},
	shouldComponentUpdate: function(nextProp,nextState){
		return this.state.data !== nextState.data
				|| this.props.children !== nextProp.children;
	},
	render: function() {
		//console.log(this.props.data)
		//var hrefStr = Router.setAPI(this.props.data,this.props.spm);
		var skipurl = '',loading,content;
		if(this.from && this.from.skipurl)
			skipurl = this.from.skipurl;

		if(!this.state.data)
			loading = <Loading />
		else
			content = <div className="g-main g-main-1">
					<div className="g-scroll" ref="container" onScroll={this.scrollHandle}>
						<Blocklist2 blockList={this.state.data}></Blocklist2>
					</div>
				</div>
		return (
			<div className="gg-body">
				<Header title={'自搭页面'} skipurl={true} right={null} path={this.props.route}/>
				{content}
				{loading}
				{this.props.children}
			</div>
		)
	}
});

module.exports = Selfbuild;