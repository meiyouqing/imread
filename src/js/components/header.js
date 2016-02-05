var Header = React.createClass({
	getDefaultProps: function(){
		var sHandle = function(e){
			window.location.hash = Router.setHref('searchPage&page.11.1.3');
		};
		return {
			left:<a className="f-fl icon-back iconfont" onClick={Router.goBack.bind(Router)} ></a>,
			right:<a className="f-fr icon-search iconfont" onClick={sHandle}></a>,
			title: Router.title
		};
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.title !== nextProps.title 
				|| this.props.left !== nextProps.left 
				|| this.props.right !== nextProps.right;
	},
	render: function(){
		return (
			<header className="m-bar m-bar-head">
				{this.props.left}
				{this.props.right}
				<h1 className="title">{this.props.title}</h1>
			</header>
		);
	}
});

module.exports  = Header;