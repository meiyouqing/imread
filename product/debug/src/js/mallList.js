var Blocklist = require('./blocklist');

var MallList = React.createClass({
	mixins: [GLOBAL.lazyloadImageMixin()],
	componentDidMount: function(){
		this.lazyloadImage(this.refs.container);
	},
	componentDidUpdate: function() {
		this.lazyloadImage(this.refs.container);
		//console.log(this.scrollUpdate)
		if (Router.parts[2]==='1') {
			this.refs.container.scrollTop = 0;
		}
	},
	shouldComponentUpdate: function(nextProp,nextState){
		//console.log(this.props,nextProp)
		return this.props.noMore !== nextProp.noMore
				|| this.props.mallList !== nextProp.mallList;
	},
	// scrollHandle: function(e) {
	// 	this.props.scrollHandle(e);
	// 	this.refs.empty.style.display = 'none';
	// },
	render:function(){
		var scrollLoading = <Loading cls="u-sLoading" />;
		if(this.props.noMore){
			scrollLoading = null;
		}
		return (
			<div className={"g-main"}>
				<div className="g-scroll" onScroll={this.props.scrollHandle} ref="container">
					<Blocklist blockList={this.props.mallList} />
					{scrollLoading}
				</div>
			</div>
			)
	}
})
module.exports = MallList;