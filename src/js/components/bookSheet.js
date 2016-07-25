var Header = require('./header');
//var Block7 = require('./block7');
var Book1 = require('./book1');
var Mixins = require('../modules/mixins');
require('../../css/bookSheet.css');

var Module = React.createClass({
	 mixins: [Mixins()],
	getList: function(){
		AJAX.init(this.props.params.sheetId);
		AJAX.get(function(data){
			GLOBAL.title = data.sheet_name;
			if(!data.content){return;}
			if (!data.content.length) {
				this.setState({
					noMore:true
				})
				return;
			}
			if(this.state.scrollUpdate){
				data.content = this.state.data.content.concat(data.content);
			}
			this.setState({
				data: data,
				collected: +data.collection,
				scrollUpdate: false
			});	
			//设置GLOBAL book name
			GLOBAL.setBookName(data.content);
		}.bind(this), function(error){
			if(this.state.scrollUpdate){
				this.setState({
					scrollUpdate:false,
					noMore:true
				});
				return;
			}
			this.setState({
				UFO:true
			});
			//console.log(error);
		}.bind(this));
	},
	addFavaHandle:function(){
		var that = this;
		if(!this.isLogin()){
			this.goLogin(goadd);
			return;
		}
		goadd();
		function goadd(){
			if(!that.state.collected){
				goAjax('collectionAdd');
			}else{
				goAjax('collectionDelete');
			}
		}
		function goAjax(which){
			AJAX.go(which,{sheet_id:that.state.data.sheet_id}, function(){
				that.setState({
					collected: which==='collectionAdd'
				});
			},null,'collection');
		}
	},
	getInitialState: function(){
		return {
			noMore:false,
			data: null,
			collected: false,
			scrollUpdate: false,
			UFO:false
		}
	},
	componentDidMount: function(){
		if(GLOBAL.isRouter(this.props))	this.getList();
	},
	componentDidUpdate: function() {
		if(GLOBAL.isRouter(this.props) && !this.state.data)	this.getList();
		this.lazyloadImage(this.refs.container);
	},
	shouldComponentUpdate: function(nextProps,nextState){
		return this.state.data !== nextState.data 
					|| this.state.collected !== nextState.collected
					|| this.state.scrollUpdate !== nextState.scrollUpdate
					|| this.state.UFO !== nextState.UFO
					|| this.state.noMore !== nextState.noMore 
					|| this.props.children !== nextProps.children;
	},
	render:function(){
		var noData,content,sLoading;
	//定义content
	//console.log(this.state.noMore,this.state.scrollUpdate)
		if(!this.state.data){
			content = <Loading />;
		}else{
			//var m_time = this.state.data.modify_time.substr(0,4)+'.'+this.state.data.modify_time.substr(4,2)+'.'+this.state.data.modify_time.substr(6,2);
			if(!this.state.data.content.length){
				noData = (<div className="g-main g-main-1"><NoData /></div>);
				content = null;
			}else{
				sLoading = this.state.noMore?null:(<Loading cls='u-sLoading' />);
				content = (
					<div>
						<section className="m-block">
							<div className="content">
								<div className="bsHead f-bb-eee">
									<h2>{this.state.data.sheet_name}</h2>
									<p className="f-fs-14 f-mb-15">共计{this.state.data.content_cnt}本</p>
									<p><input className={"u-btn2 f-fs-14 f-mb-30 "+(this.state.collected? "u-btn2-on":"")} type="button" value={this.state.collected? "已收藏":"收藏"} onClick={this.addFavaHandle} /></p>
									<p className="f-clearfix"><span className="f-fl f-fc-777">已有{this.state.data.collect_uv}人收藏</span><span className="f-fr f-fc-777">更新于{this.state.data.update_time}</span></p>
								</div>
								<p className="bsBrief">{this.state.data.sheet_brief}</p>
							</div>
						</section>
						<section className="m-block">
							<div className="content">
								<ul className="bsList">
									{
										this.state.data.content.map(function(v,i){;
											return <Book1 key={i} data={v} />
										}.bind(this))
									}
								</ul>
							</div>
							{sLoading}
						</section>
					</div>
				);
			}							
		}
		if(this.state.UFO){
			noData = (<div className="g-main g-main-1"><NoData type="UFO" /></div>);
			content = null;
		}
		return (
			<div className="gg-body">
				<Header path={this.props.route} />
				<div className="g-main g-main-1">
					<div className="g-scroll" ref="container" onScroll={this.scrollHandle}>
						{content}
					</div>
				</div>
				{noData}
				{this.props.children}
			</div>
		);
	}
});

module.exports  = Module;