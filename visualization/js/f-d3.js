let color = d3.scaleOrdinal(d3.schemeCategory10);

d3.json("data/graph.json").then(function (graph) {

    let svg = d3.select("#viz").attr("width", '100%').attr("height", '100%').call(responsivefy);
    let container = svg.append("g");

    svg.call(
        d3.zoom()
        .scaleExtent([.8, 0.1])
        .on("zoom", function () {
            container.attr("transform", d3.event.transform);

        })
    );

    let link = container.append("g").attr("class", "links")
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

    let node = container.append("g").attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", function (d) {
            return 3;
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

    node.on("mouseover", focus).on("mouseout", unfocus);

    function neigh(a, b) {
        return a == b || adjlist[a + "-" + b];
    }

    function ticked() {

        node.call(updateNode);
        link.call(updateLink);
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
        link.style("opacity", function (o) {
            return o.source.index == index || o.target.index == index ? 1 : 0.1;
        });
    }

    function unfocus() {
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

    //reference: https://brendansudol.com/writing/responsive-d3
    function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type, 
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}

    // getting the x an y positions once the page full loads

    function getCords(){
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
    
});