$(document).ready(function () {
    const genreID = window.location.href.split("/").pop().match(/\d+/g).join("");
    console.log(genreID);
    let currentPage = 1;
    const totalPages = 25; // Assuming a maximum of 10 pages for demonstration, you can adjust this as needed

    function getByGenre(genre, divID) {
        $.ajax({
            url: `https://api.themoviedb.org/3/discover/movie?api_key=e47a385fbe50d749ea94bcb4ef1e0fe9&language=en-US&sort_by=popularity.desc&page=${currentPage}&with_genres=${genre}`,
            type: 'GET',
            dataType: "JSON",
            success: function (response) {
                response.results.forEach((result, index) => {
                    document.getElementById(divID).innerHTML += `<a href="watch/movie/${result["id"]}"><div class="poster"><img data-src="https://image.tmdb.org/t/p/w400/${result["poster_path"]}" class="lazyload" alt=""><div class="poster-hover"><svg><use xlink:href="assets/img/landing.svg#play"></use></svg></div></div></a>`;
                });
                currentPage++;
            }
        });
    }

    function loadMoreContent() {
        console.log("Scroll detected");
        // Check if reached the bottom of the page
        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
            console.log("get new page")
            if (currentPage <= totalPages) {
                getByGenre(genreID, "genreContent");
            }
        }
    }

    // Initial load
    getByGenre(genreID, "genreContent");

    // Scroll event listener
    $(window).scroll(loadMoreContent);
});
