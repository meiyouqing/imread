var Header = require('./header');
var Img = require('./img');

var Shelf = React.createClass({
	mixins:[Mixins()],
	startReading: function(e){
		var a = e.target.parentNode.parentNode;
		var bid = parseInt(a.getAttribute('data-bid'));
		var sbid = a.getAttribute('data-sbid');
		var cid = a.getAttribute('data-cid');
		var sid = a.getAttribute('data-sid');
		if(!this.state.setting){ //开始阅读
			var readLog = storage.get('readLogNew')[bid];
			if (readLog){
				//console.log(readLog)
				cid = readLog.current_chapterid;
			}
			myEvent.setCallback('refreshShelf',this.getList);
			browserHistory.push(GLOBAL.setHref('reading/crossDomain.'+sbid+'.'+cid+'.'+bid+'.'+sid));
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
	settingClick: function(){
		var completion = <button className="f-fr textBtn" onClick={this.compClick} >完成</button>;
		var seAll = <button className="f-fl textBtn" onClick={this.seAllClick} >全选</button>;
		var seNone = <button className="f-fl textBtn" onClick={this.seNoneClick} >取消全选</button>;
		this.setState({
			setting:true,
			selected:[],
			icon : <i className="iconfont icon-selected"></i>,
			left:this.state.toggle? seNone : seAll,
			right:completion
		})
	},
	compClick: function(){
		var icon = <i className="u-recentRead"></i>;	
		var setting = <button className="f-fr iconfont icon-setting" onClick={this.settingClick} ></button>;
		this.setState({
			setting:false,
			left:null,
			right:setting,
			icon:icon
		})
	},
	seAllClick :function(){
		var seNone = <button className="f-fl textBtn" onClick={this.seNoneClick} >取消全选</button>;
		this.state.shelfList.forEach(function(v){
			this.state.selected.push(v.content_id);
		}.bind(this))
		this.setState({
			left:seNone,
			selected:this.state.selected
		})
	},
	seNoneClick: function(){
		var seAll = <button className="f-fl textBtn" onClick={this.seAllClick} >全选</button>;
		this.setState({
			left:seAll,
			selected:[]
		})
	},
	delBtnClick: function(){
		if(!this.state.selected.length) {
			//POP._alert('别闹~至少选择一本书先！')
			return;
		};
		var param = []
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
	getInitialState: function(){
		var icon = <i className="u-recentRead"></i>;	
		var setting = <div className="f-fr iconfont icon-setting" onClick={this.settingClick} ></div>;
		return {
			setting:false,
			toggle:false,
			left:null,
			right:setting,
			icon:icon,
			selected:[],
			noMore:true,
			shelfList:null
		}
	},
	getList: function (){
		AJAX.init('block.156.100.1');
		AJAX.get((data)=>{
			this.setState({
				shelfList: data.content
			});
			//设置GLOBAL.booklist/book
			GLOBAL.setBlocklist(data);
		},this.onerror);
	},			
	componentDidMount: function(){
		if(!this.isLogin()){
			this.goLogin(() => {
				if(GLOBAL.isRouter(this.props))	this.getList();
			});
			return;
		}
		if(GLOBAL.isRouter(this.props))	this.getList();
	},
	componentDidUpdate: function() {

		if(GLOBAL.isRouter(this.props) && !this.state.shelfList)	this.getList();
		this.refs.container && this.lazyloadImage(this.refs.container);
	},
	render:function(){
		var header = <Header title="书架" left={this.state.left} right={this.state.right}  path={this.props.route}  />;
		//console.log(this.state.shelfList);
		var icon,content;
		var curClass = '';
		var add = <li className="u-book-0"><Link className="add f-pr" to="/mall"><img src="http://m.imread.com/src/img/defaultCover.png"/><i className="iconfont icon-add f-pa"></i></Link></li>;
		var addBook = this.state.setting? null:add;
		
		//获取最近阅读的时间和
		var recent = 0;
		var maxCurrentTime = 0;
		var readLogs = storage.get('readLogNew');
		if(!this.state.shelfList){
			content = <Loading />;
		}else if(!this.state.shelfList.length){
			content = <NoData type="emptyShelf" />;
		}else{
			for (var n in readLogs) {
				if (readLogs[n].current_time > maxCurrentTime) {
					maxCurrentTime = readLogs[n].current_time;
					recent = readLogs[n].content_id;
				}
			}
			var recentIndex = -1;
			this.state.shelfList.forEach(function(v, i) {
				if (v.content_id == recent) {
					recentIndex = i;
					return false;
				}
			});

			if (recentIndex > 0) {
				this.state.shelfList.unshift(this.state.shelfList.splice(recentIndex, 1)[0]);
			}
			content = (
					<div className="g-main">
						<div className="g-scroll g-scroll-noBG" ref="container" onScroll={this.scrollHandle}>
							<ul className="shelfWrap f-clearfix active">
								{
									this.state.shelfList.map(function(v,i){
										if(this.state.setting){
											curClass = this.state.selected.indexOf(v.content_id)==-1?'':'z-active';
										}
										icon = this.state.setting? this.state.icon:(recent == v.content_id? this.state.icon:null);
										return(
											<li key={i} className={"u-book-2 "+curClass}>
												<a onClick={this.startReading} data-bid={v.content_id} data-cid={v.chapter_id} data-sbid={v.source_bid} data-sid={v.source_id}>
													<div style={{position:'relative'}}>
													{icon}
													<Img src={v.image_url} />
													<progress style={{position:'absolute',bottom:'2px',left:'0',width:'100%',height:'5px',backgroundColor: '#fff',color:'#0064B4'}} value={v.playorder/v.count} max="1"></progress>
													</div>
													<span className="f-ellipsis">{v.name}</span>
												</a>
											</li>
											);
									}.bind(this))
								}
								{addBook}
							</ul>
						</div>
						<button className={"u-btn-1"+(!this.state.setting? ' f-hide':'')+(this.state.selected.length? '':' u-btn-1-disabled')} onClick={this.delBtnClick} ><i className="iconfont icon-delete"></i>删除</button>
					</div>
				)
		}
		return (
			<div className="gg-wraper">
				{header}
				{content}
				{this.props.children}
			</div>
		);
	}
});

module.exports = Shelf;