var hidden;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
	hidden = "hidden";
} else if (typeof document.mozHidden !== "undefined") {
	hidden = "mozHidden";
} else if (typeof document.msHidden !== "undefined") {
	hidden = "msHidden";
} else if (typeof document.webkitHidden !== "undefined") {
	hidden = "webkitHidden";
}

module.exports = function() {
	return document[hidden];
}