$(document).ready(function(){


//********** BURGER **********//
$('[to]').click(function(){
    var to = $(this).attr('to');
    $('html, body').animate({
        scrollTop: $('#'+to).offset().top - 30
    }, 1000);
});


//********** BURGER **********//
$('.burger').click(function(){
	$(this).toggleClass("open");
	$("#sidebar").toggleClass("sidebar_active");
});

//********** MORPHEXT **********//
$("#who_am_i").Morphext({
	animation: "bounceIn",
	separator: ",",
	speed: 3000,
	complete: function () {}
});


//********** COUNTER UP **********//
$('.fact_num').counterUp({
    delay: 10,
    time: 2000
});

//********** OWL CAROUSEL **********//

$('.owl-carousel').owlCarousel({
    items : 1,
    loop: true,
    nav: false,
    autoplay: true,
    autoplayTimeout: 10000,
    autoplaySpeed: 1000,
    dotsSpeed: 1000,
    slideTransition: 'ease'
});

//********** PLAN PRICING **********//
$(".first_plan , .last_plan").hover(function(){
    $(this).addClass('focus_plan');
    $(".popular_plan").addClass('unfocus_plan');
    }, function(){
    $(this).removeClass('focus_plan');
    $(".popular_plan").removeClass('unfocus_plan');
});

//********** CONTACT **********//
$("#name, #email, #msg").focus(function(){
    $(this).next().fadeOut(100);
});

$("#name").blur(function(){
    if (check_name()) {
        $(this).removeClass('contact_fail');
        $(this).addClass('contact_success');
        $(this).next().fadeOut(100);
    }else{
        $(this).removeClass('contact_success');
        $(this).addClass('contact_fail');
        $(this).next().fadeIn(100);
    }
});

$("#email").blur(function(){
    if (check_email()) {
        $(this).removeClass('contact_fail');
        $(this).addClass('contact_success');
        $(this).next().fadeOut(100);
    }else{
        $(this).removeClass('contact_success');
        $(this).addClass('contact_fail');
        $(this).next().fadeIn(100);
    }
});

$("#msg").blur(function(){
    if (check_msg() == 'ok') {
        $(this).removeClass('contact_fail');
        $(this).addClass('contact_success');
        $(this).next().fadeOut(100);
    }else{
        if (check_msg() == 'blank') {
            $(this).next().html('Message can\'t be blank.');
        }else if (check_msg() == 'too_short') {
            $(this).next().html('Message is too short (minimum is 3 characters).');
        }else{
            $(this).next().html('Message is too long.');
        }
        $(this).removeClass('contact_success');
        $(this).addClass('contact_fail');
        $(this).next().fadeIn(100);
    }
});

$("#contact_btn").on('click', function(){
    if (!check_name() || !check_email() || check_msg() != 'ok') {
        $("#name, #email, #msg").blur();
    }else{
        $("#contact_popup").fadeIn(200);
    }
});

$("#popup_close").on('click', function(){
    $("#name, #email, #msg").val("").removeClass();
    $("*#input_error").hide();
    $("#contact_popup").fadeOut(200);
});

});