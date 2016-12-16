
export default function(cookies,key){
    var cookiesArr = cookies?cookies.split('; ') : [];
    var result =  key?undefined : {};
    for (var i = 0, l = cookiesArr.length; i < l; i++) {
        var parts = cookiesArr[i].split('=');
        var name = decodeURI(parts[0]);
        var cookie = decodeURI(parts[1]);
        if (key && key === name) {
                result = cookie;
                break;
        }else if (!key) {
                result[name] = cookie;
        }
    }
    return result;
}
