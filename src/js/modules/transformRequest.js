import GLOBAL from '../modules/global';
function getFormatRequest(obj, base, str) {
  if (GLOBAL.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (obj[i] && typeof obj[i] === 'object') {
        getFormatRequest(obj[i], `${base}[${i + 1}]`, str);
      } else {
        getFormatRequest(obj[i], `${base}[]`, str);
      }
    }
  } else if (obj && typeof obj === 'object') {
    for (const p in obj) {
      const _base = base ? `${base}[${p}]` : p;
      getFormatRequest(obj[p], _base, str);
    }
  } else {
    str.push(`${encodeURIComponent(base)}=${encodeURIComponent(obj || '')}`);
  }
}
const transformRequest = function (obj) {
  const str = [];
  getFormatRequest(obj, '', str);
  return str.join('&');
};

module.exports = transformRequest;
