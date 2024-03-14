const player = document.querySelector(".player");
const videoContainer = document.querySelector(".video-container");
const video = document.querySelector(".video");
const playPauseBtn = document.querySelector(".play-pause");
const fullscreenBtn = document.querySelector(".fullscreen-lowscreen");
const rewindBtn = document.querySelector(".rewind-btn");
const forwardBtn = document.querySelector(".forward-btn");
const currentTime = document.querySelector(".text-time-current");
const remainingTime = document.querySelector(".text-time-remaining");
const progressbar = document.querySelector(".progressbar");
const fillBar = document.querySelector(".progressbar .fillbar");
const barHandle = document.querySelector(".progressbar .barhandle");
const bufferbar = document.querySelector(".bufferbar");
const tooltip = document.querySelector(".tooltip");
const volume = document.querySelector(".volume");
const volumeSection = document.querySelector(".volume-section");
const volumeSlider = document.querySelector(".volume-slider");
const volumeFillBar = document.querySelector(".volume-slider .fillbar");
const volumeBarHandle = document.querySelector(".volume-slider .barhandle");
const quality = document.querySelector(".quality");
const qualityBtn = document.querySelector(".quality-btn");
const qualitySection = document.querySelector(".quality-section");
const qualityList = document.querySelector(".quality-list");
const qualityOption = document.querySelectorAll(".quality-option");
const cc = document.querySelector(".cc");
const ccBtn = document.querySelector(".cc-btn");
const ccOff = document.querySelector('.cc-option.off');
const ccSection = document.querySelector(".cc-section");
const ccList = document.querySelector(".cc-list");
const ccOption = document.querySelectorAll(".cc-option");
const timeText = document.querySelector(".timed-text");
const backBtn = document.querySelector(".back-btn");

const isiPhone = /iPhone/i.test(navigator.userAgent);

// ADD VIDEO
console.log("PLAYER INIT");
// console.log(data);
// // m3u8 play
// var hls = new Hls();
// hls.loadSource(data.url);
// hls.attachMedia(video);
// mp4 play
video.src = data.sources[0].url;
video.play();

let isTouch;
if ("ontouchstart" in window) {
	isTouch = true;
} else {
	isTouch = false;
}

// BACK BTN
backBtn.addEventListener("click", function () {
	location.reload();
});

/********** PLAY PAUSE **********/
// I used mousedown instead of click so then if I click on a div and then drag the mouse
// to the player it wouldn't togglePlay
// Only togglePlay when I first click on the actual player
// If Quality or CC section are active then hide them and don't toggle
player.addEventListener("mousedown", (e) => {
	if (!e.target.closest(".control-btn-container") && !e.target.closest(".timeline")) {
		if (qualitySection.classList.contains("active") || ccSection.classList.contains("active")) {
			hideSections();
		} else {
			!isTouch ? togglePlay() : null;
		}
	}
});

playPauseBtn.addEventListener("click", togglePlay);

video.addEventListener("play", () => {
	player.classList.remove("paused");
});

video.addEventListener("pause", () => {
	player.classList.add("paused");
});

document.addEventListener("keydown", (e) => {
	if (e.code === "Space") {
		togglePlay();
	}
});

function togglePlay() {
	video.paused ? video.play() : video.pause();
}

/********** FULLSCREEN **********/
fullscreenBtn.addEventListener("click", toggleFullScreenMode);

// function toggleFullScreenMode() {
// 	if (document.fullscreenElement == null) {
// 		alert("should");
// 		player.requestFullscreen();
// 	} else if (video.webkitEnterFullscreen) {
// 		alert("saw");
// 		video.webkitEnterFullscreen();
// 	} else {
// 		document.exitFullscreen();
// 	}
// }

// function toggleFullScreenMode() {
// 	if (video.webkitRequestFullscreen) {
// 		video.webkitRequestFullscreen();
// 	}
// }

function toggleFullScreenMode() {
	if (isiPhone) {
		// If the device is an iPhone, enter fullscreen mode for the video
		video.webkitEnterFullscreen();
	} else if (document.fullscreenElement) {
		// Otherwise, if fullscreen mode is already active, exit fullscreen
		document.exitFullscreen();
	} else {
		// Otherwise, enter fullscreen mode for the container
		player.requestFullscreen();
	}
}

document.addEventListener("fullscreenchange", () => {
	player.classList.toggle("fullscreen", document.fullscreenElement);
});

/********** REWIND **********/
rewindBtn.addEventListener("click", () => {
	video.currentTime -= 10;
});

document.addEventListener("keydown", (event) => {
	if (event.code === "ArrowLeft") {
		video.currentTime -= 10;
	}
});

/********** FORWARD **********/
forwardBtn.addEventListener("click", () => {
	video.currentTime += 10;
});

document.addEventListener("keydown", (event) => {
	if (event.code === "ArrowRight") {
		video.currentTime += 10;
	}
});

/********** VIDEO DURATION **********/
video.addEventListener("loadeddata", () => {
	if (isNaN(video.duration) || isNaN(video.currentTime)) {
		return; // don't update the time if duration or current time is invalid
	}
	remainingTime.textContent = formatTime(video.duration);
	// TIMED TEXT HANDLING
	// timedText();
});

/********** CURRENT TIME && REMAINING TIME **********/
video.addEventListener("timeupdate", () => {
	if (isNaN(video.duration) || isNaN(video.currentTime)) {
		return; // don't update the time if duration or current time is invalid
	}
	currentTime.textContent = formatTime(video.currentTime);
	remainingTime.textContent = formatTime(video.duration - video.currentTime);
});

// TIME FORMAT FUNCTION
function formatTime(totalSeconds) {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = Math.floor(totalSeconds % 60);

	let formattedTime = "";

	if (hours > 0) {
		formattedTime += `${hours}:`;
		formattedTime += `${minutes.toString().padStart(2, "0")}:`;
	} else {
		formattedTime += `${minutes}:`;
	}

	formattedTime += `${seconds.toString().padStart(2, "0")}`;

	return formattedTime;
}

/********** PROGRESS BAR **********/

// TOOLTIP
// and I only need it on desktops
// Scrubbing is for both
if (!isTouch) {
	progressbar.addEventListener("mousemove", handleTooltip);
}

function handleTooltip(event) {
	// We use event.clientX - rect.x because offsetX is relative to the target container
	// We want to get offsetX of the progress bar even when out the progress bar
	const rect = progressbar.getBoundingClientRect();
	let documentProgressbarOffsetX;
	if (isTouch) {
		documentProgressbarOffsetX = Math.max(0, event.touches[0].clientX - rect.x);
		// console.log("Touch Handle Tooltip");
	} else {
		documentProgressbarOffsetX = Math.max(0, event.clientX - rect.x);
	}
	const progressbarWidth = rect.width;

	const percent = Math.min(1, Math.max(0, documentProgressbarOffsetX / progressbarWidth));
	const jumpTime = percent * video.duration;

	const progressbarPercentage = percent * 100;

	tooltip.style.left = `calc(${progressbarPercentage}% - 6rem)`;
	const formattedJumpTime = formatTime(jumpTime);
	tooltip.textContent = formattedJumpTime;
}

// JUMP TO

function jumpTo(event) {
	console.log("Jump Request");

	// We use event.clientX - rect.x because offsetX is relative to the target container
	// We want to get offsetX of the progress bar even when out the progress bar
	const rect = progressbar.getBoundingClientRect();
	let documentProgressbarOffsetX;
	if (isTouch) {
		// I have to use changedTouches when attached to touchend
		documentProgressbarOffsetX = Math.max(0, event.changedTouches[0].clientX - rect.x);
	} else {
		documentProgressbarOffsetX = Math.max(0, event.clientX - rect.x);
	}
	const progressbarWidth = rect.width;

	const percent = Math.min(1, Math.max(0, documentProgressbarOffsetX / progressbarWidth));
	const jumpTime = percent * video.duration;
	// fill bar and bar handle
	fillBar.style.width = `${percent * 100}%`;
	barHandle.style.left = `${percent * 100}%`;

	video.currentTime = jumpTime;
}

// FILL BAR AND BAR HANDLE
video.addEventListener("timeupdate", (event) => {
	const progressbarPercentage = (video.currentTime / video.duration) * 100;

	fillBar.style.width = `${progressbarPercentage}%`;
	barHandle.style.left = `${progressbarPercentage}%`;
});

// BUFFER BAR
video.addEventListener("progress", buffer);
video.addEventListener("timeupdate", buffer);

function buffer() {
	// The problem arises when we jump forward then backward into the video
	// video.buffered.end(video.buffered.length - 1) will be the last buffered second
	// To solve this is to get the buffered range that we are currently on
	// We loop from the end to get the buffer that start from less than currentTime
	for (let i = 0; i < video.buffered.length; i++) {
		if (video.buffered.start(video.buffered.length - 1 - i) <= video.currentTime) {
			const bufferedEnd = video.buffered.end(video.buffered.length - 1 - i);
			const duration = video.duration;
			bufferbar.style.width = `${(bufferedEnd / duration) * 100}%`;
			break;
		}
	}
}

// Scrubbing

// I am using mousedown / mousemove / mouseup
// To check if Scrubbing starts only from the progressbar
// And stays valid throughout the document

let isScrubbing = false;
let wasPaused;

if (!isTouch) {
	progressbar.addEventListener("mousedown", function (event) {
		isScrubbing = true;
		wasPaused = video.paused;
		tooltip.classList.add("show");
	});

	// This is shitty but I will just copy paste the function below to support phones
	document.addEventListener("mousemove", function (event) {
		handleTooltip(event);
		if (isScrubbing) {
			video.pause();
			handleProgressbar(event);
			// console.log("SCRUBBING");
		}
	});

	document.addEventListener("mouseup", function (event) {
		if (isScrubbing) {
			jumpTo(event);
			!wasPaused && video.play();
			tooltip.classList.remove("show");
			fillBar.classList.remove("transition");
			barHandle.classList.remove("transition");
			barHandle.classList.remove("scale");
			barHandle.classList.remove("opacity");
		}
		isScrubbing = false;
	});
}

// I just put in a quick fix so the the tooltip wouldn't show up while document touchmove
// can't show the tooltip on touchstart as it will show up for a quick second when I click on the progressbar
if (isTouch) {
	let touchstart;
	// Shitty
	progressbar.addEventListener("touchstart", function (event) {
		isScrubbing = true;
		wasPaused = video.paused;
		touchstart = true;
	});

	// Shitty
	// This is shitty but I will just copy paste the function below to support phones
	document.addEventListener("touchmove", function (event) {
		handleTooltip(event);
		touchstart && tooltip.classList.add("show");

		if (isScrubbing) {
			video.pause();
			handleProgressbar(event);
			// console.log("SCRUBBING");
		}
	});

	// Shitty
	document.addEventListener("touchend", function (event) {
		if (isScrubbing) {
			jumpTo(event);
			!wasPaused && video.play();
			tooltip.classList.remove("show");
			fillBar.classList.remove("transition");
			barHandle.classList.remove("transition");
			barHandle.classList.remove("scale");
			barHandle.classList.remove("opacity");
		}
		isScrubbing = false;
		touchstart = false;
	});
}

// HANDLE PROGRESS FILL BAR AND BAR HANDLE WHEN SCRUBBING
// Progressbar was thought to be super hard but its dumb basic easy
function handleProgressbar(event) {
	// We use event.clientX - rect.x because offsetX is relative to the target container
	// We want to get offsetX of the progress bar even when out the progress bar
	const rect = progressbar.getBoundingClientRect();
	let documentProgressbarOffsetX;
	if (isTouch) {
		documentProgressbarOffsetX = Math.max(0, event.touches[0].clientX - rect.x);
		// console.log("Touch Handle Progress Bar");
	} else {
		documentProgressbarOffsetX = Math.max(0, event.clientX - rect.x);
	}
	const progressbarWidth = rect.width;

	const percent = Math.min(100, Math.max(0, documentProgressbarOffsetX / progressbarWidth) * 100);

	fillBar.classList.add("transition");
	barHandle.classList.add("scale");
	barHandle.classList.add("transition");
	barHandle.classList.add("opacity");

	fillBar.style.width = `${percent}%`;
	barHandle.style.left = `${percent}%`;
}

// VOLUME

// Hide the volume btn when on touch screen devices
if (isTouch) {
	volume.style.opacity = "0";
	volume.style.pointerEvents = "none";
} else {
	volume.style.opacity = "1";
	volume.style.pointerEvents = "auto";
}

let isVolumeScrubbing = false;

volumeSlider.addEventListener("click", (event) => {
	handleVolume(event);
});

volumeSlider.addEventListener("mousedown", () => {
	isVolumeScrubbing = true;
	volumeSection.classList.add("flex");
});

document.addEventListener("mousemove", (event) => {
	if (isVolumeScrubbing) {
		handleVolume(event);
	}
});

document.addEventListener("mouseup", () => {
	isVolumeScrubbing = false;
	volumeSection.classList.remove("flex");
});

function handleVolume(event) {
	const rect = volumeSlider.getBoundingClientRect();
	const position = Math.min(100, Math.max(0, ((event.clientY - rect.top) / volumeSlider.clientHeight) * 100));
	volumeFillBar.style.height = `${position}%`;
	volumeBarHandle.style.top = `calc(${position}% - 2rem)`;
	video.volume = position / 100;
}

video.addEventListener("volumechange", function () {
	volumeFillBar.style.height = `${video.volume * 100}%`;
	volumeBarHandle.style.top = `calc(${video.volume * 100}% - 2rem)`;

	if (video.volume === 0) {
		volume.classList.add("ismute");
		volume.classList.remove("islow", "isup");
	} else if (video.volume > 0 && video.volume < 0.5) {
		volume.classList.add("islow");
		volume.classList.remove("ismute", "isup");
		volume.classList.remove();
	} else {
		volume.classList.add("isup");
		volume.classList.remove("ismute", "islow");
	}
});

let savedVolume = 1;

volume.addEventListener("click", (event) => {
	if (!event.target.closest(".volume-section")) {
		if (video.volume === 0) {
			video.volume = savedVolume;
		} else {
			savedVolume = video.volume;
			video.volume = 0;
		}
	}
});

// QUALITY

// Add available quality sources to qualityList
data.sources.forEach(source => {
	// Create a new p element
	const newSourceOption = document.createElement('p');

	// Set attributes for the p element
	newSourceOption.setAttribute('class', 'quality-option');
	newSourceOption.setAttribute('quality', source.quality);

	// Set the inner text of the p element
	newSourceOption.innerText = source.quality;

	// Append the p element to the .quality-list div
	qualityList.appendChild(newSourceOption);

	// Add an click event listener to all the added sources
	newSourceOption.addEventListener('click', () => handleQualityOption(source, newSourceOption));
});

function handleQualityOption(source, newSourceOption) {
	console.log("OPTION");
	videoCurrentTime = video.currentTime;
	document.querySelectorAll('.quality-option').forEach(option => {
		option.classList.remove('active-quality');
	});
	newSourceOption.classList.add('active-quality');
	video.src = source.url;
	video.load();
	video.currentTime = videoCurrentTime;
	video.play();
}

qualityBtn.addEventListener("click", (event) => {
	ccSection.classList.toggle("active", false);
	qualitySection.classList.toggle("active");
});

let qualityTimeout;

// If the mouse is over quantity don't let it hide
quality.addEventListener("mouseover", () => {
	clearTimeout(qualityTimeout);
});

quality.addEventListener("mouseout", () => {
	qualityTimeout = setTimeout(() => {
		qualitySection.classList.remove("active");
		// console.log("OUUUUUT");
	}, 500);
});

let videoCurrentTime;

// qualityOption.forEach(function (option) {
// 	option.addEventListener("click", function () {

// 		qualityOption.forEach((option) => option.classList.remove("active-quality"));
// 		this.classList.add("active-quality");
// 		// Change video quality
// 		const selectedQuality = this.getAttribute("quality");
// 		for (let i = 0; i < data.sources.length; i++) {
// 			if (data.sources[i].quality == selectedQuality) {
// 				// video.src = data.sources[i].url;
// 				hls.loadSource(data.sources[i].url);
// 				hls.attachMedia(video);
// 				// video.play();
// 				break;
// 			}

// 	});
// });

// CC

// Toggle cc section
ccBtn.addEventListener("click", (event) => {
	qualitySection.classList.toggle("active", false);
	ccSection.classList.toggle("active");
});

let ccTimeout;

cc.addEventListener("mouseover", () => {
	clearTimeout(ccTimeout);
});

cc.addEventListener("mouseout", () => {
	ccTimeout = setTimeout(() => {
		ccSection.classList.remove("active");
		// console.log("OUUUUUT");
	}, 500);
});

// Adjust timed text position
// I used canplaythrough instead of play or loadedmetadata beacause
// canplaythrough fires before play and loadedmetadata isn't reliable
// canplaythrough isn't reliable either
// play is better since captions only show after the video plays
window.addEventListener("resize", function () {
	timedText();
});

let played = false;
video.addEventListener(
	"play",
	function () {
		timedText();
		played = true;
	},
	{ once: true }
);

function timedText() {
	const rect = videoContainer.getBoundingClientRect();
	const viewportHeight = window.innerHeight;
	const distanceToBottom = viewportHeight - rect.bottom;
	const heightPercentage = (distanceToBottom / viewportHeight) * 100;

	if (heightPercentage < 10) {
		console.log(rect.bottom);
		timedTextPercentage = Math.max(5, 10 - heightPercentage);
		timeText.style.bottom = `${timedTextPercentage}%`;
	}
}

// Add available subtitle to ccList
data.subtitles.forEach(subtitle => {
	// Create a new p element
	const newCCOption = document.createElement('p');

	// Set attributes for the p element
	newCCOption.setAttribute('class', 'cc-option');
	newCCOption.setAttribute('srclang', subtitle.lang);
	newCCOption.setAttribute('language', subtitle.lang);

	// Set the inner text of the p element
	newCCOption.innerText = subtitle.lang;

	// Append the p element to the .cc-list div
	ccList.appendChild(newCCOption);

	// Add an click event listener to all the added subtitles
	newCCOption.addEventListener('click', () => handleCCOption(subtitle, newCCOption));
});

// Function to handle the click event on a subtitle element
// Add remove active cc tick and class the cc handle
function handleCCOption(subtitle, newCCOption) {
	console.log("cc clicked")
	document.querySelectorAll('.cc-option').forEach(option => {
		option.classList.remove('active-cc');
	});
	console.log("ticks are hidden and now the new one should be ticked")
	newCCOption.classList.add('active-cc');
	activateCC(subtitle);
}

// Activate CC
// Activating CC was thought to be hard but its dumb easy
function activateCC(subtitle) {
	// Remove the old track
	if (document.querySelector("track")) {
		document.querySelector("track").remove();
		console.log("Track Removed");
	}

	// Making a blob to avoid cross origin problem // easy
	fetch(subtitle.url).then(response => response.text()).then(data => {
		// Convert SRT to VTT
		var vtt = srttovtt(data);

		// Create VTT blob
		var blob = new Blob([vtt], { type: 'text/vtt' });
		var blobURL = URL.createObjectURL(blob);

		// Add new track
		var newTrack = document.createElement("track");
		newTrack.kind = "subtitles";
		newTrack.label = subtitle.lang;
		newTrack.src = blobURL;
		video.appendChild(newTrack);

		// Hide ugly subtitles
		video.textTracks[0].mode = "hidden";
	});

	video.addEventListener('timeupdate', function () {
		var cues = video.textTracks[0].activeCues;
		if (cues.length > 0) {
			timeText.innerHTML = cues[0].text;
		} else {
			timeText.innerText = '';
		}
	});
}

// Disable subtitles when off is clicked
ccOff.addEventListener('click', function () {
	document.querySelectorAll('.cc-option').forEach(option => {
		option.classList.remove('active-cc');
	});
	ccOff.classList.add("active-cc");
	if (document.querySelector("track")) {
		document.querySelector("track").remove();
		timeText.innerText = '';
	}
});

// Function to convert srt to vtt
function srttovtt(srtText) {
	// Replace SRT line breaks with VTT line breaks
	var vttText = srtText.replace(/\r?\n/g, '\r\n');
	// Replace time separator from ',' to '.'
	vttText = vttText.replace(/,/g, '.');
	return "WEBVTT\n\n" + vttText;
}

// SHOW / HIDE CONTROLS
let controlsTimeout;
let touchControlsTimeout;

if (isTouch) {
	player.addEventListener("click", handleTouchControls);
} else {
	player.addEventListener("mousemove", handleControls);
}

function handleTouchControls(e) {
	if (!e.target.closest(".control-btn-container") && !e.target.closest(".timeline")) {
		player.classList.toggle("active-controls");
	}
}

function handleControls(e) {
	clearTimeout(controlsTimeout);
	player.classList.add("active-controls");
	timedText();

	controlsTimeout = setTimeout(function () {
		// only hide controls when sections (CC / Quality) are not active
		if (!qualitySection.classList.contains("active") && !ccSection.classList.contains("active") && !isScrubbing && !e.target.closest(".control-btn-container") && !e.target.closest(".timeline") && played) {
			player.classList.remove("active-controls");
		}
	}, 1500);
}

// Hide Section (Quality / CC)
function hideSections() {
	qualitySection.classList.toggle("active", false);
	ccSection.classList.toggle("active", false);
}
