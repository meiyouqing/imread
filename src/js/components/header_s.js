import browserHistory from 'react-router/lib/browserHistory';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import React from 'react';

const Header_s = React.createClass({
  getInitialState() {
    let key = '';
    if (/^searchList/.test(this.props.route.path)) {
      let list = this.props.params.listId;
      if (typeof list !== 'string')				{
        list = list[0];
      }
      key = list.split('.')[1] || '';
    }
    return {
      key,
      btn: '取消',
      search: false
    };
  },
  handleChange(e) {
    this.setState({
      key: e.target.value.trim(),
      btn: '搜索',
      search: true
    });
  },
  handleClick(e) {
    e.preventDefault();
    this.refs.searchInput.blur();
    if (this.state.search) {
      const	key = this.state.key;
      if (!key) return;
      if (GLOBAL.name === 'searchList') {
        const AJAX = new Ajax(`search.${key}`);
        this.props.goSearch();
      } else {
        const tester = /searchList\/search.([^\"]*)/;
        if (tester.test(location.pathname))					{
          browserHistory.replace(`${location.pathname.replace(tester, '')}searchList/search.${key}`);
        } else					{ browserHistory.push({ pathname: GLOBAL.setHref(`searchList/search.${key}`), state: this.state.key }); }
      }
      if (this.props.from === 'search') {
        this.setState({
          key: '',
          search: true,
          btn: '搜索'
        });
      } else {
        this.setState({
          search: false,
          btn: '取消'
        });
      }
    } else {
      GLOBAL.goBack(location.pathname.replace(/\/search.*$/, ''));
    }
  },
  backClick() {
    this.setState({
      key: ''
    });
    GLOBAL.goBack(this.path);
  },
  componentDidMount() {
		// console.log(this.props.keyValue)
    if (!this.props.keyValue && !this.state.key) {
			// this.refs.searchInput.focus();
    } else if (typeof this.props.keyValue === 'string') {
      this.setState({ key: this.props.keyValue });
    }
    this.path = this.props.route.path.replace(/:([^\"]*)/, '');
    this.path = window.location.pathname.split(`/${this.path}`)[0];
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.key !== nextState.key || this.state.btn !== nextState.btn;
  },
  render() {
    return (
      <header className="m-bar m-bar-head">
        <a className="f-fl iconfont icon-left" onClick={this.backClick} />
        <form className="u-search f-cb">
          <span className="iconfont icon-sousuo" />
          <input className="searchInput" ref="searchInput" type="search" value={this.state.key} placeholder="书名/作者" onChange={this.handleChange} />
          <button className="searchBtn f-fr" type="submit" onClick={this.handleClick} >{this.state.btn}</button>
        </form>
      </header>
    );
  }
});

module.exports = Header_s;
