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
  result = [];
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
  //$('.datatable').DataTable();
  /*$('.datatable').DataTable({
        "paging":true,
        "lengthMenu": [[20, 50, 100, -1], [20, 50, 100, "All"]],
        "searching": true,        
        "dom": 'Blfrtip',
        "buttons": [                
            'csv', 'excel'              
        ]                     
  }); */

  let gCodes = localStorage.getItem("gCodes");
  gCodes = gCodes.split(',') 
  let properties = [];  
  const sign_prop_promise = $.getJSON('data/sign_props.json', function(signProperties) {
    properties = signProperties;    
  });

  sign_prop_promise.then(
    function (fulfilled) {
        
        /*let attributes = ['EntryID','LemmaID','PercentUnknown','SignLength(ms)','ClipLength(ms)', 'Handshape.2.0',
                'NonDominantHandshape.2.0','MarkedHandshape.2.0','FlexionChange.2.0',
                'Spread.2.0', 'SpreadChange.2.0', 'ThumbPosition.2.0', 'ThumbContact.2.0', 'SignType.2.0',
                'SelectedFingers.2.0', 'Flexion.2.0', 'MajorLocation.2.0','MinorLocation.2.0',
                'SecondMinorLocation.2.0', 'Movement.2.0', 'RepeatedMovement.2.0','Contact.2.0','UlnarRotation.2.0',
                'LexicalClass', 'Compound.2.0', 'Initialized.2.0', 'FingerspelledLoanSign.2.0'];*/
        let attributes = []
        for (key in properties[0]){
          if (key != 'video') 
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