var Header = require('./header');

var About = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return false;
	},
	render: function() {
		return (
			<div className="about-block">
				<Header title={Router.title} right={false} />
				<i className="imreadLogo"><img src="src/img/logo.png" /></i>
				<h1 className="title">艾美阅读</h1>
            	<p className="version">版本2.1.0</p>
            	<p className="conpact"><a href="#user/about/compact">用户协议</a></p>
				<h2 className="desc">发现阅读之美</h2>
            	<footer className="footer">
					<a className="home" href="http://imread.com" target="_blank">
						<span className="iconfont icon-arrow-right f-fr"></span>
						<span>官方网站</span>
					</a>
				</footer>
			</div>
		);
	}
});

module.exports = About;