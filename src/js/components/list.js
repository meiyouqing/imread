import NoData from './noData';
import Loading from './loading';
import browserHistory from 'react-router/lib/browserHistory';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import React from 'react';
const Header = require('./header');
const Header_s = require('./header_s');
const Block7 = require('./block7');

const List = React.createClass({
  mixins: [mixins()],
  scrollPagesNo: 1,
  getList(param) {
    if (!this.isMounted()) return;
		// if(this.state.empty || this.state.noMore) return;
    param = param || this.getListId();
    this.getListAjax = new Ajax(`${param}.${this.scrollPagesNo}`, true);
    this.getListAjax.get(this.ajaxHandle, (error) => {
      if (this.state.scrollUpdate) {
        this.setState({
          scrollUpdate: false,
          noMore: true
        });
        return;
      }
      this.setState({
        UFO: true
      });
    });
  },
  ajaxHandle(data) {
		// if(!this.isMounted()) return;
    const pathname = this.props.location.pathname.split('/');
    if (/^search\./.test(pathname[pathname.length - 1])) {
      if (!data.contentlist.length) {
        if (!this.state.bookList) {
          this.setState({ empty: true, bookList: [] });
          return;
        }
        this.setState({
          scrollUpdate: false,
          noMore: true
        });
        return;
      }
      this.setState({
        recommend: data,
        resultCount: data.result_count,
        bookList: this.state.scrollUpdate ? this.state.bookList.concat(data.contentlist) : data.contentlist,
        UFO: false,
        empty: false,
        scrollUpdate: false
      });
    } else {
      if (!data || !data.content.length) {
        this.setState({
          noMore: true,
          scrollUpdate: false
        });
        return;
      }
      this.setState({
        recommend: data,
        bookList: this.state.scrollUpdate ? this.state.bookList.concat(data.content) : data.content,
        scrollUpdate: false
      });

      if (data.content.length < this.getListAjax.param.contents) {
        this.setState({
          noMore: true,
          scrollUpdate: false
        });
        return;
      }
    }
  },
  goSearch() {
    if (!this.isMounted()) return;
    if (!this.state.scrollUpdate) {
      this.refs.container.scrollTop = 0;
      this.setState({
        noMore: false,
        bookList: null,
        resultCount: null
      });
    }
    this.getList();
  },
  getInitialState() {
    return {
      noMore: false,
      resultCount: null,
      recommend: {},
      bookList: null,
      scrollUpdate: false,
      UFO: false,
      empty: false,
      title: '艾美阅读'
    };
  },
  componentWillMount() {
    if (typeof this.props.params.listId !== 'string' && !/author/.test(this.props.route.path))	return;
    this.getListAjax = new Ajax(this.getListId());
    this.usePreload(this.getListId());
  },
  getListId() {
    const listId = this.props.params.listId;
    if (typeof listId === 'string')			{ return listId; } else			{
      return listId[listId.length - 1];
    }
  },
  componentDidMount() {
    if (typeof this.props.params.listId !== 'string' && !/author/.test(this.props.route.path))	return;
    if (GLOBAL.isRouter(this.props) && !this.state.bookList) this.getList();
    this.lazyloadImage(this.refs.container);
		// this.disPatch('scroll',this.refs.container)
  },
  componentDidUpdate(nextProps, nextState) {
    GLOBAL.isAd();
    if (GLOBAL.isRouter(this.props)) {
      if (!this.state.bookList) {
        this.getList();
      } else {
        this.lazyloadImage(this.refs.container);
      }
    }
  },
  componentWillReceiveProps(nextProps) {
		// var isSearch = /searchList/.test(this.props.route.path);
    if (this.props.params.listId !== nextProps.params.listId && this.props.children === nextProps.children) {
      this.setState({ bookList: null });
      this.getList(nextProps.params.listId);
    }
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.bookList !== nextState.bookList
				|| this.state.scrollUpdate !== nextState.scrollUpdate
				|| this.state.UFO !== nextState.UFO
				|| this.state.empty !== nextState.empty
				|| this.state.recommend !== nextState.recommend
				|| this.state.noMore !== nextState.noMore
				|| this.props.children !== nextProps.children
				|| this.props.params.listId !== nextProps.params.listId;
  },
  render() {
    let header,
      noData,
      content,
      sLoading,
      result_count;
    let title,
      match;
    if (match = this.getListId().match(/^alist\.(.+)/)) title = match[1];
    header = <Header title={this.state.recommend.name || title || GLOBAL.title} right={null} path={this.props.route} />;

    if (/^searchList/.test(this.props.route.path)) {
      header = <Header_s goSearch={this.goSearch} route={this.props.route} params={this.props.params} keyValue={this.props.location.state} />;
    }
		// 定义content
    if (!this.state.bookList) {
			// if(GLOBAL.isRouter(this.props))	//兼容低端安卓
      content = <Loading />;
    } else if (!this.state.bookList.length) {
      noData = (<div className="g-main g-main-1"><NoData type="emptySearch" /></div>);
      content = null;
      result_count = null;
    } else {
      content = <Block7 recommend={this.state.recommend} bookList={this.state.bookList} location={this.props.location} />;
      sLoading = <Loading cls="u-sLoading" />;
    }
    if (this.state.noMore) {
      sLoading = null;
    }
    if (this.state.UFO || this.state.empty) {
      noData = (<div className="g-main g-main-1"><NoData type={this.state.UFO ? 'UFO' : 'emptySearch'} /></div>);
      content = null;
      result_count = null;
      sLoading = null;
    }
		// console.log(content)
    return (
      <div className="gg-body">
        {header}
        <div className="g-main g-main-1 m-list">
          <div className="g-scroll" onScroll={this.scrollHandle} ref="container">
            {result_count}
            {content}
            {sLoading}
          </div>
        </div>
        {noData}
        {this.props.children}
      </div>
    );
  }
});

module.exports = List;
