import GLOBAL from '../modules/global'
import React from 'react'
import Link from 'react-router/lib/Link';
var Img = require('./img');

var Book1 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render: function() {
		var hrefStr;	
		var cludeIntro = location.pathname.match(/\/book\/introduce./);
		// if(this.props.fromIntroduce){
		// 	var lastPart = this.props.pathname.split('/').pop();
		// 	hrefStr = this.props.pathname.replace(lastPart,'') + 'introduce.'+this.props.data.content_id;
		// }
		if(cludeIntro){
			hrefStr = location.pathname.split(cludeIntro)[0]+cludeIntro+this.props.data.content_id;
		}
		else
			hrefStr = GLOBAL.typeHref(this.props.data);

		return (
			
			<li className="u-book-1 f-clearfix">
				<Link to={hrefStr}>
					<Img src={this.props.data.image_url} />
					<div className="info">
						<span className="f-ellipsis-2 title">{this.props.data.name || this.props.data.book_name}</span>
						<span className="author">{this.props.data.author || this.props.data.author_name}</span>
						<span className="summary f-ellipsis-3">{this.props.data.brief}</span>
					</div>
				</Link>
			</li>
		);
	}
});

module.exports = Book1;