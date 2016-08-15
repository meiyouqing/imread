import parseQuery from '../modules/parseQuery';

var Header = React.createClass({
	getDefaultProps: function(){
		var sHandle = function(e){
			browserHistory.push(GLOBAL.setHref('search/page.11.0.1'));
		};


		// browserHistory.listen(function(nextHistory){
		// 	var arr = nextHistory.pathname.split('/');
		// 	var path = arr.pop();
		// 	if(path.indexOf('.')>=0)	path = arr.pop();

		// 	GLOBAL.historyPath = nextHistory.pathname.split('/'+path)[0];

		// 	if(nextHistory.action == 'POP'){
		// 		if(!GLOBAL.state)  return;
		// 		GLOBAL.state--;
		// 	} else if(nextHistory.action == 'PUSH'){
		// 		GLOBAL.state++;
		// 	} else {
		// 		console.log('replace')
		// 	}
		// });

		return {
			right:<a className="icon-s icon-searcher f-fr" onClick={sHandle}></a>,
			title: GLOBAL.title || '艾美阅读'
		};
	},
	goBack: function(){
		GLOBAL.goBack(this.path);
		if(this.props.page==='tag'){
			myEvent.execCallback('updateGuess');
		}
	},
	componentDidMount: function(){
		this.path = this.props.path.path.replace(/:([^\"]*)/,'');
		this.path = window.location.pathname.split('/'+this.path)[0];
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.title !== nextProps.title 
				|| this.props.left !== nextProps.left 
				|| this.props.right !== nextProps.right;
	},
	render: function(){
		var from = parseQuery(location.search);
		var isskip = false;
		var defaultLeft = this.props.left === undefined?<a className="f-fl icon-s icon-back" onClick={this.goBack} ></a>:this.props.left;

		if(this.props.skipurl && from.skipurl)
			isskip = true;


		return (
			<header className="m-bar m-bar-head">
				{isskip?<a className="f-fl icon-s icon-back" href={from.skipurl}></a>:defaultLeft}
				{this.props.right}
				{this.props.middle}
				<h1 className="title">{this.props.title}</h1>
			</header>
		);
	}
});

module.exports  = Header;