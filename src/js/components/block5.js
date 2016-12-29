import React from 'react';
import Link from 'react-router/lib/Link';
import GLOBAL from '../modules/global';
import Swipe from '../modules/swipe';
import uploadLog from '../modules/uploadLog';

const Block5 = React.createClass({
  getWidthAndHeight() {
    const w = document.body.offsetWidth - (this.props.style == 11 ? 8 : 0);
    return {
      width: w,
      height: w / 3,
      height11: w / 5
    };
  },
  getInitialState() {
    return { update: 0, width: '100%', height: 'auto', height11: 'auto' };
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
      index %= that.props.data.length;
      // if (GLOBAL.name === 'mall' || (GLOBAL.name == 'reading' && that.props.fromReading)) {
      // 	// 判断是否在书城
      //   setTimeout(() => {
      //     if (!ele || GLOBAL.isElementVisible(ele)) {
      //       that.logIntercut(that.props.data.contentlist[index].content_id, 1, that.props.data.contentlist[index].show_class);
      //     }
      //   }, 50);
      // }
      ele = ele || that.refs.swipe.querySelector('a');
      if (ele) {
        const img = ele.querySelector('img');
        if (img && img.getAttribute('data-src') !== 'loaded') {
          const src = img.getAttribute('data-src');
          img.setAttribute('data-src', 'loading');
          GLOBAL.loadImage(src, () => {
            img.src = src;
            img.style.height = that.props.style !== 11 ? that.state.height : `${70}px`;
            img.setAttribute('data-src', 'loaded');
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
  handleResize() {
    if (!this.isMounted()) return;
    this.setState(this.getWidthAndHeight());
  },
  updateIndex() {
    if (!this.isMounted()) return;
    this.setState({ update: this.state.update + 1 });
  },
  componentDidMount() {
    // alert('mount')
    this.initSwipe();
    this.setState(this.getWidthAndHeight());
    // 横竖屏切换 重新计算高度
    window.addEventListener('resize', this.handleResize, false);

    document.addEventListener('updateMall', this.updateIndex);
  },
  componentWillUnmount() {
    // document.removeEventListener("updateMall", this.updateIndex, false);
    // window.removeEventListener('resize', this.handleResize, false);
    // console.log(uploadLog.result)
    uploadLog.sending('intercut');
    this.swipe && (this.swipe.kill());
    window.removeEventListener('resize', this.handleResize, false);
  },
  componentDidUpdate() {
    // console.log('componentDidUpdate')
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
  shouldComponentUpdate(nextProps, nextState) {
    // console.log(this.state.height !== nextState.height , this.state.update !== nextState.update , this.props.data !== nextProps.data);
    return this.state.height !== nextState.height
      || this.state.update !== nextState.update
      || this.props.data !== nextProps.data;
  },
  render() {
    let swipeNav;
    if (this.props.data.length > 1) {
      swipeNav = (
        <div className="swipe-nav">
          <div className="swipe-nav-wrap f-clearfix" ref="swipe-nav">
            {
              this.props.data.map((v, i) => (
                <a key={i} className="f-fl swipe-nav-item" />
              ))
            }
          </div>
        </div>
      );
    }
    const visibility = this.props.data.length > 1 ? 'hidden' : 'visible';
    const pathname = GLOBAL.getLocation();
    return (
      <section className="m-block-top m-block n-padding" style={{ border: 'none' }}>
        <div className="content">
          <div className={`subCat-5${this.props.style == 11 ? ' subCat-11' : ''}`}>
            <div className="swipe" ref="swipe" style={{ visibility, height: (this.props.style !== 11 ? this.state.height : this.state.height11) }}>
              <div className="swipe-wrap">
                {
                  this.props.data.map((v, i) => {
                    const hrefObj = GLOBAL.typeAdHref(v);
                    const search = this.props.fromReading ?
                      (`?devicetoken=${GLOBAL.getUuid()}&comeFrom=${encodeURIComponent(pathname)}`) :
                      '';
                    let imgSrc = v.intercut_url || v.image_url;
                    let imger;
                    if (typeof window === 'undefined' && /sdk\/sdk\.\d+/.test(pathname)) {
                      imger = <img src={imgSrc} className="u-adimg" style={{ width: '100%' }} />;
                    } else {
                      imgSrc = imgSrc.replace(/^http:\/\//, 'https://');
                      imger = <img src="" data-src={imgSrc} className="u-adimg" style={{ width: '100%' }} />;
                    }

                    if (this.props.data.length < 2) { imger = <img src={imgSrc} className="u-adimg" style={{ width: '100%' }} />; }

                    return (
                      <Link style={{ backgroundColor: '#e3e3e3', height: this.state.height }} to={hrefObj.url + search} target={hrefObj.target} className="swipe-ad f-fl" key={i} onClick={this.handleIntercurClick} data-intercut_id={v.content_id}>
                        {imger}
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

module.exports = Block5;
