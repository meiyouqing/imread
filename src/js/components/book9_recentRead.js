var Img = require('./img');

var Book9 = React.createClass({
	prettyDate: function(date) {
		var d = new Date(date);
		var current = new Date();
		var deltaSecond = (current.getTime() - d.getTime()) / 1000;

		if (new Date(current.getTime() - 24 * 60 * 60 * 1000).Format('yyyyMd') == d.Format('yyyyMd')) {
			return '昨天';
		}

		if (deltaSecond < 15 * 60) {
			return '刚刚';
		}
		if (deltaSecond < 60 * 60) {
			return Math.floor(deltaSecond / 60) + '分钟前';
		}
		if (deltaSecond < 24 * 60 * 60) {
			return Math.floor(deltaSecond / 60 / 60) + '小时前';
		}
		return date.substr(5,5);
	},
	clickHandle: function(){
		if(this.props.icon)	return;
		var href = 'reading/crossDomain.'
		         + this.props.book.source_bid + '.'
		         + this.props.book.chapter_id + '.'
		         + this.props.book.content_id + '.'
		         + this.props.book.source_id;
		browserHistory.push({pathname:GLOBAL.setHref(href),state:{author: this.props.book.author,book_name: this.props.book.name}});

	},
	render: function() {

		var deleter;

		if(this.props.icon)
			deleter = <button className="delete" onClick={this.props.deleteWay} data-bid={this.props.book.content_id}>删除</button>;
		else
			deleter = null;

		return (
			<li className="u-book-9" >
				<a onClick={this.clickHandle} className="f-clearfix">
					<div className="f-fl">
						<Img src={this.props.book.big_coverlogo || this.props.book.image_url} />
					</div>
					<div className="info">
						<div className="f-ellipsis-2 name">{this.props.book.name}</div>
						<div className="author">{this.props.book.author}</div>
						<div className="f-ellipsis-2 chapter-name">{this.props.book.chapter_name}</div>
						<div className="date">{this.prettyDate(this.props.book.recent_time)}</div>
					</div>
				</a>
				{deleter}
			</li>
		);
	}
});

module.exports = Book9;