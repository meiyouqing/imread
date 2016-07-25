var Blocklist = require('./blocklist');
var Header = require('./header');

var Top = React.createClass({
	mixins: [Mixins()],
	getInitialState: function(){
		return{
			noMore:true,
			scrollUpdate:false,
			onerror:false,
			list:null
		}
	},
	getData: function(){
		AJAX.init('group.6');
		AJAX.get((data)=>{
			AJAX.init('page.'+data.pagelist[0].pgid+'.'+data.pagelist[0].blocks);
			this.getList();			
		},this.onerror)
	},
	getList: function (){
		AJAX.get((data)=>{
			if(!data.blocklist){return}
			if (!data.blocklist.length) {
				this.setState({
					noMore:true
				})
			}
			this.setState({
				list: this.state.scrollUpdate? this.state.list.concat(data.blocklist):data.blocklist,
				scrollUpdate: false
			});
			//设置GLOBAL.booklist/book
			GLOBAL.setBlocklist(data.blocklist);
		},this.onerror);
	},			
	componentDidMount: function(){
		this.getData();
		myEvent.setCallback('updateTopList',this.getData);
	},
	componentDidUpdate: function() {
		if(!this.state.list || !this.state.list.length){return;}
		this.lazyloadImage(this.refs.container);
	},
	shouldComponentUpdate: function(nextProp,nextState){
		//console.log(this.props,nextProp)
		return this.state.noMore !== nextState.noMore
				|| this.state.list !== nextState.list 
				|| this.props.children !== nextProp.children;
	},
	render:function(){
		var list;
		if(!this.state.list){
			list = <Loading />
		}else{
			if(this.state.list.length){
				list = (
					<div className="g-main">
						<div className="g-scroll" onScroll={this.scrollHandle} ref="container">
							<Blocklist blockList={this.state.list} />
						</div>
					</div>
					);
			}else{
				list = (<div className="g-main"><NoData /></div>);
			}
		}
		if(this.state.onerror){
			list = (<div className="g-main"><NoData type="UFO" /></div>);
		}

		return (
			<div>
				<Header title="发现" left={null}  path={this.props.route} />
				{list}
				{this.props.children}
			</div>
			);
	}
})
module.exports = Top;