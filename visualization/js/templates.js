
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
        if (name === "unknown_percentage")
          return "Unknown Percentage";
        if (name === "duration")
          return "Duration";
        if (name === "phonological_probability")
          return "Phonological Probability";

    }); 

    Handlebars.registerHelper("concate", function(string1, string2) {     
       return string1+string2;
    });

    Handlebars.registerHelper("topLevelDefinition", function(name) {
        if (name === "phonological")
            return "Phonological Properties definition";
        if (name === "sign_frequency")
            return "Frequency Properties definition";
        if (name === "lexical")
            return "Lexical Properties definition";
        if (name === "iconicity")
            return "Iconicity Properties definition";
        if (name === "unknown_percentage")
            return "Unknown Percentage definition";
        if (name === "duration")
            return "Duration definition";
        if (name === "phonological_probability")
            return "Phonological Probability definition";
    });

  //append nested collapsible to filter dropdown section 
  var source = $('#filters_options').html(); 
  var template = Handlebars.compile(source); 
  $("#filter").append(template({ filters_data: filters_data}));
  
  //Initializing jquery range sliders 
  for (let category in filters_data) {
    for(let subcategory of filters_data[category]) {      
      if (subcategory["type"] == "range") {
        let min = parseInt(subcategory["range"]["min_value"]);
        let max = parseInt(subcategory["range"]["max_value"]);
        let slider_id = "#" + subcategory["range"]["slider_id"];
        let label_id = "#" + subcategory["range"]["slider_label_id"];
        $( slider_id ).slider({
          range: true,
          min: min,
          max: max,
          step: 0.5,
          values: [ min, max],
          slide: function( event, ui ) {           
            $(label_id).text("Min: " + ui.values[ 0 ] + " - Max: " + ui.values[ 1 ]).css({ 'font-weight': 'bold' });
          }
        });
        $(label_id).text( "Min: " + $(slider_id).slider( "values", 0 ) + " - Max: " + $(slider_id).slider( "values", 1 ) ).css({ 'font-weight': 'bold' });                
      }
    }
  } 

});