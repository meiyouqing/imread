var ReadingStyle = {
	defaultStyle: {
		style: 0,
		night: 0,
		fontSize: 2,
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
		return ReadingStyle.extrendStyle(storage.get('ReadingStyle'));
	},
	set: function(style) {
		//console.log(style, ReadingStyle.extrendStyle(style))
		storage.set('ReadingStyle', ReadingStyle.extrendStyle(style));
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