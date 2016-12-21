import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';
if (typeof window !== 'undefined') {
  var isHidden = require('./isHidden');
}

const config = {
  intercut: { method: 'GET', url: '/api/v1/intercut/log' },
  read: { method: 'POST', url: '/api/v1/upload/log' }
};


const uploadLog = {
  result: {},
  send(page, params) {
		// console.log(page,params)
    const id = params.intercut_id || params.content_id;
    if (config[page] && !isHidden()) {
      if (this.result[id]) {
        this.result[id].count++;
      } else {
        this.result[id] = params;
        this.result[id].count = 1;
      }
    }
  },
  sending(page) {
    if (Object.getOwnPropertyNames && Object.getOwnPropertyNames(this.result).length == 0) return;
    new Ajax().getJSON(config[page].method, config[page].url, this.result, GLOBAL.noop, GLOBAL.noop);
    this.result = {};
  },
  readlog(page, params) {
    new Ajax().getJSON(config[page].method, config[page].url, params, GLOBAL.noop, GLOBAL.noop);
  }
};

module.exports = uploadLog;
