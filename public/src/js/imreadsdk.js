var _open_imread_SDK_list_ =[];
function _open_imread_SDK_(type,channel,container){
    container = /^#/.test(container)? container:'#'+container;
    container = container? document.querySelector(container) : document.body;
    var iframe = document.createElement('iframe');
    type = type || 1;
    iframe.src = 'https://m.imread.com/sdk/sdk.'+type+'?channel='+channel;
    iframe.width = '100%';
    iframe.height = '200';
    iframe.setAttribute('frameborder','0');
    iframe.setAttribute('marginwidth','0');
    iframe.setAttribute('marginheight','0');
    iframe.setAttribute('vspace','0');
    iframe.setAttribute('hspace','0');
    iframe.setAttribute('allowtransparency','true');
    iframe.setAttribute('allowfullscreen','true');
    iframe.setAttribute('scrolling','no');
    container.appendChild(iframe);
    _open_imread_SDK_list_.push(iframe);
}
window.addEventListener('message',function(e){
    if (e.origin !== 'https://m.imread.com') return;
    var exp = new RegExp(e.data.type+'\\?');
    _open_imread_SDK_list_.forEach(function(v){
        // console.log(e.data.type,v.src)
        if(exp.test(v.src)){
            v.height = e.data.h;
        }
    })
})
// var swipeNavs = document.querySelectorAll('.swipe-nav-wrap a');if(swipeNavs.length > 1){
// var swipe = document.querySelector('.subCat-5 .swipe');
//     new Swipe(swipe,{auto:3000,callback:function(index){for(var i=0;i<swipeNavs.length;i++){swipeNavs[i].className = "f-fl swipe-nav-item";if(i===index){swipeNavs[i].className = "f-fl swipe-nav-item swipe-nav-item-active"}}}})
// }
