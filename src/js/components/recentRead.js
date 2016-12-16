import storage from '../modules/storage'
import Ajax from '../modules/AJAX'
import GLOBAL from '../modules/global'
import Mixins from '../modules/mixins'
import React from 'react'
import Loading from './loading'
var Header = require('./header');
var Book9 = require('./book9_recentRead');
var NoData = require('./noData');

if(typeof window !== 'undefined'){
	require('../../css/recentRead.css');
}
if(typeof window !== 'undefined'){
	var POP = require('../modules/confirm')
}

var recentRead = React.createClass({
    mixins: [Mixins()],
    getInitialState: function() {
        return {
            list: null,
            scrollUpdate: false,
            noMore: false,
            icon: null,
            right: null,
            left: <a className="f-fl iconfont icon-left" onClick={this.goBack} ></a>
        }
    },
    goBack: function(){
        this.goBackUrl(this.props.route);
    },
    troggle: function() {
        var right = <button className = "f-fr textBtn" onClick = { this.compClick } > 完成 </button>;
        this.setState({
            right: right,
            icon: true,
            left: null
        });
    },
    compClick: function(){
    	var right = <a className = "f-fr iconfont icon-shezhi-1" onClick = { this.troggle } > </a>;
    	this.setState({
            right: right,
            icon: false,
            left: <a className="f-fl iconfont icon-left" onClick={this.goBack} ></a>
       });
    },
    componentDidMount: function() {
        this.getList();
        this.lazyloadImage(this.refs.container);
    },
    getList: function(scrollUpdate) {
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
            right:list.length? <a className = "f-fr iconfont icon-shezhi-1" onClick = { this.troggle } > </a>:null,
            noMore: true
        });
    },
    componentDidUpdate: function() {
        this.lazyloadImage(this.refs.container);
    },
    deleteBook: function(e) {
        var bid = e.target.getAttribute('data-bid');
        if (!bid) {return; }
        var that =  this;
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
            if(!that.state.list.length){
                that.setState({
                    right:null,
                    left:<a className="f-fl iconfont icon-left" onClick={that.goBack} ></a>
                });  
                return;              
            }

        };

         var readLog = storage.get('readLogNew');
            for (var content_id in readLog) {
                if (content_id == bid) {
                    delete readLog[content_id];
                }
            }
            storage.set('readLogNew', readLog);
            ui_callback();
},
render: function() {
    var content;

    if (!this.state.list) {
        if(GLOBAL.isRouter(this.props))
            content = <Loading />
    } else if (this.state.list.length) {
        content = ( <ul> {
            this.state.list.map(function(book, i) {
                return <Book9 book = { book }
                key = { i }
                icon = { this.state.icon }
                deleteWay = { this.deleteBook }/>
            }.bind(this))
        } </ul>);
    } else {
        content = <NoData type = "recentRead" />
    }


    return ( <div className = "gg-body" >
        <div className = "recentRead-block" >
        	<Header right = { this.state.right } left={this.state.left} title = { '最近阅读' } path = { this.props.route }/> 
        	<div className = "g-main g-main-1" >
        		<div className = "g-scroll" ref = "container" onScroll = { this.scrollHandle } > { content } </div> 
        	</div> 
       </div> 
       { this.props.children } 
       </div>
    );
}
});

module.exports = recentRead;