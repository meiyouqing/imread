import React from 'react';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import Header from './header';

const readHistory = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    return {
      height: '100%'
    };
  },
  componentDidMount() {
    this.checkLogin(this.props.route);
    this.setState({
      height: document.body.offsetHeight - 44
    });
  },
  render() {
    return (
      <div className="gg-body">
        <Header right={null} path={this.props.route} title="我的成就" />
        <iframe src={`/iframe/readHistory.html?referer=3&user_id=${GLOBAL.header.userId}`} className="g-main" style={{ height: this.state.height }} />
      </div>
    );
  }
});

module.exports = readHistory;
