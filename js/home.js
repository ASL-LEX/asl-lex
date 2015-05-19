function window_resize() {
    $('.multiview').width($(window).width() - $('#visualization_pic').width() - 50);
}

$(document).ready(function() {

    $(window).resize(function() {
        window_resize();
    });

    $('.multiview_menu li:nth-of-type(1)').click(function() {
        $('.multiview_content').css('display', 'none');
        $('.multiview_content#about').css('display', 'block');
        $('.multiview_menu li').css('border-bottom', 'none')
        $(this).css('border-bottom', '2px #4186C9 solid');
    });

    $('.multiview_menu li:nth-of-type(2)').click(function() {
        $('.multiview_content').css('display', 'none');
        $('.multiview_content#instructions').css('display', 'block');
        $('.multiview_menu li').css('border-bottom', 'none')
        $(this).css('border-bottom', '2px #4186C9 solid');
    });

    $('.multiview_menu li:nth-of-type(3)').click(function() {
        $('.multiview_content').css('display', 'none');
        $('.multiview_content#contact').css('display', 'block');
        $('.multiview_menu li').css('border-bottom', 'none')
        $(this).css('border-bottom', '2px #4186C9 solid');
    });

    $('.multiview_menu li:nth-of-type(4)').click(function() {
        $('.multiview_content').css('display', 'none');
        $('.multiview_content#thanks').css('display', 'block');
        $('.multiview_menu li').css('border-bottom', 'none')
        $(this).css('border-bottom', '2px #4186C9 solid');
    });
});