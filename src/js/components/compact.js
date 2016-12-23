import React from 'react';
import Header from './header';

const Conpact = React.createClass({
  getInitialState() {
    return { height: 600 };
  },
  componentDidMount() {
    const height = document.body.offsetHeight - 44;
    this.setState({ height });
  },
  render() {
    return (
      <div className="gg-body">
        <Header title="用户协议" right={null} path={this.props.route} />
        <iframe src="/iframe/compact.html" className="g-main" style={{ height: this.state.height }} />
      </div>
    );
  }
});

module.exports = Conpact;
