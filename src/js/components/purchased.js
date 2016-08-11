var Header = require('./header');
var Mixins = require('../modules/mixins');
var Book1 = require('./book1');
var Hammer = require('../modules/hammer');
var NoData = require('./noData');


var Purchased = React.createClass({
	mixins: [Mixins()],
	getInitialState: function () {
		return {
			list: null,
			scrollUpdate: false,
			noMore: false
		}
	},
	componentDidMount: function() {
		if(this.checkLogin(this.props.route)){
			if(GLOBAL.isRouter(this.props)) this.getList();
			this.lazyloadImage(this.refs.container);
		}
	},
	getList: function(scrollUpdate) {
		if (this.isLogin()) {
			var that = this;
			that.setState({
				scrollUpdate: true
			});
			AJAX.init(this.props.route.path);
			if(scrollUpdate){
				var n = AJAX.API._param['pages']? 'pages':'page';
				AJAX.API._param[n]++;			
			}

			AJAX.get(function(data) {
				if (data.content.length < 10) {
					that.setState({
						noMore: true,
						scrollUpdate: false
					});
				}
				if (that.state.list) {
					data.content = that.state.list.concat(data.content);
				}
				that.setState({
					list: data.content
				});
			});
		} else {
			var readLog = storage.get('readLogNew');
			var list = [];
			for (var n in readLog) {
				list.push(readLog[n]);
			}
			list.sort(function(a, b) {
				return a.recent_time < b.recent_time ? 1 : -1;
			});
			this.setState({
				list: list,
				noMore: true
			});
		}
	},
	componentDidUpdate: function() {
		if(GLOBAL.isRouter(this.props) && !this.state.list) {this.getList();}
		this.lazyloadImage(this.refs.container);
	},
	shouldComponentUpdate: function(nextProp, nextState) {
		return this.state.list !== nextState.list
				|| this.props.children !== nextProp.children;
	},
	render: function() {
		var content;
		if (!this.state.list) {
			content = <Loading />
		} else if (this.state.list.length){
			content = (
				<ul className="content">
				{
					this.state.list.map(function(book, i) {
						return <Book1 data={book} key={i} />
					})
				}
				</ul>
			);
		} else {
			content = <NoData type="emptyPur" />
		}
		return (
			<div className="gg-body">
				<div className="recentRead-block">
					<Header right={false} title={'已购书籍'} path={this.props.route}/>
					<div className="g-main g-main-1">
						<div  className="g-scroll m-block purchase" ref="container" onScroll={this.scrollHandle}>
							{content}
						</div>
					</div>
				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports = Purchased;