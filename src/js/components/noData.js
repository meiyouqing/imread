
var NoData = React.createClass({
	mixins: [Mixins()],
	reload:function(){
		document.location.reload();
	},
	setTag: function(){
		if(this.isLogin())
			gotoTag();
		else
			this.goLogin(function(){
				gotoTag();
			});

		var gotoTag =  function(){
			browserHistory.push(GLOBAL.setHref("myTags"));
		};
			
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return false;
	},
	render: function(){
		var src = 'http://m.imread.com/src/img/pic1@2x.png',
			text = '抱歉!没有找到相关数据..',
			btn = <Link className="u-btn" to="/mall">去书城逛逛</Link>;
		switch(this.props.type){
			case 'emptyShelf':
				text = '亲，书架还空空荡荡哦';
			break;
			case 'UFO':
				src = 'http://m.imread.com/src/img/no@2x.png';
				text = '网络遇到问题,请重试';
				btn = <a className="u-btn" onClick={this.reload}>重新加载</a>;
			break;
			case 'recentRead':
				text = '暂无阅读记录';
				btn = <Link className="u-btn" to="/mall">去书城逛逛</Link>;
			break;
			case 'emptyTag':
				text = '你还没有设置标签哦';
				btn = <a className="u-btn" onClick={this.setTag}>去设置标签</a>;
			break;
			case 'emptyPur':
				text = '您还没有购买任何书本哦';
			break;
			case 'emptyBookstore':
				text = '您还没有收藏任何书单哦';
				btn = <Link className="u-btn" to={GLOBAL.setHref("top/block.0")}>去发现书单</Link>;
			break;
			case 'emptySearch': 
				text = '抱歉，查无此书';
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