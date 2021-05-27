
const features = ["SignFrequency(M)","Iconicity(M)","LexicalClass","Neighborhood Density 2.0"];

const dict_lexical = {
    'N/A': 0,
    'Number': 1,
    'Name': 2,
    'Adj': 3,
    'Verb': 4,
    'Noun': 5,
    'Adv': 6,
    'Minor': 7
}

let gbrushedSigns;
let gbrushed_arr;

let gbrushed_data = [];
let tempBrushedSigns =[]
let brush;

// set the dimensions and margins of the graph
const margin = { left: 70, top: 25, right: 10, bottom: 45};
let cWidth = 150,
    cHeight = 150,
    width = (cWidth + margin.left + margin.right) * features.length,
    height = (cHeight + margin.bottom) * features.length + margin.top;
// set the ranges
let x = d3.scaleLinear().range([0, cWidth]);
let y = d3.scaleLinear().range([cHeight, 0]);
let signdataHoverMainHolder = $("#signDataHoverMainHolder");

// LOADER
$('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');

$('[data-toggle="popover"]').popover({
    title: 'View Options',
    content: '<a class="themedLinks" id="networkGraphLink">View network graph</a><br><a class="themedLinks" target="_blank" href="viewdata.html">View properties of brushed data </a>',
    html: true
});


$(window).on('load', function(){
    setTimeout(removeLoader, 50); //wait for page load PLUS less than 1 second.
});
function removeLoader(){
    $( "#loadingDiv" ).fadeOut(500, function() {
        // fadeOut complete. Remove the loading div
        $( "#loadingDiv" ).remove(); //makes page more lightweight
    });
}

// ON DOCUMENT LOAD
$(document).ready(function () {
    localStorage.removeItem('gCodes');
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#dismiss').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.sidebar-overlay').removeClass('active');
        // make graph location responsive to sidebar, so pairplots are always visible
        $('#graph-box').attr('style', 'margin-left: ' + (0).toString() + "px")
        $('#graph-box').attr('style', 'margin: auto')
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.sidebar-overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
        // make graph location responsive to sidebar, so pairplots are always visible
        $('#graph-box').attr('style', 'margin: 0')
        $('#graph-box').attr('style', 'margin-left: ' + (350).toString() + "px")
    });

    // $('[data-toggle="tooltip"]').tooltip();
    // $("body").tooltip({selector: '[data-toggle=tooltip]'});
    //
    // addTooltipText();

    $('#sidebarCollapse').click();
});


$(document).on("click", "#networkGraphLink", function() {
    //Set temp brushed signs to brushedSigns and redirect
    localStorage.setItem("brushedSigns", tempBrushedSigns);
    goToNetworkGraph();
});


const svg = d3.select("#plt")
    .attr("width", width)
    .attr("height", height)
    .attr("overflow", "auto")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    // .append("g");

// Add brushing
brush = d3.brush()
    .extent([[margin.left, margin.top], [width, height]])
    .on("brush", highlightDots)
    .on("end", showGoTo);

brushableArea = svg.append("g")
    .attr("class", "brush")
    .call(brush);

$('body').on('click', function (e) {
    //only buttons
    if ($(e.target).data('toggle') !== 'popover'
        && $(e.target).parents('.popover.in').length === 0) {
        $("#click-me").hide();
        $('[data-toggle="popover"]').popover('hide');
    }

    //buttons and icons within buttons
    /*
    if ($(e.target).data('toggle') !== 'popover'
        && $(e.target).parents('[data-toggle="popover"]').length === 0
        && $(e.target).parents('.popover.in').length === 0) {
        $('[data-toggle="popover"]').popover('hide');
    }
    */
});

//
// svg.on("click", function (g) {
//     // $("#click-me").hide();
//     $("[data-toggle='popover']").popover('hide');
//
// });

// Function that is triggered when brushing is performed
function highlightDots() {
    $("#click-me").show()
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
    tempBrushedSigns = inBound;

    localStorage.setItem('gCodes', inBound);
    // localStorage.setItem("brushedSigns", inBound);

}

function resetBrush() {
    brushableArea.call(brush.move, null);

    let d = document.getElementById("goto");
    d.style.display = "none";

    //Remove any added localstorage items that came in from brushing
    localStorage.removeItem("brushedSigns");

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
    let goto_url = cur_url.join('/') + '/index.html';
    window.location.replace(goto_url);
}

function goToNetworkGraph() {
    let cur_url = window.location.href.split('/');
    cur_url.pop();
    let goto_url = cur_url.join('/') + '/index.html?fromPairPlots=True' ;
    window.location.replace(goto_url);
}

const promise = d3.csv("data/density_subdf_ind_w_entryID.csv").then(function(data, error) {
    if (error) throw error;

    //If not coming from network graph
    if (!window.location.href.split('/').pop().includes("fromNetwork=True")) {
        //Remove all localstorage history
        localStorage.removeItem("brushedSigns");
        localStorage.removeItem('constraints');
        localStorage.removeItem('filters');
    } else {

        //Otherwise get data saved in localstorage
        gbrushedSigns = localStorage.getItem("brushedSigns");
        if (gbrushedSigns !== null) {
            gbrushed_arr = gbrushedSigns.split(',')
        }

    }

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
                .attr("class", "standard-label-text")
                .attr("x", margin.left + cWidth / 2)
                .attr("y", margin.top - 5)
                .style("text-anchor", "middle")
                .text(xfeature);

            var gY = svg.append("g")
                .attr("id", xfeature + 'Y')
                .attr("transform",
                    "translate(" + 0 + "," + (margin.top + j * (cHeight + margin.bottom)) + ")");
            gY.append("text")
                .attr("class", "standard-label-text")
                .attr("transform", "rotate(-90)")
                .attr("x", - 0.5 * (cHeight))
                .attr("y", 20)
                .style("text-anchor", "middle")
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
                        let entryIDs_selected = nodes_selected._groups[0].map(a => ((a.__data__.EntryID).split("_")).join(" "));
                        svg.selectAll(".dot").classed("selected", function (d) {
                            return codes_selected.includes(d.Code);
                        });
                        signdataHoverMainHolder.empty()
                        // let signdataHoverList = $("#signDataHoverList");
                        // if(signdataHoverList.length){
                        //     signdataHoverList[0].remove();
                        // }

                        signdataHoverMainHolder.append("<div class='standard-label-text standard-label-text' id='signsUnderCursor'>"  + "Signs under cursor selection" + "</div>");
                        signdataHoverMainHolder.append("<ul id='signDataHoverList'>" );
                        entryIDs_selected.forEach(function(value){
                            $("#signDataHoverList").append("<li class='standard-label-text'>"  + value + "</li>");
                        });

                        signdataHoverMainHolder.show();

                    })
                    //// The behavior below is commented out because the signs under the selected nodes
                    //// stay in the sidebar even when the user is no longer hovering. I think the signs
                    //// displayed in the sidebar should be highlighted if they are listed, which means
                    //// the signs should not be deselected on mouseout if the signs are also not removed
                    //// from the sidebar on mouseout.
                    // .on("mouseout", function () {
                    //
                    //     svg.selectAll(".dot").classed("selected", false);
                    // });


                // Add the Left Y Axis
                if(i === 1) {
                    // lexicalclass
                    g.append("g")
                      .attr('id', "y_axisL_" + i + j)
                      .call(d3.axisLeft(y)
                        .tickFormat(function (d, i) {
                            return ['N/A', '1', '2', '3', '4', '5', '6', '7'][i]
                        }))
                }

                else if(i === 2) {
                    // lexicalclass
                    g.append("g")
                        .attr('id', "y_axisL_" + i + j)
                        .call(d3.axisLeft(y)
                            .tickFormat(function (d, i) {
                                return Object.keys(dict_lexical)[i]
                            }))

                }
                // else if (i === 3) {
                //     g.append("g")
                //         .attr('id', "y_axisL_" + i + j)
                //         .call(d3.axisLeft(y)
                //             .ticks(8)
                //             .tickFormat(function (d, i) {
                //                 return Object.keys(dict_signtype)[i]
                //             }))
                // }
                else {
                    g.append("g")
                        .attr('id', "y_axisL_" + i + j)
                        .call(d3.axisLeft(y));
                }

                // Add the X Axis

                if (j === 1) {
                    g.append("g")
                      .attr('id', "x_axis_" + i + j)
                      .attr("transform", "translate(0," + cHeight + ")")
                      .call(d3.axisBottom(x)
                        .tickFormat(function (d, i) {
                            return ['N/A', '1', '2', '3', '4', '5', '6', '7'][i]
                        }))
                      .selectAll("text")
                      .attr("y", 0)
                      .attr("x", 9)
                      .attr("dy", ".35em")
                      .attr("transform", "rotate(90)")
                      .style("text-anchor", "start");
                }
                else if (j === 2) {
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
                }
                // else if (j === 3) {
                //     g.append("g")
                //         .attr('id', "x_axis_" + i + j)
                //         .attr("transform", "translate(0," + cHeight + ")")
                //         .call(d3.axisBottom(x)
                //             .ticks(8)
                //             .tickFormat(function (d, i) {
                //                 return Object.keys(dict_signtype)[i]
                //             }))
                //         .selectAll("text")
                //         .attr("y", 0)
                //         .attr("x", 9)
                //         .attr("dy", ".35em")
                //         .attr("transform", "rotate(90)")
                //         .style("text-anchor", "start");
                // }
                else {
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
