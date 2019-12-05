
const features = ["SignFrequency(M)","Iconicity(M)","LexicalClass","SignType"];

const dict_lexical = {
    'N/A': 0,
    'LC1': 1,
    'LC2': 2,
    'LC3': 3,
    'LC4': 4,
    'LC5': 5,
    'LC6': 6,
    'LC7': 7
};
const dict_signtype = {
    'N/A': 0,
    'ST1': 1,
    'ST2': 2,
    'ST3': 3,
    'ST4': 4,
    'ST5': 5,
    'ST6': 6
};


let gbrushedSigns = localStorage.getItem("brushedSigns");
let gbrushed_arr;
if (gbrushedSigns !== null) {
    gbrushed_arr = gbrushedSigns.split(',')
}
let gbrushed_data = [];

let brush;

// set the dimensions and margins of the graph
const margin = { left: 60, top: 50, right: 10, bottom: 30};
let cWidth = 150,
    cHeight = 150,
    width = (cWidth + margin.left + margin.right) * features.length,
    height = (cHeight + margin.top + margin.bottom) * features.length;
// set the ranges
let x = d3.scaleLinear().range([0, cWidth]);
let y = d3.scaleLinear().range([cHeight, 0]);


const svg = d3.select("#plt")
    .attr("width", "870")
    .attr("height", "800")
    .attr("overflow", "auto")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .append("g");

// Add brushing
brush = d3.brush()
    .extent([[margin.left, margin.top], [width, height]])
    .on("brush", highlightDots)
    .on("end", showGoTo);

svg.append("g")
    .attr("class", "brush")
    .call(brush);

// Function that is triggered when brushing is performed
function highlightDots() {
    let extent = d3.event.selection;
    let dots = svg.selectAll('.dot');
    dots.classed('extent', false);

    let inBound = [];
    dots["_groups"][0].forEach(function (d) {
        if (isBrushed(extent, d.getAttribute("abs_x"), d.getAttribute("abs_y"))) {
            inBound.push(d.__data__.Code);
        }
    });

    dots.classed("selected", function (d) {
        return inBound.includes(d.Code);
    });

    // displaySelected(inBound);
    localStorage.clear();
    localStorage.setItem("brushedSigns", inBound);

}

function isBrushed(brush_coords, cx, cy) {
    let x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
}

function showGoTo() {
    let bbx = svg.selectAll('rect')._groups[0][1];
    let px = bbx.getBoundingClientRect().x + bbx.getBoundingClientRect().width * 0.3,
        py = bbx.getBoundingClientRect().y + bbx.getBoundingClientRect().height - 20;
    let d = document.getElementById("goto");
    d.style.position = "absolute";
    d.style.left = px + 'px';
    d.style.top = py +'px';
    d.style.display = "block";
}

function popupGo() {
    let cur_url = window.location.href.split('/');
    cur_url.pop();
    let goto_url = cur_url.join('/') + '/index.html' ;
    window.location.replace(goto_url);
}

const promise = d3.csv("data/subdf_ind_w_entryID.csv").then(function(data, error) {
    if (error) throw error;

    if (gbrushed_arr === undefined) {
        gbrushed_data = data;
    } else {
        data.forEach(function (d) {
            if (gbrushed_arr.includes(d.Code)) {
                gbrushed_data.push(d);
            }
        });
    }
});

promise.then(
    function(fulfilled) {

        let i, j;
        for (j = 0; j < features.length; j++) {
            var xfeature = features[j];


            var gX = svg.append("g")
                .attr("id", xfeature)
                .attr("transform",
                    "translate(" + (j * (cWidth + margin.left + margin.right)) + "," + 0 + ")");
            gX.append("text")
                .attr("class", "label")
                .attr("x", cWidth / 2)
                .attr("y", margin.top - 10)
                .style("text-anchor", "center")
                .text(xfeature);

            var gY = svg.append("g")
                .attr("id", xfeature + 'Y')
                .attr("transform",
                    "translate(" + -10 + "," + (margin.top + j * (cHeight + margin.bottom)) + ")");
            gY.append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("x", - 0.5 * (cHeight + margin.bottom + margin.top))
                .attr("y", 20)
                .style("text-anchor", "center")
                .text(xfeature);


            for (i = 0; i < features.length; i++) {
                let yfeature = features[i];
                // Scale the range of the data
                x.domain([-0.5, d3.max(gbrushed_data, function (d) {
                    return Math.max(d[xfeature]) + 1;
                })]);
                y.domain([-0.5, d3.max(gbrushed_data, function (d) {
                    return Math.max(d[yfeature]) + 1;
                })]);

                // Add the scatterplot one by one
                let g = gX.append("g")
                    .attr("id", (yfeature + "-" + xfeature))
                    .attr("transform",
                        "translate(" + margin.left + "," + (margin.top + i * (cHeight + margin.bottom)) + ")");

                g.selectAll(".dot")
                    .data(gbrushed_data)
                    .enter().append("circle")
                    .classed("dot", true)
                    .attr("r", 4)
                    .attr("cx", function (d) {
                        return x(d[xfeature]);
                    })
                    .attr("cy", function (d) {
                        return y(d[yfeature]);
                    })
                    .attr("abs_x", function(d){
                        return(x(d[xfeature]) + (cWidth + margin.left + margin.right) * j + margin.left);
                    })
                    .attr("abs_y", function(d){
                        return(y(d[yfeature]) + (cHeight + margin.bottom) * i + margin.top);
                    })
                    .on("mouseenter", function () {
                        // // clear the brush or NOT
                        let nodes_selected = d3.selectAll(document.elementsFromPoint(d3.event.x, d3.event.y)).filter('.dot');
                        let codes_selected = nodes_selected._groups[0].map(a => a.__data__.Code);
                        svg.selectAll(".dot").classed("selected", function (d) {
                            return codes_selected.includes(d.Code);
                        });
                    })
                    .on("mouseout", function () {
                        svg.selectAll(".dot").classed("selected", false);
                    })
                    .append("title").text(function (d) {
                        //TODO
                        let title = "group in " + x.invert(x(d[xfeature])) + '-' + y.invert(y(d[yfeature]));
                        return title;
                    });

                // Add the Left Y Axis
                if(i === 2) {
                    // lexicalclass
                    g.append("g")
                        .attr('id', "y_axisL_" + i + j)
                        .call(d3.axisLeft(y)
                            .tickFormat(function (d, i) {
                                return Object.keys(dict_lexical)[i]
                            }))

                } else if (i === 3) {
                    g.append("g")
                        .attr('id', "y_axisL_" + i + j)
                        .call(d3.axisLeft(y)
                            .ticks(8)
                            .tickFormat(function (d, i) {
                                return Object.keys(dict_signtype)[i]
                            }))
                } else {
                    g.append("g")
                        .attr('id', "y_axisL_" + i + j)
                        .call(d3.axisLeft(y));
                }

                // Add the X Axix
                if (j === 2) {
                    g.append("g")
                        .attr('id', "x_axis_" + i + j)
                        .attr("transform", "translate(0," + cHeight + ")")
                        .call(d3.axisBottom(x)
                            .tickFormat(function (d, i) {
                                return Object.keys(dict_lexical)[i]
                            }))
                        .selectAll("text")
                        .attr("y", 0)
                        .attr("x", 9)
                        .attr("dy", ".35em")
                        .attr("transform", "rotate(90)")
                        .style("text-anchor", "start");
                } else if (j === 3) {
                    g.append("g")
                        .attr('id', "x_axis_" + i + j)
                        .attr("transform", "translate(0," + cHeight + ")")
                        .call(d3.axisBottom(x)
                            .ticks(8)
                            .tickFormat(function (d, i) {
                                return Object.keys(dict_signtype)[i]
                            }))
                        .selectAll("text")
                        .attr("y", 0)
                        .attr("x", 9)
                        .attr("dy", ".35em")
                        .attr("transform", "rotate(90)")
                        .style("text-anchor", "start");
                } else {
                    g.append("g")
                        .attr('id', "x_axis_" + i + j)
                        .attr("transform", "translate(0," + cHeight + ")")
                        .call(d3.axisBottom(x).ticks(8));
                }

            }

        }
    }, function (err) {
        console.log(err);
    }
);



function reset() {
    localStorage.clear();
    window.location.reload(false);
}