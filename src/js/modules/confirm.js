var Hammer = require('./hammer');
require('../../css/confirm.css');

var confirm = function() {
	var that = this;

	var template_confirm = '\
		<div class="confirm-block confirm-block-2">\
			<div class="content">\
				<div class="title"><h3>提示</h3></div>\
				<div class="text">$content</div>\
				<div class="btns">\
					<button class="no cancelBtn" />取消</button>\
					<button class="yes confirmBtn" />确定</button>\
				</div>\
			</div>\
		</div>';
	var template_alert = template_confirm.replace('<button class="no cancelBtn" />取消</button>','')
	var template__alert = '<div class="content">$content</div>';
	var template__confirm = '\
		<div class="confirm-block">\
			<div class="content confirmBtn">$content</div>\
		</div>';

	var UI_confirm = document.createElement("div");
	UI_confirm.className = 'UI_confirm';

	this._alert = function(msg){
		var UI_confirm = document.createElement("div");
		UI_confirm.innerHTML = template__alert.replace('$content', msg);
		UI_confirm.className = 'UI_confirm_auto';
		document.body.appendChild(UI_confirm);
		setTimeout(function(){
			UI_confirm.classList.add('dispear');
			setTimeout(function(){
				document.body.removeChild(UI_confirm);
			},300);
		},2000);
	};
	this.alert = function(msg,callback){
		that.remove();
		callback = callback || GLOBAL.noop;
		UI_confirm.innerHTML = template_alert.replace('$content', msg);
		that.onConfirmBtn(UI_confirm,callback)
		document.body.appendChild(UI_confirm);
	};
	this.confirm = function(msg,callback,cancel){
		that.remove();
		callback = callback || GLOBAL.noop;
		cancel = cancel || GLOBAL.noop;
		UI_confirm.innerHTML = template_confirm.replace('$content', msg);
		var cancelBtn = UI_confirm.querySelector('.cancelBtn');
		that.onConfirmBtn(UI_confirm,callback);
		that.onCancelBtn(cancelBtn,cancel);
		document.body.appendChild(UI_confirm);
	};
	this._confirm = function(msg,callback,cancel,top){
		that.remove();
		callback = callback || GLOBAL.noop;
		cancel = cancel || GLOBAL.noop;
		UI_confirm.innerHTML = template__confirm.replace('$content', msg);
		that.onConfirmBtn(UI_confirm,callback);
		that.onCancelBtn(UI_confirm,cancel);
		if (top) {
			UI_confirm.children[0].style.top = top + 'px';
		}
		document.body.appendChild(UI_confirm);
	};
	this.onConfirmBtn = function(UI_confirm,callback){
		var confirmBtn = UI_confirm.querySelector('.confirmBtn');
		var confirmBtnHammer = new Hammer(confirmBtn);
		confirmBtnHammer.on('tap', function(e) {
			callback();
			e.stopPropagation && (e.stopPropagation)();
			setTimeout(that.remove,300);
		});			
	};
	this.onCancelBtn = function(cancelBtn,callback){
		var cancelBtnHammer = new Hammer(cancelBtn);
		cancelBtnHammer.on('tap', function(e) {
			setTimeout(callback,0)
			//callback();
			e.stopPropagation && (e.stopPropagation)();
			setTimeout(that.remove,300);
			//alert('b')
		});			
	}
	this.remove = function() {
		var blocks = document.body.querySelectorAll('.UI_confirm');
		for (var i = 0; i < blocks.length; i++) {
			document.body.removeChild(blocks[i]);
		}
	};
};

module.exports = new confirm();