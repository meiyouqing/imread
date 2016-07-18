
var Header_s = React.createClass({
	getInitialState: function(){
		var key = '';
		if(GLOBAL.name === 'searchList'){
			key = decodeURIComponent(this.APIParts()[1]);
		} 
		return{
			initialKey: key,
			key: key,
			btn: '取消',
			search: false
		}
	},
	handleChange: function(e){
		this.setState({
			key: e.target.value.trim(),
			btn: '搜索',
			search: true
		})
	},
	handleClick: function(e){
		e.preventDefault();
		if(this.state.search){
			var	key = this.state.key;
			if(GLOBAL.name==='searchList'){
				AJAX.init('search.'+key);
				this.props.goSearch();
			}else{
				var tester = /searchList\/search.([^\"]*)/,
					link = '';
				if(tester.test(location.pathname))
					browserHistory.replace(location.pathname.replace(tester,'')+'searchList/search.'+key);
				else
					browserHistory.push(GLOBAL.setHref('searchList/search.'+key));

			}			
			this.setState({
				initialKey: key
			});
		}else{
			GLOBAL.goBack();
		}
	},
	backClick: function(){
		this.setState({
			key: ''
		});
		GLOBAL.goBack();
	},
	componentDidMount: function(){
		if(!this.state.key.length){
			this.refs.searchInput.focus();
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state.key !== nextState.key || this.state.btn !== nextState.btn;
	},
	render: function(){
		return (
			<header className="m-bar m-bar-head">
				<a className="f-fl icon-back iconfont" onClick={this.backClick} ></a>
				<form className="u-search f-cb">
					<input className="searchInput" ref="searchInput" type="search" value={this.state.key} placeholder="书名/作者/关键字" onChange={this.handleChange} />
					<button className="searchBtn f-fr" type="submit" onClick={this.handleClick} >{this.state.btn}</button>
				</form>
			</header>
		);
	}
});

module.exports  = Header_s;