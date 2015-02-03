
$(document).ready(function() {
    $('.constrain-btn').jBox('Confirm',{
        attach: $('.constrain-btn'),
        getTitle: 'data-jbox-title',
        content: $('#jBox-slider-grab'),
        width: 350,
        height: 100,
        confirmButton: "Submit"
    });
});

function confirm() {
    console.log($('#range-A').val());
    console.log($('#range-B').val());
}