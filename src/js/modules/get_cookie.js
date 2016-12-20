
export default function (cookies, key) {
  const cookiesArr = cookies ? cookies.split('; ') : [];
  let result = key ? undefined : {};
  for (let i = 0, l = cookiesArr.length; i < l; i++) {
    const parts = cookiesArr[i].split('=');
    const name = decodeURI(parts[0]);
    const cookie = decodeURI(parts[1]);
    if (key && key === name) {
      result = cookie;
      break;
    } else if (!key) {
      result[name] = cookie;
    }
  }
  return result;
}
