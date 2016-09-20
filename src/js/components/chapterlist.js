var myEvent = require('../modules/myEvent');

var Chapterlist = React.createClass({
	getCurrentChapterId: function(bid) {
		var currentChapterId = 0;
		var readLog = storage.get('readLogNew')[bid];
		if (readLog) {
			currentChapterId = readLog.current_chapterid;
		}
		return currentChapterId;
	},
	getInitialState: function() {
		return {
			needUpdate: 0,
			currentChapterId: this.props.currentChapterId || this.getCurrentChapterId(this.props.bid)
		};
	},
	handleClick: function(e) {
		var cid = e.target.getAttribute('data-cid') || e.target.parentNode.getAttribute('data-cid');		
		// var feeType = e.target.getAttribute('data-fee') || e.target.parentNode.getAttribute('data-fee');		
		var targetUrl = this.props.hrefBase + '/crossDomain.' + [this.props.source_bid, cid, this.props.bid, this.props.source_id].join('.');
		//if (this.props.fromReading) {
		var book = this.props.book?this.props.book : {};
		var route = {pathname:targetUrl,state:{author: book.author,book_name: book.book_name}};
		if(this.props.fromReading)
			browserHistory.replace(route);
		else
			browserHistory.push(route);
		// } else {
		// 	window.location.href = targetUrl;
		// }
	},
	componentDidMount: function () {
		var surfix = this.props.fromReading ? '-fromReading' : '';
		myEvent.setCallback('reading' + this.props.bid + surfix, function() {
			if (this.isMounted()) {
				this.setState({
					needUpdate: this.state.needUpdate + 1,
					currentChapterId: this.getCurrentChapterId(this.props.bid)
				});
			}
		}.bind(this));
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		// console.log(this.props.chapterlist,nextProps.chapterlist )
		return this.props.chapterlist !== nextProps.chapterlist 
				|| this.props.store !== nextProps.store 
				|| this.props.loading !== nextProps.loading
				|| this.props.currentChapterId !== nextProps.currentChapterId
				|| this.state.needUpdate !== nextState.needUpdate
				|| this.props.order !== nextProps.order;
	},
	render: function() {
		var loading, content;
		if (!this.props.chapterlist) {
			loading = <i className="u-sLoading">目录努力加载中...</i>
		} else {
			var sloading = this.props.loading ? " f-hide":"";
			content = (
				<ul className="chapterlist">
				{
					this.props.chapterlist.map(function(chapter, i) {
						var lock;
						// console.log(this.props.store,chapter.cid)
						var currentChapterId = this.props.currentChapterId || this.state.currentChapterId;
						if (chapter.feeType != '0' && (this.props.store.indexOf(chapter.cid)<0)) {
							lock = <span className="icon-n icon-lock f-fr"></span>;
						}
						return (
							<li key={i} className={"chapter f-clearfix" + (chapter.cid == currentChapterId ? ' current' : '')} onClick={this.handleClick} data-cid={chapter.cid} data-fee={chapter.feeType}>
								{lock}
								<span className={"name f-ellipsis" + (lock ?' lock':'')}>{chapter.chapterName}</span>
							</li>
						);
					}.bind(this))
				}
					{/*<li className={"u-sLoading" + sloading }>努力加载中...</li>*/}
					 <Loading cls={"u-sLoading" + sloading } />
				</ul>
			);
		}
		return (
			<div>
				{loading}
				{content}
			</div>
		);
	}
});

module.exports  = Chapterlist;