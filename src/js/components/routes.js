import AJAX from '../modules/AJAX'
import React from 'react'
import IndexRoute from 'react-router/lib/IndexRoute'
import IndexRedirect from 'react-router/lib/IndexRedirect'
import Route from 'react-router/lib/Route'
import App from './app'
// import Shelf from './shelf' //TODO:load on demand
import Mall from './mall'
import SubMall from './subMall'
import Top from './top' //TODO:load on demand
import Search from './search'
import List from './list'
import Login from './login'
import Register from './register'
import Introduce from './introduce'
import Balance from './balance'
import Recharge from './recharge'
import RechargeResult from './recharge_result'
import BookSheet from './bookSheet'
import Tag from './tag'
import RecentRead from './recentRead'
import ReadHistory from './readHistory'
import Feedback from './feedback'
// import Reading from './reading' //TODO:load on demand
import Order from './order'
import Compact from './compact'
import Purchased from './purchased'
import Setting from './setting'
import Modifypwd from './modifypwd'
import StoreList from './storeList'
import UserInfo from './userInfo'
import EditUserame from './editUserame'
import SelfBuild from './selfbuild'
// import MLogin from './mLogin'
//import MRecharge from './mRecharge'
//import MBinder from './mBinder'
import WxLogin from './wxLogin'
import SDK from './sdk'
import AlyPay from './alyPay'

//按需加载的模块 Reading Shelf
function getReading(nextState, cb){
	require.ensure([], function(require){
		cb(null,require('./reading'))
	})
}
function getShelf(nextState, cb){
	require.ensure([], function(require){
		cb(null,require('./shelf'))
	})
}


var APImemory = {};
const scrollResetHandle = function(){
	if(!AJAX.API._param) return;
	const p = AJAX.API._param['pages']? 'pages':'page';
	AJAX.API._param[p] = 1;	
}

var loginWrap = (
	<Route path="login" component={Login}>
		<Route path="compact" component={Compact} />
		<Route path="register" component={Register}/>
		<Route path="forget" component={Register}/>
	</Route>
	)
var readWrap = (
		<Route path="reading/:readingId" getComponent={getReading}>
			{loginWrap}
			<Route path="balance" component={Balance} >
				<Route path="recharge/:rechargeId" component={Recharge} >
					<Route path="recharge_result" component={RechargeResult} />
				</Route>
			</Route>
		</Route>
	)
var bookWrap = (
	<Route path="book/:introduceId" component={Introduce}>
		<Route path="shelf" getComponent={getShelf}>
			<Route path="book/:introduceId" component={Introduce}>
				{readWrap}
			</Route>
			{loginWrap}
			{readWrap}
		</Route>
		{readWrap}
		{loginWrap}
	</Route>
	)
var searchWrap = (
	<Route path="search/:searchId" onLeave={scrollResetHandle} component={Search}>
		<Route path="searchList/:listId" onLeave={scrollResetHandle} component={List}>
			{bookWrap}
		</Route>
		{bookWrap}
	</Route>
	)

var topWrap = (
		<Route path="top/:topId" component={Top}>
			<Route path="myTags" component={Tag}/>
			<Route path="more/:listId" onLeave={scrollResetHandle} component={List}>
				{bookWrap}
				{searchWrap}
			</Route>
			<Route path="cat/:listId" onLeave={scrollResetHandle} component={List}>
				{bookWrap}
				{searchWrap}
			</Route>
			<Route path="sheet/:sheetId" onLeave={scrollResetHandle} component={BookSheet}>
				{loginWrap}
				{bookWrap}
				{searchWrap}
			</Route>
			<Route path="myTags" component={Tag}/>
			{loginWrap}
			{bookWrap}
			{searchWrap}
		</Route>
	)
var payWrap = (
		<Route path="pay" component={Balance} >
			<Route path="alyPay" component={AlyPay} />
			<Route path="recharge/:rechargeId" component={Recharge} >
				<Route path="recharge_result" component={RechargeResult} />
			</Route>
		</Route>
	)

var selfWrap = (
		<Route path="self/:selfId" component={SelfBuild}>
			<Route path="more/:listId" onLeave={scrollResetHandle} component={List}>
				{bookWrap}
				{searchWrap}
			</Route>
			<Route path="cat/:listId" onLeave={scrollResetHandle} component={List}>
				{bookWrap}
				{searchWrap}
			</Route>
			<Route path="sheet/:sheetId" onLeave={scrollResetHandle} component={BookSheet}>
				{loginWrap}
				{bookWrap}
				{searchWrap}
			</Route>
			{loginWrap}
			{bookWrap}
			{searchWrap}
		</Route>
	)

module.exports = (
	<Route path="/" component={App}>
		<IndexRedirect to="/mall" />
		<Route path="/wxlogin" component={WxLogin}/>
		<Route path="/sdk/:id" component={SDK}/>
		{loginWrap}
		{selfWrap}
		{payWrap}
		<Route path="/mall" component={Mall}>
			<Route path="/mall/:subnav" onLeave={scrollResetHandle} component={SubMall}>
				{selfWrap}

				<Route path="bookstore" component={StoreList} >
					{loginWrap}
					{topWrap}
					<Route path="sheet/:sheetId" onLeave={scrollResetHandle} component={BookSheet}>
						{loginWrap}
						{bookWrap}
						{searchWrap}
					</Route>
				</Route>

				<Route path="sheet/:sheetId" onLeave={scrollResetHandle} component={BookSheet}>
						{loginWrap}
						{bookWrap}
						{searchWrap}
				</Route>

				<Route path="userInfo" component={UserInfo}>
					<Route path="editUserame" component={EditUserame} />
					{loginWrap}
				</Route>

				{topWrap}

				<Route path="shelf" getComponent={getShelf}>
					{bookWrap}
					{loginWrap}
					{readWrap}
				</Route>

				{loginWrap}

				<Route path="balance" component={Balance} >
					<Route path="recharge/:rechargeId" component={Recharge} >
						<Route path="recharge_result" component={RechargeResult} />
					</Route>
				</Route>

				<Route path="recentRead" onLeave={scrollResetHandle} component={RecentRead}>
					{readWrap}
				</Route>
				<Route path="myTags" component={Tag}/>
				<Route path="purchased" component={Purchased}>
					{bookWrap}
				</Route>
				<Route path="readHistory" component={ReadHistory}/>
				<Route path="setting" component={Setting}>
					{loginWrap}
					<Route path="modifypwd" component={Modifypwd}>
						{loginWrap}
					</Route>
					<Route path="feedback" component={Feedback}/>
					<Route path="compact" component={Compact} />
				</Route>

				<Route path="more/:listId" onLeave={scrollResetHandle} component={List}>
					{bookWrap}
					{searchWrap}
				</Route>

				{bookWrap}
				{searchWrap}

				<Route path="cat/:listId" component={List}>
					{bookWrap}
					{searchWrap}
				</Route>
			</Route>
		</Route>		
	</Route>

)