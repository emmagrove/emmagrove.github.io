$(document).ready(function(){


// OWL CAROUSEL
// FOR DISPLAYING THE MOVIES IN THE HOME PAGE
	
$('.section').owlCarousel({
	loop: false,
	margin: 15,
	nav: false,
	dots: false,
	responsive: {
		0: {
			items: 2,
			slideBy: 2
		},
		415: {
			items: 3,
			slideBy: 3
		},
		577: {
			items: 4,
			slideBy: 4
		},
		769: {
			items: 5,
			slideBy: 5
		},
		993: {
			items: 6,
			slideBy: 6
		},
		1201: {
			items: 7,
			slideBy: 7
		},
		1441: {
			items: 8,
			slideBy: 8
		},
	}
});

// CAROUSEL NEXT & PREV
$('.angleLeft').on('click', function(){
	var section = $(this).parent().parent().next();
	section.trigger('prev.owl.carousel');
});
$('.angleRight').on('click', function(){
	var section = $(this).parent().parent().next();
	section.trigger('next.owl.carousel');
});

// DETECT THE START & THE END OF THE SLIDER
$('.section').on('changed.owl.carousel', function(e) {

	var angleLeft   = $(this).prev().find('.angleLeft');
	var angleRight   = $(this).prev().find('.angleRight');
	var items     = e.item.count;     // Number of items
	var item      = e.item.index;     // Position of the current item
	var size      = e.page.size;      // Number of items per page

	if (item === 0) {
		angleLeft.addClass('angle-disabled');
	}else{
		angleLeft.removeClass('angle-disabled');
	}

	if ((items - item) === size) {
		angleRight.addClass('angle-disabled');
	}else{
		angleRight.removeClass('angle-disabled');
	}

});



});