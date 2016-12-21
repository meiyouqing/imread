import myEvent from '../modules/myEvent';
import Loading from './loading';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import React from 'react';
const Header = require('./header');

const Lister = React.createClass({
  toTimes(date) {
    date = `${date.substring(0, 4)}/${date.substring(4, 6)}/${date.substring(6, 8)} ${date.substring(8, 10)}:${date.substring(10, 12)}:${date.substring(12, 14)}`;
    date = new Date(date).getTime();
    return date;
  },
  prettyDate(date) {
    date = this.toTimes(date);
    const d = new Date(date);
    if (d.toString() === 'Invalid Date') return date;
    const current = new Date();
    const deltaSecond = (current.getTime() - date) / 1000;

    if (new Date(current.getTime() - 24 * 60 * 60 * 1000).Format('yyyyMd') == new Date(date).Format('yyyyMd')) {
      return '昨天';
    }
    if (deltaSecond < 15 * 60) {
      return '刚刚';
    }
    if (deltaSecond < 60 * 60) {
      return `${Math.floor(deltaSecond / 60)}分钟前`;
    }
    if (deltaSecond < 24 * 60 * 60) {
      return `${Math.floor(deltaSecond / 60 / 60)}小时前`;
    }
    return d.Format('yyyy-MM-dd');
  },
  render() {
    const f = (this.props.data.change_type == 1) ? '+' : '-';
    const plus = this.props.data.change_type == 1 ? 'plus' : '';
    return (

      <li>
        <div className="f-fl">
          <span className="d-title f-ellipsis">{this.props.data.remarks}</span>
          <span className="d-date">{this.prettyDate(this.props.data.create_time)}</span>
        </div>
        <div className="f-fr">
          <span className={`f-tr ${plus}${!this.props.data.invalid_time ? ' u-dis-sec' : ''}`}>{f + this.props.data.change_amount}</span>
          <span className={`d-lastdate${!this.props.data.invalid_time ? ' u-dis-none' : ''}`}>{`有效期截止${this.props.data.invalid_time}`}</span>
        </div>
      </li>
    );
  }
});

const RechageDetail = React.createClass({
  times: 0,
  mixins: [mixins()],
  scrollPagesNo: 1,
  getInitialState() {
    return {
      noMore: false,
      scrollUpdate: false,
      onerror: false,
      list: []
    };
  },
  getList() {
    const AJAX = new Ajax(`datails.${this.scrollPagesNo}`);
    AJAX.get((data) => {
      if (data.content.length < 1)	{
        this.setState({ noMore: true, scrollUpdate: false });
        return;
      }
      this.setState({
        list: this.state.scrollUpdate ? this.state.list.concat(data.content) : data.content,
        scrollUpdate: false
      });

      if (data.content.length < AJAX.param.contents) {
        this.setState({
          noMore: true
        });
      }
    }, this.onerror);
  },
  componentDidMount() {
    this.getList();
  },
  render() {
		 let sLoading = <Loading cls="u-sLoading transparent" />,
   list = null;

		 if (this.state.noMore) { sLoading = (<div className="u-none"> 没有更多了</div>); }

    return (
      <div>
        <Header right={null} title={'艾豆明细'} path={this.props.route} />
        <div className="g-main g-main-1">
          <div className="g-scroll m-recharge-detail" onScroll={this.scrollHandle} ref="container">
            <div className="content">
              <ul>
                {
							this.state.list.map((v, i) => <Lister key={i} data={v} />)
						}
              </ul>
              {sLoading}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RechageDetail;
