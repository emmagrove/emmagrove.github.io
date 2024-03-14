let data;
let isReady = false;
let isPlayRequested = false;
$(document).ready(function () {
	const tmdbID = window.location.href.split("/").pop().match(/\d+/g).join("");
	var apiData;
	// REQUEST AND SHOW MOVIE DATA WITH TMDBID
	$.ajax({
		url: "https://api.themoviedb.org/3/tv/" + tmdbID + "?api_key=e47a385fbe50d749ea94bcb4ef1e0fe9&language=en-US",
		type: "GET",
		dataType: "JSON",
		beforeSend: function () {
			console.log("Page not ready yet");
		},
		success: function (tmdbResult) {
			var title = tmdbResult["name"];
			var year = tmdbResult["first_air_date"].split("-")[0];
			var posterPath = tmdbResult["poster_path"];
			var backdropPath = tmdbResult["backdrop_path"];
			var overview = tmdbResult["overview"];
			var genres = tmdbResult.genres.map((genre) => genre.name);
			var rating = tmdbResult["vote_average"];
			var seasonsNumber = tmdbResult["number_of_seasons"];

			$(".title").text(title);
			$(".year").text(year);
			$(".poster .ratio-img").attr("src", "https://www.themoviedb.org/t/p/w400" + posterPath);
			$(".backdrop .ratio-img").attr("src", "https://www.themoviedb.org/t/p/w1280" + backdropPath);
			$(".overview").text(overview);
			$('.rating span').text(rating.toFixed(1));

			for (var i = 0; i < Math.min(genres.length, 4); i++) {
				var span = $("<span></span>").text(genres[i]);
				$(".genres").append(span);
			}
			for (var i = 1; i <= seasonsNumber; i++) {
				var seasonOption = $('<div class="season-option">Season ' + i + '</div>');
				$('.season-list').append(seasonOption);
			}

			/* Getting Video Trial */
			$.ajax({
				url: "https://api.themoviedb.org/3/tv/" + tmdbID + "/videos?api_key=e47a385fbe50d749ea94bcb4ef1e0fe9&language=en-US",
				dataType: "json",
				success: function (trialLinks) {
					$("#trailer").attr("src", "https://www.youtube.com/embed/" + trialLinks.results[0].key + "?enablejsapi=1")
				},
			});

			/* Create episode html */
			function createEpisode(episode) {
				return `
					<div class="episode">
						<div class="episode-number">${episode.episode_number}</div>
						<div class="episode-image">
							<img src="https://media.themoviedb.org/t/p/w454_and_h254_bestv2/${episode.still_path}" class="lazyload" alt="">
						</div>
						<div class="episode-details">
							<div class="episode-details-head">
								<div class="episode-title"><span class="episode-number-smallscreen">${episode.episode_number}. </span>${episode.name}</div>
								<div class="episode-duration">${episode.runtime}m</div>
							</div>
							<div class="episode-overview">${episode.overview.substr(0, 200) + "..."}</div>
						</div>
					</div>
				`
			}
			/* Function that takes season number and output it */
			function printEpisodes(seasonNumber) {
				$('.episodes').empty()
				$.ajax({
					url: "https://api.themoviedb.org/3/tv/" + tmdbID + "/season/" + seasonNumber + "?api_key=e47a385fbe50d749ea94bcb4ef1e0fe9&language=en-US",
					dataType: "json",
					success: function (season) {
						season.episodes.forEach(episode => {
							$('.episodes').append(createEpisode(episode));
						});
					},
				});
			}

			// Show first season episodes
			printEpisodes(1);

			// Change season and show episodes
			$('.season-list').on('click', '.season-option', function () {
				var seasonId = $(this).text().split(' ')[1];
				$('.selected-season').text('Season ' + seasonId);
				printEpisodes(seasonId)
			});
		},
		complete: function () {
			console.log("Page ready");
		},
	});

	// Play first episode
	$("#play-movie").on("click", function () {
		$("#videoBeingLoaded").css("display", "flex").fadeIn(300);
		/* Getting Streaming Links */
		$.ajax({
			url: "https://flixquest-api.vercel.app/showbox/watch-tv?tmdbId=" + tmdbID + "&season=1&episode=1",
			dataType: "json",
			success: function (apiStreamingLinks) {
				apiData = apiStreamingLinks;
				loadPlayer();
			},
			error: function (xhr, status, error) {
				console.error("Error occurred while fetching streaming links:", error);
				$("#videoNotFound").css("display", "flex").fadeIn(300);
			}
		});
	});

	// Play chosen episode
	$('.episodes').on('click', '.episode', function () {
		// Show that things are being loaded
		$("#videoBeingLoaded").css("display", "flex").fadeIn(300);
		// Extract season and episode number
		var seasonNumber = $('.selected-season').text().split(' ')[1];
		var episodeNumber = $(this).find('.episode-number').text();
		console.log('S' + seasonNumber + 'E' + episodeNumber);
		/* Getting Streaming Links */
		$.ajax({
			url: "https://flixquest-api.vercel.app/showbox/watch-tv?tmdbId=" + tmdbID + "&season=" + seasonNumber + "&episode=" + episodeNumber,
			dataType: "json",
			success: function (apiStreamingLinks) {
				console.log(apiStreamingLinks);
				apiData = apiStreamingLinks;
				loadPlayer();
			},
			error: function (xhr, status, error) {
				console.error("Error occurred while fetching streaming links:", error);
				$("#videoNotFound").css("display", "flex").fadeIn(300);
			}
		});
	});

	// Load Player Function
	function loadPlayer() {
		$("#videoBeingLoaded").fadeOut(300);
		$.get("player/index.html", function (player) {
			document.open();
			document.write(player);
			document.close();
			/* Page is Player Now */

			// process apiData
			data = apiData;

			// apply JS
			var script = document.createElement("script");
			script.src = "../../player/player.js";
			document.head.appendChild(script);
		});
	}
});