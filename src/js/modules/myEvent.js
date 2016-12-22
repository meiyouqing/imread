const myEvent = {
  callback: {},
  setCallback(page, func, params) {
    myEvent.callback[page] = {
      func,
      params
    };
  },
  execCallback(page, keep) {
    const data = myEvent.callback[page];
    if (data) {
      try {
        setTimeout(data.func.bind(null, data.params), 0);
      } catch (e) {
      }
      if (!keep) {
        myEvent.callback[page] = null;
      }
    }
  }
};

module.exports = myEvent;
