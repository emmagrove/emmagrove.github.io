$(document).ready(function(){


// SEARCH 
$('#search').on('click', function(){
	$(this).css('visibility' , 'hidden');
	$('.search-overlay').addClass('search-overlay-active');
	$('#menu').hide();
	$('#arrowLeft').fadeIn(100);
	$('.nav-search-input-section').css('display', 'flex').hide().fadeIn(100);
	$('body').css({'overflow': 'hidden'});
	setTimeout(function(){ $('.nav-search-input').focus(); }, 400);
});
$('#arrowLeft , .search-overlay').on('click', function(){
	$('#arrowLeft').hide();
	$('#menu').fadeIn(100);
	$('.nav-search-input-section').fadeOut(100);
	$('#search').css('visibility' , 'unset');
	$('body').css({'overflow': 'unset'});
	$('.search-overlay').removeClass('search-overlay-active');
	$('.nav-search-input').val('');
	$('.search-results').empty();
	$('.search-results-section').fadeOut(100);
	$('.landing, .content').fadeIn(100);
});


// // MOBILE SEARCH
$('#mobileSearch').on('click', function(){
	$('nav').css({'position': 'fixed', 'background-color': '#101011'});
	$('.search-overlay').addClass('search-overlay-active search-overlayMobile');
	$('#menu').hide();
	$('#arrowLeft').fadeIn(100).addClass('arrowLeftMobile');
	$('.nav-search-input-section').css('display', 'flex').hide().addClass('mobile').fadeIn(100);
	$('body').css({'overflow': 'hidden'});
	setTimeout(function(){ $('.nav-search-input').focus(); }, 400);
});
$('#arrowLeft, .search-overlay').on('click', function(){
	if ( $(this).hasClass('arrowLeftMobile') ||  $(this).hasClass('search-overlayMobile')) {
		$('nav').css({'position': 'absolute', 'background-color': 'unset'});
		$('#mobileSearch').css('visibility' , 'unset');
		$('.nav-search-input-section').removeClass('mobile');
	}
});

// SEARCH SECTION ON KEYUP
$('.nav-search-input').on('keyup', function(){
	var search = $(this).val().trim();

	// RETURN IF THE INPUT VAL IS EMPTY ELSE REMOVE OVERLAY AND OVERFLOW
	if (search.length <= 0) {
		$('.search-overlay').addClass('search-overlay-active');
		$('body').css({'overflow': 'hidden'});
		$('.search-results-section').fadeOut(100);
		$('.landing, .content').fadeIn(100);
		return;
	}else{
		$('body').css({'overflow': 'unset'});
		$('.search-overlay').removeClass('search-overlay-active');
		$('.search-results-section').fadeIn(100);
		$('.landing, .content').hide();
	}

	// REQUEST SEARCH DATA
	$.ajax({
		url : 'config/search.json',
		type : 'GET',
		dataType: "JSON",
		beforeSend: function(){
			$('.search-data-spinner').fadeIn(100);
		},
		success: function(response){
			// Just for demonstration puroposes => if the search query is more than 3 letters
			// No results found will be displayed
			var status = search.length;
			$('.noResults').hide();
			if (status < 5) {
				var searchResults = "";
				for (var i = 0; i < response.length; i++) {
					searchResults += `<a href="watch/${response[i]["imdbID"]}"><div class="poster"><img data-src="https://image.tmdb.org/t/p/w300${response[i]["poster"]}" class="lazyload" alt=""></div></a>`;
				}
				$('.search-results').html(searchResults);
			}else{
				$('.search-results').empty();
				$('.noResultsSearch').text(search);
				$('.noResults').css('display', 'flex').hide().fadeIn(100);
			}
		},
		complete : function(){
			$('.search-data-spinner').fadeOut(100);
		}
	});

});
    
// SIDEBAR
$('#menu').on('click', function(){
	$('.sideBar-overlay').addClass('sideBar-overlay-active');
	$('.sideBar').addClass('sideBar-active');
});
$('.sideBar-close , .sideBar-overlay , .sideBar-logo').on('click', function(e){
	e.preventDefault();
	$('.sideBar-overlay').removeClass('sideBar-overlay-active');
	$('.sideBar').removeClass('sideBar-active');
});



// WATCH TRAILER

// PLAY TRAILER BUTTON ON CLICK
$('.playTrailer').on('click', function(){
	$('.trailerSection').addClass('active');
	trailer.playVideo();
});

// CLOSE TRAILER BUTTON ON CLICK
$('#closeTrailer').on('click', function(){
	$('.trailerSection').removeClass('active');
	trailer.pauseVideo();
});

});
