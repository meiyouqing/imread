var Header = require('./header');
if(true||typeof window !== 'undefined'){
	require('../../css/about.css')
}
var About = React.createClass({
	// shouldComponentUpdate: function(nextProps, nextState) {
	// 	return false;
	// },
	handle: function(){
		browserHistory.push('/user/about/compact');
	},
	render: function() {
		return (
			<div className="gg-body">
				<div className="about-block">
					<Header right={false} path={this.props.route}/>
					<i className="imreadLogo"><img src="src/img/logo_180.png" /></i>
					<h1 className="title">艾美阅读</h1>
	            	<p className="version">版本2.1.0</p>
	            	<p className="conpact"><a onClick={this.handle}>用户协议</a></p>
					<h2 className="desc">发现阅读之美</h2>
	            	<footer className="footer">
						<a className="home" href="http://imread.com" target="_blank">
							<span className="iconfont icon-arrow-right f-fr"></span>
							<span>官方网站</span>
						</a>
					</footer>
				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports = About;