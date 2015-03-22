var optionTitle = '';
var ASL_data = [ ];

$(document).ready(function() {
    // declare new graph
    s = new sigma('sigma-container');

    // set graph settings
    s.settings({
        sideMargin: 10,
        labelThreshold: 10,
        eventsEnabled: true,
        edgeColor: "default"
    });

    s.bind('clickNode',function() {
        console.log('clicked');
    }).refresh();

    $.ajax({
        url: "http://localhost:3000/getNodes",
    }).done(function(data) {
        for (node_i = 0; node_i < data.length; node_i++) {
            var node = data[node_i];
            node['id'] = String(node['id']);
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

    s.graph.nodes().forEach(function(n) {
        for (option in filter_data) {
            var node_value = n['attributes'][option];
            valA = filter_data[option].valueA;
            valB = filter_data[option].valueB;

            if ((valA == null || node_value >= valA) &&
                (valB == null || node_value <= valB)) {
                n['color'] = n['attributes']['original_color'];
                n['size']  = n['attributes']['original_size'];
            } else {
                n['color'] = '#D8D8D8';
                n['size'] = 20;
                break;
            }
        }  
    });

    s.refresh();
}

function updateGraph() {
    for (i = 0; i < sigma_data['nodes'].length; i++) {
    	if (word_data[sigma_data['nodes'][i]['label']]['good-word']) {
    	    sigma_data['nodes'][i]['color'] = '#77bdee';
    	    sigma_data['nodes'][i]['size'] = "2";
    	} else {
    	    sigma_data['nodes'][i]['color'] = '#000000';
    	    sigma_data['nodes'][i]['size'] = "1";
    	}
    }

    s.graph.clear();

    // add all of the nodes
    for (i = 0; i < sigma_data['nodes'].length; i++) {
        s.graph.addNode(sigma_data['nodes'][i]);
    }

    // add all of the edges
    for (i = 0; i < sigma_data['edges'].length; i++) {
	s.graph.addEdge(sigma_data['edges'][i]);
    }
 
    s.refresh(); 
}

function checkFilter() {
   for (word in word_data) {
       var word_obj = word_data[word];
       for (key in filter_data) {
           // take out this line once all keys are filled in
           if (word_obj[key] == null) break;

	   if ((filter_data[key].valueA == null || word_obj[key] >= filter_data[key].valueA) &&
               (filter_data[key].valueB == null || word_obj[key] <= filter_data[key].valueB)) {
               word_data[word]['good-word'] = true;
           } else {
               word_data[word]['good-word'] = false;
               break;
           }
       }
   }
}
