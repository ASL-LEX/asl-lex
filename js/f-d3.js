var width = 800;
var height = 600;
var color = d3.scaleOrdinal(d3.schemeCategory10);

d3.json("../data/backup_new.json").then(function (graph) {

    // store data into sperate objects may need for certain functionality
    var graphObj = {
        "nodes": [],
        "links": []
    };

    graph.nodes.forEach((node) => {
        // create an object and store the contents thats in node
        // can probably do this using destructuring
        node_obj = {
            "EntryID": node['EntryID'],
            "Code": node['Code'],
            "NeighborhoodDensity": node['NeighborhoodDensity']
        };

        // push the object to the graphObj
        graphObj.nodes.push(node_obj);
    });

    // console.log(graphObj.nodes.length); // 2411 nodes as of now

    graph.links.forEach((link) => {
        // create an link obj and store the contents of Link
        link_obj = {
            "target": link['target'],
            "source": link['source']
        };

        // push the obj into the graph obj
        graphObj.links.push(link_obj);
    });

    var label = {
        'nodes': [],
        'links': []
    };

    graph.nodes.forEach(function (d, i) {
        label.nodes.push({
            node: d
        });
        // label.nodes.push({
        //     node: d
        // });
        // label.links.push({
        //     source: i * 2,
        //     target: i * 2 + 1
        // });
    });

    // var labelLayout = d3.forceSimulation(label.nodes)
    //     .force("charge", d3.forceManyBody().strength(10))
    //     .force("link", d3.forceLink(label.links).distance(0).strength(2));

    // var graphLayout = d3.forceSimulation(graph.nodes)
    //     .force("charge", d3.forceManyBody(-1000).strength(-1000))
    //     .force("center", d3.forceCenter(width / 2, height / 2))
    //     .force("x", d3.forceX(width / 2).strength(1))
    //     .force("y", d3.forceY(height / 2).strength(1))
    //     .force("collide", d3.forceCollide().strength(1).radius(25).iterations(25))
    //     .force("link", d3.forceLink(graph.links).id(function (d) {
    //         return d.Code;
    //     }).distance(5).strength(1))
    //     .on("tick", ticked);

    var adjlist = [];

    graph.links.forEach(function (d) {
        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
    });

    function neigh(a, b) {
        return a == b || adjlist[a + "-" + b];
    }


    var svg = d3.select("#viz").attr("width", width).attr("height", height).on('click', function() {
    console
      console.log( d3.event.pageX, d3.event.pageY ) // log the mouse x,y position
    });;
    var container = svg.append("g");

    svg.call(
        d3.zoom()
        // .scaleExtent([.1, 2])
        .on("zoom", function () {
            container.attr("transform", d3.event.transform);
        })
    );

    var link = container.append("g").attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke", "#aaa")
    .attr("x1", function (l) {
        // get the x cord value of the source
        let sourceX = graph.nodes.filter((node, i) => {
            return node.Code === l.source;
        })[0];
        // if(sourceX.Code === "C_03_046" || sourceX.Code === "A_02_006"){
        //     console.log("in edge render")
        //     console.log(sourceX)
        // }
        // attach it to the x1 attribute
        d3.select(this).attr("y1", sourceX.y);
        return sourceX.x;
    })

    .attr("x2", function (l) {
        // get the x cord of the target
        let targetX = graph.nodes.filter((node, i) => {
            return node.Code === l.target;
        })[0];

        // if(targetX.Code === "C_03_046" || targetX.Code === "A_02_006"){
        //     console.log("in edge render")
        //     console.log(targetX)
        // }
        d3.select(this).attr("y2", targetX.y);
        return targetX.x;
    })        
    .attr("stroke-width", function(l){
        if(l.source === "C_03_046" && l.target === "A_02_006"){
            // console.log(this)
        }
    });


    var tooltip = d3.select("#svg").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);


    var node = container.append("g").attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", function (d) {
            return 3;
        })

        .on("mouseover", function(d) {     
            console.log("hiiii") 
            console.log("x,y in pixel")
            console.log( d3.select(this).attr("cx"),  d3.select(this).attr("cy"))
        })                  
        .on("mouseout", function(d) {       
          tooltip.transition().duration(500).style("opacity", 0);   
        })
        .attr("fill", function (d) {


        if(d.Code === "C_03_046" || d.Code === "A_02_006"){
            console.log("in node render")
            console.log(d)
            return "#96cb7"
        }else{

            return d.color_code;
        }

        })
    // give it an x and y cord
    .attr("cx", function (d) {

        return d.x;
    })
    .attr("cy", function (d) {
        return d.y;
    })
    .attr("transform", function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
    })
    .on("click", function (d) {
        // console.log("Code: " + d.Code);
        // console.log("EntryID: " + d.EntryID);
        // console.log("X cordinate: " + d.x);
        // console.log("Y cordinate: " + d.y);
    })

    // node.on("mouseover", focus).on("mouseout", unfocus);

    // node.call(
    //     d3.drag()
    //     .on("start", dragstarted)
    //     .on("drag", dragged)
    //     .on("end", dragended)
    // );

    var labelNode = container.append("g").attr("class", "labelNodes")
        .selectAll("text")
        .data(label.nodes)
        .enter()
        .append("text")
        .text(function (d, i) {
            return i % 2 == 0 ? "" : d.node.id;
        })
        .style("fill", "#555")
        .style("font-family", "Arial")
        .style("font-size", 12)
        .style("pointer-events", "none"); // to prevent mouseover/drag capture

    // node.on("mouseover", focus).on("mouseout", unfocus);

    function ticked() {

        node.call(updateNode);
        link.call(updateLink);

        labelLayout.alphaTarget(0.3).restart();
        labelNode.each(function (d, i) {
            if (i % 2 == 0) {
                d.x = d.node.x;
                d.y = d.node.y;
            } else {
                var b = this.getBBox();

                var diffX = d.x - d.node.x;
                var diffY = d.y - d.node.y;

                var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                var shiftX = b.width * (diffX - dist) / (dist * 2);
                shiftX = Math.max(-b.width, Math.min(0, shiftX));
                var shiftY = 16;
                this.setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
            }
        });
        labelNode.call(updateNode);
        link.call(updateLink);

        labelLayout.alphaTarget(0.3).restart();
        labelNode.each(function (d, i) {
            if (i % 2 == 0) {
                d.x = d.node.x;
                d.y = d.node.y;
            } else {
                var b = this.getBBox();

                var diffX = d.x - d.node.x;
                var diffY = d.y - d.node.y;

                var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                var shiftX = b.width * (diffX - dist) / (dist * 2);
                shiftX = Math.max(-b.width, Math.min(0, shiftX));
                var shiftY = 16;
                this.setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
            }
        });
        labelNode.call(updateNode);

    }

    function fixna(x) {
        if (isFinite(x)) return x;
        return 0;
    }

    function focus(d) {
        var index = d3.select(d3.event.target).datum().index;
        node.style("opacity", function (o) {
            return neigh(index, o.index) ? 1 : 0.1;
        });
        labelNode.attr("display", function (o) {
            return neigh(index, o.node.index) ? "block" : "none";
        });
        link.style("opacity", function (o) {
            return o.source.index == index || o.target.index == index ? 1 : 0.1;
        });
    }

    function unfocus() {
        labelNode.attr("display", "block");
        node.style("opacity", 1);
        link.style("opacity", 1);
    }

    function updateLink(link) {
        // link.attr("x1", function (d) {
        //         return fixna(d.source.x);
        //     })
        //     .attr("y1", function (d) {
        //         return fixna(d.source.y);
        //     })
        //     .attr("x2", function (d) {
        //         return fixna(d.target.x);
        //     })
        //     .attr("y2", function (d) {
        //         return fixna(d.target.y);
        //     });
    }

    function updateNode(node) {
        node.attr("transform", function (d) {
            return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
        });
    }

    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) graphLayout.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    // getting the x an y positions once the page full loads

    let getCords = function () {
        // getting the node positions
        console.log("getting cords for x and y");
        var positions = graph.nodes.map(function (d) {
            // return it as an object
            return {
                "EntryID": d.EntryID,
                "Code": d.Code,
                "NeighborhoodDensity": d.NeighborhoodDensity,
                "group_id": d.group_id,
                "color_code": d.color_code,
                "x": d.x,
                "y": d.y,
            };
        });

        // update the graph object
        graphObj.nodes = positions;

        // download the file
        // uncomment this to download the file
        var data = JSON.stringify(graphObj);
        var blob = new Blob([data], {
            type: "application/json"
        });
        var url = URL.createObjectURL(blob);

        var a = document.createElement('a')
        a.download = "backup.json";
        a.href = url;
        a.textContent = "Download backup.json";

        document.getElementById('content').appendChild(a);
    };
    //
    node_cords = setTimeout(getCords, 93000);
});