import { Link } from 'react-router';
var Swipe = require('../modules/swipe').swipe;
var uploadLog = require('../modules/uploadLog');

var Block9 = React.createClass({
	getWidthAndHeight: function() {
		return {
			update: 0
		};
	},
	getInitialState: function() {
		return this.getWidthAndHeight();
	},
	logIntercut: function(intercut_id, event) {
		uploadLog.send('intercut', {
			intercut_id: intercut_id,
			event: event,
			show_class: this.props.fromReading ? 1 : 3
		});
	},
	handleIntercurClick: function(e) {
		this.logIntercut(e.target.getAttribute('data-intercut_id'), 2);
		return true;
	},
	initSwipe: function() {
		var that = this;
		var swipeNav = this.refs['swipe-nav'];
		this.swipe && (this.swipe.kill());
		
		var swipeCallback = function(index, ele) {
			var index = index % that.props.data.contentlist.length;
			if (GLOBAL.name === 'mall' || GLOBAL.name == 'reading' && that.props.fromReading) {
				// 判断是否在书城
				// setTimeout(function() {
				// 	if (!ele || GLOBAL.isElementVisible(ele)) {
				// 		that.logIntercut(that.props.data.contentlist[index].content_id, 1, that.props.data.contentlist[index].show_class);
				// 	}
				// }, 50);
			}
			ele = ele || that.refs['swipe'].querySelector("a");
			if (ele &&　ele.querySelector("img")) {
				var img = ele.querySelector("img");
				if (!img.getAttribute("data-load-state")) {
					var src = img.getAttribute("data-src");
					img.setAttribute("data-load-state", 'loading');
					GLOBAL.loadImage(src, function() {
						img.src = src;
						img.style.height = "100%";
						img.setAttribute("data-load-state", 'loaded');
					});
				}
			}
			that.toggleSwipeNav(index);
		}
		swipeCallback(0);

		if (!swipeNav) {
			return ;
		}
		// var swipeNavs = swipeNav.children;
		this.swipe = new Swipe(this.refs.swipe, {
			auto: 3000,
			callback: swipeCallback
		});
		this.toggleSwipeNav(0);
		
	},
	handleResize: function(e) {
		this.setState(this.getWidthAndHeight());
	},
	updateIndex: function(){
		this.setState({update: this.state.update+1});
	},
	componentDidMount: function() {
		//alert('mount')
		this.initSwipe();
		//横竖屏切换 重新计算高度
		// window.addEventListener('resize', this.handleResize, false);

		// document.addEventListener('updateMall',this.updateIndex);
	},
	componentWillUnmount: function(){
		 // document.removeEventListener("updateMall", this.updateIndex, false);
		 // window.removeEventListener('resize', this.handleResize, false);
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
		//console.log(uploadLog.result)
		uploadLog.sending('intercut');
		this.swipe && (this.swipe.kill());
		window.removeEventListener('resize', this.handleResize, false);
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data.contentlist !== nextProps.data.contentlist
				|| this.state.height !== nextState.height
				|| this.state.update !== nextState.update;
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
			<section className="m-block-top m-block n-padding">
				<div className="content">
					<div className={"subCat-5" + (this.props.style == 11 ? ' subCat-11' : '')}>
						<div className="swipe" ref="swipe" style={{'visibility': visibility, height: "100%"}}>
							<div className="swipe-wrap">
			                {
			                	this.props.data.contentlist.map(function(v, i) {
			                		
									var hrefObj = GLOBAL.typeHref(v);
									var search="?devicetoken="+GLOBAL.cookie('uuid')
									if(!hrefObj.url)  hrefObj = {url: hrefObj,target:null};

			                		return (
			                			<Link style={{backgroundImage: 'url(https://m.imread.com/src/img/back/ad_default_back.jpg)',height: "100%",backgroundSize: "cover"}} to={hrefObj.url+search} target={hrefObj.target} className="swipe-ad f-fl" key={i} onClick={this.handleIntercurClick} data-intercut_id={v.content_id}>
			                				<img src={v.intercut_url || v.image_url} className="u-adimg" style={{width: '100%',height:"100%"}}/>
			                			</Link>
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

module.exports = Block9;