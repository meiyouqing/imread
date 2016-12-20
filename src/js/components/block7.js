import React from 'react';
const Book1 = require('./book1');

const Recommend = React.createClass({
  render() {
		 return <p className="recommend"><span className="iconWord f-br-3">{this.props.block.icon_word}</span><span>{this.props.block.short_recommend_words || this.props.block.long_recommend_words}</span> </p>;
  }

});

const Block7 = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.bookList !== nextProps.bookList
		|| this.props.recommend !== nextProps.recommend;
  },
  render() {
    let recommend;
    if (this.props.recommend) {
      if (this.props.recommend.icon_word)	{ recommend = <Recommend block={this.props.recommend} />; }
    }

    return (<div className="m-list">
      {recommend}
      <ul className="u-pWrap">
        {
					this.props.bookList.map((v, i) => (
  <Book1 key={i} data={v} location={this.props.location} />
						))
				}
      </ul>
    </div>
    );
  }
});
module.exports = Block7;
