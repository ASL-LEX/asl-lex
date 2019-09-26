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
        d3.zoomIdentity.translate(width / 3, height / 3).scale(4).translate(-x, -y)
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

function submit(category) {
    let info = {"sing_type":{"data_attribute":"SignType.2.0",
                             "type":"categorical",
                             "values":[ 
                                 {"value":"OneHanded", "ID":"onehanded"},
                                 {"value":"SymmetricalOrAlternating", "ID":"symmetricaloralternating"},
                                 {"value":"AsymmetricalSameHandshape", "ID":"asymmetricalsamehandshape"},
                                 {"value":"AsymmetricalDifferentHandshape", "ID":"asymmetricaldiffhandshape"}
                             ]},

                "major_location":{"data_attribute":"MajorLocation.2.0",
                                    "type":"categorical",
                                    "values":[
                                       {"value":"Head", "ID":"head"},
                                       {"value":"Arm", "ID":"arm"},
                                       {"value":"Body", "ID":"body"},
                                       {"value":"Hand", "ID":"hand"},
                                       {"value":"Neutral", "ID":"neutral"},
                                       {"value":"Other", "ID":"other"}
                                    ]},
                "movement":{"data_attribute":"Movement.2.0",
                                    "type":"categorical",
                                    "values":[
                                       {"value":"Straight", "ID":"straight"},
                                       {"value":"Curved", "ID":"curved"},
                                       {"value":"BackAndForth", "ID":"backandforth"},
                                       {"value":"Circular", "ID":"circular"},
                                       {"value":"None", "ID":"none"},
                                       {"value":"Other", "ID":"other"}
                                    ]},
                "frequency_M":{"data_attribute":"SignFrequency(M)",
                                    "type":"range",
                                    "range":{
                                       "min_id":"frequency_M_slider_min",
                                       "max_id": "frequency_M_slider_max"                                       
                                    }},
                "frequency_M_native":{"data_attribute":"SignFrequency(M-Native)",
                                    "type":"range",
                                    "range":{
                                       "min_id":"frequency_M_native_slider_min",
                                       "max_id": "frequency_M_native_slider_max"                                       
                                    }},
                "frequency_Z":{"data_attribute":"SignFrequency(Z)",
                                    "type":"range",
                                    "range":{
                                       "min_id":"frequency_Z_slider_min",
                                       "max_id": "frequency_Z_slider_max"                                       
                                    }},
                "frequency_SD":{"data_attribute":"SignFrequency(SD)",
                                    "type":"range",
                                    "range":{
                                       "min_id":"frequency_SD_slider_min",
                                       "max_id": "frequency_SD_slider_max"                                       
                                    }}
              }
    let filter = {}
    filter["type"] = info[category]["type"]
    filter["key"] = info[category]["data_attribute"]
    filter["values"] = []
    filter["range"] = {"min": -1, "max":-1}

    if (info[category]["type"] === "range") {
        filter["range"]["max"] = $('#' + info[category]["range"]["max_id"]).val()
        filter["range"]["min"] = $('#' + info[category]["range"]["min_id"]).val()
    }

    else if (info[category]["type"] === "categorical") {
        for (value of info[category]["values"]) {       
            if ($('#' + value["ID"]).is(":checked")) {
                filter["values"].push(value["value"])
            }  
        }
    }
    
    
    filter_nodes(brushed_graph, filter)    
    update_rendering(brushed_graph)
}

promise.then(
    function (fulfilled) {        
        update_rendering(brushed_graph)
    }, function (err) {
        console.log(err)
    }
);

function avgColor(color1, color2) {
  //separate each color alone (red, green, blue) from the first parameter (color1) 
  //then convert to decimal
  let color1Decimal = {
    red: parseInt(color1.slice(0, 2), 16),
    green: parseInt(color1.slice(2, 4), 16),
    blue: parseInt(color1.slice(4, 6), 16)
  }
  //separate each color alone (red, green, blue) from the second parameter (color2) 
  //then convert to decimal
  let color2Decimal = {
    red: parseInt(color2.slice(0, 2), 16),
    green: parseInt(color2.slice(2, 4), 16),
    blue: parseInt(color2.slice(4, 6), 16),
  }
  // calculate the average of each color (red, green, blue) from each parameter (color1,color2) 
  let color3Decimal = {
    red: Math.ceil((color1Decimal.red + color2Decimal.red) / 2),
    green: Math.ceil((color1Decimal.green + color2Decimal.green) / 2),
    blue: Math.ceil((color1Decimal.blue + color2Decimal.blue) / 2)
  }
  //convert the result to hexadecimal and don't forget if the result is one character
  //then convert it to uppercase
  let color3Hex = {
    red: color3Decimal.red.toString(16).padStart(2, '0'),
    green: color3Decimal.green.toString(16).padStart(2, '0'),
    blue: color3Decimal.blue.toString(16).padStart(2, '0')
  }
  //put the colors (red, green, blue) together to have the output
  let color3 = color3Hex.red + color3Hex.green + color3Hex.blue
  return color3
}


/*
*filter is an object of type {"key": "", "values":[]}
*/
function filter_nodes(graph, filter) {   
   
   let result = {}
   result.nodes = []
   result.links = []
   let filtered_nodes_Data = {}
   //get Porperties data from local storage and filter them based on the filter
   if (filter["type"] == "categorical") {
       filtered_nodes_Data = JSON.parse(localStorage.getItem('signProperties')).filter(node => filter["values"].includes(node[filter["key"]]))
   }
   else if (filter["type"] == "range") {
      filtered_nodes_Data = JSON.parse(localStorage.getItem('signProperties')).filter(node => node[filter["key"]] <= filter["range"]["max"] && node[filter["key"]] >= filter["range"]["min"])
   }
   let node_codes = []
   //filter nodes of the graph
   filtered_nodes_Data.forEach(function (d) {
        //join the nodes of the graph with their corrseponding record in filtered poroperties on "Code"
        let node_matches = graph.nodes.filter(node => node["EntryID"] === d["EntryID"].toLowerCase()) 
        for (idx in node_matches) {
           //result.nodes.push(node[idx]) 
           node_codes.push(node_matches[idx]["Code"])   
        }             
    });


    // create list of all codes of graph nodes 
    //we need this list for filtering graph links 
    /*let node_codes = []    
    for (node of result.nodes) {        
        node_codes.push(node["Code"])
    }*/

    for (index in graph.nodes) {
        /*if (graph.nodes[index]["Code"] == "F_03_018") {
            console.log("Ahhhh")
        }*/
        if (!node_codes.includes(graph.nodes[index]["Code"])) {
            console.log("here1")
            graph.nodes[index]['color_code'] = "#D8D8D8"
        }

    }
    //filter graph links 
    graph.links.forEach(function (link) {        
        if (node_codes.includes(link.source) && node_codes.includes(link.target)) {             
            result.links.push(link);
        }


    });
    //brushed_graph = result
   
}


function update_rendering(graph) {   

    let links = container.attr("class", "links")
            .selectAll("line").data(graph.links)

    let nodes = container.attr("class", "nodes")
            .selectAll('circle')
            .data(graph.nodes)
            
            links.enter()
            .append("line")
            .attr("stroke", function(l) {
               
                let source = graph.nodes.filter((node, i) => {
                    return node.Code === l.source;
                })[0];
                let target = graph.nodes.filter((node, i) => {
                    return node.Code === l.target;
                })[0];
                //if source and target node colors don't math average them
                if (source.color_code != target.color_code) {                  
                   return "#" +  avgColor(source.color_code.slice(1), target.color_code.slice(1)) 
                }               
                return source.color_code;
            })
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
            .attr("stroke-width", function (l) {

            });

        
            nodes.enter()
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
            .append("title").text(function (d) {
                return d.EntryID;
            });

           /* nodes.exit()            
            .attr("fill", function (d) {
                return '#D8D8D8';
            })*/

            nodes.attr("fill", function (d) {
                console.log("sepideh")
                return d.color_code;
            })
            .on("mouseenter", function (d, i) {
                if (d.color_code == "#D8D8D8") {
                    return
                }
                d3.select(this)
                    .attr("r", function (d) {
                        return 10;
                    });
            })
            .on("mouseout", function (d, i) {
                 if (d.color_code == "#D8D8D8") {
                    return
                }
                d3.select(this)
                    .attr("r", function (d) {
                        return 3.5;
                    });
            })
            .on("click", function(d, i) {
                 if (d.color_code == "#D8D8D8") {
                    return
                }
                let nodeData = JSON.parse(localStorage.getItem('signProperties')).filter(node => node.EntryID === d["EntryID"].toLowerCase())[0];
                clickToZoom(d, nodeData);
            
            })                   
            .append("title").text(function (d) {
                return d.EntryID;
            });


            links.attr("stroke", function(l) {
               
                let source = graph.nodes.filter((node, i) => {
                    return node.Code === l.source;
                })[0];
                let target = graph.nodes.filter((node, i) => {
                    return node.Code === l.target;
                })[0];
                if (source.color_code == "#D8D8D8" || source.color_code == "#D8D8D8") {
                       return "#D8D8D8"
                } 
                //if source and target node colors don't math average them
                if (source.color_code != target.color_code) {                                  
                   return "#" +  avgColor(source.color_code.slice(1), target.color_code.slice(1)) 
                }               
                return source.color_code;
            })

            /*links.exit()
            .attr("stroke", function (d) {
                return '#D8D8D8';
            })  */     

}

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