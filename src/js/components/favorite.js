import React from 'react';
import GLOBAL from '../modules/global';


const Favorite = React.createClass({
  getInitialState() {
    return {
      selected: 0,
      hide: false
    };
  },
  listId: [1, 2, 3, 0],
  chooseFavor(i) {
    this.id = this.listId[i];
    this.setState({ selected: i });
  },
  gotoMall() {
    this.id = this.id || 1;
    GLOBAL.cookie('group_id', this.id, { expires: 1000 });
    this.setState({ hide: true });
    this.props.favoriteDone();
  },
  shouldComponentUpdate(nextProp, nextState) {
		// console.log(this.props,nextProp)
    return this.state.selected !== nextState.selected
				|| this.state.hide !== nextState.hide;
  },
  render() {
    return (
      <div className={`gg-body${this.state.hide ? ' fade-out' : ''}`}>
        <div className="m-welcome g-scroll">
          <header>选择你的阅读偏好</header>
          <ul>
            {
                            [{ title: '男生网文', img_src: '/src/img/back/man.png' },
                            { title: '女生网文', img_src: '/src/img/back/woman.png' },
                            { title: '出版图书', img_src: '/src/img/back/chuban.png' },
                            { title: '随便看看', img_src: '/src/img/back/suibian.png' }].map((v, i) => (
                              <li key={i}><div className={`selected${this.state.selected === i ? ' active' : ''}`}><span className="iconfont icon-duihao" /></div><img src={v.img_src} onClick={this.chooseFavor.bind(this, i)} className={`select-${i}`} /><span>{v.title}</span></li>
                                    ))
                        }
          </ul>
          <a className="u-btn-4" onClick={this.gotoMall}>立即体验</a>
        </div>
      </div>
    );
  }
});
module.exports = Favorite;
