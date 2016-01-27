
var Header = require('./header');
var Header_s = require('./header_s');
var Block7 = require('./block7');
var List = React.createClass({
	mixins: [GLOBAL.lazyloadImageMixin()],
	scrollHandle: function(e) {
		var list = e.target;
		this.lazyloadImage(list);
		if (!this.isMounted()) {return ;}			
		clearTimeout(this.timeoutId);
		this.timeoutId = setTimeout(function() {
			//console.log(document.body.scrollHeight , list.scrollTop + (-30) , list.scrollHeight)
			//console.log(!this.state.noMore,!this.state.scrollUpdate,document.body.scrollHeight + list.scrollTop + (-30) > list.scrollHeight)
			if (this.state.bookList && !this.state.noMore && !this.state.scrollUpdate && (document.body.scrollHeight + list.scrollTop + (-30) > list.scrollHeight)) {
				var parts = Router.parts.map(function(v,i){
					return i===2? ++v:v;
				});
				Router.init(Router.name+'&'+parts.join('.'));
				this.setState({
					scrollUpdate:true
				});
				this.getData(function(){
					this.setState({
						scrollUpdate:false
					})
				}.bind(this));
			}
		}.bind(this), 100);
	},
	getData: function(callback){
		Router.get(function(data){
			if(Router.name === 'searchList'){
				if (!data.contentlist.length) {
					this.setState({
						noMore:true
					})
				}
				this.setState({
					resultCount: data.result_count,
					bookList: this.state.scrollUpdate? this.state.bookList.concat(data.contentlist):data.contentlist
				})
				//设置GLOBAL book name
				GLOBAL.setBookName(data.contentlist);
			}else{
				if (!data || !data.length) {
					this.setState({
						noMore:true
					})
				}
				this.setState({
					bookList:this.state.scrollUpdate? this.state.bookList.concat(data):data
				});				
				//设置GLOBAL book name
				GLOBAL.setBookName(data);
			}
			typeof callback==='function'&&callback();
		}.bind(this));
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
		this.getData();
	},
	getInitialState: function(){
		return {
			noMore:false,
			resultCount: null,
			bookList: null,
			scrollUpdate: false
		}
	},
	componentDidMount: function(){
		this.getData();
	},
	// componentWillReceiveProps: function(nextProps){
	// 	this.getData();
	// },
	componentDidUpdate: function() {
		this.lazyloadImage(this.refs.container);
	},
	shouldComponentUpdate: function(nextProps,nextState){
		return this.state.bookList !== nextState.bookList 
				|| this.state.scrollUpdate !== nextState.scrollUpdate;
	},
	render:function(){
		var header,content,sLoading,result_count;
		//定义头部
		if(Router.name === 'category' || Router.name === 'more'){
			header = <Header title={Router.title} />;				
		}
		if(Router.name === 'searchList'){
			header = <Header_s goSearch={this.goSearch} />;
		}
		//定义content
		if(!this.state.bookList){
			content = <Loading />;
		}else{
			if(!this.state.bookList.length){
				content = <NoData />;
			}else{
				content = <Block7 bookList={this.state.bookList}/>;
				if(this.state.bookList.length>=10){
					sLoading = <Loading cls='u-sLoading' />;
				}
			}							
		}
		if(this.state.noMore){
			sLoading = null;
		}
		if(this.state.resultCount){
			result_count = <p className="u-noteText">为您找到相关图书{this.state.resultCount}本</p>;
		}
		return (
			<div>
				{header}
				<div className="g-main g-main-1">
					<div className="g-scroll" onScroll={this.scrollHandle} ref="container">
						{result_count}
						{content}
						{sLoading}
					</div>
				</div>
			</div>
		);
	}
});

module.exports  = List;