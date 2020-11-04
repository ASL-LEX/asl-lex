
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
          return "Sign Unknown (%)";
        if (name === "duration")
          return "Duration (ms)";
        if (name === "phonological_probability")
          return "Phonological Calculations";
        if (name === "aoa")
            return "Age of Acquisition";
        if (name === "dom_translation_agreement")
            return "Dominant Translation Agreement"
    }); 

    Handlebars.registerHelper("concate", function(string1, string2) {     
       return string1+string2;
    });

    Handlebars.registerHelper("topLevelDefinition", function(name) {
        if (name === "phonological")
            return "Information about the phonological components of signs";
        if (name === "sign_frequency")
            return "Information about subjective estimates of frequency";
        if (name === "lexical")
            return "Information about other lexical properties of signs";
        if (name === "iconicity")
            return "Information about subjective estimates of sign iconicity";
        if (name === "unknown_percentage")
            return "Percentage of participants who did not know or recognize the sign";
        if (name === "duration")
            return "Sign or clip duration in milliseconds\n";
        if (name === "phonological_probability")
            return "Information about the number of phonologically similar signs (neighbors) in the lexicon";
        if (name === "aoa")
            return "The age (in months) at which a sign is expected to be acquired as predicted using a Bayesian Model, see Caselli, Lieberman, & Pyers (2020)";
        if (name === "dom_translation_agreement")
            return "Proportion agreement with the dominant English gloss among all deaf ASL signers"
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