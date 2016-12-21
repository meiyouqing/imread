import React from 'react';
import Ajax from '../modules/ajax';
import mixins from '../modules/mixins';
const Header = require('./header');
if (typeof window !== 'undefined') {
  require('../../css/pay.css');
}

const mRecharge = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    return {
      price: 5
    };
  },
  gotoRecharge(value) {
    new Ajax().getJSON('GET', '/api/v1/migu/rechange', { price: this.state.price }, (data) => {
      if (data.code === 200)				{
        window.location.href = data.success.url;
      } else				{
        POP._alert('获取信息失败');
      }
    });
  },
  componentDidMount() {
    this.refs.balance_list.onclick = function (e) {
      this.setState({ price: e.target.getAttribute('data-price') });
    }.bind(this);
  },
  render() {
    const price = [5, 10, 20, 50, 100, 200];
    return (
      <div className="gg-body">
        <Header right={null} title={'书券充值'} path={this.props.route} />
        <div className="g-main g-main-1">
          <div className="g-scroll m-mg-recharge">
            <ul className="pay-list f-clearfix f-mt-25" ref="balance_list">
              {
								price.map((v, i) => (<li className={`f-fl${this.state.price == v ? ' active' : ''}`} key={i}><span className="count" data-price={v}>¥&nbsp;&nbsp;{v}书券</span></li>))
							}
            </ul>
            <div className="u-userform">
              <a className="u-btn u-btn-full" onClick={this.gotoRecharge}>去充值</a>
            </div>
          </div>

        </div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = mRecharge;
