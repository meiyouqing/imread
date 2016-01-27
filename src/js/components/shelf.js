var Header = require('./header');
var Img = require('./img');

var Shelf = React.createClass({
	mixins:[Mixins()],
	startReading: function(e){
		var a = e.target.parentNode;
		var bid = parseInt(a.getAttribute('data-bid'));
		var sbid = a.getAttribute('data-sbid');
		var cid = a.getAttribute('data-cid');
		var sid = a.getAttribute('data-sid');
		if(!this.state.setting){ //开始阅读
			var data = this.state.data;
			var readLog = storage.get('readLog')[bid];
			if (readLog){
				//console.log(readLog)
				cid = readLog.current_chapterid;
			}
			myEvent.setCallback('refreshShelf',this.props.getShelfList);
			window.location.hash = Router.setHref('reading&crossDomain.'+sbid+'.'+cid+'.'+bid+'.'+sid);
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
		var delBtn = <button className="u-btn-1" onClick={this.delBtnClick} ><i className="iconfont icon-delete"></i>删除</button>;
		this.setState({
			setting:true,
			selected:[],
			icon : <i className="iconfont icon-selected"></i>,
			left:this.state.toggle? seNone : seAll,
			right:completion,
			delBtn:delBtn
		})
	},
	compClick: function(){
		var icon = <i className="u-recentRead"></i>;	
		var setting = <button className="f-fr iconfont icon-setting" onClick={this.settingClick} ></button>;
		this.setState({
			setting:false,
			left:null,
			delBtn:null,
			right:setting,
			icon:icon
		})
	},
	seAllClick :function(){
		var seNone = <button className="f-fl textBtn" onClick={this.seNoneClick} >取消全选</button>;
		this.props.shelfList.forEach(function(v){
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
			alert('别闹~至少选择一本书先！')
			return;
		};
		var param = []
		this.state.selected.forEach(function(v){
			var o = {type:3,bookId:v}
			param.push(o);
		});
		param = JSON.stringify(param);
		Router.ajax('deleteBook',{param:param},function(data){
			// console.log(data);
			//Router.init('shelf&block.157.1.0');
			this.props.getShelfList();
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
			delBtn:null,
			right:setting,
			icon:icon,
			selected:[],
			noMore:true
		}
	},
	componentDidMount: function(){
		this.lazyloadImage(this.refs.container);
	},
	componentDidUpdate: function() {
		//var scrollUpdate = Router.parts[2]==='1';
		this.lazyloadImage(this.refs.container);
		// console.log(Router.parts)
		// if (scrollUpdate) {
		// 	this.refs.container.scrollTop = 0;
		// }
	},
	shouldComponentUpdate: function(nextProp,nextState){
		//console.log(this.props,nextProp)
		return true;
	},
	render:function(){
		//console.log(this.state.selected);
		var content,header,icon;
		var curClass = '';
		var recent = 0;
		var add = <li className="u-book-0"><a className="add f-pr" href="#mall"><img src="src/img/defaultCover.png"/><i className="iconfont icon-add f-pa"></i></a></li>;
		var addBook = this.state.setting? null:add;
		this.props.shelfList.forEach(function(v,i){
			recent = (recent<v.mark_time)?v.mark_time:recent;
		})
		return (
			<div>
				<Header title="书架" left={this.state.left} right={this.state.right} />
				<div className="g-main">
					<div className="g-scroll g-scroll-noBG" ref="container" onScroll={this.scrollHandle}>
						<ul className="shelfWrap f-clearfix">
							{
								this.props.shelfList.map(function(v,i){
									if(this.state.setting){
										curClass = this.state.selected.indexOf(v.content_id)==-1?'':'z-active';
									}
									icon = this.state.setting? this.state.icon:(recent === v.mark_time? this.state.icon:null);
									return(
										<li key={i} className={"u-book-2 "+curClass}>
											<a onClick={this.startReading} data-bid={v.content_id} data-cid={v.chapter_id} data-sbid={v.source_bid} data-sid={v.source_id}>
												{icon}
												<Img src={v.big_coverlogo} />
												<span className="f-ellipsis">{v.name}</span>
											</a>
										</li>
										);
								}.bind(this))
							}
							{addBook}
						</ul>
					</div>
				</div>
				{this.state.delBtn}
			</div>
		);
	}
});

module.exports = Shelf;