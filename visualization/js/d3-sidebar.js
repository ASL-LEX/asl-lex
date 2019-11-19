// viewbox props for positing the svg element
// - hardcoded so assuming it may not scale well on different monitor sizes
let width = 2000;
let height = 2000;
let x = -600;
let y = -300;

let brushedSigns = localStorage.getItem("brushedSigns");
let brushed_arr;


let brushed_graph = {};
brushed_graph.nodes = [];
brushed_graph.links = [];

//probably we don't need to store any data in the browser 
//we can just use a global variable like this 
let signProperties = []

let active_filters = []
let applied_filters = {}
let graph = {}




$.getJSON('data/sign_props.json', function(properties) {

    signProperties = properties
    //localStorage.setItem('signProperties', JSON.stringify(properties));
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
    
    //graph = graph

    //Push words to array for search
    word_list = graph.nodes.map(function(sign){return sign["EntryID"] });

    word_list.sort();

    let input = document.getElementById("search-box");
    new Awesomplete(input, {
        list: word_list
    });

    $( "#search-box" ).on( "awesomplete-selectcomplete", function(event) {
        let selectedNode = graph.nodes.filter( sign => sign["EntryID"] === event.target.value)[0];
        let nodeData = signProperties.filter(node => node.EntryID === selectedNode["EntryID"].toLowerCase())[0]
        //let nodeData = JSON.parse(localStorage.getItem('signProperties')).filter(node => node.EntryID === selectedNode["EntryID"].toLowerCase())[0]       

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
        update_rendering(brushed_graph)
        display_num_active_nodes(brushed_graph.nodes.length);
    }, function (err) {
        console.log(err)
    }
);

function create_filter_object(category_data) {

    let filter = {};   
    filter["type"] = category_data["type"];
    filter["key"] = category_data["data_attribute"];
    filter["label_name"] = category_data["label_name"];
    filter["values"] = [];
    filter["range"] = {"min": -1, "max":-1};

    if (category_data["type"] === "range") {
        filter["range"]["max"] = $('#' + category_data["range"]["slider_id"]).slider("values", 1);
        filter["range"]["min"] = $('#' + category_data["range"]["slider_id"]).slider("values", 0);
        update_active_filters("add", category_data["label_name"]);
    }
    else if (category_data["type"] === "boolean") {
        if ($('#' + category_data["true_id"]).is(":checked")) {
           filter["values"].push(1.0);          
        }
        else if ($('#' + category_data["false_id"]).is(":checked")) {
           filter["values"].push(0.0);           
        }
        update_active_filters("add", category_data["label_name"]);
    }

    else if (category_data["type"] === "categorical") {
        let isActive = false;
        for (value of category_data["values"]) {       
            if ($('#' + value["ID"]).is(":checked")) {                
                filter["values"].push(value["value"]);
                isActive = true;            
            }
        }
        if (isActive) {
            update_active_filters("add", category_data["label_name"]);
        }
        else {
           update_active_filters("remove", category_data["label_name"]);     
        }
    }
    return filter;
}

function submit(category, subcategory) {    
    
    let category_data = filters_data[category].find(function(obj) {
        return obj["category"] == subcategory;
    });
    applied_filters[subcategory] = create_filter_object(category_data)    
    const [result , numActiveNodes] = filter_nodes(brushed_graph, applied_filters);       
    update_rendering(result);
    show_active_filters(active_filters);    
    display_num_active_nodes(numActiveNodes);
}

function show_active_filters(active_filters) {
    $('#active_filters').empty()
    $('#active_filters').append('<h5>Active Filters:</h5>')
    $('#active_filters').append('<h5 id="filter_badges"></h5>')    
    for (let filter of active_filters) { 
       badge_title = create_badge_title(filter, applied_filters);                        
       $('#filter_badges').append('<span class="badge badge-pill badge-danger style="margin-left:5px; title=' + badge_title + '>' + filter + '</span>');   
    }
}

function update_active_filters(mode, filter) {    
    if (mode === "add" && !active_filters.includes(filter)) {
        active_filters.push(filter);
    }
    else if (mode === "remove" && active_filters.includes(filter)) {
        active_filters.splice(active_filters.indexOf(filter), 1);
    }
}

function display_num_active_nodes(numActiveNodes) {
    $('#active_nodes').empty();
    $('#active_nodes').append('<h5>Active Nodes:' + numActiveNodes + '</h5');
}

function create_badge_title(filter_label_name, applied_filters) {
    for (let key in applied_filters) {
        if (applied_filters[key]['label_name'] == filter_label_name) {
            if (applied_filters[key]['type'] == 'boolean') {
                title = (applied_filters[key]['values'][0]==1) ? "True" : 'False'; 
                return title;
            }
            else if (applied_filters[key]['type'] == 'range') {
                range = applied_filters[key]['range'];
                return "Min:" + range['min'] + ",Max:" + range['max']; 
            }
            else if (applied_filters[key]['type'] == 'categorical') {
               return applied_filters[key]['values'].join(',');
            }
        }
    }
}


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

function node_can_pass_active_filters(applied_filters) {    
    return function(node) {        
        for (let category in applied_filters) {
            filter = applied_filters[category];
            if (filter["type"] === "categorical" || filter["type"] === "boolean") {
                if (filter["key"] === "SelectedFingers.2.0" && node[filter["key"]]) {
                    values = filter["values"].map(value => value.charAt(0).toLowerCase());                    
                    for (let i = 0; i < node[filter["key"]].length; i++) {                        
                        if (values.includes(node[filter["key"]].charAt(i))) {
                            return true;
                        }
                    }                   
                    return false;
                }
                else if (filter["values"].length > 0 && !filter["values"].includes(node[filter["key"]]))                
                    return false;
            }
            else if (filter["type"] === "range") {
                if (!(node[filter["key"]] <= filter["range"]["max"] && node[filter["key"]] >= filter["range"]["min"]))
                    return false;
            }
        }
        return true;
    }
}

function filter_nodes(graph, applied_filters) {      
   let numActiveNodes = graph.nodes.length
   let result = {};
   result.nodes = [];
   result.links = [];
   let filtered_nodes_Data = {};   

   //filtered_nodes_Data = JSON.parse(localStorage.getItem('signProperties')).filter(node_can_pass_active_filters(applied_filters));
   filtered_nodes_Data = signProperties.filter(node_can_pass_active_filters(applied_filters));
   let node_codes = [];
   //graph = JSON.parse(localStorage.getItem('graph'))
   //filter nodes of the graph
   filtered_nodes_Data.forEach(function (d) {
        //join the nodes of the graph with their corrseponding record in filtered poroperties on "Code"
        let node_matches = graph.nodes.filter(node => node["EntryID"].toLowerCase() === d["EntryID"].toLowerCase());
        //let node_matches = graph.nodes.filter(node => node["Code"] === d["Code"]);
        for (idx in node_matches) {           
           node_codes.push(node_matches[idx]["Code"]);  
        }             
    });   
    //we have to create a separate result graph 
    //we need to original graph to be able to revert back the filters 
    for (let node of graph.nodes) {        
        new_node = {};
        //copy all the attrbiutes of graph node  
        for (key in node) {
            new_node[key] = node[key];
        } 
        //if node hasn't passed the filters change its color_code to gray    
        if (!node_codes.includes(node["Code"])) {            
            new_node['color_code'] = "#D8D8D8";
            numActiveNodes += -1;
        }        
        result.nodes.push(new_node);
    }
    //add all the link  of the original graph to result graph
    graph.links.forEach(function (link) {                    
        result.links.push(link);        
    });
    return [result , numActiveNodes];
}

function update_rendering(graph) {   

    let links = container.attr("class", "links")
            .selectAll("line").data(graph.links)

    let nodes = container.attr("class", "nodes")
            .selectAll('circle').data(graph.nodes)
            
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
                let sourceX    = graph.nodes.filter((node, i) => {
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
                return 3;
            })
            .attr("stroke-opacity", function(l) {
                return 0
            });

    

            nodes.enter()
            .append("circle")
            .classed("node", true)
            .on("mouseenter", function (d, i) {                
                d3.selectAll("line").style('stroke-opacity', function (link_d) {                        
                        if (link_d.source === d.Code|| link_d.target === d.Code) {                            
                            return 1;
                        }
                    });
                d3.select(this)
                    .attr("stroke-opacity", 1)
                    .attr("r", function (d) {
                        return 10;
                    });
                
            })
            .on("mouseout", function (d, i) {                
                d3.select(this)
                    .attr("stroke-opacity", 0)
                    .attr("r", function (d) {
                        return 3.5;
                    });
                d3.selectAll("line").style('stroke-opacity', function (link_d) {
                        if (link_d.source === d.Code|| link_d.target === d.Code) {
                            return 0
                        }
                    });
            })
            .on("click", function(d, i) {
                let nodeData = signProperties.filter(node => node.EntryID === d["EntryID"].toLowerCase())[0];
                //let nodeData = JSON.parse(localStorage.getItem('signProperties')).filter(node => node.EntryID === d["EntryID"].toLowerCase())[0];
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

            nodes.attr("fill", function (d) {                
                return d.color_code;
            })
            .on("mouseenter", function (d, i) {
                
                if (d.color_code == "#D8D8D8") {
                    return
                }
                d3.selectAll("line").style('stroke-opacity', function (link_d) {                        
                        if (link_d.source === d.Code|| link_d.target === d.Code) {                            
                            return 1;
                        }
                    });
                d3.select(this)
                    .attr("stroke-opacity", 1)
                    .attr("r", function (d) {
                        return 10;
                    });
            })
            .on("mouseout", function (d, i) {
                 if (d.color_code == "#D8D8D8") {
                    return;
                }
                d3.select(this)
                    .attr("stroke-opacity", 0)
                    .attr("r", function (d) {
                        return 3.5;
                    });
                d3.selectAll("line").style('stroke-opacity', function (link_d) {
                        if (link_d.source === d.Code|| link_d.target === d.Code) {
                            return 0;
                        }
                    });
            })
            .on("click", function(d, i) {
                 if (d.color_code == "#D8D8D8") {
                    return;
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
}

//Also fetch sign properties on the side

function reset() {
    localStorage.clear();
    window.location.reload(false);
}

function search(category) {
  const input = $("#" + category + "_search_id");
  const filter = input.val().toUpperCase();  
  $("." + category).each(function() {    
    let label = $(this).find("label")[0];   
    if (label.innerHTML.toUpperCase().indexOf(filter) > -1) {      
      $(this).show();      
    }
    else {
      $(this).hide();      
    }
  });    
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


    // Video filters_datarmation
    var attribute_list = ['Sign Onset (ms)', 'Sign Offset (ms)', 'Sign Length (ms)', 'Clip Length (ms)'];
    for ( let i = 0; i < attribute_list.length; i++) {
        if (node[attribute_list[i]] != undefined) {
            $('#data-container').append('<p>' + attribute_list[i] + ': ' + node[attribute_list[i]] + '</p>');
        }
    }

    $('#data-container').addClass('active');
}