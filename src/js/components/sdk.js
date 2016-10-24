import Loading from './loading'
import parseQuery from '../modules/parseQuery'
import { browserHistory } from 'react-router'
import AJAX from '../modules/AJAX'
import React from 'react'
import Mixins from '../modules/mixins'
import Blocklist from './blocklist'

export default React.createClass({
	render:function(){
		return (
			<div className="g-wraper">
				{this.props.children}
			</div>
		);				
	}
});