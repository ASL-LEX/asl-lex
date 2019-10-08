
$(document).ready(function(){

    Handlebars.registerHelper("sliderDefault", function(minValue, maxValue) {  
        return ((parseInt(minValue, 10) + parseInt(maxValue,10))/2);  
    }); 

    Handlebars.registerHelper("filterLabel", function(name) {  
        if (name === "phonological") 
            return "Phonological Properties";
        if (name === "sign_frequency")
        	return "Frequency Properties";
        if (name === "lexical")
        	return "Lexical Properties";
        if (name === "iconicity")
        	return "Iconicity Properties";
        if (name === "density")
        	return "Neighborhood Density";

    }); 

  //append nested collapsible to filter dropdown section 
  var source = $('#filters_options').html(); 
  var template = Handlebars.compile(source); 
  $("#filter").append(template({ filters_data: filters_data}));

});