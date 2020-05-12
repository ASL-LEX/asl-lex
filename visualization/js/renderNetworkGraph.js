// Get width and height of the screen and sibtract padding of page content and size of navbar.
// This will be the height of the viewport. The graph is held in the viewbox, which is the svg element.
// Use the height and width to find a zoom out factor, which we will use to figure out how much we have to
// zoom out to fit the viewbox in the viewport, or fit the network on the screen (because the graph is so large).
// See reference site for further explanation of viewport vs. viewbox and why we have to zoom out:
// REF: https://webdesign.tutsplus.com/tutorials/svg-viewport-and-viewbox-for-beginners--cms-30844
const width = window.innerWidth - 40;  // 40px of padding on the sides of the page content
const height = window.innerHeight - 95.6;  // navbar is 95.6px tall
const zoom_out_factor = 3400 / Math.min(width, height);  // how much the viewbox needs to zoom out to fit the graph on the screen. 3400 is the diameter of the network graph.
const x = -(width / height) * 1500;  // amount the graph must be horizontally offset to be visible
const y = -1400;  // amount the graph must be vertically offset to be visible
const InActive_Node_Color = "#f0f0f0";

let TOTAL_SIGNS = 2729; // the number of signs in the graph, this is used to calculate how many labels should be showing
let ACTIVE_NODES = TOTAL_SIGNS;
let SCALE_FACTOR = 1; // the current sale factor after zooming/clicking, equals 1 on load

//check from merge

let clicked_sign_code = null
let tempBrushedsigns = [];
let brushedSigns = null;
let brushed_arr = [];


let brushed_graph = {};
brushed_graph.nodes = [];
brushed_graph.links = [];
let filtered_graph = null;
let constraints_dictionary = null;
let graph_data_promise;

//probably we don't need to store any data in the browser
//we can just use a global variable like this
let signProperties = [];
let active_filters = [];
let applied_filters = {};
let graph = {};
let constraints_dict = {};

// Create Tooltips
let tip = {};   // create tooltip here so we can close it anywhere
let tooltipTimeout = null;
let search_box = null;

//check from merge

//JS listeners
$('[data-toggle="popover"]').popover({
    //content: '<a class="themedLinks" href="scatterplot.html?fromNetwork=True" onclick="test()">View pair plots matrix</a><br><a class="themedLinks" target="_blank" href="viewdata.html">View properties of brushed data </a> <br><a class="themedLinks" target="_blank" href="viewdatasummary.html">View data summary</a><hr><span>Please click the  menu to view more information about the brushed signs</span>',
    content: '<a class="themedLinks" id="pairPlotsLink">View pair plots matrix</a><br><a class="themedLinks" target="_blank" href="viewdata.html">View properties of brushed data </a> <br><a class="themedLinks" target="_blank" href="viewdatasummary.html">View data summary</a><hr>',

    html: true
});

// LOADER
$('body').append('<div id="loadingDiv"><div class="loader">Loading...</div></div>');
$(window).on('load', function () {
    setTimeout(removeLoader, 50); //wait for page load PLUS less than 1 second.
});

function removeLoader() {
    $("#loadingDiv").fadeOut(500, function () {
        // fadeOut complete. Remove the loading div
        $("#loadingDiv").remove(); //makes page more lightweight
    });
}

// ON DOCUMENT LOAD
function updateSliderText(value, domClassName) {
    let prevText = ($("." + domClassName).text()).split(":")[0];
    $("." + domClassName).text(prevText + ":" + value)
        .css({'font-weight': 'bold'});
}

$(document).on("click", "#pairPlotsLink", function() {
    //Set temp brushed signs to brushedSigns and redirect
    localStorage.setItem("brushedSigns", tempBrushedsigns);
    goToPairPlotsGraph();
});

$(document).ready(function () {

    graph_data_promise = d3.json("data/graph.json").then(function (graph) {


        //If not coming from pair plots
        if (!window.location.href.split('/').pop().includes("fromPairPlots=True")) {
            //Remove all localstorage history
            localStorage.removeItem("brushedSigns");
            localStorage.removeItem('constraints');
            localStorage.removeItem('filters');
        } else {

            //Otherwise get data saved in localstorage
            brushedSigns = localStorage.getItem("brushedSigns");
            if (brushedSigns !== null) {
                brushed_arr = brushedSigns.split(',')
            }

        }


        if (brushed_arr === undefined  || brushed_arr.length === 0) {
            console.log("Creating a fresh graph");
            brushed_graph = graph;
        } else {
            console.log("making graph from saved local storage data ....");
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

        //Update search box with this initial graph
        initSearchList(brushed_graph)

    });


    graph_data_promise.then(
        function (fulfilled) {
            update_rendering(brushed_graph);
            display_num_active_nodes(brushed_graph.nodes.length);
        }, function (err) {
            console.log(err)
        }
    );

    localStorage.removeItem('gCodes');

    $("#signDataList").hide();

    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#dismiss').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.sidebar-overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.sidebar-overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

    $('[data-toggle="tooltip"]').tooltip();
    $("body").tooltip({selector: '[data-toggle=tooltip]'});

    addTooltipText();

    // size tutorial popup modal
    let element = document.getElementById('tutorialGif');
    let h = 0.7 * window.innerHeight;
    element.setAttribute("height", h.toString())
});

const sign_prop_promise = $.getJSON('data/sign_props.json', function (properties) {

    signProperties = properties
});

sign_prop_promise.then(
    function (fulfilled) {
        if (brushedSigns === null) {
            constraints_dictionary = createConstraintsDictionary(signProperties);
            constraints_dict = constraints_dictionary;
            attachCountsToDom(constraints_dictionary, true);
        } else {
            //case when we are returning from pair plots page
            updateSideBar(brushed_graph, signProperties);
        }
    }, function (err) {
        console.log(err)
    }
);

//Initially, no active filters
show_active_filters([]);

let gbrush; // this is for brushing in the graph

// set the "height" and "width" attributes of the avg because we add a viewbox later.
// We need to set the height and width of the svg (the "viewport") if we add a viewbox,
// to avoid making the content of the svg look overly zoomed in.
// REF: https://webdesign.tutsplus.com/tutorials/svg-viewport-and-viewbox-for-beginners--cms-30844
let svg = d3.select("#viz").attr("height", height).attr("width", width).on("dblclick.zoom", null).on("wheel", wheeled);
    // .call(zoom.transform, d3.zoomIdentity
    // .translate(width / 2, height / 2)
    // .scale(0.5)
    // .translate(-width / 2, -height / 2));;

let viewBox = svg.attr("viewBox", `${x} ${y} ${width * zoom_out_factor} ${height * zoom_out_factor}`);

let container = svg.append("g");

// handling of zoom
let zoom = d3.zoom()
    .scaleExtent([1, 12])
    .on("zoom", zoomed);

svg.call(zoom);

function wheeled() {
    console.log(d3.event);
}

function zoomed() {
    let transform = d3.event.transform;
    SCALE_FACTOR = transform["k"];
    // explain (SCALE_FACTOR - 2):
    // we do not want labels to show up until we are zoomed in to a scale factor of 2.
    // (NOTE: scale factor starts at 1 on page load)
    // explain 0.2:
    // arbitrary scaling factor, this value appeared to make labels appear at good rate.
    // It indicates that we want 20% of the selected nodes to appear every time we increase the zoom scale by 1.
    // explain (TOTAL_SIGNS / ACTIVE_NODES):
    // scale the number of visible labels to the number of active nodes. If there are not a
    // lot of active nodes, we want labels to show up faster because there is more space.
    // Indicates that if that 1/3 of the total nodes are active, the labels should appear 3 times as fast.
    let selected = (SCALE_FACTOR - 3) * 0.2 * (TOTAL_SIGNS / ACTIVE_NODES)
    numNodes = Math.floor(ACTIVE_NODES * selected)
    numVisible = 0
    d3.selectAll("text")
        .attr('opacity', function (d) {
            // make sure the label of a clicked node is the first label to appear when zooming in and the
            // last label to disappear when zooming out
            if (d.Code === clicked_sign_code && numNodes > 0) {
                numVisible += 1;
                return 1;
            }
            else if (numVisible < numNodes) {
                if (d.color_code != InActive_Node_Color) {
                    numVisible += 1;
                    return 1;
                }
            }
            return 0;
        });

    // limit zooming so the network graph re-centers itself on zoom out
    // (and so the user cannot drag the network graph off the screen).
    // first, constrain the x and y components of the translation by the
    // dimensions of the viewport.
    // REF: http://bl.ocks.org/shawnbot/6518285
    let tx = Math.max(transform.x, (width*((zoom_out_factor - 2)/2)) - (width*((zoom_out_factor - 2)/2)) * SCALE_FACTOR);
    tx = Math.min(tx, -((width*((zoom_out_factor - 2)/2)) - (width*((zoom_out_factor - 2)/2)) * SCALE_FACTOR));

    let ty = Math.max(transform.y, (height*zoom_out_factor) - (height*zoom_out_factor) * SCALE_FACTOR);
    ty = Math.min(ty, -((height*(zoom_out_factor/2)) - (height*(zoom_out_factor/2)) * SCALE_FACTOR));

    // then update the transform attribute with the
    // correct translation
    transform["x"] = tx;
    transform["y"] = ty;

    // set zoom functionality of the container
    container.attr("transform", transform)

    // here is the standard, non-limited zoom functionality, for reference:
    // container.attr("transform", d3.event.transform);

}

function clickToZoom(selectedNode, nodeData) {
    d3.selectAll("text")
        .attr("style", function (t) {
            if (t.Code === selectedNode.Code) {
                this.parentNode.appendChild(this);  // make this node label appear on top of everything else
                // style the outline to be thicker and purple, set font size to standard-label-text-large
                return "stroke: #7386D5; stroke-width: 7; stroke-opacity: 1; font-size: 28px !important"
            }
        })
    let sx = selectedNode["x"];
    let sy = selectedNode["y"];
    let sr = d3.select('#' + selectedNode.Code).attr('r');
    let scale = 10;
    let adjustment_for_sidebar = 440 + ((sr * 2) * scale)  // sidebar is 440px wide, we want to make sure node never renders under sidebar
    // REF for zooming: https://www.datamake.io/blog/d3-zoom
    svg.transition().duration(2000).call(
        zoom.transform,
        d3.zoomIdentity.translate((width - (440 * scale)) / (2 * scale) - sx * scale + adjustment_for_sidebar, height / (2 * scale) - sy * scale).scale(scale)  // sidebar is 440px wide, we want to make sure node never renders under sidebar
    );
    refreshData(nodeData);
    //$("#data-container").collapse('show');
    // document.getElementById("signDataList").click();
    sign_data_list = document.getElementById("signDataList")
    if (sign_data_list.className.includes("collapsed")) {
        sign_data_list.click()
    }
}

// Add brushing
gbrush = d3.brush()
// the extent of the brushing is hard-coded for the same reason the height and width
// of the viewbox are hardcoded: it depends on the size of the network graph.
// The extent of the brushing area is different from the viewbox because we want to limit
// the area we can brush to just around the network graph, not the whole screen.
    .extent([[-1250, -1350], [2050, 1950]])
    .on("brush", highlightDots)
    .on("end", showGoTo);

container.append("g")
    .attr("class", "brush")
    .attr("id", "brushArea")
    .call(gbrush);

// Function that is triggered when brushing is performed
function highlightDots() {
    $("#click-me").show()

    let extent = d3.event.selection;
    let dots = svg.selectAll('.node');
    dots.classed('extent', false);

    let inBound = [];
    dots["_groups"][0].forEach(function (d) {
        if (isBrushed(extent, d.getAttribute("cx"), d.getAttribute("cy")) &&
            d.getAttribute("fill") !== InActive_Node_Color) {
            inBound.push(d.getAttribute("id"));
        }
    });

    let brushedNodesProps = getBrushedNodesProps(inBound, signProperties);
    let constraints_dict = createConstraintsDictionary(brushedNodesProps);

    //check from merge
    localStorage.clear();
    tempBrushedsigns = inBound;
    // localStorage.setItem("brushedSigns", inBound);
    localStorage.setItem('constraints', JSON.stringify(constraints_dict));
    localStorage.setItem('filters', JSON.stringify(applied_filters));
    //-------------------------------------------------------
    //let brushed_arr = inBound.split(',');
    display_num_selected_nodes(inBound.length);

    let highlightedGraph = {};
    highlightedGraph.nodes = [];
    highlightedGraph.links = [];
    brushed_graph.nodes.forEach(function (d) {
        //TODO: could be faster
        if (inBound.includes(d.Code)) {
            highlightedGraph.nodes.push(d);
        }
    });
    brushed_graph.links.forEach(function (d) {
        //TODO: faster how?
        //TODO: is the src and tgt symm?
        if (inBound.includes(d.source) && inBound.includes(d.target)
            || inBound.includes(d.target) && inBound.includes(d.source)) {
            highlightedGraph.links.push(d);
        }
    });
    updateSideBar(highlightedGraph, signProperties);
    $("button[name='submit']").hide();
    $("button[name='removeFilter']").hide();
    $("input[type='checkbox']").hide();
    $("input[type='radio']").hide();

    //show sidebar
    setTimeout(function () {
        $("#sidebarCollapse").click();
    }, 1500);

    // $("#sidebarCollapse").click();
    $("#filters").html("Data Counts And Boundaries Report <i class='fas fa-info-circle' data-toggle='tooltip' data-placement='top' title='Limit the number of nodes displayed on the graph based on linguistic features'></i>");
    $("#filter_options").collapse('show');

    let graphCodes = [];
    for (node of highlightedGraph.nodes) {
        if (node.color_code != InActive_Node_Color) {
            graphCodes.push(node['Code']);
        }
    }

    //check if needed after merge. Yes, needed for data pagef
    localStorage.setItem('gCodes', graphCodes);
    //$(".collapse").collapse('show');
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

    let px1 = bbx.getBoundingClientRect().x + bbx.getBoundingClientRect().width * 0.02,
        py1 = bbx.getBoundingClientRect().y + bbx.getBoundingClientRect().height - 80;
    let d = document.getElementById("goto");
    d.style.position = "absolute";
    d.style.left = px + 'px';
    d.style.top = py + 'px';
    d.style.display = "block";

    if (!d3.event.selection) {
        if (filtered_graph) {
            updateSideBar(filtered_graph, signProperties);
        } else {
            updateSideBar(brushed_graph, signProperties);
        }
        $("button[name='submit']").show();
        $("button[name='removeFilter']").show();
        $("input[type='checkbox']").show();
        $("input[type='radio']").show();
        $("#filters").html('Filters<i class="fas fa-info-circle" data-toggle="tooltip" data-placement="top" title="Limit the number of nodes displayed on the graph based on linguistic features"></i>');
        $("#selected_nodes").hide();

        //check post merge if needed
    }
}

//check how to use
function goToPairPlotsGraph() {
    let cur_url = window.location.href.split('/');
    cur_url.pop();
    let goto_url = cur_url.join('/') + '/scatterplot.html?fromNetwork=True' ;
    window.location.replace(goto_url);
}


function popupGo() {
    let cur_url = window.location.href.split('/');
    cur_url.pop();
    let goto_url = cur_url.join('/') + '/scatterplot.html';
    window.location.replace(goto_url);
}

//check how used, came from merge

function updateSliderText(value, domClassName) {
    let prevText = ($("." + domClassName).text()).split(":")[0];
    $("." + domClassName).text(prevText + ":" + value)
        .css({'font-weight': 'bold'});
}


function openDataInNewTab(template_name) {
    let cur_url = window.location.href.split('/');
    cur_url.pop();
    let goto_url = cur_url.join('/') + '/' + template_name + '.html';
    window.open(goto_url, "_blank");
}

function viewData() {
    let graph = filtered_graph ? filtered_graph : brushed_graph;
    let graphCodes = [];
    for (node of graph.nodes) {
        if (node.color_code !== InActive_Node_Color) {
            graphCodes.push(node['Code']);
        }
    }
    localStorage.setItem('gCodes', graphCodes);
    //change the url
    openDataInNewTab("viewdata");
}

function viewDataSummary() {
    localStorage.setItem('constraints', JSON.stringify(constraints_dict));
    localStorage.setItem('filters', JSON.stringify(applied_filters));
    //change the url
    openDataInNewTab("viewdatasummary");
}

function updateSearchList(updatedList) {
    search_box.list = updatedList
}

function initSearchList(graph) {
    //Push words to array for search
    let word_list = graph.nodes.map(function (sign) {
        return sign["EntryID"]
    }).sort();

    let input = document.getElementById("search-box");
    search_box = new Awesomplete(input, {
        list: word_list,
        filter: function (text, input) {
            return text.indexOf(input) === 0;
        }
    });

    $("#search-box").on("awesomplete-selectcomplete", function (event) {
        let selectedNode = graph.nodes.filter(sign => sign["EntryID"] === event.target.value)[0];
        let nodeData = signProperties.filter(node => node.Code === selectedNode["Code"])[0]
        clickToZoom(selectedNode, nodeData);
        hideTip()
        d3.select('#' + selectedNode.Code).dispatch('click');
    });

}



//check how is this needed if not in master?


function attachCountsToDom(constraints_dictionary, remove_optins_with_zero_counts) {
    for (let category in filters_data) {
        for (let filter of filters_data[category]) {
            if (filter["type"] === "categorical") {
                for (let value of filter["values"]) {
                    if (filter["data_attribute"] in constraints_dictionary) {
                        let count = constraints_dictionary[filter["data_attribute"]][value["value"]];
                        if (!count) count = 0;
                        let $elem = $("#" + value["ID"] + "_count");
                        if (!$elem.length) {
                            appendCategoricalOption(value, filter["category"]);
                        }
                        $("#" + value["ID"] + "_count").empty().append("(" + count + ")");
                        if (count === 0) {
                            if (remove_optins_with_zero_counts) {
                                var li = $("#" + value["ID"]).closest("li");
                                li.remove();
                            }
                        }
                    }
                }
            } else if (filter["type"] === "boolean" && constraints_dictionary[filter["data_attribute"]]) {
                let true_count = constraints_dictionary[filter["data_attribute"]]['true'];
                let false_count = constraints_dictionary[filter["data_attribute"]]['false'];
                $("#" + filter["true_id"] + "_count").empty().append("(" + true_count + ")");
                $("#" + filter["false_id"] + "_count").empty().append("(" + false_count + ")");
            }
        }
    }
}


function updateRangeSlider(constraints_dictionary) {
    for (let category in filters_data) {
        for (let filter of filters_data[category]) {
            if (filter["type"] === "range") {
                if (filter["data_attribute"] in constraints_dictionary) {
                    let min = constraints_dictionary[filter["data_attribute"]]["min"];
                    let max = constraints_dictionary[filter["data_attribute"]]["max"];
                    let slider_id = "#" + filter["range"]["slider_id"];
                    let label_id = "#" + filter["range"]["slider_label_id"];
                    $(slider_id).slider({
                        range: true,
                        min: min,
                        max: max,
                        step: 0.5,
                        values: [min, max],
                        slide: function (event, ui) {
                            $(label_id).text("Min: " + ui.values[0] + " - Max: " + ui.values[1]).css({'font-weight': 'bold'});
                        }
                    });
                    $(label_id).text("Min: " + $(slider_id).slider("values", 0) + " - Max: " + $(slider_id).slider("values", 1)).css({'font-weight': 'bold'});
                }
            }
        }
    }
}

function findFilter(filters_data, filter_name) {
    for (let category in filters_data) {
        for (let filter of filters_data[category]) {
            if (filter["category"] === filter_name) {
                return filter;
            }
        }
    }
}

function resetFilterOptions(filter_name) {
    hideTip();
    let filter = findFilter(filters_data, filter_name);

    if (filter_name in applied_filters) {
        delete applied_filters[filter_name];

        if (filter["type"] === "categorical") {
            $("ul." + filter["category"]).empty();
        }

        for (let i = 0; i < active_filters.length; i++) {
            if (active_filters[i] === filter["label_name"]) {
                active_filters.splice(i, 1);
                i--;
            }
        }
        const [result_graph, numActiveNodes] = filter_nodes(brushed_graph, applied_filters);
        update_rendering(result_graph);
        filtered_graph = result_graph;
        //update searchable list to be nly active nodes
        updateSearchList(filtered_graph.nodes.filter(node => node["color_code"] !== InActive_Node_Color).map(function (sign) {
            return sign["EntryID"]
        }).sort());

        let filtered_props = getFilteredNodesProps(result_graph, signProperties);
        let constraints_dictionary = createConstraintsDictionary(filtered_props);
        constraints_dict = constraints_dictionary;
        attachCountsToDom(constraints_dictionary, true);
        //updateRangeSlider(constraints_dictionary);
        show_active_filters(active_filters);
        display_num_active_nodes(numActiveNodes);
    }
}

function appendCategoricalOption(value_obj, filter_category) {
    $("ul." + filter_category).append("<li class='" + filter_category + "'><div class='row'><div class='col'>" +
        "<input type='checkbox' class='form-check-input filters-checkbox' id='" +
        value_obj["ID"] + "'><label class='form-check-label filters-label standard-label-text standard-label-text-black' for='" +
        value_obj["ID"] + "'>" + value_obj["value"] +
        "<span id='" + value_obj["ID"] + "_count'></span>" +
        "</label></div></div><br></li>");
}

function createConstraintsDictionary(properties_data) {
    let constraints_dictionary = {};
    let categorical_attributes = [];
    let range_attributes = [];
    let boolean_attributes = [];


    //get list of all categorical, boolean and range filters
    for (let category in filters_data) {
        for (let subcategory of filters_data[category]) {
            if (subcategory["type"] === "categorical")
                categorical_attributes.push(subcategory["data_attribute"]);
            else if (subcategory["type"] === "range")
                range_attributes.push(subcategory["data_attribute"]);
            else if (subcategory["type"] === "boolean")
                boolean_attributes.push(subcategory["data_attribute"]);
        }
    }

    const mapping = {
        "i": 'Index', "m": "Middle",
        "p": "Pinky", "t": "Thumb", "r": "Ring"
    };

    for (let record of properties_data) {
        for (let attr in record) {
            //compute counts for options of categorical values
            if (categorical_attributes.indexOf(attr) != -1) {
                if (attr in constraints_dictionary) {
                    if (attr === "SelectedFingers.2.0" && record[attr]) {
                        for (let idx = 0; idx < record[attr].length; idx++) {
                            if (mapping[record[attr][idx]] in constraints_dictionary[attr]) {
                                constraints_dictionary[attr][mapping[record[attr][idx]]] += 1;
                            } else {
                                constraints_dictionary[attr][mapping[record[attr][idx]]] = 1;
                            }
                        }
                    } else {
                        if (record[attr] in constraints_dictionary[attr]) {
                            constraints_dictionary[attr][record[attr]] += 1;
                        } else {
                            constraints_dictionary[attr][record[attr]] = 1;
                        }
                    }
                } else {
                    constraints_dictionary[attr] = {};
                    if (attr === "SelectedFingers.2.0" && record[attr]) {
                        for (let idx = 0; idx < record[attr].length; idx++) {
                            constraints_dictionary[attr][mapping[record[attr][idx]]] = 1;
                        }
                    } else {
                        constraints_dictionary[attr][record[attr]] = 1;
                    }
                }

            }
            //compute min and max for range data attributes
            else if (range_attributes.indexOf(attr) != -1) {
                if (attr in constraints_dictionary) {
                    if (record[attr] >= constraints_dictionary[attr]['max'])
                        constraints_dictionary[attr]['max'] = Math.ceil(record[attr])
                    if (record[attr] <= constraints_dictionary[attr]['min'])
                        constraints_dictionary[attr]['min'] = Math.floor(record[attr])
                } else {
                    constraints_dictionary[attr] = {};
                    constraints_dictionary[attr]['min'] = Math.floor(record[attr]);
                    constraints_dictionary[attr]['max'] = Math.ceil(record[attr]);
                }
            }
            //compute false and true counts for boolean data attributes
            else if (boolean_attributes.indexOf(attr) != -1) {
                if (attr in constraints_dictionary) {
                    if (record[attr] == 1.0) {
                        constraints_dictionary[attr]['true'] += 1;
                    } else if (record[attr] == 0.0) {
                        constraints_dictionary[attr]['false'] += 1;
                    }
                } else {
                    constraints_dictionary[attr] = {'true': 0, 'false': 0};
                }
            }
        }
    }
    return constraints_dictionary;
}



function createCountDictionary(properties_data) {
    let count_dictionary = {};
    //TO DO: need to initialize this by from filters data
    const categorical_attributes = ['Handshape.2.0', 'NonDominantHandshape.2.0', 'ThumbPosition.2.0',
        'SignType.2.0', 'SelectedFingers.2.0', 'Flexion.2.0', 'MajorLocation.2.0',
        'MinorLocation.2.0', 'SecondMinorLocation.2.0', 'Movement.2.0', 'LexicalClass'];

    for (let property of properties_data) {
        for (let attr in property) {
            if (categorical_attributes.indexOf(attr) !== -1) {
                if (attr in count_dictionary) {
                    if (property[attr] in count_dictionary[attr]) {
                        count_dictionary[attr][property[attr]] += 1;
                    } else {
                        count_dictionary[attr][property[attr]] = 1;
                    }
                } else {
                    count_dictionary[attr] = {};
                    count_dictionary[attr][property[attr]] = 1;
                }
            }
        }
    }
    return count_dictionary;
}

function create_filter_object(category_data) {

    let filter = {};
    filter["type"] = category_data["type"];
    filter["key"] = category_data["data_attribute"];
    filter["label_name"] = category_data["label_name"];
    filter["values"] = [];
    filter["range"] = {"min": -1, "max": -1};

    if (category_data["type"] === "range") {
        filter["range"]["max"] = $('#' + category_data["range"]["slider_id"]).slider("values", 1);
        filter["range"]["min"] = $('#' + category_data["range"]["slider_id"]).slider("values", 0);
        update_active_filters("add", category_data["label_name"]);
    } else if (category_data["type"] === "boolean") {
        if ($('#' + category_data["true_id"]).is(":checked")) {
            filter["values"].push(1.0);
        } else if ($('#' + category_data["false_id"]).is(":checked")) {
            filter["values"].push(0.0);
        }
        update_active_filters("add", category_data["label_name"]);
    } else if (category_data["type"] === "categorical") {
        let isActive = false;
        for (value of category_data["values"]) {
            if ($('#' + value["ID"]).is(":checked")) {
                filter["values"].push(value["value"]);
                isActive = true;
            }
        }
        if (isActive) {
            update_active_filters("add", category_data["label_name"]);
        } else {
            update_active_filters("remove", category_data["label_name"]);
        }
    }
    return filter;
}

function getFilteredNodesProps(graph, sign_props) {
    let hashed_props = hashSignProps(sign_props);
    let result = [];
    for (let node of graph.nodes) {
        if (node["color_code"] !== InActive_Node_Color) {
            result.push(hashed_props[node["Code"]]);
        }
    }
    return result;
}


//check came in from merge
function getBrushedNodesProps(inBound, sign_props) {
    let hashed_props = hashSignProps(sign_props);
    let result = [];
    for (let code of inBound) {
        result.push(hashed_props[code]);
    }
    return result;
}

function hashSignProps(property_data) {
    let hashed_properties = {};
    for (let prop of property_data) {
        hashed_properties[prop["Code"]] = prop;
    }
    return hashed_properties;
}

function hideTip() {
    tip.hide();
}

function submit(category, subcategory) {

    hideTip();
    let category_data = filters_data[category].find(function (obj) {
        return obj["category"] == subcategory;
    });
    applied_filters[subcategory] = create_filter_object(category_data)
    const [result_graph, numActiveNodes] = filter_nodes(brushed_graph, applied_filters);
    update_rendering(result_graph);
    filtered_graph = result_graph;
    //update searchable list to be nly active nodes
    updateSearchList(filtered_graph.nodes.filter(node => node["color_code"] !== InActive_Node_Color).map(function (sign) {
        return sign["EntryID"]
    }).sort());

    //update side bar
    let filtered_props = getFilteredNodesProps(result_graph, signProperties);
    let constraints_dictionary = createConstraintsDictionary(filtered_props);
    constraints_dict = constraints_dictionary;
    attachCountsToDom(constraints_dictionary, true);
    //updateRangeSlider(constraints_dictionary);
    //----------------------------------------------
    show_active_filters(active_filters);
    display_num_active_nodes(numActiveNodes);
}

function updateSideBar(graph, signProperties) {
    let filtered_props = getFilteredNodesProps(graph, signProperties);
    let constraints_dictionary = createConstraintsDictionary(filtered_props);
    constraints_dict = constraints_dictionary;
    attachCountsToDom(constraints_dictionary, true);
    updateRangeSlider(constraints_dictionary);
}

function show_active_filters(active_filters) {
    $('#active_filters').empty()
    $('#active_filters').append('<h5 class="standard-label-text">Active Filters:</h5>');
    $('#active_filters').append('<h5 id="filter_badges"></h5>');

    if (active_filters.length > 0) {
        for (let filter of active_filters) {
            badge_title = create_badge_title(filter, applied_filters);
            $('#filter_badges').append('<span class="badge badge-pill badge-danger active-filter-label standard-label-text" title=' + badge_title + '>' + filter + '</span>');
        }

    } else {
        badge_title = "None";
        $('#filter_badges').append('<span class="badge badge-pill badge-danger active-filter-label standard-label-text" title=' + badge_title + '>' + "None" + '</span>');
    }

}

function update_active_filters(mode, filter) {
    if (mode === "add" && !active_filters.includes(filter)) {
        active_filters.push(filter);
    } else if (mode === "remove" && active_filters.includes(filter)) {
        active_filters.splice(active_filters.indexOf(filter), 1);
    }
}

function display_num_active_nodes(numActiveNodes) {
    ACTIVE_NODES = numActiveNodes
    $('#active_nodes').empty();
    $('#active_nodes').append('<h5 class="standard-label-text">Active Nodes: ' + numActiveNodes + '</h5>');
}

function display_num_selected_nodes(numSelctedNodes) {
    ACTIVE_NODES = numSelctedNodes
    $('#selected_nodes').empty();
    $("#selected_nodes").show();
    $('#selected_nodes').append('<h5 class="standard-label-text">Selected Nodes: ' + numSelctedNodes + '</h5>');
}

function create_badge_title(filter_label_name, applied_filters) {
    for (let key in applied_filters) {
        if (applied_filters[key]['label_name'] == filter_label_name) {
            if (applied_filters[key]['type'] == 'boolean') {
                title = (applied_filters[key]['values'][0] == 1) ? "True" : 'False';
                return title;
            } else if (applied_filters[key]['type'] == 'range') {
                range = applied_filters[key]['range'];
                return "Min:" + range['min'] + ",Max:" + range['max'];
            } else if (applied_filters[key]['type'] == 'categorical') {
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
    return function (node) {
        for (let category in applied_filters) {
            filter = applied_filters[category];
            if (filter["type"] === "categorical" || filter["type"] === "boolean") {
                if (filter["key"] === "SelectedFingers.2.0" && node[filter["key"]]) {
                    values = filter["values"].map(value => value.charAt(0).toLowerCase());
                    values = values.sort().join();
                    if (values.indexOf(node[filter["key"].split().sort().join()]) != -1)
                        return true;
                    else
                        return false;
                } else if (filter["values"].length > 0 && !filter["values"].includes(node[filter["key"]]))
                    return false;
            } else if (filter["type"] === "range") {
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
    //filter nodes of the graph
    filtered_nodes_Data.forEach(function (d) {
        //join the nodes of the graph with their corrseponding record in filtered poroperties on "Code"
        //let node_matches = graph.nodes.filter(node => node["EntryID"].toLowerCase() === d["EntryID"].toLowerCase());
        let node_matches = graph.nodes.filter(node => node["Code"] === d["Code"]);
        for (idx in node_matches) {
            node_codes.push(node_matches[idx]["Code"]);
        }
    });
    //we have to create a separate result graph
    //we need to original graph to be able to revert back the filters
    for (let idx in graph.nodes) {
        node = graph.nodes[idx]
        new_node = {};
        //copy all the attrbiutes of graph node
        for (key in node) {
            new_node[key] = node[key];
        }
        //if node hasn't passed the filters change its color_code to gray
        if (!node_codes.includes(node["Code"])) {
            new_node['color_code'] = InActive_Node_Color;
            numActiveNodes += -1;
        }
        result.nodes.push(new_node);
    }
    //add all the link  of the original graph to result graph
    graph.links.forEach(function (link) {
        result.links.push(link);
    });
    return [result, numActiveNodes];
}

function update_rendering(graph) {
    // making sure labels stay on for nodes that already have labels turned on
    d3.selectAll("text").data(graph.nodes)
        .attr("opacity", function (d) {
            let selected = (SCALE_FACTOR - 1) * 0.3 * (TOTAL_SIGNS / ACTIVE_NODES)  // scale the number of visible labels to the number of active nodes
            numNodes = Math.floor(ACTIVE_NODES * selected)
            numVisible = 0
            if (numVisible < numNodes) {
                if (d.color_code !== InActive_Node_Color) {
                    numVisible += 1;
                    return 1;
                }
            }
            return 0;
        });

    let links = container.attr("class", "links")
        .selectAll("line").data(graph.links);

    let nodes = container.attr("class", "nodes")
        .selectAll("circle").data(graph.nodes);

    links.enter()
        .append("line")
        .attr("stroke", function (l) {
            let source = graph.nodes.filter((node, i) => {
                return node.Code === l.source;
            })[0];
            let target = graph.nodes.filter((node, i) => {
                return node.Code === l.target;
            })[0];
            //if source and target node colors don't math average them
            if (source.color_code != target.color_code) {
                return "#" + avgColor(source.color_code.slice(1), target.color_code.slice(1))
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
            return 3;
        })
        .attr("stroke-opacity", function (l) {
            return 0
        });


    // Create Tooltips
    tip = d3.tip().attr('class', 'd3-tip').direction('e').offset([0, 50]);

    // create HTML that will populate tooltip popup
    let tipHTML = function (d) {
        if (d.color_code === InActive_Node_Color) {
            return "<span id='nodeDisabledLabel' class='standard-label-text'>Node Disabled Due To Filtering</span>";
        }
        let nodeData = signProperties.filter(node => node.Code === d["Code"])[0];

        let video = nodeData['VimeoVideo'] ?
            "<div id='outerTooltipDiv'>" +
                "<div id='outerVideoLoaderDiv'>" +
                    "<div id='innerVideoLoaderDiv'>" +
                        "<img id='tooltipGif' src='assets/tooltip_loader2.gif'>" +
                    "</div>" +
                "</div>" +
                "<div id='tooltipVideoDiv'>" +
                    "<iframe width='230' height='158' src=" + nodeData['VimeoVideo'] + "?title=0&byline=0&portrait=0&background=1&loop=1 frameborder='0' allow='autoplay; fullscreen' allowfullscreen></iframe>" +
                "</div>" +
            "</div>"
            :
            "<span id='noVideoAvailableLabel' class='standard-label-text'>No video available</span><br>";
        let otherTranslations = nodeData.SignBankEnglishTranslations ? cleanTranslations(nodeData.SignBankEnglishTranslations) : "<br><span id='noAlternateEnglishTranslationsLabel' class='standard-label-text'>No alternate English translations</span>"
        return (
            "<div id='tooltipTitle' class='standard-label-text standard-label-text-medium'>" + d.EntryID + "</div>" +
            "<button onclick='hideTip()' id='tooltip-closeButton'><b>X</b></button><br><br>" + video + "<br>" +
            "<div id='alternateEnglishTranslationsTitle' class='standard-label-text'>Alternate English Translations:</div>" + otherTranslations
        );
    };

    // call tip within svg
    svg.call(tip);

    // close any tooltip showing by clicking somewhere else on the graph
    svg.on("click", function (g) {
        // $("#click-me").hide();
        // $("[data-toggle='popover']").popover('hide');
        hideTip();

    });


    $('body').on('click', function (e) {
        //only buttons
        if ($(e.target).data('toggle') !== 'popover'
            && $(e.target).parents('.popover.in').length === 0 && e.target.id !== "click-me" && e.target.id !== "sidebarCollapse") {

            $('[data-toggle="popover"]').popover('hide');
            $("#click-me").hide();
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

    nodes.enter()
        .append("circle")
        .classed("node", true)
        .on("mouseenter", function (d, i) {
            d3.select(this)
                .attr("stroke-opacity", 1)
                .attr("r", function (d) {
                    let frequency = d['SignFrequency(Z)'];
                    let radius = frequency ? ((frequency + 2.039) * 3) + 3.5 : 3.5;
                    if (d3.select(this).attr("isClicked") !== 'true') {
                        return radius * 2; // on mouse enter, make the node twice as large as it was originally
                    } else {
                        return radius * 3; // unless it is selected, then it should be 3x as large
                    }
                });
            d3.selectAll("line")
                .style('stroke-opacity', function (link_d) {
                    if (link_d.source === d.Code || link_d.target === d.Code) {
                        return 1;
                    }
                });
            // wait 1 second before showing tooltip, to prevent random tooltips from popping up
            tooltipTimeout = setTimeout(function(){
                d3.select('#' + d.Code).dispatch('showTip');
            }, 1000);
        })
        .on("showTip", function (d, i) {
            // show tooltip for this node
            tip.html(tipHTML(d)).show();
        })
        .on("mouseout", function (d, i) {
            clearTimeout(tooltipTimeout)
            hideTip()
            d3.selectAll("line").style('stroke-opacity', function (link_d) {
                if (link_d.source === d.Code || link_d.target === d.Code) {
                    return 0
                }
            });
            // Only set radius back to normal (not enlarged) and take away black outline if the
            // node is NOT selected. Otherwise return without resetting node size.
            if (d3.select(this).attr("isClicked") === 'true') {
                return
            }
            d3.select(this)
                .attr("stroke-opacity", 0)
                .attr("r", function (d) {
                    // return 3.5;
                    let frequency = d['SignFrequency(Z)'];
                    let radius = frequency ? ((frequency + 2.039) * 3) + 3.5 : 3.5;
                    return radius;
                });
        })
        .on("click", function (d, i) {
            // set every other circle to be NOT clicked and format correctly
            d3.selectAll('circle')
                .attr('isClicked', false)
                .attr("stroke-opacity", 0)
                .attr("stroke-width", 1)
                .attr("r", function (d) {
                    // return 3.5;
                    let frequency = d['SignFrequency(Z)'];
                    let radius = frequency ? ((frequency + 2.039) * 3) + 3.5 : 3.5;
                    return radius;
                });
            // now set THIS node to be clicked, and format correctly
            clicked_sign_code = d.Code;
            d3.select(this)
                .attr('isClicked', true)
                .attr("stroke-opacity", 1)
                .attr("stroke-width", 3)
                .attr("r", function (d) {
                    // return 10;
                    let frequency = d['SignFrequency(Z)'];
                    let radius = frequency ? ((frequency + 2.039) * 3) + 3.5 : 3.5;
                    radius = radius * 3; // on click, make node even larger than on hover, to highlight it
                    return radius;
                });
            // now send information to clickToZoom
            let nodeData = signProperties.filter(node => node.Code === d["Code"])[0];
            clickToZoom(d, nodeData);
            $("#sidebarCollapse").click();

        })
        .attr("r", function (d) {
            // return 3.5;
            let frequency = d['SignFrequency(Z)'];
            let radius = frequency ? ((frequency + 2.039) * 3) + 3.5 : 3.5;
            return radius;
        })
        .attr("fill", function (d) {
            return d.color_code;
        })
        .attr("stroke", "black")
        .attr("stroke-opacity", 0)
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("id", function (d) {
            return d.Code;
        });

    // add english labels to nodes (cannot add labels to circles, because circles are not containers)
    // this way may render labels over some nodes and under others
    nodes.enter()
        .append("text")
        .attr("dx", function (d) {
            return d.x + 10 // render the label slightly to the right of the node
        })
        .attr("dy", function (d) {
            return d.y + 5 // render label at same level as node
        })
        .attr("opacity", 0) // opacity is 0 so labels do not appear
        // .attr("class", "standard-label-text")
        .attr("font-size", 12)
        .attr("font-family", "sans-serif")
        .attr("font-weight", "400")
        .attr("paint-order", "stroke")
        .attr("stroke", "white")
        .attr("stroke-width", "2")
        .text(function (d) {
            return d.EntryID
        });


    /*
    DISABLED NODES / NODES THAT ALREADY EXIST
     */
    nodes
        .attr("fill", function (d) {
            return d.color_code;
        })
        .on("mouseenter", function (d, i) {
            if (d.color_code == InActive_Node_Color) {
                return
            }
            // Do we want disabled nodes to show edges??
            d3.selectAll("line").style('stroke-opacity', function (link_d) {
                if (link_d.source === d.Code || link_d.target === d.Code) {
                    return 1;
                }
            });
            d3.select(this)
                .attr("stroke-opacity", 1)
                .attr("r", function (d) {
                    let frequency = d['SignFrequency(Z)'];
                    let radius = frequency ? ((frequency + 2.039) * 3) + 3.5 : 3.5;
                    if (d3.select(this).attr("isClicked") !== 'true') {
                        return radius * 2; // on mouse enter, make the node twice as large as it was originally
                    } else {
                        return radius * 3; // unless it is selected, then it should be 3x as large
                    }
                });
            // wait 1 second before showing tooltip, to prevent random tooltips from popping up
            tooltipTimeout = setTimeout(function(){
                d3.select('#' + d.Code).dispatch('showTip');
            }, 1000);
        })
        .on("mouseout", function (d, i) {
            clearTimeout(tooltipTimeout)
            hideTip()
            if (d.color_code == InActive_Node_Color) {
                return;
            }
            d3.selectAll("line").style('stroke-opacity', function (link_d) {
                if (link_d.source === d.Code || link_d.target === d.Code) {
                    return 0;
                }
            });
            // Only set radius back to normal (not enlarged) and take away black outline if the
            // node is NOT selected. Otherwise return without resetting node size.
            if (d3.select(this).attr("isClicked") === 'true') {
                return
            }
            d3.select(this)
                .attr("stroke-opacity", 0)
                .attr("r", function (d) {
                    let frequency = d['SignFrequency(Z)'];
                    let radius = frequency ? ((frequency + 2.039) * 3) + 3.5 : 3.5;
                    return radius;
                });
        })
        .on("click", function (d, i) {
            if (d.color_code == InActive_Node_Color) {
                return;
            }
            // set every other circle to be NOT clicked and format correctly
            d3.selectAll('circle')
                .attr('isClicked', false)
                .attr("stroke-opacity", 0)
                .attr("stroke-width", 1)
                .attr("r", function (d) {
                    // return 3.5;
                    let frequency = d['SignFrequency(Z)'];
                    let radius = frequency ? ((frequency + 2.039) * 3) + 3.5 : 3.5;
                    return radius;
                });
            // now set THIS node to be clicked, and format correctly
            clicked_sign_code = d.Code
            d3.select(this)
                .attr('isClicked', true)
                .attr("stroke-opacity", 1)
                .attr("stroke-width", 3)
                .attr("r", function (d) {
                    // return 10;
                    let frequency = d['SignFrequency(Z)'];
                    let radius = frequency ? ((frequency + 2.039) * 3) + 3.5 : 3.5;
                    radius = radius * 3; // on click, make node even larger than on hover, to highlight it
                    return radius;
                });
            // now send information to clickToZoom
            let nodeData = signProperties.filter(node => node.Code === d["Code"])[0];
            clickToZoom(d, nodeData);
        });

    links
        .attr("stroke", function (l) {
            let source = graph.nodes.filter((node, i) => {
                return node.Code === l.source;
            })[0];
            let target = graph.nodes.filter((node, i) => {
                return node.Code === l.target;
            })[0];
            /*if (source.color_code == InActive_Node_Color || target.color_code == InActive_Node_Color) {
                return InActive_Node_Color
            }*/
            //if source and target node colors don't match average them
            if (source.color_code !== target.color_code) {
                return "#" + avgColor(source.color_code.slice(1), target.color_code.slice(1))
            }
            return source.color_code;
        })
}

function cleanTranslations(alternateTranslations) {
    let translationsArray = alternateTranslations.split(",")
    let bulletPoints = "<div id='alternateEnglishTranslationsDiv'><ul id='alternateEnglishTranslationsList'>"
    for (let word of translationsArray) {
        bulletPoints += "<li class='standard-label-text'>"
        bulletPoints += word
        bulletPoints += "</li>"
    }
    bulletPoints += "</ul></div>";
    return bulletPoints
}


//Also fetch sign properties on the side

function reset() {
    localStorage.clear();
    window.location.reload(false);
}

function search(category) {
    const input = $("#" + category + "_search_id");
    const filter = input.val().toUpperCase();
    $("li." + category).each(function () {
        let label = $(this).find("label")[0];
        if (label.innerHTML.toUpperCase().indexOf(filter) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function convertToCSV(propertiesJSON) {
    let array = typeof propertiesJSON != 'object' ? JSON.parse(propertiesJSON) : propertiesJSON;
    let result = '';

    for (let prop of propertiesJSON) {
        let line = '';
        for (let key in prop) {
            if (line !== '') line += ','
            if (key !== 'video') {
                line += prop[key];
            }
        }
        result += line + '\r\n';
    }
    return result;
}

function downloadCSV(csvStr, fileName) {

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvStr);
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName;
    hiddenElement.click();
}

function downloadData(option) {
    let properties = filtered_graph ? getFilteredNodesProps(filtered_graph, signProperties)
        : getFilteredNodesProps(brushed_graph, signProperties);
    let CSVData = null;
    if (option === 'properties') {
        CSVData = convertToCSV(properties);
    } else if (option === 'counts') {

    }
    downloadCSV(CSVData, 'properties.csv');
}

function refreshData(node) {
    // clear contents
    $('#data-container').empty();

    let excluded_feature_list = ["index", "Code", "YouTube Video", "VimeoVideoHTML", "VimeoVideo", "color_code", "group_id", "SignBankEnglishTranslations", "SignBankAnnotationID", "SignBankLemmaID", "Parameter.Neighborhood.Density.2.0"];
    let property_strings_to_split = ['SignType.2.0', 'SignTypeM2.2.0', 'SecondMinorLocationM2.2.0', 'MovementM2.2.0', 'MinorLocationM2.2.0', 'MinorLocation.2.0', 'Flexion.2.0', 'NonDominantHandshape.2.0', 'SecondMinorLocation.2.0', 'Movement.2.0', 'ThumbPosition.2.0', 'SignTypeM3.2.0'];

    let videoHeight = 300;
    let videoWidth = 400;

    let video = node['VimeoVideo'] ?
        "<div id='outerSidebarDiv' class='sign-data-bottom-margin'>" +
            "<div id='outerSidebarVideoLoaderDiv'>" +
                "<div id='innerSidebarVideoLoaderDiv'>" +
                    "<img id='tooltipGif' src='assets/tooltip_loader3.gif'>" +
                "</div>" +
            "</div>" +
            "<div id='sidebarVideoDiv'>" +
                "<iframe width='"+videoWidth+"' height='"+videoHeight+"' src=" + node['VimeoVideo'] + "?title=0&byline=0&portrait=0&background=1&loop=1 frameborder='0' allow='autoplay; fullscreen' allowfullscreen></iframe>" +
            "</div>" +
        "</div>"
        :
        "<div class='standard-label-text sign-data-bottom-margin'>No video available</div>";

    let otherTranslations = node['SignBankEnglishTranslations'] ?
        '<div class="standard-label-text sign-data-bottom-margin">' + node['SignBankEnglishTranslations'] + '</div>'
        :
        "<div class='standard-label-text sign-data-bottom-margin'>No alternate English translations</div>";

    $('#data-container').append('<div class="standard-label-text standard-label-text-medium sign-data-bottom-margin">' + node['EntryID'] + ':</div>');
    $('#data-container').append(video);
    $('#data-container').append('<div class="standard-label-text standard-label-text-medium">' + "Alternate English Translations:" + '</div>');
    $('#data-container').append(otherTranslations);
    $('#data-container').append('<div id="aboutTheSign" class="standard-label-text standard-label-text-medium sign-data-bottom-margin">' + "About the sign:" + '</div>');
    // we add the sign data as a table
    $('#data-container').append('<table id="signData-table">');

    for (const property in node) {
        // if the variable name should not be in the sign data panel, don't add it
        if (excluded_feature_list.includes(property)) {
            continue;
        }
        // only add property if we have a display name for it
        if (property_display_names[property]) {
            // only display properties whose value is not null
            if (node[property] != null) {
                // some properties have values that are long strings of concatenated capitalized words.
                // if the current property is one of those properties, split the string on the capital letters.
                // this is to help with the formatting of the sign data table, so the columns can be evenly distributed.
                let node_prop_value = null;
                if (property_strings_to_split.includes(property)) {
                    node_prop_value = node[property].split(/(?=[A-Z])/).join(" ");
                } else {
                    node_prop_value = node[property];
                }
                // add a row to the sign data table with this property display name and value
                $('#signData-table').append('<tr>' +
                    '<td class="standard-label-text">' + property_display_names[property] + '</td>' +
                    '<td class="standard-label-text">' + node_prop_value + '</td>' +
                    '</tr>')
            }
        }
    }

    $('#data-container').addClass('active');
}

// Programmatically add tooltips to the small info circles on the buttons on the sidebar.
// See filter_data.js for dictionary of tooltip text descriptions.
function addTooltipText() {
    for (let key in tooltips_text) {
        let element = document.getElementById(key);
        element.setAttribute("data-toggle", "tooltip");
        element.setAttribute("data-placement", "top");
        element.setAttribute("title", tooltips_text[key]);
    }
}

function openTutorial() {
    window.open("http://asl-lex.org");
}