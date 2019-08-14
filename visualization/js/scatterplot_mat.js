
let brush;
let features = ["SignFrequency(M)","Iconicity(M)","LexicalClass","SignType"];
const dict_lexical = {
    'nan': 0,
    'Minor': 1,
    'Noun': 2,
    'Adjective': 3,
    'Name': 4,
    'Number': 5,
    'Adverb': 6,
    'Verb': 7
};
console.log(Object.keys(dict_lexical));
console.log(Object.values(dict_lexical));
const dict_signtype = {
    'nan': 0,
    'DominanceViolation': 1,
    'AsymmetricalDifferentHandshape': 2,
    'OneHanded': 3,
    'AsymmetricalSameHandshape': 4,
    'SymmetricalOrAlternating': 5,
    'SymmetryViolation': 6
};





// set the dimensions and margins of the graph
var margin = { left: 50, top: 50, right: 10, bottom: 20},
    cWidth = 150,
    cHeight = 150,
    width = (cWidth + margin.left + margin.right) * features.length,
    height = (cHeight + margin.top + margin.bottom) * features.length;
// set the ranges
var x = d3.scaleLinear().range([0, cWidth]);
var y = d3.scaleLinear().range([cHeight, 0]);


// append the svg object to the div whose id=viz
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin

const svg = d3.select("#plt")
    .attr("width", "80%")
    .attr("height", "100%")
    .append("g");

// let viewBox = svg.attr("viewBox", `${sx} ${sy} ${swidth} ${sheight}`);
// let container = svg.append("g");

var grid = [...Array(features.length)].map(e => Array(features.length));

// Add brushing
brush = d3.brush()
    .extent([[margin.left, margin.top], [width, height]])
    .on("brush", highlightDots)
    .on("end", popupGo)

// svg.call(brush);
svg.append("g")
    .attr("class", "brush")
    .call(brush);

// Function that is triggered when brushing is performed
function highlightDots() {
    let extent = d3.event.selection;
    console.log(extent);
    let dots = svg.selectAll('.dot');
    dots.classed('extent', false);

    let inBound = [];
    dots["_groups"][0].forEach(function (d) {
        if (isBrushed(extent, d.getAttribute("abs_x"), d.getAttribute("abs_y"))) {
            // console.log("HERE ", extent, d);
            // console.log("(abs_x, abs_y)=", d.getAttribute("abs_x"), d.getAttribute("abs_y"));
            // console.log("(cx, cy)=", d.getAttribute("cx"), d.getAttribute("cy"));
            inBound.push(d.__data__.Code);
        }
    });

    dots.classed("selected", function (d) {
        return inBound.includes(d.Code);
    });

    console.log(inBound);
    // displaySelected(inBound);
    localStorage.clear();
    localStorage.setItem("signs", inBound);

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
    let goto_url = cur_url.join('/') + '/index.html' ;
    window.location.replace(goto_url);
}

// Get the data
// d3.csv("data/scatterplot_data.csv", function (error, data) {
d3.csv("plotting/src/scatterplot_matrix/subdf_ind_cat.csv").then(function(data, error) {
    if (error) throw error;

    let i, j;
    for (j = 0; j < features.length; j++) {
        var xfeature = features[j];

        // console.log(xfeature);

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
                "translate(" + 0 + "," + (margin.top + j * (cHeight + margin.bottom)) + ")");
        gY.append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", - 0.5 * (cHeight + margin.bottom + margin.top))
            .attr("y", 20)
            .style("text-anchor", "center")
            .text(xfeature);

        // let current = features[j];
        // let itemsWithoutCurrent = features.filter(function(x) { return x !== current; });

        for (i = 0; i < features.length; i++) {
            var yfeature = features[i];
            // Scale the range of the data
            x.domain([-0.5, d3.max(data, function (d) {
                return Math.max(d[xfeature]) + 1;
            })]);
            y.domain([-0.5, d3.max(data, function (d) {
                return Math.max(d[yfeature]) + 1;
            })]);

            // Add the scatterplot one by one
            var g = gX.append("g")
                .attr("id", (yfeature + "-" + xfeature))
                .attr("transform",
                    "translate(" + margin.left + "," + (margin.top + i * (cHeight + margin.bottom)) + ")");

            g.selectAll(".dot")
                .data(data)
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
                    // return(y(d[xfeature]) + (cWidth + margin.left + margin.right) * j + margin.left);
                })
                .attr("abs_y", function(d){
                    return(y(d[yfeature]) + (cHeight + margin.bottom) * i + margin.top);
                })
                .on("mouseenter", function () {
                    // // clear the brush or NOT
                    // d3.select(".brush").style("opacity", 0.5);
                    let nodes_selected = d3.selectAll(document.elementsFromPoint(d3.event.x, d3.event.y)).filter('.dot');
                    let codes_selected = nodes_selected._groups[0].map(a => a.__data__.Code);
                    svg.selectAll(".dot").classed("selected", function (d) {
                        return codes_selected.includes(d.Code);
                    });
                    console.log(codes_selected);
                    // displaySelected(codes_selected);
                })
                .on("mouseout", function () {
                    svg.selectAll(".dot").classed("selected", false);
                })
                .append("title").text(function (d) {
                //TODO
                let title = "group in " + x.invert(x(d[xfeature])) + '-' + y.invert(y(d[yfeature]));
                return title;
                // })
                // .on('mousedown', function(d){
                //   var e = brush.extent(),
                //       m = d3.mouse(svg.node()),
                //       p = [x.invert(m[0]), y.invert(m[1])];
                //
                //   if ( brush.empty() ||
                //       (e[0][0] > d[0] || d[0] > e[1][0]
                //           || e[0][1] > d[1] || d[1] > e[1][1] )
                //   ) {
                //       brush.extent([p,p]);
                //   } else {
                //       d3.select(this).classed('extent', true);
                //   }
            });


            // Add the X Axix
            if (i === 3 && j === 2) {
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
                // svg.select("#x_axis_32").
            }
            else if (i === 3 && j === 3) {
                g.append("g")
                    .attr('id', "x_axis_" + i + j)
                    .attr("transform", "translate(0," + cHeight + ")")
                    // .attr("transform", "rotate(-90)")
                    .call(d3.axisBottom(x)
                        .tickFormat(function (d, i) {
                            return Object.keys(dict_signtype)[i]
                        }))
                    .selectAll("text")
                    .attr("y", 0)
                    .attr("x", 9)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(90)")
                    .style("text-anchor", "start");
            }
            else {
                g.append("g")
                    .attr('id', "x_axis_" + i + j)
                    .attr("transform", "translate(0," + cHeight + ")")
                    .call(d3.axisBottom(x)
                    );
            }

            // Add the Left Y Axis
            g.append("g")
                .attr('id', "y_axisL_" + i + j)
                .call(d3.axisLeft(y));

            if (j === 3) {
                if (i === 2) {
                    g.append("g")
                        .attr('id', "y_axisR_" + i + j)
                        .attr("transform", "translate(" + cWidth + ", 0)")
                        .call(d3.axisRight(y)
                            .tickFormat(function (d, i) {
                                return Object.keys(dict_lexical)[i]
                            }))
                }

                else if (i === 3) {
                    g.append("g")
                        .attr('id', "y_axisR_" + i + j)
                        .attr("transform", "translate(" + cWidth + ", 0)")
                        .call(d3.axisRight(y)
                            .tickFormat(function (d, i) {
                                return Object.keys(dict_signtype)[i]
                            }))
                }
                else {
                    g.append("g")
                        .attr('id', "y_axisR_" + i + j)
                        .attr("transform", "translate(" + cWidth + ", 0)")
                        .call(d3.axisRight(y));
                }

            }

        }
    }



});

function displaySelected (sList){
    document.getElementById('signList').innerHTML = '';
    console.log(sList);
    sList.forEach(function (s) {
        document.getElementById('signList').innerHTML += '<li>' + s + '</li>';
    });
}
