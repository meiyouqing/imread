import {Route, IndexRoute, IndexRedirect} from 'react-router';
import App from './app'
import User from './user'
import Shelf from './shelf'
import Mall from './mall'
import SubMall from './subMall'
import Top from './top'
import Search from './search'
import List from './list'
import Login from './login'

const mallLeaveHandle = function(){
	const n = AJAX.API._param['pages']? 'pages':'page';
	AJAX.API._param[n] = 1;
}

module.exports = (
	<Route path="/" component={App}>
	{
		//<IndexRoute onLeave={mallLeaveHandle} component={Mall}/>
		<IndexRedirect to="/mall" />
	}
		<Route path="/mall" component={Mall}>
			<Route path="/mall/:subnav" onLeave={mallLeaveHandle} component={SubMall}>
				<Route path="more/:param" component={List}/>
				
			</Route>
		</Route>
		<Route path="/top" component={Top}/>
		<Route path="/user" component={User}>
			<Route path="/user/login" component={Login}/>
		</Route>
		<Route path="/shelf" component={Shelf}/>
	</Route>

)