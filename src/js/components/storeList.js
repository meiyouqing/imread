var Img = require('./img');
var Book10 = require('./book10');
var Header = require('./header');

var StoreList = React.createClass({
	mixins: [Mixins()],
	getInitialState: function(){
		return{
			noMore:false,
			scrollUpdate:false,
			onerror:false,
			list:null,
			icon: false,
			right: < a className = "icon-s icon-recent-set f-fr" onClick = { this.troggle } > < /a>,
			left: <a className="f-fl icon-s icon-back" onClick={this.goBack} ></a>
		}
	},
	getList: function(bool){
		if(this.state.noMore == true) return;
		AJAX.get((data)=>{
			var list;
			if(!data || !data.success.length) {
				this.setState({
					noMore: true
				});
			}
				
			if(bool)
				list = data.success;
			else
				list = this.state.scrollUpdate? this.state.list.concat(data.success):data.success;
			this.setState({
				list: list,
				scrollUpdate: false
			});
		},this.onerror)
	},
	goBack: function(){
        this.goBackUrl(this.props.route);
    	},
	troggle: function() {
        var right = < button className = "f-fr textBtn" onClick = { this.compClick } > 完成 < /button>;
        this.setState({
            right: right,
            icon: true,
            left: null
        });
    	},
    	compClick: function(){
    	  var right = < a className = "icon-s icon-recent-set f-fr" onClick = { this.troggle } > < /a>;
    	  this.setState({
            right: right,
            icon: false,
            left: <a className="f-fl icon-s icon-back" onClick={this.goBack} ></a>
        });
    	},
    	deleteSheet: function(e){
    		var bid = e.target.getAttribute('data-bid');
        	if (!bid) {return; }
        	var that =  this;
	      var ui_callback = function() {
	            for (var i = 0; i < that.state.list.length; i++) {
	                if (that.state.list[i].sheet_id == bid) {
	                    that.state.list.splice(i, 1);
	                    that.setState({
	                        list: that.state.list
	                    });
	                    break;
	                }
	            }
	      }
	      AJAX.go('collectionDelete', {
	           sheet_id: bid
	      }, ui_callback);
    	},
    	scrollData: function(e){
		AJAX.init('bookstore');
		this.scrollHandle(e);
	},
	componentDidMount: function(){
		if(this.checkLogin(this.props.route)){
			AJAX.init('bookstore.1.6');
			if(GLOBAL.isRouter(this.props))	this.getList();
			myEvent.setCallback('updateTopList',this.getList);
		}
	},
	componentDidUpdate: function(nextProp) {
		if(GLOBAL.isRouter(this.props) &&!this.state.list)	{ 
			AJAX.init('bookstore.1.6');
			this.getList();
		};

		if(this.props.children !== nextProp.children){
			// AJAX.init('bookstore.1.6');
			// this.getList(true);
			this.compClick();
		}
		if(this.refs.container)
			this.lazyloadImage(this.refs.container);
		
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state.list !== nextProps.list
		|| this.props.children !== nextProps.children;
	},
	render: function() {
		var sLoading = <Loading cls='u-sLoading transparent' />,list=null;
		
		if(this.state.noMore)
			sLoading = null;

		if(!this.state.list)
			list = <Loading />
		else{
			if(this.state.list.length)
				list = (<div className="g-main g-main-1">
						<section className="m-block  g-scroll" onScroll={this.scrollData} ref="container">
							<div className="content">
								<ul className="f-clearfix">
								{
									this.state.list.map(function(v,i){
										return <Book10 key={i} data={v}  icon={this.state.icon} deleteWay= {this.deleteSheet} />
									}.bind(this))
								}
								</ul>
								{sLoading}
							</div>
						</section>
					</div>)
			else
				list = (<div className="g-main"><NoData type="emptyBookstore" /></div>);
		}

		if(this.state.onerror){
			list = (<div className="g-main"><NoData type="UFO" /></div>);
		}
			

		return (
			<div className="gg-body">
				<Header title="书单收藏" left={this.state.left} right={this.state.right}  path={this.props.route} />
				{list}
				{this.props.children}
			</div>
		)
	}
});

module.exports = StoreList;