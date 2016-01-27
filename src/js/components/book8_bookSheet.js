var Img = require('./img');

var BookSheet = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render: function() { 
		var hrefStr = Router.typeHref(this.props.data,this.props.spm);
		//var m_time = '';
		var m_time = this.props.data.modify_time.substr(0,4)+'.'+this.props.data.modify_time.substr(4,2)+'.'+this.props.data.modify_time.substr(6,2);
		return (
			<li className="f-bb-eee">
				<a className="f-pr" href={hrefStr}>
					<div className="bsCover f-pa f-br-6">
						<Img src={this.props.data.image_url} />
						// <Img src={this.props.data.image_url} />
						// <Img src={this.props.data.image_url} />
					</div>
					<div className="bsInfo">
						<div className="f-clearfix">
							<span className="f-fl bsName f-ellipsis-2" style={{color:this.props.data.title_color}}>{this.props.data.name}</span>
							<span className="f-fr bsCount">共计{this.props.data.count}本</span>
						</div>
						<p className="f-tr f-fc-777">收藏数<span className="bsfCount">{this.props.data.collect_uv}</span>更新于{m_time}</p>
					</div>
				</a>
			</li>
		);
	}
});

module.exports = BookSheet;