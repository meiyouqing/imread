var ReadingStyle = {
	defaultStyle: {
		bg: 1,
		night: 0,
		fontSize: 3,
		lineheight: 3,
		fontFamily: 1
	},
	extrendStyle: function(style) {
		style = style || {};
		for (var key in ReadingStyle.defaultStyle) {
			style[key] = style[key] || ReadingStyle.defaultStyle[key];
		}
		return style;
	},
	get: function() {
		var styleStr = localStorage.getItem('ReadingStyle');
		var style = {};
		try {
			style = ReadingStyle.extrendStyle(JSON.parse(styleStr));
		} catch(e) {
			style = ReadingStyle.defaultStyle;
		}
		return style;
	},
	set: function(style) {
		style = ReadingStyle.extrendStyle(style);
		try{
		localStorage.setItem('ReadingStyle', JSON.stringify(style));
		} catch(e) {}
	},
	getClass: function(style) {
		var className = '';
		style = ReadingStyle.extrendStyle(style);
		for (var key in style) {
			className += ' ' + key + '-' + style[key];
		}
		return className;
	}
};

module.exports = ReadingStyle;