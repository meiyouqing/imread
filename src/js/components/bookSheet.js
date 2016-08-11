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
						<section className="m-block m-sheet">
							<div className="content">
								<div className="m-sheet-header">
									<div className="u-sheet-c"><p>{this.state.data.content_cnt}</p><p>本</p></div>
									<img src={this.state.data.image_url} />
									<div className="m-b-footer">
										<span className="icon-l icon-love i-s-m"></span>
										<span className="u-sc">{this.state.data.collect_uv || 0}</span>
										<span className="u-sc">{GLOBAL.prettyDate(this.state.data.modify_time)}</span>
									</div>
								</div>
								<div className="u-m-store" onClick={this.addFavaHandle}>
									<span className={"icon-n icon-love-store "+(this.state.collected?'active':'')}></span>
								</div>
								<div className="u-sheet-detail">
									<h2 className="f-ellipsis">{this.state.data.sheet_name}</h2>
									<div className="brief">{this.state.data.sheet_brief}</div>
								</div>
							</div>
						</section>
						<div className="m-device"></div>
						<section className="m-block m-sheet-s">
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
				<Header path={this.props.route} title={"书单详情"} />
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