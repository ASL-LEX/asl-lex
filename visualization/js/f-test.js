var data = {
   nodes: [{
     name: "A",
     x: 200,
     y: 150
   }, {
     name: "B",
     x: 0,
     y: 0
   }, {
     name: "C",
     x: -300,
     y: 300
   }, {
     name: "D",
     x: 300,
     y: 180
   }],
   links: [{
     source: 0,
     target: 1
   }, {
     source: 1,
     target: 2
   }, {
     source: 2,
     target: 3
   }, ]
 };

 var c10 = d3.scale.category10();
 var svg = d3.select("body")
   .append("svg")
   .attr("width", 800)
   .attr("height", 600);

 // var drag = d3.behavior.drag()
 //   .on("drag", function(d, i) {
 //     d.x += d3.event.dx
 //     d.y += d3.event.dy
 //     d3.select(this).attr("cx", d.x).attr("cy", d.y);
 //     links.each(function(l, li) {
 //       if (l.source == i) {
 //         d3.select(this).attr("x1", d.x).attr("y1", d.y);
 //       } else if (l.target == i) {
 //         d3.select(this).attr("x2", d.x).attr("y2", d.y);
 //       }
 //     });
 //   });

 var links = svg.selectAll("link")
   .data(data.links)
   .enter()
   .append("line")
   .attr("class", "link")
   .attr("x1", function(l) {
     var sourceNode = data.nodes.filter(function(d, i) {
       return i == l.source
     })[0];
     d3.select(this).attr("y1", sourceNode.y);
     return sourceNode.x
   })
   .attr("x2", function(l) {
     var targetNode = data.nodes.filter(function(d, i) {
       return i == l.target
     })[0];
     d3.select(this).attr("y2", targetNode.y);
     return targetNode.x
   })
   .attr("fill", "none")
   .attr("stroke", "blue");

 var nodes = svg.selectAll("node")
   .data(data.nodes)
   .enter()
   .append("circle")
   .attr("class", "node")
   .attr("cx", function(d) {
     return d.x
   })
   .attr("cy", function(d) {
     return d.y
   })
   .attr("r", 15)
   .attr("fill", function(d, i) {
     return c10(i);
   })
   // .call(drag);