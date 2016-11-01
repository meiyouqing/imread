import GLOBAL from '../modules/global'
import React from 'react'
import storage from '../modules/storage'
import { Link } from 'react-router';
var Swipe = require('../modules/swipe').swipe;
var uploadLog = require('../modules/uploadLog');

var Block5 = React.createClass({
	getWidthAndHeight: function() {
		var w = document.body.offsetWidth - (this.props.style == 11 ? 8 : 0);
		return {
			width: w,
			height: w / 3,
			height11: w/5
		};
	},
	getInitialState: function() {
		//筛除不支持的广告类型
		this.adlist = this.props.data.contentlist.filter((v)=>{
			var hrefObj = this.typeHref(v);
			if (!hrefObj) return false;
			return true;
		})
		return {update: 0,width:'100%',height:'auto',height11:'auto'}
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
				setTimeout(function() {
					if (!ele || GLOBAL.isElementVisible(ele)) {
						that.logIntercut(that.props.data.contentlist[index].content_id, 1, that.props.data.contentlist[index].show_class);
					}
				}, 50);
			}
			ele = ele || that.refs['swipe'].querySelector("a");
			if (ele &&　ele.querySelector("img")) {
				var img = ele.querySelector("img");
				if (!img.getAttribute("data-load-state")) {
					var src = img.getAttribute("data-src");
					img.setAttribute("data-load-state", 'loading');
					GLOBAL.loadImage(src, function() {
						img.src = src;
						img.style.height = that.props.style !== 11?that.state.height:70 + 'px';
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
		if(!this.isMounted()) return;
		this.setState(this.getWidthAndHeight());
	},
	updateIndex: function(){
		if(!this.isMounted()) return;
		this.setState({update: this.state.update+1});
	},
	componentDidMount: function() {
		//alert('mount')
		this.initSwipe();
		this.setState(this.getWidthAndHeight());
		//横竖屏切换 重新计算高度
		window.addEventListener('resize', this.handleResize, false);

		document.addEventListener('updateMall',this.updateIndex);
	},
	componentWillUnmount: function(){
		 // document.removeEventListener("updateMall", this.updateIndex, false);
		 // window.removeEventListener('resize', this.handleResize, false);
		//console.log(uploadLog.result)
		uploadLog.sending('intercut');
		this.swipe && (this.swipe.kill());
		window.removeEventListener('resize', this.handleResize, false);
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
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state.height !== nextState.height
				|| this.state.update !== nextState.update;
	},
	typeHref: function(data){
		if(!data) return null;
		var bid = data.content_id || data.book_id || data.sheet_id || 0;
		var type = +data.type || +data.content_type;
		var target = '_self';
		// var nothing = {url:'',target:'_self'};
		if(/2|3|4/.test(data.intercut_type)){
			target = '_blank';
			if(GLOBAL.isAndroid() && (+data.intercut_type)===4){
				target = 'download';
			}
		}
		if (/^http:\/\/m\.imread\.com.*referer=\d/.test(data.redirect_url)) {
			data.redirect_url = data.redirect_url.replace(/referer=\d/, "");
		}
		if(isNaN(type)) return null;
		function setHref(url){
			var pathname = GLOBAL.getLocation();
			var link = pathname.match(/self\/page.\d+\.\d+\.\d/);
			if(link) return pathname+'/'+url;
			// return url;
			var match = pathname.match(/\/mall\/page\.\d+/);
			var base = match? match[0] : '//192.168.0.251:8080/mall/page.9.3'
			return base +'/'+url;
		};
		// console.log(type)
		switch(type){
			case 1://图书详情
				return {url:setHref('book/introduce.'+bid),target}
			case 3://搜索
				return {url:setHref('search/search.'+data.name),target}
			case 4://目录
			case 5://分类
				return {url:setHref('cat/category.'+bid),target}
			case 6://书城的子页面
				return {url:setHref('self/page.'+data.content_id+'.6.1'),target}
			case 7://书单
				return {url:setHref('sheet/bookSheet.'+bid),target}
			case 11://跳h5下载游戏
			case 12://跳下载apk
			case 13://跳内部网页
			case 14: //跳外部网页
			case 15://app to H5
				return {url:data.redirect_url || "javascript:void(0)",target};
			case 16: //to home
				return {url:'//192.168.0.251:8080',target}
			case 17: //to shelf
				return {url:'//192.168.0.251:8080/mall/page.9.3/shelf',target}
			default: return null;
		}
	},
	render: function() {
		var swipeNav
		if (this.adlist.length > 1) {
			swipeNav = (
				<div className="swipe-nav">
                	<div className="swipe-nav-wrap f-clearfix" ref="swipe-nav">
                	{
                		this.adlist.map(function(v, i) {
	                		return (
	                			<a key={i} className="f-fl swipe-nav-item"></a>
	                		);
	                	}.bind(this))		
                	}
                	</div>
                </div>
			);
		}
		var visibility = this.adlist.length > 1 ? 'hidden' : 'visible';
		var pathname = GLOBAL.getLocation();
		return (
			<section className="m-block-top m-block n-padding" style={{border:'none'}}>
				<div className="content">
					<div className={"subCat-5" + (this.props.style == 11 ? ' subCat-11' : '')}>
						<div className="swipe" ref="swipe" style={{'visibility': visibility, height: (this.props.style !== 11?this.state.height:this.state.height11)}}>
							<div className="swipe-wrap">
			                {
			                	this.adlist.map(function(v, i) {
									var hrefObj = this.typeHref(v);
									var search = this.props.fromReading?
										("?devicetoken="+GLOBAL.getUuid()+'&comeFrom='+encodeURIComponent(pathname)):
										'';
									var imgSrc = v.intercut_url || v.image_url;
									if(typeof window === 'undefined' && /sdk\/sdk\.\d+$/.test(pathname)){
										var imger = <img src={imgSrc} className="u-adimg" style={{width: '100%'}}/>;
									}else{
										imgSrc = imgSrc.replace(/^http\:\/\//,'https://');
										var imger = <img data-src={imgSrc} className="u-adimg" style={{width: '100%'}}/>;
									}								
									

									if(this.adlist.length<2) 
										imger = <img src={imgSrc} className="u-adimg" style={{width: '100%'}}/>;
			                		return (
			                			<Link style={{backgroundImage: 'url(/src/img/back/ad_default_back.jpg)',height: this.state.height, backgroundSize: "cover"}} to={hrefObj.url+search} target={hrefObj.target} className="swipe-ad f-fl" key={i} onClick={this.handleIntercurClick} data-intercut_id=		{v.content_id}>
			                				{imger}
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

module.exports = Block5;