webpackJsonp([1],{177:function(e,t,i){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}function n(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}var r,s=i(5),c=i(21),o=(a(c),i(188).swipe),l=i(96),d=React.createClass((r={displayName:"Block9",getWidthAndHeight:function(){return{update:0}},getInitialState:function(){return this.getWidthAndHeight()},logIntercut:function(e,t){l.send("intercut",{intercut_id:e,event:t,show_class:this.props.fromReading?1:3})},handleIntercurClick:function(e){return this.logIntercut(e.target.getAttribute("data-intercut_id"),2),!0},initSwipe:function(){var e=this,t=this.refs["swipe-nav"];this.swipe&&this.swipe.kill();var i=function(t,i){var t=t%e.props.data.contentlist.length;if("mall"===GLOBAL.name||"reading"==GLOBAL.name&&e.props.fromReading,i=i||e.refs.swipe.querySelector("a"),i&&i.querySelector("img")){var a=i.querySelector("img");if(!a.getAttribute("data-load-state")){var n=a.getAttribute("data-src");a.setAttribute("data-load-state","loading"),GLOBAL.loadImage(n,function(){a.src=n,a.style.height="100%",a.setAttribute("data-load-state","loaded")})}}e.toggleSwipeNav(t)};i(0),t&&(this.swipe=new o(this.refs.swipe,{auto:3e3,callback:i}),this.toggleSwipeNav(0))},typeHref:function(e){function t(e){var t=location.pathname.match(/self\/page.\d+.\d+.\d/);return t?location.pathname+"/"+e:location.pathname.match(/\/mall\/page.\d+.\d/)[0]+"/"+e}var i=e.content_id||e.book_id||e.sheet_id||0,a=+e.type||+e.content_type,n="_self";if(/2|3|4/.test(e.intercut_type)&&(n="_blank",GLOBAL.isAndroid()&&4===+e.intercut_type&&(n="download")),/^http:\/\/m\.imread\.com.*referer=\d/.test(e.redirect_url)&&(e.redirect_url=e.redirect_url.replace(/referer=\d/,"")),isNaN(a))return"";switch(a){case 1:return t("book/introduce."+i);case 3:return t("search/search."+e.name);case 4:case 5:return t("cat/category."+i);case 6:return t("self/page."+e.content_id+".6.1");case 7:return t("sheet/bookSheet."+i);case 11:case 12:case 13:case 14:case 15:return{url:e.redirect_url||"javascript:void(0)",target:n}}},handleResize:function(e){this.setState(this.getWidthAndHeight())},updateIndex:function(){this.setState({update:this.state.update+1})},componentDidMount:function(){this.initSwipe()},componentWillUnmount:function(){},componentDidUpdate:function(){this.initSwipe()},toggleSwipeNav:function(e){var t=this.refs["swipe-nav"];if(t&&t.children&&t.children.length)for(var i=0;i<t.children.length;i++)GLOBAL.removeClass(t.children[i],"swipe-nav-item-active"),i==e&&GLOBAL.addClass(t.children[i],"swipe-nav-item-active")}},n(r,"componentWillUnmount",function(){l.sending("intercut"),this.swipe&&this.swipe.kill(),window.removeEventListener("resize",this.handleResize,!1)}),n(r,"shouldComponentUpdate",function(e,t){return this.props.data.contentlist!==e.data.contentlist||this.state.height!==t.height||this.state.update!==t.update}),n(r,"componentWillReceiveProps",function(e){}),n(r,"render",function(){var e;this.props.data.contentlist.length>1&&(e=React.createElement("div",{className:"swipe-nav"},React.createElement("div",{className:"swipe-nav-wrap f-clearfix",ref:"swipe-nav"},this.props.data.contentlist.map(function(e,t){return React.createElement("a",{key:t,className:"f-fl swipe-nav-item"})}.bind(this)))));var t=this.props.data.contentlist.length>1?"hidden":"visible";return React.createElement("section",{className:"m-block-top m-block n-padding"},React.createElement("div",{className:"content"},React.createElement("div",{className:"subCat-5"+(11==this.props.style?" subCat-11":"")},React.createElement("div",{className:"swipe",ref:"swipe",style:{visibility:t,height:"100%"}},React.createElement("div",{className:"swipe-wrap"},this.props.data.contentlist.map(function(e,t){var i=this.typeHref(e),a=this.props.fromReading?"?devicetoken="+GLOBAL.getUuid()+"&comeFrom="+encodeURIComponent(pathname):"";return i.url||(i={url:i,target:null}),React.createElement(s.Link,{style:{backgroundImage:"url(/src/img/back/ad_default_back.jpg)",height:"100%",backgroundSize:"cover"},to:i.url+a,target:i.target,className:"swipe-ad f-fl",key:t,onClick:this.handleIntercurClick,"data-intercut_id":e.content_id},React.createElement("img",{src:e.intercut_url||e.image_url,className:"u-adimg",style:{width:"100%",height:"100%"}}))}.bind(this))),e))))}),r));e.exports=d}});