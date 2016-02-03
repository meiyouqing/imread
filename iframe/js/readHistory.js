(function() {

	function $$(id) {
		return document.getElementById(id);
	}

	function initLine(data, maxT) {
		maxT = maxT || 8;
		$$('maxT').innerHTML = maxT;
		function setRotate(ele, deg) {
			ele.style['transform'] = 'rotate(' + deg + 'deg)';
			ele.style['WebkitTransform'] = 'rotate(' + deg + 'deg)';
			ele.style['msTransform'] = 'rotate(' + deg + 'deg)';
			ele.style['MozTransform'] = 'rotate(' + deg + 'deg)';
			ele.style['OTransform'] = 'rotate(' + deg + 'deg)';
		}
		var w = document.body.offsetWidth - 45;
		var h = 100;

		var dotWidth = 6; //点大小
		var xw = Math.floor((w - 25) / (data.length - 1)) - dotWidth;
		for (var i = 1; i < data.length; i++) {
			var sy = data[i - 1].time / maxT * h;
			var ey = data[i].time / maxT * h;

			var wrap = document.createElement("div");
			wrap.className = 'line-wrap';
			wrap.style.width = xw + 'px';
			wrap.style.height = h + 2 + 'px';
			wrap.style.left = 5 + (xw + dotWidth) * (i - 1) + dotWidth / 2 + 'px';
			var line = document.createElement("div");
			line.className = 'line';
			wrap.appendChild(line);
			var height = (sy + ey) / 2.00;
			line.style.bottom = height + 'px';
			var maxWidth = 1000;
			line.style.width = maxWidth + 'px';
			line.style.marginLeft = (xw - maxWidth) / 2 + 'px';

			//console.log(sy, ey, Math.atan(1.0 * (sy - ey) / xw) * 180.0 / Math.PI)
			setRotate(line, Math.atan(1.0 * (sy - ey) / (xw + dotWidth)) * 180.0 / Math.PI);

			$$('map').appendChild(wrap);
		}

		for (var i = 0; i < data.length; i++) {
			var dot = document.createElement("div");
			dot.className = 'dot';
			dot.style.left = 5 + (xw + dotWidth) * i + 'px';
			dot.style.bottom = Math.floor(data[i].time / maxT * h) + 'px';
			$$('map').appendChild(dot);

			var text = document.createElement("div");
			text.innerText = !i ? data[i].date : data[i].date.replace(/(.*月)|日/g, '').replace(/^0/, '');
			text.className = i != (data.length - 1) ? 'text' : 'text-2 text';
			text.style.left = (i ? 2 : 0) + (xw + dotWidth) * i + 'px';
			$$('map').appendChild(text);
		}

		var ytitle = document.createElement("div");
		ytitle.innerText = '0';
		ytitle.className = 'ytitle';
		$$('map').appendChild(ytitle);

		var xline = document.createElement("div");
		xline.className = 'xline';
		$$('map').appendChild(xline);
	}


	function showLessData() {
		var img = new Image();
		img.src = 'img/less-data.jpg';

		function c() {
			$$('container').style.display = 'none';
			$$('less-data').style.display = 'block';
			var _img = $$('less-data').querySelector("img");
			_img.src = 'img/less-data.jpg';
			var h = Math.min(document.body.offsetWidth, 375) * img.height / img.width;
			_img.style.top = (document.body.offsetHeight - h) * 0.45 + 'px';

		}

		if (img.complete) {
			c();
		} else {
			img.onload = c;
		}


	}

	function callback(data) {
		
		//data.total_read_book = 6;
		var maxT = 1;
		
		for (var i = 0; i < data.list.length; i++) {
			//data.list[i].time = Math.random() * Math.random() * 8;
			maxT = Math.ceil(Math.min(8, Math.max(maxT, data.list[i].time + 1)));
		}
		
		
		//console.log(maxT, data)
		
		if (data.total_read_book < 5) {
			showLessData();
			return;
		}

		var isSharedOut = !/referer/i.test(window.location.search);
		var isAndroid = /linux|android/i.test(navigator.userAgent);

		var isH5 = /referer=3/i.test(window.location.search);

		$$('user_block').style.display = isSharedOut ? 'block' : 'none';
		//$$('m-download').style.display = isSharedOut && isAndroid ? 'block' : 'none';
		if (isSharedOut && window.DlImRead) {
			DlImRead();
		}
		$$('share-btn').style.display = !isSharedOut && !isH5 ? 'block' : 'none';
		$$('container').className = isSharedOut && isAndroid ? 'download' : '';

		initLine(data.list.reverse(), maxT);
		$$('avatar').innerHTML = data.user.avatar;
		$$('nickname').innerHTML = data.user.nickname;
		$$('achieve').innerHTML = data.user.achieve;
		$$('total_read_book').innerHTML = data.total_read_book;
		$$('total_read_time').innerHTML = data.total_read_time;
		$$('today_read_time').innerHTML = data.today_read_time.replace('天', '<i>天</i>').replace('时', '<i>时</i>').replace('分', '<i>分</i>').replace('秒', '<i>秒</i>');
		$$('continuous_reading_time').innerHTML = data.continuous_reading_time;
		$$('tags').innerHTML = '';
		if (data.tags.length) {
			for (var i = 0; i < data.tags.length; i++) {
				var div = document.createElement("div");
				div.className = 'tag';
				div.innerHTML = data.tags[i];
				$$('tags').appendChild(div);
			}
		} else {
			$$('tags').innerHTML = '<span class="no-tag-tip">你还没有设置标签哦</span>';
		}

		var shareObj = {
			title: document.title,
			description: '我已读过' + data.total_read_book + '本，阅读时间总计' + data.total_read_time,
			avatar: 'http://www.imread.com/img/thumb.jpg'
		};

		if (isAndroid && window.IMreadClient) {
			window.IMreadClient.getData(
				JSON.stringify(shareObj)
			);
		}

		$$('share-btn').onclick = function() {
			if (isAndroid) {
				window.IMreadClient.share(JSON.stringify(shareObj));
			} else {
				share(shareObj);
			}
		}

		setTimeout(function() {
			$$('loading').style.display = 'none';
			$$('container').style.display = 'block';
		}, 0);
	}

	function onError() {
		$$('no-data').style.display = 'block';
	}


	function getAjaxData() {
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState !== 4)
				return;
			if (request.status == 200) {
				var res = JSON.parse(request.responseText);
				if (res.code == 200) {
					callback(res.success);
				} else {
					onError();
				}
			} else {
				onError();
			}
		};
		var match = window.location.search.match(/user_id=(\d+)/);
		var user_id = match && match[1];
		//request.open('GET', 'http://192.168.0.34:9090/api/me/experience?user_id=' + user_id);
		request.open('GET', 'http://readapi.imread.com/api/me/experience?user_id=' + user_id);
		request.send(null);
	}

	window.onload = function() {
		getAjaxData();
	}
})();