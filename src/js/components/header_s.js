import browserHistory from 'react-router/lib/browserHistory'
import AJAX from '../modules/AJAX'
import GLOBAL from '../modules/global'
import React from 'react'

var Header_s = React.createClass({
	getInitialState: function(){
		var key = '';
		if(/^searchList/.test(this.props.route.path)){
			key = this.props.params['listId'].split('.')[1] || '';
		}
		return{
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
			if(!key) return;
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
			if(this.props.from === 'search'){
				this.setState({
					key: '',
					search: true,
					btn: '搜索'
				});
			}else{	
				this.setState({
					search: false,
					btn: '取消'
				});
			}
		}else{
			GLOBAL.goBack(location.pathname.replace(/\/search.*$/,''));
		}
	},
	backClick: function(){
		this.setState({
			key: ''
		});
		GLOBAL.goBack(this.path);
	},
	componentDidMount: function(){
		// console.log(this.props.keyValue)
		if(!this.props.keyValue && !this.state.key){
			//this.refs.searchInput.focus();
		} else {
			if(typeof this.props.keyValue === 'string')
				this.setState({key: this.props.keyValue})
		}
		this.path = this.props.route.path.replace(/:([^\"]*)/,'');
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