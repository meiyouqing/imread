import myEvent from '../modules/myEvent'
import Loading from './loading'
import AJAX from '../modules/AJAX'
import GLOBAL from '../modules/global'
import Mixins from '../modules/mixins'
import React from 'react'
var Header = require('./header');

var Lister =  React.createClass({
	toTimes: function(date){
		date = date.substring(0,4)+'/'+date.substring(4,6)+'/'+date.substring(6,8) +' '+date.substring(8,10)+':'+date.substring(10,12)+':'+date.substring(12,14);
		date = new Date(date).getTime();
		return date;
	},
	prettyDate: function(date) {
		date = this.toTimes(date);
		var d = new Date(date);
		if(d.toString() === "Invalid Date") return date;
		var current = new Date();
		var deltaSecond = (current.getTime() - date) / 1000;

		if (new Date(current.getTime() - 24 * 60 * 60 * 1000).Format('yyyyMd') == new Date(date).Format('yyyyMd')) {
			return '昨天';
		}
		if (deltaSecond < 15 * 60) {
			return '刚刚';
		}
		if (deltaSecond < 60 * 60) {
			return Math.floor(deltaSecond / 60) + '分钟前';
		}
		if (deltaSecond < 24 * 60 * 60) {
			return Math.floor(deltaSecond / 60 / 60) + '小时前';
		}
		return d.Format('yyyy-MM-dd');
	},
	render: function(){
		var f = (this.props.data.change_type==1)?'+':'-';
		return (
			
			<li>
				<div className="f-fl">
					<span>{this.props.data.remarks}</span>
					<span>{this.prettyDate(this.props.data.create_time)}</span>
				</div>
				<div className = "f-fr">
					<span className={!this.props.data.invalid_time?"u-dis-sec":''}>{f+this.props.data.change_amount}</span>
					<span className={!this.props.data.invalid_time?"u-dis-none":''}>{this.props.data.invalid_time}</span>
				</div>
			</li>
		)
	}
});

var RechageDetail = React.createClass({
	times: 0,
	mixins: [Mixins()],
	getInitialState: function() {
		return {
			noMore:false,
			scrollUpdate:false,
			onerror:false,
			list:[]
		};
	},
	getList: function(){

		AJAX.get(function(data){

			if(data.content.length<1)	{
				this.setState({noMore: true});
				return;
			}
			this.setState({
				list: this.state.scrollUpdate? this.state.list.concat(data.content):data.content,
				scrollUpdate: false
			});
		}.bind(this),this.onerror)
	},
	scrollData: function(e){
		this.scrollHandle(e);
	},
	componentDidMount: function(){
		AJAX.init('datails.1.20');
		this.getList();
		this.disPatch('scroll',this.refs.container);
	},
	render: function() {
		 var sLoading = <Loading cls='u-sLoading transparent' />,list=null;

		 if(this.state.noMore)
			sLoading = (<div className="u-none"> --没有更多了-- </div>);

		return (
			<div>
				<Header right={null} title={'艾豆明细'} path={this.props.route}/>
				<div className="g-main g-main-1 g-f">
					<div className="g-scroll m-recharge-detail" onScroll={this.scrollData} ref="container">
						<div className="content">
						<ul>
						{
							this.state.list.map(function(v,i){
							return <Lister key={i} data={v} />
							})
						}
						</ul>
						{sLoading}
					</div>
					</div>
				</div>
			</div>
				)
	}
});

module.exports  = RechageDetail;