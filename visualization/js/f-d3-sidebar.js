// viewbox props for positing the svg element
// - hardcoded so assuming it may not scale well on different monitor sizes
let width = 2000;
let height = 2000;
let x = -600;
let y = -300;

// let width = 1049.638916015625;
// let height = 1117.893798828125;
// let x = -260.77432250976562;
// let y = -248.70765686035156;


let brushedSigns = localStorage.getItem("brushedSigns");
let brushed_arr;

if (brushedSigns !== null) {
    brushed_arr = brushedSigns.split(',')
}

let brushed_graph = {};
brushed_graph.nodes = [];
brushed_graph.links = [];


$.getJSON('data/sign_props.json', function(properties) {

    localStorage.setItem('signProperties', JSON.stringify(properties));
});


let gbrush; // this is for brushing in the graph

let svg = d3.select("#viz")
//     .attr("width", "40%")
//     .attr("height", "40%");

let viewBox = svg.attr("viewBox", `${x} ${y} ${width} ${height}`);

let container = svg.append("g");

// handling of zoom
let zoom = d3.zoom()
    .scaleExtent([2, Infinity])
    .on("zoom", zoomed);

function zoomed() {
    container.attr("transform", d3.event.transform);
}

function clickToZoom(selectedNode, nodeData) {
    x = selectedNode["x"];
    y = selectedNode["y"];
    svg.transition().duration(2000).call(
        zoom.transform,
        d3.zoomIdentity.translate(width / 3, height / 3).scale(40).translate(-x, -y)
    );
    refreshData(nodeData);
    document.getElementById("signDataList").click();
}

svg.call(zoom);

// Add brushing
gbrush = d3.brush()
    .extent([[x, y], [width, height]])
    .on("brush", highlightDots)
    .on("end", showGoTo);

container.append("g")
    .attr("class", "brush")
    .call(gbrush);

// Function that is triggered when brushing is performed
function highlightDots() {
    let extent = d3.event.selection;
    let dots = svg.selectAll('.node');
    dots.classed('extent', false);

    let inBound = [];
    dots["_groups"][0].forEach(function (d) {
        if (isBrushed(extent, d.getAttribute("cx"), d.getAttribute("cy"))) {
            inBound.push(d.getAttribute("id"));
        }
    });

    localStorage.clear();
    localStorage.setItem("gbrushedSigns", inBound);

}

// A function that return TRUE or FALSE according if a dot is in the selection or not
function isBrushed(brush_coords, cx, cy) {
    let x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
}

function showGoTo() {
    let bbx = svg.selectAll('rect')._groups[0][1];
    let px = bbx.getBoundingClientRect().x + bbx.getBoundingClientRect().width * 0.7,
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
    let goto_url = cur_url.join('/') + '/scatterplot.html';
    window.location.replace(goto_url);
}


const promise = d3.json("data/graph.json").then(function (graph) {

    //Push words to array for search
    word_list = graph.nodes.map(function(sign){return sign["EntryID"] });

    word_list.sort();

    let input = document.getElementById("search-box");
    new Awesomplete(input, {
        list: word_list
    });

    $( "#search-box" ).on( "awesomplete-selectcomplete", function(event) {
        let selectedNode = graph.nodes.filter( sign => sign["EntryID"] === event.target.value)[0];
        let nodeData = JSON.parse(localStorage.getItem('signProperties')).filter(node => node.EntryID === selectedNode["EntryID"].toLowerCase())[0]
        // for (let [key, value] of Object.entries(nodeData)) {
        //     console.log(`${key}: ${value}`);
        // }

        clickToZoom(selectedNode,nodeData);

    });

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

promise.then(
    function (fulfilled) {

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

        let node = container.append("g").attr("class", "nodes")
            .selectAll('g')
            .data(brushed_graph.nodes)
            .enter()
            .append("circle")
            .classed("node", true)
            .on("mouseenter", function (d, i) {
                d3.select(this)
                    .attr("r", function (d) {
                        return 10;
                    });
            })
            .on("mouseout", function (d, i) {
                d3.select(this)
                    .attr("r", function (d) {
                        return 3.5;
                    });
            })
            .on("click", function(d, i) {
                let nodeData = JSON.parse(localStorage.getItem('signProperties')).filter(node => node.EntryID === d["EntryID"].toLowerCase())[0];
                clickToZoom(d, nodeData);
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
            .text(function(d) { return d.Code })
            .append("title").text(function (d) {
                return d.EntryID;
            });


    }, function (err) {
        console.log(err)
    }
);

//Also fetch sign properties on the side

function reset() {
    localStorage.clear();
    window.location.reload(false);
}

function refreshData(node) {
    // clear contents
    $('#data-container p').not('#about-data').remove();
    $('#data-container br').remove();
    $('#about-data').css('display', 'block');


    // EntryID / Sign Name
    $('#data-container').append('<p><b>EntryID</b>: ' + node['EntryID'].toLocaleUpperCase() + '</p><p><b>LemmaID</b>: ' + node['LemmaID'].toLocaleUpperCase() + '</p>');

    // Sign Frequency
    $('#data-container').append('<p><b>Sign Frequency Properties</b></p>');
    var attribute_list = ['SignFrequency(M)', 'SignFrequency(SD)', 'SignFrequency(Z)',
        'SignFrequency(N)', 'SignFrequency(M-Native)',
        'SignFrequency(SD-Native)', 'SignFrequency(Z-Native)',
        'SignFrequency(N-Native)',

    ];
    for (i = 0; i < attribute_list.length; i++) {
        if (node[attribute_list[i]] != undefined) {
            $('#data-container').append('<p>' + attribute_list[i] + ': ' + node[attribute_list[i]] + '</p>');
        }
    }

    // Iconicity
    $('#data-container').append('<p><b>Iconicity Properties</b></p>');
    var attribute_list = ['Iconicity(M)', 'Iconicity(SD)', 'Iconicity(Z)', 'Iconicity(N)','Iconicity_ID','IconicityType'];
    for (i = 0; i < attribute_list.length; i++) {
        if (node[attribute_list[i]] != undefined) {
            $('#data-container').append('<p>' + attribute_list[i] + ': ' + node[attribute_list[i]] + '</p>');
        }
    }


    // Lexical Properties
    $('#data-container').append('<p><b>Lexical Properties</b></p>');
    var attribute_list = ['Compound.2.0', 'FingerspelledLoanSign.2.0', 'LexicalClass.2.0', 'Initialized'];
    for (i = 0; i < attribute_list.length; i++) {
        if (node[attribute_list[i]] != undefined) {
            if (attribute_list[i] == 'Lexical Class') {
                $('#data-container').append('<p>' + attribute_list[i] + ': ' + node[attribute_list[i]] + '</p>');
            } else {
                $('#data-container').append('<p>' + attribute_list[i] + ': ' + (node[attribute_list[i]] == "0" ? "FALSE" : "TRUE") + '</p>');
            }
        }
    }

    // Phonological Properties
    $('#data-container').append('<p><b>Phonological Properties</b></p>');
    var attribute_list = ['Sign Type', 'Movement', 'Major Location', 'Minor Location', 'Selected Fingers', 'Flexion',"Complexity"];
    for (i = 0; i < attribute_list.length; i++) {
        if (node[attribute_list[i]] != undefined) {
            if (attribute_list[i] == 'Selected Fingers') {
                $('#data-container').append('<p>' + attribute_list[i] + ': ' + convertSelectedFingers(node[attribute_list[i]]) + '</p>');
            } else {
                $('#data-container').append('<p>' + attribute_list[i] + ': ' + node[attribute_list[i]] + '</p>');
            }
        }
    }

    // Sub-Lexical Frequency
    $('#data-container').append('<p><b>Sub-Lexical Frequency Properties</b></p>');
    var attribute_list = ['SignType.2.0', 'Movement.2.0', 'MajorLocation.2.0', 'MinorLocation.2.0', "NonDominantHandshape.2.0", 'SelectedFingers.2.0', 'Flexion.2.0', 'Handshape.2.0'];
    for (i = 0; i < attribute_list.length; i++) {
        if (node[attribute_list[i]] != undefined) {
            $('#data-container').append('<p>' + attribute_list[i] + ': ' + node[attribute_list[i]] + '</p>');
        }
    }

    // Neighborhood Density
    $('#data-container').append('<p><b>Neighborhood Density</b></p>');
    var attribute_list = ['MinimalNeighborhoodDensity', 'MaximalNeighborhoodDensity', 'Parameter-BasedNeighborhoodDensity'];
    for (i = 0; i < attribute_list.length; i++) {
        if (node[attribute_list[i]] != undefined) {
            $('#data-container').append('<p>' + attribute_list[i] + ': ' + node[attribute_list[i]] + '</p>');
        }
    }

    // Alternative English Translations
    if (node['Gloss Confirmation'] != "0") {
        $('#data-container').append('<p><b>Alternative English Translations</b></p>');
        var attribute_list = ['Alternative Glosses','PercentUnknown(Native)', 'PercentGlossAgreement','PercentGlossAgreement(Native)'];
        for (i = 0; i < attribute_list.length; i++) {
            if (node[attribute_list[i]] != undefined) {
                if (attribute_list[i] == "Gloss Confirmation") {
                    $('#data-container').append('<p>' + attribute_list[i] + ': ' + (node[attribute_list[i]] == "0" ? "FALSE" : "TRUE") + '</p>');
                } else {
                    $('#data-container').append('<p>' + attribute_list[i] + ': ' + node[attribute_list[i]] + '</p>');
                }
            }

        }
    }


    // Video Information
    var attribute_list = ['Sign Onset (ms)', 'Sign Offset (ms)', 'Sign Length (ms)', 'Clip Length (ms)'];
    for ( let i = 0; i < attribute_list.length; i++) {
        if (node[attribute_list[i]] != undefined) {
            $('#data-container').append('<p>' + attribute_list[i] + ': ' + node[attribute_list[i]] + '</p>');
        }
    }

    $('#data-container').addClass('active');
}