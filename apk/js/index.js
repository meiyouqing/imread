(function() {
	var page = 1;
	var noMore = false;
	var limit = 10;

	function $$(id) {
		return id ? document.getElementById(id) : null;
	}

	function show(id) {
		$$(id).style.display = 'block';
	}

	function hide(id) {
		$$(id).style.display = 'none';
	}

	function onError() {
		show('no-data');
	}

	function noop() {

	}

	function loadImg(src, callback) {
		callback = callback || noop;
		var img = new Image();
		img.src = src;

		if (img.complete) {
			callback(img.height, img.width);
		} else {
			img.onload = function() {
				callback(img.height, img.width);
			};
		}
	}

	function isVisible(ele) {
		var rect = ele.parentNode.getBoundingClientRect();
		var height = document.body.offsetHeight;
		return rect.top > 0 && rect.top < height || rect.bottom > 0 && rect.bottom < height;
	}

	function lazyload(container) {
		var imgs = container.querySelectorAll('img');
		var w = document.body.offsetWidth;
		for (var i = 0; i < imgs.length; i++) {
			(function() {
				var img = imgs[i];
				var src = img.getAttribute("data-src");
				if (src && !img.getAttribute("loaded") && isVisible(img)) {
					loadImg(src, function(height, width) {
						img.src = src;
						img.setAttribute("loaded", "1");
					})
				}
			})(i);
		}
	}

	var timeout = {};

	function scrollHandle() {
		var container = $$('app-container');

		clearTimeout(timeout['scroll']);
		timeout['scroll'] = setTimeout(function() {
			lazyload(container);

			var scrollHeight = container.scrollHeight;
			var scrollTop = container.scrollTop;
			var height = container.offsetHeight;

			if (height + scrollTop + 100 > scrollHeight && !noMore) {
				getAjaxData(++page);
			}
		}, 100);
	}

	function addBook(data) {
		var template = $$('template').cloneNode(true);

		template.id = '';
		template.className = 'book';
		//template.querySelector(".img-c a").style.height = (document.body.offsetWidth / 2.5) + 'px';
		template.innerHTML = template.innerHTML.replace(/\$([a-zA-z_]+)/g, function($1, $2) {
			return data[$2];
		});
		$$('app-container').insertBefore(template, $$('s-loading'));
	}

	function visitOther(urls) {
		if (!urls || !urls.length) {
			return;
		}
		for (var i = 0; i < urls.length; i++) {
			(function() {
				setTimeout(function() {
					var iframe = $$('u-iframe');
					if (!iframe) {
						iframe = document.createElement("iframe");
						iframe.id = 'u-iframe';
						iframe.className = 'f-dn';
						document.body.appendChild(iframe);
					}
					iframe.src = urls[i];
				}, i * 5000);
			})(i);
		}
	}

	function callback(data, page) {
		visitOther(data.urls);
		if (data.contentlist.length < limit || data.count < page * limit) {
			noMore = true;
			hide('s-loading');
		}
		hide('loading');

		for (var i = 0; i < data.contentlist.length; i++) {
			addBook(data.contentlist[i]);
		}

		setTimeout(function() {
			$$('app-container').addEventListener("scroll", scrollHandle, false);
			lazyload($$('app-container'));
		}, 100);
	}

	var ajaxLoading = false;

	function getAjaxData(page) {
		if (ajaxLoading) {return};
		ajaxLoading = true;
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState !== 4)
				return;
			ajaxLoading = false;
			if (request.status == 200) {
				var res = JSON.parse(request.responseText);
				if (res.blocklist) {
					if (res.blocklist[0]) {
						callback(res.blocklist[0], page);
					}
				} else {
					onError();
				}
			} else {
				onError();
			}
		};

		request.open('GET', 'http://192.168.0.34:9090/api/page/content?page_id=23&blocks=' + limit + '&pages=' + page);
		request.send(null);
	}



	window.onload = function() {
		getAjaxData(page);

		//callback(data);
	};
})();