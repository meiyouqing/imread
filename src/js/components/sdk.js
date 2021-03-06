import React from 'react';
import Blocklist from './blocklist';

export default React.createClass({
  render() {
    let content;
    if (global.imdata.sdk) {
      global.imdata.sdk.contentlist = global.imdata.sdk.content; // 通过映射是数据字段统一
      delete global.imdata.sdk.content;
            // console.log(global.imdata.sdk)
      content = <Blocklist blockList={[global.imdata.sdk]} />;
    } else {
      content = (
        <div className="u-loading">
          <i>抱歉!没有找到相关数据..</i>
        </div>
            );
    }
    return (
      <div>
        {content}
      </div>
    );
  }
});
