var Book1 = require('./book1');
var Book2 = require('./book2');
var Book3 = require('./book3');
var Book5 = require('./book5');
var Book6 = require('./book6');

var Block1 = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data || this.props.href !== nextProps.href;
	},
	render:function(){
		//this.props.data.contentlist.pop();
		return (
			<section className="m-block">
				<a className="title" href={this.props.href}>
					<span className="iconfont icon-arrow-right f-fr"></span>
					<h2><i className="iconfont icon-group"></i>{this.props.data.name}</h2>
				</a>
				<div className="content">
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
				<a className="title" href={this.props.href}>
					<span className="iconfont icon-arrow-right f-fr"></span>
					<h2><i className="iconfont icon-group"></i>{this.props.data.name}</h2>
				</a>
				<div className="content">
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
				<a className="title" href={this.props.href}>
					<span className="iconfont icon-arrow-right f-fr"></span>
					<h2><i className="iconfont icon-group"></i>{this.props.data.name}</h2>
				</a>
				<div className="content">
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
				<a className="title" href={this.props.href}>
					<span className="iconfont icon-arrow-right f-fr"></span>
					<h2><i className="iconfont icon-group"></i>{this.props.data.name}</h2>
				</a>
				<div className="content">
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
var Block8 = React.createClass({
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
			<section className="m-block">
				<div className="title">
					<span className="batchChange f-fr" onClick={this.batchChange}>换一批</span>
					<h2>{this.props.data.name}</h2>
				</div>
				<div className="content">
					<ul className={"subCat-"+this.props.cat+" f-clearfix"}>
					{
						this.state.contentlist.map(function(v,i){
							if(i > 5) return;
							var hrefStr = Router.setHref('searchList&search.'+v.name+'.0.0.0.0.0');
							return (
								<li key={i}>
									<a href={hrefStr} className={"style-"+(i+1)}>{v.name}</a>
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
			<section className="m-block">
				<a className="title" href={this.props.href}>
					<span className="iconfont icon-arrow-right f-fr"></span>
					<h2>{this.props.data.name}</h2>
				</a>
				<div className="content">
					<ul className="f-clearfix">
					{
						this.props.data.contentlist.map(function(v,i){
							//if(i > 5) return;
							return <Book5 key={i} data={v} />
						}.bind(this))
					}
					</ul>
				</div>
			</section>
		);
	}
});

var Blocklist = React.createClass({
	getInitialState: function(){
		return {
			comps: null,
			block5: null
		}
	},
	getUpdate: function(blockList){
		var that = this;
		var comps = blockList.map(function(block, i) {
			var hrefStr = Router.setHref('more&block.'+block.id+'.1.10');
			switch (block.style) {
				case 1 :
					return <Block1 key={block.id} data={block} href={hrefStr} />;
				case 2 :
					return <Block2 key={block.id} data={block} href={hrefStr} />;
				case 3 :
					return <Block3 key={block.id} data={block} href={hrefStr} />;
				case 4 :
					return <Block4 key={block.id} data={block} href={hrefStr} />;
				case 5 :
					require.ensure(['./block5'],function(require){
						setTimeout(function() {
							var Block5 = require('./block5');
							var block5 = <Block5 key={block.id} data={block} href={hrefStr} />;
							that.state.comps.splice(i,1,block5)
							that.setState({
								comps: that.state.comps,
								block5: block5
							});
						}, 0);
					});
					return that.state.block5;
				case 6 :
					return <Block6 key={block.id} data={block} href={hrefStr} />;
				case 7 :
					return <Block8 key={block.id} cat="7" data={block} />;
				case 8 :
					return <Block8 key={block.id} cat="8" data={block} />;
				case 9 :
					return <Block9 key={block.id} data={block} href={hrefStr} />;
				// case 10 :
				// 	return <Block0 key={i} data={block} href={hrefStr} />;
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
	shouldComponentUpdate: function(nextProps, nextState) {
		var check = function(item){
			return item == null;
		}
		return this.state.comps !== nextState.comps || !this.state.comps.some(check);
	},
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