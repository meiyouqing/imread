import parseQuery from '../modules/parseQuery';
import Loading from './loading';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import React from 'react';
const Blocklist2 = require('./blocklist');
const Header = require('./header');

const Selfbuild = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    return {
      data: null,
      title: null
    };
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.data !== nextState.data;
  },
  getList() {
    const AJAX = new Ajax(this.props.params.selfId);
    AJAX.get((res) => {
      this.setState({ data: res.blocklist, title: res.name });
    });
  },
  componentDidMount() {
    this.getList();

		// 判断来源from
    this.from = parseQuery(location.search);
  },
  componentDidUpdate() {
    GLOBAL.isAd();
    this.lazyloadImage(this.refs.container);
  },
  shouldComponentUpdate(nextProp, nextState) {
    return this.state.data !== nextState.data
				|| this.props.children !== nextProp.children;
  },
  render() {
		// console.log(this.props.data)
		// var hrefStr = Router.setAPI(this.props.data,this.props.spm);
    let skipurl = '',
      loading,
      content;
    if (this.from && this.from.skipurl) {
      skipurl = this.from.skipurl;
    }

    if (!this.state.data) {
      if (GLOBAL.isRouter(this.props)) { loading = <Loading />; }
    } else			{
      content = (<div className="g-main g-main-1">
        <div className="g-scroll m-self-build" ref="container" onScroll={this.scrollHandle}>
          <Blocklist2 blockList={this.state.data} />
        </div>
      </div>);
    }
    return (
      <div className="gg-body">
        <Header title={this.state.title} skipurl right={null} path={this.props.route} />
        {content}
        {loading}
        {this.props.children}
      </div>
    );
  }
});

module.exports = Selfbuild;
