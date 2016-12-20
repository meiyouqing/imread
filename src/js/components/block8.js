import React from 'react';
const Book1 = require('./book1');
const Block8 = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.bookList !== nextProps.data;
  },
  render() {
    return (
      <ul className="u-pWrap">
        {
				this.props.bookList.map((v, i) => (
  <Book1 key={i} data={v} />
  ))
			}
      </ul>
    );
  }
});
module.exports = Block8;
