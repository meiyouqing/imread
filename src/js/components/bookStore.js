import { Link } from 'react-router';
var Img = require('./img');
var Book10 = require('./book10');
var Block7 = require('./block7');
var Loading = require('./loading');
var Book7 = require('./book7_mallSubject');

var List = React.createClass({
	mixins: [Mixins()],
	getInitialState: function(){
		return{
			noMore:false,
			scrollUpdate:false,
			onerror:false,
			list:[]
		}
	},
	getList: function(){
		AJAX.get((data)=>{
			if(data.content.length<1)	{
				this.setState({noMore: true});
				return;
			}
			this.setState({
				list: this.state.scrollUpdate? this.state.list.concat(data.content):data.content,
				scrollUpdate: false
			});
		},this.onerror);
	},
	scrollData: function(e){
		AJAX.init('block');
		this.scrollHandle(e);
	},
	componentDidMount: function(){
		this.setState({list: this.props.data.contentlist});
		var pid = this.props.data.id;
		AJAX.init('block.'+pid+'.6.1');
	},
	componentDidUpdate: function(nextProp) {
		this.lazyloadImage(this.refs.contain);
	},
	render: function(){
		var sLoading = <Loading cls='u-sLoading transparent' />,list=null;
		
		if(this.state.noMore)
			sLoading = null;

		return (
			<section className="m-block  g-scroll" onScroll={this.scrollData} ref="contain">
				<div className="content">
					<ul className={"f-clearfix subCat-"+this.props.data.style}>
					{
						this.state.list.map(function(v,i){
						return <Book10 key={i} data={v} />
						})
					}
					</ul>
					{sLoading}
				</div>

			</section>
		)
	}

});

var Guess = React.createClass({
	render: function(){
		var list;
		if(!this.props.data.contentlist.length){
			list = <NoData type="emptyTag" />
		} else {
			list  = <Block7 bookList={this.props.data.contentlist} />;
		}
		return (
			<div className="g-scroll">
				{list}
			</div>
		)
	}
});

var Paihang = React.createClass({
	render: function(){

		return (
			<section className="m-block  g-scroll">
				<div className="content">
					<ul className={"f-clearfix subCat-"+this.props.data.style}>
					{
						this.props.data.contentlist.slice(0,this.props.data.contentlist.length-(this.props.data.contentlist.length%2)).map(function(v,i){
							return <Book7 key={i} data={v} style={this.props.data.style} />
						}.bind(this))
					}
					</ul>
				</div>
			</section>
		)
	}
});

var BookStore = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.props.data !== nextProps.data
		|| this.props.order !== nextProps.order;
	},
	render: function() {
		var blocks = this.props.data;
		blocks[this.props.order].display = true;
		var list;

		var sLoading = <Loading cls='u-sLoading' />;
		this.props.data.map(function(v,i){
			if(v.display){
				switch(v.style){
					case 14:
						list = <List data={v} />
						break;
					case 13:
						list = <Paihang data={v} />
						break;
					case 15: 
						list = <Guess data={v} />
						break;
					case 3: 
						list = <Guess data={v} />
						break;
				}
			}
		});
		blocks[this.props.order].display = false;

		return (
			<div>
				{list}
			</div>
		);
	}
});

module.exports = BookStore;