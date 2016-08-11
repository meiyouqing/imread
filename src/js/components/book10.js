var Img = require('./img');
var Book10 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data
		|| this.props.icon !==nextProps.icon;
	},
	clickHandle: function(){
		if(this.props.icon)	return;
		var hrefStr = location.pathname.replace(/\/sheet([^\"]*)/,'')+'/sheet/bookSheet.'+(this.props.data.sheet_id || this.props.data.content_id);
		browserHistory.push(hrefStr);
	},
	render: function() {
		return (
			<li  className="u-book-10">
				<a onClick={this.clickHandle}>
					<Img src={this.props.data.image_url} />
					<div className="f-b-block">
						<span className="book-name">{this.props.data.name}</span>
						<div className="f-fr last">
							<span className="icon-l icon-book"></span>
							<span >{(this.props.data.count || this.props.data.content_cnt)+'本'}</span>
						</div>

						<div className="f-fr">
							<span className="icon-l icon-love"></span>
							<span>{this.props.data.collect_uv || 0}</span>
						</div>
					</div>
				</a>
				{this.props.icon?<span className="delete" onClick={this.props.deleteWay} data-bid={this.props.data.sheet_id}>删除</span>:null}
			</li>
		);
	}
});

module.exports = Book10;