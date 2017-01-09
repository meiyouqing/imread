const parseQuery = function (search) {
  const separator = '&';
  const params = {};
  if (search.length < 2) return params;
  search.replace(/^\?/, '').split(separator).map((param) => {
    const pair = param.split('=');
    const key = pair.shift() || '';
    const value = decodeURIComponent(param.substr(key.length + 1) || '');
    if (key) {
      params[key] = value;
    }
    return true;
  });

  return params;
};

module.exports = parseQuery;
