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
      result.push([attrib, constraints[attrib]['true'], constraints[attrib]['false']]);
    }
  }
  return result;
}

function processNumericalAttribs(numericalColumns, constraints) {
  let result = [];
  for (attrib in constraints) {
    if (numericalColumns.indexOf(attrib) != -1) {      
      result.push([attrib, constraints[attrib]['min'], constraints[attrib]['max']]);
    }
  }
  return result;
}

function getCategoricalAttribsDict(categoricalColumns, constraints) {
  let categoricalDict = {};
  for (attrib of categoricalColumns) {
    categoricalDict[attrib] = constraints[attrib];
  }
  return categoricalDict;
}

function processCateogricalData(numColumnsPerRow, categoricalDict) {
  result = []    
  columnCounter = 0;
  categoricalDataPerRow = {}  
  for(key in categoricalDict) {      
      columnCounter++;       
      categoricalDataPerRow[key] = categoricalDict[key];      
      if (columnCounter == numColumnsPerRow) {
        result.push(categoricalDataPerRow);
        columnCounter = 0;
        categoricalDataPerRow = {}  
      }
  }
  if (columnCounter != 0) {
    result.push(categoricalDataPerRow);  
  }
  return result; 
}



$(document).ready(function(){
  

  let constraints = JSON.parse(localStorage.getItem("constraints"));
  const [categorical,numerical,boolean] = getAttributeLists(constraints);

  let booleanColumns = [{title: 'Property'},{title: 'True'}, {title: 'False'}];
  let booleanData = processBooleanAttribs(boolean, constraints);  
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
  let categoricalData = processCateogricalData(numColumnsPerRow, categoricalDict) 

  //append nested collapsible to filter dropdown section 
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

});