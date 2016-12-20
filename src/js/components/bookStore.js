import NoData from './noData';
import Ajax from '../modules/ajax';
import mixins from '../modules/mixins';
import React from 'react';
import Link from 'react-router/lib/Link';
const Img = require('./img');
const Book10 = require('./book10');
const Block7 = require('./block7');
const Loading = require('./loading');
const Book7 = require('./book7_mallSubject');
import GLOBAL from '../modules/global';


const List = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    return {
      noMore: false,
      scrollUpdate: false,
      onerror: false,
      list: []
    };
  },
  getList() {
    AJAX.get((data) => {
      if (data.content.length < 1)	{
        this.setState({ noMore: true });
        return;
      }
      this.setState({
        list: this.state.scrollUpdate ? this.state.list.concat(data.content) : data.content,
        scrollUpdate: false
      });
    }, this.onerror);
  },
  scrollData(e) {
    const AJAX = new Ajax('block');
    this.scrollHandle(e);
  },
  componentDidMount() {
    this.setState({ list: this.props.data.contentlist });
    const pid = this.props.data.id;
    const AJAX = new Ajax(`block.${pid}.6.1`);
  },
  componentDidUpdate(nextProp) {
    this.lazyloadImage(this.refs.contain, true);
  },
  render() {
    let sLoading = <Loading cls="u-sLoading transparent" />,
      list = null;

    if (this.state.noMore) {
      sLoading = null;
    }

    return (
      <section className="m-block  g-scroll" onScroll={this.scrollData} ref="contain">
        <div className="content">
          <ul className={`f-clearfix subCat-${this.props.data.style}`}>
            {
						this.state.list.map((v, i) => <Book10 key={i} data={v} />)
					}
          </ul>
          {sLoading}
        </div>

      </section>
    );
  }

});

const Guess = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    return {
      noMore: false,
      scrollUpdate: false,
      onerror: false,
      list: null
    };
  },
  componentDidMount() {
    this.getList();
  },
  componentDidUpdate(nextProp) {
    this.lazyloadImage(this.refs.contain, true);
		// if(this.props.data.contentlist.length !== nextProp.data.contentlist.length){
		// 	const AJAX = new Ajax('block.'+this.props.data.id+'.10.1');
		// 	this.getList();
		// }
  },
  getList() {
    const AJAX = new Ajax(`block.${this.props.data.id}.10.1`);
    AJAX.get((data) => {
      if (data.content.length < 1)	{
        this.setState({
          noMore: true,
          list: this.state.scrollUpdate ? this.state.list.concat(data.content) : data.content
        });
        return;
      }
      this.setState({
        list: this.state.scrollUpdate ? this.state.list.concat(data.content) : data.content,
        scrollUpdate: false
      });
    }, this.onerror);
  },
  render() {
    let sLoading = null,
      list = null;
    if (!this.state.list) {
      list = <Loading />;
    } else if (!this.state.list.length) {
      list = <NoData type="emptyTag" updateGuess={this.getList} />;
    } else {
      list = <Block7 bookList={this.state.list} />;
      if (this.state.list.length) {
        sLoading = <Loading cls="u-sLoading transparent" />;
      }
    }

    if (this.state.noMore) {
      sLoading = null;
    }

    return (
      <div className="g-scroll bg-1" ref="contain" onScroll={this.scrollHandle}>
        {list}
        {sLoading}
      </div>
    );
  }
});

const Paihang = React.createClass({
  render() {
    return (
      <section className="m-block  g-scroll">
        <div className="content">
          <ul className={`f-clearfix subCat-${this.props.data.style}`}>
            {
						this.props.data.contentlist.slice(0, this.props.data.contentlist.length - (this.props.data.contentlist.length % 2)).map((v, i) => <Book7 key={i} data={v} style={this.props.data.style} />)
					}
          </ul>
        </div>
      </section>
    );
  }
});

if (typeof window !== 'undefined') {
  const POP = require('../modules/confirm');
}

const BookStore = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data
		|| this.props.order !== nextProps.order;
  },
  render() {
    const blocks = this.props.data;
    blocks[this.props.order].display = true;
    let list;

    const sLoading = <Loading cls="u-sLoading" />;
    this.props.data.map((v, i) => {
      if (v.display) {
        switch (v.style) {
          case 14:
            list = <List data={v} />;
            break;
          case 13:
            list = <Paihang data={v} />;
            break;
          case 15:
          case 3:
            list = <Guess data={v} />;
            break;
        }
      }
    });
    blocks[this.props.order].display = false;

    return (
      <div>
        {list}
      </div>
    );
  }
});

module.exports = BookStore;
