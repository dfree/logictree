(function ($) {
	window.onload = function(e) {
		var canvas = document.getElementById("tree");
		canvas.width = document.body.clientWidth;
    	canvas.height = document.body.clientHeight;
		var c = canvas.getContext("2d");
		var centerX = canvas.width / 2;

		var trunkHeight = 180;
		var branchLengthRatio = 0.75;
		var branchAngleDifference = 0.5;
		var branchingDepth = 8;

		function drawTree(x1, y1, x2, y2, branchLength,
						branchAngle, depth){
		if(depth == 0)
			return;
		else{
			c.globalAlpha = 0.023 * depth ;
			c.lineWidth = 2 ;
			c.lineCap = "round";
			c.beginPath();
			c.moveTo(x1, y1);
			c.lineTo(x2, y2);
			c.closePath();
			c.stroke();

			
			branchLength *= branchLengthRatio;
			
			function branch(angle){
			var branchX2 = x2 + branchLength * Math.cos(angle);
			var branchY2 = y2 + branchLength * Math.sin(angle);
			drawTree(x2, y2, branchX2, branchY2, branchLength,
					angle, depth - 1);
			}
			
			// Right branch
			branch(branchAngle + branchAngleDifference);
			
			// Left branch
			branch(branchAngle - branchAngleDifference);
		}
		}

		function redrawTree(){
		
		c.clearRect(0,0, canvas.width, canvas.height);
		
		var x1 = centerX;
		var y1 = canvas.height;
		var x2 = centerX;
		var y2 = canvas.height - trunkHeight;
		drawTree(x1, y1, x2, y2, trunkHeight,
				- Math.PI / 2, branchingDepth);
		}
		
		function draw (e) {
			var x = e.touches ? e.touches[0].clientX : e.clientX;
			var y = e.touches ? e.touches[0].clientY : e.clientY;
			branchLengthRatio = ((canvas.height - y) - canvas.height / 2) / canvas.height + 0.5;
			branchAngleDifference = (x  - canvas.width / 2) / canvas.width * Math.PI;
			redrawTree();
		};

		document.addEventListener("mousemove" ,draw);
		document.addEventListener("touchmove" ,draw);

		redrawTree();
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