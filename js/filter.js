var optionTitle = '';
var ASL_data = [ ];
var word_list = [ ];

$(document).ready(function() {

    // declare new graph
    s = new sigma('sigma-container');
    c = s.camera;

    // set graph settings
    s.settings({
        eventsEnabled: true,
        edgeColor: "default",
        maxEdgeSize: 0.15,
        defaultLabelSize: 12,
        labelThreshold: 12,
    });

    s.bind('clickNode',function(caller) {
        var node = caller['data']['node'];
    
        if (node['good-word']) refreshData(node);
        else nodeNotice();

    }).refresh();

    $(".zoom-in").bind("click",function(){
        sigma.misc.animation.camera(
            s.camera, {
                ratio: s.camera.ratio / c.settings('zoomingRatio')
            }, {
                duration: s.settings('animationsTime') || 300
        });
    });

    $(".zoom-out").bind("click",function(){
        sigma.misc.animation.camera(
            s.camera, {
                ratio: s.camera.ratio * c.settings('zoomingRatio')
            }, {
                duration: s.settings('animationsTime') || 300
        });
    });

    $(".zoom-reset").bind("click",function(event){
        sigma.misc.animation.camera(
            s.camera, {
                x: 0, 
                y: 0,
                ratio: 1
            }, {
                duration: s.settings('animationsTime') || 300
        });
    });

    $.ajax({
        url: "http://asllex.herokuapp.com/getNodes",
    }).done(function(data) {
        for (node_i = 0; node_i < data.length; node_i++) {
            var node = data[node_i];

            node['sign'] = node['sign'].toUpperCase();
            node['label'] = String(node['sign']);
            node['id'] = String(node['id']);
            node['good-word'] = true;
            s.graph.addNode(node);

            word_list.push(node['sign']);
        }

        $.ajax({
            url: "http://asllex.herokuapp.com/getEdges",
        }).done(function(data) {
            for (edge_i = 0; edge_i < data.length; edge_i++) {
                var edge = data[edge_i];
                edge['id'] = String(edge['id']);
                edge['source'] = String(edge['source']);
                edge['target'] = String(edge['target']);

                if (edge['source'] != "574" && edge['target'] != "574") {
                    s.graph.addEdge(edge);  
                }   
            }

            s.refresh();
        });

        word_list.sort();
        $( "#search-input" ).autocomplete({
            source: word_list,
            select: function(event, ui) {
                graphSearch(ui.item.label);
            },
        });

        s.refresh();

        $("#loading_gif").css({'display': 'none'});
    });

    $('#search-input').keypress(function (e) {
        if (e.which == 13) {
            graphSearch($('#search-input').val());
            return false;
        }
    });

    continuous_filter = new jBox('Confirm',{
        attach: $('.constrain-btn.continuous'),
        width: 350,
        height: 100,
        confirmButton: "Submit",
        getTitle: 'data-jbox-title',
        content: $('#jBox-slider-grab'),
        onOpen: function() {
            optionTitle = this.source['0'].dataset['jboxTitle'];
            $('#constraint-A').val(filter_data[optionTitle].valueA);
            $('#constraint-B').val(filter_data[optionTitle].valueB);
        }
    });

    categorical_filter = new jBox('Confirm',{
        attach: $('.constrain-btn.categorical'),
        width: 350,
        height: 200,
        confirmButton: "Submit",
        getTitle: 'data-jbox-title',
        content: $('#jBox-toggle-grab'),
        onOpen: function() {
            optionTitle = this.source['0'].dataset['jboxTitle'];
            
            // clear out button group
            $('#jBox-toggle-grab .btn-group').html('');

            for (i = 0; i < filter_data[optionTitle]['values'].length; i++) {

                // see if it should be checked
                if (filter_data[optionTitle]['allowed'].indexOf(filter_data[optionTitle]['values'][i]) > -1) is_checked = 'checked';
                else is_checked = '';

                // add string to button group
                var append_string = '<input type="checkbox" id="group' + i + '" data-toggle="button" ' + is_checked + '><label class="btn btn-primary" for="group' + i + '">' + filter_data[optionTitle]['values'][i] + '</label>';
                $('#jBox-toggle-grab .btn-group').append(append_string);
            }

            // refresh button group to trigger
            $('#jBox-toggle-grab .btn-group').trigger('create');
        }
    });

    boolean_filter = new jBox('Confirm',{
        attach: $('.constrain-btn.boolean'),
        width: 350,
        height: 175,
        confirmButton: "Submit",
        getTitle: 'data-jbox-title',
        content: $('#jBox-radio-grab'),
        onOpen: function() {
            optionTitle = this.source['0'].dataset['jboxTitle'];
            
            // set the boolean to the value associated with this option
            if (filter_data[optionTitle]['value'] == true) {
                $('#false_radio').addClass('ui-radio-off');
                $('#false_radio').removeClass('ui-radio-on');
                $('#true_radio').addClass('ui-radio-on');
                $('#true_radio').removeClass('ui-radio-off');
            } else if (filter_data[optionTitle]['value'] == false) {
                $('#false_radio').addClass('ui-radio-on');
                $('#false_radio').removeClass('ui-radio-off');
                $('#true_radio').addClass('ui-radio-off');
                $('#true_radio').removeClass('ui-radio-on');
            } else {
                $('#false_radio').addClass('ui-radio-off');
                $('#false_radio').removeClass('ui-radio-on');
                $('#true_radio').addClass('ui-radio-off');
                $('#true_radio').removeClass('ui-radio-on');
            }
        }
    });

    popup_about = new jBox('Modal',{
        attach: $('#about-filters'),
        width: 550,
        height: 400,
        title: 'Filtering in ASLLex',
        content: $('#jBox-about-filter-grab'),
    });

    popup_about_2 = new jBox('Modal',{
        attach: $('#about-container a'),
        width: 350,
        height: 300,
        title: 'About ASLLex',
        content: $('#jBox-about-grab')
    });
});

// function run when user presses submit on a constrain popup
function confirm() {
    if (filter_data[optionTitle]['type'] == 'boolean') {
        // check if user selected either option
        // if they did, store this value
        if ($('#true_radio').hasClass('ui-radio-on')) {
            filter_data[optionTitle]['value'] = true;
        } else if ($('#false_radio').hasClass('ui-radio-on')) {
            filter_data[optionTitle]['value'] = false;
        } else {
            filter_data[optionTitle]['value'] = null;
        }
        
    } else if (filter_data[optionTitle]['type'] == 'categorical') {
        // check if user selected any options
        // if they did, store these values in the array

    } else if (filter_data[optionTitle]['type'] == 'continuous') {
        var valA = $('#constraint-A').val();
        var valB = $('#constraint-B').val();
        if (valA == "") valA = null;
        if (valB == "") valB = null;

        if (($.isNumeric(valA) || valA == null) && ($.isNumeric(valB) || valB == null)) {
            if (($.isNumeric(valA) && $.isNumeric(valB) && valA < valB) ||
               (valA == null || valB == null))  {
                filter_data[optionTitle].valueA = valA;
                filter_data[optionTitle].valueB = valB;
            }
        } else {
            alert("Invalid constraints, please try again");
        }
    }

    updateNodes();
    updateEdges();

    s.refresh();
}

function updateNodes() {
    console.log(filter_data);

    s.graph.nodes().forEach(function(n) {
        for (option in filter_data) {
            if (filter_data[optionTitle]['type'] == 'boolean') {
                var node_value = n['attributes'][option];
                var value = filter_data[option]['value'];

                if (value == null || value == node_value) {
                    n['good-word'] = true;
                    n['color'] = n['attributes']['original_color'];
                    n['size']  = n['attributes']['original_size'];
                } else {
                    n['good-word'] = false;
                    n['color'] = '#D8D8D8';
                    n['size'] = 8;
                    break;
                }

            } else if (filter_data[optionTitle]['type'] == 'categorical') {
                var node_value = n['attributes'][option];
                var value_array = filter_data[option]['allowed'];

                console.log(node_value);
                console.log(value_array);

                if (value_array.indexOf(node_value) > -1) {
                    n['good-word'] = true;
                    n['color'] = n['attributes']['original_color'];
                    n['size']  = n['attributes']['original_size'];
                } else {
                    n['good-word'] = false;
                    n['color'] = '#D8D8D8';
                    n['size'] = 8;
                    break;
                }

            } else if (filter_data[optionTitle]['type'] == 'continuous') {
                var node_value = n['attributes'][option];
                var valA = filter_data[option].valueA;
                var valB = filter_data[option].valueB;

                if ((valA == null || node_value >= valA) &&
                    (valB == null || node_value <= valB)) {
                    n['good-word'] = true;
                    n['color'] = n['attributes']['original_color'];
                    n['size']  = n['attributes']['original_size'];
                } else {
                    n['good-word'] = false;
                    n['color'] = '#D8D8D8';
                    n['size'] = 8;
                    break;
                }
            }
            
        }  
    });
}

function updateEdges() {
    s.graph.edges().forEach(function(e) {
        if (s.graph.nodes(e['source'])['good-word'] && s.graph.nodes(e['target'])['good-word']) {
            e['color'] = s.graph.nodes(e['source'])['color']
        } else {
            e['color'] = '#D8D8D8';
        }
    });
}

function removeFilters() {
    for (option in filter_data) {
        if (filter_data[optionTitle]['type'] == 'boolean') {
            filter_data[option]['value'] = null;
            
        } else if (filter_data[optionTitle]['type'] == 'categorical') {
            filter_data[option]['allowed'] = filter_data[option]['values']

        } else if (filter_data[optionTitle]['type'] == 'continuous') {
            filter_data[option]['valueA'] = null;
            filter_data[option]['valueB'] = null;
        }
    }

    updateNodes();
    updateEdges();

    s.refresh();
}

function graphSearch(value) {
    s.graph.nodes().forEach(function(n) {
        if (n['sign'] == value && n['good-word'])  refreshData(n); 
        else if (n['sign'] == value) nodeNotice();
    });
}

function refreshData(node) {
    $('#data-container p').remove();

    // set video attributes to show motion
    video_ID  = "D3E2jFnZsEQ";
    videoLink = "https://www.youtube.com/embed/" + video_ID + "?showinfo=0&rel=0&loop=1&modestbranding=1&controls=0";
    $('#word_vid').attr('src', videoLink);
    
    // add rest of node attributes
    for (attribute in node['attributes']) {
        if (attribute.indexOf('original') === -1) {
            $('#data-container').append('<p>' + attribute + ': ' + node['attributes'][attribute] + '</p>');
        }
            
    }

    $('.tabs li').removeClass('selected');
    $('#filter-container, #about-container').css('display','none');
    $('#data-tab').addClass('selected');
    $('#data-container').css('display','block');
}

function nodeNotice() {
    new jBox('Notice',{
        content: "Word Disabled Due to Filter",
        autoClose: 1500,
        attributes: {
            x: 'right',
            y: 'top'
        },
        position: {
            x: 70,
            y: 7,
        }
    });
}
