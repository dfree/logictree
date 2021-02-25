(function ($) {
	window.onload = function(e) {
        var isCursorVisible = false;
        function toggleCursor() {
            isCursorVisible = !isCursorVisible;
            document.getElementById("cursor").style.visibility = isCursorVisible ? 'visible' : 'hidden';
        }
		setInterval(toggleCursor, 500);
	};
})({
	id: function(name){
		return document.getElementById(name);
	},
	delay: function(time, func, props){
		var prp = props || [];
		TweenLite.delayedCall(time, func, prp);
	},
	from: function(name, time, props){
		return TweenLite.from(typeof name === 'string' ? this.id(name) : name, time, props);
	},
	tween: function(name, time, props){
		return TweenLite.to(typeof name === 'string' ? this.id(name) : name, time, props);
	},
	set: function(name, props){
		return TweenLite.set(typeof name === 'string' ? this.id(name) : name, props);
	},
	create: function(name, parent, props, src){
		var elem = document.createElement(src ? 'img' : 'div');
		if(src){
			elem.src = src;
		}
		elem.id = name;
		this.id(parent).appendChild(elem);
		props = props || {};
		this.set(elem, props);
		return elem;
	},
	kill: function(name){
		return TweenLite.killTweensOf(typeof name === 'string' ? this.id(name) : name);
	}
});