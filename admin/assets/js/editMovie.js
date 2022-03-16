$(document).ready(function(){

// GENERATE VAL OF GENRES INPUT
function genresDelimiter(){
	var genres = '';
	$('.genre').children('span').each( function() {
		if ( $(this).hasClass('active-genre') ) {
			genres += $(this).attr('data-genre') + ',';
		}
	});
	var genres = genres.slice(0, -1);
	$('[name="genres"]').val(genres);
}

// TOGGLE active-genre CLASS ON GENRE CLICK
$('[data-genre]').on('click', function(){
	$(this).toggleClass('active-genre');
	genresDelimiter();
});

// EDIT POSTER PREVIEW
$('[name="poster"]').on('change', function(){
	var poster = $(this).val();
	var posterURL 		= `https://image.tmdb.org/t/p/w154${poster}`;
	$('#posterPreview').attr('src', posterURL);
});

// EDIT BACKDROP PREVIEW
$('[name="backdrop"]').on('change', function(){
	var backdrop = $(this).val();
	var backdropURL 		= `https://image.tmdb.org/t/p/w400${backdrop}`;
	$('#backdropPreview').attr('src', backdropURL);
});

// GRAB MOVIE DATA ON QUICK EDIT CLICK
$('.edit-btn').on('click', function(){

	var find = $('#find').val().trim();

	if (find.length < 2) {
		return;
	}

	$.ajax({
		url : 'editMovie/grabEditMovie.php',
		type : 'GET',
		data : {
			'find' : find
		},
		dataType: "JSON",
		beforeSend: function(){
			$('.add-movie-spinner').fadeIn(100);
		},
		success: function(response){

			if (response == 1) {
				$('.status.error span').text('Movie Not Found');
				$('.status.error').css('display', 'flex').hide().fadeIn(200);
				return;
			}

			var id 				= response['id'];
			var imdbID 			= response['imdbID'];
			var title 			= response['title'];
			var year 			= response['year'];
			var rate 			= response['rate'];
			var views 	  		= response['views'];
			var releaseDate 	= response['releaseDate'];
			var overview 		= response['overview'];
			var poster 			= response['poster'];
			var backdrop 		= response['backdrop'];
			var trailer 		= response['trailer'];
			var tceng 			= response['tceng'];
			var tcara 			= response['tcara'];
			var videoID 		= response['video'];
			var genres 			= response['genre'];

			var posterURL 		= `https://image.tmdb.org/t/p/w154${poster}`;
			var backdropURL 	= `https://image.tmdb.org/t/p/w400${backdrop}`;

			$('#posterPreview').attr('src', posterURL);
			$('#backdropPreview').attr('src', backdropURL);

			for (const genre of genres) {
				$(`[data-genre="${genre}"]`).addClass('active-genre');
			}

			genresDelimiter();

			$('[name="id"]').val(id);
			$('[name="imdbID"]').val(imdbID);
			$('[name="title"]').val(title);
			$('[name="year"]').val(year);
			$('[name="rate"]').val(rate);
			$('[name="views"]').val(views);
			$('[name="releaseDate"]').val(releaseDate);
			$('[name="overview"]').val(overview);
			$('[name="poster"]').val(poster);
			$('[name="backdrop"]').val(backdrop);
			$('[name="trailer"]').val(trailer);
			$('[name="tceng"]').val(tceng);
			$('[name="tcara"]').val(tcara);
			$('[name="video"]').val(videoID);


			$('.add').css('display', 'grid').hide().fadeIn(200);
			$('#deleteMovie').fadeIn(200);
		},
		complete : function(){
			$('.add-movie-spinner').hide();
		}
	});

});


// DELETE MOVIE - SHOW CONFIRM POPUP
$('#deleteMovie').on('click', function(){
	$('.status.delete').css('display', 'flex').hide().fadeIn(200);
});
// DELETE MOVIE
$('#confirmDelete').on('click', function(){
	$.ajax({
		url : 'editMovie/deleteMovie.php',
		type : 'POST',
		data : {
			'id' : $('[name="id"]').val(),
			'deleteMovie' : true,
		},
		success: function(response){
			if (response == 1) {
				$('.status.success span').text('Movie Successfully Deleted');
				$('.status.success').css('display', 'flex').hide().fadeIn(200);
			}else{
				$('.status.error').css('display', 'flex').hide().fadeIn(200);
			}
		},
		complete : function(){}
	});
});


});