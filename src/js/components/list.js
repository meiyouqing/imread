import NoData from './noData'
import Loading from './loading'
import browserHistory from 'react-router/lib/browserHistory'
import AJAX from '../modules/AJAX'
import GLOBAL from '../modules/global'
import Mixins from '../modules/mixins'
import React from 'react'
var Header = require('./header');
var Header_s = require('./header_s');
var Block7 = require('./block7');

var List = React.createClass({
	mixins: [Mixins()],
	isLoading: false,
	getList: function(param){
		if(!this.isMounted()) return;
		var hash = param?param:this.getListId();
		AJAX.init(hash);
		AJAX.get(this.ajaxHandle, error => {
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
		});
	},
	ajaxHandle:function(data){
		// if(!this.isMounted()) return;
		this.isLoading = false;
		var pathname = this.props.location.pathname.split('/');
		if(/^search\./.test(pathname[pathname.length-1])){
			if (!data.contentlist.length) {
				if(!this.state.bookList){
					this.setState({empty:true});
					return;
				}
				this.setState({
					scrollUpdate:false,
					noMore:true
				});
				return;
			}
			this.setState({
				recommend: data,
				resultCount: data.result_count,
				bookList: this.state.scrollUpdate? this.state.bookList.concat(data.contentlist):data.contentlist,
				UFO:false,
				empty:false,
				scrollUpdate: false
			})
		}else{
			if (!data || !data.content.length) {
				this.setState({
					noMore:true
				})
			}
			this.setState({
				recommend: data,
				bookList:this.state.scrollUpdate? this.state.bookList.concat(data.content):data.content,
				scrollUpdate: false
			});				
		}
	},
	goSearch: function(){
		if(!this.isMounted()) return;
		if(!this.state.scrollUpdate){
			this.refs.container.scrollTop = 0;
			this.setState({
				noMore:false,
				bookList:null,
				resultCount:null
			})
		}
		this.getList();
	},
	getInitialState: function(){
		return {
			noMore:false,
			resultCount: null,
			recommend: {},
			bookList: null,
			scrollUpdate: false,
			UFO:false,
			empty:false,
			title: '艾美阅读'
		}
	},
	componentWillMount:function(){
		this.usePreload(this.getListId());
	},
	getListId: function(){
		var listId = this.props.params.listId;
		if(typeof listId === 'string')
			return listId;
		else 
			return listId[listId.length-1]
	},
	componentDidMount: function(){
		// console.log(this.state.bookList)
		if(GLOBAL.isRouter(this.props) && !this.state.bookList) this.getList();
		if(location.pathname.match(/\/alist./)){GLOBAL.title = this.APIParts('listId')[1]}
		this.lazyloadImage(this.refs.container);
	},
	componentDidUpdate: function(nextProps,nextState) {
		console.log(this.state.bookList, '/', nextState.bookList)
		GLOBAL.isAd();
		if(GLOBAL.isRouter(this.props))  {
			if(!this.state.bookList){
				this.getList();
			}else{
				this.lazyloadImage(this.refs.container);
				this.disPatch('scroll',this.refs.container)
			}
		}
	},
	componentWillReceiveProps: function(nextProps){
		var isSearch = /searchList/.test(this.props.route.path);

		if(this.props.params.listId !== nextProps.params.listId && isSearch){
			this.isLoading = true;
			this.getList(nextProps.params.listId);
		}
	},
	componentWillUnmount: function(){
		delete GLOBAL.title;
	},
	shouldComponentUpdate: function(nextProps,nextState){
		return this.state.bookList !== nextState.bookList 
				|| this.state.scrollUpdate !== nextState.scrollUpdate
				|| this.state.UFO !== nextState.UFO
				|| this.state.empty !== nextState.empty
				|| this.state.noMore !== nextState.noMore
				|| this.props.children !== nextProps.children
				|| this.props.params.listId !== nextProps.params.listId;
	},
	render:function(){
		var header,noData,content,sLoading,result_count;
		header = <Header title={this.state.recommend.name || GLOBAL.title}  right={null} path={this.props.route}  />;				
		if(/^searchList/.test(this.props.route.path)){
			header = <Header_s goSearch={this.goSearch} route={this.props.route} params={this.props.params} keyValue={this.props.location.state} />;
		}
		//定义content
		if(!this.state.bookList || this.isLoading){
			//if(GLOBAL.isRouter(this.props))	//兼容低端安卓
				content = <Loading />;
		}else{
			if(!this.state.bookList.length){
				noData = (<div className="g-main g-main-1"><NoData type="emptySearch" /></div>);
				content = null;
				result_count = null;
			}else{
				content = <Block7 recommend={this.state.recommend} bookList={this.state.bookList} location={this.props.location}/>;
				sLoading = <Loading cls='u-sLoading' />;
			}							
		}
		if(this.state.noMore){
			sLoading = null;
		}
		if(this.state.UFO || this.state.empty){
			noData = (<div className="g-main g-main-1"><NoData type={this.state.UFO?"UFO":"emptySearch"} /></div>);
			content = null;
			result_count = null;
			sLoading = null;
		}
		//console.log(content)
		return (
			<div className="gg-body">
				{header}
				<div className="g-main g-main-1 m-list">
					<div className="g-scroll" onScroll={this.scrollHandle} ref="container">
						{result_count}
						{content}
						{sLoading}
					</div>
				</div>
				{noData}
				{this.props.children}
			</div>
		);
	}
});

module.exports  = List;