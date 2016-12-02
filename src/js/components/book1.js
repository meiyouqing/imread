import GLOBAL from '../modules/global'
import React from 'react'
import Link from 'react-router/lib/Link';
var Img = require('./img');

var Book1 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	toHandle:function(){
		if(typeof this.props.toHandle === 'function'){
			this.props.toHandle('introduce.'+this.props.data.content_id);
			return false;
		}
		return true;
	},
	render: function() {
		var hrefStr;	
		var cludeIntro = location.pathname.match(/\/book\/introduce./);
		if(cludeIntro){
			hrefStr = location.pathname.split(cludeIntro)[0]+cludeIntro+this.props.data.content_id;
		}
		else
			hrefStr = GLOBAL.typeHref(this.props.data);

		return (
			
			<li className="u-book-1 f-clearfix">
				<Link to={hrefStr} onClick={this.toHandle}>
					<Img src={this.props.data.image_url} />
					<div className="info">
						<span className="f-ellipsis-2 title">{this.props.data.name || this.props.data.book_name}</span>
						<span className="author">{this.props.data.author || this.props.data.author_name}</span>
						<span className="summary f-ellipsis-3" dangerouslySetInnerHTML={{__html: this.props.data.brief}}></span>
					</div>
				</Link>
			</li>
		);
	}
});

module.exports = Book1;