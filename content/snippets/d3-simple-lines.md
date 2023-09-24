---
title: D3 - simple lines
tags:
    - javascript
    - d3
---

```javascript
function makeDemo3() {
  d3.csv("data/examples-multiple.csv").then(function (data) {
    var svg = d3.select("svg");
    var pointX = svg.attr("width");
    var pointY = svg.attr("height");

    function makeScale(accessor, range) {
      return d3
        .scaleLinear()
        .domain(d3.extent(data, accessor))
        .range(range)
        .nice();
    }

    var scaleX = makeScale((d) => d["x"], [0, pointX]);
    var scaleY1 = makeScale((d) => d["y1"], [pointY, 0]);
    var scaleY2 = makeScale((d) => d["y2"], [pointY, 0]);

    function drawData(g, accessorX, accessorY, curve) {
      g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", accessorX)
        .attr("cy", accessorY);

      var lineMaker = d3.line().curve(curve).x(accessorX).y(accessorY);

      g.append("path").attr("fill", "none").attr("d", lineMaker(data));
    }

    var g1 = svg.append("g");
    var g2 = svg.append("g");

    drawData(
      g1,
      (d) => scaleX(d["x"]),
      (d) => scaleY1(d["y1"]),
      d3.curveStep
    );
    drawData(
      g2,
      (d) => scaleX(d["x"]),
      (d) => scaleY2(d["y2"]),
      d3.curveNatural
    );

    g1.selectAll("circle").attr("fill", "green");
    g1.selectAll("path").attr("stroke", "cyan");

    g2.selectAll("circle").attr("fill", "blue");
    g2.selectAll("path").attr("stroke", "red");

    var axisMaker = d3.axisRight(scaleY1);
    axisMaker(svg.append("g").attr("color", "white"));
    axisMaker = d3.axisLeft(scaleY2);

    svg
      .append("g")
      .attr("transform", "translate(" + pointX + ", 0)")
      .attr("color", "white")
      .call(axisMaker);
    svg
      .append("g")
      .call(d3.axisTop(scaleX))
      .attr("transform", "translate(0," + pointY + ")")
      .attr("color", "white");
  });
}

```