const storage = {
  getDefaultRet(type) {
    switch (type) {
      case 'object':
        return {};
      case 'array':
        return [];
      default:
        return '';
    }
  },
  get(item, type) {
    type = type || 'object';
    let ret;
    try {
      ret = localStorage.getItem(item) || '';
      if (type != 'string') {
        ret = JSON.parse(ret);
      }
    } catch (e) {
      ret = storage.getDefaultRet(type);
    }
    return ret;
  },
  set(item, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    try {
      localStorage.setItem(item, value);
    } catch (e) {
      return false;
    }
    return true;
  },
  rm(item) {
    if (localStorage.getItem(item)) {
      localStorage.removeItem(item);
      return true;
    }
    return false;
  }
};

module.exports = storage;
