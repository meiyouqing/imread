var uploadLog = require('../modules/uploadLog');

var Intercut = React.createClass({
	getInitialState: function() {
		return {
			height: document.body.offsetHeight / (this.props.data.intercut_style === 6 ? 2 : 1)
		};
	},
	handleClick: function(e) {
		e.stopPropagation();
		uploadLog.send('intercut', {
			intercut_id: this.props.data.content_id,
			event: 2,
			show_class: this.props.data.show_class
		});
		return true;
	},
	render: function() {
		// var className = this.props.data.intercut_style === 6 ? " half-screen" : " fullscreen";
		var hrefObj = Router.typeHref(this.props.data, []);
		return (
			<div className="m-intercut" style={{height: this.state.height}}>
				<img src={this.props.data.intercut_url} />
				<div className="btn">
					<a href={hrefObj.url} onClick={this.handleClick}>{this.props.data.button_name || '点击立即下载'}</a>
				</div>
			</div>
		);
	}
});

module.exports = Intercut;