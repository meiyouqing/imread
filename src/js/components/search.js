import React from 'react';
import NoData from './noData';
import Loading from './loading';
import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';

const Header_s = require('./header_s');
const Blocklist = require('./blocklist');

const Search = React.createClass({
  mixins: [mixins()],
  getInitialState() {
    return {
      blockList: null,
      UFO: false
    };
  },
  getDate() {
    if (!this.isMounted()) return;
    const AJAX = new Ajax(this.props.params.searchId, true);

    AJAX.get(this.ajaxHandle, (error) => {
      this.setState({
        UFO: true
      });
				// console.log(error);
    });
  },
  ajaxHandle(data) {
    this.setState({
      blockList: data.blocklist
    });
  },
  componentWillMount() {
    this.usePreload(this.props.params.searchId);
  },
  componentDidMount() {
    if (GLOBAL.isRouter(this.props) && !this.state.blockList) this.getDate();
  },
  componentDidUpdate() {
    GLOBAL.isAd();
    if (GLOBAL.isRouter(this.props) && !this.state.blockList) this.getDate();
  },
  shouldComponentUpdate(nextPros, nextState) {
    return this.state.blockList !== nextState.blockList
				|| this.state.UFO !== nextState.UFO
				|| this.props.children !== nextPros.children;
  },
  render() {
    let content;
    if (this.state.blockList) {
      if (this.state.blockList.length) {
        content = <Blocklist blockList={this.state.blockList} />;
      } else {
        content = <NoData />;
      }
    } else {
			// if(GLOBAL.isRouter(this.props))	//兼容低端安卓
      content = <Loading />;
    }
    if (this.state.UFO) {
      content = <NoData type="UFO" />;
    }
    return (
      <div className="gg-body">
        <Header_s route={this.props.route} from="search" />
        <div className="g-main g-main-1">
          <div className="g-scroll">
            {content}
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Search;
