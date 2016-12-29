import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import GLOBAL from '../modules/global';

const Header = React.createClass({
  getDefaultProps() {
    const sHandle = function (e) {
      browserHistory.push(GLOBAL.setHref('search/page.11'));
    };
    const gotoZy = function () {
      browserHistory.push('/mall');
    };

    return {
      middle: <a className="iconfont icon-shucheng f-fr" onClick={gotoZy} />,
      right: <a className="iconfont icon-sousuo f-fr" onClick={sHandle} />,
      title: GLOBAL.title || '艾美阅读'
    };
  },
	// goBack: function(){
	// 	GLOBAL.goBack(this.path);
	// },
	// componentDidMount: function(){
	// 	this.path = this.props.path.path.replace(/:([^"]*)/,'');
	// 	this.path = window.location.pathname.split('/'+this.path)[0];
	// },
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.title !== nextProps.title
				|| this.props.left !== nextProps.left
				|| this.props.right !== nextProps.right
				|| this.props.middle !== nextProps.middle;
  },
  render() {
		// var from = parseQuery(location.search);
		// var isskip = false;
    const defaultLeft = this.props.left === undefined ? <a className="f-fl icon-back iconfont" onClick={this.goBack} /> : this.props.left;

		// if(this.props.skipurl && from.skipurl)
		// 	isskip = true;


    return (
      <header className="m-bar m-bar-head">
        {defaultLeft}
        {this.props.right}
        {this.props.middle}
        <h1 className="title">{this.props.title}</h1>
      </header>
    );
  }
});

module.exports = Header;
