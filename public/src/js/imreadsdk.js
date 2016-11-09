var _open_imread_SDK_list_ =[];
function _open_imread_SDK_(channel,pid,container){
    if(!channel || !pid) return;
    container = /^#/.test(container)? container:'#'+container;
    container = container? document.querySelector(container) : document.body;
    var iframe = document.createElement('iframe');
    iframe.src = '//m.imread.com/sdk/sdk.'+pid+'.'+channel;
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
    //if (e.origin !== 'https//m.imread.com') return;
    var exp = new RegExp(e.data.param+'$');
    _open_imread_SDK_list_.forEach(function(v){
        console.log(e.data.param,v.src)
        if(exp.test(v.src)){
            v.height = e.data.h;
        }
    })
})
