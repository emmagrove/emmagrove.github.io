let data;
let isReady = false;
let isPlayRequested = false;
let isNoVideo = false;
$(document).ready(function () {
	const tmdbID = window.location.href.split("/").pop().match(/\d+/g).join("");
	var apiData;
	// REQUEST AND SHOW MOVIE DATA WITH TMDBID
	$.ajax({
		url: "https://api.themoviedb.org/3/movie/" + tmdbID + "?api_key=e47a385fbe50d749ea94bcb4ef1e0fe9&language=en-US",
		type: "GET",
		dataType: "JSON",
		beforeSend: function () {
			console.log("Page not ready yet");
		},
		success: function (tmdbResult) {
			var title = tmdbResult["title"];
			var year = tmdbResult["release_date"].split("-")[0];
			var posterPath = tmdbResult["poster_path"];
			var backdropPath = tmdbResult["backdrop_path"];
			var overview = tmdbResult["overview"];
			var genres = tmdbResult.genres.map((genre) => genre.name);
			var rating = tmdbResult["vote_average"];

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

			/* Getting Video Trial */
			$.ajax({
				url: "https://api.themoviedb.org/3/movie/" + tmdbID + "/videos?api_key=e47a385fbe50d749ea94bcb4ef1e0fe9&language=en-US",
				dataType: "json",
				success: function (trialLinks) {
					$("#trailer").attr("src", "https://www.youtube.com/embed/" + trialLinks.results[0].key + "?enablejsapi=1")
				}
			});

			/* Getting Streaming Links */
			$.ajax({
				url: "https://flixquest-api.vercel.app/showbox/watch-movie?tmdbId=" + tmdbID,
				dataType: "json",
				success: function (apiStreamingLinks) {
					console.log(apiStreamingLinks);
					apiData = apiStreamingLinks;
					isReady = true;
					isPlayRequested && loadPlayer();
				},
				error: function (xhr, status, error) {
					console.error("Error occurred while fetching streaming links:", error);
					console.log("erroooooooooooooooor")
					if (isPlayRequested) $("#videoNotFound").css("display", "flex").fadeIn(300);
					isNoVideo = true;
				}
			});
		},
		complete: function () {
			console.log("Page ready");
		},
	});

	// Load Player
	$("#play-movie").on("click", function () {
		loadPlayer();
	});
	// Load Player Function
	function loadPlayer() {

		if (isNoVideo) $("#videoNotFound").css("display", "flex").fadeIn(300);

		if (!isReady) {
			$("#videoBeingLoaded").css("display", "flex").fadeIn(300);
			console.log("Streaming links still loading");
			isPlayRequested = true;
			return;
		}
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