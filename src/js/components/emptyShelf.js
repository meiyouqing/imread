import React from 'react';

const EmptyShelf = React.createClass({
  render() {
    return (
      <div className="g-main">
        <div className="emptyShelf f-tc">
          <img className="icon" src="img/pic_shujia.png" />
          <div className="tip">亲，书架还空空荡荡哦~</div>
          <a className="u-btn" href="#mall">去书城逛逛</a>
        </div>
      </div>
    );
  }
});
module.exports = EmptyShelf;
