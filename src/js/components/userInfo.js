import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import storage from '../modules/storage';
import Loading from './loading';
import Header from './header';

var POP;
if (typeof window !== 'undefined') {
  POP = require('../modules/confirm');
}
if (typeof window !== 'undefined') {
  require('../../css/userinfo.css');
}
const UserInfo = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    const data = this.props.location.state.data;
    return {
      user: data,
      user_birthday: data.user_birthday || '请设置生日',
      user_name: data.user_name || data.mobile_num,
      portraitUrl: data.portraitUrl,
      user_gender: this.switchSex(data.user_gender),
      right: <span onClick={this.changeEdit} className="iconfont icon-bianji f-fr" />,
      isEdit: false,
      finishButton: true,
      access: <span className="icon-h icon-return-black" />,
      sex: false,
      sexId: 0,
      formdata: null
    };
  },
  logout(e) {
    e.preventDefault && (e.preventDefault());
		// goback path
    let path = location.pathname.split('/');
    path.pop();
    path = path.join('/');

    POP.confirm('确定退出登录?', () => {
      const AJAX = new Ajax('loginout');
      AJAX.get((res) => {
        storage.rm('userToken');
        GLOBAL.removeCookie('token', '/', '.imread.com');
        this.disPatch('updateUser');
				// if(GLOBAL.cookie('loadingType') === 'qq' && typeof QC !== 'undefined') {
				// 	GLOBAL.removeCookie('loadingType','/');
				// 	QC.Login.signOut();
				// }
				// console && console.log(path)
        GLOBAL.goBack(path);
      });
    });
  },
  changeEdit() {
    const right = <span onClick={this.finishEdit} className="iconfont icon-duihao f-fr" />;
    const access = <span className="icon-h icon-return-black show" />;
    GLOBAL.addClass(this.refs.header, 'show');// 兼容部分安卓机不能触发click()
    GLOBAL.addClass(this.refs.date, 'show');
    this.setState({ right, isEdit: true, finishButton: false, access });
  },
  finishEdit() {
    const right = <span onClick={this.changeEdit} className="iconfont icon-bianji f-fr" />;
    const access = <span className="icon-h icon-return-black" />;
    GLOBAL.removeClass(this.refs.header, 'show');
    GLOBAL.removeClass(this.refs.date, 'show');
    const pramas = {
      user_gender: this.state.sexId,
      user_birthday: this.refs.date.value.replace(/-/g, ''),
      user_name: this.state.user_name
    };

    const AJAX = new Ajax('edituser');
    AJAX.go(pramas, (res) => {
      if (res.code === 200) {
				// this.getData();
        this.disPatch('updateUser');
        POP._alert('修改成功');
      } else if (typeof res.error === 'string')					{ POP._alert(res.error); } else 					{
        for (const key in res.error[0]) {
          POP._alert(res.error[0][key]);
        }
      }
    });
    this.setState({ right, isEdit: false, finishButton: true, access });
  },
  selectHeader() {
    if (!this.state.isEdit) return;
		// this.refs.header.click();
    this.refs.header.onchange = function (e) {
      const file = this.refs.header.files[0];

      try {
        this.setState({ portraitUrl: window.URL.createObjectURL(file) });
      } catch (err) {
        this.setState({ portraitUrl: window.webkitURL.createObjectURL(file) });
      }

      const formdata = new FormData();
      formdata.append('file', file);
      this.setState({ formdata });

      const AJAX = new Ajax('upload');
      AJAX.go({ formdata }, (res) => {
        if (res.code !== 200)					{
          POP._alert(JSON.stringify(res));
        } else					{ POP._alert('头像上传成功'); }
      });
    }.bind(this);
  },
  selectDate() {
    if (!this.state.isEdit || GLOBAL.isAndroid()) return;
    this.refs.date.focus();
  },
  updateBirthday() {
    this.setState({ user_birthday: this.refs.date.value || '请设置生日' });
  },
  forAndroid(e) {
    if (!GLOBAL.isAndroid() || !this.refs.date) return;
    clearInterval(this.time);
    this.time = setInterval(() => {
			// console.log(this.refs.date.value)
      if (this.state.user_birthday !== this.refs.date.value) {
        this.setState({ user_birthday: this.refs.date.value || '请设置生日' });
        clearInterval(this.time);
      }
    }, 500);
  },
  selectSex() {
    if (!this.state.isEdit) return;
    this.setState({ sex: true });
  },
  selectedSex(e) {
    const a = e.target.getAttribute('data-index');
    this.setState({
      user_gender: this.switchSex(a),
      sexId: a
    });
    this.closeSex();
  },
  closeSex() {
    this.setState({ sex: false });
  },
  gotoEditname() {
    if (!this.state.isEdit) return;
    browserHistory.push({ pathname: GLOBAL.setHref('editUserame'), state: { username: this.state.user_name } });
  },
	// getData: function() {
	// 	const AJAX = new Ajax('me');
	// 	AJAX.get(function(data) {
	// 		console.log('ooooooooooooo')
	// 		this.switchSex(data.user_gender);
	// 		this.setState({
	// 			user:data,
	// 			user_birthday: data.user_birthday || '请设置生日',
	// 			user_name: data.user_name || data.mobile_num,
	// 			portraitUrl: data.portraitUrl
	// 		});
	// 	}.bind(this));
	// },
  switchSex(index) {
    let user_gender;
    switch (index) {
      case '1':
        user_gender = '男生';
        break;
      case '2' :
        user_gender = '女生';
        break;
      default:
        user_gender = '保密';
    }
    return user_gender;
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.state)			{
      this.setState({ user_name: nextProps.location.state.user_name });
    }
  },
  componentDidMount() {
    this.checkLogin(this.props.route);
  },
	// componentDidUpdate:function(){
	// 	if(this.refs.date)
	// 		this.refs.date.oninput = function(){
	// 			//this.setState({user_birthday: this.refs.date.value})
	// 		}.bind(this);
	// },
  render() {
    let list;
    if (!this.state.user) { list = <Loading />; } else			{
      list = (<div className="g-main g-main-1 m-userinfo">
        <section className="m-user-header" onClick={this.selectHeader} >
          <input type="file" className="user-header" ref="header" accept="image/*;capture=camera" />
          <span>头像</span>
          {this.state.access}
          <img src={this.state.portraitUrl || '/src/img/icons/ic_avatar@2x.png'} />
        </section>
        <section className="m-user-detail">
          <ul>
            <li onClick={this.gotoEditname}><span>昵称</span>{this.state.access}<span>{this.state.user_name || this.state.user.user_name || this.state.user.mobile_num}</span></li>
            <li onClick={this.selectSex}><span>性别</span>{this.state.access}<span>{this.state.user_gender}</span></li>
            <li onClick={this.selectDate}><span>生日</span>{this.state.access}<span>{this.state.user_birthday}</span></li>
          </ul>
          <input onChange={this.updateBirthday} onBlur={this.updateBirthday} onInput={this.updateBirthday} type="date" ref="date" id="dater" className={`dateInput${GLOBAL.isAndroid() ? ' position' : ''}`} />
        </section>

        <section className="m-user-b" style={{ display: this.state.finishButton ? 'block' : 'none' }}>
          <a className={`u-btn u-btn-full${this.isWx() ? ' f-hide' : ''}`} onClick={this.logout}>退出登录</a>
        </section>

      </div>);
    }

    return (
      <div className="gg-body">
        <Header title={'个人资料'} right={this.state.right} path={this.props.route} />
        {list}
        <section>
          <div className={`m-wrapper${this.state.sex ? ' show' : ''}`} />
          <div className={`UI_selecter${this.state.sex ? ' show' : ''}`} onClick={this.selectedSex}>
            <ul>
              <li data-index="1" >男生</li>
              <li data-index="2" >女生</li>
              <li data-index="0" >保密</li>
            </ul>
            <button onClick={this.closeSex} className="UI-cancel">取消</button>
          </div>
        </section>
        {this.props.children}
      </div>
    );
  }
});

module.exports = UserInfo;
