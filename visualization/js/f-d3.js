
// viewbox props for positing the svg element
// - hardcoded so assuming it may not scale well on different monitor sizes
let width = 1049.638916015625;
let height = 1117.893798828125;
let x = -260.77432250976562;
let y = -248.70765686035156

let brushedSigns = localStorage.getItem("brushedSigns");
// console.log(brushedSigns);
let brushed_arr;
if (brushedSigns !== null) {
    brushed_arr = brushedSigns.split(',')
}

let brushed_graph = {};
brushed_graph.nodes = [];
brushed_graph.links = [];

let gbrush; // this is for brushing in the graph

let svg = d3.select("#viz")
    .attr("width", "100%")
    .attr("height", "100%");

let viewBox = svg.attr("viewBox", `${x} ${y} ${width} ${height}`);
let container = svg.append("g");

// Add brushing
gbrush = d3.brush()
    .extent([[x, y], [width, height]])
    .on("brush", highlightDots)
    .on("end", popupGo);

svg.append("g")
    .attr("class", "brush")
    .call(gbrush);

// Function that is triggered when brushing is performed
function highlightDots() {
    let extent = d3.event.selection;
    let dots = svg.selectAll('.node');
    dots.classed('extent', false);

    let inBound = [];
    // console.log("LALA", dots);
    dots["_groups"][0].forEach(function (d) {
        if (isBrushed(extent, d.getAttribute("cx"), d.getAttribute("cy"))) {
            // console.log("HERE ", extent, d);
            inBound.push(d.getAttribute("id"));
        }
    });

    localStorage.clear();
    localStorage.setItem("gbrushedSigns", inBound);

}

// A function that return TRUE or FALSE according if a dot is in the selection or not
function isBrushed(brush_coords, cx, cy) {
    var x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
}

function popupGo() {
    let cur_url = window.location.href.split('/');
    cur_url.pop();
    let goto_url = cur_url.join('/') + '/scatterplot_mat.html' ;
    window.location.replace(goto_url);
}


const promise = d3.json("data/graph.json").then(function (graph) {

    if (brushed_arr === undefined) {
        brushed_graph = graph;
    } else {
        graph.nodes.forEach(function (d) {
            //TODO: could be faster
            if (brushed_arr.includes(d.Code)) {
                brushed_graph.nodes.push(d);
            }
        });
        graph.links.forEach(function (d) {
            //TODO: faster how?
            //TODO: is the src and tgt symm?
            if (brushed_arr.includes(d.source) && brushed_arr.includes(d.target)
                || brushed_arr.includes(d.target) && brushed_arr.includes(d.source)) {
                brushed_graph.links.push(d);
            }
        });
    }
});

// console.log(promise);

promise.then(
    function(fulfilled) {
        console.log(fulfilled);
        console.log(brushed_graph);

        let node = container.append("g").attr("class", "nodes")
            .selectAll('g')
            .data(brushed_graph.nodes)
            .enter()
            .append("circle")
            .classed("node", true)
            .on("mouseenter", function (d,i) {
                console.log(d);
                d3.select(this)
                    .attr("r", function (d) {
                        return 10;
                    })
                // handleNodeEvent(d);
            })
            .on("mouseout", function (d,i) {
                d3.select(this)
                    .attr("r", function (d) {
                        return 3.5;
                    })
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
            })
            .attr("id", function (d) {
                return d.Code;
            })
            .append("title").text(function (d) {
                return d.EntryID;
            });


        let link = container.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(brushed_graph.links)
            .enter()
            .append("line")
            .attr("stroke", "#aaa")
            .attr("x1", function (l) {
                // get the x cord value of the source
                let sourceX = brushed_graph.nodes.filter((node, i) => {
                    return node.Code === l.source;
                })[0];
                d3.select(this).attr("y1", sourceX.y);
                return sourceX.x;
            })
            .attr("x2", function (l) {
                // get the x cord of the target
                let targetX = brushed_graph.nodes.filter((node, i) => {
                    return node.Code === l.target;
                })[0];

                d3.select(this).attr("y2", targetX.y);
                return targetX.x;
            })
            .attr("stroke-width", function (l) {

            });

    }, function (err) {
        console.log(err)
    }
);

function reset() {
    localStorage.clear();
    window.location.reload(false);
}
