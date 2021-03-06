import Ajax from '../modules/ajax';
import GLOBAL from '../modules/global';

var readConfig;
if (typeof window !== 'undefined') {
  readConfig = require('../modules/readConfig');
  // const POP = require('../modules/confirm');
}

// const goto_mlogin = function (options, callback) {
//   const hash = `${location.pathname}/m_login`;
//   browserHistory.push({ pathname: hash, state: options });
//       // POP._alert('请先登录');
//       // myEvent.setCallback('m_login', callback);
// };

const aUrl = 'https://readapi.imread.com';
 // aUrl = 'https://m.imread.com';
// aUrl = 'http://192.168.0.34:9090';
// aUrl = 'http://192.168.0.252:8080';


const BookContent = (function () {
	// 移动咪咕阅读
	// @source_id 1
  function getContent1(options) {
    const getContent = function (sourceConfigs) {
      var sourceConfig = sourceConfigs[`config-${options.source_id}`];

      const gotoMigu = function (_sourceConfig) {
        if (options.noCross) { return; } // 不要跳转

        // 跳转之前先回到书籍详情，不然会循环跳转
        let path = location.pathname;
        path = path.replace(/\/reading.*$/, '');
        GLOBAL.goBack(path);
        // 去掉referrer
        const meta = document.createElement('meta');
        meta.name = 'referrer';
        meta.content = 'no-referrer';
        document.getElementsByTagName('head')[0].appendChild(meta);
        setTimeout(() => {
          window.location = (_sourceConfig.cmcc_chapter_url.replace('$bid', options.bid).replace('$cid', options.cid)
            .replace('&vt=2', '&vt=3').replace('$cmcc_h5_charging', sourceConfig.cmcc_h5_charging));
        }, 200);
      };

      const url = `${aUrl}/api/v1/chapter/1/${options.book_id}/${options.cid}/index?cm=${sourceConfig.cm}`;
      new Ajax().getJSON('GET', url, {}, (res) => {
        if (res.success) {
          res.success.cm = sourceConfig.cm;
          if (res.success.loginSubmitUrl) {
            gotoMigu(sourceConfig);
          } else {
            options.callback(res, true);
          }
        }
      }, (err) => {
				// console.log(err);return;
        gotoMigu(sourceConfig);
      });
    };

    readConfig(getContent);
  }

	// function getContent1(options) {

	// 	var sourceConfig = ReadConfig['config-' + options.source_id];
	// 	var totalUrl = sourceConfig.source_host + sourceConfig.chapter_content;
	// 	var url = totalUrl.replace(/\?.*/, '')
	// 				      .replace('$bid', options.bid)
	// 				      .replace('$cid', options.cid);
	// 	var param = totalUrl.replace(/(.*\?)/, '')
	// 						.replace('$cm', sourceConfig.cm);
	// 	//TODO 错误直接在这里跳转到移动咪咕阅读，不需要传onError
	// 	new Ajax().getJSON('GET', '/api/crossDomain', {
	// 		url : url,
	// 		type: 'post',
	// 		param: param
	// 	}, options.callback, function() {
	// 		// if (true || confirm('该章节为移动付费章节，将跳转到移动咪咕阅读')) {
	// 			if(options.noCross){return} //不要跳转
	// 			//GLOBAL.goBack();
	// 			//去掉referrer
	// 			var meta = document.createElement('meta');
	// 			meta.name = "referrer";
	// 			meta.content = "no-referrer";
	// 			document.getElementsByTagName('head')[0].appendChild(meta);
	// 			window.location.href = (sourceConfig.cmcc_chapter_url.replace('$bid', options.bid).replace('$cid', options.cid).replace('&vt=2','&vt=3')
    //              .replace('$cmcc_h5_charging', sourceConfig.cmcc_h5_charging));
	// 		// } else {
	// 		// 	GLOBAL.goBack();
	// 		// }
	// 	});
	// }


	// 原文阅读
	// @source_id 2
  function getContent2(options) {
    const getContent = function (sourceConfigs) {
      var sourceConfig = sourceConfigs[`config-${options.source_id}`];
			// console.log(sourceConfig)
      let totalUrl;
      if (sourceConfig.source_host.indexOf('192.168.0') >= 0) {
        totalUrl = sourceConfig.source_host + sourceConfig.chapter_content;
      } else {
        totalUrl = sourceConfig.source_host.replace('http://', 'https://') + sourceConfig.chapter_content;
      }
			// var totalUrl = 'https://readapi.imread.com' + sourceConfig.chapter_content;

      const url = totalUrl.replace('/api/chapter', '/api/v1/chapter')
							.replace(/\?*/, '')
						      .replace('$bid', options.book_id)
						      .replace('$cid', options.cid)
						      .replace('$cm', sourceConfig.cm);
      new Ajax().getJSON('GET', url, {}, options.callback, options.onError);
    };
    readConfig(getContent);

		// var sourceConfig = ReadConfig()['config-' + options.source_id];
  }

	// 	//原文阅读
	// //@source_id 2
	// function getContent2(options) {

	// 	var sourceConfig = ReadConfig['config-' + options.source_id];
	// 	var totalUrl = sourceConfig.source_host + sourceConfig.chapter_content;
	// 	//var totalUrl = 'https://192.168.0.34:9090' + sourceConfig.chapter_content;
	// 	var url = totalUrl.replace('/api/chapter','/api/v1/chapter')
	// 					 .replace(/\?*/, '')
	// 				      .replace('$bid', options.book_id)
	// 				      .replace('$cid', options.cid)
	// 				      .replace('$cm', sourceConfig.cm);
	// 	new Ajax().getJSON('GET', url, {}, options.callback, options.onError);
	// }

	// 千马阅读
	// @source_id 3
  function getContent3(options) {
    getContent2(options);
  }

	// 咪咕阅读
	// @source_id 4
  function getContent4(options) {
    getContent2(options);
  }

  const api = {
    getContent1,
    getContent2,
    getContent3,
    getContent4
  };

	/*
	 *	@options.source_id string 数据来源
	 *	@options.bid string 书籍id
	 *	@options.cid string 章节id
	 *	@options.callback function  回调
	 *	@options.onError function 错误处理
	 */
  function get(options) {
    const getFunc = api[`getContent${options.source_id}`] || GLOBAL.noop;
    getFunc(options);
  }
  return {
    get
  };
}());

module.exports = BookContent;
