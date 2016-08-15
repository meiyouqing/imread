var Header = require('./header');
require('../../css/tag.css');

var tag = React.createClass({
	mixins: [Mixins()],
	getInitialState: function() {
		return {
			tagList: [],
			myTagList: [],
			needUpdate: 0
		};
	},
	getData: function() {
		var that = this;
		AJAX.init('listTag');
		AJAX.get(function(data) {
			that.setState({
				tagList: data.noChoice,
				myTagList: data.selected,
				needUpdate: that.state.needUpdate + 1
			});
		});
	},
	componentDidMount: function() {

		if(this.checkLogin(this.props.route))  this.getData();
	},
	toggleTag:function(index, from, to){
		to.push(from.splice(index, 1)[0]);
		this.setState({
			needUpdate: this.state.needUpdate + 1
		});
	},
	addTag: function(e) {
		var index = e.target.getAttribute('data-index');
		if (this.state.myTagList.length >= 10) {
			return POP.alert('最多选择10个标签');
		}
		AJAX.go('addTag', {
			id: this.state.tagList[index].category_id
		}, function() {
			this.toggleTag(index, this.state.tagList, this.state.myTagList);
		}.bind(this));
	},
	removeTag: function(e) {
		var index = e.target.getAttribute('data-index');
		AJAX.go('deleteTag', {
			id: this.state.myTagList[index].category_id
		}, function() {
			this.toggleTag(index, this.state.myTagList, this.state.tagList);
		}.bind(this));
	},
	componentWillUnmount:function(){
		myEvent.execCallback('configTag');
	},
	shouldComponentUpdate:function(nextPros, nextState){
		return this.state.needUpdate !== nextState.needUpdate;
	},
	render: function() {
		var tips;
		if (!this.state.myTagList.length) {
			tips = <span className="tips">选择您喜欢的标签</span>;
		}
		return (
			<div className="gg-body">
				<div className="tags-block">
					<Header right={false} path={this.props.route} page='tag'/>
					<div className="g-main g-main-1">
						<div  className="g-scroll">
							<div className="tag-block">
								<div className="title">我的标签</div>
								<div className="content f-clearfix">
									{tips}
									{
										this.state.myTagList.map(function(tag, i) {
											return (<span className="tag selected f-fl" key={i} onClick={this.removeTag} data-index={i}>{tag.category_name}</span>)
										}.bind(this))
									}
								</div>
							</div>
							<div className="tag-block">
								<div className="title">可选择的标签</div>
								<div className="content f-clearfix">
									{
										this.state.tagList.map(function(tag, i) {
											return (<span className="tag f-fl" key={i} onClick={this.addTag} data-index={i}>{tag.category_name}</span>)
										}.bind(this))
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = tag;