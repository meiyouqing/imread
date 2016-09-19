var Header = require('./header');
require('../../css/setting.css');

var ULine = React.createClass({
	render: function() {
		var src_href = !this.props.line.target?GLOBAL.setHref(this.props.line.href):this.props.line.href,
			target = this.props.line.target?this.props.line.target:null;

		return (
			<li className="u-line">
				<Link to={src_href} className="f-cb" target={target} data-href={src_href} onClick={this.props.line.requireLogin}>
					<span className="iconfont icon-arrow-right f-fr"></span>
					<span className="title">{this.props.line.title}</span>
				</Link>
			</li>
		);
	}
});

var MUblock = React.createClass({
	render: function() {
		return (
			<section className="m-list">
				<div className="content">
					<ul className="u-lines">
						{
							this.props.lines.map(function(line, i) {
								return <ULine key={i} line={line} />
							})
						}
					</ul>
				</div>
			</section>
		);
	}
});

var Setting = React.createClass({
	mixins: [Mixins()],
	requireLogin: function(e){

		if (!this.isLogin()) {
			this.goLogin(login_c);
			var href = e.target.getAttribute('data-href');
			e.preventDefault(location.pathname+href);
			return false;
		}

		function login_c() {
			setTimeout(function() {
				browserHistory.push(href || location.pathname);
			}, 10);
		}
		return true;
	},
	render:function() {
		var blockData = [
			[{
				title: '修改密码',
				href: 'modifypwd',
				requireLogin: this.requireLogin
			},{
				title: '意见反馈',
				href: 'feedback'
			}, {
				title: '用户协议',
				href: 'compact'
			}, {
				title: '官方网站',
				href: 'https://www.imread.com',
				target: '_self'
			}]
		];

		return (
			<div className="g-ggWraper gg-body">
				<Header right={false} title={'设置'} path={this.props.route}/>
				<div className="g-main g-main-1">
					<div className="m-settingblock g-scroll">
						{
							blockData.map(function(lines, i) {
								return (<MUblock key={i} lines={lines} />);
							})
						}
						<div className="m-set-footer">
							<img src="https://m.imread.com/src/img/back/bg-@2x.png" />
						</div>
					</div>

				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports  = Setting;