import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import Link from 'react-router/lib/Link';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import myEvent from '../modules/myEvent';
import Book1 from './book1';
import Book2 from './book2';
import Book3 from './book3';
import Book5 from './book5';
import Book6 from './book6';
import Book7 from './book7_mallSubject';
import Book8 from './book8_bookSheet';
import Block5 from './block5';

const Recommend = React.createClass({
  render() {
		 return <Link to={this.props.href} className="recommend"><span className="iconWord f-br-3">{this.props.block.icon_word}</span><span>{this.props.block.short_recommend_words}</span></Link>;
  }

});

const Block1 = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
  },
  render() {
		// this.props.data.contentlist.pop();
    return (
      <section className="m-block">
        <Link className="title" to={this.props.href}>
          <span className="f-fr">查看更多</span>
          <h2>{this.props.data.name}</h2>
        </Link>
        <div className="content">
          <ul className="subCat-1 f-clearfix">
            {
						this.props.data.contentlist.slice(0, (this.props.data.contentlist.length - (this.props.data.contentlist.length % 3))).map((v, i) => <Book2 key={i} data={v} />)
					}
          </ul>
          {this.props.recommend}
        </div>
      </section>
    );
  }
});
const Block2 = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
  },
  render() {
    return (
      <section className="m-block">
        <Link className="title" to={this.props.href}>
          <span className="f-fr">查看更多</span>
          <h2>{this.props.data.name}</h2>
        </Link>
        <div className="content">
          <ul className="subCat-2 f-clearfix">
            {
						this.props.data.contentlist.map((v, i) =>
							// if(i > 4) return;
  <Book1 key={i} data={v} />)
					}
          </ul>
          {this.props.recommend}
        </div>
      </section>
    );
  }
});
const Block3 = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
  },
  render() {
    return (
      <section className="m-block">
        <Link className="title" to={this.props.href}>
          {/* <span className="iconfont icon-arrow-right f-fr"></span>*/}
          <span className="f-fr">查看更多</span>
          <h2>{this.props.data.name}</h2>
        </Link>
        <div className="content">
          <ul className="subCat-3 f-clearfix">
            <div className="u-book2-line">
              {
							this.props.data.contentlist.map((v, i) => {
								// if(i > 4) return;
                if (i < 3) {
                  return <Book2 key={i} data={v} />;
                }
                return null;
              })
						}
            </div>
            {
							this.props.data.contentlist.map((v, i) => {
								// if(i > 4) return;
                if (i >= 3) {
                  return <Book3 key={i} data={v} />;
                }
                return null;
              })
						}
          </ul>
          {this.props.recommend}
        </div>
      </section>
    );
  }
});
const Block4 = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
  },
  render() {
    return (
      <section className="m-block">
        <Link className="title" to={this.props.href}>
          <span className="f-fr">查看更多</span>
          <h2>{this.props.data.name}</h2>
        </Link>
        <div className="content">
          <ul className="subCat-4 f-clearfix">
            {
						this.props.data.contentlist.map((v, i) => {
              if (i < 1) {
                return <Book1 key={i} data={v} />;
              } else if (i < 3) {
                return <Book3 key={i} data={v} />;
              }
              return null;
            })
					}
          </ul>
          {this.props.recommend}
        </div>
      </section>
    );
  }
});
const Block6 = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data;
  },
  render() {
    let emptyBook6;
    if (this.props.data.contentlist.length & 1) {
      emptyBook6 = <li className="u-book-6 empty-book-6"><a><span /></a></li>;
    }
    return (
      <section className="m-block m-block-catgory">
        <div className="title">
          <h2>{this.props.data.name}</h2>
        </div>
        <div className="content">
          <ul className="subCat-6 f-clearfix">
            {
						this.props.data.contentlist.map((v, i) =>
							// if(i > 5) return;
  <Book6 key={i} data={v} noImage={i >= 2} />)
					}
            {emptyBook6}
          </ul>
          {this.props.recommend}
        </div>
      </section>
    );
  }
});
const Block7 = React.createClass({
  getInitialState() {
    return {
      contentlist: this.props.data.contentlist,
      needUpdate: 0
    };
  },
  batchChange() {
    this.setState({
      contentlist: this.state.contentlist.sort(randomSort),
      needUpdate: this.state.needUpdate += 1
    });
    function randomSort(a, b) {
      return Math.random() > 0.5 ? 1 : -1;
    }
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data
				|| this.state.contentlist !== nextState.contentlist
				|| this.state.needUpdate !== nextState.needUpdate;
  },
  render() {
    return (
      <section className="m-block m-block-1">
        <div className="title title-1">
          <span className="batchChange f-fr" onClick={this.batchChange}>换一批</span>
          <h2>{this.props.data.name}</h2>
        </div>
        <div className="content">
          <ul className={`subCat-${this.props.data.style} f-clearfix`}>
            {
						this.state.contentlist.map((v, i) => {
              if (i > 5) return null;
              const handle = 	function (e) {
                e.preventDefault();
                browserHistory.push({ pathname: GLOBAL.setHref(`searchList/search.${v.name}`), state: v.name });
              };
              return (
                <li key={i}>
                  <a onClick={handle} href="#" className={this.props.data.style == 7 ? (`style-${i + 1}`) : 'u-btn2'}>{v.name}</a>
                </li>
              );
            })
					}
          </ul>
          {this.props.recommend}
        </div>
      </section>
    );
  }
});
const Block9 = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
  },
  render() {
    return (
      <section className="m-block m-block-1">
        <Link className="title title-1" to={this.props.href}>
          <h2>{this.props.data.name}</h2>
        </Link>
        <div className="content">
          <ul className="f-clearfix">
            {
						this.props.data.contentlist.map((v, i) => <Book5 key={i} data={v} num={i} />)
					}
          </ul>
          {this.props.recommend}
        </div>
      </section>
    );
  }
});
const Block12 = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data;
  },
  render() {
    return (
      <section className="m-block">
        <div className="content">
          <ul className="f-clearfix subCat-13">
            {
						this.props.data.contentlist.slice(0, this.props.data.contentlist.length - (this.props.data.contentlist.length % 2)).map((v, i) => <Book7 key={i} data={v} style={this.props.data.style} />)
					}
          </ul>
          {this.props.recommend}
        </div>
      </section>
    );
  }
});
const Block14 = React.createClass({
  pages: 1,
  mixins: [mixins()],
  readMoreHandle(e) {
    const that = this;
    this.pages += 1;
    const AJAX = new Ajax(`block.${this.props.data.id}`);
    AJAX.get((data) => {
      if (!data && !data.length) {
        that.setState({
          noMore: true
        });
        return;
      }
      if (data.length < 10) {
        that.setState({
          noMore: true
        });
      }
      that.setState({
        contentList: that.state.contentList.concat(data.content)
      });
    });
  },
  getInitialState() {
    return {
      contentList: this.props.data.contentlist,
      noMore: this.props.data.contentlist.length < 6
    };
  },
  componentDidUpdate() {
    this.lazyloadImage(this.refs.container);
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.contentList !== nextState.contentList || this.state.noMore !== nextState.noMore;
  },
  render() {
    let more;
    if (!this.state.noMore) {
      more = (<button className="u-readMore f-bt-eee f-mb--10" onClick={this.readMoreHandle}>点击查看更多...</button>);
    }
    return (
      <section className="m-block">
        <div className="title bsTitle f-pr" href={this.props.href}>
          <i className="iconfont icon-lh3 f-block f-tc" />
          <h2 className="f-tc">{this.props.data.name}</h2>
        </div>
        <div className="content" ref="container">
          <ul className="subCat-14">
            {
						this.state.contentList.map((v, i) => <Book8 key={i} data={v} />)
					}
          </ul>
          {this.props.recommend}
          {more}
        </div>
      </section>
    );
  }
});
const Block15 = React.createClass({
  mixins: [mixins()],
  configTag(e) {
		// var that = this;
    e.preventDefault();
    if (!this.isLogin()) {
      this.goLogin(callback);
      return;
    }
    callback();
    function callback() {
			// alert(that.isLogin());
      const AJAX = new Ajax('listTag');
      AJAX.get((data) => {
        if (data.selected.length) {
          myEvent.execCallback('updateTopList');
        } else {
          myEvent.setCallback('configTag', () => {
            myEvent.execCallback('updateTopList');
						// TODO 重新加载本页
          });
          browserHistory.push(GLOBAL.setHref('myTags'));
        }
      });
    }
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data;
  },
  render() {
    if (!this.props.data.contentlist.length) {
      return (
        <section className="m-block">
          <div className="title bsTitle f-pr">
            <i className="iconfont icon-heart f-block f-tc" />
            <h2 className="f-tc">{this.props.data.name}</h2>
          </div>
          <div className="content content-none">
            <a onClick={this.configTag} className="u-btn3">+设置我的标签</a>
          </div>
        </section>
      );
    } else {
      return (
        <section className="m-block">
          <Link className="title bsTitle f-pr" to={this.props.href}>
            <span className="iconfont icon-arrow-right f-pa" />
            <i className="iconfont icon-heart f-block f-tc" />
            <h2 className="f-tc">{this.props.data.name}</h2>
          </Link>
          <div className="content">
            <ul className="subCat-4 f-clearfix">
              {
							this.props.data.contentlist.map((v, i) => <Book1 key={i} data={v} />)
						}
            </ul>
            {this.props.recommend}
          </div>
        </section>
      );
    }
  }
});
const Blocklist = React.createClass({
  getInitialState() {
    return {
      comps: null,
      block5: {}
    };
  },
  getUpdate(blockList) {
    const that = this;
    let hrefStr;
    const comps = blockList.map((block, i) => {
			// console.log('风格' + block.style)
      if (block.style != 15 && (!block.contentlist || !block.contentlist.length)) {
        return null;
      }

      hrefStr = GLOBAL.setHref(`more/blocks.${block.id}`);

      if (that.props.pageId) {
        hrefStr = GLOBAL.setHref(`more/blocks.${block.id}.${that.props.pageId}`);
      }
      const recommend = block.icon_word ? <Recommend block={block} href={hrefStr} /> : null;

      switch (block.style) {
        case 1 :
        case 24 : // 24 横排三图
          return <Block1 key={i} data={block} href={hrefStr} recommend={recommend} />;
        case 2 :
          return <Block2 key={i} data={block} href={hrefStr} recommend={recommend} />;
        case 3 :
          return <Block3 key={i} data={block} href={hrefStr} recommend={recommend} />;
        case 4 :
          return <Block4 key={i} data={block} href={hrefStr} recommend={recommend} />;
        case 11: // banner不铺满
        case 5 : // banner铺满
          // 筛除不支持的广告类型
          block = block.contentlist.filter((v) => {
            const hrefObj = GLOBAL.typeAdHref(v);
            if (!hrefObj) return false;
            return true;
          });
          return <Block5 key={i} data={block} style={block.style} />;
					// return <AdWrap key={i} data={block} style={block.style} />;
        case 6 :
          return <Block6 key={i} data={block} href={hrefStr} recommend={recommend} />;
        case 7 : // 7 圆形热词风格
        case 8 : // 8 方形热词风格
          return <Block7 key={i} data={block} recommend={recommend} />;
        case 9 : // 9文字瀑布流风格
          return <Block9 key={i} data={block} href={hrefStr} recommend={recommend} />;
        case 12 : // 12 半图偶数专题风格
        case 13 : // 13 半图偶数排行风格
          return <Block12 key={i} data-id={i} data={block} recommend={recommend} />;
        case 14 : // 14 书单风格
          return <Block14 key={i} data={block} href={hrefStr} recommend={recommend} />;
        case 15 : // 15 猜你喜欢风格
          return <Block15 key={i} data={block} href={hrefStr} recommend={recommend} />;
        default:
          break;
      }
      return null;
    });
    return comps;
  },
  componentWillMount() {
    const comps = this.getUpdate(this.props.blockList);
    this.setState({
      comps
    });
  },
  componentWillReceiveProps(netProp) {
    const comps = this.getUpdate(netProp.blockList);
    this.setState({
      comps
    });
  },
	// shouldComponentUpdate: function(nextProps, nextState) {
	// 	var check = function(item){
	// 		return item == null;
	// 	}
	// 	return true;
	// 	return this.state.comps !== nextState.comps;
	// },
  render() {
		// console.log(this.state.comps)
    return (
      <div className="f-pr m-block-c">
        {this.state.comps}
      </div>
    );
  }
});

module.exports = Blocklist;
