import GLOBAL from '../modules/global'
import React from 'react'
import Link from 'react-router/lib/Link';

var Book5 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render: function() {
		var hrefStr = GLOBAL.typeHref(this.props.data);
		var topCls = '';
		var topNum = this.props.num+1;
		switch(topNum){
			case 1:
				topCls=" NO1 hot";
				break;
			case 2:
				topCls=" NO2 hot";
				break;
			case 3:
				topCls=" NO3 hot";
				break;	
			default:
				topNum='';
				break;			
		}
		return (
			<li className="u-book-5">
				<Link to={hrefStr}>
					{/*<span className={"topNb"+topCls}>{topNum}</span>*/}
					<span className="f-ellipsis f-ellipsis-ib f-auto-width">{this.props.data.name}</span>
					<span className={topCls}>{topCls?'热':''}</span>
				</Link>
			</li>
		);
	}
});

module.exports = Book5;