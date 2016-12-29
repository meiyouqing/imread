import React from 'react';
import Link from 'react-router/lib/Link';
import Swipe from '../modules/swipe';
import uploadLog from '../modules/uploadLog';
import GLOBAL from '../modules/global';

const Block9 = React.createClass({
  getWidthAndHeight() {
    return {
      update: 0
    };
  },
  getInitialState() {
    return this.getWidthAndHeight();
  },
  logIntercut(intercut_id, event) {
    uploadLog.send('intercut', {
      intercut_id,
      event,
      show_class: this.props.fromReading ? 1 : 3
    });
  },
  handleIntercurClick(e) {
    this.logIntercut(e.target.getAttribute('data-intercut_id'), 2);
    return true;
  },
  initSwipe() {
    const that = this;
    const swipeNav = this.refs['swipe-nav'];
    this.swipe && (this.swipe.kill());

    const swipeCallback = function (index, ele) {
      index %= that.props.data.contentlist.length;
      // if (GLOBAL.name === 'mall' || (GLOBAL.name == 'reading' && that.props.fromReading)) {
				// 判断是否在书城
				// setTimeout(function() {
				// 	if (!ele || GLOBAL.isElementVisible(ele)) {
				// 		that.logIntercut(that.props.data.contentlist[index].content_id, 1, that.props.data.contentlist[index].show_class);
				// 	}
				// }, 50);
      // }
      ele = ele || that.refs.swipe.querySelector('a');
      if (ele && ele.querySelector('img')) {
        const img = ele.querySelector('img');
        if (!img.getAttribute('data-load-state')) {
          const src = img.getAttribute('data-src');
          img.setAttribute('data-load-state', 'loading');
          GLOBAL.loadImage(src, () => {
            img.src = src;
            img.style.height = '100%';
            img.setAttribute('data-load-state', 'loaded');
          });
        }
      }
      that.toggleSwipeNav(index);
    };
    swipeCallback(0);

    if (!swipeNav) {
      return;
    }
		// var swipeNavs = swipeNav.children;
    this.swipe = new Swipe(this.refs.swipe, {
      auto: 3000,
      callback: swipeCallback
    });
    this.toggleSwipeNav(0);
  },
  typeHref(data) {
    const bid = data.content_id || data.book_id || data.sheet_id || 0;
    const type = +data.type || +data.content_type;
    let target = '_self';
    if (/2|3|4/.test(data.intercut_type)) {
      target = '_blank';
      if (GLOBAL.isAndroid() && (+data.intercut_type) === 4) {
        target = 'download';
      }
    }
    if (/^http:\/\/m\.imread\.com.*referer=\d/.test(data.redirect_url)) {
      data.redirect_url = data.redirect_url.replace(/referer=\d/, '');
    }
    if (isNaN(type)) return '';

    function setHref(url) {
      const link = location.pathname.match(/self\/page.\d+.\d+/);
      if (link) return `${location.pathname}/${url}`;
			// return url;
      return `${location.pathname.match(/\/mall\/page.\d+/)[0]}/${url}`;
    }

    switch (type) {
      case 1:// 图书详情
        return setHref(`book/introduce.${bid}`);
      case 3:// 搜索
        return setHref(`search/search.${data.name}`);
      case 4:// 目录
      case 5:// 分类
        return setHref(`cat/category.${bid}`);
      case 6:// 书城的子页面
        return setHref(`self/page.${data.content_id}.6.1`);
      case 7:// 书单
        return setHref(`sheet/bookSheet.${bid}`);
      case 11:// 跳h5下载游戏
	    		case 12:// 跳下载apk
	    		case 13:// 跳内部网页
	    		case 14: // 跳外部网页
	    		case 15:// app to H5
	    			return { url: data.redirect_url || '#', target };
      default:
          return { url: data.redirect_url || '#', target };
    }
  },
  handleResize(e) {
    this.setState(this.getWidthAndHeight());
  },
  updateIndex() {
    this.setState({ update: this.state.update + 1 });
  },
  componentDidMount() {
		// alert('mount')
    this.initSwipe();
		// 横竖屏切换 重新计算高度
		// window.addEventListener('resize', this.handleResize, false);

		// document.addEventListener('updateMall',this.updateIndex);
  },
  componentDidUpdate() {
		// alert('update')
    this.initSwipe();
  },
  toggleSwipeNav(index) {
    const swipeNav = this.refs['swipe-nav'];
    if (swipeNav && swipeNav.children && swipeNav.children.length) {
      for (let i = 0; i < swipeNav.children.length; i++) {
        GLOBAL.removeClass(swipeNav.children[i], 'swipe-nav-item-active');
        if (i == index) {
          GLOBAL.addClass(swipeNav.children[i], 'swipe-nav-item-active');
        }
      }
    }
  },
  componentWillUnmount() {
		// console.log(uploadLog.result)
    uploadLog.sending('intercut');
    this.swipe && (this.swipe.kill());
    window.removeEventListener('resize', this.handleResize, false);
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data.contentlist !== nextProps.data.contentlist
				|| this.state.height !== nextState.height
				|| this.state.update !== nextState.update;
  },
  componentWillReceiveProps(nextProps) {
		// alert('rece')
		// this.swipe && (this.swipe.kill());
  },
  render() {
    let swipeNav;
    if (this.props.data.contentlist.length > 1) {
      swipeNav = (
        <div className="swipe-nav">
          <div className="swipe-nav-wrap f-clearfix" ref="swipe-nav">
            {
                		this.props.data.contentlist.map((v, i) => (
                  <a key={i} className="f-fl swipe-nav-item" />
	                		))
                	}
          </div>
        </div>
			);
    }
    const visibility = this.props.data.contentlist.length > 1 ? 'hidden' : 'visible';
    return (
      <section className="m-block-top m-block n-padding">
        <div className="content">
          <div className={`subCat-5${this.props.style == 11 ? ' subCat-11' : ''}`}>
            <div className="swipe" ref="swipe" style={{ visibility, height: '100%' }}>
              <div className="swipe-wrap">
                {
			                	this.props.data.contentlist.map((v, i) => {
                  let hrefObj = this.typeHref(v);
                  const search = this.props.fromReading ?
										`?devicetoken=${GLOBAL.getUuid()}&comeFrom=${encodeURIComponent(location.pathname)}` :
										'';
                  if (!hrefObj.url) hrefObj = { url: hrefObj, target: null };

			                		return (
  <Link style={{ backgroundColor: '#e3e3e3', height: '100%' }} to={hrefObj.url + search} target={hrefObj.target} className="swipe-ad f-fl" key={i} onClick={this.handleIntercurClick} data-intercut_id={v.content_id}>
    <img src={v.intercut_url || v.image_url} className="u-adimg" style={{ width: '100%', height: '100%' }} />
  </Link>
			                		);
			                	})
			                }
              </div>
              {swipeNav}
            </div>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = Block9;
