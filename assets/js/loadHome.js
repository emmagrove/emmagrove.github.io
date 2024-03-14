$(document).ready(function () {


    // TRENDING SECTION
    //  <a href="watch"><div class="poster"><img data-src="https://image.tmdb.org/t/p/w400/8tABCBpzu3mZbzMB3sRzMEHEvJi.jpg" class="lazyload" alt=""><div class="poster-hover"><svg><use xlink:href="assets/img/landing.svg#play"></use></svg></div></div></a>
    // REQUEST SEARCH DATA
    // $.ajax({
    // 	url: 'https://api.themoviedb.org/3/trending/all/day?api_key=e47a385fbe50d749ea94bcb4ef1e0fe9&language=en-US&query=' + search + '&page=1&include_adult=false',
    // 	type: 'GET',
    // 	dataType: "JSON",
    // 	success: function (response) {
    // 		response.results.forEach(result => {
    // 			document.getElementById('trending').innerHTML += `<a href="${result["id"]}"><div class="poster"><img data-src="https://image.tmdb.org/t/p/w400/${result["poster_path"]}" class="lazyload" alt=""><div class="poster-hover"><svg><use xlink:href="assets/img/landing.svg#play"></use></svg></div></div></a>`;
    // 		});
    // 	}
    // });
    // $.ajax({
    // 	url: 'https://api.themoviedb.org/3/trending/all/week?api_key=e47a385fbe50d749ea94bcb4ef1e0fe9',
    // 	type: 'GET',
    // 	dataType: "JSON",
    // 	success: function (response) {
    // 		const trending = document.getElementById('trending');
    // 		const posters = trending.querySelectorAll('.poster');
    // 		console.log(response)

    // 		response.results.forEach((result, index) => {
    // 			console.log("poster")
    // 			const posterPath = `https://image.tmdb.org/t/p/w400/${result["poster_path"]}`;
    // 			const anchor = posters[index].closest('a');
    // 			const img = posters[index].querySelector('img');

    // 			anchor.href = "watch/" + result["media_type"] + "/" + result["id"];
    // 			console.log(anchor.href)
    // 			img.setAttribute('data-src', posterPath);
    // 		});
    // 	}
    // });

    function loadby(type, value, divID) {
        let url;
        if (type == "path") {
            console.log("path")
            url = 'https://api.themoviedb.org/3/' + value + '?api_key=e47a385fbe50d749ea94bcb4ef1e0fe9';
        } else if (type == "genre") {
            console.log("genre")
            url = 'https://api.themoviedb.org/3/discover/movie?api_key=e47a385fbe50d749ea94bcb4ef1e0fe9&language=en-US&sort_by=popularity.desc&page=1&with_genres=' + value;
        }
        console.log(url)
        $.ajax({
            url: url,
            type: 'GET',
            dataType: "JSON",
            success: function (response) {
                const greyPosters = document.getElementById(divID).querySelectorAll('.poster');
                response.results.forEach((result, index) => {
                    if (!greyPosters[index]) return; // Check if grey poster element exists
                    const newPoster = `https://image.tmdb.org/t/p/w400/${result["poster_path"]}`;
                    greyPosters[index].closest('a').href = "watch/movie/" + result["id"];
                    greyPosters[index].querySelector('img').classList.add('lazyload');
                    greyPosters[index].querySelector('img').setAttribute('data-src', newPoster);
                });
            }
        });
    }

    loadby("path", "trending/all/week", "trending")
    loadby("genre", "28,12", "actionadventure")
    loadby("genre", "14", "fantasy")
    loadby("genre", "27", "horror")
    loadby("genre", "10749", "romance")
    loadby("genre", "53", "thriller")
    // getByGenre(28, "action")
    // getByGenre(12, "adventure")
    // getByGenre(16, "animation")
    // getByGenre(35, "comedy")
    // getByGenre(80, "crime")
    // getByGenre(18, "drama")
    // getByGenre(14, "fantasy")
    // getByGenre(27, "horror")
    // getByGenre(9648, "mystery")
    // getByGenre(10749, "romance")
    // getByGenre(878, "scifi")
    // getByGenre(53, "thriller")


});