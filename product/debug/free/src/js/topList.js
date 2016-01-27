var Block8 = require('./block8');


var TopList = React.createClass({
	mixins: [GLOBAL.lazyloadImageMixin()],
	componentDidMount: function(){
		this.lazyloadImage(this.refs.container);
	},
	componentDidUpdate: function() {
		this.lazyloadImage(this.refs.container);
		//console.log(Router.parts)
		if (Router.parts[2]==='1') {
			this.refs.container.scrollTop = 0;
		}
	},
	shouldComponentUpdate: function(nextProp,nextState){
		//console.log(this.props,nextProp)
		return this.props.scrollUpdate !== nextProp.scrollUpdate
				|| this.props.topList !== nextProp.topList;
	},
	render:function(){
		var scrollLoading = <Loading cls="u-sLoading" />;
		if(this.props.noMore){
			scrollLoading = null;
		}
		return (
			<div className="g-main">
				<div className="g-scroll" onScroll={this.props.scrollHandle} ref="container">
					<Block8 bookList={this.props.topList} />
					{scrollLoading}
				</div>
			</div>
			)
	}
})
module.exports = TopList;