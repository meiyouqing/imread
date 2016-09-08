import React from 'react'
var Book1 = require('./book1');

var Recommend = React.createClass({
	render: function(){
		 return <p className="recommend"><span className="iconWord f-br-3">{this.props.block.icon_word}</span><span>{this.props.block.short_recommend_words || this.props.block.long_recommend_words}</span> </p>
	}

});

var Block7 = React.createClass({
	shouldComponentUpdate: function(nextProps,nextState){
		return this.props.bookList !== nextProps.bookList
		|| this.props.recommend !== nextProps.recommend;
	},
	render: function(){
		var recommend;
		if(this.props.recommend)
			if(this.props.recommend.icon_word)	{recommend = <Recommend block={this.props.recommend} />}

		return (<div className="m-list">
				{recommend}
				<ul className="u-pWrap">
				{	
					this.props.bookList.map(function(v,i){
						return (
							<Book1 key={i} data={v} />
						)
					}.bind(this))
				}
				</ul>
			</div>
			);
	}
});
module.exports = Block7;