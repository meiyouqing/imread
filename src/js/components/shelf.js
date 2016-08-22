if(typeof window !== 'undefined'){
	var POP = require('../modules/confirm')
}
var Header = require('./header_f');
var Img = require('./img');

var Shelf = React.createClass({
	mixins:[Mixins()],
	startReading: function(v){
		var bid = v.content_id;
		var cid = v.chapter_id;
		if(!this.state.setting){ //开始阅读
			var readLog = storage.get('readLogNew')[bid];
			if (readLog){
				//console.log(readLog)
				cid = readLog.current_chapterid;
			}
			myEvent.setCallback('refreshShelf',this.getList);
			this.compClick();
			browserHistory.push({pathname:GLOBAL.setHref('reading/crossDomain.'+v.source_bid+'.'+cid+'.'+bid+'.'+v.source_id),state:{author: v.author,book_name: v.name}});
		}else{  //选择操作
			var index = this.state.selected.indexOf(bid);
			if(index == -1){
				this.state.selected.push(bid);
				this.setState({
					selected:this.state.selected
				});
			}else{
				this.state.selected.splice(index,1);
				this.setState({
					selected:this.state.selected
				});
			}
		}
	},
	showModels: function(){
		this.setState({showModelList: !this.state.showModelList});
	},
	settingClick: function(e){
		var index = Number(e.target.getAttribute('data-index'));
		this.setState({showModelList: false});
		var completion = <button className="f-fr textBtn" onClick={this.compClick} >完成</button>;
		var setting = false,selected=[],icon=null,left=null,middle=null;

		switch(index){
			case 1:
				var seAll = <button className="f-fl textBtn no-ml" onClick={this.seAllClick} >全选</button>;
				var seNone = <button className="f-fl textBtn no-ml" onClick={this.seNoneClick} >取消全选</button>;
				setting=true;
				icon =  <i className="icon-selected-s"></i>;
				left = this.state.toggle? seNone : seAll;
				break;
			case 2:
				break;
			case 3: 
				break;
		}

		this.setState({
			setting:setting,
			selected:selected,
			icon: icon,
			left:left,
			middle: middle,
			right:completion,
			model: index
		});


	},
	gotoHome: function(){
		this.goBackUrl(this.props.route);
	},
	compClick: function(){
		//var icon = <i className="u-recentRead"></i>;	
		var setting = <div className="icon-s icon-editor right icon-m-r6" onClick={this.showModels} ></div>;
		var back = <a className="f-fl icon-back icon-s" onClick={this.gotoHome}></a>;
		var middle = <a className="icon-s icon-bookstore right" onClick={this.gotoZy}></a>;
		this.setState({
			setting:false,
			left:back,
			right:setting,
			icon:null,
			model: 0,
			middle: middle
		})
	},
	seAllClick :function(){
		var seNone = <button className="f-fl textBtn no-ml" onClick={this.seNoneClick} >取消全选</button>;
		this.state.shelfList.forEach(function(v){
			this.state.selected.push(v.content_id);
		}.bind(this))
		this.setState({
			left:seNone,
			selected:this.state.selected
		})
	},
	seNoneClick: function(){
		var seAll = <button className="f-fl textBtn no-ml" onClick={this.seAllClick} >全选</button>;
		this.setState({
			left:seAll,
			selected:[]
		})
	},
	gotoZy: function(){
		browserHistory.push('/mall');
	},
	gotoReading: function(){//详情页面
		if(this.state.selected.length !== 1) return;
		else{
			this.state.shelfList.forEach(function(v,i){
				if(v.content_id == this.state.selected[0]){
					//this.startReading(null,v);

					this.compClick();
					browserHistory.push(GLOBAL.typeHref(v));
				}
			}.bind(this));
		}
	},
	gotoDownload: function(){//下载
		this.compClick();
		window.location.replace("http://readapi.imread.com/api/upgrade/download?channel=imread");
	},
	delBtnClick: function(){//删除书架书籍
		if(!this.state.selected.length) {
			//POP._alert('别闹~至少选择一本书先！')
			return;
		};
		var param = [];
		this.state.selected.forEach(function(v){
			var o = {type:3,bookId:v}
			param.push(o);
		});
		param = JSON.stringify(param);
		AJAX.go('deleteBook',{param:param},function(data){
			this.getList();
			this.compClick();
		}.bind(this))
	},
	changeOrder: function(e){//排序模式选择
		var a = e.target.tagName == 'A'?e.target:e.target.parentNode;
		var i = a.getAttribute('data-info');
		this.sortBook(i,this.state.shelfList);
	},	
	sortBook: function(i,arr,bool){
		var isReverse = true;
		if(this.models.order_model !== i)  isReverse = false;
		if(bool) isReverse = false;

		switch(i){
			case '1':
				if(isReverse){
					arr.reverse();
					this.isReverse_s('reading_order');
				} else {
					arr = arr.sort(function(a,b){
						var x = a.playorder/a.count,y=b.playorder/b.count;
						return y-x;});
					if(this.models.reading_order == 1)
						arr.reverse();
				}
				break;
			case '2':
				if(isReverse){
					arr.reverse();
					this.isReverse_s('book_order');
				} else {
					arr = arr.sort((a, b) => a.name.localeCompare(b.name));

					if(this.models.book_order == 1)
						arr.reverse();
				}
				break;
			default:
				if(isReverse){
					arr.reverse();
					this.isReverse_s('recent_order');
				} else {
					arr.sort(function(a,b){
						var x=Number(a.mark_time), y = Number(b.mark_time);
						return x-y; });
					if(this.models.recent_order == 1)
						arr.reverse();
				}
		};
		this.models.order_model = i;
		this.setState({order_model: i,recent_order:this.models.recent_order,reading_order:this.models.reading_order,book_order:this.models.book_order,shelfList:arr});
		try{
			localStorage.setItem('models',JSON.stringify(this.models));
		} catch(e) {}

		//localStorage.models = JSON.stringify(this.models);
		return arr;
	},
	isExist: function(n){
		return n?n:'0';
	},
	isReverse_s: function(key){
		var bool = Number(this.models[key]);
		if(bool)
			 this.models[key] = '0';
		else
			 this.models[key] = '1';
	},
	changeShow: function(e){
		var a = e.target.tagName == 'A'?e.target:e.target.parentNode;
		var i = a.getAttribute('data-cls');

		this.models.show_model = i;
		this.setState({show_model: i});
		localStorage.models = JSON.stringify(this.models);
	},
	models:{},
	getInitialState: function(){
		//var icon = <i className="u-recentRead"></i>;	
		var setting = <div className="icon-s icon-editor right icon-m-r6" onClick={this.showModels} ></div>;
		var back = <a className="f-fl icon-back icon-s" onClick={this.gotoHome}></a>;
		var middle = <a className="icon-s icon-bookstore right" onClick={this.gotoZy}></a>;
		this.models = localStorage.models?JSON.parse(localStorage.models):{};//获取模式和排序
		return {
			setting:false,
			toggle:false,
			left:back,
			right:setting,
			middle: middle,
			icon:null,
			selected:[],
			noMore:true,
			shelfList:null,
			showModelList:false,
			model: 0,//默认为无
			show_model: this.models.show_model?this.models.show_model:'0',
			order_model: this.models.order_model?this.models.order_model:'0',
			recent_order: this.models.recent_order?this.models.recent_order:'0',
			reading_order: this.models.reading_order?this.models.reading_order:'0',
			book_order: this.models.book_order?this.models.book_order:'0',
		}
	},
	getList: function (){
		AJAX.init('block.156.100.1');
		var order_model = this.models.order_model?this.models.order_model:0;
		AJAX.get((data)=>{
			this.setState({
				
				shelfList: this.sortBook(order_model,data.content,true)
			});
			//设置GLOBAL.booklist/book
			GLOBAL.setBlocklist(data);
		},this.onerror);
	},			
	componentDidMount: function(){
		this.models = localStorage.models?JSON.parse(localStorage.models):{}//获取模式和排序
		if(this.checkLogin(this.props.route)) {
			this.getList()
		}
	},
	componentDidUpdate: function(nextPros,nextState) {

		if(GLOBAL.isRouter(this.props) && !this.state.shelfList && !!nextState.shelfList)	this.getList();
		this.refs.container && this.lazyloadImage(this.refs.container);
	},
	render:function(){
		var header = <Header title="书架" left={this.state.left} right={this.state.right} middle={this.state.middle}  path={this.props.route}  />;
		var icon,content;
		var curClass = '';
		// var add = <li className="u-book-0"><Link className="add f-pr" to="/mall"><img src="http://m.imread.com/src/img/defaultCover.png"/><i className="iconfont icon-add f-pa"></i></Link></li>;
		// var addBook = this.state.setting? null:add;
		
		//获取最近阅读的时间和
		//var recent = 0;
		var maxCurrentTime = 0;
		var readLogs = storage.get('readLogNew');
		var nav = null;

		var modelList = <ul className={'u-model-list '+(this.state.showModelList?'active':'')}><li onClick={this.settingClick} data-index={1}>管理书本</li><li onClick={this.settingClick} data-index={2}>排列方式</li><li onClick={this.settingClick} data-index={3}>封面/列表</li></ul>;

		if(!this.state.shelfList){
			content = <Loading />;
		}else if(!this.state.shelfList.length){
			content = <NoData type="emptyShelf" />;
		}else{
			// for (var n in readLogs) {
			// 	if (readLogs[n].current_time > maxCurrentTime) {
			// 		maxCurrentTime = readLogs[n].current_time;
			// 		recent = readLogs[n].content_id;
			// 	}
			// }
			// var recentIndex = -1;
			// this.state.shelfList.forEach(function(v, i) {
			// 	if (v.content_id == recent) {
			// 		recentIndex = i;
			// 		return false;
			// 	}
			// });

			// if (recentIndex > 0) {
			// 	this.state.shelfList.unshift(this.state.shelfList.splice(recentIndex, 1)[0]);
			// }
			content = (
					<div className="g-main shelf">
						<div className={"g-scroll g-scroll-noBG"+((this.state.show_model==0)?' aaa':' active')} ref="container" onScroll={this.scrollHandle}>
							<ul className="shelfWrap f-clearfix active">
								{

									this.state.shelfList.map(function(v,i){
										if(this.state.setting){
											curClass = this.state.selected.indexOf(v.content_id)==-1?'':'z-active';
										}

										icon = this.state.setting? this.state.icon:null;//(recent == v.content_id? this.state.icon:null);
										if(this.state.show_model == 0){
											return(
												<li key={i} className={"u-book-2 "+curClass}>
													<a onClick={this.startReading.bind(this,v)}>
														<div className="pro-box">
															{icon}
															<Img src={v.image_url} />
															<div className="progress p-div">
																<div style={{width: v.playorder/v.count*100+'%'}}>
																</div>
															</div>
														</div>
														<span className="f-ellipsis-2">{v.name}</span>
													</a>
												</li>
												);
										}
										else{
											var per = Number((v.playorder/v.count).toFixed(2)),notice='';
											per = per > 1?1:per;
											switch(per){
												case 1:
													notice = '已读完';
													break;
												case 0:
													notice = '未读';
													break;
												default:
													notice = per*100 + '%';
											};
											return (<li key={i} className={"u-book-2 "+curClass}>
													<a onClick={this.startReading.bind(this,v)}>
														<div className="pro-box">
														{icon}
														<Img src={v.image_url} />
														<div className="intro-box">
															<span className="f-ellipsis title">{v.name}</span>
															<span className="f-ellipsis chapter">{v.chapter_name || v.author}</span>
															<div className="progress-box">
																<span>{notice}</span>
																<div className="progress p-div">
																	<div style={{width: v.playorder/v.count*100+'%'}}>
																	</div>
																</div>
															</div>
														</div>
														</div>
													</a>
												</li>)
										}
									}.bind(this))
								}
							</ul>
						</div>
					</div>
				)
		}


		var len = this.state.selected.length;

		switch(this.state.model){
			case 1: 
				nav = (<div className="s-b s-b-sec">
							<a className={len===1?'active':''} onClick={this.gotoReading}><span className="icon-n icon-jingyong"></span><span>详情</span></a>
							<a className={len?'active':''} onClick={this.gotoDownload}><span className="icon-n icon-xiazai"></span><span>下载</span></a>
							<a className={len?'active':''} onClick={this.delBtnClick}><span className="icon-n icon-shanchu"></span><span>删除</span></a>
						</div>);
				break;
			case 2:
				nav = (<div className="s-b s-b-thi">
							<a className={this.state.order_model==0?'active':''} onClick={this.changeOrder} data-info={0}><span className={"icon-n icon-paixu "+(this.state.recent_order==0?'seq':'rev')}></span><span>最近</span></a>
							<a className={this.state.order_model==1?'active':''} onClick={this.changeOrder} data-info={1}><span className={"icon-n icon-paixu "+(this.state.reading_order==0?'seq':'rev')}></span><span>进度</span></a>
							<a className={this.state.order_model==2?'active':''} onClick={this.changeOrder} data-info={2}><span className={"icon-n icon-paixu "+(this.state.book_order==0?'seq':'rev')}></span><span>书名</span></a>
						</div>);
				break;
			case 3:
				nav = (<div className="s-b s-b-fir">
							<a className={this.state.show_model==0?'active':''} onClick={this.changeShow} data-cls={0}><span className="icon-n icon-fengmian"></span><span>封面模式</span></a>
							<a className={this.state.show_model==1?'active':''} onClick={this.changeShow} data-cls={1}><span className="icon-n icon-liebiao"></span><span>列表模式</span></a>
						</div>);
				break;
			default: 
				nav = null;
		}


		return (
			<div className="gg-wraper gg-body" >
				{header}
				{modelList}
				{content}
				{nav}
				{this.props.children}
			</div>
		);
	}
});

module.exports = Shelf;