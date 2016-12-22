import React from 'react';
import myEvent from '../modules/myEvent';
import Ajax from '../modules/ajax';
import mixins from '../modules/mixins';

const Header = require('./header');

if (typeof window !== 'undefined') {
  require('../../css/tag.css');
}
var POP;
if (typeof window !== 'undefined') {
  POP = require('../modules/confirm');
}

const tag = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    return {
      tagList: [],
      myTagList: [],
      needUpdate: 0
    };
  },
  getData() {
    const that = this;
    const AJAX = new Ajax('listTag');
    AJAX.get((data) => {
      that.setState({
        tagList: data.noChoice,
        myTagList: data.selected,
        needUpdate: that.state.needUpdate + 1
      });
    });
  },
  componentDidMount() {
    if (this.checkLogin(this.props.route)) this.getData();
  },
  toggleTag(index, from, to) {
    to.push(from.splice(index, 1)[0]);
    this.setState({
      needUpdate: this.state.needUpdate + 1
    });
  },
  addTag(e) {
    const index = e.target.getAttribute('data-index');
    if (this.state.myTagList.length >= 10) {
      return POP.alert('最多选择10个标签');
    }
    const AJAX = new Ajax('addTag');
    AJAX.go({
      id: this.state.tagList[index].category_id
    }, () => {
      this.toggleTag(index, this.state.tagList, this.state.myTagList);
    });
  },
  removeTag(e) {
    const index = e.target.getAttribute('data-index');
    const AJAX = new Ajax('deleteTag');
    AJAX.go({
      id: this.state.myTagList[index].category_id
    }, () => {
      this.toggleTag(index, this.state.myTagList, this.state.tagList);
    });
  },
  componentWillUnmount() {
    myEvent.execCallback('configTag');
  },
  shouldComponentUpdate(nextPros, nextState) {
    return this.state.needUpdate !== nextState.needUpdate;
  },
  render() {
    let tips;
    if (!this.state.myTagList.length) {
      tips = <span className="tips">选择您喜欢的标签</span>;
    }
    return (
      <div className="gg-body">
        <div className="tags-block">
          <Header right={false} path={this.props.route} page="tag" title="我的标签" />
          <div className="g-main g-main-1">
            <div className="g-scroll">
              <div className="tag-block">
                <div className="title">我的标签</div>
                <div className="content f-clearfix">
                  {tips}
                  {
										this.state.myTagList.map((tags, i) => (<span className="tag selected f-fl" key={i} onClick={this.removeTag} data-index={i}>{tags.category_name}</span>))
									}
                </div>
              </div>
              <div className="tag-block">
                <div className="title">可选择的标签</div>
                <div className="content f-clearfix">
                  {
										this.state.tagList.map((tags, i) => (<span className="tag f-fl" key={i} onClick={this.addTag} data-index={i}>{tags.category_name}</span>))
									}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = tag;
