

var Stars = React.createClass({
	shouldComponentUpdate: function(nextPros, nextState) {
		return this.props.score !== nextPros.score;
	},
	render: function() {
		// scrole = a.b
		// star width 15px
		// margin-left 5px
		var a = Math.floor(this.props.score);
		var b = this.props.score - a;
		var width = a * (15 + 5) + b * 15;
		return (
			<div className="u-stars">
				<ul className="stars f-clearfix">
					<li className="iconfont icon-star"></li>
					<li className="iconfont icon-star"></li>
					<li className="iconfont icon-star"></li>
					<li className="iconfont icon-star"></li>
					<li className="iconfont icon-star"></li>
				</ul>
				<div className="mask" style={{width: width}}>
					<ul className="stars active f-clearfix">
						<li className="iconfont icon-star"></li>
						<li className="iconfont icon-star"></li>
						<li className="iconfont icon-star"></li>
						<li className="iconfont icon-star"></li>
						<li className="iconfont icon-star"></li>
					</ul>
				</div>
			</div>
		);
	}
});

module.exports = Stars;