#艾美阅读web sdk接入说明
##引入sdk
```html
<script src="http：//192.168.0.251：8080/src/js/imreadsdk.js"></script>
```
##在页面尾部调用方法_open_imread_SDK_
    ```javascript
        _open_imread_SDK_(type [,container])
    ```
###参数说明
    ####type
        Number 表示sdk的风格类型
    ####container【可选】
        String 要插入sdk的容器id,如果不传入此参数，默认容器将会是document.body。插入的方法是append，也就是插入到容器的末尾。
##例如
    ```html
    <!-- 页面头部 -->
    <!-- 页面内容 -->
    <div id="main">
        <!-- main的内容 -->
    </div>
    <script src="http：//192.168.0.251：8080/src/js/imreadsdk.js"></script>
    <script>
    ```
    ```javascript
        _open_imread_SDK_(1, 'main')
    ```
    ```html
    </script>
    </body></html>
    ```
###sdksdk的风格类型说明
    1：横排6图
    2：瀑布6图
    3：3图两文
    4：1图3文
    5：banner轮播铺满（暂不支持此类型）
    6：2图目录
    7：热词方形
    8：热词椭圆
    9：瀑布文字

