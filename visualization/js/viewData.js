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

function getFilteredNodesProps(graphCodes, sign_props, attributes) {
    let hashed_props = hashSignProps(sign_props);
    let result = [];    
    for (code of graphCodes) {        
        if (hashed_props[code]) {                      
            result.push(processPropRecord(hashed_props[code], attributes));
        }   
    }
    return result;
}

function processPropRecord(propertyObj, attributes) {  
  let result = [];
  for (key in propertyObj) {
    if (attributes.indexOf(key) != -1) {
      if (propertyObj[key]) {
        result.push(propertyObj[key]);
      }
      else {
         result.push('null') 
      }
    }
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

$(document).ready(function(){

  let gCodes = localStorage.getItem("gCodes");
  gCodes = gCodes.split(',');
  let properties = [];  
  const sign_prop_promise = $.getJSON('data/sign_props.json', function(signProperties) {
    properties = signProperties;    
  });

  sign_prop_promise.then(
    function (fulfilled) {  
        
        let attributes = [];
        for (key in properties[0]){
          if (key !== 'video')
            attributes.push(key); 
        }
        properties = (getFilteredNodesProps(gCodes, properties, attributes));
        let columns = [];
        for (attr of attributes) {
          columns.push({title: attr});
        }
        $('#datatable').DataTable( {
          data: properties,
          columns: columns,           
          dom: 'Blfrtip',
          buttons: [                
            'csv', 'excel'              
          ]      
        });                 
    }, function (err) {
        console.log(err)
    }
  );

  window.onbeforeunload = function() {
    localStorage.removeItem('gCodes');
    return '';
  };

});
