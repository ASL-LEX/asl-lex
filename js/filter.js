var optionTitle = '';
var ASL_data = [ ];

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
        
        if (node['good-word']) {
            $('#data-container').html('');
            $('#data-container').append('<p>Word: ' + node['label'] + '</p>');
            
            for (attribute in node['attributes']) {
                if (attribute.indexOf('original') === -1)
                    $('#data-container').append('<p>' + attribute + ': ' + node['attributes'][attribute] + '</p>');
            }

            $('.tabs li').removeClass('selected');
            $('#filter-container, #about-container').css('display','none');
            $('#data-tab').addClass('selected');
            $('#data-container').css('display','block'); 
            
        }  
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
        url: "http://localhost:3000/getNodes",
    }).done(function(data) {
        for (node_i = 0; node_i < data.length; node_i++) {
            var node = data[node_i];
            node['id'] = String(node['id']);
            node['good-word'] = true;
            s.graph.addNode(node);
        }
        s.refresh();
    });

    $.ajax({
        url: "http://localhost:3000/getEdges",
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

    popup_A = new jBox('Confirm',{
        attach: $('.constrain-btn'),
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

    popup_about = new jBox('Modal',{
        attach: $('#about-container a'),
        width: 350,
        height: 300,
        title: 'About ASLLex',
        content: $('#jBox-about-grab')
    });
});

// function run when user presses submit on a constrain popup
function confirm() {
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

    updateNodes();
    updateEdges();

    s.refresh();
}

function updateNodes() {
    s.graph.nodes().forEach(function(n) {
        for (option in filter_data) {
            var node_value = n['attributes'][option];
            valA = filter_data[option].valueA;
            valB = filter_data[option].valueB;
      //       if (valA != null || valB != null) console.log(valA, valB);

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
        filter_data[option]['valueA'] = null;
        filter_data[option]['valueB'] = null
    }

    updateNodes();
    updateEdges();

    s.refresh();
}
