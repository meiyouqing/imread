import {Route, IndexRoute, WithRoute, IndexRedirect, RouterContext} from 'react-router';
import App from './app'
import User from './user'
import Shelf from './shelf'
import Mall from './mall'
import SubMall from './subMall'
import Top from './top'
import Search from './search'
import List from './list'
import Login from './login'
import Register from './register'
import Introduce from './introduce'
import Balance from './balance'
import Recharge from './recharge'
import BookSheet from './bookSheet'
import Tag from './tag'
import RecentRead from './recentRead'
import ReadHistory from './readHistory'
import Feedback from './feedback'
import About from './about'
import Reading from './reading'
import Order from './order'
import Compact from './compact'

const mallLeaveHandle = function(){
	const n = AJAX.API._param['pages']? 'pages':'page';
	AJAX.API._param[n] = 1;
}
var loginWrap = (
	<Route path="login" component={Login}>
		<Route path="register" component={Register}/>
		<Route path="forget" component={Register}/>
	</Route>
	)
var readWrap = (
		<Route path="reading/:param" component={Reading}>
			<Route path="order" component={Order}>
				<Route path="balance" component={Balance} >
					<Route path="recharge/:param" component={Recharge} />
				</Route>
			</Route>
		</Route>
	)
var bookWrap = (
	<Route path="book/:param" component={Introduce}>
		{readWrap}
		{loginWrap}
	</Route>
	)
var searchWrap = (
	<Route path="search/:param" component={Search}>
		<Route path="searchList/:param" component={List}>
			{bookWrap}
		</Route>
		{bookWrap}
	</Route>
	)
module.exports = (
	<Route path="/" component={App}>
		<IndexRedirect to="/mall" />
		<Route path="/mall" component={Mall}>
			<Route path="/mall/:subnav" onLeave={mallLeaveHandle} component={SubMall}>
				<Route path="more/:param" component={List}>
					{bookWrap}
					{searchWrap}
				</Route>
				{bookWrap}
				{searchWrap}
				<Route path="cat/:param" component={List}>
					{bookWrap}
					{searchWrap}
				</Route>
			</Route>
		</Route>
		<Route path="/top" component={Top}>
			<Route path="more/:param" component={List}>
				{bookWrap}
				{searchWrap}
			</Route>
			<Route path="cat/:param" component={List}>
				{bookWrap}
				{searchWrap}
			</Route>
			<Route path="sheet/:param" component={BookSheet}>
				{bookWrap}
			</Route>
			{bookWrap}
			{searchWrap}
		</Route>
		<Route path="/user" component={User}>
			{loginWrap}
			<Route path="balance" component={Balance} >
				<Route path="recharge/:param" component={Recharge} />
			</Route>
			<Route path="recentRead" onLeave={mallLeaveHandle} component={RecentRead}>
				{readWrap}
			</Route>
			<Route path="myTags/:param" component={Tag}/>
			<Route path="readHistory" component={ReadHistory}/>
			<Route path="feedback" component={Feedback}/>
			<Route path="about" component={About}>
				<Route path="compact" component={Compact} />
			</Route>
		</Route>
		<Route path="/shelf" component={Shelf}>
			{loginWrap}
			{readWrap}
		</Route>
	</Route>

)