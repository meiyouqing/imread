var Header = React.createClass({
	handleClick:function(e) {
		var href = e.target.getAttribute('data-href');
		if (e.target.getAttribute('data-reset') == '1') {
			href = Router.setHref('searchPage&page.18.1.3');
		}
		window.location.hash = href;
		e.preventDefault();
		return false;
	},
	render: function(){
		var icons = [{
			icon: 'icon-shujia',
			size: 16,
			title: '书架',
			href:'#shelf&block.157.1.0'
		}, {
			icon: 'icon-shucheng',
			size: 16,
			title: '书城',
			href:'#mall'
		}, {
			icon: 'icon-search',
			size: 16,
			title: '搜索',
			href: 'searchPage&page.18.1.3',
			reset: 1
		}, {
			icon: 'icon-user',
			size: 16,
			title: '我',
			href: '#user'
		}];
		return (
			<header className="m-bar m-bar-head m-bar-top f-flexbox">
			{
				icons.map(function(icon, i) {
					return <a onClick={this.handleClick} data-href={icon.href} data-reset={icon.reset} style={{fontSize: icon.size, fontWeight:'normal'}} className={"top-nav f-flex1" + (i == this.props.active ? " active" : "")} key={i}>{icon.title}</a>
				}.bind(this))
			}
			</header>
		);
	}
});

module.exports  = Header;