//var getJSON = require('./getJSON').getJSON;

var UBLOCK = {
	randomSort: function(a, b) {
		return Math.random() > 0.5 ? -1 : 1;
	},
	batchChange: function() {
		//不重新获取数据, 直接随机第一页
		/*
		getJSON('GET', '/api/category/content', {
			category_id: this.props.data.id,
			contents: 10,
			pages: this.state.pages + 1
		}, function(data) {
			if (data && data.length >= this.state.block_count) {
				this.setState({
					pages: this.state.pages + 1,
					contentlist: data
				});
			} else {
				alert('换一批，没有更多了');
			}
		}.bind(this));
		*/
		if (!this.state.contentlist) {return ;}
		this.setState({
			contentlist: this.state.contentlist.sort(UBLOCK.randomSort),
			needUpdate: this.state.needUpdate + 1
		});
	}
};

module.exports = UBLOCK;
