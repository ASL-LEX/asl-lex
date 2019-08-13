
let bboxButton = document.getElementById('bbox-button');
// viewbox props for positing the svg element
// - hardcoded so assuming it may not scale well on different monitor sizes
let width = 1049.638916015625;
let height = 1117.893798828125;
let x = -260.77432250976562;
let y = -248.70765686035156

// zooming in - centering for node
let center;
let active = d3.select(null); // increase node side when selected

d3.json("data/graph.json").then(function (graph) {

    // store data into separate objects may need for certain functionality
    let graphObj = {
        "nodes": [],
        "links": []
    };

    let label = {
        'nodes': [],
        'links': []
    };

    graph.nodes.forEach(function (d, i) {
        label.nodes.push({
            node: d
        });
    });

    let adjlist = [];

    graph.links.forEach(function (d) {
        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
    });

    function neigh(a, b) {
        return a == b || adjlist[a + "-" + b];
    }

    let svg = d3.select("#viz")
        .attr("width", "90%")
        .attr("height", "90%");

    let viewBox = svg.attr("viewBox", `${x} ${y} ${width} ${height}`)


    let container = svg.append("g");

    // handling of zoom
    let zoom = d3.zoom()
        .scaleExtent([.32, 8])
        .on("zoom", zoomed);

    // handling for zoom
    function zoomed() {
        container.attr("transform", d3.event.transform);
    }

    svg.call(zoom);

    let link = container.append("g")
        .attr("class", "links")
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
            d3.select(this).attr("y1", sourceX.y);
            return sourceX.x;
        })
        .attr("x2", function (l) {
            // get the x cord of the target
            let targetX = graph.nodes.filter((node, i) => {
                return node.Code === l.target;
            })[0];

            d3.select(this).attr("y2", targetX.y);
            return targetX.x;
        })
        .attr("stroke-width", function(l){

        });


    let tooltip = d3.select("#svg").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    let node = container.append("g").attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .on("click", function(d, i) {
            console.log(d);
            handleNodeEvent(d);
        })
        .attr("r", function (d) {
            return 3.5;
        })
        .attr("fill", function (d) {
            return d.color_code;
        })
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        });


    let labelNode = container.append("g").attr("class", "labelNodes")
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

    node.on("mouseover", focus).on("mouseout", unfocus);

    // handling on load view of graph
    // let bbox, viewBox, vx, vy, vw, vh, defaultView

    function getBboxCords() {
        bbox = container.node().getBBox();
        console.log(bbox);
        return bbox;
    }

    function ticked() {

        node.call(updateNode);
        link.call(updateLink);

        labelLayout.alphaTarget(0.3).restart();
        labelNode.each(function (d, i) {
            if (i % 2 == 0) {
                d.x = d.node.x;
                d.y = d.node.y;
            } else {
                let b = this.getBBox();

                let diffX = d.x - d.node.x;
                let diffY = d.y - d.node.y;

                let dist = Math.sqrt(diffX * diffX + diffY * diffY);

                let shiftX = b.width * (diffX - dist) / (dist * 2);
                shiftX = Math.max(-b.width, Math.min(0, shiftX));
                let shiftY = 16;
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
                let b = this.getBBox();

                let diffX = d.x - d.node.x;
                let diffY = d.y - d.node.y;

                let dist = Math.sqrt(diffX * diffX + diffY * diffY);

                let shiftX = b.width * (diffX - dist) / (dist * 2);
                shiftX = Math.max(-b.width, Math.min(0, shiftX));
                let shiftY = 16;
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
        let index = d3.select(d3.event.target).datum().index;
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
        link.attr("x1", function (d) {
                return fixna(d.source.x);
            })
            .attr("y1", function (d) {
                return fixna(d.source.y);
            })
            .attr("x2", function (d) {
                return fixna(d.target.x);
            })
            .attr("y2", function (d) {
                return fixna(d.target.y);
            });
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
        let positions = graph.nodes.map(function (d) {
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
        let data = JSON.stringify(graphObj);
        let blob = new Blob([data], {
            type: "application/json"
        });
        let url = URL.createObjectURL(blob);

        let a = document.createElement('a')
        a.download = "backup.json";
        a.href = url;
        a.textContent = "Download backup.json";

        document.getElementById('content').appendChild(a);
    };

    // function to reset the SVG to its original position
    function reset() {
        active.classed("active", false);
        active = d3.select(null);

        // transition the view back to original view size
    }

    // handling of zooming in on node when clicked
    function handleNodeEvent(node) {
        if (active.node() === this) return reset();

        let scaleZoom = 2;

        // zoom into the node
        console.log(zoom.transform);
        svg.call(zoom.transform, [node.x, node.y]);
    }

});