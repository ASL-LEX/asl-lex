// LOADER
$(window).on('load', function(){
  setTimeout(removeLoader, 50); //wait for page load PLUS less than 1 second.
});
function removeLoader(){
  $( "#loadingDiv" ).fadeOut(500, function() {
    // fadeOut complete. Remove the loading div
    $( "#loadingDiv" ).remove(); //makes page more lightweight
  });
};

function getAttributeLists(constraints) {
    let categorical = [];
    let numerical = [];
    let boolean = [];
    for (key in constraints) {
      if ('min' in constraints[key]) {
        numerical.push(key);
      }
      else if ('false' in constraints[key]) {
        boolean.push(key);   
      }
      else {
        categorical.push(key);
      }
    }
    return [categorical,numerical,boolean];
}

function processBooleanAttribs(booleanColumns, constraints) {
  let result = [];
  for (attrib in constraints) {
    if (booleanColumns.indexOf(attrib) != -1) {
      displayName = (property_display_names.hasOwnProperty(attrib))? property_display_names[attrib]: attrib;       
      result.push([displayName, constraints[attrib]['true'], constraints[attrib]['false']]);
    }
  }
  return result;
}

function processNumericalAttribs(numericalColumns, constraints) {
  let result = [];
  for (attrib in constraints) {
    if (numericalColumns.indexOf(attrib) != -1) {
      displayName = (property_display_names.hasOwnProperty(attrib))? property_display_names[attrib]: attrib;        
      result.push([displayName, constraints[attrib]['min'], constraints[attrib]['max']]);
    }
  }
  return result;
}


function getCategoricalAttribsDict(categoricalColumns, constraints) {
  const property_strings_to_split = ['SignType.2.0', 'SignTypeM2.2.0', 'SecondMinorLocationM2.2.0', 'MovementM2.2.0', 'MinorLocationM2.2.0', 'MinorLocation.2.0', 'Flexion.2.0', 'NonDominantHandshape.2.0', 'SecondMinorLocation.2.0', 'Movement.2.0', 'ThumbPosition.2.0', 'SignTypeM3.2.0'];
  let categoricalDict = {};  
  for (attrib of categoricalColumns) { 
    if (property_strings_to_split.includes(attrib)) {
      let newObj = {};
      for (key in constraints[attrib]) {                
        newObj[key.split(/(?=[A-Z])/).join(" ")] = constraints[attrib][key] 
      }
      constraints[attrib] = newObj;
    }   
    categoricalDict[attrib] = constraints[attrib];
  }
  return categoricalDict;
}

function processCateogricalData(numColumnsPerRow, categoricalDict) {
  let result = [];   
  let columnCounter = 0;
  let categoricalDataPerRow = {};  
  for(key in categoricalDict) {      
      columnCounter++;       
      categoricalDataPerRow[property_display_names[key]] = categoricalDict[key];      
      if (columnCounter === numColumnsPerRow) {
        result.push(categoricalDataPerRow);
        columnCounter = 0;
        categoricalDataPerRow = {}; 
      }
  }
  if (columnCounter != 0) {
    result.push(categoricalDataPerRow);  
  }
  return result; 
}

function appendFilters(filters) { 
  let isActive = false;  
  for (key in filters) {
    isActive = true;    
    let value = "";
    if (filters[key]["type"] === "categorical") {      
      value = filters[key]["values"].join(",");      
    }
    else if (filters[key]["type"] === "range") {
      value = "Min: " + filters[key]["range"]["min"] + ", Max: " + 
              filters[key]["range"]["max"];
    }
    else if (filters[key]["type"] === "boolean") {
      value = filters[key]["values"] === 1 ? "True":"False";      
    }
    $("#filters").append("<p style='text-align:center;'>" + filters[key]["label_name"] + ": " + value + "</p>");
  } 
  if (!isActive) {
    $("#filters h4").append("No active filters");
  } 
}



$(document).ready(function(){ 

  let constraints = JSON.parse(localStorage.getItem("constraints"));
  let filters = JSON.parse(localStorage.getItem("filters"));   
  const [categorical,numerical,boolean] = getAttributeLists(constraints);

  let booleanColumns = [{title: 'Property'},{title: 'True'}, {title: 'False'}];
  let booleanData = processBooleanAttribs(boolean, constraints); 

  appendFilters(filters);
  $('#boolean_table').DataTable({
    data: booleanData,
    columns: booleanColumns,           
    dom: 'Blfrtip',
    paging: false,
    buttons: [                
      'csv', 'excel'              
    ]      
  });

  let numericalColumns = [{title: 'Property'},{title: 'Min'}, {title: 'Max'}];
  let numericalData = processNumericalAttribs(numerical, constraints);  
  $('#numerical_table').DataTable({
    data: numericalData,
    columns: numericalColumns,           
    dom: 'Blfrtip',
    paging: false,
    buttons: [                
      'csv', 'excel'              
    ]      
  });

  const numColumnsPerRow = 3;
  let categoricalDict = getCategoricalAttribsDict(categorical,constraints);
  let categoricalData = processCateogricalData(numColumnsPerRow, categoricalDict); 

  //append categorical tables 
  let source = $('#categorical_table').html(); 
  let template = Handlebars.compile(source); 
  $("#categorical_section").append(template({ categoricalData:categoricalData}));

  $('.categorical-table').DataTable({               
    dom: 'Blfrtip',
    paging: false,
    buttons: [                
      'csv', 'excel'              
    ]      
  });
  
  window.onbeforeunload = function() {
    localStorage.removeItem('constraints');
    return '';
  };
  window.onload = function(){
    $("#numericalTable")[0].click();
    $("#categoricalTable")[0].click();
  }

});
