const video = document.querySelector('video');
const videoContainer = document.getElementById('videoContainer');
const playBtn = document.getElementById('play');
const playBtnIcon = playBtn.querySelector('i');
const muteBtn = document.getElementById('mute');
const muteBtnIcon = muteBtn.querySelector('i');
const volumeRange = document.getElementById('volume');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const timeline = document.getElementById('timeline');
const fullScreenBtn = document.getElementById('fullScreen');
const fullScreenIcon = fullScreenBtn.querySelector('i');
const videoControls = document.getElementById('videoControls');

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlay = (event) => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? 'fas fa-play' : 'fas fa-pause';
};

const handleMute = () => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted
        ? 'fas fa-volume-mute'
        : 'fas fa-volume-up';
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;

    if (video.muted) {
        video.muted = false;
        muteBtnIcon.classList = 'fas fa-volume-up';
    } else if (value === '0') {
        video.muted = true;
        muteBtnIcon.classList = 'fas fa-volume-mute';
    }
    volumeValue = value;
    video.volume = volumeValue;
};

const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substr(14, 5);

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handleTimeline = (event) => {
    const {
        target: { value },
    } = event;
    video.currentTime = value;
};

const handleFullScreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
        document.exitFullscreen();
        fullScreenIcon.classList = 'fas fa-expand';
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = 'fas fa-compress';
    }
};

const hideControls = () => videoControls.classList.remove('showing');

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add('showing');
    controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
};

const handleEnded = () => {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, { method: 'POST' });
};

playBtn.addEventListener('click', handlePlay);
muteBtn.addEventListener('click', handleMute);
fullScreenBtn.addEventListener('click', handleFullScreen);
volumeRange.addEventListener('input', handleVolumeChange);
video.addEventListener('loadeddata', handleLoadedMetadata);
video.addEventListener('timeupdate', handleTimeUpdate);
video.addEventListener('ended', handleEnded);
timeline.addEventListener('input', handleTimeline);
videoContainer.addEventListener('mousemove', handleMouseMove);
videoContainer.addEventListener('mouseleave', handleMouseLeave);
