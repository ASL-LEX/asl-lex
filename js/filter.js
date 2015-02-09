var data = {
        'ASL Frequency (M)': {
        	valueA: null,
		valueB: null 
        }, 'ASL Frequency (Z)': {
        	valueA: null,
		valueB: null
        }, 'ASL Frequency (SD)': {
		valueA: null,
		valueB: null
        }, 'Sign Type': {
        	valueA: null,
		valueB: null
        }, 'Selected Fingers': {
		valueA: null,
		valueB: null
        }, 'Flexion': {
        	valueA: null,
		valueB: null
        }, 'Major Location': {
		valueA: null,
		valueB: null
        }, 'Minor Location': {
        	valueA: null,
		valueB: null
        }, 'Movement': {
		valueA: null,
		valueB: null
        }, 'Iconicity (M)': {
        	valueA: null,
		valueB: null
        }, 'Iconicity (Z)': {
		valueA: null,
		valueB: null
        }, 'Iconicity (SD)': {
        	valueA: null,
		valueB: null
        }, 'Part of Speech': {
		valueA: null,
		valueB: null
	}	
};

var optionTitle = '';

$(document).ready(function() {
    popup_A = new jBox('Confirm',{
        attach: $('.constrain-btn'),
        width: 350,
        height: 100,
        confirmButton: "Submit",
        onOpen: function() {
                optionTitle = this.source['0'].dataset['jboxTitle'];
                $('#constraint-A').val(data[optionTitle].valueA);
                $('#constraint-B').val(data[optionTitle].valueB);
        },
        getTitle: 'data-jbox-title',
        content: $('#jBox-slider-grab')
    });
});

function confirm() {
    // need to validate data
    data[optionTitle].valueA = $('#constraint-A').val();
    data[optionTitle].valueB = $('#constraint-B').val();
}
