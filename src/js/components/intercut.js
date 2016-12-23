import React from 'react';
import Link from 'react-router/lib/Link';
import GLOBAL from '../modules/global';
import uploadLog from '../modules/uploadLog';

const Intercut = React.createClass({
  getInitialState() {
    return {
      height: document.body.offsetHeight / (this.props.data.intercut_style === 6 ? 2 : 1)
    };
  },
  handleClick(e) {
    e.stopPropagation();
    uploadLog.send('intercut', {
      intercut_id: this.props.data.content_id,
      event: 2,
      show_class: this.props.data.show_class
    });
    return true;
  },
  render() {
		// var className = this.props.data.intercut_style === 6 ? " half-screen" : " fullscreen";
    const hrefObj = GLOBAL.typeHref(this.props.data, []);
    return (
      <div className="m-intercut" style={{ height: this.state.height }}>
        <img src={this.props.data.intercut_url} />
        <div className="btn">
          <Link to={hrefObj.url} onClick={this.handleClick}>{this.props.data.button_name || '点击立即下载'}</Link>
        </div>
      </div>
    );
  }
});

module.exports = Intercut;
