---
title: DVD Flying Logo On Canvas
date: 2023-09-21
tags:
    - javascript
---

```javascript
window.onload = function () {
  // create the canvas for both the background and the cirlce
  var bgCanvas = document.createElement("canvas");
  var circleCanvas = document.createElement("canvas");

  // get context for ech of these
  var bgctx = bgCanvas.getContext("2d");
  var circlectx = circleCanvas.getContext("2d");

  // set background properties
  bgCanvas.id = "bg";
  bgCanvas.width = innerWidth;
  bgCanvas.height = innerHeight;

  // set circle properties
  circleCanvas.id = "circle";
  circleCanvas.height = innerHeight;
  circleCanvas.width = innerWidth;
  bgctx.fillStyle = "black";
  bgctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  document.body.appendChild(bgCanvas);
  document.body.appendChild(circleCanvas);

  // starting position
  var r = 50;
  var x = 0;
  var y = Math.random() * 1000;

  // control direction of circle
  let ysign = 1;
  let xsign = 1;

  // draw the circle moving around the screen
  function draw() {
    circlectx.clearRect(0, 0, circleCanvas.width, circleCanvas.height);
    x += 10 * xsign;
    y += 10 * ysign;

    // switch sign when wall is hit
    if (y + r > bgCanvas.getBoundingClientRect().bottom) {
        ysign = -1;
    } else if (y - r < bgCanvas.getBoundingClientRect().top) {
        ysign = 1;
    }

    // switch sign when wall is hit
    if (x + r > bgCanvas.getBoundingClientRect().right) {
      xsign = -1;
    } else if (x - r < bgCanvas.getBoundingClientRect().left) {
      xsign = 1;
    }

    // map current position to colors 
    let rval = mapToRange(
      x,
      [0, circleCanvas.getBoundingClientRect().right],
      [80, 255]
    );
    let gval = mapToRange(
      x,
      [0, circleCanvas.getBoundingClientRect().right],
      [34, 150]
    );

    let bval = mapToRange(
      y,
      [0, bgCanvas.getBoundingClientRect().bottom],
      [50, 200]
    );

    circlectx.beginPath();
    circlectx.arc(x, y, r, 0, 2 * Math.PI, false);
    let color = "rgb(" + rval + "," + gval + "," + bval;
    circlectx.fillStyle = color;
    circlectx.fill();
    circlectx.lineWidth = 5;
    circlectx.strokeStyle = "white";
    circlectx.stroke();
  }

  function animate() {
    requestAnimationFrame(animate);
    draw();
  }

  animate();

  bgCanvas.style.position = "absolute";
  circleCanvas.style.position = "absolute";
  circleCanvas.style.top = "0px";
  circleCanvas.style.left = "0px";
};

// not sure if there an existing js function for this or not
function mapToRange(input, inputRange, outputRange) {
  const inputSpan = inputRange[1] - inputRange[0];
  const outputSpan = outputRange[1] - outputRange[0];

  const valueScaled = (input - inputRange[0]) / inputSpan;

  const valAtOutRange = outputRange[0] + valueScaled * outputSpan;

  return valAtOutRange;
}
```

and correspodning HTML

```html
<html>
  <head>
    <title>sketch</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
    body {
      padding: 0;
      margin: 0;
      cursor: pointer;
    }
    </style>
    
    <script src="js/moving-circle.js"></script>
  </head>  
  <body></body>
</html>
```

<video src="https://emanuelrgz-content.sfo3.cdn.digitaloceanspaces.com/videos/flying-circle.mp4" controls="controls" style="max-width: 730px;" autoplay muted loop></video>


