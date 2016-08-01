var Blocklist = require('./blocklist');
var Header = require('./header');
var BookStore = require('./bookStore');
import MallNavLink from './mallNavLink'

var MallNav = React.createClass({
	render: function() {
		if(!this.props.navList || !this.props.navList.length){return <i></i>}
		return (
			<nav className="g-nav g-top">
				<div className="m-nav f-flexbox" >
					{
						this.props.navList.map(function(v,i){
							return (
								<MallNavLink to={"/top/"+i} key={i} className="f-flex1 f-t">{v.name}</MallNavLink>
							)
						}.bind(this))
					}
				</div>
			</nav>
		);
	}
});

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
		if(GLOBAL.isRouter(this.props))	this.getData();
		myEvent.setCallback('updateTopList',this.getData);
	},
	componentDidUpdate: function() {
		if(GLOBAL.isRouter(this.props) &&!this.state.list)	  this.getData();
		if(!this.state.list || !this.state.list.length){return;}
		this.lazyloadImage(this.refs.container);
	},
	shouldComponentUpdate: function(nextProp,nextState){
		//console.log(this.props,nextProp)
		console.log(this.props.params,nextProp.params)
		return this.state.noMore !== nextState.noMore
				|| this.state.list !== nextState.list 
				|| this.props.children !== nextProp.children
				|| this.props.params.topId !== nextProp.params.topId;
	},
	render:function(){

		console.log(this.props.params.topId)

		var list, arr=[];
		if(!this.state.list){
			list = <Loading />
		}else{
			if(this.state.list.length){
				list = (
					<div className="g-main g-main-3">
						<div className="g-scroll" onScroll={this.scrollHandle} ref="container">
							<BookStore data={this.state.list}  order={this.props.params.topId}/>
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

		// var list;
		// if(!this.state.list){
		// 	list = <Loading />
		// }else{
		// 	if(this.state.list.length){
		// 		list = (
		// 			<div className="g-main g-main-3">
		// 				<div className="g-scroll" onScroll={this.scrollHandle} ref="container">
		// 					<Blocklist blockList={this.state.list} />
		// 				</div>
		// 			</div>
		// 			);
		// 	}else{
		// 		list = (<div className="g-main"><NoData /></div>);
		// 	}
		// }
		// if(this.state.onerror){
		// 	list = (<div className="g-main"><NoData type="UFO" /></div>);
		// }

		return (
			<div>
				<Header title="发现"  path={this.props.route} />
				<MallNav navList={this.state.list} />
				{list}
				{this.props.children}
			</div>
			);
	}
})
module.exports = Top;