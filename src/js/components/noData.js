
var NoData = React.createClass({
	reload:function(){
		document.location.reload();
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return false;
	},
	render: function(){
		var src = 'src/img/noData.png',
			text = '抱歉!没有找到相关数据..',
			btn = <Link className="u-btn" to="/mall">去书城逛逛</Link>;
		switch(this.props.type){
			case 'emptyShelf':
				src = 'src/img/bookrack.png';
				text = '亲，书架还空空荡荡哦~';
			break;
			case 'UFO':
				src = 'src/img/UFO.png';
				text = '糟糕，服务器被外星人劫持了..';
				btn = <a className="u-btn" onClick={this.reload}>重新加载</a>;
			break;
			case 'recentRead':
				src = 'src/img/bookrack.png';
				text = '暂无阅读记录';
				btn = false;
			break;
		}
		return (
			<div className="f-vl-md">
				<div className="m-noData f-tc">
					<img className="icon" src={src} />
					<i className="tip">{text}</i>
					{btn}
				</div>
			</div>
			);
	}
});

module.exports  = NoData;