import storage from '../modules/storage';
const ReadingStyle = {
  defaultStyle: {
    style: 0,
    night: 0,
    fontSize: 2,
    lineheight: 3,
    fontFamily: 1
  },
  extrendStyle(style) {
    style = style || {};
    for (const key in ReadingStyle.defaultStyle) {
      style[key] = style[key] || ReadingStyle.defaultStyle[key];
    }
    return style;
  },
  get() {
    return ReadingStyle.extrendStyle(storage.get('ReadingStyle'));
  },
  set(style) {
		// console.log(style, ReadingStyle.extrendStyle(style))
    storage.set('ReadingStyle', ReadingStyle.extrendStyle(style));
  },
  getClass(style) {
    let className = '';
    style = ReadingStyle.extrendStyle(style);
    for (const key in style) {
      className += ` ${key}-${style[key]}`;
    }
    return className;
  }
};

module.exports = ReadingStyle;
