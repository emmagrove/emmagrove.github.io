$(document).ready(function(){

/*
** INITIALIZE VIDEO
*/
const video = document.querySelector('video');
const flxplayer = $('.flxplayer')[0];
const videoDuration = Math.round(video.duration);


/*
** GLOBAL USED FUNCTIONS
*/


// FUNCTION TO OPEN FULLSCREEN MODE
function openFullscreen() {
	if (flxplayer.requestFullscreen) {
		flxplayer.requestFullscreen();
	}else if (flxplayer.mozRequestFullScreen) { /* Firefox */
		flxplayer.mozRequestFullScreen();
	}else if (flxplayer.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
		flxplayer.webkitRequestFullscreen();
	}else if (flxplayer.msRequestFullscreen) { /* IE/Edge */
		flxplayer = window.top.flxplayer.body; //To break out of frame in IE
		flxplayer.msRequestFullscreen();
	}
}
// FUNCTION TO CLOSE FULLSCREEN MODE
function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	}else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	}else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		window.top.document.msExitFullscreen();
	}
}
// FUNCTION TO CORRECT CALCULATED CURRENT TIME
function getOffsetXcorrection(clickedPosition, fullWidth, thumbWidth) {
	// The middle is the 0% correction point
	let middle = fullWidth / 2

	// The "error" always is about half the thumb width
	let halfThumbWidth = thumbWidth / 2

	// So where occured the click in that context?
	let percentageFromMiddle = (middle - clickedPosition) / middle

	// Return the correction about the click position to use in a "linear" calculation
	let correction = percentageFromMiddle * halfThumbWidth
	return Math.round(correction)
}
// FUNCTION TO HIDE ALL CONTROLS
function hideControls() {
	$('.bottom-controls, .goback-leftArrow').fadeOut(500);
	$('.flxplayer').addClass('hide-cursor');
	movedownSub();
}
// FUNCTION TO SHOW ALL CONTROLS
function showControls() {
	$('.bottom-controls, .goback-leftArrow').fadeIn(500);
	$('.flxplayer').removeClass('hide-cursor');
	resetSubPosition();
}
// FUNCTION TO MOVE DOWN THE SUBTITLES WHEN THE CONTROLS ARE HIDDEN
function movedownSub() {
	$('.custom-subtitle').addClass('movedown-sub');
}
// FUNCTION TO MOVE DOWN THE SUBTITLES WHEN THE CONTROLS ARE HIDDEN
function resetSubPosition() {
	$('.custom-subtitle').removeClass('movedown-sub');
}



/*
** HIDE THE CONTROLS WHEN NO ACTION
*/
var timeout = null;
$('.flxplayer').on('mousemove', function() {
	clearTimeout(timeout);

	// DO NOT HIDE CONTROLS IF ONE OF THE CONTROLS IS HOVERED
	if($(".progressbar-duration:hover , .btncontrol-cn:hover").length != 0){ return; }
	
	showControls();

	// HIDE THE CONTROLS IF THE MOUSE DID NOT MOVE FOR 5 SECONDS
	timeout = setTimeout(function() {
    	hideControls();
    }, 2500);
});



/*
** SHOW LOADING SPINNER WHEN THE VIDEO IS BUFFERING
*/
var spinnerTimeout = null;
$('video').on('waiting', function() {
	spinnerTimeout = setTimeout(function(){
		$('.loading-spinner').css({'opacity':'1'});
	}, 1000);
});
$('video').on('playing', function() {
	clearTimeout(spinnerTimeout);
	$('.loading-spinner').css({'opacity':'0'});
});


/*
** CHANGES ON TIME UPDATE
*/
// APPLY CHANGES ON TIME UPDATE
$('video').on('timeupdate', function(e) {
	const videoDuration = Math.round(video.duration);
	const currentTime = Math.round(video.currentTime);
	const remainingTime = Math.round(videoDuration - currentTime);
	const playedProgress = (currentTime / videoDuration) * 100;
	// CHANGE PLAYED PROGRESS
	$('.progress-thumb').css("background", `linear-gradient(to right, #e50914 0%, #e50914 ${playedProgress}%, transparent ${playedProgress}%, transparent 100%)`);
	// CHANGE THUMB POSITION BY CHANGING ITS VALUE
	$('.progress-thumb').val(currentTime);
	$('.video-duration').text(hhmmss(remainingTime));
});

// APPLY CHANGES ON VIDEO RANGE INPUT
$('#videoRange').on('input', function(e) {
	if ($(this).attr('skipto')) {
		var currentTime = parseInt($(this).attr('skipto'));
	}else{
		var currentTime = $(this).val();
	}
	const videoDuration = Math.round(video.duration);
	const playedProgress = (currentTime / videoDuration) * 100;
	// CHANGE PLAYED PROGRESS
	$('.progress-thumb').css("background", `linear-gradient(to right, #e50914 0%, #e50914 ${playedProgress}%, transparent ${playedProgress}%, transparent 100%)`);
	// CHANGE CURRENT TIME TO THE TIME CHOOSED
	video.currentTime = currentTime;
});

// SHOW TOOLTIP ON MOUSEMOVE
// https://stackoverflow.com/questions/66353504/html5-video-player-progress-bar-accurate-tooltip/
$('#videoRange').on('mousemove mouseleave', function(e) {
	const videoDuration = Math.round(video.duration);
	var tooltipHalfWidth = $('.tooltip').outerWidth() / 2;
	var width = $(this).width();
	/* The code is a corrector for the calculated currentTime */
	/* This code is only to get the correct calculatedValue */
	let thumbCorrection = getOffsetXcorrection(e.offsetX, width, 20);
	// Using that "thumb correction" in the basic intuitive calculation anyone would expect
	let clickedKnotch = (e.offsetX - thumbCorrection) / width;
	// The demo outputs
	var calculatedValue = Math.round(clickedKnotch * videoDuration)

	if (calculatedValue < 0) calculatedValue = 0;
	if (calculatedValue > videoDuration) calculatedValue = videoDuration;

	// set the calculated time in seconds to skipto attr
	$(this).attr("skipto", calculatedValue);
	// update tooltip text
	$('.tp-text').text(hhmmss(calculatedValue));
	// calculate the left percentage
	var calcTooltipLeftPercentage = (calculatedValue / videoDuration) * 100;
	// change played progress
	var x = Math.round((e.offsetX / $(this).width()) * videoDuration) / videoDuration * 100

	// stopping the tooltip from getting outside the toolbar
	if (e.offsetX < tooltipHalfWidth) {
		$('.tooltip').css("left", `0`).addClass('tp-active');
	}else if ((width - e.offsetX) < tooltipHalfWidth) {
		$('.tooltip').css("left", `calc(100% - ${tooltipHalfWidth*2}px)`).addClass('tp-active');
	}else{
		$('.tooltip').css("left", `calc(${x}% - ${tooltipHalfWidth}px)`).addClass('tp-active');
	}

	if (e.type === "mouseleave") $(".tooltip").removeClass("tp-active");


});



/*
** VIDEO BUFFERING
*/
// I'm adding a little trick here to check if it's the first time playing the video
var firstPlay = true;
$('video').on('progress', function() {
	// trick
	if (firstPlay) {
		firstPlay = false;
		$('.progress-thumb').attr('max', videoDuration);
	}
	// end of the trick
    var duration =  video.duration;
    if (duration > 0) {
      for (var i = 0; i < video.buffered.length; i++) {
            if (video.buffered.start(video.buffered.length - 1 - i) < video.currentTime) {
                $('.progress-buffered').css('width', ((video.buffered.end(video.buffered.length - 1 - i) / duration) * 100) + '%');
                break;
            }
        }
    }
});


/*
** PLAY & PAUSE THE VIDEO
** IF THE VIDEO IS PLAYING PAUSE IT VICE VERSA
*/
var isPlaying = false;
$('.cn-play-pause').on('click', function(){
	if (!isPlaying) {
		video.play();
		$(".playBtn, .pauseBtn").toggleClass("hideThisControl");
		isPlaying = true;
	}else{
		video.pause();
		$(".playBtn, .pauseBtn").toggleClass("hideThisControl");
		isPlaying = false;
	}
});
/*
** PLAY & PAUSE THE VIDEO CLICKING ANYWHERE
*/
$('.flxplayer').on('click', function(e){
	if($(e.target).closest('.bottom-controls').length > 0) { return;}
	$('.cn-play-pause').trigger('click');
});



/*
** REWIND THE VIDEO 10 SECONDS
*/
$('.cn-rewind').on('click', function(){
	video.currentTime -= 10;
});
/*
** FORWARD THE VIDEO 10 SECONDS
*/
$('.cn-forward').on('click', function(){
	video.currentTime += 10;
});


/*
** SHOW VOLUME RANGE SECTION ON VOLUME BTN HOVER
** HIDE THE VIDEO PROGRESS BAR
** CHANGE THE VOLUME ICON AND VALUE
*/
// SHOW VOLUME RANGE SECTION ON VOLUME BTN HOVER
$('.cn-volume').hover(function(){
	$('.progressbar-duration').hide();
	$('.volumeRange-cn').addClass('volumeRange-active');
}, function(){
	$('.volumeRange-cn').removeClass('volumeRange-active');
	$('.progressbar-duration').fadeIn(100);
});
// CHANGE THE VOLUME ICON AND VALUE
$('.volumeRange').on('input', function() {
	var volumeValue = parseInt( $(this).val() * 100);
	$(this).css("background", "linear-gradient(to right, #e50914 0%, #e50914 " + volumeValue + "%, #5b5b5b " + volumeValue + "%, #5b5b5b 100%)");
	video.volume = $(this).val();
	if (volumeValue > 66) {
		$('.volumeBtn').hide();
		$('.volumeMaxBtn').show();
	}else if (volumeValue <= 66 && volumeValue > 33) {
		$('.volumeBtn').hide();
		$('.volumeMediumBtn').show();
	}else if (volumeValue <= 33 && volumeValue > 0) {
		$('.volumeBtn').hide();
		$('.volumeLowBtn').show();
	}else if (volumeValue === 0) {
		$('.volumeBtn').hide();
		$('.volumeMutedBtn').show();
	}
});


/*
** SUBTITLES
*/
// SHOW SUBTITLES SECTION ON SUBTITLES BTN HOVER
$('.cn-subtitles').hover(function(){
	$('.progressbar-duration').hide();
	$('.subtitles-section').addClass('subtitles-active');
}, function(){
	$('.subtitles-section').removeClass('subtitles-active');
	$('.progressbar-duration').fadeIn(100);
});


/*
** FULLSCREEN & LOWSCREEN THE VIDEO
** IF LOWSCREEN THEN FULLSCREEN IT VICE VERSA
*/
// TOGGLE FULLSCREEN MODE
var isFullscreen = false;
$('.cn-fullscreen-lowscreen').on('click', function(){
	if (!isFullscreen) {
		openFullscreen();
	}else{
		closeFullscreen();
	}
});
// TOGGLE FULLSCREEN ICON & BOOLEAN VALUE
$(document).on('fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange', function(){
	isFullscreen = !isFullscreen;
	$(".fullscreenBtn, .lowscreenBtn").toggleClass("hideThisControl");
});



/*
** KEYBOARD SHORTCUTS
*/
$(document).on('keyup', function(event) {
	var key = event.code;
	switch (key) {
	case 'Space':
		$('.cn-play-pause').trigger('click');
		break;
	case 'ArrowLeft':
		$('.rewindBtn').trigger('click');
		break;
	case 'ArrowRight':
		$('.forwardBtn').trigger('click');
		break;
	case 'KeyF':
		$('.cn-fullscreen-lowscreen').trigger('click');
		break;
	}
});




/*
** SUBTITLES
** HIDING BUILT-IN SUBTITLES AND CREATING OUR OWN
** BEACUSE BUILT-IN SUBTITLES ARE HARD TO STYLE
*/

// For things to work first of all we need to turn off all the subtitles
for (var i = 0; i < video.textTracks.length; i++) {
   video.textTracks[i].mode = 'hidden'; // must occur before cues is retrieved
}

// Bind anenter onexit function on every cue
function activateSub(i) {
	var cues = video.textTracks[i].cues;
    for (var j in cues) {
		var cue = cues[j];
		cue.onenter = function() { $('.custom-subtitle').html(this.text); }
		cue.onexit = function() { $('.custom-subtitle').html(''); }
    }
}

// Unbind all onenter onexit on all subtitles cues
function unbindAllSubs() {
	for (var i = 0; i < video.textTracks.length; i++) {
		var cues = video.textTracks[i].cues;
	    for (var j in cues) {
			var cue = cues[j];
			cue.onenter = "";
			cue.onexit = "";
	    }
	}
}


// SELECT SUBTITLE
$('.sub').on('click', function() {

	$('.sub').removeClass('active-sub');
	$(this).addClass('active-sub');

	// Hide all the subtitles then if chosen it will be showen
	$('.custom-subtitle').hide();

	// Unbind all subtitles
	unbindAllSubs();

	// Stop here if the clicked btn is the sub-off
	if ($(this).hasClass('sub-off')) return;

	$('.custom-subtitle').show();
	var textTrackNum = parseInt( $(this).attr('texttracknum') );
	activateSub(textTrackNum);

	$('#subtitle-section').fadeOut(200);
	$('.video-progress').css("display", "flex").hide().fadeIn(200);

});




});


/*** 
 * This code is outside of the document.ready funtion because sometimes 
 * The loadedmetadata fires before the document.ready
 * thus the loadedmetadata function won't work
 * ***/

// FUNCTION TO FORMAT TIME TO HH:MM:SS
function hhmmss(seconds){
	var hours = Math.floor(seconds / 3600);
	var minutes = Math.floor( (seconds - (hours * 3600)) / 60 );
	var seconds = Math.floor( seconds - ((hours * 3600) + (minutes * 60)) );

	if (minutes < 10) minutes = '0' + minutes;
	if (seconds < 10) seconds = '0' + seconds;

	if (!hours) {
		if (minutes == '00') {
			return '0:' + seconds;
		}else{
			return minutes.toString().replace(/^0+/, '') + ':' + seconds;
		}
	}else{
		return hours.toString().replace(/^0+/, '') + ':' + minutes + ':' + seconds;
	}
}

/*
** CHANGE THE TOTAL VIDEO DURATION HH:MM:SS
** CHANGE THE PROGRESS BAR MAX VALUE
*/
var vid = document.getElementById("video");
	vid.onloadedmetadata = function() {
	const videoDuration = Math.round(video.duration);
	const videoDurationFormated = hhmmss(videoDuration);

	$('.video-duration').text(videoDurationFormated);
	$('.progress-thumb').attr('max', videoDuration);
}