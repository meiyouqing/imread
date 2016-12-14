export const loadingHTML = '';
// export const loadingHTML = `
//     <style type="text/css">
//         .blueGreen{color: #41c2c2;}
//         h1,h2{font-weight: normal;}
//         .preload-page{font:12px/1.8 verdana,\5FAE\8F6F\96C5\9ED1,sans-serif;color: #333;outline:0;}
//         .preload-page .title{margin: 15px auto 0; text-align: center; font-size: 14px; letter-spacing: .8em;margin-right: -0.8em;}
//         .preload-page .title i{display: inline-block;font-style: normal;-webkit-animation:desc .5s ease 0s infinite alternate;-moz-animation:desc .5s ease 0s infinite alternate;animation:desc .5s ease 0s infinite alternate;}
//         .preload-page .title .le1{-webkit-animation-delay:.1s;-moz-animation-delay:.1s;animation-delay:.1s;}.preload-page .title .le2{-webkit-animation-delay:.2s;-moz-animation-delay:.2s;animation-delay:.2s;}.preload-page .title .le3{-webkit-animation-delay:.3s;-moz-animation-delay:.3s;animation-delay:.3s;}
//         .preload-page .title .le4{-webkit-animation-delay:.4s;-moz-animation-delay:.4s;animation-delay:.4s;}.preload-page .title .le5{-webkit-animation-delay:.5s;-moz-animation-delay:.5s;animation-delay:.5s;}.preload-page .title .le6{-webkit-animation-delay:.6s;-moz-animation-delay:.6s;animation-delay:.6s;}
//         @-webkit-keyframes desc{0%{-webkit-transform:translate(0,0);} 100%{-webkit-transform:translate(0,6px);} }@-moz-keyframes desc{0%{-moz-transform:translate(0,0);} 100%{-moz-transform:translate(0,6px);} }@keyframes desc{0%{transform:translate(0,0);} 100%{transform:translate(0,6px);} }
//         .imreadLogo{position: relative;display: block; width: 72px; height: 72px; margin: 50% auto 0 auto; }
//         .imreadLogo img{width: 100%; height: auto;}
//     </style>
//     <div class="preload-page">
//         <h2 class="title blueGreen"><i class="le1">发</i><i class="le2">现</i><i class="le3">阅</i><i class="le4">读</i><i class="le5">之</i><i class="le6">美</i></h2>          
//     </div>    
// `

export const renderFullPage = (html, preloadedState) => {
  return `
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
            (function () {   
                var ua = window.navigator.userAgent.toLowerCase(), code;
                if(/micromessenger/.test(ua)) {
                    /code=[^\&]+/.test(location.search) && localStorage.setItem('timestamp', Date.now());
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
    `
}