import React from 'react';
import Header from './header';
import Loading from './loading';
import Ajax from '../modules/ajax';
import mixins from '../modules/mixins';
import parseQuery from '../modules/parseQuery';

if (typeof window !== 'undefined') {
  require('../../css/pay.css');
}
const Balance = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    return {
      html: null,
      loading: true
    };
  },
  componentDidMount() {
    this.search = parseQuery(location.search);
    this.getBalance();
  },
  shouldComponentUpdate(nextPros, nextState) {
    return nextState.html != this.state.html
		|| nextState.loading != this.state.loading;
  },
  getBalance() {
    const AJAX = new Ajax('alyPay');
    AJAX.go({
      productId: this.search.productId,
      payType: 4,
      callback: encodeURIComponent(this.search.callback)
    }, (data) => {
			// console.log(data)
      this.setState({ html: data });
      setTimeout(() => {
        document.forms[0].submit();
      }, 1000);
    }, null, { isText: true });
  },
  render() {
    const content = (<div dangerouslySetInnerHTML={{ __html: this.state.html }} />);

    return (
      <div className="gg-body">
        <Header right={false} left={this.state.back} title={'艾豆充值'} path={this.props.route} />
        <div className="g-main g-main-1">
          <div className="g-scroll m-balance">
            <Loading />
            {content}
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Balance;
