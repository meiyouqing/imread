var Header = require('./header');
var Mixins = require('../modules/mixins');
var Book9 = require('./book9_recentRead');
var Hammer = require('../modules/hammer');
var NoData = require('./noData');

require('../../css/recentRead.css');

var recentRead = React.createClass({
	mixins: [Mixins()],
	getInitialState: function () {
		return {
			list: null,
			scrollUpdate: false,
			noMore: false
		}
	},

	componentDidMount: function() {
		this.getList();
		this.lazyloadImage(this.refs.container);
		var that = this;
		var hammertime = new Hammer(this.refs.container);
		hammertime.on('press', function(e) {
			var bid = e.target.getAttribute('data-bid');
			if (!bid) {return ;}
			POP._confirm('删除记录',confirm_c,null,e.target.getBoundingClientRect().top + e.target.offsetHeight / 2);
		 	function confirm_c() {	
				var ui_callback = function() {
					for (var i = 0; i < that.state.list.length; i++) {
						if (that.state.list[i].content_id == bid) {
							that.state.list.splice(i, 1);
							that.setState({
								list: that.state.list
							});
							break;
						}
					}
				}
				if (that.isLogin()) {
					AJAX.go('deleteRecentRead', {
						book_id: bid
					}, ui_callback);
				} else {
					var readLog = storage.get('readLogNew');
					for (var content_id in readLog) {
						if (content_id == bid) {
							delete readLog[content_id];
						}
					}
					storage.set('readLogNew', readLog);
					ui_callback();
				}
			}
		}).on('tap', function(e) {
			var href = e.target.getAttribute('data-href');
			if (!href) {return ;}
			 browserHistory.push(href);
		});
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
		this.lazyloadImage(this.refs.container);
	},
	render: function() {
		var content;
		if (!this.state.list) {
			content = <Loading />
		} else if (this.state.list.length){
			content = (
				<ul>
				{
					this.state.list.map(function(book, i) {
						return <Book9 book={book} key={i} />
					})
				}
				</ul>
			);
		} else {
			content = <NoData type="recentRead" />
		}
		return (
			<div className="gg-body">
				<div className="recentRead-block">
					<Header right={false} title={'最近阅读'}/>
					<div className="g-main g-main-1">
						<div  className="g-scroll" ref="container" onScroll={this.scrollHandle}>
							{content}
						</div>
					</div>
				</div>
				{this.props.children}
			</div>
		);
	}
});

module.exports = recentRead;