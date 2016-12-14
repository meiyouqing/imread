import React from 'react'
import GLOBAL from '../modules/global'


var Favorite = React.createClass({
	getInitialState: function(){
		return{
			selected: 0,
			hide:false
		}
	},
	listId: [1,2,3,0],
	chooseFavor: function(i){
		this.id = this.listId[i];
		this.setState({selected: i})
	},
	gotoMall: function(){
		this.id = this.id || 1;
		GLOBAL.cookie('group_id',this.id,{expires: 1000});
		this.setState({hide:true});
        this.props.favoriteDone();
	},
	shouldComponentUpdate: function(nextProp,nextState){
		//console.log(this.props,nextProp)
		return this.state.selected !== nextState.selected
				|| this.state.hide !== nextState.hide;
	},
	render:function(){
		return (
                <div className={'gg-body'+(this.state.hide? ' fade-out':'')}>
                    <div className="m-welcome g-scroll">
                        <header>选择你的阅读偏好</header>
                        <ul>
                        {
                            [{title:'男生网文',img_src:'/src/img/back/man.png'},
                            {title:'女生网文',img_src:'/src/img/back/woman.png'},
                            {title:'出版图书',img_src:'/src/img/back/chuban.png'},
                            {title:'随便看看',img_src:'/src/img/back/suibian.png'}].map(function(v,i){
                                return (
                                    <li key={i}><div className={"selected"+(this.state.selected===i?' active':'')}><span className="iconfont icon-duihao"></span></div><img src={v.img_src} onClick={this.chooseFavor.bind(this,i)} className={'select-'+i} /><span>{v.title}</span></li>
                                    )
                            }.bind(this))
                        }
                        </ul>
                        <a className="u-btn-4" onClick={this.gotoMall}>立即体验</a>
                    </div>
                </div>
			)
	}
})
module.exports = Favorite;