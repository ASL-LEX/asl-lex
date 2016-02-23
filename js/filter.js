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
        labelThreshold: 9,
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

            node['EntryID'] = node['EntryID'].toUpperCase();
            node['attributes']['LemmaID'] = node['attributes']['LemmaID'].toUpperCase();
            node['label'] = String(node['EntryID']);
            node['id'] = String(node['id']);
            node['good-word'] = true;
            s.graph.addNode(node);

            word_list.push(node['EntryID']);
        }

        updateNodeFilterCount(data.length);

        $.ajax({
            url: "http://asllex.herokuapp.com/getEdges",
        }).done(function(data) {
            for (edge_i = 0; edge_i < data.length; edge_i++) {
                var edge = data[edge_i];
                edge['id'] = String(edge['id']);
                edge['source'] = String(edge['source']);
                edge['target'] = String(edge['target']);

                s.graph.addEdge(edge);
            }

            s.refresh();
        });

        word_list.sort();
        $( "#search-input" ).autocomplete({
            source: word_list,
            response: function( event, ui ) {
                if (ui.content.length == 0) $('#no_results').css('display', 'block');
                else $('#no_results').css('display', 'none');
            },
            select: function(event, ui) {
                graphSearch(ui.item.label);
            },
        });

        s.refresh();

        $("#loading_gif").css({'display': 'none'});

        var checkbox_attributes = ["LemmaID", "Sign Frequency (M)", "Sign Frequency (SD)", "Sign Frequency (Z)", "Sign Frequency (N)", "Percent Unknown", "Sign Frequency (M, Native)", "Sign Frequency (SD, Native)", "Sign Frequency (Z, Native)", "Sign Frequency (N, Native)", "Percent Unknown (Native)", "Gloss Confirmation", "Percent Gloss Agreement", "Percent Gloss Agreement (Native)", "Iconicity (M)", "Iconicity (SD)", "Iconicity (Z)", "Iconicity (N)", "Lexical Class", "Compound", "Initialized", "Fingerspelled Loan Sign", "Sign Onset (ms)", "Sign Offset (ms)", "Sign Length (ms)", "Clip Length (ms)", "Sign Type", "Major Location", "Minor Location", "Selected Fingers", "Flexion", "Movement", "Maximal Neighborhood Density", "Minimal Neighborhood Density", "Parameter-Based Neighborhood Density", "Sign Type Frequency", "Major Location Frequency", "Minor Location Frequency", "Selected Fingers Frequency", "Flexion Frequency", "Movement Frequency", "Handshape Frequency"];

        for (i = 0; i < checkbox_attributes.length; i++) {
            var attribute = checkbox_attributes[i];

            if (attribute.indexOf('original_') > -1) continue;

            $('#jBox-download-grab form#checkbox_container').append("<input type='checkbox' name='checkbox-1' id='checkbox-choice-" + attribute + "' data-toggle='button' checked><label class='btn btn-primary ui-btn' for='checkbox-choice-" + attribute +"'>" + attribute + "</label>");
        }

        $('#jBox-download-grab form#checkbox_container').append("<br /><input type='radio' name='radio-choice-0' id='radio-choice-a' checked><label for='radio-choice-a'>Download All Data</label><input type='radio' name='radio-choice-0' id='radio-choice-b'><label for='radio-choice-b'>Download Filtered Data</label>");

        $('#jBox-download-grab form#checkbox_container').trigger('create');

        $('#select-btn').click(function() {
            $('#jBox-download-grab form#checkbox_container input[type="checkbox"]').checked = true;
            $('#jBox-download-grab form#checkbox_container input[type="checkbox"]').checkboxradio("refresh");
        });

        $('#unselect-btn').click(function() {
            $('#jBox-download-grab form#checkbox_container input[type="checkbox"]').attr('checked', false).checkboxradio("refresh");
        });
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
        height: 150,
        confirmButton: "Submit",
        getTitle: 'data-jbox-title',
        content: $('#jBox-slider-grab'),
        onOpen: function() {
            optionTitle = this.source['0'].dataset['jboxTitle'];
            $('#constraint-A').val(filter_data[optionTitle].valueA);
            $('#constraint-B').val(filter_data[optionTitle].valueB);

            // specify min / max values
            if (filter_data[optionTitle].min == null)
                $('#slider-min').html("-");
            else
                $('#slider-min').html(filter_data[optionTitle].min);

            if (filter_data[optionTitle].max == null)
                $('#slider-min').html("-");
            else
                $('#slider-max').html(filter_data[optionTitle].max);

        }
    });

    categorical_filter = new jBox('Confirm',{
        attach: $('.constrain-btn.categorical'),
        width: 400,
        maxHeight: 300,
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

    popup_download = new jBox('Modal',{
        attach: $('#download-popup'),
        width: 550,
        height: 400,
        confirmButton: 'Download',
        title: 'Download ASLLex Data',
        content: $('#jBox-download-grab'),
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
        var check_boxes = $('#jBox-toggle-grab .btn-group').children();
        filter_data[optionTitle]['allowed'] = [ ];

        for (i = 0; i < check_boxes.length; i++) {
            if (check_boxes[i].children[0].className.indexOf('ui-checkbox-on') > -1) {
                filter_data[optionTitle]['allowed'].push(filter_data[optionTitle]['values'][i]);
            }
        }

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
    var node_count = 0;
    s.graph.nodes().forEach(function(n) {
        for (option in filter_data) {
            // if the option is a boolean
            if (filter_data[option]['type'] == 'boolean') {
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

            // if option is a categorical option
            } else if (filter_data[option]['type'] == 'categorical') {
                var node_value = n['attributes'][option];
                var value_array = filter_data[option]['allowed'];

                if (value_array.length == 0 || value_array.indexOf(String(node_value)) > -1) {
                    n['good-word'] = true;
                    n['color'] = n['attributes']['original_color'];
                    n['size']  = n['attributes']['original_size'];
                } else {
                    n['good-word'] = false;
                    n['color'] = '#D8D8D8';
                    n['size'] = 8;
                    break;
                }

            // if option is a continuous option
            } else if (filter_data[option]['type'] == 'continuous') {
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
        if (n['good-word']) node_count++;
    });

    updateNodeFilterCount(node_count);
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
        if (filter_data[option]['type'] == 'boolean') {
            filter_data[option]['value'] = null;

        } else if (filter_data[option]['type'] == 'categorical') {
            filter_data[option]['allowed'] = [ ];

        } else if (filter_data[option]['type'] == 'continuous') {
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
        if (n['EntryID'] == value && n['good-word'])  refreshData(n);
        else if (n['EntryID'] == value) nodeNotice();
    });
}

function refreshData(node) {
    // clear contents
    $('#data-container p').not('#about-data').remove();
    $('#data-container br').remove();
    $('#about-data').css('display', 'block');

    popup_about_2 = new jBox('Modal',{
        attach: $('#about-data'),
        width: 550,
        height: 400,
        title: "What The Data Means",
        content: $('#jBox-about-data-grab'),
    });

    // set video attributes to show motion
    video_ID  = node['video'];

    if (video_ID == '') {
        $('#word_vid').css('display','none');
    } else {
        videoLink = "https://www.youtube.com/embed/" + video_ID + "?showinfo=0&rel=0&loop=1&modestbranding=1&controls=0";
        $('#word_vid').attr('src', videoLink);
        $('#word_vid').css('display','block');
    }

    // EntryID / Sign Name
    $('#data-container').append('<br /><p>EntryID: ' + node['EntryID'] + '</p><p>LemmaID: ' + node['attributes']['LemmaID'] + '</p>');

    // Sign Frequency
    $('#data-container').append('<br /><p><b>Sign Frequency</b></p>');
    var attribute_list = ['Sign Frequency (M)', 'Sign Frequency (SD)', 'Sign Frequency (Z)', 'Sign Frequency (N)', 'Sign Frequency (M, Native)', 'Sign Frequency (SD, Native)', 'Sign Frequency (Z, Native)', 'Sign Frequency (N, Native)'];
    for (i = 0; i < attribute_list.length; i++) {
        if (node['attributes'][attribute_list[i]] != undefined) {
            $('#data-container').append('<p>' + attribute_list[i] + ': ' + node['attributes'][attribute_list[i]] + '</p>');
        }
    }

    // Iconicity
    $('#data-container').append('<br /><p><b>Iconicity</b></p>');
    var attribute_list = ['Iconicity (M)', 'Iconicity (SD)', 'Iconicity (Z)', 'Iconicity (N)'];
    for (i = 0; i < attribute_list.length; i++) {
        if (node['attributes'][attribute_list[i]] != undefined) {
            $('#data-container').append('<p>' + attribute_list[i] + ': ' + node['attributes'][attribute_list[i]] + '</p>');
        }
    }

    // Lexical Properties
    $('#data-container').append('<br /><p><b>Lexical Properties</b></p>');
    var attribute_list = ['Compound', 'Fingerspelled Loan Sign', 'Lexical Class', 'Initialized'];
    for (i = 0; i < attribute_list.length; i++) {
        if (node['attributes'][attribute_list[i]] != undefined) {
            if (attribute_list[i] == 'Lexical Class') {
                $('#data-container').append('<p>' + attribute_list[i] + ': ' + node['attributes'][attribute_list[i]] + '</p>');
            } else {
                $('#data-container').append('<p>' + attribute_list[i] + ': ' + (node['attributes'][attribute_list[i]] == "0" ? "FALSE" : "TRUE") + '</p>');
            }
        }
    }

    // Phonological Properties
    $('#data-container').append('<br /><p><b>Phonological Properties</b></p>');
    var attribute_list = ['Sign Type', 'Movement', 'Major Location', 'Minor Location', 'Selected Fingers', 'Flexion'];
    for (i = 0; i < attribute_list.length; i++) {
        if (node['attributes'][attribute_list[i]] != undefined) {
            $('#data-container').append('<p>' + attribute_list[i] + ': ' + node['attributes'][attribute_list[i]] + '</p>');
        }
    }

    // Sub-Lexical Frequency
    $('#data-container').append('<br /><p><b>Sub-Lexical Frequency</b></p>');
    var attribute_list = ['Sign Type Frequency', 'Movement Frequency', 'Major Location Frequency', 'Minor Location Frequency', 'Selected Fingers Frequency', 'Flexion Frequency', 'Handshape Frequency'];
    for (i = 0; i < attribute_list.length; i++) {
        if (node['attributes'][attribute_list[i]] != undefined) {
            $('#data-container').append('<p>' + attribute_list[i] + ': ' + node['attributes'][attribute_list[i]] + '</p>');
        }
    }

    // Neighborhood Density
    $('#data-container').append('<br /><p><b>Neighborhood Density</b></p>');
    var attribute_list = ['Minimal Neighborhood Density', 'Maximal Neighborhood Density', 'Parameter-Based Neighborhood Density'];
    for (i = 0; i < attribute_list.length; i++) {
        if (node['attributes'][attribute_list[i]] != undefined) {
            $('#data-container').append('<p>' + attribute_list[i] + ': ' + node['attributes'][attribute_list[i]] + '</p>');
        }
    }

    // Alternative English Translations
    if (node['attributes']['Gloss Confirmation'] != "0") {
        $('#data-container').append('<br /><p><b>Alternative English Translations</b></p>');
        var attribute_list = ['Alternative Glosses', 'Percent Unknown', 'Percent Unknown (Native)', 'Gloss Confirmation', 'Percent Gloss Agreement', 'Percent Gloss Agreement (Native)'];
        for (i = 0; i < attribute_list.length; i++) {
            if (node['attributes'][attribute_list[i]] != undefined) {
                if (attribute_list[i] == "Gloss Confirmation") {
                    $('#data-container').append('<p>' + attribute_list[i] + ': ' + (node['attributes'][attribute_list[i]] == "0" ? "FALSE" : "TRUE") + '</p>');
                } else {
                    $('#data-container').append('<p>' + attribute_list[i] + ': ' + node['attributes'][attribute_list[i]] + '</p>');
                }
            }

        }    
    }
    

    // Video Information
    $('#data-container').append('<br /><p><b>Video Information</b></p>');
    var attribute_list = ['Sign Onset (ms)', 'Sign Offset (ms)', 'Sign Length (ms)', 'Clip Length (ms)'];
    for (i = 0; i < attribute_list.length; i++) {
        $('#data-container').append('<p>' + attribute_list[i] + ': ' + node['attributes'][attribute_list[i]] + '</p>');
    }

    // zooms in on the node being viewed
    sigma.misc.animation.camera(
        s.camera, {
            x: node['read_cam0:x'],
            y: node['read_cam0:y'],
            ratio: 0.20,
        }, {
            duration: s.settings('animationsTime') || 300
    });

    // display the "sign-data" tab
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

function downloadFile() {

    downloader_name = $('#entry_1648166315').val();
    downloader_affiliation = $('#entry_1482297859').val();
    downloader_email = $('#entry_333829021').val();

    if (downloader_name.length > 0 && downloader_affiliation.length > 0 && downloader_email.match(/.*\@.*\./g) != null) {

        download_attr = [ ];

        var options = $('#jBox-download-grab form#checkbox_container .ui-checkbox');

        for (i = 0; i < options.length; i++) {
            var checkbox = options[i];

            if ($($(checkbox).children()[1]).prop('checked')) {
                download_attr.push(options[i].innerText.substring(0, options[i].innerText.length - 1));
            }
        }

        if ($('#radio-choice-a:checked').val() == undefined) setFilteredDownloadLink();
        else setAllDownloadLink();

        // simulate clicking the submit buttons for the google form (sending download information to form)
        // and simulate download button with link
        $('#download_link2')[0].click();
        $('#ss-submit').click();
        
    } else {
        $('#google_form_error').css('display', 'inline');
        setTimeout(function() {
            $('#google_form_error').css('display', 'none');
        }, 2000);
    } 
}

function setFilteredDownloadLink() {

    var link = 'data:application/octet-stream,';
    var valid_nodes = [ ];
    var shift_col_char = '%2C';
    var shift_row_char = '%0A';

    link += 'EntryID' + shift_col_char;

    for (i = 0; i < download_attr.length; i++) {
        link += download_attr[i].replace(",","-");

        if (i != download_attr.length - 1) link += shift_col_char;
        else link += shift_row_char;
    }

    // get non-filtered out signs
    s.graph.nodes().forEach(function(n) {
        if (n['good-word']) valid_nodes.push(n);
    });

    // add data to download_link
    for (i = 0; i < valid_nodes.length; i++) {
        link += valid_nodes[i]['EntryID'] + shift_col_char;
        for (j = 0; j < download_attr.length; j++) {

            link += valid_nodes[i]['attributes'][download_attr[j]];

            if (j != download_attr.length - 1) link += shift_col_char;
        }

        link += shift_row_char;
    }

    $('#download_link2').attr('href',link);
}

function setAllDownloadLink() {

    var link = 'data:application/octet-stream,';
    var valid_nodes = [ ];
    var shift_col_char = '%2C';
    var shift_row_char = '%0A';

    link += 'EntryID' + shift_col_char;

    // make headerline (with attribute titles)
    for (i = 0; i < download_attr.length; i++) {
        link += download_attr[i].replace(",","-");

        if (i != download_attr.length - 1) link += shift_col_char;
        else link += shift_row_char;
    }

    // get non-filtered out signs
    s.graph.nodes().forEach(function(n) {
        valid_nodes.push(n);
    });

    // add data to download_link
    for (i = 0; i < valid_nodes.length; i++) {
        link += valid_nodes[i]['EntryID'] + shift_col_char;
        for (j = 0; j < download_attr.length; j++) {

            link += valid_nodes[i]['attributes'][download_attr[j]];

            if (j != download_attr.length - 1) link += shift_col_char;
        }

        link += shift_row_char;
    }

    $('#download_link2').attr('href',link);
}

function updateNodeFilterCount(node_count) {
    // setting node count
    $('#active_nodes_p span').html(node_count);

    // set active filters
    $('#active_filters_list').html('');
    for (filter in filter_data) {
        data = filter_data[filter];
        if ((data.type == 'continuous' && (data.valueA != null || data.valueB != null)) || (data.type == 'boolean' && data.value != null) || (data.type == 'categorical' && data.allowed.length != 0)) {
            $('#active_filters_list').append('<li>' + filter + '</li>');
        }
    }
    if ($('#active_filters_list').html() != "") {
        $('.active_filters').css({'display': 'initial'});
    } else {
        // don't display active filters
        $('.active_filters').css({'display': 'none'});
    }
}

function showActiveFilters() {
    $('#active_filters_list').toggle();

    if ($('#active_filters_list').is(":visible")) {
        $('#active_filters_arrow').css('-webkit-transform', 'rotate(0)');
        $('#active_filters_arrow').css('-ms-transform', 'rotate(0)');
        $('#active_filters_arrow').css('transform', 'rotate(0)');
    } else {
        $('#active_filters_arrow').css('-webkit-transform', 'rotate(-90deg)');
        $('#active_filters_arrow').css('-ms-transform', 'rotate(-90deg)');
        $('#active_filters_arrow').css('transform', 'rotate(-90deg)');
    }


}
