(function ($) {
  window.onload = function (e) {
    var canvas = document.getElementById("tree");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    var c = canvas.getContext("2d");

    var mask = document.getElementById("tree_mask");
    mask.width = document.body.clientWidth;
    mask.height = document.body.clientHeight;
    var maskCtx = mask.getContext("2d");

    var centerX = canvas.width / 2;

    var trunkHeight = 160;
    var branchLengthRatio = 0.8455607476635515; // ((canvas.height - y) - canvas.height / 2) / canvas.height * 0.25 + 0.8;
    var branchAngleDifference = 0.25; // 0.22222222222; // 0.27017696820872217 // (x  - canvas.width / 2) / canvas.width * Math.PI;

    var branchingDepth = 6;

    var circle_count = 0;
    var branch_count = 0;
    var blockedBranches = [];
    var randomBranches = {};
    function drawTree(
      x1,
      y1,
      x2,
      y2,
      branchLength,
      branchAngle,
      depth,
      drawCircle,
      side,
      blocked,
    ) {
      if (depth == 0) return;
      else {
        function branch(angle, side, branch_count, blocked) {
		  var randomBranchLength;
		  if(drawCircle){
			randomBranchLength = branchLength * (0.6 * Math.random() + 0.5);
			randomBranches[branch_count] = randomBranchLength;
		  }else{
			randomBranchLength = randomBranches[branch_count];
		  }
		   
          var branchX2 = x2 + randomBranchLength * Math.cos(angle);
          var branchY2 = y2 + randomBranchLength * Math.sin(angle);

		  console.log(branch_count, randomBranchLength, drawCircle);
          drawTree(
            x2,
            y2,
            branchX2,
            branchY2,
            randomBranchLength,
            angle,
            depth - 1,
            drawCircle,
            side,
            false, // Math.random() < 0.1 || !!blocked // blockedBranches.includes(branch_count) || !!blocked
          );
        }

        if (drawCircle) {
			if (depth === branchingDepth) {
				branch_count = 0;
			}else{
				branch_count++;
			}
          if (depth === branchingDepth) {
            maskCtx.clearRect(
              0,
              0,
              document.body.clientWidth,
              document.body.clientHeight
            );
            circle_count = 0;
          }
          if (depth === 4) {
            var radius = 520 // 540 // 350; // 310;
            c.fillStyle = "#555";
            c.strokeStyle = "#000";
            c.globalAlpha = 0.7 // 0.54; // 0.21;

            c.globalCompositeOperation = "multiply";
            c.beginPath();
			var yy =  y2 < radius ? radius : y2;
            c.arc(x2, yy, radius, 0, 2 * Math.PI);
            c.fill();
            if (circle_count && circle_count !== 3) {
              maskCtx.beginPath();
              maskCtx.arc(x2, yy, radius, 0, 2 * Math.PI);
              maskCtx.fill();
            }
            circle_count++;
          }

          // Right branch
          branch(branchAngle + branchAngleDifference, "right", branch_count);
          // Left branch
          branch(branchAngle - branchAngleDifference, "left", branch_count);
        } else {
			if (depth === branchingDepth) {
				branch_count = 0;
			}else{
				branch_count++;
			}

          if (!blocked) {
			  
            //c.globalAlpha = 0.023 * depth ;
            c.globalCompositeOperation = 
              depth === 7 ? "source-over" : "destination-out";
            c.globalAlpha = 1;
            c.lineWidth = depth * depth; // 3.6 * depth; // 2.22 * depth; //1.62 * depth;
            c.lineCap = "round";

            var gap = side === "right" ? depth : side === "left" ? -depth : 0;
            c.beginPath();
            c.moveTo(x1 + gap, y1);
            c.lineTo(x2, y2);
            c.closePath();
            c.stroke();

            c.globalCompositeOperation = "source-over";
            /* if(depth === 1){
						console.log('yo');
						c.globalAlpha = 0.21;
						c.beginPath();
						c.arc(x2, y2, 450, 0, 2 * Math.PI);
						c.fill();
					} */
          }

          branchLength *= branchLengthRatio;

          // Right branch
          branch(branchAngle + branchAngleDifference, "right", branch_count, blocked);
          // Left branch
          branch(branchAngle - branchAngleDifference, "left", branch_count, blocked);

        }
      }
    }

    function redrawTree() {
      c.clearRect(0, 0, canvas.width, canvas.height);

      var x1 = 750; // centerX;
      var y1 = 963; // canvas.height;
      var x2 = 750; // centerX;
      var y2 = 803; // canvas.height - trunkHeight;
      /* console.log(x1, y1, x2, y2, trunkHeight,
				- Math.PI / 2, branchingDepth, branchLengthRatio, branchAngleDifference); */
      drawTree(x1, y1, x2, y2, trunkHeight, -Math.PI / 2, branchingDepth, true, branch_count);

	  /* c.globalCompositeOperation = "invert";
	  c.fillStyle = "#FFF";
	  c.beginPath();
	  c.rect(0, 0, mask.width, mask.height);
	  c.fill();
      c.globalCompositeOperation = "source-over"; */

      drawTree(x1, y1, x2, y2, trunkHeight, -Math.PI / 2, branchingDepth, false, branch_count);

      c.globalCompositeOperation = "destination-in";
      c.drawImage(mask, 0, 0);
      c.globalCompositeOperation = "source-over";

      /* c.beginPath();
	  c.globalAlpha = 0.8;
	  c.lineWidth = 80;
	  c.moveTo(x1, y1);
	  c.lineTo(x2, y2);
	  c.stroke();


	  c.globalCompositeOperation = "destination-out";
	  c.beginPath();
	  c.globalAlpha = 0.8;
	  c.lineWidth = 16;
	  c.moveTo(x1, y1);
	  c.lineTo(x2, y2);
	  c.stroke();
	  c.globalCompositeOperation = "source-over"; */
      /*

				750 963 750 803 160 -1.5707963267948966 9 0.8455607476635515 0.27017696820872217

				*/
    }

    function draw(e) {
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      var y = e.touches ? e.touches[0].clientY : e.clientY;
      branchLengthRatio = 0.8455607476635515; // ((canvas.height - y) - canvas.height / 2) / canvas.height * 0.25 + 0.8;
      branchAngleDifference = 0.25; // 0.22222222222; // 0.27017696820872217 // (x  - canvas.width / 2) / canvas.width * Math.PI;
      //branchLengthRatio = ((canvas.height - y - canvas.height / 2) / canvas.height) * 0.25 + 0.8;
      //branchAngleDifference = ((x - canvas.width / 2) / canvas.width) * Math.PI;
      redrawTree();
    }

    document.addEventListener("click", draw);
    //document.addEventListener("touchmove", draw);

    redrawTree();
  };
})({
  id: function (name) {
    return document.getElementById(name);
  },
  delay: function (time, func, props) {
    var prp = props || [];
    TweenLite.delayedCall(time, func, prp);
  },
  from: function (name, time, props) {
    return TweenLite.from(
      typeof name === "string" ? this.id(name) : name,
      time,
      props
    );
  },
  tween: function (name, time, props) {
    return TweenLite.to(
      typeof name === "string" ? this.id(name) : name,
      time,
      props
    );
  },
  set: function (name, props) {
    return TweenLite.set(
      typeof name === "string" ? this.id(name) : name,
      props
    );
  },
  create: function (name, parent, props, src) {
    var elem = document.createElement(src ? "img" : "div");
    if (src) {
      elem.src = src;
    }
    elem.id = name;
    this.id(parent).appendChild(elem);
    props = props || {};
    this.set(elem, props);
    return elem;
  },
  kill: function (name) {
    return TweenLite.killTweensOf(
      typeof name === "string" ? this.id(name) : name
    );
  },
});
