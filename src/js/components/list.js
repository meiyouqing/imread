var Header = require('./header');
var Header_s = require('./header_s');
var Block7 = require('./block7');
var Mixins = require('../modules/mixins');

var List = React.createClass({
	mixins: [Mixins()],
	isLoading: false,
	getList: function(param){

		var hash = param?param:this.props.params.listId;
		AJAX.init(hash);
		AJAX.get(data => {
			this.isLoading = false;
			if(/^searchList/.test(this.props.route.path)){
				if (!data.contentlist.length) {
					this.setState({
						noMore:true
					})
				}
				this.setState({
					resultCount: data.result_count,
					bookList: this.state.scrollUpdate? this.state.bookList.concat(data.contentlist):data.contentlist,
					scrollUpdate: false
				})
				//设置GLOBAL book name
				GLOBAL.setBookName(data.contentlist);
			}else{
				if (!data || !data.content.length) {
					this.setState({
						noMore:true
					})
				}

				this.setState({
					bookList:this.state.scrollUpdate? this.state.bookList.concat(data.content):data.content,
					scrollUpdate: false
				});				
				//设置GLOBAL book name
				GLOBAL.setBookName(data);
			}
		}, error => {
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
	goSearch: function(){
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
			bookList: null,
			scrollUpdate: false,
			UFO:false
		}
	},
	componentDidMount: function(){
		this.getList();
	},
	update: function(){

	},
	// componentWillReceiveProps: function(nextProps){
	// 	this.getData();
	// },
	componentDidUpdate: function(nextProps,nextState) {


		this.lazyloadImage(this.refs.container);
	},
	componentWillReceiveProps: function(nextProps){
		var isSearch = /searchList/.test(this.props.route.path);

		if(this.props.params.listId !== nextProps.params.listId && isSearch){
			this.isLoading = true;
			this.getList(nextProps.params.listId);
		}
	},
	shouldComponentUpdate: function(nextProps,nextState){
		return this.state.bookList !== nextState.bookList 
				|| this.state.scrollUpdate !== nextState.scrollUpdate
				|| this.state.UFO !== nextState.UFO
				|| this.state.noMore !== nextState.noMore
				|| this.props.children !== nextProps.children
				|| this.props.params.listId !== nextProps.params.listId;
	},
	render:function(){
		var header,noData,content,sLoading,result_count;
		//定义头部
		if(this.state.resultCount){
			result_count = <p className="u-noteText">为您找到相关图书{this.state.resultCount}本</p>;
		}
		header = <Header title={GLOBAL.title} right={null} />;				
		if(/^searchList/.test(this.props.route.path)){
			header = <Header_s goSearch={this.goSearch} />;
		}
		//定义content
		if(!this.state.bookList || this.isLoading){
			content = <Loading />;
		}else{
			if(!this.state.bookList.length){
				noData = (<div className="g-main g-main-1"><NoData /></div>);
				content = null;
				result_count = null;
			}else{
				content = <Block7 bookList={this.state.bookList}/>;
				sLoading = <Loading cls='u-sLoading' />;
			}							
		}
		if(this.state.noMore){
			sLoading = null;
		}
		if(this.state.UFO){
			noData = (<div className="g-main g-main-1"><NoData type="UFO" /></div>);
			content = null;
			result_count = null;
			sLoading = null;
		}
		return (
			<div className="gg-body">
				{header}
				<div className="g-main g-main-1">
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