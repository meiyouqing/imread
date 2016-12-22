import React from 'react';

const Loading = React.createClass({
  getDefaultProps() {
    return {
      cls: 'u-loading',
      text: '努力加载中..'
    };
  },
  getInitialState() {
    return {
      cls: ''
    };
  },
  componentDidMount() {
    if ((typeof document.body.style.transform !== 'undefined' && typeof document.body.style.animation !== 'undefined') || (typeof document.body.style['-webkit-transform'] !== 'undefined' && typeof document.body.style['-webkit-animation'] !== 'undefined')) {
      this.setState({
        cls: 'u-moving-ball'
      });
    }
  },
	// shouldComponentUpdate: function(nextProps, nextState) {
	// 	return this.props.cls !== nextProps.cls
	// 			|| this.props.content !== nextProps.content;
	// },
  render() {
    return (
      <div className={this.props.cls}>
        <div className={this.state.cls}><i className="ball-2" /></div>
      </div>
    );
  }
});

module.exports = Loading;
