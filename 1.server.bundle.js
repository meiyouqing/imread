exports.ids = [1];
exports.modules = {

/***/ 40:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React, GLOBAL) {'use strict';

	var _reactRouter = __webpack_require__(3);

	var Swipe = __webpack_require__(41).swipe;
	var uploadLog = __webpack_require__(42);

	var Block5 = React.createClass({
		displayName: 'Block5',

		getWidthAndHeight: function getWidthAndHeight() {
			var w = document.body.offsetWidth - (this.props.style == 11 ? 8 : 0);
			return {
				width: w,
				height: w / 3.0
			};
		},
		getInitialState: function getInitialState() {
			return this.getWidthAndHeight();
		},
		logIntercut: function logIntercut(intercut_id, event) {
			uploadLog.send('intercut', {
				intercut_id: intercut_id,
				event: event,
				show_class: this.props.fromReading ? 1 : 3
			});
		},
		handleIntercurClick: function handleIntercurClick(e) {
			this.logIntercut(e.target.getAttribute('data-intercut_id'), 2);
			return true;
		},
		initSwipe: function initSwipe() {
			var that = this;
			var swipeNav = this.refs['swipe-nav'];
			this.swipe && this.swipe.kill();

			var swipeCallback = function swipeCallback(index, ele) {
				var index = index % that.props.data.contentlist.length;
				if (GLOBAL.name === 'mall' || GLOBAL.name == 'reading' && that.props.fromReading) {
					// 判断是否在书城
					setTimeout(function () {
						if (!ele || GLOBAL.isElementVisible(ele)) {
							that.logIntercut(that.props.data.contentlist[index].content_id, 1, that.props.data.contentlist[index].show_class);
						}
					}, 50);
				}
				ele = ele || that.refs['swipe'].querySelector("a");
				if (ele && ele.querySelector("img")) {
					var img = ele.querySelector("img");
					if (!img.getAttribute("data-load-state")) {
						var src = img.getAttribute("data-src");
						img.setAttribute("data-load-state", 'loading');
						GLOBAL.loadImage(src, function () {
							img.src = src;
							img.style.height = that.state.height + 'px';
							img.setAttribute("data-load-state", 'loaded');
						});
					}
				}
				that.toggleSwipeNav(index);
			};
			swipeCallback(0);

			if (!swipeNav) {
				return;
			}
			// var swipeNavs = swipeNav.children;
			this.swipe = new Swipe(this.refs.swipe, {
				auto: 3000,
				callback: swipeCallback
			});
			this.toggleSwipeNav(0);
		},
		handleResize: function handleResize(e) {
			this.setState(this.getWidthAndHeight());
		},
		componentDidMount: function componentDidMount() {
			//alert('mount')
			this.initSwipe();
			//横竖屏切换 重新计算高度
			window.addEventListener('resize', this.handleResize, false);
		},
		componentDidUpdate: function componentDidUpdate() {
			//alert('update')
			this.initSwipe();
		},
		toggleSwipeNav: function toggleSwipeNav(index) {
			var swipeNav = this.refs['swipe-nav'];
			if (swipeNav && swipeNav.children && swipeNav.children.length) {
				for (var i = 0; i < swipeNav.children.length; i++) {
					GLOBAL.removeClass(swipeNav.children[i], 'swipe-nav-item-active');
					if (i == index) {
						GLOBAL.addClass(swipeNav.children[i], 'swipe-nav-item-active');
					}
				}
			}
		},
		componentWillUnmount: function componentWillUnmount() {
			//console.log(uploadLog.result)
			uploadLog.sending('intercut');
			this.swipe && this.swipe.kill();
			window.removeEventListener('resize', this.handleResize, false);
		},
		shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
			return this.props.data.contentlist !== nextProps.data.contentlist || this.state.height !== nextState.height;
		},
		componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
			//alert('rece')
			//this.swipe && (this.swipe.kill());
		},
		render: function render() {
			var swipeNav;
			if (this.props.data.contentlist.length > 1) {
				swipeNav = React.createElement(
					'div',
					{ className: 'swipe-nav' },
					React.createElement(
						'div',
						{ className: 'swipe-nav-wrap f-clearfix', ref: 'swipe-nav' },
						this.props.data.contentlist.map(function (v, i) {
							return React.createElement('a', { key: i, className: 'f-fl swipe-nav-item' });
						}.bind(this))
					)
				);
			}
			var visibility = this.props.data.contentlist.length > 1 ? 'hidden' : 'visible';
			return React.createElement(
				'section',
				{ className: 'm-block-top m-block' },
				React.createElement(
					'div',
					{ className: 'content' },
					React.createElement(
						'div',
						{ className: "subCat-5" + (this.props.style == 11 ? ' subCat-11' : '') },
						React.createElement(
							'div',
							{ className: 'swipe', ref: 'swipe', style: { 'visibility': visibility, height: this.state.height } },
							React.createElement(
								'div',
								{ className: 'swipe-wrap' },
								this.props.data.contentlist.map(function (v, i) {

									var urlflag = false;
									if (v.redirect_url && v.redirect_url.indexOf('lottery') >= 0) urlflag = true;

									var spm = this.props.spm.slice(0);
									spm.splice(-1, 1, i + 1);
									var hrefObj = Router.typeHref(v, spm);
									return React.createElement(
										_reactRouter.Link,
										{ style: { backgroundImage: 'url(src/img/defaultBanner.png)', height: this.state.height, backgroundSize: "cover" }, to: urlflag ? v.redirect_url : hrefObj.url, target: hrefObj.target, className: 'swipe-ad f-fl', key: i, onClick: this.handleIntercurClick, 'data-intercut_id': v.content_id },
										React.createElement('img', { 'data-src': v.intercut_url, className: 'u-adimg', style: { width: '100%' } })
									);
								}.bind(this))
							),
							swipeNav
						)
					)
				)
			);
		}
	});

	module.exports = Block5;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(6)))

/***/ },

/***/ 41:
/***/ function(module, exports) {

	'use strict';

	/*
	 * Swipe 2.0
	 *
	 * Brad Birdsall
	 * Copyright 2013, MIT License
	 *
	*/

	function Swipe(container, options) {

	  "use strict";

	  var needKill = false;

	  // utilities
	  var noop = function noop() {}; // simple no operation function
	  var offloadFn = function offloadFn(fn) {
	    setTimeout(fn || noop, 0);
	  }; // offload a functions execution

	  // check browser capabilities
	  var browser = {
	    addEventListener: !!window.addEventListener,
	    touch: 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch,
	    transitions: function (temp) {
	      var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
	      for (var i in props) {
	        if (temp.style[props[i]] !== undefined) return true;
	      }return false;
	    }(document.createElement('swipe'))
	  };

	  // quit if no root element
	  if (!container) return;
	  var element = container.children[0];
	  var slides, slidePos, width, length;
	  options = options || {};
	  var index = parseInt(options.startSlide, 10) || 0;
	  var speed = options.speed || 300;
	  options.continuous = options.continuous !== undefined ? options.continuous : true;

	  //递归修改clone元素的reactid值，防止两个元素reactid相同报错
	  function setCloneNodeReactId(ele, attr) {
	    ele.setAttribute(attr, ele.getAttribute(attr) + '.clone');
	    if (ele.children && ele.children.length) {
	      for (var i = 0; i < ele.children.length; i++) {
	        setCloneNodeReactId(ele.children[i], attr);
	      }
	    }
	  }

	  function _setup() {

	    // cache slides
	    slides = element.children;
	    length = slides.length;

	    // set continuous to false if only one slide
	    if (slides.length < 2) options.continuous = false;

	    //special case if two slides
	    if (browser.transitions && options.continuous && slides.length < 3) {
	      needKill = true;
	      var firstChild = slides[0].cloneNode(true);
	      var secondChild = element.children[1].cloneNode(true);
	      setCloneNodeReactId(firstChild, 'data-reactid');
	      setCloneNodeReactId(secondChild, 'data-reactid');
	      element.appendChild(firstChild);
	      element.appendChild(secondChild);
	      slides = element.children;
	    }

	    // create an array to store current positions of each slide
	    slidePos = new Array(slides.length);

	    // determine width of each slide
	    width = container.getBoundingClientRect().width || container.offsetWidth;

	    element.style.width = slides.length * width + 'px';

	    // stack elements
	    var pos = slides.length;
	    while (pos--) {

	      var slide = slides[pos];

	      slide.style.width = width + 'px';
	      slide.setAttribute('data-index', pos);

	      if (browser.transitions) {
	        slide.style.left = pos * -width + 'px';
	        move(pos, index > pos ? -width : index < pos ? width : 0, 0);
	      }
	    }

	    // reposition elements before and after index
	    if (options.continuous && browser.transitions) {
	      move(circle(index - 1), -width, 0);
	      move(circle(index + 1), width, 0);
	    }

	    if (!browser.transitions) element.style.left = index * -width + 'px';

	    container.style.visibility = 'visible';
	  }

	  function _prev() {

	    if (options.continuous) _slide(index - 1);else if (index) _slide(index - 1);
	  }

	  function _next() {

	    if (options.continuous) _slide(index + 1);else if (index < slides.length - 1) _slide(index + 1);
	  }

	  function circle(index) {

	    // a simple positive modulo using slides.length
	    return (slides.length + index % slides.length) % slides.length;
	  }

	  function _slide(to, slideSpeed) {

	    // do nothing if already on requested slide
	    if (index == to) return;

	    if (browser.transitions) {

	      var direction = Math.abs(index - to) / (index - to); // 1: backward, -1: forward

	      // get the actual position of the slide
	      if (options.continuous) {
	        var natural_direction = direction;
	        direction = -slidePos[circle(to)] / width;

	        // if going forward but to < index, use to = slides.length + to
	        // if going backward but to > index, use to = -slides.length + to
	        if (direction !== natural_direction) to = -direction * slides.length + to;
	      }

	      var diff = Math.abs(index - to) - 1;

	      // move all the slides between index and to in the right direction
	      while (diff--) {
	        move(circle((to > index ? to : index) - diff - 1), width * direction, 0);
	      }to = circle(to);

	      move(index, width * direction, slideSpeed || speed);
	      move(to, 0, slideSpeed || speed);

	      if (options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place
	    } else {

	      to = circle(to);
	      animate(index * -width, to * -width, slideSpeed || speed);
	      //no fallback for a circular continuous if the browser does not accept transitions
	    }

	    index = to;
	    offloadFn(options.callback && options.callback(index, slides[index]));
	  }

	  function move(index, dist, speed) {

	    translate(index, dist, speed);
	    slidePos[index] = dist;
	  }

	  function translate(index, dist, speed) {

	    var slide = slides[index];
	    var style = slide && slide.style;

	    if (!style) return;

	    style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = speed + 'ms';

	    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
	    style.msTransform = style.MozTransform = style.OTransform = 'translateX(' + dist + 'px)';
	  }

	  function animate(from, to, speed) {

	    // if not an animation, just reposition
	    if (!speed) {

	      element.style.left = to + 'px';
	      return;
	    }

	    var start = +new Date();

	    var timer = setInterval(function () {

	      var timeElap = +new Date() - start;

	      if (timeElap > speed) {

	        element.style.left = to + 'px';

	        if (delay) begin();

	        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

	        clearInterval(timer);
	        return;
	      }

	      element.style.left = (to - from) * (Math.floor(timeElap / speed * 100) / 100) + from + 'px';
	    }, 4);
	  }

	  // setup auto slideshow
	  var delay = options.auto || 0;
	  var interval;

	  function begin() {

	    clearTimeout(interval); // very important
	    interval = setTimeout(_next, delay);
	  }

	  function _stop() {

	    delay = 0;
	    clearTimeout(interval);
	  }

	  // setup initial vars
	  var _start = {};
	  var delta = {};
	  var isScrolling;

	  // setup event capturing
	  var events = {

	    handleEvent: function handleEvent(event) {

	      switch (event.type) {
	        case 'touchstart':
	          this.start(event);break;
	        case 'touchmove':
	          this.move(event);break;
	        case 'touchend':
	          offloadFn(this.end(event));break;
	        case 'webkitTransitionEnd':
	        case 'msTransitionEnd':
	        case 'oTransitionEnd':
	        case 'otransitionend':
	        case 'transitionend':
	          offloadFn(this.transitionEnd(event));break;
	        case 'resize':
	          offloadFn(_setup);break;
	      }

	      if (options.stopPropagation) event.stopPropagation();
	    },
	    start: function start(event) {

	      var touches = event.touches[0];

	      // measure start values
	      _start = {

	        // get initial touch coords
	        x: touches.pageX,
	        y: touches.pageY,

	        // store time to determine touch duration
	        time: +new Date()

	      };

	      // used for testing first move event
	      isScrolling = undefined;

	      // reset delta and end measurements
	      delta = {};

	      // attach touchmove and touchend listeners
	      element.addEventListener('touchmove', this, false);
	      element.addEventListener('touchend', this, false);
	    },
	    move: function move(event) {
	      // ensure swiping with one touch and not pinching
	      if (event.touches.length > 1 || event.scale && event.scale !== 1) return;

	      if (options.disableScroll) event.preventDefault();

	      var touches = event.touches[0];

	      // measure change in x and y
	      delta = {
	        x: touches.pageX - _start.x,
	        y: touches.pageY - _start.y
	      };

	      // determine if scrolling test has run - one time test
	      if (typeof isScrolling == 'undefined') {
	        isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
	      }

	      // if user is not trying to scroll vertically
	      if (!isScrolling) {

	        // prevent native scrolling
	        event.preventDefault();

	        // stop slideshow
	        _stop();

	        // increase resistance if first or last slide
	        if (options.continuous) {
	          // we don't add resistance at the end

	          translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0);
	          translate(index, delta.x + slidePos[index], 0);
	          translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);
	        } else {

	          delta.x = delta.x / (!index && delta.x > 0 // if first slide and sliding left
	          || index == slides.length - 1 // or if last slide and sliding right
	          && delta.x < 0 // and if sliding at all
	          ? Math.abs(delta.x) / width + 1 : // determine resistance level
	          1); // no resistance if false

	          // translate 1:1
	          translate(index - 1, delta.x + slidePos[index - 1], 0);
	          translate(index, delta.x + slidePos[index], 0);
	          translate(index + 1, delta.x + slidePos[index + 1], 0);
	        }
	      }
	    },
	    end: function end(event) {
	      // measure duration
	      var duration = +new Date() - _start.time;

	      // determine if slide attempt triggers next/prev slide
	      var isValidSlide = Number(duration) < 250 // if slide duration is less than 250ms
	      && Math.abs(delta.x) > 20 // and if slide amt is greater than 20px
	      || Math.abs(delta.x) > width / 2; // or if slide amt is greater than half the width

	      // determine if slide attempt is past start and end
	      var isPastBounds = !index && delta.x > 0 // if first slide and slide amt is greater than 0
	      || index == slides.length - 1 && delta.x < 0; // or if last slide and slide amt is less than 0

	      if (options.continuous) isPastBounds = false;

	      // determine direction of swipe (true:right, false:left)
	      var direction = delta.x < 0;

	      // if not scrolling vertically
	      if (!isScrolling) {

	        if (isValidSlide && !isPastBounds) {

	          if (direction) {

	            if (options.continuous) {
	              // we need to get the next in this direction in place

	              move(circle(index - 1), -width, 0);
	              move(circle(index + 2), width, 0);
	            } else {
	              move(index - 1, -width, 0);
	            }

	            move(index, slidePos[index] - width, speed);
	            move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
	            index = circle(index + 1);
	          } else {
	            if (options.continuous) {
	              // we need to get the next in this direction in place

	              move(circle(index + 1), width, 0);
	              move(circle(index - 2), -width, 0);
	            } else {
	              move(index + 1, width, 0);
	            }

	            move(index, slidePos[index] + width, speed);
	            move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
	            index = circle(index - 1);
	          }

	          options.callback && options.callback(index, slides[index]);
	        } else {

	          if (options.continuous) {

	            move(circle(index - 1), -width, speed);
	            move(index, 0, speed);
	            move(circle(index + 1), width, speed);
	          } else {

	            move(index - 1, -width, speed);
	            move(index, 0, speed);
	            move(index + 1, width, speed);
	          }
	        }
	      }

	      // kill touchmove and touchend event listeners until touchstart called again
	      element.removeEventListener('touchmove', events, false);
	      element.removeEventListener('touchend', events, false);
	    },
	    transitionEnd: function transitionEnd(event) {

	      if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

	        if (delay) begin();

	        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
	      }
	    }

	  };

	  // trigger setup
	  _setup();

	  // start auto slideshow if applicable
	  if (delay) begin();

	  // add event listeners
	  if (browser.addEventListener) {

	    // set touchstart event on element
	    if (browser.touch) element.addEventListener('touchstart', events, false);

	    if (browser.transitions) {
	      element.addEventListener('webkitTransitionEnd', events, false);
	      element.addEventListener('msTransitionEnd', events, false);
	      element.addEventListener('oTransitionEnd', events, false);
	      element.addEventListener('otransitionend', events, false);
	      element.addEventListener('transitionend', events, false);
	    }

	    // set resize event on window
	    window.addEventListener('resize', events, false);
	  } else {

	    window.onresize = function () {
	      _setup();
	    }; // to play nice with old IE
	  }

	  // expose the Swipe API
	  return {
	    setup: function setup() {

	      _setup();
	    },
	    slide: function slide(to, speed) {

	      // cancel slideshow
	      _stop();

	      _slide(to, speed);
	    },
	    prev: function prev() {

	      // cancel slideshow
	      _stop();

	      _prev();
	    },
	    next: function next() {

	      // cancel slideshow
	      _stop();

	      _next();
	    },
	    stop: function stop() {

	      // cancel slideshow
	      _stop();
	    },
	    getPos: function getPos() {

	      // return current index position
	      return index;
	    },
	    getNumSlides: function getNumSlides() {

	      // return total number of slides
	      return length;
	    },
	    kill: function kill() {
	      //console.log('kill');
	      if (needKill) {
	        //console.log('aaaa');
	        //console.log(element);
	        //console.log(element.children[element.children.length - 1])
	        element.removeChild(element.children[element.children.length - 1]);
	        //console.log(element.children[element.children.length - 1])
	        element.removeChild(element.children[element.children.length - 1]);
	        slides = element.children;
	        needKill = false;
	      }
	      // cancel slideshow
	      _stop();

	      // reset element
	      element.style.width = '';
	      element.style.left = '';

	      // reset slides
	      var pos = slides.length;
	      while (pos--) {

	        var slide = slides[pos];
	        slide.style.width = '';
	        slide.style.left = '';

	        if (browser.transitions) translate(pos, 0, 0);
	      }

	      // removed event listeners
	      if (browser.addEventListener) {

	        // remove current event listeners
	        element.removeEventListener('touchstart', events, false);
	        element.removeEventListener('webkitTransitionEnd', events, false);
	        element.removeEventListener('msTransitionEnd', events, false);
	        element.removeEventListener('oTransitionEnd', events, false);
	        element.removeEventListener('otransitionend', events, false);
	        element.removeEventListener('transitionend', events, false);
	        window.removeEventListener('resize', events, false);
	      } else {

	        window.onresize = null;
	      }
	    }
	  };
	}

	var swipe = {
	  'swipe': Swipe
	};

	module.exports = swipe;

/***/ }

};;