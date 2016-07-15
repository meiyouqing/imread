import { Link, browserHistory } from 'react-router';
var Book1 = require('./book1');
var Book2 = require('./book2');
var Book3 = require('./book3');
var Book5 = require('./book5');
var Book6 = require('./book6');
var Book7 = require('./book7_mallSubject');
var Book8 = require('./book8_bookSheet');

var Block1 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
	},
	render:function(){
		//this.props.data.contentlist.pop();
		return (
			<section className="m-block">
				<Link className="title" to={this.props.href}>
					<span className="iconfont icon-arrow-right f-fr"></span>
					<h2><i className="iconfont icon-group"></i>{this.props.data.name}</h2>
				</Link>
				<div className="content">
					{this.props.recommend}
					<ul className="subCat-1 f-clearfix">
					{
						this.props.data.contentlist.slice(0,(this.props.data.contentlist.length - this.props.data.contentlist.length % 3)).map(function(v,i){
							return <Book2 key={i} data={v} />
						}.bind(this))
					}
					</ul>
				</div>
			</section>
		);
	}
});
var Block2 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
	},
	render:function(){
		return (
			<section className="m-block">
				<Link className="title" to={this.props.href}>
					<span className="iconfont icon-arrow-right f-fr"></span>
					<h2><i className="iconfont icon-group"></i>{this.props.data.name}</h2>
				</Link>
				<div className="content">
					{this.props.recommend}
					<ul className="subCat-2 f-clearfix">
					{
						this.props.data.contentlist.map(function(v,i){
							//if(i > 4) return;
							return <Book1 key={i} data={v} />
						}.bind(this))
					}
					</ul>
				</div>
			</section>
		);
	}
});
var Block3 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
	},
	render:function(){
		return (
			<section className="m-block">
				<Link className="title" to={this.props.href}>
					<span className="iconfont icon-arrow-right f-fr"></span>
					<h2><i className="iconfont icon-group"></i>{this.props.data.name}</h2>
				</Link>
				<div className="content">
					{this.props.recommend}
					<ul className="subCat-3 f-clearfix">
						<div className="u-book2-line">
						{
							this.props.data.contentlist.map(function(v,i){
								//if(i > 4) return;
								if(i<3){
									return <Book2 key={i} data={v} />
								}
							}.bind(this))
						}
						</div>
						{
							this.props.data.contentlist.map(function(v,i){
								//if(i > 4) return;
								if(i>=3){
									return <Book3 key={i} data={v}/>
								}
							}.bind(this))
						}
					</ul>
				</div>
			</section>
		);
	}
});
var Block4 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
	},
	render:function(){
		return (
			<section className="m-block">
				<Link className="title" to={this.props.href}>
					<span className="iconfont icon-arrow-right f-fr"></span>
					<h2><i className="iconfont icon-group"></i>{this.props.data.name}</h2>
				</Link>
				<div className="content">
					{this.props.recommend}
					<ul className="subCat-4 f-clearfix">
					{
						this.props.data.contentlist.map(function(v,i){
							if(i > 3) return;
							if(i<1){
								return <Book1 key={i} data={v}/>
							}else{
								return <Book3 key={i} data={v}/>
							}
						}.bind(this))
					}
					</ul>
				</div>
			</section>
		);
	}
});
var Block6 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render:function(){
		var emptyBook6;
		if (this.props.data.contentlist.length & 1) {
			emptyBook6 = <li className="u-book-6 empty-book-6"><a><span></span></a></li>;
		}
		return (
			<section className="m-block">
				<div className="title">
					<h2><i className="iconfont icon-group"></i>{this.props.data.name}</h2>
				</div>
				<div className="content">
					{this.props.recommend}
					<ul className="subCat-6 f-clearfix">
					{
						this.props.data.contentlist.map(function(v,i){
							//if(i > 5) return;
							return <Book6 key={i} data={v} noImage={i >= 2}/>
						}.bind(this))
					}
					{emptyBook6}
					</ul>
				</div>
			</section>
		);
	}
});
var Block7 = React.createClass({
	getInitialState: function() {
		return {
			contentlist: this.props.data.contentlist,
			needUpdate: 0
		};
	},
	batchChange: function() {
		this.setState({
			contentlist:this.state.contentlist.sort(randomSort),
			needUpdate:this.state.needUpdate++
		})
		function randomSort(a,b){
			return Math.random()>0.5? 1:-1;
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data 
				|| this.state.contentlist !== nextState.contentlist
				|| this.state.needUpdate !== nextState.needUpdate;
	},
	render:function(){
		return (
			<section className="m-block m-block-1">
				<div className="title title-1">
					<span className="batchChange f-fr" onClick={this.batchChange}><i className="iconfont icon-refresh"></i>&nbsp;换一批</span>
					<h2>{this.props.data.name}</h2>
				</div>
				<div className="content">
					{this.props.recommend}
					<ul className={"subCat-"+this.props.data.style+" f-clearfix"}>
					{
						this.state.contentlist.map(function(v,i){
							if(i > 5) return;
							var hrefStr = GLOBAL.setHref('searchList/search.'+v.name);
							return (
								<li key={i}>
									<Link to={hrefStr} className={this.props.data.style==7?("style-"+(i+1)) : "u-btn2"}>{v.name}</Link>
								</li>
							)
						}.bind(this))
					}
					</ul>
				</div>
			</section>
		);
	}
});
var Block9 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
	},
	render:function(){
		return (
			<section className="m-block m-block-1">
				<Link className="title title-1" to={this.props.href}>
					<h2>{this.props.data.name}</h2>
				</Link>
				<div className="content">
					{this.props.recommend}
					<ul className="f-clearfix">
					{
						this.props.data.contentlist.map(function(v,i){
							return <Book5 key={i} data={v} />
						}.bind(this))
					}
					</ul>
				</div>
			</section>
		);
	}
});
var Block12 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render:function(){
		var title = this.props.data.style==12?
					(<div className="title"> <h2><i className="iconfont icon-group"></i>{this.props.data.name}</h2> </div>)
					:null;
		return (
			<section className="m-block">
				{title}
				<div className="content">
					{this.props.recommend}
					<ul className={"f-clearfix subCat-"+this.props.data.style}>
					{
						this.props.data.contentlist.slice(0,this.props.data.contentlist.length-(this.props.data.contentlist.length%2)).map(function(v,i){
							return <Book7 key={i} data={v} style={this.props.data.style} />
						}.bind(this))
					}
					</ul>
				</div>
			</section>
		);
	}
});
var Block14 = React.createClass({
	pages: 1,
	mixins: [Mixins()],
	readMoreHandle: function(e){
		var that = this;
		this.pages++;
		AJAX.init('block.'+this.props.data.id)
		AJAX.get(function(data){
			if(!data && !data.length){
				that.setState({
					noMore: true
				});
				return;
			}
			if(data.length<10){
				that.setState({
					noMore: true
				});
			}
			that.setState({
				contentList:that.state.contentList.concat(data)
			});
		})
	},
	getInitialState: function(){
		return {
			contentList:this.props.data.contentlist,
			noMore: this.props.data.contentlist.length<6? true:false
		}
	},
	componentDidUpdate: function(){
		this.lazyloadImage(this.refs.container);
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state.contentList !== nextState.contentList
				this.state.noMore !== nextState.noMore;
	},
	render:function(){
		var more;
		if(!this.state.noMore){
			more = (<button className="u-readMore f-bt-eee f-mb--10" onClick={this.readMoreHandle}>点击查看更多...</button>);
		}
		return (
			<section className="m-block">
				<div className="title bsTitle f-pr" href={this.props.href}>
					<i className="iconfont icon-lh3 f-block f-tc"></i>
					<h2 className="f-tc">{this.props.data.name}</h2>
				</div>
				<div className="content" ref="container">
					{this.props.recommend}
					<ul className="subCat-14">
					{
						this.state.contentList.map(function(v,i){
							return <Book8 key={i} data={v} />
						}.bind(this))
					}
					</ul>
					{more}
				</div>
			</section>
		);
	}
});
var Block15 = React.createClass({
	mixins:[Mixins()],
	configTag:function(e){
		//var that = this;
		e.preventDefault();
		if(!this.isLogin()){
			this.goLogin(callback);
			return;
		}
		callback();
		function callback(){
			//alert(that.isLogin());
			AJAX.init('listTag');
			AJAX.get(function(data){
				if(data.selected.length){
					myEvent.execCallback('updateTopList');
				}else{
					myEvent.setCallback('configTag',function(){
						myEvent.execCallback('updateTopList');
						//TODO 重新加载本页				
					});
					browserHistory.push(GLOBAL.setHref('myTags'));
				}
			});
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	},
	render:function(){
		if(!this.props.data.contentlist.length){
			return (
				<section className="m-block">
					<div className="title bsTitle f-pr">
						<i className="iconfont icon-heart f-block f-tc"></i>
						<h2 className="f-tc">{this.props.data.name}</h2>
					</div>
					<div className="content content-none">
						<a onClick={this.configTag} className="u-btn3">+设置我的标签</a>
					</div>
				</section>
				);
		}else{
			return (
				<section className="m-block">
					<Link className="title bsTitle f-pr" to={this.props.href}>
						<span className="iconfont icon-arrow-right f-pa"></span>
						<i className="iconfont icon-heart f-block f-tc"></i>
						<h2 className="f-tc">{this.props.data.name}</h2>
					</Link>
					<div className="content">
						{this.props.recommend}
						<ul className="subCat-4 f-clearfix">
						{
							this.props.data.contentlist.map(function(v,i){
								return <Book1 key={i} data={v}/>
							}.bind(this))
						}
						</ul>
					</div>
				</section>
				);
		}
	}
});

var Blocklist = React.createClass({
	getInitialState: function(){
		return {
			comps: null,
			block5: {}
		}
	},
	getUpdate: function(blockList){
		var that = this;
		var comps = blockList.map(function(block, i) {
			//console.log('风格' + block.style)
			if (block.style != 15 && (!block.contentlist || !block.contentlist.length)) {
				return ;
			}
			var recommend = block.icon_word?
							<p className="recommend"><span className="iconWord f-br-3">{block.icon_word}</span>{block.short_recommend_words}</p>
							: null;
			var hrefStr = GLOBAL.setHref('more/block.'+block.id);
			switch (block.style) {
				case 1 :
					return <Block1 key={i} data={block} href={hrefStr} recommend={recommend} />;
				case 2 :
					return <Block2 key={i} data={block} href={hrefStr} recommend={recommend} />;
				case 3 :
					return <Block3 key={i} data={block} href={hrefStr} recommend={recommend} />;
				case 4 :
					return <Block4 key={i} data={block} href={hrefStr} recommend={recommend} />;
				case 11: //banner不铺满
				case 5 : //banner铺满
					require.ensure(['./block5'],function(require){
						setTimeout(function() {
							var Block5 = require('./block5');
							var block5 = <Block5 key={i} data={block} href={hrefStr} style={block.style} />;
							that.state.comps.splice(i,1,block5)
							that.state.block5[i] = block5;
							that.setState({
								comps: that.state.comps,
								block5: that.state.block5
							});
						}, 0);
					});
					return that.state.block5[i];
				case 6 :
					return <Block6 key={i} data={block} href={hrefStr} recommend={recommend} />;
				case 7 : //7 圆形热词风格
				case 8 : //8 方形热词风格
					return <Block7 key={i} data={block} recommend={recommend} />;
				case 9 : //9文字瀑布流风格
					return <Block9 key={i} data={block} href={hrefStr} recommend={recommend} />;
				case 12 : //12 半图偶数专题风格
				case 13 : //13 半图偶数排行风格
					return <Block12 key={i} data-id={i} data={block} recommend={recommend} />;
				case 14 : //14 书单风格
					return <Block14 key={i} data={block} href={hrefStr} recommend={recommend} />;
				case 15 : //15 猜你喜欢风格
					return <Block15 key={i} data={block} href={hrefStr} recommend={recommend} />;
			}
		});
		return comps;
	},
	componentWillMount: function(){
		var comps = this.getUpdate(this.props.blockList);
		this.setState({
			comps: comps
		});
	},
	componentWillReceiveProps: function(netProp){
		var comps = this.getUpdate(netProp.blockList);
		this.setState({
			comps: comps
		});
	},
	// shouldComponentUpdate: function(nextProps, nextState) {
	// 	var check = function(item){
	// 		return item == null;
	// 	}
	// 	return true;
	// 	return this.state.comps !== nextState.comps;
	// },
	render: function(){
		//console.log(this.state.comps)
		return (
			<div className="f-pr m-block-c">
				{this.state.comps}
			</div>
			);
	}
});

module.exports = Blocklist;