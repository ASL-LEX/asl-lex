$(document).ready(function(){

  //appending phonological card
  var source = $('#phonological_card').html(); 
  var template = Handlebars.compile(source);  
  $("#phonological").append(template( { phonological_types: filters_data.phonological } ));

  //appending sign frequency card
  var source = $('#sign_frequency_card').html(); 
  var template = Handlebars.compile(source); 
  $("#sign_frequency").append(template({ sign_frequency_types: filters_data.sign_frequency }));

});