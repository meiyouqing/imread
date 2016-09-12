
var Header_s = React.createClass({
	getInitialState: function(){
		var key = '';
		if(GLOBAL.name === 'searchList'){
			key = decodeURIComponent(this.APIParts('searchListId')[1]);
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
		this.refs.searchInput.blur();
		if(this.state.search){
			var	key = this.state.key;
			if(GLOBAL.name==='searchList'){
				AJAX.init('search.'+key);
				this.props.goSearch();
			}else{
				var tester = /searchList\/search.([^\"]*)/;
				if(tester.test(location.pathname))
					browserHistory.replace(location.pathname.replace(tester,'')+'searchList/search.'+key);
				else
					browserHistory.push({pathname:GLOBAL.setHref('searchList/search.'+key),state:this.state.key});

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
		GLOBAL.goBack(this.path);
	},
	componentDidMount: function(){
		if(!this.props.keyValue){
			this.refs.searchInput.focus();
		} else {
			if(typeof this.props.keyValue === 'string')
				this.setState({key: this.props.keyValue})
		}
		this.path = this.props.path.path.replace(/:([^\"]*)/,'');
		this.path = window.location.pathname.split('/'+this.path)[0];
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state.key !== nextState.key || this.state.btn !== nextState.btn;
	},
	render: function(){
		return (
			<header className="m-bar m-bar-head">
				<a className="f-fl icon-s icon-back" onClick={this.backClick} ></a>
				<form className="u-search f-cb">
					<span className="i-put"></span>
					<input className="searchInput" ref="searchInput" type="search" value={this.state.key} placeholder="书名/作者" onChange={this.handleChange} />
					<button className="searchBtn f-fr" type="submit" onClick={this.handleClick} >{this.state.btn}</button>
				</form>
			</header>
		);
	}
});

module.exports  = Header_s;