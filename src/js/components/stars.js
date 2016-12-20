import React from 'react';


const Stars = React.createClass({
  shouldComponentUpdate(nextPros, nextState) {
    return this.props.score !== nextPros.score;
  },
  render() {
		// scrole = a.b
		// star width 15px
		// margin-left 5px
    const a = Math.floor(this.props.score);
    const b = this.props.score - a;
    const width = a * (15 + 5) + b * 15;
    return (
      <div className="u-stars">
        <ul className="stars f-clearfix">
          <li className="iconfont icon-star" />
          <li className="iconfont icon-star" />
          <li className="iconfont icon-star" />
          <li className="iconfont icon-star" />
          <li className="iconfont icon-star" />
        </ul>
        <div className="mask" style={{ width }}>
          <ul className="stars active f-clearfix">
            <li className="iconfont icon-star" />
            <li className="iconfont icon-star" />
            <li className="iconfont icon-star" />
            <li className="iconfont icon-star" />
            <li className="iconfont icon-star" />
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = Stars;
