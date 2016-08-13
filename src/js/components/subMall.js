var Header = require('./header');
var Blocklist = require('./blocklist');
var MallNav = require('./mallNav');

var Mall = React.createClass({
	mixins: [Mixins()],
	reset: function(){
		this.setState({
			list:null,
			noMore:false
		})
	},
	getInitialState: function(){
		return{
			noMore:false,
			scrollUpdate:false,
			onerror:false,
			list:null
		}
	},
	componentWillReceiveProps: function(nextProp){
		//console.log(nextProp.params.subnav !== this.props.params.subnav)
		if(nextProp.params.subnav !== this.props.params.subnav){
			this.reset();
			this.APIparam = nextProp.params.subnav;
			this.getList();
		}
	},

	getList: function (scrollUpdate){
		AJAX.init(this.APIparam);
		if(scrollUpdate){
			var n = AJAX.API._param['pages']? 'pages':'page';
			AJAX.API._param[n]++;			
		}
		AJAX.get((data)=>{
			if(!data.blocklist){return}
			if (!data.blocklist.length) {
				this.setState({
					noMore:true
				})
			}
			this.setState({
				list: this.state.scrollUpdate? this.state.list.concat(data.blocklist):data.blocklist,
				scrollUpdate: false
			});
			//设置GLOBAL.booklist/book
			GLOBAL.setBlocklist(data.blocklist);
		},this.onerror);
	},			
	componentDidMount: function(){
		this.APIparam = this.props.params.subnav;
		if(GLOBAL.isRouter(this.props))	this.getList();
	},
	componentDidUpdate: function() {
		if(GLOBAL.isRouter(this.props) && !this.state.list)	this.getList();
		if(!this.state.list || !this.state.list.length){return;}
		this.lazyloadImage(this.refs.container);
	},
	shouldComponentUpdate: function(nextProp,nextState){
		//console.log(this.props,nextProp)
		return this.state.noMore !== nextState.noMore
				|| this.state.list !== nextState.list
				|| this.props.children !== nextProp.children;
	},
	render:function(){
		var list;
		var scrollLoading = <Loading cls="u-sLoading" />;
		if(this.state.noMore){
			scrollLoading = null;
		}
		if(!this.state.list){
			if(GLOBAL.isRouter(this.props))
				list = <Loading />
		}else{
			if(this.state.list.length){
				list = (
					<div className="g-main g-main-1">
						<div className="g-scroll" onScroll={this.scrollHandle} ref="container">
							<Blocklist blockList={this.state.list} path={this.props.route}/>
							{scrollLoading}
						</div>
					</div>
					);
			}else{
				list = (<div className="g-main"><NoData /></div>);
			}
		}
		if(this.state.onerror){
			list = (<div className="g-main"><NoData type="UFO" /></div>);
		}
		return (
			<div className="g-subMall">
				{list}
				{this.props.children}
			</div>
			)
	}
})
module.exports = Mall;