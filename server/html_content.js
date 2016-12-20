export const loadingHTML = '';

export const renderFullPage = (html, preloadedState) => `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta name="keywords" content="小说,小说网,言情小说,玄幻小说,武侠小说,都市小说,历史小说,网络小说,原创网络文学,出版书,正版小说,正版电子小说,艾美阅读,免费小说,好看的小说,小说下载,免费小说下载,下载,艾美阅读手机站" />
        <meta name="description" content="小说在线阅读、下载，精彩小说尽在艾美阅读。艾美阅读提供小说，小说网，言情小说，玄幻小说，武侠小说，都市小说，历史小说，出版书，正版小说，正版电子小说，网络小说，原创网络文学。" />
        <title>艾美阅读-发现阅读之美</title>
        <link href="/p/style.css" rel="stylesheet" type="text/css"></link>
        <link href="//at.alicdn.com/t/font_jrt8u12z1rod2t9.css" rel="stylesheet" type="text/css"></link>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/src/img/weblogo.png" />
        <script>
            if(location.protocol === 'http:'){
              location = location.href.replace('http:','https:')
            }
            (function () {   
                var ua = window.navigator.userAgent.toLowerCase(), code;
                if(/micromessenger/.test(ua)) {
                    /code=[^&]+/.test(location.search) && localStorage.setItem('timestamp', Date.now());
                    if(Date.now() - localStorage.getItem('timestamp') < 30000) return;
                    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc4b3ed2404d2139f&redirect_uri='+encodeURIComponent(location.origin+'/wxlogin?callback='+encodeURIComponent(location.href))+'&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect';
                }
            })()
        </script>
      </head>
      <body>
        <div id="appContainer">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
        </script>
        <script src="/p/bundle1.js"></script>
      </body>
    </html>
    `;
