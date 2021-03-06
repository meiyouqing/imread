import Ajax from '../src/js/modules/ajax';
import getCookie from '../src/js/modules/get_cookie';

const getPost = function (req, callback, onError) {
  const url = req.url.replace(/\?.*$/, ''); // 移出微信有时自带字符
  global.cookie = getCookie(req.headers.cookie);
  global.pathname = url;
  global.imdata = {};
  global.query = req.query || {};
  console.log(`url>>>>>>>>>>>${url}`);
  const path = url.replace(/^\//, '').replace(/\/$/, '').split('/');
  let param = path[path.length - 1];

  // sdk
  if (/sdk\/sdk\.\d+/.test(url)) {
    console.log(`sdk param >>>>>>> ${param}`);
    const AJAX = new Ajax(param);
    AJAX.get((data) => {
      global.imdata.sdk = data;
      callback(true, param);
    }, (err) => { onError(err, true); });
    return;
  }
  if (/^(\/|\/mall|\/mall\/page.\d+)$/.test(url)) {
    // const match = req.headers.cookie && req.headers.cookie.match(/group_id=(\d)/);
    const configId = global.cookie.group_id || 1;
    console.log(`configId>>>>>>>>>>> ${configId}`);
    const AJAX = new Ajax(`group.1.${configId}`);
    AJAX.get((data) => {
      param = path.length === 2 ? param : `page.${data.pagelist[0].pgid}`;
      global.imdata.mallNav = data;
      if (path.length !== 2) global.pathname += `/${param}`;
      goRend();
    }, onError);
    return;
  } else if (/top\/block\.\d$/.test(url)) {
    const AJAX = new Ajax('group.6');
    AJAX.get((data) => {
      param = `page.${data.pagelist[0].pgid}.${data.pagelist[0].blocks}.1`;
      global.imdata.topNav = data;
      goRend();
    }, onError);
    return;
  }
  goRend();
  function goRend() {
    if (!/[.]/.test(param)) {
      callback();
      return;
    }
    console.log(`param>>>>>>>>>>: ${param}`);
    const n = param.replace(/\./g, '_');
    const AJAX = new Ajax(decodeURI(param));
    AJAX.get((data) => {
      global.imdata[n] = data;
      callback();
    }, onError);
  }
};

export default getPost;
