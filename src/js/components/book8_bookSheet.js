import React from 'react';
import Link from 'react-router/lib/Link';
import GLOBAL from '../modules/global';
import Img from './img';

const BookSheet = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data;
  },
  render() {
    const hrefStr = GLOBAL.typeHref(this.props.data);
		// var m_time = this.props.data.modify_time.substr(0,4)+'.'+this.props.data.modify_time.substr(4,2)+'.'+this.props.data.modify_time.substr(6,2);
    return (
      <li className="f-bb-eee">
        <Link className="f-pr" to={hrefStr}>
          <div className="bsCover f-pa f-br-6">
            <Img src={this.props.data.image_url} />
          </div>
          <div className="bsInfo">
            <div className="f-clearfix">
              <span className="f-fl bsName f-ellipsis-2" style={{ color: this.props.data.title_color }}>{this.props.data.name}</span>
              <span className="f-fr bsCount">共计{this.props.data.count}本</span>
            </div>
            <p className="f-tr f-fc-777">收藏数<span className="bsfCount">{this.props.data.collect_uv}</span>更新于{this.props.data.update_time}</p>
          </div>
        </Link>
      </li>
    );
  }
});

module.exports = BookSheet;
