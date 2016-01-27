var lazyloadImage = function() {
	var container = this.refs.container.getDOMNode();
	var imgs = container.querySelectorAll('img[data-lazyload-src]');
	for (var i = 0; i < imgs.length; i++) {
		var img = imgs[i];
		//没有用data-loaded是因为react重新render是并不会计算改动的真实dom属性
		if (img.getAttribute('data-lazyload-src') != '1' && GLOBAL.isElementVisible(img)) {
			img.src = img.getAttribute('data-lazyload-src');
			img.setAttribute('data-lazyload-src', 1);
		}
	}
}