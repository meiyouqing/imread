//var Img = require('./img');

var Subject = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render: function() { 
		var cls = this.props.style==12? 'u-book-7':'u-book-8';
		var height = this.props.style==12? 
					(document.body.offsetWidth-40)/2*0.38 
					: (document.body.offsetWidth-27)/2*0.53;
		var hrefStr = Router.typeHref(this.props.data,this.props.spm);
		var target = '_self';
		if (typeof hrefStr === 'object') {
			hrefStr = hrefStr.url;
			target = hrefStr.target;
		}
		return (
			<li className={cls}>
				<a href={hrefStr} target={target} className="u-lazyload-img" data-lazyload-src={this.props.data.image_url ||this.props.data.intercut_url || this.props.data.big_coverlogo} style={{backgroundImage: 'url(src/img/defaultTopBackground.png)',height: height}}>
					<span>{this.props.data.name}</span>
				</a>
			</li>
		);
	}
});

module.exports = Subject;