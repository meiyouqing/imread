import parseQuery from '../modules/parseQuery';
var Header = React.createClass({
	getDefaultProps: function(){
		var sHandle = function(e){
			browserHistory.push(GLOBAL.setHref('search/page.11'));
		};


		return {
			left:<a className="f-fl icon-back iconfont" onClick={GLOBAL.goBack} ></a>,
			right:<a className="f-fr icon-search iconfont" onClick={sHandle}></a>,
			title: GLOBAL.title || '艾美阅读'
		};
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.title !== nextProps.title 
				|| this.props.left !== nextProps.left 
				|| this.props.right !== nextProps.right;
	},
	render: function(){
		var from = parseQuery(location.search);
		var isskip = false;

		if(this.props.skipurl && from.skipurl)
			isskip = true;

		return (
			<header className="m-bar m-bar-head">
				{isskip?<a className="f-fl icon-back iconfont" href={from.skipurl}></a>:this.props.left}
				{this.props.closeRight?'':this.props.right}
				<h1 className="title">{this.props.title}</h1>
			</header>
		);
	}
});

module.exports  = Header;