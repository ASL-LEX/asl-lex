var optionTitle = '';

$(document).ready(function() {
    populateTable();

    i = 0;
    for (word in word_data) {
        sigma_data['nodes'][i]['label'] = word;
        i += 1;
    }

    // declare new graph
    s = new sigma('sigma-container');

    // set graph settings
    s.settings({
        sideMargin: 3,
        labelThreshold: 10,
        eventsEnabled: true,
    	edgeColor: "default"
    });

    populateTable();
    updateGraph();

    s.bind('clickNode',function() {
	    console.log('clicked');
    }).refresh();

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

    checkFilter();
    populateTable(); // replace this function with sigma based highlighting fxn
    updateGraph();
}

// used to populate table to test filtering
function populateTable() {
    // clear current table
    $('#test-table').find("tr:not(:first)").remove();

    // add each word as row into table
    for (word in word_data) {
       var word_obj = word_data[word];
       var row_string = "<tr>";

       // checks if it is valid word (based on current filtering)
       if (word_obj["good-word"]) row_string += "<td class='good-word'>" + word + "</td>";
       else row_string += "<td class='bad-word'>" + word + "</td>";

       // adds column for each value in data array (except good-word)
       for (value in word_obj) {
           if (value != 'good-word') row_string += "<td>" + word_obj[value] + "</td>";
       }

       // ends string and adds to table
       row_string += "</tr>";
       $('#test-table tr:last').after(row_string);
    }
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
