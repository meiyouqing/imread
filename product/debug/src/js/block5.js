var Swipe = require('./swipe').swipe;
var GLOBAL = require('./global');

var Block5 = React.createClass({
	getInitialState: function() {
		return {
			width: document.body.offsetWidth,
			height: document.body.offsetWidth / 16 * 5
		};
	},
	initSwipe: function() {
		var that = this;
		var swipeNav = this.refs['swipe-nav'];
		this.swipe && (this.swipe.kill());
		if (!swipeNav) {
			return ;
		}
		var swipeNavs = swipeNav.children;
		this.swipe = new Swipe(this.refs.swipe, {
			auto: 3000,
			callback: function(index, ele) {
				that.toggleSwipeNav(index % swipeNavs.length);
			}
		});
		this.toggleSwipeNav(0);
	},
	handleResize: function(e) {
		this.setState({
			width: document.body.offsetWidth,
			height: document.body.offsetWidth / 16 * 5
		});
	},
	componentDidMount: function() {
		//alert('mount')
		this.initSwipe();
		//横竖屏切换 重新计算高度
		window.addEventListener('resize', this.handleResize, false);
	},
	componentDidUpdate: function() {
		//alert('update')
		this.initSwipe();
	},
	toggleSwipeNav: function(index) {
		var swipeNav = this.refs['swipe-nav'];
		if (swipeNav && swipeNav.children && swipeNav.children.length) {
			for (var i = 0; i < swipeNav.children.length; i++) {
				GLOBAL.removeClass(swipeNav.children[i], 'swipe-nav-item-active');
				if (i == index) {
					GLOBAL.addClass(swipeNav.children[i], 'swipe-nav-item-active');
				}
			}
			
		}
	},
	componentWillUnmount: function() {
		this.swipe && (this.swipe.kill());
		window.removeEventListener('resize', this.handleResize, false);
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data.contentlist !== nextProps.data.contentlist
				|| this.state.height !== nextState.height;
	},
	componentWillReceiveProps: function(nextProps) {
		//alert('rece')
		//this.swipe && (this.swipe.kill());
	},
	render: function() {
		var swipeNav
		if (this.props.data.contentlist.length > 1) {
			swipeNav = (
				<div className="swipe-nav">
                	<div className="swipe-nav-wrap f-clearfix" ref="swipe-nav">
                	{
                		this.props.data.contentlist.map(function(v, i) {
	                		return (
	                			<a key={i} className="f-fl swipe-nav-item"></a>
	                		);
	                	}.bind(this))		
                	}
                	</div>
                </div>
			);
		}
		var visibility = this.props.data.contentlist.length > 1 ? 'hidden' : 'visible';
		return (
			<section className="m-ad">
				<div className="content">
					<div className="subCat-5">
						<div className="swipe" ref="swipe" style={{'visibility': visibility, height: this.state.height}}>
							<div className="swipe-wrap">
			                {
			                	this.props.data.contentlist.map(function(v, i) {
			                		var redirect_url, 
			                			target = '';
			                		switch (v.intercut_type) {
			                			//图书
			                			case 1:
			                				redirect_url = Router.setHref('introduce&introduce.' + v.source_contentid);
			                				break;
			                			//内部网页
			                			case 2:
			                			//外部网页
			                			case 3:
			                			//apk下载
			                			case 4:
			                				redirect_url = v.redirect_url;
			                				target = '_blank';
			                				break;
			                			//素材目录
			                			case 5:
			                				redirect_url = Router.setHref('category&category.' + v.source_contentid + '.1.10');
			                				break;
			                			default: 
			                				break;
			                		}
			                		return (
			                			<a href={redirect_url} target={target} className="swipe-ad f-fl" key={i}>
			                				<img src={v.intercut_url} className="u-adimg" style={{width: '100%', height: this.state.height}}/>
			                			</a>
			                		);
			                	}.bind(this))
			                }
							</div>			            
			                {swipeNav}
			            </div>
					</div>
				</div>
			</section>
		);
	}
});

module.exports = Block5;